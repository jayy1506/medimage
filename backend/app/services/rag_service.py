
import os
import re
import json
import hashlib
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

MANDATORY_CLINICAL_REFUSAL = (
    "I am an educational AI tutor for B.Tech Medical Image Processing (AIDS 12605.1). "
    "I cannot interpret personal medical images, diagnose medical conditions, or provide clinical advice. "
    "Please consult a licensed healthcare professional for medical inquiries."
)

OFF_SYLLABUS_REFUSAL = (
    "I am strictly scoped to assist only with Medical Text and Image Processing (AIDS 12605.1) "
    "at Adani Institute of Higher Education and Research. Questions outside of medical imaging physics "
    "(X-ray/CT/MRI/Ultrasound/PET), DICOM standards, 2D spatial filtering, tomographic reconstruction, "
    "medical image segmentation, and clinical NLP are not permitted."
)

# Formal Syllabus Module Map for AIDS 12605.1
SYLLABUS_MODULE_MAP = [
    {
        "code": "M1",
        "module_num": 1,
        "module_title": "Medical Image Sources",
        "topics": [
            {"num": 1, "title": "Radiology Modalities & Physics", "keys": ["radiology", "modality", "modalities", "physics"]},
            {"num": 2, "title": "The Electromagnetic Spectrum in Medicine", "keys": ["electromagnetic", "spectrum", "wavelength", "frequency", "photon", "gamma"]},
            {"num": 3, "title": "Basic X-Ray Physics", "keys": ["x-ray", "xray", "bremsstrahlung", "compton", "photoelectric", "anode", "cathode", "kvp"]},
            {"num": 4, "title": "Attenuation & Exponential Imaging Laws", "keys": ["attenuation", "beer", "lambert", "beer-lambert", "hvl", "half-value", "linear attenuation"]},
            {"num": 5, "title": "Computed Tomography (CT & Sinograms)", "keys": ["ct", "computed tomography", "sinogram", "radon", "hounsfield", "hu", "backprojection", "fbp", "tomography", "fan-beam", "cone-beam"]},
            {"num": 6, "title": "Magnetic Resonance Tomography (MRI)", "keys": ["mri", "magnetic resonance", "nmr", "larmor", "t1", "t2", "spin", "echo", "rf pulse", "gradient", "k-space"]},
            {"num": 7, "title": "Diagnostic Ultrasound & Acoustic Impedance", "keys": ["ultrasound", "usg", "acoustic", "impedance", "transducer", "piezoelectric", "doppler", "sound wave"]},
            {"num": 8, "title": "Nuclear Medicine & Molecular Imaging (SPECT/PET)", "keys": ["pet", "spect", "nuclear medicine", "positron", "annihilation", "radiotracer", "fdg", "scintillation"]}
        ]
    },
    {
        "code": "M2",
        "module_num": 2,
        "module_title": "Image Processing in Clinical Practice",
        "topics": [
            {"num": 1, "title": "Image Databases & Clinical PACS Archiving", "keys": ["pacs", "database", "archive", "vna", "c-store", "c-find", "c-move"]},
            {"num": 2, "title": "Point & Intensity Operations", "keys": ["lut", "look-up table", "gamma", "contrast stretching", "threshold", "point operation"]},
            {"num": 3, "title": "Spatial Filter Operations & Convolution Kernels", "keys": ["spatial filter", "convolution", "kernel", "sobel", "prewitt", "laplacian", "gaussian", "high-boost"]},
            {"num": 4, "title": "Clinical Segmentation Strategies & U-Net", "keys": ["segmentation", "u-net", "unet", "encoder", "decoder", "skip connection", "deep learning"]},
            {"num": 5, "title": "Spatial Transforms & Clinical Registration", "keys": ["registration", "affine", "rigid", "mutual information", "image fusion"]}
        ]
    },
    {
        "code": "M3",
        "module_num": 3,
        "module_title": "Image Representation",
        "topics": [
            {"num": 1, "title": "Pixels, Voxels & Partial Volume Averaging", "keys": ["pixel", "voxel", "partial volume", "matrix", "spatial resolution", "field of view", "fov"]},
            {"num": 2, "title": "Gray Scale & Color Representation", "keys": ["grayscale", "gray scale", "pseudo-color", "rgb", "bit depth", "dynamic range"]},
            {"num": 3, "title": "Medical File Formats", "keys": ["file format", "dicom vs nifti", "nifti", "png", "nrrd", "analyze"]},
            {"num": 4, "title": "The DICOM Standard & Tag Dictionaries", "keys": ["dicom", "tag", "vr", "iod", "sop", "metadata", "header", "value representation"]},
            {"num": 5, "title": "Image Quality & Signal-to-Noise Ratio (SNR)", "keys": ["snr", "cnr", "noise", "contrast to noise", "mtf", "dqe", "modulation transfer"]}
        ]
    },
    {
        "code": "M4",
        "module_num": 4,
        "module_title": "Operations in Intensity Space",
        "topics": [
            {"num": 1, "title": "Intensity Transform Function & Dynamic Range", "keys": ["intensity transform", "clipping", "compression", "transfer function"]},
            {"num": 2, "title": "Clinical Windowing (Level, Width & Hounsfield Units)", "keys": ["windowing", "window width", "window level", "ww", "wl", "bone window", "lung window", "soft tissue window"]},
            {"num": 3, "title": "Histograms & Histogram Equalization", "keys": ["histogram", "equalization", "cdf", "cumulative distribution", "clahe", "contrast enhancement"]},
            {"num": 4, "title": "Dithering, False Contouring & Bit Depth", "keys": ["dithering", "false contouring", "quantization", "banding"]}
        ]
    },
    {
        "code": "M5",
        "module_num": 5,
        "module_title": "Filtering, Transformations and Segmentation",
        "topics": [
            {"num": 1, "title": "The Spatial Filtering Operation & Kernels", "keys": ["box filter", "gaussian filter", "median filter", "edge detection", "smoothing"]},
            {"num": 2, "title": "The 2D Fourier Transform & Convolution Theorem", "keys": ["fourier", "fft", "frequency domain", "k-space", "convolution theorem", "low-pass", "high-pass"]},
            {"num": 3, "title": "The Clinical Segmentation Pipeline", "keys": ["segmentation pipeline", "preprocessing", "postprocessing", "binary mask"]},
            {"num": 4, "title": "ROI Definition, Moments & Centroids", "keys": ["roi", "region of interest", "moments", "centroid", "area", "volume"]},
            {"num": 5, "title": "Global, Adaptive & Otsu's Thresholding", "keys": ["otsu", "thresholding", "adaptive threshold", "between-class variance", "bimodal"]},
            {"num": 6, "title": "Region Growing & Boundary Leakage Control", "keys": ["region growing", "seed point", "leakage", "connectivity"]},
            {"num": 7, "title": "Evaluation Metrics: Dice, IoU & Hausdorff", "keys": ["dice", "iou", "jaccard", "hausdorff", "sensitivity", "specificity", "overlap"]}
        ]
    },
    {
        "code": "M6",
        "module_num": 6,
        "module_title": "Spatial Transforms",
        "topics": [
            {"num": 1, "title": "Discretization, Nyquist Limit & Sampling Artifacts", "keys": ["nyquist", "sampling", "aliasing", "discretization", "moiré"]},
            {"num": 2, "title": "Interpolation & Volume Regularization", "keys": ["interpolation", "bilinear", "bicubic", "nearest neighbor", "regularization", "resampling"]},
            {"num": 3, "title": "Rigid Body Transforms", "keys": ["rigid body", "rotation", "translation", "transformation matrix", "affine matrix"]},
            {"num": 4, "title": "Multiplanar Reformatting (MPR, CPR, MIP, MinIP)", "keys": ["mpr", "multiplanar", "mip", "maximum intensity projection", "minip", "axial", "coronal", "sagittal"]},
            {"num": 5, "title": "Orthogonal vs Perspective Projections", "keys": ["orthogonal projection", "perspective projection", "camera model"]},
            {"num": 6, "title": "Raycasting & Direct Volume Rendering", "keys": ["raycasting", "volume rendering", "opacity", "rendering pipeline", "compositing"]},
            {"num": 7, "title": "Surface-Based Rendering & Marching Cubes Algorithm", "keys": ["marching cubes", "isosurface", "surface rendering", "triangulation", "polygonal mesh"]}
        ]
    }
]

# Greetings detection pattern
GREETING_REGEX = re.compile(
    r"^(h[iey]+|heyy+|hello+|howdy|what'?s\s+up|whats\s+up|sup|good\s+(morning|afternoon|evening|day)|hola|namaste)(\s+.*)?$",
    re.IGNORECASE
)

IDENTITY_REGEX = re.compile(
    r"^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|how\s+are\s+you)\b",
    re.IGNORECASE
)


class RAGService:
    def __init__(self):
        self.gemini_keys = settings.gemini_keys_list
        self.current_key_idx = 0
        self.groq_key = settings.GROQ_API_KEY
        self.redis_url = settings.UPSTASH_REDIS_REST_URL
        self.redis_token = settings.UPSTASH_REDIS_REST_TOKEN

    def _get_next_gemini_key(self) -> Optional[str]:
        if not self.gemini_keys:
            return None
        key = self.gemini_keys[self.current_key_idx % len(self.gemini_keys)]
        self.current_key_idx = (self.current_key_idx + 1) % len(self.gemini_keys)
        return key

    def _hash_query(self, topic_id: str, prompt: str) -> str:
        clean = f"{topic_id}:{prompt.strip().lower()}"
        return hashlib.sha256(clean.encode()).hexdigest()

    def check_greeting(self, prompt: str) -> Optional[str]:
        p = prompt.strip()
        if GREETING_REGEX.match(p):
            return (
                "Hey! What's up? I'm Lexi, your academic AI Clinical Tutor for "
                "**Medical Text & Image Processing (AIDS 12605.1)** at Adani University.\n\n"
                "I'm here to help you understand imaging physics, modalities like CT and MRI, "
                "DICOM standards, image processing algorithms, or clinical segmentation pipelines. "
                "What topic or concept would you like to explore today?"
            )
        if IDENTITY_REGEX.match(p):
            return (
                "I am **Lexi**, your dedicated AI Clinical Tutor for B.Tech Medical Text and Image Processing (AIDS 12605.1) "
                "at the Faculty of Engineering & Technology, Adani University.\n\n"
                "You can ask me to explain:\n"
                "- **Imaging Modalities**: CT, MRI, X-ray, Ultrasound, PET/SPECT physics and full forms\n"
                "- **Standards**: DICOM Part 10 tags, PACS, IODs, and Hounsfield Units (HU)\n"
                "- **Image Processing**: 2D Convolution, Fourier transforms, Radon transform & FBP\n"
                "- **Segmentation & 3D**: Otsu thresholding, U-Net architecture, Dice metrics, MPR & Marching Cubes."
            )
        return None

    def match_syllabus_reference(self, prompt: str) -> Dict[str, Any]:
        """Matches a student prompt to the exact course module and topic."""
        lower = prompt.lower()

        # Specific abbreviation / high priority overrides
        if re.search(r"\bct\b|computed\s+tomography|sinogram|radon|hounsfield", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 5, "topic_title": "Computed Tomography (CT & Sinograms)"}
        if re.search(r"\bmri\b|magnetic\s+resonance|larmor|t1|t2|rf\s+pulse", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 6, "topic_title": "Magnetic Resonance Tomography (MRI)"}
        if re.search(r"\bultrasound\b|\busg\b|acoustic|piezoelectric", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 7, "topic_title": "Diagnostic Ultrasound & Acoustic Impedance"}
        if re.search(r"\bpet\b|\bspect\b|positron|nuclear\s+medicine|radiotracer", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 8, "topic_title": "Nuclear Medicine & Molecular Imaging (SPECT/PET)"}
        if re.search(r"\bx-?ray\b|bremsstrahlung|compton|photoelectric", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 3, "topic_title": "Basic X-Ray Physics"}
        if re.search(r"\battenuation\b|beer|hvl|half-value", lower):
            return {"code": "M1", "module_num": 1, "topic_num": 4, "topic_title": "Attenuation & Exponential Imaging Laws"}
        if re.search(r"\bdicom\b|tag\s+0028|sop|vr\b|header", lower):
            return {"code": "M3", "module_num": 3, "topic_num": 4, "topic_title": "The DICOM Standard & Tag Dictionaries"}
        if re.search(r"\bpacs\b|vna|c-store", lower):
            return {"code": "M2", "module_num": 2, "topic_num": 1, "topic_title": "Image Databases & Clinical PACS Archiving"}
        if re.search(r"\bwindow\b|\bhu\b|hounsfield|ww\b|wl\b", lower):
            return {"code": "M4", "module_num": 4, "topic_num": 2, "topic_title": "Clinical Windowing (Level, Width & Hounsfield Units)"}
        if re.search(r"\bfourier\b|\bfft\b|k-space|frequency\s+domain", lower):
            return {"code": "M5", "module_num": 5, "topic_num": 2, "topic_title": "The 2D Fourier Transform & Convolution Theorem"}
        if re.search(r"\bsobel\b|convolution|kernel|prewitt|laplacian", lower):
            return {"code": "M2", "module_num": 2, "topic_num": 3, "topic_title": "Spatial Filter Operations & Convolution Kernels"}
        if re.search(r"\botsu\b|threshold", lower):
            return {"code": "M5", "module_num": 5, "topic_num": 5, "topic_title": "Global, Adaptive & Otsu's Thresholding"}
        if re.search(r"\bu-?net\b|encoder|decoder|skip\s+connection", lower):
            return {"code": "M2", "module_num": 2, "topic_num": 4, "topic_title": "Clinical Segmentation Strategies & U-Net"}
        if re.search(r"\bdice\b|\biou\b|jaccard|hausdorff", lower):
            return {"code": "M5", "module_num": 5, "topic_num": 7, "topic_title": "Evaluation Metrics: Dice, IoU & Hausdorff"}
        if re.search(r"\bmpr\b|\bmip\b|multiplanar", lower):
            return {"code": "M6", "module_num": 6, "topic_num": 4, "topic_title": "Multiplanar Reformatting (MPR, CPR, MIP, MinIP)"}
        if re.search(r"marching\s+cubes|isosurface", lower):
            return {"code": "M6", "module_num": 6, "topic_num": 7, "topic_title": "Surface-Based Rendering & Marching Cubes Algorithm"}

        # General scoring pass
        best_match = {"code": "M1", "module_num": 1, "topic_num": 1, "topic_title": "Radiology Modalities & Physics"}
        best_score = 0
        for mod in SYLLABUS_MODULE_MAP:
            for top in mod["topics"]:
                score = sum(1 for k in top["keys"] if k in lower)
                if score > best_score:
                    best_score = score
                    best_match = {
                        "code": mod["code"],
                        "module_num": mod["module_num"],
                        "topic_num": top["num"],
                        "topic_title": top["title"]
                    }
        return best_match

    def check_guardrails(self, prompt: str) -> Optional[str]:
        lower = prompt.lower()
        diagnostic_keywords = [
            "do i have", "my ct scan shows", "my mri shows", "my x-ray shows",
            "diagnose me", "am i sick", "tumor in my", "cancer in my",
            "is this nodule cancerous", "prescribe", "treatment for my"
        ]
        if any(kw in lower for kw in diagnostic_keywords):
            return MANDATORY_CLINICAL_REFUSAL

        unrelated_keywords = [
            "cryptocurrency", "bitcoin", "ipl", "bollywood", "cricket match",
            "weather in", "capital of", "recipe", "song", "actor", "actress",
            "president of", "stock price", "election"
        ]
        if any(kw in lower for kw in unrelated_keywords):
            return OFF_SYLLABUS_REFUSAL
        return None

    async def get_cached_response(self, topic_id: str, prompt: str) -> Optional[Dict[str, Any]]:
        if not self.redis_url or not self.redis_token:
            return None
        key = f"tutor_cache:{self._hash_query(topic_id, prompt)}"
        try:
            async with httpx.AsyncClient(timeout=2.5) as client:
                res = await client.get(
                    f"{self.redis_url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"}
                )
                if res.status_code == 200:
                    val = res.json().get("result")
                    if val:
                        return json.loads(val)
        except Exception:
            pass
        return None

    async def set_cached_response(self, topic_id: str, prompt: str, data: Dict[str, Any]) -> None:
        if not self.redis_url or not self.redis_token:
            return
        key = f"tutor_cache:{self._hash_query(topic_id, prompt)}"
        try:
            async with httpx.AsyncClient(timeout=2.5) as client:
                await client.post(
                    f"{self.redis_url}/set/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"},
                    json={"value": json.dumps(data), "ex": 604800}
                )
        except Exception:
            pass

    async def generate_response(
        self,
        topic_title: str,
        topic_id: str,
        section_contexts: List[str],
        prompt: str,
        active_diagram_node: Optional[str] = None
    ) -> Dict[str, Any]:
        # 1. Greeting check
        greeting_text = self.check_greeting(prompt)
        if greeting_text:
            return {
                "response": greeting_text,
                "citations": [],
                "highlight_diagram_node": None
            }
        is_greeting = bool(GREETING_REGEX.match(prompt.strip().lower()) or IDENTITY_REGEX.match(prompt.strip().lower()))

        # 2. Guardrails check
        refusal = self.check_guardrails(prompt)
        if refusal:
            return {
                "response": refusal,
                "citations": [],
                "highlight_diagram_node": None
            }

        # 3. Match syllabus reference
        match = self.match_syllabus_reference(prompt)
        clean_ref = f"{match['code']} (Module {match['module_num']}), Topic {match['topic_num']}: {match['topic_title']}"

        # 4. Cache check
        cached = await self.get_cached_response(topic_id, prompt)
        if cached:
            return cached

        # 5. Build prompt
        if is_greeting:
            system_instruction = (
                "You are Lexi, the official academic AI Clinical Tutor for 'Medical Text and Image Processing (AIDS 12605.1)' "
                "at the Faculty of Engineering and Technology, Adani Institute of Higher Education and Research.\n\n"
                "The student greeted you. Reply warmly, conversationally, and engagingly as Lexi (e.g. 'Hey! What's up? I'm Lexi, "
                "your academic AI Clinical Tutor for Medical Text & Image Processing at Adani University...'). "
                "Ask what medical imaging modality or topic (such as CT, MRI, Ultrasound, DICOM, or segmentation) they want to explore today. "
                "Keep it natural and friendly. Do NOT include any course citation line or reference badges for greetings."
            )
        else:
            system_instruction = (
                "You are Lexi, the official academic AI Clinical Tutor for 'Medical Text and Image Processing (AIDS 12605.1)' "
                "at the Faculty of Engineering and Technology, Adani Institute of Higher Education and Research.\n\n"
                "INSTRUCTIONS:\n"
                "1. Answer like an expert, engaging AI tutor. Be comprehensive, precise, and educational.\n"
                "2. If asked about an acronym or modality (e.g. CT, MRI, PET, SPECT, X-ray, Ultrasound, DICOM, PACS, HU, FBP):\n"
                "   - State the **FULL FORM** in bold right at the beginning (e.g. **CT** stands for **Computed Tomography**).\n"
                "   - Provide a clear diagnostic definition.\n"
                "   - Explain operational principles, clinical physics, and mathematical equations with KaTeX ($...$).\n"
                "3. At the very end of your response, output a single clean reference line in this exact format:\n"
                f"📚 Course Reference: {clean_ref}\n"
                "Never output confusing citations like '[Citation: ... Section 1]'."
            )

        user_content = f"QUESTION: {prompt}"
        response_text = ""
        node_highlight = active_diagram_node

        # 6. Attempt Gemini API with candidate models using provided API keys
        gemini_models = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro"
        ]
        if self.gemini_keys:
            for _ in range(min(len(self.gemini_keys), 4)):
                candidate_key = self._get_next_gemini_key()
                if not candidate_key:
                    break
                for model in gemini_models:
                    try:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={candidate_key}"
                        payload = {
                            "contents": [{"parts": [{"text": f"{system_instruction}\n\n{user_content}"}]}],
                            "generationConfig": {"temperature": 0.3 if not is_greeting else 0.7, "maxOutputTokens": 900}
                        }
                        async with httpx.AsyncClient(timeout=12.0) as client:
                            res = await client.post(url, json=payload)
                            if res.status_code == 200:
                                data = res.json()
                                candidates = data.get("candidates", [])
                                if candidates:
                                    response_text = candidates[0]["content"]["parts"][0]["text"]
                                    break
                    except Exception:
                        pass
                if response_text:
                    break

        # 7. Fallback to Groq Cloud (Llama 3.3 70B)
        if not response_text and self.groq_key:
            try:
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {self.groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_content}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 700
                }
                async with httpx.AsyncClient(timeout=8.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        response_text = data["choices"][0]["message"]["content"]
            except Exception:
                pass

        # 8. Built-in Academic Knowledge Engine (Deterministic Fallback)
        if not response_text:
            p_lower = prompt.lower()
            if re.search(r"\bct\b|computed\s+tomography", p_lower):
                response_text = (
                    "### Computed Tomography (CT)\n\n"
                    "**CT** stands for **Computed Tomography** (historically also called Computed Axial Tomography or CAT scanning).\n\n"
                    "#### 1. Clinical Definition\n"
                    "Computed Tomography is a non-invasive diagnostic medical imaging modality that uses rotating narrow fan-beam X-rays and digital detectors "
                    "to generate cross-sectional 2D slices (tomograms) and 3D volumetric representations of internal human anatomy.\n\n"
                    "#### 2. Physical Principle & Acquisition\n"
                    "CT measures the differential linear attenuation coefficient ($\\mu$) of tissues. An X-ray tube and opposing detector array rotate 360° around the patient. "
                    "As photons penetrate tissue, they attenuate exponentially per the **Beer-Lambert Law**:\n"
                    "$$I(x) = I_0 \\, e^{-\\mu x}$$\n"
                    "Collecting line attenuation integrals across all projection angles $\\theta$ creates a 2D data matrix called a **sinogram** (governed by the **Radon Transform**).\n\n"
                    "#### 3. Image Reconstruction\n"
                    "The sinogram is reconstructed into a spatial image using **Filtered Backprojection (FBP)**. Backprojecting raw projections creates $1/r$ blurring; "
                    "applying a high-pass ramp filter (e.g., Ram-Lak filter) in the frequency domain beforehand yields sharp clinical contours.\n\n"
                    "#### 4. Hounsfield Units (HU)\n"
                    "Reconstructed CT numbers are normalized to the linear attenuation of pure water at standard temperature and pressure:\n"
                    "$$\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$\n"
                    "- **Air**: $-1000$ HU\n"
                    "- **Lungs**: $-500$ HU\n"
                    "- **Water**: $0$ HU\n"
                    "- **Soft Tissue (Brain / Muscle)**: $+40$ HU\n"
                    "- **Dense Cortical Bone**: $+1000$ to $+3000$ HU\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )
                node_highlight = "Sinogram"

            elif re.search(r"\bmri\b|magnetic\s+resonance", p_lower):
                response_text = (
                    "### Magnetic Resonance Imaging (MRI)\n\n"
                    "**MRI** stands for **Magnetic Resonance Imaging** (formerly Nuclear Magnetic Resonance or NMR).\n\n"
                    "#### 1. Clinical Definition\n"
                    "MRI is a non-invasive tomographic modality that uses strong static magnetic fields, radiofrequency (RF) pulses, and magnetic field gradients "
                    "to map hydrogen proton spin density and tissue relaxation times without ionizing radiation.\n\n"
                    "#### 2. Fundamental Physics & Larmor Frequency\n"
                    "Hydrogen nuclei ($^1\\text{H}$) possess an intrinsic magnetic dipole moment. Placed in a main magnetic field $B_0$, spins precess at the **Larmor frequency**:\n"
                    "$$\\omega_0 = \\gamma B_0$$\n"
                    "where $\\gamma$ is the gyromagnetic ratio ($42.58\\text{ MHz/T}$ for $^1\\text{H}$). At $1.5\\text{T}$, $\\omega_0 \\approx 63.87\\text{ MHz}$.\n\n"
                    "#### 3. Relaxation Mechanisms\n"
                    "- **T1 Relaxation (Spin-Lattice)**: The longitudinal magnetization recovers exponentially: $M_z(t) = M_0 (1 - e^{-t/T1})$.\n"
                    "- **T2 Relaxation (Spin-Spin)**: The transverse magnetization decays due to phase dephasing: $M_{xy}(t) = M_0 \\, e^{-t/T2}$.\n\n"
                    "#### 4. k-Space Trajectory & 2D FFT\n"
                    "Spatial encoding via slice selection ($G_z$), phase encoding ($G_y$), and frequency encoding ($G_x$) fills **k-space** (spatial frequency domain). "
                    "Applying the 2D Inverse Fast Fourier Transform (2D-IFFT) converts raw k-space samples into the clinical image.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )
                node_highlight = "KSpace"

            elif re.search(r"\bultrasound\b|\busg\b|acoustic", p_lower):
                response_text = (
                    "### Diagnostic Ultrasound (USG)\n\n"
                    "**USG** stands for **Ultrasonography** (commonly referred to as Diagnostic Ultrasound).\n\n"
                    "#### 1. Clinical Definition\n"
                    "An interactive, real-time diagnostic imaging modality that transmits high-frequency acoustic pressure waves ($2\\text{ to }18\\text{ MHz}$) "
                    "into human tissue and records reflected acoustic echoes to image organs, vasculature, and musculoskeletal boundaries.\n\n"
                    "#### 2. Acoustic Impedance & Echo Generation\n"
                    "Acoustic impedance ($Z$) measures tissue resistance to sound waves:\n"
                    "$$Z = \\rho \\cdot c$$\n"
                    "where $\\rho$ is tissue density and $c$ is speed of sound ($c \\approx 1540\\text{ m/s}$ in soft tissue). At tissue interfaces with impedance mismatch ($Z_1 \\ne Z_2$), "
                    "the intensity reflection coefficient is:\n"
                    "$$R = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2$$\n\n"
                    "#### 3. Doppler Effect & Hemodynamics\n"
                    "Moving red blood cells shift reflected acoustic frequencies per the Doppler equation: $\\Delta f = \\frac{2 f_0 v \\cos \\theta}{c}$, allowing real-time blood flow measurement.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif re.search(r"\bpet\b|\bspect\b|positron|nuclear", p_lower):
                response_text = (
                    "### Positron Emission Tomography (PET)\n\n"
                    "**PET** stands for **Positron Emission Tomography**, and **SPECT** stands for **Single-Photon Emission Computed Tomography**.\n\n"
                    "#### 1. Clinical Definition\n"
                    "Nuclear medicine functional imaging modalities that map metabolic, physiological, and receptor-binding pathways in vivo by administering radiopharmaceuticals.\n\n"
                    "#### 2. Positron Annihilation Physics\n"
                    "A positron-emitting radionuclide (e.g., $^{18}\\text{F}$-FDG) emits a positron ($\\beta^+$). After traveling a short path, it annihilates with a tissue electron ($e^-$), "
                    "emitting two coincident $511\\text{ keV}$ gamma photons in diametrically opposite directions ($180^\\circ$ apart):\n"
                    "$$e^+ + e^- \\longrightarrow 2 \\gamma \\, (511\\text{ keV})$$\n"
                    "Coincidence detection circuits register these events along a Line of Response (LOR) to reconstruct 3D metabolic activity.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif re.search(r"\bdicom\b|tag", p_lower):
                response_text = (
                    "### Digital Imaging and Communications in Medicine (DICOM)\n\n"
                    "**DICOM** stands for **Digital Imaging and Communications in Medicine**.\n\n"
                    "#### 1. Standard Purpose\n"
                    "DICOM (NEMA PS3 / ISO 12052) is the universal international standard for transmitting, storing, retrieving, and displaying medical imaging information.\n\n"
                    "#### 2. Architecture & Part 10 File Format\n"
                    "A DICOM file encapsulates a 128-byte preamble, a 4-byte `DICM` magic prefix, and an ordered sequence of Data Elements. Each element is defined by:\n"
                    "- **Tag**: Hexadecimal `(Group, Element)` pair, e.g., `(0010,0010)` for Patient Name, `(0028,1050)` for Window Center (WL), `(0028,1051)` for Window Width (WW).\n"
                    "- **VR (Value Representation)**: Data type (e.g., `PN` for Person Name, `DS` for Decimal String, `OB/OW` for Pixel Data).\n"
                    "- **Value Length & Value Field**: Raw payload bytes.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )
                node_highlight = "Tag0028"

            elif re.search(r"\battenuation\b|beer|hvl|half-value", p_lower):
                response_text = (
                    "### Attenuation & Exponential Imaging Laws\n\n"
                    "#### 1. Linear Attenuation Coefficient ($\\mu$)\n"
                    "As an X-ray beam traverses matter, photon intensity decreases exponentially according to the **Beer-Lambert Law**:\n"
                    "$$I(x) = I_0 \\, e^{-\\mu x}$$\n"
                    "where $I_0$ is the incident beam intensity, $x$ is absorber thickness, and $\\mu$ is the linear attenuation coefficient.\n\n"
                    "#### 2. Half-Value Layer (HVL)\n"
                    "The **Half-Value Layer (HVL)** is the absorber thickness required to reduce the X-ray beam intensity to exactly 50% ($I = I_0 / 2$):\n"
                    "$$\\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}$$\n"
                    "Tissues with higher atomic numbers ($Z$) and physical densities (such as cortical bone, $Z \\approx 13.8$) exhibit higher attenuation $\\mu$ and correspondingly smaller HVL values.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )
                node_highlight = "Tissue"

            elif re.search(r"\bwindow\b|\bhu\b|windowing", p_lower):
                response_text = (
                    "### Clinical Windowing & Hounsfield Units\n\n"
                    "#### 1. Windowing Concept\n"
                    "CT scanners produce pixel values spanning $-1000\\text{ to }+3000\\text{ HU}$ (12-bit depth), but computer monitors render only 256 gray levels (8-bit, 0–255). "
                    "**Windowing** performs a linear contrast stretch mapping a chosen sub-range to screen brightness.\n\n"
                    "#### 2. Mathematical Mapping\n"
                    "Given **Window Width** ($WW$) and **Window Level** ($WL$ / Window Center):\n"
                    "- $\\text{Lower Bound} = WL - \\frac{WW}{2}$\n"
                    "- $\\text{Upper Bound} = WL + \\frac{WW}{2}$\n"
                    "Pixels below the lower bound display as pure black ($0$); pixels above display as pure white ($255$).\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif re.search(r"\bfourier\b|\bfft\b|k-space", p_lower):
                response_text = (
                    "### 2D Fourier Transform in Medical Imaging\n\n"
                    "#### 1. Formulation\n"
                    "The 2D Discrete Fourier Transform (DFT) maps spatial pixel intensities $f(x, y)$ into 2D spatial frequencies $F(u, v)$:\n"
                    "$$F(u, v) = \\sum_{x=0}^{M-1} \\sum_{y=0}^{N-1} f(x, y) \\, e^{-j 2\\pi \\left( \\frac{ux}{M} + \\frac{vy}{N} \\right)}$$\n\n"
                    "#### 2. Convolution Theorem\n"
                    "Spatial convolution is mathematically equivalent to element-wise multiplication in the frequency domain:\n"
                    "$$f(x, y) * h(x, y) \\iff F(u, v) \\cdot H(u, v)$$\n"
                    "This principle is the cornerstone of Fast Fourier Transform (FFT) acceleration in CT tomographic reconstruction and MRI k-space image synthesis.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif re.search(r"\bsobel\b|convolution|kernel|laplacian", p_lower):
                response_text = (
                    "### 2D Spatial Convolution & Filtering Kernels\n\n"
                    "#### 1. Convolution Operation\n"
                    "Given image $I$ and kernel $K$ of size $(2k+1) \\times (2k+1)$:\n"
                    "$$(I * K)(x, y) = \\sum_{i=-k}^k \\sum_{j=-k}^k I(x-i, y-j) \\, K(i, j)$$\n\n"
                    "#### 2. Sobel Edge Detection\n"
                    "Computes discrete gradients in horizontal and vertical directions:\n"
                    "$$G_x = \\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix}, \\quad G_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 2 & 1 \\end{bmatrix}$$\n"
                    "Gradient magnitude is $|G| = \\sqrt{G_x^2 + G_y^2}$.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif re.search(r"\botsu\b|segmentation|\bu-?net\b", p_lower):
                response_text = (
                    "### Medical Image Segmentation & Otsu's Thresholding\n\n"
                    "#### 1. Segmentation Definition\n"
                    "Partitioning a medical image into contiguous anatomical regions (e.g., organ parenchyma, lesions, or bone boundaries).\n\n"
                    "#### 2. Otsu's Algorithm\n"
                    "Finds the optimal threshold $t^*$ that maximizes between-class variance $\\sigma_B^2(t)$:\n"
                    "$$\\sigma_B^2(t) = \\omega_0(t) \\, \\omega_1(t) \\left[ \\mu_0(t) - \\mu_1(t) \\right]^2$$\n\n"
                    "#### 3. Overlap Metric: Dice Similarity Coefficient (DSC)\n"
                    "$$\\text{Dice}(A, B) = \\frac{2 |A \\cap B|}{|A| + |B|} = \\frac{2 \\,\\text{TP}}{2\\,\\text{TP} + \\text{FP} + \\text{FN}}$$\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

            elif is_greeting:
                response_text = (
                    "Hey! What's up? I'm Lexi, your academic AI Clinical Tutor for "
                    "**Medical Text & Image Processing (AIDS 12605.1)** at Adani University.\n\n"
                    "I'm here to help you understand imaging physics, modalities like CT and MRI, "
                    "DICOM standards, image processing algorithms, or clinical segmentation pipelines. "
                    "What topic or concept would you like to explore today?"
                )
            else:
                response_text = (
                    f"In this area of **{match['topic_title']}**, clinical diagnostic performance depends on understanding "
                    "the physical radiation interaction, discrete sampling limits (Nyquist theorem), and contrast resolution.\n\n"
                    "Key concepts to master include spatial discretization, mathematical transfer functions, and quantitative error metrics.\n\n"
                    f"📚 Course Reference: {clean_ref}"
                )

        result_payload = {
            "response": response_text,
            "citations": [] if is_greeting else [
                {
                    "topic_title": f"{match['code']} (Module {match['module_num']}), Topic {match['topic_num']}: {match['topic_title']}",
                    "section_number": match["topic_num"],
                    "reference_code": "AIDS-12605.1"
                }
            ],
            "highlight_diagram_node": None if is_greeting else node_highlight
        }

        # Cache in Redis
        await self.set_cached_response(topic_id, prompt, result_payload)
        return result_payload


rag_service = RAGService()
