---
title: Database Admin
---

The Database Admin UI lets you quickly browse and navigate your App's configured RDBMS schemas and tables:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NZkeyuc_prg" style="background-image: url('https://img.youtube.com/vi/NZkeyuc_prg/maxresdefault.jpg')"></lite-youtube>

It can be enabled by registering the `AdminDatabaseFeature` plugin from [ServiceStack.Server](https://nuget.org/packages/ServiceStack.Server):

```csharp
services.AddPlugin(new AdminDatabaseFeature());
```

Which without any additional configuration your App's configured databases will be listed on the home page, including their schemas, tables and any registered [named connections](/ormlite/getting-started#multiple-database-connections):

![](/img/pages/admin-ui/admin-ui-database.png)

Selecting a table takes us to a familiar tabular search results grid, similar in appearance and functionality to [Locode's Auto UI](/locode/):

![](/img/pages/admin-ui/admin-ui-database-table.png)

::: info
Registering `AdminDatabaseFeature` also enables [explaining and re-running queries](/admin-ui-profiling#explain-analyze-and-run-queries)
from the Profiling UI.
:::

Whilst Locode gives you an entire Auto Management UI with all modifications performed through managed [AutoQuery APIs](/autoquery/), Database Admin instead focuses on providing a great readonly UX for querying & inspecting your App's data, starting with multiple views or quickly previewing every row in either **Pretty** JSON format:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/admin-ui-database-table-pretty.png">
</div>

Where it will also let you copy every row in JSON format, whilst the **Preview** tab shows a friendlier view of the row's fields:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/admin-ui-database-table-preview.png">
</div>

The tabular grid is highly personalizable where it lets change the query preferences and display fields for each table, where they're persisted in localStorage and preserved across browser restarts:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/admin-ui-database-prefs.png">
</div>

Likewise so are the flexible filtering options allowing any number of filters per column:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/admin-ui-database-filter.png">
</div>

The number and type of filters are readily available from the **Filters** dropdown showing all filters grouped under their column name where they're easily cleared per filter, column or using **Clear All** to clear all filters:

![](/img/pages/admin-ui/admin-ui-database-filters.png)

After you've finished customizing your table search view, you can export the data with the **Excel** button to download the results in [CSV Format](/csv-format) where it can be opened in your favorite spreadsheet, e.g:

![](/img/pages/admin-ui/admin-ui-database-excel.png)

Alternatively the **Copy URL** button can be used to generate the API data URL to return results in JSON:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/admin-ui-database-api-url.png">
</div>

## Database Admin Customizations

Some customizations is available on the `AdminDatabaseFeature` plugin where you can control the maximum size of resultsets returned and you can use the `DatabaseFilter` to control which databases and schemas are displayed as well as changing the labels shown by setting their `Alias` properties, e.g:

```csharp
Plugins.Add(new AdminDatabaseFeature {
    QueryLimit = 100,
    DatabasesFilter = dbs => {
        foreach (var db in dbs) 
        {
            if (db.Name == "main")
            {
                db.Alias = "Northwind";
                db.Schemas[0].Alias = "Traders";
            }
            else if (db.Name == "chinook")
            {
                db.Alias = "Chinook";
                db.Schemas[0].Alias = "Music";
            }
        }
    },
});
```

## Schema Diff

Each database has a **Schema Diff** link that compares your models with their tables, to find what's changed in one
and not the other after a model changes. It compares the data models of your AutoQuery APIs, the models of the tables
your [DB Migrations](/ormlite/db-migrations) create, and other models in the `ModelTypes` of the
`AdminDatabaseFeature`:

- Tables, columns, indexes, foreign keys, unique and check constraints and full-text indexes that are in a model and
  not in the database
- Columns, foreign keys and unique and check constraints that are in the database and not in the model
- Indexes that are in the database and not in the model, which are never dropped when they're on columns of the model.
  Each one says which `[Index]` or `[CompositeIndex]` to add to the model, which can be copied from its difference
- Columns with a different type, size or default to their property, or that allow nulls when their property doesn't
- Indexes with other columns, uniqueness, `Include` columns or `Where` condition, foreign keys with other actions,
  and check constraints with another condition
- Primary keys with other columns, which are reported but not changed

A column that isn't in the model and a new column of the same type are marked as a likely rename, e.g.
**Add column: Currency (renamed from LegacyCode?)**. Each difference can be expanded to see the SQL that fixes it, and
differences that can lose data or fail with the rows of a table are marked as **destructive**. On SQLite, changes it
can't alter are made by rebuilding the table, and say so.

Next to the differences is a [DB Migration](/ormlite/db-migrations) that makes the database the same as its models,
named after your App's last migration, e.g. `Migration1005.cs`. Copy it into your migrations and review it before you
run it: columns that aren't in a model may have been renamed, so they're only dropped by code that's commented out,
with the rename to use instead.

Comparing doesn't change your database. It's the same comparison as OrmLite's
[Schema Diff](/ormlite/schema-diff), which has what's compared and what to look for when reviewing a migration.

Tables that aren't managed by OrmLite, e.g. the `AspNet*` tables of ASP.NET Core Identity, aren't compared and are
listed under the Schema Diff. See [Ignore tables](/ormlite/schema-diff#ignore-tables) to ignore other tables.

To see the differences in your App's startup logs, enable `LogSchemaDiff`:

```csharp
services.AddPlugin(new AdminDatabaseFeature {
    LogSchemaDiff = context.HostingEnvironment.IsDevelopment(),
});
```

### Models that are compared

The data models of your App's [AutoQuery](/autoquery/) APIs are compared with the tables of their database, which is
the named connection of models and APIs with a `[NamedConnection]`. Add your other models to `ModelTypes`:

```csharp
Plugins.Add(new AdminDatabaseFeature {
    ModelTypes = { typeof(Invoice), typeof(InvoiceItem) },
    // Only compare the models you choose
    ModelTypesFilter = type => type.Namespace == "MyApp.ServiceModel.Types",
    // Defaults to the namespace of your App's migrations
    MigrationNamespace = "MyApp.Migrations",
});
```

The models of the tables your [DB Migrations](/ormlite/db-migrations) create or change are compared too, using the
App's model with the same table name as the latest version of each table. Set `IncludeMigrationModels = false` to
only compare your AutoQuery models and `ModelTypes`. See [Schema Diff](/ormlite/schema-diff#in-the-admin-ui) for
how they're found.

Models that [AutoGen](/autoquery/autogen) generates from the tables of a database aren't compared, as they're
always the same as their tables. The models of ServiceStack's plugins, which create their own tables, are only
compared when they're in `ModelTypes`.

## Feedback Welcome

We hope you'll find the Database Admin feature useful, please let us know what other features you would like in [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions).
