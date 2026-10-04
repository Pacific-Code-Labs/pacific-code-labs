import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
export function RevealSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.87, 1],
    [0.15, 1, 1, 0.15],
  );
  return (
    <motion.div
      ref={ref}
      style={{ opacity: reduced ? 1 : opacity }}
      className="reveal-section"
    >
      {children}
    </motion.div>
  );
}
