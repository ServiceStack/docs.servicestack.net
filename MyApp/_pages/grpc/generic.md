---
slug: grpc-generic
title: Smart Generic C# / F# / VB.NET Service Client
---

## C# Generic GrpcServiceClient TodoWorld Example

[![](/img/pages/grpc/csharp-generic.png)](https://youtu.be/K0QAUQPJNtM)

::: info YouTube
[youtu.be/K0QAUQPJNtM](https://youtu.be/K0QAUQPJNtM)
:::

Install [x dotnet tool](/web-tool):
    
:::sh
dotnet tool install --global x 
:::

Create a new C# App:

:::sh
dotnet new console
:::

Add [ServiceStack.GrpcClient](https://www.nuget.org/packages/ServiceStack.GrpcClient) NuGet Package:

:::sh
dotnet add package ServiceStack.GrpcClient
:::

Add TodoWorld DTOs:

:::sh
`x csharp https://todoworld.servicestack.net`
:::
    
Use TodoWorld DTOs with generic `GrpcServiceClient` to call TodoWorld gRPC Service:

### C# gRPC insecure Example

```csharp
using System;
using System.Threading.Tasks;
using ServiceStack;
using TodoWorld.ServiceModel;

namespace TodoWorld
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            ProtoBuf.Grpc.Client.GrpcClientFactory.AllowUnencryptedHttp2 = true;
            var client = new GrpcServiceClient("http://todoworld.servicestack.net:5054");

            var response = await client.GetAsync(new Hello { Name = "gRPC C#" });

            Console.WriteLine(response.Result);
        }
    }
}
```

Override `Program.cs` with the above C# Example: 

:::sh
npx add-in todoworld-cs
:::

Run example:

:::sh
dotnet run
:::

### C# gRPC SSL Example

```csharp
using System;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using ServiceStack;
using TodoWorld.ServiceModel;

namespace TodoWorld
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            var client = new GrpcServiceClient("https://todoworld.servicestack.net:50051", 
                new X509Certificate2("https://todoworld.servicestack.net/grpc.crt".GetBytesFromUrl()), 
                GrpcUtils.AllowSelfSignedCertificatesFrom("todoworld.servicestack.net"));

            var response = await client.GetAsync(new Hello { Name = "gRPC C#" });

            Console.WriteLine(response.Result);
        }
    }
}
```

Override `Program.cs` with the above C# Example: 

:::sh
npx add-in todoworld-cs-ssl
:::

Run example:

:::sh
dotnet run
:::

### C# Local Development gRPC SSL CRUD Example

```csharp
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Text;
using TodoWorld.ServiceModel;

namespace CSharpGeneric
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Certificate registration not required when using trusted local development certificate  
            var client = new GrpcServiceClient("https://localhost:5001");
            await client.PostAsync(new ResetTodos());

            //POST /todos
            var todo = (await client.PostAsync(new CreateTodo { Title = "ServiceStack" })).Result;
            $"new todo Id: {todo.Id}, Title: {todo.Title}".Print();
            
            //GET /todos
            var all = await client.GetAsync(new GetTodos());
            $"todos: {all.Results?.Count ?? 0}".Print();

            //GET /todos/1
            todo = (await client.GetAsync(new GetTodo { Id = todo.Id })).Result;
            $"get todo Id: {todo.Id}, Title: {todo.Title}".Print();

            //GET /todos
            all = await client.GetAsync(new GetTodos());
            $"todos: {all.Results?.Count ?? 0}".Print();

            //PUT /todos/1
            await client.PutAsync(new UpdateTodo { Id = todo.Id, Title = "gRPC" });

            //GET /todos/1
            todo = (await client.GetAsync(new GetTodo { Id = todo.Id })).Result;
            $"updated todo Title: {todo.Title}".Print();

            //DELETE /todos/1
            await client.DeleteAsync(new DeleteTodo { Id = todo.Id });

            //GET /todos
            all = await client.GetAsync(new GetTodos());
            $"todos: {all.Results?.Count ?? 0}".Print();
        }
    }
}
```

Refer to [/clients/csharp-generic](https://github.com/NetCoreApps/todo-world/tree/master/clients/csharp-generic)
for a complete example project.

## More Examples

For more C# `GrpcServiceClient` examples check out the integration tests at:

 - [GrpcTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Extensions.Tests/GrpcTests.cs)
 - [GrpcTodoTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Extensions.Tests/GrpcTodoTests.cs)
 - [GrpcAuthTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Extensions.Tests/GrpcAuthTests.cs)
 - [GrpcAutoQueryTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Extensions.Tests/GrpcAutoQueryTests.cs)
 - [GrpcServerEventsTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Extensions.Tests/GrpcServerEventsTests.cs)

## VB.NET Generic GrpcServiceClient TodoWorld Example

[![](/img/pages/grpc/vb-generic.png)](https://youtu.be/9XTy3eOdpHw)

::: info YouTube
[youtu.be/9XTy3eOdpHw](https://youtu.be/9XTy3eOdpHw)
:::

Install [x dotnet tool](/dotnet-tool):
    
:::sh
dotnet tool install --global x 
:::

Create a new VB.NET App:

:::sh
dotnet new console -lang vb
:::

Add [ServiceStack.GrpcClient](https://www.nuget.org/packages/ServiceStack.GrpcClient) NuGet Package:

:::sh
dotnet add package ServiceStack.GrpcClient
:::

Add TodoWorld DTOs:

:::sh
x vb https://todoworld.servicestack.net
:::
    
Use TodoWorld DTOs with generic `GrpcServiceClient` to call TodoWorld gRPC Service:

### VB.NET gRPC insecure Example

```vb
Imports System
Imports System.Collections.Generic
Imports System.Threading.Tasks
Imports ServiceStack
Imports TodoWorld.ServiceModel

Module Program

    Async Function Todo() As Task
        ProtoBuf.Grpc.Client.GrpcClientFactory.AllowUnencryptedHttp2 = true
        Dim client = new GrpcServiceClient("http://todoworld.servicestack.net:5054")
        
        Dim response = Await client.GetAsync(New Hello With { .Name = "gRPC VB.NET" })

        Console.WriteLine(response.Result)
    End Function

    Sub Main(args As String())
        Task.WaitAll(Todo())
    End Sub

End Module
```

Override `Program.vb` with the above VB.NET Example: 

:::sh
npx add-in todoworld-vb
:::

Run example:

:::sh
dotnet run
:::

### VB.NET gRPC SSL Example

```vb
Imports System
Imports System.Collections.Generic
Imports System.Threading.Tasks
Imports System.Security.Cryptography.X509Certificates
Imports ServiceStack
Imports TodoWorld.ServiceModel

Module Program

    Async Function Todo() As Task
        Dim client = new GrpcServiceClient("https://todoworld.servicestack.net:50051", 
                new X509Certificate2("https://todoworld.servicestack.net/grpc.crt".GetBytesFromUrl()), 
                GrpcUtils.AllowSelfSignedCertificatesFrom("todoworld.servicestack.net"))
        
        Dim response = Await client.GetAsync(New Hello With { .Name = "gRPC VB.NET" })

        Console.WriteLine(response.Result)
    End Function

    Sub Main(args As String())
        Task.WaitAll(Todo())
    End Sub

End Module
```

Override `Program.vb` with the above VB.NET Example: 

:::sh
npx add-in todoworld-vb-ssl
:::

Run example:

:::sh
dotnet run
:::

### VB.NET Local Development gRPC SSL CRUD Example

```vb
Imports System
Imports System.Collections.Generic
Imports System.Threading.Tasks
Imports ServiceStack
Imports TodoWorld.ServiceModel
Imports TodoWorld.ServiceModel.Types

Module Program
    Function SeqCount(c As List(Of Todo)) As Integer
        Return IF(c Is Nothing, 0, c.Count)
    End Function
    
    Async Function TodoExample() As Task
        ' Certificate registration not required when using trusted local development certificate  
        Dim client = new GrpcServiceClient("https://localhost:5001")
        Await client.PostAsync(New ResetTodos())

        'GET /todos
        Dim all = Await client.GetAsync(New GetTodos())
        Console.WriteLine($"todos: {SeqCount(all.Results)}")

        'POST /todos
        Dim todo As Todo = (Await client.PostAsync(New CreateTodo With { .Title = "ServiceStack" })).Result
        Console.WriteLine($"new todo Id: {todo.Id}, Title: {todo.Title}")
            
        'GET /todos/1
        todo = (Await client.GetAsync(New GetTodo With { .Id = todo.Id })).Result
        Console.WriteLine($"get todo Id: {todo.Id}, Title: {todo.Title}")

        'GET /todos
        all = await client.GetAsync(new GetTodos())
        Console.WriteLine($"todos: {SeqCount(all.Results)}")

        'PUT /todos/1
        Await client.PutAsync(New UpdateTodo With { .Id = todo.Id, .Title = "gRPC" })

        'GET /todos/1
        todo = (Await client.GetAsync(New GetTodo With { .Id = todo.Id })).Result
        Console.WriteLine("updated todo Title: {todo.Title}")

        'DELETE /todos/1
        Await client.DeleteAsync(new DeleteTodo With { .Id = todo.Id })

        'GET /todos
        all = Await client.GetAsync(new GetTodos())
        Console.WriteLine($"todos: {SeqCount(all.Results)}")
        
    End Function
    
    Sub Main(args As String())
        Task.WaitAll(TodoExample())
    End Sub
    
End Module
```

Refer to [/clients/vb-generic](https://github.com/NetCoreApps/todo-world/tree/master/clients/vb-generic)
for a complete example project.


## F# Generic GrpcServiceClient TodoWorld Example

[![](/img/pages/grpc/fsharp-generic.png)](https://youtu.be/y3MBaapcN-0)

::: info YouTube
[youtu.be/y3MBaapcN-0](https://youtu.be/y3MBaapcN-0)
:::

Install [x dotnet tool](/dotnet-tool):
    
:::sh
dotnet tool install --global x
:::

Create a new F# App:

:::sh
dotnet new console -lang f#
:::

Add [ServiceStack.GrpcClient](https://www.nuget.org/packages/ServiceStack.GrpcClient) NuGet Package:

:::sh
dotnet add package ServiceStack.GrpcClient
:::

Add [TaskBuilder.fs](https://www.nuget.org/packages/TaskBuilder.fs) NuGet Package

:::sh
dotnet add package TaskBuilder.fs
:::

Add TodoWorld DTOs:

:::sh
x fsharp https://todoworld.servicestack.net
:::

Register `dto.fs` source file to `*.fsproj`:

```xml
<ItemGroup>
    <Compile Include="dtos.fs"/>
    <Compile Include="Program.fs"/>
</ItemGroup>
```
    
Use TodoWorld DTOs with generic `GrpcServiceClient` to call TodoWorld gRPC Service:

### F# gRPC insecure Example

```fsharp
open System
open System.Threading
open System.Threading.Tasks
open ServiceStack
open TodoWorld.ServiceModel
open FSharp.Control.Tasks.V2

let todo () = 
    task {
        ProtoBuf.Grpc.Client.GrpcClientFactory.AllowUnencryptedHttp2 = true
        let client = new GrpcServiceClient("http://todoworld.servicestack.net:5054")
        
        let! response = client.GetAsync(new Hello(Name = "gRPC F#"))
        printfn "%s" response.Result
    }

[<EntryPoint>]
let main argv =
    todo().Wait()
    0
```

Override `Program.fs` with the above F# Example: 

    $ npx add-in todoworld-fs

Run example:

    $ dotnet run

### F# gRPC SSL Example

```fsharp
open System
open System.Threading
open System.Threading.Tasks
open System.Security.Cryptography.X509Certificates
open ServiceStack
open TodoWorld.ServiceModel
open FSharp.Control.Tasks.V2

let todo () = 
    task {
        let client = new GrpcServiceClient("https://todoworld.servicestack.net:50051", 
                new X509Certificate2("https://todoworld.servicestack.net/grpc.crt".GetBytesFromUrl()), 
                GrpcUtils.AllowSelfSignedCertificatesFrom("todoworld.servicestack.net"))
        
        let! response = client.GetAsync(new Hello(Name = "gRPC F#"))
        printfn "%s" response.Result
    }

[<EntryPoint>]
let main argv =
    todo().Wait()
    0
```

Override `Program.fs` with the above F# Example:

:::sh
npx add-in todoworld-fs-ssl
:::

Run example:

:::sh
dotnet run
:::

### F# Local Development gRPC SSL CRUD Example

```fsharp
open System
open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open ServiceStack
open TodoWorld.ServiceModel
open FSharp.Control.Tasks.V2

let todo () = 
    let seqCount (c: List<Todo>) = if c <> null then c.Count else 0    
    task {
        // Certificate registration not required when using trusted local development certificate  
        let client = new GrpcServiceClient("https://localhost:5001")
        do! client.PostAsync(new ResetTodos())

        //POST /todos
        let! t = client.PostAsync(new CreateTodo(Title = "ServiceStack"))
        let todo = t.Result;
        printfn "new todo Id: %i, Title: %s" todo.Id todo.Title

        //GET /todos
        let! all = client.GetAsync(new GetTodos())
        printfn "todos: %i" (seqCount all.Results)
        
        //GET /todos/1
        let! t = client.GetAsync(new GetTodo(Id = todo.Id))
        let todo = t.Result;
        printfn "get todo Id: %i, Title: %s" todo.Id todo.Title

        //GET /todos
        let! all = client.GetAsync(new GetTodos())
        printfn "todos: %i" (seqCount all.Results)
        
        //PUT /todos/1
        do! client.PutAsync(new UpdateTodo(Id = todo.Id, Title = "gRPC"))

        //GET /todos/1
        let! t = client.GetAsync(new GetTodo(Id = todo.Id))
        let todo = t.Result;
        printfn "updated todo Title: %s" todo.Title

        //DELETE /todos/1
        do! client.DeleteAsync(new DeleteTodo(Id = todo.Id))

        //GET /todos
        let! all = client.GetAsync(new GetTodos())
        printfn "todos: %i" (seqCount all.Results)
    }

[<EntryPoint>]
let main argv =
    todo().Wait()
    0
```

Refer to [/clients/fsharp-generic](https://github.com/NetCoreApps/todo-world/tree/master/clients/fsharp-generic)
for a complete example project.
