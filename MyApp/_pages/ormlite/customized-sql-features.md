---
title: Customized SQL Features
---

A number of new hooks are available to provide more flexibility when creating and dropping your RDBMS tables.

## CustomSelect Attribute

The `[CustomSelect]` can be used to define properties you want populated from a Custom SQL Function or
Expression instead of a normal persisted column, e.g:

```csharp
public class Block
{
    public int Id { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }

    [CustomSelect("Width * Height")]
    public int Area { get; set; }

    [Default(OrmLiteVariables.SystemUtc)]
    public DateTime CreatedDate { get; set; }

    [CustomSelect("FORMAT(CreatedDate, 'yyyy-MM-dd')")]
    public string DateFormat { get; set; }
}

db.Insert(new Block { Id = 1, Width = 10, Height = 5 });

var block = db.SingleById<Block>(1);

block.Area.Print(); //= 50

block.DateFormat.Print(); //= 2016-06-08 (SQL Server)
```

## Order by dynamic expressions

The `[CustomSelect]` attribute can be used to populate a property with a dynamic SQL Expression instead of an existing column, e.g:

```csharp
public class FeatureRequest
{
    public int Id { get; set; }
    public int Up { get; set; }
    public int Down { get; set; }

    [CustomSelect("1 + Up - Down")]
    public int Points { get; set; }
}
```

You can also order by the SQL Expression by referencing the property as you would a normal column. By extension this feature now also works in AutoQuery where you can [select it in a partial result set](/autoquery/rdbms#custom-fields) and order the results by using its property name, e.g:

```
/features?fields=id,points&orderBy=points
```

## Custom SQL Fragments

The `Sql.Custom()` API lets you use raw SQL Fragments in Custom `.Select()` expressions, e.g:

```csharp
var q = db.From<Table>()
    .Select(x => new {
        FirstName = x.FirstName,
        LastName = x.LastName,
        Initials = Sql.Custom("CONCAT(LEFT(FirstName,1), LEFT(LastName,1))")
    });
```

## Custom Field Declarations

The `[CustomField]` attribute can be used for specifying custom field declarations in the generated Create table DDL statements, e.g:

```csharp
public class PocoTable
{
    public int Id { get; set; }

    [CustomField("CHAR(20)")]
    public string CharColumn { get; set; }

    [CustomField("DECIMAL(18,4)")]
    public decimal? DecimalColumn { get; set; }

    [CustomField(OrmLiteVariables.MaxText)]        //= {MAX_TEXT}
    public string MaxText { get; set; }

    [CustomField(OrmLiteVariables.MaxTextUnicode)] //= {NMAX_TEXT}
    public string MaxUnicodeText { get; set; }
}

db.CreateTable<PocoTable>(); 
```

Generates and executes the following SQL in SQL Server:

```sql
CREATE TABLE "PocoTable" 
(
  "Id" INTEGER PRIMARY KEY, 
  "CharColumn" CHAR(20) NULL, 
  "DecimalColumn" DECIMAL(18,4) NULL, 
  "MaxText" VARCHAR(MAX) NULL, 
  "MaxUnicodeText" NVARCHAR(MAX) NULL 
); 
```

::: info
OrmLite replaces any variable placeholders with the value in each RDBMS DialectProvider's `Variables` Dictionary.
:::

## Custom Insert and Update Expressions

The `[CustomInsert]` and `[CustomUpdate]` attributes can be used to override what values rows are inserted during INSERT's and UPDATE's.

We can use this to insert a salted and hashed password using PostgreSQL native functions:

```csharp
public class CustomSqlUser
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Email { get; set; }

    [CustomInsert("crypt({0}, gen_salt('bf'))"),
     CustomUpdate("crypt({0}, gen_salt('bf'))")]
    public string Password { get; set; }
}

var user = new CustomSqlUser {
    Email = "user@email.com", 
    Password = "secret"
};
db.Insert(user);
```

We can then use `Sql.Custom()` to create a partially typed custom query to match on the hashed password, e.g:

```csharp
var quotedSecret = db.Dialect().GetQuotedValue("secret");
var q = db.From<CustomSqlUser>()
    .Where(x => x.Password == Sql.Custom($"crypt({quotedSecret}, password)"));
var row = db.Single(q);
```

#### Pre / Post Custom SQL Hooks when Creating and Dropping tables

Pre / Post Custom SQL Hooks allow you to inject custom SQL before and after tables are created or dropped, e.g:

```csharp
[PostCreateTable("INSERT INTO TableWithSeedData (Name) VALUES ('Foo');" +
                 "INSERT INTO TableWithSeedData (Name) VALUES ('Bar');")]
public class TableWithSeedData
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
}
```

Which like other ServiceStack attributes, can also be added dynamically, e.g:

```csharp
typeof(TableWithSeedData)
    .AddAttributes(new PostCreateTableAttribute(
        "INSERT INTO TableWithSeedData (Name) VALUES ('Foo');" +
        "INSERT INTO TableWithSeedData (Name) VALUES ('Bar');"));
```

Custom SQL Hooks also allow executing custom SQL before and after a table has been created or dropped, i.e:

```csharp
[PreCreateTable(runSqlBeforeTableCreated)]
[PostCreateTable(runSqlAfterTableCreated)]
[PreDropTable(runSqlBeforeTableDropped)]
[PostDropTable(runSqlAfterTableDropped)]
public class Table {}
```

## Custom SqlExpression Filter

The generated SQL from a Typed `SqlExpression` can also be customized using `.WithSqlFilter()`, e.g:

```csharp
var q = db.From<Table>()
    .Where(x => x.Age == 27)
    .WithSqlFilter(sql => sql + " option (recompile)");

var q = db.From<Table>()
    .Where(x => x.Age == 27)
    .WithSqlFilter(sql => sql + " WITH UPDLOCK");

var results = db.Select(q);
```

## Ignoring DTO Properties

You may use the `[Ignore]` attribute to denote DTO properties that are not fields in the table. This will force the SQL generation to ignore that property.
