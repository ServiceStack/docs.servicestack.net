---
slug: auto-mapping
title: Auto Mapping
---

## Using ServiceStack's Built-in Auto-mapping

Although [we encourage keeping separate DTO models](http://stackoverflow.com/a/15369736/85785), you don't need to maintain your own manual mapping as you can use ServiceStack's built-in Auto Mapping support. It's quite comprehensive and resilient and does a good job in being able to co-erce one type into another, e.g. you can convert between different Enum types with the same name, between Enums and any value type and Strings, between properties and fields, POCOs and strings and many things in between - some of which can be seen in these [Auto Mapping tests](https://github.com/ServiceStack/ServiceStack.Text/blob/master/tests/ServiceStack.Text.Tests/AutoMappingTests.cs).

Here are some typical common use-cases you're likely to hit in your web service development travels:

Create a new DTO instance, populated with matching properties on viewModel:

```csharp
var dto = viewModel.ConvertTo<MyDto>();

var dto = new { Anon = "Object" }.ConvertTo<MyDto>();
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
var dto = new MyDto { A=1 }
    .PopulateFromPropertiesWithAttribute(viewModel, typeof(CopyAttribute));
```

There is also the inverse for mapping all properties that don't include a specific attribute:

```csharp
var safeUpdate = db.SingleById<MyTable>(id)
    .PopulateFromPropertiesWithoutAttribute(dto, typeof(ReadOnlyAttribute));
```

### Advanced mapping using Converters

You can register a custom Converter mapping using the `AutoMapping.RegisterConverter()` APIs, e.g:

```csharp
// Data.User -> DTO User
AutoMapping.RegisterConverter((Data.User from) => {
    var to = from.ConvertTo<User>(skipConverters:true); // avoid infinite recursion
    to.FirstName = from.GivenName;
    to.LastName = from.Surname;
    return to;
});

// Car -> String
AutoMapping.RegisterConverter((Car from) => $"{from.Model} ({from.Year})");

// WrappedDate -> DateTime
AutoMapping.RegisterConverter((WrappedDate from) => from.ToDateTime());
// DateTime    -> WrappedDate
AutoMapping.RegisterConverter((DateTime from) => new WrappedDate(from));
```

Where it will be called whenever a conversion between `Data.User -> User` or `Car -> String` is needed, inc. nested types and collections.

Converters can also be used when you want to "take over" and override the default conversion behavior.

### Intercept AutoMapping Conversions

The `RegisterPopulator` AutoMapping API can be used to run custom logic after an Auto Mapping Conversion, e.g. after a
`T.ConvertTo<T>()` or `T.PopulateWith(obj)` is performed. 

This is useful when you need to intercept Auto Mapping conversions in external libraries, e.g. you can use this to populate
the UserSession's `UserAuthId` with a different field from your Custom UserAuth:

```csharp
AutoMapping.RegisterPopulator((IAuthSession session, IUserAuth userAuth) => 
{
    if (userAuth is RavenUserAuth ravenUserAuth)
    {
        session.UserAuthId = ravenUserAuth.Key;
    }
});
```

### Advanced mapping using custom extension methods

When mapping logic becomes more complicated we like to use extension methods to keep code DRY and maintain the mapping in one place 
that's easily consumable from within your application, e.g:

```csharp
public static class ConvertExtensions
{
    public static MyDto ToDto(this MyViewModel from)
    {
        var to = from.ConvertTo<MyDto>();
        to.Items = from.Items.ConvertAll(x => x.ToDto());
        to.CalculatedProperty = Calculate(from.Seed);
        return to;
    }
}
```

Which is now easily consumable with just:

```csharp
var dto = viewModel.ToDto();
```

Using C# methods ensures conversion is explicit, discoverable, debuggable, fast and flexible with access to the full C# language at your disposal
whose conversion logic can be further DRY'ed behind reusable extension methods.

If you find you need to call this extension method manually in many places you may want to consider registering a Custom Converter instead.

### Ignore Mapping

Use the `AutoMapping.IgnoreMapping()` API to specify mappings you want to skip entirely, e.g:

```csharp
// Ignore Data.User -> User
AutoMapping.IgnoreMapping<Data.User, User>();
// Ignore List<Data.User> -> List<User>
AutoMapping.IgnoreMapping<List<Data.User>, List<User>>();
```

### Support for Implicit / Explicit Type Casts

The built-in Auto Mapping also supports using any `implicit` or `explicit` Value Type Casts when they exists, e.g:

```csharp
struct A
{
    public int Id { get; }
    public A(int id) => Id = id;
    public static implicit operator B(A from) => new B(from.Id);
}

struct B
{
    public int Id { get; }
    public B(int id) => Id = id;
    public static implicit operator A(B from) => new A(from.Id);
}

var b = new A(1).ConvertTo<B>();
```

### Powerful and Capable

Due to its heavy reliance in [#Script](https://sharpscript.net) and other parts in ServiceStack, the built-in Auto Mapping is a 
sophisticated implementation that covers a large number of use-cases and corner cases when they can be intuitively mapped.

To see a glimpse of its available capabilities check out some of the examples in the docs where it's able to 
[call any method or construct any type dynamically](/reflection-utils#call-any-method-dynamically) using different Types.

Or how it's able to [convert any Reference Type into and out of an Object Dictionary](/reflection-utils#converting-instances-from-an-object-dictionary), 
providing a simple approach to dynamically manipulating Types.

### Populating Types from an Object Dictionary

The `ToObjectDictionary` and `FromObjectDictionary` extension methods are also useful in trying to convert loosely-typed data structures into a Typed POCO's, e.g:

```csharp
var dto = new User
{
    FirstName = "First",
    LastName = "Last",
    Car = new Car { Age = 10, Name = "ZCar" },
};

Dictionary<string,object> map = dtoUser.ToObjectDictionary();

map["LastName"] = "Updated";

User user = (User)map.FromObjectDictionary(typeof(User));
```


  [1]: http://martinfowler.com/eaaCatalog/dataTransferObject.html
  [2]: http://msdn.microsoft.com/en-us/library/ff649585.aspx
  [3]: http://www.palmmedia.de/Blog/2011/8/30/ioc-container-benchmark-performance-comparison
  [4]: /clients-overview
  [5]: http://ayende.com/blog/4769/code-review-guidelines-avoid-inheritance-for-properties
  [6]: https://github.com/AutoMapper/AutoMapper
