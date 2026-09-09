import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import DocStatus from "../components/DocStatus.mjs"

/** What an anti-forgery token defends against */
const CsrfOverview = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Cookies are sent automatically</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What an anti-forgery token defends against</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900 dark:bg-rose-950/20">
          <div class="font-bold text-slate-900 dark:text-white">Without a token</div>
          <ol class="mt-3 space-y-2">
            <li v-for="(s,i) in attack" :key="s" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-rose-100 text-[10px] font-black text-rose-700 dark:bg-rose-950 dark:text-rose-300">{{i+1}}</span>
              <span>{{s}}</span>
            </li>
          </ol>
        </div>
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="font-bold text-slate-900 dark:text-white">With a token</div>
          <ol class="mt-3 space-y-2">
            <li v-for="(s,i) in defense" :key="s" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-100 text-[10px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{i+1}}</span>
              <span>{{s}}</span>
            </li>
          </ol>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        This matters for <b class="text-slate-900 dark:text-white">cookie-authenticated form posts</b>. Clients that
        send an explicit bearer token aren’t exposed the same way, because a third-party page can’t make the browser
        attach a token it doesn’t have.
      </p>
    </section>`,
    setup() {
        const attack = [
            'A signed-in user visits an attacker’s page.',
            'That page posts a form to your App.',
            'The browser attaches your cookies automatically.',
            'The request looks legitimate and is executed.',
        ]
        const defense = [
            'Your form embeds a token the attacker can’t read.',
            'The attacker’s post has no matching token.',
            'Validate() rejects the request before your code runs.',
        ]
        return { attack, defense }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, DocStatus, CsrfOverview }
}
