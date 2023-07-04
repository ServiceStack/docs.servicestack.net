---
slug: dotnet-tool
title: ServiceStack's .NET Core Utility Belt
---

Our `x` and `app` dotnet tools are a versatile invaluable companion for all ServiceStack developers where it's 
jam packed with functionality to power a number of exciting scenarios where it serves as a [Sharp App](https://sharpscript.net/docs/sharp-apps) 
delivery platform where they can be run as a .NET Core Windows Desktop App with `app` or as a cross-platform Web App launcher 
using `web` and we've already how it's now a [`#Script` runner](https://sharpscript.net/docs/sharp-scripts) with `x run` and into a 
[Live `#Script` playground](https://sharpscript.net/docs/sharp-scripts#live-script-with-web-watch) with `x watch`.

These tools contains all the functionality ServiceStack Developers or API consumers need that can be used 
[Create ServiceStack projects](/templates/dotnet-new), run [Gist Desktop Apps](https://sharpscript.net/sharp-apps/gist-desktop-apps) 
or generate typed endpoints for consuming ServiceStack Services by either
[Add/Update ServiceStack References](/add-servicestack-reference) or by generating [gRPC client proxies](/grpc#grpc-clients).

## Install

To access available features, install with:

:::sh
dotnet tool install --global x 
:::

### Apple M1

Install on Apple's new M1 Pro and M1 Max ARM chips with:

:::sh
dotnet tool install -g -a x64 x
:::

### Update

Or if you had a previous version installed, update with:

:::sh
dotnet tool update -g x
:::

::: info
Both `x` and `app` have equivalent base functionality, whilst `app` has superset features for richer [Windows-only integration](/netcore-windows-desktop)
:::

## Usage

Then run `x` without any arguments to view Usage:

:::sh
x
:::

```
Usage:

  x new                     List available Project Templates
  x new <template> <name>   Create New Project From Template
  x download <user>/<repo>  Download latest GitHub Repo Release
  x get <url>               Download URL to file                     (-out <file|dir>)
  x stream <url>            Stream URL contents to console stdout

  x mix                     Show available gists to mixin            (Alias '+')
  x mix <name>              Write gist files locally, e.g:           (Alias +init)
  x mix init                Create empty .NET Core ServiceStack App
  x mix [tag]               Search available gists
  x mix <gist-url>          Write all Gist text files to current directory
  x gist <gist-id>          Write all Gist text files to current directory

  x publish                 Publish Current Directory to Gist        (requires token)
  x gist-new <dir>          Create new Gist with Directory Files     (requires token)
  x gist-update <id> <dir>  Update Gist ID with Directory Files      (requires token)
  x gist-open <gist>        Download and open Gist folder            (-out <dir>)

  x <lang>                  Update all ServiceStack References in directory (recursive)
  x <file>                  Update existing ServiceStack Reference (e.g. dtos.cs)
  x <lang>     <url> <file> Add ServiceStack Reference and save to file name
  x csharp     <url>        Add C# ServiceStack Reference            (Alias 'cs')
  x typescript <url>        Add TypeScript ServiceStack Reference    (Alias 'ts')
  x swift      <url>        Add Swift ServiceStack Reference         (Alias 'sw')
  x java       <url>        Add Java ServiceStack Reference          (Alias 'ja')
  x kotlin     <url>        Add Kotlin ServiceStack Reference        (Alias 'kt')
  x dart       <url>        Add Dart ServiceStack Reference          (Alias 'da')
  x fsharp     <url>        Add F# ServiceStack Reference            (Alias 'fs')
  x vbnet      <url>        Add VB.NET ServiceStack Reference        (Alias 'vb')
  x tsd        <url>        Add TypeScript Definition ServiceStack Reference

  x proto <url>             Add gRPC .proto ServiceStack Reference
  x proto <url> <name>      Add gRPC .proto and save to <name>.services.proto
  x proto                   Update all gRPC *.services.proto ServiceStack References
  x proto-langs             Display list of gRPC supported languages
  x proto-<lang> <url>      Add gRPC .proto and generate language    (-out <dir>)
  x proto-<lang> <file|dir> Update gRPC .proto and re-gen language   (-out <dir>)
  x proto-<lang>            Update all gRPC .proto's and re-gen lang (-out <dir>)

  x open                    List of available Sharp Apps
  x open <app>              Install and run Sharp App

  x run                     Run Sharp App in current directory
  x run <name>              Run Installed Sharp App
  x run path/app.settings   Run Sharp App at directory containing specified app.settings

  x install                 List available Sharp Apps to install     (Alias 'l')
  x install <app>           Install Sharp App                        (Alias 'i')

  x uninstall               List Installed Sharp Apps
  x uninstall <app>         Uninstall Sharp App

  x alias                   Show all local gist aliases (for usage in mix or app's)
  x alias <alias>           Print local alias value
  x alias <alias> <gist-id> Set local alias with Gist Id or Gist URL
  x unalias <alias>         Remove local alias

  x shortcut                Create Shortcut for Sharp App
  x shortcut <name>.dll     Create Shortcut for .NET Core App

  x scripts                 List all available package.json scripts
  x scripts <name>          Run package.json script

  x run <name>.ss           Run #Script within context of AppHost   (or <name>.html)
  x watch <name>.ss         Watch #Script within context of AppHost (or <name>.html)
                            Language File Extensions:
                              .ss - #Script source file
                              .sc - #Script `code` source file
                              .l  - #Script `lisp` source file
  x lisp                    Start Lisp REPL

  dotnet tool update -g x   Update to latest version

Options:
    -h, --help, ?             Print this message
    -v, --version             Print this version
    -d, --debug               Run in Debug mode for Development
    -r, --release             Run in Release mode for Production
    -s, --source              Change GitHub Source for App Directory
    -f, --force               Quiet mode, always approve, never prompt   (Alias 'y')
    -e, --eval                Evaluate #Script Code
        --token               Use GitHub Auth Token
        --clean               Delete downloaded caches
        --verbose             Display verbose logging
        --ignore-ssl-errors   Ignore SSL Errors
```

### Add/Update ServiceStack References

This shows us we can Add a ServiceStack Reference with `x <lang> <baseurl>` which will let us create a TypeScript Reference 
to the new [World Validation](/world-validation) App using its `ts` file extension alias:


:::sh
x ts http://validation.web-app.io
:::

Output:
```
Saved to: dtos.ts
```

Or create a C# ServiceStack Reference with:

:::sh
x cs http://validation.web-app.io
:::

Output:
```
Saved to: dtos.cs
```

To update run `x <lang>` which will recursively update all existing ServiceStack References:

:::sh
x ts
:::

Output:
```
Updated: dtos.ts
```

### Integrate with Visual Studio

You can also easily integrate this within your VS.NET dev workflows by [adding it as an External Tool](https://docs.microsoft.com/en-us/visualstudio/ide/managing-external-tools?view=vs-2019) in the **External Tools** dialog box by choosing `Tools > External Tools`:

![](/img/pages/servicestack-reference/tool-ts-reference.png)

|  ||
|-|-|
| Title             | Update TypeScript &Reference |
| Command           | web.exe |
| Arguments         | ts |
| Initial directory | $(ProjectDir) |
|  ||

Which will then let you update all your `*dtos.ts` TypeScript References in your project by clicking on `Tools > Update TypeScript Reference` 
or using the `ALT+T R` keyboard shortcut.

If you wanted to Update your `*dtos.cs` **C# ServiceStack References** instead, just change Arguments to `cs`:

![](/img/pages/servicestack-reference/tool-cs-reference.png)

|  ||
|-|-|
| **Title**             | Update C# &Reference |
| **Command**           | web.exe |
| **Arguments**         | cs |
| **Initial directory** | $(ProjectDir) |
|  ||

Refer to the [x usage output](#usage) above for the arguments or aliases for all other supported languages.

### Integrate with Rider

Just like with VS.NET above you can [add an External Tool](https://www.jetbrains.com/help/rider/Settings_Tools_External_Tools.html) 
in [JetBrains Rider](https://www.jetbrains.com/rider/) by opening the Settings dialog with `CTRL+ALT+S` then searching for `external tools` 
under the **Tools** category:

![](/img/pages/servicestack-reference/rider-tool-ts-reference.png)

|  ||
|-|-|
| **Name**              | Update TypeScript Reference |
| **Command**           | web.exe |
| **Arguments**         | ts |
| **Working directory** | $FileParentDir$ |
|  ||

Now you can update your `*dtos.ts` TypeScript References in your project by clicking on `External Tools > Update TypeScript Reference`
in the right-click context menu:

![](/img/pages/servicestack-reference/rider-tool-ts-reference-run.png)

If you're updating references frequently you can save time by [assigning it a keyboard shortcut](https://www.jetbrains.com/help/rider/Configuring_Keyboard_and_Mouse_Shortcuts.html).

### Create new Project Templates

See [x new](/web-new) for available Project Templates you can create with:

:::sh
x new
:::

### Mix Features into existing ASP.NET Core Apps

The `x` dotnet tool is a versatile utility belt packed with a number of features to simplify discovering, installing, running and deploying 
.NET Core Apps. You can view the full list of supported commands by running `x ?`, e.g. another useful command is using [`x mix`](/mix-tool)
for generating pre-set templates:

```
x mix                     Show available gists to mixin         (Alias '+')
x mix <name>              Write gist files locally, e.g:        (Alias +init)
x mix init                Create empty .NET Core ServiceStack App
x mix [tag]               Search available gists
x gist <gist-id>          Write all Gist text files to current directory
```

View available gists with:

:::sh
x mix
:::

Where you can use `x mix nginx` to generate a common nginx template configuration for reverse proxying .NET Core Apps, making configuring 
[Linux deployment servers for your .NET Core Apps](/netcore-deploy-rsync) less tedious. 

In addition to the pre-set templates, you can create your own [public GitHub gist](https://gist.github.com) with any number of different files customized 
for your Environment that anyone can write to their current directory with **the gist id** or **gist URL**:

:::sh
`x gist <gist-id>`
:::

### Patch JSON files

The `x` dotnet tool also includes a number of utilities for patching JSON files, e.g. you can use `x patch` to patch a JSON file with a [JSON Patch](https://learn.microsoft.com/en-us/aspnet/core/web-api/jsonpatch?view=aspnetcore-7.0).

The `json.patch` file supports the following JSON Patch operations:

| Operation | Notes                                                                              |
|-----------|------------------------------------------------------------------------------------|
| add       | Add a property or array element. For existing property: set value.                 |
| remove    | Remove a property or array element.                                                |
| replace   | Same as remove followed by add at same location.                                   |
| move      | Same as remove from source followed by add to destination using value from source. |
| copy      | Same as add to destination using value from source.                                |
| test      | Return success status code if value at path = provided value.                      |

For example, we could have the following `original.json` file:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "smtp": {}
}
```

We need to fill this `smtp` object with settings such as username, password, host, port, and more. To automate filling these values, we can use the ServiceStack `x` tool to apply a `json.patch`. The `json.patch` file to accomplish this would look something like:

```json
[
  {
    "op": "add",
    "path": "/smtp",
    "value": {
      "UserName": "AWS_ACCESS_KEY_ID",
      "Password": "AWS_SECRET_ACCESS_KEY",
      "Host": "email-smtp.us-east-1.amazonaws.com",
      "Port": 587,
      "From": "email address",
      "FromName": "From Name",
      "Bcc": "bcc email address"
    }
  }
]
```

Once this patch is applied, our `appsettings.json` transforms into:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "smtp": {
    "UserName": "AWS_ACCESS_KEY_ID",
    "Password": "AWS_SECRET_ACCESS_KEY",
    "Host": "email-smtp.us-east-1.amazonaws.com",
    "Port": 587,
    "From": "email address",
    "FromName": "From Name",
    "Bcc": "bcc email address"
  }
}
```

You can apply this patch using the `x` tool's `patch` command:

```bash
x patch appsettings.json.patch
```

This expects both the `appsettings.json.patch` and `appsettings.json` files to be local. Optionally, you can specify both files if their names differ.

```bash
x patch changes.json.patch appsettings.json
```

### Lisp REPL

Lisp's dynamism and extensibility makes it particularly well suited for explanatory programming whose access via a REPL is available 
`x`, `web` and `app` dotnet tools.

The quick demo below shows the kind of exploratory programming available where you can query the `scriptMethods` available, 
query an objects `props`, query the Lisp interpreter's global `symbols` table containing all its global state including all 
defined lisp functions, macros and variables:

[![](/img/pages/sharpscript/web-lisp.gif)](https://youtu.be/RR7yk6ReNnQ)

::: info YouTube
[youtu.be/RR7yk6ReNnQ](https://youtu.be/RR7yk6ReNnQ)
:::

### Annotated REPL Walk through

Here's an annotated version of the demo below which explains what each of the different expressions is doing.

Just like [Sharp Scripts](https://sharpscript.net/docs/sharp-scripts) and [Sharp Apps](https://sharpscript.net/docs/sharp-apps) the Lisp REPL runs within the 
[#Script Pages](https://sharpscript.net/docs/script-pages) ScriptContext [sandbox](https://sharpscript.net/docs/sandbox) that when run from a Sharp App folder, 
starts a .NET Core App Server that simulates a fully configured .NET Core App. 
In this case it's running in the [redis Sharp App](https://github.com/sharp-apps/redis) directory where it was able to access its static web assets
as well as its redis-server connection configured in its [app.settings](https://github.com/sharp-apps/redis/blob/master/app.settings).

```lisp
; quick lisp test!
(+ 1 2 3)

; List of ScriptMethodInfo that the ScriptContext running this Lisp Interpreter has access to
scriptMethods

; first script method
(:0 scriptMethods)

; show public properties of ScriptMethodInfo 
(props (:0 scriptMethods))

; show 1 property per line
(joinln (props (:0 scriptMethods)))

; show both Property Type and Name
(joinln (propTypes (:0 scriptMethods)))

; view the Names of all avaialble script methods
(joinln (map .Name scriptMethods))

; view all script methods starting with 'a'
(globln "a*" (map .Name scriptMethods))

; view all script methods starting with 'env'
(globln "env*" (map .Name scriptMethods))

; print environment info about this machine seperated by spaces
(printlns envOSVersion envMachineName envFrameworkDescription envLogicalDrives)

; expand logical drives
(printlns envOSVersion envMachineName envFrameworkDescription "- drives:" (join envLogicalDrives " "))

; view all current global symbols defined in this Lisp interpreter
symbols

; view all symbols starting with 'c'
(globln "c*" symbols)

; see how many symbols are defined in this interpreter
(count symbols)

; see how many script methods there are available
(count scriptMethods)

; view the method signature for all script methods starting with 'all'
(globln "all*" (map .Signature scriptMethods))

; count all files accessible from the configured ScriptContext
(count allFiles)

; view the public properties of the first IVirtualFile
(props (:0 allFiles))

; display the VirtualPath of all available files
(joinln (map .VirtualPath allFiles))

; display the method signature for all script methods starting with 'findFiles'
(globln "findFiles*" (map .Signature scriptMethods))

; see how many .html files are available to this App
(count (findFiles "*.html"))

; see how many .js files are available to this App
(count (findFiles "*.js"))

; show the VirtualPath of all .html files
(joinln (map .VirtualPath (findFiles "*.html")))

; view the VirtualPath's of the 1st and 2nd .html files
(:0 (map .VirtualPath (findFiles "*.html")))
(:1 (map .VirtualPath (findFiles "*.html")))

; view the text file contents of the 1st and 2nd .html files
(fileTextContents (:0 (map .VirtualPath (findFiles "*.html"))))
(fileTextContents (:1 (map .VirtualPath (findFiles "*.html"))))

; display the method signatures of all script methods starting with 'redis'
(globln "redis*" (map .Signature scriptMethods))

; search for all Redis Keys starting with 'urn:' in the redis-server instances this App is configured with
(redisSearchKeys "urn:*")

; display the first redis search entry
(:0 (redisSearchKeys "urn:*"))

; display the key names of all redis keys starting with 'urn:'
(joinln (map :id (redisSearchKeys "urn:*")))

; find out the redis-server data type of the 'urn:tags' key
(redisCall "TYPE urn:tags")

; view all tags in the 'urn:tags' sorted set
(redisCall "ZRANGE urn:tags 0 -1")

; view the string contents of the 'urn:question:1' key
(redisCall "GET urn:question:1")

; parse the json contents of question 1 and display its tag names
(:Tags (parseJson (redisCall "GET urn:question:1")))

; extract the 2nd tag of question 1
(:1 (:Tags (parseJson (redisCall "GET urn:question:1"))))

; clear the Console screen
clear

; exit the Lisp REPL
quit
```

#### Enable features and access resources with app.settings

You can configure the Lisp REPL with any of the resources and features that [Sharp Apps](https://sharpscript.net/docs/sharp-apps) and 
[Gist Desktop Apps](https://sharpscript.net/docs/gist-desktop-apps) have access to, by creating a plain text `app.settings` file with all the 
features and resources you want the Lisp REPL to have access to, e.g. this [Pure Cloud App app.settings](https://sharpscript.net/docs/sharp-apps#pure-cloud-apps)
allows the Lisp REPL to use [Database Scripts](https://sharpscript.net/docs/db-scripts) against a AWS PostgreSQL RDS server and query remote 
[S3 Virtual Files](/virtual-file-system) using [Virtual File System APIs](https://sharpscript.net/docs/protected-scripts#virtual-file-system-apis):

```
# Note: values prefixed with '$' are resolved from Environment Variables
name AWS S3 PostgreSQL Web App
db postgres
db.connection $AWS_RDS_POSTGRES
files s3
files.config {AccessKey:$AWS_S3_ACCESS_KEY,SecretKey:$AWS_S3_SECRET_KEY,Region:us-east-1,Bucket:rockwind}
```

See the [plugins app.settings](https://sharpscript.net/docs/sharp-apps#registering-servicestack-plugins) for examples of how to load and configure 
[ServiceStack Plugins](/plugins).

::include web-trouble.md::

