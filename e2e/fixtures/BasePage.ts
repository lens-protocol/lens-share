import { Locator, Page } from "@playwright/test";
import never from "never";
import { Metadata } from "next";

export type OpenGraphMetadata = NonNullable<Metadata["openGraph"]>;
export type TwitterCardMetadata = NonNullable<Metadata["twitter"]>;

export abstract class BasePage {
  readonly options: Locator;
  readonly context: Locator;

  constructor(private readonly page: Page, private readonly path: string) {
    this.options = page.locator("ul > li > label");
    this.context = page.getByTestId("context");
  }

  async extractOpenGraphProperties(): Promise<OpenGraphMetadata> {
    const metaTags = await this.page.locator('meta[property^="og:"]').all();

    const pairs = await Promise.all(
      metaTags.map(async (tag) => ({
        property: (await tag.getAttribute("property")) ?? never(),
        content: (await tag.getAttribute("content")) ?? never(),
      }))
    );

    return pairs.reduce((acc, { property, content }) => {
      if (property && content) {
        // @ts-ignore
        acc[property] = content;
      }

      return acc;
    }, {} as OpenGraphMetadata);
  }

  async extractTwitterMetaTags(): Promise<TwitterCardMetadata> {
    const metaTags = await this.page.locator('meta[name^="twitter:"]').all();

    const pairs = await Promise.all(
      metaTags.map(async (tag) => ({
        name: (await tag.getAttribute("name")) ?? never(),
        content: (await tag.getAttribute("content")) ?? never(),
      }))
    );

    return pairs.reduce((acc, { name, content }) => {
      if (name && content) {
        // @ts-ignore
        acc[name] = content;
      }

      return acc;
    }, {} as TwitterCardMetadata);
  }

  async getTitle() {
    return await this.page.title();
  }

  async open() {
    return await this.page.goto(this.path);
  }

  async openAsSharedBy(appId: string) {
    await this.page.goto(`${this.path}?by=${appId}`);
  }

  async justOnce(label: string) {
    await this.page.getByLabel(label).click();
    await this.page.getByRole("button", { name: "Just once" }).click();
    return this.waitForRedirect();
  }

  async always(label: string) {
    await this.page.getByLabel(label).click();
    await this.page.getByRole("button", { name: "Always" }).click();
    return this.waitForRedirect();
  }

  private async waitForRedirect() {
    const currentUrl = await this.page.url();
    await this.page.waitForURL((newUrl) => newUrl.toString() !== currentUrl);
    return this.page.url();
  }
}
