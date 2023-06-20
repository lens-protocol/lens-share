import { AppId, PlatformType, RouteKind } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { byMobilePlatformFirst } from "./comparators";
import { fetchAllApps } from "./storage";

export type FindPublicationAppsRequest = {
  platform: PlatformType;
  exclude?: AppId;
};

function supportsPublicationRoute(app: AppManifest) {
  return app.routes?.[RouteKind.Publication];
}

export async function findPublicationApps(
  request: FindPublicationAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchAllApps();

  if (request.platform === PlatformType.Web) {
    return apps.filter(
      (app) =>
        app.appId !== request.exclude &&
        app.platform === PlatformType.Web &&
        supportsPublicationRoute(app)
    );
  }

  return apps
    .filter((app) => app.appId !== request.exclude && supportsPublicationRoute(app))
    .sort(byMobilePlatformFirst);
}
