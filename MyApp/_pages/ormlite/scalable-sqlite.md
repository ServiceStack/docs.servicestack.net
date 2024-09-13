---
title: Scalable SQLite
---

Ever since adding [support for Litestream](/ormlite/litestream) in
our project's templates [GitHub Action Deployments](https://servicestack.net/posts/kubernetes_not_required)
we've been using SQLite as the backend for our new .NET Apps as it's the 
[most cost-effective option](/ormlite/litestream#savings-at-scale)
that frees us from needing to use a cloud managed database which lets us make use of Hetzner's much cheaper
[US Cloud VMs](https://www.hetzner.com/cloud/).

We're also seeing increased usage of SQLite Server Apps with [Bluesky Social](https://github.com/bluesky-social/atproto/pull/1705)
having moved to SQLite and all of 37 Signals new [Once](https://once.com) Web Apps 
[using SQLite](https://world.hey.com/dhh/multi-tenancy-is-what-s-hard-about-scaling-web-services-dd1e0e81)
and Cloud Providers building distributed databases on top of SQLite like 
[Cloudflare D1](https://blog.cloudflare.com/introducing-d1/) and Fly.io's 
multi-region distributed [LiteFS](https://fly.io/docs/litefs/) solution.

SQLite is a highly-performant DB that can handle a large number of concurrent read operations and
[35% Faster](https://www.sqlite.org/fasterthanfs.html) filesystem performance for write operations with next 
to no latency that's often faster than other RDBMS's courtesy of its proximity to the running application which gives it unique advantages over traditional client/server RDBMS's where it's not susceptible to the 
[N+1 Queries problem](https://www.sqlite.org/np1queryprob.html) and is also able to execute your
custom C# Logic inside SQL Queries using [Application SQL Functions](https://www.sqlite.org/appfunc.html).

With [litestream.io](https://litestream.io) taking care of real-time replication to managed storage
we just need to workaround SQLite's single concurrent writer to unlock the value, performance and 
unique features of SQLite in our Apps which we cover in this release with integrated support for
Database Locks and Sync Commands.

## Single Concurrent Writer

The primary limitation of SQLite is that it only supports a single concurrent writer, which means if you 
have multiple requests writing to the same database at the same time, they will need to coordinate access. 

As long as we can overcome this limitation SQLite can be an excellent choice to power many Web Apps. In the
previous ServiceStack v8.3 release we [worked around this limitation](/commands#use-case-sqlite-writes)
by using [MQ Command DTOs](/commands#mq-command-dtos) to route all DB
Writes to be executed by a single Background MQ Thread.

This works great for [messaging-based architectures](/commands#messaging)
where you can queue commands to be processed serially, but the overhead of using commands for all 
DB writes can be cumbersome when needing to perform sporadic writes within complex logic.

## Multiple SQLite Databases

Firstly a great way to reduce contention is to use separate SQLite databases for different
subsystems of your Application that way load is distributed across multiple DBs
and writes across each SQLite database can be executed concurrently.

This is especially important for write heavy operations like
[SQLite Request Logging](https://servicestack.net/posts/sqlite-request-logs) or if your App stores every interaction 
of your App for A/B testing, storing them in separate `analytics.db` databases will remove 
any contention from your primary database.

The other techniques below demonstrates concurrent safe techniques for accessing an SQLite DB: 

### Always use Synchronous APIs for SQLite

Generally it's recommended to use non-blocking Async APIs for any I/O Operations however as
SQLite doesn't make Network I/O requests and its native implementation is blocking, its Async DB
APIs are just pseudo-async wrappers around SQLite's blocking APIs which just adds unnecessary
overhead. For this reason we recommend **always** using synchronous APIs for SQLite, especially 
as it's not possible to await inside a lock:

```csharp
lock (Locks.AppDb)
{
    //Can't await inside a lock
    //await Db.UpdateAsync(row); 
    Db.Update(row);
}
```

It's also safe to assume SQLite will always block since all
[Asynchronous I/O efforts](https://www.sqlite.org/asyncvfs.html) were abandoned in favor
of [WAL mode](https://www.sqlite.org/wal.html) which mitigates the cost of blocking **fsync()**.

## Database Locks

The new `Locks` class maintains an object lock for each registered database connection that can be 
used to synchronize **write access** for different SQLite databases, e.g:

```js
var row = db.SingleById<Table>(request.Id);
row.PopulateWithNonDefaultValues(request);
lock (Locks.AppDb)
{
    Db.Update(row);
}
```

`Locks.AppDb` can be used synchronize db writes for the App's primary database, e.g. `App_Data/app.db`.

Whilst `Locks.GetDbLock(namedConnection)` can be used to get the DB Write Lock for any other 
[registered SQLite Database](/ormlite/multi-database-app) by using
the same named connection the SQLite Database Connection was registered against, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(connStr, SqliteDialect.Provider);
dbFactory.RegisterConnection(Databases.Search, 
    $"DataSource=App_Data/search.db;Cache=Shared", SqliteDialect.Provider);
dbFactory.RegisterConnection(Databases.Analytics, 
    $"DataSource=App_Data/analytics.db;Cache=Shared", SqliteDialect.Provider);

//...
using var dbSearch = dbFactory.Open(Database.Search);
lock (Locks.GetDbLock(Database.Search))
{
    dbSearch.Insert(row);
}

using var dbAnalytics = dbFactory.Open(Database.Analytics);
lock (Locks.GetDbLock(Database.Analytics))
{
    dbAnalytics.Insert(row);
}
```

## Queuing DB Writes with SyncCommand

`Locks` are a great option for synchronizing DB Writes that need to be executed within
complex logic blocks, however locks can cause contention in highly concurrent Apps.
One way to remove contention is to serially execute DB Writes instead which we can
do by executing DB Writes within `SyncCommand*` commands and using a named `[Worker(Workers.AppDb)]`
attribute for Writes to the primary database, e.g: 

```csharp
[Worker(Workers.AppDb)]
public class DeleteCreativeCommand(IDbConnection db) 
    : SyncCommand<DeleteCreative>
{
    protected override void Run(DeleteCreative request)
    {
        var artifactIds = request.ArtifactIds;
        db.Delete<AlbumArtifact>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<ArtifactReport>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<ArtifactLike>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<Artifact>(x => x.CreativeId == request.Id);
        db.Delete<CreativeArtist>(x => x.CreativeId == request.Id);
        db.Delete<CreativeModifier>(x => x.CreativeId == request.Id);
        db.Delete<Creative>(x => x.Id == request.Id);
    }
}
```

Other databases should use its named connection for its named worker, e.g: 

```csharp
[Worker(Databases.Search)]
public class DeleteSearchCommand(IDbConnectionFactory dbFactory) 
    : SyncCommand<DeleteSearch>
{
    protected override void Run(DeleteSearch request)
    {
        using var db = dbFactory.Open(Databases.Search);
        db.DeleteById<ArtifactFts>(request.Id);
        //...
    }
}
```

Where it will be executed within its Database Lock. 

## Executing Commands

Now everytime the commands are executed they will be added to a ConcurrentQueue
where they'll be serially executed by the worker's Background Task: 

```csharp
public class MyServices(IBackgroundJobs jobs) : Service
{
    public void Any(DeleteCreative request)
    {
        // Queues a durable job to execute the command with the named worker
        var jobRef = jobs.EnqueueCommand<DeleteCreativeCommand>(request);
        // Returns immediately with a reference to the Background Job
    }

    public async Task Any(DeleteSearch request)
    {
        // Executes a transient (i.e. non-durable) job with the named worker
        var result = await jobs.RunCommandAsync<DeleteSearchCommand>(request);
        // Returns after the command is executed with its result (if any)
    }
}
```

When using any `SyncCommand*` base class, its execution still uses database locks
but any contention is alleviated as they're executed serially by a single worker thread.

### AutoQuery Crud Database Write Locks

To avoid SQLite concurrency write exceptions all DB Writes should be executed within
its database lock or a named worker. Including the auto-generated [AutoQuery Crud](/autoquery/crud)
APIs which will implicitly use Database Locks if the **primary database is SQLite**.

AutoQuery CRUD can also be explicitly configured to always be executed within Database Locks with:

```csharp
services.AddPlugin(new AutoQueryFeature {
    UseDatabaseWriteLocks = true
});
```

## SQLite Web Apps

That's about it, by using any of the above techniques to guard against concurrent writes
you can take advantage of the [simplicity, value and performance benefits](/ormlite/litestream#the-right-time-for-server-side-sqlite)
of SQLite in your Apps and utilize a solution like [litestream.io](https://litestream.io)
for real-time replication of your SQLite databases to highly reliable managed storage.

SQLite's [Checklist For Choosing The Right Database Engine](https://www.sqlite.org/whentouse.html#checklist_for_choosing_the_right_database_engine)
covers the few situations when a traditional Client/Server RDBMS will be more appropriate.

The primary use-case would be when your App needs to be distributed across multiple App Servers 
as using SQLite essentially forces you into scaling up, which gets more appealing every year 
with hardware getting cheaper and faster and cheap hosting providers like [hetzner.com](https://www.hetzner.com)
where you can get bare metal 48 Core/96 vCore EPYC Servers with fast NVMe SSDs for **€236** per month - 
a fraction of the cost of comparable performance with any cloud managed solution

[![](/img/pages/sqlite/hetzner-epyc-48.webp)](https://www.hetzner.com/dedicated-rootserver/)

Which is a fraction of what it would cost for comparable performance using cloud managed databases:

[![](/img/pages/sqlite/azure-sql-database.webp)](https://azure.microsoft.com/en-us/pricing/details/azure-sql-database/single/)

In the rare cases where you need to scale beyond a single server you'll initially be able to 
scale out your different App databases onto different servers.

Beyond that, if your App permits you may be able to adopt a multi-tenant architecture like 
[Bluesky Social](https://bsky.social/about) with each tenant having their own SQLite database 
to effectively enable infinite scaling.

For further info on using high performance SQLite in production web apps check out
[@aarondfrancis](https://x.com/aarondfrancis) comprehensive website and course at 
[highperformancesqlite.com](https://highperformancesqlite.com) - 
which contains a lot of great content accessible for free.

## Example SQLite Apps

Our confidence in SQLite being the best choice for many web applications has led us to adopt
it to power our latest web applications which are all 
[deployed to a shared Hetzner VM](https://servicestack.net/posts/kubernetes_not_required) 
whose [inexpensive hosting costs](https://servicestack.net/posts/jamstacks_hosting) allows us to host 
and make them **available for free!**

All projects are open-source and employ the different techniques detailed above that should serve
as a great resource of how they're used in real-world Web Applications:

### Blazor Diffusion

Generate images for free using custom [Civit AI](https://civitai.com) and [FLUX-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell)
models:

[![](/img/pages/sqlite/blazordiffusion.webp)](https://blazordiffusion.com)

- Website: [blazordiffusion.com](https://blazordiffusion.com)
- GitHub: [github.com/NetCoreApps/BlazorDiffusionVue](https://github.com/NetCoreApps/BlazorDiffusionVue/)

### pvq.app

An OSS alternative to StackOverflow which uses the best proprietary and OSS Large Language Models 
to answer your technical questions. [pvq.app](https://pvq.app) is populated with over **1M+ answers** for the highest
rated StackOverflow questions - checkout [pvq.app/leaderboard](https://pvq.app/leaderboard) 
to find the best performing LLM models (results are surprising!)

[![](/img/pages/sqlite/pvq.webp)](https://pvq.app)

- Website: [pvq.app](https://pvq.app)
- GitHub: [github.com/ServiceStack/pvq.app](https://github.com/ServiceStack/pvq.app)

### AI Server

The independent Microservice used to provide all AI Features used by the above applications. 
It's already been used to execute millions of LLM and Comfy UI Requests to generate Open AI Chat Answers
and Generated Images used to populate the
[blazordiffusion.com](https://blazordiffusion.com) and [pvq.app](https://pvq.app) websites. 

It was the project used to develop and test [Background Jobs](/background-jobs) in action 
where it serves as a private gateway to process all LLM, AI and image transformations requests 
that any of our Apps need where it dynamically delegates requests across multiple Ollama, 
Open AI Chat, LLM Gateway, Comfy UI, Whisper and ffmpeg providers. 

[![](/img/pages/sqlite/ai-server.webp)](https://openai.servicestack.net)
[![](/img/pages/sqlite/ai-server-chat.webp)](https://openai.servicestack.net)

- Website: [openai.servicestack.net](https://openai.servicestack.net)
- GitHub: [github.com/ServiceStack/ai-server](https://github.com/ServiceStack/ai-server)

In addition to maintaining a history of AI Requests, it also provides file storage
for its CDN-hostable AI generated assets and on-the-fly, cacheable image transformations.

### Private AI Gateway

We're developing AI Server as a **Free OSS Product** that runs as a single Docker Container
Microservice that Admins can use its built-in UIs to add multiple Ollama instances, 
Open AI Gateways to execute LLM requests and Client Docker agents installed with Comfy UI, 
ffmpeg and Whisper to handle all other non-LLM Requests. 

#### Multiple Ollama, Open AI Gateway and Comfy UI Agents

The AI Server Docker container itself wont require any infrastructure dependencies or 
specific hardware requirements, however any Ollama endpoints or Docker Comfy UI Agents added 
will need to run on GPU-equipped servers.

#### Native end-to-end Typed Integrations to most popular languages

ServiceStack's [Add ServiceStack Reference](/add-servicestack-reference)
feature is used to provide native typed integrations to C#, TypeScript, JavaScript, Python, PHP, Swift, Java, 
Kotlin, Dart, F# and VB.NET projects which organizations can drop into their heterogeneous
environments to manage their private AI Services used across their different Apps.

#### Protected Access with API Keys

AI Server utilizes [Simple Auth with API Keys](/auth/admin-apikeys)
letting Admins create and distribute API Keys to only allow authorized clients to access their 
AI Server's APIs, which can be optionally further restricted to only
[allow access to specific APIs](/auth/apikeys#creating-user-api-keys).

## Active Development

AI Server is still actively developed whilst we finish adding support for different 
AI Requests in its first V1 release, including:

#### Large Language Models
- Open AI Chat
  - Support for Ollama endpoints 
  - Support for Open Router, Open AI, Mistral AI, Google and Groq API Gateways

#### Comfy UI Agent / Replicate / DALL-E 3
- Text to Image

#### Comfy UI Agent
- Image to Image
  - Image Upscaling
  - Image with Mask
- Image to Text
- Text to Audio
- Text to Speech
- Speech to Text

#### ffmpeg 
- image/video/audio format conversions
- image/video scaling
- image/video cropping
- image/video watermarking
- video trimming

#### Managed File Storage
- Blob Storage - isolated and restricted by API Key

### V1 Release

We'll announce **V1** after we've finished implementing the above AI Features with any
necessary Admin UIs, feature documentation / API Docs and have streamlined the 
Server Install / Client Setup experience. After V1 we'll be happy to start accepting 
any external contributions for other AI Features users would like AI Server to support.

To get notified when AI Server is ready for public consumption, 
follow [@ServiceStack](https://twitter.com/servicestack)
or [join our ~Quarterly Newsletter](https://servicestack.net/posts/scalable-sqlite#top).

In the meantime you can reach us at [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions)
with any AI Server questions.