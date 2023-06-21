import never from "never";

export const baseUrl =
  process.env.BASE_URL ??
  (process.env.VERCEL_BRANCH_URL
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : never("BASE_URL nor VERCEL_BRANCH_URL are defined"));

export const manifestsDir = process.env.MANIFESTS_DIR ?? never("MANIFESTS_DIR is not defined");

export const twitterHandle = process.env.TWITTER_HANDLE ?? never("TWITTER_HANDLE is not defined");
