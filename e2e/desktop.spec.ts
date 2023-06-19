import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["Desktop Chrome"]);

test.describe("Given a desktop browser", async () => {
  test.describe("When opening a Publication link", async () => {
    test("Then it should show relevant web apps options", async ({ anyPublication }) => {
      await anyPublication.open();

      await expect(anyPublication.options).toHaveText(["Lenster", "Lenstube", "Memester"]);
    });
  });

  test.describe("When opening a Publication link with `by` attribution", async () => {
    test("Then it should show the originating app separate from other options", async ({
      anyPublication,
    }) => {
      await anyPublication.openAsSharedBy("lenster");

      await expect(anyPublication.attribution).toHaveText("Lenster");
      await expect(anyPublication.options).toHaveText(["Lenstube", "Memester"]);
    });
  });
});
