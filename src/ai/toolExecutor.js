import { readFile } from "../tools/readFile.js";
import { writeFile } from "../tools/writeFile.js";

export async function executeTool(tool, args) {
    switch (tool) {
        case "readFile":
            return await readFile(args.path);

        case "writeFile":
            return await writeFile(args.path, args.content);

        default:
            return "Unknown tool";
    }
}
