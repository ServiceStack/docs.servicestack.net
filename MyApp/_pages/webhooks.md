---
slug: webhooks
title: Web Hooks
---

Add Webhooks to your ServiceStack services, and allow other services to integrate with yours across the web.

## [ServiceStack.Webhooks](https://github.com/jezzsantos/servicestack.webhooks)

The [WebHookFeature](https://github.com/jezzsantos/servicestack.webhooks) plugin 
by [Jezz Santos](https://github.com/jezzsantos) makes it very easy to expose webhook notifications from your ServiceStack services, 
and helps you manage your user's subscriptions to those webhooks.:

:::copy
`<PackageReference Include="ServiceStack.Webhooks" Version="3.*" />`
:::

By adding the `WebhookFeature` to the `AppHost` of your service, 
you automatically get all the pieces you need to raise and manage the events raised by your services.

```csharp
public override void Configure(Container container)
{
    // Add ValidationFeature and AuthFeature plugins first

    Plugins.Add(new WebhookFeature());
}
```

![](https://raw.githubusercontent.com/jezzsantos/ServiceStack.Webhooks/master/docs/img/pages/Webhooks.Architecture.PNG)

See [Getting Started](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki/Getting-Started) for more details.

## Raising Events

To raise events from your own services:

1. Add the `IWebhooks` dependency to your service
2. Call: `IWebhooks.Publish<TDto>(string eventName, TDto data)`

As simple as this:

```
internal class HelloService : Service
{
    public IWebhooks Webhooks { get; set; }

    public HelloResponse Any(Hello request)
    {
        Webhooks.Publish("hello", new HelloEvent{ Text = "I said hello" });
    }
}
```

## Subscribing to Events

Subscribers to events raised by your services need to create a webhook subscription to those events.

They do this by POSTing something like the following, to your service:

```
POST /webhooks/subscriptions
{
    "name": "My Webhook",
    "events": ["hello", "goodbye"],
    "config": {
        "url": "http://myserver/api/incoming",
    }
}
```

## Consuming Events

To consume events, a subscriber needs to provide a public HTTP POST endpoint on the internet that would receive the POSTed webhook event. 

The URL to that endpoint is defined in the `config.url` of the subscription (above).

In the case of the "hello" event (raised above), the POSTed event sent to the subscriber's endpoint might look something like this:

```
POST http://myserver/hello HTTP/1.1
Accept: application/json
User-Agent: ServiceStack .NET Client 4.56
Accept-Encoding: gzip,deflate
X-Webhook-Delivery: 7a6224aad9c8400fb0a70b8a71262400
X-Webhook-Event: hello
Content-Type: application/json
Host: myserver
Content-Length: 26
Expect: 100-continue
Proxy-Connection: Keep-Alive

{
    "Text": "I said hello"
}
```

To consume this event with a ServiceStack service, the subscriber would standup a public API like the one below, that could receive the 'Hello' event. That might have been raised from another service with a call to `Webhooks.Publish("hello", new HelloEvent{ Text = "I said hello" })`:

```
internal class MyService : Service
{
    public void Post(HelloDto request)
    {
        // They said hello!
        var message = request.Text;

       
        // The event name, messaging metadata are included in the headers
        var eventName = Request.Headers["X-Webhook-Event"];
        var deliveryId = Request.Headers["X-Webhook-Delivery"];
        var signature = Request.Headers["X-Hub-Signature"];
    }
}

[Route("/hello", "POST")]
public class HelloDto
{
    public string Text { get; set; }
}
```

Note: Webhook events can be delivered securely to subscribers using signatures, that proves the authenticity of the sender only. Delivered events are never encrypted, and only signed. See [Subscriber Security](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki/Subscriber-Security) for more details.

# [Documentation](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki)

More documentation about how the `WebhookFeature` works, and how to customize it are available in [here](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki)

# Plugins

  - [Custom sinks and stores](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki/Plugins)
