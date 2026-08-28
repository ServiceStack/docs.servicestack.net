import { computed } from "vue"
import DtoValueDeck from "./DtoValueDeck.mjs"

/**
 * "One contract, everything else generated" - the shared deck used by /why-servicestack
 * and /servicify. The contract and slides are identical on every page; only the framing
 * (eyebrow/title/description and the contract pane's label) changes per page.
 */

const contract = {
    label: 'Your Request DTO',
    badge: '1 POCO · 25 lines',
    lang: 'csharp',
    code: `[Tag("Bookings")]
[Description("Create a new Booking")]
[Notes("Only Employees can create Bookings")]
[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking
    : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; }

    public RoomType RoomType { get; set; }

    [ValidateGreaterThan(0)]
    public int RoomNumber { get; set; }

    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }

    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }

    [Input(Type = "textarea")]
    public string Notes { get; set; }
}`,
}

const slides = [
    {
        name: 'REST API', icon: '⇄', title: 'A working, RESTful API', cost: 'No Service impl',
        kicker: 'Implemented for you',
        focus: ['public class CreateBooking', ': ICreateDb<Booking>'],
        description: '`ICreateDb<Booking>` tells ServiceStack this message creates a `Booking`, so AutoQuery CRUD implements the Service. You get a pre-defined route immediately, and can add any custom route you prefer without changing a consumer.',
        code: {
            label: 'HTTP', lang: 'http',
            code: `POST /api/CreateBooking HTTP/1.1
Content-Type: application/json

{ "name": "Team Offsite", "roomType": "Suite",
  "roomNumber": 12, "cost": 250,
  "bookingStartDate": "2026-09-04" }

HTTP/1.1 200 OK
{ "id": 34 }`,
        },
        items: [
            { title: 'Pre-defined routes', text: 'Every API is callable at `/api/{Request}`' },
            { title: 'Content negotiation', text: 'JSON, CSV, JSONL, Protobuf, MessagePack, XML, SOAP and a human-friendly HTML view, all for free' },
        ],
        href: '/autoquery/crud', linkText: 'AutoQuery CRUD',
    },
    {
        name: 'Validation', icon: '✓', title: 'Validation enforced everywhere', cost: '3 attributes',
        kicker: 'Declared on the contract',
        focus: ['[ValidateNotEmpty]', '[ValidateGreaterThan(0)]'],
        description: 'Rules like `[ValidateNotEmpty]` and `[ValidateGreaterThan(0)]` live on the message, not in a handler, so every consumer sees the same truth: the server enforces them, the generated UIs pre-validate against them, and the OpenAPI spec documents them.',
        code: {
            label: 'Structured error response', lang: 'json',
            code: `{
  "responseStatus": {
    "errorCode": "GreaterThan",
    "message": "'Cost' must be greater than '0'.",
    "errors": [{
      "errorCode": "NotEmpty",
      "fieldName": "Name",
      "message": "'Name' must not be empty."
    }]
  }
}`,
        },
        items: [
            { title: 'One consistent shape', text: 'every typed client parses the same `ResponseStatus` into idiomatic errors' },
            { title: 'Editable at runtime', text: 'add or change rules in the Admin UI without a redeploy' },
        ],
        href: '/declarative-validation', linkText: 'Declarative Validation',
    },
    {
        name: 'Auth', icon: 'ID', title: 'Authorization on every path in', cost: '1 attribute',
        kicker: 'Enforced before your code runs',
        focus: ['[ValidateHasRole("Employee")]'],
        description: '`[ValidateHasRole("Employee")]` is attached to the message, so it holds no matter how the message arrives - an HTTP call, a queued MQ message, a gRPC request, an auto-batched array or an AI tool call. There is no second policy to keep in sync.',
        items: [
            { title: 'Identity Auth, API Keys & JWT', text: 'the same declarative attributes work across all of them' },
            { title: 'Applies to AI too', text: 'a model calling this API can never do anything the signed-in user could not do themselves' },
            { title: 'Visible in every UI', text: 'API Explorer, Locode and the generated forms only show what the current user may call' },
        ],
        href: '/auth/', linkText: 'Authentication & Authorization',
    },
    {
        name: 'API Explorer', icon: '▷', title: 'An executable API Explorer UI', cost: '0 lines',
        kicker: 'Generated at runtime',
        focus: ['[Tag("Bookings")]', '[Description(', '[Notes('],
        description: 'Your `[Description]`, `[Tag]` and `[Notes]` metadata becomes a browsable, executable workbench for every API - with a form built from the DTO, live request inspection and ready-to-paste code samples in each supported language.',
        img: { src: '/img/pages/admin-ui/carousel/api-explorer.webp', alt: 'API Explorer', w: 2130, h: 1413 },
        href: '/api-explorer', linkText: 'API Explorer',
    },
    {
        name: 'JSON Schema', icon: '{}', title: 'A portable JSON Schema & OpenAPI spec', cost: '0 lines',
        kicker: 'Published by your App',
        focus: ['public string Name', 'public RoomType RoomType', 'public int RoomNumber', 'public decimal Cost', 'public DateTime'],
        description: 'Every API publishes its contract at `/schema/CreateBooking.json` - a portable document any tool can consume - while `/schema/CreateBooking` renders that same schema as a complete executable UI. The properties are the schema; there is nothing to annotate twice.',
        img: { src: '/img/pages/api-schema/api-schema-query-bookings.webp', alt: 'API Schema UI', w: 2560, h: 1440 },
        items: [
            { title: 'Accurate OpenAPI v3', text: 'routes, verbs, types, constraints and docs, generated from the same metadata' },
        ],
        href: '/api-schema', linkText: 'API Schemas',
    },
    {
        name: 'CRUD App', icon: '▦', title: 'An authorized CRUD App', cost: '0 screens',
        kicker: 'Forms built from the contract',
        focus: ['[Input(Type = "textarea")]', 'public RoomType RoomType', '[ValidateNotEmpty]'],
        description: 'Locode renders a complete management App over your data model - grid, filters, paging, reference lookups and guarded deletes - with the create and edit forms laid out from this DTO. A `RoomType` enum becomes a select, and an `[Input]` hint is all it takes to override a field.',
        img: { src: '/img/pages/autoquery-schema/create-booking.webp', alt: 'Generated Create Booking form', w: 1600, h: 900 },
        href: '/locode/', linkText: 'Locode',
    },
    {
        name: 'Typed clients', icon: '15', title: 'Native typed clients in 15 languages', cost: '0 SDK repos',
        kicker: 'The contract is the SDK',
        description: 'One `npx get-dtos` run generates a single native source file of DTOs plus an idiomatic Service Client that already understands the response type, route, verb, auth and error shape. Re-run it when the API changes and removed or renamed members become compile errors in the consuming App instead of runtime surprises.',
        chips: { label: 'Generated for', values: ['C#', 'F#', 'VB.NET', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'Ruby', 'Java', 'Kotlin', 'Swift', 'Dart', 'Go', 'Rust', 'Zig'] },
        code: {
            label: 'npx get-dtos typescript https://your-api.com', lang: 'typescript',
            code: `const client = new JsonServiceClient(baseUrl)

const { id } = await client.post(new CreateBooking({
    name: 'Team Offsite',
    roomType: RoomType.Suite,
    roomNumber: 12,
    cost: 250,
}))`,
        },
        href: '/add-servicestack-reference', linkText: 'Add ServiceStack Reference',
    },
    {
        name: 'Any transport', icon: '⇉', title: 'The same Service over any transport', cost: '0 rewrites',
        kicker: 'Decoupled from HTTP',
        focus: ['public class CreateBooking', 'IReturn<IdResponse>'],
        description: 'Because the Service accepts a message rather than HTTP primitives, anything that can carry the message can invoke it - and `IReturn<IdResponse>` keeps the response typed on every one of them. The implementation does not change when the transport does.',
        items: [
            { title: 'HTTP & gRPC', text: 'REST-ful routes and gRPC endpoints from one implementation' },
            { title: 'Message queues', text: 'host it as an MQ consumer on Rabbit MQ, Redis MQ, SQS, Azure Service Bus or in-memory' },
            { title: 'Auto-batching', text: 'clients can send an array of these messages in a single call, with no extra server code' },
            { title: 'In-process', text: 'call it directly through the `IServiceGateway` - no serialization, no network hop' },
        ],
        href: '/messaging', linkText: 'Messaging',
    },
    {
        name: 'AI tools', icon: 'AI', title: 'An AI-callable tool, safely', cost: '0 tool definitions',
        kicker: 'No parallel AI backend',
        focus: ['[Description(', '[Notes(', '[ValidateHasRole("Employee")]'],
        description: 'The description and notes that documented this API for humans also let a model discover it, load its exact schema just-in-time and call it as the signed-in user. Because it runs through your normal pipeline, your auth, validation and business logic all still apply.',
        items: [
            { title: 'Discoverable', text: '`api_search` ranks candidates from metadata you already publish, so the whole API surface never enters the context window' },
            { title: 'Human approval', text: '`api_call` routes consequential requests into editable forms, generated from the same schema API Explorer uses' },
            { title: 'MCP included', text: 'expose the same approved APIs to external AI Assistants over the Model Context Protocol' },
        ],
        href: '/chat/api-tools', linkText: 'API Tools',
    },
    {
        name: 'Analytics', icon: '▤', title: 'Analytics, logs and audit history', cost: '1 attribute',
        kicker: 'Observable by default',
        focus: ['[AutoApply(Behavior.AuditCreate)]'],
        description: '`[AutoApply(Behavior.AuditCreate)]` stamps who created each row and when. Alongside it, every call to this API is logged, profiled and charted per user, API Key and IP - with no external service to wire up and nothing to instrument by hand.',
        img: { src: '/img/pages/admin-ui/carousel/analytics.webp', alt: 'API Analytics', w: 1704, h: 1131 },
        items: [
            { title: 'Executable audit history', text: 'inspect and replay what changed, from the Admin UI' },
        ],
        href: '/admin-ui-analytics', linkText: 'API Analytics',
    },
]

export default {
    components: { DtoValueDeck },
    props: {
        eyebrow: { type: String, default: 'The multiplier, one slide at a time' },
        title: { type: String, default: 'What a single Request DTO is worth' },
        description: { type: String, default: 'That one contract is the entire input. Step through what ServiceStack generates from it - each slide highlights the part of the DTO responsible and the capabilities it enables.' },
        contractLabel: { type: String, default: contract.label },
        contractBadge: { type: String, default: contract.badge },
    },
    template: `<DtoValueDeck :eyebrow="eyebrow" :title="title" :description="description"
        :contract="deckContract" :slides="slides" />`,
    setup(props) {
        const deckContract = computed(() => ({ ...contract, label: props.contractLabel, badge: props.contractBadge }))
        return { deckContract, slides }
    },
}
