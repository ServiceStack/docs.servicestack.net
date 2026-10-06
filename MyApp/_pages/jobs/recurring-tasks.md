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

<schedule-pillars></schedule-pillars>

## Schedule options

Schedules can be configured to run at the intended local time, within a date range, a limited number of
times, and to control what happens when an occurrence is missed or the previous one is still running:

```csharp
var schedule = Schedule.Cron("0 9 * * MON-FRI");
schedule.TimeZoneId = "America/New_York";                 // 9am New York time, including daylight saving
schedule.MisfirePolicy = ScheduleMisfirePolicy.Skip;      // don't catch up on missed occurrences
schedule.OverlapPolicy = ScheduleOverlapPolicy.Skip;      // don't start while the last run is active
schedule.StartDate = new DateTime(2026, 10, 1);
schedule.EndDate = new DateTime(2026, 12, 31);

jobs.RecurringCommand<SendDailyDigestCommand>("Daily Digest", schedule);
```

| Option | Default | Description |
| --- | --- | --- |
| `TimeZoneId` | UTC | Time zone the Cron expression is evaluated in, e.g. `Australia/Perth` |
| `MisfirePolicy` | `RunOnce` | When occurrences were missed, e.g. while the App was down, `RunOnce` runs a single catch-up occurrence and `Skip` waits for the next one |
| `OverlapPolicy` | `Allow` | `Skip` doesn't start an occurrence while the previous one is still queued or running |
| `StartDate` | | Don't run before this date |
| `EndDate` | | Stop running after this date |
| `MaxRuns` | | Stop running after this many occurrences |

A task that reaches its `EndDate` or `MaxRuns` is disabled. Its `RunCount` is kept when the task is
registered again on the next startup, so it doesn't start over.

:::info
`Schedule.Yearly` runs once a year on 1 January. Prior to v10.3 it ran on the first day of every month.
:::

## Pause, resume and run now

Recurring Tasks can be paused and resumed without deleting their registration, or run immediately without
changing their ongoing schedule, e.g. to check a change or re-run after a failure:

```csharp
jobs.SetRecurringTaskEnabled("Daily Digest", enabled: false);
jobs.SetRecurringTaskEnabled("Daily Digest", enabled: true);

jobs.RunRecurringTaskNow("Daily Digest");
```

These are also available from the Scheduled Tasks tab of the Admin UI.

## Running on multiple servers

Schedules are stored in the database with their next run, so they're recovered across restarts and every
server agrees on when a task is next due. Each occurrence is only ever queued **once**, however many servers
evaluate the schedule, so it's safe to register the same Recurring Tasks on every App Server.

Servers reload the Scheduled Tasks from the database every `ReloadScheduledTasksSecs` (default 60s), so
pausing, resuming or running a task on one server takes effect on the others, and tasks deleted elsewhere are
dropped.

An invalid Cron expression or time zone is recorded against its task with the error, without stopping the
other tasks from running.

## Background Jobs Admin UI

The Scheduled Tasks tab lists each task with its schedule, when it next runs, and the outcome and duration of
its last run, with controls to pause, resume or run it now:

<screenshot src="/img/pages/jobs/11-scheduled-tasks.png" title="Scheduled Tasks with their next run, last result and run-now controls"></screenshot>
