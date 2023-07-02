---
slug: vbnet-add-servicestack-reference
title: VB.NET Add ServiceStack Reference
---

![VB.NET Header](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/vb-header.png)

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types from directly within VS.NET using [ServiceStackVS VS.NET Extension](/create-your-first-webservice) - providing a simpler, cleaner and more versatile alternative to WCF's Add Service Reference feature that's built into VS.NET.

The article outlines ServiceStack's support generating VB.Net DTO's - providing a flexible alternative than sharing your compiled DTO .NET assembly with clients. Now VB.Net clients can easily add a reference to a remote ServiceStack instance and update typed DTO's directly from within VS.NET - reducing the burden and effort required to consume ServiceStack Services whilst benefiting from clients native language strong-typing feedback. 

## [Add ServiceStack Reference](/add-servicestack-reference)

The easiest way to Add a ServiceStack reference to your project is to right-click on your project to bring up [ServiceStackVS's](/create-your-first-webservice) `Add ServiceStack Reference` context-menu item. This opens a dialog where you can add the url of the ServiceStack instance you want to typed DTO's for, as well as the name of the DTO source file that's added to your project.

[![Add ServiceStack Reference](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/apps/StackApis/add-service-ref-flow.png)](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/apps/StackApis/add-service-ref-flow.png)

After clicking OK, the servers DTO's and [ServiceStack.Client](https://www.nuget.org/packages/ServiceStack.Client) NuGet package are added to the project, providing an instant typed API:
![VB.Net Console client](https://github.com/ServiceStack/Assets/raw/master/img/apps/StackApis/call-service-vb.png)

With the VB.Net code generated on the Server, the role of [ServiceStackVS's](/create-your-first-webservice) **Add ServiceStack Reference** is there just to integrate the remote VB.Net DTO's into the clients VS.NET project. This is just getting the generated DTOs from the server with default options set by the server and adding them locally to your project within Visual Studio.

![Add VB.Net ServiceStack Reference Demo](https://github.com/ServiceStack/Assets/raw/master/img/servicestackvs/servicestack%20reference/addref-vbnet.gif)

## Update ServiceStack Reference

If your server has been updated and you want to update to client DTOs, simply right-click on the DTO file within VS.NET and select `Update ServiceStack Reference`. 

![VBNet update demo](https://github.com/ServiceStack/Assets/raw/master/img/servicestackvs/servicestack%20reference/updateref-vbnet.gif)

### Simple Usage Example

Async Example:

```vb
Dim client = New JsonServiceClient("https://techstacks.io")

Dim response = Await client.SendAsync(New AppOverview())
response.PrintDump()
```

Sync Example:

```vb
Dim client = New JsonServiceClient("https://techstacks.io")

Dim response = client.Send(New AppOverview())
response.PrintDump()
```

## DTO Customization Options 

The header comments in the generated DTO's allows for further customization of how they're generated where ServiceStackVS automatically watches for any file changes and updates the generated DTO's with any custom Options provided. Options that are preceded by a VB.Net Class comment `'''` are defaults from the server that can be overridden, e.g:

```vb
' Options:
'Date: 2014-10-21 00:45:05
'Version: 1
'BaseUrl: https://stackapis.netcore.io
'
'''MakePartial: True
'''MakeVirtual: True
'''MakeDataContractsExtensible: False
'''AddReturnMarker: True
'''AddDescriptionAsComments: True
'''AddDataContractAttributes: False
'''AddIndexesToDataMembers: False
'''AddGeneratedCodeAttributes: False
'''AddResponseStatus: False
'''AddImplicitVersion: 
'''InitializeCollections: True
'''AddDefaultXmlNamespace: http://schemas.servicestack.net/types
```

To override these options on the client, the comment has to be changed to start with a single `'` instead of triple `'''`. This convention is due to VB.Net not having block quotes. For example, if we did't want our classes to be partial by default for the VB.Net client, our options would look like below.

```vb
' Options:
'Date: 2014-10-21 00:45:05
'Version: 1
'BaseUrl: https://stackapis.netcore.io
'
'MakePartial: False
'''MakeVirtual: True
'''MakeDataContractsExtensible: False
'''AddReturnMarker: True
'''AddDescriptionAsComments: True
'''AddDataContractAttributes: False
'''AddIndexesToDataMembers: False
'''AddGeneratedCodeAttributes: False
'''AddResponseStatus: False
'''AddImplicitVersion: 
'''InitializeCollections: True
'''ExportValueTypes: False
'''IncludeTypes: 
'''ExcludeTypes: 
'''AddNamespaces: 
'''AddDefaultXmlNamespace: http://schemas.servicestack.net/types
```
Options that do not start with a `'''` are sent to the server to override any defaults set by the server.

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in CSharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.MakeVirtual = false;
...
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### MakePartial

Adds the `partial` modifier to all types, letting you extend generated DTO's with your own class separate from the generated types:

```vb
Public Partial Class GetAnswers
```

### MakeVirtual

Adds the `virtual` modifier to all properties:

```vb
Public Partial Class GetAnswers
    ...
    Public Overridable Property QuestionId As Integer
End Class
```

### MakeDataContractsExtensible

Add .NET's DataContract's [ExtensionDataObject](http://msdn.microsoft.com/en-us/library/system.runtime.serialization.extensiondataobject(v=vs.110).aspx) to all DTO's:

```vb
Public Partial Class Hello
            ...
    Implements IExtensibleDataObject
            ...
    Public Overridable Property ExtensionData As ExtensionDataObject Implements IExtensibleDataObject.ExtensionData
End Class
```

### AddReturnMarker

AddReturnMarker annotates Request DTO's with an `IReturn(Of T)` marker referencing the Response type ServiceStack infers your Service to return:

```vb
Public Partial Class GetAnswers
    Implements IReturn(Of GetAnswersResponse)
``` 

> Original DTO doesn't require a return marker as response type can be inferred from Services return type or when using the `%Response` DTO Naming convention

### AddDescriptionAsComments

Converts any textual Description in `<Description>` attributes as VB.Net class Doc comments which allows your API to add intellisense in client projects:

```vb
'''<Summary>
'''Get a list of Answers for a Question
'''</Summary>
Public Class GetAnswers
```

### AddDataContractAttributes

Decorates all DTO types with `<DataContract>` and properties with `<DataMember>` as well as adding default XML namespaces for all VB.Net namespaces used:

```vb
<Assembly: ContractNamespace("http://schemas.servicestack.net/types", ClrNamespace:="StackApis.ServiceModel.Types")>
<Assembly: ContractNamespace("http://schemas.servicestack.net/types", ClrNamespace:="StackApis.ServiceModel")>
...
<DataContract>
Partial Public Class GetAnswers
    Implements IReturn(Of GetAnswersResponse)
    <DataMember>
    Public Overridable Property QuestionId As Integer
End Class
```

### AddIndexesToDataMembers

Populates a DataMember Order index for all properties:

```vb
<DataContract>
Public Partial Class GetAnswers
    ...
    <DataMember(Order:=1)>
    Public Overridable Property QuestionId As Integer
End Class
```

> Requires **AddDataContractAttributes=true**

### AddGeneratedCodeAttributes

Emit `<GeneratedCode>` attribute on all generated Types:

```vb
<GeneratedCode>
Public Partial Class GetAnswers ...
```

### AddResponseStatus

Automatically add a `ResponseStatus` property on all Response DTO's, regardless if it wasn't already defined:

```vb
Public Partial Class GetAnswers
    ...
    Public Overridable Property ResponseStatus As ResponseStatus
End Class
```

### AddImplicitVersion

Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client: 

```vb
Public Partial Class GetAnswers
    Public Overridable Property Version As Integer
    Public Sub New()
                Version = 1
    End Sub
    ...
End Class
```

This lets you know what Version of the Service Contract that existing clients are using making it easy to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### InitializeCollections

Lets you automatically initialize collections in Request DTO's:

```vb
Public Partial Class SearchQuestions
    Public Sub New()
        Tags = New List(Of String)
    End Sub
    Public Overridable Property Tags As List(Of String)
    ...
}
```

### IncludeTypes
Is used as a Whitelist that can be used to specify only the types you would like to have code-generated:
```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```
Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's, e.g:

```vb
Public Partial Class GetTechnology ...
Public Partial Class GetTechnologyResponse ...
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

### ExcludeTypes
Is used as a Blacklist where you can specify which types you would like to exclude from being generated:
```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```
Will exclude `GetTechnology` and `GetTechnologyResponse` DTO's from being generated.

### AddNamespaces

Include additional VB.NET namespaces, e.g:

```
' Options:
'AddNamespaces: System.Drawing,MyApp
```

Where it will generate the specified namespaces in the generated Types:

```csharp
Imports System.Drawing
Imports MyApp
```

### AddDefaultXmlNamespace

This lets you change the default DataContract XML namespace used for all namespaces:

```csharp
<Assembly: ContractNamespace("http://my.types.net", ClrNamespace:="StackApis.ServiceModel.Types")>
<Assembly: ContractNamespace("http://my.types.net", ClrNamespace:="StackApis.ServiceModel")>
```

> Requires AddDataContractAttributes=true
