---
title: v3 Release Notes
---

**v3.9.62** marks the point where v3 goes into feature-freeze to make room for the future v4 commercial version of ServiceStack. In order to reduce efforts of maintaining 2 separate code-bases, we've automated as much of the development and deploying workflow as possible. Building on the efforts of ServiceStack's CI build master [@desunit](https://twitter.com/desunit), v3.9.62 is the first release of ServiceStack to be fully automated and deployed with [Team City](http://www.jetbrains.com/teamcity/). 

#### Source Symbols are now included in all NuGet packages

This makes it now possible to debug into the ServiceStack source code when using the ServiceStack NuGet packages. You can enable this after [enabling SymbolSource integration in VisualStudio](http://www.symbolsource.org/Public/Home/VisualStudio):

  1. Go to `Tools -> Options -> Debugger -> General`
  2. Uncheck **Enable Just My Code**, **Enable .NET Framework source stepping** and **Require source files to exactly match the original version**
  3. Check **Enable source server support**
  4. In the `Tools -> Options -> Debugger -> Symbols` dialog, under the **Symbol file (.pdb) locations** section by clicking the New Folder icon and add the following urls (in order):
    - http://referencesource.microsoft.com/symbols
    - http://srv.symbolsource.org/pdb/Public
    - http://srv.symbolsource.org/pdb/MyGet
    - http://msdl.microsoft.com/download/symbols

And with that you should now be able to debug into the source code of any NuGet package (who publishes their Symbols) directly from within your application!

### Silverlight 5 builds now included

Historically the wider ServiceStack community have been maintaining custom builds for ServiceStack client libraries, with most recently [@ddotlic](https://github.com/ddotlic) taking charge to ensure Silverlight developers had up-to-date Silverlight client library builds. Now as part of the new automated builds, Silverlight 5 becomes a first class citizen and is included as part of the build system.

### New OAuth2 and OrmLite T4 NuGet packages

This release saw the introduction of new **ServiceStack.Authentication.OAuth2** support contributed by [@RobertTheGrey](https://twitter.com/RobertTheGrey) as well as [@gkathire](https://github.com/gkathire)'s' **ServiceStack.OrmLite.T4** templates (more details below).

### Copy of the latest NuGet releases are now also published to MyGet

[MyGet](https://www.myget.org) is an alternative NuGet server that provides better management and control of NuGet packages than the default nuget.org, which is useful for testing as well as if you just want to have a list of just ServiceStack NuGet packages without having to search through the entire NuGet global catalog. You can register ServiceStack's [MyGet feed in Visual Studio](http://docs.myget.org/docs/how-to/register-myget-feeds-in-visual-studio) with:

  1. Go to `Tools -> Options -> Package Manager -> Package Sources`
  2. Add the Source **https://www.myget.org/F/servicestack** with the name of your choice, e.g. `ServiceStack MyGet feed`

### New v3 and v3-fixes branches

Now that v3 is in feature-freeze, if you need to add a fix to the existing v3 release of ServiceStack it will need to added it to the `v3-fixes` branch (i.e. instead of master) which is a placeholder for merging future fixes into both master (v4) and v3 release branches. Future commits to any ServiceStack project will also need to agree to the [Contributor License Agreement](https://docs.google.com/forms/d/16Op0fmKaqYtxGL4sg7w_g-cXXyCoWjzppgkuqzOeKyk/viewform).

Join the [ServiceStack Community](https://servicestack.net/discuss) if you want to keep track of the progress of ServiceStack v4 or be notified of any announcements from the ServiceStack community.

### Unified build system across all projects

We've simplified the build system which now has consistent naming, behavior and structure across all ServiceStack library projects, located under the top-level `/build` directory. All projects now share the same version number (e.g. v3.9.62) and are now all built and deployed together (harder to ensure under the old manual system).

## Authentication

ServiceStack now supports Google and LinkedIn OAuth2 providers thanks to [@RobertTheGrey](https://twitter.com/RobertTheGrey) which you can add to your project with:

:::copy
`<PackageReference Include="ServiceStack.Authentication.OAuth2" Version="5.*" />`
:::

The OAuth2 providers is pre-configured with sensible defaults to cater for the most common use-cases which as is the case with all Auth providers are overridable in AppHost or Web.Config. The [AuthWeb Tests](https://github.com/ServiceStack/ServiceStack/tree/master/tests/ServiceStack.AuthWeb.Tests) project shows the simplest [AppHost code](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/AppHost.cs#L75) and [Web.config](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.AuthWeb.Tests/Web.config#L20) configuration required to register all Auth Providers within the same service, e.g. the minimum configuration to get started with new LinkedIn and Google OAuth2 providers is:

```xml
<!-- Create Google App at: https://code.google.com/apis/console/ -->
<add key="oauth.GoogleOAuth.ConsumerKey" value="731622862518.apps.googleusercontent.com"/>
<add key="oauth.GoogleOAuth.ConsumerSecret" value="BvumMTV9VEyHj_2uMfDXHaaP"/>

<!-- Create LinkedIn App at: https://www.linkedin.com/secure/developer?newapp= -->
<add key="oauth.LinkedIn.ConsumerKey" value="ck8n5g2fxd6o"/>
<add key="oauth.LinkedIn.ConsumerSecret" value="Mpy9Pl4uTnRrSee8"/>
```

### Cascading configuration

ServiceStack Auth providers also support *cascading configuration* for all built-in properties, where if a property for a specific auth provider doesn't exist, it will look for the *global fallback* property without the Auth Provider name. This is useful for DRY'ing repetitive configuration that's the same for all Auth providers like the **RedirectionUrl** and **CallbackUrl** properties, E.g. instead of repeating the same information for every Auth Provider like:

```xml
<add key="oauth.twitter.RedirectUrl"    value="http://yourhostname.com/"/>
<add key="oauth.twitter.CallbackUrl"    value="http://yourhostname.com/auth/twitter"/>    

<add key="oauth.facebook.RedirectUrl"    value="http://yourhostname.com/"/>
<add key="oauth.facebook.CallbackUrl"    value="http://yourhostname.com/auth/facebook"/>
```

You can instead just provide *global properties* that are used as a fallback in all Auth providers, e.g:

```xml
<add key="oauth.RedirectUrl"    value="http://yourhostname.com/"/>
<add key="oauth.CallbackUrl"    value="http://yourhostname.com/auth/{0}"/>
```

The `{0}` is always substituted with the Provider name (e.g. 'twitter').

More details about the OAuth2 providers can be found in [OAuth2 Section](/auth/authentication-and-authorization#oauth2-providers) of the Authentication wiki page. 

[@hhandoko](https://github.com/hhandoko) has also added the YammerAuthProvider baked into ServiceStack.

### Global Admin AuthSecret

ServiceStack now includes an opt-in `Config.AdminAuthSecret` global pass-key that lets you access protected services by instead supplying a '?authsecret=xxx' Request parameter. Which can be useful when you want to create Admin users, access internal debug services, or when testing the functionality of authenticated services without wanting to have to authenticate first.

## Routing

Routes now support multiple wildcard paths thanks to [@kal](https://github.com/kal). Wildcard paths work similar, but have a lower weighting than normal `{variable}` path matches, e.g:

The following HTTP Request:

    GET /content/v1/literal/slug

Will match all of the following Route definitions, in order from highest to lowest precedence:

```csharp
[Route("/content/v1/literal/slug", "GET")]
[Route("/content/v1/literal/slug")]
[Route("/content/v1/literal/{ignore}", "GET")]
[Route("/content/{ignore}/literal/{ignore}", "GET")]
[Route("/content/{Version*}/literal/{Slug*}", "GET")]
[Route("/content/{Version*}/literal/{Slug*}")]
[Route("/content/{Slug*}", "GET")]
[Route("/content/{Slug*}")]
```

See the [RestPathTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.ServiceHost.Tests/RestPathTests.cs) for more examples.

#### Matching on ignored paths

You can use the `{ignore}` variable placeholder to match a Route definition that doesn't map to a Request DTO property, e.g:

```csharp
[Route("/contacts/{Id}/{ignore}", "GET")]
public class GetContacts { ... }
```

Will match on `/contacts/1/john-doe` request without requiring your Request DTO to have an **ignore** property.

#### Fallback Route

Use the `FallbackRoute` attribute to specify a fallback route starting from the root path, e.g:

```csharp
[FallbackRoute("/{Path}")]
public class Fallback
{
    public string Path { get; set; }
}
```

This will match any unmatched route from the root path (e.g. `/foo` but not `/foo/bar`) that's not handled by any registered **CatchAll Handlers** or matches a static file. You can also specify a wildcard path e.g. `[FallbackRoute("/{Path*}")]` which will handle every unmatched route (inc. `/foo/bar`).

The Fallback route is useful for HTML5 Single Page App websites handling of unknown server requests with client-side routing as seen with HTML5 apps making use of pushState pretty urls.

## Metadata

The built-in metadata HTML templates that are used to render the `/metadata` pages are now external file resources that are overridable with `Config.UseCustomMetadataTemplates` and `Config.MetadataCustomPath` to specify the directory where the custom **IndexOperations.html**, **IndexOperations.html** and **IndexOperations.html** templates can be found.

Most of the metadata ServiceStack knows about your services are accessible from `Config.Metadata` from within ServiceStack and externally via the `/operations/metadata` route. A link to the **Operations Metadata** page is displayed at the bottom of the `/metadata` when in ServiceStack is in **DebugMode**.

## OrmLite T4 Templates

Whilst OrmLite is foremost a code-first POCO ORM, when you have to work with an existing database, the OrmLite T4 templates by [@gkathire](https://github.com/gkathire) makes it easy to get started quickly by creating code-generated POCO's for all your DB tables as well as strong-typed wrappers for existing stored procedures. These OrmLite T4 Content templates are now available to any project via NuGet:

:::copy
`<PackageReference Include="ServiceStack.OrmLite.T4" Version="5.*" />`
:::

[@jokecamp](https://twitter.com/jokecamp) has a nice writeup showing how to use [OrmLite's T4 templates in action](http://jokecamp.wordpress.com/2013/09/07/code-generation-using-servicestack-ormlite-and-t4-text-templates/).

## Redis and MQ Server

[RedisMqServer](/redis-mq) has a `PublishResponseWhitelist` to control if all (default) or only a whitelist of service responses should be published into Response INQ's as well as a `PriorityQueuesWhitelist` to control which messages require a Priority Queue enabled for them. 

### RedisClient Failover

**FailoverTo()** has been added to all RedisClientManagers which lets you trigger a runtime failover to specified redis-server instances.  This also triggers the registered callbacks on `OnFailover`, which is what RedisMqServer listens to in order to switch the background MQ services over to the new fallback redis-server instances.

Added a `NamespacePrefix` property to RedisAuthRepository which works similar to the NamespacePrefix property in the RedisClient where it allows you to organize internal data collections under a custom user-specified prefix, e.g. `mycompany:`.

## Community Resources

There's also been a number of quality community posts that have been added in the last couple of months:

  - [TiledStack - Tiled map rendering, messaging and support project for MonoGame](http://layoric.blogspot.com/2013/09/tiledstack-tiled-map-rendering.html) by [@layoric](https://twitter.com/layoric)
  - [Using OpenAccess ORM and ServiceStack](http://blogs.telerik.com/openaccessteam/posts/13-09-13/using-telerik-openaccess-orm-with-servicestack) by [@damyanbogoev](https://twitter.com/damyanbogoev)
  - [Code Generation using ServiceStack.OrmLite and T4 Text templates](http://jokecamp.wordpress.com/2013/09/07/code-generation-using-servicestack-ormlite-and-t4-text-templates/) by [@jokecamp](https://twitter.com/jokecamp)
  - [Building a ServiceStack OAuth2 resource server using DotNetOpenAuth](http://dylanbeattie.blogspot.com/2013/08/building-servicestack-based-oauth2.html) by [@dylanbeattie](https://twitter.com/dylanbeattie)
  - [ServiceStack extensibility using MEF](http://bhameyie.com/2013/09/03/servicestack-extensibility-using-mef/) by [@bhameyie](https://twitter.com/bhameyie)
  - [Productivity gains with the ServiceStack web framework](http://alexvpop.blogspot.co.uk/2013/08/whyservicestack.html) by Alexandru Vasile Pop
  - [How I Stopped Worrying and Learned to Love the WWW and UNIX Way](http://abdullin.com/journal/2013/8/27/how-i-stopped-worrying-and-learned-to-love-the-www-and-unix.html) by [@abdullin](https://twitter.com/abdullin)
  - [ServiceStack: IoC with Microsoft Unity](http://www.agile-code.com/blog/servicestack-ioc-with-microsoft-unity/) by [@zoranmax](https://twitter.com/zoranmax)
  - [Building Cross-Platform Web Services with ServiceStack](http://msdn.microsoft.com/en-us/magazine/dn342871.aspx)
  - [WCF vs WebAPI vs ServiceStack](http://mentalflatlining.wordpress.com/2013/02/19/evaluating-data-services-options-wcf-vs-webapi-vs-servicestack/) 
  - [Setting up a ServiceStack Service on nginx and deploy to Azure](http://www.philliphaydon.com/2013/07/setting-up-a-servicestack-service/) by [@philliphaydon](https://twitter.com/philliphaydon)
  - [Last-Fi (F#, Raspberry Pi, Last.Fm, FunScript and ServiceStack)](http://pinksquirrellabs.com/post/2013/07/04/Last-Fi.aspx) by [@pezi_pink](https://twitter.com/pezi_pink)

More quality community content to be found in the [Community Resources](/community-resources) wiki.

## Download ServiceStack

  * **[Using Nuget to add ServiceStack with Razor Support (.NET 4.0+)](http://nuget.org/packages/ServiceStack.Razor)**
  * [Using Nuget to add ServiceStack to an existing ASP.NET or MVC application (.NET 3.5+)](http://nuget.org/packages/ServiceStack)
  * [Clone ServiceStack.Examples projects and Starter Templates](https://github.com/ServiceStack/ServiceStack.Examples/)
  * [Clone ServiceStack.UseCases](https://github.com/ServiceStack/ServiceStack.UseCases/)
  * [Other ServiceStack projects available on NuGet](http://www.servicestack.net/docs/framework/nuget)

.

Follow [@ServiceStack](http://twitter.com/ServiceStack) or join the [ServiceStack G+ Community](https://servicestack.net/discuss) for project updates.

*****

.

## v3.9.45 Release Notes

## Support for Razor2

The biggest update in this release is the new completely re-written Razor support to support Razor2. The new implementation was originally contributed by [@bchavez](https://github.com/bchavez) and has resulted in a cleaner and simpler code-base which should give us a good base for future Razor customizations, e.g this upgrade allowed us to properly support **@model** and **@layout** directives.

Parallel compilation has been replaced in favor of a **FileSystemWatcher** which should improve the iterative development experience as updated razor files are now automatically compiled in the background (in DebugMode) as soon as you save the file, e.g. with `Ctrl+S`.

The one existing advanced feature no longer supported is multiple razor file extensions with different base types, as this was a fairly niche feature it hopefully wont affect many people. 

All existing tests have been ported and are now passing, we've also added a few more as well as updating [Razor Rockstars](https://razor.netcore.io/) which continues to work flawlessly with the new Razor2 support, but as this was a complete rewrite you may run into implementation differences between the old and new behavior so you should put some time aside for testing the upgraded Razor support. Please [report any issues](https://github.com/ServiceStack/ServiceStack/issues) you've had with the upgrade.

The HTML Helpers that were originally ported from MVC have been updated by [@dsimunic](https://github.com/dsimunic).

## Partial Content Support

Partial Content Support allows a resource to be split up an accessed in multiple chunks for clients that support HTTP Range Requests. This is a popular feature in download managers for resuming downloads of large files and streaming services for real-time streaming of content (e.g. consumed whilst it's being watched or listened to).

[HTTP Partial Content Support](http://benramsey.com/blog/2008/05/206-partial-content-and-range-requests/) was contributed by [@danbarua](https://github.com/danbarua) and added in true ServiceStack-style where it's now automatically and transparently enabled for any existing services returning:

#### A Physical File

```csharp
return new HttpResult(new FileInfo(filePath), request.MimeType); 
```

#### A Memory Stream

```csharp
return new HttpResult(ms, "audio/mpeg");
```

#### Raw Text

```csharp
return new HttpResult(customText, "text/plain");
```

Partial Content was also added to static file downloads served directly through ServiceStack which lets you stream mp3 downloads or should you ever want to your static .html, .css, .js, etc.

You can disable Partial Content support with `Config.AllowPartialResponses = false;`.

See the [PartialContentResultTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/PartialContentResultTests.cs) for more examples.


## Auto Route Generation Strategies

For a long time ServiceStack has provided a way to automatically generate routes based on convention with a 1-liner:

```csharp
Routes.AddFromAssembly(typeof(TypeWhereMyServicesAre).Assembly);
```

Which is just an [Extension method](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/ServiceRoutesExtensions.cs#L26) over [IServiceRoutes](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ServiceHost/IServiceRoutes.cs). Previously the default conventions were a black-box which registered routes based on the Request DTO Name, whether it had an **Id** property and what actions were implemented. If you wanted different conventions the solution was to take a copy of the implementation and tweak it to suit your needs. 

As we want to keep the single line of intent above, we've made the conventions configurable where you can now adjust/remove the existing rules or add your own to the **pre-defined** rules in `Config.RouteNamingConventions`:

```csharp
RouteNamingConventions = new List<RouteNamingConventionDelegate> {
    RouteNamingConvention.WithRequestDtoName,
    RouteNamingConvention.WithMatchingAttributes,     // defaults: PrimaryKeyAttrubute
    RouteNamingConvention.WithMatchingPropertyNames,  // defaults: Id, IDs
}
```

The existing rules can be further customized by modifying the related static properties, e.g:

```csharp
RouteNamingConvention.PropertyNamesToMatch.Add("UniqueId");
RouteNamingConvention.AttributeNamesToMatch.Add("DefaultIdAttribute");
```

Which will make these request DTOs:

```csharp
class MyRequest1
{
    public UniqueId { get; set;}
}

class MyRequest2
{
    [DefaultId]
    public CustomId { get; set;}
}
```

Generate the following routes:

    /myrequest1
    /myrequest1/{UniqueId}
    /myrequest2
    /myrequest2/{CustomId}

See the implementation of [RouteNamingConvention](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServiceHost/RouteNamingConvention.cs) for examples of how to add your own auto-generated route conventions.

The customizable Route inference strategies was originally contributed by [@julrichkieffer](https://github.com/julrichkieffer).

## Validation

### Route Validation

Enforcing the convention of having all routes prefixed with `/`. It supported both earlier but as multiple client/server tools can read the metadata we want to enforce consistent definitions that can be relied on. 
You can skip validation with `EndpointHostConfig.SkipRouteValidation = true;`.

### Validation Feature

Added ErrorResponseFilter on the ValidationFeature that can be used to [override the default handling of validation errors](http://stackoverflow.com/a/16065721/85785) with your own implementation.

## Swagger API

ServiceStack's [Swagger API documentation](/swagger-api) support has undergone a lot more development with new features and polish thanks largely to the efforts of [@improvedk](https://github.com/improvedk), [@mmertsock](https://github.com/mmertsock) and [@joshearl](https://github.com/joshearl):

The SwaggerFeature plugin has a couple more config options which changes what the generated metadata look like:

```csharp
Plugins.Add(new SwaggerFeature { 
    UseCamelCaseModelPropertyNames = true,
    UseLowercaseUnderscoreModelPropertyNames = true,
})

Config.UseHttpsLinks = true;     //will ensure all urls exposed in Swagger start with `https://`
```

A couple new metadata attributes have been added to further document your services:

The [ApiResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ServiceHost/ApiResponse.cs) attribute allows you specify the different error response statuses your services return.

The [ApiAllowableValuesAttribute](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Api.Swagger/ApiAllowableValuesAttribute.cs) attribute allows you to specify an allowable min/max range, list of named values, an Enum of named values or a custom factory returning a calculated list of names.

Example of using the new attributes together on the same Request DTO:

```csharp
[Route("/fruits")]
[Api("Find fruity goodness we stock")]
[ApiResponse(HttpResponse.BadRequest, "We only have fruits, not what you asked for")]
[ApiResponse(HttpResponse.InternalServerError, "Our fruit supplier is closed for business")]
public class FindFruits : IReturn<List<Fruit>>
{
    [ApiAllowableValues("family", typeof(FruitFamily))] //Enum
    public string Family { get; set; }
}
```

## Text Serialization

The JSON, JSV and CSV Text Serializers support serializing public fields with:

    JsConfig.Init(new Config { IncludePublicFields = true });

### Scoped static configuration

You can use block-scoped configuration to modify the configuration for a single thread within a using block, e.g:

```csharp
//Any config changes only apply to this using scope
using (JsConfig.With(new Config { IncludePublicFields = true }))
{
    new FieldId(1).ToUrl("GET"); -> /route/1
}
```

## Miscellaneous 

  - Added IAuthSession.OnCreated(httpReq) custom event (similar to Session_Started)    
  - Added Config.AllowNonHttpOnlyCookies to disable http-only cookies
  - Added `AppHost.GetPlugin<IPlugin>()` to find and return registered plugin
  - Added ToMd5Hash extension method on Stream or byte[]
  - Added AssertDir extension method creating a directory if it doesn't exist
  - Added .svg to static files whitelist
  - Silverlight client builds were updated by [@ddotlic](https://github.com/ddotlic)
.

# v3.9.35 Release Notes

This was our biggest ever release which saw refinements across the board to most of ServiceStack's major components with a number of new features, enhancements, modularizations, custom hooks and extensibility points making this the most feature-packed, modular and extensible ServiceStack ever!

The big ticket feature items in this release are the declarative security restrictions, new Swagger Support as well as all the other plugins we've added since our last v3.9.17 release: inc. Azure and Amazon DynamoDb Caching providers, Support for OpenId, Raven DB AuthProvider, EnterpriseLibrary5 logging and support for the MsgPack Format.

## Restrict Services

You can now declaratively specify the **Access** and **Visibility** restrictions on any service using the new `[Restrict]` attribute.
Access restrictions limits the accessibility of your services whilst Visibility affects whether or not the service shows up on the public `/metadata` pages. 

### Named Configurations

The Restrict attribute includes a number of Named configurations for common use-cases. E.g You can specify a Service should only be available from your local machine with:

    [Restrict(LocalhostOnly = true)]
    public class LocalAdmin { }

Which ensures access to this service is only allowed from localhost clients and the details of this service will only be visible on `/metadata` pages that are viewed locally.

This is equivalent to using the underlying granular form of specifying individual `EndpointAttributes`, e.g:

    [Restrict(AccessTo = EndpointAttributes.Localhost, VisibilityTo = EndpointAttributes.Localhost)]
    public class LocalAdmin { }

There are many more named configurations available. E.g. you can use **VisibleInternalOnly** to only have a service listed on internally viewed `/metadata` pages with:

    [Restrict(VisibleInternalOnly = true)]
    public class InternalAdmin { }

Services can be restricted on any EndpointAttribute, so you can ensure this service is only called by XML clients by simply adding:

    [Restrict(EndpointAttributes.Xml)]
    public class XmlOnly { }

### Restriction Combinations 

Likewise you can add any combination of Endpoint Attributes together, E.g. this restricts access to service to Internal JSON clients only:

    [Restrict(EndpointAttributes.InternalNetworkAccess | EndpointAttributes.Json)]
    public class JsonInternalOnly { }

### Multiple restriction scenarios

It also supports multiple restriction scenarios, E.g. This service is only accessible by **internal JSON** clients or **External XML** clients:

    [Restrict(EndpointAttributes.InternalNetworkAccess | EndpointAttributes.Json,
              EndpointAttributes.External | EndpointAttributes.Xml)]
    public class JsonInternalOrXmlExternalOnly { }

A popular configuration that takes advantage of this feature would be to only allow HTTP plain-text traffic from Internal Networks and only allow external access via secure HTTPS, which you can enforce with:

```csharp
[Restrict(EndpointAttributes.InSecure | EndpointAttributes.InternalNetworkAccess,
          EndpointAttributes.Secure   | EndpointAttributes.External)]
public class InternalHttpAndExternalHttps { }
```

In Debug Mode the metdata pages shows all services including restricted ones, whilst when not in Debug mode the restricted services are hidden from the publicly viewable list, which lets you hide the existence of internal services from the external metadata pages.


## [Other Security](/auth/)

  - Invalid Roles and Permissions access now returns the non-recoverable **403 Forbidden** instead of the earlier **401 Unauthorized**
  - Added **OnRegistered** and **OnLogout** custom event hooks on AuthUserSession
  - Updated all built-in Auth and Registration DTOs with numerical field indexes so all built-in services now work with ProtoBuf


## [Plugins](/plugins)

### Swagger support

We've packaged Swagger support for ServiceStack into an optional and convenient [ServiceStack.Api.Swagger](https://nuget.org/packages/ServiceStack.Api.Swagger/) NuGet package.

After installing the NuGet package enable the Swagger feature with:

    Plugins.Add(new SwaggerFeature());

Now you can enjoy your shiny new Swagger UI at: `http://yoursite/swagger-ui/index.html`

#### Annotating your services

You can further document your services in the Swagger UI with the new `[Api]` and `[ApiMember]` annotation attributes, e,g: Here's an example of a fully documented service:

    [Api("Service Description")]
    [Route("/swagger/{Name}", "GET", Summary = @"GET Summary", Notes = "GET Notes")]
    [Route("/swagger/{Name}", "POST", Summary = @"POST Summary", Notes = "POST Notes")]
    public class MyRequestDto
    {
        [ApiMember(Name="Name", Description = "Name Description", 
                   ParameterType = "path", DataType = "string", IsRequired = true)]
        public string Name { get; set; }
    }

### Caching Providers 

We've added 2 new "Cloud-Ready" [Caching Providers](/caching) for Amazon's AWS Dynamo DB and Windows Azure Caching services:

  - [ServiceStack.Caching.AwsDynamoDb](https://nuget.org/packages/ServiceStack.Caching.AwsDynamoDb/) on NuGet
  - [ServiceStack.Caching.Azure](https://nuget.org/packages/ServiceStack.Caching.Azure/) on NuGet

### Authentication

We've added RavenDB to our list of supported [Auth Provider backends](/auth/authentication-and-authorization) and extended our [OpenId support](/auth/openid) to include DotNetAuth's support for Google, Yahoo and alternate Custom OpenId providers:

  - [ServiceStack.Authentication.RavenDb](https://nuget.org/packages/ServiceStack.Authentication.RavenDb/) on NuGet
  - [Google, Yahoo, MyOpenId and Custom OpenId](https://nuget.org/packages/ServiceStack.Authentication.OpenId/) on NuGet

An adapter for Microsoft's Enterprise Library5 Logging application block has joined our growing list of [Logging Providers](https://github.com/ServiceStack/ServiceStack.Logging) whilst support for the [Message Pack Format](/messagepack-format) joins Protocol Buffers as our fastest binary formats: 

  - [ServiceStack.Logging.EnterpriseLibrary5](https://nuget.org/packages/ServiceStack.Logging.EnterpriseLibrary5/) on NuGet
  - [ServiceStack.Plugins.MsgPack](https://nuget.org/packages/ServiceStack.Plugins.MsgPack/) on NuGet

### [New API](/api-design) Changes

  - Moved in-built the Auth, AssignRoles and UnAssignRoles Services to use the new API
  - Deprecated the old API `ServiceBase<T>` and `RestServiceBase<T>` classes
  - New API methods also supports typed (i.e. non-object) return types, e.g instead of:

```csharp
public object Get(AllReqstars request) 
{
    return Db.Select<Reqstar>();
}
```

You can now optionally specify the strong return type:

```csharp
public List<Reqstar> Get(AllReqstars request) 
{
    return Db.Select<Reqstar>();
}
```

 **Redis** and **MessageProducer** now added to New API's convenient **Service** base class.
 E.g. The example below defers the execution of every 100th request to the registered MessageProducer:

```csharp
public class MyService : Service 
{
    public void Post(CreateCustomer request) 
    {
        if (Redis.Incr("CreateCustomerCount") % 100 == 0)
        {
            MessageProducer.Publish(request);
        }
        else 
        {
            Db.Insert(request.TranslateTo<Customer>());
        }
      }
}
```

Added support for enumerable params using custom pretty urls with C# Service Clients:

```csharp
[Route("/customers/{Ids}")]
public class Customers {
    public int[] Ids { get; set; }
}

// GET /customers/1,2,3
var customers = client.Get(new Customers { Ids = new[] { 1, 2, 3 } }); 
```

### New [SetStatus and AddHeader](/customize-http-responses) [Request Filters](/filter-attributes)

We've added some more ways to [Custom the HTTP Response](/customize-http-responses) with new `[AddHeader]` and `[SetStatus]` Request [Filter attribues](/filter-attributes).

E.g. If we wanted to defer execution of a CustomerOrder request by publishing the Request DTO to the configured MQ Broker, we can use SetStatus to notify the HTTP Client that their CustomerOrder has been accepted but not processed yet:

```csharp
[SetStatus(HttpStatusCode.Accepted, "Customer Order Accepted")]
public void Post(CustomerOrder request) { 
    PublishMessage(request);    
}
```

Which is equivalent to returning a customized HttpResult:

```csharp
public object Post(CustomerOrder request) { 
    PublishMessage(request);
    return new HttpResult(HttpStatusCode.Accepted, "Customer Order Accepted");
}
```

In the same way, the `[AddHeader]` attribute allows you to set custom HTTP Response Headers.
E.g. Here's a CSV Service that returns the System's Contact Info and a X-CustomHeader HTTP Response header:

```csharp
[AddHeader(ContentType = "text/csv")]
[AddHeader("X-CustomHeader", "Value")]
public string Get(ContactInfo request) { 
    return "Key,Value\n"
         + "AdminEmail,admin@email.com\n"
         + "AdminPhone,555-1234\n";
}
```

### [SOAP Support](/soap-support)

Added `IRequiresSoapMessage` which works similar to `IRequiresRequestStream` interface to tell ServiceStack to skip de-serialization of the request and instead pass the raw WCF Message to the Service instead for manual processing, e.g:

```csharp
public class RawWcfMessage : IRequiresSoapMessage {
    public Message Message { get; set; }
}

public object Post(RawWcfMessage request) { 
    request.Message... //Raw WCF SOAP Message
}
```

### [Metadata pages](/metadata-page)

The metadata pages have undergone a significant re-factor to support new Security features, format/verb detection, annotation attributes and unified metadata configuration object model:

  - Functionality for /metadata pages have been packaged into an optional `MetadataFeature` modular plugin
  - Added `Config.MetadataVisibility` to restrict visibility of the auto-generated `/metadata` pages
  - Re-factored all ServiceStack metadata on Services into unified `Config.Metadata` object model
    - Added new `/operations/metadata` debug route added for viewing metadata stored on available services 
  - Metadata operations page now disables links to formats on restricted and hidden operations
    - E.g. Services that don't support HTTP POST will show as disabled for SOAP endpoints
  - Replaced old unused client example links with single link to GitHub Clients Overview wiki page
  - Added `[Api]` and `[ApiMember]` annotation attributes for use in /metadata pages and Swagger API

### [Pre-defined Routes](http://www.servicestack.net/ServiceStack.Hello/#predefinedroutes)

  - Refactored support for ServiceStack's pre-defined routes into an optional `PredefinedRoutesFeature` plugin
  - Added new pre-defined route `/reply/{Operation}` as a shorter alias for `/syncreply/{Operation}`
  - Added new pre-defined route `/oneway/{Operation}` as a shorter alias for `/asynconeway/{Operation}`

### [Razor Support](https://razor.netcore.io/)

  - Razor Format now looks for a view with the same name as the Request DTO first, before the Response DTO name
  - Service Errors now stored in `@ModelError` and typed Exception details available in `@ResponseStatus`
  - Added `RazorFormat.SkipPaths` setting to skip searching views in `/obj` and `/bin` folders by default

### Configuration

  - Support for overriding soapAction namespace in WSDL with `Config.WsdlSoapActionNamespace`

### [Error Configuration and Customizations](/error-handling)

Use `Config.MapExceptionToStatusCode` to change what error codes are returned for different exceptions, e.g:

```csharp
SetConfig(new EndpointHostConfig { 
    MapExceptionToStatusCode = {
        { typeof(CustomInvalidRoleException), 403 },
        { typeof(CustomerNotFoundException), 404 },
    }
});
```

Use `Config.CustomErrorHttpHandlers` for specifying custom HttpHandlers to use with specific error status codes, e.g:

```csharp
SetConfig(new EndpointHostConfig {
    CustomErrorHttpHandlers = {
        { HttpStatusCode.NotFound, new RazorHandler("/notfound") },
        { HttpStatusCode.Unauthorized, new RazorHandler("/login") },
    }
});
```

Use `Config.GlobalHtmlErrorHttpHandler` for specifying a **fallback HttpHandler** for all error status codes, e.g:

```csharp
SetConfig(new EndpointHostConfig {
    GlobalHtmlErrorHttpHandler = new RazorHandler("/oops"),
});
```

### Debugging / Diagnostics

  - Automatically adding RequestLogsInfo feature for DebugBuilds
  - Only return detailed 404 info pages on DebugBuilds
  - Enable `__requestinfo` path info flag showing full dump of request details in DebugBuilds

### [Route Helpers](/routing)

Added New API support to the convention-based auto-route `Route.AddFromAssembly()` utility which scans supplied Assemblies 
registering the inferred REST paths and HTTP verbs for all Old and New API services it finds.

E.g. With the following Services:
 
```csharp
public class Foo
{
    public int Id { get; set; }
}
public class Bar {}

public class FooService : Service {     
    public object Get(Foo request) { ... }
    public object Post(Foo request) { ... }
    public object Get(Bar request) { ... }
}
```

Adding this in your `AppHost.Configure()`:

```csharp
Routes.AddFromAssembly(typeof(FooService).Assembly);
```

Is equivalent to manually adding these route registrations:

```csharp
Routes.Add<Foo>("/foo", "GET POST");
Routes.Add<Foo>("/foo/{Id}", "GET POST");
Routes.Add<Bar>("/bar", "GET");
```

### Mapping Helpers

Our built-in Mappers now support mapping between fields, properties and methods of the same name. 
They also now support mapping from Dynamic proxies (e.g. NHibernate) and will coerce properties of different types, e.g. strings to ints, doubles, enums, etc and vice-versa.
The built-in mappers can be accessed with the `TSrc.TranslateTo<TDest>()` and `TDest.PopulateWith(TSrc)` family of methods, e.g:
    
```csharp
var bar = foo.TranslateTo<Bar>();

var foo = new Foo();
foo.PopulateWith(bar);

foo.PopulateWithNonDefaultValues(bar);

//Only populate properties marked with [DataMember]
foo.PopulateFromPropertiesWithAttribute(bar, typeof(DataMemberAttribute));  
```
    
### URL Helpers

Added the `HttpResult.Redirect(newUrl)` helper method.
Added the `httpReq.GetBaseUrl()` extension method.
Added the SetQueryParam string extension method to help build urls, e.g: 

```csharp
var url = "http://host.com/path"
  .SetQueryParam("key", "value")
  .SetQueryParam("foo", "bar")
  .SetQueryParam("key", "override");

url.Print(); //= http://host.com/path?key=override&foo=bar
```

### Misc

  - Added `HttpContext.ToRequestContext()` extension method to convert an ASP.NET HTTP Context into a ServiceStack `HttpRequestContext`
  - SOAP endpoints now supported in self-hosted HttpListener hosts
  - Added custom client build for Windows Phone
  - Empty responses now return **204** StatusCode by default (overrideable with Config.Return204NoContentForEmptyResponse)
  - Added static `AppHostBase.ResolveService<T>()` method for resolving an auto-wired ServiceStack service as used in MVC
  - Deprecated Old API classes in favour of New API
  - Rename embedded files (e.g. for MiniProfiler) to use a `ssr-` prefix

# v3.9.17 Release Notes

## ServiceStack's new API design

This was an exciting release where we've added an alternative [API design](/api-design) that made significant improvements to structure and surface of ServiceStack's Client and Server Side APIs that:

  - Promotes a more succinct, typed, end-to-end client API
  - Works with all the existing JSON, XML and JSV Service Clients
  - Typed client APIs use user-defined Cool Uris without needing to build strings on the HTTP Client
  - Supports handling of any HTTP Verb
  - Less Restrictive and Opinionated - Allows for 'Pure Responses' whilst retaining structured exceptions in the typed clients
  - Each service can now handle any number of different Request types and HTTP Verbs
  - Easier to use - Merges and simplifies existing IService and IRestService concepts and interfaces together
  - Introduces finer-grained Action Request and Response filters
  - Smarter Routing
  - Easier to add custom hooks that's more decoupled and testable
  - Works with ServiceStack's existing features, e.g. Content Negotiation, Metadata pages, Razor views, Auto HTML report, etc.

See the wiki for [full details on the new API](/api-design). As it's much nicer and more flexible than the previous one, it's now stands as our recommended option for designing new services with. We've already started work on porting the existing examples across, some of which will give you a good feel of its development experience in action:

  - [The Razor Rockstars Service](https://razor.netcore.io/rockstars)
  - [The Home Page TODOs example](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/NewApiTodos.cs)
  - [The Comprehensive test suite](https://github.com/ServiceStack/ServiceStack/blob/master/tests/RazorRockstars.Console.Files/ReqStarsService.cs)
  - [Social Bootstrap Api project](https://github.com/ServiceStack/SocialBootstrapApi/) - See the [Old vs New Api Pull Request](https://github.com/ServiceStack/SocialBootstrapApi/commit/3b63651c13187ab93f5cefcb3d94fc3667b0fcd9)

*****

## v3.9.11 Release Notes

### Growing OSS community

Following in the heels of last months major [100k NuGet downloads](http://www.servicestack.net/100k-downloads/)  milestone, we've since **moved up 4 places** to now rank [**7th** on GitHub's all-time .NET OSS leaderboard!](https://github.com/languages/C%23/most_watched) We're ecstatic from the interest and it's proving to be a strong motivator to shipping even more innovative features in the coming releases!

### Complete HTML story (Razor + Markdown)

By far the biggest feature in this release is ServiceStack's much improved HTML story with Razor and Multi-View Engine support. There's too many features to even begin listing here, but you can read all about it in the live showcase demo:

  - [https://razor.netcore.io](https://razor.netcore.io) 

#### Getting Started 

ServiceStack's Razor support comes conveniently packaged inside a [NuGet package](https://nuget.org/packages/ServiceStack.Razor) that you can immediately get going with after creating any empty ASP.NET or Console Application (.NET 4.0+) and running:

:::copy
`<PackageReference Include="ServiceStack.Razor" Version="5.*" />`
:::

## Improved Mono Support

We continue to see providing first-class Mono Support as a core objective for the project as we expect our current strategy of Develop on VS.NET in Windows and deploy on Linux to become increasingly popular as it is able to take advantage of better scripting and automation, Value, infrastructure and Cloud environments that's continues to be invested in Linux-only environments today. Ensuring we continue to provide First-class Linux support influences the direction and technical implementation of the project:

### Specialized, Auto-correcting behaviour in Mono / Self-Hosts

We've added normalizing behaviour to maintain the same unified experience across IIS/ASP.NET to Mono/ASP.NET and Self-Host (Win/Mono). At times when it differs from normal IIS/ASP.NET behaviour we apply auto-correcting behaviour to Mono and self-hosts to imitate IIS/ASP.NET, e.g. we auto-redirect dirs without '/' suffixes [/stars/alive/Vedder](https://razor.netcore.io/stars/alive/Vedder) and allow Mono to support case-insensitive urls [/stars/alive/vedder](https://razor.netcore.io/stars/alive/vedder).

Our normalisation efforts allows the same website to work as-is in each of the supported ServiceStack hosts:

  - [razor.netcore.io](https://razor.netcore.io) - ASP.NET Host on Linux / MonoFastCGI (+ Win)
  - [razor-console.servicestack.net](http://razor-console.servicestack.net) - Self-hosted console application behind Nginx Reverse proxy (+ Win)
  - [Windows Service](https://github.com/ServiceStack/RazorRockstars/tree/master/src/RazorRockstars.WinService)

### Switched to MarkdownDeep by default

As Mono only has limited support for Regular Expressions, the Reg-Ex based MarkdownSharp was not working too well for large Markdown pages. 
We've since switched over to use the non-RegEx Markdown implementation [MarkdownDeep](http://www.toptensoftware.com/markdowndeep/) by [@toptensoftware](https://twitter.com/toptensoftware).

Not only is Markdown Razor now working flawlessly across Windows / Linux, but it ended up being faster as well. The original MarkdownSharp is still included and can be swapped-in instead at start up.

### Continious Integration Builds

Thanks to the stellar efforts by [@desunit](http://twitter.com/desunit), we now have internal CI builds for both Mono and Windows releases. Given all our tests take a long time to run, they've already been invaluable in increasing productivity and speeding up development. We plan to make successful nightly .NET and Mono release builds publically available soon.

### Virtual FileSystem

We've switched over to use [@jrosskopf](https://github.com/jrosskopf) new virtual file system that now allows us to support multiple data sources for webserver resources. E.g. We use the same API to serve both external and embedded file resources. The VFS makes it easy to add additional data sources later, e.g. serving Razor views on the fly from a database :).

### Request Scope in Funq

We've extended the built-in [Funq IOC to support Request Scope](/ioc).

Container Adapters for Alternate IOC's can now implement `IRelease` or just continue to override `AppHost.Release()` to handle released resources. More details on the [IOC Wiki page](/ioc)

### Dynamic JSON

Thanks to Daniel Crenna's recent contributions we've added his `DynamicJson` wrapper which provides an expressive dynamic API around ServiceStack's JSON serializer. As it requires .NET 4.0, it's been added to the .NET 4.0 ServiceStack.Razor Assembly. 

### `[Route]` attribute

The `[RestService]` attribute was replaced with the more-fitting `[Route]` attribute. `[RestService]` has been deprecated but can still be used. 

### Global exception handling is overwriteable

You can override the global exception handling strategy with `IAppHost.ExceptionHandler`. This is the default implementation:

```csharp
this.ExceptionHandler = (httpReq, httpRes, operationName, ex) => {
    var errorMessage = string.Format("Error occured while Processing Request: {0}", ex.Message);
    var statusCode = ex.ToStatusCode();

    if (!httpRes.IsClosed) {
        httpRes.WriteErrorToResponse(httpReq.ResponseContentType, operationName, errorMessage, ex, statusCode);
    }
};
```

The global exception handling strategy is invoked for un-handled exceptions or you are using `ServiceBase<>` (without overwriting `HandleException()`) and aren't following the naming convention `{Request DTO Name}Response` or for error occurring outside of the service (i.e. in ServiceStack itself).

### New CORS plugin

We've added a flexible, yet easy to use **CorsFeature** that's effortless to add to any existing project or on a adhoc per-service basis. Full details are [on StackOverflow](http://stackoverflow.com/questions/8211930/servicestack-rest-api-and-cors)

### Pre request filters (`IAppHost.PreRequestFilters`)

Pre request filters are called before deserialization (i. e. before ServiceStack takes ownership of the request). 

## Minor Features and Fixes

  - Added support for Authentication in File uploads APIs of the Service Clients
  - We're now inferring ServiceStack's root handler path from the HttpListeners url in Self-hosts 
  - Support caching of Binary Content-Types
  - Split **UserHostAddress** and **RemoteIp** into different properties, the latter also looks at X-Forwarded-For, X-Real-IP HTTP Headers
  - Made MimeTypes extensible to allow for user-defined Mime-Types
  - Added **Routes** and **Plugins** properties to `IAppHost`
  - Improved base service classes to allow for easy access to typed sessions with `base.SessionAs<TUserSession>`
  - Fix IPv6 loopback parsing issue
  - Added new `AppHostHttpListenerLongRunningBase` base class with benchmarks
  - Enable [InMemoryRollingRequestLogger](/request-logger) to also handle non-HTTP requests
  - Lots more tests and bug fixes

## Significant updates to JSON, Redis and OrmLite

Significant contributions have also been made on ServiceStack's sub projects: 

  - [ServiceStack.Text](https://github.com/ServiceStack/ServiceStack.Text)
  - [ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis) and the built-in [Redis MQ Server](/redis-mq)
  - [ServiceStack.OrmLite](https://github.com/ServiceStack/ServiceStack.OrmLite)

but they each deserve their own Release notes, which we hope to draft up soon.

.

## v3.78 Release Notes

Although it's been a long time between formal releases - v3.78 marks our biggest release ever! Mostly as a result of being too busy to prepare these release notes containing all the effort that have gone into the framework (and supporting libraries) in the last 6 months :)

Today we hope to rectify this neglect with a special thanks to all the contributors that helped make this release possible. We would like to pay a special thanks to Steffen Müller ([@arxisos](http://twitter.com/arxisos)) whose code and documentation contributions and expert support in the [forums](https://groups.google.com/forum/?fromgroups#!forum/servicestack) and [real-time help channel](http://jabbr.net/#rooms/servicestack) over these last 6 months have been invaluable.

A lot of features being announced are already well known to our active user-base as they've shipped in our production release builds for months. Hopefully these notes will highlight other useful but less known features.

### Awesome Feedback

We're estatic at the response we've received from the community this year which has seen our Contributor count more than doubled (now at [66 Contributors](https://github.com/ServiceStack/ServiceStack#contributors)!). We've also received great response from our users which we've started keeping track of this year under [@ServiceStack favorites](https://twitter.com/#!/ServiceStack/favorites) and in the [forums](https://groups.google.com/forum/?fromgroups#!forum/servicestack).

## New Demo Reference App

Many of these features listed below are showcased in the new [Social Bootstrap API reference demo](https://github.com/ServiceStack/SocialBootstrapApi) - a Backbone.js-enabled Single Page App (SPA) template, pre-configured with Twitter & Facebook login, with [Bundler](https://github.com/ServiceStack/Bundler) built-in for super-fast bundling and minification.

The above repo is kindly hosted by [AppHarbor](http://appharbor.com) at [http://bootstrapapi.apphb.com](http://bootstrapapi.apphb.com)

[![Tweets](http://www.servicestack.net/img/bootstrap-api-02-850.png)](http://bootstrapapi.apphb.com)

### Authentication & Authorization

Probably the biggest features shipped in this release is a 'clean' authentication provider model, completely detached from ASP.NET's existing membership providers exposed as clean interfaces with the following pluggable auth providers supported out-of-the-box:

```csharp
    Plugins.Add(new AuthFeature(
        () => new CustomUserSession(),             //Use your own typed Custom UserSession type
        IncludeAssignRoleServices = false,         //Don't register AssignRoles/UnAssignRoles services to manage users roles
        new IAuthProvider[] {
            new CredentialsAuthProvider(),         //HTML Form post of UserName/Password credentials
            new TwitterAuthProvider(appSettings),  //Sign-in with Twitter
            new FacebookAuthProvider(appSettings), //Sign-in with Facebook
            new BasicAuthProvider(),               //Sign-in with Basic Auth
            new DigestAuthProvider(),              //Sign-in with Digest Auth
            new CustomCredentialsAuthProvider(),   //Subclass CredentialsAuthProvider and access your own User/Pass repository
        }));
```

Note: Only the AuthProviders registered on the AuthFeature plugin are available at runtime.

#### Event Hooks

You can add custom logic to the user Authenticaiton by overriding the **OnAuthenticated()** method on either the:

  - Custom UserSession - which gets called after every successful Authentication/Login attempt (on any AuthProvider)
  - Custom AuthProvider - which only gets called when a user authenticates with this specific provider

You can also plug-in your own Validation Hooks

  - AuthService.ValidateFn - Called in the context of the AuthService, any C# exceptions are propagated to the client
  - RegistrationService.ValidateFn - Called in the context of the RegistrationService, any C# exceptions are propagated to the client
  - Registration Validator - Override the default Registration validator to add stricter/lax validation logic

Since the new AuthFeature and its related [Session classes](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/Auth/IAuthSession.cs) are [pure POCOs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/Auth/UserAuth.cs) we're able to cleanly support multiple back-end session & persistance providers:
    
#### Per-Request Session Access (ICacheClient)

  - InMemory
  - Redis (distributed)
  - Memcached (distributed)

#### Longterm Persistance DataStore

  - OrmLite
      - SqlServer, Sqlite, PostgreSql, MySql and Firebird RDBMS back-ends
  - Redis
  - InMemory (for testing)

### Roles & Permissions

The Auth POCOs can hold any number of Roles and Permissions per user.

Which can be used to protect your services by adding the attributes below onto your Service or Request DTOs:

     [RequiredRole(roleNames)]
     [RequiredPermission(permissionNames)]

These attributes can also be used on MVC Controllers as part of the [ServiceStack.Mvc](http://nuget.org/packages/ServiceStack.Mvc) NuGet pacakage and is explained in the [MVC PowerPack](http://www.servicestack.net/mvc-powerpack/).

These permissions can be managed with the AssignRoles/UnAssignRoles services registered as part of the AuthFeature plugin. Only users with the **Admin** role can access these services.

More info about autentication can be found in the [wiki documentation](/auth/authentication-and-authorization).

## Validators

When you enable the `ValidationFeature()` plugin you can create a **validator for every Request DTO** you have, with **smart, terse fluent syntax** that can handle most use-cases, e.g:

```csharp
    public class UserValidator : UserValidator<ModelToValidate> {
        public UserValidator() {
            //Validation rules for all requests
            RuleFor(r => r.Name).NotEmpty();
            RuleFor(r => r.Age).GreaterThan(0);

            //Only apply this validation logic to POST and PUT requests
            RuleSet(ApplyTo.Post | ApplyTo.Put, () => {
                RuleFor(r => r.Count).GreaterThan(10);
            });
        }
    }
```
    
This fluent syntax is provided to you by an integrated version of [JeremySkinner](https://github.com/JeremySkinner)'s excellent [FluentValidation](https://github.com/JeremySkinner/FluentValidation) library.
            
More info about validation can be found in the [wiki documentation](/validation).

### Filter attributes

Request/Response filters (modelled after MVC Action filters) are a great way to share common logic between services which you can easily add by marking your service class or Request/Response DTOs with a Request or Response Filter Attribute. The [RequiredRole](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/RequiredRoleAttribute.cs) and [RequiredPermission](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/RequiredPermissionAttribute.cs) attributes good examples of functionality that's best captured in Filter attributes. Here's a simple example of how to create one:

```csharp
    public class LogFilterAttribute : RequestFilterAttribute {
        
        public IStatsLogger StatsLogger { get; set; }  // Injected by IOC
          
        public LogFilterAttribute(){
            //Priorities <0 are executed before global filters, filters with priorities >= are executed after (in order)
            base.Priority = 10;
        }

        public override void Execute(IHttpRequest req, IHttpResponse res, object requestDto) {
            //This code is executed before the service
            StatsLogger.SaveUserAgent(req.UserAgent);
        }
    }
```

That's it! No registration is needed as they're auto-discovered so you can start adding them on services you want to log.

More info about request and response filter attributes can be found in the [wiki documentation](/filter-attributes).

## New Plugin API

As of v3.55 all ServiceStack's add-ons now implement the following Plugin API:

```csharp
    public interface IPlugin {
        void Register(IAppHost appHost);
    }
```

### Plugins registered by default

ServiceStack's [CSV Format]():

    Plugins.Add(new CsvFormat());

ServiceStack's auto generated [HTML5 JSON Report Format](/html5reportformat):

    Plugins.Add(new HtmlFormat());  

[Razor Markdown Format](/markdown-razor):

    Plugins.Add(new MarkdownFormat());  

More info about Razor Markdown: [Intro](/markdown-razor), [Features](http://www.servicestack.net/docs/markdown/markdown-features), [Docs Website](http://www.servicestack.net/docs/markdown/about)

### Removing or accessing built-in plug-ins

You can prevent a default plug-in from being added by removing it from a list, e.g: removing the CSV Format:

    Plugins.RemoveAll(x => x is CsvFormat);

Likewise you can access a plug-in just as easy, should you want to modify their existing attriutes, e.g:

    var htmlFormat = (HtmlFormat)base.Plugins.First(x => x is HtmlFormat);

### Available plugins

Enable ServiceStack's Fluent Validation:

    Plugins.Add(new ValidationFeature());

Enable ServiceStack's built-in Authentication (displayed above in full):

    Plugins.Add(new AuthFeature(....));

The AuthFeature above already enables the SessionFeature, but if you want to make use of sessions and don't want to enable the built-in Authentication, you will need to register it manually with:

    Plugins.Add(new SessionFeature());

The Registration feature enables the Registration Service and allows users to register at the default route `/register`:

    Plugins.Add(new RegistrationFeature());

Adding the [ProtoBuf Format](/protobuf-format) NuGet package automatically adds the ProtoBufFormat plug-in:

    Plugins.Add(new ProtoBufFormat());

Add an In-Memory `IRequestLogger` and service with the default route at `/requestlogs` which maintains a live log of the most recent requests (and their responses). Supports multiple config options incl. Rolling-size capacity, error and session tracking, hidden request bodies for sensitive services, etc.

    Plugins.Add(new RequestLogsFeature());

The `IRequestLogger` is a great way to introspect and analyze your service requests in real-time. Here's a screenshot from the [http://bootstrapapi.apphb.com](http://bootstrapapi.apphb.com) website:

![Live Screenshot](http://www.servicestack.net/img/request-logs-01.png)

It supports multiple queryString filters and switches so you filter out related requests for better analysis and debuggability:

![Request Logs Usage](http://www.servicestack.net/img/request-logs-02.png)

The [RequestLogsService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/Admin/RequestLogsService.cs) is just a simple C# service under-the-hood but is a good example of how a little bit of code can provide a lot of value in ServiceStack's by leveraging its generic, built-in features.

## Messaging services

ServiceStack's typed, message-first design is ideal for coarse-grained out-of-proc communication. Although HTTP is our primary endpoint, through our clean `IMessageService` interface we also provide a number of alternate hosts that are able to **re-use your existing services** made available on different hosts.

  - [Redis MQ](/redis-mq)
  - [InMemory MQ](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Messaging.Tests/TransientServiceMessagingTests.cs)
  - [Rcon](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Common/Messaging/Rcon)

In many ways MQ's are underrated technology in .NET, but they can provide superior conduit to connect your internal services, especially for async/one-way, idempotent messages. They can offer reliabile and durable messaging, better scalability and natural load-balancing, as well as time-decoupled and disconnected operation between loosely-coupled endpoints.

New hosts can be easily added by implementing the `IMessageService` interface which is something we plan on doing in the near future. As future hosts will be able to bind to your existing services, you'll be able to easily make use of them when they're ready.

## Other changes

There have been lots of other smaller features and fixes added during the time between releases (too many to add here). Although you can check our [commit logs](https://github.com/ServiceStack/ServiceStack/commits/master) if you're interested in the finer details of what we've been up to :)

## Future Roadmap

For those interested in our future road-map we hope to ship the following features for our next-release:

### Async

As part of his excellent contributions [@arxisos](http://twitter.com/arxisos) has been maintaining an [async branch](https://github.com/ServiceStack/ServiceStack/tree/async) that has ServiceStack running on `IHttpAsyncHandler` and already has a functional alpha build available for you to try at: [ServiceStack-v4.00-alpha.zip](https://github.com/downloads/ServiceStack/ServiceStack/ServiceStack-v4.00-alpha.zip)

With this change ServiceStack supports `Task<>` as a return type on services. You only need to register the [Task plugin](https://github.com/ServiceStack/ServiceStack/blob/async/tests/ServiceStack.Plugins.Tasks.Tests/TaskServiceTest.cs#L46). To see a full example look at [this integration test](https://github.com/ServiceStack/ServiceStack/blob/async/tests/ServiceStack.Plugins.Tasks.Tests/TaskServiceTest.cs). 

### New Metadata pages

The only way we can support the different layouts and customizations users want to apply to the auto-generated metadata pages is to have them completely customizable and hot-swappable. So that's our plan for the next iteration of the metadata pages - a rewrite into a self-contained, swappable static HTML/Ajax pages. We'll attempt to provide as much info in our json metadata services we can so others are able to create an executable REST API/UI from them - i.e. making it possible to integrate 3rd party OSS REST API clients like Swagger or Apigee.

### Fast IPC/RPC Bridge between ServiceStack services &lt;=> C#/.NET, [Dart](http://www.dartlang.org/) / [Node.js](http://nodejs.org/) processes

As soon as Async has been integrated into ServiceStack core, it will lay the foundation for our work on a fast IPC/RPC bridge between ServiceStack services and external C#/.NET and node.js/Dart processes. 

As ServiceStack's message-based design influences the development of coarse-grained (i.e. non-chatty) services it provides the perfect interface for efficient out-of-process communications. We plan to get an optimal implementation by employing an async/non-blocking design, invoking services directly (by-passing the overhead of the HTTP Stack/Context) and using our fast JSON Serializer in .NET and the native JSON parsers in node.js/Dart.

Although our motivations to build a bridge to external C#/.NET processes will be well-understood by our .NET-strong user-base, why we'd want to provide a good story for Dart and node.js platforms will be less clear...

### Whoa?.. What are all these node.js and Dart pieces doing in my .NET soup?

In many ways dynamic languages offer greater productivity, flexibility, iteration time advantages over static languages (i.e. C#/.NET) for web development. 
E.g: [Node.js](http://nodejs.org) (Server-Side V8/JavaScript) has superior web tooling (with native implementations for all popular web DSLs and minifiers - [and why we've adopted it for Bundler](https://github.com/ServiceStack/Bundler)), a large and [thriving OSS ecosystem](https://github.com/languages/), excellent [libraries and frameworks](https://github.com/joyent/node/wiki/modules) making it the 1st-choice platform for many pro-web developers and Start-Ups.

Whilst [Dart](http://www.dartlang.org) is the new dynamic structured-language under heavy development by some of the brightest language minds at Google including: 
[Lars Bak](http://goo.gl/WQZEd), [Kasper Lund](http://verdich.dk/kasper/), [Vyacheslav Egorov](http://blog.mrale.ph/) & [Mads Ager](http://www.dartlang.org/authors/mads-ager.html) (original V8 team), [Jim Hugunin](http://en.wikipedia.org/wiki/Jim_Hugunin) (Jython/IronPython/DLR), [Joshua Bloch](http://en.wikipedia.org/wiki/Joshua_Bloch) (Java APIs), [Gilad Bracha](http://en.wikipedia.org/wiki/Gilad_Bracha) (JLS/JVM/NewSpeak), [and many others](http://www.dartlang.org/authors/).

It sports many unique features well suited for the development of complex web apps:

  - [Optional-typing](http://www.dartlang.org/articles/optional-types/) - Providing dynamic-lang-like productivity & structure
  - [Snapshotting](http://www.infoq.com/articles/google-dart) - For instant-startup times 
  - [Interface/default classes + factories](http://www.dartlang.org/docs/language-tour/#interfaces) - Encourages binding to interfaces (all core-libs) / eliminate IOCs
  - [Method missing](http://www.dartlang.org/articles/emulating-functions/#nosuchmethod) - For creating terse, dynamic APIs + proxies
  - [Isolates](http://www.dartlang.org/docs/library-tour/#dartisolate---concurrency-with-isolates) - Shared-nothing concurrency and secured hosting of 3rd Party code
  - [String interpolation](http://www.dartlang.org/docs/language-tour/#strings) - For effortless construction of strings
  - [Large core lib](http://api.dartlang.org/) - Rich client & server-side libraries with a consistent & terse DOM API

Although the first version is not yet released it already ships with great tooling (for OSX/Win/Linux) including a [smart, lightweight IDE](http://www.dartlang.org/docs/getting-started/editor/) and a built-in VM/Debugger in Dartium (a custom build of Chrome).

Both Node.js and Dart offer full-webstack programming (same language used on client/server), faster compile and iteration times, less friction and a more lax type-system - ideal for web development. Node.js and Dart's async/evented architecture also makes it a great choice for web socket servers and highly interactive sites.

### Getting the best of both worlds

We still believe statically-typed languages offer a better value proposition for developing and maintaining web services and is still in many ways a better choice for any CPU-intensive, Heavy Data/Binary processing tasks as well as accessing native/unmanaged APIs.

With that said we feel there's a lot of value in developing a great story to efficiently communicate between ServiceStack and node.js/Dart processes which we hope offers the best of both worlds for other like-minded polygots. 

Although as ServiceStack has already developed [.NET's fastest JSON serializer](http://www.servicestack.net/benchmarks/#burningmonk-benchmarks) and .NET's leading [C# Redis Client](https://nuget.org/packages?q=redis) (and [Dart Redis Client](https://github.com/mythz/DartRedisClient) :) - We already have a great comms story via [Redis](http://redis.io) available today - but we hope to make it even better by communicating directly between .NET/node.js/Dart processes (i.e. by-passing redis).

### Potential MVC Razor and spark integration

ServiceStack already has [existing HTML Support](http://stackoverflow.com/a/8200056/85785), but we hope to increase it even further by integrating the best thing we like about MVC (i.e. Razor :) so we have even less reasons for wanting to host ServiceStack with ASP.NET MVC :) 

### Integration with [NancyFx](https://github.com/NancyFx/Nancy)

Nancy is another excellent OSS (ASP.NET MVC Replacement) Web Framework for .NET, that offers a simple, clean and terse programming model for websites (just the kind we like :). We hope to provide a good [Social Bootstrap API-like](https://github.com/ServiceStack/SocialBootstrapApi) template but replaced with a NancyFx host instead.

****

##ServiceStack 3.09 Release Notes

## Latest version of Dapper built-in

Now in ServiceStack is StackOverflow's own [benchmark leading](http://www.servicestack.net/benchmarks/) Micro ORM **[Dapper](http://code.google.com/p/dapper-dot-net/)**.
This means a fresh NuGet install of ServiceStack now includes the 2 fastest Micro ORMS for .NET! :)

OrmLite and Dapper are very similar in design in that they're simply useful extension methods on ADO.NET's `System.Data.*` interfaces, the difference being Dapper has extension methods of `IDbConnection` whilst OrmLite methods hangs off the lower `IDbCommand`. And because they both make use of 'clean POCOs' - they can be used interchangibly together on the same DB connection. This also allows them to both make use of `OrmLiteConnectionFactory` to configure connection manager over your DB ConnectionString.

## Mvc Mini Profiler now baked in

We've made ServiceStack's [HTML5 JSON Report Format](/html5reportformat) even better by now including the excellent [Mvc Mini Profiler](http://code.google.com/p/mvc-mini-profiler/) - by [@jarrod_dixon](https://twitter.com/jarrod_dixon) and [@samsaffron](https://twitter.com/samsaffron).
It's the same profiler used to profile and help speed up sites like [Stack Overflow](http://www.stackoverflow.com) and more recently the much faster [NuGet v2.0](http://nuget.org) website.

As the MVC Mini Profiler is optimized for a .NET 4.0 MVC app, we've made some changes in order to integrate it into ServiceStack:
  
  - Make it work in .NET 3.0 by backporting .NET 4.0 classes into **ServiceStack.Net30** namespace (Special thanks to OSS! :)
    - Using Mono's **ConcurrentDictionary** classes
    - Using [Lokad.com's Tuples](http://code.google.com/p/lokad-shared-libraries/source/browse/Source/Lokad.Shared/Tuples/Tuple.cs)
  - Switched to using ServiceStack's much faster [Json Serializer](http://www.servicestack.net/docs/text-serializers/json-serializer)
  - Reduced the overall footprint by replacing the use of jQuery and jQuery.tmpl with a much smaller [jquip (jQuery-in-parts)](https://github.com/mythz/jquip) dependency.
  - Moved to the **ServiceStack.MiniProfiler** namespace and renamed to **Profiler** to avoid clashing with another Mvc Mini Profiler in the same project

As a side-effect of integrating the Mvc Mini Profiler all ServiceStack .NET 3.0 projects can make use of .NET 4.0's ConcurrentDictionary and Tuple support, hassle free!

### Using the MVC Mini Profiler

Just like the [Normal Mvc Mini Profiler](http://code.google.com/p/mvc-mini-profiler/) you can enable it by starting it in your Global.asax, here's how to enable it for local requests:
 
    protected void Application_BeginRequest(object src, EventArgs e)
    {
        if (Request.IsLocal)
            Profiler.Start();
    }

    protected void Application_EndRequest(object src, EventArgs e)
    {
        Profiler.Stop();
    }

That's it! Now everytime you view a web service in your browser (locally) you'll see a profiler view of your service broken down in different stages:

![Hello MiniProfiler](http://www.servicestack.net/files/miniprofiler-hello.png)

By default you get to see how long it took ServiceStack to de-serialize your request, run any Request / Response Filters and more importantly how long it took to **Execute** your service.

The profiler includes special support for SQL Profiling that can easily be enabled for OrmLite and Dapper by getting it to use a Profiled Connection using a ConnectionFilter:
```csharp
this.Container.Register<IDbConnectionFactory>(c =>
    new OrmLiteConnectionFactory(
        "~/App_Data/db.sqlite".MapHostAbsolutePath(),
        SqliteOrmLiteDialectProvider.Instance) {
            ConnectionFilter = x => new ProfiledDbConnection(x, Profiler.Current)
        });
```

Refer to the [Main MVC MiniProfiler home page](http://code.google.com/p/mvc-mini-profiler/) for instructions on how to configure profiling for Linq2Sql and EntityFramework.

It's also trivial to add custom steps enabling even finer-grained profiling for your services. 
Here's a [simple web service DB example](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.IntegrationTests/Services/ProfilerService.cs) 
returning a list of Movies using both a simple DB query and a dreaded N+1 query.

```csharp
    public class MiniProfiler
    {
        public string Type { get; set; }
    }

    public class MiniProfilerService : ServiceBase<MiniProfiler>
    {
        public IDbConnectionFactory DbFactory { get; set; }

        protected override object Run(MiniProfiler request)
        {
            var profiler = Profiler.Current;

            using (var dbConn = DbFactory.OpenDbConnection())
            using (var dbCmd = dbConn.CreateCommand())
            using (profiler.Step("MiniProfiler Service"))
            {
                if (request.Type == "n1")
                {
                    using (profiler.Step("N + 1 query"))
                    {
                        var results = new List<Movie>();
                        foreach (var movie in dbCmd.Select<Movie>())
                        {
                            results.Add(dbCmd.QueryById<Movie>(movie.Id));
                        }
                        return results;
                    }
                }

                using (profiler.Step("Simple Select all"))
                {
                    return dbCmd.Select<Movie>();
                }
            }
        }
    }
```

Calling the above service normally provides the following Profiler output:

![Simple DB Example](http://www.servicestack.net/files/miniprofiler-simpledb.png)

Whilst calling the service with the **n1** param yields the following warning:

![Simple N+1 DB Example](http://www.servicestack.net/files/miniprofiler-simpledb-n1.png)

In both cases you see the actual SQL statements performed by clicking the **SQL** link. The N+1 query provides shows the following:

![N+1 DB Example SQL Statementes](http://www.servicestack.net/files/miniprofiler-simpledb-n1-sql.png)

Notice the special attention the MVC MiniProfiler team put into identifying **Duplicate** queries - Thanks Guys!

*****

##ServiceStack 2.28 Release Notes

This release includes a few enhancements and catches up on all the pull requests and most of the issues that were submitted 
since the last release.

## ServiceStack is now using Trello.com for features/issue tracking
ServiceStack now hosts and tracks its new issues and feature requests on a 
[live public Trello dash board](https://trello.com/board/servicestack-features-bugs/4e9fbbc91065f8e9c805641c) where anyone 
is welcome to add to, or simply check the progress of their features/issues in the work queue.

## Special Thanks to Contributors
We now have a special [contributor page](https://github.com/ServiceStack/ServiceStack/blob/master/CONTRIBUTORS.md) 
and section on the [main project page](https://github.com/ServiceStack/ServiceStack) showing the many contributors to ServiceStack's 
projects over the years. We hope we haven't missed anyone out - please send us a pull request if you would like to be added.

###The major features in this release include:

## Redis MQ Client/Server
A redis-based message queue client/server that can be hosted in any .NET or ASP.NET application. The **RedisMqHost** lives in the
[ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis) project and brings the many benefits of using a Message Queue. 
The current unoptimized version uses only a single background thread although initial benchmarks shows it can
send/receive a promising **4.6k messages /sec** when accessing a local redis instance (on my dev workstation). 

Major kudos goes to [Redis](http://redis.io) which thanks to its versatility, has Pub/Sub and Lists primitives that makes implementing a Queue trivial.

The first version already sports the major features you've come to expect from a MQ: 

  - Each service maintains its own Standard and Priority MQ's
  - Automatic Retries on messages generating errors with Failed messages sent to a DLQ (Dead Letter Queue) when its Retry threshold is reached.
  - Each message can have a ReplyTo pointing to any Queue, alternatively you can even provide a ServiceStack endpoint URL which will 
    send the response to a Web Service instead. If the web service is not available it falls back into publishing it in the default 
    Response Queue so you never lose a message!
  - MQ/Web Services that don't return any output have their Request DTOs sent to a rolling **Out** queue which can be monitored 
    by external services (i.e. the publisher/callee) to determine when the request has been processed.

Although you can host **RedisMqHost** in any ASP.NET web app, the benefit of hosting inside ServiceStack is that your 
**web services are already capaable** of processing Redis MQ messages **without any changes required** since they're already effectively 
designed to work like a Message service to begin with, i.e. **C# POCO-in -> C# POCO-out**. 

This is another example of ServiceStack's prescribed DTO-first architecture continues to pay dividends since each web service is a DI clean-room 
allowing your **C# logic to be kept pure** as it only has to deal with untainted POCO DTOs, allowing your same web service to be re-used in: 
SOAP, REST (JSON,XML,JSV,CSV,HTML) web services, view models for dynamic HTML pages and now as a MQ service!

Eventually (based on feedback) there will be posts/documentation/examples forthcoming covering how to use it, in the meantime
you can [Check out the Messaging API](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageService.cs)
to see how simple it is to use. To see some some working code showing some of the capabilities listed above, 
[view the tests](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/RedisMqHostTests.cs).

Hooking up a basic send/reply example is as easy as:

```csharp
    //DTO messages:
    public class Hello { public string Name { get; set; } }
    public class HelloResponse { public string Result { get; set; } }

    var redisFactory = new PooledRedisClientManager("localhost:6379");
    var mqHost = new RedisMqHost(redisFactory, noOfRetries:2, null);

    //Server - MQ Service Impl:
    mqHost.RegisterHandler<Hello>(m =>
        new HelloResponse { Result = "Hello, " + m.GetBody().Name });
    mqHost.Start();

    ...

    //Client - Process Response:
    mqHost.RegisterHandler<HelloResponse>(m => {
        Consle.Log("Received: " + m.GetBody().Result);
    });
    mqHost.Start();

    ...
    
    //Producer - Start publishing messages:
    var mqClient = mqHost.CreateMessageQueueClient();
    mqClient.Publish(new Hello { Name = "ServiceStack" });
```

## JSON/JSV Serializers now supports Abstract/Interface and object types
We're happy to report the most requested feature for ServiceStack's JSON/JSV serializers is now available at:
[ServiceStack.Text v2.28](https://github.com/ServiceStack/ServiceStack.Text/downloads). 

The JSON and JSV Text serializers now support serializing and deserializing DTOs with **Interface / Abstract or object types**.
Amongst other things, this allows you to have an IInterface property which when serialized will include its concrete type information in a 
**__type** property field (similar to other JSON serializers) which when serialized populates an instance of that 
concrete type (provided it exists). 

Likewise you can also have polymorhic lists e.g. of a base **Animal** type and be populated with a **Cats** and **Dogs** which should now deserialize correctly.

As always performance was a primary objective when adding this feature and as a result we should have a very peformant implementation of it.

Note: This feature is **automatically** added to all **Abstract/Interface/Object** types, i.e. you **don't** need to include any 
`[KnownType]` attributes to take advantage of it.

## Other features/fixes:

  - Added JSON/JSV custom serialization behaviour injection of BCL value types in e.g: [JsConfig](https://github.com/ServiceStack/ServiceStack.Text/blob/master/src/ServiceStack.Text/JsConfig.cs#L16)
  - Serialization errors now return 400 status code
  - Add option to propagate errors instead of being sent in the response [Tymek Majewski](https://github.com/letssellsomebananas)
  - Added UserAgent to IHttpRequest type
  - Add useful overloads to HttpResult class
    - SetPermantentCookie/SetSessionCookie/SetCookie
    - LastModified 
  - Fix compression bug in `RequestContext.ToOptimizedResult()`
  - byte[] responses are written directly to the response stream with the ContentType: application/octet-stream

*****

##ServiceStack 2.20 Release Notes

### New Markdown Razor View Engine
The biggest feature in this release is the new Markdown support built-into ServiceStack and more
specifically its **Markdown Razor View Engine**. Markdown Razor is an MVC Razor-inspired templating 
engine that allows you to generate dynamic Markdown and HTML using plain Markdown and Razor Sytnax. 

View the new [Markdown Razor Introduction](http://www.servicestack.net/docs/markdown/markdown-razor) 
for more information.

### ServiceStack.Docs Website Released
The first website to take advantage of the new Markdown templating support in ServiceStack is
**[http://www.servicestack.net/docs](http://www.servicestack.net/docs)** which is effectively built entirely
using ServiceStack's GitHub project Markdown wiki and README.md pages. To render the entire website
the transformed Markdown content is merged with a static **default.shtml** website template.

A nice feature of a Markdown-enabled website is that since the Content is decoupled from the website
template we are easily able to enhance the site using Ajax to load partial content page loads. This
provides a faster browsing experience since the entire webpage doesn't have to be reloaded.

See the [About ServiceStack Docs Website](http://servicestack.net/docs/markdown/about) for more 
information.

### MonoTouch support in ServiceStack C# Clients
Support was added to the Generic JSON and JSV ServiceStack C# Clients to work around MonoTouch's
No-JIT Restrictions. Unfortunately to do this we've had to create a new MonoTouch Build 
configuration which doesn't use any C# Expressions or Reflection.Emit. So you need to download the
MonoTouch ServiceStack builds for running in MonoTouch. 
**[Download MonoTouch-v2.20.zip](https://github.com/ServiceStack/ServiceStack/tree/master/release/latest/MonoTouch)**

An example MonoTouch project that uses these Sync and Async C# ServiceClients to talk to the 
[RestFiles](https://www.servicestack.net/RestFiles/) web services is in the 
[RestFilesClient Example project](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/MonoTouch/RestFilesClient).

## Other Features

  - Added support for [IContainerAdapter](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Configuration/IContainerAdapter.cs) to let you [plug-in and use different IOC Containers](https://groups.google.com/d/topic/servicestack/A-W9scHaEBA/discussion)
  - Allow alternate strategies [for resolving Service Types](https://groups.google.com/d/topic/servicestack/Sb7Rcnhte-E/discussion)
  - If your IService implements IDisposable, it will be disposed straight after it's been executed.



## Download
* [**New users should download ServiceStack.Examples - v2.20**](https://github.com/ServiceStack/ServiceStack.Examples/downloads)
* [Existing users can download just the ServiceStack.dlls - v2.20](https://github.com/ServiceStack/ServiceStack/downloads)

.

Follow [@demisbellot](http://twitter.com/demisbellot) and [@ServiceStack](http://twitter.com/ServiceStack) for twitter updates

*****


#ServiceStack 2.09 Release Notes

## ServiceStack is now on NuGet!

As we have received a number of requests to provide NuGet packages for ServiceStack and its components, we're now happy to say we're now NuGet compliant! Where a configured and working ServiceStack web framework is just 1 NuGet command away :)

[![Install-Pacakage ServiceStack](http://servicestack.net/img/nuget-servicestack.png)](/nuget)

This will add the ServiceStack dlls to your standard VS.NET ASP.NET Web Application, Register ServiceStack handler in your Web.Config, configure your AppHost and create both a **[Hello](http://servicestack.net/ServiceStack.Hello/)** and a fully-operational **[TODO REST service](http://servicestack.net/Backbone.Todos/)**.

Together with just 2 static content files ([default.htm](https://github.com/ServiceStack/ServiceStack/blob/master/NuGet/ServiceStack/content/default.htm) and [jqunback-1.51.js](https://github.com/AjaxStack/AjaxStack)) you get a fully configured and working REST-ful application (*which as an aside benefit we hope encourages .NET developers into the [beautiful world of Backbone.js](http://documentcloud.github.com/backbone/) and Single Page Ajax Applications*).

The NuGet package of ServiceStack is essentially the **RootPath** Starter Template. The other starting templates, e.g. Windows Service, Console Hosts, hosting ServiceStack at custom /api paths are still available in the [ServiceStack.Examples downloads](https://github.com/ServiceStack/ServiceStack.Examples/downloads).

Check **[ServiceStack's NuGet page](/nuget)** for the full description of the available ServiceStack packages on NuGet.org

## ServiceStack Overview and Create REST services slides released!

Although this normally shouldn't warrant a release line item, for the technology focused - it's actually hard work :)
We believe the overview slides provide the best starting point for new developers looking to find out the benefits of ServiceStack and how they can easily develop REST services with it. Today, we're releasing the following 2 slides:

### [ServiceStack Overview and Features](https://docs.google.com/present/view?id=dg3mcfb_208gv3kcnd8)
[![Install-Pacakage ServiceStack](http://servicestack.net/img/slides-01-overview-300.png)](https://docs.google.com/present/view?id=dg3mcfb_208gv3kcnd8)

### [Creating REST Web Services](https://docs.google.com/present/view?id=dg3mcfb_213gsvvmmfk)
[![Install-Pacakage ServiceStack](http://servicestack.net/img/slides-02-create-rest-service-300.png)](https://docs.google.com/present/view?id=dg3mcfb_213gsvvmmfk)

## Better configuration

### ASP.NET MVC-like Route API to define user-defined REST paths

In your AppHost Configure() script you can register paths against your Request DTOs with the **Routes** property like so:

```csharp
    Routes
      .Add<Hello>("/hello")
      .Add<Hello>("/hello/{Name*}") 
      .Add<Todo>("/todos")
      .Add<Todo>("/todos/{Id}");    
```
This is an alternative to the `[RestService("/hello")]` attribute which was previously required on your Request DTOs.
They should work as expected, where any match will route that request to the designated service. All variables enclosed with `{Id}` will be populated on the selected Request DTO with that value of the path component. 

`Routes.Add<Hello>("/hello/{Name*}")` is a special case that matches every path beginning with **/hello/** where the **Hello** Request DTOs **Name** property is populated with the contents of the remaining url path. E.g. /hello/**any/path/here** will be populated in Hello.`{Name}` property.

### Disable ServiceStack-wide features

Sometimes the ServiceStack default of having all endpoints and formats all wired up correctly without any configuration is actually not preferred (we know, enterprises right? :), so in this release we've made it easy to turn on and off system-wide features using simple enum flags. To simplify configuration we also added some useful Enum extensions (Has,Is,Add,Remove) to make it easier to signal your intent with Enums. 

E.g. this is how you would disable 'JSV' and 'SOAP 1.1 & 1.2' endpoints:

    var disableFeatures = Feature.Jsv | Feature.Soap;
    SetConfig(new EndpointHostConfig
    {
        EnableFeatures = Feature.All.Remove(disableFeatures),
    });

*****

##ServiceStack 2.08 - ServiceStack meets Backbone.js

Unlike in previous releases, the ServiceStack framework itself has largely remained unchanged. This update is focused towards including [Backbone.js](http://documentcloud.github.com/backbone/) into ServiceStack.Examples project. 

[Backbone.js](http://documentcloud.github.com/backbone/) is a beautifully-designed and elegant light-weight JavaScript framework that allows you to build you're ajax applications separated into **Views** and **Models** connected via key-value data-binding and declarative custom event handling. Of special interest to us is its ability to supply a url and have it **automatically connect your Models** with your **Backend REST services**, which we're happy to report works well with ServiceStack's JSON services.

From the [author](http://twitter.com/jashkenas) of the popular and game-changing libraries [CoffeeScript](http://jashkenas.github.com/coffee-script/) and [Underscore.js](http://documentcloud.github.com/underscore/) - Backbone.js differentiates itself from other javascript frameworks in that it promotes a clean separation of concerns and a modular application design, which is hard to achieve with other frameworks that couple themselves too tightly with the DOM. 

## Backbone's TODO

Our first action was porting Backbone's example TODO app and replace its HTML5 localStorage backend with a ServiceStack REST + Redis one. This was quite easy to do and we were happy that [resulting C# server code for the REST backend](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/Backbone.Todos/Global.asax.cs) ended up weighing in at less than the size of VS.NET's default Web.config file :)

Like the rest of our examples a **[live demo is available](http://servicestack.net/Backbone.Todos/)**.

### TODO app now in all Starter templates

As the Backbone TODO app represented a small, but working REST client and server we decided to make it the default app in **all** of ServiceStack's Starter Templates. 

That's right, your Starting template for your **Enterprise Windows Service now comes with a useful TODO app out-of-the-box!** We rightfully believe this makes it the coolest app provided in any starting project template :)

## ServiceStack was built to serve Ajax applications

At this point it's a good time to re-iterate that ServiceStack was designed from the start to be a first-class Ajax server that provides best support for HTML5 Ajax/SPA apps, purely because we believe it to be the future application delivery platform that provides the broadest reach and best user experience possible. We've made special efforts to provide the [fastest JSON web services possible for .NET](http://www.servicestack.net/mythz_blog/?p=344), with a [first-class redis client](https://github.com/ServiceStack/ServiceStack.Redis) and a [strong caching story](/caching) important in developing high-performance web services and a responsive end user experience.

*****

## ServiceStack 2.07 - Q/A Release - Finding Web.Config Nirvana :)

This release was focused on finding the perfect Web.Config that best allows ServiceStack to work consistently everywhere across all ASP.NET and HttpListener hosts on both .NET and MONO platforms.
A primary goal of ServiceStack is to be able to build web services once and use the same binaries and App .config files to run everywhere in every ASP.NET or HttpListener host on Windows with .NET or on OSX/Linux with MONO.

Since your services are POCO message-based and only need to be implement an `IService<TRequest>` interface your services effectively operate in a *clean-room* [DDD Service](http://en.wikipedia.org/wiki/Domain-driven_design), and have a potential for re-use in a variety of other hosts, i.e. Message Queues, Windows services, Windows applications, etc.

### Running cross-platform
Although the promise of the .NET architecture allows for pure C# applications to run on every .NET platform, the ASP.NET hosts don't always share the same compatibility levels as there are subtle differences in implementation and behaviour amongst the various ASP.NET hosts. 

The only real way of ensuring ServiceStack runs well in each environment is to actually setup an environment on each host with each configuration we want to support. Unfortunately this time-consuming process is a necessary one in order to limit any new regressions from being introduced  as a result of added features.

## New ServiceStack Starter Templates projects released
So with that in mind, included in this release is the 'StartTemplates' solution providing the same Hello World Web service hosted in every supported mode and configurations.
There are now 2 supported modes in which to run ServiceStack:

##### a) Do not require an existing Web Framework - Host from the root path: `/`
##### b) Use ServiceStack with an existing Web Framework - Host web services at a user-defined: `/custompath`

### Starter Template projects

The new StarterTemplates in the [ServiceStack.Examples GitHub project](https://github.com/ServiceStack/ServiceStack.Examples/) provide a good starting template for each supported configuration below:

  * [.NET 3.5](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/ApiPath35) and [.NET 4.0](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/CustomPath40) - ASP.NET Custom Path: **/api** 
  * [.NET 3.5](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/RootPath35) and [.NET 4.0](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/RootPath40) - ASP.NET Root Path: **/**
  * [Windows Service w/ HttpListener](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/WinServiceAppHost)
  * [Stand alone Console App Host w/ HttpListener](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/StarterTemplates/ConsoleAppHost)

We're happy to report the above configurations are well supported on Windows with .NET visible by the **[Latest Windows Integration Test Reports](http://www.servicestack.net/testreports/2011-03-09_RunReports-Windows.htm)** showing ServiceStack running correctly on IIS 3.5,4.0/WebDev Server 2.0,4.0/Windows Service/Console Application hosts.

To deploy on MONO you can just XCOPY/SFTP the files across as-is (i.e. as compiled with VS.NET) to your Linux or OSX server. In most of the scenarios it works as-is however the integration tests have uncovered a couple of known issues visible in the **[Latest Linux Integration Test Reports](http://www.servicestack.net/testreports/2011-03-15_RunReports-Linux.htm)**.

### Known issues on MONO:

  * Depending on your setup a url with a trailing path '/' will cause Nginx/FastCGI or Apache/mod_mono to request a /default.aspx which if it doesn't exist will return a 404
  * If you want to use a custom path i.e. **/api** your ASP.NET virtual path also needs to start with your httpHandler path. Which is why an ASP.NET application hosted on **/ApiPath35/api** works as expected whilst one at **/CustomPath35/api** does not.
  

## Eating our own dogfood 
### ServiceStack.NET now running example projects on both Nginx/FastCGI and Apache/mod_mono on the same server 
  
With a few linux admin tweaks to add and assign a new virtual network interface with a new IP Address, we're easily able to run both Nginx/FastCGI and Apache/mod_mono HTTP servers on the same server, both configured to point to ServiceStack ASP.NET GitHub Example Projects.

Here are links to ServiceStack.Example projects on both Nginx and Apache:

  * [Nginx](http://www.servicestack.net/ServiceStack.Hello/) - [Apache](http://api.servicestack.net/ServiceStack.Hello/)         /ServiceStack.Hello
  * [Nginx](http://www.servicestack.net/RestFiles/)          - [Apache](http://api.servicestack.net/RestFiles/)                  /RestFiles/           
  * [Nginx](http://www.servicestack.net/RedisStackOverflow/) - [Apache](http://api.servicestack.net/RedisStackOverflow/)         /RedisStackOverflow/
  * [Nginx](http://www.servicestack.net/RedisStackOverflow/) - [Apache](http://api.servicestack.net/RedisStackOverflow/)         /RedisStackOverflow/
  * [Nginx](http://www.servicestack.net/ServiceStack.MovieRest/) - [Apache](http://api.servicestack.net/ServiceStack.MovieRest/) /ServiceStack.MovieRest/
  * [Nginx](http://www.servicestack.net/ServiceStack./) - [Apache](http://api.servicestack.net/ServiceStack.Northwind/)          /ServiceStack.Northwind/

We plan to create more wiki pages walking through how to setup your own ASP.NET web applications on Linux with MONO. 

If you have a preference on what hosting environment you would like to see ServiceStack running in (e.g. AppHarbor, Moncai, Amazon, Azure, SuseStudio, etc), we'd love to hear from you, please post your preference to [ServiceStack's Google Group](http://groups.google.com/group/servicestack)

*****

## ServiceStack v2.0

The ServiceStack code-base has gone under a re-structure to better support user contributions, testing, fine-grained deployments allowing hosting of ServiceStack in 32 and 64 bit servers, in medium or full trust hosting environments.

The changes from a high-level are:

  * No more ILMERGE.exe dlls, all ServiceStack .dlls now map 1:1 with a project of the same name
    * As a result all .pdb's for all assemblies are now included in each release to help debugging (this was lost using ILMERGE)
    * When not using OrmLite/Sqlite, ServiceStack is a full .NET managed assembly with no P/Invokes that can run in 32/64 bit hosts
  * All projects upgraded to VS.NET 2010 (min baseline is still .NET 3.5)
  * Non-core, high-level functionality has been moved into a new [ServiceStack.Contrib](https://github.com/ServiceStack/ServiceStack.Contrib)

## Breaking Changes
A lot of effort was made to ensure that clients would not be affected i.e. no code-changes should be required. 

As a result of the change to the deployment dlls where previously ServiceStack.dll was an ILMERGED combination of every implementation dll in ServiceStack. You will now need to explicitly reference each dll that you need. 

To help visualize the dependencies between the various components, here is a tree showing which dependencies each project has:

  * [ServiceStack.Text.dll](https://github.com/ServiceStack/ServiceStack.Text)
  * [ServiceStack.Interfaces.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Interfaces)

      * [ServiceStack.Common.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Common)

        * [ServiceStack.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack)
          * [ServiceStack.ServiceInterface.dll](https://github.com/ServiceStack/ServiceStack.Contrib/tree/master/src/ServiceStack.ServiceInterface)

        * [ServiceStack.Redis.dll](https://github.com/ServiceStack/ServiceStack.Redis)
        * [ServiceStack.OrmLite.dll](https://github.com/ServiceStack/ServiceStack.OrmLite)

*****

## ServiceStack 1.82 Release Notes

### [New HTML5 Report Format Added](/html5reportformat)

The biggest feature added in this release is likely the new HTML5 report format that generates a human-readable HTML view of your web services response when viewing it in a web browser.
Good news is, like the [CSV Format](/csv-format) it works with your existing webservices as-is, with no configuration or code-changes required.
  
[![HTML5 Report Format](http://servicestack.net/img/HTML5Format.png)](/html5reportformat)

Here are some results of web services created before the newer HTML5 and CSV formats existed:

  * **RedisStackOverflow** [Latest Questions](http://servicestack.net/RedisStackOverflow/questions)
  * **RestMovies** [All Movie listings](http://servicestack.net/ServiceStack.MovieRest/movies)
  * **RestFiles** [Root Directory](http://servicestack.net/RestFiles/files)

Use the **?format=[json|xml|html|csv|jsv]** to toggle and view the same webservice in different formats.

### New ServiceStack.Northwind Example project added

In order to be able to better demonstrate features with a 'real-world' DataSet, a new ServiceStack.Northwind project has been added which inspects the Northwind dataset from an SQLite database.
A live demo is hosted at [https://northwind.netcore.io](https://northwind.netcore.io). Here are some links below to better demonstrate the new HTML format with a real-world dataset:

#### Nortwind Database REST web services

  * [All Customers](https://northwind.netcore.io/customers) 
  * [Customer Detail](https://northwind.netcore.io/customers/ALFKI)
  * [Customer Orders](https://northwind.netcore.io/customers/ALFKI/orders)

### Improved Caching

ServiceStack has always had its own (i.e. ASP.NET implementation-free) [good support for caching](/caching), though like most un-documented features it is rarely used. The caching has been improved in this version to now support caching of user-defined formats as well. Here is example usage from the new Northwind project:

```csharp
    public class CachedCustomersService : RestServiceBase<CachedCustomers>
    {
        public ICacheClient CacheClient { get; set; }

        public override object OnGet(CachedCustomers request)
        {
            return base.RequestContext.ToOptimizedResultUsingCache(
                this.CacheClient, "urn:customers", () => {
                    var service = base.ResolveService<CustomersService>();
                        return (CustomersResponse) service.Get(new Customers());
                });
        }
    }
```

The above code caches the most optimal output based on browser capabilities, i.e. if your browser supports deflate compression (as most do), a deflated, serialized output is cached and written directly on the response stream for subsequent calls. Only if no cache exists will the web service implementation (e.g lambda) be executed, which populates the cache before returning the response.

To see the difference caching provides, here are cached equivalents of the above REST web service calls:

#### Nortwind Database **Cached** REST web services
  * [All Customers](https://northwind.netcore.io/cached/customers) 
  * [Customer Detail](https://northwind.netcore.io/cached/customers/ALFKI)
  * [Customer Orders](https://northwind.netcore.io/cached/customers/ALFKI/orders)


### API Changes

The underlying IHttpRequest (an adapter interface over ASP.NET/HttpListener HTTP Requests) can now be retrieved within your webservice to be able to query the different HTTP Request properties:

```csharp
    var httpReq = base.RequestContext.Get<IHttpRequest>();
```

Also added is the ability to resolve existing web services (already auto-wired by the IOC) so you can re-use existing web service logic. Here is an example of usage from the Northwind [CustomerDetailsService.cs](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/ServiceStack.Northwind/ServiceStack.Northwind.ServiceInterface/CustomerDetailsService.cs).
```csharp
    var ordersService = base.ResolveService<OrdersService>();
    var ordersResponse = (OrdersResponse)ordersService.Get(new Orders { CustomerId = customer.Id });
```

## ServiceStack 1.79 Release Notes

### The C#/.NET Sync and Async Service Clients were improved to include: 
  * Enhanced REST functionality and access, now more succinct than ever
  * Uploading of files to ServiceStack web services using **HTTP POST** *multipart/form-data*
  * More robust error handling support handling C# exceptions over REST services 
  * For examples of on how to use the C# REST client API check out the tests in the new REST Files project:
    * [Sync C# client examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/SyncRestClientTests.cs) 
    * [Async C# client examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/AsyncRestClientTests.cs)

## New RestFiles project added to [ServiceStack.Examples](https://github.com/ServiceStack/ServiceStack.Examples/) GitHub project:
#### Live demo available at: [servicestack.net/RestFiles/](http://servicestack.net/RestFiles/)

  * Provides a complete remote file system management over a [REST-ful api](http://servicestack.net/RestFiles/servicestack/metadata) 
  * The complete REST-ful /files web service implementation is only [**1 C# page class**](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.ServiceInterface/FilesService.cs)
  * Includes a pure ajax client to provide a **GitHub-like** file browsing experience, written in only [**1 static HTML page, using only jQuery**](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles/default.htm)
   * [C# integration test examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/) are also included showing how to access this REST-ful api over sync and async C# clients

Read the rest of the [Rest Files README.md](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/RestFiles/RestFiles) for a more detailed overview about the project.


## ServiceStack 1.78 Release Notes

 * Added more tests and fixed bugs in ServiceStack's new CSV format and Request/Response filters
 * Added new information on the generated web service index, individual web service page now include:
   * REST paths (if any are defined) thanks to [@jakescott](http://twitter.com/jakescott)
   * Included directions to consumers on how to override the HTTP **Accept** header and specify the **format**
   * Now including any System.CompontentModel.**Description** meta information attributed on your Request DTO
   * Preview the new documentation pages on ServiceStack [**Hello**](http://www.servicestack.net/ServiceStack.Hello/servicestack/json/metadata?op=Hello) and [**Movies**](http://www.servicestack.net/ServiceStack.MovieRest/servicestack/xml/metadata?op=Movie) example web service pages.
 * Added [tests to show how to implement Basic Authentication](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/RequestFiltersTests.cs) using the new RequestFilters
 * Changed the httpHandler paths in the Example projects and [created a new Config class](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.WebHost.Endpoints/SupportedHandlerMappings.cs) to store which supported mappings go with which web servers + middleware.
 * Provide a way to register new urls for different ServiceStack handler mappings used, e.g. to register IIS 6.0 urls:

       SetConfig(new EndpointConfig { ServiceEndpointsMetadataConfig = ServiceEndpointsMetadataConfig.GetForIis6ServiceStackAshx() });


## ServiceStack 1.77 Release Notes

This release was focused to opening up ServiceStack to better support adding more hooks and extension points where new formats can be added. The CSV format was also added to test these new extension APIs.

## Main features added in this release:

* Added support for the [CSV format](/csv-format)
* Enhanced the IContentTypeFilter API to add support for different serialization formats
* Added Request and Response filters so custom code can inspect and modify the incoming [IHttpRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceHost/IHttpRequest.cs) or [IHttpResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceHost/IHttpResponse.cs). 
* Added `Request.Items` so you can share arbitrary data between your filters and web services.
* Added `Request.Cookies` for reading cookies (to avoid retrieving it from HttpRuntime.Current)
* Removed the preceding UTF8 BOM character to ServiceStack's JSON and JSV Serializers. 
* All features above are available on both ASP.NET and HttpListener hosts

### [CSV Format](/csv-format)

Using the same tech that makes [ServiceStack's JSV and JSON serializers so fast](http://www.servicestack.net/benchmarks/NorthwindDatabaseRowsSerialization.100000-times.2010-08-17.html) (i.e. no run-time reflection, static delegate caching, etc), should make it the fastest POCO CSV Serializer available for .NET.

The 'CSV' format is the first format added using the new extensions API, which only took the following lines of code:
```csharp
    //Register the 'text/csv' content-type and serializers (format is inferred from the last part of the content-type)
    this.ContentTypeFilters.Register(ContentType.Csv,
        CsvSerializer.SerializeToStream, CsvSerializer.DeserializeFromStream);

    //Add a response filter to add a 'Content-Disposition' header so browsers treat it as a native .csv file
    this.ResponseFilters.Add((req, res, dto) =>
        {
            if (req.ResponseContentType == ContentType.Csv)
            {
                res.AddHeader(HttpHeaders.ContentDisposition,
                    string.Format("attachment;filename={0}.csv", req.OperationName));
            }
        });
```

With only the code above, the 'CSV' format is now a first-class supported format which means all your existing web services can take advantage of the new format without any config or code changes. Just drop the latest ServiceStack.dlls (v1.77+) and you're good to go! 

Note: there are some limitations on the CSV format and implementation which you can read about on the [ServiceStack CSV Format page](/csv-format).

### Request and Response Filters:

The Request filter takes a IHttpRequest, IHttpResponse and the **Request DTO**:

```csharp
    List<Action<IHttpRequest, IHttpResponse, object>> RequestFilters { get; }
```

The Response filter takes a IHttpRequest, IHttpResponse and the **Response DTO**:

```csharp 
    List<Action<IHttpRequest, IHttpResponse, object>> ResponseFilters{ get; }
```

Note: both sets of filters are called before there any output is written to the response stream so you can happily use the filters to authorize and redirect the request. Calling `IHttpResponse.Close()` will close the response stream and stop any further processing of this request.

Feel free to discuss or find more about any of these features at the [ServiceStack Google Group](https://groups.google.com/forum/#!forum/servicestack)


> [Wiki Home](https://github.com/ServiceStack/ServiceStack/wiki)
