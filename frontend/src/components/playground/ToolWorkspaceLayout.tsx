import Link from "next/link";
import {
  Activity,
  AudioWaveform,
  BoxSelect,
  FileImage,
  Grid2X2,
  ScanLine,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { UserNav } from "@/components/UserNav";

const tools: Array<{ title: string; href: string; icon: LucideIcon }> = [
  { title: "DICOM Explorer", href: "/playground/dicom", icon: FileImage },
  {
    title: "Window Width / Level",
    href: "/playground/windowing",
    icon: ScanLine,
  },
  {
    title: "2D Convolution",
    href: "/playground/convolution",
    icon: Grid2X2,
  },
  {
    title: "2D Fourier",
    href: "/playground/fourier",
    icon: AudioWaveform,
  },
  {
    title: "Segmentation",
    href: "/playground/segmentation",
    icon: BoxSelect,
  },
];

interface ToolWorkspaceLayoutProps {
  title: string;
  description: string;
  href: string;
  children: React.ReactNode;
}

export function ToolWorkspaceLayout({
  title,
  description,
  href,
  children,
}: ToolWorkspaceLayoutProps) {
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
          <UserNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5">
          <Link
            href="/medical-imaging-tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-adani-cyan"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            All Medical Imaging Tools
          </Link>
        </div>

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-3xl">
            <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <Activity aria-hidden="true" className="h-3.5 w-3.5" />
              Interactive workspace
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-5 text-slate-600">
              {description}
            </p>
          </div>
          <span className="hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:inline-flex">
            AIDS 12605.1
          </span>
        </section>

        <nav
          aria-label="Medical imaging workspaces"
          className="-mx-4 mb-6 overflow-x-auto border-y border-slate-200 bg-white px-4 sm:mx-0 sm:rounded-xl sm:border"
        >
          <div className="flex min-w-max gap-1 py-1.5 sm:min-w-0 sm:flex-wrap">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const selected = href === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  aria-current={selected ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adani-cyan ${
                    selected
                      ? "bg-sky-50 text-adani-navy ring-1 ring-inset ring-sky-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`h-4 w-4 ${selected ? "text-adani-cyan" : "text-slate-400"}`}
                    strokeWidth={1.8}
                  />
                  {tool.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {children}
      </main>
    </div>
  );
}
