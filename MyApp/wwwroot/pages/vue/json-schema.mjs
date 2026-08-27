import { computed, inject, onBeforeUnmount, provide, reactive, ref, watch } from "vue"
import { JsonServiceClient } from "@servicestack/client"
import { generateTypes, TYPE_LANGUAGES } from "@servicestack/vue"

const DEMO = Symbol('schema-demo')
const SERVERS = [
    { label: 'Deployed BlazorGallery', value: 'https://blazor-gallery.servicestack.net' },
    ...(location.protocol === 'http:'
        ? [{ label: 'Local BlazorGallery', value: 'http://localhost:5000' }]
        : []),
]

const initialFormData = {
    Name: 'Launch ServiceStack Vue',
    Category: 'Release',
    Active: true,
    LaunchDate: '2026-08-12',
    Tags: ['vue', 'schema', 'servicestack'],
    Owner: { Name: 'Alex Morgan', Email: 'alex@example.com' },
    Milestones: [
        { Title: 'Component parity', Complete: true },
        { Title: 'Documentation example', Complete: false },
    ],
    Settings: { environment: 'production', region: 'au-west' },
}

const formSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Launch plan',
    description: 'Nested objects, arrays, enums, validation, and dictionary values in one form.',
    type: 'object',
    required: ['Name', 'Category', 'Owner'],
    properties: {
        Name: {
            title: 'Plan name',
            type: 'string',
            minLength: 3,
            description: 'A descriptive name for this launch.',
        },
        Category: {
            type: 'string',
            enum: ['Release', 'Migration', 'Campaign'],
            'x-enumNames': ['Product release', 'Platform migration', 'Marketing campaign'],
        },
        Active: { type: 'boolean', title: 'Active plan' },
        LaunchDate: { type: 'string', format: 'date', title: 'Launch date' },
        Tags: {
            type: 'array',
            title: 'Tags',
            uniqueItems: true,
            items: { type: 'string' },
        },
        Owner: {
            type: 'object',
            title: 'Owner',
            required: ['Name', 'Email'],
            properties: {
                Name: { type: 'string', minLength: 2 },
                Email: { type: 'string', format: 'email' },
            },
        },
        Milestones: {
            type: 'array',
            title: 'Milestones',
            minItems: 1,
            items: {
                type: 'object',
                required: ['Title'],
                properties: {
                    Title: { type: 'string', minLength: 2 },
                    Complete: { type: 'boolean' },
                },
            },
        },
        Settings: {
            type: 'object',
            title: 'Settings dictionary',
            description: 'Add arbitrary string key/value settings.',
            additionalProperties: { type: 'string' },
        },
    },
}

function clone(value) {
    return typeof structuredClone === 'function'
        ? structuredClone(value)
        : JSON.parse(JSON.stringify(value))
}

const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function highlightCode(code, language) {
    const source = String(code ?? '')
    const hljs = globalThis.hljs
    try {
        if (hljs?.getLanguage(language)) {
            return hljs.highlight(source, { language, ignoreIllegals: true }).value
        }
    } catch { /* fall through to escaped text */ }
    return escapeHtml(source)
}

function absoluteSchemaIds(value, baseUrl) {
    if (Array.isArray(value)) return value.map(x => absoluteSchemaIds(x, baseUrl))
    if (!value || typeof value !== 'object') return value
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
        key,
        key === '$id' && typeof child === 'string' && child.startsWith('/')
            ? new URL(child, baseUrl).href
            : absoluteSchemaIds(child, baseUrl),
    ]))
}

function useDemo() {
    const demo = inject(DEMO)
    if (!demo) throw new Error('Schema demo state is unavailable')
    return demo
}

export const SchemaServerPicker = {
    template: `<div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
            <div class="flex items-center gap-2">
                <span :class="['h-2.5 w-2.5 rounded-full', loading ? 'animate-pulse bg-amber-400' : error ? 'bg-red-500' : 'bg-emerald-500']"></span>
                <h2 class="font-semibold text-gray-900 dark:text-gray-100">Live schema server</h2>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ status }}</p>
        </div>
        <select v-if="servers.length > 1" aria-label="Schema server" v-model="baseUrl" class="mt-3 block w-full rounded-md border-gray-300 bg-white text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 sm:mt-0 sm:w-auto">
            <option v-for="server in servers" :key="server.value" :value="server.value">{{ server.label }}</option>
        </select>
        <code v-else class="mt-3 text-xs text-gray-500 dark:text-gray-400 sm:mt-0">{{ baseUrl }}</code>
    </div>`,
    setup() {
        const demo = useDemo()
        return {
            ...demo,
            status: computed(() => demo.loading.value
                ? 'Loading JSON Schemas...'
                : demo.error.value
                    ? `Unavailable: ${demo.error.value}`
                    : 'Connected - examples below use live schemas and data.'),
        }
    },
}

export const SchemaAutoQuery = {
    template: `<div>
        <AutoQuerySchema v-if="booking" :key="baseUrl" :schema="booking" :client="client" :take="5" />
        <div v-else class="rounded-lg border border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {{ error ? 'Select an available server to load the grid.' : 'Loading Booking schema...' }}
        </div>
    </div>`,
    setup() { return useDemo() },
}

export const SchemaApiForm = {
    template: `<div>
        <ApiFormSchema v-if="hello" :key="baseUrl" :schema="hello" :client="client" :model-value="{ Name: 'Vue' }">
            <template #default="{ result, requestText, curl }">
                <div class="mt-6 grid gap-4 xl:grid-cols-2">
                    <div class="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                        <h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Request preview</h3>
                        <div class="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300">{{ requestText }}</div>
                        <details class="mt-3">
                            <summary class="cursor-pointer text-xs font-medium text-indigo-600 dark:text-indigo-400">cURL</summary>
                            <div class="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-600 dark:text-gray-400">{{ curl }}</div>
                        </details>
                    </div>
                    <div class="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                        <h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ result ? 'Response - ' + result.status + ' - ' + result.ms + ' ms - ' + result.size : 'Response' }}</h3>
                        <div v-if="result" class="overflow-x-auto text-sm"><JsonView :value="result.json ?? result.text" /></div>
                        <p v-else class="text-sm text-gray-500 dark:text-gray-400">Execute the request to render its response with JsonView.</p>
                    </div>
                </div>
            </template>
        </ApiFormSchema>
        <div v-else class="rounded-lg border border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {{ error ? 'Select an available server to load the API form.' : 'Loading Hello schema...' }}
        </div>
    </div>`,
    setup() { return useDemo() },
}

export const SchemaForm = {
    template: `<div class="grid gap-6 2xl:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)]">
        <div class="min-w-0">
            <JsonSchemaForm ref="form" :schema="formSchema" v-model="formData" validate-on="change" />
            <div class="mt-5 flex flex-wrap items-center gap-3">
                <PrimaryButton type="button" @click="validate">Validate</PrimaryButton>
                <SecondaryButton type="button" @click="reset">Reset example</SecondaryButton>
                <span v-if="message" class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</span>
            </div>
        </div>
        <div class="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
            <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Live model</h3>
            <div class="overflow-x-auto text-sm"><JsonView :value="formData" /></div>
        </div>
    </div>`,
    setup() {
        const demo = inject(DEMO, null) ?? { formData: ref(clone(initialFormData)) }
        const form = ref(null)
        const message = ref('')
        function validate() {
            const status = form.value?.validate()
            message.value = status ? status.message : 'Schema validation passed'
        }
        function reset() {
            demo.formData.value = clone(initialFormData)
            form.value?.reset()
            message.value = 'Form reset'
        }
        return { ...demo, formSchema, form, message, validate, reset }
    },
}

export const SchemaTypes = {
    template: `<div>
        <div class="mb-4 flex flex-wrap items-end justify-between gap-4">
            <p class="m-0 text-sm text-gray-500 dark:text-gray-400">Generated from the live form value above.</p>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Language
                <select v-model="language" class="ml-3 rounded-md border-gray-300 bg-white text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    <option v-for="item in languages" :key="item.id" :value="item.id">{{ item.label }}</option>
                </select>
            </label>
        </div>
        <div class="max-h-[36rem] overflow-auto rounded-lg bg-gray-900 p-5 text-sm leading-relaxed text-gray-100"><code
            class="block w-max min-w-full whitespace-pre bg-transparent p-0 font-mono"
            v-html="highlighted"></code></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Generated file: <code>{{ generated.path }}</code></p>
    </div>`,
    setup() {
        const demo = useDemo()
        const language = ref('typescript')
        const generated = computed(() => generateTypes({
            name: 'launch-plan.json',
            schema: formSchema,
            json: demo.formData.value,
            language: language.value,
        }))
        const highlighted = computed(() => highlightCode(generated.value.content, language.value))
        return { language, languages: TYPE_LANGUAGES, generated, highlighted }
    },
}

function installQueryRouter(app) {
    const route = reactive({ query: Object.fromEntries(new URLSearchParams(location.search)) })
    const sync = () => { route.query = Object.fromEntries(new URLSearchParams(location.search)) }
    addEventListener('popstate', sync)
    app.config.globalProperties.$route = route
    app.config.globalProperties.$router = {
        push({ query }) {
            const params = new URLSearchParams()
            Object.entries(query ?? {}).forEach(([key, value]) => {
                if (value != null && value !== '') params.set(key, String(value))
            })
            history.pushState(null, '', location.pathname + (params.size ? `?${params}` : '') + location.hash)
            sync()
        },
    }
}

export default {
    install(app) {
        installQueryRouter(app)
    },
    components: {
        SchemaServerPicker,
        SchemaAutoQuery,
        SchemaApiForm,
        SchemaForm,
        SchemaTypes,
    },
    setup() {
        const baseUrl = ref(SERVERS[0].value)
        const booking = ref(null)
        const hello = ref(null)
        const loading = ref(true)
        const error = ref('')
        const formData = ref(clone(initialFormData))
        const client = computed(() => new JsonServiceClient(baseUrl.value))
        let controller

        async function loadSchemas() {
            controller?.abort()
            controller = new AbortController()
            booking.value = null
            hello.value = null
            loading.value = true
            error.value = ''
            try {
                const responses = await Promise.all([
                    fetch(`${baseUrl.value}/auto/Booking.json`, { signal: controller.signal, credentials: 'include' }),
                    fetch(`${baseUrl.value}/schema/Hello.json`, { signal: controller.signal, credentials: 'include' }),
                ])
                const failed = responses.find(x => !x.ok)
                if (failed) throw new Error(`${failed.status} ${failed.statusText}`)
                const schemas = await Promise.all(responses.map(x => x.json()))
                booking.value = absoluteSchemaIds(schemas[0], baseUrl.value)
                hello.value = absoluteSchemaIds(schemas[1], baseUrl.value)
            } catch (e) {
                if (e.name !== 'AbortError') error.value = e.message ?? String(e)
            } finally {
                if (!controller.signal.aborted) loading.value = false
            }
        }

        watch(baseUrl, loadSchemas, { immediate: true })
        onBeforeUnmount(() => controller?.abort())
        provide(DEMO, { servers: SERVERS, baseUrl, booking, hello, loading, error, client, formData })
        return {}
    },
}
