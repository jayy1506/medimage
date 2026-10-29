"use client";

import React, { useState } from "react";
import { FileText, ShieldAlert, Search, Database, Layers, CheckCircle } from "lucide-react";

interface DicomTag {
  tag: string;
  name: string;
  vr: string;
  value: string;
  category: "Patient" | "Study" | "Series" | "Image" | "Geometry";
}

const SAMPLE_DATASETS: Record<string, { title: string; modality: string; tags: DicomTag[] }> = {
  "head-ct": {
    title: "Anonymized Diagnostic Axial Head CT (TCIA)",
    modality: "CT",
    tags: [
      { tag: "(0008,0016)", name: "SOP Class UID", vr: "UI", value: "1.2.840.10008.5.1.4.1.1.2 (CT Image Storage)", category: "Image" },
      { tag: "(0008,0060)", name: "Modality", vr: "CS", value: "CT", category: "Series" },
      { tag: "(0010,0010)", name: "Patient's Name", vr: "PN", value: "ANONYMIZED^PATIENT^001", category: "Patient" },
      { tag: "(0010,0020)", name: "Patient ID", vr: "LO", value: "TCIA-HEAD-7429", category: "Patient" },
      { tag: "(0018,0050)", name: "Slice Thickness", vr: "DS", value: "1.25 mm", category: "Geometry" },
      { tag: "(0018,0060)", name: "KVP", vr: "DS", value: "120 kV", category: "Series" },
      { tag: "(0018,1150)", name: "Exposure Time", vr: "IS", value: "500 ms", category: "Series" },
      { tag: "(0020,0032)", name: "Image Position (Patient)", vr: "DS", value: "[-125.0, -125.0, 42.5]", category: "Geometry" },
      { tag: "(0020,0037)", name: "Image Orientation (Patient)", vr: "DS", value: "[1.0, 0.0, 0.0, 0.0, 1.0, 0.0]", category: "Geometry" },
      { tag: "(0028,0010)", name: "Rows", vr: "US", value: "512", category: "Image" },
      { tag: "(0028,0011)", name: "Columns", vr: "US", value: "512", category: "Image" },
      { tag: "(0028,0030)", name: "Pixel Spacing", vr: "DS", value: "[0.488281, 0.488281] mm", category: "Geometry" },
      { tag: "(0028,0100)", name: "Bits Allocated", vr: "US", value: "16", category: "Image" },
      { tag: "(0028,0101)", name: "Bits Stored", vr: "US", value: "12", category: "Image" },
      { tag: "(0028,1050)", name: "Window Center (WL)", vr: "DS", value: "40", category: "Image" },
      { tag: "(0028,1051)", name: "Window Width (WW)", vr: "DS", value: "80", category: "Image" },
      { tag: "(0028,1052)", name: "Rescale Intercept", vr: "DS", value: "-1024", category: "Image" },
      { tag: "(0028,1053)", name: "Rescale Slope", vr: "DS", value: "1.0", category: "Image" }
    ]
  },
  "chest-xray": {
    title: "De-identified PA Chest Radiograph (NIH CXR14)",
    modality: "CR",
    tags: [
      { tag: "(0008,0016)", name: "SOP Class UID", vr: "UI", value: "1.2.840.10008.5.1.4.1.1.1 (CR Image Storage)", category: "Image" },
      { tag: "(0008,0060)", name: "Modality", vr: "CS", value: "CR", category: "Series" },
      { tag: "(0010,0010)", name: "Patient's Name", vr: "PN", value: "NIH^ANON^CHEST", category: "Patient" },
      { tag: "(0018,5101)", name: "View Position", vr: "CS", value: "PA (Posteroanterior)", category: "Geometry" },
      { tag: "(0028,0010)", name: "Rows", vr: "US", value: "1024", category: "Image" },
      { tag: "(0028,0011)", name: "Columns", vr: "US", value: "1024", category: "Image" },
      { tag: "(0028,0030)", name: "Pixel Spacing", vr: "DS", value: "[0.143, 0.143] mm", category: "Geometry" }
    ]
  }
};

export default function DicomExplorerPlayground() {
  const [selectedKey, setSelectedKey] = useState<string>("head-ct");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* HIPAA & Ethics Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Clinical Privacy &amp; HIPAA Notice: </span>
          This explorer operates strictly with public, open-access anonymized reference files (NIH CXR14, TCIA). Real patient records or identifiable Protected Health Information (PHI) must never be uploaded.
        </div>
      </div>

      {/* Dataset Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-adani-cyan" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              DICOM Part 10 Header &amp; Metadata Explorer
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inspect standard Group/Element tag pairs, Value Representations (VR), and calibration slopes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {Object.entries(SAMPLE_DATASETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedKey === key
                  ? "bg-adani-cyan text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {data.modality}: {data.title.split("(")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tag (0028,0010), name, or value..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-cyan focus:border-adani-cyan bg-white text-slate-900"
          />
        </div>

        <div className="flex space-x-1.5 self-start sm:self-auto text-xs">
          {["All", "Patient", "Geometry", "Image", "Series"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                categoryFilter === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DICOM Tag Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Tag (Group, Element)</th>
              <th className="px-4 py-3">Element Description</th>
              <th className="px-4 py-3">VR</th>
              <th className="px-4 py-3">Decoded Clinical Value</th>
              <th className="px-4 py-3">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
            {tags.map((t, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-2.5 font-bold text-adani-cyan">{t.tag}</td>
                <td className="px-4 py-2.5 font-sans font-medium text-slate-900">{t.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{t.vr}</td>
                <td className="px-4 py-2.5 text-slate-800 font-semibold max-w-xs truncate">{t.value}</td>
                <td className="px-4 py-2.5 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    {t.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
