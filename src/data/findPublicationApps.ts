import { AnyPublicationFragment, PublicationMetadataFragment } from "@lens-protocol/client";
import { Overwrite } from "@lens-protocol/shared-kernel";

import { AppId, PlatformType, RouteKind } from "@/app/types";
import { publicationMetadataToMainFocusType } from "@/utils/metadata";

import { AppManifest } from "./AppManifestSchema";
import { byMobilePlatformFirst, withPriorityTo } from "./comparators";
import { dedupe, webOnly } from "./predicates";
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
  publication: AnyPublicationFragment
): PublicationMetadataFragment {
  if (publication.__typename === "Mirror") {
    return publication.mirrorOn.metadata;
  }
  return publication.metadata;
}

type FetchRelevantAppsRequest = {
  publication: AnyPublicationFragment;
};

async function fetchRelevantApps(request: FetchRelevantAppsRequest): Promise<Array<AppManifest>> {
  const apps = await fetchAllApps();

  const mainContentFocus = publicationMetadataToMainFocusType(
    resolvePublicationMainContentFocus(request.publication)
  );

  return apps.filter(
    (app) =>
      supportsPublicationRoute(app) && app.routes.publication.supports.includes(mainContentFocus)
  );
}

export type FindPublicationAppsRequest = {
  platform: PlatformType;
  publication: AnyPublicationFragment;
  priorityTo?: AppId;
};

export async function findPublicationApps(
  request: FindPublicationAppsRequest
): Promise<ReadonlyArray<AppManifest>> {
  const apps = await fetchRelevantApps(request);

  if (request.platform === PlatformType.Web) {
    return apps.filter(webOnly).sort(withPriorityTo(request.priorityTo));
  }

  return apps.sort(byMobilePlatformFirst).filter(dedupe()).sort(withPriorityTo(request.priorityTo));
}
