import type { Metadata } from "next";
import { getExperiences } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import type { Experience } from "@prisma/client";

export const metadata: Metadata = {
  title: "Experience | Portfolio",
  description: "Quá trình làm việc và học tập.",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatRange(exp: Experience) {
  const start = formatDate(exp.startDate);
  if (exp.current) return `${start} — PRESENT`;
  if (exp.endDate) return `${start} — ${formatDate(exp.endDate)}`;
  return start;
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <FadeIn direction="up" delay={0.1}>
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">02.</span> Journey
        </div>
      </FadeIn>
      <FadeIn direction="up" delay={0.2}>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Experience
        </h1>
      </FadeIn>
      <FadeIn direction="up" delay={0.3}>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Where I&apos;ve worked and studied along the way.
        </p>
      </FadeIn>

      {experiences.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-12 text-center font-mono text-sm text-muted-foreground">
          // no experience entries yet
        </div>
      ) : (
        <ol className="relative mt-16 border-l border-border pl-8">
          {experiences.map((exp, i) => (
            <li key={exp.id} className="group relative pb-14 last:pb-0">
              <FadeIn direction="up" delay={0.2 + (i % 5) * 0.1}>
                <span
                  className={cn(
                    "absolute top-0 -left-[37.5px] size-2.5 rounded-full border-2 border-background ring-2 ring-border transition-colors",
                    exp.current ? "bg-primary ring-primary/40" : "bg-muted-foreground/50"
                  )}
                />

                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge variant={exp.type === "WORK" ? "default" : "secondary"}>
                    {exp.type === "WORK" ? "Work" : "Education"}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatRange(exp)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {exp.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {exp.organization}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>

                {exp.description ? (
                  <div
                    className="prose prose-sm prose-neutral dark:prose-invert mt-3 max-w-2xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                ) : null}
              </FadeIn>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
