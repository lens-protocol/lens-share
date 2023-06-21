import { test as base, expect } from "@playwright/test";

import { ProfilePage } from "./ProfilePage";

export const test = base.extend<{
  anyProfile: ProfilePage;
}>({
  anyProfile: async ({ page }, use) => {
    const publication = new ProfilePage(page, "lensprotocol");
    await use(publication);
  },
});

export { expect };
