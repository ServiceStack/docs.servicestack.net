---
slug: jamstack-with-vitepress-servicestack
title: JAMStack with Vitepress and ServiceStack
---
JAMStack, unlike other acronyms about the choice of technology, is a very broad architecture that stands for:

- JavaScript
- API
- Markup

## Your JAM

It isn't prescriptive about what technology you use to achieve this architecture. The combination of using a statically generated site (MarkUp), and enhance the experience of that site with JavaScript pulling data from an API is not a new pattern. Even JAMStack itself has been promoted using that acronym since ~2015.

However, this architecture pattern has some very compelling advantages.

- Host your static site anywhere, cheaply.
- Enable non-developers to contribute to content.
- API and Markup technology completely decoupled.
- Host API and Markup separately or together.
- Deploy API and Markup separately or together.
- SEO works great with statically generated sites.

### J is for JavaScript

Starting with "J" in JAMStack, we have Vitepress. Vitepress is a Vite powered, VueJs 3 static site generator that is blazing fast and is an amazing tool for building a rich content heavy front end. It has instant hot reload that is only a "Save" away from instantly showing your more recent edits to a MarkDown file.

Using Vue 3, we also have a super powerful and extensible way of producing reusable components for both interactive and static content that can be referenced straight from your MarkDown files.

### A is for API

Building interactive Vue 3 components eventually leads to calling remote web services. Having a well defined, easy to use API is what ServiceStack has been promoting from the very beginning with its message based design, it encourages reuse in an interoperable way where using it as the API is a great fit. Obviously, we are bias but in this article we'll try and point out the advantages by showing the developer experience with Vitepress.


### M is for Markup
By Vitepress being a static site generator, it can be hosted virtually anywhere extremely cheaply. GitHub offers this service for free, and loads of other companies offer turn key solutions to just hosting static markup.


## Coming from Jekyll

The ServiceStack docs were previously using Jekyll before moving to Vitepress. Jekyll was recently declared deprecated and hasn't been well support for a long time despite having support baked into GitHub Pages.

Jekyll uses a templating engine called `Liquid` which is not completely compatible with Vue and Vitepress. Your miles may vary but we found the process of migrating a 300 page documentation site to be about 2 days effort while learning vitepress. This included time it took for some preprocess of files, renaming and learning what some of the vitepress errors actually meant.

To help others and to give you an idea of what this process was like, below are some of the issues we encountered and how we dealt with them.

### File name vs `slug` and `permalink`
In Jekyll, the `frontmatter` in the Markdown file could have properties that would alter the file output of the static site generator. This meant you could have completely different file names for Markdown files vs the output HTML files.

While this is a good flexibility, it did make us somewhat less interested in naming the markdown file when we created new files for new documentation pages. Vitepress doesn't have the flexibility, Markdown files need to match the desired output and there for, hosted path name of your page.

We got around this by writing a small .NET Core tool that copied the MD file by parsing the frontmatter of the markdown file to a new file using the `slug` into an `updated` child directory.

```csharp
static void Main(string[] args)
{
    var filename = args[0];
    var fileLines = File.ReadAllLines(filename).ToList();
    if (!Directory.Exists("updated"))
    {
        Directory.CreateDirectory("updated");
    }
    foreach (var line in fileLines)
    {
        if (line.StartsWith("slug:"))
        {
            var newName = line.Split(":")[1].Trim();
            File.WriteAllLines("./updated/" + newName + ".md", fileLines);
        }
    }
}
```

Not very elegant, but it did the job. This was published as a `single file` executable targeting linux so it could be easily used with tools like `find` with `--exec`.

```shell
find *.md -maxdepth 1 -type f -exec ./RenameMd {} \;
```

All round pretty hacky, but this was also while we were still evaluating vitepress, so something quick that works was the flavor of the day. 

> This was run in each directory as needed, if `slug` or `permalink` is controlling your nested pathing, this problem will be more complex to handle.

This was run for our main folder of docs as well as our `releases` folder and we have successfully renamed files.


### Broken links are build failures

Vitepress is a lot more strict with issues than Jekyll. This is actually a good thing, especially as your site content grows. Vitepress will fail building your site if in your markdown to link to a relative link that it can't see is a file.

This comes from the above design decision of not aliasing files to output paths. Markdown links like `[My link](/my-cool-page)` needs to be able to see `my-cool-page.md`. This means if you move or rename a file, it will break if something else links to it. Jekyll got around this by allowing the use of `permalink` and `slug` which is great for flexibility, but means at build time it can't be sure (without a lot more work) if the relative path won't be valid.

There are drawbacks to this though. If you host multiple resources under the same root path as your Vitepress site and you want to reference this, I'm not sure you will be able to. You might have to resort to absolute URLs to link out to resources like this. And since Vitepress doesn't alias any paths, it means your hosting environment will need to do this.

### Syntax issues

Jekyll is very forgiving when it comes to content that is passed around as straight html and put in various places using Liquid. For example if you have the following HTML in an `include` for Jekyll.

```html
<p>This solution is <50 lines of code</p>
```

Jekyll will just copy it and not bother you about the invalid HTML issues of having a `less-than (<)` in the middle of a `<p>` element. Vitepress won't however, and you'll need to correctly use `&lt;` and `&gt;` encoded symbols appropriately.

#### Include HTML

Another issue is the difference of how to reuse content. In Jekyll, you would use `{% include my/path/to/file.html %}`. This will likely show up in errors like `[vite:vue] Duplicate attribute`.

Instead in Vitepress, an include of straight HTML will require migrating that content to a Vue component.

For example, if we have content file `catchphrase.html` like the following.

```html
<div>
    <h4>Catchphrase</h4>
    <p>It's.. what I do..</p>
</div>
```

We would need to wrap this in a Vue component like `catchphrase.vue`:

```html
<template>
    <div>
        <h4>Catchphrase</h4>
        <p>It's.. what I do..</p>
    </div>
</template>
<script>
    export default {
        name: "catchphrase"
    }
</script>

<style scoped>

</style>
```

Then it would need to be imported. This can be declared globally in the vitepress theme config or adhoc in the consuming Markdown file itself.

```markdown
<script setup>
import catchphrase from './catchphrase.vue';
</script>

<catchphrase />
```

The `<catchphrase />` is where it is injected into the output. For HTML so simple, this could be instead converted to Markdown and used the same way.

```markdown
#### Catchphrase
it's.. what I do..
```

And then used:

```markdown
<script setup>
import catchphrase from './catchphrase.md';
</script>

<catchphrase />
```

#### Jekyll markdownify redundant
Something similar is done in Jekyll, but with the use of Liquid filters.

```markdown
{% capture projects %}
{% include web-new-netfx.md %}
{% endcapture %} 
{{ projects | markdownify }}
```

This use of `capture` and passing the content to be converted is done by default when importing.

```markdown
<script setup>
import netfxtable from './.vitepress/includes/web-new-netfx.md';
</script>

<netfxtable />
```

If the module is declared global, then only the `<netfxtable />` is needed anywhere in your site to embed the content.

#### Templating syntax the same but different

When moving from Jekyll to Vitepress, I came across errors like `Cannot read property 'X' of undefined`. It was referring to some example code in a page we had that looked something like this.

```markdown
Content text here with templating code example below.

    Value: {{X.prop}}

More explanation here.
```

:::v-pre
This error came about because we didn't religiously fence our code examples. Jekyll let us get away with this and actually produced the visuals we wanted without trying to render value in the handlebars `{{ }}` syntax. 
:::

::: v-pre
Vitepress only ignores these if they are in a code fence using the triple tilda syntax OR if the content is within a `:::v-pre` block.
:::

## Vitepress key advantages

### Performance
Though Vitepress is a new and growing project which does have its trade offs, the development experience is extremely compelling.

It. Is. Fast.

Previously I use to use side by side IDE tooling for editing Markdown so I could see what it would look like. I would only glance at this after editing a sentence or two to get a rough ide of how it looked. The Markdown preview in your IDE is styled different, so I had to sort of imagine in my head roughly what that would translate to on our docs page since re-rendering with Jekyll would take 20-25 seconds on a 8 core Ryzen desktop.

Vitepress feels instant even on large pages. Opening up the network tab to see the hot reload event, I can see the latency time is on average for a pretty large document varies between 25ms and 380ms. Sub half a second always. This level of performance means I don't need the IDE markdown side by side and I can just edit, save, and instantly preview the page.

### Vue 3
This might be a drawback for some, but if you are comfortable with development using Vue (2 or 3), you will love the fact you can just use Vue components in your static site. There are limitations given components need to be server side rendered during build time, but once this pattern is followed, it is very productive.

### Simple config
The minimal example of a Vitepress site is 2 files. An `index.md` and a `package.json`. There are loads of convention based defaults which you can use to customize your site, but they are well documented on the Vitepress docs site. If you are looking to build a content heavy site using a SSG, especially a documentation site, you will be able to get going very quickly with Vitepress.

## Vitepress drawbacks
Saying all that, it does have its tradeoffs. The biggest of which is that it is a young project still in active development. There are still rough edges, especially when it comes to more complex hosting.

For example, clean URLs can be used but the client side of Vitepress always appends `.html` to any path. So while the path will load, it will show `.html` in the address bar, and this is (at the time of writing), not configurable.

### Interpreting errors

When migrating our side, it was frustrating the the stacktrace would try to point to a line of the Markdown for the source of the issue but it would be nearly always off. It showed me an unrelated line, but it was close so it was usually pretty easy to see code near by that wasn't working. If I couldn't, I could very quickly delete + save + retry, trial and error method of finding the right line of code. Not ideal, but can work around it.

<h2 class="mb-8">Test</h2>

Test

## Why single repository

## Why it is still a good idea
