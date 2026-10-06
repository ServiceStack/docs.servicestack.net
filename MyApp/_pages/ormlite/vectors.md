---
title: Vector Search
---

`[Vector]` columns store the embeddings of an AI model, so the rows most similar to a piece of text can be found in
the same query as your typed filters and joins:

```csharp
public class Passage
{
    [AutoIncrement]
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Text { get; set; }

    [Vector(1536)]
    public float[] Embedding { get; set; }
}

float[] questionVector = await embeddings.CreateAsync(question); // from your AI model

// The 5 passages most similar to the question
var nearest = db.Select(db.From<Passage>()
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(5));
```

The dimensions of a `[Vector]` are the size of the embeddings of the model that creates them, e.g. `1536` for OpenAI's
`text-embedding-3-small`.

Vectors can also be a `ReadOnlyMemory<float>`, the type of `Embedding<float>.Vector` in Microsoft.Extensions.AI, so
embeddings are saved and compared without copying them to an array:

```csharp
[Vector(1536)]
public ReadOnlyMemory<float> Embedding { get; set; }

var embedding = await generator.GenerateAsync(question);
var nearest = db.Select(db.From<Passage>()
    .OrderBy(x => Sql.CosineDistance(x.Embedding, embedding.Vector))
    .Take(5));
```

## Supported databases

Vectors need an RDBMS with vector support enabled:

| RDBMS | Requires | Column | Vector index |
|-|-|-|-|
| PostgreSQL | The [pgvector](https://github.com/pgvector/pgvector) extension | `vector(n)` | HNSW |
| SQL Server | SQL Server 2025 or Azure SQL | `VECTOR(n)` | None created |
| MariaDB | MariaDB 11.7+ | `VECTOR(n)` | Yes |
| MySQL | MySQL 9+, distances need HeatWave or Enterprise | `VECTOR(n)` | None |
| SQLite | The [sqlite-vec](https://github.com/asg017/sqlite-vec) extension | `BLOB` | None |

Other RDBMS throw a `NotSupportedException`.

### PostgreSQL

Enable pgvector in each database that uses it, which needs a superuser unless your provider allows it:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### SQLite

Add the [sqlite-vec](https://www.nuget.org/packages/sqlite-vec) NuGet package, which has the extension for each
platform, and load it into each connection when it opens:

```csharp
// With Microsoft.Data.Sqlite
SqliteDialect.Provider.OnOpenConnection = db =>
    ((SqliteConnection)db.ToDbConnection()).LoadExtension("vec0");
```

With `System.Data.SQLite` call `EnableExtensions(true)` on the connection first, then `LoadExtension()` with the path
of the extension's file for your platform.

## Finding similar rows

Order by a distance to the vector you're searching for, where smaller is more similar:

| API | Distance | Supported by |
|-|-|-|
| `Sql.CosineDistance()` | The angle between 2 vectors, ignoring their length. The usual choice for text embeddings | All |
| `Sql.L2Distance()` | The straight-line (Euclidean) distance | All |
| `Sql.NegativeInnerProduct()` | The inner (dot) product negated, for normalized vectors | PostgreSQL, SQL Server, MySQL |

```csharp
var nearest = db.Select(db.From<Passage>()
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(5));
```

The vector is sent as a db param. This is what's ordered by in each RDBMS:

| RDBMS | SQL |
|-|-|
| PostgreSQL | `ORDER BY ("embedding" <=> :0::vector)` |
| SQL Server | `ORDER BY VECTOR_DISTANCE('cosine', "Embedding", CAST(@0 AS VECTOR(1536)))` |
| MariaDB | ``ORDER BY VEC_DISTANCE_COSINE(`Embedding`, @0)`` |
| MySQL | ``ORDER BY DISTANCE(`Embedding`, @0, 'COSINE')`` |
| SQLite | `ORDER BY vec_distance_cosine("Embedding", @0)` |

## Combine with filters and joins

Vector search is part of a typed query, so it can be limited to the rows a user can see, e.g. the passages of books
that are in stock:

```csharp
var q = db.From<Passage>()
    .Join<Book>((p, b) => p.BookId == b.Id)
    .Where<Book>(b => b.Available && b.Genre != Genre.Fiction)
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(5);

var passages = db.Select(q);
```

On a connection with [connection filters](/ormlite/connection-filters) it's also confined to the connection's tenant,
so one tenant's search never returns another's rows.

## Returning the distance

Select the distance to show a score, and filter by it to leave out weak matches:

```csharp
public class PassageMatch
{
    public int Id { get; set; }
    public string Text { get; set; }
    public double Distance { get; set; }
}

var matches = db.Select<PassageMatch>(db.From<Passage>()
    .Where(x => Sql.CosineDistance(x.Embedding, questionVector) < 0.35)
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(10)
    .Select(x => new {
        x.Id,
        x.Text,
        Distance = Sql.CosineDistance(x.Embedding, questionVector),
    }));
```

Vectors can be selected too. A class that vectors are read into needs `[Vector]` on its property, like the table's:

```csharp
public class PassageVector
{
    public int Id { get; set; }
    [Vector(1536)]
    public float[] Embedding { get; set; }
}

var vectors = db.Select<PassageVector>(db.From<Passage>().Select(x => new { x.Id, x.Embedding }));
```

The same methods calculate the distance of 2 vectors in memory:

```csharp
double distance = Sql.CosineDistance(vectorA, vectorB);
```

## Saving vectors

Vectors are saved and read back like any other property, with every API:

```csharp
db.Insert(new Passage { BookId = book.Id, Text = text, Embedding = vector });

db.UpdateOnly(() => new Passage { Embedding = newVector }, where: x => x.Id == id);

float[] saved = db.SingleById<Passage>(id).Embedding;
```

A vector with different dimensions than its column is rejected by the RDBMS, except in SQLite where the column is a
`BLOB`.

Rows without a vector can't be compared, so leave them out:

```csharp
var q = db.From<Passage>()
    .Where(x => x.Embedding != null)
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector));
```

## Vector indexes

Without an index every row is compared, which is fine for thousands of rows. Add `[Index]` to create a vector index
where the RDBMS has one, for the distance your queries order by:

```csharp
public class Passage
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Text { get; set; }

    [Vector(1536, Distance = VectorDistance.Cosine), Index, Required]
    public float[] Embedding { get; set; }
}
```

| RDBMS | Index created |
|-|-|
| PostgreSQL | `CREATE INDEX ... USING hnsw ("embedding" vector_cosine_ops)` |
| MariaDB | `CREATE VECTOR INDEX ... DISTANCE=cosine`, which needs a `[Required]` column |
| SQL Server, MySQL, SQLite | None |

The index can be tuned with the options of `[Vector]`, where the RDBMS has them:

| Option | PostgreSQL | MariaDB |
|-|-|-|
| `M`: the connections of each vector of an HNSW index | `m` | `M` |
| `EfConstruction`: the candidates compared when it's built | `ef_construction` | |
| `IndexType = VectorIndexType.IvfFlat` with `Lists` | `USING ivfflat ... WITH (lists = 100)` | |

```csharp
[Vector(1536, M = 16, EfConstruction = 64), Index, Required]
public float[] Embedding { get; set; }
```

Options an RDBMS doesn't have throw a `NotSupportedException` instead of being ignored, before the table is created.

### Searching vector indexes

`SetVectorSearch()` sets how a connection searches vector indexes, for the rest of its session:

```csharp
db.SetVectorSearch(new() { EfSearch = 100, IterativeScan = true });
```

| Option | PostgreSQL | MariaDB |
|-|-|-|
| `EfSearch`: the candidates an HNSW search compares, at least as many as a query takes | `hnsw.ef_search` | `mhnsw_ef_search` |
| `Probes`: the lists an IVFFlat search reads | `ivfflat.probes` | |
| `IterativeScan`: continue until enough rows match the query's other conditions (pgvector 0.8+) | `hnsw.iterative_scan` and `ivfflat.iterative_scan` | |

SQL Server 2025's `DiskANN` vector index is a preview feature that has to be enabled for a database, create it with a
[PostCreateTable](/ormlite/apis/schema#pre-post-custom-sql-hooks-when-creating-and-dropping-tables) attribute if
you've enabled it.

::: info
A vector index finds approximate matches. When it's combined with a filter, some RDBMS apply the filter to the
candidates the index returns, so a filter that only matches a few rows can return fewer rows than were asked for, e.g.
a tenant's rows in a multi-tenant App. On PostgreSQL, `IterativeScan` keeps searching until enough rows match.
:::

### Half-precision vectors

`Precision = VectorPrecision.Half` stores each value in 16 bits instead of 32, halving the size of a table's vectors
and their index, for a small loss of precision. The property is still a `float[]`:

```csharp
[Vector(1536, Precision = VectorPrecision.Half), Index, Required]
public float[] Embedding { get; set; }
```

They use PostgreSQL's `halfvec` type and SQL Server 2025's `VECTOR(n, float16)`, which is a preview feature that has to
be enabled with `PREVIEW_FEATURES`. Other RDBMS throw a `NotSupportedException`.

## Limitations

- **Raw SQL**: send a vector as the value your RDBMS expects, e.g. its text `[1,2,3]` cast to its vector type in
  PostgreSQL and SQL Server, or `VectorConverter.ToBytes(vector)` in MySQL, MariaDB and SQLite
- Vectors are `float[]` or `ReadOnlyMemory<float>` properties
