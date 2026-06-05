# Privacy-First Local PDF Toolkit

A modern PDF workspace that allows users to manipulate PDF documents entirely within the browser. By leveraging client-side processing with binary data handling, the application ensures complete privacy—your files never leave your device or get uploaded to a server.

🚀 **[Live Demo](https://vercel.com/aqsa-jamali-s-projects/pdf-toolkit)**

---

## ✨ Core Features

- 🔒 **Air-Gapped Security:** All PDF processing and data handling occur locally in the browser using `ArrayBuffers`. No file uploads, no server-side processing, and no third-party tracking.

- 🧪 **Smart PDF Binder (Merge):** Combine multiple PDF documents into a single file with interactive drag-and-drop reordering for complete control over document sequence.

- ✂️ **Precision Page Splicer (Split):** Extract custom page ranges (e.g., `1-3, 5, 8-10`) or automatically split an entire PDF into individual pages.

- 📊 **Dynamic Session Feed:** Monitor completed operations and session activity in real time for a more interactive workspace experience.

---

## 🛠️ Tech Stack & Engineering Principles

- **Framework:** React (Functional Components, Hooks, and Modern State Management)
- **Build Tool:** Vite (Fast Development Server and Optimized Production Builds)
- **Styling Layout:** Tailwind CSS (Responsive UI, Dark/Light Themes, and Modern Layout Architecture)
- **Core Binary Processor:** `pdf-lib` (Client-side JavaScript library for creating and modifying PDF files)
- **Iconography:** Lucide React
- **Hosting Platform:** Vercel (Continuous Deployment integrated with GitHub)

---

## 📸 Screenshots

### Dashboard

![Dashboard](./screenshots/home-page.png)

### Merge PDFs

![Merge Tool](./screenshots/merge-tool.png)

### Split PDFs

![Split Tool](./screenshots/split-tool.png)

### Extract Text

![Extract Tool](./screenshots/extract-tool.png)

---

## 🌟 Key Highlights

- 100% Client-Side PDF Processing
- No File Uploads or Server Storage
- Drag-and-Drop PDF Reordering
- Custom Page Range Extraction
- Responsive User Interface
- Privacy-First Design Philosophy

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
├── 📁 public/                 # Static assets served directly to the browser
│   ├── favicon.svg            # Browser tab icon
│   └── icons.svg              # SVG icon assets
│
├── 📁 src/                    # Main application source code
│   ├── 📁 assets/             # Images, icons, and other static resources
│   │
│   ├── 📁 components/         # Reusable React UI components
│   │   ├── Dashboard.jsx      # Home dashboard and session activity feed
│   │   ├── ExtractTool.jsx    # PDF text extraction interface
│   │   ├── MergeTool.jsx      # PDF merge workspace with drag-and-drop support
│   │   ├── Sidebar.jsx        # Application navigation sidebar
│   │   └── SplitTool.jsx      # PDF page splitting and range extraction tool
│   │
│   ├── App.css                # Global application styles
│   ├── App.jsx                # Root component and application state management
│   ├── index.css              # Tailwind CSS entry file
│   └── main.jsx               # React application bootstrap
│
├── .gitignore                 # Files and folders excluded from Git tracking
├── eslint.config.js           # ESLint configuration and code quality rules
├── index.html                 # Single-page application entry template
├── package.json               # Project metadata and dependencies
├── package-lock.json          # Dependency version lock file
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Project documentation
├── tailwind.config.js         # Tailwind CSS customization settings
└── vite.config.js             # Vite development and build configuration
```

---

## 👤 Author

**Aqsa Ali Raza Jamali**

GitHub: https://github.com/AqsaAliRazaJamali

---

## 📄 License

This project is licensed under the MIT License.
