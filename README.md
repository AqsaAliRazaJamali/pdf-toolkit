# Privacy-First Local PDF Toolkit

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

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

<img width="896" height="440" alt="Dashboad" src="https://github.com/user-attachments/assets/542c6a3d-9b73-402a-bb98-457ec2021693" />


### Merge PDFs

<img width="905" height="369" alt="Merge" src="https://github.com/user-attachments/assets/de082ef5-94db-4d53-b629-d5d83064151c" />


### Split PDFs

<img width="911" height="337" alt="Split" src="https://github.com/user-attachments/assets/4db1652f-d63d-43c8-a984-ead23450b3c2" />


### Extract Text

<img width="903" height="441" alt="Exract" src="https://github.com/user-attachments/assets/b5f1f8e2-98a4-44c3-9ce2-6b34f2fa3637" />


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
