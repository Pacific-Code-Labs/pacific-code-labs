import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resolveIcon } from "@/lib/icons";
import heroData from "@/content/hero.json";
export function ProcessSection() {
  const { t, i18n } = useTranslation(),
    lang = i18n.language as "es" | "en";
  const content = heroData.process;
  const [index, setIndex] = useState(0),
    [direction, setDirection] = useState(1),
    ref = useRef<HTMLDivElement>(null),
    visible = useInView(ref, { amount: 0.3 }),
    reduced = useReducedMotion();
  const safeIndex = Math.min(index, content.steps.length - 1),
    step = content.steps[safeIndex],
    Icon = resolveIcon(step?.iconName || "Code2"),
    active = visible && !reduced;
  if (!step) return null;
  function next(delta: number) {
    setDirection(delta);
    setIndex((v) => Math.max(0, Math.min(content.steps.length - 1, v + delta)));
  }
  return (
    <section className="process-section" id="how">
      <div className="process-inner">
        <span className="hero-eyebrow justify-center">
          {content.eyebrow[lang]}
        </span>
        <h2 className="text-3xl sm:text-4xl mt-5">{content.title[lang]}</h2>
        <div className="process-card" ref={ref}>
          <div className="hero-eyebrow justify-center">
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(content.steps.length).padStart(2, "0")}
          </div>
          <div className="process-stage">
            <button
              disabled={safeIndex === 0}
              aria-label={t("common.previous")}
              aria-controls="process-detail"
              onClick={() => next(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="process-center">
              <svg
                className="process-rings"
                viewBox="0 0 220 180"
                fill="none"
                aria-hidden="true"
              >
                {[45, 64, 82].map((r, i) => (
                  <motion.circle
                    key={r}
                    cx="110"
                    cy="90"
                    r={r}
                    stroke="currentColor"
                    strokeOpacity={0.14 - i * 0.03}
                    animate={{ r: active ? [r, r + 4, r] : r }}
                    transition={{
                      duration: 6,
                      delay: i * 0.25,
                      repeat: active ? Infinity : 0,
                    }}
                  />
                ))}
              </svg>
              <Icon className="text-primary relative w-10 h-10" />
            </div>
            <button
              disabled={safeIndex === content.steps.length - 1}
              aria-label={t("common.next")}
              aria-controls="process-detail"
              onClick={() => next(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <div
            id="process-detail"
            aria-live="polite"
            className="process-description"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={reduced ? false : { opacity: 0, x: direction * 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -direction * 10 }}
                transition={{ duration: reduced ? 0 : 0.18 }}
              >
                <h3>{step.title[lang]}</h3>
                <p>{step.description[lang]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="process-progress" aria-hidden="true">
            {content.steps.map((s, i) => (
              <span key={s.id} className={i === safeIndex ? "active" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
