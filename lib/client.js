window.__ModuleLoader__.load({id:"ch-context",factory:function(require){var module={exports:{}};var exports=module.exports;
"use strict";var Oe=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var bn=Object.getOwnPropertyNames;var kn=Object.prototype.hasOwnProperty;var wn=(t,e)=>{for(var r in e)Oe(t,r,{get:e[r],enumerable:!0})},vn=(t,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of bn(e))!kn.call(t,n)&&n!==r&&Oe(t,n,{get:()=>e[n],enumerable:!(s=xn(e,n))||s.enumerable});return t};var yn=t=>vn(Oe({},"__esModule",{value:!0}),t);var Ar={};wn(Ar,{apply:()=>$r,inject:()=>zr,name:()=>D});module.exports=yn(Ar);var Pe=require("react");var j=require("react");var ft=require("react");var Mr=require("react"),J=require("react/jsx-runtime"),Tn=.5;function it(t){let e=t.size??118,r=0;for(let o of t.segments)Number.isFinite(o.value)&&o.value>0&&(r+=o.value);let s=[],n=0;if(r>0)for(let o of t.segments){let a=Number.isFinite(o.value)&&o.value>0?o.value:0;if(a===0)continue;let c=a/r*100;s.push({key:o.key,color:o.color,len:c,offset:100-n+25}),n+=c}if(s.length>1)for(let o of s){let a=Math.min(Tn/2,o.len/4);o.len-=a*2,o.offset-=a}let i=t.hoverKey!==null&&t.hoverKey!==void 0&&s.some(o=>o.key===t.hoverKey);return(0,J.jsxs)("div",{className:"lc-donut @max-[240px]/lc-card:mx-auto"+(i?" lc-donut-dim":""),style:{width:e,height:e},onMouseLeave:()=>{t.onHoverKey!==void 0&&t.onHoverKey(null)},children:[(0,J.jsx)("svg",{viewBox:"0 0 42 42",width:e,height:e,"aria-hidden":"true",children:s.length===0?(0,J.jsx)("circle",{className:"lc-donut-track fill-none stroke-4",cx:"21",cy:"21",r:"15.9155"}):s.map((o,a)=>(0,J.jsx)("circle",{className:"lc-donut-seg fill-none stroke-4 animate-lc-donut-in motion-reduce:animate-none"+(t.hoverKey===o.key?" lc-donut-seg-on":""),cx:"21",cy:"21",r:"15.9155",strokeDasharray:`${o.len} ${100-o.len}`,strokeDashoffset:o.offset,style:{"--lc-i":a,stroke:o.color},onMouseEnter:()=>{t.onHoverKey!==void 0&&t.onHoverKey(o.key)}},o.key))}),(0,J.jsxs)("div",{className:"lc-donut-center",children:[(0,J.jsx)("b",{style:{fontSize:Math.max(11,Math.round(e*.13))},children:t.centerTop}),t.centerSub!==void 0?(0,J.jsx)("span",{style:{fontSize:Math.max(10,Math.round(e*.105))},children:t.centerSub}):null]})]})}function Y(t){if(t==null||isNaN(t))return"\u2014";let e=t<0?"-":"",r=Math.abs(t);return r>=1e9?e+(r/1e9).toFixed(1)+"B":r>=1e6?e+(r/1e6).toFixed(1)+"M":r>=1e3?e+(r/1e3).toFixed(1)+"k":e+String(Math.round(r))}var Sn=new Intl.DateTimeFormat("en-GB",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function de(t){let e=new Date(t);return isNaN(e.getTime())?"\u2014":Sn.format(e)}var _r=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function at(t){if(!Number.isFinite(t)||t<=0)return"\u2014";if(t<1e3)return`${Math.round(t)}ms`;if(t<6e4)return`${(t/1e3).toFixed(1)}s`;let e=Math.floor(t/1e3),r=Math.floor(e/60),s=e%60;return t<36e5?`${r}m${s}s`:`${Math.floor(r/60)}h${r%60}m`}function ee(t){return typeof t=="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)}function W(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)?t:null}function ne(t){return typeof t=="number"&&Number.isFinite(t)&&t>=0?t:void 0}var ct=["inputTokens","cachedInputTokens","cacheWriteInputTokens","outputTokens","totalTokens","reasoningOutputTokens","totalCostUsd","totalCredits","contextUsedTokens","contextWindowTokens","contextUsagePercent","cacheHitRatePercent","sessionCacheHitRatePercent","outputTokensPerSecond","sessionOutputTokensPerSecond","timeToFirstOutputMs","latestRequestTimeToFirstOutputMs"];function _e(t){let e=W(t),r=W(e?.usage);if(r===null)return null;let s={};for(let n of ct){let i=ne(r[n]);i!==void 0&&(s[n]=i)}return s.contextWindowTokens===0&&delete s.contextWindowTokens,(r.costSource==="publicPrice"||r.costSource==="native")&&(s.costSource=r.costSource),Array.isArray(r.unpricedModels)&&(s.unpricedModels=r.unpricedModels.filter(n=>typeof n=="string").slice(0,100)),ct.some(n=>s[n]!==void 0)?s:null}function lt(t){let e=ne(t?.inputTokens),r=ne(t?.outputTokens);if(e===void 0||r===void 0)return[];let s=ne(t?.cachedInputTokens),n=ne(t?.cacheWriteInputTokens);return s===void 0||n===void 0||s+n>e?[{kind:"input",value:e},{kind:"output",value:r}]:[{kind:"uncachedInput",value:e-s-n},{kind:"cacheRead",value:s},{kind:"cacheWrite",value:n},{kind:"output",value:r}]}function He(t){let e=ne(t?.contextUsedTokens),r=ne(t?.contextWindowTokens),s=r===0?void 0:r,n=ne(t?.contextUsagePercent)??(e!==void 0&&s!==void 0?e/s*100:void 0);return n===void 0?null:{percent:n,...e===void 0?{}:{used:e},...s===void 0?{}:{capacity:s}}}function Le(t,e,r){let s=He(e);if(s===null||!Number.isFinite(r))return[...t];let n=t.at(-1);return n?.percent===s.percent&&n.used===s.used&&n.capacity===s.capacity?[...t]:[...t,{time:r,...s}].slice(-120)}function dt(t,e=600,r=120){let s=t[0];if(s===void 0)return"";let n=Math.max(1,(t.at(-1)?.time??s.time)-s.time);return t.map((i,o)=>{let a=t.length===1?e/2:(i.time-s.time)/n*e,c=r-Math.min(100,i.percent)/100*r;return`${o===0?"M":"L"}${a.toFixed(2)},${c.toFixed(2)}`}).join(" ")}var Rn=new Intl.NumberFormat("en-US",{maximumFractionDigits:4});function ye(t,e=160){return(t.split(/\r?\n/).find(r=>r.trim().length>0)??"").trim().replace(/^#{1,6}\s+/,"").slice(0,e)}function pt(t){return`$${t>0&&t<1e-4?t.toPrecision(2):t.toFixed(t>=1?2:4)}`}function ht(t){return t>0&&t<1e-4?"<0.0001":Rn.format(t)}var p=require("react/jsx-runtime");function ue({size:t=20}){return(0,p.jsxs)("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,p.jsx)("path",{d:"M5 18V11M12 18V6M19 18V3",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),(0,p.jsx)("path",{d:"M3 21h18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}function K({label:t,value:e,suffix:r,format:s}){let n=e===void 0?"\u2014":s?s(e):r==="%"?`${e.toFixed(1)}%`:r==="ms"?e===0?"0ms":at(e):r==="tok/s"?`${e.toFixed(1)} ${r}`:Y(e);return(0,p.jsxs)("div",{className:"ch-metric",children:[(0,p.jsx)("dt",{children:t}),(0,p.jsx)("dd",{title:e===void 0?void 0:String(e),children:n})]})}function V({title:t,aside:e,children:r,className:s=""}){return(0,p.jsxs)("section",{className:`ch-card ${s}`,children:[(0,p.jsxs)("header",{className:"ch-card-heading",children:[(0,p.jsx)("h2",{children:t}),e]}),r]})}function mt({usage:t,t:e}){let s=He(t)?.percent;return(0,p.jsxs)(V,{title:e("context"),className:"ch-context-card",aside:(0,p.jsxs)("span",{className:"ch-eyebrow",title:e("limitsNote"),children:[e("source")," \u24D8"]}),children:[(0,p.jsxs)("div",{className:"ch-context-line",children:[(0,p.jsxs)("p",{children:[(0,p.jsx)("b",{children:Y(t?.contextUsedTokens)}),(0,p.jsxs)("span",{children:[" / ",Y(t?.contextWindowTokens)," tokens"]})]}),(0,p.jsxs)("div",{className:"ch-occupancy-number",children:[(0,p.jsx)("strong",{children:s===void 0?"\u2014":`${s.toFixed(1)}%`}),(0,p.jsx)("small",{children:e("occupancy")})]})]}),(0,p.jsx)("div",{className:`ch-capacity-bar ${s!==void 0&&s>85?"is-high":""}`,role:"img","aria-label":`${e("occupancy")}: ${s===void 0?e("unavailable"):s.toFixed(1)+"%"}`,children:(0,p.jsx)("span",{style:{width:`${Math.min(100,s??0)}%`}})}),(0,p.jsxs)("div",{className:"ch-context-values",children:[(0,p.jsxs)("span",{children:[e("used"),": ",Y(t?.contextUsedTokens)]}),(0,p.jsxs)("span",{children:[e("capacity"),": ",Y(t?.contextWindowTokens)]})]})]})}var ut={input:"var(--ch-blue)",uncachedInput:"var(--ch-blue)",cacheRead:"var(--ch-teal)",cacheWrite:"var(--ch-amber)",output:"var(--ch-purple)"};function xt({usage:t,t:e}){let[r,s]=(0,ft.useState)(null),n=lt(t),i=n.reduce((a,c)=>a+c.value,0),o=(t?.unpricedModels?.length??0)>0;return(0,p.jsxs)(V,{title:e("cumulative"),className:"ch-token-card",aside:t?.cacheHitRatePercent!==void 0&&(0,p.jsxs)("span",{className:"ch-eyebrow",children:[e("cacheHit")," ",(0,p.jsxs)("b",{children:[t.cacheHitRatePercent.toFixed(1),"%"]})]}),children:[(0,p.jsxs)("div",{className:"ch-token-layout",children:[(0,p.jsx)(it,{size:102,segments:n.map(a=>({key:a.kind,value:a.value,color:ut[a.kind]})),centerTop:Y(n.length?i:t?.totalTokens),centerSub:n.length?e("inputOutput"):e("total"),hoverKey:r,onHoverKey:s}),(0,p.jsxs)("div",{className:"ch-token-legend",children:[n.length?n.map(a=>(0,p.jsxs)("button",{title:`${e(a.kind)}: ${a.value}`,onMouseEnter:()=>s(a.kind),onMouseLeave:()=>s(null),onFocus:()=>s(a.kind),onBlur:()=>s(null),children:[(0,p.jsx)("span",{className:"ch-swatch",style:{background:ut[a.kind]}}),(0,p.jsx)("span",{children:e(a.kind)}),(0,p.jsx)("b",{children:Y(a.value)}),(0,p.jsx)("small",{children:i>0?`${(a.value/i*100).toFixed(1)}%`:"0%"})]},a.kind)):(0,p.jsxs)("dl",{className:"ch-metrics",children:[(0,p.jsx)(K,{label:e("input"),value:t?.inputTokens}),(0,p.jsx)(K,{label:e("output"),value:t?.outputTokens}),(0,p.jsx)(K,{label:e("cacheRead"),value:t?.cachedInputTokens}),(0,p.jsx)(K,{label:e("cacheWrite"),value:t?.cacheWriteInputTokens})]}),n.length===2&&(0,p.jsxs)("dl",{className:"ch-independent-cache",children:[(0,p.jsx)(K,{label:e("cacheRead"),value:t?.cachedInputTokens}),(0,p.jsx)(K,{label:e("cacheWrite"),value:t?.cacheWriteInputTokens})]})]})]}),(0,p.jsxs)("div",{className:"ch-token-footer",children:[(0,p.jsxs)("span",{title:e("inputIncludesCache"),children:[e("total")," ",(0,p.jsx)("b",{children:Y(t?.totalTokens)})]}),(0,p.jsxs)("span",{title:o?e("partialPrice"):t?.totalCostUsd===void 0?e("unavailable"):t.costSource==="native"?e("costNative"):t.costSource==="publicPrice"?e("costEstimate"):e("source"),children:[e("cost")," ",(0,p.jsx)("b",{children:t?.totalCostUsd===void 0?"\u2014":`${o?"\u2265 ":""}${pt(t.totalCostUsd)}`})]})]}),o&&(0,p.jsx)("p",{className:"ch-note",children:e("partialPrice")})]})}function gt({label:t,value:e}){return(0,p.jsxs)("div",{className:"ch-cache-row",children:[(0,p.jsx)("span",{children:t}),(0,p.jsx)("div",{className:"ch-cache-track",children:(0,p.jsx)("i",{style:{width:`${Math.min(100,e??0)}%`}})}),(0,p.jsx)("b",{children:e===void 0?"\u2014":`${e.toFixed(1)}%`})]})}function bt({usage:t,t:e}){return(0,p.jsxs)(V,{title:e("performance"),className:"ch-performance-card",children:[(0,p.jsxs)("dl",{className:"ch-performance",children:[(0,p.jsx)(K,{label:e("tps"),value:t?.outputTokensPerSecond,suffix:"tok/s"}),(0,p.jsx)(K,{label:e("avgTps"),value:t?.sessionOutputTokensPerSecond,suffix:"tok/s"}),(0,p.jsx)(K,{label:e("ttft"),value:t?.latestRequestTimeToFirstOutputMs??t?.timeToFirstOutputMs,suffix:"ms"}),t?.totalCredits!==void 0&&(0,p.jsx)(K,{label:e("credits"),value:t.totalCredits,format:ht})]}),(0,p.jsxs)("div",{className:"ch-cache-bars",children:[(0,p.jsx)(gt,{label:e("cacheHit"),value:t?.cacheHitRatePercent}),(0,p.jsx)(gt,{label:e("avgCache"),value:t?.sessionCacheHitRatePercent})]})]})}function kt({samples:t,t:e}){return(0,p.jsxs)(V,{title:e("timeline"),aside:(0,p.jsxs)("span",{className:"ch-count",children:[e("observed")," \xB7 ",t.length]}),children:[(0,p.jsxs)("div",{className:"ch-chart",role:"img","aria-label":e("sampled"),children:[(0,p.jsxs)("div",{className:"ch-chart-axis",children:[(0,p.jsx)("span",{children:"100%"}),(0,p.jsx)("span",{children:"50%"}),(0,p.jsx)("span",{children:"0%"})]}),(0,p.jsxs)("svg",{viewBox:"0 0 600 120",preserveAspectRatio:"none","aria-hidden":"true",children:[(0,p.jsx)("path",{d:"M0 0H600 M0 60H600 M0 120H600",className:"ch-chart-grid"}),t.length>0&&(0,p.jsx)("path",{d:dt(t),className:"ch-chart-line"}),t.length===1&&(0,p.jsx)("circle",{cx:"300",cy:120-Math.min(100,t[0].percent)/100*120,r:"3",className:"ch-chart-dot"})]})]}),(0,p.jsxs)("div",{className:"ch-chart-times",children:[(0,p.jsx)("span",{children:t[0]?de(t[0].time):"\u2014"}),(0,p.jsx)("span",{children:t.length<2?e("needSamples"):de(t[t.length-1].time)})]}),(0,p.jsxs)("p",{className:"ch-note",children:[e("timelineNote")," ",(0,p.jsx)("span",{title:e("retained"),children:"\u24D8"})]})]})}function qe({item:t,t:e}){return!t.clipped&&!t.contentUnavailable&&t.isError!==!0?null:(0,p.jsxs)(p.Fragment,{children:[t.isError===!0&&(0,p.jsx)("span",{className:"ch-record-badge ch-error-badge",children:e("failed")}),(t.clipped||t.contentUnavailable)&&(0,p.jsx)("span",{className:"ch-record-badge",children:e(t.clipped?"previewShort":"partialShort")})]})}function wt({item:t,t:e}){return(0,p.jsxs)(p.Fragment,{children:[t.isError===!0&&(0,p.jsx)("p",{className:"ch-note ch-record-notice",children:e("toolError")}),t.hostPreview&&(0,p.jsx)("p",{className:"ch-note ch-record-notice",children:e("hostPreview")}),t.textTruncated&&(0,p.jsx)("p",{className:"ch-note ch-record-notice",children:e("textTruncated")}),t.contentUnavailable&&(0,p.jsx)("p",{className:"ch-note ch-record-notice",children:e("contentUnavailable")})]})}var Q=require("react");var Nn=new Set(["bash","Bash","pwsh","powershell","exec_command","shell","shell_command","run_shell_command","run_command"]),Cn=new Set(["read","Read","read_file","readFile","read_image"]),In=new Set(["write","Write","write_file","writeFile","edit","Edit","edit_file","editFile","multi_edit","MultiEdit"]),En=new Set(["grep","Grep","glob","Glob","search_files","searchFiles"]),zn=new Set(["str_replace_editor","str_replace_based_edit_tool"]),$n=new Set(["str_replace","insert","create","undo_edit"]);function ge(t){return typeof t=="string"&&t.trim().length>0}function Fe(t){return ge(t.toolName)?t.toolName:ge(t.title)?t.title:void 0}function yt(t){return t.startsWith("functions.")?t.slice(10):t}function An(t){if(typeof t=="string")try{let e=JSON.parse(t);return e!==null&&typeof e=="object"&&!Array.isArray(e)?e:void 0}catch{return}}function Pn(t,e){if(Nn.has(yt(t)))return typeof e.command=="string"?e.command:typeof e.cmd=="string"?e.cmd:void 0}function Mn(t,e){let r=yt(t);if(Cn.has(r))return"reads";if(In.has(r))return"writes";if(En.has(r))return"searches";if(zn.has(r)){if(e.command==="view")return"reads";if(typeof e.command=="string"&&$n.has(e.command))return"writes"}}function On(t){for(let e of["path","file_path","filePath"]){let r=t[e];if(ge(r)&&!r.includes("\0"))return r}}function vt(t,e){if(!ge(e.callId))return;let r=t.get(e.callId);r?r.push(e):t.set(e.callId,[e])}function _n(t){let e=new Map,r=new Map;for(let n of t)n.eventType==="tool/call"?vt(e,n):n.eventType==="tool/result"&&vt(r,n);let s=new Map;for(let[n,i]of e){let o=r.get(n);if(i.length!==1||o?.length!==1)continue;let a=i[0],c=o[0];if(c.seq<=a.seq)continue;let l=Fe(a);ge(c.toolName)&&l!==void 0&&c.toolName!==l||s.set(a,c)}return s}function Hn(t,e){if(t.isError===!0||e?.isError===!0)return!0;if(e?.isError===!1||t.isError===!1)return!1}function Tt(t){let e={messages:0,userMessages:0,assistantMessages:0,toolCalls:0,toolResults:0,events:0,records:t.length,tools:[],commands:[],files:[]},r=_n(t),s=new Map,n=new Map,i=new Map;for(let o of t)if(o.eventType==="user/message"||o.eventType===void 0&&o.kind==="user")e.userMessages++;else if(o.eventType==="assistant/message"||o.eventType===void 0&&o.kind==="assistant")e.assistantMessages++;else if(o.eventType==="tool/result")e.toolResults++;else if(o.eventType==="tool/call"){e.toolCalls++;let a=Fe(o);if(a===void 0)continue;let c=s.get(a);c===void 0&&(c={name:a,count:0,failed:0,pending:0,recordIds:[]},s.set(a,c));let l=r.get(o),d=Hn(o,l);c.count++,d===!0&&c.failed++,l===void 0?c.pending++:i.set(l,c);let u=An(o.arguments);if(u===void 0)continue;let f=Pn(a,u);f!==void 0&&e.commands.push({id:o.id,seq:o.seq,tool:a,command:f,recordId:o.id,...l===void 0?{}:{resultId:l.id},...d===void 0?{}:{isError:d}});let v=Mn(a,u),g=v===void 0?void 0:On(u);if(v===void 0||g===void 0)continue;let w=n.get(g);w===void 0&&(w={path:g,reads:0,writes:0,searches:0,recordIds:[]},n.set(g,w)),w[v]++,w.recordIds.push(o.id)}else e.events++;for(let o of t)(o.eventType==="tool/call"?s.get(Fe(o)??""):i.get(o))?.recordIds.push(o.id);return e.messages=e.userMessages+e.assistantMessages,e.tools=[...s.values()],e.files=[...n.values()],e}var St={subagent:4,fork:3,tree:2,parent:1};function Rt(t){return[{id:t.parentId,kind:t.origin==="subagent"?"subagent":"parent"},{id:t.forkParentId,kind:"fork"},{id:t.treeParentId,kind:"tree"}].filter(r=>ee(r.id)&&r.id!==t.id)}function Nt(t,e){if(!ee(e))return[];let r=new Map,s=(i,o,a)=>{if(!ee(i)||i===e)return;let c=`${o}:${i}`,l=r.get(c);if(l&&St[l.kind]>=St[a])return;let d=t.find(u=>u.id===i);r.set(c,{id:i,title:d?.title??"",role:o,kind:a,loaded:d!==void 0,...d?.harness?{harness:d.harness}:{}})},n=t.find(i=>i.id===e);if(n)for(let i of Rt(n))s(i.id,"parent",i.kind);for(let i of t)if(!(!ee(i.id)||i.id===e))for(let o of Rt(i))o.id===e&&s(i.id,"child",o.kind);return[...r.values()]}var Et=require("react");function Ct(t,e){return 8+t/Math.max(1,e-1)*704}function It(t,e){return e<2||!Number.isFinite(t)?0:Math.min(e-1,Math.max(0,Math.round((t*720-8)/704*(e-1))))}var h=require("react/jsx-runtime"),oe={user:"var(--ch-green)",assistant:"var(--ch-blue)",tool:"var(--ch-teal)",event:"var(--ch-purple)"};function zt({summary:t,t:e,onTool:r,onKind:s}){return(0,h.jsxs)(V,{title:e("activityStats"),className:"ch-activity-stats",aside:(0,h.jsxs)("span",{className:"ch-scope",children:[e("historyWindow")," \xB7 ",t?.records??"\u2014"," ",e("count")]}),children:[(0,h.jsx)("div",{className:"ch-stat-tiles",children:["userMessages","assistantMessages","toolCalls","toolResults"].map((n,i)=>(0,h.jsxs)("button",{className:`ch-stat-tile ch-tile-${i}`,onClick:()=>s(i<2?"messages":"tool"),children:[(0,h.jsx)("strong",{children:t?.[n]??"\u2014"}),(0,h.jsx)("span",{children:e(n)})]},n))}),(0,h.jsxs)("div",{className:"ch-activity-bottom",children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("span",{children:e("toolUse")}),(0,h.jsxs)("div",{className:"ch-tool-chips",children:[t?.tools.slice(0,8).map(n=>(0,h.jsxs)("button",{title:`${n.name}: ${n.count}${n.failed?` \xB7 ${e("failed")}: ${n.failed}`:""}`,onClick:()=>r(n.name),children:[(0,h.jsx)("i",{style:{background:oe.tool}}),n.name," ",(0,h.jsx)("b",{children:n.count}),n.failed>0&&(0,h.jsxs)("em",{children:[n.failed," !"]})]},n.name)),(t?.tools.length??0)>8&&(0,h.jsxs)("button",{onClick:()=>s("tool"),children:["+",t.tools.length-8]}),t&&t.tools.length===0&&(0,h.jsx)("span",{className:"ch-note",children:"\u2014"})]})]}),(0,h.jsxs)("div",{className:"ch-window-counts",children:[(0,h.jsxs)("button",{onClick:n=>n.currentTarget.closest(".ch-inspector")?.querySelector(".ch-command-card")?.scrollIntoView({block:"nearest"}),children:[e("commands")," ",(0,h.jsx)("b",{children:t?.commands.length??"\u2014"})]}),(0,h.jsxs)("button",{onClick:n=>n.currentTarget.closest(".ch-inspector")?.querySelector(".ch-file-card")?.scrollIntoView({block:"nearest"}),children:[e("files")," ",(0,h.jsx)("b",{children:t?.files.length??"\u2014"})]}),(0,h.jsxs)("button",{onClick:()=>s("event"),children:[e("events")," ",(0,h.jsx)("b",{children:t?.events??"\u2014"})]})]})]})]})}function $t({items:t,available:e,loading:r,focus:s,onFocus:n,t:i}){let[o,a]=(0,Et.useState)(null),c=t.findIndex(m=>m.id===s),l=c<0?Math.max(0,t.length-1):c,d=m=>{let y=m.currentTarget.getBoundingClientRect();return y.width>0?It((m.clientX-y.left)/y.width,t.length):null},u=m=>{let y=d(m);y!==null&&t[y]&&n(t[y].id)},f=["user","assistant","tool","event"],v=m=>Ct(m,t.length),g=Math.max(3,Math.min(10,600/Math.max(1,t.length))),w=t[o!==null&&t[o]?o:l];return(0,h.jsx)(V,{title:i("activityTimeline"),className:"ch-activity-timeline",aside:(0,h.jsxs)("span",{className:"ch-count",children:[i("historyWindow")," \xB7 ",t.length?`1\u2013${t.length}`:"\u2014"]}),children:t.length===0?(0,h.jsx)("p",{className:"ch-note",children:i(e?"noHistory":r?"historyLoading":"unavailable")}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)("div",{className:"ch-activity-chart",children:[(0,h.jsx)("div",{className:"ch-lane-labels",children:f.map(m=>(0,h.jsx)("span",{style:{color:oe[m]},children:i(m)},m))}),(0,h.jsxs)("svg",{viewBox:"0 0 720 112",preserveAspectRatio:"none",role:"img","aria-label":i("activitySequence"),onClick:u,onMouseMove:m=>a(d(m)),onMouseLeave:()=>a(null),children:[f.map((m,y)=>(0,h.jsx)("line",{x1:"0",x2:"720",y1:20+y*24,y2:20+y*24,className:"ch-lane-line"},m)),t.map((m,y)=>(0,h.jsx)("rect",{x:v(y)-g/2,y:10+f.indexOf(m.kind)*24,width:g,height:"19",rx:"2",fill:oe[m.kind],opacity:y===l||o===y?1:.65},m.id)),(0,h.jsx)("line",{x1:v(l),x2:v(l),y1:"0",y2:"110",className:"ch-timeline-cursor"})]})]}),(0,h.jsx)("input",{className:"ch-sequence-slider",type:"range",min:"0",max:Math.max(0,t.length-1),value:l,onChange:m=>{let y=t[Number(m.target.value)];y&&n(y.id)},"aria-label":i("activitySequence")}),(0,h.jsx)("div",{className:"ch-sequence-preview",children:w&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)("b",{"data-seq":w.seq,title:`Seq ${w.seq}`,children:["#",(o!==null&&t[o]?o:l)+1]}),(0,h.jsx)("span",{style:{color:oe[w.kind]},children:i(w.kind)}),(0,h.jsx)("span",{children:ye(w.title==="user"||w.title==="assistant"?w.text:w.title,120)})]})}),(0,h.jsx)("p",{className:"ch-note",children:i("sequenceNote")})]})})}function At({summary:t,onFocus:e,t:r}){return(0,h.jsx)(V,{title:r("files"),className:"ch-file-card",aside:(0,h.jsxs)("span",{className:"ch-scope",children:[r("historyWindow")," \xB7 ",t?.files.length??"\u2014"]}),children:!t||t.files.length===0?(0,h.jsx)("p",{className:"ch-note",children:r(t?"noFiles":"unavailable")}):(0,h.jsx)("div",{className:"ch-file-list",children:t.files.map(s=>(0,h.jsxs)("button",{className:"ch-file-row",title:s.path,onClick:()=>e(s.recordIds[0]),children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("strong",{children:s.path.split(/[\\/]/).at(-1)}),(0,h.jsx)("small",{children:s.path})]}),(0,h.jsxs)("span",{children:[(0,h.jsxs)("i",{children:[r("reads")," ",s.reads]}),(0,h.jsxs)("i",{children:[r("writes")," ",s.writes]}),(0,h.jsxs)("i",{children:[r("searches")," ",s.searches]})]})]},s.path))})})}function Pt({summary:t,onFocus:e,t:r}){return(0,h.jsx)(V,{title:r("commands"),className:"ch-command-card",aside:(0,h.jsxs)("span",{className:"ch-scope",children:[r("historyWindow")," \xB7 ",t?.commands.length??"\u2014"]}),children:!t||t.commands.length===0?(0,h.jsx)("p",{className:"ch-note",children:r(t?"noCommands":"unavailable")}):(0,h.jsx)("div",{className:"ch-command-list",children:t.commands.map(s=>(0,h.jsxs)("div",{className:"ch-command-row",children:[(0,h.jsxs)("button",{className:"ch-command-main",onClick:()=>e(s.recordId),children:[(0,h.jsxs)("span",{className:"ch-command-seq",children:["#",s.seq]}),(0,h.jsx)("code",{children:s.command}),(0,h.jsx)("span",{className:s.isError?"ch-result-error":s.resultId&&s.isError===!1?"ch-result-known":"ch-result-state",title:r(s.isError?"failed":s.resultId?"completed":"pending"),children:s.isError?"!":s.resultId?s.isError===!1?"\u2713":"\u21B3":"\u2026"})]}),s.resultId&&(0,h.jsx)("button",{className:"ch-command-result",onClick:()=>e(s.resultId),children:r("toolOutput")})]},s.id))})})}function Mt({related:t,onSelect:e,t:r}){if(!t.length)return null;let s={subagent:"relationSubagent",fork:"relationFork",tree:"relationTree",parent:"relationParent"};return(0,h.jsxs)(V,{title:r("loadedFamily"),className:"ch-family-card",aside:(0,h.jsx)("span",{className:"ch-count",children:t.length}),children:[(0,h.jsx)("div",{className:"ch-family-list",children:t.map(n=>(0,h.jsxs)("button",{className:"ch-family-row",title:n.title||n.id,onClick:()=>e(n.id),children:[(0,h.jsx)("span",{className:"ch-family-branch","aria-hidden":"true",children:n.role==="parent"?"\u21B0":"\u21B3"}),(0,h.jsxs)("span",{children:[(0,h.jsxs)("small",{children:[r(n.role==="parent"?"parentConversation":"childConversations")," \xB7"," ",r(s[n.kind]),n.harness?` \xB7 ${n.harness}`:""]}),(0,h.jsx)("b",{children:n.title||n.id})]}),(0,h.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]},`${n.role}:${n.id}`))}),(0,h.jsx)("p",{className:"ch-note",children:r("familyScope")})]})}var Z=require("react");var re=require("react");function De(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ae=De();function Ut(t){ae=t}var be={exec:()=>null};function C(t,e=""){let r=typeof t=="string"?t:t.source,s={replace:(n,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(U.caret,"$1"),r=r.replace(n,o),s},getRegex:()=>new RegExp(r,e)};return s}var Ln=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),U={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},qn=/^(?:[ \t]*(?:\n|$))+/,Fn=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Un=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ke=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,jn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,We=/(?:[*+-]|\d{1,9}[.)])/,jt=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Bt=C(jt).replace(/bull/g,We).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Bn=C(jt).replace(/bull/g,We).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Ve=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Dn=/^[^\n]+/,Ze=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Wn=C(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ze).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Vn=C(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,We).getRegex(),Ce="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ge=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Zn=C("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ge).replace("tag",Ce).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Dt=C(Ve).replace("hr",ke).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ce).getRegex(),Gn=C(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Dt).getRegex(),Ke={blockquote:Gn,code:Fn,def:Wn,fences:Un,heading:jn,hr:ke,html:Zn,lheading:Bt,list:Vn,newline:qn,paragraph:Dt,table:be,text:Dn},Ot=C("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ke).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ce).getRegex(),Kn={...Ke,lheading:Bn,table:Ot,paragraph:C(Ve).replace("hr",ke).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ot).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ce).getRegex()},Xn={...Ke,html:C(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Ge).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:be,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:C(Ve).replace("hr",ke).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Bt).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Qn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Jn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Wt=/^( {2,}|\\)\n(?!\s*$)/,Yn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Ie=/[\p{P}\p{S}]/u,Xe=/[\s\p{P}\p{S}]/u,Vt=/[^\s\p{P}\p{S}]/u,er=C(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Xe).getRegex(),Zt=/(?!~)[\p{P}\p{S}]/u,tr=/(?!~)[\s\p{P}\p{S}]/u,nr=/(?:[^\s\p{P}\p{S}]|~)/u,rr=C(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ln?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Gt=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,sr=C(Gt,"u").replace(/punct/g,Ie).getRegex(),or=C(Gt,"u").replace(/punct/g,Zt).getRegex(),Kt="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ir=C(Kt,"gu").replace(/notPunctSpace/g,Vt).replace(/punctSpace/g,Xe).replace(/punct/g,Ie).getRegex(),ar=C(Kt,"gu").replace(/notPunctSpace/g,nr).replace(/punctSpace/g,tr).replace(/punct/g,Zt).getRegex(),cr=C("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Vt).replace(/punctSpace/g,Xe).replace(/punct/g,Ie).getRegex(),lr=C(/\\(punct)/,"gu").replace(/punct/g,Ie).getRegex(),dr=C(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),pr=C(Ge).replace("(?:-->|$)","-->").getRegex(),hr=C("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",pr).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Se=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,ur=C(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Se).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Xt=C(/^!?\[(label)\]\[(ref)\]/).replace("label",Se).replace("ref",Ze).getRegex(),Qt=C(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ze).getRegex(),gr=C("reflink|nolink(?!\\()","g").replace("reflink",Xt).replace("nolink",Qt).getRegex(),_t=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Qe={_backpedal:be,anyPunctuation:lr,autolink:dr,blockSkip:rr,br:Wt,code:Jn,del:be,emStrongLDelim:sr,emStrongRDelimAst:ir,emStrongRDelimUnd:cr,escape:Qn,link:ur,nolink:Qt,punctuation:er,reflink:Xt,reflinkSearch:gr,tag:hr,text:Yn,url:be},fr={...Qe,link:C(/^!?\[(label)\]\((.*?)\)/).replace("label",Se).getRegex(),reflink:C(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Se).getRegex()},Ue={...Qe,emStrongRDelimAst:ar,emStrongLDelim:or,url:C(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",_t).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:C(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",_t).getRegex()},mr={...Ue,br:C(Wt).replace("{2,}","*").getRegex(),text:C(Ue.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Te={normal:Ke,gfm:Kn,pedantic:Xn},fe={normal:Qe,gfm:Ue,breaks:mr,pedantic:fr},xr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ht=t=>xr[t];function X(t,e){if(e){if(U.escapeTest.test(t))return t.replace(U.escapeReplace,Ht)}else if(U.escapeTestNoEncode.test(t))return t.replace(U.escapeReplaceNoEncode,Ht);return t}function Lt(t){try{t=encodeURI(t).replace(U.percentDecode,"%")}catch{return null}return t}function qt(t,e){let r=t.replace(U.findPipe,(i,o,a)=>{let c=!1,l=o;for(;--l>=0&&a[l]==="\\";)c=!c;return c?"|":" |"}),s=r.split(U.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(U.slashPipe,"|");return s}function me(t,e,r){let s=t.length;if(s===0)return"";let n=0;for(;n<s;){let i=t.charAt(s-n-1);if(i===e&&!r)n++;else if(i!==e&&r)n++;else break}return t.slice(0,s-n)}function br(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])r++;else if(t[s]===e[1]&&(r--,r<0))return s;return r>0?-2:-1}function Ft(t,e,r,s,n){let i=e.href,o=e.title||null,a=t[1].replace(n.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:i,title:o,text:a,tokens:s.inlineTokens(a)};return s.state.inLink=!1,c}function kr(t,e,r){let s=t.match(r.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(i=>{let o=i.match(r.other.beginningSpace);if(o===null)return i;let[a]=o;return a.length>=n.length?i.slice(n.length):i}).join(`
`)}var Re=class{options;rules;lexer;constructor(t){this.options=t||ae}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:me(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],s=kr(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let s=me(r,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(r=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:me(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=me(e[0],`
`).split(`
`),s="",n="",i=[];for(;r.length>0;){let o=!1,a=[],c;for(c=0;c<r.length;c++)if(this.rules.other.blockquoteStart.test(r[c]))a.push(r[c]),o=!0;else if(!o)a.push(r[c]);else break;r=r.slice(c);let l=a.join(`
`),d=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,n=n?`${n}
${d}`:d;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,i,!0),this.lexer.state.top=u,r.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let v=f,g=v.raw+`
`+r.join(`
`),w=this.blockquote(g);i[i.length-1]=w,s=s.substring(0,s.length-v.raw.length)+w.raw,n=n.substring(0,n.length-v.text.length)+w.text;break}else if(f?.type==="list"){let v=f,g=v.raw+`
`+r.join(`
`),w=this.list(g);i[i.length-1]=w,s=s.substring(0,s.length-f.raw.length)+w.raw,n=n.substring(0,n.length-v.raw.length)+w.raw,r=g.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),s=r.length>1,n={type:"list",raw:"",ordered:s,start:s?+r.slice(0,-1):"",loose:!1,items:[]};r=s?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=s?r:"[*+-]");let i=this.rules.other.listItemRegex(r),o=!1;for(;t;){let c=!1,l="",d="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let u=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,y=>" ".repeat(3*y.length)),f=t.split(`
`,1)[0],v=!u.trim(),g=0;if(this.options.pedantic?(g=2,d=u.trimStart()):v?g=e[1].length+1:(g=e[2].search(this.rules.other.nonSpaceChar),g=g>4?1:g,d=u.slice(g),g+=e[1].length),v&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,t=t.substring(f.length+1),c=!0),!c){let y=this.rules.other.nextBulletRegex(g),L=this.rules.other.hrRegex(g),_=this.rules.other.fencesBeginRegex(g),z=this.rules.other.headingBeginRegex(g),S=this.rules.other.htmlBeginRegex(g);for(;t;){let I=t.split(`
`,1)[0],R;if(f=I,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),R=f):R=f.replace(this.rules.other.tabCharGlobal,"    "),_.test(f)||z.test(f)||S.test(f)||y.test(f)||L.test(f))break;if(R.search(this.rules.other.nonSpaceChar)>=g||!f.trim())d+=`
`+R.slice(g);else{if(v||u.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||_.test(u)||z.test(u)||L.test(u))break;d+=`
`+f}!v&&!f.trim()&&(v=!0),l+=I+`
`,t=t.substring(I.length+1),u=R.slice(g)}}n.loose||(o?n.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(o=!0));let w=null,m;this.options.gfm&&(w=this.rules.other.listIsTask.exec(d),w&&(m=w[0]!=="[ ] ",d=d.replace(this.rules.other.listReplaceTask,""))),n.items.push({type:"list_item",raw:l,task:!!w,checked:m,loose:!1,text:d,tokens:[]}),n.raw+=l}let a=n.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let c=0;c<n.items.length;c++)if(this.lexer.state.top=!1,n.items[c].tokens=this.lexer.blockTokens(n.items[c].text,[]),!n.loose){let l=n.items[c].tokens.filter(u=>u.type==="space"),d=l.length>0&&l.some(u=>this.rules.other.anyLine.test(u.raw));n.loose=d}if(n.loose)for(let c=0;c<n.items.length;c++)n.items[c].loose=!0;return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:s,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=qt(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<r.length;o++)i.header.push({text:r[o],tokens:this.lexer.inline(r[o]),header:!0,align:i.align[o]});for(let o of n)i.rows.push(qt(o,i.header.length).map((a,c)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[c]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let i=me(r.slice(0,-1),"\\");if((r.length-i.length)%2===0)return}else{let i=br(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let s=e[2],n="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],n=i[3])}else n=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),Ft(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let s=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[s.toLowerCase()];if(!n){let i=r[0].charAt(0);return{type:"text",raw:i,text:i}}return Ft(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,i,o,a=n,c=0,l=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,e=e.slice(-1*t.length+n);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(o=[...i].length,s[3]||s[4]){a+=o;continue}else if((s[5]||s[6])&&n%3&&!((n+o)%3)){c+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+c);let d=[...s[0]][0].length,u=t.slice(0,n+s.index+d+o);if(Math.min(n,o)%2){let v=u.slice(1,-1);return{type:"em",raw:u,text:v,tokens:this.lexer.inlineTokens(v)}}let f=u.slice(2,-2);return{type:"strong",raw:u,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return s&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){let e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,s;return e[2]==="@"?(r=e[1],s="mailto:"+r):(r=e[1],s=r),{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=e[0],s="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},B=class je{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ae,this.options.tokenizer=this.options.tokenizer||new Re,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:U,block:Te.normal,inline:fe.normal};this.options.pedantic?(r.block=Te.pedantic,r.inline=fe.pedantic):this.options.gfm&&(r.block=Te.gfm,this.options.breaks?r.inline=fe.breaks:r.inline=fe.gfm),this.tokenizer.rules=r}static get rules(){return{block:Te,inline:fe}}static lex(e,r){return new je(r).lex(e)}static lexInline(e,r){return new je(r).inlineTokens(e)}lex(e){e=e.replace(U.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let s=this.inlineQueue[r];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],s=!1){for(this.options.pedantic&&(e=e.replace(U.tabCharGlobal,"    ").replace(U.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(o=>(n=o.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let o=r.at(-1);n.raw.length===1&&o!==void 0?o.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let o=r.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.at(-1).src=o.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let o=r.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,a=e.slice(1),c;this.options.extensions.startBlock.forEach(l=>{c=l.call({lexer:this},a),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i))){let o=r.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):r.push(n),s=i.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let o=r.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):r.push(n);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let s=e,n=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,n.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=n[2]?n[2].length:0,s=s.slice(0,n.index+i)+"["+"a".repeat(n[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,a="";for(;e;){o||(a=""),o=!1;let c;if(this.options.extensions?.inline?.some(d=>(c=d.call({lexer:this},e,r))?(e=e.substring(c.raw.length),r.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);let d=r.at(-1);c.type==="text"&&d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):r.push(c);continue}if(c=this.tokenizer.emStrong(e,s,a)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.del(e)){e=e.substring(c.raw.length),r.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),r.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),r.push(c);continue}let l=e;if(this.options.extensions?.startInline){let d=1/0,u=e.slice(1),f;this.options.extensions.startInline.forEach(v=>{f=v.call({lexer:this},u),typeof f=="number"&&f>=0&&(d=Math.min(d,f))}),d<1/0&&d>=0&&(l=e.substring(0,d+1))}if(c=this.tokenizer.inlineText(l)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(a=c.raw.slice(-1)),o=!0;let d=r.at(-1);d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):r.push(c);continue}if(e){let d="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return r}},Ne=class{options;parser;constructor(t){this.options=t||ae}space(t){return""}code({text:t,lang:e,escaped:r}){let s=(e||"").match(U.notSpaceStart)?.[0],n=t.replace(U.endingNewline,"")+`
`;return s?'<pre><code class="language-'+X(s)+'">'+(r?n:X(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:X(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,s="";for(let o=0;o<t.items.length;o++){let a=t.items[o];s+=this.listitem(a)}let n=e?"ol":"ul",i=e&&r!==1?' start="'+r+'"':"";return"<"+n+i+`>
`+s+"</"+n+`>
`}listitem(t){let e="";if(t.task){let r=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=r+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=r+" "+X(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:r+" ",text:r+" ",escaped:!0}):e+=r+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let s="";for(let n=0;n<t.rows.length;n++){let i=t.rows[n];r="";for(let o=0;o<i.length;o++)r+=this.tablecell(i[o]);s+=this.tablerow({text:r})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${X(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let s=this.parser.parseInline(r),n=Lt(t);if(n===null)return s;t=n;let i='<a href="'+t+'"';return e&&(i+=' title="'+X(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:r,tokens:s}){s&&(r=this.parser.parseInline(s,this.parser.textRenderer));let n=Lt(t);if(n===null)return X(r);t=n;let i=`<img src="${t}" alt="${r}"`;return e&&(i+=` title="${X(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:X(t.text)}},Je=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},G=class Be{options;renderer;textRenderer;constructor(e){this.options=e||ae,this.options.renderer=this.options.renderer||new Ne,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Je}static parse(e,r){return new Be(r).parse(e)}static parseInline(e,r){return new Be(r).parseInline(e)}parse(e,r=!0){let s="";for(let n=0;n<e.length;n++){let i=e[n];if(this.options.extensions?.renderers?.[i.type]){let a=i,c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){s+=c||"";continue}}let o=i;switch(o.type){case"space":{s+=this.renderer.space(o);continue}case"hr":{s+=this.renderer.hr(o);continue}case"heading":{s+=this.renderer.heading(o);continue}case"code":{s+=this.renderer.code(o);continue}case"table":{s+=this.renderer.table(o);continue}case"blockquote":{s+=this.renderer.blockquote(o);continue}case"list":{s+=this.renderer.list(o);continue}case"html":{s+=this.renderer.html(o);continue}case"def":{s+=this.renderer.def(o);continue}case"paragraph":{s+=this.renderer.paragraph(o);continue}case"text":{let a=o,c=this.renderer.text(a);for(;n+1<e.length&&e[n+1].type==="text";)a=e[++n],c+=`
`+this.renderer.text(a);r?s+=this.renderer.paragraph({type:"paragraph",raw:c,text:c,tokens:[{type:"text",raw:c,text:c,escaped:!0}]}):s+=c;continue}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return s}parseInline(e,r=this.renderer){let s="";for(let n=0;n<e.length;n++){let i=e[n];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=a||"";continue}}let o=i;switch(o.type){case"escape":{s+=r.text(o);break}case"html":{s+=r.html(o);break}case"link":{s+=r.link(o);break}case"image":{s+=r.image(o);break}case"strong":{s+=r.strong(o);break}case"em":{s+=r.em(o);break}case"codespan":{s+=r.codespan(o);break}case"br":{s+=r.br(o);break}case"del":{s+=r.del(o);break}case"text":{s+=r.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return s}},xe=class{options;block;constructor(t){this.options=t||ae}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?B.lex:B.lexInline}provideParser(){return this.block?G.parse:G.parseInline}},wr=class{defaults=De();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=G;Renderer=Ne;TextRenderer=Je;Lexer=B;Tokenizer=Re;Hooks=xe;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let s of t)switch(r=r.concat(e.call(this,s)),s.type){case"table":{let n=s;for(let i of n.header)r=r.concat(this.walkTokens(i.tokens,e));for(let i of n.rows)for(let o of i)r=r.concat(this.walkTokens(o.tokens,e));break}case"list":{let n=s;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=s;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(i=>{let o=n[i].flat(1/0);r=r.concat(this.walkTokens(o,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let s={...r};if(s.async=this.defaults.async||s.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let i=e.renderers[n.name];i?e.renderers[n.name]=function(...o){let a=n.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[n.level];i?i.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),r.renderer){let n=this.defaults.renderer||new Ne(this.defaults);for(let i in r.renderer){if(!(i in n))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,a=r.renderer[o],c=n[o];n[o]=(...l)=>{let d=a.apply(n,l);return d===!1&&(d=c.apply(n,l)),d||""}}s.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new Re(this.defaults);for(let i in r.tokenizer){if(!(i in n))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,a=r.tokenizer[o],c=n[o];n[o]=(...l)=>{let d=a.apply(n,l);return d===!1&&(d=c.apply(n,l)),d}}s.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new xe;for(let i in r.hooks){if(!(i in n))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,a=r.hooks[o],c=n[o];xe.passThroughHooks.has(i)?n[o]=l=>{if(this.defaults.async&&xe.passThroughHooksRespectAsync.has(i))return(async()=>{let u=await a.call(n,l);return c.call(n,u)})();let d=a.call(n,l);return c.call(n,d)}:n[o]=(...l)=>{if(this.defaults.async)return(async()=>{let u=await a.apply(n,l);return u===!1&&(u=await c.apply(n,l)),u})();let d=a.apply(n,l);return d===!1&&(d=c.apply(n,l)),d}}s.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,i=r.walkTokens;s.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),n&&(a=a.concat(n.call(this,o))),a}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return B.lex(t,e??this.defaults)}parser(t,e){return G.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let s={...r},n={...this.defaults,...s},i=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let o=n.hooks?await n.hooks.preprocess(e):e,a=await(n.hooks?await n.hooks.provideLexer():t?B.lex:B.lexInline)(o,n),c=n.hooks?await n.hooks.processAllTokens(a):a;n.walkTokens&&await Promise.all(this.walkTokens(c,n.walkTokens));let l=await(n.hooks?await n.hooks.provideParser():t?G.parse:G.parseInline)(c,n);return n.hooks?await n.hooks.postprocess(l):l})().catch(i);try{n.hooks&&(e=n.hooks.preprocess(e));let o=(n.hooks?n.hooks.provideLexer():t?B.lex:B.lexInline)(e,n);n.hooks&&(o=n.hooks.processAllTokens(o)),n.walkTokens&&this.walkTokens(o,n.walkTokens);let a=(n.hooks?n.hooks.provideParser():t?G.parse:G.parseInline)(o,n);return n.hooks&&(a=n.hooks.postprocess(a)),a}catch(o){return i(o)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+X(r.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(r);throw r}}},ie=new wr;function E(t,e){return ie.parse(t,e)}E.options=E.setOptions=function(t){return ie.setOptions(t),E.defaults=ie.defaults,Ut(E.defaults),E};E.getDefaults=De;E.defaults=ae;E.use=function(...t){return ie.use(...t),E.defaults=ie.defaults,Ut(E.defaults),E};E.walkTokens=function(t,e){return ie.walkTokens(t,e)};E.parseInline=ie.parseInline;E.Parser=G;E.parser=G.parse;E.Renderer=Ne;E.TextRenderer=Je;E.Lexer=B;E.lexer=B.lex;E.Tokenizer=Re;E.Hooks=xe;E.parse=E;var Yr=E.options,es=E.setOptions,ts=E.use,ns=E.walkTokens,rs=E.parseInline;var ss=G.parse,os=B.lex;function Ye(t,e="https://example.invalid/"){try{let r=new URL(t,e);return["https:","http:","mailto:"].includes(r.protocol)?r.href:null}catch{return null}}function et(t){let e={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\xA0"};return t.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(r,s)=>{if(!s.startsWith("#"))return e[s.toLowerCase()]??r;let n=s.toLowerCase().startsWith("#x")?Number.parseInt(s.slice(2),16):Number.parseInt(s.slice(1),10);return n>0&&n<=1114111&&!(n>=55296&&n<=57343)?String.fromCodePoint(n):"\uFFFD"})}var T=require("react/jsx-runtime");function vr({text:t,lang:e,t:r}){let[s,n]=(0,re.useState)(!1);return(0,T.jsxs)("div",{className:"ch-code-block",children:[(0,T.jsxs)("header",{children:[(0,T.jsx)("span",{children:e||"text"}),(0,T.jsx)("button",{className:"ch-mini-button",onClick:()=>{navigator.clipboard.writeText(t).then(()=>n(!0)).catch(()=>n(!1))},children:r(s?"copied":"copyRecord")})]}),(0,T.jsx)("pre",{children:(0,T.jsx)("code",{children:t})})]})}function Jt(t,e,r=0){return r>16?t.map(s=>s.raw).join(""):t.map((s,n)=>{let i=a=>Jt(a,e,r+1),o;switch(s.type){case"space":o=null;break;case"paragraph":o=(0,T.jsx)("p",{children:i(s.tokens)});break;case"heading":{let a=s;o=(0,re.createElement)(`h${Math.min(6,Math.max(2,a.depth+1))}`,null,i(a.tokens));break}case"text":{let a=s;o=a.tokens?i(a.tokens):et(a.text);break}case"escape":o=et(s.text);break;case"strong":o=(0,T.jsx)("strong",{children:i(s.tokens)});break;case"em":o=(0,T.jsx)("em",{children:i(s.tokens)});break;case"del":o=(0,T.jsx)("del",{children:i(s.tokens)});break;case"codespan":o=(0,T.jsx)("code",{children:s.text});break;case"code":{let a=s;o=(0,T.jsx)(vr,{text:a.text,lang:a.lang,t:e});break}case"blockquote":o=(0,T.jsx)("blockquote",{children:i(s.tokens)});break;case"br":o=(0,T.jsx)("br",{});break;case"hr":o=(0,T.jsx)("hr",{});break;case"list":{let a=s,c=a.items.map((l,d)=>(0,T.jsxs)("li",{children:[l.task&&(0,T.jsxs)("span",{className:"ch-task-state","aria-label":e(l.checked?"taskChecked":"taskUnchecked"),children:[l.checked?"\u2611":"\u2610"," "]}),i(l.tokens)]},d));o=a.ordered?(0,T.jsx)("ol",{start:typeof a.start=="number"?a.start:1,children:c}):(0,T.jsx)("ul",{children:c});break}case"table":{let a=s;o=(0,T.jsx)("div",{className:"ch-rich-table",children:(0,T.jsxs)("table",{children:[(0,T.jsx)("thead",{children:(0,T.jsx)("tr",{children:a.header.map((c,l)=>(0,T.jsx)("th",{children:i(c.tokens)},l))})}),(0,T.jsx)("tbody",{children:a.rows.map((c,l)=>(0,T.jsx)("tr",{children:c.map((d,u)=>(0,T.jsx)("td",{children:i(d.tokens)},u))},l))})]})});break}case"link":{let a=s,c=Ye(a.href,location.href);o=c?(0,T.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:i(a.tokens)}):(0,T.jsx)("span",{children:i(a.tokens)});break}case"image":{let a=s,c=Ye(a.href,location.href),l=`${e("imageLink")}: ${a.text||a.href}`;o=c?(0,T.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:l}):(0,T.jsx)("span",{children:l});break}case"def":o=null;break;default:o=(0,T.jsx)("span",{children:s.raw})}return(0,T.jsx)(re.Fragment,{children:o},n)})}function Yt({text:t,t:e}){let r=(0,re.useMemo)(()=>B.lex(t,{gfm:!0,breaks:!1}),[t]);return(0,T.jsx)("div",{className:"ch-rich-text",children:Jt(r,e)})}var k=require("react/jsx-runtime");function Ee(t,e,r){return t.kind==="user"||t.kind==="assistant"?ye(t.text)||r(t.kind):e??t.toolName??(t.eventType==="tool/result"?r("toolOutput"):t.title)}function yr({item:t,title:e,t:r}){let[s,n]=(0,Z.useState)(t.kind==="user"||t.kind==="assistant"),[i,o]=(0,Z.useState)(!1),a=t.arguments??t.text;return(0,k.jsxs)("section",{className:"ch-record-detail","aria-label":r("recordDetails"),children:[(0,k.jsxs)("header",{children:[(0,k.jsxs)("div",{children:[(0,k.jsx)("span",{className:"ch-record-kind",style:{color:oe[t.kind]},children:r(t.kind)}),(0,k.jsx)("strong",{title:e,children:e}),(0,k.jsx)(qe,{item:t,t:r})]}),(0,k.jsxs)("div",{className:"ch-detail-controls",children:[(0,k.jsx)("button",{className:`ch-mini-button ${s?"is-active":""}`,"aria-pressed":s,onClick:()=>n(!0),children:r("renderedText")}),(0,k.jsx)("button",{className:`ch-mini-button ${s?"":"is-active"}`,"aria-pressed":!s,onClick:()=>n(!1),children:r("sourceText")}),(0,k.jsx)("button",{className:"ch-mini-button",onClick:()=>{navigator.clipboard.writeText(t.text).then(()=>o(!0)).catch(()=>o(!1))},children:r(i?"copied":"copyRecord")})]})]}),(0,k.jsxs)("div",{className:"ch-record-meta",children:[(0,k.jsxs)("span",{children:["#",t.seq]}),(0,k.jsx)("span",{title:r("recordTime"),children:t.time===void 0?r("unavailable"):de(t.time)}),t.callId&&(0,k.jsxs)("span",{title:t.callId,children:["Call ID \xB7 ",t.callId]})]}),(0,k.jsx)(wt,{item:t,t:r}),(0,k.jsx)("div",{className:"ch-record-content",children:t.text.length===0?(0,k.jsx)("p",{className:"ch-note",children:r("blank")}):s?(0,k.jsx)(Yt,{text:t.text,t:r}):(0,k.jsx)("pre",{className:"ch-source-text",children:(0,k.jsx)("code",{children:a||"\u2014"})})})]})}function en({items:t,available:e,toolByRecord:r,focus:s,onFocus:n,filter:i,onFilter:o,query:a,onQuery:c,loading:l,error:d,hasMore:u,older:f,latest:v,isOlder:g,retry:w,t:m}){let y=(0,Z.useDeferredValue)(a),[L,_]=(0,Z.useState)(!0),[z,S]=(0,Z.useState)(()=>new Set(["user","assistant"])),I=(0,Z.useMemo)(()=>{let b=y.trim().toLocaleLowerCase();return t.filter(q=>(i==="messages"?q.kind!=="user"&&q.kind!=="assistant":i!=="all"&&q.kind!==i)?!1:b.startsWith("tool:")?r.get(q.id)?.toLocaleLowerCase()===b.slice(5):`${Ee(q,r.get(q.id),m)} ${q.text}`.toLocaleLowerCase().includes(b))},[t,i,y,r,m]),R=I.find(b=>b.id===s)??I.findLast(b=>b.kind==="assistant"||b.kind==="user")??I.at(-1);(0,Z.useEffect)(()=>{a!==y||!R||(R.id!==s&&n(R.id),S(b=>b.has(R.kind)?b:new Set([...b,R.kind])))},[R?.id,s,a,y,n]);let F=(0,Z.useMemo)(()=>new Map(t.map((b,q)=>[b.id,q+1])),[t]),M=I.findIndex(b=>b.id===R?.id),H=b=>(0,k.jsxs)("button",{className:`ch-record-item ch-record-${b.kind} ${R?.id===b.id?"is-selected":""}`,"aria-pressed":R?.id===b.id,title:Ee(b,r.get(b.id),m),onClick:()=>n(b.id),children:[(0,k.jsxs)("span",{className:"ch-record-seq",title:`Seq ${b.seq}`,children:["#",F.get(b.id)]}),(0,k.jsx)("span",{className:"ch-record-title",children:Ee(b,r.get(b.id),m)}),(0,k.jsx)(qe,{item:b,t:m}),(0,k.jsx)("span",{className:"ch-record-time",children:b.time===void 0?"":de(b.time)})]},b.id),Me={user:"userMessages",assistant:"assistantMessages",tool:"tools",event:"events"};return(0,k.jsxs)(V,{title:m("browserTitle"),className:"ch-browser-card",aside:(0,k.jsxs)("span",{className:"ch-scope",children:[m("browserScope")," \xB7 ",e?t.length:"\u2014"]}),children:[(0,k.jsxs)("div",{className:"ch-browser-toolbar",children:[(0,k.jsx)("div",{className:"ch-filter",role:"group","aria-label":m("history"),children:["all","messages","tool","event"].map(b=>(0,k.jsx)("button",{className:i===b?"is-active":"","aria-pressed":i===b,onClick:()=>o(b),children:m(b==="tool"?"tools":b==="event"?"events":b)},b))}),(0,k.jsx)("button",{className:"ch-mini-button","aria-pressed":L,onClick:()=>_(b=>!b),children:m(L?"categories":"chronological")})]}),(0,k.jsxs)("div",{className:"ch-browser-search",children:[(0,k.jsx)("input",{value:a,onChange:b=>c(b.target.value),placeholder:m("searchRecords"),"aria-label":m("searchRecords")}),a&&(0,k.jsx)("button",{className:"ch-mini-button",onClick:()=>c(""),"aria-label":m("all"),children:"\xD7"}),(0,k.jsxs)("span",{children:[e?I.length:"\u2014","/",e?t.length:"\u2014"]})]}),d&&(0,k.jsxs)("div",{className:"ch-error",role:"alert",children:[(0,k.jsxs)("span",{children:[m("historyError")," ",d]}),(0,k.jsx)("button",{className:"ch-mini-button",onClick:w,children:m("retry")})]}),(0,k.jsx)("div",{className:"ch-browser-records","aria-busy":l||y!==a,children:l&&t.length===0?(0,k.jsx)("p",{className:"ch-note",children:m("historyLoading")}):I.length===0?(0,k.jsx)("p",{className:"ch-note",children:m(e?a?"noMatches":"noHistory":"unavailable")}):L?["user","assistant","tool","event"].map(b=>{let q=I.filter(te=>te.kind===b);return i==="messages"&&b!=="user"&&b!=="assistant"||i!=="messages"&&i!=="all"&&i!==b?null:(0,k.jsxs)("section",{className:`ch-record-group ch-group-${b}`,children:[(0,k.jsxs)("button",{className:"ch-group-heading","aria-expanded":z.has(b),disabled:q.length===0,onClick:()=>S(te=>{let se=new Set(te);return se.has(b)?se.delete(b):se.add(b),se}),children:[(0,k.jsx)("span",{"aria-hidden":"true",children:z.has(b)?"\u2304":"\u203A"}),(0,k.jsx)("i",{style:{background:oe[b]}}),(0,k.jsx)("b",{children:m(Me[b])}),(0,k.jsx)("span",{children:q.length})]}),z.has(b)&&q.map(H)]},b)}):I.map(H)}),(0,k.jsxs)("div",{className:"ch-record-navigation",children:[(0,k.jsx)("span",{className:"ch-note",children:m("historyWindow")}),(0,k.jsxs)("div",{children:[(0,k.jsx)("button",{className:"ch-mini-button",disabled:M<=0,onClick:()=>n(I[M-1].id),children:m("prevRecord")}),(0,k.jsxs)("span",{children:[e?M<0?0:M+1:"\u2014","/",e?I.length:"\u2014"]}),(0,k.jsx)("button",{className:"ch-mini-button",disabled:M<0||M===I.length-1,onClick:()=>n(I[M+1].id),children:m("nextRecord")})]})]}),R&&(0,k.jsx)(yr,{item:R,title:Ee(R,r.get(R.id),m),t:m},R.id),(0,k.jsxs)("footer",{className:"ch-browser-footer",children:[(0,k.jsx)("p",{className:"ch-note",children:m("historyNote")}),(0,k.jsxs)("div",{children:[g&&(0,k.jsx)("button",{className:"ch-mini-button",disabled:l,onClick:v,children:m("latestWindow")}),u&&(0,k.jsx)("button",{className:"ch-button",disabled:l,onClick:f,children:m(l?"historyLoading":"older")})]})]})]})}var P=require("react/jsx-runtime");function tn({usage:t,history:e,rows:r,selected:s,onSelect:n,retry:i,t:o}){let a=(0,Q.useRef)(null),[c,l]=(0,Q.useState)(),[d,u]=(0,Q.useState)("all"),[f,v]=(0,Q.useState)(""),g=(0,Q.useMemo)(()=>e.page?Tt(e.page.items):null,[e.page]),w=(0,Q.useMemo)(()=>Nt(r,s),[r,s]),m=e.page?.items??[],y=(0,Q.useMemo)(()=>{let z=new Map;for(let S of g?.tools??[])for(let I of S.recordIds)z.set(I,S.name);return z},[g]),L=()=>{requestAnimationFrame(()=>a.current?.querySelector(".ch-browser-card")?.scrollIntoView({block:"nearest"}))},_=(z,S=!0)=>{l(z),u("all"),v(""),S&&L()};return(0,P.jsxs)("div",{className:"ch-inspector",ref:a,children:[(0,P.jsx)(zt,{summary:g,t:o,onTool:z=>{u("tool"),v(`tool:${z}`),L()},onKind:z=>{u(z),v(""),L()}}),(0,P.jsxs)("div",{className:"ch-dashboard",children:[(0,P.jsx)(xt,{usage:t.usage,t:o}),(0,P.jsx)(bt,{usage:t.usage,t:o})]}),(0,P.jsxs)("div",{className:"ch-workbench",children:[(0,P.jsx)(mt,{usage:t.usage,t:o}),(0,P.jsx)($t,{items:m,available:e.page!==null,loading:e.loading,focus:c,onFocus:z=>_(z,!1),t:o}),(0,P.jsx)(en,{items:m,available:e.page!==null,toolByRecord:y,focus:c,onFocus:l,filter:d,onFilter:u,query:f,onQuery:v,loading:e.loading,error:e.error,hasMore:e.page?.hasMore??!1,older:e.older,latest:e.latest,isOlder:e.isOlder,retry:i,t:o}),(0,P.jsx)(At,{summary:g,onFocus:_,t:o}),(0,P.jsx)(Pt,{summary:g,onFocus:_,t:o}),(0,P.jsx)(Mt,{related:w,onSelect:n,t:o}),(0,P.jsxs)("details",{className:"ch-observations",children:[(0,P.jsxs)("summary",{children:[o("observationsDetail"),(0,P.jsx)("span",{children:t.samples.length})]}),(0,P.jsx)(kt,{samples:t.samples,t:o})]})]}),(0,P.jsxs)("p",{className:"ch-data-note",children:["\u24D8 ",o("limitsNote")]})]})}var $=require("react");var Tr=0;function A(t,e){if(t===null||typeof t!="object"||Array.isArray(t))throw new Error(`Invalid ${e}: expected an object`);return t}function he(t,e){if(typeof t!="string")throw new Error(`Invalid ${e}: expected a string`);return t}function ce(t,e){let r=he(t,e);if(!r.trim())throw new Error(`Invalid ${e}: expected a nonempty identity`);return r}function we(t,e){if(typeof t!="number"||!Number.isSafeInteger(t)||t<0)throw new Error(`Invalid ${e}: expected a nonnegative safe integer`);return t}function pe(t,e){return t==null?void 0:he(t,e)}function nn(t,e){if(t!=null){if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid ${e}: expected a finite number`);return t}}function tt(t){if(!t||typeof t!="object"||Array.isArray(t))return;let e=t,r=typeof e.code=="string"||typeof e.code=="number"?` (${String(e.code).slice(0,120)})`:"";return typeof e.message=="string"?`${e.message.slice(0,500)}${r}`:void 0}function Sr(t){let e=A(t,"session row"),r=A(e.projections,"session projections"),s=A(r.values,"session projection values"),n=s.harnessIdentity==null?void 0:pe(A(s.harnessIdentity,"harness identity").id,"harness id"),i=pe(e.cwd,"session cwd"),o=nn(e.updatedAt,"session updatedAt"),a=pe(e.parentSessionId,"parent session id"),c=pe(s.threadTreeParent,"thread tree parent"),l=pe(s.archiveForkParent,"fork parent");return{id:ce(e.sessionId,"session id"),title:pe(s.title,"session title")??"",...n===void 0?{}:{harness:n},...i===void 0?{}:{cwd:i},...o===void 0?{}:{updatedAt:o},...a===void 0?{}:{parentId:a},...c===void 0?{}:{treeParentId:c},...l===void 0?{}:{forkParentId:l},...e.origin==="subagent"?{origin:"subagent"}:{}}}function Rr(t,e){let r=A(t,"history record");if(r.type!=="event")throw new Error("Invalid history record: expected an event");let s=A(r.event,"history event");if(s.sessionId!==void 0&&s.sessionId!==e)throw new Error("Invalid history event: session identity mismatch");let n=we(s.seq,"history sequence"),i=ce(s.type,"history event type"),o=A(s.data,"history event data"),a=nn(s.time,"history time"),c="event",l=i,d="",u=!1,f=!1,v=!1,g=!1,w,m,y,L,_=S=>typeof S=="string"&&S.length>0&&S.length<=512?S:void 0;if(i==="tool/result"&&o.meta!=null){let S=A(o.meta,"tool result metadata");if(S.codexhostOutput!==void 0){if(!Array.isArray(S.codexhostOutput))throw new Error("Invalid tool output previews");for(let I of S.codexhostOutput){let R=A(I,"tool output preview"),F=A(R.reference,"tool output reference");if(F.sessionId!==e||F.seq!==n)throw new Error("Invalid tool output reference: identity mismatch");u=!0,f=!0,g=!0}}}let z=S=>{let I=d.length>0?`
`:"",R=8e3-d.length,F=I+S;F.length>R&&(u=!0,v=!0),d+=F.slice(0,R)};if(i==="user/message"||i==="assistant/message"||i==="tool/result"){c=i==="user/message"?"user":i==="assistant/message"?"assistant":"tool";let S=i==="user/message"?o:A(o.message,"history message");if(i==="tool/result"){let I=S.source&&typeof S.source=="object"&&!Array.isArray(S.source)?S.source:void 0;w=_(I?.callId),m=_(I?.name),typeof S.isError=="boolean"&&(L=S.isError)}if(l=i==="tool/result"?"tool/result":c,!Array.isArray(S.content))throw new Error("Invalid history message: expected content blocks");for(let I of S.content){let R=A(I,"history content block"),F=ce(R.type,"history content type");F==="text"||F==="reasoning"?z(he(R.text,"history content text")):F==="tool-call"?z(`${ce(R.name,"tool name")}
${he(R.arguments,"tool arguments")}`):g=!0}}else if(i==="tool/call"){c="tool",l=ce(o.name,"tool name"),m=l,w=_(o.callId);let S=he(o.arguments,"tool arguments");y=S.slice(0,8e3),z(S)}else z(JSON.stringify(o));return{id:JSON.stringify([e,n]),kind:c,title:l,text:d,seq:n,eventType:i,...w===void 0?{}:{callId:w},...m===void 0?{}:{toolName:m},...y===void 0?{}:{arguments:y},...L===void 0?{}:{isError:L},...a===void 0?{}:{time:a},...u?{clipped:!0}:{},...f?{hostPreview:!0}:{},...v?{textTruncated:!0}:{},...g?{contentUnavailable:!0}:{}}}var ze=class{fetcher;constructor(e=globalThis.fetch.bind(globalThis)){this.fetcher=e}async post(e,r,s){s.throwIfAborted();let n;try{n=await this.fetcher(e,{method:"POST",credentials:"same-origin",mode:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:s})}catch(a){throw s.throwIfAborted(),a instanceof Error&&a.name==="AbortError"?a:new Error(`${e}: request failed: ${a instanceof Error?a.message:"network unavailable"}`)}s.throwIfAborted();let i;try{i=await n.json()}catch(a){throw s.throwIfAborted(),a instanceof Error&&a.name==="AbortError"?a:new Error(`${e}: ${n.ok?"":`HTTP ${n.status}; `}invalid JSON response`)}if(s.throwIfAborted(),!n.ok){let a=i!==null&&typeof i=="object"&&!Array.isArray(i)?tt(i.error):void 0;throw new Error(`${e}: HTTP ${n.status}: ${a??"request rejected"}`)}let o=A(i,`${e} response envelope`);if(Object.hasOwn(o,"error"))throw new Error(`${e}: ${tt(o.error)??"request rejected"}`);return o}async sessionRpc(e,r,s){let n=`ch-context-${++Tr}`,i=await this.post(`api/${e}`,{type:"client-request",rpcId:n,method:e,payload:{args:r}},s);return this.sessionResult(i,n,e)}async listSessions(e,r){e!==null&&he(e,"session cursor");let s=A(await this.sessionRpc("session/list",e===null?{}:{cursor:e},r),"session page");if(!Array.isArray(s.items))throw new Error("Invalid session page: expected items");if(s.nextCursor!==null&&typeof s.nextCursor!="string")throw new Error("Invalid session page: expected a string or null nextCursor");if(e!==null&&s.nextCursor===e)throw new Error("Invalid session page: cursor did not advance");let n=s.items.map(Sr);if(new Set(n.map(i=>i.id)).size!==n.length)throw new Error("Invalid session page: repeated session identity");return{items:n,nextCursor:s.nextCursor}}sessionResult(e,r,s){if(e.type!=="server-response"||e.rpcId!==r)throw new Error(`${s}: response identity mismatch`);let n=A(e.result,`${s} result`);if(n.ok===!1)throw new Error(`${s}: ${tt(n.error)??"request rejected"}`);if(n.ok!==!0||!Object.hasOwn(n,"value")||Object.hasOwn(n,"error"))throw new Error(`${s}: invalid result envelope`);return n.value}async inspectUsage(e,r){ce(e,"thread id");let s=await this.post("api/ch/v1/rpc",{method:"codexhost/thread/usage/inspect",params:{threadId:e}},r),n=A(s.result,"usage result");if(n.threadId!==e)throw new Error("Invalid usage result: thread identity mismatch");if(!Object.hasOwn(n,"usage")||n.usage!==null&&(typeof n.usage!="object"||Array.isArray(n.usage)))throw new Error("Invalid usage result: expected a usage snapshot or null");return n}async history(e,r,s,n){if(ce(e,"session id"),s!==void 0&&(we(s,"beforeSeq"),n===void 0))throw new Error("throughSeq is required when beforeSeq is provided");if(n===void 0){let u=A(await this.sessionRpc("session/projections",{sessionId:e},r),"projection baseline");A(u.values,"projection baseline values"),n=we(u.asOfSeq,"projection baseline asOfSeq")}else we(n,"throughSeq");if(s!==void 0&&s>n+1)throw new Error("Invalid history boundary: beforeSeq exceeds throughSeq");let i=A(await this.sessionRpc("session/page",{address:{sessionId:e},throughSeq:n,maxMessages:50,...s===void 0?{}:{beforeSeq:s}},r),"history page");if(!Array.isArray(i.records)||typeof i.hasMore!="boolean")throw new Error("Invalid history page: expected records and hasMore");let o=-1;for(let u of i.records){let f=A(u,"history record");if(f.type!=="event")throw new Error("Invalid history record: expected an event");let v=A(f.event,"history event"),g=we(v.seq,"history sequence");if(g<=o||g>n||s!==void 0&&g>=s)throw new Error("Invalid history page: unordered, repeated or out-of-window sequence");o=g}if(i.hasMore&&(i.records.length===0||o===0))throw new Error("Invalid history page: pagination did not advance");let a=i.records.length>200,c=i.records.slice(-200).map(u=>Rr(u,e)),l=i.hasMore||a,d=c[0];if(l&&(!d||d.seq===0))throw new Error("Invalid history page: no earlier sequence is available");return{items:c,...d===void 0?{}:{beforeSeq:d.seq},hasMore:l,throughSeq:n,...a||c.some(u=>u.clipped)?{clipped:!0}:{},...c.some(u=>u.contentUnavailable)?{contentUnavailable:!0}:{}}}};function Nr(t,e){let r=W(t);return r?.type!=="changed"||typeof r.threadId=="string"&&r.threadId!==e?!1:typeof r.method=="string"&&["codexhost/thread/usage/updated","thread/tokenUsage/updated","thread/updated"].includes(r.method)}function rn(t,e,r,s=fetch){let n=new AbortController,i,o=0,a=async()=>{try{let c=await s("api/ch/v1/events",{credentials:"same-origin",signal:n.signal});if(!c.ok||c.body===null)throw new Error("Events unavailable");if(n.signal.aborted)return;r(!0),o=0;let l=c.body.getReader(),d=new TextDecoder,u="";try{for(;!n.signal.aborted;){let f=await l.read();if(f.done)break;if(u+=d.decode(f.value,{stream:!0}),u.length>1024*1024)throw new Error("Event frame too large");let v;for(;(v=u.indexOf(`
`))!==-1;){let g=u.slice(0,v).trim();if(u=u.slice(v+1),!!g)try{Nr(JSON.parse(g),t)&&e()}catch{continue}}}}finally{await l.cancel().catch(()=>{}),l.releaseLock()}}catch{if(n.signal.aborted)return}n.signal.aborted||(r(!1),i=setTimeout(()=>{a()},Math.min(15e3,1e3*2**o++)))};return a(),()=>{n.abort(),i!==void 0&&clearTimeout(i)}}var nt=new ze,sn=()=>()=>{};function on(t){let e=(0,$.useCallback)(s=>t.locale.subscribe?.(s)??sn(),[t]),r=(0,$.useCallback)(()=>t.locale.getLocale?.().active??"en",[t]);return(0,$.useSyncExternalStore)(e,r,r)}function an(t){let e=W(t.get("uiSession")),s=W(e?.adapter)?.current,n=(0,$.useCallback)(o=>s?.subscribe(o)??sn(),[s]),i=(0,$.useCallback)(()=>{let o=W(s?.getSnapshot())?.key;return typeof o=="string"?o:void 0},[s]);return(0,$.useSyncExternalStore)(n,i,i)}function cn(t,e){let[r,s]=(0,$.useState)({key:"",page:null,loading:!0,error:null}),n=`${t??""}:${e}`;return(0,$.useEffect)(()=>{let i=new AbortController;return s({key:n,page:null,loading:!0,error:null}),nt.listSessions(t,i.signal).then(o=>{i.signal.aborted||s({key:n,page:o,loading:!1,error:null})}).catch(o=>{i.signal.aborted||s({key:n,page:null,loading:!1,error:String(o instanceof Error?o.message:o)})}),()=>i.abort()},[t,n]),r.key===n?r:{page:null,loading:!0,error:null}}function ln(t,e,r){let s=(0,$.useRef)({id:t,projection:e,generation:0});(s.current.id!==t||s.current.projection!==e)&&(s.current={id:t,projection:e,generation:s.current.generation+1});let[n,i]=(0,$.useState)({id:t,usage:null,loading:!!t,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0});return(0,$.useEffect)(()=>{if(e===void 0||!t)return;let o=_e(e),a=Date.now();i(c=>({id:t,usage:o,loading:!1,error:null,connected:!0,samples:Le(c.id===t?c.samples:[],o,a),updatedAt:a,snapshotSequence:(c.id===t?c.snapshotSequence:0)+1}))},[t,e]),(0,$.useEffect)(()=>{let o=new AbortController,a,c=!1,l=!1,d=async()=>{if(!t||o.signal.aborted)return;if(c){l=!0;return}c=!0;let f=s.current.generation,v=()=>!o.signal.aborted&&s.current.generation===f;try{let g=await nt.inspectUsage(t,o.signal);if(!v())return;let w=_e(g),m=Date.now();i(y=>v()?{id:t,usage:w,loading:!1,error:null,connected:!0,samples:Le(y.id===t?y.samples:[],w,m),updatedAt:m,snapshotSequence:(y.id===t?y.snapshotSequence:0)+1}:y)}catch(g){v()&&i(w=>v()?{...w.id===t?w:{id:t,usage:null,connected:!1,samples:[],updatedAt:null,snapshotSequence:0},loading:!1,error:String(g instanceof Error?g.message:g)}:w)}finally{c=!1,l&&!o.signal.aborted&&(l=!1,d())}};(e===void 0||r>0)&&(i(f=>f.id===t?{...f,loading:!!t,error:null}:{id:t,usage:null,loading:!!t,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}),d());let u=t&&e===void 0?rn(t,()=>{a!==void 0&&clearTimeout(a),a=setTimeout(()=>{d()},150)},f=>{o.signal.aborted||i(v=>v.id===t?{...v,connected:f}:v),f&&d()}):void 0;return()=>{o.abort(),u?.(),a!==void 0&&clearTimeout(a)}},[t,e===void 0,r]),n.id===t?n:{id:t,usage:null,loading:!!t,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}}function dn(t,e,r=null){let s=(0,$.useRef)({id:t,generation:0});s.current.id!==t&&(s.current={id:t,generation:s.current.generation+1});let[n,i]=(0,$.useState)(null),o=n&&n.id===t&&n.generation===s.current.generation?n.before:void 0,a=o!==void 0?n?.through:void 0,c=o===void 0?r:null,[l,d]=(0,$.useState)({page:null,loading:!1,error:null});(0,$.useEffect)(()=>i(null),[t]),(0,$.useEffect)(()=>{if(!t)return;let f=new AbortController;d(w=>({id:t,page:w.id===t?w.page:null,loading:!0,error:null}));let v=()=>{nt.history(t,f.signal,o,a).then(w=>{f.signal.aborted||d({id:t,page:w,loading:!1,error:null})}).catch(w=>{f.signal.aborted||d(m=>({id:t,page:m.id===t?m.page:null,loading:!1,error:String(w instanceof Error?w.message:w)}))})},g=c!==null&&l.id===t&&l.page!==null?setTimeout(v,350):void 0;return g===void 0&&v(),()=>{f.abort(),g!==void 0&&clearTimeout(g)}},[t,o,a,e,c]);let u=l.id===t?l:{page:null,loading:!!t,error:null};return{...u,latest:()=>i(null),isOlder:o!==void 0,older:()=>{t&&u.page?.beforeSeq!==void 0&&i({id:t,generation:s.current.generation,before:u.page.beforeSeq,through:u.page.throughSeq})}}}var rt={title:"Context insights",subtitle:"A clearer view of your conversation.",tab:"Context",sessions:"Conversations",search:"Search this page",next:"Next page",previous:"Previous page",refresh:"Refresh",loading:"Loading\u2026",noSession:"Choose a conversation",choose:"Select a conversation to inspect the context and usage reported by its Harness.",unavailable:"Not reported",noUsage:"This Harness has not reported usage for this conversation yet.",context:"Current context",used:"Used tokens",capacity:"Window capacity",remaining:"Remaining capacity",occupancy:"Context occupancy",cumulative:"Cumulative usage",input:"Input tokens",output:"Output tokens",cacheRead:"Cache read",cacheWrite:"Cache write",total:"Total tokens",cost:"Session cost",costEstimate:"Public-price estimate",costNative:"Native cost",partialPrice:"Some models are unpriced; this is a lower bound.",performance:"Performance & cache",tps:"Output speed",avgTps:"Average output speed",ttft:"Time to first output",cacheHit:"Latest cache hit",avgCache:"Average cache hit",credits:"AI credits",timeline:"Context observations",timelineNote:"Changes observed while this panel is open. This is not the complete request history.",needSamples:"The next context change will appear here.",observed:"Samples",history:"Messages & tools",all:"All",messages:"Messages",tools:"Tools",events:"Events",historyNote:"Conversation records are not the exact model request body.",noHistory:"No records in this history window.",older:"Load older records",historyLoading:"Reading history\u2026",historyError:"History could not be loaded.",retry:"Retry",copy:"Copy usage JSON",copied:"Copied",copyFailed:"Copy failed",source:"Reported by CodexHost",live:"Live",disconnected:"Reconnecting",limits:"Detailed context composition",limitsNote:"The Host does not expose separate system-prompt, tool-definition and message token counts. No breakdown is estimated.",readOnly:"Read-only \xB7 conversations and prompts unchanged",emptyList:"No conversations on this page.",usageError:"Usage could not be loaded.",listError:"Conversations could not be loaded.",compatibilityTitle:"Context Insights (compatibility)",titleShort:"CH Context",settingsNote:"Open Context insights from the sidebar, or the Context tab inside a conversation.",localOnly:"Snapshots are read from this CodexHost instance. No conversation data is sent to a third-party service.",user:"User",assistant:"Assistant",tool:"Tool",event:"Event",date:"Updated",page:"Page",loadedSearch:"Search applies to this page.",following:"Current conversation",sampled:"Observed context",retained:"Up to 120 changed snapshots are retained in memory for the selected conversation.",details:"Show details",hideDetails:"Hide details",errorBoundary:"This panel could not render the available data.",count:"records",previewShort:"Preview",partialShort:"Partial",hostPreview:"The Host supplied a preview; the complete tool output is not included.",textTruncated:"Text shortened to 8,000 characters in this view.",contentUnavailable:"Some content is unavailable in this view, including unsupported media or omitted output.",clipped:"Long records may contain only the Host-provided preview.",activityStats:"Conversation stats",historyWindow:"Loaded history window",userMessages:"User messages",assistantMessages:"Assistant messages",toolCalls:"Tool calls",toolResults:"Tool results",toolUse:"Tool activity",commands:"Shell commands",files:"File activity",reads:"Read",writes:"Write / edit",searches:"Search",activityTimeline:"Activity timeline",activitySequence:"Browse event sequence",sequenceNote:"Event order in this history window; bar height does not represent token counts or duration.",prevRecord:"Previous record",nextRecord:"Next record",browserTitle:"Context browser",browserScope:"Conversation records",searchRecords:"Search this history window",categories:"Categories",chronological:"Sequence",sourceText:"Raw text",renderedText:"Rendered",copyRecord:"Copy",recordDetails:"Record details",argumentsLabel:"Arguments",toolOutput:"Tool output",recordTime:"Host record time",noCommands:"No recognized shell commands in this history window.",noFiles:"No recognized file paths in this history window.",noMatches:"No matching records.",loadedFamily:"Conversation relationships",familyScope:"Relationships reported among conversations on the loaded page.",parentConversation:"Parent",childConversations:"Child conversation",openConversation:"Open conversation",inputOutput:"Input + output",uncachedInput:"Uncached input",inputIncludesCache:"Input includes cache reads and writes.",changeConversation:"Change conversation",latestWindow:"Latest history",blank:"No textual content",taskChecked:"Completed task",taskUnchecked:"Incomplete task",imageLink:"Image link",completed:"Result recorded",pending:"No result in this window",failed:"Error",toolError:"The Host marked this tool result as an error.",relationSubagent:"Subagent",relationFork:"Fork",relationTree:"Thread tree",relationParent:"Parent link",expandGroup:"Expand group",eventCounts:"Events by kind",observationsDetail:"Observed context changes"},st={title:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF",subtitle:"\u770B\u6E05\u6BCF\u6BB5\u5BF9\u8BDD\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",tab:"\u4E0A\u4E0B\u6587",sessions:"\u4F1A\u8BDD",search:"\u641C\u7D22\u5F53\u524D\u9875\u4F1A\u8BDD",next:"\u4E0B\u4E00\u9875",previous:"\u4E0A\u4E00\u9875",refresh:"\u5237\u65B0",loading:"\u52A0\u8F7D\u4E2D\u2026",noSession:"\u9009\u62E9\u4E00\u4E2A\u4F1A\u8BDD",choose:"\u9009\u62E9\u4F1A\u8BDD\uFF0C\u67E5\u770B\u5176 Harness \u4E0A\u62A5\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",unavailable:"\u672A\u4E0A\u62A5",noUsage:"\u6B64 Harness \u5C1A\u672A\u4E0A\u62A5\u8BE5\u4F1A\u8BDD\u7684\u7528\u91CF\u3002",context:"\u5F53\u524D\u4E0A\u4E0B\u6587",used:"\u5DF2\u7528 Token",capacity:"\u7A97\u53E3\u5BB9\u91CF",remaining:"\u5269\u4F59\u5BB9\u91CF",occupancy:"\u4E0A\u4E0B\u6587\u5360\u7528",cumulative:"\u7D2F\u8BA1\u7528\u91CF",input:"\u8F93\u5165 Token",output:"\u8F93\u51FA Token",cacheRead:"\u7F13\u5B58\u8BFB\u53D6",cacheWrite:"\u7F13\u5B58\u5199\u5165",total:"\u603B Token",cost:"\u4F1A\u8BDD\u8D39\u7528",costEstimate:"\u6309\u516C\u5F00\u4EF7\u683C\u4F30\u7B97",costNative:"\u539F\u751F\u8D39\u7528",partialPrice:"\u90E8\u5206\u6A21\u578B\u5C1A\u672A\u5B9A\u4EF7\uFF0C\u6B64\u91D1\u989D\u4E3A\u4E0B\u9650\u3002",performance:"\u6027\u80FD\u4E0E\u7F13\u5B58",tps:"\u8F93\u51FA\u901F\u5EA6",avgTps:"\u5E73\u5747\u8F93\u51FA\u901F\u5EA6",ttft:"\u9996\u4E2A\u8F93\u51FA\u5EF6\u8FDF",cacheHit:"\u6700\u8FD1\u7F13\u5B58\u547D\u4E2D",avgCache:"\u5E73\u5747\u7F13\u5B58\u547D\u4E2D",credits:"AI Credits",timeline:"\u4E0A\u4E0B\u6587\u89C2\u6D4B",timelineNote:"\u4EC5\u8BB0\u5F55\u9762\u677F\u6253\u5F00\u671F\u95F4\u7684\u53D8\u5316\uFF0C\u4E0D\u4EE3\u8868\u5B8C\u6574\u8BF7\u6C42\u5386\u53F2\u3002",needSamples:"\u4E0B\u4E00\u6B21\u4E0A\u4E0B\u6587\u53D8\u5316\u5C06\u5728\u6B64\u663E\u793A\u3002",observed:"\u89C2\u6D4B\u5FEB\u7167",history:"\u6D88\u606F\u4E0E\u5DE5\u5177",all:"\u5168\u90E8",messages:"\u6D88\u606F",tools:"\u5DE5\u5177",events:"\u4E8B\u4EF6",historyNote:"\u4F1A\u8BDD\u8BB0\u5F55\u4E0D\u7B49\u540C\u4E8E\u6A21\u578B\u5B9E\u9645\u6536\u5230\u7684\u5B8C\u6574\u8BF7\u6C42\u3002",noHistory:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u8BB0\u5F55\u3002",older:"\u52A0\u8F7D\u66F4\u65E9\u8BB0\u5F55",historyLoading:"\u6B63\u5728\u8BFB\u53D6\u5386\u53F2\u2026",historyError:"\u5386\u53F2\u52A0\u8F7D\u5931\u8D25\u3002",retry:"\u91CD\u8BD5",copy:"\u590D\u5236\u7528\u91CF JSON",copied:"\u5DF2\u590D\u5236",copyFailed:"\u590D\u5236\u5931\u8D25",source:"\u7531 CodexHost \u4E0A\u62A5",live:"\u5B9E\u65F6\u66F4\u65B0",disconnected:"\u6B63\u5728\u91CD\u8FDE",limits:"\u8BE6\u7EC6\u4E0A\u4E0B\u6587\u7EC4\u6210",limitsNote:"\u5BBF\u4E3B\u5C1A\u672A\u63D0\u4F9B\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3001\u5DE5\u5177\u5B9A\u4E49\u4E0E\u6D88\u606F\u5404\u81EA\u7684 Token \u6570\u91CF\uFF0C\u6B64\u5904\u4E0D\u4F30\u7B97\u62C6\u5206\u3002",readOnly:"\u53EA\u8BFB \xB7 \u4E0D\u4FEE\u6539\u4F1A\u8BDD\u6216\u63D0\u793A\u8BCD",emptyList:"\u5F53\u524D\u9875\u6CA1\u6709\u4F1A\u8BDD\u3002",usageError:"\u7528\u91CF\u52A0\u8F7D\u5931\u8D25\u3002",listError:"\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25\u3002",compatibilityTitle:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF\uFF08\u517C\u5BB9\u5165\u53E3\uFF09",titleShort:"CH Context",settingsNote:"\u4ECE\u4FA7\u680F\u6253\u5F00\u300C\u4E0A\u4E0B\u6587\u6D1E\u5BDF\u300D\uFF0C\u6216\u8FDB\u5165\u4F1A\u8BDD\u5185\u7684\u300C\u4E0A\u4E0B\u6587\u300D\u9875\u7B7E\u3002",localOnly:"\u6570\u636E\u8BFB\u53D6\u81EA\u5F53\u524D CodexHost \u5B9E\u4F8B\uFF0C\u4E0D\u5411\u7B2C\u4E09\u65B9\u670D\u52A1\u53D1\u9001\u4F1A\u8BDD\u5185\u5BB9\u3002",user:"\u7528\u6237",assistant:"\u52A9\u624B",tool:"\u5DE5\u5177",event:"\u4E8B\u4EF6",date:"\u66F4\u65B0\u65F6\u95F4",page:"\u7B2C",loadedSearch:"\u641C\u7D22\u8303\u56F4\u4E3A\u5F53\u524D\u9875\u3002",following:"\u5F53\u524D\u4F1A\u8BDD",sampled:"\u4E0A\u4E0B\u6587\u89C2\u6D4B\u503C",retained:"\u4EC5\u5728\u5185\u5B58\u4E2D\u4FDD\u7559\u6240\u9009\u4F1A\u8BDD\u6700\u8FD1 120 \u6B21\u53D8\u5316\u5FEB\u7167\u3002",details:"\u663E\u793A\u8BE6\u60C5",hideDetails:"\u6536\u8D77\u8BE6\u60C5",errorBoundary:"\u9762\u677F\u65E0\u6CD5\u663E\u793A\u5F53\u524D\u6570\u636E\u3002",count:"\u6761\u8BB0\u5F55",previewShort:"\u9884\u89C8",partialShort:"\u90E8\u5206\u5185\u5BB9",hostPreview:"\u5BBF\u4E3B\u4EC5\u63D0\u4F9B\u9884\u89C8\uFF0C\u672A\u5305\u542B\u5B8C\u6574\u5DE5\u5177\u8F93\u51FA\u3002",textTruncated:"\u5F53\u524D\u89C6\u56FE\u4E2D\u7684\u6587\u672C\u5DF2\u622A\u53D6\u81F3 8,000 \u4E2A\u5B57\u7B26\u3002",contentUnavailable:"\u6B64\u89C6\u56FE\u65E0\u6CD5\u663E\u793A\u90E8\u5206\u5185\u5BB9\uFF0C\u4F8B\u5982\u672A\u652F\u6301\u7684\u5A92\u4F53\u6216\u7701\u7565\u7684\u8F93\u51FA\u3002",clipped:"\u8F83\u957F\u8BB0\u5F55\u53EF\u80FD\u4EC5\u5305\u542B\u5BBF\u4E3B\u63D0\u4F9B\u7684\u9884\u89C8\u3002",activityStats:"\u4F1A\u8BDD\u7EDF\u8BA1",historyWindow:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3",userMessages:"\u7528\u6237\u6D88\u606F",assistantMessages:"\u52A9\u624B\u6D88\u606F",toolCalls:"\u5DE5\u5177\u8C03\u7528",toolResults:"\u5DE5\u5177\u7ED3\u679C",toolUse:"\u5DE5\u5177\u6D3B\u52A8",commands:"\u547D\u4EE4\u8BB0\u5F55",files:"\u6587\u4EF6\u6D3B\u52A8",reads:"\u8BFB\u53D6",writes:"\u5199\u5165 / \u7F16\u8F91",searches:"\u641C\u7D22",activityTimeline:"\u6D3B\u52A8\u65F6\u95F4\u7EBF",activitySequence:"\u6D4F\u89C8\u4E8B\u4EF6\u5E8F\u5217",sequenceNote:"\u5C55\u793A\u6B64\u5386\u53F2\u7A97\u53E3\u4E2D\u7684\u4E8B\u4EF6\u987A\u5E8F\uFF0C\u67F1\u9AD8\u4E0D\u8868\u793A Token \u6570\u91CF\u6216\u8017\u65F6\u3002",prevRecord:"\u4E0A\u4E00\u6761\u8BB0\u5F55",nextRecord:"\u4E0B\u4E00\u6761\u8BB0\u5F55",browserTitle:"\u4E0A\u4E0B\u6587\u6D4F\u89C8\u5668",browserScope:"\u4F1A\u8BDD\u8BB0\u5F55",searchRecords:"\u641C\u7D22\u5F53\u524D\u5386\u53F2\u7A97\u53E3",categories:"\u5206\u7C7B",chronological:"\u987A\u5E8F",sourceText:"\u539F\u6587",renderedText:"\u6E32\u67D3",copyRecord:"\u590D\u5236",recordDetails:"\u8BB0\u5F55\u8BE6\u60C5",argumentsLabel:"\u53C2\u6570",toolOutput:"\u5DE5\u5177\u8F93\u51FA",recordTime:"\u5BBF\u4E3B\u8BB0\u5F55\u65F6\u95F4",noCommands:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684 Shell \u547D\u4EE4\u3002",noFiles:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u6587\u4EF6\u8DEF\u5F84\u3002",noMatches:"\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5F55\u3002",loadedFamily:"\u4F1A\u8BDD\u5173\u7CFB",familyScope:"\u4EC5\u5C55\u793A\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\u4E2D\u7531\u5BBF\u4E3B\u4E0A\u62A5\u7684\u5173\u7CFB\u3002",parentConversation:"\u7236\u4F1A\u8BDD",childConversations:"\u5B50\u4F1A\u8BDD",openConversation:"\u6253\u5F00\u4F1A\u8BDD",inputOutput:"\u8F93\u5165 + \u8F93\u51FA",uncachedInput:"\u672A\u7F13\u5B58\u8F93\u5165",inputIncludesCache:"\u8F93\u5165\u7528\u91CF\u5DF2\u5305\u542B\u7F13\u5B58\u8BFB\u53D6\u4E0E\u5199\u5165\u3002",changeConversation:"\u5207\u6362\u4F1A\u8BDD",latestWindow:"\u6700\u65B0\u5386\u53F2",blank:"\u6CA1\u6709\u6587\u672C\u5185\u5BB9",taskChecked:"\u5DF2\u5B8C\u6210\u4EFB\u52A1",taskUnchecked:"\u672A\u5B8C\u6210\u4EFB\u52A1",imageLink:"\u56FE\u7247\u94FE\u63A5",completed:"\u5DF2\u8BB0\u5F55\u7ED3\u679C",pending:"\u672C\u7A97\u53E3\u65E0\u7ED3\u679C",failed:"\u9519\u8BEF",toolError:"\u5BBF\u4E3B\u5DF2\u5C06\u6B64\u5DE5\u5177\u7ED3\u679C\u6807\u8BB0\u4E3A\u9519\u8BEF\u3002",relationSubagent:"\u5B50\u4EE3\u7406",relationFork:"\u5206\u53C9",relationTree:"\u4F1A\u8BDD\u6811",relationParent:"\u4E0A\u7EA7\u5173\u7CFB",expandGroup:"\u5C55\u5F00\u5206\u7EC4",eventCounts:"\u4E8B\u4EF6\u7C7B\u522B",observationsDetail:"\u4E0A\u4E0B\u6587\u53D8\u5316\u89C2\u6D4B"};function $e(t){let e=t.toLowerCase().startsWith("zh")?st:rt;return r=>e[r]}var pn=require("react"),ve=new WeakMap;function hn(t,e){(0,pn.useLayoutEffect)(()=>{if(!e)return;let r=t.current?.closest("[data-conversation-scroll]");if(r)return ve.set(r,(ve.get(r)??0)+1),r.setAttribute("data-ch-context-surface",""),()=>{let s=(ve.get(r)??1)-1;s>0?ve.set(r,s):(ve.delete(r),r.removeAttribute("data-ch-context-surface"))}},[t,e])}var x=require("react/jsx-runtime");function ot({ctx:t,sessionId:e,projection:r,embedded:s=!1,headerActions:n}){let i=(0,j.useRef)(null);hn(i,s);let o=on(t),a=(0,j.useMemo)(()=>$e(o),[o]),c=an(t),[l,d]=(0,j.useState)(),[u,f]=(0,j.useState)(!1),v=e??l??c,g=ee(v)?v:void 0,[w,m]=(0,j.useState)(0),[y,L]=(0,j.useState)([null]),[_,z]=(0,j.useState)(0),[S,I]=(0,j.useState)(""),[R,F]=(0,j.useState)("idle"),M=cn(y[_]??null,w),H=ln(g,r,w),Me=dn(g,w,H.snapshotSequence||null),b=M.page?.items.find(N=>N.id===g),q=(M.page?.items??[]).filter(N=>ee(N.id)&&`${N.title} ${N.harness??""} ${N.cwd??""}`.toLocaleLowerCase().includes(S.toLocaleLowerCase()));(0,j.useEffect)(()=>{F("idle")},[g]);let te=()=>m(N=>N+1),se=N=>{if(s){let le=W(t.get("uiWorkspace"));typeof le?.openSession=="function"&&le.openSession(N);return}d(N),f(!1)},mn=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({threadId:g,observedAt:H.updatedAt,usage:H.usage},null,2)),F("done")}catch{F("failed")}};return(0,x.jsx)("div",{ref:i,className:`ch-context ${s?"ch-embedded":""}`,lang:o.startsWith("zh")?"zh-CN":"en",children:(0,x.jsxs)("div",{className:"ch-shell",children:[(0,x.jsxs)("header",{className:`ch-page-heading ${s?"ch-heading-embedded":""}`,children:[(0,x.jsxs)("div",{className:"ch-heading-title",children:[(0,x.jsxs)("div",{className:"ch-brand",children:[(0,x.jsx)(ue,{size:14}),(0,x.jsx)("span",{children:"CH CONTEXT"}),(0,x.jsx)("a",{className:"ch-version",href:"https://github.com/ABC-xiaoxuan/ch-context",target:"_blank",rel:"noopener noreferrer",children:"0.2.0"})]}),!s&&(0,x.jsx)("h1",{children:a("title")})]}),(0,x.jsxs)("div",{className:"ch-heading-actions",children:[n,(0,x.jsxs)("span",{className:`ch-status ${H.connected?"":"is-offline"}`,children:[(0,x.jsx)("i",{}),a(H.connected?"live":"disconnected")]}),g&&(0,x.jsx)("button",{className:"ch-mini-button",disabled:!H.usage,onClick:()=>{mn()},children:a(R==="done"?"copied":R==="failed"?"copyFailed":"copy")}),(0,x.jsx)("button",{className:"ch-button",disabled:H.loading,onClick:te,children:a(H.loading?"loading":"refresh")})]})]}),!s&&(0,x.jsxs)("details",{className:"ch-session-picker",open:u||!g,onToggle:N=>f(N.currentTarget.open),children:[(0,x.jsxs)("summary",{children:[(0,x.jsx)("span",{children:a("sessions")}),(0,x.jsx)("strong",{children:b?.title||a(g?"following":"noSession")}),(0,x.jsx)("span",{className:"ch-session-harness",children:b?.harness??"CodexHost"}),(0,x.jsx)("small",{children:a("changeConversation")})]}),(0,x.jsxs)("div",{className:"ch-session-picker-body",children:[(0,x.jsxs)("div",{className:"ch-picker-header",children:[(0,x.jsxs)("label",{className:"ch-search",children:[(0,x.jsx)("span",{"aria-hidden":"true",children:"\u2315"}),(0,x.jsx)("input",{value:S,onChange:N=>I(N.target.value),placeholder:a("search"),"aria-label":a("search")})]}),ee(c)&&(0,x.jsx)("button",{className:"ch-mini-button",onClick:()=>{d(void 0),f(!1)},children:a("following")})]}),M.error?(0,x.jsxs)("div",{className:"ch-error",role:"alert",children:[a("listError"),(0,x.jsx)("span",{children:M.error}),(0,x.jsx)("button",{className:"ch-mini-button",onClick:te,children:a("retry")})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("div",{className:"ch-session-list",role:"list",children:M.loading?(0,x.jsx)("div",{className:"ch-skeleton ch-session-skeleton","aria-label":a("loading")}):q.length===0?(0,x.jsx)("p",{className:"ch-note",children:a("emptyList")}):q.map(N=>(0,x.jsx)("div",{role:"listitem",children:(0,x.jsxs)("button",{className:`ch-session ${g===N.id?"is-selected":""}`,"aria-pressed":g===N.id,title:N.title,onClick:()=>se(N.id),children:[(0,x.jsx)("span",{className:"ch-session-marker"}),(0,x.jsxs)("span",{className:"ch-session-title",children:[N.title||N.id,(0,x.jsxs)("small",{title:N.cwd,children:[N.harness??"CodexHost",N.cwd?` \xB7 ${N.cwd.split(/[\\/]/).filter(Boolean).at(-1)}`:""]})]}),(0,x.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})},N.id))}),(0,x.jsxs)("div",{className:"ch-pagination",children:[(0,x.jsx)("small",{children:a("loadedSearch")}),(0,x.jsxs)("div",{children:[(0,x.jsx)("button",{className:"ch-mini-button",disabled:_===0||M.loading,onClick:()=>z(N=>Math.max(0,N-1)),children:a("previous")}),(0,x.jsxs)("span",{children:[a("page")," ",_+1]}),(0,x.jsx)("button",{className:"ch-mini-button",disabled:!M.page?.nextCursor||M.loading,onClick:()=>{let N=M.page?.nextCursor;N&&(L(le=>[...le.slice(0,_+1),N]),z(le=>le+1))},children:a("next")})]})]})]})]})]}),g?(0,x.jsxs)(x.Fragment,{children:[!s&&!b?.title&&(0,x.jsxs)("div",{className:"ch-selected-header",children:[(0,x.jsx)("span",{className:"ch-eyebrow",children:b?.harness??"CodexHost"}),(0,x.jsx)("h2",{title:b?.title??g,children:b?.title??g})]}),H.error&&(0,x.jsxs)("div",{className:"ch-error",role:"alert",children:[a("usageError"),(0,x.jsx)("span",{children:H.error}),(0,x.jsx)("button",{className:"ch-mini-button",onClick:te,children:a("retry")})]}),!H.usage&&!H.error&&!H.loading&&(0,x.jsx)("p",{className:"ch-note ch-availability",children:a("noUsage")}),(0,x.jsx)(tn,{usage:H,history:Me,rows:M.page?.items??[],selected:g,onSelect:se,retry:te,t:a},g)]}):(0,x.jsxs)("div",{className:"ch-empty",children:[(0,x.jsx)(ue,{size:32}),(0,x.jsx)("h2",{children:a("noSession")}),(0,x.jsx)("p",{children:a("choose")})]}),(0,x.jsxs)("footer",{className:"ch-footer",children:[(0,x.jsxs)("span",{children:["ch-context \xB7 ",a("readOnly")]}),(0,x.jsx)("span",{children:a("localOnly")})]})]})})}var un=`.ch-context {
  --ch-blue: #245fd1;
  --ch-green: #087a3c;
  --ch-teal: #047c79;
  --ch-purple: #7c3aed;
  --ch-amber: #9a5a00;
  --ch-accent: var(--ch-blue);
  --ch-accent-soft: #edf3ff;
  --ch-track: #dfe7ef;
  --ch-warning: var(--ch-amber);
  --ch-ink: var(--dsw-alias-label-primary, #18212d);
  --ch-muted: var(--dsw-alias-label-secondary, #536172);
  --ch-surface: var(--dsw-alias-bg-layer-1, #fff);
  --ch-border: var(--dsw-alias-border-l2, #dfe4eb);
  color: var(--ch-ink);
  font-family: var(
    --ds-font-family,
    system-ui,
    -apple-system,
    'Segoe UI',
    'Microsoft YaHei',
    sans-serif
  );
  font-size: 12px;
  line-height: 1.5;
  height: 100%;
  min-height: 0;
  overflow: auto;
  container-type: inline-size;
  color-scheme: light dark;
}
body[data-ds-dark-theme] .ch-context {
  --ch-blue: #91baff;
  --ch-green: #79dca6;
  --ch-teal: #70d8cf;
  --ch-purple: #c5a4ff;
  --ch-amber: #f8c676;
  --ch-accent-soft: #192d48;
  --ch-track: #2b3542;
  --ch-surface: var(--dsw-alias-bg-layer-1, #171b22);
  --ch-ink: var(--dsw-alias-label-primary, #e4eaf2);
  --ch-muted: var(--dsw-alias-label-secondary, #a6b2c2);
  --ch-border: var(--dsw-alias-border-l2, #343c48);
}
.ch-context * {
  box-sizing: border-box;
}
.ch-context :is(h1, h2, h3, p, dl, dd) {
  margin: 0;
}
.ch-context :is(button, input, select) {
  font: inherit;
}
.ch-context button {
  cursor: pointer;
}
.ch-context button:disabled {
  cursor: default;
  opacity: 0.45;
}
.ch-context :is(button, input, select, summary, a):focus-visible {
  outline: 2px solid var(--ch-accent);
  outline-offset: 2px;
}
.ch-context button:active:not(:disabled) {
  transform: translateY(1px);
}
.ch-shell {
  max-width: 1500px;
  margin-inline: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.ch-embedded .ch-shell {
  padding: 10px;
  max-width: none;
}
.ch-page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 2px 2px 4px;
}
.ch-heading-title {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.ch-page-heading h1 {
  font-size: 18px;
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.3;
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ch-muted);
  font-size: 9px;
  letter-spacing: 0.1em;
  font-weight: 650;
  white-space: nowrap;
}
.ch-brand svg {
  color: var(--ch-accent);
}
.ch-version {
  font-size: 9px;
  text-decoration: none;
  font-weight: 500;
  color: var(--ch-muted);
  letter-spacing: 0;
  border: 1px solid var(--ch-border);
  padding: 0 4px;
  border-radius: 3px;
}
.ch-heading-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.ch-market-language-select {
  min-height: 30px;
  max-width: 92px;
  border: 1px solid var(--ch-border);
  border-radius: 5px;
  color: var(--ch-ink);
  background: var(--ch-surface);
  font-size: 10px;
  padding: 4px;
}
.ch-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ch-green);
}
.ch-status.is-offline i {
  background: var(--ch-warning);
}
.ch-button,
.ch-mini-button {
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  color: var(--ch-ink);
  padding: 5px 10px;
  min-height: 30px;
  border-radius: 5px;
  line-height: 1.2;
  transition:
    background 0.12s,
    border-color 0.12s;
  white-space: normal;
  text-align: center;
  font-size: 11px;
}
.ch-mini-button {
  border-color: transparent;
  background: transparent;
  padding: 4px 7px;
  min-height: 26px;
  font-size: 10px;
}
.ch-button:hover:not(:disabled),
.ch-mini-button:hover:not(:disabled),
.ch-mini-button.is-active {
  background: var(--ch-accent-soft);
  border-color: var(--ch-border);
  color: var(--ch-accent);
}
.ch-note,
.ch-eyebrow,
.ch-count {
  color: var(--ch-muted);
  font-size: 10px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
.ch-count {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-scope {
  font-size: 10px;
  color: var(--ch-muted);
  border: 1px solid var(--ch-border);
  border-radius: 4px;
  padding: 1px 5px;
}
.ch-availability {
  padding: 6px 10px;
  background: var(--ch-accent-soft);
  border-radius: 5px;
}
.ch-session-picker {
  border: 1px solid var(--ch-border);
  border-radius: 7px;
  background: var(--ch-surface);
}
.ch-session-picker > summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  cursor: pointer;
  list-style: none;
  min-width: 0;
}
.ch-session-picker > summary::-webkit-details-marker {
  display: none;
}
.ch-session-picker > summary > span:first-child {
  color: var(--ch-muted);
  font-size: 10px;
  flex-shrink: 0;
}
.ch-session-picker > summary > strong {
  font-size: 12px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 550;
}
.ch-session-picker summary small {
  color: var(--ch-accent);
  font-size: 10px;
  flex-shrink: 0;
}
.ch-session-harness {
  color: var(--ch-muted);
  font-size: 10px;
}
.ch-session-picker-body {
  border-top: 1px solid var(--ch-border);
  padding: 10px;
}
.ch-picker-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.ch-search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ch-border);
  border-radius: 5px;
  padding: 5px 9px;
  max-width: 320px;
  min-width: 0;
  color: var(--ch-muted);
  flex: 1;
}
.ch-search input {
  background: transparent;
  border: 0;
  color: var(--ch-ink);
  outline: 0;
  min-width: 0;
  width: 100%;
  font-size: 11px;
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
  gap: 3px;
  max-height: 230px;
  overflow-y: auto;
  padding: 2px;
}
.ch-session-list > div {
  min-width: 0;
}
.ch-session {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  padding: 7px 9px;
  min-width: 0;
  min-height: 45px;
}
.ch-session:hover {
  background: var(--ch-accent-soft);
}
.ch-session.is-selected {
  border-color: var(--ch-accent);
  background: var(--ch-accent-soft);
}
.ch-session-marker {
  width: 4px;
  height: 4px;
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
  font-size: 11px;
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
  font-size: 11px;
}
.ch-pagination {
  margin-top: 8px;
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
  font-size: 10px;
}
.ch-selected-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 2px;
}
.ch-selected-header h2 {
  font-size: 12px;
  font-weight: 550;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.ch-inspector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.ch-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  min-width: 0;
}
.ch-card {
  padding: 10px;
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  min-width: 0;
  background: var(--ch-surface);
  box-shadow: 0 1px 2px rgba(10, 24, 45, 0.035);
}
.ch-card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid var(--ch-border);
}
.ch-card-heading h2 {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
}
.ch-card-heading .ch-eyebrow {
  font-size: 10px;
}
.ch-metric dt {
  font-size: 10px;
  color: var(--ch-muted);
  overflow-wrap: anywhere;
}
.ch-metric dd {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
  margin-top: 3px;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.ch-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}
.ch-context-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.ch-context-line p > b {
  font-size: 19px;
  letter-spacing: -0.025em;
}
.ch-context-line p > span {
  font-size: 11px;
  color: var(--ch-muted);
}
.ch-occupancy-number {
  text-align: right;
}
.ch-occupancy-number strong {
  font-size: 18px;
  font-weight: 650;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
}
.ch-occupancy-number small {
  display: block;
  color: var(--ch-muted);
  font-size: 9px;
}
.ch-capacity-bar {
  height: 11px;
  background: var(--ch-track);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 9px;
}
.ch-capacity-bar > span {
  height: 100%;
  display: block;
  background: var(--ch-accent);
  border-radius: 4px;
}
.ch-capacity-bar.is-high > span {
  background: var(--ch-amber);
}
.ch-context-values {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 7px;
  font-size: 10px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-token-layout {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 106px;
}
.ch-token-legend {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ch-token-legend > button {
  background: transparent;
  border: 0;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 3px;
  font-size: 11px;
  border-radius: 4px;
  text-align: left;
  min-width: 0;
}
.ch-token-legend > button:hover {
  background: var(--ch-accent-soft);
}
.ch-token-legend > button > span:nth-child(2) {
  flex: 1;
  min-width: 0;
}
.ch-token-legend > button > b {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ch-token-legend > button > small {
  font-size: 10px;
  color: var(--ch-muted);
  width: 40px;
  text-align: right;
}
.ch-swatch {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
}
.ch-context .ch-independent-cache {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-top: 5px;
  margin-top: 4px;
  border-top: 1px solid var(--ch-border);
}
.ch-independent-cache .ch-metric dd {
  font-size: 14px;
}
.ch-token-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 9px;
  border-top: 1px solid var(--ch-border);
  padding-top: 7px;
  font-size: 10px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-token-footer b {
  font-size: 12px;
  margin-left: 5px;
  color: var(--ch-ink);
  font-variant-numeric: tabular-nums;
}
.ch-token-footer + .ch-note {
  margin-top: 6px;
}
.ch-performance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  min-height: 57px;
}
.ch-performance:has(> .ch-metric:nth-child(4)) {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.ch-performance .ch-metric dd {
  font-size: 17px;
}
.ch-cache-bars {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--ch-border);
}
.ch-cache-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
}
.ch-cache-row > span {
  width: 108px;
  color: var(--ch-muted);
  flex-shrink: 0;
}
.ch-cache-row > b {
  width: 48px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 550;
}
.ch-cache-track {
  flex: 1;
  height: 5px;
  background: var(--ch-track);
  border-radius: 3px;
  overflow: hidden;
}
.ch-cache-track i {
  display: block;
  height: 100%;
  background: var(--ch-teal);
}
.ch-context .lc-donut {
  position: relative;
  flex-shrink: 0;
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
  gap: 2px;
}
.ch-context .lc-donut-center b {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ch-context .lc-donut-center span {
  color: var(--ch-muted);
  max-width: 76px;
  line-height: 1.3;
}
.ch-context .lc-donut-seg {
  transition:
    stroke 0.15s,
    opacity 0.15s;
}
.ch-context .lc-donut-dim .lc-donut-seg {
  opacity: 0.25;
}
.ch-context .lc-donut-dim .lc-donut-seg-on {
  opacity: 1;
}
.ch-chart {
  display: flex;
  gap: 10px;
  height: 90px;
  margin-top: 7px;
}
.ch-chart-axis {
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  font-size: 9px;
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
  gap: 10px;
  padding-left: 40px;
  font-size: 9px;
  color: var(--ch-muted);
  margin-block: 7px 10px;
}
.ch-observations {
  border: 1px solid var(--ch-border);
  border-radius: 7px;
  background: var(--ch-surface);
}
.ch-observations > summary {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  font-size: 11px;
  cursor: pointer;
}
.ch-observations > summary > span {
  color: var(--ch-muted);
}
.ch-observations > .ch-card {
  border: 0;
  border-radius: 0 0 7px 7px;
  box-shadow: none;
}
.ch-observations > .ch-card > .ch-card-heading {
  display: none;
}
.ch-data-note {
  font-size: 10px;
  color: var(--ch-muted);
  padding: 0 3px;
}
.ch-footer {
  border-top: 1px solid var(--ch-border);
  padding-top: 9px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--ch-muted);
  font-size: 9px;
  flex-wrap: wrap;
}
.ch-footer span:last-child {
  max-width: 76ch;
}
.ch-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 65px 20px;
  gap: 10px;
  color: var(--ch-muted);
  text-align: center;
}
.ch-empty h2 {
  font-size: 17px;
  color: var(--ch-ink);
}
.ch-empty p {
  max-width: 44ch;
}
.ch-error {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  font-size: 11px;
}
.ch-error span {
  color: var(--ch-muted);
  overflow-wrap: anywhere;
}
.ch-skeleton {
  background: linear-gradient(100deg, var(--ch-surface), var(--ch-accent-soft), var(--ch-surface));
  background-size: 200% 100%;
  animation: ch-shimmer 1.8s ease-in-out infinite;
  border-radius: 6px;
  min-height: 30px;
}
.ch-session-skeleton {
  height: 90px;
  grid-column: 1/-1;
}
.ch-settings {
  padding: 24px;
  max-width: 70ch;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
@container (max-width:720px) {
  .ch-market-language-select {
    min-height: 44px;
  }
  .ch-version {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .ch-session-picker > summary,
  .ch-observations > summary {
    min-height: 44px;
  }
  .ch-shell,
  .ch-embedded .ch-shell {
    padding: 10px;
  }
  .ch-heading-title {
    gap: 8px;
    flex-wrap: wrap;
  }
  .ch-page-heading h1 {
    font-size: 16px;
  }
  .ch-dashboard {
    grid-template-columns: 1fr;
  }
  .ch-heading-actions {
    gap: 3px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .ch-heading-actions .ch-status {
    display: none;
  }
  .ch-session-list {
    grid-template-columns: 1fr;
    max-height: 220px;
  }
  .ch-performance,
  .ch-performance:has(> .ch-metric:nth-child(4)) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ch-selected-header h2 {
    white-space: normal;
  }
  .ch-token-layout {
    gap: 12px;
  }
  .ch-session-harness {
    display: none;
  }
  .ch-footer {
    font-size: 10px;
  }
  .ch-button,
  .ch-mini-button,
  .ch-token-legend > button {
    min-height: 44px;
  }
  .ch-heading-embedded .ch-brand {
    letter-spacing: 0;
    font-size: 9px;
  }
  .ch-heading-embedded .ch-heading-actions {
    flex: 1;
  }
  .ch-heading-actions .ch-mini-button {
    max-width: 115px;
  }
  .ch-cache-row > span {
    width: 100px;
  }
}
@container (max-width:400px) {
  .ch-brand {
    letter-spacing: 0;
  }
  .ch-heading-title {
    max-width: 44%;
  }
  .ch-heading-actions {
    max-width: 56%;
  }
  .ch-token-legend > button {
    font-size: 10px;
    gap: 4px;
  }
  .ch-token-legend > button > b {
    font-size: 11px;
  }
  .ch-token-legend > button > small {
    width: 33px;
  }
  .ch-pagination {
    flex-wrap: wrap;
  }
  .ch-session-picker > summary {
    gap: 6px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ch-context * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;var gn=`.ch-stat-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}
.ch-stat-tile {
  border: 0;
  border-radius: 5px;
  background: color-mix(in srgb, var(--ch-track) 38%, transparent);
  padding: 8px 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 57px;
}
.ch-stat-tile:hover {
  background: var(--ch-accent-soft);
}
.ch-stat-tile strong {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.ch-stat-tile span {
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-tile-0 strong {
  color: var(--ch-green);
}
.ch-tile-1 strong {
  color: var(--ch-blue);
}
.ch-tile-2 strong {
  color: var(--ch-teal);
}
.ch-tile-3 strong {
  color: var(--ch-purple);
}
.ch-activity-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  margin-top: 9px;
}
.ch-activity-bottom > div > span {
  display: block;
  font-size: 10px;
  color: var(--ch-muted);
  margin-bottom: 4px;
}
.ch-tool-chips {
  display: flex;
  gap: 3px 9px;
  flex-wrap: wrap;
  min-height: 23px;
}
.ch-tool-chips button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 0;
  color: var(--ch-ink);
  padding: 2px 0;
  font-size: 10px;
  min-width: 0;
}
.ch-tool-chips button:hover {
  color: var(--ch-accent);
}
.ch-tool-chips i {
  width: 6px;
  height: 6px;
  border-radius: 2px;
  flex-shrink: 0;
}
.ch-tool-chips em {
  font-style: normal;
  color: var(--ch-amber);
}
.ch-window-counts {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-window-counts button {
  background: transparent;
  border: 0;
  padding: 6px;
  color: var(--ch-muted);
  font-size: 10px;
}
.ch-window-counts b {
  font-size: 13px;
  color: var(--ch-ink);
  margin-left: 5px;
}
.ch-workbench {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  grid-template-rows: repeat(5, min-content) 1fr;
  grid-template-areas: 'context browser' 'timeline browser' 'files browser' 'commands browser' 'family browser' 'observations browser';
  align-items: start;
  gap: 10px;
}
.ch-workbench > .ch-context-card {
  grid-area: context;
}
.ch-workbench > .ch-activity-timeline {
  grid-area: timeline;
}
.ch-workbench > .ch-file-card {
  grid-area: files;
}
.ch-workbench > .ch-command-card {
  grid-area: commands;
}
.ch-workbench > .ch-family-card {
  grid-area: family;
}
.ch-workbench > .ch-observations {
  grid-area: observations;
}
.ch-workbench > .ch-browser-card {
  grid-area: browser;
}
.ch-activity-chart {
  display: flex;
  gap: 7px;
  height: 112px;
  margin: 5px 0 0;
}
.ch-lane-labels {
  width: 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 9px;
  line-height: 1;
  flex-shrink: 0;
}
.ch-activity-chart svg {
  flex: 1;
  min-width: 0;
  height: 112px;
  cursor: crosshair;
}
.ch-lane-line {
  stroke: var(--ch-border);
  stroke-dasharray: 2 5;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.ch-timeline-cursor {
  stroke: var(--ch-muted);
  stroke-width: 1;
  stroke-dasharray: 2 3;
  vector-effect: non-scaling-stroke;
}
.ch-sequence-slider {
  width: calc(100% - 52px);
  display: block;
  margin: 0 0 2px 52px;
  height: 24px;
  accent-color: var(--ch-accent);
  cursor: pointer;
}
.ch-sequence-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  min-width: 0;
  margin-bottom: 5px;
  min-height: 19px;
}
.ch-sequence-preview > b {
  font-size: 9px;
  color: var(--ch-muted);
  font-weight: 500;
}
.ch-sequence-preview > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ch-muted);
}
.ch-browser-card {
  padding-bottom: 8px;
}
.ch-browser-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  margin-top: -3px;
}
.ch-filter {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}
.ch-filter > button {
  padding: 4px 7px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--ch-muted);
  font-size: 10px;
  min-height: 26px;
}
.ch-filter > button:hover,
.ch-filter > button.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-accent);
}
.ch-browser-search {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--ch-border);
  border-radius: 5px;
  padding: 1px 6px 1px 9px;
  margin: 8px 0;
}
.ch-browser-search:focus-within {
  outline: 2px solid var(--ch-accent);
  outline-offset: 1px;
}
.ch-browser-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 5px 0;
  color: var(--ch-ink);
  font-size: 11px;
}
.ch-browser-search input:focus-visible {
  outline: 0;
}
.ch-browser-search > span {
  font-size: 9px;
  color: var(--ch-muted);
  flex-shrink: 0;
}
.ch-browser-records {
  max-height: 240px;
  min-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1px;
}
.ch-browser-records > .ch-note {
  padding: 12px 5px;
}
.ch-record-group {
  margin-bottom: 5px;
}
.ch-group-heading {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 31px;
  background: color-mix(in srgb, var(--ch-blue) 5%, var(--ch-surface));
  border: 1px solid var(--ch-border);
  border-radius: 5px;
  padding: 5px 7px;
  text-align: left;
  color: var(--ch-ink);
  font-size: 11px;
}
.ch-group-heading > span:first-child {
  width: 9px;
  flex-shrink: 0;
}
.ch-group-heading > i {
  width: 6px;
  height: 6px;
  border-radius: 2px;
  flex-shrink: 0;
}
.ch-group-heading > b {
  font-weight: 550;
  flex: 1;
}
.ch-group-heading > span:last-child {
  background: var(--ch-surface);
  border-radius: 3px;
  padding: 0 5px;
  font-size: 10px;
}
.ch-group-user > .ch-group-heading {
  background: color-mix(in srgb, var(--ch-green) 6%, var(--ch-surface));
}
.ch-group-tool > .ch-group-heading {
  background: color-mix(in srgb, var(--ch-teal) 6%, var(--ch-surface));
}
.ch-group-event > .ch-group-heading {
  background: color-mix(in srgb, var(--ch-purple) 6%, var(--ch-surface));
}
.ch-record-item {
  border: 0;
  border-bottom: 1px solid var(--ch-border);
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 6px;
  min-height: 34px;
  width: 100%;
  min-width: 0;
  text-align: left;
  font-size: 11px;
}
.ch-record-item:hover {
  background: var(--ch-accent-soft);
}
.ch-record-item.is-selected {
  background: var(--ch-accent-soft);
  box-shadow: inset 2px 0 var(--ch-accent);
}
.ch-record-seq {
  font-size: 9px;
  color: var(--ch-muted);
  width: 32px;
  flex-shrink: 0;
}
.ch-record-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-record-time {
  font-size: 9px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.ch-record-badge {
  color: var(--ch-muted);
  border: 1px solid var(--ch-border);
  border-radius: 3px;
  font-size: 9px;
  padding: 0 4px;
  flex-shrink: 0;
}
.ch-error-badge {
  color: var(--ch-amber);
  border-color: var(--ch-amber);
}
.ch-record-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin: 8px 0;
  border-top: 1px solid var(--ch-border);
  padding-top: 7px;
  flex-wrap: wrap;
}
.ch-record-navigation > div {
  display: flex;
  align-items: center;
  gap: 4px;
}
.ch-record-navigation > div > span {
  font-size: 9px;
  color: var(--ch-muted);
}
.ch-record-detail {
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  padding: 9px;
  background: color-mix(in srgb, var(--ch-track) 9%, var(--ch-surface));
  min-width: 0;
}
.ch-record-detail > header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 5px;
}
.ch-record-detail > header > div:first-child {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.ch-record-detail > header strong {
  font-size: 11px;
  font-weight: 550;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}
.ch-record-kind {
  font-size: 10px;
  flex-shrink: 0;
}
.ch-detail-controls {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
}
.ch-detail-controls .ch-mini-button {
  font-size: 9px;
  min-height: 23px;
}
.ch-record-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  color: var(--ch-muted);
  overflow: hidden;
  margin-bottom: 8px;
}
.ch-record-meta > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-record-content {
  max-height: 340px;
  min-height: 130px;
  overflow: auto;
  overscroll-behavior: contain;
  font-size: 12px;
  min-width: 0;
}
.ch-source-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 0;
  font-family: var(--ds-font-family-code, ui-monospace, 'Microsoft YaHei', monospace);
  font-size: 11px;
  line-height: 1.65;
}
.ch-context .ch-record-notice {
  margin: 6px 0;
  padding: 6px 8px;
  background: var(--ch-accent-soft);
  border-radius: 4px;
  font-size: 10px;
}
.ch-browser-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 9px;
}
.ch-browser-footer .ch-note {
  max-width: 48ch;
  font-size: 9px;
}
.ch-browser-footer > div {
  display: flex;
  gap: 5px;
}
.ch-browser-footer .ch-button {
  font-size: 10px;
  min-height: 28px;
}
.ch-file-list,
.ch-command-list {
  max-height: 240px;
  overflow-y: auto;
  min-width: 0;
}
.ch-file-row {
  border: 0;
  border-bottom: 1px solid var(--ch-border);
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 2px;
  min-width: 0;
  width: 100%;
  text-align: left;
}
.ch-file-row:hover {
  background: var(--ch-accent-soft);
}
.ch-file-row > div {
  min-width: 0;
  flex: 1;
}
.ch-file-row strong {
  font-size: 11px;
  font-weight: 550;
  display: block;
  overflow-wrap: anywhere;
}
.ch-file-row small {
  display: block;
  color: var(--ch-muted);
  font-size: 9px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-file-row > span {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
  max-width: 48%;
}
.ch-file-row i {
  font-size: 9px;
  font-style: normal;
  color: var(--ch-muted);
}
.ch-file-row i:first-child {
  color: var(--ch-green);
}
.ch-file-row i:nth-child(2) {
  color: var(--ch-blue);
}
.ch-command-row {
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid var(--ch-border);
  min-width: 0;
}
.ch-command-main {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  flex: 1;
  background: transparent;
  border: 0;
  padding: 9px 2px;
  color: var(--ch-ink);
  text-align: left;
}
.ch-command-main:hover {
  background: var(--ch-accent-soft);
}
.ch-command-seq {
  font-size: 9px;
  color: var(--ch-muted);
  flex-shrink: 0;
}
.ch-command-main code {
  min-width: 0;
  flex: 1;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--ds-font-family-code, ui-monospace, 'Microsoft YaHei', monospace);
}
.ch-result-known {
  color: var(--ch-teal);
}
.ch-result-state {
  color: var(--ch-muted);
}
.ch-result-error {
  color: var(--ch-amber);
}
.ch-command-result {
  font-size: 9px;
  border: 0;
  background: transparent;
  color: var(--ch-accent);
  padding: 5px;
  flex-shrink: 0;
}
.ch-family-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 7px;
}
.ch-family-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 0;
  color: var(--ch-ink);
  text-align: left;
  padding: 5px 2px;
  width: 100%;
  min-width: 0;
  border-radius: 4px;
}
.ch-family-row:hover {
  background: var(--ch-accent-soft);
}
.ch-family-branch {
  font-size: 20px;
  color: var(--ch-purple);
  flex-shrink: 0;
}
.ch-family-row > span:nth-child(2) {
  flex: 1;
  min-width: 0;
}
.ch-family-row small {
  font-size: 9px;
  color: var(--ch-muted);
  display: block;
}
.ch-family-row b {
  font-size: 11px;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-family-row > span:last-child {
  color: var(--ch-muted);
  font-size: 12px;
}
.ch-rich-text {
  overflow-wrap: anywhere;
  line-height: 1.7;
}
.ch-rich-text > :first-child {
  margin-top: 0;
}
.ch-rich-text p {
  margin: 0 0 10px;
}
.ch-rich-text :is(h2, h3, h4, h5, h6) {
  margin: 14px 0 7px;
  line-height: 1.4;
  font-weight: 650;
}
.ch-rich-text h2 {
  font-size: 16px;
}
.ch-rich-text h3 {
  font-size: 14px;
}
.ch-rich-text h4,
.ch-rich-text h5,
.ch-rich-text h6 {
  font-size: 12px;
}
.ch-rich-text :is(ul, ol) {
  margin: 6px 0 10px;
  padding-left: 22px;
}
.ch-rich-text li > p {
  margin: 0;
}
.ch-rich-text blockquote {
  border-left: 3px solid var(--ch-border);
  padding: 2px 10px;
  margin: 10px 0;
  color: var(--ch-muted);
}
.ch-rich-text :not(pre) > code {
  font-size: 11px;
  font-family: var(--ds-font-family-code, ui-monospace, 'Microsoft YaHei', monospace);
  background: color-mix(in srgb, var(--ch-track) 40%, transparent);
  border-radius: 3px;
  padding: 1px 4px;
}
.ch-rich-text a {
  color: var(--ch-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
}
.ch-rich-text hr {
  border: 0;
  border-top: 1px solid var(--ch-border);
  margin: 12px 0;
}
.ch-code-block {
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  overflow: hidden;
  margin: 9px 0;
}
.ch-code-block > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: color-mix(in srgb, var(--ch-track) 35%, var(--ch-surface));
  padding: 3px 8px;
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-code-block pre {
  font-family: var(--ds-font-family-code, ui-monospace, 'Microsoft YaHei', monospace);
  font-size: 11px;
  line-height: 1.65;
  margin: 0;
  padding: 9px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.ch-rich-table {
  overflow-x: auto;
  max-width: 100%;
  margin: 10px 0;
}
.ch-rich-table table {
  border-collapse: collapse;
  font-size: 11px;
  width: 100%;
}
.ch-rich-table :is(th, td) {
  border: 1px solid var(--ch-border);
  padding: 5px 8px;
  text-align: left;
  min-width: 75px;
}
.ch-rich-table th {
  background: color-mix(in srgb, var(--ch-track) 35%, var(--ch-surface));
  font-weight: 600;
}
.ch-task-state {
  font-size: 12px;
  color: var(--ch-accent);
}
@container (max-width:950px) {
  .ch-workbench {
    grid-template-columns: 1fr 1fr;
  }
  .ch-activity-bottom {
    grid-template-columns: 1fr;
  }
  .ch-window-counts {
    border-top: 1px solid var(--ch-border);
    padding-top: 4px;
    gap: 10px;
  }
  .ch-window-counts button {
    padding: 3px 0;
  }
  .ch-record-time {
    display: none;
  }
  .ch-card-heading .ch-scope {
    font-size: 9px;
  }
}
@container (max-width:720px) {
  .ch-workbench {
    display: flex;
    flex-direction: column;
  }
  .ch-workbench > * {
    width: 100%;
  }
  .ch-stat-tiles {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 5px;
  }
  .ch-stat-tile {
    padding: 8px 6px;
  }
  .ch-stat-tile strong {
    font-size: 18px;
  }
  .ch-stat-tile span {
    font-size: 9px;
  }
  .ch-browser-records {
    max-height: 240px;
  }
  .ch-record-content {
    max-height: 380px;
  }
  .ch-activity-chart {
    height: 100px;
  }
  .ch-activity-chart svg {
    height: 100px;
  }
  .ch-lane-labels {
    font-size: 10px;
  }
  .ch-record-item,
  .ch-group-heading,
  .ch-filter > button,
  .ch-tool-chips button,
  .ch-window-counts button,
  .ch-command-main,
  .ch-command-result,
  .ch-family-row {
    min-height: 44px;
  }
  .ch-sequence-slider {
    height: 44px;
  }
  .ch-filter > button {
    min-width: 44px;
  }
  .ch-record-navigation > div {
    gap: 0;
  }
  .ch-record-navigation .ch-mini-button {
    font-size: 10px;
    padding: 4px 5px;
  }
  .ch-file-row {
    min-height: 55px;
  }
  .ch-detail-controls .ch-mini-button {
    min-height: 44px;
    font-size: 10px;
  }
  .ch-rich-text {
    font-size: 12px;
  }
  .ch-code-block .ch-mini-button {
    min-height: 44px;
  }
  .ch-group-heading {
    font-size: 11px;
  }
  .ch-record-title {
    font-size: 11px;
  }
  .ch-card-heading {
    gap: 5px;
  }
  .ch-window-counts button {
    min-width: 44px;
  }
  .ch-command-result {
    min-width: 44px;
  }
  .ch-record-meta {
    flex-wrap: wrap;
  }
  .ch-record-meta > span:last-child {
    max-width: 100%;
  }
}
@container (max-width:400px) {
  .ch-browser-toolbar {
    align-items: flex-start;
  }
  .ch-filter {
    gap: 0;
  }
  .ch-filter > button {
    font-size: 10px;
    padding: 3px 6px;
  }
  .ch-browser-toolbar > .ch-mini-button {
    padding-inline: 4px;
    font-size: 9px;
    min-width: 44px;
  }
  .ch-record-navigation {
    justify-content: flex-end;
  }
  .ch-record-navigation > .ch-note {
    margin-right: auto;
    font-size: 9px;
  }
  .ch-file-row > span {
    gap: 3px;
  }
  .ch-command-seq {
    display: none;
  }
  .ch-stat-tile span {
    font-size: 10px;
  }
  .ch-lane-labels {
    width: 38px;
  }
  .ch-sequence-slider {
    width: calc(100% - 45px);
    margin-left: 45px;
  }
}
`;var fn=`[data-conversation-scroll][data-ch-context-surface]
  > [data-composer-seat]:not(
    :has([data-approval-key], [data-plan-review-key], [data-question-key], [data-user-question-key])
  ) {
  display: none;
}
`;var O=require("react/jsx-runtime"),D="ch-context",zr=["slots","locale"],Ae=class extends Pe.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(e,r){}render(){return this.state.failed?(0,O.jsx)("div",{className:"ch-context",children:(0,O.jsxs)("div",{className:"ch-shell",children:[(0,O.jsx)("p",{role:"alert",children:this.props.translate()("errorBoundary")}),(0,O.jsx)("button",{className:"ch-button",onClick:()=>this.setState({failed:!1}),children:this.props.translate()("retry")})]})}):this.props.children}};function $r(t){let e=()=>$e(t.locale.getLocale?.().active??"en");t.effect(()=>t.locale.register(D,{en:{...rt},zh:{...st}}),"ch-context: locale"),t.effect(()=>{let i=document.createElement("style");return i.dataset.plugin=D,i.dataset.pluginCss=D,i.textContent=un+`
`+gn+`
`+fn,document.head.appendChild(i),()=>i.remove()},"ch-context: styles");let r=i=>{let a=(i.useProjection??(()=>{}))("codexhostUsage");return(0,O.jsx)(ot,{ctx:t,sessionId:i.sessionId,projection:a,embedded:!0})},s=i=>(0,O.jsx)(Ae,{translate:e,children:(0,O.jsx)(r,{...i})},`${i.sessionId??""}:${typeof i.useProjection}`),n=()=>(0,O.jsx)(Ae,{translate:e,children:(0,O.jsx)(ot,{ctx:t})});t.slots.inject("conversation.view",()=>t.slots.register({name:"conversation.view",id:D,order:25,locale:D,label:()=>e()("tab")},s)),t.slots.inject("main",()=>t.slots.register({name:"main",key:D,locale:D},n)),t.slots.inject("sidebar.panellist",()=>t.slots.register({name:"sidebar.panellist",id:D,order:25,label:()=>e()("compatibilityTitle"),locale:D},i=>(0,Pe.createElement)(ue,{size:typeof i.size=="number"?i.size:20}))),t.slots.inject("settings.section",()=>t.slots.register({name:"settings.section",id:D,order:25,label:()=>e()("titleShort"),locale:D},()=>(0,O.jsx)("div",{className:"ch-context",children:(0,O.jsxs)("div",{className:"ch-settings",children:[(0,O.jsx)("h2",{children:"CH Context"}),(0,O.jsx)("p",{children:e()("settingsNote")}),(0,O.jsx)("p",{children:e()("localOnly")}),(0,O.jsx)("button",{className:"ch-button",onClick:()=>{let i=W(t.get("layout"));typeof i?.selectPanel=="function"&&i.selectPanel(D)},children:e()("title")}),(0,O.jsx)("small",{children:e()("readOnly")})]})})))}

return module.exports;}});
