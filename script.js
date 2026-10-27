// NASSAB Web Application Interactivity Script

let currentSubmissionPayload = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check initial URL hash for direct page navigation
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`page-${hash}`)) {
        navTo(hash);
    } else {
        navTo('home');
    }

    // Attach live preview listeners to form inputs
    const formInputs = ['form-name', 'form-email', 'form-phone', 'form-branch', 'form-type', 'form-details'];
    formInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateLivePreview);
            el.addEventListener('change', updateLivePreview);
        }
    });

    // Render past submitted requests on load
    renderSubmissionsList();
});

// Single Page Navigation Function
function navTo(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
    });

    // Show target section
    const targetSection = document.getElementById(`page-${pageId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        window.location.hash = pageId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('nav-active'));
    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) activeBtn.classList.add('nav-active');
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    mobileMenu.classList.toggle('open');
    if (menuIcon) menuIcon.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
}

// About Us Section Style Switcher (Modern vs Traditional Islamic Wording)
function switchAboutStyle(style) {
    const modernBox = document.getElementById('about-content-modern');
    const traditionalBox = document.getElementById('about-content-traditional');
    const btnModern = document.getElementById('toggle-modern');
    const btnTraditional = document.getElementById('toggle-traditional');

    if (style === 'traditional') {
        modernBox.classList.add('hidden');
        traditionalBox.classList.remove('hidden');
        
        btnModern.classList.remove('toggle-active');
        btnTraditional.classList.add('toggle-active');
    } else {
        traditionalBox.classList.add('hidden');
        modernBox.classList.remove('hidden');

        btnTraditional.classList.remove('toggle-active');
        btnModern.classList.add('toggle-active');
    }
}

// Update Live Preview Card as User Types
function updateLivePreview() {
    const name = document.getElementById('form-name').value.trim() || 'Your Name';
    const email = document.getElementById('form-email').value.trim() || 'your.email@domain.com';
    const phone = document.getElementById('form-phone').value.trim() || 'Not provided';
    const branch = document.getElementById('form-branch').value.trim() || 'General Lineage';
    const type = document.getElementById('form-type').value;
    const details = document.getElementById('form-details').value.trim() || 'Your update details will appear here as you type...';

    document.getElementById('prev-name').innerText = name;
    document.getElementById('prev-email').innerText = email;
    document.getElementById('prev-phone').innerText = phone;
    document.getElementById('prev-branch').innerText = branch;
    document.getElementById('prev-type').innerText = type;
    document.getElementById('prev-details').innerText = details;
}

// File Attachment Dropzone Simulator
function handleFileSelect(event) {
    const file = event.target.files[0];
    const statusBox = document.getElementById('file-status');
    if (file) {
        statusBox.innerHTML = `<i ></i> Attached: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
        statusBox.classList.remove('hidden');
        showToast(`Document attached: ${file.name}`);
    }
}

// Handle Record Form Submission
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const branch = document.getElementById('form-branch').value.trim();
    const type = document.getElementById('form-type').value;
    const details = document.getElementById('form-details').value.trim();
    const fileInput = document.getElementById('form-file');
    const fileName = fileInput && fileInput.files[0] ? fileInput.files[0].name : 'No file attached';

    // Generate Ticket Reference
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `NAS-2026-${randomNum}`;
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    currentSubmissionPayload = {
        ticketId,
        name,
        email,
        phone,
        branch,
        type,
        details,
        fileName,
        timestamp,
        status: 'UNDER REVIEW'
    };

    // Save to localStorage
    saveSubmissionToHistory(currentSubmissionPayload);

    // Populate and open Confirmation Modal
    document.getElementById('modal-ticket-id').innerText = ticketId;
    document.getElementById('modal-name').innerText = name;
    document.getElementById('modal-type').innerText = type;
    document.getElementById('modal-email').innerText = email;
    document.getElementById('modal-timestamp').innerText = timestamp;

    const modal = document.getElementById('submission-modal');
    modal.classList.add('open');

    // Reset Form & Preview
    document.getElementById('record-form').reset();
    document.getElementById('file-status').classList.add('hidden');
    updateLivePreview();
    renderSubmissionsList();

    showToast(`Update Ticket #${ticketId} created!`);
}

// Send via Email Client
function sendViaEmail() {
    if (!currentSubmissionPayload) return;
    const p = currentSubmissionPayload;

    const subject = encodeURIComponent(`NASSAB Record Update [Ticket #${p.ticketId}]: ${p.type} - ${p.name}`);
    const body = encodeURIComponent(`=========================================\nNASSAB DIGITAL SHAJRA RECORD UPDATE TICKET\n=========================================\nTicket ID: #${p.ticketId}\nDate: ${p.timestamp}\n\nSUBMITTER INFORMATION:\nName: ${p.name}\nEmail: ${p.email}\nPhone/WhatsApp: ${p.phone || 'N/A'}\nFamily Branch: ${p.branch || 'General'}\n\nUPDATE DETAILS:\nType: ${p.type}\nAttachment: ${p.fileName}\n\nRECORD INFORMATION:\n${p.details}\n\n-----------------------------------------\nSubmitted via NASSAB Official Web Platform`);

    window.location.href = `mailto:digital.creator380@gmail.com?subject=${subject}&body=${body}`;
    showToast("Launching email client...");
}

// Send via Direct WhatsApp Chat (03408100868)
function sendViaWhatsApp() {
    if (!currentSubmissionPayload) return;
    const p = currentSubmissionPayload;

    const text = encodeURIComponent(`*NASSAB Record Update Ticket #${p.ticketId}*\n\n👤 *Name:* ${p.name}\n📧 *Email:* ${p.email}\n📞 *WhatsApp:* ${p.phone || 'N/A'}\n📌 *Type:* ${p.type}\n🌿 *Branch:* ${p.branch || 'General'}\n\n📝 *Record Details:*\n${p.details}\n\n_Submitted via NASSAB Web Application_`);

    // Redirect to direct WhatsApp chat with 03408100868 (+923408100868)
    window.open(`https://wa.me/923408100868?text=${text}`, '_blank');
    showToast("Opening WhatsApp Chat (+92 340 8100868)...");
}

// Copy Payload Summary
function copySubmissionPayload() {
    if (!currentSubmissionPayload) return;
    const p = currentSubmissionPayload;
    const summary = `NASSAB Record Update Ticket #${p.ticketId}\nSubmitter: ${p.name} (${p.email})\nType: ${p.type}\nDetails: ${p.details}`;
    
    navigator.clipboard.writeText(summary).then(() => {
        showToast(`Ticket #${p.ticketId} copied to clipboard!`);
    });
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('submission-modal');
    modal.classList.remove('open');
}

// LocalStorage History Helpers
function saveSubmissionToHistory(submission) {
    let history = JSON.parse(localStorage.getItem('nassab_submissions') || '[]');
    history.unshift(submission);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('nassab_submissions', JSON.stringify(history));
}

function renderSubmissionsList() {
    const container = document.getElementById('submissions-history-list');
    if (!container) return;

    const history = JSON.parse(localStorage.getItem('nassab_submissions') || '[]');
    if (history.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-slate-500 text-xs italic">
                No past record update tickets submitted yet. Your submitted requests will appear here.
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div>
                <div><strong>#${item.ticketId}</strong> &nbsp; ${item.status}</div>
                <div>${item.type} — ${item.name}</div>
                <div class="small muted">${item.details}</div>
            </div>
            <div>
                <div class="small muted">${item.timestamp}</div>
                <button onclick="reOpenTicket('${item.ticketId}')">View ticket</button>
            </div>
        </div>
    `).join('');
}

function reOpenTicket(ticketId) {
    const history = JSON.parse(localStorage.getItem('nassab_submissions') || '[]');
    const item = history.find(h => h.ticketId === ticketId);
    if (item) {
        currentSubmissionPayload = item;
        document.getElementById('modal-ticket-id').innerText = item.ticketId;
        document.getElementById('modal-name').innerText = item.name;
        document.getElementById('modal-type').innerText = item.type;
        document.getElementById('modal-email').innerText = item.email;
        document.getElementById('modal-timestamp').innerText = item.timestamp;

        const modal = document.getElementById('submission-modal');
        modal.classList.add('open');
    }
}

function clearSubmissionHistory() {
    localStorage.removeItem('nassab_submissions');
    renderSubmissionsList();
    showToast("Cleared ticket submission history.");
}

// Copy Text to Clipboard Utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text} to clipboard!`);
    }).catch(err => {
        showToast(`Copied: ${text}`);
    });
}

// Toast Notification System
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    toastMsg.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ---- Showcase lightbox (functional gallery) ----
const galleryImages = [
  { src: 'images/app-welcome.jpg', caption: 'Welcome' },
  { src: 'images/app-explore.jpg', caption: 'Explore historical people' },
  { src: 'images/app-tree.jpg', caption: 'Family tree' },
  { src: 'images/app-person.jpg', caption: 'Person detail' },
  { src: 'images/app-fan.jpg', caption: 'Fan chart' },
  { src: 'images/app-verify.jpg', caption: 'Verify certificate' }
];
let lightboxIndex = 0;
function visibleGalleryIndices() {
  const items = document.querySelectorAll('.gallery-item');
  const out = [];
  items.forEach((el) => {
    if (!el.classList.contains('hidden-item')) out.push(parseInt(el.getAttribute('data-index'), 10));
  });
  return out.length ? out : galleryImages.map((_, i) => i);
}
function openLightbox(index) {
  const visible = visibleGalleryIndices();
  lightboxIndex = visible.includes(index) ? index : visible[0];
  showLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function showLightboxImage() {
  const item = galleryImages[lightboxIndex];
  const img = document.getElementById('lightbox-img');
  img.src = item.src;
  img.alt = item.caption;
  document.getElementById('lightbox-caption').innerText = item.caption;
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxNext() {
  const visible = visibleGalleryIndices();
  const pos = visible.indexOf(lightboxIndex);
  lightboxIndex = visible[(pos + 1) % visible.length];
  showLightboxImage();
}
function lightboxPrev() {
  const visible = visibleGalleryIndices();
  const pos = visible.indexOf(lightboxIndex);
  lightboxIndex = visible[(pos - 1 + visible.length) % visible.length];
  showLightboxImage();
}
function hideGalleryItem(imgEl) {
  const figure = imgEl.closest('.gallery-item');
  if (figure) figure.classList.add('hidden-item');
}
function scrollToShowcase() {
  navTo('home');
  setTimeout(() => {
    const el = document.getElementById('showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'ArrowLeft') lightboxPrev();
});
