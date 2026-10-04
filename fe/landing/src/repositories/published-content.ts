import i18n from "../lib/i18n";
import { initBrand } from "../lib/brand-theme";
// These are the same module objects used by the typed entity repositories.
// Keep bundled documents for immediate rendering; refresh in the background.
const bundled = import.meta.glob("../content/*.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;
const documents = Object.fromEntries(
  Object.entries(bundled).map(([path, data]) => [
    path.split("/").pop()!.replace(".json", ""),
    data,
  ]),
);
const baseline = structuredClone(documents);
const url = `${(import.meta.env.VITE_CDN_URL || "https://cdn.pacific-code-labs.jcampos.dev").replace(/\/$/, "")}/published/landing.json`;
let current = "";
function apply(snapshot: any): boolean {
  if (
    !snapshot ||
    typeof snapshot.content !== "object" ||
    !snapshot.translations
  )
    return false;
  const serialized = JSON.stringify(snapshot);
  if (current === serialized) return false;
  for (const [key, target] of Object.entries(documents)) {
    const incoming = snapshot.content[key];
    if (
      incoming === undefined ||
      Array.isArray(target) !== Array.isArray(incoming) ||
      !incoming ||
      typeof incoming !== "object"
    )
      continue;
    if (Array.isArray(target)) target.splice(0, target.length, ...incoming);
    else {
      for (const k of Object.keys(target)) delete target[k];
      Object.assign(target, baseline[key], incoming);
    }
  }
  for (const language of ["en", "es"])
    if (snapshot.translations[language])
      i18n.addResourceBundle(
        language,
        "translation",
        snapshot.translations[language],
        true,
        true,
      );
  current = serialized;
  initBrand();
  return true;
}
export function startPublishedContent(onUpdate: () => void): () => void {
  try {
    const cached = localStorage.getItem("pcl-published");
    if (cached) apply(JSON.parse(cached));
  } catch {
    /* bundled fallback */
  }
  const controller = new AbortController();
  async function refresh() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return;
      const snapshot = await res.json();
      if (apply(snapshot)) {
        try {
          localStorage.setItem("pcl-published", JSON.stringify(snapshot));
        } catch {}
        onUpdate();
      }
    } catch {
      /* Keep the last valid/bundled content during outages. */
    }
  }
  void refresh();
  const timer = window.setInterval(refresh, 60000);
  return () => {
    controller.abort();
    clearInterval(timer);
  };
}
