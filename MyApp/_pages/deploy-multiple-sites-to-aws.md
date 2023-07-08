---
title: Deploy Multiple Sites to a single AWS EC2 instance
---

### Why deploy multiple sites to a single AWS instance?

Deploying to **Cloud** and [PaaS](http://en.wikipedia.org/wiki/Platform_as_a_service) providers can provide a lot of utility by taking advantage of their integration, elasticity and autoscaling benefits. In a lot of cases Cloud providers are catered towards supporting popular flagship applications requiring very high levels of traffic. However, there are many times where your website only needs to cater for a specific use-case serving a niche audience, which would benefit from the simplicity and control of deploying and hosting multiple Websites on a single AWS instance. 

Amazon’s current tools for AWS, like [AWSDeploy](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/deploy_NET_standalone_tool.html) is designed around one application per VM instance. Whilst this makes autoscaling easier for them to manage, it also ends up being a lot more costly and wastes a lot of overhead for when your servers have the additional headroom that can easily support having multiple sites: 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/ec2_monitor_1_week.png)

## Simple deployments with [TeamCity](http://www.jetbrains.com/teamcity/) and [Octopus Deploy](https://octopusdeploy.com/)

The optimal setup we found to automate ASP .NET deployments to [AWS](http://aws.amazon.com/) were to use [TeamCity](http://www.jetbrains.com/teamcity/) for the Build and Continuous Integration and [Octopus Deploy](https://octopusdeploy.com/) for automating deployments. If you are not familiar with them, both TeamCity and Octopus Deploy are best-in-class commercial tools with generous free-usage quotas, providing a flexible and hassle-free experience. TeamCity specializes in supporting a vast number of different development environments whilst Octopus Deploy is highly specialized in providing a flexible deployments for .NET applications centered around NuGet packages, with automatic versioning and backups as well as rich insights into the deployment process.

Both these tools work well together thanks to [Octopus Deploy's integration with TeamCity](http://docs.octopusdeploy.com/display/OD/TeamCity) which offers a TeamCity plugin containing custom build tasks to integrate with Octopus Deploy.

## TeamCity Installation and Setup

TeamCity can be [downloaded from here](http://www.jetbrains.com/teamcity/download/). The only requirement is that it's able to access your version control system and the Octopus Deploy server. The Install wizard walks you through the installation which also has [Installation instructions](http://confluence.jetbrains.com/display/TCD8/Installing+and+Configuring+the+TeamCity+Server?_ga=1.3492344.976140721.1404279443) that you can refer to.

Once installed, there are a few steps to add to ensure it is configured and ready to use with Octopus Deploy.

  1. Setup TeamCity as a [native NuGet server](http://blog.jetbrains.com/teamcity/2011/12/setting-up-teamcity-as-a-native-nuget-server/)
  2. Install [Octopus Deploy TeamCity plugin](http://octopusdeploy.com/downloads) ([How to install a Plugin, download Octopus Deploy TeamCity plugin](http://confluence.jetbrains.com/display/TCD8/Installing+Additional+Plugins))

For this tutorial I’ve used TeamCity 8.1 and Octopus Deploy 2.5.6.

To turn on TeamCity’s native NuGet server, go to **Administration** at the top right, select **NuGet Settings** on the left menu and click the **Enable** button.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/nuget-settings-1.png)

If you are missing the public feed and want Octopus Deploy to not have to use authentication, you have to enable the use of Guest users. Under **Server Administration**, select **Authentication** and Allow login as `guest` user under **General Settings**. 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-authentication-settings.png)

You will also need to enable the use of NuGet.exe in your restore and build steps, select the **NuGet.exe** tab from the NuGet Settings screen and either Fetch or **Upload NuGet**.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-nuget-exe-version.png)

If you are using TeamCity version 8 or greater, you can use the **Plugin List** menu under Server Administration to help you upload a plugin. 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-plugins.png)

Once installed, restart the TeamCity server by restarting its windows service, the plugin should now appear in the Plugin List.

## Team City project build configurations

Now that we have TeamCity configured, we can create a project and build configurations that will produce our NuGet packages for Octopus Deploy to consume.

An overview of the setup we’re using is for every web application, we are going to have a project with at least 2 build configurations. One for building the application NuGet package and one for deploying it to Octopus Deploy. The simplest Build Application build configuration will itself, have two steps, **Restore NuGet Packages** and **Build Package**. Restore from NuGet is used under the assumption that we want to automatically restore our application dependencies using NuGet 2.7+ and pull them in at build time if they aren’t already cached. 

As a quick guide, this is using the following configuration:

 - Runner type: 		
   - **NuGet Installer**
 - NuGet.exe: 			
   - **2.8.2 (anything above 2.7 should be fine)**
 - Package sources:	
   - **NuGet V2 API url (include your own if needed here)**
 - Restore Mode: 	
   - **Restore (required NuGet 2.7+)**

Everything else is left as default or application specific like Path to solution file.
Here is a screen shot of this configuration used for the [StackApis](https://github.com/ServiceStackApps/StackApis) example application.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-nuget-restore-step.png)

The next step in the first build configuration is to package the application into a NuGet package. The configuration for this step is as follows.

 - Runner type:			
  - **Visual Studio**
 - Visual Studio:			
  - **Microsoft Visual Studio 2013**
 - Targets:			
  - **Rebuild;**
 - Run OctoPack:			
  - **true**
 - OctoPack package version:	
  - **1.0.%build.number%**

The rest of the settings are project specific or defaults. Here's a screenshot of the StackApis configuration: 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-nuget-build-package-step.png)

To make it more automated, a "Trigger" should be added so that every time a checkin occurs on the configured VCS, a build is queued. Select **Triggers** from within the Build Configuration screen to add a **VCS Trigger**.

> If you are missing the Octopus Packing section seen in the screenshot above, it means you don’t have the Octopus Deploy TeamCity plugin installed or it isn’t working. &lt;Insert troubleshooting TC plugins&gt;

Another requirement is that the application you want to package will require a new NuGet dependency on **OctoPack**. OctoPack is a package for Octopus Deploy which adds a new build target to your application to be used with the TeamCity plugin. 

You can add it to your application with the following NuGet command in Visual Studio:

:::copy
`<PackageReference Include="OctoPack" Version="3.*" />`
:::

Once added, the TeamCity plugin will do the rest if the checkbox is ticked. It is worth mentioning that because OctoPack is running as a new target, it can be manually incorporated into an existing building configuration using MSBuild by just adding the target. It’s also an open source project so more information can be found on the [OctoPack Github page](https://github.com/OctopusDeploy/OctoPack).

The next build configuration has a single step which is responsible for notifying Octopus Deploy to proceed with the deployment of a specific project to a specific environment. The reason we have these steps has two different build configurations is due to the requirement of having the NuGet packages published on the TeamCity NuGet feed. These packages will not appear until the build configuration that produces the package has completed. By separating them, we’re ensuring that TeamCity will have published the latest package version ready for Octopus Deploy.

Due to use of API keys and specific values that need to exist in Octopus Deploy first, we need to leave this next TeamCity step until after Octopus Deploy is setup. Once you have Octopus Deploy setup, skip to the **TeamCity integration** section.

## Octopus Deploy installation and initial setup ##

Octopus Deploy is a NuGet package centric continuous deployment system for .NET applications that is extremely flexible when it comes to deployment configurations. It has a strong focus on user experience, installation and setup is very quick intuitive. They even have a great set of [introduction videos](http://octopusdeploy.wistia.com/projects/gguvhmqn6b) that take you through getting up and running with Octopus Deploy. Also well maintained [documentation](http://docs.octopusdeploy.com/display/OD/Home) and active [forums](http://help.octopusdeploy.com/discussions) if you get stuck.

See this [Installation Video Guide](http://octopusdeploy.wistia.com/medias/fr2k2ademq) to walk you through Installing Octopus Deploy, once Installed you’ll be able to access its web interface to manage your Environments, Projects and Libraries. For the moment, we’ll want to [Create an Environment](http://octopusdeploy.wistia.com/medias/psanqpbi21) for our AWS instance. Create an environment for your applications, e.g. Production.

We’ll also need to add TeamCity as a NuGet feed. To do this, navigate to **Library** and select **External Feeds**: 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-add-nuget-feed.png)

Like most of the UIs in Octopus Deploy, it’s pretty intuitive and self-explanatory. The URL for the feed can be retrieved from the TeamCity Administration page on **NuGet Settings**. Select the public feed, or private feed and provide a valid TeamCity user credentials.

Octopus Deploy needs somewhere to deploy too so we need to create an Environment and add our AWS instance as a `Tentacle`. A ‘Tentacle’ is just a machine that can be deployed too from Octopus Deploy. To do this, we need to be able to remotely access the AWS instance to [install the tentacle client](http://octopusdeploy.wistia.com/medias/qp12uky9qy), the easiest way to do this is [using RDP](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/LaunchingAndUsingInstancesWindows.html).

Once installed, the remote machine will appear in your host Octopus Deploy server under the environment is was added too.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-add-machine-to-environment.png)

You’ll want to add this machine to a **Role**, in this example, the machine has just one role, `ServiceStackExamples`. Roles are "tags" that are used to target deployments steps which will look at soon.

## Setting up Octopus Deploy Projects

The project is where specific “Process Steps” can be added as a part of your automated deployment process. These can include one or more NuGet Packages as well as PowerShell steps, email, Deploy to Azure, FTP or even a manual intervention step. For our simple project we will need the Deploy NuGet Package step as well as an additional PowerShell step which we’ll look at later.

To create a new project, first view all projects under the `Projects->All` menu and then select **Add Project** at the top right. In this example, the project is called `StackApis`.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-add-project.png)

Now that we have created an environment and a project, we need to add some steps. Add a **Deploy NuGet Package** step to your project.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-add-step.png)

Process steps are extremely configurable pieces that can do as little or as much as you’ll need. The first thing we need to do is pick a target role/roles. In our example, this is `ServiceStackExamples`. This configures this deployment step to target machines with the “ServiceStackExamples” role attached to it. 

We will also have to tell the step where to access our application via a NuGet feed. If you added TeamCity’s NuGet feed as an External Feed in the previous instructions, it should be available from the NuGet feed drop down list. You will also need to specify the name of the package. If you are using OctoPack to package up your application, this should be the same name as your application. 

OctoPack has created a `.nuspec` file that includes all your application files and configured the ID of your package also, this was what this option is referring too.

At the very bottom we can also restrict the step to only be used in a limited set of environments. We will be adding `Production` here as we only want this step to be process for the Production environment.

Each process step can also have additional features added, for the deployment step, we get the following list.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-process-step-features.png)

For this example, we are deploying an ASP.NET application, so one additional 'Feature' we will need, is an **IIS web site and application pool** for the application. This will handle things like bindings, application pool identity, SSL and other aspects of managing IIS. We don’t need SSL in this instance, so we’ll just go with a basic configuration. 

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-iis-configuration.png)

Octopus Deploy has an introduction [video for setting an ASP.NET deployment here](http://octopusdeploy.wistia.com/medias/7wfdk4vtge).

#### AWS Performance issues with Elastic Block Store

One issue that was discovered during this process was high latency on the applications we have deployed when compared to applications deployed by the AWSDeploy tool. This was due to permissions of the folder being deployed too by Octopus Deploy. To fix this issue, we added an additional step and PowerShell script to add the appropriate permissions to the folders where the latest version of the application was deployed.

Add a new step that runs after the deployment step created in the section above. Select **Run a PowerShell script** as the process step template. Add the same machine role as deployment step and add the following PowerShell script:

```shell
	$Acl = Get-Acl "C:\inetpub"
	$ArIIS = New-Object  system.security.accesscontrol.filesystemaccessrule("IIS_IUSRS","ReadAndExecute","Allow")
	$appPoolName = $OctopusParameters['Octopus.Action[Deploy Package].IISWebSite.ApplicationPoolName']
	Write-Output $appPoolName
	$Acl.SetAccessRule($ArIIS)
	$appPath = $OctopusParameters['Octopus.Action[Deploy Package].Output.Package.InstallationDirectoryPath'] 
	Set-Acl $appPath $Acl
	$appPoolAclParam = "IIS AppPool\$appPoolName`:(OI)(CI)M"
	cmd /c icacls "$appPath" /grant "$appPoolAclParam"
```

Most of the script above is generic except for 2 parts where the exact name of the previous deployment step is used to access an Octopus Deploy variable. `Octopus.Action[&lt;insert name of your process step&gt;]` can be updated to target the correct step. The "Insert a variable" menu on the right of the script input box can help when trying to find the right variable you need to use in your scripts.

This script updated the permissions and gives Modify access to folder where your application is deployed and to the application pool identity that is running your application. 

## TeamCity Integration

Now that our project is setup in Octopus Deploy, we will need an API key from Octopus Deploy to be used by TeamCity to fire off the deployment step. To get the API key, access your user profile from the top right of the Octopus Deploy dashboard and select the API keys tab.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-add-apikey.png)

Note, make sure you save the API key somewhere as we will need to paste it into TeamCity build configuration.

Now navigate to your TeamCity build server and create a new build configuration that runs after the initial Build Package step in your TeamCity project. This build configuration does not need a VCS source, but it does need a single build step and a trigger. 

Create a new build step with the following configuration.

 - Runner type:			
  - **Octopus Deploy: Create release**
 - Octopus URL:			
  - **&lt;URL to your Octopus Deploy web portal&gt;**
 - API key:			
  - **The API key you just created**
 - Octopus version:		
  - **2.0+**
 - Release number:		
  - **1.0.%dep.&lt;previousBuildStepId&gt;.system.build.number%**
 - Deploy to:			
  - **&lt;Octopus Deploy environment name, eg Production&gt;**

Below is a screenshot of the StackApis Deploy step in TeamCity:

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-add-deploy-build-step.png)

Notes on Release number, by using the method shown above, running the deploy step manually even with correct snapshot and artifact dependencies will not work due to Octopus Deploy failing as the version from a previous build would already exist. This might be a matter of preference, but since Octopus Deploy as very nice ways of doing re-releases and rollbacks, it makes sense to only fire the deployment of a new version of the package from Octopus Deploy itself and not from TeamCity. If you want to have this control from TeamCity, the Release number can be changed to `x.x.%build.number%`, this will get automatically incremented even if run manually. If you are having issues with build and release numbers, it can be left blank for Octopus Deploy to increment, however this might make it harder to related TeamCity build numbers with release numbers.

You will also need to add a trigger to this step so it is fired on the completion of a successful build of the previous build configuration which produced the NuGet package. One way to achieve this is to first add a snapshot and artifact dependency on the Build package step.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-add-artifact-dep.png)

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-add-snapshot-dep.png)

Once these dependencies are setup, add a trigger.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-finish-build-trigger.png)

This means the build configuration will run after a successful build of the package.

If you now navigate to your project in TeamCity, you should see two build configurations. Here is an example of StackApis:

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/tc-project-result.png)

Now if we **Run** the **Build** step above from TeamCity, the Deploy step should also fire. If they are successful, we should be able to navigate to our Octopus Deploy Projects dashboard to hopefully see the following.

![](https://github.com/ServiceStack/Assets/raw/master/img/wikis/octopus-deploy/od-release-result.png)

This means your TeamCity deploy step successfully kicked off your Octopus Deploy step. This may take a while as it requires your application package to be transferred to your AWS instance and this will vary based on bandwidth available and size of your application.

With any luck, your deployment will be a success, however Octopus deploy does log quite a lot of information about the tasks being performed so the best place to look for troubleshooting is the Task Log. Click on your latest release and select the Task Log tab. To see more information, select **Verbose** at the top right of the Task Log. This will show you information like remote paths, machines, versions etc etc.

## Adding more applications ##
Since TeamCity and Octopus Deploy are setup, adding additional applications becomes easier. Getting multiple applications onto the one AWS instance, or any other Octopus Deploy Tentacle, is a matter of creating new projects for both TeamCity and Octopus Deploy targeting the same environment.
