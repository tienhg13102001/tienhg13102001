import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { ProjectCard } from "@/components/sections/project-card";
import { FadeIn } from "@/components/ui/fade-in";

export function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="border-b border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">03.</span> Featured work
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Selected projects
            </h2>
          </div>
          <Link
            href="/projects"
            className={buttonVariants({
              variant: "ghost",
              className: "group hidden sm:flex",
            })}
          >
            All projects
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={0.1 * index} direction="up">
              <ProjectCard project={project} index={index} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/projects"
            className={buttonVariants({
              variant: "outline",
              className: "group w-full",
            })}
          >
            All projects
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
