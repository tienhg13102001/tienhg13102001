import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Profile } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export function ContactSection({ profile }: { profile: Profile | null }) {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">04.</span> Contact
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Have a project in mind? Let&apos;s build something worth
              shipping.
            </h2>

            <Link
              href="/contact"
              className={buttonVariants({ size: "lg", className: "group shrink-0" })}
            >
              {profile?.email ?? "Get in touch"}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
