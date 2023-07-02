---
title: Kotlin Add ServiceStack Reference
---

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/android-studio-splash-kotlin.png)

## [Kotlin](https://kotlinlang.org/) - a better language for Android and the JVM

Whilst Java is the flagship language for the JVM, it's slow evolution, lack of modern features and distasteful
language additions have grown it into an cumbersome language to develop with, as illustrated in the 
[C# 101 LINQ Examples in Java](https://github.com/mythz/java-linq-examples) where it's by far the worst of all 
modern languages compared, making it a poor choice for a functional-style of programming that's especially painful
for Android development which is stuck on Java 7.

By contrast [Kotlin](https://kotlinlang.org/) ended up being one of the 
[best modern languages for functional programming](https://github.com/mythz/kotlin-linq-examples) that's 
vastly more expressive, readable, maintainable and safer than Java. As Kotlin is being developed by JetBrains 
it also has great tooling support in **Android Studio**, **IntelliJ** and **Eclipse** and seamlessly integrates 
with existing Java code where projects can mix-and-match Java and Kotlin code together within the same application - 
making Kotlin a very attractive and easy choice for Android Development.

As we expect more Android and Java projects to be written in Kotlin in future we've added first-class 
[Add ServiceStack Reference](/add-servicestack-reference) 
support for Kotlin with IDE integration in 
[Android Studio](http://developer.android.com/tools/studio/index.html) and 
[IntelliJ IDEA](https://www.jetbrains.com/idea/) where App Devlopers can create and update an end-to-end typed 
API with just a Menu Item click - enabling a highly-productive workflow for consuming ServiceStack Services.

## Kotlin Android Example using Android Studio

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="nmB0NaI9-3k" style="background-image: url('https://img.youtube.com/vi/nmB0NaI9-3k/maxresdefault.jpg')"></lite-youtube>

### Kotlin Android Resources

To help getting started with Kotlin, we'll maintain links to useful resources helping to develop Android Apps 
with Kotlin below:

 - [Getting started with Android and Kotlin](https://kotlinlang.org/docs/tutorials/kotlin-android.html) <small>_(kotlinlang.org)_</small>
 - [Kotlin for Android Developers](http://www.javaadvent.com/2015/12/kotlin-android.html) <small>_(javaadvent.com)_</small>
 - [Android Development with Kotlin - Jake Wharton](https://www.youtube.com/watch?v=A2LukgT2mKc&feature=youtu.be) <small>_(youtube.com)_</small>

## Installing Kotlin

Kotlin support is enabled in Android Studio by installing the JetBrain's Kotlin plugin in project settings:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/install-plugin.png)

Then find and select the **Kotlin** plugin from the list and click **Install Plugin** button:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/install-kotlin-plugins.png)

Subsequent Restarts of Android Studio will now load with the **Kotlin** plugin enabled.

### Configure Project to use Kotlin

After Kotlin is enabled in Android Studio you can configure which projects you want to have Kotlin support
by going to either `Tools -> Kotlin -> Configure Kotlin in Project` on the File Menu:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/kotlin-configure-project.png)

Or [alternatively you can launch it](https://kotlinlang.org/docs/tutorials/kotlin-android.html#configuring-kotlin-in-the-project)
using Android Studio's Quick **Find Action** with `Ctrl + Shift + A` and typing in `Configure K` to filter it
from the list. 

Configuring a project to support Kotlin just modifies that projects 
[build.gradle](https://github.com/mythz/kotlin-linq-examples/blob/master/src/app/build.gradle), applying the
necessary Android Kotlin plugin and build scripts needed to compile Kotlin files with your project. Once Kotlin
is configured with your project you'll get first-class IDE support for Kotlin `.kt` source files including 
intell-sense, integrated compiler analysis and feedback, refactoring and debugging support, etc.

One convenient feature that's invaluable for porting Java code and learning Kotlin is the 
[Converting Java to Kotlin](https://kotlinlang.org/docs/tutorials/kotlin-android.html#converting-java-code-to-kotlin)
Feature which can be triggered by selecting a `.java` class and clicking `Ctrl + Alt + Shift + K` keyboard short-cut
(or using [Find Action](https://kotlinlang.org/docs/tutorials/kotlin-android.html#converting-java-code-to-kotlin)).

## [ServiceStack IDEA Android Studio Plugin](https://plugins.jetbrains.com/plugin/7749?pr=androidstudio)

With Kotlin enabled on your project you can install **ServiceStack IDEA** plugin to provide 
Add ServiceStack Reference functionality directly from within [Android Studio](https://developer.android.com/sdk/index.html). 

#### Install ServiceStack IDEA from the Plugin repository

The ServiceStack IDEA is now available to install directly from within IntelliJ or Android Studio IDE Plugins Repository, to Install Go to: 

 1. `File -> Settings...` Main Menu Item
 2. Select **Plugins** on left menu then click **Browse repositories...** at bottom
 
![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/install-plugin-repositories.png)

Search for **ServiceStack** and click **Install plugin**

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/install-servicestack-plugin.png)

Restart to load the installed ServiceStack IDEA plugin

### [Download and Install ServiceStack IDEA Manually](/java-add-servicestack-reference#download-and-install-servicestack-idea-manually)

See docs on [Java Add ServiceStack Reference](/java-add-servicestack-reference#download-and-install-servicestack-idea-manually)
for instructions on other ways to install the ServiceStack IDEA plugin in Android Studio or IntelliJ.

### Manually adding client dependency to your Project

When using **Add ServiceStack Reference** feature the ServiceStack IDEA Plugin automatically adds a reference to
the **net.servicestack:android** dependency in your projects **build.gradle**, this can also manually add the 
reference by adding the dependency below:

```
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'net.servicestack:android:1.0.48'
}
```

This also lets you to change which ServiceStack Client library version you want to use, the example above uses 
**1.0.48**. The **net.servicestack:android** dependency contains the `AndroidServiceClient` and 
`JavaServiceClient` that your projects use to call remote ServiceStack Services using the typed Kotlin DTO's
added to your project by the **Add ServiceStack Reference** feature.

### [Add ServiceStack Reference](/add-servicestack-reference)

If you've previously used 
[Add ServiceStack Reference](/add-servicestack-reference) 
in any of the supported IDE's before, you'll be instantly familiar with Add ServiceStack Reference in 
Android Studio. The only additional field is **Package**, required in order to comply with Kotlin's class 
definition rules. 

To add a ServiceStack Reference, right-click (or press `Ctrl+Alt+Shift+R`) on the **Package folder** in your 
Java sources where you want to add the POJO DTO's. This will bring up the **New >** Items Context Menu where 
you can click on the **ServiceStack Reference...** Menu Item to open the **Add ServiceStack Reference** Dialog: 

![Add ServiceStack Reference Kotlin Context Menu](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/package-add-servicestack-reference.png)

The **Add ServiceStack Reference** Dialog will be partially populated with the selected **Package** with the 
package where the Dialog was launched from and the **File Name** defaulting to `dtos.kt` where the generated 
Kotlin DTO's will be added to. All that's missing is the url of the remote ServiceStack instance you wish to 
generate the DTO's for, e.g: `https://techstacks.io`:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/kotlin-add-servicestack-reference.png)

Clicking **OK** will add the `dtos.kt` file to your project and modifies the current Project's **build.gradle** 
file dependencies list with the new **net.servicestack:android** dependency containing the JSON 
ServiceClients which is used together with the remote Servers DTO's to enable its typed Web Services API. If
for some reason you wish to instead add Java DTO's to your project instead of Kotlin, just rename the `dtos.kt` 
file extension to `dtos.java` and it will import Java classes instead.

::: info
As the Module's **build.gradle** file was modified you'll need to click on the **Sync Now** link in the top yellow banner to sync the **build.gradle** changes which will install or remove any modified dependencies
:::

### Update ServiceStack Reference

Like other Native Type languages, the generated DTO's can be further customized by modifying any of the options available in the header comments:

```
/* Options:
Date: 2015-04-17 15:16:08
Version: 1
BaseUrl: https://techstacks.io

Package: org.layoric.myapplication
GlobalNamespace: techstackdtos
//AddPropertyAccessors: True
//SettersReturnThis: True
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: java.math.*,java.util.*,net.servicestack.client.*,com.google.gson.annotations.*
*/
...
```

For example the package name can be changed by uncommenting the **Package:** option with the new package name, then either right-click on the file to bring up the file context menu or use Android Studio's **Alt+Enter** keyboard shortcut then click on **Update ServiceStack Reference** to update the DTO's with any modified options:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/kotlin/kotlin-update-servicestack-reference.png)

### Java Server Events Client

In addition to enabling end-to-end Typed APIs, Kotlin can also be used to handle real-time notifications 
with the [Java Server Events Client](/java-server-events-client).

### JsonServiceClient API

The goal of Native Types is to provide a productive end-to-end typed API to facilitate  consuming remote services 
with minimal effort, friction and cognitive overhead. One way we achieve this is by promoting a consistent, 
forwards and backwards-compatible message-based API that's works conceptually similar on every platform where 
each language consumes remote services by sending  **Typed DTO's** using a reusable **Generic Service Client** 
and a consistent client library API. Thanks to its seamless integration with Java, Kotlin is able to re-use the
same Java Client Library used by 
[Java Add ServiceStack Reference](/java-add-servicestack-reference).

To maximize knowledge sharing between different platforms, the Java ServiceClient API is modelled after the 
[.NET Service Clients API](/csharp-client) closely, as allowed 
within Java's language and idiomatic-style constraints. 

Thanks to C#/.NET being heavily inspired by Java, the resulting Java `JsonServiceClient` ends up bearing a close 
resemblance with .NET's Service Clients. The primary differences being due to language limitations like Java's
generic type erasure and lack of language features like property initializers making Java slightly more verbose 
to work with, however as **Add ServiceStack Reference** is able to take advantage of code-gen we're able to 
mitigate most of these limitations to retain a familiar developer UX.

The [ServiceClient.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/ServiceClient.java) interface provides a good overview on the API available on the concrete [JsonServiceClient](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/JsonServiceClient.java) class:

```java
public interface ServiceClient {
    public <TResponse> TResponse get(IReturn<TResponse> request);
    public <TResponse> TResponse get(IReturn<TResponse> request, Map<String,String> queryParams);
    public <TResponse> TResponse get(String path, Class responseType);
    public <TResponse> TResponse get(String path, Type responseType);
    public HttpURLConnection get(String path);

    public <TResponse> TResponse post(IReturn<TResponse> request);
    public <TResponse> TResponse post(String path, Object request, Class responseCls);
    public <TResponse> TResponse post(String path, Object request, Type responseType);
    public <TResponse> TResponse post(String path, byte[] requestBody, String contentType, Class responseCls);
    public <TResponse> TResponse post(String path, byte[] requestBody, String contentType, Type responseType);
    public HttpURLConnection post(String path, byte[] requestBody, String contentType);

    public <TResponse> TResponse put(IReturn<TResponse> request);
    public <TResponse> TResponse put(String path, Object request, Class responseType);
    public <TResponse> TResponse put(String path, Object request, Type responseType);
    public <TResponse> TResponse put(String path, byte[] requestBody, String contentType, Class responseType);
    public <TResponse> TResponse put(String path, byte[] requestBody, String contentType, Type responseType);
    public HttpURLConnection put(String path, byte[] requestBody, String contentType);

    public <TResponse> TResponse delete(IReturn<TResponse> request);
    public <TResponse> TResponse delete(IReturn<TResponse> request, Map<String,String> queryParams);
    public <TResponse> TResponse delete(String path, Class responseType);
    public <TResponse> TResponse delete(String path, Type responseType);
    public HttpURLConnection delete(String path);
}
```

The primary concession is due to JVM's generic type erasure which forces the addition overloads that include a 
`Class` parameter for specifying the response type to deserialize into as well as a `Type` parameter overload 
which does the same for generic types. These overloads aren't required for API's that accept a Request DTO 
annotated with `IReturn<T>` interface marker as we're able to encode the Response Type in code-generated 
Request DTO classes.

### JsonServiceClient Usage

To get started you'll just need an instance of `JsonServiceClient` initialized with the **BaseUrl** of the 
remote ServiceStack instance you want to access, e.g:

```kotlin
val client = JsonServiceClient("https://techstacks.io")
```

::: info
The JsonServiceClient is made available after the [net.servicestack:android](https://bintray.com/servicestack/maven/ServiceStack.Android/view) package is automatically added to your **build.gradle** when adding a ServiceStack reference
:::

Typical usage of the Service Client is the same in .NET where you just need to send a populated Request DTO 
and the Service Client will return a populated Response DTO, e.g:

```kotlin
val response: AppOverviewResponse? = client.get(AppOverview())
val allTiers: ArrayList<Option> = response.AllTiers
val topTech: ArrayList<TechnologyInfo> = response.TopTechnologies
```

::: info Tip
Explicit type annotations are unnecessary in Kotlin, added above to show the types returned
:::

Another example using a populated Request DTO:

```kotlin
var request = GetTechnology()
request.Slug = "servicestack"

val response = client.get(request)
```

### Custom Example Usage

We'll now go through some of the other API's to give you a flavour of what's available. When preferred you 
can also consume Services using a custom route by supplying a string containing the route and/or Query String. 
As no type info is available you'll need to specify the Response DTO class to deserialize the response into, e.g:

```kotlin
val response = client.get("/overview", OverviewResponse::class.java)
```

The path can either be a relative or absolute url in which case the **BaseUrl** is ignored and the full 
absolute url is used instead, e.g:

```kotlin
val response = client.get("https://techstacks.io/overview", OverviewResponse::class.java)
```

### AutoQuery Example Usage

You can also send requests composed of both a Typed DTO and untyped String Map by providing a Hash Map of 
additional args. This is typically used when querying 
[implicit conventions in AutoQuery services](/autoquery#implicit-conventions), e.g:

```kotlin
val response = client.get(FindTechnologies(), hashMapOf(Pair("DescriptionContains","framework")))
```

There's also the [Utils.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/Utils.java) 
static class which contains a number of helpers to simplify common usage patterns and reduce the amount of 
boiler plate required for common tasks, e.g they can simplify reading raw bytes or raw String from a HTTP Response. 

Here's how you can download an image bytes using a custom `JsonServiceClient` HTTP Request and load 
it into an Android Image `Bitmap`:

```kotlin
val httpRes:HttpURLConnection = client.get("https://servicestack.net/img/logo.png")
val imgBytes = Utils.readBytesToEnd(httpRes)
val img = BitmapFactory.decodeByteArray(imgBytes, 0, imgBytes.size)
```

### AndroidServiceClient

Unlike .NET, the JVM doesn't have an established Async story or any language support that simplifies execution 
and composition of Async tasks, as a result the Async story on Android is fairly fragmented with multiple 
options built-in for executing non-blocking tasks on different threads including:

 - Thread
 - Executor
 - HandlerThread
 - AsyncTask
 - Service
 - IntentService
 - AsyncQueryHandler
 - Loader

JayWay's Oredev presentation on [Efficient Android Threading](http://www.slideshare.net/andersgoransson/efficient-android-threading) 
provides a good overview of the different threading strategies above with their use-cases, features and pitfalls. 
Unfortunately none of the above options enable a Promise/Future-like API which would've been ideal in maintaining 
a consistent Task-based Async API across all ServiceStack Clients. Of all the above options the new Android 
[AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) ended up the most suitable option, 
requiring the least effort for the typical Service Client use-case of executing non-blocking WebService Requests 
and having their results called back on the Main UI thread.

### AsyncResult

To enable a simpler Async API decoupled from Android, we've introduced a higher-level 
[AsyncResult](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/AsyncResult.java) 
abstract class which allows capturing of Async callbacks using an idiomatic anonymous Java class to provide an 
optimal dev experience for Java 7 on Android.

::: info
`AsyncResult` is modelled after [jQuery.ajax](http://api.jquery.com/jquery.ajax/) and allows specifying 
**success()**, **error()** and **complete()** callbacks as needed
:::

To provide an optimal experience for Kotlin and Java 8, we've added 
[SAM overloads](https://kotlinlang.org/docs/reference/java-interop.html#sam-conversions) 
using the alternative `AsyncSuccess<T>`, `AsyncSuccessVoid` and `AsyncError` interfaces which as they only 
contain a single method are treated like a lambda in Kotlin/Java 8, so instead of using the more verbose 
`AsyncResult<T>` overloads:

```kotlin
client.getAsync(Overview(), object: AsyncResult<OverviewResponse>() {
    override fun success(response: OverviewResponse?) {
        var topUsers = response!!.TopUsers
    }
    override fun error(ex: Exception?) {
        ex?.printStackTrace()
    }
})
```

You can instead use the equivalent and more succinct `AsyncSuccess<T>` API:

```kotlin
client.getAsync(Overview(), AsyncSuccess<OverviewResponse> {
        var topUsers = it.TopUsers
    }, AsyncError {
        it.printStackTrace()
    })
```

### AsyncServiceClient API

The complete `AsyncServiceClient` API implemented by `AndroidServiceClient`:

```java
public interface AsyncServiceClient {
    <T> void sendAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    <T> void sendAsync(IReturn<T> request, final AsyncSuccess<T> success);
    <T> void sendAsync(IReturn<T> request, final AsyncSuccess<T> success, final AsyncError error);
    void sendAsync(IReturnVoid request, final AsyncResultVoid asyncResult);
    void sendAsync(IReturnVoid request, final AsyncSuccessVoid success);
    void sendAsync(IReturnVoid request, final AsyncSuccessVoid success, final AsyncError error);

    <T> void getAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    <T> void getAsync(IReturn<T> request, final AsyncSuccess<T> success);
    <T> void getAsync(IReturn<T> request, final AsyncSuccess<T> success, final AsyncError error);
    void getAsync(IReturnVoid request, final AsyncResultVoid asyncResult);
    void getAsync(IReturnVoid request, final AsyncSuccessVoid success);
    void getAsync(IReturnVoid request, final AsyncSuccessVoid success, final AsyncError error);
    <T> void getAsync(IReturn<T> request, final Map<String, String> queryParams, final AsyncResult<T> asyncResult);
    <T> void getAsync(IReturn<T> request, final Map<String, String> queryParams, AsyncSuccess<T> success);
    <T> void getAsync(String path, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void getAsync(String path, final Class responseType, final AsyncSuccess<T> success);
    <T> void getAsync(String path, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void getAsync(String path, final Type responseType, final AsyncSuccess<T> success);
    void getAsync(String path, final AsyncResult<byte[]> asyncResult);
    void getAsync(String path, final AsyncSuccess<byte[]> success);

    <T> void postAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    <T> void postAsync(IReturn<T> request, final AsyncSuccess<T> success);
    <T> void postAsync(IReturn<T> request, final AsyncSuccess<T> success, final AsyncError error);
    void postAsync(IReturnVoid request, final AsyncResultVoid asyncResult);
    void postAsync(IReturnVoid request, final AsyncSuccessVoid success);
    void postAsync(IReturnVoid request, final AsyncSuccessVoid success, final AsyncError error);
    <T> void postAsync(String path, final Object request, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void postAsync(String path, final Object request, final Class responseType, final AsyncSuccess<T> success);
    <T> void postAsync(String path, final Object request, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void postAsync(String path, final Object request, final Type responseType, final AsyncSuccess<T> success);
    <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncSuccess<T> success);
    <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncSuccess<T> success);
    void postAsync(String path, final byte[] requestBody, final String contentType, final AsyncResult<byte[]> asyncResult);
    void postAsync(String path, final byte[] requestBody, final String contentType, final AsyncSuccess<byte[]> success);

    <T> void putAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    <T> void putAsync(IReturn<T> request, final AsyncSuccess<T> success);
    <T> void putAsync(IReturn<T> request, final AsyncSuccess<T> success, final AsyncError error);
    void putAsync(IReturnVoid request, final AsyncResultVoid asyncResult);
    void putAsync(IReturnVoid request, final AsyncSuccessVoid success);
    void putAsync(IReturnVoid request, final AsyncSuccessVoid success, final AsyncError error);
    <T> void putAsync(String path, final Object request, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void putAsync(String path, final Object request, final Class responseType, final AsyncSuccess<T> success);
    <T> void putAsync(String path, final Object request, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void putAsync(String path, final Object request, final Type responseType, final AsyncSuccess<T> success);
    <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncSuccess<T> success);
    <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncSuccess<T> success);
    void putAsync(String path, final byte[] requestBody, final String contentType, final AsyncResult<byte[]> asyncResult);
    void putAsync(String path, final byte[] requestBody, final String contentType, final AsyncSuccess<byte[]> success);

    <T> void deleteAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    <T> void deleteAsync(IReturn<T> request, final AsyncSuccess<T> success);
    <T> void deleteAsync(IReturn<T> request, final AsyncSuccess<T> success, final AsyncError error);
    void deleteAsync(IReturnVoid request, final AsyncResultVoid asyncResult);
    void deleteAsync(IReturnVoid request, final AsyncSuccessVoid success);
    void deleteAsync(IReturnVoid request, final AsyncSuccessVoid success, final AsyncError error);
    <T> void deleteAsync(IReturn<T> request, final Map<String, String> queryParams, final AsyncResult<T> asyncResult);
    <T> void deleteAsync(IReturn<T> request, final Map<String, String> queryParams, final AsyncSuccess<T> success);
    <T> void deleteAsync(String path, final Class responseType, final AsyncResult<T> asyncResult);
    <T> void deleteAsync(String path, final Class responseType, final AsyncSuccess<T> success);
    <T> void deleteAsync(String path, final Type responseType, final AsyncResult<T> asyncResult);
    <T> void deleteAsync(String path, final Type responseType, final AsyncSuccess<T> success);
    void deleteAsync(String path, final AsyncResult<byte[]> asyncResult);
    void deleteAsync(String path, final AsyncSuccess<byte[]> success);
}
```

The `AsyncServiceClient` interface is implemented by the `AndroidServiceClient` concrete class which 
behind-the-scenes uses an Android [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) 
to implement its Async API's. 

Whilst the `AndroidServiceClient` is contained in the **net.servicestack:android** dependency and only works in 
Android, the `JsonServiceClient` instead is contained in a seperate pure Java **net.servicestack:client** 
dependency which can be used independently to provide a typed Java API for consuming ServiceStack Services 
from any Java or Kotlin JVM application.

### Async API Usage

To make use of Async API's in an Android App (which you'll want to do to keep web service requests off the 
Main UI thread), you'll instead need to use an instance of `AndroidServiceClient` which as it inherits 
`JsonServiceClient` can be used to perform both Sync and Async requests:

```kotlin
val client = AndroidServiceClient("https://techstacks.io")
```

Like other Service Clients, there's an equivalent Async API matching their Sync counterparts which differs 
by ending with an **Async** suffix which instead of returning a typed response, fires the supplied callback 
with the typed response, e.g: 

```kotlin
client.getAsync(AppOverview(), AsyncSuccess<AppOverviewResponse> {
    val allTiers = it.AllTiers
    val topTech = it.TopTechnologies
})
```

Which just like the `JsonServiceClient` Sync examples above also provide a number of flexible options to execute 
Custom Async Web Service Requests, e.g: 

```kotlin
client.getAsync("/overview", OverviewResponse::class.java,
    AsyncSuccess<OverviewResponse?> {  
    })
```

Calling a Web Service using an absolute url:

```kotlin
client.getAsync("https://techstacks.io/overview", OverviewResponse::class.java,
    AsyncSuccess<OverviewResponse>() {
    })
```

#### Async AutoQuery Example

Calling an untyped AutoQuery Service with additional untyped Dictionary String arguments:

```kotlin
client.getAsync(FindTechnologies(), hashMapOf(Pair("DescriptionContains", "framework")),
    AsyncSuccess<QueryResponse<Technology>>() {
    })
```

#### Download Raw Image Async Example

Example downloading raw Image bytes and loading it into an Android Image `Bitmap`:

```kotlin
client.getAsync("https://servicestack.net/img/logo.png", {
    val img = BitmapFactory.decodeByteArray(it, 0, it.size);
})
```

#### Send Raw String or byte[] Requests

You can easily get the raw string Response from Request DTO's that return are annotated with `IReturn<string>`, e.g:
 
```java
open class HelloString : IReturn<String> { ... }

var request = HelloString()
request.name = "World"

val response:String? = client.get(request)
```

You can also specify that you want the raw UTF-8 `byte[]` or `String` response instead of a the deserialized 
Response DTO by specifying the Response class you want returned, e.g:

```kotlin
val response:ByteArray = client.get("/hello?Name=World", ByteArray::class.java);
```

#### Kotlin HTTP Marker Interfaces

Like the .NET and Swift Service Clients, the HTTP Interface markers are also annotated on Kotlin DTO's and let 
you use the same `send` API to send Requests via different HTTP Verbs, e.g:  

```kotlin
open class HelloGet : IReturn<HelloVerbResponse>, IGet { ... }
open class HelloPut : IReturn<HelloVerbResponse>, IPut { ... }

val response = client.send(HelloGet()) //GET

client.sendAsync(HelloPut(),           //PUT
    AsyncSuccess<HelloVerbResponse> { });
```

#### IReturnVoid Support

Sync/Async overloads are also available for `IReturnVoid` Request DTO's:

```kotlin
client.delete(DeleteCustomer())
```

### Typed Error Handling

Thanks to Kotlin also using typed Exceptions for error control flow, error handling in Kotlin will be instantly 
familiar to C# devs which also throws a typed `WebServiceException` containing the remote servers structured 
error data:

```kotlin
var request = ThrowType()
request.Type = "NotFound"
request.message = "not here"

try {
    val response = client.post(request)
} catch(webEx: WebServiceException) {
    val status = webEx.responseStatus
    status.message    //= not here
    status.stackTrace //= (Server StackTrace)
}
```

Likewise structured Validation Field Errors are also accessible from the familiar `ResponseStatus` DTO, e.g:

```kotlin
var request = ThrowValidation()
request.email = "invalidemail"

try {
    client.post(request);
} catch (webEx: WebServiceException){
    val status = webEx.responseStatus

    val firstError = status.errors[0]
    firstError.errorCode //= InclusiveBetween
    firstError.message   //= 'Age' must be between 1 and 120. You entered 0.
    firstError.fieldName //= Age
}
```

#### Async Error Handling
Async Error handling differs where in order to access the `WebServiceException` you'll need to implement the **error(Exception)** callback, e.g:

```kotlin
client.postAsync(request, AsyncSuccess<ThrowTypeResponse> { },
    AsyncError {
        val webEx = it as WebServiceException

        val status = webEx.responseStatus
        status.message    //= not here
        status.stackTrace //= (Server StackTrace)
    })
```

Async Validation Errors are also handled in the same way: 

```kotlin
client.postAsync(request, AsyncSuccess<ThrowValidationResponse> { },
    AsyncError {
        val webEx = it as WebServiceException

        val status = webEx.responseStatus
        val firstError = status.errors[0]
        firstError.errorCode //= InclusiveBetween
        firstError.message   //= 'Age' must be between 1 and 120. You entered 0.
        firstError.fieldName //= Age
    })
```

### JsonServiceClient Error Handlers
To make it easier to generically handle Web Service Exceptions, the Java Service Clients also support static Global Exception handlers by assigning `AndroidServiceClient.GlobalExceptionFilter`, e.g:

```kotlin
AndroidServiceClient.GlobalExceptionFilter = ExceptionFilter { res:HttpURLConnection?, ex ->
}
```

As well as local Exception Filters by specifying a handler for `client.ExceptionFilter`, e.g:

```kotlin
client.ExceptionFilter = ExceptionFilter { res:HttpURLConnection?, ex ->
}
```

### More Usage Examples

You can find more sync and async Kotlin ServiceClient examples in the links below:

 - [Kotlin ServiceClient Tests](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/AndroidClient/kotlin/src/androidTest/java/test/servicestack/net/kotlin)
 - [TechStacks Kotlin App](https://github.com/ServiceStackApps/TechStacksKotlinApp)

## Kotlin generated DTO Types

Our goal with **Kotlin Add ServiceStack Reference** is to ensure a high-fidelity, idiomatic translation within 
the constraints of Kotlin language and its built-in libraries, where .NET Server DTO's are translated into 
clean, conventional Kotlin classes where .NET built-in Value Types mapped to their equivalent JVM data Type.

To see what this ends up looking up we'll go through some of the 
[Generated Test Services](http://test.servicestack.net/types/kotlin) to see how they're translated in Kotlin.

### .NET Attributes translated into Java Annotations
By inspecting the `HelloAllTypes` Request DTO we can see that C# Metadata Attributes e.g. `[Route("/all-types")]` 
are also translated into the typed Kotlin Annotations defined in the **net.servicestack:client** dependency. 
But as JVM only supports defining a single Annotation of the same type, any subsequent .NET Attributes of 
the same type are emitted in comments.

### Terse, typed API's with IReturn interfaces
Kotlin Request DTO's are also able to take advantage of the `IReturn<TResponse>` interface marker to provide 
its terse, typed generic API but due to JVM's Type erasure the Response Type also needs to be encoded in the 
Request DTO as seen by the `responseType` static companion property:

```java
@Route("/all-types")
open class HelloAllTypes : IReturn<HelloAllTypesResponse>
{
    var name:String? = null
    var allTypes:AllTypes? = null
    var allCollectionTypes:AllCollectionTypes? = null
    companion object { private val responseType = HelloAllTypesResponse::class.java }
    override fun getResponseType(): Any? = responseType
}
```

### DTO Property Behavior

To comply with Gson JSON Serialization rules, the public DTO properties are emitted in the same JSON naming 
convention as the remote ServiceStack server which for the [test.servicestack.net](http://test.servicestack.net) 
Web Services, follows its **camelCase** naming convention that is configured in its AppHost with: 

```csharp
JsConfig.Init(new Config { TextCase = TextCase.CamelCase });
```

### Kotlin Type Conversions

By inspecting the `AllTypes` DTO properties we can see what Kotlin Type each built-in .NET Type gets translated 
into. In each case it selects the most suitable concrete datatype available, inc. generic collections. 
We also see nullable reference types are used since DTO properties are optional and need to be nullable, whlist 
collection types are default initialized to an empty collection to make it simplify its usage in Kotlin:

```kotlin
open class AllTypes
{
    var id:Int? = null
    var nullableId:Int? = null
    @SerializedName("byte") var Byte:Short? = null
    @SerializedName("short") var Short:Short? = null
    @SerializedName("int") var Int:Int? = null
    @SerializedName("long") var Long:Long? = null
    var uShort:Int? = null
    var uInt:Long? = null
    var uLong:BigInteger? = null
    @SerializedName("float") var Float:Float? = null
    @SerializedName("double") var Double:Double? = null
    var decimal:BigDecimal? = null
    var string:String? = null
    var dateTime:Date? = null
    var timeSpan:TimeSpan? = null
    var dateTimeOffset:Date? = null
    var guid:UUID? = null
    @SerializedName("char") var Char:String? = null
    var nullableDateTime:Date? = null
    var nullableTimeSpan:TimeSpan? = null
    var stringList:ArrayList<String> = ArrayList<String>()
    var stringArray:ArrayList<String>? = null
    var stringMap:HashMap<String,String> = HashMap<String,String>()
    var intStringMap:HashMap<Int,String> = HashMap<Int,String>()
    var subType:SubType? = null
}
```

The only built-in Value Type that didn't have a suitable built-in Java equivalent was `TimeSpan`. 
In this case it uses our new 
[TimeSpan.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/TimeSpan.java) 
class which implements the same familiar API available in .NET's `TimeSpan`. 

Something else you'll notice is that some fields are annotated with the `@SerializedName()` Gson annotation. 
This is automatically added for Kotlin keywords. The first time a Gson annotation is referenced it also 
automatically includes the required Gson namespace imports. If needed, this can also be explicitly added by with:
```csharp
KotlinGenerator.AddGsonImport = true;
```

### Kotlin Enums
.NET enums are also translated into typed Kotlin enums where basic enums end up as a straightforward translation, e.g:

```kotlin
enum class BasicEnum
{
    Foo,
    Bar,
    Baz,
}
```

Whilst as Kotlin doesn't support integer Enum flags directly the resulting translation ends up being a bit more convoluted:

```kotlin
@Flags()
enum class EnumFlags(val value:Int)
{
    @SerializedName("1") Value1(1),
    @SerializedName("2") Value2(2),
    @SerializedName("4") Value3(4),
}
```

## Kotlin Configuration
The header comments in the generated DTO's allows for further customization of how the DTO's are generated 
which can then be updated with any custom Options provided using the **Update ServiceStack Reference** Menu Item 
in Android Studio. Options that are preceded by a single line Java comment `//` are defaults from the server 
which can be overridden.

To override a value, remove the `//` and specify the value to the right of the `:`. Any value uncommented will 
be sent to the server to override any server defaults.

```kotlin
/* Options:
Date: 2015-12-17 05:17:47
Version: 4.051
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://techstacks.io

Package: servicestack.net.techstacks
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//IncludeTypes: 
//ExcludeTypes: 
//InitializeCollections: True
//TreatTypesAsStrings: 
//DefaultImports: java.math.*,java.util.*,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*
*/
```
We'll go through and cover each of the above options to see how they affect the generated DTO's:

### Package
Specify the package name that the generated DTO's are in:
```
Package: net.servicestack.techstacks
```
Will generate the package name for the generated DTO's as:

```kotlin
package servicestack.net.techstacks
```

### AddServiceStackTypes
Lets you exclude built-in ServiceStack Types and DTO's from being generated with:
```
AddServiceStackTypes: False
```
This will prevent Request DTO's for built-in ServiceStack Services like `Authenticate` from being emitted.

### AddImplicitVersion
Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client:
```
AddImplicitVersion: 1
```
Which will embed the specified Version number in each Request DTO, e.g:

```kotlin
open class GetTechnology : IReturn<GetTechnologyResponse>
{
    val Version:Int = 1
}

```
This lets you know what Version of the Service Contract that existing clients are using making it easy to implement [ServiceStack's recommended versioning strategy](http://stackoverflow.com/a/12413091/85785).

### IncludeTypes
Is used as a Whitelist that can be used to specify only the types you would like to have code-generated:
```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```
Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's, e.g:

```kotlin
open class GetTechnology : IReturn<GetTechnologyResponse> { ... }
open class GetTechnologyResponse { ... }
```

#### Include Request DTO and its dependent types

You can include a Request DTO and all its dependent types with a `.*` suffix on the Request DTO, e.g:

```
/* Options:
IncludeTypes: GetTechnology.*
```

Which will include the `GetTechnology` Request DTO, the `GetTechnologyResponse` Response DTO and all Types that they both reference.

#### Include All Types within a C# namespace

If your DTOs are grouped into different namespaces they can be all included using the `/*` suffix, e.g:

```
/* Options:
IncludeTypes: MyApp.ServiceModel.Admin/*
```

This will include all DTOs within the `MyApp.ServiceModel.Admin` C# namespace. 

#### Include All Services in a Tag Group

Services [grouped by Tag](/api-design#group-services-by-tag) can be used in the `IncludeTypes` where tags can be specified using braces in the format `{tag}` or `{tag1,tag2,tag3}`, e.g:

```
/* Options:
IncludeTypes: {web,mobile}
```

Or individually:

```
/* Options:
IncludeTypes: {web},{mobile}
```

### ExcludeTypes
Is used as a Blacklist where you can specify which types you would like to exclude from being generated:
```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```
Will exclude `GetTechnology` and `GetTechnologyResponse` DTO's from being generated.

### DefaultImports
Lets you override the default import packages included in the generated DTO's:
```
DefaultImports: java.math.*,java.util.*,net.servicestack.client.*,com.acme.custom.*
```
Will override the default imports with the ones specified, i.e: 

```kotlin
import java.math.*
import java.util.*
import net.servicestack.client.*
import com.acme.custom.*
```

By default the generated DTO's do not require any Google's Gson-specific serialization hints, but when they're 
needed e.g. if your DTO's use Kotlin keywords or are attributed with `[DataMember(Name=...)]` the required Gson 
imports are automatically added which can also be added explicitly with:
```csharp
JavaGenerator.AddGsonImport = true;
```
Which will add the following Gson imports:
```java
import com.google.gson.annotations.*
import com.google.gson.reflect.*
```

### TreatTypesAsStrings

Due to the [unusual encoding of Guid bytes](http://stackoverflow.com/a/18085116/85785) it may be instead be 
preferential to treat Guids as opaque strings so they are easier to compare back to their original C# Guids. 
This can be enabled with the new `TreatTypesAsStrings` option:

```
/* Options:
...
TreatTypesAsStrings: Guid

*/
```

## Example [TechStacks Android App](https://github.com/ServiceStackApps/TechStacksKotlinApp)
To demonstrate Kotlin Native Types in action we've ported the Java 
[TechStacks Android App](https://github.com/ServiceStackApps/TechStacksAndroidApp) to a native 
Android App written in Kotlin to showcase the responsiveness and easy-of-use of leveraging 
Kotlin Add ServiceStack Reference in Android Projects. 

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/techstacks-kotlin-app.png)](https://github.com/ServiceStackApps/TechStacksAndroidApp)

Checkout the [TechStacks Kotlin Android App](https://github.com/ServiceStackApps/TechStacksKotlinApp) 
repository for a nice overview of how it leverages Kotlin Native Types and iOS-inspired Data Binding to easily 
develop services-heavy Mobile Apps.
