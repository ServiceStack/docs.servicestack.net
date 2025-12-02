---
slug: declarative-validation
title: Declarative Validation
---

Declarative validation facilitate greater declarative functionality around ServiceStack Services where all existing 
[Fluent Validation Property Validators](/validation#validation-feature) can be annotated on Request DTOs using typed validation 
attributes which are decoupled from their Validator implementation so they're suitable to be annotated on impl-free Service Model DTOs and exported in 
[Add ServiceStack Reference](/add-servicestack-reference) Types.

::: info Tip
As they're decoupled the same rules could enable instant validation feedback on clients without server round trips
:::

The validators are incorporated into ServiceStack's existing Fluent Validation model so it [works with existing UI form binding](/world-validation). 

## Validation Feature

All of ServiceStack's Fluent Validation features is encapsulated within the `ValidationFeature` plugin which is pre-registered by default.

The Validator attributes are decoupled from any implementation and can be safely annotated on Request DTOs without adding any implementation dependencies. There's both Type Validators for applying API-level validation and property Validation attributes which enable an alternative declarative way of defining [Fluent Validation rules](/validation) on properties.

### Type Validation Attributes

| Attribute                      | Description                                                             |
|--------------------------------|-------------------------------------------------------------------------|
| `[ValidateRequest]`            | Validate Type against a custom Validator expression                     |
| `[ValidateIsAuthenticated]`    | Protect access to this API to Authenticated Users only                  |
| `[ValidateIsAdmin]`            | Protect access to this API to Admin Users only                          |
| `[ValidateHasPermission]`      | Protect access to this API to only Users assigned with ALL Permissions  |
| `[ValidateHasRole]`            | Protect access to this API to only Users assigned with ALL Roles        |
| `[ValidateApiKey]`             | Protect access to this API to only Users with a valid API Key           |

### Property Validation Attributes

| Attribute                      | Description                                                             |
|--------------------------------|-------------------------------------------------------------------------|
| `[Validate]`                   | Validate property against custom Validator expression                   |
| `[ValidateCreditCard]`         | Validate property against Fluent Validation CreditCardValidator         |
| `[ValidateEmail]`              | Validate property against Fluent's AspNetCoreCompatibleEmailValidator   |
| `[ValidateEmpty]`              | Validate property against Fluent Validation EmptyValidator              |
| `[ValidateEqual]`              | Validate property against Fluent Validation EqualValidator              |
| `[ValidateExactLength]`        | Validate property against Fluent Validation ExactLengthValidator        |
| `[ValidateExclusiveBetween]`   | Validate property against Fluent Validation ExclusiveBetweenValidator   |
| `[ValidateGreaterThan]`        | Validate property against Fluent Validation GreaterThanValidator        |
| `[ValidateGreaterThanOrEqual]` | Validate property against Fluent Validation GreaterThanOrEqualValidator |
| `[ValidateInclusiveBetween]`   | Validate property against Fluent Validation InclusiveBetweenValidator   |
| `[ValidateLength]`             | Validate property against Fluent Validation LengthValidator             |
| `[ValidateLessThan]`           | Validate property against Fluent Validation LessThanValidator           |
| `[ValidateLessThanOrEqual]`    | Validate property against Fluent Validation LessThanOrEqualValidator    |
| `[ValidateMaximumLength]`      | Validate property against Fluent Validation MaximumLengthValidator      |
| `[ValidateMinimumLength]`      | Validate property against Fluent Validation MinimumLengthValidator      |
| `[ValidateNotEmpty]`           | Validate property against Fluent Validation NotEmptyValidator           |
| `[ValidateNotEqual]`           | Validate property against Fluent Validation NotEqualValidator           |
| `[ValidateNotNull]`            | Validate property against Fluent Validation NotNullValidator            |
| `[ValidateNull]`               | Validate property against Fluent Validation NullValidator               |
| `[ValidateRegularExpression]`  | Validate property against Fluent Validation RegularExpressionValidator  |
| `[ValidateScalePrecision]`     | Validate property against Fluent Validation ScalePrecisionValidator     |

## Property Validator Examples

The Property Validator attributes provide an alternative way to apply Request DTO validation rules, the best way to demonstrate them 
is showing the same example below implemented using Fluent Validation APIs:

```csharp
public class ExampleValidatorsValidator : AbstractValidator<ExampleValidators>
{
    public ExampleValidatorsValidator()
    {
        RuleFor(x => x.CreditCard).CreditCard();
        RuleFor(x => x.Email).EmailAddress();
        RuleFor(x => x.Empty).Empty();
        RuleFor(x => x.Equal).Equal("Equal");
        RuleFor(x => x.ExclusiveBetween).ExclusiveBetween(10, 20);
        RuleFor(x => x.GreaterThanOrEqual).GreaterThanOrEqualTo(10);
        RuleFor(x => x.GreaterThan).GreaterThan(10);
        RuleFor(x => x.InclusiveBetween).InclusiveBetween(10, 20);
        RuleFor(x => x.Length).Length(10);
        RuleFor(x => x.LessThanOrEqual).LessThanOrEqualTo(10);
        RuleFor(x => x.LessThan).LessThan(10);
        RuleFor(x => x.NotEmpty).NotEmpty();
        RuleFor(x => x.NotEqual).NotEqual("NotEqual");
        RuleFor(x => x.Null).Null();
        RuleFor(x => x.ScalePrecision).ScalePrecision(1,1);
        RuleFor(x => x.RegularExpression).Matches(@"^[a-z]*$");
    }
}
```

For each property validator above you can use a Typed Property Validation Attribute in the format `[Validate*]`:

```csharp
public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse>
{
    [ValidateCreditCard]
    public string CreditCard { get; set; }
    [ValidateEmail]
    public string Email { get; set; }
    [ValidateEmpty]
    public string Empty { get; set; }
    [ValidateEqual("Equal")]
    public string Equal { get; set; }
    [ValidateLessThan(10)]
    public int LessThan { get; set; }
    [ValidateLessThanOrEqual(10)]
    public int LessThanOrEqual { get; set; }
    [ValidateGreaterThan(10)]
    public int GreaterThan { get; set; }
    [ValidateGreaterThanOrEqual(10)]
    public int GreaterThanOrEqual { get; set; }
    [ValidateExclusiveBetween(10, 20)]
    public int ExclusiveBetween { get; set; }
    [ValidateInclusiveBetween(10, 20)]
    public int InclusiveBetween { get; set; }
    [ValidateExactLength(10)]
    public string Length { get; set; }
    [ValidateNotEmpty]
    public string NotEmpty { get; set; }
    [ValidateNotEqual("NotEqual")]
    public string NotEqual { get; set; }
    [ValidateNull]
    public string Null { get; set; }
    [ValidateScalePrecision(1,1)]
    public decimal ScalePrecision { get; set; }
    [ValidateRegularExpression("^[a-z]*$")]
    public string RegularExpression { get; set; }
}
```

All Typed Validator Attributes above are just providing a typed subclass wrapper around the generic `[Validate]`, so the implementation of
the `[ValidateLessThan]` is just:

```csharp
public class ValidateLessThanAttribute : ValidateAttribute
{
    public ValidateLessThanAttribute(int value) : base($"LessThan({value})") { }
}
```

### Generic Validator Attributes

So the same Typed Validator above is equivalent to using the untyped generic `[Validate]` attribute below:

```csharp
public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse>
{
    [Validate("CreditCard")]
    public string CreditCard { get; set; }
    [Validate("Email")]
    public string Email { get; set; }
    [Validate("Empty")]
    public string Empty { get; set; }
    [Validate("Equal('Equal')")]
    public string Equal { get; set; }
    [Validate("ExclusiveBetween(10, 20)")]
    public int ExclusiveBetween { get; set; }
    [Validate("GreaterThanOrEqual(10)")]
    public int GreaterThanOrEqual { get; set; }
    [Validate("GreaterThan(10)")]
    public int GreaterThan { get; set; }
    [Validate("InclusiveBetween(10, 20)")]
    public int InclusiveBetween { get; set; }
    [Validate("ExactLength(10)")]
    public string Length { get; set; }
    [Validate("LessThanOrEqual(10)")]
    public int LessThanOrEqual { get; set; }
    [Validate("LessThan(10)")]
    public int LessThan { get; set; }
    [Validate("NotEmpty")]
    public string NotEmpty { get; set; }
    [Validate("NotEqual('NotEqual')")]
    public string NotEqual { get; set; }
    [Validate("Null")]
    public string Null { get; set; }
    [Validate("RegularExpression('^[a-z]*$')")]
    public string RegularExpression { get; set; }
    [Validate("ScalePrecision(1,1)")]
    public decimal ScalePrecision { get; set; }
}
```

Where the **Validator Expression** is a `#Script` Expression that returns a Fluent Validation `IPropertyValidator` defined
in the built-in [ValidateScripts.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ValidateScripts.cs):

```csharp
public class ValidateScripts : ScriptMethods
{
    public IPropertyValidator Null() => new NullValidator();
    public IPropertyValidator Empty() => new EmptyValidator(null);
    public IPropertyValidator Empty(object defaultValue) => new EmptyValidator(defaultValue);
    public IPropertyValidator Equal(object value) => new EqualValidator(value);
    public IPropertyValidator NotNull() => new NotNullValidator();
    public IPropertyValidator NotEmpty() => new NotEmptyValidator(null);
    public IPropertyValidator NotEmpty(object defaultValue) => new NotEmptyValidator(defaultValue);
    public IPropertyValidator NotEqual(object value) => new NotEqualValidator(value);
    public IPropertyValidator CreditCard() => new CreditCardValidator();
    public IPropertyValidator Email() => new AspNetCoreCompatibleEmailValidator();
    public IPropertyValidator Length(int min, int max) => new LengthValidator(min, max);
    public IPropertyValidator ExactLength(int length) => new ExactLengthValidator(length);
    public IPropertyValidator MaximumLength(int max) => new MaximumLengthValidator(max);
    public IPropertyValidator MinimumLength(int min) => new MinimumLengthValidator(min);
    public IPropertyValidator InclusiveBetween(IComparable from, IComparable to) =>
        new InclusiveBetweenValidator(from, to);
    public IPropertyValidator ExclusiveBetween(IComparable from, IComparable to) =>
        new ExclusiveBetweenValidator(from, to);
    public IPropertyValidator LessThan(int value) => new LessThanValidator(value);
    public IPropertyValidator LessThanOrEqual(int value) => new LessThanOrEqualValidator(value);
    public IPropertyValidator GreaterThan(int value) => new GreaterThanValidator(value);
    public IPropertyValidator GreaterThanOrEqual(int value) => new GreaterThanOrEqualValidator(value);
    public IPropertyValidator ScalePrecision(int scale, int precision) =>
        new ScalePrecisionValidator(scale, precision);
    public IPropertyValidator RegularExpression(string regex) => 
        new RegularExpressionValidator(regex, RegexOptions.Compiled);
}
```

### Validated Validator Expressions

Despite using untyped string Expressions, **Validator** expressions still provide early error detection as on `Startup` each `#Script` 
expression is evaluated and verified that it resolves to a valid `IPropertyValidator` instance otherwise fails with a **Startup Exception**.
If the instance returned is valid it's merged with any other `AbstractValidator<T>` that may also be defined for the same Request DTO Type, 
where it lets you mix n' match declarative attributes together with Fluent Validation rules.

### Defining Multiple Validators

You can specify multiple Property Validators should be applied within a single Validator expression by using `[]` Array notation, 
alternatively you can apply multiple Validate attributes and use C# syntax to combine them in a single line:

```csharp
public class ExampleValidators
{
    [Validate("[NotNull,InclusiveBetween(13,100)]")]
    public int? ValidateAge { get; set; }

    [ValidateNotNull,ValidateInclusiveBetween(13,100)]
    public int? TypedAge { get; set; }
}
```

### Registering Custom Declarative Validators

As `[Validate*]` attributes just execute a Script Method they're easily extensible by [defining and register your own](https://sharpscript.net/docs/methods), e.g:

```csharp
public class MyValidateScripts : ScriptMethods
{
    public IPropertyValidator Custom(int arg) => new MyCustomValidator(arg);
}
```

Which can be registered, either directly on your [Script Pages plugin](https://sharpscript.net/docs/script-pages) if your AppHost uses one:

```csharp
Plugins.Add(new SharpPagesFeature {
    ScriptMethods = { new CustomScriptMethods() }
});
```

Otherwise you can use the AppHost's new `ScriptContext` which adds it to the AppHost's empty `ScriptContext`:

```csharp
ScriptContext.ScriptMethods.Add(new CustomScriptMethods());
```

> `ScriptContext` also returns `SharpPagesFeature` if registered, in which case both registration examples are equivalent

After which you'll immediately be able to use it with the `[Validate]` attribute:

```csharp
[Validate("Custom(1)")]
public int Test { get; set; }
```

Likewise you can create a typed Validate attribute around it which you can use instead:

```csharp
public class ValidateCustomAttribute : ValidateAttribute
{
    public ValidateCustomAttribute(int arg) : base($"Custom({arg})") { }
}
//...

[ValidateCustom(1)]
public int Test { get; set; }
```

### Custom Script Validation

Fluent Validation Validators are a nice model for defining reusable validation rules however they can require a bit of boilerplate
if you only need to define a one-off validation check. In these cases we can provide an even lighter weight solution by being able
to defining our validation condition inline with `#Script` by specifying it in the `Condition` attribute, e.g:

```csharp
public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse>
{
    [Validate(Condition = "it.isOdd()")]
    public int IsOddCondition { get; set; }

    [Validate(Condition = "it.isOdd() && it.log10() > 2")]
    public int IsOddAndOverTwoDigitsCondition { get; set; }

    [Validate(Condition = "it.isOdd() || it.log10() > 2")]
    public int IsOddOrOverTwoDigitsCondition { get; set; }
}
```

Script Conditions are valid if they return a **truthy** value and have access to the following arguments within their Expression: 

 - `Request`: IRequest
 - `dto`: Request DTO
 - `field`: Property Name
 - `it`: Property Value

If you're reusing the same Expression a nice solution for maintaining them is in a static class where you can use the `AllConditions`
and `AnyConditions` helper properties to compose individual checks, e.g:

```csharp
public static class ValidationConditions
{
    public const string IsOdd = "it.isOdd()";
    public const string IsOver2Digits = "it.log10() > 2";
}

public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse>
{
    [Validate(Condition = ValidationConditions.IsOdd)]
    public int IsOddCondition { get; set; }

    [Validate(AllConditions = new[]{ ValidationConditions.IsOdd, ValidationConditions.IsOver2Digits })]
    public int IsOddAndOverTwoDigitsCondition { get; set; }

    [Validate(AnyConditions = new[]{ ValidationConditions.IsOdd, ValidationConditions.IsOver2Digits })]
    public int IsOddOrOverTwoDigitsCondition { get; set; }
}
```

Despite not using a validator all `#Script` Conditions are executed using a custom Fluent Validation `IPredicateValidator`
(called [ScriptConditionValidator](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Validators.cs)) so it able to slot right 
in with all other Property Validators.

### Custom Error Codes and Messages

The other aspect of validators that can be overridden declaratively are the **ErrorCode** and Error **Message** returned in ServiceStack's
[structured Error Response](/error-handling), specified using the `ErrorCode` and `Message` Attribute properties:

```csharp
public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse>
{
    [ValidateNotNull(ErrorCode = "ZError")]
    public string CustomErrorCode { get; set; }
    
    // Overrides both ErrorCode & Message
    [ValidateInclusiveBetween(1,2, ErrorCode = "ZError", 
        Message = "{PropertyName} has to be between {From} and {To}, you: {PropertyValue}")]
    public int CustomErrorCodeAndMessage { get; set; }

    // Overrides ErrorCode & uses Message from Validators
    [ValidateNotNull(ErrorCode = "RuleMessage")]
    public string ErrorCodeRule { get; set; }

    [Validate(Condition = ValidationConditions.IsOdd)]
    public int IsOddCondition { get; set; }

    [Validate(AllConditions = new[]{ ValidationConditions.IsOdd, ValidationConditions.IsOver2Digits }, 
        ErrorCode = "RuleMessage")]
    public int IsOddAndOverTwoDigitsCondition { get; set; }
}
```

All Error Messages can reference the `{PropertyName}` and `{PropertyValue}` in their messages along with any other MessageFormatter
placeholders defined by the validator, e.g. the [InclusiveBetweenValidator.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/FluentValidation/Validators/InclusiveBetweenValidator.cs) used above also defines the `{From}`, `{To}` and `{Value}` placeholders.

`#Script` Conditions can define their Error codes in the centralized `ConditionErrorCodes` Dictionary in the `ValidationFeature` Plugin
where all `IsOdd` conditions will return the **NotOdd** custom error code.

The Error Messages can also be defined in the centralized `ErrorCodeMessages` Dictionary which defines the Error Messages that all failed
**NotOdd** or **RuleMessage** rules will use, e.g:

```csharp
Plugins.Add(new ValidationFeature {
    ConditionErrorCodes = {
        [ValidationConditions.IsOdd] = "NotOdd",
    },
    ErrorCodeMessages = {
        ["NotOdd"] = "{PropertyName} must be odd",
        ["RuleMessage"] = "ErrorCodeMessages for RuleMessage",
    }
});
```

## Type Validators

In addition to Property Validators there's also support for **Type Validators** which can be declaratively added to perform top-level 
validation on Request DTOs. They behave and function the same as Property Validators where you can use either the typed or the generic `[ValidateRequest]` attribute.

ServiceStack includes built-in Type Validator attributes for all [Authorization Filter Attributes](/auth/authentication-and-authorization#the-authenticate-attribute) 
but as they're decoupled from any implementation they can be safely annotated on Request DTOs without requiring any implementation dependencies.

```csharp
[ValidateIsAuthenticated]            // or [ValidateRequest("IsAuthenticated")]
[ValidateIsAdmin]                    // or [ValidateRequest("IsAdmin")]
[ValidateHasRole(role)]              // or [ValidateRequest($"HasRole(`{role}`)")]
[ValidateHasPermission(permission)]  // or [ValidateRequest($"HasPermission(`{permission}`)")
```

Just like Property Validators, the Typed Validator attributes are wrappers around the generic `[ValidateRequest]` attribute, e.g:

```csharp
public class ValidateIsAuthenticatedAttribute : ValidateRequestAttribute
{
    public ValidateIsAuthenticatedAttribute() : base("IsAuthenticated") { }
}
```

Which are also defined in [ValidateScripts.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ValidateScripts.cs) 
but instead return a `ITypeValidator`:

```csharp
public class ValidateScripts : ScriptMethods
{
    public ITypeValidator IsAuthenticated() => new IsAuthenticatedValidator();
    public ITypeValidator IsAuthenticated(string provider) => new IsAuthenticatedValidator(provider);
    public ITypeValidator HasRole(string role) => new HasRolesValidator(role);
    public ITypeValidator HasRoles(string[] roles) => new HasRolesValidator(roles);
    public ITypeValidator HasPermission(string permission) => new HasPermissionsValidator(permission);
    public ITypeValidator HasPermissions(string[] permission) => new HasPermissionsValidator(permission);
    public ITypeValidator IsAdmin() => new HasRolesValidator(RoleNames.Admin);
}
```

#### Custom Type Attributes

The easiest way to create a an `ITypeValidator` is to inherit from the `TypeValidator` base class, including both the **ErrorCode**
and **Error Message** failed requests should return. 

An example where you might use one is when testing the pre-condition state of an entity which doesn't logically map to a property.
In the example below we're validating to ensure that the entity doesn't have any Foreign Key References:

```csharp
public class NoRockstarAlbumReferences : TypeValidator
{
    public NoRockstarAlbumReferences() 
        : base("HasForeignKeyReferences", "Has RockstarAlbum References") {}

    public override async Task<bool> IsValidAsync(object dto, IRequest request)
    {
        //Example of using compiled accessor delegates to access `Id` property
        //var id = TypeProperties.Get(dto.GetType()).GetPublicGetter("Id")(dto).ConvertTo<int>();

        var id = ((IHasId<int>)dto).Id;
        using var db = HostContext.AppHost.GetDbConnection(request);
        return !await db.ExistsAsync<RockstarAlbum>(x => x.RockstarId == id);
    }
}
```

Then we need to register it as a custom script method to be able to reference it in `[ValidateRequest]`:

```csharp
public class MyValidators : ScriptMethods
{
    public ITypeValidator NoRockstarAlbumReferences() => new NoRockstarAlbumReferences();
}
```

Which we can now declaratively reference by script method name:

```csharp
[ValidateRequest(nameof(NoRockstarAlbumReferences))]
public class ExampleValidators : ICreateDb<Rockstar>, IReturn<RockstarWithIdResponse>, IHasId<int>
{
    public int Id { get; set; }
    
    [ValidateNotNull] //doesn't get validated if ValidateRequest is invalid
    public string NotNull { get; set; }
}
```

Type Validators are executed before any property validators, which if failed wont be executed.

### Type Script Conditions

Type Validators can also execute `#Script` expressions where we could implement the above FK check inline using
a sync [Database Script](https://sharpscript.net/docs/db-scripts):

```csharp
[ValidateRequest(Condition = "!dbExistsSync('SELECT * FROM RockstarAlbum WHERE RockstarId = @Id', { it.Id })", 
    ErrorCode = "HasForeignKeyReferences")]
public class ExampleValidators : ICreateDb<Rockstar>, IReturn<RockstarWithIdResponse>
{
    public int Id { get; set; }
    
    [ValidateNotNull] //doesn't get validated if ValidateRequest is invalid
    public string NotNull { get; set; }
}
```

::: info
the condition needs to return a **truthy** value so you'd need to use the sync DB Script APIs to return
a boolean instead of an async Task.
:::

Type Validators can also specify custom Error Codes and Error Messages, they can also specify a custom HTTP 
Error StatusCode that failed requests should return.

```csharp
[ValidateRequest(Condition = "it.Test.isOdd() && it.Test.log10() > 2",
    ErrorCode = "NotOddAndOver2Decimals", Message = "Pre-condition Failed", StatusCode = 401)]
public class ExampleValidators : ICreateDb<ExampleValidator>, IReturn<EmptyResponse> { }
```

## DB Validation Rules

Both Property and Type Validators can also be sourced from a **dynamic source** with both **Memory** and **RDBMS** implementations included 
along with a Management HTTP API which can be be managed remotely programmatically or from the [Validation Admin UI](/admin-ui-validation):

<div class="block p-4 rounded shadow">
    <a href="/admin-ui-validation">
        <img src="/img/pages/admin-ui/validation-category.png">
    </a>
</div>

Dynamic Validation Rules are cacheable locally giving them the same performance profile as declarative attributes in code whose caches are only invalidated once they've been updated, upon which they'll come into immediate effect.

Here's a [Modular Startup](/modular-startup) code you can drop into a ServiceStack Project to enable maintaining declarative Validation 
Rules in your configured RDBMS:

```csharp
using ServiceStack;
using ServiceStack.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureValidation))]

namespace MyApp
{
    public class ConfigureValidation : IHostingStartup
    {
        // Add support for dynamically generated db rules
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices(services => services.AddSingleton<IValidationSource>(c =>
                new OrmLiteValidationSource(c.Resolve<IDbConnectionFactory>(), HostContext.LocalCache)))
            .ConfigureAppHost(appHost => {
                appHost.Resolve<IValidationSource>().InitSchema();
            });
    }
}
```

::: info
The above code can be imported into your ServiceStack project by using `x mix validation-source` 
if you are using .NET 8 modular startup.
:::

DB Validation rules can be added programmatically, this example below adds 1x Type Validator and 2x Property Validators to the 
`DynamicRules` Request DTO:

```csharp
var validationSource = container.Resolve<IValidationSource>();
validationSource.SaveValidationRulesAsync(new List<ValidationRule> {
    new ValidationRule { Type  = nameof(DynamicRules), Validator = "IsAuthenticated" },
    new ValidationRule { Type  = nameof(DynamicRules), Validator = "NotNull", 
                         Field = nameof(DynamicRules.LastName) },
    new ValidationRule { Type  = nameof(DynamicRules), Validator = "InclusiveBetween(13,100)", 
                         Field = nameof(DynamicRules.Age) },
});
```

**Admin** Users can also manage these rules remotely using the `ModifyValidationRules` Service defined below:

```csharp
public class ModifyValidationRules : IReturnVoid
{
    public string AuthSecret { get; set; }

    public List<ValidationRule> SaveRules { get; set; }

    public int[] DeleteRuleIds { get; set; }

    public int[] SuspendRuleIds { get; set; }

    public int[] UnsuspendRuleIds { get; set; }
    
    public bool? ClearCache { get; set; }
}
```

### ServiceStack Studio Validators UI

ServiceStack Studio utilizes the above `ModifyValidationRules` for its support for [managing DB Validation rules](/studio#validators-ui),
with an optimized UX that lets you quickly select & configure all built-in & registered property & type validators where they're instantly applied.
