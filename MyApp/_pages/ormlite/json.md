---
title: JSON Support
---

OrmLite provides a portable, typed API for querying JSON stored in SQLite, PostgreSQL, SQL Server and MySQL.
JSON expressions are exposed from the `Sql.*` class and compose with normal `SqlExpression<T>` queries, so JSON
properties can be filtered, selected and ordered without embedding provider-specific SQL.

When the shape of a JSON document is known, the preferred API is `Sql.Json<T>()`. It translates normal C# member access
into the native JSON functions of the configured database:

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

| Database | Recommended version | Notes |
| --- | --- | --- |
| SQLite | Current SQLite with JSON functions | Uses SQLite's built-in `json_*` functions |
| PostgreSQL | PostgreSQL 16+ | `Sql.IsJson()` uses `IS JSON`; other operations use `jsonb` and SQL/JSON paths |
| SQL Server | SQL Server 2022+ | `Sql.JsonExists()` and full JSON-value validation require SQL Server 2022 |
| MySQL | MySQL 8.0+ | Uses MySQL's native `JSON_*` functions |

All APIs on this page are supported by all four providers except `Sql.JsonContains()`, which is supported by PostgreSQL
and MySQL. Calling an unsupported operation throws `NotSupportedException` whilst building the SQL expression instead
of generating SQL with different semantics.

::: info
SQL Server 2016-2019 can use `Sql.JsonValue()`, `Sql.JsonQuery()`, `Sql.JsonType()`, `Sql.JsonArrayLength()` and
`Sql.JsonArrayContains()`. On these versions `Sql.IsJson()` retains SQL Server's object-or-array validation semantics,
and `Sql.JsonExists()` is unavailable. Use `SqlServer2022Dialect.Provider` when the complete portable API is required.
:::

## Example model

The examples below use a JSON document with this C# Data Model:

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

### Storing complex properties as JSON

No serializer configuration is needed when an application populates a `string` column with JSON itself. When OrmLite
stores a complex property such as `OrderEvent.Document`, its dialect must serialize complex types as JSON.

The current fluent configuration enables JSON serialization by default for SQLite, PostgreSQL, SQL Server and MySQL:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString));
// options.UsePostgres(connectionString)
// options.UseSqlServer(connectionString)
// options.UseMySql(connectionString)
```

It can also be enabled explicitly:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString, dialect => {
    dialect.UseJson = true;
}));
```

With JSON serialization enabled, both string and typed documents can be inserted normally:

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

## Type-safe JSON queries

`Sql.Json<T>()` marks a column as a JSON document with Data Model `T`. OrmLite uses the member type at the end of the
expression to determine whether it should extract a scalar or a JSON fragment.

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

When the column is already declared with a C# Data Model, its document type is inferred:

```csharp
var q = db.From<OrderEvent>()
    .Where(x => Sql.Json(x.Document).Customer.Address.State == "WA");
```

This requires the property to be stored with a JSON complex-type serializer, as described in
[Storing complex properties as JSON](#storing-complex-properties-as-json).

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

Typed expressions are preferred when a corresponding Data Model is available:

| Task | Preferred typed expression | Explicit path API |
| --- | --- | --- |
| Read scalar | `Sql.Json<T>(json).Member` | `Sql.JsonValue<TValue>(json, path)` |
| Read object or array | `Sql.Json<T>(json).Member` | `Sql.JsonQuery<TValue>(json[, path])` |
| Array length | `Sql.Json<T>(json).Items.Count` | `Sql.JsonArrayLength(json[, path])` |
| Scalar array membership | `Sql.Json<T>(json).Items.Contains(value)` | `Sql.JsonArrayContains(json[, path], value)` |
| Array indexing | `Sql.Json<T>(json).Items[index]` | Include `[index]` in the path |
| Validate JSON | — | `Sql.IsJson(json)` |
| Path exists | — | `Sql.JsonExists(json, path)` |
| Read JSON type | — | `Sql.JsonType(json[, path])` |
| Document containment | — | `Sql.JsonContains(json, candidate[, path])` |

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
| Document containment | — | `@>` | — | `JSON_CONTAINS` |

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

This is useful when deciding whether a frequently queried JSON property should be exposed through a generated column,
expression index or provider-specific JSON index. Indexing facilities remain outside the portable API because their
definitions and query-planner behavior differ substantially between databases.

JSON expressions can also be reused with OrmLite's async APIs:

```csharp
var results = await db.SelectAsync(q);
```
