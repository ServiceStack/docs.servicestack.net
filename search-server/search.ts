#!/usr/bin/env bun

/**
 * https://typesense.org/docs/guide/docsearch.html#semantic-search
 * - Add embeddings:
 * typesense-scraper-config.embeddings.json
 * Embeddings Docker running at 100% CPU
 */

console.log('TypeSense Search Examples');
const BaseUrl = "https://search.docs.servicestack.net";
const SearchUrl = `${BaseUrl}/collections/typesense_docs/documents/search`;
const SearchApiKey = "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"; // Search-only key
const AdminApiKey = Bun.env.TYPESENSE_API_KEY; // Admin key from environment
const GoogleApiKey = Bun.env.GOOGLE_API_KEY; // Google API Key from environment
const H = {
    search: {
        "accept": "application/json",
        "x-typesense-api-key": SearchApiKey,
    },
    admin: {
        "accept": "application/json",
        "x-typesense-api-key": AdminApiKey,
    }
}

const options = {
    query_by: "hierarchy.lvl0,hierarchy.lvl1,content,hierarchy.lvl2,hierarchy.lvl3",
    group_by: "hierarchy.lvl0",
}

async function post(url: string | URL, body: any, opt: any | null = null) {
    opt ??= {}
    opt.method = "POST"
    opt.body = typeof body != 'string' 
        ? JSON.stringify(body) 
        : body
    return await get(url, opt)
}

async function put(url: string | URL, body: any, opt: any | null = null) {
    opt ??= {}
    opt.method = "PUT"
    opt.body = typeof body != 'string' 
        ? JSON.stringify(body) 
        : body
    return await get(url, opt)
}

async function get(url: string | URL, opt: any | null = null) {
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

async function serverInfo() {
    return await get(new URL(`${BaseUrl}/stats.json`), { headers: H.admin })
}

async function documentSearch(q: string) {
    const url = new URL(SearchUrl)
    url.searchParams.set("q", q)
    for (const [k, v] of Object.entries(options)) {
        url.searchParams.set(k, v)
    }
    return await get(url)
}

async function listCollections() {
    const results = await get(new URL(`${BaseUrl}/collections`), { headers: H.admin })
    return results.map((x: any) => ({
        name: x.name,
        fields: x.fields.map((x: any) => `${x.name}:${x.type}${x.optional ? '?' : ''}`)
    }))
}

async function createConvesationStore() {
    return await post(`${BaseUrl}/collections`, {
        "name": "conversation_store",
        "fields": [
            {
                "name": "conversation_id",
                "type": "string"
            },
            {
                "name": "model_id",
                "type": "string"
            },
            {
                "name": "timestamp",
                "type": "int32"
            },
            {
                "name": "role",
                "type": "string",
                "index": false
            },
            {
                "name": "message",
                "type": "string",
                "index": false
            }
        ]
    }, { headers: H.admin })
}

async function createOrUpdateConversationModel() {
    const body = {
        id: "conv-model-1",
        model_name: "google/gemini-flash-latest", //TODO: renamed to google/gemini-flash-latest
        history_collection: "conversation_store",
        api_key: GoogleApiKey,
        system_prompt: "You are an intelligent assistant for question-answering about ServiceStack Software. Try to answer questions using the provided context. If a response has no references in the provided context, politely say you do not have knowledge about that topic.",
        max_bytes: 16384
    }
    try {
        return await post(`${BaseUrl}/conversations/models`, body, { headers: H.admin })
    } catch (e:any) {
        console.log('UPDATE CONVERSATION MODEL', e.message.split('\n')[0])
        return await put(`${BaseUrl}/conversations/models/${body.id}`, body, { headers: H.admin })
    }
}

function clean(s:string|null) {
    if (s == null) return ''
    return s.replace('&ZeroWidthSpace', '')
        .replace(/s+/g, ' ')
}

async function multiSeach(collection: string, message: string, conversationId?:string) {
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
    const { found, out_of, page, request_params, search_custoff, search_time_ms } = result
    const to = {
        answer, 
        conversation_id, 
        query,
        found,
        out_of, 
        page, 
        request_params, 
        search_custoff, 
        search_time_ms,
        results: response.results.length,
        hits: result.hits.map((x:any) => ({
            url: x.document.url,
            anchor: x.document.anchor,
            content: x.document.content,
            title: clean(x.document.hierarchy.lvl3 ?? x.document.hierarchy.lvl2 ?? x.document.hierarchy.lvl1 ?? x.document.hierarchy.lvl0),
            score: x.vector_distance,
            highlight: x.highlight,
            snippet: x.highlights.length > 0 ? x.highlights[0].snippet : null,
        })),
    }
    return to
}

function log(results: any, title: string) {
    console.log(`\n${title}:`)
    console.log(JSON.stringify(results, null, 2))
}

;(async () => {
    const collections = await listCollections()
    const collection = collections.find((x:any) => x.name.startsWith('typesense_docs_')).name
    log(collections, 'LIST COLLECTIONS')
    console.log('collection:', collection)

    log(await serverInfo(), 'INFO')
    log(await listCollections(), 'LIST COLLECTIONS')
    log(await createConvesationStore(), 'CREATE CONVERSATION STORE')
    log(await createOrUpdateConversationModel(), 'CREATE CONVERSATION MODEL')
    const chat = await multiSeach(collection, 'Simple AutoQuery API Example')
    log(chat, 'START CONVERSATION')
    log(await multiSeach(collection, 'How to create a custom AutoQuery implementation?', chat.conversation_id), 
        'FOLLOW UP CONVERSATION')
    // log(await documentSearch("AI Chat"), 'DOCUMENT SEARCH')
})();
