import { AppManifest } from "./AppManifestSchema";
import { fetchAllApps } from "./fetchAllApps";

export async function findAppById(id: string): Promise<AppManifest | null> {
  const apps = await fetchAllApps();

  return apps.find((app) => app.appId === id) ?? null;
}
