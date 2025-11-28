---
title: Sitemaps
---

A good SEO technique for helping Search Engines index your website is to tell them where the can find all your content using [Sitemaps](https://support.google.com/webmasters/answer/156184?hl=en). Sitemaps are basic xml documents but they can be tedious to maintain manually, more so for database-driven dynamic websites. 

The `SitemapFeature` reduces the effort required by letting you add Site Urls to a .NET collection of `SitemapUrl` POCO's. 
In its most basic usage you can populate a single Sitemap with urls of your Website Routes, e.g:

```csharp
Plugins.Add(new SitemapFeature
{
    UrlSet = db.Select<TechnologyStack>()
    .ConvertAll(x => new SitemapUrl {
        Location = new ClientTechnologyStack { Slug = x.Slug }.ToAbsoluteUri(),
        LastModified = x.LastModified,
        ChangeFrequency = SitemapFrequency.Weekly,
    })
});
```

The above example uses [OrmLite](/ormlite/) to generate a collection of `SitemapUrl` entries containing Absolute Urls for all [techstacks.io Technology Pages](https://techstacks.io/tech). This is another good showcase for the [Reverse Routing available on Request DTO's](/routing#reverse-routing) which provides a Typed API for generating Urls without any additional effort.

Once populated your sitemap will be available at `/sitemap.xml` which looks like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>https://techstacks.io/the-guardian</loc>
  <lastmod>2015-01-14</lastmod>
  <changefreq>weekly</changefreq>
</url>
...
</urlset>
```

Which you can checkout in this [live Sitemap example](https://techstacks.io/sitemap-techstacks.xml).

## Multiple Sitemap Indexes

For larger websites, Sitemaps also support multiple [Sitemap indexes](https://support.google.com/webmasters/answer/75712?hl=en) which lets you split sitemap urls across multiple files. To take advantage of this in `SitemapFeature` you would instead populate the `SitemapIndex` collection with multiple `Sitemap` entries. An example of this is in the full [Sitemap used by techstacks.io](https://github.com/ServiceStackApps/TechStacks/blob/a114348e905b4334e93a5408c2fb76c5fb589501/src/TechStacks/TechStacks/AppHost.cs#L90-L128):

```csharp
Plugins.Add(new SitemapFeature {
SitemapIndex = {
    new Sitemap {
        AtPath = "/sitemap-techstacks.xml",
        LastModified = DateTime.UtcNow,
        UrlSet = db.Select<TechnologyStack>()
        .Map(x => new SitemapUrl {
            Location = new ClientTechnologyStack {Slug=x.Slug}.ToAbsoluteUri(),
            LastModified = x.LastModified,
            ChangeFrequency = SitemapFrequency.Weekly,
        }),
    },
    new Sitemap {
        AtPath = "/sitemap-technologies.xml",
        LastModified = DateTime.UtcNow,
        UrlSet = db.Select<Technology>()
        .Map(x => new SitemapUrl {
            Location = new ClientTechnology {Slug = x.Slug}.ToAbsoluteUri(),
            LastModified = x.LastModified,
            ChangeFrequency = SitemapFrequency.Weekly,
        })
    },
    new Sitemap
    {
        AtPath = "/sitemap-users.xml",
        LastModified = DateTime.UtcNow,
        UrlSet = db.Select<CustomUserAuth>()
        .Map(x => new SitemapUrl {
            Location = new ClientUser {UserName = x.UserName}.ToAbsoluteUri(),
            LastModified = x.ModifiedDate,
            ChangeFrequency = SitemapFrequency.Weekly,
        })
    }
}});
```

Which now generates the following `<sitemapindex/>` at [/sitemap.xml](https://techstacks.io/sitemap.xml):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
  <loc>https://techstacks.io/sitemap-techstacks.xml</loc>
  <lastmod>2015-01-15</lastmod>
</sitemap>
<sitemap>
  <loc>https://techstacks.io/sitemap-technologies.xml</loc>
  <lastmod>2015-01-15</lastmod>
</sitemap>
<sitemap>
  <loc>https://techstacks.io/sitemap-users.xml</loc>
  <lastmod>2015-01-15</lastmod>
</sitemap>
</sitemapindex>
```

With each entry linking to the urlset for each Sitemap:

 - [techstacks.io/sitemap-techstacks.xml](https://techstacks.io/sitemap-techstacks.xml)
 - [techstacks.io/sitemap-technologies.xml](https://techstacks.io/sitemap-technologies.xml)
 - [techstacks.io/sitemap-users.xml](https://techstacks.io/sitemap-users.xml)

