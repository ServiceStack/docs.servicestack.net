---
slug: ss-utils-js
title: ss-utils.js JavaScript Client Library
---

jQuery Apps can take advantage of utils in `ss-utils.js` for easy integration with ServiceStack Services.

An Embedded Resource inside **ServiceStack.dll** is ServiceStack's JavaScript utility library that provides a number of convenience utilities in developing javascript web apps. It enables nicer integration with ServiceStack's Server features including [Validation](/validation), [Error Handling](/error-handling) and [Server Events](https://github.com/ServiceStackApps/Chat#server-sent-events) which can be included in any page with:

```html
<script type="text/javascript" src="/js/ss-utils.js"></script>
```

### DefinitelyTyped and npm

To make it easier to develop with **ss-utils** in any of the npm-based Single Page Apps templates we're also
maintaining a copy of [ss-utils in npm](https://www.npmjs.com/package/ss-utils) and have also added it to JSPM 
and DefinitelyTyped registry so you can now add it to your project like any other external dependency using JSPM:

:::sh
jspm install ss-utils
:::

If you're using TypeScript, you can also download the accompanying TypeScript definition from:

:::sh
typings install ss-utils --ambient --save
:::
    
Or if you're using the older tsd package manager: `tsd install ss-utils --save`.

## Usage

To showcase how it simplifies general web development, we'll walkthrough the JavaScript needed to provide all the behavior for the [entire UI of Email Contacts](https://github.com/ServiceStack/EmailContacts/blob/master/src/EmailContacts/default.cshtml) that uses just jQuery and bootstrap.js:

## Bootstrap Forms

ss-utils.js validation and error handling support works with Bootstrap's standard HTML Form markup, e.g:

```html
<form id="form-addcontact" action="@(new CreateContact().ToPostUrl())" method="POST">
    <div class="col-sm-3 form-group">
        <label for="Name">Name</label>
        <input class="form-control input-sm" type="text" id="Name" name="Name" value="">
        <span class="help-block"></span>
    </div>
    ...
</form>
```

The first thing to notice is the **action** url is created with a typed API populated using the [Reverse Routing](/routing#reverse-routing) `ToPostUrl()` extension method that looks at `CreateContact` Request DTO to return the best matching route based on the Route definitions and the fields populated in the Request DTO instance, in this case the empty Request DTO matches `[Route("/contacts", "POST")]` so returns `/contacts`.

Other significant parts in this HTML Form is that the **INPUT** field names match up with the Request DTO it posts to and that it includes Bootstraps **class="help-block"** placeholders adjacent to each INPUT element which is what **ss-utils.js** uses to bind the field validation errors.

## Binding HTML Forms

You can ajaxify a HTML FORM by using ss-utils `bindForm` jQuery mixin, e.g:

```js
$("#form-addcontact").bindForm({
    success: function (contact) {
        addContacts([contact]);
        $("#form-addcontact input").val('')
            .first().focus();
    }
});
```

This takes over the handling of this FORM and instead of doing a POST back of the entire page to the server, makes an Ajax request using all the fields in the FORM to POST the data to the **CreateContact** Service:

```csharp
public Contact Post(CreateContact request)
{
    var contact = request.ConvertTo<Contact>();
    Db.Save(contact);
    return contact;
}
```

## Fluent Validation

Normally the Service implementation will be called as-is but as we've added the FluentValidation `ValidationFeature` plugin and there exists a validator for `CreateContact` below:

```csharp
public class ContactsValidator : AbstractValidator<CreateContact>
{
    public ContactsValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("A Name is what's needed.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Age).GreaterThan(0);
    }
}
```

The Request DTO is first validated with the above declarative rules and if it fails returns a structured error response which ss-utils uses to bind the validation errors to all the invalid field **class=help-block** (or **help-inline**) placeholders:

![HTML Validation](https://raw.github.com/ServiceStack/EmailContacts/master/src/EmailContacts/Content/html-validation.png)

Whilst the user goes back and corrects their INPUT, we can provide instant feedback and clear the errors as they update each each field with:

```js
$("input").change($.ss.clearAdjacentError);
```

Once all is successful we invoke the `success:` callback with the response of the Service which in this case is the newly created `Contact` that we dynamically add to the contacts list by calling the existing `addContacts()` method. We also clear all form values and put focus back to the first field, ready for a rapid entry of the next Contact:

```js
$("#form-addcontact").bindForm({
    success: function (contact) {
        addContacts([contact]);
        $("#form-addcontact input").val('')
            .first().focus();
    }
});
```

### Manual Error Handling

The `validate` callback can be used to add client side validation logic which can manually set client-side validation errors using `setFieldError()`, e.g:

```javascript
$("form").bindForm({
    validate: function(){
        var params = $(this).serializeMap();
        if (params.Password != params.Confirm) {
            $(this).setFieldError('Password', 'Passwords to not match');
            return false;
        }
    }
});
```

## Declarative Events

An interesting difference in the dynamically generated HTML are the presence of **data-click=showContact** and **data-click=deleteContact** attributes:

```js
function addContacts(contacts) {
    var html = contacts.map(function (c) {
        return "<li data-id='" + c.Id + "' data-click='showContact'>" +
                "<span class='glyphicon glyphicon-user' style='margin: 0 5px 0 0'></span>" +
                c.Name + " " + " (" + c.Age + ")" +
                '<span class="glyphicon glyphicon-remove-circle" data-click="deleteContact"></span>'
             + "</li>";
    });
    $("#contacts").append(html.join(''));
}
```

This showcases some of the declarative event support in ss-utils which allows you to invoke event handlers without needing to maintain bookkeeping of event handlers when adding or removing elements. 
You can instead define one set of event handlers for the entire page with `bindHandlers`, e.g:

```js
$(document).bindHandlers({
    showContact: function() {
        var id = $(this).data("id");
        $.getJSON("/contacts/" + id, function (contact) {
            $("#email-contact")
                .applyValues(contact)
                .show();
            $("#form-emailcontact .alert-success").hide();
        });
    },
    deleteContact: function () {
        var $li = $(this).closest("li");
        $.post("/contacts/" + $li.data("id") + "/delete", function () {
            $li.remove();
        });
    },
    toggleAction: function() {
        var $form = $(this).closest("form"), action = $form.attr("action");
        $form.attr("action", $form.data("action-alt"))
                .data("action-alt", action);
    }
});
```

The matching event handler will be invoked whenever an element with **data-{event}={handlerName}** is clicked, e.g: `data-click='showContact'`.
 
In addition to **click**, a number of other jQuery events can be declared in this way, as defined in:

```js
$.ss.listenOn = 'click dblclick change focus blur focusin focusout select keydown keypress keyup hover toggle';
```

### Multiple Arguments

Declarative event handlers can also send multiple arguments:

```html
<ul>
    <li data-click="single">Foo</li>
    <li data-click="multiple:arg1,arg2">Bar</li>
</ul>
```

```javascript
$(document).bindHandlers({
    single: function(){
        var li = this;
    },
    multiple: function(arg1, arg2) {
        var li = this;
    }
});
```

## Data Binding

Diving into the implementation of **showContact** we see ss-utils `applyValues()` jQuery mixin which binds a JS object to the target element, in this case **#email-contact**:

```js
showContact: function() {
    var id = $(this).data("id");
    $.getJSON("/contacts/" + id, function (contact) {
        $("#email-contact")
            .applyValues(contact)
            .show();
        $("#form-emailcontact .alert-success").hide();
    });
},
```

The data-binding applied by `applyValues()` include:

  - Set the **value** of all elements with matching **id={field}** or **name={field}**
  - Set the **value** of all elements marked with **data-val={field}**
  - Set the innerHTML contents of all elements marked with **data-html={field}**
  - Set the `data-href` and `data-src` attributes

#### Example Usage 

```javascript
$("#email-contact").applyValues(contact);
```

Which binds the returned **contact** response object to the **#email-contact** HTML Element, populating all matching elements with data from `contact`:

```html
<div id="email-contact">
    ...
    <a data-href="ProfileUrl"><img data-src="ProfileUrl" /></a>
    <h3>
        Email <span data-html="Name"></span>
    </h3>
    <h4>To: <span data-html="Email"></span></h4>
    <div class="clearfix"></div>
    <form id="form-emailcontact" method="POST">
        ...
        <input type="hidden" name="ContactId" data-val="Id"  />
        ...
    </form>
</div>
```

## Advanced bindForm usages

### Form Loading

Whilst a FORM is being processed all its buttons with `[type=submit]` (overridable with `$.ss.onSubmitDisable`) are disabled and a **loading** class is added whilst a response from the server is pending. 
This can be used to provide UX feedback to end users with just CSS. E.g. we use `.loading` CSS rule to show the rotating glyphicon:

```css
#email-contact .loading .rotate {
    visibility: visible;
}
```

### Server initiated actions

Some useful functionality not demonstrated in this example is your Services ability to invoke client behavior by returning a response decorated with custom HTTP Headers. 
An example is being able to return "Soft Redirects" to navigate to a different page by adding a **X-Location** HTTP Header, e.g:

```csharp
return new HttpResult(response) {
    Headers = {
        { "X-Location", newLocationUri },
    }
};
```

When returned to a ajax form, it will instruct the page to automatically redirect to the new url.

You can also trigger an event on the page by returning a **X-Trigger** header, e.g:

```csharp
return new HttpResult(response) {
    Headers = {
        { "X-Trigger", "showLoginPopup" },
    }
};
```

In this case the page event handler named **showLoginPopup** will be invoked if it exists.

As we expect these features to be popular when developing ajax apps we've provided shorter typed aliases for the above examples:

```csharp
return HttpResult.SoftRedirect(new ViewContact { Id = newContact.Id }.ToGetUrl(), newContact);
return HttpResult.TriggerEvent(contact, eventName:"showLoginPopup");
```

### $.ajaxSubmit

The `$.fn.ajaxSubmit` is also available for use independently to submit a HTML form via Ajax on demand. 
This is used in the 
[connections.jsx](https://github.com/ServiceStackApps/RedisReact/blob/15dfc5cfea49d0502ec8c090b5b180d29051ea3a/src/RedisReact/RedisReact/js/components/connections.jsx#L31)
React Component of [Redis React's Connections Page](https://github.com/ServiceStackApps/RedisReact#connections)
to auto submit the form via ajax to the specified `/connection` url with the populated Form INPUT values. It also disables the `#btnConnect` submit button and adds a `.loading` class to the form whilst it's in transit which is used to temporarily show the loading sprite:

```js
var Connections = React.createClass({
    //...
    onSubmit: function (e) {
        e.preventDefault();

        var $this = this;
        $(e.target).ajaxSubmit({
            onSubmitDisable: $("#btnConnect"),
            success: function () {
                $this.setState({ successMessage: "Connection was changed" });
                Actions.loadConnection();
            }
        });
    },
    render: function () {
        var conn = this.state.connection;
        return (
          <div id="connections-page">
            <div className="content">
                <form id="formConnection" className="form-inline" onSubmit={this.onSubmit} action="/connection">
                    <h2>Redis Connection</h2>
                    <div className="form-group">
                        <input name="host" type="text" />
                        <input name="port" type="text" className="form-control" />
                        <input name="db" type="text" className="form-control" />
                    </div>
                    <p className="actions">
                        <img className="loader" src="/img/ajax-loader.gif" />
                        <button id="btnConnect" className="btn btn-default btn-primary">Change Connection</button>
                    </p>
                    <p className="bg-success">{this.state.successMessage}</p>
                    <p className="bg-danger error-summary"></p>
                </form>
            </div>
          </div>
        );
    }
}; 
``` 

### $.ss.parseResponseStatus

Lets you easily parse the raw text of a Ajax Error Response into a responseStatus JavaScript object, example used in Redis React's 
[Console Component](https://github.com/ServiceStackApps/RedisReact/blob/15dfc5cfea49d0502ec8c090b5b180d29051ea3a/src/RedisReact/RedisReact/js/components/console.jsx#L103): 

```js
.fail(function (jq, jqStatus, statusDesc) {
    var status = $.ss.parseResponseStatus(jq.responseText, statusDesc);
    Actions.logEntry({
        cmd: cmd,
        result: status.message,
        stackTrace: status.stackTrace,
        type: 'err',
    });
});
```

### $.ss.bindAll

The `bindAll` API is a simple helper for creating lightweight JavaScript objects by binding `this` for all functions of an object literal to the object instance, e.g:

```js
var Greeting = $.ss.bindAll({
    name: "World",
    sayHello: function() {
        alert("Hello, " + this.name);
    }
});

var fn = Greeting.sayHello;
fn(); // Hello, World
```

## TypeScript Definition

The TypeScript definitions for [ss-utils.d.ts](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/js/ss-utils.d.ts) is an embedded resource inside **ServiceStack.dll** which is available from `/js/ss-utils.d.ts`, e.g [servicestack.net/js/ss-utils.d.ts](https://servicestack.net/js/ss-utils.d.ts).

## API Reference

```javascript
$.ss.onSubmitDisable = "[type=submit]"  // Disable elements during form submission

$.ss.validation = {                // Customize Validation
    overrideMessages: false,       // Whether to override Server Error Messages
    messages: {                    // List of Server ErrorCodes to override
      NotEmpty: "Required",        // Override `NotEmpty` ErrorCode with `Required`
    },
}
$.fn.serializeMap()                // Return the FORM's INPUT values as a map
$.fn.setFieldError(name,msg)       // Set the error for field `name` with `msg`
$.fn.applyErrors(status,options)   // Apply errors in ResponseStatus to Element
$.fn.clearErrors()                 // Clear all errors applied to Element
$.ss.clearAdjacentError()          // Clear adjacent errors in help-block/inline
$.ss.parseResponseStatus           // Parse raw JSON Error ResponseStatus

$.fn.bindForm(options)             // Bind and Ajaxify the HTML Form
$.fn.ajaxSubmit()                  // Submit a HTML Form via Ajax
$.fn.applyValues(map)              // Databind values in `map` to HTML Element

$.fn.bindHandlers(handlers)        // Register global declarative JS handlers
$.ss.listenOn = "click ..."        // Specify DOM events for declarative events
$.ss.bindAll                       // Bind all object literal functions to itself

$.fn.setActiveLinks()              // Add `active` class to links with current url

$.ss.todate(string)                // Convert String to Date
$.ss.todfmt(string)                // Convert String to `YYYY-MM-DD` Date Format
$.ss.dfmt(date)                    // Convert Date to `YYYY-MM-DD` Date Format
$.ss.dfmthm(date)                  // Convert Date to `YYYY-MM-DD HH:MM:SS PM`
$.ss.tfmt12(date)                  // Convert Date to `HH:MM:SS PM`

$.ss.splitOnFirst(string,needle)   // Split on first occurrence of needle
$.ss.splitOnLast(string,needle)    // Split on last occurrence of needle

$.ss.getSelection()                // Get currently selected text (if any)

$.ss.queryString(url)              // Return a map of key value pairs

$.fn.handleServerEvents()          // Handle ServiceStack ServerEvents
$.ss.eventReceivers = {}           // Specify global receivers for ServerEvents
```

#### combinePaths and createUrl

The `combinePaths` and `createUrl` API's help with constructing urls, e.g:

```javascript
$.ss.combinePaths("path","to","..","join")   //= path/join
$.ss.createPath("path/{foo}", {foo:1,bar:2}) //= path/1

$.ss.createUrl("http://host/path/{foo}",{foo:1,bar:2}) //= http://host/path/1?bar=2
```

#### normalize and normalizeKey

`normalizeKey` and `normalize` APIs helps with normalizing JSON responses with different naming 
conventions by converting each property into lowercase with any `_` separators removed - `normalizeKey()` 
converts a single string whilst `normalize()` converts an entire object graph, e.g:

```javascript
$.ss.normalizeKey("THE_KEY") //= thekey

JSON.stringify(
    $.ss.normalize({THE_KEY:"key",Foo:"foo",bar:{A:1}})
)   //= {"thekey":"key","foo":"foo","bar":{"A":1}}

const deep = true;
JSON.stringify(
    $.ss.normalize({THE_KEY:"key",Foo:"foo",bar:{A:1}}, deep) 
)   //= {"thekey":"key","foo":"foo","bar":{"a":1}}
```

#### postJSON

`postJSON` is jQuery's missing equivalent to `$.getJSON`, but for POST's, eg:

```javascript
$.ss.postJSON(url, {data:1}, response => ..., error => ...);
```
