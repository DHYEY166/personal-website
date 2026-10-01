import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import PublicationsSection from '../sections/PublicationsSection';
import CertificationsSection from '../sections/CertificationsSection';
import ResumeSection from '../sections/ResumeSection';
import ContactSection from '../sections/ContactSection';

export default function HomePage() {
  const { hash } = useLocation();

  // Scroll to /#section on first load and when arriving from another route.
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    scroll();
    // Re-run once fonts and in-view animations have settled, in case layout moved.
    const timer = setTimeout(scroll, 400);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <main id="main">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <PublicationsSection />
      <CertificationsSection />
      <ResumeSection />
      <ContactSection />
    </main>
  );
}
