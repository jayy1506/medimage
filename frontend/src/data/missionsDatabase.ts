/**
 * Clinical Missions & Challenge Definitions
 * Versioned schema for interactive goal-based diagnostic labs.
 */

export interface MissionDefinition {
  id: string;
  version: string;
  moduleBadge: string;
  co: string;
  title: string;
  category: "windowing" | "segmentation" | "filtering" | "fourier";
  patientHistory: string;
  goal: string;
  hintLevels: string[];
  initialParams: Record<string, number>;
  paramBounds: Record<string, { min: number; max: number; step: number; label: string; unit?: string }>;
  idealTarget: Record<string, number>;
  tolerance: Record<string, number>;
  clinicalExplanation: string;
}

export const CLINICAL_MISSIONS: MissionDefinition[] = [
  {
    id: "mission-bone-window",
    version: "1.0",
    moduleBadge: "Module 4 • CO2, CO3",
    co: "CO3",
    title: "Mission 1: Calvarial Bone Fracture Delineation",
    category: "windowing",
    patientHistory: "Trauma patient with suspected hairline temporal bone fracture following high-impact collision.",
    goal: "Adjust the CT Window Level (WL) and Window Width (WW) so dense cortical bone and trabecular micro-architecture are clearly distinguishable without blooming artifacts.",
    hintLevels: [
      "Bone has high Hounsfield Units (+300 to +1500 HU). A standard soft-tissue window (+40 / 80) will be totally washed out.",
      "Set your Window Level (WL) high into the bone range (around 350 to 500 HU).",
      "Set Window Width (WW) wide (1200 to 1800 HU) to encompass both spongy cancellous bone and dense compact cortical bone."
    ],
    initialParams: {
      windowLevel: 40,
      windowWidth: 80
    },
    paramBounds: {
      windowLevel: { min: -1000, max: 1000, step: 10, label: "Window Level (WL)", unit: "HU" },
      windowWidth: { min: 20, max: 3000, step: 20, label: "Window Width (WW)", unit: "HU" }
    },
    idealTarget: {
      windowLevel: 400,
      windowWidth: 1500
    },
    tolerance: {
      windowLevel: 80,
      windowWidth: 250
    },
    clinicalExplanation:
      "Bone Window (WL: 400 HU, WW: 1500 HU) maps the range [-350 HU to +1150 HU] into visible grayscale. This suppresses soft-tissue brightness and reveals fine fracture lines."
  },
  {
    id: "mission-subdural-hematoma",
    version: "1.0",
    moduleBadge: "Module 4 • CO2, CO3",
    co: "CO2",
    title: "Mission 2: Acute Subdural Hematoma Contrast",
    category: "windowing",
    patientHistory: "Elderly patient presenting with acute neurological deficit. Non-contrast brain CT performed.",
    goal: "Tune Window Width & Level to maximize contrast difference between acute coagulated blood (+60 to +80 HU) and underlying gray matter (+35 to +40 HU).",
    hintLevels: [
      "Acute clotted extravasated blood has higher protein density than normal brain parenchyma (approx +70 HU vs +37 HU).",
      "You need a narrower window width to exaggerate subtle attenuation differences.",
      "Try Window Level around 50 to 75 HU and Window Width between 100 and 160 HU (Subdural window)."
    ],
    initialParams: {
      windowLevel: 40,
      windowWidth: 350
    },
    paramBounds: {
      windowLevel: { min: 0, max: 150, step: 1, label: "Window Level (WL)", unit: "HU" },
      windowWidth: { min: 40, max: 400, step: 5, label: "Window Width (WW)", unit: "HU" }
    },
    idealTarget: {
      windowLevel: 65,
      windowWidth: 130
    },
    tolerance: {
      windowLevel: 15,
      windowWidth: 35
    },
    clinicalExplanation:
      "The Subdural Window (WL: 65 HU, WW: 130 HU) emphasizes hyperdense crescentic acute extra-axial blood collections against the cerebral cortex."
  },
  {
    id: "mission-lung-emphysema",
    version: "1.0",
    moduleBadge: "Module 4 • CO2, CO3",
    co: "CO3",
    title: "Mission 3: Pulmonary Parenchyma & Bullae Isolation",
    category: "windowing",
    patientHistory: "Chronic smoker with severe shortness of breath. Chest HRCT scan acquired at deep inspiration.",
    goal: "Configure the chest CT window to evaluate pulmonary vessel arborization, interlobular septa, and emphysematous bullae (-950 HU) against inflated alveolar air (-1000 HU).",
    hintLevels: [
      "Lung parenchyma is primarily composed of air (-1000 HU) with delicate capillary blood supply.",
      "The Window Level must be heavily negative, centered deep in the negative Hounsfield range (approx -600 HU).",
      "Use an expansive Window Width (1400 to 1600 HU) to capture subtle parenchymal ground-glass opacity."
    ],
    initialParams: {
      windowLevel: 50,
      windowWidth: 350
    },
    paramBounds: {
      windowLevel: { min: -900, max: 100, step: 20, label: "Window Level (WL)", unit: "HU" },
      windowWidth: { min: 400, max: 2500, step: 50, label: "Window Width (WW)", unit: "HU" }
    },
    idealTarget: {
      windowLevel: -600,
      windowWidth: 1500
    },
    tolerance: {
      windowLevel: 90,
      windowWidth: 200
    },
    clinicalExplanation:
      "Lung Window (WL: -600 HU, WW: 1500 HU) displays the range [-1350 HU to +150 HU], highlighting bronchial walls and vascular trees while preserving emphysema margins."
  },
  {
    id: "mission-otsu-threshold",
    version: "1.0",
    moduleBadge: "Module 5 • CO3",
    co: "CO3",
    title: "Mission 4: Brain Tumor Contrast Segmentation",
    category: "segmentation",
    patientHistory: "T1-weighted contrast-enhanced MRI shows enhancing glioblastoma multiforme.",
    goal: "Optimize the binarization cutoff to segment the hyperintense tumor core while excluding surrounding vasogenic edema and non-enhancing skull structures.",
    hintLevels: [
      "Inspect the live histogram: look for the bimodal valley between background brain parenchyma and bright gadolinium uptake.",
      "Contrast enhancement typically produces intensities in the upper third of the 8-bit grayscale spectrum.",
      "Set the segmentation threshold between 165 and 185 to achieve optimal Dice overlap > 88%."
    ],
    initialParams: {
      threshold: 80
    },
    paramBounds: {
      threshold: { min: 10, max: 245, step: 1, label: "Segmentation Threshold (T)", unit: "Gray" }
    },
    idealTarget: {
      threshold: 172
    },
    tolerance: {
      threshold: 12
    },
    clinicalExplanation:
      "Thresholding at T=172 perfectly separates the hyperintense contrast-enhanced neovascular core from the lower-intensity necrotic center and vasogenic edema."
  },
  {
    id: "mission-fourier-periodic",
    version: "1.0",
    moduleBadge: "Module 5 • CO3",
    co: "CO3",
    title: "Mission 5: Periodic RF Moiré Stripe Suppression",
    category: "fourier",
    patientHistory: "MRI scanner RF shielding leak created high-frequency sinusoidal zebra-stripe artifact across axial brain slices.",
    goal: "Place Notch / Band-Reject filters on the frequency spikes in the 2D Fourier power spectrum to eliminate the periodic striped artifact without blurring diagnostic edges.",
    hintLevels: [
      "Periodic spatial stripes appear as bright symmetrical paired spike dots away from the DC center in the 2D Fourier spectrum.",
      "A spatial blur will destroy diagnostic resolution; frequency domain notch filtering precisely targets only the spike frequencies.",
      "Set Notch Radius to 8px and Notch Frequency Distance to 64px from the center."
    ],
    initialParams: {
      notchRadius: 2,
      notchFrequency: 20
    },
    paramBounds: {
      notchRadius: { min: 2, max: 24, step: 1, label: "Notch Rejection Radius", unit: "px" },
      notchFrequency: { min: 10, max: 120, step: 2, label: "Harmonic Spike Distance", unit: "px" }
    },
    idealTarget: {
      notchRadius: 8,
      notchFrequency: 64
    },
    tolerance: {
      notchRadius: 3,
      notchFrequency: 8
    },
    clinicalExplanation:
      "Periodic RF interference generates discrete Dirac delta harmonics in the frequency domain. Applying symmetrical notch rejection zero-masks only the offending frequency pair."
  }
];

/**
 * Client-Side Mission Scorer
 * Computes 0-100 score and 1-3 stars
 */
export function scoreMissionAttempt(
  mission: MissionDefinition,
  userParams: Record<string, number>,
  hintsUsedCount: number
): {
  score: number;
  stars: number;
  isPassed: boolean;
  feedback: string;
} {
  let totalError = 0;
  let paramCount = 0;

  for (const [key, target] of Object.entries(mission.idealTarget)) {
    const userVal = userParams[key] ?? target;
    const tol = mission.tolerance[key] || 1;
    const err = Math.abs(userVal - target) / tol;
    totalError += err;
    paramCount++;
  }

  const avgError = totalError / (paramCount || 1);
  // Base score decays exponentially with normalized error
  let baseScore = Math.max(0, Math.round(100 * Math.exp(-0.7 * avgError)));

  // Deduct small penalty for hints used
  const penalty = Math.min(hintsUsedCount * 5, 20);
  const finalScore = Math.max(0, baseScore - penalty);

  let stars = 0;
  if (finalScore >= 90) stars = 3;
  else if (finalScore >= 75) stars = 2;
  else if (finalScore >= 60) stars = 1;

  const isPassed = finalScore >= 75; // strict >75% rule

  let feedback = "Sub-optimal parameters. Check the clinical target guidelines and retry.";
  if (stars === 3) {
    feedback = "Exceptional clinical precision! Diagnostic contrast and target tissue visibility are maximized.";
  } else if (stars === 2) {
    feedback = "Good clinical diagnostic visibility achieved. Fine-tune slightly for 3-star mastery.";
  } else if (stars === 1) {
    feedback = "Borderline diagnostic visibility. Review the hints and adjust parameters closer to the physiological target.";
  }

  return {
    score: finalScore,
    stars,
    isPassed,
    feedback
  };
}
