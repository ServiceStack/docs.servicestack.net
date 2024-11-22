---
title: Swift Add ServiceStack Reference 
---

![Swift iOS, XCode and macOS Banner](/img/pages/servicestack-reference/swift-logo-banner.jpg)

## Swift

ServiceStack's **Add ServiceStack Reference** feature lets iOS/macOS developers easily generate an native 
typed Swift API for your ServiceStack Services using the `x` dotnet command-line tool.

## Simple command-line utils for ServiceStack

The [x dotnet tool](/dotnet-tool) provides a simple command-line UX to easily Add and Update Swift ServiceStack References.

Prerequisites: Install [.NET Core](https://dotnet.microsoft.com/download).

```bash
$ dotnet tool install --global x 
```

This will make the `x` dotnet tool available in your `$PATH` which can now be used from within a **Terminal window** at your Xcode project folder.

To use the latest `JsonServiceClient` you'll need to add a reference to ServiceStack Swift library using your preferred package manager:

### Xcode

From Xcode 12 the Swift Package Manager is built into Xcode.

Go to **File** > **Swift Packages** > **Add Package Dependency**:

![](/img/pages/dev/xcode-swift-add-package.png)

Add a reference to the ServiceStack.Swift GitHub repo:

https://github.com/ServiceStack/ServiceStack.Swift

![](/img/pages/dev/xcode-add-servicestack-swift.png)

After adding the dependency both [ServiceStack.Swift](https://github.com/ServiceStack/ServiceStack.Swift) and its 
[PromiseKit](https://github.com/mxcl/PromiseKit) dependency will be added to your project:

![](/img/pages/dev/xcode-servicestack-swift-added.png)

#### CocoaPods

In your [Podfile](https://guides.cocoapods.org/syntax/podfile.html):

```ruby
use_frameworks!

# Pods for Project
pod "ServiceStack", '~> 1.1'
```

#### Carthage

```ruby
github "ServiceStack/ServiceStack.Swift" ~> 1.1
```

#### SwiftPM

```swift
dependencies: [
    .package(url: "https://github.com/ServiceStack/ServiceStack.Swift", from: "1.0.0"),
],
```

### Simple Usage Example

Async usage example:

```swift
import ServiceStack

client.getAsync(AppOverview())
    .done { r in
        r.topTechnologies.count //= 100
        //... 
    }
```

Sync usage example:

```swift
import ServiceStack

let client = JsonServiceClient(baseUrl: "https://techstacks.io")
let response = client.get(AppOverview())
```

### Add a new ServiceStack Reference

To Add a new ServiceStack Reference, call `x swift` with the Base URL to a remote ServiceStack instance:

```bash
$ x swift {BaseUrl}
$ x swift {BaseUrl} {FileName}
```

Where if no FileName is provided, it's inferred from the host name of the remote URL, e.g:

```bash
$ x swift https://techstacks.io
```

Downloads the Typed Swift DTOs for [techstacks.io](https://techstacks.io) and saves them to `dtos.swift`. 

Alternatively you can have it saved to a different FileName with:

```bash
$ x swift https://techstacks.io TechStacks
```

Which instead saves the DTOs to `dtos.swift`.

`x swift` also downloads [ServiceStack's Swift Client](https://github.com/ServiceStack/ServiceStack.Swift) 
and saves it to `JsonServiceClient.swift` which together with the Server DTOs contains all the dependencies 
required to consume Typed Web Services in Swift.

#### Update an existing ServiceStack Reference

The easiest way to update all your Swift Server DTOs is to just call `x swift` without any arguments:

```bash
$ x swift
```

This will go through and update all your `*.dtos.swift` Service References.

To Update a specific ServiceStack Reference, call `x swift` with the Filename:

```bash
$ x swift {FileName.dtos.swift}
```

As an example, you can Update the Server DTOs added in the previous command with:

```bash
$ x swift dtos.swift
```

Which also includes any 
[Customization Options](/swift-add-servicestack-reference#swift-configuration) 
that were manually added.

## Swift Server Configuration

The Swift defaults are overridable on the ServiceStack Server by modifying the default config on the 
`NativeTypesFeature` Plugin, e.g:

```csharp
var typesConfig = this.GetPlugin<NativeTypesFeature>().MetadataTypesConfig;
typesConfig.AddResponseStatus = true;
```

More Swift-specific configuration is available on the `SwiftGenerator` class itself, e.g:

```csharp
SwiftGenerator.DefaultImports.Add("UIKit");
```

## Swift Configuration

The header comments in the generated DTO's allows for further customization of how the DTO's are generated which can then be updated with any custom Options provided using the **Update ServiceStack Reference** Menu Item in XCode. Options that are preceded by a Swift single line comment `//` are defaults from the server that can be overridden, e.g:

```swift
/* Options:
Date: 2017-02-02 02:41:09
SwiftVersion: 3.0
Version: 4.55
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://techstacks.io

//BaseClass: 
//AddModelExtensions: True
//AddServiceStackTypes: True
//IncludeTypes: 
//ExcludeTypes: 
//ExcludeGenericBaseTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//InitializeCollections: True
//DefaultImports: Foundation
*/
```

To override a value, remove the `//` and specify the value to the right of the `:`. Any value uncommented will be sent to the server to override any server defaults.

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### BaseClass
Specify a base class that's inherited by all Swift DTO's, e.g. to enable [Key-Value Observing (KVO)](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/KeyValueObserving/KeyValueObserving.html) in the generated DTO models have all types inherit from `NSObject`:

```
/* Options:
BaseClass: NSObject
```

Will change all DTO types to inherit from `NSObject`:

```swift
public class UserInfo : NSObject { ... }
```

### AddModelExtensions
Remove the the code-generated type extensions required to support typed JSON serialization of the Swift types and leave only the clean Swift DTO Type definitions.

```
/* Options:
AddModelExtensions: False
```

### AddServiceStackTypes
Don't generate the types for built-in ServiceStack classes and Services like `ResponseStatus` and `Authenticate`, etc.

```
/* Options:
AddServiceStackTypes: False
```

### IncludeTypes
Is used as a Whitelist that can be used to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's:

```swift
public class GetTechnology { ... }
public class GetTechnologyResponse { ... }
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

### ExcludeGenericBaseTypes

Work around a [regression added in Swift 1.2](https://github.com/ServiceStack/ServiceStack/blob/master/docs/2015/release-notes.md#swift-native-types-upgraded-to-swift-12) where the Swift compiler segfaults trying to compile Extensions to Types with a Generic Base Class. You can omit the problematic Generic Base Types from being generated with:

```swift
ExcludeGenericBaseTypes: True
```

Any types that were omitted from the generated DTO's will be emitted in comments, using the format:

```swift
//Excluded: {TypeName}
```

### AddResponseStatus
Automatically add a `ResponseStatus` property on all Response DTO's, regardless if it wasn't already defined:

```
/* Options:
AddResponseStatus: True
```

Will add a `ResponseStatus` property to all Response DTO's:

```swift
public class GetAllTechnologiesResponse
{
    ...
    public var responseStatus:ResponseStatus
}
```

### AddImplicitVersion
Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client: 

```
/* Options:
AddImplicitVersion: 1
```

Will add an initialized `version` property to all Request DTO's:

```swift
public class GetAllTechnologies : IReturn
{
    ...
    public var version:Int = 1
}
```

This lets you know what Version of the Service Contract that existing clients are using making it easy to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### InitializeCollections
Whether enumerables should be initialized with an empty collection (default) or changed to use an Optional type:

```
/* Options:
InitializeCollections: False
```

Changes Collection Definitions to be declared as Optional Types instead of being initialized with an empty collection:

```swift
public class ResponseStatus
{
    public var errors:[ResponseError]?
}
```

### DefaultImports
Add additional import statements to the generated DTO's:

```
/* Options:
DefaultImports: UIKit,Foundation
```

Will import the `UIKit` and `Foundation` frameworks:

```swift
import UIKit;
import Foundation;
```

### Swift style enums

You can override code-generation to emit Swift Style **camelCase** enums in your AppHost with:

```csharp
SwiftGenerator.EnumNameStrategy = SwiftGenerator.SwiftStyleEnums;
```

## Swift Client Usage

### [JsonServiceClient.swift](https://github.com/ServiceStack/ServiceStack.Swift/blob/master/dist/JsonServiceClient.swift)

The same ideal, high-level API available in [.NET's ServiceClients](/csharp-client) have been translated into idiomatic Swift as seen with its `ServiceClient` protocol definition below:

```swift
public protocol ServiceClient
{
    func get(request:T) throws -> T.Return
    func get(request:T) throws -> Void
    func get(request:T, query:[String:String]) throws -> T.Return
    func get(relativeUrl:String) throws -> T
    func getAsync(request:T) -> Promise<T.Return>
    func getAsync(request:T) -> Promise<Void>
    func getAsync(request:T, query:[String:String]) -> Promise<T.Return>
    func getAsync(relativeUrl:String) -> Promise<T>
    
    func post(request:T) throws -> T.Return
    func post(request:T) throws -> Void
    func post(relativeUrl:String, request:Request?) throws -> Response
    func postAsync(request:T) -> Promise<T.Return>
    func postAsync(request:T) -> Promise<Void>
    func postAsync(relativeUrl:String, request:Request?) -> Promise<Response>
    
    func put(request:T) throws -> T.Return
    func put(request:T) throws -> Void
    func put(relativeUrl:String, request:Request?) throws -> Response
    func putAsync(request:T) -> Promise<T.Return>
    func putAsync(request:T) -> Promise<Void>
    func putAsync(relativeUrl:String, request:Request?) -> Promise<Response>
    
    func delete(request:T) throws -> T.Return
    func delete(request:T) throws -> Void
    func delete(request:T, query:[String:String]) throws -> T.Return
    func delete(relativeUrl:String) throws -> T
    func deleteAsync(request:T) -> Promise<T.Return>
    func deleteAsync(request:T) -> Promise<Void>
    func deleteAsync(request:T, query:[String:String]) -> Promise<T.Return>
    func deleteAsync(relativeUrl:String) -> Promise<T>
    
    func patch(request:T) throws -> T.Return
    func patch(request:T) throws -> Void
    func patch(relativeUrl:String, request:Request?) throws -> Response
    func patchAsync(request:T) -> Promise<T.Return>
    func patchAsync(request:T) -> Promise<Void>
    func patchAsync(relativeUrl:String, request:Request?) -> Promise<Response>
    
    func send(request:T) throws -> T.Return
    func send(request:T) throws -> Void
    func send(intoResponse:T, request:NSMutableURLRequest) throws -> T
    func sendAsync(intoResponse:T, request:NSMutableURLRequest) -> Promise<T>
    
    func getData(url:String) throws -> NSData
    func getDataAsync(url:String) -> Promise<NSData>
}
```

> Generic type constraints omitted for readability

The minor differences are primarily due to differences in Swift which instead of throwing Exceptions uses error codes and `Optional` return types and its lack of any asynchrony language support led us to embed a lightweight and [well-documented Promises](http://promisekit.org/introduction/) implementation in [PromiseKit](https://github.com/mxcl/PromiseKit) which closely matches the `Task<T>` type used in .NET Async API's.

### JsonServiceClient Usage

If you've ever had to make HTTP requests using Objective-C's `NSURLConnection` or `NSURLSession` static classes in iOS or macOS, you'll appreciate the typing benefits and productivity offered by the higher-level API's in `JsonServiceClient` - which enable the same ideal client API's we've enjoyed in ServiceStack's .NET Clients, in Swift Apps! 

::: info Tip
A nice benefit of using JsonServiceClient over static classes is that Service calls can be easily substituted and mocked with the above `ServiceClient` protocol, making it easy to test or stub out the external Gateway calls whilst the back-end is under development.
:::

To illustrate its usage we'll go through some client code to consume [TechStacks](https://github.com/ServiceStackApps/TechStacks) Services after adding a **ServiceStack Reference** to `http://techstaks.io`:

```swift
var client = JsonServiceClient(baseUrl: "https://techstacks.io")
var response = client.get(AppOverview())
```

Essentially usage is the same as it is in .NET ServiceClients - where it just needs the `baseUrl` of the remote ServiceStack instance, which can then be used to consume remote Services by sending typed Request DTO's that respond in kind with the expected Response DTO.

### Async API Usage

Whilst the sync API's are easy to use their usage should be limited in background threads so they're not blocking the Apps UI whilst waiting for responses. Most of the time when calling services from the Main UI thread you'll want to use the non-blocking async API's, which for the same API looks like:

```swift
client.getAsync(AppOverview())
    .done { 
        $0.topTechnologies.count //= 100
        //... 
    }
```

Swift also lets you continue marking it up with explicit Type Information and optional syntax as preferred, e.g: 

```swift
client.getAsync(AppOverview())
    .done({ (r:AppOverviewResponse) in
        r.topTechnologies.count //= 100
        //... 
    })
```

Which is very similar to how we'd make async `Task<T>` calls in C# when not using its async/await language syntax sugar. 

::: info
Async callbacks are called back on the main thread, ideal for use in iOS Apps. This behavior is also configurable in the Promise's callback API.
:::

### Typed Error Handling

As Swift doesn't provide `try/catch` Exception Handling, Error handling is a little different in Swift which for most failable API's just returns a `nil` Optional to indicate when the operation didn't succeed. When more information about the error is required, API's will typically accept an additional `NSError` pointer argument to populate with more information about the error. Any additional metadata can be attached to NSError's `userInfo` Dictionary. We also follow this same approach to provide our structured error handling in `JsonServiceClient`.

To illustrate exception handling we'll connect to ServiceStack's Test Services and call the `ThrowType` Service to intentionally throw the error specified, e.g:

#### Sync Error Handling

Handling a Single C# Exception:

```swift
var client = JsonServiceClient(baseUrl: "https://test.servicestack.net")

var request = ThrowType()
request.type = "NotFound"
request.message = "custom message"

do {
    let response = client.post(request)
} catch var error as NSError {
    error.code //= 404
    //Convert into typed ResponseStatus
    var status:ResponseStatus = error.convertUserInfo() 
    status.message //= not here
    status.stackTrace //= Server Stack Trace
}
```

Handling a Validation Exception with multiple field validation errors:

```swift
let client = JsonServiceClient(baseUrl: "https://test.servicestack.net")

let request = ThrowValidation()
request.email = "invalidemail"

do {
    let response = try client.post(request)
} catch let responseError as NSError {    
    let status:ResponseStatus = responseError.convertUserInfo()!
    status.errors.count //= 3
    let field1 = status.errors[0]
    
    field1.errorCode! //= InclusiveBetween
    field1.fieldName! //= Age
    field1.message!   //= 'Age' must be between 1 and 120. You entered 0.
}
```

#### Async Error Handling

To handle errors in Async API's we just add a callback on `.error()` API on the returned Promise, e.g:

```swift
let request = ThrowValidation()
request.email = "invalidemail"

client.postAsync(request)
    .error { responseError in
        let status:ResponseStatus = responseError.convertUserInfo()!
        status.errors.count //= 3
        //...
    }

```

### JsonServiceClient Error Handlers

Just like in .NET, we can also attach Global or instance error handlers to be able to generically handle all Service Client errors with a custom handler, e.g:

```swift
client.onError = {(e:NSError) in ... }
JsonServiceClient.Global.onError = {(e:NSError) in ... }
```

### Swift HTTP Marker Interfaces

The new `send*` API's take advantage of the HTTP Verb Interface Markers described below to send the Request DTO using the 
annotated HTTP Method, e.g:

```swift
public class HelloByGet : IReturn, IGet 
{
    public typealias Return = HelloResponse
    public var name:String?
}
public class HelloByPut : IReturn, IPut 
{
    public typealias Return = HelloResponse
    public var name:String?
}

let response = try client.send(HelloByGet())  //GET

client.sendAsync(HelloByPut())                //PUT
    .done { }
```

### Custom Routes

As Swift doesn't support Attributes any exported .NET Attributes are emitted in comments on the Request DTO they apply to, e.g:

```swift
// @Route("/technology/{Slug}")
public class GetTechnology : IReturn { ... }
```

This also means that the Custom Routes aren't used when making Service Requests and instead just uses ServiceStack's built-in [pre-defined routes](/routing#pre-defined-routes). 

But when preferred `JsonServiceClient` can also be used to call Services using Custom Routes, e.g:

```swift
var response:GetTechnologyResponse? = client.get("/technology/servicestack")
```

::: info
the explicit type definition on the return type is required here as Swift uses it as part of the generic method invocation.
:::

### JsonServiceClient Options

Other options that can be configured on JsonServiceClient include:

```swift
client.onError = {(e:NSError) in ... }
client.timeout = ...
client.cachePolicy = NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData
client.requestFilter = {(req:NSMutableURLRequest) in ... }
client.responseFilter = {(res:NSURLResponse) in ... }

//static Global configuration
JsonServiceClient.Global.onError = {(e:NSError) in ... }
JsonServiceClient.Global.requestFilter = {(req:NSMutableURLRequest) in ... }
JsonServiceClient.Global.responseFilter = {(res:NSURLResponse) in ... }
```

## [TechStacks iOS App](https://github.com/ServiceStackApps/TechStacksApp)

To illustrate the ease-of-use and utility of ServiceStack's new Swift support you can checkout the 
TechStacks native iOS App for [techstacks.io](https://techstacks.io) that has been recently published and is 
now available to download for free on the AppStore:

[![TechStacks on AppStore](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/techstacks-appstore.png)](https://itunes.apple.com/us/app/techstacks/id965680615?ls=1&mt=8)

The complete source code for the [TechStacks App is available on GitHub](https://github.com/ServiceStackApps/TechStacks) - providing a good example on how easy it is to take advantage of ServiceStack's Swift support to quickly build a rich and responsive Services-heavy native iOS App. 

All remote Service Calls used by the App are encapsulated into a single [AppData.swift](https://github.com/ServiceStackApps/TechStacksApp/blob/master/src/TechStacks/AppData.swift) class and only uses JsonServiceClient's non-blocking Async API's to ensure a Responsive UI is maintained throughout the App.

### MVC and Key-Value Observables (KVO)

If you've ever had to implement `INotifyPropertyChanged` in .NET, you'll find the built-in model binding capabilities in iOS/macOS a refreshing alternative thanks to Objective-C's underlying `NSObject` which automatically generates change notifications for its KV-compliant properties. UIKit and Cocoa frameworks both leverage this feature to enable its [Model-View-Controller Pattern](https://developer.apple.com/library/mac/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html). 

As keeping UI's updated with Async API callbacks can get unwieldy, we wanted to go through how we're taking advantage of NSObject's KVO support in Service Responses to simplify maintaining dynamic UI's.

### Enable Key-Value Observing in Swift DTO's

Firstly to enable KVO in your Swift DTO's we'll want to have each DTO inherit from `NSObject` which can be done by uncommenting `BaseObject` option in the header comments as seen below:

```
/* Options:
Date: 2015-02-19 22:43:04
Version: 1
BaseUrl: https://techstacks.io

BaseClass: NSObject
...
*/
```
and click the **Update ServiceStack Reference** Menu Option to fetch the updated DTO's.

Then to [enable Key-Value Observing](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/AdoptingCocoaDesignPatterns.html#//apple_ref/doc/uid/TP40014216-CH7-XID_8) just mark the response DTO variables with the `dynamic` modifier, e.g:

```swift
public dynamic var allTiers:[Option] = []
public dynamic var overview:AppOverviewResponse = AppOverviewResponse()
public dynamic var topTechnologies:[TechnologyInfo] = []
public dynamic var allTechnologies:[Technology] = []
public dynamic var allTechnologyStacks:[TechnologyStack] = []
```

Which is all that's needed to allow properties to be observed as they'll automatically issue change notifications when they're populated in the Service response async callbacks, e.g:

```swift
func loadOverview() -> Promise<AppOverviewResponse> {
    return client.getAsync(AppOverview())
        .done { r in
            self.overview = r
            self.allTiers = r.allTiers
            self.topTechnologies = r.topTechnologies
            return r
        }
}

func loadAllTechnologies() -> Promise<GetAllTechnologiesResponse> {
    return client.getAsync(GetAllTechnologies())
        .done { r in
            self.allTechnologies = r.results
            return r
        }
}

func loadAllTechStacks() -> Promise<GetAllTechnologyStacksResponse> {
    return client.getAsync(GetAllTechnologyStacks())
        .done { r in
            self.allTechnologyStacks = r.results
            return r
        }
}
```

### Observing Data Changes

In your [ViewController](https://github.com/ServiceStackApps/TechStacksApp/blob/0fca564e8c06fd1b71f81faee93a2e04c70a219b/src/TechStacks/HomeViewController.swift) have the datasources for your custom views binded to the desired data (which will initially be empty):

```swift
func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return appData.allTiers.count
}
...
func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return appData.topTechnologies.count
}
```

Then in `viewDidLoad()` [start observing the properties](https://github.com/ServiceStack/ServiceStack.Swift/blob/67c5c092b92927702f33b6a0669e3aa1de0e2cdc/apps/TechStacks/TechStacks/HomeViewController.swift#L31) your UI Controls are bound to, e.g:

```swift
override func viewDidLoad() {
    ...
    self.appData.observe(self, properties: ["topTechnologies", "allTiers"])
    self.appData.loadOverview()
}
deinit { self.appData.unobserve(self) }
```

In the example code above we're using some custom [KVO helpers](https://github.com/ServiceStackApps/TechStacksApp/blob/0fca564e8c06fd1b71f81faee93a2e04c70a219b/src/TechStacks/AppData.swift#L159-L183) to keep the code required to a minimum.

With the observable bindings in place, the change notifications of your observed properties can be handled by overriding `observeValueForKeyPath()` which passes the name of the property that's changed in the `keyPath` argument that can be used to determine the UI Controls to refresh, e.g:

```swift
override func observeValueForKeyPath(keyPath:String, ofObject object:AnyObject, change:[NSObject:AnyObject],
  context: UnsafeMutablePointer<Void>) {
    switch keyPath {
    case "allTiers":
        self.technologyPicker.reloadAllComponents()
    case "topTechnologies":
        self.tblView.reloadData()
    default: break
    }
}
```

Now that everything's configured, the observables provide an alternative to manually updating UI elements within async callbacks, instead you can now fire-and-forget your async API's and rely on the pre-configured bindings to automatically update the appropriate UI Controls when their bounded properties are updated, e.g:

```swift
self.appData.loadOverview() //Ignore response and use configured KVO Bindings
```

### Images and Custom Binary Requests

In addition to greatly simplifying Web Service Requests, `JsonServiceClient` also makes it easy to fetch any custom HTTP response like Images and other Binary data using the generic `getData()` and `getDataAsync()` NSData API's. This is used in TechStacks to [maintain a cache of all loaded images](https://github.com/ServiceStackApps/TechStacksApp/blob/0fca564e8c06fd1b71f81faee93a2e04c70a219b/src/TechStacks/AppData.swift#L144), reducing number of HTTP requests and load times when navigating between screens:

```swift
var imageCache:[String:UIImage] = [:]

public func loadImageAsync(url:String) -> Promise<UIImage?> {
    if let image = imageCache[url] {
        return Promise<UIImage?> { (complete, reject) in complete(image) }
    }
    
    return client.getDataAsync(url)
        .done { (data:NSData) -> UIImage? in
            if let image = UIImage(data:data) {
                self.imageCache[url] = image
                return image
            }
            return nil
        }
}
```

## [TechStacks macOS Desktop App](https://github.com/ServiceStackApps/TechStacksDesktopApp)

As `JsonServiceClient.swift` has no external dependencies and only relies on core `Foundation` classes it 
can be used anywhere Swift can including macOS Cocoa Desktop and Command Line Apps and Frameworks.

Most of the API's used in TechStacks iOS App are standard typed Web Services calls. There is also a 
[TechStacks macOS Desktop](https://github.com/ServiceStackApps/TechStacksDesktopApp) 
available which showcases how easy it is to call ServiceStack's dynamic 
[AutoQuery Services](/autoquery/) and how much auto-querying functionality they can provide for free.

E.g. The TechStacks Desktop app is essentially powered with these 2 AutoQuery Services:

```csharp
[Query(QueryTerm.Or)] //change from filtering (default) to combinatory semantics
public class FindTechStacks : QueryBase<TechnologyStack> {}

[Query(QueryTerm.Or)]
public class FindTechnologies : QueryBase<Technology> {}
```

Basically just a Request DTO telling AutoQuery what Table we want to Query and that we want to [change the default Search behavior](/autoquery#changing-querying-behavior) to have **OR** semantics. We don't need to specify which properties we can query as the [implicit conventions](/autoquery#implicit-conventions) automatically infer it from the table being queried.

The TechStacks Desktop UI is then built around these 2 AutoQuery Services allowing querying against each field and utilizing a subset of the implicit conventions supported:

### Querying Technology Stacks

![TechStack Desktop Search Fields](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/techstacks-desktop-field.png)

### Querying Technologies

![TechStack Desktop Search Type](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/techstacks-desktop-type.png)

Like the TechStacks iOS App all Service Calls are maintained in a single [AppData.swift](https://github.com/ServiceStackApps/TechStacksDesktopApp/blob/master/src/TechStacksDesktop/AppData.swift) class and uses KVO bindings to update its UI which is populated from these 2 services below:

```swift
func searchTechStacks(query:String, field:String? = nil, operand:String? = nil)
  -> Promise<QueryResponse<TechnologyStack>> {
    self.search = query
    
    let queryString = query.count > 0 && field != nil && operand != nil
        ? [createAutoQueryParam(field!, operand!): query]
        : ["NameContains":query, "DescriptionContains":query]
    
    let request = FindTechStacks<TechnologyStack>()
    return client.getAsync(request, query:queryString)
        .done { (r:QueryResponse<TechnologyStack>) -> QueryResponse<TechnologyStack> in
            self.filteredTechStacks = r.results
            return r
        }
}

func searchTechnologies(query:String, field:String? = nil, operand:String? = nil)
  -> Promise<QueryResponse<Technology>> {
    self.search = query

    let queryString = query.count > 0 && field != nil && operand != nil
        ? [createAutoQueryParam(field!, operand!): query]
        : ["NameContains":query, "DescriptionContains":query]
    
    let request = FindTechnologies<Technology>()
    return client.getAsync(request, query:queryString)
        .done { (r:QueryResponse<Technology>) -> QueryResponse<Technology> in
            self.filteredTechnologies = r.results
            return r
        }
}

func createAutoQueryParam(field:String, _ operand:String) -> String {
    let template = autoQueryOperandsMap[operand]!
    let mergedField = template.replace("%", withString:field)
    return mergedField
}
```

Essentially employing the same strategy for both AutoQuery Services where it builds a query String parameter to send with the request. For incomplete queries, the default search queries both `NameContains` and `DescriptionContains` field conventions returning results where the Search Text is either in `Name` **OR** `Description` fields.

### [TechStacks Console App](https://github.com/ServiceStackApps/swift-techstacks-console)

In its quest to become a popular mainstream language, Swift includes a built-in Package Manager 
to simplify the maintenance, distribution and building of Swift code. Swift Package Manager can be used to
build native statically-linked modules or Console Apps but currently has no support for iOS, watchOS, 
or tvOS platforms.
 
Nevertheless it's simple console and text-based programming model provides a great way to quickly develop 
prototypes or Console-based Swift Apps like [swiftref](https://github.com/ServiceStack/swiftref) 
using your favorite text editor. To support this environment we've packaged ServiceStack's Swift Service 
clients into a **ServiceStackClient** package so it can be easily referenced in Swift PM projects.

Together with **Swift Add ServiceStack Reference** we now have a productive development workflow for 
building statically-linked native executables that consume Typed ServiceStack Services as seen in the new 
step-by-step guide below showing how to create a simple
[Swift TechStacks Console App](https://github.com/ServiceStackApps/swift-techstacks-console). 

## Swift Generated DTO Types

With Swift support our goal was to ensure a high-fidelity, idiomatic translation within the constraints of Swift language and built-in libraries, where the .NET Server DTO's are translated into clean Swift POSO's (Plain Old Swift Objects :) having their .NET built-in types mapped to their equivalent Swift data type. 

To see what this ended up looking like, we'll peel back behind the covers and look at a couple of the [Generated Swift Test Models](https://test.servicestack.net/types/swift) to see how they're translated in Swift:

```swift
public class AllTypes
{
    required public init(){}
    public var id:Int?
    public var nullableId:Int?
    public var byte:Int8?
    public var short:Int16?
    public var int:Int?
    public var long:Int64?
    public var uShort:UInt16?
    public var uInt:UInt32?
    public var uLong:UInt64?
    public var float:Float?
    public var double:Double?
    public var decimal:Double?
    public var string:String?
    public var dateTime:NSDate?
    public var timeSpan:NSTimeInterval?
    public var dateTimeOffset:NSDate?
    public var guid:String?
    public var char:Character?
    public var nullableDateTime:NSDate?
    public var nullableTimeSpan:NSTimeInterval?
    public var stringList:[String] = []
    public var stringArray:[String] = []
    public var stringMap:[String:String] = [:]
    public var intStringMap:[Int:String] = [:]
    public var subType:SubType?
}

public class AllCollectionTypes
{
    required public init(){}
    public var intArray:[Int] = []
    public var intList:[Int] = []
    public var stringArray:[String] = []
    public var stringList:[String] = []
    public var pocoArray:[Poco] = []
    public var pocoList:[Poco] = []
    public var pocoLookup:[String:[Poco]] = [:]
    public var pocoLookupMap:[String:[String:Poco]] = [:]
}

public enum EnumType : Int
{
    case Value1
    case Value2
}
```

As seen above, properties are essentially mapped to their optimal Swift equivalent. As DTO's can be partially complete all properties are `Optional` except for enumerables which default to an empty collection - making them easier to work with and despite their semantic differences, .NET enums are translated into typed Swift enums.

### Swift Code Generation

As we were already using code-gen to generate the Swift types we could extend it without impacting the Developer UX has been expanded to also include what's essentially an **explicit Reflection API** for each type with API's to support serializing to and from JSON. Thanks to Swift's rich support for extending types we were able to leverage its Type extensions so the implementation details could remain disconnected from the clean Swift type definitions allowing improved readability when inspecting the remote DTO schema's.

We can look at `AllCollectionTypes` to see an example of the code-gen that's generated for each type, essentially emitting explicit readable/writable closures for each property: 

```swift
extension AllCollectionTypes : JsonSerializable
{
    public static var typeName:String { return "AllCollectionTypes" }
    public static var metadata = Metadata.create([
            Type<AllCollectionTypes>.arrayProperty("intArray", get: { $0.intArray }, set: { $0.intArray = $1 }),
            Type<AllCollectionTypes>.arrayProperty("intList", get: { $0.intList }, set: { $0.intList = $1 }),
            Type<AllCollectionTypes>.arrayProperty("stringArray", get: { $0.stringArray }, set: { $0.stringArray = $1 }),
            Type<AllCollectionTypes>.arrayProperty("stringList", get: { $0.stringList }, set: { $0.stringList = $1 }),
            Type<AllCollectionTypes>.arrayProperty("pocoArray", get: { $0.pocoArray }, set: { $0.pocoArray = $1 }),
            Type<AllCollectionTypes>.arrayProperty("pocoList", get: { $0.pocoList }, set: { $0.pocoList = $1 }),
            Type<AllCollectionTypes>.objectProperty("pocoLookup", get: { $0.pocoLookup }, set: { $0.pocoLookup = $1 }),
            Type<AllCollectionTypes>.objectProperty("pocoLookupMap", get: { $0.pocoLookupMap }, set: { $0.pocoLookupMap = $1 }),
        ])
}
```

### Swift Native Types Limitations

Due to the semantic differences and limitations in Swift there are some limitations of what's not supported. Luckily these limitations are mostly [highly-discouraged bad practices](http://stackoverflow.com/a/10759250/85785) which is another reason not to use them. Specifically what's not supported:

#### No `object` or `Interface` properties
When emitting code we'll generate a comment when ignoring these properties, e.g:
```swift
//emptyInterface:IEmptyInterface ignored. Swift doesn't support interface properties
```

#### Base types must be marked abstract
As Swift doesn't support extension inheritance, when using inheritance in DTO's any Base types must be marked abstract.

#### All DTO Type Names must be unique
Required as there are no namespaces in Swift (Also required for F# and TypeScript). ServiceStack only requires Request DTO's to be unique, but our recommendation is for all DTO names to be unique.

#### IReturn not added for Array Responses
As Swift doesn't allow extending generic Arrays with public protocols, the `IReturn` marker that enables the typed ServiceClient API isn't available for Requests returning Array responses. You can workaround this limitation by wrapping the array in a Response DTO whilst we look at other solutions to support this in future.
