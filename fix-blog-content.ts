import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BLOG_CONTENT_MAP: Record<string, string> = {
  "future-of-web-dev-nextjs-15": `
    <h2>Introduction</h2>
    <p>The web development ecosystem is evolving rapidly. With the release of Next.js 15 and React 19, developers have access to unprecedented performance and developer experience improvements. Server Components are now fully mature, and caching strategies have been simplified.</p>
    <br>
    <h3>Key Features</h3>
    <ul>
      <li><strong>React Server Components (RSC):</strong> Building UIs on the server for zero client-side JavaScript.</li>
      <li><strong>Actions:</strong> Simplified data mutations without creating manual API routes.</li>
      <li><strong>Improved Caching:</strong> More predictable and opt-in caching defaults.</li>
    </ul>
    <p><br></p>
    <p>Are you ready to adopt these new technologies?</p>
  `,
  "mastering-tailwind-css": `
    <h2>Why Tailwind CSS?</h2>
    <p>Tailwind CSS has taken the frontend world by storm. Unlike traditional semantic CSS, utility-first CSS allows you to style elements directly in your markup. This leads to faster prototyping and eliminates the cognitive load of naming CSS classes.</p>
    <br>
    <h3>Best Practices</h3>
    <ul>
      <li>Extract complex components using the <code>@apply</code> directive sparingly.</li>
      <li>Use arbitrary values like <code>bg-[#1da1f2]</code> for one-off colors.</li>
      <li>Optimize for production using PostCSS and PurgeCSS.</li>
    </ul>
    <p><br></p>
    <p>By mastering Tailwind, you can build entire design systems in record time.</p>
  `,
  "server-vs-client-components": `
    <h2>The Paradigm Shift</h2>
    <p>React Server Components (RSCs) introduce a new mental model. By default, components in Next.js App Router are server components. They run exclusively on the server, fetch data securely, and send pure HTML to the client.</p>
    <br>
    <h3>When to use 'use client'</h3>
    <p>You only need to opt into Client Components when you need:</p>
    <ul>
      <li>Interactivity (onClick, onChange)</li>
      <li>Hooks (useState, useEffect)</li>
      <li>Browser APIs (window, localStorage)</li>
    </ul>
    <p><br></p>
    <p>Mastering this boundary is crucial for building highly performant applications.</p>
  `,
  "beginners-guide-typescript": `
    <h2>The Rise of TypeScript</h2>
    <p>TypeScript is a superset of JavaScript that adds static typing. It catches errors at compile time rather than runtime, saving countless hours of debugging.</p>
    <br>
    <h3>Core Concepts</h3>
    <ul>
      <li><strong>Interfaces vs Types:</strong> Learn when to use which for defining object shapes.</li>
      <li><strong>Generics:</strong> Write reusable and flexible functions and components.</li>
      <li><strong>Utility Types:</strong> Manipulate existing types using <code>Partial</code>, <code>Pick</code>, and <code>Omit</code>.</li>
    </ul>
    <p><br></p>
    <p>If you haven't started using TypeScript yet, now is the time.</p>
  `,
  "build-portfolio-gets-hired": `
    <h2>First Impressions Matter</h2>
    <p>Your portfolio is your digital resume. It needs to immediately communicate your value proposition. Keep the design clean, fast, and accessible.</p>
    <br>
    <h3>Essential Sections</h3>
    <ol>
      <li><strong>Hero Section:</strong> Who are you and what do you do?</li>
      <li><strong>Projects:</strong> Don't just list technologies. Explain the <em>problem</em> you solved and the <em>impact</em> you made.</li>
      <li><strong>About Me:</strong> Show some personality.</li>
      <li><strong>Contact:</strong> Make it effortless to reach you.</li>
    </ol>
    <p><br></p>
    <p>Remember, quality beats quantity. Highlight 3-4 excellent projects rather than 10 mediocre ones.</p>
  `,
  "10-vscode-extensions": `
    <h2>Tooling is Everything</h2>
    <p>A good craftsman knows their tools. VS Code is incredibly powerful, but extensions make it magical.</p>
    <br>
    <h3>My Top Picks</h3>
    <ol>
      <li><strong>Prettier:</strong> Opinionated code formatter.</li>
      <li><strong>ESLint:</strong> Find and fix problems in your JavaScript code.</li>
      <li><strong>GitLens:</strong> Supercharge Git capabilities built into VS Code.</li>
      <li><strong>Tailwind CSS IntelliSense:</strong> Intelligent autocompletion for Tailwind.</li>
      <li><strong>Prisma:</strong> Syntax highlighting and formatting for Prisma schemas.</li>
    </ol>
    <p><br></p>
    <p>What are your favorite extensions?</p>
  `,
  "why-postgresql-side-projects": `
    <h2>The Default Choice</h2>
    <p>For years, NoSQL databases like MongoDB were the default for fast side projects. However, PostgreSQL has proven itself to be the ultimate versatile database.</p>
    <br>
    <h3>Advantages</h3>
    <ul>
      <li><strong>Relational Integrity:</strong> Ensure your data is structured and consistent.</li>
      <li><strong>JSONB Support:</strong> Store unstructured data just like NoSQL when needed.</li>
      <li><strong>Ecosystem:</strong> Excellent support in modern ORMs like Prisma.</li>
    </ul>
    <p><br></p>
    <p>Whether you are building a simple blog or a complex SaaS, PostgreSQL scales with you.</p>
  `,
  "deploying-apps-vercel": `
    <h2>The Vercel Magic</h2>
    <p>Vercel has revolutionized deployment. What used to take hours of configuring Linux servers and Nginx now takes a git push.</p>
    <br>
    <h3>Steps to Deploy</h3>
    <ol>
      <li>Push your code to GitHub.</li>
      <li>Import the repository in Vercel.</li>
      <li>Configure Environment Variables (e.g., <code>DATABASE_URL</code>, <code>IMGBB_API_KEY</code>).</li>
      <li>Click Deploy.</li>
    </ol>
    <p><br></p>
    <p>Vercel automatically detects Next.js, optimizes assets, and distributes your app to the edge. It's truly magical.</p>
  `,
  "power-of-prisma-orm": `
    <h2>Modern Database Access</h2>
    <p>Traditional ORMs can be clunky and prone to the N+1 query problem. Prisma takes a different approach by generating a bespoke, highly optimized query builder based on your schema.</p>
    <br>
    <h3>Why Prisma?</h3>
    <ul>
      <li><strong>Type Safety:</strong> Autocompletion for your entire database schema.</li>
      <li><strong>Prisma Studio:</strong> A beautiful GUI to view and edit your data.</li>
      <li><strong>Migrations:</strong> Intuitive declarative database migrations.</li>
    </ul>
    <p><br></p>
    <p>If you use TypeScript, Prisma is an absolute no-brainer.</p>
  `,
  "framer-motion-vs-gsap": `
    <h2>Bringing UI to Life</h2>
    <p>Animations can elevate a good design to a great one. But which library should you use?</p>
    <br>
    <h3>Framer Motion</h3>
    <ul>
      <li>Best for React-heavy projects.</li>
      <li>Declarative syntax using the <code>&lt;motion.div&gt;</code> component.</li>
      <li>Excellent for layout animations and page transitions.</li>
    </ul>
    <br>
    <h3>GSAP (GreenSock)</h3>
    <ul>
      <li>Best for complex, sequenced animations and scroll effects (ScrollTrigger).</li>
      <li>Imperative syntax using timelines.</li>
      <li>Framework agnostic.</li>
    </ul>
    <p><br></p>
    <p>Both are incredibly powerful. I often use Framer Motion for UI micro-interactions and GSAP for complex landing page storytelling.</p>
  `
};

async function main() {
  console.log("🚀 Updating blog contents to HTML format...");
  
  const posts = await prisma.post.findMany();
  
  for (const post of posts) {
    if (BLOG_CONTENT_MAP[post.slug]) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: BLOG_CONTENT_MAP[post.slug] }
      });
      console.log(`✅ Updated ${post.slug}`);
    }
  }

  console.log("🎉 All contents updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
