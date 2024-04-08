---
title: Rate Limiting
---

Rate limiting is an important technique for protecting web APIs and applications from excessive traffic and abuse. 
By throttling the number of requests a client can make in a given time period, rate limiting helps ensure fair usage, 
maintains performance and availability, and defends against denial-of-service attacks.

ASP.NET Core provides built-in middleware for rate limiting based on client IP address or client ID. And now with [ServiceStack v8.1](/releases/v8_01), 
ServiceStack has added support for ASP.NET Core endpoints, making it possible to leverage the same rate limiting middleware 
across all ASP.NET Core endpoints, including ServiceStack APIs.

In this post, we'll look at how to enable rate limiting in an ASP.NET Core app using the standard middleware. 
Then we'll explore some more advanced options to fine-tune the rate limiting behavior. Finally, we'll see how to implement 
per-user rate limiting for multi-tenant SaaS applications using ASP.NET Core Identity and ServiceStack Mapped Endpoints.

Setting Up Rate Limiting To get started, let's enable the basic rate limiting middleware in an ASP.NET Core application:

1. Install the `Microsoft.AspNetCore.RateLimiting` NuGet package
2. In the `Program.cs`, add `AddRateLimiter` to register the rate limiting services:

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), 
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
    
    options.OnRejected = (context, cancellationToken) =>
    {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();
        }

        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.");

        return new ValueTask();
    };
});
```

This sets up a fixed window rate limiter with a limit of 100 requests per minute, partitioned by either authenticated username or client host name.

1. Add the `UseRateLimiter` middleware to the pipeline:

```csharp
app.UseRateLimiter();
```

With this basic setup, the API is now protected from excessive requests from individual clients. 
If a client exceeds the limit of 100 requests/minute, subsequent requests will receive a `HTTP 429 Too Many Requests` response.

Advanced Options The rate limiting middleware provides several options to customize the behavior:

- `PermitLimit` - The maximum number of requests allowed in the time window
- `QueueLimit` - The maximum number of requests that can be queued when the limit is exceeded. Set to 0 to disable queueing.
- `Window` - The time window for the limit, e.g. 1 minute, 1 hour, etc.
- `AutoReplenishment` - Whether the rate limit should reset automatically at the end of each window

For example, to allow short bursts but constrain average rate, we could implement a sliding window algorithm:

```csharp
options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    RateLimitPartition.GetSlidingWindowLimiter(
        partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
        factory: partition => new SlidingWindowRateLimiterOptions
        {
            AutoReplenishment = true,
            PermitLimit = 100,
            QueueLimit = 25,
            Window = TimeSpan.FromMinutes(1),
            SegmentsPerWindow = 4
        }));

options.OnRejected = (context, cancellationToken) =>
{
    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
    {
        context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();
    }

    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
    context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.");

    return new ValueTask();
};
```

This allows up to 100 requests per minute on average, with the ability to burst up to 25 additional requests which are queued.

## Per-User Rate Limiting for SaaS Applications

In a typical SaaS application, each user or tenant may have a different subscription plan that entitles them to a certain level of API usage. 
We can implement this per-user rate limiting by leveraging ASP.NET Core Identity to authenticate users and retrieve their plan details, 
and then configuring the rate limiter accordingly.

First, ensure you have ASP.NET Core Identity set up in your application to handle user authentication. Then, add a property to your 
user class to store the rate limit for each user based on their plan:

```csharp
public class ApplicationUser : IdentityUser
{
    public int RateLimit { get; set; }
}
```

Next, update the rate limiter configuration to partition by user and read the rate limit from the user's plan:

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("per-user", context =>
    {
        var user = context.User.Identity?.Name;
        if (string.IsNullOrEmpty(user))
        {
            // Fallback to host name for unauthenticated requests
            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: context.Request.Headers.Host.ToString(),
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 100,
                    QueueLimit = 0,
                    Window = TimeSpan.FromMinutes(1)
                });
        }
        // User exists
        // Get the user's rate limit from their plan
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userManager = context.RequestServices.GetService<UserManager<ApplicationUser>>();
        var appUser = userManager.FindByIdAsync(userId).Result;
        var rateLimit = appUser?.RateLimit ?? 0;

        // Create a user-specific rate limiter
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: user,
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = rateLimit,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            });
    });
});
```

This configuration first checks if the request is authenticated. If not, it falls back to the default host-based rate limiting.

For authenticated requests, it retrieves the user ID from the authentication claims and looks up the user in the ASP.NET Core Identity `UserManager`. 
It then reads the `RateLimit` property from the user object, which should be set based on the user's subscription plan.

Finally, it creates a user-specific rate limiter using the `PartitionedRateLimiter` with the user's ID as the partition key and 
their personal rate limit as the `PermitLimit`.

With this setup, each user will be rate limited independently based on their plan allowance. If a user exceeds their personal limit, 
they will receive a `429 Too Many Requests` response, while other users can continue making requests up to their own limits.

Not only that, our rate handling is consistent across ASP.NET Core Endpoints regardless of how they are implemented, be it ServiceStack APIs, 
MVC Controllers, Minimal APIs etc. If you do need to target ServiceStack APIs with a specific policy name, you can create one with a 
policy name and use it when calling `UseServiceStack`.

```csharp
services.AddRateLimiter(options =>
{
    // Policy name "per-user" is used by ServiceStack Mapped Endpoints
    options.AddPolicy("per-user", context =>
    {
        var user = context.User.Identity?.Name;
        if (string.IsNullOrEmpty(user))
        {
            // Fallback to host name for unauthenticated requests
            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: context.Request.Headers.Host.ToString(),
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 100,
                    QueueLimit = 0,
                    Window = TimeSpan.FromMinutes(1)
                });
        }
        // User exists
        // Get the user's rate limit from their plan
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userManager = context.RequestServices.GetService<UserManager<ApplicationUser>>();
        var appUser = userManager.FindByIdAsync(userId).Result;
        var rateLimit = appUser?.RateLimit ?? 0;

        // Create a user-specific rate limiter
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: user,
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = rateLimit,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            });
    });
    
    // ...
});

//...

// Make sure to call UseRateLimiter
app.UseRateLimiter();

// Specify which policy is used by ServiceStack Mapped Endpoints
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
    options.RouteHandlerBuilders.Add((routeBuilder, operation, method, route) =>
    {
        routeBuilder.RequireRateLimiting(policyName: "per-user");
    });
});
```

By combining ASP.NET Core rate limiting with ASP.NET Core Identity in this way, you can implement flexible, per-user rate limiting 
suitable for multi-tenant SaaS applications. The same approach can be extended to handle different rate limits for different API endpoints 
or user roles as needed. By upgrading ServiceStack to use ASP.NET Core Endpoints, you can now leverage the same rate limiting middleware 
across all ASP.NET Core Endpoints, including ServiceStack APIs.
