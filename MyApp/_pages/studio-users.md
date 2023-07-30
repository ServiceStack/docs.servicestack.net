---
slug: studio-users
title: Studio - User Management
---

::: warning Deprecated
**[ServiceStack Studio has been replaced](/releases/v6_02.html#retiring-studio)** by **[Admin UI](/admin-ui)**.
Last supported versions: **ServiceStack v6.1** with **app v6.0.4**.
:::

A glimpse of the Studio's **Users** Module can be seen in the [Bookings CRUD demo](/autoquery/crud-bookings) who utilizes it to create **Employee** and **Manager** users. 

## User Admin Feature

The `AdminUsersFeature` provides Admin User Management APIs enabling remote programmatic access to your registered [User Auth Repository](/auth/authentication-and-authorization#user-auth-repository), featuring:

 - Works with existing `IUserAuthRepository` sync or async providers
 - Utilizes Progressive enhancement, e.g. search functionality utilizes `IQueryUserAuth` (if exists) performing a wildcard search over multiple fields, otherwise falls back to exact match on `UserName` or `Email`
 - Supports managing Auth Repositories utilizing custom `UserAuth` data models
 - Flexible UI options for customizing which fields to include in Search Results and Create/Edit UIs
 - Rich Metadata aggregating only App-specific Roles & Permissions defined in your App
 - User Events allow you to execute custom logic before & after each Created/Updated/Deleted User

User Admin Plugin is a lightweight API around Auth Repository APIs with no additional dependencies that can be registered with:

```csharp
Plugins.Add(new AdminUsersFeature());
```

### Studio User Management UI

Where Studio's compatibility-based API will only enable it for remote ServiceStack instances with the plugin enabled:

![](/img/pages/studio/studio-home.png)

In the Users Module you'll need to Sign In as an **Admin** User to gain access which for new Apps created with `auth-db` mix script will only have the admin user:

![](/img/pages/studio/studio-user-results.png)

That was created in the [Configure.AuthRepository.cs](https://github.com/NetCoreApps/BookingsCrud/blob/main/Acme/Configure.AuthRepository.cs) Modular [Startup](/modular-startup) script:

```csharp
[assembly: HostingStartup(typeof(Acme.ConfigureAuthRepository))]

public class ConfigureAuthRepository : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => services.AddSingleton<IAuthRepository>(c =>
            new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
                UseDistinctRoleTables = true
            }))
        .ConfigureAppHost(appHost => {
            var authRepo = appHost.Resolve<IAuthRepository>();
            authRepo.InitSchema();
            // CreateUser(authRepo, "admin@email.com", "Admin User", "p@55wOrd", roles:new[]{ RoleNames.Admin });
        }, afterConfigure: appHost => 
            appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents()));

    // Add initial Users to the configured Auth Repository
    public void CreateUser(IAuthRepository authRepo, string email, string name, string password, string[] roles)
    {
        if (authRepo.GetUserAuthByUserName(email) == null)
        {
            var newAdmin = new AppUser { Email = email, DisplayName = name };
            var user = authRepo.CreateUserAuth(newAdmin, password);
            authRepo.AssignRoles(user, roles);
        }
    }
}
```

This screen allows you Search for & edit existing users or create new Users. Both Create & Edit forms will default to only showing the most common User Info fields for creating a new User:

![](/img/pages/studio/bookings-crud-screenshot.png)

Whilst the Edit UI also lets you perform common actions like changing a Users Password, Locking Users and Assigning Roles & Permissions which are auto populated from the Required & Validation Roles/Permission Attributes used in your App:

![](/img/pages/studio/studio-user-default-edit.png)

The fields in the Search Results and User forms can also be customized to suit your App. Lets say we want to use a custom 
`AppUser` class with a few additional fields, the `LastLoginIp` and `LastLoginDate` we'll want automatically populated
using the [OnAuthenticated AuthEvent](https://github.com/NetCoreApps/BookingsCrud/blob/main/Acme/Configure.AuthRepository.cs) whilst we want to add the users `Currency` to both the `IncludeUserAuthProperties` to include them in the Management forms and the `QueryUserAuthProperties` so they're returned in Search Results.

```csharp
public class AppUser : UserAuth
{
    public string LastLoginIp { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public string Currency { get; set; }
}

services.AddSingleton<IAuthRepository>(c =>
    new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
        UseDistinctRoleTables = true
    });            

Plugins.Add(new AdminUsersFeature {
    // Defaults to only allow 'Admin' users to manage users
    // AdminRole = RoleNames.Admin, 
    IncludeUserAuthProperties = new List<string> {
        nameof(AppUser.Id),
        nameof(AppUser.Email),
        nameof(AppUser.DisplayName),
        nameof(AppUser.FirstName),
        nameof(AppUser.LastName),
        nameof(AppUser.Company),
        nameof(AppUser.PhoneNumber),
        nameof(AppUser.LockedDate),
        nameof(AppUser.Currency),
    },
    QueryUserAuthProperties = new List<string> {
        nameof(AppUser.Id),
        nameof(AppUser.Email),
        nameof(AppUser.FirstName),
        nameof(AppUser.LastName),
        nameof(AppUser.Company),
        nameof(AppUser.Currency),
        nameof(AppUser.CreatedDate),
    },
    // Update denormalized data
    OnAfterUpdateUser = async (newUser, oldUser, service) => {
        if (newUser.Email != oldUser.Email)
        {
            await service.Db.UpdateOnlyAsync(() => new Customer { Email = newUser.Email },
                where: q => q.Id == oldUser.Id);
            await service.Db.UpdateOnlyAsync(() => new Subscription { Email = newUser.Email },
                where: q => q.CustomerId == oldUser.Id);
        }
    }
});
```

We also don't want to store any Address info on our Users so we've excluded them in our field lists which will result in our Custom UI:

![](/img/pages/studio/studio-user-customfields.png)

Our Custom Configuration makes use of custom event hooks for performing Custom App logic, in this case it uses the `OnAfterUpdateUser` event to update denormalized data when it detects a Users email has changed.

Alternatively you can prevent emails from being changed whilst still displaying them in the UI forms with an `OnBeforeUpdateUser` event:

```csharp
Plugins.Add(new AdminUsersFeature {
    // Disable Changing Email
    OnBeforeUpdateUser = async (newUser, oldUser, service) => {
        if (newUser.Email != oldUser.Email)
            throw new ArgumentException("Cannot change Email", nameof(IUserAuth.Email));
    },
});
```

There are `OnBefore`/`OnAfter` hooks for `Create`/`Update`/`Delete` User Events.

### Admin User Services

Of course user management isn't limited to Studio's UI as you can use the back-end APIs integrated within your own Apps. Here are all Admin Users DTOs containing everything needed to call its APIs from [.NET Service Clients](/csharp-client). These are contained within **ServiceStack.Client** so no additional dependencies are needed.

The APIs are fairly straight-forward with each DTO containing on the bare minimum Typed properties with all other UserAuth fields you want updated in the `UserAuthProperties` Dictionary. Whilst all User result-sets are returned in an unstructured Object Dictionary.

```csharp
public abstract class AdminUserBase : IMeta
{
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ProfileUrl { get; set; }
    public Dictionary<string, string> UserAuthProperties { get; set; }
    public Dictionary<string, string> Meta { get; set; }
}

public partial class AdminCreateUser : AdminUserBase, IPost, IReturn<AdminUserResponse>
{
    public List<string> Roles { get; set; }
    public List<string> Permissions { get; set; }
}

public partial class AdminUpdateUser : AdminUserBase, IPut, IReturn<AdminUserResponse>
{
    public string Id { get; set; }
    public bool? LockUser { get; set; }
    public bool? UnlockUser { get; set; }
    public List<string> AddRoles { get; set; }
    public List<string> RemoveRoles { get; set; }
    public List<string> AddPermissions { get; set; }
    public List<string> RemovePermissions { get; set; }
}

public partial class AdminGetUser : IGet, IReturn<AdminUserResponse>
{
    public string Id { get; set; }
}

public partial class AdminDeleteUser : IDelete, IReturn<AdminDeleteUserResponse>
{
    public string Id { get; set; }
}

public class AdminDeleteUserResponse : IHasResponseStatus
{
    public string Id { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}

public partial class AdminUserResponse : IHasResponseStatus
{
    public string Id { get; set; }
    public Dictionary<string,object> Result { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}

public partial class AdminQueryUsers : IGet, IReturn<AdminUsersResponse>
{
    public string Query { get; set; }
    public string OrderBy { get; set; }
    public int? Skip { get; set; }
    public int? Take { get; set; }
}

public class AdminUsersResponse : IHasResponseStatus
{
    public List<Dictionary<string,object>> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}
```
