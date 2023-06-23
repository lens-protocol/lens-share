import { AppId, PlatformType, RouteKind } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { byMobilePlatformFirst, withPriorityTo } from "./comparators";
import { webOnly } from "./predicates";
import { fetchAllApps } from "./storage";

export type FindProfileAppsRequest = {
  platform: PlatformType;
  priorityTo?: AppId;
};

function supportsProfileRoute(app: AppManifest) {
  return app.routes?.[RouteKind.Profile];
}

export async function findProfileApps(
  request: FindProfileAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchAllApps();

  if (request.platform === PlatformType.Web) {
    return apps
      .filter((app) => webOnly(app) && supportsProfileRoute(app))
      .sort(withPriorityTo(request.priorityTo));
  }

  return apps
    .filter(supportsProfileRoute)
    .sort(byMobilePlatformFirst)
    .sort(withPriorityTo(request.priorityTo));
}
