﻿#### _requires-auth-partial.html
```html
{{ `/server/login?continue=${PathInfo}`
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

<h3>Add new Contact</h3>

<form action="/contacts" method="post" class="col-lg-4">
    <div class="form-group">
        {{ 'title,name,color,age,filmGenres,agree' | validationSummary }}
    </div>
    <div class="form-group">
        {{ {id:'title',type:'radio'} | formInput({values:contactTitles,inline:true}) }}
    </div>
    <div class="form-group">
        {{ {id:'name',placeholder:'Name'} | formInput({label:'Full Name',help:'Your first and last name'}) }}
    </div>
    <div class="form-group">
        {{ {id:'color',class:'col-4'}
           | formSelect({label:'Favorite color',values:{'', ...contactColors}}) }}
    </div>
    <div class="form-group">
        {{ {id:'filmGenres',type:'checkbox'} | formInput({label:'Favorite Film Genres',values:contactGenres,help:"choose one or more"}) }}
    </div>
    <div class="form-group">
        {{ {id:'age',type:'number',min:13,placeholder:'Age',class:'col-3'} | formInput }}
    </div>
    <div class="form-group">
        {{ {id:'agree',type:'checkbox'} | formInput({label:'Agree to terms and conditions'}) }}
    </div>
    <div class="form-group">
        <button class="btn btn-primary" type="submit">Add Contact</button>
        <a href="/server/contacts/">reset</a>
    </div>
</form>

{{ sendToGateway('GetContacts') | assignTo: response }}

<table id="results">
    <tbody>
    {{#each response.Results}}
        <tr style="background:{{Color}}">
            <td>{{Title}} {{Name}} ({{Age}})</td>
            <td><a href="/server/contacts/{{Id}}/edit">edit</a></td>
            <td><form method="post" action="/contacts/{{Id}}/delete" onsubmit="return confirm('Are you sure?')">
                <button class="btn btn-sm btn-primary">delete</button></form></td>
        </tr>
    {{else}}
        <tr>
            <td>There are no contacts.</td>
        </tr>
    {{/each}}
    </tbody>
</table>

{{ htmlError }}
```
