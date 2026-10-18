import brandingData from "../content/branding.json";

/** Site identity: symbol, approved light/dark wordmarks, favicon and bilingual tagline. */
export type Branding = typeof brandingData;

export function getBranding(): Branding {
  return brandingData;
}
