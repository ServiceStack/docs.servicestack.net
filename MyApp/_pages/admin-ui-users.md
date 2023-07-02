---
title: User Admin Feature
---

The User Admin Plugin is a lightweight API for providing user management functionality around Auth Repository APIs and enables remote programmatic access to manage your registered [User Auth Repository](/auth/authentication-and-authorization#user-auth-repository), featuring:

 - Works with existing `IUserAuthRepository` sync or async providers
 - Utilizes Progressive enhancement, e.g. search functionality utilizes `IQueryUserAuth` (if exists) performing a wildcard search over multiple fields, otherwise falls back to exact match on `UserName` or `Email`
 - Supports managing Auth Repositories utilizing custom `UserAuth` data models
 - Flexible UI options for customizing which fields to include in Search Results and Create/Edit UIs
 - Rich Metadata aggregating only App-specific Roles & Permissions defined in your App
 - User Events allow you to execute custom logic before & after each Created/Updated/Deleted User

### Installation

The `AdminUsersFeature` plugin contains no additional dependencies that at a minimum can be registered with:

```csharp
Plugins.Add(new AdminUsersFeature());
```

<div class="not-prose"> 
<a href="https://blazor-tailwind-api.jamstacks.net/admin-ui">
    <h3 class="text-center font-medium text-3xl mb-3">/admin-ui/users</h3>
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/users.png">
    </div>
</a>
</div>

::: info
An `IAuthRepository` is a required registered dependency to be able to use the `AdminUsersFeature` plugin.
:::

## Managing Users

By default, the Add and Edit Users forms contains the default layout of common properties in [UserAuth.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/UserAuth.cs)

<div class="flex justify-center py-8">
    <a href="https://blazor-tailwind-api.jamstacks.net/admin-ui/users?edit=2">
        <img src="/img/pages/admin-ui/users-edit-default.png" style="max-width:800px;">
    </a>
</div>

## Customization

To customize this user interface to accommodate custom properties, the `UserFormLayout` needs to be overridden.

For example, below we have a custom `UserAuth` called `AppUser` with additional properties.

```csharp
// Custom User Table with extended Metadata properties
public class AppUser : UserAuth
{
    public Department Department { get; set; }
    public string? ProfileUrl { get; set; }
    public string? LastLoginIp { get; set; }

    public bool IsArchived { get; set; }
    public DateTime? ArchivedDate { get; set; }

    public DateTime? LastLoginDate { get; set; }
}

public enum Department
{
    None,
    Marketing,
    Accounts,
    Legal,
    HumanResources,
}
```

The `AdminUsersFeature` has multiple fiends that can be used to customize the UI including.

| Property Name             | Description                                                        |
|---------------------------|--------------------------------------------------------------------|
| `QueryUserAuthProperties` | Columns visible in query results for users.                        |
| `QueryMediaRules`         | Which columns *start* appearing at different screen sizes.         |
| `UserFormLayout`          | Control which fields are used for Create/Edit and their placement. |

### Custom User Form Layout

Similar to the [API Explorer](./api-explorer.md#formlayout) `FormLayout` customization, `UserFormLayout` is used to control placement and details about individual fields.

```csharp
appHost.Plugins.Add(new ServiceStack.Admin.AdminUsersFeature {
    // Show custom fields in Search Results
    QueryUserAuthProperties = new() {
        nameof(AppUser.Id),
        nameof(AppUser.Email),
        nameof(AppUser.DisplayName),
        nameof(AppUser.Department),
        nameof(AppUser.CreatedDate),
        nameof(AppUser.LastLoginDate),
    },

    QueryMediaRules = new()
    {
        MediaRules.ExtraSmall.Show<AppUser>(x => new { x.Id, x.Email, x.DisplayName }),
        MediaRules.Small.Show<AppUser>(x => x.Department),
    },

    // Add Custom Fields to Create/Edit User Forms
    FormLayout = new() {
        Input.For<AppUser>(x => x.Email, x => x.Type = Input.Types.Email),
        Input.For<AppUser>(x => x.DisplayName),
        Input.For<AppUser>(x => x.UserName),
        Input.For<AppUser>(x => x.Company,      c => c.FieldsPerRow(2)),
        Input.For<AppUser>(x => x.Department,   c => c.FieldsPerRow(2)),
        Input.For<AppUser>(x => x.PhoneNumber,  c => c.Type = Input.Types.Tel),
        Input.For<AppUser>(x => x.Nickname,     c => {
            c.Help = "Public alias (3-12 lower alpha numeric chars)";
            c.Pattern = "^[a-z][a-z0-9_.-]{3,12}$";
        }),
        Input.For<AppUser>(x => x.ProfileUrl,   c => c.Type = Input.Types.Url),
        Input.For<AppUser>(x => x.IsArchived,   c => c.FieldsPerRow(2)),
        Input.For<AppUser>(x => x.ArchivedDate, c => c.FieldsPerRow(2)),
    }
});
```

Enabling the use of custom properties as well as formatting for ease of use. `UserFormLayout` updates the `Create` and `Edit` screens in the Admin UI.

<div class="flex justify-center py-8">
    <a href="https://blazor-tailwind-api.jamstacks.net/admin-ui/users?edit=2">
        <img src="/img/pages/admin-ui/users-edit-custom.png" style="max-width:800px;">
    </a>
</div>

## Admin User Services

The Admin User back-end APIs themselves can also be used to manage users within your own Apps. 

All the Admin Users DTOs below contains everything needed to call its APIs from [.NET Service Clients](/csharp-client) which are all contained within **ServiceStack.Client** so no additional dependencies are needed.

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
