---
title: Kotlin ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/kotlin-info.webp)
:::

## [Kotlin](https://kotlinlang.org/) - a better language for Android and the JVM

[Kotlin](https://kotlinlang.org/) is one of the 
[best modern languages for functional programming](https://github.com/mythz/kotlin-linq-examples) that's 
vastly more expressive, readable, maintainable and safer than Java - as illustrated by comparing 
[C#'s 101 LINQ Examples in Kotlin](https://github.com/mythz/kotlin-linq-examples) with the 
[same examples in Java](https://github.com/mythz/java-linq-examples). As Kotlin is developed by JetBrains 
it also has great tooling support in **Android Studio**, **IntelliJ** and **Eclipse** and seamlessly integrates 
with existing Java code where projects can mix-and-match Java and Kotlin code together within the same application - 
making Kotlin the default choice for Android Development.

As we expect more Android and Java projects to be written in Kotlin in future we've added first-class 
[Add ServiceStack Reference](/add-servicestack-reference) 
support for Kotlin with IDE integration in 
[Android Studio](http://developer.android.com/tools/studio/index.html) and 
[IntelliJ IDEA](https://www.jetbrains.com/idea/) where App Devlopers can create and update an end-to-end typed 
API with just a Menu Item click - enabling a highly-productive workflow for consuming ServiceStack Services.

### Kotlin - Concise, null-safe clients for Android and JVM services

Kotlin uses the same JVM client with DTOs generated as idiomatic Kotlin classes, keeping calls terse whilst nullability stays explicit in the type system:

```kotlin
val client = JsonServiceClient(baseUrl)

val response = client.get(Hello().apply { name = "World" })
println(response.result)
```

As the default language for new Android development, it's typically where an organization's mobile client meets the same backend its web App uses - with async APIs for background calls, structured errors, authentication, typed AutoQuery, batch and one-way requests and multipart uploads. Both Android Studio and IntelliJ can update the reference in place.

### What you can build

Kotlin uses the same [Java Client Library](/java-add-servicestack-reference) whose
[test suite](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/AndroidClient/client/src/test/java/net/servicestack/client)
exercises the API surface available to Kotlin Android Apps and JVM Applications:

 - Typed `GET`, `POST`, `PUT` and `DELETE` requests with blocking APIs in `JsonServiceClient` and callback APIs in `AndroidServiceClient`
 - Blocking APIs that can be called from Kotlin Coroutines to keep requests off the UI thread
 - HTTP Method inference from the generated `IGet`, `IPost`, `IPut`, `IDelete` and `IPatch` marker interfaces
 - Typed AutoQuery requests incl. paging, ordering and dynamic [implicit conventions](/autoquery/rdbms#implicit-conventions)
 - Structured `ResponseStatus` errors with field-level validation errors and local + global exception filters
 - Basic Auth, Session Cookies, Bearer Tokens and transparent Access Token renewal using Refresh Tokens
 - Single and multi-file multipart uploads sent together with a populated Request DTO
 - Custom routes, relative or absolute URLs, raw `String`, `ByteArray` and `InputStream` responses and request/response filters
 - `IReturnVoid` requests and high-fidelity Gson serialization of collections, enums, dates, `TimeSpan` durations, `UUID` and `BigDecimal`
 - Real-time [Server Events](/java-server-events-client) subscriptions

## Install

The pure Java `net.servicestack:client` package works in any **Java 8+** JVM Application and can be added to your
**build.gradle** with:

```groovy
dependencies {
    implementation 'net.servicestack:client:1.1.5'
    implementation 'com.google.code.gson:gson:2.11.0'
}
```

Or in Maven:

```xml
<dependency>
  <groupId>net.servicestack</groupId>
  <artifactId>client</artifactId>
  <version>1.1.5</version>
</dependency>
```

[Gson](https://github.com/google/gson) is the client's only external dependency, which is also referenced directly
by generated DTOs (e.g. for its `@SerializedName` annotation) so it should be included in your compile classpath.

Android Apps should instead use the **net.servicestack:android** package which contains the same
`net.servicestack.client` classes as well as the Android-specific `AndroidServiceClient` with its Async APIs and
`AndroidServerEventsClient`:

```groovy
dependencies {
    implementation 'net.servicestack:android:1.1.5'
}
```

## Add ServiceStack Reference from the command-line

Kotlin DTOs can be generated for any ServiceStack API from the command-line with
[npx get-dtos](/npx-get-dtos) which just needs Node.js installed:

:::sh
npx get-dtos kotlin https://test.servicestack.net
:::

Which saves the generated DTOs to `dtos.kt`. Unlike Java, Kotlin DTOs are generated as top-level classes so
only the `Package` they should be generated in needs to be specified, which can be added to the Add ServiceStack
Reference URL:

:::sh
npx get-dtos kotlin "https://test.servicestack.net?Package=com.myapp.dtos"
:::

Then later update all Kotlin ServiceStack References in the current directory (recursively) with:

:::sh
npx get-dtos kotlin
:::

Or update a single reference by specifying its file name:

:::sh
npx get-dtos dtos.kt
:::

Which resends the [code-generation options](#kotlin-configuration) in the generated file's header comments,
letting you customize what's generated by uncommenting and modifying them before updating.

The same functionality is also available in the [x dotnet tool](/dotnet-tool) with `x kotlin` and from within
Android Studio and IntelliJ IDEA using the ServiceStack IDEA plugin below.

### Quick start

Sending a populated Request DTO returns its typed Response DTO where Kotlin is able to infer the Response Type
from the Request DTO's `IReturn<T>` interface marker:

```kotlin
import net.servicestack.client.*
import com.myapp.dtos.*

val client = JsonServiceClient("https://test.servicestack.net")

val response = client.get(Hello().apply { name = "World" })
println(response.result) //= Hello, World!
```

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

```groovy
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'net.servicestack:android:1.1.5'
}
```

This also lets you change which ServiceStack Client library version you want to use, the example above uses 
**1.1.5** which is the latest version published to 
[Maven Central](https://mvnrepository.com/artifact/net.servicestack/android). The **net.servicestack:android** 
dependency contains the `AndroidServiceClient` and `JsonServiceClient` that your projects use to call remote 
ServiceStack Services using the typed Kotlin DTO's added to your project by the 
**Add ServiceStack Reference** feature.

### [Add ServiceStack Reference](/add-servicestack-reference) in Android Studio

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
Date: 2025-06-04 09:53:03
Version: 8.80
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://blazor-vue.web-templates.io

//Package: 
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//InitializeCollections: False
//TreatTypesAsStrings: 
//DefaultImports: java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*
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
    boolean getAlwaysSendBasicAuthHeaders();

    void setBearerToken(String value);
    String getBearerToken();
    void setTokenCookie(String value);

    void setRefreshToken(String bearerToken);
    String getRefreshToken();
    void setRefreshTokenCookie(String value);

    void setAlwaysSendBasicAuthHeaders(boolean value);
    void setCredentials(String userName, String password);

    <TResponse> TResponse send(IReturn<TResponse> request);
    void send(IReturnVoid request);

    <TResponse> TResponse get(IReturn<TResponse> request);
    void get(IReturnVoid request);
    <TResponse> TResponse get(IReturn<TResponse> request, Map<String,String> queryParams);
    <TResponse> TResponse get(String path, Class responseType);
    <TResponse> TResponse get(String path, Type responseType);
    HttpURLConnection get(String path);

    <TResponse> TResponse post(IReturn<TResponse> request);
    void post(IReturnVoid request);
    <TResponse> TResponse post(String path, Object request, Class responseType);
    <TResponse> TResponse post(String path, Object request, Type responseType);
    <TResponse> TResponse post(String path, byte[] requestBody, String contentType, Class responseType);
    <TResponse> TResponse post(String path, byte[] requestBody, String contentType, Type responseType);
    HttpURLConnection post(String path, byte[] requestBody, String contentType);

    <TResponse> TResponse put(IReturn<TResponse> request);
    void put(IReturnVoid request);
    <TResponse> TResponse put(String path, Object request, Class responseType);
    <TResponse> TResponse put(String path, Object request, Type responseType);
    <TResponse> TResponse put(String path, byte[] requestBody, String contentType, Class responseType);
    <TResponse> TResponse put(String path, byte[] requestBody, String contentType, Type responseType);
    HttpURLConnection put(String path, byte[] requestBody, String contentType);

    <TResponse> TResponse delete(IReturn<TResponse> request);
    void delete(IReturnVoid request);
    <TResponse> TResponse delete(IReturn<TResponse> request, Map<String,String> queryParams);
    <TResponse> TResponse delete(String path, Class responseType);
    <TResponse> TResponse delete(String path, Type responseType);
    HttpURLConnection delete(String path);

    void setCookie(String name, String value);
    void setCookie(String name, String value, Long expiresInSecs);
    void clearCookies();
    String getCookieValue(String name);
    String getTokenCookie();
    String getRefreshTokenCookie();

    <TResponse> TResponse postFileWithRequest(IReturn<TResponse> request, UploadFile file);
    <TResponse> TResponse postFileWithRequest(Object request, UploadFile file, Object responseType);
    <TResponse> TResponse postFileWithRequest(String path, Object request, UploadFile file, Object responseType);

    <TResponse> TResponse postFilesWithRequest(IReturn<TResponse> request, UploadFile[] files);
    <TResponse> TResponse postFilesWithRequest(Object request, UploadFile[] files, Object responseType);
    <TResponse> TResponse postFilesWithRequest(String path, Object request, UploadFile[] files, Object responseType);
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
The JsonServiceClient is made available after the `net.servicestack:android` package is automatically added to your **build.gradle** when adding a ServiceStack reference
:::

Typical usage of the Service Client is the same in .NET where you just need to send a populated Request DTO 
and the Service Client will return a populated Response DTO, e.g:

```kotlin
val response: AppOverviewResponse = client.get(AppOverview())
val allTiers: ArrayList<Option> = response.allTiers
val topTech: ArrayList<TechnologyInfo> = response.topTechnologies
```

::: info Tip
Explicit type annotations are unnecessary in Kotlin, added above to show the types returned
:::

Another example using a populated Request DTO, where Kotlin's `apply` scope function can be used to populate
and send a Request DTO in a single expression:

```kotlin
val request = GetTechnology()
request.slug = "servicestack"

val response = client.get(request)
```

Kotlin's `apply` scope function can also be used to populate and send a Request DTO in a single expression:

```kotlin
val response = client.get(GetTechnology().apply { slug = "servicestack" })
```

### JSON API Base Path

`JsonServiceClient` sends Requests to ServiceStack's [pre-defined /api route](/routing#json-api-pre-defined-route)
by default, i.e. APIs without a user-defined route are sent to `/api/{Request}`:

```kotlin
val client = JsonServiceClient("https://test.servicestack.net")
client.replyUrl //= https://test.servicestack.net/api/
```

Use `setBasePath()` to change where APIs are sent, e.g. older ServiceStack instances that only have the legacy
pre-defined routes enabled can revert to using them with:

```kotlin
client.setBasePath()      //= /json/reply/{Request}
client.setBasePath("api") //= /api/{Request} (default)
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

Generated [AutoQuery](/autoquery/) Request DTOs inherit the standard paging, ordering and field selection 
properties from `QueryBase` which can be populated like any other Kotlin property. As AutoQuery services return 
the generic `QueryResponse<T>` Response Type, the generated Request DTO encodes it in a Gson `TypeToken` so the 
same terse typed API can be used:

```kotlin
val request = FindTechnologies().apply {
    name = "ServiceStack"
    skip = 0
    take = 10
    orderByDesc = "ViewCount"
}

val response = client.get(request)

response.offset
response.total
response.results.forEach { println(it.name) }
```

You can also send requests composed of both a Typed DTO and untyped String Map by providing a Hash Map of 
additional args. This is typically used when querying 
[implicit conventions in AutoQuery services](/autoquery/rdbms#implicit-conventions), e.g:

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

### Integrated Basic Auth

HTTP Basic Auth is supported in `JsonServiceClient` following the implementation in .NET Service Clients
where you can specify the users credentials and whether you always want to send Basic Auth with each request by:

```kotlin
client.setCredentials(userName, password)
client.alwaysSendBasicAuthHeaders = true

val response = client.get(TestAuth())
```

It also supports processing challenged 401 Auth HTTP responses where it will transparently replay the failed
request with the Basic Auth Headers.

### Cookies-enabled Service Client

The `JsonServiceClient` initializes a `CookieManager` in its constructor to enable any Cookies received to
be added on subsequent requests to allow you to make authenticated requests after authenticating, e.g:

```kotlin
val authResponse = client.post(Authenticate().apply {
    provider = "credentials"
    userName = "test"
    password = "test"
})

val response = client.get(TestAuth())
```

Individual cookies can also be read and populated directly:

```kotlin
client.setCookie("ss-opt", "perm")
client.setCookie("ss-tok", jwt, 60 * 60L) //expires in secs

val value = client.getCookieValue("ss-opt")
val cookies = client.cookies
client.clearCookies()
```

### Bearer Tokens and API Keys

APIs protected with [JWT](/auth/jwt-authprovider) or [API Keys](/auth/apikeys) just need to have their token
populated on the client where it's sent in the HTTP `Authorization` Bearer Token header of each request:

```kotlin
client.bearerToken = apiKeyOrJwt

val response = client.send(Secured().apply { name = "test" })
```

### Automatic Access Token renewal with Refresh Tokens

When a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) is populated, a `401 Unauthorized` response causes
`JsonServiceClient` to transparently fetch a new JWT Access Token and replay the original request with it:

```kotlin
client.refreshToken = refreshToken

val response = client.send(request)
```

Authenticating with a server configured to use JWT Cookies also populates the `ss-tok` and `ss-reftok` Cookies
which the client uses to renew expired Access Tokens without any additional configuration:

```kotlin
client.post(Authenticate().apply {
    provider = "credentials"
    userName = "test"
    password = "test"
})

val accessToken = client.tokenCookie         //= ss-tok Cookie
val refreshToken = client.refreshTokenCookie //= ss-reftok Cookie

//Continues to work after the Access Token has expired
val response = client.send(Secured().apply { name = "test" })
```

If the Refresh Token has also expired a `RefreshTokenException` is thrown which can be used to redirect users
to re-authenticate:

```kotlin
try {
    val response = client.send(request)
} catch (ex: RefreshTokenException) {
    //Refresh Token invalid or expired, re-authenticate...
}
```

### Uploading Files

Use `postFileWithRequest` to upload a file with a populated Request DTO where the Request DTO's properties are
sent as fields in the same `multipart/form-data` HTTP Request:

```kotlin
val audioBytes = Files.readAllBytes(Paths.get("audio.wav"))

val request = SpeechToText().apply { refId = "uniqueUserIdForRequest" }

val response = client.postFileWithRequest(request,
    UploadFile("audio", "audio.wav", "audio/wav", audioBytes))
```

Where `UploadFile` is populated with the **field name** the server expects, the **file name**, its **Content Type**
and the file's contents. Uploads can also be sent to a custom path by specifying the path and Response Type:

```kotlin
val response = client.postFileWithRequest<TextGenerationResponse>("/api/SpeechToText",
    request,
    UploadFile("audio", "audio.wav", "audio/wav", audioBytes),
    TextGenerationResponse::class.java)
```

::: info
The explicit type argument is needed for the custom path overloads as Kotlin can't infer the Response Type
from the `Class` argument, alternatively it can be inferred from an explicit type annotation, i.e.
`val response:TextGenerationResponse = client.postFileWithRequest(...)`
:::

Multiple files can be uploaded in the same request with `postFilesWithRequest`:

```kotlin
val files = arrayOf(
    UploadFile("audio", "test.txt", "text/plain", Utils.toUtf8Bytes("Hello World")),
    UploadFile("content", "test.md", "text/markdown", Utils.toUtf8Bytes("## Heading"))
)

val response = client.postFilesWithRequest(TestFileUploads().apply {
    id = 1
    refId = "refId"
}, files)

response.files.forEach {
    println("${it.name}: ${it.fileName} (${it.contentType}) ${it.contentLength} bytes")
}
```

Android Apps can use the equivalent `postFileWithRequestAsync` and `postFilesWithRequestAsync` APIs on
`AndroidServiceClient` to upload files without blocking the UI thread.

### Kotlin Speech to Text

An example of calling [AI Server's](/ai-server/) `SpeechToText` API to transcribe an audio recording:

```kotlin
val client = JsonServiceClient(aiServerUrl)
client.bearerToken = apiKey

val audioBytes = Files.readAllBytes(Paths.get("test_audio.wav"))

val response = client.postFileWithRequest(SpeechToText(),
    UploadFile("audio", "test_audio.wav", "audio/wav", audioBytes))

// Two texts are returned, the timestamped text JSON and the plain text
val results = response.results!!
val textWithTimestamps = results[0].text
val textOnly = results[1].text
```

::: info
Whether generated collection properties are nullable depends on the remote Server's `InitializeCollections`
configuration, i.e. servers that initialize collections generate non-null `ArrayList<T>` properties whilst
servers that don't generate nullable `ArrayList<T>?` properties requiring a `!!` or `?.` safe call
:::

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
abstract class which allows capturing of Async callbacks using an idiomatic anonymous Java class.

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
        val topUsers = response!!.topUsers
    }
    override fun error(ex: Exception?) {
        ex?.printStackTrace()
    }
})
```

You can instead use the equivalent and more succinct `AsyncSuccess<T>` API:

```kotlin
client.getAsync(Overview(), AsyncSuccess<OverviewResponse> {
        val topUsers = it.topUsers
    }, AsyncError {
        it.printStackTrace()
    })
```

### AsyncServiceClient API

The complete `AsyncServiceClient` API implemented by `AndroidServiceClient`:

```java
public interface AsyncServiceClient {
    <T> void sendAsync(IReturn<T> request, AsyncResult<T> asyncResult);
    <T> void sendAsync(IReturn<T> request, AsyncSuccess<T> success);
    <T> void sendAsync(IReturn<T> request, AsyncSuccess<T> success, AsyncError error);
    void sendAsync(IReturnVoid request, AsyncResultVoid asyncResult);
    void sendAsync(IReturnVoid request, AsyncSuccessVoid success);
    void sendAsync(IReturnVoid request, AsyncSuccessVoid success, AsyncError error);

    <T> void getAsync(IReturn<T> request, AsyncResult<T> asyncResult);
    <T> void getAsync(IReturn<T> request, AsyncSuccess<T> success);
    <T> void getAsync(IReturn<T> request, AsyncSuccess<T> success, AsyncError error);
    void getAsync(IReturnVoid request, AsyncResultVoid asyncResult);
    void getAsync(IReturnVoid request, AsyncSuccessVoid success);
    void getAsync(IReturnVoid request, AsyncSuccessVoid success, AsyncError error);
    <T> void getAsync(IReturn<T> request, Map<String, String> queryParams, AsyncResult<T> asyncResult);
    <T> void getAsync(IReturn<T> request, Map<String, String> queryParams, AsyncSuccess<T> success);
    <T> void getAsync(String path, Class responseType, AsyncResult<T> asyncResult);
    <T> void getAsync(String path, Class responseType, AsyncSuccess<T> success);
    <T> void getAsync(String path, Type responseType, AsyncResult<T> asyncResult);
    <T> void getAsync(String path, Type responseType, AsyncSuccess<T> success);
    void getAsync(String path, AsyncResult<byte[]> asyncResult);
    void getAsync(String path, AsyncSuccess<byte[]> success);

    <T> void postAsync(IReturn<T> request, AsyncResult<T> asyncResult);
    <T> void postAsync(IReturn<T> request, AsyncSuccess<T> success);
    <T> void postAsync(IReturn<T> request, AsyncSuccess<T> success, AsyncError error);
    void postAsync(IReturnVoid request, AsyncResultVoid asyncResult);
    void postAsync(IReturnVoid request, AsyncSuccessVoid success);
    void postAsync(IReturnVoid request, AsyncSuccessVoid success, AsyncError error);
    <T> void postAsync(String path, Object request, Class responseType, AsyncResult<T> asyncResult);
    <T> void postAsync(String path, Object request, Class responseType, AsyncSuccess<T> success);
    <T> void postAsync(String path, Object request, Type responseType, AsyncResult<T> asyncResult);
    <T> void postAsync(String path, Object request, Type responseType, AsyncSuccess<T> success);
    <T> void postAsync(String path, byte[] requestBody, String contentType, Class responseType, AsyncResult<T> asyncResult);
    <T> void postAsync(String path, byte[] requestBody, String contentType, Class responseType, AsyncSuccess<T> success);
    <T> void postAsync(String path, byte[] requestBody, String contentType, Type responseType, AsyncResult<T> asyncResult);
    <T> void postAsync(String path, byte[] requestBody, String contentType, Type responseType, AsyncSuccess<T> success);
    void postAsync(String path, byte[] requestBody, String contentType, AsyncResult<byte[]> asyncResult);
    void postAsync(String path, byte[] requestBody, String contentType, AsyncSuccess<byte[]> success);

    <T> void putAsync(IReturn<T> request, AsyncResult<T> asyncResult);
    <T> void putAsync(IReturn<T> request, AsyncSuccess<T> success);
    <T> void putAsync(IReturn<T> request, AsyncSuccess<T> success, AsyncError error);
    void putAsync(IReturnVoid request, AsyncResultVoid asyncResult);
    void putAsync(IReturnVoid request, AsyncSuccessVoid success);
    void putAsync(IReturnVoid request, AsyncSuccessVoid success, AsyncError error);
    <T> void putAsync(String path, Object request, Class responseType, AsyncResult<T> asyncResult);
    <T> void putAsync(String path, Object request, Class responseType, AsyncSuccess<T> success);
    <T> void putAsync(String path, Object request, Type responseType, AsyncResult<T> asyncResult);
    <T> void putAsync(String path, Object request, Type responseType, AsyncSuccess<T> success);
    <T> void putAsync(String path, byte[] requestBody, String contentType, Class responseType, AsyncResult<T> asyncResult);
    <T> void putAsync(String path, byte[] requestBody, String contentType, Class responseType, AsyncSuccess<T> success);
    <T> void putAsync(String path, byte[] requestBody, String contentType, Type responseType, AsyncResult<T> asyncResult);
    <T> void putAsync(String path, byte[] requestBody, String contentType, Type responseType, AsyncSuccess<T> success);
    void putAsync(String path, byte[] requestBody, String contentType, AsyncResult<byte[]> asyncResult);
    void putAsync(String path, byte[] requestBody, String contentType, AsyncSuccess<byte[]> success);

    <T> void deleteAsync(IReturn<T> request, AsyncResult<T> asyncResult);
    <T> void deleteAsync(IReturn<T> request, AsyncSuccess<T> success);
    <T> void deleteAsync(IReturn<T> request, AsyncSuccess<T> success, AsyncError error);
    void deleteAsync(IReturnVoid request, AsyncResultVoid asyncResult);
    void deleteAsync(IReturnVoid request, AsyncSuccessVoid success);
    void deleteAsync(IReturnVoid request, AsyncSuccessVoid success, AsyncError error);
    <T> void deleteAsync(IReturn<T> request, Map<String, String> queryParams, AsyncResult<T> asyncResult);
    <T> void deleteAsync(IReturn<T> request, Map<String, String> queryParams, AsyncSuccess<T> success);
    <T> void deleteAsync(String path, Class responseType, AsyncResult<T> asyncResult);
    <T> void deleteAsync(String path, Class responseType, AsyncSuccess<T> success);
    <T> void deleteAsync(String path, Type responseType, AsyncResult<T> asyncResult);
    <T> void deleteAsync(String path, Type responseType, AsyncSuccess<T> success);
    void deleteAsync(String path, AsyncResult<byte[]> asyncResult);
    void deleteAsync(String path, AsyncSuccess<byte[]> success);

    <T> void postFileWithRequestAsync(IReturn<T> request, UploadFile file, AsyncResult<T> asyncResult);
    <T> void postFileWithRequestAsync(Object request, UploadFile file, Object responseType, AsyncResult<T> asyncResult);
    <T> void postFileWithRequestAsync(String path, Object request, UploadFile file, Object responseType, AsyncResult<T> asyncResult);

    <T> void postFilesWithRequestAsync(IReturn<T> request, UploadFile[] files, AsyncResult<T> asyncResult);
    <T> void postFilesWithRequestAsync(Object request, UploadFile[] files, Object responseType, AsyncResult<T> asyncResult);
    <T> void postFilesWithRequestAsync(String path, Object request, UploadFile[] files, Object responseType, AsyncResult<T> asyncResult);
}
```

> The `final` modifiers on callback parameters have been omitted for readability

The `AsyncServiceClient` interface is implemented by the `AndroidServiceClient` concrete class which 
behind-the-scenes uses an Android [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) 
to implement its Async API's. 

Whilst the `AndroidServiceClient` is contained in the **net.servicestack:android** dependency and only works in 
Android, the `JsonServiceClient` instead is contained in a seperate pure Java **net.servicestack:client** 
dependency which can be used independently to provide a typed Java API for consuming ServiceStack Services 
from any Java or Kotlin JVM application.

### Using Coroutines

Modern Kotlin Apps can skip the callback APIs entirely and call `JsonServiceClient`'s blocking APIs from a
Coroutine using the `Dispatchers.IO` dispatcher, which keeps the request off the Main UI thread whilst
retaining a linear, exception-based control flow:

```kotlin
suspend fun getTechnology(slug:String): GetTechnologyResponse = withContext(Dispatchers.IO) {
    client.get(GetTechnology().apply { this.slug = slug })
}
```

Which can be called from any Coroutine Scope, e.g. from an Android `ViewModel`:

```kotlin
viewModelScope.launch {
    try {
        val response = getTechnology("servicestack")
        //Back on the Main thread, safe to update the UI
        technology.value = response.technology
    } catch (webEx: WebServiceException) {
        error.value = webEx.responseStatus.message
    }
}
```

::: info
`JsonServiceClient` instances are safe to share between Coroutines, but as its configuration properties
(e.g. `bearerToken`, filters) are mutable it's recommended to configure a client instance once, up-front
:::

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
    val allTiers = it.allTiers
    val topTech = it.topTechnologies
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

#### Send Raw String or ByteArray Requests

You can easily get the raw string Response from Request DTO's that are annotated with `IReturn<String>`, e.g:
 
```kotlin
open class HelloString : IReturn<String> { ... }

val response:String = client.get(HelloString().apply { name = "World" })
```

You can also specify that you want the raw UTF-8 `ByteArray` or `String` response instead of the deserialized 
Response DTO by specifying the Response class you want returned, e.g:

```kotlin
val response:ByteArray = client.get("/hello?Name=World", ByteArray::class.java)
```

Large responses can be streamed by requesting an `InputStream` response, which is also returned for Request DTOs
annotated with `IReturn<InputStream>`:

```kotlin
val stream:InputStream = client.get("/hello?Name=World", InputStream::class.java)
val bytes = Utils.readBytesToEnd(stream)
stream.close()
```

::: info
As Kotlin can't infer the Response Type from a `Class` argument, these overloads need either an explicit type
annotation as above or an explicit type argument, e.g. `client.get<ByteArray>(path, ByteArray::class.java)`
:::

Requests can also be sent with a custom Content-Type and raw `ByteArray` body, e.g:

```kotlin
val httpRes:HttpURLConnection = client.post("/hello", 
    Utils.toUtf8Bytes("Name=World"), MimeTypes.FormUrlEncoded)
val json = Utils.readToEnd(httpRes) //= {"result":"Hello, World!"}
```

#### Kotlin HTTP Marker Interfaces

Like the .NET and Swift Service Clients, the HTTP Interface markers are also annotated on Kotlin DTO's and let 
you use the same `send` API to send Requests via different HTTP Verbs, e.g:  

```kotlin
open class HelloGet : IReturn<HelloVerbResponse>, IGet { ... }
open class HelloPut : IReturn<HelloVerbResponse>, IPut { ... }

val response = client.send(HelloGet()) //GET

client.sendAsync(HelloPut(),           //PUT
    AsyncSuccess<HelloVerbResponse> { })
```

Requests are sent to the [pre-defined /api route](/routing#json-api-pre-defined-route) with the HTTP Method of
the marker interface it implements, e.g. `send(SendGet().apply { id = 1 })` is sent as a `GET /api/SendGet?id=1`
whilst Request DTOs without a HTTP marker interface are sent as a `POST`. As `GET` and `DELETE` requests can't
have a request body, their DTO properties are sent in the query string instead.

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
val request = ThrowType().apply {
    Type = "NotFound"
    message = "not here"
}

try {
    val response = client.post(request)
} catch(webEx: WebServiceException) {
    webEx.statusCode        //= 404
    webEx.statusDescription //= Not Found

    val status = webEx.responseStatus
    status.errorCode  //= NotFound
    status.message    //= not here
    status.stackTrace //= (Server StackTrace)
}
```

Likewise structured Validation Field Errors are also accessible from the familiar `ResponseStatus` DTO, e.g:

```kotlin
val request = ThrowValidation().apply { email = "invalidemail" }

try {
    client.post(request)
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

To make it easier to generically handle Web Service Exceptions, the Java Service Clients also support static
Global Exception handlers by assigning `JsonServiceClient.GlobalExceptionFilter` (or
`AndroidServiceClient.GlobalExceptionFilter` in Android Apps), e.g:

```kotlin
JsonServiceClient.GlobalExceptionFilter = ExceptionFilter { res:HttpURLConnection?, ex ->
}
```

As well as local Exception Filters by specifying a handler for `client.ExceptionFilter`, e.g:

```kotlin
client.ExceptionFilter = ExceptionFilter { res:HttpURLConnection?, ex ->
}
```

### Request and Response Filters

Each request can be inspected and customized with local and global Request and Response Filters which receive
the `HttpURLConnection` before it's sent and after the response is received. As they're single-method interfaces
Kotlin can implement them with a lambda, e.g. to add a custom HTTP Header to every request:

```kotlin
client.RequestFilter = ConnectionFilter { it.setRequestProperty("X-Api-Version", "2") }
client.ResponseFilter = ConnectionFilter { Log.i(it.getHeaderField("X-Elapsed")) }
```

The static `GlobalRequestFilter` and `GlobalResponseFilter` are applied to all clients and are executed
**after** each client's local filters, i.e. filters are executed in the order:

```
RequestFilter, GlobalRequestFilter, ResponseFilter, GlobalResponseFilter
```

```kotlin
JsonServiceClient.GlobalRequestFilter = ConnectionFilter { }
JsonServiceClient.GlobalResponseFilter = ConnectionFilter { }
```

### Client Configuration

Other behavior that can be configured on the client:

```kotlin
client.setTimeout(60 * 1000)  //Connect + Read timeout in ms
client.setBasePath("api")     //Change the base path APIs are sent to
client.bearerToken = jwt
client.refreshToken = refreshToken
client.setCredentials(userName, password)
client.alwaysSendBasicAuthHeaders = true
```

The `Gson` instance used to serialize and deserialize DTOs can also be customized or replaced entirely, where
`gsonBuilder` returns a `GsonBuilder` pre-configured with the Type Adapters needed to support ServiceStack's
JSON Types (i.e. Dates, `TimeSpan`, `UUID`, `ByteArray` and case-insensitive Enums):

```kotlin
client.gson = client.gsonBuilder
    .setPrettyPrinting()
    .serializeNulls()
    .create()
```

The client's serializer can also be used directly to convert DTOs to and from JSON:

```kotlin
val json = client.toJson(dto)
val dto = client.fromJson(json, Option::class.java) as Option
```

Whilst `apiUrl()` and `createUrl()` can be used to inspect the URL a Request DTO would be sent to:

```kotlin
client.apiUrl(Hello())
//= https://test.servicestack.net/api/Hello

client.createUrl(Hello().apply { name = "World" })
//= https://test.servicestack.net/api/Hello?name=World
```

### Logging

All HTTP JSON Requests and Responses can be logged by enabling debug logging, useful for diagnosing what's
being sent over the wire:

```kotlin
Log.setInstance(LogProvider("ServiceStack", true))
```

Android Apps can use `AndroidLogProvider` to have logging routed to Android's `android.util.Log`:

```kotlin
Log.setInstance(AndroidLogProvider("ServiceStack", true))
```

### Inspect Utils

The `Inspect` utils provide a quick way to visualize the contents of Response DTOs and collections in
human-friendly output whilst developing and debugging:

```kotlin
Inspect.printDump(response)      //Print readable object graph
Inspect.printDumpTable(results)  //Print all fields in a table
Inspect.printDumpTable(results, listOf("name","language","watchers","forks"))
```

Where `printDump()` renders a quote-free object graph:

```
{
  name: jdk,
  language: Java,
  watchers: 19587,
  forks: 5457
}
```

Whilst `printDumpTable()` renders a collection of results in an ASCII table:

```
+-------------------------------------+
| name | language | watchers | forks  |
|-------------------------------------|
| jdk  | Java     |    19587 |   5457 |
| loom | Java     |     1499 |    190 |
| jfx  | Java     |     1096 |    489 |
+-------------------------------------+
```

`Inspect.vars()` can also dump the state of multiple variables to the JSON file in the `INSPECT_VARS`
Environment Variable, used by [gist.cafe](https://gist.cafe) to display variables in its UI:

```kotlin
Inspect.vars(mapOf("results" to results))
```

### More Usage Examples

As Kotlin uses the same Java Client Library, the
[Java Client Test Suite](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/AndroidClient/client/src/test/java/net/servicestack/client)
contains working examples of every feature covered above which are run against the live
[test.servicestack.net](https://test.servicestack.net) and [techstacks.io](https://techstacks.io) Services.

More Kotlin-specific sync and async ServiceClient examples can be found in:

 - [Kotlin ServiceClient Tests](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/legacy/kotlin/src/androidTest/java/test/servicestack/net/kotlin)
 - [TechStacks Kotlin App](https://github.com/ServiceStackApps/TechStacksKotlinApp)

## Kotlin generated DTO Types

Our goal with **Kotlin Add ServiceStack Reference** is to ensure a high-fidelity, idiomatic translation within 
the constraints of Kotlin language and its built-in libraries, where .NET Server DTO's are translated into 
clean, conventional Kotlin classes where .NET built-in Value Types mapped to their equivalent JVM data Type.

To see what this ends up looking up we'll go through some of the 
[Generated Test Services](https://test.servicestack.net/types/kotlin) to see how they're translated in Kotlin.

### .NET Attributes translated into Java Annotations
By inspecting the `HelloAllTypes` Request DTO we can see that C# Metadata Attributes e.g. `[Route("/all-types")]` 
are also translated into the typed Kotlin Annotations defined in the **net.servicestack:client** dependency. 
But as JVM only supports defining a single Annotation of the same type, any subsequent .NET Attributes of 
the same type are emitted in comments.

### Terse, typed API's with IReturn interfaces
Kotlin Request DTO's are also able to take advantage of the `IReturn<TResponse>` interface marker to provide 
its terse, typed generic API but due to JVM's Type erasure the Response Type also needs to be encoded in the 
Request DTO as seen by the `responseType` static companion property:

```kotlin
@Route(Path="/all-types")
open class HelloAllTypes : IReturn<HelloAllTypesResponse>
{
    open var name:String? = null
    open var allTypes:AllTypes? = null
    open var allCollectionTypes:AllCollectionTypes? = null
    companion object { private val responseType = HelloAllTypesResponse::class.java }
    override fun getResponseType(): Any? = HelloAllTypes.responseType
}
```

Classes are generated as `open` so they can be inherited and their properties overridden where needed, e.g. by
generated Request DTOs that inherit AutoQuery's `QueryDb<T>` base types.

### DTO Property Behavior

To comply with Gson JSON Serialization rules, the public DTO properties are emitted in the same JSON naming 
convention as the remote ServiceStack server which for the [test.servicestack.net](https://test.servicestack.net) 
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
    open var id:Int? = null
    open var nullableId:Int? = null
    @SerializedName("byte") open var Byte:Short? = null
    @SerializedName("short") open var Short:Short? = null
    @SerializedName("int") open var Int:Int? = null
    @SerializedName("long") open var Long:Long? = null
    open var uShort:Int? = null
    open var uInt:Long? = null
    open var uLong:BigInteger? = null
    @SerializedName("float") open var Float:Float? = null
    @SerializedName("double") open var Double:Double? = null
    open var decimal:BigDecimal? = null
    open var string:String? = null
    open var dateTime:Date? = null
    open var timeSpan:TimeSpan? = null
    open var dateTimeOffset:Date? = null
    open var guid:UUID? = null
    @SerializedName("char") open var Char:String? = null
    open var nullableDateTime:Date? = null
    open var nullableTimeSpan:TimeSpan? = null
    open var stringList:ArrayList<String> = ArrayList<String>()
    open var stringArray:ArrayList<String>? = null
    open var stringMap:HashMap<String,String> = HashMap<String,String>()
    open var intStringMap:HashMap<Int,String> = HashMap<Int,String>()
    open var subType:SubType? = null
}
```

::: info
Collection properties are only initialized to an empty collection (and generated non-null) when the remote
Server is configured with [InitializeCollections](#initializecollections), otherwise they're generated as
nullable `ArrayList<T>?` properties
:::

The only built-in Value Type that didn't have a suitable built-in Java equivalent was `TimeSpan`. 
In this case it uses our new 
[TimeSpan.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/TimeSpan.java) 
class which implements the same familiar API available in .NET's `TimeSpan`, which is serialized in the same 
XSD Duration format used by .NET:

```kotlin
val duration = TimeSpan().addHours(1).addMinutes(30)
duration.hours          //= 1
duration.toXsdDuration() //= PT1H30M

TimeSpan.fromXsdDuration("P1DT1H1M1.001S")
```

Likewise `Utils` contains the conversions used to marshal the remaining .NET Value Types over the wire, e.g.
.NET's `Guid` uses a different byte ordering to Java's `UUID` which is transparently handled by the client:

```kotlin
val date = Utils.fromDateTime("2015-03-27T03:41:41.987375+00:00")
val jsonDate = Utils.toDateTime(date) //= /Date(1427398901987-0000)/

val uuid = Utils.fromGuidString("4E07D932-8D1A-4CE1-9314-7AC7826E8966")
val guid = Utils.toGuidString(uuid)   //= 4E07D9328D1A4CE193147AC7826E8966

val bytes = Utils.fromByteArray("QUJD") //Base64 -> ByteArray
val base64 = Utils.toByteArray(bytes)
```

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
Date: 2026-08-27 07:01:45
Version: 10.09
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://test.servicestack.net

Package: com.myapp.dtos
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//InitializeCollections: False
//TreatTypesAsStrings: 
//DefaultImports: java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*
*/
```

The same options are also sent when updating an existing reference with `npx get-dtos dtos.kt`.

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

### InitializeCollections
Lets you control whether collection properties are initialized to an empty collection, which also determines
whether they're generated as non-null Kotlin properties:
```
InitializeCollections: True
```
Which changes nullable collection properties from:

```kotlin
open var stringList:ArrayList<String>? = null
```

To non-null properties initialized with an empty collection, avoiding the need for null checks when
populating or reading them:

```kotlin
open var stringList:ArrayList<String> = ArrayList<String>()
```

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
