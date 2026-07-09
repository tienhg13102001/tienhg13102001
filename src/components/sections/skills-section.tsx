"use client";

import type { Skill } from "@prisma/client";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SkillMeter({ level, meterRef }: { level: number, meterRef: any }) {
  const clamped = Math.min(5, Math.max(1, level));
  return (
    <div ref={meterRef} className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "skill-dot h-1.5 w-4 rounded-full transition-colors",
            i < clamped ? "bg-primary opacity-20" : "bg-border opacity-20" // Start muted
          )}
          data-active={i < clamped ? "true" : "false"}
        />
      ))}
    </div>
  );
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category?.trim() || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(skill);
  }

  const containerRef = useRef<HTMLElement>(null);
  const metersRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      metersRef.current.forEach((meter, idx) => {
        if (!meter) return;
        const dots = meter.querySelectorAll(".skill-dot");
        const activeDots = Array.from(dots).filter(d => d.getAttribute("data-active") === "true");
        const inactiveDots = Array.from(dots).filter(d => d.getAttribute("data-active") === "false");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: meter,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });

        if (activeDots.length > 0) {
          tl.to(activeDots, {
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          });
        }
        if (inactiveDots.length > 0) {
          tl.to(inactiveDots, {
            opacity: 0.4,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out",
          }, "<0.2");
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="border-b border-border/70 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">02.</span> Skills
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Tools &amp; expertise
            </h2>
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(groups.entries()).map(([category, items], idx) => (
            <FadeIn key={category} delay={0.1 * idx} direction="up">
              <div>
                <h3 className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {items.map((skill, i) => (
                    <li
                      key={skill.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-foreground">
                        {skill.name}
                      </span>
                      <SkillMeter 
                        level={skill.level} 
                        meterRef={(el: HTMLDivElement) => {
                          metersRef.current.push(el);
                        }} 
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
