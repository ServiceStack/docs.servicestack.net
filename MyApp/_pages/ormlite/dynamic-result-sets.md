---
title: Dynamic Result Sets
---

In addition to populating Typed POCOs, OrmLite has a number of flexible options for accessing dynamic resultsets with adhoc schemas:

## Dynamic Results Examples

```csharp

var aggregates = db.Select<List<object>>(
    db.From<Track>().Select("COUNT(*), MIN(Year), MAX(Year)")).First();

var keyValuePairs = db.Select<Dictionary<string, object>>(
    db.From<Track>().Select("COUNT(*) Total, MIN(Year) Min, MAX(Year)")).First();

var q = db.From<Track>().Select("COUNT(*) Total, MIN(Year) Min, MAX(Year) Max");

var customPoco = db.Select<Poco>(q).First();

var dynamicResult = db.Select<dynamic>(q).First();
long total = dynamicResult.Total;
long min = dynamicResult.Min;
long max = dynamicResult.Max;

var artistsWithTracksFrom93 = db.SelectMulti<Track,Artist>(db.From<Track>()
      .Join<Artist>()
      .Where(x => x.Year == 1993));

$"\nArtists with Tracks from 1993:".Print();
foreach (var tuple in artistsWithTracksFrom93)
{
    $"\nTrack/Artist: {new {track=tuple.Item1, artist=tuple.Item2}.Dump()}".Print();
}
```

## C# 7 Value Tuples

The C# 7 Value Tuple support enables a terse, clean and typed API for accessing the Dynamic Result Sets returned when using a custom Select expression:

```csharp
var query = db.From<Employee>()
    .Join<Department>()
    .OrderBy(e => e.Id)
    .Select<Employee, Department>(
        (e, d) => new { e.Id, e.LastName, d.Name });
 
var results = db.Select<(int id, string lastName, string deptName)>(query);
 
var row = results[i];
$"row: ${row.id}, ${row.lastName}, ${row.deptName}".Print();
```

Full Custom SQL Example:

```csharp
var results = db.SqlList<(int count, string min, string max, int sum)>(
    "SELECT COUNT(*), MIN(Word), MAX(Word), Sum(Total) FROM Table");
```

Partial Custom SQL Select Example:

```csharp
var query = db.From<Table>()
    .Select("COUNT(*), MIN(Word), MAX(Word), Sum(Total)");
 
var result = db.Single<(int count, string min, string max, int sum)>(query);
```

Same as above, but using Typed APIs:

```csharp
var result = db.Single<(int count, string min, string max, int sum)>(
    db.From<Table>()
        .Select(x => new {
            Count = Sql.Count("*"),
            Min = Sql.Min(x.Word),
            Max = Sql.Max(x.Word),
            Sum = Sql.Sum(x.Total)
        }));
```

There's also support for returning unstructured resultsets in `List<object>`, e.g:

```csharp
var results = db.Select<List<object>>(db.From<Poco>()
  .Select("COUNT(*), MIN(Id), MAX(Id)"));

results[0].PrintDump();
```

Output of objects in the returned `List<object>`:

```
[
    10,
    1,
    10
]
```

You can also Select `Dictionary<string,object>` to return a dictionary of column names mapped with their values, e.g:

```csharp
var results = db.Select<Dictionary<string,object>>(db.From<Poco>()
  .Select("COUNT(*) Total, MIN(Id) MinId, MAX(Id) MaxId"));

results[0].PrintDump();
```

Output of objects in the returned `Dictionary<string,object>`:

```
{
    Total: 10,
    MinId: 1,
    MaxId: 10
}
```

and can be used for API's returning a **Single** row result:

```csharp
var result = db.Single<List<object>>(db.From<Poco>()
  .Select("COUNT(*) Total, MIN(Id) MinId, MAX(Id) MaxId"));
```

or use `object` to fetch an unknown **Scalar** value:

```csharp
object result = db.Scalar<object>(db.From<Poco>().Select(x => x.Id));
```

## Selecting from multiple tables

You can also select data from multiple tables into
[dynamic result sets](dynamic-result-sets)
which provide [several Convenience APIs](http://stackoverflow.com/a/37443162/85785)
for accessing data from an unstructured queries.

Using dynamic:

```csharp
var q = db.From<Employee>()
    .Join<Department>()
    .Select<Employee, Department>((e, d) => new { e.FirstName, d.Name });
    
List<dynamic> results = db.Select<dynamic>(q);
foreach (dynamic result in results)
{
    string firstName = result.FirstName;
    string deptName = result.Name;
}
```

Dictionary of Objects:

```csharp
List<Dictionary<string,object>> rows = db.Select<Dictionary<string,object>>(q);
```

List of Objects:

```csharp
List<List<object>> rows = db.Select<Dictionary<string,object>>(q);
```

Custom Key/Value Dictionary:

```csharp
Dictionary<string,string> rows = db.Dictionary<string,string>(q);
```
