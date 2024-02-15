import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/profiles";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Profile link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ anyProfile }) => {
      await anyProfile.open();

      await expect(anyProfile.options).toHaveText([
        "Buttrfly",
        "Hey",
        "orb",
        "Orna",
        "Riff",
        "Soclly",
        "Tape",
      ]);
    });
  });
});

test.describe("Given a Profile link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({ lensProfile }) => {
      await lensProfile.open();

      expect(await lensProfile.extractOpenGraphProperties()).toMatchObject({
        "og:title": `${lensProfile.handle} profile`,
        "og:description": "onchain social",
        "og:url": expect.stringContaining(`/u/${lensProfile.handle}`),
        "og:site_name": "Lens Share",
        "og:type": "profile",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({ lensProfile }) => {
      await lensProfile.open();

      expect(await lensProfile.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary_large_image",
        "twitter:site": "LensProtocol",
        "twitter:title": `${lensProfile.handle} profile`,
        "twitter:description": "onchain social",
        "twitter:image": expect.any(String),
        "twitter:image:type": "image/png",
      });
    });
  });
});

test.describe("Given a Profile link posted on a social media website/app", async () => {
  test.describe("When the link includes the `by` attribution param", async () => {
    test("Then it should mention the originating app in page `title` and Open Graph `site_name` tag", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("Hey");

      expect(await anyProfile.getTitle()).toContain("Hey");
      expect(await anyProfile.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Hey",
      });
    });

    test("Then it should mention the originating app in Twitter Card `site` if a Twitter handle is provided in the app manifest", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("Hey");

      expect(await anyProfile.extractTwitterMetaTags()).toMatchObject({
        "twitter:site": "heydotxyz",
      });
    });
  });
});

test.describe("Given a Profile link with `by` attribution param", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the specified app first", async ({ anyProfile }) => {
      await anyProfile.openAsSharedBy("Hey");

      await expect(anyProfile.options).toHaveText([
        "Hey",
        "Buttrfly",
        "orb",
        "Orna",
        "Riff",
        "Soclly",
        "Tape",
      ]);
    });
  });

  test.describe("When opening it on a platform not supported by the specified app", async () => {
    test("Then it should show a message an attribution message before offering other options", async ({
      anyProfile,
    }) => {
      await anyProfile.openAsSharedBy("phaver");

      await expect(anyProfile.context).toHaveText("Shared via Phaver.");
    });
  });
});

test.describe("Given an opened v2 Profile link", async () => {
  test.describe("When submitting an app choice", async () => {
    test("Then it should open the publication with the selected app", async ({ anyProfile }) => {
      await anyProfile.open();
      const url = await anyProfile.justOnce("Hey");

      expect(url).toMatch(`https://hey.xyz/u/${anyProfile.handle}`);
    });
  });

  test.describe("When submitting an app choice with 'Remember' checkbox selected", async () => {
    test("Then it should use the same app for all future publications", async ({ anyProfile }) => {
      await anyProfile.open();
      await anyProfile.remember("Hey");

      const response = await anyProfile.open();

      expect(response?.url()).toMatch(`https://hey.xyz/u/${anyProfile.handle}`);
    });
  });
});
