---
slug: html-css-and-javascript-minification
title: HTML, CSS and JavaScript Minification
---

As part of our quest to provide a complete and productive solution for developing highly responsive Web and Single Page Apps, ServiceStack now includes minifiers for compressing HTML, CSS and JavaScript available from the new `Minifiers` class: 

```csharp
var minifiedJs = Minifiers.JavaScript.Compress(js);
var minifiedCss = Minifiers.Css.Compress(css);
var minifiedHtml = Minifiers.Html.Compress(html);

// Also minify in-line CSS and JavaScript
var advancedMinifiedHtml = Minifiers.HtmlAdvanced.Compress(html);
```

::: info
Each minifier implements the lightweight [ICompressor](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ICompressor.cs) interface making it trivial to substitute with a custom implementation
:::

#### JS Minifier
For the JavaScript minifier we're using [Ext.Net's C# port](https://github.com/extnet/Ext.NET.Utilities/blob/master/Ext.Net.Utilities/JavaScript/JSMin.cs) of Douglas Crockford's venerable [JSMin](http://crockford.com/javascript/jsmin). 

#### CSS Minifier
The CSS Minifier uses Mads Kristensen simple [CSS Minifer](http://madskristensen.net/post/efficient-stylesheet-minification-in-c). 

#### HTML Compressor
For compressing HTML we're using a [C# Port](http://blog.magerquark.de/c-port-of-googles-htmlcompressor-library/) of Google's excellent [HTML Compressor](https://code.google.com/p/htmlcompressor/) which we've further modified to remove the public API's ugly Java-esque idioms and replaced them with C# properties.

The `HtmlCompressor` also includes a number of well-documented options which can be customized by configuring the available properties on its concrete type, e.g:

```csharp
var htmlCompressor = (HtmlCompressor)Minifier.Html;
htmlCompressor.RemoveComments = false;
```

### Easy win for server generated websites

If your project is not based off one of our optimized [Webpack-powered Single Page App templates](/templates/single-page-apps) or configured to use our earlier [node.js-powered Bundler](https://github.com/ServiceStack/Bundler) Web Optimization solution, these built-in minifiers now offers the easiest solution to effortlessly optimize your existing website which is able to work transparently with your existing Razor Views and static `.js`, `.css` and `.html` files without requiring adding any additional external tooling or build steps to your existing development workflow.

### Optimal Library Bundles

To facilitate splitting JS and CSS assets into multiple bundles without needing to create artificial directories for each bundle
you can use the `!` prefix to exclude files from bundles.

Example from `sharp` [_layout.html](https://github.com/NetCoreTemplates/sharp/blob/master/MyApp/wwwroot/_layout.html):

::: v-pre
```hbs
{{ (debug ? '' : '[hash].min') | to => min }}

{{ [ '!/assets/css/default.css', '/assets/css/', '/css/buttons.css', '/css/svg-auth.css', 
     '/css/svg-icons.css', '/css/app.css' ]
   |> bundleCss({ disk:!debug, out:`/css/lib.bundle${min}.css` }) }}

{{ [ '/assets/css/default.css']
   |> bundleCss({ minify:!debug, cache:!debug, disk:!debug, out:`/css/bundle${min}.css` }) }}
```
:::

Here the App specific `default.css` is excluded when bundling all other `.css` files in the `/assets/css/` directory as
it's included on its own in a separate app **bundle.css** below.

::: v-pre
```hbs
{{ [ '!/assets/js/dtos.js', '!/assets/js/default.js', '/assets/js/jquery.min.js', '/assets/js/' ]
   |> bundleJs({ disk:!debug, out:`/js/lib.bundle${min}.js` }) }} 

{{ [ '/assets/js/dtos.js', '/assets/js/default.js' ]
   |> bundleJs({ minify:!debug, cache:!debug, disk:!debug, out:`/js/bundle${min}.js` }) }}
```
:::

Likewise the App specific `dtos.js` and `default.js` files are excluded from the library bundle and included in its own app **bundle.js**.

The equivalent bundle API's are also available in ServiceStack.Razor projects as seen in the `razor` template's 
[_Layout.cshtml](https://github.com/NetCoreTemplates/razor/blob/master/MyApp/Views/Shared/_Layout.cshtml):

```csharp
@{ 
  var debug = DebugMode;
  var min = debug ? "" : "[hash].min";
}

@Html.BundleCss(new BundleOptions {
    Sources = {
        "!/assets/css/default.css",
        "/assets/css/",
        "/css/buttons.css",
        "/css/svg-auth.css",
        "/css/svg-icons.css",
        "/css/app.css",
    },
    SaveToDisk = !debug,
    OutputTo = $"/css/lib.bundle{min}.css"
})

@Html.BundleCss(new BundleOptions {
    Sources = {
        "/assets/css/default.css",
    },
    Minify = !debug,
    Cache = !debug,
    SaveToDisk = !debug,
    OutputTo = $"/css/bundle{min}.css"
})

//...

@Html.BundleJs(new BundleOptions {
    Sources = {
        "!/assets/js/dtos.js",
        "!/assets/js/default.js",
        "/assets/js/jquery.min.js",
        "/assets/js/",
    },
    SaveToDisk = !debug,
    OutputTo = $"/js/lib.bundle{min}.js"
})

@Html.BundleJs(new BundleOptions {
    Sources = {
        "/assets/js/dtos.js",
        "/assets/js/default.js",
    },
    Minify = !debug,
    Cache = !debug,
    SaveToDisk = !debug,
    OutputTo = $"/js/bundle{min}.js"
})
```

### cssIncludes

Single Page App Templates also makes use of `cssIncludes` to embed multiple `*.css` files inline in the initial page request,
avoiding external resource requests as seen in the `vue-lite` template 
[_layout.html](https://github.com/NetCoreTemplates/vue-lite/blob/master/wwwroot/_layout.html):

::: v-pre
```hbs
{{ 'buttons,svg-auth,app,/assets/css/default.css' | cssIncludes }}
{{ 'svg-icons' | cssIncludes | svgFill('#41B883') }}
```
:::

By default `cssIncludes` references files in the format `/css/{name}.css` which can be overridden by specifying
the Virtual Path to the file. It can be useful to use in conjunction with `svgFill` to change the **fill** color 
of all SVG images in the SVG CSS bundle as seen above.

## Configure NUglify

You can configure your ServiceStack App to use Nuglify's Advanced HTML, CSS, JS Minifiers using [mix](/mix-tool) with:

:::sh
x mix nuglify 
:::

Which will write [Configure.Nuglify.cs](https://gist.github.com/gistlyn/4bdb79d21f199c22b8a86f032c186e2d) to your **HOST** project.

## Integrated Bundling Example

For more detailed information on using ServiceStack's built-in bundling checkout the 
[Integrated Bundling in Vue/React lite templates](/templates/lite#integrated-bundling).


### Minify static `.js`, `.css` and `.html` files

With nothing other than the new minifiers, we can leverage the flexibility in ServiceStack's [Virtual File System](/virtual-file-system) to provide an elegant solution for minifying static `.html`, `.css` and `.js` resources by simply pre-loading the pre-configured Memory Virtual FileSystem with minified versions of existing files and giving the Memory FS a higher precedence so any matching requests serve up the minified version first:

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

A nice benefit of this approach is that it doesn't pollute your project with minified build artifacts, has excellent runtime performance with the minified contents being served from Memory and as the file names remain the same, the links in HTML don't need to be rewritten to reference the minified versions. i.e. When a request is made it just looks through the registered virtual path providers and returns the first match, which given the Memory FS was inserted at the start of the list, returns the minified version.

### Enabled in [servicestack.net](https://servicestack.net)

As this was an quick and non-invasive feature to add, we've enabled it on all [servicestack.net](https://servicestack.net) Razor views and static files. You can `view-source:https://servicestack.net/` (as url in Chrome, Firefox or Opera) to see an example of the resulting minified output. 

### Minify dynamic Razor Views

Minification of Razor Views is easily enabled by specifying `MinifyHtml=true` when registering the `RazorFormat` plugin:

```csharp
Plugins.Add(new RazorFormat {
    MinifyHtml = true,
    UseAdvancedCompression = true,
});
```

Use the `UseAdvancedCompression=true` option if you also want to minify inline js/css, although as this requires a bit more processing you'll want to benchmark it to see if it's providing an overall performance benefit to end users. It's a recommended option if you're caching Razor Pages. Another solution is to minimize the use of in-line js/css and move them to static files to avoid needing in-line js/css compression.
