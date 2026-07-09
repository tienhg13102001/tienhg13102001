"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { join } from "path";
import { unlink } from "fs/promises";
import {
  profileSchema,
  skillSchema,
  projectSchema,
  experienceSchema,
  postSchema,
} from "@/lib/validations";
import type { ActionState } from "./action-state";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function fieldErrorsOf(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

// ------- FormData helpers -------
function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function bool(fd: FormData, key: string) {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}
function list(fd: FormData, key: string) {
  return str(fd, key)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
function toDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

async function deleteLocalFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;
  let pathname = fileUrl;
  try {
    pathname = new URL(fileUrl).pathname;
  } catch {
    // Relative URL
  }
  if (pathname.startsWith("/uploads/")) {
    const filename = pathname.replace("/uploads/", "");
    const filepath = join(process.cwd(), "public", "uploads", filename);
    try {
      await unlink(filepath);
    } catch (e) {
      console.error("Error deleting file:", filepath, e);
    }
  }
}

// =====================================================================
// PROFILE
// =====================================================================
export async function updateProfile(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAuth();
  const parsed = profileSchema.safeParse({
    fullName: str(fd, "fullName"),
    title: str(fd, "title"),
    tagline: str(fd, "tagline"),
    bio: str(fd, "bio"),
    avatarUrl: str(fd, "avatarUrl"),
    email: str(fd, "email"),
    location: str(fd, "location"),
    resumeUrl: str(fd, "resumeUrl"),
    socials: {
      github: str(fd, "github"),
      linkedin: str(fd, "linkedin"),
      facebook: str(fd, "facebook"),
      website: str(fd, "website"),
    },
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const d = parsed.data;
  
  const existing = await prisma.profile.findUnique({ where: { id: "singleton" } });
  if (existing) {
    if (existing.avatarUrl !== d.avatarUrl) await deleteLocalFile(existing.avatarUrl);
    if (existing.resumeUrl !== d.resumeUrl) await deleteLocalFile(existing.resumeUrl);
  }

  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: d,
    create: { id: "singleton", ...d },
  });
  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true, timestamp: Date.now() };
}

// =====================================================================
// SKILL
// =====================================================================
export async function saveSkill(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAuth();
  const id = str(fd, "id");
  const parsed = skillSchema.safeParse({
    name: str(fd, "name"),
    category: str(fd, "category"),
    level: str(fd, "level") || 3,
    order: str(fd, "order") || 0,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  if (id) {
    await prisma.skill.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.skill.create({ data: parsed.data });
  }
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, timestamp: Date.now() };
}

export async function deleteSkill(id: string) {
  await requireAuth();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

// =====================================================================
// PROJECT
// =====================================================================
export async function saveProject(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAuth();
  const id = str(fd, "id");
  const parsed = projectSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    summary: str(fd, "summary"),
    content: str(fd, "content"),
    coverImage: str(fd, "coverImage"),
    liveUrl: str(fd, "liveUrl"),
    repoUrl: str(fd, "repoUrl"),
    tags: list(fd, "tags"),
    featured: bool(fd, "featured"),
    order: str(fd, "order") || 0,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  try {
    if (id) {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (existing && existing.coverImage !== parsed.data.coverImage) {
        await deleteLocalFile(existing.coverImage);
      }
      await prisma.project.update({ where: { id }, data: parsed.data });
    } else {
      await prisma.project.create({ data: parsed.data });
    }
  } catch {
    return { fieldErrors: { slug: ["Slug đã tồn tại"] } };
  }
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true, timestamp: Date.now() };
}

export async function deleteProject(id: string) {
  await requireAuth();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (existing) await deleteLocalFile(existing.coverImage);
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

// =====================================================================
// EXPERIENCE
// =====================================================================
export async function saveExperience(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAuth();
  const id = str(fd, "id");
  const parsed = experienceSchema.safeParse({
    type: str(fd, "type") || "WORK",
    title: str(fd, "title"),
    organization: str(fd, "organization"),
    location: str(fd, "location"),
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    current: bool(fd, "current"),
    description: str(fd, "description"),
    order: str(fd, "order") || 0,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const d = parsed.data;
  const data = {
    type: d.type,
    title: d.title,
    organization: d.organization,
    location: d.location || null,
    startDate: toDate(d.startDate)!,
    endDate: d.current ? null : toDate(d.endDate ?? ""),
    current: d.current,
    description: d.description || null,
    order: d.order,
  };

  if (id) {
    await prisma.experience.update({ where: { id }, data });
  } else {
    await prisma.experience.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");
  return { success: true, timestamp: Date.now() };
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");
}

// =====================================================================
// POST (blog)
// =====================================================================
export async function savePost(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAuth();
  const id = str(fd, "id");
  const published = bool(fd, "published");
  const parsed = postSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    coverImage: str(fd, "coverImage"),
    tags: list(fd, "tags"),
    published,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const d = parsed.data;
  const base = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt || null,
    content: d.content,
    coverImage: d.coverImage || null,
    tags: d.tags,
    published: d.published,
  };

  try {
    if (id) {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (existing && existing.coverImage !== base.coverImage) {
        await deleteLocalFile(existing.coverImage);
      }
      await prisma.post.update({
        where: { id },
        data: {
          ...base,
          publishedAt:
            d.published && !existing?.publishedAt
              ? new Date()
              : existing?.publishedAt ?? null,
        },
      });
    } else {
      await prisma.post.create({
        data: { ...base, publishedAt: d.published ? new Date() : null },
      });
    }
  } catch {
    return { fieldErrors: { slug: ["Slug đã tồn tại"] } };
  }
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function deletePost(id: string) {
  await requireAuth();
  const existing = await prisma.post.findUnique({ where: { id } });
  if (existing) await deleteLocalFile(existing.coverImage);
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
