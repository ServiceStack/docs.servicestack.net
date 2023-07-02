---
title: Form Hijacking Prevention
---

The `SuppressFormsAuthenticationRedirectModule` module prevents the asp.net built in `FormsAuthenticationModule` from hijacking 401 requests and redirecting to a login page.  Normally, this is the desired behavior if you are using a web browser and access an unauthorized page, but in the case of an API, we do not want that.

This module uses a hack to get this done.  It temporarily replaces the 401 error with a 402 to trick the `FormsAuthenticationModule` and then puts the 401 back before the request is finished.   It only does this on the path for your API, the rest of the website will behave as normal.   Note, that there is a non-hack way to do this now, built into .net 4.5 and I have commented the code as to what that is.  When appropriate a .net 4.5 package could be released containing this updated code.

## Usage

To use this, first register the `httpModule`:

```xml
<system.web>
    <httpModules>
      <add name="FormsAuthenticationDisposition" type="ServiceStack.SuppressFormsAuthenticationRedirectModule, ServiceStack" />
    </httpModules>
</system.web>

<!-- Required for IIS 7.0 (and above?) -->
<system.webServer>
  <validation validateIntegratedModeConfiguration="false" />
    <httpModules>
      <add name="FormsAuthenticationDisposition" type="ServiceStack.SuppressFormsAuthenticationRedirectModule, ServiceStack" />
    </httpModules>
</system.webServer>
```

next, configure the module with where your API lives - defaults to `/api`, so in your AppHost Configure:

```csharp
public override void Configure(Funq.Container container)
{
    SetConfig(new HostConfig {
        HandlerFactoryPath = "/yourapipath",
    });

    //this is the configuration for Hijacking prevention
    SuppressFormsAuthenticationRedirectModule.PathToSupress = Config.HandlerFactoryPath;
}
```
