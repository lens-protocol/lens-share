import { test as base, expect } from "@playwright/test";

import { ProfilePage } from "./ProfilePage";

export const test = base.extend<{
  v1Profile: ProfilePage;
  v1ProfileWithSuffix: ProfilePage;
  v2Profile: ProfilePage;
}>({
  v1Profile: async ({ page }, use) => {
    const profile = new ProfilePage(page, "lensprotocol");
    await use(profile);
  },
  v1ProfileWithSuffix: async ({ page }, use) => {
    const profile = new ProfilePage(page, "lensprotocol.lens");
    await use(profile);
  },
  v2Profile: async ({ page }, use) => {
    const profile = new ProfilePage(page, "lens/lensprotocol");
    await use(profile);
  },
});

export { expect };
