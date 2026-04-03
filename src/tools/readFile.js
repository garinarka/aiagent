import fs from "fs-extra";

export async function readFile(path) {
    try {
        const content = await fs.readFile(path, "utf-8");
        return content;
    } catch (error) {
        return `Error reading file: ${error.message}`;
    }
}
