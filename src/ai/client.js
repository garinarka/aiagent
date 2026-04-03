import axios from "axios";

export async function askAI(prompt) {
    const systemPrompt = `
You are an AI coding agent.

You can use tools:
- readFile(path)
- writeFile(path, content)

If the user asks about a file, prefer using tools.

When using tools, respond ONLY in JSON format like:
{
  "tool": "readFile",
  "args": { "path": "src/test-ai.js" }
}

Do not include explanation when using tools.
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
        return null;
    }
}
