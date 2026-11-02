/* AeroVista onboarding progress bridge v1.
   Safe by default: no endpoints configured; no anonymous writes or fake completion. */
(function (global) {
  "use strict";
  const sections = new Set(["index.html","welcome.html","what-is.html","principles.html","work-organized.html","divisions.html","decisions.html","values.html","expectations.html","engage.html","closing.html","roadmap.html","shareholder-template.html"]);
  const state = { status:"unconfigured", profile:null, progress:null };
  function configured() {
    const url = global.AEROVISTA_PROGRESS_API_BASE;
    if (!url || typeof url !== "string") return null;
    try {
      const parsed = new URL(url, global.location.href);
      if (parsed.protocol !== "https:") return null;
      return parsed.origin + parsed.pathname.replace(/\/$/, "");
    } catch (_) { return null; }
  }
  async function request(path, options={}) {
    const base=configured();
    if(!base) throw new Error("progress_backend_not_configured");
    const res=await fetch(base+path,{credentials:"include",cache:"no-store",headers:{"Accept":"application/json",...(options.headers||{})},...options});
    if(!res.ok) throw new Error("progress_http_"+res.status);
    return res.json();
  }
  async function load() {
    if(!configured()) return {...state};
    try {
      const data=await request("/api/v1/me/progress");
      state.status="authenticated";state.profile=data.identity||null;state.progress=data;
    } catch(e) {
      state.status="unavailable";state.profile=null;state.progress=null;
    }
    return {...state};
  }
  async function acknowledge(sectionId, csrfToken) {
    if(!sections.has(sectionId)) throw new Error("unknown_section");
    if(!csrfToken) throw new Error("csrf_required");
    return request("/api/v1/me/onboarding/sections/"+encodeURIComponent(sectionId)+"/acknowledge",{
      method:"POST",headers:{"X-CSRF-Token":csrfToken,"Content-Type":"application/json"},body:"{}"
    });
  }
  global.AeroVistaProgressBridge=Object.freeze({load,acknowledge,getState:()=>({...state}),sectionIds:[...sections]});
})(window);
