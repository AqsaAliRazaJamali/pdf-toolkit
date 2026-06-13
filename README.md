#  Privacy-First Local PDF Toolkit

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

A modern PDF workspace that allows users to manipulate PDF documents entirely within the browser. By leveraging client-side processing with binary data handling, the application ensures complete privacy—your files never leave your device or get uploaded to a server.

🚀 **[Live Demo](https://vercel.com/aqsa-jamali-s-projects/pdf-toolkit)**

---

## ✨ Core Features

-  **Air-Gapped Security:** All operations occur locally in browser memory via raw `ArrayBuffers`. No file uploads, no server-side processing, and no third-party tracking.
-  **Smart PDF Binder (Merge):** Combine multiple documents with an interactive drag-and-drop sequencing grid.
-  **Precision Page Splicer (Split):** Extract custom ranges (e.g., `1-3, 5, 8-10`) or automatically split an entire PDF into individual pages.
-  **Precision Angle Rotation (Rotate):** Adjust document orientation maps instantly (`90° CW`, `180°`, `270° CW`) without degrading embedded raster items or font sheets.
-  **Cryptographic Lockbox (Password Protection):** Secure files using industry-standard **AES-256 encryption** with customizable permission flags to selectively prevent unauthorized **Printing**, **Text Copying**, or **Structure Editing**.
-  **PDF Watermark Studio:** Inject translucent text or image-based visual stamps with real-time scaling, opacity controls, and geometric range matching.
-  **Interactive Canvas Previews:** A lazy-loaded, highly responsive thumbnail previewer built right into the Split, Rotate, and Watermark modules.

---

##  Module Availability Matrix

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

## 🛠️ Technologies & Stack

### Core Technologies
* **Frontend Framework:** React (Functional components with hooks for modern state management)
* **Build Automation:** Vite (For lightning-fast development reloads and optimized production builds)
* **Styling Layout:** Tailwind CSS (Modern card layouts, responsive flows, and custom dark accent configurations)
* **Iconography:** Lucide React

### Engineering Libraries (The Heavy Lifters)
* **`pdf-lib`:** Client-side JavaScript engine used to create, modify, slice, and compile binary PDF streams directly.
* **`pdfjs-dist`:** Mozilla's powerful parsing framework utilized to asynchronously render document visual layers.
* **`@pdfsmaller/pdf-encrypt`:** High-integrity cryptographic handler for enforcing document security dictionaries.

---

## ⌨️ Keyboard Shortcuts & Accessibility

The interactive page preview module features standard keyboard navigation triggers to ensure a highly accessible workspace configuration:

| Key Bind | Context / Scope | Functional Operation |
|----------|----------------|----------------------|
| `Tab` | Thumbnail Selector Map | Focuses sequentially forward to the next page layout node |
| `Shift + Tab` | Thumbnail Selector Map | Focuses sequentially backward to the previous page layout node |
| `Spacebar` / `Enter` | Focused Thumbnail Card | Toggles the targeted page index checkbox and synchronizes text bounds |

---

## ⚙️ The Process: How It Works under the Hood

The toolkit bypasses backend dependencies entirely by using secure browser memory sandboxes:

1. **Ingestion:** The user drops a document via `react-dropzone`. The browser streams the binary payload into local memory using an `ArrayBuffer`.
2. **Visual Matrix Compilation:** `pdfjs-dist` instantiates a local worker thread to read the structure. As pages scroll into the client's view, an `IntersectionObserver` signals a low-scale background render thread to draw the page onto a micro HTML5 `<canvas>`, providing fast previews without consuming unnecessary memory.
3. **Surgical Node Execution:** When a user clicks an action button, the application feeds the `ArrayBuffer` directly into `pdf-lib`. The canvas selections isolate targeted document array references, applying cryptographic hashes, geometrical rotation adjustments, or text overlays purely within memory.
4. **Local Delivery:** The compiled binary matrix is converted into an in-memory Object URL Blob, and a local download stream triggers immediately to download the completed PDF asset.

---

##  What I Learned

Building this tool required deep-diving into browser resource mechanics and structural data constraints:

* **Asynchronous Resource Scoping:** Mastered processing heavy, thread-blocking document workflows locally using background web workers without lagging React's primary execution frame loop.
* **Performance Optimization at Scale:** Implemented strict intersection threshold triggers to lazy-load vector page models, enabling the UI to seamlessly navigate 100+ page documents.
* **Bi-directional State Synchronization:** Engineered reactive state synchronization architectures that cleanly translate mouse click array coordinates into formatted comma-separated strings (`1-3, 5`), keeping text models and graphic previews synchronized perfectly.
* **Binary Stream Engineering:** Gained native experience manipulating low-level file structures using typed data streams, raw array maps, and asset allocation wrappers.

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



## 👤 Author

**Aqsa Ali Raza Jamali**

GitHub: https://github.com/AqsaAliRazaJamali

---

## 📄 License

This project is licensed under the MIT License.
