# 🌐 5G Networking Notes & Q&A Viewer

An interactive, high-performance, mobile-first web application designed for reviewing 5G Protocol & Telecom interview questions and technical notes.

![Stack](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 📱 **Mobile-First Responsive UI**: Optimized touch targets, glassmorphism aesthetics, dark/light mode toggle, and collapsible cards (**closed by default** for easy scanning).
- 🚀 **Dynamic Data Fetching**: Asynchronously fetches questions & answers directly from `public/question.json` using the Fetch API with smooth loading spinners and error-retry handling.
- 🔍 **Real-Time Text Search**: Live search matching across question titles, answer content, categories, and tags with instant query clearing.
- 🏷️ **Tag Filtering & Tag Drawer**:
  - Horizontal scrollable pill bar for fast tag toggling.
  - Full-screen tag browser modal with tag search and frequency count badges.
- 📂 **Category Filter**: Filter questions by topic (e.g. *5G SA Call Flow*, *Mobility*, *RRC Protocol*, *NGAP Protocol*, *E1AP Protocol*, *Concurrency*, etc.).
- 📝 **Rich Markdown Rendering**:
  - Full support for headings, lists, tables, callouts, and inline code formatting.
  - Interactive **1-click Copy Code** button on all code snippets.
- 🔖 **Bookmarks & Revision**: Bookmark important questions for quick offline review, persisted in `localStorage`.
- ↔️ **Expand / Collapse All**: Toggle all cards open or closed with one tap.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, Vite 8
- **Styling**: Modern Vanilla CSS Design System with HSL Color Tokens & Glassmorphism
- **Markdown Processing**: `marked` library with custom pre/code block wrappers
- **Icons**: `lucide-react`

---

## 📁 Project Structure

```text
networking-notes/
├── public/
│   ├── question.json     # Primary Q&A data source in JSON format
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/           # Project images & assets
│   ├── components/
│   │   ├── MarkdownRenderer.jsx  # Marked wrapper with code copy buttons
│   │   ├── QuestionCard.jsx      # Collapsible Q&A card component
│   │   └── TagModal.jsx          # Tag browser bottom-sheet modal
│   ├── App.jsx           # Main state management & search/filter engine
│   ├── index.css         # CSS design system & responsive layout
│   └── main.jsx          # React entry point
├── index.html            # Web app template with Google Fonts
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation & Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 Question JSON Schema

Questions in `public/question.json` follow this JSON structure:

```json
[
  {
    "question": "## Walk me through the full SA UE Initial Registration call flow.",
    "answer": "The **5G SA (Standalone) Initial Registration** is...",
    "category": "5G SA Call Flow",
    "tags": ["5G SA", "UE Registration", "NGAP", "F1AP", "RRC"]
  }
]
```

---

## 📄 License

This project is open-source and available under the MIT License.
