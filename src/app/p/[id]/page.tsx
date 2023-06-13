import { notFound } from "next/navigation";
import never from "never";

import { client } from "@/app/client";
import { PlatformType } from "@/app/types";
import { openWith } from "@/app/actions";
import { fetchPublicationApps } from "@/data";

export type PublicationPageProps = {
  params: {
    id: string;
  };
};

export default async function PublicationPage({ params }: PublicationPageProps) {
  const apps = await fetchPublicationApps({ platform: PlatformType.Web });

  return (
    <div className="fixed inset-0 flex items-end justify-center">
      <form
        action={openWith}
        className="bg-white dark:bg-slate-800  rounded-t-lg overflow-hidden shadow-lg w-full sm:w-auto"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Open With</h2>
          <ul className="space-y-2">
            {apps.map((app) => (
              <li
                key={app.shortname}
                className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="url"
                    className="mr-2"
                    value={app.mappings.web?.publication?.replace(":id", params.id) ?? never()}
                  />
                  <img className="w-8 h-8 mr-2" src={app.icon} alt={app.name} />
                  <span className="text-gray-800 font-medium  dark:text-white">
                    {app.shortname}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-100 p-4 flex justify-end gap-4">
          <button
            className="text-gray-800 font-medium uppercase transform"
            name="mode"
            value="always"
          >
            Always
          </button>
          <button
            className="text-gray-800 font-medium uppercase transform"
            name="mode"
            value="just-once"
          >
            Just Once
          </button>
        </div>
      </form>
    </div>
  );
}

export async function generateMetadata({ params }: PublicationPageProps) {
  const publication = await client.publication.fetch({ publicationId: params.id });

  if (!publication) notFound();

  return {
    title: `${publication.__typename} by @${publication.profile.handle}`,
  };
}
