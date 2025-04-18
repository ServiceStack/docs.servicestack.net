---
slug: admin-ui
title: Admin UI
---

The Admin UI contains a suite of Admin tools providing a number of productivity features ranging from Managing Users and DB Validation Rules to gaining unprecedented insights into Live running Apps with in-depth Request Logging & Profiling where you'll be able to observe your App's behavior in real-time.

The [Admin UI](/admin-ui) is built into all ServiceStack Apps, accessible to [Admin Users](/debugging#admin-role) from:

<div class="not-prose text-center pb-3">
    <h3 class="text-4xl text-indigo-800">/admin-ui</h3>
</div>

Which will launch the Admin UI:

<analytics-ui class="not-prose"></analytics-ui>

### Dashboard

On first access you're greeted with the Admin dashboard showing high-level overview stats on the number and type of APIs your App has as well as internal stats counters surfaced right on your Dashboard where they can provide valuable insights into the health of different features at a glance:

![](/img/pages/admin-ui/dashboard-features.png)

### Advertised features

As Admin is a capability-based UI it only shows the stats and features your App has enabled. To aid in discovery the dashboard now includes a light switch of available Admin features with a link to [Admin UI Feature Docs](/admin-ui-features), providing a summary of each Admin UI component and instructions on how to enable them.

### Admin UI Features

Explore the available Admin UIs to learn more about each of their capabilities:

### [Managing Users UI](/admin-ui-users)

Containing user management functionality for creating & modifying users, assigning Roles & Permissions, locking or updating passwords:

<a href="/admin-ui-users">
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/users.png">
    </div>
</a>

### [Profiling & Logging UI](/admin-ui-profiling)

Enables invaluable observability into your App, from being able to quickly inspect and browse incoming requests, to tracing their behavior:

<a href="/admin-ui-profiling">
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/admin-ui-logging.png">
    </div>
</a>

### [Redis Admin](/admin-ui-redis)

Manage your App's configured Redis Server, query & edit core Redis data types and execute custom redis commands:

<a href="/admin-ui-redis">
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/admin-ui-redis.png">
    </div>
</a>

### [Database Admin](/admin-ui-database)

Quickly browse and navigate your App's configured RDBMS schemas and tables:

<a href="/admin-ui-database">
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/admin-ui-database.png">
    </div>
</a>

### [DB Validation UI](/admin-ui-validation)

Leverages the existing Declarative Validation infrastructure to enable dynamically managing Request DTO Type and Property Validators from a RDBMS data source

<a href="/admin-ui-validation">
    <div class="block p-4 rounded shadow hover:shadow-lg">
        <img src="/img/pages/admin-ui/admin-ui-validation.png">
    </div>
</a>


### Feedback

The Admin UI was designed with room to grow. Please let us know what other features you would like to see on our [GitHub Discussions](https://github.com/ServiceStack/Discuss/discussions/2).
