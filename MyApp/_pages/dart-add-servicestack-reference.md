---
slug: dart-add-servicestack-reference
title: Dart Add ServiceStack Reference
---

![Dart Banner](/img/pages/dart/dart.png)

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types from a simple [@servicestack/cli command-line utility](https://github.com/ServiceStack/servicestack-cli#servicestackcli) - providing a simple way to give clients typed access to your ServiceStack Services.

## Dart Android Example using Android Studio

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="ocH5L-CikQ0" style="background-image: url('https://img.youtube.com/vi/ocH5L-CikQ0/maxresdefault.jpg')"></lite-youtube>
<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="EwOwbZ9mUZk" style="background-image: url('https://img.youtube.com/vi/EwOwbZ9mUZk/maxresdefault.jpg')"></lite-youtube>

### Dart ServiceStack Reference

Dart ServiceStack Reference supports **all Dart 2.0 platforms**, including Flutter and AngularDart or Dart Web Apps - in the same optimal development workflow pioneered in [Add ServiceStack Reference](/add-servicestack-reference) where it doesn't requiring any additional tooling, transformers or build steps. 

Due to the lack of reflection and Mirror support, consuming JSON APIs can be quite [cumbersome in Flutter](https://flutter.io/cookbook/networking/fetch-data/). But we've been able to achieve the same productive development experience available in [all supported languages](/add-servicestack-reference) where you can use the generated Dart DTOs from any remote v5.1+ ServiceStack endpoint with ServiceStack's Smart generic
[JsonServiceClient](https://pub.dartlang.org/documentation/servicestack/0.0.7/client/JsonServiceClient-class.html) available in the [servicestack Dart package](https://pub.dartlang.org/packages/servicestack#-installing-tab-), to enable an end-to-end Typed API for calling Services by [sending and receiving native DTOs](/architecture-overview#client-architecture).

### Install

You can use the same [x dotnet tool](/dotnet-tool) simple command-line utility to easily Add and Update ServiceStack References for all supported languages:

Install [.NET SDK](https://dotnet.microsoft.com/download) then install the `x` dotnet tool:

:::sh
dotnet tool install --global x
:::

::include npx-get-dtos.md::

### Example Usage

You can then execute `x dart` with the URL of the remote ServiceStack Instance you want to generated DTOs for, e.g:

:::sh
`x dart https://techstacks.io`
:::

This will generate Dart DTOs for the [entire TechStacks API](https://techstacks.io/metadata):

```
Saved to: dtos.dart
```

::: info
If no name is specified in the 2nd argument, it uses `dtos` if it doesn't exist, otherwise falls back to infer it from the URL
:::

To make API calls we need to use the `JsonServiceClient`, installed by adding the [servicestack](https://pub.dartlang.org/packages/servicestack#-installing-tab-) package to our Dart projects `pubspec.yaml`:

```yaml
dependencies:
  servicestack: ^2.0.1
```

Saving `pubspec.yaml` in VS Code with the [Dart Code Extension](https://dartcode.org) automatically calls `pub get` or `flutter packages get` (in Flutter projects) to add any new dependencies to your project.

We now have everything we need to be able to make typed API requests to any of [TechStacks APIs](https://techstacks.io/metadata) with a shared `JsonServiceClient` instance populated with the base URL of the remote endpoint, e.g:

```dart
import 'package:servicestack/client.dart';

import 'dtos.dart';

var client = JsonServiceClient("https://techstacks.io");

main() async {
  var response = await client.get(GetTechnology(slug: "flutter"));
  print("${response.technology.name}: ${response.technology.vendorUrl}");
}
```

Like C#, Dart has Generics and Type Inference so the `response` returned is the typed `HelloResponse` DTO giving us rich intelli-sense and compiler type safety. 

### Platform neutral usage

Both **dart:io** `JsonServiceClient` and **dart:html** `JsonWebClient` implement the same shared `IServiceClient` interface which support a platform-neutral source-compatible API using the
`ClientFactory` APIs, e.g: 

```dart
import 'package:servicestack/web_client.dart' if (dart.library.io) 'package:servicestack/client.dart';

main() async {
  var client = ClientFactory.create('https://techstacks.io');
  var response = await client.get(GetTechnology(slug: "flutter"));
  print("${response.technology.name}: ${response.technology.vendorUrl}");
}
```

For advanced configuration you can use the `createWith(ClientOptions)` API, e.g you can use `dev.servicestack.com` which resolves to `10.0.2.2` 
which in Android you can use to access `127.0.0.1` of the host OS allowing you to access your local development server.

In this example we'll create either a typed Service Client to our local development server in **Debug** during development (ignoring its self-signed certificate)
and our production server in **Release** mode: 

```dart
import 'package:servicestack/web_client.dart' if (dart.library.io) 'package:servicestack/client.dart';
import 'package:flutter/foundation.dart';

main() async {
  var client = kDebugMode
    ? ClientFactory.createWith(ClientOptions(baseUrl:'https://dev.servicestack.com:5001', ignoreCert:true))
    : ClientFactory.create('https://techstacks.io');
}
```

::: info Tip
If you add a `127.0.0.1 dev.servicestack.com` mapping in your OS's `hosts` file you'll also be able to use `dev.servicestack.com` to access your local dev server in your Host OS
:::

### Shared Initialization Configuration

For more advanced configuration you can use the `ClientConfig.initClient` client factory filter to customize all service client instances 
as done in this example to configure all client instances with any previously saved JWT Bearer & Refresh Tokens to enable authenticated access:

```dart
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:servicestack/web_client.dart' if (dart.library.io) 'package:servicestack/client.dart';

SharedPreferences prefs;
IServiceClient client;
AuthenticateResponse auth;

Future<void> main() async {
  runApp(MyApp());

  ClientConfig.initClient = (client) {
    if (auth != null) {
      client.bearerToken = auth.bearerToken;
      client.refreshToken = auth.refreshToken;
    }
  };

  prefs = await SharedPreferences.getInstance();

  var json = prefs.getString('auth');
  auth = json != null
      ? AuthenticateResponse.fromJson(jsonDecode(json))
      : null;

  client = ClientFactory.createWith(ClientOptions(
      baseUrl:'https://dev.servicestack.com:5001', ignoreCert:kDebugMode));
}
```

#### AngularDart and Dart Web Usage

For AngularDart or Dart Web Apps import `web_client.dart` and use the `JsonWebClient`:

```dart
import 'package:servicestack/web_client.dart';

import 'dtos.dart';              // Add ServiceStack Reference DTOs

//...
var client = JsonWebClient("https://techstacks.io");
var response = await client.get(GetTechnology(slug: "flutter"));
```

See the [HelloAngularDart](https://github.com/ServiceStackApps/HelloAngularDart) project for a working example.

#### Platform agnostic Usage

For creating libraries that can be consumed in any Dart platform reference `servicestack.dart` and use the `IServiceClient` interface which
is implemented by both `JsonServiceClient` and `JsonWebClient`:

```dart
import 'package:servicestack/servicestack.dart';

import 'dtos.dart';              // Add ServiceStack Reference DTOs

//...
fetchTechnologies(IServiceClient client) async {
    var response = await client.get(GetTechnology(slug: "flutter"));
}
```

### Rich Generated Models

Thanks to the direct C# to Dart model code generation we're able to create the ideal idiomatic message-based APIs utilizing rich typed models with broad support for many of the C#/.NET features used when defining DTOs inc. Generics, Inheritance, multiple Interfaces, Enums (inc. int and Flag Enums), Tuples, metadata Attributes emitted in comments (emitting additional documentation in the generated models) whilst also taking care of mapping built-in C# Types like `DateTime`, `TimeSpan`, `byte[]` and `Stream` into their equivalent native Dart [DateTime](https://api.dartlang.org/stable/1.24.3/dart-core/DateTime-class.html), [Duration](https://api.dartlang.org/stable/1.24.3/dart-core/Duration-class.html) and [Uint8List](https://api.dartlang.org/stable/1.24.3/dart-typed_data/Uint8List-class.html) types, C# generic collections are also converted into their equivalent Dart generic collection Type.


#### JsonCodec compatible

The generated DTOs follow Dart's [JsonCodec](https://api.dartlang.org/stable/1.24.3/dart-convert/JsonCodec-class.html) pattern allowing them to be individually serializable with Dart's universal JSON encode/decode APIs, e.g:

```dart
//Serialization
var dto = MyDto(name:"foo");
String jsonString = json.encode(dto);

//Deserialization
Map<String,dynamic> jsonObj = json.decode(jsonString);
var fromJson = MyDto.fromJson(jsonObj);
```

#### Default Constructor

All DTOs also include a default constructor containing all properties as optional arguments providing a wrist-friendly syntax for creating and populating DTOs in a single constructor expression, e.g:

```dart
var request = MyDto(name:"foo");
```

Only the properties of each DTO are included in its default constructor so you'll need to use property accessors to initialize any fields in base classes, but thanks to Dart's support for method cascades you can still populate an entire DTO with a single expression, e.g:

```dart
var request = FindTechnologies(name:"Flutter")
    ..fields = "id,slug,vendorName,productUrl"
    ..orderBy = "created,-viewCount"
    ..take = 1;
```

#### IConvertible

All DTOs implement the `IConvertible` interface below where each instance can be converted to and from a Map of values, giving each model dynamism that's otherwise not possible in Flutter:

```csharp
abstract class IConvertible
{
    TypeContext context;
    fromMap(Map<String, dynamic> map);
    Map<String, dynamic> toJson();
}
```

The conversion logic that handles the behind-the-scenes conversion into and out of Dart Types is maintained in the extensible [JsonConverters](https://pub.dartlang.org/documentation/servicestack/0.0.7/client/JsonConverters/Converters.html) class which lets you replace built-in converters with your own implementation or register new Converters when you want to take over handling of specific types.

### JsonServiceClient

The `JsonServiceClient` is a smart full-featured Service Client implementation with a number of high-level features that make consuming ServiceStack APIs a seamless experience, with built-in support for:

 - HTTP Basic Auth (inc. [API Key support](/auth/api-key-authprovider))
 - [Cookies, Sessions and Credential Auth](/auth/sessions)
 - [JWT, including using RefreshTokens to auto-fetch new JWT Bearer Tokens](/auth/jwt-authprovider)
 - [Structured Error Handling](/error-handling)
 - [Auto Batched Requests](/auto-batched-requests)
 - Global and per-instance Request, Response and Exception Filters
 - `onAuthenticationRequired` hook to handle re-authentication and transparent replay of failed 401 requests

Behind the scenes `JsonServiceClient` leverages the optimal [`HttpClient` in dart:io](https://docs.flutter.io/flutter/dart-io/HttpClient-class.html) to perform HTTP Requests in Flutter and Dart VM Apps.

### JsonWebClient

The `JsonWebClient` performs HTTP Requests using [dart:html BrowserClient](https://webdev.dartlang.org/angular/guide/server-communication) to use the browsers built-in `XMLHttpRequest` object. Despite their implementation differences `JsonWebClient` also supports the same feature-set as the Dart VM's `JsonServiceClient` above. 

AngularDart or Dart Web Apps can use `JsonWebClient` by importing `web_client.dart`, e.g: 

```dart
import 'package:servicestack/web_client.dart';

var client = JsonWebClient("https://techstacks.io");
```

### IServiceClient API

Both JSON Service Client variants implement the same flexible `IServiceClient` API below, use the same DTOs and implementation and throws the same structured `WebServiceException` which results in Typed API Requests being source-compatible between Dart Web Apps, Dart VM Server and AOT compiled Flutter Web Apps:

```csharp
abstract class IServiceClient {
  String? baseUrl;
  String? replyBaseUrl;
  String? oneWayBaseUrl;

  String? bearerToken;
  String? refreshToken;
  String? userName;
  String? password;

  AsyncCallbackFunction? onAuthenticationRequired;
  String? getTokenCookie();
  String? getRefreshTokenCookie();

  void clearCookies();

  Future<ApiResult<T>> api<T>(IReturn<T> request, {Map<String, dynamic>? args, String? method});

  Future<ApiResult<EmptyResponse>> apiVoid(IReturnVoid request, {Map<String, dynamic>? args, String? method});

  Future<T> get<T>(IReturn<T> request, {Map<String, dynamic>? args});

  Future<Map<String, dynamic>> getUrl(String path, {Map<String, dynamic>? args});

  Future<T> getAs<T>(String path, {Map<String, dynamic>? args, T? responseAs});

  Future<T> post<T>(IReturn<T> request, {dynamic body, Map<String, dynamic>? args});

  Future<Map<String, dynamic>> postToUrl(String path, dynamic body, {Map<String, dynamic>? args});

  Future<T> postAs<T>(String path, dynamic body, {Map<String, dynamic>? args, T? responseAs});

  Future<T> delete<T>(IReturn<T> request, {Map<String, dynamic>? args});

  Future<Map<String, dynamic>> deleteUrl(String path, {Map<String, dynamic>? args});

  Future<T> deleteAs<T>(String path, {Map<String, dynamic>? args, T? responseAs});

  Future<T> put<T>(IReturn<T> request, {dynamic body, Map<String, dynamic>? args});

  Future<Map<String, dynamic>> putToUrl(String path, dynamic body, {Map<String, dynamic>? args});

  Future<T> putAs<T>(String path, dynamic body, {Map<String, dynamic>? args, T? responseAs});

  Future<T> patch<T>(IReturn<T> request, {dynamic body, Map<String, dynamic>? args});

  Future<Map<String, dynamic>> patchToUrl(String path, dynamic body, {Map<String, dynamic> args});

  Future<T> patchAs<T>(String path, dynamic body, {Map<String, dynamic>? args, T? responseAs});

  Future<List<T>> sendAll<T>(Iterable<IReturn<T>> requests);

  Future<void> sendAllOneWay<T>(Iterable<IReturn<T>> requests);

  Future<T> send<T>(IReturn<T> request, {String? method, Map<String, dynamic>? args, T? responseAs});

  void close({bool force = false});
}
```

#### Concrete-specific functionality

In addition to implementing the `IServiceClient` above, each Service Client includes additional concrete specific functionality allowing for finer-grained access to their underlying HTTP Clients, e.g. as the Request/Response filters have different Type signatures (dart:io's `HttpClientResponse` vs Browser's `Response`) they can't be declared in the shared `IServiceClient` interface, but thanks to Dart's type inference many of the extended concrete APIs are still source-compatible, e.g:

```dart
var vmClient = JsonServiceClient(baseUrl)
    ..responseFilter = (res) => print(res.headers["X-Args"]);

var webClient = JsonWebClient(baseUrl)
    ..responseFilter = (res) => print(res.headers["X-Args"]);
```

### Uploading Files

The `postFileWithRequest` method can be used to upload a file with an API Request.

### Dart Speech to Text

Here's an example calling [AI Server's](/ai-server/) `SpeechToText` API:

```dart
var audioFile = new File('audio.wav');
var uploadFile = new UploadFile(
    fieldName: 'audio',
    fileName: audioFile.uri.pathSegments.last,
    contentType: 'audio/wav',
    contents: await audioFile.readAsBytes()
);

var response = await client.postFileWithRequest(new SpeechToText(), uploadFile);
```

To upload multiple files use `postFilesWithRequest`.


#### Comprehensive Test Suite

To ensure a high quality implementation we've ported the [TypeScript @servicestack/client](https://github.com/ServiceStack/servicestack-client) test suite over to Dart which is itself a good resource for discovering [different supported features and flexible HTTP Request options](https://github.com/ServiceStack/servicestack-dart/tree/master/test) available. 

### HelloFlutter App

To showcase popular API Requests in action we've created a basic [HelloFlutter](https://github.com/ServiceStackApps/HelloFlutter) App that mimics functionality in the [HelloMobile](https://github.com/ServiceStackApps/HelloMobile) App used to provide working examples of the same ServiceStack Service Client features running in the different supported Mobile and Desktop platforms.

[HelloFlutter](https://github.com/ServiceStackApps/HelloFlutter) was created in VS Code with the [DartCode extension](https://dartcode.org) using the [Flutter: New Project](https://flutter.io/get-started/test-drive/#vscode) action in VS Code's Command Palette.

This creates a basic Flutter App which you can run in your Android Device or Android Emulator where it's automatically picked and made visible in the **bottom right** of VS Code's status bar.

Then to use `JsonServiceClient` add the `servicestack` dependency to your apps [pubspec.yaml](https://github.com/ServiceStackApps/HelloFlutter/blob/master/pubspec.yaml):

  dependencies:
    servicestack: ^2.0.1

Saving `pubspec.yaml` automatically runs [flutter packages get](https://flutter.io/using-packages/) to install any new dependencies in your App. 

Our App will be making API calls to 2 different ServiceStack instances which we'll need to get typed DTOs for using the `x` command-line utility:

```bash
cd lib
x dart https://techstacks.io
x dart https://test.servicestack.net test
```

Which will save the DTOs for each endpoint in different files:

```
Saved to: dtos.dart
Saved to: test.dtos.dart
```

Incidentally you can get the latest version for all Dart Service References by running `x dart` without arguments:

:::sh
x dart
:::

Which updates all Dart references in the current directory, including any customization options available in the header of each file:

```
Updated: test.dtos.dart
Updated: dtos.dart
```

This gives us everything we need to call Web Services in our Flutter App, by importing `package:servicestack/client.dart` containing `JsonServiceClient` as well as any generated DTOs.

Then create new `JsonServiceClient` instances initialized with the `BaseUrl` for each of the remote endpoints we want to call:

```dart
import 'package:servicestack/client.dart';

import 'test.dtos.dart';
import 'dtos.dart';

const TestBaseUrl = "https://test.servicestack.net";
const TechStacksBaseUrl = "https://techstacks.io";

var testClient = JsonServiceClient(TestBaseUrl);
var techstacksClient = JsonServiceClient(TechStacksBaseUrl);
```

### HelloFlutter UI

Flutter works similarly to React and React Native where you need to return the entire UI layout for your Widget in its `Widget build(BuildContext context)` method, akin to React's `render()` method. For complete reference the app is contained in [lib/main.dart](https://github.com/ServiceStackApps/HelloFlutter/blob/master/lib/main.dart), but for clarity we'll just highlight the relevant parts in each section. 

Our widget requires some state to render its UI so our widget needs to inherit `StatefulWidget`. Stateful widgets require an additional supporting class for reasons [explained in this Thread](https://github.com/flutter/flutter/issues/8794):

::: info 
With a stateful widget, it's common to make closures whose life cycle are tied to the state's life cycle, which lasts through multiple widgets. With a stateless widget, it's common to make closures whose life cycle are tied to the widget's life cycle, which doesn't cause a problem
:::

Ultimately this results in following the same dual class pattern below where the `HelloFlutterState` defines the state it needs as instance fields, this state is preserved across Hot Module reloads which is how Dart can update a live running App despite the implementation of the class changing.

```dart
class HelloFlutter extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => HelloFlutterState();
}

class HelloFlutterState extends State<HelloFlutter> {
  //State for this widget
  String result = "";
  Uint8List imageBytes = Uint8List(0);

  @override
  Widget build(BuildContext context) {

      //...
      RaisedButton(
        child: Text("Async"),
        onPressed: () async {
          var r = await testClient.get(Hello(name: "Async"));
          setState(() {
            result = r.result;
          });
        },
      ),

      //...
      result != null && result != "" 
          ? Text(result) 
          : Image.memory(imageBytes, width:500.0, height:170.0),
  }
}
```

HelloFlutter's UI consists of 6 buttons across the top of the screen and an area to display the results of each call in the Widget's body. Each of the example Requests will populate either the `result` String for standard JSON responses or `imageBytes` for the `HelloImage` Service returning binary data.

#### Standard API Requests

The first **Async** example shows an example of the most popular API Request for calling ServiceStack Services, simply by sending a populated Request DTO that returns a populated Response DTO, in this case sending a `Hello` Request DTO that returns a `HelloResponse` DTO:

```dart
var r = await testClient.get(Hello(name: "Async"));
setState(() {
  result = r.result;
});
```

To update the UI any modified State needs to be done within the `setState((){ })` closure which triggers re-rendering of the Widget with the new state.

This results in displaying the contents of the `result` String in a `Text` widget that was returned by the remote `Hello` Service:

![](/img/pages/dart/flutter/helloflutter-01.png)


#### Authenticated Requests

This example shows how to make Authenticated Requests where first the `JsonServiceClient` instance is authenticated by sending a `Authenticate` request with valid Username/Password credentials which is validated against the servers configured [CredentialsAuthProvider](/auth/authentication-and-authorization#auth-providers). If successful this will return [Session Cookies](/auth/sessions) containing a reference to the Authenticated UserSession stored on the server. The Cookies are automatically saved on the `JsonServiceClient` instance and re-sent on subsequent requests which is how it's able to make an Authenticated request to the [protected `HelloAuth` Service](https://github.com/ServiceStack/Test/blob/3cc559d8de79e1c70ff7f4327458040ca055dea3/src/Test/Test.ServiceInterface/TestAuthService.cs#L18-L19):

```dart
RaisedButton(
  child: Text("Auth"),
  onPressed: () async {

    var auth = await testClient.post(Authenticate(
        provider: "credentials",
        userName: "test",
        password: "test"));

    var r = await testClient.get(HelloAuth(name: "Auth"));

    setState(() {
      result = "${r.result} your JWT is: ${auth.bearerToken}";
    });
  },
),
```

If the Username and Password were valid it will display the result of the `HelloAuth` Service along with the encapsulated JWT Token returned in the initial `AuthenticateResponse` call. 

![](/img/pages/dart/flutter/helloflutter-02.png)

JWT's encapsulate a signed, stateless Authenticated UserSession which is able to Authenticate with remote Services that have an `JwtAuthProvider` registered with the same AES or RSA Key used to sign the JWT Token. As they enable [Authentication with stateless Services they're ideal for use in Microservices](/auth/jwt-authprovider#stateless-auth-microservices).

#### JWT RefreshToken Requests

The JWT sample shows an example of authenticating via JWT, but instead of configuring the `JsonServiceClient` instance with the JWT BearerToken above (and what's needed to make JWT Authenticated Requests), it's only populating the [long-lived RefreshToken](/auth/jwt-authprovider#refresh-tokens) which the client automatically uses behind the scenes to fetch a JWT Bearer Token from the remote ServiceStack endpoint, which if the User is still allowed to Sign In will populate the instance with a new JWT Bearer Token encapsulated with the latest UserSession.

```dart
RaisedButton(
  child: Text("JWT"),
  onPressed: () async {
    var auth = await testClient.post(Authenticate(
        provider: "credentials",
        userName: "test",
        password: "test"));

    var newClient = JsonServiceClient(TestBaseUrl)
      ..refreshToken = auth.refreshToken;
    
    var r = await newClient.get(HelloAuth(name: "JWT"));

    setState(() {
      result = "${r.result} your RefreshToken is: ${auth.refreshToken}";
    });
  },
),
```

The RefreshToken is smaller than a JWT Bearer Token as it just contains a signed token with permission to fetch new JWT Tokens and not the actual UserSession contained in the JWT Bearer Token.

![](/img/pages/dart/flutter/helloflutter-03.png)

#### AutoQuery Requests

[AutoQuery](/autoquery/rdbms) lets us effortlessly creating queryable high-performance RDBMS APIs with just a Request DTO class definition, e.g:

```csharp
[Route("/technology/search")]
public class FindTechnologies : QueryDb<Technology>
{
    public string Name { get; set; }
    public string NameContains { get; set; }
}
```

ServiceStack takes care of creating the implementation for this Service from this definition which queries the `Technology` RDBMS table. 

Any properties added to the AutoQuery Request DTO will be generated in the Dart `FindTechnologies` Request DTO. However AutoQuery also lets you query any other property on the `Technology` table using any of the configured [Implicit Conventions](/autoquery/rdbms#implicit-conventions). 

We can include any additional arguments that are not explicitly defined on the Request DTO using the optional `args` parameter available in each `IServiceClient` API.

This examples calls 2 different AutoQuery Services, first to retrieve the **Flutter** `Technology` in https://techstacks.io to retrieve its `id` which it uses to query the latest `Announcement` or `Showcase` posted in the **Flutter** organization:

```dart
RaisedButton(
  child: Text("Query"),
  onPressed: () async {
    
    var techs = await techstacksClient.get(FindTechnologies(), args: {"slug": "flutter"});
    
    var posts = await techstacksClient.get(QueryPosts(
        anyTechnologyIds: [techs.results[0].id],
        types: ['Announcement', 'Showcase'])
      ..take = 1);

    setState(() {
      result = "Latest Flutter Announcement:\n“${posts.results[0].title}”";
    });
  },
),
```

The 2nd Request calls the `QueryPosts` AutoQuery Service highlighting the Service Client's support for [sending complex type arguments on the QueryString](/serialization-deserialization#passing-complex-objects-in-the-query-string) and an example of using Dart's method cascade operator to populate the `take` field in  the [inherited QueryBase class](/autoquery/rdbms#iquery).

![](/img/pages/dart/flutter/helloflutter-04.png)

#### Auto Batched Requests

The `sendAll` and `sendAllOneWay` APIs lets you use ServiceStack's [Auto Batched Requests](/auto-batched-requests) feature to batch multiple Requests DTOs of the same Type in a single Request that returns all Responses in a single Response, e.g:

```dart
RaisedButton(
  child: Text("Batch"),
  onPressed: () async {
    
    var requests = ['foo', 'bar', 'qux']
        .map((name) => Hello(name: name));
    
    var responses = await testClient.sendAll(requests);

    setState(() {
      result = "Batch Responses:\n${responses.map((r) => r.result).join('\n')}";
    });
  },
),
```

![](/img/pages/dart/flutter/helloflutter-05.png)

#### Generating Unknown Types

This is one area where we hit limitations of not being able to use Reflection in Dart which requires generating factories ahead-of-time for each type we need to create instances of at runtime. This is typically inferred by inspecting all Types referenced in each DTO, but as Auto Batched Requests lets you combine multiple requests for every Service, in the interest for reducing the amount of code-generation needed ServiceStack doesn't generate an explicit Service Contract for the Batched version of each API. 

Instead you'll need to specify missing types needed, the easiest solution to do this is to create a Dummy Service containing properties of any missing Types needed, in this case we need to generate a factory for the `List<HelloResponse>` used to return the batched `HelloResponse` DTOs in:

```csharp
public class UnknownTypes
{
    public List<HelloResponse> HelloResponses { get; set; }
}

public class UnknownTypesService : Service
{
    public object Any(UnknownTypes request) => request;
}
```

#### Binary Requests

Most API Requests typically involve sending a populated Request DTO that returns a Typed Response DTO although ServiceStack Services can also [return raw data](/service-return-types) like `String`, `byte[]` and `Stream` responses which the `JsonServiceClient` also seamlessly supports where instead of returning a Typed DTO it returns the raw HTTP Body as a `String` for Request DTOs implementing `IReturn<String>` or an `Uint8List` for any binary responses (e.g. Services implementing `IReturn<byte[]>` or `IReturn<Stream>`).

This example calls the [`HelloImage` Service](https://github.com/ServiceStack/Test/blob/90678a1d57ac63daaafea7322e0a4f542a93488f/src/Test/Test.ServiceInterface/ImageService.cs#L137) which dynamically creates and returns an image based on the different properties on the incoming `HelloImage` Request DTO. As it implements `IReturn<byte[]>` the `JsonServiceClient` returns the binary contents of the HTTP Response in a `Uint8List` - the preferred type for bytes in Dart.

```dart
RaisedButton(
  child: Text("Image"),
  onPressed: () async {

    Uint8List bytes = await testClient.get(HelloImage(
        name: "Flutter",
        fontFamily: "Roboto",
        background: "#0091EA",
        width: 500,
        height: 170));

    setState(() {
      result = "";
      imageBytes = bytes;
    });

  },
),

//...
result != null && result != "" 
    ? Text(result) 
    : Image.memory(imageBytes, width:500.0, height:170.0),
```

To display the image we assign the response to the `imageBytes` field within the stateful widget's `setState()` which triggers a re-render of the UI containing the generated Image displayed using the [Image widget](https://docs.flutter.io/flutter/widgets/Image-class.html):

![](/img/pages/dart/flutter/helloflutter-06.png)

### Angular Dart

The [HelloAngularDart](https://github.com/ServiceStackApps/HelloAngularDart) project demonstrates the same functionality in an AngularDart Web App running inside a Web Browser.

The only difference is having to import `web_client.dart` containing the `JsonWebClient`:

```dart
import 'package:servicestack/web_client.dart';
```

and changing the clients to use the `JsonWebClient` instead, e.g:

```dart
var testClient = JsonWebClient(TestBaseUrl);
var techstacksClient = JsonWebClient(TechStacksBaseUrl);
```

But otherwise the actual client source code for all of the Typed API requests remains exactly the same. 

The `HelloAngularDart` App is contained within the [hello_world](https://github.com/ServiceStackApps/HelloAngularDart/tree/master/lib/src/hello_world) component with all Dart logic in:

#### [hello_world.dart](https://github.com/ServiceStackApps/HelloAngularDart/blob/master/lib/src/hello_world/hello_world.dart)

```dart
import 'dart:typed_data';
import 'dart:convert';

import 'package:angular/angular.dart';
import 'package:servicestack/web_client.dart';

import '../dtos/test.dtos.dart';
import '../dtos/dtos.dart';

@Component(
  selector: 'hello-world',
  styleUrls: const ['hello_world.css'],
  templateUrl: 'hello_world.html',
)
class HelloWorldComponent {
  var result = "";
  var imageSrc = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // 1x1 pixel
  static const TestBaseUrl = "https://test.servicestack.net";
  static const TechStacksBaseUrl = "https://techstacks.io";
  var testClient = JsonWebClient(TestBaseUrl);
  var techstacksClient = JsonWebClient(TechStacksBaseUrl);

  doAsync() async {
    var r = await testClient.get(Hello(name: "Async"));
    result = r.result;
  }

  doAuth() async {
    var auth = await testClient.post(Authenticate(
        provider: "credentials", userName: "test", password: "test"));
    var r = await testClient.get(HelloAuth(name: "Auth"));
    result = "${r.result} your JWT is: ${auth.bearerToken}";
  }

  doJWT() async {
    var auth = await testClient.post(Authenticate(
        provider: "credentials", userName: "test", password: "test"));

    var newClient = JsonWebClient(TestBaseUrl)
      ..refreshToken = auth.refreshToken;
    var r = await newClient.get(HelloAuth(name: "JWT"));
    result = "${r.result} your RefreshToken is: ${auth.refreshToken}";
  }

  doQuery() async {
    var techs = await techstacksClient
        .get(FindTechnologies(), args: {"slug": "flutter"});
    var posts = await techstacksClient.get(QueryPosts(
        anyTechnologyIds: [techs.results[0].id],
        types: ['Announcement', 'Showcase'])
      ..take = 1);
    result = "Latest Flutter Announcement:\n“${posts.results[0].title}”";
  }

  doBatch() async {
    var requests = ['foo', 'bar', 'qux'].map((name) => Hello(name: name));
    var responses = await testClient.sendAll(requests);
    result = "Batch Responses:\n${responses.map((r) => r.result).join('\n')}";
  }

  doImage() async {
    Uint8List bytes = await testClient.get(HelloImage(
        name: "Flutter",
        fontFamily: "Roboto",
        background: "#0091EA",
        width: 500,
        height: 170));

    result = "";
    imageSrc = "data:image/png;base64," + base64.encode(bytes);
  }
}
```

#### [hello_world.html](https://github.com/ServiceStackApps/HelloAngularDart/blob/master/lib/src/hello_world/hello_world.html)

Which uses this template markup to render its UI:

```html
<div>
    <button (click)="doAsync()">Async</button>
    <button (click)="doAuth()">Auth</button>
    <button (click)="doJWT()">JWT</button>
    <button (click)="doQuery()">Query</button>
    <button (click)="doBatch()">Batch</button>
    <button (click)="doImage()">Image</button>
</div>

<div id="result">{{result}}</div>

<img src="{{imageSrc}}">
```

Where it runs a functionally equivalent App in a browser:

![](/img/pages/dart/angulardart/helloangulardart-01.png)


## DTO Customization Options 

In most cases you'll just use the generated Dart DTOs as-is, however you can further customize how
the DTOs are generated by overriding the default options.

### Customize DTO Type generation

Additional Dart specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) can be used to inject custom code in the generated DTOs output. 

Use the `PreTypeFilter` to generate source code before and after a Type definition, e.g. this will append the `[Validate]` attribute on non enum & interface types:

```csharp
DartGenerator.PreTypeFilter = (sb, type) => {
    if (!type.IsEnum.GetValueOrDefault() && !type.IsInterface.GetValueOrDefault())
    {
        sb.AppendLine("@validate()");
    }
};
```

The `InnerTypeFilter` gets invoked just after the Type Definition which can be used to generate common members for all Types and interfaces, e.g:

```csharp
TypeScriptGenerator.InnerTypeFilter = (sb, type) => {
    sb.AppendLine("String id = '${Random().nextDouble()}'.substring(2);");
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
TypeScriptGenerator.PrePropertyFilter = (sb , prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("@PrimaryKey()");
    }
};
```

### Emit custom code

To enable greater flexibility when generating complex Typed DTOs, you can use `[Emit{Language}]` attributes to generate code before each type or property.

These attributes can be used to generate different attributes or annotations to enable client validation for different validation libraries in different languages, e.g:

```csharp
[EmitDart("@validate")]
[EmitCode(Lang.Dart | Lang.CSharp | Lang.Kotlin, "// App User")]
public class User : IReturn<User>
{
    [EmitDart("@isNotEmpty", "@isEmail")]
    [EmitCode(Lang.TypeScript | Lang.Kotlin, new[]{ "@IsNotEmpty()", "@IsEmail()" })]
    public string Email { get; set; }
}
```

Which will generate `[EmitDart]` code in Dart DTOs:

```dart
@validate
// App User
class User implements IReturn<User>, IConvertible
{
    @isNotEmpty
    @isEmail
    String email;

    User({this.email});
    User.fromJson(Map<String, dynamic> json) { fromMap(json); }

    fromMap(Map<String, dynamic> json) {
        email = json['email'];
        return this;
    }

    Map<String, dynamic> toJson() => {
        'email': email
    };

    createResponse() { return User(); }
    String getTypeName() { return "User"; }
    TypeContext context = _ctx;
}
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.

### Client Customization Options

The header in the generated DTOs show the different options Dart native types support with their 
defaults. Default values are shown with the comment prefix of `//`. To override a value, remove the `//` 
and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override 
any server defaults.

The DTO comments allows for customizations for how DTOs are generated. The default options that were used 
to generate the DTOs are repeated in the header comments of the generated DTOs, options that are preceded 
by a Dart comment `//` are defaults from the server, any uncommented value will be sent to the server 
to override any server defaults.

```dart
/* Options:
Date: 2025-06-04 09:48:37
Version: 8.80
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://blazor-vue.web-templates.io

//GlobalNamespace: 
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: package:servicestack/servicestack.dart
*/
```

We'll go through and cover each of the above options to see how they affect the generated DTOs:

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the 
`NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in CSharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.GlobalNamespace = "dtos";
...
```

We'll go through and cover each of the above options to see how they affect the generated DTOs:

### GlobalNamespace

Specify a library for the generated Dart DTOs:

```dart
library dtos;
```

### AddResponseStatus

Automatically add a `ResponseStatus` property on all Response DTOs, regardless if it wasn't already defined:

```dart
class  GetAnswers implements IReturn<GetAnswersResponse>
{
    ...
    ResponseStatus responseStatus;
}
```

### AddImplicitVersion

Lets you specify the Version number to be automatically populated in all Request DTOs sent from the client: 

```dart
class GetAnswers implements IReturn<GetAnswersResponse>
{
    int version = 1;
    ...
}
```

This lets you know what Version of the Service Contract that existing clients are using making it easy 
to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTOs:

```csharp
class class GetTechnology { ... }
class class GetTechnologyResponse { ... }
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
Is used as a Blacklist to specify which types you would like excluded from being generated:

```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```

Will exclude `GetTechnology` and `GetTechnologyResponse` DTOs from being generated.

### DefaultImports
Add additional import statements to the generated DTO's:

```
/* Options:
DefaultImports: package:servicestack/client.dart,package:flutter/material.dart
```

Will import the `servicestack/client.dart` and `flutter/material.dart` packages:

```swift
import 'package:servicestack/client.dart';
import 'package:flutter/material.dart';
```
