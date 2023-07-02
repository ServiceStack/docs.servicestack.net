---
title: Real World Performance
---

We maintain a list of external benchmark results here people have been experiencing to provide an idea of the relative performance you can expect from real-world usage:

#### [Get 25k rows from MS SQL Express and convert to JSON](https://twitter.com/lukaszgasior/status/331704240085028864)

```
EF & JSON.NET                         2300ms
EF [AsNoTracking] & JSON.NET           973ms
EF [AsNoTracking] & ServiceStack       809ms
Simple.Data & JSON.NET                1598ms
Simple.Data & ServiceStack             933ms
ServiceStack.OrmLite & JSON.NET        405ms
ServiceStack.OrmLite & ServiceStack    245ms
```

#### [ServiceStack vs WebApi client / server end-to-end results](https://twitter.com/anilmujagic/status/272544925478973440)

```
ServiceStack                 9667ms
WebApi                      30407ms
```

GitHub project for the benchmarks are at:
[https://github.com/anilmujagic/ServiceBenchmark](https://github.com/anilmujagic/ServiceBenchmark)

#### [ServiceStack: a good alternative to WCF (French)](http://sgbd.arbinada.com/node/77)

```
ServiceStack                    19s
WCF Data Services (Optimized)   28s
WCF Data Services               48s
```

#### [ServiceStack.net](http://fir3pho3nixx.blogspot.com/2011/04/servicestacknet.html)

> One thing that I was completely surprised by today was the performance of the open source ServiceStack.NET frameworks. Even with the performance tuned release of JSON.NET I found that ServiceStack.Text beat it by a rediculous margin. It serialises 2x faster and deserialises 4x faster.

#### [Redis vs RavenDB – Benchmarks for .NET Client NoSQL Solutions](http://www.servicestack.net/mythz_blog/?p=474)

```
Redis (Cygwin)                254ms
Redis (Cygwin + fsync)        543ms
Raven DB                     2983ms
```
