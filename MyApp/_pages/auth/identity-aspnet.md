---
slug: authentication-identity-aspnet
title: ASP.NET Identity Auth in ServiceStack (Legacy)
---

:::info
For new projects we recommend starting with the new [ASP.NET Core Identity Auth](/identity-auth) templates.
:::

---

[mvcidentity](https://github.com/LegacyTemplates/mvcidentity) is a .NET 6.0 MVC Website integrated with ServiceStack using ASP.NET Identity Auth:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcidentity.png)](https://github.com/LegacyTemplates/mvcidentity)

Create new `mvcidentity` project with:

:::sh
npx create-net mvcidentity ProjectName
:::

[mvcidentity](https://github.com/LegacyTemplates/mvcidentity) is essentially the same App with the same functionality as [mvcauth](https://github.com/LegacyTemplates/mvcauth)
but rewritten to use ASP.NET Identity Auth instead of ServiceStack Auth, including the registration options which are handled implemented
using MVC Controllers instead of ServiceStack's built-in Services:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcidentity-login.png)

`mvcidentity` defaults to using EF and SQL Server which we expect to be the most popular configuration:

```csharp
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

services.AddIdentity<ApplicationUser, IdentityRole>(options => {
        options.User.AllowedUserNameCharacters = null;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
```

The rest of [Startup.cs](https://github.com/LegacyTemplates/mvcidentity/blob/master/MyApp/Startup.cs) contains the
standard setup for configuring ASP.NET Identity Auth with the same Twitter, Facebook, Google and Microsoft OAuth Providers.

A custom [ApplicationUser](https://github.com/LegacyTemplates/mvcidentity/blob/master/MyApp/Models/ApplicationUser.cs) 
EF DataModel is used to better prepare for real world usage to show how to propagate custom User metadata  
down into Authenticated UserSessions. `mvcidentity` starts with an extended `ApplicationUser` that captures basic info about
the user and capture external references to any 3rd Party OAuth providers that Users have signed in with:

```csharp
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }

    public string TwitterUserId { get; set; }
    public string TwitterScreenName { get; set; }

    public string FacebookUserId { get; set; }

    public string GoogleUserId { get; set; }

    public string GoogleProfilePageUrl { get; set; }

    public string MicrosoftUserId { get; set; }
    
    public string ProfileUrl { get; set; }
}
```

## Mapping Customizations

By default the [NetCoreIdentityAuthProvider.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/NetCoreIdentityAuthProvider.cs)
uses the `MapClaimsToSession` dictionary to map well known `ClaimTypes` Properties to their natural `AuthUserSession` property:

```csharp
public Dictionary<string, string> MapClaimsToSession { get; set; } = new Dictionary<string, string> {
    [ClaimTypes.Email] = nameof(AuthUserSession.Email),
    [ClaimTypes.Name] = nameof(AuthUserSession.UserAuthName),
    [ClaimTypes.GivenName] = nameof(AuthUserSession.FirstName),
    [ClaimTypes.Surname] = nameof(AuthUserSession.LastName),
    [ClaimTypes.StreetAddress] = nameof(AuthUserSession.Address),
    [ClaimTypes.Locality] = nameof(AuthUserSession.City),
    [ClaimTypes.StateOrProvince] = nameof(AuthUserSession.State),
    [ClaimTypes.PostalCode] = nameof(AuthUserSession.PostalCode),
    [ClaimTypes.Country] = nameof(AuthUserSession.Country),
    [ClaimTypes.OtherPhone] = nameof(AuthUserSession.PhoneNumber),
    [ClaimTypes.DateOfBirth] = nameof(AuthUserSession.BirthDateRaw),
    [ClaimTypes.Gender] = nameof(AuthUserSession.Gender),
    [ClaimTypes.Dns] = nameof(AuthUserSession.Dns),
    [ClaimTypes.Rsa] = nameof(AuthUserSession.Rsa),
    [ClaimTypes.Sid] = nameof(AuthUserSession.Sid),
    [ClaimTypes.Hash] = nameof(AuthUserSession.Hash),
    [ClaimTypes.HomePhone] = nameof(AuthUserSession.HomePhone),
    [ClaimTypes.MobilePhone] = nameof(AuthUserSession.MobilePhone),
    [ClaimTypes.Webpage] = nameof(AuthUserSession.Webpage),
};
```

Which you can also extend or modify to handle any additional straightforward **1:1 mappings**.

## Custom Mappings

Alternatively you can use `PopulateSessionFilter` to apply additional logic when creating a `UserSession` from a `ClaimsPrincipal` 
which is what's needed to copy over **EF Identity Roles** when using EF Identity Auth with ServiceStack. 

As `mvcidentity` doesn't have a dependency on OrmLite you could choose to populate roles using EF's APIs directly:

```csharp
new NetCoreIdentityAuthProvider(AppSettings) 
{
    PopulateSessionFilter = (session, principal, req) => 
    {
        var userManager = req.TryResolve<UserManager<ApplicationUser>>();
        var user = userManager.FindByIdAsync(session.Id).Result;
        var roles = userManager.GetRolesAsync(user).Result;        
    }
},
```

Whilst this works it uses "sync over async" which is 
[discouraged and problematic in many use-cases](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md), 
less efficient than just sync and UserManager's limited API available forces multiple DB calls and more data over the wire than just the role names needed.

## Built-in Identity DB APIs

Instead we recommend instead using the more optimal `IDbConnection.GetIdentityUserRolesById()` API which returns just the role names in 
a single indexed DB query. 

If you're not using OrmLite you can utilize EF's configured **DB Connection** by adding this extension method to your host project:

```csharp
public static class AppExtensions
{
    public static T DbExec<T>(this IServiceProvider services, Func<IDbConnection, T> fn) => services
        .DbContextExec<ApplicationDbContext,T>(x => { 
            x.Database.OpenConnection(); return x.Database.GetDbConnection(); }, fn);
}
```

## ASP.NET Core Identity Auth Adapter

Where you'll able to use it to perform adhoc DB queries, in this case calling `GetIdentityUserRolesById()` to populate the Users roles:

```csharp
new NetCoreIdentityAuthProvider(AppSettings) 
{
    PopulateSessionFilter = (session, principal, req) => {
        session.Roles = ApplicationServices.DbExec(db => db.GetIdentityUserRolesById(session.Id));
    }
}
```

This gets called whenever **ServiceStack receives an Authenticated Request** which you can intercept and customize how `ClaimsPrincipal`
are mapped to ServiceStack User Sessions.

To improve performance and save the DB hit, we recommend caching the User Roles into an In Memory Cache:

```csharp
new NetCoreIdentityAuthProvider(AppSettings) 
{
    PopulateSessionFilter = (session, principal, req) => {
        session.Roles = req.GetMemoryCacheClient().GetOrCreate(
            IdUtils.CreateUrn(nameof(session.Roles), session.Id),
            TimeSpan.FromMinutes(5),
            () => ApplicationServices.DbExec(db => db.GetIdentityUserRolesById(session.Id)));
    }
},
```

::: info
Alternatively use `req.GetCacheClient()` if you want to use your registered `ICacheClient` provider instead
:::

## Propagating Extended User Info

In addition to populating the Users Roles we also want to populate our custom User metadata on our `ApplicationUser` EF model,
for this we can use the new `GetIdentityUserById<T>` API which we'll also want to cache.

This brings us to the end result in [mvcidentity](https://github.com/LegacyTemplates/mvcidentity) project template:

```csharp
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    new IAuthProvider[] {
        new NetCoreIdentityAuthProvider(AppSettings) // Adapter to enable ASP.NET Identity Auth in ServiceStack
        {
            AdminRoles = { "Manager" }, // Automatically Assign additional roles to Admin Users
            PopulateSessionFilter = (session, principal, req) => {
                //Example of populating ServiceStack Session Roles + Custom Info from EF Identity DB
                var user = req.GetMemoryCacheClient().GetOrCreate(
                    IdUtils.CreateUrn(nameof(ApplicationUser), session.Id),
                    TimeSpan.FromMinutes(5), //return cached results before refreshing cache from db /5mins
                    () => ApplicationServices.DbExec(db=>db.GetIdentityUserById<ApplicationUser>(session.Id)));

                session.Email = session.Email ?? user.Email;
                session.FirstName = session.FirstName ?? user.FirstName;
                session.LastName = session.LastName ?? user.LastName;
                session.DisplayName = session.DisplayName ?? user.DisplayName;
                session.ProfileUrl = user.ProfileUrl ?? AuthMetadataProvider.DefaultNoProfileImgUrl;

                session.Roles = req.GetMemoryCacheClient().GetOrCreate(
                    IdUtils.CreateUrn(nameof(session.Roles), session.Id),
                    TimeSpan.FromMinutes(5), //return cached results before refreshing cache from db /5mins
                    () => ApplicationServices.DbExec(db => db.GetIdentityUserRolesById(session.Id)));
            }
        }, 
    }));
```
