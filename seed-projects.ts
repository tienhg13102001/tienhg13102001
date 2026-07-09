import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projects = [
    {
      title: "DCASKS",
      slug: "dcasks",
      summary: "Web3 & Telegram Mini App for the wine and spirits industry, featuring Real-World Asset (RWA) tokenization, smart contracts, and real-time auctions.",
      tags: ["Next.js 15", "NestJS", "Wagmi/Viem", "PostgreSQL", "Redis", "Telegram Bot API"],
      order: 1
    },
    {
      title: "Estudyme",
      slug: "estudyme",
      summary: "E-learning platform development focusing on pixel-perfect frontend interfaces, state management, and scalable Express RESTful APIs for complex course management.",
      tags: ["Next.js", "Express.js", "Material UI", "Redux Toolkit", "Figma"],
      order: 2
    },
    {
      title: "Ngoại ngữ 24h",
      slug: "ngoai-ngu-24h",
      summary: "Refactored legacy components and built automated internal tooling and RESTful APIs for a popular English learning platform in Vietnam.",
      tags: ["Node.js", "Express.js", "MongoDB", "React.js", "Styled-components"],
      order: 3
    },
    {
      title: "MKT TIKPRO",
      slug: "mkt-tikpro",
      summary: "Cross-platform Electron desktop application for social media automation, lead extraction, and data mining using browser automation (Puppeteer).",
      tags: ["Electron.js", "React.js", "Puppeteer", "SQLite", "Socket.io", "Tailwind CSS"],
      order: 4
    }
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: p
    });
  }

  console.log("Projects seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
