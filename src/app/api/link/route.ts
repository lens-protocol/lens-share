import { NextResponse } from "next/server";

import { AppManifest } from "@/data";
import { fetchAllApps } from "@/data/storage";
import { AppId } from "@/app/types";

export async function POST(req: Request) {
  const res = await req.json();

  if (!res.link) {
    return NextResponse.json({ error: "Missing handle in the request body" });
  }

  const apps = await fetchAllApps();

  const linkType = determineLinkTypeForAppManifests(res.link as string, apps as AppManifest[]);

  return NextResponse.json({ linkType });
}

const SHARE_PROFILE_URL = "https://share.lens.xyz/u/";
const SHARE_PUBLICATION_URL = "https://share.lens.xyz/p/";

function determineLinkTypeForApp(
  link: string,
  manifest: AppManifest
): { type: "profile" | "publication" | "unknown"; url?: string; by?: AppId } {
  const profileUrl = manifest.routes.profile?.url;
  const publicationUrl = manifest.routes.publication?.url;

  if (profileUrl) {
    const profileRegex = new RegExp(`^${profileUrl.replace(":handle", "(.+)")}$`);

    const profileMatch = profileRegex.exec(link);
    if (profileMatch) {
      const customProfileUrl = SHARE_PROFILE_URL + profileMatch[1];
      return { type: "profile", url: customProfileUrl, by: manifest.appId };
    }
  }

  if (publicationUrl) {
    const publicationIdRegex = new RegExp(`^${publicationUrl.replace(":id", "(.+)")}$`);

    const publicationMatch = publicationIdRegex.exec(link);
    if (publicationMatch) {
      const customPublicationUrl = SHARE_PUBLICATION_URL + publicationMatch[1];
      return { type: "publication", url: customPublicationUrl, by: manifest.appId };
    }
  }

  return { type: "unknown" };
}

function determineLinkTypeForAppManifests(link: string, appManifestsArray: AppManifest[]) {
  for (const manifest of appManifestsArray) {
    const linkInfo = determineLinkTypeForApp(link, manifest);
    if (linkInfo.type !== "unknown") {
      return linkInfo;
    }
  }
  return { type: "unknown" };
}
