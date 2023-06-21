import never from "never";

export const baseUrl = process.env.BASE_URL ?? never("BASE_URL is not defined");

export const manifestsDir = process.env.MANIFESTS_DIR ?? never("MANIFESTS_DIR is not defined");
