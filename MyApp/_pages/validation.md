---
slug: validation
title: Validation and Error Handling
---

As validation and error handling is an essential part of developing services, ServiceStack provides a rich array of error handling options that work intuitively out-of-the-box. 

Optimized for developer happiness ServiceStack allows you to idiomatically throw C# exceptions directly in your services and trivially consume them on the client with minimal effort, intuitively and conventionally - allowing the opportunity to inject generic error handling routines to handle errors for all your web services. 

As a bonus the most appropriate HTTP Status code is returned based upon the C# Exception type.

### Typed, Structured Exceptions end-to-end
The error handling support works end-to-end where all errors get auto-serialized into your Response DTO and re-hydrated into a C# Exception on ServiceStack's generic Service Clients. This allows you to idiomatically treat errors like normal C# Exceptions - providing easy access to rich, structured error messages in your clients. 

### JavaScript support included
To make it trivial to consume errors in JavaScript, you can use the lightweight and embedded dep-free [@servicestack/client form binding](/servicestack-client-umd#binding-html-forms) library or the [ss-utils.js](/ss-utils-js#bootstrap-forms) jQuery library to trivially bind your response errors to your **HTML form fields** with a **single line of code**.

## How it works

All Error handling and validation options described below are treated in the same way - serialized into the `ResponseStatus` property of your Response DTO making it possible for your clients applications to generically treat all Web Service Errors in the same way.

```csharp
public class Hello : IReturn<HelloResponse> {}

//Follows naming convention and is in the same namespace as 'Hello'
public class HelloResponse 
{
    public ResponseStatus ResponseStatus { get; set; } //Exception gets serialized here
}
```


If now an exception occurs in the service implementation, the exception is serialized.

**Example JSON output:**

```json
{
    "ResponseStatus": {
         "ErrorCode": "NotSupportedException",
         "Message": "..."
    }
}
```

It's up to the client how to handle this service error.

## Throw a C# Exception

The easiest way to generate an Error in ServiceStack is to simply throw a C# Exception:

```csharp 
public object Post(User request) 
{
	if (string.IsNullOrEmpty(request.Name))
		throw new ArgumentNullException("Name");
}
```

By Default C# Exceptions:

  - Inheriting from ArgumentException are returned as a HTTP StatusCode of **400 BadRequest**
  - NotImplementedException is returned as a **405 MethodNotAllowed** 
  - Other normal C# Exceptions are returned as **500 InternalServerError**

All Exceptions gets injected into the ResponseStatus property of your Response DTO that is serialized into your ServiceClient's preferred Content-Type making error handling transparent regardless of your preferred format - i.e. the same C# Error handling code can be used for all ServiceClients.

```csharp 
try 
{
    var client = new JsonServiceClient(BaseUri);
    var response = client.Send<UserResponse>(new User());
} 
catch (WebServiceException webEx) 
{
    /*
      webEx.StatusCode  = 400
      webEx.ErrorCode   = ArgumentNullException
      webEx.Message     = Value cannot be null. Parameter name: Name
      webEx.StackTrace  = (your Server Exception StackTrace - if DebugMode is enabled)
      webEx.ResponseDto = (your populated Response DTO)
      webEx.ResponseStatus   = (your populated Response Status DTO)
      webEx.GetFieldErrors() = (individual errors for each field if any)
    */
}
```

### Enabling StackTraces

By default display StackTraces in your Response DTOs are disabled, but they're a good to have for development, which you can enable with:

```cs
SetConfig(new HostConfig { DebugMode = true });
```

## Customized Error Messages

If you want even finer grained control of your HTTP errors you can either **throw** or **return** a **HttpError** letting you customize the **Http Headers** and **Status Code** and HTTP Response **body** to get exactly what you want on the wire:

```csharp 
public object Get(User request) {
       throw HttpError.NotFound($"User {request.Name} does not exist");
}
```

the above is a short-hand for `new HttpError(HttpStatusCode.NotFound, $"User {request.Name} does not exist")` which returns a **404** NotFound StatusCode on the wire.

## Validation Feature

For more complex validation and to be able to return multiple validation errors ServiceStack includes the excellent [Fluent Validation](https://github.com/JeremySkinner/FluentValidation) library by [@JeremySkinner](http://twitter.com/JeremySkinner) - a very clean and DSL-like way to validate request DTOs. Even contextual validation for each HTTP method (GET, POST, ...) is supported.

ServiceStack's Fluent Validation feature is encapsulated in the `ValidationFeature` plugin which can be registered in your AppHost with:

```csharp
Plugins.Add(new ValidationFeature());
```

### FluentValidation for request dtos

The example below uses this request dto for validation:

```csharp
[Route("/users")]
public class User
{
    public string Name { get; set; }
    public string Company { get; set; }
    public int Age { get; set; }
    public int Count { get; set; }
    public string Address { get; set; }
}
```

The validation rules for this request dto are made with [FluentValidation](https://github.com/JeremySkinner/FluentValidation/wiki). ServiceStack makes heavy use of [rule sets](https://github.com/JeremySkinner/FluentValidation/wiki/b.-Creating-a-Validator#rulesets) to provide different validation rules for each HTTP method (GET, POST, PUT...).

::: info Tip
First read the [documentation about FluentValidation](https://github.com/JeremySkinner/FluentValidation/wiki) before you continue reading
:::

```csharp
public interface IAddressValidator
{
    bool ValidAddress(string address);
}

public class AddressValidator : IAddressValidator
{
    public bool ValidAddress(string address)
    {
	return address != null
	    && address.Length >= 20
	    && address.Length <= 250;
    }
}

public class UserValidator : AbstractValidator<User>
{
    public IAddressValidator AddressValidator { get; set; }
    
    public UserValidator()
    {
        //Validation rules for all requests
        RuleFor(r => r.Name).NotEmpty();
        RuleFor(r => r.Age).GreaterThan(0);
        RuleFor(x => x.Address).Must(x => AddressValidator.ValidAddress(x));

        //Validation rules for GET request
        RuleSet(ApplyTo.Get, () => {
            RuleFor(r => r.Count).GreaterThan(10);
        });

        //Validation rules for POST and PUT request
        RuleSet(ApplyTo.Post | ApplyTo.Put, () => {
            RuleFor(r => r.Company).NotEmpty();
        });
    }
}
```

::: info
ServiceStack adds another extension method named `RuleSet` which can handle `ApplyTo` enum flags. This method doesn't exist in the core FluentValidation framework
:::

::: warning
If a validator for a request dto is created, all rules which aren't in any rule set are executed **+ the rules in the matching rule set**. 
Normally FluentValidation only executes the matching rule set and **ignores** all other rules (whether they're in a rule set or not) and the rules which don't belong 
to any rule set are normally only executed, if no rule set-name was given to the validate method of the validator. 
:::

Like services registered in the IoC container, validators are also auto-wired, so if there's a public property which can be resolved by the IoC container, the IoC container will inject it. In this case, the IoC container will resolve the property `AddressValidator`, if an object of the type `IAddressValidator` was registered.

::: info Tip
You can access the current `IRequest` in your Custom Validator from `base.Request`
:::

### Async Validators

Async validators can be registered using the `MustAsync` validator where you could simulate the following built-in **Not Empty** validation:

```csharp
public class MyRequestValidator : AbstractValidator<MyRequest>
{
    public MyRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}
```

And replace it with an Async version that uses the [Service Gateway](/service-gateway) to 
call a custom Async `GetStringLength` Service that returns the same `ErrorCode` and Error Message as the 
**Not Empty** validator:

```csharp
public class MyRequestValidator : AbstractValidator<MyRequest>
{
    public MyRequestValidator()
    {
        RuleFor(x => x.Name).MustAsync(async (s, token) => 
            (await Gateway.SendAsync(new GetStringLength { Value = s })).Result > 0)
        .WithMessage("'Name' should not be empty.")
        .WithErrorCode("NotEmpty");
    }
}
```

### Register Validators

The `ValidationFeature` plugin automatically scans and auto-wires all validators in the `AppHost.ServiceAssemblies` that's injected in the `AppHost` constructor.

This default behavior can be **disabled** with:

```csharp
Plugins.Add(new ValidationFeature {
    ScanAppHostAssemblies = false
});
```

Otherwise if the validators are in other assembles they can be registered using `RegisterValidators()`, e.g:

```csharp
//This method scans the assembly for validators
container.RegisterValidators(typeof(UserValidator).Assembly);
```

Optionally each validator can be registered individually:

```csharp
//Add the IAdressValidator which will be injected into the UserValidator
container.Register<IAddressValidator>(new AddressValidator());
```

Now the service etc can be created and the validation rules are checked every time a request comes in.

If you try now for example to send this request:

```
POST localhost:50386/validated
{
    "Name": "Max"
} 
```

You'll get this JSON response:

```json
{
    "ErrorCode": "GreaterThan",
    "Message": "'Age' must be greater than '0'.",
    "Errors": [
        {
            "ErrorCode": "GreaterThan",
            "FieldName": "Age",
            "Message": "'Age' must be greater than '0'."
        },
        {
            "ErrorCode": "NotEmpty",
            "FieldName": "Company",
            "Message": "'Company' should not be empty."
        }
    ]
}
```

As you can see, the `ErrorCode` and the `FieldName` provide an easy way to handle the validation error at the client side. 
If you want, you can also configure a custom `ErrorCode` for a validation rule:

```csharp
RuleFor(x => x.Name).NotEmpty().WithErrorCode("ShouldNotBeEmpty"); 
```

If the rule fails, the JSON response will look like that:

```json
{
    "ErrorCode": "ShouldNotBeEmpty",
    "FieldName": "Name",
    "Message": "'Name' should not be empty."
}
```

### Custom Validation

ServiceStack's internal implementation of [FluentValidation](https://github.com/JeremySkinner/FluentValidation) uses the latest 7.2 version which lets you take advantage of new features like implementing [Custom Validators](https://github.com/JeremySkinner/FluentValidation/wiki/e.-Custom-Validators#using-a-custom-validator), e.g:

```csharp
public class CustomValidationValidator : AbstractValidator<CustomValidation>
{
    public CustomValidationValidator()
    {
        RuleFor(request => request.Code).NotEmpty();
        RuleFor(request => request)
            .Custom((request, context) => {
                if (request.Code?.StartsWith("X-") != true)
                {
                    var propName = context.ParentContext.PropertyChain.BuildPropertyName("Code");
                    context.AddFailure(new ValidationFailure(propName, error:"Incorrect prefix") {
                        ErrorCode = "NotFound"
                    });
                }
            });
    }
}
```

## Use FluentValidation Everywhere

Of course FluentValidation can be used for any other classes (not only request DTOs), too:

```csharp
public class TestClass
{
    public string Text { get; set; }
    public int Length { get; set; }
}
```

Now the validator: 

```csharp
public class TestClassValidator : AbstractValidator<TestClass>
{
    public TestClassValidator()
    {
        RuleFor(x => x.Text).NotEmpty();
        RuleFor(x => x.Length).GreaterThan(0);
    }
}
```

::: info
If FluentValidation isn't used for request DTOs, it behaves the same as documented in the [Fluent Validation documentation](https://github.com/JeremySkinner/FluentValidation/wiki)
:::

Inside some service code you can validate an instance of this class:

```csharp
public class SomeService : Service
{
    //You should have registered your validator in the IoC container to inject the validator into this property
    public IValidator<TestClass> Validator { get; set; }

    public object Get(Validated request)
    {
        TestClass instance = new TestClass();

        ValidationResult result = this.Validator.Validate(instance);

        if (!result.IsValid)
        {
            //The result will be serialized into a ValidationErrorException and throw this one
            //The errors will be serialized in a clean, human-readable way (as the above JSON example)
            throw result.ToException();
        }

    }
}
```

## Populating the Response DTO Manually  

All the error handling methods illustrated above are just sugar coating for serializing exceptions into your Response DTOs [ResponseStatus](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/ServiceInterface.ServiceModel/ResponseStatus.cs) property. You don't have use any of this as you can simply populate the ResponseStatus property yourself, coupled with the HttpResult class you have complete control of your HTTP Response - this gives you the necessary freedom so you are able to define your own Error handling API and helpers if you have an existing validation library that you would like to use instead.

# Examples

## [World Validation](/world-validation)

See the annotated [World Validation Docs](/world-validation) for a detailed example of Fluent Validation that walks through and showcases the implementation 
of how the most popular **Server HTML rendered** approaches and **Client UI rendered** technologies which are able all to use the same 
single suite of Fluent Validators and ServiceStack Services.
