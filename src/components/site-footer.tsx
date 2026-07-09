import Link from "next/link";
import { FolderGit2, Link2, Mail, Globe } from "lucide-react";
import { getProfile } from "@/lib/queries";

type Socials = {
  github?: string;
  linkedin?: string;
  x?: string;
  website?: string;
};

export async function SiteFooter() {
  const profile = await getProfile();
  const socials = (profile?.socials as Socials | null) ?? {};
  const year = new Date().getFullYear();

  const links = [
    { href: socials.github, label: "GitHub", icon: FolderGit2 },
    { href: socials.linkedin, label: "LinkedIn", icon: Link2 },
    { href: socials.website, label: "Website", icon: Globe },
    profile?.email
      ? { href: `mailto:${profile.email}`, label: "Email", icon: Mail }
      : null,
  ].filter((l): l is { href: string; label: string; icon: typeof Mail } =>
    Boolean(l && l.href)
  );

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex size-6 items-center justify-center rounded-md border border-border text-foreground">
            &gt;_
          </span>
          <span>
            © {year} {profile?.fullName ?? "Portfolio"}. Built with Next.js.
          </span>
        </div>

        <div className="flex items-center gap-1">
          {links.length > 0 ? (
            links.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
              </Link>
            ))
          ) : (
            <span className="font-mono text-xs text-muted-foreground/60">
              // no socials configured
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
