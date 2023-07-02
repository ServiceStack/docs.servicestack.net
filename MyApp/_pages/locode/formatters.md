---
title: Format Functions
---

Format functions let you customize how fields are displayed in tabular result pages, e.g:

[![](/img/pages/locode/talent/contact-formatters.png)](https://talent.locode.dev/locode/QueryContacts)

Where columns are customized using a built-in formatting function referenced by the `[Format]` attributes:

```csharp
public class Contact : AuditBase
{
    [Format(FormatMethods.IconRounded)]
    public string ProfileUrl { get; set; }

    [Format(FormatMethods.Currency)]
    public int? SalaryExpectation { get; set; }

    [Format(FormatMethods.LinkEmail, Options = 
        @"{target:'_self',subject:'New Job Opportunity',
           body:'We have an exciting new opportunity...', cls:'text-green-600'}")]
    public string Email { get; set; }
 
    [Format(FormatMethods.LinkPhone)]
    public string Phone { get; set; }
    //....
}
```

Whilst the `[Intl*]` attributes provide a typed API to utilize JavaScript's rich 
[Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) object containing the
namespace for the ECMAScript Internationalization API, which provides number formatting, and date & time formatting, e.g:

[![](/img/pages/locode/chinook/tracks-formatters.png)](https://chinook.locode.dev/locode/QueryTracks)

Which was rendered using the `[Format]` ant `[Intl*]` attributes below:

```csharp
public class Tracks
{
    [Format(Method = "stylize", Options = "{cls:'text-rose-500'}")]
    public string Name { get; set; }
    
    [IntlDateTime(Minute = DatePart.Digits2, Second = DatePart.Digits2, FractionalSecondDigits = 3)]
    public long Milliseconds { get; set; }
    
    [Format(FormatMethods.Bytes)]
    public long? Bytes { get; set; }
    
    [IntlNumber(Currency = NumberCurrency.USD)]
    public decimal UnitPrice { get; set; }
    //....
}
```

## Custom Format Function

The `Name` column shows an example of calling a custom `stylize` JavaScript function defined in
[/modules/locode/custom.js](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/custom.js):

```js
/**: Extend locode App with custom JS **/

/** Custom [Format] method to style text with custom class
 * @param {*} val
 * @param {{cls:string}} [options] */
function stylize(val, options) {
    let cls = options && options.cls || 'text-green-600'
    return `<span class="${cls}">${val}</span>`
}
```

Which makes use of [JSDoc](https://jsdoc.app) and
[TypeScript's JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
support to [enable rich static analysis](custom).

## Format Attribute

The `[Format]` attribute lets you call any JavaScript function that exists in your Locode App. 
These formatting functions take the **field** value as a first argument and optionally an **options** object as the 2nd argument,
for further customization and can return any **HTML** fragment to render in-place of the field value.

Where the `[Format]` attribute's arguments:

```csharp
[Format(Method,Options)]
```

Calls the JavaScript function of that name, passing any options if specified:

```js
method(field,options)
```

For improved discoverability a typed list of all formatting functions are maintained in 
[FormatMethods.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Interfaces/FormatMethods.cs)
which map to the built-in JavaScript functions below which are also discoverable in the 
[API Reference Function docs](https://api.locode.dev/modules/shared.html#apiForm-1).

### Number Formatters

Use number formatters to render numbers in a more human-readable formats:

#### `FormatMethods.Currency`

Formats a number into USD currency:

```ts
function currency(val: number): string;
```

This is a shorthand alias for `[IntlNumber(Currency = NumberCurrency.USD)]`.

#### `FormatMethods.Bytes`

Formats bytes into human-readable file size:
```ts
function bytes(val: number): string;
```

### Format as Links

The `link*` functions creates HTML Anchor links linking either URLs, emails or phone numbers.
In addition to configuring common anchor attributes, the `opt` **Options** modifier also lets you configure any of its HTML attributes.  

#### `FormatMethods.Link`

Create formatted HTML A URL links:

```ts
function link(href: string, opt?: { cls?: string; target?: string; rel?: string; }) : string;
```

#### `FormatMethods.LinkEmail`

Create formatted HTML A `mailto:` anchor links:

```ts
function linkMailTo(email: string, opt?: { subject?: string; body?: string;
    cls?: string; target?: string; rel?: string; }) : string;
```

#### `FormatMethods.LinkPhone`

Create formatted HTML A `tel:` anchor links:

```ts
function linkTel(tel: string, opt?: { cls?: string; target?: string; rel?: string; }): string;
```

#### `FormatMethods.Attachment`

Creates HTML Link and preview icon for a file. If the file is an image it will render its icon otherwise will use the
appropriate icon for its file type.

```ts
function attachment(url: string): string;
```

[![](/img/pages/locode/talent/attachment-formatters.png)](https://talent.locode.dev/locode/QueryJobApplicationAttachment)

Rendered with:

```csharp
public class JobApplicationAttachment
{
    [Format(FormatMethods.Attachment)]
    public string FilePath { get; set; }
    
    [Format(FormatMethods.Bytes)]
    public long ContentLength { get; set; }
}
```

### Format Images

For rendering preview icons of an image instead of its relative or absolute URL. 

#### `FormatMethods.Icon`

Create HTML IMG Icon from URL

```ts
function icon(url: string): string;
```

#### `FormatMethods.IconRounded`

Create rounded HTML IMG Icon from URL

```ts
function iconRounded(url: string): string;
```

#### `FormatMethods.Hidden`

For hiding a column from appearing in query results:

```ts
function hidden(o: any): string;
```

::: tip
To hide a field from appearing in Create or Edit UI Forms use `[Input(Ignore=true)]` instead. 
:::

## Intl Attributes

The `[Intl*]` attributes provide a typed API to utilize ECMAScript Internationalization
[Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API
providing flexible number formatting, and date & time formatting functions:

 - [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) ([Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#examples))
 - [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) ([Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#examples))
 - [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat) ([Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#examples))

The above referenced docs contain the available formatting options for each formatting function, we recommend using their 
JavaScript console to find out the formatting options you want, which should map 1:1 with the C# enums and constants in
[IntlAttribute.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Interfaces/IntlAttribute.cs).

### Intl

`[Intl]` is a generic attribute capable of calling any of the supported
APIs although it's more UX-friendly to use the specific `[Intl*]` attributes instead, e.g:

```csharp
[IntlNumber(Currency = NumberCurrency.USD)]
```

Is a shorter alias that's equivalent to:

```csharp
[Intl(IntlFormat.Number, Number = NumberStyle.Currency, Currency = NumberCurrency.USD)] 
```

### IntlNumber

Makes use of [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)
to format numbers, checkout [Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#examples)
for a quick preview of the common formatting options available.

```csharp
public class IntlNumberExamples
{
    [IntlNumber]
    public int Example1 { get; set; }
    
    [IntlNumber(NumberStyle.Decimal, Locale = "en-AU", 
                RoundingMode = RoundingMode.HalfCeil, SignDisplay = SignDisplay.ExceptZero)]
    public int Example2 { get; set; }
    
    [IntlNumber(Currency = NumberCurrency.USD)]
    public int Example3 { get; set; }
    
    [IntlNumber(Currency = NumberCurrency.USD, CurrencyDisplay = CurrencyDisplay.Code)]
    public int Example4 { get; set; }
    
    [IntlNumber(Unit = NumberUnit.Kilobyte)]
    public int Example5 { get; set; }
}
```

Which translates to the following JavaScript function invocations:

```js
const number = 123456.789;

// Example 1: 123,456.789
new Intl.NumberFormat().format(number)

// Example 2: +123,456.789
new Intl.NumberFormat('en-AU', { style: 'decimal', roundingMode:'halfCeil', signDisplay:'exceptZero' })

// Example 3: $123,456.79
new Intl.NumberFormat(undefined, { style:'currency', currency:'USD' })

// Example 4: USD 123,456.79
new Intl.NumberFormat(undefined, { style:'currency', currency:'USD', currencyDisplay:'code' })

// Example 5: 123,456.789 kB
new Intl.NumberFormat(undefined, { style:'unit', unit:'kilobyte' })
```

### IntlDateTime

Makes use of [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
to format dates and times, checkout [Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#examples)
for available date & time styles.

```csharp
public class IntlDateExamples
{
    [IntlDateTime]
    public DateTime Example1 { get; set; }
    
    [IntlDateTime(DateStyle.Medium, TimeStyle.Short, Locale = "en-AU")]
    public DateTime Example2 { get; set; }
    
    [IntlDateTime(DateStyle.Short)]
    public DateTime Example3 { get; set; }
    
    [IntlDateTime(Year = DatePart.Digits2, Month = DateMonth.Short, Day = DatePart.Numeric)]
    public DateTime Example4 { get; set; }
}
```

Translates to:

```js
const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));

// Example 1: 12/20/2020
new Intl.DateTimeFormat().format(date)

// Example 2: 20 Dec 2020, 11:23 am
new Intl.DateTimeFormat('en-AU', { dateStyle:'medium', timeStyle:'short' }).format(date)

// Example 3: 12/20/20
new Intl.DateTimeFormat(undefined, { dateStyle:'short' }).format(date)

// Example 4: Dec 20, 20
new Intl.DateTimeFormat(undefined, { year:'2-digit', month:'short', day:'numeric' }).format(date)
```

### IntlRelativeTime

Makes use of [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat)
to format dates and times, checkout [Examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#examples)
for common usages.

Can be applied to `DateTime` and `TimeSpan` properties to render a time that's relative to now, e.g:

```csharp
public class Booking : AuditBase
{    
    [IntlDateTime(DateStyle.Long)]
    public DateTime BookingStartDate { get; set; }
    
    [IntlRelativeTime]
    public DateTime? BookingEndDate { get; set; }

    [IntlRelativeTime]
    public TimeSpan TimeAgo => DateTime.UtcNow - this.BookingStartDate;
    //....
}
```

Renders the following formatted date & relative times:

![](/img/pages/locode/talent/booking-formatters.png)
