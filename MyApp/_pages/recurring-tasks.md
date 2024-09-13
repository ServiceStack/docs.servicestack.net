---
title: Schedule Recurring Tasks
---

In addition to queueing jobs to run in the background, it also supports scheduling recurring tasks 
to execute APIs or Commands at fixed intervals.

:::youtube DtB8KaXXMCM
Schedule your Reoccurring Tasks with Background Jobs!
:::

APIs and Commands can be scheduled to run at either a `TimeSpan` or
[CRON Expression](https://github.com/HangfireIO/Cronos?tab=readme-ov-file#cron-format) interval, e.g:


## CRON Expression Examples

```csharp
// Every Minute Expression
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.Cron("* * * * *"));

// Every Minute Constant
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.EveryMinute, new CheckUrls {
    Urls = urls
});
```

### CRON Format

You can use any **unix-cron format** expression supported by the [HangfireIO/Cronos](https://github.com/HangfireIO/Cronos) library:

```txt
|------------------------------- Minute (0-59)
|     |------------------------- Hour (0-23)
|     |     |------------------- Day of the month (1-31)
|     |     |     |------------- Month (1-12; or JAN to DEC)
|     |     |     |     |------- Day of the week (0-6; or SUN to SAT; or 7 for Sunday)
|     |     |     |     |
|     |     |     |     |
*     *     *     *     *
```

The allowed formats for each field include:

| Field            | Format of valid values                     |
|------------------|--------------------------------------------|
| Minute           | 0-59                                       |
| Hour             | 0-23                                       |
| Day of the month | 1-31                                       |
| Month            | 1-12 (or JAN to DEC)                       |
| Day of the week  | 0-6 (or SUN to SAT; or 7 for Sunday)       |

### Matching all values

To match all values for a field, use the asterisk: `*`, e.g here are two examples in which the minute field is left unrestricted:

- `* 0 1 1 1` - the job runs every minute of the midnight hour on January 1st and Mondays.
- `* * * * *` - the job runs every minute (of every hour, of every day of the month, of every month, every day of the week, because each of these fields is unrestricted too).

### Matching a range

To match a range of values, specify your start and stop values, separated by a hyphen (-). Do not include spaces in the range. Ranges are inclusive. The first value must be less than the second.

The following equivalent examples run at midnight on Mondays, Tuesdays, Wednesdays, Thursdays, and Fridays (for all months):

- `0 0 * * 1-5`
- `0 0 * * MON-FRI`

### Matching a list

Lists can contain any valid value for the field, including ranges. Specify your values, separated by a comma (,). Do not include spaces in the list, e.g:

- `0 0,12 * * *` - the job runs at midnight and noon.
- `0-5,30-35 * * * *` - the job runs in each of the first five minutes of every half hour (at the top of the hour and at half past the hour).

## TimeSpan Interval Examples

```csharp
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.Interval(TimeSpan.FromMinutes(1)));

// With Example
jobs.RecurringApi(Schedule.Interval(TimeSpan.FromMinutes(1)), new CheckUrls {
    Urls = urls
});
```

That can be registered with an optional **Task Name** and **Background Options**, e.g:

```csharp
jobs.RecurringCommand<CheckUrlsCommand>("Check URLs", Schedule.EveryMinute, 
   new() {
       RunCommand = true // don't persist job
   });
```

:::info
If no name is provided, the Command's Name or APIs Request DTO will be used
:::

## Idempotent Registration

Scheduled Tasks are idempotent where the same registration with the same name will
either create or update the scheduled task registration without losing track of the
last time the Recurring Task, as such it's recommended to always define your App's 
Scheduled Tasks on Startup:

```csharp
public class ConfigureBackgroundJobs : IHostingStartup
{
   public void Configure(IWebHostBuilder builder) => builder
     .ConfigureServices((context,services) => {
         services.AddPlugin(new CommandsFeature());
         services.AddPlugin(new BackgroundsJobFeature());
         services.AddHostedService<JobsHostedService>();
     }).ConfigureAppHost(afterAppHostInit: appHost => {
         var services = appHost.GetApplicationServices();

         var jobs = services.GetRequiredService<IBackgroundJobs>();
         
         // App's Scheduled Tasks Registrations:
         jobs.RecurringCommand<MyCommand>(Schedule.Hourly);
     });
}
```

## Background Jobs Admin UI

The last job the Recurring Task ran is also viewable in the Jobs Admin UI: 

![](/img/pages/jobs/jobs-scheduled-tasks-last-job.webp)
