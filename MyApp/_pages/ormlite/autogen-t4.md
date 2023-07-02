---
title: AutoGen & T4 Templates
---

## AutoQuery AutoGen

The recommended way to auto generate Tables and APIs for your existing RDBMS tables is to use [AutoQuery AutoGen](/autoquery/autogen) whose declarative nature allows us to easily generate AutoQuery & Crud Services using just declarative DTOs.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NaJ7TW-Q_pU" style="background-image: url('https://img.youtube.com/vi/NaJ7TW-Q_pU/maxresdefault.jpg')"></lite-youtube>

## T4 Templates

[OrmLite's T4 Template](https://github.com/ServiceStack/ServiceStack.OrmLite/tree/master/src/T4) are useful in database-first development or when wanting to use OrmLite with an existing RDBMS by automatically generating POCO's and strong-typed wrappers for executing stored procedures.

::: nuget
`<PackageReference Include="ServiceStack.OrmLite.T4" Version="6.*" />`
:::
