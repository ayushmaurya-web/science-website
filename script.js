// ===== ONE-TIME CONFIGURATION =====
const EMAIL_CONFIG = { scriptUrl: "https://script.google.com/macros/s/AKfycbzS2DdSihg4uNLUB37lWIo4rqndcxW2exOZFrzEWjZVrya7n3lD_4R-6M4CxBfWbYVH/exec" };
const chapterVideos = {1:"https://www.youtube.com/live/rxKt3aUiZ2M",
2:"https://www.youtube.com/live/I3jGY5VMfxA",
3:"https://www.youtube.com/live/FE2srz-hbLQ",
4:"https://www.youtube.com/live/a90pmynHj5Y",
5:"https://www.youtube.com/live/xkGsuSOyeCo",
6:"https://www.youtube.com/live/PzFiCrs607A",
7:"https://www.youtube.com/live/qhrRUUnziDI",
8:"https://www.youtube.com/live/wE96aa4zp-8",
9:"https://www.youtube.com/live/AEvO7-lRRBE",
10:"https://www.youtube.com/live/PsvqCfVNZXs",
11:"https://www.youtube.com/live/eTcE2KZUYHg",
12:"https://www.youtube.com/live/cUFbTNNXYPg",
13:"https://www.youtube.com/live/OSaiGPvkFpo"};
// ==================================
const CH = [
["रासायनिक अभिक्रियाएँ एवं समीकरण","Types of chemical reactions and balancing equations."],
["अम्ल, क्षार एवं लवण","Acids, bases, pH scale and common salts."],
["धातु एवं अधातु","Properties, reactivity series, ionic bonding and corrosion."],
["कार्बन एवं उसके यौगिक","Covalent bonding, carbon compounds and homologous series."],
["जैव प्रक्रम","Nutrition, respiration, transport and excretion."],
["नियंत्रण एवं समन्वय","Nervous system, reflex action and hormones."],
["जीव जनन कैसे करते हैं?","Asexual and sexual reproduction in organisms."],
["आनुवंशिकता","Heredity, Mendel's laws and sex determination."],
["प्रकाश – परावर्तन तथा अपवर्तन","Reflection, refraction, mirrors and lenses."],
["मानव नेत्र तथा रंग-बिरंगा संसार","Human eye, defects of vision and dispersion of light."],
["विद्युत","Current, Ohm's law, resistance and electric power."],
["विद्युत धारा का चुंबकीय प्रभाव","Magnetic fields, electric motor and induction."],
["हमारा पर्यावरण","Ecosystem, food chains and waste management."]
].map((c,i)=>({n:i+1,hi:c[0],en:c[1]}));
const RES = {notes:"Chapter Notes", mindmap:"Mind Map", book:"NCERT Book"};
const $ = s => document.querySelector(s), app = $("#app");
const state = { q:"" };
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const path = (n,t) => `content/chapter-${n}/${t}.pdf`;
const PYQ_YEARS = [2022,2023,2024,2025,2026];
const MODEL_PDF = "model-paper/model-paper.pdf";
// ---------- YouTube ----------
const YT_ID = /^[\w-]{11}$/;
const ytId = u => {
  u = String(u||"").trim(); if(!u) return null;
  try{
    const x = new URL(/^https?:\/\//i.test(u) ? u : "https://"+u), h = x.hostname.replace(/^www\.|^m\./,"");
    let id = null;
    if(h==="youtu.be") id = x.pathname.split("/")[1];
    else if(h==="youtube.com"||h==="youtube-nocookie.com") id = x.searchParams.get("v")||(x.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/)||[])[2];
    return id && YT_ID.test(id) ? id : null;
  }catch(e){ return null; }
};

// ---------- PDF LINKS (fixed paths; no automatic detection) ----------
const errNote = () => "";

// Always show View and Download links. The PDF must be placed at the fixed path.
function pdfActions(p, fileName, viewTxt, dlTxt){
  const pdfPath = "./" + p;
  return `<a class="btn sm" href="${pdfPath}" target="_blank" rel="noopener">${viewTxt}</a><a class="btn sm alt" href="${pdfPath}" download="${esc(fileName)}">${dlTxt}</a>`;
}
const resRow = (title, p, fileName, v, d) => `<div class="res"><div class="rt"><b>${title}</b></div><div class="ra">${pdfActions(p,fileName,v,d)}</div></div>`;

const currentName = () => (location.hash.replace(/^#\/?/,"").split("?")[0].split("/")[0]||"home");

function videoBlock(n){
  const raw = (chapterVideos[n]||"").trim(), id = ytId(raw);
  const btn = !raw ? '<button type="button" class="btn sm" disabled>Video Not Added</button>'
    : id ? `<a class="btn sm" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${id}">Watch Video</a>`
    : '<button type="button" class="btn sm" disabled>Invalid Video Link</button>';
  const lab = id ? '<small class="st ok">Video Available</small>' : '<small class="st na">'+(raw?"Check the link in script.js":"Video Not Added")+'</small>';
  return `<div class="res"><div class="rt"><b>Video Lecture</b>${lab}</div><div class="ra">${btn}</div></div>`
    + (id?`<iframe class="video" src="https://www.youtube-nocookie.com/embed/${id}" title="Chapter ${n} video" allowfullscreen loading="lazy"></iframe>`:"");
}

function chapterCard(c){
  const chips = Object.keys(RES).map(t=>`<span class="chip">${RES[t]}</span>`).join("")
    + (ytId(chapterVideos[c.n])?'<span class="chip">Video</span>':"");
  return `<a class="card" href="#/chapter/${c.n}"><span class="num">Chapter ${String(c.n).padStart(2,"0")}</span><h3 class="hi">${c.hi}</h3><p>${c.en}</p><div class="chips">${chips}</div></a>`;
}

const views = {
home(){ return `
<section class="hero"><div class="wrap"><p class="eyebrow">UP Board Class 10 Science · Session 2026–27</p>
<h1>Study material, organized the way exams actually work.</h1>
<p class="lead">Notes, Question Banks, Mind Maps and Previous Year Papers — organized for smarter preparation.</p>
<div class="btns"><a class="btn" href="#/chapters">Browse Chapters</a><a class="btn alt" href="#/pyq">Previous Year Papers</a></div>
<div class="stats"><div><b>13</b><span>Chapters</span></div><div><b>2022–2026</b><span>Paper archive</span></div><div><b>4</b><span>Resource types</span></div></div></div></section>
<section class="sec soft"><div class="wrap"><p class="kick">Start here</p><h2>Science chapters</h2>${errNote()}<div class="grid">${CH.map(chapterCard).join("")}</div></div></section>
<section class="sec"><div class="wrap"><p class="kick">What's inside</p><h2>Four kinds of resources, one place</h2><div class="grid">
<div class="card"><h3>Chapter Notes</h3><p>Concise revision notes for every chapter.</p></div>
<div class="card"><h3>NCERT E-Books</h3><p>Chapter-wise NCERT PDFs to read or download.</p></div>
<div class="card"><h3>Mind Maps</h3><p>Visual summaries for quick revision.</p></div>
<div class="card"><h3>Previous Year Papers</h3><p>Board papers from 2022 to 2026, sorted by year.</p></div></div></div></section>
<section class="sec soft"><div class="wrap"><p class="kick">Before the exam</p><h2>Quick revision</h2><div class="grid">
<a class="card" href="#/chapters"><h3>Mind Maps</h3><p>One page per chapter.</p></a>
<a class="card" href="#/pyq"><h3>Last year's paper</h3><p>See the pattern first-hand.</p></a>
<a class="card" href="#/model"><h3>Model Paper</h3><p>Practise under exam conditions.</p></a></div></div></section>
<section class="sec"><div class="wrap"><p class="kick">Why this site</p><h2>Built to revise from</h2><ul class="why">
<li><b>Chapter-first.</b> Everything for a chapter sits on one page.</li>
<li><b>Works on a phone.</b> Layout, buttons and PDFs are sized for small screens.</li>
<li><b>Always in place.</b> Every button is ready; it switches on as soon as its PDF is published.</li>
<li><b>Kept current.</b> New material is added as soon as it is ready.</li></ul></div></section>
<div class="wrap"><div class="cta"><h2>Ready to start revising?</h2><p>Open a chapter or pull up last year's paper.</p><a class="btn gold" href="#/chapters">Browse Chapters</a></div></div>`; },

chapters(){ return `<div class="wrap page"><h1>Chapters</h1><p class="lead">Class 10 Science · all 13 chapters.</p>${errNote()}
<label for="q" class="sr">Search</label><input id="q" class="search" type="search" placeholder="Search by number, Hindi name, topic or resource (notes, mind map, book, video)">
<div id="list" class="grid"></div></div>`; },

chapter(n){ const c = CH[n-1]; if(!c) return views.notfound();
  const rows = Object.keys(RES).map(t=>resRow(RES[t], path(n,t), `Chapter-${n}-${{notes:"Notes",mindmap:"Mind-Map",book:"NCERT-Book"}[t]}.pdf`, "View PDF", "Download PDF")).join("");
  return `<div class="wrap page"><a href="#/chapters">← All chapters</a><p class="num" style="margin-top:14px">Chapter ${String(n).padStart(2,"0")}</p><h1 class="hi" style="font-size:2rem">${c.hi}</h1><p class="lead">${c.en}</p>${errNote()}
  ${rows}
  <h2 style="margin-top:28px">Watch Video</h2>${videoBlock(n)}</div>`; },

pyq(){ const ys=[...PYQ_YEARS].reverse();
  return `<div class="wrap page"><h1>Previous Year Papers</h1><p class="lead">UP Board Class 10 Science, 2022–2026.</p>${errNote()}
  ${ys.map(y=>resRow(`<span class="serif">${y}</span>`, `pyq/${y}.pdf`, `Science-Paper-${y}.pdf`, "View Paper", "Download Paper")).join("")}</div>`; },

model(){
  return `<div class="wrap page"><h1>Model Papers</h1><p class="lead">Practice paper for the 2027 board examination.</p>${errNote()}
  ${resRow("Model Paper", MODEL_PDF, "Model-Paper.pdf", "View Paper", "Download Paper")}</div>`; },

contact(){ return `<div class="wrap page"><h1>Contact Us</h1><p class="lead">Questions or corrections? Send a message and it reaches ayushmaurya.education@gmail.com.</p>
<form id="cf" novalidate><label>Full Name *<input name="name" required maxlength="100" autocomplete="name"></label>
<label>Email Address *<input name="email" type="email" required maxlength="150" autocomplete="email"></label>
<label>Mobile Number (optional)<input name="mobile" type="tel" maxlength="15" autocomplete="tel"></label>
<label>Message *<textarea name="message" rows="5" required maxlength="3000"></textarea></label>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" id="sendBtn" type="submit">Send Message</button><div id="status" role="status"></div></form></div>`; },

notfound(){ return `<div class="wrap page"><h1>Page not found</h1><p><a href="#/">Go to the home page</a></p></div>`; }
};

function route(opts){
  opts = opts||{};
  const prevQ = document.getElementById("q"); const hadFocus = prevQ && document.activeElement===prevQ;
  if(prevQ) state.q = prevQ.value;
  const h = location.hash.replace(/^#\/?/,""), seg = h.split("?")[0].split("/");
  const name = seg[0]||"home"; let html;
  if(name==="chapter") html = views.chapter(parseInt(seg[1],10));
  else html = (views[name]&&name!=="notfound"&&name!=="chapter") ? views[name]() : views.notfound();
  app.innerHTML = html;
  document.querySelectorAll(".nav a").forEach(a=>a.classList.toggle("on",a.dataset.r===(name==="chapter"?"chapters":name)));
  $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded","false");
  if(name==="chapters") initSearch(opts.keep?state.q:"", hadFocus); if(name==="contact") initForm();
  if(!opts.keep) window.scrollTo(0,0);
}
function initSearch(initial, refocus){
  const q=$("#q"), list=$("#list"); q.value = initial||"";
  const draw=()=>{ const raw=q.value.trim(), s=raw.toLowerCase();
    const kw = c => "notes note mind map mindmap ncert book chapter "+c.n+(ytId(chapterVideos[c.n])?" video youtube":"");
    const m=CH.filter(c=> !s||String(c.n)===s||("chapter "+c.n).includes(s)||c.hi.includes(raw)||c.en.toLowerCase().includes(s)||kw(c).includes(s));
    list.innerHTML = m.length?m.map(chapterCard).join(""):'<p class="note">No chapters match your search.</p>'; };
  q.addEventListener("input",draw); draw(); if(refocus) q.focus();
}
function initForm(){
  const f=$("#cf"), st=$("#status"), btn=$("#sendBtn"); let busy=false;
  f.addEventListener("submit", async e=>{ e.preventDefault(); if(busy) return;
    const d=Object.fromEntries(new FormData(f)); const show=(c,t)=>{st.className="msg "+c; st.textContent=t;};
    if(!d.name.trim()||!d.message.trim()) return show("err","Please fill in your name and message.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return show("err","Please enter a valid email address.");
    if(!/^https:\/\/script\.google\.com\//.test(EMAIL_CONFIG.scriptUrl)) return show("err","Contact form is not configured yet.");
    busy=true; btn.disabled=true; btn.textContent="Sending…"; show("","");
    try{
      const r=await fetch(EMAIL_CONFIG.scriptUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
      const j=await r.json();
      if(j.ok){ f.reset(); show("ok","Thank you! Your message has been sent."); } else show("err",j.message||"Message could not be sent.");
    }catch(err){ show("err","Message could not be sent. Check your connection and try again."); }
    busy=false; btn.disabled=false; btn.textContent="Send Message";
  });
}
$("#menuBtn").addEventListener("click",()=>{ const o=$("#nav").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded",o); });
window.addEventListener("hashchange",route);
route();
