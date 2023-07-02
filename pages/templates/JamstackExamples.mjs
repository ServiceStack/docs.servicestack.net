import { ref } from 'vue'

export default {
    template: `<div>
    <nav class="flex justify-center text-xl space-x-4 mb-3" aria-label="Tabs">
        <span @click="tab='vue'"
              :class="[tab === 'vue' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700 hover:cursor-pointer', 'px-3 py-2 font-medium rounded-md']">
            Vue
        </span>
        <span @click="tab='blazor'"
              :class="[tab === 'blazor' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:cursor-pointer', 'px-3 py-2 font-medium rounded-md']">
            Blazor
        </span>
        <span @click="tab='nextjs'"
              :class="[tab === 'nextjs' ? 'bg-gray-800 text-gray-100' : 'text-gray-500 hover:text-gray-700 hover:cursor-pointer','px-3 py-2 font-medium rounded-md']">
            Next.js
        </span>
    </nav>
</div>
<div class="flex justify-center">
    <div :class="body || 'max-w-screen-sm'">
        <slot :name="tab"></slot>
    </div>
</div>`,
    props: { body: String },
    setup(props) {
        const tab = ref('vue')
        return { tab }
    }
}
