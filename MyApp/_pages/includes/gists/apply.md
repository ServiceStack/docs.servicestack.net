## Apply Gists

```txt
Usage: 
  web +                       Show available gists
  web +<name>                 Write gist files locally, e.g:
  web + #<tag>                Search available gists
  web gist <gist-id>          Write all Gist text files to current directory
```

### Available Modifers

The modifiers next to each gist specify where the gist files should be written to:

* `{to:'.'}` - Write to current directory (default)
* `{to:'$HOST'}` - Write to host project (1st folder containing either `appsettings.json,Web.config,App.config,Startup.cs`)
* `{to:'wwwroot/'}` - Write to first sub directories named `wwwroot`
* `{to:'package.json'}` - Write to first directory containing `package.json`
* `{to:'/etc/nginx/sites-available/'}` - Write to absolute folder
* `{to:'$HOME/.my-app/'}` - Write to `$HOME` in unix or `%USERPROFILE%` on windows
* `{to:'${EnumName}/.my-app/'}` - Write to `Environment.SpecialFolder.{EnumName}`, e.g:
* `{to:'$UserProfile/.my-app/'}` - Write to `Environment.SpecialFolder.UserProfile`

### File Name features

Use `\` to in gist file names to write files to sub directories, e.g:

* `wwwroot\js\script.js` - Writes gist file to `wwwroot/js/script.js`

Use `?` at end of filename to indicate optional file that should not be overridden, e.g:

* `wwwroot\login.html?` - Only writes to `wwwroot\login.html` if it doesn't already exist.

### Replacement rules

Any gist file name or contents with different "MyApp" text styles will be replaced with the Project Name in that style, e.g:

- `MyApp` will be replaced with `ProjectName`
- `my-app` will be replaced with `project-name`
- `My App` will be replaced with `Project Name`

### Adding packages

To include nuget package dependencies, create a file in your gist called `_init` with the list of `dotnet` or `nuget` commands:

```
dotnet add package ServiceStack.OrmLite.Sqlite
```