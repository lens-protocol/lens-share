import { MediaFragment } from "@lens-protocol/client";

import { isImageType, resolveMediaUrl } from "./media";

export type OGImageDescriptor = {
  url: string;
  alt?: string;
  type?: string;
};

export async function mediaToOpenGraphImage(media: MediaFragment): Promise<OGImageDescriptor> {
  return {
    url: resolveMediaUrl(media.cover ?? media.url),
    alt: media.altTag ?? undefined,
    type: media.mimeType && isImageType(media.mimeType) ? media.mimeType : undefined,
  };
}
