---
slug: mix-tool
title: Mix features into ASP.NET Core Projects from Gists
---

To complete the picture of making it easy as possible to compose ASP.NET Core Apps & easily install features we've added `mix` support to the 
[dotnet tools](/dotnet-tool):

:::sh
dotnet tool install --global x
:::

The same functionality is also built into the Windows [app](/netcore-windows-desktop) dotnet tool, both can be updated to the latest version with:

.NET 8.0 (Windows/macOS/Linux):

:::sh
dotnet tool update -g x
:::

.NET 8.0 (Windows x64):

:::sh
dotnet tool update -g app
:::

### mix-enabled dotnet tools

`mix` works exactly the same in all dotnet tools, which just needs the **tool name prefixed** before the `mix` command:

```bash
x mix ...
app mix ...
```

### mix Usage

`x mix` is designed around applying ASP.NET Core features captured in GitHub gists to your local .NET Core projects. 

Type `x mix ?` for a quick Usage Summary:

```
View all published gists:
   x mix

Simple Usage:
   x mix <name> <name> ...

Mix using numbered list index instead:
   x mix 1 3 5 ...

Delete previously mixed gists:
   x mix -delete <name> <name> ...

Use custom project name instead of current folder name (replaces MyApp):
   x mix -name ProjectName <name> <name> ...

Replace additional tokens before mixing:
   x mix -replace term=with <name> <name> ...

Multi replace with escaped string example:
   x mix -replace term=with -replace "This Phrase"="With This" <name> <name> ...

Only display available gists with a specific tag:
  x mix [tag]
  x mix [tag1,tag2]
```

Although most of the time you're only going to run 2 commands, viewing available features with:

:::sh
x mix
:::

Where it displays different features that can be added to your App, where they're added to and the author of the Gist:

```
   1. console-cs                 C# .NET 8 Console App                                                             to: .                            by @ServiceStack    [project,C#]
   2. console-fs                 F# .NET 8 Console App                                                             to: .                            by @ServiceStack    [project,F#]
   3. console-vb                 VB .NET 8 Console App                                                             to: .                            by @ServiceStack    [project,VB]
   4. console-ss                 #Script Console App                                                               to: .                            by @ServiceStack    [project,S#]
   5. console-lisp               #Script Lisp Console App                                                          to: .                            by @ServiceStack    [project,Lisp]
   6. init                       Empty .NET 8 ServiceStack App                                                     to: .                            by @ServiceStack    [project,C#]
   7. init-lts                   Empty .NET 8 LTS ServiceStack App                                                 to: .                            by @ServiceStack    [project,C#]
   8. init-vb                    VB.NET Empty .NET 8 ServiceStack App                                              to: .                            by @ServiceStack    [project,VB]
   9. init-fsharp                F# Empty .NET 8 ServiceStack App                                                  to: .                            by @ServiceStack    [project,F#]
  10. init-corefx                Empty ASP.NET Core 2.1 LTS on .NET Framework                                      to: .                            by @ServiceStack    [project,C#]
  11. init-sharp-app             Empty ServiceStack Sharp App                                                      to: .                            by @ServiceStack    [project,S#]
  12. init-test                  .NET 8 Integration Test                                                           to: .                            by @ServiceStack    [project,C#]
  13. init-test2                 .NET 8 and .NET v4.72 Integration Test                                            to: .                            by @ServiceStack    [project,C#]
  14. redis                      Use ServiceStack.Redis                                                            to: $HOST                        by @ServiceStack    [db]
  15. sqlserver                  Use OrmLite with SQL Server                                                       to: $HOST                        by @ServiceStack    [db]
  16. sqlite                     Use OrmLite with SQLite                                                           to: $HOST                        by @ServiceStack    [db]
  17. postgres                   Use OrmLite with PostgreSQL                                                       to: $HOST                        by @ServiceStack    [db]
  18. mysql                      Use OrmLite with MySql                                                            to: $HOST                        by @ServiceStack    [db]
  19. oracle                     Use OrmLite with Oracle                                                           to: $HOST                        by @ServiceStack    [db]
  20. firebird                   Use OrmLite with Firebird                                                         to: $HOST                        by @ServiceStack    [db]
  21. dynamodb                   Use AWS DynamoDB and PocoDynamo                                                   to: $HOST                        by @ServiceStack    [db]
  22. mongodb                    Use MongoDB                                                                       to: $HOST                        by @ServiceStack    [db]
  23. ravendb                    Use RavenDB                                                                       to: $HOST                        by @ServiceStack    [db]
  24. marten                     Use Marten                                                                        to: $HOST                        by @ServiceStack    [db]
  25. auth                       Configure AuthFeature                                                             to: $HOST                        by @ServiceStack    [auth]
  26. auth-ext                   Configure AuthFeature inc. extended .NET Providers                                to: $HOST                        by @ServiceStack    [auth]
  27. auth-db                    Use OrmLite Auth Repository (requires auth)                                       to: $HOST                        by @ServiceStack    [auth]
  28. auth-redis                 Use Redis Auth Repository (requires auth)                                         to: $HOST                        by @ServiceStack    [auth]
  29. auth-memory                Use Memory Auth Repository (requires auth)                                        to: $HOST                        by @ServiceStack    [auth]
  30. auth-dynamodb              Use DynamoDB Auth Repository (requires auth)                                      to: $HOST                        by @ServiceStack    [auth]
  31. auth-mongodb               Use MongoDB Auth Repository (requires auth)                                       to: $HOST                        by @ServiceStack    [auth]
  32. auth-ravendb               Use RavenDB Auth Repository (requires auth)                                       to: $HOST                        by @ServiceStack    [auth]
  33. auth-marten                Use Marten Auth Repository (requires auth)                                        to: $HOST                        by @ServiceStack    [auth]
  34. backgroundmq               Use Memory Background MQ                                                          to: $HOST                        by @ServiceStack    [mq]
  35. rabbitmq                   Use RabbitMQ                                                                      to: $HOST                        by @ServiceStack    [mq]
  36. sqs                        Use AWS SQS MQ                                                                    to: $HOST                        by @ServiceStack    [mq]
  37. servicebus                 Use Azure Service Bus MQ                                                          to: $HOST                        by @ServiceStack    [mq]
  38. redismq                    Use Redis MQ                                                                      to: $HOST                        by @ServiceStack    [mq]
  39. autoquery                  Configure AutoQuery Services                                                      to: $HOST                        by @ServiceStack    [autoquery]
  40. autocrudgen                AutoGen AutoQuery Services for Existing DBs                                       to: $HOST                        by @ServiceStack    [autoquery,autogen,db]
  41. autodto                    Generate DB DTOs in C#, TypeScript, Dart, Java, Kotlin, Swift, VB.NET, F#         to: .                            by @ServiceStack    [autoquery,codegen]
  42. migrations                 Add OrmLite DB Migrations to an existing project                                  to: $HOST                        by @ServiceStack    [db]
  43. validation-source          Configure dynamic RDBMS validations source                                        to: $HOST                        by @ServiceStack    [validation]
  44. profiling                  Configure Request Logging & Profiling                                             to: $HOST                        by @ServiceStack    [feature]
  45. serverevents               Configure Server Events (SSE)                                                     to: $HOST                        by @ServiceStack    [feature,sse]
  46. cors                       Configure support for CORS                                                        to: $HOST                        by @ServiceStack    [feature,cors]
  47. openapi                    Configure support for Open API and Swagger UI                                     to: $HOST                        by @ServiceStack    [feature,postman]
  48. feature-mq                 Simple MQ Feature to test sending Messages                                        to: $HOST                        by @ServiceStack    [feature,mq,sharp]
  49. feature-authrepo           List and Search Users registered in Auth Repository                               to: $HOST                        by @ServiceStack    [feature,auth,sharp]
  50. hangfire-postgres          Adds hangfire cron scheduler and dashboard for PostgreSQL                         to: $HOST                        by @GuerrillaCoder  [hangfire,postgres]
  51. sharpdata                  Instant JSON,CSV,XML,JSV data APIs around configured RDBMS tables                 to: .                            by @ServiceStack    [S#]
  52. flutter                    Add flutter project                                                               to: .                            by @ServiceStack    [flutter,mobile]
  53. flutter-grpc               Add flutter project with GRPC                                                     to: .                            by @ServiceStack    [flutter,mobile]
  54. build                      Adds GitHub Action to build and test                                              to: .                            by @ServiceStack    [github]
  55. release-ecr-aws            Adds GitHub Action to deploy to AWS ECS                                           to: .                            by @ServiceStack    [github]
  56. release-ghr-vanilla        Adds GitHub Action to deploy to a Linux server using SSH, via GHCR                to: .                            by @ServiceStack    [github]
  57. release-ecr-vanilla        Adds GitHub Action to deploy to a Linux server using SSH, via AWS ECR             to: .                            by @ServiceStack    [github]
  58. release-hub-vanilla        Adds GitHub Action to deploy to a Linux server using SSH, via DockerHub           to: .                            by @ServiceStack    [github]
  59. blazor-litestream-aws      Use SQLite and Litestream replicating to AWS S3 for Blazor templates              to: .                            by @ServiceStack    [github]
  60. blazor-litestream-azure    Use SQLite and Litestream replicating to Azure Blob Storage for Blazor templates  to: .                            by @ServiceStack    [github]
  61. blazor-litestream-sftp     Use SQLite and Litestream replicating to SFTP server for Blazor templates         to: .                            by @ServiceStack    [github]
  62. jamstack-litestream-aws    Use SQLite and Litestream replicating to AWS S3 for JamStack templates            to: .                            by @ServiceStack    [github]
  63. jamstack-litestream-azure  Use SQLite and Litestream replicating to Azure Blob for JamStack templates        to: .                            by @ServiceStack    [github]
  64. jamstack-litestream-sftp   Use SQLite and Litestream replicating to SFTP server for JamStack templates       to: .                            by @ServiceStack    [github]
  65. litestream-aws             Use SQLite and Litestream replicating to AWS S3                                   to: .                            by @ServiceStack    [github]
  66. litestream-azure           Use SQLite and Litestream replicating to Azure Blob Storage                       to: .                            by @ServiceStack    [github]
  67. litestream-sftp            Use SQLite and Litestream replicating to an SFTP server                           to: .                            by @ServiceStack    [github]
  68. blazor-upgrade-clean       Remove old files                                                                  to: .                            by @ServiceStack    [upgrade]
  69. blazor-upgrade             Update to latest Files                                                            to: .                            by @ServiceStack    [upgrade]
  70. migration-upgrade-blazor   Update to latest GitHub Action release for Blazor templates                       to: .                            by @ServiceStack    [upgrade]
  71. migration-upgrade-js       Update to latest GitHub Action release for JS Jamstack templates                  to: .                            by @ServiceStack    [upgrade]
  72. nuglify                    Use Nuglify's Advanced JS/CSS/HTML Minifiers                                      to: $HOST                        by @ServiceStack    [assets]
  73. northwind.sqlite           northwind.sqlite                                                                  to: .                            by @ServiceStack    [sqlite]
  74. chinook.sqlite             chinook.sqlite                                                                    to: .                            by @ServiceStack    [sqlite]
  75. northwind.sharpdata        northwind.sharpdata                                                               to: .                            by @ServiceStack    [sharpdata]
  76. chinook.sharpdata          chinook.sharpdata                                                                 to: .                            by @ServiceStack    [sharpdata]
  77. grpc                       Configure gRPC                                                                    to: $HOST                        by @ServiceStack    [feature,grpc]
  78. grpc-android               Android gRPC SSL Channel Builder                                                  to: .                            by @ServiceStack    [java,grpc]
  79. bcl.proto                  protobuf-net\bcl.proto                                                            to: .                            by @ServiceStack    [grpc]
  80. example-validation         Contacts Validation Example                                                       to: $HOST                        by @ServiceStack    [example,sharp]
  81. feedz                      ServiceStack pre-release Feedz packages                                           to: .                            by @ServiceStack    [config]
  82. gh-nuget                   ServiceStack pre-release GitHub packages                                          to: .                            by @ServiceStack    [config]
  83. myget                      ServiceStack pre-release MyGet packages                                           to: .                            by @ServiceStack    [config]
  84. nginx                      Nginx reverse proxy config for .NET Core Apps                                     to: /etc/nginx/sites-available/  by @ServiceStack    [config]
  85. nginx-yum                  Nginx reverse proxy (yum) config for .NET Core Apps                               to: /etc/nginx/conf.d/           by @ServiceStack    [config]
  86. supervisor                 Supervisor config for managed execution of .NET Core Apps                         to: /etc/supervisor/conf.d/      by @ServiceStack    [config]
  87. supervisord.service        Systemd supervisord.service script                                                to: /usr/lib/systemd/system/     by @ServiceStack    [config]
  88. supervisor-sharp           Supervisor config for managed execution of Sharp Apps                             to: /etc/supervisor/conf.d/      by @ServiceStack    [config]
  89. docker                     Dockerfile example for .NET Core Sharp Apps                                       to: .                            by @ServiceStack    [config]
  90. nlog                       Adds prod/dev default config files. Saves to APP_LOG_PATH                         to: $HOST                        by @GuerrillaCoder  [config]
  91. gen-dev-crt.sh             Generate *.servicestack.com self-signed localhost certificate                     to: $HOST                        by @ServiceStack    [config]
  92. typechat.mjs               Node typechat.mjs script                                                          to: $HOST                        by @ServiceStack    [config]
  93. gen.https.sh               gen.https.sh                                                                      to: .                            by @ServiceStack    [files,ssl]
  94. docker-dotnet              Docker file to build basic ServiceStack application                               to: .                            by @ServiceStack    [docker]
  95. docker-dotnet-spa          Docker file to build ServiceStack application that also needs node                to: .                            by @ServiceStack    [docker]
  96. docker-jupyter             Jupyter Dockerfile for running C# and F# Notebooks on mybinder.org                to: .                            by @ServiceStack    [docker]
  97. docker-jupyter-reports     Jupyter Dockerfile for running C#,F# and LaTeX support for nbconvert              to: .                            by @ServiceStack    [docker]
 
   Usage:  x mix <name> <name> ...

  Search:  x mix [tag] Available tags: auth, config, db, feature, lib, mq, project, react, sharp, svg, ui, vue

Advanced:  x mix ?
```

Then choosing which features you want to add to your project with `x mix <name>`, e.g:

:::sh
x mix redis
:::

The entire list of available features is maintained in the self-documenting human and machine readable
[mix.md](https://gist.github.com/gistlyn/9b32b03f207a191099137429051ebde8) feature index.

> To publish your feature here and make it available to all `mix` users, please [link to it in the comments](https://gist.github.com/gistlyn/9b32b03f207a191099137429051ebde8#comments).

### Mix in Features into ASP.NET Core Apps

It should be noted that `ModularStartup` and `mix` dotnet tool aren't limited to ServiceStack Apps, they're a generic solution
that can easily add features to any .NET Core App. E.g. some of ServiceStack features relies on external dependencies which utilizes
the same dependency registration used in all ASP.NET Core Apps, e.g running:

:::sh
x mix mongodb
:::

Applies the `mongodb` feature to your HOST project as instructed by the `to: $HOST` modifier above that it finds by
using the first folder containing either `appsettings.json`, `Program.cs` or `Startup.cs`
and writing the following [mongodb Gist file](https://gist.github.com/gistlyn/f777396583262127a66e2369ae475d3f):

```csharp
namespace MyApp
{
    public class ConfigureMongoDb : IConfigureServices
    {
        IConfiguration Configuration { get; }
        public ConfigureMongoDb(IConfiguration configuration) => Configuration = configuration;

        public void Configure(IServiceCollection services)
        {
            var mongoClient = new MongoClient();
            IMongoDatabase mongoDatabase = mongoClient.GetDatabase("MyApp");
            container.AddSingleton(mongoDatabase);
        }
    }    
}
```

With all `MyApp` tokens replaced with the **Project Name** using the same replacement rules as new projects, i.e:

 - `MyApp` will be replaced with `ProjectName`
 - `my-app` will be replaced with `project-name`
 - `My App` will be replaced with `Project Name`

By default it assumes the folder name is the project name, that's overridable using the `-name` flag:

:::sh
x mix -name ProjectName mongodb
:::

This feature also installs the **MongoDB.Driver** NuGet package as instructed by the `_init` command in the 
[mongodb feature](https://gist.github.com/gistlyn/f777396583262127a66e2369ae475d3f).

So after just a single `mix` command and App restart, it's now configured and running with MongoDB!

#### Registering MongoDB Auth Repository

As a design goal `mix` features are designed to be layerable where you can existing features that builds upon existing registrations, 
for example you can later configure your App to **enable auth** and configure it to use a `MongoDbAuthRepository` with:

:::sh
x mix auth auth-mongodb
:::

### Mix in DB Support

All DB servers are just as easily configurable, which we can quickly find using a `[db]` tag search:

:::sh
x mix [db]
:::

::: info Tip
search term needs to be quoted in unix shells, e.g: '[db]'
:::

Which will list all available `[db]` providers:

```
Results matching tag [db]:

   1. redis      Use ServiceStack.Redis            to: $HOST  by @ServiceStack  [db]
   2. sqlserver  Use OrmLite with SQL Server       to: $HOST  by @ServiceStack  [db]
   3. sqlite     Use OrmLite with SQLite           to: $HOST  by @ServiceStack  [db]
   4. postgres   Use OrmLite with PostgreSQL       to: $HOST  by @ServiceStack  [db]
   5. mysql      Use OrmLite with MySql            to: $HOST  by @ServiceStack  [db]
   6. oracle     Use OrmLite with Oracle           to: $HOST  by @ServiceStack  [db]
   7. firebird   Use OrmLite with Firebird         to: $HOST  by @ServiceStack  [db]
   8. dynamodb   Use AWS DynamoDB and PocoDynamo   to: $HOST  by @ServiceStack  [db]
   9. mongodb    Use MongoDB                       to: $HOST  by @ServiceStack  [db]
  10. ravendb    Use RavenDB                       to: $HOST  by @ServiceStack  [db]
  11. marten     Use Marten NoSQL with PostgreSQL  to: $HOST  by @ServiceStack  [db]

   Usage:  x mix <name> <name> ...

  Search:  x mix [tag] Available tags: auth, config, db, feature, lib, mq, project, react, sharp, svg, ui, vue

Advanced:  x mix ?
```

So we can install Redis with:

:::sh
x mix redis
:::

Where it will apply the [Redis Gist](https://gist.github.com/gistlyn/512309b3cb7d734bb0f7323907499b08) below:

```csharp
namespace MyApp
{
    public class ConfigureRedis : IConfigureServices, IConfigureAppHost
    {
        IConfiguration Configuration { get; }
        public ConfigureRedis(IConfiguration configuration) => Configuration = configuration;

        public void Configure(IServiceCollection services)
        {
            services.AddSingleton<IRedisClientsManager>(
                new RedisManagerPool(Configuration.GetConnectionString("Redis") ?? "localhost:6379"));
        }

        public void Configure(IAppHost appHost)
        {
            appHost.GetPlugin<SharpPagesFeature>()?.ScriptMethods.Add(new RedisScripts());
        }
    }
}
```

The configuration is declarative where it only runs `Configure(IAppHost appHost)` in ServiceStack Apps and only adds the `RedisScripts`
if it's configured with [#Script Pages](https://sharpscript.net/docs/script-pages), otherwise any additional configuration is inert and isn't run.

Typically DB's will require you to specify your App DB's connection string to your external DB (with a default fallback) - where typically the
most effort required to enable a feature is adding a Connection String in your `appsettings.json`.

### Composable Features

A nice characteristic about "no-touch" layerable features are that they're composable, where `mix` will let you hand-pick all features you
want in a single command. For example you can enable Authentication, register an RDBMS Auth Repository using SQL Server with:

:::sh
x mix auth auth-db sqlserver
:::

Which will apply the [Configure.Auth.cs](https://gist.github.com/gistlyn/1ec54e10d44f87e0f20daaf7e2248fea), 
[Configure.AuthRepository.cs](https://gist.github.com/gistlyn/16fddde0763b3eee516d670ab9fab194) and [Configure.Db.cs](https://gist.github.com/gistlyn/7075e53e1fe69d3da12996677b5f3a5a) gists.

If you later wanted to switch to PostgreSQL, you can `mix` it in with:

:::sh
x mix postgres
:::

Where it will override [Configure.Db.cs](https://gist.github.com/gistlyn/faf62da8b8ef30849506631025a5d06c) to use the postgres version, 
leaving any custom logic in `Configure.Auth.cs` or `Configure.AuthRepository.cs` untouched.

Or if you later want to change the Auth Repository to use Redis instead, you can run:

:::sh
x mix auth-redis
:::

Where it will override the existing `Configure.AuthRepository.cs` added by **auth-db**.

### Undo mix

In addition to being easy to add, `mix` makes it easy to undo where you can specify the `-delete` flag to remove all the Gist files added
by all features, e.g:

:::sh
x mix -delete auth auth-db sqlserver
:::

Which will let you review all the files in each Gist that will deleted, then hit `Enter` to confirm:

```
Delete 1 file from 'auth' https://gist.github.com/gistlyn/1ec54e10d44f87e0f20daaf7e2248fea:

C:\Projects\app\Configure.Auth.cs

Delete 1 file from 'auth-db' https://gist.github.com/gistlyn/16fddde0763b3eee516d670ab9fab194:

C:\Projects\app\Configure.AuthRepository.cs

Delete 1 file from 'sqlserver' https://gist.github.com/gistlyn/7075e53e1fe69d3da12996677b5f3a5a:

C:\Projects\app\Configure.Db.cs

Proceed? (n/Y):
```

### Encapsulated Features

A nice benefit of decoupling features into modular classes is that you're able to a richer and more customizable out-of-the-box experience. 

Instead of overloading users with daunting amounts of configuration required in common medium-sized Apps,
most templates will start with an empty slate and leave it for users to read about each feature then decide how to hand-pick 
different configuration to slot it into their own App's configuration. 

On the flip-side if you provide too much configuration Developers wont be confident to know what configuration belongs to which feature
and which feature are interconnected or can be safely removed without breaking their App.

With modular features we can encapsulate configuration in a single `.cs` file that's primed with the popular well-known configuration
for the feature. E.g. The Auth Repositories include an example of maintaining a custom `UserAuth` model, registering the 
[Auth Event](/auth/sessions#session-events) to populate their additional fields on Authentication and sample code necessary for ensuring
a specific Admin User is created on `Startup`:

```csharp
namespace MyApp
{
    // Custom User Table with extended Metadata properties
    public class AppUser : UserAuth
    {
        public string ProfileUrl { get; set; }
        public string LastLoginIp { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }

    public class AppUserAuthEvents : AuthEvents
    {
        public override void OnAuthenticated(IRequest req, IAuthSession session, IServiceBase authService, 
            IAuthTokens tokens, Dictionary<string, string> authInfo)
        {
            var authRepo = HostContext.AppHost.GetAuthRepository(req);
            using (authRepo as IDisposable)
            {
                var userAuth = (AppUser)authRepo.GetUserAuth(session.UserAuthId);
                userAuth.ProfileUrl = session.GetProfileUrl();
                userAuth.LastLoginIp = req.UserHostAddress;
                userAuth.LastLoginDate = DateTime.UtcNow;
                authRepo.SaveUserAuth(userAuth);
            }
        }
    }

    public class ConfigureAuthRepository : IConfigureAppHost, IConfigureServices, IPreInitPlugin
    {
        public void Configure(IServiceCollection services)
        {
            services.AddSingleton<IAuthRepository>(c =>
                new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
                    UseDistinctRoleTables = true
                });            
        }

        public void Configure(IAppHost appHost)
        {
            var authRepo = appHost.Resolve<IAuthRepository>();
            authRepo.InitSchema();

            CreateUser(authRepo, "admin@email.com", "Admin User", "p@55wOrd", roles:new[]{ RoleNames.Admin });
        }

        public void BeforePluginsLoaded(IAppHost appHost)
        {
            appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents());
        }

        // Add initial Users to the configured Auth Repository
        public void CreateUser(IAuthRepository authRepo, 
            string email, string name, string password, string[] roles)
        {
            if (authRepo.GetUserAuthByUserName(email) == null)
            {
                var newAdmin = new AppUser { Email = email, DisplayName = name };
                var user = authRepo.CreateUserAuth(newAdmin, password);
                authRepo.AssignRoles(user, roles);
            }
        }
    }
}
```

All captured within a working configuration. You can start appreciating the instant utility of `mix` once you imagine what it was like before 
with how much time an effort it would've taken to scan through docs, learn about each feature independently to be able to piece together 
equivalent functionality.

### Mix in Auth Repository

As it can take a while to piece together how to configure your preferred Auth Repository, use a Custom User Model 
and utilize [Auth Events](/auth/sessions#session-events) to populate it, we now recommend using `mix` to configure
your preferred Auth Repository, which you can query with:

:::sh
x mix [auth]
:::

To display the current list of available Auth Repositories:

```
Results matching tag [auth]:

   1. auth              Configure AuthFeature                        to: $HOST  by @ServiceStack [auth]
   2. auth-db           Use OrmLite Auth Repository (requires auth)  to: $HOST  by @ServiceStack [auth]
   3. auth-redis        Use Redis Auth Repository (requires auth)    to: $HOST  by @ServiceStack [auth]
   4. auth-memory       Use Memory Auth Repository (requires auth)   to: $HOST  by @ServiceStack [auth]
   5. auth-dynamodb     Use DynamoDB Auth Repository (requires auth) to: $HOST  by @ServiceStack [auth]
   6. auth-mongodb      Use MongoDB Auth Repository (requires auth)  to: $HOST  by @ServiceStack [auth]
   7. auth-ravendb      Use RavenDB Auth Repository (requires auth)  to: $HOST  by @ServiceStack [auth]
   8. auth-marten       Use Marten Auth Repository (requires auth)   to: $HOST  by @ServiceStack [auth]
   9. feature-authrepo  List and Search Users in an Auth Repo        to: $HOST  by @ServiceStack [feature,auth]
```

### Mix in MQ Server

Likewise we now recommend using `mix` to configure your preferred MQ Service, other than being quicker to add,
it proposes adopting a naming convention in app settings and file names that other `mix` features can also make use of:

:::sh
x mix [mq]
:::

Currently available list of MQ Services:

```
Results matching tag [mq]:

   1. backgroundmq  Use Memory Background MQ                    to: $HOST  by @ServiceStack  [mq]
   2. rabbitmq      Use RabbitMQ                                to: $HOST  by @ServiceStack  [mq]
   3. sqs           Use AWS SQS MQ                              to: $HOST  by @ServiceStack  [mq]
   4. servicebus    Use Azure Service Bus MQ                    to: $HOST  by @ServiceStack  [mq]
   5. redismq       Use Redis MQ                                to: $HOST  by @ServiceStack  [mq]
   6. feature-mq    Simple MQ Feature to test sending Messages  to: $HOST  by @ServiceStack  [feature,mq,sharp]
```

## Mix in NUglify

You can configure your ServiceStack App to use Nuglify's Advanced HTML, CSS, JS Minifiers using [mix](/mix-tool) with:

:::sh
x mix nuglify 
:::

Which will write [Configure.Nuglify.cs](https://gist.github.com/gistlyn/4bdb79d21f199c22b8a86f032c186e2d) to your **HOST** project.

### Mix in Prebuilt Recipes and Working Examples

`ModularStartup` and `mix` can scale up to complete working examples which can provide instant utility and integration of a feature into
your existing App. By contrast most working examples are typically made available off to the side in stale projects which need to 
be downloaded and run in isolation. If it still works you'd then have to compare the project files with your project and carefully copy over the 
differences you'd think your App needs to replicate its functionality. This can be very time consuming to the point where a lot of users will 
skip trying to download & run the example and instead try to manually configure it in their App.

All `mix` features add their files to your App's [Physical Project Structure](/physical-project-structure) where configuration is added to 
your `Host` Project, Service Contracts are added to your `ServiceModel/` folder and Service Implementations added to your `ServiceInterface/` folder
and any Web assets added to your App's `wwwroot/`. 

They can also be added to both multi and single project solutions in which case they'll be added to `ServiceInterface` and `ServiceModel` folders 
in your App's project folder using the same namespace as used in multi-project solutions, making it easy to upgrade to a multi-project solution later.

### example-validation

The `example-validation` **mix** is a complete working validation example that's typical of a real-world validation example complete with 
Authentication integration allowing each authenticated user to manage their own private Contacts list. 

[![](/img/pages/mix/example-validation-900.gif)](https://youtu.be/udrLtICylj8)

> YouTube: [youtu.be/udrLtICylj8](https://youtu.be/udrLtICylj8)

To follow video's example, start with a new **Acme** project from `sharp` .NET Core Template:

:::sh
x new script Acme
:::

Add the `example-validation` mix:

:::sh
cd Acme
:::

:::sh
x mix example-validation
:::

Which will prompt you with a link to the gist and the files that will be added to your project:

```
Write files from 'example-validation' https://gist.github.com/gistlyn/33873ed2857b2c5a9623629c6210d665 to:

  C:\projects\Acme\Acme\Configure.Contacts.cs
  C:\projects\Acme\Acme.ServiceInterface\ContactServices.cs
  C:\projects\Acme\Acme.ServiceModel\Contacts.cs
  C:\projects\Acme\Acme\wwwroot\contacts\_id\edit.html
  C:\projects\Acme\Acme\wwwroot\contacts\_requires-auth-partial.html
  C:\projects\Acme\Acme\wwwroot\contacts\index.html

Proceed? (n/Y):
```

Now after restarting your App you'll be able to add contacts by clicking on the new **Contacts** link in your App's main menu: 

:::sh
cd Acme
:::
:::sh
dotnet run
:::

After you're done reviewing the example you can either refactor it to handle your App's requirements or completely remove it from your App with:

:::sh
x mix -delete example-validation
:::

### feature-mq

The `feature-mq` adds MQ support to your App, complete with UI and includes 2 different ways of calling MQ Services in ServiceStack, just like 
`example-validation` above, `feature-mq` is another complete working example with both UI and Service implementation in the following files:

  - [Configure.Mq.cs?](https://gist.github.com/gistlyn/355338cd60a32ee9c9fc4761269f7782#file-configure-mq-cs)
  - [Feature.Mq.cs](https://gist.github.com/gistlyn/355338cd60a32ee9c9fc4761269f7782#file-feature-mq-cs)
  - [ServiceInterface\MqServices.cs ](https://gist.github.com/gistlyn/355338cd60a32ee9c9fc4761269f7782#file-serviceinterface-mqservices-cs)
  - [ServiceModel\Mq.cs](https://gist.github.com/gistlyn/355338cd60a32ee9c9fc4761269f7782#file-servicemodel-mq-cs)
  - [wwwroot\messaging.html](https://gist.github.com/gistlyn/355338cd60a32ee9c9fc4761269f7782#file-wwwroot-messaging-html)
  
As `Configure.Mq.cs?` is optional it will only add it if doesn't already exist, so it will either use your existing MQ configuration
or configure your App to use the In Memory `BackgroundMqService` implementation.

Add `feature-mq` to your project with:

:::sh
x mix feature-mq
:::

![](/img/pages/nav/feature-mq.png)

This will add the `TestMq` Service and make it available to your MQ endpoint. `TestMq` is a regular service that updates values in the 
App's registered `ICacheClient` and returns the Cache's current values as well as the internal Stats of the MQ:

```csharp
public class MqServices : Service
{
    public IMessageService MqService { get; set; }

    public void Any(PublishMq request)
    {
        PublishMessage(request.ConvertTo<TestMq>());
    }

    public object Any(TestMq request)
    {
        if (!string.IsNullOrEmpty(request.Name))
            Cache.Set("mq.name", request.Name);
        
        if (request.Add > 0)
            Cache.Increment("mq.counter", (uint)request.Add);
        else if (request.Add < 0)
            Cache.Decrement("mq.counter", (uint)(request.Add * -1));

        return new TestMqResponse {
            Name = Cache.Get<string>("mq.name"),
            Counter = Cache.Get<long>("mq.counter"),
            StatsDescription = MqService.GetStatsDescription(),
        };
    }
}
```

The 2 ways to call a MQ Service is directly using the `publish` or `sendOneWay` APIs (available in all ServiceStack Service Clients) where 
it send the request to the Service's `/oneway` endpoint which will automatically publish it to the registered MQ. 

Alternatively you can publish the Request DTO yourself from a different Service Implementation as done in `PublishMq`, as-is typical for
Services that queues sending emails without blocking Service Execution.

The feature's UI allows you to publish `TestMq` messages using either approach:

```js
client = new JsonServiceClient('/');

var oneway = document.querySelector('input[name=mq-publish]:checked').value === "OneWay";
if (oneway) {
    client.publish(new TestMq({ name: $txtName.value, add: parseInt(add) }))
} else {
    client.post(new PublishMq({ name: $txtName.value, add: parseInt(add) }))
}
```

Both approaches end with the same result with the `TestMq` Request DTO published and executed by the registered MQ Service as shown in the
UI which is periodically updated with the current state in the Cache and the internal stats of the MQ Service showing how many messages it processed.

### feature-authrepo

Another UI feature `mix` available is a UI to browse and search for registered users in an Auth Repository.

This wasn't generically possible before as `IAuthRepository` didn't previously provide any API's to be able to query all Users, 
which is now available in the new `IQueryUserAuth` API:

```csharp
public interface IQueryUserAuth
{
    List<IUserAuth> GetUserAuths(string orderBy = null, int? skip = null, int? take = null);
    List<IUserAuth> SearchUserAuths(string query, string orderBy = null, int? skip = null, int? take = null);
}
```

This is now implemented in all ServiceStack Auth Repositories although there are limitations depending on the queryability of the underlying data provider.

Searching in these Auth Repositories are efficient and searches in **UserName**, **Email**, **DisplayName** and **Company** fields:

 - `OrmLiteAuthRepository`
 - `InMemoryAuthRepository` 
 - `MongoDbAuthRepository` 

For RavenDB it reuses the existing Username/Email indexes so only searches **UserName**, **Email** fields and only performs a StartsWith/EndsWith 
search as allowed by RavenDB:

 - `RavenDbUserAuthRepository` 

Searches and Order By's are very inefficient in Redis as it needs to deserialize all users to perform the querying/sorting on the client.
Just paging through users with skip/take is efficient as it only needs to deserialize the partial resultset.

 - `RedisAuthRepository`

All queries performs a table scan in DynamoDB but searches all fields:

 - `DynamoDbAuthRepository`

#### API Usage

These API's are accessible from an `IAuthRepository` dependency, if you're using a custom Auth Repository it will need to implement 
`IQueryUserAuth` otherwise calling these APIs (and feature) will throw a `NotSupportedException`:

```csharp
AuthRepository.GetUserAuths(orderBy:fieldName, skip:skip, take:take)
AuthRepository.SearchUserAuths(query:q, orderBy:fieldName, skip:skip, take:take)
```

The `orderBy` is the field name you want to order the results by, e.g. `UserName` and can suffixed with the `DESC` modifier to order 
results in descending order, e.g. `UserName DESC`.

In `#Script` these API's are available in `camelCase` off `authRepo` using a JS Object literal as seen in `users.html` page usage of this feature:

::: v-pre
```hbs
{{ authRepo.searchUserAuths({ query:qs.q, take: pageSize, skip: pageSize*page }) | to => users }}
```
:::

#### Users UI

Clicking the **Users** menu item will show you a list of searchable and pageable registered Users in a summary view:

![](/img/pages/mix/feature-authrepo.png)

Clicking on a user will show you a complete list of fields stored for that user, including any custom fields, if you're using a Custom
`UserAuth` table:

![](/img/pages/mix/feature-authrepo-admin.png)
