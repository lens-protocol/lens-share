import { Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class PublicationPage extends BasePage {
  constructor(page: Page, readonly publicationId: string) {
    super(page, `/p/${publicationId}`);
  }
}
