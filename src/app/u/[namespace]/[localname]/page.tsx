import { ProfileFragment } from "@lens-protocol/client";
import { never } from "@lens-protocol/shared-kernel";
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
import { getFullHandle } from "@/utils/handle";
import { resolveAttribution } from "@/utils/request";

import { openWith } from "./actions";
import { redirectTo } from "./redirect";

export type ProfilePageProps = {
  params: {
    namespace: string;
    localname: string;
  };
  searchParams: SearchParams;
};

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const platform = resolvePlatformType();
  const fullHandle = getFullHandle(params.namespace, params.localname);
  const profile = await client.profile.fetch({ forHandle: fullHandle });

  const favoriteApp = await findFavoriteApp({ platform });

  if (favoriteApp) {
    redirectTo(favoriteApp, fullHandle);
  }

  if (!profile) notFound();
  if (!profile.handle) never();

  const attribution = searchParams.by ? await findApp({ appId: searchParams.by, platform }) : null;

  const options = await findProfileApps({
    platform,
    priorityTo: attribution?.appId,
  });

  return (
    <form action={openWith}>
      <input type="hidden" name="handle" value={profile.handle.fullHandle} />

      <AppsList attribution={attribution} options={options} />
    </form>
  );
}

function formatPageTitle(profile: ProfileFragment, attribution: AppManifest | null) {
  if (attribution) {
    return `${formatProfileHandle(profile)} profile  • ${attribution.name}`;
  }
  return `${formatProfileHandle(profile)} profile`;
}

function formatPageDescription(profile: ProfileFragment) {
  return profile.metadata?.bio
    ? truncateMarkdown(profile.metadata?.bio, {
        limit: 100,
        ellipsis: true,
      })
    : undefined;
}

export async function generateMetadata(
  { params, searchParams }: ProfilePageProps,
  parent: ResolvingMetadata
) {
  const fullHandle = getFullHandle(params.namespace, params.localname);
  const profile = await client.profile.fetch({ forHandle: fullHandle });

  if (!profile) notFound();
  if (!profile.handle) never();

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
      url: `/u/${profile.handle.fullHandle}`,
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
