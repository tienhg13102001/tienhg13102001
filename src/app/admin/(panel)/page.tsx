import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { FolderKanban, Sparkles, Briefcase, Newspaper } from "lucide-react";

export default async function AdminDashboardPage() {
  const [projectCount, skillCount, experienceCount, postCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.post.count(),
    ]);

  const cards = [
    {
      label: "Projects",
      count: projectCount,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Skills",
      count: skillCount,
      href: "/admin/skills",
      icon: Sparkles,
    },
    {
      label: "Experience",
      count: experienceCount,
      href: "/admin/experience",
      icon: Briefcase,
    },
    {
      label: "Posts",
      count: postCount,
      href: "/admin/blog",
      icon: Newspaper,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Tổng quan nội dung portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <Icon className="size-4" />
                    {card.label}
                  </CardDescription>
                  <CardTitle className="text-2xl">{card.count}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liên kết nhanh</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/profile" className="text-primary hover:underline">
            Sửa Profile
          </Link>
          <Link href="/admin/projects" className="text-primary hover:underline">
            Thêm Project
          </Link>
          <Link href="/admin/skills" className="text-primary hover:underline">
            Thêm Skill
          </Link>
          <Link href="/admin/experience" className="text-primary hover:underline">
            Thêm Experience
          </Link>
          <Link href="/admin/blog" className="text-primary hover:underline">
            Viết bài mới
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
