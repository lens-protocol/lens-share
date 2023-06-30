import { ProfileFragment } from "@lens-protocol/client";
import truncateMarkdown from "markdown-truncate";
import { ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/app/client";
import { SearchParams } from "@/app/types";
import { AppsList } from "@/components/AppsList";
import { twitterHandle } from "@/config";
import { AppManifest, findApp, findFavoriteApp, findProfileApps } from "@/data";
import { formatProfileHandle } from "@/formatters";
import { resolvePlatformType } from "@/utils/device";
import { resolveAttribution } from "@/utils/request";

import { openWith } from "./actions";
import { redirectTo } from "./redirect";

export type ProfilePageProps = {
  params: {
    handle: string;
  };
  searchParams: SearchParams;
};

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const platform = resolvePlatformType();
  const profile = await client.profile.fetch({ handle: params.handle });

  const favoriteApp = await findFavoriteApp({ platform });

  if (favoriteApp) {
    redirectTo(favoriteApp, params.handle);
  }

  if (!profile) notFound();

  const attribution = searchParams.by ? await findApp({ appId: searchParams.by, platform }) : null;

  const options = await findProfileApps({
    platform,
    priorityTo: attribution?.appId,
  });

  return (
    <form action={openWith}>
      <input type="hidden" name="handle" value={profile.handle} />

      <AppsList attribution={attribution} options={options} />
    </form>
  );
}

function formatPageTitle(profile: ProfileFragment, attribution: AppManifest | null) {
  if (attribution) {
    return `${formatProfileHandle(profile.handle)} profile  • ${attribution.name}`;
  }
  return `${formatProfileHandle(profile.handle)} profile`;
}

function formatPageDescription(profile: ProfileFragment) {
  return profile.bio
    ? truncateMarkdown(profile.bio, {
        limit: 100,
        ellipsis: true,
      })
    : undefined;
}

export async function generateMetadata(
  { params, searchParams }: ProfilePageProps,
  parent: ResolvingMetadata
) {
  const profile = await client.profile.fetch({ handle: params.handle });

  if (!profile) notFound();

  const attribution = await resolveAttribution(searchParams);

  const title = formatPageTitle(profile, attribution);

  const description = formatPageDescription(profile);

  const { openGraph } = await parent;
  const siteName = attribution?.name ?? openGraph?.siteName ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/u/${profile.handle}`,
      type: "profile",
      siteName,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      site: attribution?.twitter ?? twitterHandle,
    },
  };
}
