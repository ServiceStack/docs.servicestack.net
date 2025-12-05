---
title: App Tasks
---

App Tasks let you run one-off tasks with the full context of your App but without the overhead of maintaining a separate **.exe** with duplicated App configuration.
With App Tasks you can run your ASP .NET Core App, run the specified Tasks then exit before launching its HTTP Server.

### Example

The `AppTasks` static class can be used to register user-defined tasks, e.g:

```csharp
var runner = new TaskRunner(app.Services);
AppTasks.Register("task1", args => runner.Task1(args));
AppTasks.Register("task2", args => runner.Task2(args));
AppTasks.Run();

app.Run();
```

Which can then be run from the command-line with:

:::sh
dotnet run --AppTasks=task1:arg1,arg2;task2:arg1,arg2
:::

Which will run the tasks in the specified order, before immediately exiting. If any of the tasks fail the command will return the 1-based index of the task that failed, otherwise it will return a **0** success result.

## DB Migration App Task

For a more complete example we'll look at how [code-first DB Migrations](/ormlite/db-migrations) uses App Tasks to run DB Migrations from the command-line.

### Running migrations from command-line

To be able to run from migrations from the command line, DB Migrations needs access to your App's DB configuration. The best way to do this is to run your App normally then access the configured `IDbConnectionFactory` from the IOC, perform the migrations then exit with either a success or failure error code.

To do this we've added support for **AppTasks** which let you define tasks in your App that you can run from the command-line. This will let you perform migrations in a separate stage to check migrations were successful before running your App.

### Configuring existing Projects

You can add DB Migration support to existing projects by applying the [migrations](https://gist.github.com/gistlyn/50df00df4b3b9faa94a73d32ab4b2484) gist to your project with:

:::sh
npx add-in migrations
:::

This will register the Migration **AppTasks** with your App via a [Modular Startup](/modular-startup) configuration:

```csharp
public class ConfigureDbMigrations : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit:appHost => {
            var migrator = new Migrator(appHost.Resolve<IDbConnectionFactory>(), typeof(Migration1000).Assembly);
            AppTasks.Register("migrate", _ => migrator.Run());
            AppTasks.Register("migrate.revert", args => migrator.Revert(args[0]));
            AppTasks.Run();
        });
}
```

Here we can see we need to configure our `Migrator` with the `IDbConnectionFactory` we want to run against and the assemblies where all our Migration classes are maintained. It also registers an AppTasks to **migrate** our App by comparing the **Migration** table with the Migrations in the specified Assembly to workout which Migrations are left to run (in order) and the **revert** AppTask to do the opposite and revert to the specified migration.

This will now let us run your app in **"Task Mode"** where it will execute the specified task before promptly exiting with a **0** success exit code if successful or the index of the task that failed, e.g. **1** if the first Task failed. 

### dotnet Migration Tasks

We can then execute our App Task by running our App with the `AppTasks` command-line argument of the Task we want to run, so we can run all pending migrations with:

:::sh
dotnet run --AppTasks=migrate
:::

The format to revert a migration is:

```bash
$ dotnet run --AppTasks=migrate.revert:<name>
```

Where **name** is either the class name of the Migration you want to revert to (inclusive) or you can use **last** to revert the last migration:

:::sh
dotnet run --AppTasks=migrate.revert:last
:::

or **all** to revert all migrations:

:::sh
dotnet run --AppTasks=migrate.revert:all
:::

### npm Migration Scripts

To make this easier to remember and use, these tasks are also added as npm scripts:

```json
{
  "scripts": {
    "migrate": "dotnet run --AppTasks=migrate",
    "revert:last": "dotnet run --AppTasks=migrate.revert:last",
    "revert:all": "dotnet run --AppTasks=migrate.revert:all",
    "rerun:last": "npm run revert:last && npm run migrate"
  }
}
```

Which can be run with:

```bash
$ npm run migrate
$ npm run revert:last
$ npm run revert:all
$ npm run rerun:last
```

Which Rider provides a nice UX for running directly from the IDE where it will print all executed SQL output in a dedicated Console:

![](/img/pages/ormlite/migration-scripts.png)

### ASP .NET Core Projects

General (i.e. non-ServiceStack) ASP.NET Core Apps can instead configure AppTasks before `app.Run()` in their **Program.cs**:

```csharp
var migrator = new Migrator(app.Services.Resolve<IDbConnectionFactory>(), typeof(Migrations.Migration1000).Assembly);
AppTasks.Register("migrate", _ => migrator.Run());
AppTasks.Register("migrate.revert", args => migrator.Revert(args[0]));
AppTasks.Run();

app.Run();
```
