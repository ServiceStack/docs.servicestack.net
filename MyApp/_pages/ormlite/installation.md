---
title: OrmLite Installation
---

OrmLite packages are available on NuGet and can be installed using your IDE or by adding a `PackageReference` in your `.csproj`

## PostgreSQL

Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.PostgreSQL" Version="6.*" />`
:::

## SQL Server

Uses **[Microsoft.Data.SqlClient](https://devblogs.microsoft.com/dotnet/introducing-the-new-microsoftdatasqlclient/)** ADO .NET provider. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (supports Apple Silicon/ARM)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.SqlServer.Data" Version="6.*" />`
:::

Uses **System.Data.SqlClient**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.SqlServer" Version="6.*" />`
:::

## MySql

Uses **Mysql.Data**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.MySql" Version="6.*" />`
:::

Uses [MySqlConnector](https://mysqlconnector.net). Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.MySqlConnector" Version="6.*" />`
:::

## SQLite

Uses **[Microsoft.Data.Sqlite](https://docs.microsoft.com/en-us/dotnet/standard/data/sqlite/)**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (supports Apple Silicon/ARM)

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite.Data" Version="6.*" />`
:::

Uses **[System.Data.SQLite](https://system.data.sqlite.org)**. Supports **.NET 6+**, .NET Framework **v4.7.2+** and **.NET Standard 2.0** (.NET 5 and lower)


:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite" Version="6.*" />`
:::


 Uses [SQLitePCLRaw.bundle_cil](https://ericsink.com/entries/sqlite_llama_preview.html) for a managed implementation free of native binaries. **Still in Preview** but passes 100% test suite.

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite.Cil" Version="6.*" />`
:::


## .NET 6 & .NET Standard 2.0 only packages

The `.Core` packages contains only **.NET 6** and **.NET Standard 2.0** versions which can be used in [ASP.NET Core Apps on .NET Framework](/templates/corefx):

:::copy
`<PackageReference Include="ServiceStack.OrmLite.SqlServer.Core" Version="6.*" />`
:::

:::copy
`<PackageReference Include="ServiceStack.OrmLite.PostgreSQL.Core" Version="6.*" />`
:::

:::copy
`<PackageReference Include="ServiceStack.OrmLite.MySql.Core" Version="6.*" />`
:::

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Sqlite.Core" Version="6.*" />`
:::

## Community Providers

Unofficial providers contributed and supported by ServiceStack Community users:

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Oracle" Version="6.*" />`
:::

:::copy
`<PackageReference Include="ServiceStack.OrmLite.Firebird" Version="6.*" />`
:::

Please raise support questions on [StackOverflow](https://stackoverflow.com/questions/ask?tags=servicestack,ormlite-servicestack) or [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions/categories/q-a) for best chance to reach community users.

## Quick install in ASP .NET Core with mix

The quickest way to install OrmLite in existing ASP .NET Core projects is to [mix in](/mix-tool) the desired RDBMS provider which both installs the required NuGet package and creates a [Modular Startup](/modular-startup) configuration all setup to read your App's configured RDBMS connection string for instant utility:

::: sh
x mix postgres
:::

::: sh
x mix sqlserver
:::

::: sh
x mix mysql
:::

::: sh
x mix sqlite
:::

::: sh
x mix oracle
:::

::: sh
x mix firebird
:::

If you don't have the dotnet `x` tool installed, it can be installed with: 

::: sh
dotnet tool install -g x
:::
