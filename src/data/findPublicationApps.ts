import { PublicationFragment, PublicationMainFocus } from "@lens-protocol/client";
import { Overwrite } from "@lens-protocol/shared-kernel";

import { AppId, PlatformType, RouteKind } from "@/app/types";

import { AppManifest } from "./AppManifestSchema";
import { byMobilePlatformFirst } from "./comparators";
import { fetchAllApps } from "./storage";

type WithPublicationRoute<T extends AppManifest> = Overwrite<
  T,
  {
    routes: Overwrite<
      T["routes"],
      {
        [RouteKind.Publication]: NonNullable<T["routes"][RouteKind.Publication]>;
      }
    >;
  }
>;

function supportsPublicationRoute(app: AppManifest): app is WithPublicationRoute<AppManifest> {
  return app.routes?.[RouteKind.Publication] !== undefined;
}

function resolvePublicationMainContentFocus(
  publication: PublicationFragment
): PublicationMainFocus {
  if (publication.__typename === "Mirror") {
    return publication.mirrorOf.metadata.mainContentFocus;
  }
  return publication.metadata.mainContentFocus;
}

type FetchRelevantAppsRequest = {
  publication: PublicationFragment;
  exclude?: AppId;
};

async function fetchRelevantApps(request: FetchRelevantAppsRequest): Promise<Array<AppManifest>> {
  const apps = await fetchAllApps();

  const mainContentFocus = resolvePublicationMainContentFocus(request.publication);

  return apps.filter(
    (app) =>
      app.appId !== request.exclude &&
      supportsPublicationRoute(app) &&
      app.routes.publication.supports.includes(mainContentFocus)
  );
}

export type FindPublicationAppsRequest = {
  platform: PlatformType;
  publication: PublicationFragment;
  exclude?: AppId;
};

export async function findPublicationApps(
  request: FindPublicationAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchRelevantApps(request);

  if (request.platform === PlatformType.Web) {
    return apps.filter((app) => app.platform === PlatformType.Web);
  }

  return apps.sort(byMobilePlatformFirst);
}
