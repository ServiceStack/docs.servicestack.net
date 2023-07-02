---
slug: endpoints
title: REST, SOAP & default endpoints
---

When you create a service, there are by default three endpoints:

- User-defined REST endpoint
- SOAP endpoint: `/[soap11|soap12]`
- Default endpoint: `/[xml|json|html|jsv|csv]/[reply|oneway]/[servicename]`

The preferred way to call the webservice is mostly using the REST endpoint. As you have seen, user-defined REST endpoints can be configured with the `Route` attribute for each Request DTO.

But you can also call your service by using the default endpoint, without configuring a REST url with the default endpoint.
Of course there's always the option to use the SOAP endpoint.

## Sample requests:

The possible requests for the following Request DTO are:

```csharp
[Route("/hello")]
public class Hello
{
    public string Name { get; set; }
}
```

## Option 1

### SOAP endpoint

```
POST example.org/soap11
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>

<Hello xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.servicestack.net/types">
  <Name>String</Name>
</Hello>

    </soap:Body>
</soap:Envelope>
```

### Rest endpoint:

```
POST example.org/hello
```

```js
{"Name":"World"}
```

### Default endpoint:

```
POST example.org/json/reply/Hello
```

```json
{"Name":"World"}
```


## Option 2

But you don't need to pass the `Name` of the Request DTO in the request body. There's also the possibility to set the value of `Name` with URL parameters (works only with REST and default endpoint of course).

### REST endpoint:

```
POST example.org/hello?Name=World
```

### Default endpoint:

```
POST example.org/json/reply/Hello?Name=World
```

You can also combine the two approaches. 


## Option 3

Last but not least there exists another way to set the value of `Name`! But this works only with the REST endpoint:
If you add the following mapping to the Request DTO above:

```csharp
[Route("/hello/{Name}")]
```

...you will be able to set the name in the URL itself, without any URL parameters:

### Rest endpoint:

```
GET example.org/hello/World
```

As you can see `{Name}` (in the mapping) is the placeholder for the value of the property `Name`.

::: info Tip
The last two approaches are mostly used for GET and DELETE requests, because often clients don't support to attach a request body for these HTTP methods
:::

::: info Tip
As you may have noticed, ServiceStack is also capable to support different formats (JSON, XML, etc). There exists another separate tutorial about formats
:::