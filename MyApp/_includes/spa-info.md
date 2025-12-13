## Configuration

### Key Configuration Files

- **MyApp/appsettings.json** - Application configuration
- **MyApp.Client/next.config.mjs** - Next.js configuration
- **MyApp.Client/styles/index.css** - Tailwind CSS configuration
- **config/deploy.yml** - Kamal deployment settings

### App Settings

Configure in `appsettings.json` or environment:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "DataSource=App_Data/app.db;Cache=Shared"
  },
  "SmtpConfig": {
    "Host": "smtp.example.com",
    "Port": 587,
    "FromEmail": "noreply@example.com",
    "FromName": "MyApp"
  },
  "AppConfig": {
    "BaseUrl": "https://myapp.example.com"
  }
}
```

### App Settings Secrets

Instead of polluting each GitHub Repository with multiple App-specific GitHub Action Secrets, all templates includes built-in support in its GitHub Action workflows for updating an App's entire `appsettings.Production.json` inside a single `APPSETTINGS_JSON` GitHub Action Secret.

### Workflow: Development to Production

Run the `secret:prod` npm script to securely store your production configuration in GitHub Actions:

```bash
npm run secret:prod
```

This uses the GitHub CLI to add your `appsettings.Production.json` to your GitHub repository's Action secrets:

```bash
gh secret set APPSETTINGS_JSON < appsettings.Production.json
```

### SMTP Email

Enable email sending by uncommenting in `Program.cs`:

```csharp
services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
```

## Upgrading to Enterprise Database

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (ef-postgres, ef-mysql, ef-sqlserver), e.g:

:::sh
npx add-in ef-postgres
:::

2. Install `db-identity` to use RDBMS `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for Request Logs:

:::sh
npx add-in db-identity
:::

## AutoQuery CRUD Dev Workflow

For Rapid Development simple [TypeScript Data Models](https://docs.servicestack.net/autoquery/okai-models) can be used to generate C# AutoQuery APIs and DB Migrations.

### Cheat Sheet

### Create a new Table

Create a new Table use `init <Table>`, e.g:

:::sh
npx okai init Table
:::

This will generate an empty `MyApp.ServiceModel/<Table>.d.ts` file along with stub AutoQuery APIs and DB Migration implementations. 

### Use AI to generate the TypeScript Data Model

Or to get you started quickly you can also use AI to generate the initial TypeScript Data Model with:

:::sh
npx okai "Table to store Customer Stripe Subscriptions"
:::

This launches a TUI that invokes ServiceStack's okai API to fire multiple concurrent requests to frontier cloud 
and OSS models to generate the TypeScript Data Models required to implement this feature. 
You'll be able to browse and choose which of the AI Models you prefer which you can accept by pressing `a` 
to `(a) accept`. These are the data models [Claude Sonnet 4.5 generated](https://servicestack.net/text-to-blazor?id=1764337230546) for this prompt.

#### Regenerate AutoQuery APIs and DB Migrations

After modifying the `Table.d.ts` TypeScript Data Model to include the desired fields, re-run the `okai` tool to re-generate the AutoQuery APIs and DB Migrations:

:::sh
npx okai Table.d.ts
:::

> Command can be run anywhere within your Solution

After you're happy with your Data Model you can run DB Migrations to run the DB Migration and create your RDBMS Table:

:::sh
npm run migrate
:::

#### Making changes after first migration

If you want to make further changes to your Data Model, you can re-run the `okai` tool to update the AutoQuery APIs and DB Migrations, then run the `rerun:last` npm script to drop and re-run the last migration:

:::sh
npm run rerun:last
:::

#### Removing a Data Model and all generated code

If you changed your mind and want to get rid of the RDBMS Table you can revert the last migration:

:::sh
npm run revert:last
:::

Which will drop the table and then you can get rid of the AutoQuery APIs, DB Migrations and TypeScript Data model with:

:::sh
npx okai rm Transaction.d.ts
:::

## Deployment

### Docker + Kamal

This project includes GitHub Actions for CI/CD with automatic Docker image builds and production [deployment with Kamal](https://docs.servicestack.net/kamal-deploy). The `/config/deploy.yml` configuration is designed to be reusable across projects—it dynamically derives service names, image paths, and volume mounts from environment variables, so you only need to configure your server's IP and hostname using GitHub Action secrets.

### GitHub Action Secrets

**Required - App Specific*:

The only secret needed to be configured per Repository.

| Variable | Example | Description |
|----------|---------|-------------|
| `KAMAL_DEPLOY_HOST` | `example.org` | Hostname used for SSL certificate and Kamal proxy |

**Required** (Organization Secrets):

Other Required variables can be globally configured in your GitHub Organization or User secrets which will
enable deploying all your Repositories to the same server.

| Variable | Example  | Description |
|----------|----------|-------------|
| `KAMAL_DEPLOY_IP`   | `100.100.100.100` | IP address of the server to deploy to |
| `SSH_PRIVATE_KEY`   | `ssh-rsa ...`     | SSH private key to access the server |
| `LETSENCRYPT_EMAIL` | `me@example.org`  | Email for Let's Encrypt SSL certificate |

**Optional**:

| Variable | Example | Description |
|----------|---------|-------------|
| `SERVICESTACK_LICENSE` | `...` | ServiceStack license key |

**Inferred** (from GitHub Action context):

These are inferred from the GitHub Action context and don't need to be configured.

| Variable | Source | Description |
|----------|--------|-------------|
| `GITHUB_REPOSITORY` | `${{ github.repository }}` | e.g. `acme/example.org` - used for service name and image |
| `KAMAL_REGISTRY_USERNAME` | `${{ github.actor }}` | GitHub username for container registry |
| `KAMAL_REGISTRY_PASSWORD` | `${{ secrets.GITHUB_TOKEN }}` | GitHub token for container registry auth |

#### Features

- **Docker containerization** with optimized .NET images
- **SSL auto-certification** via Let's Encrypt
- **GitHub Container Registry** integration
- **Volume persistence** for App_Data including any SQLite database

## AI-Assisted Development with CLAUDE.md

As part of our objectives of improving developer experience and embracing modern AI-assisted development workflows - all new .NET SPA templates include a comprehensive `AGENTS.md` file designed to optimize AI-assisted development workflows.

### What is CLAUDE.md?

`CLAUDE.md` and [AGENTS.md](https://agents.md) onboards Claude (and other AI assistants) to your codebase by using a structured documentation file that provides it with complete context about your project's architecture, conventions, and technology choices. This enables more accurate code generation, better suggestions, and faster problem-solving.

### What's Included

Each template's `AGENTS.md` contains:

- **Project Architecture Overview** - Technology stack, design patterns, and key architectural decisions
- **Project Structure** - Gives Claude a map of the codebase
- **ServiceStack Conventions** - DTO patterns, Service implementation, AutoQuery, Authentication, and Validation
- **API Integration** - TypeScript DTO generation, API client usage, component patterns, and form handling
- **Database Patterns** - OrmLite setup, migrations, and data access patterns
- **Common Development Tasks** - Step-by-step guides for adding APIs, implementing features, and extending functionality
- **Testing & Deployment** - Test patterns and deployment workflows

### Extending with Project-Specific Details

The existing `CLAUDE.md` serves as a solid foundation, but for best results, you should extend it with project-specific details like the purpose of the project, key parts and features of the project and any unique conventions you've adopted.

### Benefits

- **Faster Onboarding** - New developers (and AI assistants) understand project conventions immediately
- **Consistent Code Generation** - AI tools generate code following your project's patterns
- **Better Context** - AI assistants can reference specific ServiceStack patterns and conventions
- **Reduced Errors** - Clear documentation of framework-specific conventions
- **Living Documentation** - Keep it updated as your project evolves

### How to Use

Claude Code and most AI Assistants already support automatically referencing `CLAUDE.md` and `AGENTS.md` files, for others you can just include it in your prompt context when asking for help, e.g:

> Using my project's AGENTS.md, can you help me add a new AutoQuery API for managing Products?

The AI will understand your App's ServiceStack conventions, React setup, and project structure, providing more accurate and contextual assistance.