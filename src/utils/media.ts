import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the thirdweb IPFS storage
const storage = new ThirdwebStorage();

export function resolveMediaUrl(url: string) {
  if (url.startsWith("ipfs://")) {
    return storage.resolveScheme(url);
  }
  return url;
}

export function isImageType(type: string) {
  return type.startsWith("image/");
}
