---
title: GitHub Action Templates for Faster CI Setup
slug: github-action-templates
---

If your project is on GitHub, GitHub Actions are a great built in way to have an automated Continuous Integration (CI) setup where the configuration is committed to the same repository where your project lives.

GitHub Actions are also very cost effective thanks to the generous free minutes allowance and additional **3000 /month** minutes with every paid team member. 

To make taking advantage of GitHub Actions with your ServiceStack applications, we've created multiple [mix](/mix-tool) templates to setup your CI process quickly. Most [Project Templates](/templates/) provide a build + test step on every commit as well as combinations of Docker image hosting and application deployments focusing on portability.

Since hosting architectures vary so much, these templates are designed to get you *started* with a simple setup where you can iterate quickly as you develop application. As hosting requirements change, the deployment GitHub Action workflow `yml` files can be customized to suit.

The simple build and test step is available using the [build](https://gist.github.com/gistlyn/856bd13c38ad388ef6d48d06c32ab395), mix template, whilst the [mix](/mix-tool) deployment templates uses the naming convention `release-{docker image repository}-{hosting configuration}`. 

For example, `release-ghr-vanilla` where **ghr** uses GitHub for the Docker Repository and `vanilla` for our minimalist deployment that uses SSH and **docker compose**.

## GitHub Action Templates

Templates currently available are:

| Name                    | Docker Repository                | Deployment and Hosting        | 
|-------------------------|----------------------------------|-------------------------------|
| **release-ghr-vanilla**	| GitHub Container Repository	     | SSH + docker compose          |
| **release-ecr-vanilla**	| AWS Elastic Container Repository | SSH + docker compose          | 
| **release-hub-vanilla**	| Docker Hub                       | SSH + docker compose          | 
| **release-ecr-aws**   	| AWS Elastic Container Repository | AWS ECS without Load Balancer | 

### release-ghr-vanilla
Using GitHub Container Repository (ghcr.io) and deploying to a Linux host with `docker compose` via SSH, this provides a GitHub centric option for prototyping your application. A [full tutorial using Digital Ocean as our Linux host provider is available](/do-github-action-mix-deployment) as well as an accompanying video.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="0PvzcnxlBvc" style="background-image: url('https://img.youtube.com/vi/0PvzcnxlBvc/maxresdefault.jpg')"></lite-youtube>

Also, a [shorter reference documentation](https://github.com/ServiceStack/mix/blob/master/actions/release-ghr-vanilla/.github/workflows/README.md) that comes with the template when using `mix` available that lists the setup as well as the required [GitHub Repository](https://github.com/ServiceStack/mix/blob/master/actions/release-ghr-vanilla/.github/workflows/README.md#github-repository-setup) Secrets for configuration.

### release-ecr-vanilla
Using AWS ECR (Elastic Container Repository) and deploying to a Linux host with `docker compose` via SSH, this provides a portable simple hosting with AWS ECR for those already in the AWS cloud provider environment.

Reference for this GitHub Action configuration is provided with the template itself, also [available here](https://github.com/ServiceStack/mix/blob/master/actions/release-ecr-vanilla/.github/workflows/README.md) along with the [required Repository Secrets](https://github.com/ServiceStack/mix/blob/master/actions/release-ecr-vanilla/.github/workflows/README.md#github-repository-setup).

### release-hub-vanilla
Using the original Docker Hub as a Docker image repository and deploying to a Linux host with `docker compose` via SSH, this might be more suited to those with existing use of Docker Hub or public application images.

Reference for this GitHub Action configuration is provided with the template itself, [also available on GitHub](https://github.com/ServiceStack/mix/blob/master/actions/release-hub-vanilla/.github/workflows/README.md) here along with the [required Repository Secrets](https://github.com/ServiceStack/mix/blob/master/actions/release-hub-vanilla/.github/workflows/README.md#github-repository-setup).

### release-ecr-aws
Using AWS ECR (Elastic Container Repository) and deploying via AWS ECS to a dedicated ECS cluster with a single EC2 instance, this template enables a gateway into using AWS ECS without the regular cost of an Application Load Balancer (ALB). Like the other templates, this uses NGINX proxy with Lets Encrypt companion in place of AWS specific managed services to do the same. This will give you a starting point for your prototype until you have the need for scalability and high availability for your application.

We have a full tutorial along with a video walk through available, showing from start to finish getting your ServiceStack application created and deploying via GitHub Actions and ECS. 

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Eh4tvLN8i8g" style="background-image: url('https://img.youtube.com/vi/Eh4tvLN8i8g/maxresdefault.jpg')"></lite-youtube>

Reference for this GitHub Action configuration is provided with the template itself, [also available on GitHub](https://github.com/ServiceStack/mix/blob/master/actions/release-ecr-aws/.github/workflows/README.md) here along with the [required Repository Secrets](https://github.com/ServiceStack/mix/blob/master/actions/release-ecr-aws/.github/workflows/README.md#github-repository-setup).

### Blazor Litestream

For a detailed overview for creating and setting up deployment for a new [Blazor Litestream App](/blazor-litestream) from scratch checkout:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="fY50dWszpw4" style="background-image: url('https://img.youtube.com/vi/fY50dWszpw4/maxresdefault.jpg')"></lite-youtube>

::: info
If you are using the template GitHub Actions and deploying to an Ubuntu 22.04 server, ensure you ssh key is generated using non RSA SHA1 algorithm.
Eg `ssh-keygen -t ecdsa` or swap out the use of `appleboy/scp-action@v0.1.3` for your own step using the latest version of the `scp` command line tool in your CI environment.
For a step by step and other options, see [this Ask Ubuntu Answer](https://askubuntu.com/a/1409528/366659)
:::