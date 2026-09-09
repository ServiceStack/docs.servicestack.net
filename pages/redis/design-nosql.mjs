/** How an RDBMS instinct translates to a key-value store */
const NosqlModeling = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Modelling for a key-value store</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Store the domain model, not a tabular projection of it</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Much of a relational schema exists to satisfy the store, not the problem domain. Redis is schema-less, so most of that
        translation step disappears - you store your POCOs close to as designed.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="c in contrasts" :key="c.title"
             :class="['rounded-2xl border p-5 shadow-sm', c.featured ? 'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{c.title}}</div>
          <div class="mt-2 space-y-1.5">
            <div v-for="p in c.points" :key="p" class="flex items-start gap-2">
              <span class="shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true">•</span>
              <span class="min-w-0 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-7">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">The one decision you still make</div>
        <h4 class="mt-1 font-bold text-slate-900 dark:text-white">Which models are entities, and which are values?</h4>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div v-for="k in kinds" :key="k.name"
               class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="font-bold text-slate-900 dark:text-white">{{k.name}}</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{k.text}}</p>
            <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{k.example}}</code>
          </div>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Promoting a model to an entity means replacing a collection of strongly-typed children with a collection of their ids.
          It looks like a foreign key, but you introduce it only when you actually want to manage the entities independently - not because a schema demands it.
        </p>
      </div>
    </section>`,
    setup() {
        const contrasts = [
            { title:'Relational', featured:false, points:[
                'Design the domain model, then morph it into tables.',
                'Pepper it with primary and foreign keys the domain never asked for.',
                'Schema changes need DDL, a migration script and a maintenance window.',
              ] },
            { title:'Redis', featured:true, points:[
                'POCO types are the design - and the storage format.',
                'Split a model apart only where you want independent lifetimes.',
                'Adding and removing fields usually needs no migration at all.',
              ] },
        ]
        const kinds = [
            { name:'Entity', text:'Meaningful on its own, and queried outside its parent’s context - so it gets its own key and its own id.',
              example:'Blog, BlogPost, User' },
            { name:'Value object', text:'Only makes sense inside its parent and isn’t referenced elsewhere - so it’s stored inline with it.',
              example:'BlogPostComment, Tags, Categories' },
        ]
        return { contrasts, kinds }
    }
}

/** The indexes you maintain yourself, and why */
const IndexPatterns = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">There is no WHERE clause</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Queries become indexes you write on save</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Every read on the blog’s pages is answered by a structure maintained when the data was written -
          which is why each of them is a single fast lookup instead of a scan.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="p in patterns" :key="p.question"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">{{p.question}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">{{p.structure}}</span>
            <code class="min-w-0 whitespace-pre-wrap break-words text-[11px] font-bold text-slate-500 dark:text-slate-400">{{p.key}}</code>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const patterns = [
            { question:'List all blogs', structure:'Set of ids', key:'redisBlogs.GetAll()',
              text:'The typed client maintains a set of ids per type as you Store() entities, so “all of X” is a set read plus a fetch - never a keyspace scan.' },
            { question:'Show recent comments', structure:'List', key:'urn:BlogPostComment:RecentComments',
              text:'Push onto a capped list as comments are written, and reading the newest N is one range call.' },
            { question:'Show a tag cloud', structure:'Sorted Set', key:'urn:TagCloud',
              text:'Increment each tag’s score on save; the cloud is the top-scoring range, already ordered by the server.' },
            { question:'Posts in a category or tag', structure:'Set per value', key:'urn:Category:{name}',
              text:'Add the post id to the set for each of its categories and tags, so the listing page is a single set read.' },
        ]
        return { patterns }
    }
}

export default {
    components: { NosqlModeling, IndexPatterns }
}
