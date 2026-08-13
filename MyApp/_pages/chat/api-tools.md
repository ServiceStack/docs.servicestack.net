---
title: API Tools
---

**API Tools** let AI Models discover, learn and call your existing ServiceStack APIs. Your typed Request DTOs, metadata, validation, authorization and Services remain the single source of truth - there is no parallel schema, no bespoke function-calling gateway and no AI-specific application backend.

<screenshot src="/img/pages/chat/api-tools/api-tools.webp" title="API Tools"></screenshot>

## Three tools, not one per API

Sending every API schema to a Model on every request would be expensive, slow and confusing - a mature application's whole API surface is far too large to keep in context (270 APIs is roughly 156K tokens of schema). Instead, ServiceStack exposes three stable tools:

| Tool | Purpose |
| --- | --- |
| `api_search` | Find APIs relevant to the user's intent from a compact index |
| `api_describe` | Return complete schemas and workflow metadata for selected APIs |
| `api_call` | Invoke an API using its typed Request DTO, **as the current user** |

Only the search index is loaded eagerly; a Model pays for an API's schema only when it actually uses it.

<screenshot src="/img/pages/chat/api-tools/api-describe.webp" title="An API's schema returned by api_describe"></screenshot>

## Enabling API Tools

API Tools are **on by default** once `ChatFeature` is registered, but nothing is exposed until you opt an API in. There are three ways to do so:

```csharp
services.AddPlugin(new ChatFeature {
    ApiTools = {
        // expose every API with these [Tag]s in bulk
        IncludeTags = ["CoffeeShop", "Bookings"],

        // expose these Request DTOs by name, for APIs you can't annotate
        IncludeTypes = ["QueryCustomers"],

        // never expose these, whatever else includes them
        ExcludeTypes = ["DeleteAllOrders"],
    },
});
```

Plus the per-API opt-in, which is always included:

```csharp
[Tool("the user wants to browse the coffee shop menu")]
public class GetCoffeeShopMenu : IGet, IReturn<GetCoffeeShopMenuResponse> { }
```

| Property | Default | Description |
| --- | --- | --- |
| `IncludeTags` | `[]` | Expose every API carrying one of these `[Tag]`s |
| `IncludeTypes` | `[]` | Expose these Request DTOs by name |
| `ExcludeTypes` | `[]` | Never expose these, whatever else includes them |
| `DefaultTake` | `25` | Rows returned when neither the Agent nor `[Tool(Take)]` specifies a limit |
| `MaxTake` | `100` | Maximum rows an Agent can ask for, whatever it requests |
| `MaxResultLength` | `32 KB` | Result JSON longer than this is truncated |

`Tools.EnableApiTools = false` removes the capability entirely.

## The `[Tool]` attribute

Existing API metadata is used as-is and should not be repeated. `[Description]` and `[Notes]` document what the API does, `[Tag]` groups it, and property-level `[Description]`, `[ApiMember]` and `[ApiAllowableValues]` become the JSON Schema an Agent reads. `[Tool]` adds only what an Agent needs beyond that.

```csharp
[Tag("CoffeeShop")]
[Description("Returns the complete coffee shop menu with product IDs, prices, " +
             "valid sizes, temperatures and customization options")]
[Tool(
    "the user wants to browse the coffee shop menu, learn what can be ordered, " +
    "check prices, or build an order",
    Safety = ToolSafety.ReadOnly,
    Keywords = ["coffee", "drink", "food", "bakery", "customizations"])]
[Route("/coffee-shop/menu", "GET")]
public class GetCoffeeShopMenu : IGet, IReturn<GetCoffeeShopMenuResponse> { }
```

| Property | Description |
| --- | --- |
| `WhenToUse` | The situation that calls for this API. **The single most valuable thing you can add** - `[Description]` tells a developer what the API *does*; this tells an Agent *when to pick it* |
| `Name` | The name the Agent calls this tool by. Defaults to the Request DTO name. Conventionally snake_case |
| `Keywords` | Extra search terms a user might say that don't already appear in the name, route, tags or description |
| `Aliases` | Alternative names and user vocabulary that should resolve to this API |
| `Examples` | Example JSON request payloads returned alongside the schema |
| `Prerequisites` | APIs the Agent should normally call first |
| `Preview` | A read-only API that previews or validates this API's proposed arguments |
| `FollowUps` | APIs commonly useful after this one succeeds |
| `Safety` | `Auto`, `ReadOnly`, `Write` or `Destructive` |
| `RequiresApproval` | Require a human decision before every call, regardless of `Safety` |
| `Fields` | Comma-delimited fields the response is reduced to by default |
| `Take` | Default row limit for result sets |
| `Group` | Tool group this API is listed under. Defaults to its first `[Tag]` |
| `Exclude` | Hide this API even though something else would include it. Takes precedence over every opt-in |

### WhenToUse

`WhenToUse` is what makes discovery work. Phrase it as the user's situation, not the API's behaviour:

```csharp
// ✅ the situation that calls for it
[Tool("the user asks about a customer's orders, spend or contact details")]

// ❌ what the API does - [Description] already says this
[Tool("queries the Customers table and returns matching rows")]
```

### Examples

The highest accuracy-per-token you can buy for APIs whose usable inputs aren't obvious from their type alone. AutoQuery's implicit conventions (`%StartsWith`, `%Between`, `orderBy`, `fields`, `take`) don't appear in the generated schema at all - one realistic example teaches them all:

```csharp
[Tag("Northwind")]
[Description("Search Customers by company, contact or country")]
[Tool("the user asks who a customer is, where they're based or how to contact them",
    Keywords = ["client", "account", "buyer"],
    Examples = ["""{"countryStartsWith":"UK","take":10}"""],
    Fields = "id,companyName,country", Take = 25)]
public class QueryCustomers : QueryDb<Customer> { }
```

### Fields and Take

The main defence against a single call flooding the Agent's context. A table with 90 columns costs more to return once than the entire tool index costs to keep loaded:

```csharp
[Tool(Fields = "id,companyName,country", Take = 25)]
```

Both only limit the **default** - the Agent can still request other fields, bounded by `MaxTake`.

### Preview and workflow metadata

For consequential workflows, point the Agent at a read-only API that validates and prices a proposed request before the real one runs:

```csharp
[Tool("the user has finished choosing an order and wants to place or submit it",
    Safety = ToolSafety.Write,
    RequiresApproval = true,
    Prerequisites = ["GetCoffeeShopMenu"],
    Preview = "PreviewCoffeeShopOrder",
    FollowUps = ["GetCoffeeShopOrder"],
    Keywords = ["buy", "checkout", "place order"])]
[Route("/coffee-shop/orders", "POST")]
public class CreateCoffeeShopOrder : IPost, IReturn<CreateCoffeeShopOrderResponse>
{
    [Description("Name to put on the order")]
    [ValidateNotEmpty]
    public string CustomerName { get; set; } = "";

    [Description("Final order items. The approval form lets the user edit " +
                 "these before submission")]
    [ValidateNotEmpty]
    public List<OrderItemRequest> Items { get; set; } = [];
}
```

## Your metadata becomes AI context

API Tools reuse the machine-readable information your Apps already contain:

- Request and Response DTOs
- Routes and HTTP methods
- Property and API descriptions
- Required fields and declarative validation
- Enums and allowable values
- Authentication, roles, permissions, claims and scopes
- AutoQuery conventions and result types
- UI metadata such as `[Input]` and `[Ref]`

This is used to generate the JSON Schemas the Model reads **and** the schema-driven forms users edit. Existing investment in well-described, well-validated APIs immediately improves AI reliability.

## Human approval

Giving a Model access to an API should not mean giving it permission to perform every operation unattended. AI Chat infers safe defaults from HTTP semantics: reads execute immediately, whilst writes and destructive operations pause and render the proposed Request DTO as an **editable form**.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Approve the proposed order': '/img/pages/chat/api-tools/chat-coffeeshop-approval.webp',
    'Order confirmation after approval': '/img/pages/chat/api-tools/chat-coffeeshop-modified-order.webp',
}"></screenshots-gallery>

Only an approved request reaches the Service, and only a successful Service response lets the assistant report success. Afterwards the Model is told whether the user approved the proposal as-is or made changes, so it can acknowledge modifications.

The valuable part is that **no API-specific Chat component has to be written**. The approval form is generated from the API's own schema, so nested DTOs, collections, allowable values, descriptions and validation are all visible and editable - and every API you add later gets the same treatment for free.

## The AI acts as the authenticated user

API Tools are not a privileged backdoor into your application:

- Search, description and execution all run within the current HTTP request and authenticated identity.
- APIs the user cannot access are omitted from search, cannot be described and cannot be called.
- Existing authentication requirements, API-key rules, roles, permissions, claims and scopes remain enforced.
- Calls are deserialized into the real Request DTO and executed through ServiceStack's in-process Service Gateway.
- DTO validation, Service filters, business rules and database behaviour remain authoritative.

API tools can only run on behalf of a request - without one there is no user to run as, and executing anyway would run the App's APIs unauthenticated.

## The recommended workflow

The most dependable pattern for consequential operations:

<screenshot src="/img/pages/chat/api-tools/apitools-flow.svg" image-class="mx-auto max-h-[700px]"
    alt="Search → Describe → Resolve current data → Preview → Approve → Execute → Verify"></screenshot>

Each participant does what it's best at:

- The Model understands the user's language and chooses a workflow.
- ServiceStack supplies authoritative schemas and live capabilities.
- Read APIs resolve current IDs, allowed values, prices and state.
- Preview APIs normalize and validate without side effects.
- The user approves the exact operation that will be performed.
- Write APIs enforce business rules and persist the result.

<screenshot src="/img/pages/chat/api-tools/coffee-chat-order.webp" title="A complete natural language ordering workflow"></screenshot>

## Better APIs produce better Agents

API Tools remove most of the integration work but not the value of thoughtful API design. Models are most reliable when:

- APIs are focused and do one thing
- Names are clear and describe intent
- `[Description]` explains what an API is for
- Validation is declarative and at the boundary
- Write workflows provide a read-only preview
- Result sets are bounded with `Fields` and `Take`

## Example App

[NetCoreApps/CoffeeShopChat](https://github.com/NetCoreApps/CoffeeShopChat) is a complete natural-language ordering workflow built entirely from ordinary ServiceStack APIs:

[![CoffeeShopChat](/img/pages/chat/api-tools/coffeeshop-screenshot.webp)](https://github.com/NetCoreApps/CoffeeShopChat)

## Getting started on an existing App

Pick one read-only API, add a `[Tool]` attribute describing when to use it, and ask AI Chat a question that should reach it. Once discovery works for one API, adding the rest is just metadata.

To let external AI Assistants use the same tools, name the group over MCP - see [MCP Server](/chat/mcp).

<screenshot src="/img/pages/chat/api-tools/api-tools-architecture.webp" title="ServiceStack API Tools architecture"></screenshot>
