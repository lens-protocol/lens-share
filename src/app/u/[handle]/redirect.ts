import { redirect } from "next/navigation";

import { AppManifest } from "@/data";

function createRedirectUrl(app: AppManifest, handle: string) {
  return app.routes.profile?.url.replace(":handle", handle) ?? app.routes.home;
}

export function redirectTo(app: AppManifest, handle: string): never {
  const url = createRedirectUrl(app, handle);

  redirect(url);
}
