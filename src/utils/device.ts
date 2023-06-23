import { headers } from "next/headers";
import { userAgent } from "next/server";

import { PlatformType } from "../app/types";

function isMobileUa(type: string) {
  return ["mobile", "tablet"].includes(type);
}

export function resolvePlatformType(): PlatformType {
  const ua = userAgent({ headers: headers() });

  if (isMobileUa(ua.device.type ?? "")) {
    return PlatformType.Mobile;
  }

  return PlatformType.Web;
}
