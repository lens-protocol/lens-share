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
});
