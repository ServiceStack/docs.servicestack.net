---
slug: openid
title: OpenId 2.0 Auth Providers
---

::: warning DEPRECATED
Development of the **[DotNetOpenAuth](https://github.com/DotNetOpenAuth/DotNetOpenAuth)** this package relies on has been abandon and has consequently **ServiceStack.Authentication.OpenId** package has been removed in **v6**.

To continue using it you can copy the existing **[ServiceStack.Authentication.OpenId](https://github.com/ServiceStack/ServiceStack/tree/fx45/src/ServiceStack.Authentication.OpenId)** source code into your project
:::


Contained in the [ServiceStack.Authentication.OpenId](http://nuget.org/packages/ServiceStack.Authentication.OpenId) NuGet package is ServiceStack's support of OpenId 2.0 Authentication. This allows ServiceStack-enabled ASP.NET / MVC sites and web services to authenticate and accept registration from any OpenId 2.0 Authentication provider. Like most .NET OpenId libraries, we leverage the de-facto and excellent [DotNetOpenAuth](http://www.dotnetopenauth.net/) library to enable our OpenId and OAuth2 support. 

## Install via NuGet

:::copy
`<PackageReference Include="ServiceStack.Authentication.OpenId" Version="5.*" />`
:::

## Easy configuration, plugs into ServiceStack's Auth Provider model

As you might expect adding OpenId support works seamlessly with ServiceStack's existing [Auth Providers](/auth/authentication-and-authorization) where you can enable support for any Specific OpenId 2.0 provider with just **1-line of registration** each. Below is the example taken from [SocialBootstrapApi's AppHost](https://github.com/ServiceStack/SocialBootstrapApi/blob/master/src/SocialBootstrapApi/AppHost.cs#L171) showing how to extend their existing Auth Providers with new OpenId 2.0 options:

```csharp
var appSettings = new AppSettings(); //Access Web.Config AppSettings
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    //Add all the Auth Providers you want to allow registration with
    new IAuthProvider[] {
        //Existing Auth Providers
        new CredentialsAuthProvider(),              //HTML Form post of UserName/Password credentials
        new TwitterAuthProvider(appSettings),       //Sign-in with Twitter
        new FacebookAuthProvider(appSettings),      //Sign-in with Facebook
        new DigestAuthProvider(appSettings),        //Sign-in with Digest Auth
        new BasicAuthProvider(),                    //Sign-in with Basic Auth

        //Register new OpenId providers you want to allow authentication with
        new GoogleOpenIdOAuthProvider(appSettings), //Sign-in with Google OpenId
        new YahooOpenIdOAuthProvider(appSettings),  //Sign-in with Yahoo OpenId
        new OpenIdOAuthProvider(appSettings),       //Sign-in with any Custom OpenId Provider

        //Register new OAuth2 providers you want to allow authentication with
        new GoogleOAuth2Provider(appSettings),      //Sign-in with Google OAuth2        
        new LinkedInOAuth2Provider(appSettings),    //Sign-in with LinkedIn OAuth2        
    }));
```

[AuthWebTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/) is a simple project that shows all Auth Providers configured and working in the same app. See the [AppHost](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/AppHost.cs) for an example of the code and the [Web.config](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/Web.config) for an example of the configuration required to enable each Auth Provider.

### Creating a Custom OpenId Provider

Creating a custom OpenId provider is trivially done by just inheriting from `OpenIdOAuthProvider` and providing a unique Id and Auth Realm Url for the provider. This is the source code for [GoogleOpenIdOAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Authentication.OpenId/GoogleOpenIdOAuthProvider.cs):

```csharp
public class GoogleOpenIdOAuthProvider : OpenIdOAuthProvider {
    public const string Name = "GoogleOpenId";
    public static string Realm = "https://www.google.com/accounts/o8/id";

    public GoogleOpenIdOAuthProvider(IResourceManager appSettings)
        : base(appSettings, Name, Realm) { }
}
```

With just `GoogleOpenIdOAuthProvider` class and it's registration above we can now enable authentication for our websites by just adding a HTML Form to **POST** to the `/auth/{AuthProviderName}` AuthService, e.g:

```html
<form action="/api/auth/googleopenid" method="POST">
    <input type="image" src="/Content/img/sign-in-with-google.png" alt="Sign in with Google">
</form>
```

Any other custom OpenId provider can be added in the same way, here is the HTML Form for Yahoo OpenId:

```html
<form action="/api/auth/yahooopenid" method="POST">
    <input type="image" src="/Content/img/sign-in-with-yahoo.png" alt="Sign in with Yahoo!">
</form>
```

Finally you can allow registration of any other OpenId 2.0 provider at run-time by including their Url in the **OpenIdUrl** Form POST variable, e.g:

```html
<form action="/api/auth/openid" method="POST">
    <input type="text" name="OpenIdUrl" value="http://myopenid.com" />
    <input type="submit" class="btn" value="Sign In"/>
</form>
```

The above sample markup from the [Bootstrap Api project Index.cshtml](https://github.com/ServiceStack/SocialBootstrapApi/blob/master/src/SocialBootstrapApi/Views/Shared/Index.cshtml#L366) page, which when rendered looks like:

[![ServiceStack OpenId 2.0 Providers](https://raw.githubusercontent.com/ServiceStackV3/Mono/master/src/Mono/files/openid-form.png)](http://bootstrapapi.apphb.com)

For a live demo of ServiceStack's Auth Providers in action check out the MVC + ServiceStack enabled [Bootstrap API project](http://bootstrapapi.apphb.com).

### Automatically Merges Registration and Authentication information from multiple Auth Providers

One of the benefits of using [ServiceStack's Auth Providers](/auth/authentication-and-authorization) is that it allows a single user to login via multiple Auth Providers and it takes care of merging authentication and registration info from multiple Authentication sources into the same UserAuth Account. It also automatically maintains updates of users latest registration information on each login and their session is automatically populated with all of their previously authenticated providers, e.g. If a user logs in the 2nd time with Facebook, their session is also populated with their earlier Twitter account information.
