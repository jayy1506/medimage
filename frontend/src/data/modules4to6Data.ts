import { TopicPayload } from "@/components/topic/DualPanelViewer";

export const MODULES_4_TO_6_DATA: Record<string, TopicPayload> = {
  // ==========================================
  // MODULE 4: Operations in Intensity Space
  // ==========================================
  "m4-t1-intensity-transform": {
    id: "top-m4-t1",
    slug: "m4-t1-intensity-transform",
    title: "1. Intensity Transform Function & Dynamic Range",
    order_index: 1,
    co_tags: ["CO2"],
    read_time_minutes: 15,
    is_completed: false,
    module: { id: "mod-4", module_number: 4, title: "Operations in Intensity Space" },
    sections: [
      {
        id: "sec-m4t1-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Dynamic Range & Radiometric Mapping",
        content_markdown: "Dynamic range is the ratio between the maximum and minimum detectable physical signals without saturation or distortion. In medical imaging, detectors record high-dynamic-range data (12-bit CT = 4096 levels, 14-bit digital radiography = 16384 levels), whereas standard computer monitors display only 8-bit (256 shades of gray).\n\nIntensity transformation functions s = T(r) map the raw physiological dynamic range into perceptually optimal display intervals, enabling radiologists to interrogate subtle density differences without losing diagnostic fidelity.",
        formula_latex: "s = T(r)",
        linked_diagram_id: "diag-dynamic-range"
      },
      {
        id: "sec-m4t1-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Continuous to Discrete Radiometric Transformation",
        content_markdown: "| Transform Type | Formula | Operational Characteristic | Clinical Purpose |\n| :--- | :--- | :--- | :--- |\n| **Identity** | s = r | Linear pass-through | Baseline unprocessed view |\n| **Negative / Inversion** | s = L - 1 - r | Inverts black and white | Enhances mammographic calcifications against fibroglandular tissue |\n| **Logarithmic** | s = c \\cdot \\ln(1 + |r|) | Expands low-intensity dark values; compresses peak values | Fourier frequency spectrum display & ultrasound envelope |\n| **Power-Law (Gamma)** | s = c \\cdot r^\\gamma | Modulates contrast curvature | Gamma display compensation & underexposed chest X-ray enhancement |\n\n**Exam Point:** Dynamic range in decibels (dB) is calculated as \\text{DR}_{\\text{dB}} = 20 \\log_{10}\\left(\\frac{I_{\\max}}{I_{\\min}}\\right). A 12-bit CT detector possesses ~72 dB of dynamic range.",
        formula_latex: "\\text{Dynamic Range (dB)} = 20 \\log_{10}\\left( \\frac{I_{\\max}}{I_{\\min}} \\right)",
        linked_diagram_id: "diag-dynamic-range"
      },
      {
        id: "sec-m4t1-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Logarithmic Spectrum Compression",
        content_markdown: "**Clinical Scenario:** The 2D Fourier spectrum of a cardiac MRI scan contains DC central component I_max = 1,000,000 and peripheral high-frequency edge harmonics I_min = 1. Displaying this linearly on an 8-bit monitor (0–255) maps all harmonics to 0 (invisible).\n\n**Logarithmic Transform Application:**\n- Formula: s = c · ln(1 + r), choosing c = 255 / ln(1 + 1,000,000) = 255 / 13.8155 ≈ 18.457.\n- For an edge harmonic r = 50: s = 18.457 · ln(1 + 50) = 18.457 · 3.9318 ≈ **72.6** (clearly visible gray).\n- For DC peak r = 1,000,000: s = 18.457 · 13.8155 = **255.0** (white peak).\n- **Conclusion:** Log transformation compresses 6 orders of magnitude into a clearly interpretable visual spectrum.",
        formula_latex: null,
        linked_diagram_id: "diag-dynamic-range"
      },
      {
        id: "sec-m4t1-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** What diagnostic catastrophe occurs if an image processing algorithm prematurely clips high intensities in a digital extremity radiograph?\n\n**Answer:** Pixel saturation (burn-out) sets all intensities above the threshold to uniform pure white (255). In orthopedic trauma, cortical bone hairline fractures and periosteal reactions are completely erased, leading to missed fracture diagnoses.",
        formula_latex: null,
        linked_diagram_id: "diag-dynamic-range"
      }
    ],
    diagrams: [
      {
        id: "diag-dynamic-range",
        title: "Dynamic Range Mapping Architecture",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Sensor[Raw 12/16-Bit Medical Sensor: 72-96 dB] --> TransFunc[Intensity Transformation: Log / Gamma]
    TransFunc --> BitDepth[Quantization: 8-Bit Display Buffer]
    BitDepth --> GSDF[DICOM GSDF Luminance Correction]
    GSDF --> DiagnosticDisplay[Calibrated 3MP/5MP Medical Monitor]
    style Sensor fill:#0077B6,color:#fff
    style TransFunc fill:#662D91,color:#fff
    style DiagnosticDisplay fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Sensor": "High-dynamic-range photon counting or flat-panel detector.",
          "DiagnosticDisplay": "High-luminance calibrated diagnostic medical display."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m4-1",
        question_text: "What mathematical transformation is standard for compressing Fourier spectrums with dynamic ranges exceeding 10⁶ into displayable grayscale?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Logarithmic Transform s = c · ln(1 + r)" },
          { id: "B", text: "Negative Inversion" },
          { id: "C", text: "Bilinear Interpolation" },
          { id: "D", text: "Sobel Gradient" }
        ],
        correct_option_id: "A",
        explanation: "Log transforms compress wide dynamic ranges, making weak high-frequency Fourier harmonics visible."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m4-t2-windowing"
  },

  "m4-t2-windowing": {
    id: "top-m4-t2",
    slug: "m4-t2-windowing",
    title: "2. Clinical Windowing (Level, Width & Hounsfield Units)",
    order_index: 2,
    co_tags: ["CO2"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-4", module_number: 4, title: "Operations in Intensity Space" },
    sections: [
      {
        id: "sec-m4t2-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Window Width (WW) and Window Level (WL)",
        content_markdown: "CT windowing (also called VOI LUT transformation) maps a chosen interval of continuous Hounsfield Units (HU) across the 256 gray levels of an 8-bit display monitor.\n\n- **Window Level (WL / Center):** The central HU attenuation value around which the window is positioned, chosen to match the target organ (e.g. Brain = +40 HU, Bone = +400 HU, Lung = -600 HU).\n- **Window Width (WW):** The total range of HU values mapped from pure black (0) to pure white (255). A narrow window yields high contrast over a small density band; a wide window encompasses wide density variations with lower contrast.",
        formula_latex: "\\text{Window Range} = \\left[ \\text{WL} - \\frac{\\text{WW}}{2}, \\; \\text{WL} + \\frac{\\text{WW}}{2} \\right]",
        linked_diagram_id: "diag-window-presets"
      },
      {
        id: "sec-m4t2-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Standard Clinical Window Presets",
        content_markdown: "| Clinical Window | Window Level (WL) | Window Width (WW) | Display Range (HU) | Clinical Indication |\n| :--- | :--- | :--- | :--- | :--- |\n| **Brain (Narrow)** | +40 HU | 80 HU | [0 HU to +80 HU] | Early ischemic stroke cytotoxic edema, gray-white differentiation |\n| **Subdural / Hemorrhage** | +75 HU | 150 HU | [0 HU to +150 HU] | Acute clotted intracranial hemorrhage vs adjacent skull bone |\n| **Bone** | +400 HU | 2000 HU | [-600 HU to +1400 HU] | Cortical bone fractures, skull base trauma, spine trabeculae |\n| **Lung (Thoracic)** | -600 HU | 1500 HU | [-1350 HU to +150 HU] | Pulmonary emphysema, ground-glass opacities, interstitial disease |\n| **Abdomen / Soft Tissue** | +50 HU | 400 HU | [-150 HU to +250 HU] | Liver metastases, renal masses, lymphadenopathy |\n| **Mediastinum** | +40 HU | 400 HU | [-160 HU to +240 HU] | Aortic dissection, hilar lymph nodes, cardiac chambers |\n\n**Clamping Equation:**\nValues below (WL - WW/2) clamp to 0 (black); values above (WL + WW/2) clamp to 255 (white).",
        formula_latex: "I_{\\text{display}}(HU) = \\begin{cases} 0 & HU \\le WL - \\frac{WW}{2} \\\\ \\left( HU - (WL - \\frac{WW}{2}) \\right) \\times \\frac{255}{WW} & WL - \\frac{WW}{2} < HU \\le WL + \\frac{WW}{2} \\\\ 255 & HU > WL + \\frac{WW}{2} \\end{cases}",
        linked_diagram_id: "diag-window-presets"
      },
      {
        id: "sec-m4t2-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Ischemic Stroke Detection",
        content_markdown: "**Clinical Scenario:** In acute ischemic stroke, cytotoxic edema lowers gray matter density from normal +38 HU down to +32 HU (a subtle 6 HU drop). Compare the display contrast in an Abdominal Window (WW = 400) versus a Stroke Brain Window (WW = 40, WL = +35).\n\n**Display Step Calculations:**\n- **Abdominal Window (WW = 400):** Output change = (6 HU / 400 HU) × 255 = **3.8 gray levels** (virtually indistinguishable to human eyes).\n- **Stroke Window (WW = 40, WL = +35):** Range is [+15 to +55 HU]. Output change = (6 HU / 40 HU) × 255 = **38.25 gray levels**.\n- **Conclusion:** The stroke window magnifies the visual difference by 10x, making the hypodense infarct clearly visible on diagnostic review.",
        formula_latex: null,
        linked_diagram_id: "diag-window-presets"
      },
      {
        id: "sec-m4t2-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why must a radiologist examine thoracic trauma CT scans using both Mediastinal and Lung window presets?\n\n**Answer:** Mediastinal window (WL +40, WW 400) provides high contrast for vascular structures (aortic transection, hematoma) but clips lung air (-1000 HU) to solid black, hiding pneumothorax and pulmonary contusion. The Lung window (WL -600, WW 1500) reveals parenchymal tears but saturates soft tissue to solid white. Reviewing both is clinically required.",
        formula_latex: null,
        linked_diagram_id: "diag-window-presets"
      }
    ],
    diagrams: [
      {
        id: "diag-window-presets",
        title: "CT Hounsfield Scale & Windowing Transfer Mapping",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Scale[CT Attenuation Scale: -1000 HU Air to +3000 HU Bone] --> BrainWin[Brain: WL +40, WW 80: Contrast 0..80 HU]
    Scale --> BoneWin[Bone: WL +400, WW 2000: Range -600..+1400 HU]
    Scale --> LungWin[Lung: WL -600, WW 1500: Range -1350..+150 HU]
    BrainWin --> Display1[High-Contrast Edema Visualization]
    BoneWin --> Display2[Cortical Trabecular Fracture Line Detection]
    LungWin --> Display3[Parenchymal Emphysema & Nodule Detection]
    style Scale fill:#0077B6,color:#fff
    style BrainWin fill:#662D91,color:#fff
    style BoneWin fill:#B82662,color:#fff`,
        interactive_node_map: {
          "BrainWin": "Narrow window maximizing subtle gray/white matter density shifts.",
          "BoneWin": "Wide window preventing saturation of dense cortical bone."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m4-2",
        question_text: "What are the standard clinical Window Width (WW) and Level (WL) settings for acute ischemic brain stroke evaluation?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "WW = 80 HU, WL = +40 HU" },
          { id: "B", text: "WW = 2000 HU, WL = +400 HU" },
          { id: "C", text: "WW = 1500 HU, WL = -600 HU" },
          { id: "D", text: "WW = 400 HU, WL = +50 HU" }
        ],
        correct_option_id: "A",
        explanation: "Narrow brain window (WW 80, WL +40) maximizes subtle contrast differences in ischemic brain tissue."
      }
    ],
    previous_topic_slug: "m4-t1-intensity-transform",
    next_topic_slug: "m4-t3-histograms"
  },

  "m4-t3-histograms": {
    id: "top-m4-t3",
    slug: "m4-t3-histograms",
    title: "3. Histograms & Histogram Equalization (CDF)",
    order_index: 3,
    co_tags: ["CO2"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-4", module_number: 4, title: "Operations in Intensity Space" },
    sections: [
      {
        id: "sec-m4t3-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Statistical Intensity Distributions & Equalization",
        content_markdown: "An image histogram is a discrete function h(r_k) = n_k representing the number of pixels possessing intensity level r_k. The normalized histogram p(r_k) = n_k / N gives the empirical probability density function (PDF) of pixel intensities.\n\nHistogram Equalization (HE) transforms the image so that the output histogram has an approximately uniform probability distribution across all gray levels. This is accomplished by mapping input intensities through their Cumulative Distribution Function (CDF).",
        formula_latex: "s_k = T(r_k) = (L - 1) \\sum_{j=0}^{k} p_r(r_j) = \\frac{L - 1}{N} \\sum_{j=0}^{k} n_j",
        linked_diagram_id: "diag-hist-equal"
      },
      {
        id: "sec-m4t3-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Continuous Derivation & CLAHE Mechanics",
        content_markdown: "For continuous random variables r in [0, 1] with PDF p_r(r), the transformation s = T(r) = ∫₀ʳ p_r(w) dw produces a uniformly distributed variable s with p_s(s) = 1.\n\n**Contrast Limited Adaptive Histogram Equalization (CLAHE):**\nGlobal HE frequently over-amplifies background noise in medical scans. CLAHE resolves this via three deterministic steps:\n1. Partitions the image into small contextual tiles (typically 8x8 or 16x16 pixels).\n2. Computes the histogram for each tile and clips counts exceeding a predefined Clip Limit (e.g. 2.5x mean count).\n3. Re-distributes clipped pixels uniformly across all histogram bins before computing the CDF.\n4. Recombines adjacent tile boundaries using bilinear interpolation to eliminate artificial boundary seams.",
        formula_latex: "\\beta = \\frac{N_{\\text{clip}}}{N_{\\text{bins}}}, \\quad \\Delta = \\frac{\\sum (h_k - N_{\\text{clip}})^+}{N_{\\text{bins}}}",
        linked_diagram_id: "diag-hist-equal"
      },
      {
        id: "sec-m4t3-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: 4-Bit Equalization Mapping",
        content_markdown: "**Clinical Example:** An underexposed 64×64 radiograph (N = 4096 pixels, L = 16 levels: 0 to 15) has cumulative counts: C(0)=0, C(1)=1024, C(2)=2560, C(3)=3584, C(4)=4096. Calculate output intensity s_k for input level r = 2.\n\n**CDF Mapping:**\n- CDF at r=2: P(r ≤ 2) = 2560 / 4096 = 0.625.\n- Mapped level: s_2 = round( (16 - 1) × 0.625 ) = round( 15 × 0.625 ) = round( 9.375 ) = **9**.\n- Input level 2 (originally dark) is stretched up to level 9, expanding dynamic contrast.",
        formula_latex: null,
        linked_diagram_id: "diag-hist-equal"
      },
      {
        id: "sec-m4t3-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is unconstrained global histogram equalization contraindicated for diagnostic chest radiography?\n\n**Answer:** Large uniform air regions produce massive peaks in the histogram. Global HE forces these empty bins to stretch across large output gray levels, boosting quantum mottle noise in the lung fields to diagnostic-level prominence and creating false-positive pulmonary reticular patterns.",
        formula_latex: null,
        linked_diagram_id: "diag-hist-equal"
      }
    ],
    diagrams: [
      {
        id: "diag-hist-equal",
        title: "Cumulative Distribution Function (CDF) Equalization Workflow",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    InputHist[Input Image Histogram: Clustered Densities] --> CDFCalc[Compute Cumulative Distribution: CDF r]
    CDFCalc --> ClipCheck{Apply CLAHE Clip Limit?}
    ClipCheck -->|Yes| ClipBins[Clip Histogram Peaks & Redistribute Evenly]
    ClipCheck -->|No| MapLevels[Map Intensities: s = L-1 x CDF]
    ClipBins --> BilinearInterp[Bilinear Inter-Tile Smoothing]
    MapLevels --> OutputEqualized[Output High-Contrast Diagnostic Image]
    BilinearInterp --> OutputEqualized
    style InputHist fill:#0077B6,color:#fff
    style ClipBins fill:#662D91,color:#fff
    style OutputEqualized fill:#B82662,color:#fff`,
        interactive_node_map: {
          "ClipBins": "Suppresses noise amplification in uniform lung or fluid regions.",
          "OutputEqualized": "Yields balanced contrast without tile boundary seams."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m4-3",
        question_text: "What key modification in CLAHE prevents the severe noise over-amplification typical of standard global histogram equalization?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "Clipping local histogram peaks and redistributing excess counts across all bins" },
          { id: "B", text: "Inverting pixel polarities" },
          { id: "C", text: "Discarding high-frequency Fourier components" },
          { id: "D", text: "Downsampling the image to 128x128" }
        ],
        correct_option_id: "A",
        explanation: "CLAHE clips local histogram peaks to a maximum threshold, preventing over-enhancement of noise in homogeneous regions."
      }
    ],
    previous_topic_slug: "m4-t2-windowing",
    next_topic_slug: "m4-t4-dithering-depth"
  },

  "m4-t4-dithering-depth": {
    id: "top-m4-t4",
    slug: "m4-t4-dithering-depth",
    title: "4. Dithering, False Contouring & Bit Depth",
    order_index: 4,
    co_tags: ["CO2"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-4", module_number: 4, title: "Operations in Intensity Space" },
    sections: [
      {
        id: "sec-m4t4-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Quantization Error & False Contouring",
        content_markdown: "When continuous medical attenuation signals are digitized into a finite number of discrete levels, quantization error is introduced. If insufficient bits are allocated (e.g. fewer than 8 bits / 256 levels), gradual anatomical gradients (such as smooth cerebral gray-to-white transitions or liver parenchyma) degenerate into visible discrete bands—a degradation termed False Contouring or Posterization.\n\nDithering is the intentional addition of low-amplitude pseudo-random noise or spatial error diffusion before quantization to break up banding artifacts into high-frequency spatial patterns that human vision naturally filters out.",
        formula_latex: "e(x,y) = f(x,y) - Q(f(x,y))",
        linked_diagram_id: "diag-dither-flow"
      },
      {
        id: "sec-m4t4-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth: Floyd-Steinberg Error Diffusion Algorithm",
        content_markdown: "The Floyd-Steinberg algorithm diffuses the quantization residual error e to neighboring unprocessed pixels using fractional spatial weights:\n\n```\n          [Current Pixel]   ➔   7/16 (Right: x+1, y)\n3/16 (Down-Left)  5/16 (Down)   1/16 (Down-Right: x+1, y+1)\n```\n\n| Technique | Computational Complexity | Visual Quality | Clinical Suitability |\n| :--- | :--- | :--- | :--- |\n| **Direct Truncation** | O(1) Zero cost | Severe false contour bands | Unacceptable for diagnostic viewing |\n| **Ordered Dithering (Bayer)** | O(1) Matrix lookup | Regular cross-hatch texture pattern | Limited (artifacts mimic mesh implants) |\n| **Floyd-Steinberg Error Diffusion** | O(N) Sequential pass | Natural blue-noise grain; no visible bands | Standard for low-bit display output |\n| **10-Bit / 12-Bit Native Display** | Zero quantization error | Perfectly smooth diagnostic gradients | Gold standard for mammography & PACS |\n\n**Exam Point:** Sum of Floyd-Steinberg error weights: 7/16 + 3/16 + 5/16 + 1/16 = 16/16 = 1.0 (strict energy conservation).",
        formula_latex: "\\sum w_{ij} = \\frac{7}{16} + \\frac{3}{16} + \\frac{5}{16} + \\frac{1}{16} = 1.0",
        linked_diagram_id: "diag-dither-flow"
      },
      {
        id: "sec-m4t4-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Quantization Step Size",
        content_markdown: "**Clinical Scenario:** A CT liver scan contains attenuation values spanning [-100 HU to +300 HU] (Total range Δ = 400 HU). Compare the quantization step size for an 8-bit buffer (256 levels) versus a 6-bit compressed channel (64 levels).\n\n**Calculations:**\n- **8-Bit Step Size:** q₈ = 400 HU / 256 = **1.56 HU per gray level** (below human contrast perception limit ~2 HU).\n- **6-Bit Step Size:** q₆ = 400 HU / 64 = **6.25 HU per gray level**.\n- **Diagnostic Consequence:** A 6.25 HU jump creates visible false contour steps in homogeneous liver parenchyma that can mimic hepatic steatosis boundaries.",
        formula_latex: null,
        linked_diagram_id: "diag-dither-flow"
      },
      {
        id: "sec-m4t4-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is 10-bit or 12-bit native display pipeline hardware mandatory for digital mammography review workstations?\n\n**Answer:** Microcalcifications in dense breast tissue frequently exhibit contrast variations of only a few luminance steps against surrounding fibroglandular parenchyma. 8-bit displays quantize subtle gradations into discrete blocks, causing microcalcification clusters to blend into background banding.",
        formula_latex: null,
        linked_diagram_id: "diag-dither-flow"
      }
    ],
    diagrams: [
      {
        id: "diag-dither-flow",
        title: "Quantization & Floyd-Steinberg Error Diffusion",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Input[High Bit-Depth Input Pixel] --> Quantizer[Threshold Quantizer]
    Quantizer --> OutPixel[Quantized Output Level]
    Quantizer --> ErrorCalc[Compute Residual Error: e = Input - Output]
    ErrorCalc --> Diffuse[Diffuse Error: 7/16, 3/16, 5/16, 1/16]
    Diffuse --> NextPixel[Add Residual to Adjacent Pixels]
    NextPixel --> Input
    style Input fill:#0077B6,color:#fff
    style ErrorCalc fill:#662D91,color:#fff
    style OutPixel fill:#B82662,color:#fff`,
        interactive_node_map: {
          "ErrorCalc": "Residual difference between high-precision scalar and display code.",
          "Diffuse": "Spreads rounding error across 4 neighboring unprocessed voxels."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m4-4",
        question_text: "What visual artifact occurs when smooth anatomical gradients are quantized with insufficient bit depth (e.g. 4 bits), creating stair-step bands?",
        co_tag: "CO2",
        options: [
          { id: "A", text: "False Contouring (Posterization)" },
          { id: "B", text: "Motion ghosting" },
          { id: "C", text: "Truncation ringing" },
          { id: "D", text: "Geometric pincushion distortion" }
        ],
        correct_option_id: "A",
        explanation: "False contouring occurs when coarse quantization turns smooth gradients into visible discrete boundary bands."
      }
    ],
    previous_topic_slug: "m4-t3-histograms",
    next_topic_slug: null
  }
};
