import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/profiles";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Profile link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ v1Profile }) => {
      await v1Profile.open();

      await expect(v1Profile.options).toHaveText([
        "Buttrfly",
        "Collectz",
        "Hey",
        "LensFrens",
        "Lensta",
        "Riff",
        "Soclly",
        "Tape",
      ]);
    });
  });
});

test.describe("Given a v1 Profile link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({ v1Profile }) => {
      await v1Profile.open();

      expect(await v1Profile.extractOpenGraphProperties()).toMatchObject({
        "og:title": `lens/${v1Profile.handle} profile`,
        "og:description": "The Social Layer for Web3 🌿",
        "og:url": expect.stringContaining(`/u/lens/${v1Profile.handle}`),
        "og:site_name": "Lens Share",
        "og:type": "profile",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({ v1Profile }) => {
      await v1Profile.open();

      expect(await v1Profile.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary_large_image",
        "twitter:site": "LensProtocol",
        "twitter:title": `lens/${v1Profile.handle} profile`,
        "twitter:description": "The Social Layer for Web3 🌿",
        "twitter:image": expect.any(String),
        "twitter:image:type": "image/png",
      });
    });
  });
});

test.describe("Given a v1 Profile link with suffix posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({
      v1ProfileWithSuffix,
    }) => {
      await v1ProfileWithSuffix.open();

      expect(await v1ProfileWithSuffix.extractOpenGraphProperties()).toMatchObject({
        "og:title": `lens/lensprotocol profile`,
        "og:description": "The Social Layer for Web3 🌿",
        "og:url": expect.stringContaining(`/u/lens/lensprotocol`),
        "og:site_name": "Lens Share",
        "og:type": "profile",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({
      v1ProfileWithSuffix,
    }) => {
      await v1ProfileWithSuffix.open();

      expect(await v1ProfileWithSuffix.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary_large_image",
        "twitter:site": "LensProtocol",
        "twitter:title": `lens/lensprotocol profile`,
        "twitter:description": "The Social Layer for Web3 🌿",
        "twitter:image": expect.any(String),
        "twitter:image:type": "image/png",
      });
    });
  });
});

test.describe("Given a v2 Profile link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({ v2Profile }) => {
      await v2Profile.open();

      expect(await v2Profile.extractOpenGraphProperties()).toMatchObject({
        "og:title": `${v2Profile.handle} profile`,
        "og:description": "The Social Layer for Web3 🌿",
        "og:url": expect.stringContaining(`/u/${v2Profile.handle}`),
        "og:site_name": "Lens Share",
        "og:type": "profile",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({ v2Profile }) => {
      await v2Profile.open();

      expect(await v2Profile.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary_large_image",
        "twitter:site": "LensProtocol",
        "twitter:title": `${v2Profile.handle} profile`,
        "twitter:description": "The Social Layer for Web3 🌿",
        "twitter:image": expect.any(String),
        "twitter:image:type": "image/png",
      });
    });
  });
});

test.describe("Given a Profile link posted on a social media website/app", async () => {
  test.describe("When the link includes the `by` attribution param", async () => {
    test("Then it should mention the originating app in page `title` and Open Graph `site_name` tag", async ({
      v1Profile,
    }) => {
      await v1Profile.openAsSharedBy("Hey");

      expect(await v1Profile.getTitle()).toContain("Hey");
      expect(await v1Profile.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Hey",
      });
    });

    test("Then it should mention the originating app in Twitter Card `site` if a Twitter handle is provided in the app manifest", async ({
      v1Profile,
    }) => {
      await v1Profile.openAsSharedBy("Hey");

      expect(await v1Profile.getTitle()).toContain("Hey");
      expect(await v1Profile.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Hey",
      });
      expect(await v1Profile.extractTwitterMetaTags()).toMatchObject({
        "twitter:site": "heydotxyz",
      });
    });
  });
});

test.describe("Given a Profile link with `by` attribution param", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the specified app first", async ({ v1Profile }) => {
      await v1Profile.openAsSharedBy("Hey");

      await expect(v1Profile.options).toHaveText([
        "Hey",
        "Buttrfly",
        "Collectz",
        "LensFrens",
        "Lensta",
        "Riff",
        "Soclly",
        "Tape",
      ]);
    });
  });

  test.describe("When opening it on a platform not supported by the specified app", async () => {
    test("Then it should show a message an attribution message before offering other options", async ({
      v1Profile,
    }) => {
      await v1Profile.openAsSharedBy("orb");

      await expect(v1Profile.context).toHaveText("Shared via Orb mobile app.");
    });
  });
});

test.describe("Given an opened v1 Profile link", async () => {
  test.describe("When submitting an app choice", async () => {
    test("Then it should open the publication with the selected app", async ({ v1Profile }) => {
      await v1Profile.open();
      const url = await v1Profile.justOnce("Hey");

      expect(url).toMatch(`https://hey.xyz/u/lens/${v1Profile.handle}`);
    });
  });

  test.describe("When submitting an app choice with 'Remember' checkbox selected", async () => {
    test("Then it should use the same app for all future publications", async ({ v1Profile }) => {
      await v1Profile.open();
      await v1Profile.remember("Hey");

      const response = await v1Profile.open();

      expect(response?.url()).toMatch(`https://hey.xyz/u/lens/${v1Profile.handle}`);
    });
  });
});

test.describe("Given an opened v2 Profile link", async () => {
  test.describe("When submitting an app choice", async () => {
    test("Then it should open the publication with the selected app", async ({ v2Profile }) => {
      await v2Profile.open();
      const url = await v2Profile.justOnce("Hey");

      expect(url).toMatch(`https://hey.xyz/u/${v2Profile.handle}`);
    });
  });

  test.describe("When submitting an app choice with 'Remember' checkbox selected", async () => {
    test("Then it should use the same app for all future publications", async ({ v2Profile }) => {
      await v2Profile.open();
      await v2Profile.remember("Hey");

      const response = await v2Profile.open();

      expect(response?.url()).toMatch(`https://hey.xyz/u/${v2Profile.handle}`);
    });
  });
});
