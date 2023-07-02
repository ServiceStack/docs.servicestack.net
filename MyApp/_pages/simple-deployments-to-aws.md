---
title: Deploy multiple ASP.NET Websites to AWS with WebDeploy
---

We've [previously discussed](/deploy-multiple-sites-to-aws#why-deploy-multiple-sites-to-a-single-aws-instance) the cost and automation benefits of **deploying multiple websites to a single AWS instance** using [TeamCity and Octopus Deploy](/deploy-multiple-sites-to-aws) which is a great combination for managing production website deployments, taking advantage of the automation capabilities of TeamCity and the release management features of Octopus Deploy.

There's an even simpler option for deploying multiple ASP.NET Websites to a single AWS instance which can be initiated directly from within VS.NET (i.e. without needing any external TeamCity and OctopusDeploy services) by using VS.NET's built-in **Web Deploy** tool. In this tutorial we'll walkthrough 2 different approaches for deploying websites using either VS.NET's **Publish Web Deploy wizard** or alternatively using a **Gulp Task** which is better suited for deploying Single Page Apps requiring any necessary pre and post processing packaging and deployment steps.

## Setting up the instance

For a concrete example, we're going to be using an [AWS EC2 instance](http://aws.amazon.com/ec2/) running Windows Server 2012 with IIS installed. To enable Web Deploy, a package needs to be installed on the server so you will need a few things to get started.

-   Remote access to the instance
-   [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx)
-   An IIS application to deploy too

By default, you should have remote access to your EC2 instance, however, if you don’t, you will need to add an inbound network rule to the security group that your instance is running under:

![RDP port](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/open-aws-ports-1.png)

This can be done by locating your instance in AWS, and clicking on the currently assigned security group:

![View security group](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/aws-security-group.png)

While here, you will also need to add a new security rule for Web Deploy to work. It uses port **8172** by default. 

![WebDeploy and HTTP/S ports](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/open-aws-ports-2.png)

::: info
It is good practice to restrict inbound ports to RDP and other ports related to administrative tasks to a subnet or even specific IP address to improve security. See AWS's "[Recommended Network ACL Rules for Your VPC](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Appendix_NACLs.html)"
:::

If you are missing HTTP and HTTPS, ensure these have been added as well.

Now we can remote into your instance via RDP. [Amazon has some detailed documentation](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/connecting_to_windows_instance.html) about how to go about this, but basically you will need the address of the server, username and password.

Once connected, you’ll want to copy across the Web Platform Installer to enable the Web Deploy feature to work on IIS. Run the web platform installer and search up the top right for **Web Deploy** and one of the results should be **Web Deploy 3.5 for Hosting Servers**. 

![Install web deploy hosting](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/install-webdeploy-hosting.png)

Click **Add** and then **Install** at the bottom right.

Once installed, we now have to create an IIS web site as our deployment target.

![Create IIS application](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/create-iis-application.png)

Open the IIS Manager, right click on **Sites**, select **Add Website...** and provide the appropriate information for your web site such as the domain name. Record the name of your website as we will need this later.
 
## Deploy using Publish from Visual Studio

With the remote server setup to accept Web Deployed applications, we can create an application to deploy. For this example, we are going to use the **ServiceStack ASP.NET with Bootstrap** template from [ServiceStackVS](/create-your-first-webservice). This will create a simple HelloWorld application that we can use to test our deployment.

![Bootstrap template selection](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/bootstrap-app-template-select.png)
 
Once created, we can use the Visual Studio publish wizard by right-clicking on the main project at the top and selecting `Publish...`:

![Create publish profile](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/publish-wizard-1.png)
 
At the first screen, select a **Custom** publish target and give your profile a name like **AWS**:

![Name publish profile](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/publish-name-profile.png)
 
The next screen will require your EC2 **Public DNS** name that can be obtained via the AWS management portal for your instance. Also, the site name we created earlier needs to match. You will also be required to provide a username and password of an account that has sufficient permissions to publish your application. 

> An administration account has sufficient permissions, alternatively, there is an article on **[Installing and Configuring Web Deploy on IIS 8](http://www.iis.net/learn/install/installing-publishing-technologies/installing-and-configuring-web-deploy-on-iis-80-or-later)** that explains this in the section titled **Configuring a Site for Delegated Non-Administrator Deployment**.

![Web deploy profile settings](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/publish-wizard-2.png)

>You may get the following warning about certificate presented by the server, if you haven’t setup the server with the appropriate certificates you can still continue.
> ![Certificate warning](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/publish-cert-warning.png)
 
Once **Publish** has started, this will build your application and push the files using Web Deploy.
The first deployment might take some time due to having to copy all files required by the application to run, but subsequent copies only update the files that are different, making this a very quick way to update and present the progress of an application on a development server.

![Publish wizard demo](https://github.com/ServiceStack/Assets/raw/master/img/wikis/web-deploy/webdeploy_bootstrap.gif)

## Deploy using Gulp

Although the Publish wizard is a great tool, by default, it doesn't work well with single page applications like AngularJS where the client side of the application that requires pre/post processing of client side scripts and assets. Another way to publish still using Web Deploy (msdeploy) is by using a Gulp task. The Gulp task simply wraps msdeploy using the [gulp-msdeploy Gulp package](https://github.com/ServiceStack/gulp-msdeploy) ([base on grunt-msdeploy written by Jack Davis](https://www.npmjs.org/~mrjackdavis)). If we create a new project using the **AngularJS App** template from ServiceStackVS, we can modify what is already there very quickly to get our application to deploy to our AWS instance.
 
Once the project is created, we will fill out the same details given to the Publish wizard, but in a configuration file located at `/wwwroot_build/publish/config.json`. By default, it has placeholder values shown below:

```json
{
    "iisApp": "ExampleAngularJSApp1",
    "serverAddress": "deploy-server.example.com",
    "userName": "{WebDeployUserName}",
    "password" : "{WebDeployPassword}"
}
```

Where the `iisApp` value is the name of your project. Below is the filled in example details as shown in the publish wizard:

```json
{
    "iisApp": "ExampleApplication",
    "serverAddress": "ec2-XXX-XXX-XXX-XXX.ap-southeast-2.compute.amazonaws.com",
    "userName": "Administrator",
    "password" : "MyPassword123"
}
```

Once filled in, we can run the provided tasks 2 and 3 to package our application and task 4 to deploy it. If you are running Visual Studio 2015 (or 2013 with extension), these Gulp tasks can be very simply from Task Runner Explorer UI.

::: info
Even though by using GitHub's default Visual Studio .gitignore the config will not turn up in source control, the password is still **stored in plain text**. This should be taken into account when deciding if this method of deployment is suitable for your development/deployment environment
:::

### Bundling ###

This template is also taking care of optimizations like CSS and JS minification in the packaging steps. Package of the server files and client files separately enable us to update and deploy an optimized client side version of our application quickly as only our client side resources will have to be updated.
