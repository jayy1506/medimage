"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FilterType = "lowpass" | "highpass" | "bandreject";
type FilterProfile = "ideal" | "butterworth" | "gaussian";

const SIZE = 128;

function fft1D(real: Float64Array, imaginary: Float64Array, inverse: boolean) {
  const length = real.length;
  let reversed = 0;

  for (let i = 1; i < length; i++) {
    let bit = length >> 1;
    while (reversed & bit) {
      reversed ^= bit;
      bit >>= 1;
    }
    reversed ^= bit;
    if (i < reversed) {
      [real[i], real[reversed]] = [real[reversed], real[i]];
      [imaginary[i], imaginary[reversed]] = [imaginary[reversed], imaginary[i]];
    }
  }

  for (let blockSize = 2; blockSize <= length; blockSize *= 2) {
    const angle = (inverse ? 2 : -2) * Math.PI / blockSize;
    const rootReal = Math.cos(angle);
    const rootImaginary = Math.sin(angle);
    const halfBlock = blockSize / 2;

    for (let start = 0; start < length; start += blockSize) {
      let weightReal = 1;
      let weightImaginary = 0;
      for (let offset = 0; offset < halfBlock; offset++) {
        const even = start + offset;
        const odd = even + halfBlock;
        const productReal =
          weightReal * real[odd] - weightImaginary * imaginary[odd];
        const productImaginary =
          weightReal * imaginary[odd] + weightImaginary * real[odd];
        real[odd] = real[even] - productReal;
        imaginary[odd] = imaginary[even] - productImaginary;
        real[even] += productReal;
        imaginary[even] += productImaginary;

        const nextWeightReal =
          weightReal * rootReal - weightImaginary * rootImaginary;
        weightImaginary =
          weightReal * rootImaginary + weightImaginary * rootReal;
        weightReal = nextWeightReal;
      }
    }
  }

  if (inverse) {
    for (let i = 0; i < length; i++) {
      real[i] /= length;
      imaginary[i] /= length;
    }
  }
}

function fft2D(
  real: Float64Array,
  imaginary: Float64Array,
  size: number,
  inverse: boolean
) {
  const lineReal = new Float64Array(size);
  const lineImaginary = new Float64Array(size);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * size;
    for (let x = 0; x < size; x++) {
      lineReal[x] = real[rowOffset + x];
      lineImaginary[x] = imaginary[rowOffset + x];
    }
    fft1D(lineReal, lineImaginary, inverse);
    for (let x = 0; x < size; x++) {
      real[rowOffset + x] = lineReal[x];
      imaginary[rowOffset + x] = lineImaginary[x];
    }
  }

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const index = y * size + x;
      lineReal[y] = real[index];
      lineImaginary[y] = imaginary[index];
    }
    fft1D(lineReal, lineImaginary, inverse);
    for (let y = 0; y < size; y++) {
      const index = y * size + x;
      real[index] = lineReal[y];
      imaginary[index] = lineImaginary[y];
    }
  }
}

function filterResponse(
  distance: number,
  radius: number,
  type: FilterType,
  profile: FilterProfile
) {
  if (type === "bandreject") {
    const bandWidth = Math.max(2, radius * 0.25);
    const bandDistance = Math.abs(distance - radius);
    if (profile === "ideal") return bandDistance <= bandWidth ? 0 : 1;
    if (profile === "gaussian") {
      return 1 - Math.exp(-(bandDistance * bandDistance) / (2 * bandWidth * bandWidth));
    }
    const ratio = bandDistance / bandWidth;
    return (ratio ** 4) / (1 + ratio ** 4);
  }

  const lowPass = profile === "ideal"
    ? Number(distance <= radius)
    : profile === "gaussian"
      ? Math.exp(-(distance * distance) / (2 * radius * radius))
      : 1 / (1 + (distance / radius) ** 4);
  return type === "lowpass" ? lowPass : 1 - lowPass;
}

function drawGrayscale(canvas: HTMLCanvasElement | null, pixels: Float64Array) {
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const min = Math.min(...pixels);
  const range = Math.max(1, Math.max(...pixels) - min);
  const image = context.createImageData(SIZE, SIZE);
  for (let i = 0; i < pixels.length; i++) {
    const value = Math.max(0, Math.min(255, Math.round(((pixels[i] - min) / range) * 255)));
    const offset = i * 4;
    image.data[offset] = value;
    image.data[offset + 1] = value;
    image.data[offset + 2] = value;
    image.data[offset + 3] = 255;
  }
  context.putImageData(image, 0, 0);
}

export default function FourierPlayground() {
  const spatialCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const filteredCanvasRef = useRef<HTMLCanvasElement>(null);
  const [filterType, setFilterType] = useState<FilterType>("lowpass");
  const [cutoffRadius, setCutoffRadius] = useState(35);
  const [filterProfile, setFilterProfile] = useState<FilterProfile>("gaussian");

  const sourceImage = useMemo(() => {
    const image = new Float64Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const index = y * SIZE + x;
        const distance = Math.hypot(x - SIZE / 2, y - SIZE / 2);
        let value = distance < 45 ? 180 : 40;
        value += Math.sin(x * 0.8) * 20 + Math.cos(y * 0.8) * 20;
        if (Math.abs(distance - 30) < 3) value = 250;
        image[index] = Math.max(0, Math.min(255, value));
      }
    }
    return image;
  }, []);

  useEffect(() => {
    drawGrayscale(spatialCanvasRef.current, sourceImage);

    const real = Float64Array.from(sourceImage);
    const imaginary = new Float64Array(sourceImage.length);
    fft2D(real, imaginary, SIZE, false);

    const responses = new Float64Array(sourceImage.length);
    let maxMagnitude = 0;
    for (let y = 0; y < SIZE; y++) {
      const frequencyY = y <= SIZE / 2 ? y : y - SIZE;
      for (let x = 0; x < SIZE; x++) {
        const frequencyX = x <= SIZE / 2 ? x : x - SIZE;
        const index = y * SIZE + x;
        responses[index] = filterResponse(
          Math.hypot(frequencyX, frequencyY),
          cutoffRadius,
          filterType,
          filterProfile
        );
        maxMagnitude = Math.max(
          maxMagnitude,
          Math.log1p(Math.hypot(real[index], imaginary[index]))
        );
      }
    }

    const spectrumContext = spectrumCanvasRef.current?.getContext("2d");
    if (spectrumContext) {
      const image = spectrumContext.createImageData(SIZE, SIZE);
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const shiftedX = (x + SIZE / 2) % SIZE;
          const shiftedY = (y + SIZE / 2) % SIZE;
          const index = shiftedY * SIZE + shiftedX;
          const magnitude = Math.log1p(Math.hypot(real[index], imaginary[index]));
          const intensity = maxMagnitude > 0
            ? Math.round((magnitude / maxMagnitude) * 255)
            : 0;
          const response = responses[index];
          const offset = (y * SIZE + x) * 4;
          image.data[offset] = Math.round(intensity * response * 0.45);
          image.data[offset + 1] = Math.round(intensity * (0.35 + 0.65 * response));
          image.data[offset + 2] = intensity;
          image.data[offset + 3] = 255;
        }
      }
      spectrumContext.putImageData(image, 0, 0);
      spectrumContext.strokeStyle = "#00B4D8";
      spectrumContext.lineWidth = 1.5;
      spectrumContext.beginPath();
      spectrumContext.arc(SIZE / 2, SIZE / 2, cutoffRadius, 0, Math.PI * 2);
      spectrumContext.stroke();
    }

    const filteredReal = new Float64Array(real.length);
    const filteredImaginary = new Float64Array(imaginary.length);
    for (let i = 0; i < real.length; i++) {
      filteredReal[i] = real[i] * responses[i];
      filteredImaginary[i] = imaginary[i] * responses[i];
    }
    fft2D(filteredReal, filteredImaginary, SIZE, true);
    drawGrayscale(filteredCanvasRef.current, filteredReal);
  }, [sourceImage, filterType, cutoffRadius, filterProfile]);

  const buttonClass = (selected: boolean) =>
    `rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
      selected
        ? "bg-white text-adani-navy shadow-sm"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <span className="inline-flex rounded-full bg-adani-purple/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-adani-purple">
          CO3 • Frequency Transforms &amp; 2D DFT Lab
        </span>
        <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          2D Fourier Transform &amp; Frequency Filters
        </h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600">
          Inspect the computed, centered 2D FFT magnitude spectrum, apply an ideal, Butterworth, or Gaussian frequency response, and view the inverse-FFT reconstruction.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1">
        {(["lowpass", "highpass", "bandreject"] as const).map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={filterType === type}
            onClick={() => setFilterType(type)}
            className={buttonClass(filterType === type)}
          >
            {type === "bandreject" ? "Band-Reject" : `${type === "lowpass" ? "Low" : "High"}-Pass`} Filter
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            label: "1. Spatial Image",
            canvas: spatialCanvasRef,
            caption: "Synthetic medical image with tissue boundaries and periodic texture."
          },
          {
            label: "2. Centered FFT Magnitude",
            canvas: spectrumCanvasRef,
            caption: "Log-scaled |F(u,v)|. Center is DC; the circle marks filter radius."
          },
          {
            label: "3. Inverse-FFT Reconstruction",
            canvas: filteredCanvasRef,
            caption: "Spatial image reconstructed from the filtered complex spectrum."
          }
        ].map((panel) => (
          <div key={panel.label} className="space-y-2 text-center">
            <h3 className="text-xs font-bold text-slate-800">{panel.label}</h3>
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 p-4">
              <canvas
                ref={panel.canvas}
                width={SIZE}
                height={SIZE}
                className="aspect-square w-full max-w-[240px] rounded-lg"
              />
            </div>
            <p className="text-[11px] text-slate-500">{panel.caption}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="frequency-cutoff" className="text-xs font-bold text-slate-800">
              Cutoff frequency radius
            </label>
            <span className="rounded border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-xs font-bold text-adani-purple">
              {cutoffRadius} px
            </span>
          </div>
          <input
            id="frequency-cutoff"
            type="range"
            min={10}
            max={60}
            value={cutoffRadius}
            onChange={(event) => setCutoffRadius(Number(event.target.value))}
            className="w-full cursor-pointer accent-adani-purple"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-slate-800">Filter profile</legend>
          <div className="grid grid-cols-3 gap-2">
            {(["gaussian", "butterworth", "ideal"] as const).map((profile) => (
              <button
                key={profile}
                type="button"
                aria-pressed={filterProfile === profile}
                onClick={() => setFilterProfile(profile)}
                className={`rounded-xl border px-2.5 py-2 text-xs font-bold capitalize transition-colors ${
                  filterProfile === profile
                    ? "border-purple-300 bg-purple-50 text-adani-purple"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {profile}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
