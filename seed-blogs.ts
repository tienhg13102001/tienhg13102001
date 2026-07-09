import { PrismaClient } from "@prisma/client";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const ARTIFACT_DIR = "/Users/tiennguyen/.gemini/antigravity-ide/brain/814988e4-6494-4cf5-bb2a-093f9ec7f2bb";

const BLOG_POSTS = [
  {
    title: "The Future of Web Development: Next.js 15 and React 19",
    slug: "future-of-web-dev-nextjs-15",
    excerpt: "Explore the cutting-edge features of Next.js 15 and React 19 that are changing the way we build modern web applications.",
    content: "## Introduction\n\nThe web development ecosystem is evolving rapidly. With the release of Next.js 15 and React 19, developers have access to unprecedented performance and developer experience improvements. Server Components are now fully mature, and caching strategies have been simplified.\n\n### Key Features\n\n1. **React Server Components (RSC):** Building UIs on the server for zero client-side JavaScript.\n2. **Actions:** Simplified data mutations without creating manual API routes.\n3. **Improved Caching:** More predictable and opt-in caching defaults.\n\nAre you ready to adopt these new technologies?",
    tags: ["Next.js", "React", "Frontend", "WebDev"],
    imagePrefix: "blog_nextjs"
  },
  {
    title: "Mastering Tailwind CSS for Modern UIs",
    slug: "mastering-tailwind-css",
    excerpt: "Learn how to leverage utility-first CSS to rapidly build beautiful, responsive, and maintainable user interfaces.",
    content: "## Why Tailwind CSS?\n\nTailwind CSS has taken the frontend world by storm. Unlike traditional semantic CSS, utility-first CSS allows you to style elements directly in your markup. This leads to faster prototyping and eliminates the cognitive load of naming CSS classes.\n\n### Best Practices\n\n- Extract complex components using the `@apply` directive sparingly.\n- Use arbitrary values like `bg-[#1da1f2]` for one-off colors.\n- Optimize for production using PostCSS and PurgeCSS.\n\nBy mastering Tailwind, you can build entire design systems in record time.",
    tags: ["Tailwind", "CSS", "Design", "UI/UX"],
    imagePrefix: "blog_tailwindcss"
  },
  {
    title: "Understanding Server Components vs Client Components",
    slug: "server-vs-client-components",
    excerpt: "A deep dive into the architecture of React 18+ and how to decide when to use 'use client'.",
    content: "## The Paradigm Shift\n\nReact Server Components (RSCs) introduce a new mental model. By default, components in Next.js App Router are server components. They run exclusively on the server, fetch data securely, and send pure HTML to the client.\n\n### When to use 'use client'\n\nYou only need to opt into Client Components when you need:\n- Interactivity (onClick, onChange)\n- Hooks (useState, useEffect)\n- Browser APIs (window, localStorage)\n\nMastering this boundary is crucial for building highly performant applications.",
    tags: ["React", "Architecture", "Performance"],
    imagePrefix: "blog_server_client"
  },
  {
    title: "A Beginner's Guide to TypeScript",
    slug: "beginners-guide-typescript",
    excerpt: "Why you should stop using plain JavaScript and start embracing static typing for scalable applications.",
    content: "## The Rise of TypeScript\n\nTypeScript is a superset of JavaScript that adds static typing. It catches errors at compile time rather than runtime, saving countless hours of debugging.\n\n### Core Concepts\n\n- **Interfaces vs Types:** Learn when to use which for defining object shapes.\n- **Generics:** Write reusable and flexible functions and components.\n- **Utility Types:** Manipulate existing types using `Partial`, `Pick`, and `Omit`.\n\nIf you haven't started using TypeScript yet, now is the time.",
    tags: ["TypeScript", "JavaScript", "Beginner"],
    imagePrefix: "blog_typescript"
  },
  {
    title: "How to build a Portfolio that gets you hired",
    slug: "build-portfolio-gets-hired",
    excerpt: "Actionable advice on structuring your developer portfolio to stand out to recruiters and hiring managers.",
    content: "## First Impressions Matter\n\nYour portfolio is your digital resume. It needs to immediately communicate your value proposition. Keep the design clean, fast, and accessible.\n\n### Essential Sections\n\n1. **Hero Section:** Who are you and what do you do?\n2. **Projects:** Don't just list technologies. Explain the *problem* you solved and the *impact* you made.\n3. **About Me:** Show some personality.\n4. **Contact:** Make it effortless to reach you.\n\nRemember, quality beats quantity. Highlight 3-4 excellent projects rather than 10 mediocre ones.",
    tags: ["Career", "Portfolio", "Advice"],
    imagePrefix: "blog_portfolio"
  },
  {
    title: "10 VS Code Extensions Every Developer Needs",
    slug: "10-vscode-extensions",
    excerpt: "Supercharge your productivity with these essential Visual Studio Code extensions.",
    content: "## Tooling is Everything\n\nA good craftsman knows their tools. VS Code is incredibly powerful, but extensions make it magical.\n\n### My Top Picks\n\n1. **Prettier:** Opinionated code formatter.\n2. **ESLint:** Find and fix problems in your JavaScript code.\n3. **GitLens:** Supercharge Git capabilities built into VS Code.\n4. **Tailwind CSS IntelliSense:** Intelligent autocompletion for Tailwind.\n5. **Prisma:** Syntax highlighting and formatting for Prisma schemas.\n\nWhat are your favorite extensions?",
    tags: ["VSCode", "Tools", "Productivity"],
    imagePrefix: "blog_vscode"
  },
  {
    title: "Why PostgreSQL is the best database for side projects",
    slug: "why-postgresql-side-projects",
    excerpt: "An argument for using relational databases over NoSQL for most modern web applications.",
    content: "## The Default Choice\n\nFor years, NoSQL databases like MongoDB were the default for fast side projects. However, PostgreSQL has proven itself to be the ultimate versatile database.\n\n### Advantages\n\n- **Relational Integrity:** Ensure your data is structured and consistent.\n- **JSONB Support:** Store unstructured data just like NoSQL when needed.\n- **Ecosystem:** Excellent support in modern ORMs like Prisma.\n\nWhether you are building a simple blog or a complex SaaS, PostgreSQL scales with you.",
    tags: ["Database", "PostgreSQL", "Backend"],
    imagePrefix: "blog_postgresql"
  },
  {
    title: "Deploying full-stack apps on Vercel: A step-by-step guide",
    slug: "deploying-apps-vercel",
    excerpt: "Learn how to take your Next.js application from localhost to a globally distributed edge network in minutes.",
    content: "## The Vercel Magic\n\nVercel has revolutionized deployment. What used to take hours of configuring Linux servers and Nginx now takes a git push.\n\n### Steps to Deploy\n\n1. Push your code to GitHub.\n2. Import the repository in Vercel.\n3. Configure Environment Variables (e.g., `DATABASE_URL`, `IMGBB_API_KEY`).\n4. Click Deploy.\n\nVercel automatically detects Next.js, optimizes assets, and distributes your app to the edge. It's truly magical.",
    tags: ["Vercel", "Deployment", "DevOps"],
    imagePrefix: "blog_vercel"
  },
  {
    title: "The Power of Prisma ORM in Node.js Applications",
    slug: "power-of-prisma-orm",
    excerpt: "Discover how Prisma's type-safe database client can drastically improve your backend development experience.",
    content: "## Modern Database Access\n\nTraditional ORMs can be clunky and prone to the N+1 query problem. Prisma takes a different approach by generating a bespoke, highly optimized query builder based on your schema.\n\n### Why Prisma?\n\n- **Type Safety:** Autocompletion for your entire database schema.\n- **Prisma Studio:** A beautiful GUI to view and edit your data.\n- **Migrations:** Intuitive declarative database migrations.\n\nIf you use TypeScript, Prisma is an absolute no-brainer.",
    tags: ["Prisma", "ORM", "Backend", "TypeScript"],
    imagePrefix: "blog_prisma"
  },
  {
    title: "Animation in React: Framer Motion vs GSAP",
    slug: "framer-motion-vs-gsap",
    excerpt: "A comparison of the two heavyweights of web animation. Which one should you choose for your next project?",
    content: "## Bringing UI to Life\n\nAnimations can elevate a good design to a great one. But which library should you use?\n\n### Framer Motion\n\n- Best for React-heavy projects.\n- Declarative syntax using the `<motion.div>` component.\n- Excellent for layout animations and page transitions.\n\n### GSAP (GreenSock)\n\n- Best for complex, sequenced animations and scroll effects (ScrollTrigger).\n- Imperative syntax using timelines.\n- Framework agnostic.\n\nBoth are incredibly powerful. I often use Framer Motion for UI micro-interactions and GSAP for complex landing page storytelling.",
    tags: ["Animation", "React", "GSAP", "FramerMotion"],
    imagePrefix: "blog_animation"
  }
];

async function uploadToImgBB(filepath: string, filename: string): Promise<string> {
  const imgbbApiKey = process.env.IMGBB_API_KEY;
  if (!imgbbApiKey) throw new Error("Missing IMGBB_API_KEY");

  const buffer = await readFile(filepath);
  const base64Image = buffer.toString("base64");

  const formData = new FormData();
  formData.append("image", base64Image);
  formData.append("name", filename);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Lỗi từ ImgBB");
  }

  return data.data.url;
}

async function main() {
  console.log("🚀 Bắt đầu quá trình tạo 10 bài Blog...");
  
  // Xóa sạch blog cũ để tránh trùng lặp
  await prisma.post.deleteMany({});
  console.log("🗑️ Đã xóa các bài Blog cũ.");

  const allFiles = await readdir(ARTIFACT_DIR);

  for (const post of BLOG_POSTS) {
    console.log(`\n⏳ Đang xử lý Blog: ${post.title}`);
    
    // Tìm file ảnh có prefix tương ứng
    const imageFile = allFiles.find(f => f.startsWith(post.imagePrefix) && f.endsWith(".png"));
    
    let coverImageUrl = "";
    if (imageFile) {
      const filepath = join(ARTIFACT_DIR, imageFile);
      try {
        console.log(`   - Uploading ảnh ${imageFile} lên ImgBB...`);
        coverImageUrl = await uploadToImgBB(filepath, post.slug);
        console.log(`   ✅ Ảnh tải lên thành công: ${coverImageUrl}`);
      } catch (err) {
        console.error(`   ❌ Lỗi khi tải ảnh:`, err);
      }
    } else {
      console.warn(`   ⚠️ Không tìm thấy ảnh cho bài viết này (Prefix: ${post.imagePrefix})`);
    }

    // Tạo record trong DB
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: coverImageUrl || null,
        tags: post.tags,
        published: true,
      }
    });
    console.log(`   ✅ Đã lưu bài Blog vào Database!`);
  }

  console.log("\n🎉 Quá trình tạo Blog hoàn tất thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
