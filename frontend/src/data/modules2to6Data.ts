import { TopicPayload } from "@/components/topic/DualPanelViewer";

export const MODULES_2_TO_6_DATA: Record<string, TopicPayload> = {
  // ==========================================
  // MODULE 2: Image Processing in Clinical Practice
  // ==========================================
  "m2-t1-image-databases": {
    id: "top-m2-t1",
    slug: "m2-t1-image-databases",
    title: "1. Image Databases & Clinical PACS Archiving",
    order_index: 1,
    co_tags: ["CO2"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-2", module_number: 2, title: "Image Processing in Clinical Practice" },
    sections: [
      {
        id: "sec-m2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Clinical PACS Architecture & Storage Hierarchy",
        content_markdown: "A Picture Archiving and Communication System (PACS) is the clinical computing infrastructure that captures, stores, distributes, and displays diagnostic medical images. PACS integrates modalities (CT, MRI, US, X-ray) with hospital information systems (HIS) and radiology information systems (RIS) via DICOM and HL7 standards.\n\nModern PACS uses a tiered storage hierarchy: short-term solid-state cache for active inpatient studies (< 30 days) delivering sub-second retrieval, mid-term nearline storage (RAID arrays for 1–3 years), and secure long-term deep archive (redundant cloud or tape libraries retained for legal requirements, often 7+ years or pediatric age of majority + 7 years).",
        formula_latex: null,
        linked_diagram_id: "diag-pacs-flow"
      },
      {
        id: "sec-m2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: DICOM Network Messaging Operations",
        content_markdown: "| DICOM Command | Role | Direction | Clinical Function |\n| :--- | :--- | :--- | :--- |\n| **C-ECHO** | Verification | SCU ➔ SCP | Tests network connectivity ('DICOM ping') |\n| **C-STORE** | Transmission | Modality ➔ PACS | Pushes newly acquired study instances into archive |\n| **C-FIND** | Query | Workstation ➔ PACS | Queries patient demographics, study dates, accession numbers |\n| **C-MOVE** | Retrieval | Workstation ➔ PACS | Commands PACS to transfer matched images to destination AE |\n| **WADO-RS** | Web Access | Browser ➔ PACS | RESTful HTTP retrieval of DICOM objects as rendered JPEG/PNG |\n\n**Exam Point:** DICOM network communication relies on negotiated Application Entity Titles (AET), IP addresses, and TCP ports (standard 104 or 11112). Both client (SCU) and server (SCP) must mutually whitelist AE titles.",
        formula_latex: "\\text{Storage Requirement} = \\sum_{i=1}^{M} \\left( \\text{Rows} \\times \\text{Cols} \\times \\frac{\\text{Bits Allocated}}{8} \\times N_{\\text{slices}} \\right)",
        linked_diagram_id: "diag-pacs-flow"
      },
      {
        id: "sec-m2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Bandwidth & Storage Sizing",
        content_markdown: "**Clinical Scenario:** A 128-slice CT scanner acquires an abdominal trauma study with 1,200 axial slices (512 × 512 matrix, 16 bits allocated per pixel). Calculate the uncompressed study file size and transfer time over a 1 Gbps (1,000 Mbps) hospital network.\n\n**Calculation:**\n- Bytes per slice = 512 × 512 × 2 bytes = 524,288 bytes = 0.524 MB.\n- Total study size = 1,200 slices × 0.524 MB = 629.14 MB (~0.63 GB).\n- Network throughput at 1 Gbps effective (80% utilization = 800 Mbps = 100 MB/s):\n- Transfer Time = 629.14 MB / 100 MB/s ≈ **6.29 seconds**.",
        formula_latex: null,
        linked_diagram_id: "diag-pacs-flow"
      },
      {
        id: "sec-m2-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why must clinical PACS archives maintain absolute data immutability with strict audit logging under medical device regulations and DPDP Act 2023?\n\n**Answer:** Diagnostic images represent legal medical records. Unauthorized alteration, overwriting, or silent data corruption can lead to fatal misdiagnoses or clinical malpractice. Read-only WORM (Write Once, Read Many) storage with cryptographic SHA-256 hashing ensures evidentiary integrity and non-repudiation.",
        formula_latex: null,
        linked_diagram_id: "diag-pacs-flow"
      }
    ],
    diagrams: [
      {
        id: "diag-pacs-flow",
        title: "Enterprise PACS & Clinical Workflow Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Scanner[Modality: CT / MRI] -->|C-STORE| PACS[PACS Central Archive]
    RIS[Radiology Info System] -->|Modality Worklist| Scanner
    PACS -->|C-FIND / C-MOVE| Workstation[Radiologist Diagnostic Workstation]
    PACS -->|WADO-RS HTTP| WebViewer[Zero-Footprint Web Viewer]
    PACS -->|Auto-Archive| DeepStorage[Cloud / LTO Deep Cold Storage]
    style Scanner fill:#0077B6,stroke:#0B2545,color:#fff
    style PACS fill:#662D91,stroke:#0B2545,color:#fff
    style Workstation fill:#B82662,stroke:#0B2545,color:#fff`,
        interactive_node_map: {
          "PACS": "Enterprise server managing DICOM database and short-term SSD cache.",
          "Workstation": "High-luminance calibrated diagnostic monitors running multiplanar reformatting."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m2-1",
        question_text: "Which DICOM network command transmits newly acquired images from a CT scanner to the central PACS server?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "C-STORE" },
          { id: "B", text: "C-FIND" },
          { id: "C", text: "C-ECHO" },
          { id: "D", text: "N-ACTION" }
        ],
        correct_option_id: "A",
        explanation: "C-STORE is the primary DICOM Service Class User (SCU) command for instance transmission."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m2-t2-intensity-operations"
  },

  "m2-t2-intensity-operations": {
    id: "top-m2-t2",
    slug: "m2-t2-intensity-operations",
    title: "2. Point & Intensity Operations (LUTs & Gamma)",
    order_index: 2,
    co_tags: ["CO2"],
    read_time_minutes: 14,
    is_completed: false,
    module: { id: "mod-2", module_number: 2, title: "Image Processing in Clinical Practice" },
    sections: [
      {
        id: "sec-m2t2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Point-Wise Mapping & Diagnostic Transfer Curves",
        content_markdown: "Point operations process each image pixel individually based solely on its input intensity r, producing an output intensity s = T(r), regardless of neighboring pixels. In diagnostic clinical workstations, Look-Up Tables (LUTs) precompute this mapping for fast 60 FPS real-time execution.\n\nPrimary transfer functions include linear contrast stretching, negative inversion (converting bone from white to dark for mammography review), logarithmic transforms (expanding dark details in ultrasound), and power-law (Gamma) transformations s = c · r^γ.",
        formula_latex: "s = c \\cdot r^\\gamma",
        linked_diagram_id: "diag-gamma-curve"
      },
      {
        id: "sec-m2t2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Mathematical Models of Intensity Transformations",
        content_markdown: "| Operation | Equation | Clinical Objective | Diagnostic Application |\n| :--- | :--- | :--- | :--- |\n| **Linear Contrast Stretch** | s = \\frac{r - r_{\\min}}{r_{\\max} - r_{\\min}} \\times (L - 1) | Expands narrow dynamic range across full 8-bit scale | Low-contrast portable bedside X-rays |\n| **Gamma Correction (γ < 1)** | s = c \\cdot r^\\gamma, \\; \\gamma = 0.45 | Expands dark shadow details; compresses highlights | Visualizing occult pulmonary nodules in mediastinal shadow |\n| **Gamma Correction (γ > 1)** | s = c \\cdot r^\\gamma, \\; \\gamma = 2.2 | Compresses dark noise; enhances bright structures | Bone cortical boundary accentuation |\n| **Photometric Inversion** | s = (L - 1) - r | Inverts white and black | Identifying microcalcifications in digital mammography |\n\n**Exam Point:** In DICOM, Modality LUT maps raw values to physical units (Hounsfield Units), while VOI LUT maps physical units to displayable pixel values.",
        formula_latex: "s = \\begin{cases} 0 & r \\le \\text{WL} - \\frac{\\text{WW}}{2} \\\\ \\left( r - (\\text{WL} - \\frac{\\text{WW}}{2}) \\right) \\times \\frac{255}{\\text{WW}} & \\text{WL} - \\frac{\\text{WW}}{2} < r \\le \\text{WL} + \\frac{\\text{WW}}{2} \\\\ 255 & r > \\text{WL} + \\frac{\\text{WW}}{2} \\end{cases}",
        linked_diagram_id: "diag-gamma-curve"
      },
      {
        id: "sec-m2t2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Dynamic Range Expansion",
        content_markdown: "**Clinical Case:** A digital radiograph has pixel intensities clustered between r_min = 40 and r_max = 140 in an 8-bit image (L = 256, max output 255). What is the mapped output value of a lung nodule with input r = 90 after linear contrast stretching?\n\n**Solution:**\n- Formula: s = ((90 - 40) / (140 - 40)) × 255 = (50 / 100) × 255 = 0.50 × 255 = **127.5 ≈ 128**.\n- The mid-range lung nodule is mapped to clear medium gray (128), while the darkest feature (40) maps to 0 (black) and brightest (140) maps to 255 (white), maximizing visual contrast.",
        formula_latex: null,
        linked_diagram_id: "diag-gamma-curve"
      },
      {
        id: "sec-m2t2-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is a simple linear stretch inadequate when processing CT scans containing both lung parenchyma and dense ribs?\n\n**Answer:** CT attenuation spans over 3,000 HU (lungs ~ -600 HU, soft tissue ~ +40 HU, bone ~ +1000 HU). A global linear stretch across the entire range compresses soft tissue contrast into fewer than 10 gray levels, rendering liver tumours or muscle hematomas completely invisible. Local piecewise windowing (VOI LUT) is clinically required.",
        formula_latex: null,
        linked_diagram_id: "diag-gamma-curve"
      }
    ],
    diagrams: [
      {
        id: "diag-gamma-curve",
        title: "Non-Linear Gamma & Intensity Transformation Curves",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Input[Input Pixel: r in 0..1] --> Gamma[Gamma Transfer: s = r^gamma]
    Gamma --> OutGammaLow[gamma < 1: Lift Shadow Details]
    Gamma --> OutLinear[gamma = 1: Unchanged Identity]
    Gamma --> OutGammaHigh[gamma > 1: Suppress Noise / Accentuate Highlights]
    style Input fill:#0077B6,color:#fff
    style OutGammaLow fill:#662D91,color:#fff
    style OutGammaHigh fill:#B82662,color:#fff`,
        interactive_node_map: {
          "OutGammaLow": "Expands dark details, revealing occult mediastinal pathology.",
          "OutGammaHigh": "Compresses low-level background scatter noise."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m2-2",
        question_text: "What transformation curve with γ < 1 is clinically used to boost visibility of dark shadow details in underexposed radiographs?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Power-law (Gamma) expansion" },
          { id: "B", text: "High-pass Laplacian filtering" },
          { id: "C", text: "Bilinear downsampling" },
          { id: "D", text: "Otsu thresholding" }
        ],
        correct_option_id: "A",
        explanation: "Gamma < 1 curves bow upward, mapping dark input levels to higher, more discriminable display values."
      }
    ],
    previous_topic_slug: "m2-t1-image-databases",
    next_topic_slug: "m2-t3-filter-operations"
  },

  "m2-t3-filter-operations": {
    id: "top-m2-t3",
    slug: "m2-t3-filter-operations",
    title: "3. Spatial Filter Operations & Convolution Kernels",
    order_index: 3,
    co_tags: ["CO2"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-2", module_number: 2, title: "Image Processing in Clinical Practice" },
    sections: [
      {
        id: "sec-m2t3-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: 2D Spatial Filtering & Discrete Convolution",
        content_markdown: "Spatial filtering performs localized processing where each output pixel g(x,y) is calculated from a weighted combination of pixels in a neighborhood around (x,y), governed by a kernel (filter mask) w. Linear filters compute weighted sums (discrete convolution), while non-linear filters rank or order neighborhood pixels (e.g. median filtering).\n\nIn medical imaging, smoothing filters attenuate Poisson quantum noise and high-frequency detector mottle at the cost of slight blurring, whereas sharpening filters accentuate anatomical boundaries (such as trabecular bone structure or fine fissure lines).",
        formula_latex: "g(x,y) = \\sum_{s=-a}^{a} \\sum_{t=-b}^{b} w(s,t) \\, f(x+s, \\, y+t)",
        linked_diagram_id: "diag-conv-grid"
      },
      {
        id: "sec-m2t3-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Common Medical Convolution Kernels",
        content_markdown: "| Kernel Type | Matrix Representation | Normalization | Clinical Effect |\n| :--- | :--- | :--- | :--- |\n| **Box Mean 3x3** | [[1, 1, 1], [1, 1, 1], [1, 1, 1]] | 1/9 | Uniform noise suppression; blurs sharp edges |\n| **Gaussian 3x3 (σ=0.85)** | [[1, 2, 1], [2, 4, 2], [1, 2, 1]] | 1/16 | Isotropic weighted smoothing; minimal edge distortion |\n| **Laplacian (Isotropic 2nd Deriv)** | [[0, 1, 0], [1, -4, 1], [0, 1, 0]] | None (Sum = 0) | Detects omnidirectional edges and fine calcifications |\n| **Sobel Horizontal (Gx)** | [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] | None | Highlights vertical anatomical boundaries |\n| **Sobel Vertical (Gy)** | [[-1, -2, -1], [0, 0, 0], [1, 2, 1]] | None | Highlights horizontal anatomical boundaries |\n\n**Exam Point:** High-pass kernels always sum to zero (or close to zero) so that uniform flat tissue regions produce zero response.",
        formula_latex: "\\nabla f = \\begin{bmatrix} G_x \\\\ G_y \\end{bmatrix}, \\quad |\\nabla f| = \\sqrt{G_x^2 + G_y^2}, \\quad \\theta = \\arctan\\left(\\frac{G_y}{G_x}\\right)",
        linked_diagram_id: "diag-conv-grid"
      },
      {
        id: "sec-m2t3-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Median vs Mean on Salt-and-Pepper Noise",
        content_markdown: "**Clinical Scenario:** A 3x3 pixel neighborhood around an isolated bad detector pixel has intensities: [42, 44, 45, 43, **255**, 46, 44, 43, 45]. Compare the output of a 3x3 Mean filter versus a 3x3 Median filter.\n\n**Calculations:**\n- **Mean Filter:** Sum = 42+44+45+43+255+46+44+43+45 = 607. Output = 607 / 9 = **67.4** (the corrupted spike spreads and corrupts the tissue region).\n- **Median Filter:** Sorted = [42, 43, 43, 44, **44**, 45, 45, 46, 255]. 5th element = **44**.\n- **Conclusion:** The median filter completely eliminates the corrupted detector pixel (replacing 255 with 44) without introducing blurring artifacts.",
        formula_latex: null,
        linked_diagram_id: "diag-conv-grid"
      },
      {
        id: "sec-m2t3-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why must radiologists exercise extreme caution when interpreting radiographs processed with automated edge-enhancement sharpening kernels?\n\n**Answer:** Unsharp masking and high-pass kernels create undershoot/overshoot boundary halos. Around metallic orthopaedic implants or endotracheal tubes, this edge overshoot artifact can mimic periprosthetic radiolucent loosening or pneumothorax where none exists.",
        formula_latex: null,
        linked_diagram_id: "diag-conv-grid"
      }
    ],
    diagrams: [
      {
        id: "diag-conv-grid",
        title: "2D Convolution Kernel Operation on Pixel Grid",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Raw[3x3 Image Neighborhood] --> Multiply[Pointwise Multiplication by Kernel Weights]
    Kernel[Kernel Weights w s,t] --> Multiply
    Multiply --> Sum[Sum All 9 Products]
    Sum --> OutputPixel[Central Output Pixel g x,y]
    style Raw fill:#0077B6,color:#fff
    style Kernel fill:#662D91,color:#fff
    style OutputPixel fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Multiply": "Inner product of kernel coefficients with local tissue intensities.",
          "OutputPixel": "Replaces central pixel value in destination buffer."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m2-3",
        question_text: "Which non-linear filter replaces the center pixel with the median value of its neighborhood to eliminate impulse noise without edge blur?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Median Filter" },
          { id: "B", text: "Gaussian Blur" },
          { id: "C", text: "Laplacian Filter" },
          { id: "D", text: "Sobel Filter" }
        ],
        correct_option_id: "A",
        explanation: "The median filter sorts local values and picks the middle rank, ignoring extreme isolated outlier spikes."
      }
    ],
    previous_topic_slug: "m2-t2-intensity-operations",
    next_topic_slug: "m2-t4-clinical-segmentation"
  },

  "m2-t4-clinical-segmentation": {
    id: "top-m2-t4",
    slug: "m2-t4-clinical-segmentation",
    title: "4. Clinical Segmentation Strategies & U-Net",
    order_index: 4,
    co_tags: ["CO2"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-2", module_number: 2, title: "Image Processing in Clinical Practice" },
    sections: [
      {
        id: "sec-m2t4-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Clinical Image Segmentation Paradigms",
        content_markdown: "Segmentation partitions medical images into anatomically or pathologically meaningful regions (e.g. brain ventricles, liver parenchyma, pulmonary nodules, or gross tumour volume GTV). Clinical paradigms span traditional methods (thresholding, region growing, active contours) and state-of-the-art deep learning architectures (U-Net and its 3D variants).\n\nIn radiation therapy treatment planning and robotic surgical navigation, automated segmentation must meet stringent precision criteria, as an error of a few millimeters could under-dose a malignancy or irradiate critical organs-at-risk (OAR).",
        formula_latex: null,
        linked_diagram_id: "diag-unet-arch"
      },
      {
        id: "sec-m2t4-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: The U-Net Convolutional Architecture",
        content_markdown: "Introduced by Ronneberger et al. (2015), the U-Net architecture features a symmetric contracting path (encoder) and expansive path (decoder):\n- **Encoder Path:** Consecutive pairs of 3x3 convolutions followed by ReLU and 2x2 max-pooling (downsampling), capturing high-level contextual semantics while reducing spatial resolution.\n- **Decoder Path:** 2x2 up-convolutions (transposed convolution) progressively restoring spatial resolution.\n- **Skip Connections:** Concatenate fine-grained feature maps from the encoder directly to the decoder at each resolution level, preserving crisp boundary localization lost during downsampling.\n\n**Loss Function Formulation:**\nClinical segmentation relies heavily on Soft Dice Loss to counteract extreme class imbalance (e.g., small pancreatic tumour occupying < 1% of total voxels):",
        formula_latex: "\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2 \\sum_{i=1}^{N} p_i g_i + \\epsilon}{\\sum_{i=1}^{N} p_i^2 + \\sum_{i=1}^{N} g_i^2 + \\epsilon}",
        linked_diagram_id: "diag-unet-arch"
      },
      {
        id: "sec-m2t4-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Dice & Jaccard Calculation",
        content_markdown: "**Clinical Case:** An automated U-Net model segments a brain glioblastoma on MRI. The ground truth tumour contains 1,000 voxels (|G| = 1000). The model predicts 1,100 voxels (|P| = 1100). The overlap intersection |P ∩ G| = 900 voxels.\n\n**Evaluation:**\n- **Dice Score:** DSC = (2 × 900) / (1000 + 1100) = 1800 / 2100 = **0.857 (85.7%)**.\n- **Jaccard Index (IoU):** IoU = 900 / (1000 + 1100 - 900) = 900 / 1200 = **0.750 (75.0%)**.\n- **Clinical Rating:** A Dice score of 0.857 exceeds the 0.75 institutional clearance threshold for automated contouring.",
        formula_latex: null,
        linked_diagram_id: "diag-unet-arch"
      },
      {
        id: "sec-m2t4-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why do cross-entropy loss functions fail when training deep learning models on rare, tiny anatomical structures like intracranial microaneurysms?\n\n**Answer:** In a 512×512×200 volume, background voxels represent >99.9% of the volume. A naive model that predicts 'background' for every single voxel achieves >99.9% cross-entropy accuracy while detecting zero aneurysms. Dice loss or Focal loss explicitly weights the intersection and foreground overlap.",
        formula_latex: null,
        linked_diagram_id: "diag-unet-arch"
      }
    ],
    diagrams: [
      {
        id: "diag-unet-arch",
        title: "U-Net Deep Learning Architecture & Skip Connections",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Input[Input Scan: 512x512] --> Enc1[Encoder Stage 1: 64 Feat]
    Enc1 -->|Max Pool 2x2| Enc2[Encoder Stage 2: 128 Feat]
    Enc2 -->|Max Pool 2x2| Bottleneck[Bottleneck: 512 Feat]
    Bottleneck -->|Up-Conv| Dec2[Decoder Stage 2: 128 Feat]
    Dec2 -->|Up-Conv| Dec1[Decoder Stage 1: 64 Feat]
    Enc1 -.->|Skip Connection: Precise Edges| Dec1
    Enc2 -.->|Skip Connection: Intermediate Detail| Dec2
    Dec1 --> OutputMask[Binary Segmentation Mask]
    style Input fill:#0077B6,color:#fff
    style Bottleneck fill:#662D91,color:#fff
    style OutputMask fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Enc1": "Captures fine texture, edges, and high-frequency boundaries.",
          "Bottleneck": "Abstracts highest semantic context at lowest spatial scale.",
          "OutputMask": "Final binary probability mask of segmented tissue."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m2-4",
        question_text: "What architectural feature of U-Net allows it to preserve precise spatial localization for organ boundaries?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Skip connections between encoder and decoder levels" },
          { id: "B", text: "Recurrent LSTM cells" },
          { id: "C", text: "Complete elimination of convolutions" },
          { id: "D", text: "Fully connected linear layers" }
        ],
        correct_option_id: "A",
        explanation: "Skip connections bridge high-resolution feature maps from contracting stages directly to expansive stages."
      }
    ],
    previous_topic_slug: "m2-t3-filter-operations",
    next_topic_slug: "m2-t5-spatial-transforms"
  },

  "m2-t5-spatial-transforms": {
    id: "top-m2-t5",
    slug: "m2-t5-spatial-transforms",
    title: "5. Spatial Transforms & Clinical Registration",
    order_index: 5,
    co_tags: ["CO2", "CO3"],
    read_time_minutes: 18,
    is_completed: false,
    module: { id: "mod-2", module_number: 2, title: "Image Processing in Clinical Practice" },
    sections: [
      {
        id: "sec-m2t5-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Medical Image Registration & Multi-Modal Alignment",
        content_markdown: "Image registration is the process of geometrically aligning two or more medical images taken at different times (longitudinal), from different viewpoints, or using different modalities (e.g. aligning metabolic PET with anatomical CT). The goal is to determine an optimal spatial transformation T: (x,y,z) ➔ (x',y',z') that maps coordinates from a moving image into a fixed target reference frame.\n\nRegistration models range from rigid (6 degrees of freedom, preserving distance and angles) to Affine (12 DoF, allowing scaling and shear) and deformable (non-rigid B-spline or Demon deformation fields capturing soft tissue motion).",
        formula_latex: "\\mathbf{x}' = \\mathbf{R} \\, \\mathbf{x} + \\mathbf{t}",
        linked_diagram_id: "diag-reg-loop"
      },
      {
        id: "sec-m2t5-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Multi-Modal Similarity Metrics (Mutual Information)",
        content_markdown: "| Similarity Metric | Formula | Best For | Limitation |\n| :--- | :--- | :--- | :--- |\n| **Sum of Squared Differences (SSD)** | \\sum (I_F - I_M)^2 | Mono-modal images (CT-to-CT) | Fails completely across different modalities |\n| **Cross-Correlation (CC)** | \\frac{\\sum (I_F - \\bar{I}_F)(I_M - \\bar{I}_M)}{\\sigma_F \\sigma_M} | Images with linear intensity relationship | Fails when contrast is inverted |\n| **Mutual Information (MI)** | H(F) + H(M) - H(F,M) | Multi-modal registration (PET-CT, MRI-CT) | Sensitive to severe sub-sampling or low entropy |\n| **Normalized MI (NMI)** | \\frac{H(F) + H(M)}{H(F,M)} | Robust multi-modal alignment with varying image overlap | Computationally heavier optimization |\n\n**Exam Point:** Mutual Information does not assume that pixel values are equal, but rather that knowing the intensity in one modality maximizes statistical predictability of intensity in the second modality.",
        formula_latex: "I(X; Y) = \\sum_{x \\in X} \\sum_{y \\in Y} p(x,y) \\log_2\\left( \\frac{p(x,y)}{p(x)p(y)} \\right)",
        linked_diagram_id: "diag-reg-loop"
      },
      {
        id: "sec-m2t5-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Rigid Brain Fusion Matrix",
        content_markdown: "**Clinical Scenario:** A patient undergoes preoperative brain MRI (Fixed image) and intraoperative CT (Moving image). Because the skull behaves as an entirely rigid body, a 6-DoF rigid transform is deployed.\n\n**Transformation Components:**\n- 3 Translations: Tx = +12.4 mm, Ty = -4.2 mm, Tz = +8.1 mm.\n- 3 Euler Rotations: Pitch = +2.1°, Roll = -0.5°, Yaw = +4.3°.\n- **Result:** After gradient descent optimization on Mutual Information, the joint entropy H(F,M) drops from 4.8 bits to 2.9 bits, confirming sharp co-registration of deep brain nuclei.",
        formula_latex: null,
        linked_diagram_id: "diag-reg-loop"
      },
      {
        id: "sec-m2t5-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why can rigid registration NOT be used when fusing diagnostic planning CT with cone-beam CT (CBCT) in thoracic lung cancer radiotherapy?\n\n**Answer:** Respiration causes dynamic non-rigid displacement of lung parenchyma and tumour nodules (up to 20 mm cranio-caudal motion), while the chest wall expands asynchronously. Rigid transforms cannot account for local non-linear stretching; deformable image registration (DIR) with vector displacement fields is mandatory.",
        formula_latex: null,
        linked_diagram_id: "diag-reg-loop"
      }
    ],
    diagrams: [
      {
        id: "diag-reg-loop",
        title: "Iterative Image Registration Optimization Loop",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Fixed[Fixed Reference Image] --> Sim[Similarity Metric Evaluator: NMI]
    Moving[Moving Source Image] --> Transform[Spatial Transform T: Rigid / Affine]
    Transform --> Resample[Interpolation & Resampling]
    Resample --> Sim
    Sim --> Optimizer[Numerical Optimizer: Gradient Descent]
    Optimizer -->|Update Parameters: Rot & Trans| Transform
    Sim -->|Converged| FusedOutput[Aligned Multi-Modal Fusion]
    style Fixed fill:#0077B6,color:#fff
    style Optimizer fill:#662D91,color:#fff
    style FusedOutput fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Sim": "Evaluates Normalized Mutual Information across joint histogram.",
          "Optimizer": "Adjusts translation and rotation parameters until metric is maximized."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m2-5",
        question_text: "Which similarity metric is standard for registering images from different modalities (such as PET and MRI)?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Mutual Information (MI / NMI)" },
          { id: "B", text: "Sum of Squared Differences (SSD)" },
          { id: "C", text: "Mean Absolute Error" },
          { id: "D", text: "Euclidean distance" }
        ],
        correct_option_id: "A",
        explanation: "Mutual Information measures shared information entropy without assuming identical intensities between modalities."
      }
    ],
    previous_topic_slug: "m2-t4-clinical-segmentation",
    next_topic_slug: null
  },

  // ==========================================
  // MODULE 3: Image Representation & DICOM
  // ==========================================
  "m3-t1-pixels-voxels": {
    id: "top-m3-t1",
    slug: "m3-t1-pixels-voxels",
    title: "1. Pixels, Voxels & Partial Volume Averaging",
    order_index: 1,
    co_tags: ["CO2"],
    read_time_minutes: 15,
    is_completed: false,
    module: { id: "mod-3", module_number: 3, title: "Image Representation" },
    sections: [
      {
        id: "sec-m3t1-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Discrete Spatial Sampling in Tomography",
        content_markdown: "A digital medical image is a 2D matrix of discrete picture elements (pixels), while 3D tomographic datasets (CT, MRI, PET) are composed of 3D volume elements (voxels). Each voxel has physical dimensions: in-plane pixel width (Δx), pixel height (Δy), and through-plane slice thickness (Δz).\n\nWhen a voxel contains multiple tissue types (e.g., cortical bone and brain parenchyma), the measured signal represents the volume-weighted average of both tissues. This Partial Volume Averaging artifact can obscure subtle lesions or falsely lower the apparent attenuation of small pulmonary nodules.",
        formula_latex: "\\text{Voxel Volume} = \\Delta x \\times \\Delta y \\times \\Delta z",
        linked_diagram_id: "diag-voxel-grid"
      },
      {
        id: "sec-m3t1-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Geometry & Resolution Metrics",
        content_markdown: "| Metric | Formula | Clinical Meaning | Typical Values |\n| :--- | :--- | :--- | :--- |\n| **In-Plane Pixel Size** | \\Delta x = \\frac{\\text{FOV}}{\\text{Matrix Size}} | Resolves finest structures in axial plane | 0.4 mm to 0.9 mm (CT) |\n| **Slice Thickness** | \\Delta z | Governs through-plane axial resolution | 0.625 mm (Thin slice) to 5.0 mm (Thick) |\n| **Aspect Ratio** | \\frac{\\Delta z}{\\Delta x} | Measures anisotropy (isotropic if = 1.0) | 1.0 (Isotropic) to 8.0 (Anisotropic) |\n| **Nyquist Limit** | f_{\\text{max}} = \\frac{1}{2 \\Delta x} | Maximum resolvable spatial frequency | ~1.0 to 1.4 line pairs per mm |\n\n**Exam Point:** Anisotropic voxels (e.g. 0.5 × 0.5 × 5.0 mm) cause severe stair-step artifacts when reformatted into sagittal or coronal views.",
        formula_latex: "\\text{Effective HU} = \\sum_{k=1}^{K} v_k \\cdot \\text{HU}_k, \\quad \\sum v_k = 1",
        linked_diagram_id: "diag-voxel-grid"
      },
      {
        id: "sec-m3t1-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Partial Volume Attenuation Shift",
        content_markdown: "**Clinical Scenario:** A 3 mm spherical pulmonary nodule (+100 HU soft tissue) is located inside an axial CT slice with slice thickness Δz = 5 mm and pixel size 0.5 × 0.5 mm. In a voxel containing the nodule edge, 40% of the volume is nodule (+100 HU) and 60% is alveolar air (-1000 HU).\n\n**Calculated Voxel Attenuation:**\n- Measured HU = (0.40 × +100) + (0.60 × -1000) = +40 - 600 = **-560 HU**.\n- **Clinical Impact:** The nodule appears as a non-specific ground-glass opacity rather than a solid lesion due to partial volume averaging with surrounding lung air.",
        formula_latex: null,
        linked_diagram_id: "diag-voxel-grid"
      },
      {
        id: "sec-m3t1-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** How does modern sub-millimeter multi-detector CT (MDCT) eliminate partial volume artifacts in temporal bone scanning?\n\n**Answer:** MDCT acquires isotropic 0.5 × 0.5 × 0.5 mm voxels. At this fine volumetric scale, individual ossicles (malleus, incus, stapes) occupy entire voxels rather than sharing volume with middle ear cavity air, preserving high-contrast edge fidelity.",
        formula_latex: null,
        linked_diagram_id: "diag-voxel-grid"
      }
    ],
    diagrams: [
      {
        id: "diag-voxel-grid",
        title: "Pixel to Voxel Volumetric Sampling Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    FOV[Field of View: FOV] --> Matrix[Matrix: 512 x 512]
    Matrix --> Pixel[Pixel Area: dx x dy]
    Collimator[Slice Collimation: dz] --> Voxel[3D Voxel: dx x dy x dz]
    Pixel --> Voxel
    Voxel --> ThinSlice[Thin Slice: 0.625mm Isotropic: Smooth 3D]
    Voxel --> ThickSlice[Thick Slice: 5.0mm Anisotropic: Stair-Step Artifacts]
    style FOV fill:#0077B6,color:#fff
    style Voxel fill:#662D91,color:#fff
    style ThinSlice fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Voxel": "Volumetric element measuring attenuation or proton density.",
          "ThinSlice": "Isotropic voxel grid enabling distortion-free multiplanar reconstruction."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m3-1",
        question_text: "What artifact occurs when two different tissue types share a single tomographic voxel, producing an intermediate blurred attenuation value?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Partial Volume Averaging Artifact" },
          { id: "B", text: "Beam hardening artifact" },
          { id: "C", text: "Motion ghosting artifact" },
          { id: "D", text: "Chemical shift artifact" }
        ],
        correct_option_id: "A",
        explanation: "Partial volume averaging occurs when multiple tissues occupy the volume of a single voxel, blending their signals."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m3-t2-grayscale-color"
  },

  "m3-t2-grayscale-color": {
    id: "top-m3-t2",
    slug: "m3-t2-grayscale-color",
    title: "2. Gray Scale & Color Representation (Pseudo-Color)",
    order_index: 2,
    co_tags: ["CO2"],
    read_time_minutes: 14,
    is_completed: false,
    module: { id: "mod-3", module_number: 3, title: "Image Representation" },
    sections: [
      {
        id: "sec-m3t2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Radiometric Resolution & Color Spaces in Medicine",
        content_markdown: "Radiometric resolution determines the number of discrete gray shades available to encode image intensities, governed by bit depth (8-bit = 256 levels, 12-bit = 4,096 levels, 16-bit = 65,536 levels). While primary structural modalities (radiography, CT, MRI) acquire monochrome grayscale values, human vision can only distinguish ~30 to 40 gray shades under typical ambient illumination.\n\nPseudo-color mapping assigns color spectrums (RGB / HSL) to monochrome intensities using color Look-Up Tables (color LUTs), boosting perceptual discrimination by orders of magnitude for functional and metabolic datasets (PET SUV mapping, fMRI activation maps, Doppler flow).",
        formula_latex: "\\text{Color Output} = \\begin{bmatrix} R(I) \\\\ G(I) \\\\ B(I) \\end{bmatrix} = \\text{ColorLUT}[I]",
        linked_diagram_id: "diag-color-spaces"
      },
      {
        id: "sec-m3t2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Comparative Palette Models",
        content_markdown: "| Palette / Colormap | Color Progression | Clinical Modality | Diagnostic Role |\n| :--- | :--- | :--- | :--- |\n| **Monochrome2** | Black (0) ➔ White (255) | CT, Diagnostic X-Ray | Standard anatomical viewing (Dense = White) |\n| **Monochrome1** | White (0) ➔ Black (255) | Traditional Film, CR | Legacy inverted view (Bone = Dark) |\n| **Hot Iron / Fire** | Black ➔ Red ➔ Yellow ➔ White | PET SUV, SPECT | Highlights hypermetabolic tumour foci |\n| **Rainbow / Jet** | Blue ➔ Cyan ➔ Yellow ➔ Red | Thermography, Perfusion | Highly non-linear (prone to false boundary edges) |\n| **Barton / Velocity** | Red (Toward) / Blue (Away) | Color Doppler Ultrasound | Directional blood flow velocity in cardiac valves |\n\n**Exam Point:** Rainbow colormaps are deprecated in diagnostic guidelines because perceived brightness jumps (e.g. at green-to-yellow) create artificial contours where no real biological gradient exists.",
        formula_latex: "\\text{Perceptual Luminance: } Y = 0.299 R + 0.587 G + 0.114 B",
        linked_diagram_id: "diag-color-spaces"
      },
      {
        id: "sec-m3t2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Standardized Uptake Value (SUV)",
        content_markdown: "**Clinical Scenario:** In PET oncology review, a lymph node has an ¹⁸F-FDG Standardized Uptake Value SUV = 6.8. A linear Hot-Metal palette maps SUV [0 to 10] across 256 color indices.\n\n**Color LUT Index Calculation:**\n- Normalized Ratio = 6.8 / 10.0 = 0.68.\n- LUT Index = 0.68 × 255 = **173.4 ≈ 173**.\n- Index 173 maps to RGB (255, 140, 0), displaying the metastatic node as intense incandescent orange on the black-and-white anatomical CT background.",
        formula_latex: null,
        linked_diagram_id: "diag-color-spaces"
      },
      {
        id: "sec-m3t2-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is DICOM Grayscale Standard Display Function (GSDF, Part 14) legally mandated for diagnostic radiology monitors?\n\n**Answer:** Different display technologies (OLED, LCD, CRT) have varying non-linear voltage-to-luminance response curves. GSDF standardizes monitors using Barten's model of human Just-Noticeable Differences (JND), guaranteeing that a 1 HU change appears visually identical whether viewed on a radiologist's workstation or a surgeon's tablet.",
        formula_latex: null,
        linked_diagram_id: "diag-color-spaces"
      }
    ],
    diagrams: [
      {
        id: "diag-color-spaces",
        title: "Pseudo-Color & DICOM GSDF Mapping Pipeline",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    RawIntensity[Raw 12-Bit Scalar: 0..4095] --> Window[VOI Windowing Transform]
    Window --> GSDF[DICOM Part 14 GSDF: Perceptual Linearization]
    GSDF --> PseudoLUT[Color Look-Up Table: ColorLUT]
    PseudoLUT --> DisplayRGB[Calibrated Display: 24-Bit RGB]
    style RawIntensity fill:#0077B6,color:#fff
    style GSDF fill:#662D91,color:#fff
    style DisplayRGB fill:#B82662,color:#fff`,
        interactive_node_map: {
          "GSDF": "Barten model mapping pixel values to perceptual Just-Noticeable Differences.",
          "PseudoLUT": "Translates scalar intensities to RGB colormaps for functional scans."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m3-2",
        question_text: "Which DICOM standard display function calibrates diagnostic monitors so equal code steps produce equal perceptual visual steps?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "DICOM GSDF (Part 14)" },
          { id: "B", text: "sRGB Color Profile" },
          { id: "C", text: "Adobe RGB 1998" },
          { id: "D", text: "Rec. 709" }
        ],
        correct_option_id: "A",
        explanation: "DICOM Part 14 Grayscale Standard Display Function (GSDF) ensures perceptually linear diagnostic luminance across monitors."
      }
    ],
    previous_topic_slug: "m3-t1-pixels-voxels",
    next_topic_slug: "m3-t3-file-formats"
  },

  "m3-t3-file-formats": {
    id: "top-m3-t3",
    slug: "m3-t3-file-formats",
    title: "3. Medical File Formats (DICOM vs NIfTI vs PNG)",
    order_index: 3,
    co_tags: ["CO4"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-3", module_number: 3, title: "Image Representation" },
    sections: [
      {
        id: "sec-m3t3-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Clinical File Encapsulation & Header Structures",
        content_markdown: "Medical imaging data cannot be stored as simple consumer raster files (JPEG or PNG) because clinical practice demands complete acquisition metadata (scanner model, kVp, slice location, patient orientation, radiation dose, pixel spacing in physical millimeters).\n\nTwo dominant formats govern medical imaging: **DICOM Part 10** (the global clinical hospital standard) and **NIfTI-1/2** (the global neuroimaging and AI research standard).",
        formula_latex: null,
        linked_diagram_id: "diag-formats-compare"
      },
      {
        id: "sec-m3t3-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Comparative File Format Matrix",
        content_markdown: "| Feature | DICOM (Digital Imaging & Communications in Medicine) | NIfTI (Neuroimaging Informatics Tech Initiative) | Standard Consumer (PNG / JPEG) |\n| :--- | :--- | :--- | :--- |\n| **Primary Use** | Hospital clinical workflow, PACS, regulatory records | Neuroimaging, AI deep learning research, 3D/4D volumes | Patient portal preview, publications |\n| **Structure** | Header tag dictionary + binary pixel stream per slice | 348-byte compact binary header + 3D/4D volume (.nii/.nii.gz) | 8-bit/16-bit compressed RGB/mono raster |\n| **Spatial Coordinates** | Tag (0020,0032) Position & (0020,0037) Orientation | Embedded 4x4 Affine matrices (qform & sform) | None (pixel indices only) |\n| **Multi-Slice Storage** | Typically separate file per slice (or Enhanced Multi-frame) | Single file stores entire 3D volume or 4D time series | 2D single frame only |\n| **Patient Privacy** | Extensive embedded metadata (requires PHI scrubbing) | Minimal header (no direct patient demographics) | Exif metadata only |\n\n**Exam Point:** NIfTI's qform/sform matrices map voxel indices (i,j,k) directly into millimeter space (x,y,z) in MNI (Montreal Neurological Institute) or Talairach standard space.",
        formula_latex: "\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} s_{11} & s_{12} & s_{13} & s_{14} \\\\ s_{21} & s_{22} & s_{23} & s_{24} \\\\ s_{31} & s_{32} & s_{33} & s_{34} \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} i \\\\ j \\\\ k \\\\ 1 \\end{bmatrix}",
        linked_diagram_id: "diag-formats-compare"
      },
      {
        id: "sec-m3t3-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Converting DICOM Series to NIfTI",
        content_markdown: "**Clinical Case:** An AI researcher converts 320 axial DICOM slices of a head CT into a single NIfTI file (`head_ct.nii.gz`) using tools like `dcm2niix`.\n\n**Key Operations Performed by Converter:**\n1. Reads Tag (0020,0032) across all slices to sort slices by true physical Z-position (preventing table-feed reversals).\n2. Extracts Rescale Slope (1) and Intercept (-1024) to convert 12-bit stored values to true Hounsfield Units.\n3. Calculates the 4x4 sform affine matrix from Pixel Spacing (0.488 mm) and Slice Thickness (0.625 mm).\n4. Compresses with Gzip, reducing disk size from 160 MB down to **34 MB**.",
        formula_latex: null,
        linked_diagram_id: "diag-formats-compare"
      },
      {
        id: "sec-m3t3-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is converting 12-bit CT DICOM images to standard 8-bit PNG images before feeding them into deep learning models considered a major clinical error?\n\n**Answer:** 8-bit quantization reduces 4,096 distinct attenuation levels to 256, permanently discarding subtle contrast differences (e.g. differentiating ischemic penumbra from normal white matter). Once quantized, true quantitative Hounsfield calibration is irrecoverably lost.",
        formula_latex: null,
        linked_diagram_id: "diag-formats-compare"
      }
    ],
    diagrams: [
      {
        id: "diag-formats-compare",
        title: "Medical Imaging File Format Ecosystem",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Scanner[Clinical Modality] -->|DICOM Part 10: Multi-Slice| PACS[Hospital PACS]
    PACS -->|Anonymization & Sorting| Converter[dcm2niix Pipeline]
    Converter -->|Single 3D/4D File| NIfTI[NIfTI .nii.gz: AI & Neuroimaging]
    PACS -->|Lossless Export| Web[DICOM WADO-RS: Web Browser]
    PACS -.->|Lossy Downsampling: Never for AI| PNG[8-Bit PNG: Documentation Only]
    style Scanner fill:#0077B6,color:#fff
    style NIfTI fill:#662D91,color:#fff
    style PNG fill:#B82662,color:#fff`,
        interactive_node_map: {
          "NIfTI": "Standard format for 3D PyTorch and MONAI segmentation models.",
          "PNG": "Consumer raster lacking physical coordinates and 12-bit dynamic range."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m3-3",
        question_text: "Which file format encapsulates complete 3D volumetric volumes into a single file with embedded 4x4 spatial affine coordinate matrices for AI research?",
        co_tag: "CO4",
        options: [
          { id: "A", text: "NIfTI (.nii / .nii.gz)" },
          { id: "B", text: "BMP" },
          { id: "C", text: "TIFF" },
          { id: "D", text: "JPEG-LS" }
        ],
        correct_option_id: "A",
        explanation: "NIfTI is standard in medical deep learning, storing complete volumetric grids with coordinate matrices."
      }
    ],
    previous_topic_slug: "m3-t2-grayscale-color",
    next_topic_slug: "m3-t4-dicom-standard"
  },

  "m3-t4-dicom-standard": {
    id: "top-m3-t4",
    slug: "m3-t4-dicom-standard",
    title: "4. The DICOM Standard & Tag Dictionaries",
    order_index: 4,
    co_tags: ["CO2", "CO4"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-3", module_number: 3, title: "Image Representation" },
    sections: [
      {
        id: "sec-m3t4-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: DICOM Information Model & Tag Architecture",
        content_markdown: "The DICOM standard (Digital Imaging and Communications in Medicine, NEMA / ISO 12052) structures data following a 4-level clinical hierarchy: **Patient ➔ Study ➔ Series ➔ Instance**.\n\nEvery clinical attribute is encoded as a Data Element identified by an ordered 4-byte hexadecimal tag (Group Number, Element Number), accompanied by a Value Representation (VR) defining data type, a Value Length, and the Value Field.",
        formula_latex: null,
        linked_diagram_id: "diag-dicom-tree"
      },
      {
        id: "sec-m3t4-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Core Clinical DICOM Data Dictionary",
        content_markdown: "| DICOM Tag | Keyword | VR | Description & Clinical Utility |\n| :--- | :--- | :--- | :--- |\n| **(0010,0010)** | PatientName | PN | Primary patient name (LastName^FirstName^Middle) |\n| **(0010,0020)** | PatientID | LO | Medical Record Number (MRN) identifier |\n| **(0020,000D)** | StudyInstanceUID | UI | Unique dot-separated identifier for entire clinical exam |\n| **(0020,000E)** | SeriesInstanceUID | UI | Unique identifier for a specific scan acquisition sequence |\n| **(0008,0018)** | SOPInstanceUID | UI | Globally unique identifier for this individual slice |\n| **(0020,0032)** | ImagePositionPatient | DS | (X, Y, Z) Cartesian coordinates of slice origin in mm |\n| **(0020,0037)** | ImageOrientationPatient | DS | Direction cosines of slice first row and first column |\n| **(0028,0030)** | PixelSpacing | DS | Physical distance between pixel centers: [Row \\ Col] in mm |\n| **(0028,1050)** | WindowCenter | DS | Default Window Level (WL) for display |\n| **(0028,1051)** | WindowWidth | DS | Default Window Width (WW) for display |\n| **(7FE0,0010)** | PixelData | OB/OW | Raw binary pixel byte stream |\n\n**Exam Point:** Value Representations (VR) enforce strict validation: 'PN' for person names, 'DA' for dates (YYYYMMDD), 'UI' for UIDs, and 'DS' for decimal strings.",
        formula_latex: "\\vec{n} = \\vec{R}_{\\text{row}} \\times \\vec{R}_{\\text{col}}, \\quad \\vec{R}_{\\text{row}} = [r_x, r_y, r_z]^T, \\quad \\vec{R}_{\\text{col}} = [c_x, c_y, c_z]^T",
        linked_diagram_id: "diag-dicom-tree"
      },
      {
        id: "sec-m3t4-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Parsing Slice Normal Vector",
        content_markdown: "**Clinical Scenario:** A brain MRI slice has Tag (0020,0037) Image Orientation (Patient) = `[1, 0, 0, 0, 1, 0]`. What is the scan plane, and what is its normal cross-product vector?\n\n**Vector Analysis:**\n- Row Direction Cosine: R = [1, 0, 0] (Points along patient Right-to-Left, +X).\n- Column Direction Cosine: C = [0, 1, 0] (Points along patient Anterior-to-Posterior, +Y).\n- Slice Normal Vector: N = R × C = [0, 0, 1] (Points along Head-to-Feet, +Z axis).\n- **Conclusion:** The slice plane is strictly **Axial (Transverse)**.",
        formula_latex: null,
        linked_diagram_id: "diag-dicom-tree"
      },
      {
        id: "sec-m3t4-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why must HIPAA and DPDP de-identification routines scrub both direct demographic tags and private tag groups (odd group numbers > 0x0008)?\n\n**Answer:** Scanner manufacturers frequently write patient identification, clinical trial IDs, and raw sensor serial numbers inside proprietary Private Tags (e.g. Group 0019 or 0029). Scrubbing only standard tags leaves private tags un-sanitized, resulting in severe compliance violations.",
        formula_latex: null,
        linked_diagram_id: "diag-dicom-tree"
      }
    ],
    diagrams: [
      {
        id: "diag-dicom-tree",
        title: "DICOM Information Object Definition (IOD) Hierarchy",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Patient[Patient Level: Name, MRN, DOB] --> Study[Study Level: StudyInstanceUID, Date]
    Study --> Series1[Series 1: Axial CT Bone Kernel]
    Study --> Series2[Series 2: Axial CT Soft Tissue Kernel]
    Series1 --> Inst1[Instance 1: Slice 001]
    Series1 --> Inst2[Instance 2: Slice 002]
    Series2 --> Inst3[Instance 1: Slice 001]
    style Patient fill:#0077B6,color:#fff
    style Study fill:#662D91,color:#fff
    style Series1 fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Patient": "Top-level entity identified by PatientID (0010,0020).",
          "Study": "Single clinical imaging encounter containing multiple series."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m3-4",
        question_text: "Which DICOM tag stores the in-plane physical distance between adjacent pixel centers in millimeters?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "(0028,0030) Pixel Spacing" },
          { id: "B", text: "(0010,0010) Patient Name" },
          { id: "C", text: "(0008,0060) Modality" },
          { id: "D", text: "(7FE0,0010) Pixel Data" }
        ],
        correct_option_id: "A",
        explanation: "Tag (0028,0030) Pixel Spacing supplies the row and column physical spacing in millimeters."
      }
    ],
    previous_topic_slug: "m3-t3-file-formats",
    next_topic_slug: "m3-t5-quality-snr"
  },

  "m3-t5-quality-snr": {
    id: "top-m3-t5",
    slug: "m3-t5-quality-snr",
    title: "5. Image Quality & Signal-to-Noise Ratio (SNR)",
    order_index: 5,
    co_tags: ["CO2"],
    read_time_minutes: 18,
    is_completed: false,
    module: { id: "mod-3", module_number: 3, title: "Image Representation" },
    sections: [
      {
        id: "sec-m3t5-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Quantitative Image Quality Metrics",
        content_markdown: "Diagnostic image quality is governed by four interdependent physical pillars: **Spatial Resolution** (ability to resolve fine adjacent structures), **Contrast Resolution** (ability to distinguish subtle density variations from background), **Temporal Resolution** (capturing motion without blur), and **Noise** (unwanted random signal fluctuations).\n\nSignal-to-Noise Ratio (SNR) and Contrast-to-Noise Ratio (CNR) quantify diagnostic fidelity. According to the Rose Criterion, an object requires CNR ≥ 5 to be reliably detected with 100% certainty by human observers.",
        formula_latex: "\\text{SNR} = \\frac{\\mu}{\\sigma}, \\quad \\text{CNR} = \\frac{|\\mu_{\\text{lesion}} - \\mu_{\\text{background}}|}{\\sigma}",
        linked_diagram_id: "diag-snr-curve"
      },
      {
        id: "sec-m3t5-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Noise Averaging & Modulation Transfer Function",
        content_markdown: "| Parameter | Formula | Physical Effect | Clinical Trade-off |\n| :--- | :--- | :--- | :--- |\n| **Signal-to-Noise Ratio** | \\text{SNR} = \\frac{\\bar{S}}{\\sigma} | Ratio of true signal to background noise | Higher SNR requires higher dose or longer scan |\n| **Averaging SNR Gain** | \\text{SNR}_{N} = \\sqrt{N} \\cdot \\text{SNR}_1 | Averaging N scans doubles SNR by √N | 4x scans needed to double SNR; increases scan time |\n| **Contrast-to-Noise Ratio** | \\text{CNR} = \\frac{|S_A - S_B|}{\\sqrt{\\sigma_A^2 + \\sigma_B^2}} | Measures lesion detectability against tissue | Critical in mammography and liver lesion detection |\n| **MTF (50% / 10%)** | \\text{MTF}(f) = \\frac{\\text{Contrast}_{\\text{out}}(f)}{\\text{Contrast}_{\\text{in}}(f)} | Frequency response curve of imaging chain | Higher resolution kernels increase noise variance |\n\n**Rose Criterion:** Detection threshold requires \\text{CNR} \\ge 5.0 for human observers.",
        formula_latex: "\\text{Rose Criterion: } \\text{CNR} \\ge 5.0",
        linked_diagram_id: "diag-snr-curve"
      },
      {
        id: "sec-m3t5-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Averaging Multiple Acquisitions",
        content_markdown: "**Clinical Case:** A low-dose lung MRI scan has an SNR of 12.0 with noticeable background grain. The protocol averages N = 9 repeated acquisitions.\n\n**SNR Calculation:**\n- Gain factor = √9 = 3.0.\n- Final SNR = 12.0 × 3.0 = **36.0**.\n- The background noise standard deviation drops to 1/3 of its single-shot amplitude, bringing subtle apical pleural thickenings above the Rose visibility threshold.",
        formula_latex: null,
        linked_diagram_id: "diag-snr-curve"
      },
      {
        id: "sec-m3t5-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why does increasing CT slice thickness from 1 mm to 5 mm dramatically improve SNR, but simultaneously degrade diagnostic accuracy for coronary calcifications?\n\n**Answer:** Thick slices capture 5 times more photon events per voxel, cutting quantum mottle noise by √5 ≈ 2.23 (SNR increases by 123%). However, 5 mm slice thickness severely degrades longitudinal spatial resolution (Z-axis), causing small 1 mm coronary calcifications to suffer extreme partial volume dilution.",
        formula_latex: null,
        linked_diagram_id: "diag-snr-curve"
      }
    ],
    diagrams: [
      {
        id: "diag-snr-curve",
        title: "Modulation Transfer Function & Noise Trade-Off",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Dose[Radiation Dose / Acquisition Time] --> Photons[Detected Photon Fluence N]
    Photons --> SNR[SNR Gain: Proportional to Sqrt N]
    FilterSharp[Sharpening High-Pass Kernel] --> ResHigh[Higher Spatial Resolution MTF]
    FilterSharp --> NoiseHigh[Increased Quantum Mottle Noise]
    FilterSmooth[Soft Tissue Smoothing Kernel] --> LowNoise[Superior Contrast Resolution CNR]
    FilterSmooth --> Blur[Slight Edge Blur]
    style Photons fill:#0077B6,color:#fff
    style SNR fill:#662D91,color:#fff
    style LowNoise fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Photons": "Quantum events obeying Poisson statistics (variance = mean).",
          "LowNoise": "Maximizes CNR for subtle abdominal metastases."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m3-5",
        question_text: "According to the Rose Criterion, what minimum Contrast-to-Noise Ratio (CNR) is required for 100% reliable visual lesion detection?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "CNR ≥ 5.0" },
          { id: "B", text: "CNR ≥ 1.0" },
          { id: "C", text: "CNR ≥ 50.0" },
          { id: "D", text: "CNR ≥ 0.1" }
        ],
        correct_option_id: "A",
        explanation: "Albert Rose demonstrated that human vision requires CNR ≥ 5 to discriminate objects with near 100% confidence."
      }
    ],
    previous_topic_slug: "m3-t4-dicom-standard",
    next_topic_slug: null
  }
};

