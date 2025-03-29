const { exec } = require("child_process");
const fs = require("fs");

exports.compareFiles = (req, res) => {
    if (!req.files || !req.files.file1 || !req.files.file2) {
        return res.status(400).json({ error: "Both files are required" });
    }

    const file1Path = req.files.file1[0].path;
    const file2Path = req.files.file2[0].path;

    console.log("Received File Paths:", file1Path, file2Path); 

    if (!fs.existsSync(file1Path) || !fs.existsSync(file2Path)) {
        return res.status(400).json({ error: "Uploaded files not found" });
    }

    exec(`python3 scripts/compare_files.py "${file1Path}" "${file2Path}"`, (error, stdout, stderr) => {
        if (error) {
            console.error("Python Error:", stderr);
            return res.status(500).json({ error: "Comparison failed" });
        }

        try {
            const differences = JSON.parse(stdout);
            res.json(differences);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            res.status(500).json({ error: "Invalid response format from Python script" });
        }

        fs.unlinkSync(file1Path);
        fs.unlinkSync(file2Path);
    });
};