---
title: OrmLite Logging and Introspection
---

### SQL Profiler

The easiest way to view your App's generated SQL is by enabling the [Admin Profiling UI](/admin-ui-features#request-logging-profiling) where it's built-in [SQL Profiling](/admin-ui-profiling#sql-profiling) will show generated queries in context with your other App events:

<a href="/admin-ui-profiling#sql-profiling" class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-CreateBooking-CommandAfter.png">
</a>

### Logging Executed SQL

Alternatively you can see what queries OrmLite generates by configuring it to use a **debug** enabled logger, e.g:

```csharp
LogManager.LogFactory = new ConsoleLogFactory(debugEnabled:true);
```

Where it will log the generated SQL and Params OrmLite executes to the Console.

## BeforeExecFilter and AfterExecFilter filters

An alternative to debug logging which can easily get lost in the noisy stream of other debug messages is to use the `BeforeExecFilter` and `AfterExecFilter` filters where you can inspect executed commands with a custom lambda expression before and after each query is executed. So if one of your a queries are failing you can put a breakpoint in `BeforeExecFilter` to inspect the populated `IDbCommand` object before it's executed or use the `.GetDebugString()` extension method for an easy way to print the Generated SQL and DB Params to the Console:

```csharp
OrmLiteConfig.BeforeExecFilter = dbCmd => Console.WriteLine(dbCmd.GetDebugString());

//OrmLiteConfig.AfterExecFilter = dbCmd => Console.WriteLine(dbCmd.GetDebugString());
```

## Output Generated SQL

You can use `OrmLiteUtils.PrintSql()` for the common debugging task of viewing the generated SQL OrmLite executes:

```csharp
OrmLiteUtils.PrintSql();
```

To later disable logging use:

```csharp
OrmLiteUtils.UnPrintSql();
```

## Exec, Result and String Filters

OrmLite's core Exec filters makes it possible to inject your own behavior, tracing, profiling, etc.

It's useful in situations like wanting to use SqlServer in production but use an `in-memory` Sqlite database in tests and being able to emulate any missing SQL Server Stored Procedures in code:

```csharp
public class MockStoredProcExecFilter : OrmLiteExecFilter
{
    public override T Exec<T>(IDbConnection dbConn, Func<IDbCommand, T> filter)
    {
        try
        {
            return base.Exec(dbConn, filter);
        }
        catch (Exception ex)
        {
            if (dbConn.GetLastSql() == "exec sp_name @firstName, @age")
                return (T)(object)new Person { FirstName = "Mocked" };
            throw;
        }
    }
}

OrmLiteConfig.ExecFilter = new MockStoredProcExecFilter();

using (var db = OpenDbConnection())
{
    var person = db.SqlScalar<Person>("exec sp_name @firstName, @age",
        new { firstName = "aName", age = 1 });

    person.FirstName.Print(); //Mocked
}
```

## CaptureSqlFilter

Result filters makes it trivial to implement the `CaptureSqlFilter` which allows you to capture SQL Statements without running them.
[CaptureSqlFilter](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/4c56bde197d07cfc78a80be06dd557732ecf68fa/src/ServiceStack.OrmLite/OrmLiteResultsFilter.cs#L321)
is just a simple Results Filter which can be used to quickly found out what SQL your DB calls generate by surrounding DB access in a using scope, e.g:

```csharp
using (var captured = new CaptureSqlFilter())
using (var db = OpenDbConnection())
{
    db.Where<Person>(new { Age = 27 });

    captured.SqlStatements[0].PrintDump();
}
```

Emits the Executed SQL along with any DB Parameters:

```
{
    Sql: "SELECT ""Id"", ""FirstName"", ""LastName"", ""Age"" FROM ""Person"" WHERE ""Age"" = @Age",
    Parameters: 
    {
        Age: 27
    }
}
```

## Replay Exec Filter

Or if you want to do things like executing each operation multiple times, e.g:

```csharp
public class ReplayOrmLiteExecFilter : OrmLiteExecFilter
{
    public int ReplayTimes { get; set; }

    public override T Exec<T>(IDbConnection dbConn, Func<IDbCommand, T> filter)
    {
        var holdProvider = OrmLiteConfig.DialectProvider;
        var dbCmd = CreateCommand(dbConn);
        try
        {
            var ret = default(T);
            for (var i = 0; i < ReplayTimes; i++)
            {
                ret = filter(dbCmd);
            }
            return ret;
        }
        finally
        {
            DisposeCommand(dbCmd);
            OrmLiteConfig.DialectProvider = holdProvider;
        }
    }
}

OrmLiteConfig.ExecFilter = new ReplayOrmLiteExecFilter { ReplayTimes = 3 };

using (var db = OpenDbConnection())
{
    db.DropAndCreateTable<PocoTable>();
    db.Insert(new PocoTable { Name = "Multiplicity" });

    var rowsInserted = db.Count<PocoTable>(x => x.Name == "Multiplicity"); //3
}
```


## Mockable extension methods

The Result Filters also lets you easily mock results and avoid hitting the database, typically useful in Unit Testing Services to mock OrmLite API's directly instead of using a repository, e.g:

```csharp
using (new OrmLiteResultsFilter {
    PrintSql = true,
    SingleResult = new Person { 
      Id = 1, FirstName = "Mocked", LastName = "Person", Age = 100 
    },
})
{
    db.Single<Person>(x => x.Age == 42).FirstName // Mocked
    db.Single(db.From<Person>().Where(x => x.Age == 42)).FirstName // Mocked
    db.Single<Person>(new { Age = 42 }).FirstName // Mocked
    db.Single<Person>("Age = @age", new { age = 42 }).FirstName // Mocked
}
```

More examples showing how to mock different APIs including support for nesting available in [MockAllApiTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/MockAllApiTests.cs)

## String Filter

There's also a specific filter for strings available which allows you to apply custom sanitization on String fields, e.g. you can ensure all strings are right trimmed with:

```csharp
OrmLiteConfig.StringFilter = s => s.TrimEnd();

db.Insert(new Poco { Name = "Value with trailing   " });
db.Select<Poco>().First().Name // "Value with trailing"
```
