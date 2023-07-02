---
slug: encrypted-messaging
title: Encrypted Messaging
---

One of the benefits of adopting a message-based design is being able to easily layer functionality and generically add value to all Services, we've seen this recently with [Auto Batched Requests](/auto-batched-requests) which automatically enables each Service to be batched and executed in a single HTTP Request. Similarly the new Encrypted Messaging feature 
enables a secure channel for all Services (inc Auto Batched Requests :) offering protection to clients who can now easily send and receive encrypted messages over unsecured HTTP!

## Encrypted Messaging Overview

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/encrypted-messaging.png)

### Configuration

Encrypted Messaging support is enabled by registering the plugin:

```csharp
Plugins.Add(new EncryptedMessagesFeature {
    PrivateKeyXml = ServerRsaPrivateKeyXml
});
```

Where `PrivateKeyXml` is the Servers RSA Private Key Serialized as XML. 

## Generate a new Private Key

If you don't have an existing one, a new one can be generated with:

```csharp
var rsaKeyPair = RsaUtils.CreatePublicAndPrivateKeyPair();
string ServerRsaPrivateKeyXml = rsaKeyPair.PrivateKey;
```

Once generated, it's important the Private Key is kept confidential as anyone with access will be able to decrypt 
the encrypted messages! Whilst most [obfuscation efforts are ultimately futile](http://stackoverflow.com/a/6018247/85785) the goal should be to contain the private key to your running Web Application, limiting access as much as possible.

Once registered, the EncryptedMessagesFeature enables the 2 Services below:

 - `GetPublicKey` - Returns the Serialized XML of your Public Key (extracted from the configured Private Key)
 - `EncryptedMessage` - The Request DTO which encapsulates all encrypted Requests (can't be called directly)

## Giving Clients the Public Key

To communicate clients need access to the Server's Public Key, it doesn't matter who has accessed the Public Key only that clients use the **real** Servers Public Key. It's therefore not advisable to download the Public Key over unsecure `http://` where traffic can potentially be intercepted and the key spoofed, subjecting them to a [Man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). 

It's safer instead to download the public key over a trusted `https://` url where the servers origin is verified by a trusted [CA](https://en.wikipedia.org/wiki/Certificate_authority). Sharing the Public Key over Dropbox, Google Drive, OneDrive or other encrypted channels are also good options.

Since `GetPublicKey` is just a ServiceStack Service it's easily downloadable using a Service Client:

```csharp
var client = new JsonServiceClient(BaseUrl);
string publicKeyXml = client.Get(new GetPublicKey());
```

If the registered `EncryptedMessagesFeature.PublicKeyPath` has been changed from its default `/publickey`, it can be dowloaded with:

```csharp
string publicKeyXml = client.Get<string>("/my-publickey"); //or with HttpUtils
string publicKeyXml = BaseUrl.CombineWith("/my-publickey").GetStringFromUrl();
```

::: info
To help with verification the SHA256 Hash of the PublicKey is returned in `X-PublicKey-Hash` HTTP Header
:::

## Encrypted Service Client

Once they have the Server's Public Key, clients can use it to get an `EncryptedServiceClient` via the `GetEncryptedClient()` extension method on `JsonServiceClient` or new `JsonHttpClient`, e.g:

```csharp
var client = new JsonServiceClient(BaseUrl);
IEncryptedClient encryptedClient = client.GetEncryptedClient(publicKeyXml);
```

Once configured, clients have access to the familiar typed Service Client API's and productive workflow they're used to with the generic Service Clients, sending typed Request DTO's and returning the typed Response DTO's - rendering the underlying encrypted messages a transparent implementation detail:

```csharp
HelloResponse response = encryptedClient.Send(new Hello { Name = "World" });
response.Result.Print(); //Hello, World!
```

REST Services Example:

```csharp
HelloResponse response = encryptedClient.Get(new Hello { Name = "World" });
```

Auto-Batched Requests Example:

```csharp
var requests = new[] { "Foo", "Bar", "Baz" }.Map(x => 
    new HelloSecure { Name = x });
var responses = encryptedClient.SendAll(requests);
```

When using the `IEncryptedClient`, the entire Request and Response bodies are encrypted including Exceptions which continue to throw a populated `WebServiceException`:

```csharp
try
{
    var response = encryptedClient.Send(new Hello());
}
catch (WebServiceException ex)
{
    ex.ResponseStatus.ErrorCode.Print(); //= ArgumentNullException
    ex.ResponseStatus.Message.Print();   //= Value cannot be null. 
}
```

### Authentication with Encrypted Messaging

Many encrypted messaging solutions use Client Certificates which Servers can use to cryptographically verify a client's identity - providing an alternative to HTTP-based Authentication. We've decided against using this as it would've forced an opinionated implementation and increased burden of PKI certificate management and configuration onto Clients and Servers - reducing the applicability and instant utility of this feature.

We can instead leverage the existing Session-based Authentication Model in ServiceStack letting clients continue to use the existing Auth functionality and Auth Providers they're already used to, e.g:

```csharp
var authResponse = encryptedClient.Send(new Authenticate {
    provider = CredentialsAuthProvider.Name,
    UserName = "test@gmail.com",
    Password = "p@55w0rd",
});
```

Encrypted Messages have their cookies stripped so they're no longer visible in the clear which minimizes their exposure to Session hijacking. This does pose the problem of how we can call authenticated Services if the encrypted HTTP Client is no longer sending Session Cookies? 

Without the use of clear-text Cookies or HTTP Headers there's no longer an *established Authenticated Session* for the `encryptedClient` to use to make subsequent Authenticated requests. What we can do  instead is pass the Session Id in the encrypted body for Request DTO's that implement the new `IHasSessionId` interface, e.g:

```csharp
[Authenticate]
public class HelloAuthenticated : IReturn<HelloAuthenticatedResponse>, 
    IHasSessionId
{
    public string SessionId { get; set; }
    public string Name { get; set; }
}

var response = encryptedClient.Send(new HelloAuthenticated {
    SessionId = authResponse.SessionId,
    Name = "World"
});
```

Here we're injecting the returned Authenticated `SessionId` to access the `[Authenticate]` protected Request DTO. However remembering to do this for every authenticated request can get tedious, a nicer alternative is just setting it once on the `encryptedClient` which will then use it to automatically populate any `IHasSessionId` Request DTO's:

```csharp
encryptedClient.SessionId = authResponse.SessionId;

var response = encryptedClient.Send(new HelloAuthenticated {
    Name = "World"
});
```

::: info
This feature is now supported in **all Service Clients**
:::

### Combined Authentication Strategy

Another potential use-case is to only use Encrypted Messaging when sending any sensitive information and the normal Service Client for other requests. In which case we can Authenticate and send the user's password with the `encryptedClient`:

```csharp
var authResponse = encryptedClient.Send(new Authenticate {
    provider = CredentialsAuthProvider.Name,
    UserName = "test@gmail.com",
    Password = "p@55w0rd",
});
```

But then fallback to using the normal `IServiceClient` for subsequent requests. But as the `encryptedClient` doesn't receive cookies we'd need to set it explicitly on the client ourselves with:

```csharp
client.SetSessionId(authResponse.SessionId);

//Equivalent to:
client.SetCookie("ss-id", authResponse.SessionId);
```

After which the ServiceClient "establishes an authenticated session" and can be used to make Authenticated requests, e.g:

```csharp
var response = await client.GetAsync(new HelloAuthenticated { Name = "World" });
```

### BearerToken in Request DTOs

Similar to the `IHasSessionId` interface Request DTOs can also implement `IHasBearerToken` to send Bearer Tokens as an alternative for sending them in HTTP Headers or Cookies.

This lets you authenticate with Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT](/auth/jwt-authprovider) in [Encrypted Messaging](/auth/encrypted-messaging) requests, e.g:

```csharp
public class Secure : IHasBearerToken
{
    public string BearerToken { get; set; }
    public string Name { get; set; }
}

IEncryptedClient encryptedClient = client.GetEncryptedClient(publicKey);
var response = encryptedClient.Get(new Secure { BearerToken = apiKey, Name = "World" });
```

Where it will be embedded and encrypted along with all content in the Request DTO so it can be sent securely over an unsecured HTTP Request.

Alternatively you can set the `BearerToken` property on the `IEncryptedClient` once where it will automatically populate all Request DTOs 
that implement `IHasBearerToken`, e.g:

```csharp
encryptedClient.BearerToken = apiKey;

var response = encryptedClient.Get(new Secure { Name = "World" });
```

### RSA and AES Hybrid Encryption verified with HMAC SHA-256

The Encrypted Messaging Feature follows a [Hybrid Cryptosystem](https://en.wikipedia.org/wiki/Hybrid_cryptosystem) 
which uses RSA Public Keys for [Asymmetric Encryption](https://en.wikipedia.org/wiki/Public-key_cryptography) 
combined with the performance of AES [Symmetric Encryption](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) 
making it suitable for encrypting large message payloads. The authenticity of Encrypted Data are then verified 
with HMAC SHA-256, essentially following an [Encrypt-then-MAC strategy](http://crypto.stackexchange.com/a/205/25652). 

The key steps in the process are outlined below:

  1. Client creates a new `IEncryptedClient` configured with the Server **Public Key**
  2. Client uses the `IEncryptedClient` to create a EncryptedMessage Request DTO:
     1. Generates a new AES 256bit/CBC/PKCS7 Crypt Key **(Kc)**, Auth Key **(Ka)** and **IV**
     2. Encrypts Crypt Key **(Kc)**, Auth Key **(Ka)** with Servers Public Key padded with OAEP = **(Kc+Ka+P)e**
     3. Authenticates **(Kc+Ka+P)e** with **IV** using HMAC SHA-256 = **IV+(Kc+Ka+P)e+Tag**
     4. Serializes Request DTO to JSON packed with current `Timestamp`, `Verb` and `Operation` = **(M)**
     5. Encrypts **(M)** with Crypt Key **(Kc)** and **IV** = **(M)e**
     6. Authenticates **(M)e** with Auth Key **(Ka)** and **IV** = **IV+(M)e+Tag**
     7. Creates `EncryptedMessage` DTO with Servers `KeyId`, **IV+(Kc+Ka+P)e+Tag** and **IV+(M)e+Tag**
  3. Client uses the `IEncryptedClient` to send the populated `EncryptedMessage` to the remote Server

On the Server, the `EncryptedMessagingFeature` Request Converter processes the `EncryptedMessage` DTO:

  1. Uses Private Key identified by **KeyId** or the current Private Key if **KeyId** wasn't provided
     1. Request Converter Extracts **IV+(Kc+Ka+P)e+Tag** into **IV** and **(Kc+Ka+P)e+Tag**
     2. Decrypts **(Kc+Ka+P)e+Tag** with Private Key into **(Kc)** and **(Ka)**
     3. The **IV** is checked against the nonce Cache, verified it's never been used before, then cached
     4. The **IV+(Kc+Ka+P)e+Tag** is verified it hasn't been tampered with using Auth Key **(Ka)**
     5. The **IV+(M)e+Tag** is verified it hasn't been tampered with using Auth Key **(Ka)**
     6. The **IV+(M)e+Tag** is decrypted using Crypt Key **(Kc)** = **(M)**
     7. The **timestamp** is verified it's not older than `EncryptedMessagingFeature.MaxRequestAge`
     8. Any expired nonces are removed. (The **timestamp** and **IV** are used to prevent replay attacks)
     9. The JSON body is deserialized and resulting **Request DTO** returned from the Request Converter
  2. The converted **Request DTO** is executed in ServiceStack's Request Pipeline as normal
  3. The **Response DTO** is picked up by the EncryptedMessagingFeature **Response Converter**:
     1. Any **Cookies** set during the Request are removed
     2. The **Response DTO** is serialized with the **AES Key** and returned in an `EncryptedMessageResponse`
  4. The `IEncryptedClient` decrypts the `EncryptedMessageResponse` with the **AES Key**
     1. The **Response DTO** is extracted and returned to the caller

A visual of how this all fits together in captured in the high-level diagram below:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/encrypted-messaging.png)

 - Components in **Yellow** show the encapsulated Encrypted Messaging functionality where all encryption and decryption is performed
 - Components in **Blue** show Unencrypted DTO's
 - Components in **Green** show Encrypted content:
    - The AES Keys and IV in **Dark Green** is encrypted by the client using the Server's Public Key
    - The EncryptedRequest in **Light Green** is encrypted with a new AES Key generated by the client on each Request
 - Components in **Dark Grey** depict existing ServiceStack functionality where Requests are executed as normal through the [Service Client](/csharp-client) and [Request Pipeline](/order-of-operations)

All Request and Response DTO's get encrypted and embedded in the `EncryptedMessage` and `EncryptedMessageResponse` DTO's below:

```csharp
public class EncryptedMessage : IReturn<EncryptedMessageResponse>
{
    public string KeyId { get; set; }
    public string EncryptedSymmetricKey { get; set; }
    public string EncryptedBody { get; set; }
}

public class EncryptedMessageResponse
{
    public string EncryptedBody { get; set; }
}
```

The diagram also expands the `EncryptedBody` Content containing the **EncryptedRequest** consisting of the following parts:

 - **Timestamp** - Unix Timestamp of the Request
 - **Verb** - Target HTTP Method
 - **Operation** - Request DTO Name
 - **JSON** - Request DTO serialized as JSON

### Support for versioning Private Keys with Key Rotations

One artifact visible in the above process was the use of a `KeyId`. This is a human readable string used 
to identify the Servers Public Key using the first 7 characters of the Public Key Modulus 
(visible when viewing the Private Key serialized as XML). 
This is automatically sent by `IEncryptedClient` to tell the `EncryptedMessagingFeature` which Private Key 
should be used to decrypt the AES Crypt and Auth Keys.

By supporting multiple private keys, the Encrypted Messaging feature allows the seamless transition to a 
new Private Key without affecting existing clients who have yet to adopt the latest Public Key. 

Transitioning to a new Private Key just involves taking the existing Private Key and adding it to the 
`FallbackPrivateKeys` collection whilst introducing a new Private Key, e.g:

```csharp
Plugins.Add(new EncryptedMessagesFeature
{
    PrivateKey = NewPrivateKey,
    FallbackPrivateKeys = {
        PreviousKey2015,
        PreviousKey2014,
    },
});
```

### Why Rotate Private Keys?

Since anyone who has a copy of the Private Key can decrypt encrypted messages, rotating the private key clients
use limits the amount of exposure an adversary who has managed to get a hold of a compromised private key has. 
i.e. if the current Private Key was somehow compromised, an attacker with access to the encrypted 
network packets will be able to read each message sent that was encrypted with the compromised private key 
up until the Server introduces a new Private Key which clients switches over to.

### Source Code

 - The Client implementation is available in [EncryptedServiceClient.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/EncryptedServiceClient.cs)
 - The Server implementation is available in [EncryptedMessagesFeature.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/EncryptedMessagesFeature.cs)
 - The Crypto Utils used are available in the [RsaUtils.cs](https://github.com/ServiceStack/ServiceStack/blob/3af2526d2f710576a9764d22501af428e85315cb/src/ServiceStack.Client/CryptUtils.cs#L31) and [AesUtils.cs](https://github.com/ServiceStack/ServiceStack/blob/3af2526d2f710576a9764d22501af428e85315cb/src/ServiceStack.Client/CryptUtils.cs#L198)
 - Tests are available in [EncryptedMessagesTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/UseCases/EncryptedMessagesTests.cs)
