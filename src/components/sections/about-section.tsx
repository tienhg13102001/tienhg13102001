"use client";

import type { Profile } from "@prisma/client";
import { FadeIn } from "@/components/ui/fade-in";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection({ profile }: { profile: Profile | null }) {
  const bio = profile?.bio || "Full Stack Developer building digital experiences.";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      
      const paragraphs = textRef.current.querySelectorAll("p");
      
      gsap.fromTo(
        paragraphs,
        { opacity: 0.2, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="border-b border-border/70 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <FadeIn>
              <div className="font-mono text-xs text-muted-foreground">
                <span className="text-primary">01.</span> About
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Background
              </h2>
            </FadeIn>
          </div>

          <div className="lg:col-span-8">
            <div ref={textRef} className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              {bio.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
