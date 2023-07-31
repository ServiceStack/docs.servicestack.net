---
slug: netcore-redis
title: ServiceStack.Redis on .NET Core
---

Documentation for ServiceStack.Redis can be found on [ServiceStack.Redis Project Page](https://github.com/ServiceStack/ServiceStack.Redis).

The [ServiceStack.Redis](https://www.nuget.org/packages/ServiceStack.Redis) NuGet package supports both .NET Framework and .NET Core Applications:

:::copy
`<PackageReference Include="ServiceStack.Redis" Version="6.*" />`
:::

Use [ServiceStack.Redis.Core](https://www.nuget.org/packages/ServiceStack.Redis.Core) instead if you're running 
[ASP.NET Core Apps on the .NET Framework](/templates/corefx)

:::copy
`<PackageReference Include="ServiceStack.Redis.Core" Version="6.*" />`
:::

### Basic Example

```csharp
using System;
using ServiceStack.Redis;

namespace MyApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var manager = new RedisManagerPool("localhost:6379");
            using (var client = manager.GetClient())
            {
                client.Set("foo", "bar");
                Console.WriteLine("foo={0}", client.Get<string>("foo"));
            }
        }
    }
}
```

Then hit "run" button **(F5)**. You should get following output:

![Output](/img/pages/8-Output.png)

## Run ServiceStack.Redis on Linux

### Install .NET Core

Suppose that you have Ubuntu 19.10 installed (to see installation instructions for other OS you can 
visit [.NET Core site](https://www.microsoft.com/net/core). Run commands in the console:

#### Register Microsoft key and feed

```
wget https://packages.microsoft.com/config/ubuntu/19.10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb    
```

#### Install the .NET Core SDK

```
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install dotnet-sdk-3.1
```
