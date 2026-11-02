(function(){
  "use strict";
  const path=location.pathname.split("/").pop()||"index.html";
  const nav=document.querySelector("[data-nav]");
  if(!nav)return;
  const skip=document.createElement("a");skip.className="skip-link";skip.href="#main-content";skip.textContent="Skip to main content";document.body.prepend(skip);
  const main=document.querySelector("main");if(main)main.id="main-content";
  const sidebar=nav.closest(".sidebar");
  const head=sidebar&&sidebar.querySelector(".head");
  if(head){
    const button=document.createElement("button");
    button.type="button";button.className="mobile-menu";button.setAttribute("aria-controls","site-navigation");button.setAttribute("aria-expanded","false");button.textContent="☰ Sections";
    nav.id="site-navigation";head.append(button);
    const close=()=>{sidebar.classList.remove("is-open");button.setAttribute("aria-expanded","false");button.textContent="☰ Sections"};
    button.addEventListener("click",()=>{const opened=sidebar.classList.toggle("is-open");button.setAttribute("aria-expanded",String(opened));button.textContent=opened?"✕ Close":"☰ Sections"});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
    nav.addEventListener("click",e=>{if(e.target.closest("a"))close()});
  }
  nav.querySelectorAll("a").forEach(a=>{
    const href=(a.getAttribute("href")||"").split("/").pop();
    if(href===path){a.classList.add("active");a.setAttribute("aria-current","page")}
  });
  document.addEventListener("keydown",e=>{
    if(!e.altKey||e.ctrlKey||e.metaKey||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;
    const link=e.key==="ArrowLeft"?document.querySelector("[data-prev]"):e.key==="ArrowRight"?document.querySelector("[data-next]"):null;
    if(link){e.preventDefault();location.href=link.href}
  });
})();
