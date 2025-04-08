// const { exec } = require("child_process");
// const fs = require("fs");

// exports.compareFiles = (req, res) => {
//     if (!req.files || !req.files.file1 || !req.files.file2) {
//         return res.status(400).json({ error: "Both files are required" });
//     }

//     const file1Path = req.files.file1[0].path;
//     const file2Path = req.files.file2[0].path;

//     console.log("Received File Paths:", file1Path, file2Path); 

//     if (!fs.existsSync(file1Path) || !fs.existsSync(file2Path)) {
//         return res.status(400).json({ error: "Uploaded files not found" });
//     }

//     exec(`python3 scripts/compare_files.py "${file1Path}" "${file2Path}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error("Python Error:", stderr);
//             return res.status(500).json({ error: "Comparison failed" });
//         }

//         try {
//             const differences = JSON.parse(stdout);
//             res.json(differences);
//         } catch (parseError) {
//             console.error("JSON Parse Error:", parseError);
//             res.status(500).json({ error: "Invalid response format from Python script" });
//         }

//         fs.unlinkSync(file1Path);
//         fs.unlinkSync(file2Path);
//     });
// };





const { exec } = require("child_process");
const fs = require("fs");
const { OpenAI } = require("openai");

// Initialize OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Clean function to extract key parts of differences
function extractRelevantDifferences(differences) {
  return {
    added: differences.added || [],
    deleted: differences.deleted || [],
    modified: differences.modified || [],
  };
}

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

  exec(
    `python3 scripts/compare_files.py "${file1Path}" "${file2Path}"`,
    async (error, stdout, stderr) => {
      try {
        // Delete uploaded files
        fs.unlinkSync(file1Path);
        fs.unlinkSync(file2Path);

        if (error) {
          console.error("Python Error:", stderr);
          return res.status(500).json({ error: "Comparison failed" });
        }

        const differences = JSON.parse(stdout);
        const relevantDiffs = extractRelevantDifferences(differences);

        const prompt = `
You are a legal contract analysis assistant.

Based on the following differences between two versions of a procurement contract, generate a professional summary of the key changes:

Include:
- Additions or deletions
- Modifications to quantities, prices, or terms
- Any new or removed clauses

Here are the line-by-line differences:
${JSON.stringify(relevantDiffs, null, 2)}

Return a clear and concise summary of these changes.
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        });

        const finalSummary = completion.choices[0].message.content;

        res.json({
          lineByLineComparison: relevantDiffs,
          summary: finalSummary,
        });
      } catch (err) {
        console.error("Error during summary generation or parsing:", err);
        res
          .status(500)
          .json({ error: "Comparison or summary generation failed" });
      }
    }
  );
};