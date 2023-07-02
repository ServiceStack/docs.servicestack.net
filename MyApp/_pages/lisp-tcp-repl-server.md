---
slug: lisp-tcp-repl-server
title: Lisp TCP REPL Server
---

In addition to launching a [Lisp REPL in the web and app dotnet tools](/dotnet-tool#lisp-repl) you can also open a Lisp REPL into any 
ServiceStack App configured with the `LispReplTcpServer` ServiceStack plugin. This effectively opens a **"programmable gateway"** into any 
ServiceStack App where it's able to perform live queries, access IOC dependencies, invoke internal Server functions and query
the state of a running Server which like the [Debug Inspector](/debugging#debug-inspector) 
can provide invaluable insight when diagnosing issues on a remote server.

To see it in action we'll enable it one of our production Apps [techstacks.io](https://techstacks.io) which as it's a 
Vuetify SPA App is only configured with an empty `SharpPagesFeature` as it doesn't use any server-side scripting features.

We'll enable it in `DebugMode` where we can enable by setting `DebugMode` in our App's `appsettings.Production.json` 
which will launch a TCP Socket Server which by default is configured to listen to the **loopback** IP on port `5005`.

```csharp
if (Config.DebugMode)
{
    Plugins.Add(new LispReplTcpServer {
        ScriptMethods = {
            new DbScripts()
        },
        ScriptNamespaces = {
            nameof(TechStacks),
            $"{nameof(TechStacks)}.{nameof(ServiceInterface)}",
            $"{nameof(TechStacks)}.{nameof(ServiceModel)}",
        },
    });
}
```

::: info
[ScriptNamespaces](https://sharpscript.net/docs/script-net#type-resolution) behaves like C#'s `using Namespace;` statement letting you reference Types by `Name` instead of its fully-qualified Namespace
:::

Whilst you can now connect to it with basic `telnet`, it's a much nicer experience to use it with the [rlwrap](https://linux.die.net/man/1/rlwrap)
readline wrap utility which provides an enhanced experience with line editing, persistent history and completion.

:::sh
sudo apt-get install rlwrap
:::

Then you can open a TCP Connection to connect to a new Lisp REPL with:

:::sh
rlwrap telnet localhost 5005
:::

Where you now have full scriptability of the running server as allowed by [#Script Pages](https://sharpscript.net/docs/script-pages) `SharpPagesFeature` which
allows [scripting of all .NET Types](https://sharpscript.net/docs/script-net#allowscriptingofalltypes) by default. 

## TechStacks TCP Lisp REPL Demo

In this demo we'll explore some of the possibilities of scripting the live [techstacks.io](https://techstacks.io) Server where we can 
`resolve` IOC dependencies to send out tweets using its registered `ITwitterUpdates` dependency, view the source and load a remote 
[parse-rss](https://gist.github.com/gistlyn/3624b0373904cfb2fc7bb3c2cb9dc1a3) lisp function into the new Lisp interpreter attached to the TCP connection, 
use it to parse [Hacker News RSS Feed](https://news.ycombinator.com/rss) into a .NET Collection where it can be more easily queried using its built-in functions
which is used to construct an email body with **HN's current Top 5 links**. 

It then uses [DB Scripts](https://sharpscript.net/docs/db-scripts) to explore its configured AWS RDS PostgreSQL RDBMS, listing its DB tables and viewing its 
column names and definitions before retrieving the Email addresses of all **Admin** users, sending them each an email with HN's Top 5 Links by 
publishing **5x** `SendEmail` Request DTOs using the [publishMessage](https://sharpscript.net/docs/servicestack-scripts#publishmessage) ServiceStack Script to where 
they're processed in the background by its configured [MQ Server](/messaging) that uses it to execute the 
`SendEmail` ServiceStack Service where it uses its configured AWS SES SMTP Server to finally send out the Emails:

[![](/img/pages/sharpscript/lisp-tcp-repl.gif)](https://youtu.be/HO523cFkDfk)

::: info YouTube
[youtu.be/HO523cFkDfk](https://youtu.be/HO523cFkDfk)
:::

## Password Protection 

Since TCP Server effectively opens your remote Server up to being scripted you'll want to ensure the TCP Server is only accessible
within a trusted network, effectively treating it the same as [Redis Security Model](https://redis.io/topics/security).

A secure approach would be to leave the default of only binding to `IPAddress.Loopback` so only trusted users with SSH access will 
be able to access it, which they'll still be able to access remotely via `Local PC > ssh > telnet 127.0.0.1 5005`.

Just like [Redis AUTH](https://redis.io/commands/auth) you can also add password protection for an additional layer of Security:

```csharp
Plugins.Add(new LispReplTcpServer {
    RequireAuthSecret = true,
    ...
});
```

Which will only allow access to users with the [configured AuthSecret](/debugging#authsecret):

```csharp
SetConfig(new HostConfig { 
    AdminAuthSecret = "secretz" 
});
```

## Annotated Lisp TCP REPL Transcript

```lisp
; resolve `ITwitterUpdates` IOC dependency and assign it to `twitter`
(def twitter (resolve "ITwitterUpdates"))

; view its concrete Type Name
(typeName twitter)

; view its method names 
(joinln (methods twitter))

; view its method signatures 
(joinln (methodTypes twitter))

; use it to send tweet from its @webstacks account
(.Tweet twitter "Who's using #Script Lisp? https://sharpscript.net/lisp")

; view all available scripts in #Script Lisp Library Index gist.github.com/3624b0373904cfb2fc7bb3c2cb9dc1a3
(gistindex)

; view the source code of the `parse-rss` library
(load-src "index:parse-rss")

; assign the XML contents of HN's RSS feed to `xml`
(def xml (urlContents "https://news.ycombinator.com/rss"))

; preview its first 1000 chars
(subString xml 0 1000)

; use `parse-rss` to parse the RSS feed into a .NET Collection and assign it to `rss`
(def rss (parse-rss xml))

; view the `title`, `description` and the first `item` in the RSS feed:
(:title rss)
(:description rss)
(:0 (:items rss))

; view the links of all RSS feed items
(joinln (map :link (:items rss)))

; view the links and titles of the top 5 news items
(joinln (map :link (take 5 (:items rss))))
(joinln (map :title (take 5 (:items rss))))

; construct a plain-text numbered list of the top 5 HN Links and assign it to `body`
(joinln (map-index #(str %2 (:title %1)) (take 5 (:items rss))))
(joinln (map-index #(str (padLeft (1+ %2) 2) ". " (:title %1)) (take 5 (:items rss))))
(def body (joinln 
    (map-index #(str (padLeft (1+ %2) 2) ". " (:title %1) "\n" (:link %1) "\n") (take 5 (:items rss)))))

; view all TechStacks PostgreSQL AWS RDS tables
(dbTableNames)
(joinln dbTableNames)

; view the column names and definitions of the `technology` table
(joinln (dbColumnNames "technology"))
(joinln (dbColumns "technology"))

; search for all `user` tables
(globln "*user*" (dbTableNames))

; view how many Admin Users with Emails there are
(dbScalar "select count(email) from custom_user_auth where roles like '%Admin%'")

; assign the Admin Users email to the `emails` list
(def emails (map :email (dbSelect "select email from custom_user_auth where roles like '%Admin%'")))

; search for all `operation` script methods
(globln "*operation*" scriptMethods)

; search for all `email` Request DTOs
(globln "*email*" metaAllOperationNames)

; view the properties available on the `SendEmail` Request DTO
(props (SendEmail.))

; search for all `publish` script methods that can publish messages
(globln "publish*" scriptMethods)

; create and publish 5x `SendEmail` Request DTOs for processing by TechStacks configured MQ Server
(doseq (to emails) (publishMessage "SendEmail" { :To to :Subject "Top 5 HN Links" :Body body }))
```
