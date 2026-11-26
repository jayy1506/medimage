# User Guide & Navigation

## Getting Started & Authentication
1. Navigate to the login page (`/login`).
2. Enter your institutional email or username (`admin` or email) and password.
3. Upon authentication, you will be directed to the main academic dashboard.

## Exploring Syllabus Modules & Topics
1. Select any module from Module 1 to Module 6.
2. In the **Left Panel**, read the theoretical derivations, medical physics concepts, and KaTeX mathematical formulas.
3. In the **Right Panel**, observe the interactive visual workstation that automatically scrolls and synchronizes with your current topic reading position via `IntersectionObserver`.

## Using the Client-Side Image Playgrounds
- **CT Windowing (`/playground`):** Drag the Window Width (WW) and Window Level (WL) sliders or click clinical preset buttons (Brain, Bone, Lung, Soft Tissue) to view real-time contrast mapping and live Hounsfield Unit (HU) probe values.
- **2D Convolution:** Select Sobel, Gaussian Blur, Laplacian, or custom kernels to observe spatial filtering. Hover over pixels to inspect the $3 \times 3$ element-wise multiplication and discrete sum ($K \ast I$). Use the Curtain Compare slider to inspect differences.
- **2D Fourier Frequency Studio:** View the 2D k-space power spectrum, draw low-pass, high-pass, or notch masks, and observe live spatial domain reconstruction via inverse Fast Fourier Transform.
- **Medical Image Segmentation:** Adjust Otsu thresholds, test region growing seeds, and apply morphological dilation and erosion.
- **DICOM Metadata Explorer:** Inspect standard tags (`(0010,0020)`, `(0028,0010)`, `(0028,0030)`) on anonymized clinical datasets.

## Solving Clinical Diagnostic Missions (`/playground/missions`)
1. Select a clinical challenge (e.g., Calvarial Bone Fracture or Acute Subdural Hematoma).
2. Adjust windowing parameters to match target physiological contrast criteria.
3. Use hints if needed (-5 point hint penalty).
4. Click **Submit Mission** to verify your score against the server-side validator (`/api/v1/missions/submit`).

## Building Bioimage Pipelines (`/playground/pipeline`)
1. Drag and chain visual image processing blocks (e.g., Gaussian Blur → Otsu Thresholding → Morphological Erode).
2. Inspect live intermediate canvas thumbnails at each pipeline step.
3. Click **Export Equivalent Python Script** to download ready-to-run Python code utilizing `cv2`, `numpy`, and `scipy.ndimage`.

## Running In-Browser Python Code via Pyodide Sandbox
1. Open any embedded coding exercise.
2. Write Python code using pre-loaded scientific libraries (`numpy`, `opencv-python`, `pydicom`).
3. Click **Run Code** to execute 100% in your browser using Pyodide WebAssembly with automated test evaluation and zero server latency.

## Taking Assessments & Achieving Mastery
1. Navigate to the assessment section at the end of each module.
2. Complete the randomized 15 MCQs.
3. Submit your answers. Module clearance strictly requires $> 75\%$ score.
4. If score is $\le 75\%$, review the automated remediation guidance pointing to specific slide units and retake the assessment.

## Using Lexi AI Academic Assistant
- Open Lexi by clicking the floating circular launcher button in the bottom-right corner or pressing **`Ctrl + J`** (**`Cmd + J`** on Mac).
- Switch between **Normal** (compact floating), **Half** (docked split-screen), and **Full** (full viewport) modes anytime using the header switcher or **`Ctrl + Shift + 1/2/3`**.
- Ask questions about any syllabus concept, playground algorithm, assessment rule, or platform feature.
