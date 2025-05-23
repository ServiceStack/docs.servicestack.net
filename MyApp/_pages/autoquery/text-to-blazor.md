---
title: Text to Blazor CRUD App
---

[Text to Blazor](https://servicestack.net/text-to-blazor) lets you rapidly generate new Blazor Admin CRUD Apps from just a text description.

<lite-youtube class="max-w-7xl aspect-video" videoid="Bd283EYJKxM" style="background-image: url('https://img.youtube.com/vi/Bd283EYJKxM/maxresdefault.jpg')"></lite-youtube>

[![](/img/pages/okai/text-to-blazor-prompt.webp)](https://servicestack.net/text-to-blazor)

<div class="pb-4 not-prose flex justify-center">
<a href="https://servicestack.net/text-to-blazor" class="text-3xl text-indigo-600 hover:text-indigo-800">https://servicestack.net/text-to-blazor</a>
</div>

This will query 5 different leading AI coding models to generate 5x different Data Models, APIs, DB Migrations and Admin UIs which you choose amongst to pick the best one that matches your requirements for your new CRUD App:

[![](/img/pages/okai/text-to-blazor-premium.webp)](/text-to-blazor)

### Using AI to only generate Data Models

Whilst the result is a working CRUD App, the approach taken is very different from most AI tools
which uses AI to generate the entire App that ends up with a whole new code-base developers didn't write
which they'd now need to maintain.

Instead AI is only used to **generate the initial Data Models** within a **TypeScript Declaration file** 
which we've found is the best format supported by AI models that's also the best typed DSL for defining
data models with minimal syntax that's easy for humans to read and write.

### Download preferred Blazor Vue CRUD App

Once you've decided on the Data Models that best matches your requirements, you can download your preferred 
generated Blazor Vue CRUD App:

[![](/img/pages/okai/text-to-blazor-download.webp)](https://servicestack.net/text-to-blazor)

### Blazor Admin App

**Admin Only** - is ideal for internal Admin Apps where the Admin UI is the Primary UI

![](/img/pages/okai/okai-blazor-admin.webp)

### Blazor Vue App

**UI + Admin** - Creates a new [blazor-vue](https://blazor-vue.web-templates.io) template, ideal for Internet or public facing Apps which sports a full-featured content rich UI for a Web App's users whilst providing a back-office Admin UI for Admin Users to manage the App's data.

![](/img/pages/okai/okai-blazor-vue.webp)

Clicking on the **Admin UI** button will take you to the Admin UI at `/admin`:

![](/img/pages/okai/okai-blazor-vue-admin.webp)

## Run Migrations

After downloading you'll then need to run the DB Migrations to create the App's Identity Auth and DB Tables:

:::sh
npm run migrate
:::

## Instant CRUD UI

Upon which you can hit the ground running and start using the Admin UI to manage the new Data Model RDBMS Tables!

:::youtube 8buo_ce3SNM
Using AutoQuery CRUD UI in a Text to Blazor App
:::

## Audited Data Models

The TypeScript Data Models enable a rapid development experience for defining an App's Data Models which are used
to generate the necessary AutoQuery CRUD APIs to support an Admin UI. 

An example of the productivity of this approach is the effortless support for maintaining a detailed audit history for changes to select tables by inheriting from the `AuditBase` base class, e.g:

```ts
export class Job extends AuditBase {
    ...
}
```

Which can then be regenerated using the name of the TypeScript Model definitions:

:::sh
npx okai Jobs.d.ts
:::

This will include additional `CreatedBy`, `CreatedDate`, `ModifiedBy`, `ModifiedDate`, `DeletedBy` and `DeletedDate`
properties to the specified Table and also generates the necessary 
[Audit Behaviors](https://docs.servicestack.net/autoquery/crud#apply-generic-crud-behaviors) 
on the AutoQuery APIs to maintain the audit history for each CRUD operation.

### AutoQuery CRUD Audit Log

As the **blazor-admin** and **blazor-vue** templates are configured to use 
[AutoQuery's Audit Log](/autoquery/audit-log) in its 
[Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Configure.AutoQuery.cs)
the Audit Behaviors also maintains an Audit Trail of all CRUD operations, viewable in the Admin UI:

![](/img/pages/okai/okai-audit-form.webp)

## Customize Data Models

The generated CRUD Data Models and APIs can be further customized by authoring the
[TypeScript Data Models](/autoquery/okai-models)