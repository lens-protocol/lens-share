import { notFound } from "next/navigation";

import { client } from "@/app/client";

export type ProfilePageProps = {
  params: {
    handle: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await client.profile.fetch({ handle: params.handle });

  if (!profile) return notFound();

  return <main>{JSON.stringify(profile, null, 2)}</main>;
}
