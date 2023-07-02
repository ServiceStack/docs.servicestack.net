#### login.html
```html
<h3>Sign In using credentials</h3>

<form action="/auth/credentials" method="post" class="col-lg-4">
    <div class="form-group">
        {{ ['userName','password'] | validationSummary({class:'alert alert-warning'}) }}
        {{ { continue: qs.continue ?? '/server/', errorView:'/server/login' } | htmlHiddenInputs }}
    </div>
    <div class="form-group">
        {{ {id:'userName'}
            | formInput({label:'Email',help:'Email you signed up with',size:'lg'}) }}
    </div>
    <div class="form-group">
        {{ {id:'password',type:'password'}
            | formInput({label:'Password',help:'6 characters or more',size:'lg',preserveValue:false}) }}
    </div>
    <div class="form-group">
        {{ {id:'rememberMe',type:'checkbox',checked:true} | formInput({label:'Remember Me'}) }}
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-lg btn-primary">Login</button>
    </div>
    <div class="form-group">
        <a class="lnk" href="/server/register">Register New User</a>
    </div>
</form>
```