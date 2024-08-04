---
slug: amazon-sqs-mq
title: Amazon SQS MQ
---

## Enable in an existing Web App

Use the `sqs` mixin to register an [MQ Server](/messaging) for Amazon SQS with an existing .NET App:

:::sh
x mix sqs
:::

## Worker Service Template

To start using Amazon SQS in stand-alone MQ Servers (i.e. without HTTP access) is to run the MQ Server in an ASP.NET Core Worker Service by starting from a pre-configured project template:

<worker-templates template="worker-sqs"></worker-templates>

## Manual Configuration

Support for registering Amazon Simple Queue Service (SQS) as an [MQ Server](/messaging) is available in [ServiceStack.Aws](https://www.nuget.org/packages/ServiceStack.Aws) NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Aws" Version="8.*" />`
:::

Once installed SQS can be configured the same way as any other [MQ Servers](/messaging), by first registering the ServiceBus `IMessageService` provider followed by registering all ServiceStack Services you want to be able to invoke via MQ’s:

```csharp
container.Register<IMessageService>(c => new SqsMqServer(
    AwsConfig.AwsAccessKey, AwsConfig.AwsSecretKey, RegionEndpoint.USEast1) {
    DisableBuffering = true, // Trade-off latency vs efficiency
});

var mqServer = container.Resolve<IMessageService>();
mqServer.RegisterHandler<MyRequest>(ExecuteMessage);

AfterInitCallbacks.Add(appHost => mqServer.Start());
```

When an MQ Server is registered, ServiceStack automatically publishes Requests accepted on the "One Way" [pre-defined route](/routing#pre-defined-routes) to the registered MQ broker. The message is later picked up and executed by a Message Handler on a background Thread.

## SQS MQ Server Example

The [AWS Email Contacts](https://github.com/ServiceStackApps/AwsApps/tree/master/src/AwsApps/emailcontacts) example shows the same long-running 
[EmailContact Service](https://github.com/ServiceStackApps/AwsApps/blob/4817f5c6ad69defd74d528403bfdb03e5958b0b3/src/AwsApps/emailcontacts/EmailContactServices.cs#L81)
being executed from both HTTP and MQ Server by just 
[changing which url the HTML Form is posted to](https://github.com/ServiceStackApps/AwsApps/blob/4817f5c6ad69defd74d528403bfdb03e5958b0b3/src/AwsApps/emailcontacts/default.cshtml#L203):

```html
//html
<form id="form-emailcontact" method="POST"
    action="@(new EmailContact().ToPostUrl())" 
    data-action-alt="@(new EmailContact().ToOneWayUrl())">
    ...
    <div>
        <input type="checkbox" id="chkAction" data-click="toggleAction" />
        <label for="chkAction">Email via MQ</label>
    </div>
    ...   
</form>
```

> The urls are populated from a typed Request DTO using the [Reverse Routing Extension methods](/routing#reverse-routing)

Checking the **Email via MQ** checkbox fires the JavaScript handler below that's registered as [declarative event in ss-utils.js](/ss-utils-js#declarative-events):

```js
$(document).bindHandlers({
    toggleAction: function() {
        var $form = $(this).closest("form"), action = $form.attr("action");
        $form.attr("action", $form.data("action-alt"))
                .data("action-alt", action);
    }
});
```

The code to configure and start an SQS MQ Server is similar to [other MQ Servers](/messaging): 

```csharp
container.Register<IMessageService>(c => new SqsMqServer(
    AwsConfig.AwsAccessKey, AwsConfig.AwsSecretKey, RegionEndpoint.USEast1) {
    DisableBuffering = true, // Trade-off latency vs efficiency
});

var mqServer = container.Resolve<IMessageService>();
mqServer.RegisterHandler<EmailContacts.EmailContact>(ExecuteMessage);

AfterInitCallbacks.Add(appHost => mqServer.Start());
```

## Intercepting Filters

A number of new filters are available on `SqsMqServer` and `SqsMqClient` which will let you intercept and apply custom logic before SQS messages are 
sent and received:

```csharp
Action<SendMessageRequest,IMessage> SendMessageRequestFilter
Action<ReceiveMessageRequest> ReceiveMessageRequestFilter
Action<Amazon.SQS.Model.Message, IMessage> ReceiveMessageResponseFilter
Action<DeleteMessageRequest> DeleteMessageRequestFilter
Action<ChangeMessageVisibilityRequest> ChangeMessageVisibilityRequestFilter
```

## Polling Duration

The polling duration used to poll SQS queues can be configured with:

```csharp
new SqsMqServer {
    PollingDuration = TimeSpan.FromMilliseconds(1000) //default
}
```
