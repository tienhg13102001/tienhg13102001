import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FolderGit2 } from "lucide-react";
import { getProjectBySlug } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found | Portfolio" };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/projects"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "group -ml-2.5",
        })}
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-mono">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {project.title}
      </h1>

      {project.summary ? (
        <p className="mt-4 text-lg text-muted-foreground">
          {project.summary}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.liveUrl ? (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: "group" })}
          >
            Live site
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : null}
        {project.repoUrl ? (
          <Link
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", className: "group" })}
          >
            <FolderGit2 className="size-4" />
            Source code
          </Link>
        ) : null}
      </div>

      {project.coverImage ? (
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full object-cover"
          />
        </div>
      ) : null}

      {project.content ? (
        <>
          <Separator className="my-10" />
          <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {project.content}
          </div>
        </>
      ) : null}
    </article>
  );
}
