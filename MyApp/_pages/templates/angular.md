---
title: Angular Tailwind Template
---

We're thrilled to announce the launch of our newest Single Page Application (SPA) template which enhances the
seamless integration in [ASP.NET Core's Angular SPA template](https://learn.microsoft.com/en-us/aspnet/core/client-side/spa/angular)
but upgraded from Angular 15 to the accelerated workflow in [Angular 19's investment in developer experience](https://blog.angular.dev/meet-angular-v19-7b29dfd05b84) 
and performance that's been rewritten to use the latest modern web technologies:

1. **Built-in Identity Authentication:** Secured out-of-the-box, this template integrates seamlessly with ASP.NET Core Identity, providing ready-to-use registration, login, and User Admin management features.
2. **Tailwind v4 CSS:** Rewritten to use Tailwind v4 CSS, allowing you to rapidly build beautiful, responsive designs directly in your markup.
3. **Dark Mode Support:** Cater to user preferences with built-in, easily toggleable dark mode support, styled elegantly with Tailwind.
4. **Customizable DataGrid Component:** Effortlessly display tabular data with the included customizable DataGrid. Easily adapt it for sorting, filtering and displaying your specific data structures.
5. **Reusable Input Components with Validation:** The template includes reusable, pre-styled input components (e.g., text input, selects) with built-in support for validation bound forms and contextual displaying of validation errors.
6. **RxJS & Signals Support:** Modern Angular reactivity: whether you prefer the established power of **RxJS Observables** or the new granular reactivity of **Angular Signals**, our template is structured to support *both* programming models.

Angular's structured approach to modern web development is ideal for large complex Applications that stitches together various 
technologies, handling authentication, designing responsive UIs, and managing complex state which the new Angular SPA template
embraces to provide a productive starting point with a robust foundation packed with essential features right out of the box.

## Getting Started

The default Angular SPA Template can be downloaded below:  

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/angular-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Angular SPA</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.5l8.84 3.15l-1.34 11.7L12 21.5l-7.5-4.15l-1.34-11.7L12 2.5m0 2.1L6.47 17h2.06l1.11-2.78h4.7L15.45 17h2.05L12 4.6m1.62 7.9h-3.23L12 8.63l1.62 3.87Z"></path></svg>
        </template>
    </project-template>
</project-creator>

Alternatively you can download a custom template from the [Start Page](/start).

The source code for the template is maintained at [NetCoreTemplates/angular-spa](https://github.com/NetCoreTemplates/angular-spa)
whilst an online live-demo is available from: [angular-spa.web-templates.io](https://angular-spa.web-templates.io)

## Feature Tour

We'll take a quick tour to explore the templates features

### Home Page

The home page sports a responsive Tailwind design where all its components are encapsulated within its 
[/MyApp.Client/src/app/home](https://github.com/NetCoreTemplates/angular-spa/tree/main/MyApp.Client/src/app/home)
with its logic maintained in `*.ts` files and its presentation UI optionally maintained in a separate `*.html` file:

[![](/img/pages/templates/angular-spa/angular-home.webp)](https://angular-spa.web-templates.io)

The [dark-mode-toggle.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/components/dark-mode-toggle.component.ts)
and [theme.service.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/components/services/theme.service.ts)
handles switching between Light and Dark Mode which is initially populated from the Users OS preference: 

[![](/img/pages/templates/angular-spa/angular-dark.webp)](https://angular-spa.web-templates.io)

### Weather

The Weather page maintained in [/app/weather](https://github.com/NetCoreTemplates/angular-spa/tree/main/MyApp.Client/src/app/weather) 
provides a good example of utilizing an RxJS Observable programming model with the 
[api-http-client.service.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/components/services/api-http-client.service.ts)
that extends Angular's Observable HttpClient with an additional `api` method that lets you use your Services typed `dtos.ts`
TypeScript DTOs to enable type-safe integration with your back-end services: 

```ts
import { Forecast, GetWeatherForecast, ResponseStatus } from 'src/dtos'
import { ApiHttpClient } from 'src/components/services/api-http-client.service'

export class WeatherComponent {
  http = inject(ApiHttpClient);

  public error: ResponseStatus | null = null;
  public forecasts: Forecast[] = [];

  getForecasts() {
    this.http.api(new GetWeatherForecast({ date:'2025-04-01' })).subscribe({
        next:(result) => {
            this.error = null;
            this.forecasts = result;
        },
        error:(error) => {
            this.error = error;
        }
    });
  }
}
```

Whilst its [weather.component.html](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/weather/weather.component.html)
template showcases the new [data-grid.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/components/data-grid.component.ts)
to display a beautiful tailwind DataGrid with just:

```html
<data-grid [items]="forecasts"></data-grid>
```

[![](/img/pages/templates/angular-spa/angular-datagrid-default.webp)](https://angular-spa.web-templates.io/weather)

It's a direct port of our [Vue DataGrid](https://docs.servicestack.net/vue/datagrid) that also supports
the same customizations allowing for custom Headers and Column fields, e.g:

```html
<data-grid [items]="forecasts">
    <ng-template #dateHeader>
        <div class="flex items-center">
            <span class="font-bold text-green-700 uppercase">Date</span>
        </div>
    </ng-template>

    <ng-template #date let-x="date">{{ x | date:'MMMM d, yyyy' }}</ng-template>
    <ng-template #temperatureC let-x="temperatureC">
        {{ x }}&deg;
    </ng-template>
    <ng-template #temperatureF let-x="temperatureF">
        {{ x }}&deg;
    </ng-template>
    <ng-template #summary let-x="summary">{{ x }}</ng-template>
</data-grid>
```

Which renders the expected:

[![](/img/pages/templates/angular-spa/angular-datagrid-custom.webp)](https://angular-spa.web-templates.io/weather)

## Todos MVC

The Todos MVC App maintained in [/app/todomvc](https://github.com/NetCoreTemplates/angular-spa/tree/main/MyApp.Client/src/app/todomvc) 
demonstrates how to create the popular [todomvc.com](https://todomvc.com) App in Angular 19.

[![](/img/pages/templates/angular-spa/angular-todos.webp)](https://angular-spa.web-templates.io/todomvc)

It's another example of building a simple CRUD Application with Angular RxJS Observables and your APIs TypeScript DTOs.

This snippet shows how to query and create Todos with the `ApiHttpClient`:

```ts
import { Todo, QueryTodos, CreateTodo, ResponseStatus } from 'src/dtos'
import { ApiHttpClient } from 'src/components/services/api-http-client.service'

export class TodoMvcComponent implements OnInit {
    client = inject(ApiHttpClient);
    error: ResponseStatus | null = null;
    todos: Todo[] = [];
    newTodoText = '';
    
    loadTodos(): void {
        this.client.api(new QueryTodos()).subscribe({
            next: (todos) => {
                this.todos = todos.results;
            },
            error: (err) => {
                this.error = err;
            }
        });
    }

    addTodo(): void {
        if (!this.newTodoText.trim()) return;

        this.client.api(new CreateTodo({
            text: this.newTodoText.trim()
        })).subscribe({
            next: (todo) => {
                this.todos.push(todo);
                this.newTodoText = '';
            },
            error: (err) => {
                this.error = err;
                console.error('Error adding todo:', err);
            }
        });
    }
    //...
}
```

## Bookings

All other examples in the template uses Angular's newer Signal for reactivity and the standard ServiceStack `JsonServiceClient` 
used in all other TypeScript/JS Apps.

The Bookings Pages are maintained in [/app/bookings](https://github.com/NetCoreTemplates/angular-spa/tree/main/MyApp.Client/src/app/bookings)
and showcases a more complete example of developing a CRUD UI in Angular starting with an example of how to encapsulate
route information for a feature in an isolated [booking.routes.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/bookings/booking.routes.ts):

```ts
import { Routes } from '@angular/router';
import { BookingListComponent } from './booking-list.component';
import { BookingCreateComponent } from './booking-create.component';
import { BookingEditComponent } from './booking-edit.component';
import { authGuard } from 'src/guards';

export const BOOKING_ROUTES: Routes = [
  { 
    path: 'bookings', 
    component: BookingListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/create', 
    component: BookingCreateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/edit/:id', 
    component: BookingEditComponent,
    canActivate: [authGuard]
  }
];
```

The use of the Route `authGuard` ensures only Authenticated Users can access these routes, as well as redirecting 
non-authenticated users to the Sign In page.

### Bookings List 

[![](/img/pages/templates/angular-spa/angular-bookings-list.webp)](https://angular-spa.web-templates.io/bookings)

The bookings list component shows an example of using Angular's Signals with the `JsonServiceClient` together with
an `ApiState` context to enable data bound forms and validation errors:

```ts
@Component({
    templateUrl: './booking-list.component.html',
    providers: [
        ...provideApiState()
    ],
    //...
})
export class BookingListComponent implements OnInit {
    private router = inject(Router);
    private client = inject(JsonServiceClient);
    api = inject(ApiState);

    // Signals for state
    allBookings = signal<Booking[]>([]);

    ngOnInit(): void {
        this.loadBookings();
    }

    async loadBookings(): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new QueryBookings({
            orderByDesc: 'BookingStartDate',
        }));
        if (api.succeeded) {
            this.allBookings.set(api.response!.results);
        }

        this.api.complete(api.error);
    }
}
```

Using `provideApiState()` implicitly injects the populated API context containing both the APIs Loading and Error into
child components saving you from explicitly specifying it in each component.

E.g. the `<form-loading>` component will display when API Requests are in-flight whilst API Error Responses are displayed
after receiving failed API Responses:

```html
<app-page title="Bookings" class="max-w-6xl">

    <form-loading text="Loading Bookings..."></form-loading>
    <error-summary></error-summary>

    @if (allBookings().length > 0) {
    <data-grid [items]="allBookings()">...</data-grid>
    }
    @else {
    <div class="text-center py-4 bg-gray-50 rounded-md">
        <p class="text-gray-500">No bookings found</p>
    </div>
    }
    
</app-page>
```

### Edit Booking

The [booking-edit.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/bookings/booking-edit.component.ts)
shows an example of using the `JsonServiceClient` with Signals to get and modify bookings:

```ts
export class BookingEditComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private client = inject(JsonServiceClient);
    meta = inject(MetadataService);
    api = inject(ApiState);

    // Signals
    booking = signal<Booking>(new Booking());

    ngOnInit(): void {
        // Get booking ID from route params
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchBooking(parseInt(id, 10));
        } else {
            this.api.setErrorMessage('Booking ID is required');
        }
    }

    async fetchBooking(id: number): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new QueryBookings({id}));
        if (api.succeeded) {
            this.booking.set(api.response!.results[0]);
        }

        this.api.complete(api.error);
    }

    async save(): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new UpdateBooking(this.booking()));
        if (api.succeeded) {
            this.router.navigate(['/bookings']);
        }

        this.api.complete(api.error);
    }
}
```

[![](/img/pages/templates/angular-spa/angular-booking-edit.webp)](https://angular-spa.web-templates.io/bookings/edit/1)

It shows an example of a validation bound form bounded to a signal instance of a `Booking` DTO with summary and
contextual validation and utilization of your API's metadata with `meta.enumOptions('RoomType')` which populates
the `<select>` drop down with the C# `RoomType` enum values:

```html
<app-page title="Edit Booking">
<form-loading></form-loading>

@if (booking().id) {
<form class="grid gap-4 py-4" (ngSubmit)="save()">
  <input class="hidden" type="submit" />
  <fieldset [disabled]="api.loading()">
  <error-summary except="name,roomType,roomNumber,cost,bookingStartDate,notes" class="mb-4"></error-summary>
    <div class="grid grid-cols-6 gap-6">
        <div class="col-span-6 sm:col-span-3">
            <text-input id="name" name="name" required placeholder="Name for this booking"
                        [(ngModel)]="booking().name"></text-input>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <select-input id="roomType" name="roomType" [options]="meta.enumOptions('RoomType')"
                          [(ngModel)]="booking().roomType"></select-input>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <text-input type="number" id="roomNumber" name="roomNumber" min="0" required
                        [(ngModel)]="booking().roomNumber"></text-input>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <text-input type="number" id="cost" name="cost" min="0" required
                        [(ngModel)]="booking().cost"></text-input>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <text-input type="date" id="bookingStartDate" name="bookingStartDate" required
                        [(ngModel)]="booking().bookingStartDate"></text-input>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <text-input type="date" id="bookingEndDate" name="bookingEndDate"
                        [(ngModel)]="booking().bookingEndDate"></text-input>
        </div>
        <div class="col-span-6">
            <textarea-input id="notes" name="notes" rows="6" placeholder="Notes about this booking"
                            [(ngModel)]="booking().notes"></textarea-input>
        </div>
    </div>
  </fieldset>
  <div class="flex justify-between">
    <div>
        <confirm-delete (delete)="delete()"></confirm-delete>
    </div>
    <div class="flex flex-wrap sm:flex-nowrap gap-4">
        <secondary-button (click)="close()">
            Close
        </secondary-button>
        @if (booking().cancelled) {
        <primary-button type="button" color="green" [disabled]="api.loading()" (click)="cancelBooking(false)">
            Restore Booking
        </primary-button>
        }
        @else {
        <primary-button type="button" color="red" [disabled]="api.loading()" (click)="cancelBooking(true)">
            Cancel Booking
        </primary-button>
        }
        <primary-button type="submit" [disabled]="api.loading()">
            {{ api.loading() ? 'Saving...' : 'Save Booking' }}
        </primary-button>
    </div>
  </div>
</form>
}
@else {
<error-summary></error-summary>
}
</app-page>
```

## Sign In Page

The [signin.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/signin/signin.component.ts)
shows an example of integrating with [auth.service.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/services/auth.service.ts)
to Authenticate a User on the Client and Server:

[![](/img/pages/templates/angular-spa/angular-signin.webp)](https://angular-spa.web-templates.io/signin)

## Sign Up Page

The [signup.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/signup/signup.component.ts)
shows an example of the Identity Auth Sign Up workflow of creating new users with the `Register` API and redirecting to
the [signup-confirm.component.ts](https://github.com/NetCoreTemplates/angular-spa/blob/main/MyApp.Client/src/app/signup/signup-confirm.component.ts)
for Email Confirmation.

[![](/img/pages/templates/angular-spa/angular-register.webp)](https://angular-spa.web-templates.io/signup)
