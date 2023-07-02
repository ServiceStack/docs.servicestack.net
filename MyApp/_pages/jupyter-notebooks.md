---
slug: jupyter-notebooks
title: Jupyter Notebooks
---

[![](./img/pages/apps/jupyter-splash.png)](https://jupyter.org)

Initially forged from the [Interactive Python](https://ipython.org) project, [Jupyter](https://jupyter.org) is an exciting initiative to support an open standards, language agnostic interactive computing platform where it provides the ideal integrated exploratory programming environment for data science and scientific computing as represented by its 3 core languages for these domains in [Julia](https://julialang.org), [Python](https://python.org) and [R](https://www.r-project.org) (Ju-Py-R).

However its popularity, thriving ecosystem and rich tooling has seen it grow to encompass a wide range of interactive computing use-cases including data cleaning and transformation, numerical simulation, statistical modeling, data visualization, machine learning, and much more which now sees it support **over 40 programming languages**.

## Jupyter Notebooks

At the core of Jupyter is the "Notebook" (Nb) - an open JSON document format that contains a complete record of user's sessions including code, narrative text, equations, visualizations and rich output. The culmination of which facilitates the creation and sharing of Live Executable Documents encapsulating an Interactive computing session that provides an ideal visual REPL environment for exploratory programming whose results and findings can be further annotated with Markdown documentation and exported in a number of formats to facilitate knowledge sharing including: HTML, PDF, Markdown, Latex, ReStructured Text, Asciidoc, Reveal.js.

## Create Python, C# and F# Jupyter Notebooks for any ServiceStack API

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="h6UwDuXt8MA" style="background-image: url('https://img.youtube.com/vi/h6UwDuXt8MA/maxresdefault.jpg')"></lite-youtube>

By leveraging [Add ServiceStack Reference's](/add-servicestack-reference) rich, typed ecosystem we're able to tap into the exciting interactive world of Jupyter Notebooks where ServiceStack API consumers are now able to generate custom-tailored notebooks for ServiceStack API using a [Simple UI](https://apps.servicestack.net) or generated from a single command-line if preferred.

Generating Python Notebooks with [Python ServiceStack Reference](/python-add-servicestack-reference) will let you get the most out of Jupyter Notebooks ecosystem, tooling and free hosting cloud services. 

Alternatively .NET Teams can use [.NET Interactive ](https://github.com/dotnet/interactive) Kernels and [Notebooks VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode) to generate and execute C# and F# Notebooks:

[![](./img/pages/apps/notebook-py.png)](/jupyter-notebooks-python)
[![](./img/pages/apps/notebook-cs.png)](/jupyter-notebooks-csharp)
[![](./img/pages/apps/notebook-fs.png)](/jupyter-notebooks-fsharp)

## Notebook Apps

The core UX for experiencing Jupyter Notebooks is through a Notebook App which thanks to Jupyter's momentum and vibrant ecosystem there are now many options to choose from, optimizing for different developers use-cases and integrated development workflows.

Delivered and maintained as part of the Jupyter project are 2 self-hosted front-end Web Application UIs for authoring and running Notebooks:

### JupyterLab

JupyterLab is Jupyter's next-gen web-based development environment designed around maintaining an entire Workspace of Notebooks in a multi-tabbed splittable UI whereby many of them can be running at the same time:

![](./img/pages/apps/jupyter-labpreview.png)

An easy way to install JupyterLab is to use the pip package manager installed with Python:

:::sh
pip install jupyterlab
:::

Once installed you can launch JupyterLab's UI from a directory containing your Notebooks where they'll be accessible from its built-in File Explorer UI:

:::sh
jupyter-lab
:::

### Jupyter Notebook

The original Jupyter Notebook Web Application offering a simplified single document UI:

![](./img/pages/apps/jupyter-notebook-preview.png)

Install with Python's pip package manager:

:::sh
pip install notebook
:::

Then launch from any directory containing Notebooks to open them from the Jupyter Notebook App:

:::sh
jupyter notebook
:::

### PyCharm

JetBrains likely offers the most functional and capable IDEs for authoring and viewing Notebooks whose [Notebook support](https://www.jetbrains.com/help/pycharm/jupyter-notebook-support.html) is built-in to their leading Python IDE - [PyCharm](https://www.jetbrains.com/pycharm/).

In addition to all the source code assistance and analysis you can expect from JetBrains smart IDEs to assist in writing Python, it also supports debugging as well as multiple edit and preview modes. 

![](./img/pages/apps/jupyter-pycharm.png)

PyCharm is ideal for Python programmers and maintaining Notebooks as part of a Python project where it takes care of creating a Python virtual environment for the project, installing required local dependencies and executing Notebooks within the projects venv context.

#### JetBrains DataSpell

Jupyter's popularity with Data Scientists has prompted JetBrains to develop a [stand-alone DataSpell IDE](https://www.jetbrains.com/dataspell/) optimized for working with Data with a more refined lightweight UX for working with Notebooks:

![](./img/pages/apps/jupyter-dataspell.png)

### VS Code

Visual Studio Code is another IDE popular with Python Developers that has their own [built-in UX for Jupyter Notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks):

![](./img/pages/apps/jupyter-vscode.png)

It provides a nicer UX over the traditional Notebook UX with niceties like intelli-sense and variable explorer and is better at opening stand-alone Notebooks outside the context of a Python project where its able to make use of pip's global OS packages.

Whilst its Python notebook support is still the most complete, it's the optimal UI for working with **C# and F# Notebooks** with its [.NET Interactive Notebooks](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode) extension, currently in Preview that's maintained as part of the [github.com/dotnet/interactive](https://github.com/dotnet/interactive) project.

## Cloud Notebook Services

The proliferation of Notebooks as an interactive computing platform, popular in machine learning, data analysis and education has spawned a number of cloud services to facilitate the management, authoring and sharing of Notebooks where as they're run and hosted in the cloud can be easily shared with anyone without requiring a local install or development environment.

### Binder

The JupyterHub team maintain their public Jupyter notebooks service at [mybinder.org](https://mybinder.org) for anyone who wants to share their interactive GitHub repositories publicly. Behind the scenes Notebooks are executed on a collection of [BinderHub Federated services](https://mybinder.readthedocs.io/en/latest/about/federation.html) using resources donated by  [Google Cloud](https://cloud.google.com), [OVH](https://www.ovh.com), [GESIS Notebooks](https://notebooks.gesis.org) and the [Turing Institute](https://turing.ac.uk).

To run your Notebooks on Binder head over to https://mybinder.org and paste the URL of your public GitHub repo containing your Jupyter Notebooks to retrieve the generated URL for your repo.

E.g. our [ServiceStack/jupyter-notebooks](https://github.com/ServiceStack/jupyter-notebooks) GitHub repo is available from:

#### [https://mybinder.org/v2/gh/ServiceStack/jupyter-notebooks/HEAD](https://mybinder.org/v2/gh/ServiceStack/jupyter-notebooks/HEAD)

Where behind-the-scenes Binder will build and host a Docker image of your repo and launch a dedicated `notebook` Web App instance to view an execute your repo's Notebooks:

[![](./img/pages/apps/jupyterlab-mybinder-repo.png)](https://mybinder.org/v2/gh/ServiceStack/jupyter-notebooks/HEAD)

The [ServiceStack/jupyter-notebooks](https://github.com/ServiceStack/jupyter-notebooks) repo contains a couple of API examples generated using our [Instant Client Apps](https://apps.servicestack.net) site to craft a [QueryVaccinationRates API](https://apps.servicestack.net/#covid-vac-watch.netcore.io/python/QueryVaccinationRates(Location:Arizona)) call that can be downloaded in a **Python Notebook**:

[![](./img/pages/apps/apps-covid-vac-QueryVaccinationRates.png)](https://apps.servicestack.net/#covid-vac-watch.netcore.io/python/QueryVaccinationRates(Location:Arizona))

### Covid Vaccinations

In addition to previewing the raw data response in human-friendly markdown and HTML tables, you can also leverage Python's powerful [pandas](https://pandas.pydata.org) and [matplotlib](https://matplotlib.org) libraries to plot a quick visualization of the typed `QueryVaccinationRates` AutoQuery response:

[![](./img/pages/apps/jupyterlab-mybinder-covid-vac.png)](https://github.com/ServiceStack/jupyter-notebooks/blob/main/covid-vac-watch.netcore.io.ipynb)

### TechStacks

The [techstacks.io-FindTechnologies.ipynb](https://github.com/ServiceStack/jupyter-notebooks/blob/main/techstacks.io-FindTechnologies.ipynb) is an example of a Notebook generated by [apps.servicestack.net](https://apps.servicestack.net) which displays results in a HTML table and a human-friendly markdown table for API Responses containing a `Results` resultset, e.g:

[![](./img/pages/apps/apps-techstacks-FindTechnologies.png)](https://apps.servicestack.net/#techstacks.io/python/AutoQuery/FindTechnologies(Ids:[1,2,4,6],VendorName:Google,Take:10,Fields:%22Id,%20Name,%20VendorName,%20Slug,%20Tier,%20FavCount,%20ViewCount%22))

When executed in either a Binder or self-hosted **notebook** web app it will render API responses that looks like:

[![](./img/pages/apps/jupyterlab-mybinder-techstacks.png)](https://github.com/ServiceStack/jupyter-notebooks/blob/main/techstacks.io-FindTechnologies.ipynb)

### GitHub Auto Preview

Thanks to executed Notebooks retaining their executed outputs and GitHub's [built-in support of rendering Jupyter Notebooks](https://docs.github.com/en/github/managing-files-in-a-repository/working-with-non-code-files/working-with-jupyter-notebook-files-on-github), we can also view pre-rendered Notebooks directly in GitHub, e.g. you can view the pre-rendered output of the above Python Notebook directly on GitHub at: [techstacks.io-FindTechnologies.ipynb](https://github.com/ServiceStack/jupyter-notebooks/blob/main/techstacks.io-FindTechnologies.ipynb).

The beauty of Notebook's retaining their executed outputs within the same document is that it makes it possible to share rendered Notebooks on GitHub written in different languages. 

Which we can demonstrate using [apps.servicestack.net](https://apps.servicestack.net) which lets you download Notebooks for any publicly accessible ServiceStack API in **C#**, **Python** and **F#**:

[![](./img/pages/apps/apps-languages.png)](https://apps.servicestack.net)

Then use the languages tab to download the same API in a C# and F# Jupyter Notebook instead:

### C# TechStacks FindTechnologies Notebook

[/csharp/techstacks.io-FindTechnologies.ipynb](https://github.com/ServiceStack/jupyter-notebooks/blob/main/csharp/techstacks.io-FindTechnologies.ipynb)

[![](./img/pages/apps/jupyter-github-csharp.png)](https://github.com/ServiceStack/jupyter-notebooks/blob/main/csharp/techstacks.io-FindTechnologies.ipynb)

### F# TechStacks FindTechnologies Notebook

[/fsharp/techstacks.io-FindTechnologies.ipynb](https://github.com/ServiceStack/jupyter-notebooks/blob/main/fsharp/techstacks.io-FindTechnologies.ipynb)

[![](./img/pages/apps/jupyter-github-fsharp.png)](https://github.com/ServiceStack/jupyter-notebooks/blob/main/fsharp/techstacks.io-FindTechnologies.ipynb)

### Google Colab

Google Colab is another **FREE** hosted Jupyter notebook service that can open Notebooks stored in Google Drive or loaded from GitHub and can be shared just as you would with Google Docs or Sheets, which requires no install to use, while providing free access to computing resources including GPUs where it's executed in a virtual machine private to your account. 

Built into GDrive, you can open any `.ipynb` Jupyter Notebooks with Google's Colab service making it a great way to share private Notebooks between users using Google Drive.

Whilst you can upload your Python Jupyter Notebooks manually, the quickest way to open your ServiceStack API in Colab is to Save it directly in GDrive with the **Save** button:

![](./img/pages/apps/apps-python-notebook-gdrive.png)

Then click on the saved `.ipynb` Notebook to open it in Colab where like other Notebook services will let you see the last pre-executed rendered output. Running a cell with the **Play** icon or `CTRL+Enter` will execute the Notebook in a private virtual machine to update the captured outputs with live results:

![](./img/pages/apps/jupyter-colab-FindTechnologies.png)

## JetBrains Datalore

[Datalore](https://datalore.jetbrains.com) is JetBrains premium cloud hosted service for hosting and running Jupyter Notebooks within a shared team environment. It's online Notebook App features PyCharm's code insights and autocompletion, real-time collaborative editing and also includes built-in Terminal support for running remote commands and `.py` scripts:

[![](./img/pages/apps/jupyter-datalore.png)](https://datalore.jetbrains.com)

## Amazon SageMaker

[Amazon SageMaker](https://aws.amazon.com/sagemaker/) is Amazon's comprehensive ML service that helps data scientists and developers to prepare, build, train, and deploy high-quality machine learning (ML) models.

Included as part of their offering is [Amazon SageMaker Notebook Instances](https://docs.aws.amazon.com/sagemaker/latest/dg/nbi.html) which is a machine learning (ML) compute instance running the Jupyter Notebook App. SageMaker manages creating the instance and related resources. Use Jupyter notebooks in your notebook instance to prepare and process data, write code to train models, deploy models to SageMaker hosting, and test or validate your models.

![](./img/pages/apps/jupyter-sagemaker.png)
