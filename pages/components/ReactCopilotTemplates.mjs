import Icons from './Icons.mjs'

export default {
  name: 'ProjectTemplateSelector',
  data() {
    return {
      templates: [
        {
          id: 'vite',
          name: 'React Vite SPA',
          description: 'Empty SPA, fast development UX with Vite. Best for pure client-side apps.',
          url: 'https://github.com/new?template_name=react-static&template_owner=NetCoreTemplates',
          // Tailwind Colors
          colorBg: 'bg-blue-500',
          colorText: 'text-blue-500',
          hoverBorder: 'group-hover:border-blue-500/50',
          hoverText: 'group-hover:text-blue-600',
          iconXml: Icons.ReactNative,
        },
        {
          id: 'next',
          name: 'Next.js Static',
          description: 'Full-stack React framework using App Router configured for SSG static exports, SEO optimization built-in.',
          url: 'https://github.com/new?template_name=nextjs&template_owner=NetCoreTemplates',
          // Tailwind Colors
          colorBg: 'bg-slate-900',
          colorText: 'text-slate-900',
          hoverBorder: 'group-hover:border-slate-900/50',
          hoverText: 'group-hover:text-slate-900',
          iconXml: Icons.NextjsNative,
        },
      ]
    }
  },
  template: `
    <div class="max-w-5xl mx-auto px-6 py-12 font-sans">
      <!-- Header Section -->
      <div class="text-center mb-12 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium uppercase tracking-wide">
          <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.922 16.992c-.861 1.495-5.859 5.023-11.922 5.023-6.063 0-11.061-3.528-11.922-5.023A.641.641 0 0 1 0 16.736v-2.869a.841.841 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.195 10.195 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952 1.399-1.136 3.392-2.093 6.122-2.093 2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.832.832 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256ZM12.172 11h-.344a4.323 4.323 0 0 1-.355.508C10.703 12.455 9.555 13 7.965 13c-1.725 0-2.989-.359-3.782-1.259a2.005 2.005 0 0 1-.085-.104L4 11.741v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.323 4.323 0 0 1-.355-.508h-.016.016Zm.641-2.935c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z"></path><path d="M14.5 14.25a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Zm-5 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z"></path>
          </svg>
          GitHub Copilot Ready
        </div>
        <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight">
          Jumpstart your project with Copilot
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Select a React .NET template to instantly scaffold a new repository with Copilot.
          Describe what you want to build, and Copilot will generate the initial implementation and open a pull request.
        </p>
      </div>

      <!-- Grid Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
          v-for="template in templates"
          :key="template.id"
          :href="template.url"
          rel="noopener noreferrer"
          class="group relative flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1"
          :class="template.hoverBorder"
        >
          <!-- Top Decoration Line -->
          <div 
            class="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="template.colorBg"
          ></div>

          <div class="flex items-start justify-between mb-4">
            <!-- 
              Icon Container 
              Note: [&>svg] selectors force the pasted SVG to be 32x32px 
            -->
            <div 
              class="p-3 bg-slate-50 rounded-xl group-hover:bg-white group-hover:scale-110 transition-all duration-300 border border-slate-100 [&>svg]:w-8 [&>svg]:h-8"
              :class="template.colorText"
              v-html="template.iconXml"
            >
          </div>
            
            <!-- External Link Icon -->
            <span class="text-slate-300 group-hover:text-slate-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </span>
          </div>

          <h3 
            class="text-xl font-bold text-slate-900 mb-2 transition-colors"
            :class="template.hoverText"
          >
            {{ template.name }}
          </h3>
          
          <p class="text-slate-500 text-sm leading-relaxed flex-grow">
            {{ template.description }}
          </p>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
               :class="template.colorText">
            Use Template <span class="ml-1">&rarr;</span>
          </div>
        </a>
      </div>
    </div>
  `
}