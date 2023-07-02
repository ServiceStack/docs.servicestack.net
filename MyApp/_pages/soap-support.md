---
slug: soap-support
title: SOAP support
---
If you want to support SOAP, you have to ensure you adhere to some additional constraints where each method needs to be defined with the `Any()` endpoint and each DTO needs to be decorated with `[DataContract]` and `[DataMember]` attributes so their metadata is generated in your Services XSD and WSDL metadata.

### Configure

Register the `SoapFormat` Plugin to enable SOAP Support in ServiceStack (Requires ASP.NET Framework):

```csharp
Plugins.Add(new SoapFormat());
```

## SOAP + REST

SOAP only supports a single `POST` request but REST services also make use of `GET`, `PUT`, `DELETE`, etc requests, which aren't used in SOAP. So if you want to support SOAP and REST, you need to create one service for each operation which is also the [recommended API structure](/physical-project-structure) for creating [message-based Services](/why-servicestack#goals-of-service-design). The difference to be able to support SOAP is that Service implementations need to be defined with `Any()`, e.g:

```csharp
//Request DTO - Add DataMember attribute for all properties.
[DataContract]
[Route("/customers", "GET")]
[Route("/customers/{Id}", "GET")]
public class GetCustomers : IReturn<GetCustomersResponse> {...}

public class GetCustomersResponse
{
    [DataMember]
    public List<Customer> Results { get; set; }

    [DataMember]
    public ResponseStatus ResponseStatus { get; set; }
}

[DataContract]
[Route("/customers", "POST")]
public class AddCustomer : IReturn<GetCustomersResponse> {...}

[DataContract]
[Route("/customers/{Id}", "PUT")]
public class UpdateCustomer : IReturn<GetCustomersResponse> {...}

[DataContract]
[Route("/customers/{Id}", "DELETE")]
public class DeleteCustomer : IReturn<GetCustomersResponse> {...}

//Service
public class CustomersService : Service 
{
   public object Any(GetCustomers request){...}
   public object Any(AddCustomer request){...}
   public object Any(UpdateCustomer request){...}
   public object Any(DeleteCustomer  request){...}
}
```

Using `Any` will allow the Service to be executed on each HTTP Verb which is required for SOAP since all SOAP Requests are made with a HTTP POST Request wrapped inside a SOAP message and sent to the fixed `/soap11` or `/soap12` endpoints. You also want to make sure that **all DTO models** have `[DataContract]` attribute (and `[DataMember]` attribute for **all properties**) otherwise the XSD-schema embedded within the WSDL will be partially incomplete.  

## Consuming SOAP Services

Ideally the nicest experience for consuming SOAP Services would be to use a generic [C# ServiceClients](/csharp-client#httpwebrequest-service-clients), e.g:

```csharp
var client = new Soap12ServiceClient(BaseUrl);

var response = client.Send(new GetCustomers());
```

Although if you could use a generic ServiceClient, you'd typically be better off using the other cleaner and faster endpoints like JSON instead:

```csharp
var client = new JsonServiceClient(BaseUrl);

var response = client.Get(new GetCustomers());
```

In either case you can share your DTOs in your `*.ServiceModel.dll` to use the same DTOs without code-gen or use 
[C# Add ServiceStack Reference](/csharp-add-servicestack-reference) to easily generate DTOs on the client.

### Visual Studios Add Service Reference

Since VS.NET's `Add Service Reference` is optimized for consuming **.asmx** or **WCF** RPC method calls it doesn't properly support multiple return values (e.g. when you also want a ResponseStatus property) where it will generate an ugly proxy API complete with **out** parameters.

If you want to ensure a *pretty proxy* is generated you should only have 1 first-level property which contains all the data you want to return.

### Using XSD.exe

One way around it is to share your services DTO's and use any of the typed [Generic Service Clients](/csharp-client#httpwebrequest-service-clients) that are in-built into ServiceStack. Alternatively you can use the `XSD.exe` command-line utility to generate your types on the client and use those in the typed Service Clients.


### REST-ful registration of multiple services

The Custom `[Route]` definitions are used to control how you want services exposed in REST APIs which all logically appear to exposed them under a single REST-ful resource, i.e:

| Request | Description |
|:-|:-|
| **GET /customers**    | Get All Customers  |
| **GET /customers/1**  | Get Customer #1    |
| **POST /customers**   | Add New Customer   |
| **PUT /customers/1**  | Update Customer #1 |
| **DELETE /customers** | Delete Customer #1 |


This Web Service now supports both **REST and SOAP** with REST API's using the above custom routes and SOAP requests posting WSDL Requests to their fixed `/soap11` or `/soap12` endpoints.

## SOAP Limitations

SOAP expects that each request always returns the same response DTO. So you need to follow the **Response DTO naming convention**, otherwise ServiceStack won't be able to generate the WSDLs and the SOAP endpoint won't be able to work. 

### DTO Naming Conventions

**Naming convention:** `{Request DTO Name} + Response`

#### Example:

**Request DTO** `DeleteCustomer` => **Response DTO** `DeleteCustomerResponse`

If you would leave the services as they are, the REST endpoint wouldn't exist. So you need to hook them all up on the same URL like that:

### Single WSDL Namespace

If you happen to generate requests from the WSDLs with a tool like SoapUI you may end up with an incorrectly generated request like this:

```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
               xmlns:type="http://schemas.servicestack.net/types">
  <soap:Header/>
  <soap:Body>
    <type:Hello/>
  </soap:Body>
</soap:Envelope>
```

You can resolve this issue by adding the following line to your AssemblyInfo file
```csharp
[assembly: ContractNamespace("http://schemas.servicestack.net/types", 
           ClrNamespace = "<YOUR NAMESPACE>")]
```
e.g:

```csharp
[assembly: ContractNamespace("http://schemas.servicestack.net/types",
           ClrNamespace = "MyApp.ServiceModel")]
[assembly: ContractNamespace("http://schemas.servicestack.net/types",
           ClrNamespace = "MyApp.ServiceModel.Types")]
```

Rebuild and regenerate the request from the updated wsdl. You should get a correct request this time.

```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
               xmlns:type="http://schemas.servicestack.net/types">
   <soap:Header/>
   <soap:Body>
      <type:Hello>
         <!--Optional:-->
         <type:Name>?</type:Name>
      </type:Hello>
   </soap:Body>
</soap:Envelope>
```

## Changing the default namespace

A requirement with SOAP endpoints is for all DTO types to share the same single namespace which should match the `Config.WsdlServiceNamespace` if you want to change it from the default namespace: `http://schemas.servicestack.net/types`. E.g. You can change the default WSDL Namespace in your AppConfig with:

```csharp
SetConfig(new HostConfig {
    WsdlServiceNamespace = "http://my.new.namespace.com/types",
});
```

This can easily be done by using the `[assembly:ContractNamespace]` attribute usually defined in the DTO project's AssemblyInfo.cs file, here is how this is done in the [ServiceStack.Examples project](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/ServiceStack.Examples/ServiceStack.Examples.ServiceModel/Properties/AssemblyInfo.cs#L39):

```csharp
[assembly: ContractNamespace("http://my.new.namespace.com/types",
           ClrNamespace = "ServiceStack.Examples.ServiceModel.Operations")]
[assembly: ContractNamespace("http://my.new.namespace.com/types",
           ClrNamespace = "ServiceStack.Examples.ServiceModel.Types")]
```

### SOAP Exceptions

Exceptions in SOAP responses are returned with an `200 OK` HTTP Status so they are deserialized as normal responses in code-generated SOAP clients. The original HTTP Status code is available in the `X-Status` HTTP Header or SOAP Response Header named `X-Status`. This is transparently converted into a typed `WebServiceException` when using ServiceStack's built-in Soap 1.1/1.2 generic Service Clients as seen in [WebServicesTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.IntegrationTests/Tests/WebServicesTests.cs).

To check if the response was an error in non ServiceStack SOAP clients, check the `response.ResponseStatus.ErrorCode` property for a **non-null** value.

#### Convert SOAP Exceptions to SOAP Faults

If preferred, you can also convert SOAP Exceptions into a SOAP Fault by adding a ServiceExceptionHandler, e.g:

```csharp
ServiceExceptionHandlers.Add((req, request, ex) =>
{
    if (req.GetItem(Keywords.SoapMessage) is System.ServiceModel.Channels.Message requestMsg)
    {
        req.Response.UseBufferedStream = true;
        var msgVersion = requestMsg.Version;
        using (var response = XmlWriter.Create(req.Response.OutputStream))
        {
            var message = System.ServiceModel.Channels.Message.CreateMessage(
                msgVersion, new FaultCode("Receiver"), ex.ToString(), null);
            message.WriteMessage(response);
        }
        req.Response.End();
    }
    return null;
});
```

## Customize WSDL's and XSD's

There's finer-grain control available over which **Operations** and **Types** are exported in SOAP WSDL's and XSD's by overriding the new `ExportSoapOperationTypes()` and `ExportSoapType()` methods in your AppHost.

You can exclude specific Request DTO's from being emitted in WSDL's and XSD's with:

```csharp
[Exclude(Feature.Soap)]
public class HiddenFromSoap { .. } 
```

### Raw Access to WCF SOAP Message

`IRequiresSoapMessage` works similar to [IRequiresRequestStream](/serialization-deserialization) interface to tell ServiceStack to skip de-serialization of the request and instead pass the raw WCF Message to the Service instead for manual processing, e.g:

```csharp
public class RawWcfMessage : IRequiresSoapMessage {
	public Message Message { get; set; }
}

public object Post(RawWcfMessage request) { 
	request.Message... //Raw WCF SOAP Message
}
```

### Customize SOAP Response

You can override and customize how the SOAP Message Responses are written, here's a basic example:

```csharp
public override WriteSoapMessage(Message message, Stream outputStream)
{
    using (var writer = XmlWriter.Create(outputStream, Config.XmlWriterSettings))
    {
        message.WriteMessage(writer);
    }
}
```

::: info
The default [WriteSoapMessage](https://github.com/ServiceStack/ServiceStack/blob/fb08f5cb408ece66f203f677a4ec14ee9aad78ae/src/ServiceStack/ServiceStackHost.Runtime.cs#L484) implementation also raises a ServiceException and writes any returned response to a buffered Response Stream (if configured)
:::