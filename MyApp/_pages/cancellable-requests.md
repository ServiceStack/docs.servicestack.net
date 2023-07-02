---
slug: cancellable-requests
title: Cancellable Requests
---

The Cancellable Requests Feature makes it easy to design long-running Services that are cancellable with an external Web Service Request. To enable this feature, register the `CancellableRequestsFeature` plugin:

```csharp
Plugins.Add(new CancellableRequestsFeature());
```

## Designing a Cancellable Service

Then in your Service you can wrap your implementation within a disposable `ICancellableRequest` block which encapsulates a Cancellation Token that you can watch to determine if the Request has been cancelled, e.g: 

```csharp
public object Any(TestCancelRequest req)
{
    using (var cancellableRequest = base.Request.CreateCancellableRequest())
    {
        //Simulate long-running request
        while (true)
        {
            cancellableRequest.Token.ThrowIfCancellationRequested();
            Thread.Sleep(100);
        }
    }
}
```

## Cancelling a remote Service

To be able to cancel a Server request on the client, the client must first **Tag** the request which it does by assigning the `X-Tag` HTTP Header with a user-defined string in a Request Filter before calling a cancellable Service, e.g:

```csharp
var tag = Guid.NewGuid().ToString();
var client = new JsonServiceClient(baseUri) {
    RequestFilter = req => req.Headers[HttpHeaders.XTag] = tag
};

var responseTask = client.PostAsync(new TestCancelRequest());
```

Then at anytime whilst the Service is still executing the remote request can be cancelled by calling the `CancelRequest` Service with the specified **Tag**, e.g: 

```csharp
var cancelResponse = client.Post(new CancelRequest { Tag = tag });
```

If it was successfully cancelled it will return a `CancelRequestResponse` DTO with the elapsed time of how long the Service ran for. Otherwise if the remote Service had completed or never existed it will throw **404 Not Found** in a `WebServiceException`.
