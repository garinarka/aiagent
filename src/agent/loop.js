import { askAI } from "../ai/client.js";
import { executeTool } from "../ai/toolExecutor.js";

function extractJSON(text) {
    try {
        if (!text) return null;

        const match = text.match(/```json([\s\S]*?)```/);
        let jsonString = match ? match[1] : text;

        jsonString = jsonString
            .replace(/\/\/.*$/gm, "")
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

export async function runAgent(userPrompt) {
    let context = `
You are an AI agent that can think step-by-step.

You have tools:
- readFile(path)
- writeFile(path, content)

Rules:
- If needed, use tools
- If done, respond with:
{ "final": "your answer" }
`;

    let maxSteps = 5;

    for (let step = 0; step < maxSteps; step++) {
        const response = await askAI(context + `\n\nUser: ${userPrompt}`);

        console.log(`\nSTEP ${step + 1} RESPONSE:\n`, response);

        const parsed = extractJSON(response);

        if (!parsed) {
            console.log("AI ngaco. Stop.");
            break;
        }

        // ✅ FINAL ANSWER
        if (parsed.final) {
            console.log("\nFINAL ANSWER:\n", parsed.final);
            return parsed.final;
        }

        // 🛠 TOOL CALL
        if (parsed.tool) {
            const result = await executeTool(parsed.tool, parsed.args);

            context += `
Tool used: ${parsed.tool}
Result:
${result}
`;
        } else {
            console.log("Format gak jelas. Stop.");
            break;
        }
    }

    console.log("\nMax steps reached. AI kelelahan.");
}
