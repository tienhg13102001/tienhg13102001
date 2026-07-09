import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getFileUrl } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Portfolio" };
  }

  return {
    title: `${post.title} | Portfolio`,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "group -ml-2.5",
        })}
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        All posts
      </Link>

      {post.tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      ) : null}

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {post.title}
      </h1>

      {date ? (
        <p className="mt-4 font-mono text-sm text-muted-foreground">{date}</p>
      ) : null}

      {post.coverImage ? (
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getFileUrl(post.coverImage)}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      ) : null}

      <Separator className="my-10" />

      <div 
        className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
