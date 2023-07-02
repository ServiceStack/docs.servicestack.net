---
slug: fsharp
title: F# Resources
---

Thanks to the simplicity, elegance, strong typing and philosophy of both solutions, FSharp and ServiceStack are quickly becoming a popular choice for creating friction-less REST and message-based remote services.

### .NET Core F# Project

You can create a new .NET Core F# project in a new empty directory using the [x dotnet tool](/dotnet-tool) with:

```bash
$ dotnet tool install --global x 
$ mkdir ProjectName && cd ProjectName
$ x mix init-fsharp
$ dotnet run
```


Which will download the [init-fsharp Gist](https://gist.github.com/gistlyn/4802ba22b665e68c7257aef9f57c1934) to your local directory 
where you can use its dep-free [/index.html](https://gist.github.com/gistlyn/4802ba22b665e68c7257aef9f57c1934#file-wwwroot-index-html) and its
`JsonServiceClient` to call its **/hello** API:

![](/img/pages/release-notes/v5.9/init.png)

### [Complete F# Console Self-Host Example](https://github.com/ServiceStack/Test/blob/713f1e2c9fce2351446b168d39fe8b0248f252fc/src/VS.FSharp.SelfHost/Program.fs)

For .NET Framework you can use the `AppSelfHostBase` to create a stand-alone self-hosted Console App:

```fsharp
open System
open ServiceStack

type Hello = { mutable Name: string; }
type HelloResponse = { mutable Result: string; }
type HelloService() =
    interface IService
    member this.Any (req:Hello) = { Result = "Hello, " + req.Name }

//Define the Web Services AppHost
type AppHost =
    inherit AppSelfHostBase
    new() = { inherit AppSelfHostBase("Hi F#!", typeof<HelloService>.Assembly) }
    override this.Configure container =
        base.Routes
            .Add<Hello>("/hello")
            .Add<Hello>("/hello/{Name}") |> ignore

//Run it!
[<EntryPoint>]
let main args =
    let host = if args.Length = 0 then "http://*:1337/" else args.[0]
    printfn "listening on %s ..." host
    let appHost = new AppHost()
    appHost.Init() |> ignore
    appHost.Start host |> ignore
    Console.ReadLine() |> ignore
    0
```

# Community Resources

  - [SignalR + Servciestack with F# hosted on Azure](http://kunjan.in/2014/06/signalr-servicestack-azure-with-fsharp/) by [@kunjee](https://twitter.com/kunjee)
  - [Servicestack F# template. Starting from the Start](http://kunjan.in/2014/02/servicestack-fsharp-template-starting-from-start/) by [@kunjee](https://twitter.com/kunjee)
  - [Simple.Web and ServiceStack F# Templates](http://bloggemdano.blogspot.co.uk/2013/12/simpleweb-and-servicestack-templates.html) by [@dmohl](https://twitter.com/dmohl)
  - [Web services using ServiceStack framework in F#](https://github.com/chirdeeptomar/ServiceStackFSharpSample) by [@chirdeeptomar](https://twitter.com/chirdeeptomar)
  - [Last-Fi (F#, Raspberry Pi, Last.Fm, FunScript and ServiceStack)](http://pinksquirrellabs.com/post/2013/07/04/Last-Fi.aspx) by [@pezi_pink](https://twitter.com/pezi_pink)
  - [ServiceStack, With F# on Linux (inc Vagrant / Puppet)](http://saxonmatt.co.uk/2013/07/service-stack-fsharp-mono-fastcgi-nginx.html) by [@mattdrivendev](https://twitter.com/MattDrivenDev)
  - [Declarative authorization in REST services in SharePoint with F#](http://sergeytihon.wordpress.com/2013/06/28/declarative-authorization-in-rest-services-in-sharepoint-with-f-and-servicestack/) by [@sergey_tihon](https://twitter.com/sergey_tihon)
  - [ServiceStack and F# on Heroku (GitHub)](https://github.com/kunjee17/ServiceStackHeroku) by [@kunjee](https://twitter.com/kunjee)
  - [First hand experience with F#](http://d4dilip.wordpress.com/2013/04/09/first-hand-experience-with-f/) by [@d4dilip](https://twitter.com/d4dilip)
  - [ServiceStack: New API – F# Sample](http://sergeytihon.wordpress.com/2013/02/28/servicestack-new-api-f-sample-web-service-out-of-a-web-server/) by [@sergey_tihon](https://twitter.com/sergey_tihon)
  - [Async, Cached Twitter API Proxy in F#](http://www.servicestack.net/mythz_blog/?p=811) by [@demisbellot](https://twitter.com/demisbellot)
  - [F# Web Services on any platform in and out of a web server!](http://www.servicestack.net/mythz_blog/?p=785) by [@demisbellot](https://twitter.com/demisbellot)
