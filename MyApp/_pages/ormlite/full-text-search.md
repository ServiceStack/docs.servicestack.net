---
title: Full-Text Search
---

`[FullTextIndex]` creates a full-text index of a table's text columns, which `Sql.Matches()` searches for words and
phrases and `Sql.MatchRank()` orders by relevance, in the same typed query as your filters and joins:

```csharp
[FullTextIndex(nameof(Title), nameof(Content))]
public class Article
{
    [AutoIncrement]
    public long Id { get; set; }
    public string Title { get; set; }
    [StringLength(StringLengthAttribute.MaxText)]
    public string Content { get; set; }
    public string Category { get; set; }
}

// GET /articles?search=vector search
var q = db.From<Article>()
    .Where(x => Sql.Matches(x, request.Search) && x.Category == request.Category)
    .OrderByDescending(x => Sql.MatchRank(x, request.Search))
    .Take(20);

var articles = db.Select(q);
```

`CreateTable` creates the index with the full-text search of each RDBMS, so the same model and queries work on all of
them:

| RDBMS | Full-text index | Searched with | Ranked by |
|-|-|-|-|
| SQLite | An FTS5 table, `{table}_fts`, kept in sync with the table's rows by triggers | `MATCH` | `bm25()` |
| PostgreSQL | A GIN index of the columns' `tsvector` | `@@ to_tsquery()` | `ts_rank_cd()` |
| MySQL and MariaDB | A `FULLTEXT` index | `MATCH() AGAINST()` in boolean mode | Its relevance |
| SQL Server | A Full-Text Search index, in the `ormlite_fts` catalog | `CONTAINS()` | `CONTAINSTABLE()`'s rank |

## Searching

`Sql.Matches(x, search)` matches the rows whose indexed columns have every word of the search, in any of the columns:

| Search | Matches rows with |
|-|-|
| `vector search` | A word starting with `vector` and a word starting with `search` |
| `data` | `data`, `database`, `dataset`, ... |
| `"full text"` | The words `full` and `text`, one after the other |
| `"database schema" migrations` | The phrase, and a word starting with `migrations` |

Words match the words they're the start of, ignoring case, so a search box finds results as users type.

The search is only ever sent as a db param, in the full-text query syntax of the RDBMS. Everything other than letters,
digits and quotes only separates words, so a search can't use the operators of an RDBMS's syntax, e.g. `-`, `OR`,
`*` or `NEAR()`, which are searched for as words instead. A search without any words throws an `ArgumentException`.

## Ordering by relevance

`Sql.MatchRank(x, search)` is how relevant a row is to a search, where higher is more relevant. Order the rows that
match by it to show the best matches first, or select it as a score:

```csharp
var results = db.Select<(string Title, double Rank)>(db.From<Article>()
    .Where(x => Sql.Matches(x, search))
    .OrderByDescending(x => Sql.MatchRank(x, search))
    .Select(x => new { x.Title, Rank = Sql.MatchRank(x, search) }));
```

Each RDBMS scores relevance differently, so ranks are for ordering the results of one database, not for comparing
across them.

## Combine with filters, joins and vector search

A search is a condition like any other, so it's combined with your filters and joins in one statement, and on a
connection with [connection filters](/ormlite/connection-filters) it's confined to the connection's tenant:

```csharp
var q = db.From<Article>()
    .Join<Author>((a, b) => a.AuthorId == b.Id)
    .Where<Article, Author>((a, b) => Sql.Matches(a, search) && b.Verified);
```

It's also combined with [vector search](/ormlite/vectors) for hybrid search, e.g. the passages that mention a
question's keywords, ordered by how similar they are to it:

```csharp
var q = db.From<Passage>()
    .Where(x => Sql.Matches(x, question))
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(10);
```

Searches work in [compiled queries](/ormlite/compiled-queries), where the search is converted to the RDBMS's syntax
each time they're run:

```csharp
static readonly CompiledQuery<Article, string> Search = OrmLiteQuery.Compile<Article, string>(
    (q, search) => q.Where(x => Sql.Matches(x, search)).OrderByDescending(x => Sql.MatchRank(x, search)));

var articles = db.Select(Search, request.Search);
```

## Keeping the index up to date

Rows are indexed as they're inserted, updated and deleted, with every API. SQLite's triggers keep its FTS5 table in
sync with the table, which is also kept when its table is [rebuilt](/ormlite/schema-diff#rebuild-sqlite-tables).

SQL Server indexes rows in the background, a short time after they're written. Wait for it when a search has to find
them straight away, e.g. in tests:

```csharp
db.InsertAll(articles);
db.WaitForFullTextIndex<Article>();
```

## Add it to an existing table

`CreateFullTextIndex<T>()` creates the index of a model's `[FullTextIndex]` and indexes the rows the table already
has, e.g. in a [migration](/ormlite/db-migrations):

```csharp
public override void Up() => Db.CreateFullTextIndex<Article>();
public override void Down() => Db.DropFullTextIndex<Article>();
```

A [Schema Diff](/ormlite/schema-diff) finds a full-text index that isn't in the database, and writes it in its
migration.

`db.SupportsFullTextSearch()` says whether the database can create full-text indexes, e.g. SQL Server's Full-Text
Search is an optional component that isn't always installed. Fall back to `Contains()` when it can't:

```csharp
var q = db.SupportsFullTextSearch()
    ? db.From<Article>().Where(x => Sql.Matches(x, search))
    : db.From<Article>().Where(x => x.Title.Contains(search) || x.Content.Contains(search));
```

## Languages

Words are indexed as they're written by default. Set `Language` to index them in a language, which PostgreSQL and SQL
Server use to also match other forms of a word, e.g. `run` and `running`:

```csharp
[FullTextIndex(nameof(Title), nameof(Content), Language = "english")]
```

It's the name of a PostgreSQL text search configuration, or the name or LCID of a SQL Server full-text language.

## Things to be aware of

- **One index for each table**, of the columns in its `[FullTextIndex]`, which have to be strings
- **SQLite** needs an integer primary key, which its FTS5 table uses as its `rowid`
- **MySQL and MariaDB** don't index words shorter than 3 characters or their stop words, e.g. `in` and `the`, so
  they don't have to be in a row to match. A search of only those words matches no rows
- **SQL Server** needs its optional Full-Text Search component, and creates its full-text index outside a transaction,
  so it can't be created in a transaction, e.g. a migration's. Rows are indexed in the background, see
  [WaitForFullTextIndex()](#keeping-the-index-up-to-date)
- **Snippets and highlighting** aren't part of the API, as only some RDBMS have them
