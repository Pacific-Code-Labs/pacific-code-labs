import { getBranding } from "@/repositories/branding.repository";
import { resolveAssetUrl } from "@/lib/media";

interface LogoProps {
  size?: number;
  className?: string;
  showName?: boolean;
  nameClassName?: string;
  /** Force a variant; omit to follow the site's dark class automatically. */
  dark?: boolean;
}

const approvedSymbolRefs = new Set([
  "/brand/logo/pcl_l3_symbol.png",
  "/logo.png",
  "/logo-dark-bg.png",
]);

export function Logo({ size = 32, className = "", showName = false, nameClassName = "", dark }: LogoProps) {
  const branding = getBranding();
  const darkSymbol = branding.logoUrlDark || branding.logoUrl;
  // Existing CMS uploads remain symbol + live name. The approved PCL source
  // and its legacy aliases use the full, frozen wordmark without duplicate text.
  const useWordmark = showName && branding.companyName === "Pacific Code Labs"
    && branding.wordmarkUrl && branding.wordmarkUrlDark
    && approvedSymbolRefs.has(branding.logoUrl) && approvedSymbolRefs.has(darkSymbol);
  const lightSource = useWordmark ? branding.wordmarkUrl : branding.logoUrl;
  const darkSource = useWordmark ? branding.wordmarkUrlDark : darkSymbol;
  const width = useWordmark ? Math.round(size * 525 / 220) : size;
  const image = (ref: string, themeClass = "") => (
    <img
      src={resolveAssetUrl(ref)}
      alt={useWordmark || !showName ? branding.companyName : ""}
      width={width}
      height={size}
      className={`object-contain flex-shrink-0 ${themeClass}`}
      style={{ width, height: size }}
    />
  );
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {dark === undefined && lightSource !== darkSource ? (
        <>
          {image(lightSource, "dark:hidden")}
          {image(darkSource, "hidden dark:block")}
        </>
      ) : image(dark ? darkSource : lightSource)}
      {showName && !useWordmark && (
        <span className={nameClassName || "font-semibold tracking-tight"}>
          {branding.companyName}
        </span>
      )}
    </span>
  );
}
