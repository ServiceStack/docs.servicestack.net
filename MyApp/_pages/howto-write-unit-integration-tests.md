---
slug: howto-write-unit-integration-tests
title: How to write Unit & Integration tests
---

## Integration test example

The [CustomerRestExample.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/CustomerRestExample.cs) shows an example of a stand-alone integration test:

```csharp
//Create your ServiceStack AppHost with only the dependencies your tests need
public class AppHost : AppSelfHostBase
{
    public AppHost() : base("Customer REST Example", typeof(CustomerService).Assembly) {}

    public override void Configure(Container container)
    {
        container.Register<IDbConnectionFactory>(c => 
            new OrmLiteConnectionFactory(":memory:", SqliteDialect.Provider));

        using var db = container.Resolve<IDbConnectionFactory>().Open();
        db.CreateTableIfNotExists<Customer>();
    }
}

//Add Service Contract DTO's and Data Models
[Route("/customers", "GET")]
public class GetCustomers : IReturn<GetCustomersResponse> {}

public class GetCustomersResponse
{
    public List<Customer> Results { get; set; } 
}

[Route("/customers/{Id}", "GET")]
public class GetCustomer : IReturn<Customer>
{
    public int Id { get; set; }
}

[Route("/customers", "POST")]
public class CreateCustomer : IReturn<Customer>
{
    public string Name { get; set; }
}

[Route("/customers/{Id}", "PUT")]
public class UpdateCustomer : IReturn<Customer>
{
    public int Id { get; set; }

    public string Name { get; set; }
}

[Route("/customers/{Id}", "DELETE")]
public class DeleteCustomer : IReturnVoid
{
    public int Id { get; set; }
}

public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Name { get; set; }
}

//Provide the implementation for your above Service Contracts
public class CustomerService : Service
{
    public object Get(GetCustomers request)
    {
        return new GetCustomersResponse { Results = Db.Select<Customer>() };
    }

    public object Get(GetCustomer request)
    {
        return Db.SingleById<Customer>(request.Id);
    }

    public object Post(CreateCustomer request)
    {
        var customer = new Customer { Name = request.Name };
        Db.Save(customer);
        return customer;
    }

    public object Put(UpdateCustomer request)
    {
        var customer = Db.SingleById<Customer>(request.Id);
        if (customer == null)
            throw HttpError.NotFound($"Customer '{request.Id}' does not exist");

        customer.Name = request.Name;
        Db.Update(customer);

        return customer;
    }

    public void Delete(DeleteCustomer request)
    {
        Db.DeleteById<Customer>(request.Id);
    }
}

//Write your Integration tests
public class CustomerRestExample
{
    const string BaseUri = "http://localhost:2000/";
    ServiceStackHost appHost;

    public void CustomerRestExample()
    {
        //Start your AppHost on TestFixture SetUp
        appHost = new AppHost()
            .Init()
            .Start(BaseUri);
    }

    [OneTimeTearDown]
    public void OneTimeTearDown() => appHost.Dispose();

    /* Write your Integration Tests against the self-host instance */

    [Test]
    public void Run_Customer_REST_Example()
    {
        var client = new JsonApiClient(BaseUri);

        //GET /customers
        var all = client.Get(new GetCustomers());
        Assert.That(all.Results.Count, Is.EqualTo(0));

        //POST /customers
        var customer = client.Post(new CreateCustomer { Name = "Foo" });
        Assert.That(customer.Id, Is.EqualTo(1));
        //GET /customer/1
        customer = client.Get(new GetCustomer { Id = customer.Id });
        Assert.That(customer.Name, Is.EqualTo("Foo"));

        //GET /customers
        all = client.Get(new GetCustomers());
        Assert.That(all.Results.Count, Is.EqualTo(1));

        //PUT /customers/1
        customer = client.Put(new UpdateCustomer { Id = customer.Id, Name = "Bar" });
        Assert.That(customer.Name, Is.EqualTo("Bar"));

        //DELETE /customers/1
        client.Delete(new DeleteCustomer { Id = customer.Id });
        //GET /customers
        all = client.Get(new GetCustomers());
        Assert.That(all.Results.Count, Is.EqualTo(0));
    }
}
```
