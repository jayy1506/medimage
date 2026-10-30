"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ShieldAlert, 
  Search, 
  Database, 
  Layers, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Eye, 
  HelpCircle,
  X
} from "lucide-react";

interface DicomTag {
  tag: string;
  name: string;
  vr: string;
  value: string;
  category: "Patient" | "Study" | "Series" | "Image" | "Geometry";
  clinicalRationale: string;
  mathFormula?: string;
}

const VR_DICTIONARY: Record<string, { fullName: string; description: string; example: string }> = {
  UI: { fullName: "Unique Identifier", description: "Standard dot-separated OID string guaranteeing worldwide uniqueness across PACS.", example: "1.2.840.10008.5.1.4.1.1.2" },
  CS: { fullName: "Code String", description: "Short uppercase identifier string (max 16 chars) for standardized vocabulary.", example: "CT, MR, PA, AXIAL" },
  PN: { fullName: "Person Name", description: "Standardized 5-component string: Family^Given^Middle^Prefix^Suffix.", example: "ANONYMIZED^PATIENT^001" },
  LO: { fullName: "Long String", description: "General text string up to 64 characters.", example: "TCIA-HEAD-7429" },
  DS: { fullName: "Decimal String", description: "Floating point numerical representation up to 16 characters in ASCII.", example: "1.25, -1024, 0.488281" },
  IS: { fullName: "Integer String", description: "Signed integer string up to 12 characters in ASCII.", example: "500, 120" },
  US: { fullName: "Unsigned Short", description: "16-bit unsigned binary integer value (0 to 65,535).", example: "512, 16, 12" }
};

const SAMPLE_DATASETS: Record<string, { title: string; modality: string; organ: string; tags: DicomTag[] }> = {
  "head-ct": {
    title: "Diagnostic Axial Head CT (TCIA Public Benchmark)",
    modality: "CT",
    organ: "Brain & Cranium",
    tags: [
      { 
        tag: "(0008,0016)", 
        name: "SOP Class UID", 
        vr: "UI", 
        value: "1.2.840.10008.5.1.4.1.1.2 (CT Image Storage)", 
        category: "Image",
        clinicalRationale: "Specifies that this file is an authorized CT image instance obeying the DICOM Information Object Definition (IOD)."
      },
      { 
        tag: "(0008,0060)", 
        name: "Modality", 
        vr: "CS", 
        value: "CT", 
        category: "Series",
        clinicalRationale: "Used by PACS archives and hanging protocols to automatically group scans and apply default CT windowing."
      },
      { 
        tag: "(0010,0010)", 
        name: "Patient's Name", 
        vr: "PN", 
        value: "ANONYMIZED^PATIENT^001", 
        category: "Patient",
        clinicalRationale: "Protected Health Information (PHI). Must be stripped or pseudonymized according to HIPAA 18 Safe Harbor identifiers before research."
      },
      { 
        tag: "(0010,0020)", 
        name: "Patient ID", 
        vr: "LO", 
        value: "TCIA-HEAD-7429", 
        category: "Patient",
        clinicalRationale: "Unique medical record identifier linked to clinical trials without exposing national identification numbers."
      },
      { 
        tag: "(0018,0050)", 
        name: "Slice Thickness", 
        vr: "DS", 
        value: "1.25 mm", 
        category: "Geometry",
        clinicalRationale: "Defines the physical Z-axis collimation. Thinner slices (e.g. 0.625 mm) minimize partial volume averaging of acute intracranial bleeds."
      },
      { 
        tag: "(0018,0060)", 
        name: "KVP", 
        vr: "DS", 
        value: "120 kV", 
        category: "Series",
        clinicalRationale: "Peak accelerating voltage between X-ray cathode and anode. Governs photon penetration and beam energy spectrum."
      },
      { 
        tag: "(0018,1150)", 
        name: "Exposure Time", 
        vr: "IS", 
        value: "500 ms", 
        category: "Series",
        clinicalRationale: "Total duration of tube current emission. Multiplied with tube current (mA) to calculate mAs, which directly dictates radiation dose."
      },
      { 
        tag: "(0020,0032)", 
        name: "Image Position (Patient)", 
        vr: "DS", 
        value: "[-125.0, -125.0, 42.5] mm", 
        category: "Geometry",
        clinicalRationale: "Specifies exact (X, Y, Z) Cartesian millimeter coordinates of the upper-left first transmitted voxel. Mandatory for 3D multiplanar reformatting."
      },
      { 
        tag: "(0020,0037)", 
        name: "Image Orientation (Patient)", 
        vr: "DS", 
        value: "[1.0, 0.0, 0.0, 0.0, 1.0, 0.0]", 
        category: "Geometry",
        clinicalRationale: "Direction cosines of first row and first column relative to patient reference frame. Identifies scan plane (axial, coronal, sagittal)."
      },
      { 
        tag: "(0028,0010)", 
        name: "Rows", 
        vr: "US", 
        value: "512", 
        category: "Image",
        clinicalRationale: "Vertical pixel matrix dimension. Modern diagnostic CT scanners standardize on 512x512 matrix acquisitions."
      },
      { 
        tag: "(0028,0011)", 
        name: "Columns", 
        vr: "US", 
        value: "512", 
        category: "Image",
        clinicalRationale: "Horizontal pixel matrix dimension. Yields 262,144 voxels per reconstructed 2D axial slice."
      },
      { 
        tag: "(0028,0030)", 
        name: "Pixel Spacing", 
        vr: "DS", 
        value: "[0.488281, 0.488281] mm", 
        category: "Geometry",
        clinicalRationale: "Physical distance between centers of adjacent pixels. Calipers use this tag to convert pixel lengths into physical surgical millimeters."
      },
      { 
        tag: "(0028,0100)", 
        name: "Bits Allocated", 
        vr: "US", 
        value: "16", 
        category: "Image",
        clinicalRationale: "Memory footprint allocated per pixel in binary file stream (typically 16-bit word aligned)."
      },
      { 
        tag: "(0028,0101)", 
        name: "Bits Stored", 
        vr: "US", 
        value: "12", 
        category: "Image",
        clinicalRationale: "Actual bits of precision utilized by ADC converter (12 bits = 4096 discrete attenuation levels)."
      },
      { 
        tag: "(0028,1050)", 
        name: "Window Center (WL)", 
        vr: "DS", 
        value: "40", 
        category: "Image",
        clinicalRationale: "Recommended default midpoint Hounsfield Unit for displaying brain soft tissue on diagnostic PACS monitors."
      },
      { 
        tag: "(0028,1051)", 
        name: "Window Width (WW)", 
        vr: "DS", 
        value: "80", 
        category: "Image",
        clinicalRationale: "Recommended dynamic range span mapped across 256 gray shades to optimize gray/white matter contrast."
      },
      { 
        tag: "(0028,1052)", 
        name: "Rescale Intercept", 
        vr: "DS", 
        value: "-1024", 
        category: "Image",
        clinicalRationale: "Additive offset converting raw stored unsigned integers into signed physical HUs.",
        mathFormula: "HU = (StoredPixel \\times Slope) + Intercept"
      },
      { 
        tag: "(0028,1053)", 
        name: "Rescale Slope", 
        vr: "DS", 
        value: "1.0", 
        category: "Image",
        clinicalRationale: "Multiplicative scaling factor in physical HU reconstruction formula.",
        mathFormula: "HU = (StoredPixel \\times Slope) + Intercept"
      }
    ]
  },
  "chest-xray": {
    title: "Posteroanterior (PA) Digital Radiograph (NIH CXR14)",
    modality: "CR / DX",
    organ: "Thorax / Lungs",
    tags: [
      { tag: "(0008,0016)", name: "SOP Class UID", vr: "UI", value: "1.2.840.10008.5.1.4.1.1.1 (CR Image Storage)", category: "Image", clinicalRationale: "Designates computed radiography 2D projection storage format." },
      { tag: "(0008,0060)", name: "Modality", vr: "CS", value: "CR", category: "Series", clinicalRationale: "Computed Radiography phosphor plate or digital flat panel." },
      { tag: "(0010,0010)", name: "Patient's Name", vr: "PN", value: "NIH^ANON^CHEST", category: "Patient", clinicalRationale: "Fully de-identified research label." },
      { tag: "(0018,5101)", name: "View Position", vr: "CS", value: "PA (Posteroanterior)", category: "Geometry", clinicalRationale: "X-rays enter back of patient and exit through anterior chest; minimizes cardiac magnification distortion." },
      { tag: "(0028,0010)", name: "Rows", vr: "US", value: "1024", category: "Image", clinicalRationale: "High-resolution digital radiography array size." },
      { tag: "(0028,0011)", name: "Columns", vr: "US", value: "1024", category: "Image", clinicalRationale: "High-resolution horizontal array size." },
      { tag: "(0028,0030)", name: "Pixel Spacing", vr: "DS", value: "[0.143, 0.143] mm", category: "Geometry", clinicalRationale: "Sub-millimeter pixel pitch providing high spatial resolution to resolve fine pulmonary pneumothorax line." }
    ]
  },
  "brain-mri": {
    title: "3.0T Brain T2 Fast Spin-Echo (OASIS Benchmark)",
    modality: "MR",
    organ: "Neurocranium",
    tags: [
      { tag: "(0008,0016)", name: "SOP Class UID", vr: "UI", value: "1.2.840.10008.5.1.4.1.1.4 (MR Image Storage)", category: "Image", clinicalRationale: "Magnetic Resonance Image Storage IOD standard." },
      { tag: "(0008,0060)", name: "Modality", vr: "CS", value: "MR", category: "Series", clinicalRationale: "Non-ionizing nuclear magnetic resonance sequence." },
      { tag: "(0018,0080)", name: "Repetition Time (TR)", vr: "DS", value: "4000.0 ms", category: "Series", clinicalRationale: "Time between successive 90 degree RF excitation pulses; long TR (>2000 ms) suppresses T1 contrast weighting." },
      { tag: "(0018,0081)", name: "Echo Time (TE)", vr: "DS", value: "100.0 ms", category: "Series", clinicalRationale: "Time between RF excitation and MR echo readout; long TE (>80 ms) accentuates T2 relaxation, rendering fluid and edema bright white." },
      { tag: "(0018,0087)", name: "Magnetic Field Strength", vr: "DS", value: "3.0 Tesla", category: "Series", clinicalRationale: "Governs Larmor precession frequency (127.7 MHz at 3.0T) and Signal-to-Noise Ratio (SNR)." }
    ]
  }
};

export default function DicomExplorerPlayground() {
  const [selectedKey, setSelectedKey] = useState<string>("head-ct");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [inspectedTag, setInspectedTag] = useState<DicomTag | null>(null);

  const activeDataset = SAMPLE_DATASETS[selectedKey];
  const tags = activeDataset.tags.filter((t) => {
    const matchesSearch =
      t.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* HIPAA & Ethics Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start space-x-3 text-xs text-amber-950 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-900">Clinical Privacy &amp; HIPAA Safe Harbor Protocol: </span>
          In medical image processing, files must be stripped of all 18 direct identifiers (Patient Name, MRN, Birthdate, Institutional Address) before ingestion into AI training pipelines or open database archives. This explorer visualizes verified anonymized datasets.
        </div>
      </div>

      {/* Dataset Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-adani-cyan" />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              DICOM Part 10 Header &amp; Metadata Explorer
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click any row to inspect clinical rationale, Value Representation (VR), and spatial geometry tags.
          </p>
        </div>

        {/* Dataset Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(SAMPLE_DATASETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setInspectedTag(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedKey === key
                  ? "bg-adani-cyan text-white shadow-sm ring-2 ring-adani-cyan/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {data.modality}: {data.title.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tag (0028,0030), name, or value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-adani-cyan focus:bg-white transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {["All", "Patient", "Geometry", "Image", "Series"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive DICOM Tag Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-100/80">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Tag (Group, Element)
              </th>
              <th className="px-4 py-3 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Element Description
              </th>
              <th className="px-4 py-3 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                VR
              </th>
              <th className="px-4 py-3 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Decoded Clinical Value
              </th>
              <th className="px-4 py-3 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tags.map((t, idx) => {
              const isSelected = inspectedTag?.tag === t.tag;

              return (
                <tr
                  key={idx}
                  onClick={() => setInspectedTag(t)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-sky-50 font-medium"
                      : idx % 2 === 0
                      ? "bg-white hover:bg-slate-50"
                      : "bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-adani-cyan font-bold whitespace-nowrap">
                    {t.tag}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                    {t.name}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-500 whitespace-nowrap">
                    <span 
                      title={VR_DICTIONARY[t.vr]?.fullName || t.vr}
                      className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {t.vr}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-800 max-w-xs truncate">
                    {t.value}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {t.category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Tag Deep-Dive Drawer Card */}
      {inspectedTag && (
        <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 shadow-md space-y-3 relative">
          <button
            onClick={() => setInspectedTag(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-adani-cyan" />
            <h4 className="text-sm font-bold text-adani-navy uppercase tracking-wider">
              DICOM Clinical Deep-Dive: {inspectedTag.name} {inspectedTag.tag}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-sky-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Value Representation (VR):</span>
              <strong className="text-slate-900 font-mono text-xs">{inspectedTag.vr}</strong>
              <span className="text-slate-500 block text-[10px]">
                {VR_DICTIONARY[inspectedTag.vr]?.fullName || "Standard DICOM VR"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Stored Value:</span>
              <strong className="text-adani-purple font-mono text-xs truncate block">{inspectedTag.value}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category:</span>
              <strong className="text-slate-900 text-xs">{inspectedTag.category}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {inspectedTag.clinicalRationale}
          </p>

          {inspectedTag.mathFormula && (
            <div className="p-2.5 rounded-lg bg-white border border-sky-100 font-mono text-xs text-slate-900">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block mb-1">Mathematical Formula:</span>
              <code>{inspectedTag.mathFormula}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
