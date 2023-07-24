---
title: Install PostgreSQL, MySql and SQL Server with Docker
---

Installing developer tools has become frictionless in today's world of ubiquitous Docker adoption. First thing you'll 
need to install is [Docker Desktop](https://www.docker.com/products/docker-desktop/) which will let you run each RDBMS 
in a containerized Docker App.

After Docker is running, installing and running PostgreSQL and MySql can be done with a single command:

## Install and run PostgreSQL

:::copy
docker run --name postgres -e POSTGRES_PASSWORD=p@55wOrd -p 127.0.0.1:5432:5432 -d postgres
:::

## Install and run MySql

:::copy
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=p@55wOrd -d mysql:latest
:::

> Feel free to update commands to use your preferred strong password instead

## Install and run SQL Server

SQL Server requires more resources than the popular RDBMS's and as it doesn't have a native ARM Docker Image requires
a bit more configuration.

First you'll want to ensure you have at least **4GB RAM** available to containers from
the **Resources** Tab in Docker Settings you can open with `⌘,`

![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/docker-resources.png)

## Apple Silicon

Our MacBook Air's **24GB RAM** configuration defaulted to **7.9 GB**, but if you have a lower configuration you'll want 
to ensure **4GB** is available to SQL Server.

If you're running on Apple Silicon you'll want to ensure **Use Virtualization Framework** and **VirtioFS** is checked
in the **General** tab which will allow SQL Server **AMD64** Image will run on Apple's new
[Virtualization framework](https://developer.apple.com/documentation/virtualization):

![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/docker-general.png)

After which you'll be able to install and run SQL Server with:

:::copy
docker run --platform=linux/amd64 --name mssql -e ACCEPT_EULA=1 -e MSSQL_SA_PASSWORD=p@55wOrd -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
:::

You'll be able to check if all Docker containers are now running by clicking on the **Containers** tab in Docker Desktop:

![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/docker-containers.png)

## lazydocker

Another great alternative to Docker Desktop for managing Docker Containers is [lazydocker](https://github.com/jesseduffield/lazydocker) 
which can be installed with:

### macOS

:::sh
brew install lazydocker
:::

### Chocolatey (Windows)

Using [Chocolatey](https://chocolatey.org) is an easy way to install on Windows: 

:::sh
choco install lazydocker
:::

As lazydocker a Terminal UI it can be run everywhere where there's a Terminal, in local and remote terminals as well as
Rider and VS Code's built-in Terminal UIs where you can quickly perform Docker tasks without breaking your development
workflow:

[![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/lazydocker.png)](https://github.com/jesseduffield/lazydocker)

## DataGrip

Now we can see they're all running, lets connect to them. You could use the command line tools specific to each database
but my preference is to use [JetBrains DataGrip](https://www.jetbrains.com/datagrip/) which lets you connect and manage
any RDBMS from a single Desktop App, including many of the most popular NoSQL data stores.

## Connect to all Database connections

In **Database Explorer**, click on the `+` New Icon to add a new Data Source to **Microsoft SQL Server**, **MySql**
and **PostgreSQL** using the passwords used to run the Docker commands (e.g.`p@55wOrd`) and the default user names
for each RDBMS:

- SQL Server: `sa`
- MySQL: `root`
- PostgreSQL: `postgres`

After connecting to all databases you should end up with active connections to all empty databases:

[![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/datagrip-databases.png)](https://www.jetbrains.com/datagrip/)

Which you can open a **New > Query Console** or `⇧⌘L` to start executing generic queries against like `SELECT @@VERSION`
in SQL Server to display the version of SQL Server that's running:

[![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/datagrip-mssql-version.png)](https://www.jetbrains.com/datagrip/)

## Creating new Databases with DataGrip

To do anything interesting you'll need databases, which you can create with `New > Database` for SQL Server and
PostgreSQL or `New > Schema` in MySQL:

[![](https://servicestack.net/img/posts/postgres-mysql-sqlserver-on-apple-silicon/datagrip-test.png)](https://www.jetbrains.com/datagrip/)
