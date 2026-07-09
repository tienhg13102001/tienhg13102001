import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.findUnique({ where: { id: "singleton" } });
  const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  const experiences = await prisma.experience.findMany({ orderBy: [{ current: 'desc' }, { startDate: 'desc' }] });
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });

  if (!profile) {
    console.log("No profile found.");
    return;
  }

  let readme = `# ${profile.fullName} | ${profile.title}\n\n`;
  if (profile.tagline) readme += `> ${profile.tagline}\n\n`;
  
  if (profile.bio) {
    readme += `## About Me\n\n${profile.bio}\n\n`;
  }

  readme += `## 📬 Contact\n\n`;
  if (profile.email) readme += `- **Email:** [${profile.email}](mailto:${profile.email})\n`;
  if (profile.location) readme += `- **Location:** ${profile.location}\n`;
  if (profile.resumeUrl) readme += `- **Resume:** [View Resume](${profile.resumeUrl})\n`;
  
  const socials = profile.socials as any;
  if (socials) {
    if (socials.github) readme += `- **GitHub:** [Profile](${socials.github})\n`;
    if (socials.linkedin) readme += `- **LinkedIn:** [Profile](${socials.linkedin})\n`;
    if (socials.facebook) readme += `- **Facebook:** [Profile](${socials.facebook})\n`;
    if (socials.website) readme += `- **Website:** [${socials.website}](${socials.website})\n`;
  }
  readme += `\n`;

  if (skills.length > 0) {
    readme += `## 💻 Skills\n\n`;
    const categories = Array.from(new Set(skills.map(s => s.category || "Other")));
    for (const cat of categories) {
      const catSkills = skills.filter(s => (s.category || "Other") === cat);
      readme += `- **${cat}:** ${catSkills.map(s => s.name).join(", ")}\n`;
    }
    readme += `\n`;
  }

  if (experiences.length > 0) {
    readme += `## 🏢 Experience & Education\n\n`;
    for (const exp of experiences) {
      const start = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const end = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : start);
      
      readme += `### ${exp.title} @ ${exp.organization}\n`;
      readme += `*${start} - ${end}*${exp.location ? ` | ${exp.location}` : ''}\n\n`;
      if (exp.description) {
        // Strip HTML if it exists, or just leave it since Markdown supports HTML
        readme += `${exp.description}\n\n`;
      }
    }
  }

  if (projects.length > 0) {
    readme += `## 🚀 Featured Projects\n\n`;
    for (const proj of projects) {
      readme += `### ${proj.title}\n`;
      if (proj.summary) readme += `${proj.summary}\n\n`;
      let links = [];
      if (proj.liveUrl) links.push(`[Live Demo](${proj.liveUrl})`);
      if (proj.repoUrl) links.push(`[Source Code](${proj.repoUrl})`);
      if (links.length > 0) readme += `${links.join(" | ")}\n\n`;
      if (proj.tags.length > 0) {
        readme += `*Tags: ${proj.tags.join(", ")}*\n\n`;
      }
    }
  }

  readme += `---\n*Generated from Portfolio Database*`;

  fs.writeFileSync(path.join(process.cwd(), "README.md"), readme, "utf-8");
  console.log("README.md generated successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
