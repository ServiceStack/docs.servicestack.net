---
slug: post-command
title: Post Command - HTTP API Command Line Utils
---

Post Command is a collection of command line utils that lets you easily discover, inspect and invoke ServiceStack endpoints from a single command.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="FcXG4RnlVQk" style="background-image: url('https://img.youtube.com/vi/FcXG4RnlVQk/maxresdefault.jpg')"></lite-youtube>

All command line utils are available in the latest [dotnet tool](/dotnet-tool) which can be installed from:

:::sh
dotnet tool install --global x 
:::

Or if you had a previous version installed, update with:

:::sh
dotnet tool update -g x
:::

## inspect command

The `inspect` command lets you inspect features and APIs available on a remote ServiceStack endpoint including the version of ServiceStack 
running, the App's registered Content Types, Plugins and Auth Providers as well as its public APIs, their routes and Response Types.

Use `x inspect` to display usage examples and available options:

```
Usage: x inspect <base-url>
       x inspect <base-url> <request>
       x inspect <base-url> <request> -lang <csharp|python|typescript|dart|java|kotlin|swift|fsharp|vbnet>
       x inspect <base-url> <request> -lang <cs|py|ts|da|ja|kt|sw|fs|vb>
```

### inspect ServiceStack App

This this command to display high-level information about the endpoint in a human-friendly format, e.g:

:::sh
x inspect https://techstacks.io
:::

Output:

```
Base URL:           https://techstacks.io
Name:               TechStacks!
Version:            5.111

Content Types:      application/json, application/xml, application/jsv, text/html, text/jsonreport, text/csv
Plugins:            html, csv, autoroutes, metadata, ssref, httpcache, svg, sharp, auth, sitemap, cors, validation, autoquerymeta, autoquery, openapi, session
Auth Providers:     twitter (oauth), github (oauth), jwt (Bearer), servicestack (credentials)

| #   | Api                             | Routes                                         | Response                                |
|-----|---------------------------------|------------------------------------------------|-----------------------------------------|
| 1   | Ping                            | /ping                                          |                                         |
| 2   | GetOrganization                 | GET:/orgs/{Id}                                 | GetOrganizationResponse                 |
| 3   | GetOrganizationBySlug           | GET:/organizations/{Slug}                      | GetOrganizationResponse                 |
| 4   | GetOrganizationMembers          | GET:/orgs/{Id}/members                         | GetOrganizationMembersResponse          |
| 5   | GetOrganizationAdmin            | GET:/orgs/{Id}/admin                           | GetOrganizationAdminResponse            |
| 6   | CreateOrganizationForTechnology | POST:/orgs/posts/new                           | CreateOrganizationForTechnologyResponse |
| 7   | CreateOrganization              | POST:/orgs                                     | CreateOrganizationResponse              |
| 8   | UpdateOrganization              | PUT:/orgs/{Id}                                 | UpdateOrganizationResponse              |
| 9   | DeleteOrganization              | DELETE:/orgs/{Id}                              |                                         |
| 10  | LockOrganization                | PUT:/orgs/{Id}/lock                            |                                         |
| 11  | AddOrganizationLabel            | POST:/orgs/{OrganizationId}/labels             | OrganizationLabelResponse               |
| 12  | UpdateOrganizationLabel         | PUT:/orgs/{OrganizationId}/members/{Slug}      | OrganizationLabelResponse               |
| 13  | RemoveOrganizationLabel         | DELETE:/orgs/{OrganizationId}/labels/{Slug}    |                                         |
| 14  | AddOrganizationCategory         | POST:/orgs/{OrganizationId}/categories         | AddOrganizationCategoryResponse         |
| 15  | UpdateOrganizationCategory      | PUT:/orgs/{OrganizationId}/categories/{Id}     | UpdateOrganizationCategoryResponse      |
| 16  | DeleteOrganizationCategory      | DELETE:/orgs/{OrganizationId}/categories/{Id}  |                                         |
| 17  | AddOrganizationMember           | POST:/orgs/{OrganizationId}/members            | AddOrganizationMemberResponse           |
| 18  | UpdateOrganizationMember        | PUT:/orgs/{OrganizationId}/members/{Id}        | UpdateOrganizationMemberResponse        |
| 19  | RemoveOrganizationMember        | DELETE:/orgs/{OrganizationId}/members/{UserId} |                                         |
| 20  | SetOrganizationMembers          | POST:/orgs/{OrganizationId}/members/set        | SetOrganizationMembersResponse          |
| 21  | GetOrganizationMemberInvites    | GET:/orgs/{OrganizationId}/invites             | GetOrganizationMemberInvitesResponse    |
| 22  | RequestOrganizationMemberInvite | POST:/orgs/{OrganizationId}/invites            | RequestOrganizationMemberInviteResponse |
| 23  | UpdateOrganizationMemberInvite  | PUT:/orgs/{OrganizationId}/invites/{UserId}    | UpdateOrganizationMemberInviteResponse  |
| 24  | QueryPosts                      | GET:/posts                                     | QueryResponse<Post>                     |
| 25  | GetPost                         | GET:/posts/{Id}                                | GetPostResponse                         |
| 26  | CreatePost                      | POST:/posts                                    | CreatePostResponse                      |
| 27  | UpdatePost                      | PUT:/posts/{Id}                                | UpdatePostResponse                      |
| 28  | DeletePost                      | DELETE:/posts/{Id}                             | DeletePostResponse                      |
| 29  | LockPost                        | PUT:/posts/{Id}/lock                           |                                         |
| 30  | HidePost                        | PUT:/posts/{Id}/hide                           |                                         |

...
```

Routes with an associated HTTP Verb, e.g. `GET:/technology` only allows access with that specific verb, if unspecified any verb can be used.

### inspect API

Adding an API Name to the command will let you describe a specific API Endpoint to learn more about its features, restrictions & capabilities, e.g:

:::sh
x inspect https://techstacks.io LockTechStack
:::

Which will output the APIs description, any tags it was annotated with, its defined routes as well as any Auth Requirements along with all the 
available Auth Providers registered, e.g:

```csharp
# LockTechStack
Limit updates to TechStack to Owner or Admin users

Tags:               [TechStacks]
Routes:             /admin/techstacks/{TechnologyStackId}/lock

# Requires Auth
Auth Providers:     twitter (oauth), github (oauth), jwt (Bearer), servicestack (credentials)
Roles:              Admin


# C# DTOs:


using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ServiceStack;
using ServiceStack.DataAnnotations;


public partial class LockStackResponse
{
}

///<summary>
///Limit updates to TechStack to Owner or Admin users
///</summary>
[Route("/admin/techstacks/{TechnologyStackId}/lock")]
public partial class LockTechStack
    : IReturn<LockStackResponse>, IPut
{
    [Validate("GreaterThan(0)")]
    public virtual long TechnologyStackId { get; set; }

    public virtual bool IsLocked { get; set; }
}
```

Whilst the C# code defines the API Service Contract including any user-defined routes, its Response Type, what HTTP Verb it should be called with as well as any declarative validation rules when defined. The properties on the Request DTO define the Typed Inputs that the API Accepts whilst the Response DTO describes what a successful Response will return.

### View all Referenced DTOs

Only the Request and Response DTOs representing the APIs Inputs and Outputs are displayed by default, to include all referenced types you can use the [IncludeTypes syntax](/csharp-add-servicestack-reference#include-request-dto-and-its-dependent-types), e.g:

:::sh
x inspect https://techstacks.io GetTechnology.*
:::

Which will include all referenced types used in this API:

```csharp
# GetTechnology
Tags:               [Tech]
Routes:             /technology/{Slug}

# C# DTOs:


using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ServiceStack;
using ServiceStack.DataAnnotations;


[Route("/technology/{Slug}")]
public partial class GetTechnology
    : IReturn<GetTechnologyResponse>, IRegisterStats, IGet
{
    public virtual string Slug { get; set; }
}

public partial class GetTechnologyResponse
{
    public GetTechnologyResponse()
    {
        TechnologyStacks = new List<TechnologyStack>{};
    }

    public virtual DateTime Created { get; set; }
    public virtual Technology Technology { get; set; }
    public virtual List<TechnologyStack> TechnologyStacks { get; set; }
    public virtual ResponseStatus ResponseStatus { get; set; }
}

public partial interface IRegisterStats
{
}

public partial class Technology
    : TechnologyBase
{
}

public partial class TechnologyBase
{
    public virtual long Id { get; set; }
    public virtual string Name { get; set; }
    public virtual string VendorName { get; set; }
    public virtual string VendorUrl { get; set; }
    public virtual string ProductUrl { get; set; }
    public virtual string LogoUrl { get; set; }
    public virtual string Description { get; set; }
    public virtual DateTime Created { get; set; }
    public virtual string CreatedBy { get; set; }
    public virtual DateTime LastModified { get; set; }
    public virtual string LastModifiedBy { get; set; }
    public virtual string OwnerId { get; set; }
    public virtual string Slug { get; set; }
    public virtual bool LogoApproved { get; set; }
    public virtual bool IsLocked { get; set; }
    public virtual TechnologyTier Tier { get; set; }
    public virtual DateTime? LastStatusUpdate { get; set; }
    public virtual int? OrganizationId { get; set; }
    public virtual long? CommentsPostId { get; set; }
    public virtual int ViewCount { get; set; }
    public virtual int FavCount { get; set; }
}

public partial class TechnologyStack
    : TechnologyStackBase
{
}

public partial class TechnologyStackBase
{
    public virtual long Id { get; set; }
    public virtual string Name { get; set; }
    public virtual string VendorName { get; set; }
    public virtual string Description { get; set; }
    public virtual string AppUrl { get; set; }
    public virtual string ScreenshotUrl { get; set; }
    public virtual DateTime Created { get; set; }
    public virtual string CreatedBy { get; set; }
    public virtual DateTime LastModified { get; set; }
    public virtual string LastModifiedBy { get; set; }
    public virtual bool IsLocked { get; set; }
    public virtual string OwnerId { get; set; }
    public virtual string Slug { get; set; }
    [StringLength(int.MaxValue)]
    public virtual string Details { get; set; }

    [StringLength(int.MaxValue)]
    public virtual string DetailsHtml { get; set; }

    public virtual DateTime? LastStatusUpdate { get; set; }
    public virtual int? OrganizationId { get; set; }
    public virtual long? CommentsPostId { get; set; }
    public virtual int ViewCount { get; set; }
    public virtual int FavCount { get; set; }
}

public enum TechnologyTier
{
    ProgrammingLanguage,
    Client,
    Http,
    Server,
    Data,
    SoftwareInfrastructure,
    OperatingSystem,
    HardwareInfrastructure,
    ThirdPartyServices,
}
```

Thanks to ServiceStack's [unique message-based design](https://youtu.be/Vae0ALalIP0) the code contract used to define the Service is also all that's needed to invoke the API along with the generic ServiceStack Client library which for .NET is available in the **ServiceStack.Client** NuGet package:

:::sh
dotnet add package ServiceStack.Client
:::

Which together with the above C# DTOs enables its optimal end-to-end typed API:

```csharp
var client = new JsonServiceClient("https://techstacks.io");

client.Send(new LockTechStack { TechnologyStackId = id, IsLocked = true });
```

Request DTOs annotated with an `IVerb` interface marker (e.g. `IPut`) can instead use `Send()` to invoke the API with that HTTP Verb.

This same simplified usage scenario is also available in each of [Add ServiceStack Reference](/add-servicestack-reference) supported Languages:

 - [C#](/csharp-add-servicestack-reference)
 - [Python](/python-add-servicestack-reference)
 - [TypeScript](/typescript-add-servicestack-reference)
 - [Dart](/dart-add-servicestack-reference)
 - [Java](/java-add-servicestack-reference)
 - [Kotlin](/kotlin-add-servicestack-reference)
 - [Swift](/swift-add-servicestack-reference)
 - [F#](/fsharp-add-servicestack-reference)
 - [VB.NET](/vbnet-add-servicestack-reference)

Where the `-lang` option can be used to change what language to return the DTO Types in:

```
Usage: x inspect <base-url> <request> -lang <csharp|python|typescript|dart|java|kotlin|swift|fsharp|vbnet>
       x inspect <base-url> <request> -lang <cs|py|ts|da|ja|kt|sw|fs|vb>
```

For example to view the DTOs in Swift run:

:::sh
x inspect https://techstacks.io LockTechStack -lang swift
:::

Output:

```swift
# LockTechStack
Limit updates to TechStack to Owner or Admin users

Tags:               [TechStacks]
Routes:             /admin/techstacks/{TechnologyStackId}/lock

# Requires Auth
Auth Providers:     twitter (oauth), github (oauth), jwt (Bearer), servicestack (credentials)
Roles:              Admin


# Swift DTOs:


import Foundation
import ServiceStack

/**
* Limit updates to TechStack to Owner or Admin users
*/
// @Route("/admin/techstacks/{TechnologyStackId}/lock")
public class LockTechStack : IReturn, IPut, Codable
{
    public typealias Return = LockStackResponse

    // @Validate(Validator="GreaterThan(0)")
    public var technologyStackId:Int?

    public var isLocked:Bool?

    required public init(){}
}

public class LockStackResponse : Codable
{
    required public init(){}
}
```

## send - Invoking APIs

In addition to being able to invoke ServiceStack APIs natively in each supported language, they can also be invoked with just a single command-line.

Running `x send` will display different example usage of this versatile tool which supports most of 
[ServiceStack's Authentication options](/auth/authentication-and-authorization):

```
Usage: x <send|GET|POST|PUT|DELETE|PATCH> <base-url> <request>
       x <send|GET|POST|PUT|DELETE|PATCH> <base-url> <request> {js-object}
       x <send|GET|POST|PUT|DELETE|PATCH> <base-url> <request> < body.json

Options:
 -raw                   Show raw HTTP Headers and Body
 -json                  Show Body as JSON
 -token <token>         Use JWT or API Key Bearer Token
 -basic <user:pass>     Use HTTP Basic Auth
 -authsecret <secret>   Use Admin Auth Secret
 -ss-id <session-id>    Use ss-id Session Id Cookie
 -cookies <file>        Store and Load Cookies from file
```

HTTP APIs can be invoked with a specific HTTP Verb or **send** which will use the APIs preferred HTTP Method when it can be inferred e.g. Request DTO is annotated with `IVerb` interface marker or its implementation uses a HTTP Verb method name instead of `Any()`.

### UI for generating post commands

Whilst the syntax for invoking APIs from the command line should be fairly intuitive, you may benefit from using the UI in [apps.servicestack.net](https://apps.servicestack.net) to craft the initial API call that can be copied by clicking the copy icon from **Invoke API from command line** command:

[![](./img/pages/apps/post-command-ui.png)](https://apps.servicestack.net/#techstacks.io/csharp/AutoQuery/FindTechnologies(Ids:[1,2,3],VendorName:Google,Take:5,Fields:%22Id,%20Name,%20VendorName,%20Slug,%20Tier,%20FavCount,%20ViewCount%22))

This is quick way for using a UI to bootstrap the initial post command that you can continue iterating on and invoking locally.

::: info
[apps.servicestack.net](https://apps.servicestack.net) requires your remote ServiceStack App is accessible from the Internet
:::

### Invoking APIs without arguments

APIs that don't require arguments can be invoked with just their names, e.g. we can invoke the [GetLocations](https://covid-vac-watch.netcore.io/json/metadata?op=GetLocations)
Covid 19 Vaccine Watch API with either:

```bash
x send https://covid-vac-watch.netcore.io GetLocations
x GET https://covid-vac-watch.netcore.io GetLocations
```

Output:

```
locations:
  Alabama
  Alaska
  American Samoa
  Arizona
  Arkansas
  Bureau of Prisons
  California
  Colorado
  Connecticut
  Delaware
  Dept of Defense
  District of Columbia
  Federated States of Micronesia
  Florida
  Georgia
  ...
```

By default APIs return a human friendly text output optimal for reading at a glance. 

### json Response output

Alternatively use `-json` if you're only interested in viewing the JSON response, e.g:

:::sh
x send https://covid-vac-watch.netcore.io GetLocations -json
:::

Output:

```json
{"locations":["Alabama","Alaska","American Samoa","Arizona","Arkansas","Bureau of Prisons","California","Colorado","Connecticut","Delaware","Dept of Defense","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indian Health Svc","Indiana","Iowa","Kansas","Kentucky","Long Term Care","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York State","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Republic of Palau","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","United States","Utah","Vermont","Veterans Health","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]}
```

This is useful if you want to capture the results in a `.json` text file for inspection with other JSON aware tools:

:::sh
x send https://covid-vac-watch.netcore.io GetLocations -json > results.json
:::

[jq](https://stedolan.github.io/jq/) is a popular command-line tool for querying JSON outputs that's useful for inspecting the JSON response of one command to chain using it in others. A useful usecase is for parse an `AuthenticateResponse` to capture the JWT `bearerToken` property with `jq -r .bearerToken`:

```bash
TOKEN=$(x send http://test.servicestack.net Authenticate "{provider:'credentials',username:'admin',password:'test'}" -json | jq -r .bearerToken)
```

Then using it to make stateless Authenticated requests, e.g:

:::sh
x send -token $TOKEN http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

```
result:  Hello, World!
```

### raw HTTP output

If preferred you can instead view the full HTTP Response including HTTP Headers by adding the `-raw` flag, e.g:

:::sh
x send https://covid-vac-watch.netcore.io GetLocations -raw
:::

Output:

```
GET /json/reply/GetLocations HTTP/1.1
Host: covid-vac-watch.netcore.io
Accept: application/json

HTTP/1.1 200 OK
Server: nginx/1.19.3
Date: Wed, 28 Jul 2021 07:39:34 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Vary: Accept
X-Powered-By: ServiceStack/5.111 NetCore/Linux
Strict-Transport-Security: max-age=31536000
Content-Type: application/json; charset=utf-8

{"locations":["Alabama","Alaska","American Samoa","Arizona","Arkansas","Bureau of Prisons","California","Colorado","Connecticut","Delaware","Dept of Defense","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indian Health Svc","Indiana","Iowa","Kansas","Kentucky","Long Term Care","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York State","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Republic of Palau","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","United States","Utah","Vermont","Veterans Health","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]}
```

### Using Rider HTTP Scratch Tools

A productive way to further re-iterate on the HTTP Request is to copy+paste the HTTP Request Header into JetBrains Rider’s HTTP Rest tool where you can run it and customize it using their text editor UI by going to **New Scratch File** and selecting **HTTP Request** or via `Tools > HTTP Client > Create Request in HTTP Client`:

![](./img/pages/apps/post-command-httpscratch-GetLocations.png)

### Invoking APIs with Arguments

To invoke an API with arguments we can use a JavaScript Object Literal which allows a wrist-friendly syntax for invoking any API including rich [AutoQuery APIs](https://servicestack.net/autoquery) which thanks to its human friendly output allows quickly inferring Query result-sets from a glance, e.g:

#### Quote Arguments in Unix Shells

Since JavaScript operators have special meaning in Unix shells you'd need to wrap the object literal in double quotes to have the shell pass it verbatim to the command tool without evaluating it, e.g:

Windows / Linux / macOS:

:::sh
x send https://techstacks.io FindTechnologies "{Ids:[1,2,6],VendorName:'Google',Take:1}"
:::

Windows Only:

:::sh
x send https://techstacks.io FindTechnologies {Ids:[1,2,6],VendorName:'Google',Take:1}
:::

So requests that doesn't use any special batch characters can be sent with or without quotes. An alternative way to by pass the shell is to redirect a JSON Request body instead, e.g:

:::sh
x send https://techstacks.io FindTechnologies < FindTechnologies.json
:::

#### Last 5 Recorded Dates of Vaccinated people in Alaska

```bash
x send https://covid-vac-watch.netcore.io QueryVaccinationRates "{Location:'Alaska',orderBy:'-date',take:5,Fields:'id,date,peopleVaccinated',include:'total'}"
```

Output:

```
offset:   0
total:    195

results:
| # | id    | date                        | peopleVaccinated |
|---|-------|-----------------------------|------------------|
| 1 | 12308 | 2021-07-25T00:00:00.0000000 |           372940 |
| 2 | 12307 | 2021-07-24T00:00:00.0000000 |           372902 |
| 3 | 12306 | 2021-07-23T00:00:00.0000000 |           372132 |
| 4 | 12305 | 2021-07-22T00:00:00.0000000 |           371514 |
| 5 | 12304 | 2021-07-21T00:00:00.0000000 |           371062 |
```

#### Multi conditional TechStacks query

```bash
x send https://techstacks.io FindTechnologies "{Ids:[1,2,6],VendorName:'Google',Take:10,Fields:'Id,Name,VendorName,Tier,FavCount,ViewCount'}"
```

Output:

```
offset:   0
total:    18

results:
| #  | id | name                   | vendorName   | tier                   | viewCount | favCount |
|----|----|------------------------|--------------|------------------------|-----------|----------|
| 1  |  1 | ServiceStack           | ServiceStack | Server                 |      4204 |        5 |
| 2  |  2 | PostgreSQL             | PostgreSQL   | Data                   |      2291 |        4 |
| 3  |  6 | AWS RDS                | Amazon       | Data                   |       625 |        1 |
| 4  |  7 | AngularJS              | Google       | Client                 |      5012 |        1 |
| 5  | 13 | Google Closure Library | Google       | Client                 |       390 |        1 |
| 6  | 15 | Dart                   | Google       | ProgrammingLanguage    |       320 |        2 |
| 7  | 18 | Go                     | Google       | ProgrammingLanguage    |      3865 |        2 |
| 8  | 57 | LevelDB                | Google       | Data                   |       325 |        1 |
| 9  | 61 | Firebase               | Google       | Data                   |       722 |        1 |
| 10 | 72 | Google Cloud Platform  | Google       | HardwareInfrastructure |       269 |        1 |
```

### Invoking Complex APIs

As ServiceStack APIs supports [nested complex types in query strings](/routing#populating-complex-type-properties-on-querystring) the JS Object Request body will be able to scale to execute even deeply complicated API requests in both HTTP Methods without Request Bodies, e.g:

#### Example GET Request

```bash
x GET http://test.servicestack.net StoreLogs "{Loggers:[{Id:786,Devices:[{Id:5955,Type:'Panel',TimeStamp:1,Channels:[{Name:'Temperature',Value:'58'},{Name:'Status',Value:'On'}]}]}]}" -raw
```

Where they're sent on the query string:

```
GET /json/reply/StoreLogs?Loggers=%5b%7bId%3a786,Devices%3a%5b%7bId%3a5955,Type%3aPanel,TimeStamp%3a1,Channels%3a%5b%7bName%3aTemperature,Value%3a58%7d,%7bName%3aStatus,Value%3aOn%7d%5d%7d%5d%7d%5d HTTP/1.1
Host: test.servicestack.net
Accept: application/json

HTTP/1.1 200 OK
Server: nginx/1.18.0, (Ubuntu)
Date: Wed, 28 Jul 2021 07:40:26 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: ss-id=nt6W8DDHatjwf0kToEUa; path=/; samesite=strict; httponly, ss-pid=GsP8tmccacQn0fH8vOAD; expires=Sun, 28 Jul 2041 07:40:26 GMT; path=/; samesite=strict; httponly
Vary: Accept
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Allow, Authorization, X-Args
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
X-Powered-By: ServiceStack/5.111 NetCore/Linux
Content-Type: application/json; charset=utf-8

{"existingLogs":[{"id":786,"devices":[{"id":5955,"type":"Panel","timeStamp":1,"channels":[{"name":"Temperature","value":"58"},{"name":"Status","value":"On"}]}]}]}
```

#### Example POST Request

As well as HTTP Requests with Request bodies where only the method used needs to change whilst the Request JS Object literal stays exactly the same, e.g:

```bash
x POST http://test.servicestack.net StoreLogs "{Loggers:[{Id:786,Devices:[{Id:5955,Type:'Panel',TimeStamp:1,Channels:[{Name:'Temperature',Value:'58'},{Name:'Status',Value:'On'}]}]}]}" -raw
```

Where instead of being sent on the query string it's posted inside a JSON Request body, irrespective of how its sent a ServiceStack API supporting any HTTP Method by being implemented with the `Any()` method name will result in an identical response:

```
POST /json/reply/StoreLogs HTTP/1.1
Host: test.servicestack.net
Accept: application/json
Content-Type: application/json
Content-Length: 157

{"Loggers":[{"Id":786,"Devices":[{"Id":5955,"Type":"Panel","TimeStamp":1,"Channels":[{"Name":"Temperature","Value":"58"},{"Name":"Status","Value":"On"}]}]}]}

HTTP/1.1 200 OK
Server: nginx/1.18.0, (Ubuntu)
Date: Wed, 28 Jul 2021 07:40:54 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: ss-id=X1BmXXrr9vr5DIpAoxFM; path=/; samesite=strict; httponly, ss-pid=J8kDBiJ37WEOnywRdGMS; expires=Sun, 28 Jul 2041 07:40:54 GMT; path=/; samesite=strict; httponly
Vary: Accept
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Allow, Authorization, X-Args
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
X-Powered-By: ServiceStack/5.111 NetCore/Linux
Content-Type: application/json; charset=utf-8

{"existingLogs":[{"id":786,"devices":[{"id":5955,"type":"Panel","timeStamp":1,"channels":[{"name":"Temperature","value":"58"},{"name":"Status","value":"On"}]}]}]}
```

#### Redirected Input Example 

For requests that get significantly large it may be more convenient to maintain the request body in a separate file that you can pipe into the command instead, e.g:

:::sh
x send http://test.servicestack.net StoreLogs -raw < StoreLogs.json
:::

Output:
```
POST /json/reply/StoreLogs HTTP/1.1
Host: test.servicestack.net
Accept: application/json
Content-Type: application/json
Content-Length: 157

{"Loggers":[{"Id":786,"Devices":[{"Id":5955,"Type":"Panel","TimeStamp":1,"Channels":[{"Name":"Temperature","Value":"58"},{"Name":"Status","Value":"On"}]}]}]}

HTTP/1.1 200 OK
Server: nginx/1.18.0, (Ubuntu)
Date: Wed, 28 Jul 2021 07:41:38 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: ss-id=kScY3mYF06e3iuPaCnaD; path=/; samesite=strict; httponly, ss-pid=hpbimtl9dIWA1IbJPMXN; expires=Sun, 28 Jul 2041 07:41:38 GMT; path=/; samesite=strict; httponly
Vary: Accept
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Allow, Authorization, X-Args
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
X-Powered-By: ServiceStack/5.111 NetCore/Linux
Content-Type: application/json; charset=utf-8

{"existingLogs":[{"id":786,"devices":[{"id":5955,"type":"Panel","timeStamp":1,"channels":[{"name":"Temperature","value":"58"},{"name":"Status","value":"On"}]}]}]}
```

Remove the `-raw` option to display the response in a more human-friendly readable format:

:::sh
x send http://test.servicestack.net StoreLogs < StoreLogs.json
:::

Output:
```
[existingLogs]
id:       786

[devices]
id:         5955
type:       Panel
timeStamp:  1

channels:
| # | name        | value |
|---|-------------|-------|
| 1 | Temperature | 58    |
| 2 | Status      | On    |
```

## Authentication

To support making Authenticated Requests most of ServiceStack's built-in Authentication Options are supported from the options below:

```
Options:
 -token <token>         Use JWT or API Key Bearer Token
 -basic <user:pass>     Use HTTP Basic Auth
 -authsecret <secret>   Use Admin Auth Secret
 -ss-id <session-id>    Use ss-id Session Id Cookie
 -cookies <file>        Store and Load Cookies from file
```

Since Username/Password Credentials Auth is a normal ServiceStack API we can invoke it like normal, e.g:

:::sh
x send http://test.servicestack.net Authenticate "{provider:'credentials',username:'admin',password:'test'}"
:::

However to hide your credentials from command history logs you'll likely want to maintain your credentials in a separate file, e.g:

:::sh
x send http://test.servicestack.net Authenticate < auth.json
:::

Which if successful will return a populated human-friendly `AuthenticateResponse`:

```
userId:          2
sessionId:       QfJLhmd8XQxeuAIqvoCY
userName:        admin
displayName:     admin DisplayName
bearerToken:     eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjNuLyJ9.eyJzdWIiOjIsImlhdCI6MTYyNzM4MjY5NiwiZXhwIjoxNjI4NTkyMjk2LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJGaXJzdCBhZG1pbiIsImZhbWlseV9uYW1lIjoiTGFzdCBhZG1pbiIsIm5hbWUiOiJhZG1pbiBEaXNwbGF5TmFtZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiQWRtaW4iXSwianRpIjozfQ.j80f1KYsNRDhygO817NSaqYg7DIR1ptLZQUB1mZd_R8
refreshToken:    eyJ0eXAiOiJKV1RSIiwiYWxnIjoiSFMyNTYiLCJraWQiOiIzbi8ifQ.eyJzdWIiOjIsImlhdCI6MTYyNzM4MjY5NiwiZXhwIjoxNjU4OTE4Njk2LCJqdGkiOi0zfQ.nkwDYvmB5_QHm6hmVv8Thfl2Iz8W_LUDf6bspb-Nu2c
profileUrl:      data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E %3Cstyle%3E .path%7B%7D %3C/style%3E %3Cg id='male-svg'%3E%3Cpath fill='%23556080' d='M1 92.84V84.14C1 84.14 2.38 78.81 8.81 77.16C8.81 77.16 19.16 73.37 27.26 69.85C31.46 68.02 32.36 66.93 36.59 65.06C36.59 65.06 37.03 62.9 36.87 61.6H40.18C40.18 61.6 40.93 62.05 40.18 56.94C40.18 56.94 35.63 55.78 35.45 47.66C35.45 47.66 32.41 48.68 32.22 43.76C32.1 40.42 29.52 37.52 33.23 35.12L31.35 30.02C31.35 30.02 28.08 9.51 38.95 12.54C34.36 7.06 64.93 1.59 66.91 18.96C66.91 18.96 68.33 28.35 66.91 34.77C66.91 34.77 71.38 34.25 68.39 42.84C68.39 42.84 66.75 49.01 64.23 47.62C64.23 47.62 64.65 55.43 60.68 56.76C60.68 56.76 60.96 60.92 60.96 61.2L64.74 61.76C64.74 61.76 64.17 65.16 64.84 65.54C64.84 65.54 69.32 68.61 74.66 69.98C84.96 72.62 97.96 77.16 97.96 81.13C97.96 81.13 99 86.42 99 92.85L1 92.84Z'/%3E%3C/g%3E%3C/svg%3E

[roles]
Admin
```

### Authentication -cookies

Likely the easiest and most versatile authentication option would be to use a separate cookies file where it will load and save cookies after each request allowing each request to be made within the context of the same authenticated session as done in browsers, e.g:

:::sh
x send -cookies cookies.xml http://test.servicestack.net Authenticate < auth.json
:::

We can test that it's working by first trying to call an Authentication protected Service without any Authentication options, e.g:

:::sh
x send http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

```
The remote server returned an error: (401) Not Authenticated.
```

Then re-trying the request, providing the **cookies.xml** that was populated after the success Authentication:

:::sh
x send -cookies cookies.xml http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

```
result:  Hello, World!
```

The `-cookies` Authentication option is the most versatile as it supports standard [Server Sessions](/auth/sessions) as well as stateless Authentication options like [JWT Auth configured with Token Cookies](/auth/jwt-authprovider#enable-server-cookies) where the JWT Bearer Token is maintained in a cookie.

### Authentication -token

The `-token` Authentication option should be used when authenticating with Bearer Tokens like [JWT](/auth/jwt-authprovider) or [API Key](/auth/api-key-authprovider) Auth Providers. 
When the `JwtAuthProvider` is configured a successful Authentication Response will return a populated **bearerToken** which we can use to authenticate with instead. As Bearer Tokens can become quite verbose you may want to choose to save in a shell environment variable instead, e.g:

**Windows:**

```bash
set TOKEN=...
x send -token %TOKEN% http://test.servicestack.net HelloSecure {name:'World'}
```

**Linux / macOS:**

```bash
TOKEN=...
x send -token $TOKEN http://test.servicestack.net HelloSecure "{name:'World'}"
```

Output:

```
result:  Hello, World!
```

### Capturing bearerToken with `#Script` expression

A dependency-free solution for capturing the `bearerToken` is to utilize the [#Script](https://sharpscript.net) eval expression support in `x` to make an API Request and parsing the JSON response and parsing it with #Script methods, e.g:

```bash
TOKEN=$(x -e "'http://test.servicestack.net/auth' |> urlTextContents({method:'POST',accept:'application/json',data:'provider=credentials&username=admin&password=test'}) |> parseJson |> get('bearerToken')")
```

Then using it to make stateless Authenticated requests, e.g:

:::sh
x send -token $TOKEN http://test.servicestack.net HelloSecure "{name:'World'}"
:::

### Capturing bearerToken with jq

[jq](https://stedolan.github.io/jq/) is a versatile command for extracting info from JSON outputs which can extract the raw string "bearerToken" property value of an `AuthenticateResponse` with `jq -r .bearerToken`, e.g:

```bash
TOKEN=$(x send http://test.servicestack.net Authenticate "{provider:'credentials',username:'admin',password:'test'}" -json | jq -r .bearerToken)
```

### Inspect JWTs

When working with JWTs it can be useful to quickly inspect its contents which we can do with `inspect-jwt`:

```
Usage: x inspect-jwt <jwt>
       x inspect-jwt < file.txt
```

Which we can use with the populated **bearerToken** above to inspect the contents of the JWT in a human-friendly format, e.g:

    $ x inspect-jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjNuLyJ9.eyJzdWIiOjIsImlhdCI6MTYyNjg0OTEzMCwiZXhwIjoxNjI4MDU4NzMwLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJGaXJzdCBhZG1pbiIsImZhbWlseV9uYW1lIjoiTGFzdCBhZG1pbiIsIm5hbWUiOiJhZG1pbiBEaXNwbGF5TmFtZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiQWRtaW4iXSwianRpIjo5fQ.uLp_QkmBo6J6TlXiUPl0Iq6TkTbF0xzncbUI1HmDro4

Output:

```
[JWT Header]
typ:  JWT
alg:  HS256
kid:  3n/


[JWT Payload]
sub:                 2
iat:                 1626849130 (Wed, 21 Jul 2021 06:32:10 GMT)
exp:                 1628058730 (Wed, 04 Aug 2021 06:32:10 GMT)
email:               admin@gmail.com
given_name:          First admin
family_name:         Last admin
name:                admin DisplayName
preferred_username:  admin

[roles]
Admin

jti:                 9
```

### Authentication -basic

When the `BasicAuthProvider` is configured we can authenticate with HTTP Basic Auth using the `-basic` command line option which supports both clear text:

:::sh
x send -basic admin:test http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

:::sh
x send -basic admin:test http://test.servicestack.net HelloSecure "{name:'World'}"
:::

As well as Base64 encoded credentials which we can convert using the `x base64` tool, e.g:

:::sh
x base64 admin:test
:::

Output:

```
YWRtaW46dGVzdA==
```

:::sh
x send -basic YWRtaW46dGVzdA== http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

```
result:  Hello, World!
```

Although a Base64 encoded password does not offer much protection for your password (e.g. it can be decoded with `x unbase64 YWRtaW46dGVzdA==`), to avoid your password from being captured in shell command history we can instead read it from a plain text file, e.g:

```bash
set /P basic=<credentials.txt
x send -basic %basic% http://test.servicestack.net HelloSecure "{name:'World'}"
```

Output:

```
result:  Hello, World!
```

### Authentication -authsecret

If the remote ServiceStack App is [configured with an Admin Auth Secret](/debugging#authsecret), i.e:

```csharp
SetConfig(new HostConfig { AdminAuthSecret = "secretz" });
```

It can be used to authenticated with using the `-authsecret` option:

:::sh
x send -authsecret secretz http://test.servicestack.net HelloSecure "{name:'World'}"
:::

Output:

```
result:  Hello, World!
```

### Authentication -ss-id

When the remote ServiceStack App is configured to use Server Sessions you can impersonate a pre-authenticated Users Session using the `-ss-id` Authentication option which is useful for impersonating an existing Users Session by copying their `ss-id` or `ss-pid` Cookie which you can find in Web Inspector's **Application** page:

![](./img/pages/auth/webinspector-cookies.png)

If Users were authenticated with **Remember Me** checked their Session will be stored against the `ss-pid` Cookie otherwise it will use the `ss-id` Session Cookie.

Making a `GET` request to the `Authenticate` API is another way you can test which user you're authenticated as, e.g:

:::sh
x GET -ss-id FoCHJK9Apl9mrcaq3ceE https://vue-spa.web-templates.io Authenticate
:::

Output:

```
userId:          1
sessionId:       FoCHJK9Apl9mrcaq3ceE
userName:        admin@email.com
displayName:     Admin User
profileUrl:      data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E %3Cstyle%3E .path%7B%7D %3C/style%3E %3Cg id='male-svg'%3E%3Cpath fill='%23556080' d='M1 92.84V84.14C1 84.14 2.38 78.81 8.81 77.16C8.81 77.16 19.16 73.37 27.26 69.85C31.46 68.02 32.36 66.93 36.59 65.06C36.59 65.06 37.03 62.9 36.87 61.6H40.18C40.18 61.6 40.93 62.05 40.18 56.94C40.18 56.94 35.63 55.78 35.45 47.66C35.45 47.66 32.41 48.68 32.22 43.76C32.1 40.42 29.52 37.52 33.23 35.12L31.35 30.02C31.35 30.02 28.08 9.51 38.95 12.54C34.36 7.06 64.93 1.59 66.91 18.96C66.91 18.96 68.33 28.35 66.91 34.77C66.91 34.77 71.38 34.25 68.39 42.84C68.39 42.84 66.75 49.01 64.23 47.62C64.23 47.62 64.65 55.43 60.68 56.76C60.68 56.76 60.96 60.92 60.96 61.2L64.74 61.76C64.74 61.76 64.17 65.16 64.84 65.54C64.84 65.54 69.32 68.61 74.66 69.98C84.96 72.62 97.96 77.16 97.96 81.13C97.96 81.13 99 86.42 99 92.85L1 92.84Z'/%3E%3C/g%3E%3C/svg%3E

[roles]
Admin
```
