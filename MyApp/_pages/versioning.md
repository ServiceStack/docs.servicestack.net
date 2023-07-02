---
title: Versioning
---

## Implicit Versioning

You can populate Version numbers in all Request DTO's implementing `IHasVersion`, i.e:

```csharp
public class Hello : IReturn<HelloResponse>, IHasVersion 
{
    public int Version { get; set; }
    public string Name { get; set; }
}
```

By assigning the `Version` property on the Service Clients, e.g:

```csharp
client.Version = 2;
```

Which will auto populate each Request DTO that implements `IHasVersion`, e.g:

```csharp
client.Get(new Hello { Name = "World" });  // Hello.Version=2
```

### Version Abbreviation Convention

A popular convention for specifying versions in API requests is with the `?v=1` QueryString which ServiceStack now uses as a fallback for populating any Request DTO's that implement `IHasVersion` (as above).

::: info
as ServiceStack's message-based design promotes forward and backwards-compatible Service API designs, our recommendation is to only consider implementing versioning when necessary, at which point check out our [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785)
:::