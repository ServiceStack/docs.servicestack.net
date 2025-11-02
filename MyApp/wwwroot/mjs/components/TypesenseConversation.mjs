import { ref, nextTick, onMounted, watch } from 'vue'
import { renderMarkdown, htmlEncode } from "../../lib/mjs/markdown.mjs" 

const collection = 'typesense_docs'
const BaseUrl = "https://search.docs.servicestack.net";
const H = {
    search: {
        "accept": "application/json",
        "x-typesense-api-key": "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"
    },
}

async function post(url, body, opt = null) {
    opt ??= {}
    opt.method = "POST"
    opt.body = typeof body != 'string' 
        ? JSON.stringify(body) 
        : body
    return await get(url, opt)
}

async function put(url, body, opt = null) {
    opt ??= {}
    opt.method = "PUT"
    opt.body = typeof body != 'string' 
        ? JSON.stringify(body) 
        : body
    return await get(url, opt)
}

async function get(url, opt=null) {
    opt ??= {}
    opt.headers = opt.headers ?? H.search
    // console.log(url.toString(), opt)
    const r = await fetch(url.toString(), opt)
    if (!r.ok) {
        const errorBody = await r.text()
        const errorMessage = `${r.status} ${r.statusText}` + (errorBody ? `\n${errorBody}` : '')
        throw new Error(errorMessage);
    }
    return await r.json()
}

function clean(s) {
    if (s == null) return null
    return s.replace(/&ZeroWidthSpace/g, '')
        //.replace(/\s+/g, ' ')
        .trim()
}

async function multiSearch(message, conversationId = null) {
    const url = new URL(`${BaseUrl}/multi_search`)
    const options = { conversation: true, conversation_model_id: 'conv-model-1' }
    url.searchParams.set("q", message)
    for (const [k, v] of Object.entries(options)) {
        url.searchParams.set(k, `${v}`)
    }
    if (conversationId != null) {
        url.searchParams.set('conversation_id', conversationId)
    }
    const response = await post(url, {
        searches: [{
            collection,
            query_by: "embedding",
            exclude_fields: "embedding"
        }]
    })
    
    const result = response.results[0]
    const { answer, conversation_id, query } = response.conversation
    const { found, out_of, page, request_params, search_cutoff, search_time_ms } = result
    const to = {
        answer,
        conversation_id,
        query,
        found,
        out_of,
        page,
        request_params,
        search_cutoff,
        search_time_ms,
        results: response.results.length,
        hits: result.hits.map((x) => ({
            id: x.document.id,
            objectID: x.document.objectID,
            url: x.document.url,
            anchor: x.document.anchor,
            content: clean(x.document.content),
            type: x.document.type,
            title: clean(x.document.hierarchy.lvl3 ?? x.document.hierarchy.lvl2 ?? x.document.hierarchy.lvl1 ?? x.document.hierarchy.lvl0),
            score: x.vector_distance,
            highlight: x.highlight,
            snippet: clean(x.highlights.length > 0 ? x.highlights[0].snippet : null),
        })),
    }
    return to
}

const AISearchDialog = {
    template: `<div v-if="open" class="search-dialog fixed inset-0 z-50 flex bg-black/25 items-center justify-center" @click="$emit('hide')" @keydown.escape="$emit('hide')">
    <div class="dialog absolute w-full max-w-2xl flex flex-col bg-indigo-50 dark:bg-indigo-900 rounded-lg shadow-lg" style="max-height:80vh;" @click.stop="">
      <div class="p-4 flex flex-col" style="max-height: 80vh;">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 bg-indigo-900 dark:bg-indigo-950 p-4 -m-4 mb-4 rounded-t-lg">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-white">Ask ServiceStack Docs</h2>
          </div>
          <div class="flex space-x-3">
            <button type="button" v-if="messages.length > 0" @click="clearConversation" 
              class="text-xs text-gray-300 hover:text-white dark:hover:text-white font-semibold">
              <svg class="inline-block size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4" stroke-width="1"/></svg>
              clear
            </button>
            <button type="button" @click="$emit('hide')" class="text-gray-400 hover:text-white dark:hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="messages.length === 0" class="mb-4">
          <p class="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">Suggestions:</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="suggestion in suggestions" :key="suggestion" type="button" @click="inputMessage = suggestion; sendMessage()" class="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors">
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 border-b border-gray-300 dark:border-gray-600" style="max-height: calc(80vh - 180px);">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role === 'user' ? 'user-message' : 'assistant-message']">
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="bg-indigo-900 dark:bg-indigo-950 text-white rounded-lg px-4 py-2 max-w-xs">
                {{ msg.content }}
              </div>
            </div>
            <div v-else class="flex flex-col">
              <div class="shadow prose bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 mb-3"
                v-html="renderContent(msg)"></div>
              <!-- Search Results -->
              <div v-if="getUniqueHits(msg.hits).length > 0" class="space-y-3 mt-3">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm text-gray-600 dark:text-gray-400 font-semibold">{{ getUniqueHits(msg.hits).length }} Result{{ getUniqueHits(msg.hits).length !== 1 ? 's' : '' }} Found</p>
                </div>
                <a v-for="(hit, hitIdx) in getUniqueHits(msg.hits)" :key="hitIdx" :href="hit.url" :class="[hit.type ===
                    'lvl0' || hit.type === 'lvl1' ?
                    'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-600' :
                    'bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-600',
                    'rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer block']">
                  <div :class="[hit.type === 'lvl0' || hit.type === 'lvl1' ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-base' : 'text-blue-600 dark:text-indigo-400 hover:text-blue-800 dark:hover:text-indigo-300 text-sm', 'font-semibold']">
                    {{ hit.title }}
                  </div>
                  <p v-if="hit.snippet" class="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {{ hit.snippet }}
                  </p>
                  <p v-else-if="hit.content" class="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {{ hit.content }}
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div v-if="loading" class="mb-2 flex justify-center min-h-10">
            <div class="absolute animate-spin rounded-full size-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="flex gap-2">
          <input ref="refMessage"
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            :disabled="loading"
            type="text"
            placeholder="Ask a question..."
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button type="button"
            @click="sendMessage"
            :disabled="loading || !inputMessage.trim()"
            class="px-4 py-2 bg-indigo-500 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>`,
    emits: ['hide'],
    props: { open: Boolean },
    setup(props) {
        const refMessage = ref()
        const messages = ref([])
        const inputMessage = ref('')
        const loading = ref(false)
        const conversationId = ref(null)
        const suggestions = [
            "What is AutoQuery?",
            "How do I Authenticate?",
            "What Add ServiceStack Reference languages are supported?"
        ]

        function getUniqueHits(hits) {
            if (!hits) return []
            const seen = new Set()
            return hits.filter(hit => {
                const normalizedUrl = hit.url.replace(/\.html(#|$)/, '$1')
                if (seen.has(normalizedUrl)) return false
                seen.add(normalizedUrl)
                return true
            })
        }

        function clearConversation() {
            messages.value = []
            inputMessage.value = ''
            conversationId.value = null
            loading.value = false
            nextTick(() => {
                refMessage.value?.focus()
            })
        }

        async function sendMessage() {
            if (!inputMessage.value.trim() || loading.value) return

            const userMessage = inputMessage.value.trim()
            inputMessage.value = ''
            messages.value.push({ role: 'user', content: userMessage })

            loading.value = true
            try {
                const result = await multiSearch(userMessage, conversationId.value)
                conversationId.value = result.conversation_id
                messages.value.push({
                    role: 'assistant',
                    content: result.answer,
                    hits: result.hits
                })
                // console.log('hits', result.hits)
            } catch (error) {
                console.error('Search error:', error)
                messages.value.push({
                    role: 'assistant',
                    content: `Error: ${error.message}`
                })
            } finally {
                loading.value = false
                nextTick(() => {
                    const messagesArea = document.querySelector('.search-dialog .overflow-y-auto')
                    if (messagesArea) {
                        // Scroll to the user message (second to last message)
                        const messages = messagesArea.querySelectorAll('.message')
                        if (messages.length >= 2) {
                            const userMessage = messages[messages.length - 2]
                            userMessage.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                    }
                })
            }
        }

        watch(() => props.open, (isOpen) => {
            if (isOpen) {
                nextTick(() => {
                    refMessage.value?.focus()
                })
            }
        })

        function renderContent(msg) {
          console.log('msg', JSON.stringify(msg, null, 2))

          let content = msg.content
          if (content.includes('${[')) {
            content = content.replaceAll(/\$\{(\[.*?\])\}/g, (match, group) => {
                const ids = extractAllReferenceIds(group)
                return ids.join(', ')
            })
          }

          content = parseAndReplaceReferences(msg.content, msg.hits)

          const html = renderMarkdown(content)
          return html
        }

        return {
            refMessage,
            messages,
            inputMessage,
            loading,
            sendMessage,
            clearConversation,
            renderContent,
            getUniqueHits,
            suggestions,
        }
    }
}

export default {
    components: {
        AISearchDialog
    },
    template: `<div>
        <AISearchDialog :open="openSearch" @hide="hideSearch" />
        <button class="mt-0.5 flex p-0 text-gray-400 cursor-pointer
                hover:bg-white dark:hover:bg-gray-700 hover:text-gray-600" @click="showSearch" title="Ask ServiceStack Docs">
           <svg class="size-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 5H4v12h6.59L12 19.012L13.41 17H20v-6h2v7c0 .544-.456 1-1 1h-6.55L12 22.5L9.55 19H3c-.545 0-1-.456-1-1V4c0-.545.455-1 1-1h11zm5.53-3.68a.507.507 0 0 1 .94 0l.254.61a4.37 4.37 0 0 0 2.25 2.327l.717.32a.53.53 0 0 1 0 .962l-.758.338a4.36 4.36 0 0 0-2.22 2.25l-.246.566a.506.506 0 0 1-.934 0l-.247-.565a4.36 4.36 0 0 0-2.219-2.251l-.76-.338a.53.53 0 0 1 0-.963l.718-.32a4.37 4.37 0 0 0 2.251-2.325z"/></svg>
        </button>
    </div>`,
    setup() {
        const refMessage = ref()
        const openSearch = ref(false)

        function showSearch() {
            // console.log('AI Search button clicked, collection:', collection)
            openSearch.value = true
            nextTick(() => {
                const input = document.querySelector('.search-dialog input')
                input?.focus()
            })
        }

        const hideSearch = () => {
            // console.log('Hiding AI Search dialog')
            openSearch.value = false
        }

        onMounted(async () => {
            // console.log('TypesenseConversation mounted, collection:', collection)
        })

        return {
            refMessage,
            openSearch,
            showSearch,
            hideSearch,
            collection
        }
    }
}

function getHit(hits, id) {
    return id && hits.find((x) => x.id == id || x.objectID == id)
}

function refHtml(hit) {
    return `<a href="${hit.url}" target="_blank" class="svg-external" title="${htmlEncode(hit.title)}">${hit.id}</a>`
}

/**
 * Parses markdown for reference patterns and replaces them with formatted links.
 * Supports patterns like: (Ref: 1234), (Ref. 1234), (id: 1234), (1234), [ref: 1234], [1234], [[1234]], etc.
 * Also supports 40-character UUIDs like [33ffd70e82ebd01b19dadc908ea097844c6fb013]
 *
 * @param {string} markdown - The markdown content to parse
 * @param {Object.<string, {id: string, title: string}>} hits - Dictionary of search results keyed by id
 * @param {Function} [replaceFn] - Optional callback function that receives the search result and returns HTML.
 *                                 If not provided, uses default formatting: <a class="svg-external" title="{title}">{id}</a>
 *                                 Signature: (searchResult) => string
 * @returns {string} Markdown with references replaced by formatted links
 */
export function parseAndReplaceReferences(markdown, hits, replaceFn) {
    if (!markdown || !hits || hits.length === 0) {
        return markdown
    }

    // Regex pattern to match various reference formats:
    // - (Ref: 1234), (Ref. 1234), (Reference: 1234), (References: 1234), (id: 1234), (1234)
    // - [ref: 1234], [1234], [[1234]]
    // - [40-char-uuid] like [33ffd70e82ebd01b19dadc908ea097844c6fb013]
    // - Multiple references: (Ref. 1234, 1235) - extracts the first id
    const referencePattern = /\((?:(?:Ref(?:erence)?s?\.?|id):\s*)?(\d+)(?:\s*,\s*\d+)*\)|\[(?:ref:\s*)?(\d+)\]|\[\[(\d+)\]\]|\[([a-f0-9]{40})(?:\s*,\s*[a-f0-9]{40})*\]/gi

    return markdown.replace(referencePattern, (match, group1, group2, group3, group4) => {
        // Extract the first captured group that matched
        const id = group1 || group2 || group3 || group4

        // If we found an id and it exists in search results, replace with formatted link
        const hit = getHit(hits, id)
        if (hit) {
            console.log('found', id, hit)

            // Use custom replaceFn if provided, otherwise use default formatting
            if (replaceFn && typeof replaceFn === 'function') {
                return replaceFn(hit)
            }

            // Default formatting
            return refHtml(hit)
        } else {
            console.log('not found', id)
        }

        // Return original match if no search result found
        return match
    })
}

/**
 * Extracts the first reference id from markdown content.
 *
 * @param {string} markdown - The markdown content to parse
 * @returns {string|null} The first reference id found, or null if none found
 */
export function extractFirstReferenceId(markdown) {
    if (!markdown) return null

    const referencePattern = /\((?:(?:Ref(?:erence)?s?\.?|id):\s*)?(\d+)(?:\s*,\s*\d+)*\)|\[(?:ref:\s*)?(\d+)\]|\[\[(\d+)\]\]|\[([a-f0-9]{40})\]/i
    const match = markdown.match(referencePattern)

    if (!match) return null

    return match[1] || match[2] || match[3] || match[4]
}

/**
 * Extracts all reference ids from markdown content.
 *
 * @param {string} markdown - The markdown content to parse
 * @returns {string[]} List of all unique reference ids found
 */
export function extractAllReferenceIds(markdown) {
    if (!markdown) return []

    const referencePattern = /\((?:(?:Ref(?:erence)?s?\.?|id):\s*)?(\d+)(?:\s*,\s*\d+)*\)|\[(?:ref:\s*)?(\d+)\]|\[\[(\d+)\]\]|\[([a-f0-9]{40})\]/gi
    const ids = new Set()
    let match

    while ((match = referencePattern.exec(markdown)) !== null) {
        const id = match[1] || match[2] || match[3] || match[4]
        if (id) ids.add(id)
    }

    return Array.from(ids)
}
