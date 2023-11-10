import { ProfileFragment } from "@lens-protocol/client";

export function formatProfileHandle(profile: ProfileFragment) {
  return profile.handle ? profile.handle.fullHandle : profile.id;
}
