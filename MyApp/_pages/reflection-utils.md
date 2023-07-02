---
title: Reflection Utils
slug: reflection-utils
---

Most of ServiceStack's libraries relies on the high-performance reusable utilities in ServiceStack.Text to power many of its features. 

## Dynamically adding Attributes

Many of ServiceStack features are lit up by decorating Request DTOs or Service Implementations with Attributes, In ServiceStack these attributes can also be dynamically added using the `.AddAttributes()` Extension method which enables an auto dynamic Fluent API for programmatically enabling behavior without needing to learn an alternative API for each feature, e.g. We can use this to add Custom Routes, [Restrict Services](/auth/restricting-services) and add [Filter Attributes](/filter-attributes) dynamically with:

```csharp
public class AppHost : AppHostBase 
{
    public AppHost() {

        typeof(MyRequest)
            .AddAttributes(new RouteAttribute("/myrequest"))
            .AddAttributes(new RouteAttribute("/myrequest/{UniqueId}"))
            .AddAttributes(new RestrictAttribute(RequestAttributes.Json))
            .AddAttributes(new MyRequestFilter());

        typeof(MyPoco)
            .AddAttributes(new DataContractAttribute())
            .GetProperty(nameof(MyPoco.LastName))
            .AddAttributes(new DataMemberAttribute { Name = "Surname" });
    }
}
```

::: info
Most Configuration in ServiceStack should be maintained in `Configure()` but as Services are auto-registered before `AppHost.Configure()` is called, Route attributes need to be added before this happens like in the AppHost Constructor or before `new AppHost().Init()`
:::

### Convert into different Types

Underlying [ServiceStack's AutoMapping support](/auto-mapping) is the `object.ConvertTo<T>` extension method which is able to convert any Type into a different Type, e.g:

```csharp
double two = "2".ConvertTo<double>();
```

It's a highly versatile feature were its able to co-erce into different types as expected, e.g. strings into Value and serialized complex Reference Types, between different number types, between different C# collections, etc.

### Call any method dynamically

One of the features in [#Script](https://sharpscript.net) is being able to call any .NET method dynamically with unknown types at runtime which it does using the `MethodInfo.GetInvoker()` extension method which returns a cached compiled delegate that's able to genericize access to any .NET method by transforming `MethodInfo` into the `MethodInvoker` delegate signature below:

```csharp
public delegate object MethodInvoker(object instance, params object[] args);
```

As an example lets call the simple method below dynamically:

```csharp
class TransformDouble
{
    public double Target { get; }
    public TransformDouble(double target) => Target = target;

    public double Add(double value) => Target + value;
}
```

First use Reflection to resolve the `Add` method then call the `GetInvoker()` extension method to resolve a cached `MethodInvoker` delegate:

```csharp
var method = typeof(TransformDouble).GetMethod("Add");
var add = method.GetInvoker();
```

Now we're able to to call the `add` method on any `TransformDouble` instance, e.g:

```csharp
object instance = new TransformDouble(1.0);

add(instance, 2.0) //= 3.0
```

If the argument types the method signature it calls the method directly, otherwise it calls `ConvertTo<T>` above to transform the parameter into the method argument type. So we can call the same `add` invoker with an `int` or a `string` argument and it will return the same value despite the method only being defined to accept a `double`, e.g:

```csharp
invoker(instance, 2)   //= 3.0
invoker(instance, "2") //= 3.0
```

### Call any constructor dynamically

In a similar way of how we can genericize any method we can also genericize any Constructor in the same way using the `ConstructorInfo.GetActivator()` extension method which returns a cached compiled delegate for any object constructor, e.g:

```csharp
var ctor = typeof(TransformDouble).GetConstructors()[0];
var activator = ctor.GetActivator();
```

Likewise we can use the `activator` to create new instances of `TransformDouble` with different runtime types, e.g:

```csharp
((TransformDouble)acivator(1.0)).Target //= 1.0

((TransformDouble)acivator(1)).Target   //= 1.0
((TransformDouble)acivator("1")).Target //= 1.0
```

### Converting Instances from an Object Dictionary

The `ToObjectDictionary` and `FromObjectDictionary` extension methods lets you convert instances into a loosely-typed Object Dictionary where it can be dynamically accessed and manipulated before being used to create and populate an instance of any type, e.g:

```csharp
var customer = new Customer { FirstName = "John", LastName = "Doe" };
var map = customer.MergeIntoObjectDictionary(new { Initial = "Z" });
map["DisplayName"] = map["FirstName"] + " " + map["Initial"] + " " + map["LastName"];
var employee = map.FromObjectDictionary<Employee>();

employee.DisplayName //= John Z Doe
```

Or use it to populate a late-bound type:

```csharp
Type managerType = typeof(Manager);
var manager = (Employee)map.FromObjectDictionary(managerType);
```

### Dynamically Populate Instances

Alternatively an untyped Object Dictionary can also be used to populate an existing instance with `PopulateInstance()`, e.g:

```csharp
var customer = new Customer { FirstName = "John", LastName = "Doe" };
map.PopulateInstance(customer);
```

Being able to treat Types as Object Dictionaries allows us to easily apply generic behavior to POCOs that would be otherwise be tedious like 
we could create a generic method to ensure that all string properties are trimmed with:

```csharp
T TrimStrings<T>(T instance)
{
    var updateStrings = new Dictionary<string, object>();
    instance.ToObjectDictionary().ForEach((key, value) => {
        if (value is string strValue && strValue?.Length > 0)
        {
            var trimmed = strValue.Trim();
            if (strValue != trimmed) // Only include types that need updating
                updateStrings[key] = trimmed; 
        }
    });
    updateStrings.PopulateInstance(instance);
    return instance;
}

var customer = TrimStrings(new Customer { FirstName = " John ", Initial = "Z", LastName = " Doe " });
```

All Reflection APIs make use of the Fast Reflection APIs below so in addition to convenience they also offer great performance.

## Fast Reflection APIs

The Reflection functionality is consolidated behind a formal API which includes multiple cascading implementations so it's able to use the fastest implementation available in [each supported platform](https://github.com/ServiceStackApps/HelloMobile#portable-class-library-support), i.e. for most .NET platforms we use the Reflection.Emit implementations when possible, when not available it falls back to using Compiled Expression trees, then finally falling back to using a Reflection-based implementation. 
 
This functionality is available using the `CreateGetter()` and `CreateSetter()` extension methods on both `PropertyInfo` or `FieldInfo` which you may find useful if you'd like to get better performance when populating runtime types dynamically.
 
The API examples below showcases the different APIs available:
 
```csharp
var runtimeType = typeof(MyType);
 
object instance = runtimeType.CreateInstance();
PropertyInfo pi = runtimeType.GetProperty("Id");
var idSetter = pi.CreateSetter();
var idGetter = pi.CreateGetter();
 
idSetter(instance, 1);
var idValue = idGetter(instance);
```
 
To squeeze out a bit more performance you can create a generic delegate to avoid some boxing/casting with:
 
```csharp
MyType instance = runtimeType.CreateInstance<MyType>();
var idSetter = pi.CreateSetter<MyType>();
var idGetter = pi.CreateGetter<MyType>();
```
 
All APIs also have field equivalents:
 
```csharp
FieldInfo fi = runtimeType.GetField("Id");
var idSetter = fi.CreateSetter();
var idGetter = fi.CreateGetter();
```
 
The `Create*` APIs above creates the compiled delegates which need to be cached to avoid the compilation penalty on subsequent usages. The `TypeProperties<T>` and `TypeFields<T>` classes offers fast cached access to these setters/getters which compiles all the **public** properties or fields on a per Type basis. 
 
Some examples of using these classes:
 
```csharp
var runtimeType = typeof(MyType);
var instance = runtimeType.CreateInstance();

var typeProps = TypeProperties.Get(runtimeType); //Equivalent to:
//  typeProps = TypeProperties<MyType>.Instance;
 
var idAccessor = typeProps.GetAccessor("Id");
propAccessor.PublicSetter(instance, 1);
var idValue = propAccessor.PublicGetter(instance);
```
 
Alternatively you can access property getters / setters individually:
 
```csharp
typeProps.GetPublicSetter("Id")(instance, 1);
var idValue = typeProps.GetPublicGetter("Id")(instance);
```
 
Whilst `TypeFields<T>` does the same for a Types **public fields** which is also able to work around the copy semantics of ValueTypes (typically lost when boxing) by utilizing the `ref` APIs below where we can use this to populate C# 7's new Value Tuples with:
 
```csharp
var typeFields = TypeFields.Get(typeof((string s, int i)));
 
var oTuple = (object)("foo", 1);
 
var item1Accessor = typeFields.GetAccessor("Item1");
var item2Accessor = typeFields.GetAccessor("Item2");
 
item1Accessor.PublicSetterRef(ref oTuple, "bar");
item2Accessor.PublicSetterRef(ref oTuple, 2);
 
var tuple = ((string s, int i))oTuple;
tuple.s //= bar
tuple.i //= 2
```
