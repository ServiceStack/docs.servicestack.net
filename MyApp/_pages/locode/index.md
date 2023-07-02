---
title: Getting started with Locode
---

Locode is a feature built into ServiceStack that provides a user-friendly interface to manage data using AutoQuery CRUD services, 
[supporting 4 major RDBMS providers](/ormlite/installation) including PostgreSQL, SQL Server, MySQL and SQLite. 

AutoQuery services can be generated directly from your database schema or use Plain Old C# Objects (POCOs) to define its CRUD
behaviour that can be further customized & extended and [customized using C# attributes](/locode/declarative).

<div class="not-prose mt-8 py-8 flex justify-center space-x-6">
    <a href="/locode/database-first" 
        class="hover:no-underline inline-flex items-center px-6 py-4 border border-transparent shadow-sm text-2xl rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-8 w-8" viewBox="0 0 48 48"><path fill="currentColor" fill-rule="evenodd" d="M39 9.75v6.429c0 2.07-6.716 3.75-15 3.75c-8.284 0-15-1.68-15-3.75V9.75C9 7.679 15.716 6 24 6c8.284 0 15 1.679 15 3.75ZM9.621 19.714c1.844 1.55 7.584 2.679 14.379 2.679s12.535-1.13 14.379-2.679c.404.34.621.7.621 1.072v6.428c0 2.071-6.716 3.75-15 3.75c-8.284 0-15-1.679-15-3.75v-6.428c0-.373.217-.732.621-1.072ZM24 33.68c-6.795 0-12.535-1.13-14.379-2.679c-.404.34-.621.7-.621 1.071V38.5c0 2.071 6.716 3.75 15 3.75c8.284 0 15-1.679 15-3.75v-6.429c0-.372-.217-.731-.621-1.071c-1.844 1.549-7.584 2.679-14.379 2.679Zm8.333 3.654a1.167 1.167 0 1 1-2.333 0a1.167 1.167 0 0 1 2.333 0Zm3.5 0a1.167 1.167 0 1 0 0-2.333a1.167 1.167 0 0 0 0 2.333Z" clip-rule="evenodd"/></svg>
            Database-First
    </a>
    <a href="/locode/code-first" 
        class="hover:no-underline inline-flex items-center px-6 py-4 border border-transparent shadow-sm text-2xl rounded-md text-white bg-indigo-600       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-8 w-8" viewBox="0 0 24 24"><path fill="currentColor" d="M8.01 18.02L2 12.01L8.01 6l1.415 1.414l-4.6 4.6l4.6 4.6l-1.414 1.406H8.01Zm7.979 0l-1.413-1.413l4.6-4.6l-4.6-4.6L15.99 6L22 12.01l-6.01 6.01h-.001Z"/></svg>
            Code-First
    </a>
</div>

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="hkuO_DMFXmc" style="background-image: url('https://img.youtube.com/vi/hkuO_DMFXmc/maxresdefault.jpg')"></lite-youtube>
</div>

After creating your AutoQuery APIs they'll be immediately accessible them from the built-in Locode UI at:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3"><span class="text-gray-300">https://example.org</span>/locode/</h3>
<h1 class="mt-16 text-center text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
    API Reference
</h1>
<p class="text-center mt-6 text-xl text-gray-500">
    <a href="/locode/custom">Custom Locode Apps</a>
    can benefit from TypeScript definitions for all functionality in ServiceStack UI's at 
    <b><a href="https://api.locode.dev">api.locode.dev</a></b>
</p>
</div>

[![](/img/pages/locode/shared-api-reference.png)](https://api.locode.dev/modules/shared.html)
