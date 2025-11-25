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

## Feedback Welcome

We hope you'll find the Database Admin feature useful, please let us know what other features you would like in [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions).
