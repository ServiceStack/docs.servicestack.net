---
title: License Registration
slug: register
---

The ServiceStack license key allows un-restricted access to ServiceStack packages and is available in your My Account Section after purchasing a commercial license.

There are multiple ways of registering your license key, all options only need to be added to your top-level host projects:

### a) Add it to the projects appsettings.json or Web.Config

Easiest way to register your license key is to add the **servicestack license** appSetting.
For ASP.NET Core Apps add it to **appsettings.json**:

```json
{
    "servicestack": {
        "license": "{licenseKeyText}"
    }
}
```

::: info
Non ServiceStack .NET Core **AppHost** Apps (i.e. just using Redis or OrmLite) will also need to explicitly register the license key from IConfiguration: `Licensing.RegisterLicense(Configuration.GetValue<string>("servicestack:license"));`
:::

For .NET Framework Applications add it to the **Web.config** or App.config's `<appSettings/>` config section:

```xml
<appSettings>
    <add key="servicestack:license" value="{licenseKeyText}" />
</appSettings>
```

### b) Add it in code before your Application Starts Up

By calling Licensing.RegisterLicense() before your application starts up, E.g. For ASP.NET, place it in the Global.asax Application_Start event:

```csharp
protected void Application_Start(object sender, EventArgs e)
{
    Licensing.RegisterLicense(licenseKeyText);
    new AppHost().Init();
}
```

Otherwise for a self-hosting Console Application, place it before initializing the AppHost, as shown above.

### c) Add the System Environment Variable

To simplify license key registration when developing multiple ServiceStack solutions you can register the License Key once in the SERVICESTACK_LICENSE Environment Variable on each pc using ServiceStack libraries:

| Variable | Value |
|:-|:-|
| SERVICESTACK_LICENSE | `{licenseKeyText}` |

::: info
you'll need to restart IIS or VS.NET for them to pickup any new Environment Variables.
:::

### d) Copy license key text into an external text file

Similar to above, we can register the license from an external plain-text file containing the license key text, e.g:

```csharp
protected void Application_Start(object sender, EventArgs e)
{
    Licensing.RegisterLicenseFromFileIfExists("~/license.txt".MapHostAbsolutePath());
    new AppHost().Init();
}
```

For Self-Hosting set the BuildAction to Copy if Newer and use "~/license.txt".MapAbsolutePath() extension method.

::: info
the license key is white-space insensitive so can be broken up over multiple lines.
:::

