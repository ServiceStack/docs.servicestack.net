---
slug: studio-validation-rules
title: Studio - Validation Rules
---

::: warning Deprecated
**[ServiceStack Studio has been replaced](/releases/v6_02.html#retiring-studio)** by **[Admin UI](/admin-ui)**.
Last supported versions: **ServiceStack v6.1** with **app v6.0.4**.
:::

As an **Admin** you have access to the [DB Validation Source](https://forums.servicestack.net/t/autocrud-preview/8298/29?u=mythz) Admin UI which will let you add declarative Type and Property Validators for each Request DTO in Studio. This is enabled in NorthwindCrud in [Configure.Validation.cs](https://github.com/NetCoreApps/NorthwindCrud/blob/master/Configure.Validation.cs):

```csharp
// Add support for dynamically generated db rules
services.AddSingleton<IValidationSource>(c => 
    new OrmLiteValidationSource(c.Resolve<IDbConnectionFactory>()));

//...
appHost.Plugins.Add(new ValidationFeature());
appHost.Resolve<IValidationSource>().InitSchema();
```

::: info
Management of this feature is limited to users in the `ValidationFeature.AccessRole` (default: **Admin**)
:::

## DB Validation UI

Clicking on the Validation **Lock Icon** on the top right will take you to the Validation Editor for that AutoQuery Request DTO which will include quick links to jump to different AutoQuery/Crud Services for the same Data Model.

In the validation editor you'll be able to create **Type** and **Property** Validation Rules that either make use of an existing **Validator** or you can enter a custom `#Script` expression that must validate to `true`. The Validator UI is smart and will list all built-in and Custom Script Methods returning `ITypeValidator` or `IPropertyValidator` that's registered in the remote instance. The pre-defined list of validators are displayed in a list of "quick pick" buttons that enables fast adding/editing of validation rules.

### Verified Rules

The `ModifyValidationRules` Service that Studio calls performs a lot of validation to ensure the Validation rule is accurate including executing the validator to make sure it returns the appropriate validator type and checking the syntax on any **Script** validation rules to ensure it's valid.

![](/img/pages/release-notes/v5.9/studio-validator-property.png)

![](/img/pages/release-notes/v5.9/studio-db-validators.png)

The `ModifyValidationRules` back-end Service also takes care of invalidating the validation rule cache so that any saved Validators are immediately applied. 

Despite being sourced from a DB, after the first access the validation rules are cached in memory where they'd have similar performance to validators declaratively added on Request DTOs in code.

After you add your validation rules you will be able to click the **AutoQuery** icon on the top right to return to the AutoQuery editor. Be mindful of what Validation Rule you're adding to which DTO, e.g. a validation rule added to **CreateCategory** Service will only be applied to that Service which is used when creating entities, e,g. not for full entity or partial field updates.

![](/img/pages/release-notes/v5.9/studio-validators-create.png)

### Metadata App Export / Discovery

The way a generic capability-based Admin UI's like Studio is possible is via the `/metadata/app` API descriptor which describes what plugins and features are enabled on the remote ServiceStack instance. All built-in plugins which provide functionality that can be remotely accessed add their info to the App's metadata. 

This functionality is also available to your own plugins should you wish to attach info about your plugin where you can use the `AddToAppMetadata` extension method to return a populated `CustomPlugin` DTO describing the features made available by your plugin:

```csharp
public class MyPlugin : IPlugin
{
    public void Register(IAppHost appHost)
    {
        appHost.AddToAppMetadata(meta => {
            meta.CustomPlugins[nameof(MyPlugin)] = new CustomPlugin {
                AccessRole = RoleNames.AllowAnyUser,                   // Required Role to access Services
                ServiceRoutes = new Dictionary<string, string[]> {
                    { nameof(MyPluginService), new[] { "/myplugin/{Id}" } }, // Available Plugin Services
                },
                Enabled = new List<string> { "feature1", "feature2" }, // What plugin features are enabled
                Meta = new Dictionary<string, string> {
                    ["custom"] = "meta" // additional custom metadata you want returned for this plugin
                }
            };
        });
    }
}
```
