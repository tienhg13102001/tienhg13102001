import {
  getFeaturedProjects,
  getProfile,
  getSkills,
} from "@/lib/queries";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default async function HomePage() {
  const [profile, skills, featuredProjects] = await Promise.all([
    getProfile(),
    getSkills(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <FeaturedProjectsSection projects={featuredProjects} />
      <ContactSection profile={profile} />
    </>
  );
}
