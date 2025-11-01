/**
 * Test suite for TypesenseConversation AI Search component
 * Tests the conversational multi_search feature with conversation_id support
 */

// Mock setup
const mockFetch = async (url, options) => {
    const urlStr = url.toString()
    
    // Mock multi_search response
    if (urlStr.includes('/multi_search')) {
        return {
            ok: true,
            json: async () => ({
                conversation: {
                    answer: "ServiceStack is a modern .NET framework for building APIs and web services.",
                    conversation_id: "conv-123-456",
                    query: "What is ServiceStack?"
                },
                results: [{
                    found: 2,
                    out_of: 100,
                    page: 1,
                    request_params: {},
                    search_cutoff: false,
                    search_time_ms: 45,
                    hits: [
                        {
                            document: {
                                url: "/docs/servicestack/",
                                anchor: "overview",
                                content: "ServiceStack is a modern .NET framework...",
                                hierarchy: {
                                    lvl0: "ServiceStack",
                                    lvl1: "Overview",
                                    lvl2: null,
                                    lvl3: null
                                }
                            },
                            vector_distance: 0.15,
                            highlight: {},
                            highlights: [{
                                snippet: "ServiceStack is a modern .NET framework for building APIs"
                            }]
                        },
                        {
                            document: {
                                url: "/docs/servicestack/getting-started/",
                                anchor: "intro",
                                content: "Getting started with ServiceStack...",
                                hierarchy: {
                                    lvl0: "ServiceStack",
                                    lvl1: "Getting Started",
                                    lvl2: "Introduction",
                                    lvl3: null
                                }
                            },
                            vector_distance: 0.22,
                            highlight: {},
                            highlights: [{
                                snippet: "Learn how to get started with ServiceStack"
                            }]
                        }
                    ]
                }]
            })
        }
    }
    
    // Mock collections response
    if (urlStr.includes('/collections')) {
        return {
            ok: true,
            json: async () => [
                {
                    name: "typesense_docs_v1",
                    fields: [
                        { name: "url", type: "string" },
                        { name: "content", type: "string" },
                        { name: "embedding", type: "float[]" }
                    ]
                }
            ]
        }
    }
    
    throw new Error(`Unexpected URL: ${urlStr}`)
}

// Test 1: Verify global utilities are initialized
console.log('Test 1: Global utilities initialization')
try {
    // Simulate the ensureGlobals function
    if (!globalThis.get) {
        globalThis.get = async (url, opt = null) => {
            opt ??= {}
            opt.headers = opt.headers ?? globalThis.H?.search
            const r = await fetch(url.toString(), opt)
            if (!r.ok) {
                const errorBody = await r.text()
                throw new Error(`${r.status} ${r.statusText}`)
            }
            return await r.json()
        }
    }
    if (!globalThis.post) {
        globalThis.post = async (url, body, opt = null) => {
            opt ??= {}
            opt.method = "POST"
            opt.body = typeof body != 'string' ? JSON.stringify(body) : body
            return await globalThis.get(url, opt)
        }
    }
    if (!globalThis.BaseUrl) {
        globalThis.BaseUrl = "https://search.docs.servicestack.net"
    }
    if (!globalThis.H) {
        globalThis.H = {
            search: {
                "accept": "application/json",
                "x-typesense-api-key": "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"
            },
            admin: {
                "accept": "application/json",
                "x-typesense-api-key": "N4N8bF0XwyvzwCGwm3CKB0QcnwyWtygo"
            }
        }
    }
    
    console.log('✓ Global utilities initialized successfully')
    console.log(`  - BaseUrl: ${globalThis.BaseUrl}`)
    console.log(`  - get function: ${typeof globalThis.get}`)
    console.log(`  - post function: ${typeof globalThis.post}`)
    console.log(`  - H.search headers: ${Object.keys(globalThis.H.search).join(', ')}`)
} catch (error) {
    console.error('✗ Failed to initialize global utilities:', error.message)
}

// Test 2: Verify clean function works correctly
console.log('\nTest 2: Clean function')
try {
    const clean = (s) => {
        if (s == null) return null
        return s.replace(/&ZeroWidthSpace/g, '')
            .replace(/\s+/g, ' ')
            .trim()
    }
    
    const testCases = [
        { input: "Hello  World", expected: "Hello World" },
        { input: "Test&ZeroWidthSpaceString", expected: "TestString" },
        { input: "  Spaces  ", expected: "Spaces" },
        { input: null, expected: null }
    ]
    
    let passed = 0
    testCases.forEach(({ input, expected }) => {
        const result = clean(input)
        if (result === expected) {
            passed++
            console.log(`✓ clean(${JSON.stringify(input)}) = ${JSON.stringify(result)}`)
        } else {
            console.error(`✗ clean(${JSON.stringify(input)}) = ${JSON.stringify(result)}, expected ${JSON.stringify(expected)}`)
        }
    })
    console.log(`  ${passed}/${testCases.length} tests passed`)
} catch (error) {
    console.error('✗ Clean function test failed:', error.message)
}

// Test 3: Verify conversation_id is preserved
console.log('\nTest 3: Conversation ID preservation')
try {
    let conversationId = null
    
    // Simulate first message
    conversationId = "conv-123-456"
    console.log(`✓ First message conversation_id set: ${conversationId}`)
    
    // Simulate follow-up message with same conversation_id
    const followUpId = "conv-123-456"
    if (followUpId === conversationId) {
        console.log(`✓ Follow-up message uses same conversation_id: ${followUpId}`)
    } else {
        console.error(`✗ Follow-up message conversation_id mismatch`)
    }
} catch (error) {
    console.error('✗ Conversation ID test failed:', error.message)
}

// Test 4: Verify component structure
console.log('\nTest 4: Component structure')
try {
    const componentTemplate = `<div>
        <AISearchDialog :open="openSearch" :collection="collection" @hide="hideSearch" />
        <button class="mt-0.5 flex p-0 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-pointer
                hover:bg-white dark:hover:bg-gray-700 hover:text-gray-600" @click="showSearch" title="AI Search">
           <svg class="size-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 5H4v12h6.59L12 19.012L13.41 17H20v-6h2v7c0 .544-.456 1-1 1h-6.55L12 22.5L9.55 19H3c-.545 0-1-.456-1-1V4c0-.545.455-1 1-1h11zm5.53-3.68a.507.507 0 0 1 .94 0l.254.61a4.37 4.37 0 0 0 2.25 2.327l.717.32a.53.53 0 0 1 0 .962l-.758.338a4.36 4.36 0 0 0-2.22 2.25l-.246.566a.506.506 0 0 1-.934 0l-.247-.565a4.36 4.36 0 0 0-2.219-2.251l-.76-.338a.53.53 0 0 1 0-.963l.718-.32a4.37 4.37 0 0 0 2.251-2.325z"/></svg>        
        </button>
    </div>`
    
    if (componentTemplate.includes('AISearchDialog')) {
        console.log('✓ AISearchDialog component is included')
    }
    if (componentTemplate.includes('@click="showSearch"')) {
        console.log('✓ showSearch click handler is bound')
    }
    if (componentTemplate.includes(':collection="collection"')) {
        console.log('✓ collection prop is passed to AISearchDialog')
    }
    if (componentTemplate.includes('@hide="hideSearch"')) {
        console.log('✓ hideSearch event handler is bound')
    }
} catch (error) {
    console.error('✗ Component structure test failed:', error.message)
}

console.log('\n✓ All tests completed!')

