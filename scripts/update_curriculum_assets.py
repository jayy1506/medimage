"""
Updates frontend/src/data/curriculumData.ts to attach the extracted clinical figures
to the visual_assets array for each Module 1 topic in TOPICS_DATA_REGISTRY.
"""

file_path = "frontend/src/data/curriculumData.ts"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Visual asset definitions to replace empty visual_assets: []
replacements = {
    # Topic 1.1
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-1",""": """    visual_assets: [
      {
        id: "vis-m1-t1",
        title: "Clinical Modalities & Diagnostic Taxonomy in Modern Radiology",
        storage_url: "/images/curriculum/m1/fig_1_1_radiology_modalities.png",
        alt_text: "Clinical Modalities & Diagnostic Taxonomy in Modern Radiology",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems (Open Access, Springer)",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-1",""",

    # Topic 1.2
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-2",""": """    visual_assets: [
      {
        id: "vis-m1-t2-1",
        title: "The Electromagnetic Spectrum in Clinical Radiology",
        storage_url: "/images/curriculum/m1/fig_1_2_em_spectrum.png",
        alt_text: "The Electromagnetic Spectrum in Clinical Radiology",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t2-2",
        title: "Photon Energy vs. Radiation Quality Curve",
        storage_url: "/images/curriculum/m1/fig_1_2_photon_energy_curve.png",
        alt_text: "Photon Energy vs. Radiation Quality Curve",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-2",""",

    # Topic 1.3
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-3",""": """    visual_assets: [
      {
        id: "vis-m1-t3-1",
        title: "X-ray Tube Geometry and Dual Generation Pathways",
        storage_url: "/images/curriculum/m1/fig_1_3_xray_tube_physics.png",
        alt_text: "X-ray Tube Geometry and Dual Generation Pathways",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t3-2",
        title: "Continuous Bremsstrahlung Emission Spectrum",
        storage_url: "/images/curriculum/m1/fig_1_3_bremsstrahlung_spectrum.png",
        alt_text: "Continuous Bremsstrahlung Emission Spectrum",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-3",""",

    # Topic 1.4
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-4",""": """    visual_assets: [
      {
        id: "vis-m1-t4-1",
        title: "Exponential Photon Attenuation and Half-Value Layer",
        storage_url: "/images/curriculum/m1/fig_1_4_beer_lambert_attenuation.png",
        alt_text: "Exponential Photon Attenuation and Half-Value Layer",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t4-2",
        title: "Contrast Agents and K-Edge Photoelectric Discontinuity",
        storage_url: "/images/curriculum/m1/fig_1_4_contrast_k_edge.png",
        alt_text: "Contrast Agents and K-Edge Discontinuity",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-4",""",

    # Topic 1.5
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-5",""": """    visual_assets: [
      {
        id: "vis-m1-t5-1",
        title: "CT Rotating Gantry Geometry and Slice Acquisition",
        storage_url: "/images/curriculum/m1/fig_1_5_ct_gantry_geometry.png",
        alt_text: "CT Rotating Gantry Geometry",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t5-2",
        title: "Radon Transform Sinogram & Filtered Backprojection",
        storage_url: "/images/curriculum/m1/fig_1_5_radon_transform_sinogram.png",
        alt_text: "Radon Transform Sinogram",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-5",""",

    # Topic 1.6
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-6",""": """    visual_assets: [
      {
        id: "vis-m1-t6-1",
        title: "Net Magnetization Alignment in Static Field B0",
        storage_url: "/images/curriculum/m1/fig_1_6_mri_proton_spin.png",
        alt_text: "Net Magnetization Alignment in B0",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t6-2",
        title: "T1 Longitudinal Recovery and T2 Transverse Decay Curves",
        storage_url: "/images/curriculum/m1/fig_1_6_t1_t2_relaxation.png",
        alt_text: "T1 Recovery and T2 Decay Curves",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-6",""",

    # Topic 1.7
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-7",""": """    visual_assets: [
      {
        id: "vis-m1-t7-1",
        title: "Piezoelectric Transducer Construction & Acoustic Reflection",
        storage_url: "/images/curriculum/m1/fig_1_7_piezoelectric_transducer.png",
        alt_text: "Piezoelectric Transducer Construction",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t7-2",
        title: "Real-time B-mode, M-mode, and Color Doppler Ultrasound",
        storage_url: "/images/curriculum/m1/fig_1_7_ultrasound_modes_doppler.png",
        alt_text: "Ultrasound Modes and Color Doppler",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-7",""",

    # Topic 1.8
    """    visual_assets: [],
    quick_checks: [
      {
        id: "qc-m1-8",""": """    visual_assets: [
      {
        id: "vis-m1-t8-1",
        title: "SPECT Collimated Gamma Camera Architecture",
        storage_url: "/images/curriculum/m1/fig_1_8_spect_gamma_camera.png",
        alt_text: "SPECT Gamma Camera Architecture",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      },
      {
        id: "vis-m1-t8-2",
        title: "PET 511 keV Positron Annihilation Coincidence Detection",
        storage_url: "/images/curriculum/m1/fig_1_8_pet_coincidence_annihilation.png",
        alt_text: "PET 511 keV Coincidence Detection",
        license: "CC BY 4.0",
        attribution: "Maier et al., Medical Imaging Systems",
        status: "approved"
      }
    ],
    quick_checks: [
      {
        id: "qc-m1-8","""
}

count = 0
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new, 1)
        count += 1

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print(f"Successfully attached clinical figures to {count}/8 Module 1 topics in curriculumData.ts!")
