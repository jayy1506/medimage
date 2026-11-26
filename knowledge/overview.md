# Platform Overview & Vision

## Institutional Academic Purpose
The Medical Text and Image Processing Interactive Learning Platform (MedImage / GyaanLab) is an institutional-grade, specialized learning system engineered specifically for the undergraduate course **AIDS 12605.1 (B.Tech Semester VI)** at the Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research (Deemed to be University).

## Educational Vision
The platform bridges foundational biomedical physics, clinical diagnostic workflows, computer vision, and healthcare NLP by providing engineering students with:
1. Hands-on, synchronous visual workstations.
2. Real-time client-side algorithmic sandboxes (running at 60 FPS in WebAssembly and Canvas).
3. Curriculum-grounded AI tutoring (Lexi).
4. Automated Pyodide WebAssembly Python coding exercises.
5. Strict mastery assessment gates.

## Interactive Dual-Panel Academic Environment
The platform's core learning experience is structured around a synchronized dual-panel layout:
- **Left Panel (Conceptual & Mathematical Theory):** Clinical motivation, anatomy, rigorous KaTeX mathematical equations, step-by-step diagnostic workflows, worked case studies, and formative quick checks.
- **Right Panel (Interactive Visual Workstation):** Dynamic visual sync powered by `IntersectionObserver`. As students scroll through clinical theory, the right workstation dynamically mounts the corresponding interactive diagram, CT Window/Level slider, 2D Convolution kernel visualizer, 2D FFT filter studio, or DICOM metadata explorer.

## Zero-Cloud-Cost Architecture & Zero Local Storage
All visual processing and code execution run client-side in the student's browser:
- Image processing algorithms run in WebAssembly and HTML5 Canvas with sub-16ms latency.
- Python algorithms run in-browser using Pyodide (WebAssembly), requiring no cloud VM sandboxes.
- Strict Zero Local Storage policy: No patient DICOM files or SQLite databases are stored locally on student devices; persistence uses hosted Supabase (PostgreSQL) and Upstash Redis.
