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
let lbIndex = 0, lbOpener = null, lbZoom = false;
function openLightbox(i){
  const item = GALLERY[i]; if (!item) return;
  if (!visibleGallery.includes(i)) visibleGallery = [0,1,2,3,4,5];
  lbIndex = i; lbOpener = document.activeElement; lbZoom = false;
  const lb = document.getElementById("lightbox"); if (!lb) return;
  const img = document.getElementById("lightbox-img"), cap = document.getElementById("lightbox-caption"), cnt = document.getElementById("lightbox-count");
  img.src = item.src; img.dataset.imgFallback = item.fallback; img.alt = item.title + " screen from the NASSAB app"; img.classList.remove("zoomed");
  const zb = document.getElementById("lightbox-zoom"); if (zb) zb.setAttribute("aria-pressed", "false");
  if (cap) cap.textContent = item.title + " — " + item.desc;
  const pos = visibleGallery.indexOf(i) + 1;
  if (cnt) cnt.textContent = pos + " of " + visibleGallery.length;
  lb.classList.add("open"); document.body.style.overflow = "hidden";
  const closeBtn = document.getElementById("lightbox-close"); if (closeBtn) closeBtn.focus();
}
function closeLightbox(){
  const lb = document.getElementById("lightbox"); if (!lb) return;
  lb.classList.remove("open"); document.body.style.overflow = "";
  if (lbOpener && lbOpener.focus) lbOpener.focus();
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
  /* Hero pointer: whole network shifts a few px only; disabled on touch */
  const hero = document.querySelector(".hero");
  const net = document.querySelector(".hero-lineage");
  if (hero && net && window.matchMedia("(pointer: fine)").matches && !reduced) {
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      const dy = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      net.style.transform = "translate3d(" + (dx * 8) + "px," + (dy * 6) + "px,0)";
    });
    hero.addEventListener("pointerleave", () => { net.style.transform = ""; });
  }
  if ("IntersectionObserver" in window && !reduced) {
    const io2 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); } }), {threshold: 0.15});
    document.querySelectorAll(".thread,.about-timeline,.heritage-seal").forEach(el => io2.observe(el));
    const items = document.querySelectorAll("#gallery-grid .gallery-item");
    const io3 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io3.unobserve(en.target); } }), {threshold: 0.1});
    items.forEach((el, i) => { el.classList.add("reveal-item"); el.style.transitionDelay = ((i % 3) * 90) + "ms"; io3.observe(el); });
  }
});
