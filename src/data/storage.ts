import { promises as fs } from "fs";
import * as path from "path";

import { PromiseResult, Result, assertError, failure, success } from "@lens-protocol/shared-kernel";
import { cache } from "react";

import { manifestsDir } from "@/config";

import { AppManifest, AppManifestSchema } from "./AppManifestSchema";

const folderPath = path.join(process.cwd(), manifestsDir);

async function listManifestFiles() {
  const files = await fs.readdir(folderPath);

  return files.filter((file) => path.extname(file).toLowerCase() === ".json");
}

async function readAppManifest(filename: string) {
  const filePath = path.join(folderPath, filename);
  return await fs.readFile(filePath, "utf8");
}

async function readAllManifestFiles(): Promise<Result<AppManifest, Error>[]> {
  const files = await listManifestFiles();

  return await Promise.all(
    files.map(async (filename): PromiseResult<AppManifest, Error> => {
      const data = await readAppManifest(filename);

      try {
        const json = JSON.parse(data);
        const manifest = AppManifestSchema.parse(json);

        return success(manifest);
      } catch (e) {
        console.log(e);
        assertError(e);
        return failure(e);
      }
    })
  );
}

export const fetchAllApps = cache(async function (): Promise<ReadonlyArray<AppManifest>> {
  const results = await readAllManifestFiles();

  return results.filter((result) => result.isSuccess()).map((result) => result.unwrap());
});
