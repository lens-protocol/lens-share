import { AppId, PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";

export function byMobilePlatformFirst(a: AppManifest, b: AppManifest) {
  if (a.platform === PlatformType.Mobile && b.platform === PlatformType.Web) {
    return -1;
  }

  if (a.platform === PlatformType.Web && b.platform === PlatformType.Mobile) {
    return 1;
  }

  return 0;
}

export function withPriorityTo(appId: AppId | undefined) {
  return (a: AppManifest, b: AppManifest) => {
    if (appId === undefined) {
      return 0;
    }

    if (a.appId === appId) {
      return -1;
    }

    if (b.appId === appId) {
      return +1;
    }

    return 0;
  };
}
