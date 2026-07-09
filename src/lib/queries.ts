import { prisma } from "@/lib/prisma";

/**
 * Read helpers dùng cho trang public (Server Components).
 * Admin dùng thêm các hàm "all" để lấy cả bản nháp.
 */

export function getProfile() {
  return prisma.profile.findUnique({ where: { id: "singleton" } });
}

export function getSkills() {
  return prisma.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
}

export function getProjects() {
  return prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
}

/** Chỉ bài đã publish — cho trang public. */
export function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({ where: { slug, published: true } });
}

// ---------- Admin (bao gồm cả nháp) ----------

export function getAllProjects() {
  return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export function getAllPosts() {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export function getSkillById(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

export function getExperienceById(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}
