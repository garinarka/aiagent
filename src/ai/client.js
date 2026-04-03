import axios from "axios";

export async function askAI(prompt) {
    const systemPrompt = `
You are an AI coding agent.

You can use tools:
- readFile(path)
- writeFile(path, content)

If needed, respond ONLY in JSON format like:
{
  "tool": "readFile",
  "args": { "path": "src/index.js" }
}

Otherwise, respond normally.
`;

    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "deepseek-coder",
            prompt: systemPrompt + "\n\nUser: " + prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        console.error("AI ERROR:", error.message);
        return "Error connecting to local AI";
    }
}
