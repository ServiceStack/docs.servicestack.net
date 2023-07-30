---
slug: studio-autoquery
title: Studio - AutoQuery UI
---

::: warning Deprecated
**[ServiceStack Studio has been replaced](/releases/v6_02.html#retiring-studio)** by **[Locode](/locode/)**.
Last supported versions: **ServiceStack v6.1** with **app v6.0.4**.
:::

Studio uses the rich declarative metadata of AutoQuery & Crud Services to infer the **data model** that each AutoQuery Service operates on and the **Operation Type** they provide. As a result it can logically group each Service around the Data Model they operate on to provide a more intuitive & natural UI for each of the different AutoQuery/CRUD operation types.

![](/img/pages/release-notes/v5.9/autoquery-noauth.png)

## AutoQuery UI

What UI features & tables are visible is reflected by whether the AutoQuery Service for that type exists and whether the currently authenticated User has access to them (i.e. Have the role required by each Service). So an unauthenticated user will see Northwind Crud's read-only **Region** table with no ability to update it & the **Territory** table, which as it isn't protected by a role will be visible to everyone, 
but as all CRUD Write operations require authentication, all edit controls require authentication - as shown in the screenshot above where they're replaced with auth **Sign In** buttons.

Here are the relevant [NorthwindCrud auto-generation rules](https://github.com/NetCoreApps/NorthwindCrud/blob/master/Startup.cs) which defines this behavior:

```csharp
var readOnlyTables = new[] { "Region" };
GenerateCrudServices = new GenerateCrudServices {
    ServiceFilter = (op,req) => {
        // Require all Write Access to Tables to be limited to Authenticated Users
        if (op.IsCrudWrite())
        {
            op.Request.AddAttributeIfNotExists(new ValidateRequestAttribute("IsAuthenticated"), 
                x => x.Validator == "IsAuthenticated");
        }
    },
    //Don't generate the Services or Types for Ignored Tables
    IncludeService = op => !ignoreTables.Any(table => op.ReferencesAny(table)) &&
        !(op.IsCrudWrite() && readOnlyTables.Any(table => op.ReferencesAny(table))),
}
```

Clicking on any of the **Auth** icons or the **Sign In** button on the top right will open up the Sign In dialog.

### Integrated Auth Component

![](/img/pages/release-notes/v5.9/auth.png)

The **Sign In** dialog supports most of ServiceStack's built-in Auth Providers with a different Auth Dialog tab depending which Auth Providers are enabled. 
It looks at "auth family type" to determine how to Authenticate with each Auth Provider so it should still support your Custom Auth Providers if they inherit from existing Auth Providers, otherwise they can explicitly specify which Type of Auth they use by overriding the `Type` property getter with one of the following:

  - **Bearer** - Authenticate with HTTP Authentication Bearer Token (e.g. JWT or API Key)
  - **credentials** - Authenticate with Username/Password at `/auth/credentials`
  - **oauth** - Authenticate with OAuth
  - **session** - Alternative [session-based Auth Provider](/auth/authentication-and-authorization#session-authentication-overview)

The **session** tab is also displayed if a `credentials` or `auth` provider is enabled. It should serve as a fallback Auth option if your Custom Auth Provider doesn't fit into the existing family types as it opens the `/auth` page of the remote ServiceStack instance:

![](/img/pages/release-notes/v5.9/auth-session.png)

Where you can login to the remote site via the new fallback `/login` page or uses your custom Login Page if exists. If your remote instance is configured to allow Studio CORS access, i.e:

```csharp
appHost.Plugins.Add(new CorsFeature(allowOriginWhitelist:new[]{ "https://localhost:5002" }));
```

Clicking on the **copy** button will then be able to post the session Id back to Studio & close the auth popup otherwise you'd need to 
manually close the popup and paste the session in.

![](/img/pages/release-notes/v5.9/auth-session-copy.png)

The **OAuth** tab is a little different since it requires an OAuth redirect and since most 3rd Party OAuth providers disallow embedding in iframes,
it needs to popup an external url in your default browser which still provides a nice auth UX as you'd typically already be Signed In with your 
Default browser, where it will redirect you back to your `/auth` page where you can copy either the **Session Id** or the OAuth **Access Token** 
if you enable including OAuth Access Tokens in your `AuthenticateResponse` DTO with:

```csharp
appHost.Plugins.Add(new AuthFeature(...) {
    IncludeOAuthTokensInAuthenticateResponse = true, // Include OAuth Keys in authenticated /auth page
});
```

This allows you to [Authenticate via OAuth Access Token](/auth/authentication-and-authorization#authentication-via-oauth-accesstokens) where you can test 
the same Authentication that Mobile and Desktop using pre-existing Sign In Widgets who also authenticate via OAuth Access Tokens obtained by their native UI widget:

![](/img/pages/release-notes/v5.9/auth-page.png)

**Studio** is able to provide a seamless UX where it's able to monitor the Windows clipboard for changes & when detected close the window, return focus back to Studio who uses it to automatically Sign In with the copied token.

### Desktop User State & Preferences

As is expected from a normal Desktop App, the User State of the App is preserved across restarts, which Studio maintains in its `$HOME/.servicestack/studio/site.settings` JSON file which preserves amongst other things what remote ServiceStack instances you've connected to & last queries made on each table, etc. When 
not running in a Desktop App it will save it to your browsers `localStorage`. You can force a save with `Ctrl+S` or by clicking on the **save icon** on the top right.

### AutoCrud Querying

The same querying behavior, supported filters, custom fields, paging, order by's, etc. demonstrated in **SharpData** above are also available in **Studio**, but implemented differently, where instead of calling the SharpData API directly, the filters are translated into the equivalent AutoQuery request and 
the remote AutoQuery Services are called instead, but as they both result in the same UX and end result, users knowledge is transferable:

#### Search Filters

 - Use `=null` or `!=null` to search `NULL` columns
 - Use `<=`, `<`, `>`, `>=`, `<>`, `!=` prefix to search with that operator
 - Use `,` trailing comma to perform an `IN (values)` search (integer columns only)
 - Use `%` suffix or prefix to perform a `LIKE` search

![](/img/pages/release-notes/v5.9/studio-query-filters.png)

### Export to Excel

Likewise the fast, direct export into Excel is also available, one difference is that the total results returned in a query is controlled by the remote ServiceStack AutoQuery plugin whereas **SharpData** allows for unlimited sized queries:

![](/img/pages/release-notes/v5.9/studio-excel.png)

### AutoCrud Partial Updates

The UI is designed to look similar to a generic RDBMS Admin UI Table Editor where you can edit records in a table grid. If a `IPatchDb<Table>` AutoQuery Service exists for the Data Model & the Authenticated User has access to it. 

If enabled all fields (excl PK) on that Request DTO will be editable in the UI, otherwise they'll appear Read-only like the **Id** column:

![](/img/pages/release-notes/v5.9/studio-crud-partial.png)

### AutoCrud Create

If the user has access to the `ICreateDb<Table>` Service they'll be able to add records by clicking the *+* icon on the top-right of the resultset which brings up the Create Entity modal:

![](/img/pages/release-notes/v5.9/studio-crud-create.png)

### AutoCrud Update and Delete

If the user has access to the `IUpdateDb<Table>` Service they'll be able to update records by clicking on the **edit** icon which will bring up the Edit Entity dialog. If they have access to the `IDeleteDb<Table>` Service they'll also be able to delete the entity from the same screen:

![](/img/pages/release-notes/v5.9/studio-crud-update.png)

### API Log Viewer

All API Requests the UI makes to remote ServiceStack instances are made via a generic .NET Core back-end Service Proxy which attaches the Signed In Authentication Info to each Request. Each API Request Studio makes is recorded in the log viewer at the bottom, showing the Verb and Parameters each API was called with:

![](/img/pages/release-notes/v5.9/studio-request-log.png)

> You can copy the URL from **GET** API Requests or open them up in a new browser to view it in isolation. 

### Executable Audit History

If you Sign In as the **Admin** User (i.e. using `AuthSecret=zsecret`) you'll get super user access to access the other protected features like being able to view an **Audit History** of updates made to each record via AutoQuery that's enabled in **NorthwindCrud** with:

```csharp
// Add support for auto capturing executable audit history for AutoCrud Services
container.AddSingleton<ICrudEvents>(c => new OrmLiteCrudEvents(c.Resolve<IDbConnectionFactory>()));
container.Resolve<ICrudEvents>().InitSchema();
```

Where users in the `AutoQueryFeature.AccessRole` (default: Admin) role will be able to view the Audit history of each row:

![](/img/pages/release-notes/v5.9/studio-audit.png)

> If creating & deleting an entity with the same Id, the Audit History of the previous entity will be retained & visible

