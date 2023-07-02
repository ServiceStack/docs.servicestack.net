```csharp
// Custom filters for App data sources and re-usable UI snippets in ServiceStack Sharp Pages

using Microsoft.AspNetCore.Mvc.Rendering;
using ServiceModel.Types;
using ServiceStack.Script;

public class ContactScripts : ScriptMethods
{
    internal readonly List<KeyValuePair<string, string>> MenuItems = new()
    {
        KeyValuePair.Create("/", "Home"),
        KeyValuePair.Create("/login-links", "Login Links"),
        KeyValuePair.Create("/register-links", "Register Links"),
        KeyValuePair.Create("/contact-links", "Contacts Links"),
        KeyValuePair.Create("/contact-edit-links", "Edit Contact Links"),
    };

    public List<KeyValuePair<string, string>> menuItems() => MenuItems;

    static Dictionary<string, string> Colors = new()
    {
        {"#ffa4a2", "Red"},
        {"#b2fab4", "Green"},
        {"#9be7ff", "Blue"}
    };

    public Dictionary<string, string> contactColors() => Colors;

    private static List<KeyValuePair<string, string>> Titles => EnumUtils.GetValues<Title>()
        .Where(x => x != Title.Unspecified)
        .ToKeyValuePairs();

    public List<KeyValuePair<string, string>> contactTitles() => Titles;

    private static List<string> FilmGenres => EnumUtils.GetValues<FilmGenres>().Map(x => x.ToDescription());
    public List<string> contactGenres() => FilmGenres;
}

// Razor Helpers for App data sources and re-usable UI snippets in Razor pages
public static class RazorHelpers
{
    internal static readonly ContactScripts Instance = new ContactScripts();
        
    public static Dictionary<string, string> ContactColors(this IHtmlHelper html) => Instance.contactColors();
    public static List<KeyValuePair<string, string>> ContactTitles(this IHtmlHelper html) => Instance.contactTitles();
    public static List<string> ContactGenres(this IHtmlHelper html) => Instance.contactGenres();
    public static List<KeyValuePair<string, string>> MenuItems(this IHtmlHelper html) => Instance.MenuItems;
}
```
