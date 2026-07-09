import { PrismaClient, ExperienceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  // 1. Tài khoản admin
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Admin", passwordHash },
  });

  // 2. Profile singleton
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      fullName: "Tên Của Bạn",
      title: "Software Engineer",
      tagline: "Xây dựng sản phẩm web hiện đại.",
      bio: "Giới thiệu ngắn về bạn. Hãy chỉnh sửa nội dung này trong trang /admin.",
      email,
      location: "Việt Nam",
      socials: { github: "", linkedin: "", x: "", website: "" },
    },
  });

  // 3. Vài kỹ năng mẫu
  const skills = [
    { name: "TypeScript", category: "Ngôn ngữ", level: 5, order: 1 },
    { name: "React / Next.js", category: "Frontend", level: 5, order: 2 },
    { name: "Node.js", category: "Backend", level: 4, order: 3 },
    { name: "PostgreSQL", category: "Database", level: 4, order: 4 },
  ];
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills });

  // 4. Dự án mẫu
  await prisma.project.upsert({
    where: { slug: "du-an-mau" },
    update: {},
    create: {
      title: "Dự án mẫu",
      slug: "du-an-mau",
      summary: "Một dự án ví dụ để bạn thấy giao diện hiển thị.",
      content: "Mô tả chi tiết dự án. Chỉnh sửa trong /admin/projects.",
      tags: ["Next.js", "TypeScript"],
      featured: true,
      order: 1,
    },
  });

  // 5. Kinh nghiệm mẫu
  await prisma.experience.createMany({
    data: [
      {
        type: ExperienceType.WORK,
        title: "Software Engineer",
        organization: "Công ty ABC",
        startDate: new Date("2023-01-01"),
        current: true,
        description: "Phát triển ứng dụng web.",
        order: 1,
      },
      {
        type: ExperienceType.EDUCATION,
        title: "Cử nhân CNTT",
        organization: "Đại học XYZ",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-06-01"),
        order: 2,
      },
    ],
  });

  console.log(`✔ Seed xong. Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
