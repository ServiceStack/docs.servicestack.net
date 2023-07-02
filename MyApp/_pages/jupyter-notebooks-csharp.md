---
slug: jupyter-notebooks-csharp
title: C# Jupyter Notebooks
---

![](./img/pages/apps/jupyter-csharp.png)

Jupyter Commands lets you generate C# Jupyter Notebooks for calling ServiceStack APIs in a single command.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="vt92pbet5bY" style="background-image: url('https://img.youtube.com/vi/vt92pbet5bY/maxresdefault.jpg')"></lite-youtube>

All command line utils used are available in the latest [dotnet tool](/dotnet-tool) which can be installed from:

:::sh
dotnet tool install --global x
:::

Or if you had a previous version installed, update with:

:::sh
dotnet tool update -g x
:::

### Generate C# Jupyter Notebooks

Use `x jupyter-csharp` to display different usage examples for generating C# Jupyter Notebooks:

```
Usage: x jupyter-csharp <base-url>
       x jupyter-csharp <base-url> <request>
       x jupyter-csharp <base-url> <request> {js-object}
       x jupyter-csharp <base-url> <request> < body.json

Options:
 -out <file>            Save notebook to file
 -include <pattern>     Include Types DTOs pattern
```

The same syntax for invoking APIs with the [Post Command HTTP Utils](/post-command) can also be used to generate C# Jupyter Notebooks, e.g:

:::sh
x jupyter-csharp https://techstacks.io FindTechStacks "{Ids:[1,2,3],VendorName:'Google',Take:5}"
:::

Output:

```
Saved to: techstacks.io-FindTechStacks.ipynb
```

::: info
Jupyter Notebooks can also be created with the API Explorer UI at [apps.servicestack.net](https://apps.servicestack.net)
:::

## Setup Jupyter for C# locally

To get working with JupyterLabs to run locally with a C# kernel, there are a few things you'll need to have installed.

- Latest dotnet 5.0+ SDK
- Python 3.7+ with pip

With both dotnet SDK and Python installed, you can then install JupyterLab, Dotnet Interactive and register the dotnet kernels with the following commands.

```bash
# Install jupyterlab to default Python interpreter
pip install jupyterlab
# Install Dotnet Interactive dotnet tool
dotnet tool install -g Microsoft.dotnet-interactive
# Get Dotnet Interactive to register kernels with Jupyter  
dotnet interactive jupyter install
```

To verify these have been installed successfully, you can list the currently registered kernels using the command.

:::sh
jupyter kernelspec list
:::

This should list `.net-csharp` as one of the kernels which is what the C# notebooks will use.

## Running JupyterLab

With everything setup, navigate to a local directory with your notebooks and run:

:::sh
jupyter-lab
:::

The context of where this command is run from matter as JupyterLab will mount list files in the same directory is was run, so make sure your running the `jupyter-lab` command from where your notebooks are located or where you new notebooks to be saved.

## Example generated notebook

From your notebook directory that JupyterLab is using, open a new command prompt/terminal and run:

:::sh
x jupyter-csharp https://covid-vac-watch.netcore.io QueryVaccinationRates
:::

This will generate the file `covid_vac_watch.netcore.io-QueryVaccinationRates.ipynb` in that directory. This file has everything that is needed to call the `QueryVaccinationRates` service and display data in the response.

![](/img/pages/jupyter/jupyter-lab-csharp-example.png)

### Visualize the data

These generated notebooks are designed to be a starting point with all the data plumbing setup done for you. Taking this example further, we can visualize the data using [Plotly.NET](https://plotly.net/), a NuGet library that generates plotly.js visuals using .NET. Run at least the first two cells and then add a new cell at the bottom of the generated notebook with the following code.

```csharp
#r "nuget: Plotly.NET, 2.0.0-preview.6"
#r "nuget: Plotly.NET.Interactive, 2.0.0-preview.6"

using Plotly.NET;

var xData = response.Results.Select(x => x.Date).ToList();
var yData = response.Results.Select(x => x.DailyVaccinations == null ? 0 : (decimal)(x.DailyVaccinations)).ToList();

GenericChart.GenericChart chart = Chart.Point<DateTime,decimal, string>(x: xData, y: yData, Name: "");
chart
    .WithTraceName("Daily Vaccinations", true)
    .WithX_AxisStyle(title: "Vaccinations", Showgrid: false, Showline: true)
    .WithY_AxisStyle(title: "Date", Showgrid: false, Showline: true);
display(chart);
```

The code above does several things.

- Import the 2 required Plotly.NET NuGet dependencies.
- Declares `using` statement.
- Transforms response data into 2 equal list of primitive data.
- Generates a plot with `Date` on the X axis and `DailyVaccinations` on the Y axis.

![](/img/pages/jupyter/jupyter-lab-visual-example.png)

## Try it out yourself using MyBinder with generated notebooks

Another way to work with Jupyter, C# and ServiceStack generated notebooks is to do with via [MyBinder](https://mybinder.org/). MyBinder is a free hosted service that gives you an isolated docker container to run your notebooks if you are just trying something out.

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/ServiceStack/jupyter-notebooks/HEAD)
- Click on the `Launch Binder` badge above and wait for it to launch into a Jupyter web UI (it can take a min or two sometimes)
- Goto `New` and select `Terminal`.
- In the terminal use the ServiceStack `x` tool to generate a new C# notebook like before
  - `x jupyter-csharp https://covid-vac-watch.netcore.io QueryVaccinationRates`
- Navigate back to Jupyter file explorer and see your generated notebook.
- Open the new notebook and **run** the generated cells.
- Add a new cell with the same code for Plotly.NET as above and run

![](/img/pages/jupyter/jupyter-mybinder-visual-example.png)
