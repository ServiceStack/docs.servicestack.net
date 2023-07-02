---
slug: jsv-format
title: JSV Format
---

ServiceStack provides a fast, compact format called JSV:

## JSV Text Format (JSON + CSV)

JSV is a text-based format that is optimized for both size and speed.

In many ways it is similar to JavaScript, e.g. any List, Array, Collection of ints, longs, etc are stored in exactly the same way, i.e:

```js
[1,2,3,4,5]
```

Any IDictionary is serialized like JavaScript, i.e:

```js
{A:1,B:2,C:3,D:4}
```

Which also happens to be the same as C# POCO class with the values 

```csharp
new MyClass { A=1, B=2, C=3, D=4 }
```

Which serializes to:

```js
{A:1,B:2,C:3,D:4}
```

JSV is *white-space significant*, which means normal string values can be serialized without quotes, e.g: 

```csharp
new MyClass { Foo="Bar", Greet="Hello World!"}
```

is serialized as:

```js
{Foo:Bar,Greet:Hello World!}
```

### CSV escaping

Any string with any of the following characters: `[]{},"`
is escaped using CSV-style escaping where the value is wrapped in double quotes, e.g:

```csharp
new MyClass { Name = "Me, Junior" }
```

is serialized as:
	
```js
{Name:"Me, Junior"}
```

A value with a double-quote is escaped with another double quote e.g:

```csharp
new MyClass { Size = "2\" x 1\"" }
```

is serialized as:

```js
{Size:"2"" x 1"""}
```

#### [.NET JsvServiceClient](/csharp-client#httpwebrequest-service-clients)

Thanks to the performance benefits of JSV's CSV-style escaping, the `JsvServiceClient` 
is our fastest text-based [.NET ServiceClient](/csharp-client):

```csharp
var client = new JsvServiceClient(baseUrl);
var response = client.Get(new Hello { Name = "World" });
```

### [JavaScript JSV Serializer](https://github.com/ServiceStack/ServiceStack/blob/v5.4.1/lib/js/JSV.js)

A JavaScript JSV parser is also available from [JSV.js](https://github.com/ServiceStack/ServiceStack/blob/v5.4.1/lib/js/JSV.js):

```javascript
var jsv = JSV.stringify(model);
var dto = JSV.parse(jsv);
```

#### JavaScript JsvServiceClient

[JSV.js](https://github.com/ServiceStack/ServiceStack/blob/v5.4.1/lib/js/JSV.js#L464) also includes the `JsvServiceClient` for consuming JSV Services:

```javascript
var client = new JsvServiceClient(baseUrl);
client.getFromService("Hello", { name: "World" }, 
    function(r) {
    });
```

