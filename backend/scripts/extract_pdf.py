import sys
import json
import pdfplumber

def extract_text_and_tables_from_pdf(pdf_path):
    extracted_data = {
        "text": [],
        "tables": []
    }
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            
            text = page.extract_text()
            if text:
                extracted_data["text"].append(text)
            
        
            tables = page.extract_tables()
            for table in tables:
                extracted_data["tables"].append(table)

    return extracted_data

if __name__ == "__main__":
    pdf_path = sys.argv[1]  
    extracted_data = extract_text_and_tables_from_pdf(pdf_path)
    print(json.dumps(extracted_data, indent=2))  