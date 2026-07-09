import type { Profile } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AboutSection({ profile }: { profile: Profile | null }) {
  const fullName = profile?.fullName ?? "Your Name";
  const bio =
    profile?.bio ??
    "Add a short bio in the admin dashboard to introduce yourself here — your background, what drives you, and what you're focused on right now.";

  return (
    <section className="border-b border-border/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[auto_1fr] lg:gap-16 lg:px-8">
        <div className="flex items-start gap-4 lg:flex-col lg:gap-6">
          <Avatar size="lg" className="size-16 lg:size-24">
            <AvatarImage src={profile?.avatarUrl ?? undefined} alt={fullName} />
            <AvatarFallback className="text-lg lg:text-2xl">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">01.</span> About
          </div>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A little about me
          </h2>
          <p className="mt-6 text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}
