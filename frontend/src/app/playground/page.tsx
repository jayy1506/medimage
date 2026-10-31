"use client";

import Link from "next/link";
import {
  ArrowRight,
  AudioWaveform,
  BoxSelect,
  FileImage,
  Grid2X2,
  ScanLine,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { UserNav } from "@/components/UserNav";

interface ImagingTool {
  title: string;
  href: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

const tools: ImagingTool[] = [
  {
    title: "DICOM Explorer",
    href: "/playground/dicom",
    description:
      "Open local DICOM images, inspect image metadata, and move through a slice series.",
    category: "Image data",
    icon: FileImage,
  },
  {
    title: "Window Width / Level (HU Mapping)",
    href: "/playground/windowing",
    description:
      "Adjust CT window width and level to see how Hounsfield units change image contrast.",
    category: "CT visualization",
    icon: ScanLine,
  },
  {
    title: "Spatial 2D Convolution Kernels",
    href: "/playground/convolution",
    description:
      "Compare blur, sharpening, and edge-detection kernels on an interactive image.",
    category: "Spatial processing",
    icon: Grid2X2,
  },
  {
    title: "2D Fourier Transform & Frequency Filters",
    href: "/playground/fourier",
    description:
      "Explore the image frequency spectrum and see the effect of spatial frequency filters.",
    category: "Frequency processing",
    icon: AudioWaveform,
  },
  {
    title: "Thresholding & Region Growing Segmentation",
    href: "/playground/segmentation",
    description:
      "Isolate image regions with an intensity threshold or an interactive seed point.",
    category: "Segmentation",
    icon: BoxSelect,
  },
];

export default function PlaygroundsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const visibleTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query
      ? tools.filter((tool) =>
          `${tool.title} ${tool.description} ${tool.category}`
            .toLowerCase()
            .includes(query)
        )
      : tools;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" aria-label="Course dashboard">
              <BrandLogo className="h-9 w-9" size={38} />
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold tracking-tight text-adani-navy">
                Adani Institute of Higher Education and Research
              </p>
              <p className="text-[11px] font-semibold text-adani-cyan">
                Faculty of Engineering &amp; Technology
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/course"
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:inline-flex"
            >
              Course modules
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-adani-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-adani-cyan" />
              AIDS 12605.1
              <span className="text-slate-300">/</span>
              Interactive workspaces
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Medical Imaging Tools
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose a workstation to explore medical image data and processing
              techniques. All tools run within this application.
            </p>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search medical imaging tools</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Find a tool"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-adani-cyan focus:ring-2 focus:ring-adani-cyan/15"
            />
          </label>
        </div>

        <section aria-labelledby="tools-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="tools-heading"
              className="text-sm font-semibold text-slate-800"
            >
              Imaging workspaces
            </h2>
            <span className="text-xs text-slate-500">
              {visibleTools.length} {visibleTools.length === 1 ? "tool" : "tools"}
            </span>
          </div>

          {visibleTools.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <article
                    key={tool.href}
                    className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-adani-cyan">
                        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        {tool.category}
                      </span>
                    </div>

                    <div className="mt-5 flex-1">
                      <h3 className="text-base font-semibold leading-6 text-slate-900">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {tool.description}
                      </p>
                    </div>

                    <Link
                      href={tool.href}
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-adani-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-adani-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adani-cyan focus-visible:ring-offset-2"
                    >
                      Open Tool
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    <span className="sr-only">Tool {index + 1} of {tools.length}</span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No matching tools
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another name or search term.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
