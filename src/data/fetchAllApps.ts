import * as path from "path";
import { promises as fs } from "fs";
import never from "never";
import { cache } from "react";

import { AppManifest, AppManifestSchema } from "./AppManifestSchema";

const folderPath = path.join(
  process.cwd(),
  process.env.MANIFESTS_DIR ?? never("MANIFESTS_DIR env var not set")
);

export const fetchAllApps = cache(async function (): Promise<ReadonlyArray<AppManifest>> {
  const files = await fs.readdir(folderPath);

  const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === ".json");

  return await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(folderPath, file);

      const data = await fs.readFile(filePath, "utf8");

      return AppManifestSchema.parse(JSON.parse(data));
    })
  );
});
