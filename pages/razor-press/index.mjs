import { ref, computed } from "vue"

export const RazorPress = {
    template: `<section class="not-prose w-full flex flex-col justify-center text-center">
    <div class="flex justify-center">
      <div class="w-70">
         <input v-model="project" type="text" placeholder="Project Name" autocorrect="off" spellcheck="false" v-on:keypress="isAlphaNumeric"
                class="mt-1 text-lg block w-full px-3 py-2 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-md text-sm shadow-sm placeholder-slate-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
      </div>
    </div>
    <section class="w-full flex flex-col justify-center text-center">
    <div class="mt-4 mb-2">
       <div class="flex flex-wrap justify-center">
          <div>
               <a class="hover:no-underline" :href="zipUrl('NetCoreTemplates/razor-press')">
                   <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                           <div class="text-4xl text-blue-400 my-3">
                               <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="w-14 h-14 iconify iconify--logos" width="1em" height="1em" viewBox="0 0 256 256"><path fill="#F0047F" d="M128 0C57.221 0 0 57.221 0 128c0 70.778 57.221 128 128 128c70.778 0 128-57.222 128-128V0H128Z"></path><path fill="#FFF" d="M121.04 134.96v93.312c-49.663-2.837-89.64-42.345-93.215-91.81l-.097-1.502h93.312Zm90.962 0c-2.6 49.664-38.816 89.64-84.159 93.215l-1.377.097V134.96h85.536Zm.112-91.074v85.648h-85.648V43.886h85.648Z"></path></svg>
                           </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">Razor Press</div>
                       <div class="flex justify-center h-8"></div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                   </div>
               </a>
               <a class="text-sm text-center mr-4" href="https://razor-press.web-templates.io">razor-press.web-templates.io</a>
           </div>
       </div>
    </div>
    </section>
</section>`,
    setup(props) {
        const project = ref('MyApp')
        const projectZip = computed(() => (project.value || 'MyApp') + '.zip')

        /** @param {string} template */
        const zipUrl = (template) =>
            `https://account.servicestack.net/archive/${template}?Name=${project.value || 'MyApp'}`

        /**@param {KeyboardEvent} e */
        const isAlphaNumeric = (e) => {
            const c = e.charCode;
            if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 95) //A-Za-z0-9_
                return;
            e.preventDefault()
        }
        return { project, projectZip, zipUrl, isAlphaNumeric }
    }
}

export default {
    components: {
        RazorPress,
    }
}