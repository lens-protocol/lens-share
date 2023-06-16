import { PlatformType, RouteKind } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { fetchAllApps } from "./fetchAllApps";

export type FetchPublicationAppsRequest = {
  platform: PlatformType;
  exclude?: string;
};

function byMobilePlatformFirst(a: AppManifest, b: AppManifest) {
  if (a.platform === PlatformType.Mobile && b.platform === PlatformType.Web) {
    return -1;
  }

  if (a.platform === PlatformType.Web && b.platform === PlatformType.Mobile) {
    return 1;
  }

  return 0;
}

function supportsPublicationRoute(app: AppManifest) {
  return app.routes?.[RouteKind.Publication];
}

export async function findPublicationApps(
  request: FetchPublicationAppsRequest
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
