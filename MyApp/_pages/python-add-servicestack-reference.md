---
slug: python-add-servicestack-reference
title: Python Add ServiceStack Reference
---

![ServiceStack and Python Banner](./img/pages/servicestack-reference/python-reference.png)

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types from directly within PyCharm using [ServiceStack IntelliJ Plugin](https://plugins.jetbrains.com/plugin/7749-servicestack/) - providing a simple way to give clients typed access to your ServiceStack Services.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="WjbhfH45i5k" style="background-image: url('https://img.youtube.com/vi/WjbhfH45i5k/maxresdefault.jpg')"></lite-youtube>

### First class development experience

[Python](https://python.org) is one of the worlds most popular programming languages thanks to its ease of use and comprehensive libraries which sees it excels in many industries from education where it's often the first language taught in school to data science, machine learning and AI where it's often the dominant language used. To maximize the experience for calling ServiceStack APIs within these environments ServiceStack now supports Python as a 1st class Add ServiceStack Reference supported language which gives Python developers an end-to-end typed API for consuming ServiceStack APIs, complete with IDE integration in [PyCharm](https://www.jetbrains.com/pycharm/) as well as [built-in support in x dotnet tool](/dotnet-tool#addupdate-servicestack-references) to generate Python DTOs for a remote ServiceStack instance from a single command-line.

### Ideal idiomatic Typed Message-based API

To maximize the utility of Python DTOs and enable richer tooling support, Python DTOs are generated as [dataclasses](https://docs.python.org/3/library/dataclasses.html) with support for [JSON serialization](https://pypi.org/project/dataclasses-json/) and annotated with Python 3 [type hints](https://docs.python.org/3/library/typing.html) - that's invaluable when scaling large Python code-bases and greatly improves discoverability of a remote API. DTOs are also enriched with interface markers through Python's multiple inheritance support which enables its optimal end-to-end typed API:

The Python DTOs and `JsonServiceClient` library follow Python's [PEP 8's naming conventions](https://www.python.org/dev/peps/pep-0008/) so they'll naturally fit into existing Python code bases. Here's a sample of [techstacks.io](https://techstacks.io) generated Python DTOs containing string and int Enums, an example AutoQuery and a standard Request & Response DTO showcasing the rich typing annotations and naming conventions used:

```python
class TechnologyTier(str, Enum):
    PROGRAMMING_LANGUAGE = 'ProgrammingLanguage'
    CLIENT = 'Client'
    HTTP = 'Http'
    SERVER = 'Server'
    DATA = 'Data'
    SOFTWARE_INFRASTRUCTURE = 'SoftwareInfrastructure'
    OPERATING_SYSTEM = 'OperatingSystem'
    HARDWARE_INFRASTRUCTURE = 'HardwareInfrastructure'
    THIRD_PARTY_SERVICES = 'ThirdPartyServices'

class Frequency(IntEnum):
    DAILY = 1
    WEEKLY = 7
    MONTHLY = 30
    QUARTERLY = 90

# @Route("/technology/search")
@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class FindTechnologies(QueryDb2[Technology, TechnologyView], IReturn[QueryResponse[TechnologyView]], IGet):
    ids: Optional[List[int]] = None
    name: Optional[str] = None
    vendor_name: Optional[str] = None
    name_contains: Optional[str] = None
    vendor_name_contains: Optional[str] = None
    description_contains: Optional[str] = None

# @Route("/orgs/{Id}", "PUT")
@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class UpdateOrganization(IReturn[UpdateOrganizationResponse], IPut):
    id: int = 0
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    text_color: Optional[str] = None
    link_color: Optional[str] = None
    background_color: Optional[str] = None
    background_url: Optional[str] = None
    logo_url: Optional[str] = None
    hero_url: Optional[str] = None
    lang: Optional[str] = None
    delete_posts_with_report_count: int = 0
    disable_invites: Optional[bool] = None
    default_post_type: Optional[str] = None
    default_subscription_post_types: Optional[List[str]] = None
    post_types: Optional[List[str]] = None
    moderator_post_types: Optional[List[str]] = None
    technology_ids: Optional[List[int]] = None

@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class UpdateOrganizationResponse:
    response_status: Optional[ResponseStatus] = None
```

The smart Python `JsonServiceClient` available in the [servicestack](https://pypi.org/project/servicestack/) pip and conda packages enabling the same 
productive, typed API development experience available in our other 1st-class supported client platforms. 

Using [dataclasses](https://docs.python.org/3/library/dataclasses.html) enables DTOs to be populated using a single constructor expression utilizing named parameters which together with the generic `JsonServiceClient` enables end-to-end typed API Requests in a single LOC:

```python
from .dtos import *
from servicestack import JsonServiceClient

client = JsonServiceClient("https://test.servicestack.net")

response: HelloResponse = client.get(Hello(name="World"))
```

::: info
The `HelloResponse` optional type hint doesn't change runtime behavior but enables static analysis tools and IDEs like PyCharm to provide rich intelli-sense and development time feedback
:::

## Installation

The only requirements for Python apps to perform typed API Requests are the generated Python DTOs and the generic `JsonServiceClient` which can be installed globally or in a virtual Python environment using [Python's pip](https://pypi.org/project/pip/):

:::sh
pip install servicestack
:::

Or if preferred can be installed with [conda](https://conda.io):

:::sh
conda install conda-build.
:::

 - Add conda-forge as channel using `conda config --add channels conda-forge`
 - On root directory run `conda build .`

### PyCharm ServiceStack Plugin

Python developers of [PyCharm](https://www.jetbrains.com/pycharm/) Professional and [FREE Community Edition](https://www.jetbrains.com/pycharm/features/#chooseYourEdition) can get a simplified development experience for consuming ServiceStack Services by installing the [ServiceStack Plugin](https://plugins.jetbrains.com/plugin/7749-servicestack) from the JetBrains Marketplace:

[![](./img/pages/servicestack-reference/pycharm-servicestack-plugin.png)](https://plugins.jetbrains.com/plugin/7749-servicestack)

Where you'll be able to right-click on a directory and click on **ServiceStack Reference** on the context menu:

![](./img/pages/servicestack-reference/pycharm-add-servicestack-reference.png)

To launch the **Add Python ServiceStack Reference** dialog where you can enter the remote URL of the ServiceStack endpoint you wish to call to generate the Typed Python DTOs for all APIs which by default will saved to `dtos.py`:

![](./img/pages/servicestack-reference/pycharm-add-servicestack-reference-dialog.png)

Then just import the DTOs and `JsonServiceClient` to be able to consume any of the remote ServiceStack APIs:

```python
from .dtos import *
from servicestack import JsonServiceClient

client = JsonServiceClient("https://techstacks.io")

response = client.send(FindTechnologies(
    ids=[1, 2, 4, 6],
    vendor_name="Google",
    take=10))
```

If any of the the remote APIs change their DTOs can be updated by right-clicking on `dtos.py` and clicking **Update ServiceStack Reference**:

![](./img/pages/servicestack-reference/pycharm-update-servicestack-reference.png)

### Simple command-line utility for Python

Developers using other Python IDEs and Text Editors like VS Code can utilize the cross-platform [`x` command line utility](/dotnet-tool) for generating Python DTOs from the command-line.

To install first install the [latest .NET SDK](https://dotnet.microsoft.com/download) for your OS then install the [`x` dotnet tool](/dotnet-tool) with:

:::sh
dotnet tool install --global x 
:::

::include npx-get-dtos.md::

### Adding a ServiceStack Reference

To Add a Python ServiceStack Reference just call `x python` with the URL of a remote ServiceStack instance:

:::sh
x python https://techstacks.io
:::

Result:

```
Saved to: dtos.py
```

Calling `x python` with just a URL will save the DTOs using the Host name, you can override this by specifying a FileName as the 2nd argument:

:::sh
x python https://techstacks.io Tech
:::

Result:

```
Saved to: Tech.dtos.py
```

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `x python` with the Filename:

:::sh
x python dtos.py
:::

Result:

```
Updated: dtos.py
```

Which will update the File with the latest Python Server DTOs from [techstacks.io](https://techstacks.io). You can also customize how DTOs are generated by uncommenting the [Python DTO Customization Options](/#dto-customization-options) and updating them again.

### Updating all Python DTOs

Calling `x python` without any arguments will update all Python DTOs in the current directory:

:::sh
x python
:::

Result:

```
Updated: Tech.dtos.py
Updated: dtos.py
```

### Smart Generic JsonServiceClient

The generic `JsonServiceClient` is a 1st class client with the same rich featureset of the smart ServiceClients in other [1st class supported languages](/add-servicestack-reference#supported-languages) sporting a terse, typed flexible API with support for additional untyped params, custom URLs and HTTP Methods, dynamic response types including consuming API responses in raw text and binary data formats. Clients can be decorated to support generic functionality using instance and static Request, Response and Exception Filters.

It includes built-in support for a number of [ServiceStack Auth options](/auth/authentication-and-authorization) including [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) and stateless Bearer Token Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT Auth](/auth/jwt-authprovider) as well as [stateful Sessions](/auth/sessions) used by the popular **credentials** Auth Provider and an `on_authentication_required` callback for enabling custom authentication methods. The built-in auth options include auto-retry support for transparently authenticating and retrying authentication required requests as well as [Refresh Token Cookie](/auth/jwt-authprovider#refresh-token-cookies-supported-in-all-service-clients) support where it will transparently fetch new JWT Bearer Tokens automatically behind-the-scenes for friction-less stateless JWT support.

A snapshot of these above features is captured in the high-level public API below:

```python
class JsonServiceClient:
    base_url: str
    reply_base_url: str
    oneway_base_url: str
    headers: Optional[Dict[str, str]]
    bearer_token: Optional[str]
    refresh_token: Optional[str]
    refresh_token_uri: Optional[str]
    username: Optional[str]
    password: Optional[str]

    on_authentication_required: Callable[[], None]

    global_request_filter: Callable[[SendContext], None]  # static
    request_filter: Callable[[SendContext], None]

    global_response_filter: Callable[[Response], None]  # static
    response_filter: Callable[[Response], None]

    exception_filter: Callable[[Response, Exception], None]
    global_exception_filter: Callable[[Response, Exception], None]

    def __init__(self, base_url)

    def set_credentials(self, username, password)
    @property def token_cookie(self)
    @property def refresh_token_cookie(self)

    def get(self, request: IReturn[T], args: Dict[str, Any] = None) -> T
    def post(self, request: IReturn[T], body: Any = None, args: Dict[str, Any] = None) -> T
    def put(self, request: IReturn[T], body: Any = None, args: Dict[str, Any] = None) -> T
    def patch(self, request: IReturn[T], body: Any = None, args: Dict[str, Any] = None) -> T
    def delete(self, request: IReturn[T], args: Dict[str, Any] = None) -> T
    def options(self, request: IReturn[T], args: Dict[str, Any] = None) -> T
    def head(self, request: IReturn[T], args: Dict[str, Any] = None) -> T
    def send(self, request, method: Any = None, body: Any = None, args: Dict[str, Any] = None)

    def get_url(self, path: str, response_as: Type, args: Dict[str, Any] = None)
    def delete_url(self, path: str, response_as: Type, args: Dict[str, Any] = None)
    def options_url(self, path: str, response_as: Type, args: Dict[str, Any] = None)
    def head_url(self, path: str, response_as: Type, args: Dict[str, Any] = None)
    def post_url(self, path: str, body: Any = None, response_as: Type = None, args: Dict[str, Any] = None)
    def put_url(self, path: str, body: Any = None, response_as: Type = None, args: Dict[str, Any] = None)
    def patch_url(self, path: str, body: Any = None, response_as: Type = None, args: Dict[str, Any] = None)
    def send_url(self, path: str, method: str = None, response_as: Type = None, body: Any = None,
                 args: Dict[str, Any] = None)

    def send_all(self, request_dtos: List[IReturn[T]])  # Auto Batch Reply Requests
    def send_all_oneway(self, request_dtos: list)       # Auto Batch Oneway Requests
```

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.AddResponseStatus = true;
...
```

Python specific functionality can be added by `PythonGenerator`

```python
PythonGenerator.DefaultImports.Add("requests");
```

### Customize DTO Type generation

Additional Python specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) can be used to inject custom code in the generated DTOs output. 

Use the `PreTypeFilter` to generate source code before and after a Type definition, e.g. this will append the `Decorator` class decorator on non enum & interface types:

```csharp
PythonGenerator.PreTypeFilter = (sb, type) => {
    if (!type.IsEnum.GetValueOrDefault() && !type.IsInterface.GetValueOrDefault())
    {
        sb.AppendLine("@Decorator");
    }
};
```

The `InnerTypeFilter` gets invoked just after the Type Definition which can be used to generate common members for all Types and interfaces, e.g:

```csharp
PythonGenerator.InnerTypeFilter = (sb, type) => {
    sb.AppendLine("id:str = str(random.random())[2:]");
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
PythonGenerator.PrePropertyFilter = (sb , prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("@IsInt");
    }
};
```

### Emit custom code

To enable greater flexibility when generating complex Typed DTOs, you can use `[Emit{Language}]` attributes to generate code before each type or property.

These attributes can be used to generate different attributes or annotations to enable client validation for different validation libraries in different languages, e.g:

```csharp
[EmitCode(Lang.Python, "# App User")]
[EmitPython("@Validate")]
public class User : IReturn<User>
{
    [EmitPython("@IsNotEmpty", "@IsEmail")]
    [EmitCode(Lang.Swift | Lang.Dart, new[]{ "@isNotEmpty()", "@isEmail()" })]
    public string Email { get; set; }
}
```

Which will generate `[EmitPython]` code in Python DTOs:

```python
# App User
@Validate
@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class User:
    @IsNotEmpty
    @IsEmail
    email: Optional[str] = None
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.

### Python Reference Example

Lets walk through a simple example to see how we can use ServiceStack's Python DTO annotations in our Python JsonServiceClient. Firstly we'll need to add a Python Reference to the remote ServiceStack Service by **right-clicking** on a project folder and clicking on `ServiceStack Reference...` (as seen in the above screenshot).

This will import the remote Services dtos into your local project which looks similar to:

```python
""" Options:
Date: 2021-08-14 15:33:39
Version: 5.111
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://techstacks.io

#GlobalNamespace: 
#MakePropertiesOptional: False
#AddServiceStackTypes: True
#AddResponseStatus: False
#AddImplicitVersion: 
#AddDescriptionAsComments: True
#IncludeTypes: 
#ExcludeTypes: 
#DefaultImports: datetime,decimal,marshmallow.fields:*,servicestack:*,typing:*,dataclasses:dataclass/field,dataclasses_json:dataclass_json/LetterCase/Undefined/config,enum:Enum/IntEnum
#DataClass: 
#DataClassJson: 
"""

@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class GetTechnologyResponse:
    created: datetime.datetime = datetime.datetime(1, 1, 1)
    technology: Optional[Technology] = None
    technology_stacks: Optional[List[TechnologyStack]] = None
    response_status: Optional[ResponseStatus] = None

# @Route("/technology/{Slug}")
@dataclass_json(letter_case=LetterCase.CAMEL, undefined=Undefined.EXCLUDE)
@dataclass
class GetTechnology(IReturn[GetTechnologyResponse], IRegisterStats, IGet):
    slug: Optional[str] = None
```

In keeping with idiomatic style of local `.py` sources, generated types are not wrapped within a module by default. This lets you reference the types you want directly using normal import destructuring syntax:

```python
from .dtos import GetTechnology, GetTechnologyResponse
```

Or import all Types into your preferred variable namespace with:

```python
from .dtos import *

request = GetTechnology()
```

### Making Typed API Requests

Making API Requests in Python is the same as all other [ServiceStack's Service Clients](/clients-overview) by sending a populated Request DTO using a `JsonServiceClient` which returns typed Response DTO.

So the only things we need to make any API Request is the `JsonServiceClient` from the `servicestack` package and any DTO's we're using from generated Python ServiceStack Reference, e.g:

```python
from .dtos import GetTechnology, GetTechnologyResponse
from servicestack import JsonServiceClient

client = JsonServiceClient("https://techstacks.io")

request = GetTechnology()
request.slug = "ServiceStack"

r: GetTechnologyResponse = client.get(request)  # typed to GetTechnologyResponse
tech = r.technology                             # typed to Technology

print(f"{tech.name} by {tech.vendor_name} ({tech.product_url})")
print(f"`{tech.name} TechStacks: {r.technology_stacks}")
```

### Constructors Initializer

All Python Reference dataclass DTOs also implements **__init__** making them much nicer to populate using a constructor expression with named params syntax we're used to in C#, so instead of:

```python
request = Authenticate()
request.provider = "credentials"
request.user_name = user_name
request.password = password
request.remember_me = remember_me
response = client.post(request)
```

You can populate DTOs with a single constructor expression without any loss of Python's Typing benefits:

```python
response = client.post(Authenticate(
    provider='credentials',
    user_name=user_name,
    password=password,
    remember_me=remember_me))
```

### Sending additional arguments with Typed API Requests

Many AutoQuery Services utilize [implicit conventions](/autoquery/rdbms#implicit-conventions) to query fields that aren't explicitly defined on AutoQuery Request DTOs, these can be queried by specifying additional arguments with the typed Request DTO, e.g:

```python
request = FindTechStacks()

r:QueryResponse[TechnologyStackView] = client.get(request, args={"vendorName": "ServiceStack"})
```

### Making API Requests with URLs

In addition to making Typed API Requests you can also call Services using relative or absolute urls, e.g:

```python
client.get("/technology/ServiceStack", response_as=GetTechnologyResponse)

client.get("https://techstacks.io/technology/ServiceStack", response_as=GetTechnologyResponse)

# https://techstacks.io/technology?Slug=ServiceStack
args = {"slug":"ServiceStack"}
client.get("/technology", args=args, response_as=GetTechnologyResponse) 
```

as well as POST Request DTOs to custom urls:

```python
client.post_url("/custom-path", request, args={"slug":"ServiceStack"})

client.post_url("http://example.org/custom-path", request)
```

### Raw Data Responses

The `JsonServiceClient` also supports Raw Data responses like `string` and `byte[]` which also get a Typed API once declared on Request DTOs using the `IReturn<T>` marker:

```csharp
public class ReturnString : IReturn<string> {}
public class ReturnBytes : IReturn<byte[]> {}
```

Which can then be accessed as normal, with their Response typed to a JavaScript `str` or `bytes` for raw `byte[]` responses:

```python
str:str = client.get(ReturnString())

data:bytes = client.get(ReturnBytes())
```

### Authenticating using Basic Auth

Basic Auth support is implemented in `JsonServiceClient` and follows the same API made available in the C# Service Clients where the `userName/password` properties can be set individually, e.g:

```python
client = JsonServiceClient(baseUrl)
client.username = user
client.password = pass

response = client.get(SecureRequest())
```

Or use `client.set_credentials()` to have them set both together.

### Authenticating using Credentials

Alternatively you can authenticate using userName/password credentials by 
[adding a Python Reference](#add-python-reference) 
to your remote ServiceStack Instance and sending a populated `Authenticate` Request DTO, e.g:

```python
request = Authenticate()
request.provider = "credentials"
request.user_name = user_name
request.password = password
request.remember_me = true

response:AuthenticateResponse = client.post(request)
```

This will populate the `JsonServiceClient` with [Session Cookies](/auth/sessions#cookie-session-ids) 
which will transparently be sent on subsequent requests to make authenticated requests.

### Authenticating using JWT

Use the `bearer_token` property to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```python
client.bearer_token = jwt
```

Alternatively you can use just a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```python
client.refresh_token = refresh_token
```

Where the client will automatically fetch a new JWT Bearer Token using the Refresh Token for authenticated requests.

### Authenticating using an API Key

Use the `bearer_token` property to Authenticate with an [API Key](/auth/api-key-authprovider):

```python
client.bearer_token = api_key
```

### Transparently handle 401 Unauthorized Responses

If the server returns a 401 Unauthorized Response either because the client was Unauthenticated or the 
configured Bearer Token or API Key used had expired or was invalidated, you can use `onAuthenticationRequired`
callback to re-configure the client before automatically retrying the original request, e.g:

```python
auth_client = JsonServiceClient(AUTH_URL)

client.on_authentication_required = lambda c=client, a=auth_client: [
    a.set_credentials(username, password),
    client.set_bearer_token(cast(AuthenticateResponse, a.get(Authenticate())).bearer_token)
]

# Automatically retries requests returning 401 Responses with new bearerToken
response = client.get(Secured())
```

### Automatically refresh Access Tokens

With the [Refresh Token support in JWT](/auth/jwt-authprovider#refresh-tokens) 
you can use the `refresh_token` property to instruct the Service Client to automatically fetch new JWT Tokens behind the scenes before automatically retrying failed requests due to invalid or expired JWTs, e.g:

```python
# Authenticate to get new Refresh Token
auth_client = JsonServiceClient(AUTH_URL)
auth_client.username = username
auth_client.password = password
auth_response = auth_client.get(Authenticate())

# Configure client with RefreshToken
client.refresh_token = auth_response.refresh_token

# Call authenticated Services and clients will automatically retrieve new JWT Tokens as needed
response = client.get(Secured())
```

Use the `refresh_token_uri` property when refresh tokens need to be sent to a different ServiceStack Server, e.g:

```python
client.refresh_token = refresh_token
client.refresh_token_uri = AUTH_URL + "/access-token"
```

## DTO Customization Options 

In most cases you'll just use the generated Python DTO's as-is, however you can further customize how the DTO's are generated by overriding the default options.

The header in the generated DTO's show the different options Python native types support with their defaults. Default values are shown with the comment prefix of `//`. To override a value, remove the `#` and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override any server defaults.

The DTO comments allows for customizations for how DTOs are generated. The default options that were used to generate the DTO's are repeated in the header comments of the generated DTOs, options that are preceded by a Python comment `#` are defaults from the server, any uncommented value will be sent to the server 
to override any server defaults.

```python
""" Options:
Date: 2021-08-15 08:26:46
Version: 5.111
Tip: To override a DTO option, remove "#" prefix before updating
BaseUrl: https://techstacks.io

#GlobalNamespace: 
#MakePropertiesOptional: False
#AddServiceStackTypes: True
#AddResponseStatus: False
#AddImplicitVersion: 
#AddDescriptionAsComments: True
#IncludeTypes: 
#ExcludeTypes: 
#DefaultImports: datetime,decimal,marshmallow.fields:*,servicestack:*,typing:*,dataclasses:dataclass/field,dataclasses_json:dataclass_json/LetterCase/Undefined/config,enum:Enum/IntEnum
#DataClass: 
#DataClassJson: 
"""
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in C#
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.AddResponseStatus = true;
...
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### GlobalNamespace

As Python lacks the concept of namespaces this just emits a comment with the namespace name:

```python
# module dtos
```

### AddResponseStatus

Automatically add a `response_status` property on all Response DTO's, regardless if it wasn't already defined:

```python
class GetTechnologyResponse:
    ...
    response_status: Optional[ResponseStatus] = None
```

### AddImplicitVersion

Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client: 

```python
class GetTechnology(IReturn[GetTechnologyResponse], IRegisterStats, IGet):
    version: int = 1
    ...
```

This lets you know what Version of the Service Contract that existing clients are using making it easy to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
""" Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's:

```python
class GetTechnologyResponse:
    ...
class GetTechnology:
    ...
```

#### Include Generic Types

Use .NET's Type Name to include Generic Types, i.e. the Type name separated by the backtick followed by the number of generic arguments, e.g:

```
IncludeTypes: IReturn`1,MyPair`2
```

#### Include Request DTO and its dependent types

You can include a Request DTO and all its dependent types with a `.*` suffix on the Request DTO, e.g:

```
""" Options:
IncludeTypes: GetTechnology.*
```

Which will include the `GetTechnology` Request DTO, the `GetTechnologyResponse` Response DTO and all Types that they both reference.

#### Include All Types within a C# namespace

If your DTOs are grouped into different namespaces they can be all included using the `/*` suffix, e.g:

```
""" Options:
IncludeTypes: MyApp.ServiceModel.Admin/*
```

This will include all DTOs within the `MyApp.ServiceModel.Admin` C# namespace. 

#### Include All Services in a Tag Group

Services [grouped by Tag](/api-design#group-services-by-tag) can be used in the `IncludeTypes` where tags can be specified using braces in the format `{tag}` or `{tag1,tag2,tag3}`, e.g:

```
""" Options:
IncludeTypes: {web,mobile}
```

Or individually:

```
""" Options:
IncludeTypes: {web},{mobile}
```

### ExcludeTypes
Is used as a Blacklist to specify which types you would like excluded from being generated:

```
""" Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```

Will exclude `GetTechnology` and `GetTechnologyResponse` DTOs from being generated.

### DefaultImports

The `module:Symbols` short-hand syntax can be used for specifying additional imports in your generated Python DTO. There are 3 different syntaxes for specifying different Python imports:

```python
""" Options:
...
DefaultImports: datetime,typing:*,enum:Enum/IntEnum
"""
```

Which will generate the popular import form of:

```python
import datetime
from typing import *
from enum import Enum, IntEnum
```

### DataClass

Change what `dataclass` decorator is used, e.g:

```python
""" Options:
...
DataClass: init=False
"""
```

Will decorate every DTO with:

```python
@dataclass(init=False)
class GetTechnology(IReturn[GetTechnologyResponse], IRegisterStats, IGet):
    slug: Optional[str] = None
```


### DataClassJson

Change what `dataclass_json` decorator is used, e.g:

```python
""" Options:
...
DataClassJson: letter_case=LetterCase.PASCAL
"""
```

Will decorate every DTO with:

```python
@dataclass_json(letter_case=LetterCase.PASCAL)
class GetTechnology(IReturn[GetTechnologyResponse], IRegisterStats, IGet):
    slug: Optional[str] = None
```

Which will result in each type being serialized with PascalCase.

## Customize Serialization

The `servicestack` client lib allows for flexible serialization customization where you can change how different .NET Types are serialized and deserialized into native Python types.

To illustrate this we'll walk through how serialization of properties containing binary data to Base64 is implemented.

First we specify the Python DTO generator to emit `bytes` type hint for the popular .NET binary data types:

```csharp
PythonGenerator.TypeAliases[typeof(byte[]).Name] = "bytes";
PythonGenerator.TypeAliases[typeof(Stream).Name] = "bytes";
```

In the Python app we can then specify the serializers and deserializers to use for deserializing properties with the `bytes` data type which converts binary data to/from Base64:

```python
from servicestack import TypeConverters

def to_bytearray(value: Optional[bytes]):
    if value is None:
        return None
    return base64.b64encode(value).decode('ascii')

def from_bytearray(base64str: Optional[str]):
    return base64.b64decode(base64str)

TypeConverters.serializers[bytes] = to_bytearray
TypeConverters.deserializers[bytes] = from_bytearray
```

## Inspect Utils

To help clients with inspecting API Responses the `servicestack` library also includes a number of helpful utils to quickly visualizing API outputs.

For a basic indented object graph you can use `dump` to capture and `printdump` to print the output of any API Response, e.g:

```python
from dataclasses import dataclass
from dataclasses_json import dataclass_json, Undefined
from typing import Optional
from servicestack import printdump, printtable

@dataclass_json(undefined=Undefined.EXCLUDE)
@dataclass
class GithubRepo:
    name: str
    description: Optional[str] = None
    homepage: Optional[str] = None
    lang: Optional[str] = field(metadata=config(field_name="language"),default=None)
    watchers: Optional[int] = 0
    forks: Optional[int] = 0

response = requests.get(f'https://api.github.com/orgs/python/repos')
orgRepos = GithubRepo.schema().loads(response.text, many=True)
orgRepos.sort(key=operator.attrgetter('watchers'), reverse=True)

print(f'Top 3 {orgName} Repos:')
printdump(orgRepos[0:3])
```

Output:

```
Top 3 python Repos:
[
    {
        name: mypy,
        description: Optional static typing for Python 3 and 2 (PEP 484),
        homepage: http://www.mypy-lang.org/,
        lang: Python,
        watchers: 9638,
        forks: 1564
    },
    {
        name: peps,
        description: Python Enhancement Proposals,
        homepage: https://www.python.org/dev/peps/,
        lang: Python,
        watchers: 2459,
        forks: 921
    },
    {
        name: typeshed,
        description: Collection of library stubs for Python, with static types,
        homepage: ,
        lang: Python,
        watchers: 1942,
        forks: 972
    }
]
```

For tabular resultsets you can use `table` to capture and `printtable` to print API resultsets in a human-friendly markdown table with an optional `headers` parameter to specify the order and columns to display, e.g:

```python
print(f'\nTop 10 {orgName} Repos:')
printtable(orgRepos[0:10],headers=['name','lang','watchers','forks'])
```

Output:

```
Top 10 python Repos:
+--------------+-----------+------------+---------+
| name         | lang      |   watchers |   forks |
|--------------+-----------+------------+---------|
| mypy         | Python    |       9638 |    1564 |
| peps         | Python    |       2459 |     921 |
| typeshed     | Python    |       1942 |     972 |
| pythondotorg | Python    |       1038 |     432 |
| asyncio      |           |        945 |     178 |
| typing       | Python    |        840 |     130 |
| raspberryio  | Python    |        217 |      38 |
| typed_ast    | C         |        171 |      43 |
| planet       | Python    |        100 |     145 |
| psf-salt     | SaltStack |         87 |      50 |
+--------------+-----------+------------+---------+
```

Alternatively you can use `htmldump` to generate API responses in a HTML UI which is especially useful in [Python Jupyter Notebooks](/jupyter-notebooks-python) to easily visualize API responses, e.g:

[![](./img/pages/apps/jupyterlab-mybinder-techstacks.png)](https://github.com/ServiceStack/jupyter-notebooks/blob/main/techstacks.io-FindTechnologies.ipynb)
