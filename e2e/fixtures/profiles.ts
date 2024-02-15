import { test as base, expect } from "@playwright/test";

import { ProfilePage } from "./ProfilePage";

export const test = base.extend<{
  lensProfile: ProfilePage;
  anyProfile: ProfilePage;
}>({
  lensProfile: async ({ page }, use) => {
    const profile = new ProfilePage(page, "lens/lens");
    await use(profile);
  },
  anyProfile: async ({ page }, use) => {
    const profile = new ProfilePage(page, "lens/stani");
    await use(profile);
  },
});

export { expect };
