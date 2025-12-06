---
title: Litestream
---

<div class="not-prose hide-title">
<h2 id="litestream" class="mx-auto max-w-screen-md text-center py-8 border-none">
    <a href="https://litestream.io">
        <img src="/img/pages/litestream/logo.svg">
    </a>
</h2>
</div>

One of ServiceStack's primary goals is delivering great value and performance, attributes exemplified in all modern [jamstacks.net](https://jamstacks.net) templates which are maximally designed to deliver ultimate performance for a .NET App by adopting a [Jamstack architecture](https://jamstack.org), enabling redundant hosting of their decoupled UI's on inexpensive CDN edge caches - most optimal place to deliver best performance. 

This also happens to be the cheapest to place to host its static files, taking load away from more expensive .NET App Servers and move them to free Cloudflare or GitHub CDNs, which all Jamstack Live Demos take advantage of to enable their [**$0.40 /mo** TCO](https://jamstacks.net/posts/jamstacks_hosting) for hosting their .NET Docker Apps which are only needed to serve the JSON APIs used to power their Jamstack UIs.

## Expensive Managed Databases

Having achieved the ideal architecture for max value and performance, the last expensive vital component used in most Web Apps is hosting of their expensive managed databases. Despite most RDBMS's being OSS and free of licensing costs, major cloud companies continue to charge artificially high hosting costs to provide redundant hosting of App data. The effect of which adds an artificial barrier to entry discouraging new Indie developers from building & hosting their dream Apps that could form self sustaining business models that should ideally be accessible to anyone with access to a Computer with the Internet.

If we solve this, Individual developers can take advantage of our [Free Licenses](https://servicestack.net/free) for experimenting and iterating on building their dream Apps for a few $'s a month, instead of their prohibitive recommended setup costing $100's /month.

<div id="litestream-interest" class="not-prose relative bg-white py-4 mt-12">
    <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">Introducing Litestream</p>
    </div>
</div>

Our [Jamstack live demos](https://jamstacks.net) have been able to avoid these expensive costs by being configured with [SQLite](https://www.sqlite.org) by default, which OrmLite lets you easily change to use your [preferred RDBMS](/ormlite/installation). But when storing live customer data you'll want to ensure you have redundant backups to protect against data loss and why we were excited to learn about [Litestream](https://litestream.io) for enabling effortless replicas & restores to a number of [popular storage providers](https://litestream.io/guides/).

Litestream is being developed by [@benbjohnson](https://twitter.com/benbjohnson), the creator of the popular [BoltDB NoSQL embeddable DB](https://github.com/boltdb/bolt), used in a number of critical software components like [etcd](https://www.ibm.com/cloud/learn/etcd) to manage critical information distributed systems need, most notably, the configuration, state and metadata for [Kubernetes](https://kubernetes.io).

Thankfully Ben saw the potential for SQLite as a better replacement of BoltDB as a dependency-free application database and went about resolving the primary issue preventing SQLite from being used in production server-side Apps.

<div class="not-prose">
<h3 class="text-3xl">
    <a href="https://litestream.io/blog/why-i-built-litestream/#the-problem-litestream-solves">
        The problem Litestream solves
    </a>
</h3>
<div class="pl-16 py-9">
  <div class="text-gray-500 font-serif text-9xl -mb-16">“</div>
  <blockquote class="text-gray-900 font-serif text-xl italic">
    <p>
        I built Litestream to bring back sanity to application development. Litestream is a tool that runs in a separate process and continuously replicates a SQLite database to Amazon S3. You can get up and running with a few lines of configuration. Then you can set-it-and-forget-it and get back to writing code.
    </p>
    <p class="mt-8">
        You might think this sounds expensive to continuously write to cloud storage that provides 99.99% uptime and 99.999999999% durability but it’s astoundingly cheap. Typical costs are only about $1 per month. Litestream is free and open-source too so there’s never a license to pay for.
    </p>
  </blockquote>
  <div class="mt-4 text-gray-600">- Ben Johnson</div>
</div>
</div>

We're so excited about the inexpensive cost, minimal infrastructure dependencies and simplified hosting complexity of this new approach that we quickly set out to provide integrated support for Litestream.

<div class="not-prose">
<div class="my-16 px-4 sm:px-6">
    <div class="text-center">
        <h3 id="litestream-video" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
            Safely run DB Apps on a single server at low cost
        </h3>
    </div>
        <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500"> 
            Simple &amp; Fast! Litestream reliably runs most Apps, fast on a single server, with continuous backups to cheap managed storage.
        </p>
    <div class="my-8">
        <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="WXRwT7ayc1Y" style="background-image: url('https://img.youtube.com/vi/WXRwT7ayc1Y/maxresdefault.jpg')"></lite-youtube>
    </div>
</div>
<section class="my-10 text-center">
    <div class="container">
        <div class="pb-8">
            <h3 id="litestream-how" class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">How it works</span>
            </h3>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Litestream is run as a 
                <a href="https://litestream.io/guides/docker/">sidecar Docker container</a>,
                activated on each deployment to handle restoring &amp; replicating changes from its configured storage
            </p>
        </div>
        <img src="/img/pages/litestream/litestream-how-it-works.svg">
    </div>
</section>
</div>

## Boringly Simple

Litestream's implementation is beautiful in its simplicity which doesn't require any libraries or custom builds of SQLite, it works as an external process transparent to your application that taps into SQLite's journaling features to handle replicating changes to its configured storage provider:

<div class="not-prose pl-16 py-9">
  <div class="text-gray-500 font-serif text-9xl -mb-16">“</div>
  <blockquote class="text-gray-900 font-serif text-xl italic">
    <p>
        The most important thing you should understand about Litestream is that it's just SQLite. Your application uses standard SQLite, with whatever your standard SQLite libraries are. We're not parsing your queries or proxying your transactions, or even adding a new library dependency. We're just taking advantage of the journaling and concurrency features SQLite already has, in a tool that runs alongside your application. For the most part, your code can be oblivious to Litestream's existence.
    </p>
    <p class="mt-8">
        Or, think of it this way: you can build a Remix application backed by Litestream-replicated SQLite, and, while it's running, crack open the database using the standard <b>sqlite3</b> REPL and make some changes. It'll just work.
        You can read more about <a href="https://litestream.io/how-it-works/">how this works here</a>.
    </p>
  </blockquote>
  <div class="mt-4 text-gray-600">- Ben Johnson</div>
</div>

## The Right Time for Server-Side SQLite

Over the years CPUs, memory, & disks have become orders of magnitude faster & cheaper which now sees NVMe SSDs being able to read an entire 1 GB database in <1 second, what's not getting faster is the speed of light and the latency it takes for data to travel between networked components that's further exacerbated by 
the necessary layers of network switches, firewalls, and application protocols undertaken in each HTTP Request.

Whilst modern RDBMS's are finely-tuned modern miracles, the one thing they don't have any control over is the latency between its distributed components. A latency SQLite doesn't have courtesy of being built right in to your application process which sees per-query latency's drop down to 10-20 microseconds - a **50-100x** improvement over intra-region RDBMS queries.

In addition to applications benefiting from latency-free queries, they also become much simpler to manage, replacing entire infrastructure dependencies and n-tier architectures with a transparent sidecar process that continuously monitors and performs per-second backups to AWS S3, Azure Blob Storage & SFTP providing resilient, cost effective point-in-time restore functionality.

Best of all storing bytes is a boringly simple solved problem AWS guarantees with [11 9's durability](https://aws.amazon.com/s3/storage-classes/), a marked improvement over the [3 9's guarantee](https://aws.amazon.com/rds/sla/) when their first tier SLA kicks in for its managed RDS instances.

<div class="not-prose mt-16 mx-auto max-w-7xl px-4">
    <div class="text-center">
        <h3 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block xl:inline">Reduce Complexity &amp; Save Costs</span>
        </h3>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Avoid expensive managed RDBMS servers, reduce deployment complexity, eliminate 
            infrastructure dependencies & save order of magnitude costs vs production hosting
        </p>
    </div>
    <img src="/img/pages/litestream/litestream-costs.svg">
</div>

## Commercially supported thanks to Fly.io

Whilst SQLite enjoys enviable reliability with one of the [most thoroughly tested](https://www.sqlite.org/testing.html) code-bases on earth, it's usage in server production databases is still nascent given there hasn't been a tool that works as seamlessly as Litestream to enable transparent replication & restores. On the surface Litestream appears to be great boring technology, beautiful in its simplicity but we only started seriously considering it for server production apps after it graduated from OSS project to a commercially supported product when Ben joined Fly.io to [work on Litestream full-time](https://fly.io/blog/all-in-on-sqlite-litestream/).

Already being excited in its potential, this was enough to immediately start work on our support for Litestream, creating load tests calling ServiceStack [AutoQuery APIs](/autoquery/) querying SQLite + Litestream to test the viability for ourselves which we we're pleasantly surprised to see it's performance and cost savings held up under load: 

<section class="not-prose my-10 text-center">
    <div class="container">
        <div class="">
            <h3 id="savings-at-scale" class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Savings at Scale</span>
            </h3>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                SQLite directly benefits from improving hardware's faster CPUs and SSDs with superior locality to comfortably handle most App's needs. 
            </p>
        </div>
        <img src="/img/pages/litestream/litestream-costs-perf.svg">
    </div>
</section>

We share Ben's enthusiasm and thoughts on [SQLite has become a viable option](https://fly.io/blog/all-in-on-sqlite-litestream/#you-should-take-this-option-more-seriously) for Server-side production App databases that can handle most App needs. Litestream's 
architecture [does have limitations](https://fly.io/blog/all-in-on-sqlite-litestream/#small-fast-reliable-globally-distributed-choose-any-four) where it's only suitable for single-node applications, its effortless replication will let you scale out your reads to read-only replicas, but your writes need to be either sharded or limited to a single Application. 

In effect, instead of managing Kubernetes clusters you'll need to scale up [Majestic Monolith's](https://m.signalvnoise.com/the-majestic-monolith/), a practice some high-performance sites like [StackOverflow have adopted](https://www.hanselminutes.com/847/engineering-stack-overflow-with-roberta-arcoverde) who instead of caching hot pages, have evaluated it was better to give their SQL Server 1.5TB RAM. An architectural overview of servers used to handle their impressive load:

 - 2B page views /month
 - 6000 req /sec
 - 9 servers @ 5/10% capacity
 - 1.5 TB RAM SQL Server

So whilst scaling up is an option, SQLite's no-frills core SQL featureset allows for easy migrations should you wish to migrate to micro services in future, a task effortless in [OrmLite](/ormlite/) which provides an implementation agnostic abstraction for the most popular RDBMS's.

<section class="not-prose text-center">
    <div class="container">
        <div class="">
            <h3 id="effortless-migrations" class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Effortless Migrations</span>
            </h3>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                No Lock-in. Migrate off whenever you want. <br> <br>
                Using SQLite with <a href="/ormlite/">OrmLite's</a> fast, typed APIs
                lets you easily migrate to any of its 
                <a href="/ormlite/installation">supported RDBMS</a> with just configuration, no other code changes required.
            </p>
        </div>
        <div class="flex justify-center pb-8 my-8">
            <img src="/img/pages/litestream/litestream-migrate.svg" class="max-w-screen-md">
        </div>
    </div>
</section>

The beauty of Litestream is that it happily runs in the background transparent to your application who doesn't need to make any changes to take advantage of it, the way to enable it is by including Litestream along with your app's deployment workflow and running it as a dedicated [sidecar container](https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar) where it restores and watches for updates to your SQLite database, replicating those changes to your configured storage.


<section class="not-prose my-20 text-center">
    <div class="container">
        <div class="">
            <h3 id="litestream-apps" class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Create Litestream Apps</span>
            </h3>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">                              
                To make it easy, we've created <a href="/github-action-templates">GitHub Action</a> Docker Compose configurations for each of Litestream's popular Storage options:
            </p>
        </div>
    </div>
</section>

<section class="not-prose my-20 text-center">
    <div class="flex">
        <div class="flex flex-1 flex-col">
            <a href="https://servicestack.net/litestream#Name=MyApp&Mix=x-litestream-aws">
                <img src="/img/pages/litestream/aws_square.svg" alt="AWS S3" class="w-52">
            </a>
            <span class="block text-2xl font-medium text-gray-900">
                S3 Simple Storage Service
            </span>
        </div>
        <div class="flex flex-1 flex-col">
            <a href="https://servicestack.net/litestream#Name=MyApp&Mix=x-litestream-azure">
                <img src="/img/pages/litestream/azure_square.svg" alt="Azure Blob Storage" class="w-52">
            </a>
            <span class="block text-2xl font-medium text-gray-900">
                Azure Blob Storage
            </span>
        </div>
        <div class="flex flex-1 flex-col">
            <a href="https://servicestack.net/litestream#Name=MyApp&Mix=x-litestream-sftp">
                <img src="/img/pages/litestream/sftp.png" alt="SFTP" class="w-52">
            </a>
            <span class="block text-2xl font-medium text-gray-900">
                SSH File Transfer Protocol
            </span>
        </div>
    </div>
    <div class="mt-10">
        <p class="max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">                              
            That you can mix with any modern C# jamstacks.net Project Templates:
        </p>
        <a href="https://servicestack.net/litestream#create">
            <img src="/img/pages/litestream/litestream-project-templates.png" class="max-w-prose">
        </a>
    </div>
</section>

Alternatively as the [Docker compose](/github-action-templates) configurations are delivered as [mix](/mix-tool) configurations, they can also be applied to existing projects, e.g:

::: sh
npx add-in litestream-aws
:::

Since Litestream is tied to deployment, hosting environment & preferred configured storage, we've had to create a matrix of configurations to integrate with each of the above templates.

| Project Template     | AWS S3                  | Azure Blob Storage        | SFTP (generic)           | 
|----------------------|-------------------------|---------------------------|--------------------------|
| **web**              | litestream-aws          | litestream-azure          | litestream-sftp          | 
| **blazor**           | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **blazor-vue**       | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **blazor-wasm**      | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **vue-vite**         | jamstack-litestream-aws | jamstack-litestream-azure | jamstack-litestream-sftp |
| **nextjs**           | jamstack-litestream-aws | jamstack-litestream-azure | jamstack-litestream-sftp |

## GitHub Action Workflow

These GitHub Action configurations are an effortless way to create and deploy new Applications within minutes, which only need to be filled in with your environment's access credentials configured in your [projects GitHub Action Secrets](/litestream-templates.html#github-action-workflow).

For a detailed overview for creating and setting up deployment for a new App from scratch checkout:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="fY50dWszpw4" style="background-image: url('https://img.youtube.com/vi/fY50dWszpw4/maxresdefault.jpg')"></lite-youtube>
