﻿#### _Layout.cshtml
```html
<script src="/assets/js/jquery.min.js"></script>
<script src="/js/ss-utils.js"></script>
```

#### login.cshtml
```html
<h3>Sign In using credentials</h3>

<form action="/auth/credentials" method="post">
    <div class="form-row">
        <div class="form-group" data-validation-summary="userName,password"></div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <input class="form-control form-control-lg" name="userName" type="text" placeholder="UserName">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <input class="form-control form-control-lg" name="password" type="password" placeholder="Password">
        </div>
        <div class="form-group col-md-4">
            <button type="submit" class="btn btn-lg btn-primary">Login</button>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <input type="checkbox" id="rememberMe" name="rememberMe" value="true">
            <label for="rememberMe">Remember Me</label>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-4">
            <a class="lnk" href="/client-razor/register">Register New User</a>
        </div>
    </div>
</form>

<div>
    <b>Quick Login:</b>
    <div class="quicklist">
        <span data-click="switchUser:admin@email.com">admin@@email.com</span>
        <span data-click="switchUser:new@user.com">new@@user.com</span>
    </div>
</div>

@section scripts {

<script>
    var CONTINUE = '@(Html.Query("continue") ?? "/client-razor/")';
    $('form').bootstrapForm({
        success: function(r) {
            location.href = CONTINUE;
        }
    });
    
    $(document).bindHandlers({
        switchUser: function (u) {
            $("[name=userName]").val(u);
            $("[name=password]").val('p@55wOrd');
        }
    });
</script>

}
```