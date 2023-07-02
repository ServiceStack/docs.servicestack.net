---
title: OrmLite walk through example
---

In its simplest usage, OrmLite can persist any POCO type without any attributes required:

```csharp
public class SimpleExample
{
	public int Id { get; set; }
	public string Name { get; set; }
}

//Set once before use (i.e. in a static constructor).
OrmLiteConfig.DialectProvider = SqliteDialect.Provider;

using (IDbConnection db = "/path/to/db.sqlite".OpenDbConnection())
{
	db.CreateTable<SimpleExample>(true);
	db.Insert(new SimpleExample { Id=1, Name="Hello, World!"});
	var rows = db.Select<SimpleExample>();

	Assert.That(rows, Has.Count(1));
	Assert.That(rows[0].Id, Is.EqualTo(1));
}
```

To get a better idea of the features of OrmLite lets walk through a complete example using sample tables from the Northwind database.
_ (Full source code for this example is [available here](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/ShippersExample.cs).) _

So with no other configuration using only the classes below:

```csharp
[Alias("Shippers")]
public class Shipper
	: IHasId<int>
{
	[AutoIncrement]
	[Alias("ShipperID")]
	public int Id { get; set; }

	[Required]
	[Index(Unique = true)]
	[StringLength(40)]
	public string CompanyName { get; set; }

	[StringLength(24)]
	public string Phone { get; set; }

	[References(typeof(ShipperType))]
	public int ShipperTypeId { get; set; }
}

[Alias("ShipperTypes")]
public class ShipperType
	: IHasId<int>
{
	[AutoIncrement]
	[Alias("ShipperTypeID")]
	public int Id { get; set; }

	[Required]
	[Index(Unique = true)]
	[StringLength(40)]
	public string Name { get; set; }
}

public class SubsetOfShipper
{
	public int ShipperId { get; set; }
	public string CompanyName { get; set; }
}

public class ShipperTypeCount
{
	public int ShipperTypeId { get; set; }
	public int Total { get; set; }
}
```

## Creating tables
Creating tables is a simple 1-liner:

```csharp
using (IDbConnection db = ":memory:".OpenDbConnection())
{
    db.CreateTable<ShipperType>();
    db.CreateTable<Shipper>();
}

/* In debug mode the line above prints:
DEBUG: CREATE TABLE "ShipperTypes" 
(
  "ShipperTypeID" INTEGER PRIMARY KEY AUTOINCREMENT, 
  "Name" VARCHAR(40) NOT NULL 
);
DEBUG: CREATE UNIQUE INDEX uidx_shippertypes_name ON "ShipperTypes" ("Name" ASC);
DEBUG: CREATE TABLE "Shippers" 
(
  "ShipperID" INTEGER PRIMARY KEY AUTOINCREMENT, 
  "CompanyName" VARCHAR(40) NOT NULL, 
  "Phone" VARCHAR(24) NULL, 
  "ShipperTypeId" INTEGER NOT NULL, 

  CONSTRAINT "FK_Shippers_ShipperTypes" FOREIGN KEY ("ShipperTypeId") REFERENCES "ShipperTypes" ("ShipperID") 
);
DEBUG: CREATE UNIQUE INDEX uidx_shippers_companyname ON "Shippers" ("CompanyName" ASC);
*/
```

## Transaction Support

As we have direct access to IDbCommand and friends - playing with transactions is easy:

```csharp
var trainsType = new ShipperType { Name = "Trains" };
var planesType = new ShipperType { Name = "Planes" };

//Playing with transactions
using (IDbTransaction dbTrans = db.OpenTransaction())
{
    db.Save(trainsType);
    db.Save(planesType);

    dbTrans.Commit();
}

using (IDbTransaction dbTrans = db.OpenTransaction(IsolationLevel.ReadCommitted))
{
    db.Insert(new ShipperType { Name = "Automobiles" });
    Assert.That(db.Select<ShipperType>(), Has.Count.EqualTo(3));
}
Assert.That(db.Select<ShipperType>(), Has.Count(2));
```

## CRUD Operations
No ORM is complete without the standard crud operations:

```csharp
	//Performing standard Insert's and Selects
  db.Insert(new Shipper { CompanyName = "Trains R Us", Phone = "555-TRAINS", ShipperTypeId = trainsType.Id });
  db.Insert(new Shipper { CompanyName = "Planes R Us", Phone = "555-PLANES", ShipperTypeId = planesType.Id });
  db.Insert(new Shipper { CompanyName = "We do everything!", Phone = "555-UNICORNS", ShipperTypeId = planesType.Id });

  var trainsAreUs = db.Single<Shipper>("ShipperTypeId = @Id", new { trainsType.Id });
  Assert.That(trainsAreUs.CompanyName, Is.EqualTo("Trains R Us"));
  Assert.That(db.Select<Shipper>("CompanyName = @company OR Phone = @phone", 
        new { company = "Trains R Us", phone = "555-UNICORNS" }), Has.Count.EqualTo(2));
  Assert.That(db.Select<Shipper>("ShipperTypeId = @Id", new { planesType.Id }), Has.Count.EqualTo(2));

  //Lets update a record
  trainsAreUs.Phone = "666-TRAINS";
  db.Update(trainsAreUs);
          Assert.That(db.SingleById<Shipper>(trainsAreUs.Id).Phone, Is.EqualTo("666-TRAINS"));
  
  //Then make it dissappear
  db.Delete(trainsAreUs);
          Assert.That(db.SingleById<Shipper>(trainsAreUs.Id), Is.Null);

  //And bring it back again
  db.Insert(trainsAreUs);
```

## Performing custom queries

And with access to raw sql when you need it - the database is your oyster :)

```csharp
var partialColumns = db.Select<SubsetOfShipper>(typeof(Shipper), 
    "ShipperTypeId = @Id", new { planesType.Id });
Assert.That(partialColumns, Has.Count.EqualTo(2));

//Select into another POCO class that matches sql
var rows = db.Select<ShipperTypeCount>(
    "SELECT ShipperTypeId, COUNT(*) AS Total FROM Shippers GROUP BY ShipperTypeId ORDER BY COUNT(*)");

Assert.That(rows, Has.Count.EqualTo(2));
Assert.That(rows[0].ShipperTypeId, Is.EqualTo(trainsType.Id));
Assert.That(rows[0].Total, Is.EqualTo(1));
Assert.That(rows[1].ShipperTypeId, Is.EqualTo(planesType.Id));
Assert.That(rows[1].Total, Is.EqualTo(2));


//And finally lets quickly clean up the mess we've made:
db.DeleteAll<Shipper>();
db.DeleteAll<ShipperType>();

Assert.That(db.Select<Shipper>(), Has.Count.EqualTo(0));
Assert.That(db.Select<ShipperType>(), Has.Count.EqualTo(0));
```

## Soft Deletes

Select Filters let you specify a custom `SelectFilter` that lets you modify queries that use `SqlExpression<T>` before they're executed. This could be used to make working with "Soft Deletes" Tables easier where it can be made to apply a custom `x.IsDeleted != true` condition on every `SqlExpression`.

By either using a `SelectFilter` on concrete POCO Table Types, e.g:

```csharp
SqlExpression<Table1>.SelectFilter = q => q.Where(x => x.IsDeleted != true);
SqlExpression<Table2>.SelectFilter = q => q.Where(x => x.IsDeleted != true);
```

Or alternatively using generic delegate that applies to all SqlExpressions, but you'll only have access to a
`IUntypedSqlExpression` which offers a limited API surface area but will still let you execute a custom filter
for all `SqlExpression<T>` that could be used to add a condition for all tables implementing a custom
`ISoftDelete` interface with:

```csharp
OrmLiteConfig.SqlExpressionSelectFilter = q =>
{
    if (q.ModelDef.ModelType.HasInterface(typeof(ISoftDelete)))
    {
        q.Where<ISoftDelete>(x => x.IsDeleted != true);
    }
};
```

Both solutions above will transparently add the `x.IsDeleted != true` to all `SqlExpression<T>` based queries
so it only returns results which aren't `IsDeleted` from any of queries below:

```csharp
var results = db.Select(db.From<Table>());
var result = db.Single(db.From<Table>().Where(x => x.Name == "foo"));
var result = db.Single(x => x.Name == "foo");
```

## Check Constraints

OrmLite includes support for [SQL Check Constraints](https://en.wikipedia.org/wiki/Check_constraint) which will create your Table schema with the `[CheckConstraint]` specified, e.g:

```csharp
public class Table
{
    [AutoIncrement]
    public int Id { get; set; }

    [Required]
    [CheckConstraint("Age > 1")]
    public int Age { get; set; }

    [CheckConstraint("Name IS NOT NULL")]
    public string Name { get; set; }
}
```

### Bitwise operators

The Typed SqlExpression bitwise operations support depends on the RDBMS used.

E.g. all RDBMS's support Bitwise `And` and `Or` operators:

```csharp
db.Select<Table>(x => (x.Flags | 2) == 3);
db.Select<Table>(x => (x.Flags & 2) == 2);
```

All RDBMS Except for SQL Server support bit shift operators:

```csharp
db.Select<Table>(x => (x.Flags << 1) == 4);
db.Select<Table>(x => (x.Flags >> 1) == 1);
```

Whilst only SQL Server and MySQL Support Exclusive Or:

```csharp
db.Select<Table>(x => (x.Flags ^ 2) == 3);
```
