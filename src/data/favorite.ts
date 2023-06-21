import { cookies } from "next/headers";

import { PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { findApp } from "./findApp";

const key = "favoriteApp";

export async function saveFavoriteApp(app: AppManifest) {
  cookies().set(key, app.appId);
}

export type FindFavoriteAppRequest = {
  platform: PlatformType;
};

export async function findFavoriteApp(
  request: FindFavoriteAppRequest
): Promise<AppManifest | null> {
  const favoriteApp = cookies().get(key);

  if (!favoriteApp) {
    return null;
  }

  return await findApp({ appId: favoriteApp.value, platform: request.platform });
}
