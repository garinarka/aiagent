import { askAI } from "./ai/client.js";

async function run() {
    const response = await askAI("Read file src/test-ai.js");

    console.log(response);
}

run();
