import { notFound } from "next/navigation";

import { client } from "@/app/client";

export type PublicationPageProps = {
  params: {
    id: string;
  };
};

export default async function PublicationPage({ params }: PublicationPageProps) {
  const publication = await client.publication.fetch({ publicationId: params.id });

  if (!publication) return notFound();

  return <main>{JSON.stringify(publication, null, 2)}</main>;
}
