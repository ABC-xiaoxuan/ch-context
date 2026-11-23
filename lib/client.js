window.__ModuleLoader__.load({id:"ch-context",factory:function(require){var module={exports:{}};var exports=module.exports;
"use strict";var Y=Object.defineProperty;var Me=Object.getOwnPropertyDescriptor;var Re=Object.getOwnPropertyNames;var ze=Object.prototype.hasOwnProperty;var Ae=(e,t)=>{for(var r in t)Y(e,r,{get:t[r],enumerable:!0})},Oe=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Re(t))!ze.call(e,i)&&i!==r&&Y(e,i,{get:()=>t[i],enumerable:!(o=Me(t,i))||o.enumerable});return e};var $e=e=>Oe(Y({},"__esModule",{value:!0}),e);var We={};Ae(We,{apply:()=>Ve,inject:()=>Be,name:()=>T});module.exports=$e(We);var K=require("react");var I=require("react");var me=require("react");var Xe=require("react"),A=require("react/jsx-runtime"),He=.5;function ce(e){let t=e.size??118,r=0;for(let c of e.segments)Number.isFinite(c.value)&&c.value>0&&(r+=c.value);let o=[],i=0;if(r>0)for(let c of e.segments){let l=Number.isFinite(c.value)&&c.value>0?c.value:0;if(l===0)continue;let p=l/r*100;o.push({key:c.key,color:c.color,len:p,offset:100-i+25}),i+=p}if(o.length>1)for(let c of o){let l=Math.min(He/2,c.len/4);c.len-=l*2,c.offset-=l}let n=e.hoverKey!==null&&e.hoverKey!==void 0&&o.some(c=>c.key===e.hoverKey);return(0,A.jsxs)("div",{className:"lc-donut @max-[240px]/lc-card:mx-auto"+(n?" lc-donut-dim":""),style:{width:t,height:t},onMouseLeave:()=>{e.onHoverKey!==void 0&&e.onHoverKey(null)},children:[(0,A.jsx)("svg",{viewBox:"0 0 42 42",width:t,height:t,"aria-hidden":"true",children:o.length===0?(0,A.jsx)("circle",{className:"lc-donut-track fill-none stroke-4",cx:"21",cy:"21",r:"15.9155"}):o.map((c,l)=>(0,A.jsx)("circle",{className:"lc-donut-seg fill-none stroke-4 animate-lc-donut-in motion-reduce:animate-none"+(e.hoverKey===c.key?" lc-donut-seg-on":""),cx:"21",cy:"21",r:"15.9155",strokeDasharray:`${c.len} ${100-c.len}`,strokeDashoffset:c.offset,style:{"--lc-i":l,stroke:c.color},onMouseEnter:()=>{e.onHoverKey!==void 0&&e.onHoverKey(c.key)}},c.key))}),(0,A.jsxs)("div",{className:"lc-donut-center",children:[(0,A.jsx)("b",{style:{fontSize:Math.max(11,Math.round(t*.13))},children:e.centerTop}),e.centerSub!==void 0?(0,A.jsx)("span",{style:{fontSize:Math.max(10,Math.round(t*.105))},children:e.centerSub}):null]})]})}function U(e){if(e==null||isNaN(e))return"\u2014";let t=e<0?"-":"",r=Math.abs(e);return r>=1e9?t+(r/1e9).toFixed(1)+"B":r>=1e6?t+(r/1e6).toFixed(1)+"M":r>=1e3?t+(r/1e3).toFixed(1)+"k":t+String(Math.round(r))}var Ue=new Intl.DateTimeFormat("en-GB",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function L(e){let t=new Date(e);return isNaN(t.getTime())?"\u2014":Ue.format(t)}var Ge=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function le(e){if(!Number.isFinite(e)||e<=0)return"\u2014";if(e<1e3)return`${Math.round(e)}ms`;if(e<6e4)return`${(e/1e3).toFixed(1)}s`;let t=Math.floor(e/1e3),r=Math.floor(t/60),o=t%60;return e<36e5?`${r}m${o}s`:`${Math.floor(r/60)}h${r%60}m`}function Q(e){return typeof e=="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e)}function z(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)?e:null}function D(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0?e:void 0}var de=["inputTokens","cachedInputTokens","cacheWriteInputTokens","outputTokens","totalTokens","reasoningOutputTokens","totalCostUsd","totalCredits","contextUsedTokens","contextWindowTokens","contextUsagePercent","cacheHitRatePercent","sessionCacheHitRatePercent","outputTokensPerSecond","sessionOutputTokensPerSecond","timeToFirstOutputMs","latestRequestTimeToFirstOutputMs"];function Z(e){let t=z(e),r=z(t?.usage);if(r===null)return null;let o={};for(let i of de){let n=D(r[i]);n!==void 0&&(o[i]=n)}return o.contextWindowTokens===0&&delete o.contextWindowTokens,(r.costSource==="publicPrice"||r.costSource==="native")&&(o.costSource=r.costSource),Array.isArray(r.unpricedModels)&&(o.unpricedModels=r.unpricedModels.filter(i=>typeof i=="string").slice(0,100)),de.some(i=>o[i]!==void 0)?o:null}function ee(e){let t=D(e?.contextUsedTokens),r=D(e?.contextWindowTokens),o=r===0?void 0:r,i=D(e?.contextUsagePercent)??(t!==void 0&&o!==void 0?t/o*100:void 0);return i===void 0?null:{percent:i,...t===void 0?{}:{used:t},...o===void 0?{}:{capacity:o}}}function te(e,t,r){let o=ee(t);if(o===null||!Number.isFinite(r))return[...e];let i=e.at(-1);return i?.percent===o.percent&&i.used===o.used&&i.capacity===o.capacity?[...e]:[...e,{time:r,...o}].slice(-120)}function pe(e,t=600,r=120){let o=e[0];if(o===void 0)return"";let i=Math.max(1,(e.at(-1)?.time??o.time)-o.time);return e.map((n,c)=>{let l=e.length===1?t/2:(n.time-o.time)/i*t,p=r-Math.min(100,n.percent)/100*r;return`${c===0?"M":"L"}${l.toFixed(2)},${p.toFixed(2)}`}).join(" ")}var je=new Intl.NumberFormat("en-US",{maximumFractionDigits:4});function ue(e){return`$${e>0&&e<1e-4?e.toPrecision(2):e.toFixed(e>=1?2:4)}`}function he(e){return e>0&&e<1e-4?"<0.0001":je.format(e)}var a=require("react/jsx-runtime");function j({size:e=20}){return(0,a.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M5 18V11M12 18V6M19 18V3",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),(0,a.jsx)("path",{d:"M3 21h18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}function E({label:e,value:t,suffix:r,detail:o,format:i}){return(0,a.jsxs)("div",{className:"ch-metric",children:[(0,a.jsx)("dt",{children:e}),(0,a.jsx)("dd",{title:t===void 0?void 0:String(t),children:t===void 0?"\u2014":i?i(t):r==="%"?`${t.toFixed(1)}%`:r==="ms"?t===0?"0ms":le(t):r==="tok/s"?`${t.toFixed(1)} ${r}`:U(t)}),o&&(0,a.jsx)("small",{children:o})]})}function $({title:e,aside:t,children:r,className:o=""}){return(0,a.jsxs)("section",{className:`ch-card ${o}`,children:[(0,a.jsxs)("header",{className:"ch-card-heading",children:[(0,a.jsx)("h2",{children:e}),t]}),r]})}function fe({usage:e,t}){let r=ee(e),o=r?.percent??0;return(0,a.jsxs)($,{title:t("context"),className:"ch-context-card",aside:(0,a.jsx)("span",{className:"ch-eyebrow",children:t("source")}),children:[(0,a.jsxs)("div",{className:"ch-occupancy-layout",children:[(0,a.jsxs)("div",{className:"ch-occupancy-number",children:[(0,a.jsx)("div",{className:"ch-eyebrow",children:t("occupancy")}),(0,a.jsxs)("strong",{children:[r?o.toFixed(1):"\u2014",r&&(0,a.jsx)("span",{children:"%"})]}),(0,a.jsx)("p",{children:r?`${U(r.used)} / ${U(r.capacity)} tokens`:t("unavailable")})]}),(0,a.jsx)(ce,{size:136,centerTop:r?`${Math.max(0,100-o).toFixed(0)}%`:"\u2014",centerSub:t("remaining"),segments:r?[{key:"used",value:Math.min(100,o),color:o>=85?"var(--ch-warning)":"var(--ch-accent)"},{key:"free",value:Math.max(0,100-o),color:"var(--ch-track)"}]:[]})]}),(0,a.jsxs)("dl",{className:"ch-context-values",children:[(0,a.jsx)(E,{label:t("used"),value:r?.used}),(0,a.jsx)(E,{label:t("capacity"),value:r?.capacity})]})]})}function ge({usage:e,t}){let r=(e?.unpricedModels?.length??0)>0;return(0,a.jsxs)($,{title:t("cumulative"),children:[(0,a.jsxs)("dl",{className:"ch-metrics",children:[(0,a.jsx)(E,{label:t("input"),value:e?.inputTokens}),(0,a.jsx)(E,{label:t("output"),value:e?.outputTokens}),(0,a.jsx)(E,{label:t("cacheRead"),value:e?.cachedInputTokens}),(0,a.jsx)(E,{label:t("cacheWrite"),value:e?.cacheWriteInputTokens})]}),(0,a.jsxs)("div",{className:"ch-cost",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{children:t("cost")}),(0,a.jsx)("strong",{children:e?.totalCostUsd===void 0?"\u2014":`${r?"\u2265 ":""}${ue(e.totalCostUsd)}`}),(0,a.jsx)("small",{children:e?.totalCostUsd===void 0?t("unavailable"):t(e.costSource==="native"?"costNative":e.costSource==="publicPrice"?"costEstimate":"source")})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{children:t("total")}),(0,a.jsx)("strong",{title:e?.totalTokens===void 0?void 0:String(e.totalTokens),children:U(e?.totalTokens)}),(0,a.jsx)("small",{children:"tokens"})]})]}),r&&(0,a.jsx)("p",{className:"ch-note",children:t("partialPrice")})]})}function xe({usage:e,t}){return(0,a.jsx)($,{title:t("performance"),children:(0,a.jsxs)("dl",{className:"ch-performance",children:[(0,a.jsx)(E,{label:t("tps"),value:e?.outputTokensPerSecond,suffix:"tok/s"}),(0,a.jsx)(E,{label:t("avgTps"),value:e?.sessionOutputTokensPerSecond,suffix:"tok/s"}),(0,a.jsx)(E,{label:t("ttft"),value:e?.latestRequestTimeToFirstOutputMs??e?.timeToFirstOutputMs,suffix:"ms"}),(0,a.jsx)(E,{label:t("cacheHit"),value:e?.cacheHitRatePercent,suffix:"%"}),(0,a.jsx)(E,{label:t("avgCache"),value:e?.sessionCacheHitRatePercent,suffix:"%"}),(0,a.jsx)(E,{label:t("credits"),value:e?.totalCredits,format:he})]})})}function be({samples:e,t}){let r=pe(e);return(0,a.jsxs)($,{title:t("timeline"),aside:(0,a.jsxs)("span",{className:"ch-count",children:[t("observed")," \xB7 ",e.length]}),children:[(0,a.jsxs)("div",{className:"ch-chart",role:"img","aria-label":t("sampled"),children:[(0,a.jsxs)("div",{className:"ch-chart-axis",children:[(0,a.jsx)("span",{children:"100%"}),(0,a.jsx)("span",{children:"50%"}),(0,a.jsx)("span",{children:"0%"})]}),(0,a.jsxs)("svg",{viewBox:"0 0 600 120",preserveAspectRatio:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M0 0H600 M0 60H600 M0 120H600",className:"ch-chart-grid"}),e.length>0&&(0,a.jsx)("path",{d:r,className:"ch-chart-line"}),e.length===1&&(0,a.jsx)("circle",{cx:"300",cy:120-Math.min(100,e[0].percent)/100*120,r:"3",className:"ch-chart-dot"})]})]}),(0,a.jsxs)("div",{className:"ch-chart-times",children:[(0,a.jsx)("span",{children:e[0]?L(e[0].time):"\u2014"}),(0,a.jsx)("span",{children:e.length<2?t("needSamples"):L(e[e.length-1].time)})]}),(0,a.jsxs)("p",{className:"ch-note",children:[t("timelineNote")," ",(0,a.jsx)("span",{title:t("retained"),children:"\u24D8"})]})]})}function ve({items:e,t}){let[r,o]=(0,me.useState)("all"),i=e.filter(n=>r==="all"||(r==="messages"?n.kind==="user"||n.kind==="assistant":n.kind===r));return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"ch-filter",role:"group","aria-label":t("history"),children:[["all","messages","tool","event"].map(n=>(0,a.jsx)("button",{className:r===n?"is-active":"","aria-pressed":r===n,onClick:()=>o(n),children:t(n==="tool"?"tools":n==="event"?"events":n)},n)),(0,a.jsxs)("span",{className:"ch-count",children:[i.length," ",t("count")]})]}),i.length===0?(0,a.jsx)("p",{className:"ch-note ch-empty-inline",children:t("noHistory")}):(0,a.jsx)("div",{className:"ch-history",children:i.map(n=>(0,a.jsxs)("details",{className:`ch-record ch-record-${n.kind}`,children:[(0,a.jsxs)("summary",{children:[(0,a.jsx)("span",{className:"ch-role",children:t(n.kind)}),(0,a.jsx)("span",{className:"ch-record-title",children:n.kind==="user"||n.kind==="assistant"?n.text.replace(/\s+/g," ").slice(0,180)||t(n.kind):n.title||t(n.kind)}),(n.clipped||n.contentUnavailable)&&(0,a.jsx)("span",{className:"ch-record-badge",children:t(n.clipped?"previewShort":"partialShort")}),(0,a.jsx)("span",{className:"ch-record-time",children:n.time?L(n.time):`#${n.seq}`})]}),n.hostPreview&&(0,a.jsx)("p",{className:"ch-note ch-record-notice",children:t("hostPreview")}),n.textTruncated&&(0,a.jsx)("p",{className:"ch-note ch-record-notice",children:t("textTruncated")}),n.contentUnavailable&&(0,a.jsx)("p",{className:"ch-note ch-record-notice",children:t("contentUnavailable")}),n.text&&(0,a.jsx)("pre",{children:n.text})]},n.id))})]})}var g=require("react");var Fe=0;function f(e,t){if(e===null||typeof e!="object"||Array.isArray(e))throw new Error(`Invalid ${t}: expected an object`);return e}function H(e,t){if(typeof e!="string")throw new Error(`Invalid ${t}: expected a string`);return e}function O(e,t){let r=H(e,t);if(!r.trim())throw new Error(`Invalid ${t}: expected a nonempty identity`);return r}function F(e,t){if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw new Error(`Invalid ${t}: expected a nonnegative safe integer`);return e}function _(e,t){return e==null?void 0:H(e,t)}function ye(e,t){if(e!=null){if(typeof e!="number"||!Number.isFinite(e))throw new Error(`Invalid ${t}: expected a finite number`);return e}}function ne(e){if(!e||typeof e!="object"||Array.isArray(e))return;let t=e,r=typeof t.code=="string"||typeof t.code=="number"?` (${String(t.code).slice(0,120)})`:"";return typeof t.message=="string"?`${t.message.slice(0,500)}${r}`:void 0}function qe(e){let t=f(e,"session row"),r=f(t.projections,"session projections"),o=f(r.values,"session projection values"),i=o.harnessIdentity==null?void 0:_(f(o.harnessIdentity,"harness identity").id,"harness id"),n=_(t.cwd,"session cwd"),c=ye(t.updatedAt,"session updatedAt"),l=_(t.parentSessionId,"parent session id");return{id:O(t.sessionId,"session id"),title:_(o.title,"session title")??"",...i===void 0?{}:{harness:i},...n===void 0?{}:{cwd:n},...c===void 0?{}:{updatedAt:c},...l===void 0?{}:{parentId:l}}}function Le(e,t){let r=f(e,"history record");if(r.type!=="event")throw new Error("Invalid history record: expected an event");let o=f(r.event,"history event");if(o.sessionId!==void 0&&o.sessionId!==t)throw new Error("Invalid history event: session identity mismatch");let i=F(o.seq,"history sequence"),n=O(o.type,"history event type"),c=f(o.data,"history event data"),l=ye(o.time,"history time"),p="event",m=n,d="",u=!1,v=!1,x=!1,b=!1;if(n==="tool/result"&&c.meta!=null){let N=f(c.meta,"tool result metadata");if(N.codexhostOutput!==void 0){if(!Array.isArray(N.codexhostOutput))throw new Error("Invalid tool output previews");for(let C of N.codexhostOutput){let P=f(C,"tool output preview"),S=f(P.reference,"tool output reference");if(S.sessionId!==t||S.seq!==i)throw new Error("Invalid tool output reference: identity mismatch");u=!0,v=!0,b=!0}}}let k=N=>{let C=d.length>0?`
`:"",P=8e3-d.length,S=C+N;S.length>P&&(u=!0,x=!0),d+=S.slice(0,P)};if(n==="user/message"||n==="assistant/message"||n==="tool/result"){p=n==="user/message"?"user":n==="assistant/message"?"assistant":"tool";let N=n==="user/message"?c:f(c.message,"history message");if(m=n==="tool/result"?"tool/result":p,!Array.isArray(N.content))throw new Error("Invalid history message: expected content blocks");for(let C of N.content){let P=f(C,"history content block"),S=O(P.type,"history content type");S==="text"||S==="reasoning"?k(H(P.text,"history content text")):S==="tool-call"?k(`${O(P.name,"tool name")}
${H(P.arguments,"tool arguments")}`):b=!0}}else n==="tool/call"?(p="tool",m=O(c.name,"tool name"),k(H(c.arguments,"tool arguments"))):k(JSON.stringify(c));return{id:JSON.stringify([t,i]),kind:p,title:m,text:d,seq:i,...l===void 0?{}:{time:l},...u?{clipped:!0}:{},...v?{hostPreview:!0}:{},...x?{textTruncated:!0}:{},...b?{contentUnavailable:!0}:{}}}var B=class{fetcher;constructor(t=globalThis.fetch.bind(globalThis)){this.fetcher=t}async post(t,r,o){o.throwIfAborted();let i;try{i=await this.fetcher(t,{method:"POST",credentials:"same-origin",mode:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:o})}catch(l){throw o.throwIfAborted(),l instanceof Error&&l.name==="AbortError"?l:new Error(`${t}: request failed: ${l instanceof Error?l.message:"network unavailable"}`)}o.throwIfAborted();let n;try{n=await i.json()}catch(l){throw o.throwIfAborted(),l instanceof Error&&l.name==="AbortError"?l:new Error(`${t}: ${i.ok?"":`HTTP ${i.status}; `}invalid JSON response`)}if(o.throwIfAborted(),!i.ok){let l=n!==null&&typeof n=="object"&&!Array.isArray(n)?ne(n.error):void 0;throw new Error(`${t}: HTTP ${i.status}: ${l??"request rejected"}`)}let c=f(n,`${t} response envelope`);if(Object.hasOwn(c,"error"))throw new Error(`${t}: ${ne(c.error)??"request rejected"}`);return c}async sessionRpc(t,r,o){let i=`ch-context-${++Fe}`,n=await this.post(`api/${t}`,{type:"client-request",rpcId:i,method:t,payload:{args:r}},o);return this.sessionResult(n,i,t)}async listSessions(t,r){t!==null&&H(t,"session cursor");let o=f(await this.sessionRpc("session/list",t===null?{}:{cursor:t},r),"session page");if(!Array.isArray(o.items))throw new Error("Invalid session page: expected items");if(o.nextCursor!==null&&typeof o.nextCursor!="string")throw new Error("Invalid session page: expected a string or null nextCursor");if(t!==null&&o.nextCursor===t)throw new Error("Invalid session page: cursor did not advance");let i=o.items.map(qe);if(new Set(i.map(n=>n.id)).size!==i.length)throw new Error("Invalid session page: repeated session identity");return{items:i,nextCursor:o.nextCursor}}sessionResult(t,r,o){if(t.type!=="server-response"||t.rpcId!==r)throw new Error(`${o}: response identity mismatch`);let i=f(t.result,`${o} result`);if(i.ok===!1)throw new Error(`${o}: ${ne(i.error)??"request rejected"}`);if(i.ok!==!0||!Object.hasOwn(i,"value")||Object.hasOwn(i,"error"))throw new Error(`${o}: invalid result envelope`);return i.value}async inspectUsage(t,r){O(t,"thread id");let o=await this.post("api/ch/v1/rpc",{method:"codexhost/thread/usage/inspect",params:{threadId:t}},r),i=f(o.result,"usage result");if(i.threadId!==t)throw new Error("Invalid usage result: thread identity mismatch");if(!Object.hasOwn(i,"usage")||i.usage!==null&&(typeof i.usage!="object"||Array.isArray(i.usage)))throw new Error("Invalid usage result: expected a usage snapshot or null");return i}async history(t,r,o,i){if(O(t,"session id"),o!==void 0&&(F(o,"beforeSeq"),i===void 0))throw new Error("throughSeq is required when beforeSeq is provided");if(i===void 0){let u=f(await this.sessionRpc("session/projections",{sessionId:t},r),"projection baseline");f(u.values,"projection baseline values"),i=F(u.asOfSeq,"projection baseline asOfSeq")}else F(i,"throughSeq");if(o!==void 0&&o>i+1)throw new Error("Invalid history boundary: beforeSeq exceeds throughSeq");let n=f(await this.sessionRpc("session/page",{address:{sessionId:t},throughSeq:i,maxMessages:50,...o===void 0?{}:{beforeSeq:o}},r),"history page");if(!Array.isArray(n.records)||typeof n.hasMore!="boolean")throw new Error("Invalid history page: expected records and hasMore");let c=-1;for(let u of n.records){let v=f(u,"history record");if(v.type!=="event")throw new Error("Invalid history record: expected an event");let x=f(v.event,"history event"),b=F(x.seq,"history sequence");if(b<=c||b>i||o!==void 0&&b>=o)throw new Error("Invalid history page: unordered, repeated or out-of-window sequence");c=b}if(n.hasMore&&(n.records.length===0||c===0))throw new Error("Invalid history page: pagination did not advance");let l=n.records.length>200,p=n.records.slice(-200).map(u=>Le(u,t)),m=n.hasMore||l,d=p[0];if(m&&(!d||d.seq===0))throw new Error("Invalid history page: no earlier sequence is available");return{items:p,...d===void 0?{}:{beforeSeq:d.seq},hasMore:m,throughSeq:i,...l||p.some(u=>u.clipped)?{clipped:!0}:{},...p.some(u=>u.contentUnavailable)?{contentUnavailable:!0}:{}}}};function De(e,t){let r=z(e);return r?.type!=="changed"||typeof r.threadId=="string"&&r.threadId!==t?!1:typeof r.method=="string"&&["codexhost/thread/usage/updated","thread/tokenUsage/updated","thread/updated"].includes(r.method)}function we(e,t,r,o=fetch){let i=new AbortController,n,c=0,l=async()=>{try{let p=await o("api/ch/v1/events",{credentials:"same-origin",signal:i.signal});if(!p.ok||p.body===null)throw new Error("Events unavailable");if(i.signal.aborted)return;r(!0),c=0;let m=p.body.getReader(),d=new TextDecoder,u="";try{for(;!i.signal.aborted;){let v=await m.read();if(v.done)break;if(u+=d.decode(v.value,{stream:!0}),u.length>1024*1024)throw new Error("Event frame too large");let x;for(;(x=u.indexOf(`
`))!==-1;){let b=u.slice(0,x).trim();if(u=u.slice(x+1),!!b)try{De(JSON.parse(b),e)&&t()}catch{continue}}}}finally{await m.cancel().catch(()=>{}),m.releaseLock()}}catch{if(i.signal.aborted)return}i.signal.aborted||(r(!1),n=setTimeout(()=>{l()},Math.min(15e3,1e3*2**c++)))};return l(),()=>{i.abort(),n!==void 0&&clearTimeout(n)}}var re=new B,ke=()=>()=>{};function Ne(e){let t=(0,g.useCallback)(o=>e.locale.subscribe?.(o)??ke(),[e]),r=(0,g.useCallback)(()=>e.locale.getLocale?.().active??"en",[e]);return(0,g.useSyncExternalStore)(t,r,r)}function Te(e){let t=z(e.get("uiSession")),o=z(t?.adapter)?.current,i=(0,g.useCallback)(c=>o?.subscribe(c)??ke(),[o]),n=(0,g.useCallback)(()=>{let c=z(o?.getSnapshot())?.key;return typeof c=="string"?c:void 0},[o]);return(0,g.useSyncExternalStore)(i,n,n)}function Ce(e,t){let[r,o]=(0,g.useState)({key:"",page:null,loading:!0,error:null}),i=`${e??""}:${t}`;return(0,g.useEffect)(()=>{let n=new AbortController;return o({key:i,page:null,loading:!0,error:null}),re.listSessions(e,n.signal).then(c=>{n.signal.aborted||o({key:i,page:c,loading:!1,error:null})}).catch(c=>{n.signal.aborted||o({key:i,page:null,loading:!1,error:String(c instanceof Error?c.message:c)})}),()=>n.abort()},[e,i]),r.key===i?r:{page:null,loading:!0,error:null}}function Se(e,t,r){let o=(0,g.useRef)({id:e,projection:t,generation:0});(o.current.id!==e||o.current.projection!==t)&&(o.current={id:e,projection:t,generation:o.current.generation+1});let[i,n]=(0,g.useState)({id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null});return(0,g.useEffect)(()=>{if(t===void 0||!e)return;let c=Z(t),l=Date.now();n(p=>({id:e,usage:c,loading:!1,error:null,connected:!0,samples:te(p.id===e?p.samples:[],c,l),updatedAt:l}))},[e,t]),(0,g.useEffect)(()=>{let c=new AbortController,l,p=!1,m=!1,d=async()=>{if(!e||c.signal.aborted)return;if(p){m=!0;return}p=!0;let v=o.current.generation,x=()=>!c.signal.aborted&&o.current.generation===v;try{let b=await re.inspectUsage(e,c.signal);if(!x())return;let k=Z(b),N=Date.now();n(C=>x()?{id:e,usage:k,loading:!1,error:null,connected:!0,samples:te(C.id===e?C.samples:[],k,N),updatedAt:N}:C)}catch(b){x()&&n(k=>x()?{...k.id===e?k:{id:e,usage:null,connected:!1,samples:[],updatedAt:null},loading:!1,error:String(b instanceof Error?b.message:b)}:k)}finally{p=!1,m&&!c.signal.aborted&&(m=!1,d())}};(t===void 0||r>0)&&(n(v=>v.id===e?{...v,loading:!!e,error:null}:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null}),d());let u=e&&t===void 0?we(e,()=>{l!==void 0&&clearTimeout(l),l=setTimeout(()=>{d()},150)},v=>{c.signal.aborted||n(x=>x.id===e?{...x,connected:v}:x),v&&d()}):void 0;return()=>{c.abort(),u?.(),l!==void 0&&clearTimeout(l)}},[e,t===void 0,r]),i.id===e?i:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null}}function Ee(e,t){let[r,o]=(0,g.useState)(null),i=r&&r.id===e&&r.revision===t?r.before:void 0,n=i!==void 0?r?.through:void 0,[c,l]=(0,g.useState)({page:null,loading:!1,error:null});(0,g.useEffect)(()=>{if(!e)return;let m=new AbortController;return l(d=>({id:e,page:d.id===e?d.page:null,loading:!0,error:null})),re.history(e,m.signal,i,n).then(d=>{m.signal.aborted||l({id:e,page:d,loading:!1,error:null})}).catch(d=>{m.signal.aborted||l(u=>({id:e,page:u.id===e?u.page:null,loading:!1,error:String(d instanceof Error?d.message:d)}))}),()=>m.abort()},[e,i,n,t]);let p=c.id===e?c:{page:null,loading:!!e,error:null};return{...p,older:()=>{e&&p.page?.beforeSeq!==void 0&&o({id:e,revision:t,before:p.page.beforeSeq,through:p.page.throughSeq})}}}var oe={title:"Context insights",subtitle:"A clearer view of your conversation.",tab:"Context",sessions:"Conversations",search:"Search this page",next:"Next page",previous:"Previous page",refresh:"Refresh",loading:"Loading\u2026",noSession:"Choose a conversation",choose:"Select a conversation to inspect the context and usage reported by its Harness.",unavailable:"Not reported",noUsage:"This Harness has not reported usage for this conversation yet.",context:"Current context",used:"Used tokens",capacity:"Window capacity",remaining:"Remaining capacity",occupancy:"Context occupancy",cumulative:"Cumulative usage",input:"Input tokens",output:"Output tokens",cacheRead:"Cache read",cacheWrite:"Cache write",total:"Total tokens",cost:"Session cost",costEstimate:"Public-price estimate",costNative:"Native cost",partialPrice:"Some models are unpriced; this is a lower bound.",performance:"Performance & cache",tps:"Output speed",avgTps:"Average output speed",ttft:"Time to first output",cacheHit:"Latest cache hit",avgCache:"Average cache hit",credits:"AI credits",timeline:"Context observations",timelineNote:"Changes observed while this panel is open. This is not the complete request history.",needSamples:"The next context change will appear here.",observed:"Samples",history:"Messages & tools",all:"All",messages:"Messages",tools:"Tools",events:"Events",historyNote:"Conversation records are not the exact model request body.",noHistory:"No records in this history window.",older:"Load older records",historyLoading:"Reading history\u2026",historyError:"History could not be loaded.",retry:"Retry",copy:"Copy usage JSON",copied:"Copied",copyFailed:"Copy failed",source:"Reported by CodexHost",live:"Live",disconnected:"Reconnecting",limits:"Detailed context composition",limitsNote:"The Host does not expose separate system-prompt, tool-definition and message token counts. No breakdown is estimated.",readOnly:"Read-only \xB7 no prompts or settings are modified",emptyList:"No conversations on this page.",usageError:"Usage could not be loaded.",listError:"Conversations could not be loaded.",titleShort:"CH Context",settingsNote:"Open Context insights from the sidebar, or the Context tab inside a conversation.",localOnly:"Snapshots are read from this CodexHost instance. No conversation data is sent to a third-party service.",user:"You",assistant:"Assistant",tool:"Tool",event:"Event",date:"Updated",page:"Page",loadedSearch:"Search applies to this page.",following:"Current conversation",sampled:"Observed context",retained:"Up to 120 changed snapshots are retained in memory for the selected conversation.",details:"Show details",hideDetails:"Hide details",errorBoundary:"This panel could not render the available data.",count:"records",previewShort:"Preview",partialShort:"Partial",hostPreview:"The Host supplied a preview; the complete tool output is not included.",textTruncated:"Text shortened to 8,000 characters in this view.",contentUnavailable:"Some content is unavailable in this view, including unsupported media or omitted output.",clipped:"Long records may contain only the Host-provided preview."},ie={title:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF",subtitle:"\u770B\u6E05\u6BCF\u6BB5\u5BF9\u8BDD\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",tab:"\u4E0A\u4E0B\u6587",sessions:"\u4F1A\u8BDD",search:"\u641C\u7D22\u5F53\u524D\u9875\u4F1A\u8BDD",next:"\u4E0B\u4E00\u9875",previous:"\u4E0A\u4E00\u9875",refresh:"\u5237\u65B0",loading:"\u52A0\u8F7D\u4E2D\u2026",noSession:"\u9009\u62E9\u4E00\u4E2A\u4F1A\u8BDD",choose:"\u9009\u62E9\u4F1A\u8BDD\uFF0C\u67E5\u770B\u5176 Harness \u4E0A\u62A5\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",unavailable:"\u672A\u4E0A\u62A5",noUsage:"\u6B64 Harness \u5C1A\u672A\u4E0A\u62A5\u8BE5\u4F1A\u8BDD\u7684\u7528\u91CF\u3002",context:"\u5F53\u524D\u4E0A\u4E0B\u6587",used:"\u5DF2\u7528 Token",capacity:"\u7A97\u53E3\u5BB9\u91CF",remaining:"\u5269\u4F59\u5BB9\u91CF",occupancy:"\u4E0A\u4E0B\u6587\u5360\u7528",cumulative:"\u7D2F\u8BA1\u7528\u91CF",input:"\u8F93\u5165 Token",output:"\u8F93\u51FA Token",cacheRead:"\u7F13\u5B58\u8BFB\u53D6",cacheWrite:"\u7F13\u5B58\u5199\u5165",total:"\u603B Token",cost:"\u4F1A\u8BDD\u8D39\u7528",costEstimate:"\u6309\u516C\u5F00\u4EF7\u683C\u4F30\u7B97",costNative:"\u539F\u751F\u8D39\u7528",partialPrice:"\u90E8\u5206\u6A21\u578B\u5C1A\u672A\u5B9A\u4EF7\uFF0C\u6B64\u91D1\u989D\u4E3A\u4E0B\u9650\u3002",performance:"\u6027\u80FD\u4E0E\u7F13\u5B58",tps:"\u8F93\u51FA\u901F\u5EA6",avgTps:"\u5E73\u5747\u8F93\u51FA\u901F\u5EA6",ttft:"\u9996\u4E2A\u8F93\u51FA\u5EF6\u8FDF",cacheHit:"\u6700\u8FD1\u7F13\u5B58\u547D\u4E2D",avgCache:"\u5E73\u5747\u7F13\u5B58\u547D\u4E2D",credits:"AI Credits",timeline:"\u4E0A\u4E0B\u6587\u89C2\u6D4B",timelineNote:"\u4EC5\u8BB0\u5F55\u9762\u677F\u6253\u5F00\u671F\u95F4\u7684\u53D8\u5316\uFF0C\u4E0D\u4EE3\u8868\u5B8C\u6574\u8BF7\u6C42\u5386\u53F2\u3002",needSamples:"\u4E0B\u4E00\u6B21\u4E0A\u4E0B\u6587\u53D8\u5316\u5C06\u5728\u6B64\u663E\u793A\u3002",observed:"\u89C2\u6D4B\u5FEB\u7167",history:"\u6D88\u606F\u4E0E\u5DE5\u5177",all:"\u5168\u90E8",messages:"\u6D88\u606F",tools:"\u5DE5\u5177",events:"\u4E8B\u4EF6",historyNote:"\u4F1A\u8BDD\u8BB0\u5F55\u4E0D\u7B49\u540C\u4E8E\u6A21\u578B\u5B9E\u9645\u6536\u5230\u7684\u5B8C\u6574\u8BF7\u6C42\u3002",noHistory:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u8BB0\u5F55\u3002",older:"\u52A0\u8F7D\u66F4\u65E9\u8BB0\u5F55",historyLoading:"\u6B63\u5728\u8BFB\u53D6\u5386\u53F2\u2026",historyError:"\u5386\u53F2\u52A0\u8F7D\u5931\u8D25\u3002",retry:"\u91CD\u8BD5",copy:"\u590D\u5236\u7528\u91CF JSON",copied:"\u5DF2\u590D\u5236",copyFailed:"\u590D\u5236\u5931\u8D25",source:"\u7531 CodexHost \u4E0A\u62A5",live:"\u5B9E\u65F6\u66F4\u65B0",disconnected:"\u6B63\u5728\u91CD\u8FDE",limits:"\u8BE6\u7EC6\u4E0A\u4E0B\u6587\u7EC4\u6210",limitsNote:"\u5BBF\u4E3B\u5C1A\u672A\u63D0\u4F9B\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3001\u5DE5\u5177\u5B9A\u4E49\u4E0E\u6D88\u606F\u5404\u81EA\u7684 Token \u6570\u91CF\uFF0C\u6B64\u5904\u4E0D\u4F30\u7B97\u62C6\u5206\u3002",readOnly:"\u53EA\u8BFB \xB7 \u4E0D\u4FEE\u6539\u63D0\u793A\u8BCD\u6216\u8BBE\u7F6E",emptyList:"\u5F53\u524D\u9875\u6CA1\u6709\u4F1A\u8BDD\u3002",usageError:"\u7528\u91CF\u52A0\u8F7D\u5931\u8D25\u3002",listError:"\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25\u3002",titleShort:"CH Context",settingsNote:"\u4ECE\u4FA7\u680F\u6253\u5F00\u300C\u4E0A\u4E0B\u6587\u6D1E\u5BDF\u300D\uFF0C\u6216\u8FDB\u5165\u4F1A\u8BDD\u5185\u7684\u300C\u4E0A\u4E0B\u6587\u300D\u9875\u7B7E\u3002",localOnly:"\u6570\u636E\u8BFB\u53D6\u81EA\u5F53\u524D CodexHost \u5B9E\u4F8B\uFF0C\u4E0D\u5411\u7B2C\u4E09\u65B9\u670D\u52A1\u53D1\u9001\u4F1A\u8BDD\u5185\u5BB9\u3002",user:"\u7528\u6237",assistant:"\u52A9\u624B",tool:"\u5DE5\u5177",event:"\u4E8B\u4EF6",date:"\u66F4\u65B0\u65F6\u95F4",page:"\u7B2C",loadedSearch:"\u641C\u7D22\u8303\u56F4\u4E3A\u5F53\u524D\u9875\u3002",following:"\u5F53\u524D\u4F1A\u8BDD",sampled:"\u4E0A\u4E0B\u6587\u89C2\u6D4B\u503C",retained:"\u4EC5\u5728\u5185\u5B58\u4E2D\u4FDD\u7559\u6240\u9009\u4F1A\u8BDD\u6700\u8FD1 120 \u6B21\u53D8\u5316\u5FEB\u7167\u3002",details:"\u663E\u793A\u8BE6\u60C5",hideDetails:"\u6536\u8D77\u8BE6\u60C5",errorBoundary:"\u9762\u677F\u65E0\u6CD5\u663E\u793A\u5F53\u524D\u6570\u636E\u3002",count:"\u6761\u8BB0\u5F55",previewShort:"\u9884\u89C8",partialShort:"\u90E8\u5206\u5185\u5BB9",hostPreview:"\u5BBF\u4E3B\u4EC5\u63D0\u4F9B\u9884\u89C8\uFF0C\u672A\u5305\u542B\u5B8C\u6574\u5DE5\u5177\u8F93\u51FA\u3002",textTruncated:"\u5F53\u524D\u89C6\u56FE\u4E2D\u7684\u6587\u672C\u5DF2\u622A\u53D6\u81F3 8,000 \u4E2A\u5B57\u7B26\u3002",contentUnavailable:"\u6B64\u89C6\u56FE\u65E0\u6CD5\u663E\u793A\u90E8\u5206\u5185\u5BB9\uFF0C\u4F8B\u5982\u672A\u652F\u6301\u7684\u5A92\u4F53\u6216\u7701\u7565\u7684\u8F93\u51FA\u3002",clipped:"\u8F83\u957F\u8BB0\u5F55\u53EF\u80FD\u4EC5\u5305\u542B\u5BBF\u4E3B\u63D0\u4F9B\u7684\u9884\u89C8\u3002"};function V(e){let t=e.toLowerCase().startsWith("zh")?ie:oe;return r=>t[r]}var s=require("react/jsx-runtime");function se({ctx:e,sessionId:t,projection:r,embedded:o=!1}){let i=Ne(e),n=(0,I.useMemo)(()=>V(i),[i]),c=Te(e),[l,p]=(0,I.useState)(),m=t??l??c,d=Q(m)?m:void 0,[u,v]=(0,I.useState)(0),[x,b]=(0,I.useState)([null]),[k,N]=(0,I.useState)(0),[C,P]=(0,I.useState)(""),[S,X]=(0,I.useState)("idle"),M=Ce(x[k]??null,u),w=Se(d,r,u),R=Ee(d,u),J=M.page?.items.find(h=>h.id===d),ae=(M.page?.items??[]).filter(h=>Q(h.id)&&`${h.title} ${h.harness??""} ${h.cwd??""}`.toLocaleLowerCase().includes(C.toLocaleLowerCase()));(0,I.useEffect)(()=>{X("idle")},[d]);let q=()=>v(h=>h+1),Ie=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({threadId:d,observedAt:w.updatedAt,usage:w.usage},null,2)),X("done")}catch{X("failed")}};return(0,s.jsx)("div",{className:`ch-context ${o?"ch-embedded":""}`,lang:i.startsWith("zh")?"zh-CN":"en",children:(0,s.jsxs)("div",{className:"ch-shell",children:[(0,s.jsxs)("header",{className:"ch-page-heading",children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"ch-brand",children:[(0,s.jsx)(j,{size:16}),(0,s.jsx)("span",{children:"CH CONTEXT"}),(0,s.jsx)("span",{className:"ch-version",children:"0.1.0"})]}),(0,s.jsx)("h1",{children:n("title")}),(0,s.jsx)("p",{children:n("subtitle")})]}),(0,s.jsxs)("div",{className:"ch-heading-actions",children:[(0,s.jsxs)("span",{className:`ch-status ${w.connected?"":"is-offline"}`,children:[(0,s.jsx)("i",{}),n(w.connected?"live":"disconnected")]}),(0,s.jsx)("button",{className:"ch-button",onClick:q,disabled:w.loading||M.loading,children:n(w.loading?"loading":"refresh")})]})]}),!o&&(0,s.jsxs)("section",{className:"ch-session-picker","aria-label":n("sessions"),children:[(0,s.jsxs)("div",{className:"ch-picker-header",children:[(0,s.jsx)("h2",{children:n("sessions")}),(0,s.jsxs)("label",{className:"ch-search",children:[(0,s.jsx)("span",{"aria-hidden":"true",children:"\u2315"}),(0,s.jsx)("input",{value:C,onChange:h=>P(h.target.value),placeholder:n("search"),"aria-label":n("search")})]}),c&&(0,s.jsx)("button",{className:"ch-button ch-button-subtle",onClick:()=>p(void 0),children:n("following")})]}),M.error?(0,s.jsxs)("div",{className:"ch-error",role:"alert",children:[n("listError")," ",(0,s.jsx)("span",{children:M.error}),(0,s.jsx)("button",{className:"ch-button",onClick:q,children:n("retry")})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{className:"ch-session-list",role:"list",children:M.loading?(0,s.jsx)("div",{className:"ch-skeleton ch-session-skeleton","aria-label":n("loading")}):ae.length===0?(0,s.jsx)("p",{className:"ch-note",children:n("emptyList")}):ae.map(h=>(0,s.jsx)("div",{role:"listitem",children:(0,s.jsxs)("button",{className:`ch-session ${d===h.id?"is-selected":""}`,"aria-pressed":d===h.id,title:h.title,onClick:()=>p(h.id),children:[(0,s.jsx)("span",{className:"ch-session-marker"}),(0,s.jsxs)("span",{className:"ch-session-title",children:[h.title||h.id,(0,s.jsxs)("small",{title:h.cwd,children:[h.harness??"CodexHost",h.cwd?` \xB7 ${h.cwd.split(/[\\/]/).filter(Boolean).at(-1)}`:""]})]}),(0,s.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})},h.id))}),(0,s.jsxs)("div",{className:"ch-pagination",children:[(0,s.jsx)("small",{children:n("loadedSearch")}),(0,s.jsxs)("div",{children:[(0,s.jsx)("button",{className:"ch-button ch-button-subtle",disabled:k===0||M.loading,onClick:()=>N(h=>Math.max(0,h-1)),children:n("previous")}),(0,s.jsxs)("span",{children:[n("page")," ",k+1]}),(0,s.jsx)("button",{className:"ch-button ch-button-subtle",disabled:!M.page?.nextCursor||M.loading,onClick:()=>{let h=M.page?.nextCursor;h&&(b(G=>[...G.slice(0,k+1),h]),N(G=>G+1))},children:n("next")})]})]})]})]}),d?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"ch-selected-header",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"ch-eyebrow",children:J?.harness??"CodexHost"}),(0,s.jsx)("h2",{title:J?.title??d,children:J?.title??d})]}),(0,s.jsx)("button",{className:"ch-button ch-button-subtle",disabled:!w.usage,onClick:()=>{Ie()},children:n(S==="done"?"copied":S==="failed"?"copyFailed":"copy")})]}),w.error&&(0,s.jsxs)("div",{className:"ch-error",role:"alert",children:[n("usageError"),(0,s.jsx)("span",{children:w.error}),(0,s.jsx)("button",{className:"ch-button",onClick:q,children:n("retry")})]}),w.loading&&!w.usage?(0,s.jsxs)("div",{className:"ch-dashboard ch-loading","aria-busy":"true","aria-label":n("loading"),children:[(0,s.jsx)("div",{className:"ch-card ch-skeleton"}),(0,s.jsx)("div",{className:"ch-card ch-skeleton"})]}):(0,s.jsxs)(s.Fragment,{children:[!w.usage&&!w.error&&(0,s.jsx)("p",{className:"ch-note ch-availability",children:n("noUsage")}),(0,s.jsxs)("div",{className:"ch-dashboard",children:[(0,s.jsx)(fe,{usage:w.usage,t:n}),(0,s.jsx)(ge,{usage:w.usage,t:n})]}),(0,s.jsx)(xe,{usage:w.usage,t:n}),(0,s.jsx)(be,{samples:w.samples,t:n})]}),(0,s.jsxs)($,{title:n("history"),aside:(0,s.jsx)("span",{className:"ch-eyebrow",children:n("readOnly")}),children:[(0,s.jsxs)("p",{className:"ch-note",children:[n("historyNote")," ",n("clipped")]}),R.error&&(0,s.jsxs)("div",{className:"ch-error",role:"alert",children:[n("historyError"),(0,s.jsx)("span",{children:R.error}),(0,s.jsx)("button",{className:"ch-button",onClick:q,children:n("retry")})]}),R.loading&&!R.page?(0,s.jsx)("div",{className:"ch-skeleton ch-history-skeleton","aria-label":n("historyLoading")}):R.page&&(0,s.jsx)(ve,{items:R.page.items,t:n},d),R.page?.hasMore&&(0,s.jsx)("div",{className:"ch-history-footer",children:(0,s.jsx)("button",{className:"ch-button",onClick:R.older,disabled:R.loading,children:n(R.loading?"historyLoading":"older")})})]}),(0,s.jsxs)("section",{className:"ch-limit",children:[(0,s.jsx)("span",{className:"ch-limit-icon","aria-hidden":"true",children:"i"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h2",{children:n("limits")}),(0,s.jsx)("p",{children:n("limitsNote")})]})]})]}):(0,s.jsxs)("div",{className:"ch-empty",children:[(0,s.jsx)(j,{size:36}),(0,s.jsx)("h2",{children:n("noSession")}),(0,s.jsx)("p",{children:n("choose")})]}),(0,s.jsxs)("footer",{className:"ch-footer",children:[(0,s.jsx)("span",{children:"ch-context \xB7 CodexHost"}),(0,s.jsx)("span",{children:n("localOnly")})]})]})})}var Pe=`.ch-context {
  --ch-accent: #13786c;
  --ch-accent-soft: #eaf5f1;
  --ch-track: #dce9e4;
  --ch-warning: #b76a15;
  --ch-ink: var(--dsw-alias-label-primary, #172623);
  --ch-muted: var(--dsw-alias-label-secondary, #52635d);
  --ch-surface: var(--dsw-alias-bg-layer-1, #fff);
  --ch-border: var(--dsw-alias-border-l2, #dde5e1);
  color: var(--ch-ink);
  font-family: var(
    --ds-font-family,
    system-ui,
    -apple-system,
    'Segoe UI',
    'Microsoft YaHei',
    sans-serif
  );
  font-size: 13px;
  line-height: 1.5;
  height: 100%;
  min-height: 0;
  overflow: auto;
  container-type: inline-size;
  color-scheme: light dark;
}
body[data-ds-dark-theme] .ch-context {
  --ch-accent: #7cd8c1;
  --ch-accent-soft: #163d33;
  --ch-track: #28423b;
  --ch-warning: #f1bc72;
  --ch-surface: var(--dsw-alias-bg-layer-1, #171b1a);
  --ch-ink: var(--dsw-alias-label-primary, #e4eeea);
  --ch-muted: var(--dsw-alias-label-secondary, #a0b3ab);
  --ch-border: var(--dsw-alias-border-l2, #343d38);
}
.ch-context * {
  box-sizing: border-box;
}
.ch-context :is(h1, h2, p, dl, dd) {
  margin: 0;
}
.ch-context button,
.ch-context input {
  font: inherit;
}
.ch-context button {
  cursor: pointer;
}
.ch-context button:disabled {
  cursor: default;
  opacity: 0.45;
}
.ch-context :is(button, input, summary):focus-visible {
  outline: 2px solid var(--ch-accent);
  outline-offset: 3px;
}
.ch-context button:active:not(:disabled) {
  transform: translateY(1px);
}
.ch-shell {
  max-width: 1180px;
  margin-inline: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.ch-page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-block: 4px 12px;
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ch-accent);
  font-size: 10px;
  letter-spacing: 0.15em;
  font-weight: 700;
}
.ch-version {
  font-weight: 500;
  color: var(--ch-muted);
  letter-spacing: 0;
  border: 1px solid var(--ch-border);
  padding: 0 5px;
  border-radius: 4px;
}
.ch-page-heading h1 {
  font-size: 28px;
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1.25;
  margin-block: 12px 6px;
  text-wrap: balance;
}
.ch-page-heading p {
  color: var(--ch-muted);
  font-size: 13px;
}
.ch-heading-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.ch-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ch-accent);
}
.ch-status.is-offline i {
  background: var(--ch-warning);
}
.ch-button {
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  color: var(--ch-ink);
  padding: 8px 13px;
  min-height: 36px;
  border-radius: 7px;
  line-height: 1.2;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
  white-space: normal;
  text-align: center;
}
.ch-button:hover:not(:disabled) {
  background: var(--ch-accent-soft);
  border-color: var(--ch-accent);
}
.ch-button-subtle {
  background: transparent;
  border-color: transparent;
}
.ch-note,
.ch-eyebrow,
.ch-count {
  color: var(--ch-muted);
  font-size: 11px;
  line-height: 1.6;
}
.ch-eyebrow {
  font-size: 10px;
}
.ch-count {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-note {
  overflow-wrap: anywhere;
}
.ch-note span[title] {
  cursor: help;
}
.ch-availability {
  padding: 12px 16px;
  background: var(--ch-accent-soft);
  border-radius: 8px;
}
.ch-session-picker {
  border: 1px solid var(--ch-border);
  border-radius: 12px;
  padding: 16px;
  background: var(--ch-surface);
}
.ch-picker-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.ch-picker-header h2 {
  font-size: 13px;
  font-weight: 600;
  margin-right: auto;
}
.ch-search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ch-border);
  border-radius: 7px;
  padding: 6px 10px;
  max-width: 280px;
  min-width: 0;
  color: var(--ch-muted);
}
.ch-search input {
  background: transparent;
  border: 0;
  color: var(--ch-ink);
  outline: 0;
  min-width: 0;
  width: 100%;
  font-size: 12px;
}
.ch-search:focus-within {
  outline: 2px solid var(--ch-accent);
  outline-offset: 2px;
}
.ch-search input:focus-visible {
  outline: 0;
}
.ch-session-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  max-height: 244px;
  overflow-y: auto;
  padding: 3px;
}
.ch-session-list > div {
  min-width: 0;
}
.ch-session {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  padding: 10px;
  min-width: 0;
  min-height: 55px;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.ch-session:hover {
  background: var(--ch-accent-soft);
}
.ch-session.is-selected {
  border-color: var(--ch-accent);
  background: var(--ch-accent-soft);
}
.ch-session-marker {
  width: 5px;
  height: 5px;
  background: var(--ch-muted);
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-session.is-selected .ch-session-marker {
  background: var(--ch-accent);
}
.ch-session-title {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.ch-session-title small {
  display: block;
  font-size: 10px;
  color: var(--ch-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-session > span:last-child {
  color: var(--ch-muted);
  font-size: 12px;
}
.ch-pagination {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.ch-pagination small {
  color: var(--ch-muted);
  font-size: 10px;
}
.ch-pagination > div {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
}
.ch-pagination .ch-button {
  font-size: 11px;
  padding: 6px 8px;
  min-height: 30px;
}
.ch-selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}
.ch-selected-header > div {
  min-width: 0;
}
.ch-selected-header h2 {
  font-size: 15px;
  font-weight: 550;
  line-height: 1.5;
  overflow-wrap: anywhere;
  max-width: 78ch;
}
.ch-selected-header .ch-button {
  font-size: 11px;
  flex-shrink: 0;
}
.ch-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.ch-card {
  padding: 22px;
  border: 1px solid var(--ch-border);
  border-radius: 12px;
  min-width: 0;
  background: var(--ch-surface);
}
.ch-card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.ch-card-heading h2 {
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.ch-card-heading .ch-eyebrow {
  font-size: 10px;
}
.ch-occupancy-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}
.ch-occupancy-number {
  min-width: 0;
}
.ch-occupancy-number strong {
  display: block;
  font-size: 52px;
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1.2;
  margin-block: 7px 2px;
  font-variant-numeric: tabular-nums;
}
.ch-occupancy-number strong > span {
  font-size: 24px;
  margin-left: 3px;
  letter-spacing: -0.03em;
  color: var(--ch-muted);
}
.ch-occupancy-number p {
  font-size: 11px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-context-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--ch-border);
  padding-top: 18px;
  margin-top: 21px !important;
  gap: 16px;
}
.ch-metric dt {
  font-size: 11px;
  color: var(--ch-muted);
  overflow-wrap: anywhere;
}
.ch-metric dd {
  font-size: 21px;
  font-weight: 550;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
  margin-top: 5px;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.ch-metric small {
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 24px;
}
.ch-cost {
  border-top: 1px solid var(--ch-border);
  padding-top: 18px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ch-cost span,
.ch-cost small {
  display: block;
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-cost strong {
  display: block;
  font-size: 24px;
  font-weight: 550;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  margin: 4px 0 2px;
}
.ch-cost + .ch-note {
  margin-top: 12px;
}
.ch-performance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}
.ch-performance .ch-metric dd {
  font-size: 20px;
}
.ch-context .lc-donut {
  position: relative;
  flex-shrink: 0;
}
.ch-context .lc-donut svg {
  transform: rotate(0deg);
}
.ch-context .lc-donut circle {
  fill: none;
  stroke-width: 3.5;
}
.ch-context .lc-donut-track {
  stroke: var(--ch-track);
}
.ch-context .lc-donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  gap: 3px;
}
.ch-context .lc-donut-center b {
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.ch-context .lc-donut-center span {
  color: var(--ch-muted);
  max-width: 86px;
  line-height: 1.3;
}
.ch-context .lc-donut-seg {
  transition: stroke 0.2s;
}
.ch-chart {
  display: flex;
  gap: 12px;
  height: 120px;
  margin-top: 10px;
}
.ch-chart-axis {
  width: 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  font-size: 10px;
  color: var(--ch-muted);
  line-height: 1;
}
.ch-chart svg {
  flex: 1;
  min-width: 0;
  overflow: visible;
}
.ch-chart-grid {
  stroke: var(--ch-border);
  stroke-width: 1;
  stroke-dasharray: 3 5;
  fill: none;
  vector-effect: non-scaling-stroke;
}
.ch-chart-line {
  stroke: var(--ch-accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  vector-effect: non-scaling-stroke;
}
.ch-chart-dot {
  fill: var(--ch-accent);
}
.ch-chart-times {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-left: 46px;
  font-size: 10px;
  color: var(--ch-muted);
  margin-block: 10px 16px;
}
.ch-filter {
  display: flex;
  align-items: center;
  gap: 3px;
  margin: 14px 0 12px;
  flex-wrap: wrap;
}
.ch-filter button {
  padding: 7px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ch-muted);
  font-size: 11px;
  min-height: 32px;
}
.ch-filter button:hover,
.ch-filter button.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-accent);
}
.ch-filter .ch-count {
  margin-left: auto;
}
.ch-history {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ch-border);
}
.ch-record {
  border-bottom: 1px solid var(--ch-border);
}
.ch-record summary {
  list-style: none;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 0;
  cursor: pointer;
  min-width: 0;
}
.ch-record summary::-webkit-details-marker {
  display: none;
}
.ch-role {
  font-size: 10px;
  flex-shrink: 0;
  color: var(--ch-accent);
  min-width: 55px;
  padding-top: 1px;
}
.ch-record-tool .ch-role,
.ch-record-event .ch-role {
  color: var(--ch-muted);
}
.ch-record-title {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.ch-record-badge {
  color: var(--ch-muted);
  border: 1px solid var(--ch-border);
  border-radius: 4px;
  font-size: 10px;
  padding: 1px 5px;
  flex-shrink: 0;
}
.ch-record-notice {
  margin-bottom: 10px !important;
  padding: 8px 10px;
  background: var(--ch-accent-soft);
  border-radius: 6px;
}
.ch-record-time {
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: var(--ch-muted);
  flex-shrink: 0;
  padding-top: 2px;
}
.ch-record pre {
  margin: 0 0 16px;
  padding: 14px;
  border-radius: 7px;
  background: var(--ch-accent-soft);
  font-family: var(--ds-font-family-code, ui-monospace, 'Microsoft YaHei', monospace);
  font-size: 11px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 420px;
  overflow: auto;
  line-height: 1.7;
}
.ch-history-footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.ch-history-footer button {
  font-size: 11px;
}
.ch-empty-inline {
  padding: 18px 0;
}
.ch-limit {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 5px 4px;
}
.ch-limit-icon {
  border: 1px solid var(--ch-muted);
  border-radius: 50%;
  width: 15px;
  height: 15px;
  line-height: 13px;
  text-align: center;
  color: var(--ch-muted);
  font-size: 10px;
  flex-shrink: 0;
  margin-top: 2px;
}
.ch-limit h2 {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 3px;
}
.ch-limit p {
  font-size: 11px;
  color: var(--ch-muted);
  max-width: 95ch;
}
.ch-footer {
  border-top: 1px solid var(--ch-border);
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--ch-muted);
  font-size: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.ch-footer span:last-child {
  max-width: 70ch;
}
.ch-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 72px 20px;
  gap: 12px;
  color: var(--ch-muted);
  text-align: center;
}
.ch-empty h2 {
  font-size: 18px;
  color: var(--ch-ink);
}
.ch-empty p {
  max-width: 40ch;
}
.ch-error {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  font-size: 12px;
}
.ch-error span {
  color: var(--ch-muted);
  overflow-wrap: anywhere;
  font-size: 11px;
  flex-basis: 100%;
}
.ch-error .ch-button {
  font-size: 11px;
}
.ch-loading .ch-card {
  height: 290px;
}
.ch-skeleton {
  background: linear-gradient(100deg, var(--ch-surface), var(--ch-accent-soft), var(--ch-surface));
  background-size: 200% 100%;
  animation: ch-shimmer 1.8s ease-in-out infinite;
  border-radius: 8px;
  min-height: 32px;
}
.ch-session-skeleton {
  height: 116px;
  grid-column: 1/-1;
}
.ch-history-skeleton {
  height: 180px;
  margin-top: 16px;
}
.ch-settings {
  padding: 28px;
  max-width: 70ch;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: var(--dsw-alias-label-primary, inherit);
}
@keyframes ch-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@container (max-width:800px) {
  .ch-shell {
    padding: 24px;
    gap: 16px;
  }
  .ch-card {
    padding: 18px;
  }
  .ch-dashboard {
    gap: 16px;
  }
  .ch-occupancy-number strong {
    font-size: 42px;
  }
  .ch-context .lc-donut {
    width: 112px !important;
    height: 112px !important;
  }
  .ch-context .lc-donut svg {
    width: 112px;
    height: 112px;
  }
}
@container (max-width:640px) {
  .ch-shell {
    padding: 18px;
  }
  .ch-dashboard {
    grid-template-columns: 1fr;
  }
  .ch-page-heading {
    align-items: flex-start;
    gap: 12px;
  }
  .ch-page-heading h1 {
    font-size: 25px;
  }
  .ch-heading-actions {
    gap: 9px;
    flex-direction: column;
    align-items: flex-end;
  }
  .ch-status {
    font-size: 10px;
  }
  .ch-search {
    max-width: none;
    flex: 1 1 100%;
    order: 3;
  }
  .ch-session-list {
    grid-template-columns: 1fr;
    max-height: 225px;
  }
  .ch-performance {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ch-occupancy-layout {
    justify-content: space-around;
  }
  .ch-context .lc-donut {
    width: 136px !important;
    height: 136px !important;
  }
  .ch-context .lc-donut svg {
    width: 136px;
    height: 136px;
  }
  .ch-card-heading {
    margin-bottom: 16px;
  }
  .ch-record summary {
    gap: 8px;
  }
  .ch-role {
    min-width: 40px;
  }
  .ch-record-time {
    max-width: 58px;
  }
  .ch-pagination {
    align-items: flex-end;
  }
  .ch-pagination small {
    max-width: 12ch;
  }
  .ch-selected-header h2 {
    font-size: 14px;
  }
  .ch-footer {
    gap: 8px;
  }
}
@container (max-width:360px) {
  .ch-shell {
    padding: 12px;
  }
  .ch-card {
    padding: 15px;
  }
  .ch-page-heading h1 {
    font-size: 23px;
  }
  .ch-page-heading p {
    font-size: 12px;
  }
  .ch-context .lc-donut {
    width: 112px !important;
    height: 112px !important;
  }
  .ch-context .lc-donut svg {
    width: 112px;
    height: 112px;
  }
  .ch-card-heading .ch-eyebrow {
    font-size: 9px;
  }
  .ch-selected-header {
    flex-wrap: wrap;
  }
  .ch-pagination {
    flex-wrap: wrap;
  }
  .ch-occupancy-number strong {
    font-size: 40px;
  }
  .ch-performance .ch-metric dd {
    font-size: 18px;
  }
}
@container (max-width:640px) {
  .ch-button,
  .ch-pagination .ch-button {
    min-height: 44px;
  }
  .ch-filter button {
    min-height: 44px;
    min-width: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ch-context * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;var y=require("react/jsx-runtime"),T="ch-context",Be=["slots","locale"],W=class extends K.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(t,r){}render(){return this.state.failed?(0,y.jsx)("div",{className:"ch-context",children:(0,y.jsxs)("div",{className:"ch-shell",children:[(0,y.jsx)("p",{role:"alert",children:this.props.translate()("errorBoundary")}),(0,y.jsx)("button",{className:"ch-button",onClick:()=>this.setState({failed:!1}),children:this.props.translate()("retry")})]})}):this.props.children}};function Ve(e){let t=()=>V(e.locale.getLocale?.().active??"en");e.effect(()=>e.locale.register(T,{en:{...oe},zh:{...ie}}),"ch-context: locale"),e.effect(()=>{let n=document.createElement("style");return n.dataset.plugin=T,n.dataset.pluginCss=T,n.textContent=Pe,document.head.appendChild(n),()=>n.remove()},"ch-context: styles");let r=n=>{let l=(n.useProjection??(()=>{}))("codexhostUsage");return(0,y.jsx)(se,{ctx:e,sessionId:n.sessionId,projection:l,embedded:!0})},o=n=>(0,y.jsx)(W,{translate:t,children:(0,y.jsx)(r,{...n})},`${n.sessionId??""}:${typeof n.useProjection}`),i=()=>(0,y.jsx)(W,{translate:t,children:(0,y.jsx)(se,{ctx:e})});e.slots.inject("conversation.view",()=>e.slots.register({name:"conversation.view",id:T,order:25,locale:T,label:()=>t()("tab")},o)),e.slots.inject("main",()=>e.slots.register({name:"main",key:T,locale:T},i)),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:T,order:25,label:()=>t()("title"),locale:T},n=>(0,K.createElement)(j,{size:typeof n.size=="number"?n.size:20}))),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:T,order:25,label:()=>t()("titleShort"),locale:T},()=>(0,y.jsx)("div",{className:"ch-context",children:(0,y.jsxs)("div",{className:"ch-settings",children:[(0,y.jsx)("h2",{children:"CH Context"}),(0,y.jsx)("p",{children:t()("settingsNote")}),(0,y.jsx)("p",{children:t()("localOnly")}),(0,y.jsx)("button",{className:"ch-button",onClick:()=>{let n=z(e.get("layout"));typeof n?.selectPanel=="function"&&n.selectPanel(T)},children:t()("title")}),(0,y.jsx)("small",{children:t()("readOnly")})]})})))}

return module.exports;}});
