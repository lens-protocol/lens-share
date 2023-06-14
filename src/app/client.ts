import { production, LensClient } from "@lens-protocol/client";

export const client = new LensClient({
  environment: production,
});
