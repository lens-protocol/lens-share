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

test.describe("Given a Publication link posted on a social media website/app", async () => {
  test.describe("When checking Open Graph meta tags", async () => {
    test("Then it should render the expected base-line meta tags", async ({
      baseURL,
      textPost,
    }) => {
      await textPost.open();

      expect(await textPost.extractOpenGraphProperties()).toEqual({
        "og:title": "Post by @stani.lens",
        "og:description": "This post will age well.",
        "og:url": `${baseURL}/p/${textPost.publicationId}`,
        "og:site_name": "Lens Share",
        "og:type": "article",
      });
    });
  });

  test.describe("When publication contains images", async () => {
    test("Then it should include the expected Open Graph meta tags", async ({ imagePost }) => {
      await imagePost.open();

      expect(await imagePost.extractOpenGraphProperties()).toMatchObject({
        "og:image":
          "https://ipfs-2.thirdwebcdn.com/ipfs/QmZmNNSvLbBBYWhT9KvtYBvD5bcbJL6L7VRyMDZynCzvAL",
        "og:image:type": "image/jpeg",
      });
    });
  });

  test.describe("When publication contains a video with cover image", async () => {
    test("Then it should use the video cover as Open Graph image tag", async ({ videoPost }) => {
      await videoPost.open();

      expect(await videoPost.extractOpenGraphProperties()).toMatchObject({
        "og:image":
          "https://ipfs-2.thirdwebcdn.com/ipfs/bafybeib7o45x6oesq4ziwdatncakvvwqkp6wvur5b45od4fm6gbcbjmce4",
      });
    });
  });

  test.describe("When the link includes the `by` attribution param", async () => {
    test("Then it should use the app used to share as Open Graph site_name tag", async ({
      textPost,
    }) => {
      await textPost.openAsSharedBy("lenster");

      expect(await textPost.extractOpenGraphProperties()).toMatchObject({
        "og:site_name": "Lenster",
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

test.describe("Given an opened Publication link", async () => {
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
