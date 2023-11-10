import { PublicationMetadataFragment, AnyPublicationFragment } from "@lens-protocol/client";
import truncateMarkdown from "markdown-truncate";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/app/client";
import { SearchParams } from "@/app/types";
import { AppsList } from "@/components/AppsList";
import { twitterHandle } from "@/config";
import { findPublicationApps, findFavoriteApp, AppManifest } from "@/data";
import { formatProfileHandle } from "@/formatters";
import { resolvePlatformType } from "@/utils/device";
import { OGImageDescriptor, mediaToOpenGraphImage } from "@/utils/metadata";
import { resolveAttribution } from "@/utils/request";

import { openWith } from "./actions";
import { redirectTo } from "./redirect";

export type PublicationPageProps = {
  params: {
    id: string;
  };
  searchParams: SearchParams;
};

export default async function PublicationPage({ params, searchParams }: PublicationPageProps) {
  const platform = resolvePlatformType();
  const publication = await client.publication.fetch({ forId: params.id });

  const favoriteApp = await findFavoriteApp({ platform });

  if (favoriteApp) {
    redirectTo(favoriteApp, params.id);
  }

  if (!publication) notFound();

  const attribution = await resolveAttribution(searchParams);

  const options = await findPublicationApps({
    publication,
    platform,
    priorityTo: attribution?.appId,
  });

  return (
    <form action={openWith}>
      <input type="hidden" name="publicationId" value={publication.id} />

      <AppsList attribution={attribution} options={options} />
    </form>
  );
}

function resolveMetadata(publication: AnyPublicationFragment): PublicationMetadataFragment {
  if (publication.__typename === "Mirror") {
    return publication.mirrorOn.metadata;
  }
  return publication.metadata;
}

function formatPageDescription(metadata: PublicationMetadataFragment) {
  switch (metadata.__typename) {
    case "ArticleMetadataV3":
    case "AudioMetadataV3":
    case "CheckingInMetadataV3":
    case "EmbedMetadataV3":
    case "ImageMetadataV3":
    case "LinkMetadataV3":
    case "LiveStreamMetadataV3":
    case "MintMetadataV3":
    case "SpaceMetadataV3":
    case "StoryMetadataV3":
    case "TextOnlyMetadataV3":
    case "ThreeDMetadataV3":
    case "TransactionMetadataV3":
    case "VideoMetadataV3":
      return truncateMarkdown(metadata.content, {
        limit: 100,
        ellipsis: true,
      });
    case "EventMetadataV3":
      return undefined;
  }
}

function formatPageTitle(publication: AnyPublicationFragment, attribution: AppManifest | null) {
  if (attribution) {
    return `${publication.__typename} by ${formatProfileHandle(publication.by)} on ${
      attribution.name
    }`;
  }
  return `${publication.__typename} by ${formatProfileHandle(publication.by)}`;
}

async function extractImage(
  metadata: PublicationMetadataFragment
): Promise<OGImageDescriptor | null> {
  switch (metadata.__typename) {
    case "AudioMetadataV3":
    case "ImageMetadataV3":
    case "StoryMetadataV3":
    case "VideoMetadataV3":
      return mediaToOpenGraphImage([metadata.asset]); // extract from asset
    case "ArticleMetadataV3":
    case "CheckingInMetadataV3":
    case "EmbedMetadataV3":
    case "EventMetadataV3":
    case "LinkMetadataV3":
    case "LiveStreamMetadataV3":
    case "MintMetadataV3":
    case "SpaceMetadataV3":
    case "ThreeDMetadataV3":
    case "TransactionMetadataV3":
      return mediaToOpenGraphImage(metadata.attachments); // extract from attachments
    case "TextOnlyMetadataV3":
      return null;
  }
}

export async function generateMetadata(
  { params, searchParams }: PublicationPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const publication = await client.publication.fetch({ forId: params.id });

  if (!publication) notFound();

  const attribution = await resolveAttribution(searchParams);

  const metadata = resolveMetadata(publication);

  const title = formatPageTitle(publication, attribution);

  const description = formatPageDescription(metadata);

  const { openGraph } = await parent;
  const siteName = attribution?.name ?? openGraph?.siteName ?? undefined;

  const image = await extractImage(metadata);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/p/${publication.id}`,
      type: "article",
      siteName,
      images: image ?? {
        url: "/illustrations/opengraph-image.png",
        type: "image/png",
      },
    },
    twitter: {
      title,
      description,
      card: image ? "summary_large_image" : "summary",
      site: attribution?.twitter ?? twitterHandle,
      images: image?.url ?? undefined,
    },
  };
}
