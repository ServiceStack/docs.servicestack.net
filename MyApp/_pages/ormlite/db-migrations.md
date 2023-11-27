---
title: Code-First DB Migrations
---

OrmLite DB Migrations advances OrmLite's light-weight code-first development approach with a simple [change based migration](https://www.prisma.io/dataguide/types/relational/what-are-database-migrations#change-based-migrations) solution that facilitates the code-first development workflow of OrmLite.

<div class="my-8 flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NIVFqute7JQ" style="background-image: url('https://img.youtube.com/vi/NIVFqute7JQ/maxresdefault.jpg')"></lite-youtube>
</div>

## Introduction

In contrast to [state-based migration](https://www.prisma.io/dataguide/types/relational/what-are-database-migrations#state-based-migrations) solutions which relies on tooling to generate state changes from a snapshot of a DB at a point-in-time with schema changes made out-of-band, OrmLite's DB migrations are instead designed to capture and execute the schema changes developers want to make, so when the Migrations are checked-in with the feature that needs them, the same exact changes are run by CI integration servers and other developers syncing their code-base with the new feature.

Instead of relying on generation by an opaque tool, this code-first approach treats DB Migrations like any other maintainable & logically structured code written by developers where it maintains a connected audit history in source control together with the feature that needs the schema changes.

## Getting Started

We'll start by looking at the minimum amount of code required for a Migration:

```csharp
class Migration1000 : MigrationBase
{
    public override void Up() {}
}
```

Which doesn't do anything but shows that the migration class name should adopt a numerical naming convention given class names are what determines the order in which migrations run. It also shows that a compensatory `Down()` implementation isn't required if you intend to adopt a **"Roll-Forward"** approach where any issues are resolved in subsequent migrations instead of reverting to a previous state so existing migrations can be refactored and re-run.

### Class names used to determine order of Migrations

We've decided upon using class names for determining the order migrations are run as it's important for their sequence to be clearly visible and easily navigable, a trait made possible with files being listed in alphabetical order making it easy to determine the order migrations were run and what the name of the next migration should be, it also gains assistance by the compiler in enforcing duplicates are not possible and source control ensures conflicting migration files are identified before they're checked in and run by CI.

## Basic Example

The `[Description]` or `[Notes]` attributes can instead be used to provide human-friendly descriptions of each migration where they'll be included in logs and included in the `Migration` table that's used to capture the execution of each migration.

With the basics covered lets look at using DB Migrations to create our first table:

```csharp
[Description("Create initial database tables")]
class Migration1000 : MigrationBase
{
    class MyTable
    {
        [AutoIncrement]
        public int Id { get; set; }
        public string Name { get; set; }
        public double ToDelete { get; set; }
    }

    public override void Up() => Db.CreateTable<MyTable>();
    public override void Down() => Db.DropTable<MyTable>();
}
```

First thing to notice is that the migrations do not reference our App's Data Models because migrations only contains the initial state and the deltas performed in each Migration, the result of which should match our App's Data Models which represent the current Data Models for the latest DB Schema.

::: tip
Initially these will match so you can just copy over all your Data Models as inner classes for your App's **1st Migration**
:::

## Declarative Code-First Migrations

To improve the typical development workflow your implementations can take advantage of declarative migration support which allows you to copy over new properties in your Data Models you want to **Add**, **Remove** or **Rename** as an alternative for writing procedural statements to perform the same changes with the [Modify Schema APIs](/ormlite/apis/schema.html#modify-custom-schema).

We'll use this feature in our 2nd migration for its Data Model changes where we want to:
 
 - **Add** a new `Code` VARCHAR column with **Index**
 - **Rename** the existing `Name` column to `FullName`
 - **Delete** the existing `ToDelete` column

For these common use-cases we can use `Migrate<Table>` to apply schema changes from a declarative class definition or use `Revert<Table>` to revert them, e.g:

```csharp
[Description("Update MyTable")]
class Migration1001 : MigrationBase
{    
    class MyTable
    {        
        [Index] //[AddColumn] (Optional default)
        public string Code { get; set; } //new field

        [RenameColumn("Name")]
        public string? FullName { get; set; }

        [RemoveColumn]
        public double ToDelete { get; set; }
    }
    
    public override void Up() => Db.Migrate<MyTable>();
    public override void Down() => Db.Revert<MyTable>();
}
```

In addition to being more productive and readable, it also benefits from being able to infer both schema migration and revert changes from the same declarative definition which is an alternative to using the [Modify Schema APIs](/ormlite/apis/schema.html#modify-custom-schema) to perform the same operations:

```csharp
[Description("Update MyTable")]
class Migration1001 : MigrationBase
{    
    class MyTable
    {        
        [Index]
        public string Code { get; set; }
        public double ToDelete { get; set; }
    }
    
    public override void Up()
    {
        Db.AddColumn<MyTable>(x => x.Code);
        Db.RenameColumn<MyTable>("Name", "FullName");
        Db.DropColumn<MyTable>("ToDelete");
    }

    public override void Down()
    {
        Db.DropColumn<MyTable>(x => x.Code);
        Db.RenameColumn<MyTable>("FullName", "Name");
        Db.AddColumn<MyTable>(x => x.ToDelete);
    }
}
```

Or for a more dynamic and Type-free approach it can also be rewritten as:

```csharp
[Description("Update MyTable")]
class Migration1001 : MigrationBase
{    
    public override void Up()
    {
        Db.AddColumn(table:"MyTable", new FieldDefinition { 
            Name = "Code", 
            FieldType = typeof(string), 
            IsIndexed = true 
        });
        Db.RenameColumn(table:"MyTable", oldColumn:"Name", newColumn:"FullName");
        Db.DropColumn(table:"MyTable", column:"ToDelete");
    }

    public override void Down()
    {
        Db.DropColumn(table:"MyTable", column:"Code");
        Db.RenameColumn(table:"MyTable", oldColumn:"FullName", newColumn:"Name");
        Db.AddColumn(table:"MyTable", new FieldDefinition { Name = "ToDelete", FieldType = typeof(string) });
    }
}
```

But our preference is to adopt the declarative approach when possible since it's a better match for code-first development where new or modified columns can be copied over from your App's Data Models to maintain and perform the schema changes. But ultimately you could use anything to implement your migration, from [Custom SQL](/ormlite/apis/schema.html#custom-sql) or as `Db` is just an ADO .NET Connection you could also use other Micro ORM's like [Dapper](https://github.com/DapperLib/Dapper) that's also [built-into OrmLite](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/Dapper).

### Code-First approach

To get the most out of DB migrations it's recommended that all schema changes are done through migrations to ensure they end up capturing all schema changes and saves duplicated efforts from having to create Migrations from out-of-band schema changes. It's a more explicit approach than relying on a tool to generate migrations from state diffs, but you'll have more control over how changes are applied and organized together with any populated data required by new features which are tracked together in source control. They're also easier to debug, re-run and refactor during the development cycle of new features.

### Complex Example

For a more complex example we'll look at creating an isolated feature that utilizes many of OrmLite's declarative attributes to define a wide class of RDBMS features, that combines both schema creation and seed data within the same migration:

```csharp
[Description("Add Player Feature")]
public class Migration1002 : MigrationBase
{
    public class Player : AuditBase
    {
        public int Id { get; set; }                     // 'Id' is PrimaryKey by convention

        [Required]
        public string FirstName { get; set; }           // Creates NOT NULL Column

        [Alias("Surname")]                              // Maps to [Surname] RDBMS column
        public string LastName { get; set; }

        [Index(Unique = true)]                          // Creates Unique Index
        public string Email { get; set; }

        public List<Phone> PhoneNumbers { get; set; }   // Complex Types blobbed by default

        [Reference]
        public List<GameItem> GameItems { get; set; }   // 1:M Reference Type saved separately

        [Reference]
        public Profile Profile { get; set; }            // 1:1 Reference Type saved separately
        public int ProfileId { get; set; }              // 1:1 Self Ref Id on Parent Table

        [ForeignKey(typeof(Level), OnDelete="CASCADE")] // Creates ON DELETE CASCADE Constraint
        public Guid SavedLevelId { get; set; }          // Creates Foreign Key Reference

        public ulong RowVersion { get; set; }           // Optimistic Concurrency Updates
    }

    public class Phone                                  // Blobbed Type only
    {
        public PhoneKind Kind { get; set; }
        public string Number { get; set; }
        public string Ext { get; set; }
    }

    public enum PhoneKind { Home, Mobile, Work }

    [Alias("PlayerProfile")]                            // Maps to [PlayerProfile] RDBMS Table
    [CompositeIndex(nameof(Username), nameof(Region))]  // Creates Composite Index
    public class Profile : AuditBase
    {
        [AutoIncrement]                                 // Auto Insert Id assigned by RDBMS
        public int Id { get; set; }

        public PlayerRole Role { get; set; }            // Native support for Enums
        public Region Region { get; set; }
        public string Username { get; set; }
        public long HighScore { get; set; }

        [Default(1)]                                    // Created in RDBMS with DEFAULT (1)
        public long GamesPlayed { get; set; }

        [CheckConstraint("Energy BETWEEN 0 AND 100")]   // Creates RDBMS Check Constraint
        public short Energy { get; set; }

        public string ProfileUrl { get; set; }
        public Dictionary<string, string> Meta { get; set; }
    }
    
                                                        // Enums saved as strings by default
    public enum PlayerRole { Leader, Player, NonPlayer }

    [EnumAsInt]                                         // Enum Saved as int
    public enum Region { Africa = 1, Americas = 2, Asia = 3, Australasia = 4, Europe = 5 }

    public class GameItem
    {
        [PrimaryKey]                                    // Specify field to use as Primary Key
        [StringLength(50)]                              // Creates VARCHAR COLUMN
        public string Name { get; set; }

        public int PlayerId { get; set; }               // Foreign Table Reference Id

        [StringLength(StringLengthAttribute.MaxText)]   // Creates "TEXT" RDBMS Column 
        public string Description { get; set; }

        [Default(OrmLiteVariables.SystemUtc)]           // Populated with UTC Date by RDBMS
        public DateTime DateAdded { get; set; }
    }

    public class Level
    {
        public Guid Id { get; set; }                    // Unique Identifier/GUID Primary Key
        public byte[] Data { get; set; }                // Saved as BLOB/Binary where possible
    }
    private string by = "admin@email.com";

    public override void Up()
    {
        //CREATE ForeignKey Tables in dependent order
        Db.CreateTable<Level>();
        Db.CreateTable<Player>();

        //CREATE tables without Foreign Keys in any order
        Db.CreateTable<Profile>();
        Db.CreateTable<GameItem>();

        var savedLevel = new Level {
            Id = Guid.NewGuid(),
            Data = new byte[]{ 1, 2, 3, 4, 5 },
        };
        Db.Insert(savedLevel);

        var player = new Player
        {
            Id = 1,
            FirstName = "North",
            LastName = "West",
            Email = "north@west.com",
            PhoneNumbers = new List<Phone> {
                new() { Kind = PhoneKind.Mobile, Number = "123-555-5555" },
                new() { Kind = PhoneKind.Home,   Number = "555-555-5555", Ext = "123" },
            },
            GameItems = new List<GameItem> {
                new() { Name = "WAND", Description = "Golden Wand of Odyssey"},
                new() { Name = "STAFF", Description = "Staff of the Magi"},
            },
            Profile = new Profile {
                Username = "north",
                Role = PlayerRole.Leader,
                Region = Region.Australasia,
                HighScore = 100,
                GamesPlayed = 10,
                ProfileUrl = "https://images.unsplash.com/photo-1463453091185-61582044d556?w=1024&h=1024",
                Meta = new() {
                    { "Quote", "I am gamer" }
                },
            }.WithAudit(by),
            SavedLevelId = savedLevel.Id,
        }.WithAudit(by);
        Db.Save(player, references: true);
    }
    
    public override void Down()
    {
        // Clear FK Data
        Db.DeleteAll<Level>();

        // DROP ForeignKey Tables in dependent order
        Db.DropTable<Level>();
        Db.DropTable<Player>();

        // DROP tables without Foreign Keys in any order
        Db.DropTable<Profile>();
        Db.DropTable<GameItem>();
    }
}
```

Essentially showing the App Data Models for the initial version of a feature can be copied into a Migration class to perform the required database changes.

### Reverting Migrations

Implementing `Down()` is optional but required if you ever intend to revert, refactor then reapply migrations. Alternatively this can be avoided by adopting a **"roll-forward"** approach where any issues with a migration would be resolved in the next one. Whilst this can save some dev effort it would prevent you from reverting, refactoring then reapplying migrations during development and before checking-in a finalized feature.

Migrations are executed within a transaction that's rolled back if it fails, however you should be aware of the limitations of your RDBMS, e.g. [newer MySQL versions has caveats on DDL Statements](https://dev.mysql.com/doc/refman/8.0/en/atomic-ddl.html#atomic-ddl-supported-statements) which can be rolled back, but otherwise it's fairly well supported on PostgreSQL, SQL Server & SQLite.

In most cases you'll be able to revert & rerun migrations however you should be mindful that some operations aren't completely reversible, e.g. if you remove a column then revert to add it again, the data in the column will be lost. 

## Running Migrations

To support multiple use-cases, Migrations can easily be run from the command-line or from code which you can use to run or debug migrations from Unit tests.

### Run or Debug Migrations from your IDE

A benefit of DB Migrations being implemented in a library is that it's better integrated and more versatile in supporting more executable options like being able to run from code which many project templates benefit from with new `MigrationTasks` Explicit TestFixture enabling DB Migrations to be run or debugged directly from within your IDE, implemented as:

 ```csharp
[TestFixture, Explicit, Category(nameof(MigrationTasks))]
public class MigrationTasks
{
    IDbConnectionFactory ResolveDbFactory() => new ConfigureDb().ConfigureAndResolve<IDbConnectionFactory>();
    Migrator CreateMigrator() => new(ResolveDbFactory(), typeof(Migration1000).Assembly); 
    
    [Test]
    public void Migrate()
    {
        var migrator = CreateMigrator();
        var result = migrator.Run();
        Assert.That(result.Succeeded);
    }

    [Test]
    public void Revert_All()
    {
        var migrator = CreateMigrator();
        var result = migrator.Revert(Migrator.All);
        Assert.That(result.Succeeded);
    }

    [Test]
    public void Revert_Last()
    {
        var migrator = CreateMigrator();
        var result = migrator.Revert(Migrator.Last);
        Assert.That(result.Succeeded);
    }

    [Test]
    public void Rerun_Last_Migration()
    {
        Revert_Last();
        Migrate();
    }
}
```

Which uses your App's `ConfigureDb` [Modular Startup](/modular-startup) configuration to resolve your App's configured `OrmLiteConnectionFactory` that the migrations are run against, that if needed can be run from Unit tests to debug through any schema migration issues.

#### Revert and Rerun Last Migration

The `Rerun_Last_Migration` task is especially useful during development of new features to easily revert and rerun the last migration before checking in a completed feature, allowing you to re-iterate and check in a completed and tested DB migration along with the new feature requiring it instead of multiple "micro migrations" for each DB change run at different times.

## Running migrations from command-line

To be able to run from migrations from the command line, DB Migrations needs access to your App's DB configuration. The best way to do this is to run your App normally then access the configured `IDbConnectionFactory` from the IOC, perform the migrations then exit with either a success or failure error code.

To do this we've added support for **AppTasks** which let you define tasks in your App that you can run from the command-line. This will let you perform migrations in a separate stage to check migrations were successful before running your App.

### Configuring existing Projects

You can add DB Migration support to existing projects by applying the [migrations](https://gist.github.com/gistlyn/50df00df4b3b9faa94a73d32ab4b2484) gist to your project with:

:::sh
x mix migrations
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

:::sh
dotnet run --AppTasks=migrate.revert:<name>
:::

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

### New RDBMS Projects configured with DB Migrations by default

Now that OrmLite has a formal solution for implementing and executing schema changes, the [Quick install RDBMS mix scripts](/ormlite/installation.html#quick-install-in-asp-net-core-with-mix) 
are now configured to include **migrations** by default.

### Run OrmLite and Entity Framework Migrations together

For convenience if you're using both Entity Framework and OrmLite within the same project you can change the `npm run migrate`
AppTask to run both Entity Framework and OrmLite Migrations by expanding the AppTask to run EF Migrations:

```csharp
public class ConfigureDbMigrations : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            var migrator = new Migrator(appHost.Resolve<IDbConnectionFactory>(), typeof(Migration1000).Assembly);
            AppTasks.Register("migrate", _ =>
            {
                var log = appHost.GetApplicationServices().GetRequiredService<ILogger<ConfigureDbMigrations>>();
                log.LogInformation("Running EF Migrations...");
                var scopeFactory = appHost.GetApplicationServices().GetRequiredService<IServiceScopeFactory>();
                using (var scope = scopeFactory.CreateScope())
                {
                    using var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    db.Database.EnsureCreated();
                    db.Database.Migrate();
                }
                log.LogInformation("Running OrmLite Migrations...");
                migrator.Run();
            });
            AppTasks.Register("migrate.revert", args => migrator.Revert(args[0]));
            AppTasks.Run();
        });
}
```

## Running migrations from GitHub Actions

Where applicable, [GitHub Action deployments](/github-action-templates) have been updated to automatically run on deployment before the new 
version of your application starts up. This is done in the **Run remote db migrations** step. 

Output can be found in your GitHub Action run output. The task that is run is controlled in the `.deploy/docker-compose-template.yml` 
file as a separate service which is only run if specified directly or with the `--profiles migration` option.

::: info
If you are using the template GitHub Actions and deploying to an Ubuntu 22.04 server, ensure you ssh key is generated using non RSA SHA1 algorithm.
Eg `ssh-keygen -t ecdsa` or swap out the use of `appleboy/scp-action@v0.1.3` for your own step using the latest version of the `scp` command line tool in your CI environment.
For a step by step and other options, see [this Ask Ubuntu Answer](https://askubuntu.com/a/1409528/366659)
:::

This migration approach enables an easy way to test your migration with a custom local docker compose file. Such as the following for a SQLite setup.

```yaml
version: "3.9"
services:
  myapp-migration:
    build: .
    restart: "no"
    command: --AppTasks=migrate
    volumes:
      - myapp-mydb:/app/App_Data

volumes:
  myapp-mydb:
```

::: info
Ensure you have v2+ of Docker Compose
A compatibility script can be used for `docker-compose` via the following script.
`echo 'docker compose --compatibility "$@"' > /usr/local/bin/docker-compose`
`sudo chmod +x /bin/docker-compose`
:::

### Failed migration behavior

Executing migrations from the command-line is also how they are run in CI. The strategy we've employed in our
[GitHub Action Deployment Templates](/github-action-templates) is to run the container to execute the **migrate** AppTask on the host
machine first to validate migration was successful before completing deployment of the new App, so that a failed migration
will cause deployment to fail and the previous App version to continue to run.

::: info
Ensure you are using Docker Compose v2+ and `--exit-code-from` the migration service in the `release.yml` file, in the 
`Run remote db migrations` step.
:::

## Running migrations from unit tests

The migration printed in the console output and captured in the **Migration** table should typically be enough to identify any issues, but should it be needed you can also debug Migrations in a unit test with:

```csharp
var migrator = new Migrator(DbFactory, typeof(Migration1000).Assembly);
var result = migrator.Run();

result.Succeeded // true if successful
result.TasksRun  // instances of MigrationBase run, can inspect `Error` for failed Exceptions and `Log` for executed SQL
result.TypesCompleted // Migration Types successfully completed
```

Likewise uou can revert using the `Revert()` method which accepts the same options as the command-line, e.g. Migration Type name, **"all"** or **"last"**:

```csharp
var result = migrator.Revert(Migrator.All);
```

## Running Migrations individually 

Should you ever need to, you can also run individual Migrations with the static `Up()` and `Down()` methods, e.g:

```csharp
Migrator.Up(DbFactory,   new[]{ typeof(Migration1000), typeof(Migration1001) });
Migrator.Down(DbFactory, new[]{ typeof(Migration1001), typeof(Migration1000) });
```

These lets you execute migration logic out-of-band where they'll have no impact on the **Migration** table which can be useful in developing & iterating migration implementations by removing/re-adding a feature's schema changes without impacting migration state.

### Clearing Migration State

To clear your migration table at the start of tests, run:

```csharp
var db = DbFactory.Open();
Migrator.Clear(db);
```

### Running Migrations on Named Connections

By default the Migration's `base.Db` connection is configured to use the primary database's connection string, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(
    Configuration.GetConnectionString("DefaultConnection"), PostgreSqlDialect.Provider);    
services.AddSingleton<IDbConnectionFactory>(dbFactory);
```

But if your App has [Multiple database connections](/ormlite/getting-started#multiple-database-connections) that you need to run migrations on, e.g:

```csharp
dbFactory.RegisterConnection("Sales", Configuration.GetConnectionString("Sales"), SqlServer2012Dialect.Provider);
dbFactory.RegisterConnection("Reporting", "reporting.sqlite", SqliteDialect.Provider);
```

You can configure the Migration `base.Db` connection to be configured to use a named connection with the `[NamedConnection]` attribute, e.g:

```csharp
[NamedConnection("Sales")]
class Migration1000 : MigrationBase
{
    class Order
    {
        public decimal Freight { get; set; }
    }

    public override void Up() => Db.Migrate<Order>();
    public override void Down() => Db.Revert<Order>();
}
```

Where you would maintain schema changes to different Databases in different Migrations, alternatively you could use `base.DbFactory` to create connections to named connections within the same Migration, e.g:


```csharp
class Migration1000 : MigrationBase
{
    class Order
    {
        public decimal Freight { get; set; }
    }

    class Subscription
    {
        public string Referral { get; set; }
    }

    public override void Up()
    {
        using var dbSales = DbFactory.Open("Sales");
        dbSales.Migrate<Order>();

        using var dbReporting = DbFactory.Open("Reporting");
        dbReporting.Migrate<Subscription>();
    }

    public override void Down()
    {
        using var dbSales = DbFactory.Open("Sales");
        dbSales.Revert<Order>();

        using var dbReporting = DbFactory.Open("Reporting");
        dbReporting.Revert<Subscription>();
    }
}
```

::: info
Whilst schema changes are run on different RDBMS's, all migration state is maintained in the **primary database's** `Migration` table
:::

### Multiple Named Connections

DB Migrations also support running and reverting Migrations on multiple named connections, e.g:

```csharp
[NamedConnection("mssql")]
[NamedConnection("mysql")]
[NamedConnection("postgres")]
public class Migration1001 : MigrationBase
{
    //...
}
```

This feature is likely more useful for maintaining the same schema across multiple database shards, which is a
[popular scaling technique](https://aws.amazon.com/what-is/database-sharding/) to increase system capacity and improve response times:

```csharp
[NamedConnection("shard1")]
[NamedConnection("shard2")]
[NamedConnection("shard3")]
public class Migration1001 : MigrationBase
{
    //...
}
```

## Reviewing Migrations

The output of each Migration is logged to the Console (or configured Logger), logging useful information on Migrations found and run as well as the executed SQL run in each migration. This information is also captured in the **Migration** table on the database they were run on, where they can be easily viewed in your App's [Database Admin UI](/admin-ui-database), e.g:

[![](/img/pages/ormlite/migration-database-admin.png)](/admin-ui-database)

::: tip
In addition to capturing executed SQL in the `Log` column, failed Migrations capture error information in the `ErrorCode`, `ErrorMessage` and `ErrorStackTrace` columns
:::

## Feedback Welcome

We hope you'll find this first version of DB Migrations useful, please let us know what other features you would like in [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions).
