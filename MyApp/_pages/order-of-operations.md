---
title: Order of Operations
---

## HTTP Custom hooks

This list shows the order in which any user-defined custom hooks are executed.

The first set of filters is used to return the matching `IHttpHandler` for the request:

  1. `HostContext.RawHttpHandlers` are executed before anything else, i.e. returning any ASP.NET `IHttpHandler` by-passes ServiceStack completely and processes your custom `IHttpHandler` instead.
  2. Request is checked if matches any registered routes or static files and directories
  3. If the Request doesn't match it will search `IAppHost.CatchAllHandlers` for a match
  4. `IAppHost.FallbackHandlers` is the last handler executed for finding a handler to handle the request

Any unmatched requests will not be handled by ServiceStack and either returns a 404 NotFound Response in **ASP.NET** or **HttpListener** AppHosts or 
executes the next middleware in-line in **.NET Core** Apps.

Requests handled by ServiceStack execute the custom hooks and filters in the following order:

  1. The `IAppHost.PreRequestFilters` gets executed before the Request DTO is deserialized
  2. Default Request DTO Binding or [Custom Request Binding](/serialization-deserialization#create-a-custom-request-dto-binder) _(if registered)_
  3. Any [Request Converters](/customize-http-responses#request-converters) are executed
  4. [Request Filter Attributes][3] with **Priority < 0** gets executed
  5. Then any [Global Request Filters][1] get executed
  6. Followed by [Request Filter Attributes][3] with **Priority >= 0**
  7. Action Request Filters
  8. Then your **Service is executed** with the configured [Service Filters](/customize-http-responses#intercept-service-requests) and [Service Runner](/customize-http-responses#using-a-custom-servicerunner) **OnBeforeExecute**, **OnAfterExecute** and **HandleException** custom hooks are fired
  9. Action Response Filters
  10. Any [Response Converters](/customize-http-responses#response-converters) are executed
  11. Followed by [Response Filter Attributes][3] with **Priority < 0** 
  12. Then [Global Response Filters][1] 
  13. Followed by [Response Filter Attributes][3] with **Priority >= 0** 
  14. Finally at the end of the Request `IAppHost.OnEndRequest` and any `IAppHost.OnEndRequestCallbacks` are fired

Any time you close the Response in any of your filters, i.e. `httpRes.EndRequest()` the processing of the response is short-circuited and no further processing is done on that request.

## Internal Service Gateway Requests

Internal [Service Gateway](/service-gateway) Requests are executed using `ServiceController.GatewayExecuteAsync` API for invoking **internal/trusted** Services:

  1. Any `Gateway` [Global Request Filters](/request-and-response-filters#global-request-and-response-filters) get executed
  2. Any Validation Filters
  3. Action Request Filters
  4. Then your **Service is executed** with the configured [IServiceRunner](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceRunner.cs) and its **OnBeforeExecute**, **OnAfterExecute** and **HandleException** custom hooks are fired
  5. Action Response Filters
  6. Then `Gateway` [Global Response Filters](/request-and-response-filters#global-request-and-response-filters) 

## MQ (non-HTTP) Custom hooks

MQ Requests are executed using `ServiceController.ExecuteMessage` for invoking **internal/trusted** Services such as [ServiceStack MQ](/messaging):

  1. Any `Message` [Global Request Filters](/request-and-response-filters#message-queue-endpoints) get executed
  2. Action Request Filters
  3. Then your **Service is executed** with the configured [IServiceRunner](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceRunner.cs) and its **OnBeforeExecute**, **OnAfterExecute** and **HandleException** custom hooks are fired
  4. Action Response Filters
  5. Then `Message` [Global Response Filters](/request-and-response-filters#message-queue-endpoints) 
  6. Finally at the end of the Request `IAppHost.OnEndRequest` is fired

## RpcGateway

The `RpcGateway` provides a pure object model API for executing requests through the full HTTP Request pipeline including converting all Errors 
inc. short-circuited Request Pipeline requests into an Error ResponseStatus that's populated into the Response DTO's `ResponseStatus`.

The `RpcGateway` is available via the single `AppHost.RpcGateway` API:

```csharp
Task<TResponse> ExecuteAsync<TResponse>(object requestDto, IRequest req)
```

Unlike MQ Requests which uses `ServiceController.ExecuteMessage` to execute **internal/trusted** Services, the `RpcGateway` executes the full 
**HTTP Request Pipeline** below: 

  1. The `IAppHost.PreRequestFilters` gets executed before the Request DTO is deserialized
  2. Any [Request Converters](/customize-http-responses#request-converters) are executed
  3. [Request Filter Attributes][3] with **Priority < 0** gets executed
  4. Then any [Global Request Filters][1] get executed
  5. Followed by [Request Filter Attributes][3] with **Priority >= 0**
  6. Action Request Filters
  7. Then your **Service is executed** with the configured [Service Filters](/customize-http-responses#intercept-service-requests) and [Service Runner](/customize-http-responses#using-a-custom-servicerunner) **OnBeforeExecute**, **OnAfterExecute** and **HandleException** custom hooks are fired
  8. Action Response Filters
  9. Any [Response Converters](/customize-http-responses#response-converters) are executed
  10. Followed by [Response Filter Attributes][3] with **Priority < 0** 
  11. Then [Global Response Filters][1] 
  12. Followed by [Response Filter Attributes][3] with **Priority >= 0** 
  13. Finally at the end of the Request `IAppHost.OnEndRequest` and any `IAppHost.OnEndRequestCallbacks` are fired

Where requests are executed through the same global Request/Response filters that normal HTTP ServiceStack Services execute
making them suitable for executing external **untrusted** requests.

## Implementation architecture diagram

The [Implementation architecture diagram][2] shows a visual cue of the internal order of operations that happens in ServiceStack:

![ServiceStack Overview](/img/pages/overview/servicestack-overview-01.png)

After the IHttpHandler is returned, it gets executed with the current ASP.NET or HttpListener request wrapped in a common [IHttpRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ServiceHost/IHttpRequest.cs) instance. 

The implementation of [RestHandler](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/WebHost.Endpoints/RestHandler.cs) shows what happens during a typical ServiceStack request:

![ServiceStack Request Pipeline](/img/pages/overview/servicestack-overview-02.png)

  [1]: /request-and-response-filters
  [2]: /architecture-overview
  [3]: /filter-attributes
