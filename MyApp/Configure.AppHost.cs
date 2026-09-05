[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Configure ASP.NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Funq.Container container)
    {
        SetConfig(new HostConfig {
            IgnorePathInfoPrefixes = {
                "/templates",
            },
            AllowFileExtensions = {
                "cast"
            }
        });
        Plugins.RemoveAll(x => x is UiFeature);

        StartupTasks.Register("latest.mjs", () => {
            var pagesDir = new DirectoryInfo(Path.Combine(ContentRootDirectory.RealPath, "_pages"));
            var mdFiles = pagesDir.GetFiles("*.md", SearchOption.AllDirectories)
                .OrderByDescending(f => f.LastWriteTimeUtc)
                .Take(21)
                .ToList();

            var sb = new System.Text.StringBuilder();
            sb.AppendLine("export const latestPages = [");

            foreach (var file in mdFiles)
            {
                var lines = File.ReadAllLines(file.FullName);

                // Parse frontmatter title
                string? title = null;
                int contentStart = 0;
                if (lines.Length > 0 && lines[0].Trim() == "---")
                {
                    for (int i = 1; i < lines.Length; i++)
                    {
                        if (lines[i].Trim() == "---") { contentStart = i + 1; break; }
                        if (lines[i].StartsWith("title:"))
                            title = lines[i]["title:".Length..].Trim().Trim('"');
                    }
                }

                // Derive href from file path relative to _pages
                var rel = Path.GetRelativePath(pagesDir.FullName, file.FullName)
                    .Replace('\\', '/');
                // strip .md extension
                rel = rel[..^3];
                // index files become trailing-slash hrefs
                if (rel.EndsWith("/index")) rel = rel[..^"index".Length];
                else if (rel == "index") rel = "";
                var href = "/" + rel;

                title ??= Path.GetFileNameWithoutExtension(file.Name);

                // Find first non-empty, non-HTML, non-frontmatter, non-markdown-directive line
                string? text = null;
                for (int i = contentStart; i < lines.Length; i++)
                {
                    var line = lines[i].Trim();
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    if (line.StartsWith('#')) continue;       // headings
                    if (line.StartsWith(":::")) continue;     // custom containers
                    if (line.StartsWith("```")) continue;     // code blocks
                    if (line.StartsWith("<")) continue;        // HTML tags
                    if (line.StartsWith("![")) continue;      // images
                    if (line.StartsWith("[")) continue;       // links
                    // Strip inline markdown: bold/italic/backticks
                    var clean = System.Text.RegularExpressions.Regex.Replace(line, @"[*_`]+", "");
                    // Truncate to ~120 chars for display
                    if (clean.Length > 120) clean = clean[..117] + "…";
                    text = clean;
                    break;
                }
                text ??= title;

                var titleJson = System.Text.Json.JsonSerializer.Serialize(title);
                var hrefJson  = System.Text.Json.JsonSerializer.Serialize(href);
                var textJson  = System.Text.Json.JsonSerializer.Serialize(text);

                // Use the parent folder name as badge for pages in subdirectories
                var folder = Path.GetRelativePath(pagesDir.FullName, file.Directory!.FullName);
                var badgeJson = folder == "." ? "null" : System.Text.Json.JsonSerializer.Serialize(folder);

                sb.AppendLine($"    {{ name:{titleJson}, href:{hrefJson}, text:{textJson}, badge:{badgeJson} }},");
            }

            sb.AppendLine("]");

            var outDir = Path.Combine(ContentRootDirectory.RealPath, "wwwroot", "mjs", "data");
            Directory.CreateDirectory(outDir);
            var outPath = Path.Combine(outDir, "latest.mjs");
            File.WriteAllText(outPath, sb.ToString());
            Console.WriteLine($"Written {mdFiles.Count} recent pages to {outPath}");
        });
    }
}

public class Hello : IReturn<StringResponse> {}
public class MyServices : Service
{
    public object Any(Hello request) => new StringResponse { Result = $"Hello, World!" };
}
