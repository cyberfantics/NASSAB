/* NASSAB shared script: menu, showcase, diagram, gallery lightbox, records form.
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
const SHOWCASE = [
  {src:"images/app-tree.jpg", fallback:"images/Screenshot_20261027-112749.jpg.jpeg", title:"Family Tree", desc:"View a lineage as a horizontal tree, move the focus between generations, and keep marriages and children distinct."},
  {src:"images/app-explore.jpg", fallback:"images/Screenshot_20261027-112708.jpg.jpeg", title:"Historical People", desc:"Browse recorded historical people, search by name, and open a read-only historical record."},
  {src:"images/app-person.jpg", fallback:"images/Screenshot_20261027-112720.jpg.jpeg", title:"Person Profiles", desc:"Open a person to see spouses, marriage history and children, with recorded status shown plainly."},
  {src:"images/app-fan.jpg", fallback:"images/Screenshot_20261027-112900.jpg.jpeg", title:"Fan Chart", desc:"See generations as a fan chart, with paternal and maternal routes shown separately."},
  {src:"images/app-verify.jpg", fallback:"images/Screenshot_20261027-112643.jpg.jpeg", title:"Chronicle Verification", desc:"Verify a lineage certificate by PDF file for anti-tamper integrity, or by Serial ID, using SHA-256 document-integrity checking."}
];
document.addEventListener("DOMContentLoaded", () => {
  const formInputs = ["form-name","form-email","form-phone","form-branch","form-type","form-details"];
  formInputs.forEach(id => { const el = document.getElementById(id); if (el) { el.addEventListener("input", updateLivePreview); el.addEventListener("change", updateLivePreview); } });
  renderSubmissionsList(); updateLivePreview();
  document.querySelectorAll("[data-img-fallback]").forEach(img => {
    img.addEventListener("error", function handler(){ if (img.dataset.imgFallback && img.src.indexOf(img.dataset.imgFallback) === -1) { img.src = img.dataset.imgFallback; } else { img.removeEventListener("error", handler); const wrap = img.closest(".gallery-item, .phone, .showcase-phone"); if (wrap) wrap.style.display = "none"; const note = document.getElementById("gallery-note"); if (note) note.style.display = "block"; } });
  });
});
function toggleMobileMenu(){
  const m = document.getElementById("mobile-menu"); if (!m) return;
  const open = m.classList.toggle("open");
  const btn = document.getElementById("menu-btn"); if (btn) { btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "✕ Close" : "☰ Menu"; }
  if (open) { const first = m.querySelector("a"); if (first) first.focus(); }
}
function switchAboutStyle(style){
  const modern = document.getElementById("about-content-modern"), trad = document.getElementById("about-content-traditional");
  const bm = document.getElementById("toggle-modern"), bt = document.getElementById("toggle-traditional");
  if (!modern || !trad) return;
  const isTrad = style === "traditional";
  modern.classList.toggle("hidden", isTrad); trad.classList.toggle("hidden", !isTrad);
  if (bm) bm.classList.toggle("active", !isTrad); if (bt) bt.classList.toggle("active", isTrad);
}
function selectShowcase(i){
  const img = document.getElementById("showcase-img"), t = document.getElementById("showcase-title"), d = document.getElementById("showcase-desc");
  if (!img || !SHOWCASE[i]) return;
  img.style.opacity = "0";
  setTimeout(() => { img.src = SHOWCASE[i].src; img.dataset.imgFallback = SHOWCASE[i].fallback; img.alt = SHOWCASE[i].title + " screen from the NASSAB app"; if (t) t.textContent = SHOWCASE[i].title; if (d) d.textContent = SHOWCASE[i].desc; img.style.opacity = "1"; }, 180);
  document.querySelectorAll(".showcase-nav button").forEach((b, j) => b.classList.toggle("active", j === i));
}
function selectDiagram(key, el){
  const detail = document.getElementById("diagram-detail"); if (!detail) return;
  const texts = {
    ancestor:"Ancestor — the starting point of a recorded lineage. Other relationships are described from this point, without inventing dates or records.",
    descendant:"Descendant line — children and later generations, recorded without duplicate person records.",
    radaat:"Rada'at branch — milk-kinship recorded as its own relationship type, distinct from blood and marriage relationships.",
    marriage:"Marriage history — current and former marriages kept distinct, with history preserved, so a former spouse is never shown as currently married."
  };
  detail.textContent = texts[key] || texts.ancestor;
  document.querySelectorAll(".diagram button").forEach(b => b.classList.remove("active")); if (el) el.classList.add("active");
}
/* Lightbox */
let lbIndex = 0, lbOpener = null;
function openLightbox(i){
  const item = GALLERY[i]; if (!item) return; lbIndex = i; lbOpener = document.activeElement;
  const lb = document.getElementById("lightbox"); if (!lb) return;
  const img = document.getElementById("lightbox-img"), cap = document.getElementById("lightbox-caption"), cnt = document.getElementById("lightbox-count");
  img.src = item.src; img.dataset.imgFallback = item.fallback; img.alt = item.title + " screen from the NASSAB app";
  if (cap) cap.textContent = item.title + " — " + item.desc;
  if (cnt) cnt.textContent = (i + 1) + " of " + GALLERY.length;
  lb.classList.add("open"); document.body.style.overflow = "hidden";
  const closeBtn = document.getElementById("lightbox-close"); if (closeBtn) closeBtn.focus();
}
function closeLightbox(){
  const lb = document.getElementById("lightbox"); if (!lb) return;
  lb.classList.remove("open"); document.body.style.overflow = "";
  if (lbOpener && lbOpener.focus) lbOpener.focus();
}
function lightboxStep(dir){
  lbIndex = (lbIndex + dir + GALLERY.length) % GALLERY.length; openLightbox(lbIndex);
}
function lightboxNext(){ lightboxStep(1); } function lightboxPrev(){ lightboxStep(-1); }
document.addEventListener("keydown", e => {
  const lb = document.getElementById("lightbox"); if (!lb || !lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lightboxStep(1);
  if (e.key === "ArrowLeft") lightboxStep(-1);
  if (e.key === "Tab") { const focusable = lb.querySelectorAll("button"); if (!focusable.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
});
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
  el.innerHTML = list.map(item => `<div class="panel" style="padding:14px 16px;margin-bottom:10px"><strong>${item.ticketId}</strong> — ${item.type}<br><span class="muted small">${item.timestamp} · ${item.name}</span><br><button class="btn btn-text" onclick="reOpenTicket('${item.ticketId}')">View ticket</button></div>`).join("");
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
function scrollToShowcase(){ const el = document.getElementById("showcase"); if (el) el.scrollIntoView({behavior:"smooth"}); }
