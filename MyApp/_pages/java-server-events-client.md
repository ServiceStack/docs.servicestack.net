---
slug: java-server-events-client
title: Java Server Events Client
---

![ServiceStack and Java Banner](/img/pages/java/java-client-logo.png)

The Java `ServerEventClient` is an idiomatic port of ServiceStack's 
[C# Server Events Client](/csharp-server-events-client) to Java providing a productive 
client to consume ServiceStack's [real-time Server Events](/server-events) that can be used in any 
Java/JVM (JRE 7+) Client/Server Applications or Java/Kotlin Android applications.

## Install

The `AndroidServerEventsClient` for Android is available in the 
[net.servicestack:android](https://bintray.com/servicestack/maven/ServiceStack.Android) package which 
can be installed in your 
[build.gradle](https://github.com/ServiceStackApps/AndroidJavaChat/blob/master/src/androidchat/app/build.gradle)
with:

```groovy
dependencies {
    implementation 'net.servicestack:android:1.1.0'
    ...
}
```

Or in Maven with:

```xml
<dependency>
  <groupId>net.servicestack</groupId>
  <artifactId>android</artifactId>
  <version>1.1.0</version>
  <type>pom</type>
</dependency>
```

Other Java/JVM languages running on the JVM (JRE 7+) can use the `ServerEventsClient` in the 
[net.servicestack:client](https://bintray.com/servicestack/maven/ServiceStack.Client) package which can 
be installed using Gradle:

```
compile 'net.servicestack:client:1.0.48'
```

Or Maven:

```xml
<dependency>
  <groupId>net.servicestack</groupId>
  <artifactId>client</artifactId>
  <version>1.0.48</version>
  <type>pom</type>
</dependency>
```

The `AndroidServerEventsClient` class for Android inherits `ServerEventsClient` to provide enhanced
functionality like alternative non-blocking APIs for all Sync APIs using Android Async Tasks. It also requires
the use of an external [OkHttp Client](http://square.github.io/okhttp/) dependency since the 
`HttpURLConnection` implementation in Android doesn't support cancellable non-blocking requests on HTTP Streams. Otherwise both implementations provide the same functionality and are interchangeable, for the 
purposes of demonstration we'll be using `AndroidServerEventsClient`. 

To configure Server Sent Events on the client create a new instance of `AndroidServerEventsClient` with the
**baseUrl** and the **channels** you want to connect to, e.g:

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .setOnConnect(sub -> {                        // Successful SSE connection
        Log.d("You've connected! welcome " + sub.getDisplayName());
    })
    .setOnJoin(e -> {                             // User has joined subscribed channel
        Log.d("Welcome, " + e.getDisplayName());
    })
    .setOnLeave(e -> {                            // User has left subscribed channel
        Log.d(e.getDisplayName() + " has left the building");
    })
    .setOnUpdate(e -> {                           // User channel subscription was changed
        Log.d(e.getDisplayName() + " has left the building");
    })
    .setOnMessage(msg -> { })                     // Invoked for each other message
    //... Register custom handlers
    .registerHandler("chat", (client, e) -> {     // Invoked for cmd.chat adhoc messages
        ChatMessage chatMsg = JsonUtils.fromJson(e.getJson(), ChatMessage.class);
    })    
    .registerReceiver(MyReceiver.class)           // Register Global 'cmd.' default receiver
    .registerNamedReceiver("tv",TvReceiver.class) // Register named 'tv.' receiver
    .addListener("theEvent", msg -> {})           // Add listener for pub/sub event trigger
    .setOnException(e -> { })                     // Invoked on each Error
    .setOnReconnect(() -> { })                    // Invoked after each auto-reconnect
    .start();                                     // Start listening for Server Events!

//Global Receiver Class
public class MyReceiver extends ServerEventReceiver {
    public void announce(String message){}       // Handle messages with simple argument
    public void chat(ChatMessage message){}      // Handle messages with complex type argument
    public void customType(CustomType message){} // Handle complex types with default selector      
    @Override                                    // Handle other unknown messages
    public void noSuchMethod(String selector, Object message){}
}

//Named Receiver Class
public class TvReciever extends ServerEventReceiver {
    public void watch(String videoUrl){}         // Handle 'tv.watch {url}' messages 
    public void off(){}                          // Handle 'tv.off' messages 
}
```

### Message Events

ServiceStack Server Events has 4 built-in events sent during a subscriptions life-cycle: 

 - **onConnect** - sent when successfully connected, includes the subscriptions private `subscriptionId` as well as heartbeat and unregister urls that's used to automatically setup periodic heartbeats
 - **onJoin** - sent when a new user joins the channel
 - **onLeave** - sent when a user leaves the channel
 - **onUpdate** - sent when a user's channels subscription was updated

> The onJoin/onLeave/onUpdate events can be turned off with `ServerEventsFeature.NotifyChannelOfSubscriptions=false`.

All other messages can be handled with the catch-all:

 - **onMessage** - fired when any other message is sent

### Server Event Client Events

Other top-level events the `ServerEventClient` fires that can be handled include: 

 - **onException** - Invoked on each error the client receives
 - **onReconnect** - Invoked after each time the client had to auto-reconnect

## Selectors

A selector is a string that identifies what should handle the message, it's used by the client to route the message to different handlers. The client bindings supports 4 different handlers out of the box:

### Global Event Handlers

The easiest way to handle a custom event is to define a handler, e.g:

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .registerHandler("paint", (client, e) -> {
        String color = JsonUtils.fromJson(e.getJson(), String.class);
        Log.d("Painting the " + e.getCssSelector() + " " + color);
    })
    .registerHandler("chat", (client, e) -> {
        ChatMessage chatMsg = JsonUtils.fromJson(e.getJson(), ChatMessage.class);
        Log.d("Received " + chatMsg.getMessage() + " from " + chatMsg.getFromName());
    })
    .start();
```

The selector to invoke a global event handler is:

```
cmd.{handler} {message}
```

Which can be sent in ServiceStack with:

```csharp
ServerEvents.NotifyChannel("home", "cmd.paint$#town", "red");
ServerEvents.NotifyChannel("home", "cmd.chat", new ChatMessage { ... });
```

Where `{handler}` is the name of the handler you want to invoke, e.g `cmd.paint`. The first argument is
the `ServerEventsClient` instance whilst the 2nd argument a structured `ServerEventMessage` which for 
the above Server Event is populated with:

```java
.registerHandler("paint", (client, e) -> {
    e.getChannel()     //= home
    e.getData()        //= home@cmd.paint$#town "red"
    e.getSelector()    //= cmd.paint
    e.getJson()        //= "red"
    e.getOp()          //= cmd
    e.getTarget()      //= paint
    e.getCssSelector() //= #town
})
```

The message body is serialized as JSON and accessible from `e.getJson()` and can be extracted using `JsonUtils`,e.g:

```java
String color = JsonUtils.fromJson(e.getJson(), String.class); //Simple string message body
ChatMessage chatMsg = JsonUtils.fromJson(e.getJson(), ChatMessage.class); //Complex Type body
```

### Postfix CSS selector 

All server event handler options also support a postfix CSS selector for specifying what each handler should be bound to with a `$` followed by the CSS selector, e.g:

```
cmd.{handler}${cssSelector} {value}
```

A concrete example for calling the above API would be:

```
cmd.paint$#town red
```

::: info
Spaces in CSS selectors need to be encoded with `%20`
:::

#### Handling Messages with the Default Selector

All `IServerEvents` Notify API's includes [overloads for sending messages without a selector](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServerEventsFeature.cs#L743-L771) that by convention will take the format `cmd.{TypeName}`. 

As they're prefixed with `cmd.*` these events can be handled with either a handler (as above) or a global receiver **based on Message type name**, e.g:

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .registerReceiver(MyGlobalReceiver.class)
    .start();

public class TestGlobalReceiver extends ServerEventReceiver {
    public void setterType(SetterType value) {
    }
    public void customType(CustomType request) {
    }
}
```

Which will be called when messages are sent without a selector, e.g:

```csharp
public class MyServices : Service
{
    public IServerEvents ServerEvents { get; set; }

    public void Any(Request request)
    {
        ServerEvents.NotifyChannel("home", new CustomType { ... });
        ServerEvents.NotifyChannel("home", new SetterType { ... });
    }
}
```

Whilst Named Receivers are used to handle messages sent to a specific namespaced selector, registering a 
**Global Receiver** allows you to handle messages sent with the `cmd.*` selector which is also the default
selector used when sending messages with **no selector**.

### Receivers

In programming languages based on message-passing like Smalltalk and Objective-C invoking a method is done by sending a message to a receiver. This is conceptually equivalent to invoking a method on an instance in C# where both these statements are roughly equivalent:

```objc
// Objective-C
[receiver method:argument]
```

```csharp
// C#
receiver.method(argument)
```

Support for receivers is available in the following format:

```
{receiver}.{target} {msg}
```

### Registering Receivers

Registering a receiver can be done with a map of the object instance and the name you want it to be exported as. E.g. we can add a "css" receiver to handle with:

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .registerNamedReceiver("css", CssReceiver.class)
    .setResolver(new MyResolver(mainActivity))
    .start();

public class CssReceiver extends ServerEventReceiver {
    private MainActivity parentActivity;
    public CssReceiver(MainActivity parentActivity) {
        this.parentActivity = parentActivity;
    }

    public void backgroundImage(String message){
        String url = message.startsWith("url(")
            ? message.substring(4, message.length() - 1)
            : message;

        App.get().readBitmap(url, bitmap -> {
            ImageView chatBackground = (ImageView)parentActivity.findViewById(R.id.chat_background);
            parentActivity.runOnUiThread(() -> chatBackground.setImageBitmap(bitmap));
        });
    }

    public void background(String message){
        String color = message.replace("#", "#AA");
        String cssSelector = super.getRequest().getCssSelector();
        parentActivity.runOnUiThread(() -> {
            if (Objects.equals(cssSelector, "#top")){
                parentActivity.getSupportActionBar().setBackgroundDrawable(
                    new ColorDrawable(colorVal)
                );
            }
        });
    }
}

public class MyResolver implements IResolver {
    private MainActivity parentActivity;
    public MyResolver(MainActivity parentActivity) {
        this.parentActivity = parentActivity;
    }

    @Override
    public Object TryResolve(Class cls){
        if (cls == CssReceiver.class){
            return new CssReceiver(this.parentActivity);
        }
        return cls.newInstance();
    }
}
```

Which will invoke `backgroundImage` method off a new instance of the `CssReceiver` class that's triggered with:

```
css.background-image url(https://bit.ly/1yIJOBH)
```

and can be sent to all subscriptions on the **home** channel in ServiceStack with:

```csharp
ServerEvents.NotifyChannel("home", "css.background-image", "url(https://bit.ly/1yIJOBH)");
```

This works the same with Global Receivers. 

### Inheriting ServerEventReceiver

By inheriting `ServerEventReceiver`:

```java
class ServerEventReceiver implements IReceiver {
    public client: ServerEventsClient;
    public request: ServerEventMessage;
    noSuchMethod(selector: string, message:any) {}
}
```

Receivers can access additional built-in functionality where it will allow receivers to access the 
`ServerEventsClient` client dependency, the `ServerEventMessage` that was received, it also lets you handle 
any unhandled messages sent by implementing `noSuchMethod()`, e.g:

```java
class JavaScriptReceiver extends ServerEventReceiver {

    public void chat(ChatMessage chatMessage){
        LogMessage request = new LogMessage()
            .setChannel(msg.getChannel())
            .setMessage(msg.getMessage());

        super.client.getServiceClient().post(request);
    }
    
    public void announce(String message){
        Toast.makeText(this.parentActivity, message, Toast.LENGTH_LONG);
    }

    public void toggle(){
        if ("#sidebar".equals(super.request.getCssSelector())){
            LinearLayout sidebarLayout=(LinearLayout)this.findViewById(R.id.sidebarLayout);
            sidebarLayout.setVisibility(sidebarLayout.getVisibility() == LinearLayout.INVISIBLE
                ? LinearLayout.VISIBLE
                : LinearLayout.INVISIBLE
            );
        }
    }

    public void noSuchMethod(String selector, Object message){
        ServerEventMessage msg = (ServerEventMessage)message;
        Log.d("Unhandled " + selector + " was sent message: " + msg.getJson());
    }
}

client.registerReceiver(JavaScriptReceiver.class); //register Global Receiver
```

These can triggered with:

```csharp
ServerEvents.NotifyChannel(channel, new ChatMessage { ... });
ServerEvents.NotifyChannel(channel, "cmd.announce", "Hello, World!");
ServerEvents.NotifyChannel(channel, "cmd.toggle$#sidebar");
ServerEvents.NotifyChannel(channel, "cmd.UnknownSelector", new Message { ... });
```

### Dependency Resolvers

You can control the lifetime of the receivers by injecting a custom resolver which will let you reuse the same
Receiver instance by using a `SingletonInstanceResolver`, e.g:

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .setResolver(new SingletonInstanceResolver())
    .registerReceiver(JavaScriptReceiver.class)
    .start();
```

Which is implemented with:

```java
public class SingletonInstanceResolver implements IResolver {
    ConcurrentMap<Class, Object> cache = new ConcurrentHashMap<>();
    @Override
    public Object TryResolve(Class cls) {
        Object instance = cache.get(cls);
        if (instance == null){
            try {
                Object newInstance = cls.newInstance();
                instance = (instance = cache.putIfAbsent(cls, newInstance)) == null
                        ? newInstance
                        : instance;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return instance;
    }
}
```

Custom Resolvers are also useful configuring the dependencies in your Receiver classes, e.g. we use this 
above to inject our `MainActivity` into our `CssReceiver` class.

```java
ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .setResolver(new MyResolver())
    .registerReceiver(CssReceiver.class)
    .start();

public class MyResolver implements IResolver {
    private MainActivity parentActivity;
    public MyResolver(MainActivity parentActivity) {
        this.parentActivity = parentActivity;
    }

    @Override
    public Object TryResolve(Class cls){
        if (cls == CssReceiver.class){
            return new CssReceiver(this.parentActivity);
        }
        return cls.newInstance();
    }
}
```

### Event Triggers

Triggers enable a pub/sub event model where multiple listeners can subscribe and be notified of an event.

Registering an event handler can be done at anytime using the `addListener()` API, e.g:

```java
Action<ServerEventMessage> handler = e -> {
    Log.d("received event " + e.getTarget() + " with arg: " + e.getJson());
};

ServerEventsClient client = new AndroidServerEventsClient(baseUrl, "home")
    .addListener("customEvent", handler)
    .start();

//Register another listener to 'customEvent' event
List<ServerEventMessage> msgs1 = new ArrayList<>();
client.addListener("customEvent", msgs1::add);
```

The selector to trigger this custom event is:

```
trigger.customEvent arg
trigger.customEvent {json}
```

Which can be sent in ServiceStack with a simple or complex type argument, e.g:

```csharp
ServerEvents.NotifyChannel(channel, "trigger.customEvent", "arg");
ServerEvents.NotifyChannel(channel, "trigger.customEvent", new ChatMessage { ... });
```

#### Removing Listeners

Use `removeListener()` to stop listening for an event, e.g:

```java
//Remove first event listener
client.removeListener("customEvent", handler);
```

### Channel Subscriber APIs

You can use any of the APIs below to update an active Subscriptions Channels:

```java
client.subscribeToChannels("chan3","chan4");
client.unsubscribeFromChannels("chan1","chan2");

//Alternatively subscribe/unsubscribe to channels in the same request with:
UpdateEventSubscriber request = new UpdateEventSubscriber()
    .setSubscribeChannels(Func.toList("chan3","chan4"))
    .setUnsubscribeChannels(Func.toList("chan1","chan2"));

client.updateSubscriber(request);
```

All Service Client APIs in `AndroidServiceClient` also have non-blocking versions with an an `Async` suffix
that utilize Android's Async Task and optional callbacks for performing non-blocking Service Client requests, e.g:

```java
client.updateSubscriberAsync(request, () -> {
    Log.d("SUCCESS!");
}, e -> {
    Log.d("FAILED: " + e.toString());
});
```

### Get Channel Subscribers

Once connected, you can get a list of channel subscribers the `ServerEventsClient` is currently connected
to with:

```java
List<ServerEventUser> channelUsers = client.getChannelSubscribers();
Func.each(channelUsers, user -> {
    Log.d(user.getUserId() + " @" + user.getDisplayName() + " " + user.getProfileUrl());
});
```

### Accessing ServiceClient

Alternatively you can access the channel subscribers using the built-in `JsonServiceClient`, e.g:

```java
client.getServiceClient().get(new GetEventSubscribers()
    .setChannels(Func.toList("chan1","chan2")));
```

Which you can also use to call your own Services:

```java
client.getServiceClient().post(new MyRequest());
```

### Integration Test Examples

More examples of `ServerEventClient` usage can be found in the Test Suites below:

 - [Java 8 / JVM Integration Tests](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/test/java/net/servicestack/client/ServerEventClientTests.java)

 - [Java 7 / Android Integration Tests](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/android/src/androidTest/java/net/servicestack/android/ServerEventClientTests.java)

# Java ServerEvents Examples

## [Android Java Chat](https://github.com/ServiceStackApps/AndroidJavaChat)

Java Chat client utilizing [Server Events](/java-server-events-client) for real-time notifications and enabling seamless OAuth Sign In's using Facebook, Twitter and Google's native SDKs:

[![](/img/pages/java/java-android-chat-screenshot-540x960.png)](https://github.com/ServiceStackApps/AndroidJavaChat)
