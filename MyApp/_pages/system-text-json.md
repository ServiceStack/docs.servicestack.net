---
title: System.Text.Json APIs
---

From [ServiceStack v8.1](/releases/v8_01), ASP.NET Core .NET 10 Project Templates are configured to use [Endpoint Routing](/endpoint-routing)
that by default utilizes the default high-performance **System.Text.Json** JSON serializer to serialize and deserialize its JSON API Responses:

### Enabled by Default when using Endpoint Routing

```csharp
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});
```

### Configure System.Text.Json APIs

You can configure when to use System.Text.Json for APIs when registering to use Endpoint Routing:

```csharp
app.UseServiceStack(new AppHost(), options => {
    // Use for Serialization and Deserialization of JSON APIs (default)
    options.MapEndpoints(useSystemJson:UseSystemJson.Always);

    // Use only for deserializing API Requests
    options.MapEndpoints(useSystemJson:UseSystemJson.Request);

    // Use only for serializing API Responses
    options.MapEndpoints(useSystemJson:UseSystemJson.Response);

    // Don't use System.Text.Json for APIs
    options.MapEndpoints(useSystemJson:UseSystemJson.Never);
});
```

### Enhanced System.Text.Json

To improve compatibility with existing ServiceStack DTOs using ServiceStack.Text [JSON Serializer](/json-format) and
ServiceStack's rich ecosystem of generic [Add ServiceStack Reference](/add-servicestack-reference) Service Clients, 
ServiceStack uses a customized `JsonSerializerOptions` which is configured to:

- Uses `CamelCaseNamingPolicy` for property names
- Supports Case Insensitive Properties
- Not serialize `null` properties
- Serializes `TimeSpan` and `TimeOnly` Data Types with [XML Schema Time format](https://www.w3.org/TR/xmlschema-2/#isoformats)
- Supports `[DataContract]` annotations
- Supports Custom Enum Serialization

### Support for DataContract Annotations

Support for .NET's `DataContract` serialization attributes was added using a custom `TypeInfoResolver`, that supports:

- `[DataContract]` - When annotated, only `[DataMember]` properties are serialized
- `[DataMember]` - Specify a custom **Name** or **Order** of properties
- `[IgnoreDataMember]` - Ignore properties from serialization
- `[EnumMember]` - Specify a custom value for Enum values

### Custom Enum Serialization

Below is a good demonstration of the custom Enum serialization support which matches ServiceStack.Text's behavior:

```csharp
public enum EnumType { Value1, Value2, Value3 }

[Flags]
public enum EnumTypeFlags { Value1, Value2, Value3 }

public enum EnumStyleMembers
{
    [EnumMember(Value = "lower")]
    Lower,
    [EnumMember(Value = "UPPER")]
    Upper,
}

return new EnumExamples {
    EnumProp = EnumType.Value2, // String value by default
    EnumFlags = EnumTypeFlags.Value2 | EnumTypeFlags.Value3, // [Flags] as int
    EnumStyleMembers = EnumStyleMembers.Upper, // Serializes [EnumMember] value
    NullableEnumProp = null, // Ignores nullable enums
};
```

Which serializes to:

```json
{
  "enumProp": "Value2",
  "enumFlags": 3,
  "enumStyleMembers": "UPPER"
}
```

### Custom Configuration

You can further customize the `JsonSerializerOptions` used by ServiceStack by using `ConfigureJsonOptions()` to add
any customizations that you can optionally apply to ASP.NET Core's JSON APIs and MVC with:

```csharp
builder.Services.ConfigureJsonOptions(options => {
    options.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
})
.ApplyToApiJsonOptions()  // Apply to ASP.NET Core's JSON APIs
.ApplyToMvcJsonOptions(); // Apply to MVC
```

### Control over when and where System.Text.Json is used

Whilst `System.Text.Json` is highly efficient, it's also very strict in the inputs it accepts where you may want to
revert back to using ServiceStack's JSON Serializer for specific APIs, esp. when needing to support non-updatable 
external clients.

This can be done by annotating Request DTOs with `[SystemJson]` attribute, specifying when to use **System.Text.Json**, 
e.g: you can limit to only use it for serializing an **APIs Response** with:

```csharp
[SystemJson(UseSystemJson.Response)]
public class CreateUser : IReturn<IdResponse>
{
    //...
}
```

Or limit to only use `System.Text.Json` for deserializing an **APIs Request** with:

```csharp
[SystemJson(UseSystemJson.Request)]
public class CreateUser : IReturn<IdResponse>
{
    //...
}
```

Or not use `System.Text.Json` at all for an API with:

```csharp
[SystemJson(UseSystemJson.Never)]
public class CreateUser : IReturn<IdResponse>
{
    //...
}
```

### JsonApiClient Support

When Endpoints Routing is configured, the `JsonApiClient` will also be configured to utilize the same `System.Text.Json`
options to send and receive its JSON API Requests which also respects the `[SystemJson]` specified behavior.

Clients external to the .NET App can be configured to use `System.Text.Json` with:

```csharp
ClientConfig.UseSystemJson = UseSystemJson.Always;
```

Whilst any custom configuration can be applied to its `JsonSerializerOptions` with:

```csharp
TextConfig.ConfigureSystemJsonOptions(options => {
    options.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
});
```

### Scoped JSON Configuration

We've also added partial support for [Customized JSON Responses](/customize-json-responses)
for the following customization options:

:::{.table,w-full}
| Name                         | Alias |
|------------------------------|-------|
| EmitCamelCaseNames           | eccn  |
| EmitLowercaseUnderscoreNames | elun  |
| EmitPascalCaseNames          | epcn  |
| ExcludeDefaultValues         | edv   |
| IncludeNullValues            | inv   |
| Indent                       | pp    |
:::

These can be applied to the JSON Response by returning a decorated `HttpResult` with a custom `ResultScope`, e.g:

```csharp
return new HttpResult(responseDto) {
    ResultScope = () => 
        JsConfig.With(new() { IncludeNullValues = true, ExcludeDefaultValues = true })
};
```

They can also be requested by API consumers by adding a `?jsconfig` query string with the desired option or alias, e.g:

```csharp
/api/MyRequest?jsconfig=EmitLowercaseUnderscoreNames,ExcludeDefaultValues
/api/MyRequest?jsconfig=eccn,edv
```

### SystemJsonCompatible

Another configuration automatically applied when `System.Text.Json` is enabled is:

```csharp
JsConfig.SystemJsonCompatible = true;
```

Which is being used to make ServiceStack's JSON Serializer more compatible with `System.Text.Json` output so it's easier
to switch between the two with minimal effort and incompatibility. Currently this is only used to override
`DateTime` and `DateTimeOffset` behavior which uses `System.Text.Json` for its Serialization/Deserialization.