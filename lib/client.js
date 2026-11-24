window.__ModuleLoader__.load({id:"ch-context",factory:function(require){var module={exports:{}};var exports=module.exports;
"use strict";var wt=Object.defineProperty;var mr=Object.getOwnPropertyDescriptor;var gr=Object.getOwnPropertyNames;var fr=Object.prototype.hasOwnProperty;var br=(e,t)=>{for(var a in t)wt(e,a,{get:t[a],enumerable:!0})},xr=(e,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of gr(t))!fr.call(e,n)&&n!==a&&wt(e,n,{get:()=>t[n],enumerable:!(r=mr(t,n))||r.enumerable});return e};var vr=e=>xr(wt({},"__esModule",{value:!0}),e);var Ba={};br(Ba,{apply:()=>ja,inject:()=>Da,name:()=>ve});module.exports=vr(Ba);var kt=require("react");var he=require("react");var kr=new Set(["bash","Bash","pwsh","powershell","exec_command","shell","shell_command","run_shell_command","run_command"]),wr=new Set(["read","Read","read_file","readFile","read_image"]),yr=new Set(["write","Write","write_file","writeFile","edit","Edit","edit_file","editFile","multi_edit","MultiEdit"]),Nr=new Set(["grep","Grep","glob","Glob","search_files","searchFiles"]),Tr=new Set(["str_replace_editor","str_replace_based_edit_tool"]),Cr=new Set(["str_replace","insert","create","undo_edit"]);function Be(e){return typeof e=="string"&&e.trim().length>0}function yt(e){return Be(e.toolName)?e.toolName:Be(e.title)?e.title:void 0}function Qt(e){return e.startsWith("functions.")?e.slice(10):e}function Sr(e){if(typeof e=="string")try{let t=JSON.parse(e);return t!==null&&typeof t=="object"&&!Array.isArray(t)?t:void 0}catch{return}}function $r(e,t){if(kr.has(Qt(e)))return typeof t.command=="string"?t.command:typeof t.cmd=="string"?t.cmd:void 0}function Rr(e,t){let a=Qt(e);if(wr.has(a))return"reads";if(yr.has(a))return"writes";if(Nr.has(a))return"searches";if(Tr.has(a)){if(t.command==="view")return"reads";if(typeof t.command=="string"&&Cr.has(t.command))return"writes"}}function Er(e){for(let t of["path","file_path","filePath"]){let a=e[t];if(Be(a)&&!a.includes("\0"))return a}}function Gt(e,t){if(!Be(t.callId))return;let a=e.get(t.callId);a?a.push(t):e.set(t.callId,[t])}function Xt(e){let t=new Map,a=new Map;for(let n of e)n.eventType==="tool/call"?Gt(t,n):n.eventType==="tool/result"&&Gt(a,n);let r=new Map;for(let[n,o]of t){let s=a.get(n);if(o.length!==1||s?.length!==1)continue;let i=o[0],c=s[0];if(c.seq<=i.seq)continue;let h=yt(i);Be(c.toolName)&&h!==void 0&&c.toolName!==h||r.set(i,c)}return r}function Yt(e){let t=Xt(e),a=new Map;for(let[r,n]of t)a.set(r.id,n.id),a.set(n.id,r.id);return a}function Te(e){let t=e.trim();if(!t)return"shell";let a=t.split(/\s+/);for(let r of a){if(/^[A-Za-z_][A-Za-z0-9_]*=/.test(r))continue;let n=r.replace(/^['"]|['"]$/g,""),o=n.split(/[\\/]/).at(-1)??n;if(o)return o.slice(0,28)}return"shell"}function Ir(e,t){if(e.isError===!0||t?.isError===!0)return!0;if(t?.isError===!1||e.isError===!1)return!1}function Ye(e){let t={messages:0,userMessages:0,assistantMessages:0,toolCalls:0,toolResults:0,events:0,records:e.length,tools:[],commands:[],files:[]},a=Xt(e),r=new Map,n=new Map,o=new Map;for(let s of e)if(s.eventType==="user/message"||s.eventType===void 0&&s.kind==="user")t.userMessages++;else if(s.eventType==="assistant/message"||s.eventType===void 0&&s.kind==="assistant")t.assistantMessages++;else if(s.eventType==="tool/result")t.toolResults++;else if(s.eventType==="tool/call"){t.toolCalls++;let i=yt(s);if(i===void 0)continue;let c=r.get(i);c===void 0&&(c={name:i,count:0,failed:0,pending:0,recordIds:[]},r.set(i,c));let h=a.get(s),d=Ir(s,h);c.count++,d===!0&&c.failed++,h===void 0?c.pending++:o.set(h,c);let g=Sr(s.arguments);if(g===void 0)continue;let l=$r(i,g);l!==void 0&&t.commands.push({id:s.id,seq:s.seq,tool:i,command:l,recordId:s.id,...h===void 0?{}:{resultId:h.id},...d===void 0?{}:{isError:d}});let N=Rr(i,g),v=N===void 0?void 0:Er(g);if(N===void 0||v===void 0)continue;let S=n.get(v);S===void 0&&(S={path:v,reads:0,writes:0,searches:0,recordIds:[]},n.set(v,S)),S[N]++,S.recordIds.push(s.id)}else t.events++;for(let s of e)(s.eventType==="tool/call"?r.get(yt(s)??""):o.get(s))?.recordIds.push(s.id);return t.messages=t.userMessages+t.assistantMessages,t.tools=[...r.values()],t.files=[...n.values()],t}var rn=require("react");var Ka=require("react"),Re=require("react/jsx-runtime"),Mr=.5;function et(e){let t=e.size??118,a=0;for(let s of e.segments)Number.isFinite(s.value)&&s.value>0&&(a+=s.value);let r=[],n=0;if(a>0)for(let s of e.segments){let i=Number.isFinite(s.value)&&s.value>0?s.value:0;if(i===0)continue;let c=i/a*100;r.push({key:s.key,color:s.color,len:c,offset:100-n+25}),n+=c}if(r.length>1)for(let s of r){let i=Math.min(Mr/2,s.len/4);s.len-=i*2,s.offset-=i}let o=e.hoverKey!==null&&e.hoverKey!==void 0&&r.some(s=>s.key===e.hoverKey);return(0,Re.jsxs)("div",{className:"lc-donut @max-[240px]/lc-card:mx-auto"+(o?" lc-donut-dim":""),style:{width:t,height:t},onMouseLeave:()=>{e.onHoverKey!==void 0&&e.onHoverKey(null)},children:[(0,Re.jsx)("svg",{viewBox:"0 0 42 42",width:t,height:t,"aria-hidden":"true",children:r.length===0?(0,Re.jsx)("circle",{className:"lc-donut-track fill-none stroke-4",cx:"21",cy:"21",r:"15.9155"}):r.map((s,i)=>(0,Re.jsx)("circle",{className:"lc-donut-seg fill-none stroke-4 animate-lc-donut-in motion-reduce:animate-none"+(e.hoverKey===s.key?" lc-donut-seg-on":""),cx:"21",cy:"21",r:"15.9155",strokeDasharray:`${s.len} ${100-s.len}`,strokeDashoffset:s.offset,style:{"--lc-i":i,stroke:s.color},onMouseEnter:()=>{e.onHoverKey!==void 0&&e.onHoverKey(s.key)}},s.key))}),(0,Re.jsxs)("div",{className:"lc-donut-center",children:[(0,Re.jsx)("b",{style:{fontSize:Math.max(11,Math.round(t*.13))},children:e.centerTop}),e.centerSub!==void 0?(0,Re.jsx)("span",{style:{fontSize:Math.max(10,Math.round(t*.105))},children:e.centerSub}):null]})]})}function V(e){if(e==null||isNaN(e))return"\u2014";let t=e<0?"-":"",a=Math.abs(e);return a>=1e9?t+(a/1e9).toFixed(1)+"B":a>=1e6?t+(a/1e6).toFixed(1)+"M":a>=1e3?t+(a/1e3).toFixed(1)+"k":t+String(Math.round(a))}var Pr=new Intl.DateTimeFormat("en-GB",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function ye(e){let t=new Date(e);return isNaN(t.getTime())?"\u2014":Pr.format(t)}var Ja=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function Ue(e){if(!Number.isFinite(e)||e<=0)return"\u2014";if(e<1e3)return`${Math.round(e)}ms`;if(e<6e4)return`${(e/1e3).toFixed(1)}s`;let t=Math.floor(e/1e3),a=Math.floor(t/60),r=t%60;return e<36e5?`${a}m${r}s`:`${Math.floor(a/60)}h${a%60}m`}function be(e){return typeof e=="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e)}function ke(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)?e:null}function Ee(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0?e:void 0}var en=["inputTokens","cachedInputTokens","cacheWriteInputTokens","outputTokens","totalTokens","reasoningOutputTokens","totalCostUsd","totalCredits","contextUsedTokens","contextWindowTokens","contextUsagePercent","cacheHitRatePercent","sessionCacheHitRatePercent","outputTokensPerSecond","sessionOutputTokensPerSecond","timeToFirstOutputMs","latestRequestTimeToFirstOutputMs"];function tt(e){let t=ke(e),a=ke(t?.usage);if(a===null)return null;let r={};for(let n of en){let o=Ee(a[n]);o!==void 0&&(r[n]=o)}return r.contextWindowTokens===0&&delete r.contextWindowTokens,(a.costSource==="publicPrice"||a.costSource==="native")&&(r.costSource=a.costSource),Array.isArray(a.unpricedModels)&&(r.unpricedModels=a.unpricedModels.filter(n=>typeof n=="string").slice(0,100)),en.some(n=>r[n]!==void 0)?r:null}function nt(e){let t=Ee(e?.inputTokens),a=Ee(e?.outputTokens);if(t===void 0||a===void 0)return[];let r=Ee(e?.cachedInputTokens),n=Ee(e?.cacheWriteInputTokens);return r===void 0||n===void 0||r+n>t?[{kind:"input",value:t},{kind:"output",value:a}]:[{kind:"uncachedInput",value:t-r-n},{kind:"cacheRead",value:r},{kind:"cacheWrite",value:n},{kind:"output",value:a}]}function me(e){let t=Ee(e?.contextUsedTokens),a=Ee(e?.contextWindowTokens),r=a===0?void 0:a,n=Ee(e?.contextUsagePercent)??(t!==void 0&&r!==void 0?t/r*100:void 0);return n===void 0?null:{percent:n,...t===void 0?{}:{used:t},...r===void 0?{}:{capacity:r}}}function Nt(e,t,a){let r=me(t);if(r===null||!Number.isFinite(a))return[...e];let n=e.at(-1);return n?.percent===r.percent&&n.used===r.used&&n.capacity===r.capacity?[...e]:[...e,{time:a,...r}].slice(-120)}var zr=new Intl.NumberFormat("en-US",{maximumFractionDigits:4});function ze(e,t=160){return(e.split(/\r?\n/).find(a=>a.trim().length>0)??"").trim().replace(/^#{1,6}\s+/,"").slice(0,t)}function Ce(e){return`$${e>0&&e<1e-4?e.toPrecision(2):e.toFixed(e>=1?2:4)}`}function rt(e){return e>0&&e<1e-4?"<0.0001":zr.format(e)}var x=require("react/jsx-runtime");function We({size:e=20}){return(0,x.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,x.jsx)("path",{d:"M5 18V11M12 18V6M19 18V3",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),(0,x.jsx)("path",{d:"M3 21h18",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]})}function Se({label:e,value:t,suffix:a,format:r}){let n=t===void 0?"\u2014":r?r(t):a==="%"?`${t.toFixed(1)}%`:a==="ms"?t===0?"0ms":Ue(t):a==="tok/s"?`${t.toFixed(1)} ${a}`:V(t);return(0,x.jsxs)("div",{className:"ch-metric",children:[(0,x.jsx)("dt",{children:e}),(0,x.jsx)("dd",{title:t===void 0?void 0:String(t),children:n})]})}function se({title:e,aside:t,children:a,className:r=""}){return(0,x.jsxs)("section",{className:`ch-card ${r}`,children:[(0,x.jsxs)("header",{className:"ch-card-heading",children:[(0,x.jsx)("h2",{children:e}),t]}),a]})}function Ar({samples:e,tone:t,t:a}){let r=e[0],n=e.at(-1),o=r&&n&&e.length>1?n.percent-r.percent:null,s=e.length?Math.max(0,Math.min(...e.map(l=>Math.min(100,l.percent)))-6):0,i=e.length?Math.min(100,Math.max(...e.map(l=>Math.min(100,l.percent)))+6):100,c=Math.max(12,i-s),h=e.map((l,N)=>{let v=e.length===1?210:12+N/(e.length-1)*396,M=38-(Math.min(100,Math.max(0,l.percent))-s)/c*30;return{x:v,y:M,sample:l}}),d=h.map((l,N)=>`${N===0?"M":"L"}${l.x.toFixed(1)},${l.y.toFixed(1)}`).join(" "),g=h.length>1?`${d} L${h[h.length-1].x.toFixed(1)},43 L${h[0].x.toFixed(1)},43 Z`:"";return(0,x.jsxs)("div",{className:`ch-spark-box is-${t}`,title:a("timelineNote"),children:[(0,x.jsxs)("div",{className:"ch-spark-head",children:[(0,x.jsx)("span",{children:a("timeline")}),(0,x.jsx)("strong",{children:e.length===0?a("noObservations"):e.length===1&&r?`1 ${a("points")} \xB7 ${r.percent.toFixed(1)}%`:`${e.length} ${a("points")} \xB7 ${r.percent.toFixed(1)}% \u2192 ${n.percent.toFixed(1)}% (${o!==null&&o>=0?"+":""}${o?.toFixed(1)}%)`})]}),(0,x.jsxs)("svg",{className:"ch-spark-svg",viewBox:"0 0 420 46",role:"img","aria-label":a("sampled"),children:[(0,x.jsx)("line",{x1:"0",y1:"10",x2:"420",y2:"10",className:"ch-chart-grid"}),(0,x.jsx)("line",{x1:"0",y1:"26",x2:"420",y2:"26",className:"ch-chart-grid"}),g&&(0,x.jsx)("path",{d:g,className:"ch-spark-area"}),d&&(0,x.jsx)("path",{d,className:"ch-chart-line"}),h.map((l,N)=>(0,x.jsx)("circle",{cx:l.x.toFixed(1),cy:l.y.toFixed(1),r:N===h.length-1?3.8:2.5,className:`ch-chart-dot ${N===h.length-1?"is-latest":""}`,children:(0,x.jsxs)("title",{children:[ye(l.sample.time)," \xB7 ",l.sample.percent.toFixed(1),"%"]})},`${l.sample.time}-${N}`))]})]})}function an({usage:e,samples:t,harness:a,t:r}){let o=me(e)?.percent,s=o!==void 0&&o>=85?"danger":o!==void 0&&o>=65?"warn":"normal",i=e?.contextUsedTokens!==void 0&&e?.contextWindowTokens!==void 0?Math.max(0,e.contextWindowTokens-e.contextUsedTokens):void 0,c=o!==void 0?Math.max(0,100-o):void 0;return(0,x.jsxs)(se,{title:r("context"),className:`ch-context-card is-${s}`,aside:(0,x.jsxs)("span",{className:"ch-card-rate",title:r("limitsNote"),children:[r("source")," \xB7 ",(0,x.jsx)("b",{children:a})]}),children:[(0,x.jsxs)("div",{className:"ch-ctx-hero",children:[(0,x.jsxs)("div",{className:"ch-ctx-hero-left",children:[(0,x.jsx)("b",{children:V(e?.contextUsedTokens)}),(0,x.jsxs)("span",{children:["/ ",V(e?.contextWindowTokens)," tokens"]})]}),(0,x.jsxs)("div",{className:"ch-ctx-hero-right ch-occupancy-number",children:[(0,x.jsx)("strong",{children:o===void 0?"\u2014":`${o.toFixed(1)}%`}),(0,x.jsx)("span",{children:r("ofContextUsed")})]})]}),(0,x.jsxs)("div",{className:"ch-gauge-wrap",children:[(0,x.jsxs)("div",{className:`ch-capacity-bar ${s==="danger"?"is-danger":s==="warn"?"is-high":""}`,role:"img","aria-label":`${r("occupancy")}: ${o===void 0?r("unavailable"):o.toFixed(1)+"%"}`,children:[(0,x.jsx)("span",{style:{width:`${Math.min(100,o??0)}%`}}),(0,x.jsx)("i",{className:"ch-reserve-zone","aria-hidden":"true",title:r("cautionZone")})]}),(0,x.jsxs)("div",{className:"ch-ctx-legend ch-context-values",children:[(0,x.jsxs)("span",{className:"ch-ctx-leg",children:[(0,x.jsx)("i",{className:"is-used"}),(0,x.jsx)("b",{children:r("usedShort")}),(0,x.jsxs)("em",{children:[V(e?.contextUsedTokens),o===void 0?"":` \xB7 ${o.toFixed(1)}%`]})]}),(0,x.jsxs)("span",{className:"ch-ctx-leg",children:[(0,x.jsx)("i",{className:"is-rem"}),(0,x.jsx)("b",{children:r("remainingShort")}),(0,x.jsx)("em",{children:i===void 0?"\u2014":`${V(i)}${c===void 0?"":` \xB7 ${c.toFixed(1)}%`}`})]}),(0,x.jsxs)("span",{className:"ch-ctx-leg",children:[(0,x.jsx)("i",{className:"is-cap"}),(0,x.jsx)("b",{children:r("capacity")}),(0,x.jsx)("em",{children:V(e?.contextWindowTokens)})]}),(0,x.jsxs)("span",{className:"ch-ctx-leg",children:[(0,x.jsx)("i",{className:"is-hatch"}),(0,x.jsx)("em",{children:r("cautionZone")})]})]})]}),(0,x.jsx)(Ar,{samples:t,tone:s,t:r})]})}var tn={input:"var(--ch-blue)",uncachedInput:"var(--ch-blue)",cacheRead:"var(--ch-teal)",cacheWrite:"var(--ch-amber)",output:"var(--ch-purple)"};function sn({usage:e,t}){let[a,r]=(0,rn.useState)(null),n=nt(e),o=n.reduce((d,g)=>d+g.value,0),s=(e?.unpricedModels?.length??0)>0,i=e?.totalCostUsd===void 0?t("unavailable"):e.costSource==="native"?t("costNative"):e.costSource==="publicPrice"?t("costEstimate"):t("source"),c=e?.cacheHitRatePercent??e?.sessionCacheHitRatePercent,h=e?.cacheHitRatePercent!==void 0?t("cacheHit"):t("avgCache");return(0,x.jsxs)(se,{title:t("cumulative"),className:"ch-token-card",aside:(0,x.jsxs)("span",{className:"ch-card-rate",children:[h," ",(0,x.jsx)("b",{children:c===void 0?"\u2014":`${c.toFixed(1)}%`})]}),children:[(0,x.jsxs)("div",{className:"ch-token-layout",children:[(0,x.jsx)(et,{size:106,segments:n.map(d=>({key:d.kind,value:d.value,color:tn[d.kind]})),centerTop:V(n.length?o:e?.totalTokens),centerSub:n.length?t("inputOutput"):t("total"),hoverKey:a,onHoverKey:r}),(0,x.jsxs)("div",{className:"ch-token-body",children:[n.length?(0,x.jsx)("div",{className:"ch-sl-grid",children:n.map(d=>(0,x.jsxs)("button",{type:"button",className:`ch-sl-item ${a===d.kind?"is-hi":""}`,title:`${t(d.kind)}: ${d.value}`,onMouseEnter:()=>r(d.kind),onMouseLeave:()=>r(null),onFocus:()=>r(d.kind),onBlur:()=>r(null),children:[(0,x.jsxs)("span",{className:"ch-sl-top",children:[(0,x.jsx)("span",{className:"ch-swatch",style:{background:tn[d.kind]}}),(0,x.jsx)("span",{className:"ch-sl-label",children:t(d.kind)}),(0,x.jsx)("b",{className:"ch-sl-pct",children:o>0?`${(d.value/o*100).toFixed(1)}%`:"\u2014"})]}),(0,x.jsx)("span",{className:"ch-sl-sub",children:V(d.value)})]},d.kind))}):(0,x.jsxs)("dl",{className:"ch-metrics",children:[(0,x.jsx)(Se,{label:t("input"),value:e?.inputTokens}),(0,x.jsx)(Se,{label:t("output"),value:e?.outputTokens}),(0,x.jsx)(Se,{label:t("cacheRead"),value:e?.cachedInputTokens}),(0,x.jsx)(Se,{label:t("cacheWrite"),value:e?.cacheWriteInputTokens})]}),n.length===2&&(0,x.jsxs)("dl",{className:"ch-independent-cache",children:[(0,x.jsx)(Se,{label:t("cacheRead"),value:e?.cachedInputTokens}),(0,x.jsx)(Se,{label:t("cacheWrite"),value:e?.cacheWriteInputTokens})]})]})]}),(0,x.jsxs)("div",{className:"ch-token-footer",children:[(0,x.jsxs)("span",{title:s?t("partialPrice"):i,children:[t("cost")," ",(0,x.jsx)("b",{children:e?.totalCostUsd===void 0?"\u2014":`${s?"\u2265 ":""}${Ce(e.totalCostUsd)}`}),e?.totalCostUsd!==void 0&&(0,x.jsxs)("small",{className:"ch-foot-sub",children:[" \xB7 ",i]})]}),(0,x.jsxs)("div",{className:"ch-token-foot-right",children:[(0,x.jsxs)("span",{title:t("inputIncludesCache"),children:[t("total")," ",(0,x.jsx)("b",{children:V(e?.totalTokens)})]}),e?.reasoningOutputTokens!==void 0&&(0,x.jsxs)("span",{className:"ch-dot-pill",children:[(0,x.jsx)("i",{className:"is-event"}),t("reasoningOutput")," ",V(e.reasoningOutputTokens)]})]})]}),s&&(0,x.jsx)("p",{className:"ch-note",children:t("partialPrice")})]})}function nn({label:e,value:t,tone:a="teal"}){return(0,x.jsxs)("div",{className:"ch-cache-row",children:[(0,x.jsx)("span",{children:e}),(0,x.jsx)("div",{className:"ch-cache-track",children:(0,x.jsx)("i",{className:`is-${a}`,style:{width:`${Math.min(100,t??0)}%`}})}),(0,x.jsx)("b",{children:t===void 0?"\u2014":`${t.toFixed(1)}%`})]})}var Or={user:"var(--ch-green)",assistant:"var(--ch-blue)",tool:"var(--ch-teal)",event:"var(--ch-purple)"};function on({usage:e,items:t,onSelectRecord:a,t:r}){let n=e?.outputTokensPerSecond??e?.sessionOutputTokensPerSecond,o=e?.outputTokensPerSecond!==void 0?r("tps"):r("avgTps"),s=Math.floor(t.length/2);return(0,x.jsxs)(se,{title:r("performance"),className:"ch-performance-card",aside:(0,x.jsxs)("span",{className:"ch-card-rate",children:[o," ",(0,x.jsx)("b",{children:n===void 0?"\u2014":`${n.toFixed(1)} tok/s`})]}),children:[(0,x.jsxs)("dl",{className:"ch-performance",children:[(0,x.jsx)(Se,{label:r("tps"),value:e?.outputTokensPerSecond,suffix:"tok/s"}),(0,x.jsx)(Se,{label:r("avgTps"),value:e?.sessionOutputTokensPerSecond,suffix:"tok/s"}),(0,x.jsx)(Se,{label:r("ttft"),value:e?.latestRequestTimeToFirstOutputMs??e?.timeToFirstOutputMs,suffix:"ms"}),e?.totalCredits!==void 0&&(0,x.jsx)(Se,{label:r("credits"),value:e.totalCredits,format:rt})]}),(0,x.jsxs)("div",{className:"ch-cache-bars",children:[(0,x.jsx)(nn,{label:r("cacheHit"),value:e?.cacheHitRatePercent,tone:"teal"}),(0,x.jsx)(nn,{label:r("avgCache"),value:e?.sessionCacheHitRatePercent,tone:"blue"})]}),(0,x.jsxs)("div",{className:"ch-tstrip",children:[(0,x.jsxs)("div",{className:"ch-tstrip-head",children:[(0,x.jsx)("span",{children:r("windowActivityStrip")}),(0,x.jsx)("span",{children:t.length>0?`#${t[0].seq} \u2192 #${t.at(-1).seq}`:r("unavailable")})]}),(0,x.jsx)("div",{className:`ch-tstrip-bar ${t.length>60?"is-dense":""}`,role:"group","aria-label":r("windowActivityStrip"),children:t.length===0?(0,x.jsx)("div",{className:"ch-tstrip-empty"}):t.map(i=>(0,x.jsx)("button",{type:"button",className:"ch-tstrip-seg",style:{background:i.isError===!0?"var(--ch-danger)":Or[i.kind]},title:`#${i.seq} \xB7 ${i.toolName??r(i.kind)}`,"aria-label":`#${i.seq} ${i.toolName??r(i.kind)}`,onClick:()=>a(i.id)},i.id))}),t.length>0&&(0,x.jsxs)("div",{className:"ch-tstrip-axis",children:[(0,x.jsxs)("span",{children:["#",t[0].seq]}),t.length>2&&(0,x.jsxs)("span",{children:["#",t[s].seq]}),(0,x.jsxs)("span",{children:["#",t.at(-1).seq]})]})]})]})}function Tt({item:e,t}){return!e.clipped&&!e.contentUnavailable&&e.isError!==!0?null:(0,x.jsxs)(x.Fragment,{children:[e.isError===!0&&(0,x.jsx)("span",{className:"ch-record-badge ch-error-badge",children:t("failed")}),(e.clipped||e.contentUnavailable)&&(0,x.jsx)("span",{className:"ch-record-badge",children:t(e.clipped?"previewShort":"partialShort")})]})}function cn({item:e,t}){return(0,x.jsxs)(x.Fragment,{children:[e.isError===!0&&(0,x.jsx)("p",{className:"ch-note ch-record-notice is-error",children:t("toolError")}),e.hostPreview&&(0,x.jsx)("p",{className:"ch-note ch-record-notice",children:t("hostPreview")}),e.textTruncated&&(0,x.jsx)("p",{className:"ch-note ch-record-notice",children:t("textTruncated")}),e.contentUnavailable&&(0,x.jsx)("p",{className:"ch-note ch-record-notice",children:t("contentUnavailable")})]})}var ie=require("react");var ln={subagent:4,fork:3,tree:2,parent:1};function dn(e){return[{id:e.parentId,kind:e.origin==="subagent"?"subagent":"parent"},{id:e.forkParentId,kind:"fork"},{id:e.treeParentId,kind:"tree"}].filter(a=>be(a.id)&&a.id!==e.id)}function at(e,t){if(!be(t))return[];let a=new Map,r=(o,s,i)=>{if(!be(o)||o===t)return;let c=`${s}:${o}`,h=a.get(c);if(h&&ln[h.kind]>=ln[i])return;let d=e.find(g=>g.id===o);a.set(c,{id:o,title:d?.title??"",role:s,kind:i,loaded:d!==void 0,...d?.harness?{harness:d.harness}:{}})},n=e.find(o=>o.id===t);if(n)for(let o of dn(n))r(o.id,"parent",o.kind);for(let o of e)if(!(!be(o.id)||o.id===t))for(let s of dn(o))s.id===t&&r(o.id,"child",s.kind);return[...a.values()]}var Ie=require("react");function pn(e,t){return 8+e/Math.max(1,t-1)*704}function hn(e,t){return t<2||!Number.isFinite(e)?0:Math.min(t-1,Math.max(0,Math.round((e*720-8)/704*(t-1))))}var $=require("react/jsx-runtime"),Me={user:"var(--ch-green)",assistant:"var(--ch-blue)",tool:"var(--ch-teal)",event:"var(--ch-purple)"};function Lr(e){let t=[],a=[],r=0;for(let n=0;n<e.length;n++){(e[n].kind==="user"||r===0)&&(r+=1),a.push(r);let s=t.at(-1);!s||s.turn!==r?t.push({turn:r,start:n,end:n}):s.end=n}return{turns:t,turnByIndex:a}}function un({items:e,pairs:t,available:a,loading:r,focus:n,onFocus:o,t:s}){let[i,c]=(0,Ie.useState)(null),h=e.findIndex(u=>u.id===n),d=h<0?Math.max(0,e.length-1):h,g=u=>{let U=u.currentTarget.getBoundingClientRect();return U.width>0?hn((u.clientX-U.left)/U.width,e.length):null},l=u=>{let U=g(u);U!==null&&e[U]&&o(e[U].id)},N=["user","assistant","tool","event"],v=u=>pn(u,e.length),S=u=>26+N.indexOf(u)*25,M=Math.max(3.5,Math.min(10,560/Math.max(1,e.length))),w=i!==null&&e[i]?i:d,k=e[w],{turns:P,turnByIndex:D}=(0,Ie.useMemo)(()=>Lr(e),[e]),T=(0,Ie.useMemo)(()=>new Map(e.map((u,U)=>[u.id,U])),[e]),j=(0,Ie.useMemo)(()=>{let u=[];for(let U=0;U<e.length;U++){let C=e[U];if(C.eventType!=="tool/call")continue;let B=t.get(C.id);if(!B)continue;let q=T.get(B);if(q===void 0||q<=U)continue;let ee=e[q];u.push({key:`${C.id}-${B}`,x1:v(U),x2:v(q),isError:ee?.isError===!0||C.isError===!0})}return u},[e,t,T]),A=k?t.get(k.id):void 0,z=A?e[T.get(A)??-1]:void 0,L=D[w]??1,J=P.find(u=>u.turn===L),K=(0,Ie.useMemo)(()=>{if(J){for(let u=J.start;u<=J.end;u++)if(e[u]?.kind==="user")return e[u]}},[J,e]),y=(0,Ie.useMemo)(()=>{if(J){for(let u=J.end;u>=J.start;u--)if(e[u]?.kind==="assistant")return e[u]}},[J,e]),H=e.length>1?d/(e.length-1)*100:100;return(0,$.jsx)(se,{title:s("activityTimeline"),className:"ch-activity-timeline",aside:(0,$.jsxs)("span",{className:"ch-card-rate",children:[e.length?`${e.length}`:"\u2014"," ",s("count"),P.length>0?` \xB7 ${P.length} ${s("turnsCount")}`:""]}),children:e.length===0?(0,$.jsx)("p",{className:"ch-note",children:s(a?"noHistory":r?"historyLoading":"unavailable")}):(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)("div",{className:"ch-activity-chart",children:[(0,$.jsx)("div",{className:"ch-lane-labels",children:N.map(u=>(0,$.jsxs)("span",{className:"ch-lane-label",children:[(0,$.jsx)("i",{style:{background:Me[u]}}),s(u)]},u))}),(0,$.jsxs)("div",{className:"ch-activity-plot",children:[P.length>0&&P.length<=16&&(0,$.jsx)("div",{className:"ch-turn-axis","aria-hidden":"true",children:P.map((u,U)=>{let C=U===0?0:(v(u.start-1)+v(u.start))/2;return(0,$.jsxs)("span",{className:"ch-turn-tag",style:{left:`${C/720*100}%`},children:["T",u.turn]},u.turn)})}),(0,$.jsxs)("svg",{viewBox:"0 0 720 120",preserveAspectRatio:"none",role:"img","aria-label":s("activitySequence"),onClick:l,onMouseMove:u=>c(g(u)),onMouseLeave:()=>c(null),children:[P.map((u,U)=>{let C=U===0?0:(v(u.start-1)+v(u.start))/2,B=U===P.length-1?720:(v(u.end)+v(u.end+1))/2;return(0,$.jsxs)("g",{children:[U%2===1&&(0,$.jsx)("rect",{x:C,y:2,width:Math.max(0,B-C),height:116,rx:4,className:"ch-turn-band"}),U>0&&(0,$.jsx)("line",{x1:C,x2:C,y1:4,y2:116,className:"ch-turn-divider"})]},u.turn)}),N.map(u=>(0,$.jsx)("line",{x1:"0",x2:"720",y1:S(u),y2:S(u),className:"ch-lane-line"},u)),j.map(u=>(0,$.jsx)("line",{x1:u.x1,x2:u.x2,y1:S("tool"),y2:S("tool"),className:`ch-tool-bridge ${u.isError?"is-error":""}`},u.key)),(0,$.jsx)("line",{x1:v(d),x2:v(d),y1:"14",y2:"118",className:"ch-timeline-cursor"}),e.map((u,U)=>{let C=U===d||i===U,B=C?Math.min(12,M+2):M,q=C?20:16,ee=S(u.kind)-q/2,le=u.isError===!0?"var(--ch-danger)":Me[u.kind];return(0,$.jsxs)("g",{children:[(0,$.jsx)("rect",{x:v(U)-B/2,y:ee,width:B,height:q,rx:"2.5",fill:le,opacity:C?1:.72}),u.isError===!0&&(0,$.jsx)("rect",{x:v(U)-4,y:4,width:8,height:8,rx:4,fill:"var(--ch-danger)"})]},u.id)})]})]})]}),P.length>0&&P.length<=24&&(0,$.jsx)("div",{className:"ch-turn-strip",role:"group","aria-label":s("turnsLabel"),children:P.map(u=>(0,$.jsx)("button",{type:"button",className:`ch-turn-pill ${u.turn===L?"is-active":""}`,style:{flex:Math.max(1,u.end-u.start+1)},title:`${s("turnShort")} ${u.turn}`,onClick:()=>{let U=e[u.end];U&&o(U.id)},children:u.turn},u.turn))}),(0,$.jsxs)("div",{className:"ch-scrubber-row",children:[(0,$.jsx)("input",{className:"ch-sequence-slider",type:"range",min:"0",max:Math.max(0,e.length-1),value:d,style:{background:`linear-gradient(to right, var(--ch-accent) ${H}%, var(--ch-track) ${H}%)`},onChange:u=>{let U=e[Number(u.target.value)];U&&o(U.id)},"aria-label":s("activitySequence")}),(0,$.jsxs)("span",{className:"ch-scrubber-pos",children:["#",d+1," / ",e.length]})]}),k&&(0,$.jsxs)("div",{className:"ch-sequence-preview",style:{borderLeftColor:k.isError===!0?"var(--ch-danger)":Me[k.kind]},children:[(0,$.jsxs)("div",{className:"ch-step-brief-top",children:[(0,$.jsxs)("div",{className:"ch-step-brief-meta",children:[(0,$.jsxs)("strong",{className:"ch-sb-turn",children:[s("turnShort")," ",L," \xB7 #",w+1," ",s("stepOf")," ",e.length]}),(0,$.jsxs)("b",{"data-seq":k.seq,title:`Seq ${k.seq}`,children:["#",k.seq]}),(0,$.jsxs)("span",{className:`ch-dot-pill ${k.isError===!0?"is-err":""}`,children:[(0,$.jsx)("i",{style:{background:k.isError===!0?"var(--ch-danger)":Me[k.kind]}}),k.isError===!0?s("failed"):s(k.kind)]})]}),(0,$.jsxs)("div",{className:"ch-sb-right",children:[k.time!==void 0&&(0,$.jsx)("span",{className:"ch-step-brief-time",children:ye(k.time)}),z&&(0,$.jsx)("button",{type:"button",className:"ch-mini-button ch-pair-jump",onClick:()=>o(z.id),children:z.eventType==="tool/result"?`${s("jumpResult")} \u2197`:`${s("jumpCall")} \u2196`})]})]}),(0,$.jsxs)("div",{className:"ch-sb-rows",children:[K&&(0,$.jsxs)("button",{type:"button",className:"ch-sb-row",onClick:()=>o(K.id),children:[(0,$.jsx)("span",{className:"ch-sb-tag",children:s("stepUser")}),(0,$.jsx)("span",{className:"ch-sb-text",children:ze(K.text,120)||s("user")})]}),(0,$.jsxs)("button",{type:"button",className:"ch-sb-row",onClick:()=>o(k.id),children:[(0,$.jsx)("span",{className:"ch-sb-tag",children:s("stepRecord")}),(0,$.jsxs)("span",{className:"ch-sb-chip",children:[(0,$.jsx)("span",{className:"ch-sb-chip-tool",children:k.toolName??s(k.kind)}),(0,$.jsx)("span",{className:"ch-sb-text",children:ze(k.title==="user"||k.title==="assistant"?k.text:k.title,120)||s(k.kind)})]})]}),y&&y.id!==k.id&&(0,$.jsxs)("button",{type:"button",className:"ch-sb-row",onClick:()=>o(y.id),children:[(0,$.jsx)("span",{className:"ch-sb-tag",children:s("stepReply")}),(0,$.jsx)("span",{className:"ch-sb-text",children:ze(y.text,120)||s("assistant")})]})]})]}),(0,$.jsx)("p",{className:"ch-note",children:s("sequenceNote")})]})})}function Ct(e){let t=e.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g," ").trim().split(/\s+/).filter(Boolean);return t.length>=2?(t[0][0]+t[1][0]).toUpperCase():(e.trim().slice(0,2)||"CH").toUpperCase()}function mn({related:e,currentTitle:t,currentHarness:a,currentUsage:r,onSelect:n,t:o}){let s={subagent:"relationSubagent",fork:"relationFork",tree:"relationTree",parent:"relationParent"},i=e.filter(d=>d.role==="parent"),c=e.filter(d=>d.role==="child"),h=me(r);return(0,$.jsxs)(se,{title:o("loadedFamily"),className:"ch-family-card",aside:(0,$.jsxs)("span",{className:"ch-card-rate",children:[(0,$.jsx)("b",{children:e.length+1})," ",o("linkedNodes")]}),children:[e.length===0?(0,$.jsx)("p",{className:"ch-note",children:o("noFamily")}):(0,$.jsxs)("div",{className:"ch-net-stage",children:[i.length>0&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)("div",{className:"ch-net-tier",children:i.map(d=>(0,$.jsxs)("button",{type:"button",className:"ch-net-node ch-family-row",title:d.title||d.id,onClick:()=>n(d.id),children:[(0,$.jsxs)("div",{className:"ch-net-head",children:[(0,$.jsx)("span",{className:"ch-net-av is-parent",children:Ct(d.title||d.id)}),(0,$.jsx)("b",{className:"ch-net-title",children:d.title||d.id}),(0,$.jsx)("span",{className:"ch-meta-tag",children:o(s[d.kind])})]}),(0,$.jsxs)("div",{className:"ch-net-foot",children:[(0,$.jsxs)("span",{children:[o("parentConversation"),d.harness?` \xB7 ${d.harness}`:""]}),(0,$.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})]},`${d.role}:${d.id}`))}),(0,$.jsx)("svg",{className:"ch-net-connector",viewBox:"0 0 600 22",preserveAspectRatio:"none","aria-hidden":"true",children:(0,$.jsx)("path",{d:"M300,0 C300,11 300,11 300,22"})})]}),(0,$.jsx)("div",{className:"ch-net-tier",children:(0,$.jsxs)("div",{className:"ch-net-node is-current",children:[(0,$.jsxs)("div",{className:"ch-net-head",children:[(0,$.jsx)("span",{className:"ch-net-av is-current",children:Ct(a)}),(0,$.jsx)("b",{className:"ch-net-title",title:t,children:t}),(0,$.jsx)("span",{className:"ch-meta-tag is-current",children:o("currentSession")})]}),(0,$.jsx)("div",{className:"ch-net-bar",children:(0,$.jsx)("i",{style:{width:`${Math.min(100,h?.percent??0)}%`}})}),(0,$.jsxs)("div",{className:"ch-net-foot",children:[(0,$.jsxs)("span",{children:[a,h?.used!==void 0&&h.capacity!==void 0?` \xB7 ${V(h.used)} / ${V(h.capacity)}`:""]}),(0,$.jsx)("b",{children:h?`${h.percent.toFixed(1)}%`:"\u2014"})]})]})}),c.length>0&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)("svg",{className:"ch-net-connector",viewBox:"0 0 600 22",preserveAspectRatio:"none","aria-hidden":"true",children:c.length===1?(0,$.jsx)("path",{d:"M300,0 C300,11 300,11 300,22"}):c.slice(0,4).map((d,g,l)=>{let N=120+g/(l.length-1)*360;return(0,$.jsx)("path",{d:`M300,0 C300,12 ${N.toFixed(0)},10 ${N.toFixed(0)},22`},d.id)})}),(0,$.jsx)("div",{className:"ch-net-tier",children:c.map(d=>(0,$.jsxs)("button",{type:"button",className:"ch-net-node ch-family-row is-child",title:d.title||d.id,onClick:()=>n(d.id),children:[(0,$.jsxs)("div",{className:"ch-net-head",children:[(0,$.jsx)("span",{className:"ch-net-av is-child",children:Ct(d.title||d.id)}),(0,$.jsx)("b",{className:"ch-net-title",children:d.title||d.id}),(0,$.jsx)("span",{className:"ch-meta-tag",children:o(s[d.kind])})]}),(0,$.jsxs)("div",{className:"ch-net-foot",children:[(0,$.jsx)("span",{children:d.harness??"CodexHost"}),(0,$.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})]},`${d.role}:${d.id}`))})]})]}),(0,$.jsx)("p",{className:"ch-note",children:o("familyScope")})]})}var te=require("react");var b=require("react/jsx-runtime"),gn=["var(--ch-blue)","var(--ch-teal)","var(--ch-indigo)","var(--ch-amber)","var(--ch-purple)","var(--ch-green)"];function Hr(e){let t=e.split(/[\\/]/).at(-1)??e,a=t.lastIndexOf(".");if(a<=0||a===t.length-1)return{label:"FILE",tone:"is-muted"};let r=t.slice(a+1).toUpperCase().slice(0,5);return{label:r,tone:r==="TS"?"is-ts":r==="TSX"||r==="JSX"?"is-tsx":r==="JS"||r==="MJS"||r==="CJS"?"is-js":r==="CSS"||r==="SCSS"?"is-css":r==="JSON"||r==="YAML"||r==="YML"?"is-json":r==="MD"||r==="TXT"?"is-md":"is-muted"}}function St(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{dir:"",base:e}:{dir:e.slice(0,t+1),base:e.slice(t+1)}}function Fr(e){let t=e.split(/(\s+|&&|\|\||\|)/),a=!1;return(0,b.jsx)(b.Fragment,{children:t.map((r,n)=>r?/^\s+$/.test(r)?(0,b.jsx)(te.Fragment,{children:r},n):r==="&&"||r==="||"||r==="|"?(0,b.jsx)("span",{className:"ch-sh-op",children:r},n):a?r.startsWith("-")?(0,b.jsx)("span",{className:"ch-sh-flag",children:r},n):(0,b.jsx)(te.Fragment,{children:r},n):(a=!0,(0,b.jsx)("span",{className:"ch-sh-prog",children:r},n)):null)})}function fn({summary:e,items:t,filter:a,onFilter:r,onFocus:n,t:o}){let[s,i]=(0,te.useState)(""),[c,h]=(0,te.useState)("active"),[d,g]=(0,te.useState)(()=>new Set),l=(0,te.useMemo)(()=>new Map(t.map((w,k)=>[w.id,{item:w,pos:k+1}])),[t]),N=e?.files??[],v=(0,te.useMemo)(()=>{let w=0,k=0,P=0;for(let D of N)w+=D.reads,k+=D.writes,P+=D.searches;return{all:w+k+P,reads:w,writes:k,searches:P}},[N]),S=w=>{let k=-1;for(let P of w){let D=l.get(P)?.item.time??-1;D>k&&(k=D)}return k},M=(0,te.useMemo)(()=>{let w=s.trim().toLocaleLowerCase();return[...N.filter(P=>a!=="all"&&P[a]===0?!1:w?P.path.toLocaleLowerCase().includes(w):!0)].sort((P,D)=>c==="path"?P.path.localeCompare(D.path):c==="name"?St(P.path).base.localeCompare(St(D.path).base):c==="latest"?S(D.recordIds)-S(P.recordIds):D.reads+D.writes+D.searches-(P.reads+P.writes+P.searches))},[N,a,s,c,l]);return(0,b.jsxs)(se,{title:o("files"),className:"ch-file-card",aside:(0,b.jsxs)("div",{className:"ch-fa-head-right",children:[(0,b.jsxs)("span",{className:"ch-card-meta",children:[e?N.length:"\u2014"," ",o("filesUnit")]}),(0,b.jsx)("div",{className:"ch-seg ch-fa-filter",role:"group","aria-label":o("files"),children:[["all",o("all"),v.all,"is-all"],["reads",o("reads"),v.reads,"is-read"],["writes",o("writes"),v.writes,"is-write"],["searches",o("searches"),v.searches,"is-search"]].map(([w,k,P,D])=>(0,b.jsxs)("button",{type:"button",className:`${D} ${a===w?"is-active":""}`,"aria-pressed":a===w,onClick:()=>r(w),children:[k," ",(0,b.jsx)("span",{className:"ch-cnt",children:e?P:"\u2014"})]},w))})]}),children:[N.length>0&&(0,b.jsxs)("div",{className:"ch-fa-toolbar",children:[(0,b.jsx)("input",{className:"ch-mini-input ch-flex-input",value:s,onChange:w=>i(w.target.value),placeholder:o("filterPath"),"aria-label":o("filterPath")}),(0,b.jsx)("div",{className:"ch-seg",role:"group",children:[["active","sortMostActive"],["latest","sortLatest"],["path","sortByPath"],["name","sortByName"]].map(([w,k])=>(0,b.jsx)("button",{type:"button",className:c===w?"is-active":"","aria-pressed":c===w,onClick:()=>h(w),children:o(k)},w))})]}),!e||N.length===0?(0,b.jsx)("p",{className:"ch-note",children:o(e?"noFiles":"unavailable")}):M.length===0?(0,b.jsx)("p",{className:"ch-note",children:o("noMatches")}):(0,b.jsx)("div",{className:"ch-file-list",children:M.map(w=>{let{dir:k,base:P}=St(w.path),D=Hr(w.path),T=d.has(w.path),j=S(w.recordIds);return(0,b.jsxs)("div",{className:`ch-file-item ${T?"is-open":""}`,children:[(0,b.jsxs)("div",{className:"ch-file-row-wrap",children:[(0,b.jsx)("button",{type:"button",className:"ch-file-expand","aria-expanded":T,"aria-label":o("openOperations"),onClick:()=>g(A=>{let z=new Set(A);return z.has(w.path)?z.delete(w.path):z.add(w.path),z}),children:T?"\u25BE":"\u25B8"}),(0,b.jsxs)("button",{type:"button",className:"ch-file-row",title:w.path,onClick:()=>n(w.recordIds[0]),children:[(0,b.jsxs)("div",{className:"ch-file-left",children:[(0,b.jsx)("span",{className:`ch-ext-badge ${D.tone}`,children:D.label}),(0,b.jsxs)("span",{className:"ch-file-path",children:[k&&(0,b.jsx)("span",{className:"ch-file-dir",children:k}),(0,b.jsx)("strong",{children:P})]})]}),(0,b.jsxs)("div",{className:"ch-file-right",children:[(0,b.jsxs)("span",{className:"ch-op-badges",children:[w.reads>0&&(0,b.jsxs)("i",{className:"ch-op-tag is-r",title:o("reads"),children:[(0,b.jsx)("em",{}),w.reads]}),w.writes>0&&(0,b.jsxs)("i",{className:"ch-op-tag is-w",title:o("writes"),children:[(0,b.jsx)("em",{}),w.writes]}),w.searches>0&&(0,b.jsxs)("i",{className:"ch-op-tag is-s",title:o("searches"),children:[(0,b.jsx)("em",{}),w.searches]})]}),j>=0&&(0,b.jsx)("span",{className:"ch-fa-time",children:ye(j)})]})]})]}),T&&(0,b.jsx)("div",{className:"ch-file-ops",children:w.recordIds.map(A=>{let z=l.get(A);return(0,b.jsxs)("button",{type:"button",className:"ch-fa-op",onClick:()=>n(A),children:[(0,b.jsx)("span",{className:"ch-fa-op-tool",children:z?.item.toolName??o("tool")}),(0,b.jsxs)("span",{className:"ch-fa-op-seq",children:["#",z?.item.seq??""," \xB7 ",o("jumpToBrowser")," \u2197"]}),z?.item.time!==void 0&&(0,b.jsx)("span",{className:"ch-fa-time",children:ye(z.item.time)})]},A)})})]},w.path)})})]})}function bn({summary:e,items:t,selectedProgram:a,onSelectProgram:r,onFocus:n,t:o}){let[s,i]=(0,te.useState)("all"),[c,h]=(0,te.useState)(""),[d,g]=(0,te.useState)(""),[l,N]=(0,te.useState)(!0),[v,S]=(0,te.useState)(()=>new Set),M=(0,te.useMemo)(()=>new Map(t.map(y=>[y.id,y])),[t]),w=e?.commands??[],k=(0,te.useMemo)(()=>w.filter(y=>y.isError===!0).length,[w]),P=(0,te.useMemo)(()=>w.filter(y=>y.isError===!1).length,[w]),D=(0,te.useMemo)(()=>w.filter(y=>!y.resultId&&y.isError===void 0).length,[w]),T=(0,te.useMemo)(()=>{let y=new Map;for(let H of w){let u=Te(H.command);y.set(u,(y.get(u)??0)+1)}return[...y.entries()].sort((H,u)=>u[1]-H[1])},[w]),j=a!==null&&T.some(([y])=>y===a)?a:null,A=(0,te.useMemo)(()=>{let y=d.trim().toLocaleLowerCase();return y?T.filter(([H])=>H.toLocaleLowerCase().includes(y)):T},[T,d]),z=(0,te.useMemo)(()=>w.find(y=>y.isError===!0),[w]),L=T[0],J=(0,te.useMemo)(()=>{let y=c.trim().toLocaleLowerCase(),H=w.filter(u=>!(s==="err"&&u.isError!==!0||s==="ok"&&u.isError!==!1||s==="pending"&&(u.resultId||u.isError!==void 0)||j!==null&&Te(u.command)!==j||y&&!u.command.toLocaleLowerCase().includes(y)));return l?[...H].reverse():H},[w,s,j,c,l]),K=w.length>0?`${(k/w.length*100).toFixed(1)}%`:"0%";return(0,b.jsx)(se,{title:o("commands"),className:"ch-command-card",aside:(0,b.jsx)("div",{className:"ch-seg ch-cmd-filter",role:"group","aria-label":o("commands"),children:[["all",o("all"),w.length,"is-all"],["err",o("failed"),k,"is-err"],["ok",o("statusOk"),P,"is-ok"],["pending",o("pending"),D,"is-pend"]].map(([y,H,u,U])=>(0,b.jsxs)("button",{type:"button",className:`${U} ${s===y?"is-active":""}`,"aria-pressed":s===y,onClick:()=>{i(y),y==="all"&&r(null)},children:[H," ",(0,b.jsx)("span",{className:"ch-cnt",children:e?u:"\u2014"})]},y))}),children:!e||w.length===0?(0,b.jsx)("p",{className:"ch-note",children:o(e?"noCommands":"unavailable")}):(0,b.jsxs)("div",{className:"ch-cmd-body",children:[(0,b.jsxs)("aside",{className:"ch-cmd-rail",children:[(0,b.jsxs)("div",{className:"ch-cmd-rail-sec",children:[(0,b.jsx)("div",{className:"ch-rail-h",children:o("cmdSummary")}),(0,b.jsxs)("div",{className:"ch-cmd-kpis",children:[(0,b.jsxs)("button",{type:"button",className:"ch-cmd-kpi",onClick:()=>{i("all"),r(null)},children:[(0,b.jsx)("b",{children:w.length}),(0,b.jsx)("span",{children:o("settledRuns")})]}),(0,b.jsxs)("button",{type:"button",className:"ch-cmd-kpi is-err",onClick:()=>i("err"),children:[(0,b.jsx)("b",{children:k}),(0,b.jsxs)("span",{children:[o("failedShare")," \xB7 ",K]})]}),(0,b.jsxs)("button",{type:"button",className:"ch-cmd-kpi is-ok",onClick:()=>i("ok"),children:[(0,b.jsx)("b",{children:P}),(0,b.jsx)("span",{children:o("succeededRuns")})]}),(0,b.jsxs)("button",{type:"button",className:"ch-cmd-kpi",onClick:()=>r(null),children:[(0,b.jsx)("b",{children:T.length}),(0,b.jsx)("span",{children:o("programsLabel")})]})]})]}),(z||L&&L[1]>1)&&(0,b.jsxs)("div",{className:"ch-cmd-rail-sec",children:[(0,b.jsx)("div",{className:"ch-rail-h",children:o("attentionLabel")}),(0,b.jsxs)("div",{className:"ch-attn-list",children:[z&&(0,b.jsxs)("button",{type:"button",className:`ch-attn-row is-err ${s==="err"?"is-active":""}`,onClick:()=>{let y=s==="err"?"all":"err";i(y),y==="err"&&r(null)},children:[(0,b.jsx)("i",{}),(0,b.jsx)("span",{className:"ch-attn-k",children:o("failed")}),(0,b.jsx)("span",{className:"ch-attn-v",children:z.command}),(0,b.jsxs)("span",{className:"ch-attn-n",children:["\xD7",k]})]}),L&&L[1]>1&&(0,b.jsxs)("button",{type:"button",className:`ch-attn-row is-rep ${j===L[0]?"is-active":""}`,onClick:()=>r(j===L[0]?null:L[0]),children:[(0,b.jsx)("i",{}),(0,b.jsx)("span",{className:"ch-attn-k",children:o("repeatedLabel")}),(0,b.jsx)("span",{className:"ch-attn-v",children:L[0]}),(0,b.jsxs)("span",{className:"ch-attn-n",children:["\xD7",L[1]]})]})]})]}),(0,b.jsxs)("div",{className:"ch-cmd-rail-sec ch-cmd-progs",children:[(0,b.jsxs)("div",{className:"ch-rail-h",children:[(0,b.jsxs)("span",{children:[o("programsLabel")," \xB7 ",T.length]}),T.length>5&&(0,b.jsx)("input",{className:"ch-prog-search",value:d,onChange:y=>g(y.target.value),placeholder:o("filterPrograms"),"aria-label":o("filterPrograms")})]}),(0,b.jsx)("div",{className:"ch-prog-list",children:A.map(([y,H],u)=>{let U=Math.round(H/w.length*100),C=gn[u%gn.length];return(0,b.jsxs)("button",{type:"button",className:`ch-prog-row ${j===y?"is-active":""}`,"aria-pressed":j===y,onClick:()=>r(j===y?null:y),children:[(0,b.jsx)("i",{className:"ch-prog-dot",style:{background:C}}),(0,b.jsx)("span",{className:"ch-prog-name",children:y}),(0,b.jsxs)("span",{className:"ch-prog-cnt",children:["\xD7",H]}),(0,b.jsxs)("span",{className:"ch-prog-pct",children:[U,"%"]}),(0,b.jsx)("i",{className:"ch-prog-bar",style:{width:`${U}%`,background:C}})]},y)})})]})]}),(0,b.jsxs)("div",{className:"ch-cmd-main-pane",children:[(0,b.jsxs)("div",{className:"ch-fa-toolbar",children:[(0,b.jsx)("input",{className:"ch-mini-input ch-flex-input",value:c,onChange:y=>h(y.target.value),placeholder:o("filterCommands"),"aria-label":o("filterCommands")}),(0,b.jsxs)("div",{className:"ch-seg",role:"group",children:[(0,b.jsx)("button",{type:"button",className:l?"is-active":"","aria-pressed":l,onClick:()=>N(!0),children:o("sortLatest")}),(0,b.jsx)("button",{type:"button",className:l?"":"is-active","aria-pressed":!l,onClick:()=>N(!1),children:o("sortSeq")})]})]}),J.length===0?(0,b.jsx)("p",{className:"ch-note",children:o("noMatches")}):(0,b.jsx)("div",{className:"ch-command-list",children:J.map(y=>{let H=v.has(y.id),u=M.get(y.recordId),U=y.resultId?M.get(y.resultId):void 0;return(0,b.jsxs)("div",{className:`ch-command-row ${y.isError?"is-error":""} ${H?"is-open":""}`,children:[(0,b.jsxs)("div",{className:"ch-command-line",children:[(0,b.jsx)("button",{type:"button",className:"ch-file-expand","aria-expanded":H,"aria-label":o("details"),onClick:()=>S(C=>{let B=new Set(C);return B.has(y.id)?B.delete(y.id):B.add(y.id),B}),children:H?"\u25BE":"\u25B8"}),(0,b.jsxs)("button",{type:"button",className:"ch-command-main",onClick:()=>n(y.recordId),children:[(0,b.jsx)("span",{className:y.isError===!0?"ch-cmd-status ch-result-error":y.isError===!1?"ch-cmd-status ch-result-known":"ch-cmd-status ch-result-state",title:o(y.isError===!0?"failed":y.isError===!1?"statusOk":y.resultId?"completed":"pending"),children:y.isError===!0?"!":y.isError===!1?"\u2713":y.resultId?"\u21B3":"\u2026"}),(0,b.jsx)("code",{children:Fr(y.command)})]}),(0,b.jsxs)("span",{className:"ch-cmd-time",children:["#",y.seq,u?.time!==void 0?` \xB7 ${ye(u.time)}`:""]}),y.resultId&&(0,b.jsxs)("button",{type:"button",className:"ch-command-result",onClick:()=>n(y.resultId),children:[o("toolOutput")," \u2197"]})]}),H&&(0,b.jsx)("div",{className:"ch-cmd-inline",children:(0,b.jsxs)("div",{className:"ch-ts-card",children:[(0,b.jsxs)("div",{className:"ch-ts-head",children:[(0,b.jsx)("span",{className:"ch-ts-call-name",children:Te(y.command)}),(0,b.jsx)("div",{className:"ch-ts-right",children:y.isError===!0?(0,b.jsxs)("span",{className:"ch-call-state is-err",children:[(0,b.jsx)("i",{}),o("failed")]}):y.isError===!1?(0,b.jsxs)("span",{className:"ch-call-state is-ok",children:[(0,b.jsx)("i",{}),o("statusOk")]}):null})]}),(0,b.jsx)("pre",{className:"ch-cmd-full",children:y.command}),U&&U.text&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("pre",{className:"ch-cmd-out",children:U.text.length>1200?`${U.text.slice(0,1200)}
\u2026`:U.text}),U.text.length>1200&&y.resultId&&(0,b.jsxs)("div",{className:"ch-cmd-trunc",children:[(0,b.jsx)("span",{children:o("previewShort")}),(0,b.jsxs)("button",{type:"button",className:"ch-link-btn",onClick:()=>n(y.resultId),children:[o("jumpToBrowser")," \u2197"]})]})]})]})})]},y.id)})})]})]})})}var Ae=require("react");function $t(e){return e.replaceAll("|","\\|").replace(/\r?\n/g," ")}function st(e){let t=0;for(let a of e)(a.kind==="user"||t===0)&&(t+=1);return t}function xn(e){let t=me(e.usage),a=new Map;for(let r of e.summary?.commands??[]){let n=Te(r.command);a.set(n,(a.get(n)??0)+1)}return{schema:"ch-context/diagnostic-report@1",exportedAt:new Date(e.exportedAt).toISOString(),session:{threadId:e.threadId,title:e.title,harness:e.harness,...e.cwd?{cwd:e.cwd}:{}},usage:e.usage,occupancy:t?{percent:t.percent,...t.used===void 0?{}:{usedTokens:t.used},...t.capacity===void 0?{}:{windowTokens:t.capacity}}:null,loadedWindow:e.summary?{turns:st(e.items),records:e.summary.records,userMessages:e.summary.userMessages,assistantMessages:e.summary.assistantMessages,toolCalls:e.summary.toolCalls,toolResults:e.summary.toolResults,events:e.summary.events,errors:e.items.filter(r=>r.isError===!0).length,tools:e.summary.tools.map(r=>({name:r.name,count:r.count,failed:r.failed,pending:r.pending})),files:e.summary.files.map(r=>({path:r.path,reads:r.reads,writes:r.writes,searches:r.searches})),commandPrograms:Object.fromEntries(a),commands:e.summary.commands.map(r=>({seq:r.seq,tool:r.tool,program:Te(r.command),command:r.command,status:r.isError===!0?"error":r.isError===!1?"ok":r.resultId?"recorded":"pending"}))}:null,relatedSessions:e.related.map(r=>({id:r.id,title:r.title,role:r.role,kind:r.kind,...r.harness?{harness:r.harness}:{}}))}}function Rt(e,t){let a=t.toLowerCase().startsWith("zh"),r=me(e.usage),n=e.usage,o=e.summary,s=e.items.filter(d=>d.isError===!0).length,i=(n?.unpricedModels?.length??0)>0,c=n?.latestRequestTimeToFirstOutputMs??n?.timeToFirstOutputMs,h=[`# ${a?"\u4E0A\u4E0B\u6587\u8BCA\u65AD\u62A5\u544A":"Context Diagnostic Report"} \xB7 ${e.title}`,"",`- **${a?"\u4F1A\u8BDD ID":"Thread ID"}**: \`${e.threadId}\``,`- **${a?"\u8FD0\u884C\u73AF\u5883":"Harness"}**: \`${e.harness}\``,...e.cwd?[`- **${a?"\u5DE5\u4F5C\u533A":"Workspace"}**: \`${e.cwd}\``]:[],`- **${a?"\u5BFC\u51FA\u65F6\u95F4":"Exported at"}**: ${new Date(e.exportedAt).toISOString()}`,"",`## ${a?"\u7528\u91CF\u5FEB\u7167\uFF08\u7531 CodexHost \u4E0A\u62A5\uFF09":"Usage Snapshot (Reported by CodexHost)"}`,"",`| ${a?"\u6307\u6807":"Metric"} | ${a?"\u6570\u503C":"Value"} |`,"| --- | --- |",`| ${a?"\u5F53\u524D\u4E0A\u4E0B\u6587\u5360\u7528":"Current context"} | ${r?`${r.percent.toFixed(1)}%${r.used!==void 0&&r.capacity!==void 0?` (${V(r.used)} / ${V(r.capacity)})`:""}`:"\u2014"} |`,`| ${a?"\u7D2F\u8BA1\u603B Token":"Total tokens"} | ${V(n?.totalTokens)} |`,`| ${a?"\u8F93\u5165 / \u8F93\u51FA Token":"Input / Output tokens"} | ${V(n?.inputTokens)} / ${V(n?.outputTokens)} |`,`| ${a?"\u7F13\u5B58\u8BFB\u53D6 / \u5199\u5165":"Cache read / write"} | ${V(n?.cachedInputTokens)} / ${V(n?.cacheWriteInputTokens)} |`,`| ${a?"\u6700\u8FD1 / \u5E73\u5747\u7F13\u5B58\u547D\u4E2D":"Latest / Avg cache hit"} | ${n?.cacheHitRatePercent===void 0?"\u2014":`${n.cacheHitRatePercent.toFixed(1)}%`} / ${n?.sessionCacheHitRatePercent===void 0?"\u2014":`${n.sessionCacheHitRatePercent.toFixed(1)}%`} |`,`| ${a?"\u4F1A\u8BDD\u8D39\u7528":"Session cost"} | ${n?.totalCostUsd===void 0?"\u2014":`${i?"\u2265 ":""}${Ce(n.totalCostUsd)}`} |`,...n?.totalCredits!==void 0?[`| AI Credits | ${rt(n.totalCredits)} |`]:[],`| ${a?"\u6700\u8FD1 / \u5E73\u5747\u8F93\u51FA\u901F\u5EA6":"Latest / Avg output speed"} | ${n?.outputTokensPerSecond===void 0?"\u2014":`${n.outputTokensPerSecond.toFixed(1)} tok/s`} / ${n?.sessionOutputTokensPerSecond===void 0?"\u2014":`${n.sessionOutputTokensPerSecond.toFixed(1)} tok/s`} |`,`| ${a?"\u9996\u4E2A\u8F93\u51FA\u5EF6\u8FDF":"Time to first output"} | ${c===void 0?"\u2014":c===0?"0ms":Ue(c)} |`];if(o){if(h.push("",`## ${a?"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u7EDF\u8BA1":"Loaded History Window"}`,"",`- ${a?"\u8F6E\u6B21":"Turns"}: ${st(e.items)} \xB7 ${a?"\u8BB0\u5F55\u6570":"Records"}: ${o.records} \xB7 ${a?"\u7528\u6237":"User"}: ${o.userMessages} \xB7 ${a?"\u52A9\u624B":"Assistant"}: ${o.assistantMessages} \xB7 ${a?"\u5DE5\u5177\u8C03\u7528":"Tool calls"}: ${o.toolCalls} \xB7 ${a?"\u4E8B\u4EF6":"Events"}: ${o.events} \xB7 ${a?"\u9519\u8BEF":"Errors"}: ${s}`),o.files.length>0){h.push("",`### ${a?"\u6587\u4EF6\u6D3B\u52A8":"File Activity"} (${o.files.length})`,"",`| ${a?"\u8DEF\u5F84":"Path"} | ${a?"\u8BFB":"Read"} | ${a?"\u5199":"Write"} | ${a?"\u641C":"Search"} |`,"| --- | ---: | ---: | ---: |");for(let d of o.files)h.push(`| \`${$t(d.path)}\` | ${d.reads} | ${d.writes} | ${d.searches} |`)}if(o.commands.length>0){h.push("",`### ${a?"\u547D\u4EE4\u6267\u884C":"Command Executions"} (${o.commands.length})`,"",`| # | ${a?"\u72B6\u6001":"Status"} | ${a?"\u7A0B\u5E8F":"Program"} | ${a?"\u547D\u4EE4":"Command"} |`,"| ---: | --- | --- | --- |");for(let d of o.commands){let g=d.isError===!0?a?"\u5931\u8D25":"Error":d.isError===!1?"OK":d.resultId?a?"\u5DF2\u8BB0\u5F55":"Recorded":a?"\u5F85\u5B9A":"Pending";h.push(`| #${d.seq} | ${g} | \`${$t(Te(d.command))}\` | \`${$t(d.command.slice(0,160))}\` |`)}}}if(e.related.length>0){h.push("",`## ${a?"\u5173\u8054\u4F1A\u8BDD\uFF08\u5F53\u524D\u9875\uFF09":"Related Sessions (Loaded Page)"}`,"");for(let d of e.related)h.push(`- [${d.role}/${d.kind}] ${d.title||d.id}${d.harness?` (\`${d.harness}\`)`:""}`)}return h.push("",`> ${a?"\u672C\u62A5\u544A\u7531 ch-context \u53EA\u8BFB\u751F\u6210\uFF0C\u4EC5\u5305\u542B CodexHost \u4E0A\u62A5\u7684\u5FEB\u7167\u4E0E\u5F53\u524D\u5DF2\u52A0\u8F7D\u5386\u53F2\u7A97\u53E3\uFF0C\u672A\u4F30\u7B97\u672A\u4E0A\u62A5\u5B57\u6BB5\u3002":"Generated read-only by ch-context from reported CodexHost snapshots and the loaded history window without estimating unavailable fields."}`),h.join(`
`)}function vn(e,t){return e.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||t.slice(0,16)}function kn(e,t,a){if(typeof document>"u"||!document.body||typeof Blob>"u"||typeof URL>"u"||typeof URL.createObjectURL!="function")return!1;let r,n;try{let o=new Blob([t],{type:a});return r=URL.createObjectURL(o),n=document.createElement("a"),n.href=r,n.download=e,n.rel="noopener",n.style.display="none",document.body.append(n),n.click(),!0}catch{return!1}finally{if(n?.remove(),r!==void 0){let o=r;setTimeout(()=>{try{URL.revokeObjectURL(o)}catch{}},1e3)}}}var E=require("react/jsx-runtime"),ot=["var(--ch-teal)","var(--ch-blue)","var(--ch-indigo)","var(--ch-purple)","var(--ch-amber)","var(--ch-green)"];function wn({usage:e,summary:t,items:a,related:r,onJumpTimeline:n,onJumpBrowser:o,onJumpTool:s,onJumpErrors:i,onJumpFiles:c,onJumpCommands:h,onJumpProgram:d,onJumpNetwork:g,t:l}){let N=(0,Ae.useMemo)(()=>st(a),[a]),v=(0,Ae.useMemo)(()=>a.filter(z=>z.isError===!0).length,[a]),S=(0,Ae.useMemo)(()=>t?t.tools.reduce((z,L)=>z+Math.max(0,L.count-L.pending-L.failed),0):0,[t]),M=(0,Ae.useMemo)(()=>{let z=0,L=0,J=0;for(let K of t?.files??[])z+=K.reads,L+=K.writes,J+=K.searches;return{reads:z,writes:L,searches:J,ioTotal:(t?.userMessages??0)+z+L+J}},[t]),w=(0,Ae.useMemo)(()=>[...t?.tools??[]].sort((z,L)=>L.count-z.count),[t]),k=(0,Ae.useMemo)(()=>{let z=new Map;for(let L of t?.commands??[]){let J=Te(L.command);z.set(J,(z.get(J)??0)+1)}return[...z.entries()].sort((L,J)=>J[1]-L[1])},[t]),P=(e?.unpricedModels?.length??0)>0,D=e?.totalCostUsd===void 0?"\u2014":`${P?"\u2265 ":""}${Ce(e.totalCostUsd)}`,T=V(e?.totalTokens),j=r.filter(z=>z.role==="parent").length,A=r.filter(z=>z.role==="child").length;return(0,E.jsxs)(se,{title:l("activityStats"),className:"ch-stats-card",aside:(0,E.jsxs)("span",{className:"ch-card-rate",children:[l("historyWindow")," \xB7 ",(0,E.jsx)("b",{children:t?t.records:"\u2014"})," ",l("count")]}),children:[(0,E.jsxs)("div",{className:"ch-core-wells",children:[(0,E.jsxs)("button",{type:"button",className:"ch-well ch-well-teal",onClick:n,children:[(0,E.jsx)("b",{children:t?N:"\u2014"}),(0,E.jsx)("span",{children:l("turnsLabel")})]}),(0,E.jsxs)("button",{type:"button",className:"ch-well ch-well-blue",onClick:()=>o("all"),children:[(0,E.jsx)("b",{children:t?t.records:"\u2014"}),(0,E.jsx)("span",{children:l("recordsLabel")})]}),(0,E.jsxs)("button",{type:"button",className:"ch-well ch-well-purple",onClick:()=>o("tool"),children:[(0,E.jsx)("b",{children:t?t.toolCalls:"\u2014"}),(0,E.jsx)("span",{children:l("toolCalls")})]}),(0,E.jsxs)("button",{type:"button",className:"ch-well ch-well-green",onClick:()=>o("messages"),children:[(0,E.jsx)("b",{children:t?t.assistantMessages:"\u2014"}),(0,E.jsx)("span",{children:l("answersLabel")})]}),(0,E.jsxs)("div",{className:"ch-well ch-well-events",children:[(0,E.jsx)("span",{className:"ch-well-ev-head",children:l("windowEvents")}),(0,E.jsxs)("div",{className:"ch-well-ev-list",children:[(0,E.jsxs)("button",{type:"button",className:"ch-ev-chip is-ok",onClick:()=>o("tool"),children:[l("completedShort")," ",(0,E.jsx)("b",{children:t?S:"\u2014"})]}),(0,E.jsx)("span",{className:"ch-ev-sep",children:"/"}),(0,E.jsxs)("button",{type:"button",className:`ch-ev-chip is-err ${v===0?"is-dim":""}`,onClick:i,children:[l("failed")," ",(0,E.jsx)("b",{children:t?v:"\u2014"})]}),(0,E.jsx)("span",{className:"ch-ev-sep",children:"/"}),(0,E.jsxs)("button",{type:"button",className:`ch-ev-chip is-ev ${(t?.events??0)===0?"is-dim":""}`,onClick:()=>o("event"),children:[l("events")," ",(0,E.jsx)("b",{children:t?t.events:"\u2014"})]})]})]})]}),(0,E.jsxs)("div",{className:"ch-ledger",children:[(0,E.jsxs)("div",{className:"ch-ledger-group",children:[(0,E.jsxs)("div",{className:"ch-ledger-head",children:[(0,E.jsx)("span",{children:l("inputAndFiles")}),(0,E.jsx)("b",{children:t?M.ioTotal:"\u2014"})]}),(0,E.jsxs)("div",{className:"ch-ledger-chips",children:[(0,E.jsxs)("button",{type:"button",className:"ch-l-chip",onClick:()=>o("messages"),children:[(0,E.jsx)("i",{style:{background:"var(--ch-green)"}}),l("user")," ",(0,E.jsx)("b",{children:t?t.userMessages:"\u2014"})]}),(0,E.jsxs)("button",{type:"button",className:`ch-l-chip ${M.reads===0?"is-dim":""}`,onClick:()=>c("reads"),children:[(0,E.jsx)("i",{style:{background:"var(--ch-ink)"}}),l("reads")," ",(0,E.jsx)("b",{children:t?M.reads:"\u2014"})]}),(0,E.jsxs)("button",{type:"button",className:`ch-l-chip ${M.writes===0?"is-dim":""}`,onClick:()=>c("writes"),children:[(0,E.jsx)("i",{style:{background:"var(--ch-green)"}}),l("writes")," ",(0,E.jsx)("b",{children:t?M.writes:"\u2014"})]}),(0,E.jsxs)("button",{type:"button",className:`ch-l-chip ${M.searches===0?"is-dim":""}`,onClick:()=>c("searches"),children:[(0,E.jsx)("i",{style:{background:"var(--ch-amber)"}}),l("searches")," ",(0,E.jsx)("b",{children:t?M.searches:"\u2014"})]})]})]}),(0,E.jsxs)("div",{className:"ch-ledger-group",children:[(0,E.jsxs)("div",{className:"ch-ledger-head",children:[(0,E.jsx)("span",{children:l("toolCalls")}),(0,E.jsx)("b",{children:t?t.toolCalls:"\u2014"})]}),(0,E.jsx)("div",{className:"ch-ledger-chips",children:w.length===0?(0,E.jsx)("span",{className:"ch-note",children:"\u2014"}):(0,E.jsxs)(E.Fragment,{children:[w.slice(0,5).map((z,L)=>(0,E.jsxs)("button",{type:"button",className:"ch-l-chip",onClick:()=>s(z.name),children:[(0,E.jsx)("i",{style:{background:ot[L%ot.length]}}),(0,E.jsx)("span",{className:"ch-l-chip-name",children:z.name}),(0,E.jsx)("b",{children:z.count})]},z.name)),w.length>5&&(0,E.jsxs)("button",{type:"button",className:"ch-l-chip is-dim",onClick:()=>o("tool"),children:["+",w.length-5," ",l("moreItems")]})]})})]}),(0,E.jsxs)("div",{className:"ch-ledger-group",children:[(0,E.jsxs)("div",{className:"ch-ledger-head",children:[(0,E.jsx)("span",{children:l("commands")}),(0,E.jsx)("b",{children:t?t.commands.length:"\u2014"})]}),(0,E.jsx)("div",{className:"ch-ledger-chips",children:k.length===0?(0,E.jsx)("span",{className:"ch-note",children:"\u2014"}):(0,E.jsxs)(E.Fragment,{children:[k.slice(0,4).map(([z,L],J)=>(0,E.jsxs)("button",{type:"button",className:"ch-l-chip",onClick:()=>d(z),children:[(0,E.jsx)("i",{style:{background:ot[(J+1)%ot.length]}}),(0,E.jsx)("span",{className:"ch-l-chip-name",children:z}),(0,E.jsx)("b",{children:L})]},z)),k.length>4&&(0,E.jsxs)("button",{type:"button",className:"ch-l-chip is-dim",onClick:h,children:["+",k.length-4," ",l("moreItems")]})]})})]}),(0,E.jsxs)("div",{className:"ch-ledger-group",children:[(0,E.jsxs)("div",{className:"ch-ledger-head",children:[(0,E.jsx)("span",{children:l("sessionAndRelations")}),(0,E.jsxs)("b",{children:[T," ",(0,E.jsx)("small",{children:"/"})," ",D]})]}),(0,E.jsxs)("div",{className:"ch-rel-summary",children:[(0,E.jsxs)("div",{className:"ch-rel-line",children:[(0,E.jsx)("span",{children:l("currentSession")}),(0,E.jsxs)("b",{children:[T," / ",D]})]}),(0,E.jsxs)("div",{className:"ch-rel-line",children:[(0,E.jsxs)("span",{children:[l("relatedSessionsLabel")," \xD7 ",r.length]}),(0,E.jsx)("button",{type:"button",className:"ch-link-btn",onClick:g,children:r.length===0?"\u2014":`${l("parentConversation")} ${j} \xB7 ${l("childConversations")} ${A} \u2197`})]})]})]})]})]})}var Y=require("react");var Pe=require("react");function Pt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Le=Pt();function Rn(e){Le=e}var Je={exec:()=>null};function G(e,t=""){let a=typeof e=="string"?e:e.source,r={replace:(n,o)=>{let s=typeof o=="string"?o:o.source;return s=s.replace(fe.caret,"$1"),a=a.replace(n,s),r},getRegex:()=>new RegExp(a,t)};return r}var Ur=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),fe={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i")},qr=/^(?:[ \t]*(?:\n|$))+/,_r=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Dr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ge=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,jr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,zt=/(?:[*+-]|\d{1,9}[.)])/,En=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,In=G(En).replace(/bull/g,zt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Br=G(En).replace(/bull/g,zt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),At=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Wr=/^[^\n]+/,Ot=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Vr=G(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ot).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Kr=G(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,zt).getRegex(),pt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Lt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Zr=G("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Lt).replace("tag",pt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Mn=G(At).replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pt).getRegex(),Jr=G(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Mn).getRegex(),Ht={blockquote:Jr,code:_r,def:Vr,fences:Dr,heading:jr,hr:Ge,html:Zr,lheading:In,list:Kr,newline:qr,paragraph:Mn,table:Je,text:Wr},yn=G("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pt).getRegex(),Gr={...Ht,lheading:Br,table:yn,paragraph:G(At).replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",yn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pt).getRegex()},Qr={...Ht,html:G(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Lt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Je,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:G(At).replace("hr",Ge).replace("heading",` *#{1,6} *[^
]`).replace("lheading",In).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Xr=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Yr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Pn=/^( {2,}|\\)\n(?!\s*$)/,ea=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ht=/[\p{P}\p{S}]/u,Ft=/[\s\p{P}\p{S}]/u,zn=/[^\s\p{P}\p{S}]/u,ta=G(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ft).getRegex(),An=/(?!~)[\p{P}\p{S}]/u,na=/(?!~)[\s\p{P}\p{S}]/u,ra=/(?:[^\s\p{P}\p{S}]|~)/u,aa=G(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ur?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),On=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,sa=G(On,"u").replace(/punct/g,ht).getRegex(),oa=G(On,"u").replace(/punct/g,An).getRegex(),Ln="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ia=G(Ln,"gu").replace(/notPunctSpace/g,zn).replace(/punctSpace/g,Ft).replace(/punct/g,ht).getRegex(),ca=G(Ln,"gu").replace(/notPunctSpace/g,ra).replace(/punctSpace/g,na).replace(/punct/g,An).getRegex(),la=G("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,zn).replace(/punctSpace/g,Ft).replace(/punct/g,ht).getRegex(),da=G(/\\(punct)/,"gu").replace(/punct/g,ht).getRegex(),pa=G(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ha=G(Lt).replace("(?:-->|$)","-->").getRegex(),ua=G("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ha).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ct=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,ma=G(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",ct).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Hn=G(/^!?\[(label)\]\[(ref)\]/).replace("label",ct).replace("ref",Ot).getRegex(),Fn=G(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ot).getRegex(),ga=G("reflink|nolink(?!\\()","g").replace("reflink",Hn).replace("nolink",Fn).getRegex(),Nn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ut={_backpedal:Je,anyPunctuation:da,autolink:pa,blockSkip:aa,br:Pn,code:Yr,del:Je,emStrongLDelim:sa,emStrongRDelimAst:ia,emStrongRDelimUnd:la,escape:Xr,link:ma,nolink:Fn,punctuation:ta,reflink:Hn,reflinkSearch:ga,tag:ua,text:ea,url:Je},fa={...Ut,link:G(/^!?\[(label)\]\((.*?)\)/).replace("label",ct).getRegex(),reflink:G(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ct).getRegex()},Et={...Ut,emStrongRDelimAst:ca,emStrongLDelim:oa,url:G(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Nn).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:G(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Nn).getRegex()},ba={...Et,br:G(Pn).replace("{2,}","*").getRegex(),text:G(Et.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},it={normal:Ht,gfm:Gr,pedantic:Qr},Ve={normal:Ut,gfm:Et,breaks:ba,pedantic:fa},xa={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Tn=e=>xa[e];function $e(e,t){if(t){if(fe.escapeTest.test(e))return e.replace(fe.escapeReplace,Tn)}else if(fe.escapeTestNoEncode.test(e))return e.replace(fe.escapeReplaceNoEncode,Tn);return e}function Cn(e){try{e=encodeURI(e).replace(fe.percentDecode,"%")}catch{return null}return e}function Sn(e,t){let a=e.replace(fe.findPipe,(o,s,i)=>{let c=!1,h=s;for(;--h>=0&&i[h]==="\\";)c=!c;return c?"|":" |"}),r=a.split(fe.splitPipe),n=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),t)if(r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;n<r.length;n++)r[n]=r[n].trim().replace(fe.slashPipe,"|");return r}function Ke(e,t,a){let r=e.length;if(r===0)return"";let n=0;for(;n<r;){let o=e.charAt(r-n-1);if(o===t&&!a)n++;else if(o!==t&&a)n++;else break}return e.slice(0,r-n)}function va(e,t){if(e.indexOf(t[1])===-1)return-1;let a=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])a++;else if(e[r]===t[1]&&(a--,a<0))return r;return a>0?-2:-1}function $n(e,t,a,r,n){let o=t.href,s=t.title||null,i=e[1].replace(n.other.outputLinkReplace,"$1");r.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:a,href:o,title:s,text:i,tokens:r.inlineTokens(i)};return r.state.inLink=!1,c}function ka(e,t,a){let r=e.match(a.other.indentCodeCompensation);if(r===null)return t;let n=r[1];return t.split(`
`).map(o=>{let s=o.match(a.other.beginningSpace);if(s===null)return o;let[i]=s;return i.length>=n.length?o.slice(n.length):o}).join(`
`)}var lt=class{options;rules;lexer;constructor(e){this.options=e||Le}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let a=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?a:Ke(a,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let a=t[0],r=ka(a,t[3]||"",this.rules);return{type:"code",raw:a,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let a=t[2].trim();if(this.rules.other.endingHash.test(a)){let r=Ke(a,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(a=r.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Ke(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let a=Ke(t[0],`
`).split(`
`),r="",n="",o=[];for(;a.length>0;){let s=!1,i=[],c;for(c=0;c<a.length;c++)if(this.rules.other.blockquoteStart.test(a[c]))i.push(a[c]),s=!0;else if(!s)i.push(a[c]);else break;a=a.slice(c);let h=i.join(`
`),d=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${h}`:h,n=n?`${n}
${d}`:d;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,o,!0),this.lexer.state.top=g,a.length===0)break;let l=o.at(-1);if(l?.type==="code")break;if(l?.type==="blockquote"){let N=l,v=N.raw+`
`+a.join(`
`),S=this.blockquote(v);o[o.length-1]=S,r=r.substring(0,r.length-N.raw.length)+S.raw,n=n.substring(0,n.length-N.text.length)+S.text;break}else if(l?.type==="list"){let N=l,v=N.raw+`
`+a.join(`
`),S=this.list(v);o[o.length-1]=S,r=r.substring(0,r.length-l.raw.length)+S.raw,n=n.substring(0,n.length-N.raw.length)+S.raw,a=v.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:o,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let a=t[1].trim(),r=a.length>1,n={type:"list",raw:"",ordered:r,start:r?+a.slice(0,-1):"",loose:!1,items:[]};a=r?`\\d{1,9}\\${a.slice(-1)}`:`\\${a}`,this.options.pedantic&&(a=r?a:"[*+-]");let o=this.rules.other.listItemRegex(a),s=!1;for(;e;){let c=!1,h="",d="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;h=t[0],e=e.substring(h.length);let g=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,w=>" ".repeat(3*w.length)),l=e.split(`
`,1)[0],N=!g.trim(),v=0;if(this.options.pedantic?(v=2,d=g.trimStart()):N?v=t[1].length+1:(v=t[2].search(this.rules.other.nonSpaceChar),v=v>4?1:v,d=g.slice(v),v+=t[1].length),N&&this.rules.other.blankLine.test(l)&&(h+=l+`
`,e=e.substring(l.length+1),c=!0),!c){let w=this.rules.other.nextBulletRegex(v),k=this.rules.other.hrRegex(v),P=this.rules.other.fencesBeginRegex(v),D=this.rules.other.headingBeginRegex(v),T=this.rules.other.htmlBeginRegex(v);for(;e;){let j=e.split(`
`,1)[0],A;if(l=j,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,"  "),A=l):A=l.replace(this.rules.other.tabCharGlobal,"    "),P.test(l)||D.test(l)||T.test(l)||w.test(l)||k.test(l))break;if(A.search(this.rules.other.nonSpaceChar)>=v||!l.trim())d+=`
`+A.slice(v);else{if(N||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||P.test(g)||D.test(g)||k.test(g))break;d+=`
`+l}!N&&!l.trim()&&(N=!0),h+=j+`
`,e=e.substring(j.length+1),g=A.slice(v)}}n.loose||(s?n.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(s=!0));let S=null,M;this.options.gfm&&(S=this.rules.other.listIsTask.exec(d),S&&(M=S[0]!=="[ ] ",d=d.replace(this.rules.other.listReplaceTask,""))),n.items.push({type:"list_item",raw:h,task:!!S,checked:M,loose:!1,text:d,tokens:[]}),n.raw+=h}let i=n.items.at(-1);if(i)i.raw=i.raw.trimEnd(),i.text=i.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let c=0;c<n.items.length;c++)if(this.lexer.state.top=!1,n.items[c].tokens=this.lexer.blockTokens(n.items[c].text,[]),!n.loose){let h=n.items[c].tokens.filter(g=>g.type==="space"),d=h.length>0&&h.some(g=>this.rules.other.anyLine.test(g.raw));n.loose=d}if(n.loose)for(let c=0;c<n.items.length;c++)n.items[c].loose=!0;return n}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let a=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:a,raw:t[0],href:r,title:n}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let a=Sn(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(a.length===r.length){for(let s of r)this.rules.other.tableAlignRight.test(s)?o.align.push("right"):this.rules.other.tableAlignCenter.test(s)?o.align.push("center"):this.rules.other.tableAlignLeft.test(s)?o.align.push("left"):o.align.push(null);for(let s=0;s<a.length;s++)o.header.push({text:a[s],tokens:this.lexer.inline(a[s]),header:!0,align:o.align[s]});for(let s of n)o.rows.push(Sn(s,o.header.length).map((i,c)=>({text:i,tokens:this.lexer.inline(i),header:!1,align:o.align[c]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let a=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:a,tokens:this.lexer.inline(a)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let a=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(a)){if(!this.rules.other.endAngleBracket.test(a))return;let o=Ke(a.slice(0,-1),"\\");if((a.length-o.length)%2===0)return}else{let o=va(t[2],"()");if(o===-2)return;if(o>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let r=t[2],n="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(r);o&&(r=o[1],n=o[3])}else n=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(a)?r=r.slice(1):r=r.slice(1,-1)),$n(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let a;if((a=this.rules.inline.reflink.exec(e))||(a=this.rules.inline.nolink.exec(e))){let r=(a[2]||a[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=t[r.toLowerCase()];if(!n){let o=a[0].charAt(0);return{type:"text",raw:o,text:o}}return $n(a,n,a[0],this.lexer,this.rules)}}emStrong(e,t,a=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||r[3]&&a.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!a||this.rules.inline.punctuation.exec(a))){let n=[...r[0]].length-1,o,s,i=n,c=0,h=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,t=t.slice(-1*e.length+n);(r=h.exec(t))!=null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o)continue;if(s=[...o].length,r[3]||r[4]){i+=s;continue}else if((r[5]||r[6])&&n%3&&!((n+s)%3)){c+=s;continue}if(i-=s,i>0)continue;s=Math.min(s,s+i+c);let d=[...r[0]][0].length,g=e.slice(0,n+r.index+d+s);if(Math.min(n,s)%2){let N=g.slice(1,-1);return{type:"em",raw:g,text:N,tokens:this.lexer.inlineTokens(N)}}let l=g.slice(2,-2);return{type:"strong",raw:g,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let a=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return r&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:t[0],text:a}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let a,r;return t[2]==="@"?(a=t[1],r="mailto:"+a):(a=t[1],r=a),{type:"link",raw:t[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let a,r;if(t[2]==="@")a=t[0],r="mailto:"+a;else{let n;do n=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(n!==t[0]);a=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let a=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:a}}}},xe=class It{tokens;options;state;tokenizer;inlineQueue;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Le,this.options.tokenizer=this.options.tokenizer||new lt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let a={other:fe,block:it.normal,inline:Ve.normal};this.options.pedantic?(a.block=it.pedantic,a.inline=Ve.pedantic):this.options.gfm&&(a.block=it.gfm,this.options.breaks?a.inline=Ve.breaks:a.inline=Ve.gfm),this.tokenizer.rules=a}static get rules(){return{block:it,inline:Ve}}static lex(t,a){return new It(a).lex(t)}static lexInline(t,a){return new It(a).inlineTokens(t)}lex(t){t=t.replace(fe.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let r=this.inlineQueue[a];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,a=[],r=!1){for(this.options.pedantic&&(t=t.replace(fe.tabCharGlobal,"    ").replace(fe.spaceLine,""));t;){let n;if(this.options.extensions?.block?.some(s=>(n=s.call({lexer:this},t,a))?(t=t.substring(n.raw.length),a.push(n),!0):!1))continue;if(n=this.tokenizer.space(t)){t=t.substring(n.raw.length);let s=a.at(-1);n.raw.length===1&&s!==void 0?s.raw+=`
`:a.push(n);continue}if(n=this.tokenizer.code(t)){t=t.substring(n.raw.length);let s=a.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+n.raw,s.text+=`
`+n.text,this.inlineQueue.at(-1).src=s.text):a.push(n);continue}if(n=this.tokenizer.fences(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.heading(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.hr(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.blockquote(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.list(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.html(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.def(t)){t=t.substring(n.raw.length);let s=a.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+n.raw,s.text+=`
`+n.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},a.push(n));continue}if(n=this.tokenizer.table(t)){t=t.substring(n.raw.length),a.push(n);continue}if(n=this.tokenizer.lheading(t)){t=t.substring(n.raw.length),a.push(n);continue}let o=t;if(this.options.extensions?.startBlock){let s=1/0,i=t.slice(1),c;this.options.extensions.startBlock.forEach(h=>{c=h.call({lexer:this},i),typeof c=="number"&&c>=0&&(s=Math.min(s,c))}),s<1/0&&s>=0&&(o=t.substring(0,s+1))}if(this.state.top&&(n=this.tokenizer.paragraph(o))){let s=a.at(-1);r&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+n.raw,s.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):a.push(n),r=o.length!==t.length,t=t.substring(n.raw.length);continue}if(n=this.tokenizer.text(t)){t=t.substring(n.raw.length);let s=a.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+n.raw,s.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):a.push(n);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,a}inline(t,a=[]){return this.inlineQueue.push({src:t,tokens:a}),a}inlineTokens(t,a=[]){let r=t,n=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)c.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,n.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let o;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)o=n[2]?n[2].length:0,r=r.slice(0,n.index+o)+"["+"a".repeat(n[0].length-o-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let s=!1,i="";for(;t;){s||(i=""),s=!1;let c;if(this.options.extensions?.inline?.some(d=>(c=d.call({lexer:this},t,a))?(t=t.substring(c.raw.length),a.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let d=a.at(-1);c.type==="text"&&d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):a.push(c);continue}if(c=this.tokenizer.emStrong(t,r,i)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.del(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),a.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),a.push(c);continue}let h=t;if(this.options.extensions?.startInline){let d=1/0,g=t.slice(1),l;this.options.extensions.startInline.forEach(N=>{l=N.call({lexer:this},g),typeof l=="number"&&l>=0&&(d=Math.min(d,l))}),d<1/0&&d>=0&&(h=t.substring(0,d+1))}if(c=this.tokenizer.inlineText(h)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(i=c.raw.slice(-1)),s=!0;let d=a.at(-1);d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):a.push(c);continue}if(t){let d="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return a}},dt=class{options;parser;constructor(e){this.options=e||Le}space(e){return""}code({text:e,lang:t,escaped:a}){let r=(t||"").match(fe.notSpaceStart)?.[0],n=e.replace(fe.endingNewline,"")+`
`;return r?'<pre><code class="language-'+$e(r)+'">'+(a?n:$e(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:$e(n,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,a=e.start,r="";for(let s=0;s<e.items.length;s++){let i=e.items[s];r+=this.listitem(i)}let n=t?"ol":"ul",o=t&&a!==1?' start="'+a+'"':"";return"<"+n+o+`>
`+r+"</"+n+`>
`}listitem(e){let t="";if(e.task){let a=this.checkbox({checked:!!e.checked});e.loose?e.tokens[0]?.type==="paragraph"?(e.tokens[0].text=a+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=a+" "+$e(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:a+" ",text:a+" ",escaped:!0}):t+=a+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",a="";for(let n=0;n<e.header.length;n++)a+=this.tablecell(e.header[n]);t+=this.tablerow({text:a});let r="";for(let n=0;n<e.rows.length;n++){let o=e.rows[n];a="";for(let s=0;s<o.length;s++)a+=this.tablecell(o[s]);r+=this.tablerow({text:a})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),a=e.header?"th":"td";return(e.align?`<${a} align="${e.align}">`:`<${a}>`)+t+`</${a}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${$e(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:a}){let r=this.parser.parseInline(a),n=Cn(e);if(n===null)return r;e=n;let o='<a href="'+e+'"';return t&&(o+=' title="'+$e(t)+'"'),o+=">"+r+"</a>",o}image({href:e,title:t,text:a,tokens:r}){r&&(a=this.parser.parseInline(r,this.parser.textRenderer));let n=Cn(e);if(n===null)return $e(a);e=n;let o=`<img src="${e}" alt="${a}"`;return t&&(o+=` title="${$e(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:$e(e.text)}},qt=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}},Ne=class Mt{options;renderer;textRenderer;constructor(t){this.options=t||Le,this.options.renderer=this.options.renderer||new dt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new qt}static parse(t,a){return new Mt(a).parse(t)}static parseInline(t,a){return new Mt(a).parseInline(t)}parse(t,a=!0){let r="";for(let n=0;n<t.length;n++){let o=t[n];if(this.options.extensions?.renderers?.[o.type]){let i=o,c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){r+=c||"";continue}}let s=o;switch(s.type){case"space":{r+=this.renderer.space(s);continue}case"hr":{r+=this.renderer.hr(s);continue}case"heading":{r+=this.renderer.heading(s);continue}case"code":{r+=this.renderer.code(s);continue}case"table":{r+=this.renderer.table(s);continue}case"blockquote":{r+=this.renderer.blockquote(s);continue}case"list":{r+=this.renderer.list(s);continue}case"html":{r+=this.renderer.html(s);continue}case"def":{r+=this.renderer.def(s);continue}case"paragraph":{r+=this.renderer.paragraph(s);continue}case"text":{let i=s,c=this.renderer.text(i);for(;n+1<t.length&&t[n+1].type==="text";)i=t[++n],c+=`
`+this.renderer.text(i);a?r+=this.renderer.paragraph({type:"paragraph",raw:c,text:c,tokens:[{type:"text",raw:c,text:c,escaped:!0}]}):r+=c;continue}default:{let i='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return r}parseInline(t,a=this.renderer){let r="";for(let n=0;n<t.length;n++){let o=t[n];if(this.options.extensions?.renderers?.[o.type]){let i=this.options.extensions.renderers[o.type].call({parser:this},o);if(i!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){r+=i||"";continue}}let s=o;switch(s.type){case"escape":{r+=a.text(s);break}case"html":{r+=a.html(s);break}case"link":{r+=a.link(s);break}case"image":{r+=a.image(s);break}case"strong":{r+=a.strong(s);break}case"em":{r+=a.em(s);break}case"codespan":{r+=a.codespan(s);break}case"br":{r+=a.br(s);break}case"del":{r+=a.del(s);break}case"text":{r+=a.text(s);break}default:{let i='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return r}},Ze=class{options;block;constructor(e){this.options=e||Le}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?xe.lex:xe.lexInline}provideParser(){return this.block?Ne.parse:Ne.parseInline}},wa=class{defaults=Pt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ne;Renderer=dt;TextRenderer=qt;Lexer=xe;Tokenizer=lt;Hooks=Ze;constructor(...e){this.use(...e)}walkTokens(e,t){let a=[];for(let r of e)switch(a=a.concat(t.call(this,r)),r.type){case"table":{let n=r;for(let o of n.header)a=a.concat(this.walkTokens(o.tokens,t));for(let o of n.rows)for(let s of o)a=a.concat(this.walkTokens(s.tokens,t));break}case"list":{let n=r;a=a.concat(this.walkTokens(n.items,t));break}default:{let n=r;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(o=>{let s=n[o].flat(1/0);a=a.concat(this.walkTokens(s,t))}):n.tokens&&(a=a.concat(this.walkTokens(n.tokens,t)))}}return a}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(a=>{let r={...a};if(r.async=this.defaults.async||r.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let o=t.renderers[n.name];o?t.renderers[n.name]=function(...s){let i=n.renderer.apply(this,s);return i===!1&&(i=o.apply(this,s)),i}:t.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[n.level];o?o.unshift(n.tokenizer):t[n.level]=[n.tokenizer],n.start&&(n.level==="block"?t.startBlock?t.startBlock.push(n.start):t.startBlock=[n.start]:n.level==="inline"&&(t.startInline?t.startInline.push(n.start):t.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(t.childTokens[n.name]=n.childTokens)}),r.extensions=t),a.renderer){let n=this.defaults.renderer||new dt(this.defaults);for(let o in a.renderer){if(!(o in n))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let s=o,i=a.renderer[s],c=n[s];n[s]=(...h)=>{let d=i.apply(n,h);return d===!1&&(d=c.apply(n,h)),d||""}}r.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new lt(this.defaults);for(let o in a.tokenizer){if(!(o in n))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let s=o,i=a.tokenizer[s],c=n[s];n[s]=(...h)=>{let d=i.apply(n,h);return d===!1&&(d=c.apply(n,h)),d}}r.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Ze;for(let o in a.hooks){if(!(o in n))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let s=o,i=a.hooks[s],c=n[s];Ze.passThroughHooks.has(o)?n[s]=h=>{if(this.defaults.async&&Ze.passThroughHooksRespectAsync.has(o))return(async()=>{let g=await i.call(n,h);return c.call(n,g)})();let d=i.call(n,h);return c.call(n,d)}:n[s]=(...h)=>{if(this.defaults.async)return(async()=>{let g=await i.apply(n,h);return g===!1&&(g=await c.apply(n,h)),g})();let d=i.apply(n,h);return d===!1&&(d=c.apply(n,h)),d}}r.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,o=a.walkTokens;r.walkTokens=function(s){let i=[];return i.push(o.call(this,s)),n&&(i=i.concat(n.call(this,s))),i}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return xe.lex(e,t??this.defaults)}parser(e,t){return Ne.parse(e,t??this.defaults)}parseMarkdown(e){return(t,a)=>{let r={...a},n={...this.defaults,...r},o=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=e),n.async)return(async()=>{let s=n.hooks?await n.hooks.preprocess(t):t,i=await(n.hooks?await n.hooks.provideLexer():e?xe.lex:xe.lexInline)(s,n),c=n.hooks?await n.hooks.processAllTokens(i):i;n.walkTokens&&await Promise.all(this.walkTokens(c,n.walkTokens));let h=await(n.hooks?await n.hooks.provideParser():e?Ne.parse:Ne.parseInline)(c,n);return n.hooks?await n.hooks.postprocess(h):h})().catch(o);try{n.hooks&&(t=n.hooks.preprocess(t));let s=(n.hooks?n.hooks.provideLexer():e?xe.lex:xe.lexInline)(t,n);n.hooks&&(s=n.hooks.processAllTokens(s)),n.walkTokens&&this.walkTokens(s,n.walkTokens);let i=(n.hooks?n.hooks.provideParser():e?Ne.parse:Ne.parseInline)(s,n);return n.hooks&&(i=n.hooks.postprocess(i)),i}catch(s){return o(s)}}}onError(e,t){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+$e(a.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(a);throw a}}},Oe=new wa;function Q(e,t){return Oe.parse(e,t)}Q.options=Q.setOptions=function(e){return Oe.setOptions(e),Q.defaults=Oe.defaults,Rn(Q.defaults),Q};Q.getDefaults=Pt;Q.defaults=Le;Q.use=function(...e){return Oe.use(...e),Q.defaults=Oe.defaults,Rn(Q.defaults),Q};Q.walkTokens=function(e,t){return Oe.walkTokens(e,t)};Q.parseInline=Oe.parseInline;Q.Parser=Ne;Q.parser=Ne.parse;Q.Renderer=dt;Q.TextRenderer=qt;Q.Lexer=xe;Q.lexer=xe.lex;Q.Tokenizer=lt;Q.Hooks=Ze;Q.parse=Q;var Rs=Q.options,Es=Q.setOptions,Is=Q.use,Ms=Q.walkTokens,Ps=Q.parseInline;var zs=Ne.parse,As=xe.lex;function _t(e,t="https://example.invalid/"){try{let a=new URL(e,t);return["https:","http:","mailto:"].includes(a.protocol)?a.href:null}catch{return null}}function Dt(e){let t={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\xA0"};return e.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(a,r)=>{if(!r.startsWith("#"))return t[r.toLowerCase()]??a;let n=r.toLowerCase().startsWith("#x")?Number.parseInt(r.slice(2),16):Number.parseInt(r.slice(1),10);return n>0&&n<=1114111&&!(n>=55296&&n<=57343)?String.fromCodePoint(n):"\uFFFD"})}var Z=require("react/jsx-runtime");function ya({text:e,lang:t,t:a}){let[r,n]=(0,Pe.useState)(!1);return(0,Z.jsxs)("div",{className:"ch-code-block",children:[(0,Z.jsxs)("header",{children:[(0,Z.jsx)("span",{children:t||"text"}),(0,Z.jsx)("button",{className:"ch-mini-button",onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0)).catch(()=>n(!1))},children:a(r?"copied":"copyRecord")})]}),(0,Z.jsx)("pre",{children:(0,Z.jsx)("code",{children:e})})]})}function Un(e,t,a=0){return a>16?e.map(r=>r.raw).join(""):e.map((r,n)=>{let o=i=>Un(i,t,a+1),s;switch(r.type){case"space":s=null;break;case"paragraph":s=(0,Z.jsx)("p",{children:o(r.tokens)});break;case"heading":{let i=r;s=(0,Pe.createElement)(`h${Math.min(6,Math.max(2,i.depth+1))}`,null,o(i.tokens));break}case"text":{let i=r;s=i.tokens?o(i.tokens):Dt(i.text);break}case"escape":s=Dt(r.text);break;case"strong":s=(0,Z.jsx)("strong",{children:o(r.tokens)});break;case"em":s=(0,Z.jsx)("em",{children:o(r.tokens)});break;case"del":s=(0,Z.jsx)("del",{children:o(r.tokens)});break;case"codespan":s=(0,Z.jsx)("code",{children:r.text});break;case"code":{let i=r;s=(0,Z.jsx)(ya,{text:i.text,lang:i.lang,t});break}case"blockquote":s=(0,Z.jsx)("blockquote",{children:o(r.tokens)});break;case"br":s=(0,Z.jsx)("br",{});break;case"hr":s=(0,Z.jsx)("hr",{});break;case"list":{let i=r,c=i.items.map((h,d)=>(0,Z.jsxs)("li",{children:[h.task&&(0,Z.jsxs)("span",{className:"ch-task-state","aria-label":t(h.checked?"taskChecked":"taskUnchecked"),children:[h.checked?"\u2611":"\u2610"," "]}),o(h.tokens)]},d));s=i.ordered?(0,Z.jsx)("ol",{start:typeof i.start=="number"?i.start:1,children:c}):(0,Z.jsx)("ul",{children:c});break}case"table":{let i=r;s=(0,Z.jsx)("div",{className:"ch-rich-table",children:(0,Z.jsxs)("table",{children:[(0,Z.jsx)("thead",{children:(0,Z.jsx)("tr",{children:i.header.map((c,h)=>(0,Z.jsx)("th",{children:o(c.tokens)},h))})}),(0,Z.jsx)("tbody",{children:i.rows.map((c,h)=>(0,Z.jsx)("tr",{children:c.map((d,g)=>(0,Z.jsx)("td",{children:o(d.tokens)},g))},h))})]})});break}case"link":{let i=r,c=_t(i.href,location.href);s=c?(0,Z.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:o(i.tokens)}):(0,Z.jsx)("span",{children:o(i.tokens)});break}case"image":{let i=r,c=_t(i.href,location.href),h=`${t("imageLink")}: ${i.text||i.href}`;s=c?(0,Z.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:h}):(0,Z.jsx)("span",{children:h});break}case"def":s=null;break;default:s=(0,Z.jsx)("span",{children:r.raw})}return(0,Z.jsx)(Pe.Fragment,{children:s},n)})}function qn({text:e,t}){let a=(0,Pe.useMemo)(()=>xe.lex(e,{gfm:!0,breaks:!1}),[e]);return(0,Z.jsx)("div",{className:"ch-rich-text",children:Un(a,t)})}function qe(e,t,a,r,n){let o=e.reduce((v,S)=>v+S.weight,0);if(e.length===0||o<=0||r<=0||n<=0)return[];if(e.length===1)return[{item:e[0].item,x:t,y:a,w:r,h:n}];let s=[...e].sort((v,S)=>S.weight-v.weight),i=0,c=1,h=o/2;for(let v=0;v<s.length-1&&(i+=s[v].weight,c=v+1,!(i>=h));v++);let d=s.slice(0,c),g=s.slice(c),l=i/o;if(r>=n){let v=r*l;return[...qe(d,t,a,v,n),...qe(g,t+v,a,r-v,n)]}let N=n*l;return[...qe(d,t,a,r,N),...qe(g,t,a+N,r,n-N)]}function _n(e){let t=["user","assistant","tool","event"],a=e.reduce((s,i)=>s+i.text.length,0),r=t.map(s=>{let i=e.filter(d=>d.kind===s),c=i.reduce((d,g)=>d+g.text.length,0),h=i.reduce((d,g)=>d+Math.max(1,g.text.length),0);return{kind:s,list:i,chars:c,weight:h}}).filter(s=>s.list.length>0),o=qe(r.map(s=>({item:s,weight:s.weight})),0,0,100,100).map(s=>{let{kind:i,list:c,chars:h}=s.item,d=qe(c.map(g=>({item:g,weight:Math.max(1,g.text.length)})),0,0,100,100).map(g=>({id:g.item.id,seq:g.item.seq,kind:g.item.kind,label:g.item.toolName??g.item.title,chars:g.item.text.length,isError:g.item.isError===!0,x:g.x,y:g.y,w:g.w,h:g.h}));return{kind:i,count:c.length,chars:h,share:a>0?h/a*100:0,x:s.x,y:s.y,w:s.w,h:s.h,blocks:d}});return{totalChars:a,categories:o}}function Dn(e,t,a=500){let r=t.trim().toLocaleLowerCase();if(!r||!e)return[];let n="",o=[],s=[];for(let h=0;h<e.length;){let g=e.codePointAt(h)>65535?2:1,l=e.slice(h,h+g).toLocaleLowerCase();for(let N=0;N<l.length;N++)o.push(h),s.push(h+g);n+=l,h+=g}let i=[],c=0;for(;i.length<a;){let h=n.indexOf(r,c);if(h<0)break;let d=h+r.length-1,g=o[h],l=s[d];g!==void 0&&l!==void 0&&i.push({start:g,end:l}),c=h+Math.max(1,r.length)}return i}function jt(e){if(typeof e!="string"||e.trim().length===0)return null;try{let t=JSON.parse(e);if(t===null||typeof t!="object"||Array.isArray(t))return null;let a=Object.entries(t);return a.length===0?null:a.map(([r,n])=>[r,typeof n=="string"?n:n===void 0?"":JSON.stringify(n,null,2)])}catch{return null}}var f=require("react/jsx-runtime");function Bt(e,t,a,r,n,o){let s=a.trim().toLocaleLowerCase();return e.filter(i=>r&&i.isError!==!0||(t==="messages"?i.kind!=="user"&&i.kind!=="assistant":t!=="all"&&i.kind!==t)?!1:s?s.startsWith("tool:")?n.get(i.id)?.toLocaleLowerCase()===s.slice(5):`${ut(i,n.get(i.id),o)} ${i.text}`.toLocaleLowerCase().includes(s):!0)}function ut(e,t,a){if(e.kind==="user"||e.kind==="assistant")return ze(e.text)||a(e.kind);if(e.eventType==="tool/call"&&e.arguments){let n=jt(e.arguments)?.find(([o])=>["command","cmd","path","file_path","filePath","pattern","description"].includes(o));if(n)return ze(n[1],90)}return t??e.toolName??(e.eventType==="tool/result"?a("toolOutput"):e.title)}function Na(e){return e?e.split(/\r\n|\r|\n/).length:0}function Ta({text:e,matches:t,activeIndex:a}){let r=(0,Y.useRef)(null);if((0,Y.useEffect)(()=>{r.current?.scrollIntoView({block:"nearest"})},[a,t]),t.length===0)return(0,f.jsx)(f.Fragment,{children:e});let n=[],o=0;for(let s=0;s<t.length;s++){let i=t[s];i.start>o&&n.push((0,f.jsx)(Y.Fragment,{children:e.slice(o,i.start)},`t-${s}`));let c=s===a;n.push((0,f.jsx)("mark",{ref:c?r:void 0,className:`ch-find-mark ${c?"is-current":""}`,children:e.slice(i.start,i.end)},`m-${s}`)),o=i.end}return o<e.length&&n.push((0,f.jsx)(Y.Fragment,{children:e.slice(o)},"tail")),(0,f.jsx)(f.Fragment,{children:n})}function Ca({item:e,title:t,pairedItem:a,onFocus:r,t:n}){let[o,s]=(0,Y.useState)(e.kind==="user"||e.kind==="assistant"),[i,c]=(0,Y.useState)("idle"),[h,d]=(0,Y.useState)(!1),[g,l]=(0,Y.useState)(""),[N,v]=(0,Y.useState)(0),S=e.arguments??e.text,M=(0,Y.useMemo)(()=>h&&g.trim()?Dn(S,g):[],[h,g,S]),w=M.length>0?(N%M.length+M.length)%M.length:0,k=e.eventType==="tool/call"?e:a?.eventType==="tool/call"?a:void 0,P=(0,Y.useMemo)(()=>jt(k?.arguments),[k?.arguments]),D=e.kind!=="tool"?null:e.isError===!0||a?.isError===!0?"err":e.isError===!1||a?.isError===!1?"ok":"pending",T=Na(S),j=e.eventType==="tool/result"?n("resultOutput"):e.eventType==="tool/call"?n("argumentsLabel"):e.kind==="user"?n("userMessages"):e.kind==="assistant"?n("assistantMessages"):n("event");return(0,f.jsxs)("section",{className:"ch-record-detail ch-br-inline","aria-label":n("recordDetails"),children:[(0,f.jsxs)("div",{className:"ch-record-meta",children:[(0,f.jsxs)("span",{children:["#",e.seq]}),(0,f.jsx)("span",{title:n("recordTime"),children:e.time===void 0?n("unavailable"):ye(e.time)}),e.eventType&&(0,f.jsx)("span",{children:e.eventType}),e.callId&&(0,f.jsxs)("span",{title:e.callId,children:["Call ID \xB7 ",e.callId]}),(0,f.jsx)(Tt,{item:e,t:n}),a&&(0,f.jsx)("button",{type:"button",className:"ch-mini-button ch-pair-jump",onClick:()=>r(a.id),children:a.eventType==="tool/result"?`${n("jumpResult")} \u2197`:`${n("jumpCall")} \u2196`})]}),(0,f.jsx)(cn,{item:e,t:n}),k&&P&&(0,f.jsxs)("div",{className:"ch-ts-card",children:[(0,f.jsxs)("div",{className:"ch-ts-head",children:[(0,f.jsxs)("span",{className:"ch-ts-call-name",title:t,children:[e.eventType==="tool/result"?"\u2190":"\u2192"," ",k.toolName??k.title]}),(0,f.jsxs)("div",{className:"ch-ts-right",children:[(0,f.jsxs)("span",{className:"ch-ts-meta",children:["#",k.seq,a&&e.eventType==="tool/call"?` \u2192 #${a.seq}`:""]}),D==="ok"&&(0,f.jsxs)("span",{className:"ch-call-state is-ok",children:[(0,f.jsx)("i",{}),n("statusOk")]}),D==="err"&&(0,f.jsxs)("span",{className:"ch-call-state is-err",children:[(0,f.jsx)("i",{}),n("failed")]})]})]}),(0,f.jsx)("div",{className:"ch-ts-args",children:P.map(([A,z])=>(0,f.jsxs)("div",{className:"ch-ts-arg-row",children:[(0,f.jsx)("span",{className:"ch-ts-arg-key",children:A}),(0,f.jsx)("span",{className:"ch-ts-arg-val",children:z})]},A))})]}),(0,f.jsxs)("div",{className:"ch-ts-card",children:[(0,f.jsxs)("div",{className:"ch-ts-head",children:[(0,f.jsx)("span",{children:j}),(0,f.jsxs)("div",{className:"ch-ts-right",children:[(0,f.jsxs)("span",{className:"ch-ts-meta",children:[T," ",n("linesUnit")]}),(0,f.jsx)("button",{type:"button",className:`ch-mini-button ch-find-toggle ${h?"is-active":""}`,"aria-pressed":h,title:n("findInRecord"),"aria-label":n("findInRecord"),onClick:()=>{let A=!h;d(A),A?s(!1):(l(""),v(0))},children:(0,f.jsxs)("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2","aria-hidden":"true",children:[(0,f.jsx)("circle",{cx:"11",cy:"11",r:"7.5"}),(0,f.jsx)("path",{d:"m20.5 20.5-4.2-4.2"})]})}),(0,f.jsxs)("div",{className:"ch-seg",role:"group",children:[(0,f.jsx)("button",{type:"button",className:o?"is-active":"","aria-pressed":o,onClick:()=>{s(!0),d(!1),l(""),v(0)},children:n("renderedText")}),(0,f.jsx)("button",{type:"button",className:o?"":"is-active","aria-pressed":!o,onClick:()=>s(!1),children:n("sourceText")})]}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button",onClick:()=>{if(!navigator.clipboard?.writeText){c("failed");return}navigator.clipboard.writeText(e.text).then(()=>c("done")).catch(()=>c("failed"))},children:n(i==="done"?"copied":i==="failed"?"copyFailed":"copyRecord")})]})]}),h&&(0,f.jsxs)("div",{className:"ch-find-bar",children:[(0,f.jsx)("input",{value:g,onChange:A=>{l(A.target.value),v(0)},onKeyDown:A=>{A.key==="Escape"&&(A.stopPropagation(),A.preventDefault(),d(!1),l(""),v(0))},placeholder:n("findPlaceholder"),"aria-label":n("findPlaceholder"),autoFocus:!0}),(0,f.jsx)("span",{className:"ch-find-count",children:M.length>0?`${w+1}/${M.length}`:"0/0"}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button",disabled:M.length===0,"aria-label":n("findPrev"),onClick:()=>v(A=>A-1),children:"\u2191"}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button",disabled:M.length===0,"aria-label":n("findNext"),onClick:()=>v(A=>A+1),children:"\u2193"}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button","aria-label":n("closeFind"),onClick:()=>{d(!1),l(""),v(0)},children:"\xD7"})]}),(0,f.jsx)("div",{className:"ch-record-content",children:e.text.length===0&&!e.arguments?(0,f.jsx)("p",{className:"ch-note",children:n("blank")}):o?(0,f.jsx)(qn,{text:e.text,t:n}):h&&g.trim()?(0,f.jsx)("pre",{className:"ch-source-text",children:(0,f.jsx)("code",{children:(0,f.jsx)(Ta,{text:S,matches:M,activeIndex:w})})}):(0,f.jsx)("pre",{className:"ch-source-text",children:(0,f.jsx)("code",{children:S||"\u2014"})})})]})]})}function jn({items:e,pairs:t,available:a,toolByRecord:r,focus:n,onFocus:o,onJumpRecord:s,filter:i,onFilter:c,query:h,onQuery:d,errorsOnly:g,onErrorsOnly:l,loading:N,error:v,hasMore:S,older:M,latest:w,isOlder:k,retry:P,searchInputRef:D,t:T}){let j=(0,Y.useDeferredValue)(h),[A,z]=(0,Y.useState)(!0),[L,J]=(0,Y.useState)(!1),[K,y]=(0,Y.useState)(()=>new Set(["user","assistant","tool"])),H=(0,Y.useMemo)(()=>new Map(e.map(R=>[R.id,R])),[e]),u=(0,Y.useMemo)(()=>e.filter(R=>R.isError===!0).length,[e]),U=(0,Y.useMemo)(()=>{let R=0,W=0,ue=0,pe=0;for(let m of e)m.kind==="user"?R+=1:m.kind==="assistant"?W+=1:m.kind==="tool"?ue+=1:pe+=1;return{all:e.length,messages:R+W,user:R,assistant:W,tool:ue,event:pe}},[e]),C=(0,Y.useMemo)(()=>L?_n(e):null,[L,e]),B=(0,Y.useMemo)(()=>Bt(e,i,j,g,r,T),[e,i,j,g,r,T]),q=B.find(R=>R.id===n)??B.findLast(R=>R.kind==="assistant"||R.kind==="user")??B.at(-1);(0,Y.useEffect)(()=>{h!==j||!q||(q.id!==n&&o(q.id),y(R=>R.has(q.kind)?R:new Set([...R,q.kind])))},[q?.id,n,h,j,o]);let ee=B.findIndex(R=>R.id===q?.id),le=R=>{let W=r.get(R.id),ue=q?.id===R.id,pe=R.toolName??W,m=H.get(t.get(R.id)??"");return(0,f.jsxs)("div",{className:`ch-br-elem ${ue?"is-selected":""} ${R.isError===!0?"is-error-row":""}`,children:[(0,f.jsxs)("button",{type:"button",className:`ch-record-item ch-record-${R.kind} ${ue?"is-selected":""} ${R.isError===!0?"is-error-row":""}`,"aria-expanded":ue,"aria-pressed":ue,title:ut(R,W,T),onClick:()=>o(R.id),children:[(0,f.jsx)("span",{className:"ch-br-chev","aria-hidden":"true",children:ue?"\u25BE":"\u25B8"}),R.isError===!0&&(0,f.jsx)("i",{className:"ch-br-err-dot","aria-hidden":"true"}),pe?(0,f.jsx)("span",{className:"ch-br-tag",children:pe}):(0,f.jsxs)("span",{className:"ch-br-tag is-role",children:[(0,f.jsx)("i",{style:{background:Me[R.kind]}}),T(R.kind)]}),(0,f.jsx)("span",{className:"ch-record-title",children:ut(R,W,T)}),(0,f.jsx)(Tt,{item:R,t:T}),(0,f.jsx)("span",{className:"ch-record-time",children:R.time===void 0?"":ye(R.time)}),(0,f.jsxs)("span",{className:"ch-record-seq",title:`Seq ${R.seq}`,children:["#",R.seq]})]}),ue&&(0,f.jsx)(Ca,{item:R,title:ut(R,W,T),pairedItem:m,onFocus:s,t:T},R.id)]},R.id)},de={user:"userMessages",assistant:"assistantMessages",tool:"tools",event:"events"},we=Math.max(1,e.length);return(0,f.jsxs)(se,{title:T("browserTitle"),className:"ch-browser-card",aside:(0,f.jsxs)("div",{className:"ch-br-head-right",children:[(0,f.jsxs)("div",{className:"ch-seg",role:"group",children:[(0,f.jsx)("button",{type:"button",className:A?"is-active":"","aria-pressed":A,onClick:()=>z(!0),children:T("categories")}),(0,f.jsx)("button",{type:"button",className:A?"":"is-active","aria-pressed":!A,onClick:()=>z(!1),children:T("chronological")})]}),(0,f.jsx)("button",{type:"button",className:`ch-map-btn ${L?"is-active":""}`,"aria-pressed":L,"aria-label":T("treemapToggle"),title:T("treemapToggle"),onClick:()=>J(R=>!R),children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[(0,f.jsx)("rect",{x:"1.5",y:"1.5",width:"7",height:"8",rx:"1.2"}),(0,f.jsx)("rect",{x:"10.5",y:"1.5",width:"4",height:"5",rx:"1.2"}),(0,f.jsx)("rect",{x:"10.5",y:"8.5",width:"4",height:"6",rx:"1.2"}),(0,f.jsx)("rect",{x:"1.5",y:"11.5",width:"7",height:"3",rx:"1.2"})]})}),(0,f.jsxs)("span",{className:"ch-scope",children:[T("browserScope")," \xB7 ",a?e.length:"\u2014"]})]}),children:[(0,f.jsxs)("div",{className:"ch-br-summary",children:[(0,f.jsxs)("b",{children:[T("historyWindow")," \xB7 ",a?e.length:"\u2014"," ",T("count")]}),(0,f.jsx)("span",{children:T("byRecordCount")})]}),(0,f.jsx)("div",{className:"ch-br-propbar","aria-hidden":"true",children:["user","assistant","tool","event"].map(R=>{let W=e.length>0?U[R]/we*100:0;return W>0?(0,f.jsx)("div",{style:{width:`${W}%`,background:Me[R]}},R):null})}),L&&C&&(0,f.jsxs)("div",{className:"ch-treemap-panel",children:[(0,f.jsxs)("div",{className:"ch-treemap-head",children:[(0,f.jsx)("b",{children:T("treemapTitle")}),(0,f.jsxs)("span",{children:[V(C.totalChars)," ",T("charsUnit")]})]}),C.categories.length===0?(0,f.jsx)("p",{className:"ch-note",children:T("noHistory")}):(0,f.jsx)("div",{className:"ch-treemap-stage",children:C.categories.map(R=>(0,f.jsxs)("div",{className:`ch-map-cat ch-map-${R.kind}`,style:{left:`${R.x}%`,top:`${R.y}%`,width:`${R.w}%`,height:`${R.h}%`},children:[R.h>=15&&(0,f.jsxs)("button",{type:"button",className:"ch-map-cat-head",onClick:()=>{let W=R.blocks[0];W&&s(W.id)},children:[(0,f.jsx)("span",{children:T(de[R.kind])}),(0,f.jsxs)("b",{children:[Math.round(R.share),"%"]})]}),(0,f.jsx)("div",{className:"ch-map-cat-body",children:R.blocks.map(W=>(0,f.jsxs)("button",{type:"button",className:`ch-map-block ${q?.id===W.id?"is-selected":""} ${W.isError?"is-err":""}`,style:{left:`${W.x}%`,top:`${W.y}%`,width:`${W.w}%`,height:`${W.h}%`},title:`#${W.seq} ${W.label} \xB7 ${V(W.chars)} ${T("charsUnit")}`,onClick:()=>s(W.id),children:[(0,f.jsxs)("span",{className:"ch-map-lbl",children:["#",W.seq]}),(0,f.jsx)("span",{className:"ch-map-num",children:V(W.chars)})]},W.id))})]},R.kind))}),(0,f.jsx)("p",{className:"ch-note",children:T("treemapNote")})]}),(0,f.jsxs)("div",{className:"ch-browser-toolbar",children:[(0,f.jsx)("div",{className:"ch-filter",role:"group","aria-label":T("history"),children:["all","messages","tool","event"].map(R=>{let W=T(R==="tool"?"tools":R==="event"?"events":R);return(0,f.jsxs)("button",{type:"button",className:i===R?"is-active":"","aria-label":W,"aria-pressed":i===R,onClick:()=>c(R),children:[W,(0,f.jsx)("span",{className:"ch-filter-count",children:a?U[R]:"\u2014"})]},R)})}),(u>0||g)&&(0,f.jsxs)("button",{type:"button",className:`ch-chip ch-err-toggle ${g?"is-active":""}`,"aria-pressed":g,onClick:()=>l(!g),children:[T("errorsOnly")," (",u,")"]})]}),(0,f.jsxs)("div",{className:"ch-browser-search",children:[(0,f.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2","aria-hidden":"true",children:[(0,f.jsx)("circle",{cx:"11",cy:"11",r:"8"}),(0,f.jsx)("path",{d:"m21 21-4.3-4.3"})]}),(0,f.jsx)("input",{ref:D,value:h,onChange:R=>d(R.target.value),placeholder:T("searchRecords"),"aria-label":T("searchRecords")}),h&&(0,f.jsx)("button",{type:"button",className:"ch-mini-button",onClick:()=>d(""),"aria-label":T("all"),children:"\xD7"}),(0,f.jsxs)("span",{children:[a?B.length:"\u2014","/",a?e.length:"\u2014"]})]}),v&&(0,f.jsxs)("div",{className:"ch-error",role:"alert",children:[(0,f.jsxs)("span",{children:[T("historyError")," ",v]}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button",onClick:P,children:T("retry")})]}),(0,f.jsx)("div",{className:"ch-browser-records","aria-busy":N||j!==h,children:N&&e.length===0?(0,f.jsx)("p",{className:"ch-note",children:T("historyLoading")}):B.length===0?(0,f.jsx)("p",{className:"ch-note",children:T(a?h||g?"noMatches":"noHistory":"unavailable")}):A?["user","assistant","tool","event"].map(R=>{let W=B.filter(pe=>pe.kind===R);if(i==="messages"&&R!=="user"&&R!=="assistant"||i!=="messages"&&i!=="all"&&i!==R)return null;let ue=e.length>0?Math.round(W.length/we*100):0;return(0,f.jsxs)("section",{className:`ch-record-group ch-group-${R}`,children:[(0,f.jsxs)("button",{type:"button",className:"ch-group-heading","aria-expanded":K.has(R),disabled:W.length===0,onClick:()=>y(pe=>{let m=new Set(pe);return m.has(R)?m.delete(R):m.add(R),m}),children:[(0,f.jsx)("span",{className:"ch-br-chev","aria-hidden":"true",children:K.has(R)?"\u25BE":"\u25B8"}),(0,f.jsx)("i",{className:"ch-cat-sq",style:{background:Me[R]}}),(0,f.jsx)("b",{children:T(de[R])}),(0,f.jsxs)("span",{className:"ch-group-cnt",children:[W.length," ",T("count")]}),(0,f.jsxs)("span",{className:"ch-group-pct",children:[ue,"%"]})]}),K.has(R)&&W.length>0&&(0,f.jsx)("div",{className:"ch-group-body",children:W.map(le)})]},R)}):(0,f.jsx)("div",{className:"ch-group-body",children:B.map(le)})}),(0,f.jsxs)("div",{className:"ch-record-navigation",children:[(0,f.jsx)("span",{className:"ch-note",children:T("shortcutsHint")}),(0,f.jsxs)("div",{children:[(0,f.jsx)("button",{type:"button",className:"ch-mini-button",disabled:ee<=0,onClick:()=>o(B[ee-1].id),children:T("prevRecord")}),(0,f.jsxs)("span",{children:[a?ee<0?0:ee+1:"\u2014","/",a?B.length:"\u2014"]}),(0,f.jsx)("button",{type:"button",className:"ch-mini-button",disabled:ee<0||ee===B.length-1,onClick:()=>o(B[ee+1].id),children:T("nextRecord")})]})]}),(0,f.jsxs)("footer",{className:"ch-browser-footer",children:[(0,f.jsx)("p",{className:"ch-note",children:T("historyNote")}),(0,f.jsxs)("div",{children:[k&&(0,f.jsx)("button",{type:"button",className:"ch-mini-button",disabled:N,onClick:w,children:T("latestWindow")}),S&&(0,f.jsx)("button",{type:"button",className:"ch-button",disabled:N,onClick:M,children:T(N?"historyLoading":"older")})]})]})]})}var ge=require("react/jsx-runtime");function Sa(e){let t=e.nativeEvent.composedPath?.()??[e.target];for(let a of t){if(!(a instanceof HTMLElement))continue;let r=a.tagName;if(r==="INPUT"||r==="TEXTAREA"||r==="SELECT"||a.isContentEditable)return!0}return!1}function Bn({usage:e,history:t,rows:a,selected:r,currentTitle:n,currentHarness:o,onSelect:s,retry:i,t:c}){let h=(0,ie.useRef)(null),d=(0,ie.useRef)(null),[g,l]=(0,ie.useState)(),[N,v]=(0,ie.useState)("all"),[S,M]=(0,ie.useState)(""),[w,k]=(0,ie.useState)(!1),[P,D]=(0,ie.useState)("all"),[T,j]=(0,ie.useState)(null),A=(0,ie.useMemo)(()=>t.page?Ye(t.page.items):null,[t.page]),z=(0,ie.useMemo)(()=>at(a,r),[a,r]),L=t.page?.items??[],J=(0,ie.useMemo)(()=>Yt(L),[L]),K=(0,ie.useMemo)(()=>{let C=new Map;for(let B of A?.tools??[])for(let q of B.recordIds)C.set(q,B.name);return C},[A]),y=(0,ie.useCallback)(C=>{requestAnimationFrame(()=>h.current?.querySelector(C)?.scrollIntoView({block:"nearest"}))},[]),H=(0,ie.useCallback)((C,B=!0)=>{l(C),v("all"),M(""),k(!1),B&&y(".ch-browser-card")},[y]),u=(0,ie.useMemo)(()=>Bt(L,N,S,w,K,c),[L,N,S,w,K,c]);return(0,ge.jsxs)("div",{className:"ch-inspector",ref:h,tabIndex:-1,onKeyDown:C=>{if(C.metaKey||C.ctrlKey||C.altKey)return;let B=Sa(C);if(C.key==="Escape"){let q=C.target===d.current;(!B||q)&&(S||w||N!=="all")&&(C.preventDefault(),M(""),k(!1),v("all"));return}if(!B){if(C.key==="/"){C.preventDefault(),d.current?.focus(),y(".ch-browser-card");return}if((C.key==="["||C.key==="]")&&u.length>0){C.preventDefault();let q=u.findIndex(de=>de.id===g),ee=q<0?u.length-1:q,le=C.key==="["?Math.max(0,ee-1):Math.min(u.length-1,ee+1);u[le]&&l(u[le].id)}}},children:[(0,ge.jsx)(wn,{usage:e.usage,summary:A,items:L,related:z,onJumpTimeline:()=>y(".ch-activity-timeline"),onJumpBrowser:C=>{v(C),M(""),k(!1),y(".ch-browser-card")},onJumpTool:C=>{v("tool"),M(`tool:${C}`),k(!1),y(".ch-browser-card")},onJumpErrors:()=>{v("all"),M(""),k(!0),y(".ch-browser-card")},onJumpFiles:(C="all")=>{D(C),y(".ch-file-card")},onJumpCommands:()=>{j(null),y(".ch-command-card")},onJumpProgram:C=>{j(C),y(".ch-command-card")},onJumpNetwork:()=>y(".ch-family-card"),t:c}),(0,ge.jsxs)("div",{className:"ch-pair-grid",children:[(0,ge.jsx)(sn,{usage:e.usage,t:c}),(0,ge.jsx)(on,{usage:e.usage,items:L,onSelectRecord:C=>H(C,!0),t:c})]}),(0,ge.jsxs)("div",{className:"ch-workbench",children:[(0,ge.jsxs)("div",{className:"ch-workbench-left",children:[(0,ge.jsx)(an,{usage:e.usage,samples:e.samples,harness:o,t:c}),(0,ge.jsx)(un,{items:L,pairs:J,available:t.page!==null,loading:t.loading,focus:g,onFocus:C=>H(C,!1),t:c})]}),(0,ge.jsx)(jn,{items:L,pairs:J,available:t.page!==null,toolByRecord:K,focus:g,onFocus:l,onJumpRecord:C=>H(C,!1),filter:N,onFilter:v,query:S,onQuery:M,errorsOnly:w,onErrorsOnly:k,loading:t.loading,error:t.error,hasMore:t.page?.hasMore??!1,older:t.older,latest:t.latest,isOlder:t.isOlder,retry:i,searchInputRef:d,t:c})]}),(0,ge.jsx)(fn,{summary:A,items:L,filter:P,onFilter:D,onFocus:H,t:c}),(0,ge.jsx)(bn,{summary:A,items:L,selectedProgram:T,onSelectProgram:j,onFocus:H,t:c}),(0,ge.jsx)(mn,{related:z,currentTitle:n,currentHarness:o,currentUsage:e.usage,onSelect:s,t:c}),(0,ge.jsxs)("p",{className:"ch-data-note",children:["\u24D8 ",c("limitsNote")]})]})}var oe=require("react");function mt(e){return e?e.split(/[\\/]/).filter(Boolean).at(-1)??null:null}function Wt(e){return!!(e.origin==="subagent"||e.forkParentId||e.treeParentId||e.parentId)}function _e(e){let t=new Date(e),a=t.getFullYear(),r=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${a}-${r}-${n}`}function Wn(e,t,a=8){let r=new Map,n=0,o=0;for(let S of e){if(S.updatedAt===void 0||!Number.isFinite(S.updatedAt))continue;o+=1,S.updatedAt>n&&(n=S.updatedAt);let M=_e(S.updatedAt);r.set(M,(r.get(M)??0)+1)}let s=t??(n>0?n:Date.now()),i=new Date(s);i.setHours(0,0,0,0);let c=(i.getDay()+6)%7,h=new Date(i);h.setDate(i.getDate()+(6-c));let d=new Date(h);d.setDate(h.getDate()-(a*7-1));let g=[],l=0,N=-1;for(let S=0;S<a;S++){let M=[],w;for(let k=0;k<7;k++){let P=new Date(d);P.setDate(d.getDate()+S*7+k);let D=P.getTime()>i.getTime(),T=_e(P.getTime()),j=D?0:r.get(T)??0;j>l&&(l=j);let A=P.getMonth();k===0&&A!==N&&(w=`${A+1}`,N=A),M.push({dateKey:T,count:j,isFuture:D,weekday:k})}g.push({...w?{monthLabel:w}:{},days:M})}return{weeks:g.map(S=>({...S.monthLabel?{monthLabel:S.monthLabel}:{},days:S.days.map(M=>{let w=M.count<=0||l<=0?0:M.count>=l?4:M.count>=l*.66?3:M.count>=l*.33?2:1;return{...M,level:w}})})),maxCount:l,datedCount:o}}function Vn(e,t){let a=new Map,r=new Map,n=0,o=0,s=null,i=0,c=0,h=0,d=0,g=!1,l=0,N=0,v=0,S=0,M=0,w=0,k=0,P=0,D=0,T=0,j=0,A=[];for(let K of e){let y=K.harness??"CodexHost";a.set(y,(a.get(y)??0)+1);let H=mt(K.cwd);H&&r.set(H,(r.get(H)??0)+1),Wt(K)&&(n+=1);let u=t.get(K.id)??null;if(!u)continue;v+=1,u.totalTokens!==void 0&&(i+=u.totalTokens,c+=1),u.totalCostUsd!==void 0&&(h+=u.totalCostUsd,d+=1),(u.unpricedModels?.length??0)>0&&(g=!0);let U=u.sessionCacheHitRatePercent??u.cacheHitRatePercent;U!==void 0&&(l+=U,N+=1);let C=me(u);C&&(C.percent>=75&&(o+=1),(!s||C.percent>s.percent)&&(s={id:K.id,title:K.title||K.id,percent:C.percent,used:C.used,capacity:C.capacity}));let B=nt(u);if(B.length===4){S+=1,M+=1;for(let q of B)q.kind==="uncachedInput"?(P+=q.value,w+=q.value):q.kind==="cacheRead"?(D+=q.value,w+=q.value):q.kind==="cacheWrite"?(T+=q.value,w+=q.value):q.kind==="output"&&(j+=q.value,k+=q.value)}else if(B.length===2){S+=1;for(let q of B)q.kind==="input"?w+=q.value:q.kind==="output"&&(k+=q.value)}(u.totalTokens!==void 0||C!==null)&&A.push({id:K.id,title:K.title||K.id,tokens:u.totalTokens??null,occupancyPercent:C?C.percent:null})}let z=P+D+T+j,L=w+k,J=S>0&&M===S&&z>0?{mode:"decomposed",input:w,uncachedInput:P,cacheRead:D,cacheWrite:T,output:j,sum:z,sessionCount:M}:S>0&&L>0?{mode:"inputOutput",input:w,uncachedInput:0,cacheRead:0,cacheWrite:0,output:k,sum:L,sessionCount:S}:{mode:"none",input:0,uncachedInput:0,cacheRead:0,cacheWrite:0,output:0,sum:0,sessionCount:0};return A.sort((K,y)=>(y.tokens??-1)-(K.tokens??-1)||(y.occupancyPercent??-1)-(K.occupancyPercent??-1)),{harnesses:[...a.entries()].sort((K,y)=>y[1]-K[1]),workspaces:[...r.entries()].sort((K,y)=>y[1]-K[1]),relationCount:n,highContextCount:o,peak:s,totalTokens:i,hasTokens:c>0,tokensCount:c,totalCost:h,hasCost:d>0,costCount:d,hasLowerBound:g,avgCacheHit:N>0?l/N:null,cacheHitCount:N,withTelemetry:v,tokenSummary:J,topSessions:A.slice(0,6)}}var p=require("react/jsx-runtime"),gt=["var(--ch-blue)","var(--ch-teal)","var(--ch-indigo)","var(--ch-green)","var(--ch-purple)","var(--ch-amber)"];function $a(e,t){return e.origin==="subagent"?t("relationSubagent"):e.forkParentId?t("relationFork"):e.treeParentId?t("relationTree"):null}function Ra(e){return e===void 0||!Number.isFinite(e)?"":_e(e)}function Ea({percent:e,used:t,noLabel:a}){let n=2*Math.PI*23,s=(e===null?0:Math.min(100,Math.max(0,e)))/100*n,i=e===null?"is-none":e>=85?"is-danger":e>=65?"is-warn":"is-normal";return(0,p.jsxs)("div",{className:`ch-mini-ring ${i}`,"aria-hidden":"true",children:[(0,p.jsxs)("svg",{viewBox:"0 0 60 60",children:[(0,p.jsx)("circle",{cx:"30",cy:"30",r:23,className:"ch-mini-ring-track",strokeDasharray:e===null?"3 3":void 0}),e!==null&&(0,p.jsx)("circle",{cx:"30",cy:"30",r:23,className:"ch-mini-ring-fill",strokeDasharray:`${s.toFixed(1)} ${n.toFixed(1)}`})]}),(0,p.jsxs)("div",{className:"ch-mini-ring-center",children:[(0,p.jsx)("b",{children:t!==void 0?V(t):e===null?"\u2014":`${Math.round(e)}%`}),(0,p.jsx)("span",{children:e===null?a:`${e.toFixed(1)}%`})]})]})}function Kn({rows:e,usageById:t,loading:a,error:r,selected:n,hasSelected:o,pageIndex:s,hasNext:i,onPrev:c,onNext:h,onSelect:d,onRetry:g,t:l}){let[N,v]=(0,oe.useState)("all"),[S,M]=(0,oe.useState)(null),[w,k]=(0,oe.useState)(null),[P,D]=(0,oe.useState)(!1),[T,j]=(0,oe.useState)(!1),[A,z]=(0,oe.useState)(""),[L,J]=(0,oe.useState)("recent"),[K,y]=(0,oe.useState)([]),H=(0,oe.useMemo)(()=>e.filter(m=>be(m.id)),[e]),u=(0,oe.useMemo)(()=>Vn(H,t),[H,t]),U=(0,oe.useMemo)(()=>Wn(H),[H]),C=N!=="all"&&u.workspaces.some(([m])=>m===N)?N:"all",B=S!==null&&u.harnesses.some(([m])=>m===S)?S:null,q=(0,oe.useMemo)(()=>{let m=new Set;for(let _ of H)_.updatedAt!==void 0&&Number.isFinite(_.updatedAt)&&m.add(_e(_.updatedAt));return m},[H]),ee=w!==null&&q.has(w)?w:null,le=(0,oe.useMemo)(()=>K.filter(m=>H.some(_=>_.id===m)),[K,H]),de=(0,oe.useMemo)(()=>le.map(m=>H.find(_=>_.id===m)).filter(m=>m!==void 0),[le,H]);(0,oe.useEffect)(()=>{v("all"),M(null),k(null),D(!1),j(!1),y([])},[s]);let we=m=>{y(_=>{let F=_.filter(X=>H.some(O=>O.id===X));return F.includes(m)?F.filter(X=>X!==m):F.length>=3?[...F.slice(1),m]:[...F,m]})},R=(0,oe.useMemo)(()=>{let m=A.trim().toLocaleLowerCase();return[...H.filter(F=>{if(C!=="all"&&mt(F.cwd)!==C||B!==null&&(F.harness??"CodexHost")!==B||ee!==null&&(F.updatedAt===void 0||_e(F.updatedAt)!==ee))return!1;if(P){let X=me(t.get(F.id)??null);if(!X||X.percent<75)return!1}return T&&!Wt(F)?!1:m?`${F.title} ${F.harness??""} ${F.cwd??""}`.toLocaleLowerCase().includes(m):!0})].sort((F,X)=>{if(L==="tokens"){let O=t.get(F.id)?.totalTokens??-1;return(t.get(X.id)?.totalTokens??-1)-O}if(L==="occupancy"){let O=me(t.get(F.id)??null)?.percent??-1;return(me(t.get(X.id)??null)?.percent??-1)-O}if(L==="cost"){let O=t.get(F.id)?.totalCostUsd??-1;return(t.get(X.id)?.totalCostUsd??-1)-O}return(X.updatedAt??0)-(F.updatedAt??0)})},[H,C,B,ee,P,T,A,L,t]),W=a||r!==null,ue=Math.max(1,...u.topSessions.map(m=>m.tokens??0)),pe=(0,oe.useMemo)(()=>{let m=u.tokenSummary;return m.mode==="decomposed"?[{key:"cacheRead",label:l("cacheRead"),value:m.cacheRead,color:"var(--ch-teal)"},{key:"uncachedInput",label:l("uncachedInput"),value:m.uncachedInput,color:"var(--ch-blue)"},{key:"output",label:l("output"),value:m.output,color:"var(--ch-purple)"},{key:"cacheWrite",label:l("cacheWrite"),value:m.cacheWrite,color:"var(--ch-amber)"}]:m.mode==="inputOutput"?[{key:"input",label:l("input"),value:m.input,color:"var(--ch-blue)"},{key:"output",label:l("output"),value:m.output,color:"var(--ch-purple)"}]:[]},[u.tokenSummary,l]);return(0,p.jsxs)("div",{className:"ch-overview",children:[!o&&(0,p.jsxs)("div",{className:"ch-overview-intro",children:[(0,p.jsx)("h2",{children:l("noSession")}),(0,p.jsx)("p",{children:l("choose")})]}),(0,p.jsxs)("section",{className:"ch-ov-top",children:[(0,p.jsxs)("div",{className:"ch-ov-kpis",children:[(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsxs)("small",{children:[l("loadedSessions")," (",l("page")," ",s+1,")"]}),(0,p.jsx)("strong",{children:W?"\u2014":H.length}),(0,p.jsx)("div",{className:"ch-ov-sub",children:!W&&u.harnesses.length?u.harnesses.map(([m,_])=>`${m} ${_}`).join(" \xB7 "):"\u2014"})]}),(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsx)("small",{children:l("queriedUsage")}),(0,p.jsx)("strong",{children:u.hasTokens?V(u.totalTokens):"\u2014"}),(0,p.jsx)("div",{className:"ch-ov-sub",children:u.tokensCount>0?`${u.tokensCount}/${Math.min(H.length,50)} ${l("inspectedCount")}`:l("unavailable")})]}),(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsx)("small",{children:l("inspectedCost")}),(0,p.jsx)("strong",{children:u.hasCost?`${u.hasLowerBound?"\u2265 ":""}${Ce(u.totalCost)}`:"\u2014"}),(0,p.jsx)("div",{className:"ch-ov-sub",children:u.hasCost?u.hasLowerBound?`${u.costCount}/${Math.min(H.length,50)} \xB7 ${l("partialPrice")}`:`${u.costCount}/${Math.min(H.length,50)} ${l("inspectedCount")}`:l("unavailable")})]}),(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsx)("small",{children:l("avgCacheHitLabel")}),(0,p.jsx)("strong",{children:u.avgCacheHit===null?"\u2014":`${u.avgCacheHit.toFixed(1)}%`}),(0,p.jsx)("div",{className:"ch-ov-sub",children:u.cacheHitCount>0?`${u.cacheHitCount} ${l("inspectedCount")}`:l("unavailable")})]}),(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsx)("small",{children:l("highestOccupancy")}),(0,p.jsx)("strong",{className:u.peak?u.peak.percent>=85?"is-danger":u.peak.percent>=65?"is-warn":"":"",children:u.peak?`${u.peak.percent.toFixed(1)}%`:"\u2014"}),(0,p.jsx)("div",{className:"ch-ov-sub",title:u.peak?.title,children:u.peak?u.peak.used!==void 0&&u.peak.capacity!==void 0?`${V(u.peak.used)} / ${V(u.peak.capacity)}`:u.peak.title:l("unavailable")})]}),(0,p.jsxs)("div",{className:"ch-ov-kpi",children:[(0,p.jsx)("small",{children:l("activeWorkspaces")}),(0,p.jsx)("strong",{children:W?"\u2014":u.workspaces.length}),(0,p.jsx)("div",{className:"ch-ov-sub",children:!W&&u.workspaces.length?u.workspaces.map(([m])=>m).slice(0,3).join(" \xB7 "):"\u2014"})]})]}),(0,p.jsx)(se,{title:l("inspectedSessionsChart"),className:"ch-ov-bars-card",aside:(0,p.jsxs)("span",{className:"ch-card-rate",children:[l("sortTokens")," \xB7 ",l("sortOccupancy")]}),children:u.topSessions.length===0?(0,p.jsx)("p",{className:"ch-note ch-ov-empty-center",children:l("unavailable")}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("div",{className:"ch-ov-bars-plot",children:u.topSessions.map(m=>{let _=m.tokens!==null&&m.tokens>0?Math.max(8,m.tokens/ue*100):0,F=m.occupancyPercent!==null?Math.max(8,Math.min(100,m.occupancyPercent)):0,X=m.occupancyPercent!==null&&m.occupancyPercent>=85?"is-danger":m.occupancyPercent!==null&&m.occupancyPercent>=65?"is-warn":"is-ok",O=m.tokens===null?"\u2014":V(m.tokens);return(0,p.jsxs)("button",{type:"button",className:"ch-ov-bcol",title:`${m.title}: ${O} \xB7 ${m.occupancyPercent===null?"\u2014":`${m.occupancyPercent.toFixed(1)}%`}`,onClick:()=>d(m.id),children:[(0,p.jsxs)("div",{className:"ch-ov-bpair",children:[_>0&&m.tokens!==null&&(0,p.jsx)("div",{className:"ch-ov-bar is-tok",style:{height:`${_}%`},children:(0,p.jsx)("span",{children:V(m.tokens)})}),F>0&&(0,p.jsx)("div",{className:`ch-ov-bar ${X}`,style:{height:`${F}%`}})]}),(0,p.jsx)("span",{className:"ch-ov-blbl",children:m.title})]},m.id)})}),(0,p.jsxs)("div",{className:"ch-ov-bars-key",children:[(0,p.jsxs)("span",{children:[(0,p.jsx)("i",{style:{background:"var(--ch-blue)"}}),l("sortTokens")]}),(0,p.jsxs)("span",{children:[(0,p.jsx)("i",{style:{background:"var(--ch-green)"}}),l("sortOccupancy")]})]})]})})]}),(0,p.jsxs)("section",{className:"ch-ov-mid",children:[(0,p.jsx)(se,{title:l("tokenDistribution"),className:"ch-ov-dist-card",aside:(0,p.jsxs)("span",{className:"ch-card-rate",children:[l("avgCacheHitLabel")," ",(0,p.jsx)("b",{children:u.avgCacheHit===null?"\u2014":`${u.avgCacheHit.toFixed(1)}%`})]}),children:u.tokenSummary.mode==="none"?(0,p.jsx)("p",{className:"ch-note ch-ov-empty-center",children:l("unavailable")}):(0,p.jsxs)("div",{className:"ch-token-layout",children:[(0,p.jsx)(et,{size:84,segments:pe,centerTop:V(u.tokenSummary.sum),centerSub:l("inputOutput")}),(0,p.jsx)("div",{className:"ch-sl-grid",children:pe.map(m=>(0,p.jsxs)("div",{className:"ch-sl-item is-static",children:[(0,p.jsxs)("span",{className:"ch-sl-top",children:[(0,p.jsx)("span",{className:"ch-swatch",style:{background:m.color}}),(0,p.jsx)("span",{className:"ch-sl-label",children:m.label}),(0,p.jsx)("b",{className:"ch-sl-pct",children:u.tokenSummary.sum>0?`${(m.value/u.tokenSummary.sum*100).toFixed(1)}%`:"\u2014"})]}),(0,p.jsx)("span",{className:"ch-sl-sub",children:V(m.value)})]},m.key))})]})}),(0,p.jsx)(se,{title:l("activityHeatmap"),className:"ch-ov-heat-card",aside:(0,p.jsx)("span",{className:"ch-card-rate",children:l("heatmapScope")}),children:U.datedCount===0?(0,p.jsx)("p",{className:"ch-note ch-ov-empty-center",children:l("unavailable")}):(0,p.jsxs)("div",{className:"ch-heat-wrap",children:[(0,p.jsx)("div",{className:"ch-heat-cols",children:U.weeks.map((m,_)=>(0,p.jsxs)("div",{className:"ch-heat-col",children:[(0,p.jsx)("span",{className:"ch-heat-mon",children:m.monthLabel??""}),m.days.map(F=>F.isFuture?(0,p.jsx)("span",{className:"ch-heat-cell is-future"},F.dateKey):(0,p.jsx)("button",{type:"button",className:`ch-heat-cell is-lv${F.level} ${ee===F.dateKey?"is-on":""}`,disabled:F.count===0,title:`${F.dateKey}: ${F.count}`,"aria-label":`${F.dateKey}: ${F.count}`,onClick:()=>k(X=>X===F.dateKey?null:F.dateKey)},F.dateKey))]},_))}),(0,p.jsxs)("div",{className:"ch-heat-legend",children:[(0,p.jsx)("span",{children:l("lessLabel")}),[0,1,2,3,4].map(m=>(0,p.jsx)("i",{className:`ch-heat-cell is-lv${m}`},m)),(0,p.jsx)("span",{children:l("moreLabel")})]})]})}),(0,p.jsx)(se,{title:l("workspaceBreakdown"),className:"ch-ov-tally-card",aside:(0,p.jsx)("span",{className:"ch-card-rate",children:W?"\u2014":u.workspaces.length}),children:u.workspaces.length===0?(0,p.jsx)("p",{className:"ch-note ch-ov-empty-center",children:"\u2014"}):(0,p.jsx)("div",{className:"ch-prog-list",children:u.workspaces.slice(0,6).map(([m,_],F)=>{let X=Math.round(_/Math.max(1,H.length)*100),O=gt[F%gt.length];return(0,p.jsxs)("button",{type:"button",className:`ch-prog-row ${C===m?"is-active":""}`,onClick:()=>v(re=>re===m?"all":m),children:[(0,p.jsx)("i",{className:"ch-prog-dot",style:{background:O}}),(0,p.jsx)("span",{className:"ch-prog-name",children:m}),(0,p.jsxs)("span",{className:"ch-prog-cnt",children:["\xD7",_]}),(0,p.jsxs)("span",{className:"ch-prog-pct",children:[X,"%"]}),(0,p.jsx)("i",{className:"ch-prog-bar",style:{width:`${X}%`,background:O}})]},m)})})}),(0,p.jsx)(se,{title:l("harnessBreakdown"),className:"ch-ov-tally-card",aside:(0,p.jsx)("span",{className:"ch-card-rate",children:W?"\u2014":H.length}),children:u.harnesses.length===0?(0,p.jsx)("p",{className:"ch-note ch-ov-empty-center",children:"\u2014"}):(0,p.jsxs)("div",{className:"ch-prog-list",children:[u.harnesses.map(([m,_],F)=>{let X=Math.round(_/Math.max(1,H.length)*100),O=gt[(F+2)%gt.length];return(0,p.jsxs)("button",{type:"button",className:`ch-prog-row ${B===m?"is-active":""}`,onClick:()=>M(re=>re===m?null:m),children:[(0,p.jsx)("i",{className:"ch-prog-dot",style:{background:O}}),(0,p.jsx)("span",{className:"ch-prog-name",children:m}),(0,p.jsxs)("span",{className:"ch-prog-cnt",children:["\xD7",_]}),(0,p.jsxs)("span",{className:"ch-prog-pct",children:[X,"%"]}),(0,p.jsx)("i",{className:"ch-prog-bar",style:{width:`${X}%`,background:O}})]},m)}),u.relationCount>0&&(0,p.jsxs)("button",{type:"button",className:`ch-prog-row ${T?"is-active":""}`,onClick:()=>j(m=>!m),children:[(0,p.jsx)("i",{className:"ch-prog-dot",style:{background:"var(--ch-purple)"}}),(0,p.jsx)("span",{className:"ch-prog-name",children:l("subagentOrFork")}),(0,p.jsxs)("span",{className:"ch-prog-cnt",children:["\xD7",u.relationCount]}),(0,p.jsxs)("span",{className:"ch-prog-pct",children:[Math.round(u.relationCount/Math.max(1,H.length)*100),"%"]}),(0,p.jsx)("i",{className:"ch-prog-bar",style:{width:`${Math.round(u.relationCount/Math.max(1,H.length)*100)}%`,background:"var(--ch-purple)"}})]})]})})]}),de.length>0&&(0,p.jsx)(se,{title:`${l("compareTrayTitle")} (${de.length}/3)`,className:"ch-compare-tray",aside:(0,p.jsx)("button",{type:"button",className:"ch-mini-button",onClick:()=>y([]),children:l("clearCompare")}),children:(0,p.jsx)("div",{className:"ch-compare-scroll",children:(0,p.jsxs)("table",{className:"ch-compare-table",children:[(0,p.jsx)("thead",{children:(0,p.jsxs)("tr",{children:[(0,p.jsx)("th",{children:l("metricLabel")}),de.map(m=>(0,p.jsx)("th",{children:(0,p.jsxs)("div",{className:"ch-compare-th",children:[(0,p.jsx)("button",{type:"button",className:"ch-link-btn",onClick:()=>d(m.id),children:m.title||m.id}),(0,p.jsx)("button",{type:"button",className:"ch-mini-button","aria-label":`${l("clearCompare")}: ${m.title||m.id}`,onClick:()=>we(m.id),children:"\xD7"})]})},m.id))]})}),(0,p.jsxs)("tbody",{children:[(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("occupancy")}),de.map(m=>{let _=me(t.get(m.id)??null);return(0,p.jsxs)("td",{children:[(0,p.jsx)("b",{children:_?`${_.percent.toFixed(1)}%`:"\u2014"}),_?.used!==void 0&&_.capacity!==void 0?` (${V(_.used)}/${V(_.capacity)})`:""]},m.id)})]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("total")}),de.map(m=>(0,p.jsx)("td",{children:V(t.get(m.id)?.totalTokens)},m.id))]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("cacheHit")}),de.map(m=>{let _=t.get(m.id),F=_?.cacheHitRatePercent??_?.sessionCacheHitRatePercent;return(0,p.jsx)("td",{children:F===void 0?"\u2014":`${F.toFixed(1)}%`},m.id)})]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("cost")}),de.map(m=>{let _=t.get(m.id);return(0,p.jsx)("td",{children:_?.totalCostUsd===void 0?"\u2014":`${(_.unpricedModels?.length??0)>0?"\u2265 ":""}${Ce(_.totalCostUsd)}`},m.id)})]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("tps")}),de.map(m=>{let _=t.get(m.id),F=_?.outputTokensPerSecond??_?.sessionOutputTokensPerSecond;return(0,p.jsx)("td",{children:F===void 0?"\u2014":`${F.toFixed(1)} tok/s`},m.id)})]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{children:l("ttft")}),de.map(m=>{let _=t.get(m.id),F=_?.latestRequestTimeToFirstOutputMs??_?.timeToFirstOutputMs;return(0,p.jsx)("td",{children:F===void 0?"\u2014":F===0?"0ms":Ue(F)},m.id)})]})]})]})})}),(0,p.jsxs)("section",{className:"ch-card ch-ov-gallery",children:[(0,p.jsxs)("div",{className:"ch-ov-toolbar",children:[(0,p.jsxs)("div",{className:"ch-ov-gallery-title",children:[(0,p.jsx)("h2",{children:l("sessions")}),(0,p.jsx)("span",{className:"ch-count",children:R.length}),ee&&(0,p.jsxs)("button",{type:"button",className:"ch-ov-day-chip",onClick:()=>k(null),children:[l("updatedOnDate")," ",ee," \xD7"]}),B&&(0,p.jsxs)("button",{type:"button",className:"ch-ov-day-chip",onClick:()=>M(null),children:[B," \xD7"]})]}),(0,p.jsxs)("div",{className:"ch-ov-controls",children:[(0,p.jsx)("input",{className:"ch-mini-input",value:A,onChange:m=>z(m.target.value),placeholder:l("search"),"aria-label":l("search")}),(0,p.jsx)("div",{className:"ch-seg",role:"group",children:["recent","tokens","occupancy","cost"].map(m=>(0,p.jsx)("button",{type:"button",className:L===m?"is-active":"","aria-pressed":L===m,onClick:()=>J(m),children:l(m==="recent"?"sortRecent":m==="tokens"?"sortTokens":m==="occupancy"?"sortOccupancy":"sortCost")},m))})]})]}),(0,p.jsxs)("div",{className:"ch-ov-filter-strip",children:[(0,p.jsxs)("div",{className:"ch-chip-group",role:"group","aria-label":l("activeWorkspaces"),children:[(0,p.jsxs)("button",{type:"button",className:`ch-ov-chip ${C==="all"?"is-active":""}`,"aria-pressed":C==="all",onClick:()=>v("all"),children:[l("allWorkspaces")," ",(0,p.jsx)("span",{children:H.length})]}),u.workspaces.map(([m,_])=>(0,p.jsxs)("button",{type:"button",className:`ch-ov-chip ${C===m?"is-active":""}`,"aria-pressed":C===m,onClick:()=>v(m),children:[m," ",(0,p.jsx)("span",{children:_})]},m))]}),(0,p.jsxs)("div",{className:"ch-chip-group",children:[(0,p.jsxs)("button",{type:"button",className:`ch-ov-chip ${P?"is-active":""}`,"aria-pressed":P,onClick:()=>D(m=>!m),children:[l("filterHighContext")," ",(0,p.jsx)("span",{children:u.highContextCount})]}),(0,p.jsxs)("button",{type:"button",className:`ch-ov-chip ${T?"is-active":""}`,"aria-pressed":T,onClick:()=>j(m=>!m),children:[l("filterRelations")," ",(0,p.jsx)("span",{children:u.relationCount})]})]})]}),r?(0,p.jsxs)("div",{className:"ch-error",role:"alert",children:[l("listError"),(0,p.jsx)("span",{children:r}),(0,p.jsx)("button",{type:"button",className:"ch-mini-button",onClick:g,children:l("retry")})]}):a&&H.length===0?(0,p.jsxs)("div",{className:"ch-ov-grid",children:[(0,p.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"}),(0,p.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"}),(0,p.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"})]}):R.length===0?(0,p.jsx)("p",{className:"ch-note",children:l("emptyList")}):(0,p.jsx)("div",{className:"ch-ov-grid",children:R.map(m=>{let _=t.get(m.id)??null,F=me(_),X=mt(m.cwd),O=$a(m,l),re=_?.cacheHitRatePercent??_?.sessionCacheHitRatePercent,Fe=le.includes(m.id);return(0,p.jsxs)("article",{className:`ch-overview-card ${n===m.id?"is-selected":""} ${Fe?"is-compared":""}`,children:[(0,p.jsxs)("div",{className:"ch-ov-card-head",children:[(0,p.jsx)("button",{type:"button",className:"ch-ov-card-title-btn",title:m.title||m.id,onClick:()=>d(m.id),children:(0,p.jsx)("strong",{children:m.title||m.id})}),(0,p.jsxs)("div",{className:"ch-ov-card-right",children:[m.updatedAt!==void 0&&(0,p.jsx)("span",{className:"ch-ov-card-date",children:Ra(m.updatedAt)}),(0,p.jsx)("button",{type:"button",className:`ch-compare-pin ${Fe?"is-active":""}`,"aria-pressed":Fe,title:l("compareHint"),onClick:()=>we(m.id),children:l(Fe?"compareSelected":"compareToggle")})]})]}),(0,p.jsxs)("div",{className:"ch-ov-card-tags",children:[X&&(0,p.jsx)("span",{className:"ch-meta-tag is-ws",children:X}),(0,p.jsx)("span",{className:"ch-meta-tag",children:m.harness??"CodexHost"}),n===m.id&&(0,p.jsx)("span",{className:"ch-meta-tag is-current",children:l("currentSession")}),O&&(0,p.jsxs)("span",{className:"ch-dot-pill",children:[(0,p.jsx)("i",{className:"is-event"}),O]})]}),(0,p.jsxs)("button",{type:"button",className:"ch-ov-card-body",onClick:()=>d(m.id),children:[(0,p.jsx)(Ea,{percent:F?F.percent:null,used:F?.used,noLabel:l("noTelemetryYet")}),(0,p.jsxs)("div",{className:"ch-ov-kv",children:[(0,p.jsxs)("div",{className:"ch-ov-kv-row",children:[(0,p.jsx)("span",{children:l("context")}),(0,p.jsx)("b",{children:F?.used!==void 0&&F.capacity!==void 0?`${V(F.used)} / ${V(F.capacity)}`:F?`${F.percent.toFixed(1)}%`:"\u2014"})]}),(0,p.jsxs)("div",{className:"ch-ov-kv-row",children:[(0,p.jsx)("span",{children:l("total")}),(0,p.jsx)("b",{children:V(_?.totalTokens)})]}),(0,p.jsxs)("div",{className:"ch-ov-kv-row",children:[(0,p.jsx)("span",{children:l("cost")}),(0,p.jsx)("b",{children:_?.totalCostUsd===void 0?"\u2014":`${(_.unpricedModels?.length??0)>0?"\u2265 ":""}${Ce(_.totalCostUsd)}`})]}),(0,p.jsxs)("div",{className:"ch-ov-kv-row",children:[(0,p.jsx)("span",{children:_?.cacheHitRatePercent!==void 0?l("cacheHit"):l("avgCache")}),(0,p.jsx)("b",{children:re===void 0?"\u2014":`${re.toFixed(1)}%`})]})]})]})]},m.id)})}),(0,p.jsxs)("div",{className:"ch-pagination",children:[(0,p.jsx)("small",{children:l("overviewScopeNote")}),(0,p.jsxs)("div",{children:[(0,p.jsx)("button",{type:"button",className:"ch-mini-button",disabled:s===0||a,onClick:c,children:l("previous")}),(0,p.jsxs)("span",{children:[l("page")," ",s+1]}),(0,p.jsx)("button",{type:"button",className:"ch-mini-button",disabled:!i||a,onClick:h,children:l("next")})]})]})]})]})}var ne=require("react");var Ia=0;function ae(e,t){if(e===null||typeof e!="object"||Array.isArray(e))throw new Error(`Invalid ${t}: expected an object`);return e}function je(e,t){if(typeof e!="string")throw new Error(`Invalid ${t}: expected a string`);return e}function He(e,t){let a=je(e,t);if(!a.trim())throw new Error(`Invalid ${t}: expected a nonempty identity`);return a}function Qe(e,t){if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw new Error(`Invalid ${t}: expected a nonnegative safe integer`);return e}function De(e,t){return e==null?void 0:je(e,t)}function Zn(e,t){if(e!=null){if(typeof e!="number"||!Number.isFinite(e))throw new Error(`Invalid ${t}: expected a finite number`);return e}}function Vt(e){if(!e||typeof e!="object"||Array.isArray(e))return;let t=e,a=typeof t.code=="string"||typeof t.code=="number"?` (${String(t.code).slice(0,120)})`:"";return typeof t.message=="string"?`${t.message.slice(0,500)}${a}`:void 0}function Ma(e){let t=ae(e,"session row"),a=ae(t.projections,"session projections"),r=ae(a.values,"session projection values"),n=r.harnessIdentity==null?void 0:De(ae(r.harnessIdentity,"harness identity").id,"harness id"),o=De(t.cwd,"session cwd"),s=Zn(t.updatedAt,"session updatedAt"),i=De(t.parentSessionId,"parent session id"),c=De(r.threadTreeParent,"thread tree parent"),h=De(r.archiveForkParent,"fork parent");return{id:He(t.sessionId,"session id"),title:De(r.title,"session title")??"",...n===void 0?{}:{harness:n},...o===void 0?{}:{cwd:o},...s===void 0?{}:{updatedAt:s},...i===void 0?{}:{parentId:i},...c===void 0?{}:{treeParentId:c},...h===void 0?{}:{forkParentId:h},...t.origin==="subagent"?{origin:"subagent"}:{}}}function Pa(e,t){let a=ae(e,"history record");if(a.type!=="event")throw new Error("Invalid history record: expected an event");let r=ae(a.event,"history event");if(r.sessionId!==void 0&&r.sessionId!==t)throw new Error("Invalid history event: session identity mismatch");let n=Qe(r.seq,"history sequence"),o=He(r.type,"history event type"),s=ae(r.data,"history event data"),i=Zn(r.time,"history time"),c="event",h=o,d="",g=!1,l=!1,N=!1,v=!1,S,M,w,k,P=T=>typeof T=="string"&&T.length>0&&T.length<=512?T:void 0;if(o==="tool/result"&&s.meta!=null){let T=ae(s.meta,"tool result metadata");if(T.codexhostOutput!==void 0){if(!Array.isArray(T.codexhostOutput))throw new Error("Invalid tool output previews");for(let j of T.codexhostOutput){let A=ae(j,"tool output preview"),z=ae(A.reference,"tool output reference");if(z.sessionId!==t||z.seq!==n)throw new Error("Invalid tool output reference: identity mismatch");g=!0,l=!0,v=!0}}}let D=T=>{let j=d.length>0?`
`:"",A=8e3-d.length,z=j+T;z.length>A&&(g=!0,N=!0),d+=z.slice(0,A)};if(o==="user/message"||o==="assistant/message"||o==="tool/result"){c=o==="user/message"?"user":o==="assistant/message"?"assistant":"tool";let T=o==="user/message"?s:ae(s.message,"history message");if(o==="tool/result"){let j=T.source&&typeof T.source=="object"&&!Array.isArray(T.source)?T.source:void 0;S=P(j?.callId),M=P(j?.name),typeof T.isError=="boolean"&&(k=T.isError)}if(h=o==="tool/result"?"tool/result":c,!Array.isArray(T.content))throw new Error("Invalid history message: expected content blocks");for(let j of T.content){let A=ae(j,"history content block"),z=He(A.type,"history content type");z==="text"||z==="reasoning"?D(je(A.text,"history content text")):z==="tool-call"?D(`${He(A.name,"tool name")}
${je(A.arguments,"tool arguments")}`):v=!0}}else if(o==="tool/call"){c="tool",h=He(s.name,"tool name"),M=h,S=P(s.callId);let T=je(s.arguments,"tool arguments");w=T.slice(0,8e3),D(T)}else D(JSON.stringify(s));return{id:JSON.stringify([t,n]),kind:c,title:h,text:d,seq:n,eventType:o,...S===void 0?{}:{callId:S},...M===void 0?{}:{toolName:M},...w===void 0?{}:{arguments:w},...k===void 0?{}:{isError:k},...i===void 0?{}:{time:i},...g?{clipped:!0}:{},...l?{hostPreview:!0}:{},...N?{textTruncated:!0}:{},...v?{contentUnavailable:!0}:{}}}var ft=class{fetcher;constructor(t=globalThis.fetch.bind(globalThis)){this.fetcher=t}async post(t,a,r){r.throwIfAborted();let n;try{n=await this.fetcher(t,{method:"POST",credentials:"same-origin",mode:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json"},body:JSON.stringify(a),signal:r})}catch(i){throw r.throwIfAborted(),i instanceof Error&&i.name==="AbortError"?i:new Error(`${t}: request failed: ${i instanceof Error?i.message:"network unavailable"}`)}r.throwIfAborted();let o;try{o=await n.json()}catch(i){throw r.throwIfAborted(),i instanceof Error&&i.name==="AbortError"?i:new Error(`${t}: ${n.ok?"":`HTTP ${n.status}; `}invalid JSON response`)}if(r.throwIfAborted(),!n.ok){let i=o!==null&&typeof o=="object"&&!Array.isArray(o)?Vt(o.error):void 0;throw new Error(`${t}: HTTP ${n.status}: ${i??"request rejected"}`)}let s=ae(o,`${t} response envelope`);if(Object.hasOwn(s,"error"))throw new Error(`${t}: ${Vt(s.error)??"request rejected"}`);return s}async sessionRpc(t,a,r){let n=`ch-context-${++Ia}`,o=await this.post(`api/${t}`,{type:"client-request",rpcId:n,method:t,payload:{args:a}},r);return this.sessionResult(o,n,t)}async listSessions(t,a){t!==null&&je(t,"session cursor");let r=ae(await this.sessionRpc("session/list",t===null?{}:{cursor:t},a),"session page");if(!Array.isArray(r.items))throw new Error("Invalid session page: expected items");if(r.nextCursor!==null&&typeof r.nextCursor!="string")throw new Error("Invalid session page: expected a string or null nextCursor");if(t!==null&&r.nextCursor===t)throw new Error("Invalid session page: cursor did not advance");let n=r.items.map(Ma);if(new Set(n.map(o=>o.id)).size!==n.length)throw new Error("Invalid session page: repeated session identity");return{items:n,nextCursor:r.nextCursor}}sessionResult(t,a,r){if(t.type!=="server-response"||t.rpcId!==a)throw new Error(`${r}: response identity mismatch`);let n=ae(t.result,`${r} result`);if(n.ok===!1)throw new Error(`${r}: ${Vt(n.error)??"request rejected"}`);if(n.ok!==!0||!Object.hasOwn(n,"value")||Object.hasOwn(n,"error"))throw new Error(`${r}: invalid result envelope`);return n.value}async inspectUsage(t,a){He(t,"thread id");let r=await this.post("api/ch/v1/rpc",{method:"codexhost/thread/usage/inspect",params:{threadId:t}},a),n=ae(r.result,"usage result");if(n.threadId!==t)throw new Error("Invalid usage result: thread identity mismatch");if(!Object.hasOwn(n,"usage")||n.usage!==null&&(typeof n.usage!="object"||Array.isArray(n.usage)))throw new Error("Invalid usage result: expected a usage snapshot or null");return n}async history(t,a,r,n){if(He(t,"session id"),r!==void 0&&(Qe(r,"beforeSeq"),n===void 0))throw new Error("throughSeq is required when beforeSeq is provided");if(n===void 0){let g=ae(await this.sessionRpc("session/projections",{sessionId:t},a),"projection baseline");ae(g.values,"projection baseline values"),n=Qe(g.asOfSeq,"projection baseline asOfSeq")}else Qe(n,"throughSeq");if(r!==void 0&&r>n+1)throw new Error("Invalid history boundary: beforeSeq exceeds throughSeq");let o=ae(await this.sessionRpc("session/page",{address:{sessionId:t},throughSeq:n,maxMessages:50,...r===void 0?{}:{beforeSeq:r}},a),"history page");if(!Array.isArray(o.records)||typeof o.hasMore!="boolean")throw new Error("Invalid history page: expected records and hasMore");let s=-1;for(let g of o.records){let l=ae(g,"history record");if(l.type!=="event")throw new Error("Invalid history record: expected an event");let N=ae(l.event,"history event"),v=Qe(N.seq,"history sequence");if(v<=s||v>n||r!==void 0&&v>=r)throw new Error("Invalid history page: unordered, repeated or out-of-window sequence");s=v}if(o.hasMore&&(o.records.length===0||s===0))throw new Error("Invalid history page: pagination did not advance");let i=o.records.length>200,c=o.records.slice(-200).map(g=>Pa(g,t)),h=o.hasMore||i,d=c[0];if(h&&(!d||d.seq===0))throw new Error("Invalid history page: no earlier sequence is available");return{items:c,...d===void 0?{}:{beforeSeq:d.seq},hasMore:h,throughSeq:n,...i||c.some(g=>g.clipped)?{clipped:!0}:{},...c.some(g=>g.contentUnavailable)?{contentUnavailable:!0}:{}}}};function za(e,t){let a=ke(e);return a?.type!=="changed"||typeof a.threadId=="string"&&a.threadId!==t?!1:typeof a.method=="string"&&["codexhost/thread/usage/updated","thread/tokenUsage/updated","thread/updated"].includes(a.method)}function Jn(e,t,a,r=fetch){let n=new AbortController,o,s=0,i=async()=>{try{let c=await r("api/ch/v1/events",{credentials:"same-origin",signal:n.signal});if(!c.ok||c.body===null)throw new Error("Events unavailable");if(n.signal.aborted)return;a(!0),s=0;let h=c.body.getReader(),d=new TextDecoder,g="";try{for(;!n.signal.aborted;){let l=await h.read();if(l.done)break;if(g+=d.decode(l.value,{stream:!0}),g.length>1024*1024)throw new Error("Event frame too large");let N;for(;(N=g.indexOf(`
`))!==-1;){let v=g.slice(0,N).trim();if(g=g.slice(N+1),!!v)try{za(JSON.parse(v),e)&&t()}catch{continue}}}}finally{await h.cancel().catch(()=>{}),h.releaseLock()}}catch{if(n.signal.aborted)return}n.signal.aborted||(a(!1),o=setTimeout(()=>{i()},Math.min(15e3,1e3*2**s++)))};return i(),()=>{n.abort(),o!==void 0&&clearTimeout(o)}}var bt=new ft,Gn=()=>()=>{};function Qn(e){let t=(0,ne.useCallback)(r=>e.locale.subscribe?.(r)??Gn(),[e]),a=(0,ne.useCallback)(()=>e.locale.getLocale?.().active??"en",[e]);return(0,ne.useSyncExternalStore)(t,a,a)}function Xn(e){let t=ke(e.get("uiSession")),r=ke(t?.adapter)?.current,n=(0,ne.useCallback)(s=>r?.subscribe(s)??Gn(),[r]),o=(0,ne.useCallback)(()=>{let s=ke(r?.getSnapshot())?.key;return typeof s=="string"?s:void 0},[r]);return(0,ne.useSyncExternalStore)(n,o,o)}function Yn(e,t){let[a,r]=(0,ne.useState)({key:"",page:null,loading:!0,error:null}),n=`${e??""}:${t}`;return(0,ne.useEffect)(()=>{let o=new AbortController;return r({key:n,page:null,loading:!0,error:null}),bt.listSessions(e,o.signal).then(s=>{o.signal.aborted||r({key:n,page:s,loading:!1,error:null})}).catch(s=>{o.signal.aborted||r({key:n,page:null,loading:!1,error:String(s instanceof Error?s.message:s)})}),()=>o.abort()},[e,n]),a.key===n?a:{page:null,loading:!0,error:null}}function er(e,t,a){let r=(0,ne.useRef)({id:e,projection:t,generation:0});(r.current.id!==e||r.current.projection!==t)&&(r.current={id:e,projection:t,generation:r.current.generation+1});let[n,o]=(0,ne.useState)({id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0});return(0,ne.useEffect)(()=>{if(t===void 0||!e)return;let s=tt(t),i=Date.now();o(c=>({id:e,usage:s,loading:!1,error:null,connected:!0,samples:Nt(c.id===e?c.samples:[],s,i),updatedAt:i,snapshotSequence:(c.id===e?c.snapshotSequence:0)+1}))},[e,t]),(0,ne.useEffect)(()=>{let s=new AbortController,i,c=!1,h=!1,d=async()=>{if(!e||s.signal.aborted)return;if(c){h=!0;return}c=!0;let l=r.current.generation,N=()=>!s.signal.aborted&&r.current.generation===l;try{let v=await bt.inspectUsage(e,s.signal);if(!N())return;let S=tt(v),M=Date.now();o(w=>N()?{id:e,usage:S,loading:!1,error:null,connected:!0,samples:Nt(w.id===e?w.samples:[],S,M),updatedAt:M,snapshotSequence:(w.id===e?w.snapshotSequence:0)+1}:w)}catch(v){N()&&o(S=>N()?{...S.id===e?S:{id:e,usage:null,connected:!1,samples:[],updatedAt:null,snapshotSequence:0},loading:!1,error:String(v instanceof Error?v.message:v)}:S)}finally{c=!1,h&&!s.signal.aborted&&(h=!1,d())}};(t===void 0||a>0)&&(o(l=>l.id===e?{...l,loading:!!e,error:null}:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}),d());let g=e&&t===void 0?Jn(e,()=>{i!==void 0&&clearTimeout(i),i=setTimeout(()=>{d()},150)},l=>{s.signal.aborted||o(N=>N.id===e?{...N,connected:l}:N),l&&d()}):void 0;return()=>{s.abort(),g?.(),i!==void 0&&clearTimeout(i)}},[e,t===void 0,a]),n.id===e?n:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}}function tr(e,t,a=null){let r=(0,ne.useRef)({id:e,generation:0});r.current.id!==e&&(r.current={id:e,generation:r.current.generation+1});let[n,o]=(0,ne.useState)(null),s=n&&n.id===e&&n.generation===r.current.generation?n.before:void 0,i=s!==void 0?n?.through:void 0,c=s===void 0?a:null,[h,d]=(0,ne.useState)({page:null,loading:!1,error:null});(0,ne.useEffect)(()=>o(null),[e]),(0,ne.useEffect)(()=>{if(!e)return;let l=new AbortController;d(S=>({id:e,page:S.id===e?S.page:null,loading:!0,error:null}));let N=()=>{bt.history(e,l.signal,s,i).then(S=>{l.signal.aborted||d({id:e,page:S,loading:!1,error:null})}).catch(S=>{l.signal.aborted||d(M=>({id:e,page:M.id===e?M.page:null,loading:!1,error:String(S instanceof Error?S.message:S)}))})},v=c!==null&&h.id===e&&h.page!==null?setTimeout(N,350):void 0;return v===void 0&&N(),()=>{l.abort(),v!==void 0&&clearTimeout(v)}},[e,s,i,t,c]);let g=h.id===e?h:{page:null,loading:!!e,error:null};return{...g,latest:()=>o(null),isOlder:s!==void 0,older:()=>{e&&g.page?.beforeSeq!==void 0&&o({id:e,generation:r.current.generation,before:g.page.beforeSeq,through:g.page.throughSeq})}}}var Aa=new Map;function nr(e,t,a){let[r,n]=(0,ne.useState)(()=>({key:"",entries:new Map})),o=e.map(i=>i.id).filter(be).slice(0,50),s=t&&o.length>0?`${a}:${o.join(",")}`:"";return(0,ne.useEffect)(()=>{if(!s){n({key:"",entries:new Map});return}let i=new AbortController;n({key:s,entries:new Map});let c=[...o],h=Array.from({length:Math.min(3,c.length)},async()=>{for(;!i.signal.aborted&&c.length>0;){let d=c.shift();if(!d)break;let g=null;try{let l=await bt.inspectUsage(d,i.signal);if(i.signal.aborted)return;g=tt(l)}catch{if(i.signal.aborted)return;g=null}n(l=>{if(i.signal.aborted||l.key!==s)return l;let N=new Map(l.entries);return N.set(d,g),{key:s,entries:N}})}});return Promise.all(h),()=>i.abort()},[s]),s&&r.key===s?r.entries:Aa}var Kt={title:"Context insights",subtitle:"A clearer view of your conversation.",tab:"Context",sessions:"Conversations",search:"Search this page",next:"Next page",previous:"Previous page",refresh:"Refresh",loading:"Loading\u2026",noSession:"Choose a conversation",choose:"Select a conversation to inspect the context and usage reported by its Harness.",unavailable:"Not reported",noUsage:"This Harness has not reported usage for this conversation yet.",context:"Current context",used:"Used tokens",capacity:"Window capacity",remaining:"Remaining capacity",occupancy:"Context occupancy",cumulative:"Token stats",input:"Input tokens",output:"Output tokens",cacheRead:"Cache read",cacheWrite:"Cache write",total:"Total tokens",cost:"Session cost",costEstimate:"Public-price estimate",costNative:"Native cost",partialPrice:"Some models are unpriced; this is a lower bound.",performance:"Performance & cache",tps:"Output speed",avgTps:"Average output speed",ttft:"Time to first output",cacheHit:"Latest cache hit",avgCache:"Average cache hit",credits:"AI credits",timeline:"Context observations",timelineNote:"Changes observed while this panel is open. This is not the complete request history.",needSamples:"The next context change will appear here.",observed:"Samples",history:"Messages & tools",all:"All",messages:"Messages",tools:"Tools",events:"Events",historyNote:"Conversation records are not the exact model request body.",noHistory:"No records in this history window.",older:"Load older records",historyLoading:"Reading history\u2026",historyError:"History could not be loaded.",retry:"Retry",copy:"Copy usage JSON",copied:"Copied",copyFailed:"Copy failed",source:"Reported by CodexHost",live:"Live",disconnected:"Reconnecting",limits:"Detailed context composition",limitsNote:"The Host does not expose separate system-prompt, tool-definition and message token counts. No breakdown is estimated.",readOnly:"Read-only \xB7 conversations and prompts unchanged",emptyList:"No conversations on this page.",usageError:"Usage could not be loaded.",listError:"Conversations could not be loaded.",compatibilityTitle:"Context Insights (compatibility)",titleShort:"CH Context",settingsNote:"Open Context insights from the sidebar, or the Context tab inside a conversation.",localOnly:"Snapshots are read from this CodexHost instance. No conversation data is sent to a third-party service.",user:"User",assistant:"Assistant",tool:"Tool",event:"Event",date:"Updated",page:"Page",loadedSearch:"Search applies to this page.",following:"Current conversation",sampled:"Observed context",retained:"Up to 120 changed snapshots are retained in memory for the selected conversation.",details:"Show details",hideDetails:"Hide details",errorBoundary:"This panel could not render the available data.",count:"records",previewShort:"Preview",partialShort:"Partial",hostPreview:"The Host supplied a preview; the complete tool output is not included.",textTruncated:"Text shortened to 8,000 characters in this view.",contentUnavailable:"Some content is unavailable in this view, including unsupported media or omitted output.",clipped:"Long records may contain only the Host-provided preview.",activityStats:"Context stats",historyWindow:"Loaded history window",userMessages:"User messages",assistantMessages:"Assistant messages",toolCalls:"Tool calls",toolResults:"Tool results",toolUse:"Tool activity",commands:"Command executions",files:"File activity",reads:"Read",writes:"Write / edit",searches:"Search",activityTimeline:"Activity timeline",activitySequence:"Browse event sequence",sequenceNote:"Event order in this history window; markers do not represent token counts or duration.",prevRecord:"Previous record",nextRecord:"Next record",browserTitle:"Context browser",browserScope:"Conversation records",searchRecords:"Search this history window",categories:"Categories",chronological:"Sequence",sourceText:"Raw text",renderedText:"Rendered",copyRecord:"Copy",recordDetails:"Record details",argumentsLabel:"Arguments",toolOutput:"Tool output",recordTime:"Host record time",noCommands:"No recognized shell commands in this history window.",noFiles:"No recognized file paths in this history window.",noMatches:"No matching records.",loadedFamily:"Session network",familyScope:"Relationships reported among conversations on the loaded page.",parentConversation:"Parent",childConversations:"Child conversation",openConversation:"Open conversation",inputOutput:"Input + output",uncachedInput:"Uncached input",inputIncludesCache:"Input includes cache reads and writes.",changeConversation:"Change conversation",latestWindow:"Latest history",blank:"No textual content",taskChecked:"Completed task",taskUnchecked:"Incomplete task",imageLink:"Image link",completed:"Result recorded",pending:"Pending",failed:"Error",toolError:"The Host marked this tool result as an error.",relationSubagent:"Subagent",relationFork:"Fork",relationTree:"Thread tree",relationParent:"Parent link",expandGroup:"Expand group",eventCounts:"Events by kind",observationsDetail:"Observed context changes",overview:"Overview",inspectorView:"Inspector",allWorkspaces:"All workspaces",loadedSessions:"Loaded conversations",highestOccupancy:"Peak context occupancy",queriedUsage:"Queried tokens",activeWorkspaces:"Workspaces",sortRecent:"Recent",sortOccupancy:"Context %",sortCost:"Cost",sortTokens:"Tokens",overviewScopeNote:"Shows the loaded conversation page. Usage snapshots are fetched on demand from this CodexHost instance.",reasoningOutput:"Reasoning",remainingShort:"Remaining",capacityUnknown:"Capacity unknown",errorsOnly:"Errors only",jumpResult:"Result",jumpCall:"Call",programFilter:"Programs",filterPath:"Filter by path\u2026",statusOk:"OK",turnsCount:"turns",noFamily:"No parent, fork or subagent links reported on this page.",currentSession:"Current",points:"pts",noObservations:"No window occupancy reported yet",inspectedCount:"with telemetry",readShort:"R",writeShort:"W",searchShort:"S",openOperations:"Toggle operations",turnsLabel:"Turns",recordsLabel:"Records",answersLabel:"Replies",windowEvents:"Window events",completedShort:"Done",inputAndFiles:"Input & files",sessionAndRelations:"Session & relations",relatedSessionsLabel:"Related sessions",moreItems:"more",ofContextUsed:"of context used",usedShort:"Used",cautionZone:"Caution zone (\u226575%)",windowActivityStrip:"Loaded window sequence",turnShort:"Turn",stepOf:"of",stepUser:"User",stepRecord:"Record",stepReply:"Reply",byRecordCount:"By record count (not token share)",treemapToggle:"Toggle character-volume treemap",treemapTitle:"Character volume \xB7 loaded window",treemapNote:"Area reflects text characters in the loaded history window, not token estimates.",charsUnit:"chars",findInRecord:"Find in record",findPlaceholder:"Find in this record\u2026",findPrev:"Previous match",findNext:"Next match",closeFind:"Close search",linesUnit:"lines",resultOutput:"Result",shortcutsHint:"Shortcuts: / search \xB7 [ ] prev/next \xB7 Esc clear",filesUnit:"files",sortMostActive:"Most active",sortLatest:"Latest",sortByPath:"By path",sortByName:"By name",jumpToBrowser:"Jump to browser",cmdSummary:"Summary",settledRuns:"runs",failedShare:"failed",succeededRuns:"succeeded",programsLabel:"Programs",attentionLabel:"Attention",repeatedLabel:"Repeated",filterCommands:"Filter commands\u2026",filterPrograms:"Filter programs\u2026",sortSeq:"Sequence",linkedNodes:"linked nodes",exportReport:"Export",copyMarkdown:"Copy Markdown report",downloadMarkdown:"Download .md report",downloadJson:"Download .json report",reportCopied:"Report copied",reportDownloaded:"Downloaded",inspectedCost:"Queried cost",avgCacheHitLabel:"Avg cache hit",inspectedSessionsChart:"Queried session usage",tokenDistribution:"Queried token distribution",workspaceBreakdown:"Workspaces",harnessBreakdown:"Harnesses & relations",activityHeatmap:"Updated dates",heatmapScope:"Current page by update date",clearDateFilter:"Clear date",filterHighContext:"High context \u226575%",filterRelations:"Subagents / Forks",compareToggle:"Compare",compareSelected:"Comparing",compareTrayTitle:"Session comparison",clearCompare:"Clear",compareHint:"Pin up to 3 sessions to compare",metricLabel:"Metric",lessLabel:"Less",moreLabel:"More",subagentOrFork:"Subagent / Fork",updatedOnDate:"Updated on",noTelemetryYet:"No telemetry"},Zt={title:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF",subtitle:"\u770B\u6E05\u6BCF\u6BB5\u5BF9\u8BDD\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",tab:"\u4E0A\u4E0B\u6587",sessions:"\u4F1A\u8BDD",search:"\u641C\u7D22\u5F53\u524D\u9875\u4F1A\u8BDD",next:"\u4E0B\u4E00\u9875",previous:"\u4E0A\u4E00\u9875",refresh:"\u5237\u65B0",loading:"\u52A0\u8F7D\u4E2D\u2026",noSession:"\u9009\u62E9\u4E00\u4E2A\u4F1A\u8BDD",choose:"\u9009\u62E9\u4F1A\u8BDD\uFF0C\u67E5\u770B\u5176 Harness \u4E0A\u62A5\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",unavailable:"\u672A\u4E0A\u62A5",noUsage:"\u6B64 Harness \u5C1A\u672A\u4E0A\u62A5\u8BE5\u4F1A\u8BDD\u7684\u7528\u91CF\u3002",context:"\u5F53\u524D\u4E0A\u4E0B\u6587",used:"\u5DF2\u7528 Token",capacity:"\u7A97\u53E3\u5BB9\u91CF",remaining:"\u5269\u4F59\u5BB9\u91CF",occupancy:"\u4E0A\u4E0B\u6587\u5360\u7528",cumulative:"Token \u7EDF\u8BA1",input:"\u8F93\u5165 Token",output:"\u8F93\u51FA Token",cacheRead:"\u7F13\u5B58\u8BFB\u53D6",cacheWrite:"\u7F13\u5B58\u5199\u5165",total:"\u603B Token",cost:"\u4F1A\u8BDD\u8D39\u7528",costEstimate:"\u6309\u516C\u5F00\u4EF7\u683C\u4F30\u7B97",costNative:"\u539F\u751F\u8D39\u7528",partialPrice:"\u90E8\u5206\u6A21\u578B\u5C1A\u672A\u5B9A\u4EF7\uFF0C\u6B64\u91D1\u989D\u4E3A\u4E0B\u9650\u3002",performance:"\u6027\u80FD\u4E0E\u7F13\u5B58",tps:"\u8F93\u51FA\u901F\u5EA6",avgTps:"\u5E73\u5747\u8F93\u51FA\u901F\u5EA6",ttft:"\u9996\u4E2A\u8F93\u51FA\u5EF6\u8FDF",cacheHit:"\u6700\u8FD1\u7F13\u5B58\u547D\u4E2D",avgCache:"\u5E73\u5747\u7F13\u5B58\u547D\u4E2D",credits:"AI Credits",timeline:"\u4E0A\u4E0B\u6587\u89C2\u6D4B",timelineNote:"\u4EC5\u8BB0\u5F55\u9762\u677F\u6253\u5F00\u671F\u95F4\u7684\u53D8\u5316\uFF0C\u4E0D\u4EE3\u8868\u5B8C\u6574\u8BF7\u6C42\u5386\u53F2\u3002",needSamples:"\u4E0B\u4E00\u6B21\u4E0A\u4E0B\u6587\u53D8\u5316\u5C06\u5728\u6B64\u663E\u793A\u3002",observed:"\u89C2\u6D4B\u5FEB\u7167",history:"\u6D88\u606F\u4E0E\u5DE5\u5177",all:"\u5168\u90E8",messages:"\u6D88\u606F",tools:"\u5DE5\u5177",events:"\u4E8B\u4EF6",historyNote:"\u4F1A\u8BDD\u8BB0\u5F55\u4E0D\u7B49\u540C\u4E8E\u6A21\u578B\u5B9E\u9645\u6536\u5230\u7684\u5B8C\u6574\u8BF7\u6C42\u3002",noHistory:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u8BB0\u5F55\u3002",older:"\u52A0\u8F7D\u66F4\u65E9\u8BB0\u5F55",historyLoading:"\u6B63\u5728\u8BFB\u53D6\u5386\u53F2\u2026",historyError:"\u5386\u53F2\u52A0\u8F7D\u5931\u8D25\u3002",retry:"\u91CD\u8BD5",copy:"\u590D\u5236\u7528\u91CF JSON",copied:"\u5DF2\u590D\u5236",copyFailed:"\u590D\u5236\u5931\u8D25",source:"\u7531 CodexHost \u4E0A\u62A5",live:"\u5B9E\u65F6\u66F4\u65B0",disconnected:"\u6B63\u5728\u91CD\u8FDE",limits:"\u8BE6\u7EC6\u4E0A\u4E0B\u6587\u7EC4\u6210",limitsNote:"\u5BBF\u4E3B\u5C1A\u672A\u63D0\u4F9B\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3001\u5DE5\u5177\u5B9A\u4E49\u4E0E\u6D88\u606F\u5404\u81EA\u7684 Token \u6570\u91CF\uFF0C\u6B64\u5904\u4E0D\u4F30\u7B97\u62C6\u5206\u3002",readOnly:"\u53EA\u8BFB \xB7 \u4E0D\u4FEE\u6539\u4F1A\u8BDD\u6216\u63D0\u793A\u8BCD",emptyList:"\u5F53\u524D\u9875\u6CA1\u6709\u4F1A\u8BDD\u3002",usageError:"\u7528\u91CF\u52A0\u8F7D\u5931\u8D25\u3002",listError:"\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25\u3002",compatibilityTitle:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF\uFF08\u517C\u5BB9\u5165\u53E3\uFF09",titleShort:"CH Context",settingsNote:"\u4ECE\u4FA7\u680F\u6253\u5F00\u300C\u4E0A\u4E0B\u6587\u6D1E\u5BDF\u300D\uFF0C\u6216\u8FDB\u5165\u4F1A\u8BDD\u5185\u7684\u300C\u4E0A\u4E0B\u6587\u300D\u9875\u7B7E\u3002",localOnly:"\u6570\u636E\u8BFB\u53D6\u81EA\u5F53\u524D CodexHost \u5B9E\u4F8B\uFF0C\u4E0D\u5411\u7B2C\u4E09\u65B9\u670D\u52A1\u53D1\u9001\u4F1A\u8BDD\u5185\u5BB9\u3002",user:"\u7528\u6237",assistant:"\u52A9\u624B",tool:"\u5DE5\u5177",event:"\u4E8B\u4EF6",date:"\u66F4\u65B0\u65F6\u95F4",page:"\u7B2C",loadedSearch:"\u641C\u7D22\u8303\u56F4\u4E3A\u5F53\u524D\u9875\u3002",following:"\u5F53\u524D\u4F1A\u8BDD",sampled:"\u4E0A\u4E0B\u6587\u89C2\u6D4B\u503C",retained:"\u4EC5\u5728\u5185\u5B58\u4E2D\u4FDD\u7559\u6240\u9009\u4F1A\u8BDD\u6700\u8FD1 120 \u6B21\u53D8\u5316\u5FEB\u7167\u3002",details:"\u663E\u793A\u8BE6\u60C5",hideDetails:"\u6536\u8D77\u8BE6\u60C5",errorBoundary:"\u9762\u677F\u65E0\u6CD5\u663E\u793A\u5F53\u524D\u6570\u636E\u3002",count:"\u6761\u8BB0\u5F55",previewShort:"\u9884\u89C8",partialShort:"\u90E8\u5206\u5185\u5BB9",hostPreview:"\u5BBF\u4E3B\u4EC5\u63D0\u4F9B\u9884\u89C8\uFF0C\u672A\u5305\u542B\u5B8C\u6574\u5DE5\u5177\u8F93\u51FA\u3002",textTruncated:"\u5F53\u524D\u89C6\u56FE\u4E2D\u7684\u6587\u672C\u5DF2\u622A\u53D6\u81F3 8,000 \u4E2A\u5B57\u7B26\u3002",contentUnavailable:"\u6B64\u89C6\u56FE\u65E0\u6CD5\u663E\u793A\u90E8\u5206\u5185\u5BB9\uFF0C\u4F8B\u5982\u672A\u652F\u6301\u7684\u5A92\u4F53\u6216\u7701\u7565\u7684\u8F93\u51FA\u3002",clipped:"\u8F83\u957F\u8BB0\u5F55\u53EF\u80FD\u4EC5\u5305\u542B\u5BBF\u4E3B\u63D0\u4F9B\u7684\u9884\u89C8\u3002",activityStats:"\u4F1A\u8BDD\u7EDF\u8BA1",historyWindow:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3",userMessages:"\u7528\u6237\u6D88\u606F",assistantMessages:"\u52A9\u624B\u6D88\u606F",toolCalls:"\u5DE5\u5177\u8C03\u7528",toolResults:"\u5DE5\u5177\u7ED3\u679C",toolUse:"\u5DE5\u5177\u6D3B\u52A8",commands:"\u547D\u4EE4\u6267\u884C",files:"\u6587\u4EF6\u6D3B\u52A8",reads:"\u8BFB\u53D6",writes:"\u5199\u5165 / \u7F16\u8F91",searches:"\u641C\u7D22",activityTimeline:"\u6D3B\u52A8\u65F6\u95F4\u7EBF",activitySequence:"\u6D4F\u89C8\u4E8B\u4EF6\u5E8F\u5217",sequenceNote:"\u5C55\u793A\u6B64\u5386\u53F2\u7A97\u53E3\u4E2D\u7684\u8BB0\u5F55\u987A\u5E8F\uFF0C\u6807\u8BB0\u4F4D\u7F6E\u4E0D\u8868\u793A Token \u6570\u91CF\u6216\u8017\u65F6\u3002",prevRecord:"\u4E0A\u4E00\u6761\u8BB0\u5F55",nextRecord:"\u4E0B\u4E00\u6761\u8BB0\u5F55",browserTitle:"\u4E0A\u4E0B\u6587\u6D4F\u89C8\u5668",browserScope:"\u4F1A\u8BDD\u8BB0\u5F55",searchRecords:"\u641C\u7D22\u5F53\u524D\u5386\u53F2\u7A97\u53E3",categories:"\u5206\u7C7B",chronological:"\u987A\u5E8F",sourceText:"\u539F\u6587",renderedText:"\u6E32\u67D3",copyRecord:"\u590D\u5236",recordDetails:"\u8BB0\u5F55\u8BE6\u60C5",argumentsLabel:"\u53C2\u6570",toolOutput:"\u5DE5\u5177\u8F93\u51FA",recordTime:"\u5BBF\u4E3B\u8BB0\u5F55\u65F6\u95F4",noCommands:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684 Shell \u547D\u4EE4\u3002",noFiles:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u6587\u4EF6\u8DEF\u5F84\u3002",noMatches:"\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5F55\u3002",loadedFamily:"\u4F1A\u8BDD\u7F51\u7EDC",familyScope:"\u4EC5\u5C55\u793A\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\u4E2D\u7531\u5BBF\u4E3B\u4E0A\u62A5\u7684\u5173\u7CFB\u3002",parentConversation:"\u7236\u4F1A\u8BDD",childConversations:"\u5B50\u4F1A\u8BDD",openConversation:"\u6253\u5F00\u4F1A\u8BDD",inputOutput:"\u8F93\u5165 + \u8F93\u51FA",uncachedInput:"\u672A\u7F13\u5B58\u8F93\u5165",inputIncludesCache:"\u8F93\u5165\u7528\u91CF\u5DF2\u5305\u542B\u7F13\u5B58\u8BFB\u53D6\u4E0E\u5199\u5165\u3002",changeConversation:"\u5207\u6362\u4F1A\u8BDD",latestWindow:"\u6700\u65B0\u5386\u53F2",blank:"\u6CA1\u6709\u6587\u672C\u5185\u5BB9",taskChecked:"\u5DF2\u5B8C\u6210\u4EFB\u52A1",taskUnchecked:"\u672A\u5B8C\u6210\u4EFB\u52A1",imageLink:"\u56FE\u7247\u94FE\u63A5",completed:"\u5DF2\u8BB0\u5F55\u7ED3\u679C",pending:"\u5F85\u5B9A",failed:"\u9519\u8BEF",toolError:"\u5BBF\u4E3B\u5DF2\u5C06\u6B64\u5DE5\u5177\u7ED3\u679C\u6807\u8BB0\u4E3A\u9519\u8BEF\u3002",relationSubagent:"\u5B50\u4EE3\u7406",relationFork:"\u5206\u53C9",relationTree:"\u4F1A\u8BDD\u6811",relationParent:"\u4E0A\u7EA7\u5173\u7CFB",expandGroup:"\u5C55\u5F00\u5206\u7EC4",eventCounts:"\u4E8B\u4EF6\u7C7B\u522B",observationsDetail:"\u4E0A\u4E0B\u6587\u53D8\u5316\u89C2\u6D4B",overview:"\u603B\u89C8",inspectorView:"\u4F1A\u8BDD\u6D1E\u5BDF",allWorkspaces:"\u5168\u90E8\u5DE5\u4F5C\u533A",loadedSessions:"\u5DF2\u52A0\u8F7D\u4F1A\u8BDD",highestOccupancy:"\u6700\u9AD8\u4E0A\u4E0B\u6587\u5360\u7528",queriedUsage:"\u5DF2\u67E5 Token \u603B\u91CF",activeWorkspaces:"\u6D3B\u8DC3\u5DE5\u4F5C\u533A",sortRecent:"\u6700\u8FD1\u66F4\u65B0",sortOccupancy:"\u5F53\u524D\u4E0A\u4E0B\u6587",sortCost:"\u4F1A\u8BDD\u8D39\u7528",sortTokens:"Token \u603B\u7528\u91CF",overviewScopeNote:"\u4EC5\u5C55\u793A\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\uFF1B\u6309\u9700\u4ECE\u5F53\u524D CodexHost \u5B9E\u4F8B\u62C9\u53D6\u53EF\u89C1\u4F1A\u8BDD\u7684\u7528\u91CF\u5FEB\u7167\u3002",reasoningOutput:"\u542B\u63A8\u7406\u8F93\u51FA",remainingShort:"\u5269\u4F59",capacityUnknown:"\u5BB9\u91CF\u672A\u77E5",errorsOnly:"\u4EC5\u9519\u8BEF",jumpResult:"\u8DF3\u8F6C\u8F93\u51FA",jumpCall:"\u8DF3\u8F6C\u8C03\u7528",programFilter:"\u7A0B\u5E8F\u5206\u5E03",filterPath:"\u6309\u8DEF\u5F84\u7B5B\u9009\u2026",statusOk:"\u6B63\u5E38",turnsCount:"\u8F6E",noFamily:"\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\u4E2D\u672A\u4E0A\u62A5\u7236\u5B50\u3001\u5206\u652F\u6216\u5B50\u4EE3\u7406\u5173\u7CFB\u3002",currentSession:"\u5F53\u524D\u4F1A\u8BDD",points:"\u70B9",noObservations:"\u6682\u65E0\u7A97\u53E3\u5360\u6BD4\u89C2\u6D4B\u70B9",inspectedCount:"\u6709\u9065\u6D4B",readShort:"\u8BFB",writeShort:"\u5199",searchShort:"\u641C",openOperations:"\u5C55\u5F00\u64CD\u4F5C\u8BB0\u5F55",turnsLabel:"\u8F6E\u6B21",recordsLabel:"\u8BB0\u5F55\u6570",answersLabel:"\u52A9\u624B\u56DE\u590D",windowEvents:"\u7A97\u53E3\u4E8B\u4EF6",completedShort:"\u5DF2\u5B8C\u6210",inputAndFiles:"\u8F93\u5165\u4E0E\u6587\u4EF6",sessionAndRelations:"\u4F1A\u8BDD\u4E0E\u5173\u8054",relatedSessionsLabel:"\u5DF2\u52A0\u8F7D\u5173\u8054\u4F1A\u8BDD",moreItems:"\u66F4\u591A",ofContextUsed:"\u5DF2\u4F7F\u7528\u4E0A\u4E0B\u6587",usedShort:"\u5DF2\u7528",cautionZone:"\u9AD8\u5360\u7528\u53C2\u8003\u533A (\u226575%)",windowActivityStrip:"\u5F53\u524D\u7A97\u53E3\u8BB0\u5F55\u5206\u5E03\uFF08\u6309\u987A\u5E8F\uFF09",turnShort:"\u8F6E\u6B21",stepOf:"/",stepUser:"\u7528\u6237",stepRecord:"\u8BB0\u5F55",stepReply:"\u56DE\u590D",byRecordCount:"\u6309\u8BB0\u5F55\u6570\u5360\u6BD4\uFF08\u975E Token \u4F30\u7B97\uFF09",treemapToggle:"\u5207\u6362\u7A97\u53E3\u5B57\u7B26\u4F53\u79EF\u5206\u5E03\u56FE",treemapTitle:"\u6587\u672C\u5B57\u7B26\u4F53\u79EF \xB7 \u5F53\u524D\u5386\u53F2\u7A97\u53E3",treemapNote:"\u9762\u79EF\u8868\u793A\u5F53\u524D\u7A97\u53E3\u5404\u8BB0\u5F55\u7684\u6587\u672C\u5B57\u7B26\u6570\uFF0C\u5E76\u975E\u6A21\u578B Token \u4F30\u7B97\u3002",charsUnit:"\u5B57\u7B26",findInRecord:"\u8BB0\u5F55\u5185\u67E5\u627E",findPlaceholder:"\u5728\u5F53\u524D\u8BB0\u5F55\u4E2D\u67E5\u627E\u2026",findPrev:"\u4E0A\u4E00\u5904",findNext:"\u4E0B\u4E00\u5904",closeFind:"\u5173\u95ED\u67E5\u627E",linesUnit:"\u884C",resultOutput:"\u7ED3\u679C\u8F93\u51FA",shortcutsHint:"\u5FEB\u6377\u952E\uFF1A/ \u641C\u7D22 \xB7 [ ] \u4E0A/\u4E0B\u4E00\u6761 \xB7 Esc \u6E05\u7A7A",filesUnit:"\u4E2A\u6587\u4EF6",sortMostActive:"\u6700\u6D3B\u8DC3",sortLatest:"\u6700\u65B0",sortByPath:"\u6309\u8DEF\u5F84",sortByName:"\u6309\u6587\u4EF6\u540D",jumpToBrowser:"\u8DF3\u8F6C\u81F3\u4E0A\u4E0B\u6587\u6D4F\u89C8\u5668",cmdSummary:"\u7EDF\u8BA1\u6982\u89C8",settledRuns:"\u603B\u6267\u884C",failedShare:"\u5931\u8D25",succeededRuns:"\u5DF2\u6210\u529F",programsLabel:"\u7A0B\u5E8F\u5206\u5E03",attentionLabel:"\u9700\u8981\u5173\u6CE8",repeatedLabel:"\u9AD8\u9891",filterCommands:"\u7B5B\u9009\u547D\u4EE4\u2026",filterPrograms:"\u7B5B\u9009\u7A0B\u5E8F\u2026",sortSeq:"\u987A\u5E8F",linkedNodes:"\u4E2A\u5173\u8054\u8282\u70B9",exportReport:"\u5BFC\u51FA\u62A5\u544A",copyMarkdown:"\u590D\u5236 Markdown \u62A5\u544A",downloadMarkdown:"\u4E0B\u8F7D .md \u62A5\u544A",downloadJson:"\u4E0B\u8F7D .json \u62A5\u544A",reportCopied:"\u62A5\u544A\u5DF2\u590D\u5236",reportDownloaded:"\u5DF2\u4E0B\u8F7D",inspectedCost:"\u5DF2\u67E5\u4F30\u7B97\u8D39\u7528",avgCacheHitLabel:"\u5E73\u5747\u7F13\u5B58\u547D\u4E2D",inspectedSessionsChart:"\u5DF2\u67E5\u4F1A\u8BDD\u7528\u91CF\u5BF9\u6BD4",tokenDistribution:"\u5DF2\u67E5\u4F1A\u8BDD Token \u5206\u5E03",workspaceBreakdown:"\u5DE5\u4F5C\u533A\u5206\u5E03",harnessBreakdown:"\u8FD0\u884C\u73AF\u5883\u4E0E\u5173\u7CFB",activityHeatmap:"\u6D3B\u8DC3\u5EA6\uFF08\u6309\u66F4\u65B0\u65E5\u671F\uFF09",heatmapScope:"\u5F53\u524D\u9875\u4F1A\u8BDD\u66F4\u65B0\u65F6\u95F4\u5206\u5E03",clearDateFilter:"\u6E05\u9664\u65E5\u671F",filterHighContext:"\u9AD8\u5360\u7528 \u226575%",filterRelations:"\u5B50\u4EE3\u7406 / \u5206\u53C9",compareToggle:"\u5BF9\u6BD4",compareSelected:"\u5DF2\u9009\u5BF9\u6BD4",compareTrayTitle:"\u591A\u4F1A\u8BDD\u6A2A\u5411\u5BF9\u6BD4",clearCompare:"\u6E05\u7A7A\u5BF9\u6BD4",compareHint:"\u6700\u591A\u52FE\u9009 3 \u4E2A\u4F1A\u8BDD\u5E76\u6392\u5BF9\u6BD4",metricLabel:"\u6307\u6807",lessLabel:"\u5C11",moreLabel:"\u591A",subagentOrFork:"\u5B50\u4EE3\u7406 / \u5206\u53C9",updatedOnDate:"\u66F4\u65B0\u65E5\u671F",noTelemetryYet:"\u672A\u4E0A\u62A5"};function xt(e){let t=e.toLowerCase().startsWith("zh")?Zt:Kt;return a=>t[a]}var rr=require("react"),Xe=new WeakMap;function ar(e,t){(0,rr.useLayoutEffect)(()=>{if(!t)return;let a=e.current?.closest("[data-conversation-scroll]");if(a)return Xe.set(a,(Xe.get(a)??0)+1),a.setAttribute("data-ch-context-surface",""),()=>{let r=(Xe.get(a)??1)-1;r>0?Xe.set(a,r):(Xe.delete(a),a.removeAttribute("data-ch-context-surface"))}},[e,t])}var I=require("react/jsx-runtime");function Jt({ctx:e,sessionId:t,projection:a,embedded:r=!1,headerActions:n}){let o=(0,he.useRef)(null);ar(o,r);let s=Qn(e),i=(0,he.useMemo)(()=>xt(s),[s]),c=Xn(e),[h,d]=(0,he.useState)(),[g,l]=(0,he.useState)(!1),[N,v]=(0,he.useState)(!1),[S,M]=(0,he.useState)("inspector"),w=t??h??c,k=be(w)?w:void 0,P=r?"inspector":k?S:"overview",[D,T]=(0,he.useState)(0),[j,A]=(0,he.useState)([null]),[z,L]=(0,he.useState)(0),[J,K]=(0,he.useState)(""),[y,H]=(0,he.useState)("idle"),[u,U]=(0,he.useState)("idle"),C=Yn(j[z]??null,D),B=nr(C.page?.items??[],!r&&P==="overview",D),q=er(k,a,D),ee=tr(k,D,q.snapshotSequence||null),le=C.page?.items.find(O=>O.id===k),de=(C.page?.items??[]).filter(O=>be(O.id)&&`${O.title} ${O.harness??""} ${O.cwd??""}`.toLocaleLowerCase().includes(J.toLocaleLowerCase()));(0,he.useEffect)(()=>{H("idle"),U("idle"),v(!1)},[k]);let we=()=>T(O=>O+1),R=O=>{if(r){let re=ke(e.get("uiWorkspace"));typeof re?.openSession=="function"&&re.openSession(O);return}d(O),M("inspector"),l(!1)},W=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({threadId:k,observedAt:q.updatedAt,usage:q.usage},null,2)),H("done")}catch{H("failed")}},ue=le?.cwd?.split(/[\\/]/).filter(Boolean).at(-1),pe=le?.title||k||i("noSession"),m=le?.harness??"CodexHost",_=()=>{let O=ee.page?.items??[];return{threadId:k??"",title:pe,harness:m,cwd:le?.cwd,exportedAt:Date.now(),usage:q.usage,summary:ee.page?Ye(O):null,items:O,related:k?at(C.page?.items??[],k):[]}},F=async()=>{if(k)try{await navigator.clipboard.writeText(Rt(_(),s)),U("copied"),v(!1)}catch{U("failed")}},X=O=>{if(!k)return;let re=_(),Fe=vn(pe,k),hr=O==="md"?Rt(re,s):JSON.stringify(xn(re),null,2),ur=kn(`ch-context-${Fe}.${O}`,hr,O==="md"?"text/markdown;charset=utf-8":"application/json;charset=utf-8");U(ur?"downloaded":"failed"),v(!1)};return(0,I.jsx)("div",{ref:o,className:`ch-context ${r?"ch-embedded":""}`,lang:s.startsWith("zh")?"zh-CN":"en",children:(0,I.jsxs)("div",{className:"ch-shell",children:[(0,I.jsxs)("header",{className:`ch-page-heading ${r?"ch-heading-embedded":""}`,children:[(0,I.jsxs)("div",{className:"ch-heading-left",children:[(0,I.jsxs)("div",{className:"ch-heading-title",children:[(0,I.jsx)("div",{className:"ch-brand-icon","aria-hidden":"true",children:(0,I.jsx)(We,{size:14})}),(0,I.jsxs)("div",{className:"ch-brand-stack",children:[r?(0,I.jsx)("span",{className:"ch-brand-name",children:"CH CONTEXT"}):(0,I.jsx)("h1",{children:i("title")}),(0,I.jsxs)("div",{className:"ch-brand",children:[(0,I.jsx)("span",{children:"CH-CONTEXT"}),(0,I.jsx)("a",{className:"ch-version",href:"https://github.com/ABC-xiaoxuan/ch-context",target:"_blank",rel:"noopener noreferrer",children:"0.3.3"})]})]})]}),!r&&(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("span",{className:"ch-divider-v","aria-hidden":"true"}),(0,I.jsxs)("div",{className:"ch-seg ch-view-seg",role:"tablist","aria-label":i("title"),children:[(0,I.jsx)("button",{type:"button",role:"tab","aria-selected":P==="overview",className:P==="overview"?"is-active":"",onClick:()=>{M("overview"),l(!1)},children:i("overview")}),(0,I.jsx)("button",{type:"button",role:"tab","aria-selected":P==="inspector",className:P==="inspector"?"is-active":"",disabled:!k,onClick:()=>M("inspector"),children:i("inspectorView")})]}),(0,I.jsxs)("details",{className:"ch-session-picker",open:g,onToggle:O=>l(O.currentTarget.open),children:[(0,I.jsxs)("summary",{title:pe,children:[(0,I.jsx)("span",{className:"ch-meta-tag ch-session-harness",children:m}),(0,I.jsx)("strong",{children:le?.title||i(k?"following":"noSession")}),ue&&(0,I.jsx)("span",{className:"ch-meta-tag is-muted",children:ue}),(0,I.jsx)("small",{"aria-hidden":"true",children:"\u25BE"})]}),(0,I.jsxs)("div",{className:"ch-session-picker-body",children:[(0,I.jsxs)("div",{className:"ch-picker-header",children:[(0,I.jsxs)("label",{className:"ch-search",children:[(0,I.jsx)("span",{"aria-hidden":"true",children:"\u2315"}),(0,I.jsx)("input",{value:J,onChange:O=>K(O.target.value),placeholder:i("search"),"aria-label":i("search")})]}),be(c)&&(0,I.jsx)("button",{type:"button",className:"ch-mini-button",onClick:()=>{d(void 0),M("inspector"),l(!1)},children:i("following")})]}),C.error?(0,I.jsxs)("div",{className:"ch-error",role:"alert",children:[i("listError"),(0,I.jsx)("span",{children:C.error}),(0,I.jsx)("button",{type:"button",className:"ch-mini-button",onClick:we,children:i("retry")})]}):(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("div",{className:"ch-session-list",role:"list",children:C.loading?(0,I.jsx)("div",{className:"ch-skeleton ch-session-skeleton","aria-label":i("loading")}):de.length===0?(0,I.jsx)("p",{className:"ch-note",children:i("emptyList")}):de.map(O=>(0,I.jsx)("div",{role:"listitem",children:(0,I.jsxs)("button",{type:"button",className:`ch-session ${k===O.id?"is-selected":""}`,"aria-pressed":k===O.id,title:O.title,onClick:()=>R(O.id),children:[(0,I.jsx)("span",{className:"ch-session-marker"}),(0,I.jsxs)("span",{className:"ch-session-title",children:[O.title||O.id,(0,I.jsxs)("small",{title:O.cwd,children:[O.harness??"CodexHost",O.cwd?` \xB7 ${O.cwd.split(/[\\/]/).filter(Boolean).at(-1)}`:""]})]}),(0,I.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})},O.id))}),(0,I.jsxs)("div",{className:"ch-pagination",children:[(0,I.jsx)("small",{children:i("loadedSearch")}),(0,I.jsxs)("div",{children:[(0,I.jsx)("button",{type:"button",className:"ch-mini-button",disabled:z===0||C.loading,onClick:()=>L(O=>Math.max(0,O-1)),children:i("previous")}),(0,I.jsxs)("span",{children:[i("page")," ",z+1]}),(0,I.jsx)("button",{type:"button",className:"ch-mini-button",disabled:!C.page?.nextCursor||C.loading,onClick:()=>{let O=C.page?.nextCursor;O&&(A(re=>[...re.slice(0,z+1),O]),L(re=>re+1))},children:i("next")})]})]})]})]})]})]})]}),(0,I.jsxs)("div",{className:"ch-heading-actions",children:[n,k&&P==="inspector"&&(0,I.jsxs)("span",{className:`ch-status ${q.connected?"":"is-offline"}`,children:[(0,I.jsx)("i",{}),i(q.connected?"live":"disconnected")]}),k&&P==="inspector"&&(0,I.jsx)("button",{type:"button",className:"ch-mini-button",disabled:!q.usage,onClick:()=>{W()},children:i(y==="done"?"copied":y==="failed"?"copyFailed":"copy")}),k&&P==="inspector"&&(0,I.jsxs)("details",{className:"ch-export-menu",open:N,onToggle:O=>v(O.currentTarget.open),children:[(0,I.jsxs)("summary",{className:"ch-button",children:[i(u==="copied"?"reportCopied":u==="downloaded"?"reportDownloaded":u==="failed"?"copyFailed":"exportReport")," ","\u25BE"]}),(0,I.jsxs)("div",{className:"ch-export-pop",role:"menu",children:[(0,I.jsx)("button",{type:"button",role:"menuitem",onClick:()=>{F()},children:i("copyMarkdown")}),(0,I.jsx)("button",{type:"button",role:"menuitem",onClick:()=>X("md"),children:i("downloadMarkdown")}),(0,I.jsx)("button",{type:"button",role:"menuitem",onClick:()=>X("json"),children:i("downloadJson")})]})]}),(0,I.jsx)("button",{type:"button",className:"ch-button",disabled:P==="overview"?C.loading:q.loading,onClick:we,children:i((P==="overview"?C.loading:q.loading)?"loading":"refresh")})]})]}),P==="overview"?(0,I.jsx)(Kn,{rows:C.page?.items??[],usageById:B,loading:C.loading,error:C.error,selected:k,hasSelected:!!k,pageIndex:z,hasNext:!!C.page?.nextCursor,onPrev:()=>L(O=>Math.max(0,O-1)),onNext:()=>{let O=C.page?.nextCursor;O&&(A(re=>[...re.slice(0,z+1),O]),L(re=>re+1))},onSelect:R,onRetry:we,t:i}):k?(0,I.jsxs)(I.Fragment,{children:[q.error&&(0,I.jsxs)("div",{className:"ch-error",role:"alert",children:[i("usageError"),(0,I.jsx)("span",{children:q.error}),(0,I.jsx)("button",{type:"button",className:"ch-mini-button",onClick:we,children:i("retry")})]}),!q.usage&&!q.error&&!q.loading&&(0,I.jsx)("p",{className:"ch-note ch-availability",children:i("noUsage")}),(0,I.jsx)(Bn,{usage:q,history:ee,rows:C.page?.items??[],selected:k,currentTitle:pe,currentHarness:m,onSelect:R,retry:we,t:i},k)]}):(0,I.jsxs)("div",{className:"ch-empty",children:[(0,I.jsx)(We,{size:28}),(0,I.jsx)("h2",{children:i("noSession")}),(0,I.jsx)("p",{children:i("choose")})]}),(0,I.jsxs)("footer",{className:"ch-footer",children:[(0,I.jsxs)("span",{children:["ch-context \xB7 ",i("readOnly")]}),(0,I.jsx)("span",{children:i("localOnly")})]})]})})}var sr=`.ch-context {
  --ch-canvas: var(--dsw-alias-bg-layer-0, #f5f5f7);
  --ch-surface: var(--dsw-alias-bg-layer-1, #ffffff);
  --ch-surface-elevated: var(--dsw-alias-bg-layer-1, #ffffff);
  --ch-sub: #fafafa;
  --ch-well: var(--dsw-alias-bg-layer-2, #f2f2f5);
  --ch-well-hover: #e8e8ed;
  --ch-stripe: rgba(0, 0, 0, 0.024);
  --ch-border: var(--dsw-alias-border-l2, #e5e5ea);
  --ch-border-fine: #ececf0;
  --ch-border-strong: #d4d4dc;
  --ch-shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.026);
  --ch-shadow-tile: 0 1px 2px rgba(0, 0, 0, 0.035);
  --ch-shadow-pop: 0 14px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  --ch-inset-top: none;
  --ch-ink: var(--dsw-alias-label-primary, #1c1c1e);
  --ch-ink-2: #48484a;
  --ch-muted: var(--dsw-alias-label-secondary, #636366);
  --ch-muted-2: #8e8e93;
  --ch-blue: #0071e3;
  --ch-indigo: #5856d6;
  --ch-teal: #0d9488;
  --ch-green: #248a3d;
  --ch-purple: #8944ab;
  --ch-amber: #c77700;
  --ch-danger: #d70015;
  --ch-accent: #0071e3;
  --ch-accent-soft: rgba(0, 113, 227, 0.1);
  --ch-accent-text: #0066cc;
  --ch-danger-soft: rgba(215, 0, 21, 0.1);
  --ch-warn-soft: rgba(199, 119, 0, 0.11);
  --ch-ok-soft: rgba(36, 138, 61, 0.12);
  --ch-seg-active-bg: #1c1c1e;
  --ch-seg-active-fg: #ffffff;
  --ch-seg-active-shadow: none;
  --ch-brand-bg: #f2f2f5;
  --ch-brand-fg: #1c1c1e;
  --ch-track: rgba(120, 120, 128, 0.16);
  --ch-grid-line: rgba(110, 110, 115, 0.14);
  --ch-turn-band: rgba(0, 0, 0, 0.03);
  --ch-code-bg: #f6f6f8;
  --ch-mono: var(
    --ds-font-family-code,
    'SF Mono',
    'JetBrains Mono',
    'Cascadia Code',
    Menlo,
    Consolas,
    ui-monospace,
    monospace
  );
  background: var(--ch-canvas);
  color: var(--ch-ink);
  font-family: var(
    --ds-font-family,
    -apple-system,
    BlinkMacSystemFont,
    'SF Pro Text',
    'PingFang SC',
    'Microsoft YaHei UI',
    'Segoe UI',
    sans-serif
  );
  font-size: 12px;
  line-height: 1.48;
  height: 100%;
  min-height: 0;
  overflow: auto;
  container-type: inline-size;
  color-scheme: light dark;
}
body[data-ds-dark-theme] .ch-context {
  --ch-canvas: var(--dsw-alias-bg-layer-0, #141416);
  --ch-surface: var(--dsw-alias-bg-layer-1, #1c1c1f);
  --ch-surface-elevated: #242428;
  --ch-sub: #202024;
  --ch-well: var(--dsw-alias-bg-layer-2, #242428);
  --ch-well-hover: #2d2d33;
  --ch-stripe: rgba(255, 255, 255, 0.025);
  --ch-border: var(--dsw-alias-border-l2, #2c2c31);
  --ch-border-fine: #27272c;
  --ch-border-strong: #3a3a41;
  --ch-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.35);
  --ch-shadow-tile: none;
  --ch-shadow-pop: 0 18px 44px rgba(0, 0, 0, 0.6);
  --ch-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  --ch-ink: var(--dsw-alias-label-primary, #f5f5f7);
  --ch-ink-2: #d1d1d6;
  --ch-muted: var(--dsw-alias-label-secondary, #a1a1a6);
  --ch-muted-2: #6e6e73;
  --ch-blue: #409cff;
  --ch-indigo: #7d7aff;
  --ch-teal: #2dd4bf;
  --ch-green: #32d74b;
  --ch-purple: #bf5af2;
  --ch-amber: #ffb340;
  --ch-danger: #ff453a;
  --ch-accent: #409cff;
  --ch-accent-soft: rgba(64, 156, 255, 0.16);
  --ch-accent-text: #64b5ff;
  --ch-danger-soft: rgba(255, 69, 58, 0.15);
  --ch-warn-soft: rgba(255, 179, 64, 0.15);
  --ch-ok-soft: rgba(50, 215, 75, 0.14);
  --ch-seg-active-bg: #f5f5f7;
  --ch-seg-active-fg: #141416;
  --ch-seg-active-shadow: none;
  --ch-brand-bg: #242428;
  --ch-brand-fg: #f5f5f7;
  --ch-track: rgba(255, 255, 255, 0.12);
  --ch-grid-line: rgba(142, 142, 147, 0.14);
  --ch-turn-band: rgba(255, 255, 255, 0.032);
  --ch-code-bg: #161619;
}
.ch-context * {
  box-sizing: border-box;
}
.ch-context :is(h1, h2, h3, p, dl, dd) {
  margin: 0;
}
.ch-context :is(button, input, select) {
  font: inherit;
  color: inherit;
}
.ch-context button {
  cursor: pointer;
}
.ch-context button:disabled {
  cursor: default;
  opacity: 0.42;
}
.ch-context :is(button, input, select, summary, a):focus-visible {
  outline: 2px solid var(--ch-accent);
  outline-offset: 1px;
}
.ch-shell {
  max-width: 1440px;
  margin-inline: auto;
  padding: 10px 14px 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.ch-embedded .ch-shell {
  padding: 8px 10px 16px;
  max-width: none;
}
.ch-page-heading {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 7px 11px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  flex-wrap: wrap;
}
.ch-heading-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
}
.ch-heading-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-shrink: 0;
}
.ch-brand-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ch-brand-bg);
  color: var(--ch-brand-fg);
  border: 1px solid var(--ch-border-fine);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ch-brand-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}
.ch-page-heading h1,
.ch-brand-name {
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: var(--ch-ink);
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--ch-muted-2);
  font-family: var(--ch-mono);
  font-size: 9.5px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.ch-version {
  font-size: 9.5px;
  text-decoration: none;
  color: var(--ch-muted);
  border: 1px solid var(--ch-border-fine);
  padding: 0 4px;
  border-radius: 4px;
}
.ch-version:hover {
  color: var(--ch-ink);
  border-color: var(--ch-border-strong);
}
.ch-divider-v {
  width: 1px;
  height: 18px;
  background: var(--ch-border);
  flex-shrink: 0;
}
.ch-seg {
  display: inline-flex;
  align-items: center;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  border-radius: 7px;
  padding: 2px;
  gap: 2px;
  flex-shrink: 0;
}
.ch-seg button {
  border: 0;
  background: transparent;
  color: var(--ch-muted);
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.25;
  transition: background 0.13s, color 0.13s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.ch-seg button:hover:not(:disabled) {
  background: var(--ch-well-hover);
  color: var(--ch-ink);
}
.ch-seg button.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  font-weight: 600;
  box-shadow: var(--ch-seg-active-shadow);
}
.ch-seg button .ch-cnt {
  font-variant-numeric: tabular-nums;
  opacity: 0.72;
  font-size: 10.5px;
}
.ch-seg button.is-active .ch-cnt {
  opacity: 0.88;
}
.ch-meta-tag {
  font-family: var(--ch-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  color: var(--ch-ink-2);
  flex-shrink: 0;
  white-space: nowrap;
}
.ch-meta-tag.is-muted {
  color: var(--ch-muted);
  font-weight: 500;
}
.ch-meta-tag.is-ws {
  border-radius: 99px;
  background: var(--ch-well);
  border-color: transparent;
  color: var(--ch-ink);
  padding: 1px 8px;
}
.ch-meta-tag.is-current {
  color: var(--ch-blue);
  border-color: color-mix(in srgb, var(--ch-blue) 40%, transparent);
  background: color-mix(in srgb, var(--ch-blue) 8%, transparent);
}
.ch-heading-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.ch-market-language-select {
  min-height: 27px;
  max-width: 94px;
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  color: var(--ch-ink);
  background: var(--ch-surface);
  font-size: 11px;
  padding: 3px 6px;
}
.ch-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 99px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  font-size: 11px;
  font-weight: 500;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ch-green);
}
.ch-status.is-offline i {
  background: var(--ch-amber);
}
.ch-button,
.ch-mini-button {
  border: 1px solid var(--ch-border-strong);
  background: var(--ch-surface);
  color: var(--ch-ink);
  padding: 4px 9px;
  min-height: 27px;
  border-radius: 7px;
  line-height: 1.2;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
}
.ch-mini-button {
  border-color: transparent;
  background: transparent;
  color: var(--ch-muted);
  padding: 3px 7px;
  min-height: 24px;
  font-size: 10.5px;
}
.ch-button:hover:not(:disabled),
.ch-mini-button:hover:not(:disabled) {
  background: var(--ch-well);
  border-color: var(--ch-border-strong);
  color: var(--ch-ink);
}
.ch-mini-button.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
}
.ch-link-btn {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--ch-ink);
  font-weight: 600;
  font-size: inherit;
  text-align: left;
  cursor: pointer;
}
.ch-link-btn:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ch-export-menu {
  position: relative;
}
.ch-export-menu > summary {
  list-style: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.ch-export-menu > summary::-webkit-details-marker {
  display: none;
}
.ch-export-pop {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 45;
  min-width: 176px;
  padding: 5px;
  border-radius: 9px;
  background: var(--ch-surface-elevated);
  border: 1px solid var(--ch-border-strong);
  box-shadow: var(--ch-shadow-pop);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ch-export-pop button {
  border: 0;
  background: transparent;
  color: var(--ch-ink);
  text-align: left;
  padding: 6px 9px;
  border-radius: 6px;
  font-size: 11.5px;
  white-space: nowrap;
}
.ch-export-pop button:hover {
  background: var(--ch-well);
}
.ch-note,
.ch-eyebrow,
.ch-count {
  color: var(--ch-muted);
  font-size: 11px;
  line-height: 1.48;
  overflow-wrap: anywhere;
}
.ch-count {
  font-family: var(--ch-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-scope {
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ch-muted);
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  border-radius: 99px;
  padding: 2px 8px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ch-card-rate {
  font-size: 11.5px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-card-rate b {
  color: var(--ch-ink);
  font-weight: 650;
}
.ch-card-meta {
  font-size: 11.5px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-dot-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ch-ink-2);
  padding: 1px 7px;
  border-radius: 99px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  white-space: nowrap;
  flex-shrink: 0;
}
.ch-dot-pill > i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-dot-pill > i.is-user {
  background: var(--ch-green);
}
.ch-dot-pill > i.is-assistant {
  background: var(--ch-blue);
}
.ch-dot-pill > i.is-tool {
  background: var(--ch-teal);
}
.ch-dot-pill > i.is-event {
  background: var(--ch-purple);
}
.ch-dot-pill.is-err {
  background: var(--ch-danger-soft);
  border-color: transparent;
  color: var(--ch-danger);
}
.ch-availability {
  padding: 8px 12px;
  background: var(--ch-warn-soft);
  color: var(--ch-amber);
  border-radius: 8px;
  font-size: 11.5px;
}
.ch-session-picker {
  position: relative;
  min-width: 0;
  max-width: 400px;
  flex: 0 1 340px;
}
.ch-session-picker > summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  min-height: 29px;
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  background: var(--ch-well);
  cursor: pointer;
  list-style: none;
  min-width: 0;
  transition: background 0.12s, border-color 0.12s;
}
.ch-session-picker > summary:hover {
  background: var(--ch-well-hover);
}
.ch-session-picker > summary::-webkit-details-marker {
  display: none;
}
.ch-session-picker > summary > strong {
  font-size: 12px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: var(--ch-ink);
}
.ch-session-picker > summary > small {
  color: var(--ch-muted);
  font-size: 10px;
  flex-shrink: 0;
}
.ch-session-picker-body {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: min(500px, 85cqi);
  z-index: 40;
  border: 1px solid var(--ch-border-strong);
  border-radius: 11px;
  background: var(--ch-surface-elevated);
  box-shadow: var(--ch-shadow-pop);
  padding: 10px;
}
.ch-picker-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.ch-search {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  padding: 4px 9px;
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
  font-size: 11.5px;
}
.ch-search:focus-within {
  border-color: var(--ch-accent);
  background: var(--ch-surface);
}
.ch-search input:focus-visible {
  outline: 0;
}
.ch-session-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 250px;
  overflow-y: auto;
  padding: 1px;
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
  gap: 8px;
  text-align: left;
  padding: 7px 9px;
  min-width: 0;
  min-height: 44px;
}
.ch-session:hover {
  background: var(--ch-well);
  border-color: var(--ch-border);
}
.ch-session.is-selected {
  border-color: transparent;
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
  font-weight: 550;
}
.ch-session-title small {
  display: block;
  font-size: 10px;
  font-weight: 400;
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
  padding-top: 7px;
  border-top: 1px solid var(--ch-border-fine);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-pagination small {
  color: var(--ch-muted);
  font-size: 10.5px;
}
.ch-pagination > div {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-family: var(--ch-mono);
}
.ch-inspector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  outline: none;
}
.ch-pair-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
}
.ch-card {
  padding: 10px 12px;
  border: 1px solid var(--ch-border);
  border-radius: 12px;
  min-width: 0;
  background: var(--ch-surface);
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ch-card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ch-border-fine);
}
.ch-card-heading h2 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--ch-ink);
}
.ch-data-note {
  font-size: 10.5px;
  color: var(--ch-muted-2);
  padding: 0 3px;
}
.ch-footer {
  border-top: 1px solid var(--ch-border-fine);
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--ch-muted-2);
  font-size: 10.5px;
  flex-wrap: wrap;
}
.ch-error {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px 11px;
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
  border-radius: 8px;
  font-size: 11px;
}
.ch-error span {
  overflow-wrap: anywhere;
}
.ch-skeleton {
  background: linear-gradient(100deg, var(--ch-well), var(--ch-surface), var(--ch-well));
  background-size: 200% 100%;
  animation: ch-shimmer 1.8s ease-in-out infinite;
  border-radius: 8px;
  min-height: 30px;
}
.ch-session-skeleton {
  height: 90px;
}
.ch-settings {
  padding: 20px;
  max-width: 70ch;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ch-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 56px 20px;
  gap: 10px;
  color: var(--ch-muted);
  text-align: center;
}
.ch-empty h2 {
  font-size: 15px;
  color: var(--ch-ink);
}
.ch-empty p {
  max-width: 44ch;
}
@keyframes ch-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@container (max-width:960px) {
  .ch-pair-grid {
    grid-template-columns: 1fr;
  }
}
@container (max-width:720px) {
  .ch-shell,
  .ch-embedded .ch-shell {
    padding: 8px;
  }
  .ch-page-heading {
    padding: 8px 9px;
    gap: 7px;
  }
  .ch-divider-v,
  .ch-status {
    display: none;
  }
  .ch-heading-left {
    flex: 1 1 100%;
  }
  .ch-session-picker {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .ch-session-picker-body {
    position: static;
    width: 100%;
    margin-top: 6px;
    box-shadow: none;
  }
  .ch-export-pop {
    left: 0;
    right: auto;
  }
  .ch-button,
  .ch-mini-button,
  .ch-market-language-select,
  .ch-session-picker > summary {
    min-height: 34px;
  }
}
@container (max-width:480px) {
  .ch-session-picker > summary > .ch-meta-tag.is-muted {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ch-context * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;var or=`.ch-core-wells {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}
.ch-well {
  background: var(--ch-well);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 7px 10px;
  min-height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  transition: background-color 0.14s, border-color 0.14s;
  min-width: 0;
}
.ch-well:hover {
  background: var(--ch-well-hover);
  border-color: var(--ch-border-strong);
}
.ch-well b {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
  color: var(--ch-ink);
}
.ch-well span {
  font-size: 11px;
  color: var(--ch-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-well-teal b {
  color: color-mix(in srgb, var(--ch-teal) 72%, var(--ch-ink));
}
.ch-well-blue b {
  color: color-mix(in srgb, var(--ch-blue) 70%, var(--ch-ink));
}
.ch-well-purple b {
  color: color-mix(in srgb, var(--ch-purple) 72%, var(--ch-ink));
}
.ch-well-green b {
  color: color-mix(in srgb, var(--ch-green) 72%, var(--ch-ink));
}
.ch-well-events {
  grid-column: span 2;
  cursor: default;
}
.ch-well-events:hover {
  background: var(--ch-well);
  border-color: transparent;
}
.ch-well-ev-head {
  font-size: 11px;
  color: var(--ch-muted);
  margin-bottom: 3px;
}
.ch-well-ev-list {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 3px 9px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ch-ev-chip {
  border: 0;
  background: transparent;
  padding: 1px 5px;
  margin: -1px -5px;
  border-radius: 5px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ch-ev-chip:hover {
  background: var(--ch-well-hover);
}
.ch-ev-chip b {
  font-size: inherit;
  color: inherit;
}
.ch-ev-chip.is-ok {
  color: var(--ch-green);
}
.ch-ev-chip.is-err {
  color: var(--ch-danger);
}
.ch-ev-chip.is-ev {
  color: var(--ch-purple);
}
.ch-ev-chip.is-dim {
  opacity: 0.45;
}
.ch-ev-sep {
  color: var(--ch-muted-2);
  font-weight: 400;
  opacity: 0.55;
}
.ch-ledger {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 26px;
}
.ch-ledger-group {
  min-width: 0;
}
.ch-ledger-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 5px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--ch-border-fine);
}
.ch-ledger-head span {
  font-size: 12px;
  font-weight: 600;
  color: var(--ch-ink);
}
.ch-ledger-head b {
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ch-ink);
}
.ch-ledger-head b small {
  font-weight: 400;
  color: var(--ch-muted-2);
  margin: 0 3px;
}
.ch-ledger-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: center;
}
.ch-l-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px;
  margin: -2px -4px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--ch-muted);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  max-width: 100%;
}
.ch-l-chip:hover {
  background: var(--ch-well);
  color: var(--ch-ink);
}
.ch-l-chip i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}
.ch-l-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}
.ch-l-chip b {
  color: var(--ch-ink);
  font-weight: 700;
}
.ch-l-chip.is-dim {
  opacity: 0.48;
}
.ch-rel-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ch-rel-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 11.5px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-rel-line b {
  color: var(--ch-ink);
  font-weight: 600;
}
.ch-ctx-hero {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-ctx-hero-left,
.ch-ctx-hero-right {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.ch-ctx-hero-left b,
.ch-occupancy-number strong {
  font-size: 21px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
  color: var(--ch-ink);
}
.ch-ctx-hero-left span,
.ch-ctx-hero-right span {
  font-size: 12px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-context-card.is-warn .ch-occupancy-number strong {
  color: var(--ch-amber);
}
.ch-context-card.is-danger .ch-occupancy-number strong {
  color: var(--ch-danger);
}
.ch-gauge-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ch-capacity-bar {
  position: relative;
  height: 11px;
  background: var(--ch-track);
  border-radius: 5px;
  overflow: hidden;
}
.ch-capacity-bar > span {
  position: relative;
  z-index: 2;
  height: 100%;
  display: block;
  background: var(--ch-blue);
  border-radius: 5px 0 0 5px;
  transition: width 0.25s ease;
}
.ch-capacity-bar.is-high > span {
  background: var(--ch-amber);
}
.ch-capacity-bar.is-danger > span {
  background: var(--ch-danger);
}
.ch-reserve-zone {
  position: absolute;
  left: 75%;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    45deg,
    color-mix(in srgb, var(--ch-amber) 24%, transparent) 0 5px,
    transparent 5px 10px
  );
  border-left: 1.5px solid color-mix(in srgb, var(--ch-amber) 72%, transparent);
}
.ch-ctx-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
.ch-ctx-leg {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.ch-ctx-leg i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}
.ch-ctx-leg i.is-used {
  background: var(--ch-blue);
}
.ch-context-card.is-warn .ch-ctx-leg i.is-used {
  background: var(--ch-amber);
}
.ch-context-card.is-danger .ch-ctx-leg i.is-used {
  background: var(--ch-danger);
}
.ch-ctx-leg i.is-rem {
  background: var(--ch-track);
}
.ch-ctx-leg i.is-cap {
  background: transparent;
  border: 1.5px solid var(--ch-muted);
}
.ch-ctx-leg i.is-hatch {
  background: repeating-linear-gradient(
    45deg,
    color-mix(in srgb, var(--ch-amber) 55%, transparent) 0 2px,
    transparent 2px 4px
  );
  border: 1px solid color-mix(in srgb, var(--ch-amber) 60%, transparent);
}
.ch-ctx-leg b {
  font-weight: 600;
  color: var(--ch-ink);
}
.ch-ctx-leg em {
  font-style: normal;
  color: var(--ch-muted);
}
.ch-spark-box {
  background: var(--ch-well);
  border-radius: 8px;
  padding: 7px 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ch-spark-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-spark-head strong {
  color: var(--ch-ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ch-spark-svg {
  width: 100%;
  height: 44px;
  display: block;
  overflow: visible;
}
.ch-chart-grid {
  stroke: var(--ch-grid-line);
  stroke-width: 1;
  stroke-dasharray: 2 4;
  fill: none;
}
.ch-spark-area {
  fill: var(--ch-accent-soft);
}
.ch-spark-box.is-warn .ch-spark-area {
  fill: var(--ch-warn-soft);
}
.ch-spark-box.is-danger .ch-spark-area {
  fill: var(--ch-danger-soft);
}
.ch-chart-line {
  stroke: var(--ch-blue);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
.ch-spark-box.is-warn .ch-chart-line {
  stroke: var(--ch-amber);
}
.ch-spark-box.is-danger .ch-chart-line {
  stroke: var(--ch-danger);
}
.ch-chart-dot {
  fill: var(--ch-surface);
  stroke: var(--ch-blue);
  stroke-width: 1.6;
}
.ch-chart-dot.is-latest {
  fill: var(--ch-blue);
}
.ch-spark-box.is-warn .ch-chart-dot {
  stroke: var(--ch-amber);
}
.ch-spark-box.is-warn .ch-chart-dot.is-latest {
  fill: var(--ch-amber);
}
.ch-spark-box.is-danger .ch-chart-dot {
  stroke: var(--ch-danger);
}
.ch-spark-box.is-danger .ch-chart-dot.is-latest {
  fill: var(--ch-danger);
}
.ch-token-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-height: 96px;
}
.ch-token-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ch-sl-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 16px;
  min-width: 0;
}
.ch-sl-item {
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 3px 6px;
  margin: -3px -6px;
  border-radius: 6px;
  text-align: left;
  min-width: 0;
  transition: background-color 0.14s;
}
.ch-sl-item:hover:not(.is-static),
.ch-sl-item.is-hi {
  background: var(--ch-well);
}
.ch-sl-top {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.ch-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
.ch-sl-label {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--ch-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-sl-pct {
  font-size: 12px;
  font-weight: 700;
  color: var(--ch-ink);
  font-variant-numeric: tabular-nums;
  flex: none;
}
.ch-sl-sub {
  margin-left: 14px;
  font-size: 11px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}
.ch-metric dt {
  font-size: 10.5px;
  color: var(--ch-muted);
  overflow-wrap: anywhere;
}
.ch-metric dd {
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.ch-context .ch-independent-cache {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--ch-border-fine);
}
.ch-independent-cache .ch-metric dd {
  font-size: 13px;
}
.ch-token-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  border-top: 1px solid var(--ch-border-fine);
  padding-top: 8px;
  font-size: 11.5px;
  color: var(--ch-muted);
  flex-wrap: wrap;
  font-variant-numeric: tabular-nums;
}
.ch-token-footer b {
  color: var(--ch-ink);
  font-weight: 650;
}
.ch-foot-sub {
  font-size: 10.5px;
  color: var(--ch-muted-2);
}
.ch-token-foot-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-performance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.ch-performance:has(> .ch-metric:nth-child(4)) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.ch-performance .ch-metric {
  background: var(--ch-well);
  border-radius: 8px;
  padding: 7px 9px;
}
.ch-cache-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ch-cache-row {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
}
.ch-cache-row > span {
  color: var(--ch-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-cache-row > b {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 650;
  color: var(--ch-ink);
}
.ch-cache-track {
  height: 6px;
  background: var(--ch-track);
  border-radius: 99px;
  overflow: hidden;
}
.ch-cache-track i {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: var(--ch-teal);
}
.ch-cache-track i.is-blue {
  background: var(--ch-blue);
}
.ch-tstrip {
  margin-top: auto;
}
.ch-tstrip-head {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--ch-muted-2);
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
}
.ch-tstrip-bar {
  display: flex;
  height: 11px;
  border-radius: 4px;
  overflow: hidden;
  gap: 1px;
  background: var(--ch-track);
}
.ch-tstrip-bar.is-dense {
  gap: 0;
}
.ch-tstrip-empty {
  flex: 1;
}
.ch-tstrip-seg {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0;
  transition: opacity 0.14s;
}
.ch-tstrip-seg:hover {
  opacity: 0.72;
}
.ch-tstrip-axis {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--ch-muted-2);
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}
.ch-context .lc-donut {
  position: relative;
  flex-shrink: 0;
}
.ch-context .lc-donut circle {
  fill: none;
  stroke-width: 3.6;
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
  gap: 1px;
}
.ch-context .lc-donut-center b {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ch-context .lc-donut-center span {
  color: var(--ch-muted);
  max-width: 74px;
  line-height: 1.2;
}
.ch-context .lc-donut-seg {
  transition: stroke 0.15s, opacity 0.15s;
}
.ch-context .lc-donut-dim .lc-donut-seg {
  opacity: 0.25;
}
.ch-context .lc-donut-dim .lc-donut-seg-on {
  opacity: 1;
}
@container (max-width:720px) {
  .ch-core-wells { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ch-well-events { grid-column: 1 / -1; }
  .ch-ledger { grid-template-columns: 1fr; }
  .ch-performance { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (max-width:440px) {
  .ch-token-layout { flex-direction: column; align-items: stretch; }
  .ch-context .lc-donut { margin-inline: auto; }
  .ch-sl-grid { grid-template-columns: 1fr; }
  .ch-cache-row { grid-template-columns: 92px minmax(0, 1fr) 40px; }
}
`;var ir=`.ch-overview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ch-overview-intro {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 2px 2px 0;
}
.ch-overview-intro h2 {
  font-size: 15px;
  font-weight: 650;
}
.ch-overview-intro p {
  font-size: 11.5px;
  color: var(--ch-muted);
}
.ch-ov-top {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 10px;
}
.ch-ov-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.ch-ov-kpi {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  box-shadow: var(--ch-shadow-tile), var(--ch-inset-top);
  padding: 11px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 3px;
  min-width: 0;
}
.ch-ov-kpi small {
  font-size: 11px;
  font-weight: 600;
  color: var(--ch-muted);
}
.ch-ov-kpi strong {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
}
.ch-ov-kpi strong.is-danger {
  color: var(--ch-danger);
}
.ch-ov-kpi strong.is-warn {
  color: var(--ch-amber);
}
.ch-ov-sub {
  font-size: 10.5px;
  color: var(--ch-muted-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.ch-ov-bars-card {
  display: flex;
  flex-direction: column;
}
.ch-ov-empty-center {
  margin: auto 0;
  text-align: center;
  padding: 16px 0;
}
.ch-ov-bars-plot {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 118px;
  padding: 16px 6px 2px;
  border-bottom: 1px solid var(--ch-border-fine);
}
.ch-ov-bcol {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
.ch-ov-bcol:hover .ch-ov-blbl {
  color: var(--ch-ink);
}
.ch-ov-bpair {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 82px;
}
.ch-ov-bar {
  width: 11px;
  border-radius: 3px 3px 0 0;
  position: relative;
}
.ch-ov-bar.is-tok {
  background: color-mix(in srgb, var(--ch-blue) 76%, transparent);
}
.ch-ov-bar.is-ok {
  background: color-mix(in srgb, var(--ch-green) 76%, transparent);
}
.ch-ov-bar.is-warn {
  background: color-mix(in srgb, var(--ch-amber) 82%, transparent);
}
.ch-ov-bar.is-danger {
  background: color-mix(in srgb, var(--ch-danger) 82%, transparent);
}
.ch-ov-bar > span {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9.5px;
  color: var(--ch-muted);
  white-space: nowrap;
  margin-bottom: 2px;
  font-variant-numeric: tabular-nums;
}
.ch-ov-blbl {
  font-size: 10px;
  color: var(--ch-muted);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-ov-bars-key {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-ov-bars-key span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.ch-ov-bars-key i {
  width: 9px;
  height: 7px;
  border-radius: 2px;
}
.ch-ov-mid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1.1fr) minmax(0, 0.9fr) minmax(0, 0.9fr);
  gap: 10px;
}
.ch-heat-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  margin-bottom: auto;
}
.ch-heat-cols {
  display: flex;
  justify-content: center;
  gap: 3px;
}
.ch-heat-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}
.ch-heat-mon {
  font-size: 9.5px;
  color: var(--ch-muted-2);
  height: 13px;
  line-height: 13px;
}
.ch-heat-cell {
  width: 14px;
  height: 14px;
  border: 0;
  padding: 0;
  border-radius: 3px;
  display: block;
}
.ch-heat-cell.is-future {
  background: transparent;
}
.ch-heat-cell.is-lv0 {
  background: color-mix(in srgb, var(--ch-muted) 16%, transparent);
}
.ch-heat-cell.is-lv1 {
  background: color-mix(in srgb, var(--ch-blue) 30%, transparent);
}
.ch-heat-cell.is-lv2 {
  background: color-mix(in srgb, var(--ch-blue) 52%, transparent);
}
.ch-heat-cell.is-lv3 {
  background: color-mix(in srgb, var(--ch-blue) 74%, transparent);
}
.ch-heat-cell.is-lv4 {
  background: color-mix(in srgb, var(--ch-blue) 94%, transparent);
}
.ch-heat-cell.is-on {
  box-shadow: 0 0 0 1.5px var(--ch-ink);
}
.ch-heat-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  font-size: 10px;
  color: var(--ch-muted-2);
}
.ch-heat-legend .ch-heat-cell {
  width: 10px;
  height: 10px;
}
.ch-compare-scroll {
  overflow-x: auto;
}
.ch-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
.ch-compare-table th,
.ch-compare-table td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--ch-border-fine);
  text-align: left;
  white-space: nowrap;
}
.ch-compare-table td:first-child,
.ch-compare-table th:first-child {
  color: var(--ch-muted);
  font-weight: 600;
  width: 130px;
}
.ch-compare-th {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  max-width: 240px;
}
.ch-compare-th .ch-link-btn {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-ov-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-ov-gallery-title {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.ch-ov-gallery-title h2 {
  font-size: 13px;
  font-weight: 600;
}
.ch-ov-day-chip {
  border: 1px solid color-mix(in srgb, var(--ch-blue) 45%, transparent);
  background: color-mix(in srgb, var(--ch-blue) 10%, transparent);
  color: var(--ch-blue);
  border-radius: 99px;
  padding: 1px 9px;
  font-size: 11px;
  font-weight: 600;
}
.ch-ov-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-ov-filter-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-ov-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  border: 1px solid var(--ch-border-strong);
  background: transparent;
  color: var(--ch-muted);
  border-radius: 99px;
  padding: 2px 10px;
  font-size: 11px;
  white-space: nowrap;
}
.ch-ov-chip:hover {
  background: var(--ch-well);
  color: var(--ch-ink);
}
.ch-ov-chip.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
  font-weight: 600;
}
.ch-ov-chip span {
  font-size: 10px;
  opacity: 0.72;
  font-variant-numeric: tabular-nums;
}
.ch-ov-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.ch-ov-skeleton {
  height: 152px;
}
.ch-overview-card {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 12px;
  box-shadow: var(--ch-shadow-tile), var(--ch-inset-top);
  padding: 11px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  transition: border-color 0.14s, box-shadow 0.14s;
}
.ch-overview-card:hover {
  border-color: var(--ch-border-strong);
}
.ch-overview-card.is-selected {
  border-color: color-mix(in srgb, var(--ch-blue) 60%, var(--ch-border));
}
.ch-overview-card.is-compared {
  box-shadow: 0 0 0 1.5px var(--ch-blue);
}
.ch-ov-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.ch-ov-card-title-btn {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  flex: 1;
  min-width: 0;
}
.ch-ov-card-title-btn strong {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ch-ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}
.ch-ov-card-title-btn:hover strong {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ch-ov-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex: none;
}
.ch-ov-card-date {
  font-size: 10px;
  color: var(--ch-muted-2);
  font-variant-numeric: tabular-nums;
}
.ch-compare-pin {
  border: 1px solid var(--ch-border-strong);
  background: transparent;
  color: var(--ch-muted);
  border-radius: 99px;
  padding: 1px 7px;
  font-size: 10px;
  font-weight: 500;
}
.ch-compare-pin:hover {
  background: var(--ch-well);
  color: var(--ch-ink);
}
.ch-compare-pin.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
}
.ch-ov-card-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.ch-ov-card-body {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-width: 0;
}
.ch-mini-ring {
  position: relative;
  width: 60px;
  height: 60px;
  flex: none;
  display: grid;
  place-items: center;
}
.ch-mini-ring svg {
  width: 60px;
  height: 60px;
  transform: rotate(-90deg);
}
.ch-mini-ring-track {
  fill: none;
  stroke: var(--ch-track);
  stroke-width: 5.5;
}
.ch-mini-ring-fill {
  fill: none;
  stroke: var(--ch-blue);
  stroke-width: 5.5;
  stroke-linecap: round;
}
.ch-mini-ring.is-warn .ch-mini-ring-fill {
  stroke: var(--ch-amber);
}
.ch-mini-ring.is-danger .ch-mini-ring-fill {
  stroke: var(--ch-danger);
}
.ch-mini-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}
.ch-mini-ring-center b {
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ch-ink);
}
.ch-mini-ring-center span {
  font-size: 9px;
  color: var(--ch-muted);
}
.ch-ov-kv {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ch-ov-kv-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ch-ov-kv-row span {
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-ov-kv-row b {
  font-weight: 600;
  color: var(--ch-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@container (max-width:1120px) {
  .ch-ov-top { grid-template-columns: 1fr; }
  .ch-ov-mid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ch-ov-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (max-width:720px) {
  .ch-ov-mid, .ch-ov-grid { grid-template-columns: 1fr; }
  .ch-ov-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;var cr=`.ch-workbench {
  display: grid;
  grid-template-columns: minmax(0, 47fr) minmax(0, 53fr);
  gap: 10px;
  align-items: stretch;
}
.ch-workbench-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.ch-activity-chart {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 8px;
  background: var(--ch-well);
  border-radius: 8px;
  padding: 8px 9px 6px;
}
.ch-lane-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0 8px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ch-muted);
}
.ch-lane-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.ch-lane-label > i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ch-activity-plot {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.ch-turn-axis {
  position: relative;
  height: 15px;
  overflow: hidden;
}
.ch-turn-tag {
  position: absolute;
  top: 0;
  transform: translateX(4px);
  font-family: var(--ch-mono);
  font-size: 9.5px;
  line-height: 1.3;
  color: var(--ch-muted);
  font-weight: 600;
  white-space: nowrap;
}
.ch-activity-chart svg {
  width: 100%;
  height: 112px;
  display: block;
  cursor: crosshair;
  user-select: none;
}
.ch-turn-band {
  fill: var(--ch-turn-band);
}
.ch-turn-divider {
  stroke: var(--ch-border-strong);
  stroke-dasharray: 2 3;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.ch-lane-line {
  stroke: var(--ch-grid-line);
  stroke-dasharray: 2 4;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.ch-tool-bridge {
  stroke: var(--ch-teal);
  stroke-width: 2;
  opacity: 0.5;
  vector-effect: non-scaling-stroke;
}
.ch-tool-bridge.is-error {
  stroke: var(--ch-danger);
  opacity: 0.72;
}
.ch-timeline-cursor {
  stroke: var(--ch-muted);
  stroke-width: 1.2;
  stroke-dasharray: 3 3;
  vector-effect: non-scaling-stroke;
}
.ch-turn-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-left: 52px;
  min-width: 0;
}
.ch-turn-pill {
  height: 16px;
  min-width: 16px;
  border-radius: 4px;
  border: 1px solid var(--ch-border-fine);
  background: var(--ch-well);
  color: var(--ch-muted);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  padding: 0 3px;
}
.ch-turn-pill:hover {
  background: var(--ch-well-hover);
  color: var(--ch-ink);
}
.ch-turn-pill.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
}
.ch-scrubber-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ch-sequence-slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  min-width: 0;
  height: 4px;
  border-radius: 99px;
  cursor: pointer;
  outline: none;
}
.ch-sequence-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--ch-surface-elevated);
  border: 2px solid var(--ch-accent);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22);
}
.ch-sequence-slider::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--ch-surface-elevated);
  border: 2px solid var(--ch-accent);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22);
}
.ch-scrubber-pos {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-sequence-preview {
  border-top: 1px solid var(--ch-border-fine);
  border-left: 2.5px solid var(--ch-blue);
  padding: 8px 0 2px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.ch-step-brief-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-step-brief-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  min-width: 0;
  flex-wrap: wrap;
}
.ch-sb-turn {
  font-size: 12px;
  font-weight: 650;
  color: var(--ch-ink);
}
.ch-step-brief-meta > b {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--ch-well);
  color: var(--ch-ink-2);
}
.ch-sb-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ch-step-brief-time {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-sb-rows {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ch-sb-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 3px 6px;
  margin: 0 -6px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  width: calc(100% + 12px);
  text-align: left;
  min-width: 0;
}
.ch-sb-row:hover {
  background: var(--ch-well);
}
.ch-sb-tag {
  flex: none;
  min-width: 50px;
  text-align: center;
  font-size: 10.5px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  color: var(--ch-muted);
}
.ch-sb-chip {
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 1px 7px;
  border-radius: 5px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
}
.ch-sb-chip-tool {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  color: var(--ch-muted);
  flex: none;
}
.ch-sb-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11.5px;
  color: var(--ch-ink);
}
.ch-pair-jump {
  border: 1px solid var(--ch-border-strong);
  background: var(--ch-surface);
  padding: 2px 7px;
  min-height: 22px;
  font-size: 10px;
}
.ch-browser-card {
  display: flex;
  flex-direction: column;
}
.ch-br-head-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ch-map-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 26px;
  padding: 0;
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  background: var(--ch-well);
  color: var(--ch-muted);
}
.ch-map-btn:hover {
  color: var(--ch-ink);
  background: var(--ch-well-hover);
}
.ch-map-btn.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
}
.ch-br-summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-br-summary b {
  font-size: 12px;
  color: var(--ch-ink);
}
.ch-br-summary span {
  font-size: 11px;
  color: var(--ch-muted);
}
.ch-br-propbar {
  display: flex;
  height: 7px;
  border-radius: 99px;
  overflow: hidden;
  background: var(--ch-track);
}
.ch-treemap-panel {
  border: 1px solid var(--ch-border-fine);
  border-radius: 9px;
  background: var(--ch-sub);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ch-treemap-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 11.5px;
}
.ch-treemap-head span {
  font-family: var(--ch-mono);
  color: var(--ch-muted);
}
.ch-treemap-stage {
  position: relative;
  height: 196px;
  width: 100%;
}
.ch-map-cat {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--ch-map-c) 52%, transparent);
  background: color-mix(in srgb, var(--ch-map-c) 7%, transparent);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ch-map-user {
  --ch-map-c: var(--ch-green);
}
.ch-map-assistant {
  --ch-map-c: var(--ch-blue);
}
.ch-map-tool {
  --ch-map-c: var(--ch-teal);
}
.ch-map-event {
  --ch-map-c: var(--ch-purple);
}
.ch-map-cat-head {
  width: 100%;
  border: 0;
  height: 16px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  font-size: 9.5px;
  font-weight: 600;
  background: color-mix(in srgb, var(--ch-map-c) 16%, transparent);
  color: var(--ch-ink);
  flex: none;
  text-align: left;
}
.ch-map-cat-head span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-map-cat-body {
  position: relative;
  flex: 1;
  min-height: 0;
}
.ch-map-block {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--ch-map-c) 45%, transparent);
  background: color-mix(in srgb, var(--ch-map-c) 22%, transparent);
  color: var(--ch-ink);
  padding: 1px 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  font-size: 10px;
}
.ch-map-block:hover,
.ch-map-block.is-selected {
  background: color-mix(in srgb, var(--ch-map-c) 48%, transparent);
}
.ch-map-block.is-err {
  border-color: var(--ch-danger);
}
.ch-map-lbl {
  font-weight: 600;
  line-height: 1.1;
}
.ch-map-num {
  font-size: 9px;
  color: var(--ch-muted);
  line-height: 1.1;
}
.ch-browser-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}
.ch-filter {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.ch-filter > button {
  padding: 3px 8px;
  border: 1px solid var(--ch-border-fine);
  border-radius: 6px;
  background: transparent;
  color: var(--ch-muted);
  font-size: 11px;
  font-weight: 500;
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.ch-filter > button:hover {
  background: var(--ch-well);
  color: var(--ch-ink);
}
.ch-filter > button.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  border-color: transparent;
  font-weight: 600;
}
.ch-filter-count {
  font-family: var(--ch-mono);
  font-size: 10px;
  opacity: 0.72;
}
.ch-chip-group {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.ch-chip {
  border: 1px solid var(--ch-border-strong);
  background: transparent;
  color: var(--ch-muted);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 550;
  white-space: nowrap;
  flex-shrink: 0;
}
.ch-chip:hover {
  color: var(--ch-ink);
  background: var(--ch-well);
}
.ch-chip.is-active {
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
  border-color: transparent;
  font-weight: 600;
}
.ch-browser-search {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  padding: 2px 8px 2px 9px;
}
.ch-browser-search:focus-within {
  border-color: var(--ch-accent);
  background: var(--ch-surface);
}
.ch-browser-search svg {
  color: var(--ch-muted);
  flex-shrink: 0;
}
.ch-browser-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 4px 0;
  color: var(--ch-ink);
  font-size: 11.5px;
}
.ch-browser-search input:focus-visible {
  outline: 0;
}
.ch-browser-search > span {
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
  flex-shrink: 0;
}
.ch-browser-records {
  flex: 1 1 auto;
  min-height: 220px;
  max-height: 620px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ch-browser-records > .ch-note {
  padding: 16px 8px;
  text-align: center;
}
.ch-record-group {
  border: 1px solid var(--ch-border-fine);
  border-radius: 9px;
  background: var(--ch-sub);
  overflow: hidden;
  --ch-cat-hue: var(--ch-blue);
}
.ch-group-user {
  --ch-cat-hue: var(--ch-green);
}
.ch-group-assistant {
  --ch-cat-hue: var(--ch-blue);
}
.ch-group-tool {
  --ch-cat-hue: var(--ch-teal);
}
.ch-group-event {
  --ch-cat-hue: var(--ch-purple);
}
.ch-group-heading {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 31px;
  border: 0;
  background: linear-gradient(
      118deg,
      color-mix(in srgb, var(--ch-cat-hue) 9%, transparent),
      transparent 52%,
      color-mix(in srgb, var(--ch-cat-hue) 10%, transparent)
    ),
    transparent;
  padding: 6px 10px;
  text-align: left;
  color: var(--ch-ink);
  font-size: 12px;
}
.ch-group-heading:hover:not(:disabled) {
  background-color: var(--ch-well);
}
.ch-br-chev {
  width: 12px;
  flex: none;
  color: var(--ch-muted-2);
  font-size: 10px;
  text-align: center;
}
.ch-cat-sq {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex: none;
}
.ch-group-heading > b {
  font-weight: 600;
  white-space: nowrap;
}
.ch-group-cnt {
  flex: 1;
  font-size: 11px;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-group-pct {
  font-size: 11px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-group-body {
  border-top: 1px solid var(--ch-border-fine);
  padding: 4px 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--ch-surface);
}
.ch-br-elem {
  border-radius: 7px;
  overflow: hidden;
}
.ch-br-elem:nth-child(even):not(.is-selected) {
  background: var(--ch-stripe);
}
.ch-br-elem.is-selected {
  background: var(--ch-well);
}
.ch-record-item {
  border: 0;
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 7px;
  min-height: 30px;
  width: 100%;
  min-width: 0;
  text-align: left;
  font-size: 11.5px;
}
.ch-record-item:hover {
  background: var(--ch-well-hover);
}
.ch-br-err-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ch-danger);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ch-danger) 18%, transparent);
  flex: none;
}
.ch-br-tag {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  border-radius: 4px;
  padding: 0 6px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.ch-br-tag.is-role i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.ch-record-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-record-time {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted-2);
  flex: none;
}
.ch-record-seq {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted-2);
  min-width: 24px;
  text-align: right;
  flex: none;
}
.ch-record-badge {
  font-family: var(--ch-mono);
  font-size: 9.5px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  color: var(--ch-muted);
  flex: none;
}
.ch-error-badge {
  background: var(--ch-danger-soft);
  border-color: transparent;
  color: var(--ch-danger);
  font-weight: 700;
}
.ch-br-inline {
  padding: 2px 7px 8px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ch-record-meta {
  display: flex;
  align-items: center;
  gap: 6px 10px;
  flex-wrap: wrap;
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-record-notice {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  border-radius: 6px;
  padding: 5px 9px;
}
.ch-record-notice.is-error {
  background: var(--ch-danger-soft);
  border-color: transparent;
  color: var(--ch-danger);
}
.ch-ts-card {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  border-radius: 7px;
  overflow: hidden;
  min-width: 0;
}
.ch-ts-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 9px;
  border-bottom: 1px solid var(--ch-border-fine);
  font-size: 11px;
  font-weight: 600;
  color: var(--ch-ink);
  flex-wrap: wrap;
}
.ch-ts-call-name {
  font-family: var(--ch-mono);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-ts-right {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ch-ts-meta {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-call-state {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--ch-mono);
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 99px;
}
.ch-call-state i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.ch-call-state.is-ok {
  color: var(--ch-green);
  background: var(--ch-ok-soft);
}
.ch-call-state.is-err {
  color: var(--ch-danger);
  background: var(--ch-danger-soft);
}
.ch-ts-arg-row {
  display: grid;
  grid-template-columns: minmax(74px, 96px) minmax(0, 1fr);
  gap: 10px;
  padding: 5px 9px;
  border-top: 1px solid var(--ch-border-fine);
  font-size: 11.5px;
}
.ch-ts-arg-row:first-child {
  border-top: 0;
}
.ch-ts-arg-key {
  font-weight: 600;
  color: var(--ch-ink);
  overflow-wrap: anywhere;
}
.ch-ts-arg-val {
  font-family: var(--ch-mono);
  color: var(--ch-ink);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 160px;
  overflow-y: auto;
}
.ch-find-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-bottom: 1px solid var(--ch-border-fine);
  background: var(--ch-sub);
}
.ch-find-bar input {
  flex: 1;
  min-width: 80px;
  border: 1px solid var(--ch-border-strong);
  background: var(--ch-surface);
  border-radius: 5px;
  padding: 3px 7px;
  font-size: 11.5px;
  outline: none;
}
.ch-find-bar input:focus {
  border-color: var(--ch-accent);
}
.ch-find-count {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
  white-space: nowrap;
}
.ch-find-mark {
  background: #fde047;
  color: #111;
  border-radius: 2px;
  padding: 0 1px;
}
.ch-find-mark.is-current {
  background: #fb923c;
  color: #111;
}
.ch-record-content {
  padding: 8px 10px;
  max-height: 290px;
  overflow-y: auto;
  overflow-x: auto;
}
.ch-source-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--ch-mono);
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--ch-ink);
}
.ch-record-navigation,
.ch-browser-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-record-navigation > div,
.ch-browser-footer > div {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-browser-footer {
  border-top: 1px solid var(--ch-border-fine);
  padding-top: 8px;
}
@container (max-width:980px) {
  .ch-workbench { grid-template-columns: 1fr; }
}
@container (max-width:600px) {
  .ch-activity-chart { grid-template-columns: 38px minmax(0, 1fr); gap: 5px; padding: 7px 6px; }
  .ch-turn-strip { margin-left: 43px; }
  .ch-br-inline { padding-left: 8px; }
  .ch-ts-arg-row { grid-template-columns: 1fr; gap: 2px; }
}
`;var lr=`.ch-fa-head-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-fa-filter button.is-all.is-active,
.ch-cmd-filter button.is-all.is-active {
  background: var(--ch-blue);
  color: #fff;
}
.ch-fa-filter button.is-read {
  color: var(--ch-blue);
}
.ch-fa-filter button.is-read.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-blue);
}
.ch-fa-filter button.is-write {
  color: var(--ch-green);
}
.ch-fa-filter button.is-write.is-active,
.ch-cmd-filter button.is-ok.is-active {
  background: var(--ch-ok-soft);
  color: var(--ch-green);
}
.ch-fa-filter button.is-search {
  color: var(--ch-amber);
}
.ch-fa-filter button.is-search.is-active {
  background: var(--ch-warn-soft);
  color: var(--ch-amber);
}
.ch-cmd-filter button.is-err {
  color: var(--ch-danger);
}
.ch-cmd-filter button.is-err.is-active {
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
}
.ch-cmd-filter button.is-ok {
  color: var(--ch-green);
}
.ch-fa-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-mini-input {
  background: var(--ch-well);
  border: 1px solid var(--ch-border-strong);
  border-radius: 7px;
  padding: 4px 9px;
  font-size: 11.5px;
  width: 180px;
  min-width: 0;
  outline: none;
}
.ch-mini-input:focus {
  border-color: var(--ch-accent);
  background: var(--ch-surface);
}
.ch-flex-input {
  flex: 1 1 160px;
  width: auto;
}
.ch-file-list,
.ch-command-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
  min-width: 0;
}
.ch-file-item,
.ch-command-row {
  border: 1px solid transparent;
  border-radius: 7px;
  min-width: 0;
}
.ch-file-item:nth-child(even):not(.is-open),
.ch-command-row:nth-child(even):not(.is-open) {
  background: var(--ch-stripe);
}
.ch-file-item.is-open,
.ch-command-row.is-open {
  border-color: var(--ch-border-strong);
  background: var(--ch-sub);
}
.ch-command-row.is-error {
  background: color-mix(in srgb, var(--ch-danger-soft) 45%, transparent);
}
.ch-file-row-wrap,
.ch-command-line {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 4px;
  padding-right: 6px;
}
.ch-file-expand {
  border: 0;
  background: transparent;
  color: var(--ch-muted-2);
  width: 24px;
  min-height: 29px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 10px;
}
.ch-file-expand:hover {
  color: var(--ch-ink);
}
.ch-file-row {
  border: 0;
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 4px;
  min-width: 0;
  flex: 1;
  text-align: left;
  border-radius: 6px;
}
.ch-file-row:hover,
.ch-command-main:hover {
  background: var(--ch-well);
}
.ch-file-left {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.ch-file-right {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.ch-ext-badge {
  font-family: var(--ch-mono);
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  min-width: 28px;
  text-align: center;
  flex-shrink: 0;
  color: #fff;
  background: #636366;
}
.ch-ext-badge.is-ts {
  background: #3178c6;
}
.ch-ext-badge.is-tsx {
  background: #4f46e5;
}
.ch-ext-badge.is-js {
  background: #b45309;
}
.ch-ext-badge.is-css {
  background: #7c3aed;
}
.ch-ext-badge.is-json {
  background: #a16207;
}
.ch-ext-badge.is-md {
  background: #0d9488;
}
.ch-file-path {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-file-dir {
  color: var(--ch-muted);
}
.ch-file-path strong {
  color: var(--ch-ink);
  font-weight: 600;
}
.ch-op-badges {
  display: inline-flex;
  gap: 4px;
  flex-shrink: 0;
}
.ch-op-tag {
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 7px;
  border-radius: 99px;
}
.ch-op-tag > em {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.ch-op-tag.is-r {
  color: var(--ch-ink);
  background: var(--ch-well);
}
.ch-op-tag.is-w {
  color: var(--ch-green);
  background: var(--ch-ok-soft);
}
.ch-op-tag.is-s {
  color: var(--ch-amber);
  background: var(--ch-warn-soft);
}
.ch-fa-time,
.ch-cmd-time {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  color: var(--ch-muted-2);
  white-space: nowrap;
  flex: none;
}
.ch-file-ops {
  margin: 0 8px 8px 18px;
  padding: 2px 0 2px 10px;
  border-left: 2px solid var(--ch-border-strong);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ch-fa-op {
  border: 0;
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 11px;
  text-align: left;
}
.ch-fa-op:hover {
  background: var(--ch-well);
}
.ch-fa-op-tool {
  font-family: var(--ch-mono);
  font-size: 10.5px;
  padding: 0 6px;
  border-radius: 99px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border-fine);
  color: var(--ch-muted);
}
.ch-fa-op-seq {
  flex: 1;
  color: var(--ch-muted);
}
.ch-cmd-body {
  display: grid;
  grid-template-columns: minmax(210px, 1fr) minmax(0, 2.15fr);
  gap: 16px;
}
.ch-cmd-rail {
  display: flex;
  flex-direction: column;
  gap: 13px;
  min-width: 0;
}
.ch-rail-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ch-ink);
  padding-bottom: 5px;
  margin-bottom: 7px;
  border-bottom: 1px solid var(--ch-border-fine);
}
.ch-cmd-kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}
.ch-cmd-kpi {
  background: var(--ch-well);
  border: 1px solid var(--ch-border-fine);
  border-radius: 8px;
  padding: 6px 9px;
  text-align: left;
  min-width: 0;
}
.ch-cmd-kpi:hover {
  background: var(--ch-well-hover);
}
.ch-cmd-kpi b {
  display: block;
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ch-cmd-kpi span {
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-cmd-kpi.is-err b {
  color: var(--ch-danger);
}
.ch-cmd-kpi.is-ok b {
  color: var(--ch-green);
}
.ch-attn-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ch-attn-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: 0;
  background: var(--ch-well);
  color: var(--ch-ink);
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 11px;
  text-align: left;
}
.ch-attn-row:hover {
  background: var(--ch-well-hover);
}
.ch-attn-row > i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
  background: var(--ch-purple);
}
.ch-attn-row.is-err > i {
  background: var(--ch-danger);
}
.ch-attn-k {
  font-weight: 600;
  color: var(--ch-muted);
  min-width: 44px;
  flex: none;
}
.ch-attn-v {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--ch-mono);
}
.ch-attn-n {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ch-prog-search {
  border: 1px solid var(--ch-border-strong);
  background: var(--ch-well);
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 10.5px;
  width: 96px;
  outline: none;
}
.ch-prog-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 190px;
  overflow-y: auto;
}
.ch-prog-row {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 7px;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 3px 6px 5px;
  border-radius: 6px;
  text-align: left;
  min-width: 0;
  overflow: hidden;
}
.ch-prog-row:nth-child(even) {
  background: var(--ch-stripe);
}
.ch-prog-row:hover {
  background: var(--ch-well);
}
.ch-prog-row.is-active {
  background: var(--ch-accent-soft);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ch-blue) 45%, transparent);
}
.ch-prog-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  align-self: center;
  flex: none;
}
.ch-prog-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--ch-mono);
  font-size: 11px;
}
.ch-prog-cnt {
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  flex: none;
}
.ch-prog-pct {
  font-size: 10.5px;
  color: var(--ch-muted);
  min-width: 30px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  flex: none;
}
.ch-prog-bar {
  position: absolute;
  left: 6px;
  bottom: 1px;
  max-width: calc(100% - 12px);
  height: 2px;
  border-radius: 1px;
  opacity: 0.55;
  pointer-events: none;
}
.ch-cmd-main-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 5px 4px;
  border-radius: 6px;
  color: var(--ch-ink);
  text-align: left;
}
.ch-cmd-status {
  width: 15px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.ch-result-known {
  color: var(--ch-green);
}
.ch-result-state {
  color: var(--ch-muted);
}
.ch-result-error {
  color: var(--ch-danger);
}
.ch-command-main code {
  min-width: 0;
  flex: 1;
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--ch-mono);
}
.ch-sh-prog {
  color: var(--ch-indigo);
  font-weight: 650;
}
.ch-sh-flag {
  color: var(--ch-teal);
}
.ch-sh-op {
  color: var(--ch-amber);
  font-weight: 700;
}
.ch-command-result {
  font-size: 10.5px;
  font-weight: 550;
  border: 1px solid var(--ch-border-strong);
  border-radius: 99px;
  background: var(--ch-surface);
  color: var(--ch-muted);
  padding: 1px 8px;
  flex-shrink: 0;
}
.ch-command-result:hover {
  border-color: var(--ch-ink);
  color: var(--ch-ink);
}
.ch-cmd-inline {
  margin: 2px 8px 8px 26px;
}
.ch-cmd-full,
.ch-cmd-out {
  margin: 0;
  padding: 7px 10px;
  font-family: var(--ch-mono);
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 180px;
  overflow-y: auto;
}
.ch-cmd-out {
  border-top: 1px solid var(--ch-border-fine);
  background: var(--ch-code-bg);
}
.ch-cmd-trunc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 10px;
  border-top: 1px solid var(--ch-border-fine);
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-net-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 6px 4px;
}
.ch-net-tier {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}
.ch-net-node {
  width: min(250px, 100%);
  background: var(--ch-sub);
  border: 1px solid var(--ch-border);
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  transition: transform 0.14s, border-color 0.14s;
}
.ch-net-node:hover:not(.is-current) {
  transform: translateY(-1px);
  border-color: var(--ch-border-strong);
}
.ch-net-node.is-current {
  border-color: color-mix(in srgb, var(--ch-blue) 60%, var(--ch-border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ch-blue) 20%, transparent);
}
.ch-net-head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.ch-net-av {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-family: var(--ch-mono);
  font-size: 9.5px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex: none;
}
.ch-net-av.is-parent {
  background: var(--ch-ok-soft);
  color: var(--ch-green);
}
.ch-net-av.is-current {
  background: var(--ch-accent-soft);
  color: var(--ch-blue);
}
.ch-net-av.is-child {
  background: color-mix(in srgb, var(--ch-purple) 15%, transparent);
  color: var(--ch-purple);
}
.ch-net-title {
  flex: 1;
  min-width: 0;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ch-net-bar {
  height: 5px;
  border-radius: 99px;
  background: var(--ch-track);
  overflow: hidden;
}
.ch-net-bar i {
  display: block;
  height: 100%;
  background: var(--ch-blue);
  border-radius: 99px;
}
.ch-net-foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 10.5px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
}
.ch-net-connector {
  width: 100%;
  max-width: 510px;
  height: 22px;
  margin: -20px 0;
  pointer-events: none;
}
.ch-net-connector path {
  fill: none;
  stroke: var(--ch-blue);
  stroke-width: 1.5;
  stroke-opacity: 0.45;
}
@container (max-width:980px) {
  .ch-cmd-body { grid-template-columns: 1fr; }
}
@container (max-width:600px) {
  .ch-file-right .ch-fa-time, .ch-cmd-time { display: none; }
}
`;var dr=`.ch-rich-text {
  overflow-wrap: anywhere;
  line-height: 1.65;
  color: var(--ch-ink-2);
}
.ch-rich-text > :first-child {
  margin-top: 0;
}
.ch-rich-text p {
  margin: 0 0 9px;
}
.ch-rich-text :is(h2, h3, h4, h5, h6) {
  margin: 12px 0 6px;
  line-height: 1.35;
  font-weight: 650;
  color: var(--ch-ink);
}
.ch-rich-text h2 {
  font-size: 15px;
}
.ch-rich-text h3 {
  font-size: 13.5px;
}
.ch-rich-text h4,
.ch-rich-text h5,
.ch-rich-text h6 {
  font-size: 12px;
}
.ch-rich-text :is(ul, ol) {
  margin: 6px 0 9px;
  padding-left: 20px;
}
.ch-rich-text li > p {
  margin: 0;
}
.ch-rich-text blockquote {
  border-left: 3px solid var(--ch-border-strong);
  padding: 2px 10px;
  margin: 9px 0;
  color: var(--ch-muted);
}
.ch-rich-text :not(pre) > code {
  font-size: 11px;
  font-family: var(--ch-mono);
  background: var(--ch-well);
  border-radius: 4px;
  padding: 1px 4px;
  color: var(--ch-ink);
}
.ch-rich-text a {
  color: var(--ch-accent-text);
  text-decoration: underline;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
}
.ch-rich-text hr {
  border: 0;
  border-top: 1px solid var(--ch-border);
  margin: 10px 0;
}
.ch-code-block {
  border: 1px solid var(--ch-border);
  border-radius: 7px;
  overflow: hidden;
  margin: 8px 0;
  background: var(--ch-code-bg);
}
.ch-code-block > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid var(--ch-border);
  padding: 3px 9px;
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-code-block pre {
  font-family: var(--ch-mono);
  font-size: 11px;
  line-height: 1.55;
  margin: 0;
  padding: 9px 10px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--ch-ink);
}
.ch-rich-table {
  overflow-x: auto;
  max-width: 100%;
  margin: 8px 0;
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
  min-width: 70px;
}
.ch-rich-table th {
  background: var(--ch-well);
  font-weight: 600;
  color: var(--ch-ink);
}
.ch-task-state {
  font-size: 12px;
  color: var(--ch-accent);
}
`;var pr=`[data-conversation-scroll][data-ch-context-surface]
  > [data-composer-seat]:not(
    :has([data-approval-key], [data-plan-review-key], [data-question-key], [data-user-question-key])
  ) {
  display: none;
}
`;var ce=require("react/jsx-runtime"),ve="ch-context",Da=["slots","locale"],vt=class extends kt.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(t,a){}render(){return this.state.failed?(0,ce.jsx)("div",{className:"ch-context",children:(0,ce.jsxs)("div",{className:"ch-shell",children:[(0,ce.jsx)("p",{role:"alert",children:this.props.translate()("errorBoundary")}),(0,ce.jsx)("button",{className:"ch-button",onClick:()=>this.setState({failed:!1}),children:this.props.translate()("retry")})]})}):this.props.children}};function ja(e){let t=()=>xt(e.locale.getLocale?.().active??"en");e.effect(()=>e.locale.register(ve,{en:{...Kt},zh:{...Zt}}),"ch-context: locale"),e.effect(()=>{let o=document.createElement("style");return o.dataset.plugin=ve,o.dataset.pluginCss=ve,o.textContent=sr+`
`+or+`
`+ir+`
`+cr+`
`+lr+`
`+dr+`
`+pr,document.head.appendChild(o),()=>o.remove()},"ch-context: styles");let a=o=>{let i=(o.useProjection??(()=>{}))("codexhostUsage");return(0,ce.jsx)(Jt,{ctx:e,sessionId:o.sessionId,projection:i,embedded:!0})},r=o=>(0,ce.jsx)(vt,{translate:t,children:(0,ce.jsx)(a,{...o})},`${o.sessionId??""}:${typeof o.useProjection}`),n=()=>(0,ce.jsx)(vt,{translate:t,children:(0,ce.jsx)(Jt,{ctx:e})});e.slots.inject("conversation.view",()=>e.slots.register({name:"conversation.view",id:ve,order:25,locale:ve,label:()=>t()("tab")},r)),e.slots.inject("main",()=>e.slots.register({name:"main",key:ve,locale:ve},n)),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:ve,order:25,label:()=>t()("compatibilityTitle"),locale:ve},o=>(0,kt.createElement)(We,{size:typeof o.size=="number"?o.size:20}))),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:ve,order:25,label:()=>t()("titleShort"),locale:ve},()=>(0,ce.jsx)("div",{className:"ch-context",children:(0,ce.jsxs)("div",{className:"ch-settings",children:[(0,ce.jsx)("h2",{children:"CH Context"}),(0,ce.jsx)("p",{children:t()("settingsNote")}),(0,ce.jsx)("p",{children:t()("localOnly")}),(0,ce.jsx)("button",{className:"ch-button",onClick:()=>{let o=ke(e.get("layout"));typeof o?.selectPanel=="function"&&o.selectPanel(ve)},children:t()("title")}),(0,ce.jsx)("small",{children:t()("readOnly")})]})})))}

return module.exports;}});
