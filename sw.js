if(!self.define){let e,i={};const s=(s,a)=>(s=new URL(s+".js",a).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(a,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let r={};const d=e=>s(e,c),o={module:{uri:c},exports:r,require:d};i[c]=Promise.all(a.map((e=>o[e]||d(e)))).then((e=>(n(...e),r)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-B_A5q8qs.js",revision:null},{url:"assets/index-BTLxFvXK.css",revision:null},{url:"images/get-it-on-google-play.png",revision:"5a52fb829697f99c7f0836693a9c63fe"},{url:"images/icon-128x128.png",revision:"668b36af9ae70c7819cb12468b4d0ec8"},{url:"images/icon-144x144.png",revision:"e0602e6fce8cb6633c56545a0252da68"},{url:"images/icon-152x152.png",revision:"8bd7967bd89165bb1b92e357ddbffc33"},{url:"images/icon-192x192.png",revision:"a460d2ed8009b76bb39695a0128e60a7"},{url:"images/icon-384x384.png",revision:"6470485c56a65bcab274d14c16484c66"},{url:"images/icon-48x48.png",revision:"6aed62ece5ad71e9eaabd22ea1503508"},{url:"images/icon-512x512.png",revision:"7cb9bd6475b79c97b7baf6a6f9a6e4f2"},{url:"images/icon-72x72.png",revision:"7e2eeab9b9d04140ab03a6edd1e11eb2"},{url:"images/icon-96x96.png",revision:"17bf9e0429a14de5c02a19d91c969756"},{url:"images/icon-cr-128x128.png",revision:"c190036954542f6e30f53431675f9b39"},{url:"images/icon-cr-144x144.png",revision:"66d232007223f6d404b5fdbf331a2805"},{url:"images/icon-cr-152x152.png",revision:"bba7073ad1c943f3a7911f9beace4ed1"},{url:"images/icon-cr-192x192.png",revision:"008a15c64fbd6643eb09d9c0b6a5aa61"},{url:"images/icon-cr-384x384.png",revision:"19df4dcb5792b380cc6824a286af0b3e"},{url:"images/icon-cr-48x48.png",revision:"ef7ac4b1b2fa739a0660535c5d5b7db3"},{url:"images/icon-cr-512x512.png",revision:"a8d4bad86e258b27ee52e7d377eb7472"},{url:"images/icon-cr-72x72.png",revision:"125be8160b6d22c0b32435bff1f45caf"},{url:"images/icon-cr-96x96.png",revision:"e1f928e738cc6f30bfd0b07dfed29f42"},{url:"images/icon.png",revision:"d5e20a8eb6427ce9c82a01dcd2580818"},{url:"images/icon.svg",revision:"80b10d9a19b34d9af642393fbaf997df"},{url:"images/screenshot_0.png",revision:"746d65b7ec87f472326411dc3c3681eb"},{url:"images/screenshot_1.png",revision:"7f9a3e488697ada57359936f5428706d"},{url:"images/screenshot_2.png",revision:"434d3ad638a5d71262cf1de7043c943e"},{url:"images/screenshot_3.png",revision:"52403a89474684b55bf5ffdf33dd49f1"},{url:"images/screenshot_alt_0.png",revision:"bf35b0a2e4ce2db1c5c2a874b4cc856e"},{url:"images/screenshot_alt_1.png",revision:"04787b74e583d1e1ff405e0b76cba4ff"},{url:"images/screenshot_w_0.png",revision:"d3ea0b2aa5cd766b1721b42c4947df99"},{url:"index.html",revision:"9605e4400a6bb29b00a2e3ad58fe13c8"},{url:"manifest.json",revision:"5b9d5a15ba9c9a7f3928672386b68a50"},{url:"privacy-policy.html",revision:"f0459446445d4b63e39ad5136e07e6ac"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"sounds/bleep.wav",revision:"6f6dacf85c1299a259a368eb005a1c8e"},{url:"sounds/blink.wav",revision:"4cf816967979ec5ca132a5b9a1463ae7"},{url:"sounds/click.wav",revision:"cf99c23b4292f066af1611105c140b64"},{url:"sounds/energy-down.wav",revision:"d0ce640ac2e028e05c8af54a31a53590"},{url:"sounds/energy-up.wav",revision:"6be3cb4ca6fb4113bafe06bce3f356ca"},{url:"sounds/game-over.wav",revision:"8d1eb626ec7fe7064ddb75c2d8789cc9"},{url:"sounds/generate.wav",revision:"35797a5d8ab0f443fe72e0b2b8b2b934"},{url:"sounds/happy.wav",revision:"9fcc16f4ce6dc547a3d401cb23f8ef29"},{url:"sounds/hit.wav",revision:"a676e726e96d5d380affa0be6a28458e"},{url:"sounds/kick-1.wav",revision:"379c4a007101f9fc0cd2a0534e74c44d"},{url:"sounds/kick-2.wav",revision:"41be8618f9e3cfd0860810fbca45a0df"},{url:"sounds/low-energy.wav",revision:"dbd3dfb55f3216c305631c83b2a9910a"},{url:"sounds/plus.wav",revision:"5ce61b968a86aef77c5bed591eabdd1c"},{url:"sounds/slide-in.wav",revision:"8b05b313b20ac3c0720c6813bb2d3ecd"},{url:"sounds/slide-move.wav",revision:"651c87d85b15ab273919b9bdcbfef6a6"},{url:"sounds/slide-out.wav",revision:"ada00f7c57817553aec9a378b4fe1a6e"},{url:"sounds/turn-on.wav",revision:"9d1e0e4be2e7ab02114daf78b4dd21e4"},{url:"sounds/word-up.wav",revision:"f74ef81d5fbc3f9bd55a31b2f1171962"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
