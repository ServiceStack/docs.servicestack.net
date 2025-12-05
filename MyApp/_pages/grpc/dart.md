---
slug: grpc-dart
title: gRPC protoc Dart Client
---

[![](/img/pages/grpc/dart.png)](https://youtu.be/fDARSMNlt50)

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="UQlYodNS1xc" style="background-image: url('https://img.youtube.com/vi/UQlYodNS1xc/maxresdefault.jpg')"></lite-youtube>

## Dart protoc generated GrpcServiceClient TodoWorld Example

Install [x dotnet tool](/dotnet-tool):
    
:::sh
dotnet tool install --global x 
:::
    
Install [stagehand](https://pub.dev/packages/stagehand):

:::sh
pub global activate stagehand
:::

Create a new Dart Console App:

:::sh
stagehand console-full
:::

Add required dependencies to **pubspec.yaml**:

```yaml
dependencies:
  fixnum: ^0.10.11
  async: ^2.2.0
  protobuf: ^1.0.1
  grpc: ^2.1.3
```

Install dependencies:

:::sh
pub get
:::
    
### Generate protoc Dart gRPC Client

Add protoc generated TodoWorld DTOs and gRPC GrpcServiceClient to `lib/` folder:

:::sh
x proto-dart https://todoworld.servicestack.net -out lib
:::

### Dart protoc gRPC insecure Example

Use protoc generated DTOs and `GrpcServiceClient` to call TodoWorld gRPC Service in `bin/main.dart`:

```dart
import 'dart:io';
import 'package:grpc/grpc.dart';
import 'package:TodoWorld/services.pb.dart';
import 'package:TodoWorld/services.pbgrpc.dart';

void main(List<String> args) async {

  var client = GrpcServicesClient(ClientChannel('todoworld.servicestack.net', port:5054,
    options:ChannelOptions(credentials: ChannelCredentials.insecure())));

  var response = await client.getHello(Hello()..name = 'gRPC Dart');
  print(response.result);

  exit(0);
}
```

Override `bin/main.dart` with the above Dart Example: 

:::sh
npx add-in todoworld-dart -out bin
:::

Run example:

:::sh
dart run
:::

### Dart protoc gRPC SSL Example

Download TodoWorld SSL Certificate used for its gRPC HTTP/2 Services:

:::sh
x get https://todoworld.servicestack.net/grpc.crt
:::

Use certificate when initializing `GrpcServicesClient`:

```dart
import 'dart:io';
import 'package:grpc/grpc.dart';
import 'package:TodoWorld/services.pb.dart';
import 'package:TodoWorld/services.pbgrpc.dart';

void main(List<String> args) async {

  var client = GrpcServicesClient(ClientChannel('todoworld.servicestack.net', port:50051,
    options:ChannelOptions(credentials: ChannelCredentials.secure(
        certificates: File('grpc.crt').readAsBytesSync(),
        authority: 'todoworld.servicestack.net'))));

  var response = await client.getHello(Hello()..name = 'gRPC Dart');
  print(response.result);

  exit(0);
}
```

Override `bin/main.dart` with the above Dart Example: 

:::sh
npx add-in todoworld-dart-ssl -out bin
:::

Run example:

:::sh
dart run
:::

### Dart Local Development gRPC SSL CRUD Example

```dart
import 'dart:convert';
import 'dart:io';
import 'package:grpc/grpc.dart';
import 'package:todoworld/services.pb.dart';
import 'package:todoworld/services.pbgrpc.dart';

GrpcServicesClient createClient({CallOptions options}) {
  return GrpcServicesClient(ClientChannel('localhost', port:5001,
    options:ChannelOptions(credentials: ChannelCredentials.secure(
        certificates: File('../certs/dev.crt').readAsBytesSync(),
        authority: 'localhost'))), options:options);
}

void main(List<String> args) async {

  var client = createClient();
  await client.postResetTodos(ResetTodos());

  //POST /todos
  var todo = (await client.postCreateTodo(CreateTodo()..title = 'ServiceStack')).result;
  print('new todo Id: ${todo.id}, Title: ${todo.title}');

  //GET /todos
  var all = await client.callGetTodos(GetTodos());
  print('todos: ${all.results.length}');

  //GET /todos/1
  todo = (await client.callGetTodo(GetTodo()..id = todo.id)).result;
  print('get todo Id: ${todo.id}, Title: ${todo.title}');

  //PUT /todos/1
  await client.putUpdateTodo(UpdateTodo()..id = todo.id..title = 'gRPC');

  //GET /todos/1
  todo = (await client.callGetTodo(GetTodo()..id = todo.id)).result;
  print('get todo Id: ${todo.id}, Title: ${todo.title}');

  //DELETE /todos/1
  await client.callDeleteTodo(DeleteTodo()..id = todo.id);

  //GET /todos
  all = await client.callGetTodos(GetTodos());
  print('todos: ${all.results.length}');  
}
```

### Dart Server Events gRPC Server Stream Example

Consume [ServiceStack Server Events](/server-events) from gRPC Server Stream API:

```dart
var stream = client.serverStreamServerEvents(StreamServerEvents()..channels.add('todos'));
await for (var r in stream) {
  var obj = jsonDecode(r.json);
  if (r.selector.startsWith('todos')) {
    if (obj is Map) {
      print('EVENT ${r.selector} [${r.channel}]: #${obj['id']} ${obj['title']}');
    } else {
      print('EVENT ${r.selector} [${r.channel}]: ${obj}');
    }
  } else {
    print('EVENT ${r.selector} ${r.channels}: #${obj['userId']} ${obj['displayName']}');
  }
}
```

### Dart gRPC Server Stream Files Example

```dart
var stream = client.serverStreamFiles(StreamFiles()..paths.addAll([
  '/js/ss-utils.js',
  '/js/hot-loader.js',
  '/js/hot-fileloader.js',
]));

await for (var file in stream) {
  var text = utf8.decode(file.body);
  print('FILE ${file.name} (${file.length}): ${text.substring(0, text.length < 50 ? text.length : 50)} ...');
}
```

### Dart gRPC Authenticated Request Example

Depending on what Authentication Providers are available will determine how you can Authenticate and whether the
`AuthenticateResponse` will return a [stateless Bearer Token](/auth/authentication-and-authorization#authentication-per-request-auth-providers)
that can be used to Authenticate instead of a Server Session Id. 

Here's an example of authenticating with the common Credentials Auth and authenticating with either the 
[Session Id](/auth/sessions) or JWT Bearer Token (if [JWT is enabled](/auth/jwt-authprovider)):

```dart
// Authenticate user Username/Password Credentials Auth
var authResponse = await client.postAuthenticate(Authenticate()..provider='credentials'
  ..userName=userOrEmail..password=password);

// If using Session Auth
var authClient = createClient(options:CallOptions(metadata:{ 'X-ss-id': authResponse.sessionId }));

// If using Bearer Token stateless Auth Providers (e.g. JWT or API Key):
const bearerToken = authResponse.bearerToken; // or JWT or API Key
var authClient = createClient(options:CallOptions(metadata:{ 'Authorization': 'Bearer ${bearerToken}' }));

// Use authClient to make Authenticated Requests:
var response = await authClient.getHelloSecure(HelloSecure()..name = 'Authenticated gRPC Dart!');
print(response.result);
```

Refer to [/clients/dart](https://github.com/NetCoreApps/todo-world/tree/master/clients/dart)
for a complete example project.
