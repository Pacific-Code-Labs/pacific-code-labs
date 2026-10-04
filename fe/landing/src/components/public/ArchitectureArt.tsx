import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
export function ArchitectureArt({ kind = "software" }: { kind?: string }) {
  const ref = useRef<SVGSVGElement>(null),
    visible = useInView(ref, { amount: 0.2 }),
    reduced = useReducedMotion(),
    active = visible && !reduced;
  const branches: Record<string, number[]> = {
    software: [65, 130, 195],
    ai: [50, 95, 140, 185, 230],
    automation: [70, 140, 210],
    cloud: [60, 120, 180, 240],
    support: [80, 160, 240],
  };
  const nodes = branches[kind] || branches.software;
  return (
    <svg
      ref={ref}
      viewBox="0 0 360 260"
      fill="none"
      aria-hidden="true"
      className="architecture-art"
    >
      <defs>
        <linearGradient
          id={`flow-${kind}`}
          x1="30"
          y1="40"
          x2="330"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--brand-primary)" />
          <stop offset="1" stopColor="var(--brand-accent)" />
        </linearGradient>
      </defs>
      {[45, 90, 135, 180, 225].map((y) => (
        <path key={y} d={`M20 ${y}H340`} stroke="currentColor" opacity=".04" />
      ))}
      <motion.rect
        x="24"
        y="90"
        width="64"
        height="80"
        rx="16"
        stroke="var(--brand-primary)"
        fill="var(--brand-primary)"
        fillOpacity=".05"
        animate={{ y: active ? [0, -4, 0] : 0 }}
        transition={{ duration: 6, repeat: active ? Infinity : 0 }}
      />
      <path
        d="m44 120-10 10 10 10m24-20 10 10-10 10m-10-16-4 32"
        stroke="var(--brand-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {nodes.map((y, i) => (
        <g key={y}>
          <motion.path
            d={`M88 130 C140 130 130 ${y} 196 ${y} H258`}
            stroke={`url(#flow-${kind})`}
            strokeWidth="1.5"
            animate={{
              pathLength: active ? [0.25, 1, 1] : 1,
              opacity: active ? [0.35, 0.8, 0.35] : 0.7,
            }}
            transition={{
              duration: 5,
              delay: i * 0.3,
              repeat: active ? Infinity : 0,
            }}
          />
          <motion.rect
            x="258"
            y={y - 19}
            width="76"
            height="38"
            rx="9"
            stroke="var(--brand-accent)"
            fill="var(--brand-accent)"
            fillOpacity=".05"
            animate={{ opacity: active ? [0.4, 1, 0.4] : 1 }}
            transition={{
              duration: 5,
              delay: i * 0.3,
              repeat: active ? Infinity : 0,
            }}
          />
          <path
            d={`M276 ${y}h40`}
            stroke="var(--brand-accent)"
            strokeLinecap="round"
            strokeWidth="3"
            opacity=".4"
          />
        </g>
      ))}
      <motion.circle
        cx="175"
        cy="130"
        r="7"
        fill="var(--brand-primary)"
        animate={{ r: active ? [5, 8, 5] : 7 }}
        transition={{ duration: 4, repeat: active ? Infinity : 0 }}
      />
    </svg>
  );
}
