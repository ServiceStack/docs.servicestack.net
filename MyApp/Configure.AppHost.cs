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
    }
}

public class Hello : IReturn<StringResponse> {}
public class MyServices : Service
{
    public object Any(Hello request) => new StringResponse { Result = $"Hello, World!" };
}
