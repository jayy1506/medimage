# Curriculum Content & Visual Syllabus Specification

**Course Code:** AIDS 12605.1 (B.Tech Semester VI)  
**Subject:** Medical Text and Image Processing  
**Institution:** Faculty of Engineering and Technology (FET), DMIHER  
**Credits:** 3 | **Teaching Scheme:** Theory 3 hrs/week | **Examination Scheme:** Internal 40 + End-Sem 60  
**Status:** Approved for Implementation  

---

## 1. Course Outcomes (CO) Matrix

- **CO1:** Describe various modalities of medical image sources (Radiology, CT, MRI, Ultrasound, Nuclear Medicine).
- **CO2:** Explain image processing operations and representation (Voxels, dynamic range, DICOM, SNR).
- **CO3:** Apply image transformation tools to various applications (Filtering, Fourier transforms, segmentation, morphological ops).
- **CO4:** Design tools to read, visualize and process medical images (Reformatting, rendering, volume visualization, DICOM parsing).

---

## 2. Comprehensive Module & Topic Breakdown

```mermaid
graph TD
    M1[Module 1: Medical Image Sources\n8 Hours | CO1]
    M2[Module 2: Image Processing in Clinical Practice\n8 Hours | CO2]
    M3[Module 3: Image Representation & DICOM\n8 Hours | CO2, CO4]
    M4[Module 4: Operations in Intensity Space\n7 Hours | CO2, CO3]
    M5[Module 5: Filtering, Transforms & Segmentation\n7 Hours | CO3]
    M6[Module 6: Spatial Transforms & 3D Rendering\n7 Hours | CO3, CO4]
    M7[Module 7 (Optional Enrichment): Medical Text & NLP\nEnrichment | CO2, CO4]
```

---

### Module 1: Medical Image Sources (8 Hours — CO1)

| Topic Slug | Topic Title & Scope | Key Formulas & Physics | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m1-t1-radiology-spectrum` | **Radiology & The Electromagnetic Spectrum**<br>Dual wave-particle nature of X-radiation, photon energy, clinical wavelengths. | $E = h\nu = \frac{hc}{\lambda}$ | Mermaid: *Electromagnetic Spectrum with Diagnostic Imaging Windows* |
| `m1-t2-xray-physics-attenuation` | **Basic X-ray Physics & Attenuation**<br>Bremsstrahlung radiation, characteristic radiation, Compton scattering, photoelectric effect, linear attenuation coefficient $\mu$. | $I(x) = I_0 e^{-\mu x}$ | Interactive SVG: *Photon Transmission, Scattering & Half-Value Layer (HVL)* |
| `m1-t3-computed-tomography` | **Computed Tomography (CT) Principles**<br>Gantry geometry, fan-beam vs. cone-beam, Radon transform, backprojection concept, Hounsfield scale. | $p(s, \theta) = \int f(x, y) ds$<br>$HU = 1000 \times \frac{\mu - \mu_w}{\mu_w}$ | Mermaid Flowchart: *Radon Projection to Filtered Backprojection Pipeline* |
| `m1-t4-magnetic-resonance-imaging` | **Magnetic Resonance Imaging (MRI)**<br>Nuclear magnetic resonance, Larmor frequency, RF excitation, T1 longitudinal & T2 transverse relaxation. | $\omega_0 = \gamma B_0$ | SVG: *Net Magnetization Vector Precession, RF Pulse & Free Induction Decay (FID)* |
| `m1-t5-ultrasound-imaging` | **Ultrasound Imaging Principles**<br>Piezoelectric effect, acoustic impedance $Z$, reflection/refraction, Doppler effect in hemodynamic monitoring. | $Z = \rho c$<br>$R = \left(\frac{Z_2 - Z_1}{Z_2 + Z_1}\right)^2$ | Mermaid: *Acoustic Pulse-Echo Signal Chain & Transducer Array* |
| `m1-t6-nuclear-medicine` | **Nuclear Medicine & Molecular Imaging**<br>Radioisotopes (Tc-99m, F-18 FDG), gamma cameras, Single-Photon Emission CT (SPECT), Positron Emission Tomography (PET). | $A(t) = A_0 e^{-\lambda t}$ | SVG: *PET Coincidence Annihilation Detection Geometry* |

---

### Module 2: Image Processing in Clinical Practice (8 Hours — CO2)

| Topic Slug | Topic Title & Scope | Key Algorithms & Methods | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m2-t1-image-databases-pacs` | **Clinical Image Databases & PACS**<br>Picture Archiving and Communication Systems (PACS), DICOM servers, Vendor Neutral Archives (VNA). | Client-Server DICOM C-STORE, C-FIND, C-MOVE | Mermaid: *PACS Network Architecture & Modality Worklist Integration* |
| `m2-t2-clinical-intensity-ops` | **Intensity Operations in Diagnostics**<br>Contrast manipulation, negative transforms, dynamic range compression for soft tissue evaluation. | $s = T(r)$ | Interactive SVG: *Transfer Function Curve with Contrast Stretch* |
| `m2-t3-spatial-filtering-clinical` | **Spatial Filtering in Diagnostic Scans**<br>Noise reduction in low-dose CT, bone edge enhancement, median filtering for speckle noise. | $g(x, y) = \sum \sum f(x-s, y-t) w(s, t)$ | SVG: *Convolution Window Slid Across Diagnostic Matrix* |
| `m2-t4-clinical-segmentation-intro` | **Segmentation Overview in Pathology**<br>Tumor boundary delineation, organ-at-risk segmentation in radiation therapy planning. | Boundary error metrics: Dice Similarity Coefficient, Jaccard Index | Mermaid: *Clinical Radiation Therapy Planning Segmentation Workflow* |

---

### Module 3: Image Representation & DICOM (8 Hours — CO2, CO4)

| Topic Slug | Topic Title & Scope | Key Standards & Equations | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m3-t1-pixels-voxels-grid` | **Pixels, Voxels & 3D Spatial Grid**<br>Discrete coordinate systems, voxel aspect ratios, isotropic vs. anisotropic voxel spacing. | $V = \Delta x \cdot \Delta y \cdot \Delta z$ | SVG 3D Model: *Voxel Volume Representation with Anisotropic Z-Slice Spacing* |
| `m3-t2-grayscale-color-spaces` | **Grayscale & Color Representation**<br>Bit depth (8-bit, 12-bit, 16-bit), RGB vs. HSI, pseudo-coloring in Doppler ultrasound and PET/CT fusion. | Bit-depth dynamic range: $2^n - 1$ | Interactive SVG: *PET/CT Dual-Modality Color Fusion Blending* |
| `m3-t3-dicom-standard-fileformat` | **The DICOM Standard & File Structure**<br>File meta-information, preamble, tag structure (Group, Element), Value Representation (VR), transfer syntaxes. | Tag: `(GGGG, EEEE)`, VR, Length, Value | Mermaid: *DICOM Part 10 File Hierarchy & Information Object Definitions (IOD)* |
| `m3-t4-image-quality-snr` | **Image Quality, Contrast & SNR**<br>Signal-to-Noise Ratio (SNR), Contrast-to-Noise Ratio (CNR), Modulation Transfer Function (MTF), spatial resolution. | $SNR = \frac{\mu_{ROI}}{\sigma_{ROI}}$<br>$CNR = \frac{\lvert\mu_A - \mu_B\rvert}{\sigma_{noise}}$ | SVG: *Contrast-to-Noise Curve and Point Spread Function (PSF)* |

---

### Module 4: Operations in Intensity Space (7 Hours — CO2, CO3)

| Topic Slug | Topic Title & Scope | Key Formulas | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m4-t1-intensity-transforms-dynamic` | **Intensity Transform Functions & Dynamic Range**<br>Linear, logarithmic, and power-law (gamma) transforms for medical dynamic range expansion. | $s = c \log(1 + r)$<br>$s = c r^\gamma$ | Interactive SVG: *Gamma Curves with Diagnostic Contrast Mapping* |
| `m4-t2-ct-windowing-level` | **CT Windowing & Leveling (WL / WW)**<br>Mapping wide Hounsfield ranges to 8-bit monitor space; standard window presets (Brain, Subdural, Bone, Lung). | $s = \frac{r - (WL - WW/2)}{WW} \times 255$ | Interactive Mermaid/Canvas: *Windowing Step Function & Transfer Line* |
| `m4-t3-histograms-operations` | **Histograms & Histogram Equalization**<br>Probability density functions (PDF), cumulative distribution functions (CDF), global vs. CLAHE (Adaptive). | $s_k = (L-1) \sum_{j=0}^{k} p_r(r_j)$ | SVG: *Histogram Flattening and CDF Equalization Curve* |
| `m4-t4-dithering-bitdepth` | **Dithering, Quantization & Bit Depth**<br>False contouring artifacts, Floyd-Steinberg error diffusion, quantization noise in digital detectors. | Quantization error: $\sigma_q = \frac{q}{\sqrt{12}}$ | SVG: *False Contouring vs Dithered Pixel Matrix* |

---

### Module 5: Filtering, Transformations & Segmentation (7 Hours — CO3)

| Topic Slug | Topic Title & Scope | Mathematical Basis | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m5-t1-spatial-filtering-kernels` | **Spatial Filtering & Edge Detection**<br>Gaussian smoothing, Laplacian of Gaussian, Sobel and Prewitt gradient operators for vascular edge detection. | $\nabla f = \left[\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right]^T$ | Mermaid: *2D Spatial Convolution Pipeline* |
| `m5-t2-fourier-transform-medical` | **2D Discrete Fourier Transform in Medical Imaging**<br>Spatial frequencies, magnitude & phase spectra, Fourier slice theorem in CT reconstruction, k-space in MRI. | $F(u, v) = \sum\sum f(x, y) e^{-j2\pi(\frac{ux}{M} + \frac{vy}{N})}$ | SVG: *k-Space Frequency Trajectory to Spatial Image IFFT* |
| `m5-t3-thresholding-otsu` | **Image Segmentation via Thresholding**<br>Global, local adaptive, and Otsu's optimal between-class variance maximization. | $\sigma_B^2(t) = \omega_0(t)\omega_1(t)[\mu_0(t) - \mu_1(t)]^2$ | SVG: *Bimodal Intensity Distribution & Otsu Optimal Cutoff* |
| `m5-t4-region-growing-clustering` | **Region Growing & Morphological Segmentation**<br>Seed selection, homogeneity criteria, dilation, erosion, opening, closing for lesion isolation. | $A \oplus B = \{z \mid (\hat{B})_z \cap A \neq \emptyset\}$ | Mermaid Flowchart: *Iterative Seeded Region Growing Algorithm* |
| `m5-t5-segmentation-evaluation` | **Evaluation of Medical Segmentation**<br>Ground truth validation, Dice Similarity Coefficient (DSC), Hausdorff Distance (HD95), sensitivity, specificity. | $DSC = \frac{2 \lvert A \cap B \rvert}{\lvert A \rvert + \lvert B \rvert}$ | SVG: *Ground Truth Mask vs Prediction Overlap with Confusion Matrix* |

---

### Module 6: Spatial Transforms & 3D Rendering (7 Hours — CO3, CO4)

| Topic Slug | Topic Title & Scope | Mathematical Formulation | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m6-t1-discretization-resolution` | **Discretization, Sampling & Artifacts**<br>Nyquist-Shannon sampling theorem in digital detectors, aliasing, partial volume effect, motion artifacts. | $f_s \ge 2 f_{max}$ | SVG: *Nyquist Sampling Rate & Aliasing Frequency Shift* |
| `m6-t2-interpolation-regularization` | **Interpolation & Volume Regularization**<br>Nearest neighbor, bilinear, trilinear, and bicubic interpolation; isotropic volume resampling. | $f(x) = \sum c_k \beta^n(x - k)$ | SVG: *Comparison of 1D/2D Interpolation Kernel Profiles* |
| `m6-t3-rigid-affine-transforms` | **Spatial Transforms: Translation, Rotation & Affine**<br>Homogeneous coordinates, 2D/3D affine transformation matrices, rigid patient re-alignment. | $\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} = \begin{bmatrix} \cos\theta & -\sin\theta & t_x \\ \sin\theta & \cos\theta & t_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$ | Interactive SVG: *3D Matrix Coordinate Rotation & Patient Alignment* |
| `m6-t4-multiplanar-reformatting` | **Multiplanar Reformatting (MPR)**<br>Extracting orthogonal (Axial, Coronal, Sagittal) and oblique re-sliced planes from volumetric CT/MRI stacks. | Plane equation: $Ax + By + Cz + D = 0$ | SVG 3D Cross-Section: *Axial, Coronal, and Sagittal Reslicing Volumes* |
| `m6-t5-surface-volume-rendering` | **Rendering: Surface Models & Raycasting**<br>Maximum Intensity Projection (MIP), Direct Volume Rendering (DVR), raycasting emission-absorption model, marching cubes. | $I(s) = I_0 e^{-\tau(s)} + \int C(t) e^{-\tau(t)} dt$ | Mermaid: *Raymarching Sampling Pipeline with Transfer Functions* |

---

### Module 7 (Optional Enrichment): Medical Text & Clinical NLP

| Topic Slug | Topic Title & Scope | Techniques & Algorithms | Required Visual / Diagram |
| :--- | :--- | :--- | :--- |
| `m7-t1-clinical-text-deid` | **Clinical Notes & Medical Text De-identification**<br>HIPAA 18 Safe Harbor identifiers, rule-based vs. transformer NER (Named Entity Recognition) for PHI scrubbing. | Regular expressions, ClinicalBERT, bio-spacy | Mermaid Flowchart: *Clinical Text De-identification Pipeline* |
| `m7-t2-medical-nlp-radiology-reports` | **Information Extraction from Radiology Reports**<br>Extracting findings, impressions, and ICD-10 / RadLex coding from unstructured radiology summaries. | Rule-based section parsing, TF-IDF, prompt-guided structured extraction | Mermaid: *Unstructured Clinical Free-Text to Structured JSON Schema* |

---

## 3. Academic Citations & Open-Access Data Sources

### Primary Textbooks:
1. **Birkfellner, Wolfgang.** *Applied Medical Image Processing: A Basic Course.* 2nd ed., CRC Press / Taylor & Francis Group, 2016.
2. **Dougherty, Geoff (ed.).** *Medical Image Processing: Techniques and Applications.* Springer Science & Business Media, 2011.
3. **Zhou, Xiao-Hong (ed.).** *Medical Imaging: Principles and Applications.* CRC Press, 2019.

### Approved Open-Access Medical Datasets (Public Educational Samples Only):
- **NIH Clinical Center:** ChestX-ray14 dataset (De-identified frontal view chest radiographs, Public Domain / CC0).
- **The Cancer Imaging Archive (TCIA):** Open-access anonymized Head & Neck CT series and Knee MRI collections (CC BY 3.0 / CC BY 4.0).
- **MedNIST:** Medical Image Computing and Computer Assisted Intervention (MICCAI) educational dataset (CT, MRI, X-ray, Ultrasound 2D slices for educational benchmarking).
- **PhysioNet:** Open-access biomedical databases under the PhysioNet Credentialed & Open Health Data licenses.
