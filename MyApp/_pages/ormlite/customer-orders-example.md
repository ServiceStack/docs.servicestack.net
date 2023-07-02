---
title: Customer & Order example
---

## Example

#### Code-first Customer & Order example with complex types on POCO as text blobs

Below is a complete stand-alone example. No other config or classes is required for it to run. 

:::info
These examples are also available as an executable
[stand-alone unit test](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/UseCase/CustomerOrdersUseCase.cs)
([async](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/UseCase/CustomerOrdersUseCaseAsync.cs)).
:::

```csharp
public enum PhoneType 
{
    Home,
    Work,
    Mobile,
}

public enum AddressType 
{
    Home,
    Work,
    Other,
}

public class Address 
{
    public string Line1 { get; set; }
    public string Line2 { get; set; }
    public string ZipCode { get; set; }
    public string State { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
}

public class Customer 
{
    [AutoIncrement] // Creates Auto primary key
    public int Id { get; set; }
    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    [Index(Unique = true)] // Creates Unique Index
    public string Email { get; set; }
    
    public Dictionary<PhoneType, string> PhoneNumbers { get; set; } = new();  //Blobbed
    public Dictionary<AddressType, Address> Addresses { get; set; } = new();  //Blobbed
    public DateTime CreatedAt { get; set; }
}

public class Order 
{    
    [AutoIncrement]
    public int Id { get; set; }
    
    [References(typeof(Customer))]      //Creates Foreign Key
    public int CustomerId { get; set; }
    
    [References(typeof(Employee))]      //Creates Foreign Key
    public int EmployeeId { get; set; }
    
    public Address ShippingAddress { get; set; } //Blobbed (no Address table)
    
    public DateTime? OrderDate { get; set; }
    public DateTime? RequiredDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public int? ShipVia { get; set; }
    public decimal Freight { get; set; }
    public decimal Total { get; set; }
}

public class OrderDetail 
{
    [AutoIncrement]
    public int Id { get; set; }
    
    [References(typeof(Order))] //Creates Foreign Key
    public int OrderId { get; set; }
    
    public int ProductId { get; set; }
    public decimal UnitPrice { get; set; }
    public short Quantity { get; set; }
    public decimal Discount { get; set; }
}

public class Employee 
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Product 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal UnitPrice { get; set; }
}

// Setup SQL Server Connection Factory
var dbFactory = new OrmLiteConnectionFactory(connString, SqlServerDialect.Provider);

// Use in-memory Sqlite DB instead
//var dbFactory = new OrmLiteConnectionFactory(
//    ":memory:", false, SqliteDialect.Provider);

//Non-intrusive: All extension methods hang off System.Data.* interfaces
using var db = Config.OpenDbConnection();

//Re-Create all table schemas:
db.DropTable<OrderDetail>();
db.DropTable<Order>();
db.DropTable<Customer>();
db.DropTable<Product>();
db.DropTable<Employee>();

db.CreateTable<Employee>();
db.CreateTable<Product>();
db.CreateTable<Customer>();
db.CreateTable<Order>();
db.CreateTable<OrderDetail>();

db.Insert(new Employee { Id = 1, Name = "Employee 1" });
db.Insert(new Employee { Id = 2, Name = "Employee 2" });
var product1 = new Product { Id = 1, Name = "Product 1", UnitPrice = 10 };
var product2 = new Product { Id = 2, Name = "Product 2", UnitPrice = 20 };
db.Save(product1, product2);

var customer = new Customer {
    FirstName = "Orm",
    LastName = "Lite",
    Email = "ormlite@servicestack.net",
    PhoneNumbers =
    {
        { PhoneType.Home, "555-1234" },
        { PhoneType.Work, "1-800-1234" },
        { PhoneType.Mobile, "818-123-4567" },
    },
    Addresses =
    {
        { AddressType.Work, new Address { 
            Line1 = "1 Street", Country = "US", State = "NY", City = "New York", ZipCode = "10101" } 
        },
    },
    CreatedAt = DateTime.UtcNow,
};

var customerId = db.Insert(customer, selectIdentity: true); //Get Auto Inserted Id
customer = db.Single<Customer>(new { customer.Email }); //Query

//Direct access to System.Data.Transactions:
using (IDbTransaction trans = db.OpenTransaction(IsolationLevel.ReadCommitted))
{
    var order = new Order {
        CustomerId = customer.Id,
        EmployeeId = 1,
        OrderDate = DateTime.UtcNow,
        Freight = 10.50m,
        ShippingAddress = new Address { 
        Line1 = "3 Street", Country = "US", State = "NY", City = "New York", ZipCode = "12121" },
    };
    db.Save(order); //Inserts 1st time

    //order.Id populated on Save().

    var orderDetails = new[] {
        new OrderDetail {
            OrderId = order.Id,
            ProductId = product1.Id,
            Quantity = 2,
            UnitPrice = product1.UnitPrice,
        },
        new OrderDetail {
            OrderId = order.Id,
            ProductId = product2.Id,
            Quantity = 2,
            UnitPrice = product2.UnitPrice,
            Discount = .15m,
        }
    };

    db.Save(orderDetails);

    order.Total = orderDetails.Sum(x => x.UnitPrice * x.Quantity * x.Discount) + order.Freight;

    db.Save(order); //Updates 2nd Time

    trans.Commit();
}
```

## Async Example

```csharp
await db.InsertAsync(new Employee { Id = 1, Name = "Employee 1" });
await db.InsertAsync(new Employee { Id = 2, Name = "Employee 2" });
var product1 = new Product { Id = 1, Name = "Product 1", UnitPrice = 10 };
var product2 = new Product { Id = 2, Name = "Product 2", UnitPrice = 20 };
await db.SaveAsync(product1, product2);

var customer = new Customer {
    FirstName = "Orm",
    LastName = "Lite",
    Email = "ormlite@servicestack.net",
    PhoneNumbers =
    {
        { PhoneType.Home, "555-1234" },
        { PhoneType.Work, "1-800-1234" },
        { PhoneType.Mobile, "818-123-4567" },
    },
    Addresses =
    {
        { AddressType.Work, new Address { 
            Line1 = "1 Street", Country = "US", State = "NY", City = "New York", ZipCode = "10101" } 
        },
    },
    CreatedAt = DateTime.UtcNow,
};

var customerId = await db.InsertAsync(customer, selectIdentity: true); //Get Auto Inserted Id
customer = await db.SingleAsync<Customer>(new { customer.Email }); //Query

//Direct access to System.Data.Transactions:
using var trans = db.OpenTransaction(IsolationLevel.ReadCommitted);
var order = new Order {
    CustomerId = customer.Id,
    EmployeeId = 1,
    OrderDate = DateTime.UtcNow,
    Freight = 10.50m,
    ShippingAddress = new Address { 
        Line1 = "3 Street", Country = "US", State = "NY", City = "New York", ZipCode = "12121" },
};
await db.SaveAsync(order); //Inserts 1st time

//order.Id populated on Save().
var orderDetails = new[] {
    new OrderDetail {
        OrderId = order.Id,
        ProductId = product1.Id,
        Quantity = 2,
        UnitPrice = product1.UnitPrice,
    },
    new OrderDetail {
        OrderId = order.Id,
        ProductId = product2.Id,
        Quantity = 2,
        UnitPrice = product2.UnitPrice,
        Discount = .15m,
    }
};

await db.SaveAsync(orderDetails);

order.Total = orderDetails.Sum(x => x.UnitPrice * x.Quantity * x.Discount) + order.Freight;

await db.SaveAsync(order); //Updates 2nd Time

trans.Commit();
```

Running this against a SQL Server database will yield the results below:

[![SQL Server Management Studio results](/img/pages/ormlite/ormlite-example.png)](/img/pages/ormlite/ormlite-example.png)

With the blobbed POCO types stored in the [very fast](https://github.com/ServiceStackV3/mythz_blog/blob/master/pages/176.md)
and [Versatile](https://github.com/ServiceStackV3/mythz_blog/blob/master/pages/314.md)
[JSV Format](/jsv-format) - a more compact, human and parser-friendly than JSON.
