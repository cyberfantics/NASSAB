/* NASSAB shared script v2: menu, tour, diagram, gallery lightbox, records form.
   Guards every feature so pages without that feature do not error. */
let currentSubmissionPayload = null;
const GALLERY = [
  {src:"images/app-welcome.jpg", fallback:"images/Screenshot_20261027-112655.jpg.jpeg", title:"Welcome", desc:"The opening screen of NASSAB."},
  {src:"images/app-explore.jpg", fallback:"images/Screenshot_20261027-112708.jpg.jpeg", title:"Explore historical people", desc:"Browse recorded historical people."},
  {src:"images/app-tree.jpg", fallback:"images/Screenshot_20261027-112749.jpg.jpeg", title:"Family tree", desc:"A horizontal view of a recorded lineage."},
  {src:"images/app-person.jpg", fallback:"images/Screenshot_20261027-112720.jpg.jpeg", title:"Person detail", desc:"Spouses, marriage history and children, kept distinct."},
  {src:"images/app-fan.jpg", fallback:"images/Screenshot_20261027-112900.jpg.jpeg", title:"Fan chart", desc:"Generations shown as a fan, with a movable focus."},
  {src:"images/app-verify.jpg", fallback:"images/Screenshot_20261027-112643.jpg.jpeg", title:"Verify certificate", desc:"Verify a certificate by PDF file or by Serial ID."}
];
const TOUR = [
  {title:"Welcome", desc:"The opening screen of NASSAB, with a thoughtful home for your family tree."},
  {title:"Explore historical people", desc:"Browse recorded historical people, search by name, and open a read-only historical record."},
  {title:"Family tree", desc:"View a lineage as a horizontal tree, move the focus between generations, and keep marriages and children distinct."},
  {title:"Person detail", desc:"Open a person to see spouses, marriage history and children, with recorded status shown plainly."},
  {title:"Fan chart", desc:"See generations as a fan chart, with paternal and maternal routes shown separately."},
  {title:"Verify certificate", desc:"Verify a lineage certificate by PDF file for anti-tamper integrity, or by Serial ID, using SHA-256 document-integrity checking."}
];
let tourIndex = 0;
let visibleGallery = [0,1,2,3,4,5];

document.addEventListener("DOMContentLoaded", () => {
  const formInputs = ["form-name","form-email","form-phone","form-branch","form-type","form-details"];
  formInputs.forEach(id => { const el = document.getElementById(id); if (el) { el.addEventListener("input", updateLivePreview); el.addEventListener("change", updateLivePreview); } });
  renderSubmissionsList(); updateLivePreview();
  document.querySelectorAll("[data-img-fallback]").forEach(img => {
    img.addEventListener("error", function handler(){ if (img.dataset.imgFallback && img.src.indexOf(img.dataset.imgFallback) === -1) { img.src = img.dataset.imgFallback; } else { img.removeEventListener("error", handler); const wrap = img.closest(".gallery-item, .phone, .tour-phone"); if (wrap) wrap.style.display = "none"; const note = document.getElementById("gallery-note"); if (note) note.style.display = "block"; } });
  });
  // Mobile menu: close on any link click
  const mm = document.getElementById("mobile-menu");
  if (mm) mm.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileMenu));
  // Tour init
  if (document.getElementById("tour-img")) selectTour(0, false);
  const tourEl = document.getElementById("theatre");
  if (tourEl) tourEl.addEventListener("keydown", e => { if (e.key === "ArrowRight") tourNext(); if (e.key === "ArrowLeft") tourPrev(); });
  // Gallery filter init
  if (document.getElementById("gallery-grid")) setGalleryFilter("all", null);
  // Features filter init
  if (document.getElementById("feature-search")) applyFeatureFilter();
  // Scroll reveal (added via JS only, so no-JS pages stay visible)
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), {threshold: 0.08});
    document.querySelectorAll("section.section").forEach(s => { s.classList.add("reveal"); io.observe(s); });
  }
  // Back to top
  const btt = document.getElementById("back-to-top");
  if (btt) window.addEventListener("scroll", () => { btt.classList.toggle("show", window.scrollY > 600); }, {passive:true});
  // Lightbox swipe (touch + mouse drag)
  const lb = document.getElementById("lightbox");
  if (lb) {
    let sx = null, sy = null;
    const start = x => { sx = x; };
    const end = x => { if (sx === null) return; const dx = x - sx; sx = null; if (Math.abs(dx) > 50) { if (dx < 0) lightboxNext(); else lightboxPrev(); } };
    lb.addEventListener("touchstart", e => { if (e.touches[0]) start(e.touches[0].clientX); }, {passive:true});
    lb.addEventListener("touchend", e => { if (e.changedTouches[0]) end(e.changedTouches[0].clientX); });
    lb.addEventListener("mousedown", e => { if (!e.target.closest("button")) start(e.clientX); });
    lb.addEventListener("mouseup", e => { if (!e.target.closest("button")) end(e.clientX); });
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const lb = document.getElementById("lightbox");
    if (lb && lb.classList.contains("open")) { closeLightbox(); return; }
    const modal = document.getElementById("submission-modal");
    if (modal && modal.classList.contains("open")) { closeModal(); return; }
    closeMobileMenu();
  }
  const lb = document.getElementById("lightbox"); if (!lb || !lb.classList.contains("open")) return;
  if (e.key === "ArrowRight") lightboxStep(1);
  if (e.key === "ArrowLeft") lightboxStep(-1);
  if (e.key === "Tab") { const focusable = lb.querySelectorAll("button"); if (!focusable.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
});
function toggleMobileMenu(){
  const m = document.getElementById("mobile-menu"); if (!m) return;
  const open = m.classList.toggle("open");
  const btn = document.getElementById("menu-btn"); if (btn) { btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "✕ Close" : "☰ Menu"; }
  if (open) { const first = m.querySelector("a"); if (first) first.focus(); }
}
function closeMobileMenu(){
  const m = document.getElementById("mobile-menu"); if (!m || !m.classList.contains("open")) return;
  m.classList.remove("open");
  const btn = document.getElementById("menu-btn"); if (btn) { btn.setAttribute("aria-expanded", "false"); btn.textContent = "☰ Menu"; }
}
function switchAboutStyle(style){
  const modern = document.getElementById("about-content-modern"), trad = document.getElementById("about-content-traditional");
  const bm = document.getElementById("toggle-modern"), bt = document.getElementById("toggle-traditional");
  if (!modern || !trad) return;
  const isTrad = style === "traditional";
  modern.classList.toggle("hidden", isTrad); trad.classList.toggle("hidden", !isTrad);
  if (bm) { bm.classList.toggle("active", !isTrad); bm.setAttribute("aria-pressed", String(!isTrad)); }
  if (bt) { bt.classList.toggle("active", isTrad); bt.setAttribute("aria-pressed", String(isTrad)); }
}
/* App tour (Home): GALLERY order = tour order, lightbox index stays in sync */
function selectTour(i, animate){
  if (!GALLERY[i]) return; tourIndex = i;
  const img = document.getElementById("tour-img"), t = document.getElementById("tour-title"), d = document.getElementById("tour-desc"), p = document.getElementById("tour-progress"), bar = document.getElementById("tour-bar");
  const apply = () => {
    if (img) { img.src = GALLERY[i].src; img.dataset.imgFallback = GALLERY[i].fallback; img.alt = TOUR[i].title + " screen from the NASSAB app"; img.style.opacity = "1"; }
    if (t) t.textContent = TOUR[i].title;
    if (d) d.textContent = TOUR[i].desc;
    if (p) p.textContent = "Step " + (i + 1) + " of " + TOUR.length;
    if (bar) bar.style.width = ((i + 1) / TOUR.length * 100) + "%";
    document.querySelectorAll(".tour-nav button").forEach((b, j) => { b.classList.toggle("active", j === i); b.setAttribute("aria-current", j === i ? "step" : "false"); });
    document.querySelectorAll(".tour-dots button").forEach((b, j) => { b.classList.toggle("active", j === i); b.setAttribute("aria-current", j === i ? "step" : "false"); });
    const prev = document.getElementById("tour-prev"), next = document.getElementById("tour-next");
    if (prev) prev.disabled = (i === 0);
    if (next) next.disabled = (i === TOUR.length - 1);
    document.querySelectorAll("[data-motif]").forEach(m => { m.classList.toggle("hidden", parseInt(m.dataset.motif, 10) !== i); });
    if (t) { t.classList.remove("title-flip"); void t.offsetWidth; t.classList.add("title-flip"); }
    const phoneBtn = document.getElementById("tour-phone-btn");
    if (phoneBtn) phoneBtn.setAttribute("aria-label", "View " + TOUR[i].title + " screenshot larger");
  };
  if (img && animate !== false) { img.style.opacity = "0"; setTimeout(apply, 150); } else apply();
}
function tourNext(){ if (tourIndex < TOUR.length - 1) selectTour(tourIndex + 1); }
function tourPrev(){ if (tourIndex > 0) selectTour(tourIndex - 1); }
function tourFirst(){ selectTour(0); }
/* Relationship diagram: SVG nodes + buttons stay in sync */
function selectDiagram(key, el){
  const detail = document.getElementById("diagram-detail"); if (!detail) return;
  const texts = {
    ancestor:"Ancestor — the starting point of a recorded lineage. Other relationships are described from this point, without inventing dates or records.",
    descendant:"Descendant line — children and later generations, recorded without duplicate person records.",
    radaat:"Rada'at branch — milk-kinship recorded as its own relationship type, distinct from blood and marriage relationships.",
    marriage:"Marriage history — current and former marriages kept distinct, with history preserved, so a former spouse is never shown as currently married."
  };
  detail.textContent = texts[key] || texts.ancestor;
  document.querySelectorAll("[data-diagram-key]").forEach(n => {
    const on = n.dataset.diagramKey === key;
    n.classList.toggle("active", on); n.classList.toggle("dim", !on);
    if (n.tagName === "BUTTON") n.setAttribute("aria-pressed", String(on));
    if (n.tagName === "G") n.setAttribute("aria-pressed", String(on));
  });
  document.querySelectorAll("[data-diagram-line]").forEach(l => { const on = l.dataset.diagramLine === key || key === "ancestor"; l.classList.toggle("active", on); l.classList.toggle("dim", !on); l.classList.remove("draw"); if (on) { void l.getBoundingClientRect(); l.classList.add("draw"); } });
}
function diagramKey(e, key){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectDiagram(key, e.currentTarget); } }
/* Gallery filter + lightbox */
const GALLERY_GROUPS = {all:[0,1,2,3,4,5], tree:[2,4], people:[1,3], welcome:[0], verify:[5]};
function setGalleryFilter(group, btn){
  const list = GALLERY_GROUPS[group] || GALLERY_GROUPS.all; visibleGallery = list;
  document.querySelectorAll(".filter-chips button").forEach(b => { const on = b.dataset.filter === group; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); });
  let shown = 0;
  document.querySelectorAll("#gallery-grid .gallery-item").forEach(item => {
    const idx = parseInt(item.dataset.galleryIndex, 10); const on = list.includes(idx); item.style.display = on ? "" : "none"; if (on) shown++;
  });
  const c = document.getElementById("gallery-count"); if (c) c.textContent = "Showing " + shown + " of 6";
}
let lbIndex = 0, lbOpener = null, lbZoom = false, lbFlipClone = null, lastThumbImg = null;
/* Capture the clicked thumbnail before inline onclick handlers run (document
   capture runs first), so FLIP knows its exact source rect on every entry. */
document.addEventListener("click", e => {
  const b = e.target && e.target.closest ? e.target.closest("button") : null;
  if (b) { const im = b.querySelector("img"); if (im) lastThumbImg = im; }
}, true);
function findVisibleThumb(i){
  const base = GALLERY[i] ? GALLERY[i].src.split("/").pop() : "";
  if (!base) return null;
  const imgs = document.querySelectorAll("img");
  for (const im of imgs) {
    if (im.src && im.src.indexOf(base) !== -1) {
      const r = im.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) return im;
    }
  }
  return null;
}
function lbRemoveClone(){ if (lbFlipClone && lbFlipClone.parentNode) lbFlipClone.parentNode.removeChild(lbFlipClone); lbFlipClone = null; }
function lbShowReal(){
  const img = document.getElementById("lightbox-img"); if (img) img.classList.remove("lb-flip-hidden");
  const lb = document.getElementById("lightbox"); if (lb) lb.classList.remove("lb-flip");
}
function openLightbox(i){
  const item = GALLERY[i]; if (!item) return;
  if (!visibleGallery.includes(i)) visibleGallery = [0,1,2,3,4,5];
  const lb = document.getElementById("lightbox"); if (!lb) return;
  const wasOpen = lb.classList.contains("open");
  /* Stepping (Prev/Next/swipe) must not overwrite the original opener, or
     focus restore on close would land on the Prev/Next button. */
  if (!wasOpen) lbOpener = document.activeElement;
  lbRemoveClone(); lbShowReal();
  lbIndex = i; lbZoom = false;
  const img = document.getElementById("lightbox-img"), cap = document.getElementById("lightbox-caption"), cnt = document.getElementById("lightbox-count");
  img.src = item.src; img.dataset.imgFallback = item.fallback; img.alt = item.title + " screen from the NASSAB app"; img.classList.remove("zoomed");
  const zb = document.getElementById("lightbox-zoom"); if (zb) zb.setAttribute("aria-pressed", "false");
  if (cap) cap.textContent = item.title + " — " + item.desc;
  const pos = visibleGallery.indexOf(i) + 1;
  if (cnt) cnt.textContent = pos + " of " + visibleGallery.length;
  lb.classList.add("open"); document.body.style.overflow = "hidden";
  const closeBtn = document.getElementById("lightbox-close"); if (closeBtn) closeBtn.focus();
  /* Shared-element FLIP on fresh opens only (not Prev/Next/swipe steps, which
     have no thumbnail to fly from and keep the scale-and-fade fallback).
     Reduced-motion: instant, no FLIP. Any FLIP failure falls back to the
     real image with the existing scale-and-fade animation. */
  const reducedLB = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (wasOpen || reducedLB) return;
  const src = (lastThumbImg && lastThumbImg.getBoundingClientRect().width > 0) ? lastThumbImg : findVisibleThumb(i);
  if (!src) return;
  lb.classList.add("lb-flip"); img.classList.add("lb-flip-hidden");
  const doFlip = () => {
    try {
      const sr = src.getBoundingClientRect(), tr = img.getBoundingClientRect();
      if (!sr.width || !tr.width || !img.complete || !img.naturalWidth) { lbShowReal(); return; }
      const clone = document.createElement("img"); clone.src = img.src; clone.alt = ""; clone.setAttribute("aria-hidden", "true"); clone.className = "lb-clone";
      clone.style.left = tr.left + "px"; clone.style.top = tr.top + "px"; clone.style.width = tr.width + "px"; clone.style.height = tr.height + "px"; clone.style.transformOrigin = "top left";
      document.body.appendChild(clone); lbFlipClone = clone;
      const dx = sr.left - tr.left, dy = sr.top - tr.top, sx = sr.width / tr.width, sy = sr.height / tr.height;
      const anim = clone.animate(
        [{transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")"}, {transform: "translate(0px,0px) scale(1,1)"}],
        {duration: 300, easing: "ease-out"});
      const done = () => { lbRemoveClone(); lbShowReal(); };
      if (anim && anim.finished) anim.finished.then(done).catch(done); else setTimeout(done, 320);
    } catch (e) { lbRemoveClone(); lbShowReal(); }
  };
  if (img.complete && img.naturalWidth) requestAnimationFrame(() => requestAnimationFrame(doFlip));
  else {
    const onLoad = () => { img.removeEventListener("load", onLoad); if (lb.classList.contains("open") && lbIndex === i) doFlip(); };
    img.addEventListener("load", onLoad);
    setTimeout(() => { img.removeEventListener("load", onLoad); if (lb.classList.contains("open") && lbIndex === i) lbShowReal(); }, 600);
  }
}
function closeLightbox(){
  const lb = document.getElementById("lightbox"); if (!lb || !lb.classList.contains("open")) return;
  const img = document.getElementById("lightbox-img");
  const finish = () => {
    lbRemoveClone(); lb.classList.remove("open"); lb.classList.remove("lb-flip");
    if (img) img.classList.remove("lb-flip-hidden"); document.body.style.overflow = "";
    if (lbOpener && lbOpener.focus) { try { lbOpener.focus(); } catch (e) {} }
  };
  /* Reverse FLIP only when it can land on a visible thumbnail for the
     current image; otherwise instant close (reduced-motion, zoomed, or the
     thumbnail scrolled/filtered away). Focus restore always runs. */
  const reducedLB = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const src = findVisibleThumb(lbIndex);
  if (reducedLB || lbZoom || !src || !img || !img.complete) { finish(); return; }
  try {
    const sr = src.getBoundingClientRect(), tr = img.getBoundingClientRect();
    if (!sr.width || !tr.width) { finish(); return; }
    lb.classList.add("lb-flip"); img.classList.add("lb-flip-hidden");
    const clone = document.createElement("img"); clone.src = img.src; clone.alt = ""; clone.setAttribute("aria-hidden", "true"); clone.className = "lb-clone";
    clone.style.left = tr.left + "px"; clone.style.top = tr.top + "px"; clone.style.width = tr.width + "px"; clone.style.height = tr.height + "px"; clone.style.transformOrigin = "top left";
    document.body.appendChild(clone); lbFlipClone = clone;
    const dx = sr.left - tr.left, dy = sr.top - tr.top, sx = sr.width / tr.width, sy = sr.height / tr.height;
    const anim = clone.animate(
      [{transform: "translate(0px,0px) scale(1,1)"}, {transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")"}],
      {duration: 280, easing: "ease-in"});
    const done = () => finish();
    if (anim && anim.finished) anim.finished.then(done).catch(done); else setTimeout(done, 300);
  } catch (e) { finish(); }
}
function lightboxStep(dir){
  const pos = visibleGallery.indexOf(lbIndex); const nextPos = (pos + dir + visibleGallery.length) % visibleGallery.length; openLightbox(visibleGallery[nextPos]);
}
function lightboxNext(){ lightboxStep(1); } function lightboxPrev(){ lightboxStep(-1); }
function toggleLightboxZoom(){
  const img = document.getElementById("lightbox-img"); if (!img) return;
  lbZoom = !lbZoom; img.classList.toggle("zoomed", lbZoom);
  const zb = document.getElementById("lightbox-zoom"); if (zb) zb.setAttribute("aria-pressed", String(lbZoom));
}
/* Features search + group filter */
let featureGroup = "all";
function setFeatureGroup(group, btn){
  featureGroup = group;
  document.querySelectorAll(".feature-filters button").forEach(b => { const on = b.dataset.group === group; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); });
  applyFeatureFilter();
}
function clearFeatureFilter(){
  const s = document.getElementById("feature-search"); if (s) s.value = "";
  setFeatureGroup("all", null);
}
function applyFeatureFilter(){
  const q = (document.getElementById("feature-search") ? document.getElementById("feature-search").value : "").trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll(".feature-group").forEach(g => {
    const groupOk = featureGroup === "all" || g.dataset.group === featureGroup;
    const textOk = !q || g.textContent.toLowerCase().includes(q);
    const on = groupOk && textOk; g.style.display = on ? "" : "none"; if (on) shown++;
  });
  const nr = document.getElementById("feature-no-results"); if (nr) nr.style.display = shown ? "none" : "block";
  const c = document.getElementById("feature-count"); if (c) c.textContent = shown ? ("Showing " + shown + " of 5 groups") : "";
}
/* Records form — preserved local-only behaviour */
function updateLivePreview(){
  const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("preview-name", get("form-name") || "Your Name");
  set("preview-email", get("form-email") || "your.email@domain.com");
  set("preview-type", (get("form-type") || "New Record Addition") + " — " + (get("form-branch") || "General Lineage"));
  set("preview-phone", "Phone: " + (get("form-phone") || "Not provided"));
  set("preview-details", get("form-details") || "Your update details will appear here as you type...");
}
function handleFileSelect(){
  const f = document.getElementById("form-file"), label = document.getElementById("file-label");
  if (f && f.files && f.files[0] && label) label.textContent = f.files[0].name + " (" + Math.round(f.files[0].size / 1024) + " KB)";
}
function handleFormSubmit(event){
  if (event) event.preventDefault();
  const nameEl = document.getElementById("form-name"), emailEl = document.getElementById("form-email"), detailsEl = document.getElementById("form-details");
  let ok = true;
  [[nameEl, "name"], [emailEl, "email"], [detailsEl, "details"]].forEach(([el]) => { if (!el) return; const field = el.closest(".field"); const valid = el.value.trim() !== "" && (el.id !== "form-email" || /.+@.+\..+/.test(el.value.trim())); if (field) field.classList.toggle("invalid", !valid); if (!valid) ok = false; });
  if (!ok) { showToast("Please complete the required fields, including a valid email."); return false; }
  const fileInput = document.getElementById("form-file");
  const payload = { ticketId: "NSB-" + Date.now().toString().slice(-6), timestamp: new Date().toLocaleString(), name: nameEl.value.trim(), email: emailEl.value.trim(), phone: document.getElementById("form-phone").value.trim(), branch: document.getElementById("form-branch").value.trim(), type: document.getElementById("form-type").value, details: detailsEl.value.trim(), fileName: fileInput && fileInput.files[0] ? fileInput.files[0].name : "None" };
  currentSubmissionPayload = payload; saveSubmissionToHistory(payload);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("modal-ticket-id", payload.ticketId); set("modal-name", payload.name); set("modal-type", payload.type); set("modal-email", payload.email); set("modal-timestamp", payload.timestamp);
  const modal = document.getElementById("submission-modal"); if (modal) modal.classList.add("open");
  const form = document.getElementById("record-form"); if (form) form.reset(); updateLivePreview();
  return false;
}
function saveSubmissionToHistory(p){
  try { const list = JSON.parse(localStorage.getItem("nassab_submissions") || "[]"); list.unshift(p); localStorage.setItem("nassab_submissions", JSON.stringify(list.slice(0, 20))); } catch (e) {}
  renderSubmissionsList();
}
function renderSubmissionsList(){
  const el = document.getElementById("submissions-list"); if (!el) return;
  let list = []; try { list = JSON.parse(localStorage.getItem("nassab_submissions") || "[]"); } catch (e) {}
  if (!list.length) { el.innerHTML = "<p class='muted'>No tickets yet in this browser.</p>"; return; }
  el.innerHTML = list.map(item => `<div class="panel" style="padding:14px 16px;margin-bottom:10px"><strong>${item.ticketId}</strong> — ${item.type}<br><span class="muted small">${item.timestamp} · ${item.name}</span><details><summary>View details</summary><p>${item.details || ""}</p><p class="muted small">${item.email || ""} · ${item.phone || "No phone provided"}</p></details><button class="btn btn-text" onclick="reOpenTicket('${item.ticketId}')">View ticket</button></div>`).join("");
}
function reOpenTicket(id){
  let list = []; try { list = JSON.parse(localStorage.getItem("nassab_submissions") || "[]"); } catch (e) {}
  const item = list.find(x => x.ticketId === id); if (!item) return; currentSubmissionPayload = item;
  const set = (x, v) => { const el = document.getElementById(x); if (el) el.textContent = v; };
  set("modal-ticket-id", item.ticketId); set("modal-name", item.name); set("modal-type", item.type); set("modal-email", item.email); set("modal-timestamp", item.timestamp);
  const modal = document.getElementById("submission-modal"); if (modal) modal.classList.add("open");
}
function clearSubmissionHistory(){ try { localStorage.removeItem("nassab_submissions"); } catch (e) {} renderSubmissionsList(); showToast("Local submission history cleared."); }
function closeModal(){ const m = document.getElementById("submission-modal"); if (m) m.classList.remove("open"); }
function sendViaEmail(){
  if (!currentSubmissionPayload) return;
  const p = currentSubmissionPayload;
  const subject = encodeURIComponent("NASSAB Record Update Ticket #" + p.ticketId);
  const body = encodeURIComponent("NASSAB RECORD UPDATE TICKET\nTicket ID: #" + p.ticketId + "\nDate: " + p.timestamp + "\n\nName: " + p.name + "\nEmail: " + p.email + "\nPhone/WhatsApp: " + (p.phone || "N/A") + "\nFamily Branch: " + (p.branch || "General") + "\n\nType: " + p.type + "\nAttachment: " + p.fileName + "\n\nDetails:\n" + p.details);
  window.location.href = "mailto:digital.creator380@gmail.com?subject=" + subject + "&body=" + body;
}
function sendViaWhatsApp(){
  if (!currentSubmissionPayload) return; const p = currentSubmissionPayload;
  const text = encodeURIComponent("NASSAB Record Update Ticket #" + p.ticketId + "\n\nName: " + p.name + "\nEmail: " + p.email + "\nPhone/WhatsApp: " + (p.phone || "N/A") + "\nBranch: " + (p.branch || "General") + "\n\nType: " + p.type + "\n\nDetails:\n" + p.details);
  window.open("https://wa.me/923408100868?text=" + text, "_blank");
  showToast("Opening WhatsApp chat.");
}
function copyToClipboard(){
  if (!currentSubmissionPayload) return; const p = currentSubmissionPayload;
  const text = "NASSAB Ticket #" + p.ticketId + " — " + p.type + " — " + p.name + " — " + p.details;
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showToast("Ticket copied.")); else showToast("Copy not available in this browser.");
}
function showToast(message){
  const t = document.getElementById("toast"), m = document.getElementById("toast-msg"); if (!t) return;
  if (m) m.textContent = message; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3500);
}
function copySubmissionPayload(){ copyToClipboard(); }
function hideGalleryItem(img){ const wrap = img.closest(".gallery-item"); if (wrap) wrap.style.display = "none"; }
function backToTop(){ window.scrollTo({top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}); }

/* Living Heritage additions: progress, compact header, hero pointer, reveals, timeline, seal, privacy demo, Mahram highlight */
function togglePrivacy(state, btn){
  document.querySelectorAll("[data-privacy-btn]").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
  document.querySelectorAll(".pv-row").forEach(row => {
    const label = row.querySelector(".pv-label"); if (!label) return;
    label.textContent = label.dataset[state] || label.dataset.open || label.textContent;
    row.classList.toggle("masked", state === "masked");
  });
}
function toggleMahram(btn){
  const wrap = document.getElementById("mahram-visual"); if (!wrap) return;
  const on = wrap.classList.toggle("hl");
  if (btn) btn.setAttribute("aria-pressed", String(on));
}
document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Scroll progress + compact header (single passive listener, transform only) */
  const prog = document.createElement("div"); prog.id = "scroll-progress"; prog.setAttribute("aria-hidden", "true"); document.body.prepend(prog);
  const header = document.querySelector(".site-header");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
      if (header) header.classList.toggle("scrolled", window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  /* Hero per-node pointer: each SVG node moves individually (desktop mouse only).
     Lines are redrawn from the moved endpoints on every frame, so they stay
     connected. Whole-network shift removed. No pointer code runs on touch or
     reduced-motion (gated below); text is untouched (network is background). */
  const hero = document.querySelector(".hero");
  const net = document.querySelector(".hero-lineage");
  if (hero && net && window.matchMedia("(pointer: fine)").matches && !reduced) {
    const paths = net.querySelectorAll(".ln-path");
    const circles = net.querySelectorAll(".ln-origin, .ln-node");
    const base = []; circles.forEach(c => base.push({x: parseFloat(c.getAttribute("cx")) || 0, y: parseFloat(c.getAttribute("cy")) || 0}));
    const origD = []; paths.forEach(p => origD.push(p.getAttribute("d")));
    /* [path, startNode, endNode, ctrl1 offset, ctrl2 offset]; node order in DOM:
       0 origin (200,60), 1 (70,220), 2 (200,230), 3 (330,220), 4 (200,390).
       Offsets reproduce the original path control points exactly at rest. */
    const conns = [[0,0,1,[0,70],[50,-70]],[1,0,2,[0,70],[0,-70]],[2,0,3,[0,70],[-50,-70]],[3,2,4,[-40,70],[40,-60]]];
    let cur = base.map(() => ({x:0,y:0}));
    let tgt = base.map(() => ({x:0,y:0}));
    let raf = 0;
    const fmt = n => Math.round(n * 10) / 10;
    function renderHero(){
      circles.forEach((c, i) => { if (Math.abs(cur[i].x) > 0.05 || Math.abs(cur[i].y) > 0.05) c.setAttribute("transform", "translate(" + fmt(cur[i].x) + " " + fmt(cur[i].y) + ")"); else c.removeAttribute("transform"); });
      conns.forEach(([pi, si, ei, c1, c2]) => {
        const s = {x: base[si].x + cur[si].x, y: base[si].y + cur[si].y};
        const e = {x: base[ei].x + cur[ei].x, y: base[ei].y + cur[ei].y};
        paths[pi].setAttribute("d", "M" + fmt(s.x) + "," + fmt(s.y) + " C" + fmt(s.x + c1[0]) + "," + fmt(s.y + c1[1]) + " " + fmt(e.x + c2[0]) + "," + fmt(e.y + c2[1]) + " " + fmt(e.x) + "," + fmt(e.y));
      });
    }
    function heroFrame(){
      raf = 0; let moving = false;
      for (let i = 0; i < cur.length; i++) {
        cur[i].x += (tgt[i].x - cur[i].x) * 0.18; cur[i].y += (tgt[i].y - cur[i].y) * 0.18;
        if (Math.abs(tgt[i].x - cur[i].x) > 0.05 || Math.abs(tgt[i].y - cur[i].y) > 0.05) moving = true;
        else { cur[i].x = tgt[i].x; cur[i].y = tgt[i].y; }
      }
      renderHero(); if (moving) raf = requestAnimationFrame(heroFrame);
    }
    function heroKick(){ if (!raf) raf = requestAnimationFrame(heroFrame); }
    function heroMove(e){
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = net.getBoundingClientRect(); if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width * 400, py = (e.clientY - r.top) / r.height * 420;
      for (let i = 0; i < base.length; i++) {
        const dx = px - base[i].x, dy = py - base[i].y, d = Math.sqrt(dx * dx + dy * dy);
        tgt[i] = (d < 260 && d > 0.01) ? {x: dx / d * (1 - d / 260) * 10, y: dy / d * (1 - d / 260) * 10} : {x:0,y:0};
      }
      heroKick();
    }
    function heroLeave(){ tgt = base.map(() => ({x:0,y:0})); heroKick(); }
    function heroResetInstant(){
      if (raf) cancelAnimationFrame(raf); raf = 0;
      cur = base.map(() => ({x:0,y:0})); tgt = base.map(() => ({x:0,y:0}));
      circles.forEach(c => c.removeAttribute("transform")); paths.forEach((p, i) => p.setAttribute("d", origD[i]));
    }
    function heroPagehide(){ heroResetInstant(); hero.removeEventListener("pointermove", heroMove); hero.removeEventListener("pointerleave", heroLeave); }
    hero.addEventListener("pointermove", heroMove);
    hero.addEventListener("pointerleave", heroLeave);
    document.addEventListener("visibilitychange", () => { if (document.hidden) heroResetInstant(); });
    window.addEventListener("pagehide", heroPagehide);
  }
  /* Theatre sticky sync (desktop only; CSS gates the sticky itself): when the
     user scrolls so a theatre step button crosses the centre band, the phone
     follows it. Clicking a button does not change intersection, so clicks
     never fight scroll sync; Prev/Next and clicks always still work. */
  const theatreEl = document.getElementById("theatre");
  if (theatreEl && "IntersectionObserver" in window && !reduced) {
    const navBtns = theatreEl.querySelectorAll(".tour-nav button");
    if (navBtns.length) {
      const tio = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        if (!window.matchMedia("(min-width: 1024px)").matches || !window.matchMedia("(pointer: fine)").matches) return;
        const idx = Array.prototype.indexOf.call(navBtns, en.target);
        if (idx >= 0 && idx !== tourIndex) selectTour(idx, false);
      }), {rootMargin: "-40% 0px -40% 0px", threshold: 0});
      navBtns.forEach(b => tio.observe(b));
    }
  }
  if ("IntersectionObserver" in window && !reduced) {
    const io2 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); } }), {threshold: 0.15});
    document.querySelectorAll(".thread,.about-timeline,.heritage-seal").forEach(el => io2.observe(el));
    const items = document.querySelectorAll("#gallery-grid .gallery-item");
    const io3 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io3.unobserve(en.target); } }), {threshold: 0.1});
    items.forEach((el, i) => { el.classList.add("reveal-item"); el.style.transitionDelay = ((i % 3) * 90) + "ms"; io3.observe(el); });
  }
});
