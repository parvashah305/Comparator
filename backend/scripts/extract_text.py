import sys
import json
import pdfplumber

def extract_text_and_tables(pdf_path):
    text = ""
    tables = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"

            page_tables = page.extract_tables()
            for table in page_tables:
                cleaned_table = [[str(cell).strip() if cell else "" for cell in row] for row in table]
                tables.append(cleaned_table)

    return text.strip(), tables

if __name__ == "__main__":
    file1 = sys.argv[1]
    file2 = sys.argv[2]

    text1, tables1 = extract_text_and_tables(file1)
    text2, tables2 = extract_text_and_tables(file2)

    result = {
        "file1": {
            "text": text1,
            "tables": tables1
        },
        "file2": {
            "text": text2,
            "tables": tables2
        }
    }

    print(json.dumps(result))