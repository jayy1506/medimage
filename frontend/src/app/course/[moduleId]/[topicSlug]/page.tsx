"use client";

import DualPanelViewer, { TopicPayload } from "@/components/topic/DualPanelViewer";
import { 
  TOPICS_DATA_REGISTRY, 
  ALL_MODULES, 
  QUICK_FORMULAS,
  STUDENT_NOTE_METADATA 
} from "@/data/curriculumData";

export default function TopicPage({
  params
}: {
  params: { moduleId: string; topicSlug: string };
}) {
  const { topicSlug, moduleId } = params;

  // 1. Direct registry lookup
  if (TOPICS_DATA_REGISTRY[topicSlug]) {
    return <DualPanelViewer topic={TOPICS_DATA_REGISTRY[topicSlug]} />;
  }

  // 2. Dynamic generation based on Shravani Farkade's study notes
  let matchedTopic: any = null;
  let matchedModule: any = null;

  for (const mod of ALL_MODULES) {
    const found = mod.topics.find((t) => t.slug === topicSlug);
    if (found) {
      matchedTopic = found;
      matchedModule = mod;
      break;
    }
  }

  // Fallback if completely unknown
  if (!matchedTopic) {
    matchedTopic = ALL_MODULES[0].topics[0];
    matchedModule = ALL_MODULES[0];
  }

  // Synthesize TopicPayload matching Concept → Example → Application Question
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
        title: `Concept: ${matchedTopic.title}`,
        content_markdown: `**Study Notes • Prepared for ${STUDENT_NOTE_METADATA.prepared_for} (Roll No. ${STUDENT_NOTE_METADATA.roll_no})**\n\nThis academic unit investigates foundational principles in **${matchedModule.title}**. Every diagnostic imaging algorithm follows a deterministic pipeline from physical signal generation to computational enhancement and diagnostic clinical decision-making.`,
        formula_latex: null,
        linked_diagram_id: "diag-auto"
      },
      {
        id: "sec-depth",
        section_number: 2,
        section_type: "detailed_math",
        title: "In-Depth Physics & Mathematical Formulations",
        content_markdown: `Key principles for **${matchedTopic.title}**:\n- **Mathematical Model:** Governed by accredited medical imaging equations and discrete sampling criteria.\n- **Signal Transformation:** Spatial and frequency domain operations maintain clinical diagnostic fidelity without introducing irreversible aliasing.\n- **Clinical Relevance:** Directly applied in digital radiography, CT reconstruction, MRI sequences, and PACS distribution.`,
        formula_latex: QUICK_FORMULAS[Math.min(matchedTopic.order_index - 1, QUICK_FORMULAS.length - 1)]?.formula || null,
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
        title: "Application Question & Verified Solution",
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
