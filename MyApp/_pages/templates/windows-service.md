---
title: Windows Service VS.NET Project Templates
slug: templates-windows-service
---

Inside [ServiceStack VS.NET Extension](/templates/#servicestackvs-vsnet-extension) the Windows Service Template makes it easy to create and install self-hosted ServiceStack solutions running within vanilla Windows Services without needing to rely on any additional 3rd Party packages or dependencies.

![](/img/pages/ssvs/new-project-winservice.png)

#### Optimized for Developer Productivity

To improve the development experience, the Windows Service Template includes a "Debug Mode" where **DEBUG** builds are run as a 
Console Application - improving developer iteration times and debugging experience.

#### Install, Start and Stop Windows Service Scripts

Also included are `install.bat`, `uninstall.bat`, `start.bat` and `stop.bat` Batch Scripts which lets you easily install and run 
your project as a local Windows Service. 

To Install, just build your project in **RELEASE** mode then run the `install.bat` script that's located in your projects home directory. 
After it's installed you can run `start.bat` to start your Windows Service which will launch your ServiceStack Project's Home Page 
in your default browser:

::: info
The batch files will automatically prompt for admin access if required
:::
