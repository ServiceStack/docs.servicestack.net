import Templates, { Index } from "../templates/Templates.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"

const ServicestackAuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['vue-mjs'], Index['nextjs'], Index['vue-static'], Index['razor-pages'], Index['mvcauth'], Index['script'], Index['vue-spa'], Index['react-spa'], Index['angular-spa']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

/** The whole Auth Provider catalog, filterable by how it authenticates */
const ProviderCatalog = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Pick as many as you need" title="The built-in Auth Providers"
        description="Register several at once - the same attributes and APIs authorize a user however they signed in, so your Services never learn which provider was used."
        placeholder="Search…" :features="features" />`,
    setup() {
        const features = [
            { name:'CredentialsAuthProvider', category:'Session', href:'#credentials-auth-provider', badge:'most common',
              text:'/auth/credentials - standard username/password sign-in.', keywords:'password login form username' },
            { name:'BasicAuthProvider', category:'Session', href:'#auth-providers',
              text:'Username/password sent via HTTP Basic Auth.', keywords:'http basic header' },
            { name:'DigestAuthProvider', category:'Session', href:'#auth-providers',
              text:'Username/password hash via HTTP Digest Auth.', keywords:'http digest hash' },
            { name:'JwtAuthProvider', category:'Per-request', href:'/auth/jwt-authprovider',
              text:'Stateless authentication with JSON Web Tokens and refresh tokens.', keywords:'jwt bearer token stateless microservice' },
            { name:'ApiKeyAuthProvider', category:'Per-request', href:'/auth/api-key-authprovider',
              text:'Let third parties authenticate without a password.', keywords:'api key bearer machine' },
            { name:'FacebookAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/facebook', keywords:'social oauth meta' },
            { name:'TwitterAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/twitter', keywords:'social oauth x' },
            { name:'GoogleAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/google', keywords:'social oauth gmail' },
            { name:'GithubAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/github', keywords:'social oauth developer' },
            { name:'MicrosoftGraphAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/microsoftgraph', keywords:'social oauth azure entra' },
            { name:'LinkedInAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/linkedin', keywords:'social oauth' },
            { name:'YammerAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/yammer', keywords:'social oauth' },
            { name:'YandexAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/yandex', keywords:'social oauth' },
            { name:'VkAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/vkcom', keywords:'social oauth' },
            { name:'OdnoklassnikiAuthProvider', category:'OAuth', href:'#oauth-providers', text:'/auth/odnoklassniki', keywords:'social oauth' },
            { name:'Sign in with Apple', category:'OAuth', href:'/auth/signin-with-apple', text:'The full Apple sign-in flow.', keywords:'apple ios social oauth' },
            { name:'AspNetWindowsAuthProvider', category:'Platform', href:'#auth-providers',
              text:'Windows Auth built into ASP.NET.', keywords:'windows ntlm active directory intranet' },
            { name:'NetCoreIdentityAuthProvider', category:'Platform', href:'/auth/identity-auth',
              text:'Bi-directional adapter delegating to ASP.NET Core Identity or IdentityServer.', keywords:'identity claims identityserver bridge' },
        ]
        return { features }
    }
}

/** Session-based vs per-request authentication */
const AuthLifetimes = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="m in modes" :key="m.name"
           :class="['flex flex-col rounded-2xl border-2 p-6 shadow-sm', m.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{m.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{m.name}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{m.tagline}}</div>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
        <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Providers</div>
        <ul class="mt-2 flex flex-wrap gap-1.5">
          <li v-for="p in m.providers" :key="p"
              class="rounded-lg bg-white/80 px-2.5 py-1 font-mono text-[11px] text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{p}}</li>
        </ul>
      </div>
      <p class="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">The difference is transparent to your Application.</b> Whichever kind
        authenticated the caller, the same attributes and APIs retrieve, validate and authorize the user.
      </p>
    </section>`,
    setup() {
        const modes = [
            { icon:'🍪', name:'Session Auth', tagline:'Authenticate once, then a cookie',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Standard HTTP session authentication - a session cookie references the user\u2019s session POCO in your registered caching provider, and lasts until it expires or the user signs out.',
              providers:['Credentials','Basic','Digest','OAuth providers'] },
            { icon:'⚡', name:'Per-request Auth', tagline:'Every request carries its own proof',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The authenticated session is attached to the current IRequest and lasts only for it - nothing is stored between calls, which is what suits stateless services and machine callers.',
              providers:['JWT','API Keys','Basic','Digest'] },
        ]
        return { modes }
    }
}

export default {
    install(app) {
    },
    components: {
        ServicestackAuthTemplates,
        FeatureMatrix,
        ProviderCatalog,
        AuthLifetimes,
    },
    setup() {
        return { }
    }
}
