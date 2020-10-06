var app=function(){"use strict";function t(){}const e=t=>t;function n(t,e){for(const n in e)t[n]=e[n];return t}function r(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(r)}function l(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function a(t){let e;return c(t,t=>e=t)(),e}function u(t,e,n){t.$$.on_destroy.push(c(e,n))}function d(t,e,n=e){return t.set(n),e}const f=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),p="undefined"!=typeof window;let m=p?()=>window.performance.now():()=>Date.now(),h=p?t=>requestAnimationFrame(t):t;const g=new Set;function $(t){g.forEach(e=>{e.c(t)||(g.delete(e),e.f())}),0!==g.size&&h($)}function v(t){let e;return 0===g.size&&h($),{promise:new Promise(n=>{g.add(e={c:t,f:n})}),abort(){g.delete(e)}}}function b(t,e){t.appendChild(e)}function y(t,e,n){t.insertBefore(e,n||null)}function x(t){t.parentNode.removeChild(t)}function w(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function k(t){return document.createElement(t)}function C(t){return document.createTextNode(t)}function _(){return C(" ")}function N(){return C("")}function A(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function S(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function E(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function T(t,e){t.value=null==e?"":e}function O(t,e,n){t.classList[n?"add":"remove"](e)}const P=new Set;let L,j=0;function M(t,e,n,r,o,s,l,i=0){const c=16.666/r;let a="{\n";for(let t=0;t<=1;t+=c){const r=e+(n-e)*s(t);a+=100*t+`%{${l(r,1-r)}}\n`}const u=a+`100% {${l(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${i}`,f=t.ownerDocument;P.add(f);const p=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(k("style")).sheet),m=f.__svelte_rules||(f.__svelte_rules={});m[d]||(m[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?h+", ":""}${d} ${r}ms linear ${o}ms 1 both`,j+=1,d}function F(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-r.length;o&&(t.style.animation=r.join(", "),j-=o,j||h(()=>{j||(P.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),P.clear())}))}function z(t){L=t}function D(t){(function(){if(!L)throw new Error("Function called outside component initialization");return L})().$$.on_mount.push(t)}const B=[],H=[],q=[],I=[],R=Promise.resolve();let J=!1;function W(t){q.push(t)}let G=!1;const Z=new Set;function V(){if(!G){G=!0;do{for(let t=0;t<B.length;t+=1){const e=B[t];z(e),X(e.$$)}for(z(null),B.length=0;H.length;)H.pop()();for(let t=0;t<q.length;t+=1){const e=q[t];Z.has(e)||(Z.add(e),e())}q.length=0}while(B.length);for(;I.length;)I.pop()();J=!1,G=!1,Z.clear()}}function X(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(W)}}let K;function Q(){return K||(K=Promise.resolve(),K.then(()=>{K=null})),K}function U(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const Y=new Set;let tt;function et(){tt={r:0,c:[],p:tt}}function nt(){tt.r||s(tt.c),tt=tt.p}function rt(t,e){t&&t.i&&(Y.delete(t),t.i(e))}function ot(t,e,n,r){if(t&&t.o){if(Y.has(t))return;Y.add(t),tt.c.push(()=>{Y.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const st={duration:0};function lt(n,r,o){let s,i,c=r(n,o),a=!1,u=0;function d(){s&&F(n,s)}function f(){const{delay:r=0,duration:o=300,easing:l=e,tick:f=t,css:p}=c||st;p&&(s=M(n,0,1,o,r,l,p,u++)),f(0,1);const h=m()+r,g=h+o;i&&i.abort(),a=!0,W(()=>U(n,!0,"start")),i=v(t=>{if(a){if(t>=g)return f(1,0),U(n,!0,"end"),d(),a=!1;if(t>=h){const e=l((t-h)/o);f(e,1-e)}}return a})}let p=!1;return{start(){p||(F(n),l(c)?(c=c(),Q().then(f)):f())},invalidate(){p=!1},end(){a&&(d(),a=!1)}}}function it(n,r,o){let i,c=r(n,o),a=!0;const u=tt;function d(){const{delay:r=0,duration:o=300,easing:l=e,tick:d=t,css:f}=c||st;f&&(i=M(n,1,0,o,r,l,f));const p=m()+r,h=p+o;W(()=>U(n,!1,"start")),v(t=>{if(a){if(t>=h)return d(0,1),U(n,!1,"end"),--u.r||s(u.c),!1;if(t>=p){const e=l((t-p)/o);d(1-e,e)}}return a})}return u.r+=1,l(c)?Q().then(()=>{c=c(),d()}):d(),{end(t){t&&c.tick&&c.tick(1,0),a&&(i&&F(n,i),a=!1)}}}function ct(n,r,o,i){let c=r(n,o),a=i?0:1,u=null,d=null,f=null;function p(){f&&F(n,f)}function h(t,e){const n=t.b-a;return e*=Math.abs(n),{a:a,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function g(r){const{delay:o=0,duration:l=300,easing:i=e,tick:g=t,css:$}=c||st,b={start:m()+o,b:r};r||(b.group=tt,tt.r+=1),u||d?d=b:($&&(p(),f=M(n,a,r,l,o,i,$)),r&&g(0,1),u=h(b,l),W(()=>U(n,r,"start")),v(t=>{if(d&&t>d.start&&(u=h(d,l),d=null,U(n,u.b,"start"),$&&(p(),f=M(n,a,u.b,u.duration,0,i,c.css))),u)if(t>=u.end)g(a=u.b,1-a),U(n,u.b,"end"),d||(u.b?p():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;a=u.a+u.d*i(e/u.duration),g(a,1-a)}return!(!u&&!d)}))}return{run(t){l(c)?Q().then(()=>{c=c(),g(t)}):g(t)},end(){p(),u=d=null}}}function at(t){t&&t.c()}function ut(t,e,n){const{fragment:o,on_mount:i,on_destroy:c,after_update:a}=t.$$;o&&o.m(e,n),W(()=>{const e=i.map(r).filter(l);c?c.push(...e):s(e),t.$$.on_mount=[]}),a.forEach(W)}function dt(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ft(t,e){-1===t.$$.dirty[0]&&(B.push(t),J||(J=!0,R.then(V)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function pt(e,n,r,l,i,c,a=[-1]){const u=L;z(e);const d=n.props||{},f=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:a,skip_bound:!1};let p=!1;if(f.ctx=r?r(e,d,(t,n,...r)=>{const o=r.length?r[0]:n;return f.ctx&&i(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),p&&ft(e,t)),n}):[],f.update(),p=!0,s(f.before_update),f.fragment=!!l&&l(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(x)}else f.fragment&&f.fragment.c();n.intro&&rt(e.$$.fragment),ut(e,n.target,n.anchor),V()}z(u)}class mt{$destroy(){dt(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function ht(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}function gt(t){const e=t-1;return e*e*e+1}function $t(t,{delay:e=0,duration:n=400,easing:r=ht,amount:o=5,opacity:s=0}){const l=getComputedStyle(t),i=+l.opacity,c="none"===l.filter?"":l.filter,a=i*(1-s);return{delay:e,duration:n,easing:r,css:(t,e)=>`opacity: ${i-a*e}; filter: ${c} blur(${e*o}px);`}}function vt(t,{delay:n=0,duration:r=400,easing:o=e}){const s=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:o,css:t=>"opacity: "+t*s}}function bt(t,{delay:e=0,duration:n=400,easing:r=gt}){const o=getComputedStyle(t),s=+o.opacity,l=parseFloat(o.height),i=parseFloat(o.paddingTop),c=parseFloat(o.paddingBottom),a=parseFloat(o.marginTop),u=parseFloat(o.marginBottom),d=parseFloat(o.borderTopWidth),f=parseFloat(o.borderBottomWidth);return{delay:e,duration:n,easing:r,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*s};height: ${t*l}px;padding-top: ${t*i}px;padding-bottom: ${t*c}px;margin-top: ${t*a}px;margin-bottom: ${t*u}px;border-top-width: ${t*d}px;border-bottom-width: ${t*f}px;`}}const yt=[];function xt(e,n=t){let r;const o=[];function s(t){if(i(e,t)&&(e=t,r)){const t=!yt.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),yt.push(n,e)}if(t){for(let t=0;t<yt.length;t+=2)yt[t][0](yt[t+1]);yt.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(l,i=t){const c=[l,i];return o.push(c),1===o.length&&(r=n(s)||t),l(e),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}function wt(t,e){const n=xt(e),{set:r,subscribe:o}=n,s=localStorage.getItem(t);return s?r(JSON.parse(s)):localStorage.setItem(t,JSON.stringify(e)),{set(e){localStorage.setItem(t,JSON.stringify(e)),r(e)},update(t){this.set(t(a(n)))},subscribe:o}}const kt={buffer:0,value:100},Ct=[],_t=[],Nt=void 0,At="white",St={buffer:0,value:0},Et=xt([]),Tt=xt(kt),Ot=wt("leaderboard",{highScores:{},highTotals:{},local:{highScore:{},highTotal:{}}}),Pt=xt(Ct),Lt=xt(_t),jt=wt("moves",""),Mt=wt("options",{playerName:"",seedground:!0,shadows:!0,transitions:!0}),Ft=xt(!0),zt=xt("init"),Dt=xt(Nt),Bt=xt(At),Ht=xt(St),qt=wt("timestamp",Date.now()),It=wt("touch",Date.now()),Rt=function(e,n,r){const o=!Array.isArray(e),i=o?[e]:e,a=n.length<2;return{subscribe:xt(r,e=>{let r=!1;const u=[];let d=0,f=t;const p=()=>{if(d)return;f();const r=n(o?u[0]:u,e);a?e(r):f=l(r)?r:t},m=i.map((t,e)=>c(t,t=>{u[e]=t,d&=~(1<<e),r&&p()},()=>{d|=1<<e}));return r=!0,p(),function(){s(m),f()}}).subscribe}}([qt,Mt],([t,{playerName:e}])=>{if("number"!=typeof t||"string"!=typeof e||""===e)return;const{MAX_SAFE_INTEGER:n}=Number;return[t,...[...e].map(t=>t.charCodeAt())].reduce((t,e)=>{const r=Number(`${t}${e}`);return r>n?r%n:r})});function Jt(t){qt.set(Date.now()),t-- >0&&requestAnimationFrame(()=>Jt(t))}function Wt(t=!1,e=12){Tt.set(kt),Pt.set(Ct),Lt.set(_t),jt.set(""),Ft.set(t),zt.set("idle"),Dt.set(Nt),Bt.set(At),Ht.set(St),Jt(a(Mt).transitions?e:0)}function Gt(t=0){return(16807*t+19487171)%2147483647}function Zt(t){return[...atob(t)].map(t=>t.charCodeAt())}function Vt(e){let n,r,o,s,l,i,c,a,u;return{c(){n=k("div"),r=k("div"),o=k("div"),s=C(e[4]),i=_(),c=k("div"),a=C(e[5]),S(o,"class",l="current color-"+e[4]),S(c,"class",u="next color-"+e[5]),S(r,"class","value"),S(n,"class","card"),S(n,"style",e[6]),S(n,"data-index",e[1]),O(n,"clickable",e[0]),O(n,"plused",e[3]),O(n,"matched",e[2])},m(t,e){y(t,n,e),b(n,r),b(r,o),b(o,s),b(r,i),b(r,c),b(c,a)},p(t,[e]){16&e&&E(s,t[4]),16&e&&l!==(l="current color-"+t[4])&&S(o,"class",l),32&e&&E(a,t[5]),32&e&&u!==(u="next color-"+t[5])&&S(c,"class",u),64&e&&S(n,"style",t[6]),2&e&&S(n,"data-index",t[1]),1&e&&O(n,"clickable",t[0]),8&e&&O(n,"plused",t[3]),4&e&&O(n,"matched",t[2])},i:t,o:t,d(t){t&&x(n)}}}function Xt(t,e,n){let r,o,{clickable:s}=e,{duration:l}=e,{fallPhase:i}=e,{index:c}=e,{matched:a}=e,{plused:u}=e,{value:d}=e,{x:f=0}=e,{y:p=0}=e;return t.$$set=t=>{"clickable"in t&&n(0,s=t.clickable),"duration"in t&&n(7,l=t.duration),"fallPhase"in t&&n(8,i=t.fallPhase),"index"in t&&n(1,c=t.index),"matched"in t&&n(2,a=t.matched),"plused"in t&&n(3,u=t.plused),"value"in t&&n(4,d=t.value),"x"in t&&n(9,f=t.x),"y"in t&&n(10,p=t.y)},t.$$.update=()=>{16&t.$$.dirty&&n(5,r=d<9?d+1:0),1920&t.$$.dirty&&n(6,o=`\n    bottom: ${21*p}rem;\n    left: ${21*f}rem;\n    transition-duration: ${i?l:0}ms;\n  `)},[s,c,a,u,d,r,o,l,i,f,p]}class Kt extends mt{constructor(t){super(),pt(this,t,Xt,Vt,i,{clickable:0,duration:7,fallPhase:8,index:1,matched:2,plused:3,value:4,x:9,y:10})}}function Qt(t,e,n){const r=t.slice();return r[9]=e[n],r[11]=n,r}function Ut(t){let e,r;const o=[{clickable:"idle"===t[0]&&!t[1]},{fallPhase:"fall"===t[0]},{matched:t[3].includes(t[11])},{plused:t[1]===t[11]},t[9],{index:t[11]}];let s={};for(let t=0;t<o.length;t+=1)s=n(s,o[t]);return e=new Kt({props:s}),{c(){at(e.$$.fragment)},m(t,n){ut(e,t,n),r=!0},p(t,n){const r=15&n?function(t,e){const n={},r={},o={$$scope:1};let s=t.length;for(;s--;){const l=t[s],i=e[s];if(i){for(const t in l)t in i||(r[t]=1);for(const t in i)o[t]||(n[t]=i[t],o[t]=1);t[s]=i}else for(const t in l)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(o,[3&n&&{clickable:"idle"===t[0]&&!t[1]},1&n&&{fallPhase:"fall"===t[0]},8&n&&{matched:t[3].includes(t[11])},2&n&&{plused:t[1]===t[11]},4&n&&(s=t[9],"object"==typeof s&&null!==s?s:{}),o[5]]):{};var s;e.$set(r)},i(t){r||(rt(e.$$.fragment,t),r=!0)},o(t){ot(e.$$.fragment,t),r=!1},d(t){dt(e,t)}}}function Yt(t){let e,n,r,o,s=t[2],l=[];for(let e=0;e<s.length;e+=1)l[e]=Ut(Qt(t,s,e));const i=t=>ot(l[t],1,1,()=>{l[t]=null});return{c(){e=k("div");for(let t=0;t<l.length;t+=1)l[t].c();S(e,"class","board"),O(e,"overflow-hidden","idle"!==t[0])},m(s,i){y(s,e,i);for(let t=0;t<l.length;t+=1)l[t].m(e,null);n=!0,r||(o=A(e,"click",t[4]),r=!0)},p(t,[n]){if(15&n){let r;for(s=t[2],r=0;r<s.length;r+=1){const o=Qt(t,s,r);l[r]?(l[r].p(o,n),rt(l[r],1)):(l[r]=Ut(o),l[r].c(),rt(l[r],1),l[r].m(e,null))}for(et(),r=s.length;r<l.length;r+=1)i(r);nt()}1&n&&O(e,"overflow-hidden","idle"!==t[0])},i(t){if(!n){for(let t=0;t<s.length;t+=1)rt(l[t]);n=!0}},o(t){l=l.filter(Boolean);for(let t=0;t<l.length;t+=1)ot(l[t]);n=!1},d(t){t&&x(e),w(l,t),r=!1,o()}}}function te(t,e,n){let r,o,s,l,i,c,a;u(t,zt,t=>n(0,r=t)),u(t,Dt,t=>n(1,o=t)),u(t,jt,t=>n(5,s=t)),u(t,Tt,t=>n(6,l=t)),u(t,Mt,t=>n(7,i=t)),u(t,Et,t=>n(2,c=t)),u(t,Lt,t=>n(3,a=t));const f=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?f(e):void 0;return[r,o,c,a,({target:t})=>{var e;if("idle"===r&&void 0===o&&(d(Dt,o=Number(f(t)),o),!Number.isNaN(o))){const t=Array.isArray(s)?s:Zt(s);d(jt,(e=t.concat(o),s=btoa(String.fromCodePoint(...e))),s),d(Tt,l={...l,buffer:-10},l),i.transitions?setTimeout(()=>d(zt,r="plus",r),400):d(zt,r="plus",r)}}]}class ee extends mt{constructor(t){super(),pt(this,t,te,Yt,i,{})}}function ne(e){let n,r,o,s,l,i,c,a,u=e[0].value+"",d=e[0].value+"";return{c(){n=k("div"),r=k("div"),o=k("span"),s=C(u),l=_(),i=k("div"),c=k("span"),a=C(d),S(o,"class","left-value"),S(o,"style",e[2]),S(r,"class","left-bar"),S(r,"style",e[1]),S(c,"class","right-value"),S(c,"style",e[4]),S(i,"class","right-bar"),S(i,"style",e[3]),S(n,"class","energy")},m(t,e){y(t,n,e),b(n,r),b(r,o),b(o,s),b(n,l),b(n,i),b(i,c),b(c,a)},p(t,[e]){1&e&&u!==(u=t[0].value+"")&&E(s,u),4&e&&S(o,"style",t[2]),2&e&&S(r,"style",t[1]),1&e&&d!==(d=t[0].value+"")&&E(a,d),16&e&&S(c,"style",t[4]),8&e&&S(i,"style",t[3])},i:t,o:t,d(t){t&&x(n)}}}function re(t,e,n){let r,o,s,l,i,c,a,d;return u(t,Tt,t=>n(0,r=t)),u(t,Bt,t=>n(7,o=t)),t.$$.update=()=>{1&t.$$.dirty&&n(5,s=r.value),32&t.$$.dirty&&n(6,l=s>100),96&t.$$.dirty&&n(1,i=`flex: ${(l?200-s:s)/100}; z-index: ${l?0:1}`),64&t.$$.dirty&&n(2,c="position: "+(l?"absolute":"relative")),224&t.$$.dirty&&n(3,a=`background-color: ${l?o:"var(--color-dark)"}; flex: ${l?(s-100)/100:0}; z-index: ${l?1:0}`),96&t.$$.dirty&&n(4,d=`left: ${l?`calc(${s>119?0:(s-120)/100} * 128rem)`:0}; position: ${l?"relative":"absolute"}`)},[r,i,c,a,d]}class oe extends mt{constructor(t){super(),pt(this,t,re,ne,i,{})}}function se(t,e,n){const r=t.slice();return r[10]=e[n][0],r[11]=e[n][1],r[13]=n,r}function le(t,e,n){const r=t.slice();return r[5]=e[n].extra,r[6]=e[n].sum,r[7]=function(t,e){const n={};for(const r in t)f(t,r)&&-1===e.indexOf(r)&&(n[r]=t[r]);return n}(e[n],["extra","sum"]),r[9]=n,r}function ie(t){let e,n,r,o="score"!==t[2]&&ce(t),s=("total"===t[2]||"score"===t[2])&&me(t);return{c(){e=k("ol"),o&&o.c(),n=_(),s&&s.c(),S(e,"class","log")},m(t,l){y(t,e,l),o&&o.m(e,null),b(e,n),s&&s.m(e,null),r=!0},p(t,r){"score"!==t[2]?o?(o.p(t,r),4&r&&rt(o,1)):(o=ce(t),o.c(),rt(o,1),o.m(e,n)):o&&(et(),ot(o,1,1,()=>{o=null}),nt()),"total"===t[2]||"score"===t[2]?s?(s.p(t,r),4&r&&rt(s,1)):(s=me(t),s.c(),rt(s,1),s.m(e,null)):s&&(et(),ot(s,1,1,()=>{s=null}),nt())},i(t){r||(rt(o),rt(s),r=!0)},o(t){ot(o),ot(s),r=!1},d(t){t&&x(e),o&&o.d(),s&&s.d()}}}function ce(t){let e,n,r=t[1],o=[];for(let e=0;e<r.length;e+=1)o[e]=pe(le(t,r,e));const s=t=>ot(o[t],1,1,()=>{o[t]=null});return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=N()},m(t,r){for(let e=0;e<o.length;e+=1)o[e].m(t,r);y(t,e,r),n=!0},p(t,n){if(10&n){let l;for(r=t[1],l=0;l<r.length;l+=1){const s=le(t,r,l);o[l]?(o[l].p(s,n),rt(o[l],1)):(o[l]=pe(s),o[l].c(),rt(o[l],1),o[l].m(e.parentNode,e))}for(et(),l=r.length;l<o.length;l+=1)s(l);nt()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)rt(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)ot(o[t]);n=!1},d(t){w(o,t),t&&x(e)}}}function ae(t){let e;return{c(){e=k("span"),e.textContent="+",S(e,"class","plus")},m(t,n){y(t,e,n)},d(t){t&&x(e)}}}function ue(t){let e,n,r,o,s,l=t[11]+"",i=t[13]<Object.keys(t[7]).length-1,c=i&&ae();return{c(){e=k("span"),n=C(l),o=_(),c&&c.c(),s=N(),S(e,"class",r="value color-"+t[10])},m(t,r){y(t,e,r),b(e,n),y(t,o,r),c&&c.m(t,r),y(t,s,r)},p(t,o){2&o&&l!==(l=t[11]+"")&&E(n,l),2&o&&r!==(r="value color-"+t[10])&&S(e,"class",r),2&o&&(i=t[13]<Object.keys(t[7]).length-1),i?c||(c=ae(),c.c(),c.m(s.parentNode,s)):c&&(c.d(1),c=null)},d(t){t&&x(e),t&&x(o),c&&c.d(t),t&&x(s)}}}function de(t){let e,n,r=(t[9]+1)*t[6]+"";return{c(){e=k("span"),n=C(r),S(e,"class","sum")},m(t,r){y(t,e,r),b(e,n)},p(t,e){2&e&&r!==(r=(t[9]+1)*t[6]+"")&&E(n,r)},d(t){t&&x(e)}}}function fe(t){let e,n,r,o,s,l,i=t[5]+"",c=(t[9]+1)*t[5]+"";return{c(){e=k("span"),n=C(i),o=_(),s=k("span"),l=C(c),S(e,"class","extra"),S(e,"style",r="color: "+t[3]),S(s,"class","sum")},m(t,r){y(t,e,r),b(e,n),y(t,o,r),y(t,s,r),b(s,l)},p(t,o){2&o&&i!==(i=t[5]+"")&&E(n,i),8&o&&r!==(r="color: "+t[3])&&S(e,"style",r),2&o&&c!==(c=(t[9]+1)*t[5]+"")&&E(l,c)},d(t){t&&x(e),t&&x(o),t&&x(s)}}}function pe(t){let e,n,r,o,s,l,i=Object.entries(t[7]),c=[];for(let e=0;e<i.length;e+=1)c[e]=ue(se(t,i,e));function a(t,e){return void 0!==t[5]?fe:de}let u=a(t),d=u(t);return{c(){e=k("li");for(let t=0;t<c.length;t+=1)c[t].c();n=_(),d.c(),r=_(),S(e,"class","combo")},m(t,o){y(t,e,o);for(let t=0;t<c.length;t+=1)c[t].m(e,null);b(e,n),d.m(e,null),b(e,r),l=!0},p(t,o){if(2&o){let r;for(i=Object.entries(t[7]),r=0;r<i.length;r+=1){const s=se(t,i,r);c[r]?c[r].p(s,o):(c[r]=ue(s),c[r].c(),c[r].m(e,n))}for(;r<c.length;r+=1)c[r].d(1);c.length=i.length}u===(u=a(t))&&d?d.p(t,o):(d.d(1),d=u(t),d&&(d.c(),d.m(e,r)))},i(t){l||(W(()=>{s&&s.end(1),o||(o=lt(e,bt,{duration:100})),o.start()}),l=!0)},o(t){o&&o.invalidate(),s=it(e,vt,{duration:200}),l=!1},d(t){t&&x(e),w(c,t),d.d(),t&&s&&s.end()}}}function me(t){let e,n,r,o,s,l,i,c=`${"score"===t[2]&&t[4].buffer>0?"+":""}${t[4].buffer}`,a="score"!==t[2]&&he(t);return{c(){e=k("li"),a&&a.c(),n=_(),r=k("span"),o=C(c),S(r,"class","sum"),O(e,"collapse",t[0])},m(t,s){y(t,e,s),a&&a.m(e,null),b(e,n),b(e,r),b(r,o),i=!0},p(r,s){"score"!==(t=r)[2]?a?(a.p(t,s),4&s&&rt(a,1)):(a=he(t),a.c(),rt(a,1),a.m(e,n)):a&&(et(),ot(a,1,1,()=>{a=null}),nt()),(!i||20&s)&&c!==(c=`${"score"===t[2]&&t[4].buffer>0?"+":""}${t[4].buffer}`)&&E(o,c),1&s&&O(e,"collapse",t[0])},i(n){i||(rt(a),W(()=>{l&&l.end(1),s||(s=lt(e,bt,{duration:t[0]?0:100})),s.start()}),i=!0)},o(t){ot(a),s&&s.invalidate(),l=it(e,vt,{duration:200}),i=!1},d(t){t&&x(e),a&&a.d(),t&&l&&l.end()}}}function he(t){let e,n,r,o,s=t[0]?"":"total:";return{c(){e=k("span"),n=C(s)},m(t,r){y(t,e,r),b(e,n),o=!0},p(t,e){(!o||1&e)&&s!==(s=t[0]?"":"total:")&&E(n,s)},i(t){o||(r&&r.end(1),o=!0)},o(t){r=it(e,vt,{duration:200}),o=!1},d(t){t&&x(e),t&&r&&r.end()}}}function ge(t){let e,n,r=t[1].length>0&&ie(t);return{c(){r&&r.c(),e=N()},m(t,o){r&&r.m(t,o),y(t,e,o),n=!0},p(t,[n]){t[1].length>0?r?(r.p(t,n),2&n&&rt(r,1)):(r=ie(t),r.c(),rt(r,1),r.m(e.parentNode,e)):r&&(et(),ot(r,1,1,()=>{r=null}),nt())},i(t){n||(rt(r),n=!0)},o(t){ot(r),n=!1},d(t){r&&r.d(t),t&&x(e)}}}function $e(t,e,n){let r,o,s,l,i;return u(t,Pt,t=>n(1,r=t)),u(t,zt,t=>n(2,o=t)),u(t,Bt,t=>n(3,s=t)),u(t,Ht,t=>n(4,l=t)),t.$$.update=()=>{2&t.$$.dirty&&n(0,i=1===r.length)},[i,r,o,s,l]}class ve extends mt{constructor(t){super(),pt(this,t,$e,ge,i,{})}}function be(e){let n,r,o,s,l,i,c,a,u,d;return{c(){n=k("span"),r=k("span"),o=C(e[0]),s=C(":"),l=_(),i=k("span"),c=C(e[2]),S(r,"class","mode"),O(r,"visible",e[1]),S(i,"class","value"),S(n,"class","score")},m(t,a){y(t,n,a),b(n,r),b(r,o),b(r,s),b(n,l),b(n,i),b(i,c),u||(d=A(n,"click",e[3]),u=!0)},p(t,e){1&e&&E(o,t[0]),2&e&&O(r,"visible",t[1]),4&e&&E(c,t[2])},i(t){a||W(()=>{a=lt(n,$t,{}),a.start()})},o:t,d(t){t&&x(n),u=!1,d()}}}function ye(e){let n,r=e[0],o=be(e);return{c(){o.c(),n=N()},m(t,e){o.m(t,e),y(t,n,e)},p(e,[s]){1&s&&i(r,r=e[0])?(et(),ot(o,1,1,t),nt(),o=be(e),o.c(),rt(o),o.m(n.parentNode,n)):o.p(e,s)},i(t){rt(o)},o(t){ot(o)},d(t){t&&x(n),o.d(t)}}}function xe(t,e,n){let r,o;u(t,Ht,t=>n(5,r=t)),u(t,Ot,t=>n(6,o=t));let s,l="score",i=!1;const c=()=>{n(0,l="score"),n(1,i=!1)};let a;return t.$$.update=()=>{97&t.$$.dirty&&n(2,a=(()=>{if("score"===l)return r.value;const{local:{highTotal:t={},highScore:e={}}={}}=o;return Object.keys("hi-score"===l?e:t)[0]||0})())},[l,i,a,()=>{n(0,l="score"===l?"hi-score":"hi-score"===l?"hi-total":"score"),n(1,i=!0),clearTimeout(s),s=setTimeout(c,3e3)}]}class we extends mt{constructor(t){super(),pt(this,t,xe,ye,i,{})}}function ke(t){let e,n,r,o,s,l,i,c,a,u,d,f,p,m,h,g,$;return s=new ve({}),c=new we({}),d=new ee({}),m=new oe({}),{c(){e=k("div"),n=k("button"),r=k("span"),r.textContent="digifall",o=_(),at(s.$$.fragment),l=_(),i=k("div"),at(c.$$.fragment),a=_(),u=k("div"),at(d.$$.fragment),f=_(),p=k("div"),at(m.$$.fragment),S(r,"class","big"),S(n,"class","digifall"),O(n,"screen",t[3].length>0),S(e,"class","section-1"),S(i,"class","section-2"),S(u,"class","section-3"),S(p,"class","section-4")},m(v,x){y(v,e,x),b(e,n),b(n,r),b(n,o),ut(s,n,null),y(v,l,x),y(v,i,x),ut(c,i,null),y(v,a,x),y(v,u,x),ut(d,u,null),y(v,f,x),y(v,p,x),ut(m,p,null),h=!0,g||($=A(n,"click",t[4]),g=!0)},p(t,e){8&e&&O(n,"screen",t[3].length>0)},i(t){h||(rt(s.$$.fragment,t),rt(c.$$.fragment,t),rt(d.$$.fragment,t),rt(m.$$.fragment,t),h=!0)},o(t){ot(s.$$.fragment,t),ot(c.$$.fragment,t),ot(d.$$.fragment,t),ot(m.$$.fragment,t),h=!1},d(t){t&&x(e),dt(s),t&&x(l),t&&x(i),dt(c),t&&x(a),t&&x(u),dt(d),t&&x(f),t&&x(p),dt(m),g=!1,$()}}}function Ce(t){let e,n,r,o,s,l=t[2]&&ke(t);return{c(){e=k("div"),n=k("div"),r=_(),o=k("div"),l&&l.c(),S(n,"class","seedground"),S(n,"style",t[1]),S(o,"class","content"),S(e,"class","game"),O(e,"blur",!0===t[0])},m(t,i){y(t,e,i),b(e,n),b(e,r),b(e,o),l&&l.m(o,null),s=!0},p(t,[r]){(!s||2&r)&&S(n,"style",t[1]),t[2]?l?(l.p(t,r),4&r&&rt(l,1)):(l=ke(t),l.c(),rt(l,1),l.m(o,null)):l&&(et(),ot(l,1,1,()=>{l=null}),nt()),1&r&&O(e,"blur",!0===t[0])},i(t){s||(rt(l),s=!0)},o(t){ot(l),s=!1},d(t){t&&x(e),l&&l.d()}}}function _e(t,e,n){let r,o,s,l;u(t,Ft,t=>n(0,r=t)),u(t,Rt,t=>n(2,o=t)),u(t,Mt,t=>n(5,s=t)),u(t,Pt,t=>n(3,l=t));let i;return t.$$.update=()=>{36&t.$$.dirty&&n(1,i=(()=>{if(!o||!s.seedground)return;let t=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],e=0,n=Gt(o),r=[];for(;++e<5;){const[e]=t.splice((n=Gt(n))%t.length,1);r=[...r,e]}const[l,i,c,a]=r,u=(t=12)=>`hsl(${n=Gt(n)%360},50%,${t}%)`;return`\n      background-color: ${u()};\n      background-image:\n        linear-gradient(90deg, ${u()} 50%, transparent 50%),\n        linear-gradient(90deg, ${u()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${u()} 50%),\n        linear-gradient(90deg, transparent 50%, ${u()} 50%);\n      background-size: ${l}rem, ${i}rem, ${c}rem, ${a}rem;`})())},[r,i,o,l,()=>d(Ft,r=!0,r)]}class Ne extends mt{constructor(t){super(),pt(this,t,_e,Ce,i,{})}}function Ae(t,e,n){const r=t.slice();return r[4]=e[n],r[6]=n,r}function Se(e){let n,r;return{c(){n=k("span"),n.textContent="game\n        over",S(n,"class","big")},m(t,e){y(t,n,e)},p(t,n){e=t},i(t){r||W(()=>{r=lt(n,$t,{delay:e[2].transitions?600:0}),r.start()})},o:t,d(t){t&&x(n)}}}function Ee(e){let n,r,o,s,l;return{c(){n=k("div"),r=k("button"),r.textContent="new game",S(n,"class","col")},m(t,o){y(t,n,o),b(n,r),s||(l=A(r,"click",e[3]),s=!0)},p(t,n){e=t},i(t){o||W(()=>{o=lt(n,$t,{delay:e[2].transitions?600:0}),o.start()})},o:t,d(t){t&&x(n),s=!1,l()}}}function Te(e){let n,r="ut of energy",o=[];for(let t=0;t<r.length;t+=1)o[t]=Oe(Ae(e,r,t));return{c(){n=k("span");for(let t=0;t<o.length;t+=1)o[t].c();S(n,"class","energy-out")},m(t,e){y(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},i(t){for(let t=0;t<r.length;t+=1)rt(o[t])},o:t,d(t){t&&x(n),w(o,t)}}}function Oe(e){let n,r,o,s;return{c(){n=k("span"),r=C(e[4]),o=_(),S(n,"class","letter")},m(t,e){y(t,n,e),b(n,r),b(n,o)},p(t,n){e=t},i(t){s||W(()=>{s=lt(n,bt,e[2].transitions?{delay:50*e[6],duration:200}:{delay:0,duration:0}),s.start()})},o:t,d(t){t&&x(n)}}}function Pe(t){let e,n,r,o,s,l,i,c,a,u,d,f,p,m=t[0]&&Se(t);s=new we({});let h=t[0]&&Ee(t);u=new oe({});let g=0===t[1].value&&Te(t);return{c(){e=k("div"),n=k("div"),m&&m.c(),r=_(),o=k("div"),at(s.$$.fragment),l=_(),i=k("div"),h&&h.c(),c=_(),a=k("div"),at(u.$$.fragment),d=_(),g&&g.c(),S(n,"class","section-1"),S(o,"class","section-2"),S(i,"class","section-3"),S(a,"class","section-4"),S(e,"class","game-over content")},m(t,f){y(t,e,f),b(e,n),m&&m.m(n,null),b(e,r),b(e,o),ut(s,o,null),b(e,l),b(e,i),h&&h.m(i,null),b(e,c),b(e,a),ut(u,a,null),b(a,d),g&&g.m(a,null),p=!0},p(e,[r]){(t=e)[0]?m?1&r&&rt(m,1):(m=Se(t),m.c(),rt(m,1),m.m(n,null)):m&&(m.d(1),m=null),t[0]?h?(h.p(t,r),1&r&&rt(h,1)):(h=Ee(t),h.c(),rt(h,1),h.m(i,null)):h&&(h.d(1),h=null),0===t[1].value?g?2&r&&rt(g,1):(g=Te(t),g.c(),rt(g,1),g.m(a,null)):g&&(g.d(1),g=null)},i(n){p||(rt(m),rt(s.$$.fragment,n),rt(h),rt(u.$$.fragment,n),rt(g),f||W(()=>{f=lt(e,$t,{delay:t[2].transitions?200:0}),f.start()}),p=!0)},o(t){ot(s.$$.fragment,t),ot(u.$$.fragment,t),p=!1},d(t){t&&x(e),m&&m.d(),dt(s),h&&h.d(),dt(u),g&&g.d()}}}function Le(t,e,n){let r,o;u(t,Tt,t=>n(1,r=t)),u(t,Mt,t=>n(2,o=t));let s;return t.$$.update=()=>{2&t.$$.dirty&&n(0,s=0===r.buffer&&0===r.value)},[s,r,o,()=>Wt()]}class je extends mt{constructor(t){super(),pt(this,t,Le,Pe,i,{})}}function Me(e){let n,r,o,l,i,c,a,u,d,f,p,m,h,g,$;return{c(){n=k("div"),r=k("div"),r.innerHTML='<span class="big">digifall</span>',o=_(),l=k("div"),i=_(),c=k("div"),a=k("div"),u=k("form"),d=k("input"),f=_(),p=k("button"),p.textContent="start",m=_(),h=k("div"),S(r,"class","section-1"),S(l,"class","section-2"),S(d,"type","text"),S(d,"placeholder","player name"),S(d,"maxlength","24"),S(p,"type","submit"),S(a,"class","col"),S(c,"class","section-3"),S(h,"class","section-4"),S(n,"class","content")},m(t,s){y(t,n,s),b(n,r),b(n,o),b(n,l),b(n,i),b(n,c),b(c,a),b(a,u),b(u,d),T(d,e[1]),b(u,f),b(u,p),b(n,m),b(n,h),g||($=[A(d,"input",e[14]),A(u,"submit",e[9])],g=!0)},p(t,e){2&e&&d.value!==t[1]&&T(d,t[1])},i:t,o:t,d(t){t&&x(n),g=!1,s($)}}}function Fe(e){let n,r,o,l,i,c,a,u,d,f,p,m,h,g,$,v,w,C,N,E,O,P,L,j,M,F,z;return{c(){n=k("div"),r=k("div"),r.innerHTML='<span class="big">options</span>',o=_(),l=k("div"),i=_(),c=k("div"),a=k("div"),u=k("input"),d=_(),f=k("input"),p=_(),m=k("label"),m.textContent="shadows",h=_(),g=k("input"),$=_(),v=k("label"),v.textContent="seedground",w=_(),C=k("input"),N=_(),E=k("label"),E.textContent="transitions",O=_(),P=k("button"),P.textContent="back",L=_(),j=k("div"),S(r,"class","section-1"),S(l,"class","section-2"),S(u,"type","text"),S(u,"placeholder","player name"),S(u,"maxlength","24"),S(f,"type","checkbox"),S(f,"id","shadows"),S(m,"for","shadows"),S(g,"type","checkbox"),S(g,"id","seedground"),S(v,"for","seedground"),S(C,"type","checkbox"),S(C,"id","transitions"),S(E,"for","transitions"),S(a,"class","col"),S(c,"class","section-3"),S(j,"class","section-4"),S(n,"class","content compact")},m(t,s){y(t,n,s),b(n,r),b(n,o),b(n,l),b(n,i),b(n,c),b(c,a),b(a,u),T(u,e[1]),b(a,d),b(a,f),f.checked=e[2].shadows,b(a,p),b(a,m),b(a,h),b(a,g),g.checked=e[2].seedground,b(a,$),b(a,v),b(a,w),b(a,C),C.checked=e[2].transitions,b(a,N),b(a,E),b(a,O),b(a,P),b(n,L),b(n,j),F||(z=[A(u,"input",e[10]),A(f,"change",e[11]),A(g,"change",e[12]),A(C,"change",e[13]),A(P,"click",e[8])],F=!0)},p(t,n){e=t,2&n&&u.value!==e[1]&&T(u,e[1]),4&n&&(f.checked=e[2].shadows),4&n&&(g.checked=e[2].seedground),4&n&&(C.checked=e[2].transitions)},i(t){M||W(()=>{M=lt(n,$t,{duration:e[2].transitions?400:0}),M.start()})},o:t,d(t){t&&x(n),F=!1,s(z)}}}function ze(e){let n,r,o,l,i,c,a,u,d,f,p,m,h,g,$;return{c(){n=k("div"),r=k("div"),r.innerHTML="<span>start a new game?</span>",o=_(),l=k("div"),i=_(),c=k("div"),a=k("div"),u=k("button"),u.textContent="yes",d=_(),f=k("button"),f.textContent="no",p=_(),m=k("div"),S(r,"class","section-1"),S(l,"class","section-2"),S(a,"class","row"),S(c,"class","section-3"),S(m,"class","section-4"),S(n,"class","content")},m(t,s){y(t,n,s),b(n,r),b(n,o),b(n,l),b(n,i),b(n,c),b(c,a),b(a,u),b(a,d),b(a,f),b(n,p),b(n,m),g||($=[A(u,"click",e[7]),A(f,"click",e[6])],g=!0)},p(t,n){e=t},i(t){h||W(()=>{h=lt(n,$t,{duration:e[2].transitions?400:0}),h.start()})},o:t,d(t){t&&x(n),g=!1,s($)}}}function De(e){let n,r,o,l,i,c,a,u,d,f,p,m,h,g,$,v,w;return{c(){n=k("div"),r=k("div"),r.innerHTML='<span class="big">digifall</span>',o=_(),l=k("div"),i=_(),c=k("div"),a=k("div"),u=k("button"),u.textContent="resume",d=_(),f=k("button"),f.textContent="new game",p=_(),m=k("button"),m.textContent="options",h=_(),g=k("div"),S(r,"class","section-1"),S(l,"class","section-2"),S(a,"class","col"),S(c,"class","section-3"),S(g,"class","section-4"),S(n,"class","content")},m(t,s){y(t,n,s),b(n,r),b(n,o),b(n,l),b(n,i),b(n,c),b(c,a),b(a,u),b(a,d),b(a,f),b(a,p),b(a,m),b(n,h),b(n,g),v||(w=[A(u,"click",e[3]),A(f,"click",e[4]),A(m,"click",e[5])],v=!0)},p(t,n){e=t},i(t){$||W(()=>{$=lt(n,$t,{duration:e[2].transitions?400:0}),$.start()})},o:t,d(t){t&&x(n),v=!1,s(w)}}}function Be(e){let n;function r(t,e){return"main"===t[0]?De:"new game"===t[0]?ze:"options"===t[0]?Fe:"name"===t[0]?Me:void 0}let o=r(e),s=o&&o(e);return{c(){s&&s.c(),n=N()},m(t,e){s&&s.m(t,e),y(t,n,e)},p(t,[e]){o===(o=r(t))&&s?s.p(t,e):(s&&s.d(1),s=o&&o(t),s&&(s.c(),rt(s,1),s.m(n.parentNode,n)))},i(t){rt(s)},o:t,d(t){s&&s.d(t),t&&x(n)}}}function He(t,e,n){let r,o;u(t,Mt,t=>n(2,r=t)),u(t,Ft,t=>n(15,o=t));let s="main",l=r.playerName;return t.$$.update=()=>{3&t.$$.dirty&&(""===l&&"main"===s?(n(0,s="name"),Wt(!0)):n(1,l=l.toLowerCase().replace(/[^a-z0-9\@\&\$\!\_\?\.\-\+\=]/g,""))),4&t.$$.dirty&&((t=!0)=>{const{style:e}=document.documentElement,n="none";e.setProperty("--shadow-0",t?"0 0 1px black":n),e.setProperty("--shadow-1",t?"0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white":n),e.setProperty("--shadow-2",t?"0 1rem 1rem var(--color-black-04), 0 -1px 0 white":n),e.setProperty("--shadow-3",t?"0 0 3rem 2rem var(--color-black-04)":"0 0 0 transparent"),e.setProperty("--shadow-inset-1",t?"inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white":n),e.setProperty("--shadow-inset-2",t?"inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white":n)})(r.shadows)},[s,l,r,()=>d(Ft,o=!1,o),()=>n(0,s="new game"),()=>n(0,s="options"),()=>n(0,s="main"),()=>Wt(),()=>{n(0,s="main"),r.playerName!==l&&(d(Mt,r.playerName=l,r),Wt())},t=>{t.preventDefault(),l&&(n(0,s="main"),d(Mt,r.playerName=l,r),Wt())},function(){l=this.value,n(1,l),n(0,s)},function(){r.shadows=this.checked,Mt.set(r)},function(){r.seedground=this.checked,Mt.set(r)},function(){r.transitions=this.checked,Mt.set(r)},function(){l=this.value,n(1,l),n(0,s)}]}class qe extends mt{constructor(t){super(),pt(this,t,He,Be,i,{})}}function Ie(t){let e,n,r,o,s;const l=[Je,Re],i=[];function c(t,e){return"gameover"===t[2]?0:1}return n=c(t),r=i[n]=l[n](t),{c(){e=k("div"),r.c(),S(e,"class","overlay")},m(t,r){y(t,e,r),i[n].m(e,null),s=!0},p(o,s){let a=n;n=c(t=o),n!==a&&(et(),ot(i[a],1,1,()=>{i[a]=null}),nt(),r=i[n],r||(r=i[n]=l[n](t),r.c()),rt(r,1),r.m(e,null))},i(n){s||(rt(r),W(()=>{o||(o=ct(e,vt,{duration:t[1].transitions?200:0},!0)),o.run(1)}),s=!0)},o(n){ot(r),o||(o=ct(e,vt,{duration:t[1].transitions?200:0},!1)),o.run(0),s=!1},d(t){t&&x(e),i[n].d(),t&&o&&o.end()}}}function Re(t){let e,n,r,o;return r=new qe({}),{c(){e=k("a"),e.innerHTML='<svg viewBox="0 0 250 250" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path class="octo-arm" d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor"></path><path class="octo-body" d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path></svg>',n=_(),at(r.$$.fragment),S(e,"href","https://github.com/shlavik/digifall"),S(e,"class","github-corner"),S(e,"aria-label","View source on GitHub")},m(t,s){y(t,e,s),y(t,n,s),ut(r,t,s),o=!0},i(t){o||(rt(r.$$.fragment,t),o=!0)},o(t){ot(r.$$.fragment,t),o=!1},d(t){t&&x(e),t&&x(n),dt(r,t)}}}function Je(t){let e,n;return e=new je({}),{c(){at(e.$$.fragment)},m(t,r){ut(e,t,r),n=!0},i(t){n||(rt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){dt(e,t)}}}function We(t){let e,n,r,o;n=new Ne({});let s=t[0]&&Ie(t);return{c(){e=k("div"),at(n.$$.fragment),r=_(),s&&s.c(),S(e,"class","app")},m(t,l){y(t,e,l),ut(n,e,null),b(e,r),s&&s.m(e,null),o=!0},p(t,[n]){t[0]?s?(s.p(t,n),1&n&&rt(s,1)):(s=Ie(t),s.c(),rt(s,1),s.m(e,null)):s&&(et(),ot(s,1,1,()=>{s=null}),nt())},i(t){o||(rt(n.$$.fragment,t),rt(s),o=!0)},o(t){ot(n.$$.fragment,t),ot(s),o=!1},d(t){t&&x(e),dt(n),s&&s.d()}}}function Ge(t,e,n){let r,o,s,l;u(t,It,t=>n(4,r=t)),u(t,Ft,t=>n(0,o=t)),u(t,Mt,t=>n(1,s=t)),u(t,zt,t=>n(2,l=t));let i=r;D(()=>{i=Date.now(),d(It,r=i,r)}),document.addEventListener("visibilitychange",()=>{if(document.hidden)i=Date.now(),d(It,r=i,r);else{const t=Number(localStorage.getItem("touch"));i<t&&(document.location=document.location)}});const c=()=>{const{style:t,offsetHeight:e,offsetWidth:n}=document.documentElement;e/n>1.5?t.setProperty("--pixel",n/128+"px"):t.setProperty("--pixel",e/192+"px")};return c(),onresize=c,t.$$.update=()=>{1&t.$$.dirty&&document.documentElement.style.setProperty("--color-octo",o?"white":"var(--color-base)")},[o,s,l]}const{abs:Ze,floor:Ve,random:Xe,sign:Ke,sqrt:Qe,trunc:Ue}=Math;let Ye,tn,en=0;function nn(t,e){void 0===tn&&a(Mt).transitions?setTimeout(t,e):t()}function rn(t){const e=[Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e}function on(t){const{transitions:e}=a(Mt),n=[],r=rn(t);for(let o in r){let s=0;for(let l in r[o]){const i=r[o][l];if(void 0!==i){const r=t[i];n[i]={x:r.x,y:l-s,value:r.value,duration:void 0===tn&&e?100*Qe(2*s):0}}else++s}}return n}function sn(t){const e=rn(t);let n=[],r=0;const o=s=>{const{value:l,x:i,y:c}=t[s];if(n[s])return;let a,u,d,f;n[s]={value:l,group:r},c<5&&(a=e[i][c+1]),i<5&&(u=e[i+1][c]),c>0&&(d=e[i][c-1]),i>0&&(f=e[i-1][c]);const p=e=>void 0!==e&&t[e].value===l;p(a)&&o(a),p(u)&&o(u),p(d)&&o(d),p(f)&&o(f)};for(let e in t)++r,o(e);const s=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(s).reduce((t,e)=>{const{value:n,indexes:r}=s[e];return n===r.length?[...t,...r]:t},[])}function ln(t,e){const n=[0,0,0,0,0,0];return t.map((r,o)=>{return e.includes(o)&&r.y<6?(++n[r.x],{x:r.x,y:(s=r.x,n[s]+t.filter(t=>t.x===s).sort(({y:t},{y:e})=>t-e)[5].y),value:Ye(r.x),duration:0}):r;var s})}function cn(t="highScore",e){const n=a(Ot),{local:{highScore:r={},highTotal:o={}}={}}=n;e<(Object.keys("highScore"===t?r:o)[0]||0)||Ot.set({...n,local:{...n.local,[t]:{[e]:{moves:a(jt),playerName:a(Mt).playerName,timestamp:a(qt)}}}})}function an(){a(Tt).value>100||"score"!==a(zt)?(Bt.set(`hsl(${Ve(360*Xe())}, 100%, 50%)`),requestAnimationFrame(an)):Bt.set("white")}function un(t){return Ke(t)*Ue(Qe(Ze(t)))}function dn(){setTimeout(()=>zt.set("idle"))}function fn(){void 0===tn?cn("highScore",a(Ht).value):en<tn.length?(Dt.set(tn[en++]),Tt.update(({buffer:t,value:e})=>({buffer:t,value:e-10})),zt.set("plus")):tn=void 0}function pn(){Et.update(t=>function(t,e){return t.map((t,n)=>e===n&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t)}(t,a(Dt))),Dt.set(void 0),zt.set("blink")}function mn(){const t=a(Et);let e=sn(t);Lt.set(e);const{value:n}=a(Tt);if(e.length>0){Pt.update(n=>n.concat(e.reduce((e,n)=>{const{value:r}=t[n];return e[r]=(e[r]||0)+r,e.sum=(e.sum||0)+r,e},{})));const r=e.reduce((e,n)=>e+t[n].value,0);nn(()=>Tt.set({buffer:r,value:n}),400),nn(()=>zt.set("match"),800)}else n>100?zt.set("extra"):n<10?zt.set("gameover"):a(Pt).length>0?zt.set("total"):zt.set("idle")}function hn(){Et.update(t=>ln(t,a(Lt))),Lt.set([]),nn(()=>zt.set("fall"),400)}function gn(){Et.update(t=>on(t)),nn(()=>zt.set("blink"),400)}function $n(){Tt.update(({value:t})=>({buffer:100-t,value:t})),Pt.update(t=>t.concat({extra:0}))}function vn(){const t=a(Pt).reduce((t,{extra:e,sum:n},r)=>t+(r+1)*(n||e),0);cn("highTotal",t),Ht.update(({value:e})=>({buffer:t,value:e})),nn(()=>zt.set("score"),a(Pt).length>1?800:0)}function bn(){Ht.update(t=>({...t}))}function yn(t){Ft.set(!0),"gameover"===t&&nn(()=>{Tt.update(({value:t})=>({buffer:-t,value:t})),Ht.update(({value:t})=>({buffer:a(Tt).value,value:t}))},400)}function xn({buffer:t,value:e}){const n=a(zt);if("gameover"!==n&&"score"!==n)return;if(0===t)return void("gameover"!==n&&nn(()=>{Pt.set([]),zt.set("idle")},200));const r=void 0===tn&&a(Mt).transitions?"gameover"===n?Ke(t):un(t):t;nn(()=>{Ht.set({buffer:t-r,value:e+r})},"gameover"===n?200:function(t){switch(Ze(t)){case 1:return 130;case 2:case 3:return 80;case 4:case 5:case 6:return 50;case 7:case 8:case 9:case 10:case 11:return 30;default:return 20}}(r))}function wn(t){let e=function(t){let e=1,n=[Gt(t)];for(;e<6;)n=n.concat(Gt(++e*n[0]));return n}(t);return t=>{if(t<0||5<t)return;let n=e[t];return e[t]=Gt(n),Number(n%10)}}function kn(t){if(!t)return;Ye=wn(t),Et.set(function(t){let e=1;for(;e;){if(e=sn(t),0===e.length)return t;t=on(ln(t,e))}}(Array(36).fill(void 0).map((t,e)=>({x:Ve(e/6),y:e%6,value:Ye(Ve(e/6)),duration:0}))));const e=a(jt);if(!e)return;const n=Array.isArray(e)?e:Zt(e);n.length>0?(en=0,tn=n):tn=void 0}var Cn=new class extends mt{constructor(t){super(),pt(this,t,Ge,We,i,{})}}({target:document.body});return Tt.subscribe(t=>function({buffer:t,value:e}){"white"===a(Bt)&&an();const n=a(zt),r=void 0===tn&&a(Mt).transitions?"gameover"===n?Ke(t):un(t):t;if("extra"===n){if(0===t)return nn(()=>zt.set("total"),800);Pt.update(t=>{const[{extra:e}]=t.slice(-1);return t.slice(0,-1).concat({extra:e-r})})}0!==t&&nn(()=>{Tt.set({buffer:t-r,value:e+r})},"gameover"===n?200:20)}(t)),zt.subscribe(t=>function(t){Object({init:dn,idle:fn,plus:pn,blink:mn,match:hn,fall:gn,extra:$n,total:vn,score:bn,gameover:yn})[t](t)}(t)),Ht.subscribe(t=>xn(t)),Rt.subscribe(t=>kn(t)),Cn}();
//# sourceMappingURL=bundle.js.map
