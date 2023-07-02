---
title: Design RESTful Services
slug: design-rest-services
---

ServiceStack encourages a message-based design so each Service should have its own distinct message (aka Request DTO) where it's able to use explicit properties to define what each Service accepts. Something to keep in mind 
is how you define and design your Services in ServiceStack are de-coupled in how you expose them which can be 
exposed under any custom Route. 

### Use a logical / hierarchical Url structure

We recommend adopting a logical hierarchically structured URL that represents the identifier of a resource, i.e. 
the parent path categorizes your resource and gives it meaningful context. So if you needed to design an API for  System that maintained **Events** and their **Reviews** it could adopt the following url structure:

```
/events             # all events
/events/1           # event #1
/events/1/reviews   # event #1 reviews
```

Where each of the above resource identifiers can be invoked using any HTTP **Verb** which represents the action to take on them, e.g:

```
GET    /events        # View all Events
POST   /events        # Create a new Event
PUT    /events/{Id}   # Update an existing Event
DELETE /events/{Id}   # Delete an existing Event
```

### Implementing RESTful Routes

For their implementation ServiceStack encourages a message-based design that groups all related operations based on **Response type** and **Call Context**. For an Events and Reviews system it could look something like:

```csharp
[Route("/events", "GET")]
[Route("/events/category/{Category}", "GET")]    // Optional GET example 
public class SearchEvents : IReturn<List<Event>>
{
    //resultset filter examples, e.g. ?Category=Tech&Query=servicestack
    public string Category { get; set; } 
    public string Query { get; set; }
}

[Route("/events", "POST")]
public class CreateEvent : IReturn<Event>
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
}

[Route("/events/{Id}", "GET")]
[Route("/events/code/{EventCode}", "GET")] // Alternative Id
public class GetEvent : IReturn<Event>
{
    public int Id { get; set; }
    public string EventCode { get; set; } // Alternative to fetch Events
}

[Route("/events/{Id}", "PUT")]
public class UpdateEvent : IReturnVoid
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
}
```

Event Reviews would follow a similar pattern:
    
```csharp
[Route("/events/{EventId}/reviews", "GET")]
public class GetEventReviews : IReturn<List<EventReview>>
{
    public int EventId { get; set; }
}

[Route("/events/{EventId}/reviews/{Id}", "GET")]
public class GetEventReview : IReturn<EventReview>
{
    public int EventId { get; set; }
    public int Id { get; set; }
}

[Route("/events/{EventId}/reviews", "POST")]
public class CreateEventReview : IReturn<EventReview>
{
    public int EventId { get; set; }
    public string Comments { get; set; }
}
```

The above REST Service examples returns naked Types and collections which 
[ServiceStack has a great story for](/api-design#structured-error-handling), however our personal preference is to 
design more coarse-grained and versionable [Message-based APIs](/design-message-based-apis) where we'd use an explicit Response DTO for each Service, e.g:

```csharp
[Route("/events/{EventId}/reviews", "GET")]
public class GetEventReviews : IReturn<GetEventReviewsResponse>
{
    public int EventId { get; set; }
}

public class GetEventReviewsResponse
{
    public List<Event> Results { get; set; }
}

[Route("/events/{EventId}/reviews/{Id}", "GET")]
public class GetEventReview : IReturn<GetEventReviewResponse>
{
    public int EventId { get; set; }
    public int Id { get; set; }
}

public class GetEventReviewResponse
{
    public EventReview Result { get; set; }
    public ResponseStatus ResponseStatus { get; set; }  // inject structured errors if any
}

[Route("/events/{EventId}/reviews", "POST")]
public class CreateEventReview : IReturn<CreateEventReviewResponse>
{
    public int EventId { get; set; }
    public string Comments { get; set; }
}

public class CreateEventReviewResponse 
{
    public EventReview Result { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}
```

### Notes

The implementation of each Services then becomes straight-forward based on these messages, which (depending on code-base size) we'd recommend organizing in 2 **EventsService** and **EventReviewsService** classes.

Although `UpdateEvent` and `CreateEvent` are seperate Services here, if the use-case permits they can instead be handled by a single idempotent `StoreEvent` Service.

## [Physical Project Structure](/physical-project-structure)

Ideally the root-level **AppHost** project should be kept lightweight and implementation-free. Although for small projects or prototypes with only a few services it's ok for everything to be in a single project and to simply grow your architecture when and as needed. 

For medium-to-large projects we recommend the physical structure below which for the purposes of this example we'll assume our Application is called **Events**. 

The order of the projects also show its dependencies, e.g. the top-level `Events` project references **all** sub projects whilst the last `Events.ServiceModel` project references **none**:

```
    /Events
        AppHost.cs              // ServiceStack Web or Self Host Project

    /Events.ServiceInterface    // Service implementations (akin to MVC Controllers)
        EventsService.cs
        EventsReviewsService.cs

    /Events.Logic               // For large projects: extract C# logic, data models, etc
        IGoogleCalendarGateway  // E.g of a external dependency this project could use

    /Events.ServiceModel        // Service Request/Response DTOs and DTO types
        Events.cs               // SearchEvents, CreateEvent, GetEvent DTOs 
        EventReviews.cs         // GetEventReviews, CreateEventReview
        Types/
          Event.cs              // Event type
          EventReview.cs        // EventReview type
```

With the `Events.ServiceModel` DTO's kept in their own separate implementation and dependency-free dll, you're freely able to share this dll in any .NET client project as-is - which you can use with any of the generic [C# Service Clients](/csharp-server-events-client) to provide an end-to-end typed API without any code-gen.

## More Info

 - This recommended project structure is embedded in all [ServiceStackVS VS.NET Templates](/templates/).
 - The [Simple Customer REST Example](/why-servicestack#simple-customer-database-rest-services-example) is a small self-contained, real-world example of creating a simple REST Service utilizing an RDBMS.
