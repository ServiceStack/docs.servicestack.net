---
title: Admin UI Validation
---

The DB Validation feature leverages the existing [Declarative Validation](/declarative-validation) infrastructure where it enables dynamically managing Request DTO Type and Property Validators from a RDBMS data source which immediately takes effect at runtime and can be optionally cached where they'll only need to be re-hydrated from the database after modification.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="W5OJAlOxH98" style="background-image: url('https://img.youtube.com/vi/W5OJAlOxH98/maxresdefault.jpg')"></lite-youtube>

This feature can be easily added to existing host projects with the [mix](/mix-tool) command:

:::sh
x mix validation-source
:::

Which will add the [Modular Startup](/modular-startup) validation configuration to your project, utilizing your existing configured database:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureValidation))]

namespace MyApp;

public class ConfigureValidation : IHostingStartup
{
    // Add support for dynamically generated db rules
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => services.AddSingleton<IValidationSource>(c =>
            new OrmLiteValidationSource(c.Resolve<IDbConnectionFactory>(), HostContext.LocalCache)))
        .ConfigureAppHost(appHost => {
            // Create `ValidationRule` table if it doesn't exist in AppHost.Configure() or Modular Startup
            appHost.Resolve<IValidationSource>().InitSchema();
        });
}
```

Which the built-in [Validation Feature](/validation.html#validation-feature) detects before registering the `GetValidationRules` and `ModifyValidationRules` management APIs and enables the DB Validation Admin UI:

<div class="block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/validation-empty.png">
</div>

### Pre-populating Validation Rules

A minimum set of validation rules can be enforced by adding them on Startup, e.g:

```csharp
var validationSource = container.Resolve<IValidationSource>();
validationSource.InitSchema();
validationSource.SaveValidationRules(new List<ValidateRule> {
    new ValidateRule { Type=nameof(CreateTable), Validator = "NoRefTableReferences" },
    new ValidateRule { Type=nameof(MyRequest), Field=nameof(MyRequest.LastName), Validator = "NotNull" },
    new ValidateRule { Type=nameof(MyRequest), Field=nameof(MyRequest.Age), Validator = "InclusiveBetween(13,100)" },
});
```

This can also be used to support alternative data sources by pre-populating validation rules in an `MemoryValidationSource`, although the recommendation would be to implement [IValidationSourceAdmin](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Interfaces/ValidationRule.cs) to get the full features of the Admin Validation UI.

### Validation UI

We can start adding validation rules after selecting the API we want to add them to, tag groups provide a quick view popup allowing APIs to be selected with just a mouse, whilst groups with a large number of APIs can benefit from the Autocomplete textbox results filter.

<div class="block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/validation-category.png">
</div>

The quick links help navigating between related AutoQuery APIs that allows jumping between different APIs with the same Data Model.

In the validation editor you'll be able to create **Type** and **Property** Validation Rules that either make use of an existing **Validator** or you can enter a custom [#Script](https://sharpscript.net) expression that validates to `true`. The DB Validationo UI is smart and will list all built-in and Custom Script Methods returning `ITypeValidator` or `IPropertyValidator` that's registered in the remote instance. The pre-defined list of validators are displayed in a list of "quick pick" buttons that enables fast adding/editing of validation rules.

### Verified Rules

The `ModifyValidationRules` API used to save validation rules performs a number of checks to ensure any Validation rules are accurate including executing the validator to make sure it returns the appropriate validator type and checking the syntax on any **Script** validation rules to ensure it's valid.

<div class="block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/validation-category-CategoryName.png">
</div>

<div class="mt-4 block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/validation-category-Type.png">
</div>


The `ModifyValidationRules` back-end API also takes care of invalidating the validation rule cache so that any saved Validators are immediately applied. 

Despite being sourced from a DB, after the first access the validation rules are cached in memory where they'd have similar performance profile to validators declaratively added on Request DTOs in code.

After you add your validation rules they'll be immediately enforced when calling the API, e.g. in [API Explorer](/api-explorer) or [Locode](/locode/). Be mindful of what Validation Rule you're adding to which DTO, e.g. a validation rule added to **CreateCategory** API will **only be applied** when **creating** entities, e,g. not for full entity or partial field updates.

<div class="mt-4 block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/validation-category-create.png">
</div>
