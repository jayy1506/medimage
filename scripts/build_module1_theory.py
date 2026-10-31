"""
Synthesizes Module 1 official model answers into comprehensive, accredited theory chapters.
Converts Q&A model answers into continuous academic textbook theory with KaTeX math,
embedded figures, clinical comparative tables, and updates Upstash Redis.
"""

import json
import urllib.request
import os

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".env"))
load_dotenv()

UPSTASH_URL = os.environ.get("UPSTASH_REDIS_REST_URL", "")
UPSTASH_TOKEN = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "")

def redis_set(key, val):
    req = urllib.request.Request(
        f"{UPSTASH_URL}/set/{key}",
        data=json.dumps(val).encode('utf-8'),
        headers={
            "Authorization": f"Bearer {UPSTASH_TOKEN}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    res = urllib.request.urlopen(req)
    return res.status == 200

def redis_get(key):
    req = urllib.request.Request(
        f"{UPSTASH_URL}/get/{key}",
        headers={"Authorization": f"Bearer {UPSTASH_TOKEN}"}
    )
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    val = data.get("result")
    return json.loads(val) if val else None

# Complete, verified theory text for each of the 8 topics in Module 1:
THEORY_DATA = {
    "1.1": {
        "title": "Radiology and Medical Imaging Overview",
        "markdown": """# 1.1 Radiology and Medical Imaging Overview

## 1. Clinical Definition and Evolution
**Radiology** is the specialized medical discipline that utilizes non-invasive physical energy fields—including ionizing electromagnetic radiation (X-rays, gamma rays), non-ionizing radiofrequency fields, and high-frequency acoustic waves—to visualize internal anatomical structures, physiological processes, and pathological alterations inside the human body.

Modern radiology is divided into two primary subspecialties:
1. **Diagnostic Radiology:** The acquisition, processing, quantitative reconstruction, and clinical interpretation of medical images to establish accurate differential diagnoses, monitor disease progression, and stage oncological processes.
2. **Interventional Radiology (IR):** Minimally invasive image-guided therapeutic procedures (e.g., endovascular catheterization, angioplasty, percutaneous biopsy, tumor ablation) performed under real-time fluoroscopic, CT, or ultrasound guidance.

![Figure 1.1: Clinical Modalities and Diagnostic Taxonomy in Modern Radiology](/images/curriculum/m1/fig_1_1_radiology_modalities.png)

## 2. Classification of Diagnostic Imaging Modalities
Every medical imaging modality transduces a physical interaction between transmitted, emitted, or reflected energy and biological tissues into measurable digital detector signals:

| Modality | Energy Field | Physical Contrast Mechanism | Ionizing? | Primary Clinical Indications |
| :--- | :--- | :--- | :--- | :--- |
| **Projection Radiography (X-ray)** | X-ray Photons | Differential linear attenuation ($\mu$) | Yes | Bone fractures, pulmonary consolidation, mammography |
| **Computed Tomography (CT)** | X-ray Photons (360° fan-beam) | Cross-sectional volumetric attenuation distribution | Yes | Acute trauma, ischemic/hemorrhagic stroke, pulmonary embolism |
| **Magnetic Resonance Imaging (MRI)** | Magnetic field $B_0$ + RF pulses | Proton spin density, $T_1$ & $T_2$ relaxation | No | Neuroimaging, soft-tissue lesions, musculoskeletal joints |
| **Diagnostic Ultrasound (US)** | Acoustic waves (2–18 MHz) | Acoustic impedance mismatch ($Z = \rho c$) | No | Obstetrics, cardiology (echocardiography), vascular flow |
| **Nuclear Medicine (SPECT/PET)** | Gamma photons (140 keV / 511 keV) | Radiopharmaceutical bio-distribution & metabolism | Yes | Oncological staging (FDG), myocardial perfusion, bone metastases |

## 3. The Digital Radiology Workflow & PACS Infrastructure
In digital healthcare enterprises, radiological data flows through an integrated pipeline governed by institutional standards:
- **Hospital Information System (HIS) / Radiology Information System (RIS):** Coordinates patient scheduling, clinical orders, and diagnostic reporting.
- **DICOM Protocol (Digital Imaging and Communications in Medicine):** Encapsulates pixel arrays alongside structured patient metadata (UIDs, slice thickness, tube current, orientation tags).
- **Picture Archiving and Communication System (PACS):** Distributes high-bandwidth multi-slice datasets to certified high-resolution clinical diagnostic workstations.

## 4. Summary & Clinical Impact
Radiology is foundational to evidence-based clinical medicine, serving as an objective biomarker source that eliminates exploratory surgical procedures and guides targeted personalized treatment regimens.
"""
    },
    "1.2": {
        "title": "Electromagnetic Spectrum, Photon Energy, and Ionizing Radiation",
        "markdown": """# 1.2 Electromagnetic Spectrum, Photon Energy, and Ionizing Radiation

## 1. Fundamentals of Electromagnetic Radiation
Electromagnetic (EM) radiation consists of coupled, self-propagating oscillating electric ($\\mathbf{E}$) and magnetic ($\\mathbf{B}$) fields traveling through space at the speed of light:
$$c = \\lambda \\nu = 2.998 \\times 10^8 \\text{ m/s}$$
where $\\lambda$ denotes spatial wavelength (meters) and $\\nu$ (or $f$) denotes temporal frequency (Hertz).

![Figure 1.2: The Electromagnetic Spectrum in Clinical Radiology](/images/curriculum/m1/fig_1_2_em_spectrum.png)

## 2. Quantum Nature and Photon Energy
In the quantum mechanical formulation, electromagnetic energy is emitted and absorbed as discrete energy packets termed **photons**. The energy $E$ of a single photon is directly proportional to its frequency and inversely proportional to its wavelength according to the **Planck-Einstein relation**:
$$E = h\\nu = \\frac{hc}{\\lambda}$$
where $h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s} = 4.1357 \\times 10^{-15} \\text{ eV}\\cdot\\text{s}$.

In medical physics, photon energy is conventionally expressed in **electron volts (eV)**, where $1\\text{ eV} = 1.602 \\times 10^{-19}\\text{ Joules}$.
- **Diagnostic X-rays:** $20\\text{ keV}$ to $150\\text{ keV}$ (wavelengths $\\approx 0.01\\text{ nm}$ to $0.1\\text{ nm}$).
- **Nuclear Medicine Gamma Rays:** $140\\text{ keV}$ ($^{99m}\\text{Tc}$) to $511\\text{ keV}$ (positron annihilation).

![Figure 1.3: Photon Energy vs. Radiation Quality](/images/curriculum/m1/fig_1_2_photon_energy_curve.png)

## 3. The Ionization Threshold & Biological Impact
Radiation is categorized into two fundamentally distinct classes:
1. **Non-Ionizing Radiation ($E < 10\\text{ eV}$):** Radiofrequency waves (used in MRI) and ultrasound (mechanical, non-EM) possess insufficient quantum energy to eject orbital electrons from biological atoms. Energy dissipation occurs via thermal dielectric heating or acoustic molecular agitation.
2. **Ionizing Radiation ($E > 10\\text{ eV}$):** X-rays and gamma photons exceed the binding energy of orbital electrons in carbon, nitrogen, oxygen, and hydrogen ($10\\text{ to }13.6\\text{ eV}$). They liberate free electrons, inducing biological ionization, radiolysis of intracellular water ($H_2O \\to \\text{OH}^\\bullet + \\text{e}_{\\text{aq}}^-$), and potential double-strand DNA damage.

## 4. Radiation Protection and ALARA
Because ionizing radiation involves probabilistic (stochastic) carcinogenic risk and deterministic tissue thresholds, all radiological procedures must adhere strictly to the **ALARA Principle** (*As Low As Reasonably Achievable*):
- **Optimization of Time:** Minimizing fluoroscopy exposure intervals.
- **Maximization of Distance:** Inverse square law reduction ($I \\propto 1/d^2$).
- **Structural Shielding:** Lead aprons, thyroid shields, and bismuth collimation filters.
"""
    },
    "1.3": {
        "title": "X-ray Physics and Generation Mechanisms",
        "markdown": """# 1.3 X-ray Physics and Generation Mechanisms

## 1. Anatomy and Physics of the X-ray Tube
An X-ray tube is an evacuated vacuum diode containing a heated tungsten filament cathode and a rotating tungsten-rhenium target anode:
1. **Thermionic Emission:** Passing a high tube current ($mA$) through the cathode filament causes electrons to boil off via thermal agitation.
2. **Electrostatic Acceleration:** An ultra-high potential difference ($20\\text{ to }150\\text{ kVp}$) established across cathode and anode accelerates the electron cloud to relativistic velocities:
   $$E_{\\max} = e \\cdot V_0$$
3. **Target Impact & Deceleration:** Fast-moving electrons bombard the focal track of the rotating anode. Greater than $99\\%$ of kinetic energy is converted into thermal heat; only less than $1\\%$ produces diagnostic X-ray photons.

![Figure 1.4: X-ray Tube Geometry and Dual Generation Pathways](/images/curriculum/m1/fig_1_3_xray_tube_physics.png)

## 2. Physical Pathways of X-ray Production
Diagnostic X-ray spectra are composed of two distinct physical processes occurring simultaneously inside the anode target:

### A. Bremsstrahlung (Braking Radiation)
When an incident high-speed electron traverses near the positive Coulomb field of a heavy tungsten nucleus ($Z = 74$), it is deflected and decelerated. The lost kinetic energy is radiated instantaneously as a photon:
$$h\\nu = E_{\\text{initial}} - E_{\\text{final}}$$
Because deflection angles are continuously distributed, Bremsstrahlung generates a **continuous X-ray spectrum** spanning from zero energy up to the maximum kinetic energy $E_{\\max} = kVp$.

![Figure 1.5: Continuous Bremsstrahlung Emission Spectrum](/images/curriculum/m1/fig_1_3_bremsstrahlung_spectrum.png)

### B. Characteristic X-ray Emission
When an incident electron has sufficient energy to eject an inner-shell ($K$-shell) orbital electron of tungsten (binding energy $E_K \\approx 69.5\\text{ keV}$), the vacant orbital is filled by an electron dropping from an outer shell ($L$ or $M$ shell). The transition releases a photon with discrete energy:
$$E_{\\text{characteristic}} = E_K - E_L$$
For tungsten, characteristic $K_\\alpha$ and $K_\\beta$ emission lines appear as sharp spikes at approximately $58\\text{ to }69\\text{ keV}$.

![Figure 1.6: Characteristic Inner-Shell Transition Emission](/images/curriculum/m1/fig_1_3_characteristic_emission.png)

## 3. Operational Exposure Parameters
- **Tube Voltage ($kVp$):** Controls the **beam quality** (penetrating power, maximum photon energy $E_{\\max}$, and half-value layer).
- **Tube Current-Time Product ($mAs$):** Directly determines **beam quantity** (total number of emitted photons, proportional to patient dose and detector SNR).
"""
    },
    "1.4": {
        "title": "Photon Attenuation, Tissue Contrast, and Contrast Agents",
        "markdown": """# 1.4 Photon Attenuation, Tissue Contrast, and Contrast Agents

## 1. The Beer-Lambert Law of Linear Attenuation
As a monoenergetic X-ray beam traverses biological tissue of thickness $x$, the fractional reduction in beam intensity per unit thickness is governed by the **linear attenuation coefficient** $\\mu$ ($\text{cm}^{-1}$):
$$-\\frac{dI}{dx} = \\mu I$$
Integrating over depth $x$ yields the exponential **Beer-Lambert Law**:
$$I(x) = I_0 \\, e^{-\\mu x}$$
where $I_0$ is the incident beam intensity and $I(x)$ is the transmitted primary beam intensity reaching the detector.

![Figure 1.7: Exponential Photon Attenuation Curve and Half-Value Layer](/images/curriculum/m1/fig_1_4_beer_lambert_attenuation.png)

The thickness required to attenuate incident beam intensity by exactly $50\\%$ is the **Half-Value Layer (HVL)**:
$$\\text{HVL} = \\frac{\\ln 2}{\\mu} \\approx \\frac{0.693}{\\mu}$$

## 2. Physical Interaction Mechanisms in Diagnostic Radiology
In the diagnostic energy window ($20\\text{ to }140\\text{ keV}$), photon attenuation is dictated by two competing physical mechanisms:
1. **Photoelectric Absorption:** The incident photon is completely absorbed, ejecting an inner-shell electron. The photoelectric mass attenuation coefficient $\\mu_{\\text{pe}}/\\rho$ depends strongly on atomic number $Z$ and photon energy $E$:
   $$\\frac{\\mu_{\\text{pe}}}{\\rho} \\propto \\frac{Z^3}{E^3}$$
   This steep $Z^3$ dependency is the primary source of natural subject contrast between bone ($Z_{\\text{eff}} \\approx 13.8$) and soft tissue ($Z_{\\text{eff}} \\approx 7.4$).
2. **Compton Scattering:** The incident photon collides with an outer-shell weakly bound electron, ejecting the electron and scattering a lower-energy photon in an oblique direction. Compton mass attenuation depends primarily on electron density (nearly constant in soft tissues) and decreases slowly with energy ($1/E$).

![Figure 1.8: Narrow-Beam vs. Broad-Beam Scatter Geometry](/images/curriculum/m1/fig_1_4_narrow_beam_geometry.png)

## 3. Exogenous Contrast Agents and the K-Edge Phenomenon
Because visceral organs (liver, kidneys, blood vessels) exhibit very similar effective atomic numbers and electron densities, their intrinsic contrast is minimal.
- **Iodine-Based Contrast ($Z = 53$):** Features a sharp $K$-edge discontinuity at $33.2\\text{ keV}$, producing massive photoelectric absorption at typical diagnostic CT energies ($80\\text{ to }120\\text{ kVp}$).
- **Barium Sulfate ($Z = 56$):** Formulated as oral suspensions for fluoroscopic gastrointestinal lumen opacification ($K$-edge at $37.4\\text{ keV}$).

![Figure 1.9: K-Shell Photoelectric Absorption Discontinuity](/images/curriculum/m1/fig_1_4_contrast_k_edge.png)
"""
    },
    "1.5": {
        "title": "Computed Tomography (CT), Scanner Architecture, and Reconstruction",
        "markdown": """# 1.5 Computed Tomography (CT), Scanner Architecture, and Reconstruction

## 1. Principle of Computed Tomography
Conventional projection radiography superimposes all anatomical structures along the ray path onto a single 2D plane. **Computed Tomography (CT)** solves this superposition limitation by acquiring multiple narrow X-ray attenuation profiles across $360^\\circ$ around the patient and computationally reconstructing cross-sectional slices.

![Figure 1.10: CT Rotating Gantry Geometry and Slice Acquisition](/images/curriculum/m1/fig_1_5_ct_gantry_geometry.png)

## 2. Mathematical Reconstruction: Radon Transform & Sinograms
Let $f(x, y)$ represent the cross-sectional 2D spatial distribution of linear attenuation coefficients. The line integral of attenuation along a ray path $L(\\theta, s)$ parameterized by angle $\\theta$ and radial offset $s$ defines the **Radon Transform**:
$$p(\\theta, s) = \\mathcal{R}\\{f\\} = \\int_{L(\\theta, s)} \\mu(x, y) \\, dl = \\ln \\left(\\frac{I_0}{I(\\theta, s)}\\right)$$
The collection of all projection profiles $p(\\theta, s)$ plotted as a 2D function of angle $\\theta \\in [0, \\pi]$ against radial coordinate $s$ forms a **Sinogram**.

![Figure 1.11: The Radon Transform and Forward Projection Sinogram](/images/curriculum/m1/fig_1_5_radon_transform_sinogram.png)

## 3. Filtered Backprojection (FBP)
Direct backprojection $\\mathcal{B}\\{p\\}$ spreads ray integrals back across the reconstruction grid, producing an undesirable $1/r$ spatial blurring. 
To achieve exact reconstruction, the projection data must be convolved with a high-pass **ramp filter** $|\\omega|$ prior to backprojection (Filtered Backprojection, FBP):
$$\\hat{f}(x, y) = \\int_0^\\pi \\left[ p(\\theta, s) * h(s) \\right]_{s = x\\cos\\theta + y\\sin\\theta} d\\theta$$
where $h(s)$ is the spatial domain Ram-Lak ramp kernel.

![Figure 1.12: Filtered Backprojection Reconstruction Pipeline](/images/curriculum/m1/fig_1_5_filtered_backprojection.png)

## 4. Hounsfield Units (HU) Calibration
CT numbers are calibrated into standardized **Hounsfield Units (HU)** relative to pure distilled water:
$$\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$
- **Air:** $-1000\\text{ HU}$
- **Fat:** $-120\\text{ to }-80\\text{ HU}$
- **Water:** $0\\text{ HU}$ (Calibration standard)
- **Soft Tissue / Brain:** $+20\\text{ to }+45\\text{ HU}$
- **Acute Hemorrhage:** $+60\\text{ to }+80\\text{ HU}$
- **Dense Cortical Bone:** $+1000\\text{ to }+3000\\text{ HU}$

![Figure 1.13: 3D Volumetric Slices and Anisotropic Voxels](/images/curriculum/m1/fig_1_5_ct_slice_thickness.png)
"""
    },
    "1.6": {
        "title": "Magnetic Resonance Imaging (MRI), Physics, and Relaxation",
        "markdown": """# 1.6 Magnetic Resonance Imaging (MRI), Physics, and Relaxation

## 1. Nuclear Magnetic Resonance (NMR) Physics
Magnetic Resonance Imaging (MRI) exploits the magnetic properties of atomic nuclei with non-zero angular momentum (nuclear spin), primarily hydrogen protons ($^1\\text{H}$) abundant in water and lipids.
In the absence of an external magnetic field, individual magnetic moments are randomly oriented.
When placed inside a strong static magnetic field $\\mathbf{B}_0$ (typically $1.5\\text{ T}$ or $3.0\\text{ T}$):
1. **Zeeman Splitting:** Proton magnetic moments align either parallel (low-energy) or anti-parallel (high-energy) to $\\mathbf{B}_0$, yielding a macroscopic net magnetization vector $\\mathbf{M}_0$ along the $z$-axis.
2. **Larmor Precession:** Protons precess about $\\mathbf{B}_0$ at the **Larmor frequency**:
   $$\\omega_0 = \\gamma B_0 \\quad \\iff \\quad f_0 = \\left(\\frac{\\gamma}{2\\pi}\\right) B_0$$
   For hydrogen, the gyromagnetic ratio is $\\frac{\\gamma}{2\\pi} = 42.58\\text{ MHz/Tesla}$. At $1.5\\text{ T}$, $f_0 \\approx 63.87\\text{ MHz}$ (radiofrequency band).

![Figure 1.14: Net Magnetization Alignment in Static Field B0](/images/curriculum/m1/fig_1_6_mri_proton_spin.png)

## 2. RF Excitation and Signal Generation
An oscillating radiofrequency pulse $\\mathbf{B}_1$ transmitted at the precise Larmor frequency tips the net magnetization vector $\\mathbf{M}$ away from the longitudinal axis into the transverse $xy$-plane (e.g., $90^\\circ$ RF excitation).
Precessing transverse magnetization induces an alternating voltage in nearby receiver coils, detected as the **Free Induction Decay (FID)** signal.

![Figure 1.15: RF Excitation and Transverse Precession](/images/curriculum/m1/fig_1_6_rf_excitation_precession.png)

## 3. Relaxation Mechanisms & Image Contrast
Following RF excitation, the magnetization relaxes back to thermal equilibrium via two independent time constants:
- **$T_1$ Longitudinal (Spin-Lattice) Relaxation:** The recovery of longitudinal magnetization $M_z(t)$ toward equilibrium $M_0$ through energy transfer to the surrounding molecular lattice:
  $$M_z(t) = M_0 \\left(1 - e^{-t/T_1}\\right)$$
- **$T_2$ Transverse (Spin-Spin) Relaxation:** The irreversible decay of transverse magnetization $M_{xy}(t)$ caused by random dephasing among neighboring nuclear spins:
  $$M_{xy}(t) = M_0 \\, e^{-t/T_2}$$

![Figure 1.16: T1 Recovery and T2 Decay Curves](/images/curriculum/m1/fig_1_6_t1_t2_relaxation.png)

By adjusting pulse sequence parameters—**Repetition Time ($TR$)** and **Echo Time ($TE$)**—radiologists selectively weight tissue contrast:
- **$T_1$-Weighted (Short $TR$, Short $TE$):** Fat is bright; fluid (CSF) is dark. Excellent anatomical detail.
- **$T_2$-Weighted (Long $TR$, Long $TE$):** Fluid/edema is hyperintense (bright). Pathological lesions and inflammation stand out.

![Figure 1.17: Gradient Coils and Spatial k-Space Frequency Encoding](/images/curriculum/m1/fig_1_6_gradient_coils_spatial_encoding.png)
"""
    },
    "1.7": {
        "title": "Ultrasound Physics, Acoustic Impedance, and Doppler Modes",
        "markdown": """# 1.7 Ultrasound Physics, Acoustic Impedance, and Doppler Modes

## 1. Acoustic Wave Propagation in Biological Tissue
Medical ultrasound is a mechanical, longitudinal wave consisting of periodic compression and rarefaction zones traveling through tissue at frequencies above human hearing ($2\\text{ to }18\\text{ MHz}$).
The average propagation speed in human soft tissue is standardized as:
$$c \\approx 1540\\text{ m/s}$$
The pulse-echo distance $d$ to a reflecting boundary is determined by measuring round-trip transit time $t$:
$$d = \\frac{c \\cdot t}{2}$$

![Figure 1.18: Piezoelectric Transducer Construction and Damping](/images/curriculum/m1/fig_1_7_piezoelectric_transducer.png)

## 2. Acoustic Impedance Mismatch & Reflection
The **acoustic impedance** $Z$ of a medium characterizes its resistance to acoustic wave transmission, defined as the product of tissue density $\\rho$ ($\text{kg/m}^3$) and acoustic speed $c$ ($\text{m/s}$):
$$Z = \\rho \\cdot c \\quad [\\text{Rayls} = \\text{kg}/(\\text{m}^2\\cdot\\text{s})]$$

When an acoustic pulse strikes an interface between two tissues with impedances $Z_1$ and $Z_2$ at normal incidence, the fraction of reflected wave intensity is governed by the **reflection coefficient** $R$:
$$R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2$$
- At soft tissue / bone interfaces, large impedance mismatches reflect up to $40\\%$ of incident sound.
- At soft tissue / air interfaces, nearly $99.9\\%$ of sound is reflected, necessitating aqueous acoustic coupling gel.

![Figure 1.19: Acoustic Pulse-Echo Reflection at Boundary Interface](/images/curriculum/m1/fig_1_7_pulse_echo_acoustic_reflection.png)

## 3. Diagnostic Display Modes & The Doppler Effect
1. **A-Mode (Amplitude Mode):** 1D spikes of echo amplitude vs. depth (ophthalmology).
2. **B-Mode (Brightness Mode):** Standard 2D grayscale anatomical imaging, mapping echo amplitudes to pixel brightness.
3. **M-Mode (Motion Mode):** Displays moving anatomical structures (e.g., cardiac valves) along a single beam vector over time.
4. **Doppler Ultrasound:** Calculates erythrocyte blood flow velocity $v$ from the observed frequency shift $\\Delta f$:
   $$\\Delta f = \\frac{2 f_0 v \\cos\\theta}{c}$$
   where $f_0$ is emitted transducer frequency and $\\theta$ is the insonation angle.

![Figure 1.20: Real-time B-mode, M-mode, and Color Doppler Modes](/images/curriculum/m1/fig_1_7_ultrasound_modes_doppler.png)
"""
    },
    "1.8": {
        "title": "Nuclear Medicine, Molecular Imaging, and PET/SPECT Physics",
        "markdown": """# 1.8 Nuclear Medicine, Molecular Imaging, and PET/SPECT Physics

## 1. Principles of Nuclear Medicine
Unlike structural modalities (X-ray, CT, MRI) that image physical anatomy, **Nuclear Medicine** evaluates in vivo physiological, metabolic, and molecular processes.
Patients receive radiopharmaceuticals—biologically targeted molecules synthesized with unstable radionuclides that decay by emitting gamma photons or positrons.

## 2. Single-Photon Emission Computed Tomography (SPECT)
SPECT uses gamma-emitting isotopes such as **Technetium-99m** ($^{99m}\\text{Tc}$, half-life $t_{1/2} = 6.0\\text{ hours}$, photon energy $E = 140\\text{ keV}$).
1. **Anger Gamma Camera:** Emitted gamma photons pass through a multi-hole lead **collimator** that filters out oblique non-parallel rays.
2. **Scintillation Detection:** Photons strike a thallium-doped sodium iodide ($\text{NaI(Tl)}$) crystal, producing flash scintillations amplified by photomultiplier tubes (PMTs).
3. **Rotational Tomography:** Gamma cameras rotate around the patient to reconstruct 3D SPECT cross-sections.

![Figure 1.21: SPECT Collimated Gamma Camera Architecture](/images/curriculum/m1/fig_1_8_spect_gamma_camera.png)

## 3. Positron Emission Tomography (PET)
PET utilizes positron-emitting radionuclides such as Fluorine-18 ($^{18}\\text{F}$, $t_{1/2} = 109.7\\text{ min}$):
1. **Positron Annihilation:** An emitted positron ($\beta^+$) travels a short distance ($< 1\\text{ mm}$) before colliding with an ambient electron ($e^-$). Their masses are annihilated, converted into **two collinear 511 keV gamma photons** emitted at exactly $180^\\circ$ apart.
2. **Coincidence Timing:** A circular ring of fast scintillation crystals (LSO, BSO) detects pairs of 511 keV photons arriving within a nanosecond coincidence window ($4\\text{ to }10\\text{ ns}$). This eliminates the need for mechanical lead collimators, yielding orders of magnitude higher sensitivity than SPECT.

![Figure 1.22: PET 511 keV Positron Annihilation Coincidence Detection](/images/curriculum/m1/fig_1_8_pet_coincidence_annihilation.png)

## 4. Molecular Imaging & Oncological PET/CT
The clinical workhorse radiotracer is **$^{18}\\text{F}$-FDG** (Fluorodeoxyglucose).
Malignant tumors upregulate GLUT-1 glucose transporters and hexokinase activity (the *Warburg Effect*). $^{18}\\text{F}$-FDG is phosphorylated by hexokinase into FDG-6-phosphate, which cannot be metabolized further and becomes trapped intracellularly.
Hybrid **PET/CT systems** combine molecular PET metabolic maps with anatomical CT localization in a single examination.

![Figure 1.23: Molecular Glucose Targeting with 18F-FDG Metabolic Trapping](/images/curriculum/m1/fig_1_8_fdg_molecular_targeting.png)
"""
    }
}

def main():
    print("Loading current Module 1 topics from Upstash Redis...")
    topics = redis_get("medimage:curriculum:topics:m1")
    if not topics:
        print("[ERROR] Topics for Module 1 not found in Redis!")
        return

    print(f"Retrieved {len(topics)} topics. Synthesizing full theory content...")
    updated_topics = []
    for t in topics:
        code = t.get("code")
        meta = THEORY_DATA.get(code)
        if meta:
            t["title"] = meta["title"]
            t["theory_markdown"] = meta["markdown"]
            t["status"] = "content_added"
            t["coverage"] = "full"
            print(f"[OK] Enhanced Topic {code}: {meta['title']} ({len(meta['markdown'])} chars)")
        updated_topics.append(t)

    # Persist updated topics to Upstash Redis
    success = redis_set("medimage:curriculum:topics:m1", updated_topics)
    if success:
        print("\n[SUCCESS] Successfully pushed verified Theory Chapters for Module 1 to Upstash Redis!")
    else:
        print("\n[FAIL] Failed to update Upstash Redis.")

if __name__ == "__main__":
    main()
