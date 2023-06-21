import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly options: Locator;
  readonly attribution: Locator;

  constructor(private readonly page: Page, private readonly path: string) {
    this.options = page.locator("ul > li > label");
    this.attribution = page.getByTestId("attribution");
  }

  async open() {
    return await this.page.goto(this.path);
  }

  async openAsSharedBy(appId: string) {
    await this.page.goto(`${this.path}?by=${appId}`);
  }

  async waitRedirect() {}

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
