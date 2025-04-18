import { ref } from "vue"

const AnalyticsUi = {
    template: `
  <section>
    <div id="analytics" class="bg-white dark:bg-black pb-12">
    <div class="py-8">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
            <h1 class="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">          
                {{ adminUis[routes.page]?.title || adminUis.dashboard.title }}
            </h1>
            <p class="mt-4 text-lg leading-8 text-gray-600">
                {{ adminUis[routes.page]?.summary || adminUis.dashboard.summary }}
            </p>
            </div>
            
            <nav class="py-4 flex items-center justify-between px-4 sm:px-0">
            <div class="-mt-px flex w-0 flex-1 select-none">
                <a @click="navTo(adminUiKeys[adminUiKeys.findIndex(x => x == routes.page) - 1] ?? adminUiKeys[adminUiKeys.length-1])" class="cursor-pointer inline-flex items-center pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                <svg class="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clip-rule="evenodd" />
                </svg>
                Previous
                </a>
            </div>
            <div class="hidden md:-mt-px md:flex select-none">
                <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
                <div>
                    <nav class="flex items-center justify-center" aria-label="Progress">
                    <ol role="list" class="ml-8 flex items-center space-x-5">
                        <li v-for="(label,id,index) in adminUis">
                        <a @click="navTo(id)" class="cursor-pointer block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                            <span class="sr-only">Step 1</span>
                            <span v-if="(routes.page) == id" class="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true"></span>
                        </a>
                        </li>
                    </ol>
                    </nav>
                </div>
            </div>
            <div class="-mt-px flex w-0 flex-1 justify-end select-none">
                <a @click="navTo(adminUiKeys[adminUiKeys.findIndex(x => x == routes.page) + 1])" class="cursor-pointer inline-flex items-center pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Next
                <svg class="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
                </svg>
                </a>
            </div>
            </nav>
                    
            <div class="mt-8 flow-root select-none">
            <div v-on:click="onNav()" class="cursor-pointer -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img :src="'/img/pages/admin-ui/carousel/'+(routes.page || 'dashboard')+'.webp'" alt="Admin UI Screenshot" width="2432" height="1442" class="rounded-md shadow-2xl ring-1 ring-gray-900/10">
            </div>
            </div>
        </div>
    </div>  

    </div>
  </section>    
    `,
    setup() {

        const routes = ref({ page: 'dashboard' })

        const adminUis = {
            'dashboard': {
                title: 'Dashboard',
                summary: 'High-level overview stats on number and type of APIs and internal counters',
                href: 'https://docs.servicestack.net/admin-ui',
            },
            'analytics': {
                title: 'Analytics',
                summary: 'Comprehensive In Depth & Interactive API Analytics',
                href: 'https://docs.servicestack.net/admin-ui-analytics',
            },
            'users': {
                title: 'IdentityAuth Users',
                summary: 'Customizable ASP.NET Core Identity Auth User Management',
                href: 'https://docs.servicestack.net/admin-ui-identity-users',
            },
            'roles': {
                title: 'IdentityAuth Roles',
                summary: 'Manage App ASP.NET Core Identity Auth Roles and Claims',
                href: 'https://docs.servicestack.net/admin-ui-identity-roles',
            },
            'apikeys': {
                title: 'API Keys',
                summary: 'Customizable, fine-grain and integrated API Key management',
                href: 'https://docs.servicestack.net/auth/apikeys',
            },
            'logging': {
                title: 'Request Logging',
                summary: 'Rich, detailed, queryable and rolling Request Logs',
                href: 'https://docs.servicestack.net/admin-ui-profiling',
            },
            'profiling': {
                title: 'Profiling',
                summary: 'Observable, Diagnostic Source profiling event viewer',
                href: 'https://docs.servicestack.net/admin-ui-profiling',
            },
            'commands': {
                title: 'Commands',
                summary: 'Use Commands as building blocks for robust and observable systems',
                href: 'https://docs.servicestack.net/commands',
            },
            'backgroundjobs': {
                title: 'Background Jobs',
                summary: 'Effortless management of Background Jobs and Scheduled Tasks',
                href: 'https://docs.servicestack.net/background-jobs',
            },
            'validation': {
                title: 'DB Validation Rules',
                summary: 'Manage dynamic Type and Property Rule Validators',
                href: 'https://docs.servicestack.net/admin-ui-validation',
            },
            'database': {
                title: 'Database Browser',
                summary: "Browse RDBMS tables of all App's configured databases",
                href: 'https://docs.servicestack.net/admin-ui-database',
            },
            'redis': {
                title: 'Redis Admin',
                summary: "Inspect, browse and modify the App's configured Redis instance",
                href: 'https://docs.servicestack.net/admin-ui-redis',
            },
        }
        const adminUiKeys = Object.keys(adminUis)

        function onNav() {
            location.href = adminUis[routes.value.page]?.href || adminUis.dashboard.href
        }

        function navTo(page) {
            routes.value.page = page || adminUiKeys[0]
        }

        return {
            routes,
            adminUis,
            adminUiKeys,
            onNav,
            navTo,
        }
    }
}

export default {
    components: {
        AnalyticsUi,
    },
}
