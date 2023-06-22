/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ProfileFragment } from "@lens-protocol/client";
import { assertError } from "@lens-protocol/shared-kernel";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/server";

import { client } from "@/app/client";
import { gintoNordMediumData } from "@/app/fonts";
import { formatProfileHandle } from "@/formatters";
import { resolveMediaUrl } from "@/utils/media";

export type ImageProps = {
  params: {
    handle: string;
  };
};

type ProfileMedia = NonNullable<ProfileFragment["picture"]>;

function resolveProfileMedia(media: ProfileMedia | null) {
  if (media === null) {
    return null;
  }

  if (media.__typename === "NftImage") {
    return resolveMediaUrl(media.uri);
  }

  return resolveMediaUrl(media.original.url);
}

function resolveCoverImage(profile: ProfileFragment) {
  return resolveProfileMedia(profile.coverPicture);
}

function resolveProfileImage(profile: ProfileFragment) {
  return resolveProfileMedia(profile.picture);
}

export default async function Image({ params }: ImageProps) {
  const profile = await client.profile.fetch({ handle: params.handle });

  if (!profile) notFound();

  const cover = resolveCoverImage(profile);
  const picture = resolveProfileImage(profile);

  try {
    return new ImageResponse(
      (
        <div tw="flex w-full h-full flex-col justify-stretch bg-stone-700 items-stretch">
          <div tw="flex-3 flex flex-row bg-white justify-stretch overflow-hidden">
            {cover && <img src={cover} tw="flex object-cover h-full" />}
          </div>
          <div tw="flex-2 flex flex-col justify-center relative px-10">
            <div
              tw="flex absolute right-10 top-0 h-[300px] w-[300px] bg-stone-700 rounded-full p-3"
              style={{ transform: "translateY(-50%)" }}
            >
              {picture && <img src={picture} tw="object-contain h-full rounded-full" />}
            </div>
            <p tw="flex leading-none text-stone-400 text-[32px] font-normal align-middle">
              {formatProfileHandle(profile.handle)}
            </p>
            {profile.name && (
              <p tw="flex leading-none text-white text-[48px] font-bold">{profile.name}</p>
            )}
          </div>
        </div>
      ),
      {
        // 2:1 aspect ratio so to work also as Twitter Card summary_large_image
        width: 800,
        height: 400,
        fonts: [
          {
            name: "Ginto Nord",
            data: gintoNordMediumData,
            style: "normal",
            weight: 500,
          },
        ],
      }
    );
  } catch (e) {
    assertError(e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
