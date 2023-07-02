---
slug: background-mq
title: Background MQ Service
---

The `BackgroundMqService` is a full-featured `IMessageService` implementation that provides the functionality of [distributed MQ Server](/messaging) but doesn't require any infrastructure dependencies. It's ideal for **queueing long-running background tasks** by publishing Request DTOs, control execution throughput by creating different sized Thread Pools per message type, inspect the status and statistics of different MQ Workers, stop and restart processing messages, etc. It's a complete implementation implementing the same [MQ Message flow](/messaging#message-workflow) and passes the existing MQ Test suites so you'll be able to substitute it for any of the other MQ Servers. But it still doesn't persist messages across App restarts so we recommend using it in combination with persistence to an external data source - generally a good idea for tracking the status of long-running jobs.

To illustrate an example we'll walkthrough TechStacks implementation of what's likely the most popular use of background job in Web Apps - sending emails... 

## Using Background Service to send Emails

Configuring the `BackgroundMqService` is the same as every other MQ Server, i.e. register it in the IOC and register handlers for the Request DTO of each Service you want to be able to run in the background:

```csharp
container.Register<IMessageService>(c => new BackgroundMqService());
var mqServer = container.Resolve<IMessageService>();

mqServer.RegisterHandler<SendNotification>(ExecuteMessage, 4);
mqServer.RegisterHandler<SendSystemEmail>(ExecuteMessage);

AfterInitCallbacks.Add(host => {
    mqServer.Start();
    ExecuteService(new RetryPendingNotifications());
});
```

The one difference is that we also register an `AfterInitCallbacks` to Execute the [RetryPendingNotifications](https://github.com/NetCoreApps/TechStacks/blob/c89920d92e1e11a5495bf88a45fea60aea9d199e/src/TechStacks.ServiceInterface/Admin/NotificationServices.cs#L51) Service after the AppHost has started. We'll look at the implementation later, but it's for re-queueing any incomplete Background Jobs that failed to complete.

With the handlers registered, any Service can queue any of these Services to Execute in the background by publishing a populated Request DTO of that Type. One place where TechStacks does this is to notify all subscribers when someone creates a post, which it does by [calling SendNotificationAsync()](https://github.com/NetCoreApps/TechStacks/blob/973eecdc334687e13008aa9f07444e7c6affcfd9/src/TechStacks.ServiceInterface/PostServices.cs#L62):

```csharp
await SendNotificationAsync(nameof(CreatePost), nameof(Post), id);
```

A common API that inserts an entry in the `Notification` table and publishes a `SendNotification` message to have the Service executed in the background by 1 of the 4 MQ Workers configured at Startup:

```csharp
public async Task SendNotificationAsync(string eventName, string refType, long refId)
{
    var notificationId = await Db.InsertAsync(ToNotification(eventName, refType, refId), selectIdentity:true);
    PublishMessage(new SendNotification { Id = notificationId });
}

Notification ToNotification(string eventName, string refType, long refId) => new Notification {
    Event = eventName,
    RefId = refId,
    RefType = refType,
    RefUrn = $"urn:{refType}:{refId}",
    Created = DateTime.Now,
}; 
```

`SendNotification` is a regular ServiceStack Service except we only want it accessible to Admin Users so it's annotated with `[ExcludeMetadata]` to hide it from the public metadata services. 

```csharp
[ExcludeMetadata]
[Route("/notifications/{Id}/send")]
public class SendNotification : IReturnVoid
{
    public long Id { get; set; }
}
```

For the complete reference [NotificationServices.cs](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks.ServiceInterface/Admin/NotificationServices.cs) contains all the background Email Services and bespoke code to send the different Email types whilst [NotificationServices.Utils.cs](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks.ServiceInterface/Admin/NotificationServices.Utils.cs) contains reusable functionality shared by the different email implementations. 

The `SendNotification` Service sends a different Email based on the Notification Event Type which are all executed within the same managed implementation below where it takes care of marking the completion of the notification, either with the time it successfully completed or the Exception the notification it failed with:

```csharp
[RequiredRole("Admin")]
public partial class NotificationServices : Service
{
    private static ILog log = LogManager.GetLogger(typeof(NotificationServices));

    Func<Notification, Task> GetEventHandler(string eventName)
    {
        switch (eventName)
        {
            case nameof(CreatePost):
                return SendNewPostEmail;
            case nameof(UserPostReport):
                return SendReportPostEmail;
            case nameof(UserPostCommentReport):
                return SendReportCommentEmail;
        }
        return null;
    }

    public async Task Any(SendNotification request)
    {
        var notification = AssertNotification(request.Id);

        var eventHandler = GetEventHandler(notification.Event);
        if (eventHandler != null)
        {
            try
            {
                await eventHandler(notification);

                await Db.UpdateOnlyAsync(() => new Notification {
                        Completed = DateTime.Now
                    },
                    where: x => x.Id == notification.Id);
            }
            catch (Exception ex)
            {
                await Db.UpdateOnlyAsync(() => new Notification {
                        Failed = DateTime.Now,
                        Error = ex.Message + Environment.NewLine + ex
                    },
                    where:x => x.Id == notification.Id);
                throw;
            }
        }
        else
        {
            log.Warn($"Received notification of unknown Event Type: {notification.Event}");
        }
    }
}
```

The creation of Email Template is split into different steps to ensure all users are sent the same rendered Email snapshot, even if the task failed midway through and had to be replayed. 

Each template follows the same approach:

 - Work out all users the email should be sent to 

 - Retrieve all data required by the template and inject it into a new [ServiceStack ScriptContext](https://sharpscript.net/docs/installation) 
 - Use the context to render the specified [email template](https://github.com/NetCoreApps/TechStacks/tree/master/src/TechStacks/emails). 
 
 In this case it renders the [post-new.html](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks/emails/post-new.html) Template inside the [_layout.html](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks/emails/_layout.html) - which is based on the [Email Bootstrap Template](https://github.com/seanpowell/Email-Boilerplate/blob/master/email_commentsremoved.html) and used as the layout for all email templates.

```csharp    
private async Task SendNewPostEmail(Notification notification)
{
    EmailTemplate template = null;

    if (notification.EmailTemplateId == null)
    {
        var post = await AssertPost(notification.RefId);
        var org = await Db.SingleByIdAsync<Organization>(post.OrganizationId);
        var user = await Db.SingleByIdAsync<CustomUserAuth>(post.UserId);

        var q = Db.From<OrganizationSubscription>()
            .Where(x => x.OrganizationId == post.OrganizationId)
            .And("ARRAY[{0}] && post_types", post.Type)
            .Select(x => x.UserId);
        var postTypeSubscriberUserIds = await Db.ColumnAsync<int>(q);

        var context = CreateEmailTemplateContext();
        var templatePath = "emails/post-new";
        var page = context.GetPage(templatePath);
        var result = new PageResult(page) {
            Args = {
                ["baseUrl"] = AppSettings.GetString("PublicBaseUrl"),
                ["post"] = post,
                ["organization"] = org,
            }
        };

        template = await CreateAndSaveEmailTemplate(notification, nameof(SendNewPostEmail), templatePath, 
            toUserIds: postTypeSubscriberUserIds, 
            fromName:  user.DisplayName ?? user.UserName, 
            ccName:    org.Name + " Subscribed", 
            subject:   $"[{post.Type}] {post.Title}", 
            html:      await result.RenderToStringAsync());
    }
    else
    {
        template = await Db.SingleByIdAsync<EmailTemplate>(notification.EmailTemplateId);
    }

    await SendEmailsToRemainingUsers(notification, template);
}
```

The end result of each email is to create an entry in the generic [EmailTemplate](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks.ServiceInterface/DataModel/EmailTemplate.cs) table with the rendered email to send and all users to send it to. It's then handed to the managed `SendEmailsToRemainingUsers` routine to send the emails.

The final step is to send the email to all designated users, which is ultimately done by the [EmailProvider](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks.ServiceInterface/Notifications/EmailProvider.cs) which uses an `SmtpClient` to send the Email to the AWS SES endpoint.

To handle cases where the long-running process can fail at any point, the email template keeps a record of each user that emails were sent to by updating the `emailed_user_ids` PostgreSQL Array after each email is sent. So if the `SendNotification` message is replayed it will start back where it left off and only sends emails to the remaining users.

```csharp
private async Task SendEmailsToRemainingUsers(Notification notification, EmailTemplate template)
{
    var remainingUserIds = notification.UserIds.Where(x => !notification.EmailedUserIds.Contains(x)).ToList();
    if (remainingUserIds.Count > 0)
    {
        var users = await Db.SelectAsync<UserEmailInfo>(Db.From<CustomUserAuth>()
            .Where(x => remainingUserIds.Contains(x.Id)));

        var userMap = users.ToDictionary(x => x.Id);

        foreach (var userId in remainingUserIds)
        {
            var user = userMap[userId];
            if (!string.IsNullOrEmpty(user.Email))
            {
                Email.Send(template.ToEmailMessage(user.Email, user.DisplayName ?? user.UserName));
            }

            await RecordEmailSentToUser(notification.Id, userId);
        }
    }
    else
    {
        SendNotificationEmail(template, $"{notification.UserIds.Length} subscribers");
    }
}

private void SendNotificationEmail(EmailTemplate template, string toName)
{
    var notificationsEmail = AppSettings.GetString("NotificationsFromEmail");
    var email = template.ToEmailMessage(notificationsEmail, toName);
    Email.Send(email);
}

private async Task RecordEmailSentToUser(long notificationId, int userId)
{
    await Db.ExecuteSqlAsync(@"UPDATE notification SET emailed_user_ids = emailed_user_ids || @userId
        WHERE id = @id", new { userId, id = notificationId });
}
```

## Replaying Messages

The `RetryPendingNotifications` Service replays incomplete notifications by publishing new `SendNotification` messages which are executed by the `BackgroundMqService` as normal. 
This also lets you replay failed notifications by setting `Failed` to `null` and recalling the Service. As the state of each task is persisted after each step, it can fail at any point and the replayed task will be able to restart where it left off.

```csharp
public object Any(RetryPendingNotifications request)
{
    var pendingNotificationIds = Db.Column<long>(Db.From<Notification>()
            .Where(x => x.Completed == null && x.Failed == null)
            .Select(x => x.Id))
        .ToArray();

    if (pendingNotificationIds.Length > 0)
    {
        log.Info($"Resending {pendingNotificationIds.Length} pending notifications: {pendingNotificationIds}");

        foreach (var notificationId in pendingNotificationIds)
        {
            PublishMessage(new SendNotification { Id = notificationId });
        }
    }
    
    return new RetryPendingNotificationsResponse {
        ResentIds = pendingNotificationIds
    };
}
```

## MQ Status

The other benefit from persisting the status of each tasks is being able to inspect the `Notification` and `EmailTemplate` table to be able to monitor the progress of each Task. 

We can also call the [IMessageService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageService.cs) APIs to inspect the state of the Background MQ Service. We can use the Service below to make the APIs accessible remotely:

```csharp
[Route("/mq/stop")]  // Stop the Background Service and all MQ Workers from processing more messages
public class MqStop : IReturn<string> {}

[Route("/mq/start")] // Start the Background Service and process any queued messages
public class MqStart : IReturn<string> {}

[Route("/mq/stats")]
public class MqStats : IReturn<string> {}

[Route("/mq/status")]
public class MqStatus : IReturn<string> {}

public class BackgroundAdminServices : Service
{
    public IMessageService MqService { get; set; }
    
    [RequiredRole("Admin")]
    public object Any(MqStart request)
    {
        MqService.Start();
        return "OK";
    }
    
    [RequiredRole("Admin")]
    public object Any(MqStop request)
    {
        MqService.Stop();
        return "OK";
    }

    public object Any(MqStats request) => MqService.GetStats();

    [AddHeader(ContentType = MimeTypes.PlainText)]
    public object Any(MqStatus request) => MqService.GetStatsDescription();
}
```

This lets you can call [/mq/stats](https://techstacks.io/mq/stats.json) to view a summary of **all messages processed** since the last time the App was restarted and [/mq/status](https://techstacks.io/mq/status) to view **all Queues** the Background Service is currently listening to and the **statistics of each individual MQ worker**. 

Here's a snapshot of what this looks like for TechStacks with 4 threads listening to `SendNotification` messages and 1 thread listening to `SendSystemEmail`:

```
# MQ SERVER STATS:

STATUS: Started

LISTENING ON: 
  mq:SendNotification.inq
  mq:SendNotification.inq
  mq:SendNotification.inq
  mq:SendNotification.inq
  mq:SendSystemEmail.inq

------------------------------

# COLLECTIONS:

------------------------------
INFO SendNotification:

STATS:
  Thread Count:         4
  Total Messages Added: 27
  Total Messages Taken: 0
  Total .outq Messages: 27
  Total .dlq Messages:  0
QUEUES:
  mq:SendNotification.inq:        0 message(s)
  mq:SendNotification.priorityq:  0 message(s)
  mq:SendNotification.dlq:        0 message(s)
  mq:SendNotification.outq:       27 message(s)
------------------------------
INFO SendSystemEmail:

STATS:
  Thread Count:         1
  Total Messages Added: 1
  Total Messages Taken: 0
  Total .outq Messages: 1
  Total .dlq Messages:  0
QUEUES:
  mq:SendSystemEmail.inq:         0 message(s)
  mq:SendSystemEmail.priorityq:   0 message(s)
  mq:SendSystemEmail.dlq:         0 message(s)
  mq:SendSystemEmail.outq:        1 message(s)
------------------------------

# WORKERS:

------------------------------
WORKER 1 on mq:SendNotification.inq 
STATS for SendNotification:

  TotalNormalMessagesReceived:    7
  TotalPriorityMessagesReceived:  0
  TotalProcessed:                 7
  TotalRetries:                   0
  TotalFailed:                    0
  LastMessageProcessed:           4/9/18 7:44:49 PM
------------------------------
WORKER 2 on mq:SendNotification.inq 
STATS for SendNotification:

  TotalNormalMessagesReceived:    7
  TotalPriorityMessagesReceived:  0
  TotalProcessed:                 7
  TotalRetries:                   0
  TotalFailed:                    0
  LastMessageProcessed:           4/9/18 7:49:17 PM
------------------------------
WORKER 3 on mq:SendNotification.inq 
STATS for SendNotification:

  TotalNormalMessagesReceived:    7
  TotalPriorityMessagesReceived:  0
  TotalProcessed:                 7
  TotalRetries:                   0
  TotalFailed:                    0
  LastMessageProcessed:           4/9/18 8:28:59 PM
------------------------------
WORKER 4 on mq:SendNotification.inq 
STATS for SendNotification:

  TotalNormalMessagesReceived:    6
  TotalPriorityMessagesReceived:  0
  TotalProcessed:                 6
  TotalRetries:                   0
  TotalFailed:                    0
  LastMessageProcessed:           4/9/18 7:41:18 PM
------------------------------
WORKER 5 on mq:SendSystemEmail.inq 
STATS for SendSystemEmail:

  TotalNormalMessagesReceived:    1
  TotalPriorityMessagesReceived:  0
  TotalProcessed:                 1
  TotalRetries:                   0
  TotalFailed:                    0
  LastMessageProcessed:           4/9/18 7:44:47 PM
------------------------------
```


### MQ Collection Stats

You can also get info on the Queue Collection for a specific DTO Type with:

```csharp
var bgService = (BackgroundMqService)HostContext.Resolve<IMessageService>();
var mqCollection = bgService.GetCollection(typeof(Poco));
Dictionary<string, long> statsMap = mqCollection.GetDescriptionMap();
```

Which returns the text info that [mqCollection.GetDescription()](/background-mq#mq-status) returns, but in a structured Dictionary using the keys:

 - `ThreadCount`
 - `TotalMessagesAdded`
 - `TotalMessagesTaken`
 - `TotalOutQMessagesAdded`
 - `TotalDlQMessagesAdded`

The dictionary also includes each the snapshot counts of each queue in the MQ Collection, e.g:

 - `mq:Poco.inq`
 - `mq:Poco.priorityq`
 - `mq:Poco.outq`
 - `mq:Poco.dlq`

You can also get the Stats of each MQ Worker, or if you have multiple workers for a Request Type you can access them with:

```csharp
IMqWorker[] workers = bgService.GetWorkers(QueueNames<Type>.In);
List<IMessageHandlerStats> stats = workers.Map(x => x.GetStats());
```

Then combine them to get their cumulative result:

```csharp
IMessageHandlerStats combinedStats = stats.CombineStats();
```
