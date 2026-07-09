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

  const socials = (profile.socials as any) || {};
  let githubUsername = "";
  if (socials.github) {
    const parts = socials.github.split("/");
    githubUsername = parts[parts.length - 1] || parts[parts.length - 2]; // handle trailing slash
  }

  let readme = `<div align="center">\n\n`;
  
  // Header Animation
  const typingUrl = `https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1000&color=22D3EE&center=true&vCenter=true&width=600&lines=${encodeURIComponent(profile.fullName)};${encodeURIComponent(profile.title)}`;
  readme += `  <img src="${typingUrl}" alt="Typing SVG" />\n\n`;

  if (profile.tagline) {
    readme += `  <p align="center"><b>${profile.tagline}</b></p>\n\n`;
  }

  // Social Badges
  readme += `  <p align="center">\n`;
  if (profile.email) {
    readme += `    <a href="mailto:${profile.email}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>\n`;
  }
  if (socials.linkedin) {
    readme += `    <a href="${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>\n`;
  }
  if (socials.github) {
    readme += `    <a href="${socials.github}"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>\n`;
  }
  if (socials.facebook) {
    readme += `    <a href="${socials.facebook}"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" /></a>\n`;
  }
  if (socials.website) {
    readme += `    <a href="${socials.website}"><img src="https://img.shields.io/badge/Website-3b82f6?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" /></a>\n`;
  }
  readme += `  </p>\n\n`;

  readme += `</div>\n\n`;
  
  readme += `---\n\n`;

  if (profile.bio) {
    readme += `## 👨‍💻 About Me\n\n${profile.bio}\n\n`;
  }

  if (skills.length > 0) {
    readme += `## 🛠️ Tech Stack & Skills\n\n`;
    const categories = Array.from(new Set(skills.map(s => s.category || "Other")));
    for (const cat of categories) {
      const catSkills = skills.filter(s => (s.category || "Other") === cat);
      readme += `**${cat}**<br>\n`;
      // Generate badges for skills
      const skillBadges = catSkills.map(s => {
        const name = encodeURIComponent(s.name);
        return `<img src="https://img.shields.io/badge/-${name}-27272a?style=flat&logo=${name}&logoColor=white" alt="${s.name}" />`;
      });
      readme += `<p>${skillBadges.join(" ")}</p>\n\n`;
    }
  }

  if (experiences.length > 0) {
    readme += `## 🏢 Experience & Education\n\n`;
    for (const exp of experiences) {
      const start = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const end = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : start);
      
      const emoji = exp.type === 'WORK' ? '💼' : '🎓';
      readme += `### ${emoji} ${exp.title} @ ${exp.organization}\n`;
      readme += `> 📅 *${start} - ${end}* &nbsp; | &nbsp; 📍 *${exp.location || 'Remote'}*\n\n`;
      if (exp.description) {
        readme += `${exp.description}\n\n`;
      }
    }
  }

  if (projects.length > 0) {
    readme += `## 🚀 Featured Projects\n\n`;
    
    // Create a table for projects to make them look like cards
    readme += `<table>\n`;
    for (let i = 0; i < projects.length; i += 2) {
      const p1 = projects[i];
      const p2 = projects[i + 1];
      
      readme += `  <tr>\n`;
      
      // Column 1
      readme += `    <td width="50%" valign="top">\n`;
      readme += `      <h4>${p1.title}</h4>\n`;
      if (p1.summary) readme += `      <p>${p1.summary}</p>\n`;
      if (p1.tags.length > 0) readme += `      <code>${p1.tags.join("</code> <code>")}</code><br><br>\n`;
      let links1 = [];
      if (p1.liveUrl) links1.push(`<a href="${p1.liveUrl}">Live Demo</a>`);
      if (p1.repoUrl) links1.push(`<a href="${p1.repoUrl}">Source Code</a>`);
      if (links1.length > 0) readme += `      ${links1.join(" | ")}\n`;
      readme += `    </td>\n`;
      
      // Column 2
      if (p2) {
        readme += `    <td width="50%" valign="top">\n`;
        readme += `      <h4>${p2.title}</h4>\n`;
        if (p2.summary) readme += `      <p>${p2.summary}</p>\n`;
        if (p2.tags.length > 0) readme += `      <code>${p2.tags.join("</code> <code>")}</code><br><br>\n`;
        let links2 = [];
        if (p2.liveUrl) links2.push(`<a href="${p2.liveUrl}">Live Demo</a>`);
        if (p2.repoUrl) links2.push(`<a href="${p2.repoUrl}">Source Code</a>`);
        if (links2.length > 0) readme += `      ${links2.join(" | ")}\n`;
        readme += `    </td>\n`;
      } else {
        readme += `    <td width="50%" valign="top"></td>\n`;
      }
      
      readme += `  </tr>\n`;
    }
    readme += `</table>\n\n`;
  }

  // Footer animation
  readme += `\n<div align="center">\n`;
  readme += `  <img src="https://capsule-render.vercel.app/api?type=waving&color=38bdf8&height=100&section=footer" />\n`;
  readme += `  <p><i>Auto-generated from Portfolio CMS Database 🚀</i></p>\n`;
  readme += `</div>\n`;

  fs.writeFileSync(path.join(process.cwd(), "README.md"), readme, "utf-8");
  console.log("Enhanced README.md generated successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
