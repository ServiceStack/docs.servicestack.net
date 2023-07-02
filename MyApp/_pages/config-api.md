---
slug: config-api
title: Config API
---

Despite being avid protesters in the anti-XML config movement, we're still 100% for app Config in general though it should be **limited to what's actually configurable by your application**. Instead of building tiered configSection manatees we prefer to store structured data in Web.config's appSetting's values which are still able to express rich object config graphs but does so in a much more human-friendly and manageable size.

## ServiceStack's Configuration API

To this end we provide our own pluggable [Configuration API](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Configuration/IResourceManager.cs) to provide high-level utility methods to read your Web.config's `<appSetting/>` values into a `List`, `Dictionary` or your own Custom POCO Type using the human friendly [JSV format](/jsv-format).

### Benefits over XML Config

Benefits over existing XML Configuration APIs include: 

  - The ability to store rich data structures in **appSettings** values
  - Much easier and requires less effort and boilerplate to create 
  - Provides more succinct access to typed data
  - Since they're just POCOs can be re-used in all of ServiceStack's libraries and built-in [Auto Mapping](/auto-mapping)

and promotes less-coupling since its only an [interface](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Configuration/IResourceManager.cs) so can easily be swapped to have [Plugins](/plugins) source their complex configuration from an different source (e.g. from a central DB) without a rewrite. 

[OpenId](/auth/openid) providers like the [FacebookAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/Auth/FacebookAuthProvider.cs#L23) is an example of Plugins that require multiple configuration settings but remain de-coupled from any one configuration source (e.g. Web.config).

### Example AppSettings Usage

By default ServiceStack ships with an [AppSettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Configuration/AppSettings.cs) which reads from your Web.Config `<appSettings/>` and a [DictionarySettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Configuration/DictionarySettings.cs) provider which can be populated with a standard C# `Dictionary<string,string>`.

Here's a quick example show-casing how to use the popular **AppSettings*:

```xml
<appSettings>
    <add key="LastUpdated" value="01/01/2012 12:00:00" />
    <add key="AllowedUsers" value="Tom,Mick,Harry" />
    <add key="RedisConfig" value="{Host:localhost,Port:6379,Database:1,Timeout:10000}" />
</appSettings>
```

Accessing the above appSettings in C#:

```csharp
var appSettings = new AppSettings();

DateTime lastUpdate = appSettings.Get<DateTime>("LastUpdated");
IList<string> allowedUsers = appSettings.GetList("AllowedUsers");

var redisConf = appSettings.Get<RedisConfig>("RedisConf");

//use default value if no config exists
var searchUrl = appSettings.Get("SearchUrl", "http://www.google.com");
```

### Default configuration in code

The default value support is nice as it allows having workable default options in code whilst still remaining overridable in the **Web.config** when it needs to. This allows local and test projects to work without duplicating and maintaining and their own Web.config files whilst allowing arbitrary settings to be overridable in different deployment environments.

It also allows distributing Stand-alone Console applications like the [PocoPower demo](https://github.com/ServiceStack/ServiceStack.UseCases/blob/master/PocoPower/Program.cs) but still provide the opportunity to override the settings without recompiling the source, e.g:

```csharp
var appSettings = new AppSettings();
var config = appSettings.Get("my.config", 
    new Config { GitHubName = "mythz", TwitterName = "ServiceStack" });

var github = new GithubGateway();
var repos = github.GetAllUserAndOrgsReposFor(config.GitHubName);

var twitter = new TwitterGateway();
var tweets = twitter.GetTimeline(config.TwitterName);
```

## Easy to implement

Despite being so versatile, it's surprisingly easy to implement a new Configuration Provider, e.g. Here's the entire implementation for [DictionarySettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Configuration/DictionarySettings.cs) which just needs to implement [ISettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Configuration/ISettings.cs) as is able to re-use the built-in `AppSettingsBase` base class:

```csharp
public class DictionarySettings : AppSettingsBase, ISettings
{
    private readonly Dictionary<string, string> map;

    public DictionarySettings(Dictionary<string, string> map=null)
    {
        this.map = map ?? new Dictionary<string, string>();
        settings = this;
    }

    public string Get(string key)
    {
        string value;
        return map.TryGetValue(key, out value) ? value : null;
    }
}
```
