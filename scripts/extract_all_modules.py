import zipfile
import xml.etree.ElementTree as ET
import os
import json

DOCS = [
    (1, 'MTIP_Module1_Model_Answers.docx'),
    (2, 'Module2_Answers_MTIP.docx'),
    (3, 'MTIP_Module3_Model_Answers.docx'),
    (4, 'MTIP_Module4_Model_Answers.docx'),
    (5, 'MTIP_Module5_Model_Answers.docx')
]

summary = {}

for mod_num, doc_path in DOCS:
    if not os.path.exists(doc_path):
        print(f"[SKIP] {doc_path} not found.")
        continue

    img_dir = f"frontend/public/images/curriculum/m{mod_num}"
    os.makedirs(img_dir, exist_ok=True)

    with zipfile.ZipFile(doc_path, 'r') as z:
        rels_xml = z.read('word/_rels/document.xml.rels')
        rels_tree = ET.fromstring(rels_xml)
        rel_map = {}
        for r in rels_tree:
            rid = r.attrib.get('Id')
            target = r.attrib.get('Target')
            if target and 'media' in target:
                rel_map[rid] = target.replace('media/', '')

        # Extract media files
        extracted_images = []
        for m in z.namelist():
            if m.startswith('word/media/') and not m.endswith('/'):
                fname = os.path.basename(m)
                out_path = os.path.join(img_dir, fname)
                with open(out_path, 'wb') as out_f:
                    out_f.write(z.read(m))
                extracted_images.append(fname)

        # Parse document structure
        doc_xml = z.read('word/document.xml')
        doc_tree = ET.fromstring(doc_xml)

        items = []
        current_q = None
        q_dict = {}

        for p in doc_tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            text = ''.join(n.text for n in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if n.text).strip()
            blips = [b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') 
                     for b in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip')]
            img_names = [rel_map.get(b) for b in blips if b in rel_map]

            is_header = False
            # Check if this paragraph starts a question or unit
            if text.startswith('Q.') or text.startswith('Q ') or text.startswith('Question ') or text.startswith('1. ') or text.startswith('2. '):
                # Check if it looks like a question header
                if any(k in text for k in ['[BAQ', '[SAQ', '[LAQ', 'marks]', 'What', 'Explain', 'Describe', 'Define', 'Calculate']):
                    current_q = text.split('[')[0].strip()
                    q_dict[current_q] = {'header': text, 'paragraphs': [], 'images': []}
                    is_header = True

            if not is_header and current_q:
                if text:
                    q_dict[current_q]['paragraphs'].append(text)
                if img_names:
                    q_dict[current_q]['images'].extend(img_names)
            elif not is_header:
                # Top level notes or preamble
                items.append({'text': text, 'images': img_names})

        summary[f"m{mod_num}"] = {
            "file": doc_path,
            "images_extracted": len(extracted_images),
            "questions_parsed": len(q_dict),
            "image_dir": img_dir
        }

        # Save structured extraction
        out_json = f"scripts/m{mod_num}_extracted_raw.json"
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump({'preamble': items, 'questions': q_dict}, f, indent=2, ensure_ascii=False)
        print(f"Module {mod_num}: Extracted {len(extracted_images)} images, parsed {len(q_dict)} questions -> {out_json}")

print("\n=== SUMMARY OF ALL EXTRACTED MODULES ===")
for k, v in summary.items():
    print(f" {k.upper()}: {v['images_extracted']} images | {v['questions_parsed']} questions in {v['image_dir']}")
