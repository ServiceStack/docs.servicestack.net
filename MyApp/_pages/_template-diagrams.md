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
