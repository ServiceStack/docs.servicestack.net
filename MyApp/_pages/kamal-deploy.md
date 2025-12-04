---
title: Deploying with Kamal
---

All project templates includes the necessary GitHub Actions for CI/CD with automatic Docker image builds and
production deployment with Kamal to any Linux server with SSH. Kamal is a CLI tool from the BaseCamp team that simplifies containerized application deployments, wrapping SSH and Docker to streamline self-hosting while maintaining GitHub Actions as the CI runner.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="-mDJfRG8mLQ" style="background-image: url('https://img.youtube.com/vi/-mDJfRG8mLQ/maxresdefault.jpg')"></lite-youtube>

## Overview

Kamal enables simple commands to deploy containerized applications to Linux hosts, handling:
- **Docker containerization** with optimized .NET images
- **Bootstrap configuration**
- **Reverse proxy setup**
- **SSL auto-certification** via Let's Encrypt
- **Zero-downtime deployments**
- **Health checks on deploy**
- **Rolling back changes**
- **Volume persistence** for App_Data including any SQLite database
- **GitHub Container Registry** integration

::: info
Kamal is built by the BaseCamp team, developers of Hey.com and BaseCamp.com. For comprehensive documentation on all Kamal features, visit [https://kamal-deploy.org](https://kamal-deploy.org)
:::

### Hosting Recommendation

If you don't have a Linux Server, we recommend Hetzner
[who we've found](https://docs.servicestack.net/ormlite/litestream#savings-at-scale)
offers the best value [US Cloud VMs](https://cloud.hetzner.com) offering **$15/mo** for a dedicated VM with
**2vCPU / 8GB** RAM which is being used to host **30 Docker Apps**, including all project template live demos -
using the GitHub Actions included in each template.

## Getting Started

### Prerequisites
- A domain name
- A Linux host (e.g., VPS from providers like Hetzner)
- GitHub account for CI/CD

### Initial Setup

1. Create a new ServiceStack application:
:::sh
npx create-net blazor-vue MyApp
:::

2. Create the SSH Private and Public Keys:
:::sh
ssh-keygen -t ed25519 -C "deploy@myapp" -f ./deploy-key
:::

3. Copy Public Key to deployment server to enable SSH access:
:::sh
cat ~/deploy-key.pub | ssh <user>@<your-ip> "cat >> ~/.ssh/authorized_keys"
:::

4. Configure GitHub Secrets for Kamal to access your deployment server:

- SSH private key to access the server: ssh-rsa ...
:::sh
gh secret set SSH_PRIVATE_KEY < ~/deploy-key
:::

- IP address of the server to deploy to: 100.100.100.100
:::sh
gh secret set KAMAL_DEPLOY_IP [your.ip]
:::

- Email for Let's Encrypt SSL certificate: me@example.org
:::sh
gh secret set LETSENCRYPT_EMAIL [your@email]
:::

These Required variables can be globally configured in your GitHub Organization or User secrets which will
enable deploying all your Repositories to the same server.

Optionally configure any other global secrets to be shared by all Apps here:

:::sh
gh secret set SERVICESTACK_LICENSE [license-key]
:::

5. Configure GitHub Secrets for your App

The only secret that needs to be configured per App is:

Hostname used for SSL certificate and Kamal proxy: www.example.org

:::sh
gh secret set KAMAL_DEPLOY_HOST [www.example.org]
:::

You could register any App-specific secrets here, although our preference is instead of polluting each
GitHub Repository with multiple App-specific GitHub Action Secrets, you can save all your secrets in a single
`APPSETTINGS_PATCH` GitHub Action Secret to patch `appsettings.json` with environment-specific configuration
using [JSON Patch](https://jsonpatch.com). E.g:

JSON Patch to apply to appsettings.json:
:::sh
gh secret set APPSETTINGS_PATCH [json-patch]
:::

JSON Patch example:

```json
[
    {
        "op":"replace",
        "path":"/ConnectionStrings/DefaultConnection",
        "value":"Server=service-postgres;Port=5432;User Id=dbuser;Password=dbpass;Database=dbname"
    },
    { "op":"add", "path":"/SmtpConfig", "value":{
        "UserName": "SmptUser",
        "Password": "SmptPass",
        "Host": "email-smtp.us-east-1.amazonaws.com",
        "Port": 587,
        "From": "noreply@example.org",
        "FromName": "MyApp",
        "Bcc": "copy@example.org"
      }
    },
    { "op":"add", "path":"/Admins", "value": ["admin1@email.com","admin2@email.com"] },
    { "op":"add", "path":"/CorsFeature/allowOriginWhitelist/-", "value":"https://example.org" }
]
```

### Inferred Variables

These variables are inferred from the GitHub Action context and don't need to be configured.

| Variable | Source | Description |
|----------|--------|-------------|
| `GITHUB_REPOSITORY` | `${{github.repository}}`  | `acme/example.org` - used for service name and image |
| `KAMAL_REGISTRY_USERNAME` | `${{github.actor}}` | GitHub username for container registry |
| `KAMAL_REGISTRY_PASSWORD` | `${{secrets.GITHUB_TOKEN}}` | GitHub token for container registry auth |

### GitHub Actions

The template includes a GitHub Actions workflow that is broken up into 3 steps that trigger on push to the `main` branch, and then on successful build and test, it will deploy the application to your server.

### Structure

The deployment scripts are embedded in the templates [/.github/workflows](https://github.com/NetCoreTemplates/blazor-vue/tree/main/.github/workflows):

```files
/.github/workflows
  build.yml
  build-container.yml
  release.yml
/.kamal
  /hooks
  secrets
/config
  deploy.yml
```

Which is triggered after a commit to main:

- **build.yml** - Builds and tests the application, triggered on push to main
- **build-container.yml** - Builds a Docker image from the application and pushes it to GitHub Container Registry
- **release.yml** - Runs any pending DB Migrations, if successful Deploys the Docker image to server

Your App's Kamal deployment is configured in [config/deploy.yml](https://github.com/NetCoreTemplates/blazor-vue/blob/main/config/deploy.yml) with additional Kamal hooks and configuration in 
[.kamal](https://github.com/NetCoreTemplates/blazor-vue/tree/main/.kamal), see 
[Kamal documentation](https://kamal-deploy.org/docs/configuration/) for more information.

### Configuration

The [/config/deploy.yml](https://github.com/NetCoreTemplates/next-static/blob/main/config/deploy.yml) configuration
is designed to be reusable across projects as it dynamically derives service names, image paths, and volume mounts
from environment variables, so you only need to configure your server's IP and hostname using GitHub Action secrets.

Once you make these changes, commit and push to your repository to trigger the GitHub Actions workflow.

Kamal will deploy the required services including Docker and Kamal Proxy if your server doesn't already have them installed.

:::info
When using ASP.NET Core applications with Kamal-Proxy, ensure your application is running with the environment variable `ASPNETCORE_FORWARDEDHEADERS_ENABLED` set to `true`.
The template has this by default, but if you are getting errors with 302 redirects, ensure this is set.
:::

The authentication between GitHub Container Registry (ghcr.io) and your server is handled by the GitHub Actions workflow, the `deploy.yml` and [Kamal Secrets](https://kamal-deploy.org/docs/configuration/environment-variables/#secrets).

### Using Kamal Locally

To also be able to use kamal locally to inspect logs or deploy from your own server you can add the GitHub Action
Secrets into a local `.env` file, e.g:

```bash
# Required for Kamal deploy.yml template processing

GITHUB_REPOSITORY=acme/example.org

# Server deployment details
KAMAL_DEPLOY_IP=100.100.100.100
KAMAL_DEPLOY_HOST=example.org

# Container registry credentials (for ghcr.io)
KAMAL_REGISTRY_USERNAME=my-user
GITHUB_TOKEN=ghp_xxx

# Login to GitHub Container Registry
#echo $KAMAL_REGISTRY_PASSWORD | docker login ghcr.io -u my-user --password-stdin
```

You can then load the environment variables into your shell with:

:::sh
source ./load-env.sh
:::


Which will allow you to use kamal locally to access your deployment server, e.g:

:::sh
kamal app logs -f
:::

:::info
You can still use the Kamal CLI locally, but if you want to directly push deployments with `kamal deploy`, you will need to locally populate `KAMAL_REGISTRY_USER` and `KAMAL_REGISTRY_PASSWORD` with your GitHub username and a GitHub Personal Access Token with `read:packages` scope.
:::

### Hard code App specific variables

Alternatively if you don't want to maintain a `.env` with GitHub Action Secrets you can hard-code all
App-specific variables in your `deploy.yml` file so it doesn't need to perform any template processing
for its Environment Variable substitutions.

## Common Kamal Commands

Kamal provides several useful commands for managing your deployment:

- View deployment details
:::sh
kamal details
:::

- Check application logs
:::sh
kamal app logs -f
:::

- Deploy new version
:::sh
kamal deploy
:::

- Restart application
:::sh
kamal app boot
:::

:::info
Kamal commands are context-aware and will use the configuration from your current application directory. This makes managing multiple applications across different servers a lot easier as more applications are added.
:::

## Additional Containers

Kamal supports extensive configuration options including "accessories" for additional features like databases, caches, and more. See the [Kamal documentation](https://kamal-deploy.org/docs/configuration/accessories/) for more information.

## Troubleshooting

### Initial deployment fails

If you are having issues with the initial deployment, an earlier bootstrap of the server via GitHub Actions may have failed.
Delete the `.<app-name>` file in your deployment user's home directory and re-run the GitHub Actions workflow to re-bootstrap the server.

### Missing the service label

If you are getting:

    Image ghcr.io/netcoreapps/northwindauto:latest is missing the 'service' label

Ensure your AppHost **csproj** has `ContainerLabel` with the value matching the `service` in your `deploy.yml`.