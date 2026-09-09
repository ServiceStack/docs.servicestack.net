import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Which of the two Authentication models a project should use */
const AuthModels = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Two models since v8</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which Authentication model should this App use?</h3>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="m in models" :key="m.name"
             :class="['flex flex-col rounded-2xl border-2 p-6 shadow-sm', m.accent]">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{m.name}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{m.tagline}}</div>
            </div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', m.tint]">{{m.badge}}</span>
          </div>

          <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Choose it when</div>
          <ul class="mt-2 flex-1 space-y-1.5">
            <li v-for="point in m.when" :key="point"
                class="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{point}}</span>
            </li>
          </ul>

          <div class="mt-4 flex flex-wrap gap-1.5 border-t border-black/5 pt-3 dark:border-white/10">
            <span v-for="p in m.platforms" :key="p"
                  class="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] text-slate-600 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{p}}</span>
          </div>

          <a :href="m.href"
             class="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-800">
            {{m.link}} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">Both protect your APIs the same way.</b> The declarative attributes
        below, <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">[Authenticate]</code> and the
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">[Required*]</code> filters all work
        regardless of which model authenticated the user - so this choice is about where users are stored and how they
        sign in, not about how your Services are written.
      </p>
    </section>`,
    setup() {
        const models = [
            { name:'ASP.NET Core Identity', tagline:'The default since ServiceStack v8', badge:'recommended',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              when:[
                'You’re starting a new .NET 10 project',
                'You want the same Identity configuration as Microsoft’s own templates',
                'You want Microsoft’s ongoing Identity improvements as they land',
                'You already use Identity elsewhere in the App',
              ],
              platforms:['.NET 10','Blazor','Razor Pages','MVC'],
              href:'/auth/identity-auth', link:'Identity Auth' },
            { name:'ServiceStack Auth', tagline:'The universal model', badge:'universal',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              when:[
                'You’re maintaining an existing App already using it',
                'You need to run on .NET Framework or HttpListener',
                'You rely on typed User Sessions or extended UserAuth tables',
                'You want one Auth model shared across hosting platforms',
              ],
              platforms:['.NET','.NET Framework','ASP.NET Core','HttpListener'],
              href:'/auth/authentication-and-authorization', link:'ServiceStack Auth' },
        ]
        return { models }
    }
}

/** The auth docs, arranged by what you're trying to do */
const AuthDocMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Where to go next</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The authentication documentation</h3>
      </div>

      <div v-for="stage in stages" :key="stage.name" class="mb-4 last:mb-0">
        <div class="mb-2 flex items-center gap-3">
          <span :class="['flex h-7 items-center rounded-lg px-2.5 text-[11px] font-black uppercase tracking-wider', stage.tint]">{{stage.name}}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{stage.caption}}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="doc in stage.docs" :key="doc.title" :href="doc.href"
             class="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{doc.title}}</div>
              <span v-if="doc.model" :class="['shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider', doc.model === 'Identity'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300']">{{doc.model}}</span>
            </div>
            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{doc.text}}</p>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const stages = [
            { name:'Choose', caption:'Pick a model and get users signing in',
              tint:'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              docs:[
                { title:'Identity Auth', href:'/auth/identity-auth', model:'Identity', text:'ServiceStack’s integration with ASP.NET Core Identity.' },
                { title:'ServiceStack Auth', href:'/auth/authentication-and-authorization', model:'ServiceStack', text:'The universal Auth Provider model and its built-in providers.' },
                { title:'Migrate to Identity Auth', href:'/auth/migrate-to-identity-auth', model:'Identity', text:'Move an existing ServiceStack Auth App across.' },
              ] },
            { name:'Protect', caption:'Decide who can call what',
              tint:'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
              docs:[
                { title:'Restricting Services', href:'/auth/restricting-services', text:'Limit APIs by network, format or endpoint attribute.' },
                { title:'Anti Forgery', href:'/auth/anti-forgery', text:'CSRF protection for form posts.' },
                { title:'Encrypted Messaging', href:'/auth/encrypted-messaging', model:'ServiceStack', text:'End-to-end encrypted requests over plain HTTP.' },
              ] },
            { name:'Tokens & keys', caption:'Authenticate services and machines',
              tint:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              docs:[
                { title:'JWT Identity Auth', href:'/auth/jwt-identity-auth', model:'Identity', text:'Stateless JWT authentication on Identity Auth.' },
                { title:'JWT AuthProvider', href:'/auth/jwt-authprovider', model:'ServiceStack', text:'JWT and refresh tokens in the ServiceStack Auth model.' },
                { title:'API Keys', href:'/auth/apikeys', model:'Identity', text:'The .NET 10 API Keys feature, scopes and integrated UIs.' },
                { title:'Simple Admin Auth', href:'/auth/admin-apikeys', model:'Identity', text:'Protect an internal App with API keys and no user database.' },
                { title:'API Key AuthProvider', href:'/auth/api-key-authprovider', model:'ServiceStack', text:'API keys in the ServiceStack Auth model.' },
              ] },
            { name:'Store', caption:'Where users, roles and sessions live',
              tint:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              docs:[
                { title:'Auth Repository', href:'/auth/auth-repository', model:'ServiceStack', text:'UserAuth tables, roles, permissions and password hashing.' },
                { title:'Sessions', href:'/auth/sessions', model:'ServiceStack', text:'Typed sessions, cookies, events and sliding expiry.' },
              ] },
            { name:'Integrate', caption:'Clients, MVC and third-party identity',
              tint:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              docs:[
                { title:'Client Authentication', href:'/auth/client-auth', text:'Authenticating from typed Service Clients.' },
                { title:'ServiceStack Auth in MVC', href:'/auth/identity-servicestack', model:'ServiceStack', text:'Sharing auth with ASP.NET Core Identity pages.' },
                { title:'Identity in ASP.NET', href:'/auth/identity-aspnet', text:'Using an existing ASP.NET Identity user database.' },
                { title:'IdentityServer', href:'/auth/identityserver', text:'Delegating authentication to IdentityServer.' },
                { title:'OpenId', href:'/auth/openid', model:'ServiceStack', text:'OpenId 2.0 providers.' },
                { title:'Sign in with Apple', href:'/auth/signin-with-apple', model:'ServiceStack', text:'The full Apple sign-in flow, end to end.' },
              ] },
        ]
        return { stages }
    }
}

/** The recommended, dependency-free way to protect an API */
const AuthorizationAttributes = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The recommended way</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Declarative attributes on the Request DTO</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        These carry no implementation dependency, so they can sit safely on a Request DTO in a shared assembly - which
        also means clients and UIs generated from that DTO know what a call requires before making it.
      </p>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="attr in attrs" :key="attr.name"
             class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{attr.name}}</code>
          <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{attr.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const attrs = [
            { name:'[ValidateIsAuthenticated]', text:'Any signed-in user.' },
            { name:'[ValidateIsAdmin]', text:'Admin users only.' },
            { name:'[ValidateHasRole(role)]', text:'Users assigned this role.' },
            { name:'[ValidateHasClaim(type,value)]', text:'Users carrying this claim.' },
            { name:'[ValidateHasScope(scope)]', text:'Users - or API keys - granted this scope.' },
        ]
        return { attrs }
    }
}

/** Every level [Authenticate] can be applied at */
const ProtectionLevels = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Narrow to broad</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Where authentication can be applied</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="level in levels" :key="level.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', level.accent]">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{level.name}}</div>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', level.tint]">{{level.scope}}</span>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{level.code}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{level.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">GET <code>/auth/{provider}</code> requests are disabled by default</b>
        to discourage sending confidential information in a URL. The exceptions are
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">/auth</code> (checking whether a user is
        authenticated), <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">/auth/logout</code>, and
        OAuth providers that begin their flow by navigating to the route.
      </p>
    </section>`,
    setup() {
        const narrow = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        const mid = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        const broad = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
        const plain = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
        const levels = [
            { name:'A Request DTO', scope:'one API', tint:narrow, accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              code:'[Authenticate] class Protected {}',
              text:'The most precise, and visible to every client generated from the DTO.' },
            { name:'A Service action', scope:'one method', tint:narrow, accent:plain,
              code:'[Authenticate] public object Get(…)',
              text:'When only some verbs on a Service need protecting.' },
            { name:'A verb subset', scope:'chosen verbs', tint:narrow, accent:plain,
              code:'[Authenticate(ApplyTo.Get | ApplyTo.Put)]',
              text:'Require auth for reads and updates while leaving another verb open.' },
            { name:'A Service class', scope:'all its APIs', tint:mid, accent:plain,
              code:'[Authenticate] class MyService : Service',
              text:'Every action on the Service inherits it.' },
            { name:'A base class', scope:'a family', tint:mid, accent:plain,
              code:'[Authenticate] class MyServiceBase',
              text:'Every Service deriving from it is protected - hard to forget on a new Service.' },
            { name:'A global filter', scope:'everything', tint:broad, accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              code:'GlobalRequestFiltersAsync.Add(…)',
              text:'Apply your own rule across every request - deny by default, then allow a known list.' },
        ]
        return { levels }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AuthModels, AuthDocMap, AuthorizationAttributes, ProtectionLevels }
}
