---
title: SQL Server Features
---

## SQL Server 2012 Sequences

The `[Sequence]` attribute can be used as an alternative to `[AutoIncrement]` for inserting rows with an auto incrementing integer value populated by SQL Server, but instead of needing an `IDENTITY` column it can populate a normal `INT` column from a user-defined Sequence, e.g:

```csharp
public class SequenceTest
{
    [Sequence("Seq_SequenceTest_Id"), ReturnOnInsert]
    public int Id { get; set; }

    public string Name { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }

    [Sequence("Seq_Counter")]
    public int Counter { get; set; }
}

var user = new SequenceTest { Name = "me", Email = "me@mydomain.com" };
db.Insert(user);

user.Id //= Populated by next value in "Seq_SequenceTest_Id" SQL Server Sequence
```

The new `[ReturnOnInsert]` attribute tells OrmLite which columns to return the values of, in this case it returns the new Sequence value the row was inserted with. Sequences offer more flexibility than `IDENTITY` columns where you can use multiple sequences in a table or have the same sequence shared across multiple tables.

When creating tables, OrmLite will also create any missing Sequences automatically so you can continue to have reproducible tests and consistent Startups states that's unreliant on external state. But it doesn't drop sequences when OrmLite drops the table as they could have other external dependents.

To be able to use the new sequence support you'll need to use an SQL Server dialect greater than SQL Server 2012+, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(connString, SqlServer2012Dialect.Provider);
```

## SQL Server Table Hints

Using the same JOIN Filter feature OrmLite also lets you add SQL Server Hints on JOIN Table expressions, e.g:

```csharp
var q = db.From<Car>()
    .Join<Car, CarType>((c, t) => c.CarId == t.CarId, SqlServerTableHint.ReadUncommitted);
```

Which emits the appropriate SQL Server hints:

```sql
SELECT "Car"."CarId", "CarType"."CarTypeName" 
FROM "Car" INNER JOIN "CarType" WITH (READUNCOMMITTED) ON ("Car"."CarId" = "CarType"."CarId")
```

## Memory Optimized Tables

OrmLite allows access to many advanced SQL Server features including
[Memory-Optimized Tables](https://msdn.microsoft.com/en-us/library/dn133165.aspx) where you can tell
SQL Server to maintain specific tables in Memory using the `[SqlServerMemoryOptimized]` attribute, e.g:

```csharp
[SqlServerMemoryOptimized(SqlServerDurability.SchemaOnly)]
public class SqlServerMemoryOptimizedCacheEntry : ICacheEntry
{
    [PrimaryKey]
    [StringLength(StringLengthAttribute.MaxText)]
    [SqlServerBucketCount(10000000)]
    public string Id { get; set; }
    [StringLength(StringLengthAttribute.MaxText)]
    public string Data { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```

The `[SqlServerBucketCount]` attribute can be used to
[configure the bucket count for a hash index](https://msdn.microsoft.com/en-us/library/mt706517.aspx#configuring_bucket_count)
whilst the new `[SqlServerCollate]` attribute can be used to specify an SQL Server collation.

## SQL Server Types

OrmLite can be extended to support new Types using SQL Server Special Type Converters which currently adds support for the SQL Server-specific
[SqlGeography](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/master/src/ServiceStack.OrmLite.SqlServer.Converters/SqlServerGeographyTypeConverter.cs),
[SqlGeometry](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/master/src/ServiceStack.OrmLite.SqlServer.Converters/SqlServerGeometryTypeConverter.cs)
and
[SqlHierarchyId](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/master/src/ServiceStack.OrmLite.SqlServer.Converters/SqlServerHierarchyIdTypeConverter.cs)
Types.

Since these Types require an external dependency to the **Microsoft.SqlServer.Types** NuGet package they're
contained in a separate NuGet package that can be installed with:

```
PM> Install-Package ServiceStack.OrmLite.SqlServer.Converters
```

Once installed, all available SQL Server Types can be registered on your SQL Server Provider with:

```csharp
SqlServerConverters.Configure(SqlServer2012Dialect.Provider);
```

## SqlServer 2012 Connection String

In addition to using `SqlServer2012Dialect.Provider` you'll also need to specify you're using MSSQL 2012 on the connection string by adding the `;Type System Version=SQL Server 2012;` suffix, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(
  "Server=host;Database=db;User Id=sa;Password=test;Type System Version=SQL Server 2012",
  SqlServer2012Dialect.Provider);

var db = dbFactory.OpenDbConnection();
```

### Example Usage

After the Converters are registered they can treated like a normal .NET Type, e.g:

**SqlHierarchyId** Example:

```csharp
public class Node {
    [AutoIncrement]
    public long Id { get; set; }
    public SqlHierarchyId TreeId { get; set; }
}

db.DropAndCreateTable<Node>();

var treeId = SqlHierarchyId.Parse("/1/1/3/"); // 0x5ADE is hex
db.Insert(new Node { TreeId = treeId });

var parent = db.Scalar<SqlHierarchyId>(
    db.From<Node>().Select("TreeId.GetAncestor(1)"));
parent.ToString().Print(); //= /1/1/
```

**SqlGeography** and **SqlGeometry** Example:

```csharp
public class GeoTest {
    public long Id { get; set; }
    public SqlGeography Location { get; set; }
    public SqlGeometry Shape { get; set; }
}

db.DropAndCreateTable<GeoTest>();

var geo = SqlGeography.Point(40.6898329,-74.0452177, 4326); // Statue of Liberty

// A simple line from (0,0) to (4,4)  Length = SQRT(2 * 4^2)
var wkt = new System.Data.SqlTypes.SqlChars("LINESTRING(0 0,4 4)".ToCharArray());
var shape = SqlGeometry.STLineFromText(wkt, 0);

db.Insert(new GeoTestTable { Id = 1, Location = geo, Shape = shape });
var dbShape = db.SingleById<GeoTest>(1).Shape;

new { dbShape.STEndPoint().STX, dbShape.STEndPoint().STY }.PrintDump();
```

Output:

```
{
    STX: 4,
    STY: 4
}
```
