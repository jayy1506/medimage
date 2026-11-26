# Platform Features & Learning Modules

## Curriculum Structure & 6 Syllabus Modules
The platform implements all 6 syllabus modules of course AIDS 12605.1 with 144 slide units:
- **Module 1 (M1) - Radiology Modalities & Radiation Physics:** Physics of X-Ray attenuation, Beer-Lambert Law, Computed Tomography (CT), Sinograms, Radon Transform, Filtered Backprojection (FBP), Magnetic Resonance Imaging (MRI, T1 and T2 relaxation), Diagnostic Ultrasound, and Nuclear Medicine (SPECT/PET).
- **Module 2 (M2) - Image Representation, Enhancement & Segmentation:** Spatial filtering, 2D convolution kernels, histogram equalization, Otsu thresholding, region growing, and deep learning segmentation (U-Net architecture with skip connections).
- **Module 3 (M3) - Medical Imaging Standards & Formats:** DICOM file structures, tag dictionaries, PACS enterprise network architecture, and HL7 health informatics interoperability.
- **Module 4 (M4) - Quantitative Analysis & Clinical Metrics:** CT Hounsfield Units (HU), Window Width (WW) and Window Level (WL) contrast manipulation, and region-of-interest (ROI) measurements.
- **Module 5 (M5) - Clinical Text Processing & NLP:** Medical entity extraction, Clinical BERT, BioBERT, electronic health record (EHR) text summarization, and radiology report classification.
- **Module 6 (M6) - Healthcare AI Ethics & Regulatory Governance:** HIPAA compliance, FDA regulations for Software as a Medical Device (SaMD), bias mitigation in clinical datasets, and model interpretability.

## Client-Side Interactive Image Playgrounds
All playgrounds execute client-side at 60 FPS in WebAssembly and Canvas with zero server compute:
1. **CT Window Width / Window Level (WW/WL):**
   - Standard clinical presets:
     - Brain: $W=80, L=40$ HU
     - Bone: $W=2000, L=500$ HU
     - Lung: $W=1500, L=-600$ HU
     - Soft Tissue: $W=350, L=50$ HU
   - Live Hounsfield Unit (HU) probe and real-time contrast mapping.
2. **2D Spatial Convolution & Histogram Equalization:**
   - Real-time $3 \times 3$ kernel grid: Sobel X/Y, Gaussian Blur, Laplacian, Sharpen, and Edge Detect.
   - Neighborhood Pixel Inspector displaying matrix weights, element-wise products, and discrete convolution sum ($K \ast I$).
   - Curtain compare slider for before/after visual inspection.
3. **2D Fast Fourier Transform (FFT) & Frequency Masking:**
   - Spatial-to-frequency domain transformation.
   - Interactive drawing of low-pass, high-pass, and notch rejection masks on the 2D k-space power spectrum with live inverse FFT spatial synthesis.
4. **Medical Image Segmentation:**
   - Otsu global thresholding, interactive region growing with seed selection, and morphological operations (dilation, erosion, opening, closing).
5. **Privacy-First DICOM Metadata Explorer:**
   - Client-side parser for standard tags (Patient ID `(0010,0020)`, Rows `(0028,0010)`, Columns `(0028,0011)`, Pixel Spacing `(0028,0030)`).
   - Strict HIPAA privacy protection: sample anonymized clinical scans only; external file upload is blocked to prevent data leaks.

## Clinical Missions, Pipeline Builder & Mini-Games
- **Clinical Diagnostic Missions (`/playground/missions`):** 5 goal-based missions (Calvarial Bone Fracture Delineation, Acute Subdural Hematoma Contrast, Pulmonary Parenchyma Isolation, Glioblastoma Otsu Segmentation, and RF Moiré Stripe Suppression). Features target scoring (0–100), 1-3 star ratings, and server-side verification.
- **Bioimage Pipeline Builder (`/playground/pipeline`):** Visual block chaining (e.g., Gaussian Blur → Otsu Thresholding → Morphological Operations) with one-click Python script export (`cv2`, `numpy`, `scipy.ndimage`).
- **Clinical Mini-Games Hub (`/playground/games`):** Filter Match, Spot the Artifact, Frequency Mask Studio, and MRI Spin-Echo Contrast Simulator ($S = \rho(1 - e^{-TR/T_1})e^{-TE/T_2}$).

## In-Browser Pyodide WebAssembly Coding Sandbox
- Zero-cloud-cost Python runtime executing in the browser via Pyodide.
- Pre-loaded scientific stack: `numpy`, `opencv-python`, and `pydicom`.
- Embedded coding exercises with automated test assertions and client-side grading.

## Assessment Engine & Mastery Rule
- 90 Module MCQs (15 questions per module) + 40-question comprehensive Capstone Exam (130 questions total).
- **Strict Mastery Pass Mark:** Module clearance strictly requires $> 75\%$ score. Scores $\le 75\%$ require review and retake.
- Anti-cheating: Answer keys and explanations are validated strictly server-side on FastAPI.
