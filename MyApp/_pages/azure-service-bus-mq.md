---
slug: azure-service-bus-mq
title: Azure Service Bus MQ
---

Support for registering Azure Service Bus as an [MQ Server](/messaging) in ServiceStack is available in [ServiceStack.Azure](https://www.nuget.org/packages/ServiceStack.Azure) NuGet package:

::: nuget
`<PackageReference Include="ServiceStack.Azure" Version="6.*" />`
:::

Once installed ServiceBus can be configured the same way as any other [MQ Servers](/messaging), by first registering the ServiceBus `IMessageService` provider followed by registering all ServiceStack Services you want to be able to invoke via MQ’s:

```csharp
container.Register<IMessageService>(c => new ServiceBusMqServer(ConnectionString));

var mqServer = container.Resolve<IMessageService>();
mqServer.RegisterHandler<MyRequest>(ExecuteMessage);

AfterInitCallbacks.Add(appHost => mqServer.Start());
```
