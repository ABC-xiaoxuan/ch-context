window.__ModuleLoader__.load({id:"ch-context",factory:function(require){var module={exports:{}};var exports=module.exports;
"use strict";var Xe=Object.defineProperty;var $r=Object.getOwnPropertyDescriptor;var Er=Object.getOwnPropertyNames;var Ir=Object.prototype.hasOwnProperty;var zr=(e,t)=>{for(var n in t)Xe(e,n,{get:t[n],enumerable:!0})},Mr=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Er(t))!Ir.call(e,r)&&r!==n&&Xe(e,r,{get:()=>t[r],enumerable:!(o=$r(t,r))||o.enumerable});return e};var Ar=e=>Mr(Xe({},"__esModule",{value:!0}),e);var Yn={};zr(Yn,{apply:()=>Jn,inject:()=>Qn,name:()=>oe});module.exports=Ar(Yn);var Ge=require("react");var Y=require("react");var Rt=require("react");var to=require("react"),ue=require("react/jsx-runtime"),Pr=.5;function kt(e){let t=e.size??118,n=0;for(let s of e.segments)Number.isFinite(s.value)&&s.value>0&&(n+=s.value);let o=[],r=0;if(n>0)for(let s of e.segments){let i=Number.isFinite(s.value)&&s.value>0?s.value:0;if(i===0)continue;let c=i/n*100;o.push({key:s.key,color:s.color,len:c,offset:100-r+25}),r+=c}if(o.length>1)for(let s of o){let i=Math.min(Pr/2,s.len/4);s.len-=i*2,s.offset-=i}let a=e.hoverKey!==null&&e.hoverKey!==void 0&&o.some(s=>s.key===e.hoverKey);return(0,ue.jsxs)("div",{className:"lc-donut @max-[240px]/lc-card:mx-auto"+(a?" lc-donut-dim":""),style:{width:t,height:t},onMouseLeave:()=>{e.onHoverKey!==void 0&&e.onHoverKey(null)},children:[(0,ue.jsx)("svg",{viewBox:"0 0 42 42",width:t,height:t,"aria-hidden":"true",children:o.length===0?(0,ue.jsx)("circle",{className:"lc-donut-track fill-none stroke-4",cx:"21",cy:"21",r:"15.9155"}):o.map((s,i)=>(0,ue.jsx)("circle",{className:"lc-donut-seg fill-none stroke-4 animate-lc-donut-in motion-reduce:animate-none"+(e.hoverKey===s.key?" lc-donut-seg-on":""),cx:"21",cy:"21",r:"15.9155",strokeDasharray:`${s.len} ${100-s.len}`,strokeDashoffset:s.offset,style:{"--lc-i":i,stroke:s.color},onMouseEnter:()=>{e.onHoverKey!==void 0&&e.onHoverKey(s.key)}},s.key))}),(0,ue.jsxs)("div",{className:"lc-donut-center",children:[(0,ue.jsx)("b",{style:{fontSize:Math.max(11,Math.round(t*.13))},children:e.centerTop}),e.centerSub!==void 0?(0,ue.jsx)("span",{style:{fontSize:Math.max(10,Math.round(t*.105))},children:e.centerSub}):null]})]})}function K(e){if(e==null||isNaN(e))return"\u2014";let t=e<0?"-":"",n=Math.abs(e);return n>=1e9?t+(n/1e9).toFixed(1)+"B":n>=1e6?t+(n/1e6).toFixed(1)+"M":n>=1e3?t+(n/1e3).toFixed(1)+"k":t+String(Math.round(n))}var Or=new Intl.DateTimeFormat("en-GB",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function xe(e){let t=new Date(e);return isNaN(t.getTime())?"\u2014":Or.format(t)}var no=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});function wt(e){if(!Number.isFinite(e)||e<=0)return"\u2014";if(e<1e3)return`${Math.round(e)}ms`;if(e<6e4)return`${(e/1e3).toFixed(1)}s`;let t=Math.floor(e/1e3),n=Math.floor(t/60),o=t%60;return e<36e5?`${n}m${o}s`:`${Math.floor(n/60)}h${n%60}m`}function te(e){return typeof e=="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e)}function ae(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)?e:null}function fe(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0?e:void 0}var yt=["inputTokens","cachedInputTokens","cacheWriteInputTokens","outputTokens","totalTokens","reasoningOutputTokens","totalCostUsd","totalCredits","contextUsedTokens","contextWindowTokens","contextUsagePercent","cacheHitRatePercent","sessionCacheHitRatePercent","outputTokensPerSecond","sessionOutputTokensPerSecond","timeToFirstOutputMs","latestRequestTimeToFirstOutputMs"];function Le(e){let t=ae(e),n=ae(t?.usage);if(n===null)return null;let o={};for(let r of yt){let a=fe(n[r]);a!==void 0&&(o[r]=a)}return o.contextWindowTokens===0&&delete o.contextWindowTokens,(n.costSource==="publicPrice"||n.costSource==="native")&&(o.costSource=n.costSource),Array.isArray(n.unpricedModels)&&(o.unpricedModels=n.unpricedModels.filter(r=>typeof r=="string").slice(0,100)),yt.some(r=>o[r]!==void 0)?o:null}function Nt(e){let t=fe(e?.inputTokens),n=fe(e?.outputTokens);if(t===void 0||n===void 0)return[];let o=fe(e?.cachedInputTokens),r=fe(e?.cacheWriteInputTokens);return o===void 0||r===void 0||o+r>t?[{kind:"input",value:t},{kind:"output",value:n}]:[{kind:"uncachedInput",value:t-o-r},{kind:"cacheRead",value:o},{kind:"cacheWrite",value:r},{kind:"output",value:n}]}function me(e){let t=fe(e?.contextUsedTokens),n=fe(e?.contextWindowTokens),o=n===0?void 0:n,r=fe(e?.contextUsagePercent)??(t!==void 0&&o!==void 0?t/o*100:void 0);return r===void 0?null:{percent:r,...t===void 0?{}:{used:t},...o===void 0?{}:{capacity:o}}}function Qe(e,t,n){let o=me(t);if(o===null||!Number.isFinite(n))return[...e];let r=e.at(-1);return r?.percent===o.percent&&r.used===o.used&&r.capacity===o.capacity?[...e]:[...e,{time:n,...o}].slice(-120)}var Lr=new Intl.NumberFormat("en-US",{maximumFractionDigits:4});function _e(e,t=160){return(e.split(/\r?\n/).find(n=>n.trim().length>0)??"").trim().replace(/^#{1,6}\s+/,"").slice(0,t)}function Ce(e){return`$${e>0&&e<1e-4?e.toPrecision(2):e.toFixed(e>=1?2:4)}`}function Tt(e){return e>0&&e<1e-4?"<0.0001":Lr.format(e)}var g=require("react/jsx-runtime");function Re({size:e=20}){return(0,g.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,g.jsx)("path",{d:"M5 18V11M12 18V6M19 18V3",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),(0,g.jsx)("path",{d:"M3 21h18",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]})}function pe({label:e,value:t,suffix:n,format:o}){let r=t===void 0?"\u2014":o?o(t):n==="%"?`${t.toFixed(1)}%`:n==="ms"?t===0?"0ms":wt(t):n==="tok/s"?`${t.toFixed(1)} ${n}`:K(t);return(0,g.jsxs)("div",{className:"ch-metric",children:[(0,g.jsx)("dt",{children:e}),(0,g.jsx)("dd",{title:t===void 0?void 0:String(t),children:r})]})}function ve({title:e,aside:t,children:n,className:o=""}){return(0,g.jsxs)("section",{className:`ch-card ${o}`,children:[(0,g.jsxs)("header",{className:"ch-card-heading",children:[(0,g.jsx)("h2",{children:e}),t]}),n]})}function _r({samples:e,tone:t,t:n}){let o=e[0],r=e.at(-1),a=o&&r&&e.length>1?r.percent-o.percent:null,s=e.length?Math.max(0,Math.min(...e.map(h=>Math.min(100,h.percent)))-6):0,i=e.length?Math.min(100,Math.max(...e.map(h=>Math.min(100,h.percent)))+6):100,c=Math.max(12,i-s),l=e.map((h,v)=>{let x=e.length===1?210:12+v/(e.length-1)*396,I=42-(Math.min(100,Math.max(0,h.percent))-s)/c*34;return{x,y:I,sample:h}}),u=l.map((h,v)=>`${v===0?"M":"L"}${h.x.toFixed(1)},${h.y.toFixed(1)}`).join(" "),f=l.length>1?`${u} L${l[l.length-1].x.toFixed(1)},47 L${l[0].x.toFixed(1)},47 Z`:"";return(0,g.jsxs)("div",{className:`ch-spark-box is-${t}`,title:n("timelineNote"),children:[(0,g.jsxs)("div",{className:"ch-spark-head",children:[(0,g.jsx)("span",{children:n("timeline")}),(0,g.jsx)("strong",{children:e.length===0?n("noObservations"):e.length===1&&o?`1 ${n("points")} \xB7 ${o.percent.toFixed(1)}%`:`${e.length} ${n("points")} \xB7 ${o.percent.toFixed(1)}% \u2192 ${r.percent.toFixed(1)}% (${a!==null&&a>=0?"+":""}${a?.toFixed(1)}%)`})]}),(0,g.jsxs)("svg",{className:"ch-spark-svg",viewBox:"0 0 420 50",role:"img","aria-label":n("sampled"),children:[(0,g.jsx)("line",{x1:"0",y1:"10",x2:"420",y2:"10",className:"ch-chart-grid"}),(0,g.jsx)("line",{x1:"0",y1:"28",x2:"420",y2:"28",className:"ch-chart-grid"}),f&&(0,g.jsx)("path",{d:f,className:"ch-spark-area"}),u&&(0,g.jsx)("path",{d:u,className:"ch-chart-line"}),l.map((h,v)=>(0,g.jsx)("circle",{cx:h.x.toFixed(1),cy:h.y.toFixed(1),r:v===l.length-1?3.8:2.5,className:`ch-chart-dot ${v===l.length-1?"is-latest":""}`,children:(0,g.jsxs)("title",{children:[xe(h.sample.time)," \xB7 ",h.sample.percent.toFixed(1),"%"]})},`${h.sample.time}-${v}`))]})]})}function $t({usage:e,samples:t,t:n}){let r=me(e)?.percent,a=r!==void 0&&r>=85?"danger":r!==void 0&&r>=65?"warn":"normal",s=e?.contextUsedTokens!==void 0&&e?.contextWindowTokens!==void 0?Math.max(0,e.contextWindowTokens-e.contextUsedTokens):void 0;return(0,g.jsxs)(ve,{title:n("context"),className:`ch-context-card is-${a}`,aside:(0,g.jsxs)("span",{className:"ch-scope",title:n("limitsNote"),children:[n("source")," \u24D8"]}),children:[(0,g.jsxs)("div",{className:"ch-context-line",children:[(0,g.jsx)("div",{className:"ch-occupancy-number",children:(0,g.jsx)("strong",{children:r===void 0?"\u2014":`${r.toFixed(1)}%`})}),(0,g.jsxs)("div",{className:"ch-context-tokens",children:[(0,g.jsxs)("p",{children:[(0,g.jsx)("b",{children:K(e?.contextUsedTokens)}),(0,g.jsxs)("span",{children:[" / ",K(e?.contextWindowTokens)," tokens"]})]}),(0,g.jsx)("span",{className:"ch-remain-pill",children:s===void 0?n("capacityUnknown"):`${n("remainingShort")} ${K(s)}`})]})]}),(0,g.jsxs)("div",{className:"ch-gauge-wrap",children:[(0,g.jsxs)("div",{className:`ch-capacity-bar ${a==="danger"?"is-danger":a==="warn"?"is-high":""}`,role:"img","aria-label":`${n("occupancy")}: ${r===void 0?n("unavailable"):r.toFixed(1)+"%"}`,children:[(0,g.jsx)("span",{style:{width:`${Math.min(100,r??0)}%`}}),(0,g.jsx)("i",{className:"ch-gauge-tick",style:{left:"75%"},"aria-hidden":"true"}),(0,g.jsx)("i",{className:"ch-gauge-tick",style:{left:"90%"},"aria-hidden":"true"})]}),(0,g.jsxs)("div",{className:"ch-context-values",children:[(0,g.jsxs)("span",{children:[n("used"),": ",K(e?.contextUsedTokens)]}),(0,g.jsxs)("span",{children:[n("capacity"),": ",K(e?.contextWindowTokens)]})]})]}),(0,g.jsx)(_r,{samples:t,tone:a,t:n})]})}var St={input:"var(--ch-blue)",uncachedInput:"var(--ch-blue)",cacheRead:"var(--ch-teal)",cacheWrite:"var(--ch-amber)",output:"var(--ch-purple)"};function Et({usage:e,t}){let[n,o]=(0,Rt.useState)(null),r=Nt(e),a=r.reduce((c,l)=>c+l.value,0),s=(e?.unpricedModels?.length??0)>0,i=e?.totalCostUsd===void 0?t("unavailable"):e.costSource==="native"?t("costNative"):e.costSource==="publicPrice"?t("costEstimate"):t("source");return(0,g.jsxs)(ve,{title:t("cumulative"),className:"ch-token-card",aside:(0,g.jsxs)("span",{className:"ch-cost-badge",title:s?t("partialPrice"):i,children:[(0,g.jsx)("b",{children:e?.totalCostUsd===void 0?"\u2014":`${s?"\u2265 ":""}${Ce(e.totalCostUsd)}`}),(0,g.jsx)("small",{children:i})]}),children:[(0,g.jsxs)("div",{className:"ch-token-layout",children:[(0,g.jsx)(kt,{size:108,segments:r.map(c=>({key:c.kind,value:c.value,color:St[c.kind]})),centerTop:K(r.length?a:e?.totalTokens),centerSub:r.length?t("inputOutput"):t("total"),hoverKey:n,onHoverKey:o}),(0,g.jsxs)("div",{className:"ch-token-legend",children:[r.length?r.map(c=>(0,g.jsxs)("button",{className:n===c.kind?"is-hi":"",title:`${t(c.kind)}: ${c.value}`,onMouseEnter:()=>o(c.kind),onMouseLeave:()=>o(null),onFocus:()=>o(c.kind),onBlur:()=>o(null),children:[(0,g.jsx)("span",{className:"ch-swatch",style:{background:St[c.kind]}}),(0,g.jsx)("span",{children:t(c.kind)}),(0,g.jsx)("b",{children:K(c.value)}),(0,g.jsx)("small",{children:a>0?`${(c.value/a*100).toFixed(1)}%`:"\u2014"})]},c.kind)):(0,g.jsxs)("dl",{className:"ch-metrics",children:[(0,g.jsx)(pe,{label:t("input"),value:e?.inputTokens}),(0,g.jsx)(pe,{label:t("output"),value:e?.outputTokens}),(0,g.jsx)(pe,{label:t("cacheRead"),value:e?.cachedInputTokens}),(0,g.jsx)(pe,{label:t("cacheWrite"),value:e?.cacheWriteInputTokens})]}),r.length===2&&(0,g.jsxs)("dl",{className:"ch-independent-cache",children:[(0,g.jsx)(pe,{label:t("cacheRead"),value:e?.cachedInputTokens}),(0,g.jsx)(pe,{label:t("cacheWrite"),value:e?.cacheWriteInputTokens})]})]})]}),(0,g.jsxs)("div",{className:"ch-token-footer",children:[(0,g.jsxs)("span",{title:t("inputIncludesCache"),children:[t("total")," ",(0,g.jsx)("b",{children:K(e?.totalTokens)})]}),e?.reasoningOutputTokens!==void 0&&(0,g.jsxs)("span",{className:"ch-dot-pill",children:[(0,g.jsx)("i",{className:"is-event"}),t("reasoningOutput")," ",K(e.reasoningOutputTokens)]})]}),s&&(0,g.jsx)("p",{className:"ch-note",children:t("partialPrice")})]})}function Ct({label:e,value:t}){return(0,g.jsxs)("div",{className:"ch-cache-row",children:[(0,g.jsx)("span",{children:e}),(0,g.jsx)("div",{className:"ch-cache-track",children:(0,g.jsx)("i",{style:{width:`${Math.min(100,t??0)}%`}})}),(0,g.jsx)("b",{children:t===void 0?"\u2014":`${t.toFixed(1)}%`})]})}function It({usage:e,summary:t,errorCount:n,onKind:o,onSignalTab:r,onErrors:a,t:s}){return(0,g.jsxs)(ve,{title:s("performance"),className:"ch-performance-card",aside:(0,g.jsx)("span",{className:"ch-scope",children:e?.cacheHitRatePercent===void 0?s("unavailable"):`${s("cacheHit")} ${e.cacheHitRatePercent.toFixed(1)}%`}),children:[(0,g.jsxs)("dl",{className:"ch-performance",children:[(0,g.jsx)(pe,{label:s("tps"),value:e?.outputTokensPerSecond,suffix:"tok/s"}),(0,g.jsx)(pe,{label:s("avgTps"),value:e?.sessionOutputTokensPerSecond,suffix:"tok/s"}),(0,g.jsx)(pe,{label:s("ttft"),value:e?.latestRequestTimeToFirstOutputMs??e?.timeToFirstOutputMs,suffix:"ms"}),e?.totalCredits!==void 0&&(0,g.jsx)(pe,{label:s("credits"),value:e.totalCredits,format:Tt})]}),(0,g.jsxs)("div",{className:"ch-cache-bars",children:[(0,g.jsx)(Ct,{label:s("cacheHit"),value:e?.cacheHitRatePercent}),(0,g.jsx)(Ct,{label:s("avgCache"),value:e?.sessionCacheHitRatePercent})]}),(0,g.jsxs)("div",{className:"ch-pulse-ribbon",children:[(0,g.jsxs)("button",{className:"ch-pulse-pill",onClick:()=>o("messages"),children:[(0,g.jsx)("i",{className:"is-user"}),s("messages")," ",(0,g.jsx)("b",{children:t?.messages??"\u2014"})]}),(0,g.jsxs)("button",{className:"ch-pulse-pill",onClick:()=>o("tool"),children:[(0,g.jsx)("i",{className:"is-tool"}),s("tools")," ",(0,g.jsx)("b",{children:t?t.toolCalls+t.toolResults:"\u2014"})]}),(0,g.jsxs)("button",{className:"ch-pulse-pill",onClick:()=>r("files"),children:[(0,g.jsx)("i",{className:"is-assistant"}),s("files")," ",(0,g.jsx)("b",{children:t?.files.length??"\u2014"})]}),(0,g.jsxs)("button",{className:"ch-pulse-pill",onClick:()=>r("commands"),children:[(0,g.jsx)("i",{className:"is-event"}),s("commands")," ",(0,g.jsx)("b",{children:t?.commands.length??"\u2014"})]}),n>0&&(0,g.jsxs)("button",{className:"ch-pulse-pill is-err",onClick:a,children:["! ",s("failed")," ",(0,g.jsx)("b",{children:n})]})]})]})}function Je({item:e,t}){return!e.clipped&&!e.contentUnavailable&&e.isError!==!0?null:(0,g.jsxs)(g.Fragment,{children:[e.isError===!0&&(0,g.jsx)("span",{className:"ch-record-badge ch-error-badge",children:t("failed")}),(e.clipped||e.contentUnavailable)&&(0,g.jsx)("span",{className:"ch-record-badge",children:t(e.clipped?"previewShort":"partialShort")})]})}function zt({item:e,t}){return(0,g.jsxs)(g.Fragment,{children:[e.isError===!0&&(0,g.jsx)("p",{className:"ch-note ch-record-notice is-error",children:t("toolError")}),e.hostPreview&&(0,g.jsx)("p",{className:"ch-note ch-record-notice",children:t("hostPreview")}),e.textTruncated&&(0,g.jsx)("p",{className:"ch-note ch-record-notice",children:t("textTruncated")}),e.contentUnavailable&&(0,g.jsx)("p",{className:"ch-note ch-record-notice",children:t("contentUnavailable")})]})}var ee=require("react");var Hr=new Set(["bash","Bash","pwsh","powershell","exec_command","shell","shell_command","run_shell_command","run_command"]),Fr=new Set(["read","Read","read_file","readFile","read_image"]),qr=new Set(["write","Write","write_file","writeFile","edit","Edit","edit_file","editFile","multi_edit","MultiEdit"]),Ur=new Set(["grep","Grep","glob","Glob","search_files","searchFiles"]),jr=new Set(["str_replace_editor","str_replace_based_edit_tool"]),Br=new Set(["str_replace","insert","create","undo_edit"]);function $e(e){return typeof e=="string"&&e.trim().length>0}function Ye(e){return $e(e.toolName)?e.toolName:$e(e.title)?e.title:void 0}function At(e){return e.startsWith("functions.")?e.slice(10):e}function Wr(e){if(typeof e=="string")try{let t=JSON.parse(e);return t!==null&&typeof t=="object"&&!Array.isArray(t)?t:void 0}catch{return}}function Dr(e,t){if(Hr.has(At(e)))return typeof t.command=="string"?t.command:typeof t.cmd=="string"?t.cmd:void 0}function Vr(e,t){let n=At(e);if(Fr.has(n))return"reads";if(qr.has(n))return"writes";if(Ur.has(n))return"searches";if(jr.has(n)){if(t.command==="view")return"reads";if(typeof t.command=="string"&&Br.has(t.command))return"writes"}}function Zr(e){for(let t of["path","file_path","filePath"]){let n=e[t];if($e(n)&&!n.includes("\0"))return n}}function Mt(e,t){if(!$e(t.callId))return;let n=e.get(t.callId);n?n.push(t):e.set(t.callId,[t])}function Pt(e){let t=new Map,n=new Map;for(let r of e)r.eventType==="tool/call"?Mt(t,r):r.eventType==="tool/result"&&Mt(n,r);let o=new Map;for(let[r,a]of t){let s=n.get(r);if(a.length!==1||s?.length!==1)continue;let i=a[0],c=s[0];if(c.seq<=i.seq)continue;let l=Ye(i);$e(c.toolName)&&l!==void 0&&c.toolName!==l||o.set(i,c)}return o}function Ot(e){let t=Pt(e),n=new Map;for(let[o,r]of t)n.set(o.id,r.id),n.set(r.id,o.id);return n}function et(e){let t=e.trim();if(!t)return"shell";let n=t.split(/\s+/);for(let o of n){if(/^[A-Za-z_][A-Za-z0-9_]*=/.test(o))continue;let r=o.replace(/^['"]|['"]$/g,""),a=r.split(/[\\/]/).at(-1)??r;if(a)return a.slice(0,28)}return"shell"}function Kr(e,t){if(e.isError===!0||t?.isError===!0)return!0;if(t?.isError===!1||e.isError===!1)return!1}function Lt(e){let t={messages:0,userMessages:0,assistantMessages:0,toolCalls:0,toolResults:0,events:0,records:e.length,tools:[],commands:[],files:[]},n=Pt(e),o=new Map,r=new Map,a=new Map;for(let s of e)if(s.eventType==="user/message"||s.eventType===void 0&&s.kind==="user")t.userMessages++;else if(s.eventType==="assistant/message"||s.eventType===void 0&&s.kind==="assistant")t.assistantMessages++;else if(s.eventType==="tool/result")t.toolResults++;else if(s.eventType==="tool/call"){t.toolCalls++;let i=Ye(s);if(i===void 0)continue;let c=o.get(i);c===void 0&&(c={name:i,count:0,failed:0,pending:0,recordIds:[]},o.set(i,c));let l=n.get(s),u=Kr(s,l);c.count++,u===!0&&c.failed++,l===void 0?c.pending++:a.set(l,c);let f=Wr(s.arguments);if(f===void 0)continue;let h=Dr(i,f);h!==void 0&&t.commands.push({id:s.id,seq:s.seq,tool:i,command:h,recordId:s.id,...l===void 0?{}:{resultId:l.id},...u===void 0?{}:{isError:u}});let v=Vr(i,f),x=v===void 0?void 0:Zr(f);if(v===void 0||x===void 0)continue;let S=r.get(x);S===void 0&&(S={path:x,reads:0,writes:0,searches:0,recordIds:[]},r.set(x,S)),S[v]++,S.recordIds.push(s.id)}else t.events++;for(let s of e)(s.eventType==="tool/call"?o.get(Ye(s)??""):a.get(s))?.recordIds.push(s.id);return t.messages=t.userMessages+t.assistantMessages,t.tools=[...o.values()],t.files=[...r.values()],t}var _t={subagent:4,fork:3,tree:2,parent:1};function Ht(e){return[{id:e.parentId,kind:e.origin==="subagent"?"subagent":"parent"},{id:e.forkParentId,kind:"fork"},{id:e.treeParentId,kind:"tree"}].filter(n=>te(n.id)&&n.id!==e.id)}function Ft(e,t){if(!te(t))return[];let n=new Map,o=(a,s,i)=>{if(!te(a)||a===t)return;let c=`${s}:${a}`,l=n.get(c);if(l&&_t[l.kind]>=_t[i])return;let u=e.find(f=>f.id===a);n.set(c,{id:a,title:u?.title??"",role:s,kind:i,loaded:u!==void 0,...u?.harness?{harness:u.harness}:{}})},r=e.find(a=>a.id===t);if(r)for(let a of Ht(r))o(a.id,"parent",a.kind);for(let a of e)if(!(!te(a.id)||a.id===t))for(let s of Ht(a))s.id===t&&o(a.id,"child",s.kind);return[...n.values()]}var Z=require("react");function qt(e,t){return 8+e/Math.max(1,t-1)*704}function Ut(e,t){return t<2||!Number.isFinite(e)?0:Math.min(t-1,Math.max(0,Math.round((e*720-8)/704*(t-1))))}var d=require("react/jsx-runtime"),ke={user:"var(--ch-green)",assistant:"var(--ch-blue)",tool:"var(--ch-teal)",event:"var(--ch-purple)"};function Gr(e){let t=[],n=[],o=0;for(let r=0;r<e.length;r++){(e[r].kind==="user"||o===0)&&(o+=1),n.push(o);let s=t.at(-1);!s||s.turn!==o?t.push({turn:o,start:r,end:r}):s.end=r}return{turns:t,turnByIndex:n}}function jt({items:e,pairs:t,available:n,loading:o,focus:r,onFocus:a,t:s}){let[i,c]=(0,Z.useState)(null),l=e.findIndex(b=>b.id===r),u=l<0?Math.max(0,e.length-1):l,f=b=>{let N=b.currentTarget.getBoundingClientRect();return N.width>0?Ut((b.clientX-N.left)/N.width,e.length):null},h=b=>{let N=f(b);N!==null&&e[N]&&a(e[N].id)},v=["user","assistant","tool","event"],x=b=>qt(b,e.length),S=b=>26+v.indexOf(b)*25,I=Math.max(3.5,Math.min(10,560/Math.max(1,e.length))),A=i!==null&&e[i]?i:u,P=e[A],{turns:H,turnByIndex:E}=(0,Z.useMemo)(()=>Gr(e),[e]),$=(0,Z.useMemo)(()=>new Map(e.map((b,N)=>[b.id,N])),[e]),C=(0,Z.useMemo)(()=>{let b=[];for(let N=0;N<e.length;N++){let T=e[N];if(T.eventType!=="tool/call")continue;let O=t.get(T.id);if(!O)continue;let z=$.get(O);if(z===void 0||z<=N)continue;let se=e[z];b.push({key:`${T.id}-${O}`,x1:x(N),x2:x(z),isError:se?.isError===!0||T.isError===!0})}return b},[e,t,$]),M=P?t.get(P.id):void 0,U=M?e[$.get(M)??-1]:void 0,R=e.length>1?u/(e.length-1)*100:100;return(0,d.jsx)(ve,{title:s("activityTimeline"),className:"ch-activity-timeline",aside:(0,d.jsxs)("span",{className:"ch-scope",children:[s("historyWindow")," \xB7 ",e.length?`${e.length}`:"\u2014",H.length>0?` (${H.length} ${s("turnsCount")})`:""]}),children:e.length===0?(0,d.jsx)("p",{className:"ch-note",children:s(n?"noHistory":o?"historyLoading":"unavailable")}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("div",{className:"ch-activity-chart",children:[(0,d.jsx)("div",{className:"ch-lane-labels",children:v.map(b=>(0,d.jsxs)("span",{className:"ch-lane-label",children:[(0,d.jsx)("i",{style:{background:ke[b]}}),s(b)]},b))}),(0,d.jsxs)("div",{className:"ch-activity-plot",children:[H.length>0&&H.length<=16&&(0,d.jsx)("div",{className:"ch-turn-axis","aria-hidden":"true",children:H.map((b,N)=>{let T=N===0?0:(x(b.start-1)+x(b.start))/2;return(0,d.jsxs)("span",{className:"ch-turn-tag",style:{left:`${T/720*100}%`},children:["T",b.turn]},b.turn)})}),(0,d.jsxs)("svg",{viewBox:"0 0 720 120",preserveAspectRatio:"none",role:"img","aria-label":s("activitySequence"),onClick:h,onMouseMove:b=>c(f(b)),onMouseLeave:()=>c(null),children:[H.map((b,N)=>{let T=N===0?0:(x(b.start-1)+x(b.start))/2,O=N===H.length-1?720:(x(b.end)+x(b.end+1))/2;return(0,d.jsxs)("g",{children:[N%2===1&&(0,d.jsx)("rect",{x:T,y:2,width:Math.max(0,O-T),height:116,rx:4,className:"ch-turn-band"}),N>0&&(0,d.jsx)("line",{x1:T,x2:T,y1:4,y2:116,className:"ch-turn-divider"})]},b.turn)}),v.map(b=>(0,d.jsx)("line",{x1:"0",x2:"720",y1:S(b),y2:S(b),className:"ch-lane-line"},b)),C.map(b=>(0,d.jsx)("line",{x1:b.x1,x2:b.x2,y1:S("tool"),y2:S("tool"),className:`ch-tool-bridge ${b.isError?"is-error":""}`},b.key)),(0,d.jsx)("line",{x1:x(u),x2:x(u),y1:"14",y2:"118",className:"ch-timeline-cursor"}),e.map((b,N)=>{let T=N===u||i===N,O=T?Math.min(12,I+2):I,z=T?20:16,se=S(b.kind)-z/2,p=b.isError===!0?"var(--ch-danger)":ke[b.kind];return(0,d.jsxs)("g",{children:[(0,d.jsx)("rect",{x:x(N)-O/2,y:se,width:O,height:z,rx:"2.5",fill:p,opacity:T?1:.72}),b.isError===!0&&(0,d.jsx)("rect",{x:x(N)-4,y:4,width:8,height:8,rx:4,fill:"var(--ch-danger)"})]},b.id)})]})]})]}),(0,d.jsxs)("div",{className:"ch-scrubber-row",children:[(0,d.jsx)("input",{className:"ch-sequence-slider",type:"range",min:"0",max:Math.max(0,e.length-1),value:u,style:{background:`linear-gradient(to right, var(--ch-accent) ${R}%, var(--ch-track) ${R}%)`},onChange:b=>{let N=e[Number(b.target.value)];N&&a(N.id)},"aria-label":s("activitySequence")}),(0,d.jsxs)("span",{className:"ch-scrubber-pos",children:["#",u+1," / ",e.length]})]}),P&&(0,d.jsxs)("div",{className:"ch-sequence-preview",style:{borderLeftColor:P.isError===!0?"var(--ch-danger)":ke[P.kind]},children:[(0,d.jsxs)("div",{className:"ch-step-brief-top",children:[(0,d.jsxs)("div",{className:"ch-step-brief-meta",children:[(0,d.jsxs)("b",{"data-seq":P.seq,title:`Seq ${P.seq}`,children:["#",A+1]}),(0,d.jsxs)("span",{className:`ch-dot-pill ${P.isError===!0?"is-err":""}`,children:[(0,d.jsx)("i",{style:{background:P.isError===!0?"var(--ch-danger)":ke[P.kind]}}),P.isError===!0?s("failed"):s(P.kind)]}),(0,d.jsxs)("span",{className:"ch-step-brief-time",children:["T",E[A]??1,P.time!==void 0?` \xB7 ${xe(P.time)}`:""]})]}),U&&(0,d.jsx)("button",{className:"ch-mini-button ch-pair-jump",onClick:()=>a(U.id),children:U.eventType==="tool/result"?`${s("jumpResult")} \u2197`:`${s("jumpCall")} \u2196`})]}),(0,d.jsx)("div",{className:"ch-step-brief-text",children:_e(P.title==="user"||P.title==="assistant"?P.text:P.title,140)||s(P.kind)})]}),(0,d.jsx)("p",{className:"ch-note",children:s("sequenceNote")})]})})}function Xr(e){let t=e.split(/[\\/]/).at(-1)??e,n=t.lastIndexOf(".");return n<=0||n===t.length-1?"FILE":t.slice(n+1).toUpperCase().slice(0,5)}function Qr(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{dir:"",base:e}:{dir:e.slice(0,t+1),base:e.slice(t+1)}}function Jr(e){let t=e.split(/(\s+|&&|\|\||\|)/),n=!1;return(0,d.jsx)(d.Fragment,{children:t.map((o,r)=>o?/^\s+$/.test(o)?(0,d.jsx)(Z.Fragment,{children:o},r):o==="&&"||o==="||"||o==="|"?(0,d.jsx)("span",{className:"ch-sh-op",children:o},r):n?o.startsWith("-")?(0,d.jsx)("span",{className:"ch-sh-flag",children:o},r):(0,d.jsx)(Z.Fragment,{children:o},r):(n=!0,(0,d.jsx)("span",{className:"ch-sh-prog",children:o},r)):null)})}function Bt({tab:e,onTab:t,summary:n,related:o,currentTitle:r,currentHarness:a,items:s,onFocus:i,onSelect:c,t:l}){let[u,f]=(0,Z.useState)("all"),[h,v]=(0,Z.useState)(""),[x,S]=(0,Z.useState)(()=>new Set),[I,A]=(0,Z.useState)("all"),[P,H]=(0,Z.useState)(null),E=(0,Z.useMemo)(()=>new Map(s.map((p,j)=>[p.id,{seq:p.seq,pos:j+1,item:p}])),[s]),$=n?.files??[],C=(0,Z.useMemo)(()=>{let p=h.trim().toLocaleLowerCase();return $.filter(j=>u!=="all"&&j[u]===0?!1:p?j.path.toLocaleLowerCase().includes(p):!0)},[$,u,h]),M=n?.commands??[],U=(0,Z.useMemo)(()=>M.filter(p=>p.isError===!0).length,[M]),R=(0,Z.useMemo)(()=>M.filter(p=>p.isError===!1).length,[M]),b=(0,Z.useMemo)(()=>{let p=new Map;for(let j of M){let D=et(j.command);p.set(D,(p.get(D)??0)+1)}return[...p.entries()].sort((j,D)=>D[1]-j[1])},[M]),N=P!==null&&b.some(([p])=>p===P)?P:null,T=(0,Z.useMemo)(()=>M.filter(p=>!(I==="err"&&p.isError!==!0||I==="ok"&&p.isError!==!1||N!==null&&et(p.command)!==N)),[M,I,N]),O={subagent:"relationSubagent",fork:"relationFork",tree:"relationTree",parent:"relationParent"},z=o.filter(p=>p.role==="parent"),se=o.filter(p=>p.role==="child");return(0,d.jsxs)("section",{className:"ch-card ch-signals-card",children:[(0,d.jsxs)("div",{className:"ch-tab-bar",role:"tablist",children:[(0,d.jsxs)("button",{role:"tab","aria-selected":e==="files",className:`ch-tab-btn ${e==="files"?"is-active":""}`,onClick:()=>t("files"),children:[l("files"),(0,d.jsx)("span",{className:"ch-tab-count",children:n?.files.length??"\u2014"})]}),(0,d.jsxs)("button",{role:"tab","aria-selected":e==="commands",className:`ch-tab-btn ${e==="commands"?"is-active":""}`,onClick:()=>t("commands"),children:[l("commands"),(0,d.jsx)("span",{className:"ch-tab-count",children:n?.commands.length??"\u2014"}),U>0&&(0,d.jsxs)("span",{className:"ch-tab-err",children:[U,"!"]})]}),(0,d.jsxs)("button",{role:"tab","aria-selected":e==="family",className:`ch-tab-btn ${e==="family"?"is-active":""}`,onClick:()=>t("family"),children:[l("loadedFamily"),(0,d.jsx)("span",{className:"ch-tab-count",children:o.length})]})]}),e==="files"&&(0,d.jsxs)("div",{className:"ch-signal-panel ch-file-card",children:[$.length>0&&(0,d.jsxs)("div",{className:"ch-subfilter-row",children:[(0,d.jsx)("div",{className:"ch-chip-group",children:[["all",l("all"),$.length],["reads",l("reads"),$.filter(p=>p.reads>0).length],["writes",l("writes"),$.filter(p=>p.writes>0).length],["searches",l("searches"),$.filter(p=>p.searches>0).length]].map(([p,j,D])=>(0,d.jsxs)("button",{className:`ch-chip ${u===p?"is-active":""}`,"aria-pressed":u===p,onClick:()=>f(p),children:[j," ",D]},p))}),(0,d.jsx)("input",{className:"ch-mini-input",value:h,onChange:p=>v(p.target.value),placeholder:l("filterPath"),"aria-label":l("filterPath")})]}),!n||$.length===0?(0,d.jsx)("p",{className:"ch-note",children:l(n?"noFiles":"unavailable")}):C.length===0?(0,d.jsx)("p",{className:"ch-note",children:l("noMatches")}):(0,d.jsx)("div",{className:"ch-file-list",children:C.map(p=>{let{dir:j,base:D}=Qr(p.path),X=x.has(p.path);return(0,d.jsxs)("div",{className:"ch-file-item",children:[(0,d.jsxs)("div",{className:"ch-file-row-wrap",children:[p.recordIds.length>1&&(0,d.jsx)("button",{className:"ch-file-expand","aria-expanded":X,"aria-label":l("openOperations"),onClick:()=>S(m=>{let F=new Set(m);return F.has(p.path)?F.delete(p.path):F.add(p.path),F}),children:X?"\u25BE":"\u25B8"}),(0,d.jsxs)("button",{className:"ch-file-row",title:p.path,onClick:()=>i(p.recordIds[0]),children:[(0,d.jsxs)("div",{className:"ch-file-left",children:[(0,d.jsx)("span",{className:"ch-ext-badge",children:Xr(p.path)}),(0,d.jsxs)("span",{className:"ch-file-path",children:[j&&(0,d.jsx)("span",{className:"ch-file-dir",children:j}),(0,d.jsx)("strong",{children:D})]})]}),(0,d.jsxs)("span",{className:"ch-op-badges",children:[p.reads>0&&(0,d.jsxs)("i",{className:"ch-op-tag",children:[(0,d.jsx)("em",{className:"is-tool"}),l("readShort")," ",p.reads]}),p.writes>0&&(0,d.jsxs)("i",{className:"ch-op-tag",children:[(0,d.jsx)("em",{className:"is-assistant"}),l("writeShort")," ",p.writes]}),p.searches>0&&(0,d.jsxs)("i",{className:"ch-op-tag",children:[(0,d.jsx)("em",{className:"is-warn"}),l("searchShort")," ",p.searches]})]})]})]}),X&&p.recordIds.length>1&&(0,d.jsx)("div",{className:"ch-file-ops",children:p.recordIds.map(m=>{let F=E.get(m);return(0,d.jsxs)("button",{className:"ch-op-jump",onClick:()=>i(m),children:["\u2197 ",F?.item.toolName??l("tool")," #",F?.pos??""]},m)})})]},p.path)})})]}),e==="commands"&&(0,d.jsxs)("div",{className:"ch-signal-panel ch-command-card",children:[M.length>0&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("div",{className:"ch-subfilter-row",children:[(0,d.jsx)("div",{className:"ch-chip-group",children:[["all",l("all"),M.length],["ok",l("statusOk"),R],["err",l("failed"),U]].map(([p,j,D])=>(0,d.jsxs)("button",{className:`ch-chip ${I===p?"is-active":""}`,"aria-pressed":I===p,onClick:()=>{A(p),p==="all"&&H(null)},children:[j," ",D]},p))}),(0,d.jsx)("span",{className:"ch-note",children:l("programFilter")})]}),b.length>0&&(0,d.jsx)("div",{className:"ch-prog-bars",children:b.map(([p,j])=>(0,d.jsxs)("button",{className:`ch-prog-chip ${N===p?"is-active":""}`,"aria-pressed":N===p,onClick:()=>H(D=>D===p?null:p),children:[(0,d.jsx)("span",{children:p}),(0,d.jsxs)("b",{children:["\xD7",j]})]},p))})]}),!n||M.length===0?(0,d.jsx)("p",{className:"ch-note",children:l(n?"noCommands":"unavailable")}):T.length===0?(0,d.jsx)("p",{className:"ch-note",children:l("noMatches")}):(0,d.jsx)("div",{className:"ch-command-list",children:T.map(p=>(0,d.jsxs)("div",{className:`ch-command-row ${p.isError?"is-error":""}`,children:[(0,d.jsxs)("button",{className:"ch-command-main",onClick:()=>i(p.recordId),children:[(0,d.jsx)("span",{className:p.isError?"ch-cmd-status ch-result-error":p.resultId&&p.isError===!1?"ch-cmd-status ch-result-known":"ch-cmd-status ch-result-state",title:l(p.isError?"failed":p.resultId?"completed":"pending"),children:p.isError?"!":p.resultId?p.isError===!1?"\u2713":"\u21B3":"\u2026"}),(0,d.jsxs)("span",{className:"ch-command-seq",children:["#",p.seq]}),(0,d.jsx)("code",{children:Jr(p.command)})]}),p.resultId&&(0,d.jsxs)("button",{className:"ch-command-result",onClick:()=>i(p.resultId),children:[l("toolOutput")," \u2197"]})]},p.id))})]}),e==="family"&&(0,d.jsxs)("div",{className:"ch-signal-panel ch-family-card",children:[o.length===0?(0,d.jsx)("p",{className:"ch-note",children:l("noFamily")}):(0,d.jsxs)("div",{className:"ch-family-list",children:[z.map(p=>(0,d.jsxs)("button",{className:"ch-family-row",title:p.title||p.id,onClick:()=>c(p.id),children:[(0,d.jsxs)("div",{className:"ch-family-node-main",children:[(0,d.jsxs)("div",{className:"ch-family-node-tags",children:[(0,d.jsxs)("span",{className:"ch-dot-pill",children:[(0,d.jsx)("i",{className:"is-user"}),l("parentConversation")," \xB7 ",l(O[p.kind])]}),p.harness&&(0,d.jsx)("span",{className:"ch-meta-tag",children:p.harness})]}),(0,d.jsx)("b",{children:p.title||p.id})]}),(0,d.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]},`${p.role}:${p.id}`)),(0,d.jsxs)("div",{className:"ch-family-current",children:[(0,d.jsxs)("div",{className:"ch-family-node-main",children:[(0,d.jsxs)("div",{className:"ch-family-node-tags",children:[(0,d.jsxs)("span",{className:"ch-dot-pill",children:[(0,d.jsx)("i",{className:"is-assistant"}),l("currentSession")]}),(0,d.jsx)("span",{className:"ch-meta-tag",children:a})]}),(0,d.jsx)("b",{children:r})]}),(0,d.jsx)("span",{"aria-hidden":"true",children:"\u25CF"})]}),se.map(p=>(0,d.jsxs)("button",{className:"ch-family-row is-child",title:p.title||p.id,onClick:()=>c(p.id),children:[(0,d.jsxs)("div",{className:"ch-family-node-main",children:[(0,d.jsxs)("div",{className:"ch-family-node-tags",children:[(0,d.jsxs)("span",{className:"ch-dot-pill",children:[(0,d.jsx)("i",{className:"is-event"}),l(O[p.kind])]}),p.harness&&(0,d.jsx)("span",{className:"ch-meta-tag",children:p.harness})]}),(0,d.jsx)("b",{children:p.title||p.id})]}),(0,d.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]},`${p.role}:${p.id}`))]}),(0,d.jsx)("p",{className:"ch-note",children:l("familyScope")})]})]})}var J=require("react");var be=require("react");function ot(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ye=ot();function Xt(e){ye=e}var Me={exec:()=>null};function q(e,t=""){let n=typeof e=="string"?e:e.source,o={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(Q.caret,"$1"),n=n.replace(r,s),o},getRegex:()=>new RegExp(n,t)};return o}var Yr=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Q={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i")},en=/^(?:[ \t]*(?:\n|$))+/,tn=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,rn=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ae=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,nn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,st=/(?:[*+-]|\d{1,9}[.)])/,Qt=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Jt=q(Qt).replace(/bull/g,st).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),on=q(Qt).replace(/bull/g,st).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),at=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,sn=/^[^\n]+/,it=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,an=q(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",it).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),cn=q(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,st).getRegex(),je="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ct=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ln=q("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ct).replace("tag",je).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Yt=q(at).replace("hr",Ae).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",je).getRegex(),dn=q(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Yt).getRegex(),lt={blockquote:dn,code:tn,def:an,fences:rn,heading:nn,hr:Ae,html:ln,lheading:Jt,list:cn,newline:en,paragraph:Yt,table:Me,text:sn},Wt=q("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ae).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",je).getRegex(),pn={...lt,lheading:on,table:Wt,paragraph:q(at).replace("hr",Ae).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Wt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",je).getRegex()},hn={...lt,html:q(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ct).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:q(at).replace("hr",Ae).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Jt).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},un=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,gn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,er=/^( {2,}|\\)\n(?!\s*$)/,fn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Be=/[\p{P}\p{S}]/u,dt=/[\s\p{P}\p{S}]/u,tr=/[^\s\p{P}\p{S}]/u,mn=q(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,dt).getRegex(),rr=/(?!~)[\p{P}\p{S}]/u,bn=/(?!~)[\s\p{P}\p{S}]/u,xn=/(?:[^\s\p{P}\p{S}]|~)/u,vn=q(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Yr?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),nr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,kn=q(nr,"u").replace(/punct/g,Be).getRegex(),wn=q(nr,"u").replace(/punct/g,rr).getRegex(),or="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",yn=q(or,"gu").replace(/notPunctSpace/g,tr).replace(/punctSpace/g,dt).replace(/punct/g,Be).getRegex(),Nn=q(or,"gu").replace(/notPunctSpace/g,xn).replace(/punctSpace/g,bn).replace(/punct/g,rr).getRegex(),Tn=q("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,tr).replace(/punctSpace/g,dt).replace(/punct/g,Be).getRegex(),Sn=q(/\\(punct)/,"gu").replace(/punct/g,Be).getRegex(),Cn=q(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Rn=q(ct).replace("(?:-->|$)","-->").getRegex(),$n=q("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Rn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Fe=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,En=q(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Fe).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),sr=q(/^!?\[(label)\]\[(ref)\]/).replace("label",Fe).replace("ref",it).getRegex(),ar=q(/^!?\[(ref)\](?:\[\])?/).replace("ref",it).getRegex(),In=q("reflink|nolink(?!\\()","g").replace("reflink",sr).replace("nolink",ar).getRegex(),Dt=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,pt={_backpedal:Me,anyPunctuation:Sn,autolink:Cn,blockSkip:vn,br:er,code:gn,del:Me,emStrongLDelim:kn,emStrongRDelimAst:yn,emStrongRDelimUnd:Tn,escape:un,link:En,nolink:ar,punctuation:mn,reflink:sr,reflinkSearch:In,tag:$n,text:fn,url:Me},zn={...pt,link:q(/^!?\[(label)\]\((.*?)\)/).replace("label",Fe).getRegex(),reflink:q(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Fe).getRegex()},tt={...pt,emStrongRDelimAst:Nn,emStrongLDelim:wn,url:q(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Dt).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:q(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Dt).getRegex()},Mn={...tt,br:q(er).replace("{2,}","*").getRegex(),text:q(tt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},He={normal:lt,gfm:pn,pedantic:hn},Ee={normal:pt,gfm:tt,breaks:Mn,pedantic:zn},An={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Vt=e=>An[e];function he(e,t){if(t){if(Q.escapeTest.test(e))return e.replace(Q.escapeReplace,Vt)}else if(Q.escapeTestNoEncode.test(e))return e.replace(Q.escapeReplaceNoEncode,Vt);return e}function Zt(e){try{e=encodeURI(e).replace(Q.percentDecode,"%")}catch{return null}return e}function Kt(e,t){let n=e.replace(Q.findPipe,(a,s,i)=>{let c=!1,l=s;for(;--l>=0&&i[l]==="\\";)c=!c;return c?"|":" |"}),o=n.split(Q.splitPipe),r=0;if(o[0].trim()||o.shift(),o.length>0&&!o.at(-1)?.trim()&&o.pop(),t)if(o.length>t)o.splice(t);else for(;o.length<t;)o.push("");for(;r<o.length;r++)o[r]=o[r].trim().replace(Q.slashPipe,"|");return o}function Ie(e,t,n){let o=e.length;if(o===0)return"";let r=0;for(;r<o;){let a=e.charAt(o-r-1);if(a===t&&!n)r++;else if(a!==t&&n)r++;else break}return e.slice(0,o-r)}function Pn(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let o=0;o<e.length;o++)if(e[o]==="\\")o++;else if(e[o]===t[0])n++;else if(e[o]===t[1]&&(n--,n<0))return o;return n>0?-2:-1}function Gt(e,t,n,o,r){let a=t.href,s=t.title||null,i=e[1].replace(r.other.outputLinkReplace,"$1");o.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:i,tokens:o.inlineTokens(i)};return o.state.inLink=!1,c}function On(e,t,n){let o=e.match(n.other.indentCodeCompensation);if(o===null)return t;let r=o[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[i]=s;return i.length>=r.length?a.slice(r.length):a}).join(`
`)}var qe=class{options;rules;lexer;constructor(e){this.options=e||ye}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Ie(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],o=On(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:o}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let o=Ie(n,"#");(this.options.pedantic||!o||this.rules.other.endingSpaceChar.test(o))&&(n=o.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Ie(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Ie(t[0],`
`).split(`
`),o="",r="",a=[];for(;n.length>0;){let s=!1,i=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))i.push(n[c]),s=!0;else if(!s)i.push(n[c]);else break;n=n.slice(c);let l=i.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");o=o?`${o}
${l}`:l,r=r?`${r}
${u}`:u;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=f,n.length===0)break;let h=a.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let v=h,x=v.raw+`
`+n.join(`
`),S=this.blockquote(x);a[a.length-1]=S,o=o.substring(0,o.length-v.raw.length)+S.raw,r=r.substring(0,r.length-v.text.length)+S.text;break}else if(h?.type==="list"){let v=h,x=v.raw+`
`+n.join(`
`),S=this.list(x);a[a.length-1]=S,o=o.substring(0,o.length-h.raw.length)+S.raw,r=r.substring(0,r.length-v.raw.length)+S.raw,n=x.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:o,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),o=n.length>1,r={type:"list",raw:"",ordered:o,start:o?+n.slice(0,-1):"",loose:!1,items:[]};n=o?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=o?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let c=!1,l="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let f=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,A=>" ".repeat(3*A.length)),h=e.split(`
`,1)[0],v=!f.trim(),x=0;if(this.options.pedantic?(x=2,u=f.trimStart()):v?x=t[1].length+1:(x=t[2].search(this.rules.other.nonSpaceChar),x=x>4?1:x,u=f.slice(x),x+=t[1].length),v&&this.rules.other.blankLine.test(h)&&(l+=h+`
`,e=e.substring(h.length+1),c=!0),!c){let A=this.rules.other.nextBulletRegex(x),P=this.rules.other.hrRegex(x),H=this.rules.other.fencesBeginRegex(x),E=this.rules.other.headingBeginRegex(x),$=this.rules.other.htmlBeginRegex(x);for(;e;){let C=e.split(`
`,1)[0],M;if(h=C,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),M=h):M=h.replace(this.rules.other.tabCharGlobal,"    "),H.test(h)||E.test(h)||$.test(h)||A.test(h)||P.test(h))break;if(M.search(this.rules.other.nonSpaceChar)>=x||!h.trim())u+=`
`+M.slice(x);else{if(v||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||H.test(f)||E.test(f)||P.test(f))break;u+=`
`+h}!v&&!h.trim()&&(v=!0),l+=C+`
`,e=e.substring(C.length+1),f=M.slice(x)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(s=!0));let S=null,I;this.options.gfm&&(S=this.rules.other.listIsTask.exec(u),S&&(I=S[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:l,task:!!S,checked:I,loose:!1,text:u,tokens:[]}),r.raw+=l}let i=r.items.at(-1);if(i)i.raw=i.raw.trimEnd(),i.text=i.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let c=0;c<r.items.length;c++)if(this.lexer.state.top=!1,r.items[c].tokens=this.lexer.blockTokens(r.items[c].text,[]),!r.loose){let l=r.items[c].tokens.filter(f=>f.type==="space"),u=l.length>0&&l.some(f=>this.rules.other.anyLine.test(f.raw));r.loose=u}if(r.loose)for(let c=0;c<r.items.length;c++)r.items[c].loose=!0;return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),o=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:o,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Kt(t[1]),o=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===o.length){for(let s of o)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(Kt(s,a.header.length).map((i,c)=>({text:i,tokens:this.lexer.inline(i),header:!1,align:a.align[c]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Ie(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Pn(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let o=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(o);a&&(o=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return o=o.trim(),this.rules.other.startAngleBracket.test(o)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?o=o.slice(1):o=o.slice(1,-1)),Gt(t,{href:o&&o.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let o=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[o.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Gt(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let o=this.rules.inline.emStrongLDelim.exec(e);if(!(!o||o[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(o[1]||o[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...o[0]].length-1,a,s,i=r,c=0,l=o[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(o=l.exec(t))!=null;){if(a=o[1]||o[2]||o[3]||o[4]||o[5]||o[6],!a)continue;if(s=[...a].length,o[3]||o[4]){i+=s;continue}else if((o[5]||o[6])&&r%3&&!((r+s)%3)){c+=s;continue}if(i-=s,i>0)continue;s=Math.min(s,s+i+c);let u=[...o[0]][0].length,f=e.slice(0,r+o.index+u+s);if(Math.min(r,s)%2){let v=f.slice(1,-1);return{type:"em",raw:f,text:v,tokens:this.lexer.inlineTokens(v)}}let h=f.slice(2,-2);return{type:"strong",raw:f,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),o=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return o&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,o;return t[2]==="@"?(n=t[1],o="mailto:"+n):(n=t[1],o=n),{type:"link",raw:t[0],text:n,href:o,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,o;if(t[2]==="@")n=t[0],o="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?o="http://"+t[0]:o=t[0]}return{type:"link",raw:t[0],text:n,href:o,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},re=class rt{tokens;options;state;tokenizer;inlineQueue;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||ye,this.options.tokenizer=this.options.tokenizer||new qe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Q,block:He.normal,inline:Ee.normal};this.options.pedantic?(n.block=He.pedantic,n.inline=Ee.pedantic):this.options.gfm&&(n.block=He.gfm,this.options.breaks?n.inline=Ee.breaks:n.inline=Ee.gfm),this.tokenizer.rules=n}static get rules(){return{block:He,inline:Ee}}static lex(t,n){return new rt(n).lex(t)}static lexInline(t,n){return new rt(n).inlineTokens(t)}lex(t){t=t.replace(Q.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let o=this.inlineQueue[n];this.inlineTokens(o.src,o.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],o=!1){for(this.options.pedantic&&(t=t.replace(Q.tabCharGlobal,"    ").replace(Q.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let s=n.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let a=t;if(this.options.extensions?.startBlock){let s=1/0,i=t.slice(1),c;this.options.extensions.startBlock.forEach(l=>{c=l.call({lexer:this},i),typeof c=="number"&&c>=0&&(s=Math.min(s,c))}),s<1/0&&s>=0&&(a=t.substring(0,s+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let s=n.at(-1);o&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r),o=a.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let o=t,r=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(o))!=null;)c.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(o=o.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(o))!=null;)o=o.slice(0,r.index)+"++"+o.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(o))!=null;)a=r[2]?r[2].length:0,o=o.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);o=this.options.hooks?.emStrongMask?.call({lexer:this},o)??o;let s=!1,i="";for(;t;){s||(i=""),s=!1;let c;if(this.options.extensions?.inline?.some(u=>(c=u.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let u=n.at(-1);c.type==="text"&&u?.type==="text"?(u.raw+=c.raw,u.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,o,i)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let l=t;if(this.options.extensions?.startInline){let u=1/0,f=t.slice(1),h;this.options.extensions.startInline.forEach(v=>{h=v.call({lexer:this},f),typeof h=="number"&&h>=0&&(u=Math.min(u,h))}),u<1/0&&u>=0&&(l=t.substring(0,u+1))}if(c=this.tokenizer.inlineText(l)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(i=c.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=c.raw,u.text+=c.text):n.push(c);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},Ue=class{options;parser;constructor(e){this.options=e||ye}space(e){return""}code({text:e,lang:t,escaped:n}){let o=(t||"").match(Q.notSpaceStart)?.[0],r=e.replace(Q.endingNewline,"")+`
`;return o?'<pre><code class="language-'+he(o)+'">'+(n?r:he(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:he(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,o="";for(let s=0;s<e.items.length;s++){let i=e.items[s];o+=this.listitem(i)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
`+o+"</"+r+`>
`}listitem(e){let t="";if(e.task){let n=this.checkbox({checked:!!e.checked});e.loose?e.tokens[0]?.type==="paragraph"?(e.tokens[0].text=n+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=n+" "+he(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):t+=n+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let o="";for(let r=0;r<e.rows.length;r++){let a=e.rows[r];n="";for(let s=0;s<a.length;s++)n+=this.tablecell(a[s]);o+=this.tablerow({text:n})}return o&&(o=`<tbody>${o}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+o+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${he(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let o=this.parser.parseInline(n),r=Zt(e);if(r===null)return o;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+he(t)+'"'),a+=">"+o+"</a>",a}image({href:e,title:t,text:n,tokens:o}){o&&(n=this.parser.parseInline(o,this.parser.textRenderer));let r=Zt(e);if(r===null)return he(n);e=r;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${he(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:he(e.text)}},ht=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}},le=class nt{options;renderer;textRenderer;constructor(t){this.options=t||ye,this.options.renderer=this.options.renderer||new Ue,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ht}static parse(t,n){return new nt(n).parse(t)}static parseInline(t,n){return new nt(n).parseInline(t)}parse(t,n=!0){let o="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let i=a,c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){o+=c||"";continue}}let s=a;switch(s.type){case"space":{o+=this.renderer.space(s);continue}case"hr":{o+=this.renderer.hr(s);continue}case"heading":{o+=this.renderer.heading(s);continue}case"code":{o+=this.renderer.code(s);continue}case"table":{o+=this.renderer.table(s);continue}case"blockquote":{o+=this.renderer.blockquote(s);continue}case"list":{o+=this.renderer.list(s);continue}case"html":{o+=this.renderer.html(s);continue}case"def":{o+=this.renderer.def(s);continue}case"paragraph":{o+=this.renderer.paragraph(s);continue}case"text":{let i=s,c=this.renderer.text(i);for(;r+1<t.length&&t[r+1].type==="text";)i=t[++r],c+=`
`+this.renderer.text(i);n?o+=this.renderer.paragraph({type:"paragraph",raw:c,text:c,tokens:[{type:"text",raw:c,text:c,escaped:!0}]}):o+=c;continue}default:{let i='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return o}parseInline(t,n=this.renderer){let o="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let i=this.options.extensions.renderers[a.type].call({parser:this},a);if(i!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){o+=i||"";continue}}let s=a;switch(s.type){case"escape":{o+=n.text(s);break}case"html":{o+=n.html(s);break}case"link":{o+=n.link(s);break}case"image":{o+=n.image(s);break}case"strong":{o+=n.strong(s);break}case"em":{o+=n.em(s);break}case"codespan":{o+=n.codespan(s);break}case"br":{o+=n.br(s);break}case"del":{o+=n.del(s);break}case"text":{o+=n.text(s);break}default:{let i='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return o}},ze=class{options;block;constructor(e){this.options=e||ye}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?re.lex:re.lexInline}provideParser(){return this.block?le.parse:le.parseInline}},Ln=class{defaults=ot();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=le;Renderer=Ue;TextRenderer=ht;Lexer=re;Tokenizer=qe;Hooks=ze;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let o of e)switch(n=n.concat(t.call(this,o)),o.type){case"table":{let r=o;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=o;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=o;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let o={...n};if(o.async=this.defaults.async||o.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let i=r.renderer.apply(this,s);return i===!1&&(i=a.apply(this,s)),i}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),o.extensions=t),n.renderer){let r=this.defaults.renderer||new Ue(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,i=n.renderer[s],c=r[s];r[s]=(...l)=>{let u=i.apply(r,l);return u===!1&&(u=c.apply(r,l)),u||""}}o.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new qe(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,i=n.tokenizer[s],c=r[s];r[s]=(...l)=>{let u=i.apply(r,l);return u===!1&&(u=c.apply(r,l)),u}}o.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new ze;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,i=n.hooks[s],c=r[s];ze.passThroughHooks.has(a)?r[s]=l=>{if(this.defaults.async&&ze.passThroughHooksRespectAsync.has(a))return(async()=>{let f=await i.call(r,l);return c.call(r,f)})();let u=i.call(r,l);return c.call(r,u)}:r[s]=(...l)=>{if(this.defaults.async)return(async()=>{let f=await i.apply(r,l);return f===!1&&(f=await c.apply(r,l)),f})();let u=i.apply(r,l);return u===!1&&(u=c.apply(r,l)),u}}o.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;o.walkTokens=function(s){let i=[];return i.push(a.call(this,s)),r&&(i=i.concat(r.call(this,s))),i}}this.defaults={...this.defaults,...o}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return re.lex(e,t??this.defaults)}parser(e,t){return le.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let o={...n},r={...this.defaults,...o},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&o.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,i=await(r.hooks?await r.hooks.provideLexer():e?re.lex:re.lexInline)(s,r),c=r.hooks?await r.hooks.processAllTokens(i):i;r.walkTokens&&await Promise.all(this.walkTokens(c,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():e?le.parse:le.parseInline)(c,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?re.lex:re.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let i=(r.hooks?r.hooks.provideParser():e?le.parse:le.parseInline)(s,r);return r.hooks&&(i=r.hooks.postprocess(i)),i}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let o="<p>An error occurred:</p><pre>"+he(n.message+"",!0)+"</pre>";return t?Promise.resolve(o):o}if(t)return Promise.reject(n);throw n}}},we=new Ln;function B(e,t){return we.parse(e,t)}B.options=B.setOptions=function(e){return we.setOptions(e),B.defaults=we.defaults,Xt(B.defaults),B};B.getDefaults=ot;B.defaults=ye;B.use=function(...e){return we.use(...e),B.defaults=we.defaults,Xt(B.defaults),B};B.walkTokens=function(e,t){return we.walkTokens(e,t)};B.parseInline=we.parseInline;B.Parser=le;B.parser=le.parse;B.Renderer=Ue;B.TextRenderer=ht;B.Lexer=re;B.lexer=re.lex;B.Tokenizer=qe;B.Hooks=ze;B.parse=B;var No=B.options,To=B.setOptions,So=B.use,Co=B.walkTokens,Ro=B.parseInline;var $o=le.parse,Eo=re.lex;function ut(e,t="https://example.invalid/"){try{let n=new URL(e,t);return["https:","http:","mailto:"].includes(n.protocol)?n.href:null}catch{return null}}function gt(e){let t={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\xA0"};return e.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(n,o)=>{if(!o.startsWith("#"))return t[o.toLowerCase()]??n;let r=o.toLowerCase().startsWith("#x")?Number.parseInt(o.slice(2),16):Number.parseInt(o.slice(1),10);return r>0&&r<=1114111&&!(r>=55296&&r<=57343)?String.fromCodePoint(r):"\uFFFD"})}var _=require("react/jsx-runtime");function _n({text:e,lang:t,t:n}){let[o,r]=(0,be.useState)(!1);return(0,_.jsxs)("div",{className:"ch-code-block",children:[(0,_.jsxs)("header",{children:[(0,_.jsx)("span",{children:t||"text"}),(0,_.jsx)("button",{className:"ch-mini-button",onClick:()=>{navigator.clipboard.writeText(e).then(()=>r(!0)).catch(()=>r(!1))},children:n(o?"copied":"copyRecord")})]}),(0,_.jsx)("pre",{children:(0,_.jsx)("code",{children:e})})]})}function ir(e,t,n=0){return n>16?e.map(o=>o.raw).join(""):e.map((o,r)=>{let a=i=>ir(i,t,n+1),s;switch(o.type){case"space":s=null;break;case"paragraph":s=(0,_.jsx)("p",{children:a(o.tokens)});break;case"heading":{let i=o;s=(0,be.createElement)(`h${Math.min(6,Math.max(2,i.depth+1))}`,null,a(i.tokens));break}case"text":{let i=o;s=i.tokens?a(i.tokens):gt(i.text);break}case"escape":s=gt(o.text);break;case"strong":s=(0,_.jsx)("strong",{children:a(o.tokens)});break;case"em":s=(0,_.jsx)("em",{children:a(o.tokens)});break;case"del":s=(0,_.jsx)("del",{children:a(o.tokens)});break;case"codespan":s=(0,_.jsx)("code",{children:o.text});break;case"code":{let i=o;s=(0,_.jsx)(_n,{text:i.text,lang:i.lang,t});break}case"blockquote":s=(0,_.jsx)("blockquote",{children:a(o.tokens)});break;case"br":s=(0,_.jsx)("br",{});break;case"hr":s=(0,_.jsx)("hr",{});break;case"list":{let i=o,c=i.items.map((l,u)=>(0,_.jsxs)("li",{children:[l.task&&(0,_.jsxs)("span",{className:"ch-task-state","aria-label":t(l.checked?"taskChecked":"taskUnchecked"),children:[l.checked?"\u2611":"\u2610"," "]}),a(l.tokens)]},u));s=i.ordered?(0,_.jsx)("ol",{start:typeof i.start=="number"?i.start:1,children:c}):(0,_.jsx)("ul",{children:c});break}case"table":{let i=o;s=(0,_.jsx)("div",{className:"ch-rich-table",children:(0,_.jsxs)("table",{children:[(0,_.jsx)("thead",{children:(0,_.jsx)("tr",{children:i.header.map((c,l)=>(0,_.jsx)("th",{children:a(c.tokens)},l))})}),(0,_.jsx)("tbody",{children:i.rows.map((c,l)=>(0,_.jsx)("tr",{children:c.map((u,f)=>(0,_.jsx)("td",{children:a(u.tokens)},f))},l))})]})});break}case"link":{let i=o,c=ut(i.href,location.href);s=c?(0,_.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:a(i.tokens)}):(0,_.jsx)("span",{children:a(i.tokens)});break}case"image":{let i=o,c=ut(i.href,location.href),l=`${t("imageLink")}: ${i.text||i.href}`;s=c?(0,_.jsx)("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:l}):(0,_.jsx)("span",{children:l});break}case"def":s=null;break;default:s=(0,_.jsx)("span",{children:o.raw})}return(0,_.jsx)(be.Fragment,{children:s},r)})}function cr({text:e,t}){let n=(0,be.useMemo)(()=>re.lex(e,{gfm:!0,breaks:!1}),[e]);return(0,_.jsx)("div",{className:"ch-rich-text",children:ir(n,t)})}var w=require("react/jsx-runtime");function We(e,t,n){return e.kind==="user"||e.kind==="assistant"?_e(e.text)||n(e.kind):t??e.toolName??(e.eventType==="tool/result"?n("toolOutput"):e.title)}function Hn({item:e,title:t,pairedItem:n,onFocus:o,t:r}){let[a,s]=(0,J.useState)(e.kind==="user"||e.kind==="assistant"),[i,c]=(0,J.useState)(!1),l=e.arguments??e.text;return(0,w.jsxs)("section",{className:"ch-record-detail","aria-label":r("recordDetails"),children:[(0,w.jsxs)("header",{children:[(0,w.jsxs)("div",{className:"ch-detail-title-row",children:[(0,w.jsxs)("span",{className:`ch-record-kind ch-dot-pill ${e.isError===!0?"is-err":""}`,children:[(0,w.jsx)("i",{style:{background:e.isError===!0?"var(--ch-danger)":ke[e.kind]}}),r(e.kind)]}),(0,w.jsx)("strong",{title:t,children:t}),(0,w.jsx)(Je,{item:e,t:r})]}),(0,w.jsxs)("div",{className:"ch-detail-controls",children:[n&&(0,w.jsx)("button",{className:"ch-mini-button ch-pair-jump",onClick:()=>o(n.id),children:n.eventType==="tool/result"?`${r("jumpResult")} \u2197`:`${r("jumpCall")} \u2196`}),(0,w.jsxs)("div",{className:"ch-seg",role:"group",children:[(0,w.jsx)("button",{className:a?"is-active":"","aria-pressed":a,onClick:()=>s(!0),children:r("renderedText")}),(0,w.jsx)("button",{className:a?"":"is-active","aria-pressed":!a,onClick:()=>s(!1),children:r("sourceText")})]}),(0,w.jsx)("button",{className:"ch-mini-button",onClick:()=>{navigator.clipboard.writeText(e.text).then(()=>c(!0)).catch(()=>c(!1))},children:r(i?"copied":"copyRecord")})]})]}),(0,w.jsxs)("div",{className:"ch-record-meta",children:[(0,w.jsxs)("span",{children:["#",e.seq]}),(0,w.jsx)("span",{title:r("recordTime"),children:e.time===void 0?r("unavailable"):xe(e.time)}),e.eventType&&(0,w.jsx)("span",{children:e.eventType}),e.callId&&(0,w.jsxs)("span",{title:e.callId,children:["Call ID \xB7 ",e.callId]})]}),(0,w.jsx)(zt,{item:e,t:r}),(0,w.jsx)("div",{className:"ch-record-content",children:e.text.length===0?(0,w.jsx)("p",{className:"ch-note",children:r("blank")}):a?(0,w.jsx)(cr,{text:e.text,t:r}):(0,w.jsx)("pre",{className:"ch-source-text",children:(0,w.jsx)("code",{children:l||"\u2014"})})})]})}function lr({items:e,pairs:t,available:n,toolByRecord:o,focus:r,onFocus:a,onJumpRecord:s,filter:i,onFilter:c,query:l,onQuery:u,errorsOnly:f,onErrorsOnly:h,loading:v,error:x,hasMore:S,older:I,latest:A,isOlder:P,retry:H,t:E}){let $=(0,J.useDeferredValue)(l),[C,M]=(0,J.useState)(!0),[U,R]=(0,J.useState)(()=>new Set(["user","assistant"])),b=(0,J.useMemo)(()=>new Map(e.map(m=>[m.id,m])),[e]),N=(0,J.useMemo)(()=>e.filter(m=>m.isError===!0).length,[e]),T=(0,J.useMemo)(()=>{let m=0,F=0,ie=0;for(let ce of e)ce.kind==="user"||ce.kind==="assistant"?m+=1:ce.kind==="tool"?F+=1:ie+=1;return{all:e.length,messages:m,tool:F,event:ie}},[e]),O=(0,J.useMemo)(()=>{let m=$.trim().toLocaleLowerCase();return e.filter(F=>f&&F.isError!==!0||(i==="messages"?F.kind!=="user"&&F.kind!=="assistant":i!=="all"&&F.kind!==i)?!1:m?m.startsWith("tool:")?o.get(F.id)?.toLocaleLowerCase()===m.slice(5):`${We(F,o.get(F.id),E)} ${F.text}`.toLocaleLowerCase().includes(m):!0)},[e,i,$,f,o,E]),z=O.find(m=>m.id===r)??O.findLast(m=>m.kind==="assistant"||m.kind==="user")??O.at(-1);(0,J.useEffect)(()=>{l!==$||!z||(z.id!==r&&a(z.id),R(m=>m.has(z.kind)?m:new Set([...m,z.kind])))},[z?.id,r,l,$,a]);let se=(0,J.useMemo)(()=>new Map(e.map((m,F)=>[m.id,F+1])),[e]),p=O.findIndex(m=>m.id===z?.id),j=m=>{let F=o.get(m.id),ie=m.toolName??F??E(m.kind);return(0,w.jsxs)("button",{className:`ch-record-item ch-record-${m.kind} ${z?.id===m.id?"is-selected":""} ${m.isError===!0?"is-error-row":""}`,"aria-pressed":z?.id===m.id,title:We(m,F,E),onClick:()=>a(m.id),children:[(0,w.jsxs)("span",{className:"ch-record-seq",title:`Seq ${m.seq}`,children:["#",se.get(m.id)]}),(0,w.jsxs)("span",{className:`ch-dot-pill ch-row-role ${m.isError===!0?"is-err":""}`,children:[(0,w.jsx)("i",{style:{background:m.isError===!0?"var(--ch-danger)":ke[m.kind]}}),ie]}),(0,w.jsx)("span",{className:"ch-record-title",children:We(m,F,E)}),(0,w.jsx)(Je,{item:m,t:E}),(0,w.jsx)("span",{className:"ch-record-time",children:m.time===void 0?"":xe(m.time)})]},m.id)},D={user:"userMessages",assistant:"assistantMessages",tool:"tools",event:"events"},X=z?b.get(t.get(z.id)??""):void 0;return(0,w.jsxs)(ve,{title:E("browserTitle"),className:"ch-browser-card",aside:(0,w.jsxs)("span",{className:"ch-scope",children:[E("browserScope")," \xB7 ",n?e.length:"\u2014"]}),children:[(0,w.jsxs)("div",{className:"ch-browser-toolbar",children:[(0,w.jsx)("div",{className:"ch-filter",role:"group","aria-label":E("history"),children:["all","messages","tool","event"].map(m=>{let F=E(m==="tool"?"tools":m==="event"?"events":m);return(0,w.jsxs)("button",{className:i===m?"is-active":"","aria-label":F,"aria-pressed":i===m,onClick:()=>c(m),children:[F,(0,w.jsx)("span",{className:"ch-filter-count",children:n?T[m]:"\u2014"})]},m)})}),(0,w.jsxs)("div",{className:"ch-seg",role:"group",children:[(0,w.jsx)("button",{className:C?"is-active":"","aria-pressed":C,onClick:()=>M(!0),children:E("categories")}),(0,w.jsx)("button",{className:C?"":"is-active","aria-pressed":!C,onClick:()=>M(!1),children:E("chronological")})]})]}),(0,w.jsxs)("div",{className:"ch-browser-search",children:[(0,w.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2","aria-hidden":"true",children:[(0,w.jsx)("circle",{cx:"11",cy:"11",r:"8"}),(0,w.jsx)("path",{d:"m21 21-4.3-4.3"})]}),(0,w.jsx)("input",{value:l,onChange:m=>u(m.target.value),placeholder:E("searchRecords"),"aria-label":E("searchRecords")}),l&&(0,w.jsx)("button",{className:"ch-mini-button",onClick:()=>u(""),"aria-label":E("all"),children:"\xD7"}),(N>0||f)&&(0,w.jsx)("button",{className:`ch-chip ch-err-toggle ${f?"is-active":""}`,"aria-pressed":f,onClick:()=>h(!f),children:E("errorsOnly")}),(0,w.jsxs)("span",{children:[n?O.length:"\u2014","/",n?e.length:"\u2014"]})]}),x&&(0,w.jsxs)("div",{className:"ch-error",role:"alert",children:[(0,w.jsxs)("span",{children:[E("historyError")," ",x]}),(0,w.jsx)("button",{className:"ch-mini-button",onClick:H,children:E("retry")})]}),(0,w.jsx)("div",{className:"ch-browser-records","aria-busy":v||$!==l,children:v&&e.length===0?(0,w.jsx)("p",{className:"ch-note",children:E("historyLoading")}):O.length===0?(0,w.jsx)("p",{className:"ch-note",children:E(n?l||f?"noMatches":"noHistory":"unavailable")}):C?["user","assistant","tool","event"].map(m=>{let F=O.filter(ie=>ie.kind===m);return i==="messages"&&m!=="user"&&m!=="assistant"||i!=="messages"&&i!=="all"&&i!==m?null:(0,w.jsxs)("section",{className:`ch-record-group ch-group-${m}`,children:[(0,w.jsxs)("button",{className:"ch-group-heading","aria-expanded":U.has(m),disabled:F.length===0,onClick:()=>R(ie=>{let ce=new Set(ie);return ce.has(m)?ce.delete(m):ce.add(m),ce}),children:[(0,w.jsx)("span",{"aria-hidden":"true",children:U.has(m)?"\u25BE":"\u25B8"}),(0,w.jsx)("b",{children:E(D[m])}),(0,w.jsx)("span",{className:"ch-tab-count",children:F.length})]}),U.has(m)&&F.map(j)]},m)}):O.map(j)}),(0,w.jsxs)("div",{className:"ch-record-navigation",children:[(0,w.jsx)("span",{className:"ch-note",children:E("historyWindow")}),(0,w.jsxs)("div",{children:[(0,w.jsx)("button",{className:"ch-mini-button",disabled:p<=0,onClick:()=>a(O[p-1].id),children:E("prevRecord")}),(0,w.jsxs)("span",{children:[n?p<0?0:p+1:"\u2014","/",n?O.length:"\u2014"]}),(0,w.jsx)("button",{className:"ch-mini-button",disabled:p<0||p===O.length-1,onClick:()=>a(O[p+1].id),children:E("nextRecord")})]})]}),z&&(0,w.jsx)(Hn,{item:z,title:We(z,o.get(z.id),E),pairedItem:X,onFocus:s,t:E},z.id),(0,w.jsxs)("footer",{className:"ch-browser-footer",children:[(0,w.jsx)("p",{className:"ch-note",children:E("historyNote")}),(0,w.jsxs)("div",{children:[P&&(0,w.jsx)("button",{className:"ch-mini-button",disabled:v,onClick:A,children:E("latestWindow")}),S&&(0,w.jsx)("button",{className:"ch-button",disabled:v,onClick:I,children:E(v?"historyLoading":"older")})]})]})]})}var ne=require("react/jsx-runtime");function dr({usage:e,history:t,rows:n,selected:o,currentTitle:r,currentHarness:a,onSelect:s,retry:i,t:c}){let l=(0,ee.useRef)(null),[u,f]=(0,ee.useState)(),[h,v]=(0,ee.useState)("all"),[x,S]=(0,ee.useState)(""),[I,A]=(0,ee.useState)(!1),[P,H]=(0,ee.useState)("files"),E=(0,ee.useMemo)(()=>t.page?Lt(t.page.items):null,[t.page]),$=(0,ee.useMemo)(()=>Ft(n,o),[n,o]),C=t.page?.items??[],M=(0,ee.useMemo)(()=>Ot(C),[C]),U=(0,ee.useMemo)(()=>C.filter(T=>T.isError===!0).length,[C]),R=(0,ee.useMemo)(()=>{let T=new Map;for(let O of E?.tools??[])for(let z of O.recordIds)T.set(z,O.name);return T},[E]),b=T=>{requestAnimationFrame(()=>l.current?.querySelector(T)?.scrollIntoView({block:"nearest"}))},N=(T,O=!0)=>{f(T),v("all"),S(""),A(!1),O&&b(".ch-browser-card")};return(0,ne.jsxs)("div",{className:"ch-inspector",ref:l,children:[(0,ne.jsxs)("div",{className:"ch-hero-grid",children:[(0,ne.jsx)($t,{usage:e.usage,samples:e.samples,t:c}),(0,ne.jsx)(Et,{usage:e.usage,t:c}),(0,ne.jsx)(It,{usage:e.usage,summary:E,errorCount:U,onKind:T=>{v(T),S(""),A(!1),b(".ch-browser-card")},onSignalTab:T=>{H(T),b(".ch-signals-card")},onErrors:()=>{v("all"),S(""),A(!0),b(".ch-browser-card")},t:c})]}),(0,ne.jsxs)("div",{className:"ch-workbench",children:[(0,ne.jsxs)("div",{className:"ch-workbench-left",children:[(0,ne.jsx)(jt,{items:C,pairs:M,available:t.page!==null,loading:t.loading,focus:u,onFocus:T=>N(T,!1),t:c}),(0,ne.jsx)(Bt,{tab:P,onTab:H,summary:E,related:$,currentTitle:r,currentHarness:a,items:C,onFocus:N,onSelect:s,t:c})]}),(0,ne.jsx)(lr,{items:C,pairs:M,available:t.page!==null,toolByRecord:R,focus:u,onFocus:f,onJumpRecord:T=>N(T,!1),filter:h,onFilter:v,query:x,onQuery:S,errorsOnly:I,onErrorsOnly:A,loading:t.loading,error:t.error,hasMore:t.page?.hasMore??!1,older:t.older,latest:t.latest,isOlder:t.isOlder,retry:i,t:c})]}),(0,ne.jsxs)("p",{className:"ch-data-note",children:["\u24D8 ",c("limitsNote")]})]})}var ge=require("react");var y=require("react/jsx-runtime");function ft(e){return e?e.split(/[\\/]/).filter(Boolean).at(-1)??null:null}function Fn(e,t){return e.origin==="subagent"?t("relationSubagent"):e.forkParentId?t("relationFork"):e.treeParentId?t("relationTree"):null}function qn({percent:e}){let n=2*Math.PI*21,r=(e===null?0:Math.min(100,Math.max(0,e)))/100*n,a=e===null?"is-none":e>=85?"is-danger":e>=65?"is-warn":"is-normal";return(0,y.jsxs)("div",{className:`ch-mini-ring ${a}`,"aria-hidden":"true",children:[(0,y.jsxs)("svg",{viewBox:"0 0 54 54",children:[(0,y.jsx)("circle",{cx:"27",cy:"27",r:21,className:"ch-mini-ring-track",strokeDasharray:e===null?"3 3":void 0}),e!==null&&(0,y.jsx)("circle",{cx:"27",cy:"27",r:21,className:"ch-mini-ring-fill",strokeDasharray:`${r.toFixed(1)} ${n.toFixed(1)}`})]}),(0,y.jsx)("span",{children:e===null?"\u2014":`${Math.round(e)}%`})]})}function pr({rows:e,usageById:t,loading:n,error:o,selected:r,hasSelected:a,pageIndex:s,hasNext:i,onPrev:c,onNext:l,onSelect:u,onRetry:f,t:h}){let[v,x]=(0,ge.useState)("all"),[S,I]=(0,ge.useState)(""),[A,P]=(0,ge.useState)("recent"),H=(0,ge.useMemo)(()=>e.filter(R=>te(R.id)),[e]),E=(0,ge.useMemo)(()=>{let R=new Map;for(let b of H){let N=ft(b.cwd);N&&R.set(N,(R.get(N)??0)+1)}return[...R.entries()]},[H]),$=v!=="all"&&E.some(([R])=>R===v)?v:"all",C=(0,ge.useMemo)(()=>{let R=new Map,b=null,N=0,T=!1,O=0,z=!1,se=!1,p=0;for(let j of H){let D=j.harness??"CodexHost";R.set(D,(R.get(D)??0)+1);let X=t.get(j.id)??null;if(X){p+=1,X.totalTokens!==void 0&&(N+=X.totalTokens,T=!0),X.totalCostUsd!==void 0&&(O+=X.totalCostUsd,z=!0),(X.unpricedModels?.length??0)>0&&(se=!0);let m=me(X);m&&(!b||m.percent>b.percent)&&(b={title:j.title||j.id,percent:m.percent,used:m.used,capacity:m.capacity})}}return{harnesses:[...R.entries()],peak:b,totalTokens:N,hasTokens:T,totalCost:O,hasCost:z,hasLowerBound:se,withTelemetry:p}},[H,t]),M=(0,ge.useMemo)(()=>{let R=S.trim().toLocaleLowerCase();return[...H.filter(N=>$!=="all"&&ft(N.cwd)!==$?!1:R?`${N.title} ${N.harness??""} ${N.cwd??""}`.toLocaleLowerCase().includes(R):!0)].sort((N,T)=>{if(A==="occupancy"){let O=me(t.get(N.id)??null)?.percent??-1;return(me(t.get(T.id)??null)?.percent??-1)-O}if(A==="cost"){let O=t.get(N.id)?.totalCostUsd??-1;return(t.get(T.id)?.totalCostUsd??-1)-O}return(T.updatedAt??0)-(N.updatedAt??0)})},[H,$,S,A,t]),U=n||o!==null;return(0,y.jsxs)("div",{className:"ch-overview",children:[!a&&(0,y.jsxs)("div",{className:"ch-overview-intro",children:[(0,y.jsx)("h2",{children:h("noSession")}),(0,y.jsx)("p",{children:h("choose")})]}),(0,y.jsxs)("section",{className:"ch-ov-summary",children:[(0,y.jsxs)("div",{className:"ch-ov-kpi",children:[(0,y.jsxs)("small",{children:[h("loadedSessions")," (",h("page")," ",s+1,")"]}),(0,y.jsx)("strong",{children:U?"\u2014":H.length}),(0,y.jsx)("div",{className:"ch-ov-sub",children:!U&&C.harnesses.length?C.harnesses.map(([R,b])=>`${R} ${b}`).join(" \xB7 "):"\u2014"})]}),(0,y.jsxs)("div",{className:"ch-ov-kpi",children:[(0,y.jsx)("small",{children:h("highestOccupancy")}),(0,y.jsx)("strong",{className:C.peak?C.peak.percent>=85?"is-danger":C.peak.percent>=65?"is-warn":"":"",children:C.peak?`${C.peak.percent.toFixed(1)}%`:"\u2014"}),(0,y.jsx)("div",{className:"ch-ov-sub",title:C.peak?.title,children:C.peak?`${C.peak.title}${C.peak.used!==void 0&&C.peak.capacity!==void 0?` \xB7 ${K(C.peak.used)} / ${K(C.peak.capacity)}`:""}`:h("unavailable")})]}),(0,y.jsxs)("div",{className:"ch-ov-kpi",children:[(0,y.jsx)("small",{children:h("queriedUsage")}),(0,y.jsx)("strong",{children:C.hasTokens?K(C.totalTokens):"\u2014"}),(0,y.jsx)("div",{className:"ch-ov-sub",children:C.withTelemetry>0?`${C.hasCost?`${C.hasLowerBound?"\u2265 ":""}${Ce(C.totalCost)} \xB7 `:""}${C.withTelemetry}/${Math.min(H.length,50)} ${h("inspectedCount")}`:h("unavailable")})]}),(0,y.jsxs)("div",{className:"ch-ov-kpi",children:[(0,y.jsx)("small",{children:h("activeWorkspaces")}),(0,y.jsx)("strong",{children:U?"\u2014":E.length}),(0,y.jsx)("div",{className:"ch-ov-sub",children:!U&&E.length?E.map(([R])=>R).slice(0,3).join(" \xB7 "):"\u2014"})]})]}),(0,y.jsxs)("section",{className:"ch-card ch-ov-gallery",children:[(0,y.jsxs)("div",{className:"ch-ov-toolbar",children:[(0,y.jsxs)("div",{className:"ch-chip-group",role:"group","aria-label":h("activeWorkspaces"),children:[(0,y.jsxs)("button",{className:`ch-chip ${$==="all"?"is-active":""}`,"aria-pressed":$==="all",onClick:()=>x("all"),children:[h("allWorkspaces")," ",H.length]}),E.map(([R,b])=>(0,y.jsxs)("button",{className:`ch-chip ${$===R?"is-active":""}`,"aria-pressed":$===R,onClick:()=>x(R),children:[R," ",b]},R))]}),(0,y.jsxs)("div",{className:"ch-ov-controls",children:[(0,y.jsx)("input",{className:"ch-mini-input",value:S,onChange:R=>I(R.target.value),placeholder:h("search"),"aria-label":h("search")}),(0,y.jsx)("div",{className:"ch-seg",role:"group",children:["recent","occupancy","cost"].map(R=>(0,y.jsx)("button",{className:A===R?"is-active":"","aria-pressed":A===R,onClick:()=>P(R),children:h(R==="recent"?"sortRecent":R==="occupancy"?"sortOccupancy":"sortCost")},R))})]})]}),o?(0,y.jsxs)("div",{className:"ch-error",role:"alert",children:[h("listError"),(0,y.jsx)("span",{children:o}),(0,y.jsx)("button",{className:"ch-mini-button",onClick:f,children:h("retry")})]}):n&&H.length===0?(0,y.jsxs)("div",{className:"ch-ov-grid",children:[(0,y.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"}),(0,y.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"}),(0,y.jsx)("div",{className:"ch-skeleton ch-ov-skeleton"})]}):M.length===0?(0,y.jsx)("p",{className:"ch-note",children:h("emptyList")}):(0,y.jsx)("div",{className:"ch-ov-grid",children:M.map(R=>{let b=t.get(R.id)??null,N=me(b),T=ft(R.cwd),O=Fn(R,h);return(0,y.jsxs)("button",{className:`ch-overview-card ${r===R.id?"is-selected":""}`,onClick:()=>u(R.id),children:[(0,y.jsxs)("div",{className:"ch-ov-card-top",children:[(0,y.jsx)(qn,{percent:N?N.percent:null}),(0,y.jsxs)("div",{className:"ch-ov-card-meta",children:[(0,y.jsx)("strong",{title:R.title||R.id,children:R.title||R.id}),(0,y.jsxs)("div",{className:"ch-ov-card-tags",children:[(0,y.jsx)("span",{className:"ch-meta-tag",children:R.harness??"CodexHost"}),T&&(0,y.jsx)("span",{className:"ch-meta-tag is-muted",children:T}),O&&(0,y.jsxs)("span",{className:"ch-dot-pill",children:[(0,y.jsx)("i",{className:"is-event"}),O]})]})]})]}),(0,y.jsxs)("div",{className:"ch-ov-card-stats",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("small",{children:h("context")}),(0,y.jsx)("b",{children:N?.used!==void 0&&N.capacity!==void 0?`${K(N.used)}/${K(N.capacity)}`:N?`${N.percent.toFixed(1)}%`:"\u2014"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("small",{children:h("total")}),(0,y.jsx)("b",{children:K(b?.totalTokens)})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("small",{children:h("cost")}),(0,y.jsx)("b",{children:b?.totalCostUsd===void 0?"\u2014":`${(b.unpricedModels?.length??0)>0?"\u2265 ":""}${Ce(b.totalCostUsd)}`})]})]})]},R.id)})}),(0,y.jsxs)("div",{className:"ch-pagination",children:[(0,y.jsx)("small",{children:h("overviewScopeNote")}),(0,y.jsxs)("div",{children:[(0,y.jsx)("button",{className:"ch-mini-button",disabled:s===0||n,onClick:c,children:h("previous")}),(0,y.jsxs)("span",{children:[h("page")," ",s+1]}),(0,y.jsx)("button",{className:"ch-mini-button",disabled:!i||n,onClick:l,children:h("next")})]})]})]})]})}var W=require("react");var Un=0;function V(e,t){if(e===null||typeof e!="object"||Array.isArray(e))throw new Error(`Invalid ${t}: expected an object`);return e}function Se(e,t){if(typeof e!="string")throw new Error(`Invalid ${t}: expected a string`);return e}function Ne(e,t){let n=Se(e,t);if(!n.trim())throw new Error(`Invalid ${t}: expected a nonempty identity`);return n}function Pe(e,t){if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw new Error(`Invalid ${t}: expected a nonnegative safe integer`);return e}function Te(e,t){return e==null?void 0:Se(e,t)}function hr(e,t){if(e!=null){if(typeof e!="number"||!Number.isFinite(e))throw new Error(`Invalid ${t}: expected a finite number`);return e}}function mt(e){if(!e||typeof e!="object"||Array.isArray(e))return;let t=e,n=typeof t.code=="string"||typeof t.code=="number"?` (${String(t.code).slice(0,120)})`:"";return typeof t.message=="string"?`${t.message.slice(0,500)}${n}`:void 0}function jn(e){let t=V(e,"session row"),n=V(t.projections,"session projections"),o=V(n.values,"session projection values"),r=o.harnessIdentity==null?void 0:Te(V(o.harnessIdentity,"harness identity").id,"harness id"),a=Te(t.cwd,"session cwd"),s=hr(t.updatedAt,"session updatedAt"),i=Te(t.parentSessionId,"parent session id"),c=Te(o.threadTreeParent,"thread tree parent"),l=Te(o.archiveForkParent,"fork parent");return{id:Ne(t.sessionId,"session id"),title:Te(o.title,"session title")??"",...r===void 0?{}:{harness:r},...a===void 0?{}:{cwd:a},...s===void 0?{}:{updatedAt:s},...i===void 0?{}:{parentId:i},...c===void 0?{}:{treeParentId:c},...l===void 0?{}:{forkParentId:l},...t.origin==="subagent"?{origin:"subagent"}:{}}}function Bn(e,t){let n=V(e,"history record");if(n.type!=="event")throw new Error("Invalid history record: expected an event");let o=V(n.event,"history event");if(o.sessionId!==void 0&&o.sessionId!==t)throw new Error("Invalid history event: session identity mismatch");let r=Pe(o.seq,"history sequence"),a=Ne(o.type,"history event type"),s=V(o.data,"history event data"),i=hr(o.time,"history time"),c="event",l=a,u="",f=!1,h=!1,v=!1,x=!1,S,I,A,P,H=$=>typeof $=="string"&&$.length>0&&$.length<=512?$:void 0;if(a==="tool/result"&&s.meta!=null){let $=V(s.meta,"tool result metadata");if($.codexhostOutput!==void 0){if(!Array.isArray($.codexhostOutput))throw new Error("Invalid tool output previews");for(let C of $.codexhostOutput){let M=V(C,"tool output preview"),U=V(M.reference,"tool output reference");if(U.sessionId!==t||U.seq!==r)throw new Error("Invalid tool output reference: identity mismatch");f=!0,h=!0,x=!0}}}let E=$=>{let C=u.length>0?`
`:"",M=8e3-u.length,U=C+$;U.length>M&&(f=!0,v=!0),u+=U.slice(0,M)};if(a==="user/message"||a==="assistant/message"||a==="tool/result"){c=a==="user/message"?"user":a==="assistant/message"?"assistant":"tool";let $=a==="user/message"?s:V(s.message,"history message");if(a==="tool/result"){let C=$.source&&typeof $.source=="object"&&!Array.isArray($.source)?$.source:void 0;S=H(C?.callId),I=H(C?.name),typeof $.isError=="boolean"&&(P=$.isError)}if(l=a==="tool/result"?"tool/result":c,!Array.isArray($.content))throw new Error("Invalid history message: expected content blocks");for(let C of $.content){let M=V(C,"history content block"),U=Ne(M.type,"history content type");U==="text"||U==="reasoning"?E(Se(M.text,"history content text")):U==="tool-call"?E(`${Ne(M.name,"tool name")}
${Se(M.arguments,"tool arguments")}`):x=!0}}else if(a==="tool/call"){c="tool",l=Ne(s.name,"tool name"),I=l,S=H(s.callId);let $=Se(s.arguments,"tool arguments");A=$.slice(0,8e3),E($)}else E(JSON.stringify(s));return{id:JSON.stringify([t,r]),kind:c,title:l,text:u,seq:r,eventType:a,...S===void 0?{}:{callId:S},...I===void 0?{}:{toolName:I},...A===void 0?{}:{arguments:A},...P===void 0?{}:{isError:P},...i===void 0?{}:{time:i},...f?{clipped:!0}:{},...h?{hostPreview:!0}:{},...v?{textTruncated:!0}:{},...x?{contentUnavailable:!0}:{}}}var De=class{fetcher;constructor(t=globalThis.fetch.bind(globalThis)){this.fetcher=t}async post(t,n,o){o.throwIfAborted();let r;try{r=await this.fetcher(t,{method:"POST",credentials:"same-origin",mode:"same-origin",cache:"no-store",redirect:"error",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:o})}catch(i){throw o.throwIfAborted(),i instanceof Error&&i.name==="AbortError"?i:new Error(`${t}: request failed: ${i instanceof Error?i.message:"network unavailable"}`)}o.throwIfAborted();let a;try{a=await r.json()}catch(i){throw o.throwIfAborted(),i instanceof Error&&i.name==="AbortError"?i:new Error(`${t}: ${r.ok?"":`HTTP ${r.status}; `}invalid JSON response`)}if(o.throwIfAborted(),!r.ok){let i=a!==null&&typeof a=="object"&&!Array.isArray(a)?mt(a.error):void 0;throw new Error(`${t}: HTTP ${r.status}: ${i??"request rejected"}`)}let s=V(a,`${t} response envelope`);if(Object.hasOwn(s,"error"))throw new Error(`${t}: ${mt(s.error)??"request rejected"}`);return s}async sessionRpc(t,n,o){let r=`ch-context-${++Un}`,a=await this.post(`api/${t}`,{type:"client-request",rpcId:r,method:t,payload:{args:n}},o);return this.sessionResult(a,r,t)}async listSessions(t,n){t!==null&&Se(t,"session cursor");let o=V(await this.sessionRpc("session/list",t===null?{}:{cursor:t},n),"session page");if(!Array.isArray(o.items))throw new Error("Invalid session page: expected items");if(o.nextCursor!==null&&typeof o.nextCursor!="string")throw new Error("Invalid session page: expected a string or null nextCursor");if(t!==null&&o.nextCursor===t)throw new Error("Invalid session page: cursor did not advance");let r=o.items.map(jn);if(new Set(r.map(a=>a.id)).size!==r.length)throw new Error("Invalid session page: repeated session identity");return{items:r,nextCursor:o.nextCursor}}sessionResult(t,n,o){if(t.type!=="server-response"||t.rpcId!==n)throw new Error(`${o}: response identity mismatch`);let r=V(t.result,`${o} result`);if(r.ok===!1)throw new Error(`${o}: ${mt(r.error)??"request rejected"}`);if(r.ok!==!0||!Object.hasOwn(r,"value")||Object.hasOwn(r,"error"))throw new Error(`${o}: invalid result envelope`);return r.value}async inspectUsage(t,n){Ne(t,"thread id");let o=await this.post("api/ch/v1/rpc",{method:"codexhost/thread/usage/inspect",params:{threadId:t}},n),r=V(o.result,"usage result");if(r.threadId!==t)throw new Error("Invalid usage result: thread identity mismatch");if(!Object.hasOwn(r,"usage")||r.usage!==null&&(typeof r.usage!="object"||Array.isArray(r.usage)))throw new Error("Invalid usage result: expected a usage snapshot or null");return r}async history(t,n,o,r){if(Ne(t,"session id"),o!==void 0&&(Pe(o,"beforeSeq"),r===void 0))throw new Error("throughSeq is required when beforeSeq is provided");if(r===void 0){let f=V(await this.sessionRpc("session/projections",{sessionId:t},n),"projection baseline");V(f.values,"projection baseline values"),r=Pe(f.asOfSeq,"projection baseline asOfSeq")}else Pe(r,"throughSeq");if(o!==void 0&&o>r+1)throw new Error("Invalid history boundary: beforeSeq exceeds throughSeq");let a=V(await this.sessionRpc("session/page",{address:{sessionId:t},throughSeq:r,maxMessages:50,...o===void 0?{}:{beforeSeq:o}},n),"history page");if(!Array.isArray(a.records)||typeof a.hasMore!="boolean")throw new Error("Invalid history page: expected records and hasMore");let s=-1;for(let f of a.records){let h=V(f,"history record");if(h.type!=="event")throw new Error("Invalid history record: expected an event");let v=V(h.event,"history event"),x=Pe(v.seq,"history sequence");if(x<=s||x>r||o!==void 0&&x>=o)throw new Error("Invalid history page: unordered, repeated or out-of-window sequence");s=x}if(a.hasMore&&(a.records.length===0||s===0))throw new Error("Invalid history page: pagination did not advance");let i=a.records.length>200,c=a.records.slice(-200).map(f=>Bn(f,t)),l=a.hasMore||i,u=c[0];if(l&&(!u||u.seq===0))throw new Error("Invalid history page: no earlier sequence is available");return{items:c,...u===void 0?{}:{beforeSeq:u.seq},hasMore:l,throughSeq:r,...i||c.some(f=>f.clipped)?{clipped:!0}:{},...c.some(f=>f.contentUnavailable)?{contentUnavailable:!0}:{}}}};function Wn(e,t){let n=ae(e);return n?.type!=="changed"||typeof n.threadId=="string"&&n.threadId!==t?!1:typeof n.method=="string"&&["codexhost/thread/usage/updated","thread/tokenUsage/updated","thread/updated"].includes(n.method)}function ur(e,t,n,o=fetch){let r=new AbortController,a,s=0,i=async()=>{try{let c=await o("api/ch/v1/events",{credentials:"same-origin",signal:r.signal});if(!c.ok||c.body===null)throw new Error("Events unavailable");if(r.signal.aborted)return;n(!0),s=0;let l=c.body.getReader(),u=new TextDecoder,f="";try{for(;!r.signal.aborted;){let h=await l.read();if(h.done)break;if(f+=u.decode(h.value,{stream:!0}),f.length>1024*1024)throw new Error("Event frame too large");let v;for(;(v=f.indexOf(`
`))!==-1;){let x=f.slice(0,v).trim();if(f=f.slice(v+1),!!x)try{Wn(JSON.parse(x),e)&&t()}catch{continue}}}}finally{await l.cancel().catch(()=>{}),l.releaseLock()}}catch{if(r.signal.aborted)return}r.signal.aborted||(n(!1),a=setTimeout(()=>{i()},Math.min(15e3,1e3*2**s++)))};return i(),()=>{r.abort(),a!==void 0&&clearTimeout(a)}}var Ve=new De,gr=()=>()=>{};function fr(e){let t=(0,W.useCallback)(o=>e.locale.subscribe?.(o)??gr(),[e]),n=(0,W.useCallback)(()=>e.locale.getLocale?.().active??"en",[e]);return(0,W.useSyncExternalStore)(t,n,n)}function mr(e){let t=ae(e.get("uiSession")),o=ae(t?.adapter)?.current,r=(0,W.useCallback)(s=>o?.subscribe(s)??gr(),[o]),a=(0,W.useCallback)(()=>{let s=ae(o?.getSnapshot())?.key;return typeof s=="string"?s:void 0},[o]);return(0,W.useSyncExternalStore)(r,a,a)}function br(e,t){let[n,o]=(0,W.useState)({key:"",page:null,loading:!0,error:null}),r=`${e??""}:${t}`;return(0,W.useEffect)(()=>{let a=new AbortController;return o({key:r,page:null,loading:!0,error:null}),Ve.listSessions(e,a.signal).then(s=>{a.signal.aborted||o({key:r,page:s,loading:!1,error:null})}).catch(s=>{a.signal.aborted||o({key:r,page:null,loading:!1,error:String(s instanceof Error?s.message:s)})}),()=>a.abort()},[e,r]),n.key===r?n:{page:null,loading:!0,error:null}}function xr(e,t,n){let o=(0,W.useRef)({id:e,projection:t,generation:0});(o.current.id!==e||o.current.projection!==t)&&(o.current={id:e,projection:t,generation:o.current.generation+1});let[r,a]=(0,W.useState)({id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0});return(0,W.useEffect)(()=>{if(t===void 0||!e)return;let s=Le(t),i=Date.now();a(c=>({id:e,usage:s,loading:!1,error:null,connected:!0,samples:Qe(c.id===e?c.samples:[],s,i),updatedAt:i,snapshotSequence:(c.id===e?c.snapshotSequence:0)+1}))},[e,t]),(0,W.useEffect)(()=>{let s=new AbortController,i,c=!1,l=!1,u=async()=>{if(!e||s.signal.aborted)return;if(c){l=!0;return}c=!0;let h=o.current.generation,v=()=>!s.signal.aborted&&o.current.generation===h;try{let x=await Ve.inspectUsage(e,s.signal);if(!v())return;let S=Le(x),I=Date.now();a(A=>v()?{id:e,usage:S,loading:!1,error:null,connected:!0,samples:Qe(A.id===e?A.samples:[],S,I),updatedAt:I,snapshotSequence:(A.id===e?A.snapshotSequence:0)+1}:A)}catch(x){v()&&a(S=>v()?{...S.id===e?S:{id:e,usage:null,connected:!1,samples:[],updatedAt:null,snapshotSequence:0},loading:!1,error:String(x instanceof Error?x.message:x)}:S)}finally{c=!1,l&&!s.signal.aborted&&(l=!1,u())}};(t===void 0||n>0)&&(a(h=>h.id===e?{...h,loading:!!e,error:null}:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}),u());let f=e&&t===void 0?ur(e,()=>{i!==void 0&&clearTimeout(i),i=setTimeout(()=>{u()},150)},h=>{s.signal.aborted||a(v=>v.id===e?{...v,connected:h}:v),h&&u()}):void 0;return()=>{s.abort(),f?.(),i!==void 0&&clearTimeout(i)}},[e,t===void 0,n]),r.id===e?r:{id:e,usage:null,loading:!!e,error:null,connected:!0,samples:[],updatedAt:null,snapshotSequence:0}}function vr(e,t,n=null){let o=(0,W.useRef)({id:e,generation:0});o.current.id!==e&&(o.current={id:e,generation:o.current.generation+1});let[r,a]=(0,W.useState)(null),s=r&&r.id===e&&r.generation===o.current.generation?r.before:void 0,i=s!==void 0?r?.through:void 0,c=s===void 0?n:null,[l,u]=(0,W.useState)({page:null,loading:!1,error:null});(0,W.useEffect)(()=>a(null),[e]),(0,W.useEffect)(()=>{if(!e)return;let h=new AbortController;u(S=>({id:e,page:S.id===e?S.page:null,loading:!0,error:null}));let v=()=>{Ve.history(e,h.signal,s,i).then(S=>{h.signal.aborted||u({id:e,page:S,loading:!1,error:null})}).catch(S=>{h.signal.aborted||u(I=>({id:e,page:I.id===e?I.page:null,loading:!1,error:String(S instanceof Error?S.message:S)}))})},x=c!==null&&l.id===e&&l.page!==null?setTimeout(v,350):void 0;return x===void 0&&v(),()=>{h.abort(),x!==void 0&&clearTimeout(x)}},[e,s,i,t,c]);let f=l.id===e?l:{page:null,loading:!!e,error:null};return{...f,latest:()=>a(null),isOlder:s!==void 0,older:()=>{e&&f.page?.beforeSeq!==void 0&&a({id:e,generation:o.current.generation,before:f.page.beforeSeq,through:f.page.throughSeq})}}}var Dn=new Map;function kr(e,t,n){let[o,r]=(0,W.useState)(()=>({key:"",entries:new Map})),a=e.map(i=>i.id).filter(te).slice(0,50),s=t&&a.length>0?`${n}:${a.join(",")}`:"";return(0,W.useEffect)(()=>{if(!s){r({key:"",entries:new Map});return}let i=new AbortController;r({key:s,entries:new Map});let c=[...a],l=Array.from({length:Math.min(3,c.length)},async()=>{for(;!i.signal.aborted&&c.length>0;){let u=c.shift();if(!u)break;let f=null;try{let h=await Ve.inspectUsage(u,i.signal);if(i.signal.aborted)return;f=Le(h)}catch{if(i.signal.aborted)return;f=null}r(h=>{if(i.signal.aborted||h.key!==s)return h;let v=new Map(h.entries);return v.set(u,f),{key:s,entries:v}})}});return Promise.all(l),()=>i.abort()},[s]),s&&o.key===s?o.entries:Dn}var bt={title:"Context insights",subtitle:"A clearer view of your conversation.",tab:"Context",sessions:"Conversations",search:"Search this page",next:"Next page",previous:"Previous page",refresh:"Refresh",loading:"Loading\u2026",noSession:"Choose a conversation",choose:"Select a conversation to inspect the context and usage reported by its Harness.",unavailable:"Not reported",noUsage:"This Harness has not reported usage for this conversation yet.",context:"Current context",used:"Used tokens",capacity:"Window capacity",remaining:"Remaining capacity",occupancy:"Context occupancy",cumulative:"Cumulative usage",input:"Input tokens",output:"Output tokens",cacheRead:"Cache read",cacheWrite:"Cache write",total:"Total tokens",cost:"Session cost",costEstimate:"Public-price estimate",costNative:"Native cost",partialPrice:"Some models are unpriced; this is a lower bound.",performance:"Performance & cache",tps:"Output speed",avgTps:"Average output speed",ttft:"Time to first output",cacheHit:"Latest cache hit",avgCache:"Average cache hit",credits:"AI credits",timeline:"Context observations",timelineNote:"Changes observed while this panel is open. This is not the complete request history.",needSamples:"The next context change will appear here.",observed:"Samples",history:"Messages & tools",all:"All",messages:"Messages",tools:"Tools",events:"Events",historyNote:"Conversation records are not the exact model request body.",noHistory:"No records in this history window.",older:"Load older records",historyLoading:"Reading history\u2026",historyError:"History could not be loaded.",retry:"Retry",copy:"Copy usage JSON",copied:"Copied",copyFailed:"Copy failed",source:"Reported by CodexHost",live:"Live",disconnected:"Reconnecting",limits:"Detailed context composition",limitsNote:"The Host does not expose separate system-prompt, tool-definition and message token counts. No breakdown is estimated.",readOnly:"Read-only \xB7 conversations and prompts unchanged",emptyList:"No conversations on this page.",usageError:"Usage could not be loaded.",listError:"Conversations could not be loaded.",compatibilityTitle:"Context Insights (compatibility)",titleShort:"CH Context",settingsNote:"Open Context insights from the sidebar, or the Context tab inside a conversation.",localOnly:"Snapshots are read from this CodexHost instance. No conversation data is sent to a third-party service.",user:"User",assistant:"Assistant",tool:"Tool",event:"Event",date:"Updated",page:"Page",loadedSearch:"Search applies to this page.",following:"Current conversation",sampled:"Observed context",retained:"Up to 120 changed snapshots are retained in memory for the selected conversation.",details:"Show details",hideDetails:"Hide details",errorBoundary:"This panel could not render the available data.",count:"records",previewShort:"Preview",partialShort:"Partial",hostPreview:"The Host supplied a preview; the complete tool output is not included.",textTruncated:"Text shortened to 8,000 characters in this view.",contentUnavailable:"Some content is unavailable in this view, including unsupported media or omitted output.",clipped:"Long records may contain only the Host-provided preview.",activityStats:"Conversation stats",historyWindow:"Loaded history window",userMessages:"User messages",assistantMessages:"Assistant messages",toolCalls:"Tool calls",toolResults:"Tool results",toolUse:"Tool activity",commands:"Shell commands",files:"File activity",reads:"Read",writes:"Write / edit",searches:"Search",activityTimeline:"Activity timeline",activitySequence:"Browse event sequence",sequenceNote:"Event order in this history window; bar height does not represent token counts or duration.",prevRecord:"Previous record",nextRecord:"Next record",browserTitle:"Context browser",browserScope:"Conversation records",searchRecords:"Search this history window",categories:"Categories",chronological:"Sequence",sourceText:"Raw text",renderedText:"Rendered",copyRecord:"Copy",recordDetails:"Record details",argumentsLabel:"Arguments",toolOutput:"Tool output",recordTime:"Host record time",noCommands:"No recognized shell commands in this history window.",noFiles:"No recognized file paths in this history window.",noMatches:"No matching records.",loadedFamily:"Conversation relationships",familyScope:"Relationships reported among conversations on the loaded page.",parentConversation:"Parent",childConversations:"Child conversation",openConversation:"Open conversation",inputOutput:"Input + output",uncachedInput:"Uncached input",inputIncludesCache:"Input includes cache reads and writes.",changeConversation:"Change conversation",latestWindow:"Latest history",blank:"No textual content",taskChecked:"Completed task",taskUnchecked:"Incomplete task",imageLink:"Image link",completed:"Result recorded",pending:"No result in this window",failed:"Error",toolError:"The Host marked this tool result as an error.",relationSubagent:"Subagent",relationFork:"Fork",relationTree:"Thread tree",relationParent:"Parent link",expandGroup:"Expand group",eventCounts:"Events by kind",observationsDetail:"Observed context changes",overview:"Overview",inspectorView:"Inspector",allWorkspaces:"All workspaces",loadedSessions:"Loaded conversations",highestOccupancy:"Peak context occupancy",queriedUsage:"Inspected usage",activeWorkspaces:"Workspaces",sortRecent:"Recent",sortOccupancy:"Occupancy",sortCost:"Cost",overviewScopeNote:"Shows the loaded conversation page. Usage snapshots are fetched on demand from this CodexHost instance.",reasoningOutput:"Reasoning",remainingShort:"Remaining",capacityUnknown:"Capacity unknown",errorsOnly:"Errors only",jumpResult:"Result",jumpCall:"Call",programFilter:"Programs",filterPath:"Filter by path\u2026",statusOk:"OK",turnsCount:"turns",noFamily:"No parent, fork or subagent links reported on this page.",currentSession:"Current",points:"pts",noObservations:"No window occupancy reported yet",inspectedCount:"with telemetry",readShort:"R",writeShort:"W",searchShort:"S",openOperations:"Toggle operations"},xt={title:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF",subtitle:"\u770B\u6E05\u6BCF\u6BB5\u5BF9\u8BDD\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",tab:"\u4E0A\u4E0B\u6587",sessions:"\u4F1A\u8BDD",search:"\u641C\u7D22\u5F53\u524D\u9875\u4F1A\u8BDD",next:"\u4E0B\u4E00\u9875",previous:"\u4E0A\u4E00\u9875",refresh:"\u5237\u65B0",loading:"\u52A0\u8F7D\u4E2D\u2026",noSession:"\u9009\u62E9\u4E00\u4E2A\u4F1A\u8BDD",choose:"\u9009\u62E9\u4F1A\u8BDD\uFF0C\u67E5\u770B\u5176 Harness \u4E0A\u62A5\u7684\u4E0A\u4E0B\u6587\u4E0E\u7528\u91CF\u3002",unavailable:"\u672A\u4E0A\u62A5",noUsage:"\u6B64 Harness \u5C1A\u672A\u4E0A\u62A5\u8BE5\u4F1A\u8BDD\u7684\u7528\u91CF\u3002",context:"\u5F53\u524D\u4E0A\u4E0B\u6587",used:"\u5DF2\u7528 Token",capacity:"\u7A97\u53E3\u5BB9\u91CF",remaining:"\u5269\u4F59\u5BB9\u91CF",occupancy:"\u4E0A\u4E0B\u6587\u5360\u7528",cumulative:"\u7D2F\u8BA1\u7528\u91CF",input:"\u8F93\u5165 Token",output:"\u8F93\u51FA Token",cacheRead:"\u7F13\u5B58\u8BFB\u53D6",cacheWrite:"\u7F13\u5B58\u5199\u5165",total:"\u603B Token",cost:"\u4F1A\u8BDD\u8D39\u7528",costEstimate:"\u6309\u516C\u5F00\u4EF7\u683C\u4F30\u7B97",costNative:"\u539F\u751F\u8D39\u7528",partialPrice:"\u90E8\u5206\u6A21\u578B\u5C1A\u672A\u5B9A\u4EF7\uFF0C\u6B64\u91D1\u989D\u4E3A\u4E0B\u9650\u3002",performance:"\u6027\u80FD\u4E0E\u7F13\u5B58",tps:"\u8F93\u51FA\u901F\u5EA6",avgTps:"\u5E73\u5747\u8F93\u51FA\u901F\u5EA6",ttft:"\u9996\u4E2A\u8F93\u51FA\u5EF6\u8FDF",cacheHit:"\u6700\u8FD1\u7F13\u5B58\u547D\u4E2D",avgCache:"\u5E73\u5747\u7F13\u5B58\u547D\u4E2D",credits:"AI Credits",timeline:"\u4E0A\u4E0B\u6587\u89C2\u6D4B",timelineNote:"\u4EC5\u8BB0\u5F55\u9762\u677F\u6253\u5F00\u671F\u95F4\u7684\u53D8\u5316\uFF0C\u4E0D\u4EE3\u8868\u5B8C\u6574\u8BF7\u6C42\u5386\u53F2\u3002",needSamples:"\u4E0B\u4E00\u6B21\u4E0A\u4E0B\u6587\u53D8\u5316\u5C06\u5728\u6B64\u663E\u793A\u3002",observed:"\u89C2\u6D4B\u5FEB\u7167",history:"\u6D88\u606F\u4E0E\u5DE5\u5177",all:"\u5168\u90E8",messages:"\u6D88\u606F",tools:"\u5DE5\u5177",events:"\u4E8B\u4EF6",historyNote:"\u4F1A\u8BDD\u8BB0\u5F55\u4E0D\u7B49\u540C\u4E8E\u6A21\u578B\u5B9E\u9645\u6536\u5230\u7684\u5B8C\u6574\u8BF7\u6C42\u3002",noHistory:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u8BB0\u5F55\u3002",older:"\u52A0\u8F7D\u66F4\u65E9\u8BB0\u5F55",historyLoading:"\u6B63\u5728\u8BFB\u53D6\u5386\u53F2\u2026",historyError:"\u5386\u53F2\u52A0\u8F7D\u5931\u8D25\u3002",retry:"\u91CD\u8BD5",copy:"\u590D\u5236\u7528\u91CF JSON",copied:"\u5DF2\u590D\u5236",copyFailed:"\u590D\u5236\u5931\u8D25",source:"\u7531 CodexHost \u4E0A\u62A5",live:"\u5B9E\u65F6\u66F4\u65B0",disconnected:"\u6B63\u5728\u91CD\u8FDE",limits:"\u8BE6\u7EC6\u4E0A\u4E0B\u6587\u7EC4\u6210",limitsNote:"\u5BBF\u4E3B\u5C1A\u672A\u63D0\u4F9B\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3001\u5DE5\u5177\u5B9A\u4E49\u4E0E\u6D88\u606F\u5404\u81EA\u7684 Token \u6570\u91CF\uFF0C\u6B64\u5904\u4E0D\u4F30\u7B97\u62C6\u5206\u3002",readOnly:"\u53EA\u8BFB \xB7 \u4E0D\u4FEE\u6539\u4F1A\u8BDD\u6216\u63D0\u793A\u8BCD",emptyList:"\u5F53\u524D\u9875\u6CA1\u6709\u4F1A\u8BDD\u3002",usageError:"\u7528\u91CF\u52A0\u8F7D\u5931\u8D25\u3002",listError:"\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25\u3002",compatibilityTitle:"\u4E0A\u4E0B\u6587\u6D1E\u5BDF\uFF08\u517C\u5BB9\u5165\u53E3\uFF09",titleShort:"CH Context",settingsNote:"\u4ECE\u4FA7\u680F\u6253\u5F00\u300C\u4E0A\u4E0B\u6587\u6D1E\u5BDF\u300D\uFF0C\u6216\u8FDB\u5165\u4F1A\u8BDD\u5185\u7684\u300C\u4E0A\u4E0B\u6587\u300D\u9875\u7B7E\u3002",localOnly:"\u6570\u636E\u8BFB\u53D6\u81EA\u5F53\u524D CodexHost \u5B9E\u4F8B\uFF0C\u4E0D\u5411\u7B2C\u4E09\u65B9\u670D\u52A1\u53D1\u9001\u4F1A\u8BDD\u5185\u5BB9\u3002",user:"\u7528\u6237",assistant:"\u52A9\u624B",tool:"\u5DE5\u5177",event:"\u4E8B\u4EF6",date:"\u66F4\u65B0\u65F6\u95F4",page:"\u7B2C",loadedSearch:"\u641C\u7D22\u8303\u56F4\u4E3A\u5F53\u524D\u9875\u3002",following:"\u5F53\u524D\u4F1A\u8BDD",sampled:"\u4E0A\u4E0B\u6587\u89C2\u6D4B\u503C",retained:"\u4EC5\u5728\u5185\u5B58\u4E2D\u4FDD\u7559\u6240\u9009\u4F1A\u8BDD\u6700\u8FD1 120 \u6B21\u53D8\u5316\u5FEB\u7167\u3002",details:"\u663E\u793A\u8BE6\u60C5",hideDetails:"\u6536\u8D77\u8BE6\u60C5",errorBoundary:"\u9762\u677F\u65E0\u6CD5\u663E\u793A\u5F53\u524D\u6570\u636E\u3002",count:"\u6761\u8BB0\u5F55",previewShort:"\u9884\u89C8",partialShort:"\u90E8\u5206\u5185\u5BB9",hostPreview:"\u5BBF\u4E3B\u4EC5\u63D0\u4F9B\u9884\u89C8\uFF0C\u672A\u5305\u542B\u5B8C\u6574\u5DE5\u5177\u8F93\u51FA\u3002",textTruncated:"\u5F53\u524D\u89C6\u56FE\u4E2D\u7684\u6587\u672C\u5DF2\u622A\u53D6\u81F3 8,000 \u4E2A\u5B57\u7B26\u3002",contentUnavailable:"\u6B64\u89C6\u56FE\u65E0\u6CD5\u663E\u793A\u90E8\u5206\u5185\u5BB9\uFF0C\u4F8B\u5982\u672A\u652F\u6301\u7684\u5A92\u4F53\u6216\u7701\u7565\u7684\u8F93\u51FA\u3002",clipped:"\u8F83\u957F\u8BB0\u5F55\u53EF\u80FD\u4EC5\u5305\u542B\u5BBF\u4E3B\u63D0\u4F9B\u7684\u9884\u89C8\u3002",activityStats:"\u4F1A\u8BDD\u7EDF\u8BA1",historyWindow:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3",userMessages:"\u7528\u6237\u6D88\u606F",assistantMessages:"\u52A9\u624B\u6D88\u606F",toolCalls:"\u5DE5\u5177\u8C03\u7528",toolResults:"\u5DE5\u5177\u7ED3\u679C",toolUse:"\u5DE5\u5177\u6D3B\u52A8",commands:"\u547D\u4EE4\u8BB0\u5F55",files:"\u6587\u4EF6\u6D3B\u52A8",reads:"\u8BFB\u53D6",writes:"\u5199\u5165 / \u7F16\u8F91",searches:"\u641C\u7D22",activityTimeline:"\u6D3B\u52A8\u65F6\u95F4\u7EBF",activitySequence:"\u6D4F\u89C8\u4E8B\u4EF6\u5E8F\u5217",sequenceNote:"\u5C55\u793A\u6B64\u5386\u53F2\u7A97\u53E3\u4E2D\u7684\u4E8B\u4EF6\u987A\u5E8F\uFF0C\u67F1\u9AD8\u4E0D\u8868\u793A Token \u6570\u91CF\u6216\u8017\u65F6\u3002",prevRecord:"\u4E0A\u4E00\u6761\u8BB0\u5F55",nextRecord:"\u4E0B\u4E00\u6761\u8BB0\u5F55",browserTitle:"\u4E0A\u4E0B\u6587\u6D4F\u89C8\u5668",browserScope:"\u4F1A\u8BDD\u8BB0\u5F55",searchRecords:"\u641C\u7D22\u5F53\u524D\u5386\u53F2\u7A97\u53E3",categories:"\u5206\u7C7B",chronological:"\u987A\u5E8F",sourceText:"\u539F\u6587",renderedText:"\u6E32\u67D3",copyRecord:"\u590D\u5236",recordDetails:"\u8BB0\u5F55\u8BE6\u60C5",argumentsLabel:"\u53C2\u6570",toolOutput:"\u5DE5\u5177\u8F93\u51FA",recordTime:"\u5BBF\u4E3B\u8BB0\u5F55\u65F6\u95F4",noCommands:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684 Shell \u547D\u4EE4\u3002",noFiles:"\u5F53\u524D\u5386\u53F2\u7A97\u53E3\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u6587\u4EF6\u8DEF\u5F84\u3002",noMatches:"\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5F55\u3002",loadedFamily:"\u4F1A\u8BDD\u5173\u7CFB",familyScope:"\u4EC5\u5C55\u793A\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\u4E2D\u7531\u5BBF\u4E3B\u4E0A\u62A5\u7684\u5173\u7CFB\u3002",parentConversation:"\u7236\u4F1A\u8BDD",childConversations:"\u5B50\u4F1A\u8BDD",openConversation:"\u6253\u5F00\u4F1A\u8BDD",inputOutput:"\u8F93\u5165 + \u8F93\u51FA",uncachedInput:"\u672A\u7F13\u5B58\u8F93\u5165",inputIncludesCache:"\u8F93\u5165\u7528\u91CF\u5DF2\u5305\u542B\u7F13\u5B58\u8BFB\u53D6\u4E0E\u5199\u5165\u3002",changeConversation:"\u5207\u6362\u4F1A\u8BDD",latestWindow:"\u6700\u65B0\u5386\u53F2",blank:"\u6CA1\u6709\u6587\u672C\u5185\u5BB9",taskChecked:"\u5DF2\u5B8C\u6210\u4EFB\u52A1",taskUnchecked:"\u672A\u5B8C\u6210\u4EFB\u52A1",imageLink:"\u56FE\u7247\u94FE\u63A5",completed:"\u5DF2\u8BB0\u5F55\u7ED3\u679C",pending:"\u672C\u7A97\u53E3\u65E0\u7ED3\u679C",failed:"\u9519\u8BEF",toolError:"\u5BBF\u4E3B\u5DF2\u5C06\u6B64\u5DE5\u5177\u7ED3\u679C\u6807\u8BB0\u4E3A\u9519\u8BEF\u3002",relationSubagent:"\u5B50\u4EE3\u7406",relationFork:"\u5206\u53C9",relationTree:"\u4F1A\u8BDD\u6811",relationParent:"\u4E0A\u7EA7\u5173\u7CFB",expandGroup:"\u5C55\u5F00\u5206\u7EC4",eventCounts:"\u4E8B\u4EF6\u7C7B\u522B",observationsDetail:"\u4E0A\u4E0B\u6587\u53D8\u5316\u89C2\u6D4B",overview:"\u603B\u89C8",inspectorView:"\u4F1A\u8BDD\u6D1E\u5BDF",allWorkspaces:"\u5168\u90E8\u5DE5\u4F5C\u533A",loadedSessions:"\u5DF2\u52A0\u8F7D\u4F1A\u8BDD",highestOccupancy:"\u6700\u9AD8\u4E0A\u4E0B\u6587\u5360\u7528",queriedUsage:"\u5DF2\u62C9\u53D6\u5FEB\u7167\u7528\u91CF",activeWorkspaces:"\u6D3B\u8DC3\u5DE5\u4F5C\u533A",sortRecent:"\u6700\u8FD1\u66F4\u65B0",sortOccupancy:"\u4E0A\u4E0B\u6587\u5360\u7528",sortCost:"\u4F1A\u8BDD\u8D39\u7528",overviewScopeNote:"\u4EC5\u5C55\u793A\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\uFF1B\u6309\u9700\u4ECE\u5F53\u524D CodexHost \u5B9E\u4F8B\u62C9\u53D6\u53EF\u89C1\u4F1A\u8BDD\u7684\u7528\u91CF\u5FEB\u7167\u3002",reasoningOutput:"\u542B\u63A8\u7406\u8F93\u51FA",remainingShort:"\u5269\u4F59",capacityUnknown:"\u5BB9\u91CF\u672A\u77E5",errorsOnly:"\u4EC5\u9519\u8BEF",jumpResult:"\u8DF3\u8F6C\u8F93\u51FA",jumpCall:"\u8DF3\u8F6C\u8C03\u7528",programFilter:"\u7A0B\u5E8F\u5206\u5E03",filterPath:"\u6309\u8DEF\u5F84\u7B5B\u9009\u2026",statusOk:"\u6B63\u5E38",turnsCount:"\u8F6E",noFamily:"\u5F53\u524D\u5DF2\u52A0\u8F7D\u4F1A\u8BDD\u9875\u4E2D\u672A\u4E0A\u62A5\u7236\u5B50\u3001\u5206\u652F\u6216\u5B50\u4EE3\u7406\u5173\u7CFB\u3002",currentSession:"\u5F53\u524D\u4F1A\u8BDD",points:"\u70B9",noObservations:"\u6682\u65E0\u7A97\u53E3\u5360\u6BD4\u89C2\u6D4B\u70B9",inspectedCount:"\u6709\u9065\u6D4B",readShort:"\u8BFB",writeShort:"\u5199",searchShort:"\u641C",openOperations:"\u5C55\u5F00\u64CD\u4F5C\u8BB0\u5F55"};function Ze(e){let t=e.toLowerCase().startsWith("zh")?xt:bt;return n=>t[n]}var wr=require("react"),Oe=new WeakMap;function yr(e,t){(0,wr.useLayoutEffect)(()=>{if(!t)return;let n=e.current?.closest("[data-conversation-scroll]");if(n)return Oe.set(n,(Oe.get(n)??0)+1),n.setAttribute("data-ch-context-surface",""),()=>{let o=(Oe.get(n)??1)-1;o>0?Oe.set(n,o):(Oe.delete(n),n.removeAttribute("data-ch-context-surface"))}},[e,t])}var k=require("react/jsx-runtime");function vt({ctx:e,sessionId:t,projection:n,embedded:o=!1,headerActions:r}){let a=(0,Y.useRef)(null);yr(a,o);let s=fr(e),i=(0,Y.useMemo)(()=>Ze(s),[s]),c=mr(e),[l,u]=(0,Y.useState)(),[f,h]=(0,Y.useState)(!1),[v,x]=(0,Y.useState)("inspector"),S=t??l??c,I=te(S)?S:void 0,A=o?"inspector":I?v:"overview",[P,H]=(0,Y.useState)(0),[E,$]=(0,Y.useState)([null]),[C,M]=(0,Y.useState)(0),[U,R]=(0,Y.useState)(""),[b,N]=(0,Y.useState)("idle"),T=br(E[C]??null,P),O=kr(T.page?.items??[],!o&&A==="overview",P),z=xr(I,n,P),se=vr(I,P,z.snapshotSequence||null),p=T.page?.items.find(L=>L.id===I),j=(T.page?.items??[]).filter(L=>te(L.id)&&`${L.title} ${L.harness??""} ${L.cwd??""}`.toLocaleLowerCase().includes(U.toLocaleLowerCase()));(0,Y.useEffect)(()=>{N("idle")},[I]);let D=()=>H(L=>L+1),X=L=>{if(o){let de=ae(e.get("uiWorkspace"));typeof de?.openSession=="function"&&de.openSession(L);return}u(L),x("inspector"),h(!1)},m=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({threadId:I,observedAt:z.updatedAt,usage:z.usage},null,2)),N("done")}catch{N("failed")}},F=p?.cwd?.split(/[\\/]/).filter(Boolean).at(-1),ie=p?.title||I||i("noSession"),ce=p?.harness??"CodexHost";return(0,k.jsx)("div",{ref:a,className:`ch-context ${o?"ch-embedded":""}`,lang:s.startsWith("zh")?"zh-CN":"en",children:(0,k.jsxs)("div",{className:"ch-shell",children:[(0,k.jsxs)("header",{className:`ch-page-heading ${o?"ch-heading-embedded":""}`,children:[(0,k.jsxs)("div",{className:"ch-heading-left",children:[(0,k.jsxs)("div",{className:"ch-heading-title",children:[(0,k.jsx)("div",{className:"ch-brand-icon","aria-hidden":"true",children:(0,k.jsx)(Re,{size:14})}),(0,k.jsxs)("div",{className:"ch-brand-stack",children:[o?(0,k.jsx)("span",{className:"ch-brand-name",children:"CH CONTEXT"}):(0,k.jsx)("h1",{children:i("title")}),(0,k.jsxs)("div",{className:"ch-brand",children:[(0,k.jsx)("span",{children:"CH-CONTEXT"}),(0,k.jsx)("a",{className:"ch-version",href:"https://github.com/ABC-xiaoxuan/ch-context",target:"_blank",rel:"noopener noreferrer",children:"0.3.2"})]})]})]}),!o&&(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("span",{className:"ch-divider-v","aria-hidden":"true"}),(0,k.jsxs)("div",{className:"ch-seg ch-view-seg",role:"tablist","aria-label":i("title"),children:[(0,k.jsx)("button",{role:"tab","aria-selected":A==="overview",className:A==="overview"?"is-active":"",onClick:()=>{x("overview"),h(!1)},children:i("overview")}),(0,k.jsx)("button",{role:"tab","aria-selected":A==="inspector",className:A==="inspector"?"is-active":"",disabled:!I,onClick:()=>x("inspector"),children:i("inspectorView")})]}),(0,k.jsxs)("details",{className:"ch-session-picker",open:f,onToggle:L=>h(L.currentTarget.open),children:[(0,k.jsxs)("summary",{title:ie,children:[(0,k.jsx)("span",{className:"ch-meta-tag ch-session-harness",children:ce}),(0,k.jsx)("strong",{children:p?.title||i(I?"following":"noSession")}),F&&(0,k.jsx)("span",{className:"ch-meta-tag is-muted",children:F}),(0,k.jsx)("small",{"aria-hidden":"true",children:"\u25BE"})]}),(0,k.jsxs)("div",{className:"ch-session-picker-body",children:[(0,k.jsxs)("div",{className:"ch-picker-header",children:[(0,k.jsxs)("label",{className:"ch-search",children:[(0,k.jsx)("span",{"aria-hidden":"true",children:"\u2315"}),(0,k.jsx)("input",{value:U,onChange:L=>R(L.target.value),placeholder:i("search"),"aria-label":i("search")})]}),te(c)&&(0,k.jsx)("button",{className:"ch-mini-button",onClick:()=>{u(void 0),x("inspector"),h(!1)},children:i("following")})]}),T.error?(0,k.jsxs)("div",{className:"ch-error",role:"alert",children:[i("listError"),(0,k.jsx)("span",{children:T.error}),(0,k.jsx)("button",{className:"ch-mini-button",onClick:D,children:i("retry")})]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("div",{className:"ch-session-list",role:"list",children:T.loading?(0,k.jsx)("div",{className:"ch-skeleton ch-session-skeleton","aria-label":i("loading")}):j.length===0?(0,k.jsx)("p",{className:"ch-note",children:i("emptyList")}):j.map(L=>(0,k.jsx)("div",{role:"listitem",children:(0,k.jsxs)("button",{className:`ch-session ${I===L.id?"is-selected":""}`,"aria-pressed":I===L.id,title:L.title,onClick:()=>X(L.id),children:[(0,k.jsx)("span",{className:"ch-session-marker"}),(0,k.jsxs)("span",{className:"ch-session-title",children:[L.title||L.id,(0,k.jsxs)("small",{title:L.cwd,children:[L.harness??"CodexHost",L.cwd?` \xB7 ${L.cwd.split(/[\\/]/).filter(Boolean).at(-1)}`:""]})]}),(0,k.jsx)("span",{"aria-hidden":"true",children:"\u2197"})]})},L.id))}),(0,k.jsxs)("div",{className:"ch-pagination",children:[(0,k.jsx)("small",{children:i("loadedSearch")}),(0,k.jsxs)("div",{children:[(0,k.jsx)("button",{className:"ch-mini-button",disabled:C===0||T.loading,onClick:()=>M(L=>Math.max(0,L-1)),children:i("previous")}),(0,k.jsxs)("span",{children:[i("page")," ",C+1]}),(0,k.jsx)("button",{className:"ch-mini-button",disabled:!T.page?.nextCursor||T.loading,onClick:()=>{let L=T.page?.nextCursor;L&&($(de=>[...de.slice(0,C+1),L]),M(de=>de+1))},children:i("next")})]})]})]})]})]})]})]}),(0,k.jsxs)("div",{className:"ch-heading-actions",children:[r,I&&A==="inspector"&&(0,k.jsxs)("span",{className:`ch-status ${z.connected?"":"is-offline"}`,children:[(0,k.jsx)("i",{}),i(z.connected?"live":"disconnected")]}),I&&A==="inspector"&&(0,k.jsx)("button",{className:"ch-mini-button",disabled:!z.usage,onClick:()=>{m()},children:i(b==="done"?"copied":b==="failed"?"copyFailed":"copy")}),(0,k.jsx)("button",{className:"ch-button",disabled:A==="overview"?T.loading:z.loading,onClick:D,children:i((A==="overview"?T.loading:z.loading)?"loading":"refresh")})]})]}),A==="overview"?(0,k.jsx)(pr,{rows:T.page?.items??[],usageById:O,loading:T.loading,error:T.error,selected:I,hasSelected:!!I,pageIndex:C,hasNext:!!T.page?.nextCursor,onPrev:()=>M(L=>Math.max(0,L-1)),onNext:()=>{let L=T.page?.nextCursor;L&&($(de=>[...de.slice(0,C+1),L]),M(de=>de+1))},onSelect:X,onRetry:D,t:i}):I?(0,k.jsxs)(k.Fragment,{children:[z.error&&(0,k.jsxs)("div",{className:"ch-error",role:"alert",children:[i("usageError"),(0,k.jsx)("span",{children:z.error}),(0,k.jsx)("button",{className:"ch-mini-button",onClick:D,children:i("retry")})]}),!z.usage&&!z.error&&!z.loading&&(0,k.jsx)("p",{className:"ch-note ch-availability",children:i("noUsage")}),(0,k.jsx)(dr,{usage:z,history:se,rows:T.page?.items??[],selected:I,currentTitle:ie,currentHarness:ce,onSelect:X,retry:D,t:i},I)]}):(0,k.jsxs)("div",{className:"ch-empty",children:[(0,k.jsx)(Re,{size:28}),(0,k.jsx)("h2",{children:i("noSession")}),(0,k.jsx)("p",{children:i("choose")})]}),(0,k.jsxs)("footer",{className:"ch-footer",children:[(0,k.jsxs)("span",{children:["ch-context \xB7 ",i("readOnly")]}),(0,k.jsx)("span",{children:i("localOnly")})]})]})})}var Nr=`.ch-context {
  --ch-canvas: var(--dsw-alias-bg-layer-0, #f5f5f7);
  --ch-surface: var(--dsw-alias-bg-layer-1, #ffffff);
  --ch-surface-elevated: var(--dsw-alias-bg-layer-1, #ffffff);
  --ch-well: var(--dsw-alias-bg-layer-2, #f0f0f3);
  --ch-well-hover: #e7e7ec;
  --ch-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.085));
  --ch-border-strong: rgba(0, 0, 0, 0.16);
  --ch-shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 0.5px 1px rgba(0, 0, 0, 0.03);
  --ch-shadow-pop: 0 14px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  --ch-inset-top: none;
  --ch-ink: var(--dsw-alias-label-primary, #1d1d1f);
  --ch-ink-2: #48484a;
  --ch-muted: var(--dsw-alias-label-secondary, #6e6e73);
  --ch-blue: #0071e3;
  --ch-teal: #1f9d78;
  --ch-green: #28a048;
  --ch-purple: #6e56cf;
  --ch-amber: #c97a16;
  --ch-danger: #d92d20;
  --ch-accent: #0071e3;
  --ch-accent-soft: rgba(0, 113, 227, 0.1);
  --ch-accent-text: #0066cc;
  --ch-danger-soft: rgba(217, 45, 32, 0.09);
  --ch-warn-soft: rgba(201, 122, 22, 0.1);
  --ch-seg-active-bg: #ffffff;
  --ch-seg-active-fg: #1d1d1f;
  --ch-seg-active-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0.5px 1px rgba(0, 0, 0, 0.06);
  --ch-brand-bg: #ffffff;
  --ch-brand-fg: #0071e3;
  --ch-track: #e5e5ea;
  --ch-grid-line: rgba(110, 110, 115, 0.14);
  --ch-turn-band: rgba(0, 0, 0, 0.025);
  --ch-code-bg: #f6f6f8;
  --ch-mono: var(
    --ds-font-family-code,
    'JetBrains Mono',
    'Cascadia Code',
    'SF Mono',
    Consolas,
    ui-monospace,
    monospace
  );
  background: var(--ch-canvas);
  color: var(--ch-ink);
  font-family: var(
    --ds-font-family,
    'Inter',
    'PingFang SC',
    'Microsoft YaHei UI',
    system-ui,
    -apple-system,
    'Segoe UI',
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
  --ch-canvas: var(--dsw-alias-bg-layer-0, #121214);
  --ch-surface: var(--dsw-alias-bg-layer-1, #1c1c1e);
  --ch-surface-elevated: #242426;
  --ch-well: var(--dsw-alias-bg-layer-2, #151517);
  --ch-well-hover: #27272a;
  --ch-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.085));
  --ch-border-strong: rgba(255, 255, 255, 0.16);
  --ch-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.32);
  --ch-shadow-pop: 0 18px 44px rgba(0, 0, 0, 0.6);
  --ch-inset-top: inset 0 1px 0 rgba(255, 255, 255, 0.045);
  --ch-ink: var(--dsw-alias-label-primary, #f5f5f7);
  --ch-ink-2: #c7c7cc;
  --ch-muted: var(--dsw-alias-label-secondary, #8e8e93);
  --ch-blue: #4b9eff;
  --ch-teal: #3cc096;
  --ch-green: #45c767;
  --ch-purple: #9f8bf7;
  --ch-amber: #f0a742;
  --ch-danger: #ff6259;
  --ch-accent: #0a84ff;
  --ch-accent-soft: rgba(10, 132, 255, 0.17);
  --ch-accent-text: #5eb0ff;
  --ch-danger-soft: rgba(255, 98, 89, 0.15);
  --ch-warn-soft: rgba(240, 167, 66, 0.15);
  --ch-seg-active-bg: #323236;
  --ch-seg-active-fg: #f5f5f7;
  --ch-seg-active-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  --ch-brand-bg: #262629;
  --ch-brand-fg: #5eb0ff;
  --ch-track: #2c2c2e;
  --ch-grid-line: rgba(142, 142, 147, 0.12);
  --ch-turn-band: rgba(255, 255, 255, 0.026);
  --ch-code-bg: #141416;
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
  opacity: 0.45;
}
.ch-context :is(button, input, select, summary, a):focus-visible {
  outline: 2px solid var(--ch-accent);
  outline-offset: 2px;
}
.ch-context button:active:not(:disabled) {
  transform: translateY(0.5px);
}
.ch-shell {
  max-width: 1460px;
  margin-inline: auto;
  padding: 14px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.ch-embedded .ch-shell {
  padding: 10px 12px 16px;
  max-width: none;
}
.ch-page-heading {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 9px 14px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  flex-wrap: wrap;
}
.ch-heading-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
}
.ch-heading-title {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  flex-shrink: 0;
}
.ch-brand-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ch-brand-bg);
  color: var(--ch-brand-fg);
  border: 1px solid var(--ch-border);
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
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--ch-ink);
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--ch-muted);
  font-family: var(--ch-mono);
  font-size: 9.5px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.ch-version {
  font-size: 9.5px;
  text-decoration: none;
  color: var(--ch-muted);
  border: 1px solid var(--ch-border);
  padding: 0 4px;
  border-radius: 4px;
}
.ch-version:hover {
  color: var(--ch-ink);
  border-color: var(--ch-border-strong);
}
.ch-divider-v {
  width: 1px;
  height: 20px;
  background: var(--ch-border);
  flex-shrink: 0;
}
.ch-seg {
  display: inline-flex;
  align-items: center;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
  flex-shrink: 0;
}
.ch-seg button {
  border: 0;
  background: transparent;
  color: var(--ch-muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 550;
  line-height: 1.25;
  transition: background 0.13s, color 0.13s, box-shadow 0.13s;
  white-space: nowrap;
}
.ch-seg button:hover:not(:disabled) {
  color: var(--ch-ink);
}
.ch-seg button.is-active {
  background: var(--ch-seg-active-bg);
  color: var(--ch-seg-active-fg);
  box-shadow: var(--ch-seg-active-shadow);
}
.ch-meta-tag {
  font-family: var(--ch-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  color: var(--ch-ink-2);
  flex-shrink: 0;
}
.ch-meta-tag.is-muted {
  color: var(--ch-muted);
  font-weight: 500;
}
.ch-heading-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.ch-market-language-select {
  min-height: 28px;
  max-width: 94px;
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  color: var(--ch-ink-2);
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
  border: 1px solid var(--ch-border);
  font-size: 10.5px;
  font-weight: 550;
  color: var(--ch-ink-2);
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
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  color: var(--ch-ink-2);
  padding: 5px 10px;
  min-height: 28px;
  border-radius: 6px;
  line-height: 1.2;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  font-weight: 550;
}
.ch-mini-button {
  border-color: transparent;
  background: transparent;
  padding: 4px 8px;
  min-height: 26px;
  font-size: 10.5px;
}
.ch-button:hover:not(:disabled),
.ch-mini-button:hover:not(:disabled) {
  background: var(--ch-well);
  border-color: var(--ch-border-strong);
  color: var(--ch-ink);
}
.ch-mini-button.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-accent-text);
  border-color: transparent;
}
.ch-note,
.ch-eyebrow,
.ch-count {
  color: var(--ch-muted);
  font-size: 10.5px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.ch-count {
  font-family: var(--ch-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ch-scope {
  font-size: 10px;
  font-weight: 500;
  color: var(--ch-muted);
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 99px;
  padding: 2px 8px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ch-dot-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ch-ink-2);
  padding: 1px 7px;
  border-radius: 5px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
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
  max-width: 420px;
  flex: 0 1 360px;
}
.ch-session-picker > summary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  min-height: 30px;
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  background: var(--ch-well);
  cursor: pointer;
  list-style: none;
  min-width: 0;
  transition: background 0.12s, border-color 0.12s;
}
.ch-session-picker > summary:hover {
  background: var(--ch-well-hover);
  border-color: var(--ch-border-strong);
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
  border: 1px solid var(--ch-border);
  border-radius: 7px;
  padding: 5px 9px;
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
  border-top: 1px solid var(--ch-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-pagination small {
  color: var(--ch-muted);
  font-size: 10px;
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
  gap: 12px;
  min-width: 0;
}
.ch-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 1.18fr) minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
}
.ch-card {
  padding: 13px 15px;
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  min-width: 0;
  background: var(--ch-surface);
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.ch-card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-card-heading h2 {
  font-size: 12.5px;
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--ch-ink);
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
  font-size: 10px;
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
@container (max-width:1080px) {
  .ch-hero-grid {
    grid-template-columns: 1fr 1fr;
  }
  .ch-hero-grid > :nth-child(3) {
    grid-column: 1 / -1;
  }
}
@container (max-width:720px) {
  .ch-shell,
  .ch-embedded .ch-shell {
    padding: 10px;
  }
  .ch-page-heading {
    padding: 9px 10px;
    gap: 8px;
  }
  .ch-divider-v,
  .ch-status {
    display: none;
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
  .ch-hero-grid {
    grid-template-columns: 1fr;
  }
  .ch-hero-grid > :nth-child(3) {
    grid-column: auto;
  }
  .ch-button,
  .ch-mini-button,
  .ch-market-language-select,
  .ch-session-picker > summary {
    min-height: 38px;
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
`;var Tr=`.ch-context-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}
.ch-occupancy-number strong {
  font-family: var(--ch-mono);
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--ch-ink);
}
.ch-context-card.is-warn .ch-occupancy-number strong {
  color: var(--ch-amber);
}
.ch-context-card.is-danger .ch-occupancy-number strong {
  color: var(--ch-danger);
}
.ch-context-tokens {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 0;
}
.ch-context-tokens p {
  font-family: var(--ch-mono);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}
.ch-context-tokens p > b {
  font-weight: 650;
}
.ch-context-tokens p > span {
  font-size: 11px;
  color: var(--ch-muted);
}
.ch-remain-pill {
  font-family: var(--ch-mono);
  font-size: 10px;
  font-weight: 550;
  padding: 1px 7px;
  border-radius: 5px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  color: var(--ch-ink-2);
}
.ch-context-card.is-danger .ch-remain-pill {
  background: var(--ch-danger-soft);
  border-color: transparent;
  color: var(--ch-danger);
  font-weight: 650;
}
.ch-gauge-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ch-capacity-bar {
  position: relative;
  height: 8px;
  background: var(--ch-track);
  border-radius: 99px;
  overflow: hidden;
}
.ch-capacity-bar > span {
  height: 100%;
  display: block;
  background: var(--ch-blue);
  border-radius: 99px;
  transition: width 0.25s ease;
}
.ch-capacity-bar.is-high > span {
  background: var(--ch-amber);
}
.ch-capacity-bar.is-danger > span {
  background: var(--ch-danger);
}
.ch-gauge-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: var(--ch-surface);
  opacity: 0.85;
  pointer-events: none;
}
.ch-context-values {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-spark-box {
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  padding: 7px 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
}
.ch-spark-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-spark-head strong {
  color: var(--ch-ink-2);
  font-family: var(--ch-mono);
  font-weight: 600;
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
.ch-cost-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 99px;
  padding: 2px 9px;
  font-family: var(--ch-mono);
  font-size: 11.5px;
  color: var(--ch-ink);
}
.ch-cost-badge small {
  font-family: inherit;
  font-size: 9.5px;
  font-weight: 500;
  color: var(--ch-muted);
}
.ch-token-layout {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-height: 108px;
}
.ch-token-legend {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ch-token-legend > button {
  background: transparent;
  border: 0;
  color: var(--ch-ink-2);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 6px;
  font-size: 11px;
  border-radius: 6px;
  text-align: left;
  min-width: 0;
}
.ch-token-legend > button:hover,
.ch-token-legend > button.is-hi {
  background: var(--ch-well);
  color: var(--ch-ink);
}
.ch-token-legend > button > span:nth-child(2) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-token-legend > button > b {
  font-family: var(--ch-mono);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ch-ink);
  font-variant-numeric: tabular-nums;
}
.ch-token-legend > button > small {
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
  width: 38px;
  text-align: right;
}
.ch-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
.ch-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}
.ch-metric dt {
  font-size: 10px;
  color: var(--ch-muted);
  overflow-wrap: anywhere;
}
.ch-metric dd {
  font-family: var(--ch-mono);
  font-size: 14.5px;
  font-weight: 650;
  letter-spacing: -0.025em;
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
  margin-top: 4px;
  border-top: 1px solid var(--ch-border);
}
.ch-independent-cache .ch-metric dd {
  font-size: 13px;
}
.ch-token-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  border-top: 1px solid var(--ch-border);
  padding-top: 8px;
  font-size: 10.5px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-token-footer b {
  font-family: var(--ch-mono);
  font-size: 11.5px;
  margin-left: 4px;
  color: var(--ch-ink);
  font-variant-numeric: tabular-nums;
}
.ch-performance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}
.ch-performance:has(> .ch-metric:nth-child(4)) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.ch-performance .ch-metric {
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  padding: 7px 9px;
}
.ch-performance .ch-metric dd {
  font-size: 14.5px;
}
.ch-cache-bars {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ch-cache-row {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 8px;
  font-size: 10.5px;
}
.ch-cache-row > span {
  color: var(--ch-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-cache-row > b {
  font-family: var(--ch-mono);
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--ch-ink);
}
.ch-cache-track {
  height: 5px;
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
.ch-pulse-ribbon {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--ch-border);
  margin-top: auto;
}
.ch-pulse-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--ch-border);
  background: var(--ch-well);
  font-size: 10.5px;
  color: var(--ch-ink-2);
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.ch-pulse-pill:hover {
  background: var(--ch-well-hover);
  border-color: var(--ch-border-strong);
  color: var(--ch-ink);
}
.ch-pulse-pill > i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.ch-pulse-pill > i.is-user {
  background: var(--ch-green);
}
.ch-pulse-pill > i.is-tool {
  background: var(--ch-teal);
}
.ch-pulse-pill > i.is-assistant {
  background: var(--ch-blue);
}
.ch-pulse-pill > i.is-event {
  background: var(--ch-purple);
}
.ch-pulse-pill b {
  font-family: var(--ch-mono);
  font-weight: 650;
  color: var(--ch-ink);
}
.ch-pulse-pill.is-err {
  background: var(--ch-danger-soft);
  border-color: transparent;
  color: var(--ch-danger);
}
.ch-pulse-pill.is-err b {
  color: var(--ch-danger);
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
  font-family: var(--ch-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ch-context .lc-donut-center span {
  color: var(--ch-muted);
  max-width: 78px;
  line-height: 1.25;
}
.ch-context .lc-donut-seg {
  transition: stroke 0.15s, opacity 0.15s;
}
.ch-context .lc-donut-dim .lc-donut-seg {
  opacity: 0.22;
}
.ch-context .lc-donut-dim .lc-donut-seg-on {
  opacity: 1;
}
.ch-overview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ch-overview-intro {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 2px 2px 0;
}
.ch-overview-intro h2 {
  font-size: 14px;
  font-weight: 650;
}
.ch-overview-intro p {
  font-size: 11px;
  color: var(--ch-muted);
}
.ch-ov-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.ch-ov-kpi {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.ch-ov-kpi small {
  font-size: 10.5px;
  color: var(--ch-muted);
}
.ch-ov-kpi strong {
  font-family: var(--ch-mono);
  font-size: 21px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
}
.ch-ov-kpi strong.is-danger {
  color: var(--ch-danger);
}
.ch-ov-kpi strong.is-warn {
  color: var(--ch-amber);
}
.ch-ov-sub {
  font-size: 10.5px;
  color: var(--ch-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-ov-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.ch-ov-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-ov-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.ch-ov-skeleton {
  height: 132px;
}
.ch-overview-card {
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 11px;
  box-shadow: var(--ch-shadow-card), var(--ch-inset-top);
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  transition: border-color 0.14s, transform 0.14s;
  min-width: 0;
}
.ch-overview-card:hover {
  border-color: var(--ch-border-strong);
  transform: translateY(-1px);
}
.ch-overview-card.is-selected {
  border-color: var(--ch-accent);
  background: color-mix(in srgb, var(--ch-accent-soft) 35%, var(--ch-surface));
}
.ch-ov-card-top {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 11px;
  align-items: center;
}
.ch-mini-ring {
  position: relative;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
}
.ch-mini-ring svg {
  width: 52px;
  height: 52px;
  transform: rotate(-90deg);
}
.ch-mini-ring-track {
  fill: none;
  stroke: var(--ch-track);
  stroke-width: 5;
}
.ch-mini-ring-fill {
  fill: none;
  stroke: var(--ch-blue);
  stroke-width: 5;
  stroke-linecap: round;
}
.ch-mini-ring.is-warn .ch-mini-ring-fill {
  stroke: var(--ch-amber);
}
.ch-mini-ring.is-danger .ch-mini-ring-fill {
  stroke: var(--ch-danger);
}
.ch-mini-ring span {
  position: absolute;
  font-family: var(--ch-mono);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ch-ink);
}
.ch-mini-ring.is-none span {
  color: var(--ch-muted);
}
.ch-ov-card-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ch-ov-card-meta strong {
  font-size: 12.5px;
  font-weight: 650;
  color: var(--ch-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-ov-card-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.ch-ov-card-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding-top: 9px;
  border-top: 1px solid var(--ch-border);
}
.ch-ov-card-stats > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.ch-ov-card-stats small {
  font-size: 9.5px;
  color: var(--ch-muted);
}
.ch-ov-card-stats b {
  font-family: var(--ch-mono);
  font-size: 11px;
  color: var(--ch-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@container (max-width:1080px) {
  .ch-ov-grid,
  .ch-ov-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container (max-width:720px) {
  .ch-ov-grid,
  .ch-ov-summary {
    grid-template-columns: 1fr;
  }
  .ch-performance {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container (max-width:400px) {
  .ch-token-layout {
    flex-direction: column;
    align-items: stretch;
  }
  .ch-context .lc-donut {
    margin-inline: auto;
  }
  .ch-cache-row {
    grid-template-columns: 96px minmax(0, 1fr) 40px;
  }
}
`;var Sr=`.ch-workbench {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 12px;
  align-items: start;
}
.ch-workbench-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.ch-activity-chart {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 8px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  padding: 9px 10px 7px 9px;
}
.ch-lane-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0 8px;
  font-size: 10px;
  font-weight: 550;
  color: var(--ch-muted);
}
.ch-lane-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.ch-lane-label > i {
  width: 5px;
  height: 5px;
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
  height: 120px;
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
  opacity: 0.45;
  vector-effect: non-scaling-stroke;
}
.ch-tool-bridge.is-error {
  stroke: var(--ch-danger);
  opacity: 0.65;
}
.ch-timeline-cursor {
  stroke: var(--ch-muted);
  stroke-width: 1.2;
  stroke-dasharray: 3 3;
  vector-effect: non-scaling-stroke;
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
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-left: 2.5px solid var(--ch-blue);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
}
.ch-step-brief-meta > b {
  font-family: var(--ch-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  color: var(--ch-ink-2);
}
.ch-step-brief-time {
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-step-brief-text {
  font-size: 11.5px;
  color: var(--ch-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-pair-jump {
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  padding: 2px 7px;
  min-height: 22px;
  font-size: 10px;
}
.ch-signals-card {
  padding-top: 6px;
}
.ch-tab-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid var(--ch-border);
  margin: 0 -15px;
  padding: 0 15px;
  overflow-x: auto;
}
.ch-tab-btn {
  border: 0;
  background: transparent;
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ch-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  white-space: nowrap;
}
.ch-tab-btn:hover {
  color: var(--ch-ink);
}
.ch-tab-btn.is-active {
  color: var(--ch-ink);
}
.ch-tab-btn.is-active::after {
  content: '';
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: -1px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--ch-accent);
}
.ch-tab-count {
  font-family: var(--ch-mono);
  font-size: 9.5px;
  padding: 0 5px;
  border-radius: 99px;
  background: var(--ch-well);
  color: var(--ch-muted);
  border: 1px solid var(--ch-border);
}
.ch-tab-err {
  font-family: var(--ch-mono);
  font-size: 9.5px;
  padding: 0 5px;
  border-radius: 99px;
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
  font-weight: 700;
}
.ch-signal-panel {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}
.ch-subfilter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-chip-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.ch-chip {
  border: 1px solid var(--ch-border);
  background: transparent;
  color: var(--ch-muted);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 550;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;
}
.ch-chip:hover {
  color: var(--ch-ink);
  background: var(--ch-well);
}
.ch-chip.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-accent-text);
  border-color: transparent;
  font-weight: 600;
}
.ch-mini-input {
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  width: 150px;
  min-width: 0;
  outline: none;
}
.ch-mini-input:focus {
  border-color: var(--ch-accent);
}
.ch-file-list,
.ch-command-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 270px;
  overflow-y: auto;
  min-width: 0;
}
.ch-file-item {
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  background: var(--ch-surface);
  overflow: hidden;
}
.ch-file-item:hover {
  border-color: var(--ch-border-strong);
}
.ch-file-row-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
}
.ch-file-expand {
  border: 0;
  background: transparent;
  color: var(--ch-muted);
  width: 24px;
  min-height: 32px;
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
  padding: 7px 9px;
  min-width: 0;
  flex: 1;
  text-align: left;
}
.ch-file-row:hover {
  background: var(--ch-well);
}
.ch-file-left {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.ch-ext-badge {
  font-family: var(--ch-mono);
  font-size: 9px;
  font-weight: 650;
  padding: 1px 5px;
  border-radius: 4px;
  min-width: 30px;
  text-align: center;
  flex-shrink: 0;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  color: var(--ch-ink-2);
}
.ch-file-path {
  font-family: var(--ch-mono);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-file-dir {
  color: var(--ch-muted);
}
.ch-file-path strong {
  color: var(--ch-ink);
  font-weight: 650;
}
.ch-op-badges {
  display: inline-flex;
  gap: 4px;
  flex-shrink: 0;
}
.ch-op-tag {
  font-family: var(--ch-mono);
  font-size: 10px;
  font-style: normal;
  color: var(--ch-ink-2);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ch-well);
}
.ch-op-tag > em {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}
.ch-op-tag > em.is-tool {
  background: var(--ch-teal);
}
.ch-op-tag > em.is-assistant {
  background: var(--ch-blue);
}
.ch-op-tag > em.is-warn {
  background: var(--ch-amber);
}
.ch-file-ops {
  border-top: 1px solid var(--ch-border);
  background: var(--ch-well);
  padding: 6px 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ch-op-jump {
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  padding: 2px 7px;
  border-radius: 5px;
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-ink-2);
}
.ch-op-jump:hover {
  border-color: var(--ch-accent);
  color: var(--ch-accent-text);
}
.ch-prog-bars {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  padding: 6px 9px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
}
.ch-prog-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 5px;
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  font-family: var(--ch-mono);
  font-size: 10.5px;
}
.ch-prog-chip b {
  opacity: 0.65;
  font-weight: 500;
}
.ch-prog-chip.is-active {
  background: var(--ch-accent-soft);
  color: var(--ch-accent-text);
  border-color: transparent;
}
.ch-command-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  padding: 6px 9px;
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  background: var(--ch-surface);
  min-width: 0;
}
.ch-command-row:hover {
  border-color: var(--ch-border-strong);
}
.ch-command-row.is-error {
  border-color: color-mix(in srgb, var(--ch-danger) 35%, var(--ch-border));
  background: color-mix(in srgb, var(--ch-danger-soft) 50%, var(--ch-surface));
}
.ch-command-main {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  flex: 1;
  background: transparent;
  border: 0;
  padding: 2px 0;
  color: var(--ch-ink);
  text-align: left;
}
.ch-cmd-status {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}
.ch-result-known {
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  color: var(--ch-green);
}
.ch-result-state {
  background: var(--ch-well);
  color: var(--ch-muted);
}
.ch-result-error {
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
}
.ch-command-seq {
  font-family: var(--ch-mono);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
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
  font-family: var(--ch-mono);
}
.ch-sh-prog {
  color: var(--ch-ink);
  font-weight: 700;
}
.ch-sh-flag {
  color: var(--ch-teal);
}
.ch-sh-op {
  color: var(--ch-muted);
}
.ch-command-result {
  font-size: 10px;
  font-weight: 600;
  border: 1px solid var(--ch-border);
  border-radius: 5px;
  background: var(--ch-well);
  color: var(--ch-ink-2);
  padding: 3px 8px;
  flex-shrink: 0;
}
.ch-command-result:hover {
  border-color: var(--ch-accent);
  color: var(--ch-accent-text);
}
.ch-family-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ch-family-row,
.ch-family-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ch-border);
  background: var(--ch-surface);
  text-align: left;
  width: 100%;
  min-width: 0;
}
.ch-family-row:hover {
  border-color: var(--ch-border-strong);
  background: var(--ch-well);
}
.ch-family-current {
  border-color: var(--ch-accent);
  background: color-mix(in srgb, var(--ch-accent-soft) 35%, var(--ch-surface));
}
.ch-family-row.is-child {
  width: calc(100% - 16px);
  margin-left: 16px;
  position: relative;
}
.ch-family-row.is-child::before {
  content: '';
  position: absolute;
  left: -11px;
  top: -8px;
  bottom: 50%;
  width: 10px;
  border-left: 1.5px solid var(--ch-border-strong);
  border-bottom: 1.5px solid var(--ch-border-strong);
  border-bottom-left-radius: 5px;
}
.ch-family-node-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ch-family-node-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.ch-family-node-main b {
  font-size: 11.5px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-browser-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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
  border: 1px solid var(--ch-border);
  border-radius: 6px;
  background: transparent;
  color: var(--ch-muted);
  font-size: 10.5px;
  font-weight: 550;
  min-height: 26px;
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
  background: var(--ch-accent-soft);
  color: var(--ch-accent-text);
  border-color: transparent;
  font-weight: 600;
}
.ch-filter-count {
  font-family: var(--ch-mono);
  font-size: 9.5px;
  opacity: 0.75;
}
.ch-browser-search {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--ch-well);
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  padding: 3px 8px 3px 10px;
}
.ch-browser-search:focus-within {
  border-color: var(--ch-accent);
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
.ch-err-toggle {
  padding: 2px 7px;
  font-size: 10px;
}
.ch-browser-records {
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  background: var(--ch-well);
  max-height: 245px;
  min-height: 110px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ch-browser-records > .ch-note {
  padding: 14px 8px;
  text-align: center;
}
.ch-record-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ch-group-heading {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  background: var(--ch-surface);
  border: 0;
  border-left: 2.5px solid var(--ch-blue);
  border-radius: 6px;
  padding: 4px 8px;
  text-align: left;
  color: var(--ch-ink);
  font-size: 11px;
}
.ch-group-user > .ch-group-heading {
  border-left-color: var(--ch-green);
}
.ch-group-tool > .ch-group-heading {
  border-left-color: var(--ch-teal);
}
.ch-group-event > .ch-group-heading {
  border-left-color: var(--ch-purple);
}
.ch-group-heading > span:first-child {
  width: 10px;
  flex-shrink: 0;
  color: var(--ch-muted);
}
.ch-group-heading > b {
  font-weight: 600;
  flex: 1;
}
.ch-record-item {
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--ch-ink);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  min-height: 32px;
  width: 100%;
  min-width: 0;
  text-align: left;
  font-size: 11.5px;
}
.ch-record-item:hover {
  background: var(--ch-surface);
  border-color: var(--ch-border);
}
.ch-record-item.is-selected {
  background: var(--ch-accent-soft);
  border-color: transparent;
  box-shadow: inset 2.5px 0 0 var(--ch-accent);
}
.ch-record-item.is-error-row {
  box-shadow: inset 2.5px 0 0 var(--ch-danger);
}
.ch-record-seq {
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
  width: 28px;
  flex-shrink: 0;
}
.ch-row-role {
  font-size: 10px;
  padding: 0 6px;
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
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
  font-size: 10px;
  color: var(--ch-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.ch-record-badge {
  color: var(--ch-muted);
  background: var(--ch-surface);
  border: 1px solid var(--ch-border);
  border-radius: 4px;
  font-size: 9.5px;
  padding: 0 5px;
  flex-shrink: 0;
}
.ch-error-badge {
  color: var(--ch-danger);
  background: var(--ch-danger-soft);
  border-color: transparent;
  font-weight: 600;
}
.ch-record-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}
.ch-record-navigation > div {
  display: flex;
  align-items: center;
  gap: 5px;
}
.ch-record-navigation > div > span {
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
}
.ch-record-detail {
  border: 1px solid var(--ch-border);
  border-radius: 8px;
  background: var(--ch-surface-elevated);
  overflow: hidden;
  min-width: 0;
}
.ch-record-detail > header {
  padding: 8px 11px;
  background: var(--ch-well);
  border-bottom: 1px solid var(--ch-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ch-detail-title-row {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  flex: 1;
}
.ch-record-detail > header strong {
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}
.ch-detail-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.ch-record-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 11px;
  border-bottom: 1px solid var(--ch-border);
  font-family: var(--ch-mono);
  font-size: 10px;
  color: var(--ch-muted);
  flex-wrap: wrap;
}
.ch-record-meta > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.ch-record-content {
  padding: 11px 13px;
  max-height: 320px;
  min-height: 120px;
  overflow: auto;
  overscroll-behavior: contain;
  font-size: 12px;
  min-width: 0;
}
.ch-source-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 0;
  font-family: var(--ch-mono);
  font-size: 11px;
  line-height: 1.6;
}
.ch-context .ch-record-notice {
  margin: 7px 11px 0;
  padding: 6px 9px;
  background: var(--ch-warn-soft);
  color: var(--ch-amber);
  border-radius: 6px;
  font-size: 10.5px;
}
.ch-context .ch-record-notice.is-error {
  background: var(--ch-danger-soft);
  color: var(--ch-danger);
}
.ch-browser-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--ch-border);
}
.ch-browser-footer > div {
  display: flex;
  gap: 5px;
}
@container (max-width:950px) {
  .ch-workbench {
    grid-template-columns: 1fr;
  }
  .ch-record-time {
    display: none;
  }
}
@container (max-width:720px) {
  .ch-activity-chart {
    grid-template-columns: 38px minmax(0, 1fr);
  }
  .ch-mini-input {
    width: 100%;
  }
  .ch-record-item,
  .ch-group-heading,
  .ch-tab-btn,
  .ch-filter > button,
  .ch-command-main,
  .ch-command-result,
  .ch-family-row {
    min-height: 38px;
  }
}
@container (max-width:400px) {
  .ch-row-role {
    display: none;
  }
  .ch-command-seq {
    display: none;
  }
}
`;var Cr=`.ch-rich-text {
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
`;var Rr=`[data-conversation-scroll][data-ch-context-surface]
  > [data-composer-seat]:not(
    :has([data-approval-key], [data-plan-review-key], [data-question-key], [data-user-question-key])
  ) {
  display: none;
}
`;var G=require("react/jsx-runtime"),oe="ch-context",Qn=["slots","locale"],Ke=class extends Ge.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(t,n){}render(){return this.state.failed?(0,G.jsx)("div",{className:"ch-context",children:(0,G.jsxs)("div",{className:"ch-shell",children:[(0,G.jsx)("p",{role:"alert",children:this.props.translate()("errorBoundary")}),(0,G.jsx)("button",{className:"ch-button",onClick:()=>this.setState({failed:!1}),children:this.props.translate()("retry")})]})}):this.props.children}};function Jn(e){let t=()=>Ze(e.locale.getLocale?.().active??"en");e.effect(()=>e.locale.register(oe,{en:{...bt},zh:{...xt}}),"ch-context: locale"),e.effect(()=>{let a=document.createElement("style");return a.dataset.plugin=oe,a.dataset.pluginCss=oe,a.textContent=Nr+`
`+Tr+`
`+Sr+`
`+Cr+`
`+Rr,document.head.appendChild(a),()=>a.remove()},"ch-context: styles");let n=a=>{let i=(a.useProjection??(()=>{}))("codexhostUsage");return(0,G.jsx)(vt,{ctx:e,sessionId:a.sessionId,projection:i,embedded:!0})},o=a=>(0,G.jsx)(Ke,{translate:t,children:(0,G.jsx)(n,{...a})},`${a.sessionId??""}:${typeof a.useProjection}`),r=()=>(0,G.jsx)(Ke,{translate:t,children:(0,G.jsx)(vt,{ctx:e})});e.slots.inject("conversation.view",()=>e.slots.register({name:"conversation.view",id:oe,order:25,locale:oe,label:()=>t()("tab")},o)),e.slots.inject("main",()=>e.slots.register({name:"main",key:oe,locale:oe},r)),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:oe,order:25,label:()=>t()("compatibilityTitle"),locale:oe},a=>(0,Ge.createElement)(Re,{size:typeof a.size=="number"?a.size:20}))),e.slots.inject("settings.section",()=>e.slots.register({name:"settings.section",id:oe,order:25,label:()=>t()("titleShort"),locale:oe},()=>(0,G.jsx)("div",{className:"ch-context",children:(0,G.jsxs)("div",{className:"ch-settings",children:[(0,G.jsx)("h2",{children:"CH Context"}),(0,G.jsx)("p",{children:t()("settingsNote")}),(0,G.jsx)("p",{children:t()("localOnly")}),(0,G.jsx)("button",{className:"ch-button",onClick:()=>{let a=ae(e.get("layout"));typeof a?.selectPanel=="function"&&a.selectPanel(oe)},children:t()("title")}),(0,G.jsx)("small",{children:t()("readOnly")})]})})))}

return module.exports;}});
