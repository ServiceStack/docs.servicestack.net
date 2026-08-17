---
slug: ruby-add-servicestack-reference
title: Ruby Add ServiceStack Reference
---

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types for Ruby - providing a simple way to give Ruby clients typed access to your ServiceStack Services.

### Ruby - ServiceStack productivity in a dynamic language

The [servicestack](https://rubygems.org/gems/servicestack) gem provides generated DTOs with explicit properties and API metadata, giving editors and developers a discoverable model of every request and response:

```ruby
client = ServiceStack::JsonServiceClient.new(base_url)

response = client.send(Hello.new(name: 'World'))
puts response.result
```

Implemented with Ruby's standard library and no external runtime dependencies. Includes structured `WebServiceException` errors, field validation details, authentication, typed AutoQuery conventions, batch calls, one-way requests, custom URLs and file uploads.

### First class development experience

[Ruby](https://www.ruby-lang.org) enjoys enduring popularity thanks to its expressive syntax and its focus on developer productivity, where it continues to power a large ecosystem of Web Apps, CLI tools, automation scripts and DevOps tooling. To maximize the experience for calling ServiceStack APIs from these environments, Ruby is supported as a 1st class Add ServiceStack Reference language which gives Ruby developers an end-to-end typed API for consuming ServiceStack APIs, with DTOs generated from a single command-line.

### Ideal idiomatic Typed Message-based API

Ruby DTOs are generated as plain Ruby classes with `attr_accessor` properties following Ruby's `snake_case` naming conventions, so they'll naturally fit into existing Ruby code bases. They're kept free of any serialization attributes, instead each DTO declares the wire name and Type of each of its properties which the `servicestack` gem uses to convert them to and from the JSON their APIs use.

Here's a sample of generated Ruby DTOs containing a string Enum, an AutoQuery Request and a data model with an inherited base class:

```ruby
require 'json'
require 'servicestack'

module RoomType
    SINGLE = 'Single'
    DOUBLE = 'Double'
    QUEEN = 'Queen'
    TWIN = 'Twin'
    SUITE = 'Suite'
end

#
# Booking Details
#
class Booking < ServiceStack::AuditBase
    # @return [Integer]
    attr_accessor :id
    # @return [String]
    attr_accessor :name
    # @return [RoomType]
    attr_accessor :room_type
    # @return [DateTime]
    attr_accessor :booking_start_date
    # @return [Coupon]
    attr_accessor :discount

    def self.properties
        {
            id: { name: 'id' },
            name: { name: 'name' },
            room_type: { name: 'roomType' },
            booking_start_date: { name: 'bookingStartDate', type: DateTime },
            discount: { name: 'discount', type: Coupon },
        }
    end
end

#
# Find Bookings
#
# @Route("/bookings", "GET")
class QueryBookings < ServiceStack::QueryDb
    # @return [Integer]
    attr_accessor :id

    def self.properties
        {
            id: { name: 'id' },
        }
    end

    def response_type() = ServiceStack::QueryResponse.of(Booking)
    def get_type_name() = 'QueryBookings'
    def get_method() = 'GET'
end
```

The generated `response_type`, `get_type_name` and `get_method` declarations are what enable the end-to-end typed API, letting the client resolve each API's Response Type, route and HTTP Method from the Request DTO alone.

## Installation

The only requirements for Ruby Apps to perform typed API Requests are the generated Ruby DTOs and the generic `JsonServiceClient` in the [servicestack gem](https://rubygems.org/gems/servicestack), which only uses the Ruby standard library:

:::sh
gem install servicestack
:::

Or add it to your `Gemfile`:

```ruby
gem 'servicestack', '~> 0.1'
```

Requires **Ruby 3.0+**.

### Simple command-line utility for Ruby

Ruby DTOs can be generated from the command-line with the cross-platform [`x` command line utility](/dotnet-tool).

To install first install the [latest .NET SDK](https://dotnet.microsoft.com/download) for your OS then install the [`x` dotnet tool](/dotnet-tool) with:

:::sh
dotnet tool install --global x
:::

::include npx-get-dtos.md::

### Adding a ServiceStack Reference

To Add a Ruby ServiceStack Reference just call `x ruby` with the URL of a remote ServiceStack instance:

:::sh
x ruby https://blazor-vue.web-templates.io
:::

Result:

```
Saved to: dtos.rb
```

Calling `x ruby` with just a URL will save the DTOs using the Host name, you can override this by specifying a FileName as the 2nd argument:

:::sh
x ruby https://blazor-vue.web-templates.io Bookings
:::

Result:

```
Saved to: Bookings.dtos.rb
```

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `x ruby` with the Filename:

:::sh
x ruby dtos.rb
:::

Result:

```
Updated: dtos.rb
```

Which will update the File with the latest Ruby Server DTOs. You can also customize how DTOs are generated by uncommenting the [Ruby DTO Customization Options](#dto-customization-options) and updating them again.

### Updating all Ruby DTOs

Calling `x ruby` without any arguments will update all Ruby DTOs in the current directory:

:::sh
x ruby
:::

Result:

```
Updated: Bookings.dtos.rb
Updated: dtos.rb
```

### Smart Generic JsonServiceClient

The generic `JsonServiceClient` is a 1st class client with the same rich featureset of the smart ServiceClients in other [1st class supported languages](/add-servicestack-reference#supported-languages) sporting a terse, typed flexible API with support for additional untyped params, custom URLs and HTTP Methods and raw Response bodies.

It includes built-in support for a number of [ServiceStack Auth options](/auth/authentication-and-authorization) including [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) and stateless Bearer Token Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT Auth](/auth/jwt-authprovider) as well as [stateful Sessions](/auth/sessions) used by the popular **credentials** Auth Provider, whose Session Cookies are retained by the client and sent on subsequent Requests. [Refresh Tokens](/auth/jwt-authprovider#refresh-tokens) are also supported, where expired JWT Bearer Tokens are transparently refreshed behind-the-scenes before automatically retrying the failed Request.

A snapshot of these features is captured in the high-level public API below:

```ruby
class ServiceStack::JsonServiceClient
  attr_accessor :base_url, :reply_base_url, :oneway_base_url, :headers,
                :bearer_token, :refresh_token, :refresh_token_uri,
                :user_name, :password, :request_filter, :response_filter,
                :timeout, :cookies, :on_authentication_required

  # Filters applied to every Request and Response of all clients
  self.global_request_filter
  self.global_response_filter

  def initialize(base_url)

  def set_base_path(base_path = '')
  def set_bearer_token(token)
  def set_refresh_token(token)
  def set_credentials(user_name, password)
  def set_header(name, value)

  # Typed API
  def send(request, method: nil, body: nil, args: nil)  # aliased as send_dto
  def get(request, args: nil)
  def post(request, body: nil, args: nil)
  def put(request, body: nil, args: nil)
  def patch(request, body: nil, args: nil)
  def delete(request, args: nil)
  def send_void(request, args: nil)
  def api(request, method: nil, args: nil)              # returns ApiResult
  def send_all(requests)                                # Auto Batched Reply Requests
  def publish(request)                                  # Oneway Request
  def authenticate(user_name, password)

  # URL API
  def get_url(path, response_as: nil, args: nil)
  def post_url(path, body: nil, response_as: nil, args: nil)
  def put_url(path, body: nil, response_as: nil, args: nil)
  def patch_url(path, body: nil, response_as: nil, args: nil)
  def delete_url(path, response_as: nil, args: nil)
  def send_url(path, method: HttpMethods::GET, body: nil, response_as: nil, args: nil)
  def send_url_string(path, method: HttpMethods::GET, body: nil, args: nil)
  def to_absolute_url(path_or_url)

  # File Uploads
  def post_file_with_request(request, file, args: nil)
  def post_files_with_request(request, files, args: nil)
  def post_files_with_request_url(path, request, files, response_as: nil, args: nil)
end
```

::: info
`JsonServiceClient#send` overrides Ruby's `Object#send` to keep the same API used by ServiceStack's other Service Clients. Use `__send__` for Ruby's dynamic dispatch, or the `send_dto` alias if you'd prefer an unambiguous name.
:::

### Ruby Reference Example

Lets walk through a simple example to see how we can use ServiceStack's Ruby DTOs in our Ruby `JsonServiceClient`. Firstly we'll need to add a Ruby Reference to the remote ServiceStack Service:

:::sh
npx get-dtos ruby https://blazor-vue.web-templates.io
:::

This will import the remote Services DTOs into your local project which looks similar to:

```ruby
# frozen_string_literal: true
# encoding: utf-8

# Options:
=begin
Date: 2026-08-06 15:38:36
Version: 10.09
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://blazor-vue.web-templates.io

#AddResponseStatus: False
#AddImplicitVersion:
#IncludeTypes:
#ExcludeTypes:
=end

require 'json'
require 'servicestack'

class HelloResponse
    include ServiceStack::DTO

    # @return [String]
    attr_accessor :result

    def self.properties
        {
            result: { name: 'result' },
        }
    end
end

# @Route("/hello/{Name}")
class Hello
    include ServiceStack::DTO

    # @return [String]
    attr_accessor :name

    def self.properties
        {
            name: { name: 'name' },
        }
    end

    def response_type() = HelloResponse
    def get_type_name() = 'Hello'
    def get_method() = 'GET'
end
```

In keeping with the idiomatic style of local `.rb` sources, generated types aren't wrapped in a module by default, so you can reference them directly after requiring the file:

```ruby
require_relative 'dtos'
```

### Making Typed API Requests

Making API Requests in Ruby is the same as all other [ServiceStack's Service Clients](/clients-overview) by sending a populated Request DTO using a `JsonServiceClient` which returns a typed Response DTO.

So the only things we need to make any API Request is the `JsonServiceClient` from the `servicestack` gem and any DTOs we're using from the generated Ruby ServiceStack Reference, e.g:

```ruby
require 'servicestack'
require_relative 'dtos'

client = ServiceStack::JsonServiceClient.new('https://blazor-vue.web-templates.io')

request = Hello.new
request.name = 'World'

response = client.send(request)   # typed to HelloResponse
puts response.result
```

`send` uses the HTTP Method the API is annotated with, use `get`, `post`, `put`, `patch` or `delete` to send a Request DTO with a specific HTTP Method:

```ruby
response = client.post(CreateBooking.new(name: 'Booking'))
```

APIs that don't return a Response Body can be sent with `send_void`:

```ruby
client.send_void(DeleteBooking.new(id: 1))
```

### Constructors Initializer

All Ruby DTOs support populating their properties with keyword arguments, so instead of:

```ruby
request = ServiceStack::Authenticate.new
request.provider = 'credentials'
request.user_name = user_name
request.password = password
request.remember_me = true
response = client.post(request)
```

You can populate DTOs with a single constructor expression:

```ruby
response = client.post(ServiceStack::Authenticate.new(
  provider: 'credentials',
  user_name: user_name,
  password: password,
  remember_me: true))
```

### AutoQuery Requests

AutoQuery Request DTOs inherit the query params of their base type, whose Responses are returned in a typed `QueryResponse`:

```ruby
response = client.send(QueryBookings.new(take: 5, order_by_desc: 'id'))

response.results.each do |booking|  # each booking is a Booking
  puts "#{booking.id} #{booking.name} #{booking.booking_start_date}"
end
```

Nested DTOs, Dates and collections are converted using the metadata each generated DTO declares, so `booking.discount` is a `Coupon`, `booking.booking_start_date` is a `DateTime` and inherited properties like `booking.created_by` are populated from their `createdBy` wire names.

### Sending additional arguments with Typed API Requests

Many AutoQuery Services utilize [implicit conventions](/autoquery/rdbms#implicit-conventions) to query fields that aren't explicitly defined on AutoQuery Request DTOs, these can be queried by specifying additional arguments with the typed Request DTO, e.g:

```ruby
response = client.get(QueryBookings.new, args: { 'nameStartsWith' => 'A' })
```

### Making API Requests with URLs

In addition to making Typed API Requests you can also call Services using relative or absolute urls, e.g:

```ruby
client.get_url('/hello/World', response_as: HelloResponse)

client.get_url('https://blazor-vue.web-templates.io/hello/World', response_as: HelloResponse)

# /api/Hello?name=World
client.get_url('/api/Hello', args: { 'name' => 'World' }, response_as: HelloResponse)
```

as well as POST Request DTOs to custom urls:

```ruby
client.post_url('/custom-path', body: request, response_as: HelloResponse)

client.post_url('http://example.org/custom-path', body: request, response_as: HelloResponse)
```

### Raw Data Responses

Use `send_url_string` to access a raw Response Body, useful for APIs returning content like CSV:

```ruby
csv = client.send_url_string('/api/QueryBookings.csv')
```

### Batched Requests

Multiple Request DTOs of the same Type can be sent together in a single Request with `send_all`, which returns all their Responses:

```ruby
responses = client.send_all([Hello.new(name: 'A'), Hello.new(name: 'B')])
```

Or send them to a one-way endpoint that ignores their Responses:

```ruby
client.publish(Hello.new(name: 'World'))
```

### Error Handling

Failed API Requests raise a `ServiceStack::WebServiceException` containing the HTTP Status Code and the API's structured [ResponseStatus](/error-handling) error:

```ruby
begin
  client.send(CreateBooking.new)
rescue ServiceStack::WebServiceException => e
  puts e.status_code           # 400
  puts e.error_code            # "NotEmpty"
  puts e.error_message         # "'Name' must not be empty."
  puts e.field_error('Name')   # "'Name' must not be empty."
  puts e.unauthorized?         # false
  puts e.validation_error?     # true
end
```

Alternatively `api` returns errors in its result instead of raising, which can be preferable when handling validation errors is part of normal control flow:

```ruby
api = client.api(CreateBooking.new)
if api.failed?
  puts api.error_code
  puts api.field_error('Name')
else
  puts api.response.id
end
```

::: info
Redirects aren't followed, so Services that redirect to a HTML sign in page raise a `WebServiceException` with a `Redirect` ErrorCode instead of returning an empty Response.
:::

### Authenticating using Basic Auth

Basic Auth support is implemented in `JsonServiceClient` and follows the same API made available in the C# Service Clients where the `user_name/password` properties can be set individually, e.g:

```ruby
client = ServiceStack::JsonServiceClient.new(base_url)
client.user_name = user
client.password = pass

response = client.send(SecureRequest.new)
```

Or use `client.set_credentials()` to have them set both together.

### Authenticating using Credentials

Alternatively you can authenticate using userName/password credentials by sending a populated `Authenticate` Request DTO, e.g:

```ruby
response = client.post(ServiceStack::Authenticate.new(
  provider: 'credentials',
  user_name: user_name,
  password: password,
  remember_me: true))
```

Or with the `authenticate` shorthand, which also uses any Bearer and Refresh Tokens the Server returns:

```ruby
response = client.authenticate(user_name, password)
```

This will populate the `JsonServiceClient` with [Session Cookies](/auth/sessions#cookie-session-ids) which will transparently be sent on subsequent requests to make authenticated requests.

### Authenticating using JWT

Use the `bearer_token` property to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```ruby
client.set_bearer_token(jwt)
```

Alternatively you can use just a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```ruby
client.set_refresh_token(refresh_token)
```

Where the client will automatically fetch a new JWT Bearer Token using the Refresh Token for authenticated requests.

### Authenticating using an API Key

Use the `bearer_token` property to Authenticate with an [API Key](/auth/api-key-authprovider):

```ruby
client.set_bearer_token(api_key)
```

### Transparently handle 401 Unauthorized Responses

If the server returns a 401 Unauthorized Response either because the client was Unauthenticated or the configured Bearer Token or API Key used had expired or was invalidated, you can use the `on_authentication_required` callback to re-configure the client before automatically retrying the original request, e.g:

```ruby
auth_client = ServiceStack::JsonServiceClient.new(AUTH_URL)

client.on_authentication_required = lambda { |c|
  auth = auth_client.authenticate(user_name, password)
  c.set_bearer_token(auth.bearer_token)
}

# Automatically retries requests returning 401 Responses with new bearerToken
response = client.send(Secured.new)
```

The callback also accepts a zero-arity lambda when it doesn't need the client. A configured Refresh Token takes precedence over the callback, which is only used when no Refresh Token is set or refreshing it failed. If the callback raises, the original 401 Response is returned.

Requires **servicestack v0.1.2+**.

### Automatically refresh Access Tokens

With the [Refresh Token support in JWT](/auth/jwt-authprovider#refresh-tokens) you can use the `refresh_token` property to instruct the Service Client to automatically fetch new JWT Tokens behind the scenes before automatically retrying failed requests due to invalid or expired JWTs, e.g:

```ruby
# Authenticate to get new Refresh Token
auth_client = ServiceStack::JsonServiceClient.new(AUTH_URL)
auth_response = auth_client.authenticate(user_name, password)

# Configure client with RefreshToken
client.set_refresh_token(auth_response.refresh_token)

# Call authenticated Services and clients will automatically retrieve new JWT Tokens as needed
response = client.send(Secured.new)
```

Use the `refresh_token_uri` property when refresh tokens need to be sent to a different ServiceStack Server, e.g:

```ruby
client.set_refresh_token(refresh_token)
client.refresh_token_uri = AUTH_URL + '/access-token'
```

### Uploading Files

Use `post_file_with_request` to upload a file with an API Request, whose contents can be supplied as a String or any IO that responds to `read`:

```ruby
res = File.open('photo.png', 'rb') do |file|
  client.post_file_with_request(UploadPhoto.new(album: 'Holiday'),
    ServiceStack::UploadFile.new(field_name: 'file', file_name: 'photo.png',
                                 content_type: 'image/png', stream: file))
end
```

The Request DTO's populated properties are sent as form fields alongside the file. To upload multiple files use `post_files_with_request`:

```ruby
client.post_files_with_request(UploadPhoto.new(album: 'Holiday'), [
  ServiceStack::UploadFile.new(field_name: 'file1', file_name: 'a.png', stream: a),
  ServiceStack::UploadFile.new(field_name: 'file2', file_name: 'b.png', stream: b)
])
```

Requires **servicestack v0.1.1+**.

### Inspecting Requests and Responses

Requests and Responses can be inspected or modified with instance and static filters:

```ruby
client.request_filter = ->(req) { puts "#{req.method} #{req.path}" }
client.response_filter = ->(res) { puts res.code }

# Applied to all clients
ServiceStack::JsonServiceClient.global_request_filter = ->(req) { req['X-Trace'] = trace_id }
```

## DTO Customization Options

In most cases you'll just use the generated Ruby DTOs as-is, however you can further customize how the DTOs are generated by overriding the default options.

The header in the generated DTOs show the different options Ruby native types support with their defaults. To override a value, remove the `#` and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override any server defaults.

```ruby
# Options:
=begin
Date: 2026-08-06 15:38:36
Version: 10.09
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://blazor-vue.web-templates.io

#MakePartial: True
#MakeVirtual: True
#MakeInternal: False
#MakeDataContractsExtensible: False
#AddReturnMarker: True
#AddDescriptionAsComments: True
#AddDataContractAttributes: False
#AddIndexesToDataMembers: False
#AddGeneratedCodeAttributes: False
#AddResponseStatus: False
#AddImplicitVersion:
#InitializeCollections: False
#ExportValueTypes: False
#IncludeTypes:
#ExcludeTypes:
#AddNamespaces:
#AddDefaultXmlNamespace: http://schemas.servicestack.net/types
=end
```

We'll go through and cover each of the more relevant options to see how they affect the generated DTOs:

### AddResponseStatus

Automatically add a `response_status` property on all Response DTOs, regardless if it wasn't already defined:

```ruby
class GetTechnologyResponse
    # @return [ServiceStack::ResponseStatus]
    attr_accessor :response_status
end
```

### AddImplicitVersion

Lets you specify the Version number to be automatically populated in all Request DTOs sent from the client:

```ruby
class Hello
    attr_accessor :version
end
```

This lets you know what Version of the Service Contract that existing clients are using making it easy to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785).

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
=begin
IncludeTypes: GetTechnology,GetTechnologyResponse
=end
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTOs.

To include a Request DTO and all its dependent types, use the `.*` suffix:

```
=begin
IncludeTypes: GetTechnology.*
=end
```

Or include all types within a [Tag Group](/api-design#group-services-by-tag) with:

```
=begin
IncludeTypes: {tag}
=end
```

### ExcludeTypes

Is used as a Blacklist to specify which types you would like excluded from being generated:

```
=begin
ExcludeTypes: GetTechnology,GetTechnologyResponse
=end
```

### AddDescriptionAsComments

Emits any `[Description]` attributes as comments above the generated Types and properties:

```ruby
#
# Find Bookings
#
class QueryBookings < ServiceStack::QueryDb
```

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in C#
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.AddResponseStatus = true;
```

Ruby specific functionality can be added by the `RubyGenerator`, e.g. to add additional requires to all generated DTOs:

```csharp
RubyGenerator.DefaultImports.Add("date");
```

### Customize DTO Type generation

Additional Ruby specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) which can be used to inject custom code in the generated DTOs output.

Use the `InnerTypeFilter` to generate source code at the start of a Type definition, e.g. this adds a `Comparable` mixin to all non enum & interface types:

```csharp
RubyGenerator.InnerTypeFilter = (sb, type) => {
    if (type.IsEnum != true && type.IsInterface != true)
    {
        sb.AppendLine("include Comparable");
    }
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
RubyGenerator.PrePropertyFilter = (sb, prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("# @!attribute [rw] id");
    }
};
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.
