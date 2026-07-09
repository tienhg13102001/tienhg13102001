import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2, Globe } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  index: number;
  priority?: boolean;
}

export function ProjectCard({ project, index, priority = false }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card/50 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 hover:bg-card">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={project.title}
      />

      {project.coverImage ? (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
          <img
            src={project.coverImage}
            alt={project.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center border-b border-border bg-muted font-mono text-4xl text-muted-foreground/30">
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="font-mono text-xs text-muted-foreground/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
        </div>

        <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">
          {project.title}
        </h3>

        {project.summary ? (
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
            {project.summary}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <Globe className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <FolderGit2 className="h-4 w-4" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
