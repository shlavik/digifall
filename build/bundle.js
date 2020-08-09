var app=function(){"use strict";function t(){}const e=t=>t;function n(t,e){for(const n in e)t[n]=e[n];return t}function r(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(r)}function l(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function i(t,e,n){t.$$.on_destroy.push(a(e,n))}function u(t,e,r,o){return t[1]&&o?n(r.ctx.slice(),t[1](o(e))):r.ctx}function d(t,e,n,r,o,s,l){const c=function(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}(e,r,o,s);if(c){const o=u(e,n,r,l);t.p(o,c)}}function f(t,e,n=e){return t.set(n),e}const m=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),p="undefined"!=typeof window;let $=p?()=>window.performance.now():()=>Date.now(),h=p?t=>requestAnimationFrame(t):t;const g=new Set;function b(t){g.forEach(e=>{e.c(t)||(g.delete(e),e.f())}),0!==g.size&&h(b)}function v(t){let e;return 0===g.size&&h(b),{promise:new Promise(n=>{g.add(e={c:t,f:n})}),abort(){g.delete(e)}}}function y(t,e){t.appendChild(e)}function x(t,e,n){t.insertBefore(e,n||null)}function w(t){t.parentNode.removeChild(t)}function k(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function _(t){return document.createElement(t)}function C(t){return document.createTextNode(t)}function A(){return C(" ")}function M(){return C("")}function E(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function P(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function N(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function O(t,e,n){t.classList[n?"add":"remove"](e)}const T=new Set;let j,F=0;function S(t,e,n,r,o,s,l,c=0){const a=16.666/r;let i="{\n";for(let t=0;t<=1;t+=a){const r=e+(n-e)*s(t);i+=100*t+`%{${l(r,1-r)}}\n`}const u=i+`100% {${l(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${c}`,f=t.ownerDocument;T.add(f);const m=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(_("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,m.insertRule(`@keyframes ${d} ${u}`,m.cssRules.length));const $=t.style.animation||"";return t.style.animation=`${$?$+", ":""}${d} ${r}ms linear ${o}ms 1 both`,F+=1,d}function q(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-r.length;o&&(t.style.animation=r.join(", "),F-=o,F||h(()=>{F||(T.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),T.clear())}))}function z(t){j=t}function B(t){(function(){if(!j)throw new Error("Function called outside component initialization");return j})().$$.on_mount.push(t)}const D=[],L=[],R=[],W=[],H=Promise.resolve();let I=!1;function Z(t){R.push(t)}let G=!1;const J=new Set;function K(){if(!G){G=!0;do{for(let t=0;t<D.length;t+=1){const e=D[t];z(e),Q(e.$$)}for(D.length=0;L.length;)L.pop()();for(let t=0;t<R.length;t+=1){const e=R[t];J.has(e)||(J.add(e),e())}R.length=0}while(D.length);for(;W.length;)W.pop()();I=!1,G=!1,J.clear()}}function Q(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Z)}}let U;function V(){return U||(U=Promise.resolve(),U.then(()=>{U=null})),U}function X(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const Y=new Set;let tt;function et(){tt={r:0,c:[],p:tt}}function nt(){tt.r||s(tt.c),tt=tt.p}function rt(t,e){t&&t.i&&(Y.delete(t),t.i(e))}function ot(t,e,n,r){if(t&&t.o){if(Y.has(t))return;Y.add(t),tt.c.push(()=>{Y.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const st={duration:0};function lt(n,r,o){let s,c,a=r(n,o),i=!1,u=0;function d(){s&&q(n,s)}function f(){const{delay:r=0,duration:o=300,easing:l=e,tick:f=t,css:m}=a||st;m&&(s=S(n,0,1,o,r,l,m,u++)),f(0,1);const p=$()+r,h=p+o;c&&c.abort(),i=!0,Z(()=>X(n,!0,"start")),c=v(t=>{if(i){if(t>=h)return f(1,0),X(n,!0,"end"),d(),i=!1;if(t>=p){const e=l((t-p)/o);f(e,1-e)}}return i})}let m=!1;return{start(){m||(q(n),l(a)?(a=a(),V().then(f)):f())},invalidate(){m=!1},end(){i&&(d(),i=!1)}}}function ct(n,r,o){let c,a=r(n,o),i=!0;const u=tt;function d(){const{delay:r=0,duration:o=300,easing:l=e,tick:d=t,css:f}=a||st;f&&(c=S(n,1,0,o,r,l,f));const m=$()+r,p=m+o;Z(()=>X(n,!1,"start")),v(t=>{if(i){if(t>=p)return d(0,1),X(n,!1,"end"),--u.r||s(u.c),!1;if(t>=m){const e=l((t-m)/o);d(1-e,e)}}return i})}return u.r+=1,l(a)?V().then(()=>{a=a(),d()}):d(),{end(t){t&&a.tick&&a.tick(1,0),i&&(c&&q(n,c),i=!1)}}}function at(n,r,o,c){let a=r(n,o),i=c?0:1,u=null,d=null,f=null;function m(){f&&q(n,f)}function p(t,e){const n=t.b-i;return e*=Math.abs(n),{a:i,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function h(r){const{delay:o=0,duration:l=300,easing:c=e,tick:h=t,css:g}=a||st,b={start:$()+o,b:r};r||(b.group=tt,tt.r+=1),u?d=b:(g&&(m(),f=S(n,i,r,l,o,c,g)),r&&h(0,1),u=p(b,l),Z(()=>X(n,r,"start")),v(t=>{if(d&&t>d.start&&(u=p(d,l),d=null,X(n,u.b,"start"),g&&(m(),f=S(n,i,u.b,u.duration,0,c,a.css))),u)if(t>=u.end)h(i=u.b,1-i),X(n,u.b,"end"),d||(u.b?m():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;i=u.a+u.d*c(e/u.duration),h(i,1-i)}return!(!u&&!d)}))}return{run(t){l(a)?V().then(()=>{a=a(),h(t)}):h(t)},end(){m(),u=d=null}}}function it(t){t&&t.c()}function ut(t,e,n){const{fragment:o,on_mount:c,on_destroy:a,after_update:i}=t.$$;o&&o.m(e,n),Z(()=>{const e=c.map(r).filter(l);a?a.push(...e):s(e),t.$$.on_mount=[]}),i.forEach(Z)}function dt(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ft(t,e){-1===t.$$.dirty[0]&&(D.push(t),I||(I=!0,H.then(K)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function mt(e,n,r,l,c,a,i=[-1]){const u=j;z(e);const d=n.props||{},f=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:i,skip_bound:!1};let m=!1;if(f.ctx=r?r(e,d,(t,n,...r)=>{const o=r.length?r[0]:n;return f.ctx&&c(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),m&&ft(e,t)),n}):[],f.update(),m=!0,s(f.before_update),f.fragment=!!l&&l(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(w)}else f.fragment&&f.fragment.c();n.intro&&rt(e.$$.fragment),ut(e,n.target,n.anchor),K()}z(u)}class pt{$destroy(){dt(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const $t=[];function ht(e,n=t){let r;const o=[];function s(t){if(c(e,t)&&(e=t,r)){const t=!$t.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),$t.push(n,e)}if(t){for(let t=0;t<$t.length;t+=2)$t[t][0]($t[t+1]);$t.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(l,c=t){const a=[l,c];return o.push(a),1===o.length&&(r=n(s)||t),l(e),()=>{const t=o.indexOf(a);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}const gt=(t=0)=>(16807*t+19487171)%2147483647,bt=(t=>{let e=(t=>{let e=1,n=[gt(t)];for(;e<6;)n=n.concat(gt(++e*n[0]));return n})(t);return t=>{if(t<0||5<t)return;let n=e[t];return e[t]=gt(n),Number(n%10)}})((t=>(t=String(t).match(/[0-9A-Za-z]/g))?(t=t.length>192?t.slice(0,192):t,Number(parseInt(t.join(""),36))):0)(Date.now())),vt=t=>{const e=[Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e},yt=()=>(t=>{let e=1;for(;e;){if(e=wt(t),0===e.length)return t;t=xt(kt(t,e))}})(Array(36).fill(void 0).map((t,e)=>({x:Math.floor(e/6),y:e%6,value:bt(Math.floor(e/6)),duration:0}))),xt=t=>{const e=[],n=vt(t);for(let r in n){let o=0;for(let s in n[r]){const l=n[r][s];if(void 0!==l){const n=t[l];e[l]={x:n.x,y:s-o,value:n.value,duration:100*Math.sqrt(2*o)}}else++o}}return e},wt=t=>{const e=vt(t);let n=[],r=0;const o=s=>{const{value:l,x:c,y:a}=t[s];if(n[s])return;let i,u,d,f;n[s]={value:l,group:r},a<5&&(i=e[c][a+1]),c<5&&(u=e[c+1][a]),a>0&&(d=e[c][a-1]),c>0&&(f=e[c-1][a]);const m=e=>e&&t[e].value===l;m(i)&&o(i),m(u)&&o(u),m(d)&&o(d),m(f)&&o(f)};for(let e in t)++r,o(e);const s=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(s).reduce((t,e)=>{const{value:n,indexes:r}=s[e];return n===r.length?[...t,...r]:t},[])},kt=(t,e)=>{const n=[0,0,0,0,0,0];return t.map((r,o)=>{return e.includes(o)&&r.y<6?(++n[r.x],{x:r.x,y:(s=r.x,n[s]+t.filter(t=>t.x===s).sort(({y:t},{y:e})=>t-e)[5].y),value:bt(r.x),duration:0}):r;var s})},_t=t=>{const{abs:e,sign:n,sqrt:r,trunc:o}=Math;return n(t)*o(r(e(t)))};let Ct=Math.floor(360*Math.random());const At=(t=10)=>(Ct+=30+Math.floor(30*Math.random()),`hsl(${Ct},100%,${t}%)`),Mt=()=>{const[t,e,n,r]=(t=>{for(let e=t.length-1;e>0;--e){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})([7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);return`\n      background-color: ${At()};\n      background-image:\n        linear-gradient(90deg, ${At()} 50%, transparent 50%),\n        linear-gradient(90deg, ${At()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${At()} 50%),\n        linear-gradient(90deg, transparent 50%, ${At()} 50%);\n      background-size: ${t}rem, ${e}rem, ${n}rem, ${r}rem;`},Et=(t=!0)=>{const{style:e}=document.documentElement;e.setProperty("--shadow-0",t?"0 0 1px black":"none"),e.setProperty("--shadow-1",t?"0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white":"none"),e.setProperty("--shadow-2",t?"0 1rem 1rem var(--color-black-04),  0 -1px 0 white":"none"),e.setProperty("--shadow-21",t?"0 0 21rem 1rem black":"0 0 0 transparent"),e.setProperty("--shadow-inset-1",t?"inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white":"none"),e.setProperty("--shadow-inset-2",t?"inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white":"none")},Pt={buffer:0,value:100},Nt=[],Ot={buffer:0,value:0},Tt=ht([]),jt=ht(Pt),Ft=ht(Nt),St=ht({name:"",timestamp:Date.now(),shadow:!0}),qt=ht(!0),zt=ht("idle"),Bt=ht("white"),Dt=ht(Ot),Lt=function(e,n,r){const o=!Array.isArray(e),c=o?[e]:e,i=n.length<2;return{subscribe:ht(r,e=>{let r=!1;const u=[];let d=0,f=t;const m=()=>{if(d)return;f();const r=n(o?u[0]:u,e);i?e(r):f=l(r)?r:t},p=c.map((t,e)=>a(t,t=>{u[e]=t,d&=~(1<<e),r&&m()},()=>{d|=1<<e}));return r=!0,m(),function(){s(p),f()}}).subscribe}}(St,({name:t,timestamp:e})=>`${t}_${e}`);Lt.subscribe(t=>Tt.set(yt()));const Rt=()=>{jt.set(Pt),Ft.set(Nt),St.update(t=>({...t,timestamp:Date.now()})),qt.set(!1),zt.set("idle"),Bt.set("white"),Dt.set(Ot)};function Wt(e){let n,r,o,s,l,c,a,i,u;return{c(){n=_("div"),r=_("div"),o=_("div"),s=C(e[4]),c=A(),a=_("div"),i=C(e[5]),P(o,"class",l="current color-"+e[4]),P(a,"class",u="next color-"+e[5]),P(r,"class","value"),P(n,"class","card"),P(n,"style",e[6]),P(n,"data-index",e[0]),O(n,"clickable",e[1]),O(n,"plused",e[3]),O(n,"matched",e[2])},m(t,e){x(t,n,e),y(n,r),y(r,o),y(o,s),y(r,c),y(r,a),y(a,i)},p(t,[e]){16&e&&N(s,t[4]),16&e&&l!==(l="current color-"+t[4])&&P(o,"class",l),32&e&&N(i,t[5]),32&e&&u!==(u="next color-"+t[5])&&P(a,"class",u),64&e&&P(n,"style",t[6]),1&e&&P(n,"data-index",t[0]),2&e&&O(n,"clickable",t[1]),8&e&&O(n,"plused",t[3]),4&e&&O(n,"matched",t[2])},i:t,o:t,d(t){t&&w(n)}}}function Ht(t,e,n){let r,o,{index:s}=e,{clickable:l}=e,{duration:c}=e,{fallPhase:a}=e,{matched:i}=e,{plused:u}=e,{value:d}=e,{x:f=0}=e,{y:m=0}=e;return t.$$set=t=>{"index"in t&&n(0,s=t.index),"clickable"in t&&n(1,l=t.clickable),"duration"in t&&n(7,c=t.duration),"fallPhase"in t&&n(8,a=t.fallPhase),"matched"in t&&n(2,i=t.matched),"plused"in t&&n(3,u=t.plused),"value"in t&&n(4,d=t.value),"x"in t&&n(9,f=t.x),"y"in t&&n(10,m=t.y)},t.$$.update=()=>{16&t.$$.dirty&&n(5,r=d<9?d+1:0),1920&t.$$.dirty&&n(6,o=`\n    bottom: ${21*m}rem;\n    left: ${21*f}rem;\n    transition-duration: ${a?c:0}ms;\n  `)},[s,l,i,u,d,r,o,c,a,f,m]}class It extends pt{constructor(t){super(),mt(this,t,Ht,Wt,c,{index:0,clickable:1,duration:7,fallPhase:8,matched:2,plused:3,value:4,x:9,y:10})}}function Zt(t,e,n){const r=t.slice();return r[10]=e[n],r[12]=n,r}function Gt(t){let e,r;const o=[{clickable:"idle"===t[2]&&!t[0]},{fallPhase:"fall"===t[2]},{matched:t[1].includes(t[12])},{plused:t[0]===t[12]},t[10],{index:t[12]}];let s={};for(let t=0;t<o.length;t+=1)s=n(s,o[t]);return e=new It({props:s}),{c(){it(e.$$.fragment)},m(t,n){ut(e,t,n),r=!0},p(t,n){const r=15&n?function(t,e){const n={},r={},o={$$scope:1};let s=t.length;for(;s--;){const l=t[s],c=e[s];if(c){for(const t in l)t in c||(r[t]=1);for(const t in c)o[t]||(n[t]=c[t],o[t]=1);t[s]=c}else for(const t in l)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(o,[5&n&&{clickable:"idle"===t[2]&&!t[0]},4&n&&{fallPhase:"fall"===t[2]},2&n&&{matched:t[1].includes(t[12])},1&n&&{plused:t[0]===t[12]},8&n&&(s=t[10],"object"==typeof s&&null!==s?s:{}),o[5]]):{};var s;e.$set(r)},i(t){r||(rt(e.$$.fragment,t),r=!0)},o(t){ot(e.$$.fragment,t),r=!1},d(t){dt(e,t)}}}function Jt(t){let e,n,r,o,s=t[3],l=[];for(let e=0;e<s.length;e+=1)l[e]=Gt(Zt(t,s,e));const c=t=>ot(l[t],1,1,()=>{l[t]=null});return{c(){e=_("div");for(let t=0;t<l.length;t+=1)l[t].c();P(e,"class","board"),O(e,"overflow-hidden","idle"!==t[2])},m(s,c){x(s,e,c);for(let t=0;t<l.length;t+=1)l[t].m(e,null);n=!0,r||(o=E(e,"click",t[4]),r=!0)},p(t,[n]){if(15&n){let r;for(s=t[3],r=0;r<s.length;r+=1){const o=Zt(t,s,r);l[r]?(l[r].p(o,n),rt(l[r],1)):(l[r]=Gt(o),l[r].c(),rt(l[r],1),l[r].m(e,null))}for(et(),r=s.length;r<l.length;r+=1)c(r);nt()}4&n&&O(e,"overflow-hidden","idle"!==t[2])},i(t){if(!n){for(let t=0;t<s.length;t+=1)rt(l[t]);n=!0}},o(t){l=l.filter(Boolean);for(let t=0;t<l.length;t+=1)ot(l[t]);n=!1},d(t){t&&w(e),k(l,t),r=!1,o()}}}function Kt(t,e,n){let r,o,s,l,c,a,u;i(t,zt,t=>n(2,r=t)),i(t,Tt,t=>n(3,o=t)),i(t,Ft,t=>n(5,s=t)),i(t,jt,t=>n(6,l=t)),i(t,Dt,t=>n(7,c=t)),i(t,qt,t=>n(8,a=t));let d=[];zt.subscribe(()=>{switch(r){case"plus":f(Tt,o=((t,e)=>t.map((t,n)=>e===n&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t))(o,u)),f(zt,r="blink");break;case"blink":if(n(0,u=void 0),n(1,d=wt(o)),d.length>0){f(Ft,s=s.concat(d.reduce((t,e)=>{const{value:n}=o[e];return t[n]=(t[n]||0)+n,t.sum=(t.sum||0)+n,t},{})));const t=d.reduce((t,e)=>t+o[e].value,0);setTimeout(()=>f(jt,l={...l,buffer:t}),400),setTimeout(()=>f(zt,r="match"),800)}else l.value>100?f(zt,r="extra"):l.value<10?f(zt,r="gameover"):s.length>0?f(zt,r="total"):f(zt,r="idle");break;case"match":f(Tt,o=kt(o,d)),n(1,d=[]),setTimeout(()=>f(zt,r="fall"),400);break;case"fall":f(Tt,o=xt(o)),setTimeout(()=>f(zt,r="blink"),400);break;case"extra":f(Ft,s=s.concat({extra:0})),f(jt,l={...l,buffer:100-l.value});break;case"total":f(Dt,c={...c,buffer:s.reduce((t,{extra:e,sum:n},r)=>t+(r+1)*(n||e),0)}),setTimeout(()=>f(zt,r="score"),s.length>1?800:0);break;case"score":f(Dt,c={...c});break;case"gameover":f(qt,a=!0)}});const m=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?m(e):void 0;return[u,d,r,o,({target:t})=>{"idle"!==r||u||(n(0,u=Number(m(t))),Number.isNaN(u)||(f(jt,l={...l,buffer:-10}),setTimeout(()=>f(zt,r="plus"),400)))}]}class Qt extends pt{constructor(t){super(),mt(this,t,Kt,Jt,c,{})}}function Ut(e){let n,r,o,s,l,c,a,i,u=e[0].value+"",d=e[0].value+"";return{c(){n=_("div"),r=_("div"),o=_("span"),s=C(u),l=A(),c=_("div"),a=_("span"),i=C(d),P(o,"class","left-value"),P(o,"style",e[2]),P(r,"class","left-bar"),P(r,"style",e[1]),P(a,"class","right-value"),P(a,"style",e[4]),P(c,"class","right-bar"),P(c,"style",e[3]),P(n,"class","energy")},m(t,e){x(t,n,e),y(n,r),y(r,o),y(o,s),y(n,l),y(n,c),y(c,a),y(a,i)},p(t,[e]){1&e&&u!==(u=t[0].value+"")&&N(s,u),4&e&&P(o,"style",t[2]),2&e&&P(r,"style",t[1]),1&e&&d!==(d=t[0].value+"")&&N(i,d),16&e&&P(a,"style",t[4]),8&e&&P(c,"style",t[3])},i:t,o:t,d(t){t&&w(n)}}}function Vt(t,e,n){let r,o,s,l;i(t,jt,t=>n(0,r=t)),i(t,zt,t=>n(5,o=t)),i(t,Bt,t=>n(6,s=t)),i(t,Ft,t=>n(7,l=t));const c=()=>{r.value>100||"score"!==o?(f(Bt,s=`hsl(${Math.floor(360*Math.random())}, 100%, 50%)`),requestAnimationFrame(c)):f(Bt,s="white")};let a,u,d,m,p,$;return jt.subscribe(({buffer:t,value:e})=>{"white"===s&&c();const n=_t(t);if(requestAnimationFrame(()=>{0!==t&&f(jt,r={buffer:t-n,value:e+n})}),"extra"===o){if(0===t)return setTimeout(()=>f(zt,o="total"),800);const[{extra:e}]=l.slice(-1);f(Ft,l=l.slice(0,-1).concat({extra:e-n}))}}),t.$$.update=()=>{1&t.$$.dirty&&n(8,a=r.value),256&t.$$.dirty&&n(9,u=a>100),768&t.$$.dirty&&n(1,d=`flex: ${(u?200-a:a)/100}; z-index: ${u?0:1}`),512&t.$$.dirty&&n(2,m="position: "+(u?"absolute":"relative")),832&t.$$.dirty&&n(3,p=`background-color: ${u?s:"var(--color-dark)"}; flex: ${u?(a-100)/100:0}; z-index: ${u?1:0}`),768&t.$$.dirty&&n(4,$=`left: ${u?`calc(${a>119?0:(a-120)/100} * 128rem)`:0}; position: ${u?"relative":"absolute"}`)},[r,d,m,p,$]}class Xt extends pt{constructor(t){super(),mt(this,t,Vt,Ut,c,{})}}function Yt(e){let n,r,o=e[0].value+"";return{c(){n=_("span"),r=C(o),P(n,"class","score")},m(t,e){x(t,n,e),y(n,r)},p(t,[e]){1&e&&o!==(o=t[0].value+"")&&N(r,o)},i:t,o:t,d(t){t&&w(n)}}}function te(t,e,n){let r,o,s;return i(t,zt,t=>n(1,r=t)),i(t,Ft,t=>n(2,o=t)),i(t,Dt,t=>n(0,s=t)),Dt.subscribe(({buffer:t,value:e})=>{if("score"!==r)return;const n=_t(t),l=(t=>{switch(Math.abs(t)){case 0:return 200;case 1:return 130;case 2:case 3:return 80;case 4:case 5:case 6:return 50;case 7:case 8:case 9:case 10:case 11:return 30;default:return 20}})(n);setTimeout(()=>{if("score"===r)return 0===t?(f(Ft,o=[]),void f(zt,r="idle")):void f(Dt,s={buffer:t-n,value:e+n})},l)}),[s]}class ee extends pt{constructor(t){super(),mt(this,t,te,Yt,c,{})}}function ne(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}function re(t){const e=t-1;return e*e*e+1}function oe(t,{delay:e=0,duration:n=400,easing:r=ne,amount:o=5,opacity:s=0}){const l=getComputedStyle(t),c=+l.opacity,a="none"===l.filter?"":l.filter,i=c*(1-s);return{delay:e,duration:n,easing:r,css:(t,e)=>`opacity: ${c-i*e}; filter: ${a} blur(${e*o}px);`}}function se(t,{delay:n=0,duration:r=400,easing:o=e}){const s=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:o,css:t=>"opacity: "+t*s}}function le(t,{delay:e=0,duration:n=400,easing:r=re}){const o=getComputedStyle(t),s=+o.opacity,l=parseFloat(o.height),c=parseFloat(o.paddingTop),a=parseFloat(o.paddingBottom),i=parseFloat(o.marginTop),u=parseFloat(o.marginBottom),d=parseFloat(o.borderTopWidth),f=parseFloat(o.borderBottomWidth);return{delay:e,duration:n,easing:r,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*s};height: ${t*l}px;padding-top: ${t*c}px;padding-bottom: ${t*a}px;margin-top: ${t*i}px;margin-bottom: ${t*u}px;border-top-width: ${t*d}px;border-bottom-width: ${t*f}px;`}}function ce(t,e,n){const r=t.slice();return r[10]=e[n][0],r[11]=e[n][1],r[13]=n,r}function ae(t,e,n){const r=t.slice();return r[5]=e[n].extra,r[6]=e[n].sum,r[7]=function(t,e){const n={};for(const r in t)m(t,r)&&-1===e.indexOf(r)&&(n[r]=t[r]);return n}(e[n],["extra","sum"]),r[9]=n,r}function ie(t){let e,n,r,o="score"!==t[2]&&ue(t),s=("total"===t[2]||"score"===t[2])&&he(t);return{c(){e=_("ol"),o&&o.c(),n=A(),s&&s.c(),P(e,"class","log")},m(t,l){x(t,e,l),o&&o.m(e,null),y(e,n),s&&s.m(e,null),r=!0},p(t,r){"score"!==t[2]?o?(o.p(t,r),4&r&&rt(o,1)):(o=ue(t),o.c(),rt(o,1),o.m(e,n)):o&&(et(),ot(o,1,1,()=>{o=null}),nt()),"total"===t[2]||"score"===t[2]?s?(s.p(t,r),4&r&&rt(s,1)):(s=he(t),s.c(),rt(s,1),s.m(e,null)):s&&(et(),ot(s,1,1,()=>{s=null}),nt())},i(t){r||(rt(o),rt(s),r=!0)},o(t){ot(o),ot(s),r=!1},d(t){t&&w(e),o&&o.d(),s&&s.d()}}}function ue(t){let e,n,r=t[1],o=[];for(let e=0;e<r.length;e+=1)o[e]=$e(ae(t,r,e));const s=t=>ot(o[t],1,1,()=>{o[t]=null});return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=M()},m(t,r){for(let e=0;e<o.length;e+=1)o[e].m(t,r);x(t,e,r),n=!0},p(t,n){if(10&n){let l;for(r=t[1],l=0;l<r.length;l+=1){const s=ae(t,r,l);o[l]?(o[l].p(s,n),rt(o[l],1)):(o[l]=$e(s),o[l].c(),rt(o[l],1),o[l].m(e.parentNode,e))}for(et(),l=r.length;l<o.length;l+=1)s(l);nt()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)rt(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)ot(o[t]);n=!1},d(t){k(o,t),t&&w(e)}}}function de(t){let e;return{c(){e=_("span"),e.textContent="+",P(e,"class","plus")},m(t,n){x(t,e,n)},d(t){t&&w(e)}}}function fe(t){let e,n,r,o,s,l=t[11]+"",c=t[13]<Object.keys(t[7]).length-1,a=c&&de();return{c(){e=_("span"),n=C(l),o=A(),a&&a.c(),s=M(),P(e,"class",r="value color-"+t[10])},m(t,r){x(t,e,r),y(e,n),x(t,o,r),a&&a.m(t,r),x(t,s,r)},p(t,o){2&o&&l!==(l=t[11]+"")&&N(n,l),2&o&&r!==(r="value color-"+t[10])&&P(e,"class",r),2&o&&(c=t[13]<Object.keys(t[7]).length-1),c?a||(a=de(),a.c(),a.m(s.parentNode,s)):a&&(a.d(1),a=null)},d(t){t&&w(e),t&&w(o),a&&a.d(t),t&&w(s)}}}function me(t){let e,n,r=(t[9]+1)*t[6]+"";return{c(){e=_("span"),n=C(r),P(e,"class","sum")},m(t,r){x(t,e,r),y(e,n)},p(t,e){2&e&&r!==(r=(t[9]+1)*t[6]+"")&&N(n,r)},d(t){t&&w(e)}}}function pe(t){let e,n,r,o,s,l,c=t[5]+"",a=(t[9]+1)*t[5]+"";return{c(){e=_("span"),n=C(c),o=A(),s=_("span"),l=C(a),P(e,"class","extra"),P(e,"style",r="color: "+t[3]),P(s,"class","sum")},m(t,r){x(t,e,r),y(e,n),x(t,o,r),x(t,s,r),y(s,l)},p(t,o){2&o&&c!==(c=t[5]+"")&&N(n,c),8&o&&r!==(r="color: "+t[3])&&P(e,"style",r),2&o&&a!==(a=(t[9]+1)*t[5]+"")&&N(l,a)},d(t){t&&w(e),t&&w(o),t&&w(s)}}}function $e(t){let e,n,r,o,s,l,c=Object.entries(t[7]),a=[];for(let e=0;e<c.length;e+=1)a[e]=fe(ce(t,c,e));function i(t,e){return void 0!==t[5]?pe:me}let u=i(t),d=u(t);return{c(){e=_("li");for(let t=0;t<a.length;t+=1)a[t].c();n=A(),d.c(),r=A(),P(e,"class","combo")},m(t,o){x(t,e,o);for(let t=0;t<a.length;t+=1)a[t].m(e,null);y(e,n),d.m(e,null),y(e,r),l=!0},p(t,o){if(2&o){let r;for(c=Object.entries(t[7]),r=0;r<c.length;r+=1){const s=ce(t,c,r);a[r]?a[r].p(s,o):(a[r]=fe(s),a[r].c(),a[r].m(e,n))}for(;r<a.length;r+=1)a[r].d(1);a.length=c.length}u===(u=i(t))&&d?d.p(t,o):(d.d(1),d=u(t),d&&(d.c(),d.m(e,r)))},i(t){l||(Z(()=>{s&&s.end(1),o||(o=lt(e,le,{duration:100})),o.start()}),l=!0)},o(t){o&&o.invalidate(),s=ct(e,se,{duration:200}),l=!1},d(t){t&&w(e),k(a,t),d.d(),t&&s&&s.end()}}}function he(t){let e,n,r,o,s,l,c,a,i,u,d=t[0]?"":"total:",f=`${"score"===t[2]&&t[4].buffer>0?"+":""}${t[4].buffer}`;return{c(){e=_("li"),n=_("span"),r=C(d),o=C(" "),s=A(),l=_("span"),c=C(f),P(l,"class","sum"),O(e,"collapse",t[0])},m(t,a){x(t,e,a),y(e,n),y(n,r),y(n,o),y(e,s),y(e,l),y(l,c),u=!0},p(t,n){(!u||1&n)&&d!==(d=t[0]?"":"total:")&&N(r,d),(!u||20&n)&&f!==(f=`${"score"===t[2]&&t[4].buffer>0?"+":""}${t[4].buffer}`)&&N(c,f),1&n&&O(e,"collapse",t[0])},i(n){u||(Z(()=>{i&&i.end(1),a||(a=lt(e,le,{duration:t[0]?0:100})),a.start()}),u=!0)},o(t){a&&a.invalidate(),i=ct(e,se,{duration:200}),u=!1},d(t){t&&w(e),t&&i&&i.end()}}}function ge(t){let e,n,r=t[1].length>0&&ie(t);return{c(){r&&r.c(),e=M()},m(t,o){r&&r.m(t,o),x(t,e,o),n=!0},p(t,[n]){t[1].length>0?r?(r.p(t,n),2&n&&rt(r,1)):(r=ie(t),r.c(),rt(r,1),r.m(e.parentNode,e)):r&&(et(),ot(r,1,1,()=>{r=null}),nt())},i(t){n||(rt(r),n=!0)},o(t){ot(r),n=!1},d(t){r&&r.d(t),t&&w(e)}}}function be(t,e,n){let r,o,s,l,c;return i(t,Ft,t=>n(1,r=t)),i(t,zt,t=>n(2,o=t)),i(t,Bt,t=>n(3,s=t)),i(t,Dt,t=>n(4,l=t)),t.$$.update=()=>{2&t.$$.dirty&&n(0,c=1===r.length)},[c,r,o,s,l]}class ve extends pt{constructor(t){super(),mt(this,t,be,ge,c,{})}}function ye(t){let e,n,r,o,s,l,c,a,i,u,d,f,m,p,$,h,g,b,v;return c=new ve({}),u=new ee({}),m=new Qt({}),h=new Xt({}),{c(){e=_("div"),n=_("div"),r=_("div"),o=_("button"),s=_("span"),s.textContent="work in progress",l=A(),it(c.$$.fragment),a=A(),i=_("div"),it(u.$$.fragment),d=A(),f=_("div"),it(m.$$.fragment),p=A(),$=_("div"),it(h.$$.fragment),P(o,"class","digifall"),O(o,"screen",t[2].length>0),P(r,"class","section-1"),P(i,"class","section-2"),P(f,"class","section-3"),P($,"class","section-4"),P(n,"class","content"),P(e,"class","game"),P(e,"style",t[0]),O(e,"blur",!0===t[1])},m(w,k){x(w,e,k),y(e,n),y(n,r),y(r,o),y(o,s),y(o,l),ut(c,o,null),y(n,a),y(n,i),ut(u,i,null),y(n,d),y(n,f),ut(m,f,null),y(n,p),y(n,$),ut(h,$,null),g=!0,b||(v=E(o,"click",t[3]),b=!0)},p(t,[n]){4&n&&O(o,"screen",t[2].length>0),(!g||1&n)&&P(e,"style",t[0]),2&n&&O(e,"blur",!0===t[1])},i(t){g||(rt(c.$$.fragment,t),rt(u.$$.fragment,t),rt(m.$$.fragment,t),rt(h.$$.fragment,t),g=!0)},o(t){ot(c.$$.fragment,t),ot(u.$$.fragment,t),ot(m.$$.fragment,t),ot(h.$$.fragment,t),g=!1},d(t){t&&w(e),dt(c),dt(u),dt(m),dt(h),b=!1,v()}}}function xe(t,e,n){let r,o,s;i(t,Lt,t=>n(4,r=t)),i(t,qt,t=>n(1,o=t)),i(t,Ft,t=>n(2,s=t));let l=Mt();const c=()=>{const{style:t}=document.documentElement,{offsetHeight:e,offsetWidth:r}=document.querySelector(".game");e/r>1.5?(t.setProperty("--pixel",r/128+"px"),n(0,l=void 0)):(t.setProperty("--pixel",e/192+"px"),n(0,l=Mt()))};B(()=>{c(),Et()}),onresize=c;return t.$$.update=()=>{16&t.$$.dirty&&console.log(r)},[l,o,s,()=>f(qt,o=!0)]}class we extends pt{constructor(t){super(),mt(this,t,xe,ye,c,{})}}function ke(e){let n,r,o,s,l,c,a,i,u,d,f,m,p,$,h,g,b,v,k,M=e[0].value+"";return{c(){n=_("div"),r=_("div"),o=_("span"),o.textContent="game over",l=A(),c=_("div"),a=_("span"),i=C(M),u=A(),d=_("div"),f=_("div"),m=_("button"),m.textContent="new game",$=A(),h=_("div"),g=_("span"),g.innerHTML='<span class="text-big">0</span> \n      <span class="text-small">ut of energy</span>',P(o,"class","text-big"),P(r,"class","section-1"),P(a,"class","score"),P(c,"class","section-2"),P(f,"class","col"),P(d,"class","section-3"),P(g,"class","text-wrapper"),P(h,"class","section-4"),P(n,"class","game-over content")},m(t,s){x(t,n,s),y(n,r),y(r,o),y(n,l),y(n,c),y(c,a),y(a,i),y(n,u),y(n,d),y(d,f),y(f,m),y(n,$),y(n,h),y(h,g),v||(k=E(m,"click",e[1]),v=!0)},p(t,[e]){1&e&&M!==(M=t[0].value+"")&&N(i,M)},i(t){s||Z(()=>{s=lt(o,oe,{}),s.start()}),p||Z(()=>{p=lt(f,oe,{}),p.start()}),b||Z(()=>{b=lt(g,oe,{}),b.start()})},o:t,d(t){t&&w(n),v=!1,k()}}}function _e(t,e,n){let r;i(t,Dt,t=>n(0,r=t));return[r,()=>Rt()]}class Ce extends pt{constructor(t){super(),mt(this,t,_e,ke,c,{})}}function Ae(e){let n,r;return{c(){n=_("span"),n.textContent="work in progress",P(n,"class","text-small")},m(t,e){x(t,n,e)},i(t){r||Z(()=>{r=lt(n,oe,{}),r.start()})},o:t,d(t){t&&w(n)}}}function Me(e){let n,r;return{c(){n=_("span"),n.textContent="start a new game?",P(n,"class","text-small")},m(t,e){x(t,n,e)},i(t){r||Z(()=>{r=lt(n,oe,{}),r.start()})},o:t,d(t){t&&w(n)}}}function Ee(e){let n,r,o,l,c,a,i,u,d,f,m;return{c(){n=_("div"),r=_("button"),r.textContent="resume",o=A(),l=_("button"),l.textContent="new game",c=A(),a=_("button"),a.textContent="shadow",i=A(),u=_("button"),u.textContent="fullscreen",P(n,"class","col")},m(t,s){x(t,n,s),y(n,r),y(n,o),y(n,l),y(n,c),y(n,a),y(n,i),y(n,u),f||(m=[E(r,"click",e[2]),E(l,"click",e[3]),E(a,"click",e[6]),E(u,"click",e[7])],f=!0)},p:t,i(t){d||Z(()=>{d=lt(n,oe,{}),d.start()})},o:t,d(t){t&&w(n),f=!1,s(m)}}}function Pe(e){let n,r,o,l,c,a,i;return{c(){n=_("div"),r=_("button"),r.textContent="yes",o=A(),l=_("button"),l.textContent="no",P(n,"class","row")},m(t,s){x(t,n,s),y(n,r),y(n,o),y(n,l),a||(i=[E(r,"click",e[4]),E(l,"click",e[5])],a=!0)},p:t,i(t){c||Z(()=>{c=lt(n,oe,{}),c.start()})},o:t,d(t){t&&w(n),a=!1,s(i)}}}function Ne(e){let n,r,o,s,l,c,a,i,u,d,f=e[1].value+"";function m(t,e){return t[0]?Me:Ae}let p=m(e),$=p(e);function h(t,e){return t[0]?Pe:Ee}let g=h(e),b=g(e);return{c(){n=_("div"),r=_("div"),$.c(),o=A(),s=_("div"),l=_("span"),c=C(f),a=A(),i=_("div"),b.c(),u=A(),d=_("div"),P(r,"class","section-1"),P(l,"class","score"),P(s,"class","section-2"),P(i,"class","section-3"),P(d,"class","section-4"),P(n,"class","menu content")},m(t,e){x(t,n,e),y(n,r),$.m(r,null),y(n,o),y(n,s),y(s,l),y(l,c),y(n,a),y(n,i),b.m(i,null),y(n,u),y(n,d)},p(t,[e]){p!==(p=m(t))&&($.d(1),$=p(t),$&&($.c(),rt($,1),$.m(r,null))),2&e&&f!==(f=t[1].value+"")&&N(c,f),g===(g=h(t))&&b?b.p(t,e):(b.d(1),b=g(t),b&&(b.c(),rt(b,1),b.m(i,null)))},i(t){rt($),rt(b)},o:t,d(t){t&&w(n),$.d(),b.d()}}}function Oe(t,e,n){let r,o,s;i(t,qt,t=>n(8,r=t)),i(t,St,t=>n(9,o=t)),i(t,Dt,t=>n(1,s=t));let l=!1;return[l,s,()=>f(qt,r=!1),()=>n(0,l=!0),()=>Rt(),()=>n(0,l=!1),()=>{const{shadow:t}=o;Et(!t),f(St,o={...o,shadow:!t})},()=>{const{documentElement:t,fullscreen:e}=document;e?document.exitFullscreen():t.requestFullscreen()}]}class Te extends pt{constructor(t){super(),mt(this,t,Oe,Ne,c,{})}}function je(t){let e,n,r;const o=t[1].default,s=function(t,e,n,r){if(t){const o=u(t,e,n,r);return t[0](o)}}(o,t,t[0],null);return{c(){e=_("div"),s&&s.c(),P(e,"class","overlay")},m(t,n){x(t,e,n),s&&s.m(e,null),r=!0},p(t,[e]){s&&s.p&&1&e&&d(s,o,t,t[0],e,null,null)},i(t){r||(rt(s,t),Z(()=>{n||(n=at(e,oe,{},!0)),n.run(1)}),r=!0)},o(t){ot(s,t),n||(n=at(e,oe,{},!1)),n.run(0),r=!1},d(t){t&&w(e),s&&s.d(t),t&&n&&n.end()}}}function Fe(t,e,n){let{$$slots:r={},$$scope:o}=e;return t.$$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,r]}class Se extends pt{constructor(t){super(),mt(this,t,Fe,je,c,{})}}function qe(t){let e,n;return e=new Se({props:{$$slots:{default:[De]},$$scope:{ctx:t}}}),{c(){it(e.$$.fragment)},m(t,r){ut(e,t,r),n=!0},p(t,n){const r={};10&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(rt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){dt(e,t)}}}function ze(t){let e,n;return e=new Te({}),{c(){it(e.$$.fragment)},m(t,r){ut(e,t,r),n=!0},i(t){n||(rt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){dt(e,t)}}}function Be(t){let e,n;return e=new Ce({}),{c(){it(e.$$.fragment)},m(t,r){ut(e,t,r),n=!0},i(t){n||(rt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){dt(e,t)}}}function De(t){let e,n,r,o;const s=[Be,ze],l=[];function c(t,e){return"gameover"===t[1]?0:1}return e=c(t),n=l[e]=s[e](t),{c(){n.c(),r=M()},m(t,n){l[e].m(t,n),x(t,r,n),o=!0},p(t,o){let a=e;e=c(t),e!==a&&(et(),ot(l[a],1,1,()=>{l[a]=null}),nt(),n=l[e],n||(n=l[e]=s[e](t),n.c()),rt(n,1),n.m(r.parentNode,r))},i(t){o||(rt(n),o=!0)},o(t){ot(n),o=!1},d(t){l[e].d(t),t&&w(r)}}}function Le(t){let e,n,r,o;n=new we({});let s=t[0]&&qe(t);return{c(){e=_("div"),it(n.$$.fragment),r=A(),s&&s.c(),P(e,"class","app")},m(t,l){x(t,e,l),ut(n,e,null),y(e,r),s&&s.m(e,null),o=!0},p(t,[n]){t[0]?s?(s.p(t,n),1&n&&rt(s,1)):(s=qe(t),s.c(),rt(s,1),s.m(e,null)):s&&(et(),ot(s,1,1,()=>{s=null}),nt())},i(t){o||(rt(n.$$.fragment,t),rt(s),o=!0)},o(t){ot(n.$$.fragment,t),ot(s),o=!1},d(t){t&&w(e),dt(n),s&&s.d()}}}function Re(t,e,n){let r,o,s;return i(t,jt,t=>n(2,r=t)),i(t,qt,t=>n(0,o=t)),i(t,zt,t=>n(1,s=t)),onkeydown=({key:t})=>{"1"===t?f(jt,r={buffer:0,value:10}):"0"===t?f(jt,r={buffer:0,value:100}):"ArrowRight"===t?f(jt,r={...r,buffer:1}):"ArrowLeft"===t&&f(jt,r={...r,buffer:-1})},[o,s]}return new class extends pt{constructor(t){super(),mt(this,t,Re,Le,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
