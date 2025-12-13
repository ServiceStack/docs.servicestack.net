---
title: React Templates
---


## Vue SPA

### Development

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph DEVELOPMENT["DEVELOPMENT"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        DevNext[/"Vite App<br>(localhost:5173)<br>Runs concurrently"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer -- /* Fallback<br>(Proxied) --> DevNext
    DevServer -- Vite HMR<br>(Websocket) --> DevNext

    Identity:::static
    Endpoints:::static
    DevServer:::netHost
    DevNext:::nextApp
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

## Angular SPA

### Development

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph DEVELOPMENT["DEVELOPMENT"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        DevNext[/"Vite React App<br>(localhost:5173)<br>Runs concurrently"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer -- /* Fallback<br>(Proxied) --> DevNext
    DevServer -- Vite HMR<br>(Websocket) --> DevNext

    Identity:::static
    Endpoints:::static
    DevServer:::netHost
    DevNext:::nextApp
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

### Production

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph PRODUCTION["PRODUCTION"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        StaticFiles[/"/wwwroot<br>Serves static files<br>(HTML, CSS, JS)"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer <-- /* Static Files --> StaticFiles

    DevServer:::netHost
    Identity:::static
    Endpoints:::static
    StaticFiles:::static

    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```




## React Static

### Development

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph DEVELOPMENT["DEVELOPMENT"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        DevNext[/"Vite React App<br>(localhost:5173)<br>Runs concurrently"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer -- /* Fallback<br>(Proxied) --> DevNext
    DevServer -- Vite HMR<br>(Websocket) --> DevNext

    Identity:::static
    Endpoints:::static
    DevServer:::netHost
    DevNext:::nextApp
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

### Production

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph PRODUCTION["PRODUCTION"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        StaticFiles[/"/wwwroot<br>Serves static files<br>(HTML, CSS, JS)"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer <-- /* Static Files --> StaticFiles

    DevServer:::netHost
    Identity:::static
    Endpoints:::static
    StaticFiles:::static

    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

## Next.js Static

### Development

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph DEVELOPMENT["DEVELOPMENT"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        subgraph NEXTJS["NodeProxy"]
            DevNext[/"Next.js App<br>(localhost:3000)<br>Runs concurrently"/]
        end
  end
    DevServer -- /* --> Endpoints
    DevServer -- /Identity/* --> Identity
    DevServer -- /* Fallback requests<br>(Proxied) --> DevNext
    DevServer -- /_next HMR<br>(Websocket) --> DevNext

     DevNext:::nextApp
     DevServer:::netHost
     Identity:::static
     Endpoints:::static
     NEXTJS:::static
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

### Production

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph PRODUCTION["PRODUCTION"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        StaticFiles[/"/wwwroot<br>Serves static files<br>(HTML, CSS, JS)"/]
  end
    DevServer -- /Identity/* --> Identity
    DevServer -- /* --> Endpoints
    DevServer <-- /* Static Files --> StaticFiles

    DevServer:::netHost
    Identity:::static
    Endpoints:::static
    StaticFiles:::static

    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

## Next.js React Server Components

### Development

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph DEVELOPMENT["DEVELOPMENT"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        subgraph NEXTJS["NodeProxy"]
            DevNext[/"Next.js App<br>(localhost:3000)<br>Runs concurrently"/]
        end
  end
    DevServer -- /* --> Endpoints
    DevServer -- /Identity/* --> Identity
    DevServer -- /* Fallback requests<br>(Proxied) --> DevNext
    DevServer -- /_next HMR<br>(Websocket) --> DevNext

     DevNext:::nextApp
     DevServer:::netHost
     Identity:::static
     Endpoints:::static
     NEXTJS:::static
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

### Production

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart LR
 subgraph PRODUCTION["PRODUCTION"]
    direction LR
        DevServer[(".NET PROJECT<br>(localhost:5001)")]
        Identity("ASP.NET Core Identity<br>Razor Pages")
        Endpoints(".NET Endpoint Routing")
        subgraph NEXTJS["NodeProxy"]
            Cache["Static file<br>Managed Cache"]
            DevNext[/"Next.js App<br>(localhost:3000)<br>Runs concurrently"/]
        end
  end
    DevServer -- /* --> Endpoints
    DevServer -- /Identity/* --> Identity
    DevServer -- /* Fallback requests<br>(Proxied) --> Cache --> DevNext

     DevNext:::nextApp
     DevServer:::netHost
     Identity:::static
     Endpoints:::static
     NEXTJS:::static
    classDef netHost fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px,color:#1e3a8a
    classDef nextApp fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px,color:#6b21a8
    classDef static fill:#ecfdf5,stroke:#047857,stroke-width:2px
```

### Security

```mermaid
---
config:
  layout: dagre
  look: neo
  theme: redux
  themeVariables:
    edgeLabelBackground: '#ffffff'
---
flowchart TB
 subgraph NET[".NET Process (port 8080)<br>(root user)"]
        NETAPI["/app/dotnet/<br>rwx------ root<br><br>💾 App_Data/<br>📄 appsettings<br>📦 *.dll<br>"]
  end
 subgraph NODE["Node.js Process (port 3000)<br>(nextjs user)"]
        NODECLIENT["/app/nextjs/<br>r-x--- nextjs<br><br>📁 node_modules/<br>📦 dist/<br>🎨 public/<br>📄 package.json"]
  end
 subgraph Docker["🐳 Docker Container"]
        NET
        NODE
  end
    NET <-- (Proxy) --> NODE
    BLOCK["✅ Only .NET CAN access /app/dotnet/<br><br>🚫 Node.js CAN ONLY access /tmp + /app/nextjs"]

     BLOCK:::security
    classDef security fill:#ffebee,stroke:#c62828,stroke-width:2px
    style NETAPI fill:#bbdefb,stroke:#1976d2
    style NODECLIENT fill:#ffe0b2,stroke:#f57c00
    style NET fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style NODE fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style Docker fill:#f0f0f0,stroke:#333,stroke-width:3px
```