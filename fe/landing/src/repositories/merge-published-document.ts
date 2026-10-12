/** Keep new route metadata reachable while older CMS snapshots are in use.
 * Shared by the runtime refresh and the build-time content download.
 */
export function mergePublishedDocument(
  key: string,
  baseline: any,
  incoming: any,
): any {
  if (key === "navigation" && Array.isArray(incoming.items)) {
    const courseLink = baseline.items?.find(
      (item: any) => item.href === "/courses",
    );
    if (
      courseLink &&
      !incoming.items.some((item: any) => item.href === "/courses")
    ) {
      const products = incoming.items.find(
        (item: any) => item.href === "/products",
      );
      return {
        ...incoming,
        items: [
          ...incoming.items,
          { ...courseLink, order: (products?.order ?? 1) + 0.5 },
        ],
      };
    }
  }
  if (key === "seo") {
    return { ...incoming, pages: { ...baseline.pages, ...incoming.pages } };
  }
  return incoming;
}
