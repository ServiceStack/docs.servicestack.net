---
slug: json-jsv-and-xml
title: JSON, JSV & XML Formats
---

ServiceStack supports of course the most-used two webservices formats: XML and JSON. 
By default, the [ServiceStack.Text](https://github.com/ServiceStack/ServiceStack.Text) 
serializer is used for JSON. 

ServiceStack also provides a format called JSV:

### JSV Text Format (JSON + CSV)

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
