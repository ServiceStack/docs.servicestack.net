
If you don't have the [x dotnet tool](/dotnet-new) installed, the quickest way to create a ServiceStack App is to download your preferred template from:

<div class="not-prose">
<h3 class="m-0 py-8 text-4xl text-center text-blue-600"><a href="https://servicestack.net/start">servicestack.net/start</a></h3>
</div>

Alternatively if you're creating multiple projects we recommend installing the **x** dotnet tool which can create every project template:

:::sh
dotnet tool install --global x 
:::

### Empty Projects

There are a few different ways you can create empty ServiceStack projects ordered by their level of emptiness.

To write a minimal .NET 6 Web App to your current directory, [mix](/mix-tool) in the **[init](https://gist.github.com/gistlyn/8026c4c2a7202b99885539109145e12b)** gist files to your current directory:

:::sh
x mix init
:::

To create an empty Single Project Template solution use the [empty](https://github.com/NetCoreTemplates/empty) template:

:::sh
x new empty ProjectName
:::

To create an empty 4 Project solution that adopts ServiceStack's [recommended project structure](/physical-project-structure), use the [web](https://github.com/NetCoreTemplates/web) template:

:::sh
x new web ProjectName
:::

:::info
You can omit the **ProjectName** in all above examples to use the **Directory** Name as the Project Name
:::

### Empty F# Template

Like C# **init** there's also **[init-fsharp](https://gist.github.com/gistlyn/3008acbe218fbcfb8278853825cc7ea3)** gist to create an empty F# Web App:

:::sh
x mix init-fsharp
:::

### Empty VB .NET Template

And **[init-vb](https://gist.github.com/gistlyn/6e0677825059822fbaffec123403bf38)** to create an empty VB .NET Web App:

:::sh
x mix init-vb
:::
