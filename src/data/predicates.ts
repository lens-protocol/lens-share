import { PlatformType } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";

export function webOnly(app: AppManifest) {
  return app.platform === PlatformType.Web;
}
