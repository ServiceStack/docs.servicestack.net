---
title: Service Clients Authentication
---

## Authenticating with JavaScript or TypeScript Service Clients

Typically when using ServiceStack's **@servicestack/client** `JsonServiceClient` it will utilize the browser's authenticated
cookies where you'll be able to make authenticated requests as the currently Authenticated User in your Application: 

```ts
import { JsonApiClient } from "@servicestack/client";

const client = JsonApiClient.create();

// Uses browser's authenticated cookies by default
const api = await client.api(new Secured())
```

Alternatively you can also authenticate with JavaScript by sending an  `Authenticate` Request, e.g:

```ts
import { JsonApiClient } from "@servicestack/client";

const client = JsonApiClient.create();

const apiAuth = await client.api(new Authenticate({ provider:'credentials', userName, password }))

if (apiAuth.suceeded) {
    const api = await client.api(new Secured())
}
```

As the cookies are shared with the browser, this will also authenticate the browser session where you'll be able to 
view protected Blazor, MVC or Razor Pages after successful authentication.

## Authenticating with C#/.NET Service Clients

On the client you can use the [C#/.NET Service Clients](/csharp-client) to easily consume your authenticated Services.

To authenticate using your `CustomCredentialsAuthProvider` by POST'ing a `Authenticate` Request, e.g:

```csharp
var client = new JsonServiceClient(BaseUrl);

var authResponse = client.Post(new Authenticate {
    provider = CredentialsAuthProvider.Name, //= credentials
    UserName = "test@gmail.com",
    Password = "p@55w0rd",
    RememberMe = true,
});
```

If authentication was successful the Service Client `client` instance will be populated with authenticated session cookies 
which then allows calling Authenticated services, e.g:

```csharp
var response = await client.ApiAsync(new GetActiveUserId());
```

If you've also registered the `BasicAuthProvider` it will enable your Services to accept [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) 
which is built-in the Service Clients that you can populate on the Service Client with:

```csharp
client.UserName = "test@gmail.com";
client.Password = "p@55w0rd";
```

Which will also let you access protected Services, e.g:

```csharp
var response = client.Get(new GetActiveUserId());
```

Although behind-the-scenes it ends up making 2 requests, 1st request sends a normal request which will get rejected with 
a `401 Unauthorized` and if the Server indicates it has the `BasicAuthProvider` enabled it will resend the request with 
the HTTP Basic Auth credentials.

You could instead save the latency of the additional auth challenge request by specifying the client should always send 
the Basic Auth with every request:

```csharp
client.AlwaysSendBasicAuthHeader = true;
```

## Authenticating with HTTP

To Authenticate with your `CustomCredentialsAuthProvider` (which inherits from CredentialsAuthProvider) you would POST:

**POST** localhost:60339/auth/credentials?format=json

```json
{
    "UserName": "admin",
    "Password": "test",
    "RememberMe": true
}
```

When the client now tries to authenticate with the request above and the auth succeeded, the client will retrieve some 
cookies with a session id which identify the client on each Web Service call.
