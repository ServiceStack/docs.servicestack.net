---
title: ASP.NET Core Identity Auth
---

## ASP.NET Core Identity Auth in .NET 8 Templates

A significant change we've added to our new .NET 8 Project Templates is the adoption of the same
ASP.NET Core Identity Authentication that's configured in Microsoft's default Projects templates.

### History of ServiceStack Authentication

Since the dawn of ServiceStack we've always maintained our own [Authentication and Authorization](https://docs.servicestack.net/auth/authentication-and-authorization)
provider model, primarily as it was the only way to provide an integrated and unified Authentication model
that worked across all our supported hosting platforms, inc. .NET Framework, ASP.NET Core on .NET Framework, HttpListener
and what's now .NET (fka .NET Core).

In the meantime the Authentication story in ASP.NET has undergone several cycles of changes over the years, whereas
ServiceStack's Auth providers have remained relatively consistent and stable, with no schema changes required since release whilst still providing flexible
options for [extending UserAuth tables](https://docs.servicestack.net/auth/auth-repository#extending-userauth-tables) and
typed [User Sessions](https://docs.servicestack.net/auth/sessions#using-typed-sessions-in-servicestack).

#### .NET Framework considered legacy

Although the multi-platform support of the unified Authentication model has been vital for Organizations migrating their systems
to .NET (Core) where ServiceStack Customers have been able to enjoy [Exceptional Code reuse](https://docs.servicestack.net/netcore#exceptional-code-reuse),
it's become clear that the .NET platform (e.g. .NET 8) is the only platform that should be considered for new projects and
that .NET Framework should only be considered a stable legacy platform for running existing systems on.

Given Microsoft has committed to [Authentication Improvements in .NET 8](https://devblogs.microsoft.com/dotnet/whats-new-with-identity-in-dotnet-8/)
it's become more important to easily integrate ServiceStack with new and existing .NET projects to access these new features
than to continue recommending ServiceStack's unified Auth Providers as the default option for new projects.

### ServiceStack will use ASP.NET Core Identity Auth in new projects

Going forward all new ServiceStack .NET Project Templates will adopt ASP.NET Identity Auth, which will closely follow the
same approach as the Microsoft Project Template it integrates ServiceStack with, e.g. the new .NET 8
[Blazor](/posts/net8-blazor-template) and [Blazor Vue](/posts/net8-best-blazor) project templates adopts the exact same
Auth configuration as Microsoft's default Blazor Project Template configured with **Individual** Identity Auth.

To start off, the new .NET 8 Blazor and MVC Project Templates are configured to use the new Identity Auth Integration:

<div class="not-prose mx-auto px-8">
  <identity-auth-templates></identity-auth-templates>
</div>

The configuration and source code for the above projects are a good reference for how to configure ServiceStack with
Identity Auth in your own projects.

These use the same Individual Identity Auth Pages that Microsoft's MVC and Blazor templates use, except they've been enhanced
to use **Tailwind CSS** instead of Bootstrap, includes a **visual QR Code** implementation that was missing and includes an
`IEmailSender` SMTP solution that's easily enabled via Configuration to use your preferred **SMTP Server**.

### Migrating to ASP.NET Core Identity Auth

Migrating from ServiceStack Auth to Identity Auth should be relatively straight-forward as ServiceStack uses a compatible
Identity v2 password hashing format, which should let you migrate your users to Identity Auth without them noticing.

## ServiceStack's Identity Auth Integration

ServiceStack's Identity Auth integration is focused on high compatibility so existing ServiceStack Customers
require minimal effort to migrate existing code bases to use the new Identity Auth integration, despite Identity Auth
being an entirely different Auth Provider model and implementation.

It does this by retaining a lot of the existing user-facing Authentication and Session abstractions that ServiceStack APIs
use for Authorization as well as existing endpoints and Request/Response DTOs that ServiceStack Clients use to Authenticate,
but replace their internal implementation to use ASP.NET Identity Auth instead.

The new Identity Auth integration is contained in the .NET 6+ **ServiceStack.Extensions** NuGet package:

```xml
<PackageReference Include="ServiceStack.Extensions" Version="8.*" />
```

Which at a minimum lets you configure ServiceStack to use Identity Auth by simply registering the existing `AuthFeature`
plugin with the Application's custom EF `ApplicationUser` Data Model:

```csharp
Plugins.Add(new AuthFeature(IdentityAuth.For<ApplicationUser>()));
```

It requires minimal configuration as all Authorization is configured using ASP.NET Core's
standard APIs, any configuration in this plugin is then just used to customize Identity Auth's integration with ServiceStack.

There's also no new concepts to learn as all ASP .NET Core endpoints, pages and controllers continue to Authenticate against
the populated `ClaimsPrincipal` whilst all ServiceStack APIs continue to Authenticate against the populated typed
[User Session](https://docs.servicestack.net/auth/sessions).

The `AuthFeature` works by registering the following Identity Auth Providers:

### Identity Auth Providers

- [IdentityApplicationAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Extensions/Auth/IdentityApplicationAuthProvider.cs) - Converts an Identity Auth `ClaimsPrincipal` into a ServiceStack Session
- [IdentityCredentialsAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Extensions/Auth/IdentityCredentialsAuthProvider.cs) - Implements ServiceStack's `Authenticate` API using Identity Auth
- [IdentityJwtAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Extensions/Auth/IdentityJwtAuthProvider.cs) - Converts an Identity Auth JWT into an Authenticated ServiceStack Session

Only the `IdentityApplicationAuthProvider` is registered by default which is required to convert Identity Auth's `ClaimPrincipal`
into an Authenticated ServiceStack [Session](/auth/sessions). The other Auth Providers are required if you want to enable authentication with
ServiceStack's endpoints. E.g. ServiceStack's [Built-in UIs](https://servicestack.net/auto-ui) would require the Credentials Auth
to be enabled to authenticate via the built-in Sign In dialogs.

### Configuring Auth Providers

Which is what all the Blazor and MVC Identity Auth templates enable by default in
[Configure.Auth.cs](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp/Configure.Auth.cs):

```csharp
public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => 
        {
            appHost.Plugins.Add(new AuthFeature(IdentityAuth.For<ApplicationUser>(
                // Configure ServiceStack's Integration with Identity Auth
                options => {
                    options.EnableCredentialsAuth = true;
                    options.SessionFactory = () => new CustomUserSession();
                })
            ));
        });
}
```

If you're using a `CustomUserSession` you'll also need to register it with the `SessionFactory` for it to be used.

Each of the Identity Auth Providers can also be customized individually:

```csharp
Plugins.Add(new AuthFeature(IdentityAuth.For<ApplicationUser>(options => {
        // Configure IdentityApplicationAuthProvider
        options.AuthApplication...

        // Configure IdentityCredentialsAuthProvider
        options.EnableCredentialsAuth = true;
        options.AuthCredentials...

        // Configure IdentityJwtAuthProvider
        options.EnableJwtAuth = true;
        options.AuthJwt...
    })
));
```

Typically you'll want to use the included Identity UI Pages and dependencies to register new users and assign roles,
but if you have any existing client integrations that use ServiceStack APIs they can also be enabled with:

```csharp
Plugins.Add(new AuthFeature(IdentityAuth.For<ApplicationUser>(options => {
    // Include ServiceStack's Register API
    options.IncludeRegisterService = true;
    
    // Include ServiceStack's AssignRoles and UnAssignRoles APIs
    options.IncludeAssignRoleServices = true;
));
```

### Extending Identity Auth Cookies and User Sessions

By default all [well known Claim Names](https://github.com/ServiceStack/ServiceStack/blob/3ab3d23c85cf48435b8cd9386f25afab79fcb542/ServiceStack/src/ServiceStack.Extensions/Auth/IdentityApplicationAuthProvider.cs#L49)
are used to populate the User Session, but you can also include additional claims in the Identity Auth Cookie
and use them to populate the User Session by overriding `PopulateFromClaims()` in your
[CustomUserSession.cs](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp.ServiceInterface/Data/CustomUserSession.cs), e.g:

```csharp
public class CustomUserSession : AuthUserSession
{
    public override void PopulateFromClaims(IRequest httpReq, ClaimsPrincipal principal)
    {
        // Populate Session with data from Identity Auth Claims
        ProfileUrl = principal.FindFirstValue(JwtClaimTypes.Picture);
    }
}

// Add additional claims to the Identity Auth Cookie
public class AdditionalUserClaimsPrincipalFactory(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<IdentityOptions> optionsAccessor)
    : UserClaimsPrincipalFactory<ApplicationUser,IdentityRole>(userManager, roleManager, optionsAccessor)
{
    public override async Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
    {
        var principal = await base.CreateAsync(user);
        var identity = (ClaimsIdentity)principal.Identity!;

        var claims = new List<Claim>();
        // Add additional claims here
        if (user.ProfileUrl != null)
        {
            claims.Add(new Claim(JwtClaimTypes.Picture, user.ProfileUrl));
        }

        identity.AddClaims(claims);
        return principal;
    }
}
```

### Custom Application User Primary Key

The default `IdentityUser` uses a `string` as the primary key populated with a `Guid`, but you could also change it to use an
`int` by having your EF IdentityUser Data Model inherit from `IdentityUser<int>` instead:

```csharp
public class AppUser : IdentityUser<int>
{
    //...
}
```

You'll also need to specify the Key Type when registering the `AuthFeature` plugin:

```csharp
public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            appHost.Plugins.Add(new AuthFeature(IdentityAuth.For<AppUser,int>(
                options => {
                    options.EnableCredentialsAuth = true;
                    options.SessionFactory = () => new CustomUserSession();
                })
            ));
        });
}
```

Which the new .NET 8 BlazorDiffusion App does in [Configure.Auth.cs](https://github.com/NetCoreApps/BlazorDiffusionVue/blob/main/BlazorDiffusion/Configure.Auth.cs)
to be compatible with its existing ServiceStack `UserAuth` tables which used an `int` primary key.

## Using Identity Auth in ServiceStack Apps

One of the primary benefits of adopting Identity Auth is the wealth of documentation and resources available for it,
which also applies to how you would use Identity Auth to secure your own Apps.

If you're new to Identity Auth we recommend starting with the official introduction from Microsoft:

- [Introduction to Identity on ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)

To learn about securing Blazor Apps, go to:

- [ASP.NET Core Blazor authentication and authorization](https://learn.microsoft.com/en-us/aspnet/core/blazor/security/)

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

### SMTP IEmailSender

The .NET 8 Templates also include a nice solution for sending Identity Auth emails through the `IEmailSender` interface
which drops the Email Request in the registered Background MQ in
[Configure.Mq.cs](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp/Configure.Mq.cs)
which uses it to invoke the `SendEmail` API in
[EmailServices](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp.ServiceInterface/EmailServices.cs) in a
managed background worker:

```csharp
public class EmailSender(IMessageService messageService) : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        using var mqClient = messageService.CreateMessageProducer();
        mqClient.Publish(new SendEmail
        {
            To = email,
            Subject = subject,
            BodyHtml = htmlMessage,
        });

        return Task.CompletedTask;
    }
}
```

To enable it you'll need to register your preferred SMTP Server in your App's `appsettings.json`:

```json
{
  "SmtpConfig": {
    "Username": "username",
    "Password": "password",
    "Host": "smtp.mailtrap.io",
    "Port": 587,
    "FromEmail": "mail@example.org"
  }
}
```

Then uncomment the `EmailSender` registration in your `Program.cs`

```csharp
services.AddSingleton<IEmailSender, EmailSender>();
```

### Send any App Email

The nice part about this solution is that it's not limited to just sending Identity Auth emails, you can also use it to send
any App Email, either by publishing a message to the registered MQ with `PublishMessage` or by using the
[Service Gateway](https://docs.servicestack.net/service-gateway) to invoke the API directly, e.g:

```csharp
public class MyServices : Service
{
    public object Any(MyRequest request)
    {
        // Send Email in managed Background MQ Worker
        PublishMessage(new SendEmail {
            To = email,
            Subject = subject,
            BodyHtml = body,
        });

        // Block until Email is sent to SMTP Server
        Gateway.Send(new SendEmail {
            To = email,
            Subject = subject,
            BodyHtml = body,
        });
    }
}
```