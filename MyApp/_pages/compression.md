---
title: Compression
---

## Client/Server Request Compression

In addition to [optimized cached Server Responses](/http-caching#server-caching) you can also elect to compress HTTP Requests in any C#/.NET Service Clients by specifying the Compression Type you wish to use, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RequestCompressionType = CompressionTypes.GZip,
};

var client = new JsonHttpClient(baseUrl) {
    RequestCompressionType = CompressionTypes.Deflate,
};

var response = client.Post(new Request { ... });
```

Where sending any HTTP Request containing a Request Body (e.g. POST/PUT) will send a compressed Request body
to the Server where it's now able to be transparently decompressed and deserialized into your Request DTO.

## `[CompressResponse]` Attribute

You can now selectively choose which Services should be compressed with the new `[CompressResponse]` attribute to 
compress responses for clients which support compression, which can be applied to most Response Types, e.g:

```csharp
[CompressResponse]
public class CompressedServices : Service
{
    public object Any(CompressDto request) => new CompressExamplesResponse(); 
    public object Any(CompressString request) => "foo"; 
    public object Any(CompressBytes request) => "foo".ToUtf8Bytes(); 
    public object Any(CompressStream request) => new MemoryStream("foo".ToUtf8Bytes()); 
    public object Any(CompressFile request) => new HttpResult(VirtualFileSources.GetFile("/foo"));

    public object Any(CompressAnyHttpResult request)
    {
        return new HttpResult(new CompressExamplesResponse());    // DTO
        return new HttpResult("foo", "text/plain");               // string
        return new HttpResult("foo".ToUtf8Bytes(), "text/plain"); // bytes
        //etc
    }
}
```

::: info
using `[CompressResponse]` is unnecessary when returning [cached responses](/http-caching) as ServiceStack 
automatically caches and returns the most optimal Response - typically compressed bytes for clients that 
supports compression
:::

## Static File Compression

ServiceStack can also be configured to compress static files with specific file extensions that are larger than 
specific size with the new opt-in Config options below:

```csharp
SetConfig(new HostConfig {
    CompressFilesWithExtensions = { "js", "css" },
    // (optional), only compress .js or .css files > 10k
    CompressFilesLargerThanBytes = 10 * 1024 
});
```

When more fine-grained logic is needed you can override `ShouldCompressFile()` in your AppHost to choose which
static files you want to compress on a per-file basis, e.g:

```csharp
public override bool ShouldCompressFile(IVirtualFile file)
{
    return base.ShouldCompressFile(file) || file.Name == "large.csv";
}
```

#### When to enable Static File Compression

It's more optimal to configure static file compression on the native Web Server that's hosting your ServiceStack 
App than in managed code. You can use [Fiddler](http://www.telerik.com/fiddler) to check if your Web Server (e.g. IIS) 
is already compressing static files in which case you won't want to configure ServiceStack to do it.

No compression is added when running ServiceStack in a self-host, which will benefit from enabling Static File Compression.


## Brotli Compression

**.NET 10+** Apps have access to is .NET Core's `BrotliStream` which is fully supported throughout ServiceStack, e.g. in Cached & Compressed Responses as well as sending compressed Request payloads in Service Clients.

The Brotli implementation is encapsulated within ServiceStack's compression abstractions whose implementations are contained within:

 - **BrotliCompressor** - Brotli (br)
 - **DeflateCompressor** - Deflate (deflate)
 - **GZipCompressor** - GZIP (gzip)

Which all implement the same substitutable interface:

```csharp
public interface IStreamCompressor
{
    string Encoding { get; }
    
    byte[] Compress(string text, Encoding? encoding = null);
    byte[] Compress(byte[] bytes);
    Stream Compress(Stream outputStream, bool leaveOpen=false);

    string Decompress(byte[] zipBuffer, Encoding? encoding = null);
        
    Stream Decompress(Stream zipBuffer, bool leaveOpen=false);

    byte[] DecompressBytes(byte[] zipBuffer);
}
```

That are managed with `StreamCompressors` in the **ServiceStack.Client** package:

```csharp
public static class StreamCompressors
{
    // Is there a compressor registered with this encoding?   
    public static bool SupportsEncoding(string? encoding);

    // return the registered IStreamCompressor implementation for for this
    public static IStreamCompressor? Get(string? encoding);
    
    // Assert there exists a IStreamCompressor for this encoding
    public static IStreamCompressor GetRequired(string encoding);

    // Register a new compressor for a specific encoding (defaults: gzip, deflate, br*) .NET6+
    public static void Set(string encoding, IStreamCompressor compressor);

    // Remove compression support for this encoding
    public static bool Remove(string encoding);
}
```

Containing pre-registered implementations of all popular Brotli, Deflate & gzip HTTP Compression algorithms so there's typically no need to add any yourself.

The preferred compression implementation for a request can be retrieved with `IRequest.GetCompressor()` which determines the implementation to use based on the overridable `GetCompressionType(IRequest request)` method in your AppHost.

### Brotli disabled for Firefox

Brotli is currently not returned for Firefox browsers (by **UserAgent** detection in `AppHost.GetCompressionType()`) which for a yet to be determined reason is the only modern browser that doesn't support .NET's `BrotliStream` output. We'll continue to investigate and remove the restriction when resolved.
