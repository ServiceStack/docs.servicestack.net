import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"

/** The seven-step migration, and the one fact that makes it painless */
const MigrationPath = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Users don’t have to notice"
        title="Migrating from ServiceStack Auth to Identity Auth" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Preserve', caption:'Steps 1-2', title:'Keep the old data reachable while you build the new model', tags:['Rename AppUser','New ApplicationUser'],
              description:'Rename the existing AppUser table so it doesn’t collide with the new Identity ApplicationUser, and map only the properties you actually want to carry across. The old table is temporary - you can drop it once every user is migrated.' },
            { name:'Configure', caption:'Step 3', title:'Register the Identity Auth configuration', tags:['AuthFeature','IdentityAuth.For<T>()'],
              description:'Add the standard Identity Auth configuration alongside ServiceStack’s integration, so both the Identity pages and your existing ServiceStack endpoints authenticate against the same users.' },
            { name:'Migrate', caption:'Step 4', title:'Create and run the EF migrations', tags:['EF Core','Schema'],
              description:'Identity owns its own schema. Generate and apply the migrations before moving any data into it.' },
            { name:'Move users', caption:'Steps 5-6', title:'Copy users across with their passwords intact', tags:['Identity v2 hashes','No reset'],
              description:'ServiceStack uses a compatible Identity v2 password hashing format, so existing password hashes transfer directly - users keep signing in with the password they already have, and nobody is forced through a reset.' },
            { name:'Verify', caption:'Step 7', title:'Confirm sign-in before removing anything', tags:['Test','Then clean up'],
              description:'Check that migrated users can sign in through the new flow. Only then is it safe to drop the renamed table.' },
        ]
        return { steps }
    }
}

/** The compatibility that makes the migration safe */
const MigrationSafety = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-3">
      <div v-for="f in facts" :key="f.name"
           :class="['flex flex-col rounded-2xl border p-5 shadow-sm', f.accent]">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{f.icon}}</span>
          <div class="font-bold text-slate-900 dark:text-white">{{f.name}}</div>
        </div>
        <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{f.text}}</p>
      </div>
      <p class="lg:col-span-3 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 px-4 py-3.5 text-sm leading-6 text-slate-700 dark:border-amber-800 dark:bg-amber-950/25 dark:text-slate-200">
        <span class="mt-0.5 shrink-0 text-lg" aria-hidden="true">⚠</span>
        <span><b class="text-slate-900 dark:text-white">Back up the database before you start.</b> The migration moves
        real user credentials between schemas - and the renamed table is your only copy of the original data until
        you’ve verified sign-in works.</span>
      </p>
    </section>`,
    setup() {
        const facts = [
            { icon:'🔑', name:'Passwords carry over', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'ServiceStack uses a compatible Identity v2 hashing format, so hashes transfer as-is. No password reset email, no user friction.' },
            { icon:'🔁', name:'Your APIs don’t change', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The same [Authenticate] attributes, session abstraction and Request DTOs keep working - only what backs them changes.' },
            { icon:'📋', name:'Migrate only what you need', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'You choose which UserAuth properties to carry into ApplicationUser rather than reproducing the whole legacy schema.' },
        ]
        return { facts }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, MigrationPath, MigrationSafety }
}
