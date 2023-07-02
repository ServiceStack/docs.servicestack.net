---
title: Relations and Lookup Tables
---

## Relating tables

With a more complex database schema, Locode app can use join tables as lookups providing an easy UI to relate rows.

The [TalentBlazor]() demo which is a Locode application where back office recruitment staff can manage job applications.
It has 10 tables for all its functionality, but focusing on the main three of `Job`, `Contact` and `JobApplication` we can
see how this functionality can save time.

```csharp
[Icon(Svg = Icons.Contact)]
public class Contact : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string DisplayName => FirstName + " " + LastName;
    public string ProfileUrl { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int? SalaryExpectation { get; set; }
    public string JobType { get; set; }
    public int AvailabilityWeeks { get; set; }
    public EmploymentType PreferredWorkType { get; set; }
    public string PreferredLocation { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string About { get; set; }
}
```


### Lookup tables and appearance

With the database-first approach, foreign ke columns and table relationships are reflected in the Locode app with the use of
look up tables when created, editing or navigating between services. In the Northwind example, this can be seen in services like
`OrderDetails`, `Order` and `Product`. If the database doesn't have this relationship in the schema but you need
to add it in Locode app, the `Ref` attribute can be ued.

```csharp
TypeFilter = (type, req) =>
{
    ...
    if (type.Name == "Employee" || type.IsCrudCreateOrUpdate("Employee"))
    {
        ...
        if (type.IsCrud())
        {
            ...
        }
        else if (type.Name == "Employee")
        {
            type.Property("ReportsTo").AddAttribute(
                new RefAttribute { Model = "Employee", RefId = "Id", RefLabel = "LastName" });
        }
    }
}
```

<ul role="list" class="m-4 grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-8 xl:gap-x-8">
  <li class="relative">
    <div class="group block w-full aspect-w-13 aspect-h-6 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
      <img src="/img/pages/locode/database-first-northwind-input-1.png" alt="" class="object-cover pointer-events-none group-hover:opacity-75">
    </div>
    <p class="block text-sm font-medium text-gray-500 pointer-events-none">Without `Input`</p>
  </li>
  <li class="relative">
    <div class="group block w-full aspect-w-13 aspect-h-6  rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
      <img src="/img/pages/locode/database-first-northwind-input-2.png" alt="" class="object-cover pointer-events-none group-hover:opacity-75">
    </div>
    <p class="block text-sm font-medium text-gray-500 pointer-events-none">Custom `Input`</p>
  </li>
</ul>

This enables the lookup field UI functionality for the `ReportsTo` property making it is easy to select the correct `Id` to be stored in the same column.

<img src="/img/pages/locode/locode-lookup.gif" alt="" class="object-cover pointer-events-none group-hover:opacity-75">

The use of `RefLabel` controls which column on the `RefModel` is to be used as the visual data in the Locode app. The `RefId` is the target `RefModel` column in the foreign key relationship.
