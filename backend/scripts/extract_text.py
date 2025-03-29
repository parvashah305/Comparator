import sys
import json
import fitz  # PyMuPDF

def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()

if __name__ == "__main__":
    file1 = sys.argv[1]
    file2 = sys.argv[2]

    text1 = extract_text(file1)
    text2 = extract_text(file2)

    print(json.dumps({"text1": text1, "text2": text2}))