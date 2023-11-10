const V1_SUFFIX = ".lens";

export function removeV1Suffix(handle: string): string {
  if (handle.endsWith(".lens")) {
    return handle.slice(0, -V1_SUFFIX.length);
  }

  return handle;
}

/**
 * @param namespace - namespace of the handle
 * @param handle - could be v2 localname or v1 handle with suffix
 * @returns namespace and localname
 */
export const getFullHandle = (namespace: string, handle: string): string => {
  const localname = removeV1Suffix(handle);
  return `${namespace}/${localname}`;
};
