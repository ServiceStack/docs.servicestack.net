---
slug: sessions
title: Sessions
---

The `AuthFeature` (plugin) already enables the SessionFeature, but if you want to make use of sessions and don't want to enable the built-in [Authentication](/auth/authentication-and-authorization), you will need to register it manually in your AppHost with:

```csharp
public override void Configure(Container container)
{
    Plugins.Add(new SessionFeature());
}
```

## Cookie Session Ids

When the `SessionFeature` is enabled, a [Global RequestFilter](/request-and-response-filters) is added to ServiceStack to ensure that all requests have a Temporary `ss-id` and a Permanent `ss-pid` session cookies set. These Session Cookies contain a unique Random Base64-encoded Id. The `ss-opt` cookie stores the users preference on whether they want their current session to be temporary (`ss-opt=temp`) or permanent (`ss-opt=perm`) - i.e. to **RememberMe** or not - The Default is Temporary. 

## Permanent and Temporary Session Ids

The Permanent session cookie `ss-pid` is always created even if `ss-opt` is Temporary - this allows you to link and track subsequent requests together which can be helpful for user request analyzing. In contrast the temporary Session Id `ss-id` uses a temporary cookie that does not persist across a users browser sessions.

If you're interested in the implementation, all the source code for ServiceStack's Sessions are kept in the [ISession](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/ISession.cs), [SessionFeature](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/SessionFeature.cs), [SessionFactory](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/SessionFactory.cs), [SessionExtensions](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/SessionExtensions.cs) and [ServiceExtensions](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServiceExtensions.cs) classes.

## Can be used with any ICacheClient

ServiceStack's implementation of Sessions are clean, in that they work with all of [ServiceStack's Caching Providers](/caching) and are simply pointers to POCOs in your Cache.

### Formatting of Keys used in Cache Providers

For typed or Custom AuthSession the key is: 

```
urn:iauthsession:{sessionId}
```

When using un-typed **Session Bag** the key is:

```
sess:{sessionId}:{key}
```

The general recommendation is to use typed sessions, which will give you type-safety benefits as well as being able to fetch your entire users session with a single cache call. If you use the dynamic/session bag then it will be a network call for each key accessed - although as caches are designed for fast-access, this isn't too much of a concern.

In code `IRequest.GetSessionId()` returns the right `ss-id/ss-pid` for that request so you can programmatically access the session key and session for a request directly from the registered cache with:

```csharp
var sessionKey = SessionFeature.GetSessionKey(httpReq.GetSessionId());
var session = await httpReq.GetCacheClientAsync().GetAsync<IAuthSession>(sessionKey);
```

## Auth with Request AuthProviders

Auth Providers that authenticate with each request that implement `IAuthWithRequest` like [JWT](/auth/jwt-authprovider), [API Key](/auth/api-key-authprovider) and `BasicAuthProvider` don't persist Users Sessions in the cache, they're only in the `IRequest` and only last for the duration of the Request.

### Overriding a User Session

This alternative solution for populating a Users Session on each request can be utilized by injecting an authenticated UserSession in:

```csharp
IRequest req = base.Request;
req.Items[Keywords.Session] = usersSession;
```

## Using Typed Sessions in ServiceStack

An example of using Typed Sessions is in the [Social Bootstrap Api](https://github.com/ServiceStack/SocialBootstrapApi) demo where a [CustomUserSession](https://github.com/ServiceStack/SocialBootstrapApi/blob/master/src/SocialBootstrapApi/Models/CustomUserSession.cs) is defined as:

```csharp
[DataContract]
public class CustomUserSession : AuthUserSession 
{
    [DataMember]
    public string CustomId { get; set; }
}
```

By inheriting [AuthUserSession](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/AuthUserSession.cs) you're able to keep all the users session together in 1 POCO, which allows you to access everything in 1 cache read or write.

::: info
When inheriting from `AuthUserSession` you will need to annotate your properties with `[DataMember]` as AuthUserSession is a DataContract class
:::

::: info
When using JWT and `UseTokenCookie`, sessions are not saved in cache, instead they are encapsulated in the stateless `ss-tok` cookie. JWT only keeps data essential to authentication, any additional data should be resolved only as needed. Custom claims can be added using `PopulateSessionFilter`/`CreatePayloadFilter`. See [JWT docs](/auth/jwt-authprovider#limit-to-essential-info) for more info
:::

To tell ServiceStack to use your Custom Typed Session instead, register it in the `AuthFeature` plugin:

```csharp
Plugins.Add(new AuthFeature(() => new CustomUserSession(), ...));
```

## Session events

Inheriting from the AuthUserSession also lets you add custom logic for different events in the User Session life-cycle:

```csharp
// Fired when a new Session is created
void OnCreated(IRequest httpReq) {}

// Called after new sessions are hydrated, can be used to populate session with more info at runtime
void OnLoad(IRequest httpReq) {}

// Called when the user is registered or on the first OAuth login
void OnRegistered(IRequest httpReq, IAuthSession session, IServiceBase service) {}

// Called after the user has successfully authenticated
void OnAuthenticated(IServiceBase authService, IAuthSession session, IAuthTokens tokens, 
    Dictionary<string, string> authInfo) {}

// Fired before the session is removed after the /auth/logout Service is called
void OnLogout(IServiceBase authService) {}

// Override with Custom Validation logic to Assert if User is allowed to Authenticate. 
// Returning a non-null response invalidates Authentication with IHttpResult response returned to client.
IHttpResult Validate(IServiceBase authService, IAuthSession session, 
    IAuthTokens tokens, Dictionary<string, string> authInfo);
```

### Auth Events

The same authentication hooks that are available in the Custom UserSession above are also available in `IAuthEvents` API: 

```csharp
public interface IAuthEvents
{
    void OnRegistered(IRequest req, IAuthSession session, IServiceBase registerService);
    void OnAuthenticated(IRequest req, IAuthSession session, IServiceBase authService, 
        IAuthTokens tokens, Dictionary<string, string> authInfo);
    void OnLogout(IRequest req, IAuthSession session, IServiceBase authService);
    void OnCreated(IRequest req, IAuthSession session);
}
```

The new AuthEvents API provide a loose-typed way where plugins can tap into the same hooks by registering it with `AuthFeature.AuthEvents`, e.g:

```csharp
public class WebSudoFeature : IPlugin, IAuthEvents
{
    public void Register(IAppHost appHost)
    {
        ...
        var authFeature = appHost.GetPlugin<AuthFeature>();
        authFeature.AuthEvents.Add(this);
    }

    // Add implementations of all `IAuthEvents` handlers
    public void OnCreated(IRequest httpReq, IAuthSession session) { ... }
}
```

An alternative way for accessing `IAuthEvents` is to register it like a normal dependency, e.g:

```csharp
container.RegisterAs<LogAuthEvents,IAuthEvents>();
```

To simplify custom implementations you can inherit from the empty concrete [AuthEvents](https://github.com/ServiceStack/ServiceStack/blob/7eb3a34a2e545a54c2591665328c16c5d398d37a/src/ServiceStack/Auth/AuthEvents.cs#L18-L25) and choose to only implement the callbacks you're interested in, e.g:

```csharp
public class LogAuthEvents : AuthEvents
{
    public static ILog Log = LogManager.GetLogger(typeof(LogAuthEvents));

    public override void OnLogout(IRequest httpReq, IAuthSession session, IServiceBase authService) 
    {
        Log.DebugFormat("User #{0} {1} has logged out", session.UserAuthId, session.UserName);
    }
}
```

## UserSession validation

Custom User Sessions can override `AuthUserSession.Validate()` to add additional logic for validating whether to allow a User to Authenticate, e.g:

```csharp
public class CustomUserSession : AuthUserSession
{
    public override IHttpResult Validate(IServiceBase authService, IAuthSession session, 
        IAuthTokens tokens, Dictionary<string, string> authInfo)
    {
        if (!ValidateEmail(session.Email))
            return HttpError.BadRequest($"{nameof(session.Email)} is invalid") as IHttpResult;
        
        return null;
    }
}
```

Returning any `IHttpResult` will cause Authentication to fail with the returned `IHttpResult` written to the response.

## Accessing Typed Session

You can access your custom UserAuth session inside your service using the `SesssionAs<T>()` extension method, e.g:

```csharp
public abstract class MyService : Service 
{
    public object Get(MyRequest request)
    {
        var typedSession = this.SessionAs<CustomUserSession>();
    }
}
```

## Adding a Convenience wrapper

To provide a typed, Convenient API for your service you can add the following to a base class, here's SocialBootstrapApi's [AppServiceBase](https://github.com/ServiceStack/SocialBootstrapApi/blob/master/src/SocialBootstrapApi/ServiceInterface/AppServiceBase.cs) example:

```csharp
public abstract class AppServiceBase : Service {
    private CustomUserSession userSession;
    protected CustomUserSession UserSession {
        get {
            return base.SessionAs<CustomUserSession>();
        }
    }
}
```

This will then enable you to access your users Session in your ServiceStack services with `base.UserSession`.

## Cookie Filters

Customization of Cookies can be enabled by overriding the host-specific methods in your `AppHost`:

```csharp
//ASP.NET Core
public override void CookieOptionsFilter(Cookie cookie, Microsoft.AspNetCore.Http.CookieOptions cookieOptions) {}

//Classic ASP.NET
public override void HttpCookieFilter(HttpCookie cookie) {}
```

## Enable Same Site Cookies

[Same Site Cookies](https://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/) are a good default to use 
in your Apps which restricts cookies from being sent cross-site in order to prevent against cross-site request forgery (CSRF) attacks. 

It can be configured in your `AppHost` with:

```csharp
SetConfig(new HostConfig
{
    UseSameSiteCookies = true
});
```

This restriction will prevent features reliant on cross-site cookies from working so you'll need to verify it's safe to enable in your Apps.
This restriction works with most Auth Providers except for `TwitterAuthProvider` who doesn't yet support the OAuth `state` callback that 
could be used instead of Session cookies.

## Secure Cookies enabled by default

[Secure Cookies](https://en.wikipedia.org/wiki/Secure_cookie) ensure that Cookies added over HTTPS are only resent in subsequent secure connections.

They're **enabled by default** for **Cookies added over SSL**, they can be disabled with:

```csharp
Plugins.Add(new HostConfig {
    UseSecureCookies = false
});
```

## Sharing ServiceStack's Typed Sessions in MVC and ASP.NET

ASP.NET's Session Provider model still maintains its old legacy .NET 1.0 roots with it's heavy XML-encumbered config model, it's coupled and un-testable API, and its [degrading performance limitations by design](http://stackoverflow.com/questions/3629709/i-just-discovered-why-all-asp-net-websites-are-slow-and-i-am-trying-to-work-out) makes it difficult for any web service framework to share the same User Sessions with the base ASP.NET Web Forms or MVC web host. 

ServiceStack gets around these limitations by providing its own de-coupled, testable and dependency-free [ICacheClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/ICacheClient.cs) and [ISession](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/ISession.cs) APIs - which all work simply together as they're just plain Guid Session Keys stored in Caches pointing to POCOs.

The method SessionFeature.GetSessionKey allows you to get a Session Key for a current request if you are trying to access it in ASP.NET Web Forms or MVC web host. Using a Session Key you can have a full control over Session object:

```csharp
// CacheClient is instance of ICacheClient

var sessionKey = SessionFeature.GetSessionKey();

// getting an existing User Session or create a new one 
var userSession = SessionFeature.GetOrCreateSession<AuthUserSession>(CacheClient); 
// or SessionFeature.GetOrCreateSession<CustomUserSession>(CacheClient); 
```

## Saving in Service

As a typed session is just a disconnected POCO, it needs to explicitly saved to be persisted - which you can do with the [base.SaveSession()](https://github.com/ServiceStack/ServiceStack/blob/6ac4bd1842c170f1569bb5aa1020a37c7bb4017d/src/ServiceStack/ServiceExtensions.cs#L73) Extension method.

```csharp
public async Task<object> Any(Request request)
{
    var session = await base.SessionAsAsync<AuthUserSession>();

    // modify session

    await base.Request.SaveSessionAsync(session);
}
```

## Saving outside a Service

If your logic is outside a ServiceStack service you can save your typed session by getting access to the ServiceStack `IRequest` which you can create from ASP.NET Request objects:

```csharp
IHttpRequest httpReq = aspCtx.ToRequest(); //HttpContext
IHttpRequest httpReq = aspReq.ToRequest(); //MVC HttpRequestBase
IHttpRequest httpReq = netCoreCtx.ToRequest(); //.NET Core HttpContext
IHttpRequest httpReq = listenerCtx.ToRequest(); //HttpListenerContext

//In ASP.NET hosts via the singleton
IHttpRequest httpReq = HostContext.AppHost.TryGetCurrentRequest(); 
```

Once you have access to the current `IRequest` you can save your typed session using the `SaveSessionAsync()` extension method:

```csharp
await httpReq.SaveSessionAsync(session);
```

This API is also available in MVC Controllers that inherit `ServiceStackController` or ASP.NET Pages that inherit `ServiceStackPage`:

```csharp
await base.SaveSessionAsync(session);
```

## Intercept Saving Sessions

Each time the Session is saved it's saved again with the default Session Expiry which can be specified on the top-level `AuthFeature.SessionExpiry` for temp Sessions or `AuthFeature.PermanentSessionExpiry` for permanent "Remember Me" Sessions.

For fine-grained control you can intercept each time a Session is saved and change what Session Expiry it's saved with by overriding `OnSaveSessionAsync` in your AppHost:

```csharp
public override Task OnSaveSessionAsync(
    IRequest httpReq, IAuthSession session, TimeSpan? expiresIn = null, CancellationToken token=default)
{
    var customExpiry = ...
    base.OnSaveSessionAsync(httpReq, session, customExpiry, token);
}
```

## Sliding Sessions

You can extend existing User Sessions in ServiceStack by just re-saving the Users Session.
This can be done anywhere in [ServiceStack's Request Pipeline](/order-of-operations), E.g.
in a [Request or Response Filter Attribute](/filter-attributes) or 
[Global Request or Response Filter](/request-and-response-filters):

E.g. here's a Sliding Sessions example using a custom `[SlideExpiration]` Response Filter Attribute:

```csharp
public class SlidingSessionAttribute : ResponseFilterAsyncAttribute
{
    public TimeSpan? Expiry { get; set; }

	public SlidingSessionAttribute(int expirySecs=0)
	{
		this.Expiry = expirySecs <= 0
            ? (TimeSpan?)null 
            : TimeSpan.FromSeconds(expirySecs);
	}

    public override async Task ExecuteAsync(IRequest req, IResponse res, object response)
    {
        var session = await req.GetSessionAsync();
        if (session != null) 
            await req.SaveSessionAsync(session, this.Expiry);
    }
}
```

Which can be applied to any protected User Services, e.g:

```csharp
[Authenticate]
[SlidingSession(10 * 60)] //= 10 minutes
public class UserServices : Service
{
    public object Any(MyUserRequest request) => ...;
}
```

Which just re-saves the Session in order to extend it with a new Session Expiry, this can 
instead be done in a Global Response Filter with:

```csharp
GlobalResponseFiltersAsync.Add(async (req, res, dto) => {
    var session = await req.GetSessionAsync();
    if (session != null)
        await req.SaveSessionAsync(session, TimeSpan.FromMinutes(10));
});
```

### Find the remaining time left before a Session expires

For [Cache Clients](/) that implement you can retrieve the 
`ICacheClientExtended.GetTimeToLive()` returns a `TimeSpan?` which will return:

 - `null` if no key exists
 - `TimeSpan.MaxValue` if there is no expiry set on the key
 - or a `TimeSpan` value with the time remaining before the key is set to expire

 So you can determine the remaining time on a Session by querying the **Time To Live** 
 remaining on the Session Key in the Cache which you could use to extend the Users Session
 by **10 minutes** if they have **less than 10 minutes** remaining:

```csharp
var sessionId = req.GetSessionId(); 
var sessionKey = SessionFeature.GetSessionKey(sessionId);
var ttl = req.GetCacheClient().GetTimeToLive(sessionKey);

if (ttl != null && ttl <= TimeSpan.FromMinutes(10)) 
{
    var session = await req.GetSessionAsync();
    await req.SaveSessionAsync(session, TimeSpan.FromMinutes(10));
}
```

## Typed Sessions in MVC

To make use of it in MVC, you effectively do the same thing, although this time you can simply inherit the existing [ServiceStackController](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Mvc/ServiceStackController.cs) which has the above templated code in a generic MVC Controller Template:

```csharp
public class ControllerBase : ServiceStackController<CustomUserSession> {}
```

From there it's just a basic property which you can use in your Controller or assign to your views [like this](https://github.com/ServiceStack/SocialBootstrapApi/blob/master/src/SocialBootstrapApi/Controllers/HomeController.cs#L12):

```csharp
public partial class HomeController : ControllerBase 
{
    public virtual ActionResult Index() 
    {
        ViewBag.Message = "MVC + ServiceStack PowerPack!";
        ViewBag.UserSession = base.UserSession;
        return View();
    }   
}
```

## Typed Sessions in ASP.NET Web Forms

It's the same thing in ASP.NET Web Forms although this comes in the form of a [base ASP.NET Web Page](https://github.com/ServiceStack/ServiceStack/blob/master/NuGet/ServiceStack.Host.AspNet/content/App_Start/PageBase.cs.pp) which you get for free when you install ServiceStack via the [ServiceStack.Host.AspNet](http://nuget.org/packages/ServiceStack.Host.AspNet) NuGet package.

## Using Dynamic / Untyped Sessions in Session Bag

You can access the dynamic UserSession Bag in ServiceStack services via the `base.SessionBag` property already built-in ServiceStack's [Service](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Service.cs) base class, e.g:

```csharp
await base.SessionBagAsync.SetAsync("cart", new Cart { ... });
var cart = await base.SessionBagAsync.GetAsync<Cart>("cart");
```

## Use HTTP Headers to Send Session Cookies

You can now make a Session-enabled request with HTTP Headers instead of Cookies. The Session HTTP Headers have a `X-` prefix before the Session Id, i.e: `X-ss-id`, `X-ss-pid` and `X-ss-opts`.

## Inspecting persisted User Sessions

ServiceStack Sessions are just serialized POCO's stored in the Registered `ICacheClient` at the following key:

```
urn:iauthsession:{SessionId}
```

Where `{SessionId}` is either the users `ss-id` or `ss-pid` cookie depending on whether the user was authenticated with `RememberMe=true` which instructs ServiceStack to save the session against the `ss-pid` permanent cookie - this preference is stored in the `ss-opt=perm` cookie.

Since they're just plain POCO's stored at a predictable key format, we can easily iterate through all user sessions by using the `ICacheClient` API's directly, e.g:

```csharp
var sessionPattern = IdUtils.CreateUrn<IAuthSession>(""); //= urn:iauthsession:
var sessionKeys = Cache.GetKeysStartingWith(sessionPattern).ToList();

var allSessions = Cache.GetAll<IAuthSession>(sessionKeys);
```

## Community Resources

  - [Sliding session expirations in ServiceStack](http://teadriven.me.uk/2013/02/14/sliding-sessions-in-service-stack/) by [@teadriven](https://twitter.com/teadriven)
  - [Accessing ASP.NET Session from ServiceStack](http://www.richardfawcett.net/2012/02/29/accessing-asp-net-session-from-servicestack/) by [@yeurch](https://twitter.com/yeurch)
  - [REST Web Services with ServiceStack](https://web.archive.org/web/20121124003901/http://openlandscape.net/2011/03/21/rest-web-services-with-servicestack) by Jacques du Preez
