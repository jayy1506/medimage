export interface QuizQuestionItem {
  id: string;
  moduleId: string;
  co_tag: string;
  question_text: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
}

export const MODULE_QUIZ_REGISTRY: Record<string, QuizQuestionItem[]> = {
  // MODULE 1: Medical Image Sources (15 Questions)
  "mod-1": [
    {
      id: "m1-q1",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "What fundamental interaction causes beam hardening as a polychromatic X-ray beam traverses biological tissues?",
      options: [
        { id: "A", text: "Preferential photoelectric absorption of lower-energy photons, shifting the effective energy higher" },
        { id: "B", text: "Incoherent pair production in alveolar spaces" },
        { id: "C", text: "Linear acceleration of photons inside cortical bone" },
        { id: "D", text: "Saturation of detector photodiodes" }
      ],
      correct_option_id: "A",
      explanation: "Low-energy photons are preferentially absorbed (attenuation is inversely proportional to E^3), shifting the remaining spectrum toward higher average energy."
    },
    {
      id: "m1-q2",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "On the standardized Hounsfield Unit (HU) scale, what is the defined physical attenuation value of pure distilled water at standard temperature and pressure?",
      options: [
        { id: "A", text: "-1000 HU" },
        { id: "B", text: "0 HU" },
        { id: "C", text: "+100 HU" },
        { id: "D", text: "+1000 HU" }
      ],
      correct_option_id: "B",
      explanation: "Water is the reference standard defined as exactly 0 HU, while air is -1000 HU and dense cortical bone is +1000 to +3000 HU."
    },
    {
      id: "m1-q3",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "If a biological tissue exhibits a linear attenuation coefficient μ = 0.693 cm⁻¹, what is its Half-Value Layer (HVL)?",
      options: [
        { id: "A", text: "0.5 cm" },
        { id: "B", text: "1.0 cm" },
        { id: "C", text: "2.0 cm" },
        { id: "D", text: "1.414 cm" }
      ],
      correct_option_id: "B",
      explanation: "HVL = ln(2) / μ = 0.693 / 0.693 = 1.0 cm."
    },
    {
      id: "m1-q4",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "In clinical Magnetic Resonance Imaging (MRI), what is the gyromagnetic ratio (γ / 2π) for hydrogen protons (¹H)?",
      options: [
        { id: "A", text: "15.4 MHz/Tesla" },
        { id: "B", text: "42.58 MHz/Tesla" },
        { id: "C", text: "63.87 MHz/Tesla" },
        { id: "D", text: "128.0 MHz/Tesla" }
      ],
      correct_option_id: "B",
      explanation: "Hydrogen protons possess a gyromagnetic ratio of 42.58 MHz/T, giving a Larmor resonance frequency of 63.87 MHz at 1.5 Tesla."
    },
    {
      id: "m1-q5",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "Diagnostic ultrasound generates image reflections primarily based on mismatch in which physical tissue property?",
      options: [
        { id: "A", text: "Dielectric permittivity" },
        { id: "B", text: "Specific acoustic impedance (Z = ρc)" },
        { id: "C", text: "Electron density per gram" },
        { id: "D", text: "Proton spin relaxation time" }
      ],
      correct_option_id: "B",
      explanation: "Ultrasound echoes occur at boundaries where acoustic impedance (Z = density × speed of sound) changes between tissue layers."
    },
    {
      id: "m1-q6",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "What radiation safety principle governs clinical X-ray, CT, and nuclear medicine procedures?",
      options: [
        { id: "A", text: "ALARA (As Low As Reasonably Achievable)" },
        { id: "B", text: "Zero-Dose Mandate" },
        { id: "C", text: "Deterministic Upper Boundary" },
        { id: "D", text: "Constant Kerma Criterion" }
      ],
      correct_option_id: "A",
      explanation: "ALARA requires minimizing radiation dose while maintaining adequate diagnostic diagnostic image quality."
    },
    {
      id: "m1-q7",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "Which imaging modality utilizes positron-electron annihilation producing dual 511 keV collinear gamma rays?",
      options: [
        { id: "A", text: "Single Photon Emission Computed Tomography (SPECT)" },
        { id: "B", text: "Positron Emission Tomography (PET)" },
        { id: "C", text: "Dual-Energy X-Ray Absorptiometry (DEXA)" },
        { id: "D", text: "Time-of-Flight MRI" }
      ],
      correct_option_id: "B",
      explanation: "PET radiotracers emit positrons which annihilate with atomic electrons, emitting paired 511 keV photons at 180 degrees detected by coincidence timing."
    },
    {
      id: "m1-q8",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "In continuous X-ray production, what interaction mechanism creates the continuous Bremsstrahlung spectrum?",
      options: [
        { id: "A", text: "De-excitation of outer-shell electrons filling inner K-shell vacancies" },
        { id: "B", text: "Deceleration and deflection of incident electrons in the nuclear Coulomb field of target atoms" },
        { id: "C", text: "Coherent Thompson scattering off free electrons" },
        { id: "D", text: "Thermal blackbody filament glow" }
      ],
      correct_option_id: "B",
      explanation: "Bremsstrahlung ('braking radiation') occurs when energetic electrons are decelerated by the positive electric field of tungsten nuclei."
    },
    {
      id: "m1-q9",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "In MRI physics, T1 relaxation time corresponds to which biological relaxation phenomenon?",
      options: [
        { id: "A", text: "Spin-lattice longitudinal relaxation (recovery of Mz to equilibrium)" },
        { id: "B", text: "Spin-spin transverse dephasing (decay of Mxy)" },
        { id: "C", text: "Chemical shift frequency dispersion" },
        { id: "D", text: "Free induction spatial encoding" }
      ],
      correct_option_id: "A",
      explanation: "T1 (spin-lattice) is the time constant for longitudinal magnetization Mz to regrow to 63% of equilibrium after an RF pulse."
    },
    {
      id: "m1-q10",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "Why is acoustic coupling gel universally applied between the ultrasound transducer and patient skin?",
      options: [
        { id: "A", text: "To prevent transducer electrical shocks" },
        { id: "B", text: "To eliminate air gaps that would reflect >99% of sound energy due to extreme impedance mismatch" },
        { id: "C", text: "To cool the piezoelectric crystal from overheating" },
        { id: "D", text: "To shift the acoustic center frequency into the megahertz band" }
      ],
      correct_option_id: "B",
      explanation: "Acoustic impedance of air is 0.0004 MRayl vs tissue ~1.5 MRayl, causing virtually total reflection without impedance-matching gel."
    },
    {
      id: "m1-q11",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "What is the average speed of acoustic waves assumed in clinical soft tissue ultrasound beamformers?",
      options: [
        { id: "A", text: "343 m/s" },
        { id: "B", text: "1540 m/s" },
        { id: "C", text: "3000 m/s" },
        { id: "D", text: "4080 m/s" }
      ],
      correct_option_id: "B",
      explanation: "1540 m/s is the international clinical standard sound speed for soft tissue calibration."
    },
    {
      id: "m1-q12",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "Which predominant interaction mechanism governs X-ray photon attenuation in diagnostic soft tissue between 30 keV and 100 keV?",
      options: [
        { id: "A", text: "Photoelectric absorption" },
        { id: "B", text: "Compton incoherent scattering" },
        { id: "C", text: "Pair production" },
        { id: "D", text: "Photodisintegration" }
      ],
      correct_option_id: "B",
      explanation: "Compton scattering dominates in soft tissue above ~26 keV up to therapeutic MeV ranges."
    },
    {
      id: "m1-q13",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "What mathematical representation models the set of all line integrals (attenuation profiles) across multiple projection angles in CT?",
      options: [
        { id: "A", text: "Laplacian pyramid" },
        { id: "B", text: "Radon transform (Sinogram)" },
        { id: "C", text: "Voronoi tessellation" },
        { id: "D", text: "Gabor wavelet bank" }
      ],
      correct_option_id: "B",
      explanation: "The Radon transform maps spatial tissue attenuation into a 2D sinogram parameterized by radial distance and projection angle."
    },
    {
      id: "m1-q14",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "In T2-weighted brain MRI sequences, how does cerebrospinal fluid (CSF) appear relative to white matter?",
      options: [
        { id: "A", text: "Hypointense (Dark)" },
        { id: "B", text: "Hyperintense (Bright)" },
        { id: "C", text: "Isointense with skull bone" },
        { id: "D", text: "Signal void" }
      ],
      correct_option_id: "B",
      explanation: "Free water and CSF have very long T2 relaxation times (~2000 ms), retaining transverse magnetization and appearing bright on T2."
    },
    {
      id: "m1-q15",
      moduleId: "mod-1",
      co_tag: "CO1",
      question_text: "What diagnostic radiotracer is most commonly utilized in clinical oncologic PET examinations to measure hypermetabolic glucose consumption?",
      options: [
        { id: "A", text: "Technetium-99m Sestamibi" },
        { id: "B", text: "18F-Fluorodeoxyglucose (¹⁸F-FDG)" },
        { id: "C", text: "Iodine-131" },
        { id: "D", text: "Gadolinium-DTPA" }
      ],
      correct_option_id: "B",
      explanation: "¹⁸F-FDG is a glucose analog transported into high-glycolytic tumour cells and trapped after phosphorylation."
    }
  ],

  // MODULE 2: Image Processing in Clinical Practice (15 Questions)
  "mod-2": [
    {
      id: "m2-q1",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What network architecture forms the clinical backbone for enterprise medical imaging storage, transmission, and retrieval in modern hospitals?",
      options: [
        { id: "A", text: "FTP Server mesh" },
        { id: "B", text: "Picture Archiving and Communication System (PACS)" },
        { id: "C", text: "BitTorrent P2P nodes" },
        { id: "D", text: "SMTP Email attachment routing" }
      ],
      correct_option_id: "B",
      explanation: "PACS is the universal healthcare imaging architecture interfaced with RIS, HIS, and clinical workstations."
    },
    {
      id: "m2-q2",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "Which DICOM network Service-Object Pair (SOP) class handles sending clinical imaging studies from an acquisition scanner to PACS?",
      options: [
        { id: "A", text: "C-ECHO" },
        { id: "B", text: "C-STORE" },
        { id: "C", text: "C-FIND" },
        { id: "D", text: "C-MOVE" }
      ],
      correct_option_id: "B",
      explanation: "C-STORE is the DICOM network command for transmitting image instances between Application Entities."
    },
    {
      id: "m2-q3",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What is the primary diagnostic risk when applying high-pass spatial sharpening filters to low-dose pediatric CT images?",
      options: [
        { id: "A", text: "Loss of edge definition" },
        { id: "B", text: "Noise amplification creating false-positive microcalcifications" },
        { id: "C", text: "Color inversion" },
        { id: "D", text: "Geometry shear" }
      ],
      correct_option_id: "B",
      explanation: "High-pass filters amplify high-frequency quantum mottle noise, which can mimic clinical pathology."
    },
    {
      id: "m2-q4",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "In deep learning clinical segmentation pipelines, why is the U-Net architecture specifically favored over standard CNNs?",
      options: [
        { id: "A", text: "It uses zero convolution layers" },
        { id: "B", text: "Skip connections bridge low-level spatial localization features directly to semantic decoder layers" },
        { id: "C", text: "It only works on 1D audio sequences" },
        { id: "D", text: "It eliminates the need for training labels" }
      ],
      correct_option_id: "B",
      explanation: "U-Net's skip connections concatenate fine-grained spatial details from encoder stages into decoder layers for precise boundary segmentation."
    },
    {
      id: "m2-q5",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What intensity operation is applied to display high-dynamic-range 12-bit CT data on an 8-bit diagnostic monitor?",
      options: [
        { id: "A", text: "Linear or sigmoid Look-Up Table (LUT) mapping (Windowing)" },
        { id: "B", text: "Bicubic voxel downsampling" },
        { id: "C", text: "Run-length encoding" },
        { id: "D", text: "Fast Fourier Transform inversion" }
      ],
      correct_option_id: "A",
      explanation: "VOI LUTs compress clinical 12-bit HU dynamic ranges (-1000 to +3000) into 256 displayable shades of gray."
    },
    {
      id: "m2-q6",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "Which metric evaluates spatial alignment accuracy in multi-modal (PET-CT or MRI-CT) image registration?",
      options: [
        { id: "A", text: "Normalized Mutual Information (NMI)" },
        { id: "B", text: "JPEG compression ratio" },
        { id: "C", text: "Hounsfield difference sum" },
        { id: "D", text: "Frame rate per second" }
      ],
      correct_option_id: "A",
      explanation: "Mutual Information quantifies statistical dependence between two modalities having completely different intensity values for the same anatomy."
    },
    {
      id: "m2-q7",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What DICOM command queries a PACS archive for patient studies matching an MRN or accession number?",
      options: [
        { id: "A", text: "C-FIND" },
        { id: "B", text: "C-STORE" },
        { id: "C", text: "C-CANCEL" },
        { id: "D", text: "N-EVENT" }
      ],
      correct_option_id: "A",
      explanation: "C-FIND queries DICOM attributes at Patient, Study, Series, or Image levels."
    },
    {
      id: "m2-q8",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "A non-linear point transform s = c · r^γ with γ < 1 has what effect on an underexposed medical radiograph?",
      options: [
        { id: "A", text: "Expands contrast in dark shadow areas while compressing bright highlight regions" },
        { id: "B", text: "Makes all dark pixels zero" },
        { id: "C", text: "Introduces motion blur" },
        { id: "D", text: "Inverts colors from RGB to CMYK" }
      ],
      correct_option_id: "A",
      explanation: "Gamma correction with γ < 1 lifts dark shadow values, revealing occult pathology in underexposed soft tissue."
    },
    {
      id: "m2-q9",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "Which spatial filter effectively removes high-frequency speckle noise while preserving sharp organ boundaries?",
      options: [
        { id: "A", text: "Median or bilateral filter" },
        { id: "B", text: "Standard 7x7 box mean filter" },
        { id: "C", text: "Laplacian 2nd derivative filter" },
        { id: "D", text: "Difference of Gaussians" }
      ],
      correct_option_id: "A",
      explanation: "Median filtering is non-linear and removes impulse salt-and-pepper / speckle noise without blurring sharp edge transitions."
    },
    {
      id: "m2-q10",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "In multi-atlas segmentation, how are individual candidate label maps combined to produce the final consensus contour?",
      options: [
        { id: "A", text: "Majority voting or STAPLE algorithm" },
        { id: "B", text: "Random coin toss" },
        { id: "C", text: "Arithmetic addition of pixel coordinates" },
        { id: "D", text: "Fourier phase unwrapping" }
      ],
      correct_option_id: "A",
      explanation: "STAPLE (Simultaneous Truth and Performance Level Estimation) and majority voting combine multi-expert candidate segmentations."
    },
    {
      id: "m2-q11",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What hospital system manages patient scheduling, billing, and radiologist reporting workflows?",
      options: [
        { id: "A", text: "Radiology Information System (RIS)" },
        { id: "B", text: "GPU Shader Pipeline" },
        { id: "C", text: "DICOM Viewer Canvas" },
        { id: "D", text: "Pyodide Sandbox" }
      ],
      correct_option_id: "A",
      explanation: "RIS manages departmental scheduling, exam orders, dictation reports, and billing codes."
    },
    {
      id: "m2-q12",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What is an Affine spatial transformation capable of modeling in medical image registration?",
      options: [
        { id: "A", text: "Translation, rotation, scaling, and shearing" },
        { id: "B", text: "Non-rigid organ peristalsis" },
        { id: "C", text: "Breathing-induced lung deformation" },
        { id: "D", text: "Cardiac contraction" }
      ],
      correct_option_id: "A",
      explanation: "Affine transforms preserve straight lines and parallel planes via 12 degrees of freedom (translation, rotation, scale, shear)."
    },
    {
      id: "m2-q13",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "In digital image processing, what is the mathematical operation of sliding a kernel across an image and taking weighted sums?",
      options: [
        { id: "A", text: "2D Discrete Spatial Convolution" },
        { id: "B", text: "Histogram backprojection" },
        { id: "C", text: "Voronoi partitioning" },
        { id: "D", text: "Principal Component Analysis" }
      ],
      correct_option_id: "A",
      explanation: "Spatial convolution computes output pixels as the inner product of the local neighborhood and kernel weights."
    },
    {
      id: "m2-q14",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What loss function is standard in medical image segmentation to overcome extreme class imbalance (e.g. tiny tumour vs huge background)?",
      options: [
        { id: "A", text: "Soft Dice Loss / Generalized Dice Loss" },
        { id: "B", text: "Mean Squared Error" },
        { id: "C", text: "L1 Absolute Deviation" },
        { id: "D", text: "Hinge loss" }
      ],
      correct_option_id: "A",
      explanation: "Dice loss optimizes the harmonic mean of precision and recall directly, preventing the model from collapsing to all-background predictions."
    },
    {
      id: "m2-q15",
      moduleId: "mod-2",
      co_tag: "CO2",
      question_text: "What communication protocol securely links hospital PACS with off-site teleradiology reading groups over public networks?",
      options: [
        { id: "A", text: "DICOM over TLS / VPN (DICOM PS3.15)" },
        { id: "B", text: "Unencrypted Telnet" },
        { id: "C", text: "Cleartext HTTP Port 80" },
        { id: "D", text: "SNMP traps" }
      ],
      correct_option_id: "A",
      explanation: "DICOM Part 15 specifies Secure Transport Connection Profiles using TLS for HIPAA and DPDP compliant encryption in transit."
    }
  ],

  // MODULE 3: Image Representation & DICOM (15 Questions)
  "mod-3": [
    {
      id: "m3-q1",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "In the DICOM Part 10 medical standard, which Group and Element tag stores the Patient's Full Name?",
      options: [
        { id: "A", text: "(0010,0010)" },
        { id: "B", text: "(0028,0010)" },
        { id: "C", text: "(0028,1050)" },
        { id: "D", text: "(0020,0032)" }
      ],
      correct_option_id: "A",
      explanation: "Tag (0010,0010) is the canonical DICOM tag for Patient Name."
    },
    {
      id: "m3-q2",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "What is the physical difference between a pixel and a voxel in cross-sectional CT and MRI tomography?",
      options: [
        { id: "A", text: "Pixel is a 2D surface element (Area); voxel is a 3D volumetric element with slice thickness (Volume)" },
        { id: "B", text: "Voxels only exist in ultrasound" },
        { id: "C", text: "Pixels are measured in Hounsfield units; voxels are measured in decibels" },
        { id: "D", text: "There is no difference" }
      ],
      correct_option_id: "A",
      explanation: "A voxel represents a 3D volumetric volume element: Voxel Volume = Pixel Width × Pixel Height × Slice Thickness."
    },
    {
      id: "m3-q3",
      moduleId: "mod-3",
      co_tag: "CO4",
      question_text: "Which medical research file format is widely used in neuroimaging because it stores 3D/4D volumes as a single file (.nii or .nii.gz) with coordinate qform/sform matrices?",
      options: [
        { id: "A", text: "NIfTI (Neuroimaging Informatics Technology Initiative)" },
        { id: "B", text: "BMP" },
        { id: "C", text: "GIF89a" },
        { id: "D", text: "JPEG-LS" }
      ],
      correct_option_id: "A",
      explanation: "NIfTI-1 and NIfTI-2 are standard for 3D/4D fMRI, DTI, and anatomical brain imaging with embedded spatial coordinate transforms."
    },
    {
      id: "m3-q4",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "If a CT scanner field of view (FOV) is 512 mm and the reconstruction matrix is 512 × 512, what is the in-plane pixel size?",
      options: [
        { id: "A", text: "0.5 mm" },
        { id: "B", text: "1.0 mm" },
        { id: "C", text: "2.0 mm" },
        { id: "D", text: "0.25 mm" }
      ],
      correct_option_id: "B",
      explanation: "Pixel Size = FOV / Matrix Size = 512 mm / 512 = 1.0 mm."
    },
    {
      id: "m3-q5",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "What DICOM Tag specifies the 3D spatial coordinates (X, Y, Z) of the upper-left corner of an image slice in the patient coordinate system?",
      options: [
        { id: "A", text: "(0020,0032) Image Position (Patient)" },
        { id: "B", text: "(0028,0030) Pixel Spacing" },
        { id: "C", text: "(0008,0060) Modality" },
        { id: "D", text: "(0018,0050) Slice Thickness" }
      ],
      correct_option_id: "A",
      explanation: "Tag (0020,0032) Image Position (Patient) defines the (X, Y, Z) origin of the first transmitted pixel in millimeters."
    },
    {
      id: "m3-q6",
      moduleId: "mod-3",
      co_tag: "CO4",
      question_text: "What clinical artifact arises when a high-density structure (like bone) partially occupies a voxel alongside low-density tissue (like brain)?",
      options: [
        { id: "A", text: "Partial Volume Averaging Artifact" },
        { id: "B", text: "Geometric perspective pincushion" },
        { id: "C", text: "Motion ghosting" },
        { id: "D", text: "Color moiré fringing" }
      ],
      correct_option_id: "A",
      explanation: "The measured attenuation in that voxel becomes the weighted average of bone and tissue, reducing lesion conspicuity."
    },
    {
      id: "m3-q7",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "In DICOM Part 10 file structure, what fixed 4-byte ASCII prefix is found at byte offset 128 after the 128-byte preamble?",
      options: [
        { id: "A", text: "'DICM'" },
        { id: "B", text: "'NII1'" },
        { id: "C", text: "'RIFF'" },
        { id: "D", text: "'JPEG'" }
      ],
      correct_option_id: "A",
      explanation: "The magic string 'DICM' confirms the file conforms to the DICOM File Format specification."
    },
    {
      id: "m3-q8",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "What metric measures the spatial resolution of an imaging system across spatial frequencies, defined as the ratio of output contrast to input contrast?",
      options: [
        { id: "A", text: "Modulation Transfer Function (MTF)" },
        { id: "B", text: "Signal-to-Noise Ratio (SNR)" },
        { id: "C", text: "Entropy per bit" },
        { id: "D", text: "Nyquist frequency" }
      ],
      correct_option_id: "A",
      explanation: "MTF(f) measures the system's fidelity in transferring object contrast to the detector across spatial frequency f."
    },
    {
      id: "m3-q9",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "If an acquisition signal has mean μ = 100 and background noise standard deviation σ = 5, what is the Signal-to-Noise Ratio (SNR)?",
      options: [
        { id: "A", text: "5" },
        { id: "B", text: "20" },
        { id: "C", text: "500" },
        { id: "D", text: "0.05" }
      ],
      correct_option_id: "B",
      explanation: "SNR = Mean / Standard Deviation = 100 / 5 = 20."
    },
    {
      id: "m3-q10",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "How does repeating and averaging N identical independent noisy acquisitions affect the resulting Signal-to-Noise Ratio (SNR)?",
      options: [
        { id: "A", text: "SNR increases by a factor of √N" },
        { id: "B", text: "SNR increases linearly by N" },
        { id: "C", text: "SNR decreases by 1/N" },
        { id: "D", text: "SNR remains unchanged" }
      ],
      correct_option_id: "A",
      explanation: "Signal sums linearly (N), while uncorrelated noise variance sums linearly (noise standard deviation scales as √N), yielding an SNR improvement of N / √N = √N."
    },
    {
      id: "m3-q11",
      moduleId: "mod-3",
      co_tag: "CO4",
      question_text: "What is an isotropic voxel volume in 3D medical imaging?",
      options: [
        { id: "A", text: "A voxel whose dimensions are equal in all three axes (Δx = Δy = Δz)" },
        { id: "B", text: "A voxel that only records radioactive decay" },
        { id: "C", text: "A voxel with slice thickness > 5 times pixel width" },
        { id: "D", text: "A voxel containing only water" }
      ],
      correct_option_id: "A",
      explanation: "Isotropic voxels (e.g. 0.5 × 0.5 × 0.5 mm) allow high-fidelity multiplanar reformatting without distortion or interpolation blur."
    },
    {
      id: "m3-q12",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "In DICOM metadata, what Value Representation (VR) code indicates a Unique Identifier (e.g. SOP Instance UID)?",
      options: [
        { id: "A", text: "UI" },
        { id: "B", text: "PN" },
        { id: "C", text: "DS" },
        { id: "D", text: "IS" }
      ],
      correct_option_id: "A",
      explanation: "UI is the DICOM Value Representation for dot-separated international Unique Identifiers."
    },
    {
      id: "m3-q13",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "Which DICOM tag pair defines the in-plane physical spacing between the centers of adjacent pixels in millimeters?",
      options: [
        { id: "A", text: "(0028,0030) Pixel Spacing [Row Spacing \\ Column Spacing]" },
        { id: "B", text: "(0010,0040) Patient's Sex" },
        { id: "C", text: "(0008,1030) Study Description" },
        { id: "D", text: "(0028,0100) Bits Allocated" }
      ],
      correct_option_id: "A",
      explanation: "Tag (0028,0030) supplies row and column distance in mm between adjacent pixel centers."
    },
    {
      id: "m3-q14",
      moduleId: "mod-3",
      co_tag: "CO4",
      question_text: "Why is pseudo-color mapping frequently applied to nuclear medicine SPECT and PET scans?",
      options: [
        { id: "A", text: "The human eye can discriminate hundreds of color hues compared to only ~30 shades of gray" },
        { id: "B", text: "To reduce image file size" },
        { id: "C", text: "Because PET detectors output RGB laser wavelengths" },
        { id: "D", text: "To suppress background radioactive decay" }
      ],
      correct_option_id: "A",
      explanation: "Human vision has far greater dynamic discrimination across color spectrums (e.g. rainbow/hot-metal LUTs) than subtle monochrome gray scales."
    },
    {
      id: "m3-q15",
      moduleId: "mod-3",
      co_tag: "CO2",
      question_text: "What process strips patient names, accession numbers, and direct identifiers from DICOM files before research sharing?",
      options: [
        { id: "A", text: "HIPAA / DPDP De-identification (DICOM PS3.15 Annex E)" },
        { id: "B", text: "Lossless Huffman entropy coding" },
        { id: "C", text: "Bicubic spatial interpolation" },
        { id: "D", text: "Edge-preserving anisotropic diffusion" }
      ],
      correct_option_id: "A",
      explanation: "DICOM PS3.15 Annex E specifies the Basic Application Level Confidentiality Profile for scrubbed clinical data."
    }
  ],

  // MODULE 4: Operations in Intensity Space (15 Questions)
  "mod-4": [
    {
      id: "m4-q1",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What are the standard clinical Window Width (WW) and Window Level (WL) settings for acute ischemic brain stroke evaluation?",
      options: [
        { id: "A", text: "WW = 80 HU, WL = +40 HU (Narrow Brain Window)" },
        { id: "B", text: "WW = 2000 HU, WL = +400 HU (Bone Window)" },
        { id: "C", text: "WW = 1500 HU, WL = -600 HU (Lung Window)" },
        { id: "D", text: "WW = 400 HU, WL = +50 HU (Abdominal Window)" }
      ],
      correct_option_id: "A",
      explanation: "A narrow brain window (WW 80, WL 40) maximizes subtle contrast differences between gray and white matter to spot early cytotoxic edema."
    },
    {
      id: "m4-q2",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "Given Window Width WW = 400 and Window Level WL = +50, what range of CT numbers is mapped across the display's 0 to 255 grayscale?",
      options: [
        { id: "A", text: "[-150 HU to +250 HU]" },
        { id: "B", text: "[0 HU to +400 HU]" },
        { id: "C", text: "[-200 HU to +200 HU]" },
        { id: "D", text: "[+50 HU to +450 HU]" }
      ],
      correct_option_id: "A",
      explanation: "Range = [WL - WW/2, WL + WW/2] = [50 - 200, 50 + 200] = [-150 HU, +250 HU]."
    },
    {
      id: "m4-q3",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What mathematical transformation is performed during Global Histogram Equalization?",
      options: [
        { id: "A", text: "Mapping input intensities via the Cumulative Distribution Function (CDF) of the histogram" },
        { id: "B", text: "Multiplying pixel values by a random Gaussian matrix" },
        { id: "C", text: "Applying Sobel vertical derivatives" },
        { id: "D", text: "Subtracting the minimum pixel value from the maximum" }
      ],
      correct_option_id: "A",
      explanation: "Histogram equalization uses the normalized CDF to produce an output image with an approximately uniform probability density function."
    },
    {
      id: "m4-q4",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "Why is Contrast Limited Adaptive Histogram Equalization (CLAHE) preferred over standard global histogram equalization for medical X-rays?",
      options: [
        { id: "A", text: "It clips histogram peaks to prevent severe noise over-amplification in homogenous regions" },
        { id: "B", text: "It converts 2D images to 3D meshes" },
        { id: "C", text: "It operates in the frequency domain only" },
        { id: "D", text: "It decreases spatial resolution" }
      ],
      correct_option_id: "A",
      explanation: "CLAHE divides the image into contextual tiles and limits contrast amplification by clipping the histogram at a predefined threshold."
    },
    {
      id: "m4-q5",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What visual artifact occurs when quantizing a continuous medical gradient into too few discrete gray levels (e.g. 4 bits / 16 shades)?",
      options: [
        { id: "A", text: "False Contouring / Banding Artifact" },
        { id: "B", text: "Motion blur" },
        { id: "C", text: "Nyquist aliasing" },
        { id: "D", text: "Ring artifact" }
      ],
      correct_option_id: "A",
      explanation: "Coarse quantization creates abrupt visible boundary bands where gradual intensity transitions should exist."
    },
    {
      id: "m4-q6",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What technique adds low-amplitude pseudo-random noise before quantization to break up false contouring bands?",
      options: [
        { id: "A", text: "Dithering" },
        { id: "B", text: "High-pass filtering" },
        { id: "C", text: "Bicubic spline" },
        { id: "D", text: "Histogram stretching" }
      ],
      correct_option_id: "A",
      explanation: "Dithering randomizes quantization steps, replacing harsh stair-step bands with subtle high-frequency noise that the eye averages out."
    },
    {
      id: "m4-q7",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What is the typical Window Width and Level used to inspect subtle pulmonary parenchymal nodules and emphysema in thoracic CT?",
      options: [
        { id: "A", text: "WW = 1500 HU, WL = -600 HU" },
        { id: "B", text: "WW = 80 HU, WL = +40 HU" },
        { id: "C", text: "WW = 400 HU, WL = +40 HU" },
        { id: "D", text: "WW = 2500 HU, WL = +500 HU" }
      ],
      correct_option_id: "A",
      explanation: "Lung parenchyma contains mostly air (-1000 HU) and fine vessels (-200 HU), requiring a wide window centered around -600 HU."
    },
    {
      id: "m4-q8",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "If an incoming CT pixel has an attenuation value of +600 HU and the display window is set to WW = 400, WL = +50, how does this pixel render on screen?",
      options: [
        { id: "A", text: "Saturated Pure White (Intensity = 255)" },
        { id: "B", text: "Saturated Pure Black (Intensity = 0)" },
        { id: "C", text: "Mid-gray (Intensity = 128)" },
        { id: "D", text: "Transparent" }
      ],
      correct_option_id: "A",
      explanation: "The upper window limit is WL + WW/2 = 50 + 200 = +250 HU. Any value above +250 HU is clamped to pure white (255)."
    },
    {
      id: "m4-q9",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What is the primary difference between a linear contrast stretch and histogram equalization?",
      options: [
        { id: "A", text: "Contrast stretch applies a monotonic linear scaling between min and max; histogram equalization redistributes frequencies non-linearly" },
        { id: "B", text: "Contrast stretch alters image geometry" },
        { id: "C", text: "Histogram equalization only works on color RGB files" },
        { id: "D", text: "There is no functional difference" }
      ],
      correct_option_id: "A",
      explanation: "Linear stretch preserves relative intensity differences, while histogram equalization non-linearly expands crowded intensity bins."
    },
    {
      id: "m4-q10",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What CT number range corresponds to acute intracranial hemorrhage on non-contrast head CT?",
      options: [
        { id: "A", text: "+60 HU to +90 HU (Hyperdense relative to brain parenchyma)" },
        { id: "B", text: "-100 HU to -50 HU" },
        { id: "C", text: "0 HU to +10 HU" },
        { id: "D", text: "+1000 HU to +1500 HU" }
      ],
      correct_option_id: "A",
      explanation: "Clotted blood with concentrated hemoglobin attenuates between +60 and +90 HU, appearing brighter than gray matter (~+40 HU)."
    },
    {
      id: "m4-q11",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What is the dynamic range of an uncompressed medical image with 16 bits allocated and 12 bits stored per pixel?",
      options: [
        { id: "A", text: "2¹² = 4096 discrete intensity levels" },
        { id: "B", text: "2¹⁶ = 65,536 discrete intensity levels" },
        { id: "C", text: "256 intensity levels" },
        { id: "D", text: "1024 intensity levels" }
      ],
      correct_option_id: "A",
      explanation: "Bits Stored (12 bits) governs actual radiometric dynamic range: 2^12 = 4096 levels (often signed -1024 to +3071 HU)."
    },
    {
      id: "m4-q12",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What clinical structure has negative Hounsfield attenuation numbers between -100 HU and -50 HU?",
      options: [
        { id: "A", text: "Subcutaneous and visceral adipose tissue (Fat)" },
        { id: "B", text: "Compact cortical bone" },
        { id: "C", text: "Cerebrospinal fluid" },
        { id: "D", text: "Contrast-enhanced aorta" }
      ],
      correct_option_id: "A",
      explanation: "Adipose tissue is less dense than water and exhibits attenuation between -100 HU and -50 HU."
    },
    {
      id: "m4-q13",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "What DICOM tags define the linear transformation from stored pixel values to true Hounsfield units?",
      options: [
        { id: "A", text: "Rescale Slope (0028,1053) and Rescale Intercept (0028,1052): HU = PixelVal × Slope + Intercept" },
        { id: "B", text: "Rows and Columns" },
        { id: "C", text: "Patient Weight and Height" },
        { id: "D", text: "Slice Location and Thickness" }
      ],
      correct_option_id: "A",
      explanation: "HU = (Stored Pixel Value × Rescale Slope) + Rescale Intercept. Standard slope is often 1, intercept -1024."
    },
    {
      id: "m4-q14",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "In ultrasound signal processing, what logarithmic compression operation is applied to the raw RF envelope before display?",
      options: [
        { id: "A", text: "Logarithmic Dynamic Range Compression (e.g. 100 dB down to 50 dB)" },
        { id: "B", text: "Linear Fourier multiplication" },
        { id: "C", text: "Otsu binarization" },
        { id: "D", text: "Laplacian sharpening" }
      ],
      correct_option_id: "A",
      explanation: "Raw ultrasound echoes span >100 dB of dynamic range, requiring logarithmic compression to fit the human eye's ~30 dB range."
    },
    {
      id: "m4-q15",
      moduleId: "mod-4",
      co_tag: "CO2",
      question_text: "How does applying an intensity threshold of T = 0 HU segment a non-contrast abdominal CT slice?",
      options: [
        { id: "A", text: "Separates air, gas, and fat (< 0 HU) from soft tissue, organs, and bone (≥ 0 HU)" },
        { id: "B", text: "Removes all bones" },
        { id: "C", text: "Isolates pure vascular contrast" },
        { id: "D", text: "Calculates the kidney volume directly" }
      ],
      correct_option_id: "A",
      explanation: "Water attenuation is 0 HU; fat and air fall strictly below 0 HU, while muscle, organs, fluid collections, and bone fall above."
    }
  ],

  // MODULE 5: Filtering, Transformations and Segmentation (15 Questions)
  "mod-5": [
    {
      id: "m5-q1",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "According to the Convolution Theorem, spatial domain convolution of an image with a filter kernel is mathematically equivalent to what operation in the frequency domain?",
      options: [
        { id: "A", text: "Pointwise element-by-element multiplication of their Fourier transforms" },
        { id: "B", text: "Matrix inversion" },
        { id: "C", text: "Convolution of their Fourier transforms" },
        { id: "D", text: "Eigenvalue decomposition" }
      ],
      correct_option_id: "A",
      explanation: "F{f * g} = F{f} · F{g}. Convolution in the spatial domain becomes simple pointwise multiplication in the frequency domain."
    },
    {
      id: "m5-q2",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "Which 2D spatial convolution kernel is engineered to calculate the horizontal gradient (detecting vertical intensity edges)?",
      options: [
        { id: "A", text: "Sobel Gx: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]" },
        { id: "B", text: "Laplacian: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]" },
        { id: "C", text: "Gaussian Blur 3x3: [[1, 2, 1], [2, 4, 2], [1, 2, 1]] / 16" },
        { id: "D", text: "Identity kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]]" }
      ],
      correct_option_id: "A",
      explanation: "The Sobel horizontal gradient operator computes differences along the x-axis with central row weighting to suppress noise."
    },
    {
      id: "m5-q3",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "What criterion does Otsu's thresholding algorithm optimize to find the ideal global binarization threshold?",
      options: [
        { id: "A", text: "Maximizing between-class variance (equivalent to minimizing within-class variance)" },
        { id: "B", text: "Minimizing total image entropy" },
        { id: "C", text: "Matching the median pixel intensity" },
        { id: "D", text: "Selecting the highest pixel value" }
      ],
      correct_option_id: "A",
      explanation: "Otsu's threshold exhaustively searches for the threshold that maximizes the variance between foreground and background classes."
    },
    {
      id: "m5-q4",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "In clinical segmentation validation, what is the formula for the Dice Similarity Coefficient (DSC) between prediction P and ground truth G?",
      options: [
        { id: "A", text: "DSC = 2 |P ∩ G| / (|P| + |G|)" },
        { id: "B", text: "DSC = |P ∩ G| / |P ∪ G|" },
        { id: "C", text: "DSC = |P| / |G|" },
        { id: "D", text: "DSC = 1 - (|P| - |G|)" }
      ],
      correct_option_id: "A",
      explanation: "Dice = 2·TP / (2·TP + FP + FN). An exact overlap produces DSC = 1.0; no overlap produces 0.0."
    },
    {
      id: "m5-q5",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "Given a Dice Similarity Coefficient DSC = 0.80, what is the corresponding Jaccard Index (Intersection over Union, IoU)?",
      options: [
        { id: "A", text: "IoU = DSC / (2 - DSC) = 0.80 / 1.20 = 0.667" },
        { id: "B", text: "IoU = 0.80" },
        { id: "C", text: "IoU = 0.40" },
        { id: "D", text: "IoU = 0.90" }
      ],
      correct_option_id: "A",
      explanation: "IoU = DSC / (2 - DSC) = 0.80 / (2 - 0.80) = 0.80 / 1.20 = 0.667 (66.7%)."
    },
    {
      id: "m5-q6",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "In MRI raw data space (k-space), what visual image characteristics are encoded by the center of k-space versus the periphery?",
      options: [
        { id: "A", text: "Center encodes bulk tissue contrast (low frequencies); periphery encodes sharp edges and fine spatial detail (high frequencies)" },
        { id: "B", text: "Center encodes patient name; periphery encodes image pixels" },
        { id: "C", text: "Center encodes high frequencies; periphery encodes low frequencies" },
        { id: "D", text: "Both encode identical data" }
      ],
      correct_option_id: "A",
      explanation: "Center k-space contains highest amplitude low-frequency signals governing overall image contrast, while peripheral lines resolve fine edges."
    },
    {
      id: "m5-q7",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "What clinical pitfall frequently affects Seeded Region Growing algorithms during tumour segmentation?",
      options: [
        { id: "A", text: "Boundary leakage into adjacent tissues through narrow intensity bridges or partial volume voxels" },
        { id: "B", text: "Inability to run on CPU" },
        { id: "C", text: "Loss of DICOM metadata" },
        { id: "D", text: "Inverting pixel signs from positive to negative" }
      ],
      correct_option_id: "A",
      explanation: "If threshold criteria are too loose, the growing region leaks across weak organ boundaries into surrounding parenchyma."
    },
    {
      id: "m5-q8",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "What distance metric evaluates the maximum discrepancy between two segmented surface contours by finding the greatest nearest-neighbor distance?",
      options: [
        { id: "A", text: "Hausdorff Distance (95th percentile HD95)" },
        { id: "B", text: "Pearson correlation coefficient" },
        { id: "C", text: "Spearman rank" },
        { id: "D", text: "Dice coefficient" }
      ],
      correct_option_id: "A",
      explanation: "HD95 measures the 95th percentile worst-case distance between true and predicted boundary points, critical in radiation oncology contouring."
    },
    {
      id: "m5-q9",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "What is the effect of applying an unsharp masking filter to a diagnostic chest radiograph?",
      options: [
        { id: "A", text: "Enhances fine edges by subtracting a blurred version of the image from the original" },
        { id: "B", text: "Blurs all high-contrast structures" },
        { id: "C", text: "Converts the image to binary black-and-white" },
        { id: "D", text: "Removes breathing motion" }
      ],
      correct_option_id: "A",
      explanation: "Unsharp mask: g(x,y) = f(x,y) + k · [f(x,y) - f_smooth(x,y)], accentuating high-frequency detail at rib and lung boundaries."
    },
    {
      id: "m5-q10",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "In anatomical Region of Interest (ROI) analysis, what spatial moment calculates the centroid (center of mass) (x̄, ȳ)?",
      options: [
        { id: "A", text: "x̄ = M₁₀ / M₀₀,  ȳ = M₀₁ / M₀₀" },
        { id: "B", text: "x̄ = M₀₀ / M₁₀" },
        { id: "C", text: "x̄ = M₂₀ · M₀₂" },
        { id: "D", text: "x̄ = M₁₁ / M₀₀" }
      ],
      correct_option_id: "A",
      explanation: "The first-order raw moments divided by the zeroth-order moment (area M00) yield the centroid coordinates."
    },
    {
      id: "m5-q11",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "Which frequency domain filter completely zeroes out all frequencies higher than a cutoff D₀, causing ringing (Gibbs phenomenon) in the spatial domain?",
      options: [
        { id: "A", text: "Ideal Low-Pass Filter (ILPF)" },
        { id: "B", text: "Butterworth Low-Pass Filter of order 2" },
        { id: "C", text: "Gaussian Low-Pass Filter" },
        { id: "D", text: "High-frequency emphasis filter" }
      ],
      correct_option_id: "A",
      explanation: "The sharp brick-wall discontinuity of an Ideal Low-Pass Filter in frequency space transforms into a sinc function in space, creating ringing ripples."
    },
    {
      id: "m5-q12",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "What morphological operation combines dilation followed by erosion to close small holes and bridges within a segmented organ mask?",
      options: [
        { id: "A", text: "Morphological Closing" },
        { id: "B", text: "Morphological Opening" },
        { id: "C", text: "Top-hat transform" },
        { id: "D", text: "Skeletonization" }
      ],
      correct_option_id: "A",
      explanation: "Closing (A • B = (A ⊕ B) ⊖ B) fills narrow cavities, smooths outward contours, and fuses small breaks."
    },
    {
      id: "m5-q13",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "What morphological operation combines erosion followed by dilation to eliminate tiny isolated noise specks?",
      options: [
        { id: "A", text: "Morphological Opening" },
        { id: "B", text: "Morphological Closing" },
        { id: "C", text: "Hit-or-miss transform" },
        { id: "D", text: "Watershed" }
      ],
      correct_option_id: "A",
      explanation: "Opening (A ∘ B = (A ⊖ B) ⊕ B) removes thin protrusions and disconnected background speckles without altering large object area."
    },
    {
      id: "m5-q14",
      moduleId: "mod-5",
      co_tag: "CO3",
      question_text: "Why does Gaussian filtering not produce ringing artifacts in image processing?",
      options: [
        { id: "A", text: "The Fourier transform of a continuous Gaussian is itself another smooth Gaussian with zero ringing ripples" },
        { id: "B", text: "Because it only runs on integers" },
        { id: "C", text: "Because it uses median sorting" },
        { id: "D", text: "Because it is non-linear" }
      ],
      correct_option_id: "A",
      explanation: "A Gaussian has no sharp transitions in either domain; its transform is strictly Gaussian without negative sidelobes."
    },
    {
      id: "m5-q15",
      moduleId: "mod-5",
      co_tag: "CO2",
      question_text: "In active contour (Snake) segmentation models, what does the internal energy term enforce?",
      options: [
        { id: "A", text: "Smoothness and continuity (elasticity and bending resistance) of the evolving contour" },
        { id: "B", text: "Attraction to image gradient edges" },
        { id: "C", text: "Balloon inflation pressure" },
        { id: "D", text: "Random perturbation" }
      ],
      correct_option_id: "A",
      explanation: "Internal energy E_int = α|v'(s)|² + β|v''(s)|² controls tension (length minimization) and rigidity (preventing sharp kinks)."
    }
  ],

  // MODULE 6: Spatial Transforms & 3D Rendering (15 Questions)
  "mod-6": [
    {
      id: "m6-q1",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "According to the Nyquist-Shannon Sampling Theorem, what sampling frequency fs is required to reconstruct a continuous signal containing maximum frequency fmax without aliasing?",
      options: [
        { id: "A", text: "fs ≥ 2 fmax" },
        { id: "B", text: "fs = fmax / 2" },
        { id: "C", text: "fs = fmax" },
        { id: "D", text: "fs ≥ 4 fmax²" }
      ],
      correct_option_id: "A",
      explanation: "The sampling rate must be at least twice the highest frequency component (Nyquist rate) to prevent spectrum overlap (aliasing)."
    },
    {
      id: "m6-q2",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What 3D rendering algorithm extracts an isosurface triangular mesh from a volumetric scalar field by evaluating each 8-voxel cube?",
      options: [
        { id: "A", text: "Marching Cubes Algorithm (Lorensen & Cline)" },
        { id: "B", text: "Bresenham's line algorithm" },
        { id: "C", text: "Dijkstra's shortest path" },
        { id: "D", text: "Barnes-Hut tree" }
      ],
      correct_option_id: "A",
      explanation: "Marching Cubes classifies 256 topological vertex states (reduced by symmetry to 15 cases) to triangulate bone/organ isosurfaces."
    },
    {
      id: "m6-q3",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "In CT Maximum Intensity Projection (MIP) rendering, how is the display pixel value determined along each projection ray?",
      options: [
        { id: "A", text: "The maximum attenuation value encountered along the viewing ray is displayed" },
        { id: "B", text: "The mean attenuation value along the ray is displayed" },
        { id: "C", text: "The first surface hit is shaded" },
        { id: "D", text: "The minimum attenuation value is selected" }
      ],
      correct_option_id: "A",
      explanation: "MIP casts rays and outputs only the highest HU encountered, ideal for contrast-enhanced CT angiography to visualize patent lumen."
    },
    {
      id: "m6-q4",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What clinical imaging feature is Minimum Intensity Projection (MinIP) specifically engineered to detect?",
      options: [
        { id: "A", text: "Hypoattenuating tracheobronchial air-trapping, pneumothorax, and biliary dilation" },
        { id: "B", text: "Calcified coronary plaques" },
        { id: "C", text: "Cortical bone fractures" },
        { id: "D", text: "Aortic dissections" }
      ],
      correct_option_id: "A",
      explanation: "MinIP projects the lowest density voxels along each ray, highlighting low-attenuation airway trees, mosaic perfusion, and air leaks."
    },
    {
      id: "m6-q5",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What interpolation method achieves the highest mathematical fidelity when rotating or resampling medical volume grids, despite higher computational cost?",
      options: [
        { id: "A", text: "Tricubic B-spline / Sinc interpolation" },
        { id: "B", text: "Nearest neighbor interpolation" },
        { id: "C", text: "Zero-order hold" },
        { id: "D", text: "Manhattan distance" }
      ],
      correct_option_id: "A",
      explanation: "Cubic splines evaluate a 4x4x4 (64 voxel) neighborhood with continuous 1st and 2nd derivatives, avoiding blocky pixelation or loss of MTF."
    },
    {
      id: "m6-q6",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "In rigid-body 3D image registration, how many total degrees of freedom (DoF) are optimized?",
      options: [
        { id: "A", text: "6 DoF (3 Translations: Tx, Ty, Tz; 3 Rotations: Pitch, Roll, Yaw)" },
        { id: "B", text: "3 DoF" },
        { id: "C", text: "9 DoF" },
        { id: "D", text: "12 DoF" }
      ],
      correct_option_id: "A",
      explanation: "A rigid body transform preserves distances between points and has 6 DoF (3 Cartesian translations + 3 Euler rotation angles)."
    },
    {
      id: "m6-q7",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What view generation technique re-slices an axial CT volume along arbitrary coronal, sagittal, or oblique diagnostic planes?",
      options: [
        { id: "A", text: "Multiplanar Reformatting (MPR)" },
        { id: "B", text: "Fast Fourier Inversion" },
        { id: "C", text: "Morphological Skeletonization" },
        { id: "D", text: "Histogram equalization" }
      ],
      correct_option_id: "A",
      explanation: "MPR extracts 2D planar slices across any arbitrary 3D vector from an isotropic volumetric voxel grid."
    },
    {
      id: "m6-q8",
      moduleId: "mod-6",
      co_tag: "CO4",
      question_text: "In Direct Volume Rendering (DVR) raycasting, what transfer functions define how voxels are visualized?",
      options: [
        { id: "A", text: "Color Transfer Function (RGB) and Opacity Transfer Function (Alpha)" },
        { id: "B", text: "Rescale slope and intercept" },
        { id: "C", text: "JPEG quantization tables" },
        { id: "D", text: "Nyquist frequency cutoff" }
      ],
      correct_option_id: "A",
      explanation: "Transfer functions map physical scalar values (HU) to optical color (RGB) and transparency (Alpha: 0.0 transparent to 1.0 opaque)."
    },
    {
      id: "m6-q9",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What artifact appears in Multiplanar Reformatted (MPR) images when an axial scan has thick slices (e.g. 5 mm thickness with 0.5 mm pixel width)?",
      options: [
        { id: "A", text: "Stair-step / Z-axis banding artifact" },
        { id: "B", text: "Moire pattern" },
        { id: "C", text: "Chemical shift artifact" },
        { id: "D", text: "Ring artifact" }
      ],
      correct_option_id: "A",
      explanation: "Highly anisotropic voxels cause severe stair-stepping when reformatted along coronal or sagittal planes."
    },
    {
      id: "m6-q10",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What is Curved Planar Reformatting (CPR) primarily used for in diagnostic radiology?",
      options: [
        { id: "A", text: "Displaying tortuous vessels (coronary arteries, aorta) or spine along their curved anatomical centerline" },
        { id: "B", text: "Compressing DICOM files" },
        { id: "C", text: "Detecting lung emphysema" },
        { id: "D", text: "Measuring liver volume" }
      ],
      correct_option_id: "A",
      explanation: "CPR straightens or unrolls a curved path (like a coronary artery) along a user-traced centerline in a single 2D view."
    },
    {
      id: "m6-q11",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What happens during Nearest Neighbor interpolation when a 512x512 image is magnified to 2048x2048?",
      options: [
        { id: "A", text: "Blocks of duplicate pixels are created resulting in visible pixelation and jagged diagonal edges" },
        { id: "B", text: "Image is blurred smoothly" },
        { id: "C", text: "Ringing ripples appear" },
        { id: "D", text: "Noise is eliminated" }
      ],
      correct_option_id: "A",
      explanation: "Nearest neighbor assigns the value of the single closest point, producing blocky square patches and checkerboarding."
    },
    {
      id: "m6-q12",
      moduleId: "mod-6",
      co_tag: "CO4",
      question_text: "In surface shading for 3D rendered medical meshes, what formula calculates Phong diffuse reflection on a triangle?",
      options: [
        { id: "A", text: "I_diffuse = I_light · k_d · max(0, N · L)" },
        { id: "B", text: "I_diffuse = I_light / k_d" },
        { id: "C", text: "I_diffuse = N × L" },
        { id: "D", text: "I_diffuse = k_s · (R · V)^n" }
      ],
      correct_option_id: "A",
      explanation: "Lambert's cosine law computes diffuse reflection as the dot product between the surface unit normal N and light direction L."
    },
    {
      id: "m6-q13",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What type of projection maintains exact metric scale without perspective foreshortening, standard in orthopedic implant templating?",
      options: [
        { id: "A", text: "Orthogonal (Orthographic) Projection" },
        { id: "B", text: "Perspective Projection with 60° FOV" },
        { id: "C", text: "Fisheye projection" },
        { id: "D", text: "Stereographic projection" }
      ],
      correct_option_id: "A",
      explanation: "Orthographic rays are completely parallel; object dimensions do not shrink with distance, enabling direct physical distance measurements."
    },
    {
      id: "m6-q14",
      moduleId: "mod-6",
      co_tag: "CO4",
      question_text: "In volume raycasting, what compositing algorithm blends sampled colors and opacities along the ray from front to back?",
      options: [
        { id: "A", text: "Alpha Blending (Over Operator): C_out = C_src + (1 - α_src) · C_dst" },
        { id: "B", text: "Bitwise XOR" },
        { id: "C", text: "Laplacian pyramid" },
        { id: "D", text: "Sobel filtering" }
      ],
      correct_option_id: "A",
      explanation: "Porter-Duff 'Over' compositing progressively accumulates opacity until α reaches 1.0 (ray termination)."
    },
    {
      id: "m6-q15",
      moduleId: "mod-6",
      co_tag: "CO3",
      question_text: "What aliasing artifact occurs in digital fluoroscopy when sampling a fine metal anti-scatter grid below the Nyquist rate?",
      options: [
        { id: "A", text: "Moiré fringe pattern artifact" },
        { id: "B", text: "Chemical shift" },
        { id: "C", text: "Geometric barrel distortion" },
        { id: "D", text: "Truncation artifact" }
      ],
      correct_option_id: "A",
      explanation: "When grid frequency is near detector sampling frequency, beat interference creates coarse wavy Moiré stripes."
    }
  ]
};

// 40-QUESTION GRAND CAPSTONE ASSESSMENT (Covering all 6 modules & Course Outcomes CO1-CO5)
export const GRAND_CAPSTONE_40_QUESTIONS: QuizQuestionItem[] = [
  // CO1: Medical Image Sources (8 Questions)
  {
    id: "g-1",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "Which physical interaction mechanism dominates X-ray attenuation in high-Z materials such as bone and iodinated contrast at diagnostic energies?",
    options: [
      { id: "A", text: "Photoelectric absorption (proportional to Z³ / E³)" },
      { id: "B", text: "Incoherent Compton scattering" },
      { id: "C", text: "Pair production" },
      { id: "D", text: "Photodisintegration" }
    ],
    correct_option_id: "A",
    explanation: "Photoelectric absorption scales strongly with atomic number (Z³), providing contrast between bone (Z_eff ~ 13.8) and soft tissue (Z_eff ~ 7.4)."
  },
  {
    id: "g-2",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "What is the Hounsfield attenuation definition of compact cortical bone relative to water?",
    options: [
      { id: "A", text: "+1000 HU to +3000 HU" },
      { id: "B", text: "0 HU" },
      { id: "C", text: "-500 HU" },
      { id: "D", text: "-1000 HU" }
    ],
    correct_option_id: "A",
    explanation: "Dense bone attenuates heavily and measures from +1000 HU up to +3000 HU."
  },
  {
    id: "g-3",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "What equation calculates the Larmor precession frequency f of nuclear magnetic moments in a static magnetic field B₀?",
    options: [
      { id: "A", text: "f = (γ / 2π) · B₀" },
      { id: "B", text: "f = c / λ" },
      { id: "C", text: "f = h · E" },
      { id: "D", text: "f = μ · x" }
    ],
    correct_option_id: "A",
    explanation: "The Larmor equation f = (γ / 2π) B₀ links magnetic field strength directly to proton resonance frequency."
  },
  {
    id: "g-4",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "What tissue property change causes ultrasound pulse reflection at the boundary between liver parenchyma and renal capsule?",
    options: [
      { id: "A", text: "Specific acoustic impedance mismatch (Z = ρc)" },
      { id: "B", text: "Dielectric constant" },
      { id: "C", text: "Electrical conductivity" },
      { id: "D", text: "Electron valence" }
    ],
    correct_option_id: "A",
    explanation: "Reflection coefficient R = ((Z2 - Z1)/(Z2 + Z1))² depends entirely on acoustic impedance differences."
  },
  {
    id: "g-5",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "If a monochromatic beam has initial intensity I₀ and traverses 2 cm of tissue with μ = 0.5 cm⁻¹, what is the transmitted intensity I?",
    options: [
      { id: "A", text: "I = I₀ · e⁻¹ ≈ 0.368 · I₀ (36.8% transmission)" },
      { id: "B", text: "I = 0.50 · I₀" },
      { id: "C", text: "I = 0.10 · I₀" },
      { id: "D", text: "I = 0.95 · I₀" }
    ],
    correct_option_id: "A",
    explanation: "Beer-Lambert law: I = I₀ · e^(-μ·x) = I₀ · e^(-0.5 × 2) = I₀ · e^(-1) ≈ 0.368 I₀."
  },
  {
    id: "g-6",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "What physical radiation governs PET scanner coincidence detection?",
    options: [
      { id: "A", text: "Two 511 keV annihilation photons emitted 180 degrees apart" },
      { id: "B", text: "140 keV single gamma photons" },
      { id: "C", text: "Beta particle deceleration" },
      { id: "D", text: "Ultrasound reverberation" }
    ],
    correct_option_id: "A",
    explanation: "Positron-electron annihilation produces twin 511 keV gamma rays traveling in opposite directions."
  },
  {
    id: "g-7",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "In MRI, what is the main mechanism causing T2* decay to be faster than pure T2 decay?",
    options: [
      { id: "A", text: "Macroscopic static magnetic field inhomogeneities (ΔB₀) adding to microscopic spin-spin interactions" },
      { id: "B", text: "RF amplifier thermal noise" },
      { id: "C", text: "Patient body heat" },
      { id: "D", text: "Chemical radioisotope decay" }
    ],
    correct_option_id: "A",
    explanation: "1/T2* = 1/T2 + γΔB₀. Magnetic field non-uniformities accelerate transverse spin dephasing."
  },
  {
    id: "g-8",
    moduleId: "mod-1",
    co_tag: "CO1",
    question_text: "Why is patient gonadal and thyroid shielding employed during dental and extremities radiography under ALARA principles?",
    options: [
      { id: "A", text: "To minimize stochastic radiation risks (carcinogenesis and hereditary effects)" },
      { id: "B", text: "To increase image brightness" },
      { id: "C", text: "To speed up exposure duration" },
      { id: "D", text: "To calibrate detector gain" }
    ],
    correct_option_id: "A",
    explanation: "Stochastic risks have no dose threshold; shielding radiosensitive tissues lowers lifetime risk."
  },

  // CO2: PACS, Intensity, DICOM & Quality (8 Questions)
  {
    id: "g-9",
    moduleId: "mod-2",
    co_tag: "CO2",
    question_text: "In hospital enterprise PACS, what communication command transfers clinical studies from modalities to storage archives?",
    options: [
      { id: "A", text: "DICOM C-STORE" },
      { id: "B", text: "DICOM C-ECHO" },
      { id: "C", text: "HTTP POST /upload" },
      { id: "D", text: "FTP PUT" }
    ],
    correct_option_id: "A",
    explanation: "C-STORE is the universal DICOM service for push transfer of composite instances."
  },
  {
    id: "g-10",
    moduleId: "mod-3",
    co_tag: "CO2",
    question_text: "Which DICOM tag group contains patient administrative attributes such as Patient's Name and Patient ID?",
    options: [
      { id: "A", text: "Group 0010 (e.g. 0010,0010 and 0010,0020)" },
      { id: "B", text: "Group 0028" },
      { id: "C", text: "Group 0008" },
      { id: "D", text: "Group 7FE0" }
    ],
    correct_option_id: "A",
    explanation: "Group (0010,xxxx) is reserved for patient identity demographics in the DICOM data dictionary."
  },
  {
    id: "g-11",
    moduleId: "mod-3",
    co_tag: "CO2",
    question_text: "Where is the raw binary pixel data stored in a DICOM Part 10 dataset?",
    options: [
      { id: "A", text: "Tag (7FE0,0010) Pixel Data" },
      { id: "B", text: "Tag (0028,0010) Rows" },
      { id: "C", text: "Tag (0008,0018) SOP Instance UID" },
      { id: "D", text: "In the 128-byte preamble" }
    ],
    correct_option_id: "A",
    explanation: "Tag (7FE0,0010) encapsulates the uncompressed or encapsulated bitstream of image samples."
  },
  {
    id: "g-12",
    moduleId: "mod-4",
    co_tag: "CO2",
    question_text: "What display transformation maps a narrow clinical CT window (WW 80, WL 40) onto a standard monitor display?",
    options: [
      { id: "A", text: "Piecewise linear VOI Look-Up Table (LUT)" },
      { id: "B", text: "High-pass spatial convolution" },
      { id: "C", text: "Radon sinogram transformation" },
      { id: "D", text: "Marching cubes triangulation" }
    ],
    correct_option_id: "A",
    explanation: "VOI LUT transforms window numbers linearly between black (0 HU) and white (255 HU)."
  },
  {
    id: "g-13",
    moduleId: "mod-4",
    co_tag: "CO2",
    question_text: "What is the primary advantage of Contrast Limited Adaptive Histogram Equalization (CLAHE) over global histogram equalization?",
    options: [
      { id: "A", text: "Limits local contrast enhancement by clipping histogram bins to prevent noise amplification" },
      { id: "B", text: "Zeroes out all negative pixels" },
      { id: "C", text: "Removes patient motion" },
      { id: "D", text: "Reduces memory usage by 90%" }
    ],
    correct_option_id: "A",
    explanation: "CLAHE calculates histograms across local tiles and clips them at a predefined contrast limit to suppress noise."
  },
  {
    id: "g-14",
    moduleId: "mod-3",
    co_tag: "CO2",
    question_text: "If an imaging system's Modulation Transfer Function drops to MTF = 0.1 at 3.0 line pairs per mm (lp/mm), what does this indicate?",
    options: [
      { id: "A", text: "The system retains only 10% contrast for spatial details spaced at 3.0 lp/mm (limiting spatial resolution)" },
      { id: "B", text: "Image is 10 times brighter" },
      { id: "C", text: "Detector has 10% dead pixels" },
      { id: "D", text: "Noise level is 0.1 dB" }
    ],
    correct_option_id: "A",
    explanation: "MTF = 0.1 is the accepted clinical limit of detectable spatial resolution for human observers."
  },
  {
    id: "g-15",
    moduleId: "mod-4",
    co_tag: "CO2",
    question_text: "What visual effect is produced when an image is quantized to only 3 bits (8 shades of gray)?",
    options: [
      { id: "A", text: "Severe false contouring / banding across smooth gradients" },
      { id: "B", text: "Geometric barrel distortion" },
      { id: "C", text: "High-frequency ringing ripples" },
      { id: "D", text: "Total signal void" }
    ],
    correct_option_id: "A",
    explanation: "Coarse 3-bit quantization creates harsh visible steps where smooth transitions should appear."
  },
  {
    id: "g-16",
    moduleId: "mod-2",
    co_tag: "CO2",
    question_text: "What DICOM conformance class guarantees that query results returned from a PACS accurately match requested criteria?",
    options: [
      { id: "A", text: "Query/Retrieve Service Class (C-FIND SCP/SCU)" },
      { id: "B", text: "Print Management Class" },
      { id: "C", text: "Media Storage Directory" },
      { id: "D", text: "Basic Worklist Management" }
    ],
    correct_option_id: "A",
    explanation: "The Q/R Service Class governs C-FIND, C-MOVE, and C-GET transactions between SCU and SCP."
  },

  // CO3: Filtering, FFT & Spatial Transforms (8 Questions)
  {
    id: "g-17",
    moduleId: "mod-5",
    co_tag: "CO3",
    question_text: "What spatial 2D kernel computes the isotropic second-order derivative (detecting rapid intensity transitions in all directions)?",
    options: [
      { id: "A", text: "Laplacian kernel: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]" },
      { id: "B", text: "Sobel Gx: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]" },
      { id: "C", text: "Box Mean 3x3" },
      { id: "D", text: "Prewitt Gy" }
    ],
    correct_option_id: "A",
    explanation: "The Laplacian ∇²f = ∂²f/∂x² + ∂²f/∂y² is an isotropic 2nd derivative operator sensitive to edges and corners."
  },
  {
    id: "g-18",
    moduleId: "mod-5",
    co_tag: "CO3",
    question_text: "What does the 2D Fast Fourier Transform (FFT) of a medical image represent?",
    options: [
      { id: "A", text: "Decomposition of the spatial image into spatial frequency sinusoidal basis functions with magnitude and phase" },
      { id: "B", text: "Binary edge mask" },
      { id: "C", text: "A 3D surface mesh" },
      { id: "D", text: "The patient's radiation dose distribution" }
    ],
    correct_option_id: "A",
    explanation: "The 2D Fourier transform projects spatial pixel arrays onto orthogonal 2D complex sinusoids."
  },
  {
    id: "g-19",
    moduleId: "mod-6",
    co_tag: "CO3",
    question_text: "If an imaging sensor has a detector pixel pitch of Δx = 0.25 mm, what is its Nyquist limiting spatial frequency?",
    options: [
      { id: "A", text: "f_Nyquist = 1 / (2 · Δx) = 1 / 0.5 = 2.0 lp/mm" },
      { id: "B", text: "4.0 lp/mm" },
      { id: "C", text: "1.0 lp/mm" },
      { id: "D", text: "0.25 lp/mm" }
    ],
    correct_option_id: "A",
    explanation: "f_Nyquist = 1 / (2 · Δx) = 1 / (2 × 0.25 mm) = 2.0 line pairs per mm."
  },
  {
    id: "g-20",
    moduleId: "mod-6",
    co_tag: "CO3",
    question_text: "In rigid body 3D coordinate transformations, what mathematical structure represents pure rotations without scaling or shear?",
    options: [
      { id: "A", text: "3x3 Orthogonal Matrix R where R^T · R = I and det(R) = +1 (SO(3))" },
      { id: "B", text: "Singular matrix with det(R) = 0" },
      { id: "C", text: "Diagonal matrix with random entries" },
      { id: "D", text: "Skew-symmetric matrix" }
    ],
    correct_option_id: "A",
    explanation: "Special Orthogonal group SO(3) matrices preserve vector lengths and angles during 3D rotations."
  },
  {
    id: "g-21",
    moduleId: "mod-5",
    co_tag: "CO3",
    question_text: "Why does high-frequency emphasis filtering enhance both localized microcalcifications and overall anatomical contrast in mammography?",
    options: [
      { id: "A", text: "It combines a high-pass filter with an offset to preserve low-frequency background structures: H_emphasis = a + b · H_HP" },
      { id: "B", text: "It sets all background pixels to white" },
      { id: "C", text: "It multiplies pixel coordinates by 2" },
      { id: "D", text: "It runs without a Fourier transform" }
    ],
    correct_option_id: "A",
    explanation: "H_emphasis retains background tone (a > 0) while amplifying fine high-frequency tissue edges (b > 0)."
  },
  {
    id: "g-22",
    moduleId: "mod-6",
    co_tag: "CO3",
    question_text: "What interpolation method evaluates a 2x2 neighborhood (4 pixels) using bilinear distance weights?",
    options: [
      { id: "A", text: "Bilinear interpolation" },
      { id: "B", text: "Nearest neighbor" },
      { id: "C", text: "Tricubic B-spline" },
      { id: "D", text: "Lanczos windowing" }
    ],
    correct_option_id: "A",
    explanation: "Bilinear interpolation performs linear interpolation in the x-direction followed by the y-direction across 4 neighbors."
  },
  {
    id: "g-23",
    moduleId: "mod-6",
    co_tag: "CO3",
    question_text: "What view display mode casts parallel viewing rays and extracts the maximum scalar attenuation value for display?",
    options: [
      { id: "A", text: "Maximum Intensity Projection (MIP)" },
      { id: "B", text: "Minimum Intensity Projection (MinIP)" },
      { id: "C", text: "Multiplanar reformatting (MPR)" },
      { id: "D", text: "Surface normal shading" }
    ],
    correct_option_id: "A",
    explanation: "MIP renders the peak attenuation value along each ray, highlighting vascular contrast."
  },
  {
    id: "g-24",
    moduleId: "mod-5",
    co_tag: "CO3",
    question_text: "In k-space MRI acquisition, what clinical artifact is produced if patient motion occurs during phase encoding?",
    options: [
      { id: "A", text: "Ghosting / replication artifacts along the phase-encoding axis" },
      { id: "B", text: "Ring artifacts" },
      { id: "C", text: "Spillover in frequency direction only" },
      { id: "D", text: "Color inversion" }
    ],
    correct_option_id: "A",
    explanation: "Phase encoding takes seconds across TR periods; periodic motion modulates k-space phase, generating ghost copies."
  },

  // CO4: Segmentation & 3D Volume Rendering (8 Questions)
  {
    id: "g-25",
    moduleId: "mod-5",
    co_tag: "CO4",
    question_text: "In Otsu's thresholding, what mathematical ratio determines the optimal threshold k*?",
    options: [
      { id: "A", text: "Maximizing the between-class variance σ_B²(k) = ω₀(μ₀ - μ_T)² + ω₁(μ₁ - μ_T)²" },
      { id: "B", text: "Minimizing total image pixels" },
      { id: "C", text: "Equalizing foreground and background area" },
      { id: "D", text: "Matching the 95th percentile" }
    ],
    correct_option_id: "A",
    explanation: "Otsu maximizes between-class variance, which is mathematically dual to minimizing within-class variance."
  },
  {
    id: "g-26",
    moduleId: "mod-5",
    co_tag: "CO4",
    question_text: "In clinical evaluation, if a segmented tumour volume has True Positives TP = 800, False Positives FP = 100, and False Negatives FN = 100, what is the Dice Similarity Coefficient?",
    options: [
      { id: "A", text: "Dice = 2·800 / (2·800 + 100 + 100) = 1600 / 1800 = 0.889 (88.9%)" },
      { id: "B", text: "Dice = 0.50" },
      { id: "C", text: "Dice = 0.75" },
      { id: "D", text: "Dice = 0.95" }
    ],
    correct_option_id: "A",
    explanation: "Dice = 2·TP / (2·TP + FP + FN) = 1600 / 1800 ≈ 0.889."
  },
  {
    id: "g-27",
    moduleId: "mod-6",
    co_tag: "CO4",
    question_text: "How does the Marching Cubes algorithm resolve ambiguity when a cube has alternating high and low corner vertices?",
    options: [
      { id: "A", text: "Evaluating asymptotic decider criteria or consulting complementary face lookup tables" },
      { id: "B", text: "Deleting the cube" },
      { id: "C", text: "Filling the entire cube with solid bone" },
      { id: "D", text: "Skipping to the next slice" }
    ],
    correct_option_id: "A",
    explanation: "Asymptotic deciders analyze saddle points on ambiguous quadrilateral faces to prevent non-manifold holes."
  },
  {
    id: "g-28",
    moduleId: "mod-6",
    co_tag: "CO4",
    question_text: "In direct volume rendering raycasting, what condition terminates ray traversal early to save GPU shader cycles?",
    options: [
      { id: "A", text: "Early Ray Termination: when accumulated opacity reaches α ≈ 1.0 (opaque surface encountered)" },
      { id: "B", text: "When ray hits black pixel" },
      { id: "C", text: "After exactly 10 samples" },
      { id: "D", text: "When patient moves" }
    ],
    correct_option_id: "A",
    explanation: "Once accumulated opacity α reaches ~0.99, subsequent voxels contribute zero visible light to the display."
  },
  {
    id: "g-29",
    moduleId: "mod-5",
    co_tag: "CO4",
    question_text: "In Level Set segmentation methods, how is the evolving boundary represented mathematically?",
    options: [
      { id: "A", text: "As the zero level set {x | Φ(x, t) = 0} of a higher-dimensional implicit signed distance function Φ" },
      { id: "B", text: "As a chain of discrete connected lines" },
      { id: "C", text: "As a list of pixel indices" },
      { id: "D", text: "As a Fourier polynomial" }
    ],
    correct_option_id: "A",
    explanation: "Level sets naturally handle complex topological splits and merges because the contour is implicitly embedded in Φ."
  },
  {
    id: "g-30",
    moduleId: "mod-6",
    co_tag: "CO4",
    question_text: "In 3D multi-modal fusion, why is rigid registration sufficient for brain MRI-CT fusion, but non-rigid registration required for abdominal liver fusion?",
    options: [
      { id: "A", text: "The cranium is a rigid skull protecting the brain; abdominal organs undergo respiration, peristalsis, and deformation" },
      { id: "B", text: "Brain images have higher contrast" },
      { id: "C", text: "CT cannot scan abdomen" },
      { id: "D", text: "Liver voxels are non-numeric" }
    ],
    correct_option_id: "A",
    explanation: "The rigid skull constrains intracranial structures (6 DoF), whereas soft organs deform with diaphragm movement."
  },
  {
    id: "g-31",
    moduleId: "mod-5",
    co_tag: "CO4",
    question_text: "What evaluation metric computes the average symmetric surface distance between segmented organ boundaries in millimeters?",
    options: [
      { id: "A", text: "Average Symmetric Surface Distance (ASSD)" },
      { id: "B", text: "Dice coefficient" },
      { id: "C", text: "Specificity" },
      { id: "D", text: "Pixel accuracy" }
    ],
    correct_option_id: "A",
    explanation: "ASSD measures boundary accuracy in physical millimeters, complementing overlap metrics like Dice."
  },
  {
    id: "g-32",
    moduleId: "mod-6",
    co_tag: "CO4",
    question_text: "How does shaded surface display (SSD) calculate surface normal vectors at triangular vertices for realistic specular highlights?",
    options: [
      { id: "A", text: "Normalizing the central-difference 3D gradient vector of the original CT scalar volume: N = -∇I / ||∇I||" },
      { id: "B", text: "Assigning a constant vertical vector [0, 0, 1]" },
      { id: "C", text: "Averaging pixel intensity" },
      { id: "D", text: "Randomizing vector angles" }
    ],
    correct_option_id: "A",
    explanation: "Volume gradient ∇I points in the direction of steepest intensity change, giving smooth normals across triangles."
  },

  // CO5: Clinical Diagnostic Applications & Workflow (8 Questions)
  {
    id: "g-33",
    moduleId: "mod-2",
    co_tag: "CO5",
    question_text: "In clinical CAD (Computer-Aided Detection) systems, what receiver operating characteristic (ROC) curve metric summarizes diagnostic discriminatory power?",
    options: [
      { id: "A", text: "Area Under the ROC Curve (AUC / c-statistic)" },
      { id: "B", text: "Maximum positive value" },
      { id: "C", text: "Focal loss parameter" },
      { id: "D", text: "Image aspect ratio" }
    ],
    correct_option_id: "A",
    explanation: "AUC ranges from 0.5 (random guessing) to 1.0 (perfect diagnostic discrimination)."
  },
  {
    id: "g-34",
    moduleId: "mod-1",
    co_tag: "CO5",
    question_text: "What clinical imaging examination is universally recommended as first-line for acute suspected ischemic stroke within the 4.5-hour thrombolysis window?",
    options: [
      { id: "A", text: "Non-contrast Head Computed Tomography (NCCT) to rule out intracranial hemorrhage" },
      { id: "B", text: "Barium swallow" },
      { id: "C", text: "Abdominal ultrasound" },
      { id: "D", text: "Dual-energy bone scan" }
    ],
    correct_option_id: "A",
    explanation: "Non-contrast head CT immediately excludes acute intracranial hemorrhage, which is an absolute contraindication to thrombolysis (tPA)."
  },
  {
    id: "g-35",
    moduleId: "mod-3",
    co_tag: "CO5",
    question_text: "Under HIPAA and India's DPDP Act 2023, what step is legally required before sharing clinical MRI datasets with external AI researchers?",
    options: [
      { id: "A", text: "Sanitizing direct identifiers (Name, MRN, Address, DOB) and de-facing 3D facial reconstructions" },
      { id: "B", text: "Converting images to JPEG quality 50%" },
      { id: "C", text: "Deleting all image slices except one" },
      { id: "D", text: "Printing the images on paper" }
    ],
    correct_option_id: "A",
    explanation: "De-identification requires purging protected health information (PHI) tags and defacing volumetric craniofacial features."
  },
  {
    id: "g-36",
    moduleId: "mod-4",
    co_tag: "CO5",
    question_text: "When assessing suspected spinal bone fractures on CT, which window setting should the radiologist immediately toggle?",
    options: [
      { id: "A", text: "Bone Window (WW ≈ 2000 HU, WL ≈ +400 HU)" },
      { id: "B", text: "Subdural Window (WW 150, WL 75)" },
      { id: "C", text: "Lung Window (WW 1500, WL -600)" },
      { id: "D", text: "Liver Window (WW 150, WL 30)" }
    ],
    correct_option_id: "A",
    explanation: "A wide bone window resolves cortical continuity and fine trabecular fractures without saturation."
  },
  {
    id: "g-37",
    moduleId: "mod-5",
    co_tag: "CO5",
    question_text: "In radiation therapy treatment planning, why is the Hausdorff distance (HD95) critical alongside the Dice score when evaluating automated organ-at-risk (OAR) segmentation?",
    options: [
      { id: "A", text: "A small contour outlier can place high radiation dose directly into a critical structure (e.g. optic nerve or spinal cord) without significantly degrading volumetric Dice" },
      { id: "B", text: "Dice does not work on 3D data" },
      { id: "C", text: "HD95 measures scanner voltage" },
      { id: "D", text: "Dice is only used for liver" }
    ],
    correct_option_id: "A",
    explanation: "Volumetric overlap can be 95% while a tiny contour spike penetrates the spinal canal, causing radiation myelopathy."
  },
  {
    id: "g-38",
    moduleId: "mod-2",
    co_tag: "CO5",
    question_text: "What standardized protocol enables automated clinical imaging AI triage models to receive scans directly from scanners and send annotated masks back to PACS?",
    options: [
      { id: "A", text: "DICOM C-STORE and DICOM Structured Reporting (SR) / DICOM-SEG objects" },
      { id: "B", text: "Uncompressed email attachments" },
      { id: "C", text: "Raw CSV tables" },
      { id: "D", text: "Flash memory cards" }
    ],
    correct_option_id: "A",
    explanation: "DICOM-SEG (Segmentation) and DICOM-SR encapsulate AI findings within standard PACS-compatible formats."
  },
  {
    id: "g-39",
    moduleId: "mod-1",
    co_tag: "CO5",
    question_text: "Which clinical condition strictly contraindicates performing high-field (1.5T or 3.0T) MRI examinations without prior safety clearance?",
    options: [
      { id: "A", text: "Non-MRI-conditional cardiac pacemakers or ferromagnetic intraocular metallic foreign bodies" },
      { id: "B", text: "History of seasonal asthma" },
      { id: "C", text: "Hypertension" },
      { id: "D", text: "Dental amalgam fillings" }
    ],
    correct_option_id: "A",
    explanation: "Ferromagnetic implants experience severe translational torque and RF heating in high-field MRI."
  },
  {
    id: "g-40",
    moduleId: "mod-6",
    co_tag: "CO5",
    question_text: "What clinical benefit does 3D virtual surgical planning and patient-specific implant templating provide over traditional 2D axial slice review?",
    options: [
      { id: "A", text: "Accurate volumetric measurement of resection margins, pre-bending of fixation plates, and reduced operative theater time" },
      { id: "B", text: "Guarantees zero blood loss" },
      { id: "C", text: "Eliminates need for sterile anesthesia" },
      { id: "D", text: "Replaces histological biopsy" }
    ],
    correct_option_id: "A",
    explanation: "3D surgical planning permits custom resection guides, pre-formed titanium implants, and simulated joint kinematics."
  }
];
