import zipfile
import xml.etree.ElementTree as ET
import os
import json

os.makedirs('frontend/public/images/curriculum/m1', exist_ok=True)

with zipfile.ZipFile('MTIP_Module1_Model_Answers.docx', 'r') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    rels_tree = ET.fromstring(rels_xml)
    rel_map = {}
    for r in rels_tree:
        rid = r.attrib.get('Id')
        target = r.attrib.get('Target')
        if target and 'media' in target:
            rel_map[rid] = target.replace('media/', '')

    # Extract all media files to disk
    extracted_files = []
    for m in z.namelist():
        if m.startswith('word/media/') and not m.endswith('/'):
            fname = os.path.basename(m)
            out_path = os.path.join('frontend/public/images/curriculum/m1', fname)
            with open(out_path, 'wb') as out_f:
                out_f.write(z.read(m))
            extracted_files.append(fname)

    doc_xml = z.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)

    # Walk through paragraphs to map questions, answers, and images
    current_q = None
    q_data = {}
    
    for p in doc_tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        text = ''.join(n.text for n in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if n.text).strip()
        blips = [b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') 
                 for b in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip')]
        img_names = [rel_map.get(b) for b in blips if b in rel_map]

        if text.startswith('Q.') or text.startswith('Q '):
            current_q = text.split('[')[0].strip()
            q_data[current_q] = {'header': text, 'paragraphs': [], 'images': []}
        elif current_q:
            if text:
                q_data[current_q]['paragraphs'].append(text)
            if img_names:
                q_data[current_q]['images'].extend(img_names)

print(f"Extracted {len(extracted_files)} image files into frontend/public/images/curriculum/m1/")
print(f"Parsed {len(q_data)} questions from Module 1.")
total_imgs_mapped = sum(len(d['images']) for d in q_data.values())
print(f"Total images mapped: {total_imgs_mapped}")

# Save JSON dump for easy reference
with open('scripts/m1_extracted_raw.json', 'w', encoding='utf-8') as f:
    json.dump(q_data, f, indent=2, ensure_ascii=False)

for q, d in list(q_data.items())[:15]:
    print(f"* {q} -> {len(d['paragraphs'])} paragraphs | images: {d['images']}")
