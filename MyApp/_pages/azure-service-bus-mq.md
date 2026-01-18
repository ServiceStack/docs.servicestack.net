---
title: Azure Service Bus MQ
---

## Enable in an existing Web App

Use the `servicebus` mixin to register an [MQ Server](/messaging) for Azure Service Bus with an existing .NET App:

:::sh
npx add-in servicebus
:::

## Worker Service Template

To start using Azure Service Bus in stand-alone MQ Servers (i.e. without HTTP access) is to run the MQ Server in an ASP.NET Core Worker Service by starting from a pre-configured project template:

<worker-templates template="worker-servicebus"></worker-templates>

## Manual Configuration

Support for registering Azure Service Bus as an [MQ Server](/messaging) in ServiceStack is available in [ServiceStack.Azure](https://www.nuget.org/packages/ServiceStack.Azure) NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Azure" Version="10.*" />`
:::

Once installed ServiceBus can be configured the same way as any other [MQ Servers](/messaging), by first registering the ServiceBus `IMessageService` provider followed by registering all ServiceStack Services you want to be able to invoke via MQ’s:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureMq))]

namespace MyApp;

public class ConfigureMq : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IMessageService>(c => 
                new ServiceBusMqServer(context.Configuration.GetConnectionString("ServiceBus")));
        })
        .ConfigureAppHost(afterAppHostInit: appHost => {
            var mqServer = appHost.Resolve<IMessageService>().Start();
            // Register MQ endpoints for APIs
            mqServer.RegisterHandler<MyRequest>(ExecuteMessage);
            mqServer.Start();
        });
}
```
