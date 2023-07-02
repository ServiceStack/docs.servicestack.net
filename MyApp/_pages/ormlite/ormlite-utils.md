---
title: OrmLite Utils
---

The `Sql.In()` API supports nesting and combining of multiple Typed SQL Expressions together
in a single SQL Query, e.g:

```csharp
var usaCustomerIds = db.From<Customer>(c => c.Country == "USA").Select(c => c.Id);
var usaCustomerOrders = db.Select(db.From<Order>()
    .Where(x => Sql.In(x.CustomerId, usaCustomerIds)));
``` 

By using `Sql.In` from within a `SqlExpression<T>`, multiple values can be checked for a match in your query.

```csharp
db.Select<Author>(x => Sql.In(x.City, "London", "Madrid", "Berlin"));

var cities = new[] { "London", "Madrid", "Berlin" };
db.Select<Author>(x => Sql.In(x.City, cities));
```

## Parametrized IN Values

OrmLite also supports providing collection of values which is automatically split into multiple DB parameters to simplify executing parameterized SQL with multiple IN Values, e.g:

```csharp
var ids = new[]{ 1, 2, 3};
var results = db.Select<Table>("Id in (@ids)", new { ids });

var names = new List<string>{ "foo", "bar", "qux" };
var results = db.SqlList<Table>("SELECT * FROM Table WHERE Name IN (@names)", new { names });
```

## Spread Util

The `SqlSpread()` API is useful to generate an escaped list of parameterized values for use in SQL `IN()` statements and SQL functions:

```csharp
var dialect = db.Dialect();
dialect.SqlSpread(1, 2, 3);         //= 1,2,3
dialect.SqlSpread("A", "B", "C");   //= 'A','B','C'
dialect.SqlSpread("A'B", "C\"D");   //= 'A''B','C\"D'
```

## Lazy Queries

APIs ending with `Lazy` yield an IEnumerable sequence letting you stream the results without having to map the entire resultset into a disconnected List of POCO's first, e.g:

```csharp
var lazyQuery = db.SelectLazy<Person>("Age > @age", new { age = 40 });
// Iterate over a lazy sequence 
foreach (var person in lazyQuery) {
   //...  
}
```

## Save Methods

`Save` and `SaveAll` will Insert if no record with **Id** exists, otherwise it Updates.

`Save` will populate any `[AutoIncrement]` or `[AutoId]` Primary Keys, e.g:

```csharp
db.Save(item);
item.Id // RDBMS populated Auto Id 
```

Alternatively you can also manually Select and Retrieve the Inserted RDBMS Auto Id in a single query with `Insert` APIs by specifying `selectIdentity:true`:

```csharp
item.Id = db.Insert(item, selectIdentity:true);
```

## Other examples

```csharp
var topVIPs = db.WhereLazy<Person>(new { Age = 27 }).Where(p => IsVip(p)).Take(5)
```

## Other Notes

- All **Insert**, **Update**, and **Delete** methods take multiple params, while `InsertAll`, `UpdateAll` and `DeleteAll` take IEnumerables.
- Methods containing the word **Each** return an `IEnumerable<T>` and are lazily loaded (i.e. non-buffered).
