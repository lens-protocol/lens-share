import { Locator, Page } from "@playwright/test";
export class PublicationPage {
  readonly options: Locator;
  readonly attribution: Locator;

  constructor(private readonly page: Page, private readonly publicationId: string) {
    this.options = page.locator("ul > li > label");
    this.attribution = page.getByTestId("attribution");
  }

  async open() {
    await this.page.goto(`/p/${this.publicationId}`);
  }

  async openAsSharedBy(appId: string) {
    await this.page.goto(`/p/${this.publicationId}?by=${appId}`);
  }
}
