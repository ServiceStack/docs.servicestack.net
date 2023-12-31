﻿#### _RequiresAuthServer.cshtml
```html
@{ RedirectIfNotAuthenticated($"/server-razor/login?continue={Request.PathInfo}"); }

<div style="text-align:right">
    <small class="text-muted">
        @UserSession.DisplayName
        | <a href="/auth/logout?continue=/server-razor/">Sign Out</a>
    </small>
</div>
```
#### default.cshtml

```html
@await Html.PartialAsync("_RequiresAuthServer")

@{ var Continue = "/server-razor/contacts/"; }

<h3>Add new Contact</h3>

<form action="/contacts" method="post" class="col-lg-4">
    <div class="form-group">
        @Html.ValidationSummary(new[]{ "title","name","color","age","filmGenres","agree" })
        @Html.HiddenInputs(new { @continue = Continue, errorView = Continue })
    </div>
    <div class="form-group">
        @Html.FormInput(new { 
            id = "title", 
            type = "radio",
        }, new InputOptions { 
            Values = Html.ContactTitles(),
            Inline = true,
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { 
            id = "name", 
            placeholder = "Name", 
        }, new InputOptions {
            Label = "Full Name",
            Help  = "Your first and last name",
        })
    </div>
    <div class="form-group">
        @Html.FormSelect(new { 
            id = "color", 
            @class = "col-4", 
        }, new InputOptions {
            Label  = "Favorite color",
            Values = new StringDictionary { {"",""} }.Merge(Html.ContactColors()),
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { 
            id = "filmGenres", 
            type = "checkbox",
        }, new InputOptions { 
            Label  = "Favorite Film Genres",
            Help   = "choose one or more",
            Values = Html.ContactGenres()
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { 
            id = "age", 
            type = "number",
            min = 13,
            placeholder = "Age",
            @class = "col-3",
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new {
            id   = "agree",
            type = "checkbox",
        },
        new InputOptions { Label = "Agree to terms and conditions" })
    </div>
    <div class="form-group">
        <button class="btn btn-primary" type="submit">Add Contact</button>
        <a href="/server-razor/contacts/">reset</a>
    </div>
</form>

@{ var response = await Gateway.SendAsync(new GetContacts()); }

<table id="results">
    <tbody>
    @foreach (var c in response.Results)
    {
        <tr style="background:@c.Color">
            <td>@c.Title @c.Name (@c.Age)</td>
            <td><a href="/server-razor/contacts/@c.Id/edit">edit</a></td>
            <td><form method="post" action="/contacts/@c.Id/delete" onsubmit="return confirm('Are you sure?')">
                <input type="hidden" name="continue"  value="@Continue">
                <button class="btn btn-sm btn-primary">delete</button></form></td>
        </tr>
    }
    @if (response.Results.IsEmpty()) 
    {
        <tr>
            <td>There are no contacts.</td>
        </tr>
    }
    </tbody>
</table>
```