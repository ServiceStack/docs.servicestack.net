---
title: Schema, Table & Column APIs
---

## Create Table APIs

OrmLite's `CreateTable` APIs can be used to create RDBMS tables from your C# POCO Data Models.

If you also need to ensure tables are populated with Seed Data when they're created, use `CreateTableIfNotExists`, e.g:

```csharp
using var db = appHost.Resolve<IDbConnectionFactory>().Open();

if (db.CreateTableIfNotExists<Person>())
{
    db.Insert(new Person { Id = 1, Name = "John Doe" });
}
```

### Create Tables

Or if you just want to create tables that don't exist:

```csharp
db.CreateTableIfNotExists<Person>()
db.CreateTable<Person>(overwrite:false);

// Runtime Type
db.CreateTableIfNotExists(typeof(Person));
db.CreateTables(overwrite:false, typeof(Person));

// Multiple Tables
db.CreateTableIfNotExists(typeof(TableA), typeof(TableB), typeof(TableC));
db.CreateTables(overwrite:false, typeof(TableA), typeof(TableB), typeof(TableC));
```

### Recreate Tables

To ensure existing tables are dropped and new tables are always re-created, use:

```csharp
db.DropAndCreateTable<Person>();
db.CreateTable<Person>(overwrite:true);


// Multiple Runtime Types
db.DropAndCreateTables(typeof(TableA), typeof(TableB), typeof(TableC));
db.CreateTables(overwrite:true, typeof(TableA), typeof(TableB), typeof(TableC));
```

### Drop and Create Tables

However if your tables have foreign keys, you'll need to drop and re-create them in the order that satisfies their foreign key constraints, e.g:

```csharp
db.DropTable<TableB>();
db.DropTable<TableA>();

db.CreateTable<TableA>();
db.CreateTable<TableB>();

// Runtime Type
db.DropTable(typeof(Person));
db.CreateTable(typeof(Person));

// Multiple Runtime Types
db.DropTables(typeof(TableA), typeof(TableB), typeof(TableC));
db.CreateTables(overwrite:true, typeof(TableA), typeof(TableB), typeof(TableC));
```

#### Pre / Post Custom SQL Hooks when Creating and Dropping tables

Pre / Post Custom SQL Hooks allow you to inject custom SQL before and after tables are created or dropped, e.g:

```csharp
[PostCreateTable("INSERT INTO Person (Name) VALUES ('Foo');" +
                 "INSERT INTO Person (Name) VALUES ('Bar');")]
public class Person
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
}
```

## Create Schemas

The `CreateSchema` APIs can be used to create Schemas in RDBMSs that support it, where they don't already exist:

```csharp
db.CreateSchema("TheSchema");
```

Alternatively you can use the typed API to create Schemas defined on Data Models, e.g:

```csharp
[Schema("Schema")]
public class Person
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
}

db.CreateSchema<Person>();
```

## Query Existing Tables

As the queries for retrieving table names can vary amongst different RDBMS's, we've abstracted their implementations behind uniform APIs
where you can now get a list of table names and their row counts for all supported RDBMS's with:

```csharp
List<string> tableNames = db.GetTableNames();

List<KeyValuePair<string,long>> tableNamesWithRowCounts = db.GetTableNamesWithRowCounts();
```

::: info
`*Async` variants also available
:::

Both APIs can be called with an optional `schema` if you only want the tables for a specific schema.
It defaults to using the more efficient RDBMS APIs, which if offered typically returns an approximate estimate of rowcounts in each table.

If you need exact table row counts, you can specify `live:true`:

```csharp
var tablesWithRowCounts = db.GetTableNamesWithRowCounts(live:true);
```

## Modify Custom Schema

OrmLite provides Typed APIs for modifying Table Schemas that makes it easy to inspect the state of an
RDBMS Table which can be used to determine what modifications you want on it, e.g:

```csharp
class Poco 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Ssn { get; set; }
}

db.DropTable<Poco>();
db.TableExists<Poco>(); //= false

db.CreateTable<Poco>(); 
db.TableExists<Poco>(); //= true

db.ColumnExists<Poco>(x => x.Ssn); //= true
db.DropColumn<Poco>(x => x.Ssn);
db.ColumnExists<Poco>(x => x.Ssn); //= false
```

In a future version of your Table POCO you can use `ColumnExists` to detect which columns haven't been
added yet, then use `AddColumn` to add it, e.g:

```csharp
class Poco 
{
    public int Id { get; set; }
    public string Name { get; set; }

    [Default(0)]
    public int Age { get; set; }
}

if (!db.ColumnExists<Poco>(x => x.Age)) //= false
    db.AddColumn<Poco>(x => x.Age);

db.ColumnExists<Poco>(x => x.Age); //= true
```

## Modify Schema APIs

Additional Modify Schema APIs available in OrmLite include:

### AlterTable

When maximum flexibility is needed to perform Alter table commands with custom SQL, e.g:

```csharp
db.AlterTable<Poco>("ADD Email VARCHAR(255)");
db.AlterTable(typeof(Poco), "ADD Email VARCHAR(255)");
```

### AddColumn

For adding a **new column** definition to an existing table, e.g:

```csharp
public class Poco
{
    [Index]
    public string Code { get; set; }
}

db.AddColumn<Poco>(x => x.Code);
db.AddColumn(table:"Poco", new FieldDefinition { Name = "Code", FieldType = typeof(string) });
```

### AlterColumn

For modifying an **existing column** definition, e.g:

```csharp
public class Poco
{
    [Index]
    public string Code { get; set; }
}

db.AlterColumn<Poco>(x => x.Code);
db.AlterColumn(table:"Booking", new FieldDefinition { Name = "Code", FieldType = typeof(string), IsIndexed = true });
```

### RenameColumn

For renaming an existing column, e.g:

```csharp
db.RenameColumn<Poco>(x => x.ToName, fromName);
db.RenameColumn(typeof(Poco), fromName, toName);
db.RenameColumn(table:"Poco", oldColumn:fromName, newColumn:toName);
```

### DropColumn

For dropping an existing column, e.g:

```csharp
db.DropColumn<Poco>(x => x.Name);
db.DropColumn(typeof(Poco), "Name");
db.DropColumn(table:"Poco", column:"Name");
```

### AddForeignKey

To add a Foreign Key relationship to existing tables, e.g:

```csharp
db.AddForeignKey<Poco, ReferencedType>(
    field: t => t.RefId, 
    foreignField: tr => tr.Id,
    onUpdate: OnFkOption.NoAction, 
    onDelete: OnFkOption.Cascade, 
    foreignKeyName);
```

### DropForeignKey

To delete an existing Foreign Key:

```csharp
db.DropForeignKey<Poco>(foreignKeyName);
```

### CreateIndex

To create an index on an existing column, e.g:

```csharp
db.CreateIndex<Poco>(x => x.Code);
db.CreateIndex<Poco>(x => x.Code, indexName);
db.CreateIndex<Poco>(x => x.Code, indexName, unique:true);
```

### DropIndex

To drop an existing index, e.g:

```csharp
db.DropIndex<Poco>(indexName);
```

## Custom SQL

When you need functionality beyond what's available in the Modify Schema APIs like needing to access RDBMS-specific features you can drop down to SQL:

```csharp
db.ExecuteSql("ALTER TABLE Track ADD Rand INT default 0");
db.ExecuteSql("UPDATE Track SET Rand = abs(random()) % 1000");

Db.ExecuteSql("INSERT INTO page_stats (ref_id, fav_count) VALUES (@refId, @favCount)",
              new { refId, favCount })

//Async:
Db.ExecuteSqlAsync("UPDATE page_stats SET view_count = view_count + 1 WHERE id = @id", new { id })

//PostgreSQL Arrays
await Db.ExecuteSqlAsync(@"UPDATE notification SET emailed_user_ids = emailed_user_ids || @userId WHERE id = @id", 
    new { userId, id = notificationId });
```


## Typed `Sql.Cast()` SQL Modifier

The `Sql.Cast()` provides a cross-database abstraction for casting columns or expressions in SQL queries, e.g:

```csharp
db.Insert(new SqlTest { Value = 123.456 });

var results = db.Select<(int id, string text)>(db.From<SqlTest>()
    .Select(x => new {
        x.Id,
        text = Sql.Cast(x.Id, Sql.VARCHAR) + " : " + Sql.Cast(x.Value, Sql.VARCHAR) + " : " 
             + Sql.Cast("1 + 2", Sql.VARCHAR) + " string"
    }));

results[0].text //= 1 : 123.456 : 3 string
```

## Typed `Column<T>` and `Table<T>` APIs

You can use the `Column<T>` and `Table<T>()` methods to resolve the quoted names of a Column or Table within SQL Fragments (taking into account any configured aliases or naming strategies).

Usage Example of the new APIs inside a `CustomJoin()` expression used to join on a custom SELECT expression:

```csharp
q.CustomJoin($"LEFT JOIN (SELECT {q.Column<Job>(x => x.Id)} ...")
q.CustomJoin($"LEFT JOIN (SELECT {q.Column<Job>(nameof(Job.Id))} ...")

q.CustomJoin($"LEFT JOIN (SELECT {q.Column<Job>(x => x.Id, tablePrefix:true)} ...")
//Equivalent to:
q.CustomJoin($"LEFT JOIN (SELECT {q.Table<Job>()}.{q.Column<Job>(x => x.Id)} ...")

q.Select($"{q.Column<Job>(x => x.Id)} as JobId, {q.Column<Task>(x => x.Id)} as TaskId")
//Equivalent to:
q.Select<Job,Task>((j,t) => new { JobId = j.Id, TaskId = t.Id })
```

## DB Parameter APIs

To enable even finer-grained control of parameterized queries we've added new overloads that take a collection of IDbDataParameter's:

```csharp
List<T> Select<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
T Single<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
T Scalar<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
List<T> Column<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
IEnumerable<T> ColumnLazy<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
HashSet<T> ColumnDistinct<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
Dictionary<K, List<V>> Lookup<K, V>(string sql, IEnumerable<IDbDataParameter> sqlParams)
List<T> SqlList<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
List<T> SqlColumn<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
T SqlScalar<T>(string sql, IEnumerable<IDbDataParameter> sqlParams)
```

::: info
Including Async equivalents for each of the above Sync APIs.
:::

The new APIs let you execute parameterized SQL with finer-grained control over the `IDbDataParameter` used, e.g:

```csharp
IDbDataParameter pAge = db.CreateParam("age", 40, dbType:DbType.Int16);
db.Select<Person>("SELECT * FROM Person WHERE Age > @pAge", new[] { pAge });
```

The new `CreateParam()` extension method above is a useful helper for creating custom IDbDataParameter's.

## Customize null values

The new `OrmLiteConfig.OnDbNullFilter` lets you replace DBNull values with a custom value, so you could convert all `null` strings to be populated with `"NULL"` using:

```csharp
OrmLiteConfig.OnDbNullFilter = fieldDef => 
    fieldDef.FieldType == typeof(string)
        ? "NULL"
        : null;
```

## Modify Schema Versioning Examples

OrmLite provides Typed APIs for modifying Table Schemas that makes it easy to inspect the state of an RDBMS Table which can be used to determine what modifications you want to apply to it to upgrade it to the latest version:

```csharp
public class Track
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Album { get; set; }
    public int ArtistId { get; set; } 
}

// Map to same "Track" RDBMS Table, not needed when Track is refactored
[Alias("Track")]
public class Track_v2
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Album { get; set; }
    public int ArtistId { get; set; } 
    [Default(5)]
    public int Rating { get; set; }  // ADD
}

var v1TableExists = db.TableExists<Track>();
$"Table Exists: {v1TableExists}".Print();
if (!v1TableExists)
{
	db.CreateTable<Track>(); 
	v1TableExists = db.TableExists<Track>();
}

var v1RatingExists = db.ColumnExists<Track_v2>(x => x.Rating);
$"Rating Exists v1: {v1RatingExists}".Print();
if (!v1RatingExists)
{
    db.AddColumn<Track_v2>(x => x.Rating);
    var v2RatingExists = db.ColumnExists<Track_v2>(x => x.Rating);
}
```

## Create Table Examples

As a code-first ORM, creating tables is effortless in OrmLite that uses your POCO Type definition to generate RDBMS Table schemas that cleanly maps .NET data types 1:1 to the most appropriate RDBMS column definition:

```csharp
public class AllFields
{
    public string Id { get; set; } //implicit Primary Key
    public int Int { get; set; }
    public int? NInt { get; set; }
    public long Long { get; set; }
    public long? NLong { get; set; }
    public uint Uint { get; set; }
    public uint? NUint { get; set; }
    public Guid Guid { get; set; }
    public Guid? NGuid { get; set; }
    public bool Bool { get; set; }
    public bool? NBool { get; set; }
    public DateTime DateTime { get; set; }
    public DateTime? NDateTime { get; set; }
    public float Float { get; set; }
    public float? NFloat { get; set; }
    public double Double { get; set; }
    public double? NDouble { get; set; }
    public decimal Decimal { get; set; }
    public decimal? NDecimal { get; set; }
    public TimeSpan TimeSpan { get; set; }
    public TimeSpan? NTimeSpan { get; set; }
}

if (db.CreateTableIfNotExists<AllFields>())  //= true; if table was created
{
    db.Insert(new AllFields { 
        Id = "Id", Int = 1, Long = 2, Uint = 3, Guid = Guid.NewGuid(), Bool = true, DateTime = DateTime.UtcNow,
        Float = 1.1f, Double = 2.2d, Decimal = 3.3m, TimeSpan = new TimeSpan(1,1,1,1) });
}

var allFields = db.SingleById<AllFields>("Id");

db.DropAndCreateTable<AllFields>();
var emptyAllFieldsCount = db.Count<AllFields>();

db.DropTable<AllFields>();
var oldTableExists = db.TableExists<AllFields>();

db.CreateTable<AllFields>();
var newTableExists = db.TableExists<AllFields>();
```

## Create Tables with Complex Types

OrmLite also supports persisting rich complex types which are blobbed by default or you can use the [Reference] support to persist Nested Complex Types in their own Table Definitions:

```csharp
public class ArtistWithBlobTracks
{
    public int Id { get; set; }
    public string Name { get; set; }
    //By default Complex Types are blobbed with the containing record
    public List<Track> Tracks { get; set; }
}
public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; }
    //Complex Type References are persisted in own table
    [Reference] public List<Track> Tracks { get; set; }
}
public class Track
{
    [AutoIncrement] 
    public int Id { get; set; }
    public string Name { get; set; }
    public string Album { get; set; }
    public int ArtistId { get; set; } // Implicit Reference Id
}

db.CreateTable<ArtistWithBlobTracks>();
db.CreateTable<Artist>();
db.CreateTable<Track>();

db.Insert(new ArtistWithBlobTracks { 
    Id = 1, Name = "Faith No More", 
    Tracks = new List<Track> { 
        new Track { Name = "Everythings Ruined", Album = "Angel Dust" },
        new Track { Name = "Ashes to Ashes", Album = "Album of the Year" } } 
});
var artistWithBlobTracks = db.SingleById<ArtistWithBlobTracks>(1);
$"Artist with blobbed Tracks: {artistWithBlobTracks.Dump()}".Print();
$"\nBlob Tracks Count: {db.Count<Track>()}".Print();

db.Save(new Artist { 
    Id = 1, Name = "Faith No More", 
    Tracks = new List<Track> { 
        new Track { Name = "Everythings Ruined", Album = "Angel Dust" },
        new Track { Name = "Ashes to Ashes", Album = "Album of the Year" } }
}, references: true);

var artistWithRefTracks = db.LoadSingleById<Artist>(1);
$"\nArtist with referenced Tracks: {artistWithRefTracks.Dump()}".Print();
$"\nReferenced Tracks Count: {db.Count<Track>()}".Print();
```

## Customize Tables using Attributes

When needed you can markup your POCO's with .NET Attributes to allow further specialization of your Table schema and unlock RDBMS server features:

```csharp
[Schema("TheSchema")]
[Alias("TableAlias")]
public class CustomTable
{
    [PrimaryKey]
    [AutoIncrement]
    public int CustomKey { get; set; }
    
    [Alias("RDBMS_NAME")]
    public string CSharpName { get; set; }
    
    [Index(Unique = true)]
    public string IndexColumn { get; set; }

    [Default(100)]
    public int? DefaultValue { get; set; }
    
    [Default(OrmLiteVariables.SystemUtc)]
    public DateTime CurrentDate { get; set; }

    [Required]
    [StringLength(3)]
    public string RequiredCustomLength { get; set; } //= NOT NULL
    
    [DecimalLength(18,4)]
    public decimal? CustomDecimalPrecision { get; set; }
    
    [CustomField("DECIMAL(18,4)")]
    public decimal? CustomProperty { get; set; }
    
    // Completely ignored in OrmLite (used in Serialization only)
    [Ignore]
    public int IgnoredProperty { get; set; }

    // Doesn't exist on Table, only used in SELECT Statements
    [CustomSelect("CustomKey + DefaultValue")] 
	public int SelectOnlyProperty { get; set; }
}

db.CreateTable<CustomTable>();

var id = db.Insert(new CustomTable { CSharpName = "Name", IndexColumn = "bar", RequiredCustomLength = "foo",
	CustomDecimalPrecision = 1.111m, CustomProperty = 2.222m }, selectIdentity:true);

var customTableRow = db.SingleById<CustomTable>(id);
```

## Create Tables with Foreign Keys

A popular use-case where you'd want to use Attributes is to define Foreign Keys:

```csharp
public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Album
{
    public int Id { get; set; }
    public string Name { get; set; }

    [ForeignKey(typeof(Album), OnDelete = "CASCADE")]
    public int ArtistId { get; set; }
}

public class Track
{
    public int Id { get; set; }
    public string Name { get; set; }

    [References(typeof(Album))]
    public int AlbumId { get; set; } // db-agnostic attribute, generates FK to Artist

    [ForeignKey(typeof(Artist), OnDelete = "CASCADE")]
    public int ArtistId { get; set; }
}


db.CreateTable<Artist>();
db.CreateTable<Album>();
db.CreateTable<Track>(); //Order is important for tables with Foreign Keys

db.Insert(new Artist { Id = 1, Name = "Nirvana" });
db.Insert(new Album { Id = 2, Name = "Nevermind", ArtistId = 1 });
db.Insert(new Track { Id = 3, Name = "Smells Like Teen Spirit", AlbumId = 2, ArtistId = 1 });

var artist = db.SingleById<Artist>(1);
var album = db.SingleById<Album>(2);
var track = db.SingleById<Track>(3);
```

