const { exec } = require("child_process");
const fs = require("fs");

exports.extractText = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfPath = req.file.path;

    exec(`python3 scripts/extract_pdf.py "${pdfPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error("Python Error:", stderr);
            return res.status(500).json({ error: "Extraction failed" });
        }

        res.json({ extracted_text: JSON.parse(stdout) });

      
        fs.unlinkSync(pdfPath);
    });
};