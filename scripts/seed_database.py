#!/usr/bin/env python3
"""
scripts/seed_database.py
Seeds the 6 Course Modules, Topics, Sections, and Diagrams into hosted PostgreSQL (Supabase)
directly from the accredited syllabus specification.
Enforces ZERO LOCAL STORAGE: all curriculum data is pushed directly to the hosted DB.
"""

import os
import sys
import json

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("Missing dependency: psycopg2-binary")
    print("Please install: pip install psycopg2-binary")
    sys.exit(1)

MODULES_DATA = [
    {
        "module_number": 1,
        "title": "Medical Image Sources",
        "description": "Radiology, electromagnetic spectrum, basic X-ray physics, attenuation and imaging, CT, MRI, ultrasound, nuclear medicine and molecular imaging.",
        "theory_hours": 8,
        "co_tags": ["CO1"],
        "order_index": 1,
        "topics": [
            {
                "slug": "m1-t1-radiology-spectrum",
                "title": "Radiology and the Electromagnetic Spectrum",
                "order_index": 1,
                "co_tags": ["CO1"],
                "read_time_minutes": 15,
                "diagram": {
                    "title": "Electromagnetic Spectrum & Diagnostic Windows",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph LR
    Radio[Radio Waves: MRI] --> Micro[Microwaves]
    Micro --> IR[Infrared: Thermography]
    IR --> Visible[Visible Light: Endoscopy]
    Visible --> UV[Ultraviolet]
    UV --> XRay[X-rays: CT & Radiography]
    XRay --> Gamma[Gamma Rays: SPECT & PET]
    style XRay fill:#0077B6,stroke:#0B2545,stroke-width:2px,color:#fff
    style Radio fill:#662D91,stroke:#0B2545,stroke-width:2px,color:#fff
    style Gamma fill:#B82662,stroke:#0B2545,stroke-width:2px,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "objectives",
                        "title": "Learning Objectives",
                        "content_markdown": "- Differentiate imaging modalities across the electromagnetic spectrum.\n- Quantify photon energy from wavelength using Planck's relation $E = h\\nu$.\n- Identify clinical trade-offs between ionizing and non-ionizing radiation.",
                        "formula_latex": "E = h\\nu = \\frac{hc}{\\lambda}"
                    },
                    {
                        "section_number": 2,
                        "section_type": "overview",
                        "title": "Physical Foundations of Diagnostic Radiations",
                        "content_markdown": "Diagnostic radiology leverages high-frequency electromagnetic radiation capable of traversing tissue. While optical photons are rapidly scattered by cellular structures, diagnostic X-rays ($0.01$ to $10\\text{ nm}$) penetrate deep anatomical structures, yielding shadow projections governed by electron density and atomic number ($Z$).",
                        "formula_latex": None
                    }
                ]
            },
            {
                "slug": "m1-t2-xray-physics-attenuation",
                "title": "Basic X-ray Physics and Attenuation",
                "order_index": 2,
                "co_tags": ["CO1"],
                "read_time_minutes": 20,
                "diagram": {
                    "title": "X-ray Transmission & Attenuation Chain",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph LR
    Source[X-ray Tube Target] --> Filter[Al/Cu Beam Filter]
    Filter --> Incident[Incident Beam I0]
    Incident --> Tissue[Patient Tissue Layer dx]
    Tissue --> Transmitted[Transmitted Beam I]
    Transmitted --> Detector[Flat Panel Detector]
    style Tissue fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "objectives",
                        "title": "Learning Objectives",
                        "content_markdown": "- Derive the exponential attenuation law (Beer-Lambert law) for monochromatic beams.\n- Differentiate Compton scattering from the photoelectric effect in diagnostic energy ranges.\n- Formulate Half-Value Layer (HVL) calculations.",
                        "formula_latex": "I(x) = I_0 e^{-\\mu x}"
                    },
                    {
                        "section_number": 2,
                        "section_type": "detailed_math",
                        "title": "Linear Attenuation Coefficient Formulation",
                        "content_markdown": "The probability of photon interaction per unit path length is characterized by the linear attenuation coefficient $\\mu$ (units $\\text{cm}^{-1}$). For a monochromatic beam passing through homogeneous tissue of thickness $x$, the remaining intensity $I(x)$ decreases exponentially.",
                        "formula_latex": "\\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}"
                    }
                ]
            },
            {
                "slug": "m1-t3-computed-tomography",
                "title": "Computed Tomography (CT) Principles",
                "order_index": 3,
                "co_tags": ["CO1", "CO4"],
                "read_time_minutes": 25,
                "diagram": {
                    "title": "CT Radon Transform to Backprojection Pipeline",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph TD
    CrossSection[2D Patient Slice f x,y] --> Projections[Radon Transform: Parallel Projections]
    Projections --> Sinogram[Sinogram Formation p s,theta]
    Sinogram --> RampFilter[Ram-Lak Frequency Filtering]
    RampFilter --> Backprojection[Filtered Backprojection FBP]
    Backprojection --> Reconstructed[Reconstructed HU Matrix]
    style Sinogram fill:#662D91,stroke:#0B2545,color:#fff
    style Reconstructed fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "Cross-Sectional Tomographic Reconstruction",
                        "content_markdown": "Unlike conventional planar radiographs that superimpose 3D anatomy onto a 2D plane, Computed Tomography acquires multiple 1D projection profiles across 360 degrees of rotation and mathematically reconstructs cross-sectional slices using the inverse Radon transform.",
                        "formula_latex": "p(s, \\theta) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(x, y) \\delta(x\\cos\\theta + y\\sin\\theta - s) dx dy"
                    },
                    {
                        "section_number": 2,
                        "section_type": "clinical_relevance",
                        "title": "Hounsfield Units (HU) Standardization",
                        "content_markdown": "To enable cross-scanner standardization, linear attenuation coefficients are mapped to the dimensionless Hounsfield scale calibrated against pure water (0 HU) and air (-1000 HU). Dense cortical bone exhibits values from +1000 to +3000 HU.",
                        "formula_latex": "HU = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}"
                    }
                ]
            }
        ]
    },
    {
        "module_number": 2,
        "title": "Image Processing in Clinical Practice",
        "description": "Clinical image databases, PACS, intensity operations, filter operations, clinical segmentation, spatial transforms.",
        "theory_hours": 8,
        "co_tags": ["CO2"],
        "order_index": 2,
        "topics": [
            {
                "slug": "m2-t1-pacs-and-image-databases",
                "title": "Clinical Image Databases and PACS",
                "order_index": 1,
                "co_tags": ["CO2"],
                "read_time_minutes": 18,
                "diagram": {
                    "title": "Hospital PACS & DICOM Modality Network",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph TD
    Modality[CT/MRI Modality] -->|DICOM C-STORE| PACS[PACS Server & Database]
    RIS[Radiology Info System] -->|Modality Worklist| Modality
    PACS -->|DICOM C-MOVE| Workstation[Radiologist Diagnostic Workstation]
    PACS --> VNA[Vendor Neutral Archive / Cloud Storage]
    style PACS fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "Picture Archiving and Communication Systems (PACS)",
                        "content_markdown": "In modern hospital enterprises, medical image acquisition, storage, distribution, and display are managed by Picture Archiving and Communication Systems (PACS) interfaced with Hospital Information Systems (HIS) and Radiology Information Systems (RIS).",
                        "formula_latex": None
                    }
                ]
            }
        ]
    },
    {
        "module_number": 3,
        "title": "Image Representation",
        "description": "Pixels and voxels, grayscale and color representation, image file formats, DICOM standard, image quality and SNR.",
        "theory_hours": 8,
        "co_tags": ["CO2", "CO4"],
        "order_index": 3,
        "topics": [
            {
                "slug": "m3-t1-pixels-voxels-representation",
                "title": "Pixels, Voxels and Spatial Sampling",
                "order_index": 1,
                "co_tags": ["CO2"],
                "read_time_minutes": 15,
                "diagram": {
                    "title": "Voxel Representation and Anisotropic Grid",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph LR
    Pixel[2D Pixel: dx * dy] --> Slice[Slice Thickness dz]
    Slice --> Voxel[3D Voxel: dx * dy * dz]
    Voxel --> Isotropic[Isotropic: dx = dy = dz]
    Voxel --> Anisotropic[Anisotropic: dz >> dx, dy]
    style Voxel fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "From 2D Pixels to 3D Voxels",
                        "content_markdown": "A 2D digital radiographic image consists of discrete picture elements (pixels). In cross-sectional tomographic series (CT, MRI), each element represents a discrete volume element (voxel) with physical spatial dimensions $(\\Delta x, \\Delta y, \\Delta z)$.",
                        "formula_latex": "V_{\\text{voxel}} = \\Delta x \\cdot \\Delta y \\cdot \\Delta z"
                    }
                ]
            },
            {
                "slug": "m3-t2-dicom-file-format",
                "title": "The DICOM Standard and Data Structure",
                "order_index": 2,
                "co_tags": ["CO2", "CO4"],
                "read_time_minutes": 22,
                "diagram": {
                    "title": "DICOM Part 10 File Header & Tag Structure",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph TD
    Preamble[128 Byte File Preamble] --> Prefix[4 Byte DICM Prefix]
    Prefix --> MetaHeader[Group 0002 File Meta Information]
    MetaHeader --> Dataset[DICOM Dataset: Patient, Study, Series, Image]
    Dataset --> Tag0010[Tag 0010,0010: Patient Name]
    Dataset --> Tag0028[Tag 0028,0010: Rows & Columns]
    Dataset --> TagPixel[Tag 7FE0,0010: Pixel Data Byte Stream]
    style Dataset fill:#662D91,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "Digital Imaging and Communications in Medicine (DICOM)",
                        "content_markdown": "DICOM is the universal international standard (ISO 12052) for medical image information exchange. Unlike consumer image formats (PNG, JPEG) which only store raw color pixels, a DICOM file encapsulates rich patient metadata, acquisition geometry, calibration factors, and multi-frame arrays.",
                        "formula_latex": None
                    }
                ]
            }
        ]
    },
    {
        "module_number": 4,
        "title": "Operations in Intensity Space",
        "description": "Intensity transform function and dynamic range, windowing, histograms and histogram operations, dithering and depth.",
        "theory_hours": 7,
        "co_tags": ["CO2", "CO3"],
        "order_index": 4,
        "topics": [
            {
                "slug": "m4-t1-windowing-and-dynamic-range",
                "title": "Windowing, Leveling and Dynamic Range Mapping",
                "order_index": 1,
                "co_tags": ["CO2", "CO3"],
                "read_time_minutes": 20,
                "diagram": {
                    "title": "CT Window Width and Level Mapping Function",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph LR
    InputHU[Input HU: -1000 to +3000] --> Windowing[Piecewise Linear Transfer Function]
    Windowing --> ClipMin[HU < WL - WW/2: Black 0]
    Windowing --> LinearRamp[WL - WW/2 to WL + WW/2: Grayscale Ramp]
    Windowing --> ClipMax[HU > WL + WW/2: White 255]
    LinearRamp --> OutputDisplay[8-bit Display Monitor 0-255]
    style Windowing fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "detailed_math",
                        "title": "The Piecewise Linear Windowing Function",
                        "content_markdown": "Given Window Level ($WL$) and Window Width ($WW$), input CT Hounsfield Units ($r$) are transformed into display grayscale intensities ($s \\in [0, 255]$) via a piecewise linear transfer equation.",
                        "formula_latex": "s = \\begin{cases} 0 & r \\le WL - \\frac{WW}{2} \\\\ 255 \\cdot \\frac{r - (WL - WW/2)}{WW} & WL - \\frac{WW}{2} < r < WL + \\frac{WW}{2} \\\\ 255 & r \\ge WL + \\frac{WW}{2} \\end{cases}"
                    }
                ]
            }
        ]
    },
    {
        "module_number": 5,
        "title": "Filtering, Transformations and Segmentation",
        "description": "Filtering, Fourier transform, segmentation, ROI definition and centroids, thresholding, region growing, evaluation of segmentation results.",
        "theory_hours": 7,
        "co_tags": ["CO3"],
        "order_index": 5,
        "topics": [
            {
                "slug": "m5-t1-fourier-transforms-frequency",
                "title": "2D Fourier Transform and Frequency Domain Filtering",
                "order_index": 1,
                "co_tags": ["CO3"],
                "read_time_minutes": 22,
                "diagram": {
                    "title": "Frequency Domain Processing Pipeline",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph TD
    Spatial[Spatial Image f x,y] --> FFT[2D Fast Fourier Transform FFT]
    FFT --> Spectrum[Centered Magnitude Spectrum F u,v]
    Spectrum --> Filter[Filter Function H u,v: Low/High Pass]
    Filter --> Product[Filtered Spectrum G u,v = F * H]
    Product --> IFFT[Inverse 2D FFT]
    IFFT --> OutputSpatial[Processed Spatial Scan g x,y]
    style FFT fill:#662D91,stroke:#0B2545,color:#fff
    style Filter fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "Frequency Domain Representation",
                        "content_markdown": "The 2D Discrete Fourier Transform (DFT) decomposes a spatial medical image into its constituent sinusoidal frequency components. Low frequencies capture gross anatomical structures and tissue contrast, while high frequencies encode fine structural boundaries, edges, and quantum mottle noise.",
                        "formula_latex": "F(u, v) = \\sum_{x=0}^{M-1} \\sum_{y=0}^{N-1} f(x, y) e^{-j2\\pi \\left(\\frac{ux}{M} + \\frac{vy}{N}\\right)}"
                    }
                ]
            }
        ]
    },
    {
        "module_number": 6,
        "title": "Spatial Transforms",
        "description": "Discretization, resolution and artifacts, interpolation and volume regularization, translation and rotation, reformatting, rendering and surface models.",
        "theory_hours": 7,
        "co_tags": ["CO3", "CO4"],
        "order_index": 6,
        "topics": [
            {
                "slug": "m6-t1-multiplanar-reformatting",
                "title": "Multiplanar Reformatting (MPR) and 3D Rendering",
                "order_index": 1,
                "co_tags": ["CO3", "CO4"],
                "read_time_minutes": 20,
                "diagram": {
                    "title": "Orthogonal Multiplanar Reslicing (Axial, Coronal, Sagittal)",
                    "diagram_type": "mermaid",
                    "code_or_markup": """graph TD
    VolStack[Acquired Axial Volumetric Stack] --> Interp[Trilinear Interpolation & Isotropic Resampling]
    Interp --> Axial[Axial Plane: XY Plane, Z Constant]
    Interp --> Coronal[Coronal Plane: XZ Plane, Y Constant]
    Interp --> Sagittal[Sagittal Plane: YZ Plane, X Constant]
    Interp --> Oblique[Oblique Curved Reformat: Arbitrary Plane]
    style VolStack fill:#0077B6,stroke:#0B2545,color:#fff"""
                },
                "sections": [
                    {
                        "section_number": 1,
                        "section_type": "overview",
                        "title": "Principles of Multiplanar Reslicing",
                        "content_markdown": "Multiplanar Reformatting (MPR) is a fundamental 3D clinical visualization technique that reslices a volumetric CT or MRI dataset along arbitrary non-axial planes, providing radiologists with true orthogonal (Coronal, Sagittal) and oblique views without additional radiation exposure.",
                        "formula_latex": "A x + B y + C z + D = 0"
                    }
                ]
            }
        ]
    }
]


def seed_curriculum(db_url: str):
    print(f"[SEED] Connecting to hosted PostgreSQL database...")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    for mod in MODULES_DATA:
        # Insert or update module
        cursor.execute("""
            INSERT INTO modules (module_number, title, description, theory_hours, co_tags, order_index)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (module_number) DO UPDATE
            SET title = EXCLUDED.title,
                description = EXCLUDED.description,
                theory_hours = EXCLUDED.theory_hours,
                co_tags = EXCLUDED.co_tags,
                order_index = EXCLUDED.order_index
            RETURNING id;
        """, (mod["module_number"], mod["title"], mod["description"], mod["theory_hours"], mod["co_tags"], mod["order_index"]))
        module_id = cursor.fetchone()["id"]
        print(f"  ✓ Module {mod['module_number']}: {mod['title']} (ID: {module_id})")

        # Create Assessment for Module (>75% pass rule)
        cursor.execute("""
            INSERT INTO assessments (module_id, title, pass_threshold_pct, time_limit_minutes, num_random_questions)
            VALUES (%s, %s, 75.00, 30, 15)
            ON CONFLICT DO NOTHING;
        """, (module_id, f"Module {mod['module_number']} Comprehensive Assessment"))

        for topic in mod.get("topics", []):
            cursor.execute("""
                INSERT INTO topics (module_id, slug, title, order_index, co_tags, read_time_minutes)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO UPDATE
                SET title = EXCLUDED.title,
                    order_index = EXCLUDED.order_index,
                    co_tags = EXCLUDED.co_tags,
                    read_time_minutes = EXCLUDED.read_time_minutes
                RETURNING id;
            """, (module_id, topic["slug"], topic["title"], topic["order_index"], topic["co_tags"], topic["read_time_minutes"]))
            topic_id = cursor.fetchone()["id"]
            print(f"    - Topic: {topic['title']} (Slug: {topic['slug']})")

            # Insert Diagram if present
            diag = topic.get("diagram")
            linked_diag_id = None
            if diag:
                cursor.execute("""
                    INSERT INTO diagrams (topic_id, title, diagram_type, code_or_markup)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id;
                """, (topic_id, diag["title"], diag["diagram_type"], diag["code_or_markup"]))
                linked_diag_id = cursor.fetchone()["id"]

            # Insert Sections
            for sec in topic.get("sections", []):
                cursor.execute("""
                    INSERT INTO topic_sections (topic_id, section_number, section_type, title, content_markdown, formula_latex, linked_diagram_id, order_index)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (topic_id, order_index) DO UPDATE
                    SET title = EXCLUDED.title,
                        content_markdown = EXCLUDED.content_markdown,
                        formula_latex = EXCLUDED.formula_latex,
                        linked_diagram_id = EXCLUDED.linked_diagram_id;
                """, (topic_id, sec["section_number"], sec["section_type"], sec["title"], sec["content_markdown"], sec["formula_latex"], linked_diag_id, sec["section_number"]))

    cursor.close()
    conn.close()
    print("\n[SEED] Curriculum modules, topics, sections, and assessments pushed to hosted PostgreSQL!")


if __name__ == "__main__":
    db_conn_str = os.environ.get("DIRECT_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not db_conn_str:
        print("[ERROR] DATABASE_URL or DIRECT_DATABASE_URL environment variable is required.")
        sys.exit(1)
    seed_curriculum(db_conn_str)
