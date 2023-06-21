import { redirect } from "next/navigation";

import { AppManifest } from "@/data";

function createRedirectUrl(app: AppManifest, publicationId: string) {
  return app.routes.publication?.url.replace(":id", publicationId) ?? app.routes.home;
}

export function redirectTo(app: AppManifest, publicationId: string): never {
  const url = createRedirectUrl(app, publicationId);

  redirect(url);
}
