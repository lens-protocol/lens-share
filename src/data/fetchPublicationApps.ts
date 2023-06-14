import { AppManifest } from "./AppManifestSchema";
import { fetchAllApps } from "./fetchAllApps";
import { PlatformType, RouteKind } from "@/app/types";

export type FetchPublicationAppsRequest = {
  platform: PlatformType;
};

export async function fetchPublicationApps(
  request: FetchPublicationAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchAllApps();

  return apps.filter((app) => app.mappings[request.platform]?.[RouteKind.Publication]);
}
