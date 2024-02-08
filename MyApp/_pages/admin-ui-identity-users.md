---
title: Identity User Admin Feature
---

Now that ServiceStack is deeply integrated into ASP.NET Core Apps, we're back to refocusing our efforts on adding value-added features that can benefit all .NET Core Apps.

The new Identity Auth Admin UI is an example of this, which can be enabled when registering the `AuthFeature` Plugin:

```csharp
public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new AuthFeature(IdentityAuth.For<ApplicationUser>(
                options => {
                    options.SessionFactory = () => new CustomUserSession();
                    options.CredentialsAuth();
                    options.AdminUsersFeature();
                })));
        });
}
```

Which just like the ServiceStack Auth [Admin Users UI](/admin-ui-users) enables a
Admin UI that's only accessible to **Admin** Users for managing **Identity Auth** users at `/admin-ui/users`.

Which displays a limited view of a User's info due to the minimal properties on the default `IdentityAuth` model:

<div>
    <img class="shadow" src="/img/pages/auth/identity/admin-ui-users-default.png">
</div>

These User Search results are customizable by specifying the `ApplicationUser` properties you want displayed instead:

```csharp
options.AdminUsersFeature(feature =>
{
    feature.QueryIdentityUserProperties =
    [
        nameof(ApplicationUser.Id),
        nameof(ApplicationUser.DisplayName),
        nameof(ApplicationUser.Email),
        nameof(ApplicationUser.UserName),
        nameof(ApplicationUser.LockoutEnd),
    ];
});
```

<div>
    <img class="shadow" src="/img/pages/auth/identity/admin-ui-users-custom.png">
</div>

The default display Order of Users is also customizable:

```csharp
feature.DefaultOrderBy = nameof(ApplicationUser.DisplayName);
```

As well as the Search behavior which can be replaced to search any custom fields, e.g:

```csharp
feature.SearchUsersFilter = (q, query) =>
{
    var queryUpper = query.ToUpper();
    return q.Where(x =>
        x.DisplayName!.Contains(query) ||
        x.Id.Contains(queryUpper) ||
        x.NormalizedUserName!.Contains(queryUpper) ||
        x.NormalizedEmail!.Contains(queryUpper));
};
```

The default Create and Edit Admin Users UI are also limited to editing the minimal `IdentityAuth` properties:

<div>
    <img class="shadow" src="/img/pages/auth/identity/admin-ui-users-create.png">
</div>

Whilst the Edit page includes standard features to lockout users, change user passwords and manage their roles:

<div>
    <img class="shadow" src="/img/pages/auth/identity/admin-ui-users-edit.png">
</div>

By default Users are locked out indefinitely, but this can also be changed to lock users out to a specific date, e.g:

```csharp
feature.ResolveLockoutDate = user => DateTimeOffset.Now.AddDays(7);
```

The forms editable fields can also be customized to include additional properties, e.g:

```csharp
feature.FormLayout =
[
    Input.For<ApplicationUser>(x => x.UserName, c => c.FieldsPerRow(2)),
    Input.For<ApplicationUser>(x => x.Email, c => { 
        c.Type = Input.Types.Email;
        c.FieldsPerRow(2); 
    }),
    Input.For<ApplicationUser>(x => x.FirstName, c => c.FieldsPerRow(2)),
    Input.For<ApplicationUser>(x => x.LastName, c => c.FieldsPerRow(2)),
    Input.For<ApplicationUser>(x => x.DisplayName, c => c.FieldsPerRow(2)),
    Input.For<ApplicationUser>(x => x.PhoneNumber, c =>
    {
        c.Type = Input.Types.Tel;
        c.FieldsPerRow(2); 
    }),
];
```

That can override the new `ApplicationUser` Model that's created and any Validation:

```csharp
feature.CreateUser = () => new ApplicationUser { EmailConfirmed = true };
feature.CreateUserValidation = async (req, createUser) =>
{
    await IdentityAdminUsers.ValidateCreateUserAsync(req, createUser);
    var displayName = createUser.GetUserProperty(nameof(ApplicationUser.DisplayName));
    if (string.IsNullOrEmpty(displayName))
        throw new ArgumentNullException(nameof(AdminUserBase.DisplayName));
    return null;
};
```

<div>
    <img class="shadow" src="/img/pages/auth/identity/admin-ui-users-create-custom.png">
</div>

<div>
    <img class="py-8 px-12" src="/img/pages/auth/identity/admin-ui-users-edit-custom.png">
</div>

### Admin User Events

Should you need to, Admin User Events can use used to execute custom logic before and after creating, updating and 
deleting users, e.g:

```csharp
feature.OnBeforeCreateUser = (request, user) => { ... };
feature.OnAfterCreateUser  = (request, user) => { ... };
feature.OnBeforeUpdateUser = (request, user) => { ... };
feature.OnAfterUpdateUser  = (request, user) => { ... };
feature.OnBeforeDeleteUser = (request, userId) => { ... };
feature.OnAfterDeleteUser  = (request, userId) => { ... };
```

## Learn More

To further assist migrating to ASP .NET Identity Auth we've published a more detailed Migration guide highlighting and tackling 
other considerations including **Migrating Roles** and User **Foreign Keys References** in
[Migrating to ASP.NET Core Identity for Authentication](https://servicestack.net/posts/identity-migration).

