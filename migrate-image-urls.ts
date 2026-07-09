import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Migrating image URLs in DB to relative paths...");
  
  // 1. Migrate Profiles
  const profiles = await prisma.profile.findMany();
  for (const profile of profiles) {
    if (profile.avatarUrl && profile.avatarUrl.match(/^http:\/\/localhost:\d+/)) {
      const newUrl = profile.avatarUrl.replace(/^http:\/\/localhost:\d+/, "");
      await prisma.profile.update({
        where: { id: profile.id },
        data: { avatarUrl: newUrl }
      });
      console.log(`Updated profile avatarUrl: ${newUrl}`);
    }
  }

  // 2. Migrate Projects
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    if (project.coverImage && project.coverImage.match(/^http:\/\/localhost:\d+/)) {
      const newUrl = project.coverImage.replace(/^http:\/\/localhost:\d+/, "");
      await prisma.project.update({
        where: { id: project.id },
        data: { coverImage: newUrl }
      });
      console.log(`Updated project coverImage: ${newUrl}`);
    }
  }

  // 3. Migrate Posts
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    if (post.coverImage && post.coverImage.match(/^http:\/\/localhost:\d+/)) {
      const newUrl = post.coverImage.replace(/^http:\/\/localhost:\d+/, "");
      await prisma.post.update({
        where: { id: post.id },
        data: { coverImage: newUrl }
      });
      console.log(`Updated post coverImage: ${newUrl}`);
    }
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
