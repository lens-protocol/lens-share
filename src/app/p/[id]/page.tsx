import { notFound } from "next/navigation";

import { client } from "@/app/client";
import { AppRadioOption } from "@/app/components/AppRadioOption";
import { resolvePlatformType } from "@/app/device";
import { SelectionMode } from "@/app/types";
import { findPublicationApps, findApp, findFavoriteApp } from "@/data";

import { openWith } from "./actions";
import { redirectTo } from "./redirect";

export type PublicationPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    by?: string;
  };
};

export default async function PublicationPage({ params, searchParams }: PublicationPageProps) {
  const platform = resolvePlatformType();
  const publication = await client.publication.fetch({ publicationId: params.id });

  const favoriteApp = await findFavoriteApp({ platform });

  if (favoriteApp) {
    redirectTo(favoriteApp, params.id);
  }

  if (!publication) notFound();

  const options = await findPublicationApps({
    platform,
    exclude: searchParams.by,
  });

  const attribution = searchParams.by ? await findApp({ appId: searchParams.by, platform }) : null;

  return (
    <div className="fixed inset-0 flex items-end justify-center">
      <form
        action={openWith}
        className="bg-white dark:bg-slate-800 rounded-t-lg overflow-hidden shadow-lg w-full sm:w-auto"
      >
        <input type="hidden" name="publicationId" value={publication.id} />

        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Open {publication.__typename} by @{publication.profile.handle} with
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

export async function generateMetadata({ params }: PublicationPageProps) {
  const publication = await client.publication.fetch({ publicationId: params.id });

  if (!publication) notFound();

  return {
    title: `${publication.__typename} by @${publication.profile.handle}`,
  };
}
