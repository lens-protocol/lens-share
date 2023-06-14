import { headers } from "next/headers";
import { PlatformType } from "./types";
import { userAgent } from "next/server";

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
