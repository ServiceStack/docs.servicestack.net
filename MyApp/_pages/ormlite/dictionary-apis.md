---
title: Dictionary APIs
---

OrmLite's Dictionary APIs allow you to customize which parts of a Data Model should be modified by
converting it into then manipulating an Object Dictionary, e.g:

## Insert by Dictionary

```csharp
var row = new Person { FirstName = "John", LastName = "Smith" };
Dictionary<string,object> obj = row.ToObjectDictionary();
obj[nameof(Person.LastName)] = null;

row.Id = (int) db.Insert<Person>(obj, selectIdentity:true);
```

## Update by Dictionary

```csharp
Person row = db.SingleById<Person>(row.Id);
var obj = row.ToObjectDictionary();
obj[nameof(Person.LastName)] = "Smith";
db.Update<Person>(obj);
```

## UpdateOnly by Dictionary

```csharp
// By Primary Key Id
var fields = new Dictionary<string, object> {
    [nameof(Person.Id)] = 1,
    [nameof(Person.FirstName)] = "John",
    [nameof(Person.LastName)] = null,
};

db.UpdateOnly<Person>(fields);

// By Custom Where Expression
var fields = new Dictionary<string, object> {
    [nameof(Person.FirstName)] = "John",
    [nameof(Person.LastName)] = null,
};

db.UpdateOnly<Person>(fields, p => p.LastName == "Hendrix");
```

## Delete by Dictionary

```csharp
db.Delete<Rockstar>(new Dictionary<string, object> {
    ["Age"] = 27
});
```
