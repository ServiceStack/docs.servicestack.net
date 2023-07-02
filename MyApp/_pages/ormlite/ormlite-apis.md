---
title: OrmLite API Overview
---

OrmLite's APIs are minimal, providing basic shortcuts for the primitive SQL statements:

[![OrmLite API](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/ormlite/OrmLiteApi.png)](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/ormlite/OrmLiteApi.png)

OrmLite makes available most of its functionality via extension methods to add enhancements over ADO.NET's `IDbConnection`, providing
a Typed RDBMS-agnostic API that transparently handles differences in each supported RDBMS provider.

## Create Tables Schemas

OrmLite is able to **CREATE**, **DROP** and **ALTER** RDBMS Tables from your code-first Data Models with rich annotations for
controlling how the underlying RDBMS Tables are constructed.

The Example below utilizes several annotations to customize the definition and behavior of RDBMS tables based on a POCOs
**public properties**:

```csharp
public class Player
{
    public int Id { get; set; }                     // 'Id' is PrimaryKey by convention

    [Required]
    public string FirstName { get; set; }           // Creates NOT NULL Column

    [Alias("Surname")]                              // Maps to [Surname] RDBMS column
    public string LastName { get; set; }

    [Index(Unique = true)]                          // Creates Unique Index
    public string Email { get; set; }

    public List<Phone> PhoneNumbers { get; set; }   // Complex Types blobbed by default

    [Reference]
    public List<GameItem> GameItems { get; set; }   // 1:M Reference Type saved separately

    [Reference]
    public Profile Profile { get; set; }            // 1:1 Reference Type saved separately
    public int ProfileId { get; set; }              // 1:1 Self Ref Id on Parent Table

    [ForeignKey(typeof(Level), OnDelete="CASCADE")] // Creates ON DELETE CASCADE Constraint
    public Guid SavedLevelId { get; set; }          // Creates Foreign Key Reference

    public ulong RowVersion { get; set; }           // Optimistic Concurrency Updates
}

public class Phone                                  // Blobbed Type only
{
    public PhoneKind Kind { get; set; }
    public string Number { get; set; }
    public string Ext { get; set; }
}

public enum PhoneKind
{
    Home,
    Mobile,
    Work,
}

[Alias("PlayerProfile")]                            // Maps to [PlayerProfile] RDBMS Table
[CompositeIndex(nameof(Username), nameof(Region))]  // Creates Composite Index
public class Profile
{
    [AutoIncrement]                                 // Auto Insert Id assigned by RDBMS
    public int Id { get; set; }

    public PlayerRole Role { get; set; }            // Native support for Enums
    public Region Region { get; set; }
    public string Username { get; set; }
    public long HighScore { get; set; }

    [Default(1)]                                    // Created in RDBMS with DEFAULT (1)
    public long GamesPlayed { get; set; }

    [CheckConstraint("Energy BETWEEN 0 AND 100")]   // Creates RDBMS Check Constraint
    public short Energy { get; set; }

    public string ProfileUrl { get; set; }
    public Dictionary<string, string> Meta { get; set; }
}

public enum PlayerRole                              // Enums saved as strings by default
{
    Leader,
    Player,
    NonPlayer,
}

[EnumAsInt]                                         // Enum Saved as int
public enum Region
{
    Africa = 1,
    Americas = 2,
    Asia = 3,
    Australasia = 4,
    Europe = 5,
}

public class GameItem
{
    [PrimaryKey]                                    // Specify field to use as Primary Key
    [StringLength(50)]                              // Creates VARCHAR COLUMN
    public string Name { get; set; }

    public int PlayerId { get; set; }               // Foreign Table Reference Id

    [StringLength(StringLengthAttribute.MaxText)]   // Creates "TEXT" RDBMS Column 
    public string Description { get; set; }

    [Default(OrmLiteVariables.SystemUtc)]           // Populated with UTC Date by RDBMS
    public DateTime DateAdded { get; set; }
}

public class Level
{
    public Guid Id { get; set; }                    // Unique Identifier/GUID Primary Key
    public byte[] Data { get; set; }                // Saved as BLOB/Binary where possible
}
```

We can drop the existing tables and re-create the above table definitions with:

```csharp
using var db = dbFactory.Open();

if (db.TableExists<Level>())
    db.DeleteAll<Level>();                      // Delete ForeignKey data if exists

//DROP and CREATE ForeignKey Tables in dependent order
db.DropTable<Player>();
db.DropTable<Level>();
db.CreateTable<Level>();
db.CreateTable<Player>();

//DROP and CREATE tables without Foreign Keys in any order
db.DropAndCreateTable<Profile>();
db.DropAndCreateTable<GameItem>();

var savedLevel = new Level
{
    Id = Guid.NewGuid(),
    Data = new byte[]{ 1, 2, 3, 4, 5 },
};
db.Insert(savedLevel);

var player = new Player
{
    Id = 1,
    FirstName = "North",
    LastName = "West",
    Email = "north@west.com",
    PhoneNumbers = new List<Phone>
    {
        new Phone { Kind = PhoneKind.Mobile, Number = "123-555-5555"},
        new Phone { Kind = PhoneKind.Home,   Number = "555-555-5555", Ext = "123"},
    },
    GameItems = new List<GameItem>
    {
        new GameItem { Name = "WAND", Description = "Golden Wand of Odyssey"},
        new GameItem { Name = "STAFF", Description = "Staff of the Magi"},
    },
    Profile = new Profile
    {
        Username = "north",
        Role = PlayerRole.Leader,
        Region = Region.Australasia,
        HighScore = 100,
        GamesPlayed = 10,
        ProfileUrl = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg",
        Meta = new Dictionary<string, string>
        {
            {"Quote", "I am gamer"}
        },
    },
    SavedLevelId = savedLevel.Id,
};
db.Save(player, references: true);
```

This will add a record in all the above tables with all the Reference data properties automatically populated which we can quickly see
by selecting the inserted `Player` record and all its referenced data by using [OrmLite's Load APIs](reference-support.md#querying-pocos-with-references), e.g:

```csharp
var dbPlayer = db.LoadSingleById<Player>(player.Id);

dbPlayer.PrintDump();
```

Which uses the [Dump Utils](/dump-utils) to quickly display the populated data to the console:

```
{
    Id: 1,
    FirstName: North,
    LastName: West,
    Email: north@west.com,
    PhoneNumbers: 
    [
        {
            Kind: Mobile,
            Number: 123-555-5555
        },
        {
            Kind: Home,
            Number: 555-555-5555,
            Ext: 123
        }
    ],
    GameItems: 
    [
        {
            Name: WAND,
            PlayerId: 1,
            Description: Golden Wand of Odyssey,
            DateAdded: 2018-01-17T07:53:45-05:00
        },
        {
            Name: STAFF,
            PlayerId: 1,
            Description: Staff of the Magi,
            DateAdded: 2018-01-17T07:53:45-05:00
        }
    ],
    Profile: 
    {
        Id: 1,
        Role: Leader,
        Region: Australasia,
        Username: north,
        HighScore: 100,
        GamesPlayed: 10,
        Energy: 0,
        ProfileUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg",
        Meta: 
        {
            Quote: I am gamer
        }
    },
    ProfileId: 1,
    SavedLevelId: 7690dfa4d31949ab9bce628c34d1c549,
    RowVersion: 2
}
```

Feel free to continue experimenting with [this Example Live on Gistlyn](https://gistlyn.com/?gist=840bc7f09292ad5753d07cef6063893e&collection=991db51e44674ad01d3d318b24cf0934).

## Query Examples

If your SQL doesn't start with a **SELECT** statement, it is assumed a `WHERE` clause is being provided, e.g:

```csharp
var tracks = db.Select<Track>("Artist = @artist AND Album = @album",
    new { artist = "Nirvana", album = "Heart Shaped Box" });
```

Which is equivalent to:

```csharp
var tracks = db.Select<Track>("SELECT * FROM track WHERE Artist = @artist AND Album = @album", 
    new { artist = "Nirvana", album = "Heart Shaped Box" });
```

Use `Sql*` APIs for when you want to query custom SQL that is not a SELECT statement, e.g:

```csharp
var tracks = db.SqlList<Track>("EXEC GetArtistTracks @artist, @album",
    new { artist = "Nirvana", album = "Heart Shaped Box" });
```

**Select** returns multiple records:

```csharp
List<Track> tracks = db.Select<Track>()
```

**Single** returns a single record:

```csharp
Track track = db.Single<Track>(x => x.RefId == refId)
```

**Dictionary** returns a Dictionary made from the first two columns:

```csharp
Dictionary<int, string> trackIdNamesMap = db.Dictionary<int, string>(
    db.From<Track>().Select(x => new { x.Id, x.Name }))

Dictionary<int, string> trackIdNamesMap = db.Dictionary<int, string>(
    "select Id, Name from Track")
```

**Lookup** returns an `Dictionary<K, List<V>>` made from the first two columns:

```csharp
Dictionary<int, List<string>> albumTrackNames = db.Lookup<int, string>(
    db.From<Track>().Select(x => new { x.AlbumId, x.Name }))

Dictionary<int, List<string>> albumTrackNames = db.Lookup<int, string>(
    "select AlbumId, Name from Track")
```

**Column** returns a List of first column values:

```csharp
List<string> trackNames = db.Column<string>(db.From<Track>().Select(x => x.Name))

List<string> trackNames = db.Column<string>("select Name from Track")
```

**HashSet** returns a HashSet of distinct first column values:

```csharp    
HashSet<string> uniqueTrackNames = db.ColumnDistinct<string>(
    db.From<Track>().Select(x => x.Name))

HashSet<string> uniqueTrackNames = db.ColumnDistinct<string>("select Name from Track")
```

**Scalar** returns a single scalar value:

```csharp
var trackCount = db.Scalar<int>(db.From<Track>().Select(Sql.Count("*")))

var trackCount = db.Scalar<int>("select count(*) from Track")
```

Anonymous types passed into **Where** are treated like an **AND** filter:

```csharp
var track3 = db.Where<Track>(new { AlbumName = "Throwing Copper", TrackNo = 3 })
```

SingleById(s), SelectById(s), etc provide strong-typed convenience methods to fetch by a Table's **Id** primary key field.

```csharp
var track = db.SingleById<Track>(1);
var tracks = db.SelectByIds<Track>(new[]{ 1,2,3 });
```

