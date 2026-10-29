import DualPanelViewer, { TopicPayload } from "@/components/topic/DualPanelViewer";

// Accredited course topics repository
const TOPICS_DATA: Record<string, TopicPayload> = {
  "m1-t2-xray-physics-attenuation": {
    id: "top-m1-t2",
    slug: "m1-t2-xray-physics-attenuation",
    title: "Basic X-ray Physics and Attenuation",
    order_index: 2,
    co_tags: ["CO1"],
    read_time_minutes: 20,
    is_completed: false,
    module: {
      id: "mod-1",
      module_number: 1,
      title: "Medical Image Sources"
    },
    sections: [
      {
        id: "sec-1",
        section_number: 1,
        section_type: "objectives",
        title: "Learning Objectives",
        content_markdown: "By the end of this module topic, students will be able to:\n- Formulate the Beer-Lambert law of exponential photon attenuation in biological tissues.\n- Differentiate photoelectric absorption from Compton scattering interactions in diagnostic keV regimes.\n- Calculate the Half-Value Layer (HVL) and linear attenuation coefficients from transmission ratios.",
        formula_latex: "I(x) = I_0 \\, e^{-\\mu x}",
        linked_diagram_id: "diag-attenuation"
      },
      {
        id: "sec-2",
        section_number: 2,
        section_type: "overview",
        title: "Clinical Overview: Why Tissue Attenuation Matters",
        content_markdown: "All diagnostic projection radiography and CT imaging relies on differential photon attenuation. When an X-ray beam traverses patient anatomy, bone ($Z \\approx 13.8$) attenuates photons far more aggressively than muscle or fat ($Z \\approx 7.4$). This differential transmission casts the latent radiographic shadow recorded by the detector matrix.",
        formula_latex: null,
        linked_diagram_id: "diag-attenuation"
      },
      {
        id: "sec-3",
        section_number: 3,
        section_type: "detailed_math",
        title: "The Exponential Attenuation Law & Half-Value Layer (HVL)",
        content_markdown: "For a monochromatic photon beam traversing an absorber of thickness $x$ with linear attenuation coefficient $\\mu$ (units: $\\text{cm}^{-1}$), the transmitted beam intensity decreases exponentially according to the Beer-Lambert relation.\n\nThe Half-Value Layer (HVL) represents the precise thickness of material required to reduce beam intensity by exactly 50%. It serves as the primary metric of beam hardness and penetration capability.",
        formula_latex: "\\text{HVL} = \\frac{\\ln(2)}{\\mu} = \\frac{0.693}{\\mu}",
        linked_diagram_id: "diag-attenuation"
      },
      {
        id: "sec-4",
        section_number: 4,
        section_type: "worked_example",
        title: "Worked Clinical Example: HVL Calculation",
        content_markdown: "Problem: An incident 60 keV X-ray beam has an intensity $I_0 = 100\\%$. After traversing a 3.0 cm cortical bone segment with $\\mu = 0.528\\text{ cm}^{-1}$, compute:\n1. The transmitted intensity percentage $I(x)$.\n2. The Half-Value Layer (HVL) of cortical bone for this energy.\n\nSolution Step 1: Transmitted intensity:\n$I(3.0) = 100 \\times e^{-(0.528 \\times 3.0)} = 100 \\times e^{-1.584} \\approx 20.5\\%$.\n\nSolution Step 2: Half-Value Layer:\n$\\text{HVL} = \\frac{0.693}{0.528} = 1.312\\text{ cm}$. Exactly 1.31 cm of cortical bone absorbs half the incident 60 keV photons.",
        formula_latex: "I(3.0) = I_0 \\, e^{-(0.528 \\times 3.0)} \\approx 20.5\\% \\, I_0",
        linked_diagram_id: "diag-attenuation"
      },
      {
        id: "sec-5",
        section_number: 5,
        section_type: "common_pitfalls",
        title: "Common Misconceptions & Exam Traps",
        content_markdown: "- Confusing Linear Attenuation ($\\mu$) with Mass Attenuation ($\\mu / \\rho$): $\\mu$ depends on physical density and physical state (ice vs water vs steam), whereas $\\mu / \\rho$ is independent of density.\n- Polychromatic Beam Hardening: Real clinical X-ray tubes emit polychromatic spectra. As the beam penetrates tissue, lower-energy photons are preferentially absorbed, causing the effective mean energy of the surviving beam to increase.",
        formula_latex: null,
        linked_diagram_id: "diag-attenuation"
      }
    ],
    diagrams: [
      {
        id: "diag-attenuation",
        title: "Photon Transmission & Attenuation Pipeline",
        diagram_type: "mermaid",
        code_or_markup: `graph TD
    Tube[X-ray Tube Target: Polychromatic Photons] --> Filter[Al/Cu Beam Hardening Filter]
    Filter --> Incident[Incident Intensity: I0]
    Incident --> Tissue[Patient Tissue Layer: Thickness x, Linear Attenuation μ]
    Tissue --> PE[Photoelectric Absorption: Bound Electrons]
    Tissue --> CS[Compton Scattering: Incoherent Deflection]
    Tissue --> Transmitted[Transmitted Intensity: I = I0 * e^-μx]
    Transmitted --> Detector[Digital Flat Panel Detector]
    style Tissue fill:#0077B6,stroke:#0B2545,stroke-width:2px,color:#fff
    style PE fill:#662D91,stroke:#0B2545,color:#fff
    style CS fill:#B82662,stroke:#0B2545,color:#fff
    style Transmitted fill:#0077B6,stroke:#0B2545,color:#fff`,
        interactive_node_map: {
          "Tissue": "Patient tissue layer with linear attenuation coefficient μ (cm^-1).",
          "PE": "Photoelectric effect dominates at low diagnostic keV and high Z.",
          "CS": "Compton scattering produces secondary radiation and reduces image contrast.",
          "Transmitted": "Transmitted primary photons that form the clinical shadow projection."
        }
      }
    ],
    visual_assets: [
      {
        id: "asset-xray-1",
        title: "PA Chest Radiograph Attenuation Profile",
        storage_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        alt_text: "Posteroanterior (PA) chest radiograph illustrating high attenuation across ribs and spine versus air-filled lung parenchyma",
        license: "CC BY-SA 4.0",
        attribution: "NIH Clinical Center Open Dataset",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-1",
        question_text: "What interaction dominates X-ray photon attenuation in dense cortical bone at 40 keV?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Photoelectric absorption (due to high Z and lower energy)" },
          { id: "B", text: "Pair production" },
          { id: "C", text: "Photodisintegration" },
          { id: "D", text: "Coherent scattering only" }
        ],
        correct_option_id: "A",
        explanation: "Photoelectric absorption probability is proportional to Z^3 / E^3. At 40 keV in bone (Z ~ 13.8), photoelectric absorption is dominant over Compton scattering."
      },
      {
        id: "qc-2",
        question_text: "If a tissue has a linear attenuation coefficient μ = 0.3465 cm^-1, what is its Half-Value Layer (HVL)?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "1.0 cm" },
          { id: "B", text: "2.0 cm" },
          { id: "C", text: "0.5 cm" },
          { id: "D", text: "4.0 cm" }
        ],
        correct_option_id: "B",
        explanation: "HVL = ln(2) / μ = 0.693 / 0.3465 = 2.0 cm."
      },
      {
        id: "qc-3",
        question_text: "Why does beam hardening occur when polychromatic X-rays traverse a patient?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Low-energy photons are preferentially absorbed, increasing average beam energy" },
          { id: "B", text: "High-energy photons are accelerated by tissue molecules" },
          { id: "C", text: "Patient tissue undergoes nuclear excitation" },
          { id: "D", text: "The detector saturates with low energy photons" }
        ],
        correct_option_id: "A",
        explanation: "Because linear attenuation is higher for lower-energy photons, the low-energy spectrum is stripped away faster, shifting the mean energy of the surviving beam higher."
      }
    ],
    previous_topic_slug: "m1-t1-radiology-spectrum",
    next_topic_slug: "m1-t3-computed-tomography"
  },
  "m1-t1-radiology-spectrum": {
    id: "top-m1-t1",
    slug: "m1-t1-radiology-spectrum",
    title: "Radiology and the Electromagnetic Spectrum",
    order_index: 1,
    co_tags: ["CO1"],
    read_time_minutes: 15,
    is_completed: true,
    module: {
      id: "mod-1",
      module_number: 1,
      title: "Medical Image Sources"
    },
    sections: [
      {
        id: "sec-m1-1",
        section_number: 1,
        section_type: "objectives",
        title: "Learning Objectives",
        content_markdown: "- Classify medical imaging modalities across the electromagnetic spectrum.\n- Relate photon frequency, wavelength, and quantum energy via Planck's equation.\n- Distinguish ionizing modalities (CT, X-ray, Nuclear) from non-ionizing modalities (MRI, Ultrasound).",
        formula_latex: "E = h\\nu = \\frac{hc}{\\lambda}",
        linked_diagram_id: "diag-spectrum"
      },
      {
        id: "sec-m1-2",
        section_number: 2,
        section_type: "overview",
        title: "The Diagnostic Spectrum",
        content_markdown: "Medical imaging exploits distinct windows across the electromagnetic spectrum: from radio waves in MRI (64–128 MHz) to ultra-high energy gamma rays in PET (511 keV annihilation photons). Diagnostic X-rays occupy the 0.01 to 10 nm wavelength band.",
        formula_latex: null,
        linked_diagram_id: "diag-spectrum"
      }
    ],
    diagrams: [
      {
        id: "diag-spectrum",
        title: "Diagnostic Imaging Modalities across the EM Spectrum",
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Radio[Radio: MRI 64-128 MHz] --> Micro[Microwaves]
    Micro --> IR[Infrared]
    IR --> Visible[Optical Endoscopy]
    Visible --> UV[UV]
    UV --> XRay[X-rays: CT & Planar Radiography]
    XRay --> Gamma[Gamma Rays: SPECT & PET]
    style Radio fill:#662D91,stroke:#0B2545,color:#fff
    style XRay fill:#0077B6,stroke:#0B2545,color:#fff
    style Gamma fill:#B82662,stroke:#0B2545,color:#fff`
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-1",
        question_text: "Which of the following medical imaging modalities uses non-ionizing radiation?",
        co_tag: "CO1",
        options: [
          { id: "A", text: "Magnetic Resonance Imaging (MRI)" },
          { id: "B", text: "Computed Tomography (CT)" },
          { id: "C", text: "Planar Chest Radiography" },
          { id: "D", text: "Positron Emission Tomography (PET)" }
        ],
        correct_option_id: "A",
        explanation: "MRI relies on radiofrequency pulses and static magnetic fields, which lack the energy to ionize biological molecules."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: "m1-t2-xray-physics-attenuation"
  }
};

export default function TopicPage({
  params
}: {
  params: { moduleId: string; topicSlug: string };
}) {
  const topic = TOPICS_DATA[params.topicSlug] || TOPICS_DATA["m1-t2-xray-physics-attenuation"];

  return <DualPanelViewer topic={topic} />;
}
