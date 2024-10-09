var C=Object.defineProperty;var j=(e,t,n)=>t in e?C(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var p=(e,t,n)=>j(e,typeof t!="symbol"?t+"":t,n);import{r as h,n as y,h as v,j as D,i as A,k as T,l as b,m as O,p as B,q as N,v as H,w as L,x as P}from"./scheduler.CK3TlEg5.js";let $=!1;function I(){$=!0}function q(){$=!1}function M(e,t,n,i){for(;e<t;){const r=e+(t-e>>1);n(r)<=i?e=r+1:t=r}return e}function R(e){if(e.hydrate_init)return;e.hydrate_init=!0;let t=e.childNodes;if(e.nodeName==="HEAD"){const s=[];for(let l=0;l<t.length;l++){const o=t[l];o.claim_order!==void 0&&s.push(o)}t=s}const n=new Int32Array(t.length+1),i=new Int32Array(t.length);n[0]=-1;let r=0;for(let s=0;s<t.length;s++){const l=t[s].claim_order,o=(r>0&&t[n[r]].claim_order<=l?r+1:M(1,r,d=>t[n[d]].claim_order,l))-1;i[s]=n[o]+1;const u=o+1;n[u]=s,r=Math.max(u,r)}const f=[],a=[];let c=t.length-1;for(let s=n[r]+1;s!=0;s=i[s-1]){for(f.push(t[s-1]);c>=s;c--)a.push(t[c]);c--}for(;c>=0;c--)a.push(t[c]);f.reverse(),a.sort((s,l)=>s.claim_order-l.claim_order);for(let s=0,l=0;s<a.length;s++){for(;l<f.length&&a[s].claim_order>=f[l].claim_order;)l++;const o=l<f.length?f[l]:null;e.insertBefore(a[s],o)}}function z(e,t){if($){for(R(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;t!==e.actual_end_child?(t.claim_order!==void 0||t.parentNode!==e)&&e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling}else(t.parentNode!==e||t.nextSibling!==null)&&e.appendChild(t)}function se(e,t,n){$&&!n?z(e,t):(t.parentNode!==e||t.nextSibling!=n)&&e.insertBefore(t,n||null)}function F(e){e.parentNode&&e.parentNode.removeChild(e)}function U(e){return document.createElement(e)}function x(e){return document.createTextNode(e)}function le(){return x(" ")}function ae(){return x("")}function fe(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function ce(e){return function(t){return t.preventDefault(),e.call(this,t)}}function E(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}const V=["width","height"];function W(e,t){const n=Object.getOwnPropertyDescriptors(e.__proto__);for(const i in t)t[i]==null?e.removeAttribute(i):i==="style"?e.style.cssText=t[i]:i==="__value"?e.value=e[i]=t[i]:n[i]&&n[i].set&&V.indexOf(i)===-1?e[i]=t[i]:E(e,i,t[i])}function G(e,t){Object.keys(t).forEach(n=>{J(e,n,t[n])})}function J(e,t,n){const i=t.toLowerCase();i in e?e[i]=typeof e[i]=="boolean"&&n===""?!0:n:t in e?e[t]=typeof e[t]=="boolean"&&n===""?!0:n:E(e,t,n)}function ue(e){return/-/.test(e)?G:W}function oe(e){return e.dataset.svelteH}function K(e){return Array.from(e.childNodes)}function Q(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function S(e,t,n,i,r=!1){Q(e);const f=(()=>{for(let a=e.claim_info.last_index;a<e.length;a++){const c=e[a];if(t(c)){const s=n(c);return s===void 0?e.splice(a,1):e[a]=s,r||(e.claim_info.last_index=a),c}}for(let a=e.claim_info.last_index-1;a>=0;a--){const c=e[a];if(t(c)){const s=n(c);return s===void 0?e.splice(a,1):e[a]=s,r?s===void 0&&e.claim_info.last_index--:e.claim_info.last_index=a,c}}return i()})();return f.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,f}function X(e,t,n,i){return S(e,r=>r.nodeName===t,r=>{const f=[];for(let a=0;a<r.attributes.length;a++){const c=r.attributes[a];n[c.name]||f.push(c.name)}f.forEach(a=>r.removeAttribute(a))},()=>i(t))}function _e(e,t,n){return X(e,t,n,U)}function Y(e,t){return S(e,n=>n.nodeType===3,n=>{const i=""+t;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>x(t),!0)}function de(e){return Y(e," ")}function me(e,t){t=""+t,e.data!==t&&(e.data=t)}function he(e,t){e.value=t??""}function $e(e,t,n,i){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}function pe(e,t){const n=[];let i=0;for(const r of t.childNodes)if(r.nodeType===8){const f=r.textContent.trim();f===`HEAD_${e}_END`?(i-=1,n.push(r)):f===`HEAD_${e}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function ye(e,t){return new e(t)}const m=new Set;let _;function xe(){_={r:0,c:[],p:_}}function ge(){_.r||h(_.c),_=_.p}function Z(e,t){e&&e.i&&(m.delete(e),e.i(t))}function we(e,t,n,i){if(e&&e.o){if(m.has(e))return;m.add(e),_.c.push(()=>{m.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function ve(e,t,n){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function be(e){e&&e.c()}function Ne(e,t){e&&e.l(t)}function k(e,t,n){const{fragment:i,after_update:r}=e.$$;i&&i.m(t,n),b(()=>{const f=e.$$.on_mount.map(H).filter(A);e.$$.on_destroy?e.$$.on_destroy.push(...f):h(f),e.$$.on_mount=[]}),r.forEach(b)}function ee(e,t){const n=e.$$;n.fragment!==null&&(O(n.after_update),h(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function te(e,t){e.$$.dirty[0]===-1&&(L.push(e),P(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Ae(e,t,n,i,r,f,a=null,c=[-1]){const s=B;N(e);const l=e.$$={fragment:null,ctx:[],props:f,update:y,not_equal:r,bound:v(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(s?s.$$.context:[])),callbacks:v(),dirty:c,skip_bound:!1,root:t.target||s.$$.root};a&&a(l.root);let o=!1;if(l.ctx=n?n(e,t.props||{},(u,d,...g)=>{const w=g.length?g[0]:d;return l.ctx&&r(l.ctx[u],l.ctx[u]=w)&&(!l.skip_bound&&l.bound[u]&&l.bound[u](w),o&&te(e,u)),d}):[],l.update(),o=!0,h(l.before_update),l.fragment=i?i(l.ctx):!1,t.target){if(t.hydrate){I();const u=K(t.target);l.fragment&&l.fragment.l(u),u.forEach(F)}else l.fragment&&l.fragment.c();t.intro&&Z(e.$$.fragment),k(e,t.target,t.anchor),q(),D()}N(s)}class Ee{constructor(){p(this,"$$");p(this,"$$set")}$destroy(){ee(this,1),this.$destroy=y}$on(t,n){if(!A(n))return y;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!T(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ne="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ne);export{W as A,he as B,ve as C,ce as D,pe as E,oe as F,Ee as S,K as a,Y as b,_e as c,F as d,U as e,de as f,se as g,z as h,Ae as i,me as j,Z as k,we as l,ae as m,ge as n,E as o,$e as p,xe as q,ye as r,le as s,x as t,be as u,Ne as v,k as w,ee as x,ue as y,fe as z};