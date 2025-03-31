import difflib
import json
import pdfplumber

def extract_text_and_tables(pdf_path):
    """ Extracts both text and tables from a PDF file. """
    extracted_data = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
              
                text = page.extract_text()
                if text:
                    extracted_data.append(text)
                
            
                tables = page.extract_tables()
                for table in tables:
                    table_text = "\n".join([" | ".join(row) for row in table if any(row)])
                    extracted_data.append(table_text)

        return "\n".join(extracted_data)

    except Exception as e:
        return ""

def compare_text(text1, text2):
    """ Compares two texts and returns added, deleted, modified, and unchanged sections. """
    diff = difflib.ndiff(text1.split("\n"), text2.split("\n"))

    changes = {
        "added": [],
        "deleted": [],
        "modified": [],
        "unchanged": [] 
    }

    temp_deleted = []
    temp_added = []

    for line in diff:
        if line.startswith("+ "):
            temp_added.append(line[2:])
        elif line.startswith("- "):
            temp_deleted.append(line[2:])
        elif not line.startswith("? "):  
            changes["unchanged"].append(line[2:])

    refined_modifications = []
    for del_line in temp_deleted[:]:  
        for add_line in temp_added[:]:
            if difflib.SequenceMatcher(None, del_line, add_line).ratio() > 0.5:
                word_changes = []
                for word in difflib.ndiff(del_line.split(), add_line.split()):
                    if word.startswith("- "):
                        word_changes.append({"removed": word[2:]})
                    elif word.startswith("+ "):
                        word_changes.append({"added": word[2:]})

                refined_modifications.append({
                    "old": del_line,
                    "new": add_line,
                    "word_changes": word_changes
                })

                temp_deleted.remove(del_line)
                temp_added.remove(add_line)
                break

    changes["modified"] = refined_modifications
    changes["added"] = temp_added
    changes["deleted"] = temp_deleted

    return changes

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print(json.dumps({"error": "Two PDF file paths are required"}))
        sys.exit(1)

    file1_path = sys.argv[1]
    file2_path = sys.argv[2]

    text1 = extract_text_and_tables(file1_path)
    text2 = extract_text_and_tables(file2_path)

    differences = compare_text(text1, text2)

    print(json.dumps(differences, indent=4))