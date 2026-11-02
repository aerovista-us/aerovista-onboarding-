(function(){
"use strict";
const nav=document.querySelector("[data-nav]");
if(!nav)return;
const path=location.pathname.split("/").pop()||"index.html";
const main=document.querySelector("main");
if(main){main.id="main-content";main.setAttribute("tabindex","-1")}
if(!document.querySelector(".skip-link")){const a=document.createElement("a");a.className="skip-link";a.href="#main-content";a.textContent="Skip to main content";document.body.prepend(a)}
const links=[...nav.querySelectorAll("a")];
const currentIndex=Math.max(0,links.findIndex(a=>(a.getAttribute("href")||"").split("/").pop()===path));
links.forEach((a,i)=>{if(i===currentIndex){a.classList.add("active");a.setAttribute("aria-current","page")}else{a.classList.remove("active");a.removeAttribute("aria-current")}});
const currentName=links[currentIndex]?.textContent.trim()||"Overview";
const sidebar=nav.closest(".sidebar"),head=sidebar?.querySelector(".head");
if(head){
 nav.id="site-navigation";
 const current=document.createElement("span");current.className="mobile-current";current.textContent=currentName;current.title=currentName;
 const button=document.createElement("button");button.type="button";button.className="mobile-menu";button.setAttribute("aria-controls","site-navigation");button.setAttribute("aria-expanded","false");
 const setOpen=open=>{sidebar.classList.toggle("is-open",open);button.setAttribute("aria-expanded",String(open));button.textContent=open?"✕ Close":"☰ Sections";current.hidden=open};
 setOpen(false);head.append(current,button);
 button.addEventListener("click",()=>setOpen(!sidebar.classList.contains("is-open")));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sidebar.classList.contains("is-open")){setOpen(false);button.focus()}});
 nav.addEventListener("click",e=>{if(e.target.closest("a"))setOpen(false)});
 document.addEventListener("click",e=>{if(sidebar.classList.contains("is-open")&&!sidebar.contains(e.target))setOpen(false)});
}
if(main){
 const progress=document.createElement("div");progress.className="journey";progress.setAttribute("aria-label","Guide progress");
 const label=document.createElement("span");label.className="journey-label";label.textContent="Explore AeroVista";
 const count=document.createElement("span");count.className="journey-count";count.textContent="Section "+(currentIndex+1)+" of "+links.length;
 const track=document.createElement("div");track.className="journey-track";track.setAttribute("role","progressbar");track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax",String(links.length));track.setAttribute("aria-valuenow",String(currentIndex+1));track.setAttribute("aria-label","Sections completed in sequence");
 const fill=document.createElement("div");fill.className="journey-fill";fill.style.width=((currentIndex+1)/links.length*100)+"%";track.append(fill);progress.append(label,count,track);main.before(progress);
}
const wrap=document.querySelector(".wrap");
if(wrap&&!wrap.querySelector(".site-footer")){const foot=document.createElement("footer");foot.className="site-footer";const a=document.createElement("a");a.href="https://aerovista.us/";a.textContent="AeroVista LLC";a.rel="noopener";const span=document.createElement("span");span.textContent="Where Vision Takes Flight · Seven Divisions, One Vision";foot.append(a,span);wrap.append(foot)}
document.addEventListener("keydown",e=>{if(!e.altKey||e.ctrlKey||e.metaKey||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;const link=e.key==="ArrowLeft"?document.querySelector("[data-prev]"):e.key==="ArrowRight"?document.querySelector("[data-next]"):null;if(link){e.preventDefault();location.href=link.href}});
})();