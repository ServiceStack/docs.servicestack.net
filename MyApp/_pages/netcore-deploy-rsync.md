---
slug: netcore-deploy-rsync
title: Deploying .NET Core Apps to Ubuntu with rsync
---

A common way for reliably hosting .NET Core Apps on Ubuntu is to use [supervisor](http://supervisord.org/index.html) to monitor the `dotnet` self-hosting processes behind an nginx reverse proxy which handles external HTTP requests to your website and proxies them to the dotnet process running your Web App on a local port. You'll need access to a Unix environment on your client Desktop, either using Linux, OSX or [Installing Windows Subsystem for Linux (WSL)](https://github.com/ServiceStack/redis-windows#option-1-install-redis-on-ubuntu-on-windows).

## Setup the deploy User Account

We'll start by creating a dedicated user account for hosting and running your .NET Core Apps to mitigate potential abuse. SSH into your Ubuntu server and create the `deploy` user account with a `/home/deploy` home directory and add them to the `sudo` group:

```bash
$ sudo useradd -m deploy
$ sudo usermod -aG sudo deploy
```

For seamless deployments use `visudo`:

:::sh
visudo
:::

To allow `deploy` to run `supervisorctl` without prompting for a password:

```ini
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
%deploy ALL=(ALL:ALL) NOPASSWD: /usr/bin/supervisorctl
```

::: info Tip
In vi type `i` to start editing a file and `ESC` to quit edit mode and `:wq` to save your changes before exiting
:::

## Setup supervisor

Install supervisor using apt-get:

:::sh
sudo apt-get install supervisor
:::

You'll need to create a separate config file for each app in `/etc/supervisor/conf.d/`. We can use the same template below by replacing `myapp` with the name of your App:

### /etc/supervisor/conf.d/web.myapp.conf

```ini
[program:web-myapp]
command=/usr/bin/dotnet /home/deploy/apps/myapp/MyApp.dll
directory=/home/deploy/apps/myapp
autostart=true
autorestart=true
stderr_logfile=/var/log/web-myapp.err.log
stdout_logfile=/var/log/web-myapp.out.log
environment=ASPNETCORE_ENVIRONMENT=Production
user=deploy
stopsignal=INT
```

## Setup nginx

You'll also need to create a separate config for each website on nginx in /etc/nginx/sites-available/. You can use the same template for each website but you'll need to change the server_name with the domain name you want to use for the App and use a different port number for each App:

### /etc/nginx/sites-available/myapp.example.org

```nginx
server {
    listen       80;
    server_name myapp.example.org;

    location / {
        proxy_pass http://localhost:5001;
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

You'll then need to create symlink for each website to tell nginx you want each website to be enabled:

:::sh
ln -s /etc/nginx/sites-available/myapp.example.org /etc/nginx/sites-enabled/myapp.example.org
:::

After this we can tell nginx to reload its configuration, as there's nothing listening to `http://localhost:5001` yet nginx will return a 502 Bad Gateway response but will start working as soon as our deployed .NET Core Apps are up and running.

:::sh
/etc/init.d/nginx reload
:::

## Setting up SSH keys

We can now exit our remote Linux server and return to our local machine and prepare our deployment script. Before doing this we recommend [setting up SSH and copying your SSH public key to your remote server](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2) which is both more secure and more convenient than using a password.

## Create the deployment script

[rsync](https://rsync.samba.org/) is a beautiful utility that provides a fast, secure file transfer over SSH which you can use to sync the contents of folders to a remote site. There's only 2 commands you need to run to deploy a local .NET Core App remotely, `rsync` to sync the published .NET Core App files and `supervisorctl` to restart the `supervisord` process that runs and monitor the .NET Core App which you can add to a [deploy.sh](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks/deploy.sh) that you can run with WSL bash:

```shell
rsync -avz -e 'ssh' bin/Release/netcoreapp3.1/publish/ ubuntu@myapp.example.org:/home/deploy/apps/myapp
ssh ubuntu@myapp.example.org "sudo supervisorctl restart web-myapp"
```

To automate the entire deployment down to a single command you can add an npm script to your project's `package.json` that creates a production client and server build of your App before running WSL's `bash` to run the deploy script. All [Webpack Single Page App Templates](/templates/single-page-apps) already have a **publish** npm script, so you would just need to add a **deploy** script to run publish before running the above `deploy.sh`

```json
{
    "publish": "nuxt build && dotnet publish -c Release",
    "deploy": "npm run publish && bash deploy.sh"
}
```

Now to deploy your App you can just run:

:::sh
npm run deploy
:::

Which deploys your published App to your remote Ubuntu server instance using `rsync` to only copy the incremental parts of the App that's changed (typically completing in <1s) and `ssh` to run a remote command to restart the `suprvisord` process, starting the .NET Core App with the latest deployed version.
