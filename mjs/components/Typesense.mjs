import { ref, nextTick, onMounted } from 'vue'

const TypesenseDialog = {
    template:`<div class="search-dialog hidden flex bg-black bg-opacity-25 items-center" :class="{ open }" 
       @click="$emit('hide')">
    <div class="dialog absolute w-full flex flex-col bg-white dark:bg-gray-800" style="max-height:70vh;" @click.stop="">
      <div class="p-2 flex flex-col" style="max-height: 70vh;">
        <div class="flex">
          <label class="pt-4 mt-0.5 pl-2" for="docsearch-input">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </label>
          <input id="docsearch-input" class="search-input" v-model="query" @keyup="search"
                aria-autocomplete="list" aria-labelledby="docsearch-label" autocomplete="off" autocorrect="off" autocapitalize="off" 
                spellcheck="false" placeholder="Search docs" maxlength="64" type="search" enterkeyhint="go"
                @focus="selectedIndex=1" @blur="selectedIndex=-1" @keydown="onKeyDown">
          <div class="mt-5 mr-3"><button class="search-cancel" @click="$emit('hide')">Cancel</button></div>
        </div>
        <div v-if="results.allItems.length" class="group-results border-0 border-t border-solid border-gray-400 mx-2 pr-1 py-2 overflow-y-scroll" style="max-height:60vh">
          <div v-for="g in results.groups" :key="g.group" class="group-result mb-2">
            <h3 class="m-0 text-lg text-gray-600" v-html="g.group"></h3>
            <div v-for="result in g.items" :key="result.id" :aria-selected="result.id == selectedIndex"
                 class="group-item rounded-lg bg-gray-50 dark:bg-gray-900 mb-1 p-2 flex" @mouseover="onHover(result.id)" @click="go(result.url)">              
              <div class="min-w-min mr-2 flex items-center">
                <svg v-if="result.type=='doc'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <svg v-else-if="result.type=='content'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
              </div>
              <div class="overflow-hidden">
                <div class="snippet overflow-ellipsis overflow-hidden whitespace-nowrap text-sm" v-html="result.snippetHtml"></div>
                <h4><a class="text-sm text-gray-600" :href="result.url" v-html="result.titleHtml"></a></h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    emits: ['hide'],
    props: { open: Boolean },
    setup(props, { emit }) {

        const results = ref({ groups:[], allItems:[] })
        const query = ref("")

        let lastQuery = ""
        let timeout = null
        function search (txt) {
            if (!query.value) {
                results.value = { groups:[], allItems:[] }
                return
            }
            timeout = setTimeout(() => {
                if (timeout != null) {
                    if (lastQuery === query.value) return
                    lastQuery = query.value
                    clearTimeout(timeout)
                    // typesense API reference: https://typesense.org/docs/0.21.0/api/documents.html#search
                    fetch('https://search.docs.servicestack.net/collections/typesense_docs/documents/search?q='
                        + encodeURIComponent(query.value)
                        + '&query_by=content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3&group_by=hierarchy.lvl0', {
                        headers: {
                            // Search only API key for Typesense.
                            'x-typesense-api-key': 'N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo'
                        }
                    }).then(res => {
                        res.json().then(data => {
                            selectedIndex.value = 1
                            let idx = 0
                            const groups = {}
                            const meta = { groups:[], allItems:[] }
                            //console.log(data)

                            data.grouped_hits.forEach((gh) => {
                                let groupName = gh.group_key[0]
                                meta.groups.push({ group: groupName })
                                let group = groups[groupName] ?? (groups[groupName] = [])
                                gh.hits.forEach((hit) => {
                                    let doc = hit.document
                                    let highlight = hit.highlights.length > 0 ? hit.highlights[0] : null
                                    let item = {
                                        id: ++idx,
                                        titleHtml: doc.hierarchy.lvl3 ?? doc.hierarchy.lvl2 ?? doc.hierarchy.lvl1 ?? doc.hierarchy.lvl0,
                                        snippetHtml: highlight?.snippet,
                                        // search result type for icon
                                        type: highlight?.field === 'content' ? 'content' : 'heading',
                                        // search results have wrong domain, use relative
                                        url: doc.url.substring(doc.url.indexOf('/', 'https://'.length))
                                    };
                                    let titleOnly = stripHtml(item.titleHtml)
                                    if (titleOnly === groupName) {
                                        item.type = 'doc'
                                    }
                                    if (titleOnly === stripHtml(item.snippetHtml)) {
                                        item.snippetHtml = ""
                                    }
                                    group.push(item)
                                })
                            })

                            meta.groups.forEach((g) => {
                                g.items = groups[g.group] ?? []
                                g.items.forEach((item) => {
                                    meta.allItems.push(item)
                                })
                            })

                            //console.log(meta)
                            results.value = meta
                        })
                    })
                }
            }, 200)
        }

        let selectedIndex = ref(1)
        /** @param {number} index */
        const onHover = (index) => selectedIndex.value = index
        
        /** @param {string} url */
        function go(url) {
            emit('hide')
            location.href = url
        }

        /** @param {number} id
         *  @param {number} step */
        const next = (id, step) => {
            const meta = results.value
            const pos = meta.allItems.findIndex((x) => x.id === id)
            if (pos === -1)
                return meta.allItems[0]
            const nextPos = (pos + step) % meta.allItems.length
            return nextPos >= 0 ? meta.allItems[nextPos] : meta.allItems[meta.allItems.length + nextPos]
        }

        let ScrollCounter = 0

        /** @param {KeyboardEvent} e */
        function onKeyDown(e) {
            const meta = results.value
            if (!meta || meta.allItems.length === 0) return
            if (e.code === 'ArrowDown' || e.code === 'ArrowUp' || e.code === 'Home' || e.code === 'End') {
                selectedIndex.value = e.code === 'Home'
                    ? meta.allItems[0]?.id
                    : e.code === 'End'
                        ? meta.allItems[meta.allItems.length-1]?.id
                        : next(selectedIndex.value, e.code === 'ArrowUp' ? -1 : 1).id
                nextTick(() => {
                    let el = document.querySelector('[aria-selected=true]'),
                        elGroup = el?.closest('.group-result'),
                        elParent = elGroup?.closest('.group-results')

                    ScrollCounter++
                    let counter = ScrollCounter

                    if (el && elGroup && elParent) {
                        if (el === elGroup.firstElementChild?.nextElementSibling && elGroup === elParent.firstElementChild) {
                            //console.log('scrollTop', 0)
                            elParent.scrollTo({ top: 0, left: 0 });
                        } else if (el === elGroup.lastElementChild && elGroup === elParent.lastElementChild) {
                            //console.log('scrollEnd', elParent.scrollHeight)
                            elParent.scrollTo({ top: elParent.scrollHeight, left: 0 })
                        } else {
                            if (typeof IntersectionObserver != 'undefined') {
                                let observer = new IntersectionObserver((entries) => {
                                    if (entries[0].intersectionRatio <= 0) {
                                        //console.log('el.scrollIntoView()', counter, ScrollCounter)
                                        if (counter === ScrollCounter) el.scrollIntoView()
                                    }
                                    observer.disconnect()
                                })
                                observer.observe(el)
                            }
                        }
                    }
                })
                e.preventDefault()
            } else if (e.code === 'Enter') {
                let match = meta.allItems.find((x) => x.id === selectedIndex.value)
                if (match) {
                    go(match.url)
                    e.preventDefault()
                }
            }
        }

        /** @param {string} s */
        function stripHtml(s) {
            return s && s.replace(/<[^>]*>?/gm, '')
        }

        return { results, query, selectedIndex, search, onHover, go, onKeyDown }
    }
}

export default {
    components: {
        TypesenseDialog,
    },
    template:`<div>
        <TypesenseDialog :open="openSearch" @hide="hideSearch" />
        <button class="flex rounded-full p-0 bg-gray-100 dark:bg-gray-800 border-2 border-solid border-gray-100 dark:border-gray-700 text-gray-400 cursor-pointer
                       hover:border-green-400 dark:hover:border-green-400 hover:bg-white hover:text-gray-600" @click="showSearch">
          <svg class="w-7 h-7 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="hidden xl:inline text-lg mr-1">Search</span>
          <span style="opacity:1;" class="hidden md:block text-gray-400 text-sm leading-5 py-0 px-1.5 my-0.5 mr-1.5 border border-gray-300 border-solid rounded-md">
            <span class="sr-only">Press </span><kbd class="font-sans">/</kbd><span class="sr-only"> to search</span>
          </span>
      </button>
    </div>
    `,
    setup() {
        const openSearch = ref(false)
        function showSearch() {
            openSearch.value = true
            nextTick(() => {
                /** @@type {HTMLInputElement} */
                const el = document.querySelector('#docsearch-input')
                el?.select();
                el?.focus();
            })
        }
        const hideSearch = () => openSearch.value = false
        /** @@param {KeyboardEvent} e */
        function onKeyDown(e) {
            if (e.code === 'Escape') {
                hideSearch();
            }
            else if (e.target.tagName !== 'INPUT') {
                if (e.code === 'Slash' || (e.ctrlKey && e.code === 'KeyK')) {
                    showSearch();
                    e.preventDefault();
                }
            }
        }

        onMounted(() => {
            window.addEventListener('keydown', onKeyDown)
        })

        return {
            openSearch,
            showSearch,
            hideSearch,
            onKeyDown,
        }
    }
}
