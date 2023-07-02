## Advanced Native Type Code gen

To enable greater flexibility when generating complex Typed DTOs, you can use `[Emit{Language}]` attributes to generate code before each type or property.

These attributes can be used to generate different attributes or annotations to enable client validation for different validation libraries in different languages, e.g:

```csharp
[EmitCSharp("[Validate]")]
[EmitTypeScript("@Validate()")]
[EmitCode(Lang.Swift | Lang.Dart, "@validate()")]
public class User : IReturn<User>
{
    [EmitCSharp("[IsNotEmpty]","[IsEmail]")]
    [EmitTypeScript("@IsNotEmpty()", "@IsEmail()")]
    [EmitCode(Lang.Swift | Lang.Dart, new[]{ "@isNotEmpty()", "@isEmail()" })]
    public string Email { get; set; }
}
```

Which will generate `[EmitCsharp]` code in C# DTOs:

```csharp
[Validate]
public partial class User
    : IReturn<User>
{
    [IsNotEmpty]
    [IsEmail]
    public virtual string Email { get; set; }
}
```

`[EmitTypeScript]` annotations in TypeScript DTOs:

```typescript
@Validate()
export class User implements IReturn<User>
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    public constructor(init?: Partial<User>) { (Object as any).assign(this, init); }
    public createResponse() { return new User(); }
    public getTypeName() { return 'User'; }
}
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.

### Type Generation Filters

In addition you can use the `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` to generate source code before and after a Type definition, e.g. this will append the `@validate()` annotation on non enum types:

```csharp
TypeScriptGenerator.PreTypeFilter = (sb, type) => {
    if (!type.IsEnum.GetValueOrDefault())
    {
        sb.AppendLine("@Validate()");
    }
};
```

The `InnerTypeFilter` gets invoked just after the Type Definition which can be used to generate common members for all Types and interfaces, e.g:

```csharp
TypeScriptGenerator.InnerTypeFilter = (sb, type) => {
    sb.AppendLine("id:string = `${Math.random()}`.substring(2);");
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
TypeScriptGenerator.PrePropertyFilter = (sb , prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("@IsInt()");
    }
};
```

### Live examples

  - [stackapis.netcore.io/types/metadata](https://stackapis.netcore.io/types/metadata)

This model is then used to generate the generated types, which for C# is at `/types/csharp`.

## Limitations

In order for Add ServiceStack Reference to work consistently across all supported languages without .NET semantic namespaces, DTOs includes an additional restriction due to the semantic differences and limitations in different languages there are some limitations of [highly-discouraged bad practices](http://stackoverflow.com/a/10759250/85785) that's not supported across all languages including:

#### All DTO Type Names must be unique
ServiceStack only requires Request DTO's to be unique, but non .NET languages also require all DTO names to be unique.

#### No object or Interface properties
It's not possible to generate typed metadata and type information for deserializing unknown types like `object` or `Interface` properties.

#### Base types must be marked abstract
When using inheritance in DTO's any Base types must be marked abstract.

For C#, VB .NET and F# languages you can get around these limitations by sharing the **ServiceModel.dll** where your DTOs are defined instead.

### Using with IIS Windows Authentication

If you have configured your NativeTypes service to run on IIS with Windows Authentication enabled, you need to ensure that the **/types** routes are reachable and do not require the system-level authentication from IIS. To accomplish this, add the following to `<system.web>` in Web.config. 

```xml
<authorization>
    <allow users="?" />
</authorization>
```
