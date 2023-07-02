---
title: Limitations
---

## Single Primary Key

For simplicity, and to be able to have the same POCO class persisted in db4o, memcached, redis or on the filesystem (i.e. providers included in ServiceStack), each model must have a single primary key, by convention OrmLite expects it
to be `Id` although you use `[Alias("DbFieldName")]` attribute it map it to a column with a different name or use
the `[PrimaryKey]` attribute to tell OrmLite to use a different property for the primary key.

If an `Id` property or `[PrimaryKey]` attribute isn't specified, a Primary Key is assigned to `[AutoIncrement]` and `[AutoId]` properties, otherwise it's assumed the first property is the tables Primary Key.

You can still `SELECT` from these tables, you will just be unable to make use of APIs that rely on it, e.g.
`Update` or `Delete` where the filter is implied (i.e. not specified), all the APIs that end with `ById`, etc.

## Optimize LIKE Searches

One of the primary goals of OrmLite is to expose and RDBMS agnostic Typed API Surface which will allow you
to easily switch databases, or access multiple databases at the same time with the same behavior.

One instance where this can have an impact is needing to use `UPPER()` in **LIKE** searches to enable
case-insensitive **LIKE** queries across all RDBMS. The drawback of this is that LIKE Queries are not able
to use any existing RDBMS indexes. We can disable this feature and return to the default RDBMS behavior with:

```csharp
OrmLiteConfig.StripUpperInLike = true;
```

Allowing all **LIKE** Searches in OrmLite or AutoQuery to use any available RDBMS Index.

## Oracle Provider Notes

By default, the Oracle provider stores Guids in the database as character strings and when generating SQL it quotes only table and column names that are reserved words in Oracle. That requires that you use the same quoting if you code your own SQL. Both of these options can be overridden, but overriding them will cause problems: the provider can store Guids as raw(16) but it cannot read them.

The Oracle provider uses Oracle sequences to implement AutoIncrement columns and it queries the sequence to get a new value in a separate database call. You can override the automatically generated sequence name with a

```
[Sequence("name")]
```

attribute on a field. The Sequence attribute implies `[AutoIncrement]`, but you can use both on the same field.

Since Oracle has a very restrictive 30 character limit on names, it is strongly suggested that you use short entity class and field names or aliases, remembering that indexes and foreign keys get compound names. If you use long names, the provider will squash them to make them compliant with the restriction. The algorithm used is to remove all vowels ("aeiouy") and if still too long then every fourth letter starting with the third one and finally if still too long to truncate the name. You must apply the same squashing algorithm if you are coding your own SQL.

The previous version of ServiceStack.OrmLite.Oracle used System.Data.OracleClient to talk to the database. Microsoft has deprecated that client, but it does still mostly work if you construct the Oracle provider like this:

```
OracleOrmLiteDialectProvider.Instance = new OracleOrmLiteDialectProvider(
compactGuid: false,
quoteNames: false,
clientProvider: OracleOrmLiteDialectProvider.MicrosoftProvider); 
```

DateTimeOffset fields and, in locales that use a comma to separate the fractional part of a floating point number, some aspects of using floating point numbers, do not work with System.Data.OracleClient.
