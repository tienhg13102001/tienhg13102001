import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  AtSign,
  FileText,
  FolderGit2,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { getProfile } from "@/lib/queries";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact | Portfolio",
  description: "Thông tin liên hệ.",
};

type Socials = {
  github?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
};

export default async function ContactPage() {
  const profile = await getProfile();
  const socials = (profile?.socials as Socials | null) ?? {};

  const socialLinks = [
    { href: socials.github, label: "GitHub", handle: "GitHub", icon: FolderGit2 },
    { href: socials.linkedin, label: "LinkedIn", handle: "LinkedIn", icon: Link2 },
    { href: socials.facebook, label: "Facebook", handle: "Facebook", icon: MessageCircle },
    { href: socials.website, label: "Website", handle: "Website", icon: Globe },
  ].filter((l): l is { href: string; label: string; handle: string; icon: typeof Mail } =>
    Boolean(l.href)
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">04.</span> Contact
      </div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Let&apos;s talk
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        {profile?.tagline ??
          "Reach out for collaborations, opportunities, or just to say hi."}
      </p>

      <Separator className="my-10" />

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          {profile?.email ? (
            <div>
              <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <Mail className="size-3.5" />
                Email
              </div>
              <Link
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-1.5 text-lg font-medium text-foreground transition-colors hover:text-primary"
              >
                {profile.email}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          ) : null}

          {profile?.location ? (
            <div>
              <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <MapPin className="size-3.5" />
                Location
              </div>
              <p className="text-lg font-medium text-foreground">
                {profile.location}
              </p>
            </div>
          ) : null}

          {profile?.resumeUrl ? (
            <div>
              <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <FileText className="size-3.5" />
                Resume
              </div>
              <Link
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-lg font-medium text-foreground transition-colors hover:text-primary"
              >
                Download resume
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Elsewhere
          </div>
          {socialLinks.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground/60">
              // no socials configured
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {socialLinks.map(({ href, label, handle, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 py-3.5 text-foreground transition-colors hover:text-primary"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 text-muted-foreground group-hover:text-primary" />
                      {handle}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
