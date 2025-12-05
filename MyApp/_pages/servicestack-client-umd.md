---
slug: servicestack-client-umd
title: Embedded UMD @servicestack/client
---

A UMD version of the [@servicestack/client](https://github.com/ServiceStack/servicestack-client) JavaScript client library 
that contains the [TypeScript Service and SSE Clients](/typescript-add-servicestack-reference) is now embedded in **ServiceStack.dll**.
It's the modern, dependency-free replacement to [ss-utils.js](/ss-utils-js) which requires jQuery which is used instead in all
SPA Project Templates.

The embedded UMD version allows for the creation of stand-alone pages that accesses your ServiceStack JSON APIs 
without any external file references with the single `<script/>` reference:

```html
<script src="/js/servicestack-client.js"></script>
```

This is used by the updated [mix init](/mix-tool#mix-usage) gists when generating its empty Web Apps:

```bash
mkdir web && cd web
npx add-in init
dotnet run
```

Where its dep-free [/index.html](https://gist.github.com/gistlyn/58030e271595520d87873c5df5e4c2eb#file-wwwroot-index-html) use its
`JsonServiceClient` to call its **/hello** API:

```html
<script src="/js/require.js"></script>
<script src="/js/servicestack-client.js"></script>
<script src="/types/js"></script>
<script>
var { JsonServiceClient, Hello } = exports

var client = new JsonServiceClient();
function callHello(name) {
    client.get(new Hello({ name }))
        .then(function(r) {
            document.getElementById('result').innerHTML = r.result;
        });
}
</script>
```

Which utilizes the [JavaScript Add ServiceStack Reference](/javascript-add-servicestack-reference) **/types/js** to instantly generate JavaScript Types for all your APIs DTOs which can immediately be used with the [TypeScript JsonServiceClient](/typescript-add-servicestack-reference#typescript-serviceclient) to make Typed API requests.

That modern browsers (as well as any TypeScript or Webpack project) let you use the much nicer async/await syntax:

```js
let r = await client.get(new Hello({ name: val }))
```

### Rich intelli-sense support

Even pure HTML/JS Apps that don't use TypeScript or any external dependencies will still benefit from the Server 
generated `dtos.ts` and `servicestack-client.d.ts` definitions as Smart IDEs like 
[Rider](https://www.jetbrains.com/rider/) can make use of them to provide a rich productive development UX
on both the built-in `/js/servicestack-client.js` library:

![](/img/pages/mix/init-rider-ts-client.png)

As well as your App's server generated DTOs:

![](/img/pages/mix/init-rider-ts-dto.png)

Including their typed partial constructors:

![](/img/pages/mix/init-rider-ts-dto-props.png)

So even simple Apps without complex bundling solutions or external dependencies can still benefit from a rich typed authoring 
experience without any additional build time or tooling complexity.

### CDN unpkg

A CDN hosted version of UMD @servicestack/client is available on unpkg.com:

```html
<script src="https://unpkg.com/@servicestack/client/dist/servicestack-client.min.js"></script>
```

TypeScript Definition: [index.d.ts](https://unpkg.com/@servicestack/client/dist/index.d.ts)

## Bootstrap Forms

ServiceStack's built-in [Fluent Validation](/validation) and [error handling](/error-handling) support works with Bootstrap's standard HTML Form markup, e.g:

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

Other significant parts in this HTML Form is that the **INPUT** field names match up with the Request DTO it posts to and that it includes Bootstraps **class="help-block"** placeholders adjacent to each INPUT element which is what's used to bind the field validation errors.

## Binding HTML Forms

You can ajaxify a HTML FORM by using `bootstrapForm`, e.g:

```js
let $ = sel => document.querySelector(sel);

bootstrapForm($("#form-addcontact"), {
    success: function (contact) {
        addContacts([contact]);
        $("#form-addcontact input").value = '';
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

The Request DTO is first validated with the above declarative rules and if it fails returns a structured error response which is used to bind the validation errors to all the invalid field **class=help-block** (or **help-inline**) placeholders:

![HTML Validation](https://raw.github.com/ServiceStack/EmailContacts/master/src/EmailContacts/Content/html-validation.png)

Whilst the user goes back and corrects their INPUT, we can provide instant feedback and clear the errors as they update each each field with:

```js
clearErrors($("#form-addcontact"));
```

### Manual Error Handling

The `validate` callback can be used to add client side validation logic which can manually set client-side validation errors using `applyErrors()` with a `ResponseStatus` errors collection, e.g:

```js
bootstrapForm($("form"), {
    validate: function(){
        var params = serializeForm(this);
        if (params.Password != params.Confirm) {
            applyErrors(this, {
                errors: [{
                    fieldName: 'Password',
                    message: 'Passwords to not match'
                }]
            })
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
        return `<li data-id='${c.id}' data-click='showContact'>
                    ${c.name} (${c.age})
                    <span data-click="deleteContact"></span>
                </li>`;
    });
    $("#contacts").insertAdjacentHTML('beforeend', html.join(''));
}
```

This showcases some of the declarative event support allows you to invoke event handlers without needing to maintain bookkeeping of event handlers when adding or removing elements. 
You can instead define one set of event handlers for the entire page with `bindHandlers`, e.g:

### bindHandlers

```js
bindHandlers({
    showContact: function() {
        let id = this.getAttribute("data-id");
        client.get(new GetContact({ id: id }))
            .then(function(r) {
                showContact(r);
            });
    },
    deleteContact: function () {
        var id = this.closest("li").getAttribute("data-id");
        client.delete(new DeleteContact({ id: id }));
    }
});
```

The matching event handler will be invoked whenever an element with **data-{event}={handlerName}** is clicked, e.g: `data-click='showContact'`.
 
In addition to **click**, a number of other DOM events can be declared in this way, as defined in:

```js
['click','dblclick','change','focus','blur','focusin','focusout',
 'select','keydown','keypress','keyup','hover','toggle','input']
```

Or you can specify your own in `bindHandlers` options param, e.g:

```js
bindHandlers({
    showTooltip: function() {}
}, document, { events: ['mouseover'] })
```

### Multiple Arguments

Declarative event handlers can also send multiple arguments:

```html
<ul>
    <li data-click="single">Foo</li>
    <li data-click="multiple:arg1,arg2">Bar</li>
</ul>
```

```js
bindHandlers({
    single: function(){
        var li = this;
    },
    multiple: function(arg1, arg2) {
        var li = this;
    }
});
```

## Advanced bindForm usages

### Form Loading

Whilst a FORM is being processed all its buttons with `[type=submit]` are disabled and a **loading** class is added 
whilst a response from the server is pending. 
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

Alternatively you can use the shorter typed aliases for the above examples:

```csharp
return HttpResult.SoftRedirect(new ViewContact { Id = newContact.Id }.ToGetUrl(), newContact);
return HttpResult.TriggerEvent(contact, eventName:"showLoginPopup");
```

### ajaxSubmit

The `ajaxSubmit` function is available to submit a HTML form via Ajax on demand. 

```js
class Connections extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();

        var $this = this;
        ajaxSubmit(e.target, {
            onSubmitDisable: $("#btnConnect"),
            success: function () {
                $this.setState({ successMessage: "Connection was changed" });
            }
        });
    }

    render() {
        var conn = this.state.connection;
        return (
          <div id="connections-page">
            <div className="content">
                <form className="form-inline" onSubmit={this.onSubmit} action="/connection">
                    <h2>Redis Connection</h2>
                    <div className="form-group">
                        <input name="host" type="text" />
                        <input name="port" type="text" className="form-control" />
                        <input name="db" type="text" className="form-control" />
                    </div>
                    <p className="actions">
                        <img className="loader" src="/img/ajax-loader.gif" />
                        <button id="btnConnect" className="btn btn-default btn-primary">
                            Change Connection
                        </button>
                    </p>
                    <p className="bg-success">{this.state.successMessage}</p>
                    <p className="bg-danger error-summary"></p>
                </form>
            </div>
          </div>
        );
    }
} 
``` 

### parseResponseStatus

Lets you easily parse the raw text of a Ajax Error Response into a responseStatus JavaScript object: 

```js
let status = parseResponseStatus(json, defaultErrorMessage);
```

### combinePaths and createUrl

The `combinePaths` and `createUrl` API's help with constructing urls, e.g:

```js
combinePaths("path","to","..","join")   //= path/join
createPath("path/{foo}", {foo:1,bar:2}) //= path/1
createUrl("http://host/path/{foo}",{foo:1,bar:2}) //= http://host/path/1?bar=2
```

#### Angular HTTP Client

You can use `createUrl()` to utilize Angular's built-in Rx-enabled HTTP Client with ServiceStack’s ambient TypeScript declarations when utilizing Angular's built-in dependencies is preferable, e.g:

```ts
import { createUrl } from '@servicestack/client';
...
this.http.get<HelloResponse>(createUrl('/hello/{Name}', { name })).subscribe(r => {
    this.result = r.result;
});
```

## TypeScript Definition

The TypeScript definitions for `@servicestack/client` is available at [/dist/index.d.ts](https://github.com/ServiceStack/servicestack-client/blob/master/dist/index.d.ts) lets you view all available utility functions in TypeScript method signatures, the full implementation of which is available from [/src/index.ts](https://github.com/ServiceStack/servicestack-client/blob/master/src/index.ts):

```ts
function isFormData(body: any): boolean;
function toCamelCase(s: string): string;
function toPascalCase(s: string): string;
function sanitize(status: any): any;
function nameOf(o: any): any;
function css(selector: string | NodeListOf<Element>, name: string, value: string): void;
function splitOnFirst(s: string, c: string): string[];
function splitOnLast(s: string, c: string): string[];
function leftPart(strVal: string, needle: string): string;
function rightPart(strVal: string, needle: string): string;
function lastLeftPart(strVal: string, needle: string): string;
function lastRightPart(strVal: string, needle: string): string;
function onlyProps(obj: {
    [index: string]: any;
}, keys: string[]): {
    [index: string]: any;
};
function humanize(s: any): any;
function queryString(url: string): any;
function combinePaths(...paths: string[]): string;
function createPath(route: string, args: any): string;
function createUrl(route: string, args: any): string;
function appendQueryString(url: string, args: any): string;
function bytesToBase64(aBytes: Uint8Array): string;
function stripQuotes(s: string): string;
function tryDecode(s: string): string;
function parseCookie(setCookie: string): Cookie;
function normalizeKey(key: string): string;
function normalize(dto: any, deep?: boolean): any;
function getField(o: any, name: string): any;
function parseResponseStatus(json: string, defaultMsg?: any): any;
function toFormData(o: any): FormData;
function toObject(keys: any): {};
function errorResponseSummary(): any;
function errorResponseExcept(fieldNames: string[] | string): any;
function errorResponse(fieldName: string): any;
function toDate(s: string | any): Date;
function toDateFmt(s: string): string;
function padInt(n: number): string | number;
function dateFmt(d?: Date): string;
function dateFmtHM(d?: Date): string;
function timeFmt12(d?: Date): string;
function toLocalISOString(d?: Date): string;
function createElement(tagName: string, options?: ICreateElementOptions, attrs?: any): HTMLElement;
function bootstrap(el?: Element): void;
function bindHandlers(handlers: any, el?: Document | Element, opt?: IBindHandlersOptions): void;
function bootstrapForm(form: HTMLFormElement | null, options: IAjaxFormOptions): void;
function toVarNames(names: string[] | string | null): string[];
function formSubmit(this: HTMLFormElement, options?: IAjaxFormOptions): Promise<any>;
function ajaxSubmit(f: HTMLFormElement, options?: IAjaxFormOptions): any;
function serializeForm(form: HTMLFormElement, contentType?: string | null): string | FormData;
function serializeToObject(form: HTMLFormElement): any;
function serializeToUrlEncoded(form: HTMLFormElement): string;
function serializeToFormData(form: HTMLFormElement): FormData;
function triggerEvent(el: Element, name: string, data?: any): void;
function populateForm(form: HTMLFormElement, model: any): void;
function trimEnd(s: string, c: string): string;
function safeVarName(s: string): string;
function pick(o: any, keys: string[]): {};
function omit(o: any, keys: string[]): {};
function activeClassNav(x: NavItem, activePath: string): string;
function activeClass(href: string | null, activePath: string, exact?: boolean): string;
function btnColorClass(props: any): string;
function btnSizeClass(props: any): string;
function btnClasses(props: any): any[];
function classNames(...args: any[]): string;
function fromXsdDuration(xsd: string): number;
function toXsdDuration(time: number): string;
function toTimeSpanFmt(time: number): string;
```
