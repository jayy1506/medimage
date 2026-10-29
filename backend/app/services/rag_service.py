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

# Core domain keyword anchors for AIDS 12605.1 syllabus
VALID_DOMAIN_KEYWORDS = [
    "x-ray", "xray", "ct", "mri", "ultrasound", "pet", "spect", "dicom",
    "attenuation", "hounsfield", "hu", "radon", "sinogram", "backprojection",
    "fbp", "beer-lambert", "beer lambert", "half-value layer", "hvl",
    "photoelectric", "compton", "bremsstrahlung", "convolution", "kernel",
    "sobel", "prewitt", "laplacian", "gaussian", "frequency", "fourier", "fft",
    "filter", "histogram", "equalization", "segmentation", "otsu", "contour",
    "u-net", "unet", "morphology", "erosion", "dilation", "window", "level",
    "ww", "wl", "pixel", "voxel", "slice", "spatial", "image", "medical",
    "clinical", "nlp", "bert", "biobert", "clinicalbert", "ner", "radiology",
    "report", "modality", "matrix", "contrast", "resolution", "noise", "snr",
    "artifact", "beam hardening", "partial volume", "ring artifact", "projection"
]


class RAGService:
    def __init__(self):
        self.gemini_keys = settings.gemini_keys_list
        self.current_key_idx = 0
        self.groq_key = settings.GROQ_API_KEY
        self.redis_url = settings.UPSTASH_REDIS_REST_URL
        self.redis_token = settings.UPSTASH_REDIS_REST_TOKEN

    def _get_next_gemini_key(self) -> Optional[str]:
        """Rotates through the pool of API keys to distribute quota and handle rate limits."""
        if not self.gemini_keys:
            return None
        key = self.gemini_keys[self.current_key_idx % len(self.gemini_keys)]
        self.current_key_idx = (self.current_key_idx + 1) % len(self.gemini_keys)
        return key

    def _hash_query(self, topic_id: str, prompt: str) -> str:
        clean = f"{topic_id}:{prompt.strip().lower()}"
        return hashlib.sha256(clean.encode()).hexdigest()

    async def get_cached_response(self, topic_id: str, prompt: str) -> Optional[Dict[str, Any]]:
        """Queries Upstash Redis cache for semantic answer matches to save LLM tokens."""
        if not self.redis_url or not self.redis_token:
            return None

        key = f"tutor_cache:{self._hash_query(topic_id, prompt)}"
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(
                    f"{self.redis_url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"}
                )
                if res.status_code == 200:
                    val = res.json().get("result")
                    if val:
                        return json.loads(val)
        except Exception as e:
            print(f"[CACHE] Redis read skip: {e}")
        return None

    async def set_cached_response(self, topic_id: str, prompt: str, data: Dict[str, Any]) -> None:
        """Stores verified answer in Upstash Redis cache with 7-day TTL."""
        if not self.redis_url or not self.redis_token:
            return

        key = f"tutor_cache:{self._hash_query(topic_id, prompt)}"
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                await client.post(
                    f"{self.redis_url}/set/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"},
                    json={"value": json.dumps(data), "ex": 604800}  # 7 days TTL
                )
        except Exception as e:
            print(f"[CACHE] Redis write skip: {e}")

    def check_guardrails(self, prompt: str) -> Optional[str]:
        """
        Enforces:
        1. Clinical safety (refusal of personal medical diagnosis).
        2. Strict syllabus boundary (limited strictly to course and project data).
        """
        lower = prompt.lower()

        # Clinical Diagnosis / Personal Scan check
        diagnostic_keywords = [
            "do i have", "my ct scan shows", "my mri shows", "my x-ray shows",
            "diagnose me", "am i sick", "tumor in my", "cancer in my",
            "is this nodule cancerous", "prescribe", "treatment for my"
        ]
        if any(kw in lower for kw in diagnostic_keywords):
            return MANDATORY_CLINICAL_REFUSAL

        # Explicit off-syllabus topics check (politics, movies, unrelated coding, sports)
        unrelated_keywords = [
            "cryptocurrency", "bitcoin", "ipl", "bollywood", "cricket match",
            "weather in", "capital of", "recipe", "song", "actor", "actress",
            "president of", "stock price", "election"
        ]
        if any(kw in lower for kw in unrelated_keywords):
            return OFF_SYLLABUS_REFUSAL

        # Domain relevance check: must match at least one relevant course keyword
        is_relevant = any(kw in lower for kw in VALID_DOMAIN_KEYWORDS)
        if not is_relevant and len(lower.split()) > 3:
            return OFF_SYLLABUS_REFUSAL

        return None

    async def generate_response(
        self,
        topic_title: str,
        topic_id: str,
        section_contexts: List[str],
        prompt: str,
        active_diagram_node: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates grounded response using key-rotated Gemini / Groq with Upstash Redis cache
        and clinical guardrails.
        """
        # 1. Guardrail check (clinical safety & strictly within syllabus)
        refusal = self.check_guardrails(prompt)
        if refusal:
            return {
                "response": refusal,
                "citations": [],
                "highlight_diagram_node": None
            }

        # 2. Redis Cache check (saves tokens on already-asked questions)
        cached = await self.get_cached_response(topic_id, prompt)
        if cached:
            return cached

        # 3. Assemble Grounded Prompt
        context_block = "\n---\n".join(section_contexts) if section_contexts else "Standard syllabus content."
        system_instruction = (
            "You are the official academic AI Clinical Tutor for 'Medical Text and Image Processing (AIDS 12605.1)' "
            "at the Faculty of Engineering and Technology, Adani Institute of Higher Education and Research.\n\n"
            "STRICT RULES:\n"
            "1. Ground your explanations EXCLUSIVELY in the provided syllabus context and foundational medical physics/math.\n"
            "2. Never provide medical diagnoses or personal health advice.\n"
            "3. If referring to a specific diagram node (e.g. Tissue, PE, CS, Transmitted, Sinogram, Filter), mention the node name.\n"
            "4. End your response with an explicit citation tag: [Citation: {topic_title}, Section 1]\n"
            "5. Use KaTeX notation for equations ($...$)."
        )

        user_content = f"CONTEXT:\n{context_block}\n\nSTUDENT QUESTION:\n{prompt}"

        response_text = ""
        node_highlight = active_diagram_node

        # 4. Attempt Gemini with Key Rotation Pool
        if self.gemini_keys:
            # Try up to len(self.gemini_keys) rotations
            for _ in range(min(len(self.gemini_keys), 4)):
                candidate_key = self._get_next_gemini_key()
                if not candidate_key:
                    break
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={candidate_key}"
                    payload = {
                        "contents": [{"parts": [{"text": f"{system_instruction}\n\n{user_content}"}]}],
                        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600}
                    }
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        res = await client.post(url, json=payload)
                        if res.status_code == 200:
                            data = res.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                response_text = candidates[0]["content"]["parts"][0]["text"]
                                break
                        else:
                            print(f"[TUTOR] Key rotation check: status {res.status_code}")
                except Exception as e:
                    print(f"[TUTOR] Gemini key rotation attempt: {e}")

        # 5. Fallback to Groq Cloud (Llama 3.3 70B)
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
                    "max_tokens": 500
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        response_text = data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[TUTOR] Groq fallback failed: {e}")

        # 6. Fallback Rule-Based Academic Engine if free APIs are unconfigured or throttled
        if not response_text:
            p_lower = prompt.lower()
            if "attenuation" in p_lower or "hvl" in p_lower or "beer" in p_lower:
                response_text = (
                    "Linear attenuation coefficient ($\\mu$) governs the exponential decay of X-ray beam intensity as it traverses tissue: "
                    "$I(x) = I_0 \\, e^{-\\mu x}$. The Half-Value Layer is the absorber thickness that attenuates 50% of incident photons: "
                    "$\\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}$. "
                    "Dense cortical bone has a higher attenuation coefficient than soft tissue due to its higher effective atomic number ($Z \\approx 13.8$).\n\n"
                    f"[Citation: {topic_title}, Section 3]"
                )
                node_highlight = "Tissue"
            elif "radon" in p_lower or "sinogram" in p_lower or "backprojection" in p_lower:
                response_text = (
                    "The Radon transform computes line integrals through an object at angle $\\theta$ and offset $s$. "
                    "In clinical CT, assembling these 1D projection profiles across 360 degrees yields the sinogram. "
                    "Filtered backprojection (FBP) uses a ramp filter (e.g., Ram-Lak) in frequency space before backprojecting to avoid blurring.\n\n"
                    f"[Citation: {topic_title}, Section 2]"
                )
                node_highlight = "Sinogram"
            elif "dicom" in p_lower or "tag" in p_lower or "hu" in p_lower or "hounsfield" in p_lower:
                response_text = (
                    "In DICOM Part 10 file standards, data elements are identified by hexadecimal (Group, Element) tag pairs. "
                    "For instance, tag `(0028,1050)` specifies Window Center (WL), and `(0028,1051)` defines Window Width (WW). "
                    "CT numbers are standardized in Hounsfield Units: $\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$, "
                    "where air is $-1000$ HU, water is $0$ HU, and cortical bone is $+1000$ to $+3000$ HU.\n\n"
                    f"[Citation: {topic_title}, Section 2]"
                )
                node_highlight = "Tag0028"
            else:
                response_text = (
                    f"In this topic on '{topic_title}', the key operational principle links the underlying physics "
                    "to spatial image representation and diagnostic contrast. Review the mathematical formulation in Section 3 "
                    "and the corresponding pipeline flowchart in the sticky right workstation.\n\n"
                    f"[Citation: {topic_title}, Section 1]"
                )

        result_payload = {
            "response": response_text,
            "citations": [
                {
                    "topic_title": topic_title,
                    "section_number": 1,
                    "reference_code": "AIDS-12605.1"
                }
            ],
            "highlight_diagram_node": node_highlight
        }

        # Cache valid response in Upstash Redis to save tokens for identical future queries
        await self.set_cached_response(topic_id, prompt, result_payload)
        return result_payload


rag_service = RAGService()
