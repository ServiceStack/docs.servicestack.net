---
title: Generate CRUD APIs + UI
---

## AI powered Rapid App Development Workflow

The `okai` npm tool works similar to the online [Text to Blazor App](https://servicestack.net/text-to-blazor) creator
except it's a local tool that can add additional functionality to an existing project:

<ascii-cinema src="/img/pages/okai/okai-prompt-jobs.cast"
    loop="true" poster="npt:00:20" theme="dracula" rows="24" />

The syntax for adding a new feature to your ServiceStack App is `npx okai <prompt>`, e.g:

:::sh
npx okai "The type of App you would like to create"
:::

Where it will generate the Data Models, AutoQuery CRUD APIs, DB Migrations and Admin UI for the 
selected feature which you'll see after selecting the LLM Data Models you want to use, e.g:

```sh
Selected 'deepseek-r1:70b' data models

Saved: /projects/MyApp/MyApp.ServiceModel/Jobs.d.ts
Saved: /projects/MyApp/MyApp.ServiceModel/Jobs.cs
Saved: /projects/MyApp/wwwroot/admin/sections/Jobs.mjs
Saved: /projects/MyApp/wwwroot/admin/sections/index.mjs
Saved: /projects/MyApp/Migrations/Migration1001.cs

Run 'dotnet run --AppTasks=migrate' to apply new migration and create tables

To regenerate classes, update 'Jobs.d.ts' then run:
$ okai Jobs.d.ts
```

Where okai will generate everything needed to support the feature in your App, including:

- `MyApp.ServiceModel/Jobs.d.ts` - TypeScript Data Models
- `MyApp.ServiceModel/Jobs.cs` - AutoQuery CRUD APIs and Data Models
- `wwwroot/admin/sections/Jobs.mjs` - Admin UI Section
  - requires `blazor-admin` or `blazor-vue` template
- `MyApp/Migrations/Migration1001.cs` - DB Migrations
  - requires project with [OrmLite DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) 

## Creating Data Models from Scratch

You can also choose to create your TypeScript Data Models from scratch if you prefer not to start with generated AI Models, by running:

:::sh
npx okai init Todos.d.ts
:::

This will create a basic Data Model and run the code generation to generate the necessary files for it:

```txt
Saved: /projects/Acme/Acme.ServiceModel/api.d.ts
Saved: /projects/Acme/Acme.ServiceModel/Todos.cs
Saved: /projects/Acme/Acme/Migrations/Migration1002.cs
Saved: /projects/Acme/Acme/wwwroot/admin/sections/Todos.mjs
Saved: /projects/Acme/Acme/wwwroot/admin/sections/index.mjs
Saved: /projects/Acme/Acme.ServiceModel/Todos.d.ts

Run 'npm run migrate' to apply the new migration and create the new tables or:
$ dotnet run --AppTasks=migrate
```

With `Todos.d.ts` include the a reference to the [api.d.ts](https://okai.servicestack.com/api.d.ts) schema
and the necessary header config specifying which files it should generate along with an empty class where
you can start adding your Data Models for this feature:

```ts
/// <reference path="./api.d.ts" />
export type Config = {
  prompt:    "New Todo"
  api:       "~/Acme.ServiceModel/Todos.cs"
  migration: "~/Acme/Migrations/Migration1002.cs"
  uiMjs:     "~/Acme/wwwroot/admin/sections/Todos.mjs"
}

@tag("Todos")
export class Todo {
  id: number
  name: string
}
```

## Removing Data Models

If for whatever reason don't want the generated Data Models anymore, you can remove them from your code-base with:

:::sh
npx okai rm Todos.d.ts
:::

Which will remove the `*.d.ts` Data Models and all its associated generated files.

## Run Migrations

In order to create the necessary tables for any new functionality, you'll need to run the DB Migrations.

If migrations have never been run before, you can run the `migrate` npm script to create the initial database:

:::sh
npm run migrate
:::

This also lets you recreate it from scratch by running it after deleting the App's database (e.g. `App_Data/app.db`)

### Rerun Last Migration

If migrations have already been run, run the `rerun:last` npm script instead to **drop** and **re-run** the last migration:

:::sh
npm run rerun:last
:::

## Customize Data Models

The data models defined in the TypeScript Declaration file e.g. `Jobs.d.ts` is what drives the
generation of the Data Models, APIs, DB Migrations and Admin UIs.

This can be further customized by editing the TypeScript Declaration file and re-running the `okai` tool
with the name of the TypeScript Declaration file, e.g. `Jobs.d.ts`:

:::sh
npx okai Jobs.d.ts
:::

Which will re-generate the Data Models, APIs, DB Migrations and Admin UIs based on the updated Data Models.

![](/img/pages/okai/okai-Employees.webp)

:::tip
You only need to specify the `Jobs.d.ts` TypeScript filename (i.e. not the filepath) from
anywhere within your .NET solution
:::

### Live Code Generation

If you'd prefer to see the generated code in real-time you can add the `--watch` flag to watch the 
TypeScript Declaration file for changes and automatically re-generate the generated files on Save:

:::sh
npx okai Jobs.d.ts --watch
:::

<video autoplay="autoplay" loop="loop" controls>
    <source src="https://media.servicestack.com/videos/okai-watch.mp4" type="video/mp4">
</video>

## Declarative AI powered Features

The approach okai uses is very different from most AI tools which typically uses AI to generate an 
entire App or source code for a feature, instead okai only uses AI to generate the initial Data Models within 
a TypeScript Declaration `*.d.ts` file which we've found is best format supported by AI models that's also the 
best typed DSL for defining data models with minimal syntax that's easy for humans to read and write.

This is possible in ServiceStack since a significant portion of an App's functionality can be
[declaratively applied](https://docs.servicestack.net/locode/declarative) inc. 
[AutoQuery CRUD APIs](https://docs.servicestack.net/autoquery/crud) which can be implemented using only
Request DTOs to define the shape of the API to implement.

From the Data Models, the rest of the feature is generated using declarative classes depending
on the template used. 

### Generated Admin CRUD UI

To generate a CRUD Admin UI you'll need to use okai within a new Blazor Admin project or 
Blazor Vue ([blazor-vue](https://blazor-vue.web-templates.io)) project:

:::sh
x new blazor-admin Acme
:::

Which support a "Modular no-touch" Admin UI that will appear under a new group in the Admin Sidebar:

![](/img/pages/okai/okai-blazor-admin.webp)

## Modular Code Generation

Instead of unleashing AI on your code-base unabated, okai only uses AI to generate isolated functionality 
into grouped "no touch" source files that can be easily maintained and extended.

Creating a new Project with a similar prompt above would create a new project with the new source files
(marked `*`) added to the existing project:

### APIs

```files
/MyApp.ServiceModel
    Bookings.cs
    api.d.ts*
    Employees.cs*
    Employees.d.ts*
```

### Migration

```files
/MyApp/Migrations
    Migration1000.cs
    Migration1001.cs*
```

### UI

```files
/MyApp/wwwroot/admin
    /sections
        Bookings.mjs
        Employees.mjs*
        index.mjs*
    index.html
```

## Audited Data Models

The Instant CRUD UI also includes effortless support for maintaining a detailed audit history for changes to 
select tables by inheriting from the `AuditBase` base class, e.g:

```ts
export class Job extends AuditBase {
    ...
}
```

This will include additional `CreatedBy`, `CreatedDate`, `ModifiedBy`, `ModifiedDate`, `DeletedBy` and `DeletedDate`
properties to the specified Table and also generates the necessary [Audit Behaviors](https://docs.servicestack.net/autoquery/crud#apply-generic-crud-behaviors)
on the AutoQuery APIs to maintain the audit history for each CRUD operation.

### AutoQuery CRUD Audit Log

As the **blazor-admin** and **blazor-vue** templates are configured to use the [AutoQuery CRUD Executable Audit Log](https://docs.servicestack.net/autoquery/audit-log)
in its [Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Configure.AutoQuery.cs)
the Audit Behaviors will also maintain an Audit Trail of all CRUD operations which can be viewed in the Admin UI:

![](/img/pages/okai/okai-audit-form.webp)

## TypeScript Schema

In addition to being a great DSL for defining Data Models, using TypeScript also lets us define a schema
containing all the C# Types, interfaces, and attributes used in defining APIs, DTOs and Data Models in 
the accompanying [api.d.ts](https://okai.servicestack.com/api.d.ts) file.

This now lets us use TypeScript to define the [Bookings.cs](https://github.com/NetCoreTemplates/blazor-vue/blob/main/MyApp.ServiceModel/Bookings.cs) 
AutoQuery APIs and Data Models which blazor-admin uses instead in its [Bookings.d.ts](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp.ServiceModel/Bookings.d.ts):

```ts
/// <reference path="./api.d.ts" />
export type Config = {
    prompt:    "New Booking"
    api:       "~/MyApp.ServiceModel/Bookings.cs"
    migration: "~/MyApp/Migrations/Migration1001.cs"
    uiMjs:     "~/MyApp/wwwroot/admin/sections/Bookings.mjs"
}

export enum RoomType {
  Single,
  Double,
  Queen,
  Twin,
  Suite,
}

@Read.route("/bookings","GET")
@Read.route("/bookings/{Id}","GET")
@Read.description("Find Bookings")
@Create.route("/bookings","POST")
@Create.description("Create a new Booking")
@Update.notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")
@Update.route("/booking/{Id}","PATCH")
@Update.description("Update an existing Booking")
@Delete.route("/booking/{Id}","DELETE")
@Delete.description("Delete a Booking")
@tag("Bookings")
@icon({svg:"<svg>...</svg>"})
@notes("Captures a Persons Name & Room Booking information")
@description("Booking Details")
@validateHasRole("Employee")
export class Booking extends AuditBase {
  @autoIncrement()
  id: number
  @Create.description("Name this Booking is for")
  @validateNotEmpty()
  name: string
  roomType: RoomType
  @validateGreaterThan(0)
  roomNumber: number
  @intlDateTime(DateStyle.Long)
  bookingStartDate: Date
  @intlRelativeTime()
  bookingEndDate?: Date
  @intlNumber({currency:"USD"})
  @validateGreaterThan(0)
  cost: decimal
  @ref({model:"nameof(Coupon)",refId:"nameof(Coupon.Id)",refLabel:"nameof(Coupon.Description)"})
  @references("typeof(Coupon)")
  couponId?: string
  @reference()
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
  @reference({selfId:"nameof(CreatedBy)",refId:"nameof(User.UserName)",refLabel:"nameof(User.DisplayName)"})
  employee: User
}

@tag("Bookings")
@icon({svg:"<svg>...</svg>"})
export class Coupon extends AuditBase {
  id: string
  description: string
  discount: number
  expiryDate: Date
}
```

The benefit of this approach being that you can make a change to the Data Models and rerun the okai tool
to regenerate the AutoQuery APIs, DB Migrations and Admin UIs.

:::sh
npx okai Bookings.d.ts
:::

Which will regenerate its:
- APIs: [MyApp.ServiceModel/Bookings.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp.ServiceModel/Bookings.cs)
- DB Migration: [MyApp/Migrations/Migration1000.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Migrations/Migration1000.cs)
- Admin UI: [/wwwroot/admin/sections/Bookings.mjs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/wwwroot/admin/sections/Bookings.mjs)

What files will be generated is controlled by its `Config` section: 

```ts
export type Config = {
    prompt:    "New Booking"
    api:       "~/MyApp.ServiceModel/Bookings.cs"
    migration: "~/MyApp/Migrations/Migration1001.cs"
    uiMjs:     "~/MyApp/wwwroot/admin/sections/Bookings.mjs"
}
```

So if you no longer want the code regeneration to update the DB Migration for it, you can just remove it
from the Config.

## Rerunning Code Generation

The data models defined in the TypeScript Declaration file e.g. `Bookings.d.ts` is what drives the
generation of the Data Models, APIs, DB Migrations and Admin UIs.

This can be further customized by editing the TypeScript Declaration file and re-running the `okai` tool
with the name of the TypeScript Declaration file, e.g. `Bookings.d.ts`:

:::sh
npx okai Bookings.d.ts
:::

Which will re-generate the Data Models, APIs, DB Migrations and Admin UIs based on the updated Data Models.

![](/img/pages/okai/okai-Employees.webp)

Or add `--watch` to watch the TypeScript `*.d.ts` file for changes and automatically run code generation on Save:

:::sh
npx okai Bookings.d.ts --watch
:::

:::tip
You only need to specify the `Bookings.d.ts` TypeScript filename (i.e. not the filepath) from 
anywhere within your .NET solution
:::

### Single Data Model

One challenge with this approach is that there's only a single class used to define attributes for the Data Model,
Request and Response DTOs for all AutoQuery CRUD APIs.

### Smart API and Data Model attributes 

The okai tool resolves some issues with smart generation of attributes where any **"Data Model Attributes"**
like `[Icon]` class and `[AutoIncrement]` property attributes are only generated on the Data Model:

```ts
@icon({svg:"<svg>...</svg>"})
export class Booking {
    @autoIncrement()
    id: number
    @intlNumber({currency:"USD"})
    cost: decimal
}
```

Whilst **"API Attributes"** like `[Tag]` and `[ValidateHasRole]` class attribute and `[ValidateGreaterThan]` 
property attributes and are only generated on the APIs Request DTOs:

```ts
@tag("Bookings")
@validateHasRole("Employee")
export class Booking {
    @validateGreaterThan(0)
    cost: decimal
}
```

### Using C# Types in TypeScript Models

As JavaScript only has a limited set of types, the TypeScript **api.d.ts** schema also includes the 
built-in C# Types used when defining APIs, DTOs and Data Models which you'll be able to use when your
APIs need to use a specific .NET type, e.g:

```ts
export class Booking extends AuditBase {
  id: number
  name: string
  roomNumber: number
  bookingStartDate: Date
  bookingEndDate?: DateOnly
  cost: decimal
  cancelled?: boolean
}
```
 
Which uses the `DateOnly` and `decimal` .NET Types in its code generation:

```csharp
public class Booking : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateOnly? BookingEndDate { get; set; }
    public decimal Cost { get; set; }
    public bool? Cancelled { get; set; }
}
```

### API Targeted Attributes

When you need to add attributes to a specific API Request DTO you can use a **CRUD prefix** to have it only
applied to that specific AutoQuery API, e.g:

```ts
@Read.route("/bookings","GET")
@Read.route("/bookings/{Id}","GET")
@Create.route("/bookings","POST")
```

Where it would only the generated on the AutoQuery API that it targets, e.g:

```csharp
[Route("/bookings", "GET")]
[Route("/bookings/{Id}", "GET")]
public class QueryBookings : QueryDb<Booking> { ... }

[Route("/bookings", "POST")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse> { ... }
```

In addition to `Create.*`, `Read.*`, `Update.*`, `Delete.*` attributes to target specific AutoQuery CRUD APIs, 
you can also use `Write.*` to target all `Create`, `Update`, `Delete` write APIs.

### Ambiguous Attributes

Attributes that can be annotated on both the Data Model and API Request DTOs like `[Notes]` and `[Description]` 
are only generated on the Data Model and require using targeted attributes to apply to them to 
API Request DTOs, e.g:

```ts
@Read.description("Find Bookings")
@Create.description("Create a new Booking")
@Update.notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")
@Update.description("Update an existing Booking")
@Delete.description("Delete a Booking")
@notes("Captures a Persons Name & Room Booking information")
@description("Booking Details")
export class Booking extends AuditBase { ... }
```

Where the non-prefixed `@notes` and `@description` attributes are only generated on the Data Model whilst the 
targeted attributes are generated on their respective DTOs, e.g: 

```csharp
[Description("Find Bookings")]
public class QueryBookings : QueryDb<Booking> { ... }

[Description("Create a new Booking")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse> { ... }

[Notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")]
[Description("Update an existing Booking")]
public class UpdateBooking : IPatchDb<Booking>, IReturn<IdResponse> { ... }

[Description("Delete a Booking")]
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid { ... }
    
[Description("Booking Details")]
[Notes("Captures a Persons Name & Room Booking information")]
public class Booking : AuditBase { ... }
```

### Special Attribute Values

There's special behavior for `"nameof(...)"` and `"typeof(...)"` string attribute values where: 

```ts
export class Booking extends AuditBase {
    @ref({model: "nameof(Coupon)", refId: "nameof(Coupon.Id)", refLabel: "nameof(Coupon.Description)"})
    @references("typeof(Coupon)")
    couponId?: string
}
```

Will be generated with native C# syntax, i.e. instead of as strings:

```csharp
public class Booking : AuditBase
{
    [Ref(Model=nameof(Coupon),RefId=nameof(Coupon.Id),RefLabel=nameof(Coupon.Description))]
    [References(typeof(Coupon))]
    public string? CouponId { get; set; }
}
```

### Changing Default Attributes

To improve the default out-of-the-box experience some attributes are included by default, including:

 - `[Icon]` attribute on Data Models based on the Data Model name
   - prevent by adding empty `@icon()` attribute
 - `[AutoIncrement]` on `id` number properties if no other `[PrimaryKey]` attribute is defined
   - prevent by adding `@primaryKey()` or `@autoId()`
 - `[Validate*]` attributes added to Create/Update APIs on non-nullable properties
   - prevent by adding empty `@validate()` attribute

Here's an example which changes the default behavior for the default attributes above:

```ts
@icon()
export class Todo {
    @primaryKey()
    id: number
    @validate()
    name: string
}
```

Which will generate the C# APIs without the `[Icon]` and `[Validate]` attributes and replace `[AutoIncrement]`
with `[PrimaryKey]`, e.g:

```csharp
public class CreateTodo : ICreateDb<Todo>, IReturn<IdResponse>
{
    [ValidateGreaterThan(0)]
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Todo
{
    [PrimaryKey]
    public int Id { get; set; }
    public string Name { get; set; }
}
```

### Modifying ApplicationUser

In many cases the AI Models will want to generate a `User` class for their AI models. But as Blazor Apps
are already configured to use an `ApplicationUser` Identity Auth User class, the C# code generation only generates
the `User` class in a block comment with an instruction to merge it with your existing `User` class if you want to, e.g:

```csharp
/* merge with User DTO
/// <summary>
/// Interface defining the structure for a JobApplication.
/// Represents a user's application to a specific job.
/// </summary>
public class User
{
    [AutoIncrement]
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    /// <summary>
    /// Optional URL to the user's resume
    /// </summary>
    public string? ResumeUrl { get; set; }
}
*/
```

If you wish to add additional properties, you'll first need to add it your `ApplicationUser` class, e.g:

```csharp
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
    /// <summary>
    /// Optional URL to the user's resume
    /// </summary>
    public string? ResumeUrl { get; set; }
}
```

### Regenerating Identity Auth EF Migrations

You'll then need to regenerate the EF Migration to update the `AspNetUsers` table with the new columns by
running the `init-ef` npm script:

:::sh
npm run init-ef
:::

Which will delete the existing Migrations and create a new Migration to update the Identity Auth tables:

```json
{
    "scripts": {
        "init-ef": "node -e 'fs.readdirSync(`Migrations`).filter(x => !x.startsWith(`Migration`)).forEach(x => fs.rmSync(`Migrations/${x}`))' && dotnet ef migrations add CreateIdentitySchema",
    }
}
```

You can then delete your Primary Database (e.g. App_Data/app.db) and re-run the `migrate` npm script to recreate it:

:::sh
npm run migrate
:::

If you want the additional property to also be included in API Responses you'll also need to add it to your `User` DTO, e.g:

```csharp
/// <summary>
/// Public User DTO
/// </summary>
[Alias("AspNetUsers")]
public class User
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }

    public string? ResumeUrl { get; set; }
}
```

Which OrmLite and AutoQuery will use to query Identity Auth's `AspNetUsers` table.

### Custom APIs

When you need more fine-grained control over the generated APIs, you can "takeover" the generation of
an AutoQuery API by explicitly defining it yourself.

So if you prefer to use explicit API Request DTOs instead of targeted API attributes or need to control
the exact properties generated in each API, you can define the API Request DTOs yourself where when exists 
will skip generation for that API.

To showcase the differences between the single class approach, you can rewrite the above single class
approach with an explicit class for each AutoQuery API:

```ts
export enum RoomType {
  Single,
  Double,
  Queen,
  Twin,
  Suite,
}

@tag("Bookings")
@notes("Captures a Persons Name & Room Booking information")
@route("/bookings","GET")
@route("/bookings/{Id}","GET")
@autoApply(Behavior.AuditQuery)
@description("Find Bookings")
export class QueryBookings extends QueryDb<Booking> {
  id?: number
}

@tag("Bookings")
@route("/bookings","POST")
@autoApply(Behavior.AuditCreate)
@description("Create a new Booking")
@validateHasRole("Employee")
export class CreateBooking implements ICreateDb<Booking>, IReturn<IdResponse> {
  name?: string
  roomType?: RoomType
  @validateGreaterThan(0)
  roomNumber?: number
  bookingStartDate?: Date
  bookingEndDate?: Date
  @validateGreaterThan(0)
  cost?: decimal
  couponId?: string
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
}

@tag("Bookings")
@route("/bookings","PATCH")
@autoApply(Behavior.AuditModify)
@description("Create a new Booking")
@validateHasRole("Employee")
export class UpdateBooking implements IPatchDb<Booking>, IReturn<IdResponse> {
  name?: string
  roomType?: RoomType
  @validateGreaterThan(0)
  roomNumber?: number
  bookingStartDate?: Date
  bookingEndDate?: Date
  @validateGreaterThan(0)
  cost?: decimal
  couponId?: string
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
}

@tag("Bookings")
@route("/bookings/{Id}","DELETE")
@autoApply(Behavior.AuditSoftDelete)
@description("Delete a Booking")
@validateHasRole("Manager")
export class DeleteBookings implements IDeleteDb<Booking>, IReturnVoid {
  id?: number
}

@tag("Bookings")
@notes("Captures a Persons Name & Room Booking information")
@route("/bookings","GET")
@route("/bookings/{Id}","GET")
@description("Find Bookings")
export class Booking extends AuditBase {
  @autoIncrement()
  id: number
  @Create.description("Name this Booking is for")
  @Create.validateNotEmpty()
  name: string
  roomType: RoomType
  roomNumber: number
  @intlDateTime(DateStyle.Long)
  bookingStartDate: Date
  @intlRelativeTime()
  bookingEndDate?: Date
  @intlNumber({currency:"USD"})
  cost: decimal
  @ref({model:"nameof(Coupon)",refId:"nameof(Coupon.Id)",refLabel:"nameof(Coupon.Description)"})
  @references("typeof(Coupon)")
  couponId?: string
  @reference()
  discount?: Coupon
  @Write.input({type:"textarea"})
  notes?: string
  cancelled?: boolean
  @reference({selfId:"nameof(CreatedBy)",refId:"nameof(User.UserName)",refLabel:"nameof(User.DisplayName)"})
  employee: User
}

@description("Discount Coupons")
export class Coupon extends AuditBase {
  id: string
  description: string
  discount: number
  expiryDate: Date
}

@tag("Bookings")
@route("/coupons","GET")
@autoApply(Behavior.AuditQuery)
@description("Find Coupons")
export class QueryCoupons extends QueryDb<Coupon> {
  id?: string
}

@tag("Bookings")
@route("/coupons","POST")
@autoApply(Behavior.AuditCreate)
@description("Create a new Create")
@validateHasRole("Employee")
export class CreateCoupon implements ICreateDb<Coupon>, IReturn<IdResponse> {
  id: string
  description: string
  discount: number
  expiryDate: Date
}

@tag("Bookings")
@route("/coupons","PATCH")
@autoApply(Behavior.AuditModify)
@description("Create a new Coupon")
@validateHasRole("Employee")
export class UpdateCoupon implements IPatchDb<Coupon>, IReturnVoid {
  id: string
  description?: string
  discount?: number
  expiryDate?: Date
}

@tag("Bookings")
@route("/coupons/{Id}","DELETE")
@autoApply(Behavior.AuditSoftDelete)
@description("Delete a Coupon")
@validateHasRole("Manager")
export class DeleteCoupon implements IDeleteDb<Coupon>, IReturnVoid {
  id?: string
}
```

