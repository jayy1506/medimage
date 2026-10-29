"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Clock, 
  Award, 
  Activity, 
  Sparkles,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";

interface TopicSummary {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  co_tags: string[];
  read_time_minutes: number;
  is_completed: boolean;
}

interface ModuleSummary {
  id: string;
  module_number: number;
  title: string;
  description: string;
  theory_hours: number;
  co_tags: string[];
  topics_count: number;
  completed_topics_count: number;
  topics: TopicSummary[];
}

export default function CourseDashboardPage() {
  const { user, profile, signOut } = useAuth();
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetches from GET /api/v1/course/modules
    // Provide full accredited course syllabus matching CONTENT.md
    setModules([
      {
        id: "mod-1",
        module_number: 1,
        title: "Medical Image Sources",
        description: "Radiology, electromagnetic spectrum, basic X-ray physics, attenuation and imaging, CT, MRI, ultrasound, nuclear medicine and molecular imaging.",
        theory_hours: 8,
        co_tags: ["CO1"],
        topics_count: 3,
        completed_topics_count: 1,
        topics: [
          {
            id: "t1-1",
            slug: "m1-t1-radiology-spectrum",
            title: "Radiology and the Electromagnetic Spectrum",
            order_index: 1,
            co_tags: ["CO1"],
            read_time_minutes: 15,
            is_completed: true
          },
          {
            id: "t1-2",
            slug: "m1-t2-xray-physics-attenuation",
            title: "Basic X-ray Physics and Attenuation",
            order_index: 2,
            co_tags: ["CO1"],
            read_time_minutes: 20,
            is_completed: false
          },
          {
            id: "t1-3",
            slug: "m1-t3-computed-tomography",
            title: "Computed Tomography (CT) Principles",
            order_index: 3,
            co_tags: ["CO1", "CO4"],
            read_time_minutes: 25,
            is_completed: false
          }
        ]
      },
      {
        id: "mod-2",
        module_number: 2,
        title: "Image Processing in Clinical Practice",
        description: "Clinical image databases, PACS, intensity operations, filter operations, clinical segmentation, spatial transforms.",
        theory_hours: 8,
        co_tags: ["CO2"],
        topics_count: 1,
        completed_topics_count: 0,
        topics: [
          {
            id: "t2-1",
            slug: "m2-t1-pacs-and-image-databases",
            title: "Clinical Image Databases and PACS",
            order_index: 1,
            co_tags: ["CO2"],
            read_time_minutes: 18,
            is_completed: false
          }
        ]
      },
      {
        id: "mod-3",
        module_number: 3,
        title: "Image Representation",
        description: "Pixels and voxels, grayscale and color representation, image file formats, DICOM standard, image quality and SNR.",
        theory_hours: 8,
        co_tags: ["CO2", "CO4"],
        topics_count: 2,
        completed_topics_count: 0,
        topics: [
          {
            id: "t3-1",
            slug: "m3-t1-pixels-voxels-representation",
            title: "Pixels, Voxels and Spatial Sampling",
            order_index: 1,
            co_tags: ["CO2"],
            read_time_minutes: 15,
            is_completed: false
          },
          {
            id: "t3-2",
            slug: "m3-t2-dicom-file-format",
            title: "The DICOM Standard and Data Structure",
            order_index: 2,
            co_tags: ["CO2", "CO4"],
            read_time_minutes: 22,
            is_completed: false
          }
        ]
      },
      {
        id: "mod-4",
        module_number: 4,
        title: "Operations in Intensity Space",
        description: "Intensity transform function and dynamic range, windowing, histograms and histogram operations, dithering and depth.",
        theory_hours: 7,
        co_tags: ["CO2", "CO3"],
        topics_count: 1,
        completed_topics_count: 0,
        topics: [
          {
            id: "t4-1",
            slug: "m4-t1-windowing-and-dynamic-range",
            title: "Windowing, Leveling and Dynamic Range Mapping",
            order_index: 1,
            co_tags: ["CO2", "CO3"],
            read_time_minutes: 20,
            is_completed: false
          }
        ]
      },
      {
        id: "mod-5",
        module_number: 5,
        title: "Filtering, Transformations and Segmentation",
        description: "Filtering, Fourier transform, segmentation, ROI definition and centroids, thresholding, region growing, evaluation of segmentation results.",
        theory_hours: 7,
        co_tags: ["CO3"],
        topics_count: 1,
        completed_topics_count: 0,
        topics: [
          {
            id: "t5-1",
            slug: "m5-t1-fourier-transforms-frequency",
            title: "2D Fourier Transform and Frequency Domain Filtering",
            order_index: 1,
            co_tags: ["CO3"],
            read_time_minutes: 22,
            is_completed: false
          }
        ]
      },
      {
        id: "mod-6",
        module_number: 6,
        title: "Spatial Transforms",
        description: "Discretization, resolution and artifacts, interpolation and volume regularization, translation and rotation, reformatting, rendering and surface models.",
        theory_hours: 7,
        co_tags: ["CO3", "CO4"],
        topics_count: 1,
        completed_topics_count: 0,
        topics: [
          {
            id: "t6-1",
            slug: "m6-t1-multiplanar-reformatting",
            title: "Multiplanar Reformatting (MPR) and 3D Rendering",
            order_index: 1,
            co_tags: ["CO3", "CO4"],
            read_time_minutes: 20,
            is_completed: false
          }
        ]
      }
    ]);
    setIsLoading(false);
  }, []);

  const totalTopics = modules.reduce((sum, m) => sum + m.topics_count, 0);
  const totalCompleted = modules.reduce((sum, m) => sum + m.completed_topics_count, 0);
  const progressPct = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
                AI
              </div>
              <span className="text-sm font-bold tracking-tight text-adani-navy hidden sm:inline-block">
                Adani University
              </span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-300" />
            <span className="hidden sm:block text-xs font-bold text-adani-navy uppercase tracking-wider">
              Workstation • AIDS 12605.1
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Welcome & Progress Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-adani-navy via-adani-dark to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-adani-cyan text-[11px] font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>B.Tech Semester VI • Faculty of Engg &amp; Tech</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Medical Text and Image Processing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 6 foundational modules covering radiology physics, DICOM standards, dynamic range windowing, and 3D multiplanar reformatting. Clear each module at &gt;75% to achieve mastery.
            </p>
          </div>

          {/* Progress Circular Dial */}
          <div className="flex items-center space-x-4 bg-white/10 p-5 rounded-2xl border border-white/10 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black text-adani-cyan">{progressPct}%</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Curriculum Cleared</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-xs space-y-1">
              <div className="text-slate-200"><span className="font-bold text-white">{totalCompleted}</span> of {totalTopics} Topics</div>
              <div className="text-[10px] text-emerald-400 font-semibold">&gt;75% Pass Condition Active</div>
            </div>
          </div>
        </div>

        {/* Modules Outline */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Curriculum Modules &amp; Interactive Topics
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-adani-cyan/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="h-8 w-8 rounded-lg bg-adani-cyan/10 text-adani-cyan font-black text-sm flex items-center justify-center">
                      0{m.module_number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-500">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {m.theory_hours}h Theory
                    </span>
                    {m.co_tags.map((co) => (
                      <span key={co} className="text-[10px] font-bold px-2 py-0.5 rounded bg-adani-cyan/10 text-adani-cyan">
                        {co}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Topics in this module */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {m.topics.map((t) => (
                    <Link
                      key={t.id}
                      href={`/course/${m.id}/${t.slug}`}
                      className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-adani-cyan hover:shadow-sm transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {t.is_completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 group-hover:text-adani-cyan flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-adani-navy truncate">
                          {t.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-adani-cyan flex-shrink-0 ml-2 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
