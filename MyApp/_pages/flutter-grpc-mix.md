---
slug: flutter-grpc-mix
title: Flutter gRPC Mix Template
---

Two mix templates to help you build services with Flutter clients are the `flutter` and `flutter-grpc` mix templates.

In this walk through we will be focusing on `mix flutter-grpc` template. See [here for details on `mix flutter`](./flutter-mix.md).

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="fgts6sQ2Ags" style="background-image: url('https://img.youtube.com/vi/fgts6sQ2Ags/maxresdefault.jpg')"></lite-youtube>

These templates create a new Flutter application using your locally installed [Flutter SDK](https://docs.flutter.dev/get-started/install) that comes wired up to the ServiceStack project template it is mixed into.

These mix templates can be added to ServiceStack templated projects using the [ServiceStack dotnet x tool](./dotnet-tool.md), which can be installed using the command:

```bash
$ dotnet tool install --global x 
```

## Pre-requisites

- Flutter SDK
- Dart SDK
- ServiceStack dotnet x tool

![](./img/pages/mix/flutter-mix-running-desktop.png)

## New or Existing Project

The Flutter integration works with ServiceStack `grpc` template that has been *configured to support gRPC services*. It also makes the assumption that when working locally, the initial Flutter application will connect to the ServiceStack gRPC services via `localhost:5054` or if the client is running on an Android Emulator, `10.0.0.2:5054`.
`5054` is the insecure HTTP port that is used by the `grpc` project template, but if you want to add `grpc` support to your application using `npx add-in grpc`, be sure to set up the use of the same port for local development, or modify your Flutter client to match your server setup.

For example, you could [start with a new](/dotnet-new) `grpc` ServiceStack project to host your services via gRPC, and add a working Flutter client which connects via gRPC using the mix template.

```bash
$ npx create-net grpc MyApp
```

Then from your new solution directory `MyApp`, mix in the Flutter application using:

```bash
$ npx add-in flutter-grpc
```

## Project Structure

The `npx add-in flutter-grpc` template uses your locally installed Flutter SDK to create the initial Flutter application via the `flutter create` command.
It then overrides some source files, and adds some required Dart dependencies to facilitate the integration with your gRPC services.

![](./img/pages/mix/flutter-mix-project-structure.png)

## Running

To develop on your Flutter client, it is best to take advantage of the hot reload functionality of both Flutter and `dotnet watch`.

### ServiceStack App

From your `grpc` project directory, navigate into your `MyApp` AppHost directory and run:

```bash
$ dotnet watch
```

The `grpc` template is pre-configured listening on 3 ports in the `appsettings.json`.

- `https://*:5001` - Http1 - Normal Web Service Access
- `https://*:5051` - Http2 - Grpc Secure
- `http://*:5054` - Http2 - Grpc Insecure

When developing locally, the Flutter client application accesses gRPC services using the `GrpcInsecure` endpoints using port `5054`.

Keep your services running, and open your `myapp_flutter` directory using [Android Studio](https://developer.android.com/studio/install).

### Flutter App

When building application in flutter, you can use various [IDEs or editors](https://docs.flutter.dev/get-started/editor?tab=androidstudio), but in this example we will be using Android Studio.
Flutter applications are written in the [Dart Language](https://dart.dev/overview), and since both are developed by Google, there are great resources for [learning both the Dart Language](https://dart.dev/guides), and the [Flutter Framework](https://docs.flutter.dev/reference/tutorials), included [dedicated resources for those familiar with Xamarin.Forms](https://docs.flutter.dev/get-started/flutter-for/xamarin-forms-devs).

When developing on Windows, Android Studio will automatically support `web` and `desktop` targets, as well as making it easier to set up and manage Android Emulated devices.

![](./img/pages/mix/flutter-mix-android-run-configs.png)

## Development

From Android Studio, you can target multiple platforms including Windows, Web and Android. If you are on Windows, targeting a Windows Desktop application can provide a rapid development cycle as Flutter Hot Reload works well and performs quickly.
And since ServiceStack can generate client [Data Transfer Objects](http://msdn.microsoft.com/en-us/library/ff649585.aspx) or DTOs, we can have a [typed end-to-end service integration](./add-servicestack-reference) when developing Flutter client applications.

### Flutter `main.dart`

The `npx add-in flutter-grpc` command provides a customized `main.dart` with a built-in integration of the `Hello` API service of your local ServiceStack application using gRPC.

It has pre-generated gRPC `services.proto` for which dart code is also generated to enable this integration.

![](./img/pages/mix/flutter-grpc-mix-lib-files.png)

ServiceStack [generates this `.proto`](./grpc#proto-options) file used by the client and then provides [tooling through the dotnet `x` tool to generate gRPC client code in Dart](/grpc#public-grpc-protoc-service-and-ui), or multiple other languages. 

The Flutter client application itself uses Dart libraries like [`protobuf`](https://pub.dev/packages/protobuf) from Google, the [`grpc`](https://pub.dev/packages/grpc/) from the Dart team and leverages the optimized [`servicestack` package](https://pub.dev/packages/servicestack) to improve the development experience.

Since your ServiceStack application host generates the `.proto` file, you can use any other standard gRPC tooling with this file if you prefer.

```dart
var host = "localhost";
var channel = ClientChannel(host, port:5054,
  options:const ChannelOptions(credentials: ChannelCredentials.insecure(
)));
var client = GrpcServicesClient(channel);

runApp(const MyApp());
```

The use of Android Emulators for local development is catered for by checking if the application is not in release mode, is not a web platform and if it is running on the Android platform.

```dart
if (!kReleaseMode && !kIsWeb) {
  if (Platform.isAndroid) {
    host = "10.0.2.2";
    channel = ClientChannel(host, port:5054,
        options:const ChannelOptions(credentials: ChannelCredentials.insecure(
        )));
    client = GrpcServicesClient(channel);
  }
}
```

This is done since Android Emulators have limited network access, and can only access the ServiceStack application running on the host. Android can only communicate with the host via the [aliased `10.0.2.2` IP address from the running emulator](https://developer.android.com/studio/run/emulator-networking).

### Flutter Template Overview

Flutter applications use [`Widgets`](https://docs.flutter.dev/development/ui/widgets-intro) to build everything you see in a Flutter application.

> Widgets describe what their view should look like given their current configuration and state. When a widget’s state changes, the widget rebuilds its description, which the framework diffs against the previous description in order to determine the minimal changes needed in the underlying render tree to transition from one state to the next.

The `MyApp` widget is the entry point of our application, and the `MaterialApp` to default your Flutter application to use [Material Design](https://docs.flutter.dev/development/ui/material) as a style or theme.


```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HelloFlutter(title: 'Flutter Demo Home Page'), // Your app starts here
    );
  }
}
```

The `HelloFlutter` widget is a [`StatefulWidget`](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html) which references the `HelloFlutterState` class where the UI is declared and updates are made to the Flutter UI.

The example application listens for changes from the `TextField` using a `TextEditingController`, binding a `callService` method which fires whenever a change is made.

```dart
class HelloFlutterState extends State<HelloFlutter> {
  //State for this widget
  String result = "";
  var myController = TextEditingController();
  ...

  @override
  void initState() {
    super.initState();
    // Listen for changes from the TextField and call our API
    myController.addListener(callService);
  }
  
  void callService() async {
    var text = myController.text.isEmpty ? "World" : myController.text;
    var response = await client.get(Hello(name: text));
    setState(() {
      result = response.result!;
    });
  }
  
@override
  Widget build(BuildContext context) {
    return Scaffold(//...
      body: Center(//..
        TextField(//..
          controller: myController,
      )
```

### Calling the Hello API

The `callService` method is an `async` method where Dart has a familiar syntax to dotnet. The generated gRPC client in the 4 `services.*.dart` files is baked into the `fluter-grpc` mix template and contain the initially generated gRPC client.
Calling gRPC services using generated client is similar to using other ServiceStack service clients, but since it is gRPC, we have dedicated methods on our client for our services. Eg, `getHello` rather than just the verb `get`.

```dart
void callService() async {
  var text = myController.text.isEmpty ? "World" : myController.text;
  var response = await client.getHello(Hello(name: text));
  setState(() {
    result = response.result;
  });
}
```

### Updating your client DTOs

During development of your web services, when changes are made to your Request DTO classes, your client sometimes needs to be aware of these changes.
We can update both the `services.proto` file and generated Dart client using the ServiceStack dotnet `x` tool and the command:

```bash
$ x proto-dart https://localhost:5001
```

This command updates the `services.proto` file first, and then uses our [hosted gRPC client generator](https://grpc.servicestack.net) to generate a working gRPC client in the language of your choice.

The initial `services.*.dart` files contain a basic gRPC client for working with the default `Hello` service, but if other web services are running on your host application, using `x proto-dart` will then sync your client and generated client as you make changes.

For example, if you use one of our [Jamstack templates](https://jamstacks.net), and configure gRPC using `npx add-in grpc`, there is also a Todo service.

### Make your service support gRPC

For a ServiceStack service to support gRPC, it needs to use the `[DataContract]` and `[DataMember(Order = x)]` attributes on the types exposed by your generated clients. Once these attributes are added

```csharp
[Tag("todos")]
[Route("/todos", "GET")]
[DataContract]
public class QueryTodos : QueryData<Todo>
{
    [DataMember(Order = 1)]
    public int? Id { get; set; }
    [DataMember(Order = 2)]
    public List<long>? Ids { get; set; }
    [DataMember(Order = 3)]
    public string? TextContains { get; set; }
}

[DataContract]
public class Todo : IHasId<long>
{
    [DataMember(Order = 1)]
    public long Id { get; set; }
    [DataMember(Order = 2)]
    public string Text { get; set; }
    [DataMember(Order = 3)]
    public bool IsFinished { get; set; }
}
```

Once updated, re-running your ServiceStack application, we can update our generated gRPC client using `x proto-dart` from your project directory while your ServiceStack host is running locally.

This will enable you to integrate with the `Todo` service using the updated client using the following syntax.

```dart
Future<QueryResponse_Todo> queryTodos() async {
  return await client.getQueryTodos(QueryTodos());
}
```

gRPC's use of [Protocol Buffers does have a number of restrictions](/grpc#limitations) in the Types in supports that are worth keeping in mind.

### Questions?

Head over to our [Customer Forums](https://forums.servicestack.net) or [GitHub Discussions](https://servicestack.net/ask) if you are having issues or have any questions!