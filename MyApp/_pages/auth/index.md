---
title: Authentication Overview
---

## Authentication Models

As of [ServiceStack v8](/releases/v8_00) there are 2 main Authentication Models available to ServiceStack Apps:

 - [ASP .NET Core Identity](/auth/identity-auth) - Recommended for .NET 8+ Apps
 - [ServiceStack Auth](/auth/authentication-and-authorization) - Universal Auth Model compatible with all ServiceStack Apps  (e.g. .NET or .NET Framework)

### ASP.NET Core Identity Auth now default from ServiceStack v8

A significant change from **ServiceStack v8** is the adoption of the same ASP.NET Core Identity Authentication 
that's configured in Microsoft's default Projects templates is also used in ServiceStack's newest Project Templates.

## History of ServiceStack Authentication

ServiceStack has always maintained its own [Authentication and Authorization](https://docs.servicestack.net/auth/authentication-and-authorization) provider model, 
primarily as it was the only way to provide an integrated and unified Authentication model that worked across all our 
supported hosting platforms, inc. .NET Framework, ASP.NET Core on .NET Framework, HttpListener and .NET (fka .NET Core).

Whilst the Authentication story in ASP.NET has undergone several cycles of changes over the years, the ServiceStack 
Auth Model has  remained relatively consistent and stable, with no schema changes required since release whilst still 
providing flexible options for [extending UserAuth tables](https://docs.servicestack.net/auth/auth-repository#extending-userauth-tables) and typed [User Sessions](https://docs.servicestack.net/auth/sessions#using-typed-sessions-in-servicestack).

### .NET Framework considered legacy

Although the multi-platform support of the unified Authentication model has been vital for Organizations migrating their systems
to .NET (Core) where ServiceStack Customers have been able to enjoy [Exceptional Code reuse](https://docs.servicestack.net/netcore#exceptional-code-reuse),
it's become clear that the .NET platform (e.g. .NET 8) is the only platform that should be considered for new projects and
that .NET Framework should only be considered a stable legacy platform for running existing systems on.

Given Microsoft has committed to [Authentication Improvements in .NET 8](https://devblogs.microsoft.com/dotnet/whats-new-with-identity-in-dotnet-8/)
it's become more important to easily integrate ServiceStack with new and existing .NET projects to access these new features
than to continue recommending ServiceStack's unified Auth Providers as the default option for new projects.

## Protecting Services

### Declarative Validation Attributes

The recommended way to protect your ServiceStack APIs is to continue to use the [Declarative Validation](https://docs.servicestack.net/declarative-validation)
attributes which are decoupled from any implementation so be safely annotated on Request DTOs without adding
any implementation dependencies, where they're also accessible to Clients and UIs using the Request DTOs to invoke your APIs.

The available Typed Authorization Attributes include:

| Attribute                   | Description                                            |
|-----------------------------|--------------------------------------------------------|
| `[ValidateIsAuthenticated]` | Restrict access toAuthenticated Users only             |
| `[ValidateIsAdmin]`         | Restrict access to Admin Users only                    |
| `[ValidateHasRole]`         | Restrict access to only Users assigned with this Role  |
| `[ValidateHasClaim]`        | Restrict access to only Users assigned with this Claim |
| `[ValidateHasScope]`        | Restrict access to only Users assigned with this Scope |

That can be annotated on **Request DTOs** to protect APIs:

```csharp
[ValidateIsAuthenticated]
[ValidateIsAdmin]
[ValidateHasRole(role)]
[ValidateHasClaim(type,value)]
[ValidateHasScope(scope)]
public class Secured {}
```


## The Authenticate attribute

The `[Authenticate]` [Request Filter Attribute](/filter-attributes) tells ServiceStack which Services needs authentication by adding it to your Service implementations, e.g:

```csharp
[Authenticate]
public class SecuredService : Service
{
    public object Get(Secured request)
    {
        IAuthSession session = this.GetSession();
        return new SecuredResponse() { Test = "You're" + session.FirstName };
    }

    public object Put(Secured request)
    {
        return new SecuredResponse() { Test = "Valid!" };
    }

    public object Post(Secured request)
    {
        return new SecuredResponse() { Test = "Valid!" };
    }

    public object Delete(Secured request)
    {
        return new SecuredResponse() { Test = "Valid!" };
    }
}
```

If you want, that authentication is only required for GET and PUT requests for example, you have to provide some extra parameters to the `Authenticate` attribute.

```csharp
[Authenticate(ApplyTo.Get | ApplyTo.Put)] 
```

## RequiredRole and RequiredPermission attributes

ServiceStack also includes a built-in role & permission based authorization attributes where you can apply the `[Required*]` Request Filter Attributes on your Service classes to apply to all Services or limited to a single Service:

```csharp
[Authenticate]
//All HTTP (GET, POST...) methods need "CanAccess"
[RequiredRole("Admin")]
[RequiredPermission("CanAccess")]
public class MyServices : Service
{
    public object Get(Secured request) {}

    [RequiredPermission("CanAdd")]
    public object Put(Secured request) {}
    
    [RequiredPermission("CanAdd")]
    public object Post(Secured request) {}
    
    [RequiredPermission("AdminRights", "CanDelete")]
    public object Delete(Secured request) {}
}
```

Now the client needs the permissions:

- **CanAccess** to make a GET request
- **CanAccess**, **CanAdd** to make a PUT/POST request
- **CanAccess**, **AdminRights** and **CanDelete** to make a DELETE request

If instead you want to allow access to users in **ANY** Role or Permission use:

```csharp
[RequiresAnyRole("Admin","Member")]
[RequiresAnyRole(ApplyTo.Put | ApplyTo.Post, "Admin","Owner","Member")]
[RequiresAnyPermission(ApplyTo.Delete, "AdminRights", "CanDelete")]
public class MyServices : Service
{
    public object Get(Secured request) {}
    public object Put(Secured request) {}
    public object Post(Secured request) {}
    public object Delete(Secured request) {}
}
```

These attributes can also be applied to Request DTOs however as they would add a dependency to **ServiceStack.dll**, it's recommended to

## Enabling Authentication at different levels

### Using the [Authenticate] Attribute

You can protect services by adding the `[Authenticate]` attribute on either the Action:

```csharp
class MyService : Service 
{
    [Authenticate] 
    public object Get(Protected request) { ... }
}
```

The Request DTO

```csharp
[Authenticate] 
class Protected { ... }
```

Or the service implementation

```csharp
[Authenticate] 
class MyService : Service 
{
    public object Get(Protected request) { ... }
}
```

Or by inheriting from a base class

```csharp
[Authenticate] 
class MyServiceBase : Service { ... }

class MyService : MyServiceBase {
    public object Get(Protected request) { ... }
}
```

### Using a Global Request Filter

Otherwise you can use a [Global Request Filter](/request-and-response-filters) if you wanted to restrict all requests any other way, e.g something like:

```csharp
GlobalRequestFiltersAsync.Add(async (req, res, requestDto) =>
{
    if (ShouldProtectRequest(requestDto)) 
    {
        await new AuthenticateAttribute().ExecuteAsync(req, res, requestDto);
    }
});
```

### GET Authenticate Requests are disabled by default

**GET** `/auth/{provider}` requests are disabled by default to discourage sending confidential information in the URL.

The current exceptions which still allow **GET** requests include:

- `/auth` - Used to check if a User is Authenticated
- `/auth/logout` - Logging Out
- All OAuth Providers who starts their OAuth flow by navigating to `/auth/{provider}`

You can allow **GET** Authentication requests with:

```csharp
new AuthFeature {
    AllowGetAuthenticateRequests = req => true
}
```

Although it's recommended to change your code to use `POST` instead of `GET` requests.
Otherwise you can use the `IRequest req` parameter to check against a white list of known requests types.
