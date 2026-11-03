"use strict";
// Public exploration only: deliberately no storage, tracking, auth, or network calls.
// Identity tags must only be recorded after authenticated, consented server-side submission.
const interests=[
 {id:"systems",label:"Build and improve systems",divisions:"Nexus TechWorks",first:"Spot one repetitive task and describe how it could be easier.",tags:["interest:systems","potential:process-improvement"]},
 {id:"creative",label:"Make something creative",divisions:"SkyForge / Lumina / EchoVerse",first:"Choose one visual, song, or message and suggest one meaningful improvement.",tags:["interest:creative","potential:creative-production"]},
 {id:"organize",label:"Organize the moving pieces",divisions:"AeroVista HQ / Operations",first:"Turn a messy update into three columns: done, next, blocked.",tags:["interest:operations","potential:coordination"]},
 {id:"teach",label:"Explain and help people learn",divisions:"Summit Learning / ByteCast",first:"Explain one familiar skill to someone new in five clear steps.",tags:["interest:learning","potential:mentoring"]},
 {id:"explore",label:"Research and find opportunities",divisions:"Horizon / Vespera / Strategy",first:"Find three useful questions about an idea and one way to test it.",tags:["interest:research","potential:discovery"]},
 {id:"people",label:"Work with people and solve problems",divisions:"Client Experience / Collaborations",first:"Describe a problem you know well and what a good outcome looks like.",tags:["interest:people","potential:client-support"]}
];
const approaches=[
 {id:"try",label:"Give me one small real task",description:"Start with something useful, then learn what helped.",tag:"preference:hands-on"},
 {id:"watch",label:"Show me an example first",description:"See how someone else approaches it, then try.",tag:"preference:guided"},
 {id:"learn",label:"I'd rather learn a bit first",description:"Browse a short lesson before choosing a contribution.",tag:"preference:learning-first"}
];
const chosen=new Set();let approach=null;
const option=(host,label,active,onclick,desc)=>{
 const b=document.createElement("button");b.type="button";b.className="fit-choice"+(active?" selected":"");b.setAttribute("aria-pressed",String(active));b.addEventListener("click",onclick);
 const strong=document.createElement("strong");strong.textContent=label;b.append(strong);
 if(desc){const span=document.createElement("span");span.textContent=desc;b.append(span);}
 host.append(b);
};
function renderChoices(){
 const a=document.getElementById("interest-options"),b=document.getElementById("approach-options");a.replaceChildren();b.replaceChildren();
 for(const item of interests)option(a,item.label,chosen.has(item.id),()=>{if(chosen.has(item.id))chosen.delete(item.id);else if(chosen.size<3)chosen.add(item.id);else{document.getElementById("fit-result").textContent="Choose up to three interests. Deselect one to try another.";return;}render();});
 for(const item of approaches)option(b,item.label,approach===item.id,()=>{approach=approach===item.id?null:item.id;render();},item.description);
}
function summary(){
 const selected=interests.filter(i=>chosen.has(i.id));
 return ["AeroVista — My exploration notes","Self-reported interests: "+(selected.length?selected.map(i=>i.label).join("; "):"Not selected"),
 "Preferred way to begin: "+(approaches.find(i=>i.id===approach)?.label||"Not selected"),
 "Possible starting areas: "+(selected.length?selected.map(i=>i.divisions).join("; "):"Explore AeroVista first"),
 "Suggested first wins: "+(selected.length?selected.map(i=>i.first).join(" | "):"Browse the welcome and choose one idea"),
 "Suggested DISCOVERY tags (not verified skills or access): "+[...selected.flatMap(i=>i.tags),...(approaches.find(i=>i.id===approach)?[approaches.find(i=>i.id===approach).tag]:[])].join(", "),
 "Nothing on this page was saved to AeroVista Identity. Discuss these notes with your onboarding lead."].join("\n");
}
function renderResult(){
 const box=document.getElementById("fit-result");box.replaceChildren();
 const heading=document.createElement("h3");heading.textContent=chosen.size?"Here are some places you could begin":"Your possible starting points";box.append(heading);
 const selected=interests.filter(i=>chosen.has(i.id));
 if(!selected.length){const p=document.createElement("p");p.textContent="Pick one or two interests above. There isn't a wrong answer.";box.append(p);return;}
 const ul=document.createElement("ul");
 for(const item of selected){const li=document.createElement("li"),strong=document.createElement("strong");strong.textContent=item.divisions;li.append(strong,document.createTextNode(" — "+item.first));ul.append(li);}
 box.append(ul);
 const p=document.createElement("p");p.textContent="These are invitations, not assignments or skill ratings. You can start with one small useful contribution.";box.append(p);
}
function render(){renderChoices();renderResult();}
document.getElementById("clear-fit").addEventListener("click",()=>{chosen.clear();approach=null;render();});
document.getElementById("copy-fit").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summary());const btn=document.getElementById("copy-fit");btn.textContent="Copied — share when you're ready";}catch{const box=document.getElementById("fit-result"),p=document.createElement("pre");p.textContent=summary();p.className="copy-fallback";box.append(p);}});
render();