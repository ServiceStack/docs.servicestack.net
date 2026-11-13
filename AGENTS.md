# AGENTS.md

Guidance for AI agents editing the ServiceStack documentation site.

## Sidebar menus (`MyApp/_pages/**/sidebar.json`)

- Menu `link` values must be relative, site-local paths (e.g. `/security/reporting`). Absolute URLs
  (`https://...`) are not supported in sidebar menu links.
- To point readers at an external resource, link to it from the page content instead, e.g. as an inline link
  or a call-to-action on the section's index page.
