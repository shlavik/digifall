var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function l(t){t.forEach(n)}function s(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(e,n,r){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(n,r))}function a(t,n,r,l){return t[1]&&l?e(r.ctx.slice(),t[1](l(n))):r.ctx}function i(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function g(){return m(" ")}function h(){return m("")}function $(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}function b(t,e,n){t.classList[n?"add":"remove"](e)}let y;function k(t){y=t}function w(t){(function(){if(!y)throw new Error("Function called outside component initialization");return y})().$$.on_mount.push(t)}const j=[],_=[],A=[],P=[],M=Promise.resolve();let N=!1;function E(t){A.push(t)}let q=!1;const C=new Set;function O(){if(!q){q=!0;do{for(let t=0;t<j.length;t+=1){const e=j[t];k(e),T(e.$$)}for(j.length=0;_.length;)_.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];C.has(e)||(C.add(e),e())}A.length=0}while(j.length);for(;P.length;)P.pop()();N=!1,q=!1,C.clear()}}function T(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const L=new Set;let z;function F(){z={r:0,c:[],p:z}}function H(){z.r||l(z.c),z=z.p}function S(t,e){t&&t.i&&(L.delete(t),t.i(e))}function B(t,e,n,r){if(t&&t.o){if(L.has(t))return;L.add(t),z.c.push(()=>{L.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function D(t){t&&t.c()}function I(t,e,r){const{fragment:o,on_mount:c,on_destroy:a,after_update:i}=t.$$;o&&o.m(e,r),E(()=>{const e=c.map(n).filter(s);a?a.push(...e):l(e),t.$$.on_mount=[]}),i.forEach(E)}function R(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function W(t,e){-1===t.$$.dirty[0]&&(j.push(t),N||(N=!0,M.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Z(e,n,s,o,c,a,i=[-1]){const u=y;k(e);const f=n.props||{},p=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:i};let m=!1;if(p.ctx=s?s(e,f,(t,n,...r)=>{const l=r.length?r[0]:n;return p.ctx&&c(p.ctx[t],p.ctx[t]=l)&&(p.bound[t]&&p.bound[t](l),m&&W(e,t)),n}):[],p.update(),m=!0,l(p.before_update),p.fragment=!!o&&o(p.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);p.fragment&&p.fragment.l(t),t.forEach(d)}else p.fragment&&p.fragment.c();n.intro&&S(e.$$.fragment),I(e,n.target,n.anchor),O()}k(u)}class G{$destroy(){R(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const J=[];function K(e,n=t){let r;const l=[];function s(t){if(o(e,t)&&(e=t,r)){const t=!J.length;for(let t=0;t<l.length;t+=1){const n=l[t];n[1](),J.push(n,e)}if(t){for(let t=0;t<J.length;t+=2)J[t][0](J[t+1]);J.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(o,c=t){const a=[o,c];return l.push(a),1===l.length&&(r=n(s)||t),o(e),()=>{const t=l.indexOf(a);-1!==t&&l.splice(t,1),0===l.length&&(r(),r=null)}}}}const Q=(t=0)=>(16807*t+19487171)%2147483647,U=(t=>{let e=(t=>{let e=1,n=[Q(t)];for(;e<6;)n=n.concat(Q(++e*n[0]));return n})(t);return t=>{if(t<0||5<t)return;let n=e[t];return e[t]=Q(n),Number(n%10)}})((V=Date.now(),(V=String(V).match(/[0-9A-Za-z]/g))?(V=V.length>192?V.slice(0,192):V,Number(parseInt(V.join(""),36))):0));var V;const X=t=>{const e=[Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill(),Array(12).fill()];return t.forEach((t,n)=>e[t.x][t.y]=n),e},Y=()=>(t=>{let e=1;for(;e;){if(e=et(t),!e.length)return t;t=tt(nt(t,e))}})(Array(36).fill(void 0).map((t,e)=>({x:Math.floor(e/6),y:e%6,value:U(Math.floor(e/6)),duration:0}))),tt=t=>{const e=[],n=X(t);for(let r in n){let l=0;for(let s in n[r]){const o=n[r][s];if(void 0!==o){const n=t[o];e[o]={x:n.x,y:s-l,value:n.value,duration:100*Math.sqrt(2*l)}}else++l}}return e},et=t=>{const e=X(t);let n=[],r=0;const l=s=>{const{value:o,x:c,y:a}=t[s];if(n[s])return;let i,u,d,f;n[s]={value:o,group:r},a<5&&(i=e[c][a+1]),c<5&&(u=e[c+1][a]),a>0&&(d=e[c][a-1]),c>0&&(f=e[c-1][a]);const p=e=>e&&t[e].value===o;p(i)&&l(i),p(u)&&l(u),p(d)&&l(d),p(f)&&l(f)};for(let e in t)++r,l(e);const s=n.reduce((t,{value:e,group:n},r)=>({...t,[n]:{value:e,indexes:[...t[n]?t[n].indexes:[],r]}}),{});return Object.keys(s).reduce((t,e)=>{const{value:n,indexes:r}=s[e];return n===r.length?[...t,...r]:t},[])},nt=(t,e)=>{let n=[0,0,0,0,0,0];return t.map((r,l)=>{return e.includes(l)&&r.y<6?(++n[r.x],{x:r.x,y:(s=r.x,n[s]+t.filter(t=>t.x===s).sort(({y:t},{y:e})=>t-e)[5].y),value:U(r.x),duration:0}):r;var s})},rt=K(Y()),lt=K(100),st=K([]),ot=K({shadow:!1}),ct=K(!0),at=K("idle"),it=K(0),ut=K(0),dt=()=>{rt.set(Y()),lt.set(100),st.set([]),ct.set(!1),at.set("idle"),it.set(0)};function ft(e){let n,r,l,s,o,c,a,f,h;return{c(){n=p("div"),r=p("div"),l=p("div"),s=m(e[4]),c=g(),a=p("div"),f=m(e[5]),v(l,"class",o="current color-"+e[4]+" svelte-1ejdu9y"),v(a,"class",h="next color-"+e[5]+" svelte-1ejdu9y"),v(r,"class","value svelte-1ejdu9y"),v(n,"class","card svelte-1ejdu9y"),v(n,"style",e[6]),v(n,"data-index",e[0]),b(n,"clickable",e[1]),b(n,"plused",e[3]),b(n,"matched",e[2])},m(t,e){u(t,n,e),i(n,r),i(r,l),i(l,s),i(r,c),i(r,a),i(a,f)},p(t,[e]){16&e&&x(s,t[4]),16&e&&o!==(o="current color-"+t[4]+" svelte-1ejdu9y")&&v(l,"class",o),32&e&&x(f,t[5]),32&e&&h!==(h="next color-"+t[5]+" svelte-1ejdu9y")&&v(a,"class",h),64&e&&v(n,"style",t[6]),1&e&&v(n,"data-index",t[0]),2&e&&b(n,"clickable",t[1]),8&e&&b(n,"plused",t[3]),4&e&&b(n,"matched",t[2])},i:t,o:t,d(t){t&&d(n)}}}function pt(t,e,n){let r,l,{index:s}=e,{clickable:o}=e,{duration:c}=e,{fallPhase:a}=e,{matched:i}=e,{plused:u}=e,{value:d}=e,{x:f=0}=e,{y:p=0}=e;return t.$set=t=>{"index"in t&&n(0,s=t.index),"clickable"in t&&n(1,o=t.clickable),"duration"in t&&n(7,c=t.duration),"fallPhase"in t&&n(8,a=t.fallPhase),"matched"in t&&n(2,i=t.matched),"plused"in t&&n(3,u=t.plused),"value"in t&&n(4,d=t.value),"x"in t&&n(9,f=t.x),"y"in t&&n(10,p=t.y)},t.$$.update=()=>{16&t.$$.dirty&&n(5,r=d<9?d+1:0),1920&t.$$.dirty&&n(6,l=`\n    bottom: var(--pixel-${21*p});\n    left: var(--pixel-${21*f});\n    transition-duration: ${a?c:0}ms;\n  `)},[s,o,i,u,d,r,l,c,a,f,p]}class mt extends G{constructor(t){super(),Z(this,t,pt,ft,o,{index:0,clickable:1,duration:7,fallPhase:8,matched:2,plused:3,value:4,x:9,y:10})}}function gt(t,e,n){const r=t.slice();return r[8]=e[n],r[10]=n,r}function ht(t){let n;const r=[{clickable:"idle"===t[3]&&!t[0]},{fallPhase:"fall"===t[3]},{matched:t[1].includes(t[10])},{plused:t[0]===t[10]},t[8],{index:t[10]}];let l={};for(let t=0;t<r.length;t+=1)l=e(l,r[t]);const s=new mt({props:l});return{c(){D(s.$$.fragment)},m(t,e){I(s,t,e),n=!0},p(t,e){const n=15&e?function(t,e){const n={},r={},l={$$scope:1};let s=t.length;for(;s--;){const o=t[s],c=e[s];if(c){for(const t in o)t in c||(r[t]=1);for(const t in c)l[t]||(n[t]=c[t],l[t]=1);t[s]=c}else for(const t in o)l[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(r,[9&e&&{clickable:"idle"===t[3]&&!t[0]},8&e&&{fallPhase:"fall"===t[3]},2&e&&{matched:t[1].includes(t[10])},1&e&&{plused:t[0]===t[10]},4&e&&(l=t[8],"object"==typeof l&&null!==l?l:{}),r[5]]):{};var l;s.$set(n)},i(t){n||(S(s.$$.fragment,t),n=!0)},o(t){B(s.$$.fragment,t),n=!1},d(t){R(s,t)}}}function $t(t){let e,n,r,l=t[2],s=[];for(let e=0;e<l.length;e+=1)s[e]=ht(gt(t,l,e));const o=t=>B(s[t],1,1,()=>{s[t]=null});return{c(){e=p("div");for(let t=0;t<s.length;t+=1)s[t].c();v(e,"class","board svelte-17qys6o"),b(e,"overflow-hidden","idle"!==t[3])},m(l,o,c){u(l,e,o);for(let t=0;t<s.length;t+=1)s[t].m(e,null);n=!0,c&&r(),r=$(e,"click",t[4])},p(t,[n]){if(15&n){let r;for(l=t[2],r=0;r<l.length;r+=1){const o=gt(t,l,r);s[r]?(s[r].p(o,n),S(s[r],1)):(s[r]=ht(o),s[r].c(),S(s[r],1),s[r].m(e,null))}for(F(),r=l.length;r<s.length;r+=1)o(r);H()}8&n&&b(e,"overflow-hidden","idle"!==t[3])},i(t){if(!n){for(let t=0;t<l.length;t+=1)S(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)B(s[t]);n=!1},d(t){t&&d(e),f(s,t),r()}}}function vt(t,e,n){let r,l,s,o,a;c(t,rt,t=>n(2,r=t)),c(t,st,t=>n(5,l=t)),c(t,lt,t=>n(6,s=t)),c(t,at,t=>n(3,o=t));let i=[];at.subscribe(t=>{switch(t){case"plus":rt.set(((t,e)=>t.map((t,n)=>e===n&&t.y<6?{x:t.x,y:t.y,value:t.value<9?t.value+1:0,duration:0}:t))(r,a)),at.set("blink");break;case"blink":n(0,a=void 0),n(1,i=et(r)),i.length?(st.set(l.concat(i.reduce((t,e)=>{const{value:n}=r[e];return t[n]=(t[n]||0)+n,t.sum=(t.sum||0)+n,t},{}))),setTimeout(()=>at.set("match"),800)):s<10?at.set("gameover"):(at.set("idle"),s>100&&lt.set(100),l.length&&st.set([]));break;case"match":const t=i.reduce((t,e)=>t+r[e].value,0);lt.set(s+t),rt.set(nt(r,i)),n(1,i=[]),setTimeout(()=>at.set("fall"),400);break;case"fall":rt.set(tt(r)),setTimeout(()=>at.set("blink"),400);break;case"gameover":ct.set(!0)}});const u=({dataset:t,parentNode:e})=>t&&t.index?t.index:e?u(e):void 0;return[a,i,r,o,({target:t})=>{"idle"!==o||a||(n(0,a=Number(u(t))),Number.isNaN(a)||(lt.set(s-10),setTimeout(()=>at.set("plus"),400)))}]}class xt extends G{constructor(t){super(),Z(this,t,vt,$t,o,{})}}function bt(e){let n,r,l,s,o,c,a,f,h,$,b,y;return{c(){n=p("div"),r=p("div"),l=p("span"),s=m(e[3]),a=g(),f=p("div"),h=p("span"),$=m(e[3]),v(l,"class","left-value svelte-15vtdlp"),v(l,"style",o=`position: ${e[3]>100?"absolute":"relative"}`),v(r,"class","left-bar svelte-15vtdlp"),v(r,"style",c=`flex: ${e[0]}`),v(h,"class","right-value svelte-15vtdlp"),v(h,"style",b=`left: calc(${e[2]} * var(--pixel-board)); position: ${e[3]>100?"relative":"absolute"}`),v(f,"class","right-bar svelte-15vtdlp"),v(f,"style",y=`background-color: ${e[3]>100?e[4]:"var(--color-dark)"}; flex: ${e[1]}`),v(n,"class","energy svelte-15vtdlp")},m(t,e){u(t,n,e),i(n,r),i(r,l),i(l,s),i(n,a),i(n,f),i(f,h),i(h,$)},p(t,[e]){8&e&&x(s,t[3]),8&e&&o!==(o=`position: ${t[3]>100?"absolute":"relative"}`)&&v(l,"style",o),1&e&&c!==(c=`flex: ${t[0]}`)&&v(r,"style",c),8&e&&x($,t[3]),12&e&&b!==(b=`left: calc(${t[2]} * var(--pixel-board)); position: ${t[3]>100?"relative":"absolute"}`)&&v(h,"style",b),26&e&&y!==(y=`background-color: ${t[3]>100?t[4]:"var(--color-dark)"}; flex: ${t[1]}`)&&v(f,"style",y)},i:t,o:t,d(t){t&&d(n)}}}function yt(t,e,n){let r,l,s,o,a;c(t,lt,t=>n(3,r=t)),c(t,ut,t=>n(4,l=t));const i=()=>{r>100&&(ut.set(`hsl(${Math.floor(360*Math.random())}, 100%, 50%)`),requestAnimationFrame(i))};return lt.subscribe(t=>{i(),n(0,s=(t>100?200-t:t)/100),n(1,o=t>100?(t-100)/100:0),n(2,a=t>119?0:(t>100?t-120:-20)/100)}),[s,o,a,r,l]}class kt extends G{constructor(t){super(),Z(this,t,yt,bt,o,{})}}function wt(e){let n,r;return{c(){n=p("span"),r=m(e[0]),v(n,"class","score")},m(t,e){u(t,n,e),i(n,r)},p(t,[e]){1&e&&x(r,t[0])},i:t,o:t,d(t){t&&d(n)}}}function jt(t,e,n){let r;return c(t,it,t=>n(0,r=t)),st.subscribe(t=>{const{length:e}=t;if(e){const{sum:n}=t.slice(-1)[0];n&&it.set(r+e*n)}}),[r]}class _t extends G{constructor(t){super(),Z(this,t,jt,wt,o,{})}}function At(t,e,n){const r=t.slice();return r[4]=e[n][0],r[5]=e[n][1],r[7]=n,r}function Pt(t,e,n){const r=t.slice();return r[1]=e[n],r[3]=n,r}function Mt(t){let e,n=t[0].slice(-5),r=[];for(let e=0;e<n.length;e+=1)r[e]=Ct(Pt(t,n,e));return{c(){e=p("ol");for(let t=0;t<r.length;t+=1)r[t].c();v(e,"class","log svelte-1a9t645")},m(t,n){u(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,l){if(1&l){let s;for(n=t[0].slice(-5),s=0;s<n.length;s+=1){const o=Pt(t,n,s);r[s]?r[s].p(o,l):(r[s]=Ct(o),r[s].c(),r[s].m(e,null))}for(;s<r.length;s+=1)r[s].d(1);r.length=n.length}},d(t){t&&d(e),f(r,t)}}}function Nt(t){let e,n,r,l,s,o=t[5]+"",c=t[7]<Object.keys(t[1]).length-2,a=c&&Et();return{c(){e=p("span"),n=m(o),l=g(),a&&a.c(),s=h(),v(e,"class",r="value color-"+t[4]+" svelte-1a9t645")},m(t,r){u(t,e,r),i(e,n),u(t,l,r),a&&a.m(t,r),u(t,s,r)},p(t,l){1&l&&o!==(o=t[5]+"")&&x(n,o),1&l&&r!==(r="value color-"+t[4]+" svelte-1a9t645")&&v(e,"class",r),1&l&&(c=t[7]<Object.keys(t[1]).length-2),c?a||(a=Et(),a.c(),a.m(s.parentNode,s)):a&&(a.d(1),a=null)},d(t){t&&d(e),t&&d(l),a&&a.d(t),t&&d(s)}}}function Et(t){let e;return{c(){e=p("span"),e.textContent="+",v(e,"class","plus")},m(t,n){u(t,e,n)},d(t){t&&d(e)}}}function qt(t){let e,n="sum"!==t[4]&&Nt(t);return{c(){n&&n.c(),e=h()},m(t,r){n&&n.m(t,r),u(t,e,r)},p(t,r){"sum"!==t[4]?n?n.p(t,r):(n=Nt(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&d(e)}}}function Ct(t){let e,n,r,l,s,o=(t[3]+1)*t[1].sum+"",c=Object.entries(t[1]),a=[];for(let e=0;e<c.length;e+=1)a[e]=qt(At(t,c,e));return{c(){e=p("li");for(let t=0;t<a.length;t+=1)a[t].c();n=g(),r=p("span"),l=m(o),s=g(),v(r,"class","sum svelte-1a9t645"),v(e,"class","svelte-1a9t645")},m(t,o){u(t,e,o);for(let t=0;t<a.length;t+=1)a[t].m(e,null);i(e,n),i(e,r),i(r,l),i(e,s)},p(t,r){if(1&r){let l;for(c=Object.entries(t[1]),l=0;l<c.length;l+=1){const s=At(t,c,l);a[l]?a[l].p(s,r):(a[l]=qt(s),a[l].c(),a[l].m(e,n))}for(;l<a.length;l+=1)a[l].d(1);a.length=c.length}1&r&&o!==(o=(t[3]+1)*t[1].sum+"")&&x(l,o)},d(t){t&&d(e),f(a,t)}}}function Ot(e){let n,r=e[0].length&&Mt(e);return{c(){r&&r.c(),n=h()},m(t,e){r&&r.m(t,e),u(t,n,e)},p(t,[e]){t[0].length?r?r.p(t,e):(r=Mt(t),r.c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i:t,o:t,d(t){r&&r.d(t),t&&d(n)}}}function Tt(t,e,n){let r;return c(t,st,t=>n(0,r=t)),[r]}class Lt extends G{constructor(t){super(),Z(this,t,Tt,Ot,o,{})}}function zt(t){let e,n,r,l,s,o,c,a,f,m,h,x,y;const k=new Lt({}),w=new _t({}),j=new xt({}),_=new kt({});return{c(){e=p("div"),n=p("div"),r=p("button"),l=p("span"),l.textContent="work in progress",s=g(),D(k.$$.fragment),o=g(),c=p("div"),D(w.$$.fragment),a=g(),f=p("div"),D(j.$$.fragment),m=g(),h=p("div"),D(_.$$.fragment),v(r,"class","digifall svelte-1q5r08d"),b(r,"screen",t[1].length),v(n,"class","section-1"),v(c,"class","section-2"),v(f,"class","section-3"),v(h,"class","section-4"),v(e,"class","game content svelte-1q5r08d"),b(e,"blur",!0===t[0])},m(d,p,g){u(d,e,p),i(e,n),i(n,r),i(r,l),i(r,s),I(k,r,null),i(e,o),i(e,c),I(w,c,null),i(e,a),i(e,f),I(j,f,null),i(e,m),i(e,h),I(_,h,null),x=!0,g&&y(),y=$(r,"click",t[2])},p(t,[n]){2&n&&b(r,"screen",t[1].length),1&n&&b(e,"blur",!0===t[0])},i(t){x||(S(k.$$.fragment,t),S(w.$$.fragment,t),S(j.$$.fragment,t),S(_.$$.fragment,t),x=!0)},o(t){B(k.$$.fragment,t),B(w.$$.fragment,t),B(j.$$.fragment,t),B(_.$$.fragment,t),x=!1},d(t){t&&d(e),R(k),R(w),R(j),R(_),y()}}}function Ft(t,e,n){let r,l;c(t,ct,t=>n(0,r=t)),c(t,st,t=>n(1,l=t));return[r,l,()=>ct.set(!0)]}class Ht extends G{constructor(t){super(),Z(this,t,Ft,zt,o,{})}}function St(e){let n,r,l,s,o,c,a,f,h,b,y,k;return{c(){n=p("div"),r=p("div"),r.innerHTML='<span class="text-big">game over</span>',l=g(),s=p("div"),o=p("span"),c=m(e[0]),a=g(),f=p("div"),h=p("button"),h.textContent="new game",b=g(),y=p("div"),y.innerHTML='<span class="width-100"><span class="text-big">0</span><span class="text-small">ut of energy</span></span>',v(r,"class","section-1"),v(o,"class","score"),v(s,"class","section-2"),v(f,"class","section-3"),v(y,"class","section-4"),v(n,"class","game-over content")},m(t,d,p){u(t,n,d),i(n,r),i(n,l),i(n,s),i(s,o),i(o,c),i(n,a),i(n,f),i(f,h),i(n,b),i(n,y),p&&k(),k=$(h,"click",e[1])},p(t,[e]){1&e&&x(c,t[0])},i:t,o:t,d(t){t&&d(n),k()}}}function Bt(t,e,n){let r;c(t,it,t=>n(0,r=t));return[r,()=>dt()]}class Dt extends G{constructor(t){super(),Z(this,t,Bt,St,o,{})}}function It(e){let n,r,s,o,c,a,f,h,b,y,k,w,j,_,A,P,M,N;return{c(){n=p("div"),r=p("div"),r.innerHTML='<span class="text-small">work in progress</span>',s=g(),o=p("div"),c=p("span"),a=m(e[0]),f=g(),h=p("div"),b=p("button"),b.textContent="resume",y=g(),k=p("button"),k.textContent="new game",w=g(),j=p("button"),j.textContent="shadow",_=g(),A=p("button"),A.textContent="fullscreen",P=g(),M=p("div"),v(r,"class","section-1"),v(c,"class","score"),v(o,"class","section-2"),v(h,"class","section-3"),v(M,"class","section-4"),v(n,"class","menu content")},m(t,d,p){u(t,n,d),i(n,r),i(n,s),i(n,o),i(o,c),i(c,a),i(n,f),i(n,h),i(h,b),i(h,y),i(h,k),i(h,w),i(h,j),i(h,_),i(h,A),i(n,P),i(n,M),p&&l(N),N=[$(b,"click",e[1]),$(k,"click",e[2]),$(j,"click",e[3]),$(A,"click",e[4])]},p(t,[e]){1&e&&x(a,t[0])},i:t,o:t,d(t){t&&d(n),l(N)}}}function Rt(t,e,n){let r,l;c(t,ot,t=>n(5,r=t)),c(t,it,t=>n(0,l=t));return[l,()=>ct.set(!1),()=>dt(),()=>{const{shadow:t}=r,{style:e}=document.documentElement;e.setProperty("--shadow-0",t?"none":"0 0 1px black"),e.setProperty("--shadow-1",t?"none":"0 var(--pixel-half) var(--pixel-half) var(--color-black-04), 0 -1px 0 rgba(255, 255, 255, 0.6)"),e.setProperty("--shadow-2",t?"none":"0 var(--pixel) var(--pixel) var(--color-black-04), 0 -1px 0 rgba(255, 255, 255, 0.6)"),e.setProperty("--shadow-21",t?"0 0 0 transparent":"0 0 var(--pixel-21) var(--pixel) black"),e.setProperty("--shadow-inset-1",t?"none":"inset 0 var(--pixel-half) var(--pixel-half) var(--color-black-04), 0 1px 0 rgba(255, 255, 255, 0.6)"),e.setProperty("--shadow-inset-2",t?"none":"inset 0 var(--pixel) var(--pixel) var(--color-black-04), 0 1px 0 rgba(255, 255, 255, 0.6)"),ot.set({...ot,shadow:!t})},()=>{const{documentElement:t,fullscreen:e}=document;e?document.exitFullscreen():t.requestFullscreen()}]}class Wt extends G{constructor(t){super(),Z(this,t,Rt,It,o,{})}}function Zt(t){let e,n;const r=t[1].default,l=function(t,e,n,r){if(t){const l=a(t,e,n,r);return t[0](l)}}(r,t,t[0],null);return{c(){e=p("div"),l&&l.c(),v(e,"class","overlay svelte-f4qe81")},m(t,r){u(t,e,r),l&&l.m(e,null),n=!0},p(t,[e]){l&&l.p&&1&e&&l.p(a(r,t,t[0],null),function(t,e,n,r){if(t[2]&&r){const l=t[2](r(n));if(void 0===e.dirty)return l;if("object"==typeof l){const t=[],n=Math.max(e.dirty.length,l.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|l[r];return t}return e.dirty|l}return e.dirty}(r,t[0],e,null))},i(t){n||(S(l,t),n=!0)},o(t){B(l,t),n=!1},d(t){t&&d(e),l&&l.d(t)}}}function Gt(t,e,n){let{$$slots:r={},$$scope:l}=e;return t.$set=t=>{"$$scope"in t&&n(0,l=t.$$scope)},[l,r]}class Jt extends G{constructor(t){super(),Z(this,t,Gt,Zt,o,{})}}function Kt(t){let e;const n=new Jt({props:{$$slots:{default:[Vt]},$$scope:{ctx:t}}});return{c(){D(n.$$.fragment)},m(t,r){I(n,t,r),e=!0},p(t,e){const r={};260&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){e||(S(n.$$.fragment,t),e=!0)},o(t){B(n.$$.fragment,t),e=!1},d(t){R(n,t)}}}function Qt(t){let e;const n=new Wt({});return{c(){D(n.$$.fragment)},m(t,r){I(n,t,r),e=!0},i(t){e||(S(n.$$.fragment,t),e=!0)},o(t){B(n.$$.fragment,t),e=!1},d(t){R(n,t)}}}function Ut(t){let e;const n=new Dt({});return{c(){D(n.$$.fragment)},m(t,r){I(n,t,r),e=!0},i(t){e||(S(n.$$.fragment,t),e=!0)},o(t){B(n.$$.fragment,t),e=!1},d(t){R(n,t)}}}function Vt(t){let e,n,r,l;const s=[Ut,Qt],o=[];function c(t,e){return"gameover"===t[2]?0:1}return e=c(t),n=o[e]=s[e](t),{c(){n.c(),r=h()},m(t,n){o[e].m(t,n),u(t,r,n),l=!0},p(t,l){let a=e;e=c(t),e!==a&&(F(),B(o[a],1,1,()=>{o[a]=null}),H(),n=o[e],n||(n=o[e]=s[e](t),n.c()),S(n,1),n.m(r.parentNode,r))},i(t){l||(S(n),l=!0)},o(t){B(n),l=!1},d(t){o[e].d(t),t&&d(r)}}}function Xt(t){let e,n,r;const l=new Ht({});let s=t[1]&&Kt(t);return{c(){e=p("div"),D(l.$$.fragment),n=g(),s&&s.c(),v(e,"class","app svelte-1d838t4"),v(e,"style",t[0])},m(t,o){u(t,e,o),I(l,e,null),i(e,n),s&&s.m(e,null),r=!0},p(t,[n]){t[1]?s?(s.p(t,n),2&n&&S(s,1)):(s=Kt(t),s.c(),S(s,1),s.m(e,null)):s&&(F(),B(s,1,1,()=>{s=null}),H()),(!r||1&n)&&v(e,"style",t[0])},i(t){r||(S(l.$$.fragment,t),S(s),r=!0)},o(t){B(l.$$.fragment,t),B(s),r=!1},d(t){t&&d(e),R(l),s&&s.d()}}}function Yt(t,e,n){let r,l,s;c(t,lt,t=>n(3,r=t)),c(t,ct,t=>n(1,l=t)),c(t,at,t=>n(2,s=t));const o=(t=10)=>`hsl(${Math.floor(360*Math.random())},100%,${t}%)`,a=()=>{const[t,e,n,r]=(t=>{for(let e=t.length-1;e>0;--e){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})([7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]);return`\n      background-color: ${o()};\n      background-image:\n        linear-gradient(90deg, ${o()} 50%, transparent 50%),\n        linear-gradient(90deg, ${o()} 50%, transparent 50%),\n        linear-gradient(90deg, transparent 50%, ${o()} 50%),\n        linear-gradient(90deg, transparent 50%, ${o()} 50%);\n      background-position: center;\n      background-size:\n        calc(${t} * var(--pixel)),\n        calc(${e} * var(--pixel)),\n        calc(${n} * var(--pixel)),\n        calc(${r} * var(--pixel));`};let i=a();const u=()=>{const{style:t}=document.documentElement,{offsetHeight:e,offsetWidth:r}=document.querySelector(".app");e/r>1.5?(t.setProperty("--pixel",`${r/128}px`),n(0,i=void 0)):(t.setProperty("--pixel",`${e/192}px`),n(0,i=a()))};return w(u),onresize=u,onkeydown=({key:t})=>{"1"===t?lt.set(10):"0"===t?lt.set(100):"ArrowRight"===t?lt.set(r+1):"ArrowLeft"===t&&lt.set(r-1)},[i,l,s]}return new class extends G{constructor(t){super(),Z(this,t,Yt,Xt,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
