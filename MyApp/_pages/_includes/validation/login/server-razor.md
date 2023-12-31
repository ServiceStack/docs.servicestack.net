﻿#### login.cshtml
```html
<h3>Sign In using credentials</h3>

<form action="/auth/credentials" method="post" class="col-lg-4">
    <div class="form-group">
        @Html.ValidationSummary(new[]{ "userName","password" }, 
            new { @class = "alert alert-warning" })
        
        @Html.HiddenInputs(new { 
            @continue = Html.Query("continue") ?? "/server-razor/",
            errorView = "/server-razor/login"
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { id = "userName" }, new InputOptions {
            Label = "Email",
            Help  = "Email you signed up with",
            Size  = "lg",
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { id = "password", type = "password" }, new InputOptions {
            Label = "Password",
            Help  = "6 characters or more",
            Size  = "lg",
            PreserveValue = false,
        })
    </div>
    <div class="form-group">
        @Html.FormInput(new { 
            id   = "rememberMe", 
            type = "checkbox",
            @checked = true,
        },
        new InputOptions { Label = "Remember Me" })
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-lg btn-primary">Login</button>
    </div>
    <div class="form-group">
        <a class="lnk" href="/server-razor/register">Register New User</a>
    </div>
</form>
```