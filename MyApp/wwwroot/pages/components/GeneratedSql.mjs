import { ref, onMounted } from "vue"

/**
 * Groups a code example with the SQL it generates in a single card. Wrap the fenced code blocks, separated by
 * blank lines so they're rendered and highlighted like any other code block:
 *
 * <generated-sql>
 *
 * ```csharp
 * var books = db.Select<Book>(Sql.Fmt($"Author = {author}"));
 * ```
 *
 * ```sql
 * SELECT ... FROM "Book" WHERE Author = @p0
 * ```
 *
 * </generated-sql>
 *
 * The sql code blocks are shown below a "Generated SQL" header, the sql block can also be used on its own.
 */
export default {
    props: {
        db: { type: String, default: 'SQLite' },
    },
    template: `
    <div class="not-prose my-6 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700
                [&_pre]:my-0! [&_pre]:rounded-none! [&_pre]:border-0!">
      <div ref="code"><slot></slot></div>
      <div :class="['flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold',
                    'text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                    hasCode ? 'border-t' : '']">
        <svg class="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
        </svg>
        <span>Generated SQL</span>
        <span class="ml-auto rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                     text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{db}}</span>
      </div>
      <div ref="sql"></div>
    </div>`,
    setup() {
        const code = ref()
        const sql = ref()
        const hasCode = ref(false)

        onMounted(() => {
            // Move the rendered sql code blocks below the header, leaving the code example above it
            code.value.querySelectorAll('pre').forEach(pre => {
                if (pre.querySelector('code.language-sql'))
                    sql.value.appendChild(pre)
            })
            hasCode.value = code.value.querySelector('pre') != null
        })

        return { code, sql, hasCode }
    }
}
