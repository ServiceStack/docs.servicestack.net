Claims are attestations or attributes about a User which we can use to restrict access to APIs to only Users who
have been assigned that claim. We could use this to implement a permission system that restricts usage with a 
`todos:write` permission with something like:

```csharp
[ValidateHasClaim("perm", "todos:write")]
class CreateTodo {}
```

Normally this would result in the generic missing claims error message:

:::{.not-prose}
<error-summary :status="{message:`perm Claim with 'todos:write' is Required`}"></error-summary>
:::

But as the `perm` claim has a customized error message:

```csharp
HasClaimValidator.ClaimErrorMessages["perm"]= "`${Value} Permission Required`";
```

It will generate that Error Response instead:

:::{.not-prose}
<error-summary :status="{message:`'todos:write' Permission Required`}"></error-summary>
:::

This is a good example for how to use `HasClaimValidator.ClaimErrorMessages` to add custom error messages
for your own custom claim validations.

### Inspecting Claims inside Services

You can also inspect and validate a Users Claim by inspecting the Authenticated ClaimsPrincipal, e.g: 

```csharp
public class TodoServices : Service
{
    public object Any(CreateTodo request)
    {
        var user = Request.GetClaimsPrincipal();
        if (!user.HasClaim("perm", "todos:write"))
            throw HttpError.Forbidden("todos:write Permission Required");
        
        var allUserClaims = user.Claims.ToList();
        //...
    }
}
```
