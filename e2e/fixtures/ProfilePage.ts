import { Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  constructor(page: Page, readonly handle: string) {
    super(page, `/u/${handle}`);
  }
}
