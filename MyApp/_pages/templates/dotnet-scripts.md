---
slug: templates-dotnet-scripts
title: Cross platform dotnet scripts
---

Often most of our [Project Templates](/dotnet-new) need to include scripts to perform different tasks utilized in each project type, e.g. for generating DTOs, running a dev server, publishing release builds, etc. 

To surface these common tasks to the developer we initially used Gulp and Grunt JS Tasks so they would show up in 
[VS .NET's Task Runner Explorer UI](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.TaskRunnerExplorer) however this has 
become dated over time with both Grunt & Gulp.js seeing their usage decline in favor of more advanced build systems like 
[Webpack](https://webpack.js.org) and [rollup.js](https://rollupjs.org) and at the other end targeting to a single IDE like VS.NET no longer makes sense in a post .NET 6 world which needs to support for multiple platforms and IDEs.

## No formal task solution in dotnet projects

Unfortunately .NET doesn't have a formal way to define common tasks for a project as custom XML MS Build tasks are to clunky and hidden to be useful and littering your project with multiple `.bat` and `.sh` scripts for each task is tacky in a modern development workflow.

## Using npm scripts

As this use-case is [well covered in npm](https://css-tricks.com/why-npm-scripts/) using [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts), the natural choice for our [Single Page App Project Templates](/templates/single-page-apps) (which require npm) is to use npm scripts in [package.json](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/package.json):

![](/img/pages/templates/packagejson-scripts.png)

Thanks to Node.js's popularity this convention available in all node installations is both ubiquitous & UX friendly as every developer knows where to look to find tasks available for each project, how each script is implemented, sorted in the order in which they're generally run and all executed the same way with `npm run`, e.g:

```bash
$ npm run dtos
```

As this default convention is so prevalent it has the advantage that modern IDEs like [Rider](https://www.jetbrains.com/rider/) includes UI support where each task can be directly in the UI.

## What about .NET Apps?

Without a better alternative available to .NET projects we've also resorted to using npm scripts for our project templates that don't use npm like our [vuedesktop.com](https://www.vuedesktop.com) project template which only uses [package.json](https://github.com/NetCoreTemplates/vue-desktop/blob/master/package.json) to maintain scripts of its built-in functionality:

![](/img/pages/templates/packagejson-scripts-vuedesktop.png)

Where they can be run from Rider's IDE or using npm's `run`.

## Using dotnet tools to run package.json scripts

Whilst we can assume **node** to be a ubiquitous dependency installed on most Developer workstations, it may not be available in all environments like CI build agents, Docker containers, new VM workspaces, etc. 

So if we're going to standardize on **package.json** scripts for encapsulating a project template's functionality we thought it also prudent to offer a .NET only solution to support environments where an npm dependency is not desirable, so we've added support for executing npm package.json scripts in our [x](/dotnet-tool) and [app](/netcore-windows-desktop) dotnet tools using `x script`, e.g:

```bash
$ x scripts dtos
```

That's also available from the more wrist-friendly alias `x s`, e.g:

```bash
$ x s dtos
$ app s dtos
```

Which can be used interchangeably with `npm run` to execute command scripts on Windows and `bash` scripts on macOS and Linux or WSL.

## Cross platform scripts

Whilst we now have a pure .NET alternative for running **package.json** scripts should we need it, we still have the issue of maintaining scripts to support multiple platforms. Most of the time this isn't an issue when calling cross-platform tools like `x` or `tsc` which supports the same command syntax on all platforms, but it starts to become an issue if also needing to perform some file operations.

An example of this is the script to generate JS DTOs in our [pure JS dep-free Project templates](/create-your-first-webservice#dependency-free-jsonserviceclient--typed-dtos-in-web-pages) which uses TypeScript to transpile the DTOs then needs to move the generated `dtos.js` to `wwwroot`. If only needing to support Windows the script would simply be:

```json
"scripts": {
    "dtos": "x ts && tsc -m umd dtos.ts && move dtos.js wwwroot/dtos.js"
}
```

But we'd need to have a different script that uses `mv` to support macOS & Linux, we could maintain a separate script per platform, e.g:

```json
"scripts": {
    "dtos:win":  "x ts && tsc -m umd dtos.ts && move dtos.js wwwroot/dtos.js",
    "dtos:unix": "x ts && tsc -m umd dtos.ts && mv dtos.js wwwroot/dtos.js"
}
```

But then anything calling it would also need to be platform specific including docs needing to having to differentiate between which platform-specific scripts to run.

One solution is to evaluate a node expression that performs the required file operations, e.g:

```json
"scripts": {
    "dtos": "x ts && tsc -m umd dtos.ts && node -e \"require('fs').renameSync('dtos.js','wwwroot/dtos.js')\""
}
```

In a similar vein we can also evaluate a [#Script Expression](https://sharpscript.net) to perform the cross-platform operations, e.g:

```json
"scripts": {
    "dtos": "x ts && tsc -m umd dtos.ts && x -e \"mv('dtos.js','wwwroot/dtos.js')\""
}
```

Which our latest templates have adopted, that can be run with either `npm run`, `x scripts` or its `x s` alias:

```bash
$ npm run dtos
$ x scripts dtos
$ x s dtos
```

## Shell Script Methods

`#Script` lets you evaluate [1000+ .NET #Script Methods](https://sharpscript.net/docs/scripts-reference) using [JavaScript syntax](https://sharpscript.net/docs/syntax) including a number of common Windows and Bash shell commands:

| #Script        | Windows             | Unix            |
|----------------|---------------------|-----------------|
| mv(from,to)    | MOVE /Y from to     | mv -f from to   |
| cp(from,to)    | COPY /Y from to     | cp -f from to   |
| xcopy(from,to) | XCOPY /E /H from to | cp -R from to   |
| rm(from,to)    | DEL /Y from to      | rm -f from to   |
| rmdir(target)  | RMDIR /Q /S target  | rm -rf target   |
| mkdir(target)  | MKDIR target        | mkdir -p target |
| cat(target)    | type target         | cat target      |
| touch(target)  | CALL >> target      | touch target    |

Using Unix `/` Path separators are replaced to use `\` in Windows commands.

### File and Directory APIs

Alternatively you can also call .NET's [File](https://docs.microsoft.com/en-us/dotnet/api/system.io.file) and [Directory](https://docs.microsoft.com/en-us/dotnet/api/system.io.directory) static methods, e.g:

```json
"scripts": {
    "dtos": "x ts && tsc -m umd dtos.ts && x -e \"File.Move('dtos.js','wwwroot/dtos.js')\""
}
```

| #Script                              |
|--------------------------------------|
| File.Copy(from,to)                   |
| File.Create(path)                    |
| File.Decrypt(path)                   |
| File.Delete(path)                    |
| File.Encrypt(path)                   |
| File.Exists(path)                    |
| File.Move(from,to)                   |
| File.Replace(from,to,backup)         |
| File.ReadAllBytes(path)              |
| File.ReadAllLines(path)              |
| File.ReadAllText(path)               |
| File.WriteAllBytes(path,bytes)       |
| File.WriteAllLines(path,lines)       |
| File.WriteAllText(path,text)         |
| File.AppendAllLines(path,lines)      |
| File.AppendAllText(path,text)        |
| Directory.CreateDirectory(path)      |
| Directory.Delete(path)               |
| Directory.Exists(path)               |
| Directory.GetDirectories(path)       |
| Directory.GetFiles(path)             |
| Directory.GetLogicalDrives()         |
| Directory.GetFileSystemEntries(path) |
| Directory.GetParent(path)            |
| Directory.GetCurrentDirectory()      |
| Directory.GetDirectoryRoot(path)     |
| Directory.Move(from,to)              |
| Directory.Copy(from,to)              |
