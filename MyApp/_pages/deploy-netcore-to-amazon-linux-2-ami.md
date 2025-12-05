---
slug: deploy-netcore-to-amazon-linux-2-ami
title: Deploying .NET Core Apps to Amazon Linux 2 AMI
---

A common way for reliably hosting .NET Core Apps on Linux is to use [supervisor](http://supervisord.org/index.html) to monitor the `dotnet` self-hosting processes behind an nginx reverse proxy which handles external HTTP requests to your website and proxies them to the dotnet process running your Web App on a local port. You'll need access to a Unix environment on your client Desktop, either using Linux, OSX or [Installing Windows Subsystem for Linux (WSL)](https://github.com/ServiceStack/redis-windows#option-1-install-redis-on-ubuntu-on-windows).

## Amazon Linux 2

[Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/) is the next-generation Amazon Linux operating system that provides modern application 
environment with the latest enhancements from the Linux community and offers long-term support.

It is optimized for use in Amazon EC2 with a latest and tuned Linux kernel version. As a result, many customer workloads perform better on Amazon Linux 2. 

We'll start by SSH'ing into your Amazon Linux server, e.g:

```bash
ssh -i ~/pem/<my>.pem ec2-user@ec2-<ip-address>.compute-1.amazonaws.com
```

### Install .NET 6.0

Being based on RHEL you can use yum and the [Cent OS 7 Install Instructions](https://docs.microsoft.com/en-us/dotnet/core/install/linux-centos#centos-7-)
to install .NET Core on Amazon Linux 2:

:::sh
sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
:::

If you just want a minimal ASP.NET Core runtime to run Web Apps you can just install:

:::sh
sudo yum install aspnetcore-runtime-6.0
:::

But if you'd also like to use dotnet tools like the [x super utility](/dotnet-tool) you'll need to install the SDK:

:::sh
sudo yum install dotnet-sdk-6.0
:::

Then install dotnet tools you want which will install under the `ec2-user` home directory at `~/.dotnet/tools`:

:::sh
dotnet tool install --global x
:::

You'll either need to exit & re login to configure the dotnet tool path or you can import it manually with:

:::sh
. /etc/profile.d/dotnet-cli-tools-bin-path.sh
:::

Where you should now be able be able to run dotnet tools, e.g:

:::sh
x
:::

### Setup the deploy User Account

We'll then create a dedicated user account for hosting and running your .NET Core Apps to mitigate potential abuse. 
Create the `deploy` user account with a `/home/deploy` home directory and add them to the `sudo` group:

:::sh
sudo useradd -m deploy
:::

Create a password (optional):

:::sh
sudo passwd deploy
:::

For seamless deployments use `visudo`:

:::sh
sudo visudo
:::

To allow `deploy` to run `supervisorctl` without prompting for a password:

```ini
## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL
%deploy ALL=(ALL:ALL) NOPASSWD: /usr/bin/supervisorctl
```

To give `sudo` commands access to installed dotnet tools add it to `secure_path`:

```ini
Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/home/ec2-user/.dotnet/tools
```

::: info Tip
In vi type `i` to start editing a file and `ESC` to quit edit mode and `:wq` to save your changes before exiting
:::

Now we'll create an `~/apps` folder as the `deploy` user where your .NET Core Apps should be deployed to, e.g:

```bash
sudo su - deploy
mkdir ~/apps
exit
```

### Setup supervisor

Install **supervisor** on Amazon Linux 2 by first [enabling the EPEL repository](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-enable-epel/):

:::sh
sudo amazon-linux-extras install epel
:::

Then use `yum` to install `supervisor`

:::sh
sudo yum install supervisor
:::

You'll also need to create a `supervisord.service` systemd script which you can install with:

:::sh
sudo npx add-in supervisord.service
:::

Which will write this [supervisord.service](https://gist.github.com/gistlyn/18dbaa471ea09f744493d5866ede599e) gist to `/usr/lib/systemd/system`.

We'll also want to configure supervisor to look for our `*.conf` scripts in the conventional location:

:::sh
echo 'files = /etc/supervisor/conf.d/*.conf' | sudo tee -a /etc/supervisord.conf
:::

We can then enable & start the systemd supervisord.service with:

```bash
sudo systemctl enable supervisord.service
sudo systemctl start supervisord
```

You'll then need to create a separate config file for each app in `/etc/supervisor/conf.d/`. 

We can use the same template below by replacing `my-app` with the name of your App:

#### /etc/supervisor/conf.d/app.my-app.conf 

```ini
[program:app-my-app]
command=/usr/local/bin/dotnet /home/deploy/apps/my-app/MyApp.dll
directory=/home/deploy/apps/my-app
autostart=true
autorestart=true
stderr_logfile=/var/log/app-my-app.err.log
stdout_logfile=/var/log/app-my-app.out.log
environment=ASPNETCORE_ENVIRONMENT=Production,ASPNETCORE_URLS="http://*:5000/"
user=deploy
stopsignal=INT
```

We can use [x mix](/mix-tool) to simplify this by downloading & renaming the `supervisor` configuration template above:

:::sh
sudo npx add-in supervisor -name acme
:::

You can further customize the template by adding any number of `-replace term=with` switches, e.g. you can replace the `port` with:

:::sh
sudo npx add-in supervisor -name acme -replace 5000=5002
:::

Then tell supervisor to register our App configuration:

:::sh
sudo supervisorctl update
:::
        
### Setup nginx

Use `yum` to install nginx:

:::sh
sudo yum install nginx
:::

### Start nginx

:::sh
sudo systemctl start nginx.service
:::

### Create Virtual Host Configuration

You'll also need to create a separate config for each website on nginx in `/etc/nginx/conf.d/`. You can use the same template for each website but you'll need to change the server_name with the domain name you want to use for the App and use a different port number for each App:

### /etc/nginx/conf.d/my-app.org.conf

```nginx
server {
    listen       80;
    server_name my-app.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_ignore_client_abort off;
        proxy_intercept_errors on;

        client_max_body_size 500m;
    }
}
```

Or use [x mix](/mix-tool) to write the above template using your preferred **port** and **TLD** with:

:::sh
sudo npx add-in nginx-yum -name acme -replace 5000=5002 -replace org=io
:::

After this we can tell nginx to reload its configuration, as there's nothing listening to `http://localhost:5002` yet nginx will return a 502 Bad Gateway response but will start working as soon as our deployed .NET Core Apps are up and running.

:::sh
sudo nginx -s reload
:::

### Setting up SSH keys

We can now exit our remote Linux server and return to our local machine and prepare our deployment script. Before doing this we recommend [setting up SSH and copying your SSH public key to your remote server](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2) which is both more secure and more convenient than using a password. You'll want to configure the `~/.ssh/authorized_keys` for your `deploy` user account as well as `ec2-user` account for convenience.

A manual 'tool-free' solution if you're using WSL is to copy your SSH public key to the clipboard, e.g:

:::sh
cat ~/.ssh/id_rsa.pub | clip.exe
:::

Then as the `deploy` user paste the contents of `id_rsa.pub` to `/home/deploy/.ssh/authorized_keys` and ensure it has the correct restrictive permissions:

```bash
mkdir ~/.ssh
vi ~/.ssh/authorized_keys
# i + paste clipboard + <esc>:wq
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Create the deployment script

[rsync](https://rsync.samba.org/) is a beautiful utility that provides a fast, secure file transfer over SSH which you can use to sync the contents of folders to a remote site. There's only 2 commands you need to run to deploy a local .NET Core App remotely, `rsync` to sync the published .NET Core App files and `supervisorctl` to restart the `supervisord` process that runs and monitor the .NET Core App which you can add to a [deploy.sh](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks/deploy.sh) that you can run with WSL bash:

```bash
rsync -avz -e 'ssh' bin/Release/net5/publish/ deploy@ec2-<ip-address>.compute-1.amazonaws.com:/home/deploy/apps/acme
ssh deploy@ec2-<ip-address>.compute-1.amazonaws.com "sudo supervisorctl restart app-acme"
```

To automate the entire deployment down to a single command you can add an npm script to your project's `package.json` that creates a production client and server build of your App before running WSL's `bash` to run the deploy script. All [Webpack Single Page App Templates](/templates/single-page-apps) already have a **publish** npm script, so you would just need to add a **deploy** script to run publish before running the above `deploy.sh`

```json
{
    "publish": "dotnet publish -c Release",
    "deploy": "npm run publish && bash deploy.sh",
}
```

Now to deploy your App you can just run:

:::sh
npm run deploy
:::

Which deploys your published App to your remote Linux server instance using `rsync` to only copy the incremental parts of the App that's changed (typically completing in <1s) and `ssh` to run a remote command to restart the `suprvisord` process, starting the .NET Core App with the latest deployed version.

After you deploy your and restart your `supervisor` Service your .NET Core App should now be publicly available at your chosen domain, if you have issues
you can view your App's error log for info, e.g:

:::sh
tail -n 50 /var/log/app-[my-app].err.log
:::

### Setup Lets Encrypt

If you're configuring an Internet Website you'll also likely want to configure it to use SSL, the easiest & free way is to use 
[letsencrypt.org](https://letsencrypt.org/) which you can install with:

:::sh
sudo yum install certbot python2-certbot-nginx 
:::

Then use `certbot` to automatically configure the domains you want to configure to use SSL, e.g:

:::sh
sudo certbot -d acme.io -d www.acme.io
:::

Now you're .NET Core creation should be accessible via `https://` & the shiny new secure badge in the users Browsers URL.
