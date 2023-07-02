---
slug: js-utils
title: JavaScript Utils
---

The ServiceStack.Text JSON Serializers are only designed for serializing Typed POCOs, but you can still use it to [deserialize dynamic JSON](https://github.com/ServiceStack/ServiceStack.Text#supports-dynamic-json) but you'd need to specify the Type to deserialize into on the call-site otherwise the value would be returned as a string.

A more flexible approach to read any arbitrary JavaScript or JSON data structures is to use the high-performance and memory efficient JSON utils in [#Script](https://sharpscript.net) implementation of JavaScript.

## Install

The `#Script` JSON and JS Utils are available from the [ServiceStack.Common](https://www.nuget.org/packages/ServiceStack.Common) NuGet package:

::: nuget
`<PackageReference Include="ServiceStack.Common" Version="6.*" />`
:::

Which will enable access to the JSON API which preserves the Type which can be used to parse JavaScript or JSON literals:

```csharp
JSON.parse("1")       //= int 1 
JSON.parse("1.1")     //= double 1.1
JSON.parse("'a'")     //= string "a"
JSON.parse("{a:1}")   //= new Dictionary<string, object> { {"a", 1 } }
JSON.parse("[{a:1}]") //= new List<object> { new Dictionary<string, object> { { "a", 1 } } }
```

It can be used to parse dynamic JSON and any primitive JavaScript data type. The inverse API of `JSON.stringify()` is also available.

### Register JS Utils in ServiceStack.Text

JS Utils is already pre-configured in ServiceStack Web Apps to handle serializing & deserializing `object` types. 

You can also configure to use it in **ServiceStack.Text** Typed JSON Serializers **outside of ServiceStack** with:

```csharp
JS.Configure();
```

## Eval

Eval is useful if you want to execute custom JavaScript functions, or if you want to have a text DSL or scripting language for executing custom logic or business rules you want to be able to change without having to compile or redeploy your App. It uses [#Script Sandbox](https://sharpscript.net/docs/sandbox) which lets you evaluate the script within a custom scope that defines what functions and arguments it has access to, e.g:

```csharp
public class CustomMethods : ScriptMethods
{
    public string reverse(string text) => new string(text.Reverse().ToArray());
}

var scope = JS.CreateScope(
         args: new Dictionary<string, object> { { "arg", "value"} }, 
    functions: new CustomMethods());

JS.eval("arg", scope)                                        //= "value"
JS.eval("reverse(arg)", scope)                               //= "eulav"
JS.eval("3.itemsOf(arg.reverse().padRight(8, '_'))", scope) //= ["eulav___", "eulav___", "eulav___"]

//= { a: ["eulav___", "eulav___", "eulav___"] }
JS.eval("{a: 3.itemsOf(arg.reverse().padRight(8, '_')) }", scope)
```

#### Evaluating DSL's within a custom Context

`#Script` is useful for creating a late-bound sandboxed environment pre-configured with all functionality you want to enable access to
without forcing implementation coupling in your project dependencies, e.g. you can enable binary serialization that all your project dependencies can use with:

```csharp
var scope = context.CreateScope(new Dictionary<string, object> {
    ["target"] = person
});
var result = (ReadOnlyMemory<byte>)JS.eval("serialize(target)", scope);
```

Where the `serialize()` method only needs to be registered once in the host project that creates the context that all your DSL's are executed within, 
the implementations of which can later be substituted without any changes to existing scripts or needing to change any package/Assembly references.

## JavaScript Expressions

The JavaScript Expressions support in ServiceStack follows the [syntax tree used by Esprima](https://esprima.readthedocs.io/en/latest/syntax-tree-format.html), JavaScript's leading lexical language parser for JavaScript, but adapted to suit C# conventions using PascalCase properties and each AST Type prefixed 
with `Js*` to avoid naming collisions with C#'s LINQ Expression Types which often has the same name. 

So Esprima's [MemberExpression](https://esprima.readthedocs.io/en/latest/syntax-tree-format.html#member-expression) maps to [JsMemberExpression](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Common/Script/JsMemberExpression.cs) in #Script. 

In addition to adopting Esprima's AST data structures, #Script can also [emit the same serialized Syntax Tree](https://sharpscript.net/docs/expression-viewer#expression=1%20-%202%20%2B%203%20*%204%20%2F%205) that Esprima generates from any AST Expression, e.g:

```csharp
// Create AST from JS Expression
JsToken expr = JS.expression("1 - 2 + 3 * 4 / 5");

// Convert to Object Dictionary in Esprima's Syntax Tree Format
Dictionary<string, object> esprimaAst = expr.ToJsAst();

// Serialize as Indented JSON
esprimaAst.ToJson().IndentJson().Print();
```

Which will display the same output as seen in the new [JS Expression Viewer](https://sharpscript.net/docs/expression-viewer#expression=1%20-%202%20%2B%203%20*%204%20%2F%205):

[![](/img/pages/sharpscript/syntax/expression-viewer.png)](https://sharpscript.net/docs/expression-viewer#expression=1%20-%202%20%2B%203%20*%204%20%2F%205)

From the AST output we can visualize how the different operator precedence is applied to an Expression. 
Expression viewer also lets us explore and evaluate different JavaScript Expressions with custom arguments:

[![](/img/pages/sharpscript/syntax/logical-expression.png)](https://sharpscript.net/docs/expression-viewer#expression=1%20%3C%202%20%26%26%20(t%20%7C%7C%203%20%3E%204)%20%26%26%20f&t=true&f=false)

An [abusage Brendan Eich regrets](https://brendaneich.com/2012/04/the-infernal-semicolon/) that is enforced is limiting
the `||` and `&&` binary operators to boolean expressions, which themselves always evaluate to a boolean value.

Instead to replicate `||` coalescing behavior on falsy values you can use C#'s `??` null coalescing operator as seen in:

[![](/img/pages/sharpscript/syntax/ternary-expression.png)](https://sharpscript.net/docs/expression-viewer#expression=a%20%3E%20(c%20%3F%3F%20b)%20%3F%20a%20%3A%20b&a=1&b=2)

### Lambda Expressions

You can use lambda expressions in all functional filters:

[![](/img/pages/sharpscript/syntax/lambda-expression.png)](https://sharpscript.net/docs/expression-viewer#expression=map(range(1%2Ccount)%2C%20x%20%3D%3E%20x%20*%20x)&count=5)

Using either normal lambda expression syntax:

::: v-pre
```hbs
{{ customers |> zip(x => x.Orders)
   |> let(x => { c: x[0], o: x[1] })
   |> where(_ => o.Total < 500)
   |> map(_ => o)
   |> htmlDump }}
```
:::

Or shorthand syntax for single argument lambda expressions which can instead use `=>` without brackets or named arguments where it will 
be implicitly assigned to the `it` binding:

::: v-pre
```hbs
{{ customers |> zip => it.Orders
   |> let => { c: it[0], o: it[1] }
   |> where => o.Total < 500
   |> map => o
   |> htmlDump }}
```
:::

As it's results in more wrist-friendly and readable code, [most LINQ Examples](https://sharpscript.net/linq/projection-operators#linq15-selectmany---compound-from-2) use the shorthand lambda expression syntax above.

### Shorthand properties

Other language enhancements include support for [JavaScript's shorthand property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Syntax):

::: v-pre
```hbs
{{ {name,age} }}
```

But like C# also lets you use member property names:

```hbs
{{ people |> let => { it.Name, it.Age } |> select: {Name},{Age} }}
```
:::

### Template Literals

Many of ES6/7 features are also implemented like Template Literals:

[![](/img/pages/sharpscript/syntax/template-literals.png)](https://sharpscript.net/docs/expression-viewer#expression=%60Hello%2C%20%24%7Bname%7D!%20%24%7Ba%20%3F%20pow(1%2B2%2Ca)%20%3A%20''%7D%60&name='World'&a=3)

::: info
Backtick quoted strings also adopt the same [escaping behavior of JavaScript strings](https://sharpscript.net/docs/syntax#template-literals) 
whilst all other quoted strings preserve unescaped string values
:::

### Spread Operators

Other advanced ES6/7 features supported include the object spread, array spread and argument spread operators:

[![](/img/pages/sharpscript/syntax/object-spread.png)](https://sharpscript.net/docs/expression-viewer#expression=keys(%7B%20...a%2C%20c%3A3%2C%20...%7Bd%3A%204%7D%20%7D)&a=%7B%20b%3A%202%20%7D)

[![](/img/pages/sharpscript/syntax/array-spread.png)](https://sharpscript.net/docs/expression-viewer#expression=%5B1%2C%20...%5Brange(2%2Cpow(...%5B3%2Ce%5D))%5D%2C%201%5D&e=2)

### Bitwise Operators

All JavaScript Bitwise operators are also supported:

[![](/img/pages/sharpscript/syntax/bitwise-operators.png)](https://sharpscript.net/docs/expression-viewer#expression=%5B3%251%2C%203%261%2C%203%7C1%2C%203%5E1%2C%203%3C%3C1%2C%203%20%3E%3E%201%2C%20~1%5D&e=2)

Essentially #Script supports most JavaScript Expressions, not statements which are covered with 
[Blocks support](https://sharpscript.net/docs/blocks) 
or mutations using Assignment Expressions and Operators. All assignments still need to be explicitly performed through an 
[Assignment Filter](https://sharpscript.net/docs/default-scripts#assignment).

### Evaluating JavaScript Expressions

The built-in JavaScript expressions support is also useful outside of dynamic pages where they can be evaluated with `JS.eval()`:

```csharp
JS.eval("pow(2,2) + pow(4,2)") //= 20
```

The difference over JavaScript's eval being that methods are calling [C# script methods](https://sharpscript.net/docs/filters-reference) in a sandboxed context.

By default expressions are executed in an empty scope, but can also be executed within a custom scope which can be used to define the 
arguments expressions are evaluated with:

```csharp
var scope = JS.CreateScope(args: new Dictionary<string, object> {
    ["a"] = 2,
    ["b"] = 4,
}); 
JS.eval("pow(a,2) + pow(b,2)", scope) //= 20
```

Custom methods can also be introduced into the scope which can override existing filters by using the same name and args count, e.g:

```csharp
class MyMethods : ScriptMethods {
    public double pow(double arg1, double arg2) => arg1 / arg2;
}
var scope = JS.CreateScope(functions: new MyMethods());
JS.eval("pow(2,2) + pow(4,2)", scope); //= 3
```

An alternative to injecting arguments by scope is to wrap the expression in a lambda expression, e.g:

```csharp
var expr = (JsArrowFunctionExpression)JS.expression("(a,b) => pow(a,2) + pow(b,2)");
```

Which can then be invoked with positional arguments by calling `Invoke()`, e.g:

```csharp
expr.Invoke(2,4)        //= 20
expr.Invoke(2,4, scope) //= 3
```

### Parsing JS Expressions

Evaluating JS expressions with `JS.eval()` is a wrapper around parsing the JS expression into an AST tree then evaluating it, e.g:

```csharp
var expr = JS.expression("pow(2,2) + pow(4,2)");
expr.Evaluate(); //= 20
```

When needing to evaluate the same expression multiple times you can cache and execute the AST to save the cost of parsing the expression again.

### DSL example

If implementing a DSL containing multiple expressions as done in many of the [Block argument expressions](https://sharpscript.net/docs/blocks) 
you can instead use the `ParseJsExpression()` extension method to return a literal Span advanced to past the end of the expression with the parsed 
AST token returned in an `out` parameter.

This is what the Each block implementation uses to parse its argument expression which can contain a number of LINQ-like expressions:

```csharp
var literal = "where c.Age == 27 take 1 + 2".AsSpan();
if (literal.StartsWith("where "))
{
    literal = literal.Advance("where ".Length);     // 'c.Age == 27 take 1 + 2'
    literal = literal.ParseJsExpression(out where); // ' take 1 + 2'
}
literal = literal.AdvancePastWhitespace();          // 'take 1 + 2'
if (literal.StartsWith("take "))
{
    literal = literal.Advance("take ".Length);      // '1 + 2'
    literal = literal.ParseJsExpression(out take);  // ''
}
```

Resulting in `where` populated with the [c.Age == 27](https://sharpscript.net/docs/expression-viewer#expression=c.Age%20%3D%3D%2027&c=%7B%20Age%3A27%20%7D) `BinaryExpression` and `take` with the [1 + 2](https://sharpscript.net/docs/expression-viewer#expression=1%20%2B%202)
`BinaryExpression`.

### Immutable and Comparable

Unlike C#'s LINQ Expressions which can't be compared for equality, #Script Expressions are both Immutable and Comparable which can be used 
in caches and compared to determine if 2 Expressions are equivalent, e.g:

```csharp
var expr = new JsLogicalExpression(
    new JsBinaryExpression(new JsIdentifier("a"), JsGreaterThan.Operator, new JsLiteral(1)),
    JsAnd.Operator,
    new JsBinaryExpression(new JsIdentifier("b"), JsLessThan.Operator, new JsLiteral(2))
);

expr.Equals(JS.expression("a > 1 && b < 2"));  //= true

expr.Equals(new JsLogicalExpression(
    JS.expression("a > 1"), JsAnd.Operator, JS.expression("b < 2")
));                                            //= true
```

Showing Expressions whether created programmatically, entirely from strings or any combination of both can be compared for equality and 
evaluated in the same way:

```csharp
var scope = JS.CreateScope(args:new Dictionary<string, object> {
    ["a"] = 2,
    ["b"] = 1
});

expr.Evaluate(scope) //= true
```

## Helper Types

As scripting makes prevalent usage of Object Dictionaries and Key/Value pairs there's a couple of UX Friendly Generic collections to
reduce boilerplate if you're repeatedly using these collections:

```csharp
var objDict = new ObjectDictionary { //inherits Dictionary<string,object>
    ["one"] = 1,
    ["foo"] = "bar"
}

var strDict = new StringDictionary { //inherits Dictionary<string,string>
    ["one"] = "1",
    ["foo"] = "bar"
}

var kvps = new KeyValuePairs {
    KeyValuePairs.Create("one",1),
    KeyValuePairs.Create("foo","bar"),
};

//instead of
var kvps = new List<KeyValuePair<string,object>> {
    new KeyValuePair<string,object>("one",1),
    new KeyValuePair<string,object>("foo","bar"),
}
```
