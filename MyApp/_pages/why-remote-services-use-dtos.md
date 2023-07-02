---
title: Why Remote Services should use DTOs
slug: why-remote-services-use-dtos
---

Types provide several productivity and compiler benefits when used within the same solution, they're especially more useful 
across process boundaries where they're the only mechanical tool that will be able to determine if Remote Services are being 
consumed correctly, mitigating run-time errors from making it into production where they'll ultimately be discovered by 
end-users who'll exhaust untested corner cases.

## The Service Layer is your most important Contract

The most important interface that you can ever create in your entire system is your external facing service contract, this is what consumers of your service or application will bind to, i.e. the existing call-sites that often won't get updated along with your code-base - every other model is secondary. 

### DTOs are Best practices for remote services

In following of [Martin Fowler's recommendation for using DTOs](http://martinfowler.com/eaaCatalog/dataTransferObject.html) (Data Transfer Objects) for remote services ([MSDN](http://msdn.microsoft.com/en-us/library/ff649585.aspx)), ServiceStack encourages the use of clean, untainted POCOs to define a well-defined contract with that should kept in a largely implementation and dependency-free .dll. The benefits of this allows you to be able to re-use typed DTOs used to define your services with, as-is, in your [C#/.NET Clients](/csharp-client) - providing an end-to-end typed API without the use of any code-gen or other artificial machinery.

### DRY vs Intent

Keeping things DRY should not be confused with clearly stating of intent, which you should avoid trying to DRY or [hide behind inheritance](http://ayende.com/blog/4769/code-review-guidelines-avoid-inheritance-for-properties), magic properties or any other mechanism. Having clean, well-defined DTOs provides a single source of reference that anyone can look at to see what each service accepts and returns, it allows your client and server developers to start their work straight away and bind to the external service models without the implementation having been written. 

Keeping the DTOs separated also gives you the freedom to re-factor the implementation from within without breaking external clients, i.e. your service starts to cache responses or leverages a NoSQL solution to populate your responses with.

It's also provides the authoritative source (that's not leaked or coupled inside your app logic) that's used to create the auto-generated metadata pages, example responses, Swagger support, XSDs, WSDLs, etc. 

### [Using ServiceStack's Built-in auto-mapping](/auto-mapping)

Whilst we encourage keeping separate DTO models, you don't need to maintain your own manual mapping as you can use a mapper like [AutoMapper](https://github.com/AutoMapper/AutoMapper) or using ServiceStack's built-in Auto Mapping support, e.g:

Create a new DTO instance, populated with matching properties on viewModel:

```csharp
var dto = viewModel.ConvertTo<MyDto>();
```

Initialize DTO and populate it with matching properties on a view model:

```csharp
var dto = new MyDto { A = 1, B = 2 }.PopulateWith(viewModel);
```

Initialize DTO and populate it with **non-default** matching properties on a view model:

```csharp
var dto = new MyDto { A = 1, B = 2 }.PopulateWithNonDefaultValues(viewModel);
```

Initialize DTO and populate it with matching properties that are annotated with the **Attr** Attribute on a view model:

```csharp
var dto = new MyDto { A=1 }.PopulateFromPropertiesWithAttribute<Attr>(viewModel);
```

When mapping logic becomes more complicated we like to use extension methods to keep code DRY and maintain the mapping in one place that's easily consumable from within your application, e.g:

```csharp
public static class MappingExtensions
{
    public static MyDto ToDto(this MyViewModel viewModel)
    {
        var dto = viewModel.ConvertTo<MyDto>();
        dto.Items = viewModel.Items.ConvertAll(x => x.ToDto());
        dto.CalculatedProperty = Calculate(viewModel.Seed);
        return dto;
    }
}
```

Which is now easily consumable with just:

```csharp
var dto = viewModel.ToDto();
```


  [3]: http://www.palmmedia.de/Blog/2011/8/30/ioc-container-benchmark-performance-comparison
  [4]: /clients-overview
  [5]: http://ayende.com/blog/4769/code-review-guidelines-avoid-inheritance-for-properties
  [6]: /auto-mapping
  [7]: https://github.com/AutoMapper/AutoMapper
