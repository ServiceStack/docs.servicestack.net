
import { ref, computed } from "vue"
import hljs from "highlight.js"

/*! `dart` grammar compiled for Highlight.js 11.10.0 */
var hljsDart=(()=>{"use strict";return e=>{const n={className:"subst",
variants:[{begin:"\\$[A-Za-z0-9_]+"}]},a={className:"subst",variants:[{
begin:/\$\{/,end:/\}/}],keywords:"true false null this is new super"},t={
className:"string",variants:[{begin:"r'''",end:"'''"},{begin:'r"""',end:'"""'},{
begin:"r'",end:"'",illegal:"\\n"},{begin:'r"',end:'"',illegal:"\\n"},{
begin:"'''",end:"'''",contains:[e.BACKSLASH_ESCAPE,n,a]},{begin:'"""',end:'"""',
contains:[e.BACKSLASH_ESCAPE,n,a]},{begin:"'",end:"'",illegal:"\\n",
contains:[e.BACKSLASH_ESCAPE,n,a]},{begin:'"',end:'"',illegal:"\\n",
contains:[e.BACKSLASH_ESCAPE,n,a]}]};a.contains=[e.C_NUMBER_MODE,t]
;const i=["Comparable","DateTime","Duration","Function","Iterable","Iterator","List","Map","Match","Object","Pattern","RegExp","Set","Stopwatch","String","StringBuffer","StringSink","Symbol","Type","Uri","bool","double","int","num","Element","ElementList"],r=i.map((e=>e+"?"))
;return{name:"Dart",keywords:{
keyword:["abstract","as","assert","async","await","base","break","case","catch","class","const","continue","covariant","default","deferred","do","dynamic","else","enum","export","extends","extension","external","factory","false","final","finally","for","Function","get","hide","if","implements","import","in","interface","is","late","library","mixin","new","null","on","operator","part","required","rethrow","return","sealed","set","show","static","super","switch","sync","this","throw","true","try","typedef","var","void","when","while","with","yield"],
built_in:i.concat(r).concat(["Never","Null","dynamic","print","document","querySelector","querySelectorAll","window"]),
$pattern:/[A-Za-z][A-Za-z0-9_]*\??/},
contains:[t,e.COMMENT(/\/\*\*(?!\/)/,/\*\//,{subLanguage:"markdown",relevance:0
}),e.COMMENT(/\/{3,} ?/,/$/,{contains:[{subLanguage:"markdown",begin:".",
    end:"$",relevance:0}]}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{
className:"class",beginKeywords:"class interface",end:/\{/,excludeEnd:!0,
contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]
},e.C_NUMBER_MODE,{className:"meta",begin:"@[A-Za-z]+"},{begin:"=>"}]}}})();

/*! `fsharp` grammar compiled for Highlight.js 11.10.0 */
var hljsFsharp=(()=>{"use strict";function e(e){
return RegExp(e.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")}function n(e){
return e?"string"==typeof e?e:e.source:null}function t(e){return i("(?=",e,")")}
function i(...e){return e.map((e=>n(e))).join("")}function a(...e){const t=(e=>{
const n=e[e.length-1]
;return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}
})(e);return"("+(t.capture?"":"?:")+e.map((e=>n(e))).join("|")+")"}return n=>{
const r={scope:"keyword",match:/\b(yield|return|let|do|match|use)!/
},o=["bool","byte","sbyte","int8","int16","int32","uint8","uint16","uint32","int","uint","int64","uint64","nativeint","unativeint","decimal","float","double","float32","single","char","string","unit","bigint","option","voption","list","array","seq","byref","exn","inref","nativeptr","obj","outref","voidptr","Result"],s={
keyword:["abstract","and","as","assert","base","begin","class","default","delegate","do","done","downcast","downto","elif","else","end","exception","extern","finally","fixed","for","fun","function","global","if","in","inherit","inline","interface","internal","lazy","let","match","member","module","mutable","namespace","new","of","open","or","override","private","public","rec","return","static","struct","then","to","try","type","upcast","use","val","void","when","while","with","yield"],
literal:["true","false","null","Some","None","Ok","Error","infinity","infinityf","nan","nanf"],
built_in:["not","ref","raise","reraise","dict","readOnlyDict","set","get","enum","sizeof","typeof","typedefof","nameof","nullArg","invalidArg","invalidOp","id","fst","snd","ignore","lock","using","box","unbox","tryUnbox","printf","printfn","sprintf","eprintf","eprintfn","fprintf","fprintfn","failwith","failwithf"],
"variable.constant":["__LINE__","__SOURCE_DIRECTORY__","__SOURCE_FILE__"]},c={
variants:[n.COMMENT(/\(\*(?!\))/,/\*\)/,{contains:["self"]
}),n.C_LINE_COMMENT_MODE]},l={scope:"variable",begin:/``/,end:/``/
},u=/\B('|\^)/,p={scope:"symbol",variants:[{match:i(u,/``.*?``/)},{
    match:i(u,n.UNDERSCORE_IDENT_RE)}],relevance:0},f=({includeEqual:n})=>{let r
;r=n?"!%&*+-/<=>@^|~?":"!%&*+-/<>@^|~?"
;const o=i("[",...Array.from(r).map(e),"]"),s=a(o,/\./),c=i(s,t(s)),l=a(i(c,s,"*"),i(o,"+"))
;return{scope:"operator",match:a(l,/:\?>/,/:\?/,/:>/,/:=/,/::?/,/\$/),
relevance:0}},d=f({includeEqual:!0}),b=f({includeEqual:!1}),m=(e,r)=>({
begin:i(e,t(i(/\s*/,a(/\w/,/'/,/\^/,/#/,/``/,/\(/,/{\|/)))),beginScope:r,
end:t(a(/\n/,/=/)),relevance:0,keywords:n.inherit(s,{type:o}),
contains:[c,p,n.inherit(l,{scope:null}),b]
}),g=m(/:/,"operator"),h=m(/\bof\b/,"keyword"),y={
begin:[/(^|\s+)/,/type/,/\s+/,/[a-zA-Z_](\w|')*/],beginScope:{2:"keyword",
    4:"title.class"},end:t(/\(|=|$/),keywords:s,contains:[c,n.inherit(l,{scope:null
}),p,{scope:"operator",match:/<|>/},g]},E={scope:"computation-expression",
match:/\b[_a-z]\w*(?=\s*\{)/},_={
begin:[/^\s*/,i(/#/,a("if","else","endif","line","nowarn","light","r","i","I","load","time","help","quit")),/\b/],
beginScope:{2:"meta"},end:t(/\s|$/)},v={
variants:[n.BINARY_NUMBER_MODE,n.C_NUMBER_MODE]},w={scope:"string",begin:/"/,
end:/"/,contains:[n.BACKSLASH_ESCAPE]},A={scope:"string",begin:/@"/,end:/"/,
contains:[{match:/""/},n.BACKSLASH_ESCAPE]},S={scope:"string",begin:/"""/,
end:/"""/,relevance:2},C={scope:"subst",begin:/\{/,end:/\}/,keywords:s},O={
scope:"string",begin:/\$"/,end:/"/,contains:[{match:/\{\{/},{match:/\}\}/
},n.BACKSLASH_ESCAPE,C]},x={scope:"string",begin:/(\$@|@\$)"/,end:/"/,
contains:[{match:/\{\{/},{match:/\}\}/},{match:/""/},n.BACKSLASH_ESCAPE,C]},R={
scope:"string",begin:/\$"""/,end:/"""/,contains:[{match:/\{\{/},{match:/\}\}/
},C],relevance:2},k={scope:"string",
match:i(/'/,a(/[^\\']/,/\\(?:.|\d{3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}|U[a-fA-F\d]{8})/),/'/)
};return C.contains=[x,O,A,w,k,r,c,l,g,E,_,v,p,d],{name:"F#",
aliases:["fs","f#"],keywords:s,illegal:/\/\*/,classNameAliases:{
    "computation-expression":"keyword"},contains:[r,{variants:[R,x,O,S,A,w,k]
},c,l,y,{scope:"meta",begin:/\[</,end:/>\]/,relevance:2,contains:[l,S,A,w,k,v]
},h,g,E,_,v,p,d]}}})();

/*! `zig` grammar, Zig isn't included in the highlight.js bundle */
const hljsZig = e => ({
    name: "Zig",
    aliases: ["zig"],
    keywords: {
        keyword: "addrspace align allowzero and anyframe anytype asm async await break callconv catch comptime const continue defer else enum errdefer error export extern fn for if inline linksection noalias noinline nosuspend opaque or orelse packed pub resume return struct suspend switch test threadlocal try union unreachable usingnamespace var volatile while",
        type: "bool void noreturn type anyerror anyopaque comptime_int comptime_float f16 f32 f64 f80 f128 i8 u8 i16 u16 i32 u32 i64 u64 i128 u128 isize usize c_char c_short c_ushort c_int c_uint c_long c_ulong c_longlong c_ulonglong c_longdouble",
        literal: "true false null undefined",
    },
    contains: [
        e.COMMENT("//", "$", { contains: [{ scope: "doctag", begin: "//[!/]" }] }),
        { scope: "string", begin: /\\\\/, end: /$/ },
        e.QUOTE_STRING_MODE,
        { scope: "string", begin: /'/, end: /'/, illegal: /\n/, contains: [e.BACKSLASH_ESCAPE] },
        { scope: "built_in", begin: /@[a-zA-Z_]\w*/ },
        e.C_NUMBER_MODE,
        { scope: "title.function", begin: /\bfn\s+/, end: /[\s(]/, excludeBegin: true, excludeEnd: true },
        { scope: "type", begin: /\b[A-Z]\w*/, relevance: 0 },
    ],
})

/** Languages ServiceStack generates typed DTOs and native API integrations for */
export const langs = {
    csharp:     'C#',
    fsharp:     'F#',
    vbnet:      'VB.NET',
    typescript: 'TypeScript',
    mjs:        'JS',
    python:     'Python',
    php:        'PHP',
    ruby:       'Ruby',
    swift:      'Swift',
    java:       'Java',
    kotlin:     'Kotlin',
    dart:       'Dart',
    go:         'Go',
    rust:       'Rust',
    zig:        'Zig',
}

/** The languages of each platform, in the order they're displayed */
export const langGroups = [
    { name: '.NET',      langs: ['csharp','fsharp','vbnet'] },
    { name: 'Web',       langs: ['typescript','mjs','python','php','ruby'] },
    { name: 'Mobile',    langs: ['swift','java','kotlin','dart'] },
    { name: 'Systems',   langs: ['go','rust','zig'] },
]

/** Every language, ordered so each platform's languages sit next to each other */
export const allLangs = langGroups.flatMap(x => x.langs)

/** Logos with dark ink, inverted so they stay legible on dark backgrounds */
export const monoIcons = []

/** The source file each example is shown in */
export const langFiles = {
    csharp:     'Program.cs',
    fsharp:     'Program.fs',
    vbnet:      'Program.vb',
    typescript: 'main.ts',
    mjs:        'main.mjs',
    python:     'main.py',
    php:        'index.php',
    ruby:       'main.rb',
    swift:      'main.swift',
    java:       'Main.java',
    kotlin:     'Main.kt',
    dart:       'main.dart',
    go:         'main.go',
    rust:       'main.rs',
    zig:        'main.zig',
}

const csharp = `
using ServiceStack;
using MyApp.ServiceModel;

var client = new JsonApiClient(baseUrl);
client.BearerToken = apiKey;

var api = await client.ApiAsync(new ChatCompletion {
    Model = "openai/gpt-oss-120b",
    Messages = [
        new() {
            Role = "user",
            Content = [
                new AiTextContent { 
                    Type = "text", 
                    Text = "Capital of France?" 
                }
            ]
        }
    ]
});
`
const typescript = `
import { JsonServiceClient } from "@servicestack/client"
import { ChatCompletion, AiMessage, AiTextContent } from "./dtos"

const client = new JsonServiceClient(baseUrl)
client.bearerToken = apiKey

const api = await client.api(new ChatCompletion({
    model: "openai/gpt-oss-120b",
    messages: [new AiMessage({
        role: "user",
        content: [
            new AiTextContent({ 
                type: "text", 
                text: "Capital of France?" 
            })
        ]
    })]
}))
`
const mjs = `
import { JsonServiceClient } from "@servicestack/client"
import { ChatCompletion, AiMessage, AiTextContent } from "./dtos.mjs"

const client = new JsonServiceClient(baseUrl)
client.bearerToken = apiKey

const api = await client.api(new ChatCompletion({
    model: "openai/gpt-oss-120b",
    messages: [new AiMessage({
        role: "user",
        content: [
            new AiTextContent({ 
                type: "text", 
                text: "Capital of France?" 
            })
        ]
    })]
}))
`
const python = `
from servicestack import JsonServiceClient
from my_app.dtos import *

client = JsonServiceClient(base_url)
client.bearer_token = api_key

response = client.send(ChatCompletion(
    model="openai/gpt-oss-120b",
    messages=[AiMessage(
        role="user",
        content=[AiTextContent(type="text", text="Capital of France?")]
    )]
))
`
const dart = `
import 'package:servicestack/client.dart';

var client = ClientFactory.api(baseUrl);

var response = await client.send(ChatCompletion()
    ..model = "openai/gpt-oss-120b"
    ..messages = [
        AiMessage()
          ..role = "user"
          ..content = [
              AiTextContent(text: "Capital of France?")..type = "text"
          ]
    ]);
`
const php = `
use ServiceStack\\JsonServiceClient;
use dtos\\ChatCompletion;
use dtos\\AiMessage;
use dtos\\AiTextContent;

$client = new JsonServiceClient(baseUrl);
$client->bearerToken = apiKey;

/** @var {ChatResponse} $response */
$response = $client->send(new ChatCompletion(
    model: "openai/gpt-oss-120b",
    messages: [new AiMessage(
        role: "user",
        content: [
            new AiTextContent(
                type: "text", text: "Capital of France?")
        ]
    )]
));
`
const java = `
import net.servicestack.client.*;

var client = new JsonServiceClient(baseUrl);
client.setBearerToken(apiKey);

var content = new AiTextContent();
content.setType("text");
content.setText("Capital of France?");

var message = new AiMessage();
message.setRole("user");
message.setContent(Utils.createList(content));

var request = new ChatCompletion();
request.setModel("openai/gpt-oss-120b");
request.setMessages(Utils.createList(message));

ChatResponse response = client.send(request);
`
const kotlin = `
package myapp
import net.servicestack.client.*

val client = JsonServiceClient(baseUrl)
client.bearerToken = apiKey

val response = client.send(ChatCompletion().apply {
    model = "openai/gpt-oss-120b"
    messages = arrayListOf(AiMessage().apply {
        role = "user"
        content = arrayListOf<AiContent>(AiTextContent().apply {
            Type = "text"
            text = "Capital of France?"
        })
    })
})
`
const swift = `
import Foundation
import ServiceStack

let client = JsonServiceClient(baseUrl:baseUrl)
client.bearerToken = apiKey

let content = AiTextContent()
content.type = "text"
content.text = "Capital of France?"

let message = AiMessage()
message.role = "user"
message.content = [content]

let request = ChatCompletion()
request.model = "openai/gpt-oss-120b"
request.messages = [message]

let response = try client.send(request)
`
const fsharp = `
open ServiceStack

let client = new JsonApiClient(baseUrl)
client.BearerToken <- apiKey

let response = client.Send(new ChatCompletion(
    Model = "openai/gpt-oss-120b",
    Messages = ResizeArray [
        AiMessage(
            Role = "user",
            Content = ResizeArray<AiContent> [
                AiTextContent(
                    Type = "text", 
                    Text = "Capital of France?") :> AiContent
            ]
        )
    ]))
`
const vbnet = `
Imports ServiceStack

Dim client = New JsonApiClient(baseUrl)
client.BearerToken = apiKey

Dim api = Await client.ApiAsync(New ChatCompletion() With {
    .Model = "openai/gpt-oss-120b",
    .Messages = New List(Of AiMessage) From {
        New AiMessage With {
            .Role = "user",
            .Content = New List(Of AiContent) From {
                New AiTextContent With {
                    .Type = "text",
                    .Text = "Capital of France?"
                }
            }
        }
    }
})
`
const go = `
import (
    ss "github.com/ServiceStack/servicestack-go"
    "myapp/dtos"
)

client := ss.NewClient(baseUrl)
client.SetBearerToken(apiKey)

res, err := ss.Send(client, dtos.ChatCompletion{
    Model: "openai/gpt-oss-120b",
    Messages: []dtos.AiMessage{{
        Role: "user",
        Content: []any{dtos.AiTextContent{
            AiContent: dtos.AiContent{Type: "text"},
            Text:      "Capital of France?",
        }},
    }},
})
`
const rust = `
use servicestack::JsonServiceClient;
use dtos::*;

let mut client = JsonServiceClient::new(base_url);
client.set_bearer_token(api_key);

let res = client.send(&ChatCompletion {
    model: "openai/gpt-oss-120b".to_string(),
    messages: vec![AiMessage {
        role: "user".to_string(),
        content: Some(vec![serde_json::to_value(AiTextContent {
            ai_content: AiContent { r#type: "text".to_string() },
            text: "Capital of France?".to_string(),
        })?]),
        ..Default::default()
    }],
    ..Default::default()
}).await?;
`
const zig = `
const ss = @import("servicestack");
const dtos = @import("dtos.zig");

var client = try ss.JsonServiceClient.init(allocator, base_url);
defer client.deinit();
client.setBearerToken(api_key);

var content = std.json.ObjectMap.init(allocator);
defer content.deinit();
try content.put("type", .{ .string = "text" });
try content.put("text", .{ .string = "Capital of France?" });

const parts = [_]std.json.Value{.{ .object = content }};
const messages = [_]dtos.AiMessage{.{ 
    .role = "user", 
    .content = parts[0..] 
}};

var res = try client.send(dtos.ChatCompletion{
    .model = "openai/gpt-oss-120b",
    .messages = messages[0..],
});
defer res.deinit();
`
const ruby = `
require 'servicestack'
require_relative 'dtos'

client = ServiceStack::JsonServiceClient.new(base_url)
client.bearer_token = api_key

response = client.send(ChatCompletion.new(
  model: 'openai/gpt-oss-120b',
  messages: [AiMessage.new(
    role: 'user',
    content: [
        AiTextContent.new(
            type: 'text', 
            text: "Capital of France?")
    ]
  )]
))
`

export const openAi = (() => {
    hljs.registerLanguage('dart', hljsDart)
    hljs.registerLanguage('fsharp', hljsFsharp)
    hljs.registerLanguage('zig', hljsZig)

    const ret = {
        code: {
            csharp,
            fsharp,
            vbnet,
            typescript,
            mjs,
            python,
            php,
            ruby,
            swift,
            java,
            kotlin,
            dart,
            go,
            rust,
            zig,
        },
        html: {}
    }

    Object.keys(ret.code).forEach(lang => {
        const language = lang === 'mjs' ? 'javascript' : lang
        const code = ret.code[lang].replace(/^\n|\n$/g, '')
        const html = hljs.getLanguage(language)
            ? hljs.highlight(code, { language }).value
            : code.replace(/[&<>"']/g, ch => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[ch])

        // Highlight each example up front instead of relying on the page-level
        // highlightAll() pass, which only runs for the initially selected language.
        ret.html[lang] = `<pre><code class="hljs language-${language}">${html}\n</code></pre>`
    })

    return ret
})()

export default {
    template:`
  <div class="mx-auto max-w-7xl px-6 lg:px-8">

    <p class="mx-auto max-w-3xl text-balance text-center text-xl leading-8 text-gray-600 dark:text-gray-300 sm:text-2xl">
      <b class="text-gray-900 dark:text-gray-100">{{langCount}} languages</b>, one API.
      End-to-end typed APIs for the world's most popular languages
    </p>

    <div class="mx-auto mt-14 flex flex-wrap justify-center gap-x-12 gap-y-10">
      <div v-for="group in langGroups" :key="group.name" class="flex flex-col gap-y-3">
        <div class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {{group.name}}
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <div v-for="lang in group.langs" :key="lang" @click="selectLanguage(lang)" :title="'Usage from ' + langs[lang]"
              :class="['group flex w-30 cursor-pointer select-none flex-col items-center justify-center gap-y-3 rounded-xl px-2 py-5 ring-1 transition',
                lang == selectedLang
                  ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600 dark:bg-indigo-950 dark:text-indigo-200'
                  : 'bg-white text-gray-600 ring-gray-200 hover:text-gray-900 hover:ring-indigo-400 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800 dark:hover:ring-indigo-400']">
            <img :src="'/img/langs/' + lang + '.svg'" :alt="langs[lang]" :class="iconClass(lang, lang == selectedLang, 'h-10')">
            <span class="text-sm font-semibold">{{langs[lang]}}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
      Feature-rich JSON Client library utilizing Native Typed DTOs for each language - a consistent API across all platforms.
    </p>

    <div class="mx-auto mt-20 grid max-w-2xl grid-cols-1 items-start gap-x-12 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-12">
      <div class="lg:col-span-5 lg:pr-4 lg:pt-4">

        <slot></slot>

      </div>
      <div class="lg:col-span-7">

        <nav class="mt-6 mb-4 flex" aria-label="Breadcrumb">
          <ol role="list" class="flex flex-wrap items-center gap-y-2 space-x-4">
            <li>
              <div>
                <a :href="(baseUrl ?? '') + '/ui/ChatCompletion?tab=code&lang=' + selectedLang" class="text-sm font-medium text-gray-500 hover:text-gray-700" aria-current="page">
                    Usage from {{langs[selectedLang]}}
                </a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a :href="(baseUrl ?? '') + '/ui/ChatCompletion?tab=details'" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    API Explorer Docs
                </a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a href="/chat" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    About AI Chat
                </a>
              </div>
            </li>
          </ol>
        </nav>

        <div class="overflow-hidden rounded-xl bg-[#1e1e2e] shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
          <div class="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div class="flex items-center gap-x-2">
              <img :src="'/img/langs/' + selectedLang + '.svg'" :alt="langs[selectedLang]" :class="iconClass(selectedLang, true, 'h-4')">
              <span class="text-xs font-semibold text-gray-200">{{langs[selectedLang]}}</span>
              <span class="font-mono text-xs text-gray-500">{{langFiles[selectedLang]}}</span>
            </div>
            <button type="button" @click="copy" class="rounded px-1.5 py-0.5 text-xs font-medium text-gray-400 hover:text-gray-200">
              {{copied ? 'Copied' : 'Copy'}}
            </button>
          </div>
          <div v-html="openAi.html[selectedLang]"></div>
        </div>

        </div>
    </div>

  </div>`,
    props: {
        baseUrl:String,
        routes:Object,
    },
    setup(props) {
        const copied = ref(false)
        const selectedLang = computed(() => langs[props.routes?.lang] ? props.routes.lang : 'csharp')

        function selectLanguage(lang) {
            if (!langs[lang] || lang === selectedLang.value) return

            // Keep the current post/whatsnew route and change only its language query.
            // v-href resolves against the site's content route, which sends embedded
            // whatsnew components back to the home page.
            const url = new URL(window.location.href)
            url.searchParams.set('lang', lang)
            history.pushState(null, '', url)
            if (props.routes) props.routes.lang = lang
        }

        async function copy() {
            await navigator.clipboard.writeText(openAi.code[selectedLang.value].trim())
            copied.value = true
            setTimeout(() => copied.value = false, 2000)
        }

        // The Go logo is a wide wordmark, the rest of the logos are square
        function iconClass(lang, onDark, size) {
            const h = size ?? 'h-10'
            const w = h === 'h-4' ? (lang === 'go' ? 'w-6' : 'w-4') : (lang === 'go' ? 'w-14' : 'w-10')
            return ['object-contain', h, w,
                monoIcons.includes(lang) ? (onDark ? 'invert' : 'dark:invert') : '']
        }

        return { langs, langGroups, langFiles, langCount:Object.keys(langs).length,
                 openAi, selectedLang, copied, copy, iconClass, selectLanguage }
    }
}
