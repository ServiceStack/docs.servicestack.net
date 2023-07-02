---
title: PostgreSQL Features
---

## PostgreSQL Rich Data Types

The `[PgSql*]` specific attributes lets you use attributes to define PostgreSQL rich data types, e.g:

```csharp
public class MyPostgreSqlTable
{
    [PgSqlJson]
    public List<Poco> AsJson { get; set; }

    [PgSqlJsonB]
    public List<Poco> AsJsonB { get; set; }

    [PgSqlTextArray]
    public string[] AsTextArray { get; set; }

    [PgSqlIntArray]
    public int[] AsIntArray { get; set; }

    [PgSqlBigIntArray]
    public long[] AsLongArray { get; set; }
}
```

By default, all arrays of .NET's built-in **numeric**, **string** and **DateTime** types will be stored in PostgreSQL array types:

```csharp
public class Table
{
    public Guid Id { get; set; }

    public int[] Ints { get; set; }
    public long[] Longs { get; set; }
    public float[] Floats { get; set; }
    public double[] Doubles { get; set; }
    public decimal[] Decimals { get; set; }
    public string[] Strings { get; set; }
    public DateTime[] DateTimes { get; set; }
    public DateTimeOffset[] DateTimeOffsets { get; set; }
}
```

You can opt in to annotate other collections like `List<T>` to also be stored in array types by annotating them with `[Pgsql*]` attributes, e.g:

```csharp
public class Table
{
    public Guid Id { get; set; }

    [PgSqlIntArray]
    public List<int> ListInts { get; set; }
    [PgSqlBigIntArray]
    public List<long> ListLongs { get; set; }
    [PgSqlFloatArray]
    public List<float> ListFloats { get; set; }
    [PgSqlDoubleArray]
    public List<double> ListDoubles { get; set; }
    [PgSqlDecimalArray]
    public List<decimal> ListDecimals { get; set; }
    [PgSqlTextArray]
    public List<string> ListStrings { get; set; }
    [PgSqlTimestamp]
    public List<DateTime> ListDateTimes { get; set; }
    [PgSqlTimestampTz]
    public List<DateTimeOffset> ListDateTimeOffsets { get; set; }
}
```

Alternatively if you **always** want `List<T>` stored in Array types, you can register them in the `PostgreSqlDialect.Provider`:

```csharp
PostgreSqlDialect.Provider.RegisterConverter<List<string>>(new PostgreSqlStringArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<int>>(new PostgreSqlIntArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<long>>(new PostgreSqlLongArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<float>>(new PostgreSqlFloatArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<double>>(new PostgreSqlDoubleArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<decimal>>(new PostgreSqlDecimalArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<DateTime>>(new PostgreSqlDateTimeTimeStampArrayConverter());
PostgreSqlDialect.Provider.RegisterConverter<List<DateTimeOffset>>(new PostgreSqlDateTimeOffsetTimeStampTzArrayConverter());
```

## PostgreSQL Params

The `PgSql.Param()` API provides a resolve the correct populated `NpgsqlParameter` and `NpgsqlDbType` from a C# Type
which can be used to query custom PostgreSQL Data Types in APIs that accept `IDbDataParameter` parameters, e.g:

```csharp
public class FunctionResult
{
    public int[] Val { get; set; }
}

var p = PgSql.Param("paramValue", testVal);
var sql = "SELECT * FROM my_func(@paramValue)";
var rows = db.Select<FunctionResult>(sql, new [] { p });
```

## Hstore support

To use `hstore`, its extension needs to be enabled in your PostgreSQL RDBMS by running:

```
CREATE EXTENSION hstore;
```

Which can then be enabled in OrmLite with:

```csharp
PostgreSqlDialect.Instance.UseHstore = true;
```

Where it will now store **string Dictionaries** in `Hstore` columns:

```csharp
public class TableHstore
{
    public int Id { get; set; }

    public Dictionary<string,string> Dictionary { get; set; }
    public IDictionary<string,string> IDictionary { get; set; }
}

db.DropAndCreateTable<TableHstore>();

db.Insert(new TableHstore
{
    Id = 1,
    Dictionary = new Dictionary<string, string> { {"A", "1"} },
    IDictionary = new Dictionary<string, string> { {"B", "2"} },
});
```

Where they can than be queried in postgres using [Hstore SQL Syntax](https://www.postgresql.org/docs/9.0/hstore.html):

```csharp
db.Single(db.From<PostgreSqlTypes>().Where("dictionary -> 'A' = '1'")).Id //= 1
```

Thanks to [@cthames](https://forums.servicestack.net/users/cthames/activity) for this feature.

## JSON data types

If you instead wanted to store arbitrary complex types in PostgreSQL's rich column types to enable deep querying in postgres,
you'd instead annotate them with `[PgSqlJson]` or `[PgSqlJsonB]`, e.g:

```csharp
public class TableJson
{
    public int Id { get; set; }

    [PgSqlJson]
    public ComplexType ComplexTypeJson { get; set; }

    [PgSqlJsonB]
    public ComplexType ComplexTypeJsonb { get; set; }
}

db.Insert(new TableJson
{
    Id = 1,
    ComplexTypeJson = new ComplexType {
        Id = 2, SubType = new SubType { Name = "JSON" }
    },
    ComplexTypeJsonb = new ComplexType {
        Id = 3, SubType = new SubType { Name = "JSONB" }
    },
});
```

Where they can then be queried on the server with [JSON SQL Syntax and functions](https://www.postgresql.org/docs/9.3/functions-json.html):

```csharp
var result = db.Single<TableJson>("table_json->'SubType'->>'Name' = 'JSON'");
```

## Custom SQL using PostgreSQL Arrays

The `PgSql.Array()` provides a typed API for generating [PostgreSQL Array Expressions](https://www.postgresql.org/docs/current/arrays.html), e.g:

```csharp
PgSql.Array(1,2,3)     //= ARRAY[1,2,3]
var strings = new[]{ "A","B","C" };
PgSql.Array(strings)   //= ARRAY['A','B','C']
```

Which you can safely use in Custom SQL Expressions that use PostgreSQL's native ARRAY support:

```csharp
q.And($"{PgSql.Array(anyTechnologyIds)} && technology_ids")
q.And($"{PgSql.Array(labelSlugs)} && labels");
```

If you want and empty collection to return `null` instead of an empty `ARRAY[]` you can use the `nullIfEmpty` overload:

```csharp
PgSql.Array(new string[0], nullIfEmpty:true)      //= null
PgSql.Array(new[]{"A","B","C"}, nullIfEmpty:true) //= ARRAY['A','B','C']
```
