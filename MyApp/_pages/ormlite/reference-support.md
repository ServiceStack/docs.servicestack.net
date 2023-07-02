---
title: Reference Support, POCO style
---

OrmLite lets you Store and Load related entities in separate tables using `[Reference]` attributes in primary tables in conjunction with `{Parent}Id` property convention in child tables, e.g:

```csharp
public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }

    [Reference] // Save in CustomerAddress table
    public CustomerAddress PrimaryAddress { get; set; }

    [Reference] // Save in Order table
    public List<Order> Orders { get; set; }
}

public class CustomerAddress
{
    [AutoIncrement]
    public int Id { get; set; }
    public int CustomerId { get; set; } //`{Parent}Id` convention to refer to Customer
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
}

public class Order
{
    [AutoIncrement]
    public int Id { get; set; }
    public int CustomerId { get; set; } //`{Parent}Id` convention to refer to Customer
    public string LineItem { get; set; }
    public int Qty { get; set; }
    public decimal Cost { get; set; }
}
```

With the above structure you can save a POCO and all its entity references with `db.Save(T,references:true)`, e.g:

```csharp
var customer =  new Customer {
    Name = "Customer 1",
    PrimaryAddress = new CustomerAddress {
        AddressLine1 = "1 Australia Street",
        Country = "Australia"
    },
    Orders = new[] {
        new Order { LineItem = "Line 1", Qty = 1, Cost = 1.99m },
        new Order { LineItem = "Line 2", Qty = 2, Cost = 2.99m },
    }.ToList(),
};

db.Save(customer, references:true);
```

This saves the root customer POCO in the `Customer` table, its related PrimaryAddress in the `CustomerAddress` table and its 2 Orders in the `Order` table.

## Querying POCO's with References

The `Load*` APIs are used to automatically load a POCO and all it's child references, e.g:

```csharp
var customer = db.LoadSingleById<Customer>(customerId);
```

Using Typed SqlExpressions:

```csharp
var customers = db.LoadSelect<Customer>(x => x.Name == "Customer 1");
```

More examples available in [LoadReferencesTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/LoadReferencesTests.cs)

Unlike normal complex properties, references:

- Doesn't persist as complex type blobs
- Doesn't impact normal querying
- Saves and loads references independently of itself
- Are serializable with Text serializers (only populated are visible).
- Loads related data only 1-reference-level deep

Basically they provide a better story when dealing with referential data that doesn't impact the POCO's ability to be used as DTOs.

## Merge Disconnected POCO Result Sets

The `Merge` extension method can stitch disconnected POCO collections together as per their relationships defined in OrmLite's POCO References.

For example, you can select a collection of Customers who've made an order with quantities of 10 or more and in a separate query select their filtered Orders and then merge the results of these 2 distinct queries together with:

```csharp
//Select Customers who've had orders with Quantities of 10 or more
var q = db.From<Customer>()
          .Join<Order>()
          .Where<Order>(o => o.Qty >= 10)
          .SelectDistinct();

List<Customer> customers = db.Select<Customer>(q);

//Select Orders with Quantities of 10 or more
List<Order> orders = db.Select<Order>(o => o.Qty >= 10);

customers.Merge(orders); // Merge disconnected Orders with their related Customers

customers.PrintDump();   // Print merged customers and orders datasets
```

## Custom Load References

You can selectively specify which references you want to load using the `include` parameter, e.g:

```csharp
var customerWithAddress = db.LoadSingleById<Customer>(customer.Id, include: new[] { "PrimaryAddress" });

//Alternative
var customerWithAddress = db.LoadSingleById<Customer>(customer.Id, include: x => new { x.PrimaryAddress });
```

### Custom Select with JOIN

You can specify SQL Aliases for ambiguous columns using anonymous properties, e.g:

```csharp
var q = db.From<Table>()
    .Join<JoinedTable>()
    .Select<Table, JoinedTable>((a, b) => new { a, JoinId = b.Id, JoinName = b.Name });
```

Which is roughly equivalent to:

```sql
SELECT a.*, b.Id AS JoinId, b.Name AS JoinName
```

Where it selects all columns from the primary `Table` as well as `Id` and `Name` columns from `JoinedTable,`
returning them in the `JoinId` and `JoinName` custom aliases.

## Nested JOIN Table Expressions

You can also query POCO References on JOIN tables, e.g:

```csharp
var q = db.From<Table>()
    .Join<Join1>()
    .Join<Join1, Join2>()
    .Where(x => !x.IsValid.HasValue && 
        x.Join1.IsValid &&
        x.Join1.Join2.Name == theName &&
        x.Join1.Join2.IntValue == intValue)
    .GroupBy(x => x.Join1.Join2.IntValue)
    .Having(x => Sql.Max(x.Join1.Join2.IntValue) != 10)
    .Select(x => x.Join1.Join2.IntValue);
```

## Table aliases

The `TableAlias` APIs lets you specify table aliases when joining same table multiple times together to differentiate from any
ambiguous columns in Queries with multiple self-reference joins, e.g:

```csharp
var q = db.From<Page>(db.TableAlias("p1"))
    .Join<Page>((p1, p2) => 
        p1.PageId == p2.PageId && 
        p2.ActivityId == activityId, db.TableAlias("p2"))
    .Join<Page,Category>((p2,c) => Sql.TableAlias(p2.Category) == c.Id)
    .Join<Page,Page>((p1,p2) => Sql.TableAlias(p1.Rank,"p1") < Sql.TableAlias(p2.Rank,"p2"))
    .Select<Page>(p => new {
        ActivityId = Sql.TableAlias(p.ActivityId, "p2")
    });

var rows = db.Select(q);
```

## Unique Constraints

In addition to creating an Index with unique constraints using `[Index(Unique=true)]` you can now use `[Unique]` to enforce a single column should only contain unique values or annotate the class with `[UniqueConstraint]` to specify a composite unique constraint, e.g:

```csharp
[UniqueConstraint(nameof(PartialUnique1), nameof(PartialUnique2), nameof(PartialUnique3))]
public class UniqueTest
{
    [AutoIncrement]
    public int Id { get; set; }

    [Unique]
    public string UniqueField { get; set; }

    public string PartialUnique1 { get; set; }
    public string PartialUnique2 { get; set; }
    public string PartialUnique3 { get; set; }
}
```

## Auto populated Guid Ids

Support for Auto populating `Guid` Primary Keys is available using the `[AutoId]` attribute, e.g:

```csharp
public class Table
{
    [AutoId]
    public Guid Id { get; set; }
}
```

In SQL Server it will populate `Id` primary key with `newid()`, in `PostgreSQL` it uses `uuid_generate_v4()` which requires installing the the **uuid-ossp** extension by running the SQL below on each PostgreSQL RDBMS it's used on:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
```

For all other RDBMS's OrmLite will populate the `Id` with `Guid.NewGuid()`. In all RDBMS's it will populate the `Id` property on `db.Insert()` or `db.Save()` with the new value, e.g:

```csharp
var row = new Table { ... };
db.Insert(row);
row.Id //= Auto populated with new Guid
```

## BelongTo Attribute

The `[BelongTo]` attribute can be used for specifying how Custom POCO results are mapped when the resultset is ambiguous, e.g:

```csharp
class A { 
    public int Id { get; set; }
}
class B {
    public int Id { get; set; }
    public int AId { get; set; }
}
class C {
    public int Id { get; set; }
    public int BId { get; set; }
}
class Combined {
    public int Id { get; set; }
    [BelongTo(typeof(B))]
    public int BId { get; set; }
}

var q = db.From<A>()
    .Join<B>()
    .LeftJoin<B,C>();

var results = db.Select<Combined>(q); //Combined.BId = B.Id
```

## Advanced Example

Seeing how the SqlExpression is constructed, joined and mapped, we can take a look at a more advanced example to showcase more of the new API's available:

```csharp
List<FullCustomerInfo> rows = db.Select<FullCustomerInfo>(  // Map results to FullCustomerInfo POCO
  db.From<Customer>()                                       // Create typed Customer SqlExpression
    .LeftJoin<CustomerAddress>()                            // Implicit left join with base table
    .Join<Customer, Order>((c,o) => c.Id == o.CustomerId)   // Explicit join and condition
    .Where(c => c.Name == "Customer 1")                     // Implicit condition on base table
    .And<Order>(o => o.Cost < 2)                            // Explicit condition on joined Table
    .Or<Customer,Order>((c,o) => c.Name == o.LineItem));    // Explicit condition with joined Tables
```

The comments next to each line document each Type of API used. Some of the new API's introduced in this example include:

- Usage of `LeftJoin` for specifying a LEFT JOIN, `RightJoin` and `FullJoin` also available
- Usage of `And<Table>()`, to specify an **AND** condition on a Joined table
- Usage of `Or<Table1,Table2>`, to specify an **OR** condition against 2 joined tables

More code examples of References and Joined tables are available in:

- [LoadReferencesTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/LoadReferencesTests.cs)
- [LoadReferencesJoinTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/LoadReferencesJoinTests.cs)
