import { ref, computed } from "vue"

export default {
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
               <a class="hover:no-underline" :href="zipUrl('NetCoreTemplates/worker-rabbitmq')">
                   <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                           <div class="text-4xl text-blue-400 my-3">
                               <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#f60" d="M119.517 51.188H79.291a3.641 3.641 0 0 1-3.64-3.642V5.62A5.605 5.605 0 0 0 70.028 0H55.66a5.606 5.606 0 0 0-5.627 5.62v41.646a3.913 3.913 0 0 1-3.92 3.925l-13.188.047c-2.176 0-3.972-1.75-3.926-3.926l.094-41.687A5.606 5.606 0 0 0 23.467 0H9.1a5.61 5.61 0 0 0-5.626 5.625V122.99c0 2.737 2.22 5.01 5.01 5.01h111.033a5.014 5.014 0 0 0 5.008-5.011V56.195a4.975 4.975 0 0 0-5.008-5.007zM100.66 95.242a6.545 6.545 0 0 1-6.525 6.524H82.791a6.545 6.545 0 0 1-6.523-6.524V83.9a6.545 6.545 0 0 1 6.523-6.524h11.343a6.545 6.545 0 0 1 6.525 6.523zm0 0"/></svg>
                           </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">RabbitMQ Worker</div>
                       <div class="flex justify-center h-8">
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">mq</span>
                            </div>
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">rabbitmq</span>
                            </div>
                        </div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                   </div>
               </a>
           </div>
          <div>
               <a class="hover:no-underline" :href="zipUrl('NetCoreTemplates/worker-redismq')">
                   <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                           <div class="text-4xl text-blue-400 my-3">
                               <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#A41E11" d="M121.8 93.1c-6.7 3.5-41.4 17.7-48.8 21.6c-7.4 3.9-11.5 3.8-17.3 1S13 98.1 6.3 94.9c-3.3-1.6-5-2.9-5-4.2V78s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9v12.5c0 1.3-1.5 2.7-4.9 4.4z"/><path fill="#D82C20" d="M121.8 80.5C115.1 84 80.4 98.2 73 102.1c-7.4 3.9-11.5 3.8-17.3 1c-5.8-2.8-42.7-17.7-49.4-20.9C-.3 79-.5 76.8 6 74.3c6.5-2.6 43.2-17 51-19.7c7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.9z"/><path fill="#A41E11" d="M121.8 72.5C115.1 76 80.4 90.2 73 94.1c-7.4 3.8-11.5 3.8-17.3 1C49.9 92.3 13 77.4 6.3 74.2c-3.3-1.6-5-2.9-5-4.2V57.3s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9V68c0 1.3-1.5 2.7-4.9 4.5z"/><path fill="#D82C20" d="M121.8 59.8c-6.7 3.5-41.4 17.7-48.8 21.6c-7.4 3.8-11.5 3.8-17.3 1C49.9 79.6 13 64.7 6.3 61.5s-6.8-5.4-.3-7.9c6.5-2.6 43.2-17 51-19.7c7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.9z"/><path fill="#A41E11" d="M121.8 51c-6.7 3.5-41.4 17.7-48.8 21.6c-7.4 3.8-11.5 3.8-17.3 1C49.9 70.9 13 56 6.3 52.8c-3.3-1.6-5.1-2.9-5.1-4.2V35.9s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9v12.5c.1 1.3-1.4 2.6-4.8 4.4z"/><path fill="#D82C20" d="M121.8 38.3C115.1 41.8 80.4 56 73 59.9c-7.4 3.8-11.5 3.8-17.3 1S13 43.3 6.3 40.1s-6.8-5.4-.3-7.9c6.5-2.6 43.2-17 51-19.7c7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.8z"/><path fill="#fff" d="m80.4 26.1l-10.8 1.2l-2.5 5.8l-3.9-6.5l-12.5-1.1l9.3-3.4l-2.8-5.2l8.8 3.4l8.2-2.7L72 23zM66.5 54.5l-20.3-8.4l29.1-4.4z"/><ellipse cx="38.4" cy="35.4" fill="#fff" rx="15.5" ry="6"/><path fill="#7A0C00" d="m93.3 27.7l17.2 6.8l-17.2 6.8z"/><path fill="#AD2115" d="m74.3 35.3l19-7.6v13.6l-1.9.8z"/></svg>
                           </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">Redis Worker</div>
                       <div class="flex justify-center h-8">
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">mq</span>
                            </div>
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">redis</span>
                            </div>
                        </div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                   </div>
               </a>
           </div>
          <div>
               <a class="hover:no-underline" :href="zipUrl('NetCoreTemplates/worker-servicebus')">
                   <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                           <div class="text-4xl text-blue-400 my-3">
                               <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m15.37 13.68l-4-12a1 1 0 0 0-1-.68H5.63a1 1 0 0 0-.95.68l-4.05 12a1 1 0 0 0 1 1.32h2.93a1 1 0 0 0 .94-.68l.61-1.78l3 2.27a1 1 0 0 0 .6.19h4.68a1 1 0 0 0 .98-1.32Zm-5.62.66a.32.32 0 0 1-.2-.07L3.9 10.08l-.09-.07h3l.08-.21l1-2.53l2.24 6.63a.34.34 0 0 1-.38.44Zm4.67 0H10.7a1 1 0 0 0 0-.66l-4.05-12h3.72a.34.34 0 0 1 .32.23l4.05 12a.34.34 0 0 1-.32.43Z" clip-rule="evenodd"/></svg>
                           </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">ServiceBus Worker</div>
                       <div class="flex justify-center h-8">
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">mq</span>
                            </div>
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">servicebus</span>
                            </div>
                        </div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                   </div>
               </a>
           </div>
          <div>
               <a class="hover:no-underline" :href="zipUrl('NetCoreTemplates/worker-sqs')">
                   <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                           <div class="text-4xl text-blue-400 my-3">
                               <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M6.584 9.01c-1.36 0-2.74.53-2.97.82c-.06.12-.2 1.09.13 1.09c.11 0 .16.02.48-.13c1.2-.47 1.96-.46 2.07-.46c1.35-.13 2.13.79 2.01 1.98v.7c-1.14-.27-1.79-.28-2.11-.28c-1.66-.1-3.194.776-3.194 2.7c0 2.11 1.883 2.56 2.613 2.53c1.09.01 2.13-.48 2.82-1.33c.55 1.23.9 1.15.91 1.15c.1 0 .18-.04.26-.09l.57-.4c.1-.06.18-.16.19-.28c-.01-.29-.53-.74-.49-1.75v-3.12a3.179 3.179 0 0 0-.799-2.35a3.42 3.42 0 0 0-2.49-.78zm19.373 0c-2 0-3.15 1.25-3.12 2.52c0 1.74 1.76 2.29 1.96 2.35c1.69.53 1.92.55 2.39.95c.4.41.35 1.21-.24 1.56c-.17.1-.9.54-2.55.2c-.55-.11-.84-.24-1.29-.43c-.12-.04-.4-.11-.4.26v.49c0 .23.14.44.35.54c1.05.53 2.31.55 2.58.55c.04 0 2.34.001 3.11-1.55c.158-.32.57-1.49-.2-2.49c-.64-.75-1.19-.83-2.83-1.33c-.14-.04-1.35-.35-1.34-1.2c-.06-1.09 1.42-1.15 1.73-1.13c1.25-.02 1.87.45 2.21.48c.15 0 .22-.09.22-.29v-.46a.487.487 0 0 0-.09-.31c-.4-.52-1.93-.71-2.49-.71zm-15.18.25c-.11.02-.19.13-.17.24c.02.13.04.26.09.39l2.24 7.39c.05.24.21.5.56.46h.82c.5.05.57-.43.58-.48l1.47-6.16l1.49 6.17c.01.05.08.53.57.48h.83c.36.04.53-.22.58-.46c2.52-8.11 2.35-7.56 2.37-7.64c.04-.42-.2-.39-.24-.38h-.89c-.45-.05-.54.36-.56.46l-1.66 6.41l-1.5-6.41c-.07-.49-.47-.47-.57-.46h-.77c-.44-.04-.55.31-.58.46l-1.49 6.32l-1.6-6.32c-.04-.2-.17-.51-.56-.47h-1.01zm-4.254 4.63c.72.01 1.342.12 1.772.22c0 .5.018.78-.092 1.23c-.14.48-.759 1.35-2.219 1.37c-.84.04-1.39-.62-1.34-1.37c-.05-1.2 1.19-1.5 1.88-1.45zm22.518 6.112c-.933.013-2.035.222-2.871.809c-.258.179-.213.427.074.394c.94-.113 3.032-.367 3.406.111c.375.478-.414 2.45-.763 3.332c-.108.263.12.372.361.172c1.564-1.31 1.97-4.056 1.65-4.45c-.16-.198-.924-.381-1.857-.368zm-27.824 1c-.218.03-.312.306-.084.525C5.05 25.201 10.226 27 15.973 27c4.099 0 8.857-1.337 12.142-3.857c.543-.42.08-1.047-.476-.8c-3.683 1.626-7.684 2.409-11.325 2.409c-5.396 0-10.62-1.127-14.845-3.686a.39.39 0 0 0-.252-.064z"/></svg>
                           </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">SQS Worker</div>
                       <div class="flex justify-center h-8">
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">mq</span>
                            </div>
                            <div class="mr-1">
                                <span class="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">sqs</span>
                            </div>
                        </div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                   </div>
               </a>
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
