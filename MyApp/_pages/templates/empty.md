---
title: Empty Project Templates
---
## Create Empty .NET 8 Web Apps

::include empty-projects.md::

## Empty ASP .NET Core and .NET Framework Templates

The templates below follow our recommended [physical project layout](/physical-project-structure) where **web** is our recommended empty starting project for Web Apps whilst **selfhost** is an empty project with the minimum dependencies.

<table class="table">
<tr>
    <th>.NET 8.0</th>
    <th>.NET Framework</th>
    <th>ASP .NET Core on FX</th>
    <th>Empty Project Templates</th>
</tr>
<tr>
    <td><a href="https://github.com/NetCoreTemplates/web">web</a></td>
    <td><a href="https://github.com/NetFrameworkTemplates/web-netfx">web-netfx</a></td>
    <td><a href="https://github.com/NetFrameworkCoreTemplates/web-corefx">web-corefx</a></td>
    <td align="center">
        <h3>Empty Web Template</h3>
        <a href="http://web.web-templates.io"><img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/web.png" width="500" /></a>
        <p><a href="http://web.web-templates.io">web.web-templates.io</a></p>
    </td>
</tr>
<tr>
    <td><a href="https://github.com/NetCoreTemplates/selfhost">selfhost</a></td>
    <td><a href="https://github.com/NetFrameworkTemplates/selfhost-netfx">selfhost-netfx</a></td>
    <td><a href="https://github.com/NetFrameworkCoreTemplates/web-corefx">selfhost-corefx</a></td>
    <td align="center">
        <h3>Empty SelfHost Console Template</h3>
        <a href="http://selfhost.web-templates.io"><img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/selfhost.png" width="500" /></a>
        <p><a href="http://selfhost.web-templates.io">selfhost.web-templates.io</a></p>
    </td>
</tr>
</table>


### Windows Service Template

You can use [winservice-netfx](https://github.com/NetFrameworkTemplates/winservice-netfx) to create a Windows Service but as this requires Visual Studio it's faster to continue creating new Windows Service projects within VS.NET using the **ServiceStack Windows Service Empty** Project Template.
