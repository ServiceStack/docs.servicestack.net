---
slug: ssl-redis-azure
title: Secure SSL Redis connections
---

[ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis) client includes support for SSL making it suitable for accessing remote Redis server instances over a secure SSL connection.

Redis is normally used as a back-end datastore whose access is typically limited to Internal networks or authorized networks protected via firewalls, when communicating outside of your VPC you'll typically want to communicate over SSL. 

### General SSL Info

ServiceStack.Redis uses .NET's [SslStream](https://docs.microsoft.com/en-us/dotnet/api/system.net.security.sslstream.-ctor?view=net-5.0#System_Net_Security_SslStream__ctor_System_IO_Stream_System_Boolean_System_Net_Security_RemoteCertificateValidationCallback_System_Net_Security_LocalCertificateSelectionCallback_) to establish its SSL connection where you can configure its [RemoteCertificateValidationCallback](https://docs.microsoft.com/en-us/dotnet/api/system.net.security.remotecertificatevalidationcallback?view=net-5.0) to validate whether to accept the specified certificate for authentication:

```csharp
RedisConfig.CertificateValidationCallback = (object sender,
    X509Certificate certificate,
    X509Chain chain,
    SslPolicyErrors sslPolicyErrors) => {
    //...
};
```

And a [LocalCertificateSelectionCallback](https://docs.microsoft.com/en-us/dotnet/api/system.net.security.localcertificateselectioncallback?view=net-5.0) to select the local SSL certificate used for authentication:

```csharp
RedisConfig.CertificateSelectionCallback = (object sender,
    string targetHost,
    X509CertificateCollection localCertificates,
    X509Certificate remoteCertificate,
    string[] acceptableIssuers) => {
    //...
}
```

### Specify SSL and TLS Version

You can specify to use SSL and what TLS version to use on your connection string, e.g:

```csharp
var connString = $"redis://{Host}?ssl=true&sslprotocols=Tls12&password={Password.UrlEncode()}";
var redisManager = new RedisManagerPool(connString);
using var client = redisManager.GetClient();
//...
```

If using `RedisSentinel` SSL needs to be specified on both host connection string and `HostFilter`, e.g: 

```csharp
var sentinel = new RedisSentinel(connString, masterName) {
    HostFilter = host => $"{host}?ssl=true&sslprotocols=Tls12"
};
container.Register(c => sentinel.Start());
```

### Secure SSL Redis connections to Azure Redis

The SSL Support in the Redis Client also enables secure access to a redis-server instance over the Internet and public networks as well, a scenario that's been recently popularized by Cloud hosting environments like [Azure Redis Cache](http://azure.microsoft.com/en-us/services/cache/).

## Getting Started

First we'll need a Redis instance to connect to, for this example we will be using Azure, so you will need an active account which you can create at the [Azure home page](https://azure.microsoft.com/).

Once you have access to the [Azure portal](https://portal.azure.com/), we can create a new Redis instance with 3 easy steps:

1 . Click `New` at the bottom left of the portal

![New](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-new-button.png)

2 . Select Redis Cache from the list

![Redis instance menu item](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-create-redis.png)

3 . Specify a DNS name, size, resource group and location

![Create instance](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-create-redis-demo.png)

It may take a while for the Redis Cache instance to be ready to use, from experience with a 1GB Basic instance, it takes around 15+ minutes.

Once the instance is ready, we can grab the **password** generated for us from the **Keys tile**. If we copy the key, and store it somewhere our host can access it, we can start connecting to Redis.

![Created Redis Instance and Keys menu](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-redis-instance.png)

## Configuring our AppHost

We have all the require information and our Redis Cache instance is running, we can now configure our AppHost to use it! 

To make it simple to use the [IRedisClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClient.cs) from our web service methods, we can register an `IRedisClientsManager` to handle the clients for us. This way, we can use the `base.Redis` property from our services to access the Redis server instance. 

```cs
public override void Configure(Container container)
{
    var connString = AppSettings.GetString("RedisConnectionString");
    container.Register<IRedisClientsManager>(c => 
        new RedisManagerPool(connectionString));
}
```

We are getting our Redis connection string from our Web.Config `<appSettings/>`. The Redis connection string is made up of the domain name of the instance parsing query string parameters to specify other configuration options. In our example the format of the connection string looks like:

```
{AzureRedisKey}@servicestackdemo.redis.cache.windows.net?ssl=true 
```

## Accessing Redis from a Web Service

We can now try a simple example to test that our instance is working. Here's an example of a simple "Todo" service that persists items to our Redis instance:

```cs
// Create your ServiceStack Web Service
public class TodoService : Service
{
    public object Get(Todo todo)
    {
        //Return a single Todo if the id is provided.
        if (todo.Id != default(long))
            return Redis.As<Todo>().GetById(todo.Id);

        //Return all Todos items.
        return Redis.As<Todo>().GetAll();
    }

    // Handles creating the Todo items.
    public Todo Post(Todo todo)
    {
        var todos = Redis.As<Todo>();

        //Get next id for new todo
        todo.Id = todos.GetNextSequence();

        todos.Store(todo);

        return todo;
    }

    // Handles updating the Todo items.
    public Todo Put(Todo todo)
    {
        Redis.As<Todo>().Store(todo);
        return todo;
    }

    // Handles Deleting the Todo item
    public void Delete(Todo todo)
    {
        Redis.As<Todo>().DeleteById(todo.Id);
    }
}

[Route("/todo")]
[Route("/todo/{Id}")]
public class Todo
{
    public long Id { get; set; }
    public string Content { get; set; }
    public int Order { get; set; }
    public bool Done { get; set; }
}
```

You can try a redis-powered TODO's web app like this in our [todos.netcore.io](http://todos.netcore.io) Live Demo. A more comprehensive example can be seen in the [Repository.cs](https://github.com/ServiceStackApps/RedisStackOverflow/blob/master/src/RedisStackOverflow/RedisStackOverflow.ServiceInterface/IRepository.cs) used to power the [RedisStackOverflow Live Demo](http://redisstackoverflow.netcore.io/).

Another property automatically injected when registering our `RedisManagerPool` is `base.Cache` which provides a substitutable [Caching abstraction](/caching) our Services can use to cache results. E.g. we can make use of ServiceStack's high-level Caching API in [Request.ToOptimizedResultUsingCache](/caching#cache-a-response-of-a-service) to enable maximum performance of your Services:

```cs
public object Get(CachedCustomers request)
{
    return base.Request.ToOptimizedResultUsingCache(this.Cache, 
        "urn:customers", () =>
            this.ResolveService<CustomersService>()
            .Get(new Customers()));
}
```

This snippet is from the [Northwind example](https://github.com/ServiceStackApps/Northwind).

## Troubleshooting

### Add Required SSL Certificates to work in Mono

Connecting to Azure Redis Cache via SSL requires Microsoft SSL Certificates. The required certificates can be imported and registered with Mono by running the commands below:

```bash
$ sudo mozroots --import --machine --sync
$ sudo certmgr -ssl -m https://go.microsoft.com
$ sudo certmgr -ssl -m https://nugetgallery.blob.core.windows.net
$ sudo certmgr -ssl -m https://nuget.org
```
