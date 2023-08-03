"use server";

import { AppManifest } from "@/data";
import { fetchAllApps } from "@/data/storage";

const SHARE_PROFILE_URL = "https://share.lens.xyz/u/";
const SHARE_PUBLICATION_URL = "https://share.lens.xyz/p/";

export async function getLink(data: FormData) {
  const link = data.get("link") as string | null;

  const apps = await fetchAllApps();

  const result = determineLinkTypeForAppManifests(link ?? "", apps as AppManifest[]);

  console.log("🌺", result);
}

function determineLinkTypeForApp(
  link: string,
  manifest: AppManifest
): { type: "profile" | "publication" | "unknown"; url?: string } {
  const profileUrl = manifest.routes.profile?.url;
  const publicationUrl = manifest.routes.publication?.url;

  if (profileUrl) {
    const profileRegex = new RegExp(`^${profileUrl.replace(":handle", "(.+)")}$`);

    const profileMatch = profileRegex.exec(link);
    if (profileMatch) {
      const customProfileUrl = SHARE_PROFILE_URL + profileMatch[1];
      return { type: "profile", url: customProfileUrl };
    }
  }

  if (publicationUrl) {
    const publicationIdRegex = new RegExp(`^${publicationUrl.replace(":id", "(.+)")}$`);

    const publicationMatch = publicationIdRegex.exec(link);
    if (publicationMatch) {
      const customPublicationUrl = SHARE_PUBLICATION_URL + publicationMatch[1];
      return { type: "publication", url: customPublicationUrl };
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
  return "unknown";
}
