---
slug: authentication-and-authorization
title: Authentication and Authorization
---

Built into ServiceStack is a simple and extensible Authentication Model that implements standard HTTP Session Authentication where 
[Session Cookies](/auth/sessions) are used to send Authenticated Requests which reference Users Custom UserSession POCO's in your App's 
registered [Caching Provider](/caching). 

ServiceStack also includes a number of Auth Providers which "Authenticate per-request" in this case the Authenticated User Session
is only attached to and lasts during the lifetime of the current `IRequest`. The implementation details of each Auth Provider are 
transparent to your Application where the same Attributes and APIs are used to retrieve, validate, authenticate and authorize Users.

ServiceStack's Authentication support is encapsulated in the optional `AuthFeature` plugin which provides an easy way to declaratively 
register and configure multiple Auth Providers you want to allow in your Application. It's highly configurable with a number of 
additional features like whether to enable built-in Registration for Registering new Users as well as Assign/UnAssign Roles Services
that Admins can use to assign Roles/Permissions to existing users.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="XKq7TkZAzeg" style="background-image: url('https://img.youtube.com/vi/XKq7TkZAzeg/maxresdefault.jpg')"></lite-youtube>

<div class="not-prose mx-auto px-8">
  <h3 id="identityauth-template" class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
      Create a Project with ServiceStack Auth
  </h3>
  <servicestack-auth-templates></servicestack-auth-templates>
</div>

### Highly customizable and versatile

ServiceStack's Authentication is also highly customizable and versatile from being able to choose from the plethora of Auth Providers
available or inheriting from them to create your own customized Auth Provider, inheriting `AuthUserSession` to use your own Custom POCO
with additional info you want to maintain for your Users, storing User Sessions in any of the available [Caching Providers](/caching), 
adding custom logic by handling any of the [Auth and Session Events](/auth/sessions#session-events) raised throughout the Auth lifecycle,
to specifying which back-end [Auth Repository](/auth/auth-repository) you want to persist your Authenticated Users in - supporting most popular RDBMS's and 
popular NoSQL data stores as seen in the high-level overview below:

### High Level Overview

![Authentication Overview](/img/pages/security/auth-highlevel-overview.svg?sanitize=true)

The `AuthenticateService` is the primary Service that manages Authentication which delegates to the specified Auth Provider that 
performs the Authentication, made available via its following endpoints:

 - `/auth/{provider}` - Authenticate against a specific Auth Provider
 - `/auth` - API to check if a Request is authenticated: returns **200** with basic session info if authenticated or **401** if not.
 - `/auth/logout` - Removes the Authenticated Session from the registered cache and clears Session Cookies.

### Credentials Auth Providers

If you would like ServiceStack to manage your Apps entire Authentication and persistence of Users you would use one of the available Auth Repositories
and authenticate against one of the following Auth Providers:

| Provider          | Class Name                  | Route                    | Description |
|-|-|-|-|
| **Credentials**   | `CredentialsAuthProvider`   | **/auth/credentials**    | Standard Authentication using Username/Password |
| **Basic Auth**    | `BasicAuthProvider`         | HTTP Basic Auth          | Username/Password sent via [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) |
| **Digest Auth**   | `DigestAuthProvider`        | HTTP Digest Auth         | Username/Password hash via [HTTP Digest Auth](https://en.wikipedia.org/wiki/Digest_access_authentication) |

New Users can be created via the `/register` Registration Service which be enabled with:

```csharp
Plugins.Add(new RegistrationFeature());
```

### OAuth Providers

The following OAuth Providers are built into ServiceStack and can be used in both ASP.NET Core and .NET Framework Apps:

| Provider          | Class Name                   | Route                    | Create OAuth App Link |
|-|-|-|-|
| **Facebook**      | `FacebookAuthProvider`       | **/auth/facebook**       | [developers.facebook.com/apps](https://developers.facebook.com/apps) |
| **Twitter**       | `TwitterAuthProvider`        | **/auth/twitter**        | [dev.twitter.com/apps](https://dev.twitter.com/apps) |
| **Google**        | `GoogleAuthProvider`         | **/auth/google**         | [console.developers.google.com](https://console.developers.google.com/apis/credentials) |
| **GitHub**        | `GithubAuthProvider`         | **/auth/github**         | [github.com/settings/applications/new](https://github.com/settings/applications/new) |
| **Microsoft**     | `MicrosoftGraphAuthProvider` | **/auth/microsoftgraph** | [apps.dev.microsoft.com](https://apps.dev.microsoft.com) |
| **LinkedIn**      | `LinkedInAuthProvider`       | **/auth/linkedin**       | [www.linkedin.com/secure/developer](https://www.linkedin.com/secure/developer) |
| **Yammer**        | `YammerAuthProvider`         | **/auth/yammer**         | [www.yammer.com/client_applications](http://www.yammer.com/client_applications) |
| **Yandex**        | `YandexAuthProvider`         | **/auth/yandex**         | [oauth.yandex.ru/client/new](https://oauth.yandex.ru/client/new) |
| **VK**            | `VkAuthProvider`             | **/auth/vkcom**          | [vk.com/editapp?act=create](http://vk.com/editapp?act=create) |
| **Odnoklassniki** | `OdnoklassnikiAuthProvider`  | **/auth/odnoklassniki**  | [www.odnoklassniki.ru/devaccess](http://www.odnoklassniki.ru/devaccess) |

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="aQqF3Sf2fco" style="background-image: url('https://img.youtube.com/vi/aQqF3Sf2fco/maxresdefault.jpg')"></lite-youtube>

### Session Authentication Overview

The diagram below outlines how standard session based Authentication works and how the different providers interact in more detail:

![Session Based Authentication](/img/pages/security/auth-session-auth.svg?sanitize=true)

Where the **Auth Provider** are unique for each Auth Provider but otherwise adopt the same Authentication process that results
in the same end result where an Authenticated `AuthUserSession` is persisted in the registered `ICacheClient` against the `ss-pid` Permanent Cookie
if the `Authenticate` request `RememberMe=true` otherwise against `ss-id` Temporary Session Cookie if not.

After a Request is Authenticated its Session Cookies are sent on subsequent requests and validated by ServiceStack's built in `[Authenticate]` and 
other `[Require*]` attributes to restrict access to valid users:

![Session Requests](/img/pages/security/auth-session-requests.svg?sanitize=true)

Once authenticated the Users Session can be accessed in your **Services** using the Typed and minimal `IAuthSession` APIs:

```csharp
AuthUserSession session = base.SessionAs<AuthUserSession>();
IAuthSession session = base.GetSession();
```

Of if you've registered to use a Custom UserSession POCO in the `AuthFeature` constructor use that instead of `AuthUserSession`.

Typed User Sessions also accessible in all Filters and handlers that have access to the current `IRequest` with:

```csharp
AuthUserSession session = req.SessionAs<AuthUserSession>();
IAuthSession session = req.GetSession();
```

See the [Session docs](/auth/sessions) for more info about customizing Sessions and handling different Session and Auth events.

### Authentication per Request Auth Providers

These Auth Providers include authentication with each request so the Authenticated User Session is only populated on the HTTP `IRequest` and not saved in the registered Cache Client. Unlike traditional Auth Providers above where there is a separate "Authentication" request to establish authentication, 
Auth Providers that implement `IAuthWithRequest` instead send their Authentication "per-request" where it's only populated on the current `IRequest`:

![Auth with Request Auth Providers](/img/pages/security/auth-auth-with-request-providers.svg?sanitize=true)

Whilst the Authentication Process is different you'd continue to use the same APIs and Attributes to access and validate the Users Session. 

The following Auth Providers below implement `IAuthWithRequest` and Authenticate per-request:

| Provider          | Class Name                   | Auth Method  | Description |
|-|-|-|-|
| **JWT**           | `JwtAuthProvider`            | Bearer Token | Stateless Auth Provider using [JSON Web Tokens](/auth/jwt-authprovider)  |
| **API Keys**      | `ApiKeyAuthProvider`         | Bearer Token | Allow 3rd Parties access to [authenticate without a password](/auth/api-key-authprovider) |
| **Basic Auth**    | `BasicAuthProvider`          | Basic Auth   | Authentication using [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) |
| **Digest Auth**   | `DigestAuthProvider`         | Digest Auth  | Authentication using [HTTP Digest Auth](https://en.wikipedia.org/wiki/Digest_access_authentication) |

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NTCUT7atoLo" style="background-image: url('https://img.youtube.com/vi/NTCUT7atoLo/maxresdefault.jpg')"></lite-youtube>

Some other special Auth Providers that Authenticate per-request include:

 - **Windows Auth** in `AspNetWindowsAuthProvider`  - Authentication using [Windows Auth](https://support.microsoft.com/en-us/help/323176/how-to-implement-windows-authentication-and-authorization-in-asp-net) built into ASP.NET.
 - **Claims Auth** in `NetCoreIdentityAuthProvider` - Pass through Auth Provider that delegates to ASP.NET Core Identity Auth or Identity Server.

### Integrated ASP.NET Core Authentication

The `NetCoreIdentityAuthProvider` is a bi-directional Authentication adapter that enables ServiceStack to use the same Authentication as the 
rest of your ASP.NET Core and MVC Application where it enables the following popular scenarios:

 - [Using ServiceStack Auth in MVC](/auth/identity-servicestack) - Use ServiceStack Auth to power ASP.NET Identity Auth, pre-configured in the [mvcauth](https://github.com/NetCoreTemplates/mvcauth) project template. 
 - [Using IdentityServer4 Auth in ServiceStack](/auth/identityserver) - Use IdentityServer4 to Authenticate ASP.NET Core and ServiceStack Services, 
pre-configured in the [mvcidentityserver](https://github.com/NetCoreTemplates/mvcidentityserver) project template.

### Community Auth Providers

  - [Azure Active Directory](https://github.com/jfoshee/ServiceStack.Authentication.Aad) - Allow Custom App to login with Azure Active Directory
  - [Azure Active Directory via Azure Graph for ServiceStack](https://github.com/ticky74/ServiceStack.Authentication.Azure)
  - [ServiceStack.Authentication.IdentityServer](https://github.com/MacLeanElectrical/servicestack-authentication-identityserver) - Integration with ASP.NET IdentityServer and provides OpenIDConnect / OAuth 2.0 Single Sign-On Authentication

### Basic Configuration

A minimal configuration needed to get Basic Authentication up and running is the following in `AppHost.Config()` (derived from the [AuthTests unit test](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/AuthTests.cs)):

```csharp 
public override void Configure(Container container)
{
    Plugins.Add(new AuthFeature(() => new AuthUserSession(),
        new IAuthProvider[] { 
            new BasicAuthProvider(),       //Sign-in with HTTP Basic Auth
            new CredentialsAuthProvider(), //HTML Form post of UserName/Password credentials
        }));

    container.Register<ICacheClient>(new MemoryCacheClient());

    var userRepo = new InMemoryAuthRepository();
    container.Register<IAuthRepository>(userRepo);
    
    //The IAuthRepository is used to store the user credentials etc.
    //Implement this interface to adjust it to your app's data storage
}
```

[AuthWebTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/) is a simple project that shows all Auth Providers configured and working in the same app. See the [AppHost](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/AppHost.cs) for an example of the code and the [Web.config](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/Web.config) for an example of the configuration required to enable each Auth Provider.

### OAuth Configuration

Once you have the `ConsumerKey` and `ConsumerSecret` you need to configure it with your ServiceStack host, via [Web.config](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/Web.config), e.g:

```xml
<add key="oauth.RedirectUrl"            value="https://yourhostname.com"/>
<add key="oauth.CallbackUrl"            value="https://yourhostname.com/auth/{0}"/>    
<add key="oauth.twitter.ConsumerKey"    value="3H1FHjGbA1N0n0aT5yApA"/>
<add key="oauth.twitter.ConsumerSecret" value="MLrZ0ujK6DwyjlRk2YLp6HwSdoBjtuqwXeHDQLv0Q"/>
```

For [.NET Core](/web-new) or [ASP.NET Core Apps](/templates/corefx) you can add the same keys to your `appsettings.json`, e.g:

```json
{
    "oauth.RedirectUrl":            "https://yourhostname.com",
    "oauth.CallbackUrl":            "https://yourhostname.com/auth/{0}",
    "oauth.twitter.ConsumerKey":    "3H1FHjGbA1N0n0aT5yApA",
    "oauth.twitter.ConsumerSecret": "MLrZ0ujK6DwyjlRk2YLp6HwSdoBjtuqwXeHDQLv0Q",
}
```

Each OAuth Config option fallbacks to the configuration without the provider name. If needed you provide OAuth specific configuration
by including the Auth Provider Name in the configuration, e.g:

```xml
<add key="oauth.twitter.RedirectUrl"    value="https://yourhostname.com"/>
<add key="oauth.twitter.CallbackUrl"    value="https://yourhostname.com/auth/twitter"/>    
```

Configuration can also be specified in code when registering the Auth Provider in the `AuthFeature` plugin in your AppHost, e.g:

```csharp
Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
    new TwitterAuthProvider(appSettings) { 
        RedirectUrl = "http://yourhostname.com/",
        CallbackUrl = "http://yourhostname.com/auth/twitter",
        ConsumerKey = "3H1FHjGbA1N0n0aT5yApA",
        ConsumerSecret = "MLrZ0ujK6DwyjlRk2YLp6HwSdoBjtuqwXeHDQLv0Q",
    },
}));
```

::: info
The Callback URL in each Application should match the CallbackUrl for your application which is typically: http://yourhostname.com/auth/{Provider}, e.g. http://yourhostname.com/auth/twitter for Twitter.
:::

### Allowing External Redirects

External Redirects used in the `?continue` params of `/auth` requests are disabled by default, they can be re-enabled with:

```csharp
new AuthFeature(...) {
    ValidateRedirectLinks = AuthFeature.AllowAllRedirects 
}
```

### Auth Repository

ServiceStack supports managing Users in multiple data stores via its [Auth Repository](/auth/auth-repository) abstraction and built-in providers.

### Session Persistence

Once authenticated the **AuthUserSession** model is populated and stored in the Cache using one of ServiceStack's [supported Caching providers](/caching). ServiceStack's Sessions simply uses the 
[ICacheClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/ICacheClient.cs)
API so any new provider added can be used for both Session and Caching, which currently includes:

  - **Memory**: `MemoryCacheClient` in [ServiceStack](https://nuget.org/packages/ServiceStack)
  - **Redis**: `RedisClient`, `PooledRedisClientManager` or `BasicRedisClientManager` in [ServiceStack.Redis](https://nuget.org/packages/ServiceStack.Redis)
  - **OrmLite**: `OrmLiteCacheClient` in [ServiceStack.Server](https://nuget.org/packages/ServiceStack.Server)
  - **AWS DynamoDB**: `DynamoDbCacheClient` in [ServiceStack.Aws](https://nuget.org/packages/ServiceStack.Aws)
  - **Memcached**: `MemcachedClientCache` in [ServiceStack.Caching.Memcached](https://nuget.org/packages/ServiceStack.Caching.Memcached)
  - **Azure**: `AzureTableCacheClient` in [ServiceStack.Azure](https://nuget.org/packages/ServiceStack.Azure)

The Auth Feature also allows you to specify your own custom `IUserAuthSession` type where you can capture additional metadata with your users session which will also get persisted and hydrated from the cache, e.g: 

```csharp
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    ...
));
```

::: info
If you're using Custom Sessions and have `JsConfig.ExcludeTypeInfo=true`, you need to [explicitly enable it](http://stackoverflow.com/q/18842685/85785) with `JsConfig<TCustomSession>.IncludeTypeInfo=true`.
:::

After authentication the client will receive a cookie with a session id, which is used to fetch the correct session from the `ICacheClient` internally by ServiceStack. Thus, you can access the current session in a service:

```csharp
public class SecuredService : Service
{
    public object Get(Secured request)
    {
        var session = this.SessionAs<AuthUserSession>();
        return new SecuredResponse() { Test = "You're" + session.FirstName };
    }
}
```

ServiceStack's Authentication, Caching and Session providers are completely new, clean, dependency-free testable APIs that doesn't rely on and is devoid of ASP.NET's existing membership, caching or session provider models. 

### AuthSecret Admin Session

Super User Requests using [Config.AdminAuthSecret](/debugging#authsecret) return an Authenticated Admin UserSession 
whose default values can be modified at `AuthFeature.AuthSecretSession`:

 - `DisplayName`: Admin
 - `UserName`: authsecret
 - `AuthProvider`: authsecret
 - `Roles`: Admin
 - `UserAuthId`: 0

### Embedded Login Page

`AuthFeature` adds a fallback **/login.html** page if the `HtmlRedirect` remains unchanged and no `/login.html` exists, otherwise
if using a custom `/login` page in either **Razor** or **Script Pages** they'll continue to be used instead.

The default `/login.html` page provides an auto Login page that supports authentication via Credentials as well as a generating a dynamic 
list of OAuth providers, e.g the [NorthwindCrud](https://github.com/NetCoreApps/NorthwindCrud) `/login` page with Facebook OAuth looks like:

![](/img/pages/release-notes/v5.9/auth-login.png)

If you're using an SPA App with client side routing to implement `/login`, the default login page can be disabled with:

```csharp
new AuthFeature {
    IncludeDefaultLogin = false
}
```

The login page supports same `continue` or `ReturnUrl` redirect params as [Logout API](#logout).

## World Validation

See the annotated [World Validation Docs](/world-validation) for a detailed walks through and showcases the implementation 
of how the most popular **Server HTML rendered** approaches and **Client UI rendered** technologies use the same built-in
Authentication, Registration and protected Services.

## Project Templates

Most of [ServiceStack's Project Templates](/templates/dotnet-new) are configured with Auth out-of-the-box or can be easily added to an empty [web](https://github.com/NetCoreTemplates/web)
project template:

:::sh
x new web ProjectName
:::

By [mixing in your desired auth](/mix-tool#mix-in-auth-repository) features, e.g. to configure your App to enable auth & maintain in SQL Server run:

:::sh
x mix auth auth-db sqlserver
:::

Checkout the [Bookings CRUD YouTube demo](https://youtu.be/XpHAaCTV7jE) for a quick preview of this in action.

## Live Demos

To illustrate Authentication integration with ServiceStack, see the authentication-enabled 
[Live Demos](https://github.com/NetCoreApps/LiveDemos) below:

### .NET Core

  - [Apple Sign In](https://github.com/NetCoreApps/AppleSignIn)
    - Apple Auth
  - [Bookings CRUD](https://github.com/NetCoreApps/BookingsCrud)
    - Credentials, Facebook, Google, Microsoft Auth
  - [New TechStacks](https://github.com/NetCoreApps/TechStacks)
    - GitHub, Twitter and JWT Auth
  - [SimpleAuth.Mvc](https://github.com/NetCoreApps/SimpleAuth.Mvc)
    - Twitter, Facebook, GitHub, VK, Yandex and Credentials Auth
  - [Chat](https://github.com/NetCoreApps/Chat)
    - Twitter, Facebook and GitHub Auth

### Mobile

  - [Android Java Chat](https://github.com/ServiceStackApps/AndroidJavaChat)
    - Facebook, Twitter and Google Auth
  - [Android Xamarin Chat](https://github.com/ServiceStackApps/AndroidXamarinChat)
    - Twitter Auth

### .NET Framework

  - [HttpBenchmarks Application](https://github.com/ServiceStackApps/HttpBenchmarks)
    - [Step-by-Step Authentication Guide](https://github.com/ServiceStackApps/HttpBenchmarks#authentication)
    - Twitter, Facebook, Google, LinkedIn and Credentials Auth
  - [Angular TechStacks](https://github.com/ServiceStackApps/TechStacks)
    - Twitter, GitHub and JWT Auth
  - [Gistlyn](https://github.com/ServiceStack/Gistlyn)
    - GitHub and JWT Auth
  - [AWS Auth](https://github.com/ServiceStackApps/AwsApps) 
    - Twitter, Facebook, GitHub, Google, Yahoo, LinkedIn, and Credentials Auth
  - [MVC and WebForms Example](/servicestack-integration) 
    - Twitter, Facebook, GitHub, Google, Yahoo, LinkedIn, VK, Credentials and Windows Auth
  - [Chat](https://github.com/ServiceStackApps/LiveDemos#chat)
    - Twitter, Facebook and GitHub Auth
  - [React Chat](https://github.com/ServiceStackApps/ReactChat)
    - Twitter, Facebook and GitHub Auth
  - [SocialBootstrap Api](https://github.com/ServiceStackApps/LiveDemos#social-bootstrap-api)
    - Twitter, Facebook, Yahoo and Credentials Auth

## Custom authentication and authorization

A good starting place to create your own Auth provider that relies on username/password validation is to subclass `CredentialsAuthProvider` and override the `bool TryAuthenticate(service, username, password)` method where you can provide your custom implementation. If you instead wanted to authenticate via HTTP Basic Auth
you would subclass `BasicAuthProvider` instead.

Both the default [BasicAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/BasicAuthProvider.cs) and [CredentialsAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/CredentialsAuthProvider.cs) (which it extends) can be extended, and their behavior overwritten. An example is below:

#### Async Custom AuthProvider

```csharp
using ServiceStack;
using ServiceStack.Auth;

// From v5.10+
public class CustomCredentialsAuthProvider : CredentialsAuthProvider
{
    public override async Task<bool> TryAuthenticateAsync(IServiceBase authService, 
        string userName, string password, CancellationToken token=default)
    {
        //Add here your custom auth logic (database calls etc)
        //Return true if credentials are valid, otherwise false
    }

    public override async Task<IHttpResult> OnAuthenticatedAsync(IServiceBase authService, 
        IAuthSession session, IAuthTokens tokens, Dictionary<string, string> authInfo, 
        CancellationToken token=default)
    {
        //Fill IAuthSession with data you want to retrieve in the app eg:
        session.FirstName = "some_firstname_from_db";
        //...

        //Call base method to Save Session and fire Auth/Session callbacks:
        return await base.OnAuthenticatedAsync(authService, session, tokens, authInfo, token);

        //Alternatively avoid built-in behavior and explicitly save session with
        //session.IsAuthenticated = true;
        //await authService.SaveSessionAsync(session, SessionExpiry, token);
        //authService.Request.Items[Keywords.DidAuthenticate] = true;
        //return null;
    }
}
```

#### Sync Custom AuthProvider

```csharp
using ServiceStack;
using ServiceStack.Auth;

public class CustomCredentialsAuthProvider : CredentialsAuthProviderSync
{
    public override bool TryAuthenticate(IServiceBase authService, 
        string userName, string password)
    {
        //Add here your custom auth logic (database calls etc)
        //Return true if credentials are valid, otherwise false
    }

    public override IHttpResult OnAuthenticated(IServiceBase authService, 
        IAuthSession session, IAuthTokens tokens, 
        Dictionary<string, string> authInfo)
    {
        //Fill IAuthSession with data you want to retrieve in the app eg:
        session.FirstName = "some_firstname_from_db";
        //...

        //Call base method to Save Session and fire Auth/Session callbacks:
        return base.OnAuthenticated(authService, session, tokens, authInfo);

        //Alternatively avoid built-in behavior and explicitly save session with
        //session.IsAuthenticated = true;
        //authService.SaveSession(session, SessionExpiry);
        //authService.Request.Items[Keywords.DidAuthenticate] = true;
        //return null;
    }
}
```
 
Then you need to register your custom credentials auth provider: 
 
```csharp
//Register all Authentication methods you want to enable for this web app.
Plugins.Add(new AuthFeature(() => new AuthUserSession(),
    new IAuthProvider[] {
        new CustomCredentialsAuthProvider(), //HTML Form post of User/Pass
    }
));
```

By default the AuthFeature plugin automatically registers the following (overridable) Service Routes:

```csharp
new AuthFeature = {
  ServiceRoutes = new Dictionary<Type, string[]> {
    { typeof(AuthenticateService),  new[]{ "/auth", "/auth/{provider}" }},
    { typeof(AssignRolesService),   new[]{ "/assignroles" }},
    { typeof(UnAssignRolesService), new[]{ "/unassignroles" }},
  }
};
```

### Logout

You can do a GET or POST to `/auth/logout` to logout the authenticated user or if you're using C# client you can logout with:

```csharp
client.Post(new Authenticate { provider = "logout" });
```

#### Redirect URL

Logging out will remove the Users Session from the Server and Session Cookies from the Client and redirect to the url in 
`continue`, `ReturnUrl` or configured `AuthFeature.HtmlRedirectReturnParam` **QueryString** or **FormData** Request param. 
If no redirect is specified it will fallback to redirect to `session.ReferrerUrl`, `Referer` HTTP Header or configured `AuthProvider.CallbackUrl`.

### Authenticating with .NET Service Clients

On the client you can use the [C#/.NET Service Clients](/csharp-client) to easily consume your authenticated Services.

To authenticate using your `CustomCredentialsAuthProvider` by POST'ing a `Authenticate` Request, e.g:

```csharp
var client = new JsonServiceClient(BaseUrl);

var authResponse = client.Post(new Authenticate {
    provider = CredentialsAuthProvider.Name, //= credentials
    UserName = "test@gmail.com",
    Password = "p@55w0rd",
    RememberMe = true,
});
```

If authentication was successful the Service Client `client` instance will be populated with authenticated session cookies which then allows calling Authenticated services, e.g:

```csharp
var response = client.Get(new GetActiveUserId());
```

If you've also registered the `BasicAuthProvider` it will enable your Services to accept [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) which is built-in the Service Clients that you can populate on the Service Client with:

```csharp
client.UserName = "test@gmail.com";
client.Password = "p@55w0rd";
```

Which will also let you access protected Services, e.g:

```csharp
var response = client.Get(new GetActiveUserId());
```

Although behind-the-scenes it ends up making 2 requests, 1st request sends a normal request which will get rejected with a `401 Unauthorized` and if the Server indicates it has the `BasicAuthProvider` enabled it will resend the request with the HTTP Basic Auth credentials. 

You could instead save the latency of the additional auth challenge request by specifying the client should always send the Basic Auth with every request:

```csharp
client.AlwaysSendBasicAuthHeader = true;
```

### Authenticating with HTTP

To Authenticate with your `CustomCredentialsAuthProvider` (which inherits from CredentialsAuthProvider) you would POST:

**POST** localhost:60339/auth/credentials?format=json

```json
{
    "UserName": "admin",
    "Password": "test",
    "RememberMe": true
}
```

When the client now tries to authenticate with the request above and the auth succeeded, the client will retrieve some cookies with a session id which identify the client on each Web Service call.

### Authentication via OAuth AccessTokens 

To improve OAuth Sign In integration from native Mobile or Desktop Apps you can also Authenticate via AccessTokens which can dramatically simplify the Development and User Experience by being able to leverage the Native Facebook, Twitter and Google Client SDK's to Sign In users locally then reuse their local **AccessToken** to Authenticate with back-end ServiceStack Servers. 

Example usage of this feature is in the [Integrated Facebook, Twitter and Google Logins](https://github.com/ServiceStackApps/AndroidJavaChat/#integrated-facebook-twitter-and-google-logins)
in Android Java Chat which is also able to [Automatically Sign In users with saved AccessTokens](https://github.com/ServiceStackApps/AndroidJavaChat#automatically-sign-in-previously-signed-in-users).

This capability is available on the popular OAuth Providers below:

- `FacebookAuthProvider` - Sign in with Facebook
- `TwitterAuthProvider` - Sign in with Twitter
- `GithubAuthProvider` - Sign in with Github
- `GoogleOAuth2Provider` - Sign in with Google

It can also be enabled in other OAuth2 Providers by implementing `VerifyAccessToken` to manually 
validate whether the provided AccessToken is valid with the registered OAuth App. The API to validate Access 
Tokens isn't part of the OAuth2 specification and is different (and often missing) for other OAuth2 providers. 

As an example, the `GoogleOAuth2Provider` uses a `VerifyAccessToken` implementation that's similar to:

```csharp
new GoogleOAuth2Provider {
    VerifyAccessToken = accessToken => {
        var url = $"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={accessToken}";
        var json = url.GetJsonFromUrl();
        var obj = JsonObject.Parse(json);
        return obj["issued_to"] == ConsumerKey;
    }
}
```

#### Client Authentication with AccessToken

Clients can utilize this feature with the new `AccessToken` and `AccessTokenSecret` properties on the existing
`Authenticate` Request DTO, sent with the **provider** that the AccessToken is for, e.g:

```csharp
var response = client.Post(new Authenticate {
    provider = "facebook",
    AccessToken = facebookAccessToken,
    RememberMe = true,
});
```

::: info
Most OAuth Providers only require sending an `AccessToken` with Twitter being the exception which also requires sending an `AccessTokenSecret`
:::

### User Sessions Cache

ServiceStack uses the [Cache Provider](/caching) which was registered in the IoC container:

```csharp
//Register to use an In Memory Cache Provider (default)
container.Register<ICacheClient>(new MemoryCacheClient());

//Configure an alt. distributed persisted cache, E.g Redis:
//container.Register<IRedisClientsManager>(c => 
//    new RedisManagerPool("localhost:6379"));
```

::: info Tip
If you've got multiple servers which run the same ServiceStack service, you can use Redis to share the sessions between these servers
:::

Please look at [SocialBootstrapApi](https://github.com/ServiceStack/SocialBootstrapApi/tree/master/src/SocialBootstrapApi) to get a full example.

::: info 
Of course you can also implement your own - custom - authentication mechanism. You aren't forced to use the built-in ServiceStack auth mechanism
:::

## Declarative Validation Attributes

The recommended way to protect your APIs is to use the [Declarative Validation](/declarative-validation) attributes which as they're decoupled from any implementation can be safely annotated on Request DTOs without adding any implementation dependencies. In addition by annotating Authorization and Validation attributes on Request DTOs captures this information into your APIs reusable DTOs, filtering this information down to clients where they can provide enriched User Experiences.

### Authorization Attributes

The available Typed Authorization Attributes include:

| Attribute                      | Description                                                             |
|--------------------------------|-------------------------------------------------------------------------|
| `[ValidateIsAuthenticated]`    | Protect access to this API to Authenticated Users only                  |
| `[ValidateIsAdmin]`            | Protect access to this API to Admin Users only                          |
| `[ValidateHasPermission]`      | Protect access to this API to only Users assigned with ALL Permissions  |
| `[ValidateHasRole]`            | Protect access to this API to only Users assigned with ALL Roles        |

Where they can be annotated on **Request DTOs** to protect APIs:

```csharp
[ValidateIsAuthenticated]            // or [ValidateRequest("IsAuthenticated")]
[ValidateIsAdmin]                    // or [ValidateRequest("IsAdmin")]
[ValidateHasRole(role)]              // or [ValidateRequest($"HasRole(`{role}`)")]
[ValidateHasPermission(permission)]  // or [ValidateRequest($"HasPermission(`{permission}`)")
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

Otherwise you can use a [global Request Filter](/request-and-response-filters) if you wanted to restrict all requests any other way, e.g something like:

```csharp
GlobalRequestFiltersAsync.Add(async (req, res, requestDto) =>
{
    if (ShouldProtectRequest(requestDto)) 
    {
        await new AuthenticateAttribute().ExecuteAsync(req, res, requestDto);
    }
});
```

## Customizing AuthProviders

#### CustomValidationFilter

The `CustomValidationFilter` on all AuthProviders lets you add post verification logic after a user has signed in with an OAuth provider and their OAuth metadata is retrieved. The filter lets you return a `IHttpResult` to control what error response is returned, e.g: 

```csharp
new FacebookAuthProvider(appSettings) { 
    CustomValidationFilter = authCtx => CustomIsValid(authCtx) 
        ? authCtx.Service.Redirect(authCtx.Session.ReferrerUrl
            .AddHashParam("f","CustomErrorCode"))
        : null,
}
```

Or could be used to redirect a network or users to a "Not Available in your Area" page with:

```csharp
Plugins.Add(new AuthFeature(..., 
    new IAuthProvider[] {
        new CredentialsAuthProvider {
            CustomValidationFilter = authCtx => 
                authCtx.Request.UserHostAddress.StartsWith("175.45.17")
                    ? HttpResult.Redirect("http://host.com/are-not-available")
                    : null
        }   
    }));
```

#### UserName Validation

The UserName validation for all Auth Repositories are configurable at:

```csharp
Plugins.Add(new AuthFeature(...){
    ValidUserNameRegEx = new Regex(@"^(?=.{3,20}$)([A-Za-z0-9][._-]?)*$", RegexOptions.Compiled),
})
```

Instead of RegEx you can choose to validate using a Custom Predicate. The example below ensures UserNames don't include specific chars:

```csharp
Plugins.Add(new AuthFeature(...){
    IsValidUsernameFn = userName => userName.IndexOfAny(new[] { '@', '.', ' ' }) == -1
})
```

#### AccountLocked Validator

Use `AccountLockedValidator` to override logic to determine when an account is locked, e.g. by default an Account is Locked when it has a `LockedDate` but
can be changed to allow locking accounts at a future date with:

```csharp
new CredentialsAuthProvider {
    AccountLockedValidator = (authRepo, userAuth, tokens) => 
        userAuth.LockedDate != null && userAuth.LockedDate <= DateTime.UtcNow;
}
```

Alternatively if you're using a Custom Auth Provider you can just override `IsAccountLocked()` to override this behavior.


#### Saving Extended OAuth Metadata

The new `SaveExtendedUserInfo` property (enabled by default) on all OAuth providers let you control whether to save the extended OAuth metadata available (into `UserAuthDetails.Items`) when logging in via OAuth.

#### MaxLoginAttempts

The `MaxLoginAttempts` feature lets you lock a User Account after multiple invalid login attempts, e.g:
 
```csharp
Plugins.Add(new AuthFeature(...) {
    MaxLoginAttempts = 5   // Lock user after 5 Invalid attempts
});
```

### Adding AuthProviders with Plugins

Plugins can register AuthProviders by calling `RegisterAuthProvider()` before the `AuthFeature` plugin is registered, which can be achieved in Plugins by having them implement `IPreInitPlugin`:

```csharp
public class MyPlugin : IPreInitPlugin
{
    public void BeforePluginsLoaded(IAppHost appHost)
    {
        appHost.GetPlugin<AuthFeature>().RegisterAuthProvider(new MyAuthProvider());
    }
}
```

### Auth Response Filter

Auth Providers can customize the `AuthenticateResponse` returned by implementing `IAuthResponseFilter` where 
it will get called back with a populated [AuthFilterContext](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/IAuthProvider.cs) for successful Authenticate Request DTO requests or `AuthResultContext` for successful OAuth requests:

```csharp
public interface IAuthResponseFilter
{
    // Intercept successful Authenticate Request DTO requests
    void Execute(AuthFilterContext authContext);
    
    // Intercept successful OAuth redirect requests
    Task ResultFilterAsync(AuthResultContext authContext, CancellationToken token=default);
}

public class AuthFilterContext
{
    public AuthenticateService AuthService    // Instance of AuthenticateService
    public IAuthProvider AuthProvider         // Selected Auth Provider for Request
    public IAuthSession Session               // Authenticated Users Session
    public Authenticate AuthRequest           // Auth Request DTO
    public AuthenticateResponse AuthResponse  // Auth Response DTO
    public string ReferrerUrl                 // Optimal Session Referrer URL to use redirects
    public bool AlreadyAuthenticated          // If User was already authenticated
    public bool DidAuthenticate               // If User Authenticated in this request
}

public class AuthResultContext
{
    public IHttpResult Result                 // Response returned for this successful Auth Request
    public IServiceBase Service               // Instance of Service used in this Request
    public IRequest Request                   // Current HTTP Request Context
    public IAuthSession Session               // Authenticated Users Session
}
```

The filters can be used to modify properties on the `AuthenticateResponse` DTO or OAuth successful redirect requests.
To completely replace the `AuthenticateResponse` returned, you can specify a `AuthFeature.AuthResponseDecorator`.

### ICustomUserAuth

The `ICustomUserAuth` interface can be implemented on User Auth Repositories that allow replacing the custom 
`UserAuth` and `UserAuthDetails` tables by returning the concrete Type that should be used instead:

```csharp
public interface ICustomUserAuth
{
    IUserAuth CreateUserAuth();
    IUserAuthDetails CreateUserAuthDetails();
}
```

This allows using the same `RegistrationFeature` and `RegisterService` to handle registering new users
with the substituted `IUserAuth` and `IUserAuthDetails` Types.

#### LoadUserAuthFilter

The LoadUserAuthFilter on `AspNetWindowsAuthProvider` lets you retrieve more detailed information about Windows Authenticated users during Windows Auth Authentication by using the .NET's ActiveDirectory services, e.g:

```csharp
//...
new AspNetWindowsAuthProvider(this) {
    LoadUserAuthFilter = LoadUserAuthInfo
}
//...

public void LoadUserAuthInfo(AuthUserSession userSession, 
    IAuthTokens tokens, Dictionary<string, string> authInfo)
{
    if (userSession == null) return;
    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
    {
        var user = UserPrincipal.FindByIdentity(pc, userSession.UserAuthName);
        tokens.DisplayName = user.DisplayName;
        tokens.Email = user.EmailAddress;
        tokens.FirstName = user.GivenName;
        tokens.LastName = user.Surname;
        tokens.FullName = (String.IsNullOrWhiteSpace(user.MiddleName))
            ? $"{user.GivenName} {user.Surname}"
            : $"{user.GivenName} {user.MiddleName} {user.Surname}";
        tokens.PhoneNumber = user.VoiceTelephoneNumber;
    }
}
```

### Customizable PopulateUserRoles on AspNetWindowsAuthProvider

The `AspNetWindowsAuthProvider` uses the public `IPrincipal.IsInRole()` API to determine if a User is in a particular Windows Auth role, however this can be slow when needing to query a large number of roles in LDAP as it would need to make an LDAP lookup for each role. 

Performance of this can now be improved by specifying a custom `PopulateUserRoles` implementation that overrides how User Roles are resolved, e.g:

```csharp
new AspNetWindowsAuthProvider (AppSettings) {
    PopulateUserRoles = (request, user, session) => {
        using (WindowsIdentity userId = request?.LogonUserIdentity)
        {
            List roles = new List();
            if (userId?.Groups != null)
            {
                foreach (var group in userId.Groups)
                {
                    // Remove the domain name from the name of the group, 
                    // if it has it, and you don't need it. 
                    var groupName = new SecurityIdentifier(group.Value)
                        .Translate(typeof(NTAccount)).ToString();
                    if (groupName.Contains("\")) 
                    groupName = groupName.Split('\')[1]; 
                    roles.Add(groupName);
                }
            }
            session.Roles = roles;
        }
    }
}
```

### In Process Authenticated Requests

You can enable the `CredentialsAuthProvider` to allow **In Process** requests to Authenticate without a Password with:

```csharp
new CredentialsAuthProvider {
    SkipPasswordVerificationForInProcessRequests = true,
}
```

When enabled this lets **In Process** Service Requests to login as a specified user without needing to provide their password. 

For example this could be used to create an [Intranet Restricted](/auth/restricting-services) **Admin-Only** Service that lets you login as another user so you can debug their account without knowing their password with:

```csharp
[RequiredRole("Admin")]
[Restrict(InternalOnly=true)]
public class ImpersonateUser 
{
    public string UserName { get; set; }
}

public class MyAdminServices : Service
{
    public async Task<object> Any(ImpersonateUser request)
    {
        using var service = base.ResolveService<AuthenticateService>(); //In Process
        return await service.PostAsync(new Authenticate {
            provider = AuthenticateService.CredentialsProvider,
            UserName = request.UserName,
        });
    }
}
```

::: info
Your Services can use the new `Request.IsInProcessRequest()` to identify Services that were executed in-process
:::

### Custom User Sessions using JWT Tokens

The [JWT Auth Provider](/auth/jwt-authprovider) allows for a more flexible approach to impersonating users as they allow
[Manually creating JWT Tokens](/auth/jwt-authprovider#creating-jwt-tokens-manually) to construct a custom User Session with Custom metadata, 
Roles and Permissions.

### IAuthMetadataProvider

An IAuthMetadataProvider provides a way to customize the authInfo in all AuthProviders. It also allows overriding of how extended Auth metadata like profileUrl is returned.

```csharp
public interface IAuthMetadataProvider
{
   void AddMetadata(IAuthTokens tokens, Dictionary<string,string> authInfo);

   string GetProfileUrl(IAuthSession authSession, string defaultUrl = null);
}
```

::: info
To override with a custom implementation, register `IAuthMetadataProvider` in the IOC
:::

### Generate New Session Cookies on Authentication 

The AuthFeature also regenerates new Session Cookies each time users login, this behavior can be disabled with:

```csharp
Plugins.Add(new AuthFeature(...) {
    GenerateNewSessionCookiesOnAuthentication = false
});
```

### ClientId and ClientSecret OAuth Config Aliases
 
OAuth Providers can use `ClientId` and `ClientSecret` aliases instead of `ConsumerKey` and `ConsumerSecret`, e.g:

```xml 
<appSettings>
    <add key="oauth.twitter.ClientId" value="..." />
    <add key="oauth.twitter.ClientSecret" value="..." />
</appSettings>
```

### Override Authorization HTTP Header

Request Filters can override the Authorization HTTP Header used in Auth Providers with:

```csharp
httpReq.Items[Keywords.Authorization] = $"Bearer {token}";
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


<a name="community"></a>

# Community Resources

  - [Simple Web Service Authentication with ServiceStack](https://steveellwoodnlc.medium.com/simple-web-service-authentication-with-servicestack-7294fe5493a2) by [@steveellwood](https://steveellwoodnlc.medium.com)
  - [Using IdentityServer 4 with ServiceStack and Angular](http://estynedwards.com/blog/2016/01/30/ServiceStack-IdentityServer-Angular/) by [@estynedwards](https://twitter.com/estynedwards)
  - [Adding Facebook Authentication using ServiceStack](http://buildclassifieds.com/2016/01/14/facebookauth/) by [@markholdt](https://twitter.com/markholdt)
  - [How to return JSV formatted collection types from SQL Server in OrmLite](http://blog.falafel.com/Blogs/adam-anderson/2013/10/28/how-to-return-jsv-formatted-collection-types-from-sql-server-to-servicestack.ormlite) by [AdamAnderson](http://blog.falafel.com/blogs/AdamAnderson)
  - [How to migrate ASP.NET Membership users to ServiceStack](http://blog.falafel.com/Blogs/adam-anderson/2013/10/23/how-to-migrate-asp.net-membership-users-to-servicestack) by [AdamAnderson](http://blog.falafel.com/blogs/AdamAnderson)
  - [Authentication in ServiceStack REST Services](http://www.binaryforge-software.com/wpblog/?p=242) by [@binaryforge](https://twitter.com/binaryforge)
  - [Building a ServiceStack OAuth2 resource server using DotNetOpenAuth](http://dylanbeattie.blogspot.com/2013/08/building-servicestack-based-oauth2.html) by [@dylanbeattie](https://twitter.com/dylanbeattie)
  - [Declarative authorization in REST services in SharePoint with F#](http://sergeytihon.wordpress.com/2013/06/28/declarative-authorization-in-rest-services-in-sharepoint-with-f-and-servicestack/) by [@sergey_tihon](https://twitter.com/sergey_tihon)
  - [Authenticate ServiceStack services against an Umbraco membership provider](http://stackoverflow.com/a/16845317/85785) by [Gavin Faux](http://stackoverflow.com/users/1664508/gavin-faux)
  - [Using OAuth with ArcGIS Online and ServiceStack](http://davetimmins.com/post/2013/april/oauth-with-arcgisonline-servicestack) by [@davetimmins](https://twitter.com/davetimmins)
  - [LinkedIn Provider for ServiceStack Authentication](http://www.binoot.com/2013/03/30/linkedin-provider-for-servicestack-authentication/) by [@binu_thayamkery](https://twitter.com/binu_thayamkery)
  - [A Step by Step guide to create a Custom IAuthProvider](http://enehana.nohea.com/general/customizing-iauthprovider-for-servicestack-net-step-by-step/) by [@rngoodness](https://twitter.com/rngoodness)
  - [Simple API Key Authentication With ServiceStack](http://rossipedia.com/blog/2013/03/simple-api-key-authentication-with-servicestack/) by [@rossipedia](https://twitter.com/rossipedia)
  - [CORS BasicAuth on ServiceStack with custom authentication](http://joeriks.com/2013/01/12/cors-basicauth-on-servicestack-with-custom-authentication/) by [@joeriks](https://twitter.com/joeriks)
  - [Authenticating ServiceStack REST API using HMAC](https://www.jokecamp.com/blog/authenticating-servicestack-rest-api-using-hmac/) by [@jokecamp](https://twitter.com/jokecamp)
  - ServiceStack Credentials Authentication and EasyHttp: [Part 1](http://blogs.lessthandot.com/index.php/DesktopDev/MSTech/servicestack-credentialsauthentication-and-easyhtpp-of), [Part 2](http://blogs.lessthandot.com/index.php/DesktopDev/MSTech/servicestack-credentialsauthentication-and-easyhtpp-of-1), [Part 3](http://blogs.lessthandot.com/index.php/DesktopDev/MSTech/servicestack-credentialsauthentication-and-easyhtpp-of-2) by [@chrissie1](https://twitter.com/chrissie1)
