---
title: Server Events
---

![](/img/pages/server-events/server-events-banner.png)

[Server Sent Events](http://www.html5rocks.com/en/tutorials/eventsource/basics/) (SSE) is an elegant [web technology](http://dev.w3.org/html5/eventsource/) for efficiently receiving push notifications from any HTTP Server. It can be thought of as a mix between long polling and one-way WebSockets and contains many benefits over each:

  - **Simple** - Server Sent Events is just a single long-lived HTTP Request that any HTTP Server can support
  - **Efficient** - Each client uses a single TCP connection and each message avoids the overhead of HTTP Connections and Headers that's [often faster than Web Sockets](http://matthiasnehlsen.com/blog/2013/05/01/server-sent-events-vs-websockets/).
  - **Resilient** - Browsers automatically detect when a connection is broken and automatically reconnects
  - **Interoperable** - As it's just plain-old HTTP, it's introspectable with your favorite HTTP Tools and even works through HTTP proxies (with buffering and [chunked-encoding turned off](https://www.w3.org/TR/eventsource/#notes)).
  - **Well Supported** - As a Web Standard it's supported in all major browsers except for IE which [can be enabled with polyfills](http://html5doctor.com/server-sent-events/#yaffle) - see [default_ieshim.cshtml](https://github.com/ServiceStackApps/Chat/blob/master/src/Chat/default_ieshim.cshtml) and its [Live Chat Example](http://chat.netcore.io/default_ieshim).

We've chosen to adopt Server Sent Events for Server Notifications as it's a beautifully simple and elegant [Web Standard](http://dev.w3.org/html5/eventsource/) with better HTTP fidelity than **WebSockets**, that's perfect fit for Server Push Communications that works in both ServiceStack' ASP.NET, SelfHosts and .NET Core without requiring any extra .NET dependencies or [require the host Windows Server have WebSockets support](http://stackoverflow.com/a/12073593/85785) to use. 

Our integrated and high-performance solution enhances this simple lightweight protocol with rich pub/sub features allowing for [flexible and targeted messaging](/server-events#sending-server-events)
and intelligent clients enabling a variety of different strategies for easily handling events, includes built-in APIs for easily modifying active subscriptions and querying the state of subscribed channels as well as built-in heartbeats and auto-retries for establishing hassle-free persistent connections to backend servers.

### Server Event Clients

Our native Server Event clients covers the most popular Mobile, Desktop and Server platforms with new first-class implementations for Android, Java and TypeScript which now includes:

 - [C# Server Events Client](/csharp-server-events-client)
    - Xamarin.iOS
    - Xamarin.Android
    - UWP
    - .NET Framework 4.5+
    - .NET Core (.NET Standard 1.3+)
- [TypeScript Server Events Client](/typescript-server-events-client)
    - Web
    - Node.js Server
    - React Native
        - iOS
        - Android
- [Java Server Events Client](/java-server-events-client)
    - Android
    - JVM 1.7+ (Java, Kotlin, Scala, etc)
        - Java Clients
        - Java Servers
- [JavaScript (jQuery plugin)](/javascript-server-events-client)
    - Web

### gRPC Server Events Clients

In addition to the smart generic HTTP Server Events Clients above, Server Events is also available via a [gRPC Server Streaming Endpoint](/server-events-grpc)
which opens ServiceStack Server Events open to gRPC's ecosystem of typed generated client proxies, including:

 - [gRPC Flutter](/grpc/flutter)
 - [gRPC Android](/grpc/android)
 - [gRPC C#](/grpc/csharp)
 - [gRPC Swift](/grpc/swift)
 - [gRPC Java](/grpc/java)
 - [gRPC Dart](/grpc/dart)
 - [gRPC GO](/grpc/go)
 - [gRPC Node.js](/grpc/nodejs)
 - [gRPC Python](/grpc/python)
 - [gRPC Ruby](/grpc/ruby)
 - [gRPC PHP](/grpc/php)
 
Our C#, TypeScript and Java Server Event Clients are ports with full feature parity as C#, offering the same functionality behind idiomatic APIs for their respective programming language. The Integration test suite has also been ported to each platform to assert behavior conformance and provides a good reference showcasing the aesthetics of using Server Events Clients in each language:

 - [C# Server Events Integration Tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/ServerEventTests.cs)
 - [TypeScript  Server Events Integration Tests](https://github.com/ServiceStack/servicestack-client/blob/master/tests/serverevents.spec.ts)
 - [Java 8 / JVM Server Events Integration Tests](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/test/java/net/servicestack/client/ServerEventClientTests.java)
 - [Java 7 / Android Server Events Integration Tests](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/android/src/androidTest/java/net/servicestack/android/ServerEventClientTests.java)

### Server Event Providers

There are 2 Server Implementations of Server Events available, the default In Memory provider enables sending
real-time communications to all clients subscribed to the same ServiceStack Instance whilst Redis Server Events utilizes a distributed redis-server back-end to provide a scale-out option capable of serving across multiple fan-out/load-balanced App Servers:

  - Memory Server Events (default)
  - [Redis Server Events](/redis-server-events)

## Registering

Like most other [modular functionality](/plugins) in ServiceStack, Server Sent Events is encapsulated in a single Plugin that can be registered in your AppHost with:

```csharp
Plugins.Add(new ServerEventsFeature());
```

The registration above is all that's needed for most use-cases which just uses the defaults below:

```csharp
class ServerEventsFeature
{
    StreamPath = "/event-stream";            // The entry-point for Server Sent Events
    HeartbeatPath = "/event-heartbeat";      // Where to send heartbeat pulses
    UnRegisterPath = "/event-unregister";    // Where to unregister your subscription
    SubscribersPath = "/event-subscribers";  // View public info of channel subscribers 

    // Return `401 Unauthorized` to non-authenticated clients
    LimitToAuthenticatedUsers = false;

    // How long to wait for heartbeat before unsubscribing
    IdleTimeout = TimeSpan.FromSeconds(30);  

    // Client Interval for sending heartbeat messages
    HeartbeatInterval = TimeSpan.FromSeconds(10);

    // Send notifications when subscribers join/leave
    NotifyChannelOfSubscriptions = true;
}
```

::: info
The paths lets you customize the routes for the built-in Server Events API's, whilst setting a path to `null` disables that feature
:::

### Custom Event Hooks

A number of hooks are available providing entry points where custom logic can be added to modify or enhance existing behavior:

```csharp
class ServerEventsFeature
{
    Action<IRequest> OnInit;                          // Subscription pre-initialization callback
     //Filter OnConnect messages
    Action<IEventSubscription, Dictionary<string, string>> OnConnect;

    // Events fired when 
    Action<IEventSubscription, IRequest> OnCreated;   // Subscription is created
    Func<IEventSubscription, Task> OnSubscribeAsync;  // Subscription is registered 
    Func<IEventSubscription,Task> OnUnsubscribeAsync; // Subscription is unregistered
    Func<IEventSubscription, Task> OnUpdateAsync;     // Subscription is updated

    // Fired when message is published
    Action<IEventSubscription, IResponse, string> OnPublish; 
    Func<IEventSubscription, IResponse, string, Task> OnPublishAsync; 
}
```

## Sending Server Events

The way your Services send notifications is via the `IServerEvents` API which defaults to an in-memory `MemoryServerEvents` implementation which keeps a record of all subscriptions and connections in memory:

::: info
Server Events can be configured to use a [distributed Redis backend](/redis-server-events) allowing it to work across load-balanced app servers
:::

```csharp
public interface IServerEvents : IDisposable
{
    // External API's
    Task NotifyAllAsync(string sel, object msg, CancellationToken ct=default);
    Task NotifyChannelAsync(string chan, string sel, object msg, CancellationToken ct=default);
    Task NotifySubscriptionAsync(string subId, string sel, object msg,string chan,CancellationToken ct=default)
    Task NotifyUserIdAsync(string userId, string sel, object msg, string chan, CancellationToken ct=default)
    Task NotifyUserNameAsync(string userName, string sel, object msg, string chan,CancellationToken ct=default)
    Task NotifySessionAsync(string sessionId, string sel, object msg, string chan,CancellationToken ct=default)

    // Sync APIs
    void NotifyAll(string selector, object message);
    void NotifyChannel(string channel, string selector, object message);
    void NotifySubscription(string subscriptionId, string selector, object message, string channel = null);
    void NotifyUserId(string userId, string selector, object message, string channel = null);
    void NotifyUserName(string userName, string selector, object message, string channel = null);
    void NotifySession(string sessionId, string selector, object message, string channel = null);

    SubscriptionInfo GetSubscriptionInfo(string id);
    List<SubscriptionInfo> GetSubscriptionInfosByUserId(string userId);

    // Raw JSON APIs
    Task NotifyAllJsonAsync(string selector, string json, CancellationToken ct=default)
    Task NotifyChannelJsonAsync(string channel, string selector, string json, CancellationToken ct=default)
    Task NotifySubscriptionJsonAsync(string subscriptionId, string selector, string json, string chan)
    Task NotifyUserIdJsonAsync(string userId, string selector, string json, string chan)
    Task NotifyUserNameJsonAsync(string userName, string selector, string json, string chan)
    Task NotifySessionJsonAsync(string sessionId, string selector, string json, string chan)

    // Admin API's
    Task RegisterAsync(IEventSubscription subscription, Dictionary<string,string> conArgs,CancellationToken ct)
    Task UnRegisterAsync(string subscriptionId, CancellationToken token=default);

    long GetNextSequence(string sequenceId);

    Task<int> RemoveExpiredSubscriptionsAsync(CancellationToken token = default);

    Task SubscribeToChannelsAsync(string subscriptionId, string[] channels, CancellationToken ct);
    Task UnsubscribeFromChannelsAsync(string subscriptionId, string[] channels, CancellationToken ct);

    List<SubscriptionInfo> GetAllSubscriptionInfos();

    // Client API's
    List<Dictionary<string, string>> GetSubscriptionsDetails(params string[] channels);
    List<Dictionary<string, string>> GetAllSubscriptionsDetails();
    Task<bool> PulseAsync(string subscriptionId, CancellationToken ct=default);

    // Clear all Registrations
    void Reset();
    void Start();
    void Stop();
}
```

We recommend using the non-blocking `*Async` APIs when possible, especially in .NET Core Apps or high load environments.

The API's your Services predominantly deal with are the **External API's** which allow sending of messages at different levels of granularity. As Server Events have deep integration with ServiceStack's [Sessions](/auth/sessions) and [Authentication Providers](/auth/authentication-and-authorization) you're also able to notify specific users by either:

```csharp
NotifyUserIdAsync()   // UserAuthId
NotifyUserNameAsync() // UserName
NotifySessionAsync()  // Session Id
```

Whilst these all provide different ways to send a message to a single authenticated user, any user can be connected to multiple subscriptions at any one time (e.g. by having multiple tabs open). Each one of these subscriptions is uniquely identified by a `subscriptionId` which you can send a message with using: 

```csharp
NotifySubscriptionAsync() // Unique Subscription Id
```

There are also API's to retrieve a users single event subscription as well as all subscriptions for a user:

```csharp
SubscriptionInfo GetSubscriptionInfo(string id);

List<SubscriptionInfo> GetSubscriptionInfosByUserId(string userId);
```

## Event Subscription

An Event Subscription allows you to inspect different metadata contained on each subscription as well as being able to `Publish()` messages directly to it, manually send a Heartbeat `Pulse()` (to keep the connection active) as well as `Unsubscribe()` to revoke the subscription and terminate the HTTP Connection.

```csharp
public interface IEventSubscription : IMeta, IDisposable
{
    DateTime CreatedAt { get; set; }
    DateTime LastPulseAt { get; set; }
    long LastMessageId { get; }

    string[] Channels { get; }
    string UserId { get; }
    string UserName { get; }
    string DisplayName { get; }
    string SessionId { get; }
    string SubscriptionId { get; }
    string UserAddress { get; set; }
    bool IsAuthenticated { get; set; }
    bool IsClosed { get; }

    void UpdateChannels(string[] channels);

    Func<IEventSubscription, Task> OnUnsubscribeAsync { get; set; }
    Action<IEventSubscription> OnUnsubscribe { get; set; }
    Task UnsubscribeAsync();

    void Publish(string selector, string message);
    Task PublishAsync(string selector, string message, CancellationToken token=default);
    void PublishRaw(string frame);
    Task PublishRawAsync(string frame, CancellationToken token=default);
    void Pulse();

    Dictionary<string,string> ServerArgs { get; set; }
    Dictionary<string,string> ConnectArgs { get; set; }
}
```

The `IServerEvents` API also offers an API to UnRegister a subscription with:

```csharp
void UnRegister(IEventSubscription subscription);
```

### Event Subscription Metadata

The `ServerArgs` string Dictionary on `IEventSubscription` and `SubscriptionInfo` is for storing metadata on a SSE subscription that you only want visible on the Server (e.g. Service implementations), `ConnectArgs` is for info you want the subscribed client to have access to from its `OnConnect` event whilst the `Meta` dictionary is for public info you'd like other channel subscribers to have access to from their `OnJoin`, `OnLeave` and `OnUpdate` on subscriber events. 
 
Here's an example of using the server `OnCreated` callback to populate all 3 Dictionaries:
 
```csharp
new ServerEventsFeature {
    OnCreated = (sub,req) => {
        var session = req.GetSession();
        if (!session.IsAuthenticated) return;
        sub.Meta["Nickname"] = session.Nickname;           // channel subscribers
        sub.ConnectArgs["Email"] = session.Email;          // client subscriber 
        sub.ServerArgs["PostalCode"] = session.PostalCode; // server
    }
}
```

## Channels

Standard Publish / Subscribe patterns include the concept of a **Channel** upon which to subscribe and publish messages to. The channel in Server Events can be any arbitrary string which is declared on the fly when it's first used. 

::: info Tip
As Request DTO names are unique in ServiceStack they can make for good channel names which benefit from providing a typed API for free, e.g: `nameof(Request)`
:::

The API to send a message to a specific channel is:

```csharp
void NotifyChannel(string channel, string selector, object message);
```

Which just includes the name of the `channel`, the `selector` you wish the message applies to and the `message` to send which can be any JSON serializable object.

Along with being able to send a message to everyone on a channel, each API also offers an optional `channel` filter which when supplied will limit messages only to that channel:

```csharp
void NotifyUserId(string userId, string selector, object message, string channel = null);
```

## Order of Events

The following Server and Client callbacks are fired when a client first makes a Server Events Connection:

 1. `ServerEventsFeature.OnInit()` - Fired when the server receives the initial HTTP connection. This callback can be used to customize any HTTP Headers that are sent back to the client
 2. `ServerEventsFeature.OnCreated()` - Fired when the server `IEventSubscription` is created but before it becomes Connected.
 3. `ServerEventsFeature.OnConnect()` - Fired when the `IEventSubscription` is about to be connected. This callback can be used to modify the connection info arguments the client receives
 4. **(Client)**  - The Client is then sent an `cmd.onConnect` message with the connection info arguments about the connection. 
 5. `ServerEventsFeature.OnSubscribe()` - Fired after the subscription is registered. This callback can be used to send any custom messages to the client
 6. `ServerEventsFeature.OnUpdateAsync()` - Fired after the subscription is updated (e.g. subscribed Channels are updated)
 7. **(Client)** - If `ServerEventsFeature.NotifyChannelOfSubscriptions = true` every client in the same channel receives a `cmd.onJoin` message to notify them that a new subscription has joined the channel as well as a `cmd.onLeave` message when subscription leaves the channel

::: info
The `cmd.onConnect`, `cmd.onJoin` and `cmd.onLeave` messages can be handled with the [Global Event Handlers](/javascript-server-events-client#global-event-handlers) on the JavaScript Client and the [Message Event Handlers](/csharp-server-events-client#message-event-handlers) or the [Global Receiver](/csharp-server-events-client#the-global-receiver) .NET ServerEventClient
:::

### Heartbeats

Periodically whilst the client maintains a ServerEvents subscription with the server it will send periodic Heartbeats to the Server. This will fire the `ServerEventsFeature.OnHeartbeatInit()` server event which if the client is still connected will be sent a `cmd.onHeartbeat` message. If the subscription no longer exists, heartbeats will return a `404 - Subscription {id} does not exist` HTTP Response.

## Chat Features

The implementation of Chat is a great way to explore different Server Event features which make it easy to develop highly interactive and responsive web apps with very little effort. 

### Active Subscribers

One feature common to chat clients is to get details of all the active subscribers in a channel which we can get from the built-in `/event-subscribers` route, e.g:

```javascript
$.getJSON(`/event-subscribers?channel=${channel}`, function (users) {
    $.map(users, function(user) {
        usersMap[user.userId] = user;
        refCounter[user.userId] = (refCounter[user.userId] || 0) + 1;
    });
    var html = $.map(usersMap, function(user) { return createUser(user); }).join('');
    $("#users").html(html);
});
```

As a single user can have multiple subscriptions (e.g. multiple tabs open) users are merged into a single `usersMap` so each user is only listed once in the users list and a `refCounter` is maintained with the number of subscriptions each user has, so we're able to tell when the user has no more active subscriptions and can remove them from the list.

### Chat box

Chat's text box provides a free-text entry input to try out different Server Event features where each text message is posted to a ServiceStack Service which uses the `IServerEvents` API to send notifications the channels subscribers. When a server event is received on the client, the ss-utils.js client bindings routes the message to the appropriate handler. As all messages go through this same process, the moment the log entry appears in your chat window is also when it appears for everyone else (i.e instant when running localhost).

Normal chat messages (i.e. that don't specify a selector) uses the default `cmd.chat` selector which is sent to the `chat` handler that just echoes the entry into the chat log with:

```javascript
chat: function (m, e) {
    addEntry({ id: m.id, userId: m.fromUserId, userName: m.fromName, msg: m.message, 
               cls: m.private ? ' private' : '' });
}

```

### Specifying a selector

You can specify to use an alternative selector by prefixing the message with a `/{selector}`, e.g: 

```
/cmd.announce This is your captain speaking ...
```

When a selector is specified in Chat it routes the message to the `/channels/{Channel}/raw` Service which passes the raw message through as a string. Normal Chat entries are instead posted to the `/channels/{Channel}/chat` Service, adding additional metadata to the chat message with the user id and name of the sender so it can be displayed in the chat log. The Javascript code that calls both Services is simply: 

```javascript
if (msg[0] == "/") {
    parts = $.ss.splitOnFirst(msg, " ");
    $.post(`/channels/${channel}/raw`, 
        { from: activeSub.id, toUserId: to, message: parts[1], selector: parts[0].substring(1) });
} else {
    $.post(`/channels/${channel}/chat`, 
        { from: activeSub.id, toUserId: to, message: msg, selector: "cmd.chat" });
}
```

### Sending a message to a specific user

Another special syntax supported in Chat is the ability to send messages to other users by prefixing it with `@` followed by the username, e.g:

```
@mythz this is a private message
@mythz /tv.watch http://youtu.be/518XP8prwZo
```

There's also a special `@me` alias to send a message to yourself, e.g:

```
@me /tv.watch http://youtu.be/518XP8prwZo
```

## Server Event Services

By default ServiceStack doesn't expose any Services that can send notifications to other users by default.  It's left up to your application as to what functionality and level of granularity should be enabled for your Application. Your Services can send notifications via the `IServerEvents` provider.

Below is the annotated implementation for both Web Services used by Chat. The `PostRawToChannel` is a simple implementation that just relays the message sent to all users in the channel or just a specific user if `ToUserId` parameter is specified.

The `PostChatToChannel` Service is used for sending Chat messages which sends a wrapped `ChatMessage` DTO instead that holds additional metadata about the message that the Chat UI requires:

```csharp
[Route("/channels/{Channel}/chat")]
public class PostChatToChannel : IReturn<ChatMessage>
{
    public string From { get; set; }
    public string ToUserId { get; set; }
    public string Channel { get; set; }
    public string Message { get; set; }
    public string Selector { get; set; }
}

[Route("/channels/{Channel}/raw")]
public class PostRawToChannel : IReturnVoid
{
    public string From { get; set; }
    public string ToUserId { get; set; }
    public string Channel { get; set; }
    public string Message { get; set; }
    public string Selector { get; set; }
}

public class ServerEventsServices : Service
{
    public IServerEvents ServerEvents { get; set; }
    public IChatHistory ChatHistory { get; set; }
    public IAppSettings AppSettings { get; set; }

    public void Any(PostRawToChannel request)
    {
        if (!IsAuthenticated && AppSettings.Get("LimitRemoteControlToAuthenticatedUsers", false))
            throw new HttpError(HttpStatusCode.Forbidden, "You must be authenticated to use remote control.");

        // Ensure the subscription sending this notification is still active
        var sub = ServerEvents.GetSubscriptionInfo(request.From);
        if (sub == null)
            throw HttpError.NotFound($"Subscription {request.From} does not exist");

        // Check to see if this is a private message to a specific user
        if (request.ToUserId != null)
        {
            // Only notify that specific user
            ServerEvents.NotifyUserId(request.ToUserId, request.Selector, request.Message);
        }
        else
        {
            // Notify everyone in the channel for public messages
            ServerEvents.NotifyChannel(request.Channel, request.Selector, request.Message);
        }
    }

    public object Any(PostChatToChannel request)
    {
        // Ensure the subscription sending this notification is still active
        var sub = ServerEvents.GetSubscriptionInfo(request.From);
        if (sub == null)
            throw HttpError.NotFound($"Subscription {request.From} does not exist");

        var channel = request.Channel;

        // Create a DTO ChatMessage to hold all required info about this message
        var msg = new ChatMessage
        {
            Id = ChatHistory.GetNextMessageId(channel),
            FromUserId = sub.UserId,
            FromName = sub.DisplayName,
            Message = request.Message,
        };

        // Check to see if this is a private message to a specific user
        if (request.ToUserId != null)
        {
            // Mark the message as private so it can be displayed differently in Chat
            msg.Private = true;
            // Send the message to the specific user Id
            ServerEvents.NotifyUserId(request.ToUserId, request.Selector, msg);

            // Also provide UI feedback to the user sending the private message so they
            // can see what was sent. Relay it to all senders active subscriptions 
            var toSubs = ServerEvents.GetSubscriptionInfosByUserId(request.ToUserId);
            foreach (var toSub in toSubs)
            {
                // Change the message format to contain who the private message was sent to
                msg.Message = $"@{toSub.DisplayName}: {msg.Message}";
                ServerEvents.NotifySubscription(request.From, request.Selector, msg);
            }
        }
        else
        {
            // Notify everyone in the channel for public messages
            ServerEvents.NotifyChannel(request.Channel, request.Selector, msg);
        }

        if (!msg.Private)
            ChatHistory.Log(channel, msg);

        return msg;
    }
}
```

## Updating Channels on Live Subscriptions

You can update a live Server Events connection with Channels you want to Join or Leave using the 
built-in ServerEvents `UpdateEventSubscriber` Service:

```csharp
[Route("/event-subscribers/{Id}", "POST")]
public class UpdateEventSubscriber : IReturn<UpdateEventSubscriberResponse>
{
    public string Id { get; set; }
    public string[] SubscribeChannels { get; set; }
    public string[] UnsubscribeChannels { get; set; }
}
```

This lets you modify your active subscription with channels you want to join or leave with a HTTP POST Request, e.g:

```
POST /event-subscribers/{subId}
SubscribeChannels=chan1,chan2&UnsubscribeChannels=chan3,chan4
```

### onUpdate Notification

As this modifies the active subscription it also publishes a new **onUpdate** notification to all channel 
subscribers so they're able to maintain up-to-date info on each subscriber. 

In C# `ServerEventsClient` this can be handled together with **onJoin** and **onLeave** events using `OnCommand`:

```csharp
client.OnCommand = msg => ...; //= ServerEventJoin, ServerEventLeave or ServerEventUpdate
```

In the ss-utils JavaScript Client this can be handled with a Global Event Handler, e.g:

```javascript
$(source).handleServerEvents({
    handlers: {
        onConnect: connectedUserInfo => { ... },
        onJoin: userInfo => { ... },
        onLeave: userInfo => { ... },
        onUpdate: userInfo => { ... }
    }
});
```

### ServerEvents Update Channel APIs

Whilst internally, from within ServiceStack you can update a channel's subscription using the
[IServerEvents](https://github.com/ServiceStack/ServiceStack/blob/b9a33c34d0b0eedbcc6b3483257f1dc37bbf713f/src/ServiceStack/ServerEventsFeature.cs#L1004) APIs:

```csharp
public interface IServerEvents 
{
    ...
    void SubscribeToChannels(string subscriptionId, string[] channels);
    void UnsubscribeFromChannels(string subscriptionId, string[] channels);
}
```

## Troubleshooting

### Response Buffering delaying events

If your web server is configured to automatically buffer the response it will delay when the [Server Events get sent to the client](http://stackoverflow.com/a/25983774/85785). In IIS Express you can disable buffering by disabling compression for dynamic requests by adding this to your **Web.config**:

```xml
<system.webServer>
   <urlCompression doStaticCompression="true" doDynamicCompression="false" />
</system.webServer>
```

Alternatively you can switch to use Visual Studio Development Server which doesn't buffer by default.

## ServerEvents Examples

### [Android Java Chat](https://github.com/ServiceStackApps/AndroidJavaChat)

Java Chat client utilizing [Server Events](/java-server-events-client) for real-time notifications and enabling seamless OAuth Sign In's using Facebook, Twitter and Google's native SDKs:

[![](/img/pages/java/java-android-chat-screenshot-540x960.png)](https://github.com/ServiceStackApps/AndroidJavaChat)

### [Web, Node.js and React Native ServerEvents Apps](https://github.com/ServiceStackApps/typescript-server-events)

Using TypeScript ServerEvents Client to create real-time Web, node.js server and React Native Mobile Apps:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/typescript-serverevents/typescript-server-events-banner.png)](https://github.com/ServiceStackApps/typescript-server-events)

### [Gistlyn](https://github.com/ServiceStack/Gistlyn)

Gistlyn is a C# Gist IDE for creating, running and sharing stand-alone, executable C# snippets.

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/gistlyn/home-screenshot.png)](http://gistlyn.com)

### [React Chat](https://github.com/ServiceStackApps/ReactChat)

React Chat is a port of [ServiceStack Chat](https://github.com/ServiceStackApps/Chat) ES5, jQuery Server Events 
demo into a [TypeScript](http://www.typescriptlang.org/), [React](http://facebook.github.io/react/) and 
[Redux](https://github.com/reactjs/redux) App:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/screenshot.png)

### [Xamarin.Android Chat](https://github.com/ServiceStackApps/AndroidXamarinChat)

Xamarin.Android Chat utilizes the 
[.NET PCL Server Events Client](/csharp-server-events-client)
to create an Android Chat App connecting to the existing 
[chat.netcore.io](http://chat.netcore.io/) Server Events back-end where it's able to communicate 
with existing Ajax clients and other connected Android Chat Apps. 

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/xamarin-android-server-events.png)](https://www.youtube.com/watch?v=tImAm2LURu0)

> [YouTube Video](https://www.youtube.com/watch?v=tImAm2LURu0) and [AndroidXamarinChat Repo](https://github.com/ServiceStackApps/AndroidXamarinChat)

### [Networked Time Traveller Shape Creator](https://github.com/ServiceStackApps/typescript-redux#example-9---real-time-networked-time-traveller)

A network-enhanced version of the
[stand-alone Time Traveller Shape Creator](https://github.com/ServiceStackApps/typescript-redux#example-8---time-travelling-using-state-snapshots)
that allows users to **connect to** and **watch** other users using the App in real-time similar 
to how users can use Remote Desktop to watch another computer's screen: 

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/redux-chrome-safari.png)](http://redux.servicestack.net)

> Live demo: http://redux.servicestack.net

### [Chat](https://github.com/ServiceStackApps/Chat)

> Feature-rich Single Page Chat App, showcasing Server Events support in 170 lines of JavaScript!

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat.png)](http://chat.netcore.io)

### [React Chat Desktop](https://github.com/ServiceStackApps/ReactChatApps)

> Built with [React Desktop Apps](https://github.com/ServiceStackApps/ReactDesktopApps)
VS.NET template and packaged into a native Desktop App for Windows and OSX - showcasing synchronized 
real-time control of multiple Windows Apps:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/react-desktop-apps/dancing-windows.png)](https://youtu.be/-9kVqdPbqOM)

> Downloads for [Windows, OSX, Linux and Web](https://github.com/ServiceStackApps/ReactChatApps#downloads)
