import { TopicPayload } from "@/components/topic/DualPanelViewer";

export const MODULES_6_DATA: Record<string, TopicPayload> = {
  // ==========================================
  // MODULE 6: Spatial Transforms & 3D Rendering
  // ==========================================
  "m6-t1-discretization-artifacts": {
    id: "top-m6-t1",
    slug: "m6-t1-discretization-artifacts",
    title: "1. Discretization, Nyquist Limit & Sampling Artifacts",
    order_index: 1,
    co_tags: ["CO3"],
    read_time_minutes: 18,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t1-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Spatial Discretization & The Nyquist-Shannon Sampling Theorem",
        content_markdown: "Continuous anatomical reality must be converted into discrete spatial coordinates and quantized digital values before computational processing. The **Nyquist-Shannon sampling theorem** dictates that to faithfully reconstruct an anatomical structure without aliasing, the spatial sampling frequency $f_s = 1/\\Delta x$ must be at least twice the highest spatial frequency $f_{max}$ present in the object.\n\nWhen anatomical variations exceed the Nyquist frequency ($f_N = f_s / 2$), high-frequency patterns fold back into lower frequencies, manifesting as aliasing artifacts, staircasing along oblique edges, and high-frequency Moiré fringes across periodic anatomical grids.",
        formula_latex: "f_s \\ge 2 \\cdot f_{max} \\implies \\Delta x \\le \\frac{1}{2 \\cdot f_{max}} = \\frac{1}{2 \\cdot f_N}",
        linked_diagram_id: "diag-nyquist-aliasing"
      },
      {
        id: "sec-m6t1-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Discretization Artifact Matrix & Mitigation Protocols",
        content_markdown: "| Discretization Artifact | Physical Mechanism | Visual Radiologic Appearance | High-Risk Clinical Exam | Prevention & Mitigation Protocol |\n| :--- | :--- | :--- | :--- | :--- |\n| **Spatial Aliasing (Wrap-around)** | Sampling below Nyquist limit ($f_s < 2 f_{max}$) | Anatomical structures wrap from one edge of field-of-view (FOV) to opposite side | MRI Spine & Pelvis (phase-encoding wrap) | Oversampling in phase-encode direction (No-Phase-Wrap), anti-aliasing hardware filters |\n| **Partial Volume Averaging** | Voxel encompasses multiple distinct tissue types | Blurring of sharp boundaries; intermediate HU values (e.g. bone + air averaging into soft tissue) | CT detection of ground-glass pulmonary nodules & thin skull fractures | Sub-millimeter slice thickness ($0.5\\text{ mm}$ thin slice reconstruction) |\n| **Moiré Interference Fringes** | Interference between antiscatter grid frequency and detector sampling matrix | Zebra-stripe interference banding patterns | Digital Radiography (DR) portable bed-side chest radiography | Stationary grid suppression algorithms, oscillating Bucky grid |\n| **Staircase / Pixelation Artifact** | Coarse voxel grid viewed at high zoom or oblique reformatting | Jagged serrated edges along cortical bone and vessel walls | 3D multiplanar reconstructions with thick original slice intervals | Isotropic voxel acquisition ($0.625 \\times 0.625 \\times 0.625\\text{ mm}$), B-spline interpolation |\n\n**Nyquist Limit Formula:** f_N = \\frac{1}{2 \\Delta x}, \\quad \\text{Voxel Resolution Limit } d_{min} = 2 \\Delta x",
        formula_latex: "f_N = \\frac{1}{2 \\Delta x}, \\quad d_{min} = 2 \\Delta x",
        linked_diagram_id: "diag-nyquist-aliasing"
      },
      {
        id: "sec-m6t1-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Nyquist Limit for Pulmonary Micro-calcification",
        content_markdown: "**Clinical Scenario:** High-resolution chest CT must reliably detect lung microcalcifications measuring $0.6\\text{ mm}$ in diameter without spatial aliasing. The CT detector matrix is $512 \\times 512$ across a Field of View (FOV) of $300\\text{ mm}$.\n\n**Calculations:**\n- **Current Pixel Spacing:** $\\Delta x = \\frac{FOV}{Matrix} = \\frac{300\\text{ mm}}{512} \\approx 0.586\\text{ mm/pixel}$.\n- **Nyquist Frequency:** $f_N = \\frac{1}{2 \\cdot \\Delta x} = \\frac{1}{2 \\cdot 0.586\\text{ mm}} = 0.853\\text{ cycles/mm}$.\n- **Smallest Resolvable Period:** $d_{min} = 2 \\cdot \\Delta x = 2 \\cdot 0.586\\text{ mm} = 1.172\\text{ mm}$.\n- **Clinical Diagnostic Conclusion:** Because the $0.6\\text{ mm}$ microcalcification has spatial frequency $f = \\frac{1}{0.6} = 1.667\\text{ cycles/mm} > 0.853\\text{ cycles/mm}$, this CT protocol will alias and partially volume average the calcification. To resolve it, pixel spacing must be $\\le \\frac{0.6}{2} = 0.30\\text{ mm}$, requiring a targeted reconstruction FOV $\\le 512 \\times 0.30 = 153.6\\text{ mm}$ (targeted high-resolution lung protocol).",
        formula_latex: "\\Delta x = \\frac{FOV}{N} \\le \\frac{d_{target}}{2}",
        linked_diagram_id: "diag-nyquist-aliasing"
      },
      {
        id: "sec-m6t1-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: Antialiasing Filters & Digital Radiography Grids",
        content_markdown: "**Question:** Why must an optical or electronic analog anti-aliasing low-pass filter be applied before analog-to-digital conversion, rather than digitally removing aliasing after sampling?\n\n**Answer:** Once high frequencies above the Nyquist limit ($f > f_s / 2$) are digitized into discrete samples, their mathematical spectral identity folds irreversibly into lower frequencies within the baseband $[0, f_s/2]$. In the resulting digital array, true low-frequency anatomical signals and aliased high-frequency noise become mathematically indistinguishable and occupy identical frequency bins. Therefore, anti-aliasing filtering must physically attenuate frequencies above $f_N$ prior to sampling to protect data integrity.",
        formula_latex: "H_{pre}(f) = 0 \\quad \\forall |f| > \\frac{f_s}{2}",
        linked_diagram_id: "diag-nyquist-aliasing"
      }
    ],
    diagrams: [
      {
        id: "diag-nyquist-aliasing",
        title: "Discretization, Sampling Pipeline & Aliasing Formation",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Continuous[Continuous Patient Anatomy: High Spatial Frequencies] --> PreFilter[Analog Low-Pass Anti-Aliasing Filter]
    PreFilter --> ADC[ADC Sampling Grid: Delta x Detector Pitch]
    ADC --> SamplingCondition{fs >= 2 fmax ?}
    SamplingCondition -->|Yes: Nyquist Met| PerfectRecon[Faithful Reconstruction: Sharp Margins & Exact HU Values]
    SamplingCondition -->|No: Undersampled| AliasingFold[Spectral Folding: High Frequencies Fold into Baseband]
    AliasingFold --> Artifacts[Manifest Artifacts: Moiré Fringes, Staircasing, Phase-Wrap]
    style Continuous fill:#0077B6,color:#fff
    style PerfectRecon fill:#2E7D32,color:#fff
    style AliasingFold fill:#C2185B,color:#fff
    style Artifacts fill:#E65100,color:#fff`,
        interactive_node_map: {
          "PreFilter": "Hardware filter attenuating frequencies above Nyquist limit before ADC.",
          "AliasingFold": "Irreversible folding of spatial frequencies into anatomical passband."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-1",
        question_text: "To faithfully image a vascular lesion with spatial frequency components up to 1.5 cycles/mm without aliasing, what is the maximum permissible sampling interval (pixel size)?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "0.333 mm" },
          { id: "B", text: "0.667 mm" },
          { id: "C", text: "1.500 mm" },
          { id: "D", text: "3.000 mm" }
        ],
        correct_option_id: "A",
        explanation: "By Nyquist's theorem, fs >= 2 * fmax = 2 * 1.5 = 3.0 samples/mm. Delta x <= 1 / fs = 1 / 3.0 = 0.333 mm."
      }
    ],
    previous_topic_slug: "m5-t7-segmentation-evaluation",
    next_topic_slug: "m6-t2-interpolation-regularization"
  },

  "m6-t2-interpolation-regularization": {
    id: "top-m6-t2",
    slug: "m6-t2-interpolation-regularization",
    title: "2. Interpolation & Volume Regularization",
    order_index: 2,
    co_tags: ["CO3"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Interpolation Kernels & Anisotropic Volume Regularization",
        content_markdown: "Clinical volumetric scans are frequently acquired with anisotropic voxel grids, where in-plane pixel spacing is sub-millimeter ($0.5 \\times 0.5\\text{ mm}$) while slice thickness is significantly coarser ($3.0\\text{ to }5.0\\text{ mm}$). Performing oblique slicing, 3D surface extraction, or isotropic deep neural network inference on anisotropic voxels induces severe elongation distortions.\n\n**Volume regularization** resamples the voxel grid onto an isotropic lattice where $\\Delta x = \\Delta y = \\Delta z$. Interpolation calculates intensity values at continuous arbitrary coordinates by convolving discrete sample points with continuous reconstruction kernels.",
        formula_latex: "f(x) = \\sum_{k=-\\infty}^{\\infty} f(k) \\, h(x - k)",
        linked_diagram_id: "diag-interpolation-pipeline"
      },
      {
        id: "sec-m6t2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Comparative Analysis of Interpolation Kernels",
        content_markdown: "| Interpolation Technique | Mathematical Kernel $h(x)$ | Neighborhood Footprint | Computational Complexity | Smoothing vs Ringing (Gibbs) | Clinical Selection Criteria |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Nearest Neighbor** | Box function (0th order): $h(x) = 1$ for $|x| < 0.5$ | $1 \\times 1 \\times 1$ ($1$ voxel) | $O(1)$ Ultra-fast | High blocky pixelation; severe aliasing | **Categorical segmentation masks** and organ label maps (preserves integer class IDs) |\n| **Trilinear Interpolation** | Triangle function (1st order B-spline): $1 - |x|$ for $|x| < 1$ | $2 \\times 2 \\times 2$ ($8$ voxels) | $O(8)$ Fast (Hardware supported in GPU) | Moderate smoothing; zero ringing artifacts | Real-time multiplanar reformatting (MPR) and direct volume rendering (DVR) |\n| **Tricubic Interpolation** | 3rd order cubic polynomial with parameter $\\alpha = -0.5$ | $4 \\times 4 \\times 4$ ($64$ voxels) | $O(64)$ Moderate | Preserves high-frequency edge sharpness; minor overshoot | High-fidelity diagnostic reformations and radiation oncology planning |\n| **Cubic B-Spline** | Twice continuously differentiable $C^2$ bell curve | $4 \\times 4 \\times 4$ ($64$ voxels) | $O(64)$ Moderate | Maximum surface smoothness; mild intensity blurring | Deformable image registration (DIR) and motion tracking in lung 4D-CT |\n| **Sinc / Lanczos** | $\\text{sinc}(x) = \\frac{\\sin(\\pi x)}{\\pi x}$ windowed | $6 \\times 6 \\times 6$ to $8 \\times 8 \\times 8$ | $O(512)$ High | Theoretically perfect band-limiting; prominent Gibbs ringing | fMRI motion correction and retrospective k-space image reconstruction |\n\n**Trilinear Weighting Formulation:** f(x,y,z) = \\sum_{i=0}^1 \\sum_{j=0}^1 \\sum_{k=0}^1 f(x_i, y_j, z_k) (1-|x-x_i|)(1-|y-y_j|)(1-|z-z_k|)",
        formula_latex: "f(x,y,z) = \\sum_{i=0}^1 \\sum_{j=0}^1 \\sum_{k=0}^1 f(x_i, y_j, z_k)(1-\\Delta x)(1-\\Delta y)(1-\\Delta z)",
        linked_diagram_id: "diag-interpolation-pipeline"
      },
      {
        id: "sec-m6t2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Trilinear Interpolation of CT Attenuation",
        content_markdown: "**Clinical Scenario:** A ray passing through an anisotropic lung CT volume requires the Hounsfield Unit at continuous coordinate $(x=10.3, y=20.0, z=5.0)$. The surrounding integer grid points along the $x$-axis at $y=20, z=5$ have values: $f(10, 20, 5) = -800\\text{ HU}$ (normal lung parenchyma) and $f(11, 20, 5) = +100\\text{ HU}$ (adjacent pulmonary vein).\n\n**Calculations:**\n- **Normalized Distance:** $\\Delta x = 10.3 - 10 = 0.3$, $1 - \\Delta x = 0.7$.\n- **Since $y$ and $z$ are exactly on the grid:** Trilinear collapses into linear 1D interpolation.\n- **Interpolated Value:** $f(10.3, 20, 5) = (1 - 0.3) \\cdot f(10) + (0.3) \\cdot f(11) = 0.7 \\cdot (-800) + 0.3 \\cdot (100) = -560 + 30 = -530\\text{ HU}$.\n- **Diagnostic Caveat:** Notice that $-530\\text{ HU}$ represents an intermediate density. In raw diagnostic interpretation, this partial volume artifact must not be mistaken for ground-glass opacity.",
        formula_latex: "f(x) = (1 - \\Delta x) f_0 + \\Delta x f_1",
        linked_diagram_id: "diag-interpolation-pipeline"
      },
      {
        id: "sec-m6t2-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: Preserving Organ Segmentation Masks During Resampling",
        content_markdown: "**Question:** A deep learning engineer trains a 3D U-Net requiring isotropic $1.0\\text{ mm}^3$ input. When resampling liver segmentation masks where liver=1, spleen=2, kidney=3, why does using trilinear or bicubic interpolation produce catastrophic corruption?\n\n**Answer:** Trilinear and bicubic interpolation compute weighted continuous arithmetic averages between neighboring integer indices. At the border between liver (class 1) and kidney (class 3), trilinear interpolation calculates intermediate values such as $1.7, 2.0, 2.4$. Rounding or thresholding these values erroneously creates artificial spleen voxels (class 2) floating along the liver-kidney anatomical interface. Therefore, discrete label maps must strictly utilize **Nearest Neighbor interpolation** to preserve categorical class identities.",
        formula_latex: "\\text{Labels} \\in \\{0, 1, 2, \\dots, K\\} \\implies \\text{Kernel: Nearest Neighbor strictly}",
        linked_diagram_id: "diag-interpolation-pipeline"
      }
    ],
    diagrams: [
      {
        id: "diag-interpolation-pipeline",
        title: "Volume Regularization & Interpolation Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Raw[Raw Anisotropic CT Stack: 0.5 x 0.5 x 5.0 mm] --> Decision{Data Type?}
    Decision -->|Continuous Grayscale: CT/MRI| ResampleCont[Continuous Interpolation Branch]
    Decision -->|Discrete Labels: Multi-Organ Mask| ResampleDisc[Categorical Label Branch]
    ResampleCont --> Trilinear[Trilinear / Tricubic B-Spline Resampling]
    ResampleDisc --> NN[Nearest Neighbor Strictly: Preserves Class Integers]
    Trilinear --> RegularizedVolume[Isotropic Volume: 1.0 x 1.0 x 1.0 mm Grid]
    NN --> RegularizedMask[Isotropic Segmentation Mask: Uncorrupted Boundaries]
    RegularizedVolume --> Downstream[Downstream 3D Deep Learning & Surface Rendering]
    RegularizedMask --> Downstream
    style Raw fill:#0077B6,color:#fff
    style Trilinear fill:#662D91,color:#fff
    style NN fill:#B82662,color:#fff
    style Downstream fill:#2E7D32,color:#fff`,
        interactive_node_map: {
          "NN": "Nearest Neighbor guarantees output contains only valid categorical class integers.",
          "Trilinear": "Trilinear smooths continuous intensity gradients for high-fidelity visual rendering."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-2",
        question_text: "When regularizing an anisotropic CT scan and its multi-organ label mask (Aorta=1, Vena Cava=2, Spine=3) to isotropic resolution, which interpolation kernels should be used for the CT scan and label mask respectively?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "Trilinear/Tricubic for CT, Nearest Neighbor for label mask" },
          { id: "B", text: "Nearest Neighbor for CT, Trilinear for label mask" },
          { id: "C", text: "Bicubic for both CT and label mask" },
          { id: "D", text: "Sinc interpolation for both CT and label mask" }
        ],
        correct_option_id: "A",
        explanation: "Continuous CT intensities require trilinear/tricubic for smooth anatomical transitions, while discrete label masks require nearest neighbor to prevent creating spurious non-existent organ labels."
      }
    ],
    previous_topic_slug: "m6-t1-discretization-artifacts",
    next_topic_slug: "m6-t3-translation-rotation"
  },

  "m6-t3-translation-rotation": {
    id: "top-m6-t3",
    slug: "m6-t3-translation-rotation",
    title: "3. Rigid Body Transforms (Translation & Rotation Matrices)",
    order_index: 3,
    co_tags: ["CO3"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t3-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Rigid Body Spatial Transformations & Homogeneous Coordinates",
        content_markdown: "Medical image registration, surgical navigation, and multi-modal fusion align patient anatomy between coordinate frames (e.g., pre-operative MRI and intra-operative stereotactic tracking). A **rigid body transformation** preserves all internal distances and angles, permitting exactly **6 degrees of freedom (DoF)**: 3 translational shifts ($t_x, t_y, t_z$) and 3 rotational angles (yaw $\\psi$, pitch $\\theta$, roll $\\phi$).\n\nTo combine linear rotations and non-linear translations into a unified matrix multiplication pipeline, medical imaging systems employ **$4 \\times 4$ homogeneous coordinate transformation matrices**.",
        formula_latex: "\\begin{bmatrix} x' \\\\ y' \\\\ z' \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} r_{11} & r_{12} & r_{13} & t_x \\\\ r_{21} & r_{22} & r_{23} & t_y \\\\ r_{31} & r_{32} & r_{33} & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix}",
        linked_diagram_id: "diag-rigid-transform"
      },
      {
        id: "sec-m6t3-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Transformation Hierarchy in Medical Registration",
        content_markdown: "| Transformation Model | Degrees of Freedom (DoF) | Mathematical Properties | Invariant Geometrical Properties | Clinical Use Case in Healthcare |\n| :--- | :--- | :--- | :--- | :--- |\n| **Rigid Body (Euclidean)** | 6 (3 translation + 3 rotation) | $\\mathbf{R} \\in SO(3)$, $\\mathbf{R}^T \\mathbf{R} = \\mathbf{I}$, $\\det(\\mathbf{R}) = +1$ | Distances, angles, and object volumes are strictly preserved | Skull & brain registration, stereotactic neurosurgery, orthopedic joint alignment |\n| **Similarity Transformation** | 7 (6 rigid + 1 isotropic scale $s$) | $\\mathbf{T} = s \\mathbf{R} \\mathbf{x} + \\mathbf{t}$ | Angles and shape ratios preserved; volume scales by $s^3$ | Pediatric growth tracking, patient-to-atlas brain template scaling |\n| **Affine Transformation** | 12 (9 linear + 3 translation) | $\\mathbf{A} = \\mathbf{R} \\mathbf{S} \\mathbf{K}$ (includes shear $\\mathbf{K}$) | Parallel lines remain parallel; ratios of lengths preserved | Correcting scanner gantry tilt, MR gradient coil non-linearity calibration |\n| **Deformable / Non-Rigid** | Non-parametric ($10^5 - 10^7$ DoF) | B-spline Free-Form Deformation (FFD) or Demons vector field | Topology preserved only if Jacobian determinant $J > 0$ | 4D-CT respiratory lung motion tracking, prostate radiotherapy deformation |\n\n**Euler Rotation Composition:** \\mathbf{R} = \\mathbf{R}_z(\\psi) \\, \\mathbf{R}_y(\\theta) \\, \\mathbf{R}_x(\\phi)",
        formula_latex: "\\mathbf{R} = \\mathbf{R}_z(\\psi) \\mathbf{R}_y(\\theta) \\mathbf{R}_x(\\phi), \\quad \\mathbf{T}^{-1} = \\begin{bmatrix} \\mathbf{R}^T & -\\mathbf{R}^T \\mathbf{t} \\\\ \\mathbf{0}^T & 1 \\end{bmatrix}",
        linked_diagram_id: "diag-rigid-transform"
      },
      {
        id: "sec-m6t3-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Surgical Probe 3D Coordinate Mapping",
        content_markdown: "**Clinical Scenario:** During image-guided brain surgery, an optical tracker identifies a biopsy needle tip at coordinates $\\mathbf{p}_{tracker} = [10, 20, 50, 1]^T$ mm in tracker space. The calibration matrix aligning tracker space to pre-operative CT patient space consists of a $90^\\circ$ counter-clockwise rotation about the $Z$-axis followed by a translation of $[100, -50, 20]^T$ mm.\n\n**Calculations:**\n- **Rotation Matrix $R_z(90^\\circ)$:** $\\cos(90^\\circ)=0$, $\\sin(90^\\circ)=1$.\n  $$R_z(90^\\circ) = \\begin{bmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$$\n- **Full $4 \\times 4$ Homogeneous Matrix $\\mathbf{T}$:**\n  $$\\mathbf{T} = \\begin{bmatrix} 0 & -1 & 0 & 100 \\\\ 1 & 0 & 0 & -50 \\\\ 0 & 0 & 1 & 20 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}$$\n- **Matrix-Vector Multiplication:**\n  - $x' = 0(10) + (-1)(20) + 0(50) + 100 = -20 + 100 = \\mathbf{80\\text{ mm}}$\n  - $y' = 1(10) + 0(20) + 0(50) - 50 = 10 - 50 = \\mathbf{-40\\text{ mm}}$\n  - $z' = 0(10) + 0(20) + 1(50) + 20 = 50 + 20 = \\mathbf{70\\text{ mm}}$\n- **Patient CT Coordinates:** The biopsy needle tip is positioned at $\\mathbf{p}_{CT} = [80, -40, 70]^T$ mm with millimetric precision.",
        formula_latex: "\\mathbf{p}_{CT} = \\mathbf{T} \\cdot \\mathbf{p}_{tracker}",
        linked_diagram_id: "diag-rigid-transform"
      },
      {
        id: "sec-m6t3-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: Gimbal Lock & Quaternions in Robotic Surgery",
        content_markdown: "**Question:** Why do surgical robotic systems and tracking devices encode 3D spatial rotations using Unit Quaternions or Rotation Matrices rather than standard Euler angles (yaw, pitch, roll)?\n\n**Answer:** Euler angle parametrization represents 3D orientation through three sequential planar rotations. When the middle rotation axis aligns with another axis (e.g. pitch $= \\pm 90^\\circ$), the first and third rotation axes become collinear, resulting in the loss of one rotational degree of freedom—a dangerous mathematical singularity known as **gimbal lock**. In surgical robotics, gimbal lock causes instantaneous velocity spikes and tracking failure. **Unit quaternions** $\\mathbf{q} = w + x\\mathbf{i} + y\\mathbf{j} + z\\mathbf{k}$ ($|\\mathbf{q}|=1$) provide a smooth, continuous, singularity-free representation of $SO(3)$ rotations.",
        formula_latex: "\\mathbf{q} = \\left(\\cos\\frac{\\theta}{2}, \\, \\mathbf{u}\\sin\\frac{\\theta}{2}\\right), \\quad |\\mathbf{q}| = 1",
        linked_diagram_id: "diag-rigid-transform"
      }
    ],
    diagrams: [
      {
        id: "diag-rigid-transform",
        title: "3D Coordinate Transformation & Surgical Registration Flow",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    TrackerCoords[Tracker Space: Optical / EM Probe x,y,z,1] --> Matrix4x4[4x4 Homogeneous Matrix T: Rotation R + Translation t]
    Matrix4x4 --> MatrixCheck{Valid Rigid Body? Det R == +1}
    MatrixCheck -->|Valid SO3| PatientSpace[Patient CT Space: Millimetric Anatomy Alignment]
    MatrixCheck -->|Singularity / Shear| Alert[Registration Error: Flag Gimbal Lock or Shear]
    PatientSpace --> Display[3D Surgical Navigation Overlay]
    style TrackerCoords fill:#0077B6,color:#fff
    style Matrix4x4 fill:#662D91,color:#fff
    style PatientSpace fill:#2E7D32,color:#fff
    style Alert fill:#C2185B,color:#fff`,
        interactive_node_map: {
          "Matrix4x4": "Combines 3 rotation angles and 3 translation offsets into single matrix.",
          "PatientSpace": "Real-time navigation display overlaying instrument onto patient anatomy."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-3",
        question_text: "How many independent degrees of freedom (DoF) characterize a 3D rigid body transformation in surgical navigation?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "6 (3 translation + 3 rotation)" },
          { id: "B", text: "3 (translation only)" },
          { id: "C", text: "12 (affine)" },
          { id: "D", text: "7 (rigid + isotropic scale)" }
        ],
        correct_option_id: "A",
        explanation: "A 3D rigid body has exactly 6 DoF: 3 translational parameters (tx, ty, tz) and 3 rotational angles (yaw, pitch, roll)."
      }
    ],
    previous_topic_slug: "m6-t2-interpolation-regularization",
    next_topic_slug: "m6-t4-reformatting-mpr"
  },

  "m6-t4-reformatting-mpr": {
    id: "top-m6-t4",
    slug: "m6-t4-reformatting-mpr",
    title: "4. Multiplanar Reformatting (MPR, CPR, MIP, MinIP)",
    order_index: 4,
    co_tags: ["CO3"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t4-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Multiplanar Reformatting & Volumetric Projection Operators",
        content_markdown: "Medical CT and MRI scanners acquire primary datasets along a single patient axis (typically axial). However, complex anatomical trajectories—such as the tortuous Left Anterior Descending (LAD) coronary artery or the curved spinal cord—cannot be evaluated on single axial slices.\n\n**Multiplanar Reformatting (MPR)** intersects the 3D voxel volume with arbitrary planar or curved geometries to generate orthogonal (coronal, sagittal), oblique, or **Curved Planar Reformations (CPR)**. Thick-slab reformatting employs mathematical projection operators along viewing rays.",
        formula_latex: "I_{MIP}(x,y) = \\max_{z \\in [z_0, z_1]} I(x,y,z), \\quad I_{MinIP}(x,y) = \\min_{z \\in [z_0, z_1]} I(x,y,z)",
        linked_diagram_id: "diag-mpr-pipeline"
      },
      {
        id: "sec-m6t4-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Comparative Analysis of Volumetric Reformatting Modalities",
        content_markdown: "| Reformatting Mode | Ray Aggregation Operator | Diagnostic Clinical Target | Key Clinical Strength | Major Diagnostic Pitfall / Artifact |\n| :--- | :--- | :--- | :--- | :--- |\n| **Standard MPR (Thin)** | Trilinear interpolation along plane | Multi-organ anatomy, fractures, tumor staging | Precise true-to-scale dimensional measurement | Requires high cognitive load to track tortuous anatomy across slices |\n| **Curved Planar (CPR)** | Resampling along curved 3D vessel centerline | Coronary CT Angiography (CCTA), biliary tree, ureters | Displays entire tortuous vessel lumen in a single straightened 2D view | Centerline tracking errors induce artificial pseudo-stenoses |\n| **Maximum Intensity Projection (MIP)** | $I_{out} = \\max(I_{ray})$ | CT Angiography (pulmonary embolism, intracranial aneurysms) | Emphasizes contrast-filled vascular trees and bone | Superimposes structures along ray; overestimates vessel stenosis; masks soft tissue |\n| **Minimum Intensity Projection (MinIP)** | $I_{out} = \\min(I_{ray})$ | Tracheobronchial tree, lung emphysema, bile ducts | Emphasizes low-density structures (air, cysts, fluid) | High sensitivity to dark noise; misses hyperdense nodules |\n| **Average Intensity Projection (AIP)** | $I_{out} = \\frac{1}{N} \\sum I_{ray}$ | Radiation oncology 4D-CT internal target volume (ITV) | Accurately represents mean tissue density and electron attenuation | Reduces overall image contrast; blurs moving boundaries |\n\n**CPR Coordinate Generation:** \\mathbf{p}(u, v) = \\mathbf{c}(u) + v \\cdot \\mathbf{n}(u), \\quad \\mathbf{c}(u) \\text{ is vessel centerline curve}",
        formula_latex: "\\mathbf{p}(u,v) = \\mathbf{c}(u) + v \\cdot \\mathbf{n}(u)",
        linked_diagram_id: "diag-mpr-pipeline"
      },
      {
        id: "sec-m6t4-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: MIP vs MinIP Ray Evaluation Across Lung Parenchyma",
        content_markdown: "**Clinical Scenario:** A radiologist reviews a 10 mm thick CT slab passing through a lung segment containing normal aerated parenchyma ($-850\\text{ HU}$), a hyperdense calcified granuloma ($+450\\text{ HU}$), soft-tissue bronchovascular stroma ($+40\\text{ HU}$), and an emphysematous air bulla ($-980\\text{ HU}$).\n\n**Calculations:**\n- **MIP Operator:** $I_{MIP} = \\max(-850, +450, +40, -980) = \\mathbf{+450\\text{ HU}}$ (Brightly visualizes the calcified granuloma while completely obscuring the emphysematous bulla).\n- **MinIP Operator:** $I_{MinIP} = \\min(-850, +450, +40, -980) = \\mathbf{-980\\text{ HU}}$ (Conspicuously highlights the air trapping and emphysematous destruction).\n- **Average Intensity Projection (AIP):** $I_{AIP} = \\frac{-850 + 450 + 40 - 980}{4} = \\frac{-1340}{4} = \\mathbf{-335\\text{ HU}}$.",
        formula_latex: "I_{MIP} = \\max(I_i), \\quad I_{MinIP} = \\min(I_i), \\quad I_{AIP} = \\frac{1}{K} \\sum I_i",
        linked_diagram_id: "diag-mpr-pipeline"
      },
      {
        id: "sec-m6t4-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: Vessel Stenosis Overestimation in MIP Projections",
        content_markdown: "**Question:** Why does Maximum Intensity Projection (MIP) systematically overestimate vascular luminal stenosis or occlusion when dense calcified atherosclerotic plaques line the arterial wall?\n\n**Answer:** Because the MIP algorithm selects the single maximum pixel value along each viewing ray ($I_{out} = \\max(I_{ray})$), a dense calcified wall plaque ($+1200\\text{ HU}$) will dominate every ray that intersects any part of its margin. Even if iodinated blood contrast ($+350\\text{ HU}$) continues to flow freely through a patent central channel, the bright plaque voxels overwrite the lumen on 2D MIP projections—creating the false appearance of complete occlusion. Accurate stenosis quantification requires cross-sectional orthogonal thin MPR or lumen-profile CPR.",
        formula_latex: "\\max(\\text{Plaque}_{1200}, \\text{Contrast}_{350}) = 1200 \\implies \\text{Lumen Overwritten}",
        linked_diagram_id: "diag-mpr-pipeline"
      }
    ],
    diagrams: [
      {
        id: "diag-mpr-pipeline",
        title: "Volumetric Multiplanar Reformatting & Ray Projection Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Volume[3D Isotropic Voxel Volume] --> ReformatType{Reformatting Mode?}
    ReformatType -->|Thin Reslice| Planar[Planar Slicing: Axial, Coronal, Sagittal, Oblique]
    ReformatType -->|Vessel Centerline| CPR[Curved Planar Reformation CPR: Straightened Lumen]
    ReformatType -->|Thick Slab Projection| Raycast[Ray Traversal Across Slab Thickness]
    Raycast --> MIP[MIP: Max Intensity -> Angiography & Calcifications]
    Raycast --> MinIP[MinIP: Min Intensity -> Airways & Emphysema]
    Raycast --> AIP[AIP: Mean Intensity -> Radiotherapy ITV Planning]
    style Volume fill:#0077B6,color:#fff
    style CPR fill:#662D91,color:#fff
    style MIP fill:#B82662,color:#fff
    style MinIP fill:#0077B6,color:#fff
    style AIP fill:#2E7D32,color:#fff`,
        interactive_node_map: {
          "CPR": "Maps curved centerline into 2D plane for unobstructed lumen inspection.",
          "MIP": "Selects maximum voxel intensity along ray; ideal for CT Angiography."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-4",
        question_text: "Which reformatting projection is most diagnostically sensitive for detecting subtle mosaic air-trapping, bronchiectasis, and emphysematous bullae in thoracic CT?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "Minimum Intensity Projection (MinIP)" },
          { id: "B", text: "Maximum Intensity Projection (MIP)" },
          { id: "C", text: "Curved Planar Reformation (CPR)" },
          { id: "D", text: "Shaded Surface Display (SSD)" }
        ],
        correct_option_id: "A",
        explanation: "MinIP extracts the lowest attenuation value along each projection ray, making low-density air trapping and bronchial lumens prominent."
      }
    ],
    previous_topic_slug: "m6-t3-translation-rotation",
    next_topic_slug: "m6-t5-projection-models"
  },

  "m6-t5-projection-models": {
    id: "top-m6-t5",
    slug: "m6-t5-projection-models",
    title: "5. Orthogonal vs Perspective Projections & Viewpoints",
    order_index: 5,
    co_tags: ["CO3"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t5-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Camera Models & 3D-to-2D Perspective Mapping",
        content_markdown: "Rendering 3D medical datasets onto 2D workstation displays requires projecting 3D spatial points $\\mathbf{P} = [X, Y, Z]^T$ onto a 2D projection plane $[u, v]^T$.\n\nIn **Orthographic (Parallel) Projection**, projection rays are mutually parallel and perpendicular to the viewing canvas. Distance from the camera produces zero magnification changes. In contrast, **Perspective Projection** models realistic optical cameras (and human vision) where rays converge toward a focal center (focal length $f$). Perspective projection introduces natural depth foreshortening.",
        formula_latex: "u = f \\cdot \\frac{X}{Z}, \\quad v = f \\cdot \\frac{Y}{Z} \\quad \\text{(Perspective Pin-hole Model)}",
        linked_diagram_id: "diag-projection-models"
      },
      {
        id: "sec-m6t5-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Camera Calibration & Projection Geometry Matrix",
        content_markdown: "| Projection Parameter | Orthographic (Parallel) Projection | Perspective (Central) Projection | Clinical Implication in Medicine |\n| :--- | :--- | :--- | :--- |\n| **Ray Geometry** | Parallel rays (Focal center at $\\infty$) | Converging rays toward focal point $C$ | Perspective provides intuitive depth perception in virtual endoscopy |\n| **Scale vs Distance $Z$** | Independent of depth ($M = 1.0$) | Scale inversely proportional to depth ($M \\propto 1/Z$) | Orthographic preserves exact surgical millimeter caliper distances |\n| **Parallel Lines** | Always remain parallel | Converge toward vanishing points | Orthographic prevents perspective distortion in orthopedic template sizing |\n| **Field of View (FOV)** | Defined by planar bounding rectangle $(W \\times H)$ | Defined by viewing frustum angles $(\\theta_x, \\theta_y)$ | Virtual colonoscopy requires wide perspective FOV ($>90^\\circ$) to see behind folds |\n| **Projection Matrix** | $\\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}$ | $\\begin{bmatrix} f_x & 0 & c_x & 0 \\\\ 0 & f_y & c_y & 0 \\\\ 0 & 0 & 1 & 0 \\end{bmatrix}$ | Intrinsic camera matrix ($K$) calibrates fluoroscopy C-arms to optical trackers |\n\n**Magnification Factor in X-ray Fluoroscopy:** M = \\frac{\\text{SID}}{\\text{SOD}} = \\frac{\\text{Source-to-Image Distance}}{\\text{Source-to-Object Distance}}",
        formula_latex: "M = \\frac{\\text{SID}}{\\text{SOD}} = \\frac{\\text{SID}}{\\text{SID} - \\text{OID}}",
        linked_diagram_id: "diag-projection-models"
      },
      {
        id: "sec-m6t5-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Fluoroscopic Geometric Magnification & Foreshortening",
        content_markdown: "**Clinical Scenario:** During interventional vascular stenting, a C-arm fluoroscope is positioned with Source-to-Image Distance $\\text{SID} = 100\\text{ cm}$. A patient's renal artery sits at Source-to-Object Distance $\\text{SOD} = 75\\text{ cm}$. A metallic stent measuring $20\\text{ mm}$ in physical length is imaged parallel to the detector.\n\n**Calculations:**\n- **Geometric Magnification Factor:** $M = \\frac{\\text{SID}}{\\text{SOD}} = \\frac{100\\text{ cm}}{75\\text{ cm}} = 1.333$.\n- **Projected Length on Detector:** $L_{detector} = L_{physical} \\times M = 20\\text{ mm} \\times 1.333 = \\mathbf{26.67\\text{ mm}}$.\n- **Depth Sensitivity:** If table height is adjusted such that $\\text{SOD}$ decreases to $60\\text{ cm}$ without recalibration, $M = \\frac{100}{60} = 1.667$, expanding stent image to $33.33\\text{ mm}$.\n- **Clinical Rule:** Calibrated radiopaque sizing balls must always be placed in the same anatomical plane to accurately rescale perspective magnifications before stent deployment.",
        formula_latex: "L_{proj} = L_{true} \\cdot \\frac{\\text{SID}}{\\text{SOD}}",
        linked_diagram_id: "diag-projection-models"
      },
      {
        id: "sec-m6t5-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: Orthographic vs Perspective in Orthopedic Surgical Planning",
        content_markdown: "**Question:** Why must orthopedic hip replacement templating (sizing prosthetic femoral stems and acetabular cups) be performed on orthographic projections rather than perspective 3D renders?\n\n**Answer:** Perspective projection scales visual dimensions as a function of depth $Z$ ($u = f X / Z$). If a patient's femur is closer or further from the virtual camera viewpoint, its visual diameter expands or shrinks dynamically, misleading the orthopedic surgeon into selecting an oversized or undersized prosthetic component. **Orthographic projection** renders anatomical coordinates with constant metric scale ($1:1$ physical mapping) irrespective of depth, ensuring that physical templating calipers correspond precisely to surgical reality.",
        formula_latex: "\\frac{\\partial u}{\\partial Z}_{\\text{ortho}} = 0 \\quad \\text{vs} \\quad \\frac{\\partial u}{\\partial Z}_{\\text{persp}} = -\\frac{f X}{Z^2}",
        linked_diagram_id: "diag-projection-models"
      }
    ],
    diagrams: [
      {
        id: "diag-projection-models",
        title: "Orthographic vs Perspective Camera Projection Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Anatomy[3D Patient Anatomy X,Y,Z] --> CameraModel{Projection Model?}
    CameraModel -->|Orthographic: Infinite Focal Distance| Parallel[Parallel Projection Rays]
    CameraModel -->|Perspective: Finite Pinhole Center| Frustum[Converging Frustum Rays: u = fX/Z]
    Parallel --> OrthoOutput[Scale Invariant: 1:1 Metric Caliper Measurement]
    Frustum --> PerspOutput[Depth Foreshortening: Realistic Virtual Endoscopy]
    OrthoOutput --> OrthoUse[Orthopedic Implant Templating & Radiation Therapy]
    PerspOutput --> PerspUse[Virtual Colonoscopy & Laparoscopic Simulation]
    style Anatomy fill:#0077B6,color:#fff
    style Parallel fill:#2E7D32,color:#fff
    style Frustum fill:#662D91,color:#fff
    style OrthoUse fill:#0077B6,color:#fff
    style PerspUse fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Parallel": "Parallel rays eliminate distance-dependent magnification distortion.",
          "Frustum": "Rays converge to camera center, providing realistic 3D depth perception."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-5",
        question_text: "In virtual colonoscopy fly-through, which projection camera model is necessary to provide realistic depth perception and visualize polyps hidden behind haustral folds?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "Wide-angle perspective projection" },
          { id: "B", text: "Orthographic parallel projection" },
          { id: "C", text: "Affine shear projection" },
          { id: "D", text: "Isometric parallel projection" }
        ],
        correct_option_id: "A",
        explanation: "Perspective projection produces natural depth foreshortening where nearby objects appear larger, creating an intuitive endoscopic fly-through experience."
      }
    ],
    previous_topic_slug: "m6-t4-reformatting-mpr",
    next_topic_slug: "m6-t6-raycasting-volume"
  },

  "m6-t6-raycasting-volume": {
    id: "top-m6-t6",
    slug: "m6-t6-raycasting-volume",
    title: "6. Raycasting & Direct Volume Rendering",
    order_index: 6,
    co_tags: ["CO3", "CO4"],
    read_time_minutes: 24,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t6-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Direct Volume Rendering (DVR) & Optical Emission-Absorption Models",
        content_markdown: "Rather than extracting intermediate polygonal surfaces, **Direct Volume Rendering (DVR)** visualizes the entire continuous interior of a 3D medical dataset simultaneously. Through **volume raycasting**, virtual light rays are cast from the camera viewpoint through each display pixel into the 3D voxel volume.\n\nAt uniform sampling intervals along each ray, continuous scalar intensities and local gradients are evaluated via trilinear interpolation. A **Transfer Function** maps these physical values into emission color $(R, G, B)$ and opacity $\\alpha$, which are composited into a final rendered pixel color using the classical radiative transfer optical model.",
        formula_latex: "I(s) = I_0 \\, e^{-\\int_0^s \\tau(t) dt} + \\int_0^s q(t) \\, e^{-\\int_t^s \\tau(u) du} dt",
        linked_diagram_id: "diag-raycasting-pipeline"
      },
      {
        id: "sec-m6t6-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Numerical Compositing & Transfer Function Tuning",
        content_markdown: "| Compositing Direction | Recursive Color Formulation | Recursive Opacity Formulation | Early Ray Termination Threshold | Clinical Advantage |\n| :--- | :--- | :--- | :--- | :--- |\n| **Front-to-Back (Preferred)** | $C_{acc} = C_{acc} + (1 - \\alpha_{acc}) \\cdot \\alpha_i \\cdot C_i$ | $\\alpha_{acc} = \\alpha_{acc} + (1 - \\alpha_{acc}) \\cdot \\alpha_i$ | Terminate when $\\alpha_{acc} \\ge 0.99$ (99% opaque) | **Massive GPU speedup** (skips interior sampling once surface is opaque) |\n| **Back-to-Front** | $C_{out} = \\alpha_i C_i + (1 - \\alpha_i) C_{in}$ | Unneeded (accumulates implicitly) | None (must traverse full ray length from back to front) | Simple painter's algorithm; slower performance on modern GPUs |\n| **1D Transfer Function** | Maps scalar intensity $f(x)$ to $(R,G,B,\\alpha)$ | Single lookup table | Dependent on intensity overlap | Simple to calibrate; struggles when soft tissues share identical HU |\n| **2D Transfer Function** | Maps intensity $f(x)$ AND gradient magnitude $|\\nabla f(x)|$ | 2D color-opacity lookup space | High opacity assigned only to boundaries | Isolates organ boundaries; makes homogeneous organ interiors completely transparent |\n\n**Front-to-Back Discrete Compositing:** \\begin{aligned} C_k &= C_{k-1} + (1 - \\alpha_{k-1}) \\, \\alpha_k \\, C_k \\\\ \\alpha_k &= \\alpha_{k-1} + (1 - \\alpha_{k-1}) \\, \\alpha_k \\end{aligned}",
        formula_latex: "C_{acc} \\leftarrow C_{acc} + (1 - \\alpha_{acc}) \\alpha_i C_i, \\quad \\alpha_{acc} \\leftarrow \\alpha_{acc} + (1 - \\alpha_{acc}) \\alpha_i",
        linked_diagram_id: "diag-raycasting-pipeline"
      },
      {
        id: "sec-m6t6-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Front-to-Back Alpha Compositing Along Ray",
        content_markdown: "**Clinical Scenario:** A ray passing through a contrast-enhanced abdominal CT encounters three successive sample points: Step 1 (semi-transparent soft tissue, $C_1 = [0.2, 0.2, 0.2]$, $\\alpha_1 = 0.2$), Step 2 (dense iodinated aorta, $C_2 = [1.0, 0.0, 0.0]$, $\\alpha_2 = 0.7$), and Step 3 (cortical bone behind aorta, $C_3 = [1.0, 1.0, 1.0]$, $\\alpha_3 = 1.0$).\n\n**Calculations:**\n- **Sample 1:**\n  - $C_{acc} = 0 + (1 - 0) \\times 0.2 \\times [0.2, 0.2, 0.2] = [0.04, 0.04, 0.04]$\n  - $\\alpha_{acc} = 0 + (1 - 0) \\times 0.2 = \\mathbf{0.20}$\n- **Sample 2 (Aorta):**\n  - Remaining transparency = $1 - \\alpha_{acc} = 1 - 0.20 = 0.80$\n  - Color contribution = $0.80 \\times 0.7 \\times [1.0, 0.0, 0.0] = [0.56, 0.0, 0.0]$\n  - $C_{acc} = [0.04, 0.04, 0.04] + [0.56, 0.0, 0.0] = [0.60, 0.04, 0.04]$\n  - $\\alpha_{acc} = 0.20 + 0.80 \\times 0.7 = 0.20 + 0.56 = \\mathbf{0.76}$\n- **Sample 3 (Bone):**\n  - Remaining transparency = $1 - 0.76 = 0.24$\n  - Color contribution = $0.24 \\times 1.0 \\times [1.0, 1.0, 1.0] = [0.24, 0.24, 0.24]$\n  - $C_{acc} = [0.60, 0.04, 0.04] + [0.24, 0.24, 0.24] = \\mathbf{[0.84, 0.28, 0.28]}$\n  - $\\alpha_{acc} = 0.76 + 0.24 \\times 1.0 = \\mathbf{1.00}$ (Terminated fully opaque).",
        formula_latex: "C_{new} = C_{old} + (1 - \\alpha_{old}) \\alpha_i C_i",
        linked_diagram_id: "diag-raycasting-pipeline"
      },
      {
        id: "sec-m6t6-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: 2D Transfer Functions for Boundary Isolation",
        content_markdown: "**Question:** When rendering 3D CT angiography, why does a standard 1D transfer function (based solely on Hounsfield Units) fail to cleanly isolate the aortic wall from surrounding soft tissue, whereas a 2D transfer function succeeds?\n\n**Answer:** Muscle and the aortic vessel wall exhibit significant overlap in scalar Hounsfield Units ($+30\\text{ to }+60\\text{ HU}$). Assigning high opacity to this intensity range renders both structures as an opaque, obscuring mass. A **2D Transfer Function** plots intensity along the $x$-axis and **spatial gradient magnitude $|\\nabla f|$** along the $y$-axis. Homogeneous tissue interiors have $|\\nabla f| \\approx 0$, while tissue boundaries (such as the contrast-to-wall interface) exhibit sharp gradient spikes ($|\\nabla f| > 200$). By assigning opacity only to regions of high gradient magnitude, DVR renders tissue interiors transparent while crisply outlining anatomical boundaries.",
        formula_latex: "\\alpha(x) = g(f(x), \\, |\\nabla f(x)|)",
        linked_diagram_id: "diag-raycasting-pipeline"
      }
    ],
    diagrams: [
      {
        id: "diag-raycasting-pipeline",
        title: "Direct Volume Rendering Raycasting Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Camera[Virtual Camera Eye] --> CastRay[Cast Ray Through Pixel Screen]
    CastRay --> SampleLoop[Step Along Ray: Delta s Sampling Step]
    SampleLoop --> Trilinear[Trilinear Interpolation: Scalar HU + Gradient Vector]
    Trilinear --> TF[Transfer Function: Map to Color RGB and Opacity Alpha]
    TF --> Shading[Phong Surface Normal Shading]
    Shading --> Composite[Front-to-Back Alpha Compositing]
    Composite --> EarlyCheck{Accumulated Alpha >= 0.99 ?}
    EarlyCheck -->|Yes: Opaque| Terminate[Early Ray Termination: Skip Remaining Samples]
    EarlyCheck -->|No: More Depth| MoreSamples{Ray Exited Volume?}
    MoreSamples -->|No| SampleLoop
    MoreSamples -->|Yes| Terminate
    Terminate --> FinalPixel[Rendered Display Pixel Value]
    style Camera fill:#0077B6,color:#fff
    style TF fill:#662D91,color:#fff
    style Composite fill:#B82662,color:#fff
    style Terminate fill:#2E7D32,color:#fff`,
        interactive_node_map: {
          "TF": "Transfer function maps scalar CT numbers into visual colors and opacities.",
          "Terminate": "Early ray termination terminates sampling once opacity reaches 99%, boosting GPU FPS."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-6",
        question_text: "What computational mechanism allows front-to-back raycasting to achieve substantial performance acceleration compared to back-to-front rendering?",
        co_tag: "CO4",
        options: [
          { id: "A", text: "Early Ray Termination once accumulated opacity reaches >= 99%" },
          { id: "B", text: "Elimination of trilinear interpolation" },
          { id: "C", text: "Skipping the transfer function calculation" },
          { id: "D", text: "Conversion into polygonal triangle meshes" }
        ],
        correct_option_id: "A",
        explanation: "In front-to-back compositing, once accumulated opacity alpha >= 0.99, subsequent voxels along the ray contribute negligible visual information and can be skipped immediately (early ray termination)."
      }
    ],
    previous_topic_slug: "m6-t5-projection-models",
    next_topic_slug: "m6-t7-surface-rendering-marching-cubes"
  },

  "m6-t7-surface-rendering-marching-cubes": {
    id: "top-m6-t7",
    slug: "m6-t7-surface-rendering-marching-cubes",
    title: "7. Surface-Based Rendering & Marching Cubes Algorithm",
    order_index: 7,
    co_tags: ["CO3", "CO4"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-6", module_number: 6, title: "Spatial Transforms" },
    sections: [
      {
        id: "sec-m6t7-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Surface Extraction & The Marching Cubes Algorithm",
        content_markdown: "While Direct Volume Rendering renders transparent cloud-like volumes, surgical planning, 3D printing, and virtual reality implants require explicit polygonal boundary representations. The **Marching Cubes algorithm** (Lorensen & Cline, 1987) extracts an **isosurface** representing a constant threshold intensity value $T$ (e.g., $T = +250\\text{ HU}$ for cortical bone).\n\nThe algorithm passes a virtual $2 \\times 2 \\times 2$ voxel cube through the 3D volume. Each of the 8 cube vertices is evaluated as either inside or outside the surface, generating an 8-bit index ($2^8 = 256$ possible cases) reduced by rotational and reflective symmetries to 15 canonical configurations.",
        formula_latex: "S(T) = \\left\\{ (x,y,z) \\in \\mathbb{R}^3 \\;\\big|\\; f(x,y,z) = T \\right\\}",
        linked_diagram_id: "diag-marching-cubes"
      },
      {
        id: "sec-m6t7-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Edge Interpolation, Ambiguities & Phong Surface Shading",
        content_markdown: "| Marching Cubes Step | Mathematical Operation | Physical Significance | Key Quality Determinant |\n| :--- | :--- | :--- | :--- |\n| **1. Vertex Classification** | $v_i = (f(\\mathbf{x}_i) \\ge T) \\, ? \\, 1 : 0$ | Determines whether vertex lies inside tissue volume | Isosurface threshold $T$ selection (e.g. bone vs soft tissue) |\n| **2. Index Assembly** | $\\text{Index} = \\sum_{i=0}^7 v_i \\cdot 2^i$ | Maps cube to one of 256 topological configurations | Lookup table (15 canonical symmetry groups) |\n| **3. Edge Interpolation** | $\\mathbf{p}_{edge} = \\mathbf{p}_1 + \\frac{T - f_1}{f_2 - f_1} (\\mathbf{p}_2 - \\mathbf{p}_1)$ | Accurately positions triangle vertices along cube edges | Prevents stepped staircase artifacts; preserves sub-voxel accuracy |\n| **4. Topological Ambiguities** | Asymptotic decider or Lewiner modifications | Resolves ambiguous complementary diagonal cases | Prevents non-manifold holes in 3D-printed titanium implants |\n| **5. Surface Normal Estimation** | $\\mathbf{n} = -\\frac{\\nabla f}{|\\nabla f|}$ | Evaluates central differences of image intensities | Produces smooth organic specular reflections under Phong shading |\n\n**Edge Linear Interpolation Formula:** \\mathbf{p} = \\mathbf{p}_1 + \\left( \\frac{T - f(\\mathbf{p}_1)}{f(\\mathbf{p}_2) - f(\\mathbf{p}_1)} \\right) (\\mathbf{p}_2 - \\mathbf{p}_1)",
        formula_latex: "\\mathbf{p} = \\mathbf{p}_1 + \\left( \\frac{T - f_1}{f_2 - f_1} \\right) (\\mathbf{p}_2 - \\mathbf{p}_1), \\quad \\mathbf{n} = -\\frac{\\nabla f}{|\\nabla f|}",
        linked_diagram_id: "diag-marching-cubes"
      },
      {
        id: "sec-m6t7-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Sub-Voxel Edge Vertex Interpolation for Skull Bone",
        content_markdown: "**Clinical Scenario:** A cranioplasty implant requires extracting the skull bone isosurface at threshold $T = +300\\text{ HU}$. Along a cube edge parallel to the $X$-axis between coordinates $\\mathbf{p}_1 = (10, 20, 30)$ and $\\mathbf{p}_2 = (11, 20, 30)$, the CT attenuation values are $f_1 = +100\\text{ HU}$ (soft tissue) and $f_2 = +500\\text{ HU}$ (cortical bone).\n\n**Calculations:**\n- **Edge Fraction Ratio:**\n  $$t = \\frac{T - f_1}{f_2 - f_1} = \\frac{300 - 100}{500 - 100} = \\frac{200}{400} = 0.50$$\n- **Exact Sub-Voxel Coordinate:**\n  - $x = 10 + 0.50 \\times (11 - 10) = 10 + 0.50 = \\mathbf{10.50}$\n  - $y = 20 + 0 = \\mathbf{20.00}$\n  - $z = 30 + 0 = \\mathbf{30.00}$\n- **Significance:** The triangle vertex is placed precisely midway at $(10.5, 20.0, 30.0)$. Without interpolation, snapping to the nearest integer grid would induce a $\\pm 0.5\\text{ mm}$ staircase artifact, resulting in ill-fitting patient-specific prosthetic implants.",
        formula_latex: "x_{intersect} = x_1 + \\frac{T - f_1}{f_2 - f_1} (x_2 - x_1)",
        linked_diagram_id: "diag-marching-cubes"
      },
      {
        id: "sec-m6t7-4",
        section_number: 4,
        section_type: "clinical_app",
        title: "Application Q&A: STL Generation for Patient-Specific 3D Printing",
        content_markdown: "**Question:** When exporting Marching Cubes triangle meshes to STL format for stereolithographic 3D printing of titanium mandibular implants, why must mesh decimation (simplification) and Laplacian smoothing be performed?\n\n**Answer:** Raw Marching Cubes extractions from high-resolution CT ($512 \\times 512 \\times 500$) routinely generate over $10\\text{ to }30\\text{ million}$ micro-triangles, yielding STL files exceeding several gigabytes that crash surgical CAM slicing software. Furthermore, voxel discretization imparts microscopic high-frequency surface stepped noise. **Mesh decimation** (using quadric error metrics) reduces polygon count by $80-90\\%$ while preserving sharp geometric anatomical margins, and **Laplacian smoothing** eliminates staircasing without shrinking anatomical volume.",
        formula_latex: "\\mathbf{p}_i^{(new)} = \\mathbf{p}_i + \\lambda \\sum_{j \\in N(i)} w_{ij} (\\mathbf{p}_j - \\mathbf{p}_i)",
        linked_diagram_id: "diag-marching-cubes"
      }
    ],
    diagrams: [
      {
        id: "diag-marching-cubes",
        title: "Marching Cubes Isosurface Extraction Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Grid[Volumetric 3D CT Voxel Lattice] --> Cube[Iterate 2x2x2 Voxel Cubes: 8 Vertices]
    Cube --> Threshold{Vertex Values >= IsoThreshold T ?}
    Threshold --> Bitmask[Assemble 8-Bit Index: 0 to 255]
    Bitmask --> SymmetryLookup[Symmetry Lookup: Map to 15 Canonical Cases]
    SymmetryLookup --> EdgeInterp[Linear Edge Interpolation: Sub-Voxel Precision]
    EdgeInterp --> TriangleGen[Assemble Triangles & Compute Gradient Normals]
    TriangleGen --> STL[Export Watertight STL Surface: 3D Printing & Virtual Reality]
    style Grid fill:#0077B6,color:#fff
    style Bitmask fill:#662D91,color:#fff
    style EdgeInterp fill:#B82662,color:#fff
    style STL fill:#2E7D32,color:#fff`,
        interactive_node_map: {
          "Bitmask": "8-bit index specifies which edges are intersected by the isosurface.",
          "EdgeInterp": "Interpolates exact zero-crossing coordinates along cube edges for sub-voxel accuracy."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m6-7",
        question_text: "How many total geometric cube configurations exist in the Marching Cubes algorithm before applying rotational and reflective symmetry reductions?",
        co_tag: "CO4",
        options: [
          { id: "A", text: "256 (2^8)" },
          { id: "B", text: "15" },
          { id: "C", text: "64" },
          { id: "D", text: "128" }
        ],
        correct_option_id: "A",
        explanation: "Each of the 8 cube vertices has 2 binary states (inside or outside), yielding 2^8 = 256 total configurations, which reduce to 15 canonical topological groups."
      }
    ],
    previous_topic_slug: "m6-t6-raycasting-volume",
    next_topic_slug: null
  }
};
