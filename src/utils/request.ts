import { SearchParams } from "@/app/types";
import { AppManifest, findApp } from "@/data";

import { resolvePlatformType } from "./device";

export async function resolveAttribution({ by }: SearchParams): Promise<AppManifest | null> {
  const platform = resolvePlatformType();
  return by ? await findApp({ appId: by, platform }) : null;
}
