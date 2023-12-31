﻿#### _layout.html
```html
<script src="/assets/js/jquery.min.js"></script>
<script src="/js/ss-utils.js"></script>
```

#### login.html
```html
<h3>Sign In using credentials</h3>

<form action="/auth/credentials" method="post">
<div class="form-row">
    <div class="form-group">
        {{ '<div class="alert alert-danger">{0}</div>' | htmlFormat(errorResponseExcept(['userName','password'])) }}
        <input type="hidden" name="continue" value="{{qs.continue ?? '/server-jquery/'}}" />
        <input type="hidden" name="errorView" value="/server-jquery/login">
    </div>
</div>
<div class="form-row">
    <div class="form-group">
        <input class="form-control form-control-lg" name="userName" type="text" placeholder="UserName" 
               value="{{ 'userName' | formValue }}" data-invalid="{{ 'userName' | errorResponse }}">
    </div>
</div>
<div class="form-row">
    <div class="form-group">
        <input class="form-control form-control-lg" name="password" type="password" placeholder="Password" 
               value="" data-invalid="{{ 'password' | errorResponse }}">
    </div>
    <div class="form-group col-md-4">
        <button type="submit" class="btn btn-lg btn-primary">Login</button>
    </div>
</div>
<div class="form-row">
    <div class="form-group">
        <input type="checkbox" id="rememberMe" name="rememberMe" value="true" {{ {checked:formCheckValue('rememberMe')} | htmlAttrs }}>
        <label for="rememberMe">Remember Me</label>
    </div>
</div>
<div class="form-row">
    <div class="form-group col-md-4">
        <a class="lnk" href="/server-jquery/register">Register New User</a>
    </div>
</div>
</form>

<div>
    <b>Quick Login:</b>
    <div class="quicklist">
        <span data-click="switchUser:admin@email.com">admin@email.com</span>
        <span data-click="switchUser:new@user.com">new@user.com</span>
    </div>
</div>

{{#raw appendTo scripts}}
<script>
$(document).bootstrap().bindHandlers({
    switchUser: function(u) {
        $("[name=userName]").val(u);
        $("[name=password]").val('p@55wOrd');
    }
});
</script>
{{/raw}}
```