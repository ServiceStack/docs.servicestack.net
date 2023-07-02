---
title: Custom SQL
---

OrmLite's Expression support satisfies the most common RDBMS queries with a strong-typed API.
For more complex queries you can easily fall back to raw SQL where the Custom SQL APIs
let you map custom SqlExpressions into different responses:

```csharp
var q = db.From<Person>()
          .Where(x => x.Age < 50)
          .Select("*");
List<Person> results = db.SqlList<Person>(q);

List<Person> results = db.SqlList<Person>(
    "SELECT * FROM Person WHERE Age < @age", new { age=50});

List<string> results = db.SqlColumn<string>(db.From<Person>().Select(x => x.LastName));
List<string> results = db.SqlColumn<string>("SELECT LastName FROM Person");

HashSet<int> results = db.ColumnDistinct<int>(db.From<Person>().Select(x => x.Age));
HashSet<int> results = db.ColumnDistinct<int>("SELECT Age FROM Person");

var q = db.From<Person>()
          .Where(x => x.Age < 50)
          .Select(Sql.Count("*"));
int result = db.SqlScalar<int>(q);
int result = db.SqlScalar<int>("SELECT COUNT(*) FROM Person WHERE Age < 50");
```

## Custom SQL with Typed SqlExpression

Using a typed SQL Expression with a mix of typed an custom SQL Expressions:

```csharp
var q = db.From<Person>();
q.Where("Age < {0}", 50);
List<Person> results = db.Select(q)

var q = db.From<Person>().Where("Age < {0}", 50);
string sql = q.ToSelectStatement();
List<Person> results = db.Select(sql, q.Params);
```

:::tip
If your custom SQL Expression fails because it contains raw SQL with comments or write commands you can use `Unsafe*` APIs to by-pass SQL Validation, e.g. `q.UnsafeWhere(rawSql)`
:::

## Custom Selects

```csharp
public record CustomPoco(int Year, string Max);

var upperNamesWithA = db.SqlColumn<string>(
    "SELECT upper(Name) FROM Track WHERE instr(Name,'a') > 0");

var meta = db.SqlList<CustomPoco>(
    "SELECT DISTINCT Year % 10 as Year, hex(Year % 10) as Hex FROM Track");

db.ExecuteSql("ALTER TABLE Track ADD Rand INT default 0");
db.ExecuteSql("UPDATE Track SET Rand = abs(random()) % 1000");

var trackRandValues = db.Dictionary<string,int>("SELECT Name, Rand FROM Track");

var maxRand = db.SqlScalar<int>("SELECT MAX(Rand) FROM Track");
```

## Custom Insert and Updates

```csharp
Db.ExecuteSql("INSERT INTO page_stats (ref_id, fav_count) VALUES (@refId, @favCount)",
              new { refId, favCount })

//Async:
Db.ExecuteSqlAsync("UPDATE page_stats SET view_count = view_count + 1 WHERE id = @id", new { id })
```

## INSERT INTO SELECT

You can use OrmLite's Typed `SqlExpression` to create a subselect expression that you can use to create and execute a
typed **INSERT INTO SELECT** `SqlExpression` with:

```csharp
var q = db.From<User>()
    .Where(x => x.UserName == "UserName")
    .Select(x => new {
        x.UserName, 
        x.Email, 
        GivenName = x.FirstName, 
        Surname = x.LastName, 
        FullName = x.FirstName + " " + x.LastName
    });

var id = db.InsertIntoSelect<CustomUser>(q)
```

## Foreign Key attribute for referential actions on Update/Deletes

Creating a foreign key in OrmLite can be done by adding `[References(typeof(ForeignKeyTable))]` on the relation property,
which will result in OrmLite creating the Foreign Key relationship when it creates the DB table with `db.CreateTable<Poco>`.

Additional fine-grain options and behaviour are available in the `[ForeignKey]` attribute which will let you specify the desired behaviour when deleting or updating related rows in Foreign Key tables.

An example of a table with the different available options:

```csharp
public class TableWithAllCascadeOptions
{
	[AutoIncrement] public int Id { get; set; }
	
	[References(typeof(ForeignKeyTable1))]
	public int SimpleForeignKey { get; set; }
	
	[ForeignKey(typeof(ForeignKeyTable2), OnDelete = "CASCADE", OnUpdate = "CASCADE")]
	public int? CascadeOnUpdateOrDelete { get; set; }
	
	[ForeignKey(typeof(ForeignKeyTable3), OnDelete = "NO ACTION")]
	public int? NoActionOnCascade { get; set; }
	
	[Default(typeof(int), "17")]
	[ForeignKey(typeof(ForeignKeyTable4), OnDelete = "SET DEFAULT")]
	public int SetToDefaultValueOnDelete { get; set; }
	
	[ForeignKey(typeof(ForeignKeyTable5), OnDelete = "SET NULL")]
	public int? SetToNullOnDelete { get; set; }
}
```

## System Variables and Default Values

To provide richer support for non-standard default values, each RDBMS Dialect Provider contains a
`OrmLiteDialectProvider.Variables` placeholder dictionary for storing common, but non-standard RDBMS functionality.
We can use this to define non-standard default values, in a declarative way, that works across all supported RDBMS's
like automatically populating a column with the RDBMS UTC Date when Inserted with a `default(T)` Value:

```csharp
public class Poco
{
    [Default(OrmLiteVariables.SystemUtc)]  //= {SYSTEM_UTC}
    public DateTime CreatedTimeUtc { get; set; }
}
```

OrmLite variables need to be surrounded with `{}` braces to identify that it's a placeholder variable, e.g `{SYSTEM_UTC}`.

The [ForeignKeyTests](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/ForeignKeyAttributeTests.cs)
show the resulting behaviour with each of these configurations in more detail.

::: info
Note: Only supported on RDBMS's with foreign key/referential action support, e.g.
[Sql Server](http://msdn.microsoft.com/en-us/library/ms174979.aspx),
[PostgreSQL](http://www.postgresql.org/docs/9.1/static/ddl-constraints.html),
[MySQL](http://dev.mysql.com/doc/refman/5.5/en/innodb-foreign-key-constraints.html). Otherwise they're ignored.
:::


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
