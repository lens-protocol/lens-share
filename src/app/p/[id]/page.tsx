import { MediaSetFragment, MetadataFragment, PublicationFragment } from "@lens-protocol/client";
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
import { isImageType } from "@/utils/media";
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
  const publication = await client.publication.fetch({ publicationId: params.id });

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

function resolveMetadata(publication: PublicationFragment): MetadataFragment {
  if (publication.__typename === "Mirror") {
    return publication.mirrorOf.metadata;
  }
  return publication.metadata;
}

function formatPageDescription(metadata: MetadataFragment) {
  return metadata.content
    ? truncateMarkdown(metadata.content, {
        limit: 100,
        ellipsis: true,
      })
    : undefined;
}

function formatPageTitle(publication: PublicationFragment, attribution: AppManifest | null) {
  if (attribution) {
    return `${publication.__typename} by ${formatProfileHandle(publication.profile.handle)} on ${
      attribution.name
    }`;
  }
  return `${publication.__typename} by ${formatProfileHandle(publication.profile.handle)}`;
}

function isImageMediaSet(media: MediaSetFragment) {
  return media.original.mimeType && isImageType(media.original.mimeType);
}

function isMediaWithCoverImage(media: MediaSetFragment) {
  return media.original.cover !== null;
}

async function extractImage(metadata: MetadataFragment): Promise<OGImageDescriptor | null> {
  const media = metadata.media.find(
    (media) => isImageMediaSet(media) || isMediaWithCoverImage(media)
  );

  if (!media) return null;

  return mediaToOpenGraphImage(media.original);
}

export async function generateMetadata(
  { params, searchParams }: PublicationPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const publication = await client.publication.fetch({ publicationId: params.id });

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
