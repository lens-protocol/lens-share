const V1_SUFFIX = ".lens";

export function hasV1Suffix(handle: string): boolean {
  return handle.endsWith(V1_SUFFIX);
}

export function removeV1Suffix(handle: string): string {
  if (hasV1Suffix(handle)) {
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
