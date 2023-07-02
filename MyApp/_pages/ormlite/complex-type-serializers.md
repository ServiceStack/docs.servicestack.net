---
title: Pluggable Complex Type Serializers
---

Pluggable serialization lets you specify different serialization strategies of Complex Types for each available RDBMS provider, e.g:

## Defaults

```csharp
//ServiceStack's JSON and JSV Format
SqliteDialect.Provider.StringSerializer = new JsvStringSerializer();       
PostgreSqlDialect.Provider.StringSerializer = new JsonStringSerializer();

//.NET's XML and JSON DataContract serializers
SqlServerDialect.Provider.StringSerializer = new DataContractSerializer();
MySqlDialect.Provider.StringSerializer = new JsonDataContractSerializer();

//.NET XmlSerializer
OracleDialect.Provider.StringSerializer = new XmlSerializableSerializer();
```
You can also provide a custom serialization strategy by implementing
[IStringSerializer](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Text/src/ServiceStack.Text/IStringSerializer.cs).

By default, all dialects use the existing `JsvStringSerializer`, except for PostgreSQL which due to its built-in support for JSON, uses the JSON format by default.  
