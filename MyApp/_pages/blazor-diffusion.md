---
title: Blazor Diffusion
---

The goal of our increasing Blazor investments is to enable a highly productive and capable platform for rapidly developing a majority of internal Apps CRUD functionality as well as enabling a hybrid development model where the management of Back office supporting tables can be quickly implemented using custom AutoQueryGrid components freeing up developers to be able to focus a majority of their efforts where they add the most value - in the bespoke Blazor UI's optimized customer-facing UX.

To best demonstrate its potential we've embarked on development of a new project we're excited to announce that does exactly this!

<div class="not-prose my-8 flex justify-center">
    <a href="https://blazordiffusion.com" class="flex items-center hover:no-underline" title="blazordiffusion.com">
        <svg class="w-20 h-20 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
        <h2 class="border-none text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold">
            <span class="text-purple-600 mr-6">Diffusion</span>
        </h2>
    </a>
</div>

[![blazordiffusion.com](/img/pages/blazor/blazordiffusion.com_splash.png)](https://blazordiffusion.com)


[blazordiffusion.com](https://blazordiffusion.com) is a new ServiceStack.Blazor App front-end for [Stable Diffusion](https://en.wikipedia.org/wiki/Stable_Diffusion) - a deep learning text-to-image model that can generate quality images from a text prompt whose ability to run on commodity GPU hardware makes it 
one of the most exciting Open Source AI projects ever released. If you haven't experienced Stable Diffusion yet, we welcome you to create an account and start building your Stable Diffusion portfolio for FREE!

### Effortless Admin Pages

It's a great example of Hybrid Development in action where the entire user-facing UI is a bespoke Blazor App that's optimized for creating, searching, cataloging and discovering Stable Diffusion generated images, whilst all its supporting admin tasks to manage the back office tables that power the UI were effortlessly implemented with custom AutoQueryGrid components. 

To get a glimpse of this in action we've created a video showing how quick it was to build the first few Admin Pages:

<div class="my-8 flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="tt0ytzVVjEY" style="background-image: url('https://img.youtube.com/vi/tt0ytzVVjEY/maxresdefault.jpg')"></lite-youtube>
</div>

Blazor Diffusion is an example of a real-world App leveraging a number of different ServiceStack features to achieve its functionality that we're using to ["dog food"](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) new ServiceStack features to help identify any friction points or missing functionality that we can feedback into the design and improvements of new and existing features, which it has done for most of the new features in this release.

### Blazor Server or Blazor WASM

To ensure all new ServiceStack.Blazor features continue to work in both Blazor Server and Blazor WASM we're maintaining identical versions of Blazor Diffusion running in both of Blazor's hosting modes:

<div class="py-8 flex justify-center">
    <div class="flex flex-col">
    <a href="https://github.com/NetCoreApps/BlazorDiffusion" class="text-xl text-gray-800 flex">
        <svg class="w-6 h-6 mr-2 align-text-bottom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        <span>NetCoreApps/BlazorDiffusion</span>
    </a>
    <a href="https://github.com/NetCoreApps/BlazorDiffusionWasm" class="mt-2 text-xl text-gray-800 flex">
        <svg class="w-6 h-6 mr-2 align-text-bottom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        <span>NetCoreApps/BlazorDiffusionWasm</span>
    </a>
    </div>
</div>

Where it's initially developed from a Blazor Server project template to take advantage of its fast iterative dev model then uses a [script to export](https://github.com/NetCoreApps/BlazorDiffusionWasm/blob/main/sync.bat) all Pages and Server functionality to a Blazor WASM project template that's optimal for Internet deployments.

### Blazor Diffusion Features

To help discovery we'll link to where new features in this release are used.

<svg class="w-20 h-20 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4c.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>

### Dark Mode

The decision to build [blazordiffusion.com](https://blazordiffusion.com) was in large part due to choosing an App that would look best in Dark Mode, as-is often preferred when viewing images and video. The public UI uses [JS.init() to force Dark Mode](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion/Pages/_Layout.cshtml#L63) whilst the Admin Pages uses a different [AdminLayout.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion/Shared/AdminLayout.razor) that allows dark mode to be toggled on/off as seen in the [BlazorDiffusion Video](https://www.youtube.com/watch?v=tt0ytzVVjEY).

### AutoComplete

The [Create.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion/Pages/Create.razor) uses the new `<Autocomplete>` to quickly select Artists 
and Modifiers.

<div class="mt-8 flex justify-center">
    <a href="https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Pages/Create.razor">
        <img src="/img/pages/blazor/blazordiffusion-Autocomplete.png" style="width:600px">
    </a>
</div>

### Admin Pages

The [/admin](https://github.com/NetCoreApps/BlazorDiffusion/tree/main/BlazorDiffusion/Pages/admin) pages we're all built using [AutoQueryGrid](https://blazor-gallery.jamstacks.net/grid) for its data management and uses [NavList and Breadcrumbs](https://blazor-gallery.jamstacks.net/gallery/navigation) for its navigation.

<div class="flex justify-center">
    <a href="https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Pages/admin/Index.razor">
        <img src="/img/pages/blazor/blazordiffusion-admin-pages.png" style="width:600px">
    </a>
</div>

#### EditForm

The following components make use of `<EditForm>` AutoQueryGrid extensibility to display unique forms for their custom workflow requirements:

 - [Creatives.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Pages/admin/Creatives.razor)
 - [ArtifactAutoQueryGrid.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Shared/admin/ArtifactAutoQueryGrid.razor)
 - [ArtifactReportsAutoQueryGrid.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Shared/admin/ArtifactReportsAutoQueryGrid.razor)

```csharp
<AutoQueryGrid @ref=@grid Model="Creative" Apis="Apis.AutoQuery<QueryCreatives,UpdateCreative,HardDeleteCreative>()"
               ConfigureQuery="ConfigureQuery">
    <EditForm>
        <div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <CreativeEdit Creative="context" OnClose="grid!.OnEditDone" />
            </div>
        </div>
    </EditForm>
</AutoQueryGrid>
```

### SelectInput

The [Modifiers.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Pages/admin/Modifiers.razor) admin page uses 
[SelectInput EvalAllowableValues](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion.ServiceModel/Creative.cs#L168-L187) feature to populate its options from a C# [AppData](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion.ServiceModel/AppData.cs) property:

```csharp
public class CreateModifier : ICreateDb<Modifier>, IReturn<Modifier>
{
    [ValidateNotEmpty, Required]
    public string Name { get; set; }
    [ValidateNotEmpty, Required]
    [Input(Type="select", EvalAllowableValues = "AppData.Categories")]
    public string Category { get; set; }
    public string? Description { get; set; }
}
```

<div class="mt-8 flex justify-center">
    <img src="/img/pages/blazor/diffusion-CreateModifier.png" class="max-w-screen-md" style="border:1px solid #CACACA">
</div>

### TagInput

The [Artists.razor](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Pages/admin/Artists.razor) admin page uses [declarative TagInput](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion.ServiceModel/Creative.cs#L122-L141) to render its AutoQueryGrid Create and Edit Forms:

```csharp
public class UpdateArtist : IPatchDb<Artist>, IReturn<Artist>
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? YearDied { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Type { get; set; }
}
```

<div class="my-8 flex justify-center">
    <img src="/img/pages/blazor/blazordiffusion-TagInput.png" class="max-w-screen-md" style="border:1px solid #CACACA">
</div>

<h2 id="litestream" class="mx-auto max-w-screen-md text-center py-8 border-none">
    <a href="https://litestream.io">
        <img src="/img/pages/litestream/logo.svg">
    </a>
</h2>

We're excited to be able to leverage our [support for Litestream](/ormlite/litestream) and showcase an example of architecting a production App at minimal cost which avoids paying for expensive managed hosted RDBMS's by effortlessly replicating its SQLite databases to object storage.

<div class="mt-16 mx-auto max-w-7xl px-4">
    <div class="text-center">
        <h3 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block xl:inline">Reduce Complexity &amp; Save Costs</span>
        </h3>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Avoid expensive managed RDBMS servers, reduce deployment complexity, eliminate 
            infrastructure dependencies & save order of magnitude costs vs production hosting
        </p>
    </div>
    <img src="/img/pages/litestream/litestream-costs.svg">
</div>

To make it easy for Blazor Tailwind projects to take advantage of our first-class [Litestream support](/ormlite/litestream), we've created a new video combining these ultimate developer experience & value combo solutions that walks through how to deploy a new Blazor Tailwind SQLite + Litestream App to any Linux server with SSH access, Docker and Docker Compose:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="fY50dWszpw4" style="background-image: url('https://img.youtube.com/vi/fY50dWszpw4/maxresdefault.jpg')"></lite-youtube>

### Useful Blazor Litestream Video Links

- [Blazor Litestream Tutorial](/blazor-litestream)
- [Blazor](https://servicestack.net/blazor)
- [Litestream](https://servicestack.net/litestream)
- [Docker Install](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose Install](https://docs.docker.com/compose/install/linux/#install-using-the-repository)

### Custom SQLite functions

Using SQLite also gives us access to features not available in other RDBMS's, e.g. for the "Explore Similar Artifacts" feature we're using a custom registered C# function that we can use in SQL to find other Artifacts with the nearest background colors in [SearchService.cs](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion.ServiceInterface/SearchService.cs):

```csharp
public static class DbFunctions
{
    public static void RegisterBgCompare(this IDbConnection db)
    {
        var sqliteConn = (SqliteConnection)db.ToDbConnection();
        sqliteConn.CreateFunction("bgcompare", (string a, string b) => ImageUtils.BackgroundCompare(a, b));
    }
}
```

After registering the function with the db connection we can reference it in our typed SQL Expression with OrmLite's `Sql.Custom()` API:

```csharp
db.RegisterBgCompare();
q.SelectDistinct<Artifact, Creative>((a, c) => new {
    a,
    c.UserPrompt,
    c.ArtistNames,
    c.ModifierNames,
    c.PrimaryArtifactId,
    Similarity = Sql.Custom($"bgcompare('{similarToArtifact.Background}',Background)"),
});
```

This same technique is also used for finding similar images by [PerceptualHash](https://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html), [AverageHash](https://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html) & [DifferenceHash](http://01101001.net/programming.php) functions provided by the [ImageHash](https://github.com/coenm/ImageHash) library.

The [SearchService.cs](https://github.com/NetCoreApps/BlazorDiffusion/blob/v0.1/BlazorDiffusion.ServiceInterface/SearchService.cs) itself is a great example of a complex [custom AutoQuery implementation](/autoquery/rdbms#custom-autoquery-implementations) which is solely responsible for providing the entire search functionality on the home page. 

### Hetzner US Cloud

Our analysis of [US Cloud Hosting Providers](https://servicestack.net/blog/finding-best-us-value-cloud-provider) led us to moving to [Hetzner Cloud](https://www.hetzner.com/cloud) for hosting where it costs vastly less than equivalent specs at a major cloud provider. But this also meant we also had to look elsewhere to also avoid AWS's expensive egress costs for S3 for image storage which can easily get out of control for a highly traffic image host. 

### R2 Virtual Files Provider

Fortunately we were in time to take advantage of Cloudflare's inexpensive [R2 Object Storage solution](https://www.cloudflare.com/products/r2/) with **$0 egress fees**, together with their generous free tier and ability to serve R2 assets behind their free CDN, we ended up with great value and performance managed cloud storage solution with the only cost expected in the near future to be R2's **$0.015 / GB storage** cost.

R2 is mostly S3 compatible however it needed a custom `S3VirtualFiles` provider to workaround missing features which is being maintained in the new `R2VirtualFiles` VFS provider.

### Files Upload Transformer

The [Managed Files Upload Feature](/locode/files-overview) is configured in [Configure.AppHost.cs](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Configure.AppHost.cs) and used for all website File Uploads:

```csharp
var appFs = VirtualFiles = new R2VirtualFiles(s3Client, appConfig.ArtifactBucket);
Plugins.Add(new FilesUploadFeature(
    new UploadLocation("artifacts", appFs,
        readAccessRole: RoleNames.AllowAnon,
        maxFileBytes: AppData.MaxArtifactSize),
    new UploadLocation("avatars", appFs, allowExtensions: FileExt.WebImages, 
        // Use unique URL to invalidate CDN caches
        resolvePath: ctx => X.Map((CustomUserSession)ctx.Session, x => $"/avatars/{x.RefIdStr[..2]}/{x.RefIdStr}/{ctx.FileName}")!,
        maxFileBytes: AppData.MaxAvatarSize,
        transformFile:ImageUtils.TransformAvatarAsync)
    ));
```

It utilizes the new **transformFile:** option to transform an uploaded file and save a reference to the transformed file instead. This is used to only save a reference to the **128x128** resized avatar used by the App, whilst still persisting the original uploaded image in a [Background MQ](/background-mq) task in case a higher resolution of their avatar is needed later.

```csharp
public class ImageDetails
{
    public static async Task<IHttpFile?> TransformAvatarAsync(FilesUploadContext ctx)
    {
        var originalMs = await ctx.File.InputStream.CopyToNewMemoryStreamAsync();

        // Offload persistance of original image to background task
        using var mqClient = HostContext.AppHost.GetMessageProducer(ctx.Request);
        mqClient.Publish(new DiskTasks {
            SaveFile = new() {
                FilePath = ctx.Location.ResolvePath(ctx),
                Stream = originalMs,
            }
        });

        var resizedMs = await CropAndResizeAsync(originalMs, 128, 128, PngFormat.Instance);

        return new HttpFile(ctx.File)
        {
            FileName = $"{ctx.FileName.LastLeftPart('.')}_128.{ctx.File.FileName.LastRightPart('.')}",
            ContentLength = resizedMs.Length,
            InputStream = resizedMs,
        };
    }

    public static async Task<MemoryStream> CropAndResizeAsync(Stream inStream, int width, int height, IImageFormat format)
    {
        var outStream = new MemoryStream();
        var image = await Image.LoadAsync(inStream);
        using (image)
        {
            var clone = image.Clone(context => context
                .Resize(new ResizeOptions {
                    Mode = ResizeMode.Crop,
                    Size = new Size(width, height),
                }));
            await clone.SaveAsync(outStream, format);
        }
        outStream.Position = 0;
        return outStream;
    }
}
```

### Background MQ

[Background MQ](/background-mq) is utilized to improve API response times by offloading a number of non-essential background tasks in [BackgroundMqServices.cs](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion.ServiceInterface/BackgroundMqServices.cs) to perform functions like:

 - Saving JSON metadata snapshot of Stable Diffusion generated images alongside the images themselves
 - Write Files to R2
 - Recalculating temporal scores and ranking of Artifacts and Albums
 - Recording Analytics
 - Prerendering pages at runtime

### Prerendering Blazor Pages at runtime

The [current prerendering solution](https://blazor-tailwind.jamstacks.net/docs/prerender) built into the Blazor WASM template follows the [JAMStack](https://jamstack.org/) approach of pre-rendering pages at build time, however in order to keep the home page "fresh" and show the newest & most liked images first we needed a solution that pre-renders pages at runtime and publishes them to R2 object storage where the Blazor WASM static assets are deployed to. 

This feature is implemented in [Configure.Ui.cs](https://github.com/NetCoreApps/BlazorDiffusion/blob/main/BlazorDiffusion/Configure.Ui.cs) where it lets you specify the pages to render, any custom parameters and where to save it:

```csharp
container.Register<IPrerenderer>(c => new Prerenderer
{
    BaseUrl = appConfig.BaseUrl,
    VirtualFiles = virtualFiles,
    PrerenderDir = "/prerender",
    Renderer = c.Resolve<IComponentRenderer>(),
    Pages = {
        new(typeof(Pages.Index),  "/index.html",  new() { [nameof(Pages.Index.LazyLoad)] = "false" }),
        new(typeof(Pages.Albums), "/albums.html", new() { [nameof(Pages.Index.LazyLoad)] = "false" }),
    }
});
```

To avoid a dependency to bUnit in our App we've created a new `ComponentRenderer` to render Blazor components to string that's useful if needing to render a Blazor Component to HTML in an API, e.g. you can create a generic API to render any component with:

```csharp
[Route("/render/{Type}")]
public class RenderComponent : IGet, IReturn<string> 
{
    public string Type { get; set; }
}

//...

public async Task<object> Any(RenderComponent request)
{
    var componentType = GetComponentType(request.Type); //TODO resolve Component Type from Name
    var httpContext = ((NetCoreRequest)Request).HttpContext;
    var args = Request.GetRequestParams().ToObjectDictionary();
    var renderer = new ComponentRender();
    var html = await renderer.RenderComponentAsync(componentType, httpContext, args);
    return html;
}
```

Where it will populate a component instance from a QueryString then render it to string that can be called like:

    /render/MyPage?Param1=A&Param2=B

Or if needing to render a component outside of a HTTP Context (e.g. in a Background Task or Console App), you can create a empty HttpContext with the new `HttpContextFactory`, e.g:

```csharp
var testContext = HttpContextFactory.CreateHttpContext(baseUrl);
var renderer = new ComponentRender();
var html = await renderer.RenderComponentAsync(componentType, testContext, args);
```
