# NASSAB (نَسَب) — Digital Family Tree & Heritage Preservation Platform

![NASSAB Logo](logo.png)

> **"Preserving Heritage. Organizing Lineage. Connecting Generations."**

NASSAB is a modern digital genealogy platform dedicated to preserving, organizing, and exploring family records, Shajra, and complex historical lineages. Designed to represent complete family relationships, including male and female descendants, marriages, divorces, remarriages, half-siblings, and step-relations without data duplication.

---

## 🌟 Key Features

### 🌿 1. Inclusive & Graph-Based Family Representation
- **Full Female & Male Lineage**: Unlike traditional records that obscure female branches, NASSAB maps all mothers, daughters, and female ancestors with equal status.
- **Complex Relationships**: Accurately handles divorces, multiple marriages, children from different marriages, step-siblings, and adopted members.
- **No Record Duplication**: Modeled as a relational graph rather than a simple parent-child tree structure.

### 📜 2. Dual-View "About Us" Experience
- **Modern Overview Mode**: Clean tech-focused explanation of digital archiving, privacy standards, and data accessibility.
- **Traditional / Islamic View Mode (شجرۂ نسب و سلسلہ)**: Tailored perspective using traditional terminology (*Nasab, Shajra, Silsila, Aslaaf, Akhlaaf*) rendered in **Noto Nastaliq Urdu** typography.

### ✉️ 3. Interactive Record Update & Verification Ticket Portal
- **Real-Time Live Ticket Preview**: Displays a live preview card of the update request as the user types.
- **Unique Ticket Reference Generation**: Automatically generates ticket numbers (e.g. `#NAS-2026-8392`).
- **File & Proof Attachment Simulator**: Supports attaching birth certificates, old Shajra photo scans, or historical documents.
- **Multi-Channel Dispatch**: Option to send updates directly via **Direct WhatsApp Chat (+92 340 8100868)** or **Email** (`digital.creator380@gmail.com`).
- **Submission History**: Saves submitted update tickets in browser `localStorage` for user tracking.

### ⚡ 4. Fast & Vercel Native
- Built with zero-dependency static Web standards for instant loading.
- Optimized for desktop, tablet, and mobile web browsers.
- Pre-configured `vercel.json` for 1-click deployment on **Vercel**.

---

## 📁 Repository & Project Structure

```text
web n/
├── index.html        # Main web application structure & responsive sections
├── styles.css        # Custom luxury dark emerald-gold theme & Noto Nastaliq font rules
├── script.js        # Tab navigation, ticket generator, modal logic, local storage
├── logo.png          # Official NASSAB branding logo image
├── vercel.json       # Vercel deployment configuration & security headers
└── README.md         # Documentation & project guide
```

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Tailwind CSS (via CDN), Vanilla JavaScript (ES6+)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (English) & [Noto Nastaliq Urdu](https://fonts.google.com/specimen/Noto+Nastaliq+Urdu) (Urdu/Arabic)
- **Icons**: FontAwesome 6 Free
- **Hosting & Deployment**: Vercel Static Hosting

---

## 🚀 How to Run & Deploy

### Local Development
No complex build steps or node modules required!

1. Simply double-click `index.html` to open in any web browser.
2. Or serve locally via Python:
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

---

### Deployment on Vercel

#### Method 1: Via GitHub & Vercel Dashboard (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial NASSAB web release"
   git remote add origin https://github.com/your-username/nassab-web.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `nassab-web` repository.
4. Click **Deploy**. Vercel will automatically host `index.html` with clean URLs!

#### Method 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 📬 Contact & Official Channels

- **WhatsApp Direct Support**: [+92 340 8100868](https://wa.me/923408100868) (0340-8100868)
- **WhatsApp Broadcast Channel**: [Join Official NASSAB WhatsApp Channel](https://whatsapp.com/channel/0029Vb8MiX06GcGAB6sBsw31?utm_source=chatgpt.com)
- **Record Updates Email**: [digital.creator380@gmail.com](mailto:digital.creator380@gmail.com)
- **Facebook**: [facebook.com/cyberfantics](https://facebook.com/cyberfantics?utm_source=chatgpt.com)
- **Instagram**: [instagram.com/cyberfantics](https://instagram.com/cyberfantics?utm_source=chatgpt.com)

---

## 👨‍💻 Credits & Attribution

Developed with excellence by **CyberFantics**.

*NASSAB is a digital genealogy project focused on using modern web technology to preserve family heritage and lineage records for present and future generations.*
