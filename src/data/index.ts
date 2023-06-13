import { promises as fs } from "fs";
import * as path from "path";

import { AppManifestSchema, AppManifest } from "./AppManifestSchema";

export * from "./AppManifestSchema";

// Specify the folder path where the JSON files are located
const folderPath = path.join(process.cwd(), "manifests");

const files = await fs.readdir(folderPath);

const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === ".json");

export const manifests: ReadonlyArray<AppManifest> = await Promise.all(
  jsonFiles.map(async (file) => {
    const filePath = path.join(folderPath, file);

    const data = await fs.readFile(filePath, "utf8");

    return AppManifestSchema.parse(JSON.parse(data));
  })
);
