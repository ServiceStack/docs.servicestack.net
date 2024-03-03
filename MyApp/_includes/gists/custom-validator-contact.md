```csharp
public class CreateContactValidator : AbstractValidator<CreateContact>
{
    public CreateContactValidator()
    {
        RuleFor(r => r.Title).NotEqual(Title.Unspecified).WithMessage("Please choose a title");
        RuleFor(r => r.Name).NotEmpty();
        RuleFor(r => r.Color).Must(x => x.IsValidColor()).WithMessage("Must be a valid color");
        RuleFor(r => r.FilmGenres).NotEmpty().WithMessage("Please select at least 1 genre");
        RuleFor(r => r.Age).GreaterThan(13).WithMessage("Contacts must be older than 13");
        RuleFor(x => x.Agree).Equal(true).WithMessage("You must agree before submitting");
    }
}

[Authenticate] // Limit to Authenticated Users
[ErrorView(nameof(CreateContact.ErrorView))] // Display ErrorView for HTML requests resulting in an Exception
[DefaultView("/server/contacts")] // Render custom HTML View for HTML Requests
public class ContactServices : Service
{
    private static int Counter = 0;
    internal static readonly ConcurrentDictionary<int, Data.Contact> Contacts = new ConcurrentDictionary<int, Data.Contact>();

    public object Any(GetContacts request)
    {
        var userId = this.GetUserId();
        return new GetContactsResponse
        {
            Results = Contacts.Values
                .Where(x => x.UserAuthId == userId)
                .OrderByDescending(x => x.Id)
                .Map(x => x.ConvertTo<Contact>())
        };
    }

    public object Any(GetContact request) =>
        Contacts.TryGetValue(request.Id, out var contact) && contact.UserAuthId == this.GetUserId()
            ? (object)new GetContactResponse { Result = contact.ConvertTo<Contact>() }
            : HttpError.NotFound($"Contact was not found");

    public object Any(CreateContact request) 
    {
        var newContact = request.ConvertTo<Data.Contact>();
        newContact.Id = Interlocked.Increment(ref Counter);
        newContact.UserAuthId = this.GetUserId();
        newContact.CreatedDate = newContact.ModifiedDate = DateTime.UtcNow;

        var contacts = Contacts.Values.ToList();
        var alreadyExists = contacts.Any(x => x.UserAuthId == newContact.UserAuthId && x.Name == request.Name);
        if (alreadyExists)
            throw new ArgumentException($"You already have a contact named '{request.Name}'", nameof(request.Name));
        
        Contacts[newContact.Id] = newContact;
        return new CreateContactResponse { Result = newContact.ConvertTo<Contact>() };
    }
    
    public object AnyHtml(CreateContact request) // Called for CreateContact API HTML Requests on any HTTP Method
    {
        Any(request);
        return HttpResult.Redirect(request.Continue ?? Request.GetView());
    }

    public void Any(DeleteContact request)
    {
        if (Contacts.TryGetValue(request.Id, out var contact) && contact.UserAuthId == this.GetUserId())
            Contacts.TryRemove(request.Id, out _);
    }

    public object PostHtml(DeleteContact request) // Only called by DeleteContact HTML POST requests 
    {
        Any(request);
        return HttpResult.Redirect(request.Continue ?? Request.GetView()); //added by [DefaultView]
    }
}

public class UpdateContactValidator : AbstractValidator<UpdateContact>
{
    public UpdateContactValidator()
    {
        RuleFor(r => r.Id).GreaterThan(0);
        RuleFor(r => r.Title).NotEqual(Title.Unspecified).WithMessage("Please choose a title");
        RuleFor(r => r.Name).NotEmpty();
        RuleFor(r => r.Color).Must(x => x.IsValidColor()).WithMessage("Must be a valid color");
        RuleFor(r => r.FilmGenres).NotEmpty().WithMessage("Please select at least 1 genre");
        RuleFor(r => r.Age).GreaterThan(13).WithMessage("Contacts must be older than 13");
    }
}

[ErrorView(nameof(UpdateContact.ErrorView))] // Display ErrorView for HTML requests resulting in an Exception
public class UpdateContactServices : Service
{
    public object Any(UpdateContact request)
    {
        if (!ContactServices.Contacts.TryGetValue(request.Id, out var contact) || contact.UserAuthId != this.GetUserId())
            throw HttpError.NotFound("Contact was not found");

        contact.PopulateWith(request);
        contact.ModifiedDate = DateTime.UtcNow;
        
        return request.Continue != null 
            ? (object) HttpResult.Redirect(request.Continue)
            : new UpdateContactResponse();
    }
}

public static class ContactServiceExtensions // DRY reusable logic used in Services and Validators
{
    public static int GetUserId(this Service service) => int.Parse(service.GetSession().UserAuthId);

    public static bool IsValidColor(this string color) => !string.IsNullOrEmpty(color) && 
        (color.FirstCharEquals('#')
            ? int.TryParse(color.Substring(1), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out _)
            : Color.FromName(color).IsKnownColor);
}

// Register Custom Auto Mapping for converting Contact Data Model to Contact DTO
public class ContactsHostConfig : IConfigureAppHost 
{
    public void Configure(IAppHost appHost) =>
        AutoMapping.RegisterConverter((Data.Contact from) => from.ConvertTo<Contact>(skipConverters:true));
}
```
