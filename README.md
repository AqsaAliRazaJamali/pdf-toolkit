# Privacy-First Local PDF Toolkit

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PDF-lib](https://img.shields.io/badge/pdf--lib-FF6B6B?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

![PDF Merge](https://img.shields.io/badge/PDF-Merge-red?style=for-the-badge)
![PDF Split](https://img.shields.io/badge/PDF-Split-blue?style=for-the-badge)
![Text Extraction](https://img.shields.io/badge/Text-Extraction-green?style=for-the-badge)
![AES-256 Encryption](https://img.shields.io/badge/AES--256-Encryption-teal?style=for-the-badge)
![PDF Watermarking](https://img.shields.io/badge/PDF-Watermarking-blueviolet?style=for-the-badge)

![Privacy First](https://img.shields.io/badge/Privacy-First-success?style=for-the-badge)
![Client Side Processing](https://img.shields.io/badge/Client--Side-Processing-blue?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A modern PDF workspace that allows users to manipulate PDF documents entirely within the browser. By leveraging client-side processing with binary data handling, the application ensures complete privacy—your files never leave your device or get uploaded to a server.

🚀 **[Live Demo](https://vercel.com/aqsa-jamali-s-projects/pdf-toolkit)**

---

## ✨ Core Features

- 🔒 **Air-Gapped Security:** All PDF processing and data handling occur locally in the browser using `ArrayBuffers`. No file uploads, no server-side processing, and no third-party tracking.

- 🧪 **Smart PDF Binder (Merge):** Combine multiple PDF documents into a single file with interactive drag-and-drop reordering for complete control over document sequence.

- ✂️ **Precision Page Splicer (Split):** Extract custom page ranges (e.g., `1-3, 5, 8-10`) or automatically split an entire PDF into individual pages.

- 📊 **Dynamic Session Feed:** Monitor completed operations and session activity in real time for a more interactive workspace experience.

- 🔄 **Precision Angle Rotation (Rotate):** Adjust orientation maps of selected file sheets using custom layout transformations.
  - Supports isolated page array selection matching Split sub-engine parsers (e.g. `1, 3-5, all`).
  - Offers accurate incremental delta bounds (`90° CW`, `180°`, `270° CW`) without corrupting raster images or embedded font sets.

- 🛡️ **Cryptographic Lockbox (Password Protection):** Secure your sensitive documents using browser-compiled, industry-standard **AES-256 encryption**.
  - Restricts unauthorized access with native user-credential lock layers.
  - Injects direct authorization flags to selectively prevent unauthorized **Printing**, **Text Copying**, or **Structure Editing**.

- 🎨 **PDF Watermark Studio (Stamps):** Inject high-fidelity text or image-based visual overlays onto selected page targets.
  - Supports dynamic font-sizing, hex color matching, opacity adjustment, and orientation axis vector mapping.
  - Restricts application scope using custom range values or applies stamps globally across all pages.
 
- 👁️ **Interactive Canvas-Driven Previews:** Embedded a lazy-loaded, responsive thumbnail matrix across the Split, Rotate, and Watermark modules.
  - Generates zero-server, client-side page snapshots instantly using `pdfjs-dist` inside standard HTML5 canvas scopes.
  - Supports keyboard accessibility mapping, real-time page range input field binding, and active view zoom settings (`sm`, `md`, `lg`).
---

## 📊 Module Availability Matrix

| Feature Module | Air-Gapped | Core Engine | Status |
|---------------|------------|-------------|---------|
| PDF Protection | 🔒 Yes | @pdfsmaller/pdf-encrypt | 🟢 Operational |
| Page Rotator | 🔒 Yes | pdf-lib | 🟢 Operational |
| Smart Binder | 🔒 Yes | pdf-lib | 🟢 Operational |
| Page Splitter | 🔒 Yes | pdf-lib | 🟢 Operational |
| Text Extraction | 🔒 Yes | pdfjs-dist | 🟢 Operational |
| PDF Compression | 🔒 Yes | pdf-lib | 🟢 Operational |
| Watermark Studio | 🔒 Yes | pdf-lib | 🟢 Operational |
| Visual Previewer| 🔒 Yes | pdfjs-dist | 🟢 Operational |
---

## 🛠️ Tech Stack & Engineering Principles

- **Framework:** React (Functional Components, Hooks, and Modern State Management)
- **Build Tool:** Vite (Fast Development Server and Optimized Production Builds)
- **Styling Layout:** Tailwind CSS (Responsive UI, Dark/Light Themes, and Modern Layout Architecture)
- **Core Binary Processor:** `pdf-lib` (Client-side JavaScript library for creating and modifying PDF files)
- **Core Binary & Crypto Processors:** `pdf-lib` & `@pdfsmaller/pdf-encrypt` (For standards-compliant user security dictionary layout processing)
- **Iconography:** Lucide React
- **Hosting Platform:** Vercel (Continuous Deployment integrated with GitHub)

---

## 📸 Screenshots

### Dashboard

<img width="897" height="441" alt="Dashboard" src="https://github.com/user-attachments/assets/51398094-eb7f-422c-bad6-891bad7eacbb" />




### Merge PDFs

<img width="905" height="372" alt="Merge" src="https://github.com/user-attachments/assets/0d99924c-ba66-4b56-92a5-26f0084be252" />



### Split PDFs

<img width="905" height="379" alt="Split" src="https://github.com/user-attachments/assets/398537e4-6c21-4c96-a5f3-361a84ce80a4" />



### Extract Text

<img width="906" height="374" alt="Extract" src="https://github.com/user-attachments/assets/bd54a7cf-98a3-464f-b428-e08137ba43a6" />


### Compress PDFs

<img width="906" height="381" alt="Compress" src="https://github.com/user-attachments/assets/e7b3b640-d52c-430d-bb20-1873baa251ee" />


### Rotate PDF

<img width="904" height="380" alt="Rotate" src="https://github.com/user-attachments/assets/aafef29e-30fa-45bd-8e80-184ecfb4c283" />


### Password Protection Studio

<img width="910" height="385" alt="Protect" src="https://github.com/user-attachments/assets/5e7daee1-39cb-456f-9580-c5767a7de819" />


### Watermark Studio

<img width="900" height="439" alt="Watermark" src="https://github.com/user-attachments/assets/ccab465d-9c07-44a2-8ca1-f954b36802b7" />




---

## 🌟 Key Highlights

- 100% Client-Side PDF Processing
- Multi-tier Lossless Binary Stream Compression
- No File Uploads or Server Storage
- Drag-and-Drop PDF Reordering
- Custom Page Range Extraction
- Responsive User Interface
- Privacy-First Design Philosophy
- Lazy-Loaded Document Visual Map Node Arrays
- Zero-Server Local Rendering Framework via HTML5 Canvas

---

## 💻 How to Run This Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/aqsaalirazajamali/pdf-toolkit.git
```

### 2. Navigate to the Project Directory

```bash
cd pdf-toolkit
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Your Browser

Visit:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
pdf-toolkit/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── CompressionTool.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExtractTool.jsx
│   │   ├── MergeTool.jsx
│   │   ├── PagePreview.jsx
│   │   ├── PasswordTool.jsx
│   │   ├── RotationTool.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SplitTool.jsx
│   │   └── WatermarkTool.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---


## 👤 Author

**Aqsa Ali Raza Jamali**

GitHub: https://github.com/AqsaAliRazaJamali

---

## 📄 License

This project is licensed under the MIT License.
