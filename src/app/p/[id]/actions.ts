"use server";

import never from "never";

import { resolvePlatformType } from "@/app/device";
import { SelectionMode } from "@/app/types";
import { findApp, saveFavoriteApp } from "@/data";

import { redirectTo } from "./redirect";

export async function openWith(data: FormData) {
  const appId = (data.get("appId") as string | undefined) ?? never("Missing App ID");
  const publicationId =
    (data.get("publicationId") as string | undefined) ?? never("Missing Publication ID");

  const app = (await findApp({ appId, platform: resolvePlatformType() })) ?? never("App not found");

  const mode =
    data.get("mode") === SelectionMode.JustOnce ? SelectionMode.JustOnce : SelectionMode.Always;

  if (mode === SelectionMode.Always) {
    await saveFavoriteApp(app);
  }

  redirectTo(app, publicationId);
}
