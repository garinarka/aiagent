import fs from "fs-extra";

export async function writeFile(path, content) {
    try {
        await fs.writeFile(path, content);
        return "File written successfully";
    } catch (error) {
        return `Error writing file: ${error.message}`;
    }
}
