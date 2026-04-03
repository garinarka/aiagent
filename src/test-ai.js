import { askAI } from "./ai/client.js";

async function run() {
    const response = await askAI("Explain what Express.js is");

    console.log("AI RESPONSE:\n");
    console.log(response);
}

run();
