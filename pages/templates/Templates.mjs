import { ref, computed } from 'vue'
import Icons from './Icons.mjs'

export function template(repo, name, icon, tags, demo) {
    return { repo, name, icon, tags: tags ?? [], demo: demo ?? `${repo}.web-templates.io` }
}

export const Index = [
    template('blazor', 'Blazor', 'Blazor', ['tailwind']),
    template('blazor-vue', 'Blazor Vue', 'Blazor',['tailwind']),
    template('mvc', 'MVC', 'Windows',['tailwind']),
    template('razor', 'Razor Pages', 'Razor',['tailwind']),
    template('mvc-bootstrap', 'MVC', 'Windows',['bootstrap']),
    template('razor-bootstrap', 'Razor Pages', 'Razor',['bootstrap']),
    template('vue-mjs', 'Razor Pages', 'Razor',['tailwind','autoquery']),
    template('nextjs', 'Next.js', 'Nextjs',['tailwind','autoquery']),
    template('vue-static', 'Vue Static', 'Vue',['tailwind','autoquery']),
    template('razor-pages', 'Razor Pages', 'Razor',['bootstrap']),
    template('mvcauth', 'MVC', 'Windows',['bootstrap']),
    template('script', 'MVC', 'Windows',['bootstrap']),
    template('vue-spa', 'Vue SPA', 'Vue',['bootstrap']),
    template('react-spa', 'React SPA', 'React',['bootstrap']),
    template('angular-spa', 'Angular SPA', 'Angular',['bootstrap']),
    template('kmp-desktop', 'Compose Desktop', 'Compose',['kotlin','desktop']),
].reduce((acc, template) => { acc[template.repo] = template; return acc}, {})

export default {
    template:`<div>
<section class="w-full flex flex-col justify-center text-center">
   <div id="empty" class="mt-4 mb-2">
      <div class="flex justify-center mb-8">
         <div class="w-70">
            <input v-model="project" type="text" placeholder="Project Name" autocorrect="off" spellcheck="false" @keypress="isAlphaNumeric"
                   class="mt-1 text-lg block w-full px-3 py-2 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-md text-sm shadow-sm placeholder-slate-400
                          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
         </div>
      </div>
   </div>
</section>
<section :class="['w-full flex grid gap-4 text-center', templates.length === 1 
    ? 'grid-cols-1' 
    : templates.length === 2 
        ? 'grid-cols-2 max-w-md mx-auto' 
        : 'grid-cols-3']">
   <div v-for="template in templates" class="mb-2">
      <div class="flex justify-center text-center">
         <a class="archive-url hover:no-underline" :href="zipUrl('NetCoreTemplates/' + template.repo)">
            <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600 dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
               <div class="text-center font-extrabold flex items-center justify-center mb-2">
                  <div class="text-4xl text-blue-400 my-3" v-html="svgIcon(template.icon)">
                  </div>
               </div>
               <div class="text-xl font-medium text-gray-700">{{ template.name }}</div>
               <div class="flex justify-center h-8">
                    <div v-for="tag in template.tags" class="mr-1">
                        <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">{{tag}}</span>
                    </div>               
               </div>
               <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
               <div class="count mt-1 text-gray-400 text-sm"></div>
            </div>
         </a>
      </div>
      <a v-if="template.demo && hide !== 'demo'" :href="'https://' + template.demo">{{template.demo}}</a>
   </div>
</section>   
</div>`,
    props: { templates: Array, hide:String },
    setup(props) {

        const project = ref('MyApp')
        const projectZip = computed(() => (project.value || 'MyApp') + '.zip')
        
        /** @param {string} template */
        const zipUrl = (template) =>
            `https://account.servicestack.net/archive/${template}?Name=${project.value || 'MyApp'}`

        /** @param {KeyboardEvent} e */
        const isAlphaNumeric = (e) => {
            const c = e.charCode;
            if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 95) //A-Za-z0-9_
                return;
            e.preventDefault()
        }
        
        const svgIcon = (icon) => Icons[icon] ?? Icons.ServiceStack
        
        return { project, projectZip, zipUrl, isAlphaNumeric, svgIcon, }
    }
}
