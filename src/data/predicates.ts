import { AppId, PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";

export function webOnly(app: AppManifest) {
  return app.platform === PlatformType.Web;
}

export function dedupe() {
  const seen = new Set<AppId>();

  return (app: AppManifest): boolean => {
    if (seen.has(app.appId)) {
      return false;
    }

    seen.add(app.appId);
    return true;
  };
}
