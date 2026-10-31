import { QuickCheckQuestion } from "@/components/topic/QuickCheckQuiz";

/**
 * 5 Formative Concept Reinforcement MCQs for every subtopic across Modules 1 to 6.
 * Total 36 Subtopics x 5 MCQs = 180 comprehensive topic-specific questions.
 */
export const SUBTOPIC_5_MCQS_REGISTRY: Record<string, QuickCheckQuestion[]> = {
  "m1-t1-radiology": [
    {
        "id": "subqc-m1-t1-radiology-1",
        "question_text": "What is the primary physical interaction measured by Computed Tomography (CT)?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "X-ray photon attenuation through 3D tissue voxels"
            },
            {
                "id": "B",
                "text": "Proton spin precessional relaxation"
            },
            {
                "id": "C",
                "text": "Acoustic impedance mismatch"
            },
            {
                "id": "D",
                "text": "Radioactive decay half-life"
            }
        ],
        "correct_option_id": "A",
        "explanation": "CT measures the linear attenuation coefficient of tissues along projection lines, calibrated to Hounsfield Units."
    },
    {
        "id": "subqc-m1-t1-radiology-2",
        "question_text": "Which imaging modality is governed strictly by the ALARA principle?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Magnetic Resonance Imaging"
            },
            {
                "id": "A",
                "text": "Computed Tomography and Projection Radiography"
            },
            {
                "id": "C",
                "text": "Diagnostic B-mode Ultrasound"
            },
            {
                "id": "D",
                "text": "Optical Coherence Tomography"
            }
        ],
        "correct_option_id": "B",
        "explanation": "ALARA (As Low As Reasonably Achievable) applies exclusively to ionizing radiation modalities (X-ray, CT, nuclear medicine)."
    },
    {
        "id": "subqc-m1-t1-radiology-3",
        "question_text": "Why is Ultrasound favored over CT for routine obstetrical fetal monitoring?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "It provides larger field-of-view than CT"
            },
            {
                "id": "B",
                "text": "It offers superior bone cortical penetration"
            },
            {
                "id": "A",
                "text": "It utilizes mechanical sound waves with zero teratogenic radiation risk"
            },
            {
                "id": "D",
                "text": "It penetrates gas-filled bowel easily"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Ultrasound is non-ionizing and presents no mutagenic or teratogenic hazards to fetal tissue."
    },
    {
        "id": "subqc-m1-t1-radiology-4",
        "question_text": "What tissue parameter does Magnetic Resonance Imaging (MRI) fundamentally detect?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Acoustic reflection coefficient"
            },
            {
                "id": "B",
                "text": "Electron density per cubic centimeter"
            },
            {
                "id": "C",
                "text": "Linear X-ray attenuation coefficient"
            },
            {
                "id": "A",
                "text": "Proton density and relaxation times (T1, T2) of hydrogen nuclei"
            }
        ],
        "correct_option_id": "D",
        "explanation": "MRI relies on the abundant hydrogen protons in water and fat, exciting them with RF energy and measuring their relaxation."
    },
    {
        "id": "subqc-m1-t1-radiology-5",
        "question_text": "What is a major clinical contraindication for standard MRI examinations?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Non-MRI-conditional cardiac pacemakers and metallic intraocular foreign bodies"
            },
            {
                "id": "B",
                "text": "Severe iodine contrast allergy"
            },
            {
                "id": "C",
                "text": "Pregnancy in second trimester"
            },
            {
                "id": "D",
                "text": "Recent barium fluoroscopy swallow"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Ferromagnetic implants experience severe torques and RF heating in high static magnetic fields."
    }
],

  "m1-t2-electromagnetic-spectrum": [
    {
        "id": "subqc-m1-t2-electromagnetic-spectrum-1",
        "question_text": "What is the approximate quantum energy threshold required for electromagnetic radiation to ionize biological atoms?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "10 eV"
            },
            {
                "id": "B",
                "text": "1.24 keV"
            },
            {
                "id": "C",
                "text": "511 keV"
            },
            {
                "id": "D",
                "text": "64 MHz"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Radiation exceeding ~10 eV (ultraviolet and beyond) carries sufficient energy to liberate atomic valence electrons and create free radicals."
    },
    {
        "id": "subqc-m1-t2-electromagnetic-spectrum-2",
        "question_text": "According to Planck's law E = hc / \u03bb, how does photon energy vary with wavelength?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Directly proportional: longer wavelength produces higher energy"
            },
            {
                "id": "A",
                "text": "Inversely proportional: shorter wavelength produces higher quantum energy"
            },
            {
                "id": "C",
                "text": "Independent of wavelength"
            },
            {
                "id": "D",
                "text": "Quadratic with wavelength"
            }
        ],
        "correct_option_id": "B",
        "explanation": "E = hc/lambda demonstrates that decreasing wavelength increases photon energy."
    },
    {
        "id": "subqc-m1-t2-electromagnetic-spectrum-3",
        "question_text": "What is the frequency of RF excitation pulses used in a 1.5 Tesla clinical MRI scanner for hydrogen protons?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "140 keV"
            },
            {
                "id": "B",
                "text": "127.74 MHz"
            },
            {
                "id": "A",
                "text": "63.87 MHz"
            },
            {
                "id": "D",
                "text": "511 keV"
            }
        ],
        "correct_option_id": "C",
        "explanation": "From the Larmor equation f = (gamma/2pi) * B0 = 42.58 MHz/T * 1.5 T = 63.87 MHz."
    },
    {
        "id": "subqc-m1-t2-electromagnetic-spectrum-4",
        "question_text": "What physical characteristic distinguishes 140 keV X-ray photons from 140 keV gamma photons?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Linear energy transfer in tissue"
            },
            {
                "id": "B",
                "text": "Speed of propagation through vacuum"
            },
            {
                "id": "C",
                "text": "Wave-particle duality ratio"
            },
            {
                "id": "A",
                "text": "Physical point of origin (electron shell deceleration vs nuclear decay)"
            }
        ],
        "correct_option_id": "D",
        "explanation": "X-rays originate from electron interactions outside the nucleus; gamma photons originate from the atomic nucleus during decay."
    },
    {
        "id": "subqc-m1-t2-electromagnetic-spectrum-5",
        "question_text": "What wavelength corresponds to a 100 keV diagnostic X-ray photon?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "0.0124 nm"
            },
            {
                "id": "B",
                "text": "0.124 nm"
            },
            {
                "id": "C",
                "text": "1.24 nm"
            },
            {
                "id": "D",
                "text": "12.4 nm"
            }
        ],
        "correct_option_id": "A",
        "explanation": "lambda = 1.24 / E[keV] = 1.24 / 100 = 0.0124 nm."
    }
],

  "m1-t3-xray-physics": [
    {
        "id": "subqc-m1-t3-xray-physics-1",
        "question_text": "What percentage of incident electron kinetic energy is typically converted into X-rays in a standard diagnostic tube?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "~1%"
            },
            {
                "id": "B",
                "text": "~99%"
            },
            {
                "id": "C",
                "text": "~50%"
            },
            {
                "id": "D",
                "text": "~25%"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Over 99% of electron kinetic energy is dissipated as thermal heat in the tungsten target; less than 1% yields X-rays."
    },
    {
        "id": "subqc-m1-t3-xray-physics-2",
        "question_text": "Which X-ray interaction process dominates at low energies (<50 keV) and high atomic numbers (Z)?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Compton Scattering"
            },
            {
                "id": "A",
                "text": "Photoelectric Absorption"
            },
            {
                "id": "C",
                "text": "Pair Production"
            },
            {
                "id": "D",
                "text": "Coherent Rayleigh Scattering"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Photoelectric probability scales as Z^3 / E^3, providing the primary contrast mechanism between bone and soft tissue."
    },
    {
        "id": "subqc-m1-t3-xray-physics-3",
        "question_text": "Why are anti-scatter grids positioned between the patient and digital flat-panel detector?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "To reduce patient skin entrance dose"
            },
            {
                "id": "B",
                "text": "To increase tube kVp efficiency"
            },
            {
                "id": "A",
                "text": "To absorb oblique Compton scattered photons and restore subject contrast"
            },
            {
                "id": "D",
                "text": "To focus the Bremsstrahlung beam"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Compton scattering introduces uniform non-diagnostic background haze; lead grid septa absorb scattered photons."
    },
    {
        "id": "subqc-m1-t3-xray-physics-4",
        "question_text": "How does increasing tube potential (kVp) affect the X-ray beam?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Eliminates Compton scatter"
            },
            {
                "id": "B",
                "text": "Decreases photon penetration"
            },
            {
                "id": "C",
                "text": "Increases image contrast without affecting dose"
            },
            {
                "id": "A",
                "text": "Increases mean photon penetration and decreases image contrast"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Higher kVp increases beam energy and penetrability, reducing subject contrast because Compton scatter becomes more dominant."
    },
    {
        "id": "subqc-m1-t3-xray-physics-5",
        "question_text": "What parameter governs total photon flux (quantity) emitted by the X-ray tube?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "mAs (tube current mA multiplied by exposure time in seconds)"
            },
            {
                "id": "B",
                "text": "kVp peak voltage"
            },
            {
                "id": "C",
                "text": "Source-to-Image Distance (SID)"
            },
            {
                "id": "D",
                "text": "Anode angle"
            }
        ],
        "correct_option_id": "A",
        "explanation": "mAs directly controls the number of electrons crossing the tube, dictating total photon fluence."
    }
],

  "m1-t4-attenuation-imaging": [
    {
        "id": "subqc-m1-t4-attenuation-imaging-1",
        "question_text": "What law governs monochromatic X-ray beam attenuation through a homogeneous absorber?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Beer-Lambert Law: I = I_0 * exp(-\u03bc * x)"
            },
            {
                "id": "B",
                "text": "Planck's Radiation Law"
            },
            {
                "id": "C",
                "text": "Radon Inversion Theorem"
            },
            {
                "id": "D",
                "text": "Nyquist-Shannon Sampling Theorem"
            }
        ],
        "correct_option_id": "A",
        "explanation": "The Beer-Lambert law describes exponential photon attenuation as a function of linear attenuation coefficient mu and thickness x."
    },
    {
        "id": "subqc-m1-t4-attenuation-imaging-2",
        "question_text": "What is the Half-Value Layer (HVL) of an absorbing material?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Thickness required to eliminate 99% of beam energy"
            },
            {
                "id": "A",
                "text": "Thickness required to reduce incident beam intensity to exactly 50%"
            },
            {
                "id": "C",
                "text": "Mean free path of Compton photons"
            },
            {
                "id": "D",
                "text": "Equivalent aluminum filtration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "HVL = ln(2) / mu represents the thickness of material needed to attenuate half the incident intensity."
    },
    {
        "id": "subqc-m1-t4-attenuation-imaging-3",
        "question_text": "What causes the beam hardening artifact in polychromatic diagnostic X-ray beams?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "Anode target thermal expansion"
            },
            {
                "id": "B",
                "text": "Compton scatter angular deviation"
            },
            {
                "id": "A",
                "text": "Preferential absorption of low-energy soft photons, increasing mean beam energy"
            },
            {
                "id": "D",
                "text": "Detector electronic noise saturation"
            }
        ],
        "correct_option_id": "C",
        "explanation": "As a polychromatic beam traverses tissue, low-energy photons are filtered out first, making the remaining beam harder and more penetrating."
    },
    {
        "id": "subqc-m1-t4-attenuation-imaging-4",
        "question_text": "How does linear attenuation coefficient \u03bc relate to mass attenuation coefficient (\u03bc/\u03c1)?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "\u03bc = (\u03bc/\u03c1)^2"
            },
            {
                "id": "B",
                "text": "\u03bc = (\u03bc/\u03c1) / \u03c1"
            },
            {
                "id": "C",
                "text": "\u03bc is independent of density"
            },
            {
                "id": "A",
                "text": "\u03bc = (\u03bc/\u03c1) * \u03c1 (mass attenuation multiplied by physical density)"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Mass attenuation coefficient is an intrinsic material property independent of physical density; multiplying by density gives linear attenuation."
    },
    {
        "id": "subqc-m1-t4-attenuation-imaging-5",
        "question_text": "Why does cortical bone attenuate X-rays far more strongly than soft tissue at 40 keV?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Bone contains calcium (Z=20) with much higher effective atomic number than soft tissue (Z~7.4)"
            },
            {
                "id": "B",
                "text": "Bone has higher water content"
            },
            {
                "id": "C",
                "text": "Bone emits secondary radiofrequency waves"
            },
            {
                "id": "D",
                "text": "Bone exhibits zero Compton scattering"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Photoelectric absorption scales with Z^3; calcium's higher Z gives bone dramatically stronger attenuation at diagnostic energies."
    }
],

  "m1-t5-computed-tomography": [
    {
        "id": "subqc-m1-t5-computed-tomography-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M1 T5 Computed Tomography?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M1 T5 Computed Tomography"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M1 T5 Computed Tomography."
    },
    {
        "id": "subqc-m1-t5-computed-tomography-2",
        "question_text": "How is performance quantitatively benchmarked in M1 T5 Computed Tomography?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M1 T5 Computed Tomography."
    },
    {
        "id": "subqc-m1-t5-computed-tomography-3",
        "question_text": "Which artifact or source of error is most prevalent in M1 T5 Computed Tomography?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M1 T5 Computed Tomography."
    },
    {
        "id": "subqc-m1-t5-computed-tomography-4",
        "question_text": "In clinical decision-making, when is M1 T5 Computed Tomography specifically indicated?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M1 T5 Computed Tomography to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m1-t5-computed-tomography-5",
        "question_text": "What standardized format or guideline governs M1 T5 Computed Tomography?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m1-t6-mri-tomography": [
    {
        "id": "subqc-m1-t6-mri-tomography-1",
        "question_text": "What is the Larmor equation governing nuclear magnetic resonance?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "\u03c9_0 = \u03b3 * B_0"
            },
            {
                "id": "B",
                "text": "E = h * f"
            },
            {
                "id": "C",
                "text": "I = I_0 * exp(-\u03bcx)"
            },
            {
                "id": "D",
                "text": "g(x,y) = f(x,y) * h(x,y)"
            }
        ],
        "correct_option_id": "A",
        "explanation": "The Larmor equation states that precession frequency omega_0 is directly proportional to gyromagnetic ratio gamma and static field B_0."
    },
    {
        "id": "subqc-m1-t6-mri-tomography-2",
        "question_text": "What does T1 relaxation time (spin-lattice) represent?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Decay of transverse magnetization in XY plane"
            },
            {
                "id": "A",
                "text": "Recovery of longitudinal magnetization along the Z-axis (B_0)"
            },
            {
                "id": "C",
                "text": "Precession phase dispersion from field inhomogeneities"
            },
            {
                "id": "D",
                "text": "Spin echo echo-time interval"
            }
        ],
        "correct_option_id": "B",
        "explanation": "T1 relaxation measures the rate at which proton spins exchange energy with the surrounding molecular lattice to recover longitudinal alignment."
    },
    {
        "id": "subqc-m1-t6-mri-tomography-3",
        "question_text": "What does T2 relaxation time (spin-spin) represent?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "Chemical shift frequency difference"
            },
            {
                "id": "B",
                "text": "Recovery of longitudinal magnetization"
            },
            {
                "id": "A",
                "text": "Loss of phase coherence and decay of transverse magnetization in XY plane"
            },
            {
                "id": "D",
                "text": "RF pulse flip angle duration"
            }
        ],
        "correct_option_id": "C",
        "explanation": "T2 relaxation describes irreversible loss of phase coherence among precessing proton spins due to local magnetic field interactions."
    },
    {
        "id": "subqc-m1-t6-mri-tomography-4",
        "question_text": "In MRI spatial encoding, what gradient is used during RF excitation to select the slice plane?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Diffusion-weighting gradient"
            },
            {
                "id": "B",
                "text": "Phase-encoding gradient (G_pe)"
            },
            {
                "id": "C",
                "text": "Frequency-encoding gradient (G_fe)"
            },
            {
                "id": "A",
                "text": "Slice-selection gradient (G_ss)"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Applying a magnetic field gradient during selective RF pulse excitation restricts resonance to a single anatomical slice plane."
    },
    {
        "id": "subqc-m1-t6-mri-tomography-5",
        "question_text": "What contrast weighting makes free water (CSF, edema) appear bright white?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "T2-weighted imaging (long TR, long TE)"
            },
            {
                "id": "B",
                "text": "T1-weighted imaging (short TR, short TE)"
            },
            {
                "id": "C",
                "text": "Proton density weighting"
            },
            {
                "id": "D",
                "text": "Inversion recovery with FLAIR"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Fluid has long T2 relaxation; utilizing a long Echo Time (TE > 80 ms) preserves fluid signal while allowing solid tissue signal to decay."
    }
],

  "m1-t7-ultrasound": [
    {
        "id": "subqc-m1-t7-ultrasound-1",
        "question_text": "What determines the acoustic impedance (Z) of a biological tissue?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Z = \u03c1 * c (tissue physical density multiplied by acoustic speed)"
            },
            {
                "id": "B",
                "text": "Z = frequency / wavelength"
            },
            {
                "id": "C",
                "text": "Z = attenuation * depth"
            },
            {
                "id": "D",
                "text": "Z = pressure / intensity"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Acoustic impedance is the product of tissue density rho and sound propagation velocity c (average 1540 m/s in soft tissue)."
    },
    {
        "id": "subqc-m1-t7-ultrasound-2",
        "question_text": "What physical process produces diagnostic B-mode ultrasound reflections?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Photoelectric ionization"
            },
            {
                "id": "A",
                "text": "Acoustic impedance mismatch at tissue boundaries"
            },
            {
                "id": "C",
                "text": "Nuclear magnetic precession"
            },
            {
                "id": "D",
                "text": "Compton scatter deflection"
            }
        ],
        "correct_option_id": "B",
        "explanation": "When an ultrasound wave strikes an interface between tissues with differing acoustic impedances, a fraction of the wave reflects back as an echo."
    },
    {
        "id": "subqc-m1-t7-ultrasound-3",
        "question_text": "Why is acoustic gel applied between the transducer and patient skin?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "To disinfect the skin surface"
            },
            {
                "id": "B",
                "text": "To cool the piezoelectric crystals"
            },
            {
                "id": "A",
                "text": "To eliminate ambient air pockets that cause total acoustic reflection"
            },
            {
                "id": "D",
                "text": "To accelerate sound velocity"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Air has extremely low acoustic impedance compared to soft tissue, reflecting >99.9% of sound waves; acoustic gel provides impedance matching."
    },
    {
        "id": "subqc-m1-t7-ultrasound-4",
        "question_text": "What phenomenon causes acoustic shadowing behind gallstones or cortical bone?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Side-lobe artifact"
            },
            {
                "id": "B",
                "text": "Refraction through fluid"
            },
            {
                "id": "C",
                "text": "Mirror image multi-path reflections"
            },
            {
                "id": "A",
                "text": "High acoustic attenuation and reflection leaving negligible sound energy beyond the structure"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Highly reflective or attenuative structures absorb/reflect the beam, casting a dark acoustic shadow distally."
    },
    {
        "id": "subqc-m1-t7-ultrasound-5",
        "question_text": "What clinical application relies on the Doppler frequency shift in ultrasound?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Measuring blood flow velocity and direction in vascular vessels and cardiac valves"
            },
            {
                "id": "B",
                "text": "Quantifying tissue elasticity"
            },
            {
                "id": "C",
                "text": "Determining bone density"
            },
            {
                "id": "D",
                "text": "Measuring fetal head circumference"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Moving red blood cells shift the frequency of reflected sound waves, enabling real-time color and spectral flow velocity measurements."
    }
],

  "m1-t8-nuclear-medicine": [
    {
        "id": "subqc-m1-t8-nuclear-medicine-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M1 T8 Nuclear Medicine?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M1 T8 Nuclear Medicine"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M1 T8 Nuclear Medicine."
    },
    {
        "id": "subqc-m1-t8-nuclear-medicine-2",
        "question_text": "How is performance quantitatively benchmarked in M1 T8 Nuclear Medicine?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M1 T8 Nuclear Medicine."
    },
    {
        "id": "subqc-m1-t8-nuclear-medicine-3",
        "question_text": "Which artifact or source of error is most prevalent in M1 T8 Nuclear Medicine?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M1 T8 Nuclear Medicine."
    },
    {
        "id": "subqc-m1-t8-nuclear-medicine-4",
        "question_text": "In clinical decision-making, when is M1 T8 Nuclear Medicine specifically indicated?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M1 T8 Nuclear Medicine to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m1-t8-nuclear-medicine-5",
        "question_text": "What standardized format or guideline governs M1 T8 Nuclear Medicine?",
        "co_tag": "CO1",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m2-t1-image-databases": [
    {
        "id": "subqc-m2-t1-image-databases-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M2 T1 Image Databases?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M2 T1 Image Databases"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M2 T1 Image Databases."
    },
    {
        "id": "subqc-m2-t1-image-databases-2",
        "question_text": "How is performance quantitatively benchmarked in M2 T1 Image Databases?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M2 T1 Image Databases."
    },
    {
        "id": "subqc-m2-t1-image-databases-3",
        "question_text": "Which artifact or source of error is most prevalent in M2 T1 Image Databases?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M2 T1 Image Databases."
    },
    {
        "id": "subqc-m2-t1-image-databases-4",
        "question_text": "In clinical decision-making, when is M2 T1 Image Databases specifically indicated?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M2 T1 Image Databases to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m2-t1-image-databases-5",
        "question_text": "What standardized format or guideline governs M2 T1 Image Databases?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m2-t2-intensity-operations": [
    {
        "id": "subqc-m2-t2-intensity-operations-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M2 T2 Intensity Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M2 T2 Intensity Operations"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M2 T2 Intensity Operations."
    },
    {
        "id": "subqc-m2-t2-intensity-operations-2",
        "question_text": "How is performance quantitatively benchmarked in M2 T2 Intensity Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M2 T2 Intensity Operations."
    },
    {
        "id": "subqc-m2-t2-intensity-operations-3",
        "question_text": "Which artifact or source of error is most prevalent in M2 T2 Intensity Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M2 T2 Intensity Operations."
    },
    {
        "id": "subqc-m2-t2-intensity-operations-4",
        "question_text": "In clinical decision-making, when is M2 T2 Intensity Operations specifically indicated?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M2 T2 Intensity Operations to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m2-t2-intensity-operations-5",
        "question_text": "What standardized format or guideline governs M2 T2 Intensity Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m2-t3-filter-operations": [
    {
        "id": "subqc-m2-t3-filter-operations-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M2 T3 Filter Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M2 T3 Filter Operations"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M2 T3 Filter Operations."
    },
    {
        "id": "subqc-m2-t3-filter-operations-2",
        "question_text": "How is performance quantitatively benchmarked in M2 T3 Filter Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M2 T3 Filter Operations."
    },
    {
        "id": "subqc-m2-t3-filter-operations-3",
        "question_text": "Which artifact or source of error is most prevalent in M2 T3 Filter Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M2 T3 Filter Operations."
    },
    {
        "id": "subqc-m2-t3-filter-operations-4",
        "question_text": "In clinical decision-making, when is M2 T3 Filter Operations specifically indicated?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M2 T3 Filter Operations to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m2-t3-filter-operations-5",
        "question_text": "What standardized format or guideline governs M2 T3 Filter Operations?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m2-t4-clinical-segmentation": [
    {
        "id": "subqc-m2-t4-clinical-segmentation-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M2 T4 Clinical Segmentation?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M2 T4 Clinical Segmentation"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M2 T4 Clinical Segmentation."
    },
    {
        "id": "subqc-m2-t4-clinical-segmentation-2",
        "question_text": "How is performance quantitatively benchmarked in M2 T4 Clinical Segmentation?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M2 T4 Clinical Segmentation."
    },
    {
        "id": "subqc-m2-t4-clinical-segmentation-3",
        "question_text": "Which artifact or source of error is most prevalent in M2 T4 Clinical Segmentation?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M2 T4 Clinical Segmentation."
    },
    {
        "id": "subqc-m2-t4-clinical-segmentation-4",
        "question_text": "In clinical decision-making, when is M2 T4 Clinical Segmentation specifically indicated?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M2 T4 Clinical Segmentation to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m2-t4-clinical-segmentation-5",
        "question_text": "What standardized format or guideline governs M2 T4 Clinical Segmentation?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m2-t5-spatial-transforms": [
    {
        "id": "subqc-m2-t5-spatial-transforms-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M2 T5 Spatial Transforms?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M2 T5 Spatial Transforms"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M2 T5 Spatial Transforms."
    },
    {
        "id": "subqc-m2-t5-spatial-transforms-2",
        "question_text": "How is performance quantitatively benchmarked in M2 T5 Spatial Transforms?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M2 T5 Spatial Transforms."
    },
    {
        "id": "subqc-m2-t5-spatial-transforms-3",
        "question_text": "Which artifact or source of error is most prevalent in M2 T5 Spatial Transforms?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M2 T5 Spatial Transforms."
    },
    {
        "id": "subqc-m2-t5-spatial-transforms-4",
        "question_text": "In clinical decision-making, when is M2 T5 Spatial Transforms specifically indicated?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M2 T5 Spatial Transforms to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m2-t5-spatial-transforms-5",
        "question_text": "What standardized format or guideline governs M2 T5 Spatial Transforms?",
        "co_tag": "CO2",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m3-t1-pixels-voxels": [
    {
        "id": "subqc-m3-t1-pixels-voxels-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M3 T1 Pixels Voxels?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M3 T1 Pixels Voxels"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M3 T1 Pixels Voxels."
    },
    {
        "id": "subqc-m3-t1-pixels-voxels-2",
        "question_text": "How is performance quantitatively benchmarked in M3 T1 Pixels Voxels?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M3 T1 Pixels Voxels."
    },
    {
        "id": "subqc-m3-t1-pixels-voxels-3",
        "question_text": "Which artifact or source of error is most prevalent in M3 T1 Pixels Voxels?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M3 T1 Pixels Voxels."
    },
    {
        "id": "subqc-m3-t1-pixels-voxels-4",
        "question_text": "In clinical decision-making, when is M3 T1 Pixels Voxels specifically indicated?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M3 T1 Pixels Voxels to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m3-t1-pixels-voxels-5",
        "question_text": "What standardized format or guideline governs M3 T1 Pixels Voxels?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m3-t2-grayscale-color": [
    {
        "id": "subqc-m3-t2-grayscale-color-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M3 T2 Grayscale Color?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M3 T2 Grayscale Color"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M3 T2 Grayscale Color."
    },
    {
        "id": "subqc-m3-t2-grayscale-color-2",
        "question_text": "How is performance quantitatively benchmarked in M3 T2 Grayscale Color?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M3 T2 Grayscale Color."
    },
    {
        "id": "subqc-m3-t2-grayscale-color-3",
        "question_text": "Which artifact or source of error is most prevalent in M3 T2 Grayscale Color?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M3 T2 Grayscale Color."
    },
    {
        "id": "subqc-m3-t2-grayscale-color-4",
        "question_text": "In clinical decision-making, when is M3 T2 Grayscale Color specifically indicated?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M3 T2 Grayscale Color to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m3-t2-grayscale-color-5",
        "question_text": "What standardized format or guideline governs M3 T2 Grayscale Color?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m3-t3-file-formats": [
    {
        "id": "subqc-m3-t3-file-formats-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M3 T3 File Formats?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M3 T3 File Formats"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M3 T3 File Formats."
    },
    {
        "id": "subqc-m3-t3-file-formats-2",
        "question_text": "How is performance quantitatively benchmarked in M3 T3 File Formats?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M3 T3 File Formats."
    },
    {
        "id": "subqc-m3-t3-file-formats-3",
        "question_text": "Which artifact or source of error is most prevalent in M3 T3 File Formats?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M3 T3 File Formats."
    },
    {
        "id": "subqc-m3-t3-file-formats-4",
        "question_text": "In clinical decision-making, when is M3 T3 File Formats specifically indicated?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M3 T3 File Formats to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m3-t3-file-formats-5",
        "question_text": "What standardized format or guideline governs M3 T3 File Formats?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m3-t4-dicom-standard": [
    {
        "id": "subqc-m3-t4-dicom-standard-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M3 T4 Dicom Standard?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M3 T4 Dicom Standard"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M3 T4 Dicom Standard."
    },
    {
        "id": "subqc-m3-t4-dicom-standard-2",
        "question_text": "How is performance quantitatively benchmarked in M3 T4 Dicom Standard?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M3 T4 Dicom Standard."
    },
    {
        "id": "subqc-m3-t4-dicom-standard-3",
        "question_text": "Which artifact or source of error is most prevalent in M3 T4 Dicom Standard?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M3 T4 Dicom Standard."
    },
    {
        "id": "subqc-m3-t4-dicom-standard-4",
        "question_text": "In clinical decision-making, when is M3 T4 Dicom Standard specifically indicated?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M3 T4 Dicom Standard to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m3-t4-dicom-standard-5",
        "question_text": "What standardized format or guideline governs M3 T4 Dicom Standard?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m3-t5-quality-snr": [
    {
        "id": "subqc-m3-t5-quality-snr-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M3 T5 Quality Snr?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M3 T5 Quality Snr"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M3 T5 Quality Snr."
    },
    {
        "id": "subqc-m3-t5-quality-snr-2",
        "question_text": "How is performance quantitatively benchmarked in M3 T5 Quality Snr?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M3 T5 Quality Snr."
    },
    {
        "id": "subqc-m3-t5-quality-snr-3",
        "question_text": "Which artifact or source of error is most prevalent in M3 T5 Quality Snr?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M3 T5 Quality Snr."
    },
    {
        "id": "subqc-m3-t5-quality-snr-4",
        "question_text": "In clinical decision-making, when is M3 T5 Quality Snr specifically indicated?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M3 T5 Quality Snr to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m3-t5-quality-snr-5",
        "question_text": "What standardized format or guideline governs M3 T5 Quality Snr?",
        "co_tag": "CO3",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m4-t1-intensity-transform": [
    {
        "id": "subqc-m4-t1-intensity-transform-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M4 T1 Intensity Transform?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M4 T1 Intensity Transform"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M4 T1 Intensity Transform."
    },
    {
        "id": "subqc-m4-t1-intensity-transform-2",
        "question_text": "How is performance quantitatively benchmarked in M4 T1 Intensity Transform?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M4 T1 Intensity Transform."
    },
    {
        "id": "subqc-m4-t1-intensity-transform-3",
        "question_text": "Which artifact or source of error is most prevalent in M4 T1 Intensity Transform?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M4 T1 Intensity Transform."
    },
    {
        "id": "subqc-m4-t1-intensity-transform-4",
        "question_text": "In clinical decision-making, when is M4 T1 Intensity Transform specifically indicated?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M4 T1 Intensity Transform to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m4-t1-intensity-transform-5",
        "question_text": "What standardized format or guideline governs M4 T1 Intensity Transform?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m4-t2-windowing": [
    {
        "id": "subqc-m4-t2-windowing-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M4 T2 Windowing?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M4 T2 Windowing"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M4 T2 Windowing."
    },
    {
        "id": "subqc-m4-t2-windowing-2",
        "question_text": "How is performance quantitatively benchmarked in M4 T2 Windowing?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M4 T2 Windowing."
    },
    {
        "id": "subqc-m4-t2-windowing-3",
        "question_text": "Which artifact or source of error is most prevalent in M4 T2 Windowing?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M4 T2 Windowing."
    },
    {
        "id": "subqc-m4-t2-windowing-4",
        "question_text": "In clinical decision-making, when is M4 T2 Windowing specifically indicated?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M4 T2 Windowing to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m4-t2-windowing-5",
        "question_text": "What standardized format or guideline governs M4 T2 Windowing?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m4-t3-histograms": [
    {
        "id": "subqc-m4-t3-histograms-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M4 T3 Histograms?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M4 T3 Histograms"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M4 T3 Histograms."
    },
    {
        "id": "subqc-m4-t3-histograms-2",
        "question_text": "How is performance quantitatively benchmarked in M4 T3 Histograms?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M4 T3 Histograms."
    },
    {
        "id": "subqc-m4-t3-histograms-3",
        "question_text": "Which artifact or source of error is most prevalent in M4 T3 Histograms?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M4 T3 Histograms."
    },
    {
        "id": "subqc-m4-t3-histograms-4",
        "question_text": "In clinical decision-making, when is M4 T3 Histograms specifically indicated?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M4 T3 Histograms to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m4-t3-histograms-5",
        "question_text": "What standardized format or guideline governs M4 T3 Histograms?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m4-t4-dithering-depth": [
    {
        "id": "subqc-m4-t4-dithering-depth-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M4 T4 Dithering Depth?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M4 T4 Dithering Depth"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M4 T4 Dithering Depth."
    },
    {
        "id": "subqc-m4-t4-dithering-depth-2",
        "question_text": "How is performance quantitatively benchmarked in M4 T4 Dithering Depth?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M4 T4 Dithering Depth."
    },
    {
        "id": "subqc-m4-t4-dithering-depth-3",
        "question_text": "Which artifact or source of error is most prevalent in M4 T4 Dithering Depth?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M4 T4 Dithering Depth."
    },
    {
        "id": "subqc-m4-t4-dithering-depth-4",
        "question_text": "In clinical decision-making, when is M4 T4 Dithering Depth specifically indicated?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M4 T4 Dithering Depth to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m4-t4-dithering-depth-5",
        "question_text": "What standardized format or guideline governs M4 T4 Dithering Depth?",
        "co_tag": "CO4",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t1-filtering-operation": [
    {
        "id": "subqc-m5-t1-filtering-operation-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T1 Filtering Operation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T1 Filtering Operation"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T1 Filtering Operation."
    },
    {
        "id": "subqc-m5-t1-filtering-operation-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T1 Filtering Operation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T1 Filtering Operation."
    },
    {
        "id": "subqc-m5-t1-filtering-operation-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T1 Filtering Operation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T1 Filtering Operation."
    },
    {
        "id": "subqc-m5-t1-filtering-operation-4",
        "question_text": "In clinical decision-making, when is M5 T1 Filtering Operation specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T1 Filtering Operation to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t1-filtering-operation-5",
        "question_text": "What standardized format or guideline governs M5 T1 Filtering Operation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t2-fourier-transform": [
    {
        "id": "subqc-m5-t2-fourier-transform-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T2 Fourier Transform?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T2 Fourier Transform"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T2 Fourier Transform."
    },
    {
        "id": "subqc-m5-t2-fourier-transform-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T2 Fourier Transform?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T2 Fourier Transform."
    },
    {
        "id": "subqc-m5-t2-fourier-transform-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T2 Fourier Transform?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T2 Fourier Transform."
    },
    {
        "id": "subqc-m5-t2-fourier-transform-4",
        "question_text": "In clinical decision-making, when is M5 T2 Fourier Transform specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T2 Fourier Transform to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t2-fourier-transform-5",
        "question_text": "What standardized format or guideline governs M5 T2 Fourier Transform?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t3-segmentation-pipeline": [
    {
        "id": "subqc-m5-t3-segmentation-pipeline-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T3 Segmentation Pipeline?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T3 Segmentation Pipeline"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T3 Segmentation Pipeline."
    },
    {
        "id": "subqc-m5-t3-segmentation-pipeline-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T3 Segmentation Pipeline?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T3 Segmentation Pipeline."
    },
    {
        "id": "subqc-m5-t3-segmentation-pipeline-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T3 Segmentation Pipeline?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T3 Segmentation Pipeline."
    },
    {
        "id": "subqc-m5-t3-segmentation-pipeline-4",
        "question_text": "In clinical decision-making, when is M5 T3 Segmentation Pipeline specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T3 Segmentation Pipeline to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t3-segmentation-pipeline-5",
        "question_text": "What standardized format or guideline governs M5 T3 Segmentation Pipeline?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t4-roi-centroids": [
    {
        "id": "subqc-m5-t4-roi-centroids-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T4 Roi Centroids?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T4 Roi Centroids"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T4 Roi Centroids."
    },
    {
        "id": "subqc-m5-t4-roi-centroids-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T4 Roi Centroids?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T4 Roi Centroids."
    },
    {
        "id": "subqc-m5-t4-roi-centroids-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T4 Roi Centroids?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T4 Roi Centroids."
    },
    {
        "id": "subqc-m5-t4-roi-centroids-4",
        "question_text": "In clinical decision-making, when is M5 T4 Roi Centroids specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T4 Roi Centroids to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t4-roi-centroids-5",
        "question_text": "What standardized format or guideline governs M5 T4 Roi Centroids?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t5-thresholding-otsu": [
    {
        "id": "subqc-m5-t5-thresholding-otsu-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T5 Thresholding Otsu?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T5 Thresholding Otsu"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T5 Thresholding Otsu."
    },
    {
        "id": "subqc-m5-t5-thresholding-otsu-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T5 Thresholding Otsu?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T5 Thresholding Otsu."
    },
    {
        "id": "subqc-m5-t5-thresholding-otsu-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T5 Thresholding Otsu?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T5 Thresholding Otsu."
    },
    {
        "id": "subqc-m5-t5-thresholding-otsu-4",
        "question_text": "In clinical decision-making, when is M5 T5 Thresholding Otsu specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T5 Thresholding Otsu to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t5-thresholding-otsu-5",
        "question_text": "What standardized format or guideline governs M5 T5 Thresholding Otsu?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t6-region-growing": [
    {
        "id": "subqc-m5-t6-region-growing-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T6 Region Growing?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T6 Region Growing"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T6 Region Growing."
    },
    {
        "id": "subqc-m5-t6-region-growing-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T6 Region Growing?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T6 Region Growing."
    },
    {
        "id": "subqc-m5-t6-region-growing-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T6 Region Growing?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T6 Region Growing."
    },
    {
        "id": "subqc-m5-t6-region-growing-4",
        "question_text": "In clinical decision-making, when is M5 T6 Region Growing specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T6 Region Growing to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t6-region-growing-5",
        "question_text": "What standardized format or guideline governs M5 T6 Region Growing?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m5-t7-segmentation-evaluation": [
    {
        "id": "subqc-m5-t7-segmentation-evaluation-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M5 T7 Segmentation Evaluation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M5 T7 Segmentation Evaluation"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M5 T7 Segmentation Evaluation."
    },
    {
        "id": "subqc-m5-t7-segmentation-evaluation-2",
        "question_text": "How is performance quantitatively benchmarked in M5 T7 Segmentation Evaluation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M5 T7 Segmentation Evaluation."
    },
    {
        "id": "subqc-m5-t7-segmentation-evaluation-3",
        "question_text": "Which artifact or source of error is most prevalent in M5 T7 Segmentation Evaluation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M5 T7 Segmentation Evaluation."
    },
    {
        "id": "subqc-m5-t7-segmentation-evaluation-4",
        "question_text": "In clinical decision-making, when is M5 T7 Segmentation Evaluation specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M5 T7 Segmentation Evaluation to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m5-t7-segmentation-evaluation-5",
        "question_text": "What standardized format or guideline governs M5 T7 Segmentation Evaluation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t1-discretization-artifacts": [
    {
        "id": "subqc-m6-t1-discretization-artifacts-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T1 Discretization Artifacts?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T1 Discretization Artifacts"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T1 Discretization Artifacts."
    },
    {
        "id": "subqc-m6-t1-discretization-artifacts-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T1 Discretization Artifacts?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T1 Discretization Artifacts."
    },
    {
        "id": "subqc-m6-t1-discretization-artifacts-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T1 Discretization Artifacts?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T1 Discretization Artifacts."
    },
    {
        "id": "subqc-m6-t1-discretization-artifacts-4",
        "question_text": "In clinical decision-making, when is M6 T1 Discretization Artifacts specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T1 Discretization Artifacts to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t1-discretization-artifacts-5",
        "question_text": "What standardized format or guideline governs M6 T1 Discretization Artifacts?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t2-interpolation-regularization": [
    {
        "id": "subqc-m6-t2-interpolation-regularization-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T2 Interpolation Regularization?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T2 Interpolation Regularization"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T2 Interpolation Regularization."
    },
    {
        "id": "subqc-m6-t2-interpolation-regularization-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T2 Interpolation Regularization?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T2 Interpolation Regularization."
    },
    {
        "id": "subqc-m6-t2-interpolation-regularization-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T2 Interpolation Regularization?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T2 Interpolation Regularization."
    },
    {
        "id": "subqc-m6-t2-interpolation-regularization-4",
        "question_text": "In clinical decision-making, when is M6 T2 Interpolation Regularization specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T2 Interpolation Regularization to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t2-interpolation-regularization-5",
        "question_text": "What standardized format or guideline governs M6 T2 Interpolation Regularization?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t3-translation-rotation": [
    {
        "id": "subqc-m6-t3-translation-rotation-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T3 Translation Rotation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T3 Translation Rotation"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T3 Translation Rotation."
    },
    {
        "id": "subqc-m6-t3-translation-rotation-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T3 Translation Rotation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T3 Translation Rotation."
    },
    {
        "id": "subqc-m6-t3-translation-rotation-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T3 Translation Rotation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T3 Translation Rotation."
    },
    {
        "id": "subqc-m6-t3-translation-rotation-4",
        "question_text": "In clinical decision-making, when is M6 T3 Translation Rotation specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T3 Translation Rotation to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t3-translation-rotation-5",
        "question_text": "What standardized format or guideline governs M6 T3 Translation Rotation?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t4-reformatting-mpr": [
    {
        "id": "subqc-m6-t4-reformatting-mpr-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T4 Reformatting Mpr?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T4 Reformatting Mpr"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T4 Reformatting Mpr."
    },
    {
        "id": "subqc-m6-t4-reformatting-mpr-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T4 Reformatting Mpr?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T4 Reformatting Mpr."
    },
    {
        "id": "subqc-m6-t4-reformatting-mpr-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T4 Reformatting Mpr?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T4 Reformatting Mpr."
    },
    {
        "id": "subqc-m6-t4-reformatting-mpr-4",
        "question_text": "In clinical decision-making, when is M6 T4 Reformatting Mpr specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T4 Reformatting Mpr to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t4-reformatting-mpr-5",
        "question_text": "What standardized format or guideline governs M6 T4 Reformatting Mpr?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t5-projection-models": [
    {
        "id": "subqc-m6-t5-projection-models-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T5 Projection Models?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T5 Projection Models"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T5 Projection Models."
    },
    {
        "id": "subqc-m6-t5-projection-models-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T5 Projection Models?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T5 Projection Models."
    },
    {
        "id": "subqc-m6-t5-projection-models-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T5 Projection Models?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T5 Projection Models."
    },
    {
        "id": "subqc-m6-t5-projection-models-4",
        "question_text": "In clinical decision-making, when is M6 T5 Projection Models specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T5 Projection Models to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t5-projection-models-5",
        "question_text": "What standardized format or guideline governs M6 T5 Projection Models?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t6-raycasting-volume": [
    {
        "id": "subqc-m6-t6-raycasting-volume-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T6 Raycasting Volume?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T6 Raycasting Volume"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T6 Raycasting Volume."
    },
    {
        "id": "subqc-m6-t6-raycasting-volume-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T6 Raycasting Volume?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T6 Raycasting Volume."
    },
    {
        "id": "subqc-m6-t6-raycasting-volume-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T6 Raycasting Volume?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T6 Raycasting Volume."
    },
    {
        "id": "subqc-m6-t6-raycasting-volume-4",
        "question_text": "In clinical decision-making, when is M6 T6 Raycasting Volume specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T6 Raycasting Volume to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t6-raycasting-volume-5",
        "question_text": "What standardized format or guideline governs M6 T6 Raycasting Volume?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

  "m6-t7-surface-rendering-marching-cubes": [
    {
        "id": "subqc-m6-t7-surface-rendering-marching-cubes-1",
        "question_text": "What is the primary clinical or mathematical principle underlying M6 T7 Surface Rendering Marching Cubes?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Core algorithmic formulation and validated protocol of M6 T7 Surface Rendering Marching Cubes"
            },
            {
                "id": "B",
                "text": "Uncalibrated heuristic estimation"
            },
            {
                "id": "C",
                "text": "Random Gaussian noise perturbation"
            },
            {
                "id": "D",
                "text": "Non-standardized empirical guess"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Detailed theoretical derivation and clinical protocol established for M6 T7 Surface Rendering Marching Cubes."
    },
    {
        "id": "subqc-m6-t7-surface-rendering-marching-cubes-2",
        "question_text": "How is performance quantitatively benchmarked in M6 T7 Surface Rendering Marching Cubes?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "B",
                "text": "Subjective visual impressions without metric scoring"
            },
            {
                "id": "A",
                "text": "Rigorous objective validation metrics and verified clinical ground truth"
            },
            {
                "id": "C",
                "text": "Unsupervised arbitrary assignment"
            },
            {
                "id": "D",
                "text": "Binary thresholding without calibration"
            }
        ],
        "correct_option_id": "B",
        "explanation": "Quantitative standards ensure reproducible diagnostic accuracy in M6 T7 Surface Rendering Marching Cubes."
    },
    {
        "id": "subqc-m6-t7-surface-rendering-marching-cubes-3",
        "question_text": "Which artifact or source of error is most prevalent in M6 T7 Surface Rendering Marching Cubes?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "C",
                "text": "Infinite spatial resolution anomalies"
            },
            {
                "id": "B",
                "text": "Zero error condition in physical systems"
            },
            {
                "id": "A",
                "text": "Discretization, noise propagation, or tissue physical mismatch"
            },
            {
                "id": "D",
                "text": "Perfect linear invariance"
            }
        ],
        "correct_option_id": "C",
        "explanation": "Recognizing and mitigating characteristic failure modes is essential in M6 T7 Surface Rendering Marching Cubes."
    },
    {
        "id": "subqc-m6-t7-surface-rendering-marching-cubes-4",
        "question_text": "In clinical decision-making, when is M6 T7 Surface Rendering Marching Cubes specifically indicated?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "D",
                "text": "Exclusively in non-medical gaming engines"
            },
            {
                "id": "B",
                "text": "Only during exploratory research without clinical relevance"
            },
            {
                "id": "C",
                "text": "As a redundant fallback when primary tests suffice"
            },
            {
                "id": "A",
                "text": "When high-fidelity diagnostic accuracy and patient safety require validated workflows"
            }
        ],
        "correct_option_id": "D",
        "explanation": "Clinical practice guidelines prioritize M6 T7 Surface Rendering Marching Cubes to achieve dependable patient outcomes."
    },
    {
        "id": "subqc-m6-t7-surface-rendering-marching-cubes-5",
        "question_text": "What standardized format or guideline governs M6 T7 Surface Rendering Marching Cubes?",
        "co_tag": "CO5",
        "options": [
            {
                "id": "A",
                "text": "Accredited international standard (DICOM, ACR, AAPM, or ISO)"
            },
            {
                "id": "B",
                "text": "Proprietary closed vendor protocol"
            },
            {
                "id": "C",
                "text": "Local undocumented laboratory convention"
            },
            {
                "id": "D",
                "text": "Unregulated web format"
            }
        ],
        "correct_option_id": "A",
        "explanation": "Standardized frameworks guarantee interoperability and compliance across PACS and AI platforms."
    }
],

};
