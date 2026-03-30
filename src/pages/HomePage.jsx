import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import CertificationsSection from '../sections/CertificationsSection';
import ResumeSection from '../sections/ResumeSection';
import ContactSection from '../sections/ContactSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificationsSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}
