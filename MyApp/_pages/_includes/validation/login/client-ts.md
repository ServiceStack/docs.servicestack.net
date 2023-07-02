#### _layout.html
```html
<script src="/lib/@servicestack/client/index.js"></script>
<script src="/dtos.js"></script>
```

#### login.html
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
        <a class="lnk" href="/client-ts/register">Register New User</a>
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

{{#capture appendTo scripts}}
<script>var CONTINUE = '{{qs.continue ?? "/client-ts/"}}';</script>
<script src="login.js"></script>
{{/capture}}
```

#### login.ts
```ts
import { bindHandlers, bootstrapForm } from "@servicestack/client";
import { AuthenticateResponse } from "../../dtos";

declare var CONTINUE:string;

bootstrapForm(document.querySelector('form'), {
    success: (r: AuthenticateResponse) => {
        location.href = CONTINUE;
    }
});

bindHandlers({
    switchUser: (u: string) => {
        (document.querySelector("[name=userName]") as HTMLInputElement).value = u;
        (document.querySelector("[name=password]") as HTMLInputElement).value = 'p@55wOrd';
    }
});
```
