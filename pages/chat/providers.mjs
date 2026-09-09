import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"

/** Searchable catalog of every built-in provider and the key it looks for */
const ProviderCatalog = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Built in, no extension required" title="Every provider AI Chat ships with"
        description="Filter by how a provider is reached, or search for one by name or key. Each entry shows the llms.json key and the environment variable its API key resolves from."
        placeholder="Search…" :features="features" />`,
    setup() {
        const features = [
            { name:'OpenAI', category:'Hosted', href:'#llms-json', text:'openai · OPENAI_API_KEY', keywords:'gpt chatgpt o1 dall-e image' },
            { name:'Anthropic', category:'Hosted', href:'#llms-json', text:'anthropic · ANTHROPIC_API_KEY', keywords:'claude opus sonnet haiku' },
            { name:'Google Gemini', category:'Hosted', href:'#llms-json', text:'google · GEMINI_API_KEY', keywords:'gemini flash pro rag file search' },
            { name:'Groq', category:'Hosted', href:'#llms-json', text:'groq · GROQ_API_KEY', keywords:'fast inference llama' },
            { name:'xAI', category:'Hosted', href:'#llms-json', text:'xai · XAI_API_KEY', keywords:'grok' },
            { name:'Cerebras', category:'Hosted', href:'#llms-json', text:'cerebras · CEREBRAS_API_KEY', keywords:'fast inference' },
            { name:'Mistral', category:'Hosted', href:'#llms-json', text:'mistral · MISTRAL_API_KEY', keywords:'transcription voice codestral' },
            { name:'Codestral', category:'Hosted', href:'#llms-json', text:'codestral · CODESTRAL_API_KEY', keywords:'code completion mistral' },
            { name:'DeepSeek', category:'Hosted', href:'#llms-json', text:'deepseek · DEEPSEEK_API_KEY', keywords:'reasoning' },
            { name:'Moonshot', category:'Hosted', href:'#llms-json', text:'moonshotai · MOONSHOT_API_KEY', keywords:'kimi' },
            { name:'Z.ai', category:'Hosted', href:'#llms-json', text:'zai / zai-coding-plan · ZAI_API_KEY / ZHIPU_API_KEY', keywords:'glm zhipu coding plan' },
            { name:'MiniMax', category:'Hosted', href:'#llms-json', text:'minimax · MINIMAX_API_KEY', keywords:'' },
            { name:'Nvidia', category:'Hosted', href:'#llms-json', text:'nvidia · NVIDIA_API_KEY', keywords:'nim image' },
            { name:'Chutes', category:'Hosted', href:'#llms-json', text:'chutes · CHUTES_API_KEY', keywords:'image' },
            { name:'Alibaba', category:'Hosted', href:'#llms-json', text:'alibaba', keywords:'qwen' },
            { name:'Hugging Face', category:'Hosted', href:'#llms-json', text:'huggingface', keywords:'inference' },
            { name:'OpenRouter', category:'Aggregator', href:'#llms-json', text:'openrouter · OPENROUTER_API_KEY', keywords:'gateway many models image audio tts' },
            { name:'Fireworks', category:'Aggregator', href:'#llms-json', text:'fireworks-ai · FIREWORKS_API_KEY', keywords:'image' },
            { name:'GitHub Copilot', category:'Aggregator', href:'#llms-json', text:'github-copilot', keywords:'github models subscription' },
            { name:'GitHub Models', category:'Aggregator', href:'#llms-json', text:'github-models', keywords:'github catalog' },
            { name:'Ollama', category:'Local', href:'#local-models', badge:'no key', text:'ollama · reached at http://localhost:11434/v1', keywords:'self-hosted offline private local' },
            { name:'Ollama Cloud', category:'Local', href:'#local-models', text:'ollama-cloud · OLLAMA_API_KEY', keywords:'hosted ollama' },
            { name:'LM Studio', category:'Local', href:'#local-models', badge:'no key', text:'lmstudio · a local OpenAI-compatible endpoint', keywords:'self-hosted offline private local' },
            { name:'OpenAI-compatible', category:'Local', href:'#local-models', text:'openai-local · any endpoint with a different base_url', keywords:'vllm llama.cpp custom self-hosted' },
            { name:'llms.py', category:'Local', href:'#local-models', text:'llmspy · the upstream Python implementation', keywords:'python upstream' },
        ]
        return { features }
    }
}

/** The four conditions a provider must satisfy, and how its key is resolved */
const ProviderLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">All four must hold</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a provider becomes live</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-4">
        <div v-for="(gate,i) in gates" :key="gate.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{i+1}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{gate.name}}</div>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{gate.text}}</p>
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-6">
        <div class="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">API key resolution order</div>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div v-for="(source,i) in sources" :key="source.name" class="contents">
            <div class="flex-1 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <code class="text-xs font-bold text-slate-900 dark:text-white">{{source.name}}</code>
              <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{source.text}}</p>
            </div>
            <div v-if="i < sources.length - 1" class="flex items-center justify-center px-1 text-slate-400" aria-hidden="true">
              <span class="hidden sm:inline">→</span><span class="sm:hidden">↓</span>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">A missing key never fails startup.</b> Providers that can’t resolve
        one are skipped with an informational log entry, so the same configuration works across environments where
        different keys are available.
      </p>
    </section>`,
    setup() {
        const gates = [
            { name:'Defined', text:'It has an entry in the providers object of llms.json.' },
            { name:'Enabled', text:'Either "enabled": true in its definition, or named in ChatFeature.EnableProviders.' },
            { name:'Resolvable', text:'Its npm sdk id maps to a factory in ChatFeature.ProviderTypes.' },
            { name:'Tested', text:'provider.Test() passes - which normally means an API key was resolved.' },
        ]
        const sources = [
            { name:'ChatFeature.Variables', text:'Programmatic values, checked first - bind them from IConfiguration.' },
            { name:'Environment variables', text:'$OPENAI_API_KEY and friends.' },
            { name:'api_key in llms.json', text:'A literal value, or a $VAR reference resolved as above.' },
        ]
        return { gates, sources }
    }
}

/** Pinning a deployment to an approved set of providers */
const ProviderLockdown = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-3">
      <div v-for="posture in postures" :key="posture.name"
           :class="['flex flex-col rounded-2xl border p-5 shadow-sm', posture.accent]">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{posture.icon}}</span>
          <div class="font-bold text-slate-900 dark:text-white">{{posture.name}}</div>
        </div>
        <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{posture.text}}</p>
        <code class="mt-4 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{posture.code}}</code>
        <div class="mt-3 flex items-center gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Leaves your network</span>
          <span :class="['rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', posture.tint]">{{posture.egress}}</span>
        </div>
      </div>
    </section>`,
    setup() {
        const postures = [
            { icon:'🌐', name:'Whatever is configured', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The default. Every provider in llms.json whose key resolves becomes selectable in the model picker.',
              code:'// no EnableProviders', egress:'Per provider', tint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
            { icon:'🔒', name:'An approved set', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'EnableProviders overrides every enabled flag in llms.json, so a deployment can be pinned regardless of the config file.',
              code:'EnableProviders = ["anthropic","ollama"]', egress:'Only those', tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { icon:'🏠', name:'Fully self-hosted', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Enable only local endpoints and no prompt, document or completion ever leaves your network.',
              code:'EnableProviders = ["ollama"]', egress:'Nothing', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
        ]
        return { postures }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        FeatureMatrix,
        ProviderCatalog,
        ProviderLifecycle,
        ProviderLockdown,
    }
}
