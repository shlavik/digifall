var app=function(){"use strict";function t(){}const e=t=>t;function n(t,e){for(const n in e)t[n]=e[n];return t}function r(t){return t()}function o(){return Object.create(null)}function l(t){t.forEach(r)}function s(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function i(t,e,n){t.$$.on_destroy.push(u(e,n))}function a(t,e,r,o){return t[1]&&o?n(r.ctx.slice(),t[1](o(e))):r.ctx}function d(t,e,n,r,o,l,s){const c=function(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}(e,r,o,l);if(c){const o=a(e,n,r,s);t.p(o,c)}}function f(t,e,n=e){return t.set(n),e}const m=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),p="undefined"!=typeof window;let $=p?()=>window.performance.now():()=>Date.now(),g=p?t=>requestAnimationFrame(t):t;const h=new Set;function y(t){h.forEach(e=>{e.c(t)||(h.delete(e),e.f())}),0!==h.size&&g(y)}function b(t){let e;return 0===h.size&&g(y),{promise:new Promise(n=>{h.add(e={c:t,f:n})}),abort(){h.delete(e)}}}function v(t,e){t.appendChild(e)}function x(t,e,n){t.insertBefore(e,n||null)}function w(t){t.parentNode.removeChild(t)}function k(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function _(t){return document.createElement(t)}function C(t){return document.createTextNode(t)}function A(){return C(" ")}function P(){return C("")}function E(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function T(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function O(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function j(t,e,n){t.classList[n?"add":"remove"](e)}const N=new Set;let M,F=0;function S(t,e,n,r,o,l,s,c=0){const u=16.666/r;let i="{\n";for(let t=0;t<=1;t+=u){const r=e+(n-e)*l(t);i+=100*t+`%{${s(r,1-r)}}\n`}const a=i+`100% {${s(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${c}`,f=t.ownerDocument;N.add(f);const m=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(_("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,m.insertRule(`@keyframes ${d} ${a}`,m.cssRules.length));const $=t.style.animation||"";return t.style.animation=`${$?$+", ":""}${d} ${r}ms linear ${o}ms 1 both`,F+=1,d}function z(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-r.length;o&&(t.style.animation=r.join(", "),F-=o,F||g(()=>{F||(N.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),N.clear())}))}function B(t){M=t}const q=[],D=[],R=[],L=[],W=Promise.resolve();let H=!1;function I(t){R.push(t)}let Z=!1;const G=new Set;function J(){if(!Z){Z=!0;do{for(let t=0;t<q.length;t+=1){const e=q[t];B(e),K(e.$$)}for(q.length=0;D.length;)D.pop()();for(let t=0;t<R.length;t+=1){const e=R[t];G.has(e)||(G.add(e),e())}R.length=0}while(q.length);for(;L.length;)L.pop()();H=!1,Z=!1,G.clear()}}function K(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}let Q;function U(){return Q||(Q=Promise.resolve(),Q.then(()=>{Q=null})),Q}function V(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const X=new Set;let Y;function tt(){Y={r:0,c:[],p:Y}}function et(){Y.r||l(Y.c),Y=Y.p}function nt(t,e){t&&t.i&&(X.delete(t),t.i(e))}function rt(t,e,n,r){if(t&&t.o){if(X.has(t))return;X.add(t),Y.c.push(()=>{X.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const ot={duration:0};function lt(n,r,o){let l,c,u=r(n,o),i=!1,a=0;function d(){l&&z(n,l)}function f(){const{delay:r=0,duration:o=300,easing:s=e,tick:f=t,css:m}=u||ot;m&&(l=S(n,0,1,o,r,s,m,a++)),f(0,1);const p=$()+r,g=p+o;c&&c.abort(),i=!0,I(()=>V(n,!0,"start")),c=b(t=>{if(i){if(t>=g)return f(1,0),V(n,!0,"end"),d(),i=!1;if(t>=p){const e=s((t-p)/o);f(e,1-e)}}return i})}let m=!1;return{start(){m||(z(n),s(u)?(u=u(),U().then(f)):f())},invalidate(){m=!1},end(){i&&(d(),i=!1)}}}function st(n,r,o){let c,u=r(n,o),i=!0;const a=Y;function d(){const{delay:r=0,duration:o=300,easing:s=e,tick:d=t,css:f}=u||ot;f&&(c=S(n,1,0,o,r,s,f));const m=$()+r,p=m+o;I(()=>V(n,!1,"start")),b(t=>{if(i){if(t>=p)return d(0,1),V(n,!1,"end"),--a.r||l(a.c),!1;if(t>=m){const e=s((t-m)/o);d(1-e,e)}}return i})}return a.r+=1,s(u)?U().then(()=>{u=u(),d()}):d(),{end(t){t&&u.tick&&u.tick(1,0),i&&(c&&z(n,c),i=!1)}}}function ct(n,r,o,c){let u=r(n,o),i=c?0:1,a=null,d=null,f=null;function m(){f&&z(n,f)}function p(t,e){const n=t.b-i;return e*=Math.abs(n),{a:i,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function g(r){const{delay:o=0,duration:s=300,easing:c=e,tick:g=t,css:h}=u||ot,y={start:$()+o,b:r};r||(y.group=Y,Y.r+=1),a?d=y:(h&&(m(),f=S(n,i,r,s,o,c,h)),r&&g(0,1),a=p(y,s),I(()=>V(n,r,"start")),b(t=>{if(d&&t>d.start&&(a=p(d,s),d=null,V(n,a.b,"start"),h&&(m(),f=S(n,i,a.b,a.duration,0,c,u.css))),a)if(t>=a.end)g(i=a.b,1-i),V(n,a.b,"end"),d||(a.b?m():--a.group.r||l(a.group.c)),a=null;else if(t>=a.start){const e=t-a.start;i=a.a+a.d*c(e/a.duration),g(i,1-i)}return!(!a&&!d)}))}return{run(t){s(u)?U().then(()=>{u=u(),g(t)}):g(t)},end(){m(),a=d=null}}}function ut(t){t&&t.c()}function it(t,e,n){const{fragment:o,on_mount:c,on_destroy:u,after_update:i}=t.$$;o&&o.m(e,n),I(()=>{const e=c.map(r).filter(s);u?u.push(...e):l(e),t.$$.on_mount=[]}),i.forEach(I)}function at(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function dt(t,e){-1===t.$$.dirty[0]&&(q.push(t),H||(H=!0,W.then(J)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ft(e,n,r,s,c,u,i=[-1]){const a=M;B(e);const d=n.props||{},f=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:c,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:o(),dirty:i,skip_bound:!1};let m=!1;if(f.ctx=r?r(e,d,(t,n,...r)=>{const o=r.length?r[0]:n;return f.ctx&&c(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),m&&dt(e,t)),n}):[],f.update(),m=!0,l(f.before_update),f.fragment=!!s&&s(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(w)}else f.fragment&&f.fragment.c();n.intro&&nt(e.$$.fragment),it(e,n.target,n.anchor),J()}B(a)}class mt{$destroy(){at(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const pt=[];function $t(e,n=t){let r;const o=[];function l(t){if(c(e,t)&&(e=t,r)){const t=!pt.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),pt.push(n,e)}if(t){for(let t=0;t<pt.length;t+=2)pt[t][0](pt[t+1]);pt.length=0}}}return{set:l,update:function(t){l(t(e))},subscribe:function(s,c=t){const u=[s,c];return o.push(u),1===o.length&&(r=n(l)||t),s(e),()=>{const t=o.indexOf(u);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}const gt={buffer:0,value:100},ht=[],yt=[],bt={buffer:0,value:0},vt=$t([]),xt=$t(gt),wt=$t(ht),kt=$t(yt),_t=$t({delay:0,name:"",shadow:!0,timestamp:Date.now()}),Ct=$t(!0),At=$t("idle"),Pt=$t(undefined),Et=$t("white"),Tt=$t(bt),Ot=function(e,n,r){const o=!Array.isArray(e),c=o?[e]:e,i=n.length<2;return{subscribe:$t(r,e=>{let r=!1;const a=[];let d=0,f=t;const m=()=>{if(d)return;f();const r=n(o?a[0]:a,e);i?e(r):f=s(r)?r:t},p=c.map((t,e)=>u(t,t=>{a[e]=t,d&=~(1<<e),r&&m()},()=>{d|=1<<e}));return r=!0,m(),function(){l(p),f()}}).subscribe}}(_t,({name:t,timestamp:e})=>`${t}_${e}`);function jt(){xt.set(gt),wt.set(ht),kt.set(yt),_t.update(t=>({...t,timestamp:Date.now()})),Ct.set(!1),At.set("idle"),Pt.set(undefined),Et.set("white"),Tt.set(bt)}function Nt(t=!0){const{style:e}=document.documentElement;e.setProperty("--shadow-0",t?"0 0 1px black":"none"),e.setProperty("--shadow-1",t?"0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white":"none"),e.setProperty("--shadow-2",t?"0 1rem 1rem var(--color-black-04),  0 -1px 0 white":"none"),e.setProperty("--shadow-21",t?"0 0 21rem 1rem black":"0 0 0 transparent"),e.setProperty("--shadow-inset-1",t?"inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white":"none"),e.setProperty("--shadow-inset-2",t?"inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white":"none")}function Mt(e){let n,r,o,l,s,c,u,i,a;return{c(){n=_("div"),r=_("div"),o=_("div"),l=C(e[4]),c=A(),u=_("div"),i=C(e[5]),T(o,"class",s="current color-"+e[4]),T(u,"class",a="next color-"+e[5]),T(r,"class","value"),T(n,"class","card"),T(n,"style",e[6]),T(n,"data-index",e[0]),j(n,"clickable",e[1]),j(n,"plused",e[3]),j(n,"matched",e[2])},m(t,e){x(t,n,e),v(n,r),v(r,o),v(o,l),v(r,c),v(r,u),v(u,i)},p(t,[e]){16&e&&O(l,t[4]),16&e&&s!==(s="current color-"+t[4])&&T(o,"class",s),32&e&&O(i,t[5]),32&e&&a!==(a="next color-"+t[5])&&T(u,"class",a),64&e&&T(n,"style",t[6]),1&e&&T(n,"data-index",t[0]),2&e&&j(n,"clickable",t[1]),8&e&&j(n,"plused",t[3]),4&e&&j(n,"matched",t[2])},i:t,o:t,d(t){t&&w(n)}}}function Ft(t,e,n){let r,o,{index:l}=e,{clickable:s}=e,{duration:c}=e,{fallPhase:u}=e,{matched:i}=e,{plused:a}=e,{value:d}=e,{x:f=0}=e,{y:m=0}=e;return t.$$set=t=>{"index"in t&&n(0,l=t.index),"clickable"in t&&n(1,s=t.clickable),"duration"in t&&n(7,c=t.duration),"fallPhase"in t&&n(8,u=t.fallPhase),"matched"in t&&n(2,i=t.matched),"plused"in t&&n(3,a=t.plused),"value"in t&&n(4,d=t.value),"x"in t&&n(9,f=t.x),"y"in t&&n(10,m=t.y)},t.$$.update=()=>{16&t.$$.dirty&&n(5,r=d<9?d+1:0),1920&t.$$.dirty&&n(6,o=`\n    bottom: ${21*m}rem;\n    left: ${21*f}rem;\n    transition-duration: ${u?c:0}ms;\n  `)},[l,s,i,a,d,r,o,c,u,f,m]}class St extends mt{constructor(t){super(),ft(this,t,Ft,Mt,c,{index:0,clickable:1,duration:7,fallPhase:8,matched:2,plused:3,value:4,x:9,y:10})}}function zt(t,e,n){const r=t.slice();return r[8]=e[n],r[10]=n,r}function Bt(t){let e,r;const o=[{clickable:"idle"===t[0]&&!t[1]},{fallPhase:"fall"===t[0]},{matched:t[3].includes(t[10])},{plused:t[1]===t[10]},t[8],{index:t[10]}];let l={};for(let t=0;t<o.length;t+=1)l=n(l,o[t]);return e=new St({props:l}),{c(){ut(e.$$.fragment)},m(t,n){it(e,t,n),r=!0},p(t,n){const r=15&n?function(t,e){const n={},r={},o={$$scope:1};let l=t.length;for(;l--;){const s=t[l],c=e[l];if(c){for(const t in s)t in c||(r[t]=1);for(const t in c)o[t]||(n[t]=c[t],o[t]=1);t[l]=c}else for(const t in s)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(o,[3&n&&{clickable:"idle"===t[0]&&!t[1]},1&n&&{fallPhase:"fall"===t[0]},8&n&&{matched:t[3].includes(t[10])},2&n&&{plused:t[1]===t[10]},4&n&&(l=t[8],"object"==typeof l&&null!==l?l:{}),o[5]]):{};var l;e.$set(r)},i(t){r||(nt(e.$$.fragment,t),r=!0)},o(t){rt(e.$$.fragment,t),r=!1},d(t){at(e,t)}}}function qt(t){let e,n,r,o,l=t[2],s=[];for(let e=0;e<l.length;e+=1)s[e]=Bt(zt(t,l,e));const c=t=>rt(s[t],1,1,()=>{s[t]=null});return{c(){e=_("div");for(let t=0;t<s.length;t+=1)s[t].c();T(e,"class","board"),j(e,"overflow-hidden","idle"!==t[0])},m(l,c){x(l,e,c);for(let t=0;t<s.length;t+=1)s[t].m(e,null);n=!0,r||(o=E(e,"click",t[4]),r=!0)},p(t,[n]){if(15&n){let r;for(l=t[2],r=0;r<l.length;r+=1){const o=zt(t,l,r);s[r]?(s[r].p(o,n),nt(s[r],1)):(s[r]=Bt(o),s[r].c(),nt(s[r],1),s[r].m(e,null))}for(tt(),r=l.length;r<s.length;r+=1)c(r);et()}1&n&&j(e,"overflow-hidden","idle"!==t[0])},i(t){if(!n){for(let t=0;t<l.length;t+=1)nt(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)rt(s[t]);n=!1},d(t){t&&w(e),k(s,t),r=!1,o()}}}function Dt(t,e,n){let r,o,l,s,c,u;i(t,At,t=>n(0,r=t)),i(t,Pt,t=>n(1,o=t)),i(t,xt,t=>n(5,l=t)),i(t,_t,t=>n(6,s=t)),i(t,vt,t=>n(2,c=t)),i(t,kt,t=>n(3,u=t));const a=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?a(e):void 0;return[r,o,c,u,({target:t})=>{"idle"!==r||o||(f(Pt,o=Number(a(t))),Number.isNaN(o)||(f(xt,l={...l,buffer:-10}),setTimeout(()=>f(At,r="plus"),s.delay||400)))}]}class Rt extends mt{constructor(t){super(),ft(this,t,Dt,qt,c,{})}}function Lt(e){let n,r,o,l,s,c,u,i,a=e[0].value+"",d=e[0].value+"";return{c(){n=_("div"),r=_("div"),o=_("span"),l=C(a),s=A(),c=_("div"),u=_("span"),i=C(d),T(o,"class","left-value"),T(o,"style",e[2]),T(r,"class","left-bar"),T(r,"style",e[1]),T(u,"class","right-value"),T(u,"style",e[4]),T(c,"class","right-bar"),T(c,"style",e[3]),T(n,"class","energy")},m(t,e){x(t,n,e),v(n,r),v(r,o),v(o,l),v(n,s),v(n,c),v(c,u),v(u,i)},p(t,[e]){1&e&&a!==(a=t[0].value+"")&&O(l,a),4&e&&T(o,"style",t[2]),2&e&&T(r,"style",t[1]),1&e&&d!==(d=t[0].value+"")&&O(i,d),16&e&&T(u,"style",t[4]),8&e&&T(c,"style",t[3])},i:t,o:t,d(t){t&&w(n)}}}function Wt(t,e,n){let r,o,l,s,c,u,a,d;return i(t,xt,t=>n(0,r=t)),i(t,Et,t=>n(7,o=t)),t.$$.update=()=>{1&t.$$.dirty&&n(5,l=r.value),32&t.$$.dirty&&n(6,s=l>100),96&t.$$.dirty&&n(1,c=`flex: ${(s?200-l:l)/100}; z-index: ${s?0:1}`),64&t.$$.dirty&&n(2,u="position: "+(s?"absolute":"relative")),224&t.$$.dirty&&n(3,a=`background-color: ${s?o:"var(--color-dark)"}; flex: ${s?(l-100)/100:0}; z-index: ${s?1:0}`),96&t.$$.dirty&&n(4,d=`left: ${s?`calc(${l>119?0:(l-120)/100} * 128rem)`:0}; position: ${s?"relative":"absolute"}`)},[r,c,u,a,d]}class Ht extends mt{constructor(t){super(),ft(this,t,Wt,Lt,c,{})}}function It(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}function Zt(t){const e=t-1;return e*e*e+1}function Gt(t,{delay:e=0,duration:n=400,easing:r=It,amount:o=5,opacity:l=0}){const s=getComputedStyle(t),c=+s.opacity,u="none"===s.filter?"":s.filter,i=c*(1-l);return{delay:e,duration:n,easing:r,css:(t,e)=>`opacity: ${c-i*e}; filter: ${u} blur(${e*o}px);`}}function Jt(t,{delay:n=0,duration:r=400,easing:o=e}){const l=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:o,css:t=>"opacity: "+t*l}}function Kt(t,{delay:e=0,duration:n=400,easing:r=Zt,x:o=0,y:l=0,opacity:s=0}){const c=getComputedStyle(t),u=+c.opacity,i="none"===c.transform?"":c.transform,a=u*(1-s);return{delay:e,duration:n,easing:r,css:(t,e)=>`\n\t\t\ttransform: ${i} translate(${(1-t)*o}px, ${(1-t)*l}px);\n\t\t\topacity: ${u-a*e}`}}function Qt(t,{delay:e=0,duration:n=400,easing:r=Zt}){const o=getComputedStyle(t),l=+o.opacity,s=parseFloat(o.height),c=parseFloat(o.paddingTop),u=parseFloat(o.paddingBottom),i=parseFloat(o.marginTop),a=parseFloat(o.marginBottom),d=parseFloat(o.borderTopWidth),f=parseFloat(o.borderBottomWidth);return{delay:e,duration:n,easing:r,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*l};height: ${t*s}px;padding-top: ${t*c}px;padding-bottom: ${t*u}px;margin-top: ${t*i}px;margin-bottom: ${t*a}px;border-top-width: ${t*d}px;border-bottom-width: ${t*f}px;`}}function Ut(t,e,n){const r=t.slice();return r[11]=e[n][0],r[12]=e[n][1],r[14]=n,r}function Vt(t,e,n){const r=t.slice();return r[6]=e[n].extra,r[7]=e[n].sum,r[8]=function(t,e){const n={};for(const r in t)m(t,r)&&-1===e.indexOf(r)&&(n[r]=t[r]);return n}(e[n],["extra","sum"]),r[10]=n,r}function Xt(t){let e,n,r,o="score"!==t[2]&&Yt(t),l=("total"===t[2]||"score"===t[2])&&le(t);return{c(){e=_("ol"),o&&o.c(),n=A(),l&&l.c(),T(e,"class","log")},m(t,s){x(t,e,s),o&&o.m(e,null),v(e,n),l&&l.m(e,null),r=!0},p(t,r){"score"!==t[2]?o?(o.p(t,r),4&r&&nt(o,1)):(o=Yt(t),o.c(),nt(o,1),o.m(e,n)):o&&(tt(),rt(o,1,1,()=>{o=null}),et()),"total"===t[2]||"score"===t[2]?l?(l.p(t,r),4&r&&nt(l,1)):(l=le(t),l.c(),nt(l,1),l.m(e,null)):l&&(tt(),rt(l,1,1,()=>{l=null}),et())},i(t){r||(nt(o),nt(l),r=!0)},o(t){rt(o),rt(l),r=!1},d(t){t&&w(e),o&&o.d(),l&&l.d()}}}function Yt(t){let e,n,r=t[1],o=[];for(let e=0;e<r.length;e+=1)o[e]=oe(Vt(t,r,e));const l=t=>rt(o[t],1,1,()=>{o[t]=null});return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=P()},m(t,r){for(let e=0;e<o.length;e+=1)o[e].m(t,r);x(t,e,r),n=!0},p(t,n){if(18&n){let s;for(r=t[1],s=0;s<r.length;s+=1){const l=Vt(t,r,s);o[s]?(o[s].p(l,n),nt(o[s],1)):(o[s]=oe(l),o[s].c(),nt(o[s],1),o[s].m(e.parentNode,e))}for(tt(),s=r.length;s<o.length;s+=1)l(s);et()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)nt(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)rt(o[t]);n=!1},d(t){k(o,t),t&&w(e)}}}function te(t){let e;return{c(){e=_("span"),e.textContent="+",T(e,"class","plus")},m(t,n){x(t,e,n)},d(t){t&&w(e)}}}function ee(t){let e,n,r,o,l,s=t[12]+"",c=t[14]<Object.keys(t[8]).length-1,u=c&&te();return{c(){e=_("span"),n=C(s),o=A(),u&&u.c(),l=P(),T(e,"class",r="value color-"+t[11])},m(t,r){x(t,e,r),v(e,n),x(t,o,r),u&&u.m(t,r),x(t,l,r)},p(t,o){2&o&&s!==(s=t[12]+"")&&O(n,s),2&o&&r!==(r="value color-"+t[11])&&T(e,"class",r),2&o&&(c=t[14]<Object.keys(t[8]).length-1),c?u||(u=te(),u.c(),u.m(l.parentNode,l)):u&&(u.d(1),u=null)},d(t){t&&w(e),t&&w(o),u&&u.d(t),t&&w(l)}}}function ne(t){let e,n,r=(t[10]+1)*t[7]+"";return{c(){e=_("span"),n=C(r),T(e,"class","sum")},m(t,r){x(t,e,r),v(e,n)},p(t,e){2&e&&r!==(r=(t[10]+1)*t[7]+"")&&O(n,r)},d(t){t&&w(e)}}}function re(t){let e,n,r,o,l,s,c=t[6]+"",u=(t[10]+1)*t[6]+"";return{c(){e=_("span"),n=C(c),o=A(),l=_("span"),s=C(u),T(e,"class","extra"),T(e,"style",r="color: "+t[4]),T(l,"class","sum")},m(t,r){x(t,e,r),v(e,n),x(t,o,r),x(t,l,r),v(l,s)},p(t,o){2&o&&c!==(c=t[6]+"")&&O(n,c),16&o&&r!==(r="color: "+t[4])&&T(e,"style",r),2&o&&u!==(u=(t[10]+1)*t[6]+"")&&O(s,u)},d(t){t&&w(e),t&&w(o),t&&w(l)}}}function oe(t){let e,n,r,o,l,s,c=Object.entries(t[8]),u=[];for(let e=0;e<c.length;e+=1)u[e]=ee(Ut(t,c,e));function i(t,e){return void 0!==t[6]?re:ne}let a=i(t),d=a(t);return{c(){e=_("li");for(let t=0;t<u.length;t+=1)u[t].c();n=A(),d.c(),r=A(),T(e,"class","combo")},m(t,o){x(t,e,o);for(let t=0;t<u.length;t+=1)u[t].m(e,null);v(e,n),d.m(e,null),v(e,r),s=!0},p(t,o){if(2&o){let r;for(c=Object.entries(t[8]),r=0;r<c.length;r+=1){const l=Ut(t,c,r);u[r]?u[r].p(l,o):(u[r]=ee(l),u[r].c(),u[r].m(e,n))}for(;r<u.length;r+=1)u[r].d(1);u.length=c.length}a===(a=i(t))&&d?d.p(t,o):(d.d(1),d=a(t),d&&(d.c(),d.m(e,r)))},i(n){s||(I(()=>{l&&l.end(1),o||(o=lt(e,Qt,{duration:t[3].delay||100})),o.start()}),s=!0)},o(n){o&&o.invalidate(),l=st(e,Jt,{duration:t[3].delay||200}),s=!1},d(t){t&&w(e),k(u,t),d.d(),t&&l&&l.end()}}}function le(t){let e,n,r,o,l,s,c,u=`${"score"===t[2]&&t[5].buffer>0?"+":""}${t[5].buffer}`,i="score"!==t[2]&&se(t);return{c(){e=_("li"),i&&i.c(),n=A(),r=_("span"),o=C(u),T(r,"class","sum"),j(e,"collapse",t[0])},m(t,l){x(t,e,l),i&&i.m(e,null),v(e,n),v(e,r),v(r,o),c=!0},p(t,r){"score"!==t[2]?i?(i.p(t,r),4&r&&nt(i,1)):(i=se(t),i.c(),nt(i,1),i.m(e,n)):i&&(tt(),rt(i,1,1,()=>{i=null}),et()),(!c||36&r)&&u!==(u=`${"score"===t[2]&&t[5].buffer>0?"+":""}${t[5].buffer}`)&&O(o,u),1&r&&j(e,"collapse",t[0])},i(n){c||(nt(i),I(()=>{s&&s.end(1),l||(l=lt(e,Qt,{duration:t[3].delay||t[0]?0:100})),l.start()}),c=!0)},o(n){rt(i),l&&l.invalidate(),s=st(e,Jt,{duration:t[3].delay||200}),c=!1},d(t){t&&w(e),i&&i.d(),t&&s&&s.end()}}}function se(t){let e,n,r,o,l=t[0]?"":"total:";return{c(){e=_("span"),n=C(l)},m(t,r){x(t,e,r),v(e,n),o=!0},p(t,e){(!o||1&e)&&l!==(l=t[0]?"":"total:")&&O(n,l)},i(t){o||(r&&r.end(1),o=!0)},o(n){r=st(e,Jt,{duration:t[3].delay||200}),o=!1},d(t){t&&w(e),t&&r&&r.end()}}}function ce(t){let e,n,r=t[1].length>0&&Xt(t);return{c(){r&&r.c(),e=P()},m(t,o){r&&r.m(t,o),x(t,e,o),n=!0},p(t,[n]){t[1].length>0?r?(r.p(t,n),2&n&&nt(r,1)):(r=Xt(t),r.c(),nt(r,1),r.m(e.parentNode,e)):r&&(tt(),rt(r,1,1,()=>{r=null}),et())},i(t){n||(nt(r),n=!0)},o(t){rt(r),n=!1},d(t){r&&r.d(t),t&&w(e)}}}function ue(t,e,n){let r,o,l,s,c,u;return i(t,wt,t=>n(1,r=t)),i(t,At,t=>n(2,o=t)),i(t,_t,t=>n(3,l=t)),i(t,Et,t=>n(4,s=t)),i(t,Tt,t=>n(5,c=t)),t.$$.update=()=>{2&t.$$.dirty&&n(0,u=1===r.length)},[u,r,o,l,s,c]}class ie extends mt{constructor(t){super(),ft(this,t,ue,ce,c,{})}}function ae(e){let n,r,o=e[0].value+"";return{c(){n=_("span"),r=C(o),T(n,"class","score")},m(t,e){x(t,n,e),v(n,r)},p(t,[e]){1&e&&o!==(o=t[0].value+"")&&O(r,o)},i:t,o:t,d(t){t&&w(n)}}}function de(t,e,n){let r;return i(t,Tt,t=>n(0,r=t)),[r]}class fe extends mt{constructor(t){super(),ft(this,t,de,ae,c,{})}}function me(t){let e,n,r,o,l,s,c,u,i,a,d,f,m,p,$,g,h,y,b;return c=new ie({}),a=new fe({}),m=new Rt({}),g=new Ht({}),{c(){e=_("div"),n=_("div"),r=_("div"),o=_("button"),l=_("span"),l.textContent="work in progress",s=A(),ut(c.$$.fragment),u=A(),i=_("div"),ut(a.$$.fragment),d=A(),f=_("div"),ut(m.$$.fragment),p=A(),$=_("div"),ut(g.$$.fragment),T(o,"class","digifall"),j(o,"screen",t[1].length>0),T(r,"class","section-1"),T(i,"class","section-2"),T(f,"class","section-3"),T($,"class","section-4"),T(n,"class","content"),T(e,"class","game"),T(e,"style",t[2]),j(e,"blur",!0===t[0])},m(w,k){x(w,e,k),v(e,n),v(n,r),v(r,o),v(o,l),v(o,s),it(c,o,null),v(n,u),v(n,i),it(a,i,null),v(n,d),v(n,f),it(m,f,null),v(n,p),v(n,$),it(g,$,null),h=!0,y||(b=E(o,"click",t[3]),y=!0)},p(t,[n]){2&n&&j(o,"screen",t[1].length>0),1&n&&j(e,"blur",!0===t[0])},i(t){h||(nt(c.$$.fragment,t),nt(a.$$.fragment,t),nt(m.$$.fragment,t),nt(g.$$.fragment,t),h=!0)},o(t){rt(c.$$.fragment,t),rt(a.$$.fragment,t),rt(m.$$.fragment,t),rt(g.$$.fragment,t),h=!1},d(t){t&&w(e),at(c),at(a),at(m),at(g),y=!1,b()}}}function pe(t,e,n){let r,o,l;i(t,Ot,t=>n(5,r=t)),i(t,Ct,t=>n(0,o=t)),i(t,wt,t=>n(1,l=t));let s=Math.round(360*Math.random());const c=(t=7)=>(s+=30+Math.round(42*Math.random()),`hsl(${s},100%,${t}%)`);let u=(()=>{const[t,e,n,r]=(t=>{for(let e=t.length-1;e>0;--e){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})([7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);return`\n      background-color: ${c()};\n      background-image:\n        linear-gradient(90deg, ${c()} 50%, transparent 50%),\n        linear-gradient(90deg, ${c()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${c()} 50%),\n        linear-gradient(90deg, transparent 50%, ${c()} 50%);\n      background-size: ${t}rem, ${e}rem, ${n}rem, ${r}rem;`})();return t.$$.update=()=>{32&t.$$.dirty&&console.log(r)},[o,l,u,()=>f(Ct,o=!0)]}class $e extends mt{constructor(t){super(),ft(this,t,pe,me,c,{})}}function ge(t,e,n){const r=t.slice();return r[4]=e[n],r[6]=n,r}function he(e){let n,r;return{c(){n=_("span"),n.textContent="game over",T(n,"class","text-big")},m(t,e){x(t,n,e)},i(t){r||I(()=>{r=lt(n,Gt,{delay:600}),r.start()})},o:t,d(t){t&&w(n)}}}function ye(e){let n,r,o,l,s;return{c(){n=_("div"),r=_("button"),r.textContent="new game",T(n,"class","col")},m(t,o){x(t,n,o),v(n,r),l||(s=E(r,"click",e[3]),l=!0)},p:t,i(t){o||I(()=>{o=lt(n,Gt,{delay:600}),o.start()})},o:t,d(t){t&&w(n),l=!1,s()}}}function be(e){let n,r=[];for(let t=0;t<"ut of energy".length;t+=1)r[t]=ve(ge(e,"ut of energy",t));return{c(){n=_("span");for(let t=0;t<r.length;t+=1)r[t].c();T(n,"class","energy-out")},m(t,e){x(t,n,e);for(let t=0;t<r.length;t+=1)r[t].m(n,null)},i(t){for(let t=0;t<"ut of energy".length;t+=1)nt(r[t])},o:t,d(t){t&&w(n),k(r,t)}}}function ve(e){let n,r,o,l;return{c(){n=_("span"),r=C(e[4]),o=A(),T(n,"class","letter")},m(t,e){x(t,n,e),v(n,r),v(n,o)},p:t,i(t){l||I(()=>{l=lt(n,Kt,{delay:50*e[6],duration:200,y:100}),l.start()})},o:t,d(t){t&&w(n)}}}function xe(t){let e,n,r,o,l,s,c,u,i,a,d,f,m,p,$=t[2].value+"",g=t[0]&&he(),h=t[0]&&ye(t);d=new Ht({});let y=0===t[1].value&&be(t);return{c(){e=_("div"),n=_("div"),g&&g.c(),r=A(),o=_("div"),l=_("span"),s=C($),c=A(),u=_("div"),h&&h.c(),i=A(),a=_("div"),ut(d.$$.fragment),f=A(),y&&y.c(),T(n,"class","section-1"),T(l,"class","score"),T(o,"class","section-2"),T(u,"class","section-3"),T(a,"class","section-4"),T(e,"class","game-over content")},m(t,m){x(t,e,m),v(e,n),g&&g.m(n,null),v(e,r),v(e,o),v(o,l),v(l,s),v(e,c),v(e,u),h&&h.m(u,null),v(e,i),v(e,a),it(d,a,null),v(a,f),y&&y.m(a,null),p=!0},p(t,[e]){t[0]?g?1&e&&nt(g,1):(g=he(),g.c(),nt(g,1),g.m(n,null)):g&&(g.d(1),g=null),(!p||4&e)&&$!==($=t[2].value+"")&&O(s,$),t[0]?h?(h.p(t,e),1&e&&nt(h,1)):(h=ye(t),h.c(),nt(h,1),h.m(u,null)):h&&(h.d(1),h=null),0===t[1].value?y?2&e&&nt(y,1):(y=be(t),y.c(),nt(y,1),y.m(a,null)):y&&(y.d(1),y=null)},i(t){p||(nt(g),nt(h),nt(d.$$.fragment,t),nt(y),m||I(()=>{m=lt(e,Gt,{}),m.start()}),p=!0)},o(t){rt(d.$$.fragment,t),p=!1},d(t){t&&w(e),g&&g.d(),h&&h.d(),at(d),y&&y.d()}}}function we(t,e,n){let r,o;i(t,xt,t=>n(1,r=t)),i(t,Tt,t=>n(2,o=t));let l;return t.$$.update=()=>{2&t.$$.dirty&&n(0,l=0===r.buffer&&0===r.value)},[l,r,o,()=>jt()]}class ke extends mt{constructor(t){super(),ft(this,t,we,xe,c,{})}}function _e(e){let n,r;return{c(){n=_("span"),n.textContent="work in progress"},m(t,e){x(t,n,e)},i(t){r||I(()=>{r=lt(n,Gt,{}),r.start()})},o:t,d(t){t&&w(n)}}}function Ce(e){let n,r;return{c(){n=_("span"),n.textContent="start a new game?"},m(t,e){x(t,n,e)},i(t){r||I(()=>{r=lt(n,Gt,{}),r.start()})},o:t,d(t){t&&w(n)}}}function Ae(e){let n,r,o,s,c,u,i,a,d,f,m;return{c(){n=_("div"),r=_("button"),r.textContent="resume",o=A(),s=_("button"),s.textContent="new game",c=A(),u=_("button"),u.textContent="shadow",i=A(),a=_("button"),a.textContent="fullscreen",T(n,"class","col")},m(t,l){x(t,n,l),v(n,r),v(n,o),v(n,s),v(n,c),v(n,u),v(n,i),v(n,a),f||(m=[E(r,"click",e[2]),E(s,"click",e[3]),E(u,"click",e[6]),E(a,"click",e[7])],f=!0)},p:t,i(t){d||I(()=>{d=lt(n,Gt,{}),d.start()})},o:t,d(t){t&&w(n),f=!1,l(m)}}}function Pe(e){let n,r,o,s,c,u,i;return{c(){n=_("div"),r=_("button"),r.textContent="yes",o=A(),s=_("button"),s.textContent="no",T(n,"class","row")},m(t,l){x(t,n,l),v(n,r),v(n,o),v(n,s),u||(i=[E(r,"click",e[4]),E(s,"click",e[5])],u=!0)},p:t,i(t){c||I(()=>{c=lt(n,Gt,{}),c.start()})},o:t,d(t){t&&w(n),u=!1,l(i)}}}function Ee(e){let n,r,o,l,s,c,u,i,a,d,f,m=e[1].value+"";function p(t,e){return t[0]?Ce:_e}let $=p(e),g=$(e);function h(t,e){return t[0]?Pe:Ae}let y=h(e),b=y(e);return{c(){n=_("div"),r=_("div"),g.c(),o=A(),l=_("div"),s=_("span"),c=C(m),u=A(),i=_("div"),b.c(),a=A(),d=_("div"),T(r,"class","section-1"),T(s,"class","score"),T(l,"class","section-2"),T(i,"class","section-3"),T(d,"class","section-4"),T(n,"class","menu content")},m(t,e){x(t,n,e),v(n,r),g.m(r,null),v(n,o),v(n,l),v(l,s),v(s,c),v(n,u),v(n,i),b.m(i,null),v(n,a),v(n,d)},p(t,[e]){$!==($=p(t))&&(g.d(1),g=$(t),g&&(g.c(),nt(g,1),g.m(r,null))),2&e&&m!==(m=t[1].value+"")&&O(c,m),y===(y=h(t))&&b?b.p(t,e):(b.d(1),b=y(t),b&&(b.c(),nt(b,1),b.m(i,null)))},i(t){nt(g),nt(b),f||I(()=>{f=lt(n,Gt,{}),f.start()})},o:t,d(t){t&&w(n),g.d(),b.d()}}}function Te(t,e,n){let r,o,l;i(t,Ct,t=>n(8,r=t)),i(t,_t,t=>n(9,o=t)),i(t,Tt,t=>n(1,l=t));let s=!1;return[s,l,()=>f(Ct,r=!1),()=>n(0,s=!0),()=>jt(),()=>n(0,s=!1),()=>{const{shadow:t}=o;Nt(!t),f(_t,o={...o,shadow:!t})},()=>{const{documentElement:t,fullscreen:e}=document;e?document.exitFullscreen():t.requestFullscreen()}]}class Oe extends mt{constructor(t){super(),ft(this,t,Te,Ee,c,{})}}function je(t){let e,n,r;const o=t[2].default,l=function(t,e,n,r){if(t){const o=a(t,e,n,r);return t[0](o)}}(o,t,t[1],null);return{c(){e=_("div"),l&&l.c(),T(e,"class","overlay")},m(t,n){x(t,e,n),l&&l.m(e,null),r=!0},p(t,[e]){l&&l.p&&2&e&&d(l,o,t,t[1],e,null,null)},i(o){r||(nt(l,o),I(()=>{n||(n=ct(e,Jt,{duration:t[0].delay||200},!0)),n.run(1)}),r=!0)},o(o){rt(l,o),n||(n=ct(e,Jt,{duration:t[0].delay||200},!1)),n.run(0),r=!1},d(t){t&&w(e),l&&l.d(t),t&&n&&n.end()}}}function Ne(t,e,n){let r;i(t,_t,t=>n(0,r=t));let{$$slots:o={},$$scope:l}=e;return t.$$set=t=>{"$$scope"in t&&n(1,l=t.$$scope)},[r,l,o]}class Me extends mt{constructor(t){super(),ft(this,t,Ne,je,c,{})}}function Fe(t){let e,n;return e=new Me({props:{$$slots:{default:[Be]},$$scope:{ctx:t}}}),{c(){ut(e.$$.fragment)},m(t,r){it(e,t,r),n=!0},p(t,n){const r={};18&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(nt(e.$$.fragment,t),n=!0)},o(t){rt(e.$$.fragment,t),n=!1},d(t){at(e,t)}}}function Se(t){let e,n;return e=new Oe({}),{c(){ut(e.$$.fragment)},m(t,r){it(e,t,r),n=!0},i(t){n||(nt(e.$$.fragment,t),n=!0)},o(t){rt(e.$$.fragment,t),n=!1},d(t){at(e,t)}}}function ze(t){let e,n;return e=new ke({}),{c(){ut(e.$$.fragment)},m(t,r){it(e,t,r),n=!0},i(t){n||(nt(e.$$.fragment,t),n=!0)},o(t){rt(e.$$.fragment,t),n=!1},d(t){at(e,t)}}}function Be(t){let e,n,r,o;const l=[ze,Se],s=[];function c(t,e){return"gameover"===t[1]?0:1}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),r=P()},m(t,n){s[e].m(t,n),x(t,r,n),o=!0},p(t,o){let u=e;e=c(t),e!==u&&(tt(),rt(s[u],1,1,()=>{s[u]=null}),et(),n=s[e],n||(n=s[e]=l[e](t),n.c()),nt(n,1),n.m(r.parentNode,r))},i(t){o||(nt(n),o=!0)},o(t){rt(n),o=!1},d(t){s[e].d(t),t&&w(r)}}}function qe(t){let e,n,r,o;n=new $e({});let l=t[0]&&Fe(t);return{c(){e=_("div"),ut(n.$$.fragment),r=A(),l&&l.c(),T(e,"class","app")},m(t,s){x(t,e,s),it(n,e,null),v(e,r),l&&l.m(e,null),o=!0},p(t,[n]){t[0]?l?(l.p(t,n),1&n&&nt(l,1)):(l=Fe(t),l.c(),nt(l,1),l.m(e,null)):l&&(tt(),rt(l,1,1,()=>{l=null}),et())},i(t){o||(nt(n.$$.fragment,t),nt(l),o=!0)},o(t){rt(n.$$.fragment,t),rt(l),o=!1},d(t){t&&w(e),at(n),l&&l.d()}}}function De(t,e,n){let r,o,l;i(t,xt,t=>n(2,r=t)),i(t,Ct,t=>n(0,o=t)),i(t,At,t=>n(1,l=t)),Nt();const s=()=>{const{style:t,offsetHeight:e,offsetWidth:n}=document.documentElement;e/n>1.5?t.setProperty("--pixel",n/128+"px"):t.setProperty("--pixel",e/192+"px")};return s(),onresize=s,onkeydown=({key:t})=>{"1"===t?f(xt,r={buffer:0,value:10}):"0"===t?f(xt,r={buffer:0,value:100}):"ArrowRight"===t?f(xt,r={...r,buffer:1}):"ArrowLeft"===t&&f(xt,r={...r,buffer:-1})},[o,l]}let Re,Le,We,He,Ie,Ze,Ge,Je,Ke;const{abs:Qe,floor:Ue,random:Ve,sign:Xe,sqrt:Ye,trunc:tn}=Math;function en(t=0){return(16807*t+19487171)%2147483647}const nn=function(t){let e=function(t){let e=1,n=[en(t)];for(;e<6;)n=n.concat(en(++e*n[0]));return n}(t);return t=>{if(t<0||5<t)return;let n=e[t];return e[t]=en(n),Number(n%10)}}(function(t){return(t=String(t).match(/[0-9A-Za-z]/g))?(t=t.length>192?t.slice(0,192):t,Number(parseInt(t.join(""),36))):0}(Date.now()));function rn(t){const e=[Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e}function on(t){const e=[],n=rn(t);for(let r in n){let o=0;for(let l in n[r]){const s=n[r][l];if(void 0!==s){const n=t[s];e[s]={x:n.x,y:l-o,value:n.value,duration:100*Ye(2*o)}}else++o}}return e}function ln(t){const e=rn(t);let n=[],r=0;const o=l=>{const{value:s,x:c,y:u}=t[l];if(n[l])return;let i,a,d,f;n[l]={value:s,group:r},u<5&&(i=e[c][u+1]),c<5&&(a=e[c+1][u]),u>0&&(d=e[c][u-1]),c>0&&(f=e[c-1][u]);const m=e=>e&&t[e].value===s;m(i)&&o(i),m(a)&&o(a),m(d)&&o(d),m(f)&&o(f)};for(let e in t)++r,o(e);const l=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(l).reduce((t,e)=>{const{value:n,indexes:r}=l[e];return n===r.length?[...t,...r]:t},[])}function sn(t,e){const n=[0,0,0,0,0,0];return t.map((r,o)=>{return e.includes(o)&&r.y<6?(++n[r.x],{x:r.x,y:(l=r.x,n[l]+t.filter(t=>t.x===l).sort(({y:t},{y:e})=>t-e)[5].y),value:nn(r.x),duration:0}):r;var l})}function cn(t){return Xe(t)*tn(Ye(Qe(t)))}function un(){Le.value>100||"score"!==Ze?(Et.set(`hsl(${Ue(360*Ve())}, 100%, 50%)`),requestAnimationFrame(un)):Et.set("white")}function an(){}function dn(){vt.set(Re.map((t,e)=>Ge===e&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t)),At.set("blink")}function fn(){if(He=ln(Re),He.length>0){wt.set(We.concat(He.reduce((t,e)=>{const{value:n}=Re[e];return t[n]=(t[n]||0)+n,t.sum=(t.sum||0)+n,t},{})));const t=He.reduce((t,e)=>t+Re[e].value,0);setTimeout(()=>xt.set({...Le,buffer:t}),Ie.delay||400),setTimeout(()=>At.set("match"),Ie.delay||800)}else Le.value>100?At.set("extra"):Le.value<10?At.set("gameover"):We.length>0?At.set("total"):At.set("idle");Pt.set(void 0),kt.set(He)}function mn(){vt.set(sn(Re,He)),kt.set([]),setTimeout(()=>At.set("fall"),Ie.delay||400)}function pn(){vt.set(on(Re)),setTimeout(()=>At.set("blink"),Ie.delay||400)}function $n(){wt.set(We.concat({extra:0})),xt.set({...Le,buffer:100-Le.value})}function gn(){Tt.set({...Ke,buffer:We.reduce((t,{extra:e,sum:n},r)=>t+(r+1)*(n||e),0)}),setTimeout(()=>At.set("score"),Ie.delay||We.length>1?800:0)}function hn(){Tt.set({...Ke})}function yn(){Ct.set(!0),setTimeout(()=>{"gameover"===Ze&&(xt.set({...Le,buffer:-Le.value}),Tt.set({...Ke,buffer:Le.value}))},400)}function bn(){if("gameover"!==Ze&&"score"!==Ze)return;const{buffer:t,value:e}=Ke;if(0===t)return void("gameover"!==Ze&&setTimeout(()=>{wt.set([]),At.set("idle")},Ie.delay||200));const n="gameover"===Ze?Xe(t):cn(t),r=Ie.delay||"gameover"===Ze?200:function(t){switch(Qe(t)){case 1:return 130;case 2:case 3:return 80;case 4:case 5:case 6:return 50;case 7:case 8:case 9:case 10:case 11:return 30;default:return 20}}(n);setTimeout(()=>{Tt.set({buffer:t-n,value:e+n})},r)}function vn(){return function(t){let e=1;for(;e;){if(e=ln(t),0===e.length)return t;t=on(sn(t,e))}}(Array(36).fill(void 0).map((t,e)=>({x:Ue(e/6),y:e%6,value:nn(Ue(e/6)),duration:0})))}var xn=new class extends mt{constructor(t){super(),ft(this,t,De,qe,c,{})}}({target:document.body});return vt.subscribe(t=>Re=t),xt.subscribe(t=>{Le=t,function(){"white"===Je&&un();const{buffer:t,value:e}=Le,n="gameover"===Ze?Xe(t):cn(t);if("extra"===Ze){if(0===t)return setTimeout(()=>At.set("total"),Ie.delay||800);const[{extra:e}]=We.slice(-1);wt.set(We.slice(0,-1).concat({extra:e-n}))}0!==t&&setTimeout(()=>{xt.set({buffer:t-n,value:e+n})},Ie.delay||"gameover"===Ze?200:20)}()}),wt.subscribe(t=>We=t),kt.subscribe(t=>He=t),_t.subscribe(t=>Ie=t),At.subscribe(t=>{Ze=t,Object({idle:an,plus:dn,blink:fn,match:mn,fall:pn,extra:$n,total:gn,score:hn,gameover:yn})[Ze]()}),Pt.subscribe(t=>Ge=t),Et.subscribe(t=>Je=t),Tt.subscribe(t=>{Ke=t,bn()}),Ot.subscribe(t=>{vt.set(vn())}),xn}();
//# sourceMappingURL=bundle.js.map
