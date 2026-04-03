import { askAI } from "./ai/client.js";
import { executeTool } from "./ai/toolExecutor.js";

function extractJSON(text) {
    try {
        if (!text) return null;

        // ambil dari ```json ```
        const match = text.match(/```json([\s\S]*?)```/);

        let jsonString = match ? match[1] : text;

        // bersihin noise
        jsonString = jsonString
            .replace(/\/\/.*$/gm, "")
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        return JSON.parse(jsonString);

    } catch {
        return null;
    }
}

async function run() {
    const userPrompt = "Use readFile to open src/test-ai.js";

    let firstResponse = await askAI(userPrompt);

    console.log("AI FIRST RESPONSE:\n", firstResponse);

    let parsed = extractJSON(firstResponse);

    // 🔁 retry kalau gagal
    if (!parsed || !parsed.tool) {
        console.log("\nRetrying with stricter instruction...\n");

        firstResponse = await askAI(
            `Respond ONLY with JSON tool call.\n\nUser: ${userPrompt}`
        );

        console.log("RETRY RESPONSE:\n", firstResponse);

        parsed = extractJSON(firstResponse);
    }

    // handle array
    let toolCall = parsed;
    if (Array.isArray(parsed)) {
        toolCall = parsed[0];
    }

    if (toolCall && toolCall.tool) {
        console.log("\nExecuting tool...\n");

        const toolResult = await executeTool(toolCall.tool, toolCall.args);

        const finalResponse = await askAI(
            `Here is file content:

${toolResult}

Explain what this file does clearly.`
        );

        console.log("FINAL RESPONSE:\n", finalResponse);
    } else {
        console.log("\nGagal dapet tool call. AI masih ngaco.\n");
    }
}

run();
