---
title: JSON Support
---

OrmLite provides a portable, typed API for querying JSON stored in SQLite, PostgreSQL, SQL Server and MySQL.
JSON queries are written as normal typed LINQ expressions that compose with `SqlExpression<T>` queries, so JSON
properties can be filtered, selected and ordered without embedding provider-specific SQL.

<json-api-choice>
</json-api-choice>

Properties with a complex type, e.g. a class or a `List`, are stored as JSON in a single column, and are queried like
any other property:

```csharp
public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }       // stored as JSON
    public List<string> Tags { get; set; }     // stored as JSON
}

var londonVips = db.Select<Customer>(x => x.Address.City == "London" && x.Tags.Contains("vip"));
```

See [Querying complex type properties](#querying-complex-type-properties) for what's supported.

For JSON stored in a `string` column, `Sql.Json<T>()` declares the shape of its JSON document so it can be queried
with the same typed C# member access:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority") &&
        Sql.Json<OrderDocument>(x.Data).Lines[0].Quantity > 1);

var orders = db.Select(q);
```

An explicit SQL/JSON path API is also available when a document does not have a C# Data Model, when its path is selected at
runtime, or when using operations such as path existence and JSON type inspection:

```csharp
var statePath = "$.Customer.Address.shipping_state";

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.JsonValue<string>(x.Data, statePath) == "WA" &&
        Sql.JsonExists(x.Data, "$.Tags[0]"));
```

## Supported databases

The portable JSON API targets current versions of the primary databases supported by OrmLite:

<json-support>
</json-support>

::: info
SQL Server 2016-2019 can use `Sql.JsonValue()`, `Sql.JsonQuery()`, `Sql.JsonType()`, `Sql.JsonArrayLength()` and
`Sql.JsonArrayContains()`. On these versions `Sql.IsJson()` retains SQL Server's object-or-array validation semantics,
and `Sql.JsonExists()` is unavailable. Use `SqlServer2022Dialect.Provider` when the complete portable API is required.
:::

## Querying complex type properties

When complex types are [stored as JSON](#storing-complex-properties-as-json), the default of dialects configured with
`AddOrmLite()`, typed queries can read into them without any other API:

```csharp
public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }
    public List<string> Tags { get; set; }
    public List<OrderLine> Lines { get; set; }
}

public class Address
{
    public string City { get; set; }
    public Country Country { get; set; }
}
```

| Expression | Queries |
|-|-|
| `x.Address.City == "London"` | A property, at any depth: `x.Address.Country.Code` |
| `x.Tags.Contains("vip")` | Whether a list or array has a value |
| `x.Lines.Count > 1` | How many items a list has, or `Length` of an array |
| `x.Lines[0].Quantity >= 2` | An item of a list by its position |
| `x.Lines.Any(l => l.Sku == "A-1" && l.Quantity > 1)` | Whether a list has an item matching a condition |
| `x.Lines.All(l => l.Shipped)` | Whether every item matches a condition |
| `x.Lines.Count(l => l.Quantity > 10) >= 2` | How many items match a condition |

They're used wherever a typed expression is, e.g. to filter, sort and select:

```csharp
var q = db.From<Customer>()
    .Where(x => x.Address.Country.Code == "UK" && x.Tags.Contains("vip"))
    .OrderBy(x => x.Address.City)
    .Select(x => new { x.Name, City = x.Address.City });

db.Count<Customer>(x => x.Address.City == "London");
db.UpdateOnly(() => new Customer { Name = "Londoner" }, where: x => x.Address.City == "London");
db.Delete<Customer>(x => x.Lines.Count == 0);
```

And on joined tables:

```csharp
var q = db.From<Customer>()
    .Join<Order>((c, o) => c.Id == o.CustomerId)
    .Where<Customer, Order>((c, o) => o.Source.Channel == "web" && c.Tags.Contains("vip"));
```

Values are sent as db params, and the same native JSON functions are used as `Sql.Json<T>()`, which is for JSON
in `string` columns.

### Storing complex properties as JSON

Complex types need to be stored as JSON to be queried, as their values can't be read by the JSON functions of an RDBMS
otherwise. The fluent configuration enables JSON serialization by default for SQLite, PostgreSQL, SQL Server and MySQL:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString));
// options.UsePostgres(connectionString)
// options.UseSqlServer(connectionString)
// options.UseMySql(connectionString)
```

It can also be enabled explicitly, on the fluent configuration or on a dialect provider:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString, dialect => {
    dialect.UseJson = true;
}));

// Or set on a dialect provider
PostgreSqlDialect.Provider.UseJson = true;
```

Querying a complex type property throws a `NotSupportedException` that says how to enable it when the dialect doesn't
store complex types as JSON.

::: warning
`UseJson` changes how complex types are saved, existing rows saved as JSV need to be converted to JSON before they
can be queried.
:::

### Conditions on the items of a list

`Any()`, `All()` and `Count()` check each item of a list against a condition, which can use every property of the item
and the text functions of its properties, including lists of values:

```csharp
// The same item has the Sku and the Quantity, unlike x.Lines[0]
db.Select<Customer>(x => x.Lines.Any(l => l.Sku == sku && l.Quantity > 1));

db.Select<Customer>(x => x.Lines.Any(l => !l.Shipped && l.Quantity >= x.MinQuantity)); 
db.Select<Customer>(x => x.Tags.Any(t => t.StartsWith("vip")));
db.Select<Customer>(x => x.Lines.Count(l => l.Quantity > 10) >= 2);
```

They're a subquery of the list's items, `EXISTS (SELECT 1 FROM ... WHERE ...)`, using `json_each()` in SQLite,
`jsonb_path_query()` in PostgreSQL, `OPENJSON()` in SQL Server and `JSON_TABLE()` in MySQL 8.0.4+ and MariaDB 10.6+.
Values are sent as db params, so they can be used in compiled queries and connection filters too.

Rows without the list, or with an empty one, have no items, so they're matched by `All()` and not by `Any()`.

### PostgreSQL arrays

PostgreSQL stores arrays of strings and numbers, e.g. `string[]`, `int[]` and `long[]`, in its own array types instead
of JSON, e.g. `text[]`. They're queried the same way as lists, with PostgreSQL's array functions:

```csharp
db.Select<Article>(x => x.Tags.Contains("vip"));              // :0 = ANY("tags")
db.Select<Article>(x => x.Tags.Length > 2);                   // cardinality("tags") > :0
db.Select<Article>(x => x.Tags.Any(t => t.StartsWith("v")));  // SELECT 1 FROM unnest("tags")
db.Select<Article>(x => x.Scores.Count(s => s >= 90) >= 2);
```

### What isn't a JSON property

- **Properties of a joined table's type** refer to the columns of that table, e.g. `x.Customer.Name` in a query that
  joins `Customer` is its `Name` column
- **Types with their own converter**, e.g. PostgreSQL's `string[]` and `int[]` arrays and `hstore`, aren't stored as
  JSON. PostgreSQL's arrays are queried the same way as lists, see [PostgreSQL arrays](#postgresql-arrays)
- **Custom JSON serializers** aren't recognized, use `Sql.Json(x.Address).City` to query them

See [When to use Sql.Json](#when-to-use-sqljson) for the cases that need it.

## Querying JSON in string columns

JSON stored in a `string` column has no properties to query, so `Sql.Json<T>()` marks the column as a JSON document
with Data Model `T`. It translates normal C# member access into the native JSON functions of the configured database,
using the member type at the end of the expression to determine whether it should extract a scalar or a JSON fragment.

### Example model

The examples in this section and the explicit path APIs below use a JSON document with this C# Data Model, whose
`Customer` and `Address` types describe the order's document, not the tables above:

```csharp
public class OrderEvent
{
    public long Id { get; set; }

    // JSON stored and queried as text
    public string Data { get; set; }

    // A complex property serialized as JSON by OrmLite
    public OrderDocument Document { get; set; }
}

public class OrderDocument
{
    public Customer Customer { get; set; }
    public List<OrderLine> Lines { get; set; }
    public List<string> Tags { get; set; }
    public List<string> NullableTags { get; set; }
    public List<int> Numbers { get; set; }
    public decimal Total { get; set; }
}

public class Customer
{
    public Address Address { get; set; }
}

public class Address
{
    [DataMember(Name = "shipping_state")]
    public string State { get; set; }
}

public class OrderLine
{
    public string Sku { get; set; }
    public int Quantity { get; set; }
}
```

An example value for `Data` is:

```json
{
  "Customer": {
    "Address": {
      "shipping_state": "WA"
    }
  },
  "Lines": [
    { "Sku": "A-1", "Quantity": 2 }
  ],
  "Tags": ["priority", "paid"],
  "NullableTags": [null, "x"],
  "Numbers": [1, 2],
  "Total": 125.50
}
```

The `Data` column is populated with JSON by the application, whilst the `Document` complex property is serialized as
JSON by OrmLite when it [stores complex properties as JSON](#storing-complex-properties-as-json):

```csharp
var document = new OrderDocument
{
    Customer = new Customer {
        Address = new Address { State = "WA" }
    },
    Lines = [new OrderLine { Sku = "A-1", Quantity = 2 }],
    Tags = ["priority", "paid"],
    NullableTags = [null, "x"],
    Numbers = [1, 2],
    Total = 125.50m,
};

db.Insert(new OrderEvent {
    Data = document.ToJson(),
    Document = document,
});
```

### Query scalar properties

Nested C# member access becomes a nested JSON path:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Total >= 100m);
```

OrmLite translates scalar leaves such as `State` and `Total` using the provider's scalar JSON function, with the result
converted to the member's C# type.

The typed API honors `[DataMember(Name=...)]`. The `State` property in this example maps to the
`$.Customer.Address.shipping_state` JSON path.

### Query typed serialized columns

A complex property like `OrderEvent.Document` is [queried directly](#querying-complex-type-properties) when the
dialect stores complex types as JSON:

```csharp
var q = db.From<OrderEvent>()
    .Where(x => x.Document.Customer.Address.State == "WA");
```

`Sql.Json()` infers its document type from the property, for querying complex properties OrmLite can't tell are JSON,
e.g. on a dialect without `UseJson` or with a custom JSON serializer, see [When to use Sql.Json](#when-to-use-sqljson):

```csharp
var q = db.From<OrderEvent>()
    .Where(x => Sql.Json(x.Document).Customer.Address.State == "WA");
```

### Query arrays and collections

Array and list indexes become zero-based JSON array indexes:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Lines[0].Quantity >= 2);
```

Indexes can be non-negative integer constants or captured values:

```csharp
var index = 0;

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Lines[index].Sku == "A-1");
```

Collection `Contains()` tests scalar JSON array membership:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority") &&
        Sql.Json<OrderDocument>(x.Data).Numbers.Contains(1));
```

JSON types are significant: the JSON number `1` is different from the JSON string `"1"`.

Collection `Count` and array `Length` query JSON array length:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Lines.Count > 0);
```

Collection membership is scalar-only. For example, `Lines.Contains(orderLine)` is rejected because it would require
provider-specific object-containment semantics.

### Use scalar operations

Operations on an extracted scalar continue through OrmLite's normal expression translation. They are not mistaken for
additional JSON path members:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State.Length == 2);
```

This extracts the `State` string and then uses the provider's SQL string-length function.

### Select typed values and fragments

Selecting a scalar member extracts its C# value. Selecting an object or collection returns a JSON fragment which
OrmLite deserializes into the corresponding Data Model:

```csharp
public class OrderSummary
{
    public long Id { get; set; }
    public string State { get; set; }
    public decimal Total { get; set; }
    public Address Address { get; set; }
}

var q = db.From<OrderEvent>()
    .Select(x => new {
        x.Id,
        State = Sql.Json<OrderDocument>(x.Data).Customer.Address.State,
        Total = Sql.Json<OrderDocument>(x.Data).Total,
        Address = Sql.Json<OrderDocument>(x.Data).Customer.Address,
    });

var summaries = db.Select<OrderSummary>(q);
```

A single typed fragment can also be selected directly:

```csharp
var address = db.Scalar<Address>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address));
```

The `Sql.Json<T>()` wrapper only affects expression-tree translation. It does not change the database column or validate
the stored JSON.

## When to use Sql.Json

Complex type properties are [queried directly](#querying-complex-type-properties), so `Sql.Json()` isn't needed for
them. It's for JSON that OrmLite can't tell is JSON, or can't tell the shape of:

| JSON is in | Use |
|-|-|
| A complex type property, on a dialect with `UseJson` | The property: `x.Address.City` |
| A `string` column | `Sql.Json<T>(x.Data)` with the type of its document, see [Querying JSON in string columns](#querying-json-in-string-columns) |
| A complex type property, on a dialect without `UseJson` | `Sql.Json(x.Address)` |
| A property with the type of a table the query joins | `Sql.Json(x.Customer)` |

### JSON the dialect doesn't store

Querying a complex type property directly throws on a dialect that doesn't have `UseJson`, as its complex types
aren't saved as JSON. `Sql.Json()` isn't checked, so use it for a column you know has JSON, e.g. one that's saved with
a custom JSON serializer, or with a `[PgSqlJsonB]` attribute:

```csharp
var q = db.From<Customer>()
    .Where(x => Sql.Json(x.Address).City == "London");
```

### A property with the type of a joined table

In a query that joins a table, a property with that table's type refers to its columns, which is how OrmLite has
always resolved them. When the property is also stored as JSON, e.g. a copy of a row as it was at the time, use
`Sql.Json()` to query the copy:

```csharp
public class Invoice
{
    [AutoIncrement]
    public int Id { get; set; }
    public int CustomerId { get; set; }

    // A copy of the customer as they were when the invoice was created
    public Customer Customer { get; set; }
}

var q = db.From<Invoice>()
    .Join<Customer>((i, c) => i.CustomerId == c.Id)
    .Where(x => x.Customer.Name == "Alice Smith"            // Name column of joined Customer table
        && Sql.Json(x.Customer).Name == "Alice");           // Name in the invoice's copy
```

Without the join, `x.Customer.Name` is the JSON property like any other complex type.

### Paths chosen at runtime

Neither can query a path that's only known at runtime, or test whether a path exists or what type its value has. Use
the [explicit JSON path APIs](#explicit-json-path-queries) for those, e.g. `Sql.JsonValue<string>(x.Data, path)`.

## Explicit JSON path queries

Use the explicit path API when:

- the JSON shape does not have a C# Data Model;
- the path is selected at runtime;
- querying path existence or the JSON value type;
- querying a root document or root array; or
- using JSON document containment.

Paths begin with `$`. For portable queries, use the common subset supported by all providers: member access, quoted
member names and zero-based array indexes.

```text
$                                      root value
$.Customer                             member
$.Customer.Address.shipping_state      nested member
$[0]                                   root array index
$.Lines[0].Quantity                    nested array index
```

For a property requiring quoting, the portable form is `$."property-name"`. Typed paths generate this quoting
automatically.

Paths should normally be string literals or captured string values:

```csharp
var path = "$.Customer.Address.shipping_state";

var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonValue<string>(x.Data, path) == "WA");
```

Query values and containment candidates are database parameters. JSON paths are emitted as escaped SQL string literals
appropriate for the selected dialect.

### Extract a scalar explicitly

The explicit equivalent of typed scalar member access is `Sql.JsonValue<T>()`:

```csharp
// Preferred when OrderDocument is available
Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA"

// Flexible path-based equivalent
Sql.JsonValue<string>(x.Data,
    "$.Customer.Address.shipping_state") == "WA"
```

It can be used in filters, projections and ordering:

```csharp
var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonValue<decimal?>(x.Data, "$.Total") >= 100m)
    .OrderByDescending(x => Sql.JsonValue<decimal?>(x.Data, "$.Total"));
```

`JsonValue<T>()` returns SQL `NULL` when the path is missing, contains JSON `null`, or identifies an object or array.
Use a nullable C# type when a scalar is optional. The non-generic overload returns a `string`.

### Extract an object or array explicitly

Prefer a typed selection when the document shape is known:

```csharp
var address = db.Scalar<Address>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address));
```

The `Sql.JsonQuery<T>()` equivalent accepts an explicit path:

```csharp
var address = db.Scalar<Address>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonQuery<Address>(x.Data,
        "$.Customer.Address")));
```

It can return the root document when the path is omitted:

```csharp
var document = db.Scalar<OrderDocument>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonQuery<OrderDocument>(x.Data)));
```

`JsonQuery<T>()` returns SQL `NULL` when the path is missing or identifies a scalar value.

## Validate JSON

`Sql.IsJson()` tests whether a string contains a valid JSON value. Validation has no typed equivalent because
`Sql.Json<T>()` describes the expected shape without validating the stored document:

```csharp
var validJsonRows = db.Count<OrderEvent>(x => Sql.IsJson(x.Data) == true);
```

Its return type is `bool?`, as a SQL `NULL` input can produce a SQL `NULL` result. Comparing it with `true` excludes both
invalid and `NULL` values.

::: warning
JSON extraction functions can report an RDBMS error when given malformed JSON. Validate JSON when it is written or use
a database constraint where possible. Do not rely on `Sql.IsJson(x.Data) && ...` to protect another JSON operation from
malformed data, as an RDBMS is free to evaluate predicates in a different order.
:::

## Test whether a path exists

`Sql.JsonExists()` tests whether an explicit path identifies any JSON value:

```csharp
var withTags = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonExists(x.Data, "$.Tags")));
```

JSON `null` is an existing value, making it possible to distinguish a present `null` from a missing member:

```csharp
// true when the first element exists, even when it is JSON null
Sql.JsonExists(x.Data, "$.NullableTags[0]")

// false when the member is absent
Sql.JsonExists(x.Data, "$.Missing")
```

## Read a JSON value's type

`Sql.JsonType()` returns a normalized `JsonValueType?` independent of the provider's native type names:

```csharp
var type = db.Scalar<JsonValueType?>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonType(x.Data, "$.Customer.Address")));

// JsonValueType.Object
```

The normalized values are:

```csharp
public enum JsonValueType
{
    Null,
    String,
    Number,
    Boolean,
    Array,
    Object,
}
```

The root value can be inspected by omitting the path:

```csharp
var rootType = db.Scalar<JsonValueType?>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonType(x.Data)));
```

`JsonValueType.Null` identifies JSON `null`; C# `null` identifies a missing path or SQL `NULL`.

::: info
On SQL Server, `Sql.JsonType()` requires a literal or captured single-value JSON path. Dynamic paths sourced from a
table column and wildcard paths are not supported.
:::

## Explicit JSON array queries

Typed collection operations are preferred when the document has a C# Data Model:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Lines.Count > 0 &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority"));
```

The explicit equivalents are useful for dynamic paths or untyped documents.

### Array length

```csharp
var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonArrayLength(x.Data, "$.Lines") > 0);
```

The root-array overload omits the path:

```csharp
Sql.JsonArrayLength(x.Data)
```

Its return type is `int?`; a missing path or non-array value returns SQL `NULL`.

### Scalar array membership

```csharp
var priorityOrders = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonArrayContains(x.Data, "$.Tags", "priority")));

var containsOne = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonArrayContains(x.Data, "$.Numbers", 1)));
```

To search for JSON `null`, specify the generic type because C# cannot infer a type from a `null` argument:

```csharp
var withNull = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonArrayContains<string>(
        x.Data, "$.NullableTags", null)));
```

The root-array overload omits the path:

```csharp
Sql.JsonArrayContains(x.Data, "priority")
```

This API accepts scalar values only. Use `Sql.JsonContains()` when testing document or array containment.

## JSON document containment

PostgreSQL and MySQL support testing whether one JSON document contains another with `Sql.JsonContains()`. This operation
does not have a typed member-access equivalent because its candidate is itself a partial JSON document:

```csharp
var candidate = new {
    Customer = new {
        Address = new { shipping_state = "WA" }
    }
};

var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonContains(x.Data, candidate));
```

Containment can start at a nested path:

```csharp
var requiredTags = new[] { "priority" };

var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonContains(x.Data, requiredTags, "$.Tags"));
```

The candidate must be a constant or captured value. OrmLite serializes it as JSON and sends it as a database parameter.
A candidate cannot be another table column or expression.

::: info
`Sql.JsonContains()` is supported by PostgreSQL and MySQL. SQLite and SQL Server throw `NotSupportedException` because
they do not provide an equivalent native containment operation with the same semantics in the targeted versions.
:::

## Null and missing-value behavior

The portable API keeps JSON `null`, missing paths and SQL `NULL` distinguishable where the databases allow it:

| Expression | JSON `null` | Missing path | Object or array |
| --- | --- | --- | --- |
| `JsonExists()` | `true` | `false` | `true` |
| `JsonType()` | `JsonValueType.Null` | `null` | `Object` or `Array` |
| `JsonValue<T>()` | SQL `NULL` | SQL `NULL` | SQL `NULL` |
| `JsonQuery<T>()` | SQL `NULL` | SQL `NULL` | JSON fragment |
| `JsonArrayLength()` | SQL `NULL` | SQL `NULL` | Count for arrays; `NULL` for objects |

Use `JsonExists()` together with `JsonType()` when an application needs to distinguish a missing property from an
explicit JSON `null`.

## API reference

Complex type properties stored as JSON are queried directly, e.g. `x.Document.Lines.Count`. For JSON in `string`
columns, typed expressions are preferred when a corresponding Data Model is available:

| Task | Preferred typed expression | Explicit path API |
| --- | --- | --- |
| Read scalar | `Sql.Json<T>(json).Member` | `Sql.JsonValue<TValue>(json, path)` |
| Read object or array | `Sql.Json<T>(json).Member` | `Sql.JsonQuery<TValue>(json[, path])` |
| Array length | `Sql.Json<T>(json).Items.Count` | `Sql.JsonArrayLength(json[, path])` |
| Scalar array membership | `Sql.Json<T>(json).Items.Contains(value)` | `Sql.JsonArrayContains(json[, path], value)` |
| Array indexing | `Sql.Json<T>(json).Items[index]` | Include `[index]` in the path |
| Validate JSON | - | `Sql.IsJson(json)` |
| Path exists | - | `Sql.JsonExists(json, path)` |
| Read JSON type | - | `Sql.JsonType(json[, path])` |
| Document containment | - | `Sql.JsonContains(json, candidate[, path])` |

The providers translate these APIs to their native functions:

| Operation | SQLite | PostgreSQL | SQL Server | MySQL |
| --- | --- | --- | --- | --- |
| Validate | `json_valid` | `IS JSON` | `ISJSON` | `JSON_VALID` |
| Scalar value | `json_extract` | `jsonb_path_query_first` | `JSON_VALUE` | `JSON_EXTRACT` |
| Object/array | `json_extract` | `jsonb_path_query_first` | `JSON_QUERY` | `JSON_EXTRACT` |
| Exists | `json_type` | `jsonb_path_exists` | `JSON_PATH_EXISTS` | `JSON_CONTAINS_PATH` |
| Type | `json_type` | `jsonb_typeof` | `OPENJSON` | `JSON_TYPE` |
| Array length | `json_array_length` | `jsonb_array_length` | `OPENJSON` | `JSON_LENGTH` |
| Array membership | `json_each` | `jsonb` containment | `OPENJSON` | `JSON_CONTAINS` |
| Document containment | - | `@>` | - | `JSON_CONTAINS` |

## Inspect generated SQL

JSON expressions remain normal `SqlExpression<T>` instances, so generated SQL and parameters can be inspected in the
usual way:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority"));

var sql = q.ToSelectStatement();
var parameters = q.Params;
```

JSON expressions can also be reused with OrmLite's async APIs:

```csharp
var results = await db.SelectAsync(q);
```

### Index a JSON property

Queries of JSON properties read the JSON of every row. When a property is queried often on a large table, e.g. to
find customers by `x.Address.City`, store it in a column of its own, which is indexed with `[Index]` and works
the same way in every database:

```csharp
public class Customer
{
    [Index]
    public string City { get; set; }
    public Address Address { get; set; }
}
```

SQLite and PostgreSQL can also index the expression a query reads the property with, which you can create in a
[migration](/ormlite/db-migrations). The index's expression needs to be the same as the query's, so copy it from the
SQL of the query, e.g. the left side of `= @0`:

```csharp
var q = db.From<Customer>().Where(x => x.Address.City == "London");
var sql = q.ToSelectStatement();
// ... WHERE (CASE WHEN json_type("Address", '$.City') NOT IN ('object','array','null')
//           THEN json_extract("Address", '$.City') END = @0)

Db.ExecuteSql("""
    CREATE INDEX ix_customer_city ON "Customer" ((CASE WHEN json_type("Address", '$.City')
        NOT IN ('object','array','null') THEN json_extract("Address", '$.City') END))
    """);
```

Check the index is used with `EXPLAIN QUERY PLAN` on SQLite or `EXPLAIN` on PostgreSQL. It's only used while the
query's SQL stays the same, so check it again after upgrading OrmLite. SQL Server and MySQL can only index an
expression through a computed or generated column of the same type, so a column of its own is the better choice for
them.
