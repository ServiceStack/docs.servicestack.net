[Redis Admin UI](/admin-ui-redis) is a [vuedesktop.com](https://www.vuedesktop.com/) App that lets you manage your App's configured Redis Server with a user-friendly UX for managing core Redis data types, simple search functionality to quickly find Redis values, quick navigation between related values, 1st class support for JSON values and a flexible CLI interface and command history to inspect all previously run redis commands for easy edits & reruns.

<div class="not-prose">
    <a href="/admin-ui-redis">
        <div class="mx-auto max-w-screen-lg block flex justify-center shadow hover:shadow-lg rounded py-1">
            <img class="p-4" src="/img/pages/admin-ui/redis-desktop.png">
        </div>
    </a>
    <div class="mx-auto max-w-md p-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Video feature tour</p>
    </div>
    <div class="mb-16 flex justify-center">
        <iframe style="width:896px;height:504px;" src="https://www.youtube.com/embed/AACZtTOcQbg?start=217" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>

## Install

Launch as a stand-alone Desktop App by [Installing .NET SDK](https://dotnet.microsoft.com/en-us/download) and the 
[Windows Desktop App tool](/netcore-windows-desktop):

:::sh
powershell iwr gist.cafe/install.ps1 -useb | iex
:::

After install, open the Redis Admin Desktop from your browser at:

<div class="not-prose">
<h3 class="text-3xl text-center"><a href="app://redis">app://redis</a></h3>
</div>

Or from the command-line with:

:::sh
app open redis
:::


## Run headless on macOS, Linux and Windows

Non Windows OS can install the cross-platform [x dotnet tool](/dotnet-tool):

:::sh
dotnet tool install -g x
:::

Then launch from Command Line with:

:::sh
x open redis
:::

Where you can view it with your preferred browser at `http://localhost:5000`
