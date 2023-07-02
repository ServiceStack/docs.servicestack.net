---
title: Advanced Deployments with Octopus Deploy
---

## Deploying and Installing SSL certificates with Octopus Deploy

There's a good chance at some stage you're going to want to have sensitive environment specific information that you don't to want to store in source control, especially if your project is open source. This could be SSL certificates, license information or Production AppSettings like private database passwords, production connection strings or anything else you need to run your application.

One solution is to package all application settings and other dependencies on the build server. Using [TeamCity](http://www.jetbrains.com/teamcity/) and [Octopus Deploy](https://octopusdeploy.com/), packaging these settings up and deploying along with the application is easy to manage, flexible process that can streamline and automate even complicated application deployments.

Whilst the installation of SSL certificates, IIS bindings and other tasks here aren't time consuming to do manually, being able to get a new server up and running quickly by automating as much as possible has many benefits including consistent, replay-able deployments and not being tied to a particular infrastructure provider allowing you to easily switch to better valued hosting providers like [Hetzner](http://www.hetzner.de/en/) should you wish to in future.

## Getting started

This example is going to be an extension on the pattern used in the [Deploy multiple sites to a single AWS instance deployment guide](/deploy-multiple-sites-to-aws), but with an additional TeamCity step and a few extra process steps for Octopus Deploy to deploy an application with additional components and configuration.

1. **Settings** file read by ServiceStack application
2. ServiceStack **license file**
3. **SSL certificate** for HTTPs binding

As an overview, the TeamCity steps for building and deploying a **simple application** goes something like:

### [TeamCity Steps](/deploy-multiple-sites-to-aws#teamcity-installation-and-setup)

#### Build application

1. Restore NuGet dependencies 
2. Package application into .nupkg

#### Deploy application

1. Notify Octopus Deploy of new version available from TeamCity NuGet feed

With the added settings package, we are adding an additional step to the Build application list above.

1. **Package settings and other required environment files into .nupkg**
2. Restore NuGet dependencies 
3. Package application into .nupkg

#### Creating the NuGet package

To package the files into a NuGet package we will need to create a **nuspec** file. A .nuspec file is a [package specification](http://docs.nuget.org/docs/reference/nuspec-reference) that contains a list of files to include in the package, and this is where we have to specify the 3 files above, e.g:

```xml
<?xml version="1.0"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <id>BenchmarkAnalyzerSettings</id>
        <version>1.0.0</version>
        <authors>ServiceStack</authors>
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <description>Settings for the Benchmark Analyzer project</description>
    </metadata>
    <files>
      <file src="appsettings.license.txt" />
      <file src="appsettings.txt" />
      <file src="httpbenchmarks.pfx" />
    </files>
</package>
```

Once we have created a valid .nuspec file, we can get TeamCity to create a NuGet package using the **NuGet Pack runner type**. The main settings you will need for this configuration is the path where TeamCity can find the .nuspec file.

If you are hosting your own TeamCity instance, this is just a local directory. However, if you are hosting a TeamCity instance separately, eg on a dedicated build server, you will need to copy these files local to the build server to package them or use another VCS that is secure for application settings.

In this example, we will be packing the files from a known path on build server.

::: info
If you are having issues with this step, check the file/folder permissions to the .nuspec and included files
:::

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/tc-nuget-pack.png)

**Output directory** is the same as the **Artifact paths** in the **General Settings** of the build configuration for building the application package:

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/tc-build-config-paths.png)

So now our build steps for our application build and packaging steps looks like:

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/tc-build-config.png)

If everything is building correctly, you should get two **nupkg** files as artifacts from the build configuration, your application and settings package:

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/tc-project-output.png)

If you are using TeamCity’s built in NuGet server, these packages are published are available to use from Octopus Deploy.

## [Octopus Deploy process steps](/deploy-multiple-sites-to-aws#octopus-deploy-installation-and-initial-setup)

For a [simple application](/deploy-multiple-sites-to-aws#setting-up-octopus-deploy-projects) with no application settings or SSL certificate to install we only have 2 steps for Octopus Deploy.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-simple-example.png)

However, due to the need to automate the installation of all the projects dependencies, we have to add at least another 3 steps. We will need the following list of steps to happen before our newly published application is being hosted with the right settings, license and SSL binding.

1. **Publish settings package**
2. **Install SSL if required**
3. Deploy Application Package
4. **Copy Production Settings and License**
5. Update permissions

## Publish settings package

Publish settings is a "**Deploy Package**" process step looking at the TeamCity NuGet feed and using the new "BenchmarkAnalyzerSettings" package.

![Publish settings configuration](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-publish-settings.png)

>If you can’t see the [NuGet feed from TeamCity](/deploy-multiple-sites-to-aws#octopus-deploy-installation-and-initial-setup), you need to [set up a new NuGet feed](http://docs.octopusdeploy.com/display/OD/Package+repositories) under Library in Octopus Deploy.

## Install SSL If Required

Next we will need to install the SSL certificate if it is not already installed. To do this, we can add some PowerShell within the Octopus Deploy Library under **Script Modules**. A script module can be included in a process step, this gives you the chance to reuse some of the more common PowerShell between steps or projects. In this example, we are going to write some PowerShell to help us **install the certificate**.

```powershell
function Add-SSLCertificateToIIS{
    param([string]$certPath,[string]$pfxPassword)
    Write-Output "Importing certificate into ISS from $certPath"
    $certMgr = New-Object -ComObject IIS.CertObj -ErrorAction SilentlyContinue    
    $certMgr.ImportToCertStore($certPath,$pfxPassword,$true,$true)
}
```

This PowerShell function takes a path of a pfx file, a password and installs it to IIS to be used in a HTTPS binding.

Once we’ve added this script to a new Script module, we can **call the function from a process step**. If we add a new process step of "Install SSL If Required" and run another script that utilizes our new function, we can install the certificate that was packaged in our settings NuGet package.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-ssl-step.png)

The script in the screenshot above uses a couple of Octopus Deploy variables, as well as results from previous "Publish settings" step.

```powershell
Write-Output "Checking SSL certificate"
$cert = ( Get-ChildItem -Path cert:\LocalMachine\My| ? { $_.subject -like "*cn=$CertCn*" })
if(!$cert) {
    Write-Output "SSL certificate missing, installing..."
    $certDirPath = $OctopusParameters['Octopus.Action[Publish settings].Output.Package.InstallationDirectoryPath']
    Add-SSLCertificateToIIS "$certDirPath\$CertFileName" $SSLKey
} else {
    Write-Output "SSL present, skipping installation..."
}
```

`$SSLKey`, `$CertFileName` and `$CertCn` are all **Octopus Deploy variables** we have declared in the project variables section, we access them just like any declared PowerShell object.

The script itself is simply checking the `LocalMachine\My certificate` store that contains a specific string in the **subject** property, if no certificate that matches the CN value is present, it installs the certificate from where it was published using an encrypted password stored within Octopus Deploy.

Generally, this will only install the certificate once on first install of the new virtual machine, but will reinstall it if for whatever reason it has to be manually removed.

## Copy Production Settings and License

The last new process step that is included is a straight forward copy from source location to a destination. This step happens **after** the deployment of the application as the destination is not yet known until this step has completed. 

```powershell
$src = $OctopusParameters['Octopus.Action[Publish settings].Output.Package.InstallationDirectoryPath']
$dst = $OctopusParameters['Octopus.Action[Deploy Package].Output.Package.InstallationDirectoryPath']
Write-Output "Copying environment files from $src to $dst"
Get-ChildItem $src | Copy-Item -Destination $dst -Exclude "*.pfx"
```

The script also **excludes copying the pfx certificate** as this is not something we want to host in IIS application. Another step that can be added is one to delete the SSL certificate after step installation so this exclusion wouldn’t be required. Thankfully, there are some templates for common tasks like deleting files are available to add to your Octopus Deploy instance from an [open source project](https://github.com/OctopusDeploy/Library). 

Here is an example of the File System – Clean Directory template installed and used to clean pfx files from the output directory.

![View of template once installed](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-clean-directory.png)

## Using the SSL binding

We can now set which binding to use in IIS in the Deploy Package step which deploys the main application. To use a specific SSL certificate you will need to provide the **SSL Thumbprint**. An easy way to find the Thumbprint of the certificate is to open the original **.crt** file, select the **Details** tab and select **Properties Only** from the **Show** drop down.

One you have this value, you will need to provide it in the Add binding menu when adding an IIS binding.

![Add HTTPS IIS binding in deployment step](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-add-binding-https.png)

This thumbprint associates the binding with the newly installed certificate. Once installed, the certificate will show up in the IIS Management window under Server Certificates and the specified website will have the HTTPS binding associated with the installed certificate.

![IIS Manager after deployment](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/iis-certificates.png)

## HTTP binding redirect

So far we have setup all we need for the HTTPS binding, but since the default protocol when navigating to a site directly is HTTP, we want to setup a URL rewrite so that any requested resource on HTTP is redirected to HTTPS. To so this we will need to add some configuration in the Web.Config.Release transformation. 

```xml
<system.webServer>

  <rewrite xdt:Transform="Insert">
    <rules>
      <rule name="Redirect to HTTPS" stopProcessing="true">
        <match url="(.*)" />
        <conditions>
          <add input="{HTTPS}" pattern="^OFF$" />
        </conditions>
        <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="SeeOther" />
      </rule>
    </rules>
  </rewrite>

</system.webServer>
```

This configuration uses an IIS module that may or may not be installed on your server. It can be installed via the [Web Platform Installer](http://www.microsoft.com/web/downloads/platform.aspx) or installed separately, see the [IIS site for more details](http://www.iis.net/downloads/microsoft/url-rewrite).

We will **also need a HTTP binding** so the redirects can take place. IIS configuration in Octopus Deploy allows multiple IIS bindings for a deployed package. To add a HTTP binding, it is the same the same as step above, but selecting HTTP from the Protocol drop down.

### Managing settings files yourself vs Octopus Deploy variables

In this example we are storing both the application SSL certificate (.pfx file) for use with IIS, application settings and license in text files we are managing ourselves. To import a certificate and install it onto a new virtual machine we can’t get around the need to deploy the pfx file. However, there are many ways to handle application settings including the ServiceStack license.

Octopus Deploy has some really useful features when it comes to handling applications settings, even environment specific passwords etc. You could use this for storing the ServiceStack license itself as well as database credentials and other [sensitive information](http://docs.octopusdeploy.com/display/OD/Security+and+encryption). 

![Octopus Deploy Variables](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-variables.png)

Although not used in this example, Octopus Deploy variables can replace web.config `appSettings` values and then can feed to [ServiceStack’s AppSettings and its more useful data-structures](/appsettings#example-usage).

To enable this functionality, remember to enable it in your application's deploy step.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy-ssl/od-replace-app-settings.png)
