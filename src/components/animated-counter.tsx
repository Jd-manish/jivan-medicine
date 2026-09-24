"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated counter that counts from 0 to `end` when scrolled into view.
 * Uses IntersectionObserver for performance — no scroll listeners.
 *
 * Props:
 *  - end: target number
 *  - duration: animation duration in ms (default 2000)
 *  - prefix: string before number (e.g. "$")
 *  - suffix: string after number (e.g. "%", "×")
 *  - decimals: decimal places (default 0)
 *  - className: additional classes
 */
export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(0, end, duration);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  function animateCount(start: number, target: number, ms: number) {
    const startTime = performance.now();
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ms, 1);
      const eased = easeOutExpo(progress);
      setCurrent(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

/**
 * Animated counter specifically for dollar amounts.
 * Shows "$" prefix, 0 decimals, with comma formatting.
 */
export function DollarCounter({
  end,
  duration = 2000,
  className = "",
}: {
  end: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      end={end}
      duration={duration}
      prefix="$"
      className={className}
    />
  );
}

/**
 * Animated percentage counter.
 * Shows "%" suffix with 1 decimal place.
 */
export function PercentCounter({
  end,
  duration = 2000,
  className = "",
}: {
  end: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      end={end}
      duration={duration}
      suffix="%"
      decimals={1}
      className={className}
    />
  );
}