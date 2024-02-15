import { devices } from "@playwright/test";

import { expect, test } from "./fixtures/publications";

test.use(devices["Desktop Chrome"]);

test.describe("Given a Publication link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show relevant app options", async ({ imagePost }) => {
      await imagePost.open();

      await expect(imagePost.options).toHaveText(["Buttrfly", "Hey", "Orna", "Soclly"]);
    });
  });
});

test.describe("Given a Publication link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({ textPost }) => {
      await textPost.open();

      expect(await textPost.extractOpenGraphProperties()).toEqual({
        "og:title": "Post by lens/stani",
        "og:description": "This post will age well.",
        "og:url": expect.stringContaining(`/p/${textPost.publicationId}`),
        "og:site_name": "Lens Share",
        "og:type": "article",
        "og:image": expect.stringContaining("/illustrations/opengraph-image.png"),
        "og:image:type": "image/png",
      });
    });

    test("Then it should include the expected Twitter Card meta tags", async ({ textPost }) => {
      await textPost.open();

      expect(await textPost.extractTwitterMetaTags()).toEqual({
        "twitter:card": "summary",
        "twitter:site": "LensProtocol",
        "twitter:title": "Post by lens/stani",
        "twitter:description": "This post will age well.",
      });
    });
  });

  test.describe("When publication contains images", async () => {
    test("Then it should include the expected Open Graph meta tags", async ({ imagePost }) => {
      await imagePost.open();

      expect(await imagePost.extractOpenGraphProperties()).toMatchObject({
        "og:image": "https://gw.ipfs-lens.dev/ipfs/QmRxDD6oxyWxtTyJoq52C1nUfuWiA5HiseJwksAXPz24BF",
        "og:image:type": "image/jpeg",
      });
    });

    test("Then it should embed Twitter Card meta tags for a so-called `summary_large_image`", async ({
      imagePost,
    }) => {
      await imagePost.open();

      expect(await imagePost.extractTwitterMetaTags()).toMatchObject({
        "twitter:card": "summary_large_image",
        "twitter:image":
          "https://gw.ipfs-lens.dev/ipfs/QmRxDD6oxyWxtTyJoq52C1nUfuWiA5HiseJwksAXPz24BF",
      });
    });
  });

  test.describe("When publication contains a video with cover image", async () => {
    test("Then it should use the video cover as Open Graph image tag", async ({ videoPost }) => {
      await videoPost.open();

      expect(await videoPost.extractOpenGraphProperties()).toMatchObject({
        "og:image":
          "https://gw.ipfs-lens.dev/ipfs/bafybeib7o45x6oesq4ziwdatncakvvwqkp6wvur5b45od4fm6gbcbjmce4",
      });
    });
  });

  test.describe("When the link includes the `by` attribution param", async () => {
    test("Then it should mention the originating app in page `title` and Open Graph `site_name` tag", async ({
      textPost,
    }) => {
      await textPost.openAsSharedBy("Hey");

      expect(await textPost.getTitle()).toContain("Hey");
      expect(await textPost.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Hey",
      });
    });

    test("Then it should mention the originating app in Twitter Card `site` if a Twitter handle is provided in the app manifest", async ({
      textPost,
    }) => {
      await textPost.openAsSharedBy("Hey");

      expect(await textPost.getTitle()).toContain("Hey");
      expect(await textPost.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Hey",
      });
      expect(await textPost.extractTwitterMetaTags()).toMatchObject({
        "twitter:site": "heydotxyz",
      });
    });
  });
});

test.describe("Given a Video Publication link", async () => {
  test.describe("When opening it", async () => {
    test("Then it should include apps capable of handling video publications", async ({
      videoPost,
    }) => {
      await videoPost.open();

      await expect(videoPost.options).toHaveText(["Buttrfly", "Collectz", "Hey", "Soclly", "Tape"]);
    });
  });
});

test.describe("Given a Publication link with `by` attribution param", async () => {
  test.describe("When opening it", async () => {
    test("Then it should show the specified app first", async ({ videoPost }) => {
      await videoPost.openAsSharedBy("tape");

      await expect(videoPost.options).toHaveText(["Tape", "Buttrfly", "Collectz", "Hey", "Soclly"]);
    });
  });

  test.describe("When opening it on a platform not supported by the specified app", async () => {
    test("Then it should show a message an attribution message before offering other options", async ({
      videoPost,
    }) => {
      await videoPost.openAsSharedBy("phaver");

      await expect(videoPost.context).toHaveText("Shared via Phaver.");
    });
  });
});

test.describe("Given an opened Publication link", async () => {
  test.describe("When submitting an app choice", async () => {
    test("Then it should open the publication with the selected app", async ({ textPost }) => {
      await textPost.open();
      const url = await textPost.justOnce("Hey");

      await expect(url).toMatch(`https://hey.xyz/posts/${textPost.publicationId}`);
    });
  });

  test.describe("When submitting an app choice with 'Remember' checkbox selected", async () => {
    test("Then it should use the same app for all future publications", async ({ textPost }) => {
      await textPost.open();
      await textPost.remember("Hey");

      const response = await textPost.open();

      await expect(response?.url()).toMatch(`https://hey.xyz/posts/${textPost.publicationId}`);
    });
  });
});
