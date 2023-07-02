---
title: Physical Project Structure
---

The Recommended structure below is built into all ServiceStackVS VS.NET Templates where creating any new ServiceStack project will create a solution with a minimum of 4 projects:

<img class="ml-4 float-right" src="/img/pages/solution-layout.png" />

### Host Project

The Host project contains your AppHost that references and registers all your App's concrete dependencies in its IOC. It also contains any Web Assets like any Razor Views, JS, CSS, Images, Fonts, etc. that's needed to deploy with your App. The AppHost is the master project which references all dependencies used by your App whose role is to act like a conduit where it decides which concrete implementations should be used. By design it references everything and nothing references it which as a goal should be kept logic-free.

### ServiceInterface Project

The ServiceInterface project is the implementation project where all Business Logic and Services live which typically references every other project except the Host projects. Small and Medium projects can maintain all their implementation here where logic can be grouped under sub feature folders. Large solutions can split this project into more manageable cohesive and modular projects which we also recommend encapsulates any dependencies they might use.

### ServiceModel Project

The ServiceModel Project contains all your Application's DTOs which is what defines your Services contract, keeping them isolated from any Server implementation is how your Service is able to encapsulate its capabilities and make them available behind a remote facade. There should be the only ServiceModel project per solution which should be impl, dependency and logic-free which should only reference the impl/dep-free **ServiceStack.Interfaces.dll** contract assembly to ensure Service contracts are decoupled from its implementation, enforces interoperability ensuring that your Services don't mandate specific client implementations and will ensure this is the only project clients need to be able to call any of your Services using either referencing the **ServiceModel.dll** directly or downloading the DTOs from a remote ServiceStack instance using [Add ServiceStack Reference](/add-servicestack-reference):

![](/img/pages/dtos-role.png)

### Test Project

The Unit Test project contains all your Unit and Integration tests. It's also a Host project that typically references all other non-Host projects in the solution and contains a combination of concrete and mock dependencies depending on what's being tested. See the [Testing Docs](/testing) for more information on testing ServiceStack projects.

## Concrete Example

Ideally the root-level **AppHost** project should be kept lightweight and implementation-free. Although for small/prototype projects with only a few services it's fine for everything to be in a single project and to simply grow your architecture when and as needed. 

For medium-to-large projects we recommend the physical structure below we've modelled after this [concrete Events example](http://stackoverflow.com/a/15235822/85785) to describe how we'd typically layout a ServiceStack project. For the purposes of this illustration we'll assume our Application is called **EventMan**. 

The order of the projects also show its dependencies, e.g. the top-level `EventMan` project references **all** sub projects whilst the last `EventMan.ServiceModel` project references **none**:

```
/EventMan
  AppHost.cs                  // The ServiceStack ASP.NET Web or Console Host Project

/EventMan.ServiceInterface    // All Service implementations (akin to MVC Controllers)
  EventsService.cs
  EventsReviewsService.cs

/EventMan.Logic               // For larger projs: pure C# logic deps, data models, etc
  IGoogleCalendarGateway      // E.g of a external dependency this project could use

/EventMan.ServiceModel        // Service Request/Response DTOs and DTO types in /Types
  Events.cs                   // Events, CreateEvent, GetEvent, UpdateEvent DTOs 
  EventReviews.cs             // EventReviews, GetEventReview, CreateEventReview DTOs
  /Types
    Event.cs                  // Event type
    EventReview.cs            // EventReview type
```

With the `EventMan.ServiceModel` DTO's kept in their own separate implementation and dependency-free dll, you're freely able to share this dll in any .NET client project as-is - which you can use with any of the generic [C# Service Clients](/csharp-client) to provide an end-to-end typed API without any code-gen.

## Documented Example Project

The [EmailContacts solution](https://github.com/ServiceStack/EmailContacts/) details the recommended setup and physical layout structure of typical medium-sized ServiceStack projects. It includes the complete documentation going through how to create the solution from scratch, and explains all the ServiceStack hidden features it makes use of along the way.
