import { ref, computed } from 'vue'

export default {
    template:`<div>
<section class="w-full flex flex-col justify-center text-center">
   <div id="empty" class="mt-4 mb-2">
      <div class="flex justify-center mb-16">
         <div class="w-70">
            <input v-model="project" type="text" placeholder="Project Name" autocorrect="off" spellcheck="false" @keypress="isAlphaNumeric"
                   class="mt-1 text-lg block w-full px-3 py-2 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-md text-sm shadow-sm placeholder-slate-400
                          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
         </div>
      </div>
      <div id="ssg" class="mt-4 mb-2">
         <h3 class="text-gray-400 text-xl mb-2">SSG Templates</h3>
         <div class="flex flex-wrap justify-center">
            <div>
               <a class="archive-url hover:no-underline" :href="zipUrl('NetCoreTemplates/razor-ssg')">
                  <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                     <div class="text-center font-extrabold flex items-center justify-center mb-2">
                        <div class="text-4xl text-blue-400 my-3">
                           <svg class="w-14 h-14 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#368832" d="M23.844 27.692a16.332 16.332 0 0 1-6.645 1.3q-6.364 0-10.013-3.243a11.3 11.3 0 0 1-3.649-8.9a13.716 13.716 0 0 1 3.785-9.898A12.716 12.716 0 0 1 16.9 3.008a11.676 11.676 0 0 1 8.425 3.006a9.994 9.994 0 0 1 3.142 7.533a10.187 10.187 0 0 1-2.318 7.114a7.532 7.532 0 0 1-5.817 2.547a2.613 2.613 0 0 1-1.845-.642a2.323 2.323 0 0 1-.764-1.6a4.9 4.9 0 0 1-4.148 2.243a4.6 4.6 0 0 1-3.507-1.479a5.706 5.706 0 0 1-1.384-4.063a9.913 9.913 0 0 1 2.2-6.357q2.2-2.763 4.8-2.763a5.063 5.063 0 0 1 4.256 1.716l.311-1.338h2.405l-2.081 9.08a10.716 10.716 0 0 0-.352 2.243q0 .972.744.972a4.819 4.819 0 0 0 3.877-2.047a8.93 8.93 0 0 0 1.621-5.681a7.98 7.98 0 0 0-2.675-6.175a9.887 9.887 0 0 0-6.919-2.432a10.6 10.6 0 0 0-8.158 3.467a12.066 12.066 0 0 0-3.2 8.495a9.561 9.561 0 0 0 3.06 7.573q3.06 2.7 8.586 2.7a13.757 13.757 0 0 0 5.675-1.054ZM19.466 12.25a3.977 3.977 0 0 0-3.6-1.716q-1.824 0-3.263 2.23a8.726 8.726 0 0 0-1.439 4.824q0 3.635 2.905 3.635a3.771 3.771 0 0 0 2.651-1.183a6.309 6.309 0 0 0 1.7-3.2Z"/></svg>
                        </div>
                     </div>
                     <div class="text-xl font-medium text-gray-700">Razor SSG</div>
                     <div class="flex justify-center h-8"></div>
                     <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                     <div class="count mt-1 text-gray-400 text-sm"></div>
                  </div>
               </a>
               <a class="text-sm text-center mr-4" href="https://razor-ssg.web-templates.io">razor-ssg.web-templates.io</a>
            </div>
            <div>
               <a class="archive-url hover:no-underline" :href="zipUrl('NetCoreTemplates/nextjs')">
                  <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                     <div class="text-center font-extrabold flex items-center justify-center mb-2">
                        <div class="text-4xl text-blue-400 my-3">
                           <svg class="w-14 h-14 bg-white text-gray-900 rounded-full" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="M386.399 35.508C217.06-64.061 1.885 57.55.012 253.882c-1.828 191.716 201.063 315.545 370.02 231.163L185.56 213.636v167.997c0 18.614-35.619 18.614-35.619 0V156.421c0-14.776 27.448-15.989 35.226-3.145L395.43 470.572c157.95-101.737 155.817-338.136-9.031-435.064zm-23.756 317.939L326.91 298.87V149.458c0-13.932 35.732-13.932 35.732 0v203.989z"/></svg>
                        </div>
                     </div>
                     <div class="text-xl font-medium text-gray-700">Next.js</div>
                     <div class="flex justify-center h-8"></div>
                     <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                     <div class="count mt-1 text-gray-400 text-sm"></div>
                  </div>
               </a>
               <a class="text-sm text-center mr-4" href="https://nextjs.jamstacks.net">nextjs.jamstacks.net</a>
            </div>
            <div>
               <a class="archive-url hover:no-underline" :href="zipUrl('NetCoreTemplates/vue-ssg')">
                  <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                     <div class="text-center font-extrabold flex items-center justify-center mb-2">
                        <div class="text-4xl text-blue-400 my-3">
                           <svg class="w-14 h-14" xmlns="http://www.w3.org/2000/svg" width="256" height="221" viewBox="0 0 256 221"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"/><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"/></svg>
                        </div>
                     </div>
                     <div class="text-xl font-medium text-gray-700">Vue SSG</div>
                     <div class="flex justify-center h-8"></div>
                     <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                     <div class="count mt-1 text-gray-400 text-sm"></div>
                  </div>
               </a>
               <a class="text-sm text-center mr-4" href="https://vue-ssg.jamstacks.net">vue-ssg.jamstacks.net</a>
            </div>
         </div>
      </div>
   </div>
</section>
<section class="w-full flex flex-col justify-center text-center">
   <div id="spa" class="mt-4 mb-2">
      <h3 class="text-gray-400 text-xl mb-2">SPA Templates</h3>
      <div class="flex flex-wrap justify-center">
         <div>
            <a class="archive-url hover:no-underline" :href="zipUrl('NetCoreTemplates/blazor')">
               <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600 dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                  <div class="text-center font-extrabold flex items-center justify-center mb-2">
                     <div class="text-4xl text-blue-400 my-3">
                        <svg class="w-14 h-14 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
                     </div>
                  </div>
                  <div class="text-xl font-medium text-gray-700">Blazor Tailwind</div>
                  <div class="flex justify-center h-8"></div>
                  <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                  <div class="count mt-1 text-gray-400 text-sm"></div>
               </div>
            </a>
            <a class="text-sm text-center mr-4" href="https://blazor.web-templates.io">blazor.web-templates.io</a>
         </div>
         <div>
            <a class="archive-url hover:no-underline netcoretemplates_vue-vite" :href="zipUrl('NetCoreTemplates/vue-vite')">
               <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                  <div class="text-center font-extrabold flex items-center justify-center mb-2">
                     <div class="text-4xl text-blue-400 my-3">
                       <svg class="w-14 h-14" xmlns="http://www.w3.org/2000/svg" width="256" height="221" viewBox="0 0 256 221"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"/><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"/></svg>
                     </div>
                  </div>
                  <div class="text-xl font-medium text-gray-700">Vue Vite</div>
                  <div class="flex justify-center h-8"></div>
                  <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                  <div class="count mt-1 text-gray-400 text-sm"></div>
               </div>
            </a>
            <a class="text-sm text-center mr-4" href="https://vue-vite.jamstacks.net">vue-vite.jamstacks.net</a>
         </div>
         <div>
            <a class="archive-url hover:no-underline netcoretemplates_blazor_wasm" :href="zipUrl('NetCoreTemplates/blazor-wasm')">
               <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600 dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                  <div class="text-center font-extrabold flex items-center justify-center mb-2">
                     <div class="text-4xl text-blue-400 my-3">
                        <svg class="w-14 h-14 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
                     </div>
                  </div>
                  <div class="text-xl font-medium text-gray-700">Blazor WASM</div>
                  <div class="flex justify-center h-8"></div>
                  <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                  <div class="count mt-1 text-gray-400 text-sm"></div>
               </div>
            </a>
            <a class="text-sm text-center mr-4" href="https://blazor-wasm.jamstacks.net">blazor-wasm.jamstacks.net</a>
         </div>
      </div>
   </div>
</section>   
</div>`,
    setup() {
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
