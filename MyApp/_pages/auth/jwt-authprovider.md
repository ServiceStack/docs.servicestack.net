---
slug: jwt-authprovider
title: JWT Auth Provider
---

::: info
When using [ASP.NET Core Identity Auth](/auth/identity-auth) refer to [JWT Identity Auth](/auth/jwt-identity-auth) instead
:::

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NTCUT7atoLo" style="background-image: url('https://img.youtube.com/vi/NTCUT7atoLo/maxresdefault.jpg')"></lite-youtube>

The `JwtAuthProvider` is our integrated Auth solution for the popular [JSON Web Tokens](https://jwt.io/) (JWT) industry standard which is easily enabled by registering the `JwtAuthProvider` with the `AuthFeature` plugin:

```csharp
Plugins.Add(new AuthFeature(...,
    new IAuthProvider[] {
        new JwtAuthProvider(AppSettings) { AuthKey = AesUtils.CreateKey() },
        new CredentialsAuthProvider(AppSettings),
        //...
    }));
```

At a minimum you'll need to specify the `AuthKey` that will be used to Sign and Verify JWT tokens.
Whilst creating a new one in memory as above will work, a new Auth Key will be created every time the 
AppDomain recycles which will invalidate all existing JWT Tokens created with the previous key. 

## Generate new Auth Key

You can create a new **Base64 Auth Key** by running the code snippet below locally:

```csharp
var base64Key = System.Convert.ToBase64String(ServiceStack.AesUtils.CreateKey());
```

You'll typically want to generate the AuthKey out-of-band and configure it with the `JwtAuthProvider` at
registration which you can do in code using any of the [AppSettings providers](/appsettings):

```csharp
new JwtAuthProvider(AppSettings) { 
    AuthKeyBase64 = AppSettings.GetString("AuthKeyBase64") 
}
```

Or alternatively you can configure most `JwtAuthProvider` properties in your **appsettings.json** or **Web.config** `<appSettings/>` 
following the `jwt.{PropertyName}` format:

#### appsettings.json

```json
{
    "jwt.AuthKeyBase64": "{Base64AuthKey}"
}
```

#### Web.config

```xml
<add key="jwt.AuthKeyBase64" value="{Base64AuthKey}" />
```

As with all crypto keys you'll want to keep them confidential as if anyone gets a hold of your AuthKey 
they'll be able to forge and sign their own JWT tokens letting them be able to impersonate any user, 
roles or permissions!

### Upgrade to v5.9.2

If you're using JWT Auth please upgrade to v5.9.2 when possible to resolve a JWT signature verification issue comparing different lengthed signatures. 

If you're not able to upgrade, older versions should ensure a minimum length signature with a custom `ValidateToken`, e.g:

```csharp
new JwtAuthProvider(...) {
    ValidateToken = (js,req) => req.GetJwtToken().LastRightPart('.').FromBase64UrlSafe().Length >= 32,
}
```

## JWT Token Cookies

From **v6+** the default configuration of the [JWT Auth Provider](/auth/jwt-authprovider) uses **HTTP Token Cookies by default** which is both recommended [for Web Apps](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage#where-to-store-your-jwts) that's also better able to support effortless JWT Token management features.

It allows for a more interoperable and seamless solution as it already works with the normal client logic for authenticating using normal [Server Session Cookies](/auth/sessions), e.g:

```csharp
let api = client.api(new Authenticate({ provider:'credentials', userName, password, rememberMe }))
```

Which also works transparently after a configuring to use JWT on the server to switch to using stateless JWT Tokens, as in both cases the HTTP Clients utilize Cookies to enable authenticated requests.

### Transparent Server Auto Refresh of JWT Tokens

JWTs enable stateless authentication of clients without servers needing to maintain any Auth state in server infrastructure or perform any I/O to validate a token. As such, [JWTs are a popular choice for Microservices](/auth/jwt-authprovider#stateless-auth-microservices) as they only need to configured with confidential keys to validate access.

But to be able to terminate a users access, they need to revalidate their eligibility to verify they're still allowed access (e.g. deny Locked out users). This JWT revalidation pattern is implemented using [Refresh Tokens](/auth/jwt-authprovider#refresh-tokens) which are used to request revalidation of their access with a new JWT Access Token which they'll be able to use to make authenticated requests until it expires.

Previously the management of **auto refreshing expired JWT Access Tokens** was done with logic built into each of our smart generic Service Clients. But switching to use Token Cookies allows us to implement the revalidation logic on the server where it's now able to do this **transparently for all HTTP Clients**, i.e. it's no longer just limited to our typed Service Clients. 

### Revert to Bearer Token Responses

If you prefer not to use HTTP Token Cookies and want to manually handle JWT Auth Tokens, you can revert to returning JWT Tokens in `AuthenticateResponse` API responses with:

```csharp
new JwtAuthProvider(AppSettings) {
    UseTokenCookie = false
}
```

JWT Token Cookies are supported for most built-in Auth Providers including `Authenticate` Requests as well as **OAuth Web Flow** Sign Ins.

The alternative to configuring on the server is for clients to request it with [UseTokenCookie on the Authenticate Request](#request-jwt-cookie-is-set-on-authentication) or in a [hidden FORM Input](#switching-existing-sites-to-jwt). 

### RequireSecureConnection

The JWT Auth Provider defaults to `RequireSecureConnection=true` which mandates for Authentication via either Provider to happen over a secure (HTTPS) connection as both bearer tokens should be kept highly confidential. You can specify `RequireSecureConnection=false` to disable this requirement for testing or within controlled internal environments.

## Sending JWT with Service Clients

JWT Tokens can be sent using the Bearer Token support in all HTTP and Service Clients:

```csharp
var client = new JsonApiClient(baseUrl) {
    BearerToken = jwtToken
};

var response = await "https://example.org/secured".GetJsonFromUrlAsync(
    requestFilter: req => req.AddBearerToken(jwtToken));
```

The Service Clients offer additional high-level functionality where it's able to transparently request 
a new JWT Token after it expires by handling when the configured JWT Token becomes invalidated in the 
`OnAuthenticationRequired` callback. Here we can retrieve a new JWT Token that we can fetch using a 
different Service Client accessing a centralized and independent Auth Microservice that's configured with 
both API Key and JWT Token Auth Providers. We can fetch a new JWT Token by calling ServiceStack's 
built-in `Authenticate` Service with our **secret** API Key (that by default never invalidates unless revoked).

If authenticated, sending an empty `Authenticate()` DTO will return the currently Authenticated User Info 
that also generates a new JWT Token from the User's Authenticated Session and returns it in the `BearerToken` 
Response DTO property which we can use to update our invalidated JWT Token.

All together we can configure our Service Client to transparently refresh expired JWT Tokens with just:

```csharp
var authClient = JsonServiceClient(centralAuthBaseUrl) {
    Credentials = new NetworkCredential(apiKey, "")
};

var client = new JsonServiceClient(baseUrl);
client.OnAuthenticationRequired = () => {
    client.BearerToken = authClient.Send(new Authenticate()).BearerToken;
};
```

### Sending JWT using Cookies

To [improve accessibility with Ajax clients](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage) JWT Tokens can also be sent using the `ss-tok` Cookie, e.g:

```csharp
var client = new JsonServiceClient(baseUrl);
client.SetCookie("ss-tok", jwtToken);

//Equivalent to: 
client.SetTokenCookie(jwtToken);
```

We'll walk through an example of how you can access JWT Tokens as well as how you can convert Authenticated
Sessions into JWT Tokens and assign it to use a **Secure** and **HttpOnly** Cookie later on.

### Sending JWT in Request DTOs

Similar to the `IHasSessionId` interface Request DTOs can also implement `IHasBearerToken` to send Bearer Tokens as an alternative for sending them in HTTP Headers or Cookies, e.g:

```csharp
public class Secure : IHasBearerToken
{
    public string BearerToken { get; set; }
    public string Name { get; set; }
}

var response = client.Get(new Secure { BearerToken = jwtToken, Name = "World" });
```

Alternatively you can set the `BearerToken` property on the Service Client once where it will automatically populate all Request DTOs 
that implement `IHasBearerToken`, e.g:

```csharp
client.BearerToken = jwtToken;

var response = client.Get(new Secure { Name = "World" });
```

## JWT Overview

A nice property of JWT tokens is that they allow for truly stateless authentication where API Keys and user 
credentials can be maintained in a decentralized Auth Service that's kept isolated from the rest of your 
System, making them optimal for use in Microservice architectures.

Being self-contained lends JWT tokens to more scalable, performant and flexible architectures as they don't 
require any I/O or any state to be accessed from App Servers to validate the JWT Tokens, this is unlike all 
other Auth Providers which requires at least a DB, Cache or Network hit to authenticate the user.

A good introduction into JWT is available from the JWT website: [jwt.io/introduction/](https://jwt.io/introduction/) whilst [JWT vs Sessions](https://float-middle.com/json-web-tokens-jwt-vs-sessions/) is a good article on advantages of using JWT instead of Sessions.

## JWT Format

Essentially JWT's consist of 3 parts separated by `.` with each part encoded in 
[Base64url Encoding](https://tools.ietf.org/html/rfc4648#section-5) making it safe to encode both text and
binary using only URL-safe (i.e. non-escaping required) chars in the following format:

    Base64UrlHeader.Base64UrlPayload.Base64UrlSignature 

Where just like the API Key, JWT's can be sent as a Bearer Token in the `Authorization` HTTP Request Header.

### JWT Header

The header typically consists of two parts: the type of the token and the hashing algorithm being used 
which is typically just:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

We also send the "kid" [Key Id](http://self-issued.info/docs/draft-jones-json-web-token-01.html#rfc.section.5.1)
used to identify which key should be used to validate the signature to help with seamless key rotations in 
future. If not specified the KeyId defaults to the **first 3 chars** of the Base64 HMAC or RSA Public Key Modulus.

### JWT Payload

The Payload contains the essential information of a JWT Token which is made up of "claims", i.e. 
statements and metadata about a user which are categorized into 3 groups: 

 - [Registered Claim Names](https://tools.ietf.org/html/rfc7519#section-4.1) - containing a known set of 
reserved names predefined in the JWT Standard
 - [Public Claim Names](https://tools.ietf.org/html/rfc7519#section-4.2) - additional common names that are
 registered in the [IANA "JSON Web Token Claims" registry](http://www.iana.org/assignments/jwt/jwt.xhtml) or
 otherwise adopt a Collision-Resistant name, e.g. prefixed by a namespace
 - [Private Claim Names](https://tools.ietf.org/html/rfc7519#section-4.3) - any other metadata you wish to
 include about an entity

We use the Payload to store essential information about the user which we use to validate the token and 
populate the session. Which typically contains:

 - **iss** ([Issuer](https://tools.ietf.org/html/rfc7519#section-4.1.1)) - the principal that issued the
 JWT. Can be set with `JwtAuthProvider.Issuer`, defaults to **ssjwt**
 - **sub** ([Subject](https://tools.ietf.org/html/rfc7519#section-4.1.2)) - identifies the subject of 
 the JWT, used to store the User's **UserAuthId**
 - **iat** ([Issued At](https://tools.ietf.org/html/rfc7519#section-4.1.6)) - when JWT Token was issued.
 Can use `InvalidateTokensIssuedBefore` to invalidate tokens issued before a specific date
 - **exp** ([Expiration Time](https://tools.ietf.org/html/rfc7519#section-4.1.4)) - when the JWT expires. 
 Initialized with `JwtAuthProvider.ExpireTokensIn` from date of issue (default **14 days**)
 - **aud** ([Audience](https://tools.ietf.org/html/rfc7519#section-4.1.3)) - identifies the recipient of
 the JWT. Can be set with `JwtAuthProvider.Audience`, defaults to `null` (Optional)

The remaining information in the JWT Payload is used to populate the Users Session, to maximize interoperability
we've used the most appropriate [Public Claim Names](http://www.iana.org/assignments/jwt/jwt.xhtml) 
where possible:

 - **email** <- `session.Email`
 - **given_name** <- `session.FirstName`
 - **family_name** <- `session.LastName`
 - **name** <- `session.DisplayName`
 - **preferred_username** <- `session.UserName`
 - **picture** <- `session.ProfileUrl`

We also need to capture Users Roles and Permissions but as there's no Public Claim Name for this yet we're using 
[Azure's Active Directory Conventions](https://azure.microsoft.com/en-us/documentation/articles/active-directory-token-and-claims/) where User Roles are stored in **roles** as a JSON Array and similarly, Permissions are stored in **perms**.

To keep the JWT Token small we're only storing the essential User Info above in the Token, which means when
the Token is restored it will only be partially populated. You can detect when a Session was partially 
populated from a JWT Token with the new `FromToken` boolean property.

### Limit to Essential Info

Only the above partial information is included in JWT payloads as JWTs are typically resent with every request that
adds overhead to each HTTP Request so special consideration should be given to limit its payload to only 
include essential information identifying the User, any authorization info or other info that needs to accessed by most requests, 
e.g. TenantId for usage in partitioned queries or Display Info shown on each server generated page, etc.

Any other info is recommended to not be included in JWT's, instead they should be sourced from the App's data sources 
using the identifying user info stored in JWTs when needed. 

You can add any additional properties you want included in JWTs and authenticated User Infos by using the 
`CreatePayloadFilter` and `PopulateSessionFilter` filters below, be mindful to include only minimal essential
info and keep the properties names small to reduce the size (and request overhead) of JWTs.

### Modifying the Payload

Whilst only limited info is embedded in the payload by default, all matching 
[AuthUserSession](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/AuthUserSession.cs)
properties embedded in the token will also be populated on the Session, which you can add to the payload 
using the `CreatePayloadFilter` delegate. So if you also want to have access to when the user was registered 
you can add it to the payload with:

```csharp
new JwtAuthProvider(AppSettings) 
{
    CreatePayloadFilter = (payload,session) => 
        payload["CreatedAt"] = session.CreatedAt.ToUnixTime().ToString()
}
```

You can also use the filter to modify any existing property which you can use to change the behavior of the
JWT Token, e.g. we can add a special exception extending the JWT Expiration to all Users from Acme Inc with:

```csharp
new JwtAuthProvider(AppSettings) 
{
    CreatePayloadFilter = (payload,session) => {
        if (session.Email.EndsWith("@acme.com")) 
            payload["exp"] = DateTime.UtcNow.AddYears(1).ToUnixTime().ToString();
    }
}
```

Likewise you can modify how the Users Session is populated from the custom JWT with the `PopulateSessionFilter`, e.g:

```csharp
new JwtAuthProvider(AppSettings) 
{
    PopulateSessionFilter = (session,payload,req) => 
        session.CreatedAt = long.Parse(payload["CreatedAt"]).FromUnixTime();
}
```

If needed you can also modify JWT Headers with the `CreateHeaderFilter` delegate.

### JWT Signature

JWT Tokens are possible courtesy of the cryptographic signature added to the end of the message that's used 
to Authenticate and Verify that a Message hasn't been tampered with. As long as the message signature 
validates with our `AuthKey` we can be certain the contents of the message haven't changed from when it was 
created by either ourselves or someone else with access to our AuthKey.

JWT standard allows for a number of different Hashing Algorithms although requires at least the **HM256** 
HMAC SHA-256 to be supported which is the default. The full list of Symmetric HMAC and Asymmetric RSA
Algorithms `JwtAuthProvider` supports include:

 - **HS256** - Symmetric HMAC SHA-256 algorithm
 - **HS384** - Symmetric HMAC SHA-384 algorithm
 - **HS512** - Symmetric HMAC SHA-512 algorithm
 - **RS256** - Asymmetric RSA with PKCS#1 padding with SHA-256
 - **RS384** - Asymmetric RSA with PKCS#1 padding with SHA-384
 - **RS512** - Asymmetric RSA with PKCS#1 padding with SHA-512

HMAC is the simplest to use as it lets you use the same AuthKey to Sign and Verify the message. 

But if preferred you can use an RSA Key to sign and verify tokens by changing the `HashAlgorithm` and 
specifying a RSA Private Key:

```csharp
new JwtAuthProvider(AppSettings) { 
    HashAlgorithm = "RS256",
    PrivateKeyXml = AppSettings.GetString("PrivateKeyXml") 
}
```

If you don't have a RSA Private Key, one can be created with:

```csharp
var privateKey = RsaUtils.CreatePrivateKeyParams(RsaKeyLengths.Bit2048);
```

And its public key can be extracted using `ToPublicRsaParameters()` extension method, e.g:

```csharp
var publicKey = privateKey.ToPublicRsaParameters();
```

Then to serialize RSA Keys, you can then export them to XML with:

```csharp
var privateKeyXml = privateKey.ToPrivateKeyXml()
var publicKeyXml = privateKey.ToPublicKeyXml();
```

The behavior of using RSA to sign the JWT Tokens is mostly transparent but instead of using the AuthKey to 
both Sign and Verify the JWT Payload, it's signed with the Private Key and verified using the Public Key.
New tokens will also have the **alg** JWT Header set to **RS256** to reflect the new HashAlgorithm used.

## Encrypted JWE Tokens

Something that's not immediately obvious is that while JWT Tokens are signed to prevent tampering and 
verify authenticity, they're not encrypted and can easily be read by decoding the URL-safe Base64 string.
This is a feature of JWT where it allows Client Apps to inspect the User's claims and hide functionality
they don't have access to, it also means that JWT Tokens are debuggable and can be inspected for whenever 
you need to track down unexpected behavior.

But there may be times when you want to embed sensitive information in your JWT Tokens in which case you'll
want to enable Encryption, which can be done with:

```csharp
new JwtAuthProvider(AppSettings) { 
    PrivateKeyXml = AppSettings.GetString("PrivateKeyXml"),
    EncryptPayload = true
}
```

When turning on encryption, tokens are instead created following the
[JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516#section-3) standard where they'll be
encoded in the 5-part [JWE Compact Serialization](https://tools.ietf.org/html/rfc7516#section-3.1) format:

```
BASE64URL(UTF8(JWE Protected Header)) || '.' ||
BASE64URL(JWE Encrypted Key)          || '.' ||
BASE64URL(JWE Initialization Vector)  || '.' ||
BASE64URL(JWE Ciphertext)             || '.' ||
BASE64URL(JWE Authentication Tag)
```

JwtAuthProvider's JWE implementation uses RSAES OAEP for Key Encryption and AES/128/CBC HMAC SHA256 for
Content Encryption, closely following 
[JWE's AES_128_CBC_HMAC_SHA_256 Example](https://tools.ietf.org/html/rfc7516#appendix-A.2)
where a new MAC Auth and AES Crypt Key and IV are created for each Token. The Content Encryption Key (CEK) 
used to Encrypt and Authenticate the payload is encrypted using the Public Key and decrypted with the 
Private Key so only Systems with access to the Private Key will be able to Decrypt, Validate and Read 
the Token's payload.

## Stateless Auth Microservices

One of JWT's most appealing features is its ability to decouple the System that provides User Authentication 
Services and issues tokens from all the other Systems but are still able provide protected Services although 
no longer needs access to a User database or Session data store to facilitate it, as sessions can now be 
embedded in Tokens and its state maintained and sent by clients instead of accessed from each App Server. 
This is ideal for Microservice architectures where Auth Services can be isolated into a single 
externalized System.

With this use-case in mind we've decoupled `JwtAuthProvider` in 2 classes:

 - [JwtAuthProviderReader](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/JwtAuthProviderReader.cs) - 
Responsible for validating and creating Authenticated User Sessions from tokens
 - [JwtAuthProvider](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/JwtAuthProvider.cs) -
Inherits `JwtAuthProviderReader` to also be able to Issue, Encrypt and provide access to tokens

### Services only Validating Tokens

This lets us configure our Microservices that we want to enable Authentication via JWT Tokens down to just:

```csharp
public override void Configure(Container container)
{
    Plugins.Add(new AuthFeature(() => new AuthUserSession(),
        new IAuthProvider[] {
            new JwtAuthProviderReader(AppSettings) {
                HashAlgorithm = "RS256",
                PublicKeyXml = AppSettings.GetString("PublicKeyXml")
            },
        }));
}
```

Or if you want to just use a single AuthKey for both Issuing and Validating tokens:

```csharp
Plugins.Add(new AuthFeature(() => new AuthUserSession(),
    new [] { new JwtAuthProviderReader(AppSettings) }));
```

Which can be configured in [AppSettings](/appsettings):

```xml
<add key="jwt.AuthKeyBase64" value="{Base64AuthKey}" />
```

Which no longer needs access to a 
[IUserAuthRepository](/auth/authentication-and-authorization#userauth-persistence---the-iuserauthrepository)
or [Sessions](/auth/sessions) since they're populated entirely
from JWT Tokens. Whilst you can use the default **HS256** HashAlgorithm, RSA is ideal for this use-case
as you can limit access to the **PrivateKey** to only the central Auth Service issuing the tokens and then 
only distribute the **PublicKey** to each Service which needs to validate them.

### Service Issuing Tokens

As we can now contain all our Systems Auth Functionality to a single System we can open it up to support 
multiple Auth Providers as it only needs to be maintained in a central location but is still able to 
benefit all our Microservices that are only configured to validate JWT Tokens.

Here's a popular Auth Server configuration example which stores all User Auth information as well as
User Sessions in SQL Server and is configured to support many of ServiceStack's Auth and OAuth providers:

```csharp
public override void Configure(Container container)
{
    //Store UserAuth in SQL Server
    var dbFactory = new OrmLiteConnectionFactory(
        AppSettings.GetString("LiveDb"), SqlServerDialect.Provider);
        
    container.Register<IDbConnectionFactory>(dbFactory);
    container.Register<IAuthRepository>(c =>
        new OrmLiteAuthRepository(dbFactory) { UseDistinctRoleTables = true });

    //Create UserAuth RDBMS Tables
    container.Resolve<IAuthRepository>().InitSchema();

    //Also store User Sessions in SQL Server
    container.RegisterAs<OrmLiteCacheClient, ICacheClient>();
    container.Resolve<ICacheClient>().InitSchema();
    
    //Add Support for 
    Plugins.Add(new AuthFeature(() => new AuthUserSession(),
        new IAuthProvider[] {
            new JwtAuthProvider(AppSettings) {
                HashAlgorithm = "RS256",
                PrivateKeyXml = AppSettings.GetString("PrivateKeyXml")
            },
            new ApiKeyAuthProvider(AppSettings),        //Sign-in with API Key
            new CredentialsAuthProvider(),              //Sign-in with UserName/Password credentials
            new BasicAuthProvider(),                    //Sign-in with HTTP Basic Auth
            new DigestAuthProvider(AppSettings),        //Sign-in with HTTP Digest Auth
            new TwitterAuthProvider(AppSettings),       //Sign-in with Twitter
            new FacebookAuthProvider(AppSettings),      //Sign-in with Facebook
            new YahooOpenIdOAuthProvider(AppSettings),  //Sign-in with Yahoo OpenId
            new OpenIdOAuthProvider(AppSettings),       //Sign-in with Custom OpenId
            new GoogleOAuth2Provider(AppSettings),      //Sign-in with Google OAuth2 Provider
            new LinkedInOAuth2Provider(AppSettings),    //Sign-in with LinkedIn OAuth2 Provider
            new GithubAuthProvider(AppSettings),        //Sign-in with GitHub OAuth Provider
            new YandexAuthProvider(AppSettings),        //Sign-in with Yandex OAuth Provider        
            new VkAuthProvider(AppSettings),            //Sign-in with VK.com OAuth Provider 
        }));
}
```

With this setup we can Authenticate using any of the supported Auth Providers with our central Auth Server, retrieve the generated Token and use it to communicate with any our Microservices configured to validate tokens:

## Retrieve Token from Central Auth Server using Credentials Auth

```csharp
var authClient = new JsonServiceClient(centralAuthBaseUrl);

var authResponse = authClient.Post(new Authenticate {
    provider = "credentials",
    UserName = "user",
    Password = "pass",
    RememberMe = true,
});

var client = new JsonServiceClient(BaseUrl) {
    BearerToken = authResponse.BearerToken //Send JWT in HTTP Authorization Request Header
};
var response = client.Get(new Secured { ... });
```

Once the ServiceClient is configured it can also optionally be converted to send the JWT Token using the `ss-tok` Cookie instead by [calling `ConvertSessionToToken`](/auth/jwt-authprovider#sending-jwt-with-service-clients), e.g:

```csharp

client.Send(new ConvertSessionToToken());

client.BearerToken = null; // No longer needed as JWT is automatically sent in ss-tok Cookie

var response = client.Get(new Secured { ... });
```

### Retrieve Token from Central Auth Server using API Key

You can also choose to Authenticate with any AuthProvider and the `Authenticate` Service will return the JWT Token if Authentication was successful. 

The example below uses the JWT Token authenticates with the central Auth Server via its configured [API Key Auth Provider](/auth/api-key-authprovider). If successful the generated JWT can be populated in any of your Service Clients as normal, e.g:

```csharp
var authClient = new JsonServiceClient(centralAuthBaseUrl) {
    Credentials = new NetworkCredential(apiKey, "")
};

var jwtToken = authClient.Send(new Authenticate()).BearerToken;

var client = new JsonServiceClient(service1BaseUrl) { BearerToken = jwtToken };
var response = client.Get(new Secured { ... });
```

### Retrieve Token with HTTP Basic Auth

```csharp
var authClient = new JsonServiceClient(centralAuthBaseUrl) {
    Credentials = new NetworkCredential(username, password)
};

var jwtToken = authClient.Send(new Authenticate()).BearerToken;
```

### Retrieve Token with Credentials Auth

```csharp
var authClient = new JsonServiceClient(centralAuthBaseUrl);

var jwtToken = authClient.Send(new Authenticate {
    provider = "credentials",
    UserName = username,
    Password = password
}).BearerToken;
```

## Refresh Tokens

Just like JWT Tokens, Refresh Tokens are populated on the `AuthenticateResponse` DTO after successfully 
authenticating via any registered Auth Provider, e.g:

```csharp
var response = client.Post(new Authenticate {
    provider = "credentials",
    UserName = userName,
    Password = password,
});

var jwtToken = response.BearerToken;
var refreshToken = response.RefreshToken;
```

### Automatically refreshing Access Tokens

The `RefreshToken` property in all Service Clients can be used to instruct the client to automatically 
retrieve a new JWT Token behind-the-scenes when the original JWT token has expired, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    BearerToken = jwtToken,
    RefreshToken = refreshToken,
};

var response = client.Send(new Secured());
```

You don't even need to configure the client with a JWT Token as it will also fetch a new one on first use:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RefreshToken = refreshToken,
};

var response = client.Send(new Secured());
```

## Using an alternative JWT Server

By default Service Clients will assume they should call the same ServiceStack Instance at the BaseUrl it's 
configured with to fetch new JWT Tokens. If instead refresh tokens need to be sent to a different server, 
it can be specified using the `RefreshTokenUri` property, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RefreshToken = refreshToken,
    RefreshTokenUri = authBaseUrl + "/access-token"
};
```

## Handling Refresh Tokens Expiring

For the case when Refresh Tokens themselves expire the `WebServiceException` is wrapped in a typed 
`RefreshTokenException` to make it easier to handle initiating the flow to re-authenticate the User, e.g:

```csharp
try
{
    var response = client.Send(new Secured());
} 
catch (RefreshTokenException ex) 
{
    // re-authenticate to get new RefreshToken
}
```

## Lifetimes of tokens

The default expiry time of JWT and Refresh Tokens below can be overridden when registering the `JwtAuthProvider`:

```csharp
new JwtAuthProvider {
    ExpireTokensIn        = TimeSpan.FromDays(14),  // JWT Token Expiry
    ExpireRefreshTokensIn = TimeSpan.FromDays(365), // Refresh Token Expiry
}
```

These expiry times are use-case specific so you'll want to check what values are appropriate for your System.
The `ExpireTokensIn` property controls how long a client is allowed to make Authenticated Requests with the same JWT Token, whilst the `ExpireRefreshTokensIn` property controls how long the client can keep requesting new JWT Tokens using the same Refresh Token before needing to re-authenticate and generate a new one.

### Requires User Auth Repository or IUserSessionSourceAsync

One limitation for Refresh Tokens support is that it must be configured to use a 
[User Auth Repository](/auth/authentication-and-authorization#user-auth-repository)
which is the persisted data source used to rehydrate the User Session that's embedded in the JWT Token.

Users who are not using an `IAuthRepository` can instead implement the `IUserSessionSourceAsync` interface:

```csharp
public interface IUserSessionSourceAsync
{
    Task<IAuthSession> GetUserSessionAsync(string userAuthId, CancellationToken token=default);
}
```

On either their **Custom AuthProvider**, or if preferred register it as a **dependency in the IOC** as an alternative source for populating Sessions in new JWT Tokens created using RefreshToken's. The implementation should only return a populated `IAuthSession` if the User is allowed to sign-in, e.g. if their account is locked or suspended it should throw an Exception:

```csharp
throw HttpError.Forbidden("User is suspended");
```

## Convert Sessions to Tokens

Another useful Service that `JwtAuthProvider` provides is being able to Convert your current Authenticated
Session into a Token. Authenticating via Credentials Auth establishes an **Authenticated Session** with the
server which is captured in the 
[Session Cookies](/auth/sessions#cookie-session-ids)
that gets populated on the HTTP Client. This lets us access protected Services immediately after we've
successfully Authenticated, e.g:

```csharp
var authResponse = client.Send(new Authenticate {
    provider = "credentials",
    UserName = username,
    Password = password
});

var response = client.Get(new Secured { ... });
```

## Request JWT Cookie is set on Authentication

However this only establishes an **Authenticated Session** to a single Server that only lasts until the
session stored on the Server is valid. The easiest way to tell ServiceStack to convert the Session into a
stateless JWT Cookie instead is to set the `UseTokenCookie` option when authenticating, e.g:

```csharp
var authResponse = client.Send(new Authenticate {
    provider = "credentials",
    UserName = username,
    Password = password,
    UseTokenCookie = true
});

//Uses stateless ss-tok Cookie with our Session encapsulated in JWT Token
var response = client.Get(new Secured { ... }); 
var jwtToken = client.GetTokenCookie(); //From ss-tok Cookie
```

This also removes the our Session from the App Servers Cache as now the Users **Authenticated Session** is
contained solely in the JWT Cookie and is valid until the JWT Cookies Expiration, instead of determined
by Server Session State.

## Server Token Cookies

In most cases the easiest way to utilize JWT with your other Auth Providers is to configure `JwtAuthProvider` to use `UseTokenCookie` to
automatically return a JWT Token Cookie for all Auth Providers authenticating via `Authenticate` requests or after a successful OAuth Web Flow
from an [OAuth Provider](/auth/authentication-and-authorization#oauth-providers).

This is what [techstacks.io](https://techstacks.io) uses to maintain Authentication via a JWT Token after Signing in with Twitter or GitHub:

```csharp
Plugins.Add(new AuthFeature(() => new CustomUserSession(), 
    new IAuthProvider[] {
        new TwitterAuthProvider(AppSettings),
        new GithubAuthProvider(AppSettings),    
        new JwtAuthProvider(AppSettings) {
            UseTokenCookie = true,
        }
    }));
```

Clients can then detect whether a user is authenticated by sending an empty `Authenticate` request which either returns a `AuthenticateResponse` DTO
containing basic Session Info for authenticated requests otherwise throws a **401 Unauthorized** response.

So clients will be able to detect whether a user is authenticated with something like:

```ts
const client = new JsonServiceClient(BaseUrl);

async function getSession() {
    try {
        return await client.get(new Authenticate());
    } catch (e) {
        return null;
    }
}

const isAuthenticated = async () => await getSession() != null;

//...

if (await isAuthenticated()) {
    // User is authenticated
}
```

## Converting an existing Authenticated Session into A JWT Token

Another way we can access our Token is to call the `ConvertSessionToToken` Service which also converts our 
currently Authenticated Session into a JWT Token which we can use instead to communicate with all our 
independent Services, e.g:

```csharp
var tokenResponse = client.Send(new ConvertSessionToToken());
var jwtToken = client.GetTokenCookie(); //From ss-tok Cookie

var client2 = new JsonServiceClient(service2BaseUrl) { BearerToken = jwtToken };
var response = client2.Get(new Secured2 { ... });

var client3 = new JsonServiceClient(service3BaseUrl) { BearerToken = jwtToken };
var response = client3.Get(new Secured3 { ... });
```

Tokens are returned in the Secure HttpOnly **ss-tok** Cookie, accessible from the `GetTokenCookie()` 
extension method as seen above.

The default behavior of `ConvertSessionToToken` is to remove the Current Session from the Auth Server 
which will prevent access to protected Services using our previously Authenticated Session. 
If you still want to preserve your existing Session you can indicate this with:

```csharp
var tokenResponse = client.Send(new ConvertSessionToToken { PreserveSession = true });
```

For cases where you don't have access to HTTP Client Cookies you can use the new opt-in `IncludeJwtInConvertSessionToTokenResponse` option on `JwtAuthProvider` to also include the JWT in `AccessToken` property of `ConvertSessionToTokenResponse` Responses which are otherwise only available in the `ss-tok` Cookie.

## Ajax Clients

Using Cookies is the 
[recommended way for using JWT Tokens in Web Applications](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
since the `HttpOnly` Cookie flag will prevent it from being accessible from JavaScript making them immune
to XSS attacks whilst the `Secure` flag will ensure that the JWT Token is only ever transmitted over HTTPS.

You can convert your Session into a Token and set the **ss-tok** Cookie in your web page by sending an Ajax 
request to `/session-to-token`, e.g:

```javascript
$.post("/session-to-token");
```

Likewise this API lets you convert Sessions created by any of the OAuth providers into a stateless JWT Token.

## Switching existing Sites to JWT

Existing sites that already have an [Authenticated Session](/auth/sessions) can convert their current server Session into a JWT Token by sending a `ConvertSessionToToken` Request DTO or an empty **POST** request to its `/session-to-token` user-defined route:

```ts
const authResponse = await client.post(new ConvertSessionToToken());
```

E.g. Single Page App can call this when their Web App is first loaded, which is ignored if the User isn't authenticated but if the Web App is loaded after 
[Signing In via an OAuth Provider](/auth/authentication-and-authorization#oauth-providers) it will convert their OAuth Authenticated Session into a 
stateless client JWT Token Cookie.

This approach is also used by the old [Angular TechStacks](https://github.com/ServiceStackApps/TechStacks) after signing in via Twitter and Github OAuth to [use JWT with a single jQuery Ajax call](https://github.com/ServiceStackApps/TechStacks/blob/78ecd5e390e585c14f616bb27b24e0072b756040/src/TechStacks/TechStacks/js/user/services.js#L30):

```javascript
$.post("/session-to-token");
```

Whilst [Gistlyn uses the Fetch API](https://github.com/ServiceStack/Gistlyn/blob/770768e7f7f6a7258ea948dbe1cee7f09b47ea8d/src/Gistlyn/src/app.tsx#L69) to convert an existing Github OAuth into a JWT Token Cookie:

```ts
fetch("/session-to-token", { method:"POST", credentials:"include" });
```

We've also upgraded [servicestack.net](https://servicestack.net) which as it uses normal Username/Password Credentials Authentication 
(i.e. instead of redirects in OAuth), it doesn't need any additional network calls as we can add the `UseTokenCookie`
option as a hidden variable in our FORM request:

```html
<form id="form-login" action="/auth/login">
    <input type="hidden" name="UseTokenCookie" value="true" />
    ...
</form>
```

Which just like `ConvertSessionToToken` returns a populated session in the **ss-tok** Cookie so now 
both [techstacks.io](https://techstacks.io) and [servicestack.net](https://servicestack.net) can maintain 
uninterrupted Sessions across multiple redeployments without a persistent Sessions cache.

## Fallback Auth and RSA Keys

You can specify multiple fallback AES Auth Keys and RSA Public Keys to allow for smooth key rotations to newer Auth Keys whilst simultaneously being able to verify JWT Tokens signed with a previous key. 

The fallback keys can be configured in code when registering the `JwtAuthProvider`:

```csharp
new JwtAuthProvider {
    AuthKey = authKey2016,
    FallbackAuthKeys = {
        authKey2015,
        authKey2014,
    },
    PrivateKey = privateKey2016,
    FallbackPublicKeys = {
        publicKey2015,
        publicKey2014,
    },
}
```

Or in [AppSettings](/appsettings):

```xml
<appSettings>
    <add key="jwt.AuthKeyBase64" value="{AuthKey2016Base64}" />
    <add key="jwt.AuthKeyBase64.1" value="{AuthKey2015Base64}" />
    <add key="jwt.AuthKeyBase64.2" value="{AuthKey2014Base64}" />

    <add key="jwt.PrivateKeyXml" value="{PrivateKey2016Xml}" />
    <add key="jwt.PublicKeyXml.1" value="{PublicKeyXml2015Xml}" />
    <add key="jwt.PublicKeyXml.2" value="{PublicKeyXml2014Xml}" />
</appSettings>
```

## Send JWTs in HTTP Params

The JWT Auth Provider can **opt-in** to accept JWT's via the Query String or HTML POST FormData with:

```csharp
new JwtAuthProvider {
    AllowInQueryString = true,
    AllowInFormData = true
}
```

This is useful for situations where it's not possible to attach the JWT in the HTTP Request Headers or `ss-tok` Cookie. 

For example if you wanted to authenticate via JWT to a real-time [Server Events stream](/server-events) from a token retrieved from a remote auth server (i.e. so the JWT Cookie isn't already configured with the SSE server) you can [call the /session-to-token API](/auth/jwt-authprovider#ajax-clients) to convert the JWT Bearer Token into a JWT Cookie which will configure it with that domain so the subsequent HTTP Requests to the SSE event stream contains the JWT cookie and establishes an authenticated session:

```ts
var client = new JsonServiceClient(BaseUrl);
client.setBearerToken(JWT);
await client.post(new ConvertSessionToToken());

var sseClient = new ServerEventsClient(BaseUrl, ["*"], {
    handlers: {
        onConnect: e => { 
            console.log(e.isAuthenticated /*true*/, e.userId, e.displayName);
        }
    }
}).start();
```

Unfortunately this wont work in `node.exe` Server Apps (or in integration tests) which doesn't support a central location for configuring domain cookies. One solution that works everywhere is to add the JWT to the `?ss-tok` query string that's used to connect to the `/event-stream` URL, e.g:

```csharp
var sseClient = new ServerEventsClient(BaseUrl, ["*"], {
    resolveStreamUrl: url => appendQueryString(url, { "ss-tok": JWT }),
    handlers: {
        onConnect: e => { 
            console.log(e.isAuthenticated /*true*/, e.userId, e.displayName);
        }
    }
}).start();
```

### Setting the JWT Token Cookie

As the TypeScript `ServerEventsClient` needs to use the browsers native EventSource class to establish the SSE connection it's not able to customize 
the HTTP Request Headers in other clients but as the client shares the same cookies with the browser you can use a JWT Token Cookie either
by Requesting to use a [JWT Token Cookie at Authentication](/auth/jwt-authprovider#request-jwt-cookie-is-set-on-authentication) or by setting the Token
Cookie on the client, [CORS permitting](/corsfeature), e.g:

```js
document.cookie = "ss-tok={Token}";
```

### JWT FormData POST

The stateless nature of JWTs makes it highly versatile to be able to use in a number of difference scenarios, e.g. it could be used to make stateless authenticated requests across different domains without JavaScript (HTTP Headers or Cookies), by embedding it in a HTML Form POST:

```html
<form action="https://remote.org/secure" method="post">
    <input type="hidden" name="ss-tok" value="{JWT}" />
    ...
</form>
```

Although as this enables cross-domain posts it should be enabled with great care.

### Runtime JWT Configuration

To allow for dynamic per request configuration as needed in Multi Tenant applications we've added a new [IRuntimeAppSettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Configuration/IAppSettings.cs) API which can be registered in your `AppHost` to return custom per request configuration. 

E.g. this can be used to return a custom `AuthKey` that should be used to sign JWT Tokens for that request:

```csharp
container.Register<IRuntimeAppSettings>(c => new RuntimeAppSettings { 
    Settings = {
        { nameof(JwtAuthProvider.AuthKey), req => (byte[]) GetAuthKey(GetTenantId(req)) }
    }
});
```

The following `JwtAuthProvider` properties can be overridden by `IRuntimeAppSettings`:

 - `byte[]` AuthKey
 - `RSAParameters` PrivateKey
 - `RSAParameters` PublicKey
 - `List<byte[]>` FallbackAuthKeys
 - `List<RSAParameters>` FallbackPublicKeys

## Multiple Audiences

With the JWT support for issuing and validating JWT's with multiple audiences, you could for example configure the JWT Auth Provider to issue tokens allowing users to access **search** and **analytics** system functions by configuring its `Audiences` property: 

```csharp
new JwtAuthProvider {
    Audiences = { "search", "analytics" }
}
```

This will include both audiences in new JWT's as a JSON Array (if only 1 audience was configured it will continue to be embedded as a string).

When validating a JWT with multiple audiences it only needs to match a single Audience configured with the `JwtAuthProvider`, e.g given the above configuration users that authenticate with a JWT containing:

```
JWT[aud] = null           //= Valid: No Audience specified
JWT[aud] = admin          //= NOT Valid: Wrong Audience specified
JWT[aud] = [search,admin] //= Valid: Partial Audience match
```

## Adhoc JWT APIs

You can retrieve the JWT Token string from the current `IRequest` with:
 
```csharp
string jwt = req.GetJwtToken();
```
 
You can manually convert JWT Tokens into User Sessions with:
 
```csharp
var userSession = JwtAuthProviderReader.CreateSessionFromJwt(base.Request);
```
 
Which is essentially a shorthand for:
 
```csharp
var jwtProvider = AuthenticateService.GetJwtAuthProvider();
var userSession = jwtProvider.ConvertJwtToSession(base.Request, req.GetJwtToken());
```

### Creating JWT Tokens Manually

You can create a custom JWT Token that encapsulates an Authenticated User Session by using JwtAuthProvider's static APIs
to create the JWT Header, JWT Payload then sign and authenticate the token using the configured signing keys in order to 
make authenticated Requests to any remote AppHost configured with the same JwtAuthProvider configuration, e.g:

```csharp
var jwtProvider = new JwtAuthProvider { ... };

var header = JwtAuthProvider.CreateJwtHeader(jwtProvider.HashAlgorithm);
var body = JwtAuthProvider.CreateJwtPayload(new AuthUserSession
    {
        UserAuthId = "1",
        DisplayName = "Test",
        Email = "as@if.com",
        IsAuthenticated = true,
    },
    issuer: jwtProvider.Issuer,
    expireIn: jwtProvider.ExpireTokensIn,
    audience: new[]{ jwtProvider.Audience },
    roles: new[] {"TheRole"},
    permissions: new[] {"ThePermission"});

var jwtToken = JwtAuthProvider.CreateJwt(header, body, jwtProvider.GetHashAlgorithm());
```

The generated JWT Token can then be [used to make Authenticated Requests](#sending-jwt-with-service-clients) 
to any Server configured with the same JwtAuthProvider configuration that the JWT Token was created with, e.g:

```csharp
var client = new JsonServiceClient(baseUrl);
client.SetTokenCookie(jwtToken);

var response = client.Get(new Secured { ... });
```

### Validating JWT Manually

The `IsValidJwt()` and `GetValidJwtPayload()` APIs lets you validate and inspect the contents of a JWT stand-alone, i.e. outside the context of a Request. Given an invalid `expiredJwt` and a `validJwt` you can test the validity and inspect the contents of each with:

```csharp
var jwtProvider = AuthenticateService.GetJwtAuthProvider();

jwtProvider.IsValidJwt(expiredJwt);          //= false
jwtProvider.GetValidJwtPayload(expiredJwt);  //= null


jwtProvider.IsValidJwt(validJwt);            //= true
JsonObject payload = jwtProvider.GetValidJwtPayload(validJwt);

var userId = payload["sub"];
```

## Large Profile Image Handling

As [high res profile images in Microsoft Graph Auth](/releases/v6.html#microsoft-graph-auth) doesn't return CDN URIs to the users profile image that can be referenced within Apps directly, it pushes the burden of profile image management down to every authenticating App server, which to maintain their **statelessness**, means converting into a [Data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), except as it typically returns the high-res image JPEG which far exceeds the maximum **4kb** limit of cookies, it requires resizing in order to make fit (otherwise the JWT Cookie is ignored and Authentication will fail). 

Unfortunately as [Image Resizing is unreliable in Linux](/releases/v6.html#state-of-imaging-on-linux) we've had to adopt an alternative solution that's able to display a users high-res photo whilst still keeping our App server stateless by creating a new [ImagesHandler](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack/ImagesHandler.cs) that the JWT AuthProvider calls `RewriteImageUri()` on to replace any large profile URLs with a link to its `/auth-profiles/{MD5}.jpg` - a URL it also handles serving the original high-res image back to.

This is the solution `AuthFeature` uses by default, pre-configured with:

```csharp
new AuthFeature {
    ProfileImages = new ImagesHandler("/auth-profiles", fallback: Svg.GetStaticContent(Svg.Icons.DefaultProfile))
}
```

Where if using a custom [SavePhotoSize](https://github.com/LegacyTemplates/blazor-wasm/blob/main/MyApp/appsettings.Development.json#L30) will be resized using Microsoft Graph APIs, if the resized image size still exceeds the max allowable size in JWT Cookies it's swapped out for a URL reference to the image which ImageHandler stores in memory. The trade-off of this default is when your Docker App is re-deployed, whilst their stateless authentication keeps them authenticated, the original high-res photo saved in ImageHandler's memory will be lost, which will be replaced with the fallback `Svg.Icons.DefaultProfile` image.

Using an MD5 hash does allow us to maintain URLs that's both predictable in that it will result in the same hash after every sign in, while also preventing information leakage that using a predictable User Id would do. A client-only solution that could retain their avatar across deployments is saving it to localStorage however that pushes the burden down to every client App using your APIs, which could be manageable if you control all of them.

#### Persistent Large Profile Image Handling

For a persistent solution that retains profile images across deployments you can use `PersistentImagesHandler` with the VFS Provider and path for profile images to be written to, e.g:

```csharp
new AuthFeature {
    ProfileImages = new PersistentImagesHandler("/auth-profiles", Svg.GetStaticContent(Svg.Icons.DefaultProfile),
        appHost.VirtualFiles, "/App_Data/auth-profiles")
}
```

When using the default `FileSystemVirtualFiles` VFS provider this would require configuring your Docker App with a persistent `/App_Data` Volume, otherwise using one of the other [Virtual Files Providers](/virtual-file-system) like `S3VirtualFiles` or `AzureBlobVirtualFiles` may be the more preferable solution to keep your Docker Apps stateless.

## Refresh Token Cookies supported in all Service Clients

::include jwt-service-clients.md::

## JWT Configuration
~~~~
The JWT Auth Provider provides the following options to customize its behavior: 

```csharp
class JwtAuthProviderReader
{
    // The RSA Bit Key Length to use
    static RsaKeyLengths UseRsaKeyLength = RsaKeyLengths.Bit2048

    // Different HMAC Algorithms supported
    Dictionary<string, Func<byte[], byte[], byte[]>> HmacAlgorithms

    // Different RSA Signing Algorithms supported
    Dictionary<string, Func<RSAParameters, byte[], byte[]>> RsaSignAlgorithms
    Dictionary<string, Func<RSAParameters, byte[], byte[], bool>> RsaVerifyAlgorithms

    // Whether to only allow access via API Key from a secure connection. (default true)
    bool RequireSecureConnection

    // Run custom filter after JWT Header is created
    Action<JsonObject, IAuthSession> CreateHeaderFilter

    // Run custom filter after JWT Payload is created
    Action<JsonObject, IAuthSession> CreatePayloadFilter

    // Run custom filter after session is restored from a JWT Token
    Action<IAuthSession, JsonObject, IRequest> PopulateSessionFilter

    // Whether to encrypt JWE Payload (default false). 
    // Uses RSA-OAEP for Key Encryption and AES/128/CBC HMAC SHA256 for Content Encryption
    bool EncryptPayload

    // Which Hash Algorithm should be used to sign the JWT Token. (default HS256)
    string HashAlgorithm

    // Whether to only allow processing of JWT Tokens using the configured HashAlgorithm.
    bool RequireHashAlgorithm

    // The Issuer to embed in the token. (default ssjwt)
    string Issuer

    // The Audience to embed in the token. (default null)
    string Audience

    // What Id to use to identify the Key used to sign the token. (3 chars of Base64 Key)
    string KeyId

    // The AuthKey used to sign the JWT Token
    byte[] AuthKey
    // Convenient overload to initialize AuthKey with Base64 string
    string AuthKeyBase64

    // The RSA Private Key used to Sign the JWT Token when RSA is used
    RSAParameters? PrivateKey
    // Convenient overload to initialize the Private Key via exported XML
    string PrivateKeyXml

    // The RSA Public Key used to Verify the JWT Token when RSA is used
    RSAParameters? PublicKey

    // Convenient overload to initialize the Public Key via exported XML
    string PublicKeyXml

    // How long should JWT Tokens be valid for. (default 14 days)
    TimeSpan ExpireTokensIn

    // Convenient overload to initialize ExpireTokensIn with an Integer
    int ExpireTokensInDays

    // How long should JWT Refresh Tokens be valid for. (default 365 days)
    TimeSpan ExpireRefreshTokensIn 

    // Allow custom logic to invalidate JWT Tokens
    Func<JsonObject, IRequest, bool> ValidateToken

    // Allow custom logic to invalidate Refresh Tokens
    Func<JsonObject, IRequest, bool> ValidateRefreshToken

    // Whether to invalidate all JWT Tokens issued before a specified date.
    DateTime? InvalidateTokensIssuedBefore

    // Whether to populate the Bearer Token in the AuthenticateResponse
    bool SetBearerTokenOnAuthenticateResponse

    // Modify the registration of ConvertSessionToToken Service
    Dictionary<Type, string[]> ServiceRoutes
}
```

## Further Examples

More examples of both the new API Key and JWT Auth Providers are available in 
[StatelessAuthTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Server.Tests/Auth/StatelessAuthTests.cs)
and [JWT Token Cookie Example](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/UseCases/JwtAuthProviderTests.cs#L235).
