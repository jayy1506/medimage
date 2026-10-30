import { TopicPayload } from "@/components/topic/DualPanelViewer";

export const MODULES_5_TO_6_DATA: Record<string, TopicPayload> = {
  // ==========================================
  // MODULE 5: Filtering, Transformations and Segmentation
  // ==========================================
  "m5-t1-filtering-operation": {
    id: "top-m5-t1",
    slug: "m5-t1-filtering-operation",
    title: "1. The Spatial Filtering Operation & Kernels",
    order_index: 1,
    co_tags: ["CO2"],
    read_time_minutes: 18,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t1-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Spatial Convolutions & Edge Detection Operators",
        content_markdown: "Spatial filtering processes images directly in the pixel domain by convolving local neighborhoods with small discrete matrices called kernels or masks. Operations are classified into smoothing (low-pass) filters that suppress noise and sharpening (high-pass) filters that emphasize tissue boundaries and microcalcifications.\n\nFirst-order derivative filters (Sobel, Prewitt, Roberts) detect intensity gradients along specific directional orientations, whereas second-order isotropic derivative operators (Laplacian) detect intensity transitions in all spatial directions simultaneously.",
        formula_latex: "g(x,y) = \\sum_{s=-a}^{a} \\sum_{t=-b}^{b} w(s,t) \\, f(x+s, \\, y+t)",
        linked_diagram_id: "diag-sobel-flow"
      },
      {
        id: "sec-m5t1-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Gradient Vector & Directional Derivative Formulations",
        content_markdown: "| Filter Operator | Kernel Matrices (Gx / Gy / ∇²) | Symmetry & Normalization | Clinical Strength |\n| :--- | :--- | :--- | :--- |\n| **Sobel Gradient** | G_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], G_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]] | Antisymmetric (Sum = 0) | Combines differencing with orthogonal smoothing (noise resistant) |\n| **Prewitt Operator** | G_x = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], G_y = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]] | Flat weighting (Sum = 0) | Slightly simpler computation, more sensitive to noise |\n| **Laplacian** | [[0, 1, 0], [1, -4, 1], [0, 1, 0]] or [[1, 1, 1], [1, -8, 1], [1, 1, 1]] | Isotropic 2nd derivative | Detects zero-crossings; highly sensitive to Poisson noise |\n| **Gaussian Filter** | G(x,y) = \\frac{1}{2\\pi\\sigma^2} e^{-(x^2+y^2)/(2\\sigma^2)} | Normalized (Sum = 1.0) | Zero ringing; optimal scale-space noise suppression |\n\n**Gradient Magnitude:** |\\nabla f| = \\sqrt{G_x^2 + G_y^2} \\approx |G_x| + |G_y|, \\quad \\theta = \\arctan\\left(\\frac{G_y}{G_x}\\right)",
        formula_latex: "|\\nabla f| = \\sqrt{G_x^2 + G_y^2}, \\quad \\theta = \\arctan\\left(\\frac{G_y}{G_x}\\right)",
        linked_diagram_id: "diag-sobel-flow"
      },
      {
        id: "sec-m5t1-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Sobel Edge Magnitude on Cortical Bone",
        content_markdown: "**Clinical Scenario:** A 3x3 pixel patch across a cortical bone fracture boundary has local values:\n`Row 1: [50, 50, 200]`, `Row 2: [52, 51, 202]`, `Row 3: [49, 50, 198]`.\n\n**Calculations:**\n- **Gx (Horizontal Gradient):** Gx = (-1×50 + 0×50 + 1×200) + (-2×52 + 0×51 + 2×202) + (-1×49 + 0×50 + 1×198) = 150 + 300 + 149 = **+599**.\n- **Gy (Vertical Gradient):** Gy = (-1×50 - 2×50 - 1×200) + (0) + (1×49 + 2×50 + 1×198) = -350 + 347 = **-3**.\n- **Gradient Magnitude:** |∇f| = √(599² + (-3)²) ≈ **599.0**.\n- **Edge Orientation:** θ = arctan(-3 / 599) ≈ **-0.29°** (indicates an almost perfectly vertical vertical fracture interface).",
        formula_latex: null,
        linked_diagram_id: "diag-sobel-flow"
      },
      {
        id: "sec-m5t1-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is a pure Laplacian kernel rarely applied directly to raw CT or MRI images without prior Gaussian smoothing?\n\n**Answer:** The Laplacian computes second-order derivatives (∇²f), which mathematically magnifies high-frequency components by f². In raw medical scans, quantum noise is predominantly high-frequency; direct Laplacian filtering severely elevates noise into a chaotic snowstorm of false edges. The Laplacian of Gaussian (LoG) or Marr-Hildreth filter smooths with a Gaussian first.",
        formula_latex: null,
        linked_diagram_id: "diag-sobel-flow"
      }
    ],
    diagrams: [
      {
        id: "diag-sobel-flow",
        title: "Sobel Directional Gradient & Edge Magnitude Pipeline",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Input[Raw Medical Scan Matrix] --> GxFilter[Gx Kernel: Horizontal Differencing]
    Input --> GyFilter[Gy Kernel: Vertical Differencing]
    GxFilter --> GxOutput[Horizontal Gradient Map: Gx]
    GyFilter --> GyOutput[Vertical Gradient Map: Gy]
    GxOutput --> MagCalc[Gradient Magnitude: Sqrt Gx^2 + Gy^2]
    GyOutput --> MagCalc
    MagCalc --> EdgeMap[Thinned Edge Boundary Map]
    style Input fill:#0077B6,color:#fff
    style GxFilter fill:#662D91,color:#fff
    style EdgeMap fill:#B82662,color:#fff`,
        interactive_node_map: {
          "GxFilter": "Detects vertical tissue interfaces (e.g. sagittal bone borders).",
          "EdgeMap": "High-magnitude contours highlighting fracture lines and organ borders."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-1",
        question_text: "Which standard 3x3 convolution operator calculates the horizontal spatial gradient while smoothing the orthogonal row to suppress noise?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Sobel Gx operator" },
          { id: "B", text: "Box Mean filter" },
          { id: "C", text: "Gaussian blur" },
          { id: "D", text: "Laplacian filter" }
        ],
        correct_option_id: "A",
        explanation: "The Sobel Gx operator [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] calculates horizontal differences with central row weighting."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m5-t2-fourier-transform"
  },

  "m5-t2-fourier-transform": {
    id: "top-m5-t2",
    slug: "m5-t2-fourier-transform",
    title: "2. The 2D Fourier Transform & Convolution Theorem",
    order_index: 2,
    co_tags: ["CO3"],
    read_time_minutes: 24,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Frequency Domain Representation & k-Space",
        content_markdown: "The 2D Discrete Fourier Transform (DFT) decomposes a spatial image into a linear combination of complex orthogonal sinusoids characterized by spatial frequency (u, v), amplitude, and phase. In Magnetic Resonance Imaging (MRI), raw data is acquired directly in the 2D spatial frequency domain (known as **k-space**), requiring an Inverse 2D FFT to reconstruct diagnostic clinical images.\n\nThe **Convolution Theorem** states that spatial convolution f(x,y) * h(x,y) is mathematically identical to pointwise frequency multiplication F(u,v) · H(u,v). For large filter kernels (e.g. > 15x15), computing the filter via FFT is orders of magnitude faster than spatial convolution.",
        formula_latex: "F(u,v) = \\sum_{x=0}^{M-1} \\sum_{y=0}^{N-1} f(x,y) \\, e^{-j 2\\pi \\left(\\frac{ux}{M} + \\frac{vy}{N}\\right)}",
        linked_diagram_id: "diag-fft-conv"
      },
      {
        id: "sec-m5t2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Frequency Filters & k-Space Anatomy",
        content_markdown: "| Region in k-Space | Spatial Frequency Band | Encoded Image Characteristics | Clinical Effect of Loss |\n| :--- | :--- | :--- | :--- |\n| **Center of k-Space** | Low frequencies (u, v ≈ 0) | Overall tissue contrast, broad organ luminance, SNR | Severe loss of soft-tissue contrast; hollow contours |\n| **Periphery of k-Space** | High frequencies (|u|, |v| >> 0) | Sharp anatomical edges, fine trabeculae, vessel lumen | Severe image blurring; loss of fine spatial resolution |\n| **Ideal Low-Pass Filter** | H(u,v) = 1 if D ≤ D₀, else 0 | Sharp cutoff in frequency domain | Causes severe Gibbs ringing in spatial domain |\n| **Butterworth LPF (Order n)** | H(u,v) = \\frac{1}{1 + [D(u,v)/D_0]^{2n}} | Smooth roll-off without abrupt step | Minimal ringing; standard for noise reduction |\n| **Gaussian LPF** | H(u,v) = e^{-D^2(u,v)/(2 D_0^2)} | Perfectly smooth exponential roll-off | Zero Gibbs ringing; optimal for medical smoothing |\n\n**Convolution Theorem Equivalence:**\n\\mathcal{F}\\{ f(x,y) * h(x,y) \\} = F(u,v) \\cdot H(u,v) \\iff f * h = \\mathcal{F}^{-1}\\{ F \\cdot H \\}",
        formula_latex: "\\mathcal{F}\\{ f(x,y) * h(x,y) \\} = F(u,v) \\cdot H(u,v)",
        linked_diagram_id: "diag-fft-conv"
      },
      {
        id: "sec-m5t2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Computational Complexity (FFT vs Spatial)",
        content_markdown: "**Clinical Scenario:** A 1024×1024 CT image is filtered with a 31×31 Gaussian kernel. Compare operations required for direct spatial convolution versus FFT-based frequency multiplication.\n\n**Calculations:**\n- **Direct Spatial Convolution:** (1024 × 1024) pixels × (31 × 31) operations ≈ 1,048,576 × 961 ≈ **1,007,681,536 operations (~1.01 Billion ops)**.\n- **FFT Method:** 2D FFT: ~2 × N² log₂(N) = 2 × 1024² × 10 ≈ 21 Million ops. Pointwise multiplication: 1 Million ops. Inverse 2D FFT: ~21 Million ops. Total ≈ **43 Million operations**.\n- **Speedup Ratio:** 1,007M / 43M ≈ **23.4x faster** using the 2D Fast Fourier Transform.",
        formula_latex: null,
        linked_diagram_id: "diag-fft-conv"
      },
      {
        id: "sec-m5t2-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why does an Ideal Low-Pass Filter (ILPF) produce prominent rippling halos (Gibbs Phenomenon) around high-contrast edges like skull bone in CT?\n\n**Answer:** In the frequency domain, an Ideal Low-Pass Filter is a rectangular step function with a hard discontinuity at D₀. By the Fourier duality theorem, the inverse Fourier transform of a rectangular step is a spatial Sinc function (sin(x)/x), whose oscillating sidelobes create concentric ringing ripples around sharp boundaries.",
        formula_latex: null,
        linked_diagram_id: "diag-fft-conv"
      }
    ],
    diagrams: [
      {
        id: "diag-fft-conv",
        title: "2D Fast Fourier Transform & Convolution Theorem",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    SpatialImg[Spatial Image f x,y] -->|Forward 2D FFT| KSpace[Frequency Spectrum F u,v]
    SpatialKernel[Spatial Kernel h x,y] -->|Forward 2D FFT| TransFunc[Transfer Function H u,v]
    KSpace --> Mult[Pointwise Multiplication: F x H]
    TransFunc --> Mult
    Mult -->|Inverse 2D FFT| FilteredImg[Filtered Spatial Image g x,y]
    style SpatialImg fill:#0077B6,color:#fff
    style KSpace fill:#662D91,color:#fff
    style FilteredImg fill:#B82662,color:#fff`,
        interactive_node_map: {
          "KSpace": "2D complex frequency matrix encoding contrast at center, edges at periphery.",
          "FilteredImg": "Output spatial image free of high-frequency quantum noise."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-2",
        question_text: "According to the Convolution Theorem, 2D spatial convolution of an image with a kernel is mathematically identical to what operation in the frequency domain?",
        co_tag: "CO3",
        options: [
          { id: "A", text: "Pointwise element-by-element multiplication of their Fourier transforms" },
          { id: "B", text: "Convolution of their Fourier transforms" },
          { id: "C", text: "Matrix inversion" },
          { id: "D", text: "Eigenvalue decomposition" }
        ],
        correct_option_id: "A",
        explanation: "Convolution in the spatial domain transforms into simple pointwise multiplication in the Fourier frequency domain."
      }
    ],
    previous_topic_slug: "m5-t1-filtering-operation",
    next_topic_slug: "m5-t3-segmentation-pipeline"
  },

  "m5-t3-segmentation-pipeline": {
    id: "top-m5-t3",
    slug: "m5-t3-segmentation-pipeline",
    title: "3. The Clinical Segmentation Pipeline",
    order_index: 3,
    co_tags: ["CO2"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t3-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: End-to-End Clinical Segmentation Workflow",
        content_markdown: "A robust clinical segmentation pipeline consists of five sequential stages: (1) **Data Preprocessing** (intensity standardization, resampling to isotropic voxels, and skull-stripping/denoising); (2) **Region Delineation** (deep learning inference or mathematical thresholding); (3) **Post-Processing** (morphological closing/opening, island removal, and convex hull refinement); (4) **Quality Assurance & Clinician Verification** (expert editing of Gross Target Volume GTV and Organs at Risk OAR); and (5) **Clinical Export** (saving as DICOM-RTSTRUCT or DICOM-SEG for linear accelerator treatment planning systems).",
        formula_latex: null,
        linked_diagram_id: "diag-seg-pipeline"
      },
      {
        id: "sec-m5t3-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Morphological Post-Processing Operators",
        content_markdown: "| Operation | Mathematical Definition | Structuring Element Effect | Clinical Utility |\n| :--- | :--- | :--- | :--- |\n| **Dilation** | A \\oplus B = \\bigcup_{b \\in B} A_b | Expands boundary, fills internal small holes | Bridges narrow breaks in fragmented blood vessels |\n| **Erosion** | A \\ominus B = \\{z \\mid (B)_z \\subseteq A\\} | Shrinks boundary, strips thin protrusions | Disconnects touching structures (e.g. ribs from vertebral body) |\n| **Opening** | A \\circ B = (A \\ominus B) \\oplus B | Erosion followed by dilation | Removes tiny isolated noise specks without altering large volume |\n| **Closing** | A \\bullet B = (A \\oplus B) \\ominus B | Dilation followed by erosion | Fills narrow concavities and small vascular lumens |\n\n**Connected Component Analysis (CCA):**\nLabels contiguous foreground clusters using 4-connectivity (2D) or 26-connectivity (3D) to retain only the single largest anatomical island (e.g. liver parenchyma) while purging spurious noise clusters.",
        formula_latex: "A \\bullet B = (A \\oplus B) \\ominus B, \\quad A \\circ B = (A \\ominus B) \\oplus B",
        linked_diagram_id: "diag-seg-pipeline"
      },
      {
        id: "sec-m5t3-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Organ Volume Quantification",
        content_markdown: "**Clinical Scenario:** A segmented spleen mask on an abdominal CT has a total of 184,200 positive voxels. The acquisition parameters from DICOM tags are Pixel Spacing = [0.85 mm, 0.85 mm] and Slice Thickness = 2.5 mm. Calculate total spleen volume in cubic centimeters (cm³ or mL).\n\n**Calculations:**\n- Voxel Volume = 0.85 mm × 0.85 mm × 2.5 mm = 1.80625 mm³.\n- Total Volume (mm³) = 184,200 voxels × 1.80625 mm³ = 332,711.25 mm³.\n- Volume in cm³ = 332,711.25 / 1000 = **332.7 cm³ (mL)**.\n- **Clinical Note:** Normal spleen volume is ~150–250 cm³; 332.7 cm³ confirms splenomegaly.",
        formula_latex: null,
        linked_diagram_id: "diag-seg-pipeline"
      },
      {
        id: "sec-m5t3-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why must post-processing morphological closing kernels be strictly bounded in size when segmenting the prostate gland near the rectum?\n\n**Answer:** If the structuring element radius is too large (e.g. > 5 mm), the morphological closing bridges the narrow perirectal fat space between the posterior prostate capsule and anterior rectal wall. In radiation therapy planning, this causes the rectal wall to be included in the high-dose planning target volume (PTV), leading to severe radiation proctitis.",
        formula_latex: null,
        linked_diagram_id: "diag-seg-pipeline"
      }
    ],
    diagrams: [
      {
        id: "diag-seg-pipeline",
        title: "Clinical Segmentation & Radiotherapy TPS Pipeline",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    DICOM[Raw DICOM CT Series] --> Preproc[Preprocessing: Resample to Isotropic 1mm]
    Preproc --> Inference[Deep Learning: nnU-Net Inference]
    Inference --> Morph[Morphological Post-Processing: Opening & Largest Component]
    Morph --> Expert[Radiation Oncologist Contour Review & Edit]
    Expert --> RTSTRUCT[DICOM-RTSTRUCT Export: Linac Treatment Planning]
    style DICOM fill:#0077B6,color:#fff
    style Inference fill:#662D91,color:#fff
    style RTSTRUCT fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Inference": "Self-configuring automated multi-organ volumetric segmentation.",
          "RTSTRUCT": "Radiotherapy structure set defining GTV, PTV, and Organ-at-Risk limits."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-3",
        question_text: "What morphological operation combines dilation followed by erosion to seal small internal cavities and smooth concave contours?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Morphological Closing" },
          { id: "B", text: "Morphological Opening" },
          { id: "C", text: "Top-Hat Transform" },
          { id: "D", text: "Skeletonization" }
        ],
        correct_option_id: "A",
        explanation: "Closing (dilation followed by erosion) fills narrow holes and joins slender breaks in structures."
      }
    ],
    previous_topic_slug: "m5-t2-fourier-transform",
    next_topic_slug: "m5-t4-roi-centroids"
  },

  "m5-t4-roi-centroids": {
    id: "top-m5-t4",
    slug: "m5-t4-roi-centroids",
    title: "4. ROI Definition, Moments & Centroids",
    order_index: 4,
    co_tags: ["CO2"],
    read_time_minutes: 15,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t4-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Regions of Interest (ROI) & Geometric Moments",
        content_markdown: "A Region of Interest (ROI) defines a spatial subset of an image representing a targeted anatomical structure or pathology. Once an ROI is delineated, geometric spatial moments M_pq quantify its area, center of mass (centroid), principal orientation angle, and shape eccentricity.\n\nIn stereotactic radiosurgery and surgical biopsy robotics, tracking the centroid (x̄, ȳ, z̄) of lung or liver tumours across 4D CT respiratory phases is fundamental to real-time respiratory motion tracking and tumor gating.",
        formula_latex: "M_{pq} = \\sum_{x} \\sum_{y} x^p y^q \\, f(x,y)",
        linked_diagram_id: "diag-moments-calc"
      },
      {
        id: "sec-m5t4-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Raw, Central & Invariant Moments",
        content_markdown: "| Moment Order | Symbol & Formula | Physical / Geometric Interpretation |\n| :--- | :--- | :--- |\n| **Zeroth Moment** | M_{00} = \\sum_{x} \\sum_{y} f(x,y) | Total mass or area (number of pixels in binary mask) |\n| **First Moments** | M_{10} = \\sum x f(x,y), \\; M_{01} = \\sum y f(x,y) | Weighted spatial sums along X and Y axes |\n| **Centroid Coordinates** | \\bar{x} = \\frac{M_{10}}{M_{00}}, \\quad \\bar{y} = \\frac{M_{01}}{M_{00}} | Center of gravity (spatial coordinates of centroid) |\n| **Central Moments** | \\mu_{pq} = \\sum (x - \\bar{x})^p (y - \\bar{y})^q f(x,y) | Translation-invariant dispersion measures |\n| **Orientation Angle (θ)** | \\theta = \\frac{1}{2} \\arctan\\left( \\frac{2 \\mu_{11}}{\\mu_{20} - \\mu_{02}} \\right) | Major principal axis orientation of the anatomical structure |\n\n**Normalized Invariant Moments (Hu's Invariants):**\nHu derived 7 moment invariants invariant to translation, scale changes, and in-plane 2D rotation, widely utilized in automated radiomics tumour classification.",
        formula_latex: "\\bar{x} = \\frac{M_{10}}{M_{00}}, \\quad \\bar{y} = \\frac{M_{01}}{M_{00}}, \\quad \\theta = \\frac{1}{2} \\arctan\\left( \\frac{2\\mu_{11}}{\\mu_{20} - \\mu_{02}} \\right)",
        linked_diagram_id: "diag-moments-calc"
      },
      {
        id: "sec-m5t4-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Centroid Calculation of Renal Lesion",
        content_markdown: "**Clinical Scenario:** A segmented kidney cyst has non-zero pixels at coordinates: (2, 2), (2, 3), (3, 2), (3, 3), (3, 4), and (4, 3).\n\n**Calculations:**\n- Total Pixels: M₀₀ = 6.\n- X Sum: M₁₀ = 2 + 2 + 3 + 3 + 3 + 4 = 17.\n- Y Sum: M₀₁ = 2 + 3 + 2 + 3 + 4 + 3 = 17.\n- **Centroid:** x̄ = 17 / 6 = **2.833**,  ȳ = 17 / 6 = **2.833**.\n- The biopsy needle trajectory targets coordinates (2.83, 2.83) to aspirate from the volumetric center of the lesion.",
        formula_latex: null,
        linked_diagram_id: "diag-moments-calc"
      },
      {
        id: "sec-m5t4-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why can the centroid (center of mass) of an Organ at Risk (OAR) fall completely outside the organ itself?\n\n**Answer:** Geometric centroids assume convex topologies. For hollow, crescent-shaped, or horseshoe organs (such as the urinary bladder, mandible, or horseshoe kidney), the calculated centroid often lies in the empty central lumen or adjacent tissue outside the organ boundaries.",
        formula_latex: null,
        linked_diagram_id: "diag-moments-calc"
      }
    ],
    diagrams: [
      {
        id: "diag-moments-calc",
        title: "ROI Moment Analysis & Centroid Determination",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Mask[Binary Segmentation Mask: ROI] --> M00[Zeroth Moment M00: Area]
    Mask --> M10[First Moment M10: X Mass]
    Mask --> M01[First Moment M01: Y Mass]
    M00 --> DivideX[Centroid X = M10 / M00]
    M10 --> DivideX
    M00 --> DivideY[Centroid Y = M01 / M00]
    M01 --> DivideY
    DivideX --> CentroidPoint[Target Centroid Coordinate: x, y]
    DivideY --> CentroidPoint
    style Mask fill:#0077B6,color:#fff
    style M00 fill:#662D91,color:#fff
    style CentroidPoint fill:#B82662,color:#fff`,
        interactive_node_map: {
          "M00": "Area of region used to normalize spatial coordinates.",
          "CentroidPoint": "Geometrical center of mass utilized in robotic biopsy targeting."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-4",
        question_text: "What mathematical formula calculates the horizontal coordinate x̄ of an anatomical region's centroid (center of mass)?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "x̄ = M₁₀ / M₀₀" },
          { id: "B", text: "x̄ = M₀₀ / M₁₀" },
          { id: "C", text: "x̄ = M₂₀ · M₀₂" },
          { id: "D", text: "x̄ = M₁₁ / M₀₀" }
        ],
        correct_option_id: "A",
        explanation: "The first-order moment M10 divided by the zeroth-order moment M00 yields the x-coordinate of the centroid."
      }
    ],
    previous_topic_slug: "m5-t3-segmentation-pipeline",
    next_topic_slug: "m5-t5-thresholding-otsu"
  },

  "m5-t5-thresholding-otsu": {
    id: "top-m5-t5",
    slug: "m5-t5-thresholding-otsu",
    title: "5. Global, Adaptive & Otsu's Thresholding",
    order_index: 5,
    co_tags: ["CO2"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t5-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Automated Binarization & Optimum Thresholding",
        content_markdown: "Thresholding is the simplest and fastest segmentation technique, converting grayscale images into binary masks by comparing each pixel intensity against a threshold T: g(x,y) = 1 if f(x,y) ≥ T, else 0. When illumination or background attenuation is uniform, a single **Global Threshold** suffices.\n\nNobuyuki Otsu (1979) introduced an optimal non-parametric, unsupervised thresholding algorithm that automatically discovers the ideal threshold k* by maximizing the between-class variance between foreground and background populations.",
        formula_latex: "g(x,y) = \\begin{cases} 1 & f(x,y) \\ge T \\\\ 0 & f(x,y) < T \\end{cases}",
        linked_diagram_id: "diag-otsu-variance"
      },
      {
        id: "sec-m5t5-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Mathematical Derivation of Otsu's Algorithm",
        content_markdown: "Let pixel intensities be normalized into probabilities p_i = n_i / N for i = 0, 1, ..., L-1. An arbitrary threshold k splits pixels into two classes: C₀ = [0..k] and C₁ = [k+1..L-1].\n\n- Class Probabilities: ω₀(k) = ∑_{i=0}^k p_i,  ω₁(k) = 1 - ω₀(k).\n- Class Mean Intensities: μ₀(k) = (1/ω₀) ∑_{i=0}^k i · p_i,  μ₁(k) = (1/ω₁) ∑_{i=k+1}^{L-1} i · p_i.\n- Global Mean: μ_T = ∑_{i=0}^{L-1} i · p_i = ω₀ μ₀ + ω₁ μ₁.\n- **Between-Class Variance:** σ_B²(k) = ω₀ (μ₀ - μ_T)² + ω₁ (μ₁ - μ_T)² = ω₀ ω₁ (μ₀ - μ₁)². \n\n**Optimal Threshold Criterion:**\nOtsu's threshold k* is the integer that maximizes σ_B²(k):",
        formula_latex: "k^* = \\arg\\max_{0 \\le k < L} \\sigma_B^2(k) = \\arg\\max_{0 \\le k < L} \\left[ \\omega_0(k) \\, \\omega_1(k) \\, (\\mu_0(k) - \\mu_1(k))^2 \\right]",
        linked_diagram_id: "diag-otsu-variance"
      },
      {
        id: "sec-m5t5-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Segmenting Trachea from Thoracic CT",
        content_markdown: "**Clinical Scenario:** In thoracic CT, the trachea lumen contains air (-1000 HU) surrounded by mediastinal soft tissue (+40 HU). The bimodal histogram has two peaks centered around -950 HU (air) and +30 HU (tissue).\n\n**Otsu Execution:**\n- Evaluating σ_B²(k) across the interval [-1000 HU to +100 HU] produces a clean parabolic maximum at **k* = -450 HU**.\n- Applying T = -450 HU isolates the tracheobronchial airway tree with near-zero false positives.",
        formula_latex: null,
        linked_diagram_id: "diag-otsu-variance"
      },
      {
        id: "sec-m5t5-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why does global Otsu thresholding fail completely when segmenting brain white matter on low-field MRI with severe RF coil bias field inhomogeneity?\n\n**Answer:** RF coil proximity causes gradual spatial intensity shading across the field of view (the bias field). Deep gray matter on one side of the brain may be brighter than white matter on the other side. A single global threshold cannot separate the tissues; localized adaptive thresholding or bias-field correction (N4ITK) is required.",
        formula_latex: null,
        linked_diagram_id: "diag-otsu-variance"
      }
    ],
    diagrams: [
      {
        id: "diag-otsu-variance",
        title: "Otsu Bimodal Histogram & Between-Class Variance Optimization",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Hist[Bimodal Histogram: Air Peak & Tissue Peak] --> Loop[Iterate Threshold k from 0 to L-1]
    Loop --> ClassProps[Compute Class Weights: w0, w1 and Means: u0, u1]
    ClassProps --> VarianceCalc[Compute Between-Class Variance: sigma_B^2 k]
    VarianceCalc --> MaxFinder[Find Global Peak Maximum: argmax sigma_B^2]
    MaxFinder --> OptimalT[Optimal Threshold k*]
    OptimalT --> BinaryOutput[High-Fidelity Segmented Binary Mask]
    style Hist fill:#0077B6,color:#fff
    style MaxFinder fill:#662D91,color:#fff
    style BinaryOutput fill:#B82662,color:#fff`,
        interactive_node_map: {
          "VarianceCalc": "Evaluates separation between background and foreground distributions.",
          "OptimalT": "Analytically discovered threshold minimizing within-class variance."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-5",
        question_text: "What mathematical statistical criterion does Otsu's thresholding algorithm optimize to discover the ideal global binarization threshold?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Maximizing between-class variance σ_B² (equivalent to minimizing within-class variance)" },
          { id: "B", text: "Minimizing overall image entropy" },
          { id: "C", text: "Matching the 50th percentile median" },
          { id: "D", text: "Selecting the highest pixel value" }
        ],
        correct_option_id: "A",
        explanation: "Otsu maximizes between-class variance, which cleanly separates bimodal histogram populations."
      }
    ],
    previous_topic_slug: "m5-t4-roi-centroids",
    next_topic_slug: "m5-t6-region-growing"
  },

  "m5-t6-region-growing": {
    id: "top-m5-t6",
    slug: "m5-t6-region-growing",
    title: "6. Region Growing & Boundary Leakage Control",
    order_index: 6,
    co_tags: ["CO2"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t6-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Seeded Region Growing Mechanics",
        content_markdown: "Region Growing is a connectivity-based segmentation technique that groups neighboring pixels into larger regions based on predefined similarity criteria. The algorithm starts with one or more user-placed or automatically detected **seed points**.\n\nAt each iteration, adjacent unvisited neighbors are inspected: if the neighbor satisfies a homogeneity test (e.g. intensity difference |I(x,y) - μ_region| ≤ T_tol), it is annexed into the region, and the region statistics are dynamically updated.",
        formula_latex: "|I(x,y) - \\mu_{\\text{region}}| \\le T_{\\text{tolerance}}",
        linked_diagram_id: "diag-region-grow"
      },
      {
        id: "sec-m5t6-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Boundary Leakage & Stopping Criteria",
        content_markdown: "| Component | Specification | Failure Mode | Mitigation Strategy |\n| :--- | :--- | :--- | :--- |\n| **Seed Selection** | Placed inside robust homogeneous core | Seed placed on boundary or necrotic core | Automated centroid initialization from peak local contrast |\n| **Homogeneity Rule** | Fixed threshold or dynamic standard deviation (e.g. μ ± 2.5σ) | Fixed threshold fails in presence of gradient shading | Adaptive local variance estimation |\n| **Connectivity** | 4-connected (2D) or 6/26-connected (3D) | 26-connectivity bridges across diagonal partial volume voxels | Use 6-connectivity for high-leakage vascular boundaries |\n| **Leakage Barrier** | Edge gradient magnitude gating | Boundary leakage into adjacent organs | Halt growing when gradient |∇I| exceeds edge threshold |\n\n**Exam Point:** Boundary leakage occurs when the growing frontier crosses a weak, partial-volume blurred anatomical boundary into neighboring tissue of similar attenuation (e.g. liver leaking into inferior vena cava).",
        formula_latex: "\\text{Annex Condition: } |I(x,y) - \\mu_R| \\le k \\cdot \\sigma_R \\quad \\text{AND} \\quad |\\nabla I(x,y)| < T_{\\text{edge}}",
        linked_diagram_id: "diag-region-grow"
      },
      {
        id: "sec-m5t6-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Segmenting Renal Cortex",
        content_markdown: "**Clinical Scenario:** A radiologist places a seed at (120, 140) inside the enhanced renal cortex (initial seed intensity = 145 HU). The homogeneity criterion is set to |I - 145| ≤ 20 HU (Acceptance range [125 to 165 HU]).\n\n**Growing Process:**\n- Iteration 1-500: The region expands smoothly across the cortex (mean = 142 HU, σ = 6.2 HU).\n- Iteration 501: Frontier reaches renal sinus fat (-80 HU). Because |-80 - 145| = 225 > 20 HU, expansion terminates abruptly at the corticomedullary boundary without leaking into the renal pelvis.",
        formula_latex: null,
        linked_diagram_id: "diag-region-grow"
      },
      {
        id: "sec-m5t6-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** How does confidence-connected region growing prevent runaway explosion in noisy ultrasound images?\n\n**Answer:** Confidence-connected algorithms recompute the sample mean μ and variance σ² of the segmented region at each step, annexing only voxels within [μ - c·σ, μ + c·σ]. In early iterations, c is tightly restricted (e.g. c=1.5), progressively expanding only after sufficient statistical sample size is established.",
        formula_latex: null,
        linked_diagram_id: "diag-region-grow"
      }
    ],
    diagrams: [
      {
        id: "diag-region-grow",
        title: "Seeded Region Growing & Gradient Boundary Barrier",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Seed[Initialize Seed Point Inside Organ] --> NeighborQueue[Push 6-Connected Neighbors to Queue]
    NeighborQueue --> TestNeighbor{Check Homogeneity: |I - u| <= T?}
    TestNeighbor -->|Pass AND Edge < Threshold| Annex[Annex Pixel to Region & Update Stats]
    TestNeighbor -->|Fail OR High Gradient| Reject[Reject Pixel & Mark Barrier Boundary]
    Annex --> EnqueueNeighbors[Add New Adjacent Unvisited Neighbors]
    EnqueueNeighbors --> NeighborQueue
    style Seed fill:#0077B6,color:#fff
    style TestNeighbor fill:#662D91,color:#fff
    style Annex fill:#B82662,color:#fff`,
        interactive_node_map: {
          "TestNeighbor": "Evaluates local tissue intensity similarity against growing region mean.",
          "Annex": "Incorporates voxel and recalculates running mean and standard deviation."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-6",
        question_text: "What common failure mode in Seeded Region Growing occurs when the segmentation frontier breaches a weak boundary and floods adjacent structures?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Boundary Leakage" },
          { id: "B", text: "Gibbs Ringing" },
          { id: "C", text: "Aliasing" },
          { id: "D", text: "Phase wrapping" }
        ],
        correct_option_id: "A",
        explanation: "Boundary leakage occurs when low-contrast bridges allow region growing to escape the target organ."
      }
    ],
    previous_topic_slug: "m5-t5-thresholding-otsu",
    next_topic_slug: "m5-t7-segmentation-evaluation"
  },

  "m5-t7-segmentation-evaluation": {
    id: "top-m5-t7",
    slug: "m5-t7-segmentation-evaluation",
    title: "7. Evaluation Metrics: Dice, IoU & Hausdorff",
    order_index: 7,
    co_tags: ["CO2", "CO4"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-5", module_number: 5, title: "Filtering, Transformations and Segmentation" },
    sections: [
      {
        id: "sec-m5t7-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Validation Metrics for Clinical Segmentation",
        content_markdown: "Validating automated or AI-assisted segmentation against ground truth radiologist annotations requires both overlap-based metrics (quantifying volumetric intersection) and spatial distance metrics (quantifying boundary fidelity in physical millimeters).\n\nPrimary overlap metrics include the **Dice Similarity Coefficient (DSC)** and **Jaccard Index (Intersection over Union, IoU)**. Primary boundary metrics include the **Hausdorff Distance (95th percentile HD95)** and **Average Symmetric Surface Distance (ASSD)**.",
        formula_latex: "\\text{Dice}(P, G) = \\frac{2 |P \\cap G|}{|P| + |G|} = \\frac{2 \\, \\text{TP}}{2 \\, \\text{TP} + \\text{FP} + \\text{FN}}",
        linked_diagram_id: "diag-eval-metrics"
      },
      {
        id: "sec-m5t7-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Mathematical Formulations of Validation Metrics",
        content_markdown: "| Metric | Mathematical Equation | Units | Clinical Significance |\n| :--- | :--- | :--- | :--- |\n| **Dice Similarity (DSC)** | \\frac{2 \\text{TP}}{2 \\text{TP} + \\text{FP} + \\text{FN}} | Dimensionless [0.0 to 1.0] | Standard benchmark; > 0.75 considered acceptable for soft organs |\n| **Jaccard Index (IoU)** | \\frac{\\text{TP}}{\\text{TP} + \\text{FP} + \\text{FN}} = \\frac{\\text{DSC}}{2 - \\text{DSC}} | Dimensionless [0.0 to 1.0] | Stricter overlap penalization than Dice |\n| **Hausdorff Distance (HD)** | \\max\\left( \\sup_{p \\in \\partial P} d(p, \\partial G), \\; \\sup_{g \\in \\partial G} d(g, \\partial P) \\right) | Millimeters (mm) | Worst-case boundary error; sensitive to isolated false-positive outliers |\n| **95th Percentile HD (HD95)** | \\text{Percentile}_{95} \\left( d(p, \\partial G) \\right) | Millimeters (mm) | Radiation oncology standard; ignores top 5% outlier noise |\n| **ASSD** | \\frac{1}{|\\partial P| + |\\partial G|} \\left( \\sum d(p, \\partial G) + \\sum d(g, \\partial P) \\right) | Millimeters (mm) | Average spatial discrepancy between organ surfaces |\n\n**Inter-Conversion Formula:**\n\\text{IoU} = \\frac{\\text{Dice}}{2 - \\text{Dice}}, \\quad \\text{Dice} = \\frac{2 \\, \\text{IoU}}{1 + \\text{IoU}}",
        formula_latex: "\\text{HD95}(P, G) = \\text{quantile}_{0.95} \\left( \\min_{g \\in \\partial G} \\|p - g\\|_2 \\right)",
        linked_diagram_id: "diag-eval-metrics"
      },
      {
        id: "sec-m5t7-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Complete Metric Suite Calculation",
        content_markdown: "**Clinical Scenario:** In prostate cancer planning, manual ground truth contour G contains 5,000 voxels. An AI model predicts mask P containing 4,800 voxels. The intersection P ∩ G = 4,400 voxels.\n\n**Step-by-Step Evaluations:**\n- True Positives (TP) = 4,400.\n- False Positives (FP) = 4,800 - 4,400 = 400.\n- False Negatives (FN) = 5,000 - 4,400 = 600.\n- **Dice Score:** DSC = (2 × 4400) / (4800 + 5000) = 8800 / 9800 = **0.898 (89.8%)**.\n- **Jaccard IoU:** IoU = 4400 / (4400 + 400 + 600) = 4400 / 5400 = **0.815 (81.5%)**.\n- **Conversion Check:** IoU = 0.898 / (2 - 0.898) = 0.898 / 1.102 = **0.815** (Exact match).",
        formula_latex: null,
        linked_diagram_id: "diag-eval-metrics"
      },
      {
        id: "sec-m5t7-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is a high Dice score (e.g. 0.94) insufficient on its own to approve an automated organ-at-risk segmentation in spinal radiation therapy?\n\n**Answer:** A volumetric overlap of 94% can coexist with a 4 mm thin contour spike protruding into the spinal cord. In stereotactic body radiation therapy (SBRT), this outlier can direct a lethal 20 Gy dose into nervous tissue. The 95th percentile Hausdorff Distance (HD95 ≤ 2 mm) must be verified alongside Dice.",
        formula_latex: null,
        linked_diagram_id: "diag-eval-metrics"
      }
    ],
    diagrams: [
      {
        id: "diag-eval-metrics",
        title: "Segmentation Overlap & Surface Distance Validation",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Comparison[AI Prediction P vs Ground Truth G] --> Overlap[Overlap Metrics: Volumetric Overlap]
    Comparison --> Boundary[Surface Metrics: Boundary Distances in mm]
    Overlap --> Dice[Dice Similarity Coefficient DSC: 2TP / 2TP + FP + FN]
    Overlap --> Jaccard[Jaccard Index IoU: TP / TP + FP + FN]
    Boundary --> HD95[Hausdorff 95th Percentile HD95 mm]
    Boundary --> ASSD[Average Symmetric Surface Distance ASSD mm]
    style Comparison fill:#0077B6,color:#fff
    style Overlap fill:#662D91,color:#fff
    style Boundary fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Dice": "Primary benchmark quantifying volumetric true positive overlap.",
          "HD95": "Controls for localized outlier spikes critical in radiation oncology."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m5-7",
        question_text: "Given a Dice Similarity Coefficient (DSC) of 0.80, what is the exact corresponding Jaccard Index (IoU)?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "IoU = 0.667 (66.7%)" },
          { id: "B", text: "IoU = 0.800" },
          { id: "C", text: "IoU = 0.400" },
          { id: "D", text: "IoU = 0.900" }
        ],
        correct_option_id: "A",
        explanation: "IoU = DSC / (2 - DSC) = 0.80 / (2 - 0.80) = 0.80 / 1.20 = 0.667."
      }
    ],
    previous_topic_slug: "m5-t6-region-growing",
    next_topic_slug: null
  }
};
