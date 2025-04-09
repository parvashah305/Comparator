const {exec}=require('child_process')
const fs=require('fs')
const path=require('path')
const {OpenAI}=require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

exports.summarizeFiles=(req,res)=>{
    if(!req.files||!req.files.file1||!req.files.file2){
        return res.status(500).json({message:"Both files are required"})
    }
    const file1path=req.files.file1[0].path
    const file2path=req.files.file2[0].path

    exec(`python3 scripts/extract_text.py "${file1path}" "${file2path}"`,
            async(error,stdout,stderr)=>{
                try {
                    fs.unlinkSync(file1path)
                    fs.unlinkSync(file2path)

                    if(error){
                        console.error("Python Error",stderr)
                        return res.status(500).json({ error: "Extraction failed" });
                    }

                    const extracted=JSON.parse(stdout);
                    const file1Content = extracted.file1;
                    const file2Content = extracted.file2;


        const prompt1 = `
        You are an AI assistant. Summarize the following content from File 1. Include purpose, structure, tables, and key points.
        
        Text:
        ${file1Content.text}
        
        Tables:
        ${JSON.stringify(file1Content.tables, null, 2)}
                `;
        
                const prompt2 = `
        You are an AI assistant. Summarize the following content from File 2. Include purpose, structure, tables, and key points.
        
        Text:
        ${file2Content.text}
        
        Tables:
        ${JSON.stringify(file2Content.tables, null, 2)}
                `;
        
                const [summary1, summary2] = await Promise.all([
                  openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: prompt1 }],
                    temperature: 0.3,
                  }),
                  openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: prompt2 }],
                    temperature: 0.3,
                  }),
                ]);
        
                res.json({
                  file1: {
                    raw: file1Content,
                    summary: summary1.choices[0].message.content,
                  },
                  file2: {
                    raw: file2Content,
                    summary: summary2.choices[0].message.content,
                  },
                });

                } catch (error) {
                    console.error("Summarization Error:", err);
                    res.status(500).json({ error: "Failed to summarize files" });
                }
            }
        )
}