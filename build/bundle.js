var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function l(t){t.forEach(n)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,n,r){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(n,r))}function u(t,n,r,l){return t[1]&&l?e(r.ctx.slice(),t[1](l(n))):r.ctx}function i(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function d(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function g(t){return document.createTextNode(t)}function m(){return g(" ")}function $(){return g("")}function h(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}function b(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}function y(t,e,n){t.classList[n?"add":"remove"](e)}let k;function w(t){k=t}function j(t){(function(){if(!k)throw new Error("Function called outside component initialization");return k})().$$.on_mount.push(t)}const _=[],N=[],A=[],E=[],O=Promise.resolve();let P=!1;function C(t){A.push(t)}let M=!1;const z=new Set;function T(){if(!M){M=!0;do{for(let t=0;t<_.length;t+=1){const e=_[t];w(e),q(e.$$)}for(_.length=0;N.length;)N.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];z.has(e)||(z.add(e),e())}A.length=0}while(_.length);for(;E.length;)E.pop()();P=!1,M=!1,z.clear()}}function q(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const S=new Set;let F;function L(){F={r:0,c:[],p:F}}function B(){F.r||l(F.c),F=F.p}function D(t,e){t&&t.i&&(S.delete(t),t.i(e))}function H(t,e,n,r){if(t&&t.o){if(S.has(t))return;S.add(t),F.c.push(()=>{S.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function I(t){t&&t.c()}function W(t,e,r){const{fragment:c,on_mount:s,on_destroy:u,after_update:i}=t.$$;c&&c.m(e,r),C(()=>{const e=s.map(n).filter(o);u?u.push(...e):l(e),t.$$.on_mount=[]}),i.forEach(C)}function Z(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function G(t,e){-1===t.$$.dirty[0]&&(_.push(t),P||(P=!0,O.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function J(e,n,o,c,s,u,i=[-1]){const a=k;w(e);const d=n.props||{},p=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:s,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:r(),dirty:i};let g=!1;if(p.ctx=o?o(e,d,(t,n,...r)=>{const l=r.length?r[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=l)&&(p.bound[t]&&p.bound[t](l),g&&G(e,t)),n}):[],p.update(),g=!0,l(p.before_update),p.fragment=!!c&&c(p.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);p.fragment&&p.fragment.l(t),t.forEach(f)}else p.fragment&&p.fragment.c();n.intro&&D(e.$$.fragment),W(e,n.target,n.anchor),T()}w(a)}class K{$destroy(){Z(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const Q=[];function R(e,n=t){let r;const l=[];function o(t){if(c(e,t)&&(e=t,r)){const t=!Q.length;for(let t=0;t<l.length;t+=1){const n=l[t];n[1](),Q.push(n,e)}if(t){for(let t=0;t<Q.length;t+=2)Q[t][0](Q[t+1]);Q.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(c,s=t){const u=[c,s];return l.push(u),1===l.length&&(r=n(o)||t),c(e),()=>{const t=l.indexOf(u);-1!==t&&l.splice(t,1),0===l.length&&(r(),r=null)}}}}const U=(t=0)=>(16807*t+19487171)%2147483647,V=(t=>{let e=(t=>{let e=1,n=[U(t)];for(;e<6;)n=n.concat(U(++e*n[0]));return n})(t);return t=>{if(t<0||5<t)return;let n=e[t];return e[t]=U(n),Number(n%10)}})((X=Date.now(),(X=String(X).match(/[0-9A-Za-z]/g))?(X=X.length>192?X.slice(0,192):X,Number(parseInt(X.join(""),36))):0));var X;const Y=t=>{const e=[Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e},tt=()=>(t=>{let e=1;for(;e;){if(e=nt(t),!e.length)return t;t=et(rt(t,e))}})(Array(36).fill(void 0).map((t,e)=>({x:Math.floor(e/6),y:e%6,value:V(Math.floor(e/6)),duration:0}))),et=t=>{const e=[],n=Y(t);for(let r in n){let l=0;for(let o in n[r]){const c=n[r][o];if(void 0!==c){const n=t[c];e[c]={x:n.x,y:o-l,value:n.value,duration:100*Math.sqrt(2*l)}}else++l}}return e},nt=t=>{const e=Y(t);let n=[],r=0;const l=o=>{const{value:c,x:s,y:u}=t[o];if(n[o])return;let i,a,f,d;n[o]={value:c,group:r},u<5&&(i=e[s][u+1]),s<5&&(a=e[s+1][u]),u>0&&(f=e[s][u-1]),s>0&&(d=e[s-1][u]);const p=e=>e&&t[e].value===c;p(i)&&l(i),p(a)&&l(a),p(f)&&l(f),p(d)&&l(d)};for(let e in t)++r,l(e);const o=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(o).reduce((t,e)=>{const{value:n,indexes:r}=o[e];return n===r.length?[...t,...r]:t},[])},rt=(t,e)=>{let n=[0,0,0,0,0,0];return t.map((r,l)=>{return e.includes(l)&&r.y<6?(++n[r.x],{x:r.x,y:(o=r.x,n[o]+t.filter(t=>t.x===o).sort(({y:t},{y:e})=>t-e)[5].y),value:V(r.x),duration:0}):r;var o})},lt=R(0),ot=R("idle"),ct=R(!0),st=R(tt()),ut=R(100),it=R([]),at=()=>{ot.set("idle"),ct.set(!1),st.set(tt()),ut.set(100),it.set([])};function ft(e){let n,r,l,o,c,s,u,d,$;return{c(){n=p("div"),r=p("div"),l=p("div"),o=g(e[4]),s=m(),u=p("div"),d=g(e[5]),v(l,"class",c="current color-"+e[4]+" svelte-1ijagk8"),v(u,"class",$="next color-"+e[5]+" svelte-1ijagk8"),v(r,"class","value svelte-1ijagk8"),v(n,"class","card svelte-1ijagk8"),v(n,"style",e[6]),v(n,"data-index",e[0]),y(n,"clickable",e[1]),y(n,"plused",e[3]),y(n,"matched",e[2])},m(t,e){a(t,n,e),i(n,r),i(r,l),i(l,o),i(r,s),i(r,u),i(u,d)},p(t,[e]){16&e&&x(o,t[4]),16&e&&c!==(c="current color-"+t[4]+" svelte-1ijagk8")&&v(l,"class",c),32&e&&x(d,t[5]),32&e&&$!==($="next color-"+t[5]+" svelte-1ijagk8")&&v(u,"class",$),64&e&&v(n,"style",t[6]),1&e&&v(n,"data-index",t[0]),2&e&&y(n,"clickable",t[1]),8&e&&y(n,"plused",t[3]),4&e&&y(n,"matched",t[2])},i:t,o:t,d(t){t&&f(n)}}}function dt(t,e,n){let r,l,{index:o}=e,{clickable:c}=e,{duration:s}=e,{fallPhase:u}=e,{matched:i}=e,{plused:a}=e,{value:f}=e,{x:d=0}=e,{y:p=0}=e;return t.$set=t=>{"index"in t&&n(0,o=t.index),"clickable"in t&&n(1,c=t.clickable),"duration"in t&&n(7,s=t.duration),"fallPhase"in t&&n(8,u=t.fallPhase),"matched"in t&&n(2,i=t.matched),"plused"in t&&n(3,a=t.plused),"value"in t&&n(4,f=t.value),"x"in t&&n(9,d=t.x),"y"in t&&n(10,p=t.y)},t.$$.update=()=>{16&t.$$.dirty&&n(5,r=f<9?f+1:0),1920&t.$$.dirty&&n(6,l=`\n    transition-duration: ${u?s:0}ms;\n    left: var(--pixel-${21*d});\n    bottom: var(--pixel-${21*p});\n  `)},[o,c,i,a,f,r,l,s,u,d,p]}class pt extends K{constructor(t){super(),J(this,t,dt,ft,c,{index:0,clickable:1,duration:7,fallPhase:8,matched:2,plused:3,value:4,x:9,y:10})}}function gt(t,e,n){const r=t.slice();return r[8]=e[n],r[10]=n,r}function mt(t){let n;const r=[{clickable:"idle"===t[3]&&!t[0]},{fallPhase:"fall"===t[3]},{matched:t[1].includes(t[10])},{plused:t[0]===t[10]},t[8],{index:t[10]}];let l={};for(let t=0;t<r.length;t+=1)l=e(l,r[t]);const o=new pt({props:l});return{c(){I(o.$$.fragment)},m(t,e){W(o,t,e),n=!0},p(t,e){const n=15&e?function(t,e){const n={},r={},l={$$scope:1};let o=t.length;for(;o--;){const c=t[o],s=e[o];if(s){for(const t in c)t in s||(r[t]=1);for(const t in s)l[t]||(n[t]=s[t],l[t]=1);t[o]=s}else for(const t in c)l[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(r,[9&e&&{clickable:"idle"===t[3]&&!t[0]},8&e&&{fallPhase:"fall"===t[3]},2&e&&{matched:t[1].includes(t[10])},1&e&&{plused:t[0]===t[10]},4&e&&(l=t[8],"object"==typeof l&&null!==l?l:{}),r[5]]):{};var l;o.$set(n)},i(t){n||(D(o.$$.fragment,t),n=!0)},o(t){H(o.$$.fragment,t),n=!1},d(t){Z(o,t)}}}function $t(t){let e,n,r,l=t[2],o=[];for(let e=0;e<l.length;e+=1)o[e]=mt(gt(t,l,e));const c=t=>H(o[t],1,1,()=>{o[t]=null});return{c(){e=p("div");for(let t=0;t<o.length;t+=1)o[t].c();v(e,"class","board svelte-1n2w8ye"),y(e,"overflow-hidden","idle"!==t[3])},m(l,c,s){a(l,e,c);for(let t=0;t<o.length;t+=1)o[t].m(e,null);n=!0,s&&r(),r=h(e,"click",t[4])},p(t,[n]){if(15&n){let r;for(l=t[2],r=0;r<l.length;r+=1){const c=gt(t,l,r);o[r]?(o[r].p(c,n),D(o[r],1)):(o[r]=mt(c),o[r].c(),D(o[r],1),o[r].m(e,null))}for(L(),r=l.length;r<o.length;r+=1)c(r);B()}8&n&&y(e,"overflow-hidden","idle"!==t[3])},i(t){if(!n){for(let t=0;t<l.length;t+=1)D(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)H(o[t]);n=!1},d(t){t&&f(e),d(o,t),r()}}}function ht(t,e,n){let r,l,o,c,u;s(t,st,t=>n(2,r=t)),s(t,it,t=>n(5,l=t)),s(t,ut,t=>n(6,o=t)),s(t,ot,t=>n(3,c=t));let i=[];ot.subscribe(t=>{switch(t){case"plus":st.set(((t,e)=>t.map((t,n)=>e===n&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t))(r,u)),ot.set("blink");break;case"blink":n(0,u=void 0),n(1,i=nt(r)),i.length?(it.set(l.concat(i.reduce((t,e)=>{const{value:n}=r[e];return t[n]=(t[n]||0)+n,t},{}))),setTimeout(()=>ot.set("match"),600)):o<10?ot.set("gameover"):(ot.set("idle"),o>100&&ut.set(100),l.length&&it.set([]));break;case"match":const t=i.reduce((t,e)=>t+r[e].value,0);ut.set(o+t),st.set(rt(r,i)),n(1,i=[]),setTimeout(()=>ot.set("fall"),600);break;case"fall":st.set(et(r)),setTimeout(()=>ot.set("blink"),400);break;case"gameover":ct.set(!0)}});const a=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?a(e):void 0;return[u,i,r,c,({target:t})=>{"idle"!==c||u||(n(0,u=Number(a(t))),Number.isNaN(u)||(ut.set(o-10),setTimeout(()=>ot.set("plus"),400)))}]}class vt extends K{constructor(t){super(),J(this,t,ht,$t,c,{})}}function xt(e){let n,r,l,o,c;return{c(){n=p("div"),r=p("div"),l=p("span"),o=g(e[0]),v(l,"class","value svelte-195no6i"),v(r,"class","bar svelte-195no6i"),v(r,"style",c=`width: ${e[1](e[0])}%`),v(n,"class","energy svelte-195no6i")},m(t,e){a(t,n,e),i(n,r),i(r,l),i(l,o)},p(t,[e]){1&e&&x(o,t[0]),1&e&&c!==(c=`width: ${t[1](t[0])}%`)&&v(r,"style",c)},i:t,o:t,d(t){t&&f(n)}}}function bt(t,e,n){let r;s(t,ut,t=>n(0,r=t));return[r,t=>t>100?100:t<0?0:t]}class yt extends K{constructor(t){super(),J(this,t,bt,xt,c,{})}}function kt(e){let n,r;return{c(){n=p("span"),r=g(e[0]),v(n,"class","score svelte-15zelnx")},m(t,e){a(t,n,e),i(n,r)},p(t,[e]){1&e&&x(r,t[0])},i:t,o:t,d(t){t&&f(n)}}}function wt(t,e,n){let r;return s(t,lt,t=>n(0,r=t)),[r]}class jt extends K{constructor(t){super(),J(this,t,wt,kt,c,{})}}function _t(t,e,n){const r=t.slice();return r[4]=e[n][0],r[5]=e[n][1],r[7]=n,r}function Nt(t,e,n){const r=t.slice();return r[1]=e[n],r}function At(t){let e,n=t[0].slice(-5),r=[];for(let e=0;e<n.length;e+=1)r[e]=Pt(Nt(t,n,e));return{c(){e=p("ol");for(let t=0;t<r.length;t+=1)r[t].c();v(e,"class","log svelte-1bgwftc")},m(t,n){a(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,l){if(1&l){let o;for(n=t[0].slice(-5),o=0;o<n.length;o+=1){const c=Nt(t,n,o);r[o]?r[o].p(c,l):(r[o]=Pt(c),r[o].c(),r[o].m(e,null))}for(;o<r.length;o+=1)r[o].d(1);r.length=n.length}},d(t){t&&f(e),d(r,t)}}}function Et(t){let e;return{c(){e=p("span"),e.textContent="+",v(e,"class","plus")},m(t,n){a(t,e,n)},d(t){t&&f(e)}}}function Ot(t){let e,n,r,l,o,c=t[5]+"",s=t[7]<Object.keys(t[1]).length-1,u=s&&Et();return{c(){e=p("span"),n=g(c),l=m(),u&&u.c(),o=$(),v(e,"class",r="value color-"+t[4]+" svelte-1bgwftc")},m(t,r){a(t,e,r),i(e,n),a(t,l,r),u&&u.m(t,r),a(t,o,r)},p(t,l){1&l&&c!==(c=t[5]+"")&&x(n,c),1&l&&r!==(r="value color-"+t[4]+" svelte-1bgwftc")&&v(e,"class",r),1&l&&(s=t[7]<Object.keys(t[1]).length-1),s?u||(u=Et(),u.c(),u.m(o.parentNode,o)):u&&(u.d(1),u=null)},d(t){t&&f(e),t&&f(l),u&&u.d(t),t&&f(o)}}}function Pt(t){let e,n,r,l,o,c=Object.values(t[1]).reduce(Mt)+"",s=Object.entries(t[1]),u=[];for(let e=0;e<s.length;e+=1)u[e]=Ot(_t(t,s,e));return{c(){e=p("li");for(let t=0;t<u.length;t+=1)u[t].c();n=m(),r=p("span"),l=g(c),o=m(),v(r,"class","sum svelte-1bgwftc"),v(e,"class","svelte-1bgwftc")},m(t,c){a(t,e,c);for(let t=0;t<u.length;t+=1)u[t].m(e,null);i(e,n),i(e,r),i(r,l),i(e,o)},p(t,r){if(1&r){let l;for(s=Object.entries(t[1]),l=0;l<s.length;l+=1){const o=_t(t,s,l);u[l]?u[l].p(o,r):(u[l]=Ot(o),u[l].c(),u[l].m(e,n))}for(;l<u.length;l+=1)u[l].d(1);u.length=s.length}1&r&&c!==(c=Object.values(t[1]).reduce(Mt)+"")&&x(l,c)},d(t){t&&f(e),d(u,t)}}}function Ct(e){let n,r=e[0].length&&At(e);return{c(){r&&r.c(),n=$()},m(t,e){r&&r.m(t,e),a(t,n,e)},p(t,[e]){t[0].length?r?r.p(t,e):(r=At(t),r.c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i:t,o:t,d(t){r&&r.d(t),t&&f(n)}}}const Mt=(t,e)=>t+e;function zt(t,e,n){let r;return s(t,it,t=>n(0,r=t)),[r]}class Tt extends K{constructor(t){super(),J(this,t,zt,Ct,c,{})}}function qt(t){let e,n,r,l,o,c,s,u,d;const g=new Tt({}),$=new jt({}),x=new vt({}),b=new yt({});return{c(){e=p("div"),n=p("button"),r=p("span"),r.textContent="work in progress",l=m(),I(g.$$.fragment),o=m(),I($.$$.fragment),c=m(),I(x.$$.fragment),s=m(),I(b.$$.fragment),v(n,"class","digifall svelte-19cn0xs"),y(n,"screen",t[1].length),v(e,"class","game content svelte-19cn0xs"),y(e,"blur",!0===t[0])},m(f,p,m){a(f,e,p),i(e,n),i(n,r),i(n,l),W(g,n,null),i(e,o),W($,e,null),i(e,c),W(x,e,null),i(e,s),W(b,e,null),u=!0,m&&d(),d=h(n,"click",t[2])},p(t,[r]){2&r&&y(n,"screen",t[1].length),1&r&&y(e,"blur",!0===t[0])},i(t){u||(D(g.$$.fragment,t),D($.$$.fragment,t),D(x.$$.fragment,t),D(b.$$.fragment,t),u=!0)},o(t){H(g.$$.fragment,t),H($.$$.fragment,t),H(x.$$.fragment,t),H(b.$$.fragment,t),u=!1},d(t){t&&f(e),Z(g),Z($),Z(x),Z(b),d()}}}function St(t,e,n){let r,l;s(t,ct,t=>n(0,r=t)),s(t,it,t=>n(1,l=t));return[r,l,()=>ct.set(!0)]}class Ft extends K{constructor(t){super(),J(this,t,St,qt,c,{})}}function Lt(e){let n,r,l,o,c;return{c(){n=p("div"),r=p("span"),r.textContent="game over",l=m(),o=p("button"),o.textContent="new game",v(r,"class","big-text"),v(n,"class","game-over content")},m(t,s,u){a(t,n,s),i(n,r),i(n,l),i(n,o),u&&c(),c=h(o,"click",e[0])},p:t,i:t,o:t,d(t){t&&f(n),c()}}}function Bt(t){return[()=>at()]}class Dt extends K{constructor(t){super(),J(this,t,Bt,Lt,c,{})}}function Ht(e){let n,r,o,c,s,u,d;return{c(){n=p("div"),r=p("button"),r.textContent="resume",o=m(),c=p("button"),c.textContent="new game",s=m(),u=p("button"),u.textContent="fullscreen",v(n,"class","menu content")},m(t,f,p){a(t,n,f),i(n,r),i(n,o),i(n,c),i(n,s),i(n,u),p&&l(d),d=[h(r,"click",e[0]),h(c,"click",e[1]),h(u,"click",e[2])]},p:t,i:t,o:t,d(t){t&&f(n),l(d)}}}function It(t){return[()=>ct.set(!1),()=>at(),()=>{const{documentElement:t,fullscreen:e}=document;e?document.exitFullscreen():t.requestFullscreen()}]}class Wt extends K{constructor(t){super(),J(this,t,It,Ht,c,{})}}function Zt(t){let e,n;const r=t[1].default,l=function(t,e,n,r){if(t){const l=u(t,e,n,r);return t[0](l)}}(r,t,t[0],null);return{c(){e=p("div"),l&&l.c(),v(e,"class","overlay svelte-rrniru")},m(t,r){a(t,e,r),l&&l.m(e,null),n=!0},p(t,[e]){l&&l.p&&1&e&&l.p(u(r,t,t[0],null),function(t,e,n,r){if(t[2]&&r){const l=t[2](r(n));if(void 0===e.dirty)return l;if("object"==typeof l){const t=[],n=Math.max(e.dirty.length,l.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|l[r];return t}return e.dirty|l}return e.dirty}(r,t[0],e,null))},i(t){n||(D(l,t),n=!0)},o(t){H(l,t),n=!1},d(t){t&&f(e),l&&l.d(t)}}}function Gt(t,e,n){let{$$slots:r={},$$scope:l}=e;return t.$set=t=>{"$$scope"in t&&n(0,l=t.$$scope)},[l,r]}class Jt extends K{constructor(t){super(),J(this,t,Gt,Zt,c,{})}}function Kt(t){let e;const n=new Jt({props:{$$slots:{default:[Ut]},$$scope:{ctx:t}}});return{c(){I(n.$$.fragment)},m(t,r){W(n,t,r),e=!0},p(t,e){const r={};130&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){e||(D(n.$$.fragment,t),e=!0)},o(t){H(n.$$.fragment,t),e=!1},d(t){Z(n,t)}}}function Qt(t){let e;const n=new Wt({});return{c(){I(n.$$.fragment)},m(t,r){W(n,t,r),e=!0},i(t){e||(D(n.$$.fragment,t),e=!0)},o(t){H(n.$$.fragment,t),e=!1},d(t){Z(n,t)}}}function Rt(t){let e;const n=new Dt({});return{c(){I(n.$$.fragment)},m(t,r){W(n,t,r),e=!0},i(t){e||(D(n.$$.fragment,t),e=!0)},o(t){H(n.$$.fragment,t),e=!1},d(t){Z(n,t)}}}function Ut(t){let e,n,r,l;const o=[Rt,Qt],c=[];function s(t,e){return"gameover"===t[1]?0:1}return e=s(t),n=c[e]=o[e](t),{c(){n.c(),r=$()},m(t,n){c[e].m(t,n),a(t,r,n),l=!0},p(t,l){let u=e;e=s(t),e!==u&&(L(),H(c[u],1,1,()=>{c[u]=null}),B(),n=c[e],n||(n=c[e]=o[e](t),n.c()),D(n,1),n.m(r.parentNode,r))},i(t){l||(D(n),l=!0)},o(t){H(n),l=!1},d(t){c[e].d(t),t&&f(r)}}}function Vt(t){let e,n,r,l,o,c;const s=new Ft({});let u=t[2]&&Kt(t);return{c(){e=p("div"),n=p("span"),r=g(t[1]),l=m(),I(s.$$.fragment),o=m(),u&&u.c(),b(n,"color","white"),b(n,"position","absolute"),v(e,"class","app svelte-1d838t4"),v(e,"style",t[0])},m(t,f){a(t,e,f),i(e,n),i(n,r),i(e,l),W(s,e,null),i(e,o),u&&u.m(e,null),c=!0},p(t,[n]){(!c||2&n)&&x(r,t[1]),t[2]?u?(u.p(t,n),D(u,1)):(u=Kt(t),u.c(),D(u,1),u.m(e,null)):u&&(L(),H(u,1,1,()=>{u=null}),B()),(!c||1&n)&&v(e,"style",t[0])},i(t){c||(D(s.$$.fragment,t),D(u),c=!0)},o(t){H(s.$$.fragment,t),H(u),c=!1},d(t){t&&f(e),Z(s),u&&u.d()}}}function Xt(t,e,n){let r,l;s(t,ot,t=>n(1,r=t)),s(t,ct,t=>n(2,l=t));const o=(t=10)=>`hsl(${Math.floor(360*Math.random())},100%,${t}%)`,c=()=>{const[t,e,n,r]=(t=>{for(let e=t.length-1;e>0;--e){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})([7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);return`\n      background-color: ${o()};\n      background-image:\n        linear-gradient(90deg, ${o()} 50%, transparent 50%),\n        linear-gradient(90deg, ${o()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${o()} 50%),\n        linear-gradient(90deg, transparent 50%, ${o()} 50%);\n      background-position: center;\n      background-size:\n        calc(${t} * var(--pixel)),\n        calc(${e} * var(--pixel)),\n        calc(${n} * var(--pixel)),\n        calc(${r} * var(--pixel));`};let u=c();const i=()=>{const{documentElement:t}=document,{offsetHeight:e,offsetWidth:r}=document.querySelector(".app");e/r>1.5?(t.style.setProperty("--pixel",`${r/128}px`),n(0,u=void 0)):(t.style.setProperty("--pixel",`${e/192}px`),n(0,u=c()))};return j(i),onresize=i,onkeypress=({key:t})=>{"1"===t&&ut.set(10),"0"===t&&ut.set(100)},[u,r,l]}return new class extends K{constructor(t){super(),J(this,t,Xt,Vt,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
