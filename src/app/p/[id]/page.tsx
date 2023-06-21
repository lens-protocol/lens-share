import { MediaSetFragment, MetadataFragment, PublicationFragment } from "@lens-protocol/client";
import truncateMarkdown from "markdown-truncate";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/app/client";
import { resolvePlatformType } from "@/app/device";
import { SearchParams, SelectionMode } from "@/app/types";
import { AppRadioOption } from "@/components/AppRadioOption";
import { twitterHandle } from "@/config";
import { findPublicationApps, findApp, findFavoriteApp, AppManifest } from "@/data";
import { formatProfileHandle } from "@/formatters";
import { isImageType } from "@/utils/media";
import { OGImageDescriptor, mediaToOpenGraphImage } from "@/utils/metadata";

import { openWith } from "./actions";
import { redirectTo } from "./redirect";

async function resolveAttribution({ by }: SearchParams): Promise<AppManifest | null> {
  const platform = resolvePlatformType();
  return by ? await findApp({ appId: by, platform }) : null;
}

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
    exclude: attribution?.appId,
  });

  return (
    <div className="fixed inset-0 flex items-end justify-center">
      <form
        action={openWith}
        className="bg-darkDandelion rounded-t-lg overflow-hidden shadow-lg w-full sm:w-auto"
      >
        <input type="hidden" name="publicationId" value={publication.id} />

        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">
            {`Open ${publication.__typename} by ${formatProfileHandle(
              publication.profile.handle
            )} with:`}
          </h2>

          {attribution && (
            <>
              <div className="p-2 space-y-2" data-testid="attribution">
                <AppRadioOption app={attribution} />
              </div>
              {options.length > 0 && <p>or use:</p>}
            </>
          )}

          {options.length > 0 && (
            <ul className="space-y-2">
              {options.map((app) => (
                <li key={app.appId} className="flex items-center px-2">
                  <AppRadioOption app={app} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 p-4 flex justify-end gap-4">
          <button
            className="text-gray-800 dark:text-white font-medium uppercase transform"
            name="mode"
            value={SelectionMode.Always}
          >
            Always
          </button>
          <button
            className="text-gray-800 dark:text-white font-medium uppercase transform"
            name="mode"
            value={SelectionMode.JustOnce}
          >
            Just Once
          </button>
        </div>
      </form>
    </div>
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

async function extractImages(metadata: MetadataFragment): Promise<OGImageDescriptor[]> {
  return Promise.all(
    metadata.media
      .filter((media) => isImageMediaSet(media) || isMediaWithCoverImage(media))
      .map(({ original }) => mediaToOpenGraphImage(original))
  );
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

  const images = await extractImages(metadata);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/p/${publication.id}`,
      type: "article",
      siteName,
      images,
    },
    twitter: {
      title,
      description,
      card: images.length ? "summary_large_image" : "summary",
      site: attribution?.twitter ?? twitterHandle,
      images: images.map(({ url }) => ({ url })),
    },
  };
}
