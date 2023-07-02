---
title: OrmLite DELETE APIs
---

Deleting rows in OrmLite is simple and straight-forward with APIs to support multiple use-cases including deleting by entity, by Id, by lambda expression, by SqlExpression, or Custom SQL expression.

## Delete By Entity:

```csharp
var alive = db.Single<Track>(x => x.Name == "Alive");
db.Delete(alive);
var stillAlive = db.Exists<Track>(x => x.Id == alive.Id);
```

## Delete By Id:

```csharp
db.DeleteById<Track>(trackId);
```

## Delete By inline Expression:

Like updates for DELETE's we also provide APIs that take a where Expression:

```csharp
db.Delete<Person>(p => p.Age == 27);

var noOfNirvanaTracksDeleted = db.Delete<Track>(x => x.ArtistId == nirvana.Id && x.Year == 1991);
```

## Delete By SqlExpression:

```csharp
var q = db.From<Person>()
    .Where(p => p.Age == 27);

db.Delete<Person>(q);
```

## Delete By Custom SQL

As well as un-typed, string-based expressions:

```csharp
db.Delete<Person>(where: "Age = @age", new { age = 27 });
```

## Delete from Table JOIN

Using a SqlExpression to delete rows by querying from a joined table:

```csharp
var q = db.From<Person>()
    .Join<PersonJoin>((x, y) => x.Id == y.PersonId)
    .Where<PersonJoin>(x => x.Id == 2);

db.Delete(q);
```

> Not supported in MySql

## Delete by Dictionary

```csharp
db.Delete<Rockstar>(new Dictionary<string, object> {
    ["Age"] = 27
});
```

## Delete Multiple Rows Examples

```csharp
//Multiple Entities
var nirvana = db.Single<Artist>(x => x.Name == "Nirvana");
var nirvanaTracks = db.Select<Track>(x => x.ArtistId == nirvana.Id);
var noOfNirvanaTracksDeleted = db.DeleteAll(nirvanaTracks);

//Multiple rows by Ids
var live = db.Single<Artist>(x => x.Name == "Live");
var liveTrackIds = db.Column<int>(db.From<Track>().Where(x => x.ArtistId == live.Id).Select(x => x.Id));
var noOfLiveTracksDeleted = db.DeleteByIds<Track>(liveTrackIds);

// Delete all Tracks (WARNING)
var noOfTracksDeleted = db.DeleteAll<Track>();
```