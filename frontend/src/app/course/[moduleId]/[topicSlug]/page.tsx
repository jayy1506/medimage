import dynamic from "next/dynamic";
import type { TopicPayload } from "@/components/topic/DualPanelViewer";
import { TOPICS_DATA_REGISTRY, ALL_MODULES } from "@/data/curriculumData";

const DualPanelViewer = dynamic(
  () => import("@/components/topic/DualPanelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-adani-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Initializing Dual-Panel Clinical Study Suite...</p>
        </div>
      </div>
    )
  }
);


// Comprehensive mapping from short topic codes and slug aliases to registered registry keys
const CODE_TO_SLUG_MAP: Record<string, string> = {
  // Module 1
  "1.1": "m1-t1-radiology",
  "1.2": "m1-t2-electromagnetic-spectrum",
  "1.3": "m1-t3-xray-physics",
  "1.4": "m1-t4-attenuation-imaging",
  "1.5": "m1-t5-computed-tomography",
  "1.6": "m1-t6-mri-tomography",
  "1.7": "m1-t7-ultrasound",
  "1.8": "m1-t8-nuclear-medicine",
  "m1-1": "m1-t1-radiology",
  "m1-2": "m1-t2-electromagnetic-spectrum",
  "m1-3": "m1-t3-xray-physics",
  "m1-4": "m1-t4-attenuation-imaging",
  "m1-5": "m1-t5-computed-tomography",
  "m1-6": "m1-t6-mri-tomography",
  "m1-7": "m1-t7-ultrasound",
  "m1-8": "m1-t8-nuclear-medicine",

  // Module 2
  "2.1": "m2-t1-image-databases",
  "2.2": "m2-t2-intensity-operations",
  "2.3": "m2-t3-filter-operations",
  "2.4": "m2-t4-clinical-segmentation",
  "2.5": "m2-t5-spatial-transforms",
  "m2-1": "m2-t1-image-databases",
  "m2-2": "m2-t2-intensity-operations",
  "m2-3": "m2-t3-filter-operations",
  "m2-4": "m2-t4-clinical-segmentation",
  "m2-5": "m2-t5-spatial-transforms",

  // Module 3
  "3.1": "m3-t1-pixels-voxels",
  "3.2": "m3-t2-grayscale-color",
  "3.3": "m3-t3-file-formats",
  "3.4": "m3-t4-dicom-standard",
  "3.5": "m3-t5-quality-snr",

  // Module 4
  "4.1": "m4-t1-intensity-transform",
  "4.2": "m4-t2-windowing",
  "4.3": "m4-t3-histograms",
  "4.4": "m4-t4-dithering-depth",

  // Module 5
  "5.1": "m5-t1-filtering-operation",
  "5.2": "m5-t2-fourier-transform",
  "5.3": "m5-t3-segmentation-pipeline",
  "5.4": "m5-t4-roi-centroids",
  "5.5": "m5-t5-thresholding-otsu",
  "5.6": "m5-t6-region-growing",
  "5.7": "m5-t7-segmentation-evaluation",

  // Module 6
  "6.1": "m6-t1-discretization-artifacts",
  "6.2": "m6-t2-interpolation-regularization",
  "6.3": "m6-t3-translation-rotation",
  "6.4": "m6-t4-reformatting-mpr",
  "6.5": "m6-t5-projection-models",
  "6.6": "m6-t6-raycasting-volume",
  "6.7": "m6-t7-surface-rendering-marching-cubes"
};

export default function TopicPage({
  params
}: {
  params: { moduleId: string; topicSlug: string };
}) {
  const { moduleId, topicSlug } = params;

  // 1. Resolve canonical registry key from short code, alias, or direct slug
  const resolvedKey = CODE_TO_SLUG_MAP[topicSlug] || topicSlug;

  // 2. Direct lookup in TOPICS_DATA_REGISTRY for instant 0ms dual-panel load
  if (TOPICS_DATA_REGISTRY[resolvedKey]) {
    return <DualPanelViewer topic={TOPICS_DATA_REGISTRY[resolvedKey]} />;
  }

  // 3. Fallback resolution across modules
  let matchedTopic: any = null;
  let matchedModule: any = null;

  for (const mod of ALL_MODULES) {
    const found = mod.topics.find((t) => t.slug === resolvedKey || t.id === resolvedKey);
    if (found) {
      matchedTopic = found;
      matchedModule = mod;
      break;
    }
  }

  // Default to Module 1 Topic 1 if unmatched
  if (!matchedTopic) {
    matchedTopic = ALL_MODULES[0].topics[0];
    matchedModule = ALL_MODULES[0];
  }

  // Fallback payload with rich DualPanelViewer support
  const dynamicPayload: TopicPayload = {
    id: matchedTopic.id,
    slug: matchedTopic.slug,
    title: matchedTopic.title,
    order_index: matchedTopic.order_index,
    co_tags: matchedTopic.co_tags || ["CO1"],
    read_time_minutes: matchedTopic.read_time_minutes || 18,
    is_completed: false,
    module: {
      id: matchedModule.id,
      module_number: matchedModule.module_number,
      title: matchedModule.title
    },
    sections: [
      {
        id: "sec-concept",
        section_number: 1,
        section_type: "objectives",
        title: `Clinical Concept: ${matchedTopic.title}`,
        content_markdown: `**Institutional Course Notes • AIDS 12605.1**\n\nThis academic unit investigates foundational clinical principles in **${matchedModule.title}**. Every diagnostic imaging algorithm follows a deterministic pipeline from physical signal generation to computational enhancement and diagnostic clinical decision-making.`,
        formula_latex: null,
        linked_diagram_id: "diag-auto"
      },
      {
        id: "sec-depth",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth Physics & Mathematical Formulations",
        content_markdown: `Key principles for **${matchedTopic.title}**:\n- **Mathematical Model:** Governed by accredited medical imaging equations and discrete sampling criteria.\n- **Signal Transformation:** Spatial and frequency domain operations maintain clinical diagnostic fidelity without introducing irreversible aliasing.\n- **Clinical Relevance:** Directly applied in digital radiography, CT reconstruction, MRI sequences, and PACS distribution.`,
        formula_latex: null,
        linked_diagram_id: "diag-auto"
      },
      {
        id: "sec-example",
        section_number: 3,
        section_type: "worked_example",
        title: "Worked Clinical Example",
        content_markdown: `**Clinical Case:** In institutional hospital workflows, image analysis algorithms must preserve sharp tissue boundaries while attenuating high-frequency noise. Standardized protocols ensure diagnostic repeatability across diverse patient cohorts and scanner vendors.`,
        formula_latex: null,
        linked_diagram_id: "diag-auto"
      },
      {
        id: "sec-app-question",
        section_number: 4,
        section_type: "common_pitfalls",
        title: "Application Analysis & Clinical Solution",
        content_markdown: `**Question:** How does the physical or computational constraint in this unit directly impact patient diagnostic evaluation?\n\n**Answer:** Quantitative calibration and noise reduction ensure that clinical measurements (e.g. lesion dimensions, Hounsfield attenuation, or tissue velocity) represent true in vivo biological phenomena rather than acquisition artifacts.`,
        formula_latex: null,
        linked_diagram_id: "diag-auto"
      }
    ],
    diagrams: [
      {
        id: "diag-auto",
        title: `${matchedTopic.title} - Operational Architecture`,
        diagram_type: "mermaid",
        code_or_markup: `graph LR
    Input[Clinical Input Data] --> Transform[${matchedTopic.title}]
    Transform --> Evaluation[Clinical Diagnostic Metric]
    style Input fill:#0077B6,color:#fff
    style Transform fill:#662D91,color:#fff
    style Evaluation fill:#B82662,color:#fff`,
        interactive_node_map: {
          "Transform": "Primary algorithmic stage processing medical image matrices."
        }
      }
    ],
    visual_assets: [],
    quick_checks: [
      {
        id: `qc-${matchedTopic.id}`,
        question_text: `Which core principle governs ${matchedTopic.title}?`,
        co_tag: matchedTopic.co_tags?.[0] || "CO1",
        options: [
          { id: "A", text: "Physical signal preservation and quantitative accuracy" },
          { id: "B", text: "Random spatial truncation without normalization" },
          { id: "C", text: "Ignoring Nyquist sampling criteria" },
          { id: "D", text: "Lossy compression of primary diagnostic voxels" }
        ],
        correct_option_id: "A",
        explanation: "Preservation of physical signal relationships and quantitative accuracy is essential in medical imaging."
      }
    ],
    previous_topic_slug: null,
    next_topic_slug: null
  };

  return <DualPanelViewer topic={dynamicPayload} />;
}
