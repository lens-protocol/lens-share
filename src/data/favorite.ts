import { cookies } from "next/headers";

import { PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { findApp } from "./findApp";

const twoWeeksInSeconds = 60 * 60 * 24 * 14;

const key = "favoriteApp";

export async function saveFavoriteApp(app: AppManifest) {
  cookies().set(key, app.appId, { maxAge: twoWeeksInSeconds });
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
