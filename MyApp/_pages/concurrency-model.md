---
title: Concurrency Model
---

ServiceStack doesn't have a configurable concurrency model per AppHost, it is dependent upon the AppHost that your ServiceStack services are hosted with:

## ASP.NET Host (AppHostBase)

For ASP.NET web hosts, ServiceStack **doesn't create any new threads** itself, the requests are simply handled on the same IIS/Nginx/etc ASP.NET HTTP WebWorker that handles the request.

## HttpListener Self-Host (AppSelfHostBase) 

The default Self-Host HttpListener option for ServiceStack that executes requests on the [SmartThreadPool](http://www.codeproject.com/Articles/7933/Smart-Thread-Pool) managed ThreadPool. By default it executes on `Environment.ProcessorCount * 2` or maximum of 16 worker threads. See this chart for the [performance of the different ServiceStack Hosts](https://github.com/ServiceStack/ServiceStack/blob/master/release-notes.md#new-much-faster-self-host).

## HttpListener Pool Self-Host (AppHostHttpListenerPoolBase)

This is another Self-Host HttpListener option for ServiceStack that uses its own managed ThreadPool to execute requests on (free-ing up the HttpListener async callback thread). The default poolSize of the ThreadPool is **500** threads, though this is configurable in the `AppHostHttpListenerPoolBase(serviceName, handlerPath, poolSize, assembliesWithServices)` constructor.

## HttpListener Single Self-Host (AppHostHttpListenerBase)

ServiceStack only creates a new thread on **Startup** when you call `new AppHost().Start(url)`. There are no new threads created at run-time, i.e. the request is handled on the HttpListener async callback thread.

## RedisMQ Host (RedisMqServer)

A good option for managing long-running tasks is to delegate requests to a [Redis MQ Host](/redis-mq) which is a light-weight MQ Server allowing you to defer and process requests in managed background threads. By default the RedisMqServer spawns a single background thread for each Message type (i.e. Request), though this is configurable on start-up, e.g: in the example below **2 background threads** are used to handle `PostTwitter` requests, whilst only 1 background thread each is used to process `CallFacebook` and `EmailMessage` requests:

```csharp
mqServer.RegisterHandler<PostTwitter>(ServiceController.ExecuteMessage, noOfThreads:2);
mqServer.RegisterHandler<CallFacebook>(ServiceController.ExecuteMessage);
mqServer.RegisterHandler<EmailMessage>(ServiceController.ExecuteMessage);
```
