/**
 * Medical Text & Image Processing (MTIP) Imaging Engine
 * Pure TypeScript high-performance clinical image processing primitives:
 * - Spatial convolution & 3x3/5x5 neighborhood extraction
 * - 256-bin Histogram & cumulative distribution
 * - Otsu's Between-Class Variance maximization
 * - Binary Morphological Operations (Erosion, Dilation, Opening, Closing)
 * - 2D Fast Fourier Transform (FFT) & frequency spectrum filtering
 * - MRI Spin-Echo Signal Equation simulation (TR, TE, T1, T2, PD)
 * - Window Width (WW) and Window Level (WL) piecewise mapping
 */

export interface NeighborhoodInspection {
  x: number;
  y: number;
  centerVal: number;
  grid: number[][]; // e.g. 3x3 pixel values
  kernel: number[][];
  products: number[][];
  sum: number;
  normalizedOutput: number;
}

export interface HistogramData {
  bins: number[]; // 256 integers
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  cdf: number[];
}

export interface RegionMeasurement {
  areaPixels: number;
  totalPixels: number;
  foregroundPercentage: number;
  centroidX: number;
  centroidY: number;
}

/**
 * Extract 256-bin grayscale histogram from ImageData
 */
export function computeHistogram(imgData: ImageData): HistogramData {
  const data = imgData.data;
  const bins = new Array(256).fill(0);
  let sum = 0;
  let min = 255;
  let max = 0;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    bins[gray]++;
    sum += gray;
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }

  const numPixels = imgData.width * imgData.height;
  const mean = sum / (numPixels || 1);

  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    varianceSum += (gray - mean) * (gray - mean);
  }
  const stdDev = Math.sqrt(varianceSum / (numPixels || 1));

  // Compute CDF
  const cdf = new Array(256).fill(0);
  let cum = 0;
  for (let i = 0; i < 256; i++) {
    cum += bins[i];
    cdf[i] = cum / (numPixels || 1);
  }

  return { bins, min, max, mean, stdDev, cdf };
}

/**
 * Computes Otsu's optimal threshold by maximizing between-class variance sigma_B^2(t)
 */
export function computeOtsuThreshold(histogram: number[], totalPixels: number): {
  threshold: number;
  maxVariance: number;
  variances: number[];
} {
  let sumTotal = 0;
  for (let i = 0; i < 256; i++) {
    sumTotal += i * histogram[i];
  }

  let weightBackground = 0;
  let sumBackground = 0;
  let maxVariance = 0;
  let threshold = 128;
  const variances: number[] = new Array(256).fill(0);

  for (let t = 0; t < 256; t++) {
    weightBackground += histogram[t];
    if (weightBackground === 0) continue;

    const weightForeground = totalPixels - weightBackground;
    if (weightForeground === 0) break;

    sumBackground += t * histogram[t];

    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sumTotal - sumBackground) / weightForeground;

    // Between-class variance
    const varianceBetween =
      weightBackground * weightForeground * (meanBackground - meanForeground) * (meanBackground - meanForeground);

    variances[t] = varianceBetween;

    if (varianceBetween > maxVariance) {
      maxVariance = varianceBetween;
      threshold = t;
    }
  }

  return { threshold, maxVariance, variances };
}

/**
 * Inspect 3x3 neighborhood around pixel (px, py) with a given convolution kernel
 */
export function inspectNeighborhood(
  imgData: ImageData,
  px: number,
  py: number,
  kernel: number[][] = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ],
  divisor: number = 1,
  bias: number = 0
): NeighborhoodInspection {
  const w = imgData.width;
  const h = imgData.height;
  const data = imgData.data;
  const kSize = kernel.length; // normally 3
  const half = Math.floor(kSize / 2);

  const grid: number[][] = [];
  const products: number[][] = [];
  let sum = 0;

  for (let ky = 0; ky < kSize; ky++) {
    const rowVals: number[] = [];
    const rowProds: number[] = [];
    for (let kx = 0; kx < kSize; kx++) {
      const ix = Math.min(Math.max(px + (kx - half), 0), w - 1);
      const iy = Math.min(Math.max(py + (ky - half), 0), h - 1);
      const idx = (iy * w + ix) * 4;
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
      rowVals.push(gray);

      const kVal = kernel[ky][kx];
      const prod = gray * kVal;
      rowProds.push(prod);
      sum += prod;
    }
    grid.push(rowVals);
    products.push(rowProds);
  }

  const centerIdx = (py * w + px) * 4;
  const centerVal = Math.round(0.299 * data[centerIdx] + 0.587 * data[centerIdx + 1] + 0.114 * data[centerIdx + 2]);
  const normalizedOutput = Math.min(Math.max(Math.round(sum / (divisor || 1) + bias), 0), 255);

  return {
    x: px,
    y: py,
    centerVal,
    grid,
    kernel,
    products,
    sum,
    normalizedOutput
  };
}

/**
 * Apply 2D Spatial Convolution with arbitrary kernel
 */
export function applyConvolution(
  src: ImageData,
  kernel: number[][],
  divisor: number = 1,
  bias: number = 0
): ImageData {
  const w = src.width;
  const h = src.height;
  const output = new ImageData(w, h);
  const srcData = src.data;
  const outData = output.data;

  const kSize = kernel.length;
  const half = Math.floor(kSize / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let ky = 0; ky < kSize; ky++) {
        const iy = Math.min(Math.max(y + ky - half, 0), h - 1);
        for (let kx = 0; kx < kSize; kx++) {
          const ix = Math.min(Math.max(x + kx - half, 0), w - 1);
          const idx = (iy * w + ix) * 4;
          const kVal = kernel[ky][kx];

          rSum += srcData[idx] * kVal;
          gSum += srcData[idx + 1] * kVal;
          bSum += srcData[idx + 2] * kVal;
        }
      }

      const outIdx = (y * w + x) * 4;
      outData[outIdx] = Math.min(Math.max(Math.round(rSum / divisor + bias), 0), 255);
      outData[outIdx + 1] = Math.min(Math.max(Math.round(gSum / divisor + bias), 0), 255);
      outData[outIdx + 2] = Math.min(Math.max(Math.round(bSum / divisor + bias), 0), 255);
      outData[outIdx + 3] = 255;
    }
  }

  return output;
}

/**
 * Apply Median Filter (ideal for Salt & Pepper detector impulse noise)
 */
export function applyMedianFilter(src: ImageData, radius: number = 1): ImageData {
  const w = src.width;
  const h = src.height;
  const output = new ImageData(w, h);
  const srcData = src.data;
  const outData = output.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const window: number[] = [];

      for (let dy = -radius; dy <= radius; dy++) {
        const iy = Math.min(Math.max(y + dy, 0), h - 1);
        for (let dx = -radius; dx <= radius; dx++) {
          const ix = Math.min(Math.max(x + dx, 0), w - 1);
          const idx = (iy * w + ix) * 4;
          const gray = Math.round(0.299 * srcData[idx] + 0.587 * srcData[idx + 1] + 0.114 * srcData[idx + 2]);
          window.push(gray);
        }
      }

      window.sort((a, b) => a - b);
      const median = window[Math.floor(window.length / 2)];

      const outIdx = (y * w + x) * 4;
      outData[outIdx] = median;
      outData[outIdx + 1] = median;
      outData[outIdx + 2] = median;
      outData[outIdx + 3] = 255;
    }
  }

  return output;
}

/**
 * Apply Thresholding (Binary Mask)
 */
export function applyThreshold(src: ImageData, threshold: number, invert: boolean = false): ImageData {
  const w = src.width;
  const h = src.height;
  const output = new ImageData(w, h);
  const srcData = src.data;
  const outData = output.data;

  for (let i = 0; i < srcData.length; i += 4) {
    const gray = Math.round(0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2]);
    let val = gray >= threshold ? 255 : 0;
    if (invert) val = 255 - val;

    outData[i] = val;
    outData[i + 1] = val;
    outData[i + 2] = val;
    outData[i + 3] = 255;
  }

  return output;
}

/**
 * Binary Morphology: Erosion
 */
export function applyErosion(src: ImageData, radius: number = 1): ImageData {
  const w = src.width;
  const h = src.height;
  const output = new ImageData(w, h);
  const srcData = src.data;
  const outData = output.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        const iy = Math.min(Math.max(y + dy, 0), h - 1);
        for (let dx = -radius; dx <= radius; dx++) {
          const ix = Math.min(Math.max(x + dx, 0), w - 1);
          const val = srcData[(iy * w + ix) * 4];
          if (val < minVal) minVal = val;
        }
      }
      const outIdx = (y * w + x) * 4;
      outData[outIdx] = minVal;
      outData[outIdx + 1] = minVal;
      outData[outIdx + 2] = minVal;
      outData[outIdx + 3] = 255;
    }
  }
  return output;
}

/**
 * Binary Morphology: Dilation
 */
export function applyDilation(src: ImageData, radius: number = 1): ImageData {
  const w = src.width;
  const h = src.height;
  const output = new ImageData(w, h);
  const srcData = src.data;
  const outData = output.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const iy = Math.min(Math.max(y + dy, 0), h - 1);
        for (let dx = -radius; dx <= radius; dx++) {
          const ix = Math.min(Math.max(x + dx, 0), w - 1);
          const val = srcData[(iy * w + ix) * 4];
          if (val > maxVal) maxVal = val;
        }
      }
      const outIdx = (y * w + x) * 4;
      outData[outIdx] = maxVal;
      outData[outIdx + 1] = maxVal;
      outData[outIdx + 2] = maxVal;
      outData[outIdx + 3] = 255;
    }
  }
  return output;
}

/**
 * Measure binary region area & centroid
 */
export function measureBinaryRegion(mask: ImageData): RegionMeasurement {
  const w = mask.width;
  const h = mask.height;
  const data = mask.data;
  let area = 0;
  let sumX = 0;
  let sumY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 127) {
        area++;
        sumX += x;
        sumY += y;
      }
    }
  }

  const totalPixels = w * h;
  return {
    areaPixels: area,
    totalPixels,
    foregroundPercentage: totalPixels > 0 ? (area / totalPixels) * 100 : 0,
    centroidX: area > 0 ? Math.round(sumX / area) : Math.round(w / 2),
    centroidY: area > 0 ? Math.round(sumY / area) : Math.round(h / 2)
  };
}

/**
 * CT Window Width / Level Piecewise linear transfer function
 * Inputs:
 * - huValue: Hounsfield unit (-1024 to +3071)
 * - windowCenter (WL): Hounsfield center (e.g. 40 for Brain, 400 for Bone, -600 for Lung)
 * - windowWidth (WW): Hounsfield span (e.g. 80 for Brain, 1500 for Bone)
 * Returns: 8-bit grayscale [0..255]
 */
export function ctWindowTransfer(huValue: number, windowCenter: number, windowWidth: number): number {
  const lower = windowCenter - windowWidth / 2;
  const upper = windowCenter + windowWidth / 2;

  if (huValue <= lower) return 0;
  if (huValue >= upper) return 255;
  return Math.round(((huValue - lower) / windowWidth) * 255);
}

/**
 * MRI Spin-Echo Signal Equation Simulation:
 * S = rho * (1 - exp(-TR / T1)) * exp(-TE / T2)
 */
export interface MRITissueParams {
  name: string;
  rho: number; // proton density [0..1]
  t1: number; // ms
  t2: number; // ms
}

export const MRI_TISSUES: Record<string, MRITissueParams> = {
  csf: { name: "Cerebrospinal Fluid (CSF)", rho: 1.0, t1: 4000, t2: 2000 },
  grayMatter: { name: "Gray Matter", rho: 0.85, t1: 950, t2: 100 },
  whiteMatter: { name: "White Matter", rho: 0.7, t1: 600, t2: 80 },
  fat: { name: "Adipose (Fat)", rho: 0.9, t1: 250, t2: 70 }
};

export function computeMRISignal(tissue: MRITissueParams, tr: number, te: number): number {
  const t1Term = 1 - Math.exp(-tr / tissue.t1);
  const t2Term = Math.exp(-te / tissue.t2);
  const signal = tissue.rho * t1Term * t2Term;
  return Math.min(Math.max(signal, 0), 1);
}

/**
 * Generate Python Bioimage Script from chained pipeline steps
 */
export interface PipelineStepConfig {
  id: string;
  type: "source" | "blur" | "threshold" | "morphology" | "measure";
  label: string;
  params: Record<string, any>;
}

export function generatePythonPipelineCode(steps: PipelineStepConfig[]): string {
  let py = `"""
Medical Text and Image Processing (AIDS 12605.1)
Bioimage Processing Pipeline (Python / OpenCV / SciPy)
Generated automatically by MTIP Platform
"""

import cv2
import numpy as np
from scipy import ndimage
import matplotlib.pyplot as plt

def run_clinical_pipeline(image_path: str):
    # 1. Load clinical DICOM / TIFF image in grayscale
    print(f"[1] Loading scan: {image_path}")
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        # Fallback synthetic phantom for demonstration
        img = np.zeros((256, 256), dtype=np.uint8)
        cv2.circle(img, (128, 128), 70, 180, -1)
        cv2.circle(img, (150, 110), 20, 240, -1)

    current = img.copy()
`;

  steps.forEach((step, idx) => {
    const stepNum = idx + 2;
    if (step.type === "blur") {
      const k = step.params.kernelSize || 5;
      const sigma = step.params.sigma || 1.2;
      py += `
    # [${stepNum}] Spatial Gaussian Denoising (k=${k}, sigma=${sigma})
    current = cv2.GaussianBlur(current, (${k}, ${k}), ${sigma})
`;
    } else if (step.type === "threshold") {
      if (step.params.method === "otsu") {
        py += `
    # [${stepNum}] Otsu Automatic Variance Thresholding
    val, current = cv2.threshold(current, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    print(f"Optimal Otsu Threshold calculated: {val:.2f}")
`;
      } else {
        const th = step.params.thresholdValue || 128;
        py += `
    # [${stepNum}] Manual Binary Segmentation (cutoff: ${th})
    _, current = cv2.threshold(current, ${th}, 255, cv2.THRESH_BINARY)
`;
      }
    } else if (step.type === "morphology") {
      const op = step.params.operation || "erode";
      const rad = step.params.radius || 3;
      const cvOp = op === "dilate" ? "cv2.MORPH_DILATE" : op === "open" ? "cv2.MORPH_OPEN" : op === "close" ? "cv2.MORPH_CLOSE" : "cv2.MORPH_ERODE";
      py += `
    # [${stepNum}] Morphological ${op.toUpperCase()} (Disk radius ${rad}px)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (${rad * 2 + 1}, ${rad * 2 + 1}))
    current = cv2.morphologyEx(current, ${cvOp}, kernel)
`;
    } else if (step.type === "measure") {
      py += `
    # [${stepNum}] Clinical Quantitative Morphology Measurements
    labeled, num_features = ndimage.label(current > 0)
    area = np.sum(current > 0)
    centroid = ndimage.center_of_mass(current > 0)
    print(f"=== Quantitative Assessment ===")
    print(f"Total Lesion/Tissue Area: {area} pixels")
    print(f"Calculated Centroid (Y, X): ({centroid[0]:.1f}, {centroid[1]:.1f})")
    print(f"Connected Morphological Components: {num_features}")
`;
    }
  });

  py += `
    # Display Result
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1); plt.title("Original Clinical Scan"); plt.imshow(img, cmap="gray")
    plt.subplot(1, 2, 2); plt.title("Pipeline Segmentation Result"); plt.imshow(current, cmap="gray")
    plt.tight_layout()
    plt.show()

    return current

if __name__ == "__main__":
    run_clinical_pipeline("sample_brain_ct.png")
`;

  return py;
}
