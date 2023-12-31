﻿#### _requires-auth-partial.html 
```html
{{ `/server-jquery/login?continue=${PathInfo}`
   | redirectIfNotAuthenticated }}

<div style="text-align:right">
    <small class="text-muted">
        {{ userSession.DisplayName }} 
        | <a href="/auth/logout?continue=/server/">Sign Out</a>
    </small>
</div>
```

#### index.html
```html
{{ 'requires-auth' | partial }}

{{ '/server-jquery/contacts/' | assignTo: continue }}

<h3>Add new Contact</h3>

<form action="/contacts" method="post" class="col-lg-4">

    <div class="form-group">
        {{ '<div class="alert alert-danger">{0}</div>' | htmlFormat(errorResponseExcept('title,name,color,filmGenres,age,agree')) }}
        <input type="hidden" name="Continue" value="{{ continue }}">
        <input type="hidden" name="ErrorView" value="{{ continue }}">
    </div>

    <div class="form-group">
        <div class="form-check" data-invalid="{{ 'title' | errorResponse }}">
            {{#each contactTitles}}
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="title-{{Key}}" name="title" value="{{Key}}" class="custom-control-input"
                       {{ {checked:formValue('title')==Key} | htmlAttrs }}>
                <label class="custom-control-label" for="title-{{Key}}">{{Value}}</label>
            </div>
            {{/each}}
        </div>
    </div>
    <div class="form-group">
        <label for="name">Full Name</label>
        <input class="form-control" id="name" name="name" type="text" placeholder="Name"
               value="{{ 'name' | formValue }}" data-invalid="{{errorResponse('name')}}">
        <small id="name-help" class="text-muted">Your first and last name</small>
    </div>
    <div class="form-group">
        <label class="form-label" for="color">Favorite color</label>
        <select id="color" name="color" class="col-4 form-control" data-invalid="{{ 'color' | errorResponse }}">
            <option value=""></option>
            {{#each contactColors}}
            <option value="{{Key}}" {{ {selected:formValue('color')==Key} | htmlAttrs }}>{{Value}}</option>
            {{/each}}
        </select>
    </div>
    <div class="form-group">
        <label class="form-check-label">Favorite Film Genres</label>
        <div class="form-check" data-invalid="{{ 'filmGenres' | errorResponse }}">
            {{ 'filmGenres' | formValues | assignTo: selectedGenres }}
            {{#each contactGenres}}
            <div class="custom-control custom-checkbox">
                <input type="checkbox" id="filmGenres-{{it}}" name="filmGenres" value="{{it}}" class="form-check-input"
                       {{ {checked:contains(selectedGenres, it)} | htmlAttrs }}>
                <label class="form-check-label" for="filmGenres-{{it}}">{{it}}</label>
            </div>
            {{/each}}
        </div>
    </div>
    <div class="form-group">
        <input class="form-control col-3" name="age" type="number" min="13" placeholder="Age"
               value="{{ 'age' | formValue }}" data-invalid="{{errorResponse('age')}}">
    </div>
    <div class="form-group">
        <div class="form-check">
            <input class=" form-check-input" id="agree" name="agree" type="checkbox" value="true"
                   data-invalid="{{ 'agree' | errorResponse }}">
            <label class="form-check-label" for="agree">Agree to terms and conditions</label>
        </div>
    </div>
    <div class="form-group">
        <button class="btn btn-primary" type="submit">Add Contact</button>
        <a href="{{ continue }}">reset</a>
    </div>
</form>

<table id="results"></table>

{{#capture appendTo scripts}}
<script>var CONTACTS = {{ sendToGateway('GetContacts') | map => it.Results | json }};</script>
{{/capture}}

{{#raw appendTo scripts}}
<script>
    $(document).bootstrap().bindHandlers({
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
                '<td><a href="/server-jquery/contacts/' + contact.id + '/edit">edit</a></td>' +
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
{{/raw}}

{{ htmlError }}
```