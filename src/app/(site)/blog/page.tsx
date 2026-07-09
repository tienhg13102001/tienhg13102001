import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Bài viết đã xuất bản.",
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">03.</span> Writing
      </div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Blog
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Notes, write-ups, and things I&apos;ve learned along the way.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-12 text-center font-mono text-sm text-muted-foreground">
          // no posts published yet
        </div>
      ) : (
        <ul className="mt-14 divide-y divide-border border-t border-border">
          {posts.map((post) => {
            const date = formatDate(post.publishedAt ?? post.createdAt);
            return (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    ) : null}
                    {post.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
                    {date}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
