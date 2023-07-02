---
slug: simple-ioc
title: Simple Container
---

[SimpleContainer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Common/SimpleContainer.cs) is an IOC that implements [IContainer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IContainer.cs) - a minimal interface for a useful IOC:

```csharp
public interface IContainer
{
    Func<object> CreateFactory(Type type);

    IContainer AddSingleton(Type type, Func<object> factory);
    
    IContainer AddTransient(Type type, Func<object> factory);

    object Resolve(Type type);

    bool Exists(Type type);
}
```

It's late-bound API supports registering dependencies in the 2 most useful Scopes: Singleton and Transient. Leveraging the utility of extension methods, every IOC implementing `IContainer` also gains the same [Typed Generic API](https://github.com/ServiceStack/ServiceStack/blob/710da129005f3df5dc93ea0e51e6d8a8681ec04e/src/ServiceStack.Common/SimpleContainer.cs#L114), e.g: 

```csharp
container.AddTransient<IFoo,Foo>();
container.AddTransient<IFoo>(() => new Foo());
container.AddTransient<IBar>(() => new Bar());
container.AddTransient(() => new FooImpl());
container.AddTransient<FooImpl>();

container.AddSingleton(typeof(Foo));
container.AddSingleton(() => foo);

var foo = container.Resolve<IFoo>();
var bar = container.Resolve(typeof(IBar));

var hasFoo = container.Exists<IFoo>();
```

Both `Funq.Container` and `SimpleContainer` implement the `IContainer` interface which ServiceStack's [SharpPagesFeature](https://sharpscript.net/docs/script-pages) utilizes to replace the TemplateContext's built-in IOC to use Funq where it shares the same IOC instance and is able to resolve ServiceStack's AppHost dependencies.

## Fast, small, minimal dependency IOC

[Funq](/ioc) was originally chosen for ServiceStack because it was the amongst the fastest, smallest and most embeddable IOC's available with a pleasant Typed API, which is integrated into `ServiceStack.dll` where it provides all IOC functionality in ServiceStack.

`SimpleContainer` is even smaller and faster than Funq and only requires a dependency to `ServiceStack.Common.dll`. It supports AutoWiring, constructor and public property injection but not Funq's other less used features like Child Containers, named dependencies and Request Scoped dependencies.
