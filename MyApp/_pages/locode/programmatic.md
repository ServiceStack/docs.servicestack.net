---
title: Programmatic Dev Model
---

## Customizing UI 

Much of the configurable parts of the UIs can be customized in code, for a preview of the potential customizations 
available here's are the defaults the UIs are configured with which you can change with `ConfigurePlugin<UiFeature>`: 

```csharp
ConfigurePlugin<UiFeature>(feature => {
    feature.Info.HideTags = new List<string> { TagNames.Auth };
    feature.Info.BrandIcon = Svg.ImageUri(Svg.GetDataUri(Svg.Logos.ServiceStack, "#000000"));
    feature.Info.Theme = new ThemeInfo {
        Form = "shadow overflow-hidden sm:rounded-md bg-white",
        ModelIcon = Svg.ImageSvg(Svg.Create(Svg.Body.Table)),
    };
    feature.Info.Locode = new() {
        Css = new ApiCss {
            Form = "max-w-screen-2xl",
            Fieldset = "grid grid-cols-12 gap-6",
            Field = "col-span-12 lg:col-span-6 xl:col-span-4",
        },
        Tags = new AppTags {
            Default = "Tables",
            Other = "other",
        },
        MaxFieldLength = 150,
        MaxNestedFields = 2,
        MaxNestedFieldLength = 30,
    };
    feature.Info.Explorer = new() {
        Css = new ApiCss {
            Form = "max-w-screen-md",
            Fieldset = "grid grid-cols-12 gap-6",
            Field = "col-span-12 sm:col-span-6",
        },
        Tags = new AppTags {
            Default = "APIs",
            Other = "other",
        },
    };
    feature.Info.DefaultFormats = new ApiFormat {
        AssumeUtc = true,
        Date = new Intl(IntlFormat.DateTime) { Date = DateStyle.Medium }.ToFormat(),
    };
    feature.Info.AdminLinks = new() {
        new LinkInfo { Id = "", Label = "Dashboard", Icon = Svg.ImageSvg(Svg.Create(Svg.Body.Home)) },
    };
});
```

These defaults can also be individually changed by `[LocodeCss]` and `[ExplorerCss]` to [Customize the Form CSS](/locode/declarative.html#custom-form-css)
for specific AutoQuery CRUD Operations.

## Customizing Inputs and Fields in Code

All UI attributes are used to populate the metadata model for your App which is used to power their metadata-driven UIs.
An alternative way to populate this metadata is to use `ConfigureOperation<RequestDto>` to populate the metadata directly,
e.g. here's an example of how we can customize the `<input>` in our custom `Register` **FormLayout**:

```csharp
appHost.ConfigureOperation<Register>(op => op.FormLayout = new()
{
    Input.For<Register>(x => x.DisplayName, x => x.Help = "Your first and last name"),
    Input.For<Register>(x => x.Email, x => x.Type = Input.Types.Email),
    Input.For<Register>(x => x.Password, x => x.Type = Input.Types.Password),
    Input.For<Register>(x => x.ConfirmPassword, x => x.Type = Input.Types.Password),
});
```

Whilst being just a flattened list of inputs we're still able to customize the form layout by using the Typed 
`FieldsPerRow()` helper method:

```csharp
Plugins.Add(new AdminUsersFeature {
    // Add Custom Fields to Create/Edit User Forms
    FormLayout = new() {
        Input.For<UserAuth>(x => x.Email, x => x.Type = Input.Types.Email),
        Input.For<UserAuth>(x => x.UserName),
        Input.For<UserAuth>(x => x.FirstName,    c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.LastName,     c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.DisplayName),
        Input.For<UserAuth>(x => x.Company),
        Input.For<UserAuth>(x => x.Address),
        Input.For<UserAuth>(x => x.Address2),
        Input.For<UserAuth>(x => x.City,         c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.State,        c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.Country,      c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.PostalCode,   c => c.FieldsPerRow(2)),
        Input.For<UserAuth>(x => x.PhoneNumber, x => x.Type = Input.Types.Tel),
    }
});
```

Which just simplifies choosing the responsive [TailwindCss grid classes](https://tailwindcss.com/docs/grid-column)
we want, in this case renders **2 fields per row** from the `sm` responsive [Tailwind breakpoint](https://tailwindcss.com/docs/screens) 
by expanding to:

```csharp
Input.For<UserAuth>(x => x.FirstName, c => c.Input.Css.Field = "col-span-12 sm:col-span-6")
```

### Configure Types

In addition to `ConfigureOperation<T>` for customizing the metadata for a single operation, there's also 
`ConfigureType<T>` for customizing the metadata for a single DTO Type and `ConfigureOperations(op => ...)` 
for registering a single lambda to customize the metadata for all Operations and `ConfigureTypes(type => ...)`
to do the same for all DTO Types.

Unlike the AutoGen `TypeFilter` to 
[Modify Dynamic Types at Runtime](/locode/database-first.html#modifying-dynamic-types-at-runtime)
which is only executed for customizing code-gen Types, these metadata APIs can be used for customizing the metadata
of both [Database-First](/locode/database-first) and [Code-First](/locode/code-first) Types.

So if the [Northwind Database-First](https://northwind.locode.dev) and 
[Chinook Code-First](https://chinook.locode.dev) were both configured in the same App, you could use a single lambda
to configure the metadata in both, e.g:

```csharp
var icons = new Dictionary<string, ImageInfo>
{
    [nameof(AppUser)] = Svg.CreateImage(Svg.Body.User),
    [nameof(CrudEvent)] = Svg.CreateImage(Svg.Body.History),
    [nameof(UserAuthDetails)] = Svg.CreateImage(Svg.Body.UserDetails),
    [nameof(UserAuthRole)] = Svg.CreateImage(Svg.Body.UserShield),
  
    // Northwind
    ["Category"] = Svg.CreateImage("<path fill='currentColor' d='M20 5h-9.586L8.707 3.293A.997.997 0 0 0 8 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z'/>"),
    //...

    // Chinook
    [nameof(Tracks)] = Svg.CreateImage("<path fill='currentColor' d='M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z'/>"),
    //...
};

appHost.ConfigureTypes(type => {
    if (icons.TryGetValue(type.Name, out var icon))
        type.Icon = icon;

    if (type.HasNamedConnection("chinook"))
    {
        type.Properties.Each(prop => {
            if (prop.IsPrimaryKey != true && references.TryGetValue(prop.Name, out var refInfo))
                prop.Ref = refInfo;
        });
        
        if (type.Name == nameof(Tracks))
        {
            type.Property(nameof(Tracks.Bytes)).Format = new FormatInfo { Method = FormatMethods.Bytes };
            type.Property(nameof(Tracks.Milliseconds)).Format = new Intl(IntlFormat.DateTime) {
                Minute = DatePart.Digits2,
                Second = DatePart.Digits2,
                FractionalSecondDigits = 3,
            }.ToFormat();
            type.Property(nameof(Tracks.UnitPrice)).Format = new IntlNumber(NumberStyle.Currency) {
                Currency = NumberCurrency.USD
            }.ToFormat();
        }
    }

    switch (type.Name)
    {
        case "Order":
            type.EachProperty(x => x.Name.EndsWith("Date"), x => x.Format = dateFormat);
            type.Property("Freight").Format = currency;
            type.Property("ShipVia").Ref = new() { Model = "Shipper", RefId = "Id", RefLabel = "CompanyName" };
            break;
        case "OrderDetail":
            type.Property("UnitPrice").Format = currency;
            type.Property("Discount").Format = percent;
            break;
        case "Employee":
            type.Property("PhotoPath").Format = new FormatInfo { Method = FormatMethods.IconRounded };
            type.Property("ReportsTo").Ref = new RefInfo { Model = "Employee", RefId = "Id", RefLabel = "LastName" };
            type.ReorderProperty("PhotoPath", before: "Title");
            type.ReorderProperty("ReportsTo", after: "Title");
            break;
        case "EmployeeTerritory":
            type.Property("TerritoryId").Ref = new() { Model = "Territory", RefId = "Id", RefLabel = "TerritoryDescription" };
            break;
        case "Supplier":
        case "Customer":
            type.Property("Phone").Format = new FormatInfo { Method = FormatMethods.LinkPhone };
            type.Property("Fax").Format = new FormatInfo { Method = FormatMethods.LinkPhone };
            break;
    }
});
```

### Typed APIs

One of the benefits of using code to customize inputs is having access to more typed API like `Input.Types.Email`
given they have access to all implementation libraries whereas since 
[ServiceModel DTOs](/physical-project-structure#servicemodel-project) shouldn't reference any 
implementation assemblies they'll need to use the `[Input(Type="email")]` string literal instead, although the Typed API 
can still serve as a reference for the supported input types:

```csharp
public static class Input
{
    public static class Types
    {
        public const string Text = "text";
        public const string Checkbox = "checkbox";
        public const string Color = "color";
        public const string Date = "date";
        public const string DatetimeLocal = "datetime-local";
        public const string Email = "email";
        public const string File = "file";
        public const string Hidden = "hidden";
        public const string Image = "image";
        public const string Month = "month";
        public const string Number = "number";
        public const string Password = "password";
        public const string Radio = "radio";
        public const string Range = "range";
        public const string Reset = "reset";
        public const string Search = "search";
        public const string Submit = "submit";
        public const string Tel = "tel";
        public const string Time = "time";
        public const string Url = "url";
        public const string Week = "week";
        public const string Select = "select";
        public const string Textarea = "textarea";
    }
    //...
}
```

### Input Reference

All Input customizations serializes down to the `InputInfo` Metadata DTO which we can see is able to customize 
most HTML `<input>` attributes to be able to provide a more optimized UX like client-side validation:

```csharp
public class InputInfo : IMeta
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }
    public string Placeholder { get; set; }
    public string Help { get; set; }
    public string Label { get; set; }
    public string Title { get; set; }
    public string Size { get; set; }
    public string Pattern { get; set; }
    public bool? ReadOnly { get; set; }
    public bool? Required { get; set; }
    public bool? Disabled { get; set; }
    public string Autocomplete { get; set; }
    public string Autofocus  { get; set; }
    public string Min { get; set; }
    public string Max { get; set; }
    public int? Step { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
    public string Accept  { get; set; }
    public string Capture  { get; set; }
    public bool? Multiple { get; set; }
    public string[] AllowableValues { get; set; }
    public KeyValuePair<string,string>[] AllowableEntries { get; set; }
    public string Options  { get; set; }
    public bool? Ignore { get; set; }
    public FieldCss Css { get; set; }
}
```

## Table Relations and Modal Lookups

To provide a great UX-Friendly UI suitable for end users, Locode includes a UI solution for linking related data that
avoids users from having to deal with raw Foreign Key Ids by instead allowing them to select related records using
a rich modal dialog with support for flexible multi column sorting and powerful querying capabilities.

Where possible ServiceStack will populate these **UI references** when their Data Models are defined with OrmLite's [POCO References](/ormlite/reference-support) or follows the `{Model}Id` naming convention for FK Properties, e.g:

```csharp
public class JobApplication : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    // Explicit Reference to Job
    [References(typeof(Job))]
    public int JobId { get; set; }
    
    // Implicit Reference to Contact
    public int ContactId { get; set; } 
    //...
}
```

The effect of which will upgrade the Foreign Key Ids from raw **number** Inputs to use Modal Lookups to search their related tables where
this CRUD API to Create Job Applications:

```csharp
public class CreateJobApplication : ICreateDb<JobApplication>, IReturn<JobApplication>
{
    [ValidateGreaterThan(0)]
    public int JobId { get; set; }
    
    [ValidateGreaterThan(0)]
    public int ContactId { get; set; }
    
    public DateTime AppliedDate { get; set; }
    
    public JobApplicationStatus ApplicationStatus { get; set; }
    
    [Input(Type = "file"), UploadTo("applications")]
    public List<JobApplicationAttachment> Attachments { get; set; }
}
```

Renders this Form that uses Modal Lookups for `JobId` and `ContactId` properties, a **date** control for `AppliedDate` a `<select>` dropdown
for `JobApplicationStatus` Enum and a multiple File Input control for `Attachments`

![](/img/pages/locode/talent/create-job-application-empty.png)

Clicking on the `JobId` field will launch a Modal Lookup searching the `Job` table with multi-column sorting and filtering capabilities:

![](/img/pages/locode/talent/lookup-job.png)

After selecting the related records the lookup fields will be populated with both the first **Text** column of the table and the ForeignKey Id:

![](/img/pages/locode/talent/create-job-application.png)

### Custom UI References

If our FK References doesn't use explicit references, follows the naming reference convention or we just want to override the UI Reference, 
we can explicitly define the UI Reference with the `[Ref]` attribute which in this case will create an Employee Lookup field for the 
`ReportsTo` property:

```csharp
public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    [Ref(Model = nameof(Employee), RefId = nameof(Id), RefLabel = nameof(LastName))]
    public int ReportsTo { get; set; }
    //...
}
```

### Database-First UI References

Implicit UI References are also populated when using a [Database-first](/locode/database-first) approach with Foreign Key columns, table relationships 
and relevant look up tables reflected in the Locode App, as can be seen in in Locode's Northwind example in its
[Product](https://northwind.locode.dev/locode/QueryProducts?edit=1), 
[Order](https://northwind.locode.dev/locode/QueryOrders?edit=10248) and 
[OrderDetails](https://northwind.locode.dev/locode/QueryOrderDetails?edit=10248%2F11) tables.

When the reference can't be inferred we can dynamically add it using AutoQuery's `TypeFilter` by adding the `[Ref]` attribute to the Data Model property:

```csharp
TypeFilter = (type, req) =>
{
    ...
    if (type.Name == "Employee" || type.IsCrudCreateOrUpdate("Employee"))
    {
        ...
        if (type.IsCrud())
        {
            ...
        }
        else if (type.Name == "Employee")
        {
            type.Property("ReportsTo").AddAttribute(
                new RefAttribute { Model = "Employee", RefId = "Id", RefLabel = "LastName" });
        }
    }
}
```

Which has the same behavior as the code-first `[Ref]` attribute in enabling the Employee lookup field for the `ReportsTo` property making it is easy to select the Employee's reporting Manager `Id`:

![](/img/pages/locode/locode-lookup.gif)

When defining UI relationships, `RefModel` determines the Foreign Key Table used in the Model Lookup, `RefId` is the target FK Primary Key whilst 
`RefLabel` specifies which text field to use to better describe the Record.
