/** Keep new route metadata reachable while older CMS snapshots are in use.
 * Shared by the runtime refresh and the build-time content download.
 */
export function mergePublishedDocument(
  key: string,
  baseline: any,
  incoming: any,
): any {
  // Keep new identity fields when loading older published documents. Migrate
  // only the known default favicon paths; custom names and uploads still win.
  if (key === "branding") {
    const merged = { ...baseline, ...incoming };
    const legacyFavicons = ["/logo.png", "/logo-dark-bg.png", "/brand/logo/pcl_l3_symbol.png"];
    if (
      merged.companyName === "Pacific Code Labs" &&
      baseline.faviconUrl &&
      legacyFavicons.includes(incoming?.faviconUrl)
    ) {
      merged.faviconUrl = baseline.faviconUrl;
    }
    return merged;
  }
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
    const merged = { ...baseline, ...incoming, pages: { ...baseline.pages, ...incoming?.pages } };
    const legacyImages = ["/opengraph.jpg", "opengraph.jpg", `${baseline.siteUrl?.replace(/\/$/, "")}/opengraph.jpg`];
    if (merged.siteUrl === baseline.siteUrl && legacyImages.includes(incoming?.ogImageUrl)) {
      merged.ogImageUrl = baseline.ogImageUrl;
    }
    return merged;
  }
  return incoming;
}
