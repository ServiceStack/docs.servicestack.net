---
title: Design Message-based APIs
slug: design-message-based-apis
---

To give you a flavor of the differences you should think about when designing message-based services in ServiceStack we'll 
look at some examples to contrast WCF/WebApi vs ServiceStack's approach:

## WCF vs ServiceStack API Design

WCF encourages you to think of web services as normal C# method calls, e.g:

```csharp
public interface IWcfCustomerService
{
    Customer GetCustomerById(int id);
    List<Customer> GetCustomerByIds(int[] id);
    Customer GetCustomerByUserName(string userName);
    List<Customer> GetCustomerByUserNames(string[] userNames);
    Customer GetCustomerByEmail(string email);
    List<Customer> GetCustomerByEmails(string[] emails);
}
```

This is what the same Service contract would look like in ServiceStack:

```csharp
public class Customers : IReturn<List<Customer>> 
{
    public int[] Ids { get; set; }
    public string[] UserNames { get; set; }
    public string[] Emails { get; set; }
}
```
    
The important concept to keep in mind is that the entire query (aka Request) is captured in the Request Message 
(i.e. Request DTO) and not in the server method signatures. The obvious immediate benefit of adopting a message-based 
design is that any combination of the above RPC calls can be fulfilled in 1 remote message, by a single service implementation 
which improves cacheability and simplifies maintenance and testing with the reduced API surface area.

## WebApi vs ServiceStack API Design

Likewise WebApi promotes a similar C#-like RPC Api that WCF does:

```csharp
public class ProductsController : ApiController 
{
    public IEnumerable<Product> GetAllProducts() 
    {
        return products;
    }

    public Product GetProductById(int id) 
    {
        var product = products.FirstOrDefault((p) => p.Id == id);
        if (product == null)
        {
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
        return product;
    }

    public Product GetProductByName(string categoryName) 
    {
        var product = products.FirstOrDefault((p) => p.Name == categoryName);
        if (product == null)
        {
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
        return product;
    }

    public IEnumerable<Product> GetProductsByCategory(string category) 
    {
        return products.Where(p => string.Equals(p.Category, category,
                StringComparison.OrdinalIgnoreCase));
    }

    public IEnumerable<Product> GetProductsByPriceGreaterThan(decimal price) 
    {
        return products.Where((p) => p.Price > price);
    }
}
```

### ServiceStack Message-Based API Design

Whilst ServiceStack encourages you to retain a Message-based Design:

```csharp
public class SearchProducts : IReturn<List<Product>> 
{
    public string Category { get; set; }
    public decimal? PriceGreaterThan { get; set; }
}

public class GetProduct : IReturn<Product> 
{
    public int? Id { get; set; }
    public string Name { get; set; }
}

public class ProductsService : Service 
{
    public object Get(SearchProducts request) 
    {
        var ret = products.AsQueryable();
        if (request.Category != null)
            ret = ret.Where(x => x.Category == request.Category);
        if (request.PriceGreaterThan.HasValue)
            ret = ret.Where(x => x.Price > request.PriceGreaterThan.Value);            
        return ret.ToList();
    }

    public Product Get(GetProduct request) 
    {
        var product = request.Id.HasValue
            ? products.FirstOrDefault(x => x.Id == request.Id.Value)
            : products.FirstOrDefault(x => x.Name == request.Name);

        if (product == null)
            throw new HttpError(HttpStatusCode.NotFound, "Product does not exist");

        return product;
    }
}
```

Again capturing the essence of the Request in the Request DTO. The message-based design is also able to condense 
**5 separate RPC** WebAPI Services into **2 message-based** ServiceStack Services. 

## Group by Call Semantics and Response Types

It's grouped into 2 different services in this example based on **Call Semantics** and **Response Types**:

Every property in each Request DTO has the same semantics that is for `SearchProducts` each property acts like a Filter 
(e.g. an AND) whilst in `GetProduct` it acts like a combinator (e.g. an OR). The Services also return `List<Product>` 
and `Product` return types which will require different handling in the call-sites of Typed APIs.

In WCF / WebAPI (and other RPC services frameworks) whenever you have a client-specific requirement you would add a new 
Server signature on the controller that matches that request. In ServiceStack's message-based approach however you're 
instead encouraged to think about where this feature intuitively fits and whether you're able to enhance existing services. 
You should also be thinking about how you can support the client-specific requirement in a **generic way** so that the 
same service could benefit other future potential use-cases.

### Separate One and Many Services

We can use the above context as a guide to design new Services. If we needed to design a Bookings System that needed an API
to return **All Bookings** and a **Single Booking** we'd use a separate Services as they'd have different Response Types, e.g. 
`GetBooking` returns 1 booking whilst `GetBookings` returns many.

### Distinguish Service Operations vs Types 

There should be a clean split between your Operations (aka Request DTOs) which is unique per service and is used to capture the 
Services' request, and the DTO types they return. Request DTOs are usually actions so they're verbs, whilst DTO types are 
entities/data-containers so they're nouns. 

### Returning naked collections

ServiceStack can return naked collections that [don't require a ResponseStatus](/error-handling#error-response-types) property 
since if it doesn't exist the generic `ErrorResponse` DTO will be thrown and serialized on the client instead which frees you 
from having your Responses contain `ResponseStatus` property. 

### Returning coarse-grained Response DTOs

However since they offer better versionability that can later be extended to return more results without breaking existing 
clients we prefer specifying explicit Response DTOs for each Service, although this is entirely optional. So our preferred 
message-based would look similar to:

```csharp
// Operations
[Route("/bookings/{Id}")]
public class GetBooking : IReturn<GetBookingResponse>
{
    public int Id { get; set; }
}

public class GetBookingResponse
{
    public Booking Result { get; set; }
    public ResponseStatus ResponseStatus { get; set; } // inject structured errors
}

[Route("/bookings/search")]
public class SeachBookings : IReturn<SeachBookingsResponse>
{      
    public DateTime BookedAfter { get; set; }
}

public class SeachBookingsResponse
{
    public List<BookingLimit> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; } // inject structured errors 
}

// Types
public class Booking
{
    public int Id { get; set; }
    public int ShiftId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Limit { get; set; }
}
```

When they're not ambiguous we'll typiclly leave out specifying the **Verb** in `[Route]` definitions for **GET** Requests as its unnecessary.

### Using AutoQuery

Where possible we'll also use [AutoQuery for Search Services](/autoquery/rdbms) which require dramatically less effort whilst
offering a lot more functionality out-of-the-box. E.g. The Search Bookings Service with AutoQuery could adopt the same Customer
Route and properties:

```csharp
[Route("/bookings/search")]
public class SeachBookings : QueryDb<Booking>
{      
    public DateTime BookedAfter { get; set; }
}
```

But no implementation is needed as AutoQuery automatically creates the optimal implementation. AutoQuery also supports [Implicit Conventions](/autoquery/rdbms#implicit-conventions) where you're able to filter by any of `Booking` table columns without any additional code or effort.

### Keep a consistent Nomenclature

You should reserve the word **Get** on services which query on unique or Primary Keys fields, i.e. when a supplied value 
matches a field (e.g. Id) it only **Gets** 1 result. For "Search Services" that acts like a filter and returns multiple 
matching results which falls within a desired range we recommend using prefixing Services with the **Search** or **Find** verbs 
to signal the behavior of the Service.

### Self-describing Service Contracts

Also try to be descriptive with each of your field names, these properties are part of your **public API** and should be 
self-describing as to what it does. E.g. By just looking at the Service Contract (e.g. Request DTO) we'd have no idea what 
a plain **Date** property means, as it could mean either **BookedAfter**, **BookedBefore** or **BookedOn** if it only returned 
bookings made on that Day. 

The benefit of this is now the call-sites of your [Typed .NET clients](/csharp-client) become easier to read:

```csharp
Product product = client.Get(new GetProduct { Id = 1 });

var response = client.Get(new SearchBookings { BookedAfter = DateTime.Today });
```

## Service implementation

[Filter Attributes](/filter-attributes) can be applied on either the **class** or **method** level, so when you need to secure all Operations within a given Service you can just annotate the top-level Service class with the `[Authenticate]`, e.g:

```csharp
[Authenticate]
public class BookingsService : Service 
{ 
    public object Get(GetBooking request) => ...;

    public object Get(SearchBookings request) => ...;
}
```

## Error Handling and Validation

For info on how to add validation you either have the option to just [throw C# exceptions](/error-handling#throwing-c-exceptions) 
and apply your own customizations to them. You also have the option to use the built-in [Fluent Validation](/validation) 
but you don't need to inject them into your service as they can all be registered with a single line in your AppHost, e.g:

```csharp
container.RegisterValidators(typeof(CreateBookingValidator).Assembly);
```

Validators are no-touch and invasive free meaning you can add them using a layered approach and maintain them without 
modifying the service implementation or DTO classes. Since they require an extra class We'd only use them on operations 
with side-effects e.g. **POST** or **PUT**, as **GET** requests tend to have minimal validation so throwing C# Exceptions 
typically requires less boilerplate. Here's an example of a validator you could have when creating a Booking:

```csharp
public class CreateBookingValidator : AbstractValidator<CreateBooking>
{
    public CreateBookingValidator()
    {
        RuleFor(r => r.StartDate).NotEmpty();
        RuleFor(r => r.ShiftId).NotEmpty().GreaterThan(0);
        RuleFor(r => r.Limit).NotEmpty().GreaterThan(0);
    }
}
```

Depending on the use-case instead of having separate `CreateBooking` and `UpdateBooking` DTOs you could re-use the same 
`StoreBooking` Request DTO to handle both operations.
