"use server";

import { invariant } from "@lens-protocol/shared-kernel";

import { resolvePlatformType } from "@/utils/device";
import { SelectionMode } from "@/app/types";
import { findApp, saveFavoriteApp } from "@/data";

import { redirectTo } from "./redirect";

export async function openWith(data: FormData) {
  const appId = data.get("appId") as string | null;
  invariant(appId !== null, "Missing App ID");

  const publicationId = data.get("publicationId") as string | null;
  invariant(publicationId !== null, "Missing Publication ID");

  const app = await findApp({ appId, platform: resolvePlatformType() });
  invariant(app !== null, "App not found");

  const mode =
    data.get("mode") === SelectionMode.JustOnce ? SelectionMode.JustOnce : SelectionMode.Always;

  if (mode === SelectionMode.Always) {
    await saveFavoriteApp(app);
  }

  redirectTo(app, publicationId);
}
