---
slug: silverlight-client
title: Silverlight Client
---

The **recommended** way to get Silverlight builds of ServiceStack client libraries is from [NuGet](https://nuget.org/packages/ServiceStack.Client.Silverlight):

[![ServiceStack Silverlight Client on NuGet](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/nuget-servicestack.client.silverlight.png)](https://nuget.org/packages/ServiceStack.Client)

These binaries are custom builds of the full ServiceStack Service Clients providing JSON, JSV and XML ServiceClients. 

#### Requires PCL support in v4.x [ServiceStack.Client](https://nuget.org/packages/ServiceStack.Client) NuGet package.

::: info
Due to restrictions in Silverlight only the Async operations are supported.
:::

## [HelloMobile](https://github.com/ServiceStackApps/HelloMobile)

See the [HelloMobile](https://github.com/ServiceStackApps/HelloMobile) project for more info on ServiceStack's Silverlight and PCL client support including showing re-use of shared libraries between each of the different mobile platforms.

------

### Building Silverlight JSON Service Client from Scratch

Although it is recommended to use the published binaries above, for illustrative purposes, this section below walks through creating a Silverlight client from scratch. This example below shows how to create a JSON ServiceClient.

*Note: The code below has been tested in Silverlight 5.  It should work fine in other versions of Silverlight as well.*

## Please be aware of the following considerations:

### Uses HttpWebRequest with ClientHttp handling

The [Silverlight REST Services Quickstart](http://www.silverlight.net/learn/data-networking/network-services-%28soap,-rest-and-more%29/rest-services-%28silverlight-quickstart%29) describes the different mechanisms of how http calls can be made from Silverlight.  There is the easier-but-heavier WebClient implementation, and the lighter-but-harder HttpWebRequest implementation.  The code below uses the HttpWebRequest implementation, primarily because you cannot manipulate cookies with the WebClient version, but also because it provides better hooks for serializing and deserializing the JSON we want to send to our ServiceStack service.

It also uses the ClientHttp handling instead of BrowserHttp handling. [See the differences here.](http://msdn.microsoft.com/en-us/library/dd920295%28VS.95%29.aspx)  

You may need to put a clientaccesspolicy.xml file in the root of your host.  It depends on the domains of the host and client, and the trust level of the particular Silverlight client application (differs between out-of-browser and between Silverlight versions).  [See MSDN documentation for more info.](http://msdn.microsoft.com/en-us/library/cc645032%28v=VS.95%29.aspx)

### Is Cookie-Aware

In the code below, you will see how cookies can be enabled or disabled.  Because we are using ClientHttp handling, when cookies are enabled, we have to create a custom CookieContainer.

In order to share these cookies with the browser, we are populating from HtmlPage.Document.Cookies before the request, and then setting the cookies back to the browser after getting a response.  This technique allows things like ServiceStack's built-in authentication to work, even if you authenticate in the browser before launching your Silverlight app.

If you don't want to share cookies with the browser, you can set EnableCookies = false, or you can modify the code to persist the CookieContainer in some other way.

### Talks only JSON

The request and response streams are assumed to be JSON, and the Accept and Content-Type headers are set accordingly.  If you want to implement xml or jsv, you will have to adjust the headers and the content appropriately.

##### Using the DataContractJsonSerializer

The only JSON serializer that comes with Silverlight is the [DataContractJsonSerializer](http://msdn.microsoft.com/en-us/library/system.runtime.serialization.json.datacontractjsonserializer%28v=vs.95%29.aspx).  While not as performant as ServiceStack's serializers, performance on the client usually tends not to be as important as on the server (due to load).

Note that if you decide to apply a [DataContract] attribute to your DTO that you must specifically mark all members that you want to serialize with [DataMember].  If you leave them off, all public members will be serialized.

The code below uses this serializer by default.  If you use it, be aware that there is a bug in the DataContractJsonSerializer related to handling of dates that are not of type DateTimeKind.Local.  [Read more here](http://connect.microsoft.com/VisualStudio/feedback/details/723368)

##### Using the ServiceStack JsonSerializer

The Silverlight build of ServiceStack.Text (the one that comes with the ServiceStack.Client.Silverlight) is easy to implement.  There is code in the below sample that is commented out, showing how to do this.  Simply uncomment the code and remove the DCJS implementation, then reference ServiceStack.Text and you now have a faster serializer (one without the date bug).


## Example Usage

### Setting up your DTOs

The regular ServiceStack example DTOs should work:

```csharp
public class Hello
{
    public string Name { get; set; }
}

public class HelloResponse
{
    public string Result { get; set; }
}
```

Your DTO projects will need to be accessible from both Silverlight and your other .Net projects.  There are two ways to accomplish this:

##### Shared Projects

You can use a set of shared project for porting your DTOs to Silverlight.  One should be a regular .Net Class Library (perhaps named MySilverlightApp.DTOs), and another should be a Silverlight Class Library (perhaps named MySilverlightApp.DTOs.Silverlight).  You can use the project linking technique [documented here](http://10rem.net/blog/2009/07/13/sharing-entities-between-wcf-and-silverlight).

You may also want to use the Visual Studio Project Linker add-in, which is [available here](http://visualstudiogallery.msdn.microsoft.com/5e730577-d11c-4f2e-8e2b-cbb87f76c044) and [documented here](http://msdn.microsoft.com/en-us/library/ff921108.aspx).

##### Portable Class Libraries

You can put your DTOs in a single project that is set up as a [Portable Class Library](http://msdn.microsoft.com/en-us/library/gg597391.aspx).  This is a much easier solution, but you will not be able to take on any dependencies.

This means that you cannot use the [Route] attribute on your DTOs with this approach.  Instead, use one of the other ways to register services, such as `Routes.Add()` in your AppHost.Config.

### The ServiceClient Implementation

Here is the actual code that implements the ServiceClient.  If you've followed all of the above instructions, you should be able to use it easily in your application.  Simply change the namespace as you desire.

```csharp
using System;
using System.Net;
using System.Net.Browser;
using System.Runtime.Serialization.Json;
using System.Windows;
using System.Windows.Browser;
//using ServiceStack.Text;  // uncomment if using SS serializer instead of DCJS.

namespace MySilverlightApp
{
    public class ServiceClient<TRequest, TResponse>
        where TRequest : class
        where TResponse : class
    {
        private readonly string _baseUri;

        public bool EnableCookies { get; set; }

        public ServiceClient(string baseUri = "/api")
        {
            // make sure the base uri is set appropriately
            if (!baseUri.StartsWith("http", StringComparison.InvariantCultureIgnoreCase))
            {
                var source = Application.Current.Host.Source;
                
                string rootUri = string.Empty;
                if (source.AbsoluteUri.Contains("ClientBin"))
                {
                    int idx = source.AbsoluteUri.IndexOf("ClientBin");

                    rootUri = source.AbsoluteUri.Substring(0, idx);
                }
                else
                    rootUri = source.AbsoluteUri.Substring(0, source.AbsoluteUri.Length - source.AbsolutePath.Length);
                if (!baseUri.StartsWith("/"))
                    baseUri = "/" + baseUri;
                baseUri = rootUri + baseUri;
            }
            this._baseUri = baseUri;

            // cookies are on by default
            this.EnableCookies = true;
        }

        public void Send(string uri, string method, TRequest data = null)
        {
            // set up the web request
            var webRequest = (HttpWebRequest)WebRequestCreator.ClientHttp.Create(new Uri(_baseUri + uri));
            webRequest.Method = method;

            // if cookies are enabled, pass them in from the browser
            if (this.EnableCookies)
            {
                webRequest.CookieContainer = new CookieContainer();
                webRequest.CookieContainer.SetCookies(new Uri(_baseUri), HtmlPage.Document.Cookies);
            }

            // set the accept header so our response is in json
            webRequest.Accept = "application/json";

            // if we have data to stream, start streaming.  Otherwise we can get the response now.
            if (data != null)
                webRequest.BeginGetRequestStream(RequestCallback, new DataContainer(webRequest, data));
            else
                webRequest.BeginGetResponse(this.ResponseCallback, webRequest);
        }

        private void RequestCallback(IAsyncResult asyncResult)
        {
            try
            {
                // Get the web request stream
                var container = (DataContainer)asyncResult.AsyncState;
                var webRequest = container.WebRequest;
                var stream = webRequest.EndGetRequestStream(asyncResult);

                // set the content type to json
                webRequest.ContentType = "application/json";

                // serialize the object to json and write it to the stream
                var serializer = new DataContractJsonSerializer(typeof(TRequest));
                serializer.WriteObject(stream, container.Data);
                stream.Flush();
                stream.Close();

                // If you want to use ServiceStack's serializer, replace the previous code block with this one.
                //using (var writer = new StreamWriter(stream))
                //{
                //    var serializer = new JsonSerializer<TRequest>();
                //    serializer.SerializeToWriter(container.Data, writer);
                //}


                // now we can get the response
                webRequest.BeginGetResponse(ResponseCallback, webRequest);
            }
            catch (Exception ex)
            {
                // Raise our own event for the error on the UI thread
                var args = new ServiceClientEventArgs<TResponse>(ex);
                Deployment.Current.Dispatcher.BeginInvoke(() => this.OnCompleted(args));
            }

        }

        private void ResponseCallback(IAsyncResult asyncResult)
        {
            try
            {
                // Get the web response
                var webRequest = (HttpWebRequest)asyncResult.AsyncState;
                var webResponse = webRequest.EndGetResponse(asyncResult);

                // Get the web response stream
                var stream = webResponse.GetResponseStream();

                // Deserialize the json data in the response stream
                var serializer = new DataContractJsonSerializer(typeof(TResponse));
                var response = (TResponse)serializer.ReadObject(stream);

                // If you want to use ServiceStack's serializer, replace the previous code block with this one.
                //TResponse response;
                //using (var reader = new StreamReader(stream))
                //{
                //    var serializer = new JsonSerializer<TResponse>();
                //    response = serializer.DeserializeFromReader(reader);
                //}


                // Switch to the UI thread
                var args = new ServiceClientEventArgs<TResponse>(response);
                Deployment.Current.Dispatcher.BeginInvoke(
                    () =>
                    {
                        // if cookies are enabled, pass them back to the browser
                        if (this.EnableCookies && webRequest.CookieContainer != null)
                        {
                            var cookieHeader = webRequest.CookieContainer.GetCookieHeader(new Uri(_baseUri));
                            HtmlPage.Document.Cookies = cookieHeader;
                        }

                        //Raise our own event for the response
                        this.OnCompleted(args);
                    });
            }
            catch (Exception ex)
            {
                // Raise our own event for the error on the UI thread
                var args = new ServiceClientEventArgs<TResponse>(ex);
                Deployment.Current.Dispatcher.BeginInvoke(() => this.OnCompleted(args));
            }
        }

        public void Get(string uri)
        {
            this.Send(uri, "GET");
        }

        public void Post(string uri, TRequest data = null)
        {
            this.Send(uri, "POST", data);
        }

        public void Put(string uri, TRequest data = null)
        {
            this.Send(uri, "PUT", data);
        }

        public void Patch(string uri, TRequest data = null)
        {
            this.Send(uri, "PATCH", data);
        }

        public void Delete(string uri, TRequest data = null)
        {
            this.Send(uri, "DELETE", data);
        }

        public event EventHandler<ServiceClientEventArgs<TResponse>> Completed;

        protected void OnCompleted(ServiceClientEventArgs<TResponse> e)
        {
            var handler = this.Completed;
            if (handler != null)
                handler(this, e);
        }

        private class DataContainer
        {
            public DataContainer(HttpWebRequest webRequest, TRequest data)
            {
                this.WebRequest = webRequest;
                this.Data = data;
            }

            public HttpWebRequest WebRequest { get; private set; }
            public TRequest Data { get; private set; }
        }
    }

    public class ServiceClientEventArgs<TResponse> : EventArgs
        where TResponse : class
    {
        private readonly TResponse _response;
        private readonly Exception _error;

        public ServiceClientEventArgs(TResponse response)
        {
            this._response = response;
        }

        public ServiceClientEventArgs(Exception error)
        {
            this._error = error;
        }

        public TResponse Response
        {
            get { return this._response; }
        }

        public Exception Error
        {
            get { return this._error; }
        }
    }
}
```


# Community Resources

  - [Silverlight, GZip and ServiceStack](http://skov-boisen.dk/?p=214) by [@ssboisen](https://twitter.com/ssboisen)
