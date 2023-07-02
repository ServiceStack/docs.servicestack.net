import { ref, onMounted } from "vue"

const Wrap = {
    template:`<div v-html="html"></div>`,
    props:{ url:String },
    setup(props) {
        const html = ref('')
        fetch(props.url)
            .then(r => r.text())
            .then(txt => {
                html.value = txt
                setTimeout(() => globalThis.hljs.highlightAll(), 1)
            })
        return { html}
    }
}
const components = { Wrap }

export const ServerLoginUis = {
    components: {
        tab1: { components, template:`<Wrap url="/includes/validation/login/server-sharp" />` },
        tab2: { components, template:`<Wrap url="/includes/validation/login/server-ts" />` },
        tab3: { components, template:`<Wrap url="/includes/validation/login/server-jquery" />` },
        tab4: { components, template:`<Wrap url="/includes/validation/login/server-razor" />` }
    },
    template:`<div>
          <button :class="cls('tab1')" @click="setTab('tab1')">Sharp Pages</button>
          <button :class="cls('tab2')" @click="setTab('tab2')">Client TypeScript</button>
          <button :class="cls('tab3')" @click="setTab('tab3')">Client jQuery</button>
          <button :class="cls('tab4')" @click="setTab('tab4')">Client Razor</button>
          <keep-alive class="mt-4">
            <component :is="currentTabComponent"></component>
          </keep-alive>
    </div>`,
    setup() {
        const currentTabComponent = ref("tab1")
        const cls = tab => `border-0 py-2 px-4 box-border rounded text-lg cursor-pointer ${isActive(tab) ? 'text-white bg-blue-600' : 'text-blue-600'}`
        function setTab(tab) {
            currentTabComponent.value = tab
            globalThis.hljs.highlightAll()
        }
        const isActive = tab => currentTabComponent.value === tab
        return { currentTabComponent, cls, setTab, isActive }
    }
}

export const ClientLoginUis = {
    components: {
        tab1: { components, template:`<Wrap url="/includes/validation/login/vuetify" />` },
        tab2: { components, template:`<Wrap url="/includes/validation/login/client-ts" />` },
        tab3: { components, template:`<Wrap url="/includes/validation/login/client-jquery" />` },
        tab4: { components, template:`<Wrap url="/includes/validation/login/client-razor" />` }
    },
    template:`<div>
          <button :class="cls('tab1')" @click="setTab('tab1')">Vuetify</button>
          <button :class="cls('tab2')" @click="setTab('tab2')">Client TypeScript</button>
          <button :class="cls('tab3')" @click="setTab('tab3')">Client jQuery</button>
          <button :class="cls('tab4')" @click="setTab('tab4')">Client Razor</button>
          <keep-alive>
            <component :is="currentTabComponent" class="mt-4"></component>
          </keep-alive>
    </div>`,
    setup() {
        const currentTabComponent = ref("tab1")
        const cls = tab => `border-0 py-2 px-4 box-border rounded text-lg cursor-pointer ${isActive(tab) ? 'text-white bg-blue-600' : 'text-blue-600'}`
        function setTab(tab) {
            currentTabComponent.value = tab
            globalThis.hljs.highlightAll()
        }
        const isActive = tab => currentTabComponent.value === tab
        return { currentTabComponent, cls, setTab, isActive }
    }
}

export const ServerContactUis = {
    components: {
        tab1: { components, template:`<Wrap url="/includes/validation/contacts/server-sharp" />` },
        tab2: { components, template:`<Wrap url="/includes/validation/contacts/server-ts" />` },
        tab3: { components, template:`<Wrap url="/includes/validation/contacts/server-jquery" />` },
        tab4: { components, template:`<Wrap url="/includes/validation/contacts/server-razor" />` }
    },
    template:`<div>
          <button :class="cls('tab1')" @click="setTab('tab1')">Script Pages</button>
          <button :class="cls('tab2')" @click="setTab('tab2')">Server TypeScript</button>
          <button :class="cls('tab3')" @click="setTab('tab3')">Server jQuery</button>
          <button :class="cls('tab4')" @click="setTab('tab4')">Server Razor</button>
      <keep-alive>
        <component :is="currentTabComponent" class="mt-4"></component>
      </keep-alive>
    </div>`,
    setup() {
        const currentTabComponent = ref("tab1")
        const cls = tab => `border-0 py-2 px-4 box-border rounded text-lg cursor-pointer ${isActive(tab) ? 'text-white bg-blue-600' : 'text-blue-600'}`
        function setTab(tab) {
            currentTabComponent.value = tab
            globalThis.hljs.highlightAll()
        }
        const isActive = tab => currentTabComponent.value === tab
        return { currentTabComponent, cls, setTab, isActive }
    }
}

export const ClientContactUis = {
    components: {
        tab1: { components, template:`<Wrap url="/includes/validation/contacts/vuetify" />` },
        tab2: { components, template:`<Wrap url="/includes/validation/contacts/client-ts" />` },
        tab3: { components, template:`<Wrap url="/includes/validation/contacts/client-jquery" />` },
        tab4: { components, template:`<Wrap url="/includes/validation/contacts/client-razor" />` }
    },
    template:`<div>
          <button :class="cls('tab1')" @click="setTab('tab1')">Vuetify</button>
          <button :class="cls('tab2')" @click="setTab('tab2')">Client TypeScript</button>
          <button :class="cls('tab3')" @click="setTab('tab3')">Client jQuery</button>
          <button :class="cls('tab4')" @click="setTab('tab4')">Client Razor</button>
          <keep-alive>
            <component :is="currentTabComponent" class="mt-4"></component>
          </keep-alive>
    </div>`,
    setup() {
        const currentTabComponent = ref("tab1")
        const cls = tab => `border-0 py-2 px-4 box-border rounded text-lg cursor-pointer ${isActive(tab) ? 'text-white bg-blue-600' : 'text-blue-600'}`
        function setTab(tab) {
            currentTabComponent.value = tab
            globalThis.hljs.highlightAll()
        }
        const isActive = tab => currentTabComponent.value === tab
        return { currentTabComponent, cls, setTab, isActive }
    }
}

export default {
    components: {
        ServerLoginUis,
        ClientLoginUis,
        ServerContactUis,
        ClientContactUis,
    },
    setup() {
    }
}

