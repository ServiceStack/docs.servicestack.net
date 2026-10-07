---
title: Schema Diff
---

`GetSchemaDiff()` compares your models with their tables in the database and returns what's in one and not the
other, so you find out that a model has changed without its table when your App starts, not when a query fails:

```csharp
var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));

if (diff.HasChanges)
    log.LogWarning("The database doesn't match its models:\n{Diff}", diff);
```

```
Invoice
  ~ Reference  VARCHAR(50) NOT NULL -> VARCHAR(200) NULL
  + PaidDate  DATETIME NULL
  + Currency  VARCHAR(8000) NULL (renamed from LegacyCode?)
  - LegacyCode  VARCHAR(8000) NULL (not in Invoice) (renamed to Currency?)
  + index idx_invoice_customerid
Customer
  + table isn't in the database
```

The differences can be logged, [written as a migration](#write-a-migration) for you to review, or
[applied to the database](#apply-the-changes) while you're developing.

## In the Admin UI

The [Database Admin UI](/admin-ui-database#schema-diff) has a **Schema Diff** for each database, which shows the
differences between your App's models and their tables with a migration to copy into your App.

<screenshot src="/img/pages/admin-ui/database-schema-diff.webp" title="Schema Diff in the Database Admin UI"></screenshot>

The generated migration class is available to copy into your App and review before running it:

<screenshot src="/img/pages/admin-ui/database-migration-class.webp" title="Migration class generated from Schema Diff"></screenshot>

It compares these models of your App:

- The data models of your AutoQuery APIs
- The models of the tables your [DB Migrations](/ormlite/db-migrations) create or change
- Other models you add to the `ModelTypes` of the `AdminDatabaseFeature`

Migrations declare their own copy of each table, as it was when the migration was written. The App's model with the
same table name, from its `[Alias]` or class name, is the latest version of the table, which is the one that's
compared. Tables whose name is used by more than one of your App's models are only compared when one of them is the
data model of an AutoQuery API or in `ModelTypes`. Set `IncludeMigrationModels = false` to only compare the other
models.

The same models are available to your App with `Migrator.GetMigrationTables()`:

```csharp
var models = Migrator.GetMigrationTables([typeof(Migration1000).Assembly], [typeof(Invoice).Assembly])
    .Where(x => x.ModelType != null)
    .Select(x => x.ModelType!)
    .ToArray();
var diff = db.GetSchemaDiff(models);
```

## What's compared

| | Difference | Change |
|-|-|-|
| `+` | The table of a model isn't in the database | `CreateTable` |
| `+` | The column of a property isn't in its table | `AddColumn` |
| `~` | A column isn't the type or size of its property, or allows nulls when its property doesn't | `AlterColumn` |
| `-` | A column of the table isn't a property of the model | `DropColumn` |
| `+` | An index of the model, e.g. an `[Index]` property, isn't in the database | `CreateIndex` |
| `~` | An index of the model is in the database with other columns, in another order or uniqueness | `AlterIndex` |
| `-` | An index of the table is on a column that isn't in the model, so it's dropped before its column | `DropIndex` |
| `!` | An index of the table on columns of the model isn't in the model, e.g. one added by hand. It's kept, with the attribute that declares it | `IndexNotInModel` |
| `~` | A column's default isn't its property's `[Default]`, or it has a default its property doesn't | `AlterDefault` |
| `+` | The foreign key of a `[ForeignKey]` or `[References]` property isn't in the database | `AddForeignKey` |
| `~` | A foreign key references another table, or has other `OnDelete` or `OnUpdate` actions | `AlterForeignKey` |
| `-` | A foreign key of the table isn't in the model | `DropForeignKey` |
| `+` | A `[Unique]`, `[UniqueConstraint]`, `[CheckConstraint]` or `[CheckEnum]` constraint isn't in the database | `AddConstraint` |
| `~` | A check constraint's condition isn't the model's | `AlterConstraint` |
| `-` | A unique or check constraint of the table isn't in the model | `DropConstraint` |
| `~` | The primary key has other columns than the model's, which is reported but not changed | `AlterPrimaryKey` |
| `~` | SQLite: the table is created again from its model to make the changes SQLite can't alter | `RebuildTable` |
| `+` | The full-text index of a [`[FullTextIndex]`](/ormlite/full-text-search) isn't in the database | `CreateFullTextIndex` |

Indexes are compared by their name, then their key columns, whether they're unique, their `Include` columns and their
`Where` condition. Databases rewrite conditions, e.g. PostgreSQL writes an `IN` list as `= ANY (ARRAY[...])`, so on
PostgreSQL and SQL Server the model's are created on a temporary table and compared as the database writes them.

Unique constraints are compared by their columns, in any order, as the database names the constraints of `[Unique]`
properties. Check constraints are compared by their name, then their condition as the database writes it: the model's
checks are created in a temporary table, so `[CheckEnum]`'s `IN` lists are compared however your database rewrites
them.

Indexes on columns of the model are never dropped, as they're often added to the database by hand, e.g. to speed up
a slow query. An index that isn't in the model is reported with the `[Index]` or `[CompositeIndex]` that declares
it, named like the index of the database, so adding it to the model makes the model the same as the database:

```
Order
  ! index ix_order_customer  (CustomerId) (not in Order, kept: add [Index(Name = "ix_order_customer")] to Order.CustomerId)
  ! index ix_order_status_created  (Status, CreatedDate) (not in Order, kept: add [CompositeIndex("Status", "CreatedDate", Name = "ix_order_status_created")] to Order)
```

Its `Unique`, `Include` columns and `Where` condition are included, and an index of an expression, which no attribute
declares, is kept and reported without one. MySQL's unique constraints are its unique indexes, so on MySQL they're kept
the same way, with `[Unique]` or `[UniqueConstraint]` to declare them. Only an index on a column that isn't in the
model is dropped, with `DropIndex` before its column.

A primary key of other columns is only reported. Changing it needs the foreign keys that reference it and its data to be
migrated too, so it's left for a migration you write. Until then, the columns of the primary key in the database aren't
altered.

Default values are compared as your database writes them, e.g. `((0))` on SQL Server or `'draft'::character varying`
on PostgreSQL, with the defaults of the temporary table the model's columns are created in. The defaults of
`[AutoIncrement]` columns aren't compared, as they're their sequences.

Foreign keys are compared by their column, then the table they reference and their `OnDelete` and `OnUpdate` actions,
where `RESTRICT` and `NO ACTION` are the same:

```
Order
  ~ Quantity  default DEFAULT 1 -> DEFAULT 5
  ~ foreign key FK_Order_Customer_CustomerId  (CustomerId) REFERENCES Customer (Id) -> (CustomerId) REFERENCES Customer (Id) ON DELETE CASCADE
  + foreign key FK_Order_Customer_BillingCustomerId  (BillingCustomerId) REFERENCES Customer (Id)
  - foreign key FK_Order_Warehouse_WarehouseId  (WarehouseId) REFERENCES Warehouse (Id) (not in Order)
```

Foreign keys aren't compared when `OrmLiteConfig.SkipForeignKeys` is set, as the model's tables are created without
them.

A column that isn't in the database and a column that isn't in the model are likely the same column renamed when
they're the only ones of their type. Their changes say so with `LikelyRename`, e.g:

```
Invoice
  + Currency  VARCHAR(8000) NULL (renamed from LegacyCode?)
  - LegacyCode  VARCHAR(8000) NULL (not in Invoice) (renamed to Currency?)
```

They're only likely, so they're added and dropped as other columns, and a migration says how to rename them instead.

Columns are compared with the columns the model would be created with, as your database reports them: the
properties of the model are created in a temporary table that's read and dropped. A table that's created from its
model never has differences, whichever [type converters](/ormlite/type-converters) and
naming strategy you use.

Some types aren't a difference to each other, which are common in tables that weren't created by OrmLite, e.g. by
Entity Framework:

- **Text**: a `TEXT` column, or a character column without a length like `VARCHAR(MAX)`, when its property would be
  created as a `VARCHAR(n)`, as it holds every value of the property. SQLite doesn't use the length of a column, so
  its character types are all treated as the same
- **Integers**: `SMALLINT`, `INTEGER` and `BIGINT` columns, e.g. a `long` property with an `INTEGER` column
- **SQLite decimals**: `NUMERIC` and `DECIMAL` columns of any precision and scale, which SQLite doesn't use

It's supported for SQLite, PostgreSQL, SQL Server, MySQL and MariaDB.

## Ignore tables

Tables that aren't managed by OrmLite aren't compared. The tables of ASP.NET Core Identity (`AspNet*`) and EF Core's
migrations (`__EFMigrationsHistory`) are ignored by default, including models whose `[Alias]` is one of their tables,
e.g. a `[Alias("AspNetUsers")]` model used by an AutoQuery API.

Ignore other tables by their name or model, e.g. in `Configure.Db.cs`:

```csharp
OrmLiteConfig.SchemaDiff.IgnoreTables.Add("Legacy*");          // * matches any characters
OrmLiteConfig.SchemaDiff.IgnoreTables.Add("ImportStaging");
OrmLiteConfig.SchemaDiff.IgnoreTypes.Add(typeof(AuditArchive));
```

Table names are matched after `[Alias]` and your naming strategy, ignoring case. Remove a default to compare its
tables again, e.g. `OrmLiteConfig.SchemaDiff.IgnoreTables.Remove("AspNet*")`.

The tables that weren't compared are in `diff.Ignored`, which is logged at the end of the differences, and shown
under the Schema Diff in the Admin UI:

```
Invoice
  + PaidDate  DATETIME NULL
Ignored: AspNetUsers, AspNetRoles
```

To use other rules for one comparison, pass its own options:

```csharp
var diff = db.GetSchemaDiff(new SchemaDiffOptions { IgnoreTables = [] }, typeof(AppUser), typeof(Invoice));
```

## Log the differences when your App starts

The `AdminDatabaseFeature` can log the Schema Diff of each database when your App starts, so differences are seen
in its startup logs, e.g. in `Configure.Db.cs`:

```csharp
services.AddPlugin(new AdminDatabaseFeature {
    LogSchemaDiff = context.HostingEnvironment.IsDevelopment(),
});
```

It compares the same models as the [Admin UI](#in-the-admin-ui), in the background after your App starts, and logs a
warning with the differences of each database whose tables aren't the same as their models:

For example, after changing the `SaasPlanFeature` model without updating its table, developers see this
Schema Diff warning when starting their App with `LogSchemaDiff` enabled:

```text
Schema Diff: the tables of the main database aren't the same as their models
SaasPlanFeature
  ~ Name  TEXT NULL -> CHARACTER VARYING(120) NOT NULL
  + Summary  TEXT NULL (renamed from Description?)
  ~ DisplayOrder  default no default -> DEFAULT 10
  - Description  TEXT NULL (not in SaasPlanFeature) (renamed to Summary?)
  + index idx_saasplanfeature_enabled
Ignored: AspNetUsers
```

Or an information message when they are. It isn't compared when running [App Tasks](/app-tasks), e.g. migrations.
Comparing creates temporary tables, so it's best enabled in development.

To compare other models yourself, e.g. in a [Modular Startup](/modular-startup) class:

```csharp
public class ConfigureDbSchema : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit: appHost => {
            using var db = appHost.Resolve<IDbConnectionFactory>().Open();

            // The models that have a table
            var models = typeof(Invoice).Assembly.GetTypes()
                .Where(x => x.Namespace == "MyApp.ServiceModel.Types")
                .ToArray();

            var diff = db.GetSchemaDiff(models);
            if (diff.HasChanges)
                LogManager.GetLogger(GetType()).Warn("The database doesn't match its models:\n" + diff);
        });
}
```

Or fail a test, so it's found before it's deployed:

```csharp
[Test]
public void Database_matches_its_models()
{
    using var db = dbFactory.OpenDbConnection();
    var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));
    Assert.That(diff.HasChanges, Is.False, diff.ToString());
}
```

## The changes

Each difference is a `SchemaChange`, with the change that makes the database the same as the model:

```csharp
foreach (var change in diff.Changes)
{
    Console.WriteLine(change.Description);
    Console.WriteLine(change.Sql);
}
```

```
Column Invoice.Reference is VARCHAR(50) NOT NULL in the database, VARCHAR(200) NULL in Invoice
ALTER TABLE "Invoice" ALTER COLUMN "Reference" VARCHAR(200) NULL;
Column Invoice.PaidDate isn't in the database: DATETIME NULL
ALTER TABLE "Invoice" ADD "PaidDate" DATETIME NULL;
Column Invoice.LegacyCode isn't in Invoice: VARCHAR(8000) NULL
ALTER TABLE "Invoice" DROP COLUMN "LegacyCode";
Index idx_invoice_customerid of Invoice isn't in the database
CREATE INDEX idx_invoice_customerid ON "Invoice" ("CustomerId");
```

| Property | |
|-|-|
| `Type` | `CreateTable`, `AddColumn`, `AlterColumn`, `DropColumn`, `CreateIndex`, `AlterIndex`, `DropIndex`, `AlterDefault`, `AddForeignKey`, `AlterForeignKey`, `DropForeignKey`, `AddConstraint`, `AlterConstraint`, `DropConstraint`, `AlterPrimaryKey`, `RebuildTable`, `CreateFullTextIndex` or `IndexNotInModel` |
| `ModelType`, `Table`, `Name` | The model, its table and the column, index, foreign key or constraint |
| `Field` | The property of a column, `null` for columns that aren't in the model |
| `DatabaseColumn`, `ModelColumn` | The column, index, default, foreign key, constraint or primary key as it is in the database, and as the model would create it |
| `LikelyRename` | The column that's likely the same column renamed |
| `Sql` | The SQL that makes the change, `null` if the database can't, e.g. SQLite can't alter a column, which its `RebuildTable` change makes |
| `IsRebuilt` | Whether it's made by the `RebuildTable` change of its table |
| `IsDestructive` | Whether it can lose data or fail with the rows of the table |
| `Attribute`, `AttributeTarget` | `IndexNotInModel`: the attribute that declares the index, and the property or model to add it to |

A change is destructive when it drops a column or an index, alters a column in any way other than making it larger or
allowing nulls, or makes an index unique. Foreign keys that aren't in the model are destructive, as they may have been
added to the database by hand. Indexes on columns of the model are never dropped, `IndexNotInModel` has no `Sql` and
isn't made by `ApplySchemaDiff()`.

Adding a unique or check constraint is destructive, as the rows of the table can break it, and so is changing a check's
condition. Constraints that aren't in the model are destructive to drop, like indexes. Adding a foreign key to a column
that's in the table is destructive, as its rows can reference rows that don't exist,
and so is changing the table a foreign key references. A foreign key of a column that's added in the same diff
isn't, and neither are changes to defaults, which only change the rows that are inserted without a value.

## Write a migration

`ToMigration()` writes the changes as a [DB Migration](/ormlite/db-migrations), for you to review and add to your
migrations:

```csharp
var diff = db.GetSchemaDiff(typeof(Invoice));
File.WriteAllText("Migrations/Migration1005.cs", diff.ToMigration("Migration1005", "MyApp.Migrations"));
```

```csharp
// GENERATED BY SCHEMA DIFF: A GUIDE TO REVIEW, NOT A FINISHED MIGRATION
//
// Schema Diff is new, and it's too early to know how accurate the migrations it writes are. Don't trust this
// class to do the right thing: check every change does what you intend, e.g. a column that's not in a model is
// only dropped by commented code as it may have been renamed, and run it against a copy of your data first.
// Delete the #warning below once you've reviewed it.
#warning Generated by Schema Diff: review this migration before running it, then delete this line

using System;
using System.Collections.Generic;
using ServiceStack;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace MyApp.Migrations;

public class Migration1005 : MigrationBase
{
    public class Invoice
    {
        [AutoIncrement]
        public int Id { get; set; }

        [StringLength(200)]
        public string Reference { get; set; }

        public DateTime? PaidDate { get; set; }

        public string Currency { get; set; }
    }

    public override void Up()
    {
        // Reference is VARCHAR(50) NOT NULL
        Db.AlterColumn<Invoice>(x => x.Reference);
        Db.AddColumn<Invoice>(x => x.PaidDate);
        // Currency is likely LegacyCode renamed. If it is, rename it instead of adding it:
        // Db.RenameColumn<Invoice>(x => x.Currency, "LegacyCode");
        Db.AddColumn<Invoice>(x => x.Currency);
        // LegacyCode (VARCHAR(8000) NULL) isn't in Invoice. If it was renamed, rename it instead:
        // Db.RenameColumn<Invoice>("LegacyCode", "Currency");
        // Db.DropColumn<Invoice>("LegacyCode");
        Db.ExecuteSql("CREATE INDEX idx_invoice_customerid ON \"Invoice\" (\"CustomerId\");");
    }

    public override void Down()
    {
        Db.DropIndex<Invoice>("idx_invoice_customerid");
        Db.DropColumn<Invoice>(x => x.Currency);
        Db.DropColumn<Invoice>(x => x.PaidDate);
        // Reference was VARCHAR(50) NOT NULL
    }
}
```

The migration has its own copy of the model, with its Primary Key and the properties that are changed, so it keeps
working after the model changes again. Tables that aren't in the database have all their properties, and are
created with `Db.CreateTable<T>()`.

:::warning
A generated migration is a guide, not a finished migration. Schema Diff is new, and it's too early to know how
accurate the migrations it writes are, so they start with a `#warning` that's reported each time your App is built,
until you've reviewed the migration and deleted it.
:::

Review it before you run it:

- **Renamed properties** look like a new column and a column that isn't in the model. Columns that aren't in the
  model are only dropped by code that's commented out, with the rename to use instead
- **Altered columns** aren't reverted by `Down()`, which has what the column was as a comment
- **New columns that don't allow nulls** need a `[Default]` to be added to a table that has rows
- **Indexes, defaults, foreign keys and constraints** are changed with the SQL of the database the diff was read from
- **Constraints that aren't in the model** are only dropped by code that's commented out, as `DropConstraint<T>()`
  doesn't drop constraints on every database
- **A primary key of other columns** is a comment, for you to migrate with its foreign keys and data
- **Indexes that aren't in the model** are a comment with the attribute to add to the model, and are never dropped

### Write it to your migrations

The `migrate.new` [App Task](/app-tasks) of the `AdminDatabaseFeature` writes the migration of your database's Schema
Diff to your App's `Migrations` folder, named after your last migration, e.g. `Migration1005.cs`:

:::sh
dotnet run --AppTasks=migrate.new
:::

It compares the same models as the [Admin UI](#in-the-admin-ui), and doesn't write anything when your database is
the same as its models, or replace a migration that's already there. Write the migration of a
[named connection](/ormlite/multi-database-app) with its name, e.g. `migrate.new:reports`, which is run on its
database. The folder is the `MigrationsPath` of the `AdminDatabaseFeature`, relative to your App's content root.

## Apply the changes

`ApplySchemaDiff()` makes the changes to the database, and returns the changes it made:

```csharp
var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));

// Create tables, add columns and indexes, make columns larger or allow nulls, change defaults,
// add the foreign keys of new columns and change the actions of foreign keys
var applied = db.ApplySchemaDiff(diff);

// Also drop columns that aren't in the model, and alter columns in ways that can lose data or fail
db.ApplySchemaDiff(diff, allowDestructive: true);
```

It's for keeping a development or test database the same as your models. Use migrations for the databases you
deploy to, which are reviewed, run once and recorded.

## Rebuild SQLite tables

SQLite can't alter a column, its default, foreign keys or constraints. It changes them by
[creating the table again](https://www.sqlite.org/lang_altertable.html#otheralter) and copying its rows, which
`db.RebuildTable<T>()` does from its model:

```csharp
db.RebuildTable<Invoice>();
```

It creates the table with another name, copies the rows of the columns that are in the table and the model, drops
the table, renames the new table, then creates the model's indexes, the table's other indexes on the columns that are
kept, and its triggers again, so an index added by hand isn't lost. The next
`AUTOINCREMENT` id is kept, so the ids of deleted rows aren't reused. It runs in a transaction of its own, or in your
connection's transaction, e.g. a migration's, so a row that breaks the new table, e.g. its new `[CheckConstraint]`,
leaves the table as it was.

The changes of a SQLite table's Schema Diff that SQLite can't make are made by a `RebuildTable` change after them, and
have `IsRebuilt` set:

```
Invoice
  ~ Reference  VARCHAR(50) NOT NULL -> VARCHAR(200) NULL (by rebuilding the table)
  ~ Qty  default no default -> DEFAULT 1 (by rebuilding the table)
  ~ rebuild table to change Reference, the default of Qty
```

Its migration rebuilds the table with `Db.RebuildTable<Invoice>()`, from the migration's copy of the model with all
its properties. Things to be aware of:

- **Columns that aren't in the model aren't kept**, so a rebuild is destructive when the table has them. Rename a
  column before the table is rebuilt to keep it
- **Tables referenced by foreign keys**: when foreign keys are enforced, SQLite would delete or change the rows of the
  tables that reference a table that's rebuilt. Outside a transaction, `RebuildTable()` stops enforcing them while
  it's rebuilt and checks the rows before they're committed. In a transaction, e.g. a migration's, foreign keys can
  only be disabled before it starts, so it throws an `InvalidOperationException` instead, unless
  `PRAGMA foreign_keys=OFF` was run before the transaction
- **A primary key of other columns** isn't changed by a Schema Diff's rebuild, which needs the foreign keys that
  reference it to be migrated too

## Things to be aware of

- **Not compared**: the order of columns, the expressions of [generated columns](/ormlite/ddl-attributes#generated-columns)
  and [comments](/ormlite/ddl-attributes#comments). Oracle and Firebird don't compare indexes, defaults, foreign keys
  or constraints
- **Temporary tables**: the user of the connection needs to be able to create them, e.g. the
  `CREATE TEMPORARY TABLES` privilege in MySQL. When it can't, the types of columns aren't compared and
  `diff.Warnings` says why
- **SQLite can't alter a column**, its default, foreign keys or constraints, so their tables are
  [rebuilt](#rebuild-sqlite-tables). SQLite doesn't keep the names of foreign keys, so the ones that aren't in the model
  have no `Name`
- **Tables that aren't created from their model**, e.g. by hand with an `NVARCHAR(160)` column where the model
  creates a `VARCHAR(8000)`, have differences for each column that isn't what the model creates, other than
  the text and integer types above
- **Changes are applied one at a time**, not in a transaction, so a change that fails leaves the changes before it
