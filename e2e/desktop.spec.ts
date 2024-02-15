import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["Desktop Chrome"]);

test.describe("Given a desktop browser", async () => {
  test.describe("When opening a Publication link", async () => {
    test("Then it should omit mobile-only apps", async ({ textPost }) => {
      await textPost.open();

      await expect(textPost.options).not.toHaveText(["Phaver"]);
    });
  });
});
