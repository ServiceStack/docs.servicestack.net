---
title: Java Add ServiceStack Reference
---

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/android-studio-splash.png)

## [ServiceStack IDEA Android Studio Plugin](https://plugins.jetbrains.com/plugin/7749?pr=androidstudio)

Like the existing IDE integrations before it, the ServiceStack IDEA plugin provides Add ServiceStack Reference functionality to [Android Studio - the official Android IDE](https://developer.android.com/sdk/index.html). 

The **ServiceStackIDEA** plugin also includes support for **IntelliJ Maven projects** giving Java devs a productive and familiar development experience whether they're creating Android Apps or pure cross-platform Java clients.

Java Android Example using Android Studio

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="xg677weFef4" style="background-image: url('https://img.youtube.com/vi/xg677weFef4/maxresdefault.jpg')"></lite-youtube>

### Install ServiceStack IDEA from the Plugin repository

The ServiceStack IDEA is now available to install directly from within IntelliJ or Android Studio IDE Plugins Repository, to Install Go to: 

 1. `File -> Settings...` Main Menu Item
 2. Select **Plugins** on left menu then click **Browse repositories...** at bottom
 3. Search for **ServiceStack** and click **Install plugin**
 4. Restart to load the installed ServiceStack IDEA plugin

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/android-plugin-download.gif)

### Download and Install ServiceStack IDEA Manually

The [ServiceStack AndroidStudio Plugin](https://plugins.jetbrains.com/plugin/7749?pr=androidstudio) can also be downloaded directly from the JetBrains plugins website at:

### [ServiceStackIDEA.zip](https://plugins.jetbrains.com/plugin/download?pr=androidstudio&updateId=19465)

After downloading the plugin above, install it in Android Studio by:

1. Click on `File -> Settings` in the Main Menu to open the **Settings Dialog**
2. Select **Plugins** settings screen
3. Click on **Install plugin from disk...** to open the **File Picker Dialog**
4. Browse and select the downloaded **ServiceStackIDEA.zip**
5. Click **OK** then Restart Android Studio

[![](https://github.com/ServiceStack/Assets/raw/34925d1b1b1b1856c451b0373139c939801d96ec/img/servicestackidea/android-plugin-install.gif)](https://plugins.jetbrains.com/plugin/7749?pr=androidstudio)

### [Installing ServiceStackEclipse Plugin on Eclipse](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse)

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/eclipse-header.png)](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse#eclipse-integration-with-servicestack)

See the [ServiceStack Eclipse Home Page](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse) for instructions on installing the **ServiceStackEclipse Plugin** from the Eclipse MarketPlace and how to Add and Update ServiceStack References directly from within the Eclipse IDE.

### Manually adding a dependency in Android Studio

Whilst the ServiceStack IDEA Plugin will automatically add the Gradle reference to your projects **build.gradle**, you can also manually add the reference by adding the **net.servicestack:android** dependency as seen below:

```
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'net.servicestack:android:1.1.0'
}
```

This also lets you to change which ServiceStack Client library version you want to use, the example above uses **1.0.48**.

### Add ServiceStack Reference

If you've previously used [Add ServiceStack Reference](/add-servicestack-reference) in any of the supported IDE's before, you'll be instantly familiar with Add ServiceStack Reference in Android Studio. The only additional field is **Package**, required in order to comply with Java's class definition rules. 

To add a ServiceStack Reference, right-click (or press `Ctrl+Alt+Shift+R`) on the **Package folder** in your Java sources where you want to add the POJO DTO's. This will bring up the **New >** Items Context Menu where you can click on the **ServiceStack Reference...** Menu Item to open the **Add ServiceStack Reference** Dialog: 

![Add ServiceStack Reference Java Context Menu](https://github.com/ServiceStack/Assets/raw/master/img/servicestackidea/android-context-menu.png)

The **Add ServiceStack Reference** Dialog will be partially populated with the selected **Package** with the package where the Dialog was launched from and the **File Name** defaulting to `dto.java` where the Plain Old Java Object (POJO) DTO's will be added to. All that's missing is the url of the remote ServiceStack instance you wish to generate the DTO's for, e.g: `https://techstacks.io`:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/android-dialog.png)

Clicking **OK** will add the `dto.java` file to your project and modifies the current Project's **build.gradle** file dependencies list with the new **net.servicestack:android** dependency containing the Java JSON ServiceClients which is used together with the remote Servers DTO's to enable its typed Web Services API:

![](https://github.com/ServiceStack/Assets/raw/master/img/servicestackidea/android-dialog-example.gif)

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

![](https://github.com/ServiceStack/Assets/raw/master/img/servicestackidea/android-update-example.gif)

### JsonServiceClient API
The goal of Native Types is to provide a productive end-to-end typed API to facilitate  consuming remote services with minimal effort, friction and cognitive overhead. One way we achieve this is by promoting a consistent, forwards and backwards-compatible message-based API that's works conceptually similar on every platform where each language consumes remote services by sending  **Typed DTO's** using a reusable **Generic Service Client** and a consistent client library API.

To maximize knowledge sharing between different platforms, the Java ServiceClient API is modelled after the [.NET Service Clients API](/csharp-client) closely, as allowed within Java's language and idiomatic-style constraints. 

Thanks to C#/.NET being heavily inspired by Java, the resulting Java `JsonServiceClient` ends up bearing a close resemblance with .NET's Service Clients. The primary differences being due to language limitations like Java's generic type erasure and lack of language features like property initializers making Java slightly more verbose to work with, however as **Add ServiceStack Reference** is able to take advantage of code-gen we're able to mitigate most of these limitations to retain a familiar developer UX.

The [ServiceClient.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/ServiceClient.java) interface provides a good overview on the API available on the concrete [JsonServiceClient](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/JsonServiceClient.java) class:

```java
public interface ServiceClient {
    boolean getAlwaysSendBasicAuthHeaders();
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
}
```

The primary concession is due to Java's generic type erasure which forces the addition overloads that include a `Class` parameter for specifying the response type to deserialize into as well as a `Type` parameter overload which does the same for generic types. These overloads aren't required for API's that accept a Request DTO annotated with `IReturn<T>` interface marker as we're able to encode the Response Type in code-generated Request DTO classes.

### JsonServiceClient Usage

To get started you'll just need an instance of `JsonServiceClient` initialized with the **BaseUrl** of the remote ServiceStack instance you want to access, e.g:

```java
JsonServiceClient client = new JsonServiceClient("https://techstacks.io");
```

::: info
The JsonServiceClient is made available after the `net.servicestack:android` package is automatically added to your **build.gradle** when adding a ServiceStack reference.
:::

Typical usage of the Service Client is the same in .NET where you just need to send a populated Request DTO and the Service Client will return a populated Response DTO, e.g:

```java
AppOverviewResponse r = client.get(new AppOverview());

ArrayList<Option> allTiers = r.getAllTiers();
ArrayList<TechnologyInfo> topTech = r.getTopTechnologies();
```

As Java doesn't have type inference you'll need to specify the Type when declaring a variable. Whilst the public instance fields of the Request and Response DTO's are accessible directly, the convention in Java is to use the **property getters and setters** that are automatically generated for each DTO property as seen above.

### Custom Example Usage

We'll now go through some of the other API's to give you a flavour of what's available. When preferred you can also consume Services using a custom route by supplying a string containing the route and/or Query String. As no type info is available you'll need to specify the Response DTO class to deserialize the response into, e.g:

```java
OverviewResponse response = client.get("/overview", OverviewResponse.class);
```

The path can either be a relative or absolute url in which case the **BaseUrl** is ignored and the full absolute url is used instead, e.g:

```java
OverviewResponse response = client.get("https://techstacks.io/overview", OverviewResponse.class);
```

When initializing the Request DTO you can take advantage of the generated setters which by default return `this` allowing them to be created and chained in a single expression, e.g:

```java
GetTechnology request = new GetTechnology()
	.setSlug("servicestack");

GetTechnologyResponse response = client.get(request);
```

### AutoQuery Example Usage

You can also send requests composed of both a Typed DTO and untyped String Dictionary by providing a Java Map of additional args. This is typically used when querying [implicit conventions in AutoQuery services](/autoquery#implicit-conventions), e.g:

```java
QueryResponse<Technology> response = client.get(new FindTechnologies(),
	Utils.createMap("DescriptionContains","framework"));
```

The `Utils.createMap()` API is included in the [Utils.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/Utils.java) static class which contains a number of helpers to simplify common usage patterns and reduce the amount of boiler plate required for common tasks, e.g they can also simplify reading raw bytes or raw String from a HTTP Response. Here's how you can download an image bytes using a custom `JsonServiceClient` HTTP Request and load it into an Android Image `Bitmap`:

```java
HttpURLConnection httpRes = client.get("https://servicestack.net/img/logo.png");
byte[] imgBytes = Utils.readBytesToEnd(httpRes);
Bitmap img = BitmapFactory.decodeByteArray(imgBytes, 0, imgBytes.length);
```


### Integrated Basic Auth

HTTP Basic Auth is supported in `JsonServiceClient` following the implementation in .NET Service Client
where you can specify the users credentials and whether you always want to send Basic Auth with each request by:

```java
client.setCredentials(userName, password);
client.setAlwaysSendBasicAuthHeaders(true);

TestAuthResponse response = client.get(new TestAuth());
```

It also supports processing challenged 401 Auth HTTP responses where it will transparently replay the failed 
request with the Basic Auth Headers:

```java
client.setCredentials(userName, password);

TestAuthResponse response = client.get(new TestAuth());
```

Although this has the additional latency of waiting for a failed 401 response before sending an authenticated request.

### Cookies-enabled Service Client

The `JsonServiceClient` initializes a `CookieManager` in its constructor to enable any Cookies received to
be added on subsequent requests to allow you to make authenticated requests after authenticating, e.g:

```java
AuthenticateResponse authResponse = client.post(new Authenticate()
    .setProvider("credentials")
    .setUserName(userName)
    .setPassword(password));

TestAuthResponse response = client.get(new TestAuth());
``` 

### AndroidServiceClient
Unlike .NET, Java doesn't have an established Async story or any language support that simplifies execution and composition of Async tasks, as a result the Async story on Android is fairly fragmented with multiple options built-in for executing non-blocking tasks on different threads including:

 - Thread
 - Executor
 - HandlerThread
 - AsyncTask
 - Service
 - IntentService
 - AsyncQueryHandler
 - Loader

JayWay's Oredev presentation on [Efficient Android Threading](http://www.slideshare.net/andersgoransson/efficient-android-threading) provides a good overview of the different threading strategies above with their use-cases, features and pitfalls. Unfortunately none of the above options enable a Promise/Future-like API which would've been ideal in maintaining a consistent Task-based Async API across all ServiceStack Clients. Of all the above options the new Android [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) ended up the most suitable option, requiring the least effort for the typical Service Client use-case of executing non-blocking WebService Requests and having their results called back on the Main UI thread.

### AsyncResult
To enable an even simpler Async API decoupled from Android, we've introduced a higher-level [AsyncResult](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/AsyncResult.java) class which allows capturing of Async callbacks using an idiomatic anonymous Java class. `AsyncResult` is modelled after [jQuery.ajax](http://api.jquery.com/jquery.ajax/) and allows specifying **success()**, **error()** and **complete()** callbacks as needed.

### AsyncServiceClient API

Using AsyncResult lets us define a pure Java [AsyncServiceClient](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/AsyncServiceClient.java) interface that's decoupled from any specific threading implementation, i.e:

```java
public interface AsyncServiceClient {
    public <T> void getAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    public <T> void getAsync(IReturn<T> request, final Map<String, String> queryParams, final AsyncResult<T> asyncResult);
    public <T> void getAsync(String path, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void getAsync(String path, final Type responseType, final AsyncResult<T> asyncResult);
    public void getAsync(String path, final AsyncResult<byte[]> asyncResult);

    public <T> void postAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    public <T> void postAsync(String path, final Object request, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void postAsync(String path, final Object request, final Type responseType, final AsyncResult<T> asyncResult);
    public <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void postAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncResult<T> asyncResult);
    public void postAsync(String path, final byte[] requestBody, final String contentType, final AsyncResult<byte[]> asyncResult);

    public <T> void putAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    public <T> void putAsync(String path, final Object request, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void putAsync(String path, final Object request, final Type responseType, final AsyncResult<T> asyncResult);
    public <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void putAsync(String path, final byte[] requestBody, final String contentType, final Type responseType, final AsyncResult<T> asyncResult);
    public void putAsync(String path, final byte[] requestBody, final String contentType, final AsyncResult<byte[]> asyncResult);

    public <T> void deleteAsync(IReturn<T> request, final AsyncResult<T> asyncResult);
    public <T> void deleteAsync(IReturn<T> request, final Map<String, String> queryParams, final AsyncResult<T> asyncResult);
    public <T> void deleteAsync(String path, final Class responseType, final AsyncResult<T> asyncResult);
    public <T> void deleteAsync(String path, final Type responseType, final AsyncResult<T> asyncResult);
    public void deleteAsync(String path, final AsyncResult<byte[]> asyncResult);
}
```

The `AsyncServiceClient` interface is implemented by the `AndroidServiceClient` concrete class which behind-the-scenes uses an Android [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) to implement its Async API's. 

Whilst the `AndroidServiceClient` is contained in the **net.servicestack:android** dependency and only works in Android, the `JsonServiceClient` instead is contained in a seperate pure Java **net.servicestack:client** dependency which can be used independently to provide a typed Java API for consuming ServiceStack Services from any Java application.

### Async API Usage
To make use of Async API's in an Android App (which you'll want to do to keep web service requests off the Main UI thread), you'll instead need to use an instance of `AndroidServiceClient` which as it inherits `JsonServiceClient` can be used to perform both Sync and Async requests:

```java
AndroidServiceClient client = new AndroidServiceClient("https://techstacks.io");
```

Like other Service Clients, there's an equivalent Async API matching their Sync counterparts which differs by ending with an **Async** suffix which instead of returning a typed response, fires a **success(TResponse)** or **error(Exception)** callback with the typed response, e.g: 

```java
client.getAsync(new AppOverview(), new AsyncResult<AppOverviewResponse>(){
    @Override
    public void success(AppOverviewResponse r) {
        ArrayList<Option> allTiers = r.getAllTiers();
        ArrayList<TechnologyInfo> topTech = r.getTopTechnologies();
    }
});
```

Which just like the `JsonServiceClient` examples above also provide a number of flexible options to execute Custom Async Web Service Requests, e.g: 

```java
client.getAsync("/overview", OverviewResponse.class, new AsyncResult<OverviewResponse>(){
    @Override
    public void success(OverviewResponse response) {
    }
});
```

Example calling a Web Service with an absolute url:

```java
client.getAsync("https://techstacks.io/overview", OverviewResponse.class, new AsyncResult<OverviewResponse>() {
    @Override
    public void success(OverviewResponse response) {
    }
});
```

#### Async AutoQuery Example
Example calling an untyped AutoQuery Service with additional Dictionary String arguments:

```java
client.getAsync(request, Utils.createMap("DescriptionContains", "framework"),
    new AsyncResult<QueryResponse<Technology>>() {
        @Override
        public void success(QueryResponse<Technology> response) {
        }
    });
```

#### Download Raw Image Async Example
Example downloading raw Image bytes and loading it into an Android Image `Bitmap`:

```java
client.getAsync("https://servicestack.net/img/logo.png", new AsyncResult<byte[]>() {
    @Override
    public void success(byte[] imgBytes) {
        Bitmap img = BitmapFactory.decodeByteArray(imgBytes, 0, imgBytes.length);
    }
});
```

#### Send Raw String or byte[] Requests

You can easily get the raw string Response from Request DTO's that return are annotated with `IReturn<string>`, e.g:
 
```java
public static class HelloString implements IReturn<String> { ... }

String response = client.get(new HelloString().setName("World"));
```

You can also specify that you want the raw UTF-8 `byte[]` or `String` response instead of a the deserialized Response DTO by specifying
the Response class you want returned, e.g:

```java
byte[] response = client.get("/hello?Name=World", byte[].class);
```

#### Java HTTP Marker Interfaces

Like the .NET and Swift Service Clients, the HTTP Interface markers are also annotated on Java DTO's and let you use the same
`send` API to send Requests via different HTTP Verbs, e.g:  

```java
public static class HelloByGet implements IReturn<HelloResponse>, IGet { ... }
public static class HelloByPut implements IReturn<HelloResponse>, IPut { ... }

HelloResponse response = client.send(new HelloByGet().setName("World")); //GET

client.sendAsync(new HelloByPut().setName("World"),                         //PUT
    new AsyncResult<HelloResponse>() {
        @Override
        public void success(HelloResponse response) { }
    });
```

#### IReturnVoid Support

New Sync/Async overloads have been added for `IReturnVoid` Request DTO's:

```java
client.delete(new DeleteCustomer().setId(1));
```


### Typed Error Handling
Thanks to Java also using typed Exceptions for error control flow, error handling in Java will be instantly familiar to C# devs which also throws a typed `WebServiceException` containing the remote servers structured error data:

```java
ThrowType request = new ThrowType()
    .setType("NotFound")
    .setMessage("not here");

try {
	ThrowTypeResponse response = testClient.post(request);
}
catch (WebServiceException webEx) {
    ResponseStatus status = webEx.getResponseStatus();
	status.getMessage();    //= not here
    status.getStackTrace(); //= (Server StackTrace)
}
```

Likewise structured Validation Field Errors are also accessible from the familiar `ResponseStatus` DTO, e.g:

```java
ThrowValidation request = new ThrowValidation()
    .setEmail("invalidemail");

try {
    client.post(request);
} catch (WebServiceException webEx){
    ResponseStatus status = webEx.getResponseStatus();

    ResponseError firstError = status.getErrors().get(0);
    firstError.getErrorCode(); //= InclusiveBetween
    firstError.getMessage();   //= 'Age' must be between 1 and 120. You entered 0.
    firstError.getFieldName(); //= Age
}
```

#### Async Error Handling
Async Error handling differs where in order to access the `WebServiceException` you'll need to implement the **error(Exception)** callback, e.g:

```java
client.postAsync(request, new AsyncResult<ThrowTypeResponse>() {
    @Override
    public void error(Exception ex) {
        WebServiceException webEx = (WebServiceException)ex;
        
        ResponseStatus status = webEx.getResponseStatus();
        status.getMessage();    //= not here
        status.getStackTrace(); //= (Server StackTrace)
    }
});
```

Async Validation Errors are also handled in the same way: 

```java
client.postAsync(request, new AsyncResult<ThrowValidationResponse>() {
    @Override
    public void error(Exception ex) {
        WebServiceException webEx = (WebServiceException)ex;
        ResponseStatus status = webEx.getResponseStatus();

        ResponseError firstError = status.getErrors().get(0);
        firstError.getErrorCode(); //= InclusiveBetween
        firstError.getMessage();   //= 'Age' must be between 1 and 120. You entered 0.
        firstError.getFieldName(); //= Age
    }
}
```

### JsonServiceClient Error Handlers
To make it easier to generically handle Web Service Exceptions, the Java Service Clients also support static Global Exception handlers by assigning `AndroidServiceClient.GlobalExceptionFilter`, e.g:

```java
AndroidServiceClient.GlobalExceptionFilter = new ExceptionFilter() {
    @Override
    public void exec(HttpURLConnection res, Exception ex) {
    	//...
    }
};
```

As well as local Exception Filters by specifying a handler for `client.ExceptionFilter`, e.g:

```java
client.ExceptionFilter = new ExceptionFilter() {
    @Override
    public void exec(HttpURLConnection res, Exception ex) {
    	//...
    }
};
```

## Java generated DTO Types

Our goal with **Java Add ServiceStack Reference** is to ensure a high-fidelity, idiomatic translation within the constraints of Java language and its built-in libraries, where .NET Server DTO's are translated into clean, conventional Java POJO's where .NET built-in Value Types mapped to their equivalent Java data Type.

To see what this ends up looking up we'll go through some of the [Generated Test Services](https://test.servicestack.net/types/java) to see how they're translated in Java.

### .NET Attributes translated into Java Annotations
By inspecting the `HelloAllTypes` Request DTO we can see that C# Metadata Attributes e.g. `[Route("/all-types")]` are also translated into the typed Java Annotations defined in the **net.servicestack:client** dependency. But as Java only supports defining a single Annotation of the same type, any subsequent .NET Attributes of the same type are emitted in comments.

### Terse, typed API's with IReturn interfaces
Java Request DTO's are also able to take advantage of the `IReturn<TResponse>` interface marker to provide its terse, typed generic API but due to Java's Type erasure the Response Type also needs to be encoded in the Request DTO as seen by the `responseType` field and `getResponseType()` getter:

```java
@Route("/all-types")
public static class HelloAllTypes implements IReturn<HelloAllTypesResponse>
{
    public String name = null;
    public AllTypes allTypes = null;
    
    public String getName() { return name; }
    public HelloAllTypes setName(String value) { this.name = value; return this; }
    public AllTypes getAllTypes() { return allTypes; }
    public HelloAllTypes setAllTypes(AllTypes value) { this.allTypes = value; return this; }

    private static Object responseType = HelloAllTypesResponse.class;
    public Object getResponseType() { return responseType; }
}
```

### Getters and Setters generated for each property
Another noticeable feature is the Java getters and setters property convention are generated for each public field with setters returning itself allowing for multiple setters to be chained within a single expression. 

To comply with Gson JSON Serialization rules, the public DTO fields are emitted in the same JSON naming convention as the remote ServiceStack server which for the [test.servicestack.net](https://test.servicestack.net) Web Services, follows its **camelCase** naming convention that is configured in its AppHost with: 
```csharp
JsConfig.Init(new Config { TextCase = TextCase.CamelCase });
```

Whilst the public fields match the remote server JSON naming convention, the getters and setters are always emitted in Java's **camelCase** convention to maintain a consistent API irrespective of the remote server configuration. To minimize API breakage they should be the preferred method to access DTO fields.

### Java Type Conversions
By inspecting the `AllTypes` DTO fields we can see what Java Type each built-in .NET Type gets translated into. In each case it selects the most suitable concrete Java datatype available, inc. generic collections. We also see only reference types are used (i.e. instead of their primitive types equivalents) since DTO properties are optional and need to be nullable. 

```java
public static class AllTypes
{
    public Integer id = null;
    public Integer nullableId = null;
    @SerializedName("byte") public Short Byte = null;
    @SerializedName("short") public Short Short = null;
    @SerializedName("int") public Integer Int = null;
    @SerializedName("long") public Long Long = null;
    public Integer uShort = null;
    public Long uInt = null;
    public BigInteger uLong = null;
    @SerializedName("float") public Float Float = null;
    @SerializedName("double") public Double Double = null;
    public BigDecimal decimal = null;
    public String string = null;
    public Date dateTime = null;
    public TimeSpan timeSpan = null;
    public Date dateTimeOffset = null;
    public UUID guid = null;
    @SerializedName("char") public String Char = null;
    public Date nullableDateTime = null;
    public TimeSpan nullableTimeSpan = null;
    public ArrayList<String> stringList = null;
    public ArrayList<String> stringArray = null;
    public HashMap<String,String> stringMap = null;
    public HashMap<Integer,String> intStringMap = null;
    public SubType subType = null;
    ...
}
```

The only built-in Value Type that didn't have a suitable built-in Java equivalent was `TimeSpan`. In this case it uses our new [TimeSpan.java](https://github.com/ServiceStack/ServiceStack.Java/blob/master/src/AndroidClient/client/src/main/java/net/servicestack/client/TimeSpan.java) class which implements the same familiar API available in .NET's `TimeSpan`. 

Something else you'll notice is that some fields are annotated with the `@SerializedName()` Gson annotation. This is automatically added for Java keywords - required since Java doesn't provide anyway to escape keyword identifiers. The first time a Gson annotation is referenced it also automatically includes the required Gson namespace imports. If needed, this can also be explicitly added by with:

```java
JavaGenerator.AddGsonImport = true;
```

### Java Enums
.NET enums are also translated into typed Java enums where basic enums end up as a straightforward translation, e.g:

```java
public static enum BasicEnum
{
    Foo,
    Bar,
    Baz;
}
```

Whilst as Java doesn't support integer Enum flags directly the resulting translation ends up being a bit more convoluted:

```java
@Flags()
public static enum EnumFlags
{
    @SerializedName("1") Value1(1),
    @SerializedName("2") Value2(2),
    @SerializedName("4") Value3(4);

    private final int value;
    EnumFlags(final int intValue) { value = intValue; }
    public int getValue() { return value; }
}
```

### [Java Functional Utils](https://github.com/mythz/java-linq-examples)

The Core Java Functional Utils required to run 
[C#'s 101 LINQ Samples in Java](https://github.com/mythz/java-linq-examples) 
are included in the **net.servicestack:client** Java package which as its compatible with Java 1.7, 
also runs on Android:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/java/linq-examples-screenshot.png)](https://github.com/mythz/java-linq-examples)

Whilst noticeably more verbose than most languages, it enables a functional style of programming that provides
an alternative to imperative programming with mutating collections and eases porting efforts of functional code 
which can be mapped to its equivalent core functional method.

## Java Configuration
The header comments in the generated DTO's allows for further customization of how the DTO's are generated which can then be updated with any custom Options provided using the **Update ServiceStack Reference** Menu Item in Android Studio. Options that are preceded by a single line Java comment `//` are defaults from the server which can be overridden.

To override a value, remove the `//` and specify the value to the right of the `:`. Any value uncommented will be sent to the server to override any server defaults.

```java
/* Options:
Date: 2015-04-10 12:41:14
Version: 1
BaseUrl: https://techstacks.io

Package: net.servicestack.techstacks
//GlobalNamespace: dto
//AddPropertyAccessors: True
//SettersReturnThis: True
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: java.math.*,java.util.*,net.servicestack.client.*,com.google.gson.annotations.*
*/
```
We'll go through and cover each of the above options to see how they affect the generated DTO's:

### Package
Specify the package name that the generated DTO's are in:
```
Package: net.servicestack.techstacks
```
Will generate the package name for the generated DTO's as:

```java
package net.servicestack.techstacks;
```

### GlobalNamespace
Change the name of the top-level Java class container that all static POJO classes are generated in, e.g changing the `GlobalNamespace` to:
```
GlobalNamespace: techstacksdto
```
Will change the name of the top-level class to `techstacksdto`, e.g:

```java
public class techstacksdto
{
    ...
}
```
Where all static DTO classes can be imported using the wildcard import below:

```java
import net.servicestack.techstacksdto.*;
```

### AddPropertyAccessors
By default **getters** and **setters** are generated for each DTO property, you can prevent this default with:
```
AddPropertyAccessors: false
```
Which will no longer generate any property accessors, leaving just public fields, e.g:

```java
public static class AppOverviewResponse
{
    public Date Created = null;
    public ArrayList<Option> AllTiers = null;
    public ArrayList<TechnologyInfo> TopTechnologies = null;
    public ResponseStatus ResponseStatus = null;
}
```

### SettersReturnThis
To allow for chaining DTO field **setters** returns itself by default, this can be changed to return `void` with:
```
SettersReturnThis: false
```
Which will change the return type of each setter to `void`:

```java
public static class GetTechnology implements IReturn<GetTechnologyResponse>
{
    public String Slug = null;
    
    public String getSlug() { return Slug; }
    public void setSlug(String value) { this.Slug = value; }
}
```

### AddServiceStackTypes
Lets you exclude built-in ServiceStack Types and DTO's from being generated with:
```
AddServiceStackTypes: false
```
This will prevent Request DTO's for built-in ServiceStack Services like `Authenticate` from being emitted.

### AddImplicitVersion
Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client:
```
AddImplicitVersion: 1
```
Which will embed the specified Version number in each Request DTO, e.g:

```java
public static class GetTechnology implements IReturn<GetTechnologyResponse>
{
    public Integer Version = 1;
    public Integer getVersion() { return Version; }
    public GetTechnology setVersion(Integer value) { this.Version = value; return this; }
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

```java
public class dto
{
    public static class GetTechnologyResponse { ... }
    public static class GetTechnology implements IReturn<GetTechnologyResponse> { ... }
}
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
java.math.*,java.util.*,net.servicestack.client.*,com.acme.custom.*
```
Will override the default imports with the ones specified, i.e: 

```java
import java.math.*;
import java.util.*;
import net.servicestack.client.*;
import com.acme.custom.*;
```

By default the generated DTO's do not require any Google's Gson-specific serialization hints, but when they're needed e.g. if your DTO's use Java keywords or are attributed with `[DataMember(Name=...)]` the required Gson imports are automatically added which can also be added explicitly with:

```csharp
JavaGenerator.AddGsonImport = true;
```

Which will add the following Gson imports:

```java
import com.google.gson.annotations.*;
import com.google.gson.reflect.*;
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

## Example [TechStacks Android App](https://github.com/ServiceStackApps/TechStacksAndroidApp)
To demonstrate Java Native Types in action we've ported the Swift [TechStacks iOS App](https://github.com/ServiceStackApps/TechStacksApp) to a native Java Android App to showcase the responsiveness and easy-of-use of leveraging Java Add ServiceStack Reference in Android Projects. 

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/techstacks-android-app.jpg)](https://github.com/ServiceStackApps/TechStacksAndroidApp)

Checkout the [TechStacks Android App](https://github.com/ServiceStackApps/TechStacksAndroidApp) repository for a nice overview of how it leverages Java Native Types, Functional Java Utils and iOS-inspired Data Binding to easily develop services-heavy Mobile Apps.
