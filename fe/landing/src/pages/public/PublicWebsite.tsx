import { ProcessSection } from "@/components/public/ProcessSection";
import { RevealSection } from "@/components/public/RevealSection";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { pathToSectionId, SECTION_SLUGS, localizedPath, pathLang } from "@/lib/sections";
import { resolveSeo, useHeadTags, type Lang } from "@/lib/seo";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HeroSection } from "@/components/public/HeroSection";
import { ProductsSection } from "@/components/public/ProductsSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { AboutSection } from "@/components/public/AboutSection";
import { PhilosophySection } from "@/components/public/PhilosophySection";
import { CaseStudiesSection } from "@/components/public/CaseStudiesSection";
import { ContactFaqSection } from "@/components/public/ContactFaqSection";
import { FooterSection } from "@/components/public/FooterSection";

export function PublicWebsite() {
  const [location, navigate] = useLocation();
  useTranslation(); // re-render on language change
  const lang = pathLang(location) as Lang;
  const locationRef = useRef(location);
  locationRef.current = location;

  // Keep tab title + meta in sync with the active section path and language.
  useHeadTags(resolveSeo(location, lang), lang);
  // When true, the next location-change is from scroll-spy, so don't re-scroll.
  const suppressScrollRef = useRef(false);
  // Ignore scroll-spy until this timestamp (while a programmatic scroll animates).
  const programmaticUntilRef = useRef(0);

  // Scroll to the section that matches the current path whenever it changes.
  // Handles nav clicks, hero CTAs, deep links, and browser back/forward.
  useEffect(() => {
    if (suppressScrollRef.current) {
      suppressScrollRef.current = false;
      return;
    }
    const id = pathToSectionId(location);
    programmaticUntilRef.current = Date.now() + 800; // pause scroll-spy during the animation
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      return;
    }
    // Defer to ensure the target section is in the DOM before scrolling.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [location]);

  // Track the section at the viewport centre. Geometry also handles short
  // sections, gaps between reveal wrappers, and large scroll jumps reliably.
  useEffect(() => {
    const sections = ["hero", ...SECTION_SLUGS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (disposed) return;
      // Recheck after a navigation scroll settles even if no new scroll event
      // arrives. Otherwise its final section can remain untracked.
      if (Date.now() < programmaticUntilRef.current) {
        frame = requestAnimationFrame(update);
        return;
      }
      const probe = Math.max(65, window.innerHeight / 2);
      let active = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) active = section;
        else break;
      }
      if (!active) return;
      const path = active.id === "hero"
        ? localizedPath(lang)
        : localizedPath(lang, active.id);
      if (path !== locationRef.current) {
        suppressScrollRef.current = true;
        navigate(path, { replace: true });
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [navigate, lang]);

  return (
    <div className="min-h-screen" data-testid="public-website">
      <PublicNavbar />
      {/* Wrapper animated on language switch (navbar stays outside so its
          fixed positioning isn't affected by the transform). */}
      <div id="page-content">
        <RevealSection><HeroSection /></RevealSection>
        <RevealSection><ProductsSection /></RevealSection>
        <RevealSection><ServicesSection /></RevealSection>
        <RevealSection><ProcessSection /></RevealSection>
        <RevealSection><AboutSection /></RevealSection>
        <RevealSection><PhilosophySection /></RevealSection>
        <RevealSection><CaseStudiesSection /></RevealSection>
        <RevealSection><ContactFaqSection /></RevealSection>
        <RevealSection><FooterSection /></RevealSection>
      </div>
    </div>
  );
}
