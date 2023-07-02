---
title: AutoQuery Memory Data Source
---

The simplest data source we can query is an in-memory .NET collection registered with `ctx.MemorySource()`. 
But how the collection is populated remains up to you. The example below shows registering collections from 
multiple sources inc. **in-line code**, populated **from a CSV file** (utilizing ServiceStack's 
CSV deserialization support) and populated **from a 3rd Party API** using 
[HTTP Utils](/http-utils):

```csharp
//Declaration in code
var countries = new[] {
    new Country { ... },
    new Country { ... },
};

//From CSV File
List<Currency> currencies = File.ReadAllText("currencies.csv").FromCsv<List<Currency>>();

//From 3rd Party API
List<GithubRepo> repos = "https://api.github.com/orgs/ServiceStack/repos"
    .GetJsonFromUrl(req => req.UserAgent="AutoQuery").FromJson<List<GithubRepo>>();

//AutoQuery Data Plugin
Plugins.Add(new AutoQueryDataFeature { MaxLimit = 100 }
    .AddDataSource(ctx => ctx.MemorySource(countries))
    .AddDataSource(ctx => ctx.MemorySource(currencies))
    .AddDataSource(ctx => ctx.MemorySource(repos))
);
```

After data sources are registered, you can then create AutoQuery Data Services to query them:

```csharp
[Route("/countries")]
public class QueryCountries : QueryData<Country> {}

[Route("/currencies")]
public class QueryCurrencies : QueryData<Currency> {}

[Route("/repos")]
public class QueryGithubRepos : QueryData<GithubRepo> {}
```

With just the empty Request DTO's above they're now queryable like any other AutoQuery Service, e.g:

   - /countries?code=AU
   - /currencies.json?code=AUD
   - /repos.csv?watchers_count>=100&orderBy=-watchers_count,name&fields=name,homepage,language


## Queryable PocoDataSource

**PocoDataSource** is useful for quickly creating an In Memory Queryable Data Source as done in the [TODOs MVC Jamstack Examples](/templates/jamstack#todos-mvc):

```csharp
public class TodosServices : Service
{
    public IAutoQueryData AutoQuery { get; set; }

    static readonly PocoDataSource<Todo> Todos = PocoDataSource.Create(new Todo[]
    {
        new () { Id = 1, Text = "Learn" },
        new () { Id = 2, Text = "Blazor", IsFinished = true },
        new () { Id = 3, Text = "WASM!" },
    }, nextId: x => x.Select(e => e.Id).Max());

    public object Get(QueryTodos query)
    {
        var db = Todos.ToDataSource(query, Request);
        return AutoQuery.Execute(query, AutoQuery.CreateQuery(query, Request, db), db);
    }

    public Todo Post(CreateTodo request)
    {
        var newTodo = new Todo { Id = Todos.NextId(), Text = request.Text };
        Todos.Add(newTodo);
        return newTodo;
    }

    public Todo Put(UpdateTodo request)
    {
        var todo = request.ConvertTo<Todo>();
        Todos.TryUpdateById(todo, todo.Id);
        return todo;
    }

    // Handles Deleting the Todo item
    public void Delete(DeleteTodo request) => Todos.TryDeleteById(request.Id);

    public void Delete(DeleteTodos request) => Todos.TryDeleteByIds(request.Ids);
}
```

Where it provides ThreadSafe CRUD operations to manage a collection of In Memory POCOs. 

### In Memory AutoQuery

The `QueryTodos` implementation utilizes an [AutoQuery Memory Source](/autoquery/memory) with the full capabilities of AutoQuery's [Implicit Conventions](/autoquery/rdbms#implicit-conventions):

 - [/api/QueryTodos?Id>=1](https://blazor-wasm-api.jamstacks.net/api/QueryTodos?Id>=1)
 - [/api/QueryTodos?TextContains=Blazor](https://blazor-wasm-api.jamstacks.net/api/QueryTodos?TextContains=Blazor)
 - [/api/QueryTodos?IsFinished=false](https://blazor-wasm-api.jamstacks.net/api/QueryTodos?IsFinished=false)

Where it can be used to iteratively prototype new data models under a productive **dotnet watch** workflow until it satisfies all your requirements where it could be easily converted to [AutoQuery CRUD](/autoquery/crud) APIs and integrated with your Systems configured RDBMS - which would require even less code.

### Cacheable Data Sources

The examples above provides a nice demonstration of querying static memory collections. But Data Sources 
offers even more flexibility where you're also able to query and cache dynamic .NET collections that 
are customizable per-request.

The registration below shows an example of this where results are dynamically fetched from **GitHub's API** 
and persisted in the **local in-memory cache** for **5 minutes** - throttling the number of requests made 
to the external 3rd Party API:

```csharp
.AddDataSource(ctx => ctx.MemorySource(() => 
 $"https://api.github.com/repos/ServiceStack/{ctx.Request.GetParam("repo")}/contributors"
   .GetJsonFromUrl(req => req.UserAgent="AutoQuery").FromJson<List<GithubContributor>>(),
  HostContext.LocalCache, 
  TimeSpan.FromMinutes(5)
));
```

We can now create an AutoQuery Data Service to query the above cached `GithubContributor` Memory Source:

```csharp
[Route("/contributors")]
public class QueryContributors : QueryData<GithubContributor>
{
    public string Repo { get; set; }
}
```

Thanks to the Typed Request DTO we also get an end-to-end Typed API for free which we can use to query 
the contributors result-set returned from GitHub's API. As an example we can view the 
**Top 20 Contributors** for the **ServiceStack** Project with:

```csharp
var top20Contributors = client.Get(new QueryContributors {
    Repo = "ServiceStack",
    OrderByDesc = "Contributions",
    Take = 20
});

top20Contributors.PrintDump(); // Pretty print results to Console
```
