import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/profiles";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Profile link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ anyProfile }) => {
      await anyProfile.open();

      await expect(anyProfile.options).toHaveText([
        "LensFrens",
        "Lenster",
        "Lenstube",
        "Memester",
        "Riff",
      ]);
    });
  });
});

test.describe("Given a Publication link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({ anyProfile }) => {
      await anyProfile.open();

      expect(await anyProfile.extractOpenGraphProperties()).toMatchObject({
        "og:title": `@${anyProfile.handle} profile`,
        "og:description": "The Social Layer of Web3 🌿",
        "og:url": expect.stringContaining(`/u/${anyProfile.handle}`),
        "og:site_name": "Lens Share",
        "og:type": "profile",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({ anyProfile }) => {
      await anyProfile.open();

      expect(await anyProfile.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary_large_image",
        "twitter:site": "LensProtocol",
        "twitter:title": `@${anyProfile.handle} profile`,
        "twitter:description": "The Social Layer of Web3 🌿",
        "twitter:image": expect.any(String),
        "twitter:image:type": "image/png",
      });
    });
  });

  test.describe("When the link includes the `by` attribution param", async () => {
    test("Then it should mention the originating app in page `title` and Open Graph `site_name` tag", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("lenster");

      expect(await anyProfile.getTitle()).toContain("Lenster");
      expect(await anyProfile.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Lenster",
      });
    });

    test("Then it should mention the originating app in Twitter Card `site` if a Twitter handle is provided in the app manifest", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("lenster");

      expect(await anyProfile.getTitle()).toContain("Lenster");
      expect(await anyProfile.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Lenster",
      });
      expect(await anyProfile.extractTwitterMetaTags()).toMatchObject({
        "twitter:site": "lensterxyz",
      });
    });
  });
});

test.describe("Given a Profile link with `by` attribution param", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the specified app first", async ({ anyProfile }) => {
      await anyProfile.openAsSharedBy("lenster");

      await expect(anyProfile.options).toHaveText([
        "Lenster",
        "LensFrens",
        "Lenstube",
        "Memester",
        "Riff",
      ]);
    });
  });

  test.describe("When opening it on a platform not supported by the specified app", async () => {
    test("Then it should show a message an attribution message before offering other options", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("orb");

      await expect(anyProfile.context).toHaveText("Shared via Orb, mobile-only app.");
    });
  });
});

test.describe("Given an opened Profile link", async () => {
  test.describe("When submitting an app choice", async () => {
    test("Then it should open the publication with the selected app", async ({ anyProfile }) => {
      await anyProfile.open();
      const url = await anyProfile.justOnce("Lenster");

      await expect(url).toMatch(`https://lenster.xyz/u/${anyProfile.handle}`);
    });
  });

  test.describe("When submitting an app choice with 'Remember' checkbox selected", async () => {
    test("Then it should use the same app for all future publications", async ({ anyProfile }) => {
      await anyProfile.open();
      await anyProfile.remember("Lenster");

      const response = await anyProfile.open();

      await expect(response?.url()).toMatch(`https://lenster.xyz/u/${anyProfile.handle}`);
    });
  });
});
