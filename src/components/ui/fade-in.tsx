"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = "up", className = "" }: FadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const directions = {
      up: { y: 40, x: 0 },
      down: { y: -40, x: 0 },
      left: { x: 40, y: 0 },
      right: { x: -40, y: 0 },
      none: { x: 0, y: 0 },
    };

    const initial = directions[direction];

    // Set initial state
    gsap.set(containerRef.current, {
      opacity: 0,
      x: initial.x,
      y: initial.y,
    });

    // Create scroll trigger animation
    gsap.to(containerRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.7,
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%", // Trigger when top of element hits 90% of viewport
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, { scope: containerRef, dependencies: [direction, delay] });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
