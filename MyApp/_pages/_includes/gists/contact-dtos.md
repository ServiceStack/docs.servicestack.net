```csharp
namespace Data // DB Models
{
    using ServiceModel.Types;
    
    public class Contact // Data Model
    {
        public int Id { get; set; }
        public int UserAuthId { get; set; }
        public Title Title { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public FilmGenres[] FilmGenres { get; set; }
        public int Age { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}

namespace ServiceModel // Request/Response DTOs
{
    using Types;
    
    [Route("/contacts", "GET")]
    public class GetContacts : IReturn<GetContactsResponse> {}
    public class GetContactsResponse 
    {
        public List<Contact> Results { get; set; }
        public ResponseStatus ResponseStatus { get; set; }
    }

    [Route("/contacts/{Id}", "GET")]
    public class GetContact : IReturn<GetContactResponse >
    {
        public int Id { get; set; }
    }
    public class GetContactResponse 
    {
        public Contact Result { get; set; }
        public ResponseStatus ResponseStatus { get; set; }
    }

    [Route("/contacts", "POST")]
    public class CreateContact : IReturn<CreateContactResponse>
    {
        public Title Title { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public FilmGenres[] FilmGenres { get; set; }
        public int Age { get; set; }
        public bool Agree { get; set; }
        
        public string Continue { get; set; }
        public string ErrorView { get; set; }
    }
    public class CreateContactResponse 
    {
        public Contact Result { get; set; }
        public ResponseStatus ResponseStatus { get; set; }
    }

    [Route("/contacts/{Id}", "POST PUT")]
    public class UpdateContact : IReturn<UpdateContactResponse>
    {
        public int Id { get; set; }
        public Title Title { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public FilmGenres[] FilmGenres { get; set; }
        public int Age { get; set; }
        
        public string Continue { get; set; }
        public string ErrorView { get; set; }
    }
    public class UpdateContactResponse 
    {
        public ResponseStatus ResponseStatus { get; set; }
    }

    [Route("/contacts/{Id}", "DELETE")]
    [Route("/contacts/{Id}/delete", "POST")] // more accessible from HTML
    public class DeleteContact : IReturnVoid
    {
        public int Id { get; set; }
        public string Continue { get; set; }
    }

    namespace Types // DTO Types
    {
        public class Contact 
        {
            public int Id { get; set; }
            public int UserAuthId { get; set; }
            public Title Title { get; set; }
            public string Name { get; set; }
            public string Color { get; set; }
            public FilmGenres[] FilmGenres { get; set; }
            public int Age { get; set; }
        }

        public enum Title
        {
            Unspecified=0,
            [Description("Mr.")] Mr,
            [Description("Mrs.")] Mrs,
            [Description("Miss.")] Miss
        }

        public enum FilmGenres
        {
            Action,
            Adventure,
            Comedy,
            Drama,
        }
    }
}
```
