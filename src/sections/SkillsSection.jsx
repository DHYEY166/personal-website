import { useTheme } from '../styles/useTheme';
import { sectionStyle } from '../styles/theme';
import { skillCategories } from '../data/skillsData';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';

const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

export default function SkillsSection() {
  const { theme } = useTheme();

  return (
    <section id="skills" aria-labelledby="skills-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
        <SectionHeader
          id="skills-title"
          kicker="WHAT I WORK WITH"
          title="Technical Skills"
          intro={`${totalSkills} skills across ${skillCategories.length} categories`}
        />

        <ScrollReveal>
          <div style={{ borderTop: `2px solid ${theme.text.primary}` }}>
            {skillCategories.map((cat) => (
              <div key={cat.title} className="skill-row">
                <h3 style={{ fontSize: 19, fontWeight: 600 }}>
                  {cat.title}
                  <span
                    aria-label={`${cat.skills.length} skills`}
                    style={{
                      marginLeft: 8,
                      fontFamily: theme.font.sans,
                      fontSize: 14,
                      fontWeight: 500,
                      color: theme.text.muted,
                    }}
                  >
                    {cat.skills.length}
                  </span>
                </h3>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none' }}>
                  {cat.skills.map((skill) => (
                    <li key={skill.name} className="tag">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
