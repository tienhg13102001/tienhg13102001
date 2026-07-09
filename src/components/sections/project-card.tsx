import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { getFileUrl } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={project.title}
      />

      {project.coverImage ? (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
          <Image
            src={getFileUrl(project.coverImage)}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 4} // Ưu tiên tải nhanh 4 ảnh đầu
            className="object-cover object-top"
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
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>

        {project.summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.summary}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-6">
          {(project.tags || []).slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="font-mono">
              {tag}
            </Badge>
          ))}
          {project.repoUrl ? (
            <span className="relative z-20 ml-auto">
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Repository"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground"
              >
                <FolderGit2 className="size-3.5" />
              </Link>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
