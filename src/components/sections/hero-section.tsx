"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Sparkles, Triangle, Circle, Hexagon } from "lucide-react";
import type { Profile } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export function HeroSection({ profile }: { profile: Profile | null }) {
  const fullName = profile?.fullName ?? "Your Name";
  const title = profile?.title ?? "Software Engineer";
  const tagline =
    profile?.tagline ??
    "I design and build reliable, thoughtful software — from backend systems to polished interfaces.";
  const location = profile?.location;

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const iconsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Parallax background grid
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: 150,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Infinite Typing effect for the TITLE
      if (titleRef.current) {
        const originalText = titleRef.current.innerText;
        titleRef.current.innerText = "";
        
        const tl = gsap.timeline({ repeat: -1 });
        
        // Gõ chữ ra (trái qua phải)
        tl.to(titleRef.current, {
          text: {
            value: originalText,
          },
          duration: 1.5,
          ease: "none",
          delay: 0.5, 
        });

        // Xóa chữ đi (từ phải qua trái - mô phỏng nút Backspace)
        const textObj = { length: originalText.length };
        tl.to(textObj, {
          length: 0,
          duration: 1.0,
          ease: "none",
          delay: 5,
          onUpdate: () => {
            if (titleRef.current) {
              titleRef.current.innerText = originalText.substring(0, Math.round(textObj.length));
            }
          }
        });
      }

      // 3. Blinking cursor for the title
      if (cursorRef.current) {
        gsap.fromTo(cursorRef.current, 
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.5,
            ease: "steps(1)",
            repeat: -1,
            yoyo: true,
          }
        );
      }

      // 4. Floating background icons
      if (iconsContainerRef.current) {
        const icons = iconsContainerRef.current.querySelectorAll(".floating-icon");
        icons.forEach((icon, i) => {
          gsap.to(icon, {
            y: "random(-30, 30)",
            x: "random(-30, 30)",
            rotation: "random(-45, 45)",
            duration: "random(3, 5)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.2,
          });
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative overflow-hidden border-b border-border/70">
      <div
        ref={bgRef}
        aria-hidden
        className="pointer-events-none absolute -inset-y-32 inset-x-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]"
      />

      {/* Floating Background Icons */}
      <div ref={iconsContainerRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        <Sparkles className="floating-icon absolute left-[10%] top-[20%] size-8 text-primary" />
        <Triangle className="floating-icon absolute right-[15%] top-[30%] size-12 text-primary/50" />
        <Circle className="floating-icon absolute left-[20%] bottom-[30%] size-10 text-primary/40" />
        <Hexagon className="floating-icon absolute right-[25%] bottom-[20%] size-14 text-primary/60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <FadeIn delay={0.1} direction="up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            available for new work
            {location ? (
              <>
                <span className="text-border">/</span>
                <MapPin className="size-3" />
                {location}
              </>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} direction="up">
          <h1 className="max-w-4xl min-h-[1.2em] text-5xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {fullName}
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} direction="up">
          <p className="mt-4 max-w-2xl font-mono text-lg text-muted-foreground sm:text-xl flex items-center">
            <span ref={titleRef}>{title}</span>
            <span ref={cursorRef} className="text-primary font-bold ml-[1px]">|</span>
          </p>
        </FadeIn>

        <FadeIn delay={0.4} direction="up">
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {tagline}
          </p>
        </FadeIn>

        <FadeIn delay={0.5} direction="up">
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className={buttonVariants({ size: "lg", className: "group hover:scale-105 transition-transform duration-300" })}
            >
              View projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "group hover:scale-105 transition-transform duration-300",
              })}
            >
              Get in touch
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
