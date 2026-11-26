# Frequently Asked Questions (FAQ)

## Academic & Mastery Questions

### What is the mastery threshold for module assessments?
All module assessments strictly require a score of **greater than 75%** ($>75\%$) to pass. If a student scores $75\%$ or lower, the attempt is marked incomplete, and structured remediation guidance is provided pointing directly to relevant slide units.

### How is anti-cheating enforced on assessments?
Assessment answer keys and grading logic are evaluated strictly server-side on the FastAPI backend. No correct answers or grading rubrics are exposed in the client bundle or network payloads.

### How many modules and questions are there?
There are 6 syllabus modules containing 144 detailed slide units, 90 module assessment MCQs (15 per module), and a 40-question comprehensive Capstone Exam (130 questions total).

## Privacy, Data & Compute

### Does the platform store patient medical images?
No. The platform complies strictly with HIPAA and institutional privacy regulations. All medical images are anonymized, pre-approved clinical teaching samples. External image file uploads are blocked to prevent accidental patient data exposure.

### Where does the image processing and Python code execute?
All image processing algorithms (WW/WL, 2D convolution, 2D FFT, segmentation) and Python exercises execute 100% client-side in the student's browser using HTML5 Canvas, WebAssembly, and Pyodide. This delivers sub-16ms latency with zero cloud compute cost.

### What packages are pre-loaded in the Pyodide coding sandbox?
The sandbox includes `numpy`, `opencv-python` (`cv2`), and `pydicom`, allowing students to perform scientific image processing directly in WebAssembly.

## Lexi AI Assistant

### What are the keyboard shortcuts for Lexi?
- **`Ctrl + J`** (or **`Cmd + J`** on Mac): Toggle Lexi open/close.
- **`Ctrl + Shift + 1`**: Switch to Normal mode (floating window).
- **`Ctrl + Shift + 2`**: Switch to Half mode (docked side panel).
- **`Ctrl + Shift + 3`**: Switch to Full mode (full viewport).
- **`Esc`**: Close Lexi or exit Full mode.
- **`Ctrl + K`**: Focus the composer input box.

### Why does Lexi only answer questions about this project?
Lexi is an institutional academic guide engineered specifically for the Medical Text and Image Processing curriculum. To prevent hallucinations and ensure high academic rigor, Lexi answers strictly from verified course documentation and curriculum sources.

### What happens if Lexi does not find an answer in documentation?
If a question is related to the project but the information is not in the documentation, Lexi will reply:
*"I couldn't find that in the Medical Text and Image Processing (MedImage / GyaanLab) documentation. Please contact the project team."*
