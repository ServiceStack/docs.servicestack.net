import { ref, computed } from "vue"
import { langs, langGroups } from "./OpenAiChatLangs.mjs"

const installs = {
    csharp:     { command: 'dotnet add package ServiceStack.Client', note: 'ServiceStack.Client for .NET' },
    fsharp:     { command: 'dotnet add package ServiceStack.Client', note: 'ServiceStack.Client for .NET' },
    vbnet:      { command: 'dotnet add package ServiceStack.Client', note: 'ServiceStack.Client for .NET' },
    typescript: { command: 'npm install @servicestack/client', note: 'Typed client for TypeScript' },
    mjs:        { command: 'npm install @servicestack/client', note: 'ES module client for JavaScript' },
    python:     { command: 'pip install servicestack', note: 'ServiceStack package from PyPI' },
    php:        { command: 'composer require servicestack/client', note: 'ServiceStack client for Composer' },
    ruby:       { command: 'gem install servicestack', note: 'ServiceStack gem for Ruby' },
    swift:      { command: 'swift package add-dependency https://github.com/ServiceStack/ServiceStack.Swift.git --from 6.0.0', note: 'Add with Swift Package Manager' },
    java:       { command: "implementation 'net.servicestack:client:1.1.3'", note: 'Add to your Gradle dependencies' },
    kotlin:     { command: "implementation 'net.servicestack:client:1.1.3'", note: 'Add to your Gradle dependencies' },
    dart:       { command: 'dart pub add servicestack', note: 'ServiceStack package for Dart & Flutter' },
    go:         { command: 'go get github.com/ServiceStack/servicestack-go', note: 'Native Go module' },
    rust:       { command: 'cargo add servicestack', note: 'ServiceStack crate for Rust' },
    zig:        { command: 'zig fetch --save https://github.com/ServiceStack/servicestack-zig/archive/refs/tags/v0.1.3.tar.gz', note: 'Native Zig module' },
}

export default {
    template:`
    <div class="not-prose overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-indigo-950/30">
      <div class="border-b border-white/10 bg-white/[.04] px-5 py-4 sm:px-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[.22em] text-indigo-300">Choose your stack</p>
            <h3 class="mt-1 text-xl font-bold text-white">Typed in under a minute</h3>
          </div>
          <label class="relative block lg:w-64">
            <span class="sr-only">Select a language</span>
            <select v-model="selectedLang" class="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none ring-indigo-400 transition focus:ring-2">
              <optgroup v-for="group in langGroups" :key="group.name" :label="group.name">
                <option v-for="lang in group.langs" :key="lang" :value="lang">{{langs[lang]}}</option>
              </optgroup>
            </select>
            <img :src="'/img/langs/' + selectedLang + '.svg'" alt="" class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 object-contain">
          </label>
        </div>
      </div>

      <div class="grid lg:grid-cols-2">
        <div class="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-black text-white">1</span>
            <div>
              <p class="font-semibold text-white">Install the client</p>
              <p class="text-sm text-slate-400">{{install.note}}</p>
            </div>
          </div>
          <div class="mt-5 flex min-h-16 items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span class="select-none font-mono text-sm text-indigo-400">$</span>
            <code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-100">{{install.command}}</code>
            <button type="button" @click="copy(install.command, 'install')" class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white" :aria-label="'Copy ' + langs[selectedLang] + ' install command'">{{copied === 'install' ? 'Copied' : 'Copy'}}</button>
          </div>
        </div>

        <div class="p-5 sm:p-7">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm font-black text-slate-950">2</span>
            <div>
              <p class="font-semibold text-white">Generate native DTOs</p>
              <p class="text-sm text-slate-400">Point at any running ServiceStack API</p>
            </div>
          </div>
          <div class="mt-5 flex min-h-16 items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-950/20 px-4 py-3">
            <span class="select-none font-mono text-sm text-cyan-400">$</span>
            <code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-100">{{dtoCommand}}</code>
            <button type="button" @click="copy(dtoCommand, 'dtos')" class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white" :aria-label="'Copy ' + langs[selectedLang] + ' DTO command'">{{copied === 'dtos' ? 'Copied' : 'Copy'}}</button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-t border-white/10 bg-white/[.03] px-5 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <span>One native source file. Re-run the command whenever your API changes.</span>
        <a :href="docsUrl" class="font-semibold text-indigo-300 transition hover:text-white">{{langs[selectedLang]}} docs <span aria-hidden="true">→</span></a>
      </div>
    </div>`,
    props: { 
      selected: { type:String, default:'typescript' },
      url: { type:String, default:'https://example.org' },
    },
    setup(props) {
        const selectedLang = ref(langs[props.selected] ? props.selected : 'typescript')
        const copied = ref('')
        const install = computed(() => installs[selectedLang.value])
        const dtoCommand = computed(() => `npx get-dtos ${selectedLang.value} ${props.url}`)
        const docsUrl = computed(() => {
            const slug = selectedLang.value === 'mjs' ? 'javascript' : selectedLang.value
            return `https://docs.servicestack.net/${slug}-add-servicestack-reference`
        })
        async function copy(text, type) {
            await navigator.clipboard.writeText(text)
            copied.value = type
            setTimeout(() => copied.value = '', 1800)
        }
        return { langs, langGroups, selectedLang, copied, install, dtoCommand, docsUrl, copy }
    }
}
