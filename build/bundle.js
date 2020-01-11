var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function s(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e,n){t.$$.on_destroy.push(function(t,e){const n=t.subscribe(e);return n.unsubscribe?()=>n.unsubscribe():n}(e,n))}function i(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function p(){return f(" ")}function h(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){e=""+e,t.data!==e&&(t.data=e)}function $(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}function v(t,e,n){t.classList[n?"add":"remove"](e)}let x;function y(t){x=t}const b=[],w=[],k=[],_=[],A=Promise.resolve();let z=!1;function E(t){k.push(t)}function M(){const t=new Set;do{for(;b.length;){const t=b.shift();y(t),j(t.$$)}for(;w.length;)w.pop()();for(let e=0;e<k.length;e+=1){const n=k[e];t.has(n)||(n(),t.add(n))}k.length=0}while(b.length);for(;_.length;)_.pop()();z=!1}function j(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const q=new Set;let N;function O(t,e){t&&t.i&&(q.delete(t),t.i(e))}function T(t,e,n,r){if(t&&t.o){if(q.has(t))return;q.add(t),N.c.push(()=>{q.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const B="undefined"!=typeof window?window:global;function C(t){t&&t.c()}function L(t,e,r){const{fragment:l,on_mount:c,on_destroy:i,after_update:a}=t.$$;l&&l.m(e,r),E(()=>{const e=c.map(n).filter(s);i?i.push(...e):o(e),t.$$.on_mount=[]}),a.forEach(E)}function S(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function F(t,e){-1===t.$$.dirty[0]&&(b.push(t),z||(z=!0,A.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function I(e,n,s,l,c,i,a=[-1]){const u=x;y(e);const d=n.props||{},f=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:a};let p=!1;f.ctx=s?s(e,d,(t,n,r=n)=>(f.ctx&&c(f.ctx[t],f.ctx[t]=r)&&(f.bound[t]&&f.bound[t](r),p&&F(e,t)),n)):[],f.update(),p=!0,o(f.before_update),f.fragment=!!l&&l(f.ctx),n.target&&(n.hydrate?f.fragment&&f.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):f.fragment&&f.fragment.c(),n.intro&&O(e.$$.fragment),L(e,n.target,n.anchor),M()),y(u)}class P{$destroy(){S(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const W=[];function D(e,n=t){let r;const o=[];function s(t){if(l(e,t)&&(e=t,r)){const t=!W.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),W.push(n,e)}if(t){for(let t=0;t<W.length;t+=2)W[t][0](W[t+1]);W.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(l,c=t){const i=[l,c];return o.push(i),1===o.length&&(r=n(s)||t),l(e),()=>{const t=o.indexOf(i);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}const G=t=>(6364136223846793005n*BigInt(t)+1442695040888963407n)%2n**64n,H=(t=>{let e=(t=>{let e=1n,n=[G(t)];for(;e<7n;)n=[...n,G(e*n[e-1n])],++e;return n})(t);return t=>{if(t<0||6<t)return;let n=e[t];return e[t]=G(n),Number(n%9n)}})((R=prompt("What seed is now?"),(R=String(R).match(/[0-9A-Za-z]/g))&&R.length?(R=R.length>192?R.slice(0,192):R,Number(parseInt(R.join(""),36))):0));var R;const V=t=>{const e=[Array(14).fill(),Array(14).fill(),Array(14).fill(),Array(14).fill(),Array(14).fill(),Array(14).fill(),Array(14).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e},Z=t=>{const e=[],n=V(t);for(let r in n){let o=0;for(let s in n[r]){const l=n[r][s];if(void 0!==l){const n=t[l];e[l]={x:n.x,y:s-o,value:n.value,duration:100*Math.sqrt(2*o)}}else++o}}return e},J=t=>{const e=V(t);let n=[],r=0;const o=s=>{const{value:l,x:c,y:i}=t[s];if(n[s])return;let a,u,d,f;n[s]={value:l,group:r},i<5&&(a=e[c][i+1]),c<5&&(u=e[c+1][i]),i>0&&(d=e[c][i-1]),c>0&&(f=e[c-1][i]);const p=e=>e&&t[e].value===l;p(a)&&o(a),p(u)&&o(u),p(d)&&o(d),p(f)&&o(f)};for(let e in t)++r,o(e);const s=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(s).reduce((t,e)=>{const{value:n,indexes:r}=s[e];return n===r.length?[...t,...r]:t},[])},K=(t,e)=>{let n=[0,0,0,0,0,0];return t.map((r,o)=>{return e.includes(o)&&r.y<6?(++n[r.x],{x:r.x,y:(s=r.x,n[s]+t.filter(t=>t.x===s).sort(({y:t},{y:e})=>t-e)[5].y),value:H(r.x),duration:0}):r;var s})},Q=(t=5)=>`hsl(${Math.floor(360*Math.random())},100%,${t}%)`,U=()=>window.innerHeight/window.innerWidth>1.72,X=D(0),Y=D("input"),tt=D((t=>{let e=1;for(;e;){if(e=J(t),!e.length)return t;t=Z(K(t,e))}})(Array(36).fill(void 0).map((t,e)=>({x:Math.floor(e/6),y:e%6,value:H(Math.floor(e/6)),duration:0})))),et=D(100);function nt(e){let n,r,o,s,l,c,h,$,x;return{c(){n=d("div"),r=d("div"),o=d("div"),s=f(e[3]),c=p(),h=d("div"),$=f(e[4]),m(o,"class",l="current value"+e[3]+" svelte-i2kdz9"),m(h,"class",x="next value"+e[4]+" svelte-i2kdz9"),m(r,"class","value svelte-i2kdz9"),m(n,"class","card svelte-i2kdz9"),m(n,"style",e[5]),m(n,"data-index",e[0]),v(n,"plused",e[1]),v(n,"matched",e[2])},m(t,e){a(t,n,e),i(n,r),i(r,o),i(o,s),i(r,c),i(r,h),i(h,$)},p(t,[e]){8&e&&g(s,t[3]),8&e&&l!==(l="current value"+t[3]+" svelte-i2kdz9")&&m(o,"class",l),16&e&&g($,t[4]),16&e&&x!==(x="next value"+t[4]+" svelte-i2kdz9")&&m(h,"class",x),32&e&&m(n,"style",t[5]),1&e&&m(n,"data-index",t[0]),2&e&&v(n,"plused",t[1]),4&e&&v(n,"matched",t[2])},i:t,o:t,d(t){t&&u(n)}}}function rt(t,e,n){let r,o,{index:s}=e,{phase:l}=e,{plused:c}=e,{matched:i}=e,{duration:a}=e,{value:u}=e,{x:d=0}=e,{y:f=0}=e;return t.$set=t=>{"index"in t&&n(0,s=t.index),"phase"in t&&n(6,l=t.phase),"plused"in t&&n(1,c=t.plused),"matched"in t&&n(2,i=t.matched),"duration"in t&&n(7,a=t.duration),"value"in t&&n(3,u=t.value),"x"in t&&n(8,d=t.x),"y"in t&&n(9,f=t.y)},t.$$.update=()=>{8&t.$$.dirty&&n(4,r=u<9?u+1:0),960&t.$$.dirty&&n(5,o=`\n    transition-duration: ${"fall"===l?a:0}ms;\n    left: calc(${d} * var(--card-size));\n    bottom: calc(${f} * var(--card-size));\n  `)},[s,c,i,u,r,o,l,a,d,f]}class ot extends P{constructor(t){super(),I(this,t,rt,nt,l,{index:0,phase:6,plused:1,matched:2,duration:7,value:3,x:8,y:9})}}function st(t,e,n){const r=t.slice();return r[7]=e[n],r[9]=n,r}function lt(t){let n;const r=[{phase:t[3]},{plused:t[0]===t[9]},{matched:t[1].includes(t[9])},t[7],{index:t[9]}];let o={};for(let t=0;t<r.length;t+=1)o=e(o,r[t]);const s=new ot({props:o});return{c(){C(s.$$.fragment)},m(t,e){L(s,t,e),n=!0},p(t,e){const n=15&e?function(t,e){const n={},r={},o={$$scope:1};let s=t.length;for(;s--;){const l=t[s],c=e[s];if(c){for(const t in l)t in c||(r[t]=1);for(const t in c)o[t]||(n[t]=c[t],o[t]=1);t[s]=c}else for(const t in l)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(r,[8&e&&{phase:t[3]},1&e&&{plused:t[0]===t[9]},2&e&&{matched:t[1].includes(t[9])},4&e&&(o=t[7],"object"==typeof o&&null!==o?o:{}),r[4]]):{};var o;s.$set(n)},i(t){n||(O(s.$$.fragment,t),n=!0)},o(t){T(s.$$.fragment,t),n=!1},d(t){S(s,t)}}}function ct(t){let e,n,r,s=t[2],l=[];for(let e=0;e<s.length;e+=1)l[e]=lt(st(t,s,e));const c=t=>T(l[t],1,1,()=>{l[t]=null});return{c(){e=d("div");for(let t=0;t<l.length;t+=1)l[t].c();m(e,"class","board svelte-7ha5pc"),r=h(e,"click",t[4])},m(t,r){a(t,e,r);for(let t=0;t<l.length;t+=1)l[t].m(e,null);n=!0},p(t,[n]){if(15&n){let r;for(s=t[2],r=0;r<s.length;r+=1){const o=st(t,s,r);l[r]?(l[r].p(o,n),O(l[r],1)):(l[r]=lt(o),l[r].c(),O(l[r],1),l[r].m(e,null))}for(N={r:0,c:[],p:N},r=s.length;r<l.length;r+=1)c(r);N.r||o(N.c),N=N.p}},i(t){if(!n){for(let t=0;t<s.length;t+=1)O(l[t]);n=!0}},o(t){l=l.filter(Boolean);for(let t=0;t<l.length;t+=1)T(l[t]);n=!1},d(t){t&&u(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(l,t),r()}}}function it(t,e,n){let r,o,s,l;c(t,tt,t=>n(2,r=t)),c(t,et,t=>n(5,o=t)),c(t,Y,t=>n(3,s=t));let i=[];Y.subscribe(t=>{switch(t){case"plus":tt.set(((t,e)=>t.map((t,n)=>e===n&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t))(r,l)),Y.set("blink");break;case"blink":n(0,l=void 0),n(1,i=J(r)),i.length?window.setTimeout(()=>Y.set("match"),400):o<10?Y.set("gameover"):(o>100&&et.set(100),Y.set("input"));break;case"match":const t=i.reduce((t,e)=>t+r[e].value,0);et.set(o+t),tt.set(K(r,i)),n(1,i=[]),window.setTimeout(()=>Y.set("fall"),600);break;case"fall":tt.set(Z(r)),window.setTimeout(()=>Y.set("blink"),400);break;case"gameover":alert("GAME OVER")}});const a=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?a(e):void 0;return[l,i,r,s,({target:t})=>{"input"!==s||l||(n(0,l=Number(a(t))),"number"==typeof l&&(et.set(o-10),window.setTimeout(()=>Y.set("plus"),400)))}]}class at extends P{constructor(t){super(),I(this,t,it,ct,l,{})}}function ut(e){let n,r,o,s,l;return{c(){n=d("div"),r=d("div"),o=d("span"),s=f(e[0]),m(o,"class","value svelte-w2xkmq"),m(r,"class","bar svelte-w2xkmq"),m(r,"style",l=`width: ${e[1](e[0])}%`),m(n,"class","energy svelte-w2xkmq")},m(t,e){a(t,n,e),i(n,r),i(r,o),i(o,s)},p(t,[e]){1&e&&g(s,t[0]),1&e&&l!==(l=`width: ${t[1](t[0])}%`)&&m(r,"style",l)},i:t,o:t,d(t){t&&u(n)}}}function dt(t,e,n){let r;c(t,et,t=>n(0,r=t));return[r,t=>t>100?100:t<0?0:t]}class ft extends P{constructor(t){super(),I(this,t,dt,ut,l,{})}}function pt(e){let n,r;return{c(){n=d("span"),r=f(e[0]),m(n,"class","score svelte-io3x13")},m(t,e){a(t,n,e),i(n,r)},p(t,[e]){1&e&&g(r,t[0])},i:t,o:t,d(t){t&&u(n)}}}function ht(t,e,n){let r;return c(t,X,t=>n(0,r=t)),[r]}class mt extends P{constructor(t){super(),I(this,t,ht,pt,l,{})}}function gt(e){let n,r,o,s,l,c,f;const g=new mt({}),$=new at({}),v=new ft({});return{c(){n=d("div"),r=d("button"),r.textContent="Digifall",o=p(),C(g.$$.fragment),s=p(),C($.$$.fragment),l=p(),C(v.$$.fragment),m(r,"class","digifall svelte-lj1xxa"),m(n,"class","game svelte-lj1xxa"),f=h(r,"click",e[0])},m(t,e){a(t,n,e),i(n,r),i(n,o),L(g,n,null),i(n,s),L($,n,null),i(n,l),L(v,n,null),c=!0},p:t,i(t){c||(O(g.$$.fragment,t),O($.$$.fragment,t),O(v.$$.fragment,t),c=!0)},o(t){T(g.$$.fragment,t),T($.$$.fragment,t),T(v.$$.fragment,t),c=!1},d(t){t&&u(n),S(g),S($),S(v),f()}}}function $t(t){return[()=>{const{documentElement:t,fullscreen:e}=document;e?document.exitFullscreen():t.requestFullscreen()}]}class vt extends P{constructor(t){super(),I(this,t,$t,gt,l,{})}}const{window:xt}=B;function yt(t){let e,n,r,o,s,l;const c=new vt({});return{c(){e=d("div"),n=d("span"),r=f(t[1]),o=p(),C(c.$$.fragment),$(n,"color","white"),$(n,"position","absolute"),m(e,"class","app svelte-1aq810z"),m(e,"style",t[0]),l=h(xt,"keypress",t[3])},m(t,l){a(t,e,l),i(e,n),i(n,r),i(e,o),L(c,e,null),s=!0},p(t,[n]){(!s||2&n)&&g(r,t[1]),(!s||1&n)&&m(e,"style",t[0])},i(t){s||(O(c.$$.fragment,t),s=!0)},o(t){T(c.$$.fragment,t),s=!1},d(t){t&&u(e),S(c),l()}}}function bt(t,e,n){let r;c(t,Y,t=>n(1,r=t));const o=()=>{const[t,e,n,r]=(t=>{for(let e=t.length-1;e>0;--e){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})([7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);return`\n      background-color: ${Q()};\n      background-image:\n        linear-gradient(90deg, ${Q()} 50%, transparent 50%),\n        linear-gradient(90deg, ${Q()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${Q()} 50%),\n        linear-gradient(90deg, transparent 50%, ${Q()} 50%);\n      background-position: center;\n      background-size:\n        calc(${t} * var(--pixel)),\n        calc(${e} * var(--pixel)),\n        calc(${n} * var(--pixel)),\n        calc(${r} * var(--pixel));\n  `};let s=o();window.onresize=()=>{n(0,s=U()?"":o())};return[s,r,o,({key:t})=>{"1"===t&&et.set(10),"0"===t&&et.set(100)}]}return new class extends P{constructor(t){super(),I(this,t,bt,yt,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
