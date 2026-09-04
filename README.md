# 🧠 PsychStudy AI

### Learn Better · Revise Faster · Walk Into the Exam Ready

> A focused browser-based psychology study companion built around structured topic learning, personal notes, interactive flashcards, quizzes, practice examinations and local PDF importing.

[![Live Study App](https://img.shields.io/badge/📚%20LIVE%20APP-7C6BE8?style=for-the-badge)](https://chillingbing648-sketch.github.io/Psych-Study/)
[![Source](https://img.shields.io/badge/💻%20SOURCE-181717?style=for-the-badge&logo=github)](https://github.com/chillingbing648-sketch/Psych-Study)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Overview

PsychStudy AI is a static psychology learning environment centered on **Psychology of Adjustment**. Its structured knowledge base powers multiple study experiences from the same source material. fileciteturn9file0L2-L2

```text
Learn → Understand → Take Notes → Revise → Practice → Test → Improve
```

## Core Product Surface

| Workspace | Purpose |
|---|---|
| 📊 Dashboard | Topic discovery, progress information, study content and PDF import |
| 📚 Study | Deep and Quick learning modes |
| 🃏 Flashcards | Topic-filtered active-recall revision |
| 📝 My Notes | Create, search, edit, filter and delete notes |
| ✏️ Quiz | Fill-in-the-blank + multiple-choice practice with scoring |
| 📋 Exam Paper | Structured practice paper, answer reveal and browser printing |
| 📥 PDF Import | Browser-side PDF text extraction |
| 🌙 Theme | Light/dark theme support |

## Study Engine

### Deep Study

```text
Definition → Explanation → Types/Symptoms → Key Points
→ Psychologists → Examples → Treatment → Summary → Mnemonic
```

### Quick Revision

```text
Definition → Key Points → Exam Summary → Key Names → Mnemonic
```

Both modes reuse the structured knowledge base rather than duplicating content.

## Flashcards & Practice

The flashcard engine supports topic filtering, front/back flipping, navigation, progress tracking and topic-derived fallback cards.

The quiz workflow combines fill-in-the-blank and multiple-choice questions, evaluates answers, calculates scores and provides feedback. The exam workflow supports structured papers, answer reveal and browser printing.

## PDF Import

Local PDFs can be imported and processed in the browser using **PDF.js 3.11.174**.

```text
Local PDF → File/ArrayBuffer → PDF.js → Page Text → Local Study Data
```

Imported material is retained locally; there is no application backend for document storage.

## Local-First Architecture

PsychStudy stores student state in browser `localStorage`.

```text
HTML5 + CSS3 + Vanilla JS
            │
       localStorage
            │
   Notes · Progress · Imports
```

This makes the application free and easy to deploy, but data remains tied to the browser/device and does not automatically synchronize across devices.

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 + CSS variables |
| Application | Vanilla JavaScript ES6+ |
| Study data | Structured JavaScript knowledge base |
| Persistence | Browser `localStorage` |
| PDF processing | PDF.js 3.11.174 |
| File handling | File API + ArrayBuffer |
| Typography | Poppins + Playfair Display |
| Themes | HTML `data-theme` + CSS variables |
| Printing | Browser `window.print()` |
| Hosting | Static hosting / GitHub Pages |

## Project Structure

```text
Psych-Study/
├── assets/
│   └── psychstudy-overview.svg
├── .gitignore
├── README.md
├── DELIVERY_SUMMARY.md
├── DOCUMENTATION_INDEX.md
├── INTEGRATION_GUIDE.md
├── PROJECT_COMPLETION_REPORT.md
├── QUICK_REFERENCE.md
├── README-2.0.md
├── README-START-HERE.md
├── TRANSFORMATION_REPORT.md
├── index.html
├── script.js
└── script-original-backup.js
```

The repository currently contains the main app plus several documentation/reference artifacts, with `script.js` and `index.html` forming the active application surface. fileciteturn18file0L2-L2

## Run Locally

No framework installation or build process is required.

### Direct

Open `index.html` in a modern browser.

### Local server

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

PsychStudy is a static application and can be deployed to GitHub Pages or another static host.

**Live:** https://chillingbing648-sketch.github.io/Psych-Study/

```text
Git Push → GitHub → Static Host → PsychStudy AI
```

## Data & Privacy

Notes, progress and imported study material are stored locally in the browser. Clearing site data can remove those records, and there is currently no cross-device synchronization.

## Engineering Status

| Area | Status |
|---|:---:|
| Topic knowledge base | 🟢 |
| Deep Study | 🟢 |
| Quick Revision | 🟢 |
| Flashcards | 🟢 |
| Personal Notes | 🟢 |
| Quiz Engine | 🟢 |
| Practice Exam | 🟢 |
| PDF Import | 🟢 |
| Themes | 🟢 |
| Local Persistence | 🟢 |
| Responsive UI | 🟢 |
| Automated Tests | 🟡 |
| Accessibility Hardening | 🟡 |
| Expanded Analytics | 🟡 |

**Current stage: functional study companion / active improvement.**

## Roadmap

- [ ] Topic-level mastery analytics
- [ ] Weak-area detection from quiz performance
- [ ] Spaced repetition
- [ ] Better PDF-to-topic organization
- [ ] Notes export/import
- [ ] Offline asset caching
- [ ] Accessibility and keyboard-navigation audit
- [ ] Dedicated mobile experience
- [ ] Richer question-bank management
- [ ] Study streaks and revision planning

## Academic Disclaimer

PsychStudy AI is an **educational study tool**. Its psychology content is intended for learning and examination preparation and should not be treated as professional medical, psychiatric, diagnostic or therapeutic advice.

## Contributing

```bash
git checkout -b feature/my-feature
git add .
git commit -m "feat: describe your change"
git push origin feature/my-feature
```

Open a Pull Request describing what changed, why it changed, how it was tested and any study-content/UI considerations.

## Author

**Harsh Dubey** · [GitHub](https://github.com/chillingbing648-sketch)

---

<div align="center">

### 🧠 PsychStudy AI

**Learn · Revise · Practice · Master**

<sub>HTML5 · CSS3 · JavaScript · PDF.js · localStorage</sub>

</div>
