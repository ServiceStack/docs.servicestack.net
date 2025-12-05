---
title: Migrate to ASP.NET Core Identity Auth
---

## Migrate from ServiceStack Auth to Identity Auth

Migrating from ServiceStack Auth to Identity Auth should be relatively straight-forward as ServiceStack uses a compatible
Identity v2 password hashing format, which should let you migrate your users to Identity Auth without them noticing.

:::info TIP
Please ensure your App database is backed up before performing any migrations
:::

### 1. Rename old AppUser table

You'll want to use a different name so it doesn't conflict with the new Identity `ApplicationUser`. This is only needed
to query the User data to migrate to Identity Auth, you'll be able to remove it after successfully migrating all Users.

You don't need to include all the properties of the `UserAuth` base table, just the ones you want to migrate to Identity Auth,
which for Blazor Diffusion was only:

```csharp
// Used by OrmLite to fetch User data to migrate from old ServiceStack `AppUser` table
[Alias("AppUser")]
public class OldAppUser
{
    [AutoIncrement]
    public int Id { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Handle { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string? ProfileUrl { get; set; }
    public string? Avatar { get; set; } //overrides ProfileUrl
    public string? LastLoginIp { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public string RefIdStr { get; set; }
    public DateTime? LockedDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```

### 2. Create Identity Auth Data Model

If you have a lot of existing references to the `AppUser` name you'll want to retain the same name so the existing references
wont need to be updated. Essentially your custom EF IdentityUser will want a copy of all the properties you want to migrate
other than `Id`, `Email`, and `PasswordHash` that's already defined in the base `IdentityUser` class:

```csharp
[Alias("AspNetUsers")] // Tell OrmLite which table this EF Data Model maps to
public class AppUser : IdentityUser<int>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
    [Input(Type = "file"), UploadTo("avatars")]
    public string? Avatar { get; set; } //overrides ProfileUrl
    public string? Handle { get; set; }
    public int? RefId { get; set; }
    public string RefIdStr { get; set; } = Guid.NewGuid().ToString();
    public bool IsArchived { get; set; }
    public DateTime? ArchivedDate { get; set; }
    public string? LastLoginIp { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;
}
```

The `AppUser` Data Model and `int` primary key would also need to be registered in your
[Configure.Auth.cs](https://github.com/NetCoreApps/BlazorDiffusionVue/blob/main/BlazorDiffusion/Configure.Auth.cs):

```csharp
public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            appHost.Plugins.Add(new AuthFeature(IdentityAuth.For<AppUser,int>(
                options => {
                    // options.SessionFactory = () => new CustomUserSession(); //optional
                    options.CredentialsAuth();
                })
            ));
        });
}
```

### 3. Add Authentication Configuration

You'll need to configure Entity Framework and add your desired ASP.NET Identity Auth configuration to your **Program.cs**.

We recommend copying from a new Microsoft or ServiceStack .NET 10 Project which closely matches the Authentication
options you want to enable.

#### Using Identity Auth Application Cookie

For example you can start with the recommended Authentication for a new Blazor Project from its [Program.cs](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp/Program.cs):

```csharp
services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("App_Data"));

// $ dotnet ef migrations add CreateIdentitySchema
// $ dotnet ef database update
var connectionString = config.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString, b => b.MigrationsAssembly(nameof(MyApp))));
services.AddDatabaseDeveloperPageExceptionFilter();

services.AddIdentityCore<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

services.AddSingleton<IEmailSender, NoOpEmailSender>();
services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AdditionalUserClaimsPrincipalFactory>();
```

#### Using Identity Auth OAuth Providers

Alternatively if you want to add support for external OAuth logins you can copy from the **MVC Tailwind** Authentication
configuration in its [Program.cs](https://github.com/NetCoreTemplates/mvc/blob/main/MyApp/Program.cs) which will
also require adding the NuGet dependencies of the OAuth providers you want to support which you can get from its
[MyApp.csproj](https://github.com/NetCoreTemplates/mvc/blob/main/MyApp/MyApp.csproj)

### 4. Create and Run EF Migrations

After your App is properly configured you'll want to create the EF Migrations for your the Identity Auth User tables
by installing the [dotnet-ef tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) and running:

:::sh
dotnet ef migrations add CreateIdentitySchema
:::

Which should create the EF Migrations in the `/Migrations` folder, you can then run the migrations to create the
Identity Auth tables in your App's configured database:

:::sh
dotnet ef database update
:::

### 5. Implement the Migrate Users Task

This could be implemented in a separate Application or Unit Test although we've found the easiest way to migrate existing users
is to implement a custom [App Task](https://docs.servicestack.net/app-tasks) as it's able to make use of your App's configured Authentication, EF and OrmLite dependencies
that can then be run from the command-line.

The implementation should be fairly straight-forward, you'll basically just need to create a new Identity Auth User
using the `UserManager<AppUser>` dependency for each of your existing users:

```csharp
public class ConfigureDbMigrations : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            AppTasks.Register("migrate.users", _ => {
                var log = appHost.GetApplicationServices().GetRequiredService<ILogger<ConfigureDbMigrations>>();

                log.LogInformation("Running migrate.users...");
                var scopeFactory = appHost.GetApplicationServices().GetRequiredService<IServiceScopeFactory>();
                using var scope = scopeFactory.CreateScope();
                using var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                using var db = scope.ServiceProvider.GetRequiredService<IDbConnectionFactory>().Open();
                var migrateUsers = db.Select(db.From<OldAppUser>().OrderBy(x => x.Id));

                log.LogInformation("Migrating {Count} Existing ServiceStack Users to Identity Auth Users...", migrateUsers.Count);
                MigrateExistingUsers(dbContext, scope.ServiceProvider, migrateUsers).Wait();
            });
            AppTasks.Run();
        });

    private async Task MigrateExistingUsers(ApplicationDbContext dbContext, IServiceProvider services, 
        List<OldAppUser> migrateUsers, string tempPassword="p@55wOrd")
    {
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var now = DateTime.UtcNow;

        foreach (var user in migrateUsers)
        {
            var appUser = new AppUser
            {
                Id = user.Id,
                UserName = user.Email,
                Email = user.Email,
                DisplayName = user.DisplayName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Handle = user.Handle,
                ProfileUrl = user.ProfileUrl,
                Avatar = user.Avatar,
                RefIdStr = user.RefIdStr ?? Guid.NewGuid().ToString(),
                LockoutEnabled = true,
                LockoutEnd = user.LockedDate != null ? now.AddYears(10) : now,
                LastLoginDate = user.LastLoginDate,
                LastLoginIp = user.LastLoginIp,
                CreatedDate = user.CreatedDate,
                ModifiedDate = user.ModifiedDate,
                // Verify you want existing Users emails to be confirmed
                EmailConfirmed = true,
            };
            await userManager.CreateAsync(appUser, tempPassword);

            // Update raw Password Hash using EF
            if (user.PasswordHash != null)
            {
                dbContext.Users
                    .Where(x => x.Id == user.Id)
                    .ExecuteUpdate(setters => setters.SetProperty(x => x.PasswordHash, user.PasswordHash));
            }
        }
    }
}    
```

As there's no official API for updating the raw `PasswordHash` you'll need to use EF's `ExecuteUpdate()` API to update it
on the `AspNetUsers` table directly.

It should be noted that ServiceStack Auth still uses ASP.NET Core's previous Identity v2 format for hashing its passwords,
this will be automatically re-hashed using the latest ASP.NET Identity v3 format after users successfully sign in.

#### Optimizing the PasswordHash Update

Whilst migrating users should be a once-off task, if you have a lot of users you may want to optimize the `PasswordHash` update
from a **N+1** query per user to a single query that updates all users in a single command.

You'll need to use the **UPDATE FROM** syntax that's supported by your RDBMS's, here's an example of how to do it in SQLite:

```sql
UPDATE AspNetUsers
SET PasswordHash = u.PasswordHash
FROM (SELECT Email, PasswordHash FROM AppUser WHERE PasswordHash is NOT NULL) AS u
WHERE u.Email = AspNetUsers.Email;
```

#### Migrating Roles

Migrating Roles will depend how their stored in your App, you'll first need to ensure each role is created in the `AspNetRoles`
table with:

```csharp
string[] allRoles = [...]; // All Roles in your App
var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
foreach (var roleName in allRoles)
{
    var roleExist = await roleManager.RoleExistsAsync(roleName);
    if (!roleExist)
    {
        await roleManager.CreateAsync(new IdentityRole(roleName));
    }
}
```

You can then assign Roles to Users using the `UserManager<AppUser>`, e.g:

```csharp
string[] roles = [...]; // Roles to assign to User 
var newUser = await userManager.FindByEmailAsync(user.Email!);
await userManager.AddToRolesAsync(user, roles);
```

### 6. Run the migrate.users Task

With everything in place, all that's left is to run the `migrate.users` App Task from the command-line:

:::sh
dotnet run --AppTasks=migrate.users
:::

### 7. Verify Users can Sign In

After successfully migrating all your users you should check the new `IdentityUser` table to verify all the User data
you want has been migrated as well as verifying they can sign in with their existing credentials.

The easiest way to include the Identity Auth UI Pages to your App is to copy your Application into a new .NET 10 Project
that already includes them, you can create a new Blazor App with:

:::sh
npx create-net blazor ProjectNamespace
:::

Or create a new MVC App with:

:::sh
npx create-net mvc ProjectNamespace
:::

Alternatively you can manually copy the pages from the project template repositories, for Blazor most of the Identity Auth
UI Pages are in the
[Components/Identity](https://github.com/NetCoreTemplates/blazor/tree/main/MyApp/Components/Identity) and
[Pages/Account](https://github.com/NetCoreTemplates/blazor/tree/main/MyApp/Components/Pages/Account) folders.

For MVC, most of the Identity UI are in the
[Account](https://github.com/NetCoreTemplates/mvc/blob/main/MyApp/Controllers/AccountController.cs)
and [Manage](https://github.com/NetCoreTemplates/mvc/blob/main/MyApp/Controllers/ManageController.cs) controllers
as well as their
[Views/Account](https://github.com/NetCoreTemplates/mvc/tree/main/MyApp/Views/Account) and
[Views/Manage](https://github.com/NetCoreTemplates/mvc/tree/main/MyApp/Views/Manage) folders.

### SMTP IEmailSender

The .NET 10 Templates include a nice solution for sending Identity Auth emails through the `IEmailSender` interface
which drops the Email Request in the registered Background MQ in
[Configure.Mq.cs](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp/Configure.Mq.cs)
which uses it to invoke the `SendEmail` API in
[EmailServices](https://github.com/NetCoreTemplates/blazor/blob/main/MyApp.ServiceInterface/EmailServices.cs) in a
managed background worker:

```csharp
public class EmailSender(IMessageService messageService) : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        using var mqClient = messageService.CreateMessageProducer();
        mqClient.Publish(new SendEmail
        {
            To = email,
            Subject = subject,
            BodyHtml = htmlMessage,
        });

        return Task.CompletedTask;
    }
}
```

To enable it you'll need to register your preferred SMTP Server in your App's `appsettings.json`:

```json
{
  "SmtpConfig": {
    "Username": "username",
    "Password": "password",
    "Host": "smtp.mailtrap.io",
    "Port": 587,
    "FromEmail": "mail@example.org"
  }
}
```

Then replace the `IEmailSender` registration in your `Program.cs`

```csharp
services.AddSingleton<IEmailSender, EmailSender>();
```
