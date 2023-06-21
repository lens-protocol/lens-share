import { hasJustOne } from "@lens-protocol/shared-kernel";

import { PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { fetchAllApps } from "./storage";

export type FindAppRequest = {
  appId: string;
  platform: PlatformType;
};

export async function findApp(request: FindAppRequest): Promise<AppManifest | null> {
  const apps = await fetchAllApps();

  const withAppId = apps.filter((app) => app.appId === request.appId);

  if (withAppId.length === 0) {
    return null;
  }

  if (hasJustOne(withAppId)) {
    return withAppId[0];
  }

  return withAppId.find((app) => app.platform === request.platform) ?? null;
}
