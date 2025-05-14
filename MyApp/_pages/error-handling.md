---
slug: error-handling
title: Error Handling
---

## Throwing C# Exceptions

In most cases you won't need to be concerned with ServiceStack's error handling since it provides native support for the normal use-case of throwing C# Exceptions, e.g.:

```csharp 
public object Post(User request) 
{
    if (string.IsNullOrEmpty(request.Name))
        throw new ArgumentNullException("Name");
}
```

### Default Mapping of C# Exceptions to HTTP Errors

By Default C# Exceptions inheriting from:

  - `ArgumentException` or `SerializationException` or `FormatException` is returned as a **400 BadRequest**
  - `NotImplementedException` or `NotSupportedException ` is returned as a **405 MethodNotAllowed** 
  - `FileNotFoundException` is return as **404 NotFound**
  - `AuthenticationException` is returned as **401 Unauthorized**
  - `UnauthorizedAccessException` is returned as **403 Forbidden**
  - `OptimisticConcurrencyException` is returned as **409 Conflict**
  - All Other normal C# Exceptions are returned as **500 InternalServerError**

Other custom mappings can be added to the [Config.MapExceptionToStatusCode dictionary](/error-handling#custom-mapping-of-c-exceptions-to-http-error-status),
by [implementing IHasStatusCode interface](/error-handling#implementing-ihasstatuscode) or by [returning a HttpError](/error-handling#returning-a-httperror).

### WebServiceException 

All Exceptions get injected into the `ResponseStatus` property of your Response DTO that is serialized into your ServiceClient's preferred Content-Type making error handling transparent regardless of your preferred format - i.e., the same C# Error handling code can be used for all ServiceClients.

```csharp 
try 
{
    var client = new JsonApiClient(BaseUri);
    var response = client.Send<UserResponse>(new User());
} 
catch (WebServiceException webEx) 
{
    /*
      webEx.StatusCode        = 400
      webEx.StatusDescription = ArgumentNullException
      webEx.ErrorCode         = ArgumentNullException
      webEx.ErrorMessage      = Value cannot be null. Parameter name: Name
      webEx.StackTrace        = (your Server Exception StackTrace - in DebugMode)
      webEx.ResponseDto       = (your populated Response DTO)
      webEx.ResponseStatus    = (your populated Response Status DTO)
      webEx.GetFieldErrors()  = (individual errors for each field if any)
    */
}
```

Where the `StatusCode` and `StatusDescription` are the HTTP StatusCode and Description which shows the top-level HTTP-layer details that all HTTP Clients see. The StatusDescription is typically short and used to indicate the type of Error returned which by default is the Type of the Exception thrown. HTTP Clients normally inspect the `StatusCode` to determine how to handle the error on the client.

All [Service Clients](/clients-overview) also have access to Application-level Error details which are returned in the Error Response DTO Body where the `ErrorCode` holds the Exception Type and is what clients would inspect to determine and handle the Type of Exception it is whilst the `ErrorMessage` holds the Server Exception Message which provides a human-friendly, longer and descriptive description of the Error that can be displayed to the end user. In [DebugMode](/debugging#debugmode) the `StackTrace` is populated with the Server StackTrace to help front-end developers from identifying the cause and location of the Error.

If the Error refers to a particular field such as a Field Validation Exception, `GetFieldErrors()` holds the error information for each field that has an Error.

These defaults can be changed to provide further customized error responses by the various options below:

### Enabling StackTraces

By default displaying StackTraces in Response DTOs are only enabled in Debug builds, although this behavior is overridable with:

```csharp
SetConfig(new HostConfig { DebugMode = true });
```

### Error Response Types

The Error Response that gets returned when an Exception is thrown varies on whether a conventionally-named `{RequestDto}Response` DTO exists or not. 

#### If it exists:
The `{RequestDto}Response` is returned, regardless of the service method's response type. If the `{RequestDto}Response` DTO has a **ResponseStatus** property, it is populated otherwise no **ResponseStatus** will be returned.  (If you have decorated the `{ResponseDto}Response` class and properties with `[DataContract]/[DataMember]` attributes, then **ResponseStatus** also needs to be decorated, to get populated).

#### Otherwise, if it doesn't:
A generic `ErrorResponse` gets returned with a populated **ResponseStatus** property.

The [Service Clients](/clients-overview) transparently handles the different Error Response types, and for schema-less formats like JSON/JSV/etc there's no actual visible difference between returning a **ResponseStatus** in a custom or generic `ErrorResponse` - as they both output the same response on the wire.

## Custom Exceptions

Ultimately all ServiceStack WebServiceExceptions are just Response DTO's with a populated [ResponseStatus](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ResponseStatus.cs) that are returned with a HTTP Error Status. There are a number of different ways to customize how Exceptions are returned including:

### Custom mapping of C# Exceptions to HTTP Error Status

You can change what HTTP Error Status is returned for different Exception Types by configuring them with:

```csharp 
SetConfig(new HostConfig { 
    MapExceptionToStatusCode = {
        { typeof(CustomInvalidRoleException), 403 },
        { typeof(CustomerNotFoundException), 404 },
    }
});
```

### Returning a HttpError

If you want even finer grained control of your HTTP errors you can either **throw** or **return** an **HttpError** letting you customize the **Http Headers** and **Status Code** and HTTP Response **body** to get exactly what you want on the wire:

```csharp 
public object Get(User request) 
{
    throw HttpError.NotFound($"User {request.Name} does not exist");
}
```

The above returns a **404** NotFound StatusCode on the wire and is a short-hand for: 

```csharp 
new HttpError(HttpStatusCode.NotFound, 
    $"User {request.Name} does not exist");
```

### HttpError with a Custom Response DTO

The `HttpError` can also be used to return a more structured Error Response with:

```csharp
var responseDto = new ErrorResponse { 
    ResponseStatus = new ResponseStatus {
        ErrorCode = typeof(ArgumentException).Name,
        Message = "Invalid Request",
        Errors = new List<ResponseError> {
            new ResponseError {
                ErrorCode = "NotEmpty",
                FieldName = "Company",
                Message = "'Company' should not be empty."
            }
        }
    }
};

throw new HttpError(HttpStatusCode.BadRequest, "ArgumentException") {
    Response = responseDto,
}; 
```

### Implementing IResponseStatusConvertible

You can also override the serialization of Custom Exceptions by implementing the `IResponseStatusConvertible`
interface to return your own populated ResponseStatus instead. This is how `ValidationException` allows customizing the Response DTO is by [having ValidationException implement](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/FluentValidation/ValidationException.cs) the [IResponseStatusConvertible](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Model/IResponseStatusConvertible.cs) interface. 

E.g. Here's a custom Exception example that returns a populated Field Error:  

```csharp
public class CustomFieldException : Exception, IResponseStatusConvertible
{
  ...
    public string FieldErrorCode { get; set; }
    public string FieldName { get; set; }
    public string FieldMessage { get; set; }

    public ResponseStatus ToResponseStatus() => new ResponseStatus {
        ErrorCode = GetType().Name,
        Message = Message,
        Errors = new List<ResponseError> {
            new ResponseError {
                ErrorCode = FieldErrorCode,
                FieldName = FieldName,
                Message = FieldMessage
            }
        }
    }
}
```

### Implementing IHasStatusCode

In addition to customizing the HTTP Response Body of C# Exceptions with 
[IResponseStatusConvertible](/error-handling#implementing-iresponsestatusconvertible), 
you can also customize the HTTP Status Code by implementing `IHasStatusCode`:

```csharp
public class Custom401Exception : Exception, IHasStatusCode
{
    public int StatusCode => 401;
}
```

Likewise `IHasStatusDescription` can be used to customize the `StatusDescription` and `IHasErrorCode` for customizing the `ErrorCode` returned, instead of its Exception Type.

### Overriding OnExceptionTypeFilter in your AppHost

You can also catch and modify the returned `ResponseStatus` returned by overriding `OnExceptionTypeFilter` in your AppHost, e.g. [ServiceStack uses this](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServiceStackHost.Runtime.cs#L310) to customize the returned ResponseStatus to automatically add a custom field error for `ArgumentExceptions` with the specified `ParamName`, e.g:

```csharp
public virtual void OnExceptionTypeFilter(
    Exception ex, ResponseStatus responseStatus)
{
    var argEx = ex as ArgumentException;
    var isValidationSummaryEx = argEx is ValidationException;
    if (argEx != null && !isValidationSummaryEx && argEx.ParamName != null)
    {
        var paramMsgIndex = argEx.Message.LastIndexOf("Parameter name:");
        var errorMsg = paramMsgIndex > 0
            ? argEx.Message.Substring(0, paramMsgIndex)
            : argEx.Message;

        responseStatus.Errors.Add(new ResponseError
        {
            ErrorCode = ex.GetType().Name,
            FieldName = argEx.ParamName,
            Message = errorMsg,
        });
    }
}
```

### Intercept Service Exceptions

As an alternative way of customizing Service Exceptions is to override `OnExceptionAsync()`
callback in your `Service` class (or base class) to intercept and modify Request DTOs, Responses or Error Responses, e.g:

```csharp
class MyServices : Service
{
    //Return custom error with additional metadata
    public override Task<object> OnExceptionAsync(object requestDto, Exception ex)
    {
        var error = DtoUtils.CreateErrorResponse(requestDto, ex);
        if (error is IHttpError httpError)
        {                
            var errorStatus = httpError.Response.GetResponseStatus();
            errorStatus.Meta = new Dictionary<string,string> {
                ["InnerType"] = ex.InnerException?.GetType().Name
            };
        }
        return Task.FromResult(error);
    }
}
```

::: info
Return `null` to continue with default error handling
:::

### Custom HTTP Errors

In Any Request or Response Filter you can short-circuit the [Request Pipeline](/order-of-operations) by emitting a Custom HTTP Response and Ending the request, e.g:

```csharp
this.PreRequestFilters.Add((req,res) => 
{
    if (req.PathInfo.StartsWith("/admin") && 
        !req.GetSession().HasRole("Admin", req.TryResolve<IAuthRepository>())) 
    {
        res.StatusCode = (int)HttpStatusCode.Forbidden;
        res.StatusDescription = "Requires Admin Role";
        res.EndRequest();
    }
});
```

Or if you need access to the Request DTO you can use a [Global Request Filter](/request-and-response-filters) instead, e.g:

```csharp
GlobalRequestFilters.Add((req,res,dto) => {
    if (req.Verb == HttpMethods.Post && dto is Authenticate authDto 
        && authDto.provider == CredentialsAuthProvider.Name && !authDto.UseTokenCookie) {
        res.StatusCode = (int)HttpStatusCode.Forbidden;
        res.StatusDescription = "Must use stateless JWT Cookies";
        res.EndRequest();       
    }
});
```

::: info
To end the Request in a  Custom HttpHandler use `res.EndHttpHandlerRequest()`
:::

### Fallback Error Pages

Use `IAppHost.GlobalHtmlErrorHttpHandler` for specifying a **fallback HttpHandler** for all error status codes, e.g.:

```csharp 
public override void Configure(Container container)
{
    this.GlobalHtmlErrorHttpHandler = new RazorHandler("/oops"),
}
```

For more fine-grained control, use `IAppHost.CustomErrorHttpHandlers` for specifying custom HttpHandlers to use with specific error status codes, e.g:

```csharp 
public override void Configure(Container container)
{
    this.CustomErrorHttpHandlers[HttpStatusCode.NotFound] = 
        new SharpPageHandler("/notfound");
    this.CustomErrorHttpHandlers[HttpStatusCode.Unauthorized] = 
        new SharpPageHandler("/login");
    this.CustomErrorHttpHandlers[HttpStatusCode.Forbidden] = 
        new SharpPageHandler("/forbidden");
}
```

Will render the contents of the `/notfound.html` for 404 NotFound Requests and `/login.html` page for 401 Unauthorized requests if you're using
static HTML, Single Page Apps or [#Script Pages](https://sharpscript.net/docs/script-pages).

If you're using Razor instead you can `RazorHandler` to render `/notfound.cshtml` or `/login.cshtml` ServiceStack Razor pages:

```csharp 
public override void Configure(Container container)
{
    this.CustomErrorHttpHandlers[HttpStatusCode.NotFound] = 
        new RazorHandler("/notfound");
    this.CustomErrorHttpHandlers[HttpStatusCode.Unauthorized] = 
        new RazorHandler("/login");
    this.CustomErrorHttpHandlers[HttpStatusCode.Forbidden] = 
        new RazorHandler("/forbidden");
}
```

### Register handlers for handling Service Exceptions

ServiceStack and its [API Design](/api-design) provides a flexible way to intercept exceptions. If you need a single entry point for all service exceptions, you can add a handler to `AppHost.ServiceExceptionHandler` in `Configure`. To handle exceptions occurring outside of services you can set the global `AppHost.UncaughtExceptionHandlers` handler, e.g.:

```csharp
public override void Configure(Container container)
{
    //Handle Exceptions occurring in Services:

    this.ServiceExceptionHandlers.Add((httpReq, request, exception) => {
        //log your exceptions here
        ...
        return null; //continue with default Error Handling

        //or return your own custom response
        //return DtoUtils.CreateErrorResponse(request, exception);
    });

    //Handle Unhandled Exceptions occurring outside of Services
    //E.g. Exceptions during Request binding or in filters:
    this.UncaughtExceptionHandlers.Add((req, res, operationName, ex) => {
         res.Write($"Error: {ex.GetType().Name}: {ex.Message}");
         res.EndRequest(skipHeaders: true);
    });
}
```

#### Async Exception Handlers

If your handlers need to make any async calls they can use the Async versions instead:

```csharp
this.ServiceExceptionHandlersAsync.Add(async (httpReq, request, ex) =>
{
    await LogServiceExceptionAsync(httpReq, request, ex);

    if (ex is UnhandledException)
        throw ex;

    if (request is IQueryDb)
        return DtoUtils.CreateErrorResponse(request, new ArgumentException("AutoQuery request failed"));

    return null;
});

this.UncaughtExceptionHandlersAsync.Add(async (req, res, operationName, ex) =>
{
    await res.WriteAsync($"UncaughtException '{ex.GetType().Name}' at '{req.PathInfo}'");
    res.EndRequest(skipHeaders: true);
});
```

### GatewayExceptionHandlers

Gateway Exception Handlers provide the same Exception Handling callbacks as ServiceExceptions which you can use
to intercept Exceptions from Gateway requests:

```csharp
IAppHost.GatewayExceptionHandlers
IAppHost.GatewayExceptionHandlersAsync 
```

Gateway Exceptions can also be intercepted in your `AppHost` by overriding:

```csharp
public override async Task OnGatewayException(IRequest httpReq, object request, Exception ex) => ...
```

### Error handling using a custom ServiceRunner

If you want to provide different error handlers for different actions and services you can just tell ServiceStack to run your services in your own custom [IServiceRunner](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceRunner.cs) and implement the **HandleException** event hook in your AppHost:

```csharp
public override IServiceRunner<TRequest> CreateServiceRunner<TRequest>(
    ActionContext actionContext)
{           
    return new MyServiceRunner<TRequest>(this, actionContext); 
}
```

Where **MyServiceRunner** is just a custom class implementing the custom hooks you're interested in, e.g.:

```csharp
public class MyServiceRunner<T> : ServiceRunner<T> 
{
    public MyServiceRunner(IAppHost appHost, ActionContext actionContext) 
        : base(appHost, actionContext) {}

    public override Task<object> HandleExceptionAsync(IRequest req, TRequest requestDto, 
        Exception ex, object service) {
      // Called whenever an exception is thrown in your Services Action
    }
}
```

# Community Resources

  - [ServiceStack Exceptions and Errors](http://www.philliphaydon.com/2012/03/09/service-stack-exceptions-and-errors/) by [@philliphaydon](https://twitter.com/philliphaydon)
