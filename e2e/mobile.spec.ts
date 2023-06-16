import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["iPhone 13"]);

test.describe("Given a mobile browser", async () => {
  test.describe("When opening a Publication link", async () => {
    test("Then it should show in order mobile and web apps options", async ({ anyPublication }) => {
      await anyPublication.open();

      await expect(anyPublication.options).toHaveText(["Lenster", "Lenstube", "Memester"]);
    });
  });

  test.describe("When opening a Publication link with `by` attribution", async () => {
    test("Then it should show the originating app separate from other options", async ({
      anyPublication,
    }) => {
      await anyPublication.openAsSharedBy("orb");

      await expect(anyPublication.attribution).toHaveText("Orb");
      await expect(anyPublication.options).toHaveText(["Lenster", "Lenstube", "Memester"]);
    });
  });

  test.describe("And an opened Publications Link", async () => {
    test.describe("When submitting with the 'Just once' button", async () => {
      test("Then it should open the publication with the selected app", async ({
        anyPublication,
      }) => {
        await anyPublication.open();
        const url = await anyPublication.justOnce("Lenster");

        await expect(url).toMatch(`https://lenster.xyz/posts/${anyPublication.publicationId}`);
      });
    });

    test.describe("When submitting with the 'Always' button", async () => {
      test("Then it should use the same app for all future publications", async ({
        anyPublication,
      }) => {
        await anyPublication.open();
        await anyPublication.always("Lenster");

        const response = await anyPublication.open();

        await expect(response?.url()).toMatch(
          `https://lenster.xyz/posts/${anyPublication.publicationId}`
        );
      });
    });
  });
});
