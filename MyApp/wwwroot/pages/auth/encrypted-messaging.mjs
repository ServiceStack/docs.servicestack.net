import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What the encrypted channel protects, and what it doesn't */
const EncryptionOverview = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">A benefit of message-based design</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">An encrypted channel for every Service at once</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">Client</div>
          <ul class="mt-3 space-y-1.5">
            <li v-for="s in client" :key="s" class="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-indigo-400">•</span><span>{{s}}</span>
            </li>
          </ul>
        </div>
        <div class="flex flex-col items-center justify-center gap-1.5 text-center">
          <span class="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 dark:bg-black/50">plain HTTP</span>
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">unreadable in transit</span>
        </div>
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="font-bold text-slate-900 dark:text-white">Server</div>
          <ul class="mt-3 space-y-1.5">
            <li v-for="s in server" :key="s" class="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{s}}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">It applies to every Service without changing any of them</b> - including
        <a href="/auto-batched-requests" class="underline decoration-dotted">auto-batched requests</a> - because the
        encryption wraps the message, not the endpoint.
      </p>
    </section>`,
    setup() {
        const client = [
            'Generates a one-time symmetric key for the request',
            'Encrypts the message with it',
            'Encrypts that key with the server’s RSA public key',
        ]
        const server = [
            'Decrypts the key with its RSA private key',
            'Decrypts and executes the message as normal',
            'Encrypts the response back to the same client',
        ]
        return { client, server }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, EncryptionOverview }
}
