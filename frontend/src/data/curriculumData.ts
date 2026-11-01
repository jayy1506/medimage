import { TopicPayload } from "@/components/topic/DualPanelViewer";
import { MODULES_2_TO_6_DATA } from "./modules2to6Data";
import { MODULES_4_TO_6_DATA } from "./modules4to6Data";
import { MODULES_5_TO_6_DATA } from "./modules5to6Data";
import { MODULES_6_DATA } from "./modules6Data";

export interface CurriculumTopic {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  co_tags: string[];
  read_time_minutes: number;
  is_completed?: boolean;
}

export interface CurriculumModule {
  id: string;
  module_number: number;
  title: string;
  description: string;
  theory_hours: number;
  co_tags: string[];
  topics_count: number;
  completed_topics_count: number;
  topics: CurriculumTopic[];
}

export const STUDENT_NOTE_METADATA = {
  title: "Medical Image Processing: Complete Study Notes",
  course_code: "AIDS 12605.1",
  university: "Adani University - Faculty of Engineering and Technology"
};

export const QUICK_FORMULAS = [
  { name: "Photon Energy", formula: "E = hf = \\frac{hc}{\\lambda}", notes: "Links photon frequency, wavelength, and quantum energy." },
  { name: "Larmor Frequency", formula: "f = \\left(\\frac{\\gamma}{2\\pi}\\right) B_0", notes: "42.58 MHz/T for hydrogen protons in MRI." },
  { name: "Beer–Lambert Law", formula: "I = I_0 \\, e^{-\\mu x}, \\quad \\text{HVL} = \\frac{0.693}{\\mu}", notes: "Exponential photon attenuation and half-value layer." },
  { name: "Hounsfield Unit (CT)", formula: "\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}", notes: "Air = -1000, Water = 0, Bone = +300 to +1000." },
  { name: "Ultrasound Pulse-Echo Depth", formula: "d = \\frac{c \\cdot t}{2}", notes: "Average sound speed c ≈ 1540 m/s in soft tissue." },
  { name: "Acoustic Reflection & Doppler", formula: "R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2, \\quad \\Delta f = \\frac{2 f_0 v \\cos\\theta}{c}", notes: "Z = ρc; reflection occurs at boundary mismatch." },
  { name: "Digital Pixel Size", formula: "\\text{Pixel Size} = \\frac{\\text{FOV}}{\\text{Matrix Size}}", notes: "e.g., 400 mm / 512 = 0.78 mm." },
  { name: "SNR Averaging Gain", formula: "\\text{SNR Gain} = \\sqrt{N}", notes: "Averaging N acquisitions doubles SNR by √N." },
  { name: "Windowing Range", formula: "\\text{Range} = \\left[\\text{WL} - \\frac{\\text{WW}}{2}, \\; \\text{WL} + \\frac{\\text{WW}}{2}\\right]", notes: "Maps clinical HU range to 8-bit monitor display." },
  { name: "Dice & Jaccard (IoU)", formula: "\\text{Dice} = \\frac{2\\,\\text{TP}}{2\\,\\text{TP} + \\text{FP} + \\text{FN}}, \\quad \\text{IoU} = \\frac{\\text{Dice}}{2 - \\text{Dice}}", notes: "Segmentation overlap evaluation metrics." },
  { name: "Nyquist Criterion", formula: "f_s \\ge 2 f_{\\max} \\iff \\Delta x \\le \\frac{1}{2 f_{\\max}}", notes: "At least 2 samples per smallest resolved structure to prevent aliasing." }
];

export const ALL_MODULES: CurriculumModule[] = [
  {
    id: "mod-1",
    module_number: 1,
    title: "Medical Image Sources",
    description: "Radiology modalities, electromagnetic spectrum, basic X-ray physics, attenuation & imaging, CT, MRI, ultrasound, nuclear medicine and molecular imaging.",
    theory_hours: 8,
    co_tags: ["CO1"],
    topics_count: 8,
    completed_topics_count: 0,
    topics: [
      { id: "m1-1", slug: "m1-t1-radiology", title: "1. Radiology Modalities & Physics", order_index: 1, co_tags: ["CO1"], read_time_minutes: 15, is_completed: false },
      { id: "m1-2", slug: "m1-t2-electromagnetic-spectrum", title: "2. The Electromagnetic Spectrum in Medicine", order_index: 2, co_tags: ["CO1"], read_time_minutes: 12, is_completed: false },
      { id: "m1-3", slug: "m1-t3-xray-physics", title: "3. Basic X-Ray Physics (Bremsstrahlung & Compton)", order_index: 3, co_tags: ["CO1"], read_time_minutes: 18, is_completed: false },
      { id: "m1-4", slug: "m1-t4-attenuation-imaging", title: "4. Attenuation & Exponential Imaging Laws", order_index: 4, co_tags: ["CO1"], read_time_minutes: 15, is_completed: false },
      { id: "m1-5", slug: "m1-t5-computed-tomography", title: "5. Computed Tomography (CT & Sinograms)", order_index: 5, co_tags: ["CO1", "CO4"], read_time_minutes: 22, is_completed: false },
      { id: "m1-6", slug: "m1-t6-mri-tomography", title: "6. Magnetic Resonance Tomography (MRI)", order_index: 6, co_tags: ["CO1"], read_time_minutes: 25, is_completed: false },
      { id: "m1-7", slug: "m1-t7-ultrasound", title: "7. Diagnostic Ultrasound & Acoustic Impedance", order_index: 7, co_tags: ["CO1"], read_time_minutes: 16, is_completed: false },
      { id: "m1-8", slug: "m1-t8-nuclear-medicine", title: "8. Nuclear Medicine & Molecular Imaging (SPECT/PET)", order_index: 8, co_tags: ["CO1"], read_time_minutes: 20, is_completed: false }
    ]
  },
  {
    id: "mod-2",
    module_number: 2,
    title: "Image Processing in Clinical Practice",
    description: "Clinical processing pipeline: image databases, PACS, intensity operations, filter operations, clinical segmentation, and spatial transforms.",
    theory_hours: 8,
    co_tags: ["CO2"],
    topics_count: 5,
    completed_topics_count: 0,
    topics: [
      { id: "m2-1", slug: "m2-t1-image-databases", title: "1. Image Databases & Clinical PACS Archiving", order_index: 1, co_tags: ["CO2"], read_time_minutes: 16, is_completed: false },
      { id: "m2-2", slug: "m2-t2-intensity-operations", title: "2. Point & Intensity Operations (LUTs & Gamma)", order_index: 2, co_tags: ["CO2"], read_time_minutes: 14, is_completed: false },
      { id: "m2-3", slug: "m2-t3-filter-operations", title: "3. Spatial Filter Operations & Convolution Kernels", order_index: 3, co_tags: ["CO2"], read_time_minutes: 20, is_completed: false },
      { id: "m2-4", slug: "m2-t4-clinical-segmentation", title: "4. Clinical Segmentation Strategies & U-Net", order_index: 4, co_tags: ["CO2"], read_time_minutes: 22, is_completed: false },
      { id: "m2-5", slug: "m2-t5-spatial-transforms", title: "5. Spatial Transforms & Clinical Registration", order_index: 5, co_tags: ["CO2", "CO3"], read_time_minutes: 18, is_completed: false }
    ]
  },
  {
    id: "mod-3",
    module_number: 3,
    title: "Image Representation",
    description: "Pixels and voxels, grayscale and color models, image file formats, DICOM Part 10 architecture, image quality, and SNR metrics.",
    theory_hours: 8,
    co_tags: ["CO2", "CO4"],
    topics_count: 5,
    completed_topics_count: 0,
    topics: [
      { id: "m3-1", slug: "m3-t1-pixels-voxels", title: "1. Pixels, Voxels & Partial Volume Averaging", order_index: 1, co_tags: ["CO2"], read_time_minutes: 15, is_completed: false },
      { id: "m3-2", slug: "m3-t2-grayscale-color", title: "2. Gray Scale & Color Representation (Pseudo-Color)", order_index: 2, co_tags: ["CO2"], read_time_minutes: 14, is_completed: false },
      { id: "m3-3", slug: "m3-t3-file-formats", title: "3. Medical File Formats (DICOM vs NIfTI vs PNG)", order_index: 3, co_tags: ["CO4"], read_time_minutes: 16, is_completed: false },
      { id: "m3-4", slug: "m3-t4-dicom-standard", title: "4. The DICOM Standard & Tag Dictionaries", order_index: 4, co_tags: ["CO2", "CO4"], read_time_minutes: 22, is_completed: false },
      { id: "m3-5", slug: "m3-t5-quality-snr", title: "5. Image Quality & Signal-to-Noise Ratio (SNR)", order_index: 5, co_tags: ["CO2"], read_time_minutes: 18, is_completed: false }
    ]
  },
  {
    id: "mod-4",
    module_number: 4,
    title: "Operations in Intensity Space",
    description: "Intensity transform functions, dynamic range, CT windowing algorithms, histograms, histogram equalization, dithering, and bit depth.",
    theory_hours: 7,
    co_tags: ["CO2"],
    topics_count: 4,
    completed_topics_count: 0,
    topics: [
      { id: "m4-1", slug: "m4-t1-intensity-transform", title: "1. Intensity Transform Function & Dynamic Range", order_index: 1, co_tags: ["CO2"], read_time_minutes: 15, is_completed: false },
      { id: "m4-2", slug: "m4-t2-windowing", title: "2. Clinical Windowing (Level, Width & Hounsfield Units)", order_index: 2, co_tags: ["CO2"], read_time_minutes: 20, is_completed: false },
      { id: "m4-3", slug: "m4-t3-histograms", title: "3. Histograms & Histogram Equalization (CDF)", order_index: 3, co_tags: ["CO2"], read_time_minutes: 22, is_completed: false },
      { id: "m4-4", slug: "m4-t4-dithering-depth", title: "4. Dithering, False Contouring & Bit Depth", order_index: 4, co_tags: ["CO2"], read_time_minutes: 16, is_completed: false }
    ]
  },
  {
    id: "mod-5",
    module_number: 5,
    title: "Filtering, Transformations and Segmentation",
    description: "Spatial and frequency domain filtering, 2D Fourier transform, k-space, segmentation pipelines, ROIs, centroids, Otsu thresholding, and Dice evaluation.",
    theory_hours: 7,
    co_tags: ["CO2", "CO3"],
    topics_count: 7,
    completed_topics_count: 0,
    topics: [
      { id: "m5-1", slug: "m5-t1-filtering-operation", title: "1. The Spatial Filtering Operation & Kernels", order_index: 1, co_tags: ["CO2"], read_time_minutes: 18, is_completed: false },
      { id: "m5-2", slug: "m5-t2-fourier-transform", title: "2. The 2D Fourier Transform & Convolution Theorem", order_index: 2, co_tags: ["CO3"], read_time_minutes: 24, is_completed: false },
      { id: "m5-3", slug: "m5-t3-segmentation-pipeline", title: "3. The Clinical Segmentation Pipeline", order_index: 3, co_tags: ["CO2"], read_time_minutes: 16, is_completed: false },
      { id: "m5-4", slug: "m5-t4-roi-centroids", title: "4. ROI Definition, Moments & Centroids", order_index: 4, co_tags: ["CO2"], read_time_minutes: 15, is_completed: false },
      { id: "m5-5", slug: "m5-t5-thresholding-otsu", title: "5. Global, Adaptive & Otsu's Thresholding", order_index: 5, co_tags: ["CO2"], read_time_minutes: 20, is_completed: false },
      { id: "m5-6", slug: "m5-t6-region-growing", title: "6. Region Growing & Boundary Leakage Control", order_index: 6, co_tags: ["CO2"], read_time_minutes: 16, is_completed: false },
      { id: "m5-7", slug: "m5-t7-segmentation-evaluation", title: "7. Evaluation Metrics: Dice, IoU & Hausdorff", order_index: 7, co_tags: ["CO2", "CO4"], read_time_minutes: 20, is_completed: false }
    ]
  },
  {
    id: "mod-6",
    module_number: 6,
    title: "Spatial Transforms",
    description: "Discretization, Nyquist sampling, interpolation, volume regularization, rigid body transforms, multiplanar reformatting (MPR, MIP), raycasting, and marching cubes.",
    theory_hours: 7,
    co_tags: ["CO3", "CO4"],
    topics_count: 7,
    completed_topics_count: 0,
    topics: [
      { id: "m6-1", slug: "m6-t1-discretization-artifacts", title: "1. Discretization, Nyquist Limit & Sampling Artifacts", order_index: 1, co_tags: ["CO3"], read_time_minutes: 18, is_completed: false },
      { id: "m6-2", slug: "m6-t2-interpolation-regularization", title: "2. Interpolation & Volume Regularization", order_index: 2, co_tags: ["CO3"], read_time_minutes: 20, is_completed: false },
      { id: "m6-3", slug: "m6-t3-translation-rotation", title: "3. Rigid Body Transforms (Translation & Rotation Matrices)", order_index: 3, co_tags: ["CO3"], read_time_minutes: 22, is_completed: false },
      { id: "m6-4", slug: "m6-t4-reformatting-mpr", title: "4. Multiplanar Reformatting (MPR, CPR, MIP, MinIP)", order_index: 4, co_tags: ["CO3"], read_time_minutes: 20, is_completed: false },
      { id: "m6-5", slug: "m6-t5-projection-models", title: "5. Orthogonal vs Perspective Projections & Viewpoints", order_index: 5, co_tags: ["CO3"], read_time_minutes: 16, is_completed: false },
      { id: "m6-6", slug: "m6-t6-raycasting-volume", title: "6. Raycasting & Direct Volume Rendering", order_index: 6, co_tags: ["CO3", "CO4"], read_time_minutes: 24, is_completed: false },
      { id: "m6-7", slug: "m6-t7-surface-rendering-marching-cubes", title: "7. Surface-Based Rendering & Marching Cubes Algorithm", order_index: 7, co_tags: ["CO3", "CO4"], read_time_minutes: 22, is_completed: false }
    ]
  }
];

export const TOPICS_DATA_REGISTRY: Record<string, TopicPayload> = {
  // Module 1 Topics
  "m1-t1-radiology": {
    id: "top-m1-t1",
    slug: "m1-t1-radiology",
    title: "1. Radiology Modalities & Physics",
    order_index: 1,
    co_tags: ["CO1"],
    read_time_minutes: 15,
    is_completed: false,
    video_url: "https://res.cloudinary.com/hknnfqfa/video/upload/v1793560211/Seeing_Inside_the_Body.mp4",
    video_title: "Seeing Inside the Human Body: Clinical Radiology Modalities",
    video_description: "An authoritative visual clinical masterclass exploring how ionizing and non-ionizing energy forms (X-ray, CT, MRI, Ultrasound) probe internal human anatomy non-invasively.",
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Clinical Radiology Fundamentals",
        content_markdown: "Radiology is the branch of medicine that uses imaging to diagnose and guide treatment of disease. Main modalities: projection radiography (X-ray), fluoroscopy, Computed Tomography (CT), Magnetic Resonance Imaging (MRI), Ultrasound (US) and Nuclear Medicine (SPECT/PET).\n\nModalities are split into ionizing (X-ray, CT, nuclear) and non-ionizing (MRI, US). Each modality measures a different physical property of tissue: X-ray/CT measure attenuation, MRI measures proton density and relaxation, US measures acoustic impedance mismatch, nuclear imaging measures radiotracer concentration.\n\nEvery modality answers one core question: how does a form of energy interact with tissue, and what can a detector measure afterwards? The clinical question decides the modality choice.",
        formula_latex: null,
        linked_diagram_id: "diag-modalities"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Comparative Modality Matrix",
        content_markdown: "| Modality | Energy Used | What it Measures | Best For | Main Limitation |\n| :--- | :--- | :--- | :--- | :--- |\n| **X-ray** | Ionizing X-rays | Attenuation (2D shadow) | Bones, chest | Structures overlap, radiation |\n| **CT** | Ionizing X-rays | Attenuation in 3D (HU) | Trauma, lungs, bleeding | Higher radiation dose |\n| **MRI** | Static field + RF waves | Proton density, T1, T2 | Brain, joints, soft tissue | Slow, implants contraindicated, cost |\n| **Ultrasound** | Sound waves (2–15 MHz) | Echoes at impedance changes | Fetus, heart, abdomen | Bone & air block sound waves |\n| **SPECT / PET**| Gamma photons from tracers | Tracer concentration (metabolism) | Tumours, metabolic activity | Low resolution, radiation dose |\n\n**Exam Point:** Ionizing modalities must strictly adhere to the ALARA principle (As Low As Reasonably Achievable). Non-ionizing modalities (MRI and ultrasound) are instead governed by implant safety criteria and acoustic power limits.",
        formula_latex: "\\text{ALARA Principle: Dose as Low as Reasonably Achievable}",
        linked_diagram_id: "diag-modalities"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Clinical Example",
        content_markdown: "**Clinical Scenario:** A chest X-ray is the initial first-line screening investigation for suspected lobar pneumonia due to rapid throughput and high bone-versus-air contrast. Conversely, brain MRI is the gold standard for suspected multiple sclerosis plaques due to exquisite soft-tissue contrast.",
        formula_latex: null,
        linked_diagram_id: "diag-modalities"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is ultrasound the undisputed imaging modality of choice for monitoring human fetal development during pregnancy?\n\n**Answer:** Ultrasound utilizes mechanical sound waves (non-ionizing radiation), presents zero teratogenic hazard to the fetus, operates in real-time for dynamic cardiac and fetal motion assessment, is portable and cost-effective, and provides high-resolution soft-tissue characterization in amniotic fluid.",
        formula_latex: null,
        linked_diagram_id: "diag-modalities"
      }
    ],
    diagrams: [
      {
        id: "diag-modalities",
        title: "Taxonomy of Diagnostic Imaging Modalities",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Energy[Energy Modalities] --> Ionizing[Ionizing Radiation: ALARA]
    Energy --> NonIonizing[Non-Ionizing Energy: Safe]
    Ionizing --> XR[Projection X-Ray: 2D Attenuation]
    Ionizing --> CT[Computed Tomography: 3D Hounsfield Units]
    Ionizing --> NM[Nuclear Medicine: PET/SPECT Tracers]
    NonIonizing --> MRI[MRI: Proton Density & Relaxation T1/T2]
    NonIonizing --> US[Ultrasound: Acoustic Impedance Mismatch]
    style Ionizing fill:#B82662,stroke:#0B2545,color:#fff
    style NonIonizing fill:#0077B6,stroke:#0B2545,color:#fff`,
        interactive_node_map: {
          "Ionizing": "Radiation with photon energy > 10 eV capable of ionizing atoms. Requires dose control.",
          "NonIonizing": "Employs radiofrequency pulses or mechanical acoustic pressure. Safe for fetal monitoring.",
          "CT": "Reconstructs volumetric 3D attenuation cross-sections from rotated projection angles."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t1",
        title: "Clinical Modalities & Diagnostic Taxonomy in Modern Radiology",
        storage_url: "/images/curriculum/m1/fig_1_1_radiology_modalities.png",
        alt_text: "Clinical Modalities & Diagnostic Taxonomy in Modern Radiology",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems (Open Access, Springer)",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-1",
        question_text: "Which imaging modality is governed by acoustic power limits and acoustic impedance mismatch?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Diagnostic Ultrasound" },
          { id: "B", text: "Computed Tomography" },
          { id: "C", text: "Single-Photon Emission CT (SPECT)" },
          { id: "D", text: "Planar Radiography" }
        ],
        correct_option_id: "A",
        explanation: "Ultrasound uses mechanical sound waves reflecting at acoustic impedance (Z = ρc) boundaries."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m1-t2-electromagnetic-spectrum"
  },

  "m1-t2-electromagnetic-spectrum": {
    id: "top-m1-t2",
    slug: "m1-t2-electromagnetic-spectrum",
    title: "2. The Electromagnetic Spectrum in Medicine",
    order_index: 2,
    co_tags: ["CO1"],
    read_time_minutes: 12,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Electromagnetic Radiation Fundamentals",
        content_markdown: "Electromagnetic radiation spans: radio waves → microwaves → infrared → visible light → ultraviolet → X-rays → gamma rays. Photon energy obeys Planck's law: $E = hf = \\frac{hc}{\\lambda}$. Higher frequency implies shorter wavelength and greater quantum energy.\n\nRadiation exceeding roughly 10 eV (ultraviolet and beyond) possesses sufficient photon energy to ionize atoms and break molecular bonds. Diagnostic X-rays operate at photon energies of 20–150 keV (wavelength approximately 0.01–0.1 nm). MRI utilizes radiofrequency (RF) waves, which are non-ionizing.",
        formula_latex: "E = hf = \\frac{hc}{\\lambda}, \\qquad \\lambda\\,[\\text{nm}] \\approx \\frac{1.24}{E\\,[\\text{keV}]}",
        linked_diagram_id: "diag-em-spectrum"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Photon Energy & Atomic Scale",
        content_markdown: "A 100 keV diagnostic X-ray photon has a wavelength $\\lambda \\approx 0.0124\\text{ nm}$, substantially smaller than atomic dimensions. This sub-atomic wavelength allows X-rays to penetrate human soft tissue without specular optical reflection.\n\n- **Below 10 eV (Radio to Visible):** Insufficient energy to liberate atomic orbital electrons. MRI exploits this: RF electromagnetic pulses flip proton nuclear spins harmlessly.\n- **Above 10 eV (UV, X-ray, Gamma):** Ionizing radiation that creates free radicals; patient dose must be audited.\n- **X-rays vs Gamma Rays:** The distinction is purely origin, not energy: X-rays originate from electron shell transitions and deceleration in a tube; gamma photons originate from atomic nuclear decay.",
        formula_latex: "\\lambda = \\frac{c}{f}, \\quad E = 1.24 / \\lambda",
        linked_diagram_id: "diag-em-spectrum"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Clinical Example: MRI RF vs X-ray Tube",
        content_markdown: "A 1.5 Tesla clinical MRI scanner transmits radiofrequency excitation pulses at $63.87\\text{ MHz}$ (photon energy $\\approx 2.6 \\times 10^{-7}\\text{ eV}$). In comparison, a diagnostic chest radiography tube operating at 100 kVp produces Bremsstrahlung photons up to $100\\text{ keV}$ ($100,000\\text{ eV}$).",
        formula_latex: null,
        linked_diagram_id: "diag-em-spectrum"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Calculate the Larmor precession frequency of hydrogen protons in a 3.0 Tesla research MRI scanner given the proton gyromagnetic ratio $\\gamma / 2\\pi = 42.58\\text{ MHz/T}$. Is this radiation ionizing?\n\n**Answer:**\n$$f = 42.58 \\times 3.0 = 127.74\\text{ MHz}$$\nThis frequency lies in the VHF radio wave band ($E \\approx 5.3 \\times 10^{-7}\\text{ eV} \\ll 10\\text{ eV}$), which is strictly non-ionizing.",
        formula_latex: "f = \\left(\\frac{\\gamma}{2\\pi}\\right) B_0 = 42.58 \\times 3.0 \\approx 127.74\\text{ MHz}",
        linked_diagram_id: "diag-em-spectrum"
      }
    ],
    diagrams: [
      {
        id: "diag-em-spectrum",
        title: "Diagnostic EM Spectrum & Ionization Threshold",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Radio[Radio: MRI ~64-128 MHz] --> Micro[Microwaves]
    Micro --> IR[Infrared: Thermography]
    IR --> Vis[Visible Light: Endoscopy]
    Vis -->|10 eV Ionization Threshold| UV[Ultraviolet]
    UV --> XR[X-Rays: CT & Plain Film ~20-150 keV]
    XR --> Gamma[Gamma Rays: PET/SPECT 140-511 keV]
    style Radio fill:#0077B6,color:#fff
    style XR fill:#B82662,color:#fff
    style Gamma fill:#662D91,color:#fff`,
        interactive_node_map: {
          "Radio": "Non-ionizing radiofrequency pulses interact with proton nuclear magnetic moments.",
          "XR": "Diagnostic X-rays produced by electron bombardment of tungsten targets.",
          "Gamma": "Monoenergetic photons emitted from nuclear radioactive decay."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t2-1",
        title: "The Electromagnetic Spectrum in Clinical Radiology",
        storage_url: "/images/curriculum/m1/fig_1_2_em_spectrum.png",
        alt_text: "The Electromagnetic Spectrum in Clinical Radiology",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t2-2",
        title: "Photon Energy vs. Radiation Quality Curve",
        storage_url: "/images/curriculum/m1/fig_1_2_photon_energy_curve.png",
        alt_text: "Photon Energy vs. Radiation Quality Curve",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-2",
        question_text: "What distinguishes X-rays from gamma rays of identical 140 keV energy?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Physical origin: X-rays from electron interactions, gamma from atomic nucleus" },
          { id: "B", text: "Wave propagation speed through a vacuum" },
          { id: "C", text: "Polarization and dielectric permittivity" },
          { id: "D", text: "Ionization ability in biological tissue" }
        ],
        correct_option_id: "A",
        explanation: "X-rays originate from electron interactions outside the nucleus; gamma photons originate from the nuclear core."
      }
    ],
    previous_topic_slug: "m1-t1-radiology",
    next_topic_slug: "m1-t3-xray-physics"
  },

  "m1-t3-xray-physics": {
    id: "top-m1-t3",
    slug: "m1-t3-xray-physics",
    title: "3. Basic X-Ray Physics (Bremsstrahlung & Compton)",
    order_index: 3,
    co_tags: ["CO1"],
    read_time_minutes: 18,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Generation & Physical Interactions",
        content_markdown: "X-rays are generated in an evacuated X-ray tube. A heated tungsten filament cathode emits electrons via thermionic emission. A large potential difference (kVp) accelerates electrons toward a rotating tungsten anode target.\n\nTwo physical processes produce X-rays upon impact: **Bremsstrahlung** (braking radiation resulting in a continuous spectrum) and **Characteristic radiation** (discrete spectral lines when outer electrons fill inner K-shell vacancies). Only ~1% of incident electron kinetic energy is converted to X-rays; ~99% dissipates as heat. **kVp** controls peak energy and contrast; **mAs** (tube current × exposure time) controls photon quantity, noise, and patient dose.",
        formula_latex: "\\text{mAs} = \\text{mA} \\times t_{\\text{exposure}}, \\quad E_{\\max} = e \\cdot V_{\\text{peak}}",
        linked_diagram_id: "diag-xray-tube"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Photoelectric Absorption vs Compton Scattering",
        content_markdown: "Two primary photon interactions determine diagnostic image formation:\n\n1. **Photoelectric Effect:** Dominates at lower photon energies (<50 keV) and high atomic numbers ($Z$). Probability scales approximately as $\\propto \\frac{Z^3}{E^3}$. Responsible for sharp subject contrast between bone ($Z \\approx 13.8$) and soft tissue ($Z \\approx 7.4$).\n2. **Compton Scattering:** Dominates at diagnostic energies >70 keV. Photons scatter off outer loosely bound electrons, changing direction and depositing partial energy. Compton scatter degrades image quality with non-diagnostic veil glare; anti-scatter grids positioned before digital flat-panel detectors (DR) absorb oblique scattered photons.",
        formula_latex: "P_{\\text{photoelectric}} \\propto \\frac{Z^3}{E^3}, \\quad P_{\\text{compton}} \\propto \\rho_e",
        linked_diagram_id: "diag-xray-tube"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Clinical Example: Mammography Tube Target",
        content_markdown: "Mammography imaging of delicate breast parenchyma employs a molybdenum ($Z=42$) or rhodium ($Z=45$) target anode combined with low kVp (25–32 kVp) to generate 17.5 keV and 19.6 keV characteristic lines, maximising photoelectric absorption contrast between microcalcifications and glandular tissue.",
        formula_latex: null,
        linked_diagram_id: "diag-xray-tube"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why does increasing tube potential (kVp) substantially reduce radiographic subject contrast?\n\n**Answer:** Higher-energy photons are predominantly governed by Compton scattering rather than photoelectric absorption. Compton interaction probability depends primarily on electron density (which differs minimally across human soft tissues) rather than $Z^3$. Consequently, differential tissue attenuation falls, reducing overall radiographic contrast.",
        formula_latex: null,
        linked_diagram_id: "diag-xray-tube"
      }
    ],
    diagrams: [
      {
        id: "diag-xray-tube",
        title: "X-Ray Production & Interaction Chain",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Cathode[Cathode Filament: Thermionic Emission] -->|High kVp Acceleration| Anode[Tungsten Anode Target: 99% Heat, 1% X-ray]
    Anode --> Filter[Al Filtration: Strips Soft Photons]
    Filter --> Patient[Patient Tissue Interaction]
    Patient -->|Low keV, High Z| PE[Photoelectric Effect: Contrast]
    Patient -->|High keV, Any Z| CS[Compton Scattering: Noise & Scatter]
    PE --> Grid[Anti-Scatter Grid]
    CS -.->|Oblique Rays Blocked| Grid
    Grid --> DR[Digital Flat-Panel Detector]
    style PE fill:#0077B6,color:#fff
    style CS fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Cathode": "Emits electrons through thermionic heating.",
          "Anode": "Produces Bremsstrahlung continuum and characteristic tungsten peaks.",
          "PE": "Primary physical mechanism generating diagnostic radiographic contrast."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t3-1",
        title: "X-ray Tube Geometry and Dual Generation Pathways",
        storage_url: "/images/curriculum/m1/fig_1_3_xray_tube_physics.png",
        alt_text: "X-ray Tube Geometry and Dual Generation Pathways",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t3-2",
        title: "Continuous Bremsstrahlung Emission Spectrum",
        storage_url: "/images/curriculum/m1/fig_1_3_bremsstrahlung_spectrum.png",
        alt_text: "Continuous Bremsstrahlung Emission Spectrum",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-3",
        question_text: "What percentage of electron kinetic energy is converted into diagnostic X-ray photons upon anode collision?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Approximately 1% (99% converted to thermal heat)" },
          { id: "B", text: "50% X-rays and 50% Bremsstrahlung" },
          { id: "C", text: "85% Photoelectric and 15% Scatter" },
          { id: "D", text: "100% due to energy conservation" }
        ],
        correct_option_id: "A",
        explanation: "Over 99% of kinetic energy is dissipated as heat in the tungsten lattice, requiring rotating anodes and liquid cooling."
      }
    ],
    previous_topic_slug: "m1-t2-electromagnetic-spectrum",
    next_topic_slug: "m1-t4-attenuation-imaging"
  },

  "m1-t4-attenuation-imaging": {
    id: "top-m1-t4",
    slug: "m1-t4-attenuation-imaging",
    title: "4. Attenuation & Exponential Imaging Laws",
    order_index: 4,
    co_tags: ["CO1"],
    read_time_minutes: 15,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: The Beer–Lambert Law of Attenuation",
        content_markdown: "As an incident X-ray beam traverses biological tissue, photon intensity decreases exponentially according to the Beer–Lambert Law:\n$$I = I_0 \\, e^{-\\mu x}$$\nwhere $I_0$ represents incident intensity, $x$ is absorber thickness, and $\\mu$ is the tissue's linear attenuation coefficient (units: $\\text{cm}^{-1}$).\n\nThe **Half-Value Layer (HVL)** represents the thickness required to reduce photon beam intensity by exactly 50%:\n$$\\text{HVL} = \\frac{\\ln 2}{\\mu} = \\frac{0.693}{\\mu}$$\nLinear attenuation coefficient $\\mu$ increases with physical density $\\rho$ and atomic number $Z$, and decreases with increasing photon energy.",
        formula_latex: "I = I_0 \\, e^{-\\mu x}, \\qquad \\text{HVL} = \\frac{0.693}{\\mu}",
        linked_diagram_id: "diag-beer-lambert"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Derivation, Mass Attenuation & Beam Hardening",
        content_markdown: "Consider an infinitesimal tissue slice $dx$. It removes a fixed fraction $\\mu \\cdot dx$ of incident photons: $dI / dx = -\\mu I$. Integrating over thickness $x$ yields $I(x) = I_0 e^{-\\mu x}$.\n\n- **Mass Attenuation Coefficient ($\\mu / \\rho$):** Dividing by physical density $\\rho$ yields mass attenuation in $\\text{cm}^2/\\text{g}$, removing dependency on whether a substance is solid, liquid, or gas.\n- **Polychromatic Beam Hardening:** Clinical tubes emit broad polychromatic spectra. Lower-energy photons are preferentially attenuated in superficial tissue layers, shifting the average energy of surviving photons higher (hardening). In CT, beam hardening causes central cupping artifacts and dark inter-petrous bone streaks.",
        formula_latex: "\\frac{\\mu}{\\rho} \\;\\left[\\frac{\\text{cm}^2}{\\text{g}}\\right], \\quad I(x) = \\int S(E)\\, e^{-\\mu(E)x}\\, dE",
        linked_diagram_id: "diag-beer-lambert"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Transmission Computation",
        content_markdown: "**Problem:** An incident monochromatic X-ray beam of $I_0 = 1000\\text{ units}$ passes through $5.0\\text{ cm}$ of soft tissue with linear attenuation coefficient $\\mu = 0.20\\text{ cm}^{-1}$. Find the transmitted intensity $I$ and the tissue's HVL.\n\n**Solution:**\n1. Transmitted intensity:\n$$I = 1000 \\times e^{-(0.20 \\times 5.0)} = 1000 \\times e^{-1.0} = 1000 \\times 0.36788 \\approx 368\\text{ units}$$\n2. Half-Value Layer:\n$$\\text{HVL} = \\frac{0.693}{0.20} = 3.465\\text{ cm}$$",
        formula_latex: "I = 1000 \\times e^{-1} \\approx 368\\text{ units}",
        linked_diagram_id: "diag-beer-lambert"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** After passing through 3 Half-Value Layers of absorber, what percentage of the incident beam intensity reaches the detector?\n\n**Answer:** Each HVL reduces the beam by half (factor of $0.5$). After 3 HVLs:\n$$\\text{Transmission} = \\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8} = 12.5\\%$$",
        formula_latex: "I_3 = I_0 \\left(\\frac{1}{2}\\right)^3 = 0.125 \\, I_0",
        linked_diagram_id: "diag-beer-lambert"
      }
    ],
    diagrams: [
      {
        id: "diag-beer-lambert",
        title: "Exponential Attenuation Curve & HVL Steps",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    I0[Incident Intensity: 100%] -->|1st HVL| H1[Transmission: 50%]
    H1 -->|2nd HVL| H2[Transmission: 25%]
    H2 -->|3rd HVL| H3[Transmission: 12.5%]
    H3 -->|4th HVL| H4[Transmission: 6.25%]
    style I0 fill:#0077B6,color:#fff
    style H1 fill:#0077B6,color:#fff
    style H2 fill:#662D91,color:#fff
    style H3 fill:#B82662,color:#fff`,
        interactive_node_map: {
          "I0": "Unattenuated primary beam entering patient skin surface.",
          "H1": "Thickness x = 0.693 / μ halves beam intensity.",
          "H3": "After 3 HVL, exactly 12.5% of incident photons survive."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t4-1",
        title: "Exponential Photon Attenuation and Half-Value Layer",
        storage_url: "/images/curriculum/m1/fig_1_4_beer_lambert_attenuation.png",
        alt_text: "Exponential Photon Attenuation and Half-Value Layer",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t4-2",
        title: "Contrast Agents and K-Edge Photoelectric Discontinuity",
        storage_url: "/images/curriculum/m1/fig_1_4_contrast_k_edge.png",
        alt_text: "Contrast Agents and K-Edge Discontinuity",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-4",
        question_text: "If biological tissue has μ = 0.3465 cm^-1, what is its Half-Value Layer?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "2.0 cm" },
          { id: "B", text: "1.0 cm" },
          { id: "C", text: "0.5 cm" },
          { id: "D", text: "4.0 cm" }
        ],
        correct_option_id: "A",
        explanation: "HVL = 0.693 / μ = 0.693 / 0.3465 = 2.0 cm."
      }
    ],
    previous_topic_slug: "m1-t3-xray-physics",
    next_topic_slug: "m1-t5-computed-tomography"
  },

  "m1-t5-computed-tomography": {
    id: "top-m1-t5",
    slug: "m1-t5-computed-tomography",
    title: "5. Computed Tomography (CT & Sinograms)",
    order_index: 5,
    co_tags: ["CO1", "CO4"],
    read_time_minutes: 22,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Radon Transform & Sinograms",
        content_markdown: "In Computed Tomography, an X-ray tube and arc detector array rotate continuously around the patient gantry, acquiring thousands of 1D projection attenuation profiles at angles $\\theta \\in [0, 2\\pi]$.\n\nThese projection profiles stacked as a function of detector displacement $s$ and rotation angle $\\theta$ form a **Sinogram** via the **Radon Transform**. In a sinogram, every single off-axis point in the patient traces a sinusoidal path. Tomographic reconstruction solves the mathematical inverse problem to recover the cross-sectional 2D spatial map $\\mu(x,y)$.",
        formula_latex: "p(s, \\theta) = \\mathcal{R}\\{\\mu(x,y)\\} = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} \\mu(x,y) \\, \\delta(x\\cos\\theta + y\\sin\\theta - s) \\, dx \\, dy",
        linked_diagram_id: "diag-ct-fbp"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Filtered Back Projection & Hounsfield Units",
        content_markdown: "Simple back projection smears attenuation values along ray angles, producing an unacceptable $1/r$ point-spread blur. **Filtered Back Projection (FBP)** applies a frequency-domain ramp filter $|\\omega|$ (Ram-Lak filter) to cancel $1/r$ blurring prior to angular integration.\n\nEvery reconstructed voxel is normalized into standardized **Hounsfield Units (HU)**:\n$$\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$\n\n**Standard Reference HU Scale:**\n- Air: $-1000\\text{ HU}$\n- Lung Parenchyma: $\\approx -600\\text{ HU}$\n- Fat: $\\approx -100\\text{ HU}$\n- Pure Water: $0\\text{ HU}$\n- Soft Tissue / Muscle: $+40\\text{ to }+60\\text{ HU}$\n- Acute Clotted Blood: $+50\\text{ to }+75\\text{ HU}$\n- Trabecular / Dense Cortical Bone: $+300\\text{ to }+1500\\text{ HU}$",
        formula_latex: "\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}",
        linked_diagram_id: "diag-ct-fbp"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: HU Calculation",
        content_markdown: "**Problem:** A suspected intracranial lesion voxel exhibits a linear attenuation coefficient $\\mu = 0.24\\text{ cm}^{-1}$. The calibrated water baseline is $\\mu_{\\text{water}} = 0.20\\text{ cm}^{-1}$. Calculate the voxel's Hounsfield Unit.\n\n**Solution:**\n$$\\text{HU} = 1000 \\times \\frac{0.24 - 0.20}{0.20} = 1000 \\times \\frac{0.04}{0.20} = +200\\text{ HU}$$\nInterpretation: Represents dense calcification or contrast-enhanced vasculature.",
        formula_latex: "\\text{HU} = 1000 \\times \\frac{0.04}{0.20} = +200\\text{ HU}",
        linked_diagram_id: "diag-ct-fbp"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** On non-contrast emergency head CT, how does an acute subarachnoid or epidural hemorrhage appear compared to normal brain parenchyma?\n\n**Answer:** Acute hemorrhage appears hyperdense (bright white) measuring $+50\\text{ to }+75\\text{ HU}$ due to concentrated hemoglobin protein density, contrasting sharply against normal gray/white brain matter ($+30\\text{ to }+40\\text{ HU}$).",
        formula_latex: null,
        linked_diagram_id: "diag-ct-fbp"
      }
    ],
    diagrams: [
      {
        id: "diag-ct-fbp",
        title: "CT Reconstruction Pipeline: Projections to HU",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Rot["Rotating Tube & Detector: Projections p(s,θ)"] --> Sino["Radon Transform: Sinogram Array"]
    Sino --> Ramp["Frequency Ramp Filter (High-Pass): Cancels 1/r Blur"]
    Ramp --> FBP["Filtered Back Projection: Angular Integration"]
    FBP --> Matrix["Attenuation Matrix μ(x,y)"]
    Matrix --> Scale["Calibrated Rescaling: HU = 1000 * (μ - μw)/μw"]
    Scale --> Vol["Volumetric CT Cross-Sections"]
    style Sino fill:#0077B6,color:#fff
    style Ramp fill:#662D91,color:#fff
    style Scale fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Sino": "Sinogram stores ray attenuation as a function of gantry angle θ.",
          "Ramp": "High-pass spatial frequency filter required to invert the Radon transform.",
          "Scale": "Converts physical cm^-1 attenuation to calibrated clinical Hounsfield Units."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t5-1",
        title: "CT Rotating Gantry Geometry and Slice Acquisition",
        storage_url: "/images/curriculum/m1/fig_1_5_ct_gantry_geometry.png",
        alt_text: "CT Rotating Gantry Geometry",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t5-2",
        title: "Radon Transform Sinogram & Filtered Backprojection",
        storage_url: "/images/curriculum/m1/fig_1_5_radon_transform_sinogram.png",
        alt_text: "Radon Transform Sinogram",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-5",
        question_text: "What is the calibrated Hounsfield Unit of pure water?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "0 HU" },
          { id: "B", text: "-1000 HU" },
          { id: "C", text: "+100 HU" },
          { id: "D", text: "+40 HU" }
        ],
        correct_option_id: "A",
        explanation: "By definition, pure water attenuation μ_water yields exactly 0 HU in the Hounsfield formula."
      }
    ],
    previous_topic_slug: "m1-t4-attenuation-imaging",
    next_topic_slug: "m1-t6-mri-tomography"
  },

  "m1-t6-mri-tomography": {
    id: "top-m1-t6",
    slug: "m1-t6-mri-tomography",
    title: "6. Magnetic Resonance Tomography (MRI)",
    order_index: 6,
    co_tags: ["CO1"],
    read_time_minutes: 25,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Nuclear Magnetic Resonance Physics",
        content_markdown: "Hydrogen protons ($^1\\text{H}$) possess an intrinsic quantum spin and magnetic dipole moment. When placed in a strong static external magnetic field $\\mathbf{B}_0$, spins precess at the **Larmor frequency**:\n$$\\omega_0 = \\gamma B_0, \\quad f_0 = \\left(\\frac{\\gamma}{2\\pi}\\right) B_0$$\nFor protons, $\\gamma / 2\\pi = 42.58\\text{ MHz/T}$.\n\nA net longitudinal magnetization $M_z$ forms along $\\mathbf{B}_0$. An RF pulse at the Larmor frequency tips magnetization into the transverse plane ($M_{xy}$), inducing an electrical voltage in the RF receiver coil as it precesses (Free Induction Decay).",
        formula_latex: "f_0 = \\left(\\frac{\\gamma}{2\\pi}\\right) B_0 = 42.58\\text{ MHz/T} \\times B_0",
        linked_diagram_id: "diag-mri-relax"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Relaxation Physics, TR, TE & Weighting",
        content_markdown: "Following RF excitation, two simultaneous relaxation processes occur:\n\n1. **T1 Relaxation (Spin-Lattice):** Exponential regrowth of longitudinal magnetization $M_z$ along $\\mathbf{B}_0$. $T_1$ is the time required to recover $\\approx 63\\%$ of equilibrium. Fat has short $T_1$; cerebrospinal fluid (CSF) has long $T_1$.\n2. **T2 Relaxation (Spin-Spin):** Exponential dephasing and decay of transverse magnetization $M_{xy}$. $T_2$ is the time to decay to $\\approx 37\\%$. Fluid has long $T_2$.\n\n**Sequence Weighting Decision Matrix:**\n| Weighting | Repetition Time (TR) | Echo Time (TE) | Bright Tissues | Dark Tissues |\n| :--- | :--- | :--- | :--- | :--- |\n| **T1-Weighted** | Short ($<600\\text{ ms}$) | Short ($<20\\text{ ms}$) | Fat, subacute blood | CSF, water, edema |\n| **T2-Weighted** | Long ($>2000\\text{ ms}$) | Long ($>80\\text{ ms}$) | CSF, fluid, edema | Cortical bone, ligaments |\n| **Proton Density**| Long ($>2000\\text{ ms}$) | Short ($<20\\text{ ms}$) | High proton density | Low proton density (air/bone) |\n\nSpatial localization is encoded using three orthogonal gradient coils: slice-selection gradient ($G_z$), phase-encoding gradient ($G_y$), and frequency-encoding gradient ($G_x$). Raw signals fill **k-space**, which is reconstructed via the 2D Inverse Fast Fourier Transform (2D IFFT).",
        formula_latex: "M_z(t) = M_0 \\left(1 - e^{-t/T_1}\\right), \\quad M_{xy}(t) = M_{xy}(0) \\, e^{-t/T_2}",
        linked_diagram_id: "diag-mri-relax"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Clinical Example: T1 vs T2 Brain MRI",
        content_markdown: "In a patient with suspected multiple sclerosis, periventricular demyelinating plaques appear conspicuously hyperintense (bright white) on T2/FLAIR sequences due to increased water content and prolonged $T_2$ relaxation, contrasting against suppressed normal white matter.",
        formula_latex: null,
        linked_diagram_id: "diag-mri-relax"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why is MRI preferred over CT for diagnosing knee anterior cruciate ligament (ACL) tears, and which patients are strictly contraindicated?\n\n**Answer:** MRI provides superior soft-tissue contrast resolution, directly resolving fibrous ligamentous architecture and synovial fluid without ionizing radiation. Absolute contraindications include cardiac pacemakers, ferromagnetic cerebral aneurysm clips, cochlear implants, and intraocular metal fragments due to missile effect and RF heating.",
        formula_latex: null,
        linked_diagram_id: "diag-mri-relax"
      }
    ],
    diagrams: [
      {
        id: "diag-mri-relax",
        title: "T1 Longitudinal Recovery vs T2 Transverse Decay",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    RF[90° RF Pulse at Larmor Frequency] --> Transverse[Transverse Magnetization Mxy]
    Transverse --> T1[T1 Spin-Lattice Recovery: Mz recovers to 63%]
    Transverse --> T2[T2 Spin-Spin Dephasing: Mxy decays to 37%]
    T1 --> KSpace[k-Space Raw Frequency Grid]
    T2 --> KSpace
    KSpace --> IFFT[2D Inverse Fast Fourier Transform]
    IFFT --> MRImage[Anatomical MRI Image]
    style T1 fill:#0077B6,color:#fff
    style T2 fill:#B82662,color:#fff`,
        interactive_node_map: {
          "RF": "Tips net magnetization into transverse plane.",
          "T1": "Longitudinal recovery governed by spin-lattice interactions.",
          "T2": "Transverse dephasing governed by molecular spin-spin interactions."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t6-1",
        title: "Net Magnetization Alignment in Static Field B0",
        storage_url: "/images/curriculum/m1/fig_1_6_mri_proton_spin.png",
        alt_text: "Net Magnetization Alignment in B0",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t6-2",
        title: "T1 Longitudinal Recovery and T2 Transverse Decay Curves",
        storage_url: "/images/curriculum/m1/fig_1_6_t1_t2_relaxation.png",
        alt_text: "T1 Recovery and T2 Decay Curves",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-6",
        question_text: "Which parameter combination produces strong T2-weighted MRI contrast?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Long TR (>2000 ms) and Long TE (>80 ms)" },
          { id: "B", text: "Short TR (<500 ms) and Short TE (<20 ms)" },
          { id: "C", text: "Long TR and Short TE" },
          { id: "D", text: "Short TR and Long TE" }
        ],
        correct_option_id: "A",
        explanation: "Long TR minimizes T1 influence while long TE accentuates differences in transverse T2 decay."
      }
    ],
    previous_topic_slug: "m1-t5-computed-tomography",
    next_topic_slug: "m1-t7-ultrasound"
  },

  "m1-t7-ultrasound": {
    id: "top-m1-t7",
    slug: "m1-t7-ultrasound",
    title: "7. Diagnostic Ultrasound & Acoustic Impedance",
    order_index: 7,
    co_tags: ["CO1"],
    read_time_minutes: 16,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Pulse-Echo Principle & Acoustic Impedance",
        content_markdown: "Medical ultrasound employs piezoelectric transducer crystals operating at 2–15 MHz. Transducers emit short acoustic pressure pulses into the body and listen for returning echoes (**pulse–echo principle**).\n\nEcho reflections occur at anatomical interfaces exhibiting a mismatch in **acoustic impedance** ($Z = \\rho \\cdot c$, where $\\rho$ is density and $c$ is speed of sound). Average acoustic speed in soft tissue is standardized as $c \\approx 1540\\text{ m/s}$. The depth $d$ of a reflector is calculated from round-trip time $t$:\n$$d = \\frac{c \\cdot t}{2}$$",
        formula_latex: "Z = \\rho \\cdot c, \\quad d = \\frac{c \\cdot t}{2} \\quad (c = 1540\\text{ m/s})",
        linked_diagram_id: "diag-ultrasound"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Reflection Fraction, Doppler Shift & Artifacts",
        content_markdown: "The intensity reflection coefficient $R$ at a normal boundary between two media of impedances $Z_1$ and $Z_2$ is:\n$$R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2$$\n\nAt a soft tissue-to-air interface, $R \\approx 99.9\\%$. This massive mismatch causes total acoustic reflection, explaining why aqueous acoustic coupling gel is mandatory to displace trapped air.\n\n**Doppler Shift Equation:**\n$$\\Delta f = \\frac{2 f_0 \\, v \\cos\\theta}{c}$$\nwhere $v$ is blood velocity, $f_0$ is carrier frequency, and $\\theta$ is the Doppler insonation angle.\n\n**Key Artifacts:**\n- **Acoustic Shadowing:** Dark anechoic bands behind highly attenuating calcified gallstones or cortical bone.\n- **Posterior Acoustic Enhancement:** Increased brightness behind low-attenuation fluid cysts.\n- **Speckle:** Granular noise caused by sub-resolution constructive/destructive wave interference.",
        formula_latex: "R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2, \\quad \\Delta f = \\frac{2 f_0 v \\cos\\theta}{c}",
        linked_diagram_id: "diag-ultrasound"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example: Reflector Depth",
        content_markdown: "**Problem:** An ultrasound echo from a hepatic lesion capsule returns to the transducer probe exactly $130\\;\\mu\\text{s}$ after pulse emission. Compute the lesion depth.\n\n**Solution:**\n$$d = \\frac{c \\cdot t}{2} = \\frac{1540\\text{ m/s} \\times 130 \\times 10^{-6}\\text{ s}}{2} = \\frac{0.2002}{2} = 0.1001\\text{ m} = 10.0\\text{ cm}$$",
        formula_latex: "d = \\frac{1540 \\times 130 \\times 10^{-6}}{2} = 0.10\\text{ m} = 10.0\\text{ cm}",
        linked_diagram_id: "diag-ultrasound"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why are 10–15 MHz probes chosen for superficial thyroid exams while 3.5 MHz curved array probes are used for adult abdominal liver exams?\n\n**Answer:** Acoustic attenuation in tissue increases linearly with frequency ($\\approx 0.5\\text{ dB/cm/MHz}$). High frequencies (12 MHz) yield short wavelengths ($\\lambda \\approx 0.13\\text{ mm}$) for exquisite superficial spatial resolution but suffer severe shallow attenuation. Low frequencies (3.5 MHz) penetrate deep into abdominal viscera at the cost of coarser axial resolution.",
        formula_latex: null,
        linked_diagram_id: "diag-ultrasound"
      }
    ],
    diagrams: [
      {
        id: "diag-ultrasound",
        title: "Ultrasound Pulse-Echo & Doppler Workflow",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Crystal[Piezoelectric Crystal: 2-15 MHz] -->|Transmit Acoustic Wave| Gel[Acoustic Coupling Gel: Eliminates Air]
    Gel --> Tissue[Patient Soft Tissue: c ≈ 1540 m/s]
    Tissue -->|Acoustic Impedance Mismatch Z2-Z1| Echo[Reflected Echo Signals]
    Tissue -->|Moving RBCs: Doppler Shift| Flow[Doppler Frequency Δf]
    Echo --> Crystal
    Flow --> Doppler[Color Doppler Velocity Map]
    Crystal --> Display[B-Mode Brightness Image d = ct/2]
    style Crystal fill:#0077B6,color:#fff
    style Display fill:#662D91,color:#fff`,
        interactive_node_map: {
          "Crystal": "Converts voltage pulses into mechanical vibrations and vice versa.",
          "Gel": "Mandatory coupling medium eliminating 99.9% reflection at skin-air interface.",
          "Display": "Maps round-trip time t into spatial depth coordinates."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t7-1",
        title: "Piezoelectric Transducer Construction & Acoustic Reflection",
        storage_url: "/images/curriculum/m1/fig_1_7_piezoelectric_transducer.png",
        alt_text: "Piezoelectric Transducer Construction",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t7-2",
        title: "Real-time B-mode, M-mode, and Color Doppler Ultrasound",
        storage_url: "/images/curriculum/m1/fig_1_7_ultrasound_modes_doppler.png",
        alt_text: "Ultrasound Modes and Color Doppler",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-7",
        question_text: "What causes acoustic shadowing behind a calcified kidney stone?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Nearly complete acoustic reflection and absorption by dense stone, blocking deeper sound" },
          { id: "B", text: "Destructive phase cancellation from moving red blood cells" },
          { id: "C", text: "Refraction through fluid-filled renal parenchyma" },
          { id: "D", text: "Electronic gain saturation in the time-gain compensation (TGC) circuit" }
        ],
        correct_option_id: "A",
        explanation: "Dense calcium creates high reflection and attenuation, casting an anechoic black shadow directly posterior to the stone."
      }
    ],
    previous_topic_slug: "m1-t6-mri-tomography",
    next_topic_slug: "m1-t8-nuclear-medicine"
  },

  "m1-t8-nuclear-medicine": {
    id: "top-m1-t8",
    slug: "m1-t8-nuclear-medicine",
    title: "8. Nuclear Medicine & Molecular Imaging (SPECT/PET)",
    order_index: 8,
    co_tags: ["CO1"],
    read_time_minutes: 20,
    is_completed: false,
    module: { id: "mod-1", module_number: 1, title: "Medical Image Sources" },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Concept: Physiological & Molecular Imaging",
        content_markdown: "Nuclear medicine administers a targeted radiopharmaceutical (radiotracer). Detectors record emitted radiation outside the patient, visualizing **physiological function and metabolism** rather than anatomical morphology.\n\n- **Gamma Camera:** Employs a multi-hole lead collimator, a large NaI(Tl) scintillation crystal, and an array of photomultiplier tubes (PMTs).\n- **SPECT (Single-Photon Emission CT):** Rotates gamma camera heads to acquire 3D functional data using single-photon radionuclides such as Technetium-99m ($^{99m}\\text{Tc}$, $140\\text{ keV}$, $T_{1/2} = 6.0\\text{ hours}$).\n- **PET (Positron Emission Tomography):** Uses positron-emitting isotopes like Fluorine-18 ($^{18}\\text{F}$, $T_{1/2} \\approx 110\\text{ min}$). A positron travels <1 mm, annihilating with an electron to produce two collinear $511\\text{ keV}$ gamma photons emitted $180^\\circ$ apart, recorded via electronic coincidence detection without mechanical lead collimators.",
        formula_latex: "N(t) = N_0 \\, e^{-\\lambda t}, \\quad \\lambda = \\frac{0.693}{T_{1/2}}",
        linked_diagram_id: "diag-pet-spect"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "detailed_math",
        title: "In Depth: Comparative Matrix & SUV Quantification",
        content_markdown: "| Parameter | SPECT | PET |\n| :--- | :--- | :--- |\n| **Photon Emission** | Single gamma photon (e.g. $140\\text{ keV}$ for $^{99m}\\text{Tc}$) | Two collinear $511\\text{ keV}$ photons ($180^\\circ$ opposite) |\n| **Collimation** | Physical lead collimator (discards >99.9% photons) | Electronic coincidence timing window (no lead collimator) |\n| **Sensitivity & Resolution** | Lower sensitivity ($\sim 10^{-4}$), $8\\text{--}12\\text{ mm}$ res | High sensitivity ($\sim 10^{-2}$), $4\\text{--}6\\text{ mm}$ res |\n| **Standard Tracer** | $^{99m}\\text{Tc}$-MDP (bone), $^{99m}\\text{Tc}$-sestamibi (heart) | $^{18}\\text{F}$-FDG (Fluorodeoxyglucose) |\n\n**Standardized Uptake Value (SUV):**\n$$\\text{SUV} = \\frac{\\text{Tissue Activity Concentration } [\\text{kBq/mL}]}{\\text{Injected Radiotracer Dose } [\\text{kBq}] \\, / \\, \\text{Patient Body Weight } [\\text{g}]}$$\nSUV provides calibrated, semi-quantitative metrics of metabolic glucose avidity in malignant oncology.",
        formula_latex: "\\text{SUV} = \\frac{C_{\\text{tissue}}}{D_{\\text{injected}} / \\text{Weight}}",
        linked_diagram_id: "diag-pet-spect"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "worked_example",
        title: "Clinical Example: $^{18}\\text{F}$-FDG PET Oncology",
        content_markdown: "Malignant primary tumors and metastatic lymph nodes exhibit accelerated aerobic glycolysis (Warburg effect) and overexpress GLUT-1 transporters. Following intravenous $^{18}\\text{F}$-FDG administration, tumors avidly trap phosphorylated FDG-6-phosphate, appearing as intense focal hypermetabolic 'hot spots' with $\\text{SUV}_{\\max} > 5.0$.",
        formula_latex: null,
        linked_diagram_id: "diag-pet-spect"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Question & Verified Solution",
        content_markdown: "**Question:** Why are modern PET scanners almost universally built as hybrid PET/CT or PET/MRI systems rather than standalone PET units?\n\n**Answer:** While PET exhibits remarkable picomolar metabolic sensitivity, its spatial resolution is relatively coarse ($4\\text{--}6\\text{ mm}$) and anatomical landmarks are indistinct. Co-registered CT provides instantaneous sub-millimeter anatomical localization of PET avidity and yields a quantitative tissue attenuation map for patient photon attenuation correction.",
        formula_latex: null,
        linked_diagram_id: "diag-pet-spect"
      }
    ],
    diagrams: [
      {
        id: "diag-pet-spect",
        title: "Positron Annihilation & Coincidence Detection",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    F18[18F Nucleus Decay] -->|Positron e+| Ann[Annihilation with Electron e-]
    Ann -->|511 keV Photon 180° East| Det1[Scintillator Detector Array A]
    Ann -->|511 keV Photon 180° West| Det2[Scintillator Detector Array B]
    Det1 --> LOR[Coincidence Timing Circuit: Line of Response]
    Det2 --> LOR
    LOR --> PETImg[3D Reconstructed Metabolic Map]
    style F18 fill:#662D91,color:#fff
    style Ann fill:#B82662,color:#fff
    style LOR fill:#0077B6,color:#fff`,
        interactive_node_map: {
          "F18": "Positron emitter with half-life of 110 minutes.",
          "Ann": "Converts mass to pure photon energy: E = mc^2 yielding two 511 keV photons.",
          "LOR": "Line of Response defined electronically without absorbing collimators."
        }
      }
    ],
    visual_assets: [
      {
        id: "vis-m1-t8-1",
        title: "SPECT Collimated Gamma Camera Architecture",
        storage_url: "/images/curriculum/m1/fig_1_8_spect_gamma_camera.png",
        alt_text: "SPECT Gamma Camera Architecture",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t8-2",
        title: "PET 511 keV Positron Annihilation Coincidence Detection",
        storage_url: "/images/curriculum/m1/fig_1_8_pet_coincidence_annihilation.png",
        alt_text: "PET 511 keV Coincidence Detection",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-8",
        question_text: "What energy is carried by the two collinear photons in a PET annihilation event?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Exactly 511 keV each" },
          { id: "B", text: "140 keV each" },
          { id: "C", text: "63.9 MHz" },
          { id: "D", text: "1.24 keV" }
        ],
        correct_option_id: "A",
        explanation: "Electron and positron rest mass (511 keV each) converts entirely into two 511 keV photons emitted 180° apart."
      }
    ],
    previous_topic_slug: "m1-t7-ultrasound",
    next_topic_slug: "m2-t1-image-databases"
  },
  ...MODULES_2_TO_6_DATA,
  ...MODULES_4_TO_6_DATA,
  ...MODULES_5_TO_6_DATA,
  ...MODULES_6_DATA
};
