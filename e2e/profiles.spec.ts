import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/profiles";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Profile link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ anyProfile }) => {
      await anyProfile.open();

      await expect(anyProfile.options).toHaveText([
        "Lens Profile",
        "Lenster",
        "Lenstube",
        "Memester",
      ]);
    });
  });
});

test.describe("Given a Profile link with `by` attribution", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the originating app separate from other options", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("orb");

      await expect(anyProfile.attribution).toHaveText("Orb");
      await expect(anyProfile.options).toHaveText([
        "Lens Profile",
        "Lenster",
        "Lenstube",
        "Memester",
      ]);
    });
  });
});

test.describe("Given a Profile link", async () => {
  test.describe("When submitting an app choice with the 'Just once' button", async () => {
    test("Then it should open the publication with the selected app", async ({ anyProfile }) => {
      await anyProfile.open();
      const url = await anyProfile.justOnce("Lenster");

      await expect(url).toMatch(`https://lenster.xyz/u/${anyProfile.handle}`);
    });
  });

  test.describe("When submitting an app choice with the 'Always' button", async () => {
    test("Then it should use the same app for all future publications", async ({ anyProfile }) => {
      await anyProfile.open();
      await anyProfile.always("Lenster");

      const response = await anyProfile.open();

      await expect(response?.url()).toMatch(`https://lenster.xyz/u/${anyProfile.handle}`);
    });
  });
});
