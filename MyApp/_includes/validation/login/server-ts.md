#### _layout.html
```html
<script src="/lib/@servicestack/client/index.js"></script>
```

#### login.html
```html
<h3>Sign In using credentials</h3>

<form action="/auth/credentials" method="post">
    <div class="form-row">
        <div class="form-group">
            {{ '<div class="alert alert-danger">{0}</div>' | htmlFormat(errorResponseExcept(['userName','password'])) }}
            <input type="hidden" name="continue" value="{{qs.continue ?? '/server-ts/'}}" />
            <input type="hidden" name="errorView" value="/server-ts/login">
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
            <a class="lnk" href="/server-ts/register">Register New User</a>
        </div>
    </div>
</form>

{{#raw appendTo scripts}}
<script src="/server-ts/login.js"></script>
{{/raw}}
```

#### login.ts

```ts
import {bindHandlers, bootstrap} from "@servicestack/client";

bootstrap(); //converts data-invalid attributes into Bootstrap v4 error messages.

bindHandlers({
    switchUser: (u: string) => {
        (document.querySelector("[name=userName]") as HTMLInputElement).value = u;
        (document.querySelector("[name=password]") as HTMLInputElement).value = 'p@55wOrd';
    }
});
```

