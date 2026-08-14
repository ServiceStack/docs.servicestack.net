import { computed } from "vue"

const escapeHtml = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Minimal JSON highlighter. A response is the whole point of this page, so it earns colour;
 * pulling in a syntax highlighter for one language does not.
 */
export function highlightJson(json) {
    return escapeHtml(json).replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        match => {
            const cls = /^"/.test(match)
                ? (/:$/.test(match) ? 'text-sky-700 dark:text-sky-300' : 'text-emerald-700 dark:text-emerald-300')
                : /true|false/.test(match) ? 'text-purple-700 dark:text-purple-300'
                : /null/.test(match) ? 'text-gray-400 dark:text-gray-500'
                : 'text-amber-700 dark:text-amber-300'
            return `<span class="${cls}">${match}</span>`
        })
}

/** Trim the common leading indentation, so JSON can be indented to match its surrounding source */
export function dedent(text) {
    const lines = String(text).replace(/\t/g, '    ').split('\n')
    while (lines.length && !lines[0].trim()) lines.shift()
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
    if (!lines.length) return ''
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length))
    return lines.map(l => l.slice(indent)).join('\n')
}

/** Flatten a slot's vnodes down to their text, without needing the DOM (works during SSG) */
function slotText(nodes) {
    if (nodes == null || typeof nodes === 'boolean') return ''
    if (typeof nodes === 'string' || typeof nodes === 'number') return String(nodes)
    if (Array.isArray(nodes)) return nodes.map(slotText).join('')
    return slotText(nodes.children)
}

/**
 * Renders syntax-highlighted JSON and nothing else - bring your own container.
 *
 *   <HighlightJson :json="schema" />
 *   <HighlightJson>{ "name": "Booking" }</HighlightJson>
 *
 * Accepts a JSON string (rendered as authored, after dedent) or an object/array (stringified).
 */
export default {
    props: {
        /** A formatted JSON string, or an object/array to stringify */
        json: { type: [String, Object, Array], default: null },
        /** Spaces used when stringifying an object */
        indent: { type: Number, default: 2 },
    },
    template: `<code v-html="html"></code>`,
    setup(props, { slots }) {
        const text = computed(() => {
            const src = props.json ?? (slots.default ? slotText(slots.default()) : '')
            return typeof src === 'string'
                ? dedent(src)
                : JSON.stringify(src, null, props.indent)
        })
        return { html: computed(() => highlightJson(text.value)) }
    }
}
