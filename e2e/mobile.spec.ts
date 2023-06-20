import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["iPhone 13"]);

test.describe("Given a mobile browser", async () => {
  test.describe("When opening a Publication link", async () => {
    test("Then it should show in order mobile and web apps options", async ({ anyPublication }) => {
      await anyPublication.open();

      await expect(anyPublication.options).toHaveText([
        "Buttrfly",
        "Orb",
        "Lenster",
        "Lenstube",
        "Memester",
      ]);
    });
  });
});
