﻿#### _RequiresAuth.cshtml 
```html
@{ RedirectIfNotAuthenticated($"/client-razor/login?continue={Request.PathInfo}"); }

<div style="text-align:right">
    <small class="text-muted">
        @UserSession.DisplayName
        | <a href="/auth/logout?continue=/client-razor/">Sign Out</a>
    </small>
</div>
```

#### default.cshtml 
```html
@await Html.PartialAsync("_RequiresAuth")

<h3>Add new Contact</h3>

<form action="/contacts" method="post" class="col-lg-4">
    <div class="form-group" data-validation-summary="title,name,color,filmGenres,age,agree"></div>

    <div class="form-group">
        <div class="form-check">
        @foreach (var it in Html.ContactTitles())
        {
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="title-@it.Key" name="title" value="@it.Key" class="custom-control-input">
                <label class="custom-control-label" for="title-@it.Key">@it.Value</label>
            </div>
        }
        </div>
    </div>
    <div class="form-group">
        <label for="name">Full Name</label>
        <input class="form-control" id="name" name="name" type="text" placeholder="Name">
        <small id="name-help" class="text-muted">Your first and last name</small>
    </div>
    <div class="form-group">
        <label class="form-label" for="color">Favorite color</label>
        <select id="color" name="color" class="col-4 form-control">
            <option value=""></option>
        @foreach (var it in Html.ContactColors())
        {
            <option value="@it.Key">@it.Value</option>
        }
        </select>
    </div>
    <div class="form-group">
        <label class="form-check-label">Favorite Film Genres</label>
        <div class="form-check">
        @foreach (var it in Html.ContactGenres())
        {
            <div class="custom-control custom-checkbox">
                <input type="checkbox" id="filmGenres-@it" name="filmGenres" value="@it" class="form-check-input">
                <label class="form-check-label" for="filmGenres-@it">@it</label>
            </div>
        }
        </div>
    </div>
    <div class="form-group">
        <input class="form-control col-3" name="age" type="number" min="13" placeholder="Age">
    </div>
    <div class="form-group">
        <div class="form-check">
            <input class=" form-check-input" id="agree" name="agree" type="checkbox" value="true">
            <label class="form-check-label" for="agree">Agree to terms and conditions</label>
        </div>
    </div>
    <div class="form-group">
        <button class="btn btn-primary" type="submit">Add Contact</button>
        <a href="/client-razor/contacts/">reset</a>
    </div>
</form>

<table id="results"></table>

@section scripts
{
    <script>
        var CONTACTS = @((await Gateway.SendAsync(new GetContacts())).Results.AsRawJson());
    
        $("form").bootstrapForm({
            success: function (r) {
                $("form")[0].reset();
                CONTACTS.push(r.result);
                render();
            }
        });
        $(document).bindHandlers({
            deleteContact: function(id) {
                if (!confirm('Are you sure?')) 
                    return;
                $.post("/contacts/" + id + "/delete", function(r) {
                   $.getJSON("/contacts", function(r) {
                       CONTACTS = r.results;
                       render();
                   }) 
                });
            }
        });
    
        function contactRow(contact) {
            return '<tr style="background:' + contact.color + '">' +
                    '<td>' + contact.title + ' ' + contact.name + ' (' + contact.age + ')</td>' +
                    '<td><a href="/client-razor/contacts/' + contact.id + '/edit">edit</a></td>' +
                    '<td><button class="btn btn-sm btn-primary" data-click="deleteContact:' + contact.id + '">delete</button></td>' +
                '</tr>';
        }
        
        function render() {
            var sb = "";
            if (CONTACTS.length > 0) {
                for (var i=0; i<CONTACTS.length; i++) {
                    sb += contactRow(CONTACTS[i])
                }
            } else {
                sb = "<tr><td>There are no contacts.</td></tr>";
            }
            $("#results").html("<tbody>" + sb + "</tbody>");
        }
    
        render();
    </script>
}
```