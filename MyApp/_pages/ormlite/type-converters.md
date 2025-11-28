---
title: OrmLite Type Converters
---

OrmLite has become a lot more customizable and extensible thanks to the internal redesign decoupling all
custom logic for handling different Field Types into individual Type Converters.

This use of individual decoupled Type Converters makes it possible to enhance or entirely replace how .NET Types are handled and can also be extended to support new Types it has no knowledge about, a feature taken advantage of by the [SQL Server Types](/ormlite/sql-server-features#sql-server-types) support.

![OrmLite Converters](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/ormlite-converters.png)

## Encapsulated, reusable, customizable and debuggable

Converters allow for great re-use as common functionality to support each type is maintained in the common
[ServiceStack.OrmLite/Converters](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/Converters)
whilst any RDBMS-specific functionality can inherit the common converters and provide any specialization
required to support that type. E.g. SQL Server specific converters are maintained in
[ServiceStack.OrmLite.SqlServer/Converters](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite.SqlServer/Converters) with each converter inheriting shared functionality and only adding custom logic required to support that
Type in Sql Server.

## Creating Converters

Converters also provide good encapsulation as everything relating to handling the field type is contained within
a single class definition. A Converter is any class implementing
[IOrmLiteConverter](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/IOrmLiteConverter.cs)
although, it's instead recommended inheriting from the `OrmLiteConverter` abstract class which allows
only the minimum APIs needing to be overridden, namely the `ColumnDefinition`
used when creating the Table definition and the ADO.NET `DbType` it should use in parameterized queries.
An example of this is in
[GuidConverter](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/Converters/GuidConverter.cs):

```csharp
public class GuidConverter : OrmLiteConverter
{
    public override string ColumnDefinition => "GUID";
    public override DbType DbType => DbType.Guid;

    public override object FromDbValue(Type fieldType, object value)
    {
        if (value is string s)
            return Guid.Parse(s);
        
        return base.FromDbValue(fieldType, value);
    }
}
```

For this to work in SQL Server the `ColumnDefinition` should instead be **UniqueIdentifier** which is also
what it needs to be cast to, to be able to query Guid's within an SQL Statement.
Therefore, Guids require a custom
[SqlServerGuidConverter](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite.SqlServer/Converters/SqlServerGuidConverter.cs)
to support Guids in SQL Server which looks like:

```csharp
public class SqlServerGuidConverter : GuidConverter
{
    public override string ColumnDefinition => "UniqueIdentifier";

    public override string ToQuotedString(Type fieldType, object value)
    {
        var guidValue = (Guid)value;
        return $"CAST('{guidValue}' AS UNIQUEIDENTIFIER)";
    }
}
```

## Registering Converters

To get OrmLite to use this new Custom Converter for SQL Server, the `SqlServerOrmLiteDialectProvider` just
[registers it in its constructor](https://github.com/ServiceStack/ServiceStack/blob/e764d49a1a0c760bec2c5cb5714a03ea8c39af99/ServiceStack.OrmLite/src/ServiceStack.OrmLite.SqlServer/SqlServerOrmLiteDialectProvider.cs#L50):

```csharp
base.RegisterConverter<Guid>(new SqlServerGuidConverter());
```

i.e. overriding the pre-registered `GuidConverter` to enable its extended functionality in SQL Server.

You'll also use the same `RegisterConverter<T>()` API to register your own Custom Guid Coverter on the RDBMS
provider you want it to apply to, e.g for SQL Server:

```csharp
SqlServerDialect.Provider.RegisterConverter<Guid>(new MyCustomGuidConverter());
```

## Resolving Converters

If needed, it can be later retrieved with:

```csharp
IOrmLiteConverter converter = SqlServerDialect.Provider.GetConverter<Guid>();
var myGuidConverter = (MyCustomGuidConverter)converter;
```

## Debugging Converters

Custom Converters also makes it easier to debug Type issues where if you want to see what value gets retrieved
from the database, you can override and add a breakpoint on the base method letting you inspect the value
returned from the ADO.NET Data Reader:

```csharp
public class MyCustomGuidConverter : SqlServerGuidConverter
{
    public override object FromDbValue(Type fieldType, object value)
    {
        return base.FromDbValue(fieldType, value); //add breakpoint
    }
}
```

## Enhancing an existing Converter

An example of when you'd want to do this is if you wanted to use the `Guid` property in your POCO's on
legacy tables which stored Guids in `VARCHAR` columns, in which case you can also add support for converting
the returned strings back into Guid's with:

```csharp
public class MyCustomGuidConverter : SqlServerGuidConverter
{
    public override object FromDbValue(Type fieldType, object value)
    {
        var strValue = value as string; 
        return strValue != null
            ? new Guid(strValue);
            : base.FromDbValue(fieldType, value); 
    }
}
```

## SQL Server TIME Converter

Another popular Use Case now enabled with Converters is being able to override built-in functionality based on preference. E.g. by default TimeSpans are stored in the database as Ticks in a `BIGINT` column since it's the most reliable way to retain the same TimeSpan value uniformly across all RDBMS's.

E.g. SQL Server's **TIME** data type can't store Times greater than 24 hours or with less precision than **3ms**.
But if using a **TIME** column was preferred it can now be enabled by registering to use the new
[SqlServerTimeConverter](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite.SqlServer/Converters/SqlServerTimeConverter.cs)
instead:

```csharp
SqlServerDialect.Provider.RegisterConverter<TimeSpan>(
    new SqlServerTimeConverter { 
       Precision = 7 
    });
```

## Customizable Field Definitions

Another benefit is they allow for easy customization as seen with `Precision` property which will now
create tables using the `TIME(7)` Column definition for TimeSpan properties.

## Compact Guid Converters

For RDBMS's that don't have a native `Guid` type like Oracle or Firebird, you had an option to choose whether
you wanted to save them as text for better readability (default) or in a more efficient compact binary format.
Previously this preference was maintained in a boolean flag along with multiple Guid implementations hard-coded
at different entry points within each DialectProvider. This complexity has now been removed, now to store guids
in a compact binary format you'll instead register the preferred Converter implementation, e.g:

```csharp
FirebirdDialect.Provider.RegisterConverter<Guid>(
    new FirebirdCompactGuidConverter());
```

## String Converters

To customize the behavior of how strings are stored you can change them directly on the `StringConverter`, e.g:

```csharp
StringConverter converter = OrmLiteConfig.DialectProvider.GetStringConverter();
converter.UseUnicode = true;
converter.StringLength = 100;
```

Which will change the default column definitions for strings to use `NVARCHAR(100)` for RDBMS's that support
Unicode or `VARCHAR(100)` for those that don't.

The `GetStringConverter()` API is just an extension method wrapping the generic `GetConverter()` API to return
a concrete type:

```csharp
public static StringConverter GetStringConverter(this IOrmLiteDialectProvider d)
{
    return (StringConverter)d.GetConverter(typeof(string));
}
```

## DateTime Converters

### Specify the DateKind in DateTimes

It's now much simpler and requires less effort to implement new features that maintain the same behavior
across all supported RDBMS thanks to better cohesion, re-use and reduced internal state. One new feature
we've added as a result is the new `DateStyle` customization on `DateTimeConverter` which lets you change how
Dates are persisted and populated, e.g:

```csharp
DateTimeConverter dates = OrmLiteConfig.DialectProvider.GetDateTimeConverter();
dates.DateStyle = DateTimeKind.Local;
```

Will save `DateTime` in the database and populate them back on data models as LocalTime.
This is also available for Utc:

```csharp
dates.DateStyle = DateTimeKind.Utc;
```

Default is `Unspecified` which doesn't do any conversions and just uses the DateTime returned by the ADO.NET provider.
Examples of the behavior of the different DateStyle's is available in
[DateTimeTests](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/DateTimeTests.cs).

## Noda Time

SQL Server Converter for [NodaTime](http://nodatime.org/) `Instant` Type in `DATETIMEOFFSET` with TimeZone:

```csharp
public class SqlServerInstantConverter : OrmLiteConverter
{
    public override string ColumnDefinition => "DATETIMEOFFSET";

    public override DbType DbType => DbType.DateTimeOffset;

    public override object ToDbValue(Type fieldType, object value)
    {
        var instantValue = (Instant)value;
        return instantValue.ToDateTimeOffset();
    }

    public override object FromDbValue(Type fieldType, object value)
    {
        return Instant.FromDateTimeOffset((DateTimeOffset)value);
    }
}

SqlServerDialect.Provider.RegisterConverter<Instant>(new SqlServerInstantConverter());
```

In `DATETIME2` in UTC:

```csharp
public class SqlServerInstantDateTimeConverter : OrmLiteConverter
{
    public override string ColumnDefinition => "DATETIME2";

    public override DbType DbType => DbType.DateTime;

    public override object ToDbValue(Type fieldType, object value)
    {
        var instantValue = (Instant) value;
        return instantValue.ToDateTimeUtc();
    }

    public override object FromDbValue(Type fieldType, object value)
    {
        var dateTime = DateTime.SpecifyKind((DateTime)value, DateTimeKind.Utc);
        return Instant.FromDateTimeUtc(dateTime);
    }
}

SqlServerDialect.Provider.RegisterConverter<Instant>(new SqlServerInstantDateTimeConverter());
```

## SQL Server Types

See [SQL Server Types](sql-server-features.md#sql-server-types) for how to enable support for SQL Server-specific `SqlGeography`, `SqlGeometry` and `SqlHierarchyId` Types.