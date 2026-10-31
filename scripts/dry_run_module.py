"""
Dry run execution for Module loading.
Parses module, validates against EQB, and prints what would be inserted or changed.
"""

import sys
import os
from parse_curriculum import parse_curriculum_md, parse_eqb_excel, get_module_questions

def format_table(headers, rows):
    col_widths = [len(h) for h in headers]
    for r in rows:
        for idx, val in enumerate(r):
            col_widths[idx] = max(col_widths[idx], len(str(val)))
    
    header_str = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
    sep_str = "-|-".join("-" * col_widths[i] for i in range(len(headers)))
    row_strs = [" | ".join(str(val).ljust(col_widths[i]) for i, val in enumerate(r)) for r in rows]
    return f"| {header_str} |\n| {sep_str} |\n" + "\n".join(f"| {s} |" for s in row_strs)

def dry_run_module(mod_num: int):
    md_path = "content-source/MTIP_Curriculum_Data.md"
    xlsx_path = "content-source/EQB_MTIP-26_updated.xlsx"

    print("=" * 80)
    print(f"DRY RUN: MODULE {mod_num} PARSING & VALIDATION")
    print("=" * 80)

    cur_data = parse_curriculum_md(md_path)
    eqb_data = parse_eqb_excel(xlsx_path)

    if mod_num not in cur_data["modules"]:
        print(f"Error: Module {mod_num} not found in curriculum data!")
        return False

    mod = cur_data["modules"][mod_num]
    print(f"\nModule {mod_num}: {mod['title']}")
    print(f"Declared Hours: {mod['hours']}, EQB CO: {mod['eqb_co']}")
    print(f"Total Topics: {len(mod['topics'])}\n")

    # Topic table
    topic_rows = []
    total_doc_q = 0
    total_parsed_q = 0
    mismatches = []

    for t in mod["topics"]:
        p_count = len(t["q_tokens"])
        d_count = t["doc_count"]
        total_doc_q += d_count
        total_parsed_q += p_count
        match_str = "OK" if p_count == d_count else "MISMATCH"
        if p_count != d_count:
            mismatches.append((t["code"], p_count, d_count))

        topic_rows.append([
            t["code"],
            t["title"][:40],
            t["coverage"],
            t["status"],
            d_count,
            p_count,
            match_str
        ])

    print("TOPIC BREAKDOWN:")
    print(format_table(
        ["Code", "Title", "Coverage", "Status", "Doc (n)", "Parsed", "Match"],
        topic_rows
    ))

    print(f"\nTotal declared in document: {total_doc_q}")
    print(f"Total parsed tokens: {total_parsed_q}")

    if mismatches:
        print("\n[ERROR] Topic question count mismatch detected:")
        for code, p, d in mismatches:
            print(f"  Topic {code}: parsed {p} vs declared {d}")
        return False

    # Extract EQB questions
    questions = get_module_questions(mod_num, cur_data, eqb_data)
    print(f"\nExtracted from EQB Excel: {len(questions)} questions")

    # Validate 40 questions per module (B15 S15 L10)
    baq_list = [q for q in questions if q["type"] == "BAQ"]
    saq_list = [q for q in questions if q["type"] == "SAQ"]
    laq_list = [q for q in questions if q["type"] == "LAQ"]

    print(f"  BAQ: {len(baq_list)} (Expected: 15)")
    print(f"  SAQ: {len(saq_list)} (Expected: 15)")
    print(f"  LAQ: {len(laq_list)} (Expected: 10)")

    if len(questions) != 40 or len(baq_list) != 15 or len(saq_list) != 15 or len(laq_list) != 10:
        print("[ERROR] Module question count does not equal B15 S15 L10 (40 total)!")
        return False

    # Check that every question has exactly one topic and no unassigned
    unassigned = [q["id"] for q in questions if not q["topic_code"]]
    if unassigned:
        print(f"[ERROR] Found {len(unassigned)} unassigned questions: {unassigned}")
        return False

    # Check for duplicate IDs
    all_ids = [q["id"] for q in questions]
    if len(all_ids) != len(set(all_ids)):
        print("[ERROR] Duplicate question IDs detected!")
        return False

    print("\n[VALIDATION PASSED] All 40 questions are uniquely mapped to topics.")

    # Questions preview table
    print("\nSAMPLE QUESTIONS PREVIEW (First 2 of each type):")
    sample_rows = []
    for q_sub in [baq_list[:2], saq_list[:2], laq_list[:2]]:
        for q in q_sub:
            sample_rows.append([
                q["id"],
                q["topic_code"],
                q["type"],
                q["marks"],
                q["bloom"],
                q["distribution_level"],
                q["original_text"][:55] + "..." if len(q["original_text"]) > 55 else q["original_text"]
            ])

    print(format_table(
        ["ID", "Topic", "Type", "Marks", "Bloom", "Dist", "Question Text"],
        sample_rows
    ))

    # Sources & Topic Skeletons Preview
    print("\nTOPIC SKELETONS TO BE CREATED:")
    for t in mod["topics"]:
        print(f"\n--- Topic {t['code']}: {t['title']} ---")
        print(f"  Coverage: {t['coverage']} | Initial Status: {t['status']}")
        print(f"  Key terms ({len(t['key_terms'])}): {', '.join(t['key_terms'])}")
        print(f"  Source Attribution: {t['sources_str']}")
        if t["coverage"] == "none":
            print(f"  [SOURCE NEEDED] No source available in provided books. Suggested sources will be flagged.")

    print("\n" + "=" * 80)
    print(f"SUMMARY OF WHAT WOULD BE INSERTED FOR MODULE {mod_num} (NO DB WRITES PERFORMED):")
    print(f"  - 1 Module record (Module {mod_num}: '{mod['title']}')")
    print(f"  - {len(mod['topics'])} Topic records ({', '.join(t['code'] for t in mod['topics'])})")
    print(f"  - {len(mod['topics'])} Topic Skeleton pages/sections")
    print(f"  - 40 Questions (15 BAQ, 15 SAQ, 10 LAQ)")
    print(f"  - 1 Audit Log entry documenting the dry run and pending import")
    print("=" * 80)
    return True

if __name__ == "__main__":
    mod_to_run = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    dry_run_module(mod_to_run)
