---
slug: virtual-file-system
title: Virtual File System
---

In order to access physical files in view engines from multiple sources, ServiceStack includes its own pluggable virtual file system API that lets it support multiple filesystem backends. 

The virtual file system (VFS) is what allows ServiceStack to support view engines in a standard ASP.NET websites (e.g. serving directories from the root directory) as well in self-hosting stand-alone HttpListener websites and Windows Services serving from the output `/bin` directory as well as embedded resources inside .dlls, [in memory filesystems](/html-css-and-javascript-minification#minify-static-js-css-and-html-files) populated at runtime, [remote datastores like AWS S3](https://github.com/ServiceStack/ServiceStack.Aws#S3VirtualFiles), or in a [remote Azure Blob Storage](https://github.com/ServiceStack/ServiceStack.Azure) or any combination of either.

## Virtual File Systems Available

ServiceStack has the following Virtual Files Sources available:

 - `FileSystemVirtualFiles` - Hard-disk or Network Files and Directories from a specified root directory
 - `MemoryVirtualFiles` - Virtual Files and Folders that can be programmatically populated In Memory
 - `ResourceVirtualFiles` - Embedded Resource Files in .dlls
 - `FileSystemMapping` - Hard-disk or Network files made available under an custom file mapping alias
 - `GistVirtualFiles` - Files stored in a GitHub Gist
 - `S3VirtualFiles` - Files stored on Amazon's S3 Managed File Storage in [ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack.Aws#s3virtualfiles)
 - `AzureBlobVirtualFiles` - Files stored on Azure's Managed Blob Storage in [ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack.Azure)
 - `MultiVirtualFiles` - Any combination of any of the above Virtual File Sources under a cascading configuration

## Embedded Resources

To enable ServiceStack to serve embedded resources in your Website's compiled `.dll` Assembly you'll need to register either an `Assembly` or a `Type` in an Assembly that contains embedded resources, e.g:

```csharp
SetConfig(new HostConfig {
   EmbeddedResourceSources = { typeof(TypeInDllWithEmbeddedResources).Assembly },
   EmbeddedResourceBaseTypes = { typeof(TypeInDllWithEmbeddedResources) } 
});
```

By default ServiceStack automatically includes the Assembly where your `AppHost` is defined which since it's typically the same top-level assembly where all your Website assets are maintained, no configuration is required to serve any embedded resources which are accessible from the same path as it's defined in your VS.NET project. E.g. if you have an embedded resource in your project at `/dir/file.js` it would be available from the same path where ServiceStack is mounted, e.g `http://localhost:1337/dir/file.js`.

### FileSystem Mappings

Custom FileSystem mappings can be easily registered under a specific alias by overriding your AppHost's `AddVirtualFileSources` and registering a custom `FileSystemMapping`, e.g:

```csharp
AddVirtualFileSources.Add(new FileSystemMapping("img", "i:\\images"));
AddVirtualFileSources.Add(new FileSystemMapping("docs", "d:\\documents"));
```

This will let you access File System Resources under the custom `/img` and `/doc` routes, e.g:

 - http://host/img/the-image.jpg
 - http://host/docs/word.doc

### Register additional Virtual File Sources in Plugins

As Virtual File Sources are initialized before plugins are registered your plugin will need to implement `IPreInitPlugin` so any VFS sources are registered in its `Configure()` method, e.g:

```csharp
public class Disk1Plugin : IPlugin, IPreInitPlugin
{
    public void BeforePluginsLoaded(IAppHost appHost)
    {
        // Insert higher priority Virtual Files and the start of VirtualFileSources
        var s3Client = new AmazonS3Client(AwsAccessKey, AwsSecretKey, RegionEndpoint.USEast1);
        appHost.InsertVirtualFileSources.Add(new S3VirtualFiles(s3Client, AwsConfig.S3BucketName));

        // Add additional low priority Virtual Files and the end of VirtualFileSources
        var mountPath = appHost.MapProjectPath("~/App_Data/mount/hdd");
        appHost.AddVirtualFileSources.Add(new FileSystemMapping("disk1", mountPath));
        appHost.AddVirtualFileSources.Add(new FileSystemMapping("disk2", "d:\\hdd"));
    }

    public void Register(IAppHost appHost) {}
}
```

If needed you can use the `MapProjectPath()` API to resolve a physical file path from your projects ContentPath folder. 

Then you can register the plugin with your AppHost as normal, e.g:

```csharp
public override void Configure(Container container)
{
    Plugins.Add(new Disk1Plugin());
}
```

Where your AppHost will serve static files from your plugin's registered path mappings, e.g:

```
/disk1/file.html -> /path/to/project/App_Data/mount/hdd/file.html
/disk2/file.html -> d:\hdd\file.html
```

### Empty MemoryVirtualFiles registered in VirtualFileSources

To enable **shadowing** of the `WebRoot` cascading Virtual File Sources, an empty `MemoryVirtualFiles` has been added to 
`InsertVirtualFileSources` by default where it gets inserted at the start of `VirtualFileSources`, i.e:

```csharp
new AppHost {
    InsertVirtualFileSources = { new MemoryVirtualFiles() } 
}
```

If needed, the individual Memory and FileSystem VFS providers in the WebRoot VFS Sources can be accessed with:

```csharp
var memFs = appHost.VirtualFileSources.GetMemoryVirtualFiles();
var diskFs = appHost.VirtualFileSources.GetFileSystemVirtualFiles();
```

Which are also available from the `HostContext` singleton:

 - `HostContext.MemoryVirtualFiles` - **WebRoot** MemoryVirtualFiles
 - `HostContext.FileSystemVirtualFiles` - **WebRoot** FileSystem

The **WebRoot** Directory and **ContentRoot** Directories are also available from:

 - `HostContext.RootDirectory` - **WebRoot** `wwwroot/` 
 - `HostContext.ContentRootDirectory` - **ContentRoot** `/`

### Populate Virtual Files

We can leverage this to provide an elegant solution for minifying static `.html`, `.css` and `.js` resources by simply pre-loading a new 
**Memory Virtual FileSystem** with minified versions of existing files and giving the Memory FS a higher precedence so any matching requests 
serve up the minified version first with:

```csharp
public class MyPlugin : IPlugin, IPostInitPlugin
{
    public void Register(IAppHost appHost) { }

    public void AfterPluginsLoaded(IAppHost appHost)
    {
        var memFs = appHost.VirtualFileSources.GetMemoryVirtualFiles();

        //Get FileSystem Provider
        var fs = appHost.VirtualFileSources.GetFileSystemVirtualFiles();

        //Process all .html files:
        foreach (var file in fs.GetAllMatchingFiles("*.html"))
        {
            var contents = Minifiers.HtmlAdvanced.Compress(file.ReadAllText());
            memFs.WriteFile(file.VirtualPath, contents);
        }

        //Process all .css files:
        foreach (var file in fs.GetAllMatchingFiles("*.css")
            .Where(file => !file.VirtualPath.EndsWith(".min.css")))
        {
            var contents = Minifiers.Css.Compress(file.ReadAllText());
            memFs.WriteFile(file.VirtualPath, contents);
        }

        //Process all .js files
        foreach (var file in fs.GetAllMatchingFiles("*.js")
            .Where(file => !file.VirtualPath.EndsWith(".min.js")))
        {
            try
            {
                var js = file.ReadAllText();
                var contents = Minifiers.JavaScript.Compress(js);
                memFs.WriteFile(file.VirtualPath, contents);
            }
            catch (Exception ex)
            {
                //Report any errors in StartUpErrors collection on ?debug=requestinfo
                base.OnStartupException(new Exception(
                    $"JSMin Error in {file.VirtualPath}: {ex.Message}"));
            }
        }
    }
}
```

### Registering additional Virtual File Sources

The `InsertVirtualFileSources` can be used to **prepend** additional Virtual File Sources at start giving them the highest priority whilst
`AddVirtualFileSources` **appends** at the end giving them the lowest priority, which your AppHost or plugins can use to 
register additional Virtual File Sources:

```csharp
public class MyPlugin : IPlugin, IPostInitPlugin
{
    public void Register(IAppHost appHost) 
    { 
        appHost.InsertVirtualFileSources.Add(new GistVirtualFiles("6de7993333b457445793f51f6f520ea8"));
        appHost.AddVirtualFileSources.Add(new FileSystemMapping("docs", "d:\\documents"));
    }
}
```

### Using a different Virtual Path Provider

You can also globally replace the VFS used by setting it in your AppHost, e.g. If you only want to use an InMemory File System:

```csharp
base.VirtualFileSources = new MemoryVirtualFiles();
```

Fine-grained control on which VFS to use can also be specified on any [Plugins](/plugins) requiring access to the FileSystem like ServiceStack's built-in HTML ViewEngines, here's how you could override the VFS used in ServiceStack's Razors support:

```csharp
Plugins.Add(new RazorFormat { 
    VirtualFileSources = new MemoryVirtualFiles() 
});
```

### Changing Physical File Path

You can change the physical root path from where ServiceStack serves your files from by changing `Config.WebHostPhysicalPath`, e.g. the current directory for self-hosts is where the **.exe** is run from, during development this is typically `\bin\Release`. You can change the self-host to serve files from your project folder with:

```csharp
SetConfig(new HostConfig {
    WebHostPhysicalPath = MapProjectPath("~/")
});
```

::: info
Where `~/` is resolved from your App's configured `ContentRootPath`
:::

## Overriding Embedded Resources with Static Files

The VFS supports multiple file source locations where you can override embedded files by including your own custom files in the same location as the embedded files. We can see how this works by overriding the built-in templates used in metadata pages:


## GistVirtualFiles

The `GistVirtualFiles` is a particular exciting addition to the collection of available [Virtual File System providers](/virtual-file-system#virtual-file-systems-available). 
Gist's are the perfect way to capture and share a publicly versionable snapshot of files that's validated against a 
authenticated user account - adding an important layer of trust and verification over an anonymous archive download.

GitHub also provide public HTTP API's to access Gist's and their metadata, that scales nicely to support small fileset snapshots where all
content is returned in the public API resource request, as well as supporting larger fileset snapshots where the contents of the gist are 
truncated and its contents are instead downloaded from its `raw_url` in an alternative HTTP Request.

`GistVirtualFiles` provides a transparent VFS abstraction over GitHub's Gist APIs so they can be used interchangeably with all other VFS providers.

#### Heirachal and Binary file Support

On its surface Gists appear to only support a flat list of text files, but `GistVirtualFiles` is able to overcome these limitations by transparently
encoding Binary files to **Base 64** behind the scenes and utilizing `\` back-slashes in file names to maintain a heirachal file structure
where it's able to implement the full VFS Provider abstraction.

ServiceStack includes good heuristics for determining which files are binary on its extension and Content Type, if your Binary file isn't 
recognized you can register its extension with a known binary content type or override the `IsBinaryFilter` predicate:

```csharp
MimeTypes.ExtensionMimeTypes[ext] = contentType; // e.g. MimeTypes.Binary
//MimeTypes.IsBinaryFilter = contentType => ...;
```

#### Read/Write and ReadOnly Gists

It supports both public read-only and read/write gists with a GitHub `accessToken` being needed in order to perform any writes:

```csharp
var gistFs = new GistVirtualFiles(gistId, accessToken);
var gistFsReadOnly = new GistVirtualFiles(gistId);
```

#### Gist Refresh

Behaviourally they differ from other VFS providers in that they're used more as a snapshot instead of a actively modified file system and
their updates and are noticeably slower to both read and write then the other VFS providers. 

To maximize performance the files are stored in memory after the first access and its internal cache only updated when a **Write** operation is performed.

If you're instead using a Gist that changes frequently you can specify how long before refreshing the cache:

```csharp
var gistFs = new GistVirtualFiles(...) {
    RefreshAfter = TimeSpan.FromHours(1)
};
```

GitHub truncates large Gists which `GistVirtualFiles` transparently fetches behind-the-scenes on-demand, you can also eagerly 
fetch all truncated content with:

```csharp
await gistFs.LoadAllTruncatedFilesAsync();
```

### Batched WriteFiles APIs

As Gist HTTP API's are relatively slow, we recommend using the `WriteFiles` **Batched APIs**  so multiple files can be updated in a single HTTP Request.

### Updating HTML and Metadata Page Templates

The HTML templates for the metadata pages are maintained as [embedded html template resources](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack/Templates). 

The VFS lets you replace built-in ServiceStack templates with your own by simply copying the metadata or [HtmlFormat Template files](http://bit.ly/164YbrQ) you want to customize and placing them in your Website Directory at:

```
/Templates/HtmlFormat.html        // The auto HtmlFormat template
/Templates/IndexOperations.html   // The /metadata template
/Templates/OperationControl.html  // Individual operation template
```

Which you can customize locally that ServiceStack will pick up and use instead.

## Writable Virtual File System

The Virtual File System extended `IVirtualFiles` interface extends the read-only `IVirtualPathProvider` interface to offer a read/write API:

```csharp
public interface IVirtualFiles : IVirtualPathProvider
{
  void WriteFile(string filePath, string textContents);
  void WriteFile(string filePath, Stream stream);
  void WriteFiles(IEnumerable<IVirtualFile> files,Func<IVirtualFile,string> toPath=null);
  void AppendFile(string filePath, string textContents);
  void AppendFile(string filePath, Stream stream);
  void DeleteFile(string filePath);
  void DeleteFiles(IEnumerable<string> filePaths);
  void DeleteFolder(string dirPath);

  void WriteFile(string filePath, object contents);
  void AppendFile(string filePath, object contents);
  void WriteFiles(Dictionary<string, string> textFiles); //text files only
  void WriteFiles(Dictionary<string, object> files); //binary or text files
}
```

The single and multi-write File APIs support `object` content values of either `string`, `ReadOnlyMemory<char>`, `byte[]`, 
`ReadOnlyMemory<byte>`, `Stream` and `IVirtualFile` Types.

Additional allocation-efficient `ReadOnlyMemory<T>` APIs are also available as extension methods:

```csharp
void WriteFile(string path, ReadOnlyMemory<char> text);
void WriteFile(string path, ReadOnlyMemory<byte> bytes);
void AppendFile(string path, ReadOnlyMemory<char> text);
void AppendFile(string path, ReadOnlyMemory<byte> bytes);
```

::: info
Folders are implicitly created when writing a file to folders that don't exist
:::

The new `IVirtualFiles` API is available in local FileSystem, In Memory, Gists and S3 Virtual path providers:

 - `FileSystemVirtualFiles`
 - `S3VirtualFiles`
 - `AzureBlobVirtualFiles`
 - `GistVirtualFiles`
 - `MemoryVirtualFiles`

All `IVirtualFiles` providers share the same 
[VirtualPathProviderTests](https://github.com/ServiceStack/ServiceStack.Aws/blob/master/tests/ServiceStack.Aws.Tests/S3/VirtualPathProviderTests.cs)
ensuring a consistent behavior where it's now possible to swap between different file storage backends with simple
configuration as seen in the [Imgur](https://github.com/ServiceStackApps/AwsApps/tree/master/src/AwsApps/imgur) and 
[REST Files](https://github.com/ServiceStackApps/AwsApps/tree/master/src/AwsApps/restfiles) examples.

#### Object APIs

The `object GetContents()` API allow VFS Providers to implement more efficient file access which by default returns `ReadOnlyMemory<char>`
for text files and `ReadOnlyMemory<byte>` for binary files:

```csharp
public interface IVirtualFile
{
    object GetContents();
}
```

The `object` APIs also let you use the same source code to read/write both text and binary files which VFS providers can implement more efficiently:

```csharp
var content = vfs.GetFile(fromVirtualPath).GetContent();
vfs.WriteFile(toVirtualPath, content);
```

In [#Script](https://sharpscript.net) you can access a files text or binary contents with either:

```js
vfs.fileContents(filePath) | to => fileContents
vfs.writeFile(path, fileContents)

vfs.fileTextContents(filePath) | to => textContents
vfs.writeFile(path, textContents)

vfs.fileBytesContent(filePath) | to => binaryContents
vfs.writeFile(path, binaryContents)
```

### VirtualFiles vs VirtualFileSources

As typically when saving uploaded files you'd only want files written to a single explicit File Storage provider,
ServiceStack keeps a distinction between the existing read-only Virtual File Sources it uses internally whenever a 
static file is requested and the new `IVirtualFiles` which is maintained in a separate `VirtualFiles` property on 
`IAppHost` and `Service` base class for easy accessibility:

```csharp
public class IAppHost
{
    // Read/Write Virtual FileSystem. Defaults to Local FileSystem.
    IVirtualFiles VirtualFiles { get; set; }
    
    // Cascading file sources, inc. Embedded Resources, File System, In Memory, S3.
    IVirtualPathProvider VirtualFileSources { get; set; }
}

public class Service : IService //ServiceStack's convenient concrete base class
{
    //...
    public IVirtualFiles VirtualFiles { get; set; }
    public IVirtualPathProvider VirtualFileSources { get; }
}
```

Internally ServiceStack only uses `VirtualFileSources` itself to serve static file requests. 
The new `IVirtualFiles` is a clean abstraction your Services can bind to when saving uploaded files which can be easily
substituted when you want to change file storage backends. If not specified, `VirtualFiles` defaults to your local 
filesystem at your host project's root directory.

### Examples

 - [AWS RazorRockstars](https://github.com/ServiceStack/ServiceStack.Aws#maintain-website-content-in-s3) - Serving all Razor Views and Markdown Content from a S3 bucket
 - [AWS Imgur and REST Files](https://github.com/ServiceStack/ServiceStack.Aws#aws-imgur) - 1 line configuration switch between saving files to local files or S3 Bucket

### [ServiceStack.Gap](https://github.com/ServiceStack/ServiceStack.Gap)

See the ServiceStack.Gap project for different examples of how to create single **.exe** ILMerged applications with Embedded Resources and Compiled Razor Views.

## Implementing a new Virtual File System

The VFS is designed to be implementation agnostic so can be changed to use any file repository, e.g. it could easily be made to support a Redis, RDBMS, embedded Sqlite or other NoSQL back-ends.

Like most of ServiceStack's substitutable API's, the interfaces for the VFS lives in the **ServiceStack.Interfaces.dll** under the [ServiceStack.IO](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Interfaces/IO) namespace.

To reduce the amount of effort to implement a VFS provider you can inherit from the 
[`ServiceStack.VirtualPath.Abstract*`](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Common/VirtualPath) 
that all of ServiceStack's VFS providers inherit from.

Otherwise for a clean-room implementation, you'll need to implement these interfaces in order to create a new VFS Provider:

```csharp
public interface IVirtualPathProvider
{
    IVirtualDirectory RootDirectory { get; }
    string VirtualPathSeparator { get; }
    string RealPathSeparator { get; }

    string CombineVirtualPath(string basePath, string relativePath);

    bool FileExists(string virtualPath);
    bool DirectoryExists(string virtualPath);

    IVirtualFile GetFile(string virtualPath);
    string GetFileHash(string virtualPath);
    string GetFileHash(IVirtualFile virtualFile);

    IVirtualDirectory GetDirectory(string virtualPath);

    IEnumerable<IVirtualFile> GetAllMatchingFiles(string globPattern, int maxDepth = Int32.MaxValue);

    IEnumerable<IVirtualFile> GetAllFiles();
    IEnumerable<IVirtualFile> GetRootFiles();
    IEnumerable<IVirtualDirectory> GetRootDirectories();

    bool IsSharedFile(IVirtualFile virtualFile);
    bool IsViewFile(IVirtualFile virtualFile);
}

public interface IVirtualNode
{
    IVirtualDirectory Directory { get; }
    string Name { get; }
    string VirtualPath { get; }
    string RealPath { get; }
    bool IsDirectory { get; }
    DateTime LastModified { get; }
}

public interface IVirtualFile : IVirtualNode
{
    IVirtualPathProvider VirtualPathProvider { get; }

    string Extension { get; }

    string GetFileHash();

    Stream OpenRead();
    StreamReader OpenText();
    string ReadAllText();

    /// <summary>
    /// Returns ReadOnlyMemory&lt;byte&gt; for binary files or
    /// ReadOnlyMemory&lt;char&gt; for text files   
    /// </summary>
    object GetContents();

    long Length { get; }

    /// <summary>
    /// Refresh file stats for this node if supported
    /// </summary>
    void Refresh();
}

public interface IVirtualDirectory : IVirtualNode, IEnumerable<IVirtualNode>
{
    bool IsRoot { get; }
    IVirtualDirectory ParentDirectory { get; }

    IEnumerable<IVirtualFile> Files { get; }
    IEnumerable<IVirtualDirectory> Directories { get; }

    IVirtualFile GetFile(string virtualPath);
    IVirtualFile GetFile(Stack<string> virtualPath);

    IVirtualDirectory GetDirectory(string virtualPath);
    IVirtualDirectory GetDirectory(Stack<string> virtualPath);

    IEnumerable<IVirtualFile> GetAllMatchingFiles(string globPattern, int maxDepth = Int32.MaxValue);
}
```

### Writable Virtual Files Provider

If you want your VFS provider to support writes where it can used in your `IAppHost.VirtualFiles`, 
your `IVirtualPathProvider` should also implement the interface below:

```csharp
public interface IVirtualFiles : IVirtualPathProvider
{
    void WriteFile(string filePath, string textContents);

    void WriteFile(string filePath, Stream stream);

    /// <summary>
    /// Contents can be either:
    /// string, ReadOnlyMemory&lt;char&gt;, byte[], `ReadOnlyMemory&lt;byte&gt;, Stream or IVirtualFile 
    /// </summary>
    void WriteFile(string filePath, object contents);

    void WriteFiles(IEnumerable<IVirtualFile> files, Func<IVirtualFile, string> toPath = null);

    void WriteFiles(Dictionary<string, string> textFiles);
    void WriteFiles(Dictionary<string, object> files);

    void AppendFile(string filePath, string textContents);

    void AppendFile(string filePath, Stream stream);

    /// <summary>
    /// Contents can be either:
    /// string, ReadOnlyMemory&lt;char&gt;, byte[], `ReadOnlyMemory&lt;byte&gt;, Stream or IVirtualFile 
    /// </summary>
    void AppendFile(string filePath, object contents);

    void DeleteFile(string filePath);

    void DeleteFiles(IEnumerable<string> filePaths);

    void DeleteFolder(string dirPath);
}
```

To ensure behavior conformance your VFS provider, it should also be validated against the existing
[VirtualPathProviderTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/VirtualPathProviderTests.cs)
test suite.
