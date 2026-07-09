import type { Skill } from "@prisma/client";
import { cn } from "@/lib/utils";

function SkillMeter({ level }: { level: number }) {
  const clamped = Math.min(5, Math.max(1, level));
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full transition-colors",
            i < clamped ? "bg-primary" : "bg-border"
          )}
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

  return (
    <section className="border-b border-border/70">
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
          {Array.from(groups.entries()).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-foreground">
                      {skill.name}
                    </span>
                    <SkillMeter level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
