import { z } from "zod";

/** Chuỗi tùy chọn: cho phép rỗng. */
const optStr = z.string().optional().or(z.literal(""));
/** URL tùy chọn: cho phép rỗng. */
const optUrl = z.string().regex(/^(https?:\/\/|\/)/, "URL không hợp lệ").optional().or(z.literal(""));

export const profileSchema = z.object({
  fullName: z.string().min(1, "Bắt buộc"),
  title: z.string().min(1, "Bắt buộc"),
  tagline: optStr,
  bio: optStr,
  avatarUrl: optUrl,
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  location: optStr,
  resumeUrl: optUrl,
  socials: z
    .object({
      github: optStr,
      linkedin: optStr,
      facebook: optStr,
      website: optStr,
    })
    .optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  category: optStr,
  level: z.coerce.number().int().min(1).max(5).default(3),
  order: z.coerce.number().int().default(0),
});

const slug = z
  .string()
  .min(1, "Bắt buộc")
  .regex(/^[a-z0-9-]+$/, "Chỉ gồm chữ thường, số và dấu gạch ngang");

export const projectSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  slug,
  summary: optStr,
  content: optStr,
  coverImage: optUrl,
  liveUrl: optUrl,
  repoUrl: optUrl,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const experienceSchema = z.object({
  type: z.enum(["WORK", "EDUCATION"]),
  title: z.string().min(1, "Bắt buộc"),
  organization: z.string().min(1, "Bắt buộc"),
  location: optStr,
  startDate: z.string().min(1, "Chọn ngày bắt đầu"),
  endDate: optStr,
  current: z.boolean().default(false),
  description: optStr,
  order: z.coerce.number().int().default(0),
});

export const postSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  slug,
  excerpt: optStr,
  content: z.string().min(1, "Bắt buộc"),
  coverImage: optUrl,
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});
