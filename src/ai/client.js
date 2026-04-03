import axios from "axios";

export async function askAI(prompt) {
    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "deepseek-coder",
            prompt: prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        console.error("AI ERROR:", error.message);
        return "Error connecting to local AI";
    }
}
