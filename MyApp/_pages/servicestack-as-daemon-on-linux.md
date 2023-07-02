---
slug: servicestack-as-daemon-on-linux
title: Run ServiceStack as a daemon on Linux
---

When your web application is predominantly javascript with a REST service at the back-end there are many reasons why you might want to simply serve the static content through apache (or alternative) and run the service as a ...well... service.
Some examples are:

* Faster start-up times
* Avoiding lengthy XML configuration files
* Problems with mono ASP.NET [memory](https://bugzilla.xamarin.com/show_bug.cgi?id=381) [leaks](http://minimalreadership.blogspot.co.uk/2011/07/why-is-aspnet-on-mono-like-new-pet-that.html) and [random exceptions](http://teadriven.me.uk/2012/03/11/time-for-a-rest/).

Fortunately this is quite simple.

## Service example

The earlier example of [self hosting](/self-hosting) provides a good starting point, but needs to be modified slightly if running as a daemon. 

```csharp
using System;
using System.Reflection;
using Mono.Unix;
using Mono.Unix.Native;

using Funq;
using ServiceStack;

namespace ServiceStackExample
{
	public class AppHost : AppSelfHostBase
	{
		public AppHost() : base("Example", typeof(AppHost).Assembly) {}

		public override void Configure(Container container) {}
	}
	
	class Program
	{
		static void Main(string[] args)
		{
			//Initialize app host
			var appHost = new AppHost();
			appHost.Init();
			appHost.Start("http://127.0.0.1:8080/");

			UnixSignal[] signals = new UnixSignal[] { 
				new UnixSignal(Signum.SIGINT), 
				new UnixSignal(Signum.SIGTERM), 
			};

			// Wait for a unix signal
			for (bool exit = false; !exit; )
			{
				int id = UnixSignal.WaitAny(signals);

				if (id >= 0 && id < signals.Length)
				{
					if (signals[id].IsSet) exit = true;
				}
			}
		}
	}
}
```

Be aware that this makes use of posix functionality and will therefore not work under Windows. You will need to add the Mono.Posix library to your project references.

## Daemonising the application

As it stands the project produces a console application that responds to unix signals (press ctrl-c to exit if you are running it from a terminal). If your target platform is Ubuntu then the simplest way to automatically run your application as a daemon is to use an upstart script.

Create the following at /etc/init/example.conf

```ini
# ServiceStack Example Application

description "ServiceStack Example"
author      "ServiceStack"

start on started rc
stop on stopping rc

respawn

exec start-stop-daemon --start -c username --exec mono /path/to/application.exe
```

Ideally we would start the service when apache is ready but apache does not yet emit upstart events. Additional conditions could include a database dependency if required, for example "start on started mysql". Replace "username" with that of an unprivileged user on the system; this avoids the dangers of running the application as root.

You should now be able to start your application with

```bash
$ sudo start example
```

and access the default service information by visiting [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser of choice.

## Configuring apache

The following example configuration uses proxying to expose the REST service through apache, so you must ensure that mod_proxy has been enabled first:

```bash
$ sudo a2enmod proxy
```

Next create a file at /etc/apache2/sites-available/example

```apache
ProxyPass /api http://127.0.0.1:8080/ retry=0 max=50
ProxyPassReverse /api http://127.0.0.1:8080/

<VirtualHost *:80>
	DocumentRoot /path/to/static/content/

	<Directory />
	</Directory>

	<Directory /path/to/static/content/>
		Options Indexes MultiViews
		AllowOverride None
		Order allow,deny
		allow from all
	</Directory>
</VirtualHost>
```

Your site can then be enabled with

```bash
$ sudo a2ensite example
```

although you will need to disable the default sites if they are enabled. After restarting/reloading apache you should find your static content at [http://127.0.0.1](http://127.0.0.1) and the REST service at [http://127.0.0.1/api](http://127.0.0.1/api).


## Alternative nginx configuration

Create a file at /etc/nginx/sites-available/example

```nginx
server {
	listen 80;
	root /path/to/static/content;
	index index.html;

	location /api/ {
		proxy_pass http://127.0.0.1:8080/;
	}
}
```

To enable the site simply symlink from sites-available to sites-enabled (nginx does not have an equivalent a2ensite tool) and then restart/reload nginx. (N.B. The trailing forward slash on the proxy pass URL is important).

### Other hosting options on Linux / Mono
This StackOverflow answer lists the different options for [hosting ServiceStack on Linux with Mono](http://stackoverflow.com/questions/12188356/what-is-the-best-way-to-run-servicestack-on-linux-mono/12188358#12188358).
