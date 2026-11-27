# Design & UX Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Status:** Approved for Implementation  

---

## 1. Design System & Brand Identity

The platform balances high-tech academic rigor with clinical precision. It uses the official Adani Institute of Higher Education and Research institutional palette (Adani Cyan, Royal Purple, and Magenta gradient) paired with an ultra-clean, clinical-grade UI (Inter typography, subtle glassmorphic headers, crisp SVG iconography, high-contrast dark/light clinical themes).

### 1.1 Color Tokens

```css
:root {
  /* Adani Institute of Higher Education and Research Primary Palette */
  --color-adani-cyan: #0077B6;         /* Brand Cyan (from 'a' in adani logo) */
  --color-adani-purple: #662D91;       /* Brand Royal Purple (mid-gradient) */
  --color-adani-magenta: #B82662;      /* Brand Magenta / Ruby ('i' in adani logo) */
  --color-brand-gradient: linear-gradient(135deg, #0077B6 0%, #662D91 50%, #B82662 100%);

  /* Primary Structural Palette */
  --color-primary-navy: #0B2545;       /* Deep Academic Navy (Interface contrast) */
  --color-primary-navy-dark: #07192F;  /* Background for dark clinical mode */
  --color-accent-gold: #D4AF37;        /* Gold (Badges, mastery achievements) */

  /* Clinical Semantics */
  --color-clinical-cyan: #0077B6;      /* Medical imaging / diagnostic accent */
  --color-clinical-teal: #0D9488;      /* Process pipelines & flowcharts */
  --color-success: #16A34A;            /* Pass threshold (>75%), active node */
  --color-warning: #EAB308;            /* Draft status, quota alert */
  --color-danger: #DC2626;             /* Below pass threshold, error */

  /* Neutrals */
  --color-surface-light: #F8FAFC;      /* App light background */
  --color-surface-white: #FFFFFF;      /* Card and panel background */
  --color-border-subtle: #E2E8F0;      /* Card dividers and panel borders */
  --color-text-main: #1E293B;          /* Slate 800 for high-contrast reading */
  --color-text-muted: #64748B;         /* Slate 500 for secondary descriptions */

  /* Dark Clinical Theme */
  --color-dark-bg: #090D16;            /* Diagnostic workstation black */
  --color-dark-surface: #131B2E;       /* Workstation panel surface */
  --color-dark-border: #1E293B;        /* High-contrast workstation borders */
  --color-dark-text: #F1F5F9;          /* High-legibility text */
}
```

### 1.2 Typography & Iconography
- **Body & Headings:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`.
- **Formulas & Mathematics:** `KaTeX` typography for clear rendering of spatial transformation matrices, 2D Discrete Fourier Transforms (DFT), and Radon transform equations.
- **Code & Syntax:** `JetBrains Mono` / `Fira Code` for in-browser Python (Pyodide) scripts and DICOM metadata tags.
- **Icons:** `Lucide React` for lightweight, accessible SVG icons.

---

## 2. Information Architecture & Navigation

```
[Platform Root]
  ├── /login (Invite-Only Login & Credentials Access)
  ├── /dashboard (Student Progress, Badges, Attainment Ring)
  ├── /course
  │     ├── /overview (Syllabus, 6 Modules, CO Mapping, Grading Scheme)
  │     ├── /[moduleId] (Module Overview, Topic Index, Quiz Launcher)
  │     │     └── /[topicSlug] (Interactive Dual-Panel Topic Engine)
  │     └── /capstone (40-Question Comprehensive Capstone Exam)
  ├── /playground
  │     ├── /windowing (CT Window Width / Window Level Simulator)
  │     ├── /convolution (2D Spatial Convolution & Histogram Equalizer)
  │     ├── /fourier (2D Fast Fourier Transform & Frequency Mask Studio)
  │     ├── /segmentation (Otsu Variance & Seeded Region Growing)
  │     ├── /dicom (Privacy-First DICOM Tag Explorer)
  │     ├── /missions (5 Clinical Diagnostic Missions with Scoring)
  │     ├── /pipeline (Bioimage Visual Pipeline Builder)
  │     └── /games (Clinical Mini-Games Hub)
  ├── /lexi (Lexi Academic AI Guide Fullscreen View)
  ├── /tutor (Grounded AI Tutor Interface)
  ├── /faculty (Content Authoring, Draft Visual Approvals, Analytics, Grading)
  └── /admin (Roster Management, Laptop CSV Upload, Password Visibility, Audit Logs)
```

---

## 3. The Interactive Topic-Page Template

Every topic in the syllabus adheres to a unified, synchronized dual-panel layout engineered for deep conceptual and visual learning across 144 slide units.

### 3.1 Desktop Layout (Dual-Panel Synchronized View)
- **Grid Layout:** `grid-cols-12` with `col-span-7` for the explanatory content panel and `col-span-5` for the sticky visual panel.
- **Left Panel (Scrollable Explanatory Column):**
  1. **Breadcrumb & Header:** Module tag, Topic title, estimated read time, Course Outcome (`CO1–CO4`).
  2. **1. Learning Objectives:** Specific outcomes keyed to Bloom's taxonomy.
  3. **2. Overview & Clinical Context:** Real-world clinical relevance.
  4. **3. Detailed Technical Explanation:** Equations, step-by-step mathematical derivation, worked clinical case studies.
  5. **4. Common Misconceptions & Pitfalls:** "Things students get wrong".
  6. **5. Step-by-Step Workflow:** Numbered procedural stages linked to the visual panel.
  7. **6. Interactive Workstation:** In-page slider/controls (e.g., WW/WL slider or $3 \times 3$ kernel grid).
  8. **7. Summary & Key Takeaways:** Bulleted recap.
  9. **8. Quick Check (Formative MCQ):** 3–5 instant-feedback MCQs.
  10. **9. Short-Answer Practice:** Concept check prompt with AI-assisted self-evaluation.
  11. **10. Pyodide Coding Exercise:** Interactive code block with runnable NumPy/OpenCV/pydicom starter code.
  12. **11. Academic References & Citations:** Birkfellner, Dougherty, open dataset licenses.
  13. **12. Linear Navigation Bar:** Previous and Next topic controls.

- **Right Panel (Sticky Visual & Diagram Workstation):**
  - Uses `position: sticky; top: 5rem; max-height: calc(100vh - 6rem)`.
  - **Dynamic Synchronization:** Uses an `IntersectionObserver` on left panel sections. As the student scrolls through section boundaries, the right workstation dynamically transitions between diagrams, flowcharts, and clinical scan visualizers.
  - Contains tabbed controls: `Diagram (Mermaid/SVG)` | `Interactive Simulation` | `Clinical Scan Reference`.
  - Fullscreen expansion toggle for deep inspection during lecture or study.

### 3.2 Mobile Layout (Responsive Stacking)
- On screens `< 1024px`, the layout smoothly converts to a single-column flow (`grid-cols-1`).
- The visual workstation un-sticks and positions directly beneath its corresponding section heading before the text, preserving context without horizontal cramming.
- Touch-friendly pan and pinch-zoom enabled on all diagrams.

---

## 4. Lexi Academic AI Guide v2.0 UI Specification

- **Claude-Style Editorial Layout:**
  - User messages appear in right-aligned rounded speech bubbles.
  - Lexi responses render in an open editorial column without repetitive avatars or borders.
  - Math renders inline ($\dots$) and block ($\dots$) with KaTeX.
  - Collapsible citation cards detail `{ file, section }` references.
- **Floating Rounded Card Composer:**
  - Floating card anchored at the bottom of the chat container.
  - Toolbar with model badge, clear button, and upward circular send icon.
  - Global disclaimer indicating curriculum grounding.
- **3 Responsive Display Modes:**
  - **Normal:** Bottom-right compact floating window ($380\text{px} \times 600\text{px}$, max 80vh).
  - **Half:** Right docked panel (50% desktop, 40% tablet); main page flex-shrinks alongside it.
  - **Full:** Full-viewport experience with collapsible drawer and centered reading column.

---

## 5. Accessibility & Responsiveness (WCAG 2.1 AA)

- **High-contrast ratios:** Text against backgrounds meets or exceeds `4.5:1` contrast ratio.
- **Keyboard navigation:** All diagram nodes, modal dialogs, playground sliders, and Lexi controls support keyboard focus and shortcuts.
- **Screen readers:** Programmatic `<title>`, `<desc>`, and descriptive `aria-label` attributes on all interactive canvas and SVG elements.
- **Reduced motion:** Respects `@media (prefers-reduced-motion: reduce)` by disabling non-essential animations.
