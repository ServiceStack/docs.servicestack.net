---
title: Advanced Locode Features
---

## Pre-populated Reference Data

As we look for ways to improve productivity in Locode now pre-populates referential data from navigated references, e.g. when creating a new Job Application after navigating to a [Job's Applications in Talent Blazor](https://talent.locode.dev/locode/QueryJob) it uses this context to pre-populate the Job it's filtered by:

![](/img/pages/locode/prepopulated-related-data.png)

## Support for Large Apps

The built-in capability-based UI's are powered from your APIs metadata, as more of our Customers start to make use of these new UIs in their workflow we've had reports from some customers with [Large Apps (550+ APIs)](https://forums.servicestack.net/t/api-explorer-hangs-on-large-service-layer/10743) that the UIs started to hang their browsers when it tried to process the **9.5MB** of generated metadata.

To support Larger Apps we've added the ability to restrict the metadata and UIs to only related APIs in [user-defined Tag Groups](/api-design#group-services-by-tag) by adding `?IncludeTypes` to the URL, e.g:

**/ui/?IncludeTypes={tag}**

This follows the Include Types pattern where you can view multiple tag groups with:

**/ui/?IncludeTypes={tag1},{tag2}**

This feature is supported in all built-in UIs and is now integrated on the **/metadata** page where if you select a tag the API Explorer link will be updated with **?IncludeTypes={tag}**:

![](/img/pages/locode/locode-tags-filter.png)

Where you'll now be able to open API Explorer restricted to APIs with that tag without needing to manually craft the URL.

## Localize Metadata

To assist with with creating Localized Locode UIs, all user-defined descriptive text is now routed through to your AppHost's `ResolveLocalizedString()` method which you can use to return a localized string for the current request, e.g:

```csharp
public override string ResolveLocalizedString(string text, IRequest request = null)
{
    return request != null 
        ? MyResolveLocalizedString(text, request.Headers[HttpHeaders.AcceptLanguage])
        : text;
}
```
