import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import type { Profile } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection({ profile }: { profile: Profile | null }) {
  const fullName = profile?.fullName ?? "Your Name";
  const title = profile?.title ?? "Software Engineer";
  const tagline =
    profile?.tagline ??
    "I design and build reliable, thoughtful software — from backend systems to polished interfaces.";
  const location = profile?.location;

  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]"
      />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
        >
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

        <h1
          className="max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-3 duration-700 delay-75 fill-mode-both sm:text-6xl lg:text-7xl"
        >
          {fullName}
        </h1>

        <p
          className="mt-4 max-w-2xl font-mono text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both sm:text-xl"
        >
          {title}
        </p>

        <p
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both"
        >
          {tagline}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both"
        >
          <Link
            href="/projects"
            className={buttonVariants({ size: "lg", className: "group" })}
          >
            View projects
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "group",
            })}
          >
            Get in touch
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
