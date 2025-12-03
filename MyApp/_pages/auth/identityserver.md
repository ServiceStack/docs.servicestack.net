---
slug: authentication-identityserver
title: Using IdentityServer4 Auth in ServiceStack
---

:::warning DEPRECATED
This article refers to IdentityServer4 which is no longer actively maintained.
:::

[mvcidentityserver](https://github.com/LegacyTemplates/mvcidentityserver) .NET 6.0 MVC Website integrated with IdentityServer4 Auth and ServiceStack:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcidentityserver.png)](https://github.com/LegacyTemplates/mvcidentityserver)

The [mvcidentityserver](https://github.com/LegacyTemplates/mvcidentityserver) builds upon Identity Server's 
[OpenID Connect Hybrid Flow Authentication and API Access Tokens](https://github.com/IdentityServer/IdentityServer4.Samples/tree/master/Quickstarts/5_HybridFlowAuthenticationWithApiAccess)
Quickstart project to include integration with ServiceStack and additional OAuth providers.

The home page has also been customized to contain the same functionality as the other 2 templates with some additional features to validate against custom
OAuth App scopes and **Delegation Auth Pages** showing how to make Authenticated API requests to our remote microservices from within MVC Controllers.

In contrast to integrating Authentication into our App directly, [mvcidentityserver](https://github.com/LegacyTemplates/mvcidentityserver) configures a central 
**remote IdentityServer instance** with the Auth Features and OAuth providers we want available to our Apps. 

Then when non Authenticated users go to a protected resource they're redirected to the Sign In page on IdentityServer:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcidentityserver-is4.png)](https://github.com/LegacyTemplates/mvcidentityserver)

Users can sign in using the same Credentials or external OAuth Providers but are presented with an additional **consent** screen to grant the App permission to access their
User profile information and access to custom features the App needs:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvcidentityserver-is4-allow.png)](https://github.com/LegacyTemplates/mvcidentityserver)

Once granted the Auth information is captured in a stateless IdentityServer Token, stored in a cookie and redirected back to the App.

## Physical Project Structure

[mvcidentityserver](https://github.com/LegacyTemplates/mvcidentityserver) is pre-configured with **3 Host projects**:

 - [/IdentityServer](https://github.com/LegacyTemplates/mvcidentityserver/tree/master/IdentityServer) - The Central IdentityServer Auth Server (port **5000**)
 - [/ProjectName](https://github.com/LegacyTemplates/mvcidentityserver/tree/master/MyApp) - Our Hybrid MVC + ServiceStack App (port **5002**)
 - [/ProjectName.Api](https://github.com/LegacyTemplates/mvcidentityserver/tree/master/MyApp.Api) - Example Microservice API used by Hybrid App (port **5001**)

## IdentityServer

The IdentityServer instance is configured in [Startup.cs](https://github.com/LegacyTemplates/mvcidentityserver/blob/master/IdentityServer/Startup.cs) 
which contains all **external OAuth providers** we want to allow Sign Ins from, the **OpenId Connect Endpoint** which allows Sign Ins from another external 
IdentityServer on [demo.identityserver.io](https://demo.identityserver.io/) and all its pre-configured Users, Identity Resources, API Resources and Clients 
defined in [Config.cs](https://github.com/LegacyTemplates/mvcidentityserver/blob/master/IdentityServer/Config.cs).

## App

The App's [Startup.cs](https://github.com/LegacyTemplates/mvcidentityserver/blob/master/MyApp/Startup.cs) consists of configuring the OpenId Connect Endpoint
to our Central **IdentityServer** containing additional customizations to control what `Claims` the Authenticated `ClaimsPrincipal` will have:

```csharp
services.AddAuthentication(options =>
    {
        options.DefaultScheme = "Cookies";
        options.DefaultChallengeScheme = "oidc";
    })
    .AddCookie("Cookies")
    .AddOpenIdConnect("oidc", options =>
    {
        options.SignInScheme = "Cookies";

        options.Authority = "https://localhost:5000";
        options.RequireHttpsMetadata = false;

        options.ClientId = "mvc";
        options.ClientSecret = "secret";
        options.ResponseType = "code id_token";

        options.SaveTokens = true;
        options.GetClaimsFromUserInfoEndpoint = true;

        options.Scope.Add("api1");
        options.Scope.Add("offline_access");
        
        options.ClaimActions.MapJsonKey("website", "website");
        options.ClaimActions.MapJsonKey("role", "role");
        options.ClaimActions.Add(new AdminRolesClaimAction("Manager", "Employee"));
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = "role"
        };

        options.Events = new OpenIdConnectEvents {
            OnRemoteFailure = CustomHandlers.HandleCancelAction,
            OnTokenResponseReceived = CustomHandlers.CopyAllowedScopesToUserClaims,                        
        };
    });
```

## ASP.NET Core Identity Auth Adapter

The only customization needed in ServiceStack is to specify the different custom name being used for `RoleClaimType`:

```csharp
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    new IAuthProvider[] {
        // Adapter to enable ASP.NET Core Identity Auth in ServiceStack
        new NetCoreIdentityAuthProvider(AppSettings) {
            RoleClaimType = "role"
        }, 
    }));
```

The `MapJsonKey` contains a whitelist of properties in Identity Server's Token we want propagated to `Claims`. 
The `AdminRolesClaimAction` is a custom `ClaimAction` we can use to add additional `AdminRoles` to users with the `RoleNames.Admin` role:

```csharp
/// <summary>
/// Use this class to assign additional roles to Admin Users
/// </summary>
public class AdminRolesClaimAction : ClaimAction
{
    string[] AdminRoles { get; }
    public AdminRolesClaimAction(params string[] adminRoles) : base("role", null) => AdminRoles = adminRoles;

    public override void Run(JObject userData, ClaimsIdentity identity, string issuer)
    {
        if (!HasAdminRole(userData)) return;
        foreach (var role in AdminRoles)
        {
            identity.AddClaim(new Claim("role", role));
        }
    }

    private bool HasAdminRole(JObject userData)
    {
        var jtoken = userData?[this.ClaimType];
        if (jtoken is JValue)
        {
            if (jtoken?.ToString() == RoleNames.Admin)
                return true;
        }
        else if (jtoken is JArray)
        {
            foreach (var obj in jtoken)
                if (obj?.ToString() == RoleNames.Admin)
                    return true;
        }
        return false;
    }
}
```

The `OpenIdConnectEvents` lets us intercept the original IdentityServer token so we can extract the custom **OAuth scopes** the User 
has granted the App and add them to `scope` Claims:

```csharp
public static class CustomHandlers
{
    /// <summary>
    /// Use this handler to copy requested Scopes to User Claims so they can be validated using a Policy  
    /// </summary>
    public static Task CopyAllowedScopesToUserClaims(TokenResponseReceivedContext context)
    {
        var scopes = context.ProtocolMessage.Scope?.Split(' ');
        if (scopes != null && context.Principal.Identity is ClaimsIdentity identity)
        {
            foreach (var scope in scopes)
            {
                identity.AddClaim(new Claim("scope", scope));
            }
        }
        return Task.CompletedTask;
    }

    public static Task HandleCancelAction(RemoteFailureContext context)
    {
        context.Response.Redirect("/");
        context.HandleResponse();
        return Task.CompletedTask;
    }
}
```

Now that our populated claims contains the granted OAuth scopes we can validate against it in ServiceStack Services using the new `[RequiredClaim]` attribute:

```csharp
[RequiredClaim("scope", "profile")]
public object Any(RequiresScope request)
{
    return new RequiresScopeResponse { Result = $"Hello, {request.Name}!" };
}
```

In MVC we need create a custom Auth Policy:

```csharp
services.AddAuthorization(options => {
    options.AddPolicy("ProfileScope", policy =>
        policy.RequireClaim("scope", "profile"));
});
```

That can then be used in our MVC Controllers using the `[Authorize]` attribute, referencing our custom policy: 

```csharp
[Authorize(Policy = "ProfileScope")]
public async Task<IActionResult> RequiresScope()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    return View();
}
```

### Delegated Auth Pages

[mvcidentityserver](https://github.com/LegacyTemplates/mvcidentityserver) also contains examples showing how to make
Authenticated API Requests to a remote Web API Service using `HttpClient`:

```csharp
public async Task<IActionResult> CallWebApi()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    var content = await client.GetStringAsync("https://localhost:5001/webapi-identity");

    ViewBag.Json = JArray.Parse(content).ToString();
    return View("json");
}
```

The same `HttpClient` request to call an Authenticated ServiceStack Service:

```csharp
public async Task<IActionResult> CallServiceStack()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MimeTypes.Json)); 
    var json = await client.GetStringAsync("https://localhost:5001/servicestack-identity");

    ViewBag.Json = json.IndentJson();
    return View("json");
}
```

We need the additional `Accept` JSON HTTP header to tell ServiceStack which of the registered Content Types 
we want to receive the response in.

Alternatively we can make Authenticated Requests using the more typed and terse [C#/.NET Service Client](/csharp-client):

```csharp
public async Task<IActionResult> CallServiceClient()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    var client = new JsonApiClient("https://localhost:5001/") {
        BearerToken = accessToken
    };
    var response = await client.GetAsync(new GetIdentity());

    ViewBag.Json = response.ToJson().IndentJson();
    return View("json");
}
```

## API

The API's [Startup.cs](https://github.com/LegacyTemplates/mvcidentityserver/blob/master/MyApp.Api/Startup.cs) is configured to accept 
Bearer Tokens issued by our central **IdentityServer**:

```csharp
services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options => {
        options.Authority = "https://localhost:5000";
        options.RequireHttpsMetadata = false;

        options.Audience = "api1";
    });
```

Nothing special is needed for ServiceStack here other than registering the Identity Auth Provider adapter:

```csharp
Plugins.Add(new AuthFeature(() => new AuthUserSession(), 
    new IAuthProvider[] {
        new NetCoreIdentityAuthProvider(AppSettings), 
    }));
```

The `GetIdentity` ServiceStack Service then returns the populated `AuthUserSession` and all claims contained in the Bearer Token:

```csharp
[Route("/servicestack-identity")]
public class GetIdentity : IReturn<GetIdentityResponse> { }

public class GetIdentityResponse
{
    public List<Property> Claims { get; set; }
    public AuthUserSession Session { get; set; }
}

[Authenticate]
public class IdentityService : Service
{
    public object Any(GetIdentity request)
    {
        return new GetIdentityResponse {
            Claims = Request.GetClaims().Map(x => new Property { Name = x.Type, Value = x.Value }),
            Session = SessionAs<AuthUserSession>(),
        };
    }
}
```
