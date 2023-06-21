import { AppId, PlatformType, RouteKind } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { byMobilePlatformFirst } from "./comparators";
import { fetchAllApps } from "./storage";

export type FindProfileAppsRequest = {
  platform: PlatformType;
  exclude?: AppId;
};

function supportsProfileRoute(app: AppManifest) {
  return app.routes?.[RouteKind.Profile];
}

export async function findProfileApps(
  request: FindProfileAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchAllApps();

  if (request.platform === PlatformType.Web) {
    return apps.filter(
      (app) =>
        app.appId !== request.exclude &&
        app.platform === PlatformType.Web &&
        supportsProfileRoute(app)
    );
  }

  return apps
    .filter((app) => app.appId !== request.exclude && supportsProfileRoute(app))
    .sort(byMobilePlatformFirst);
}
