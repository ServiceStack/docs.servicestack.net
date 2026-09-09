/** Never blocked waiting on a client release */
const CustomCommandApis = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">No waiting for a client release</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every Redis command is reachable today</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        A brand new Redis command, or a permutation the typed API doesn’t cover, is still one call away -
        you never have to wait for an updated ServiceStack.Redis release to use it.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="a in apis" :key="a.sig"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', a.featured ? 'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{a.on}}</div>
          <code class="mt-1 whitespace-pre-wrap break-words font-bold text-slate-900 dark:text-white">{{a.sig}}</code>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="t in argTypes" :key="t.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="block whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{t.name}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{t.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Extension methods on <code class="font-bold">RedisData</code> and <code class="font-bold">RedisText</code> unpack the reply -
        <code>ret.Text</code> for a scalar, <code>ret.GetResults()</code> for a list and
        <code>ret.GetResult&lt;Poco&gt;()</code> to deserialize straight back into your type.
      </p>
    </section>`,
    setup() {
        const apis = [
            { on:'On IRedisClient', featured:true, sig:'RedisText Custom(params object[] cmdWithArgs)',
              text:'Sends an ad-hoc command and returns a text-oriented reply that’s easy to read scalars and lists out of.' },
            { on:'On IRedisNativeClient', featured:false, sig:'RedisData RawCommand(params object[] cmdWithArgs)',
              text:'The same, one level lower - also overloaded to take raw byte[][] args when you’re handling your own serialization.' },
        ]
        const argTypes = [
            { name:'byte[] / string / int', text:'Any serializable primitive is accepted directly as an argument.' },
            { name:'Commands.Set', text:'The pre-encoded command constants, so you skip re-encoding the command name each call.' },
            { name:'Your POCOs', text:'Complex types are transparently serialized as JSON and sent as UTF-8 bytes.' },
        ]
        return { apis, argTypes }
    }
}

export default {
    components: { CustomCommandApis }
}
