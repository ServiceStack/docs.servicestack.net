---
title: Identity Roles & Claims UI
---

The Roles Admin UI is enabled when registering the [Admin Users UI](/admin-ui-identity-users#registration)
which enables management APIs and Admin UIs for managing Identity Auth Roles and Claims for both Users and Roles. 

Once registered it will be available from the **Roles** menu item in the Admin UI sidebar which can be used Add and Remove Application Roles:  

![](/img/pages/admin-ui/identityauth-roles.webp)

### Custom Application Roles

If your App uses an extended `IdentityRole` data model, it can be configured with:

```csharp
services.AddPlugin(
    new AuthFeature(IdentityAuth.For<ApplicationUser,ApplicationRole>(...)));
```

If it's also configured to use a different `PrimaryKey` type, it can be configured with: 

```csharp
services.AddPlugin(
    new AuthFeature(IdentityAuth.For<AppUser,AppRole,int>(...)));
```

### IdentityAuth Role Claims

The Edit Role Admin UI also supports Adding and Remove Claims for a Role, e.g:

![](/img/pages/admin-ui/identityauth-role-claims.webp)

Any Added or Removed Claims are only applied after clicking **Update Role**, likewise you can exit the UI without applying any changes by clicking **Cancel**.

### Behavior of Role Claims

Claims added to Roles have similar behavior to having Claims individually applied to all Users with that Role such that
when a User is Authenticated they're populated with all claims assigned to their Roles and their individual User Claims. 

## Validating Claims

::include admin-ui-claims-validation.md::
