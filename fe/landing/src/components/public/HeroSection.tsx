import { Link } from "wouter";
import { LanguageFlag } from "@pcl/design-system";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { parseRichText } from "@/lib/rich-text";
import { localizedPath } from "@/lib/sections";
import heroData from "@/content/hero.json";
import { ArchitectureArt } from "./ArchitectureArt";
export function HeroSection() {
  const { t, i18n } = useTranslation(),
    lang = i18n.language as "es" | "en";
  const content = heroData.translations[lang] ?? heroData.translations.es;
  return (
    <section id="hero" className="premium-hero" data-testid="hero-section">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span />
            {content.eyebrow}
          </div>
          <h1 data-testid="hero-title">{parseRichText(content.title)}</h1>
          <p data-testid="hero-subtitle">{content.subtitle}</p>
          <div className="hero-actions">
            <Link
              className="hero-primary"
              href={localizedPath(lang, "contact")}
              data-testid="hero-cta-primary"
            >
              {t("hero.cta_secondary")}
              <ArrowUpRight size={18} />
            </Link>
            <Link
              className="hero-secondary"
              href={localizedPath(lang, "products")}
              data-testid="hero-cta-secondary"
            >
              {t("hero.cta_primary")}
              <ArrowDown size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline">
            <span className="visual-dot" />
            <span>{t("hero.visual_label")}</span>
            <span>01 / 03</span>
          </div>
          <ArchitectureArt />
          <div className="visual-bottom">
            <span>{t("hero.visual_input")}</span>
            <span>→</span>
            <span>{t("hero.visual_output")}</span>
          </div>
          <div className="visual-caption">{t("hero.visual_caption")}</div>
        </div>
      </div>
      <div className="hero-proof">
        {content.stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value === "CR" ? <LanguageFlag language="es" /> : s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
