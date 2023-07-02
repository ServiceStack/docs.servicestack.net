---
title: OrmLite Ensure APIs
---

The `Ensure()` API on OrmLite's typed `SqlExpression<T>` can be used to ensure that a condition is always applied irrespective
of other conditions, e.g:

## Typed API

```csharp
var q = db.From<Rockstar>();
q.Ensure(x => x.Id == 1); //always applied

//...
q.Where(x => x.Age == 27);
q.Or(x => x.LivingStatus == LivingStatus.Dead);

var rows = db.Select(q);
```

## Custom Parameterized SQL Expression

Custom SQL Ensure parameterized expressions:

```csharp
 q.Ensure("Id = {0}", 1); 
```

## Multiple Ensure expressions

```csharp
var q = db
    .From<Rockstar>()
    .Join<RockstarAlbum>((r,a) => r.Id == a.RockstarId);

q.Ensure<Rockstar,RockstarAlbum>((r,a) => a.Name == "Nevermind" && r.Id == a.RockstarId);

q.Where(x => x.Age == 27)
 .Or(x => x.LivingStatus == LivingStatus.Dead);

q.Ensure(x => x.Id == 3);

var rows = db.Select(q);
```

These APIs are useful for mandatory filters like "Soft Deletes" and Multitenant records.

