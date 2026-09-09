import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"

/** Every shipped IAuthRepository implementation */
const RepoCatalog = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="One interface, many back-ends" title="Where ServiceStack Auth can store users"
        description="All of these implement the same IAuthRepository, so the Auth Providers, Admin UIs and your own code work identically whichever you register."
        placeholder="Search…" :features="features" />`,
    setup() {
        const features = [
            { name:'OrmLite', category:'RDBMS', href:'#registering-an-auth-repository', badge:'most common',
              text:'OrmLiteAuthRepository in ServiceStack.Server - any RDBMS OrmLite supports.', keywords:'sql server postgres mysql sqlite rdbms database' },
            { name:'OrmLite Multitenancy', category:'RDBMS', href:'/multitenancy#multitenancy-rdbms-authprovider',
              text:'OrmLiteAuthRepositoryMultitenancy - users partitioned per tenant.', keywords:'tenant saas multi' },
            { name:'Redis', category:'NoSQL', href:'#registering-an-auth-repository',
              text:'RedisAuthRepository in ServiceStack.', keywords:'cache in-memory fast' },
            { name:'AWS DynamoDB', category:'NoSQL', href:'#registering-an-auth-repository',
              text:'DynamoDbAuthRepository in ServiceStack.Aws.', keywords:'aws cloud serverless' },
            { name:'MongoDB', category:'NoSQL', href:'#registering-an-auth-repository',
              text:'MongoDBAuthRepository in ServiceStack.Authentication.MongoDB.', keywords:'document nosql' },
            { name:'RavenDB', category:'NoSQL', href:'#registering-an-auth-repository',
              text:'RavenUserAuthRepository in ServiceStack.Authentication.RavenDB.', keywords:'document nosql' },
            { name:'Marten', category:'Community', href:'https://github.com/migajek/ServiceStack.Authentication.Marten',
              text:'MartenAuthRepository - Postgres document store.', keywords:'postgres document community' },
            { name:'LiteDB', category:'Community', href:'https://github.com/CaveBirdLabs/ServiceStack.Authentication.LiteDB',
              text:'LiteDBAuthRepository - embedded document database.', keywords:'embedded local community' },
            { name:'In Memory', category:'Testing', href:'#registering-an-auth-repository',
              text:'InMemoryAuthRepository in ServiceStack - nothing persisted.', keywords:'test dev memory' },
        ]
        return { features }
    }
}

/** The shape of the data an Auth Repository keeps */
const UserAuthSchema = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Stable since release</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What an Auth Repository stores</h3>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in tables" :key="t.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', t.accent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{t.name}}</code>
            <span v-if="t.badge" class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{t.badge}}</span>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{t.text}}</p>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div v-for="way in extend" :key="way.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{way.name}}</div>
          <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{way.text}}</p>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">InitSchema()</code> creates whatever
        the registered repository needs. Roles and permissions are blobbed on
        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">UserAuth</code> by default, or split
        into their own table with
        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">UseDistinctRoleTables = true</code>.
      </p>
    </section>`,
    setup() {
        const tables = [
            { name:'UserAuth', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'The user record - credentials, profile, and by default their roles and permissions.' },
            { name:'UserAuthDetails', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'One row per external provider a user has linked, so several logins can resolve to one account.' },
            { name:'UserAuthRole', badge:'optional', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Roles and permissions as queryable rows instead of a blob, when you need to query across users.' },
        ]
        const extend = [
            { name:'Custom columns', text:'Extend the UserAuth tables with your own typed fields.' },
            { name:'Meta dictionaries', text:'Attach additional metadata without a schema change.' },
            { name:'RefId / RefIdStr', text:'Link a user to your own referential data.' },
        ]
        return { tables, extend }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, FeatureMatrix, RepoCatalog, UserAuthSchema }
}
