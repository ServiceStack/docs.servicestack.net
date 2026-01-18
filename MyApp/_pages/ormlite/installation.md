---
title: OrmLite Installation
---

OrmLite packages are available on NuGet and can be installed using your IDE or by adding a `PackageReference` in your `.csproj`

## PostgreSQL

Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.PostgreSQL" Version="10.*" />`
:::

## SQL Server

Uses **[Microsoft.Data.SqlClient](https://devblogs.microsoft.com/dotnet/introducing-the-new-microsoftdatasqlclient/)** ADO .NET provider. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (supports Apple Silicon/ARM)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.SqlServer.Data" Version="10.*" />`
:::

Uses **System.Data.SqlClient**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.SqlServer" Version="10.*" />`
:::

## MySql

Uses **Mysql.Data**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.MySql" Version="10.*" />`
:::

Uses [MySqlConnector](https://mysqlconnector.net). Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.MySqlConnector" Version="10.*" />`
:::

## SQLite

Uses **[Microsoft.Data.Sqlite](https://docs.microsoft.com/en-us/dotnet/standard/data/sqlite/)**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (supports Apple Silicon/ARM)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite.Data" Version="10.*" />`
:::

Uses **[System.Data.SQLite](https://system.data.sqlite.org)**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)


:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite" Version="10.*" />`
:::

## Community Providers

Unofficial providers contributed and supported by ServiceStack Community users:

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Oracle" Version="10.*" />`
:::

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Firebird" Version="10.*" />`
:::

Please raise support questions on [StackOverflow](https://stackoverflow.com/questions/ask?tags=servicestack,ormlite-servicestack) or [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions/categories/q-a) for best chance to reach community users.

## Quick install in ASP .NET Core with mix

The quickest way to install OrmLite in existing ASP .NET Core projects is to [mix in](/mix-tool) the desired RDBMS provider which both installs the required NuGet package and creates a [Modular Startup](/modular-startup) configuration all setup to read your App's configured RDBMS connection string for instant utility:

::: sh
npx add-in postgres
:::

::: sh
npx add-in sqlserver
:::

::: sh
npx add-in mysql
:::

::: sh
npx add-in sqlite
:::

::: sh
npx add-in oracle
:::

::: sh
npx add-in firebird
:::

If you don't have the dotnet `x` tool installed, it can be installed with: 

::: sh
dotnet tool install -g x
:::
