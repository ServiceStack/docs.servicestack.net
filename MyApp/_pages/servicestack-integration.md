---
slug: servicestack-integration
title: ServiceStack Integration
---

This article explains how to make use of ServiceStack components in existing **ASP.NET MVC** and **WebForms** Web Applications. The base `ServiceStackController` and WebForms `ServiceStackPage` both share a common code-base  to provide easy access to the same clean, high-performance components found in ServiceStack's `Service` base class, directly from within your MVC Controllers and WebForm pages.

This is an outline of the API's found in MVC's `ServiceStackController` and WebForms `ServiceStackPage`:

```csharp
public class ServiceStackController : Controller
{
    //...
    IServiceStackProvider ServiceStackProvider { get; set; }
    IAppSettings AppSettings { get; set; }
    IHttpRequest ServiceStackRequest { get; set; }
    IHttpResponse ServiceStackResponse { get; set; }
    ICacheClient Cache { get; set; }
    IDbConnection Db { get; set; }
    IRedisClient Redis { get; set; }
    IMessageFactory MessageFactory { get; set; }
    IMessageProducer MessageProducer { get; set; }
    ISessionFactory SessionFactory { get; set; }
    ISession SessionBag { get; set; }
    bool IsAuthenticated { get; set; }

    T TryResolve<T>();
    T ResolveService<T>();
    object Execute(object requestDto);
    object ForwardRequestToServiceStack(IRequest request=null);
    IAuthSession GetSession(bool reload = true);
    TUserSession SessionAs<TUserSession>();
    void ClearSession();
    void PublishMessage<T>(T message);
}
```

## Use ServiceStack Authentication

One benefit of integration with ServiceStack is to be able to make use of ServiceStack's simple and flexible [Authentication Providers](/auth/authentication-and-authorization) which require minimal configuration and supports a number of different [Session Providers](/caching) and persistent [Data Store back-ends](/auth/authentication-and-authorization#userauth-persistence---the-iuserauthrepository) to make it easy to integrate with an existing environment.

### MVC and WebForms Examples

To illustrate the seamless integration with ServiceStack, we've created 2 new authentication-enabled example websites:

 - **ASP.NET MVC** Live Demo: [mvc.servicestack.net](http://mvc.servicestack.net/) and [source code](https://github.com/ServiceStack/Test/tree/master/src/Mvc)
 - **ASP.NET WebForms** Live Demo: [webforms.servicestack.net](http://webforms.servicestack.net/) and [source code](https://github.com/ServiceStack/Test/tree/master/src/WebForms)

![MVC with ServiceStack Authentication](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/mvc-integration.png)

### Integrating with ServiceStack from MVC or WebForms

We'll go through the MVC example to showcase the different ways you can integrate with ServiceStack from an external Web Framework. 

#### Using ResolveService to call Services directly

The `Login` Action is a standard MVC Action handling HTML Form input accepting 3 parameters, a `userName`, `password` as well as a relative `redirect` url to redirect to when authentication is successful. Login uses the `ResolveService<TService>` API which just resolves an auto-wired instance of the ServiceStack `AuthenticateService` from the IOC and injects the current HTTP Request context, which we then use to call a method on the Service directly:

```csharp
public ActionResult Login(string userName, string password, string redirect=null)
{
    if (ModelState.IsValid)
    {
        try
        {
            using (var authService = ResolveService<AuthenticateService>())
            {
                var response = authService.Authenticate(new Authenticate {
                    provider = CredentialsAuthProvider.Name,
                    UserName = userName,
                    Password = password,
                    RememberMe = true,
                });

                // add ASP.NET auth cookie
                FormsAuthentication.SetAuthCookie(userName, true);

                return Redirect(string.IsNullOrEmpty(redirect) ? "/" : redirect);
            }
        }
        catch (Exception ex)
        {
            ModelState.AddModelError(string.Empty, ex.Message);
        }
    }

    return View("Index", GetViewModel());
}
```

::: info
Since the above example calls the Service method directly any exceptions raised by the Service implementation are thrown and caught as normal
:::

#### Using Execute to process Request DTO's

The `Logout()` MVC Action uses ServiceStack's `Execute()` API which can call the desired ServiceStack Service with just a populated Request DTO:

```csharp
public ActionResult Logout()
{
    Execute(new Authenticate { provider = "logout" });
    FormsAuthentication.SignOut(); 

    return Redirect("/");
}
```

#### Using ForwardRequestToServiceStack to proxy HTTP Requests

The `ForwardingController` handles OAuth callbacks that have been configured to callback to `/auth/*` route which is handled by MVC as ServiceStack is mounted at and only configured to handle `/api` requests. 

Instead of creating new OAuth Applications with each provider to use the new `/api/auth/*` callback url so ServiceStack can handle the OAuth callback, we can use just use the new `ForwardRequestToServiceStack()` which just forwards the incoming HTTP Request from MVC to ServiceStack to process, effectively acting as a proxy:

```csharp
routes.MapRoute("Forwarding", "auth/{*pathinfo}", 
    new { controller = "Forwarding", action = "Index" });
...

public class ForwardingController : ServiceStackController
{
    public ActionResult Index()
    {
        var response = ForwardRequestToServiceStack();
        if (ServiceStackResponse.IsClosed) return new EmptyResult();

        string redirectUrl;
        var httpResult = response as IHttpResult;
        if (httpResult != null && httpResult.Headers.TryGetValue(HttpHeaders.Location, out redirectUrl))
            return Redirect(redirectUrl);

        return Redirect("/");
    }
}
```

The `Execute()` and `ForwardRequestToServiceStack()` are high-level API's that call into ServiceStack's internal Request pipeline, executing any Action Filters and also converts any exceptions into a populated serializable Response DTO with a populated `ResponseStatus` as would be returned to Service Clients.

### Authentication Attributes

Since we're using ServiceStack for Authentication, we're also able to re-use ServiceStack's Authentication Attribute Filters directly on MVC Controllers and WebForm Pages just as if they were ServiceStack Services, e.g:

```csharp
[Authenticate]
public class AuthOnlyController : ServiceStackController 
{
    public ActionResult Index()
    {
        return View(SessionAs<CustomUserSession>());
    }         
}
```

The above controller hanldes the [mvc.servicestack.net/AuthOnly](http://mvc.servicestack.net/AuthOnly) route which only allows access to Authorized users. If a user is not authenticated they're automatically redirected to [/?redirect=/AuthOnly#f=Unauthorized](http://mvc.servicestack.net/?redirect=%2fAuthOnly#f=Unauthorized) to prompt the user to login, after successfully logging in it will redirect back to the original `/AuthOnly` url.

### Required Role or Permission

The `[RequiredRole]` and `[RequiredPermission]` attributes work similar to the `[Authentication]` attribute except they also assert that the user is a member of the specified role:

```csharp
[RequiredRole("TheRole")]
public class RequiresRoleController : ServiceStackController 
{
    public ActionResult Index()
    {
        return View(SessionAs<CustomUserSession>());
    }
}
```

The above Controller handles the [/RequiresRole](http://mvc.servicestack.net/RequiresRole) Route and will only grant access if the Authenticated User is also a member of the **TheRole**.

### Calling ServiceStack Services Directly

The simplest way to consume ServiceStack Services requiring the least effort and moving parts is to call them directly: 

#### Using ServiceStack OAuth in MVC

Integrating with ServiceStack's OAuth providers requires the least effort as they're linkable directly in the format `/api/auth/{provider}` which is handled by ServiceStack's OAuth Service who initiates the Authentication process by redirecting to the selected OAuth provider:

![MVC OAuth with HTML](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/mvc-auth.png)

#### Calling ServiceStack with Ajax in MVC

Posting HTML Forms directly to ServiceStack Services isn't that much more effort, Start with a plain HTML Form with field names that match with the Services property names:

![MVC Register with HTML](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/mvc-register.png)

We can then use ServiceStack's built-in [ss-utils.js JavaScript Libraray](/ss-utils-js) to take care of Ajaxifying, auto-binding and submitting the form via Ajax. It also has built-in support for [Bootstrap Forms Field Validation conventions](/ss-utils-js#bootstrap-forms) to automatically bind errors to the appropriate fields. The only custom code required is to bind the form is then:

```javascript
$("#form-register").bindForm({
    success: function (r) { location.href = '/'; }
});
```

In this case we've added a success callback to redirect to the home page if the registration was successful which will either be authenticated with the newly registered user if **Auto Login** was checked, otherwise you can use the login form to Sign in as the newly registered user.
