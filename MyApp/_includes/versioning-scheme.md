All ServiceStack packages are published together in "lockstep" with the same version number so the effort to upgrade ServiceStack projects can be done all at same time, with low frequency. 

ServiceStack Versions adopt the following 3-part versioning scheme:

```
{MAJOR}.{MINOR}.{PATCH}
```

### Major versions

The `{MAJOR}` is reserved for Major releases like [v5 containing structural changes](/releases/v5_0_0) that may require changes to external environment and/or project configurations and support for different .NET Runtimes:

 - `v5.*` - Support for .NET 5.0 and .NET Framework v4.5
 - `v6.*` - Support for .NET 6.0 and .NET Framework v4.7.2
 - `v8.*` - Support for .NET 8.0 and .NET Framework v4.7.2

### Minor versions

The `{MINOR}` version is used for major ServiceStack official releases which will have a `{PATCH}` version of **0**.

#### Patch versions

The `{PATCH}` version is used to distinguish updates from normal releases where a `{PATCH}` above **0** indicates an Enhancement Release.

Whilst we want to minimize the effort for Customers to upgrade we also want to make any fixes or enhancements to the 
previous release available sooner as there are often fixes reported and resolved immediately after each release and made 
available in our **pre-release NuGet packages feed** that most Customers wont get until the next major Release on NuGet. 

To deliver updates sooner we dedicate time immediately after each release to resolving issues and adding enhancements 
to existing features so we can publish update releases before starting work on new major features. 
Update releases will be primarily additive and minimally disruptive so they're safe to upgrade.

- An **even** `{PATCH}` version number indicates an "Update" release published to **NuGet**.
- An **odd** version number indicates a "pre-release" version that's only **available on Feedz.io** or [GitHub Packages](/gh-nuget)

Versioning scheme example:

  - **v5.0.0** - Current Major Release with structural changes
    - v5.0.2 - Enhancement of Major v5.0.0 Release
    - v5.0.3 - Pre-release packages published to MyGet only
    - v5.0.4? - Enhancement of Major v5.0.0 Release (if any)
  - **v5.1.0** - Next Major Release
    - v5.1.1 - Pre-release packages published to MyGet only
    - v5.1.2? - Enhancement of Major v5.1.0 Release (if any)
  - ...
  - **v6.0.0** - Next Major Release with structural changes
