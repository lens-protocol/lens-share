"use server";

import { invariant } from "@lens-protocol/shared-kernel";

import { findApp, saveFavoriteApp } from "@/data";
import { resolvePlatformType } from "@/utils/device";

import { redirectTo } from "./redirect";

export async function openWith(data: FormData) {
  const appId = data.get("appId") as string | null;
  invariant(appId !== null, "Missing App ID");

  const handle = data.get("handle") as string | null;
  invariant(handle !== null, "Missing handle");

  const app = await findApp({ appId, platform: resolvePlatformType() });
  invariant(app !== null, "App not found");

  if (data.has("remember")) {
    await saveFavoriteApp(app);
  }

  redirectTo(app, handle);
}
