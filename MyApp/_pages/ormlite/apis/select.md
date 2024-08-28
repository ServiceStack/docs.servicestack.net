---
title: OrmLite SELECT APIs
---

OrmLite has extensive support for Querying exposing an intuitive 1:1 Typed API that maps cleanly and has a high affinity with SQL that's not only natural to write and easy to predict what SQL it generates.

OrmLite provides terse and intuitive typed APIs for database querying from simple lambda expressions to more complex LINQ-Like Typed SQL Expressions which 
you can use to construct more complex queries. To give you a flavour here are some examples:


## Querying with SELECT

```csharp
int agesAgo = DateTime.Today.AddYears(-20).Year;
db.Select<Author>(x => x.Birthday >= new DateTime(agesAgo, 1, 1) 
                    && x.Birthday <= new DateTime(agesAgo, 12, 31));
```

```csharp
db.Select<Author>(x => Sql.In(x.City, "London", "Madrid", "Berlin"));
```

```csharp
db.Select<Author>(x => x.Earnings <= 50);
```

```csharp
db.Select<Author>(x => x.Name.StartsWith("A"));
```

```csharp
db.Select<Author>(x => x.Name.EndsWith("garzon"));
```

```csharp
db.Select<Author>(x => x.Name.Contains("Benedict"));
```

```csharp
db.Select<Author>(x => x.Rate == 10 && x.City == "Mexico");
```

```csharp
db.Select<Author>(x => x.Rate.ToString() == "10"); //impicit string casting
```

```csharp
db.Select<Author>(x => "Rate " + x.Rate == "Rate 10"); //server string concatenation
```

## Convenient data access patterns

OrmLite also includes a number of convenient APIs providing DRY, typed data access for common queries:

The `SingleById<T>` uses the provided value to query against a primary key, expecting 1 result.

```csharp
Person person = db.SingleById<Person>(1);
```

Lambda expressions can be provided to `Single` as a way to return the first instance from the result set.

```csharp
Person person = db.Single<Person>(x => x.Age == 42);
```

## Using Typed SqlExpression

The `From<T>` can be used to create an `SqlExpression<T>` query to build on and use later. 

```csharp
var q = db.From<Person>()
          .Where(x => x.Age > 40)
          .Select(Sql.Count("*"));

int peopleOver40 = db.Scalar<int>(q);
```

Common aggregate methods can be used with type safety. For example:

```csharp
int peopleUnder50 = db.Count<Person>(x => x.Age < 50);
```

```csharp
bool has42YearOlds = db.Exists<Person>(new { Age = 42 });
```

```csharp
int maxAgeUnder50 = db.Scalar<Person, int>(x => Sql.Max(x.Age), x => x.Age < 50);
```

Returning a single column from a query can be used with `.Select` of a property and `.Column`.

```csharp
var q = db.From<Person>()
    .Where(x => x.Age == 27)
    .Select(x => x.LastName);
    
List<string> results = db.Column<string>(q);
```

```csharp
var q = db.From<Person>()
          .Where(x => x.Age < 50)
          .Select(x => x.Age);

HashSet<int> results = db.ColumnDistinct<int>(q);
```

Multiple columns can do the same. For example using the same `.Select` on a `SqlExpression<T>` with an anonymous type, returning a Dictionary of matching types. 

```csharp
var q = db.From<Person>()
          .Where(x => x.Age < 50)
          .Select(x => new { x.Id, x.LastName });

Dictionary<int,string> results = db.Dictionary<int, string>(q);
```

The `Lookup<T,K>` method returns a `Dictionary<K,List<V>>` grouping made from the first two columns using n SQL Expression.

```csharp
var q = db.From<Person>()
          .Where(x => x.Age < 50)
          .Select(x => new { x.Age, x.LastName });

Dictionary<int, List<string>> results = db.Lookup<int, string>(q);
```

The `db.KeyValuePair<K,V>` API is similar to `db.Dictionary<K,V>` where it uses the **first 2 columns** for its Key/Value Pairs to
create a Dictionary but is more appropriate when the results can contain duplicate Keys or when ordering needs to be preserved:

```csharp
var q = db.From<StatsLog>()
    .GroupBy(x => x.Name)
    .Select(x => new { x.Name, Count = Sql.Count("*") })
    .OrderByDescending("Count");

var results = db.KeyValuePairs<string, int>(q);
```

## Lambda Expression examples

For simple queries you can use terse lambda Expressions to specify the filter conditions you want:

```csharp
var nirvana = db.Select<Artist>(x => x.Name == "Nirvana").First();

var nirvanaTracks = db.Select<Track>(x => x.ArtistId == nirvana.Id);

var nirvanaTrackIds = nirvanaTracks.Map(x => x.Id); // Convenience Extension method

//Using SQL IN by .NET Collection `Contains()` or explicit `Sql.In()`
var nirvanaTracksByIn = db.Select<Track>(x => nirvanaTrackIds.Contains(x.Id));
var nirvanaTracksByInAlt = db.Select<Track>(x => Sql.In(x.Id, nirvanaTrackIds));

var pearlJam = db.Select<Artist>(x => x.Name.StartsWith("Pearl")).First();

var faithNoMore = db.Select<Artist>(x => x.Name.EndsWith("More")).First();

var smellsLikeTeenSpirit = db.Select<Track>(x => x.Name.Contains("Teen")).First();

var latestTracks = db.Select<Track>(x => x.Year >= 1997);

var heartShapedBox = db.Select<Track>(x => x.ArtistId == nirvana.Id 
	&& x.Year == 1993 && x.Album == "In Utero").First();
```

## SqlExpression examples

For more advanced queries you can leverage the SqlExpression builder which provides a Typed API that closely follows SQL except it's created by calling 
`db.From<T>` with the table you want to query and optionally ends with a Custom .Select() if you want to customize the resultset that's returned (similar to LINQ). Some examples of SqlExpression in action:

```csharp
var q = db.From<Track>()
    .OrderByDescending(x => x.Year)
    .Take(3);
var latest3Tracks = db.Select(q);

var faithAndLiveTracks = db.Select(db.From<Track>()
    .Where(x => x.Album == "Angel Dust" && x.Year == 1992)
    .Or(x => x.Album == "Throwing Copper" && x.Year == 1994));

// More advanced SQL Expression
var customYears = new[] { 1993, 1994, 1997 };
q = db.From<Track>()
    .Where(x => customYears.Contains(x.Year))
    .And(x => x.Name.Contains("A"))
    .GroupBy(x => x.Year)
    .OrderByDescending("Total")
    .ThenBy(x => x.Year)
    .Take(2)
    .Select(x => new { x.Year, Total = Sql.Count("*") });

var top2CountOfAByYear = db.Dictionary<string, int>(q);
```

## Sql.In

### Nested Typed Sub Select Sql Expressions 

The `Sql.In()` API supports nesting and combining of multiple Typed SQL Expressions together
in a single SQL Query, e.g:

```csharp
var usaCustomerIds = db.From<Customer>(c => c.Country == "USA").Select(c => c.Id);
var usaCustomerOrders = db.Select(db.From<Order>()
    .Where(x => Sql.In(x.CustomerId, usaCustomerIds)));
``` 

### SQL IN with collections

By using `Sql.In` from within a `SqlExpression<T>`, multiple values can be checked for a match in your query.

```csharp
db.Select<Author>(x => Sql.In(x.City, "London", "Madrid", "Berlin"));

var cities = new[] { "London", "Madrid", "Berlin" };
db.Select<Author>(x => Sql.In(x.City, cities));
```

## SqlExpression with JOIN examples

Just like SQL, SqlExpression supports multiple JOIN's that can leverage OrmLite's Reference Conventions for Simple, Terse and Intuitive Table JOIN's:

```csharp
var q = db.From<Track>()
    .Join<Artist>() //Uses implicit reference convention
    .Where<Artist>(x => x.Name == "Nirvana");
var implicitJoin = db.Select(q);

var explicitJoin = db.Select(db.From<Track>()
	.Join<Artist>((track,artist) => track.ArtistId == artist.Id)
    .Where<Artist>(x => x.Name == "Nirvana"));

var nirvanaWithRefs = db.LoadSingleById<Artist>(explicitJoin[0].ArtistId);

var oldestTracks = db.Select(db.From<Track>()
    .Where(x => Sql.In(x.Year, db.From<Track>().Select(y => Sql.Min(y.Year)))));

var oldestTrackIds = oldestTracks.Map(x => x.Id);
var earliestArtistsWithRefs = db.LoadSelect(db.From<Artist>()
    .Where(a => oldestTracks.Map(t => t.ArtistId).Contains(a.Id)));

var oldestTracksAndArtistNames = db.Dictionary<string, string>(db.From<Track>()
	.Join<Artist>()
	.Where(x => oldestTrackIds.Contains(x.Id))
    .Select<Track,Artist>((t,a) => new { t.Name, Artist = a.Name }));

var oldestTrackAndArtists = db.SelectMulti<Track,Artist>(db.From<Track>()
      .Join<Artist>()
      .Where(x => oldestTrackIds.Contains(x.Id)));
```

## Single, Scalar, Count, Exists examples

In addition to `db.Select()` OrmLite provides a number of other convenience API's to return results for your preferred use-case:

```csharp
var nevermind = db.Single<Track>(x => x.Album == "Nevermind");

var nirvana = db.SingleById<Artist>(nevermind.ArtistId);

var latestYear = db.Scalar<int>(db.From<Track>()
    .Select(x => Sql.Max(x.Year)));

var differentArtistsCount = db.Scalar<int>(db.From<Track>()
    .Select(x => Sql.CountDistinct(x.ArtistId)));

int tracksAfter93 = db.Scalar<Track,int>(x=> Sql.Count("*"), x=> x.Year > 1993);

var nirvanaTracksCount = db.Count<Track>(x => x.ArtistId == nirvana.Id);

$"\nHave Tracks in 1990: {db.Exists<Track>(x => x.Year == 1990)}".Print();
$"\nHave Tracks in 1991: {db.Exists<Track>(x => x.Year == 1991)}".Print();

var inUtero = db.Where<Track>(new { ArtistId = nirvana.Id, Year = 1993 });

var lazySequence = db.SelectLazy(db.From<Track>().OrderBy(x => x.Year));
var lazyLinq = lazySequence.Take(3).Select(x => $"{x.Year}: {x.Album}");
db.Insert(new Track {
    Name = "About a Girl", ArtistId = nirvana.Id, Album="Bleach", Year=1989 }); 
lazyLinq.Each(x => x.Print());
```

## Column, ColumnDistinct, Dictionary and Lookup Examples

In addition there are convenience API's to return results in your preferred .NET Collection:

```csharp
List<int> trackIds = db.Column<int>(db.From<Track>());

HashSet<int> years = db.ColumnDistinct<int>(db.From<Track>().Select(x => x.Year));

Dictionary<string, int> trackAndYears = db.Dictionary<string, int>(
    db.From<Track>().Select(x => new { x.Name, x.Year }));

var tracksCountByYear = db.Dictionary<int, int>(db.From<Track>()
	.Join<Artist>()
    .GroupBy(x => x.Year)     
    .OrderBy(x => x.Year)
    .Select(x => new { x.Year, Count = Sql.Count("*") }));

Dictionary<int, List<string>> tracksByYear = db.Lookup<int, string>(
	db.From<Track>().Select(x => new { x.Year, x.Name }));
```

## Custom SQL Examples

If you need more flexibility or RDBMS-specific functionality that's not possible using Typed APIs you can drop down to raw SQL using our 
[Custom SQL APIs](/ormlite/custom-sql).

## Dynamic Result Set Examples

Whilst OrmLite is predominantly a typed code-first ORM it also offers 
[several options for reading unstructured results](/ormlite/dynamic-result-sets)
when the Schema is unknown or unavailable.
