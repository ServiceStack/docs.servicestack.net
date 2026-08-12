import { computed as f, inject as Pe, defineComponent as ge, openBlock as o, createElementBlock as u, mergeProps as Se, withModifiers as Ee, renderSlot as G, ref as M, shallowRef as Wl, nextTick as jt, isRef as aa, unref as ne, provide as It, watchEffect as rl, normalizeClass as b, createElementVNode as s, createCommentVNode as k, toDisplayString as L, h as Rt, resolveComponent as N, createBlock as W, withCtx as we, useAttrs as Ro, createVNode as ve, createTextVNode as pe, normalizeStyle as Un, createStaticVNode as nn, Fragment as he, renderList as be, withDirectives as Ot, vModelCheckbox as Kn, withKeys as sn, vModelSelect as Ho, markRaw as qo, useSlots as ml, getCurrentInstance as Fe, onMounted as ze, createSlots as Qn, normalizeProps as Zl, guardReactiveProps as Xl, vModelDynamic as zo, onUnmounted as Jt, watch as lt, vModelText as oa, resolveDynamicComponent as ra, resolveDirective as Uo, reactive as ia, Teleport as ua } from "vue";
import { lastRightPart as Kt, leftPart as an, toDate as xt, map as qe, mapGet as me, toCamelCase as Ko, toDateTime as Qo, chop as Jo, isDate as on, dateFmt as Go, fromXsdDuration as da, timeFmt12 as Wo, omit as bt, appendQueryString as il, indexOfAny as Zo, apiValue as Xo, enc as Ln, createBus as Yo, toKebabCase as Bs, toTime as _o, lastLeftPart as ca, setQueryString as er, ApiResult as tt, nameOf as tr, ResponseStatus as kn, ResponseError as Es, sanitize as lr, errorResponseExcept as nr, humanize as je, delaySet as fa, rightPart as zl, queryString as Vn, combinePaths as sr, toPascalCase as pt, errorResponse as $t, trimEnd as ar, $1 as Yl, HttpMethods as Jn, omitEmpty as or, uniqueKeys as _l, humanify as Sl, each as rr, JsonServiceClient as ir } from "@servicestack/client";
const ma = "png,jpg,jpeg,jfif,gif,svg,webp".split(","), va = {
  img: "png,jpg,jpeg,gif,svg,webp,png,jpg,jpeg,gif,bmp,tif,tiff,webp,ai,psd,ps".split(","),
  vid: "avi,m4v,mov,mp4,mpg,mpeg,wmv,webm".split(","),
  aud: "mp3,mpa,ogg,wav,wma,mid,webm".split(","),
  ppt: "key,odp,pps,ppt,pptx".split(","),
  xls: "xls,xlsm,xlsx,ods,csv,tsv".split(","),
  doc: "doc,docx,pdf,rtf,tex,txt,md,rst,xls,xlsm,xlsx,ods,key,odp,pps,ppt,pptx".split(","),
  zip: "zip,tar,gz,7z,rar,gzip,deflate,br,iso,dmg,z,lz,lz4,lzh,s7z,apl,arg,jar,war".split(","),
  exe: "exe,bat,sh,cmd,com,app,msi,run,vb,vbs,js,ws,wsh".split(","),
  att: "bin,oct,dat".split(",")
  //attachment
}, Ds = Object.keys(va), kt = (e, t) => `<svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' preserveAspectRatio='xMidYMid meet' viewBox='${e}'>${t}</svg>`, Ul = {
  img: kt("4 4 16 16", "<path fill='currentColor' d='M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-2 0H6v6.38l2.19-2.19l5.23 5.23l1-1a1.59 1.59 0 0 1 2.11.11L18 16V6zm-5 3.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0z'/>"),
  vid: kt("0 0 24 24", "<path fill='currentColor' d='m14 2l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8m4 18V9h-5V4H6v16h12m-2-2l-2.5-1.7V18H8v-5h5.5v1.7L16 13v5Z'/>"),
  aud: kt("0 0 24 24", "<path fill='currentColor' d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm10-9h-4v3.88a2.247 2.247 0 0 0-3.5 1.87c0 1.24 1.01 2.25 2.25 2.25S13 17.99 13 16.75V13h3v-2z'/>"),
  ppt: kt("0 0 48 48", "<g fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'><path d='M4 8h40'/><path d='M8 8h32v26H8V8Z' clip-rule='evenodd'/><path d='m22 16l5 5l-5 5m-6 16l8-8l8 8'/></g>"),
  xls: kt("0 0 256 256", "<path fill='currentColor' d='M200 26H72a14 14 0 0 0-14 14v26H40a14 14 0 0 0-14 14v96a14 14 0 0 0 14 14h18v26a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V40a14 14 0 0 0-14-14Zm-42 76h44v52h-44Zm44-62v50h-44V80a14 14 0 0 0-14-14h-2V38h58a2 2 0 0 1 2 2ZM70 40a2 2 0 0 1 2-2h58v28H70ZM38 176V80a2 2 0 0 1 2-2h104a2 2 0 0 1 2 2v96a2 2 0 0 1-2 2H40a2 2 0 0 1-2-2Zm32 40v-26h60v28H72a2 2 0 0 1-2-2Zm130 2h-58v-28h2a14 14 0 0 0 14-14v-10h44v50a2 2 0 0 1-2 2ZM69.2 148.4L84.5 128l-15.3-20.4a6 6 0 1 1 9.6-7.2L92 118l13.2-17.6a6 6 0 0 1 9.6 7.2L99.5 128l15.3 20.4a6 6 0 0 1-9.6 7.2L92 138l-13.2 17.6a6 6 0 1 1-9.6-7.2Z'/>"),
  doc: kt("0 0 32 32", "<path fill='currentColor' d='M26 30H11a2.002 2.002 0 0 1-2-2v-6h2v6h15V6h-9V4h9a2.002 2.002 0 0 1 2 2v22a2.002 2.002 0 0 1-2 2Z'/><path fill='currentColor' d='M17 10h7v2h-7zm-1 5h8v2h-8zm-1 5h9v2h-9zm-6-1a5.005 5.005 0 0 1-5-5V3h2v11a3 3 0 0 0 6 0V5a1 1 0 0 0-2 0v10H8V5a3 3 0 0 1 6 0v9a5.005 5.005 0 0 1-5 5z'/>"),
  zip: kt("0 0 16 16", "<g fill='currentColor'><path d='M6.5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.109 0l-.93-.62a1 1 0 0 1-.415-1.074l.4-1.599V7.5zm2 0h-1v.938a1 1 0 0 1-.03.243l-.4 1.598l.93.62l.93-.62l-.4-1.598a1 1 0 0 1-.03-.243V7.5z'/><path d='M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm5.5-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9v1H8v1h1v1H8v1h1v1H7.5V5h-1V4h1V3h-1V2h1V1z'/></g>"),
  exe: kt("0 0 16 16", "<path fill='currentColor' fill-rule='evenodd' d='M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM2.575 15.202H.785v-1.073H2.47v-.606H.785v-1.025h1.79v-.648H0v3.999h2.575v-.647ZM6.31 11.85h-.893l-.823 1.439h-.036l-.832-1.439h-.931l1.227 1.983l-1.239 2.016h.861l.853-1.415h.035l.85 1.415h.908l-1.254-1.992L6.31 11.85Zm1.025 3.352h1.79v.647H6.548V11.85h2.576v.648h-1.79v1.025h1.684v.606H7.334v1.073Z'/>"),
  att: kt("0 0 24 24", "<path fill='currentColor' d='M14 0a5 5 0 0 1 5 5v12a7 7 0 1 1-14 0V9h2v8a5 5 0 0 0 10 0V5a3 3 0 1 0-6 0v12a1 1 0 1 0 2 0V6h2v11a3 3 0 1 1-6 0V5a5 5 0 0 1 5-5Z'/>")
}, ur = /[\r\n%#()<>?[\\\]^`{|}]/g, Ns = 1024, dr = ["Bytes", "KB", "MB", "GB", "TB"], cr = (() => {
  const e = "application/", t = e + "vnd.openxmlformats-officedocument.", l = "image/", n = "text/", a = "audio/", d = "video/", i = {
    jpg: l + "jpeg",
    tif: l + "tiff",
    svg: l + "svg+xml",
    ico: l + "x-icon",
    ts: n + "typescript",
    py: n + "x-python",
    sh: n + "x-sh",
    mp3: a + "mpeg3",
    mpg: d + "mpeg",
    ogv: d + "ogg",
    xlsx: t + "spreadsheetml.sheet",
    xltx: t + "spreadsheetml.template",
    docx: t + "wordprocessingml.document",
    dotx: t + "wordprocessingml.template",
    pptx: t + "presentationml.presentation",
    potx: t + "presentationml.template",
    ppsx: t + "presentationml.slideshow",
    mdb: e + "vnd.ms-access"
  };
  function r(v, m) {
    v.split(",").forEach((h) => i[h] = m);
  }
  function c(v, m) {
    v.split(",").forEach((h) => i[h] = m(h));
  }
  return c("jpeg,gif,png,tiff,bmp,webp", (v) => l + v), c("jsx,csv,css", (v) => n + v), c("aac,ac3,aiff,m4a,m4b,m4p,mid,midi,wav", (v) => a + v), c("3gpp,avi,dv,divx,ogg,mp4,webm", (v) => d + v), c("rtf,pdf", (v) => e + v), r("htm,html,shtm", n + "html"), r("js,mjs,cjs", n + "javascript"), r("yml,yaml", e + "yaml"), r("bat,cmd", e + "bat"), r("xml,csproj,fsproj,vbproj", n + "xml"), r("txt,ps1", n + "plain"), r("qt,mov", d + "quicktime"), r("doc,dot", e + "msword"), r("xls,xlt,xla", e + "excel"), r("ppt,oit,pps,ppa", e + "vnd.ms-powerpoint"), r("cer,crt,der", e + "x-x509-ca-cert"), r("gz,tgz,zip,rar,lzh,z", e + "x-compressed"), r("aaf,aca,asd,bin,cab,chm,class,cur,db,dat,deploy,dll,dsp,exe,fla,ics,inf,mix,msi,mso,obj,ocx,prm,prx,psd,psp,qxd,sea,snp,so,sqlite,toc,ttf,u32,xmp,xsn,xtp", e + "octet-stream"), i;
})();
let Mn = [];
function pa(e) {
  return e = e.replace(/"/g, "'"), e = e.replace(/>\s+</g, "><"), e = e.replace(/\s{2,}/g, " "), e.replace(ur, encodeURIComponent);
}
function Gn(e) {
  return "data:image/svg+xml;utf8," + pa(e);
}
function ga(e) {
  let t = URL.createObjectURL(e);
  return Mn.push(t), t;
}
function ya() {
  Mn.forEach((e) => {
    try {
      URL.revokeObjectURL(e);
    } catch (t) {
      console.error("URL.revokeObjectURL", t);
    }
  }), Mn = [];
}
function Wn(e) {
  if (!e) return null;
  let t = an(e, "?");
  return Kt(t, "/");
}
function Ol(e) {
  let t = Wn(e);
  return t == null || t.indexOf(".") === -1 ? null : Kt(t, ".").toLowerCase();
}
function Zn(e) {
  let t = Ol(e.name);
  return t && ma.indexOf(t) >= 0 ? ga(e) : Ht(e.name);
}
function Xn(e) {
  if (!e) return !1;
  if (e.startsWith("blob:") || e.startsWith("data:"))
    return !0;
  let t = Ol(e);
  return t && ma.indexOf(t) >= 0 || !1;
}
function Ht(e) {
  if (!e) return null;
  let t = Ol(e);
  return t == null || Xn(e) ? e : kl(t) || Gn(Ul.doc);
}
function kl(e) {
  let t = ha(e);
  return t && Gn(t) || null;
}
function ha(e) {
  if (Ul[e])
    return Ul[e];
  for (let t = 0; t < Ds.length; t++) {
    let l = Ds[t];
    if (va[l].indexOf(e) >= 0)
      return Ul[l];
  }
  return null;
}
function Yn(e, t = 2) {
  if (e === 0) return "0 Bytes";
  const l = t < 0 ? 0 : t, n = Math.floor(Math.log(e) / Math.log(Ns));
  return parseFloat((e / Math.pow(Ns, n)).toFixed(l)) + " " + dr[n];
}
function fr(e) {
  return e.files && Array.from(e.files).map((t) => ({ fileName: t.name, contentLength: t.size, filePath: Zn(t) }));
}
function rn(e, t) {
  e.onerror = null, e.src = _n(e.src, t) || "";
}
function _n(e, t) {
  return kl(Kt(e, ".").toLowerCase()) || (t ? kl(t) || t : null) || kl("doc");
}
function An(e) {
  if (!e)
    throw new Error("fileNameOrExt required");
  const t = Kt(e, ".").toLowerCase();
  return cr[t] || "application/" + t;
}
function mr() {
  return {
    extSvg: ha,
    extSrc: kl,
    getExt: Ol,
    encodeSvg: pa,
    canPreview: Xn,
    getFileName: Wn,
    getMimeType: An,
    formatBytes: Yn,
    filePathUri: Ht,
    svgToDataUri: Gn,
    fileImageUri: Zn,
    objectUrl: ga,
    flush: ya,
    inputFiles: fr,
    iconOnError: rn,
    iconFallbackSrc: _n
  };
}
class vr {
  view;
  includeTypes;
  constructor(t) {
    Object.assign(this, t);
  }
  getTypeName() {
    return "MetadataApp";
  }
  getMethod() {
    return "GET";
  }
  createResponse() {
    return {};
  }
}
const ul = "/metadata/app.json", pr = {
  Boolean: "checkbox",
  DateTime: "date",
  DateOnly: "date",
  DateTimeOffset: "date",
  TimeSpan: "time",
  TimeOnly: "time",
  Byte: "number",
  Short: "number",
  Int64: "number",
  Int32: "number",
  UInt16: "number",
  UInt32: "number",
  UInt64: "number",
  Single: "number",
  Double: "number",
  Decimal: "number",
  String: "text",
  Guid: "text",
  Uri: "text"
}, gr = {
  number: "Int32",
  checkbox: "Boolean",
  date: "DateTime",
  "datetime-local": "DateTime",
  time: "TimeSpan"
}, Tn = {
  Byte: "byte",
  Int16: "short",
  Int32: "int",
  Int64: "long",
  UInt16: "ushort",
  Unt32: "uint",
  UInt64: "ulong",
  Single: "float",
  Double: "double",
  Decimal: "decimal"
};
[...Object.keys(Tn), ...Object.values(Tn)];
const yr = {
  String: "string",
  Boolean: "bool",
  ...Tn
};
function Dl(e) {
  return yr[e] || e;
}
function ba(e, t) {
  return e ? (t || (t = []), e === "Nullable`1" ? Dl(t[0]) + "?" : e.endsWith("[]") ? `List<${Dl(e.substring(0, e.length - 2))}>` : t.length === 0 ? Dl(e) : an(Dl(e), "`") + "<" + t.join(",") + ">") : "";
}
function hr(e) {
  return e && ba(e.name, e.genericArgs);
}
class At {
  Query;
  QueryInto;
  Create;
  Update;
  Patch;
  Delete;
  get AnyQuery() {
    return this.Query || this.QueryInto;
  }
  get AnyUpdate() {
    return this.Patch || this.Update;
  }
  get dataModel() {
    return this.AnyQuery?.dataModel;
  }
  toArray() {
    return [this.Query, this.QueryInto, this.Create, this.Update, this.Patch, this.Delete].filter((l) => !!l).map((l) => l);
  }
  get empty() {
    return !this.Query && !this.QueryInto && !this.Create && !this.Update && !this.Patch && !this.Delete;
  }
  add(t) {
    He.isQueryInto(t) && !this.QueryInto ? this.QueryInto = t : He.isQuery(t) && !this.Query ? this.Query = t : He.isCreate(t) && !this.Create ? this.Create = t : He.isUpdate(t) && !this.Update ? this.Update = t : He.isPatch(t) && !this.Patch ? this.Patch = t : He.isDelete(t) && !this.Delete && (this.Delete = t);
  }
  static from(t) {
    const l = new At();
    return t.forEach((n) => {
      l.add(n);
    }), l;
  }
  static forType(t, l) {
    let n = new At();
    if (ee.config.apisResolver && t) {
      const a = ee.config.apisResolver(t, l);
      a && (n.Query = a.Query, n.QueryInto = a.QueryInto, n.Create = a.Create, n.Update = a.Update, n.Patch = a.Patch, n.Delete = a.Delete);
    }
    return t && (l ??= ee.metadata.value?.api, l?.operations.forEach((a) => {
      a.dataModel?.name == t && n.add(a);
    })), n;
  }
  /** Build a type context bundle for AQ components */
  static createContext(t) {
    const l = t.id || "AutoQueryGrid";
    let n = t.type;
    const a = sl(t.apis);
    !n && t.apis && a.length > 0 && (n = Ut(a[0])?.dataModel?.name);
    const d = t.metadataApi ?? ee.metadata.value?.api, i = t.filterDefinitions ?? (ee.metadata.value?.plugins?.autoQuery?.viewerConventions || ja), r = Gt(n);
    console.log("createContext", l, n, t.apis, r, a);
    const c = a.length > 0 ? At.from(a.map((C) => Ut(C)).filter((C) => C != null).map((C) => C)) : At.forType(r, d), v = r || c.AnyQuery?.dataModel?.name, m = v ?? "", h = nt(v), y = ot(h), g = nt(v), p = ot(g), x = vl(g), w = a.map((C) => Ut(C) == null ? C : null).filter((C) => C != null);
    return {
      typeName: r,
      dataModel: g,
      dataModelName: v,
      viewModel: h,
      viewModelProps: y,
      dataModelProps: p,
      dataModelPrimaryKey: x,
      apis: c,
      opNames: a,
      invalidApis: w,
      metadataApi: d,
      filterDefinitions: i,
      prefsCacheKey: () => `${l}/ApiPrefs/${m}`,
      columnCacheKey: (C) => `Column/${l}:${m}.${C}`
    };
  }
}
const He = {
  Create: "ICreateDb`1",
  Update: "IUpdateDb`1",
  Patch: "IPatchDb`1",
  Delete: "IDeleteDb`1",
  AnyRead: ["QueryDb`1", "QueryDb`2"],
  AnyWrite: ["ICreateDb`1", "IUpdateDb`1", "IPatchDb`1", "IDeleteDb`1"],
  isAnyQuery: (e) => qe(e.request.inherits, (t) => He.AnyRead.indexOf(t.name) >= 0),
  isQuery: (e) => qe(e.request.inherits, (t) => t.name === "QueryDb`1"),
  isQueryInto: (e) => qe(e.request.inherits, (t) => t.name === "QueryDb`2"),
  isCrud: (e) => e.request.implements?.some((t) => He.AnyWrite.indexOf(t.name) >= 0),
  isCreate: (e) => Nl(e, He.Create),
  isUpdate: (e) => Nl(e, He.Update),
  isPatch: (e) => Nl(e, He.Patch),
  isDelete: (e) => Nl(e, He.Delete),
  model: (e) => e ? qe(e.inherits, (t) => He.AnyRead.indexOf(t.name) >= 0) ? e.inherits?.genericArgs[0] : e.implements?.find((t) => He.AnyWrite.indexOf(t.name) >= 0)?.genericArgs[0] : null
};
function br(e) {
  return e.input?.type || un(es(e));
}
function wa(e) {
  return e.endsWith("?") ? Jo(e, 1) : e;
}
function un(e) {
  return pr[wa(e)];
}
function wr(e) {
  return e && gr[e] || "String";
}
function es(e) {
  return e.type === "Nullable`1" ? e.genericArgs[0] : e.type;
}
function jn(e) {
  return e && un(e) == "number" || !1;
}
function ka(e) {
  return e && e.toLowerCase() == "string" || !1;
}
function kr(e) {
  return e == "List`1" || e.startsWith("List<") || e.endsWith("[]");
}
function xa(e) {
  if (!e?.type) return !1;
  const t = es(e);
  return e.isValueType && t.indexOf("`") == -1 || e.isEnum ? !1 : un(e.type) == null;
}
function $a(e) {
  if (!e?.type) return !1;
  const t = es(e);
  if (e.isValueType && t.indexOf("`") == -1 || e.isEnum) return !0;
  const l = e.input?.type;
  return l && (l == "hidden" || l == "file" || l == "tag" || l == "combobox" || ee.components?.[l]) ? !0 : un(e.type) != null;
}
function Ll(e, t) {
  let l = typeof e == "string" ? Ut(e) : e;
  l || (console.warn(`Metadata not found for: ${e}`), l = { request: { name: e } });
  let n = (
    /** @class */
    /* @__PURE__ */ (function() {
      return function(d) {
        Object.assign(this, d);
      };
    })()
  ), a = (
    /** @class */
    (function() {
      function d(i) {
        Object.assign(this, i);
      }
      return d.prototype.createResponse = function() {
        return l.returnsVoid ? void 0 : new n();
      }, d.prototype.getTypeName = function() {
        return l.request.name;
      }, d.prototype.getMethod = function() {
        return l.method || "POST";
      }, d;
    })()
  );
  return new a(t);
}
function xr(e, t, l = {}) {
  let n = (
    /** @class */
    /* @__PURE__ */ (function() {
      return function(d) {
        Object.assign(this, d);
      };
    })()
  ), a = (
    /** @class */
    (function() {
      function d(i) {
        Object.assign(this, i);
      }
      return d.prototype.createResponse = function() {
        return typeof l.createResponse == "function" ? l.createResponse() : new n();
      }, d.prototype.getTypeName = function() {
        return e;
      }, d.prototype.getMethod = function() {
        return l.method || "POST";
      }, d;
    })()
  );
  return new a(t);
}
function xl(e, t) {
  return e ? (Object.keys(e).forEach((l) => {
    let n = e[l];
    typeof n == "string" ? n.startsWith("/Date") && (e[l] = fn(xt(n))) : n != null && typeof n == "object" && (Array.isArray(n) ? e[l] = Array.from(n) : e[l] = Object.assign({}, n));
  }), e) : {};
}
function $r(e, t) {
  let l = {};
  return Array.from(e.elements).forEach((n) => {
    let a = n;
    if (!a.id || a.value == null || a.value === "") return;
    const d = a.id.toLowerCase(), i = t && t.find((m) => m.name.toLowerCase() == d);
    let r = i?.type, c = i?.genericArgs?.[0], v = a.type === "checkbox" ? a.checked : a.value;
    jn(r) ? v = Number(v) : r === "List`1" && typeof v == "string" && (v = v.split(",").map((m) => jn(c) ? Number(m) : m)), l[a.id] = v;
  }), l;
}
function ts(e) {
  return e?.api?.operations && e.api.operations.length > 0;
}
function Cr(e) {
  if (!ls() && e?.assert && !ee.metadata.value)
    throw new Error("useMetadata() not configured, see: https://docs.servicestack.net/vue/use-metadata");
  return ee.metadata.value;
}
function Vl(e) {
  return e && ts(e) ? (e.date = Qo(/* @__PURE__ */ new Date()), ee.metadata.value = e, typeof localStorage < "u" && localStorage.setItem(ul, JSON.stringify(e)), !0) : !1;
}
function Sr() {
  ee.metadata.value = null, typeof localStorage < "u" && localStorage.removeItem(ul);
}
function ls() {
  if (ee.metadata.value != null) return !0;
  let e = globalThis.Server;
  if (ts(e))
    Vl(e);
  else {
    const t = typeof localStorage < "u" ? localStorage.getItem(ul) : null;
    if (t)
      try {
        Vl(JSON.parse(t));
      } catch {
        console.error(`Could not JSON.parse ${ul} from localStorage`);
      }
  }
  return ee.metadata.value != null;
}
async function Rs(e, t) {
  let l = t ? await t() : await fetch(e);
  if (l.ok) {
    let n = await l.text();
    Vl(JSON.parse(n));
  } else
    console.error(`Could not download ${t ? "AppMetadata" : e}: ${l.statusText}`);
  ts(ee.metadata.value) || console.warn("AppMetadata is not available");
}
async function Lr(e) {
  const { olderThan: t, resolvePath: l, resolve: n } = e || {};
  let a = ls() && t !== 0;
  if (a && t) {
    let d = xt(ee.metadata.value?.date);
    (!d || (/* @__PURE__ */ new Date()).getTime() - d.getTime() > t) && (a = !1);
  }
  if (!a) {
    const d = e.client ?? Pe("client");
    await Vr({ client: d, resolvePath: l, resolve: n });
  }
  return ee.metadata.value;
}
async function Vr(e) {
  const { client: t, resolvePath: l, resolve: n } = e;
  if (!((l || n) && (await Rs(l || ul, n), ee.metadata.value != null))) {
    if (t != null) {
      const a = await t.api(new vr());
      a.succeeded && Vl(a.response);
    }
    if (ee.metadata.value == null)
      return await Rs(ul), ee.metadata.value;
  }
}
function nt(e, t) {
  if (ee.config.typeResolver) {
    let i = ee.config.typeResolver(e, t);
    if (i) return i;
  }
  let l = ee.metadata.value?.api;
  if (!l || !e) return null;
  let n = l.types.find((i) => i.name.toLowerCase() === e.toLowerCase() && (!t || i.namespace == t));
  if (n) return n;
  let a = Ut(e);
  if (a) return a.request;
  let d = l.operations.find((i) => i.response && i.response.name.toLowerCase() === e.toLowerCase() && (!t || i.response.namespace == t));
  return d ? d.response : null;
}
function Ut(e) {
  if (ee.config.apiResolver) {
    const n = ee.config.apiResolver(e);
    if (n) return n;
  }
  let t = ee.metadata.value?.api;
  return t ? t.operations.find((n) => n.request.name.toLowerCase() === e.toLowerCase()) : null;
}
function Mr({ dataModel: e }) {
  const t = ee.metadata.value?.api;
  if (!t) return [];
  let l = t.operations;
  if (e) {
    const n = typeof e == "string" ? nt(e) : e;
    l = l.filter((a) => Ca(a.dataModel, n));
  }
  return l;
}
function ns(e) {
  return e ? nt(e.name, e.namespace) : null;
}
function Ca(e, t) {
  return e && t && e.name === t.name && (!e.namespace || !t.namespace || e.namespace === t.namespace);
}
function Ar(e, t) {
  let l = nt(e);
  return l && l.properties && l.properties.find((a) => a.name.toLowerCase() === t.toLowerCase());
}
function Sa(e) {
  return La(nt(e));
}
function La(e) {
  if (e && e.isEnum && e.enumNames != null) {
    let t = {};
    for (let l = 0; l < e.enumNames.length; l++) {
      const n = (e.enumDescriptions ? e.enumDescriptions[l] : null) || e.enumNames[l], a = (e.enumValues != null ? e.enumValues[l] : null) || e.enumNames[l];
      t[a] = n;
    }
    return t;
  }
  return null;
}
function Va(e) {
  if (!e) return null;
  let t = {}, l = e.input && e.input.allowableEntries;
  if (l) {
    for (let a = 0; a < l.length; a++) {
      let d = l[a];
      t[d.key] = d.value;
    }
    return t;
  }
  let n = e.allowableValues || (e.input ? e.input.allowableValues : null);
  if (n) {
    for (let a = 0; a < n.length; a++) {
      let d = n[a];
      t[d] = d;
    }
    return t;
  }
  if (e.isEnum) {
    const a = e.genericArgs && e.genericArgs.length == 1 ? e.genericArgs[0] : e.type, d = nt(a);
    if (d)
      return La(d);
  }
  return null;
}
function ss(e) {
  if (!e) return;
  const t = [];
  return Object.keys(e).forEach((l) => t.push({ key: l, value: e[l] })), t;
}
function Tr(e, t) {
  const n = ((a, d) => Object.assign({
    id: a,
    name: a,
    type: d
  }, t))(e.name, t?.type || br(e) || "text");
  return e.isEnum && (n.type = "select", n.allowableEntries = ss(Va(e))), n;
}
function jr(e) {
  let t = [];
  if (e) {
    const l = ot(e), n = Ut(e.name), a = ns(n?.dataModel);
    l.forEach((d) => {
      if (!$a(d)) return;
      const i = Tr(d, d.input);
      if (i.id = Ko(i.id), i.type == "file" && d.uploadTo && !i.accept) {
        const r = ee.metadata.value?.plugins.filesUpload?.locations.find((c) => c.name == d.uploadTo);
        r && !i.accept && r.allowExtensions && (i.accept = r.allowExtensions.map((c) => c.startsWith(".") ? c : `.${c}`).join(","));
      }
      if (a) {
        const r = a.properties?.find((c) => c.name == d.name);
        d.ref || (d.ref = r?.ref);
      }
      if (i.options)
        try {
          const r = {
            input: i,
            $typeFields: l.map((v) => v.name),
            $dataModelFields: a ? ot(a).map((v) => v.name) : [],
            ...ee.config.scopeWhitelist
          }, c = vn(i.options, r);
          Object.keys(c).forEach((v) => {
            i[v] = c[v];
          });
        } catch {
          console.error(`failed to evaluate '${i.options}'`);
        }
      t.push(i);
    });
  }
  return t;
}
function as(e, t) {
  if (!t.type)
    return console.error("enumDescriptions missing {type:'EnumType'} options"), [`${e}`];
  const l = nt(t.type);
  if (!l?.enumValues)
    return console.error(`Could not find metadata for ${t.type}`), [`${e}`];
  const n = [];
  for (let a = 0; a < l.enumValues.length; a++) {
    const d = parseInt(l.enumValues[a]);
    d > 0 && (d & e) === d && n.push(l.enumDescriptions?.[a] || l.enumNames?.[a] || `${e}`);
  }
  return n;
}
function Ma(e) {
  return (t) => typeof t == "number" ? as(t, { type: e }) : t;
}
function ot(e) {
  if (!e) return [];
  let t = [], l = {};
  function n(a) {
    a.forEach((d) => {
      l[d.name] || (l[d.name] = 1, t.push(d));
    });
  }
  for (; e; )
    e.properties && n(e.properties), e = e.inherits ? ns(e.inherits) : null;
  return t.map((a) => a.type.endsWith("[]") ? { ...a, type: "List`1", genericArgs: [a.type.substring(0, a.type.length - 2)] } : a);
}
function Nl(e, t) {
  return e.request.implements?.some((l) => l.name === t) || !1;
}
function vl(e) {
  return e ? Aa(e, ot(e)) : null;
}
function Aa(e, t) {
  let l = t.find((d) => d.name.toLowerCase() === "id");
  if (l && l.isPrimaryKey) return l;
  let a = t.find((d) => d.isPrimaryKey) || l;
  if (!a) {
    let d = He.model(e);
    if (d)
      return qe(nt(d), (i) => vl(i));
    console.error(`Primary Key not found in ${e.name}`);
  }
  return a || null;
}
function Or(e, t) {
  return qe(vl(e), (l) => me(t, l.name));
}
function Ta(e, t, l) {
  return e && e.valueType === "none" ? "" : l.key === "%In" || l.key === "%Between" ? `(${l.value})` : Fr(t, l.value);
}
function Fr(e, t) {
  return e ? (e = wa(e), jn(e) || e === "Boolean" ? t : kr(e) ? `[${t}]` : `'${t}'`) : t;
}
function Lt(e, t) {
  return { name: e, value: t };
}
const ja = [
  Lt("=", "%"),
  Lt("!=", "%!"),
  Lt(">=", ">%"),
  Lt(">", "%>"),
  Lt("<=", "%<"),
  Lt("<", "<%"),
  Lt("In", "%In"),
  Lt("Between", "%Between"),
  { name: "Starts With", value: "%StartsWith", types: "string" },
  { name: "Contains", value: "%Contains", types: "string" },
  { name: "Ends With", value: "%EndsWith", types: "string" },
  { name: "Exists", value: "%IsNotNull", valueType: "none" },
  { name: "Not Exists", value: "%IsNull", valueType: "none" }
];
function gt() {
  const e = f(() => ee.metadata.value?.app || null), t = f(() => ee.metadata.value?.api || null), l = f(() => ee.metadata.value?.plugins?.autoQuery?.viewerConventions || ja);
  return ls(), {
    loadMetadata: Lr,
    getMetadata: Cr,
    setMetadata: Vl,
    clearMetadata: Sr,
    metadataApp: e,
    metadataApi: t,
    filterDefinitions: l,
    typeOf: nt,
    typeOfRef: ns,
    typeEquals: Ca,
    apiOf: Ut,
    findApis: Mr,
    typeName: hr,
    typeName2: ba,
    property: Ar,
    enumOptions: Sa,
    propertyOptions: Va,
    createFormLayout: jr,
    typeProperties: ot,
    supportsProp: $a,
    Crud: He,
    Apis: At,
    getPrimaryKey: vl,
    getPrimaryKeyByProps: Aa,
    getId: Or,
    createDto: Ll,
    makeDto: xr,
    toFormValues: xl,
    formValues: $r,
    isComplexProp: xa,
    asKvps: ss,
    expandEnumFlags: as,
    enumFlagsConverter: Ma
  };
}
class _e {
  static Lookup = {};
  static async getOrFetchValue(t, l, n, a, d, i, r) {
    const c = _e.getValue(n, r, d);
    return c ?? (await _e.fetchLookupIds(t, l, n, a, d, i, [r]), _e.getValue(n, r, d));
  }
  static getValue(t, l, n) {
    const a = _e.Lookup[t];
    if (a) {
      const d = a[l];
      if (d)
        return n = n.toLowerCase(), d[n];
    }
  }
  static setValue(t, l, n, a) {
    const d = _e.Lookup[t] ?? (_e.Lookup[t] = {}), i = d[l] ?? (d[l] = {});
    n = n.toLowerCase(), i[n] = a;
  }
  static setRefValue(t, l) {
    const n = me(l, t.refId);
    if (n == null || t.refLabel == null)
      return null;
    const a = me(l, t.refLabel);
    return _e.setValue(t.model, n, t.refLabel, a), a;
  }
  static async fetchLookupIds(t, l, n, a, d, i, r) {
    const c = l.operations.find((v) => He.isAnyQuery(v) && v.dataModel?.name == n);
    if (c) {
      const v = _e.Lookup[n] ?? (_e.Lookup[n] = {}), m = [];
      Object.keys(v).forEach((w) => {
        const C = v[w];
        me(C, d) && m.push(w);
      });
      const h = r.filter((w) => !m.includes(w));
      if (h.length == 0)
        return;
      const y = i ? null : `${a},${d}`, g = {
        [a + "In"]: h.join(",")
      };
      y && (g.fields = y);
      const p = Ll(c, g), x = await t.api(p, { jsconfig: "edv,eccn" });
      if (x.succeeded)
        (me(x.response, "results") || []).forEach((C) => {
          if (!me(C, a)) {
            console.error(`result[${a}] == null`, C);
            return;
          }
          const F = `${me(C, a)}`, B = me(C, d);
          d = d.toLowerCase();
          const E = v[F] ?? (v[F] = {});
          E[d] = `${B}`;
        });
      else {
        console.error(`Failed to call ${c.request.name}`);
        return;
      }
    }
  }
}
let On = () => (/* @__PURE__ */ new Date()).getTime(), Ir = ["/", "T", ":", "-"], yt = {
  //locale: null,
  assumeUtc: !0,
  //number: null,
  date: {
    method: "Intl.DateTimeFormat",
    options: "{dateStyle:'medium'}"
  },
  maxFieldLength: 150,
  maxNestedFields: 2,
  maxNestedFieldLength: 30
}, Pr = new Intl.RelativeTimeFormat(yt.locale, {}), Hs = 1440 * 60 * 1e3 * 365, xn = {
  year: Hs,
  month: Hs / 12,
  day: 1440 * 60 * 1e3,
  hour: 3600 * 1e3,
  minute: 60 * 1e3,
  second: 1e3
}, qt = {
  currency: Fa,
  bytes: Ia,
  link: Pa,
  linkTel: Ba,
  linkMailTo: Ea,
  icon: Da,
  iconRounded: Na,
  attachment: Ra,
  hidden: Ha,
  time: qa,
  relativeTime: rs,
  relativeTimeFromMs: dn,
  enumFlags: Ua,
  formatDate: pl,
  formatNumber: os
};
"iconOnError" in globalThis || (globalThis.iconOnError = rn);
let Br = class {
  static currency = { method: "currency" };
  static bytes = { method: "bytes" };
  static link = { method: "link" };
  static linkTel = { method: "linkTel" };
  static linkMailTo = { method: "linkMailTo" };
  static icon = { method: "icon" };
  static iconRounded = { method: "iconRounded" };
  static attachment = { method: "attachment" };
  static time = { method: "time" };
  static relativeTime = { method: "relativeTime" };
  static relativeTimeFromMs = { method: "relativeTimeFromMs" };
  static date = { method: "formatDate" };
  static number = { method: "formatNumber" };
  static hidden = { method: "hidden" };
  static enumFlags = { method: "enumFlags" };
};
function Er(e) {
  yt = Object.assign({}, yt, e);
}
function Dr(e) {
  Object.keys(e || {}).forEach((t) => {
    typeof e[t] == "function" && (qt[t] = e[t]);
  });
}
function Oa() {
  return qt;
}
function Fl(e, t) {
  return t ? ht("span", e, t) : e;
}
function Fa(e, t) {
  const l = bt(t, ["currency"]);
  return Fl(new Intl.NumberFormat(void 0, { style: "currency", currency: t?.currency || "USD" }).format(e), l);
}
function Ia(e, t) {
  return Fl(Yn(e), t);
}
function Pa(e, t) {
  return ht("a", e, mn({ ...t, href: e }));
}
function Ba(e, t) {
  return ht("a", e, mn({ ...t, href: `tel:${e}` }));
}
function Ea(e, t) {
  t || (t = {});
  let { subject: l, body: n } = t, a = bt(t, ["subject", "body"]), d = {};
  return l && (d.subject = l), n && (d.body = n), ht("a", e, mn({ ...a, href: `mailto:${il(e, d)}` }));
}
function Da(e, t) {
  return ht("img", void 0, Object.assign({ class: "w-6 h-6", title: e, src: nl(e), onerror: "iconOnError(this)" }, t));
}
function Na(e, t) {
  return ht("img", void 0, Object.assign({ class: "w-8 h-8 rounded-full", title: e, src: nl(e), onerror: "iconOnError(this)" }, t));
}
function Ra(e, t) {
  let l = Wn(e), a = Ol(l) == null || Xn(e) ? nl(e) : _n(e);
  const d = nl(a);
  let i = t && (t["icon-class"] || t.iconClass), r = ht("img", void 0, Object.assign({ class: "w-6 h-6", src: d, onerror: "iconOnError(this,'att')" }, i ? { class: i } : null)), c = `<span class="pl-1">${l}</span>`;
  return ht("a", r + c, Object.assign({ class: "flex", href: nl(e), title: e }, t ? bt(t, ["icon-class", "iconClass"]) : null));
}
function Ha(e) {
  return "";
}
function qa(e, t) {
  let l = typeof e == "string" ? new Date(da(e) * 1e3) : on(e) ? xt(e) : null;
  return Fl(l ? Wo(l) : e, t);
}
function pl(e, t) {
  if (e == null) return "";
  let l = typeof e == "number" ? new Date(e) : typeof e == "string" ? xt(e) : e;
  if (!on(l))
    return console.warn(`${l} is not a Date value`), e == null ? "" : `${e}`;
  let n = yt.date ? cn(yt.date) : null;
  return Fl(typeof n == "function" ? n(l) : Go(l), t);
}
function os(e, t) {
  if (typeof e != "number") return e;
  let l = yt.number ? cn(yt.number) : null, n = typeof l == "function" ? l(e) : `${e}`;
  return n === "" && (console.warn(`formatNumber(${e}) => ${n}`, l), n = `${e}`), Fl(n, t);
}
function Kl(e) {
  const t = Math.floor(e / 1e3), l = Math.floor(t / 60), n = Math.floor(l / 60), a = Math.floor(n / 24);
  return a > 0 ? `${a}d ${Kl(e - a * 24 * 60 * 6e4)}` : n > 0 ? `${n}h ${Kl(e - n * 60 * 6e4)}` : l > 0 ? `${l}m ${Kl(e - l * 6e4)}` : t > 0 ? `${t}s` : `${e}ms`;
}
function Nr(e) {
  return e >= 1e9 ? (e / 1e9).toFixed(1) + "b" : e >= 1e6 ? (e / 1e6).toFixed(1) + "m" : e >= 1e3 ? (e / 1e3).toFixed(1) + "k" : e.toLocaleString();
}
function za(e, t, l) {
  let n = Xo(e), a = t ? cn(t) : null;
  if (typeof a == "function") {
    let i = l;
    if (t?.options)
      try {
        i = vn(t.options, l);
      } catch (r) {
        console.error(`Could not evaluate '${t.options}'`, r, ", with scope:", l);
      }
    return a(e, i);
  }
  let d = n != null ? on(n) ? pl(n, l) : typeof n == "number" ? os(n, l) : n : null;
  return d ?? "";
}
function Ml(e, t, l) {
  return Qt(e) ? za(e, t, l) : Ur(e, t, l);
}
function Rr(e) {
  if (e == null) return NaN;
  if (typeof e == "number")
    return e;
  if (on(e))
    return e.getTime() - On();
  if (typeof e == "string") {
    let t = Number(e);
    if (!isNaN(t))
      return t;
    if (e[0] === "P" || e.startsWith("-P"))
      return da(e) * 1e3 * -1;
    if (Zo(e, Ir) >= 0)
      return xt(e).getTime() - On();
  }
  return NaN;
}
function dn(e, t) {
  for (let l in xn)
    if (Math.abs(e) > xn[l] || l === "second")
      return (t || Pr).format(Math.round(e / xn[l]), l);
}
function rs(e, t) {
  let l = Rr(e);
  return isNaN(l) ? "" : dn(l, t);
}
function Hr(e, t) {
  return dn(e.getTime() - (t ? t.getTime() : On()));
}
function Ua(e, t) {
  return as(e, t).join(", ");
}
function cn(e) {
  if (!e) return null;
  let { method: t, options: l } = e, n = `${t}(${l})`, a = qt[n] || qt[t];
  if (typeof a == "function") return a;
  let d = e.locale || yt.locale;
  if (t.startsWith("Intl.")) {
    let i = d ? `'${d}'` : "undefined", r = `return new ${t}(${i},${l || "undefined"})`;
    try {
      let c = Function(r)();
      return a = t === "Intl.DateTimeFormat" ? (v) => c.format(xt(v)) : t === "Intl.NumberFormat" ? (v) => c.format(Number(v)) : t === "Intl.RelativeTimeFormat" ? (v) => rs(v, c) : (v) => c.format(v), qt[n] = a;
    } catch (c) {
      console.error(`Invalid format: ${r}`, c);
    }
  } else {
    let i = globalThis[t];
    if (typeof i == "function") {
      let r = l != null ? Function("return " + l)() : void 0;
      return a = (c) => i(c, r, d), qt[n] = a;
    }
    console.error(`No '${t}' function exists`, Object.keys(qt));
  }
  return null;
}
function Ka(e, t) {
  return e ? e.length > t ? e.substring(0, t) + "..." : e : "";
}
function Qa(e) {
  return e.substring(0, 6) === "/Date(" ? pl(xt(e)) : e;
}
function qr(e) {
  return is(dl(e)).replace(/"/g, "");
}
function Ja(e) {
  if (e == null || e === "") return "";
  if (typeof e == "string")
    try {
      return JSON.parse(e);
    } catch {
      console.warn("couldn't parse as JSON", e);
    }
  return e;
}
function is(e, t = 4) {
  return e = Ja(e), typeof e != "object" ? typeof e == "string" ? e : `${e}` : JSON.stringify(e, void 0, t);
}
function zr(e) {
  return e = Ja(e), typeof e != "object" ? typeof e == "string" ? e : `${e}` : (e = Object.assign({}, e), e = dl(e), is(e));
}
function dl(e) {
  if (e == null) return null;
  if (typeof e == "string") return Qa(e);
  if (Qt(e)) return e;
  if (e instanceof Date) return pl(e);
  if (Array.isArray(e)) return e.map(dl);
  if (typeof e == "object") {
    let t = {};
    return Object.keys(e).forEach((l) => {
      l != "__type" && (t[l] = dl(e[l]));
    }), t;
  }
  return e;
}
function Ur(e, t, l) {
  let n = e;
  if (Array.isArray(e)) {
    if (Qt(e[0]))
      return n.join(",");
    e[0] != null && (n = e[0]);
  }
  if (n == null) return "";
  if (n instanceof Date) return pl(n, l);
  let a = Object.keys(n), d = [];
  for (let i = 0; i < Math.min(yt.maxNestedFields, a.length); i++) {
    let r = a[i], c = `${dl(n[r])}`;
    d.push(`<b class="font-medium">${r}</b>: ${Ln(Ka(Qa(c), yt.maxNestedFieldLength))}`);
  }
  return a.length > 2 && d.push("..."), ht("span", "{ " + d.join(", ") + " }", Object.assign({ title: Ln(qr(e)) }, l));
}
function Ga() {
  return {
    Formats: Br,
    setDefaultFormats: Er,
    getFormatters: Oa,
    setFormatters: Dr,
    formatValue: Ml,
    formatter: cn,
    dateInputFormat: fn,
    currency: Fa,
    bytes: Ia,
    link: Pa,
    linkTel: Ba,
    linkMailTo: Ea,
    icon: Da,
    iconRounded: Na,
    attachment: Ra,
    hidden: Ha,
    time: qa,
    relativeTime: rs,
    relativeTimeFromDate: Hr,
    relativeTimeFromMs: dn,
    enumFlags: Ua,
    formatDate: pl,
    formatNumber: os,
    humanifyMs: Kl,
    humanifyNumber: Nr,
    indentJson: is,
    prettyJson: zr,
    scrub: dl,
    truncate: Ka,
    apiValueFmt: za,
    iconOnError: rn
  };
}
const Kr = ["title"], Qr = /* @__PURE__ */ ge({
  __name: "RouterLink",
  props: {
    to: {}
  },
  setup(e) {
    const t = e, { config: l } = Ct(), n = () => l.value.navigate(t.to ?? "/");
    return (a, d) => (o(), u("a", Se({
      onClick: Ee(n, ["prevent"]),
      title: e.to,
      href: "javascript:void(0)"
    }, a.$attrs), [
      G(a.$slots, "default")
    ], 16, Kr));
  }
});
class Jr {
  callbacks = {};
  register(t, l) {
    this.callbacks[t] = l;
  }
  has(t) {
    return !!this.callbacks[t];
  }
  invoke(t, l) {
    const n = this.callbacks[t];
    typeof n == "function" && n(t, l);
  }
}
class Gr {
  get length() {
    return typeof localStorage > "u" ? 0 : localStorage.length;
  }
  getItem(t) {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  }
  setItem(t, l) {
    typeof localStorage > "u" || localStorage.setItem(t, l);
  }
  removeItem(t) {
    typeof localStorage > "u" || localStorage.removeItem(t);
  }
  clear() {
    typeof localStorage > "u" || localStorage.clear();
  }
  key(t) {
    return typeof localStorage > "u" ? null : localStorage.key(t);
  }
}
const Wa = M("");
class ee {
  static config = {
    redirectSignIn: "/signin",
    redirectSignOut: "/auth/logout",
    navigate: (t) => location.href = t,
    assetsPathResolver: (t) => t,
    fallbackPathResolver: (t) => t,
    storage: new Gr(),
    tableIcon: { svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><g fill='none' stroke='currentColor' stroke-width='1.5'><path d='M5 12v6s0 3 7 3s7-3 7-3v-6'/><path d='M5 6v6s0 3 7 3s7-3 7-3V6'/><path d='M12 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3Z'/></g></svg>" },
    scopeWhitelist: {
      enumFlagsConverter: Ma,
      ...Oa()
    }
  };
  static autoQueryGridDefaults = {
    deny: [],
    hide: [],
    toolbarButtonClass: void 0,
    tableStyle: "stripedRows",
    take: 25,
    maxFieldLength: 150
  };
  static events = Yo();
  static user = M(null);
  static apiKey = Wa;
  static metadata = Wl(null);
  static components = {
    RouterLink: Qr
  };
  static component(t) {
    const l = ee.components[t];
    if (l) return l;
    const n = Bs(t), a = Object.keys(ee.components).find((d) => Bs(d) === n);
    return a && ee.components[a] || null;
  }
  static interceptors = new Jr();
}
function Za() {
  return Wa;
}
function Wr(e) {
  ee.config = Object.assign(ee.config, e);
}
function Zr(e) {
  ee.autoQueryGridDefaults = Object.assign(ee.autoQueryGridDefaults, e);
}
function us(e) {
  return e && ee.config.assetsPathResolver ? ee.config.assetsPathResolver(e) : e;
}
function Xr(e) {
  return e && ee.config.fallbackPathResolver ? ee.config.fallbackPathResolver(e) : e;
}
function Yr(e, t) {
  ee.interceptors.register(e, t);
}
function Ct() {
  const e = f(() => ee.config), t = f(() => ee.autoQueryGridDefaults), l = ee.events;
  return {
    Sole: ee,
    config: e,
    setConfig: Wr,
    events: l,
    autoQueryGridDefaults: t,
    setAutoQueryGridDefaults: Zr,
    assetsPathResolver: us,
    fallbackPathResolver: Xr,
    registerInterceptor: Yr
  };
}
function fn(e) {
  if (e == null || typeof e == "object") return "";
  const t = xt(e);
  return t == null || t.toString() == "Invalid Date" ? "" : t.toISOString().substring(0, 10) ?? "";
}
function Xa(e) {
  if (e == null || typeof e == "object") return "";
  const t = xt(e);
  return t == null || t.toString() == "Invalid Date" ? "" : t.toISOString().substring(0, 19) ?? "";
}
function Ya(e) {
  return e == null ? "" : _o(e);
}
function Fn(e, t) {
  return ee.config.inputValue ? ee.config.inputValue(e, t) : e === "date" ? fn(t) : e === "datetime-local" ? Xa(t) : e === "time" ? Ya(t) : e === "number" || e === "range" ? t == null ? "" : Number(t) : t;
}
function _a(e, t) {
  e.value = null, jt(() => e.value = t);
}
function el(e) {
  return Object.keys(e).forEach((t) => {
    const l = e[t];
    e[t] = aa(l) ? ne(l) : l;
  }), e;
}
function Ft(e, t, l) {
  l ? (t.value = e.entering.cls + " " + e.entering.from, setTimeout(() => t.value = e.entering.cls + " " + e.entering.to, 0)) : (t.value = e.leaving.cls + " " + e.leaving.from, setTimeout(() => t.value = e.leaving.cls + " " + e.leaving.to, 0));
}
function Ql(e) {
  if (typeof document > "u") return;
  let t = e?.after || document.activeElement, l = t && t.form;
  if (l) {
    let n = ':not([disabled]):not([tabindex="-1"])', a = l.querySelectorAll(`a:not([disabled]), button${n}, input[type=text]${n}, [tabindex]${n}`), d = Array.prototype.filter.call(
      a,
      (r) => r.offsetWidth > 0 || r.offsetHeight > 0 || r === t
    ), i = d.indexOf(t);
    i > -1 && (d[i + 1] || d[0]).focus();
  }
}
function Gt(e) {
  if (!e) return null;
  if (typeof e == "string")
    return e;
  const t = typeof e == "function" ? new e() : typeof e == "object" ? e : null;
  if (!t)
    throw new Error(`Invalid DTO Type '${typeof e}'`);
  if (typeof t.getTypeName != "function")
    throw new Error(`${JSON.stringify(t)} is not a Request DTO`);
  const l = t.getTypeName();
  if (!l)
    throw new Error("DTO Required");
  return l;
}
function ht(e, t, l) {
  l || (l = {});
  let n = l.cls || l.className || l.class;
  return n && (l = bt(l, ["cls", "class", "className"]), l.class = n), t == null ? `<${e}` + In(l) + "/>" : `<${e}` + In(l) + `>${t || ""}</${e}>`;
}
function In(e) {
  return Object.keys(e).reduce((t, l) => `${t} ${l}="${Ln(e[l])}"`, "");
}
function mn(e) {
  return Object.assign({ target: "_blank", rel: "noopener", class: "text-blue-600" }, e);
}
function nl(e) {
  return us(e);
}
let _r = ["string", "number", "boolean", "null", "undefined"];
function Qt(e) {
  return _r.indexOf(typeof e) >= 0 || e instanceof Date;
}
function Al(e) {
  return !Qt(e);
}
function en(e) {
  return typeof e == "string" ? JSON.parse(e) : null;
}
function ds(e, t) {
  if (typeof history < "u") {
    const l = t ? il(ca(location.href, "?"), e) : er(location.href, e);
    history.pushState({}, "", l);
  }
}
function vn(e, t) {
  if (["function", "Function", "eval", "=>", ";"].some((a) => e.includes(a)))
    throw new Error(`Unsafe script: '${e}'`);
  const n = Object.assign(
    Object.keys(globalThis).reduce((a, d) => (a[d] = void 0, a), {}),
    t
  );
  return new Function("with(this) { return (" + e + ") }").call(n);
}
function Pn(e) {
  typeof navigator < "u" && navigator.clipboard.writeText(e);
}
function cs(e) {
  const t = ee.config.storage.getItem(e);
  return t ? JSON.parse(t) : null;
}
function pn(e, t) {
  return il(`swr.${tr(e)}`, t ? Object.assign({}, e, t) : e);
}
function ei(e) {
  if (e.request) {
    const t = pn(e.request, e.args);
    ee.config.storage.removeItem(t);
  }
}
async function eo(e, t, l, n, a) {
  const d = pn(t, n);
  l(new tt({ response: cs(d) }));
  const i = await e.api(t, n, a);
  if (i.succeeded && i.response) {
    i.response._date = (/* @__PURE__ */ new Date()).valueOf();
    const r = JSON.stringify(i.response);
    ee.config.storage.setItem(d, r), l(i);
  }
  return i;
}
function to(e, t) {
  let l = null;
  return (...n) => {
    l && clearTimeout(l), l = setTimeout(() => {
      e(...n);
    }, t || 100);
  };
}
function sl(e) {
  return typeof e == "string" ? e.split(",") : e || [];
}
function zt(e, t) {
  const l = sl(t);
  return e.reduce((n, a) => (n[a] = !l.includes(a), n), {});
}
function ti(e) {
  return new Promise((t) => setTimeout(t, e));
}
function lo(e) {
  const t = [], l = [];
  for (const n of e) {
    const a = n.toLowerCase();
    l.includes(a) || (t.push(n), l.push(a));
  }
  return t;
}
function no() {
  return {
    dateInputFormat: fn,
    dateTimeInputFormat: Xa,
    timeInputFormat: Ya,
    textInputValue: Fn,
    setRef: _a,
    unRefs: el,
    transition: Ft,
    focusNextElement: Ql,
    getTypeName: Gt,
    htmlTag: ht,
    htmlAttrs: In,
    linkAttrs: mn,
    toAppUrl: nl,
    isPrimitive: Qt,
    isComplexType: Al,
    pushState: ds,
    scopedExpr: vn,
    copyText: Pn,
    fromCache: cs,
    swrCacheKey: pn,
    swrClear: ei,
    swrApi: eo,
    asStrings: sl,
    asOptions: zt,
    createDebounce: to,
    delay: ti,
    uniqueIgnoreCase: lo
  };
}
function Il(e) {
  const t = M(!1), l = M(), n = M(), a = e ?? Pe("client");
  function d({ message: p, errorCode: x, fieldName: w, errors: C }) {
    return x || (x = "Exception"), C || (C = []), l.value = w ? new kn({
      errorCode: x,
      message: p,
      errors: [new Es({ fieldName: w, errorCode: x, message: p })]
    }) : new kn({ errorCode: x, message: p, errors: C });
  }
  function i({ fieldName: p, message: x, errorCode: w }) {
    if (w || (w = "Exception"), !l.value)
      d({ fieldName: p, message: x, errorCode: w });
    else {
      let C = new kn(l.value);
      C.errors = [
        ...(C.errors || []).filter((F) => F.fieldName?.toLowerCase() !== p?.toLowerCase()),
        new Es({ fieldName: p, message: x, errorCode: w })
      ], l.value = C;
    }
  }
  async function r(p, x, w) {
    t.value = !0;
    let C = await a.api(el(p), x, w);
    return t.value = !1, n.value = C.response, l.value = C.error, C;
  }
  async function c(p, x, w) {
    t.value = !0;
    let C = await a.apiVoid(el(p), x, w);
    return t.value = !1, n.value = C.response, l.value = C.error, C;
  }
  async function v(p, x, w, C) {
    t.value = !0;
    let F = await a.apiForm(el(p), x, w, C);
    return t.value = !1, n.value = F.response, l.value = F.error, F;
  }
  async function m(p, x, w, C) {
    t.value = !0;
    let F = await a.apiFormVoid(el(p), x, w, C);
    return t.value = !1, n.value = F.response, l.value = F.error, F;
  }
  async function h(p, x, w, C) {
    return eo(a, p, x, w, C);
  }
  function y(p, x) {
    const w = M(new tt()), C = to(async (F) => {
      w.value = await a.api(F);
    }, x?.delayMs);
    return rl(async () => {
      const F = p(), B = cs(pn(F));
      B && (w.value = new tt({ response: B })), x?.delayMs === 0 ? w.value = await a.api(F) : C(F);
    }), (async () => w.value = await a.api(p(), x?.args, x?.method))(), w;
  }
  let g = { setError: d, addFieldError: i, loading: t, error: l, api: r, apiVoid: c, apiForm: v, apiFormVoid: m, swr: h, swrEffect: y, unRefs: el, setRef: _a };
  return It("ApiState", g), g;
}
function so(e) {
  return e && e.SessionId ? lr(e) : e;
}
function li(e) {
  ee.user.value = so(e), ee.events.publish("signIn", e);
}
function ni() {
  ee.user.value = null, ee.events.publish("signOut", null);
}
const fs = (e) => e?.roles || [], ms = (e) => e?.permissions || [];
function ao(e) {
  return fs(ee.user.value).indexOf(e) >= 0;
}
function si(e) {
  return ms(ee.user.value).indexOf(e) >= 0;
}
function vs() {
  return ao("Admin");
}
function $l(e) {
  if (!e) return !1;
  if (!e.requiresAuth)
    return !0;
  const t = ee.user.value;
  if (!t)
    return !1;
  if (vs())
    return !0;
  let [l, n] = [fs(t), ms(t)], [a, d, i, r] = [
    e.requiredRoles || [],
    e.requiredPermissions || [],
    e.requiresAnyRole || [],
    e.requiresAnyPermission || []
  ];
  return !(!a.every((c) => l.indexOf(c) >= 0) || i.length > 0 && !i.some((c) => l.indexOf(c) >= 0) || !d.every((c) => n.indexOf(c) >= 0) || r.length > 0 && !r.every((c) => n.indexOf(c) >= 0));
}
function ai(e) {
  if (!e || !e.requiresAuth) return null;
  const t = ee.user.value;
  if (!t)
    return `<b>${e.request.name}</b> requires Authentication`;
  if (vs())
    return null;
  let [l, n] = [fs(t), ms(t)], [a, d, i, r] = [
    e.requiredRoles || [],
    e.requiredPermissions || [],
    e.requiresAnyRole || [],
    e.requiresAnyPermission || []
  ], c = a.filter((m) => l.indexOf(m) < 0);
  if (c.length > 0)
    return `Requires ${c.map((m) => "<b>" + m + "</b>").join(", ")} Role` + (c.length > 1 ? "s" : "");
  let v = d.filter((m) => n.indexOf(m) < 0);
  return v.length > 0 ? `Requires ${v.map((m) => "<b>" + m + "</b>").join(", ")} Permission` + (v.length > 1 ? "s" : "") : i.length > 0 && !i.some((m) => l.indexOf(m) >= 0) ? `Requires any ${i.filter((m) => l.indexOf(m) < 0).map((m) => "<b>" + m + "</b>").join(", ")} Role` + (c.length > 1 ? "s" : "") : r.length > 0 && !r.every((m) => n.indexOf(m) >= 0) ? `Requires any ${r.filter((m) => n.indexOf(m) < 0).map((m) => "<b>" + m + "</b>").join(", ")} Permission` + (v.length > 1 ? "s" : "") : null;
}
function cl() {
  const e = f(() => ee.user.value || null), t = f(() => ee.user.value != null);
  return { signIn: li, signOut: ni, user: e, toAuth: so, isAuthenticated: t, hasRole: ao, hasPermission: si, isAdmin: vs, canAccess: $l, invalidAccessMessage: ai };
}
function Ye(e, t) {
  return Array.isArray(e) ? e.indexOf(t) >= 0 : e == t || e.includes(t);
}
const tn = {
  blue: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200",
  purple: "text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200",
  red: "text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200",
  green: "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200",
  sky: "text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-200",
  cyan: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200",
  indigo: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
}, vt = {
  base: "block w-full sm:text-sm rounded-md dark:text-white dark:bg-gray-900 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 disabled:border-slate-200 dark:disabled:border-slate-700 disabled:shadow-none",
  invalid: "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500",
  valid: "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600"
}, bl = {
  panelClass: "shadow sm:rounded-md",
  formClass: "space-y-6 bg-white dark:bg-black py-6 px-4 sm:p-6",
  headingClass: "text-lg font-medium leading-6 text-gray-900 dark:text-gray-100",
  subHeadingClass: "mt-1 text-sm text-gray-500 dark:text-gray-400"
}, tl = {
  panelClass: "pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg",
  formClass: "flex h-full flex-col divide-y divide-gray-200 dark:divide-gray-700 shadow-xl bg-white dark:bg-black",
  titlebarClass: "bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6",
  headingClass: "text-lg font-medium text-gray-900 dark:text-gray-100",
  subHeadingClass: "mt-1 text-sm text-gray-500 dark:text-gray-400",
  closeButtonClass: "rounded-md bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:ring-offset-black"
}, Bn = {
  modalClass: "relative transform overflow-hidden rounded-lg bg-white dark:bg-black text-left shadow-xl transition-all sm:my-8",
  sizeClass: "sm:max-w-prose lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl sm:w-full"
}, Re = {
  panelClass(e = "slideOver") {
    return e == "card" ? bl.panelClass : tl.panelClass;
  },
  formClass(e = "slideOver") {
    return e == "card" ? bl.formClass : tl.formClass;
  },
  headingClass(e = "slideOver") {
    return e == "card" ? bl.headingClass : tl.headingClass;
  },
  subHeadingClass(e = "slideOver") {
    return e == "card" ? bl.subHeadingClass : tl.subHeadingClass;
  },
  buttonsClass: "px-4 py-3 bg-gray-50 dark:bg-gray-900 sm:px-6 flex flex-wrap justify-between",
  legendClass: "text-base font-medium text-gray-900 dark:text-gray-100 text-center mb-4"
}, ke = {
  getGridClass(e = "stripedRows") {
    return ke.gridClass;
  },
  getGrid2Class(e = "stripedRows") {
    return Ye(e, "fullWidth") ? "overflow-x-auto" : ke.grid2Class;
  },
  getGrid3Class(e = "stripedRows") {
    return Ye(e, "fullWidth") ? "inline-block min-w-full py-2 align-middle" : ke.grid3Class;
  },
  getGrid4Class(e = "stripedRows") {
    return Ye(e, "whiteBackground") ? "" : Ye(e, "fullWidth") ? "overflow-hidden shadow-sm ring-1 ring-black/5" : ke.grid4Class;
  },
  getTableClass(e = "stripedRows") {
    return Ye(e, "fullWidth") || Ye(e, "verticalLines") ? "min-w-full divide-y divide-gray-300" : ke.tableClass;
  },
  getTheadClass(e = "stripedRows") {
    return Ye(e, "whiteBackground") ? "" : ke.theadClass;
  },
  getTheadRowClass(e = "stripedRows") {
    return ke.theadRowClass + (Ye(e, "verticalLines") ? " divide-x divide-gray-200 dark:divide-gray-700" : "");
  },
  getTheadCellClass(e = "stripedRows") {
    return ke.theadCellClass + (Ye(e, "uppercaseHeadings") ? " uppercase" : "");
  },
  getTbodyClass(e = "stripedRows") {
    return (Ye(e, "whiteBackground") || Ye(e, "verticalLines") ? "divide-y divide-gray-200 dark:divide-gray-800" : ke.tableClass) + (Ye(e, "verticalLines") ? " bg-white" : "");
  },
  getTableRowClass(e = "stripedRows", t, l, n) {
    return (n ? "cursor-pointer " : "") + (l ? "bg-indigo-100 dark:bg-blue-800" : (n ? "hover:bg-yellow-50 dark:hover:bg-blue-900 " : "") + (Ye(e, "stripedRows") ? t % 2 == 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-black")) + (Ye(e, "verticalLines") ? " divide-x divide-gray-200 dark:divide-gray-700" : "");
  },
  gridClass: "flex flex-col",
  //original -margins + padding forces scroll bars when parent is w-full for no clear benefits?
  //original: -my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8
  grid2Class: "",
  //original: inline-block min-w-full py-2 align-middle md:px-6 lg:px-8
  grid3Class: "inline-block min-w-full py-2 align-middle",
  grid4Class: "overflow-hidden shadow ring-1 ring-black/5 md:rounded-lg",
  tableClass: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
  theadClass: "bg-gray-50 dark:bg-gray-900",
  tableCellClass: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400",
  theadRowClass: "select-none",
  theadCellClass: "px-6 py-4 text-left text-sm font-medium tracking-wider whitespace-nowrap",
  toolbarButtonClass: "inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black"
}, oi = {
  colspans: "col-span-3 sm:col-span-3"
};
function Pt(e, t, l) {
  const n = e.filter((a) => a).join(" ");
  return l ??= ee.config.filterInputClass == null ? void 0 : (a) => ee.config.filterInputClass(a, t), l ? l(n) : n;
}
const ps = "col-span-12 sm:col-span-6 3xl:col-span-4";
function gs(e) {
  const t = e?.ui ?? {}, l = t.widget === "textarea" || e?.type === "object", n = e?.type === "object" && e?.properties || e?.type === "array" && e?.items?.type === "object" && e?.items?.properties;
  return l || n || t.fieldCss?.includes("col-span-12");
}
const Sb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: tn,
  card: bl,
  defaultFieldClass: ps,
  dummy: oi,
  filterClass: Pt,
  form: Re,
  grid: ke,
  input: vt,
  isWideSchemaField: gs,
  modal: Bn,
  slideOver: tl
}, Symbol.toStringTag, { value: "Module" })), ri = { class: "flex items-center" }, ii = {
  key: 0,
  class: "flex-shrink-0 mr-3"
}, ui = {
  key: 0,
  class: "h-5 w-5 text-yellow-400",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, di = {
  key: 1,
  class: "h-5 w-5 text-red-400",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, ci = {
  key: 2,
  class: "h-5 w-5 text-blue-400",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, fi = {
  key: 3,
  class: "h-5 w-5 text-green-400",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, mi = /* @__PURE__ */ ge({
  __name: "Alert",
  props: {
    type: { default: "warn" },
    hideIcon: { type: Boolean }
  },
  setup(e) {
    const t = e, l = f(() => t.type == "info" ? "bg-blue-50 dark:bg-blue-200" : t.type == "error" ? "bg-red-50 dark:bg-red-200" : t.type == "success" ? "bg-green-50 dark:bg-green-200" : "bg-yellow-50 dark:bg-yellow-200"), n = f(() => t.type == "info" ? "border-blue-400" : t.type == "error" ? "border-red-400" : t.type == "success" ? "border-green-400" : "border-yellow-400"), a = f(() => t.type == "info" ? "text-blue-700" : t.type == "error" ? "text-red-700" : t.type == "success" ? "text-green-700" : "text-yellow-700");
    return (d, i) => (o(), u("div", {
      class: b([l.value, n.value, "border-l-4 p-4"])
    }, [
      s("div", ri, [
        e.hideIcon ? k("", !0) : (o(), u("div", ii, [
          e.type == "warn" ? (o(), u("svg", ui, [...i[0] || (i[0] = [
            s("path", {
              "fill-rule": "evenodd",
              d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
              "clip-rule": "evenodd"
            }, null, -1)
          ])])) : e.type == "error" ? (o(), u("svg", di, [...i[1] || (i[1] = [
            s("path", {
              "fill-rule": "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
              "clip-rule": "evenodd"
            }, null, -1)
          ])])) : e.type == "info" ? (o(), u("svg", ci, [...i[2] || (i[2] = [
            s("path", {
              "fill-rule": "evenodd",
              d: "M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM8.25 9.75A.75.75 0 019 9h.253a1.75 1.75 0 011.709 2.13l-.46 2.066a.25.25 0 00.245.304H11a.75.75 0 010 1.5h-.253a1.75 1.75 0 01-1.709-2.13l.46-2.066a.25.25 0 00-.245-.304H9a.75.75 0 01-.75-.75zM10 7a1 1 0 100-2 1 1 0 000 2z",
              "clip-rule": "evenodd"
            }, null, -1)
          ])])) : e.type == "success" ? (o(), u("svg", fi, [...i[3] || (i[3] = [
            s("path", {
              "fill-rule": "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
              "clip-rule": "evenodd"
            }, null, -1)
          ])])) : k("", !0)
        ])),
        s("div", null, [
          s("p", {
            class: b([a.value, "text-sm"])
          }, [
            G(d.$slots, "default")
          ], 2)
        ])
      ])
    ], 2));
  }
}), vi = {
  key: 0,
  class: "rounded-md bg-green-50 dark:bg-green-200 p-4",
  role: "alert"
}, pi = { class: "flex" }, gi = { class: "ml-3" }, yi = { class: "text-sm font-medium text-green-800" }, hi = { key: 0 }, bi = { class: "ml-auto pl-3" }, wi = { class: "-mx-1.5 -my-1.5" }, ki = /* @__PURE__ */ ge({
  __name: "AlertSuccess",
  props: {
    message: {}
  },
  setup(e) {
    const t = M(!1);
    return (l, n) => t.value ? k("", !0) : (o(), u("div", vi, [
      s("div", pi, [
        n[2] || (n[2] = s("div", { class: "flex-shrink-0" }, [
          s("svg", {
            class: "h-5 w-5 text-green-400 dark:text-green-500",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            s("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M5 13l4 4L19 7"
            })
          ])
        ], -1)),
        s("div", gi, [
          s("h3", yi, [
            e.message ? (o(), u("span", hi, L(e.message), 1)) : G(l.$slots, "default", {}, void 0, void 0, 1)
          ])
        ]),
        s("div", bi, [
          s("div", wi, [
            s("button", {
              type: "button",
              class: "inline-flex rounded-md bg-green-50 dark:bg-green-200 p-1.5 text-green-500 dark:text-green-600 hover:bg-green-100 dark:hover:bg-green-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-green-50 dark:ring-offset-green-900",
              onClick: n[0] || (n[0] = (a) => t.value = !0)
            }, [...n[1] || (n[1] = [
              s("span", { class: "sr-only" }, "Dismiss", -1),
              s("svg", {
                class: "h-5 w-5",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                "aria-hidden": "true"
              }, [
                s("path", { d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" })
              ], -1)
            ])])
          ])
        ])
      ])
    ]));
  }
}), xi = { class: "flex" }, $i = { class: "ml-3" }, Ci = { class: "text-sm text-red-700 dark:text-red-200" }, oo = /* @__PURE__ */ ge({
  __name: "ErrorSummary",
  props: {
    status: {},
    except: {},
    class: {}
  },
  setup(e) {
    const t = e;
    let l = Pe("ApiState", void 0);
    const n = f(() => t.status || l?.error.value ? nr.call({ responseStatus: t.status ?? l?.error.value }, t.except ?? []) : null);
    return (a, d) => n.value ? (o(), u("div", {
      key: 0,
      class: b(`bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4 ${a.$props.class}`)
    }, [
      s("div", xi, [
        d[0] || (d[0] = s("div", { class: "flex-shrink-0" }, [
          s("svg", {
            class: "h-5 w-5 text-red-400",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              fill: "currentColor",
              d: "M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z"
            })
          ])
        ], -1)),
        s("div", $i, [
          s("p", Ci, L(n.value), 1)
        ])
      ])
    ], 2)) : k("", !0);
  }
}), Si = ["id", "aria-describedby"], Li = /* @__PURE__ */ ge({
  __name: "InputDescription",
  props: {
    id: {},
    description: {}
  },
  setup(e) {
    return (t, l) => e.description ? (o(), u("div", {
      key: "description",
      class: "mt-2 text-sm text-gray-500",
      id: `${e.id}-description`,
      "aria-describedby": `${e.id}-description`
    }, [
      s("div", null, L(e.description), 1)
    ], 8, Si)) : k("", !0);
  }
}), ro = ge({
  inheritAttrs: !1,
  props: {
    image: Object,
    svg: String,
    src: String,
    alt: String,
    type: String
  },
  setup(e, { attrs: t }) {
    return () => {
      let l = e.image;
      if (e.type) {
        const { typeOf: d } = gt(), i = d(e.type);
        i || console.warn(`Type ${e.type} does not exist`), i?.icon ? l = i?.icon : console.warn(`Type ${e.type} does not have a [Svg] icon`);
      }
      let n = e.svg || l?.svg || "";
      if (n.startsWith("<svg ")) {
        let i = an(n, ">").indexOf("class="), r = `${l?.cls || ""} ${t.class || ""}`;
        if (i == -1)
          n = `<svg class="${r}" ${n.substring(4)}`;
        else {
          const c = i + 6 + 1;
          n = `${n.substring(0, c) + r} ${n.substring(c)}`;
        }
        return Rt("span", { innerHTML: n });
      } else
        return Rt("img", {
          class: [l?.cls, t.class],
          src: us(e.src || l?.uri),
          onError: (d) => rn(d.target)
        });
    };
  }
}), Vi = { class: "text-2xl font-semibold text-gray-900 dark:text-gray-300" }, Mi = { class: "flex" }, Ai = /* @__PURE__ */ ge({
  __name: "Loading",
  props: {
    imageClass: { default: "w-6 h-6" }
  },
  setup(e) {
    return (t, l) => (o(), u("div", Vi, [
      s("div", Mi, [
        (o(), u("svg", {
          class: b(["self-center inline mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300", e.imageClass]),
          role: "status",
          viewBox: "0 0 100 101",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, [...l[0] || (l[0] = [
          s("path", {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
            fill: "currentColor"
          }, null, -1),
          s("path", {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
            fill: "currentFill"
          }, null, -1)
        ])], 2)),
        s("span", null, [
          G(t.$slots, "default")
        ])
      ])
    ]));
  }
}), Ti = ["href", "onClick"], ji = ["type"], qs = "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 disabled:text-gray-400 bg-white dark:bg-black hover:bg-gray-50 hover:dark:bg-gray-900 disabled:hover:bg-white dark:disabled:hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black", Oi = /* @__PURE__ */ ge({
  __name: "OutlineButton",
  props: {
    type: { default: "submit" },
    href: {}
  },
  setup(e) {
    return (t, l) => {
      const n = N("router-link");
      return e.href ? (o(), W(n, {
        key: 0,
        to: e.href
      }, {
        default: we(({ navigate: a }) => [
          s("button", {
            class: b(qs),
            href: e.href,
            onClick: a
          }, [
            G(t.$slots, "default")
          ], 8, Ti)
        ]),
        _: 3
      }, 8, ["to"])) : (o(), u("button", Se({
        key: 1,
        type: e.type,
        class: qs
      }, t.$attrs), [
        G(t.$slots, "default")
      ], 16, ji));
    };
  }
}), Fi = ["href", "onClick"], Ii = ["type"], ys = /* @__PURE__ */ ge({
  __name: "PrimaryButton",
  props: {
    type: { default: "submit" },
    href: {},
    color: { default: "indigo" }
  },
  setup(e) {
    const t = e, l = {
      blue: "focus:ring-blue-500 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      purple: "focus:ring-purple-500 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800",
      red: "focus:ring-red-500 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:hover:bg-red-400 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500",
      green: "focus:ring-green-500 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:hover:bg-green-400 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500",
      sky: "focus:ring-sky-500 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-500",
      cyan: "focus:ring-cyan-500 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 disabled:hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-500",
      indigo: "focus:ring-indigo-500 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
    }, n = f(() => "inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black text-white " + (l[t.color] || l.indigo));
    return (a, d) => {
      const i = N("router-link");
      return e.href ? (o(), W(i, {
        key: 0,
        to: e.href
      }, {
        default: we(({ navigate: r }) => [
          s("button", {
            class: b(n.value),
            href: e.href,
            onClick: r
          }, [
            G(a.$slots, "default")
          ], 10, Fi)
        ]),
        _: 3
      }, 8, ["to"])) : (o(), u("button", Se({
        key: 1,
        type: e.type,
        class: n.value
      }, a.$attrs), [
        G(a.$slots, "default")
      ], 16, Ii));
    };
  }
}), Pi = ["type", "href", "onClick"], Bi = ["type"], zs = "inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-black", io = /* @__PURE__ */ ge({
  __name: "SecondaryButton",
  props: {
    type: {},
    href: {}
  },
  setup(e) {
    return (t, l) => {
      const n = N("router-link");
      return e.href ? (o(), W(n, {
        key: 0,
        to: e.href
      }, {
        default: we(({ navigate: a }) => [
          s("button", {
            type: e.type ?? "button",
            class: b(zs),
            href: e.href,
            onClick: a
          }, [
            G(t.$slots, "default")
          ], 8, Pi)
        ]),
        _: 3
      }, 8, ["to"])) : (o(), u("button", Se({
        key: 1,
        type: e.type ?? "button",
        class: zs
      }, t.$attrs), [
        G(t.$slots, "default")
      ], 16, Bi));
    };
  }
}), Ei = /* @__PURE__ */ ge({
  __name: "TextLink",
  props: {
    color: { default: "blue" }
  },
  setup(e) {
    const t = Ro(), l = e, n = f(() => (tn[l.color] || tn.blue) + (t.href ? "" : " cursor-pointer"));
    return (a, d) => (o(), u("a", {
      class: b(n.value)
    }, [
      G(a.$slots, "default")
    ], 2));
  }
}), Di = {
  class: "flex",
  "aria-label": "Breadcrumb"
}, Ni = {
  role: "list",
  class: "flex items-center space-x-4"
}, Ri = ["href", "title"], Hi = { class: "sr-only" }, qi = /* @__PURE__ */ ge({
  __name: "Breadcrumbs",
  props: {
    homeHref: { default: "/" },
    homeLabel: { default: "Home" }
  },
  setup(e) {
    return (t, l) => (o(), u("nav", Di, [
      s("ol", Ni, [
        s("li", null, [
          s("div", null, [
            s("a", {
              href: e.homeHref,
              class: "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400",
              title: e.homeLabel
            }, [
              l[0] || (l[0] = s("svg", {
                class: "h-6 w-6 flex-shrink-0",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                "aria-hidden": "true"
              }, [
                s("path", {
                  "fill-rule": "evenodd",
                  d: "M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z",
                  "clip-rule": "evenodd"
                })
              ], -1)),
              s("span", Hi, L(e.homeLabel), 1)
            ], 8, Ri)
          ])
        ]),
        G(t.$slots, "default")
      ])
    ]));
  }
}), zi = { class: "flex items-center" }, Ui = ["href", "title"], Ki = ["title"], Qi = /* @__PURE__ */ ge({
  __name: "Breadcrumb",
  props: {
    href: {},
    title: {}
  },
  setup(e) {
    return (t, l) => (o(), u("li", null, [
      s("div", zi, [
        l[0] || (l[0] = s("svg", {
          class: "h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true"
        }, [
          s("path", {
            "fill-rule": "evenodd",
            d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
            "clip-rule": "evenodd"
          })
        ], -1)),
        e.href ? (o(), u("a", {
          key: 0,
          href: e.href,
          class: "ml-4 text-lg font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
          title: e.title
        }, [
          G(t.$slots, "default")
        ], 8, Ui)) : (o(), u("span", {
          key: 1,
          class: "ml-4 text-lg font-medium text-gray-700 dark:text-gray-300",
          title: e.title
        }, [
          G(t.$slots, "default")
        ], 8, Ki))
      ])
    ]));
  }
}), Ji = {
  key: 0,
  class: "text-base font-semibold text-gray-500 dark:text-gray-400"
}, Gi = {
  role: "list",
  class: "mt-4 divide-y divide-gray-200 dark:divide-gray-800 border-t border-b border-gray-200 dark:border-gray-800"
}, Wi = /* @__PURE__ */ ge({
  __name: "NavList",
  props: {
    title: {}
  },
  setup(e) {
    return (t, l) => (o(), u("div", null, [
      e.title ? (o(), u("h2", Ji, L(e.title), 1)) : k("", !0),
      s("ul", Gi, [
        G(t.$slots, "default")
      ])
    ]));
  }
}), Zi = { class: "relative flex items-start space-x-4 py-6" }, Xi = { class: "flex-shrink-0" }, Yi = { class: "flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900" }, _i = { class: "min-w-0 flex-1" }, eu = { class: "text-base font-medium text-gray-900 dark:text-gray-100" }, tu = { class: "rounded-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2" }, lu = ["href"], nu = { class: "text-base text-gray-500" }, su = /* @__PURE__ */ ge({
  __name: "NavListItem",
  props: {
    title: {},
    href: {},
    icon: {},
    iconSvg: {},
    iconSrc: {},
    iconAlt: {}
  },
  setup(e) {
    return (t, l) => {
      const n = N("Icon");
      return o(), u("li", Zi, [
        s("div", Xi, [
          s("span", Yi, [
            ve(n, {
              class: "w-6 h-6 text-indigo-700 dark:text-indigo-300",
              image: e.icon,
              src: e.iconSrc,
              svg: e.iconSvg,
              alt: e.iconAlt
            }, null, 8, ["image", "src", "svg", "alt"])
          ])
        ]),
        s("div", _i, [
          s("h3", eu, [
            s("span", tu, [
              s("a", {
                href: e.href,
                class: "focus:outline-none"
              }, [
                l[0] || (l[0] = s("span", {
                  class: "absolute inset-0",
                  "aria-hidden": "true"
                }, null, -1)),
                pe(" " + L(e.title), 1)
              ], 8, lu)
            ])
          ]),
          s("p", nu, [
            G(t.$slots, "default")
          ])
        ]),
        l[1] || (l[1] = s("div", { class: "flex-shrink-0 self-center" }, [
          s("svg", {
            class: "h-5 w-5 text-gray-400",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
              "clip-rule": "evenodd"
            })
          ])
        ], -1))
      ]);
    };
  }
}), au = { key: 0 }, ou = { class: "md:p-4" }, uo = /* @__PURE__ */ ge({
  __name: "EnsureAccess",
  props: {
    invalidAccess: {},
    alertClass: {}
  },
  emits: ["done"],
  setup(e) {
    const { isAuthenticated: t } = cl(), { config: l } = Ct(), n = () => {
      let d = location.href.substring(location.origin.length) || "/";
      const i = il(l.value.redirectSignIn, { redirect: d });
      l.value.navigate(i);
    }, a = () => {
      let d = location.href.substring(location.origin.length) || "/";
      const i = il(l.value.redirectSignOut, { ReturnUrl: d });
      l.value.navigate(i);
    };
    return (d, i) => {
      const r = N("Alert"), c = N("SecondaryButton");
      return e.invalidAccess ? (o(), u("div", au, [
        ve(r, {
          class: b(e.alertClass),
          innerHTML: e.invalidAccess
        }, null, 8, ["class", "innerHTML"]),
        s("div", ou, [
          ne(t) ? (o(), W(c, {
            key: 1,
            onClick: a
          }, {
            default: we(() => [...i[1] || (i[1] = [
              pe("Sign Out", -1)
            ])]),
            _: 1
          })) : (o(), W(c, {
            key: 0,
            onClick: n
          }, {
            default: we(() => [...i[0] || (i[0] = [
              pe("Sign In", -1)
            ])]),
            _: 1
          }))
        ])
      ])) : k("", !0);
    };
  }
}), ru = { class: "absolute top-0 right-0 bg-white dark:bg-black border dark:border-gray-800 rounded normal-case text-sm shadow w-80" }, iu = { class: "p-4" }, uu = { class: "flex w-full justify-center" }, du = { key: 0 }, cu = ["id", "value"], fu = ["for"], mu = { key: 1 }, vu = { class: "mb-2" }, pu = { class: "inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700" }, gu = ["onClick"], yu = { class: "flex" }, hu = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, hs = /* @__PURE__ */ ge({
  __name: "FilterColumn",
  props: {
    definitions: {},
    column: {},
    topLeft: {}
  },
  emits: ["done", "save"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = M(), d = M(""), i = M(""), r = M([]), c = f(() => l.column.meta.isEnum == !0), v = f(() => nt(l.column.meta.type === "Nullable`1" ? l.column.meta.genericArgs[0] : l.column.meta.type)), m = f(() => l.column.meta.isEnum == !0 ? ss(Sa(v.value.name)) : []), h = f(() => p(l.column.type)?.map((I) => ({ key: I.value, value: I.name })) || []), y = M({ filters: [] }), g = f(() => y.value.filters);
    rl(() => y.value = Object.assign({}, l.column.settings, {
      filters: Array.from(l.column.settings.filters)
    })), rl(() => {
      let I = l.column.settings.filters?.[0]?.value?.split(",") || [];
      if (I.length > 0 && v.value?.isEnumInt) {
        const O = I[0] && parseInt(I[0]) || 0;
        I = v.value.enumValues?.filter((ie) => (O & parseInt(ie)) > 0) || [];
      }
      r.value = I;
    });
    function p(I) {
      let O = l.definitions;
      return ka(I) || (O = O.filter((ie) => ie.types !== "string")), O;
    }
    function x(I, O) {
      return p(I).find((ie) => ie.value === O);
    }
    function w() {
      if (!d.value) return;
      let I = x(l.column.type, d.value)?.name;
      I && (y.value.filters.push({ key: d.value, name: I, value: i.value }), d.value = i.value = "");
    }
    function C(I) {
      y.value.filters.splice(I, 1);
    }
    function F(I) {
      return Ta(x(l.column.type, I.key), l.column.type, I);
    }
    function B() {
      n("done");
    }
    function E() {
      d.value = "%", a.value?.focus();
    }
    function _() {
      if (i.value && w(), c.value) {
        let I = Object.values(r.value).filter((O) => O);
        y.value.filters = I.length > 0 ? v.value?.isEnumInt ? [{ key: "%HasAny", name: "HasAny", value: I.map((O) => parseInt(O)).reduce((O, ie) => O + ie, 0).toString() }] : [{ key: "%In", name: "In", value: I.join(",") }] : [];
      }
      n("save", y.value), n("done");
    }
    function X(I) {
      y.value.sort = I === y.value.sort ? void 0 : I, jt(_);
    }
    return (I, O) => {
      const ie = N("SelectInput"), se = N("TextInput"), P = N("PrimaryButton"), z = N("SecondaryButton");
      return o(), u("div", {
        class: "fixed z-20 inset-0 overflow-y-auto",
        onClick: B,
        onVnodeMounted: E
      }, [
        s("div", {
          class: "absolute",
          style: Un(`top:${e.topLeft.y}px;left:${e.topLeft.x}px`),
          onClick: O[5] || (O[5] = Ee(() => {
          }, ["stop"]))
        }, [
          s("div", ru, [
            s("div", iu, [
              O[10] || (O[10] = s("h3", { class: "text-base font-medium mb-3 dark:text-gray-100" }, "Sort", -1)),
              s("div", uu, [
                s("button", {
                  type: "button",
                  title: "Sort Ascending",
                  onClick: O[0] || (O[0] = (K) => X("ASC")),
                  class: b(`${y.value.sort === "ASC" ? "bg-indigo-100 border-indigo-500" : "bg-white hover:bg-gray-50 border-gray-300"} mr-1 inline-flex items-center px-2.5 py-1.5 border shadow-sm text-sm font-medium rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`)
                }, [...O[6] || (O[6] = [
                  s("svg", {
                    class: "w-6 h-6",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 16 16"
                  }, [
                    s("g", { fill: "currentColor" }, [
                      s("path", {
                        "fill-rule": "evenodd",
                        d: "M10.082 5.629L9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"
                      }),
                      s("path", { d: "M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999l.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z" })
                    ])
                  ], -1),
                  s("span", null, "ASC", -1)
                ])], 2),
                s("button", {
                  type: "button",
                  title: "Sort Descending",
                  onClick: O[1] || (O[1] = (K) => X("DESC")),
                  class: b(`${y.value.sort === "DESC" ? "bg-indigo-100 border-indigo-500" : "bg-white hover:bg-gray-50 border-gray-300"} ml-1 inline-flex items-center px-2.5 py-1.5 border shadow-sm text-sm font-medium rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`)
                }, [...O[7] || (O[7] = [
                  nn('<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill="currentColor"><path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"></path><path fill-rule="evenodd" d="M10.082 12.629L9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"></path><path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999l.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"></path></g></svg><span>DESC</span>', 2)
                ])], 2)
              ]),
              O[11] || (O[11] = s("h3", { class: "text-base font-medium mt-4 mb-2" }, " Filter ", -1)),
              c.value ? (o(), u("div", du, [
                (o(!0), u(he, null, be(m.value, (K) => (o(), u("div", {
                  key: K.key,
                  class: "flex items-center"
                }, [
                  Ot(s("input", {
                    type: "checkbox",
                    id: K.key,
                    value: K.key,
                    "onUpdate:modelValue": O[2] || (O[2] = (T) => r.value = T),
                    class: "h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                  }, null, 8, cu), [
                    [Kn, r.value]
                  ]),
                  s("label", {
                    for: K.key,
                    class: "ml-3"
                  }, L(K.value), 9, fu)
                ]))), 128))
              ])) : (o(), u("div", mu, [
                (o(!0), u(he, null, be(g.value, (K, T) => (o(), u("div", vu, [
                  s("span", pu, [
                    pe(L(e.column.name) + " " + L(K.name) + " " + L(F(K)) + " ", 1),
                    s("button", {
                      type: "button",
                      onClick: (Z) => C(T),
                      class: "flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                    }, [...O[8] || (O[8] = [
                      s("svg", {
                        class: "h-2 w-2",
                        stroke: "currentColor",
                        fill: "none",
                        viewBox: "0 0 8 8"
                      }, [
                        s("path", {
                          "stroke-linecap": "round",
                          "stroke-width": "1.5",
                          d: "M1 1l6 6m0-6L1 7"
                        })
                      ], -1)
                    ])], 8, gu)
                  ])
                ]))), 256)),
                s("div", yu, [
                  ve(ie, {
                    id: "filterRule",
                    class: "w-32 mr-1",
                    modelValue: d.value,
                    "onUpdate:modelValue": O[3] || (O[3] = (K) => d.value = K),
                    entries: h.value,
                    label: "",
                    placeholder: ""
                  }, null, 8, ["modelValue", "entries"]),
                  x(e.column.type, d.value)?.valueType !== "none" ? (o(), W(se, {
                    key: 0,
                    ref_key: "txtFilter",
                    ref: a,
                    id: "filterValue",
                    class: "w-32 mr-1",
                    type: "text",
                    modelValue: i.value,
                    "onUpdate:modelValue": O[4] || (O[4] = (K) => i.value = K),
                    onKeyup: sn(w, ["enter"]),
                    label: "",
                    placeholder: ""
                  }, null, 8, ["modelValue"])) : k("", !0),
                  s("div", { class: "pt-1" }, [
                    s("button", {
                      type: "button",
                      onClick: w,
                      class: "inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }, [...O[9] || (O[9] = [
                      s("svg", {
                        class: "h-6 w-6",
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        "aria-hidden": "true"
                      }, [
                        s("path", {
                          "fill-rule": "evenodd",
                          d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                          "clip-rule": "evenodd"
                        })
                      ], -1)
                    ])])
                  ])
                ])
              ]))
            ]),
            s("div", hu, [
              ve(P, {
                onClick: _,
                color: "red",
                class: "ml-2"
              }, {
                default: we(() => [...O[12] || (O[12] = [
                  pe(" Save ", -1)
                ])]),
                _: 1
              }),
              ve(z, { onClick: B }, {
                default: we(() => [...O[13] || (O[13] = [
                  pe(" Cancel ", -1)
                ])]),
                _: 1
              })
            ])
          ])
        ], 4)
      ], 512);
    };
  }
}), bu = { class: "px-4 sm:px-6 lg:px-8 text-sm" }, wu = { class: "flex flex-wrap" }, ku = { class: "group pr-4 sm:pr-6 lg:pr-8" }, xu = { class: "flex justify-between w-full font-medium" }, $u = { class: "w-6 flex justify-end" }, Cu = { class: "hidden group-hover:inline" }, Su = ["onClick", "title"], Lu = {
  key: 0,
  class: "pt-2"
}, Vu = { class: "ml-2" }, Mu = { key: 1 }, Au = { class: "pt-2" }, Tu = { class: "inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700" }, ju = ["onClick"], bs = /* @__PURE__ */ ge({
  __name: "FilterViews",
  props: {
    definitions: {},
    columns: {}
  },
  emits: ["done", "change"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = f(() => l.columns.filter((y) => y.settings.filters.length > 0));
    function d(y) {
      return y?.[0]?.value?.split(",");
    }
    function i(y) {
      let g = l.definitions;
      return ka(y) || (g = g.filter((p) => p.types !== "string")), g;
    }
    function r(y, g) {
      return i(y).find((p) => p.value === g);
    }
    function c(y, g) {
      return Ta(r(y.type, g.value), y.type, g);
    }
    function v(y) {
      y.settings.filters = [], n("change", y);
    }
    function m(y, g) {
      y.settings.filters.splice(g, 1), n("change", y);
    }
    function h() {
      l.columns.forEach((y) => {
        y.settings.filters = [], n("change", y);
      }), n("done");
    }
    return (y, g) => (o(), u("div", bu, [
      s("div", wu, [
        (o(!0), u(he, null, be(a.value, (p) => (o(), u("fieldset", ku, [
          s("legend", xu, [
            s("span", null, L(ne(je)(p.name)), 1),
            s("span", $u, [
              s("span", Cu, [
                s("button", {
                  onClick: (x) => v(p),
                  title: `Clear all ${ne(je)(p.name)} filters`,
                  class: "flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-600 hover:bg-red-200 hover:text-red-500 focus:outline-none focus:bg-red-500 focus:text-white"
                }, [...g[0] || (g[0] = [
                  s("svg", {
                    class: "h-2 w-2",
                    stroke: "currentColor",
                    fill: "none",
                    viewBox: "0 0 8 8"
                  }, [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-width": "1.5",
                      d: "M1 1l6 6m0-6L1 7"
                    })
                  ], -1)
                ])], 8, Su)
              ])
            ])
          ]),
          p.meta.isEnum ? (o(), u("div", Lu, [
            (o(!0), u(he, null, be(d(p.settings.filters), (x) => (o(), u("div", {
              key: x,
              class: "flex items-center"
            }, [
              s("label", Vu, L(x), 1)
            ]))), 128))
          ])) : (o(), u("div", Mu, [
            (o(!0), u(he, null, be(p.settings.filters, (x, w) => (o(), u("div", Au, [
              s("span", Tu, [
                pe(L(p.name) + " " + L(x.name) + " " + L(c(p, x)) + " ", 1),
                s("button", {
                  type: "button",
                  onClick: (C) => m(p, w),
                  class: "flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                }, [...g[1] || (g[1] = [
                  s("svg", {
                    class: "h-2 w-2",
                    stroke: "currentColor",
                    fill: "none",
                    viewBox: "0 0 8 8"
                  }, [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-width": "1.5",
                      d: "M1 1l6 6m0-6L1 7"
                    })
                  ], -1)
                ])], 8, ju)
              ])
            ]))), 256))
          ]))
        ]))), 256))
      ]),
      s("div", { class: "flex justify-center pt-4" }, [
        s("button", {
          type: "button",
          onClick: h,
          class: "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }, [...g[2] || (g[2] = [
          s("span", null, "Clear All", -1)
        ])])
      ])
    ]));
  }
}), Ou = { class: "bg-white dark:bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, Fu = { class: "" }, Iu = { class: "mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left" }, Pu = { class: "mt-4" }, Bu = ["for"], Eu = ["id"], Du = ["value", "selected"], Nu = { class: "mt-4 flex items-center py-4 border-b border-gray-200 dark:border-gray-800" }, Ru = ["id", "checked"], Hu = ["for"], qu = { class: "mt-4" }, zu = { class: "pb-2 px-4" }, Uu = { class: "" }, Ku = ["id", "value"], Qu = ["for"], Ju = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, ws = /* @__PURE__ */ ge({
  __name: "QueryPrefs",
  props: {
    id: { default: "QueryPrefs" },
    columns: {},
    prefs: {},
    maxLimit: {}
  },
  emits: ["done", "save"],
  setup(e, { emit: t }) {
    const { autoQueryGridDefaults: l } = Ct(), n = e, a = t, d = M({});
    rl(() => d.value = Object.assign({
      take: l.value.take,
      selectedColumns: []
    }, n.prefs));
    const i = [10, 25, 50, 100, 250, 500, 1e3];
    function r() {
      a("done");
    }
    function c() {
      a("save", d.value);
    }
    return (v, m) => {
      const h = N("PrimaryButton"), y = N("SecondaryButton"), g = N("ModalDialog");
      return o(), W(g, {
        id: e.id,
        onDone: r,
        "size-class": "w-full sm:max-w-prose"
      }, {
        default: we(() => [
          s("div", Ou, [
            s("div", Fu, [
              s("div", Iu, [
                m[3] || (m[3] = s("h3", { class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" }, "Query Preferences", -1)),
                s("div", Pu, [
                  s("label", {
                    for: `${e.id}-take`,
                    class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                  }, "Results per page", 8, Bu),
                  Ot(s("select", {
                    id: `${e.id}-take`,
                    "onUpdate:modelValue": m[0] || (m[0] = (p) => d.value.take = p),
                    class: "mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-black border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  }, [
                    (o(!0), u(he, null, be(i.filter((p) => n.maxLimit == null || p <= n.maxLimit), (p) => (o(), u("option", {
                      value: p,
                      selected: p === d.value.take
                    }, L(p), 9, Du))), 256))
                  ], 8, Eu), [
                    [Ho, d.value.take]
                  ])
                ]),
                s("div", Nu, [
                  s("input", {
                    type: "radio",
                    id: `${e.id}-allColumns`,
                    onClick: m[1] || (m[1] = (p) => d.value.selectedColumns = []),
                    checked: d.value.selectedColumns.length === 0,
                    class: "focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-black text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-gray-700"
                  }, null, 8, Ru),
                  s("label", {
                    class: "ml-3 block text-gray-700 dark:text-gray-300",
                    for: `${e.id}-allColumns`
                  }, "View all columns", 8, Hu)
                ]),
                s("div", qu, [
                  s("div", zu, [
                    s("div", Uu, [
                      (o(!0), u(he, null, be(e.columns, (p) => (o(), u("div", {
                        key: p.name,
                        class: "flex items-center"
                      }, [
                        Ot(s("input", {
                          type: "checkbox",
                          id: p.name,
                          value: p.name,
                          "onUpdate:modelValue": m[2] || (m[2] = (x) => d.value.selectedColumns = x),
                          class: "h-4 w-4 bg-white dark:bg-black border-gray-300 dark:border-gray-700 rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                        }, null, 8, Ku), [
                          [Kn, d.value.selectedColumns]
                        ]),
                        s("label", {
                          for: p.name,
                          class: "ml-3"
                        }, L(p.name), 9, Qu)
                      ]))), 128))
                    ])
                  ])
                ])
              ])
            ])
          ]),
          s("div", Ju, [
            ve(h, {
              onClick: c,
              color: "red",
              class: "ml-2"
            }, {
              default: we(() => [...m[4] || (m[4] = [
                pe(" Save ", -1)
              ])]),
              _: 1
            }),
            ve(y, { onClick: r }, {
              default: we(() => [...m[5] || (m[5] = [
                pe(" Cancel ", -1)
              ])]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["id"]);
    };
  }
}), Gu = { key: 0 }, Wu = { key: 1 }, Zu = {
  key: 2,
  class: "pt-1"
}, Xu = { key: 0 }, Yu = { key: 1 }, _u = { key: 2 }, ed = { key: 4 }, td = { class: "pl-1 pt-1 flex flex-wrap" }, ld = { class: "flex mt-1" }, nd = ["title"], sd = ["disabled"], ad = ["disabled"], od = ["disabled"], rd = ["disabled"], id = {
  key: 0,
  class: "flex mt-1"
}, ud = { class: "px-4 text-lg text-black dark:text-white" }, dd = { key: 0 }, cd = { key: 1 }, fd = { key: 2 }, md = { class: "flex flex-wrap" }, vd = {
  key: 0,
  class: "pl-2 mt-1"
}, pd = {
  key: 1,
  class: "pl-2 mt-1"
}, gd = {
  key: 2,
  class: "pl-2 mt-1"
}, yd = {
  key: 0,
  class: "w-5 h-5 mr-1 text-green-600 dark:text-green-400",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, hd = {
  key: 1,
  class: "w-5 h-5 mr-1",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, bd = {
  key: 3,
  class: "pl-2 mt-1"
}, wd = {
  key: 4,
  class: "pl-2 mt-1"
}, kd = { class: "mr-1" }, xd = {
  key: 0,
  class: "h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, $d = {
  key: 1,
  class: "h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, Cd = {
  key: 5,
  class: "pl-2 mt-1"
}, Sd = ["title"], Ld = { class: "whitespace-nowrap" }, Vd = { key: 8 }, Md = {
  key: 0,
  class: "cursor-pointer flex justify-between items-center hover:text-gray-900 dark:hover:text-gray-50"
}, Ad = { class: "mr-1 select-none" }, Td = {
  key: 1,
  class: "flex justify-between items-center"
}, jd = { class: "mr-1 select-none" }, Rl = 25, Od = /* @__PURE__ */ ge({
  __name: "AutoQueryGrid",
  props: {
    filterDefinitions: {},
    id: { default: "AutoQueryGrid" },
    ctx: {},
    apis: {},
    type: {},
    prefs: {},
    deny: {},
    hide: {},
    selectedColumns: {},
    toolbarButtonClass: {},
    tableStyle: {},
    gridClass: {},
    grid2Class: {},
    grid3Class: {},
    grid4Class: {},
    tableClass: {},
    theadClass: {},
    tbodyClass: {},
    theadRowClass: {},
    theadCellClass: {},
    headerTitle: {},
    headerTitles: {},
    visibleFrom: {},
    rowClass: {},
    rowStyle: {},
    modelTitle: {},
    newButtonLabel: {},
    apiPrefs: {},
    canFilter: {},
    disableKeyBindings: {},
    configureField: {},
    skip: { default: 0 },
    create: { type: Boolean },
    edit: {},
    filters: {}
  },
  emits: ["headerSelected", "rowSelected", "nav"],
  setup(e, { expose: t, emit: l }) {
    const { config: n, autoQueryGridDefaults: a } = Ct(), d = a, i = n.value.storage, r = e, c = l, v = Pe("client"), m = f(() => qo(r.ctx ?? At.createContext({
      id: r.id,
      type: r.type,
      apis: r.apis
    }))), h = "filtering,queryString,queryFilters".split(","), y = "copyApiUrl,downloadCsv,filtersView,newItem,pagingInfo,pagingNav,preferences,refresh,resetPreferences,toolbar,forms".split(","), g = f(() => r.deny ? zt(h, r.deny) : zt(h, d.value.deny)), p = f(() => r.hide ? zt(y, r.hide) : zt(y, d.value.hide));
    function x(H) {
      return g.value[H];
    }
    function w(H) {
      return p.value[H];
    }
    const C = f(() => r.tableStyle ?? d.value.tableStyle), F = f(() => r.gridClass ?? ke.getGridClass(C.value)), B = f(() => r.grid2Class ?? ke.getGrid2Class(C.value)), E = f(() => r.grid3Class ?? ke.getGrid3Class(C.value)), _ = f(() => r.grid4Class ?? ke.getGrid4Class(C.value)), X = f(() => r.tableClass ?? ke.getTableClass(C.value)), I = f(() => r.theadClass ?? ke.getTheadClass(C.value)), O = f(() => r.theadRowClass ?? ke.getTheadRowClass(C.value)), ie = f(() => r.theadCellClass ?? ke.getTheadCellClass(C.value)), se = f(() => r.toolbarButtonClass ?? ke.toolbarButtonClass);
    function P(H, q) {
      if (r.rowClass) return r.rowClass(H, q);
      const xe = !!Ve.value.AnyUpdate, Ae = (Ne.value?.name ? me(H, Ne.value.name) : null) == U.value;
      return ke.getTableRowClass(r.tableStyle, q, Ae, xe);
    }
    const z = ml(), T = Object.keys(z).map((H) => H.toLowerCase()), Z = f(() => m.value.viewModelProps.filter((H) => T.includes(H.name.toLowerCase()) || T.includes(H.name.toLowerCase() + "-header")).map((H) => H.name));
    function A() {
      let H = sl(r.selectedColumns);
      return H.length > 0 ? H : Z.value.length > 0 ? Z.value : [];
    }
    const S = f(() => {
      let q = A().map((ye) => ye.toLowerCase());
      const xe = m.value.viewModelProps;
      return q.length > 0 ? q.map((ye) => xe.find((Ae) => Ae.name.toLowerCase() === ye)).filter((ye) => ye != null) : xe;
    }), j = f(() => {
      const H = m.value.viewModelProps;
      let xe = A().map((Ce) => Ce.toLowerCase()), ye = xe.length > 0 ? xe.map((Ce) => H.find((Ze) => Ze.name.toLowerCase() === Ce)).filter((Ce) => Ce != null).map((Ce) => Ce.name) : H.map((Ce) => Ce.name), Ae = sl(J.value.selectedColumns).map((Ce) => Ce.toLowerCase());
      return Ae.length > 0 ? ye.filter((Ce) => Ae.includes(Ce.toLowerCase())) : ye;
    }), fe = M([]), V = Wl(new tt()), $ = Wl(new tt()), te = M(), ae = M(!1), U = M(), Q = M(), R = M(!1), ce = M(), ue = M(r.skip), D = M(!1), J = M({ take: Rl }), oe = M(!1), re = f(() => fe.value.some((H) => H.settings.filters.length > 0 || !!H.settings.sort) || J.value.selectedColumns), de = f(() => fe.value.map((H) => H.settings.filters.length).reduce((H, q) => H + q, 0)), Te = f(() => m.value.dataModelProps), Ne = f(() => m.value.dataModelPrimaryKey), $e = f(() => J.value.take ?? Rl), Le = f(() => (V.value.response ? me(V.value.response, "results") : null) ?? []), Me = f(() => (V.value.response?.total || Le.value.length) ?? 0), Je = f(() => ue.value > 0), ut = f(() => ue.value > 0), Bt = f(() => Le.value.length >= $e.value), Et = f(() => Le.value.length >= $e.value), Ge = M(), rt = M(), dt = {
      NoQuery: "No Query API was found"
    };
    t({
      update: it,
      search: Vs,
      createRequestArgs: gn,
      reset: Is,
      createDone: yl,
      createSave: wn,
      editDone: Dt,
      editSave: Yt,
      forceUpdate: St,
      setEdit: De,
      edit: Q,
      createForm: Ge,
      editForm: rt,
      apiPrefs: J,
      results: Le,
      skip: ue,
      take: $e,
      total: Me
    }), ee.interceptors.has("AutoQueryGrid.new") && ee.interceptors.invoke("AutoQueryGrid.new", { props: r });
    function Ue(H) {
      if (H) {
        if (r.canFilter)
          return r.canFilter(H);
        const q = Te.value.find((xe) => xe.name.toLowerCase() == H.toLowerCase());
        if (q)
          return !xa(q);
      }
      return !1;
    }
    function st(H) {
      c("nav", H), x("queryString") && ds(H);
    }
    async function ct(H) {
      ue.value += H, ue.value < 0 && (ue.value = 0);
      const q = Math.floor(Me.value / $e.value) * $e.value;
      ue.value > q && (ue.value = q), st({ skip: ue.value || void 0 }), await it();
    }
    async function le(H, q) {
      if (Q.value = null, U.value = q, !H || !q) return;
      let xe = Ll(Ve.value.AnyQuery, { [H]: q });
      const ye = await v.api(xe);
      if (ye.succeeded) {
        let Ae = me(ye.response, "results")?.[0];
        Ae || console.warn(`API ${Ve.value.AnyQuery?.request.name}(${H}:${q}) returned no results`), Q.value = Ae;
      }
    }
    async function Y(H, q) {
      c("rowSelected", H, q);
      const xe = Ne.value?.name, ye = xe ? me(H, xe) : null;
      !xe || !ye || (st({ edit: ye }), le(xe, ye));
    }
    function Oe(H, q) {
      if (!x("filtering")) return;
      let xe = q.target;
      if (Ue(H) && xe?.tagName !== "TD") {
        let ye = xe?.closest("TABLE")?.getBoundingClientRect(), Ae = fe.value.find((Ce) => Ce.name.toLowerCase() == H.toLowerCase());
        if (Ae && ye) {
          let Ce = 318, Ze = ye.x + Ce + 10;
          ce.value = {
            column: Ae,
            topLeft: {
              x: Math.max(Math.floor(q.clientX + Ce / 2), Ze),
              y: ye.y + 45
            }
          };
        }
      }
      c("headerSelected", H, q);
    }
    function Ie() {
      ce.value = null;
    }
    async function We(H) {
      let q = ce.value?.column;
      q && (q.settings = H, i.setItem(Pl(q.name), JSON.stringify(q.settings)), await it()), ce.value = null;
    }
    async function ft(H) {
      i.setItem(Pl(H.name), JSON.stringify(H.settings)), await it();
    }
    async function Wt(H) {
      R.value = !1, J.value = H, i.setItem(yn(), JSON.stringify(H)), await it();
    }
    function Zt(H) {
      Ge.value && (Object.assign(Ge.value?.model, H), St());
    }
    function De(H) {
      Object.assign(Q.value, H), St();
    }
    function St() {
      Ge.value?.forceUpdate(), rt.value?.forceUpdate(), Fe()?.proxy?.$forceUpdate();
    }
    async function it() {
      await Vs(gn());
    }
    async function To() {
      await it();
    }
    const jo = /iPad|iPhone|iPod/.test(navigator.userAgent);
    async function Vs(H) {
      const q = Ve.value.AnyQuery;
      if (!q) {
        console.error(dt.NoQuery);
        return;
      }
      let xe = Ll(q, H), ye = await v.api(xe);
      fa((Ze) => {
        oe.value = Ze, jo ? jt(() => V.value = ye) : V.value = ye;
      })();
      let Ce = me(ye.response, "results") || [];
      !ye.succeeded || Ce.label == 0;
    }
    function gn() {
      let H = {
        include: "total",
        take: $e.value
      }, q = sl(J.value.selectedColumns || r.selectedColumns);
      if (q.length > 0) {
        let ye = Ne.value;
        ye && !q.includes(ye.name) && (q = [ye.name, ...q]);
        const Ae = Te.value, Ce = [];
        q.forEach((Ze) => {
          const _t = Ae.find((Nt) => Nt.name.toLowerCase() == Ze.toLowerCase());
          _t?.ref?.selfId && Ce.push(_t.ref.selfId), me(z, Ze) && Ce.push(...Ae.filter((Nt) => Nt.ref?.selfId?.toLowerCase() == Ze.toLowerCase()).map((Nt) => Nt.name));
        }), Ce.forEach((Ze) => {
          q.includes(Ze) || q.push(Ze);
        }), H.fields = lo(q).join(",");
      }
      let xe = [];
      if (fe.value.forEach((ye) => {
        ye.settings.sort && xe.push((ye.settings.sort === "DESC" ? "-" : "") + ye.name), ye.settings.filters.forEach((Ae) => {
          let Ce = Ae.key.replace("%", ye.name);
          H[Ce] = Ae.value;
        });
      }), r.filters && Object.keys(r.filters).forEach((ye) => {
        H[ye] = r.filters[ye];
      }), x("queryString") && x("queryFilters")) {
        const ye = location.search ? location.search : location.hash.includes("?") ? "?" + zl(location.hash, "?") : "";
        let Ae = Vn(ye);
        if (Object.keys(Ae).forEach((Ce) => {
          S.value.find((_t) => _t.name.toLowerCase() === Ce.toLowerCase()) && (H[Ce] = Ae[Ce]);
        }), typeof Ae.skip < "u") {
          const Ce = parseInt(Ae.skip);
          isNaN(Ce) || (H.skip = Ce);
        }
      }
      return typeof H.skip > "u" && ue.value > 0 && (H.skip = ue.value), xe.length > 0 && (H.orderBy = xe.join(",")), H;
    }
    function Oo() {
      const H = Ms("csv");
      Pn(H), typeof window < "u" && window.open(H);
    }
    function Fo() {
      const H = Ms("json");
      Pn(H), D.value = !0, setTimeout(() => D.value = !1, 3e3);
    }
    function Ms(H = "json") {
      const q = gn(), xe = `/api/${Ve.value.AnyQuery?.request.name}`, ye = sr(v.baseUrl, il(xe, { ...q, jsconfig: "edv" }));
      return ye.indexOf("?") >= 0 ? an(ye, "?") + "." + H + "?" + zl(ye, "?") : ye + ".json";
    }
    async function Io() {
      fe.value.forEach((H) => {
        H.settings = { filters: [] }, i.removeItem(Pl(H.name));
      }), J.value = { take: Rl }, i.removeItem(yn()), await it();
    }
    function Po() {
      ae.value = !0, st({ create: null });
    }
    const Xt = f(() => m.value.dataModelName), gl = f(() => r.modelTitle || Xt.value), Bo = f(() => r.newButtonLabel || `New ${gl.value}`), yn = () => m.value.prefsCacheKey(), Pl = (H) => m.value.columnCacheKey(H), { invalidAccessMessage: hn } = cl(), As = f(() => r.filterDefinitions || m.value.filterDefinitions), Ve = f(() => m.value.apis), Bl = (H) => `<span class="text-yellow-700">${H}</span>`, Ts = f(() => {
      if (!m.value.metadataApi)
        return Bl(`AppMetadata not loaded, see <a class="${tn.blue}" href="https://docs.servicestack.net/vue/use-metadata" target="_blank">useMetadata()</a>`);
      let H = m.value.invalidApis;
      if (H.length > 0)
        return Bl(`Unknown API${H.length > 1 ? "s" : ""}: ${H.join(", ")}`);
      let q = Ve.value;
      return q.empty ? Bl("Mising DataModel in property 'type' or AutoQuery APIs to use in property 'apis'") : q.AnyQuery ? null : Bl(dt.NoQuery);
    }), js = f(() => Ve.value.AnyQuery && hn(Ve.value.AnyQuery)), Os = f(() => Ve.value.Create && hn(Ve.value.Create)), Fs = f(() => Ve.value.AnyUpdate && hn(Ve.value.AnyUpdate)), Eo = f(() => $l(Ve.value.Create));
    f(() => $l(Ve.value.AnyUpdate));
    const bn = f(() => $l(Ve.value.Delete));
    function Dt() {
      Q.value = null, U.value = null, st({ edit: void 0 });
    }
    function yl() {
      ae.value = !1, st({ create: void 0 });
    }
    async function Yt() {
      await it(), Dt();
    }
    async function wn() {
      await it(), yl();
    }
    function Is() {
      V.value = new tt(), $.value = new tt(), ae.value = !1, U.value = null, Q.value = null, R.value = !1, ce.value = null, ue.value = r.skip, D.value = !1, J.value = { take: Rl }, oe.value = !1;
      const H = r.prefs || en(i.getItem(yn()));
      H && (J.value = H), fe.value = S.value.map((xe) => ({
        name: xe.name,
        type: xe.type,
        meta: xe,
        settings: Object.assign(
          {
            filters: []
          },
          en(i.getItem(Pl(xe.name)))
        )
      })), isNaN(r.skip) || (ue.value = r.skip);
      let q = Ne.value?.name;
      if (x("queryString")) {
        const xe = location.search ? location.search : location.hash.includes("?") ? "?" + zl(location.hash, "?") : "";
        let ye = Vn(xe);
        typeof ye.create < "u" ? ae.value = typeof ye.create < "u" : q && (typeof ye.edit == "string" || typeof ye.edit == "number") && le(q, ye.edit);
      }
      r.create === !0 && (ae.value = !0), q && r.edit != null && le(q, r.edit);
    }
    return ze(async () => {
      Is(), await jt(), await it();
    }), (H, q) => {
      const xe = N("Alert"), ye = N("EnsureAccessDialog"), Ae = N("AutoCreateForm"), Ce = N("AutoEditForm"), Ze = N("AutoViewForm"), _t = N("ErrorSummary"), Ps = N("Loading"), Nt = N("SettingsIcons"), Do = N("DataGrid");
      return Ts.value ? (o(), u("div", Gu, [
        ve(xe, { innerHTML: Ts.value }, null, 8, ["innerHTML"])
      ])) : js.value ? (o(), u("div", Wu, [
        ve(uo, { "invalid-access": js.value }, null, 8, ["invalid-access"])
      ])) : (o(), u("div", Zu, [
        w("forms") && ae.value && Ve.value.Create ? (o(), u("div", Xu, [
          Os.value ? (o(), W(ye, {
            key: 0,
            title: `Create ${gl.value}`,
            "invalid-access": Os.value,
            "alert-class": "text-yellow-700",
            onDone: yl
          }, null, 8, ["title", "invalid-access"])) : ne(z).createform ? G(H.$slots, "createform", {
            type: Ve.value.Create.request.name,
            configure: e.configureField,
            done: yl,
            save: wn
          }, void 0, void 0, 1) : (o(), W(Ae, {
            key: 2,
            ref_key: "createForm",
            ref: Ge,
            type: Ve.value.Create.request.name,
            configure: e.configureField,
            onDone: yl,
            onSave: wn
          }, {
            header: we(() => [
              G(H.$slots, "formheader", {
                form: "create",
                formInstance: Ge.value,
                apis: Ve.value,
                type: Xt.value,
                updateModel: Zt
              })
            ]),
            footer: we(() => [
              G(H.$slots, "formfooter", {
                form: "create",
                formInstance: Ge.value,
                apis: Ve.value,
                type: Xt.value,
                updateModel: Zt
              })
            ]),
            _: 3
          }, 8, ["type", "configure"]))
        ])) : w("forms") && Q.value && Ve.value.AnyUpdate ? (o(), u("div", Yu, [
          Fs.value ? (o(), W(ye, {
            key: 0,
            title: `Update ${gl.value}`,
            "invalid-access": Fs.value,
            "alert-class": "text-yellow-700",
            onDone: Dt
          }, null, 8, ["title", "invalid-access"])) : ne(z).editform ? G(H.$slots, "editform", {
            model: Q.value,
            type: Ve.value.AnyUpdate.request.name,
            deleteType: bn.value ? Ve.value.Delete.request.name : null,
            configure: e.configureField,
            done: Dt,
            save: Yt
          }, void 0, void 0, 1) : (o(), W(Ce, {
            key: 2,
            ref_key: "editForm",
            ref: rt,
            modelValue: Q.value,
            "onUpdate:modelValue": q[0] || (q[0] = (Ke) => Q.value = Ke),
            type: Ve.value.AnyUpdate.request.name,
            deleteType: bn.value ? Ve.value.Delete.request.name : null,
            configure: e.configureField,
            onDone: Dt,
            onSave: Yt,
            onDelete: Yt
          }, {
            header: we(() => [
              G(H.$slots, "formheader", {
                form: "edit",
                formInstance: rt.value,
                apis: Ve.value,
                type: Xt.value,
                model: Q.value,
                id: U.value,
                updateModel: De
              })
            ]),
            footer: we(() => [
              G(H.$slots, "formfooter", {
                form: "edit",
                formInstance: rt.value,
                apis: Ve.value,
                type: Xt.value,
                model: Q.value,
                id: U.value,
                updateModel: De
              })
            ]),
            _: 3
          }, 8, ["modelValue", "type", "deleteType", "configure"]))
        ])) : w("forms") && Q.value ? (o(), u("div", _u, [
          ne(z).viewform ? G(H.$slots, "viewform", {
            model: Q.value,
            apis: Ve.value,
            done: Dt
          }, void 0, void 0, 0) : (o(), W(Ze, {
            key: 1,
            model: Q.value,
            apis: Ve.value,
            deleteType: bn.value ? Ve.value.Delete.request.name : null,
            done: Dt,
            onSave: Yt,
            onDelete: Yt
          }, null, 8, ["model", "apis", "deleteType"]))
        ])) : k("", !0),
        ne(z).toolbar ? G(H.$slots, "toolbar", {}, void 0, void 0, 3) : w("toolbar") ? (o(), u("div", ed, [
          R.value ? (o(), W(ws, {
            key: 0,
            columns: S.value,
            prefs: J.value,
            onDone: q[1] || (q[1] = (Ke) => R.value = !1),
            onSave: Wt
          }, null, 8, ["columns", "prefs"])) : k("", !0),
          s("div", td, [
            s("div", ld, [
              w("preferences") ? (o(), u("button", {
                key: 0,
                type: "button",
                class: "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                title: `${gl.value} Preferences`,
                onClick: q[2] || (q[2] = (Ke) => R.value = !R.value)
              }, [...q[9] || (q[9] = [
                s("svg", {
                  class: "w-8 h-8",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  s("g", {
                    "stroke-width": "1.5",
                    fill: "none"
                  }, [
                    s("path", {
                      d: "M9 3H3.6a.6.6 0 0 0-.6.6v16.8a.6.6 0 0 0 .6.6H9M9 3v18M9 3h6M9 21h6m0-18h5.4a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H15m0-18v18",
                      stroke: "currentColor"
                    })
                  ])
                ], -1)
              ])], 8, nd)) : k("", !0),
              w("pagingNav") ? (o(), u("button", {
                key: 1,
                type: "button",
                class: b(["pl-2", Je.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                title: "First page",
                disabled: !Je.value,
                onClick: q[3] || (q[3] = (Ke) => ct(-Me.value))
              }, [...q[10] || (q[10] = [
                s("svg", {
                  class: "w-8 h-8",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  s("path", {
                    d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6l6 6zM6 6h2v12H6z",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 10, sd)) : k("", !0),
              w("pagingNav") ? (o(), u("button", {
                key: 2,
                type: "button",
                class: b(["pl-2", ut.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                title: "Previous page",
                disabled: !ut.value,
                onClick: q[4] || (q[4] = (Ke) => ct(-$e.value))
              }, [...q[11] || (q[11] = [
                s("svg", {
                  class: "w-8 h-8",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  s("path", {
                    d: "M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 10, ad)) : k("", !0),
              w("pagingNav") ? (o(), u("button", {
                key: 3,
                type: "button",
                class: b(["pl-2", Bt.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                title: "Next page",
                disabled: !Bt.value,
                onClick: q[5] || (q[5] = (Ke) => ct($e.value))
              }, [...q[12] || (q[12] = [
                s("svg", {
                  class: "w-8 h-8",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  s("path", {
                    d: "M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 10, od)) : k("", !0),
              w("pagingNav") ? (o(), u("button", {
                key: 4,
                type: "button",
                class: b(["pl-2", Et.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                title: "Last page",
                disabled: !Et.value,
                onClick: q[6] || (q[6] = (Ke) => ct(Me.value))
              }, [...q[13] || (q[13] = [
                s("svg", {
                  class: "w-8 h-8",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  s("path", {
                    d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6l-6-6zM16 6h2v12h-2z",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 10, rd)) : k("", !0)
            ]),
            w("pagingInfo") ? (o(), u("div", id, [
              s("div", ud, [
                oe.value ? (o(), u("span", dd, "Querying...")) : k("", !0),
                Le.value.length ? (o(), u("span", cd, [
                  q[14] || (q[14] = s("span", { class: "hidden xl:inline" }, " Showing Results ", -1)),
                  pe(" " + L(ue.value + 1) + " - " + L(Math.min(ue.value + Le.value.length, Me.value)) + " ", 1),
                  s("span", null, " of " + L(Me.value), 1)
                ])) : V.value.completed ? (o(), u("span", fd, "No Results")) : k("", !0)
              ])
            ])) : k("", !0),
            s("div", md, [
              w("refresh") ? (o(), u("div", vd, [
                s("button", {
                  type: "button",
                  onClick: To,
                  title: "Refresh",
                  class: b(se.value)
                }, [...q[15] || (q[15] = [
                  s("svg", {
                    class: "w-5 h-5",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24"
                  }, [
                    s("path", {
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M20 20v-5h-5M4 4v5h5m10.938 2A8.001 8.001 0 0 0 5.07 8m-1.008 5a8.001 8.001  0 0 0 14.868 3"
                    })
                  ], -1)
                ])], 2)
              ])) : k("", !0),
              w("downloadCsv") ? (o(), u("div", pd, [
                s("button", {
                  type: "button",
                  onClick: Oo,
                  title: "Download CSV",
                  class: b(se.value)
                }, [...q[16] || (q[16] = [
                  nn('<svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.162 1.162 0 0 0 30 25.349V5.5a1.162 1.162 0 0 0-1.219-1.095zm.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411z" fill="#20744a" fill-rule="evenodd"></path><path fill="#20744a" d="M22.487 7.439h4.323v2.2h-4.323z"></path><path fill="#20744a" d="M22.487 10.94h4.323v2.2h-4.323z"></path><path fill="#20744a" d="M22.487 14.441h4.323v2.2h-4.323z"></path><path fill="#20744a" d="M22.487 17.942h4.323v2.2h-4.323z"></path><path fill="#20744a" d="M22.487 21.443h4.323v2.2h-4.323z"></path><path fill="#fff" fill-rule="evenodd" d="M6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663l-2.238-4.993z"></path></svg><span class="text-green-900 dark:text-green-100">Excel</span>', 2)
                ])], 2)
              ])) : k("", !0),
              w("copyApiUrl") ? (o(), u("div", gd, [
                s("button", {
                  type: "button",
                  onClick: Fo,
                  title: "Copy API URL",
                  class: b(se.value)
                }, [
                  D.value ? (o(), u("svg", yd, [...q[17] || (q[17] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M5 13l4 4L19 7"
                    }, null, -1)
                  ])])) : (o(), u("svg", hd, [...q[18] || (q[18] = [
                    s("g", { fill: "none" }, [
                      s("path", {
                        d: "M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }),
                      s("path", {
                        d: "M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      })
                    ], -1)
                  ])])),
                  q[19] || (q[19] = s("span", { class: "whitespace-nowrap" }, "Copy URL", -1))
                ], 2)
              ])) : k("", !0),
              re.value && w("resetPreferences") ? (o(), u("div", bd, [
                s("button", {
                  type: "button",
                  onClick: Io,
                  title: "Reset Preferences & Filters",
                  class: b(se.value)
                }, [...q[20] || (q[20] = [
                  s("svg", {
                    class: "w-5 h-5",
                    xmlns: "http://www.w3.org/2000/svg",
                    "aria-hidden": "true",
                    viewBox: "0 0 24 24"
                  }, [
                    s("path", {
                      fill: "currentColor",
                      d: "M6.78 2.72a.75.75 0 0 1 0 1.06L4.56 6h8.69a7.75 7.75 0 1 1-7.75 7.75a.75.75 0 0 1 1.5 0a6.25 6.25 0 1 0 6.25-6.25H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 0Z"
                    })
                  ], -1)
                ])], 2)
              ])) : k("", !0),
              w("filtersView") && de.value > 0 ? (o(), u("div", wd, [
                s("button", {
                  type: "button",
                  onClick: q[7] || (q[7] = (Ke) => te.value = te.value == "filters" ? null : "filters"),
                  class: b(se.value),
                  "aria-expanded": "false"
                }, [
                  q[23] || (q[23] = s("svg", {
                    class: "flex-none w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
                    "aria-hidden": "true",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 20 20",
                    fill: "currentColor"
                  }, [
                    s("path", {
                      "fill-rule": "evenodd",
                      d: "M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z",
                      "clip-rule": "evenodd"
                    })
                  ], -1)),
                  s("span", kd, L(de.value) + " " + L(de.value == 1 ? "Filter" : "Filters"), 1),
                  te.value != "filters" ? (o(), u("svg", xd, [...q[21] || (q[21] = [
                    s("path", {
                      "fill-rule": "evenodd",
                      d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                      "clip-rule": "evenodd"
                    }, null, -1)
                  ])])) : (o(), u("svg", $d, [...q[22] || (q[22] = [
                    s("path", {
                      "fill-rule": "evenodd",
                      d: "M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z",
                      "clip-rule": "evenodd"
                    }, null, -1)
                  ])]))
                ], 2)
              ])) : k("", !0),
              w("newItem") && Ve.value.Create && Eo.value ? (o(), u("div", Cd, [
                s("button", {
                  type: "button",
                  onClick: Po,
                  title: gl.value,
                  class: b(se.value)
                }, [
                  q[24] || (q[24] = s("svg", {
                    class: "w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24"
                  }, [
                    s("path", {
                      d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
                      fill: "currentColor"
                    })
                  ], -1)),
                  s("span", Ld, L(Bo.value), 1)
                ], 10, Sd)
              ])) : k("", !0),
              ne(z).toolbarbuttons ? G(H.$slots, "toolbarbuttons", { toolbarButtonClass: se.value }, void 0, void 0, 6) : k("", !0)
            ])
          ])
        ])) : k("", !0),
        te.value == "filters" ? (o(), W(bs, {
          key: 5,
          class: "border-y border-gray-200 dark:border-gray-800 py-8 my-2",
          definitions: As.value,
          columns: fe.value,
          onDone: q[8] || (q[8] = (Ke) => te.value = null),
          onChange: ft
        }, null, 8, ["definitions", "columns"])) : k("", !0),
        $.value.error ?? V.value.error ? (o(), W(_t, {
          key: 6,
          status: $.value.error ?? V.value.error
        }, null, 8, ["status"])) : oe.value ? (o(), W(Ps, {
          key: 7,
          class: "p-2"
        })) : k("", !0),
        ce.value ? (o(), u("div", Vd, [
          ve(hs, {
            definitions: As.value,
            column: ce.value.column,
            "top-left": ce.value.topLeft,
            onDone: Ie,
            onSave: We
          }, null, 8, ["definitions", "column", "top-left"])
        ])) : k("", !0),
        m.value ? (o(), W(Do, {
          key: 9,
          id: e.id,
          items: Le.value,
          type: Xt.value,
          ctx: m.value,
          "selected-columns": j.value,
          class: "mt-1",
          tableStyle: C.value,
          gridClass: F.value,
          grid2Class: B.value,
          grid3Class: E.value,
          grid4Class: _.value,
          tableClass: X.value,
          theadClass: I.value,
          theadRowClass: O.value,
          theadCellClass: ie.value,
          tbodyClass: e.tbodyClass,
          rowClass: P,
          onRowSelected: Y,
          rowStyle: e.rowStyle,
          headerTitle: e.headerTitle,
          headerTitles: e.headerTitles,
          visibleFrom: e.visibleFrom,
          onHeaderSelected: Oe
        }, Qn({
          header: we(({ column: Ke, label: El }) => [
            x("filtering") && Ue(Ke) ? (o(), u("div", Md, [
              s("span", Ad, L(El), 1),
              ve(Nt, {
                column: fe.value.find((No) => No.name.toLowerCase() === Ke.toLowerCase()),
                "is-open": ce.value?.column.name === Ke
              }, null, 8, ["column", "is-open"])
            ])) : (o(), u("div", Td, [
              s("span", jd, L(El), 1)
            ]))
          ]),
          _: 2
        }, [
          be(Object.keys(ne(z)), (Ke) => ({
            name: Ke,
            fn: we((El) => [
              G(H.$slots, Ke, Zl(Xl(El)))
            ])
          }))
        ]), 1032, ["id", "items", "type", "ctx", "selected-columns", "tableStyle", "gridClass", "grid2Class", "grid3Class", "grid4Class", "tableClass", "theadClass", "theadRowClass", "theadCellClass", "tbodyClass", "rowStyle", "headerTitle", "headerTitles", "visibleFrom"])) : k("", !0)
      ]));
    };
  }
}), Fd = { class: "flex" }, Id = {
  key: 0,
  class: "w-4 h-4",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, Pd = {
  key: 2,
  class: "w-4 h-4",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20"
}, Bd = {
  key: 3,
  class: "w-4 h-4",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20"
}, Ed = /* @__PURE__ */ ge({
  __name: "SettingsIcons",
  props: {
    column: {},
    isOpen: { type: Boolean }
  },
  setup(e) {
    return (t, l) => (o(), u("div", Fd, [
      e.column?.settings?.filters?.length ? (o(), u("svg", Id, [...l[0] || (l[0] = [
        s("g", { fill: "none" }, [
          s("path", {
            d: "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])])) : (o(), u("svg", {
        key: 1,
        class: b(["w-4 h-4 transition-transform", e.isOpen ? "rotate-180" : ""]),
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [...l[1] || (l[1] = [
        s("path", {
          d: "M505.5 658.7c3.2 4.4 9.7 4.4 12.9 0l178-246c3.8-5.3 0-12.7-6.5-12.7H643c-10.2 0-19.9 4.9-25.9 13.2L512 558.6L406.8 413.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246z",
          fill: "currentColor"
        }, null, -1),
        s("path", {
          d: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z",
          fill: "currentColor"
        }, null, -1)
      ])], 2)),
      e.column?.settings?.sort === "ASC" ? (o(), u("svg", Pd, [...l[2] || (l[2] = [
        s("g", { fill: "none" }, [
          s("path", {
            d: "M8.998 4.71L6.354 7.354a.5.5 0 1 1-.708-.707L9.115 3.18A.499.499 0 0 1 9.498 3H9.5a.5.5 0 0 1 .354.147l.01.01l3.49 3.49a.5.5 0 1 1-.707.707l-2.65-2.649V16.5a.5.5 0 0 1-1 0V4.71z",
            fill: "currentColor"
          })
        ], -1)
      ])])) : e.column?.settings?.sort === "DESC" ? (o(), u("svg", Bd, [...l[3] || (l[3] = [
        s("g", { fill: "none" }, [
          s("path", {
            d: "M10.002 15.29l2.645-2.644a.5.5 0 0 1 .707.707L9.886 16.82a.5.5 0 0 1-.384.179h-.001a.5.5 0 0 1-.354-.147l-.01-.01l-3.49-3.49a.5.5 0 1 1 .707-.707l2.648 2.649V3.5a.5.5 0 0 1 1 0v11.79z",
            fill: "currentColor"
          })
        ], -1)
      ])])) : k("", !0)
    ]));
  }
}), Dd = /* @__PURE__ */ ge({
  __name: "EnsureAccessDialog",
  props: {
    title: {},
    subtitle: {},
    invalidAccess: {},
    alertClass: {}
  },
  emits: ["done"],
  setup(e) {
    return (t, l) => {
      const n = N("EnsureAccess"), a = N("SlideOver");
      return e.invalidAccess ? (o(), W(a, {
        key: 0,
        title: e.title,
        onDone: l[0] || (l[0] = (d) => t.$emit("done")),
        "content-class": "relative flex-1"
      }, Qn({
        default: we(() => [
          ve(n, {
            alertClass: e.alertClass,
            invalidAccess: e.invalidAccess
          }, null, 8, ["alertClass", "invalidAccess"])
        ]),
        _: 2
      }, [
        e.subtitle ? {
          name: "subtitle",
          fn: we(() => [
            pe(L(e.subtitle), 1)
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["title"])) : k("", !0);
    };
  }
}), Nd = ["for"], Rd = ["type", "name", "id", "placeholder", "value", "aria-invalid", "aria-describedby"], Hd = {
  key: 0,
  class: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
}, qd = ["id"], zd = ["id"], Ud = {
  inheritAttrs: !1
}, co = /* @__PURE__ */ ge({
  ...Ud,
  __name: "TextInput",
  props: {
    status: {},
    id: {},
    type: {},
    inputClass: {},
    filterClass: { type: Function },
    label: {},
    labelClass: {},
    help: {},
    placeholder: {},
    modelValue: {}
  },
  setup(e, { expose: t }) {
    const l = (g) => Fn(i.value, g.value), n = e;
    t({
      focus: d
    });
    const a = M();
    function d() {
      a.value?.focus();
    }
    const i = f(() => n.type || "text"), r = f(() => n.label ?? je(pt(n.id))), c = f(() => n.placeholder ?? r.value);
    function v(g) {
      return n.type === "range" ? g.replace("shadow-sm ", "") : g;
    }
    let m = Pe("ApiState", void 0);
    const h = f(() => $t.call({ responseStatus: n.status ?? m?.error.value }, n.id)), y = f(() => Pt([
      vt.base,
      h.value ? vt.invalid : v(vt.valid),
      n.inputClass
    ], "TextInput", n.filterClass));
    return (g, p) => (o(), u("div", {
      class: b([g.$attrs.class])
    }, [
      G(g.$slots, "header", Se({
        inputElement: a.value,
        id: e.id,
        modelValue: e.modelValue,
        status: e.status
      }, g.$attrs)),
      r.value ? (o(), u("label", {
        key: 0,
        for: e.id,
        class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
      }, L(r.value), 11, Nd)) : k("", !0),
      s("div", {
        class: b(v("mt-1 relative"))
      }, [
        s("input", Se({
          ref_key: "inputElement",
          ref: a,
          type: i.value,
          name: e.id,
          id: e.id,
          class: y.value,
          placeholder: c.value,
          value: ne(Fn)(i.value, e.modelValue),
          onInput: p[0] || (p[0] = (x) => g.$emit("update:modelValue", l(x.target))),
          "aria-invalid": h.value != null,
          "aria-describedby": `${e.id}-error`,
          step: "any"
        }, ne(bt)(g.$attrs, ["class", "value"])), null, 16, Rd),
        h.value ? (o(), u("div", Hd, [...p[1] || (p[1] = [
          s("svg", {
            class: "h-5 w-5 text-red-500",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
              "clip-rule": "evenodd"
            })
          ], -1)
        ])])) : k("", !0)
      ], 2),
      h.value ? (o(), u("p", {
        key: 1,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(h.value), 9, qd)) : e.help ? (o(), u("p", {
        key: 2,
        class: "mt-2 text-sm text-gray-500",
        id: `${e.id}-description`
      }, L(e.help), 9, zd)) : k("", !0),
      G(g.$slots, "footer", Se({
        inputElement: a.value,
        id: e.id,
        modelValue: e.modelValue,
        status: e.status
      }, g.$attrs))
    ], 2));
  }
}), Kd = ["for"], Qd = { class: "mt-1 relative" }, Jd = ["name", "id", "placeholder", "aria-invalid", "aria-describedby"], Gd = ["id"], Wd = ["id"], Zd = {
  inheritAttrs: !1
}, Xd = /* @__PURE__ */ ge({
  ...Zd,
  __name: "TextareaInput",
  props: {
    status: {},
    id: {},
    inputClass: {},
    filterClass: { type: Function },
    label: {},
    labelClass: {},
    help: {},
    placeholder: {},
    modelValue: {}
  },
  setup(e) {
    const t = (c) => c.value, l = e, n = f(() => l.label ?? je(pt(l.id))), a = f(() => l.placeholder ?? n.value);
    let d = Pe("ApiState", void 0);
    const i = f(() => $t.call({ responseStatus: l.status ?? d?.error.value }, l.id)), r = f(() => Pt([
      "shadow-sm " + vt.base,
      i.value ? "text-red-900 focus:ring-red-500 focus:border-red-500 border-red-300" : "text-gray-900 " + vt.valid,
      l.inputClass
    ], "TextareaInput", l.filterClass));
    return (c, v) => (o(), u("div", {
      class: b([c.$attrs.class])
    }, [
      n.value ? (o(), u("label", {
        key: 0,
        for: e.id,
        class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
      }, L(n.value), 11, Kd)) : k("", !0),
      s("div", Qd, [
        s("textarea", Se({
          name: e.id,
          id: e.id,
          class: r.value,
          placeholder: a.value,
          onInput: v[0] || (v[0] = (m) => c.$emit("update:modelValue", t(m.target))),
          "aria-invalid": i.value != null,
          "aria-describedby": `${e.id}-error`
        }, ne(bt)(c.$attrs, ["class"])), L(e.modelValue), 17, Jd)
      ]),
      i.value ? (o(), u("p", {
        key: 1,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(i.value), 9, Gd)) : e.help ? (o(), u("p", {
        key: 2,
        class: "mt-2 text-sm text-gray-500",
        id: `${e.id}-description`
      }, L(e.help), 9, Wd)) : k("", !0)
    ], 2));
  }
}), Yd = ["for"], _d = ["id", "name", "value", "aria-invalid", "aria-describedby"], ec = ["value"], tc = ["id"], lc = {
  inheritAttrs: !1
}, nc = /* @__PURE__ */ ge({
  ...lc,
  __name: "SelectInput",
  props: {
    status: {},
    id: {},
    modelValue: {},
    inputClass: {},
    filterClass: { type: Function },
    label: {},
    labelClass: {},
    options: {},
    values: {},
    entries: {}
  },
  setup(e) {
    const t = (c) => c.value, l = e, n = f(() => l.label ?? je(pt(l.id)));
    let a = Pe("ApiState", void 0);
    const d = f(() => $t.call({ responseStatus: l.status ?? a?.error.value }, l.id)), i = f(() => l.entries || (l.values ? l.values.map((c) => ({ key: c, value: c })) : l.options ? Object.keys(l.options).map((c) => ({ key: c, value: l.options[c] })) : [])), r = f(() => Pt([
      "mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md dark:text-white dark:bg-gray-900 dark:border-gray-600 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 disabled:border-slate-200 dark:disabled:border-slate-700 disabled:shadow-none",
      d.value ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500" : "shadow-sm border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500",
      l.inputClass
    ], "SelectInput", l.filterClass));
    return (c, v) => (o(), u("div", {
      class: b([c.$attrs.class])
    }, [
      n.value ? (o(), u("label", {
        key: 0,
        for: e.id,
        class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
      }, L(n.value), 11, Yd)) : k("", !0),
      s("select", Se({
        id: e.id,
        name: e.id,
        class: r.value,
        value: e.modelValue,
        onInput: v[0] || (v[0] = (m) => c.$emit("update:modelValue", t(m.target))),
        "aria-invalid": d.value != null,
        "aria-describedby": `${e.id}-error`
      }, ne(bt)(c.$attrs, ["class"])), [
        (o(!0), u(he, null, be(i.value, (m) => (o(), u("option", {
          value: m.key
        }, L(m.value), 9, ec))), 256))
      ], 16, _d),
      d.value ? (o(), u("p", {
        key: 1,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(d.value), 9, tc)) : k("", !0)
    ], 2));
  }
}), sc = { class: "flex items-center h-5" }, ac = ["id", "name", "checked"], oc = { class: "ml-3 text-sm" }, rc = ["for"], ic = {
  key: 0,
  class: "mt-2 text-sm text-red-500",
  id: "`${id}-error`"
}, uc = {
  key: 1,
  class: "mt-2 text-sm text-gray-500",
  id: "`${id}-description`"
}, dc = {
  inheritAttrs: !1
}, cc = /* @__PURE__ */ ge({
  ...dc,
  __name: "CheckboxInput",
  props: {
    modelValue: { type: Boolean },
    status: {},
    id: {},
    inputClass: {},
    filterClass: { type: Function },
    label: {},
    labelClass: {},
    help: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = f(() => l.label ?? je(pt(l.id)));
    let a = Pe("ApiState", void 0);
    const d = f(() => $t.call({ responseStatus: l.status ?? a?.error.value }, l.id)), i = f(() => Pt(["focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800", l.inputClass], "CheckboxInput", l.filterClass));
    return (r, c) => (o(), u("div", {
      class: b(["relative flex items-start", r.$attrs.class])
    }, [
      s("div", sc, [
        s("input", Se({
          id: e.id,
          name: e.id,
          type: "checkbox",
          checked: e.modelValue,
          onInput: c[0] || (c[0] = (v) => r.$emit("update:modelValue", v.target.checked)),
          class: i.value
        }, ne(bt)(r.$attrs, ["class"])), null, 16, ac)
      ]),
      s("div", oc, [
        s("label", {
          for: e.id,
          class: b(`font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
        }, L(n.value), 11, rc),
        d.value ? (o(), u("p", ic, L(d.value), 1)) : e.help ? (o(), u("p", uc, L(e.help), 1)) : k("", !0)
      ])
    ], 2));
  }
}), fc = ["id"], mc = ["for"], vc = { class: "mt-1 relative" }, pc = ["id", "name", "value"], gc = { class: "flex flex-wrap pb-1.5" }, yc = { class: "pt-1.5 pl-1" }, hc = { class: "inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300" }, bc = ["onClick"], wc = { class: "pt-1.5 pl-1 shrink" }, kc = ["type", "name", "id", "aria-invalid", "aria-describedby"], xc = ["id"], $c = ["onMouseover", "onClick"], Cc = { class: "block truncate" }, Sc = {
  key: 1,
  class: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
}, Lc = ["id"], Vc = ["id"], Mc = {
  inheritAttrs: !1
}, Ac = /* @__PURE__ */ ge({
  ...Mc,
  __name: "TagInput",
  props: {
    status: {},
    id: {},
    type: {},
    inputClass: {},
    filterClass: {},
    label: {},
    labelClass: {},
    help: {},
    modelValue: { default: () => [] },
    delimiters: { default: () => [","] },
    allowableValues: {},
    string: { type: Boolean },
    maxVisibleItems: { default: 300 },
    converter: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = t;
    function a(S) {
      return l.converter ? l.converter(S) : S;
    }
    const d = f(() => qe(a(l.modelValue), (S) => typeof S == "string" ? S.trim().length == 0 ? [] : S.split(",") : S) || []), i = M(), r = M(!1), c = f(() => {
      const S = h.value.toLowerCase();
      return !l.allowableValues || l.allowableValues.length == 0 ? [] : l.allowableValues.length < 1e3 ? l.allowableValues.filter((j) => !d.value.includes(j) && j.toLowerCase().includes(S)) : l.allowableValues.filter((j) => !d.value.includes(j) && j.startsWith(S));
    });
    function v(S) {
      i.value = S;
    }
    const m = M(null), h = M(""), y = f(() => l.type || "text"), g = f(() => l.label ?? je(pt(l.id)));
    let p = Pe("ApiState", void 0);
    const x = f(() => $t.call({ responseStatus: l.status ?? p?.error.value }, l.id)), w = f(() => Pt([
      "w-full cursor-text flex flex-wrap sm:text-sm rounded-md dark:text-white dark:bg-gray-900 border focus-within:border-transparent focus-within:ring-1 focus-within:outline-none",
      x.value ? "pr-10 border-red-300 text-red-900 placeholder-red-300 focus-within:outline-none focus-within:ring-red-500 focus-within:border-red-500" : "shadow-sm border-gray-300 dark:border-gray-600 focus-within:ring-indigo-500 focus-within:border-indigo-500",
      l.inputClass
    ], "TagInput", l.filterClass)), C = (S) => I(d.value.filter((j) => j != S));
    function F(S) {
      document.activeElement === S.target && m.value?.focus();
    }
    const B = M();
    function E() {
      r.value = !0, B.value = !0;
    }
    function _() {
      E();
    }
    function X() {
      T(ie()), B.value = !1, setTimeout(() => {
        B.value || (r.value = !1);
      }, 200);
    }
    function I(S) {
      const j = l.string ? S.join(",") : S;
      n("update:modelValue", j);
    }
    function O(S) {
      if (S.key == "Backspace" && h.value.length == 0 && d.value.length > 0 && C(d.value[d.value.length - 1]), !(!l.allowableValues || l.allowableValues.length == 0))
        if (S.code == "Escape" || S.code == "Tab")
          r.value = !1;
        else if (S.code == "Home")
          i.value = c.value[0], z();
        else if (S.code == "End")
          i.value = c.value[c.value.length - 1], z();
        else if (S.code == "ArrowDown") {
          if (r.value = !0, !i.value)
            i.value = c.value[0];
          else {
            const j = c.value.indexOf(i.value);
            i.value = j + 1 < c.value.length ? c.value[j + 1] : c.value[0];
          }
          K();
        } else if (S.code == "ArrowUp") {
          if (!i.value)
            i.value = c.value[c.value.length - 1];
          else {
            const j = c.value.indexOf(i.value);
            i.value = j - 1 >= 0 ? c.value[j - 1] : c.value[c.value.length - 1];
          }
          K();
        } else S.code == "Enter" ? i.value && r.value ? (T(i.value), S.preventDefault()) : r.value = !1 : r.value = c.value.length > 0;
    }
    function ie() {
      if (h.value.length == 0) return "";
      let S = ar(h.value.trim(), ",");
      return S[0] == "," && (S = S.substring(1)), S = S.trim(), S.length == 0 && r.value && c.value.length > 0 ? i.value : S;
    }
    function se(S) {
      const j = ie();
      if (j.length > 0) {
        const fe = l.delimiters.some(($) => $ == S.key);
        if (fe && S.preventDefault(), S.key == "Enter" || S.key == "NumpadEnter" || S.key.length == 1 && fe) {
          T(j);
          return;
        }
      }
    }
    const P = { behavior: "smooth", block: "nearest", inline: "nearest", scrollMode: "if-needed" };
    function z() {
      setTimeout(() => {
        let S = Yl(`#${l.id}-tag li.active`);
        S && S.scrollIntoView(P);
      }, 0);
    }
    function K() {
      setTimeout(() => {
        let S = Yl(`#${l.id}-tag li.active`);
        S && ("scrollIntoViewIfNeeded" in S ? S.scrollIntoViewIfNeeded(P) : S.scrollIntoView(P));
      }, 0);
    }
    function T(S) {
      if (S.length === 0) return;
      const j = Array.from(d.value);
      j.indexOf(S) == -1 && j.push(S), I(j), h.value = "", r.value = !1;
    }
    function Z(S) {
      const j = S.clipboardData?.getData("Text");
      A(j);
    }
    function A(S) {
      if (!S) return;
      const j = new RegExp(`\\n|\\t|${l.delimiters.join("|")}`), fe = Array.from(d.value);
      S.split(j).map(($) => $.trim()).forEach(($) => {
        fe.indexOf($) == -1 && fe.push($);
      }), I(fe), h.value = "";
    }
    return (S, j) => (o(), u("div", {
      class: b([S.$attrs.class]),
      id: `${e.id}-tag`,
      onmousemove: "cancelBlur=true"
    }, [
      g.value ? (o(), u("label", {
        key: 0,
        for: e.id,
        class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
      }, L(g.value), 11, mc)) : k("", !0),
      s("div", vc, [
        s("input", {
          type: "hidden",
          id: e.id,
          name: e.id,
          value: d.value.join(",")
        }, null, 8, pc),
        s("button", {
          class: b(w.value),
          onClick: Ee(F, ["prevent"]),
          onFocus: j[2] || (j[2] = (fe) => r.value = !0),
          tabindex: "-1"
        }, [
          s("div", gc, [
            (o(!0), u(he, null, be(d.value, (fe) => (o(), u("div", yc, [
              s("span", hc, [
                pe(L(fe) + " ", 1),
                s("button", {
                  type: "button",
                  onClick: (V) => C(fe),
                  class: "flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 dark:text-indigo-500 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:text-indigo-500 dark:hover:text-indigo-400 focus:outline-none focus:bg-indigo-500 focus:text-white dark:focus:text-black"
                }, [...j[3] || (j[3] = [
                  s("svg", {
                    class: "h-2 w-2",
                    stroke: "currentColor",
                    fill: "none",
                    viewBox: "0 0 8 8"
                  }, [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-width": "1.5",
                      d: "M1 1l6 6m0-6L1 7"
                    })
                  ], -1)
                ])], 8, bc)
              ])
            ]))), 256)),
            s("div", wc, [
              Ot(s("input", Se({
                ref_key: "txtInput",
                ref: m,
                type: y.value,
                role: "combobox",
                "aria-controls": "options",
                "aria-expanded": "false",
                autocomplete: "off",
                spellcheck: "false",
                name: `${e.id}-txt`,
                id: `${e.id}-txt`,
                class: "p-0 dark:bg-transparent rounded-md border-none focus:!border-none focus:!outline-none",
                style: `box-shadow:none !important;width:${h.value.length + 1}ch`,
                "onUpdate:modelValue": j[0] || (j[0] = (fe) => h.value = fe),
                "aria-invalid": x.value != null,
                "aria-describedby": `${e.id}-error`,
                onKeydown: O,
                onKeypress: se,
                onPaste: Ee(Z, ["prevent", "stop"]),
                onFocus: _,
                onBlur: X,
                onClick: j[1] || (j[1] = (fe) => r.value = !0)
              }, ne(bt)(S.$attrs, ["class", "required"])), null, 16, kc), [
                [zo, h.value]
              ])
            ])
          ])
        ], 34),
        r.value && c.value.length ? (o(), u("ul", {
          key: 0,
          class: "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-black py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm",
          onKeydown: O,
          id: `${e.id}-options`,
          role: "listbox"
        }, [
          (o(!0), u(he, null, be(c.value.slice(0, e.maxVisibleItems), (fe) => (o(), u("li", {
            class: b([fe === i.value ? "active bg-indigo-600 text-white" : "text-gray-900 dark:text-gray-100", "relative cursor-default select-none py-2 pl-3 pr-9"]),
            onMouseover: (V) => v(fe),
            onClick: (V) => T(fe),
            role: "option",
            tabindex: "-1"
          }, [
            s("span", Cc, L(fe), 1)
          ], 42, $c))), 256))
        ], 40, xc)) : k("", !0),
        x.value ? (o(), u("div", Sc, [...j[4] || (j[4] = [
          s("svg", {
            class: "h-5 w-5 text-red-500",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
              "clip-rule": "evenodd"
            })
          ], -1)
        ])])) : k("", !0)
      ]),
      x.value ? (o(), u("p", {
        key: 1,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(x.value), 9, Lc)) : e.help ? (o(), u("p", {
        key: 2,
        class: "mt-2 text-sm text-gray-500",
        id: `${e.id}-description`
      }, L(e.help), 9, Vc)) : k("", !0)
    ], 10, fc));
  }
}), Tc = { class: "relative flex-grow mr-2 sm:mr-4" }, jc = ["for"], Oc = { class: "block mt-2" }, Fc = { class: "sr-only" }, Ic = ["multiple", "name", "id", "placeholder", "aria-invalid", "aria-describedby"], Pc = {
  key: 0,
  class: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
}, Bc = ["id"], Ec = ["id"], Dc = { key: 0 }, Nc = ["title"], Rc = ["alt", "src"], Hc = {
  key: 1,
  class: "mt-3"
}, qc = { class: "w-full" }, zc = { class: "pr-6 align-bottom pb-2" }, Uc = ["title"], Kc = ["src", "onError"], Qc = ["href"], Jc = {
  key: 1,
  class: "overflow-hidden"
}, Gc = { class: "align-top pb-2 whitespace-nowrap" }, Wc = {
  key: 0,
  class: "text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-black"
}, Zc = /* @__PURE__ */ ge({
  __name: "FileInput",
  props: {
    multiple: { type: Boolean },
    status: {},
    id: {},
    inputClass: {},
    filterClass: { type: Function },
    label: {},
    labelClass: {},
    help: {},
    placeholder: {},
    modelValue: {},
    values: {},
    files: {}
  },
  setup(e) {
    const t = e, l = M(null), { assetsPathResolver: n, fallbackPathResolver: a } = Ct(), d = {}, i = M(), r = M(t.files?.map(c) || []);
    function c(E) {
      return E.filePath = n(E.filePath), E;
    }
    t.values && t.values.length > 0 && (r.value = t.values.map((E) => {
      let _ = E.replace(/\\/g, "/");
      return { fileName: ca(Kt(_, "/"), "."), filePath: _, contentType: An(_) };
    }).map(c));
    const v = f(() => t.label ?? je(pt(t.id))), m = f(() => t.placeholder ?? v.value);
    let h = Pe("ApiState", void 0);
    const y = f(() => $t.call({ responseStatus: t.status ?? h?.error.value }, t.id)), g = f(() => Pt([
      "block w-full sm:text-sm rounded-md dark:text-white dark:bg-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 dark:file:bg-violet-900 file:text-violet-700 dark:file:text-violet-200 hover:file:bg-violet-100 dark:hover:file:bg-violet-800",
      y.value ? "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "text-slate-500 dark:text-slate-400",
      t.inputClass
    ], "FileInput", t.filterClass)), p = (E) => {
      let _ = E.target;
      i.value = "", r.value = Array.from(_.files || []).map((X) => ({
        fileName: X.name,
        filePath: Zn(X),
        contentLength: X.size,
        contentType: X.type || An(X.name)
      }));
    }, x = () => l.value?.click(), w = (E) => E == null ? !1 : E.startsWith("data:") || E.startsWith("blob:"), C = f(() => {
      if (r.value.length > 0)
        return r.value[0].filePath;
      let E = typeof t.modelValue == "string" ? t.modelValue : t.values && t.values[0];
      return E && Ht(n(E)) || null;
    }), F = (E) => !E || E.startsWith("data:") || E.endsWith(".svg") ? "" : "rounded-full object-cover";
    function B(E) {
      i.value = a(C.value);
    }
    return Jt(ya), (E, _) => (o(), u("div", {
      class: b(["flex", e.multiple ? "flex-col" : "justify-between"])
    }, [
      s("div", Tc, [
        v.value ? (o(), u("label", {
          key: 0,
          for: e.id,
          class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
        }, L(v.value), 11, jc)) : k("", !0),
        s("div", Oc, [
          s("span", Fc, L(e.help ?? v.value), 1),
          s("input", Se({
            ref_key: "input",
            ref: l,
            type: "file",
            multiple: e.multiple,
            name: e.id,
            id: e.id,
            class: g.value,
            placeholder: m.value,
            "aria-invalid": y.value != null,
            "aria-describedby": `${e.id}-error`
          }, E.$attrs, { onChange: p }), null, 16, Ic),
          y.value ? (o(), u("div", Pc, [..._[0] || (_[0] = [
            s("svg", {
              class: "h-5 w-5 text-red-500",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              "aria-hidden": "true"
            }, [
              s("path", {
                "fill-rule": "evenodd",
                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                "clip-rule": "evenodd"
              })
            ], -1)
          ])])) : k("", !0)
        ]),
        y.value ? (o(), u("p", {
          key: 1,
          class: "mt-2 text-sm text-red-500",
          id: `${e.id}-error`
        }, L(y.value), 9, Bc)) : e.help ? (o(), u("p", {
          key: 2,
          class: "mt-2 text-sm text-gray-500",
          id: `${e.id}-description`
        }, L(e.help), 9, Ec)) : k("", !0)
      ]),
      e.multiple ? (o(), u("div", Hc, [
        s("table", qc, [
          (o(!0), u(he, null, be(r.value, (X) => (o(), u("tr", null, [
            s("td", zc, [
              s("div", {
                class: "flex w-full",
                title: w(X.filePath) ? "" : X.filePath
              }, [
                s("img", {
                  src: d[ne(Ht)(X.filePath)] || ne(n)(ne(Ht)(X.filePath)),
                  class: b(["mr-2 h-8 w-8", F(X.filePath)]),
                  onError: (I) => d[ne(Ht)(X.filePath)] = ne(a)(ne(Ht)(X.filePath))
                }, null, 42, Kc),
                w(X.filePath) ? (o(), u("span", Jc, L(X.fileName), 1)) : (o(), u("a", {
                  key: 0,
                  href: ne(n)(X.filePath || ""),
                  target: "_blank",
                  class: "overflow-hidden"
                }, L(X.fileName), 9, Qc))
              ], 8, Uc)
            ]),
            s("td", Gc, [
              X.contentLength && X.contentLength > 0 ? (o(), u("span", Wc, L(ne(Yn)(X.contentLength)), 1)) : k("", !0)
            ])
          ]))), 256))
        ])
      ])) : (o(), u("div", Dc, [
        C.value ? (o(), u("div", {
          key: 0,
          class: "shrink-0 cursor-pointer",
          title: w(C.value) ? "" : C.value
        }, [
          s("img", {
            onClick: x,
            class: b(["h-16 w-16", F(C.value)]),
            alt: `Current ${v.value ?? ""}`,
            src: i.value || ne(n)(C.value),
            onError: B
          }, null, 42, Rc)
        ], 8, Nc)) : k("", !0)
      ]))
    ], 2));
  }
}), Xc = ["id"], Yc = ["for"], _c = { class: "relative mt-1" }, e0 = ["id", "placeholder", "readonly"], t0 = ["id"], l0 = ["onMouseover", "onClick"], n0 = {
  key: 2,
  class: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
  tabindex: "-1"
}, s0 = ["id"], a0 = ["id"], o0 = /* @__PURE__ */ ge({
  __name: "Autocomplete",
  props: {
    status: {},
    id: {},
    type: {},
    label: {},
    help: {},
    placeholder: {},
    multiple: { type: Boolean, default: !1 },
    required: { type: Boolean },
    options: { default: () => [] },
    modelValue: {},
    match: {},
    viewCount: { default: 100 },
    pageSize: { default: 8 }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: l }) {
    const n = M(!1), a = e, d = l;
    t({ toggle: P });
    function i(A) {
      return Array.isArray(a.modelValue) && a.modelValue.indexOf(A) >= 0;
    }
    const r = f(() => a.label ?? je(pt(a.id)));
    let c = Pe("ApiState", void 0);
    const v = f(() => $t.call({ responseStatus: a.status ?? c?.error.value }, a.id)), m = f(() => [vt.base, v.value ? vt.invalid : vt.valid]), h = M(null), y = M(""), g = M(null), p = M(a.viewCount), x = M([]), w = f(() => y.value ? a.options.filter((S) => a.match(S, y.value)).slice(0, p.value) : a.options), C = ["Tab", "Escape", "ArrowDown", "ArrowUp", "Enter", "PageUp", "PageDown", "Home", "End"];
    function F(A) {
      g.value = A, x.value.indexOf(A) > Math.floor(p.value * 0.9) && (p.value += a.viewCount, Z());
    }
    const B = [",", `
`, "	"];
    function E(A) {
      const S = A.clipboardData?.getData("Text");
      _(S);
    }
    function _(A) {
      if (!A) return;
      const S = B.some((j) => A.includes(j));
      if (!a.multiple || !S) {
        const j = a.options.filter((fe) => a.match(fe, A));
        j.length == 1 && (T(j[0]), n.value = !1, Ql());
      } else if (S) {
        const j = new RegExp("\\r|\\n|\\t|,"), V = A.split(j).filter(($) => $.trim()).map(($) => a.options.find((te) => a.match(te, $))).filter(($) => !!$);
        if (V.length > 0) {
          y.value = "", n.value = !1, g.value = null;
          let $ = Array.from(a.modelValue || []);
          V.forEach((te) => {
            i(te) ? $ = $.filter((ae) => ae != te) : $.push(te);
          }), d("update:modelValue", $), Ql();
        }
      }
    }
    function X(A) {
      C.indexOf(A.code) || K();
    }
    function I(A) {
      if (!(A.shiftKey || A.ctrlKey || A.altKey)) {
        if (!n.value) {
          A.code == "ArrowDown" && (n.value = !0, g.value = x.value[0]);
          return;
        }
        if (A.code == "Escape")
          n.value && (A.stopPropagation(), n.value = !1);
        else if (A.code == "Tab")
          n.value = !1;
        else if (A.code == "Home")
          g.value = x.value[0], ie();
        else if (A.code == "End")
          g.value = x.value[x.value.length - 1], ie();
        else if (A.code == "ArrowDown") {
          if (!g.value)
            g.value = x.value[0];
          else {
            const S = x.value.indexOf(g.value);
            g.value = S + 1 < x.value.length ? x.value[S + 1] : x.value[0];
          }
          se();
        } else if (A.code == "ArrowUp") {
          if (!g.value)
            g.value = x.value[x.value.length - 1];
          else {
            const S = x.value.indexOf(g.value);
            g.value = S - 1 >= 0 ? x.value[S - 1] : x.value[x.value.length - 1];
          }
          se();
        } else A.code == "Enter" && (g.value ? (T(g.value), a.multiple || (A.preventDefault(), Ql())) : n.value = !1);
      }
    }
    const O = { behavior: "smooth", block: "nearest", inline: "nearest", scrollMode: "if-needed" };
    function ie() {
      setTimeout(() => {
        let A = Yl(`#${a.id}-autocomplete li.active`);
        A && A.scrollIntoView(O);
      }, 0);
    }
    function se() {
      setTimeout(() => {
        let A = Yl(`#${a.id}-autocomplete li.active`);
        A && ("scrollIntoViewIfNeeded" in A ? A.scrollIntoViewIfNeeded(O) : A.scrollIntoView(O));
      }, 0);
    }
    function P(A) {
      n.value = A, A && (Z(), h.value?.focus());
    }
    function z() {
      !a.multiple && a.modelValue ? (n.value = !n.value, n.value && Z()) : K();
    }
    function K() {
      n.value = !0, Z();
    }
    function T(A) {
      if (y.value = "", n.value = !1, a.multiple) {
        let S = Array.from(a.modelValue || []);
        i(A) ? S = S.filter((j) => j != A) : S.push(A), g.value = null, d("update:modelValue", S);
      } else
        d("update:modelValue", A);
    }
    function Z() {
      x.value = w.value;
    }
    return lt(y, Z), (A, S) => (o(), u("div", {
      id: `${e.id}-autocomplete`
    }, [
      r.value ? (o(), u("label", {
        key: 0,
        for: `${e.id}-text`,
        class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
      }, L(r.value), 9, Yc)) : k("", !0),
      s("div", _c, [
        Ot(s("input", Se({
          ref_key: "txtInput",
          ref: h,
          id: `${e.id}-text`,
          type: "text",
          role: "combobox",
          "aria-controls": "options",
          "aria-expanded": "false",
          autocomplete: "off",
          spellcheck: "false",
          "onUpdate:modelValue": S[0] || (S[0] = (j) => y.value = j),
          class: m.value,
          placeholder: e.multiple || !e.modelValue ? e.placeholder : "",
          readonly: !e.multiple && !!e.modelValue && !n.value,
          onKeydown: I,
          onKeyup: X,
          onClick: z,
          onPaste: E,
          required: !1
        }, A.$attrs), null, 16, e0), [
          [oa, y.value]
        ]),
        s("button", {
          type: "button",
          onClick: S[1] || (S[1] = (j) => P(!n.value)),
          class: "absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none",
          tabindex: "-1"
        }, [...S[2] || (S[2] = [
          s("svg", {
            class: "h-5 w-5 text-gray-400 dark:text-gray-500",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: "M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z",
              "clip-rule": "evenodd"
            })
          ], -1)
        ])]),
        n.value ? (o(), u("ul", {
          key: 0,
          class: "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-black py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm",
          onKeydown: I,
          id: `${e.id}-options`,
          role: "listbox"
        }, [
          (o(!0), u(he, null, be(x.value, (j) => (o(), u("li", {
            class: b([j === g.value ? "active bg-indigo-600 text-white" : "text-gray-900 dark:text-gray-100", "relative cursor-default select-none py-2 pl-3 pr-9"]),
            onMouseover: (fe) => F(j),
            onClick: (fe) => T(j),
            role: "option",
            tabindex: "-1"
          }, [
            typeof j == "string" ? G(A.$slots, "item", Se({ ref_for: !0 }, { key: j, value: j }), void 0, void 0, 0) : G(A.$slots, "item", Se({ ref_for: !0 }, j), void 0, void 0, 1),
            i(j) ? (o(), u("span", {
              key: 2,
              class: b(["absolute inset-y-0 right-0 flex items-center pr-4", j === g.value ? "text-white" : "text-indigo-600"])
            }, [...S[3] || (S[3] = [
              s("svg", {
                class: "h-5 w-5",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                "aria-hidden": "true"
              }, [
                s("path", {
                  "fill-rule": "evenodd",
                  d: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z",
                  "clip-rule": "evenodd"
                })
              ], -1)
            ])], 2)) : k("", !0)
          ], 42, l0))), 256))
        ], 40, t0)) : !e.multiple && e.modelValue ? (o(), u("div", {
          key: 1,
          onKeydown: I,
          class: "h-8 -mt-8 ml-3 pt-0.5 pointer-events-none"
        }, [
          typeof e.modelValue == "string" ? G(A.$slots, "item", Zl(Xl({ key: e.modelValue, value: e.modelValue })), void 0, void 0, 0) : G(A.$slots, "item", Zl(Xl(e.modelValue)), void 0, void 0, 1)
        ], 32)) : k("", !0),
        v.value ? (o(), u("div", n0, [...S[4] || (S[4] = [
          s("svg", {
            class: "h-5 w-5 text-red-500",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
              "clip-rule": "evenodd"
            })
          ], -1)
        ])])) : k("", !0)
      ]),
      v.value ? (o(), u("p", {
        key: 1,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(v.value), 9, s0)) : e.help ? (o(), u("p", {
        key: 2,
        class: "mt-2 text-sm text-gray-500",
        id: `${e.id}-description`
      }, L(e.help), 9, a0)) : k("", !0)
    ], 8, Xc));
  }
}), r0 = ["id", "name", "value"], i0 = { class: "block truncate" }, u0 = /* @__PURE__ */ ge({
  __name: "Combobox",
  props: {
    id: {},
    modelValue: {},
    multiple: { type: Boolean },
    options: {},
    values: {},
    entries: {}
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: l }) {
    const n = e;
    t({
      toggle(g) {
        r.value?.toggle(g);
      }
    });
    const a = l;
    function d(g) {
      a("update:modelValue", g);
    }
    const i = f(() => n.multiple != null ? n.multiple : Array.isArray(n.modelValue)), r = M();
    function c(g, p) {
      return !p || g.value.toLowerCase().includes(p.toLowerCase());
    }
    const v = f(() => n.entries || (n.values ? n.values.map((g) => ({ key: g, value: g })) : n.options ? Object.keys(n.options).map((g) => ({ key: g, value: n.options[g] })) : [])), m = M(i.value ? [] : null);
    function h() {
      let g = n.modelValue && typeof n.modelValue == "object" && !Array.isArray(n.modelValue) ? n.modelValue.key : n.modelValue;
      g == null || g === "" ? m.value = i.value ? [] : null : typeof g == "string" ? m.value = v.value.find((p) => p.key === g) || null : Array.isArray(g) && (m.value = v.value.filter((p) => g.includes(p.key)));
    }
    ze(h);
    const y = f(() => m.value == null ? "" : Array.isArray(m.value) ? m.value.map((g) => encodeURIComponent(g.key)).join(",") : m.value.key);
    return (g, p) => {
      const x = N("Autocomplete");
      return o(), u(he, null, [
        s("input", {
          type: "hidden",
          id: e.id,
          name: e.id,
          value: y.value
        }, null, 8, r0),
        ve(x, Se({
          ref_key: "input",
          ref: r,
          id: e.id,
          options: v.value,
          match: c,
          multiple: i.value
        }, g.$attrs, {
          modelValue: m.value,
          "onUpdate:modelValue": [
            p[0] || (p[0] = (w) => m.value = w),
            d
          ]
        }), {
          item: we(({ key: w, value: C }) => [
            s("span", i0, L(C), 1)
          ]),
          _: 1
        }, 16, ["id", "options", "multiple", "modelValue"])
      ], 64);
    };
  }
}), d0 = /* @__PURE__ */ ge({
  __name: "DynamicInput",
  props: {
    input: {},
    modelValue: {},
    api: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = f(() => l.input.type || "text"), d = "ignore,css,options,meta,allowableValues,allowableEntries,op,prop,type,id,name".split(","), i = f(() => bt(l.input, d)), r = M(a.value === "file" ? null : l.modelValue[l.input.id]);
    lt(r, () => {
      l.modelValue[l.input.id] = r.value, n("update:modelValue", l.modelValue);
    });
    const c = f(() => {
      const v = l.modelValue[l.input.id];
      if (l.input.type !== "file" || !v) return [];
      if (typeof v == "string") return [{ filePath: v, fileName: Kt(v, "/") }];
      if (!Array.isArray(v) && typeof v == "object") return v;
      if (Array.isArray(v)) {
        const m = [];
        return v.forEach((h) => {
          typeof h == "string" ? m.push({ filePath: h, fileName: Kt(h, "/") }) : typeof h == "object" && m.push(h);
        }), m;
      }
    });
    return (v, m) => {
      const h = N("SelectInput"), y = N("CheckboxInput"), g = N("TagInput"), p = N("Combobox"), x = N("FileInput"), w = N("TextareaInput"), C = N("MarkdownInput"), F = N("TextInput");
      return ne(ee).component(a.value) ? (o(), W(ra(ne(ee).component(a.value)), Se({
        key: 0,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[0] || (m[0] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class"])) : a.value == "select" ? (o(), W(h, Se({
        key: 1,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[1] || (m[1] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label,
        entries: e.input.allowableEntries,
        values: e.input.allowableValues
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class", "entries", "values"])) : a.value == "checkbox" ? (o(), W(y, Se({
        key: 2,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[2] || (m[2] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class"])) : a.value == "tag" ? (o(), W(g, Se({
        key: 3,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[3] || (m[3] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label,
        allowableValues: e.input.allowableValues,
        string: e.input.prop?.type == "String"
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class", "allowableValues", "string"])) : a.value == "combobox" ? (o(), W(p, Se({
        key: 4,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[4] || (m[4] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label,
        entries: e.input.allowableEntries,
        values: e.input.allowableValues
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class", "entries", "values"])) : a.value == "file" ? (o(), W(x, Se({
        key: 5,
        id: e.input.id,
        status: e.api?.error,
        modelValue: r.value,
        "onUpdate:modelValue": m[5] || (m[5] = (B) => r.value = B),
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label,
        files: c.value
      }, i.value), null, 16, ["id", "status", "modelValue", "input-class", "label-class", "files"])) : a.value == "textarea" ? (o(), W(w, Se({
        key: 6,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[6] || (m[6] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class"])) : a.value == "MarkdownInput" ? (o(), W(C, Se({
        key: 7,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[7] || (m[7] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label
      }, i.value), null, 16, ["id", "modelValue", "status", "input-class", "label-class"])) : (o(), W(F, Se({
        key: 8,
        type: a.value,
        id: e.input.id,
        modelValue: r.value,
        "onUpdate:modelValue": m[8] || (m[8] = (B) => r.value = B),
        status: e.api?.error,
        "input-class": e.input.css?.input,
        "label-class": e.input.css?.label
      }, i.value), null, 16, ["type", "id", "modelValue", "status", "input-class", "label-class"]));
    };
  }
}), c0 = { class: "lookup-field" }, f0 = ["name", "value"], m0 = {
  key: 0,
  class: "flex justify-between"
}, v0 = ["for"], p0 = {
  key: 0,
  class: "flex items-center"
}, g0 = { class: "text-sm text-gray-500 dark:text-gray-400 pr-1" }, y0 = {
  key: 1,
  class: "mt-1 relative"
}, h0 = { class: "w-full inline-flex truncate" }, b0 = { class: "text-blue-700 dark:text-blue-300 flex cursor-pointer" }, w0 = ["id"], k0 = ["id"], x0 = /* @__PURE__ */ ge({
  __name: "LookupInput",
  props: {
    id: {},
    status: {},
    input: {},
    metadataType: {},
    modelValue: {},
    label: {},
    labelClass: {},
    help: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const { config: l } = Ct(), { metadataApi: n } = gt(), a = e, d = t, i = f(() => a.id || a.input.id), r = f(() => a.label ?? je(pt(i.value)));
    let c = Pe("ApiState", void 0);
    const v = Pe("client"), m = f(() => $t.call({ responseStatus: a.status ?? c?.error.value }, i.value)), h = M(""), y = M(""), g = f(() => me(a.modelValue, i.value)), p = f(() => ot(a.metadataType).find((_) => _.name.toLowerCase() == i.value.toLowerCase())), x = f(() => nt(p.value?.ref?.model)?.icon || l.value.tableIcon);
    function w(_) {
      return _ ? a.input.options ? Object.assign({}, _, vn(a.input.options, {
        input: a.input,
        $typeFields: ot(a.metadataType).map((X) => X.name),
        ...ee.config.scopeWhitelist
      })) : _ : null;
    }
    const C = f(() => w(p.value?.ref ?? (a.input.type == "lookup" ? {
      model: a.metadataType.name,
      refId: vl(a.metadataType)?.name ?? "id",
      refLabel: a.metadataType.properties?.find((_) => _.type == "String" && !_.isPrimaryKey)?.name
    } : null)));
    let F;
    function B(_) {
      if (_) {
        if (F == null) {
          console.warn("No ModalProvider required by LookupInput");
          return;
        }
        F.openModal({ name: "ModalLookup", ref: _ }, (X) => {
          if (console.debug("openModal", h.value, " -> ", X, _e.setRefValue(_, X), _), X) {
            const I = me(X, _.refId);
            h.value = _e.setRefValue(_, X) || I;
            const O = ne(a.modelValue);
            O[i.value] = I, d("update:modelValue", O);
          }
        });
      }
    }
    function E() {
      a.modelValue[i.value] = null, h.value = "";
    }
    return ze(async () => {
      F = Pe("ModalProvider", void 0);
      const _ = a.modelValue;
      a.modelValue[i.value] || (a.modelValue[i.value] = null);
      const X = p.value, I = C.value;
      if (!X || !I) {
        console.warn(`No RefInfo for property '${i.value}'`);
        return;
      }
      h.value = "";
      let O = I.selfId == null ? me(_, X.name) : me(_, I.selfId);
      if (Al(O) && (O = me(_, I.refId)), O == null)
        return;
      const se = n.value?.operations.find((P) => P.dataModel?.name == I.model);
      if (console.debug("LookupInput queryOp", se), se != null) {
        const P = me(_, X.name);
        if (Al(P)) return;
        if (h.value = `${P}`, y.value = X.name, I.refLabel != null) {
          const z = ot(a.metadataType).filter((Z) => Z.type == I.model);
          z.length || console.warn(`Could not find ${I.model} Property on ${a.metadataType.name}`);
          const K = z.map((Z) => me(_, Z.name)).filter((Z) => !!Z), T = K.length <= 1 ? K[0] : K.find((Z) => Z[I.refId ?? "id"] == O);
          if (T != null) {
            let Z = me(T, I.refLabel);
            Z && (h.value = `${Z}`, _e.setValue(I.model, O, I.refLabel, Z));
          } else {
            const Z = X.attributes?.some((S) => S.name == "Computed") == !0;
            let A = await _e.getOrFetchValue(v, n.value, I.model, I.refId, I.refLabel, Z, O);
            h.value = A || `${I.model}: ${h.value}`;
          }
        }
      }
    }), (_, X) => {
      const I = N("Icon");
      return o(), u("div", c0, [
        s("input", {
          type: "hidden",
          name: i.value,
          value: g.value
        }, null, 8, f0),
        r.value ? (o(), u("div", m0, [
          s("label", {
            for: i.value,
            class: b(`block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
          }, L(r.value), 11, v0),
          g.value ? (o(), u("div", p0, [
            s("span", g0, L(g.value), 1),
            s("button", {
              onClick: E,
              type: "button",
              title: "clear",
              class: "mr-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:ring-offset-black"
            }, [...X[1] || (X[1] = [
              s("span", { class: "sr-only" }, "Clear", -1),
              s("svg", {
                class: "h-4 w-4",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "1.5",
                stroke: "currentColor",
                "aria-hidden": "true"
              }, [
                s("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M6 18L18 6M6 6l12 12"
                })
              ], -1)
            ])])
          ])) : k("", !0)
        ])) : k("", !0),
        C.value ? (o(), u("div", y0, [
          s("button", {
            type: "button",
            class: "lookup flex relative w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
            onClick: X[0] || (X[0] = (O) => B(C.value)),
            "aria-haspopup": "listbox",
            "aria-expanded": "true",
            "aria-labelledby": "listbox-label"
          }, [
            s("span", h0, [
              s("span", b0, [
                ve(I, {
                  class: "mr-1 w-5 h-5",
                  image: x.value
                }, null, 8, ["image"]),
                s("span", null, L(h.value), 1)
              ])
            ]),
            X[2] || (X[2] = s("span", { class: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none" }, [
              s("svg", {
                class: "h-5 w-5 text-gray-400 dark:text-gray-500",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                "aria-hidden": "true"
              }, [
                s("path", {
                  "fill-rule": "evenodd",
                  d: "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",
                  "clip-rule": "evenodd"
                })
              ])
            ], -1))
          ])
        ])) : k("", !0),
        m.value ? (o(), u("p", {
          key: 2,
          class: "mt-2 text-sm text-red-500",
          id: `${i.value}-error`
        }, L(m.value), 9, w0)) : e.help ? (o(), u("p", {
          key: 3,
          class: "mt-2 text-sm text-gray-500",
          id: `${i.value}-description`
        }, L(e.help), 9, k0)) : k("", !0)
      ]);
    };
  }
}), $0 = /* @__PURE__ */ ge({
  __name: "AutoFormFields",
  props: {
    modelValue: {},
    type: {},
    metaType: {},
    api: {},
    formLayout: {},
    configureField: {},
    configureFormLayout: {},
    hideSummary: { type: Boolean },
    flexClass: { default: "flex flex-1 flex-col justify-between" },
    divideClass: { default: "divide-y divide-gray-200 px-4 sm:px-6" },
    spaceClass: { default: "space-y-6 pt-6 pb-5" },
    fieldsetClass: { default: "grid grid-cols-12 gap-6" }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l;
    t({ forceUpdate: d, props: n, updateValue: r });
    function d() {
      Fe()?.proxy?.$forceUpdate();
    }
    function i(B, E) {
      r(B.id, me(E, B.id));
    }
    function r(B, E) {
      n.modelValue[B] = E, a("update:modelValue", n.modelValue), d();
    }
    const { metadataApi: c, apiOf: v, typeOf: m, typeOfRef: h, createFormLayout: y, Crud: g } = gt(), p = f(() => n.type || Gt(n.modelValue)), x = f(() => n.metaType ?? m(p.value)), w = f(() => h(c.value?.operations.find((B) => B.request.name == p.value)?.dataModel) || x.value);
    function C() {
      const B = x.value;
      if (!B) {
        if (n.formLayout) {
          const ie = n.formLayout.map((se) => {
            const P = { name: se.id, type: wr(se.type) }, z = Object.assign({ prop: P }, se);
            return n.configureField && n.configureField(z), z;
          });
          return n.configureFormLayout && n.configureFormLayout(ie), ie;
        }
        throw new Error(`MetadataType for ${p.value} not found`);
      }
      const E = ot(B), _ = w.value, X = n.formLayout ? Array.from(n.formLayout) : y(B), I = [], O = v(B.name);
      return X.forEach((ie) => {
        const se = E.find((K) => K.name == ie.name);
        if (ie.ignore) return;
        const P = _?.properties?.find((K) => K.name.toLowerCase() == ie.name?.toLowerCase()) ?? se, z = Object.assign({ prop: P, op: O }, ie);
        n.configureField && n.configureField(z), I.push(z);
      }), n.configureFormLayout && n.configureFormLayout(I), I;
    }
    const F = () => C().filter((B) => B.type != "hidden").map((B) => B.id);
    return (B, E) => {
      const _ = N("ErrorSummary"), X = N("LookupInput"), I = N("DynamicInput");
      return o(), u(he, null, [
        e.hideSummary ? k("", !0) : (o(), W(_, {
          key: 0,
          status: e.api?.error,
          except: F()
        }, null, 8, ["status", "except"])),
        s("div", {
          class: b(e.flexClass)
        }, [
          s("div", {
            class: b(e.divideClass)
          }, [
            s("div", {
              class: b(e.spaceClass)
            }, [
              s("fieldset", {
                class: b(e.fieldsetClass)
              }, [
                (o(!0), u(he, null, be(C(), (O) => (o(), u("div", {
                  key: O.id,
                  class: b([
                    "w-full",
                    O.css?.field ?? (O.type == "textarea" ? "col-span-12" : "col-span-12 xl:col-span-6" + (O.type == "checkbox" ? " flex items-center" : "")),
                    O.type == "hidden" ? "hidden" : ""
                  ])
                }, [
                  O.type === "lookup" || O.prop?.ref != null && O.type != "file" && !O.prop.isPrimaryKey ? (o(), W(X, {
                    key: 0,
                    metadataType: w.value,
                    input: O,
                    modelValue: e.modelValue,
                    "onUpdate:modelValue": (ie) => i(O, ie),
                    status: e.api?.error
                  }, null, 8, ["metadataType", "input", "modelValue", "onUpdate:modelValue", "status"])) : (o(), W(I, {
                    key: 1,
                    input: O,
                    modelValue: e.modelValue,
                    "onUpdate:modelValue": E[0] || (E[0] = (ie) => B.$emit("update:modelValue", ie)),
                    api: e.api
                  }, null, 8, ["input", "modelValue", "api"]))
                ], 2))), 128))
              ], 2)
            ], 2)
          ], 2)
        ], 2)
      ], 64);
    };
  }
}), C0 = { key: 0 }, S0 = { class: "text-red-700" }, L0 = { key: 0 }, V0 = { key: 2 }, M0 = ["innerHTML"], A0 = { class: "flex justify-end" }, T0 = {
  key: 2,
  class: "relative z-10",
  "aria-labelledby": "slide-over-title",
  role: "dialog",
  "aria-modal": "true"
}, j0 = { class: "fixed inset-0 overflow-hidden" }, O0 = { class: "flex min-h-0 flex-1 flex-col overflow-auto" }, F0 = { class: "flex-1" }, I0 = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6" }, P0 = { class: "flex items-start justify-between space-x-3" }, B0 = { class: "space-y-1" }, E0 = { key: 0 }, D0 = { key: 2 }, N0 = ["innerHTML"], R0 = { class: "flex h-7 items-center" }, H0 = { class: "flex justify-end" }, q0 = /* @__PURE__ */ ge({
  __name: "AutoForm",
  props: {
    type: {},
    modelValue: {},
    heading: {},
    subHeading: {},
    showLoading: { type: Boolean, default: !0 },
    jsconfig: { default: "eccn,edv" },
    formStyle: { default: "card" },
    metaType: {},
    configureField: {},
    configureFormLayout: {},
    panelClass: {},
    bodyClass: {},
    formClass: {},
    innerFormClass: {},
    headerClass: { default: "p-6" },
    buttonsClass: {},
    headingClass: {},
    subHeadingClass: {},
    submitLabel: { default: "Submit" },
    allowSubmit: {}
  },
  emits: ["success", "error", "done", "update:modelValue"],
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l, d = M(), i = M(1), r = M();
    function c() {
      i.value++, K.value = z(), Fe()?.proxy?.$forceUpdate();
    }
    async function v(R) {
      Object.assign(K.value, R), c(), await jt(() => null);
    }
    It("ModalProvider", {
      openModal: g
    });
    const h = M(), y = M();
    function g(R, ce) {
      h.value = R, y.value = ce;
    }
    async function p(R) {
      y.value && y.value(R), h.value = void 0, y.value = void 0;
    }
    const x = Il(), { getTypeName: w } = no(), { typeOf: C, Crud: F, createDto: B } = gt(), E = M(new tt()), _ = f(() => n.panelClass || Re.panelClass(n.formStyle)), X = f(() => n.formClass || n.formStyle == "card" ? "shadow sm:rounded-md" : tl.formClass), I = f(() => n.headingClass || Re.headingClass(n.formStyle)), O = f(() => n.subHeadingClass || Re.subHeadingClass(n.formStyle)), ie = f(() => typeof n.buttonsClass == "string" ? n.buttonsClass : Re.buttonsClass), se = f(() => n.type ? w(n.type) : n.modelValue?.getTypeName ? n.modelValue.getTypeName() : null), P = f(() => n.metaType ?? C(se.value)), z = () => n.modelValue || A(), K = M(z()), T = f(() => x.loading.value), Z = f(() => n.heading != null ? n.heading : P.value?.description || je(se.value));
    t({ forceUpdate: c, props: n, setModel: v, formFields: d, submit: j, close: U, model: K });
    function A() {
      return typeof n.type == "string" ? B(n.type) : n.type ? new n.type() : n.modelValue;
    }
    async function S(R) {
      if (!R || R.tagName != "FORM") {
        console.error("Not a valid form", R);
        return;
      }
      const ce = A();
      let ue = qe(ce?.getMethod, (oe) => typeof oe == "function" ? oe() : null) || "POST", D = qe(ce?.createResponse, (oe) => typeof oe == "function" ? oe() : null) == null;
      const J = n.jsconfig;
      if (Jn.hasRequestBody(ue)) {
        let oe = new ce.constructor(), re = new FormData(R);
        D ? E.value = await x.apiFormVoid(oe, re, { jsconfig: J }) : E.value = await x.apiForm(oe, re, { jsconfig: J });
      } else {
        let oe = new ce.constructor(or(K.value));
        console.debug("AutoForm.submit", oe), D ? E.value = await x.apiVoid(oe, { jsconfig: J }) : E.value = await x.api(oe, { jsconfig: J });
      }
      E.value.succeeded ? (a("success", E.value.response), U()) : a("error", E.value.error);
    }
    async function j() {
      S(r.value);
    }
    function fe(R) {
      a("update:modelValue", R);
    }
    function V() {
      a("done");
    }
    const $ = M(!1), te = M(""), ae = {
      entering: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-0", to: "translate-x-full" }
    };
    lt($, () => {
      Ft(ae, te, $.value), $.value || setTimeout(V, 700);
    }), $.value = !0;
    function U() {
      n.formStyle == "slideOver" ? $.value = !1 : V();
    }
    const Q = (R) => {
      R.key === "Escape" && U();
    };
    return ze(() => window.addEventListener("keydown", Q)), Jt(() => window.removeEventListener("keydown", Q)), (R, ce) => {
      const ue = N("AutoFormFields"), D = N("FormLoading"), J = N("PrimaryButton"), oe = N("CloseButton"), re = N("SecondaryButton"), de = N("ModalLookup");
      return o(), u("div", null, [
        P.value ? e.formStyle == "card" ? (o(), u("div", {
          key: 1,
          class: b(_.value)
        }, [
          s("form", {
            ref_key: "elForm",
            ref: r,
            onSubmit: ce[0] || (ce[0] = Ee((Te) => S(Te.target), ["prevent"])),
            autocomplete: "off",
            class: b(e.innerFormClass)
          }, [
            s("div", {
              class: b(e.bodyClass)
            }, [
              s("div", {
                class: b(e.headerClass)
              }, [
                R.$slots.heading ? (o(), u("div", L0, [
                  G(R.$slots, "heading")
                ])) : (o(), u("h3", {
                  key: 1,
                  class: b(I.value)
                }, L(Z.value), 3)),
                R.$slots.subheading ? (o(), u("div", V0, [
                  G(R.$slots, "subheading")
                ])) : e.subHeading ? (o(), u("p", {
                  key: 3,
                  class: b(O.value)
                }, L(e.subHeading), 3)) : P.value?.notes ? (o(), u("p", {
                  key: 4,
                  class: b(["notes", O.value]),
                  innerHTML: P.value?.notes
                }, null, 10, M0)) : k("", !0)
              ], 2),
              G(R.$slots, "header", {
                instance: Fe()?.exposed,
                model: K.value
              }),
              ce[5] || (ce[5] = s("input", {
                type: "submit",
                class: "hidden"
              }, null, -1)),
              (o(), W(ue, {
                ref_key: "formFields",
                ref: d,
                key: i.value,
                type: e.type,
                modelValue: K.value,
                "onUpdate:modelValue": fe,
                api: E.value,
                configureField: e.configureField,
                configureFormLayout: e.configureFormLayout
              }, null, 8, ["type", "modelValue", "api", "configureField", "configureFormLayout"])),
              G(R.$slots, "footer", {
                instance: Fe()?.exposed,
                model: K.value
              })
            ], 2),
            G(R.$slots, "buttons", {}, () => [
              s("div", {
                class: b(ie.value)
              }, [
                s("div", null, [
                  G(R.$slots, "leftbuttons", {
                    instance: Fe()?.exposed,
                    model: K.value
                  })
                ]),
                s("div", null, [
                  e.showLoading && T.value ? (o(), W(D, { key: 0 })) : k("", !0)
                ]),
                s("div", A0, [
                  ce[6] || (ce[6] = s("div", null, null, -1)),
                  ve(J, {
                    disabled: T.value || (e.allowSubmit ? !e.allowSubmit(K.value) : !1)
                  }, {
                    default: we(() => [
                      pe(L(e.submitLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  G(R.$slots, "rightbuttons", {
                    instance: Fe()?.exposed,
                    model: K.value
                  })
                ])
              ], 2)
            ])
          ], 34)
        ], 2)) : (o(), u("div", T0, [
          ce[8] || (ce[8] = s("div", { class: "fixed inset-0" }, null, -1)),
          s("div", j0, [
            s("div", {
              onMousedown: U,
              class: "absolute inset-0 overflow-hidden"
            }, [
              s("div", {
                onMousedown: ce[2] || (ce[2] = Ee(() => {
                }, ["stop"])),
                class: "pointer-events-none fixed inset-y-0 right-0 flex pl-10"
              }, [
                s("div", {
                  class: b(["pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg", te.value])
                }, [
                  s("form", {
                    ref_key: "elForm",
                    ref: r,
                    class: b(X.value),
                    onSubmit: ce[1] || (ce[1] = Ee((Te) => S(Te.target), ["prevent"]))
                  }, [
                    s("div", O0, [
                      s("div", F0, [
                        s("div", I0, [
                          s("div", P0, [
                            s("div", B0, [
                              R.$slots.heading ? (o(), u("div", E0, [
                                G(R.$slots, "heading")
                              ])) : (o(), u("h3", {
                                key: 1,
                                class: b(I.value)
                              }, L(Z.value), 3)),
                              R.$slots.subheading ? (o(), u("div", D0, [
                                G(R.$slots, "subheading")
                              ])) : e.subHeading ? (o(), u("p", {
                                key: 3,
                                class: b(O.value)
                              }, L(e.subHeading), 3)) : P.value?.notes ? (o(), u("p", {
                                key: 4,
                                class: b(["notes", O.value]),
                                innerHTML: P.value?.notes
                              }, null, 10, N0)) : k("", !0)
                            ]),
                            s("div", R0, [
                              ve(oe, {
                                "button-class": "bg-gray-50 dark:bg-gray-900",
                                onClose: U
                              })
                            ])
                          ])
                        ]),
                        G(R.$slots, "header", {
                          instance: Fe()?.exposed,
                          model: K.value
                        }),
                        (o(), W(ue, {
                          ref_key: "formFields",
                          ref: d,
                          key: i.value,
                          type: e.type,
                          modelValue: K.value,
                          "onUpdate:modelValue": fe,
                          api: E.value,
                          configureField: e.configureField,
                          configureFormLayout: e.configureFormLayout
                        }, null, 8, ["type", "modelValue", "api", "configureField", "configureFormLayout"])),
                        G(R.$slots, "footer", {
                          instance: Fe()?.exposed,
                          model: K.value
                        })
                      ])
                    ]),
                    s("div", {
                      class: b(ie.value)
                    }, [
                      s("div", null, [
                        G(R.$slots, "leftbuttons", {
                          instance: Fe()?.exposed,
                          model: K.value
                        })
                      ]),
                      s("div", null, [
                        e.showLoading && T.value ? (o(), W(D, { key: 0 })) : k("", !0)
                      ]),
                      s("div", H0, [
                        ve(re, {
                          onClick: U,
                          disabled: T.value
                        }, {
                          default: we(() => [...ce[7] || (ce[7] = [
                            pe("Cancel", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"]),
                        ve(J, {
                          class: "ml-4",
                          disabled: T.value || (e.allowSubmit ? !e.allowSubmit(K.value) : !1)
                        }, {
                          default: we(() => [
                            pe(L(e.submitLabel), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        G(R.$slots, "rightbuttons", {
                          instance: Fe()?.exposed,
                          model: K.value
                        })
                      ])
                    ], 2)
                  ], 34)
                ], 2)
              ], 32)
            ], 32)
          ])
        ])) : (o(), u("div", C0, [
          s("p", S0, [
            ce[3] || (ce[3] = pe("Could not create form for unknown ", -1)),
            ce[4] || (ce[4] = s("b", null, "type", -1)),
            pe(" " + L(se.value), 1)
          ])
        ])),
        h.value?.name == "ModalLookup" && h.value.ref ? (o(), W(de, {
          key: 3,
          "ref-info": h.value.ref,
          onDone: p,
          configureField: e.configureField
        }, null, 8, ["ref-info", "configureField"])) : k("", !0)
      ]);
    };
  }
}), z0 = { key: 0 }, U0 = { class: "text-red-700" }, K0 = { key: 0 }, Q0 = { key: 2 }, J0 = ["innerHTML"], G0 = { class: "flex justify-end" }, W0 = {
  key: 2,
  class: "relative z-10",
  "aria-labelledby": "slide-over-title",
  role: "dialog",
  "aria-modal": "true"
}, Z0 = { class: "fixed inset-0 overflow-hidden" }, X0 = { class: "flex min-h-0 flex-1 flex-col overflow-auto" }, Y0 = { class: "flex-1" }, _0 = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6" }, ef = { class: "flex items-start justify-between space-x-3" }, tf = { class: "space-y-1" }, lf = { key: 0 }, nf = { key: 2 }, sf = ["innerHTML"], af = { class: "flex h-7 items-center" }, of = { class: "flex justify-end" }, rf = /* @__PURE__ */ ge({
  __name: "AutoCreateForm",
  props: {
    type: {},
    formStyle: { default: "slideOver" },
    panelClass: {},
    formClass: {},
    headingClass: {},
    subHeadingClass: {},
    buttonsClass: {},
    heading: {},
    subHeading: {},
    autosave: { type: Boolean, default: !0 },
    showLoading: { type: Boolean, default: !0 },
    showCancel: { type: Boolean, default: !0 },
    configureField: {},
    configureFormLayout: {}
  },
  emits: ["done", "save", "error"],
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l, d = M(), i = M(1);
    function r() {
      i.value++, d.value?.forceUpdate(), Fe()?.proxy?.$forceUpdate();
    }
    function c(Q) {
      Object.assign(I.value, Q), r();
    }
    function v(Q) {
    }
    It("ModalProvider", {
      openModal: g
    });
    const h = M(), y = M();
    function g(Q, R) {
      h.value = Q, y.value = R;
    }
    async function p(Q) {
      y.value && y.value(Q), h.value = void 0, y.value = void 0;
    }
    const { typeOf: x, typeProperties: w, Crud: C, createDto: F, formValues: B } = gt(), E = f(() => Gt(n.type)), _ = f(() => x(E.value)), I = M(typeof n.type == "string" ? F(n.type) : n.type ? new n.type() : null);
    t({ forceUpdate: r, props: n, setModel: c, formFields: d, model: I });
    const O = f(() => n.panelClass || Re.panelClass(n.formStyle)), ie = f(() => n.formClass || Re.formClass(n.formStyle)), se = f(() => n.headingClass || Re.headingClass(n.formStyle)), P = f(() => n.subHeadingClass || Re.subHeadingClass(n.formStyle)), z = f(() => n.buttonsClass || Re.buttonsClass), K = f(() => C.model(_.value)), T = f(() => n.heading || x(E.value)?.description || (K.value ? `New ${je(K.value)}` : je(E.value))), Z = M(new tt());
    let A = Il(), S = f(() => A.loading.value);
    ee.interceptors.has("AutoCreateForm.new") && ee.interceptors.invoke("AutoCreateForm.new", { props: n, model: I });
    async function j(Q) {
      let R = Q.target;
      if (!n.autosave) {
        a("save", new I.value.constructor(B(R, w(_.value))));
        return;
      }
      let ce = qe(I.value?.getMethod, (D) => typeof D == "function" ? D() : null) || "POST", ue = qe(I.value?.createResponse, (D) => typeof D == "function" ? D() : null) == null;
      if (Jn.hasRequestBody(ce)) {
        let D = new I.value.constructor(), J = new FormData(R);
        ue ? Z.value = await A.apiFormVoid(D, J, { jsconfig: "eccn" }) : Z.value = await A.apiForm(D, J, { jsconfig: "eccn" });
      } else {
        let D = B(R, w(_.value)), J = new I.value.constructor(D);
        ue ? Z.value = await A.apiVoid(J, { jsconfig: "eccn" }) : Z.value = await A.api(J, { jsconfig: "eccn" });
      }
      Z.value.succeeded ? (R.reset(), a("save", Z.value.response)) : a("error", Z.value.error);
    }
    function fe() {
      a("done");
    }
    const V = M(!1), $ = M(""), te = {
      entering: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-0", to: "translate-x-full" }
    };
    lt(V, () => {
      Ft(te, $, V.value), V.value || setTimeout(fe, 700);
    }), V.value = !0;
    function ae() {
      n.formStyle == "slideOver" ? V.value = !1 : fe();
    }
    const U = (Q) => {
      Q.key === "Escape" && ae();
    };
    return ze(() => window.addEventListener("keydown", U)), Jt(() => window.removeEventListener("keydown", U)), (Q, R) => {
      const ce = N("AutoFormFields"), ue = N("FormLoading"), D = N("SecondaryButton"), J = N("PrimaryButton"), oe = N("CloseButton"), re = N("ModalLookup");
      return o(), u("div", null, [
        _.value ? e.formStyle == "card" ? (o(), u("div", {
          key: 1,
          class: b(O.value)
        }, [
          s("form", {
            onSubmit: Ee(j, ["prevent"])
          }, [
            s("div", {
              class: b(ie.value)
            }, [
              s("div", null, [
                Q.$slots.heading ? (o(), u("div", K0, [
                  G(Q.$slots, "heading")
                ])) : (o(), u("h3", {
                  key: 1,
                  class: b(se.value)
                }, L(T.value), 3)),
                Q.$slots.subheading ? (o(), u("div", Q0, [
                  G(Q.$slots, "subheading")
                ])) : e.subHeading ? (o(), u("p", {
                  key: 3,
                  class: b(P.value)
                }, L(e.subHeading), 3)) : _.value?.notes ? (o(), u("p", {
                  key: 4,
                  class: b(["notes", P.value]),
                  innerHTML: _.value?.notes
                }, null, 10, J0)) : k("", !0)
              ]),
              G(Q.$slots, "header", {
                formInstance: Fe()?.exposed,
                model: I.value
              }),
              (o(), W(ce, {
                ref_key: "formFields",
                ref: d,
                key: i.value,
                modelValue: I.value,
                "onUpdate:modelValue": v,
                api: Z.value,
                configureField: e.configureField,
                configureFormLayout: e.configureFormLayout
              }, null, 8, ["modelValue", "api", "configureField", "configureFormLayout"])),
              G(Q.$slots, "footer", {
                formInstance: Fe()?.exposed,
                model: I.value
              })
            ], 2),
            s("div", {
              class: b(z.value)
            }, [
              s("div", null, [
                e.showLoading && ne(S) ? (o(), W(ue, { key: 0 })) : k("", !0)
              ]),
              s("div", G0, [
                e.showCancel ? (o(), W(D, {
                  key: 0,
                  onClick: ae,
                  disabled: ne(S)
                }, {
                  default: we(() => [...R[3] || (R[3] = [
                    pe("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : k("", !0),
                ve(J, {
                  type: "submit",
                  class: "ml-4",
                  disabled: ne(S)
                }, {
                  default: we(() => [...R[4] || (R[4] = [
                    pe("Save", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 2)
          ], 32)
        ], 2)) : (o(), u("div", W0, [
          R[7] || (R[7] = s("div", { class: "fixed inset-0" }, null, -1)),
          s("div", Z0, [
            s("div", {
              onMousedown: ae,
              class: "absolute inset-0 overflow-hidden"
            }, [
              s("div", {
                onMousedown: R[0] || (R[0] = Ee(() => {
                }, ["stop"])),
                class: "pointer-events-none fixed inset-y-0 right-0 flex pl-10"
              }, [
                s("div", {
                  class: b(["pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg", $.value])
                }, [
                  s("form", {
                    class: b(ie.value),
                    onSubmit: Ee(j, ["prevent"])
                  }, [
                    s("div", X0, [
                      s("div", Y0, [
                        s("div", _0, [
                          s("div", ef, [
                            s("div", tf, [
                              Q.$slots.heading ? (o(), u("div", lf, [
                                G(Q.$slots, "heading")
                              ])) : (o(), u("h3", {
                                key: 1,
                                class: b(se.value)
                              }, L(T.value), 3)),
                              Q.$slots.subheading ? (o(), u("div", nf, [
                                G(Q.$slots, "subheading")
                              ])) : e.subHeading ? (o(), u("p", {
                                key: 3,
                                class: b(P.value)
                              }, L(e.subHeading), 3)) : _.value?.notes ? (o(), u("p", {
                                key: 4,
                                class: b(["notes", P.value]),
                                innerHTML: _.value?.notes
                              }, null, 10, sf)) : k("", !0)
                            ]),
                            s("div", af, [
                              ve(oe, {
                                "button-class": "bg-gray-50 dark:bg-gray-900",
                                onClose: ae
                              })
                            ])
                          ])
                        ]),
                        G(Q.$slots, "header", {
                          formInstance: Fe()?.exposed,
                          model: I.value
                        }),
                        (o(), W(ce, {
                          ref_key: "formFields",
                          ref: d,
                          key: i.value,
                          modelValue: I.value,
                          "onUpdate:modelValue": v,
                          api: Z.value,
                          configureField: e.configureField,
                          configureFormLayout: e.configureFormLayout
                        }, null, 8, ["modelValue", "api", "configureField", "configureFormLayout"])),
                        G(Q.$slots, "footer", {
                          formInstance: Fe()?.exposed,
                          model: I.value
                        })
                      ])
                    ]),
                    s("div", {
                      class: b(z.value)
                    }, [
                      s("div", null, [
                        e.showLoading && ne(S) ? (o(), W(ue, { key: 0 })) : k("", !0)
                      ]),
                      s("div", of, [
                        e.showCancel ? (o(), W(D, {
                          key: 0,
                          onClick: ae,
                          disabled: ne(S)
                        }, {
                          default: we(() => [...R[5] || (R[5] = [
                            pe("Cancel", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"])) : k("", !0),
                        ve(J, {
                          type: "submit",
                          class: "ml-4",
                          disabled: ne(S)
                        }, {
                          default: we(() => [...R[6] || (R[6] = [
                            pe("Save", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 2)
                  ], 34)
                ], 2)
              ], 32)
            ], 32)
          ])
        ])) : (o(), u("div", z0, [
          s("p", U0, [
            R[1] || (R[1] = pe("Could not create form for unknown ", -1)),
            R[2] || (R[2] = s("b", null, "type", -1)),
            pe(" " + L(E.value), 1)
          ])
        ])),
        h.value?.name == "ModalLookup" && h.value.ref ? (o(), W(re, {
          key: 3,
          "ref-info": h.value.ref,
          onDone: p,
          configureField: e.configureField
        }, null, 8, ["ref-info", "configureField"])) : k("", !0)
      ]);
    };
  }
}), uf = { key: 0 }, df = { class: "text-red-700" }, cf = { key: 0 }, ff = { key: 2 }, mf = ["innerHTML"], vf = { class: "flex justify-end" }, pf = {
  key: 2,
  class: "relative z-10",
  "aria-labelledby": "slide-over-title",
  role: "dialog",
  "aria-modal": "true"
}, gf = { class: "fixed inset-0 overflow-hidden" }, yf = { class: "flex min-h-0 flex-1 flex-col overflow-auto" }, hf = { class: "flex-1" }, bf = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6" }, wf = { class: "flex items-start justify-between space-x-3" }, kf = { class: "space-y-1" }, xf = { key: 0 }, $f = { key: 2 }, Cf = ["innerHTML"], Sf = { class: "flex h-7 items-center" }, Lf = { class: "flex justify-end" }, Vf = /* @__PURE__ */ ge({
  __name: "AutoEditForm",
  props: {
    modelValue: {},
    deleteType: {},
    type: {},
    formStyle: { default: "slideOver" },
    panelClass: {},
    formClass: {},
    headingClass: {},
    subHeadingClass: {},
    buttonsClass: {},
    heading: {},
    subHeading: {},
    autosave: { type: Boolean, default: !0 },
    showLoading: { type: Boolean, default: !0 },
    showCancel: { type: Boolean },
    configureField: {},
    configureFormLayout: {}
  },
  emits: ["done", "save", "delete", "error"],
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l, d = M(), i = M(1);
    function r() {
      i.value++, se.value = ie(), Fe()?.proxy?.$forceUpdate();
    }
    function c(re) {
      Object.assign(se.value, re);
    }
    function v(re) {
    }
    It("ModalProvider", {
      openModal: g
    });
    const h = M(), y = M();
    function g(re, de) {
      h.value = re, y.value = de;
    }
    async function p(re) {
      y.value && y.value(re), h.value = void 0, y.value = void 0;
    }
    const { typeOf: x, apiOf: w, typeProperties: C, createFormLayout: F, getPrimaryKey: B, Crud: E, createDto: _, formValues: X } = gt(), I = f(() => Gt(n.type)), O = f(() => x(I.value)), ie = () => typeof n.type == "string" ? _(n.type, xl(n.modelValue)) : n.type ? new n.type(xl(n.modelValue)) : null, se = M(ie());
    t({ forceUpdate: r, props: n, setModel: c, formFields: d, model: se });
    const P = f(() => n.panelClass || Re.panelClass(n.formStyle)), z = f(() => n.formClass || Re.formClass(n.formStyle)), K = f(() => n.headingClass || Re.headingClass(n.formStyle)), T = f(() => n.subHeadingClass || Re.subHeadingClass(n.formStyle)), Z = f(() => n.buttonsClass || Re.buttonsClass), A = f(() => E.model(O.value)), S = f(() => n.heading || x(I.value)?.description || (A.value ? `Update ${je(A.value)}` : je(I.value))), j = M(new tt());
    let fe = Object.assign({}, xl(n.modelValue));
    ee.interceptors.has("AutoEditForm.new") && ee.interceptors.invoke("AutoEditForm.new", { props: n, model: se, origModel: fe });
    let V = Il(), $ = f(() => V.loading.value);
    const te = () => qe(x(E.model(O.value)), (re) => B(re));
    function ae(re) {
      const { op: de, prop: Te } = re;
      de && (E.isPatch(de) || E.isUpdate(de)) && (re.disabled = Te?.isPrimaryKey), n.configureField && n.configureField(re);
    }
    async function U(re) {
      let de = re.target;
      if (!n.autosave) {
        a("save", new se.value.constructor(X(de, C(O.value))));
        return;
      }
      let Te = qe(se.value?.getMethod, (Le) => typeof Le == "function" ? Le() : null) || "POST", Ne = qe(se.value?.createResponse, (Le) => typeof Le == "function" ? Le() : null) == null, $e = te();
      if (Jn.hasRequestBody(Te)) {
        let Le = new se.value.constructor(), Me = me(n.modelValue, $e.name), Je = new FormData(de);
        $e && !Array.from(Je.keys()).some((Ge) => Ge.toLowerCase() == $e.name.toLowerCase()) && Je.append($e.name, Me);
        let ut = [];
        const Bt = I.value && w(I.value);
        if (Bt && E.isPatch(Bt)) {
          let Ge = F(O.value), rt = {};
          if ($e && (rt[$e.name] = Me), Ge.forEach((Ue) => {
            let st = Ue.id, ct = me(fe, st);
            if ($e && $e.name.toLowerCase() === st.toLowerCase())
              return;
            let le = Je.get(st);
            ee.interceptors.has("AutoEditForm.save.formLayout") && ee.interceptors.invoke("AutoEditForm.save.formLayout", { origValue: ct, formLayout: Ge, input: Ue, newValue: le });
            let Y = le != null, Oe = Ue.type === "checkbox" ? Y !== !!ct : Ue.type === "file" ? Y : le != ct;
            !le && !ct && (Oe = !1), Oe && (le ? rt[st] = le : Ue.type !== "file" && ut.push(st));
          }), ee.interceptors.has("AutoEditForm.save") && ee.interceptors.invoke("AutoEditForm.save", { origModel: fe, formLayout: Ge, dirtyValues: rt }), Array.from(Je.keys()).filter((Ue) => !rt[Ue]).forEach((Ue) => Je.delete(Ue)), Array.from(Je.keys()).filter((Ue) => Ue.toLowerCase() != $e.name.toLowerCase()).length == 0 && ut.length == 0) {
            J();
            return;
          }
        }
        const Et = ut.length > 0 ? { jsconfig: "eccn", reset: ut } : { jsconfig: "eccn" };
        Ne ? j.value = await V.apiFormVoid(Le, Je, Et) : j.value = await V.apiForm(Le, Je, Et);
      } else {
        let Le = X(de, C(O.value));
        $e && !me(Le, $e.name) && (Le[$e.name] = me(n.modelValue, $e.name));
        let Me = new se.value.constructor(Le);
        Ne ? j.value = await V.apiVoid(Me, { jsconfig: "eccn" }) : j.value = await V.api(Me, { jsconfig: "eccn" });
      }
      j.value.succeeded ? (de.reset(), a("save", j.value.response)) : a("error", j.value.error);
    }
    async function Q(re) {
      let de = te();
      const Te = de ? me(n.modelValue, de.name) : null;
      if (!Te) {
        console.error(`Could not find Primary Key for Type ${I.value} (${A.value})`);
        return;
      }
      const Ne = { [de.name]: Te }, $e = typeof n.deleteType == "string" ? _(n.deleteType, Ne) : n.deleteType ? new n.deleteType(Ne) : null;
      qe($e.createResponse, (Me) => typeof Me == "function" ? Me() : null) == null ? j.value = await V.apiVoid($e) : j.value = await V.api($e), j.value.succeeded ? a("delete", j.value.response) : a("error", j.value.error);
    }
    function R() {
      a("done");
    }
    const ce = M(!1), ue = M(""), D = {
      entering: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-0", to: "translate-x-full" }
    };
    lt(ce, () => {
      Ft(D, ue, ce.value), ce.value || setTimeout(R, 700);
    }), ce.value = !0;
    function J() {
      n.formStyle == "slideOver" ? ce.value = !1 : R();
    }
    const oe = (re) => {
      re.key === "Escape" && J();
    };
    return ze(() => window.addEventListener("keydown", oe)), Jt(() => window.removeEventListener("keydown", oe)), (re, de) => {
      const Te = N("AutoFormFields"), Ne = N("ConfirmDelete"), $e = N("FormLoading"), Le = N("SecondaryButton"), Me = N("PrimaryButton"), Je = N("CloseButton"), ut = N("ModalLookup");
      return o(), u("div", null, [
        O.value ? e.formStyle == "card" ? (o(), u("div", {
          key: 1,
          class: b(P.value)
        }, [
          s("form", {
            onSubmit: Ee(U, ["prevent"])
          }, [
            s("div", {
              class: b(z.value)
            }, [
              s("div", null, [
                re.$slots.heading ? (o(), u("div", cf, [
                  G(re.$slots, "heading")
                ])) : (o(), u("h3", {
                  key: 1,
                  class: b(K.value)
                }, L(S.value), 3)),
                re.$slots.subheading ? (o(), u("div", ff, [
                  G(re.$slots, "subheading")
                ])) : e.subHeading ? (o(), u("p", {
                  key: 3,
                  class: b(T.value)
                }, L(e.subHeading), 3)) : O.value?.notes ? (o(), u("p", {
                  key: 4,
                  class: b(["notes", T.value]),
                  innerHTML: O.value?.notes
                }, null, 10, mf)) : k("", !0)
              ]),
              G(re.$slots, "header", {
                formInstance: Fe()?.exposed,
                model: se.value
              }),
              (o(), W(Te, {
                ref_key: "formFields",
                ref: d,
                key: i.value,
                modelValue: se.value,
                "onUpdate:modelValue": v,
                api: j.value,
                configureField: e.configureField,
                configureFormLayout: e.configureFormLayout
              }, null, 8, ["modelValue", "api", "configureField", "configureFormLayout"])),
              G(re.$slots, "footer", {
                formInstance: Fe()?.exposed,
                model: se.value
              })
            ], 2),
            s("div", {
              class: b(Z.value)
            }, [
              s("div", null, [
                e.deleteType ? (o(), W(Ne, {
                  key: 0,
                  onDelete: Q
                })) : k("", !0)
              ]),
              s("div", null, [
                e.showLoading && ne($) ? (o(), W($e, { key: 0 })) : k("", !0)
              ]),
              s("div", vf, [
                e.showCancel ? (o(), W(Le, {
                  key: 0,
                  onClick: J,
                  disabled: ne($)
                }, {
                  default: we(() => [...de[3] || (de[3] = [
                    pe("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : k("", !0),
                ve(Me, {
                  type: "submit",
                  class: "ml-4",
                  disabled: ne($)
                }, {
                  default: we(() => [...de[4] || (de[4] = [
                    pe("Save", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 2)
          ], 32)
        ], 2)) : (o(), u("div", pf, [
          de[7] || (de[7] = s("div", { class: "fixed inset-0" }, null, -1)),
          s("div", gf, [
            s("div", {
              onMousedown: J,
              class: "absolute inset-0 overflow-hidden"
            }, [
              s("div", {
                onMousedown: de[0] || (de[0] = Ee(() => {
                }, ["stop"])),
                class: "pointer-events-none fixed inset-y-0 right-0 flex pl-10"
              }, [
                s("div", {
                  class: b(["pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg", ue.value])
                }, [
                  s("form", {
                    class: b(z.value),
                    onSubmit: Ee(U, ["prevent"])
                  }, [
                    s("div", yf, [
                      s("div", hf, [
                        s("div", bf, [
                          s("div", wf, [
                            s("div", kf, [
                              re.$slots.heading ? (o(), u("div", xf, [
                                G(re.$slots, "heading")
                              ])) : (o(), u("h3", {
                                key: 1,
                                class: b(K.value)
                              }, L(S.value), 3)),
                              re.$slots.subheading ? (o(), u("div", $f, [
                                G(re.$slots, "subheading")
                              ])) : e.subHeading ? (o(), u("p", {
                                key: 3,
                                class: b(T.value)
                              }, L(e.subHeading), 3)) : O.value?.notes ? (o(), u("p", {
                                key: 4,
                                class: b(["notes", T.value]),
                                innerHTML: O.value?.notes
                              }, null, 10, Cf)) : k("", !0)
                            ]),
                            s("div", Sf, [
                              ve(Je, {
                                "button-class": "bg-gray-50 dark:bg-gray-900",
                                onClose: J
                              })
                            ])
                          ])
                        ]),
                        G(re.$slots, "header", {
                          formInstance: Fe()?.exposed,
                          model: se.value
                        }),
                        (o(), W(Te, {
                          ref_key: "formFields",
                          ref: d,
                          key: i.value,
                          modelValue: se.value,
                          "onUpdate:modelValue": v,
                          api: j.value,
                          configureField: ae,
                          configureFormLayout: e.configureFormLayout
                        }, null, 8, ["modelValue", "api", "configureFormLayout"])),
                        G(re.$slots, "footer", {
                          formInstance: Fe()?.exposed,
                          model: se.value
                        })
                      ])
                    ]),
                    s("div", {
                      class: b(Z.value)
                    }, [
                      s("div", null, [
                        e.deleteType ? (o(), W(Ne, {
                          key: 0,
                          onDelete: Q
                        })) : k("", !0)
                      ]),
                      s("div", null, [
                        e.showLoading && ne($) ? (o(), W($e, { key: 0 })) : k("", !0)
                      ]),
                      s("div", Lf, [
                        e.showCancel ? (o(), W(Le, {
                          key: 0,
                          onClick: J,
                          disabled: ne($)
                        }, {
                          default: we(() => [...de[5] || (de[5] = [
                            pe("Cancel", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"])) : k("", !0),
                        ve(Me, {
                          type: "submit",
                          class: "ml-4",
                          disabled: ne($)
                        }, {
                          default: we(() => [...de[6] || (de[6] = [
                            pe("Save", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 2)
                  ], 34)
                ], 2)
              ], 32)
            ], 32)
          ])
        ])) : (o(), u("div", uf, [
          s("p", df, [
            de[1] || (de[1] = pe("Could not create form for unknown ", -1)),
            de[2] || (de[2] = s("b", null, "type", -1)),
            pe(" " + L(I.value), 1)
          ])
        ])),
        h.value?.name == "ModalLookup" && h.value.ref ? (o(), W(ut, {
          key: 3,
          "ref-info": h.value.ref,
          onDone: p,
          configureField: e.configureField
        }, null, 8, ["ref-info", "configureField"])) : k("", !0)
      ]);
    };
  }
}), Mf = { key: 0 }, Af = { class: "text-red-700" }, Tf = { key: 0 }, jf = { key: 2 }, Of = ["innerHTML"], Ff = {
  key: 2,
  class: "relative z-10",
  "aria-labelledby": "slide-over-title",
  role: "dialog",
  "aria-modal": "true"
}, If = { class: "fixed inset-0 overflow-hidden" }, Pf = { class: "flex min-h-0 flex-1 flex-col overflow-auto" }, Bf = { class: "flex-1" }, Ef = { class: "bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6" }, Df = { class: "flex items-start justify-between space-x-3" }, Nf = { class: "space-y-1" }, Rf = { key: 0 }, Hf = { key: 2 }, qf = ["innerHTML"], zf = { class: "flex h-7 items-center" }, Uf = /* @__PURE__ */ ge({
  __name: "AutoViewForm",
  props: {
    model: {},
    apis: {},
    typeName: {},
    done: {},
    formStyle: { default: "slideOver" },
    panelClass: {},
    formClass: {},
    headingClass: {},
    subHeadingClass: {},
    heading: {},
    subHeading: {},
    showLoading: { type: Boolean },
    deleteType: {}
  },
  emits: ["done", "save", "delete", "error"],
  setup(e, { emit: t }) {
    const l = e, n = t, { typeOf: a, getPrimaryKey: d, Crud: i, createDto: r } = gt(), c = f(() => l.typeName ?? l.apis.dataModel.name), v = f(() => a(c.value)), m = f(() => l.panelClass || Re.panelClass(l.formStyle)), h = f(() => l.formClass || Re.formClass(l.formStyle)), y = f(() => l.headingClass || Re.headingClass(l.formStyle)), g = f(() => l.subHeadingClass || Re.subHeadingClass(l.formStyle)), p = f(() => l.heading || a(c.value)?.description || (l.model?.id ? `${je(c.value)} ${l.model.id}` : "View " + je(c.value))), x = M(new tt());
    Object.assign({}, xl(l.model)), ee.interceptors.has("AutoViewForm.new") && ee.interceptors.invoke("AutoViewForm.new", { props: l });
    let w = Il(), C = f(() => w.loading.value);
    const F = () => qe(v.value, (P) => d(P)), B = f(() => v.value);
    async function E(P) {
      let z = F();
      const K = z ? me(l.model, z.name) : null;
      if (!K) {
        console.error(`Could not find Primary Key for Type ${c.value} (${B.value})`);
        return;
      }
      const T = { [z.name]: K }, Z = typeof l.deleteType == "string" ? r(l.deleteType, T) : l.deleteType ? new l.deleteType(T) : null;
      qe(Z.createResponse, (S) => typeof S == "function" ? S() : null) == null ? x.value = await w.apiVoid(Z) : x.value = await w.api(Z), x.value.succeeded ? n("delete", x.value.response) : n("error", x.value.error);
    }
    function _() {
      l.done && l.done();
    }
    const X = M(!1), I = M(""), O = {
      entering: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-0", to: "translate-x-full" }
    };
    lt(X, () => {
      Ft(O, I, X.value), X.value || setTimeout(_, 700);
    }), X.value = !0;
    function ie() {
      l.formStyle == "slideOver" ? X.value = !1 : _();
    }
    const se = (P) => {
      P.key === "Escape" && ie();
    };
    return ze(() => window.addEventListener("keydown", se)), Jt(() => window.removeEventListener("keydown", se)), (P, z) => {
      const K = N("MarkupModel"), T = N("CloseButton"), Z = N("ConfirmDelete"), A = N("FormLoading");
      return o(), u("div", null, [
        c.value ? e.formStyle == "card" ? (o(), u("div", {
          key: 1,
          class: b(m.value)
        }, [
          s("div", {
            class: b(h.value)
          }, [
            s("div", null, [
              P.$slots.heading ? (o(), u("div", Tf, [
                G(P.$slots, "heading")
              ])) : (o(), u("h3", {
                key: 1,
                class: b(y.value)
              }, L(p.value), 3)),
              P.$slots.subheading ? (o(), u("div", jf, [
                G(P.$slots, "subheading")
              ])) : e.subHeading ? (o(), u("p", {
                key: 3,
                class: b(g.value)
              }, L(e.subHeading), 3)) : v.value?.notes ? (o(), u("p", {
                key: 4,
                class: b(["notes", g.value]),
                innerHTML: v.value?.notes
              }, null, 10, Of)) : k("", !0)
            ]),
            ve(K, { value: e.model }, null, 8, ["value"])
          ], 2)
        ], 2)) : (o(), u("div", Ff, [
          z[4] || (z[4] = s("div", { class: "fixed inset-0" }, null, -1)),
          s("div", If, [
            s("div", {
              onMousedown: ie,
              class: "absolute inset-0 overflow-hidden"
            }, [
              s("div", {
                onMousedown: z[0] || (z[0] = Ee(() => {
                }, ["stop"])),
                class: "pointer-events-none fixed inset-y-0 right-0 flex pl-10"
              }, [
                s("div", {
                  class: b(["pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg", I.value])
                }, [
                  s("div", {
                    class: b(h.value)
                  }, [
                    s("div", Pf, [
                      s("div", Bf, [
                        s("div", Ef, [
                          s("div", Df, [
                            s("div", Nf, [
                              P.$slots.heading ? (o(), u("div", Rf, [
                                G(P.$slots, "heading")
                              ])) : (o(), u("h3", {
                                key: 1,
                                class: b(y.value)
                              }, L(p.value), 3)),
                              P.$slots.subheading ? (o(), u("div", Hf, [
                                G(P.$slots, "subheading")
                              ])) : e.subHeading ? (o(), u("p", {
                                key: 3,
                                class: b(g.value)
                              }, L(e.subHeading), 3)) : v.value?.notes ? (o(), u("p", {
                                key: 4,
                                class: b(["notes", g.value]),
                                innerHTML: v.value?.notes
                              }, null, 10, qf)) : k("", !0)
                            ]),
                            s("div", zf, [
                              ve(T, {
                                "button-class": "bg-gray-50 dark:bg-gray-900",
                                onClose: ie
                              })
                            ])
                          ])
                        ]),
                        s("div", null, [
                          ve(K, {
                            value: e.model,
                            tableClass: "w-full border-separate border-spacing-y-1",
                            basicTrClass: "group",
                            basicThClass: "py-1 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300",
                            basicTdClass: "py-1 px-4 text-sm text-gray-900",
                            complexTitleTrClass: "group",
                            complexTitleTdClass: "py-1 px-4 font-semibold bg-indigo-600 dark:bg-indigo-700 text-white",
                            complexBodyTrClass: "group",
                            complexBodyTdClass: "py-1 px-4 bg-white dark:bg-gray-900"
                          }, null, 8, ["value"])
                        ])
                      ])
                    ]),
                    s("div", {
                      class: b(ne(Re).buttonsClass)
                    }, [
                      s("div", null, [
                        e.deleteType ? (o(), W(Z, {
                          key: 0,
                          onDelete: E
                        })) : k("", !0)
                      ]),
                      s("div", null, [
                        e.showLoading && ne(C) ? (o(), W(A, { key: 0 })) : k("", !0)
                      ]),
                      z[3] || (z[3] = s("div", { class: "flex justify-end" }, null, -1))
                    ], 2)
                  ], 2)
                ], 2)
              ], 32)
            ], 32)
          ])
        ])) : (o(), u("div", Mf, [
          s("p", Af, [
            z[1] || (z[1] = pe("Could not create view for unknown ", -1)),
            z[2] || (z[2] = s("b", null, "type", -1)),
            pe(" " + L(c.value), 1)
          ])
        ]))
      ]);
    };
  }
}), Kf = /* @__PURE__ */ ge({
  __name: "ConfirmDelete",
  emits: ["delete"],
  setup(e, { emit: t }) {
    let l = M(!1);
    const n = t, a = () => {
      l.value && n("delete");
    }, d = f(() => [
      "select-none inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white",
      l.value ? "cursor-pointer bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" : "bg-red-400"
    ]);
    return (i, r) => (o(), u(he, null, [
      Ot(s("input", {
        id: "confirmDelete",
        type: "checkbox",
        class: "focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-black",
        "onUpdate:modelValue": r[0] || (r[0] = (c) => aa(l) ? l.value = c : l = c)
      }, null, 512), [
        [Kn, ne(l)]
      ]),
      r[2] || (r[2] = s("label", {
        for: "confirmDelete",
        class: "ml-2 mr-2 select-none"
      }, "confirm", -1)),
      s("span", Se({
        onClick: Ee(a, ["prevent"]),
        class: d.value
      }, i.$attrs), [
        G(i.$slots, "default", {}, () => [
          r[1] || (r[1] = pe("Delete", -1))
        ])
      ], 16)
    ], 64));
  }
}), Qf = {
  class: "flex",
  title: "loading..."
}, Jf = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  x: "0px",
  y: "0px",
  width: "24px",
  height: "30px",
  viewBox: "0 0 24 30"
}, Gf = { class: "ml-2 mt-1 text-gray-400" }, Wf = /* @__PURE__ */ ge({
  __name: "FormLoading",
  props: {
    icon: { type: Boolean, default: !0 },
    text: { default: "loading..." }
  },
  setup(e) {
    return Pe("ApiState", void 0), (t, l) => (o(), u("div", Qf, [
      e.icon ? (o(), u("svg", Jf, [...l[0] || (l[0] = [
        nn('<rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate></rect><rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate></rect><rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate></rect>', 3)
      ])])) : k("", !0),
      s("span", Gf, L(e.text), 1)
    ]));
  }
}), Zf = ["onClick"], Xf = {
  key: 3,
  class: "flex justify-between items-center"
}, Yf = { class: "mr-1 select-none" }, _f = ["onClick"], em = /* @__PURE__ */ ge({
  inheritAttrs: !1,
  __name: "DataGrid",
  props: {
    items: { default: () => [] },
    id: { default: "DataGrid" },
    ctx: {},
    type: {},
    tableStyle: { default: "stripedRows" },
    selectedColumns: {},
    gridClass: {},
    grid2Class: {},
    grid3Class: {},
    grid4Class: {},
    tableClass: {},
    theadClass: {},
    tbodyClass: {},
    theadRowClass: {},
    theadCellClass: {},
    isSelected: {},
    headerTitle: {},
    headerTitles: {},
    visibleFrom: {},
    rowClass: {},
    rowStyle: {}
  },
  emits: ["headerSelected", "rowSelected"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = M(), d = M(null), i = (V) => d.value === V, r = ml(), c = Object.keys(r), v = c.map((V) => V.toLowerCase()), m = (V) => v.includes(V.toLowerCase()), h = (V) => c.find(($) => $.toLowerCase() == V.toLowerCase() + "-header"), y = (V) => c.find(($) => $.toLowerCase() == V.toLowerCase()), g = f(() => _l(l.items).filter((V) => m(V) || m(V + "-header"))), p = f(() => l.ctx?.dataModelName || Gt(l.type)), x = f(() => l.ctx?.dataModel || nt(p.value)), w = f(() => l.ctx?.dataModelProps || ot(x.value));
    function C(V) {
      const $ = l.headerTitles && me(l.headerTitles, V) || V;
      return l.headerTitle ? l.headerTitle($) : Sl($);
    }
    function F(V) {
      const $ = V.toLowerCase();
      return w.value.find((te) => te.name.toLowerCase() == $);
    }
    function B(V) {
      const $ = F(V);
      return $?.format ? $.format : $?.type == "TimeSpan" || $?.type == "TimeOnly" ? { method: "time" } : null;
    }
    const E = {
      xs: "xs:table-cell",
      sm: "sm:table-cell",
      md: "md:table-cell",
      lg: "lg:table-cell",
      xl: "xl:table-cell",
      "2xl": "2xl:table-cell",
      never: ""
    };
    function _(V) {
      const $ = l.visibleFrom && me(l.visibleFrom, V);
      return $ && qe(E[$], (te) => `hidden ${te}`);
    }
    const X = f(() => l.gridClass ?? ke.getGridClass(l.tableStyle)), I = f(() => l.grid2Class ?? ke.getGrid2Class(l.tableStyle)), O = f(() => l.grid3Class ?? ke.getGrid3Class(l.tableStyle)), ie = f(() => l.grid4Class ?? ke.getGrid4Class(l.tableStyle)), se = f(() => l.tableClass ?? ke.getTableClass(l.tableStyle)), P = f(() => l.tbodyClass ?? ke.getTbodyClass(l.tbodyClass)), z = f(() => l.theadClass ?? ke.getTheadClass(l.tableStyle)), K = f(() => l.theadRowClass ?? ke.getTheadRowClass(l.tableStyle)), T = f(() => l.theadCellClass ?? ke.getTheadCellClass(l.tableStyle));
    function Z(V, $) {
      return l.rowClass ? l.rowClass(V, $) : ke.getTableRowClass(l.tableStyle, $, !!(l.isSelected && l.isSelected(V)), l.isSelected != null);
    }
    function A(V, $) {
      return l.rowStyle ? l.rowStyle(V, $) : void 0;
    }
    const S = f(() => {
      const V = (typeof l.selectedColumns == "string" ? l.selectedColumns.split(",") : l.selectedColumns) || (g.value.length > 0 ? g.value : _l(l.items)), $ = w.value.reduce((te, ae) => (te[ae.name.toLowerCase()] = ae.format, te), {});
      return V.filter((te) => $[te.toLowerCase()]?.method != "hidden");
    });
    function j(V, $) {
      n("headerSelected", $, V);
    }
    function fe(V, $, te) {
      n("rowSelected", te, V);
    }
    return (V, $) => {
      const te = N("CellFormat"), ae = N("PreviewFormat");
      return e.items.length ? (o(), u("div", {
        key: 0,
        ref_key: "refResults",
        ref: a,
        class: b(X.value)
      }, [
        s("div", {
          class: b(I.value)
        }, [
          s("div", {
            class: b(O.value)
          }, [
            s("div", {
              class: b(ie.value)
            }, [
              s("table", {
                class: b(se.value)
              }, [
                s("thead", {
                  class: b(z.value)
                }, [
                  s("tr", {
                    class: b(K.value)
                  }, [
                    (o(!0), u(he, null, be(S.value, (U) => (o(), u("td", {
                      class: b([_(U), T.value, i(U) ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"])
                    }, [
                      s("div", {
                        onClick: (Q) => j(Q, U)
                      }, [
                        ne(r)[U + "-header"] ? G(V.$slots, U + "-header", { column: U }, void 0, void 0, 0) : h(U) ? G(V.$slots, h(U), { column: U }, void 0, void 0, 1) : ne(r).header ? G(V.$slots, "header", {
                          column: U,
                          label: C(U)
                        }, void 0, void 0, 2) : (o(), u("div", Xf, [
                          s("span", Yf, L(C(U)), 1)
                        ]))
                      ], 8, Zf)
                    ], 2))), 256))
                  ], 2)
                ], 2),
                s("tbody", {
                  class: b(P.value)
                }, [
                  (o(!0), u(he, null, be(e.items, (U, Q) => (o(), u("tr", {
                    class: b(Z(U, Q)),
                    style: Un(A(U, Q)),
                    onClick: (R) => fe(R, Q, U)
                  }, [
                    (o(!0), u(he, null, be(S.value, (R) => (o(), u("td", {
                      class: b([_(R), ne(ke).tableCellClass])
                    }, [
                      ne(r)[R] ? G(V.$slots, R, Se({ ref_for: !0 }, U), void 0, void 0, 0) : y(R) ? G(V.$slots, y(R), Se({ ref_for: !0 }, U), void 0, void 0, 1) : F(R) ? (o(), W(te, {
                        key: 2,
                        type: x.value,
                        propType: F(R),
                        modelValue: U
                      }, null, 8, ["type", "propType", "modelValue"])) : (o(), W(ae, {
                        key: 3,
                        value: ne(me)(U, R),
                        format: B(R),
                        modelValue: U
                      }, null, 8, ["value", "format", "modelValue"]))
                    ], 2))), 256))
                  ], 14, _f))), 256))
                ], 2)
              ], 2)
            ], 2)
          ], 2)
        ], 2)
      ], 2)) : k("", !0);
    };
  }
}), tm = ge({
  props: {
    type: Object,
    propType: Object,
    modelValue: Object
  },
  setup(e, { attrs: t }) {
    const { typeOf: l } = gt();
    function n(a) {
      return a?.format ? a.format : a?.type == "TimeSpan" || a?.type == "TimeOnly" ? { method: "time" } : null;
    }
    return () => {
      const a = n(e.propType), d = me(e.modelValue, e.propType.name), i = Object.assign({}, e, t), r = Rt("span", { innerHTML: Ml(d, a, i) }), c = Al(d) && Array.isArray(d) ? Rt("span", {}, [
        Rt("span", { class: "mr-2" }, `${d.length}`),
        r
      ]) : r, v = e.propType?.ref;
      if (!v)
        return c;
      const h = ot(e.type).find((C) => C.type === v.model);
      if (!h)
        return c;
      const y = me(e.modelValue, h.name), g = y && v.refLabel && me(y, v.refLabel);
      if (!g)
        return c;
      const x = l(v.model)?.icon, w = x ? Rt(ro, { image: x, class: "w-5 h-5 mr-1" }) : null;
      return Rt("span", { class: "flex", title: `${v.model} ${d}` }, [
        w,
        g
      ]);
    };
  }
}), lm = { key: 0 }, nm = {
  key: 0,
  class: "mr-2"
}, sm = ["innerHTML"], am = ["innerHTML"], om = {
  inheritAttrs: !1
}, rm = /* @__PURE__ */ ge({
  ...om,
  __name: "PreviewFormat",
  props: {
    value: {},
    format: {},
    includeIcon: { type: Boolean, default: !0 },
    includeCount: { type: Boolean, default: !0 },
    maxFieldLength: { default: 150 },
    maxNestedFields: { default: 2 },
    maxNestedFieldLength: { default: 30 }
  },
  setup(e) {
    const t = e, l = f(() => Array.isArray(t.value));
    return (n, a) => ne(Al)(e.value) ? (o(), u("span", lm, [
      e.includeCount && l.value ? (o(), u("span", nm, L(e.value.length), 1)) : k("", !0),
      s("span", {
        innerHTML: ne(Ml)(e.value, e.format, n.$attrs)
      }, null, 8, sm)
    ])) : (o(), u("span", {
      key: 1,
      innerHTML: ne(Ml)(e.value, e.format, n.$attrs)
    }, null, 8, am));
  }
}), im = ["innerHTML"], um = { key: 0 }, dm = { key: 2 }, cm = /* @__PURE__ */ ge({
  __name: "HtmlFormat",
  props: {
    value: {},
    depth: { default: 0 },
    fieldAttrs: {},
    classes: { type: Function, default: (e, t, l, n, a) => n },
    formatText: {}
  },
  setup(e) {
    const t = e;
    function l(v) {
      return typeof v == "string" && typeof t.formatText == "function" ? t.formatText(v) : v;
    }
    const n = f(() => Qt(t.value)), a = f(() => Array.isArray(t.value)), d = (v) => Sl(v), i = (v) => t.fieldAttrs ? t.fieldAttrs(v) : null, r = f(() => _l(t.value)), c = (v) => v ? Object.keys(v).map((m) => ({ key: d(m), val: v[m] })) : [];
    return (v, m) => {
      const h = N("HtmlFormat", !0);
      return o(), u("div", {
        class: b(e.depth == 0 ? "prose html-format" : "")
      }, [
        n.value ? (o(), u("div", {
          key: 0,
          innerHTML: l(ne(Ml)(e.value))
        }, null, 8, im)) : a.value ? (o(), u("div", {
          key: 1,
          class: b(e.classes("array", "div", e.depth, ne(ke).gridClass))
        }, [
          ne(Qt)(e.value[0]) ? (o(), u("div", um, "[ " + L(l(e.value.join(", "))) + " ]", 1)) : (o(), u("div", {
            key: 1,
            class: b(e.classes("array", "div", e.depth, ne(ke).grid2Class))
          }, [
            s("div", {
              class: b(e.classes("array", "div", e.depth, ne(ke).grid3Class))
            }, [
              s("div", {
                class: b(e.classes("array", "div", e.depth, ne(ke).grid4Class))
              }, [
                s("table", {
                  class: b(e.classes("object", "table", e.depth, ne(ke).tableClass))
                }, [
                  s("thead", {
                    class: b(e.classes("array", "thead", e.depth, ne(ke).theadClass))
                  }, [
                    s("tr", null, [
                      (o(!0), u(he, null, be(r.value, (y) => (o(), u("th", {
                        class: b(e.classes("array", "th", e.depth, ne(ke).theadCellClass + " whitespace-nowrap"))
                      }, [
                        m[0] || (m[0] = s("b", null, null, -1)),
                        pe(L(l(d(y))), 1)
                      ], 2))), 256))
                    ])
                  ], 2),
                  s("tbody", null, [
                    (o(!0), u(he, null, be(e.value, (y, g) => (o(), u("tr", {
                      class: b(e.classes("array", "tr", e.depth, Number(g) % 2 === 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-gray-800", Number(g)))
                    }, [
                      (o(!0), u(he, null, be(r.value, (p) => (o(), u("td", {
                        class: b(e.classes("array", "td", e.depth, ne(ke).tableCellClass))
                      }, [
                        ve(h, Se({
                          value: y[p],
                          "field-attrs": e.fieldAttrs,
                          depth: e.depth + 1,
                          classes: e.classes,
                          formatText: e.formatText
                        }, { ref_for: !0 }, i(p)), null, 16, ["value", "field-attrs", "depth", "classes", "formatText"])
                      ], 2))), 256))
                    ], 2))), 256))
                  ])
                ], 2)
              ], 2)
            ], 2)
          ], 2))
        ], 2)) : (o(), u("div", dm, [
          s("table", {
            class: b(e.classes("object", "table", e.depth, "table-object"))
          }, [
            (o(!0), u(he, null, be(c(e.value), (y) => (o(), u("tr", {
              class: b(e.classes("object", "tr", e.depth, ""))
            }, [
              s("th", {
                class: b(e.classes("object", "th", e.depth, "align-top py-2 px-4 text-left text-sm font-medium tracking-wider whitespace-nowrap"))
              }, L(l(y.key)), 3),
              s("td", {
                class: b(e.classes("object", "td", e.depth, "align-top py-2 px-4 text-sm"))
              }, [
                ve(h, Se({
                  value: y.val,
                  "field-attrs": e.fieldAttrs,
                  depth: e.depth + 1,
                  classes: e.classes,
                  formatText: e.formatText
                }, { ref_for: !0 }, i(y.key)), null, 16, ["value", "field-attrs", "depth", "classes", "formatText"])
              ], 2)
            ], 2))), 256))
          ], 2)
        ]))
      ], 2);
    };
  }
}), fm = ["href"], mm = ["href", "title"], vm = /* @__PURE__ */ ge({
  __name: "MarkupFormat",
  props: {
    value: {},
    imageClass: { default: "w-8 h-8" }
  },
  setup(e) {
    const t = e, { getMimeType: l } = mr(), n = t.value;
    let a = typeof t.value;
    const d = a === "string" && n.length ? l(n) : null;
    if (a === "string" && n.length) {
      const i = n.startsWith("https://") || n.startsWith("http://");
      (i || n[0] === "/") && d?.startsWith("image/") ? a = "image" : i && (a = "link");
    }
    return (i, r) => {
      const c = N("Icon"), v = N("HtmlFormat");
      return ne(a) == "link" ? (o(), u("a", {
        key: 0,
        href: e.value,
        class: "text-indigo-600"
      }, L(e.value), 9, fm)) : ne(a) == "image" ? (o(), u("a", {
        key: 1,
        href: e.value,
        title: e.value,
        class: "inline-block"
      }, [
        ve(c, {
          src: e.value,
          class: b(e.imageClass)
        }, null, 8, ["src", "class"])
      ], 8, mm)) : (o(), W(v, {
        key: 2,
        value: e.value
      }, null, 8, ["value"]));
    };
  }
}), pm = /* @__PURE__ */ ge({
  __name: "MarkupModel",
  props: {
    value: {},
    imageClass: {},
    tableClass: {},
    basicTrClass: {},
    basicThClass: {},
    basicTdClass: {},
    complexTitleTrClass: {},
    complexTitleTdClass: {},
    complexBodyTrClass: {},
    complexBodyTdClass: {}
  },
  setup(e) {
    const t = e, l = Object.keys(t.value), n = {}, a = {};
    return l.forEach((d) => {
      const i = t.value[d], r = typeof i;
      i == null || r === "function" || r === "symbol" ? n[d] = `(${i == null ? "null" : "t"})` : r === "object" ? a[d] = i : n[d] = i;
    }), (d, i) => {
      const r = N("MarkupFormat");
      return o(), u("table", {
        class: b(t.tableClass ?? "my-2 w-full")
      }, [
        s("tbody", null, [
          (o(), u(he, null, be(n, (c, v) => s("tr", {
            class: b(t.basicTrClass ?? "leading-7")
          }, [
            s("th", {
              class: b(t.basicThClass ?? "px-2 text-left align-top")
            }, L(ne(je)(v)), 3),
            s("td", {
              class: b(t.basicTdClass ?? "align-top")
            }, [
              ve(r, { value: c }, null, 8, ["value"])
            ], 2)
          ], 2)), 64)),
          (o(), u(he, null, be(a, (c, v) => (o(), u(he, null, [
            s("tr", {
              class: b(t.complexTitleTrClass ?? "my-2 leading-7")
            }, [
              s("th", {
                colspan: "2",
                class: b(t.complexTitleTdClass ?? "px-2 bg-indigo-700 text-white")
              }, L(ne(je)(v)), 3)
            ], 2),
            s("tr", {
              class: b(t.complexBodyTrClass ?? "leading-7")
            }, [
              s("td", {
                colspan: "2",
                class: b(t.complexBodyTdClass ?? "px-2 align-top")
              }, [
                ve(r, { value: c }, null, 8, ["value"])
              ], 2)
            ], 2)
          ], 64))), 64))
        ])
      ], 2);
    };
  }
}), gm = { class: "absolute top-0 right-0 pt-4 pr-4" }, ym = ["title"], hm = /* @__PURE__ */ ge({
  __name: "CloseButton",
  props: {
    buttonClass: { default: "bg-white dark:bg-black" },
    title: { default: "Close" }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    return (l, n) => (o(), u("div", gm, [
      s("button", {
        type: "button",
        onClick: n[0] || (n[0] = (a) => l.$emit("close")),
        title: e.title,
        class: b([e.buttonClass, "cursor-pointer rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black"])
      }, [...n[1] || (n[1] = [
        s("span", { class: "sr-only" }, "Close", -1),
        s("svg", {
          class: "h-6 w-6",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          "aria-hidden": "true"
        }, [
          s("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M6 18L18 6M6 6l12 12"
          })
        ], -1)
      ])], 10, ym)
    ]));
  }
}), bm = ["id", "aria-labelledby"], wm = { class: "fixed inset-0 overflow-hidden" }, km = { class: "flex h-full flex-col bg-white dark:bg-black shadow-xl" }, xm = { class: "flex min-h-0 flex-1 flex-col overflow-auto" }, $m = { class: "flex-1" }, Cm = { class: "relative bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6" }, Sm = { class: "flex items-start justify-between space-x-3" }, Lm = { class: "space-y-1" }, Vm = { key: 0 }, Mm = ["id"], Am = {
  key: 2,
  class: "text-sm text-gray-500"
}, Tm = { class: "flex h-7 items-center" }, jm = {
  key: 0,
  class: "flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6"
}, Om = /* @__PURE__ */ ge({
  __name: "SlideOver",
  props: {
    id: { default: "SlideOver" },
    title: {},
    contentClass: { default: "relative mt-6 flex-1 px-4 sm:px-6" }
  },
  emits: ["done"],
  setup(e, { emit: t }) {
    const l = t, n = M(!1), a = M(""), d = {
      entering: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transform transition ease-in-out duration-500 sm:duration-700", from: "translate-x-0", to: "translate-x-full" }
    };
    lt(n, () => {
      Ft(d, a, n.value), n.value || setTimeout(() => l("done"), 700);
    }), n.value = !0;
    const i = () => n.value = !1, r = (c) => {
      c.key === "Escape" && i();
    };
    return ze(() => window.addEventListener("keydown", r)), Jt(() => window.removeEventListener("keydown", r)), (c, v) => {
      const m = N("CloseButton");
      return o(), u("div", {
        id: e.id,
        class: "relative z-10",
        "aria-labelledby": e.id + "-title",
        role: "dialog",
        "aria-modal": "true"
      }, [
        v[1] || (v[1] = s("div", { class: "fixed inset-0" }, null, -1)),
        s("div", wm, [
          s("div", {
            onMousedown: i,
            class: "absolute inset-0 overflow-hidden"
          }, [
            s("div", {
              onMousedown: v[0] || (v[0] = Ee(() => {
              }, ["stop"])),
              class: "pointer-events-none fixed inset-y-0 right-0 flex pl-10"
            }, [
              s("div", {
                class: b(["panel pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg", a.value])
              }, [
                s("div", km, [
                  s("div", xm, [
                    s("div", $m, [
                      s("div", Cm, [
                        s("div", Sm, [
                          s("div", Lm, [
                            c.$slots.title ? (o(), u("div", Vm, [
                              G(c.$slots, "title")
                            ])) : k("", !0),
                            e.title ? (o(), u("h2", {
                              key: 1,
                              class: "text-lg font-medium text-gray-900 dark:text-gray-50",
                              id: e.id + "-title"
                            }, L(e.title), 9, Mm)) : k("", !0),
                            c.$slots.subtitle ? (o(), u("p", Am, [
                              G(c.$slots, "subtitle")
                            ])) : k("", !0)
                          ]),
                          s("div", Tm, [
                            ve(m, {
                              "button-class": "bg-gray-50 dark:bg-gray-900",
                              onClose: i
                            })
                          ])
                        ])
                      ]),
                      s("div", {
                        class: b(e.contentClass)
                      }, [
                        G(c.$slots, "default")
                      ], 2)
                    ])
                  ]),
                  c.$slots.footer ? (o(), u("div", jm, [
                    G(c.$slots, "footer")
                  ])) : k("", !0)
                ])
              ], 2)
            ], 32)
          ], 32)
        ])
      ], 8, bm);
    };
  }
}), Fm = ["id", "data-transition-for", "aria-labelledby"], Im = { class: "fixed inset-0 z-10 overflow-y-auto" }, Pm = { class: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" }, Bm = {
  key: 1,
  class: "hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-10"
}, fo = /* @__PURE__ */ ge({
  __name: "ModalDialog",
  props: {
    id: { default: "ModalDialog" },
    modalClass: { default: Bn.modalClass },
    sizeClass: { default: Bn.sizeClass },
    closeButtonClass: { default: "bg-white dark:bg-black cursor-pointer rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black" },
    configureField: {}
  },
  emits: ["done"],
  setup(e, { emit: t }) {
    const l = ml(), n = t, a = M(!1), d = M(""), i = {
      entering: { cls: "ease-out duration-300", from: "opacity-0", to: "opacity-100" },
      leaving: { cls: "ease-in duration-200", from: "opacity-100", to: "opacity-0" }
    }, r = M(""), c = {
      entering: { cls: "ease-out duration-300", from: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", to: "opacity-100 translate-y-0 sm:scale-100" },
      leaving: { cls: "ease-in duration-200", from: "opacity-100 translate-y-0 sm:scale-100", to: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" }
    };
    lt(a, () => {
      Ft(i, d, a.value), Ft(c, r, a.value), a.value || setTimeout(() => n("done"), 200);
    }), a.value = !0;
    const v = () => a.value = !1;
    It("ModalProvider", {
      openModal: g
    });
    const h = M(), y = M();
    function g(w, C) {
      h.value = w, y.value = C;
    }
    async function p(w) {
      y.value && y.value(w), h.value = void 0, y.value = void 0;
    }
    const x = (w) => {
      w.key === "Escape" && v();
    };
    return ze(() => window.addEventListener("keydown", x)), Jt(() => window.removeEventListener("keydown", x)), (w, C) => {
      const F = N("ModalLookup");
      return o(), u("div", {
        id: e.id,
        "data-transition-for": e.id,
        onMousedown: v,
        class: "relative z-10",
        "aria-labelledby": `${e.id}-title`,
        role: "dialog",
        "aria-modal": "true"
      }, [
        s("div", {
          class: b(["fixed inset-0 bg-gray-500/75 transition-opacity", d.value])
        }, null, 2),
        s("div", Im, [
          s("div", Pm, [
            s("div", {
              class: b([e.modalClass, e.sizeClass, r.value]),
              onMousedown: C[0] || (C[0] = Ee(() => {
              }, ["stop"]))
            }, [
              s("div", null, [
                ne(l).closebutton ? G(w.$slots, "createform", {}, void 0, void 0, 0) : (o(), u("div", Bm, [
                  s("button", {
                    type: "button",
                    onClick: v,
                    class: b(e.closeButtonClass),
                    title: "Close"
                  }, [...C[1] || (C[1] = [
                    s("span", { class: "sr-only" }, "Close", -1),
                    s("svg", {
                      class: "h-6 w-6",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "aria-hidden": "true"
                    }, [
                      s("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M6 18L18 6M6 6l12 12"
                      })
                    ], -1)
                  ])], 2)
                ])),
                G(w.$slots, "default")
              ])
            ], 34),
            G(w.$slots, "bottom")
          ])
        ]),
        h.value?.name == "ModalLookup" && h.value.ref ? (o(), W(F, {
          key: 0,
          "ref-info": h.value.ref,
          onDone: p,
          configureField: e.configureField
        }, null, 8, ["ref-info", "configureField"])) : k("", !0)
      ], 40, Fm);
    };
  }
}), Em = {
  class: "pt-2 overflow-auto",
  style: { "min-height": "620px" }
}, Dm = { class: "mt-3 pl-5 flex flex-wrap items-center" }, Nm = { class: "hidden sm:block text-xl leading-6 font-medium text-gray-900 dark:text-gray-50 mr-3" }, Rm = { class: "hidden md:inline" }, Hm = { class: "flex pb-1 sm:pb-0" }, qm = ["title"], zm = ["disabled"], Um = ["disabled"], Km = ["disabled"], Qm = ["disabled"], Jm = {
  key: 0,
  class: "flex pb-1 sm:pb-0"
}, Gm = { class: "px-4 text-lg text-black dark:text-white" }, Wm = { key: 0 }, Zm = { key: 1 }, Xm = { key: 2 }, Ym = {
  key: 1,
  class: "pl-2 mt-1"
}, _m = { class: "whitespace-nowrap" }, ev = {
  key: 2,
  class: "pl-2"
}, tv = { class: "flex pb-1 sm:pb-0" }, lv = {
  key: 0,
  class: "pl-2"
}, nv = { class: "mr-1" }, sv = {
  key: 0,
  class: "h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, av = {
  key: 1,
  class: "h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, ov = { key: 1 }, rv = { key: 4 }, iv = { key: 0 }, uv = {
  key: 0,
  class: "cursor-pointer flex justify-between items-center hover:text-gray-900 dark:hover:text-gray-50"
}, dv = { class: "mr-1 select-none" }, cv = {
  key: 1,
  class: "flex justify-between items-center"
}, fv = { class: "mr-1 select-none" }, Us = 25, mv = /* @__PURE__ */ ge({
  __name: "ModalLookup",
  props: {
    id: { default: "ModalLookup" },
    refInfo: {},
    skip: { default: 0 },
    prefs: {},
    selectedColumns: {},
    allowFiltering: { type: [Boolean, null], default: !0 },
    showPreferences: { type: [Boolean, null], default: !0 },
    showPagingNav: { type: [Boolean, null], default: !0 },
    showPagingInfo: { type: [Boolean, null], default: !0 },
    showResetPreferences: { type: [Boolean, null], default: !0 },
    showFiltersView: { type: [Boolean, null], default: !0 },
    toolbarButtonClass: {},
    canFilter: {},
    type: {},
    modelTitle: {},
    newButtonLabel: {},
    configureField: {}
  },
  emits: ["done"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = ml(), { config: d } = Ct(), { metadataApi: i, filterDefinitions: r } = gt(), c = Pe("client"), v = d.value.storage, m = f(() => l.toolbarButtonClass ?? ke.toolbarButtonClass), h = f(() => r.value), y = M({ take: Us }), g = M(new tt()), p = M(l.skip), x = M(!1), w = M(), C = (le) => typeof le == "string" ? le.split(",") : le || [];
    function F(le, Y) {
      return ke.getTableRowClass("fullWidth", Y, !1, !0);
    }
    function B() {
      let le = C(l.selectedColumns);
      return le.length > 0 ? le : [];
    }
    const E = f(() => nt(l.refInfo.model)), _ = f(() => {
      let Y = B().map((Ie) => Ie.toLowerCase());
      const Oe = ot(E.value);
      return Y.length > 0 ? Y.map((Ie) => Oe.find((We) => We.name.toLowerCase() === Ie)).filter((Ie) => Ie != null) : Oe;
    }), X = f(() => {
      let le = _.value.map((Oe) => Oe.name), Y = C(y.value.selectedColumns).map((Oe) => Oe.toLowerCase());
      return Y.length > 0 ? le.filter((Oe) => Y.includes(Oe.toLowerCase())) : le;
    }), I = f(() => y.value.take ?? Us), O = f(() => (g.value.response ? me(g.value.response, "results") : null) ?? []), ie = f(() => g.value.response?.total ?? O.value.length ?? 0), se = f(() => p.value > 0), P = f(() => p.value > 0), z = f(() => O.value.length >= I.value), K = f(() => O.value.length >= I.value), T = M([]), Z = f(() => T.value.some((le) => le.settings.filters.length > 0 || !!le.settings.sort)), A = f(() => T.value.map((le) => le.settings.filters.length).reduce((le, Y) => le + Y, 0)), S = f(() => vl(E.value)), j = f(() => i.value?.operations.find((le) => le.dataModel?.name == l.refInfo.model && He.isAnyQuery(le))), fe = M(), V = M(!1), $ = M(), te = f(() => Gt(l.refInfo.model)), ae = f(() => At.forType(te.value, i.value)), U = f(() => te.value || j.value?.dataModel.name), Q = f(() => l.modelTitle || U.value), R = f(() => l.newButtonLabel || `New ${Q.value}`), ce = f(() => $l(ae.value.Create)), ue = M(), D = M(!1);
    function J() {
      D.value = !0;
    }
    function oe() {
      D.value = !1;
    }
    async function re(le) {
      oe(), n("done", le);
    }
    function de(le) {
      ue.value && (Object.assign(ue.value?.model, le), console.log("setCreate", JSON.stringify(le, null, 2)), Te());
    }
    function Te() {
      ue.value?.forceUpdate(), Fe()?.proxy?.$forceUpdate();
    }
    const Ne = () => `${l.id}/ApiPrefs/${l.refInfo.model}`, $e = (le) => `Column/${l.id}:${l.refInfo.model}.${le}`;
    async function Le(le) {
      p.value += le, p.value < 0 && (p.value = 0);
      var Y = Math.floor(ie.value / I.value) * I.value;
      p.value > Y && (p.value = Y), await dt();
    }
    async function Me(le, Y) {
      n("done", le);
    }
    function Je() {
      n("done", null);
    }
    function ut(le, Y) {
      let Oe = Y.target;
      if (Oe?.tagName !== "TD") {
        let Ie = Oe?.closest("TABLE")?.getBoundingClientRect(), We = T.value.find((ft) => ft.name.toLowerCase() == le.toLowerCase());
        if (We && Ie) {
          let ft = 318, Zt = (Y.target?.tagName === "DIV" ? Y.target : Y.target?.closest("DIV")).getBoundingClientRect(), De = ft + 25;
          $.value = {
            column: We,
            topLeft: {
              x: Math.max(Math.floor(Zt.x + 25), De),
              y: Math.floor(115)
            }
          };
        }
      }
    }
    function Bt() {
      $.value = null;
    }
    async function Et(le) {
      let Y = $.value?.column;
      Y && (Y.settings = le, v.setItem($e(Y.name), JSON.stringify(Y.settings)), await dt()), $.value = null;
    }
    async function Ge(le) {
      v.setItem($e(le.name), JSON.stringify(le.settings)), await dt();
    }
    async function rt(le) {
      V.value = !1, y.value = le, v.setItem(Ne(), JSON.stringify(le)), await dt();
    }
    async function dt() {
      await Ue(st());
    }
    async function Ue(le) {
      const Y = j.value;
      if (!Y) {
        console.error(`No Query API was found for ${l.refInfo.model}`);
        return;
      }
      let Oe = Ll(Y, le), Ie = fa((Wt) => {
        g.value.response = g.value.error = void 0, x.value = Wt;
      }), We = await c.api(Oe);
      Ie(), jt(() => g.value = We);
      let ft = me(We.response, "results") || [];
      !We.succeeded || ft.label == 0;
    }
    function st() {
      let le = {
        include: "total",
        take: I.value
      }, Y = C(y.value.selectedColumns || l.selectedColumns);
      if (Y.length > 0) {
        let Ie = S.value;
        Ie && Y.includes(Ie.name) && (Y = [Ie.name, ...Y]), le.fields = Y.join(",");
      }
      let Oe = [];
      return T.value.forEach((Ie) => {
        Ie.settings.sort && Oe.push((Ie.settings.sort === "DESC" ? "-" : "") + Ie.name), Ie.settings.filters.forEach((We) => {
          let ft = We.key.replace("%", Ie.name);
          le[ft] = We.value;
        });
      }), typeof le.skip > "u" && p.value > 0 && (le.skip = p.value), Oe.length > 0 && (le.orderBy = Oe.join(",")), le;
    }
    async function ct() {
      T.value.forEach((le) => {
        le.settings = { filters: [] }, v.removeItem($e(le.name));
      }), await dt();
    }
    return ze(async () => {
      const le = l.prefs || en(v.getItem(Ne()));
      le && (y.value = le), T.value = _.value.map((Y) => ({
        name: Y.name,
        type: Y.type,
        meta: Y,
        settings: Object.assign(
          {
            filters: []
          },
          en(v.getItem($e(Y.name)))
        )
      })), isNaN(l.skip) || (p.value = l.skip), await dt();
    }), (le, Y) => {
      const Oe = N("AutoCreateForm"), Ie = N("ErrorSummary"), We = N("Loading"), ft = N("SettingsIcons"), Wt = N("DataGrid"), Zt = N("ModalDialog");
      return o(), u(he, null, [
        e.refInfo ? (o(), W(Zt, {
          key: 0,
          ref_key: "modalDialog",
          ref: fe,
          id: e.id,
          onDone: Je
        }, {
          default: we(() => [
            s("div", Em, [
              s("div", Dm, [
                s("h3", Nm, [
                  Y[9] || (Y[9] = pe(" Select ", -1)),
                  s("span", Rm, L(ne(je)(e.refInfo.model)), 1)
                ]),
                s("div", Hm, [
                  e.showPreferences ? (o(), u("button", {
                    key: 0,
                    type: "button",
                    class: "pl-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                    title: `${e.refInfo.model} Preferences`,
                    onClick: Y[0] || (Y[0] = (De) => V.value = !V.value)
                  }, [...Y[10] || (Y[10] = [
                    s("svg", {
                      class: "w-8 h-8",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("g", {
                        "stroke-width": "1.5",
                        fill: "none"
                      }, [
                        s("path", {
                          d: "M9 3H3.6a.6.6 0 0 0-.6.6v16.8a.6.6 0 0 0 .6.6H9M9 3v18M9 3h6M9 21h6m0-18h5.4a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H15m0-18v18",
                          stroke: "currentColor"
                        })
                      ])
                    ], -1)
                  ])], 8, qm)) : k("", !0),
                  e.showPagingNav ? (o(), u("button", {
                    key: 1,
                    type: "button",
                    class: b(["pl-2", se.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                    title: "First page",
                    disabled: !se.value,
                    onClick: Y[1] || (Y[1] = (De) => Le(-ie.value))
                  }, [...Y[11] || (Y[11] = [
                    s("svg", {
                      class: "w-8 h-8",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6l6 6zM6 6h2v12H6z",
                        fill: "currentColor"
                      })
                    ], -1)
                  ])], 10, zm)) : k("", !0),
                  e.showPagingNav ? (o(), u("button", {
                    key: 2,
                    type: "button",
                    class: b(["pl-2", P.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                    title: "Previous page",
                    disabled: !P.value,
                    onClick: Y[2] || (Y[2] = (De) => Le(-I.value))
                  }, [...Y[12] || (Y[12] = [
                    s("svg", {
                      class: "w-8 h-8",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        d: "M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z",
                        fill: "currentColor"
                      })
                    ], -1)
                  ])], 10, Um)) : k("", !0),
                  e.showPagingNav ? (o(), u("button", {
                    key: 3,
                    type: "button",
                    class: b(["pl-2", z.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                    title: "Next page",
                    disabled: !z.value,
                    onClick: Y[3] || (Y[3] = (De) => Le(I.value))
                  }, [...Y[13] || (Y[13] = [
                    s("svg", {
                      class: "w-8 h-8",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        d: "M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z",
                        fill: "currentColor"
                      })
                    ], -1)
                  ])], 10, Km)) : k("", !0),
                  e.showPagingNav ? (o(), u("button", {
                    key: 4,
                    type: "button",
                    class: b(["pl-2", K.value ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500"]),
                    title: "Last page",
                    disabled: !K.value,
                    onClick: Y[4] || (Y[4] = (De) => Le(ie.value))
                  }, [...Y[14] || (Y[14] = [
                    s("svg", {
                      class: "w-8 h-8",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6l-6-6zM16 6h2v12h-2z",
                        fill: "currentColor"
                      })
                    ], -1)
                  ])], 10, Qm)) : k("", !0)
                ]),
                e.showPagingInfo ? (o(), u("div", Jm, [
                  s("div", Gm, [
                    x.value ? (o(), u("span", Wm, "Querying...")) : k("", !0),
                    O.value.length ? (o(), u("span", Zm, [
                      Y[15] || (Y[15] = s("span", { class: "hidden xl:inline" }, " Showing Results ", -1)),
                      pe(" " + L(p.value + 1) + " - " + L(Math.min(p.value + O.value.length, ie.value)) + " ", 1),
                      s("span", null, " of " + L(ie.value), 1)
                    ])) : g.value.completed ? (o(), u("span", Xm, "No Results")) : k("", !0)
                  ])
                ])) : k("", !0),
                ae.value.Create && ce.value ? (o(), u("div", Ym, [
                  s("button", {
                    type: "button",
                    onClick: Y[5] || (Y[5] = (De) => J()),
                    title: "modelTitle",
                    class: b(ne(ke).toolbarButtonClass)
                  }, [
                    Y[16] || (Y[16] = s("svg", {
                      class: "w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
                        fill: "currentColor"
                      })
                    ], -1)),
                    s("span", _m, L(R.value), 1)
                  ], 2),
                  D.value ? (o(), W(Oe, {
                    key: 0,
                    ref_key: "createForm",
                    ref: ue,
                    type: ae.value.Create.request.name,
                    configure: e.configureField,
                    onDone: oe,
                    onSave: re
                  }, {
                    header: we(() => [
                      G(le.$slots, "formheader", {
                        form: "create",
                        formInstance: ue.value,
                        apis: ae.value,
                        type: U.value,
                        updateModel: de
                      })
                    ]),
                    footer: we(() => [
                      G(le.$slots, "formfooter", {
                        form: "create",
                        formInstance: ue.value,
                        apis: ae.value,
                        type: U.value,
                        updateModel: de
                      })
                    ]),
                    _: 3
                  }, 8, ["type", "configure"])) : k("", !0)
                ])) : k("", !0),
                Z.value && e.showResetPreferences ? (o(), u("div", ev, [
                  s("button", {
                    type: "button",
                    onClick: ct,
                    title: "Reset Preferences & Filters",
                    class: b(m.value)
                  }, [...Y[17] || (Y[17] = [
                    s("svg", {
                      class: "w-5 h-5",
                      xmlns: "http://www.w3.org/2000/svg",
                      "aria-hidden": "true",
                      viewBox: "0 0 24 24"
                    }, [
                      s("path", {
                        fill: "currentColor",
                        d: "M6.78 2.72a.75.75 0 0 1 0 1.06L4.56 6h8.69a7.75 7.75 0 1 1-7.75 7.75a.75.75 0 0 1 1.5 0a6.25 6.25 0 1 0 6.25-6.25H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 0Z"
                      })
                    ], -1)
                  ])], 2)
                ])) : k("", !0),
                s("div", tv, [
                  e.showFiltersView && A.value > 0 ? (o(), u("div", lv, [
                    s("button", {
                      type: "button",
                      onClick: Y[6] || (Y[6] = (De) => w.value = w.value == "filters" ? null : "filters"),
                      class: b(m.value),
                      "aria-expanded": "false"
                    }, [
                      Y[20] || (Y[20] = s("svg", {
                        class: "flex-none w-5 h-5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-gray-500",
                        "aria-hidden": "true",
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor"
                      }, [
                        s("path", {
                          "fill-rule": "evenodd",
                          d: "M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z",
                          "clip-rule": "evenodd"
                        })
                      ], -1)),
                      s("span", nv, L(A.value) + " " + L(A.value == 1 ? "Filter" : "Filters"), 1),
                      w.value != "filters" ? (o(), u("svg", sv, [...Y[18] || (Y[18] = [
                        s("path", {
                          "fill-rule": "evenodd",
                          d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                          "clip-rule": "evenodd"
                        }, null, -1)
                      ])])) : (o(), u("svg", av, [...Y[19] || (Y[19] = [
                        s("path", {
                          "fill-rule": "evenodd",
                          d: "M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z",
                          "clip-rule": "evenodd"
                        }, null, -1)
                      ])]))
                    ], 2)
                  ])) : k("", !0)
                ])
              ]),
              w.value == "filters" ? (o(), W(bs, {
                key: 0,
                class: "border-y border-gray-200 dark:border-gray-800 py-8 my-2",
                definitions: h.value,
                columns: T.value,
                onDone: Y[7] || (Y[7] = (De) => w.value = null),
                onChange: Ge
              }, null, 8, ["definitions", "columns"])) : k("", !0),
              $.value ? (o(), u("div", ov, [
                ve(hs, {
                  definitions: h.value,
                  column: $.value.column,
                  "top-left": $.value.topLeft,
                  onDone: Bt,
                  onSave: Et
                }, null, 8, ["definitions", "column", "top-left"])
              ])) : k("", !0),
              g.value.error ? (o(), W(Ie, {
                key: 2,
                status: g.value.error
              }, null, 8, ["status"])) : x.value ? (o(), W(We, { key: 3 })) : (o(), u("div", rv, [
                O.value.length ? (o(), u("div", iv, [
                  ve(Wt, {
                    id: e.id,
                    items: O.value,
                    type: e.refInfo.model,
                    "selected-columns": X.value,
                    onFiltersChanged: dt,
                    tableStyle: "fullWidth",
                    rowClass: F,
                    onRowSelected: Me,
                    onHeaderSelected: ut
                  }, Qn({
                    header: we(({ column: De, label: St }) => [
                      e.allowFiltering && (!l.canFilter || l.canFilter(De)) ? (o(), u("div", uv, [
                        s("span", dv, L(St), 1),
                        ve(ft, {
                          column: T.value.find((it) => it.name.toLowerCase() === De.toLowerCase()),
                          "is-open": $.value?.column.name === De
                        }, null, 8, ["column", "is-open"])
                      ])) : (o(), u("div", cv, [
                        s("span", fv, L(St), 1)
                      ]))
                    ]),
                    _: 2
                  }, [
                    be(Object.keys(ne(a)), (De) => ({
                      name: De,
                      fn: we((St) => [
                        G(le.$slots, De, Zl(Xl(St)))
                      ])
                    }))
                  ]), 1032, ["id", "items", "type", "selected-columns"])
                ])) : k("", !0)
              ]))
            ])
          ]),
          _: 3
        }, 8, ["id"])) : k("", !0),
        V.value ? (o(), W(ws, {
          key: 1,
          columns: _.value,
          prefs: y.value,
          onDone: Y[8] || (Y[8] = (De) => V.value = !1),
          onSave: rt
        }, null, 8, ["columns", "prefs"])) : k("", !0)
      ], 64);
    };
  }
}), vv = { class: "sm:hidden" }, pv = ["for"], gv = ["id", "name"], yv = ["value"], hv = { class: "hidden sm:block" }, bv = { class: "border-b border-gray-200" }, wv = {
  class: "-mb-px flex",
  "aria-label": "Tabs"
}, kv = ["onClick"], xv = /* @__PURE__ */ ge({
  __name: "Tabs",
  props: {
    tabs: {},
    id: { default: "tabs" },
    param: { default: "tab" },
    label: { type: Function, default: (e) => je(e) },
    selected: {},
    tabClass: {},
    bodyClass: { default: "p-4" },
    url: { type: Boolean, default: !0 },
    clearQuery: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, l = f(() => Object.keys(t.tabs)), n = (m) => t.label ? t.label(m) : je(m), a = f(() => t.id || "tabs"), d = f(() => t.param || "tab"), i = M();
    function r(m) {
      if (i.value = m, t.url) {
        const h = l.value[0];
        ds({ tab: m === h ? void 0 : m }, t.clearQuery);
      }
    }
    function c(m) {
      return i.value === m;
    }
    const v = f(() => `${100 / Object.keys(t.tabs).length}%`);
    return ze(() => {
      if (i.value = t.selected || Object.keys(t.tabs)[0], t.url) {
        const m = location.search ? location.search : location.hash.includes("?") ? "?" + zl(location.hash, "?") : "", y = Vn(m)[d.value];
        y && (i.value = y);
      }
    }), (m, h) => (o(), u("div", null, [
      s("div", vv, [
        s("label", {
          for: a.value,
          class: "sr-only"
        }, "Select a tab", 8, pv),
        s("select", {
          id: a.value,
          name: a.value,
          class: "block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
          onChange: h[0] || (h[0] = (y) => r(y.target?.value))
        }, [
          (o(!0), u(he, null, be(l.value, (y) => (o(), u("option", {
            key: y,
            value: y
          }, L(n(y)), 9, yv))), 128))
        ], 40, gv)
      ]),
      s("div", hv, [
        s("div", bv, [
          s("nav", wv, [
            (o(!0), u(he, null, be(l.value, (y) => (o(), u("a", {
              href: "#",
              onClick: Ee((g) => r(y), ["prevent"]),
              style: Un({ width: v.value }),
              class: b([c(y) ? "border-indigo-500 text-indigo-600 py-4 px-1 text-center border-b-2 font-medium text-sm" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-center border-b-2 font-medium text-sm", e.tabClass])
            }, L(n(y)), 15, kv))), 256))
          ])
        ])
      ]),
      s("div", {
        class: b(e.bodyClass)
      }, [
        (o(), W(ra(e.tabs[i.value])))
      ], 2)
    ]));
  }
}), $v = /* @__PURE__ */ ge({
  __name: "DarkModeToggle",
  setup(e) {
    const t = typeof document < "u" ? document.documentElement : null, l = () => !!t?.classList.contains("dark"), n = M(localStorage.getItem("color-scheme") == "dark");
    function a() {
      l() ? t?.classList.remove("dark") : t?.classList.add("dark"), n.value = l(), t?.style.setProperty("color-scheme", n.value ? "dark" : null), localStorage.setItem("color-scheme", n.value ? "dark" : "light");
    }
    return (d, i) => (o(), u("button", {
      type: "button",
      class: "bg-gray-200 dark:bg-gray-700 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black",
      role: "switch",
      "aria-checked": "false",
      onClick: i[0] || (i[0] = (r) => a())
    }, [
      s("span", {
        class: b(`${n.value ? "translate-x-0" : "translate-x-5"} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white dark:bg-black shadow transform ring-0 transition ease-in-out duration-200`)
      }, [
        s("span", {
          class: b(`${n.value ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`),
          "aria-hidden": "true"
        }, [...i[1] || (i[1] = [
          s("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: "h-4 w-4 text-gray-400",
            preserveAspectRatio: "xMidYMid meet",
            viewBox: "0 0 32 32"
          }, [
            s("path", {
              fill: "currentColor",
              d: "M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3Z"
            })
          ], -1)
        ])], 2),
        s("span", {
          class: b(`${n.value ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`),
          "aria-hidden": "true"
        }, [...i[2] || (i[2] = [
          s("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: "h-4 w-4 text-indigo-600",
            preserveAspectRatio: "xMidYMid meet",
            viewBox: "0 0 32 32"
          }, [
            s("path", {
              fill: "currentColor",
              d: "M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6ZM5.394 6.813L6.81 5.399l3.505 3.506L8.9 10.319zM2 15.005h5v2H2zm3.394 10.193L8.9 21.692l1.414 1.414l-3.505 3.506zM15 25.005h2v5h-2zm6.687-1.9l1.414-1.414l3.506 3.506l-1.414 1.414zm3.313-8.1h5v2h-5zm-3.313-6.101l3.506-3.506l1.414 1.414l-3.506 3.506zM15 2.005h2v5h-2z"
            })
          ], -1)
        ])], 2)
      ], 2)
    ]));
  }
}), Cv = { key: 0 }, Sv = {
  key: 1,
  class: "min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8"
}, Lv = { class: "sm:mx-auto sm:w-full sm:max-w-md" }, Vv = { class: "mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50" }, Mv = {
  key: 0,
  class: "mt-4 text-center text-sm text-gray-600 dark:text-gray-300"
}, Av = { class: "relative z-0 inline-flex shadow-sm rounded-md" }, Tv = ["onClick"], jv = { class: "mt-8 sm:mx-auto sm:w-full sm:max-w-md" }, Ov = { class: "bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10" }, Fv = { class: "mt-8" }, Iv = {
  key: 1,
  class: "mt-6"
}, Pv = { class: "mt-6 grid grid-cols-3 gap-3" }, Bv = ["href", "title"], Ev = {
  key: 1,
  class: "h-5 w-5 text-gray-700 dark:text-gray-200",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, Dv = /* @__PURE__ */ ge({
  __name: "SignIn",
  props: {
    provider: {},
    title: { default: "Sign In" },
    tabs: { type: [Boolean, String], default: !0 },
    oauth: { type: [Boolean, String], default: !0 }
  },
  emits: ["login"],
  setup(e, { emit: t }) {
    const l = e, n = t, { getMetadata: a, createDto: d } = gt(), i = Il(), r = Pe("client"), { signIn: c } = cl(), v = a({ assert: !0 }), m = v.plugins.auth, h = document.baseURI, y = v.app.baseUrl, g = M(d("Authenticate")), p = M(new tt()), x = M(l.provider);
    ze(() => {
      m?.authProviders.map((P) => P.formLayout).filter((P) => P).forEach((P) => P.forEach(
        (z) => g.value[z.id] = z.type === "checkbox" ? !1 : ""
      ));
    });
    const w = f(() => m?.authProviders.filter((P) => P.formLayout) || []), C = f(() => w.value[0] || {}), F = f(() => w.value[Math.max(w.value.length - 1, 0)] || {}), B = f(() => (x.value ? m?.authProviders.find((P) => P.name === x.value) : null) ?? C.value), E = (P) => P === !1 || P === "false";
    function _(P) {
      return P.label || P.navItem && P.navItem.label;
    }
    const X = f(() => (B.value?.formLayout || []).map((P) => Object.assign({}, P, {
      type: P.type?.toLowerCase(),
      autocomplete: P.autocomplete || (P.type?.toLowerCase() === "password" ? "current-password" : void 0) || (P.id.toLowerCase() === "username" ? "username" : void 0),
      css: Object.assign({ field: "col-span-12" }, P.css)
    }))), I = f(() => E(l.oauth) ? [] : m?.authProviders.filter((P) => P.type === "oauth") || []), O = f(() => {
      let P = rr(
        m?.authProviders.filter((K) => K.formLayout && K.formLayout.length > 0),
        (K, T) => {
          let Z = _(T) || pt(T.name);
          K[Z] = T.name === C.value.name ? "" : T.name;
        }
      );
      const z = B.value;
      return z && E(l.tabs) && (P = { [_(z) || pt(z.name)]: z }), P;
    }), ie = f(() => {
      let P = X.value.map((z) => z.id).filter((z) => z);
      return p.value.summaryMessage(P);
    });
    async function se() {
      if (g.value.provider = B.value.name, B.value.name === "authsecret" ? (r.headers.set("authsecret", g.value.authsecret), g.value = d("Authenticate")) : B.value.name === "basic" ? (r.setCredentials(g.value.UserName, g.value.Password), g.value = d("Authenticate"), g.value.UserName = null, g.value.Password = null) : (B.value.type === "Bearer" || B.value.name === "jwt") && (r.bearerToken = g.value.BearerToken, g.value = d("Authenticate")), p.value = await i.api(g.value), p.value.succeeded) {
        const P = p.value.response;
        c(P), n("login", P), p.value = new tt(), g.value = d("Authenticate");
      }
    }
    return (P, z) => {
      const K = N("ErrorSummary"), T = N("AutoFormFields"), Z = N("PrimaryButton"), A = N("Icon"), S = Uo("href");
      return ne(m) ? (o(), u("div", Sv, [
        s("div", Lv, [
          s("h2", Vv, L(e.title), 1),
          Object.keys(O.value).length > 1 ? (o(), u("p", Mv, [
            s("span", Av, [
              (o(!0), u(he, null, be(O.value, (j, fe) => Ot((o(), u("a", {
                onClick: (V) => x.value = j,
                class: b([
                  j === "" || j === F.value.name ? "rounded-l-md" : j === F.value.name ? "rounded-r-md -ml-px" : "-ml-px",
                  x.value === j ? "z-10 outline-none ring-1 ring-indigo-500 border-indigo-500" : "",
                  "cursor-pointer relative inline-flex items-center px-4 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                ])
              }, [
                pe(L(fe), 1)
              ], 10, Tv)), [
                [S, { provider: j }]
              ])), 256))
            ])
          ])) : k("", !0)
        ]),
        s("div", jv, [
          ie.value ? (o(), W(K, {
            key: 0,
            class: "mb-3",
            errorSummary: ie.value
          }, null, 8, ["errorSummary"])) : k("", !0),
          s("div", Ov, [
            X.value.length ? (o(), u("form", {
              key: 0,
              onSubmit: Ee(se, ["prevent"])
            }, [
              ve(T, {
                modelValue: g.value,
                formLayout: X.value,
                api: p.value,
                hideSummary: !0,
                "divide-class": "",
                "space-class": "space-y-6"
              }, null, 8, ["modelValue", "formLayout", "api"]),
              s("div", Fv, [
                ve(Z, { class: "w-full" }, {
                  default: we(() => [...z[0] || (z[0] = [
                    pe("Sign In", -1)
                  ])]),
                  _: 1
                })
              ])
            ], 32)) : k("", !0),
            I.value.length ? (o(), u("div", Iv, [
              z[2] || (z[2] = nn('<div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300 dark:border-gray-600"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500 dark:text-gray-400"> Or continue with </span></div></div>', 1)),
              s("div", Pv, [
                (o(!0), u(he, null, be(I.value, (j) => (o(), u("div", null, [
                  s("a", {
                    href: ne(y) + j.navItem.href + "?continue=" + ne(h),
                    title: _(j),
                    class: "w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-black text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }, [
                    j.icon ? (o(), W(A, {
                      key: 0,
                      image: j.icon,
                      class: "h-5 w-5 text-gray-700 dark:text-gray-200"
                    }, null, 8, ["image"])) : (o(), u("svg", Ev, [...z[1] || (z[1] = [
                      s("path", {
                        d: "M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5z",
                        fill: "currentColor"
                      }, null, -1),
                      s("path", {
                        d: "M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0z",
                        fill: "currentColor"
                      }, null, -1)
                    ])]))
                  ], 8, Bv)
                ]))), 256))
              ])
            ])) : k("", !0)
          ])
        ])
      ])) : (o(), u("div", Cv, "No Auth Plugin"));
    };
  }
}), Nv = ["for"], Rv = {
  key: 1,
  class: "border border-gray-200 flex justify-between shadow-sm"
}, Hv = { class: "p-2 flex flex-wrap gap-x-4" }, qv = {
  key: 0,
  class: "p-2 flex flex-wrap gap-x-4"
}, zv = ["href"], Uv = { class: "" }, Kv = ["name", "id", "label", "value", "rows", "disabled"], Qv = ["id"], Jv = ["id"], at = "w-5 h-5 cursor-pointer select-none text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400", Gv = /* @__PURE__ */ ge({
  __name: "MarkdownInput",
  props: {
    status: {},
    id: {},
    inputClass: {},
    filterClass: {},
    label: {},
    labelClass: {},
    help: {},
    placeholder: {},
    modelValue: {},
    counter: { type: Boolean },
    rows: {},
    errorMessages: {},
    lang: {},
    autoFocus: { type: Boolean },
    disabled: { type: Boolean },
    helpUrl: { default: "https://guides.github.com/features/mastering-markdown/" },
    hide: {}
  },
  emits: ["update:modelValue", "close"],
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l;
    let d = [], i = [], r = Pe("ApiState", void 0);
    const c = f(() => $t.call({ responseStatus: n.status ?? r?.error.value }, n.id)), v = f(() => n.label ?? je(pt(n.id))), m = "bold,italics,link,image,blockquote,code,heading,orderedList,unorderedList,strikethrough,undo,redo,help".split(","), h = f(() => n.hide ? zt(m, n.hide) : zt(m, []));
    function y(V) {
      return h.value[V];
    }
    const g = f(() => Pt([
      "shadow-sm font-mono" + vt.base.replace("rounded-md", ""),
      c.value ? "text-red-900 focus:ring-red-500 focus:border-red-500 border-red-300" : "text-gray-900 " + vt.valid,
      n.inputClass
    ], "MarkdownInput", n.filterClass)), p = M();
    t({ props: n, textarea: p, updateModelValue: x, selection: C, hasSelection: w, selectionInfo: F, insert: E, replace: B });
    function x(V) {
      a("update:modelValue", V);
    }
    function w() {
      return p.value.selectionStart !== p.value.selectionEnd;
    }
    function C() {
      const V = p.value;
      return V.value.substring(V.selectionStart, V.selectionEnd) || "";
    }
    function F() {
      const V = p.value, $ = V.value, te = V.selectionStart, ae = $.substring(te, V.selectionEnd) || "", U = $.substring(0, te), Q = U.lastIndexOf(`
`);
      return {
        value: $,
        sel: ae,
        selPos: te,
        beforeSel: U,
        afterSel: $.substring(te),
        prevCRPos: Q,
        beforeCR: Q >= 0 ? U.substring(0, Q + 1) : "",
        afterCR: Q >= 0 ? U.substring(Q + 1) : ""
      };
    }
    function B({ value: V, selectionStart: $, selectionEnd: te }) {
      te == null && (te = $), x(V), jt(() => {
        p.value.focus(), p.value.setSelectionRange($, te);
      });
    }
    function E(V, $, te = "", { selectionAtEnd: ae, offsetStart: U, offsetEnd: Q, filterValue: R, filterSelection: ce } = {}) {
      const ue = p.value;
      let D = ue.value, J = ue.selectionEnd;
      d.push({ value: D, selectionStart: ue.selectionStart, selectionEnd: ue.selectionEnd }), i = [];
      const oe = ue.selectionStart, re = ue.selectionEnd;
      let de = D.substring(0, oe), Te = D.substring(re);
      const Ne = V && de.endsWith(V) && Te.startsWith($);
      if (oe == re) {
        if (Ne ? (D = de.substring(0, de.length - V.length) + Te.substring($.length), J += -$.length) : (D = de + V + te + $ + Te, J += V.length, U = 0, Q = te?.length || 0, ae && (J += Q, Q = 0)), R) {
          var Le = { pos: J };
          D = R(D, Le), J = Le.pos;
        }
      } else {
        var Me = D.substring(oe, re);
        ce && (Me = ce(Me)), Ne ? (D = de.substring(0, de.length - V.length) + Me + Te.substring($.length), U = -Me.length - V.length, Q = Me.length) : (D = de + V + Me + $ + Te, U ? J += (V + $).length : (J = oe, U = V.length, Q = Me.length));
      }
      x(D), jt(() => {
        ue.focus(), U = J + (U || 0), Q = (U || 0) + (Q || 0), ue.setSelectionRange(U, Q);
      });
    }
    const _ = () => E("**", "**", "bold"), X = () => E("_", "_", "italics"), I = () => E("~~", "~~", "strikethrough"), O = () => E("[", "](https://)", "", { offsetStart: -9, offsetEnd: 8 }), ie = () => E(`
> `, `
`, "Blockquote", {}), se = () => E("![](", ")");
    function P(V) {
      const $ = C();
      if ($ && !V.shiftKey)
        E("`", "`", "code");
      else {
        const te = n.lang || "js";
        $.indexOf(`
`) === -1 ? E("\n```" + te + `
`, "\n```\n", "// code") : E("```" + te + `
`, "```\n", "");
      }
    }
    function z() {
      if (w()) {
        let { sel: V, selPos: $, beforeSel: te, afterSel: ae, prevCRPos: U, beforeCR: Q, afterCR: R } = F();
        if (V.indexOf(`
`) === -1)
          E(`
 1. `, `
`);
        else if (!V.startsWith(" 1. ")) {
          let D = 1;
          E("", "", " - ", {
            selectionAtEnd: !0,
            filterSelection: (J) => " 1. " + J.replace(/\n$/, "").replace(/\n/g, (oe) => `
 ${++D}. `) + `
`
          });
        } else
          E("", "", "", {
            filterValue: (D, J) => {
              if (U >= 0) {
                let oe = R.replace(/^ - /, "");
                te = Q + oe, J.pos -= R.length - oe.length;
              }
              return te + ae;
            },
            filterSelection: (D) => D.replace(/^ 1. /g, "").replace(/\n \d+. /g, `
`)
          });
      } else
        E(`
 1. `, `
`, "List Item", { offsetStart: -10, offsetEnd: 9 });
    }
    function K() {
      if (w()) {
        let { sel: V, selPos: $, beforeSel: te, afterSel: ae, prevCRPos: U, beforeCR: Q, afterCR: R } = F();
        V.indexOf(`
`) === -1 ? E(`
 - `, `
`) : !V.startsWith(" - ") ? E("", "", " - ", {
          selectionAtEnd: !0,
          filterSelection: (D) => " - " + D.replace(/\n$/, "").replace(/\n/g, `
 - `) + `
`
        }) : E("", "", "", {
          filterValue: (D, J) => {
            if (U >= 0) {
              let oe = R.replace(/^ - /, "");
              te = Q + oe, J.pos -= R.length - oe.length;
            }
            return te + ae;
          },
          filterSelection: (D) => D.replace(/^ - /g, "").replace(/\n - /g, `
`)
        });
      } else
        E(`
 - `, `
`, "List Item", { offsetStart: -10, offsetEnd: 9 });
    }
    function T() {
      const V = C(), $ = V.indexOf(`
`) === -1;
      V ? $ ? E(`
## `, `
`, "") : E("## ", "", "") : E(`
## `, `
`, "Heading", { offsetStart: -8, offsetEnd: 7 });
    }
    function Z() {
      let { sel: V, selPos: $, beforeSel: te, afterSel: ae, prevCRPos: U, beforeCR: Q, afterCR: R } = F();
      !V.startsWith("//") && !R.startsWith("//") ? V ? E("", "", "//", {
        selectionAtEnd: !0,
        filterSelection: (ue) => "//" + ue.replace(/\n$/, "").replace(/\n/g, `
//`) + `
`
      }) : B({
        value: Q + "//" + R + ae,
        selectionStart: $ + 2
      }) : E("", "", "", {
        filterValue: (ue, D) => {
          if (U >= 0) {
            let J = R.replace(/^\/\//, "");
            te = Q + J, D.pos -= R.length - J.length;
          }
          return te + ae;
        },
        filterSelection: (ue) => ue.replace(/^\/\//g, "").replace(/\n\/\//g, `
`)
      });
    }
    const A = () => E(`/*
`, `*/
`, "");
    function S() {
      if (d.length === 0) return !1;
      const V = p.value, $ = d.pop();
      return i.push({ value: V.value, selectionStart: V.selectionStart, selectionEnd: V.selectionEnd }), B($), !0;
    }
    function j() {
      if (i.length === 0) return !1;
      const V = p.value, $ = i.pop();
      return d.push({ value: V.value, selectionStart: V.selectionStart, selectionEnd: V.selectionEnd }), B($), !0;
    }
    const fe = () => null;
    return ze(() => {
      d = [], i = [];
      const V = p.value;
      V.onkeydown = ($) => {
        if ($.key === "Escape" || $.keyCode === 27) {
          a("close");
          return;
        }
        const te = String.fromCharCode($.keyCode).toLowerCase();
        te === "	" ? (!$.shiftKey ? E("", "", "    ", {
          selectionAtEnd: !0,
          filterSelection: (U) => "    " + U.replace(/\n$/, "").replace(/\n/g, `
    `) + `
`
        }) : E("", "", "", {
          filterValue: (U, Q) => {
            let { selPos: R, beforeSel: ce, afterSel: ue, prevCRPos: D, beforeCR: J, afterCR: oe } = F();
            if (D >= 0) {
              let re = oe.replace(/\t/g, "    ").replace(/^ ? ? ? ?/, "");
              ce = J + re, Q.pos -= oe.length - re.length;
            }
            return ce + ue;
          },
          filterSelection: (U) => U.replace(/\t/g, "    ").replace(/^ ? ? ? ?/g, "").replace(/\n    /g, `
`)
        }), $.preventDefault()) : $.ctrlKey ? te === "z" ? $.shiftKey ? j() && $.preventDefault() : S() && $.preventDefault() : te === "b" && !$.shiftKey ? (_(), $.preventDefault()) : te === "h" && !$.shiftKey ? (T(), $.preventDefault()) : te === "i" && !$.shiftKey ? (X(), $.preventDefault()) : te === "q" && !$.shiftKey ? (ie(), $.preventDefault()) : te === "k" ? $.shiftKey ? (se(), $.preventDefault()) : (O(), $.preventDefault()) : te === "," || $.key === "<" || $.key === ">" || $.keyCode === 188 ? (P($), $.preventDefault()) : te === "/" || $.key === "/" ? (Z(), $.preventDefault()) : (te === "?" || $.key === "?") && $.shiftKey && (A(), $.preventDefault()) : $.altKey && ($.key === "1" || $.key === "0" ? (z(), $.preventDefault()) : $.key === "-" ? (K(), $.preventDefault()) : $.key === "s" && (I(), $.preventDefault()));
      };
    }), (V, $) => (o(), u("div", null, [
      G(V.$slots, "header", Se({
        inputElement: p.value,
        id: e.id,
        modelValue: e.modelValue,
        status: e.status
      }, V.$attrs)),
      v.value ? (o(), u("label", {
        key: 0,
        for: e.id,
        class: b(`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${e.labelClass ?? ""}`)
      }, L(v.value), 11, Nv)) : k("", !0),
      e.disabled ? k("", !0) : (o(), u("div", Rv, [
        s("div", Hv, [
          y("bold") ? (o(), u("svg", {
            key: 0,
            class: b(at),
            onClick: _,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[1] || ($[1] = [
            s("title", null, "Bold text (CTRL+B)", -1),
            s("path", {
              fill: "currentColor",
              d: "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79c0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79c0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
            }, null, -1)
          ])])) : k("", !0),
          y("italics") ? (o(), u("svg", {
            key: 1,
            class: b(at),
            onClick: X,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[2] || ($[2] = [
            s("title", null, "Italics (CTRL+I)", -1),
            s("path", {
              fill: "currentColor",
              d: "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"
            }, null, -1)
          ])])) : k("", !0),
          y("link") ? (o(), u("svg", {
            key: 2,
            class: b(at),
            onClick: O,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[3] || ($[3] = [
            s("title", null, "Insert Link (CTRL+K)", -1),
            s("path", {
              fill: "currentColor",
              d: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5a5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8v2m9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1c0 1.71-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5a5 5 0 0 0-5-5Z"
            }, null, -1)
          ])])) : k("", !0),
          y("blockquote") ? (o(), u("svg", {
            key: 3,
            class: b(at),
            onClick: ie,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[4] || ($[4] = [
            s("title", null, "Blockquote (CTRL+Q)", -1),
            s("path", {
              fill: "currentColor",
              d: "m15 17l2-4h-4V6h7v7l-2 4h-3Zm-9 0l2-4H4V6h7v7l-2 4H6Z"
            }, null, -1)
          ])])) : k("", !0),
          y("image") ? (o(), u("svg", {
            key: 4,
            class: b(at),
            onClick: se,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[5] || ($[5] = [
            s("title", null, "Insert Image (CTRL+SHIFT+L)", -1),
            s("path", {
              fill: "currentColor",
              d: "M2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992ZM20 15V5H4v14L14 9l6 6Zm0 2.828l-6-6L6.828 19H20v-1.172ZM8 11a2 2 0 1 1 0-4a2 2 0 0 1 0 4Z"
            }, null, -1)
          ])])) : k("", !0),
          y("code") ? (o(), u("svg", {
            key: 5,
            class: b(at),
            onClick: P,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[6] || ($[6] = [
            s("title", null, "Insert Code (CTRL+<)", -1),
            s("path", {
              fill: "currentColor",
              d: "m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6L8 18Zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6l-6 6Z"
            }, null, -1)
          ])])) : k("", !0),
          y("heading") ? (o(), u("svg", {
            key: 6,
            class: b(at),
            onClick: T,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[7] || ($[7] = [
            s("title", null, "H2 Heading (CTRL+H)", -1),
            s("path", {
              fill: "currentColor",
              d: "M7 20V7H2V4h13v3h-5v13H7Zm9 0v-8h-3V9h9v3h-3v8h-3Z"
            }, null, -1)
          ])])) : k("", !0),
          y("orderedList") ? (o(), u("svg", {
            key: 7,
            class: b(at),
            icon: "",
            onClick: z,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[8] || ($[8] = [
            s("title", null, "Numbered List (ALT+1)", -1),
            s("path", {
              fill: "currentColor",
              d: "M3 22v-1.5h2.5v-.75H4v-1.5h1.5v-.75H3V16h3q.425 0 .713.288T7 17v1q0 .425-.288.713T6 19q.425 0 .713.288T7 20v1q0 .425-.288.713T6 22H3Zm0-7v-2.75q0-.425.288-.713T4 11.25h1.5v-.75H3V9h3q.425 0 .713.288T7 10v1.75q0 .425-.288.713T6 12.75H4.5v.75H7V15H3Zm1.5-7V3.5H3V2h3v6H4.5ZM9 19v-2h12v2H9Zm0-6v-2h12v2H9Zm0-6V5h12v2H9Z"
            }, null, -1)
          ])])) : k("", !0),
          y("unorderedList") ? (o(), u("svg", {
            key: 8,
            class: b(at),
            onClick: K,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[9] || ($[9] = [
            s("title", null, "Bulleted List (ALT+-)", -1),
            s("path", {
              fill: "currentColor",
              d: "M9 19v-2h12v2H9Zm0-6v-2h12v2H9Zm0-6V5h12v2H9ZM5 20q-.825 0-1.413-.588T3 18q0-.825.588-1.413T5 16q.825 0 1.413.588T7 18q0 .825-.588 1.413T5 20Zm0-6q-.825 0-1.413-.588T3 12q0-.825.588-1.413T5 10q.825 0 1.413.588T7 12q0 .825-.588 1.413T5 14Zm0-6q-.825 0-1.413-.588T3 6q0-.825.588-1.413T5 4q.825 0 1.413.588T7 6q0 .825-.588 1.413T5 8Z"
            }, null, -1)
          ])])) : k("", !0),
          y("strikethrough") ? (o(), u("svg", {
            key: 9,
            class: b(at),
            onClick: I,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[10] || ($[10] = [
            s("title", null, "Strike Through (ALT+S)", -1),
            s("path", {
              fill: "currentColor",
              d: "M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"
            }, null, -1)
          ])])) : k("", !0),
          y("undo") ? (o(), u("svg", {
            key: 10,
            class: b(at),
            onClick: S,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[11] || ($[11] = [
            s("title", null, "Undo (CTRL+Z)", -1),
            s("path", {
              fill: "currentColor",
              d: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
            }, null, -1)
          ])])) : k("", !0),
          y("redo") ? (o(), u("svg", {
            key: 11,
            class: b(at),
            onClick: j,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }, [...$[12] || ($[12] = [
            s("title", null, "Redo (CTRL+SHIFT+Z)", -1),
            s("path", {
              fill: "currentColor",
              d: "M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8.002 8.002 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
            }, null, -1)
          ])])) : k("", !0),
          G(V.$slots, "toolbarbuttons", {
            instance: Fe()?.exposed
          })
        ]),
        y("help") && e.helpUrl ? (o(), u("div", qv, [
          s("a", {
            title: "formatting help",
            target: "_blank",
            href: e.helpUrl,
            tabindex: "-1"
          }, [
            (o(), u("svg", {
              class: b(at),
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24"
            }, [...$[13] || ($[13] = [
              s("path", {
                fill: "currentColor",
                d: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5c0-2.21-1.79-4-4-4z"
              }, null, -1)
            ])]))
          ], 8, zv)
        ])) : k("", !0)
      ])),
      s("div", Uv, [
        s("textarea", {
          ref_key: "txt",
          ref: p,
          name: e.id,
          id: e.id,
          class: b(g.value),
          label: e.label,
          value: e.modelValue,
          rows: e.rows || 6,
          disabled: e.disabled,
          onInput: $[0] || ($[0] = (te) => x(te.target?.value || "")),
          onKeydown: sn(fe, ["tab"])
        }, null, 42, Kv)
      ]),
      c.value ? (o(), u("p", {
        key: 2,
        class: "mt-2 text-sm text-red-500",
        id: `${e.id}-error`
      }, L(c.value), 9, Qv)) : e.help ? (o(), u("p", {
        key: 3,
        class: "mt-2 text-sm text-gray-500",
        id: `${e.id}-description`
      }, L(e.help), 9, Jv)) : k("", !0),
      G(V.$slots, "footer", Se({
        inputElement: p.value,
        id: e.id,
        modelValue: e.modelValue,
        status: e.status
      }, V.$attrs))
    ]));
  }
}), Wv = {
  key: 0,
  class: "relative z-10 lg:hidden",
  role: "dialog",
  "aria-modal": "true"
}, Zv = { class: "fixed inset-0 flex" }, Xv = { class: "flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-black px-6 pb-2" }, Yv = { class: "hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col" }, _v = { class: "flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-6" }, ep = {
  class: /* @__PURE__ */ b(["sticky top-0 flex items-center gap-x-6 bg-white dark:bg-black px-4 py-4 shadow-sm sm:px-6 lg:hidden"])
}, tp = /* @__PURE__ */ ge({
  __name: "SidebarLayout",
  setup(e, { expose: t }) {
    const { transition: l } = no(), n = M(!0), a = M(""), d = {
      entering: { cls: "transition-opacity ease-linear duration-300", from: "opacity-0", to: "opacity-100" },
      leaving: { cls: "transition-opacity ease-linear duration-300", from: "opacity-100", to: "opacity-0" }
    }, i = M(""), r = {
      entering: { cls: "transition ease-in-out duration-300 transform", from: "-translate-x-full", to: "translate-x-0" },
      leaving: { cls: "transition ease-in-out duration-300 transform", from: "translate-x-0", to: "-translate-x-full" }
    }, c = M(""), v = {
      entering: { cls: "ease-in-out duration-300", from: "opacity-0", to: "opacity-100" },
      leaving: { cls: "ease-in-out duration-300", from: "opacity-100", to: "opacity-0" }
    };
    function m(g) {
      l(d, a, g), l(r, i, g), l(v, c, g), setTimeout(() => n.value = g, 300);
    }
    function h() {
      m(!0);
    }
    function y() {
      m(!1);
    }
    return t({ show: h, hide: y, toggle: m }), (g, p) => (o(), u("div", null, [
      n.value ? (o(), u("div", Wv, [
        s("div", {
          class: b(["fixed inset-0 bg-gray-900/80", a.value])
        }, null, 2),
        s("div", Zv, [
          s("div", {
            class: b(["relative mr-16 flex w-full max-w-xs flex-1", i.value])
          }, [
            s("div", {
              class: b(["absolute left-full top-0 flex w-16 justify-center pt-5", c.value])
            }, [
              s("button", {
                type: "button",
                onClick: y,
                class: "-m-2.5 p-2.5"
              }, [...p[0] || (p[0] = [
                s("span", { class: "sr-only" }, "Close sidebar", -1),
                s("svg", {
                  class: "h-6 w-6 text-white dark:text-black",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  "aria-hidden": "true"
                }, [
                  s("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M6 18L18 6M6 6l12 12"
                  })
                ], -1)
              ])])
            ], 2),
            s("div", Xv, [
              G(g.$slots, "default")
            ])
          ], 2)
        ])
      ])) : k("", !0),
      s("div", Yv, [
        s("div", _v, [
          G(g.$slots, "default")
        ])
      ]),
      s("div", ep, [
        s("button", {
          type: "button",
          onClick: h,
          class: "-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
        }, [...p[1] || (p[1] = [
          s("span", { class: "sr-only" }, "Open sidebar", -1),
          s("svg", {
            class: "h-6 w-6",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            "aria-hidden": "true"
          }, [
            s("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            })
          ], -1)
        ])]),
        G(g.$slots, "mobiletitlebar")
      ])
    ]));
  }
}), lp = { class: "bg-white dark:bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, np = { class: "mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left" }, sp = { class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" }, ap = { class: "pb-4" }, op = { class: "space-y-6 pt-6 pb-5" }, mo = /* @__PURE__ */ ge({
  __name: "ApiKeyDialog",
  props: {
    title: {},
    client: {}
  },
  emits: ["done", "save"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = Pe("store", null), d = l.client ?? Pe("client", null), i = Za(), r = M(a?.apikey ?? i.value ?? d?.bearerToken ?? "");
    function c() {
      a && (a.apikey = r.value), d && (d.bearerToken = r.value), i.value = r.value, n("save", r.value), n("done");
    }
    return (v, m) => (o(), W(fo, {
      "size-class": "w-96",
      onDone: m[1] || (m[1] = (h) => v.$emit("done"))
    }, {
      default: we(() => [
        s("div", lp, [
          s("div", np, [
            s("h3", sp, L(e.title ?? "API Key"), 1),
            s("div", ap, [
              s("form", {
                onSubmit: Ee(c, ["prevent"])
              }, [
                s("div", op, [
                  ve(co, {
                    id: "apikey",
                    type: "password",
                    autocomplete: "new-password",
                    modelValue: r.value,
                    "onUpdate:modelValue": m[0] || (m[0] = (h) => r.value = h),
                    label: ""
                  }, null, 8, ["modelValue"])
                ]),
                s("div", null, [
                  ve(ys, { class: "w-full" }, {
                    default: we(() => [...m[2] || (m[2] = [
                      pe("Save", -1)
                    ])]),
                    _: 1
                  })
                ])
              ], 32)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), ks = (e) => e?.viewModel ?? e?.model ?? null, Vt = ia({ models: {}, apis: {} }), Hl = /* @__PURE__ */ new Map();
function ql(e, t, l) {
  return t ? t in e ? Promise.resolve(e[t]) : (Hl.has(l) || Hl.set(l, fetch(l, { headers: { Accept: "application/json" } }).then((n) => n.ok ? n.json() : null).catch(() => null).then((n) => (e[t] = n, Hl.delete(l), n))), Hl.get(l)) : Promise.resolve(null);
}
function vo() {
  return {
    /** the Model's schema, or undefined while it loads - starts the fetch on first ask */
    model(e) {
      return e && !(e in Vt.models) && ql(Vt.models, e, `/auto/${e}.json`), e ? Vt.models[e] : null;
    },
    /** the API's schema, or undefined while it loads */
    api(e) {
      return e && !(e in Vt.apis) && ql(Vt.apis, e, `/schema/${e}.json`), e ? Vt.apis[e] : null;
    },
    loadModel: (e) => ql(Vt.models, e, `/auto/${e}.json`),
    loadApi: (e) => ql(Vt.apis, e, `/schema/${e}.json`)
  };
}
const { formatValue: rp, Formats: ip } = Ga(), up = {
  name: "SchemaGrid",
  props: {
    items: { type: Array, default: () => [] },
    /** the Model schema whose `properties` describe the columns */
    schema: { type: Object, default: null },
    selectedColumns: { type: Array, default: null },
    headerTitles: { type: Object, default: null },
    /** present (even returning false) to make rows selectable, as DataGrid does */
    isSelected: { type: Function, default: null }
  },
  emits: ["rowSelected", "headerSelected"],
  setup(e) {
    const t = vo(), { config: l } = Ct(), n = f(() => e.schema?.properties ?? {}), a = (p) => n.value[p], d = f(() => (e.selectedColumns ?? Object.keys(n.value)).filter((p) => a(p)?.ui?.format?.method !== "hidden"));
    function i(p) {
      const x = a(p), w = x?.ui?.ref;
      if (!w) return null;
      if (x.type === "object") return { name: p, ref: w };
      const C = p.endsWith("Id") ? p.slice(0, -2) : null, [F] = Object.entries(n.value).find(([B, E]) => E.type === "object" && (C && B.toLowerCase() === C.toLowerCase() || E.ui?.ref?.selfId?.toLowerCase() === p.toLowerCase())) ?? Object.entries(n.value).find(([, B]) => B.type === "object" && B.ui?.ref?.model === w.model) ?? [];
      return F ? { name: F, ref: w } : null;
    }
    function r(p) {
      if (p.refLabel) return p.refLabel;
      const x = ks(t.model(p.model))?.properties ?? {}, [w] = Object.entries(x).find(([C, F]) => F.type === "string" && C !== p.refId) ?? [];
      return w ?? null;
    }
    function c(p) {
      return p?.ui?.format ? p.ui.format : p?.format === "date-time" || p?.format === "date" ? ip.date : null;
    }
    function v(p) {
      const x = a(p)?.ui?.ref;
      return x ? x.icon ?? l.value.tableIcon : null;
    }
    function m(p, x) {
      const w = i(x);
      if (!w) return null;
      const C = me(p, w.name);
      if (!C || typeof C != "object") return null;
      const F = r(w.ref);
      return F ? me(C, F) ?? null : null;
    }
    function h(p, x) {
      return Array.isArray(x) && (p?.items?.type === "object" || x.some((w) => w && typeof w == "object"));
    }
    const y = (p) => p == null ? null : typeof p == "object" ? JSON.stringify(p, null, 2) : String(p);
    function g(p, x) {
      const w = a(x), C = me(p, x), F = m(p, x);
      if (F != null) return { text: F, icon: v(x), title: String(F) };
      if (h(w, C))
        return {
          text: `${C.length} item${C.length === 1 ? "" : "s"}`,
          title: y(C)
        };
      try {
        return { html: rp(C, c(w), { modelValue: p }), title: y(C) };
      } catch {
        return { html: "", title: null };
      }
    }
    return {
      visibleColumns: d,
      labelOf: (p) => e.headerTitles?.[p] ?? a(p)?.title ?? p,
      // built per row so each cell is resolved once, not once per binding that reads it
      cells: f(() => e.items.map((p) => d.value.map((x) => g(p, x)))),
      rowClass: (p) => (e.isSelected ? "cursor-pointer hover:bg-yellow-50 dark:hover:bg-blue-900 " : "") + (p % 2 === 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-gray-800")
    };
  }
}, wt = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, a] of t)
    l[n] = a;
  return l;
}, dp = { class: "overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" }, cp = { class: "overflow-x-auto" }, fp = { class: "w-full text-sm" }, mp = { class: "bg-gray-50 dark:bg-gray-800" }, vp = ["onClick"], pp = { class: "select-none" }, gp = { class: "divide-y divide-gray-200 dark:divide-gray-700" }, yp = ["onClick"], hp = ["title"], bp = {
  key: 1,
  class: "min-w-0 truncate"
}, wp = ["innerHTML"];
function kp(e, t, l, n, a, d) {
  const i = N("Icon");
  return o(), u("div", dp, [
    s("div", cp, [
      s("table", fp, [
        s("thead", mp, [
          s("tr", null, [
            (o(!0), u(he, null, be(e.visibleColumns, (r) => (o(), u("td", {
              key: r,
              class: "px-3 py-2 text-left font-semibold whitespace-nowrap text-gray-500 dark:text-gray-400",
              onClick: (c) => e.$emit("headerSelected", r, c)
            }, [
              G(e.$slots, "header", {
                column: r,
                label: e.labelOf(r)
              }, () => [
                s("span", pp, L(e.labelOf(r)), 1)
              ])
            ], 8, vp))), 128))
          ])
        ]),
        s("tbody", gp, [
          (o(!0), u(he, null, be(e.items, (r, c) => (o(), u("tr", {
            key: c,
            class: b(e.rowClass(c)),
            onClick: (v) => e.$emit("rowSelected", r, v)
          }, [
            (o(!0), u(he, null, be(e.cells[c], (v, m) => (o(), u("td", {
              key: m,
              class: "px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
            }, [
              s("div", {
                class: "max-w-[500px] flex items-center",
                title: v.title
              }, [
                v.icon ? (o(), W(i, {
                  key: 0,
                  class: "w-5 h-5 mr-1 shrink-0",
                  image: v.icon
                }, null, 8, ["image"])) : k("", !0),
                v.text != null ? (o(), u("span", bp, L(v.text), 1)) : (o(), u("span", {
                  key: 2,
                  class: "min-w-0 truncate",
                  innerHTML: v.html
                }, null, 8, wp))
              ], 8, hp)
            ]))), 128))
          ], 10, yp))), 128))
        ])
      ])
    ]),
    G(e.$slots, "empty")
  ]);
}
const po = /* @__PURE__ */ wt(up, [["render", kp]]), xs = (e, t) => e.replace(/\{(\w+)\}/g, (l, n) => encodeURIComponent(me(t, n) ?? "")), xp = { filters: {}, orderBy: "", skip: 0 }, $p = {
  name: "SchemaResults",
  components: { SchemaGrid: po },
  props: {
    /** an /auto/{Model}.json envelope - `name`, `model` and `query` are read */
    schema: { type: Object, required: !0 },
    /** `{ filters, orderBy, skip }`. Omit to keep the query state component-local */
    query: { type: Object, default: null },
    /** rows per page, until the user picks their own in Query Preferences */
    take: { type: Number, default: 25 },
    /** where preferences persist. Two views of one Model can keep their own columns */
    prefsKey: { type: String, default: null },
    /** the columns to offer, in order. Defaults to the Model's own property order */
    columnOrder: { type: Array, default: null },
    /** makes rows clickable, as DataGrid's isSelected does */
    selectable: { type: Boolean, default: !1 }
  },
  emits: ["update:query", "rowSelected", "loaded"],
  setup(e, { emit: t, expose: l }) {
    const { filterDefinitions: n } = gt(), a = M([]), d = M(0), i = M(null), r = M(null), c = M(!1), v = M({ ...xp }), m = f(() => e.query ?? v.value), h = f(() => m.value.filters ?? {}), y = f(() => String(m.value.orderBy ?? "")), g = f(() => Math.max(0, parseInt(m.value.skip) || 0));
    function p(D) {
      const J = { filters: {}, orderBy: "", skip: 0, ...D };
      v.value = J, t("update:query", J);
    }
    const x = f(() => ks(e.schema)), w = f(() => x.value?.properties || {}), C = (D) => {
      const J = w.value[D];
      return J ? { name: D, type: J.type, isEnum: !1 } : null;
    }, F = n;
    function B(D) {
      for (const J of Object.keys(w.value)) {
        const oe = F.value.find((re) => re.value.replace("%", J) === D);
        if (oe) return { column: J, op: oe.name };
      }
      return { column: D, op: "=" };
    }
    const E = f(() => Object.entries(h.value).map(([D, J]) => {
      const { column: oe, op: re } = B(D);
      return { key: D, value: J, op: re, label: w.value[oe]?.title || oe };
    })), _ = (D) => Object.keys(h.value).filter((J) => B(J).column === D).length, X = (D) => {
      const J = y.value.split(",").find((oe) => oe.replace(/^-/, "") === D);
      return J ? J.startsWith("-") ? "DESC" : "ASC" : null;
    }, I = (D) => !!C(D) && w.value[D]?.type !== "object" && w.value[D]?.type !== "array", O = (D) => Object.fromEntries(
      Object.entries(h.value).filter(([J]) => J !== D)
    ), ie = (D) => p({ filters: O(D), orderBy: y.value }), se = () => p({ orderBy: y.value });
    function P(D) {
      const J = [];
      for (const [oe, re] of Object.entries(h.value)) {
        const de = F.value.find((Te) => Te.value.replace("%", D) === oe);
        de && J.push({ key: de.value, name: de.name, value: String(re) });
      }
      return { filters: J, sort: X(D) ?? void 0 };
    }
    function z(D, J) {
      if (!I(D)) return;
      const oe = C(D), re = J.target?.closest("TABLE")?.getBoundingClientRect();
      if (!oe || !re) return;
      const de = 318;
      r.value = {
        column: { name: oe.name, type: oe.type, meta: oe, settings: P(oe.name) },
        topLeft: {
          x: Math.max(Math.floor(J.clientX + de / 2), re.x + de + 10),
          y: re.y + 45
        }
      };
    }
    function K(D) {
      const J = r.value?.column?.name;
      if (r.value = null, !J) return;
      const oe = { ...h.value };
      for (const de of F.value) delete oe[de.value.replace("%", J)];
      for (const de of D.filters) oe[de.key.replace("%", J)] = de.value;
      const re = y.value.split(",").filter((de) => de && de.replace(/^-/, "") !== J);
      D.sort && re.push((D.sort === "DESC" ? "-" : "") + J), p({ filters: oe, orderBy: re.join(",") });
    }
    const T = f(() => e.prefsKey || `auto:prefs:${e.schema?.name}`), Z = f(() => e.columnOrder ?? Object.keys(w.value)), A = f(() => Z.value.map((D) => ({ name: D }))), S = M(j());
    function j() {
      try {
        return JSON.parse(localStorage.getItem(T.value)) || {};
      } catch {
        return {};
      }
    }
    function fe(D) {
      S.value = D, localStorage.setItem(T.value, JSON.stringify(D)), c.value = !1, ue();
    }
    const V = f(() => S.value.take || e.take), $ = f(() => {
      const D = S.value.selectedColumns;
      return D?.length ? Z.value.filter((J) => D.includes(J)) : Z.value;
    }), te = f(() => Object.fromEntries(
      Object.entries(w.value).map(([D, J]) => [D, J.title || D])
    )), ae = f(() => g.value > 0), U = f(() => g.value + V.value < d.value), Q = f(() => Math.max(0, Math.floor((d.value - 1) / V.value) * V.value)), R = (D) => p({ filters: h.value, orderBy: y.value, skip: Math.max(0, D) }), ce = (D) => ["px-0.5", D ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" : "text-gray-400 dark:text-gray-500 cursor-not-allowed"];
    async function ue() {
      if (e.schema?.query) {
        i.value = null;
        try {
          const D = new URLSearchParams(h.value);
          y.value && D.set("orderBy", y.value), D.set("skip", g.value), D.set("take", V.value), D.has("include") || D.set("include", "total");
          const J = xs(e.schema.query.$id, h.value) + "?" + D, oe = await fetch(J, { headers: { Accept: "application/json" } }), re = oe.status !== 204 ? await oe.json() : {};
          if (!oe.ok) throw me(re, "responseStatus") || { message: `${oe.status} ${oe.statusText}` };
          a.value = me(re, "results") || [], d.value = me(re, "total") ?? g.value + a.value.length;
        } catch (D) {
          i.value = D, a.value = [], d.value = 0;
        }
        t("loaded", { results: a.value, total: d.value });
      }
    }
    return lt(() => JSON.stringify([h.value, y.value, g.value]), ue), lt(T, () => {
      S.value = j();
    }), ze(ue), l({ reload: ue }), {
      rowSchema: x,
      rows: a,
      total: d,
      skip: g,
      take: V,
      listError: i,
      showFilters: r,
      showPrefs: c,
      prefs: S,
      columns: $,
      allColumns: A,
      headerTitles: te,
      conventions: F,
      activeFilters: E,
      canFilter: I,
      filterCount: _,
      sortOf: X,
      from: f(() => d.value ? g.value + 1 : 0),
      to: f(() => Math.min(g.value + a.value.length, d.value)),
      isSelected: () => !1,
      onHeaderSelected: z,
      onFilterSave: K,
      onPrefsSave: fe,
      clearFilter: ie,
      clearFilters: se,
      canPrev: ae,
      canNext: U,
      lastPageSkip: Q,
      skipTo: R,
      pagingClass: ce
    };
  }
}, Cp = { class: "flex items-center gap-3 mb-3 min-h-9" }, Sp = {
  key: 0,
  class: "flex items-center"
}, Lp = ["disabled"], Vp = ["disabled"], Mp = ["disabled"], Ap = ["disabled"], Tp = {
  key: 1,
  class: "px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap"
}, jp = { key: 0 }, Op = { key: 1 }, Fp = {
  key: 2,
  class: "flex flex-wrap items-center gap-2"
}, Ip = ["onClick", "title"], Pp = { class: "mr-1 select-none" }, Bp = {
  key: 0,
  class: "size-3.5 text-indigo-600 dark:text-indigo-400",
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true"
}, Ep = {
  key: 1,
  class: "size-3.5 text-indigo-600 dark:text-indigo-400",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, Dp = {
  key: 2,
  class: "size-3.5 text-indigo-600 dark:text-indigo-400",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
}, Np = {
  key: 3,
  class: "size-3.5 text-gray-400 dark:text-gray-500",
  viewBox: "0 0 1024 1024",
  fill: "currentColor",
  "aria-hidden": "true"
}, Rp = {
  key: 1,
  class: "py-8 text-center text-xs text-gray-500 dark:text-gray-400"
};
function Hp(e, t, l, n, a, d) {
  const i = N("ErrorSummary"), r = N("SchemaGrid"), c = N("FilterColumn"), v = N("QueryPrefs");
  return o(), u("div", null, [
    s("div", Cp, [
      s("button", {
        type: "button",
        onClick: t[0] || (t[0] = (m) => e.showPrefs = !0),
        title: "Query Preferences",
        class: "rounded-md p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      }, [...t[9] || (t[9] = [
        s("span", { class: "sr-only" }, "Query Preferences", -1),
        s("svg", {
          class: "w-7 h-7",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          "stroke-width": "1.5"
        }, [
          s("path", {
            d: `M9 3H3.6a.6.6 0 0 0-.6.6v16.8a.6.6 0 0 0 .6.6H9M9 3v18M9 3h6M9 21h6m0-18h5.4a.6.6 0 0 1
                    .6.6v16.8a.6.6 0 0 1-.6.6H15m0-18v18`,
            stroke: "currentColor"
          })
        ], -1)
      ])]),
      e.schema.query ? (o(), u("div", Sp, [
        s("button", {
          type: "button",
          title: "First page",
          disabled: !e.canPrev,
          onClick: t[1] || (t[1] = (m) => e.skipTo(0)),
          class: b(e.pagingClass(e.canPrev))
        }, [...t[10] || (t[10] = [
          s("span", { class: "sr-only" }, "First page", -1),
          s("svg", {
            class: "w-7 h-7",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6l6 6zM6 6h2v12H6z",
              fill: "currentColor"
            })
          ], -1)
        ])], 10, Lp),
        s("button", {
          type: "button",
          title: "Previous page",
          disabled: !e.canPrev,
          onClick: t[2] || (t[2] = (m) => e.skipTo(e.skip - e.take)),
          class: b(e.pagingClass(e.canPrev))
        }, [...t[11] || (t[11] = [
          s("span", { class: "sr-only" }, "Previous page", -1),
          s("svg", {
            class: "w-7 h-7",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              d: "M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z",
              fill: "currentColor"
            })
          ], -1)
        ])], 10, Vp),
        s("button", {
          type: "button",
          title: "Next page",
          disabled: !e.canNext,
          onClick: t[3] || (t[3] = (m) => e.skipTo(e.skip + e.take)),
          class: b(e.pagingClass(e.canNext))
        }, [...t[12] || (t[12] = [
          s("span", { class: "sr-only" }, "Next page", -1),
          s("svg", {
            class: "w-7 h-7",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              d: "M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z",
              fill: "currentColor"
            })
          ], -1)
        ])], 10, Mp),
        s("button", {
          type: "button",
          title: "Last page",
          disabled: !e.canNext,
          onClick: t[4] || (t[4] = (m) => e.skipTo(e.lastPageSkip)),
          class: b(e.pagingClass(e.canNext))
        }, [...t[13] || (t[13] = [
          s("span", { class: "sr-only" }, "Last page", -1),
          s("svg", {
            class: "w-7 h-7",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6l-6-6zM16 6h2v12h-2z",
              fill: "currentColor"
            })
          ], -1)
        ])], 10, Ap)
      ])) : k("", !0),
      e.schema.query ? (o(), u("div", Tp, [
        e.total ? (o(), u("span", jp, [
          t[14] || (t[14] = s("span", { class: "hidden xl:inline" }, "Showing Results ", -1)),
          pe(L(e.from) + " - " + L(e.to) + " of " + L(e.total), 1)
        ])) : e.listError ? k("", !0) : (o(), u("span", Op, "No Results"))
      ])) : k("", !0),
      e.activeFilters.length ? (o(), u("div", Fp, [
        (o(!0), u(he, null, be(e.activeFilters, (m) => (o(), u("span", {
          key: m.key,
          class: "inline-flex items-center gap-1 rounded-full pl-2.5 pr-1 py-0.5 text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
        }, [
          pe(L(m.label) + " " + L(m.op) + " " + L(m.value) + " ", 1),
          s("button", {
            type: "button",
            onClick: (h) => e.clearFilter(m.key),
            title: "Remove " + m.label + " filter",
            class: "rounded-full p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800"
          }, [...t[15] || (t[15] = [
            s("span", { class: "sr-only" }, "Remove", -1),
            s("svg", {
              class: "w-3 h-3",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              viewBox: "0 0 24 24"
            }, [
              s("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                d: "M6 18 18 6M6 6l12 12"
              })
            ], -1)
          ])], 8, Ip)
        ]))), 128)),
        s("button", {
          type: "button",
          onClick: t[5] || (t[5] = (...m) => e.clearFilters && e.clearFilters(...m)),
          class: "text-xs text-gray-500 dark:text-gray-400 hover:underline"
        }, "Clear all")
      ])) : k("", !0),
      t[16] || (t[16] = s("span", { class: "flex-1" }, null, -1)),
      G(e.$slots, "toolbar")
    ]),
    e.listError ? (o(), W(i, {
      key: 0,
      status: e.listError,
      class: "mb-4"
    }, null, 8, ["status"])) : k("", !0),
    ve(r, {
      items: e.rows,
      schema: e.rowSchema,
      "selected-columns": e.columns,
      "header-titles": e.headerTitles,
      "is-selected": e.selectable ? e.isSelected : void 0,
      onRowSelected: t[6] || (t[6] = (m) => e.$emit("rowSelected", m)),
      onHeaderSelected: e.onHeaderSelected
    }, {
      header: we(({ column: m, label: h }) => [
        s("div", {
          class: b(["flex items-center justify-between gap-1", e.canFilter(m) ? "cursor-pointer hover:text-gray-900 dark:hover:text-gray-50" : ""])
        }, [
          s("span", Pp, L(h), 1),
          e.filterCount(m) ? (o(), u("svg", Bp, [...t[17] || (t[17] = [
            s("path", {
              d: `M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0
                        0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z`,
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])])) : e.sortOf(m) === "ASC" ? (o(), u("svg", Ep, [...t[18] || (t[18] = [
            s("path", { d: `M8.998 4.71L6.354 7.354a.5.5 0 1 1-.708-.707L9.115 3.18A.499.499 0 0 1 9.498 3H9.5a.5.5
                        0 0 1 .354.147l.01.01l3.49 3.49a.5.5 0 1 1-.707.707l-2.65-2.649V16.5a.5.5 0 0 1-1 0V4.71z` }, null, -1)
          ])])) : e.sortOf(m) === "DESC" ? (o(), u("svg", Dp, [...t[19] || (t[19] = [
            s("path", { d: `M10.002 15.29l2.645-2.644a.5.5 0 0 1 .707.707L9.886 16.82a.5.5 0 0 1-.384.179h-.001a.5.5
                        0 0 1-.354-.147l-.01-.01l-3.49-3.49a.5.5 0 1 1 .707-.707l2.648 2.649V3.5a.5.5 0 0 1 1 0v11.79z` }, null, -1)
          ])])) : e.canFilter(m) ? (o(), u("svg", Np, [...t[20] || (t[20] = [
            s("path", { d: `M505.5 658.7c3.2 4.4 9.7 4.4 12.9 0l178-246c3.8-5.3 0-12.7-6.5-12.7H643c-10.2 0-19.9
                        4.9-25.9 13.2L512 558.6L406.8 413.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246z` }, null, -1)
          ])])) : k("", !0)
        ], 2)
      ]),
      _: 1
    }, 8, ["items", "schema", "selected-columns", "header-titles", "is-selected", "onHeaderSelected"]),
    !e.rows.length && !e.listError ? (o(), u("div", Rp, " No results ")) : k("", !0),
    (o(), W(ua, { to: "body" }, [
      e.showFilters ? (o(), W(c, {
        key: 0,
        definitions: e.conventions,
        column: e.showFilters.column,
        "top-left": e.showFilters.topLeft,
        onDone: t[7] || (t[7] = (m) => e.showFilters = null),
        onSave: e.onFilterSave
      }, null, 8, ["definitions", "column", "top-left", "onSave"])) : k("", !0),
      e.showPrefs ? (o(), W(v, {
        key: 1,
        columns: e.allColumns,
        prefs: e.prefs,
        onDone: t[8] || (t[8] = (m) => e.showPrefs = !1),
        onSave: e.onPrefsSave
      }, null, 8, ["columns", "prefs", "onSave"])) : k("", !0)
    ]))
  ]);
}
const $s = /* @__PURE__ */ wt($p, [["render", Hp]]), go = /* @__PURE__ */ Symbol("JsonSchemaForm"), mt = (e) => e !== null && typeof e == "object" && !Array.isArray(e), qp = (e) => e.replace(/^#\//, "").split("/").map((t) => decodeURIComponent(t.replace(/~1/g, "/").replace(/~0/g, "~")));
function yo(e, t, l) {
  if (!e?.$ref) return e;
  if (l.has(e.$ref)) return { ...e, $recursive: !0, $ref: void 0 };
  l.add(e.$ref);
  let n = t;
  for (const i of qp(e.$ref)) n = n?.[i];
  if (!n) return e;
  const { $ref: a, ...d } = e;
  return yo({ ...n, ...d }, t, l);
}
function zp(e, t) {
  if (!e?.allOf?.length) return e;
  const { allOf: l, ...n } = e;
  return l.reduce((a, d) => {
    const i = Qe(d, t);
    return {
      ...a,
      ...i,
      properties: { ...a.properties ?? {}, ...i.properties ?? {} },
      required: [.../* @__PURE__ */ new Set([...a.required ?? [], ...i.required ?? []])]
    };
  }, n);
}
const Ks = /* @__PURE__ */ new WeakMap();
function Qe(e, t) {
  if (!e || typeof e != "object") return {};
  const l = t ?? e;
  let n = Ks.get(l);
  if (n || Ks.set(l, n = /* @__PURE__ */ new WeakMap()), n.has(e)) return n.get(e);
  let a = zp(yo(e, l, /* @__PURE__ */ new Set()), l);
  return a.nullable && !Array.isArray(a.type) && a.type && (a = { ...a, type: [a.type, "null"] }), n.set(e, a), a;
}
function Tt(e, t) {
  const l = Array.isArray(e?.type) ? e.type.find((n) => n !== "null") : e?.type;
  return l || (e?.properties || e?.additionalProperties ? "object" : e?.items || e?.prefixItems ? "array" : e?.const !== void 0 ? typeof e.const == "number" ? "number" : typeof e.const : Array.isArray(t) ? "array" : mt(t) ? "object" : typeof t == "number" ? "number" : typeof t == "boolean" ? "boolean" : "string");
}
const Up = (e) => !!e?.nullable || Array.isArray(e?.type) && e.type.includes("null");
function Tl(e) {
  if (e?.enum) {
    const l = e["x-enumNames"] ?? e.enumNames;
    return e.enum.map((n, a) => ({ value: n, label: l?.[a] ?? String(n) }));
  }
  if (e?.const !== void 0) return [{ value: e.const, label: String(e.const) }];
  const t = e?.oneOf ?? e?.anyOf;
  return t?.length && t.every((l) => l.const !== void 0) ? t.map((l) => ({ value: l.const, label: l.title ?? String(l.const) })) : null;
}
function ho(e) {
  const t = e?.oneOf ?? e?.anyOf;
  return !t?.length || t.every((l) => l.const !== void 0) ? null : t;
}
function Kp(e, t, l) {
  let n = 0, a = -1;
  return e.forEach((d, i) => {
    const r = Qe(d, l);
    let c = 0;
    if (mt(t)) {
      for (const [v, m] of Object.entries(r.properties ?? {}))
        t[v] !== void 0 && (c += 1), m.const !== void 0 && t[v] === m.const && (c += 10);
      for (const v of r.required ?? []) t[v] !== void 0 && (c += 2);
    } else t !== void 0 && Tt(r) === Tt({}, t) && (c += 1);
    c > a && (a = c, n = i);
  }), n;
}
function Mt(e, t, l = /* @__PURE__ */ new Set()) {
  const n = Qe(e, t);
  if (n.default !== void 0) return structuredClone(n.default);
  if (n.const !== void 0) return n.const;
  const a = Tl(n);
  if (a) return a[0].value;
  const d = ho(n);
  if (d) return Mt(d[0], t, l);
  const i = Tt(n);
  if (i === "object" || i === "array") {
    if (l.has(n)) return null;
    l.add(n);
  }
  switch (i) {
    case "object": {
      const r = {};
      for (const [c, v] of Object.entries(n.properties ?? {})) r[c] = Mt(v, t, l);
      return r;
    }
    case "array":
      return (n.prefixItems ?? []).map((r) => Mt(r, t, l));
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return !1;
    case "null":
      return null;
    default:
      return "";
  }
}
const bo = {
  date: "date",
  "date-time": "datetime-local",
  time: "time",
  month: "month",
  week: "week",
  email: "email",
  uri: "url",
  url: "url",
  password: "password",
  color: "color",
  tel: "tel",
  search: "search",
  uuid: "text"
};
function Qp(e, t) {
  const l = e?.["x-widget"];
  if (l === "hidden") return "hidden";
  if (l) return l;
  if (Tl(e)) return "select";
  const n = Tt(e, t);
  return n === "object" ? "object" : n === "array" ? "array" : n === "boolean" ? "checkbox" : n === "integer" || n === "number" ? "number" : e?.format === "textarea" ? "textarea" : bo[e?.format] ? "input" : typeof t == "string" && (t.length > 80 || t.includes(`
`)) ? "textarea" : "input";
}
const En = (e) => String(e ?? "").replace(/\[(\d+)\]/g, ".$1").toLowerCase();
function Jp(e, t, l) {
  const n = e?.errors ?? e?.Errors;
  if (!n?.length || !t) return null;
  const a = En(t), d = a.split(".").pop(), i = n.find((r) => {
    const c = En(r.fieldName ?? r.FieldName);
    return c === a ? !0 : !c.includes(".") && c === d && (l?.get(d) ?? 2) === 1;
  });
  return i ? i.message ?? i.Message ?? i.errorCode ?? i.ErrorCode : null;
}
function Jl(e, t, l = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map()) {
  const a = Qe(e, t ?? e);
  if (!a.properties && !a.items && !a.prefixItems && !a.oneOf && !a.anyOf || l.has(a)) return n;
  l.add(a);
  for (const [d, i] of Object.entries(a.properties ?? {})) {
    const r = d.toLowerCase();
    n.set(r, (n.get(r) ?? 0) + 1), Jl(i, t ?? e, l, n);
  }
  for (const d of a.oneOf ?? a.anyOf ?? []) Jl(d, t ?? e, l, n);
  for (const d of [a.items, ...a.prefixItems ?? []])
    d && Jl(d, t ?? e, l, n);
  return n;
}
const Xe = (e, t, l) => ({ fieldName: e, errorCode: t, message: l }), Qs = (e) => e == null || e === "" || Array.isArray(e) && e.length === 0;
function Dn(e, t, l, n = "", a = "", d = []) {
  const i = Qe(e, l), r = a || (n ? n.split(".").pop() : "value"), c = Tt(i, t);
  i.const !== void 0 && t !== i.const && d.push(Xe(n, "Const", `${r} must be ${i.const}`));
  const v = Tl(i);
  if (v && !Qs(t) && !v.some((m) => m.value === t) && d.push(Xe(n, "Enum", `${r} must be one of ${v.map((m) => m.label).join(", ")}`)), c === "object" && mt(t)) {
    for (const m of i.required ?? []) {
      const h = Qe(i.properties?.[m], l);
      Qs(t[m]) && d.push(Xe(n ? `${n}.${m}` : m, "NotEmpty", `${h.title || je(m)} is required`));
    }
    for (const [m, h] of Object.entries(i.properties ?? {}))
      t[m] !== void 0 && Dn(h, t[m], l, n ? `${n}.${m}` : m, Qe(h, l).title || je(m), d);
  } else c === "array" && Array.isArray(t) ? (i.minItems != null && t.length < i.minItems && d.push(Xe(n, "MinItems", `${r} needs at least ${i.minItems}`)), i.maxItems != null && t.length > i.maxItems && d.push(Xe(n, "MaxItems", `${r} allows at most ${i.maxItems}`)), i.uniqueItems && new Set(t.map((m) => JSON.stringify(m))).size !== t.length && d.push(Xe(n, "UniqueItems", `${r} must not contain duplicates`)), t.forEach((m, h) => {
    const y = i.prefixItems?.[h] ?? i.items;
    y && Dn(y, m, l, `${n}[${h}]`, `${r} ${h + 1}`, d);
  })) : c === "string" && typeof t == "string" && t !== "" ? (i.minLength != null && t.length < i.minLength && d.push(Xe(n, "MinLength", `${r} must be at least ${i.minLength} characters`)), i.maxLength != null && t.length > i.maxLength && d.push(Xe(n, "MaxLength", `${r} must be at most ${i.maxLength} characters`)), i.pattern && !new RegExp(i.pattern).test(t) && d.push(Xe(n, "Pattern", `${r} is not in the expected format`))) : (c === "number" || c === "integer") && typeof t == "number" && (c === "integer" && !Number.isInteger(t) && d.push(Xe(n, "Integer", `${r} must be a whole number`)), i.minimum != null && t < i.minimum && d.push(Xe(n, "Minimum", `${r} must be ${i.minimum} or more`)), i.maximum != null && t > i.maximum && d.push(Xe(n, "Maximum", `${r} must be ${i.maximum} or less`)), i.exclusiveMinimum != null && t <= i.exclusiveMinimum && d.push(Xe(n, "ExclusiveMinimum", `${r} must be greater than ${i.exclusiveMinimum}`)), i.exclusiveMaximum != null && t >= i.exclusiveMaximum && d.push(Xe(n, "ExclusiveMaximum", `${r} must be less than ${i.exclusiveMaximum}`)), i.multipleOf && Math.abs(t / i.multipleOf - Math.round(t / i.multipleOf)) > 1e-9 && d.push(Xe(n, "MultipleOf", `${r} must be a multiple of ${i.multipleOf}`)));
  return d;
}
const Gp = "block w-full sm:text-sm rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:text-white dark:bg-gray-900 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500", Wp = "block w-full sm:text-sm rounded-md shadow-sm border-red-500 text-red-900 dark:text-red-200 dark:bg-gray-900 focus:border-red-500 focus:ring-red-500", Zp = "rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden", Xp = "flex items-center gap-2 px-2 py-1.5 bg-gray-50 dark:bg-gray-800/50", Yp = "border-b border-gray-200 dark:border-gray-700", _p = "px-2 py-0.5 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40", e1 = "p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-40", t1 = {
  name: "JsonSchemaNode",
  props: {
    schema: { type: Object, default: () => ({}) },
    model: { type: [Object, Array], required: !0 },
    field: { type: [String, Number], required: !0 },
    path: { type: String, default: "" },
    label: { type: String, default: "" },
    required: { type: Boolean, default: !1 },
    /** render the object's fields without the surrounding panel, header and collapse toggle */
    bare: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = Pe(go), l = t.root, n = M(""), a = f(() => e.model[e.field]), d = f(() => Qe(e.schema, l.value)), i = f(() => ho(d.value)), r = M(0), c = f(() => {
      if (!i.value) return d.value;
      const { oneOf: T, anyOf: Z, ...A } = d.value;
      return { ...A, ...Qe(i.value[r.value], l.value) };
    });
    rl(() => {
      i.value && (r.value = Kp(i.value, a.value, l.value));
    });
    const v = f(() => {
      const T = Qp(c.value, a.value);
      return T === "array" && h.value && c.value["x-widget"] !== "list" ? "checklist" : T;
    }), m = f(() => Tl(c.value)), h = f(
      () => Tt(c.value) === "array" && c.value.items ? Tl(Qe(c.value.items, l.value)) : null
    ), y = f(() => e.label || c.value.title || ""), g = f(() => t.readOnly.value || !!c.value.readOnly), p = f(() => Jp(t.status.value, e.path, t.leafCounts.value)), x = f(() => "f-" + (En(e.path).replace(/\./g, "-") || "root")), w = f(() => a.value === void 0 || a.value === null), C = M(!w.value && !c.value["x-collapsed"]);
    rl(() => {
      if (!C.value && !e.bare) return;
      const T = e.model[e.field];
      (v.value === "array" && !Array.isArray(T) || v.value === "object" && !mt(T)) && (e.model[e.field] = Mt(c.value, l.value));
    });
    const F = f(() => Array.isArray(a.value) ? a.value : []), B = f(() => mt(a.value) ? a.value : {}), E = f(() => c.value.prefixItems ?? (Array.isArray(c.value.items) ? c.value.items : null)), _ = f(() => E.value ?? []), X = f(() => _.value.length), I = f(
      () => F.value.map((T, Z) => Z).filter((T) => T >= X.value)
    ), O = f(() => c.value.maxItems != null && F.value.length >= c.value.maxItems), ie = f(() => c.value.minItems != null && F.value.length <= c.value.minItems), se = f(() => {
      const T = c.value.additionalProperties;
      return T === void 0 ? !c.value.properties : T !== !1;
    }), P = f(() => {
      if (v.value !== "object") return [];
      const T = Object.entries(c.value.properties ?? {}), Z = Object.keys(B.value).filter((A) => !c.value.properties?.[A]).map((A) => [A, mt(c.value.additionalProperties) ? c.value.additionalProperties : {}]);
      return [...T, ...Z].map(([A, S]) => {
        const j = Qe(S, l.value), fe = Tt(j, B.value[A]), V = !!c.value.properties?.[A];
        return {
          key: A,
          schema: S,
          order: j["x-order"] ?? 0,
          // additionalProperties keys are data, not identifiers - show them verbatim
          label: j.title || (V ? je(A) : A),
          wide: fe === "object" || fe === "array" || j.format === "textarea" || j["x-widget"] === "textarea",
          removable: !c.value.properties?.[A],
          hidden: j["x-widget"] === "hidden"
        };
      }).filter((A) => !A.hidden).sort((A, S) => A.order - S.order);
    });
    function z(T) {
      e.model[e.field] = T, t.onChange();
    }
    function K() {
      return Array.isArray(e.model[e.field]) || (e.model[e.field] = []), e.model[e.field];
    }
    return {
      newKey: n,
      value: a,
      schema: c,
      widget: v,
      choices: m,
      itemChoices: h,
      heading: y,
      readOnly: g,
      error: p,
      id: x,
      expanded: C,
      items: F,
      container: B,
      properties: P,
      allowsNewKeys: se,
      tuple: E,
      tupleEntries: _,
      extraIndexes: I,
      firstExtra: X,
      atMax: O,
      atMin: ie,
      variants: i,
      variant: r,
      variantLabels: f(
        () => (i.value ?? []).map((T, Z) => Qe(T, l.value).title ?? `Option ${Z + 1}`)
      ),
      nullable: f(() => Up(c.value)),
      fixed: f(() => c.value.const !== void 0),
      step: f(() => Tt(c.value) === "integer" ? 1 : c.value.multipleOf ?? "any"),
      inputType: f(() => bo[c.value.format] ?? "text"),
      describedBy: f(() => p.value ? `${x.value}-err` : c.value.description ? `${x.value}-help` : void 0),
      panelClass: Zp,
      headerClass: Xp,
      headerBorderClass: Yp,
      smallBtnClass: _p,
      iconBtnClass: e1,
      inputClass: Gp,
      errorClass: Wp,
      isRequired: (T) => (c.value.required ?? []).includes(T),
      childPath: (T) => e.path ? `${e.path}.${T}` : T,
      toggle: () => C.value = !C.value,
      itemLabel(T) {
        const Z = E.value?.[T];
        if (Z) return Qe(Z, l.value).title ?? `#${T + 1}`;
        const A = Qe(c.value.items, l.value), S = A["x-titleKey"], j = F.value[T];
        return S && mt(j) && j[S] ? `${T + 1}. ${j[S]}` : A.title ? `${A.title} ${T + 1}` : mt(j) ? `${e.label || "Item"} ${T + 1}` : "";
      },
      setVariant(T) {
        r.value = T;
        const Z = Qe(i.value[T], l.value), A = mt(a.value) ? a.value : {}, S = Mt(Z, l.value);
        if (mt(S))
          for (const j of Object.keys(S))
            !(Qe(Z.properties?.[j], l.value).const !== void 0) && A[j] !== void 0 && (S[j] = A[j]);
        z(S);
      },
      coerce(T) {
        if (T === String(null)) return null;
        const Z = m.value?.find((A) => String(A.value) === T);
        return Z ? Z.value : T;
      },
      setValue: z,
      toggleChoice(T, Z) {
        const A = K(), S = A.indexOf(T);
        Z && S === -1 ? A.push(T) : !Z && S !== -1 && A.splice(S, 1), t.onChange();
      },
      addItem() {
        K().push(Mt(c.value.items, l.value)), C.value = !0, t.onChange();
      },
      removeItem(T) {
        e.model[e.field].splice(T, 1), t.onChange();
      },
      move(T, Z) {
        const A = e.model[e.field], S = T + Z;
        S < X.value || S >= A.length || (A.splice(S, 0, A.splice(T, 1)[0]), t.onChange());
      },
      addKey() {
        const T = n.value.trim();
        if (!T) return;
        const Z = c.value.additionalProperties;
        B.value[T] = mt(Z) ? Mt(Z, l.value) : "", n.value = "", t.onChange();
      },
      removeKey(T) {
        delete B.value[T], t.onChange();
      }
    };
  }
}, l1 = { key: 0 }, n1 = ["aria-labelledby"], s1 = ["id", "aria-expanded"], a1 = {
  key: 0,
  class: "text-red-500"
}, o1 = { class: "text-xs text-gray-500" }, r1 = {
  key: 0,
  class: "text-xs italic text-gray-400"
}, i1 = ["disabled", "title"], u1 = {
  key: 0,
  class: "p-2 space-y-2"
}, d1 = { class: "flex-1 min-w-0" }, c1 = {
  key: 0,
  class: "flex flex-col opacity-0 group-hover:opacity-100"
}, f1 = ["onClick", "disabled"], m1 = ["onClick", "disabled"], v1 = ["onClick", "disabled"], p1 = {
  key: 0,
  class: "px-1 py-2 text-xs italic text-gray-500"
}, g1 = {
  key: 1,
  class: "text-xs text-red-600 dark:text-red-400"
}, y1 = { key: 2 }, h1 = { class: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300" }, b1 = {
  key: 0,
  class: "text-red-500"
}, w1 = { class: "flex flex-wrap gap-x-4 gap-y-1" }, k1 = ["checked", "disabled", "onChange"], x1 = {
  key: 0,
  class: "mt-1 text-xs text-red-600 dark:text-red-400"
}, $1 = {
  key: 1,
  class: "mt-1 text-xs text-gray-500 dark:text-gray-400"
}, C1 = ["role", "aria-labelledby"], S1 = {
  key: 0,
  class: "mb-2 flex justify-end"
}, L1 = ["value", "disabled"], V1 = ["value"], M1 = ["id", "aria-expanded"], A1 = {
  key: 0,
  class: "text-red-500"
}, T1 = {
  key: 0,
  class: "text-xs italic text-gray-400"
}, j1 = ["value", "disabled"], O1 = ["value"], F1 = { class: "flex items-start gap-1" }, I1 = { class: "flex-1 min-w-0" }, P1 = ["onClick", "title"], B1 = {
  key: 0,
  class: "md:col-span-2 px-1 py-2 text-xs italic text-gray-500"
}, E1 = {
  key: 1,
  class: "md:col-span-2 flex items-center gap-2"
}, D1 = ["disabled"], N1 = {
  key: 2,
  class: "md:col-span-2 text-xs text-red-600 dark:text-red-400"
}, R1 = { key: 4 }, H1 = { class: "inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300" }, q1 = ["checked", "disabled", "aria-invalid", "aria-describedby"], z1 = {
  key: 0,
  class: "text-red-500"
}, U1 = ["id"], K1 = ["id"], Q1 = { key: 5 }, J1 = { class: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300" }, G1 = {
  key: 0,
  class: "text-red-500"
}, W1 = { class: "flex flex-wrap gap-x-4 gap-y-1" }, Z1 = ["name", "value", "checked", "disabled", "onChange"], X1 = {
  key: 0,
  class: "mt-1 text-xs text-red-600 dark:text-red-400"
}, Y1 = {
  key: 1,
  class: "mt-1 text-xs text-gray-500 dark:text-gray-400"
}, _1 = { key: 6 }, eg = ["for"], tg = {
  key: 0,
  class: "text-red-500"
}, lg = ["id", "value", "disabled", "aria-invalid", "aria-describedby"], ng = ["value"], sg = ["value"], ag = ["id", "step", "min", "max", "value", "disabled", "aria-invalid", "aria-describedby"], og = ["id", "value", "disabled", "maxlength", "aria-invalid", "aria-describedby"], rg = ["id", "type", "value", "disabled", "placeholder", "minlength", "maxlength", "pattern", "aria-invalid", "aria-describedby"], ig = ["id"], ug = ["id"];
function dg(e, t, l, n, a, d) {
  const i = N("JsonSchemaNode", !0);
  return e.widget === "hidden" ? (o(), u("div", l1)) : e.widget === "array" ? (o(), u("div", {
    key: 1,
    class: b(e.panelClass),
    role: "group",
    "aria-labelledby": e.id + "-label"
  }, [
    s("div", {
      class: b([e.headerClass, e.expanded ? e.headerBorderClass : ""])
    }, [
      s("button", {
        type: "button",
        onClick: t[0] || (t[0] = (...r) => e.toggle && e.toggle(...r)),
        class: "flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300",
        id: e.id + "-label",
        "aria-expanded": e.expanded
      }, [
        (o(), u("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          class: b(["size-3 transition-transform flex-shrink-0", { "-rotate-90": !e.expanded }]),
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor"
        }, [...t[13] || (t[13] = [
          s("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M19 9l-7 7-7-7"
          }, null, -1)
        ])], 2)),
        pe(" " + L(e.heading), 1),
        e.required ? (o(), u("span", a1, "*")) : k("", !0)
      ], 8, s1),
      s("span", o1, L(e.items.length), 1),
      e.schema.deprecated ? (o(), u("span", r1, "deprecated")) : k("", !0),
      t[14] || (t[14] = s("div", { class: "flex-1" }, null, -1)),
      !e.readOnly && !e.tuple ? (o(), u("button", {
        key: 1,
        type: "button",
        onClick: t[1] || (t[1] = (...r) => e.addItem && e.addItem(...r)),
        disabled: e.atMax,
        class: b(e.smallBtnClass),
        title: e.atMax ? "At most " + e.schema.maxItems : "Add"
      }, "+ Add", 10, i1)) : k("", !0)
    ], 2),
    e.expanded ? (o(), u("div", u1, [
      (o(!0), u(he, null, be(e.tupleEntries, (r, c) => (o(), u("div", {
        key: "t" + c
      }, [
        ve(i, {
          schema: r,
          model: e.items,
          field: c,
          path: e.path + "[" + c + "]",
          label: e.itemLabel(c)
        }, null, 8, ["schema", "model", "field", "path", "label"])
      ]))), 128)),
      (o(!0), u(he, null, be(e.extraIndexes, (r) => (o(), u("div", {
        key: "i" + r,
        class: "group flex items-start gap-2"
      }, [
        s("div", d1, [
          ve(i, {
            schema: e.schema.items,
            model: e.items,
            field: r,
            path: e.path + "[" + r + "]",
            label: e.itemLabel(r)
          }, null, 8, ["schema", "model", "field", "path", "label"])
        ]),
        e.readOnly ? k("", !0) : (o(), u("div", c1, [
          s("button", {
            type: "button",
            onClick: (c) => e.move(r, -1),
            disabled: r === e.firstExtra,
            title: "Move up",
            class: b(e.iconBtnClass)
          }, [...t[15] || (t[15] = [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "size-3",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor"
            }, [
              s("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M5 15l7-7 7 7"
              })
            ], -1)
          ])], 10, f1),
          s("button", {
            type: "button",
            onClick: (c) => e.move(r, 1),
            disabled: r === e.items.length - 1,
            title: "Move down",
            class: b(e.iconBtnClass)
          }, [...t[16] || (t[16] = [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "size-3",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor"
            }, [
              s("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M19 9l-7 7-7-7"
              })
            ], -1)
          ])], 10, m1),
          s("button", {
            type: "button",
            onClick: (c) => e.removeItem(r),
            disabled: e.atMin,
            title: "Remove",
            class: "p-1 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40"
          }, [...t[17] || (t[17] = [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "size-3",
              viewBox: "0 0 20 20",
              fill: "currentColor"
            }, [
              s("path", {
                "fill-rule": "evenodd",
                d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                "clip-rule": "evenodd"
              })
            ], -1)
          ])], 8, v1)
        ]))
      ]))), 128)),
      e.items.length ? k("", !0) : (o(), u("div", p1, "No entries yet")),
      e.error ? (o(), u("p", g1, L(e.error), 1)) : k("", !0)
    ])) : k("", !0)
  ], 10, n1)) : e.widget === "checklist" ? (o(), u("div", y1, [
    s("span", h1, [
      pe(L(e.heading), 1),
      e.required ? (o(), u("span", b1, "*")) : k("", !0)
    ]),
    s("div", w1, [
      (o(!0), u(he, null, be(e.itemChoices, (r) => (o(), u("label", {
        key: String(r.value),
        class: "inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
      }, [
        s("input", {
          type: "checkbox",
          checked: e.items.includes(r.value),
          disabled: e.readOnly,
          onChange: (c) => e.toggleChoice(r.value, c.target.checked),
          class: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
        }, null, 40, k1),
        pe(" " + L(r.label), 1)
      ]))), 128))
    ]),
    e.error ? (o(), u("p", x1, L(e.error), 1)) : e.schema.description ? (o(), u("p", $1, L(e.schema.description), 1)) : k("", !0)
  ])) : e.widget === "object" ? (o(), u("div", {
    key: 3,
    class: b(e.bare ? "" : e.panelClass),
    role: e.bare ? null : "group",
    "aria-labelledby": e.bare ? null : e.id + "-label"
  }, [
    e.bare && e.variants ? (o(), u("div", S1, [
      s("select", {
        value: e.variant,
        onChange: t[2] || (t[2] = (r) => e.setVariant(Number(r.target.value))),
        disabled: e.readOnly,
        class: "text-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white py-0.5"
      }, [
        (o(!0), u(he, null, be(e.variantLabels, (r, c) => (o(), u("option", {
          key: c,
          value: c
        }, L(r), 9, V1))), 128))
      ], 40, L1)
    ])) : k("", !0),
    e.heading && !e.bare ? (o(), u("div", {
      key: 1,
      class: b([e.headerClass, e.expanded ? e.headerBorderClass : ""])
    }, [
      s("button", {
        type: "button",
        onClick: t[3] || (t[3] = (...r) => e.toggle && e.toggle(...r)),
        class: "flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300",
        id: e.id + "-label",
        "aria-expanded": e.expanded
      }, [
        (o(), u("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          class: b(["size-3 transition-transform flex-shrink-0", { "-rotate-90": !e.expanded }]),
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor"
        }, [...t[18] || (t[18] = [
          s("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M19 9l-7 7-7-7"
          }, null, -1)
        ])], 2)),
        pe(" " + L(e.heading), 1),
        e.required ? (o(), u("span", A1, "*")) : k("", !0)
      ], 8, M1),
      e.schema.deprecated ? (o(), u("span", T1, "deprecated")) : k("", !0),
      t[19] || (t[19] = s("div", { class: "flex-1" }, null, -1)),
      e.variants ? (o(), u("select", {
        key: 1,
        value: e.variant,
        onChange: t[4] || (t[4] = (r) => e.setVariant(Number(r.target.value))),
        disabled: e.readOnly,
        class: "text-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white py-0.5"
      }, [
        (o(!0), u(he, null, be(e.variantLabels, (r, c) => (o(), u("option", {
          key: c,
          value: c
        }, L(r), 9, O1))), 128))
      ], 40, j1)) : k("", !0)
    ], 2)) : k("", !0),
    e.expanded || e.bare ? (o(), u("div", {
      key: 2,
      class: b(["grid grid-cols-1 md:grid-cols-2 gap-2", e.bare ? "" : "p-2"])
    }, [
      (o(!0), u(he, null, be(e.properties, (r) => (o(), u("div", {
        key: r.key,
        class: b({ "md:col-span-2": r.wide })
      }, [
        s("div", F1, [
          s("div", I1, [
            ve(i, {
              schema: r.schema,
              model: e.container,
              field: r.key,
              path: e.childPath(r.key),
              label: r.label,
              required: e.isRequired(r.key)
            }, null, 8, ["schema", "model", "field", "path", "label", "required"])
          ]),
          r.removable && !e.readOnly ? (o(), u("button", {
            key: 0,
            type: "button",
            onClick: (c) => e.removeKey(r.key),
            title: "Remove " + r.key,
            class: "mt-4 p-1 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          }, [...t[20] || (t[20] = [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "size-3.5",
              viewBox: "0 0 20 20",
              fill: "currentColor"
            }, [
              s("path", {
                "fill-rule": "evenodd",
                d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                "clip-rule": "evenodd"
              })
            ], -1)
          ])], 8, P1)) : k("", !0)
        ])
      ], 2))), 128)),
      !e.properties.length && !e.allowsNewKeys ? (o(), u("div", B1, "No fields")) : k("", !0),
      e.allowsNewKeys && !e.readOnly ? (o(), u("div", E1, [
        Ot(s("input", {
          "onUpdate:modelValue": t[5] || (t[5] = (r) => e.newKey = r),
          type: "text",
          placeholder: "New property",
          onKeyup: t[6] || (t[6] = sn((...r) => e.addKey && e.addKey(...r), ["enter"])),
          class: "px-2 py-1 text-xs rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:text-white dark:bg-gray-900"
        }, null, 544), [
          [oa, e.newKey]
        ]),
        s("button", {
          type: "button",
          onClick: t[7] || (t[7] = (...r) => e.addKey && e.addKey(...r)),
          disabled: !e.newKey.trim(),
          class: b(e.smallBtnClass)
        }, "Add", 10, D1)
      ])) : k("", !0),
      e.error ? (o(), u("p", N1, L(e.error), 1)) : k("", !0)
    ], 2)) : k("", !0)
  ], 10, C1)) : e.widget === "checkbox" ? (o(), u("div", R1, [
    s("label", H1, [
      s("input", {
        type: "checkbox",
        checked: !!e.value,
        disabled: e.readOnly,
        onChange: t[8] || (t[8] = (r) => e.setValue(r.target.checked)),
        "aria-invalid": !!e.error,
        "aria-describedby": e.describedBy,
        class: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
      }, null, 40, q1),
      pe(" " + L(e.heading), 1),
      e.required ? (o(), u("span", z1, "*")) : k("", !0)
    ]),
    e.error ? (o(), u("p", {
      key: 0,
      id: e.id + "-err",
      class: "mt-1 text-xs text-red-600 dark:text-red-400"
    }, L(e.error), 9, U1)) : e.schema.description ? (o(), u("p", {
      key: 1,
      id: e.id + "-help",
      class: "mt-1 text-xs text-gray-500 dark:text-gray-400"
    }, L(e.schema.description), 9, K1)) : k("", !0)
  ])) : e.widget === "radio" ? (o(), u("div", Q1, [
    s("span", J1, [
      pe(L(e.heading), 1),
      e.required ? (o(), u("span", G1, "*")) : k("", !0)
    ]),
    s("div", W1, [
      (o(!0), u(he, null, be(e.choices, (r) => (o(), u("label", {
        key: String(r.value),
        class: "inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
      }, [
        s("input", {
          type: "radio",
          name: e.id,
          value: String(r.value),
          checked: e.value === r.value,
          disabled: e.readOnly,
          onChange: (c) => e.setValue(r.value),
          class: "border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
        }, null, 40, Z1),
        pe(" " + L(r.label), 1)
      ]))), 128))
    ]),
    e.error ? (o(), u("p", X1, L(e.error), 1)) : e.schema.description ? (o(), u("p", Y1, L(e.schema.description), 1)) : k("", !0)
  ])) : (o(), u("div", _1, [
    e.heading ? (o(), u("label", {
      key: 0,
      for: e.id,
      class: b(["mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300", { "italic opacity-70": e.schema.deprecated }])
    }, [
      pe(L(e.heading), 1),
      e.required ? (o(), u("span", tg, "*")) : k("", !0)
    ], 10, eg)) : k("", !0),
    e.widget === "select" ? (o(), u("select", {
      key: 1,
      id: e.id,
      value: String(e.value),
      disabled: e.readOnly || e.fixed,
      onChange: t[9] || (t[9] = (r) => e.setValue(e.coerce(r.target.value))),
      "aria-invalid": !!e.error,
      "aria-describedby": e.describedBy,
      class: b(e.error ? e.errorClass : e.inputClass)
    }, [
      e.nullable ? (o(), u("option", {
        key: 0,
        value: String(null)
      }, "(none)", 8, ng)) : k("", !0),
      (o(!0), u(he, null, be(e.choices, (r) => (o(), u("option", {
        key: String(r.value),
        value: String(r.value)
      }, L(r.label), 9, sg))), 128))
    ], 42, lg)) : e.widget === "number" ? (o(), u("input", {
      key: 2,
      id: e.id,
      type: "number",
      step: e.step,
      min: e.schema.minimum ?? e.schema.exclusiveMinimum,
      max: e.schema.maximum ?? e.schema.exclusiveMaximum,
      value: e.value,
      disabled: e.readOnly,
      onInput: t[10] || (t[10] = (r) => e.setValue(r.target.value === "" ? null : Number(r.target.value))),
      "aria-invalid": !!e.error,
      "aria-describedby": e.describedBy,
      class: b(e.error ? e.errorClass : e.inputClass)
    }, null, 42, ag)) : e.widget === "textarea" ? (o(), u("textarea", {
      key: 3,
      id: e.id,
      value: e.value ?? "",
      disabled: e.readOnly,
      rows: "3",
      spellcheck: "false",
      maxlength: e.schema.maxLength,
      onInput: t[11] || (t[11] = (r) => e.setValue(r.target.value)),
      "aria-invalid": !!e.error,
      "aria-describedby": e.describedBy,
      class: b([e.error ? e.errorClass : e.inputClass, "resize-y"])
    }, null, 42, og)) : (o(), u("input", {
      key: 4,
      id: e.id,
      type: e.inputType,
      value: e.value ?? "",
      disabled: e.readOnly,
      placeholder: e.schema.examples?.[0] ?? e.schema.placeholder ?? "",
      minlength: e.schema.minLength,
      maxlength: e.schema.maxLength,
      pattern: e.schema.pattern,
      onInput: t[12] || (t[12] = (r) => e.setValue(r.target.value)),
      "aria-invalid": !!e.error,
      "aria-describedby": e.describedBy,
      class: b(e.error ? e.errorClass : e.inputClass)
    }, null, 42, rg)),
    e.error ? (o(), u("p", {
      key: 5,
      id: e.id + "-err",
      class: "mt-1 text-xs text-red-600 dark:text-red-400"
    }, L(e.error), 9, ig)) : e.schema.description ? (o(), u("p", {
      key: 6,
      id: e.id + "-help",
      class: "mt-1 text-xs text-gray-500 dark:text-gray-400"
    }, L(e.schema.description), 9, ug)) : k("", !0)
  ]));
}
const cg = /* @__PURE__ */ wt(t1, [["render", dg]]), fg = {
  name: "JsonSchemaForm",
  components: { JsonSchemaNode: cg },
  props: {
    schema: { type: Object, default: null },
    modelValue: { default: void 0 },
    /** alias for modelValue, for `:data` style usage */
    data: { default: void 0 },
    status: { type: Object, default: null },
    readOnly: { type: Boolean, default: !1 },
    showTitle: { type: Boolean, default: !0 },
    /** wrap the whole form in the same collapsible panel nested objects get (off by default) */
    wrapper: { type: Boolean, default: !1 },
    validateOn: { type: String, default: "submit" }
    // 'submit' | 'change'
  },
  emits: ["update:modelValue", "change"],
  setup(e, { emit: t, expose: l }) {
    const n = ml(), a = M(""), d = M(null), i = f(() => {
      if (e.schema)
        return a.value = "", e.schema;
      const g = mg(n);
      if (!g)
        return a.value = "No schema: pass :schema or put one in the component body", {};
      try {
        return a.value = "", JSON.parse(g);
      } catch (p) {
        return a.value = `Schema isn't valid JSON: ${p.message}`, {};
      }
    }), r = f(() => e.modelValue ?? e.data ?? {}), c = ia({ root: r.value });
    lt(r, (g) => {
      g !== c.root && (c.root = g);
    });
    const v = f(() => e.status ?? d.value), m = f(() => Jl(i.value));
    function h() {
      (e.validateOn === "change" || d.value) && (d.value = y()), t("update:modelValue", c.root), t("change", c.root);
    }
    function y() {
      const g = Dn(i.value, c.root, i.value);
      return g.length ? {
        errorCode: "ValidationException",
        message: g.length === 1 ? g[0].message : `${g.length} fields need attention`,
        errors: g
      } : null;
    }
    return It(go, {
      root: i,
      status: v,
      leafCounts: m,
      readOnly: f(() => e.readOnly),
      onChange: h
    }), l({
      validate: () => d.value = y(),
      reset: () => d.value = null
    }), {
      resolvedSchema: i,
      schemaError: a,
      rootModel: c,
      /** the status message, or any field error naming something this schema doesn't render */
      summary: f(() => {
        const g = v.value;
        if (!g) return null;
        const p = g.errors ?? g.Errors ?? [];
        if (!p.length) return g.message ?? g.errorCode ?? null;
        const x = m.value, w = p.find((C) => {
          const F = String(C.fieldName ?? C.FieldName ?? "").split(/[.[]/).pop().replace("]", "");
          return F && !x.has(F.toLowerCase());
        });
        return w ? w.message ?? w.errorCode : null;
      })
    };
  }
};
function mg(e) {
  const t = [], l = (n) => {
    for (const a of n ?? [])
      typeof a.children == "string" ? t.push(a.children) : Array.isArray(a.children) && l(a.children);
  };
  try {
    l(e.default?.());
  } catch {
    return "";
  }
  return t.join("").trim();
}
const vg = {
  key: 0,
  class: "px-2 py-1.5 text-xs rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
}, pg = {
  key: 0,
  class: "mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100"
}, gg = {
  key: 1,
  class: "mb-3 text-xs text-gray-500 dark:text-gray-400"
}, yg = {
  key: 2,
  class: "mb-3 px-2 py-1.5 text-xs rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
};
function hg(e, t, l, n, a, d) {
  const i = N("JsonSchemaNode");
  return o(), u("div", null, [
    e.schemaError ? (o(), u("p", vg, L(e.schemaError), 1)) : (o(), u(he, { key: 1 }, [
      e.resolvedSchema.title && e.showTitle && !e.wrapper ? (o(), u("h3", pg, L(e.resolvedSchema.title), 1)) : k("", !0),
      e.resolvedSchema.description && e.showTitle ? (o(), u("p", gg, L(e.resolvedSchema.description), 1)) : k("", !0),
      e.summary ? (o(), u("p", yg, L(e.summary), 1)) : k("", !0),
      ve(i, {
        schema: e.resolvedSchema,
        model: e.rootModel,
        field: "root",
        path: "",
        label: "",
        bare: !e.wrapper
      }, null, 8, ["schema", "model", "bare"])
    ], 64))
  ]);
}
const wo = /* @__PURE__ */ wt(fg, [["render", hg]]), bg = {
  name: "SchemaLookup",
  components: { SchemaResults: $s },
  props: {
    id: { type: String, required: !0 },
    /** the schema property, whose ui.ref names the referenced Model */
    prop: { type: Object, required: !0 },
    /** the object being edited - mutated in place, as LookupInput does */
    model: { type: Object, required: !0 },
    status: { type: Object, default: null },
    label: { type: String, default: null },
    help: { type: String, default: null }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const l = vo(), { config: n } = Ct(), a = M(!1), d = M(""), i = f(() => e.prop?.ui?.ref ?? null), r = f(() => i.value ? i.value.icon ?? n.value.tableIcon : null), c = f(() => i.value ? l.model(i.value.model) : null), v = f(() => me(e.model, e.id)), m = f(() => d.value || (v.value ?? "") || `Select ${i.value?.model ?? ""}`), h = f(() => {
      const C = (e.status?.errors ?? []).find((F) => String(F.fieldName ?? "").toLowerCase() === e.id.toLowerCase());
      return C ? C.message : null;
    }), y = f(() => {
      const w = Object.keys(ks(c.value)?.properties ?? {}), C = [i.value?.refId, i.value?.refLabel].filter((F) => F && w.includes(F));
      return [...C, ...w.filter((F) => !C.includes(F))];
    });
    async function g() {
      const w = i.value;
      if (!w?.refLabel || v.value == null || v.value === "") {
        d.value = "";
        return;
      }
      if (typeof v.value == "string" && isNaN(Number(v.value)) && v.value.includes("Id")) {
        d.value = "";
        return;
      }
      const C = Object.values(e.model).find((B) => B && typeof B == "object" && !Array.isArray(B) && me(B, w.refId) == v.value);
      if (C && me(C, w.refLabel)) {
        d.value = String(me(C, w.refLabel));
        return;
      }
      await l.loadModel(w.model);
      const F = c.value?.query;
      if (F)
        try {
          const B = await fetch(
            `${F.$id}?${new URLSearchParams({ [w.refId]: v.value, take: 1 })}`,
            { headers: { Accept: "application/json" } }
          ), E = B.ok ? (me(await B.json(), "results") ?? [])[0] : null;
          E && (d.value = String(me(E, w.refLabel) ?? v.value));
        } catch {
        }
    }
    function p(w) {
      const C = i.value;
      e.model[e.id] = me(w, C.refId), d.value = String(me(w, C.refLabel) ?? ""), a.value = !1, t("update:modelValue", e.model);
    }
    function x() {
      e.model[e.id] = null, d.value = "", t("update:modelValue", e.model);
    }
    return lt(a, (w) => {
      w && l.loadModel(i.value?.model);
    }), ze(g), {
      open: a,
      refInfo: i,
      refIcon: r,
      refSchema: c,
      value: v,
      display: m,
      error: h,
      pickerColumns: y,
      // a picker is a different view of the Model to the page's grid, so it keeps its
      // own visible columns rather than overwriting the ones chosen there
      prefsKey: f(() => `auto:prefs:${i.value?.model}:lookup`),
      pick: p,
      clear: x
    };
  }
}, wg = { class: "lookup-field" }, kg = { class: "flex justify-between" }, xg = ["for"], $g = {
  key: 0,
  class: "flex items-center"
}, Cg = { class: "text-sm text-gray-500 dark:text-gray-400 pr-1" }, Sg = { class: "mt-1 relative" }, Lg = { class: "w-full inline-flex truncate" }, Vg = { class: "text-blue-700 dark:text-blue-300 flex cursor-pointer" }, Mg = {
  key: 0,
  class: "mt-2 text-sm text-red-500"
}, Ag = {
  key: 1,
  class: "mt-2 text-sm text-gray-500"
}, Tg = { class: "px-6 py-4 border-b border-gray-200 dark:border-gray-700" }, jg = { class: "text-base font-semibold" }, Og = { class: "px-6 py-4 max-h-[70vh] overflow-y-auto" }, Fg = {
  key: 1,
  class: "py-8 text-center text-xs text-gray-500 dark:text-gray-400"
};
function Ig(e, t, l, n, a, d) {
  const i = N("Icon"), r = N("SchemaResults"), c = N("ModalDialog");
  return o(), u("div", wg, [
    s("div", kg, [
      s("label", {
        for: e.id,
        class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
      }, L(e.label), 9, xg),
      e.value != null && e.value !== "" ? (o(), u("div", $g, [
        s("span", Cg, L(e.value), 1),
        s("button", {
          type: "button",
          onClick: t[0] || (t[0] = (...v) => e.clear && e.clear(...v)),
          title: "clear",
          class: "mr-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-400"
        }, [...t[3] || (t[3] = [
          s("span", { class: "sr-only" }, "Clear", -1),
          s("svg", {
            class: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ])])
      ])) : k("", !0)
    ]),
    s("div", Sg, [
      s("button", {
        type: "button",
        onClick: t[1] || (t[1] = (v) => e.open = !0),
        class: "lookup flex relative w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      }, [
        s("span", Lg, [
          s("span", Vg, [
            e.refIcon ? (o(), W(i, {
              key: 0,
              class: "mr-1 w-5 h-5",
              image: e.refIcon
            }, null, 8, ["image"])) : k("", !0),
            s("span", null, L(e.display), 1)
          ])
        ]),
        t[4] || (t[4] = s("span", { class: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none" }, [
          s("svg", {
            class: "h-5 w-5 text-gray-400",
            viewBox: "0 0 20 20",
            fill: "currentColor"
          }, [
            s("path", {
              "fill-rule": "evenodd",
              d: `M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414
                            7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414
                            0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z`,
              "clip-rule": "evenodd"
            })
          ])
        ], -1))
      ])
    ]),
    e.error ? (o(), u("p", Mg, L(e.error), 1)) : e.help ? (o(), u("p", Ag, L(e.help), 1)) : k("", !0),
    (o(), W(ua, { to: "body" }, [
      e.open ? (o(), W(c, {
        key: 0,
        id: e.id + "-lookup",
        "size-class": "sm:max-w-6xl sm:w-full",
        onDone: t[2] || (t[2] = (v) => e.open = !1)
      }, {
        default: we(() => [
          s("div", Tg, [
            s("h3", jg, "Select " + L(e.refInfo?.model), 1)
          ]),
          s("div", Og, [
            e.refSchema ? (o(), W(r, {
              key: 0,
              schema: e.refSchema,
              "prefs-key": e.prefsKey,
              "column-order": e.pickerColumns,
              selectable: "",
              onRowSelected: e.pick
            }, null, 8, ["schema", "prefs-key", "column-order", "onRowSelected"])) : (o(), u("p", Fg, "Loading…"))
          ])
        ]),
        _: 1
      }, 8, ["id"])) : k("", !0)
    ]))
  ]);
}
const ko = /* @__PURE__ */ wt(bg, [["render", Ig]]);
function Nn(e, t) {
  if (Array.isArray(e)) return e.map((a) => Nn(a, t?.items));
  if (!e || typeof e != "object" || !t?.properties) return e;
  const l = Object.keys(t.properties), n = {};
  for (const [a, d] of Object.entries(e)) {
    const i = l.find((r) => r.toLowerCase() === a.toLowerCase()) ?? a;
    n[i] = Nn(d, t.properties[i]);
  }
  return n;
}
const Pg = {
  components: { JsonSchemaForm: wo, SchemaLookup: ko },
  props: {
    name: String,
    prop: Object,
    schema: Object,
    status: { type: Object, default: null },
    spanClass: { type: String, default: null },
    model: { type: Object, default: null },
    // whole form model, for LookupInput
    modelValue: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e) {
    const t = f(() => e.prop.ui || {}), l = f(() => (e.schema?.required || []).includes(e.name)), n = f(() => t.value.widget === "textarea" || e.prop.type === "object"), a = f(() => !!e.model && !!t.value.ref && e.prop.type !== "object"), d = f(() => t.value.widget === "file"), i = f(() => {
      const y = e.prop;
      return y.type === "object" && (y.properties || y.additionalProperties) ? !0 : y.type === "array" && y.items?.type === "object" && !!y.items.properties;
    });
    let r = null, c;
    const v = f(() => {
      const y = e.modelValue;
      return y !== c && y !== r && (c = y, r = y != null ? Nn(y, e.prop) : e.prop.type === "array" ? [] : {}), r;
    }), m = f(() => {
      const y = e.name.toLowerCase(), g = (e.status?.errors ?? []).filter((p) => String(p.fieldName ?? "").toLowerCase().startsWith(y)).map((p) => ({ ...p, fieldName: p.fieldName.slice(e.name.length) }));
      return g.length ? { errors: g } : null;
    }), h = f(() => e.prop.type === "array");
    return {
      isTextarea: n,
      lookup: a,
      isFile: d,
      isMultiple: h,
      isComplex: i,
      complexValue: v,
      scopedStatus: m,
      accept: f(() => t.value.accept),
      // already the { fileName, filePath, contentType, contentLength } shape FileInput wants
      uploadedFiles: f(() => Array.isArray(e.modelValue) ? e.modelValue : []),
      // LookupInput mutates the model in place and emits it, so pull our value back out
      modelOf: (y) => me(y, e.name),
      label: f(() => (e.prop.title || e.name) + (l.value ? " *" : "")),
      help: f(() => t.value.help),
      placeholder: f(() => t.value.placeholder),
      span: f(() => e.spanClass ?? (i.value || n.value || t.value.fieldCss?.includes("col-span-12") ? "col-span-12" : "col-span-12 sm:col-span-6 3xl:col-span-4")),
      // SelectInput has no empty option of its own, so optional enums need one to be unset
      entries: f(() => (l.value ? [] : [{ key: "", value: "" }]).concat(
        (e.prop.enum || []).map((y) => ({ key: y, value: t.value.enumDescriptions?.[y] || y }))
      )),
      type: f(() => e.prop.type === "integer" || e.prop.type === "number" ? "number" : e.prop.format === "date-time" ? "datetime-local" : e.prop.format === "email" ? "email" : e.prop.format === "uri" ? "url" : t.value.widget === "password" ? "password" : "text"),
      attrs: f(() => {
        const y = {};
        return e.prop.minimum != null && (y.min = e.prop.minimum), e.prop.maximum != null && (y.max = e.prop.maximum), t.value.step != null && (y.step = t.value.step), e.prop.maxLength != null && (y.maxlength = e.prop.maxLength), e.prop.pattern && (y.pattern = e.prop.pattern), y;
      }),
      textValue: f(() => {
        const y = e.modelValue;
        return y == null ? "" : e.prop.type === "object" ? JSON.stringify(y, null, 2) : e.prop.format === "date-time" ? String(y).slice(0, 16) : y;
      })
    };
  }
}, Bg = {
  key: 0,
  class: "mt-2 text-sm text-gray-500"
}, Eg = {
  key: 0,
  class: "mt-2 text-sm text-gray-500"
};
function Dg(e, t, l, n, a, d) {
  const i = N("SchemaLookup"), r = N("FileInput"), c = N("JsonSchemaForm"), v = N("SelectInput"), m = N("CheckboxInput"), h = N("TextareaInput"), y = N("TagInput"), g = N("TextInput");
  return e.lookup ? (o(), W(i, {
    key: 0,
    id: e.name,
    class: b(e.span),
    label: e.label,
    help: e.help,
    status: e.status,
    prop: e.prop,
    model: e.model,
    "onUpdate:modelValue": t[0] || (t[0] = (p) => e.$emit("update:modelValue", e.modelOf(p)))
  }, null, 8, ["id", "class", "label", "help", "status", "prop", "model"])) : e.isFile ? (o(), W(r, {
    key: 1,
    id: e.name,
    class: b(e.span),
    label: e.label,
    help: e.help,
    status: e.status,
    multiple: e.isMultiple,
    files: e.isMultiple ? e.uploadedFiles : void 0,
    "model-value": e.isMultiple ? void 0 : typeof e.modelValue == "string" ? e.modelValue : "",
    accept: e.accept
  }, null, 8, ["id", "class", "label", "help", "status", "multiple", "files", "model-value", "accept"])) : e.isComplex ? (o(), u("div", {
    key: 2,
    class: b(e.span)
  }, [
    ve(c, {
      schema: e.prop,
      "model-value": e.complexValue,
      status: e.scopedStatus,
      "show-title": e.prop.type !== "array",
      onChange: t[1] || (t[1] = (p) => e.$emit("update:modelValue", p))
    }, null, 8, ["schema", "model-value", "status", "show-title"]),
    e.help ? (o(), u("p", Bg, L(e.help), 1)) : k("", !0)
  ], 2)) : e.prop.enum ? (o(), u("div", {
    key: 3,
    class: b(e.span)
  }, [
    ve(v, {
      id: e.name,
      label: e.label,
      status: e.status,
      entries: e.entries,
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[2] || (t[2] = (p) => e.$emit("update:modelValue", p))
    }, null, 8, ["id", "label", "status", "entries", "model-value"]),
    e.help ? (o(), u("p", Eg, L(e.help), 1)) : k("", !0)
  ], 2)) : e.prop.type === "boolean" ? (o(), W(m, {
    key: 4,
    id: e.name,
    class: b(e.span),
    label: e.label,
    help: e.help,
    status: e.status,
    "model-value": !!e.modelValue,
    "onUpdate:modelValue": t[3] || (t[3] = (p) => e.$emit("update:modelValue", p))
  }, null, 8, ["id", "class", "label", "help", "status", "model-value"])) : e.isTextarea ? (o(), W(h, {
    key: 5,
    id: e.name,
    class: b(e.span),
    label: e.label,
    help: e.help,
    status: e.status,
    placeholder: e.placeholder,
    "model-value": e.textValue,
    "onUpdate:modelValue": t[4] || (t[4] = (p) => e.$emit("update:modelValue", p))
  }, null, 8, ["id", "class", "label", "help", "status", "placeholder", "model-value"])) : e.prop.type === "array" ? (o(), W(y, {
    key: 6,
    id: e.name,
    class: b(e.span),
    label: e.label,
    help: e.help,
    status: e.status,
    "model-value": e.modelValue ?? [],
    "onUpdate:modelValue": t[5] || (t[5] = (p) => e.$emit("update:modelValue", p))
  }, null, 8, ["id", "class", "label", "help", "status", "model-value"])) : (o(), W(g, Se({
    key: 7,
    id: e.name,
    class: e.span,
    type: e.type,
    label: e.label,
    help: e.help,
    status: e.status,
    placeholder: e.placeholder
  }, e.attrs, {
    "model-value": e.textValue,
    "onUpdate:modelValue": t[6] || (t[6] = (p) => e.$emit("update:modelValue", p))
  }), null, 16, ["id", "class", "type", "label", "help", "status", "placeholder", "model-value"]));
}
const Cs = /* @__PURE__ */ wt(Pg, [["render", Dg]]), Ng = ["skip", "edit", "new", "orderBy"], Rg = (e) => Array.from(e.matchAll(/\{(\w+)\}/g)).map((t) => t[1]), xo = (e) => Object.entries(e?.properties || {}).map(([t, l]) => ({ name: t, prop: l })), Hg = (e) => e?.description !== e?.title ? e?.description : null, Gl = (e) => e ? { request: { name: e.title }, ...e.auth || {} } : null, Js = (e, t = null) => {
  if (e == null || e === "" || Array.isArray(e) && e.length === 0) return !0;
  if (t?.type === "integer" || t?.type === "number" || typeof e == "number") {
    const n = Number(e);
    if (Number.isFinite(n) && n === 0) return !0;
  }
  return !1;
};
function qg(e, t, l) {
  return e === t ? !1 : e == null || t == null || typeof e == "object" || typeof t == "object" ? !0 : l?.format === "date-time" ? String(e).slice(0, 16) !== String(t).slice(0, 16) : String(e) !== String(t);
}
function Rn(e, t, l, { original: n = null, primaryKey: a = null, client: d = null } = {}) {
  const i = e.method || "POST", r = Rg(e.$id);
  let c = xs(e.$id, t);
  const v = e.operation === "Patch" && n != null, m = [], h = {};
  for (const w of Object.keys(e.properties || {})) {
    if (r.includes(w)) continue;
    const C = me(t, w), F = v ? me(n, w) : void 0, B = e.properties[w];
    Js(C, B) ? v && !Js(F, B) && m.push(w) : (!v || w === a || qg(C, F, B)) && (h[w] = C);
  }
  m.length && (c += (c.includes("?") ? "&" : "?") + new URLSearchParams({ reset: m.join(",") }));
  const y = { Accept: "application/json" }, g = d?.bearerToken || ee.apiKey.value;
  g && (y.Authorization = `Bearer ${g}`);
  const p = l && i !== "GET" && i !== "DELETE" ? [...l.querySelectorAll("input[type=file]")].filter((w) => w.files?.length) : [];
  let x = null;
  if (i === "GET" || i === "DELETE") {
    const w = new URLSearchParams();
    for (const [C, F] of Object.entries(h))
      Array.isArray(F) ? w.append(C, F.join(",")) : typeof F == "object" && F !== null ? w.append(C, JSON.stringify(F)) : w.append(C, F);
    [...w].length && (c += (c.includes("?") ? "&" : "?") + w);
  } else if (p.length) {
    const w = new FormData(), C = p.map((F) => F.name);
    for (const [F, B] of Object.entries(h))
      C.includes(F) || w.append(F, Array.isArray(B) ? B.join(",") : B);
    for (const F of p)
      for (const B of F.files) w.append(F.name, B);
    x = w;
  } else
    y["Content-Type"] = "application/json", x = JSON.stringify(h);
  return { method: i, url: c, headers: y, body: h, payload: x, uploads: p.map((w) => w.name) };
}
async function Gs(e, t, l, n = {}) {
  const { method: a, url: d, headers: i, payload: r } = Rn(e, t, l, n), c = await fetch(d, { method: a, headers: i, body: r ?? void 0 }), v = await c.text(), m = v ? JSON.parse(v) : null;
  if (!c.ok)
    throw me(m || {}, "responseStatus") || { message: `${c.status} ${c.statusText}`, errors: [] };
  return m;
}
const Lb = { query: "View", create: "Create", update: "Edit", delete: "Delete", save: "Save" };
function Vb(e) {
  const t = [];
  return e.requiredRoles && t.push(hl(e.requiredRoles, "role")), e.requiresAnyRole && t.push("any " + hl(e.requiresAnyRole, "role")), e.requiredPermissions && t.push(hl(e.requiredPermissions, "permission")), e.requiresAnyPermission && t.push("any " + hl(e.requiresAnyPermission, "permission")), e.requiredScopes && t.push(hl(e.requiredScopes, "scope")), e.requiresApiKey && t.push("an API Key"), !t.length && e.requiresAuth && t.push("you to be signed in"), t.join(" and ");
}
const hl = (e, t) => e.join(", ") + " " + t + (e.length > 1 ? "s" : "");
function zg(e) {
  const t = [], l = (n) => {
    for (const a of n ?? [])
      typeof a.children == "string" ? t.push(a.children) : Array.isArray(a.children) && l(a.children);
  };
  try {
    l(e.default?.());
  } catch {
    return "";
  }
  return t.join("").trim();
}
const Ug = {
  name: "AutoQuerySchema",
  components: { SchemaInput: Cs, SchemaResults: $s },
  props: {
    /** the AutoQuery Schema to render. Optional - falls back to parsing the component's body */
    schema: { type: Object, default: null },
    /** the current session, as an AuthenticateResponse. null when signed out */
    auth: { type: Object, default: null },
    /** an optional JsonServiceClient; one is created and provided if omitted */
    client: { type: Object, default: null },
    /** rows per page, until the user picks their own in Query Preferences */
    take: { type: Number, default: 25 },
    /**
     * Tailwind size-class override for the edit/create ModalDialog.
     *
     * Example:
     * <AutoQuerySchema
     *   :schema="schema"
     *   modal-size-class="sm:max-w-5xl 2xl:max-w-7xl sm:w-full"
     * />
     */
    modalSizeClass: { type: String, default: "sm:max-w-3xl 3xl:max-w-6xl sm:w-full" },
    /**
     * Full Tailwind class override for regular form fields in the modal dialog.
     *
     * Example:
     * <AutoQuerySchema
     *   :schema="schema"
     *   field-class="col-span-12 md:col-span-6 xl:col-span-3"
     * />
     */
    fieldClass: { type: String, default: null }
  },
  setup(e) {
    const t = ml(), l = e.schema ?? JSON.parse(zg(t) || "{}"), n = e.take, a = e.client ?? new ir();
    It("client", a), e.auth && cl().signIn(e.auth);
    const { canAccess: d } = cl(), i = Fe()?.appContext.config.globalProperties, r = i?.$router;
    if (!i?.$route || !r) throw new Error("AutoQuerySchema requires app.use(router)");
    const c = f(() => i.$route), v = l.primaryKey || "Id", m = M(null), h = M([]), y = M(!1), g = M(null), p = f(() => d(Gl(l.create))), x = f(() => d(Gl(l.update))), w = f(() => d(Gl(l.delete))), C = f(() => !!l.update), F = f(() => g.value?.key === "create" ? p.value : x.value), B = f(() => xo(g.value?.schema)), E = f(() => e.fieldClass || ps);
    function _(ae) {
      return gs(ae) ? "col-span-12" : E.value;
    }
    const X = f(() => {
      const ae = Object.keys(g.value?.schema?.properties ?? {});
      return (g.value?.error?.errors ?? []).map((U) => U.fieldName).filter((U) => ae.some((Q) => String(U ?? "").toLowerCase().startsWith(Q.toLowerCase())));
    }), I = f(() => Object.fromEntries(Object.entries(c.value.query).filter(([ae, U]) => !Ng.includes(ae) && U != null && U !== ""))), O = f(() => String(c.value.query.orderBy || "")), ie = f(() => Math.max(0, parseInt(c.value.query.skip) || 0)), se = f(() => c.value.query.edit), P = f(() => c.value.query.new != null), z = f(() => ({ filters: I.value, orderBy: O.value, skip: ie.value }));
    function K(ae) {
      const U = Object.fromEntries(Object.keys(I.value).map((Q) => [Q, void 0]));
      Object.assign(U, ae.filters), U.orderBy = ae.orderBy || void 0, U.skip = ae.skip || void 0, T(U);
    }
    function T(ae) {
      const U = { ...c.value.query, ...ae };
      for (const Q of Object.keys(U))
        (U[Q] == null || U[Q] === "") && delete U[Q];
      r.push({ query: U });
    }
    const Z = () => T({ new: 1, edit: void 0 }), A = (ae) => T({ edit: me(ae, v), new: void 0 }), S = () => {
      se.value == null && !P.value || T({ edit: void 0, new: void 0 });
    };
    async function j(ae) {
      try {
        const U = new URLSearchParams({ [v]: ae, take: 1 }), Q = xs(l.query.$id, {}) + "?" + U, R = await fetch(Q, { headers: { Accept: "application/json" } });
        return R.ok ? (me(await R.json(), "results") || [])[0] : null;
      } catch {
        return null;
      }
    }
    function fe(ae, U) {
      const Q = l[ae];
      if (!Q) return !1;
      const R = {};
      if (U) for (const ce of Object.keys(Q.properties || {})) {
        const ue = me(U, ce);
        ue != null && (R[ce] = ue);
      }
      return g.value = { key: ae, schema: Q, row: U, data: R, error: null }, !0;
    }
    async function V() {
      if (P.value) {
        fe("create") || S();
        return;
      }
      if (se.value == null) {
        g.value = null;
        return;
      }
      if (!l.update) {
        S();
        return;
      }
      const ae = h.value.find((U) => String(me(U, v)) === String(se.value)) ?? await j(se.value);
      ae ? fe("update", ae) : S();
    }
    async function $(ae) {
      y.value = !0;
      try {
        await Gs(
          g.value.schema,
          g.value.data,
          ae?.target,
          { original: g.value.row, primaryKey: v }
        ), S(), await m.value?.reload();
      } catch (U) {
        g.value.error = U;
      } finally {
        y.value = !1;
      }
    }
    async function te() {
      y.value = !0;
      try {
        await Gs(l.delete, { ...g.value.row, ...g.value.data }), S(), await m.value?.reload();
      } catch (ae) {
        g.value.error = ae;
      } finally {
        y.value = !1;
      }
    }
    return lt(() => [se.value, P.value].join("|"), V), lt(h, V), ze(V), {
      Auto: l,
      results: m,
      rows: h,
      loading: y,
      form: g,
      boundFields: X,
      formProps: B,
      query: z,
      onQuery: K,
      take: n,
      canCreate: p,
      canUpdate: x,
      canDelete: w,
      canOpenRow: C,
      canSubmit: F,
      formSubtitle: f(() => Hg(g.value?.schema)),
      spanClassFor: _,
      openCreate: Z,
      rowSelected: A,
      closeForm: S,
      submitForm: $,
      deleteRow: te
    };
  }
}, Kg = { class: "px-6 py-4 border-b border-gray-200 dark:border-gray-700" }, Qg = { class: "text-base font-semibold" }, Jg = ["innerHTML"], Gg = { class: "px-6 py-5 max-h-[60vh] overflow-y-auto" }, Wg = { class: "grid grid-cols-12 gap-4" }, Zg = { class: "px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2" }, Xg = {
  key: 0,
  class: "flex items-center"
};
function Yg(e, t, l, n, a, d) {
  const i = N("PrimaryButton"), r = N("SchemaResults"), c = N("ErrorSummary"), v = N("SchemaInput"), m = N("ConfirmDelete"), h = N("SecondaryButton"), y = N("ModalDialog");
  return o(), u("div", null, [
    ve(r, {
      ref: "results",
      schema: e.Auto,
      query: e.query,
      "onUpdate:query": e.onQuery,
      take: e.take,
      selectable: e.canOpenRow,
      onRowSelected: e.rowSelected,
      onLoaded: t[0] || (t[0] = (g) => e.rows = g.results)
    }, {
      toolbar: we(() => [
        e.canCreate ? (o(), W(i, {
          key: 0,
          onClick: e.openCreate
        }, {
          default: we(() => [
            pe(L(e.Auto.create.ui?.submitLabel || "New"), 1)
          ]),
          _: 1
        }, 8, ["onClick"])) : k("", !0)
      ]),
      _: 1
    }, 8, ["schema", "query", "onUpdate:query", "take", "selectable", "onRowSelected"]),
    e.form ? (o(), W(y, {
      key: 0,
      id: "autoForm",
      "size-class": e.modalSizeClass,
      onDone: e.closeForm
    }, {
      default: we(() => [
        s("form", {
          onSubmit: t[1] || (t[1] = Ee((g) => e.submitForm(g), ["prevent"]))
        }, [
          s("div", Kg, [
            s("h3", Qg, L(e.form.schema.title), 1),
            e.formSubtitle ? (o(), u("p", {
              key: 0,
              class: "text-gray-500 dark:text-gray-400 mt-0.5",
              innerHTML: e.formSubtitle
            }, null, 8, Jg)) : k("", !0)
          ]),
          s("div", Gg, [
            e.form.error ? (o(), W(c, {
              key: 0,
              status: e.form.error,
              except: e.boundFields,
              class: "mb-4"
            }, null, 8, ["status", "except"])) : k("", !0),
            s("div", Wg, [
              (o(!0), u(he, null, be(e.formProps, (g) => (o(), W(v, {
                key: g.name,
                name: g.name,
                prop: g.prop,
                schema: e.form.schema,
                status: e.form.error,
                model: e.form.data,
                "span-class": e.spanClassFor(g.prop),
                modelValue: e.form.data[g.name],
                "onUpdate:modelValue": (p) => e.form.data[g.name] = p
              }, null, 8, ["name", "prop", "schema", "status", "model", "span-class", "modelValue", "onUpdate:modelValue"]))), 128))
            ])
          ]),
          s("div", Zg, [
            e.form.key === "update" && e.canDelete ? (o(), u("div", Xg, [
              ve(m, { onDelete: e.deleteRow }, {
                default: we(() => [
                  pe(L(e.Auto.delete.ui?.submitLabel || "Delete"), 1)
                ]),
                _: 1
              }, 8, ["onDelete"])
            ])) : k("", !0),
            t[3] || (t[3] = s("span", { class: "flex-1" }, null, -1)),
            ve(h, {
              type: "button",
              onClick: e.closeForm
            }, {
              default: we(() => [...t[2] || (t[2] = [
                pe("Cancel", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            e.canSubmit ? (o(), W(i, {
              key: 1,
              type: "submit",
              disabled: e.loading
            }, {
              default: we(() => [
                pe(L(e.form.schema.ui?.submitLabel || "Submit"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["size-class", "onDone"])) : k("", !0)
  ]);
}
const _g = /* @__PURE__ */ wt(Ug, [["render", Yg]]), ey = (e) => e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / 1024 / 1024).toFixed(1)} MB`;
function ty({ method: e, url: t, headers: l, body: n, uploads: a }) {
  const d = typeof location < "u" ? location.origin : "", i = [`curl -X ${e} '${d}${t}'`];
  for (const [r, c] of Object.entries(l)) i.push(`-H '${r}: ${c}'`);
  if (a.length) {
    for (const [r, c] of Object.entries(n))
      a.includes(r) || i.push(`-F '${r}=${c}'`);
    for (const r of a) i.push(`-F '${r}=@/path/to/file'`);
  } else e !== "GET" && e !== "DELETE" && i.push(`-d '${JSON.stringify(n)}'`);
  return i.join(` \\
  `);
}
function ly(e, t) {
  const l = t?.type;
  if (l === "boolean")
    return e === "" || /^(true|1|on|yes)$/i.test(e);
  if (l === "integer" || l === "number") {
    const n = Number(e);
    return Number.isFinite(n) && e !== "" ? n : void 0;
  }
  if (l === "array") {
    const n = Array.isArray(e) ? e : [e];
    return t.items?.type === "object" ? Ws(n[0]) : n.flatMap((a) => String(a).split(",")).map((a) => a.trim()).filter(Boolean);
  }
  return l === "object" ? Ws(e) : e;
}
const Ws = (e) => {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
};
function ny(e) {
  if (typeof location > "u") return {};
  const t = new URLSearchParams(location.search), l = new Map(Object.keys(e.properties ?? {}).map((a) => [a.toLowerCase(), a])), n = {};
  for (const [a, d] of t) {
    const i = l.get(a.toLowerCase());
    if (!i || i in n) continue;
    const r = e.properties[i], c = ly(r?.type === "array" ? t.getAll(a) : d, r);
    c !== void 0 && (n[i] = c);
  }
  return n;
}
function Zs(e, t) {
  if (typeof location > "u" || typeof history > "u") return;
  const l = new URLSearchParams(), n = e?.properties ?? {}, a = new Map(Object.entries(n).map(([r, c]) => [r.toLowerCase(), c]));
  for (const [r, c] of Object.entries(t ?? {})) {
    if (c == null) continue;
    const v = n[r] ?? a.get(String(r).toLowerCase());
    if (v?.type === "integer" || v?.type === "number" || typeof c == "number") {
      const h = Number(c);
      if (!Number.isFinite(h) || h === 0) continue;
      l.set(r, String(h));
    } else if (v?.type === "boolean" || typeof c == "boolean")
      (c === !0 || c === "true") && l.set(r, "true");
    else if (Array.isArray(c))
      c.length > 0 && l.set(r, c.join(","));
    else if (typeof c == "object")
      Object.keys(c).length > 0 && l.set(r, JSON.stringify(c));
    else if (typeof c == "string") {
      const h = c.trim();
      if (h === "" || h === "0") continue;
      l.set(r, h);
    }
  }
  const d = l.toString(), i = location.pathname + (d ? "?" + d : "");
  history.replaceState(null, "", i);
}
const sy = {
  name: "ApiFormSchema",
  components: { SchemaInput: Cs, ErrorSummary: oo, PrimaryButton: ys, SecondaryButton: io, ApiKeyDialog: mo },
  props: {
    schema: { type: Object, required: !0 },
    client: { type: Object, default: null },
    modelValue: { type: Object, default: null },
    autoExecute: { type: Boolean, default: !1 },
    syncUrl: { type: Boolean, default: !1 },
    /**
     * Full Tailwind class override for regular field spans.
     *
     * Example:
     * <ApiFormSchema
     *   :schema="schema"
     *   field-class="col-span-12 md:col-span-6 xl:col-span-3"
     * />
     */
    fieldClass: { type: String, default: null }
  },
  emits: ["update:modelValue", "success", "error", "execute", "reset"],
  setup(e, { emit: t }) {
    const l = e.schema, n = xo(l), a = () => Object.fromEntries(n.map((P) => [P.name, void 0])), d = e.syncUrl ? ny(l) : {}, i = M(e.modelValue ? { ...e.modelValue } : { ...a(), ...d }), r = M(null), c = M(!1), v = M(null), m = Wl(null), h = e.client ?? Pe("client", null);
    It("client", h);
    const y = M(!1), g = Za(), p = f(() => g.value || h?.bearerToken || ""), x = f(() => !!l.auth?.requiresApiKey);
    function w(P) {
      h && (h.bearerToken = P), g.value = P;
    }
    const { canAccess: C } = cl(), F = l.method || "POST", B = f(() => Rn(l, i.value, m.value, { client: h })), E = f(() => e.fieldClass || ps);
    function _(P) {
      return gs(P) ? "col-span-12" : E.value;
    }
    const X = f(() => {
      const P = B.value, z = [`${P.method} ${P.url}`];
      for (const [K, T] of Object.entries(P.headers)) z.push(`${K}: ${T}`);
      return P.uploads.length ? z.push("", `(multipart — uploading ${P.uploads.join(", ")})`) : typeof P.payload == "string" && P.payload !== "{}" && z.push("", JSON.stringify(P.body, null, 2)), z.join(`
`);
    }), I = f(() => {
      const P = Object.keys(l.properties ?? {});
      return (r.value?.errors ?? []).map((z) => z.fieldName).filter((z) => P.some((K) => String(z ?? "").toLowerCase().startsWith(K.toLowerCase())));
    });
    async function O() {
      e.syncUrl && Zs(l, i.value), c.value = !0, r.value = null;
      const P = performance.now();
      try {
        const z = Rn(l, i.value, m.value, { client: h });
        t("execute", { request: z, data: i.value });
        const K = await fetch(z.url, { method: z.method, headers: z.headers, body: z.payload ?? void 0 }), T = await K.text(), Z = Math.round(performance.now() - P);
        let A = T, S = null;
        try {
          S = T ? JSON.parse(T) : null, A = S != null ? JSON.stringify(S, null, 2) : T;
        } catch {
        }
        A || (A = "(no content)"), v.value = {
          json: S,
          ok: K.ok,
          status: K.status,
          statusText: K.statusText,
          ms: Z,
          size: ey(new Blob([T]).size),
          text: A,
          headers: [...K.headers.entries()].map(([j, fe]) => `${j}: ${fe}`).join(`
`)
        }, r.value = K.ok ? null : S?.responseStatus ?? S?.ResponseStatus ?? { message: `${K.status} ${K.statusText}`, errors: [] }, K.ok ? t("success", { json: S, result: v.value }) : t("error", { error: r.value, result: v.value });
      } catch (z) {
        r.value = { message: z.message ?? String(z), errors: [] }, v.value = null, t("error", { error: r.value, result: null });
      } finally {
        c.value = !1;
      }
    }
    function ie(P) {
      P.target?.tagName !== "TEXTAREA" && (P.preventDefault(), O());
    }
    function se() {
      i.value = a(), r.value = null, v.value = null, e.syncUrl && Zs(l, i.value), t("reset");
    }
    return ze(() => {
      e.autoExecute && F === "GET" && Object.keys(d).length && O();
    }), {
      schema: l,
      form: m,
      fields: n,
      data: i,
      error: r,
      loading: c,
      result: v,
      boundFields: I,
      requestText: X,
      execute: O,
      onFormEnter: ie,
      reset: se,
      curl: f(() => ty(B.value)),
      request: B,
      spanClassFor: _,
      canCall: f(() => C(Gl(l))),
      showApiKeyDialog: y,
      apiKey: p,
      requiresApiKey: x,
      onApiKeySaved: w
    };
  }
}, ay = {
  key: 1,
  class: "grid grid-cols-12 gap-4"
}, oy = {
  key: 2,
  class: "text-gray-500 dark:text-gray-400"
}, ry = { class: "mt-5 flex items-center gap-3" }, iy = {
  key: 1,
  class: "text-xs text-amber-600 dark:text-amber-400"
};
function uy(e, t, l, n, a, d) {
  const i = N("ErrorSummary"), r = N("SchemaInput"), c = N("PrimaryButton"), v = N("SecondaryButton"), m = N("ApiKeyDialog");
  return o(), u("div", null, [
    s("form", {
      ref: "form",
      onSubmit: t[1] || (t[1] = Ee((...h) => e.execute && e.execute(...h), ["prevent"])),
      onKeydown: t[2] || (t[2] = sn((...h) => e.onFormEnter && e.onFormEnter(...h), ["enter"])),
      class: "min-w-0"
    }, [
      e.error ? (o(), W(i, {
        key: 0,
        status: e.error,
        except: e.boundFields,
        class: "mb-4"
      }, null, 8, ["status", "except"])) : k("", !0),
      e.fields.length ? (o(), u("div", ay, [
        (o(!0), u(he, null, be(e.fields, (h) => (o(), W(r, {
          key: h.name,
          name: h.name,
          prop: h.prop,
          schema: e.schema,
          status: e.error,
          "model-value": e.data[h.name],
          "span-class": e.spanClassFor(h.prop),
          "onUpdate:modelValue": (y) => e.data[h.name] = y
        }, null, 8, ["name", "prop", "schema", "status", "model-value", "span-class", "onUpdate:modelValue"]))), 128))
      ])) : (o(), u("p", oy, " This API takes no parameters — just run it. ")),
      s("div", ry, [
        ve(c, {
          type: "submit",
          disabled: e.loading
        }, {
          default: we(() => [
            pe(L(e.loading ? "Running…" : e.schema.ui?.submitLabel || "Execute"), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        ve(v, {
          type: "button",
          onClick: e.reset,
          disabled: e.loading
        }, {
          default: we(() => [...t[4] || (t[4] = [
            pe("Reset", -1)
          ])]),
          _: 1
        }, 8, ["onClick", "disabled"]),
        e.requiresApiKey && !e.apiKey ? (o(), u("button", {
          key: 0,
          type: "button",
          onClick: t[0] || (t[0] = (h) => e.showApiKeyDialog = !0),
          class: "inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        }, [...t[5] || (t[5] = [
          s("svg", {
            class: "w-4 h-4 text-amber-500",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            viewBox: "0 0 24 24"
          }, [
            s("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            })
          ], -1),
          s("span", null, "Add API Key", -1)
        ])])) : k("", !0),
        e.canCall ? k("", !0) : (o(), u("span", iy, " You don't have access to call this — it will fail with 401/403 "))
      ]),
      G(e.$slots, "default", {
        requestText: e.requestText,
        curl: e.curl,
        request: e.request,
        result: e.result,
        error: e.error,
        loading: e.loading,
        data: e.data,
        execute: e.execute,
        reset: e.reset
      })
    ], 544),
    e.showApiKeyDialog ? (o(), W(m, {
      key: 0,
      onDone: t[3] || (t[3] = (h) => e.showApiKeyDialog = !1),
      onSave: e.onApiKeySaved
    }, null, 8, ["onSave"])) : k("", !0)
  ]);
}
const dy = /* @__PURE__ */ wt(sy, [["render", uy]]), { formatValue: Xs, Formats: cy } = Ga(), $n = (e) => e == null || typeof e != "object", fy = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), Ys = (e) => /^https?:\/\/\S+$/i.test(e) || /^\/[^\s"']*$/.test(e), _s = (e) => /\.(png|jpe?g|gif|svg|webp|avif)(\?|$)/i.test(e), ea = (e) => /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}|$)/.test(e), my = 3, vy = {
  name: "JsonView",
  props: {
    value: { default: null },
    depth: { type: Number, default: 0 }
  },
  setup(e) {
    const t = f(() => typeof e.value == "string" ? e.value : null), l = f(() => Array.isArray(e.value) ? e.value : null), n = f(() => Object.entries(e.value ?? {}).map(([a, d]) => ({ key: a, label: Sl(a), value: d })));
    return {
      entries: n,
      label: Sl,
      scalarValue: f(() => $n(e.value)),
      date: f(() => t.value != null && ea(t.value)),
      image: f(() => t.value != null && Ys(t.value) && _s(t.value)),
      link: f(() => t.value == null ? null : fy(t.value) ? `mailto:${t.value}` : Ys(t.value) && !_s(t.value) ? t.value : null),
      // dates and numbers read the same here as they do in a data grid. formatValue()
      // leaves an ISO string alone unless told it's a date, and a timestamp that carries
      // a real time of day shouldn't lose it to a date-only format
      scalar: f(() => {
        if (!(t.value != null && ea(t.value))) return Xs(e.value);
        const a = Xs(t.value, cy.date);
        if (!/[T ]\d{2}:\d{2}/.test(t.value) || /[T ]00:00(:00(\.0+)?)?Z?$/.test(t.value))
          return a;
        const d = new Date(t.value).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
        return `${a}, ${d}`;
      }),
      isEmptyList: f(() => l.value?.length === 0),
      scalarList: f(() => l.value?.length > 0 && l.value.every($n)),
      // the union of every row's keys, so a row missing one still lines up
      columns: f(() => l.value ? _l(l.value) : []),
      isEmptyObject: f(() => !$n(e.value) && !l.value && n.value.length === 0),
      folded: f(() => e.depth >= my && n.value.length > 0)
    };
  }
};
function Mb(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return { data: e, key: null };
  const t = Object.keys(e), l = t.find((n) => n.toLowerCase() === "results") ?? t.find((n) => n.toLowerCase() === "result");
  return l == null || e[l] == null ? { data: e, key: null } : { data: e[l], key: l, envelope: e };
}
const py = {
  key: 0,
  class: "text-gray-400 dark:text-gray-600 italic"
}, gy = {
  class: "w-3 h-3",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  viewBox: "0 0 24 24"
}, yy = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "m4.5 12.75 6 6 9-13.5"
}, hy = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18 18 6M6 6l12 12"
}, by = {
  key: 2,
  class: "tabular-nums"
}, wy = ["datetime", "title"], ky = ["src", "alt"], xy = ["href", "target"], $y = {
  key: 6,
  class: "whitespace-pre-wrap break-normal min-w-max"
}, Cy = {
  key: 7,
  class: "text-gray-400 dark:text-gray-600 italic"
}, Sy = {
  key: 8,
  class: "flex flex-wrap gap-1"
}, Ly = {
  key: 9,
  class: "overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
}, Vy = { class: "overflow-x-auto" }, My = { class: "w-max min-w-full text-left" }, Ay = { class: "caption-top px-3 py-1.5 text-left text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" }, Ty = { class: "bg-gray-50 dark:bg-gray-900" }, jy = { class: "divide-y divide-gray-200 dark:divide-gray-800" }, Oy = {
  key: 10,
  class: "text-gray-400 dark:text-gray-600 italic"
}, Fy = {
  key: 11,
  class: "group"
}, Iy = { class: "cursor-pointer text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 select-none" }, Py = { class: "mt-1 grid grid-cols-[auto_auto] gap-x-3 gap-y-1 border-l-2 border-gray-200 dark:border-gray-800 pl-3 min-w-max" }, By = { class: "text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap pt-0.5" }, Ey = { class: "min-w-max" }, Dy = { class: "min-w-max" };
function Ny(e, t, l, n, a, d) {
  const i = N("JsonView", !0);
  return e.value == null ? (o(), u("span", py, "null")) : typeof e.value == "boolean" ? (o(), u("span", {
    key: 1,
    class: b([
      "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
      e.value ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    ])
  }, [
    (o(), u("svg", gy, [
      e.value ? (o(), u("path", yy)) : (o(), u("path", hy))
    ])),
    pe(" " + L(e.value), 1)
  ], 2)) : typeof e.value == "number" ? (o(), u("span", by, L(e.scalar), 1)) : e.date ? (o(), u("time", {
    key: 3,
    datetime: e.value,
    title: e.value
  }, L(e.scalar), 9, wy)) : e.image ? (o(), u("img", {
    key: 4,
    src: e.value,
    alt: e.value,
    loading: "lazy",
    class: "max-h-16 rounded border border-gray-200 dark:border-gray-800"
  }, null, 8, ky)) : e.link ? (o(), u("a", {
    key: 5,
    href: e.link,
    target: e.link.startsWith("mailto:") ? null : "_blank",
    rel: "noopener",
    class: "text-indigo-600 dark:text-indigo-400 hover:underline break-all"
  }, L(e.value), 9, xy)) : e.scalarValue ? (o(), u("span", $y, L(e.scalar), 1)) : e.isEmptyList ? (o(), u("span", Cy, "no items")) : e.scalarList ? (o(), u("ol", Sy, [
    (o(!0), u(he, null, be(e.value, (r, c) => (o(), u("li", {
      key: c,
      class: "rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs"
    }, [
      ve(i, {
        value: r,
        depth: e.depth + 1
      }, null, 8, ["value", "depth"])
    ]))), 128))
  ])) : Array.isArray(e.value) ? (o(), u("div", Ly, [
    s("div", Vy, [
      s("table", My, [
        s("caption", Ay, L(e.value.length) + " " + L(e.value.length === 1 ? "row" : "rows"), 1),
        s("thead", Ty, [
          s("tr", null, [
            (o(!0), u(he, null, be(e.columns, (r) => (o(), u("th", {
              key: r,
              scope: "col",
              class: "px-3 py-2 font-semibold whitespace-nowrap text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"
            }, L(e.label(r)), 1))), 128))
          ])
        ]),
        s("tbody", jy, [
          (o(!0), u(he, null, be(e.value, (r, c) => (o(), u("tr", {
            key: c,
            class: b(c % 2 ? "bg-gray-50/60 dark:bg-gray-900/40" : "")
          }, [
            (o(!0), u(he, null, be(e.columns, (v) => (o(), u("td", {
              key: v,
              class: "px-3 py-2 align-top"
            }, [
              ve(i, {
                value: r?.[v],
                depth: e.depth + 1
              }, null, 8, ["value", "depth"])
            ]))), 128))
          ], 2))), 128))
        ])
      ])
    ])
  ])) : e.isEmptyObject ? (o(), u("span", Oy, "no fields")) : e.folded ? (o(), u("details", Fy, [
    s("summary", Iy, L(e.entries.length) + " " + L(e.entries.length === 1 ? "field" : "fields"), 1),
    s("dl", Py, [
      (o(!0), u(he, null, be(e.entries, (r) => (o(), u(he, {
        key: r.key
      }, [
        s("dt", By, L(r.label), 1),
        s("dd", Ey, [
          ve(i, {
            value: r.value,
            depth: e.depth + 1
          }, null, 8, ["value", "depth"])
        ])
      ], 64))), 128))
    ])
  ])) : (o(), u("dl", {
    key: 12,
    class: b([
      "grid grid-cols-[auto_auto] gap-x-3 min-w-max",
      e.depth === 0 ? "gap-y-2" : "gap-y-1",
      e.depth > 0 ? "border-l-2 border-gray-200 dark:border-gray-800 pl-3" : ""
    ])
  }, [
    (o(!0), u(he, null, be(e.entries, (r) => (o(), u(he, {
      key: r.key
    }, [
      s("dt", {
        class: b([
          "whitespace-nowrap text-gray-500 dark:text-gray-400",
          e.depth === 0 ? "font-medium pt-0.5" : "text-xs pt-0.5"
        ])
      }, L(r.label), 3),
      s("dd", Dy, [
        ve(i, {
          value: r.value,
          depth: e.depth + 1
        }, null, 8, ["value", "depth"])
      ])
    ], 64))), 128))
  ], 2));
}
const Ry = /* @__PURE__ */ wt(vy, [["render", Ny]]), Hy = {
  props: {
    name: String,
    alias: String
  },
  setup(e) {
    const t = Pe("routes"), l = `-${e.name}`;
    function n() {
      const a = t.sort === e.name ? l : t.sort === l ? "" : e.name;
      t.to({ sort: a });
    }
    return { routes: t, toggle: n, humanify: Sl };
  }
}, qy = {
  key: 0,
  class: "w-4 h-4",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20"
}, zy = {
  key: 1,
  class: "w-4 h-4",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20"
};
function Uy(e, t, l, n, a, d) {
  return o(), u("div", {
    class: "cursor-pointer flex items-center",
    onClick: t[0] || (t[0] = (i) => e.toggle())
  }, [
    s("span", null, L(e.alias ?? e.humanify(e.name)), 1),
    e.routes.sort === e.name ? (o(), u("svg", qy, [...t[1] || (t[1] = [
      s("g", { fill: "none" }, [
        s("path", {
          d: "M8.998 4.71L6.354 7.354a.5.5 0 1 1-.708-.707L9.115 3.18A.499.499 0 0 1 9.498 3H9.5a.5.5 0 0 1 .354.147l.01.01l3.49 3.49a.5.5 0 1 1-.707.707l-2.65-2.649V16.5a.5.5 0 0 1-1 0V4.71z",
          fill: "currentColor"
        })
      ], -1)
    ])])) : e.routes.sort === "-" + e.name ? (o(), u("svg", zy, [...t[2] || (t[2] = [
      s("g", { fill: "none" }, [
        s("path", {
          d: "M10.002 15.29l2.645-2.644a.5.5 0 0 1 .707.707L9.886 16.82a.5.5 0 0 1-.384.179h-.001a.5.5 0 0 1-.354-.147l-.01-.01l-3.49-3.49a.5.5 0 1 1 .707-.707l2.648 2.649V3.5a.5.5 0 0 1 1 0v11.79z",
          fill: "currentColor"
        })
      ], -1)
    ])])) : k("", !0)
  ]);
}
const Ky = /* @__PURE__ */ wt(Hy, [["render", Uy]]), Qy = mi, Jy = ki, Gy = oo, Wy = Li, Zy = ro, Xy = Ai, Yy = Oi, _y = ys, eh = io, th = Ei, lh = qi, nh = Qi, sh = Wi, ah = su, oh = Od, rh = Ed, ih = bs, uh = hs, dh = ws, ch = uo, fh = Dd, mh = co, vh = Xd, ph = nc, gh = cc, yh = Ac, hh = Zc, bh = o0, wh = u0, kh = d0, xh = x0, $h = $0, Ch = q0, Sh = rf, Lh = Vf, Vh = Uf, Mh = Kf, Ah = Wf, Th = em, jh = tm, Oh = rm, Fh = cm, Ih = vm, Ph = pm, Bh = hm, Eh = Om, Dh = fo, Nh = mv, Rh = xv, Hh = $v, qh = Dv, zh = Gv, Uh = tp, Kh = mo, Qh = _g, Jh = dy, Gh = wo, Wh = Ry, Zh = po, Xh = ko, Yh = $s, _h = Ky, eb = Cs, tb = {
  Alert: Qy,
  AlertSuccess: Jy,
  ErrorSummary: Gy,
  InputDescription: Wy,
  Icon: Zy,
  Loading: Xy,
  OutlineButton: Yy,
  PrimaryButton: _y,
  SecondaryButton: eh,
  TextLink: th,
  Breadcrumbs: lh,
  Breadcrumb: nh,
  NavList: sh,
  NavListItem: ah,
  AutoQueryGrid: oh,
  SettingsIcons: rh,
  FilterViews: ih,
  FilterColumn: uh,
  QueryPrefs: dh,
  EnsureAccess: ch,
  EnsureAccessDialog: fh,
  TextInput: mh,
  TextareaInput: vh,
  SelectInput: ph,
  CheckboxInput: gh,
  TagInput: yh,
  FileInput: hh,
  Autocomplete: bh,
  Combobox: wh,
  DynamicInput: kh,
  LookupInput: xh,
  AutoFormFields: $h,
  AutoForm: Ch,
  AutoCreateForm: Sh,
  AutoEditForm: Lh,
  AutoViewForm: Vh,
  ConfirmDelete: Mh,
  FormLoading: Ah,
  DataGrid: Th,
  CellFormat: jh,
  PreviewFormat: Oh,
  HtmlFormat: Fh,
  MarkupFormat: Ih,
  MarkupModel: Ph,
  CloseButton: Bh,
  SlideOver: Eh,
  ModalDialog: Dh,
  ModalLookup: Nh,
  Tabs: Rh,
  DarkModeToggle: Hh,
  SignIn: qh,
  MarkdownInput: zh,
  SidebarLayout: Uh,
  ApiKeyDialog: Kh,
  AutoQuerySchema: Qh,
  ApiFormSchema: Jh,
  JsonSchemaForm: Gh,
  JsonView: Wh,
  SchemaGrid: Zh,
  SchemaLookup: Xh,
  SchemaResults: Yh,
  SortableColumn: _h,
  SchemaInput: eb
}, lb = [
  { id: "csharp", label: "C#", ext: ".cs" },
  { id: "python", label: "Python", ext: ".py" },
  { id: "typescript", label: "TS", ext: ".ts" },
  { id: "javascript", label: "JS", ext: ".js" }
], Hn = {
  csharp: new Set("abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while".split(" ")),
  python: new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" ")),
  typescript: new Set("break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with".split(" "))
};
Hn.javascript = Hn.typescript;
const $o = (e) => String(e).replace(new RegExp("(\\p{Ll}|\\p{N})(\\p{Lu})", "gu"), "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean), et = (e) => Co($o(e).map((t) => t[0].toUpperCase() + t.slice(1)).join("")) || "Value", Ab = (e) => {
  const t = et(e);
  return t[0].toLowerCase() + t.slice(1);
}, ta = (e) => Co($o(e).map((t) => t.toLowerCase()).join("_")) || "value";
function ll(e) {
  return /ies$/i.test(e) && e.length > 4 ? e.slice(0, -3) + "y" : /(ss|us|is)$/i.test(e) ? e : /(ches|shes|xes|zes|ses)$/i.test(e) ? e.slice(0, -2) : /s$/i.test(e) && e.length > 2 ? e.slice(0, -1) : e;
}
const Ss = (e) => /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(e), Co = (e) => new RegExp("^\\p{N}", "u").test(e) ? "_" + e : e, So = /^\d{4}-\d{2}-\d{2}$/, qn = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/, Lo = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Be = (e, t = {}) => ({ kind: e, ...t }), fl = Be("any");
class nb {
  constructor() {
    this.types = [], this.byShape = /* @__PURE__ */ new Map(), this.byRef = /* @__PURE__ */ new Map(), this.names = /* @__PURE__ */ new Set();
  }
  /** claim a name before its fields are built, so a recursive $ref can point back at it */
  reserve(t, l = !1) {
    const n = this.uniqueName(t, "", l);
    return this.names.add(n), n;
  }
  pushObject(t, l) {
    return this.types.push({ kind: "object", name: t, fields: l }), Be("ref", { name: t });
  }
  uniqueName(t, l, n = !1) {
    let a = et(t) || "Type";
    if (!n && a === this.rootName && (a += "Info"), !this.names.has(a)) return a;
    for (let d = 2; d < 100; d++) {
      const i = `${a}${d}`;
      if (!this.names.has(i)) return i;
    }
    return `${a}_${l.length}`;
  }
  addObject(t, l, n = !1) {
    const a = JSON.stringify(t.map((r) => [r.key, jl(r.type), r.optional])), d = this.byShape.get(a);
    if (d) return Be("ref", { name: d });
    const i = this.uniqueName(l, a, n);
    return this.names.add(i), this.byShape.set(a, i), this.types.push({ kind: "object", name: i, fields: t }), Be("ref", { name: i });
  }
  addEnum(t, l, n) {
    const a = "enum:" + JSON.stringify(t), d = this.byShape.get(a);
    if (d) return Be("ref", { name: d });
    const i = this.uniqueName(l, a);
    return this.names.add(i), this.byShape.set(a, i), this.types.push({ kind: "enum", name: i, values: t, description: n }), Be("ref", { name: i });
  }
}
const jl = (e) => e.kind === "array" ? `[${jl(e.of)}]` : e.kind === "map" ? `{${jl(e.of)}}` : e.kind === "ref" ? e.name : e.kind, Vo = (e) => {
  const t = Array.isArray(e.type) ? e.type.find((l) => l !== "null") : e.type;
  return t || (e.properties || e.additionalProperties ? "object" : e.items || e.prefixItems ? "array" : e.enum ? typeof e.enum[0] == "number" ? "number" : typeof e.enum[0] : e.const !== void 0 ? typeof e.const : "string");
}, sb = (e) => !!e.nullable || Array.isArray(e.type) && e.type.includes("null");
function Mo(e, t, l = /* @__PURE__ */ new Set()) {
  if (!e?.$ref || l.has(e.$ref)) return e;
  l.add(e.$ref);
  let n = t;
  for (const i of e.$ref.replace(/^#\//, "").split("/"))
    n = n?.[decodeURIComponent(i.replace(/~1/g, "/").replace(/~0/g, "~"))];
  if (!n) return e;
  const { $ref: a, ...d } = e;
  return Mo({ ...n, ...d }, t, l);
}
function ab(e, t) {
  if (!e?.allOf?.length) return e;
  const { allOf: l, ...n } = e;
  return l.reduce((a, d) => {
    const i = zn(d, t);
    return {
      ...a,
      ...i,
      properties: { ...a.properties ?? {}, ...i.properties ?? {} },
      required: [.../* @__PURE__ */ new Set([...a.required ?? [], ...i.required ?? []])]
    };
  }, n);
}
const zn = (e, t) => ab(Mo(e ?? {}, t), t), ob = (e) => e.length > 0 && e.every((t) => typeof t == "string" && /^[A-Za-z][A-Za-z0-9 _-]*$/.test(t));
function wl(e, t, l, n, a = /* @__PURE__ */ new Set(), d = !1, i = void 0) {
  const r = zn(e, t), c = sb(r), v = r.title ? et(r.title) : et(n);
  if (r.enum && ob(r.enum))
    return { ...l.addEnum(r.enum, v, r.description), nullable: c };
  if (r.enum || r.const !== void 0)
    return { ...la(r), nullable: c };
  switch (Vo(r)) {
    case "object": {
      if (r.properties) {
        const y = e?.$ref;
        if (y && l.byRef.has(y)) return { kind: "ref", name: l.byRef.get(y), nullable: c };
        const g = y ? l.reserve(r.title ?? y.split("/").pop(), d) : null;
        y && l.byRef.set(y, g);
        const p = new Set(r.required ?? []), x = Object.entries(r.properties).map(([w, C]) => {
          const F = zn(C, t);
          return {
            key: w,
            description: F.description,
            optional: !p.has(w),
            deprecated: !!F.deprecated,
            type: wl(C, t, l, ll(et(w)), a, !1, Cn(i, w))
          };
        });
        return g ? { ...l.pushObject(g, x), nullable: c } : { ...l.addObject(x, v, d), nullable: c };
      }
      const m = r.additionalProperties;
      return { kind: "map", of: m && typeof m == "object" ? wl(m, t, l, `${v}Value`, a, !1, Object.values(i ?? {})[0]) : fl, nullable: c };
    }
    case "array":
      return r.prefixItems?.length ? {
        kind: "tuple",
        of: r.prefixItems.map((h, y) => wl(h, t, l, `${v}${y + 1}`, a, !1, Cn(i, y))),
        nullable: c
      } : { kind: "array", of: r.items ? wl(r.items, t, l, ll(v), a, !1, Cn(i, 0)) : fl, nullable: c };
    default:
      return { ...la(r, i), nullable: c };
  }
}
const Cn = (e, t) => e?.[t], rb = (e, t) => typeof t != "string" ? !0 : e === "date" ? So.test(t) || qn.test(t) : e === "date-time" ? qn.test(t) : e === "uuid" ? Lo.test(t) : !0;
function la(e, t) {
  const l = Vo(e);
  if (l === "boolean") return Be("boolean");
  if (l === "integer")
    return Be(e.maximum > 2147483647 || e.minimum < -2147483648 ? "long" : "integer");
  if (l === "number") {
    const n = e.multipleOf != null && e.multipleOf < 1;
    return Be(n ? "decimal" : "double");
  }
  if (l === "null") return Be("any");
  switch (rb(e.format, t) ? e.format : void 0) {
    case "date":
      return Be("date");
    case "date-time":
      return Be("datetime");
    case "uuid":
      return Be("uuid");
    default:
      return Be("string");
  }
}
function ib(e) {
  const t = /* @__PURE__ */ new Map();
  for (const l of e)
    for (const [n, a] of Object.entries(l)) {
      t.has(n) || t.set(n, { values: [], count: 0 });
      const d = t.get(n);
      d.values.push(a), d.count++;
    }
  return { keys: t, total: e.length };
}
function Ls(e, t, l, n = 0, a = !1) {
  if (e == null) return { ...fl, nullable: !0 };
  if (Array.isArray(e)) {
    if (!e.length) return { kind: "array", of: fl };
    const d = e.filter((i) => i && typeof i == "object" && !Array.isArray(i));
    if (d.length === e.length) {
      const { keys: i, total: r } = ib(d), c = [...i.entries()].map(([v, m]) => ({
        key: v,
        optional: m.count < r || m.values.some((h) => h === null),
        type: na(m.values, t, ll(et(v)), n + 1)
      }));
      return { kind: "array", of: t.addObject(c, ll(et(l))) };
    }
    return { kind: "array", of: na(e, t, ll(et(l)), n + 1) };
  }
  if (typeof e == "object") {
    const d = Object.entries(e).map(([i, r]) => ({
      key: i,
      optional: r === null,
      type: Ls(r, t, ll(et(i)), n + 1)
    }));
    return t.addObject(d, et(l), a);
  }
  if (typeof e == "boolean") return Be("boolean");
  if (typeof e == "number")
    return Number.isInteger(e) ? Be(e > 2147483647 || e < -2147483648 ? "long" : "integer") : Be("double");
  if (typeof e == "string") {
    if (Lo.test(e)) return Be("uuid");
    if (qn.test(e)) return Be("datetime");
    if (So.test(e)) return Be("date");
  }
  return Be("string");
}
function na(e, t, l, n) {
  const a = e.filter((c) => c != null);
  if (!a.length) return { ...fl, nullable: !0 };
  const d = a.map((c) => Ls(c, t, l, n)), i = d[0];
  return d.every((c) => jl(c) === jl(i)) ? { ...i, nullable: a.length < e.length } : d.every((c) => c.kind === "integer" || c.kind === "double") ? Be("double") : { ...fl, nullable: !0 };
}
const ub = (e) => !!e && typeof e == "object" && !Array.isArray(e) && (e.$schema !== void 0 || e.properties !== void 0 || e.type !== void 0 && typeof e.type == "string");
function db({ name: e = "data.json", json: t, schema: l } = {}) {
  const n = new nb(), a = et(String(e).replace(/\.ui\.json$/, "").replace(/\.[^.]+$/, "") || "Root");
  n.rootName = a;
  let d;
  return l && ub(l) ? d = wl(l, l, n, l.title ? et(l.title) : a, /* @__PURE__ */ new Set(), !0, t) : d = Ls(t, n, a, 0, !0), d.kind !== "ref" && n.types.push({ kind: "alias", name: n.uniqueName(a, "alias"), type: d }), { types: n.types, root: d };
}
function Ao(e) {
  const t = /* @__PURE__ */ new Set(), l = (n) => {
    n && (t.add(n.kind), n.of && (Array.isArray(n.of) ? n.of : [n.of]).forEach(l));
  };
  for (const n of e)
    n.kind === "object" ? n.fields.forEach((a) => l(a.type)) : n.kind === "alias" ? l(n.type) : t.add(n.kind);
  return t;
}
const ln = (e, t, l) => {
  let n = e;
  return Ss(n) || (n = l), Hn[t]?.has(n) && (n = t === "csharp" ? "@" + n : n + "_"), n || l;
}, sa = (e, t, l) => e ? e.split(`
`).map((n) => `${t}${l} ${n}`).join(`
`) + `
` : "", cb = {
  string: "string",
  integer: "int",
  long: "long",
  double: "double",
  decimal: "decimal",
  boolean: "bool",
  date: "DateTime",
  datetime: "DateTime",
  uuid: "Guid",
  any: "object"
};
function Cl(e) {
  return e.kind === "array" ? `List<${Cl(e.of)}>` : e.kind === "map" ? `Dictionary<string, ${Cl(e.of)}>` : e.kind === "tuple" ? `(${e.of.map(Cl).join(", ")})` : e.kind === "ref" ? e.name : cb[e.kind] ?? "object";
}
const fb = ["integer", "long", "double", "decimal", "boolean", "date", "datetime", "uuid"], mb = (e, t) => fb.includes(e.kind) || e.kind === "tuple" || e.kind === "ref" && t?.types.some((l) => l.name === e.name && l.kind === "enum");
function vb(e) {
  const t = [], l = Ao(e.types), n = (...a) => a.some((d) => l.has(d));
  n("date", "datetime", "uuid") && t.push("using System;"), n("array", "map") && t.push("using System.Collections.Generic;"), t.push("using System.Text.Json.Serialization;", "");
  for (const a of e.types) {
    if (a.kind === "enum") {
      t.push(sa(a.description, "", "///").trimEnd()), t.push(`public enum ${a.name}`, "{"), t.push(a.values.map((d) => `    ${ln(et(d), "csharp", "Value")},`).join(`
`)), t.push("}", "");
      continue;
    }
    if (a.kind === "alias") {
      t.push(`// root: ${Cl(a.type)}`, "");
      continue;
    }
    t.push(`public class ${a.name}`, "{"), a.fields.forEach((d, i) => {
      i && t.push(""), t.push(sa(d.description, "    ", "///").trimEnd() || null), d.deprecated && t.push("    [System.Obsolete]"), t.push(`    [JsonPropertyName("${d.key}")]`);
      let r = ln(et(d.key), "csharp", "Value");
      r === a.name && (r += "Value");
      const c = d.optional || d.type.nullable, v = Cl(d.type), m = c ? `${v}?` : v, h = c || mb(d.type, e) ? "" : d.type.kind === "array" || d.type.kind === "map" ? " = new();" : " = null!;";
      t.push(`    public ${m} ${r} { get; set; }${h}`);
    }), t.push("}", "");
  }
  return t.filter((a) => a !== null).join(`
`).replace(/\n{3,}/g, `

`).trim() + `
`;
}
const pb = {
  string: "str",
  integer: "int",
  long: "int",
  double: "float",
  decimal: "Decimal",
  boolean: "bool",
  date: "date",
  datetime: "datetime",
  uuid: "UUID",
  any: "Any"
};
function al(e) {
  return e.kind === "array" ? `List[${al(e.of)}]` : e.kind === "map" ? `Dict[str, ${al(e.of)}]` : e.kind === "tuple" ? `Tuple[${e.of.map(al).join(", ")}]` : e.kind === "ref" ? e.name : pb[e.kind] ?? "Any";
}
function gb(e) {
  const t = [], l = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), a = Ao(e.types);
  a.has("array") && l.add("List"), a.has("map") && l.add("Dict"), a.has("tuple") && l.add("Tuple"), a.has("any") && l.add("Any"), a.has("decimal") && n.add("from decimal import Decimal"), a.has("datetime") && n.add("from datetime import datetime"), a.has("date") && n.add("from datetime import date"), a.has("uuid") && n.add("from uuid import UUID");
  let d = !1, i = !1;
  for (const c of e.types) {
    if (c.kind === "alias") {
      t.push(`# root: ${al(c.type)}`, "");
      continue;
    }
    if (c.kind === "enum") {
      d = !0, t.push(`class ${c.name}(str, Enum):`), c.description && t.push(`    """${c.description}"""`), c.values.forEach((m) => t.push(`    ${ln(ta(m).toUpperCase(), "python", "VALUE")} = ${JSON.stringify(m)}`)), t.push("", "");
      continue;
    }
    t.push("@dataclass_json", "@dataclass", `class ${c.name}:`);
    const v = [...c.fields].sort((m, h) => Number(m.optional) - Number(h.optional));
    v.length || t.push("    pass"), v.forEach((m) => {
      const h = ln(ta(m.key), "python", "value"), y = m.optional || m.type.nullable;
      y && l.add("Optional");
      const g = y ? `Optional[${al(m.type)}]` : al(m.type), p = h !== m.key ? `metadata=config(field_name=${JSON.stringify(m.key)})` : null;
      let x = "";
      p && y ? (i = !0, x = ` = field(default=None, ${p})`) : p ? (i = !0, x = ` = field(${p})`) : y && (x = " = None"), m.description && t.push(`    # ${m.description}`), t.push(`    ${h}: ${g}${x}`);
    }), t.push("", "");
  }
  const r = ["from __future__ import annotations", ""];
  return r.push(`from dataclasses import dataclass${i ? ", field" : ""}`), r.push(`from dataclasses_json import dataclass_json${i ? ", config" : ""}`), d && r.push("from enum import Enum"), l.size && r.push(`from typing import ${[...l].sort().join(", ")}`), r.push(...[...n].sort()), r.join(`
`) + `


` + t.join(`
`).replace(/\n{4,}/g, `


`).trim() + `
`;
}
const yb = {
  string: "string",
  integer: "number",
  long: "number",
  double: "number",
  decimal: "number",
  boolean: "boolean",
  date: "string",
  datetime: "string",
  uuid: "string",
  any: "any"
};
function ol(e) {
  return e.kind === "array" ? `${ol(e.of)}[]` : e.kind === "map" ? `Record<string, ${ol(e.of)}>` : e.kind === "tuple" ? `[${e.of.map(ol).join(", ")}]` : e.kind === "ref" ? e.name : yb[e.kind] ?? "any";
}
const hb = (e) => Ss(e) ? e : JSON.stringify(e);
function bb(e) {
  const t = [];
  for (const l of e.types) {
    if (l.kind === "alias") {
      t.push(`export type ${l.name} = ${ol(l.type)}`, "");
      continue;
    }
    if (l.kind === "enum") {
      l.description && t.push(`/** ${l.description} */`), t.push(`export type ${l.name} = ${l.values.map((n) => JSON.stringify(n)).join(" | ")}`, "");
      continue;
    }
    t.push(`export class ${l.name} {`), l.fields.forEach((n) => {
      n.description && t.push(`    /** ${n.description} */`);
      const a = n.optional || n.type.nullable;
      t.push(`    ${hb(n.key)}${a ? "?" : "!"}: ${ol(n.type)}`);
    }), t.push("", `    constructor(init?: Partial<${l.name}>) { Object.assign(this, init) }`, "}", "");
  }
  return t.join(`
`).trim() + `
`;
}
function wb(e) {
  const t = [];
  for (const l of e.types)
    l.kind === "alias" || l.kind === "enum" || (t.push(`export class ${l.name} {`), l.fields.forEach((n) => {
      const a = n.optional || n.type.nullable;
      t.push(`    /** @type {${ol(n.type)}${a ? "|undefined" : ""}}${n.description ? ` ${n.description}` : ""} */`), t.push(`    ${Ss(n.key) ? n.key : `[${JSON.stringify(n.key)}]`}`);
    }), t.push("", "    constructor(init = {}) { Object.assign(this, init) }", "}", ""));
  return t.join(`
`).trim() + `
`;
}
const kb = { csharp: vb, python: gb, typescript: bb, javascript: wb };
function Tb({ name: e = "data.json", json: t, schema: l, language: n } = {}) {
  const a = lb.find((v) => v.id === n);
  if (!a) throw new Error(`Unsupported language '${n}'`);
  const d = typeof t == "string" ? JSON.parse(t) : t, i = typeof l == "string" ? JSON.parse(l) : l, r = db({ name: e, json: d, schema: i });
  return {
    path: (String(e).replace(/\.ui\.json$/, "").replace(/\.[^.]+$/, "") || "data") + a.ext,
    content: kb[n](r),
    language: n
  };
}
const Sn = tb || {}, jb = {
  install(e) {
    Object.keys(Sn).forEach((l) => {
      e.component(l, Sn[l]);
    });
    function t(l) {
      const a = Object.keys(l).filter((d) => l[d]).map((d) => `${encodeURIComponent(d)}=${encodeURIComponent(l[d])}`).join("&");
      return a ? "?" + a : "./";
    }
    e.directive("href", function(l, n) {
      l.href = t(n.value), l.onclick = (a) => {
        a.preventDefault(), history.pushState(n.value, "", t(n.value));
      };
    });
  },
  component(e, t) {
    return e ? t ? ee.components[e] = t : ee.components[e] || Sn[e] || null : null;
  }
};
export {
  Lb as ACTIONS,
  Qy as Alert,
  Jy as AlertSuccess,
  Jh as ApiFormSchema,
  Kh as ApiKeyDialog,
  Sh as AutoCreateForm,
  Lh as AutoEditForm,
  Ch as AutoForm,
  $h as AutoFormFields,
  oh as AutoQueryGrid,
  Qh as AutoQuerySchema,
  Vh as AutoViewForm,
  bh as Autocomplete,
  nh as Breadcrumb,
  lh as Breadcrumbs,
  go as CONTEXT,
  jh as CellFormat,
  gh as CheckboxInput,
  Bh as CloseButton,
  wh as Combobox,
  tb as Components,
  Mh as ConfirmDelete,
  Hh as DarkModeToggle,
  Th as DataGrid,
  kh as DynamicInput,
  ch as EnsureAccess,
  fh as EnsureAccessDialog,
  Gy as ErrorSummary,
  hh as FileInput,
  uh as FilterColumn,
  ih as FilterViews,
  Ah as FormLoading,
  Fh as HtmlFormat,
  bo as INPUT_TYPES,
  Zy as Icon,
  Wy as InputDescription,
  Gh as JsonSchemaForm,
  cg as JsonSchemaNode,
  Wh as JsonView,
  Xy as Loading,
  xh as LookupInput,
  zh as MarkdownInput,
  Ih as MarkupFormat,
  Ph as MarkupModel,
  vr as MetadataApp,
  Dh as ModalDialog,
  Nh as ModalLookup,
  sh as NavList,
  ah as NavListItem,
  Yy as OutlineButton,
  Oh as PreviewFormat,
  _y as PrimaryButton,
  dh as QueryPrefs,
  Zh as SchemaGrid,
  eb as SchemaInput,
  Xh as SchemaLookup,
  Yh as SchemaResults,
  eh as SecondaryButton,
  ph as SelectInput,
  rh as SettingsIcons,
  Uh as SidebarLayout,
  qh as SignIn,
  Eh as SlideOver,
  _h as SortableColumn,
  lb as TYPE_LANGUAGES,
  Rh as Tabs,
  yh as TagInput,
  mh as TextInput,
  th as TextLink,
  vh as TextareaInput,
  Kp as bestVariant,
  Mt as blankFor,
  db as buildModel,
  Rn as buildRequest,
  Ab as camel,
  Tl as choicesOf,
  Sb as css,
  jb as default,
  Jp as fieldError,
  Tb as generateTypes,
  Vr as initMetadata,
  Up as isNullable,
  mt as isPlainObject,
  Jl as leafNameCounts,
  En as normalizePath,
  et as pascal,
  xo as propsOf,
  Vb as requirementText,
  xs as resolvePath,
  Qe as resolveSchema,
  ks as rowSchema,
  Gs as send,
  ll as singular,
  ta as snake,
  Hg as subtitle,
  Gl as toOp,
  Tt as typeOf,
  Mb as unwrapResponse,
  Za as useApiKey,
  cl as useAuth,
  Il as useClient,
  Ct as useConfig,
  mr as useFiles,
  Ga as useFormatters,
  gt as useMetadata,
  vo as useSchemas,
  no as useUtils,
  Dn as validateValue,
  ho as variantsOf,
  Qp as widgetOf
};
