---
slug: authentication-identity-servicestack
title: Using ServiceStack Auth in MVC
---

[mvcauth](https://github.com/NetCoreTemplates/mvcauth) is a .NET 6.0 MVC Website integrated with ServiceStack Auth:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcauth.png)](https://github.com/NetCoreTemplates/mvcauth)

## New Project

Create new `mvcauth` project with:

:::sh
x new mvcauth ProjectName
:::

The ServiceStack Auth is pre-configured to persist users in an OrmLite Auth Repository (default SQLite) and enables both local
Username/Password Credentials Auth as well as external Sign In's via Facebook, Twitter, Google and the new Microsoft Graph OAuth providers:

```csharp
container.Register<IDbConnectionFactory>(c =>
    new OrmLiteConnectionFactory(":memory:", SqliteDialect.Provider));

container.Register<IAuthRepository>(c =>
    new OrmLiteAuthRepository(c.Resolve<IDbConnectionFactory>()) {
        UseDistinctRoleTables = true,
    });
container.Resolve<IAuthRepository>().InitSchema();

// TODO: Replace OAuth App settings in: appsettings.Development.json
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    new IAuthProvider[] {
        new NetCoreIdentityAuthProvider(AppSettings) { // Adapter to enable ServiceStack Auth in MVC
            AdminRoles = { "Manager" }, // Automatically Assign additional roles to Admin Users
        },
        new CredentialsAuthProvider(AppSettings), // Sign In with Username / Password credentials 
        new FacebookAuthProvider(AppSettings),    // Create App at: https://developers.facebook.com/apps
        new TwitterAuthProvider(AppSettings),     // Create App at: https://dev.twitter.com/apps
        new GoogleAuthProvider(AppSettings),      // https://console.developers.google.com/apis/credentials
        new MicrosoftGraphAuthProvider(AppSettings), // Create App https://apps.dev.microsoft.com
    }) {
    IncludeRegistrationService = true,
    IncludeAssignRoleServices = false,
});
```

In ServiceStack users with the `Admin` roles are "super users" with unrestricted access to all protected resources whereas in MVC we need to specify 
all the Roles Admin Users should have access to with `AdminRoles` above.

We also see the built-in `Register` and `AssignRoles` Services are enabled to allow new User Registration and assignment of roles/permissions to existing users.

On Startup, 3 users are created to test out the different access levels: 

 1. A basic Authenticated User 
 2. A Manager with the `Manager` role 
 3. A Super User with the `Admin` role

```csharp
if (authRepo.GetUserAuthByUserName("user@gmail.com") == null)
{
    var testUser = authRepo.CreateUserAuth(new UserAuth
    {
        DisplayName = "Test User",
        Email = "user@gmail.com",
        FirstName = "Test",
        LastName = "User",
    }, "p@55wOrd");
}

if (authRepo.GetUserAuthByUserName("manager@gmail.com") == null)
{
    var roleUser = authRepo.CreateUserAuth(new UserAuth
    {
        DisplayName = "Test Manager",
        Email = "manager@gmail.com",
        FirstName = "Test",
        LastName = "Manager",
    }, "p@55wOrd");
    authRepo.AssignRoles(roleUser, roles:new[]{ "Manager" });
}

if (authRepo.GetUserAuthByUserName("admin@gmail.com") == null)
{
    var roleUser = authRepo.CreateUserAuth(new UserAuth
    {
        DisplayName = "Admin User",
        Email = "admin@gmail.com",
        FirstName = "Admin",
        LastName = "User",
    }, "p@55wOrd");
    authRepo.AssignRoles(roleUser, roles:new[]{ "Admin" });
}
```

You can sign in with any of these users and go to the the home page to test the behavior of the different granular protection levels
which contains links to both MVC and ServiceStack Public and Protected Pages and Services.

**mvcauth** also comes complete with User Registration where users can Sign up with either Password or using any of the registered OAuth providers:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcauth-login.png)

## Defaults to MVC Auth Redirect Conventions

When using `NetCoreIdentityAuthProvider` we assume you're going to use MVC for your UI so it overrides the HTML Redirects 
that Users will be redirected to when trying to access Pages they don't have access to:

```csharp
authFeature.HtmlRedirect = "~/Account/Login";
authFeature.HtmlRedirectAccessDenied = "~/Account/AccessDenied";
authFeature.HtmlRedirectReturnParam = "ReturnUrl";
authFeature.HtmlRedirectReturnPathOnly = true;
```

Where non-Authenticated Users will be redirected to MVC's convention of `/Account/Login?ReturnUrl=` instead of ServiceStack's `/login?redirect=`.

Alternatively you can retain ServiceStack's HTML redirect defaults with:

```csharp
new NetCoreIdentityAuthProvider(AppSettings) {
    OverrideHtmlRedirect = false
}
```
