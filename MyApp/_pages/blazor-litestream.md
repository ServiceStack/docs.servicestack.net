---
title: Blazor Litestream
---

<div class="not-prose my-8 ml-20 flex flex-col items-center">
    <div class="flex">
        <svg class="w-40 h-40 text-purple-600 mr-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
        <svg class="w-44 h-44" xmlns="http://www.w3.org/2000/svg" width="256" height="154" viewBox="0 0 256 154"><defs><linearGradient id="logosTailwindcssIcon0" x1="-2.778%" x2="100%" y1="32%" y2="67.556%"><stop offset="0%" stop-color="#2298BD"/><stop offset="100%" stop-color="#0ED7B5"/></linearGradient></defs><path fill="url(#logosTailwindcssIcon0)" d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2c9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8Z"/></svg>
    </div>
    <h2 class="border-none text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold">
        <span class="text-purple-600 mr-6">Blazor</span>
        <span style="color:#44A8B3">Tailwind</span>
    </h2>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-2xl md:max-w-3xl">                              
        Combined with
    </p>
    <p id="litestream" class="mx-auto max-w-screen-md pr-4 text-center border-none">
        <a href="https://litestream.io">
            <img class="h-32" src="/img/pages/litestream/logo.svg">
        </a>
    </p>
</div>

As a way to provide a reliable and cost-effective option for building, deploying and hosting Blazor WASM applications with a backing API, we created the mix templates for our Blazor templates to be able to quickly take advantage of Litestream.io.

This can be used directly below to create a new Blazor Tailwind project directly with your Litestream replication target of your choice.

<section class="not-prose my-20 text-center">
    <div class="flex">
        <div class="flex flex-1 flex-col items-center">
            <a href="https://account.servicestack.net/archive/NetCoreTemplates/blazor-tailwind?Name=MyApp&Mix=blazor-litestream-aws">
                <img src="/img/pages/litestream/aws_square.svg" alt="AWS S3" class="w-44">
            </a>
            <span class="block text-xl font-medium text-gray-900">
                S3 Simple Storage Service
            </span>
        </div>
        <div class="flex flex-1 flex-col items-center">
            <a href="https://account.servicestack.net/archive/NetCoreTemplates/blazor-tailwind?Name=MyApp&Mix=blazor-litestream-azure">
                <img src="/img/pages/litestream/azure_square.svg" alt="Azure Blob Storage" class="w-44">
            </a>
            <span class="block text-xl font-medium text-gray-900">
                Azure Blob Storage
            </span>
        </div>
        <div class="flex flex-1 flex-col items-center">
            <a href="https://account.servicestack.net/archive/NetCoreTemplates/blazor-tailwind?Name=MyApp&Mix=blazor-litestream-sftp">
                <img src="/img/pages/litestream/sftp.png" alt="SFTP" class="w-44">
            </a>
            <span class="block text-xl font-medium text-gray-900">
                sFTP
            </span>
        </div>
    </div>
</section>

Alternatively as the [Docker compose](/github-action-templates) configurations are delivered as [mix](/mix-tool) configurations, they can also be applied to existing projects, e.g:

::: sh
x mix blazor-litestream-aws
:::

Since Litestream is tied to deployment, hosting environment & preferred configured storage, we've created a matrix of configurations to cover each of the supported templates and storage preferences.

| Project Template     | AWS S3                  | Azure Blob Storage        | SFTP (generic)           | 
|----------------------|-------------------------|---------------------------|--------------------------|
| **web**              | litestream-aws          | litestream-azure          | litestream-sftp          | 
| **blazor-server**    | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **blazor-tailwind**  | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **blazor-wasm**      | blazor-litestream-aws   | blazor-litestream-azure   | blazor-litestream-sftp   |
| **vue-ssg**          | jamstack-litestream-aws | jamstack-litestream-azure | jamstack-litestream-sftp |
| **vue-vite**         | jamstack-litestream-aws | jamstack-litestream-azure | jamstack-litestream-sftp |
| **nextjs**           | jamstack-litestream-aws | jamstack-litestream-azure | jamstack-litestream-sftp |

### GitHub Action Workflow

These GitHub Action configurations are a quicker way to create and deploy new Applications, which only need to be filled in with your environment's access credentials configured in your [projects GitHub Action Secrets](/litestream-templates.html#github-action-workflow).

For a detailed overview for creating and setting up deployment for a new App from scratch checkout:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="fY50dWszpw4" style="background-image: url('https://img.youtube.com/vi/fY50dWszpw4/maxresdefault.jpg')"></lite-youtube>

## Setting up your Linux host

This project template is set up to deploy to any Linux with SSH access, and Docker with Docker Compose installed. This means you can choose any hosting provider or own server to make your application extremely portable.

For example, we can use DigitalOcean droplets at $48 USD per month to host our application with good performance, especially for heavy read scenarios.

Using the DigitalOcean console, we can select `Create` droplet at the top and select the following options.

- Ubuntu 20.04 LTS x64 image
- Basic Plan type
- CPU options of Regular with SSD
- $48 per month droplet
- Your preferred region
- SSH keys for Authentication

![](/img/pages/blazor/digital-ocean-settings-blazor-litestream.png)

Once our droplet is started, we will want to use a Reserved IP address and copy the value. This IP should be used with your DNS configuration for your domain as an A record. How this is done will depend on what service you use to manage your domains, eg AWS Route53, GoDaddy etc.

## Docker and Docker Compose Installation

Below are two guides for installing Docker and Docker Compose for Ubuntu 20.04 LTS.

- [Docker Installation Guide](https://docs.docker.com/engine/install/ubuntu)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/linux/#install-using-the-repository)

::: info
Ensure you have v2+ of Docker Compose
A compatibility script can be used for `docker-compose` via the following script.
`echo 'docker compose --compatibility "$@"' > /usr/local/bin/docker-compose`
`sudo chmod +x /bin/docker-compose`
:::

## nginx reverse proxy

Now that we have our host created with Docker and Docker Compose installed, we need to do some one-off configuration to make it easy to host and deploy our application to it using GitHub Actions and docker-compose.

As a part of the `blazor-tailwind` project template, you will have a file called `nginx-proxy-compose.yml` in the `.deploy` directory. This contains a docker compose configuration to run an NGINX reverse proxy and a companion container to automatically manage TLS certificates via LetsEncrypt.

```yaml
version: '2'

services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    container_name: nginx-proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - dhparam:/etc/nginx/dhparam
      - certs:/etc/nginx/certs:ro
      - /var/run/docker.sock:/tmp/docker.sock:ro
    network_mode: bridge

  letsencrypt:
    image: jrcs/letsencrypt-nginx-proxy-companion:2.0
    container_name: nginx-proxy-le
    restart: always
    environment:
      - DEFAULT_EMAIL=you@example.com
    volumes_from:
      - nginx-proxy
    volumes:
      - certs:/etc/nginx/certs:rw
      - acme:/etc/acme.sh
      - /var/run/docker.sock:/var/run/docker.sock:ro
    network_mode: bridge

volumes:
  conf:
  vhost:
  html:
  dhparam:
  certs:
  acme:

```

Copy the file to your Linux host using `scp` or pasting in the above into a `vi` editor and save so we can update the file and run it remotely.

Update the `DEFAULT_EMAIL` environment variable to make sure you will get notified about problems with your TLS certificates and use the following command on your Linux host to run these containers.

::: sh
docker compose -f nginx-proxy-compose.yml up -d
:::

Once running, you should see a message similar to the following.

```shell
Creating nginx-proxy ... done
Creating nginx-proxy-le ... done
```

Your Linux host is now ready to deploy to using GitHub Actions.

## GitHub Actions

The Blazor-Tailwind project templates and Litestream mix templates have a `release.yml` GitHub Action workflow to deploying your application to a Linux host like the one we just set up.
This workflow uses SSH access to remotely copy files and execute `docker compose` commands on the remote host.

Docker images are stored on GitHub Container Repository packages, and pulled down on the remote host during deployment.

![](/img/pages/blazor/blazor-litestream-deployment-process.png)

To get this working, repository secrets in your GitHub repository need to be populated

| Secret                | Description                                                                                      | Example            |
|-----------------------|--------------------------------------------------------------------------------------------------|--------------------|
| DEPLOY_API            | Resolvable DNS address to your Linux host                                                        | my-app.example.com |
| DEPLOY_USERNAME       | The SSH login username                                                                           | ubuntu             |
| DEPLOY_KEY            | The SSH *private* key associated with the SSH login                                              |                    |
| LETSENCRYPT_EMAIL     | Email address where you want notifications to go specifically related to this application domain | me@email.com       |
| AWS_S3_BUCKET         | An S3 bucket name where Litestream will be replicating data                                      | my-s3-bucket-name  |
| AWS_ACCESS_KEY_ID     | The key ID for programmatic access to AWS with read/write access to the S3 bucket                |                    |
 | AWS_SECRET_ACCESS_KEY | The access key for programmatic access to AWS with read/write access to the S3 bucket            |

These repository secrets can be added by using the GitHub repository under `Settings`, `Secrets`, `Actions`.

Once values are assigned, you can use the `Actions` tab on your repository to create a new `Release` workflow using the `Run workflow` dropdown.

![](/img/pages/blazor/blazor-litestream-run-workflow.png)

Once deployed, the Litestream docker sidecar container will monitor changes to your `app.db` SQLite database and back them up to your configured AWS S3 bucket.

## Litestream automation

The `docker-compose-template.yml` file in the template is used to create the final running docker-compose configuration of your application and related Litestream sidecar.
The Litestream sidecar runs as a separate container with access to the same docker volume as your application to replicate data from your SQLite database file.

This monitoring starts before your application docker container runs so that data isn't missed. This is achieved using the docker compose functionality of `depends_on` and `test`, where your Blazor WASM application container will wait for the successful startup of the Litestream container before running.

```yaml
my-app:
    image: ghcr.io/${IMAGE_REPO}:${RELEASE_VERSION}
    depends_on:
      my-app-litestream:
        condition: service_healthy
```

The `healthcheck` for your Blazor WASM container is that a Litestream `restore` process runs successfully on deployment. This is the functionality that provides automated disaster recovery if your SQLite database file is lost for whatever reason.

```yaml
my-app-litestream:
    image: litestream/litestream
    entrypoint: ["/bin/sh", "-c"]
    # Timeout of health check will need to depend on size of db, and speed of network to host.
    healthcheck:
      test: /usr/local/bin/litestream restore -if-db-not-exists -if-replica-exists -o /data/app.db s3://${AWS_S3_BUCKET}/BlazorLitestream.sqlite
      timeout: 10m
      retries: 1
```

::: info
Timeout of health check will need to depend on size of db, and speed of network to host.
:::

This restore will be skipped if either the database file already exists on the server or doesn't yet exist in AWS S3.

## Testing restores

It is always a good idea to test your disaster recovery process, and the easiest way to test it with this Litestream setup is by doing the following steps.

- Take down your application using `docker compose down` command pointing to the file on your remote server in the `.deploy` direct of your deploy user.
- Removing the docker volume using `docker volume rm <volume_name>`. You can find the volume name using `docker volume ls`, it will start with `deploy_` and contain your app name.
- Verifying your SQLite database file no longer exists by checking `/var/lib/docker/volumes` for the existence of your shared volume files.

Once confirmed the files are removed, you can then redeploy your application. This process will take longer than a normal deployment since Litestream will be combining the last snapshot with the WAL journal files.

Once completed, your application should be running with all the previous data it had before being taken down.