---
slug: service-return-types
title: Service Return Types
---

From a birds-eye view ServiceStack can return any of:

  - Any **DTO** object -> serialized to Response ContentType
  - `HttpResult`, `HttpError`, `CompressedResult` or other `IHttpResult` for Customized HTTP response

#### Services should only return Reference Types

If a Value Type like `int` or `long` response is needed, it's recommended to wrap the Value Type in a Response DTO, e.g:

```csharp
public class MyResponse
{
    public int Result { get; set; }
}
```

Alternatively you can return a naked Value Type response by returning it as a `string`, e.g:

```csharp
public object Any(MyRequest request) => "1";
```

## Different Return Types

The following types are not converted (to different Content-Types) but get written directly to the Response Stream:

  - `String`
  - `Stream`
  - `IStreamWriter`
  - `byte[]` - with the `application/octet-stream` Content Type
  - `ReadOnlyMemory<char>`
  - `ReadOnlyMemory<byte>`
  
From the [HelloWorld ServiceStack.UseCase](https://github.com/ServiceStack/ServiceStack.UseCases/blob/master/HelloWorld/Global.asax.cs) demo:

```csharp
public class HelloService : Service
{
    public HelloResponse Get(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };

        //C# client can call with:
        //var response = client.Get(new Hello { Name = "ServiceStack" });
    }

    public string Get(HelloHtml request)
    {
        return $"<h1>Hello, {request.Name}!</h1>";
    }

    [AddHeader(ContentType = "text/plain")]
    public string Get(HelloText request)
    {
        return $"<h1>Hello, {request.Name}!</h1>";
    }

    [AddHeader(ContentType = "image/png")]
    public Stream Get(HelloImage request)
    {
        var width = request.Width.GetValueOrDefault(640);
        var height = request.Height.GetValueOrDefault(360);
        var bgColor = request.Background != null ? Color.FromName(request.Background) : Color.ForestGreen;
        var fgColor = request.Foreground != null ? Color.FromName(request.Foreground) : Color.White;

        var image = new Bitmap(width, height);
        using (var g = Graphics.FromImage(image))
        {
            g.Clear(bgColor);

            var drawString = $"Hello, {request.Name}!";
            var drawFont = new Font("Times", request.FontSize.GetValueOrDefault(40));
            var drawBrush = new SolidBrush(fgColor);
            var drawRect = new RectangleF(0, 0, width, height);

            var drawFormat = new StringFormat {
                LineAlignment = StringAlignment.Center,
                Alignment = StringAlignment.Center };

            g.DrawString(drawString, drawFont, drawBrush, drawRect, drawFormat);

            var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Png);
            return ms;
        }
    }
}
```

#### Live Examples of the above Hello Service:

  - [/hello/ServiceStack](http://bootstrapapi.apphb.com/api/hello/ServiceStack)
    - [/hello/ServiceStack?format=json](http://bootstrapapi.apphb.com/api/hello/ServiceStack?format=json)
  - [/hellotext/ServiceStack](http://bootstrapapi.apphb.com/api/hellotext/ServiceStack)
  - [/hellohtml/ServiceStack](http://bootstrapapi.apphb.com/api/hellohtml/ServiceStack)
  - [/helloimage/ServiceStack?Width=600&height=300&Foreground=Yellow](http://bootstrapapi.apphb.com/api/helloimage/ServiceStack?Width=600&height=300&Foreground=Yellow)


### Content-Type Specific Service Implementations

Service implementations can use `Verb{Format}` method names to provide a different implementation for handling a specific Content-Type, e.g. 
the Service below defines several different implementation for handling the same Request:

```csharp
[Route("/my-request")]
public class MyRequest 
{
    public string Name { get; set; }
}

public class ContentTypeServices : Service
{
    // Handles all other unspecified Verbs/Formats to /my-request
    public object Any(MyRequest request) => ...;

    // Handles GET /my-request for JSON responses
    public object GetJson(MyRequest request) => ..; 

    // Handles POST/PUT/DELETE/etc /my-request for HTML Responses
    public object AnyHtml(MyRequest request) =>  
        $@"<html>
            <body>
                <h1>AnyHtml {request.Name}</h1>
            </body>
        </html>";

    // Handles GET /my-request for HTML Responses
    public object GetHtml(MyRequest request) =>   
        $@"<html>
            <body>
                <h1>GetHtml {request.Name}</h1>
            </body>
        </html>";
}
```

This convention can be used for any of the formats listed in `ContentTypes.KnownFormats`, which by default includes:

 - json
 - xml
 - jsv
 - csv
 - html
 - protobuf
 - msgpack
 - wire

## Partial Content Support

Partial Content Support allows a resource to be split up an accessed in multiple chunks for clients that support HTTP Range Requests. This is a popular feature in download managers for resuming downloads of large files and streaming services for real-time streaming of content (e.g. consumed whilst it's being watched or listened to).

[HTTP Partial Content Support](http://benramsey.com/blog/2008/05/206-partial-content-and-range-requests/) is added in true ServiceStack-style where it's now automatically and transparently enabled for any existing services returning:

#### A Physical File

```csharp
return new HttpResult(new FileInfo(filePath), request.MimeType); 
```

#### A Virtual File

```csharp
return new HttpResult(VirtualFileSources.GetFile(virtualPath)); 
```

#### A Memory Stream

```csharp
return new HttpResult(ms, "audio/mpeg");
```

#### Raw Bytes

```csharp
return new HttpResult(bytes, "image/png");
```

#### Raw Text

```csharp
return new HttpResult(customText, "text/plain");
```

Partial Content was also added to static file downloads served directly through ServiceStack which lets you stream mp3 downloads or should you ever want to your static .html, .css, .js, etc.

You can disable Partial Content support with `Config.AllowPartialResponses = false;`.

See the [PartialContentResultTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/PartialContentResultTests.cs) for more examples.

## Writing directly to the Response Stream

In addition to returning plain C# objects, ServiceStack allows you to return any **Stream** or `IStreamWriterAsync` (which is a bit more flexible on how you write to the response stream):

```csharp
public interface IStreamWriterAsync
{
    Task WriteToAsync(Stream responseStream, CancellationToken token=default);
}
```

Both though allow you to write directly to the Response OutputStream without any additional conversion overhead.

### Customizing HTTP Headers

If you want to customize the HTTP headers at the same time you just need to implement [IHasOptions](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IHasOptions.cs) where any Dictionary Entry is written to the Response HttpHeaders.

```csharp
public interface IHasOptions
{
    IDictionary<string, string> Options { get; }
}
```

Further than that, the IHttpResult allows even finer-grain control of the HTTP output (status code, headers, ...) where you can supply a custom Http Response status code. You can refer to the implementation of the [HttpResult](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/HttpResult.cs) object for a real-world implementation of these above interfaces.

### Further customizing the HTTP Response

See the [Customize HTTP Responses](/customize-http-responses) page for more ways of customizing the HTTP Response.
