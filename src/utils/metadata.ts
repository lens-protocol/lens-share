import {
  EncryptableImageSetFragment,
  PublicationMetadataMainFocusType,
  PublicationMetadataFragment,
  PublicationMetadataMediaFragment,
} from "@lens-protocol/client";

import { isImageType, resolveMediaUrl } from "./media";

export type OGImageDescriptor = {
  url: string;
  alt?: string;
  type?: string;
};

function resolveImage(image: EncryptableImageSetFragment) {
  return image.optimized ?? image.raw;
}

export function mediaToOpenGraphImage(
  mediaArray: PublicationMetadataMediaFragment[] | null
): OGImageDescriptor | null {
  if (!mediaArray || mediaArray.length === 0) return null;

  // filter for media with images
  const imageMediaArray = mediaArray.filter((media) => {
    switch (media.__typename) {
      case "PublicationMetadataMediaImage":
        return !!media.image;
      case "PublicationMetadataMediaAudio":
        return !!media.cover;
      case "PublicationMetadataMediaVideo":
        return !!media.cover;
    }
  });

  if (imageMediaArray.length === 0) return null;

  const firstImageMedia = imageMediaArray.pop()!;

  switch (firstImageMedia.__typename) {
    case "PublicationMetadataMediaImage":
      const i1 = resolveImage(firstImageMedia.image);
      return {
        url: resolveMediaUrl(i1.uri),
        alt: firstImageMedia.altTag ?? undefined,
        type: i1.mimeType && isImageType(i1.mimeType) ? i1.mimeType : undefined,
      };
    case "PublicationMetadataMediaAudio":
      const i2 = resolveImage(firstImageMedia.cover!);
      return {
        url: resolveMediaUrl(i2.uri),
        alt: undefined,
        type: i2.mimeType && isImageType(i2.mimeType) ? i2.mimeType : undefined,
      };
    case "PublicationMetadataMediaVideo":
      const i3 = resolveImage(firstImageMedia.cover!);
      return {
        url: resolveMediaUrl(i3.uri),
        alt: firstImageMedia.altTag ?? undefined,
        type: i3.mimeType && isImageType(i3.mimeType) ? i3.mimeType : undefined,
      };
  }
}

export function publicationMetadataToMainFocusType(
  metadata: PublicationMetadataFragment
): PublicationMetadataMainFocusType {
  switch (metadata.__typename) {
    case "ArticleMetadataV3":
      return PublicationMetadataMainFocusType.Article;
    case "AudioMetadataV3":
      return PublicationMetadataMainFocusType.Audio;
    case "CheckingInMetadataV3":
      return PublicationMetadataMainFocusType.CheckingIn;
    case "EmbedMetadataV3":
      return PublicationMetadataMainFocusType.Embed;
    case "EventMetadataV3":
      return PublicationMetadataMainFocusType.Event;
    case "ImageMetadataV3":
      return PublicationMetadataMainFocusType.Image;
    case "LinkMetadataV3":
      return PublicationMetadataMainFocusType.Link;
    case "LiveStreamMetadataV3":
      return PublicationMetadataMainFocusType.Livestream;
    case "MintMetadataV3":
      return PublicationMetadataMainFocusType.Mint;
    case "SpaceMetadataV3":
      return PublicationMetadataMainFocusType.Space;
    case "StoryMetadataV3":
      return PublicationMetadataMainFocusType.Story;
    case "TextOnlyMetadataV3":
      return PublicationMetadataMainFocusType.TextOnly;
    case "ThreeDMetadataV3":
      return PublicationMetadataMainFocusType.ThreeD;
    case "TransactionMetadataV3":
      return PublicationMetadataMainFocusType.Transaction;
    case "VideoMetadataV3":
      return PublicationMetadataMainFocusType.Video;
  }
}
