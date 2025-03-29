import difflib
import json
import pdfplumber

def extract_text(pdf_path):
    """ Extracts text from a PDF file using pdfplumber. """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text
    except Exception:
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

    text1 = extract_text(file1_path)
    text2 = extract_text(file2_path)

    differences = compare_text(text1, text2)

    print(json.dumps(differences, indent=4))