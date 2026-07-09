import type { Metadata } from "next";
import { getProjects } from "@/lib/queries";
import { ProjectCard } from "@/components/sections/project-card";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "Tất cả các dự án đã thực hiện.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">01.</span> Work
      </div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Projects
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        A collection of things I&apos;ve designed, built, and shipped.
      </p>

      {projects.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-12 text-center font-mono text-sm text-muted-foreground">
          // no projects published yet
        </div>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={0.1 * index} direction="up">
              <ProjectCard project={project} index={index} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}
