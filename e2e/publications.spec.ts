import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Publication link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ textPost }) => {
      await textPost.open();

      await expect(textPost.options).toHaveText(["Lenster", "Memester"]);
    });
  });
});

test.describe("Given a Video Publication link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should include apps that support video (e.g. Lenstube)", async ({
      videoPost,
    }) => {
      await videoPost.open();

      await expect(videoPost.options).toHaveText(["Lenster", "Lenstube"]);
    });
  });
});

test.describe("Given a Publication link with `by` attribution", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the originating app separate from other options", async ({
      textPost,
    }) => {
      await textPost.openAsSharedBy("orb");

      await expect(textPost.attribution).toHaveText("Orb");
      await expect(textPost.options).toHaveText(["Lenster", "Memester"]);
    });
  });
});

test.describe("Given a Publication link", async () => {
  test.describe("When submitting an app choice with the 'Just once' button", async () => {
    test("Then it should open the publication with the selected app", async ({ textPost }) => {
      await textPost.open();
      const url = await textPost.justOnce("Lenster");

      await expect(url).toMatch(`https://lenster.xyz/posts/${textPost.publicationId}`);
    });
  });

  test.describe("When submitting an app choice with the 'Always' button", async () => {
    test("Then it should use the same app for all future publications", async ({ textPost }) => {
      await textPost.open();
      await textPost.always("Lenster");

      const response = await textPost.open();

      await expect(response?.url()).toMatch(`https://lenster.xyz/posts/${textPost.publicationId}`);
    });
  });
});
