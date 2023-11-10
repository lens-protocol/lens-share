/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  NftImageFragment,
  ProfileCoverSetFragment,
  ProfileFragment,
  ProfilePictureSetFragment,
} from "@lens-protocol/client";
import { assertError } from "@lens-protocol/shared-kernel";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/server";

import { client } from "@/app/client";
import { gintoNordMediumData } from "@/app/fonts";
import { formatProfileHandle } from "@/formatters";
import { getFullHandle } from "@/utils/handle";
import { resolveMediaUrl } from "@/utils/media";

export type ImageProps = {
  params: {
    namespace: string;
    localname: string;
  };
};

type ProfileMetadataPicture = ProfilePictureSetFragment | NftImageFragment | null;

function resolveProfileMetadataPicture(media: ProfileMetadataPicture) {
  if (media === null) {
    return null;
  }

  if (media.__typename === "NftImage") {
    return resolveMediaUrl(resolveProfilePictureSet(media.image));
  }

  return resolveMediaUrl(resolveProfilePictureSet(media));
}

function resolveProfileMetadataCover(media: ProfileCoverSetFragment | null) {
  if (media === null) {
    return null;
  }

  return resolveMediaUrl(resolveProfilePictureSet(media));
}

function resolveProfilePictureSet(imageSet: ProfilePictureSetFragment | ProfileCoverSetFragment) {
  return imageSet.optimized?.uri ?? imageSet.raw.uri;
}

function resolveCoverImage(profile: ProfileFragment) {
  return resolveProfileMetadataCover(profile.metadata?.coverPicture || null);
}

function resolveProfileImage(profile: ProfileFragment) {
  return resolveProfileMetadataPicture(profile.metadata?.picture || null);
}

export default async function Image({ params }: ImageProps) {
  const fullHandle = getFullHandle(params.namespace, params.localname);
  const profile = await client.profile.fetch({ forHandle: fullHandle });

  if (!profile) notFound();

  const cover = resolveCoverImage(profile);
  const picture = resolveProfileImage(profile);

  try {
    return new ImageResponse(
      (
        <div tw="flex w-full h-full flex-col justify-stretch bg-stone-700 items-stretch">
          <div tw="flex-3 flex flex-row bg-yellow-100 justify-stretch overflow-hidden">
            {cover && <img src={cover} tw="flex object-cover h-full w-full" />}
          </div>
          <div tw="flex-2 flex flex-col justify-center relative px-10">
            <div
              tw="flex absolute right-10 top-0 h-[300px] w-[300px] bg-stone-700 rounded-full p-3"
              style={{ transform: "translateY(-50%)" }}
            >
              <div tw="flex flex-row justify-center w-full h-full bg-yellow-100 rounded-full ">
                {picture && <img src={picture} tw="object-contain h-full rounded-full" />}
              </div>
            </div>
            <p tw="flex leading-none text-stone-400 text-[32px] font-normal align-middle">
              {formatProfileHandle(profile)}
            </p>
            {profile.metadata?.displayName && (
              <p tw="flex leading-none text-white text-[48px] font-bold">
                {profile.metadata?.displayName}
              </p>
            )}
          </div>
        </div>
      ),
      {
        // 2:1 aspect ratio so to work also as image for Twitter Card summary_large_image
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
