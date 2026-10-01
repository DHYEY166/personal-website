// Chatbot prompt and offline fallback answers.
//
// Everything here is generated from the same data files the site renders, so the
// chatbot cannot drift out of sync with the page. The browser sends the prompt to the
// same-origin serverless proxy at /api/hf-chat; no API keys live in client code.
import { heroText } from './aboutData';
import { contactItems } from './contactData';
import { certifications } from './certificationsData';
import { projects } from './projectsData';
import { publications } from './publicationsData';
import {
  education,
  experience,
  resumeProjects,
  technicalSkills,
  achievements,
} from './resumeData';

/**
 * `phi3` — Phi-3 style chat template (<|system|>…<|end|>); the proxy converts it to
 * system/user chat messages. `plain` — a single instruction block.
 */
export const HUGGINGFACE_PROMPT_STYLE = import.meta.env.VITE_HUGGINGFACE_PROMPT_STYLE || 'phi3';

const NAME = 'Dhyey Desai';
const EMAIL = contactItems.find((c) => c.title === 'Email')?.value;
const LINKEDIN = contactItems.find((c) => c.title === 'LinkedIn')?.link;
const GITHUB = contactItems.find((c) => c.title === 'GitHub')?.link;
const LOCATION = 'Princeton, New Jersey';
const current = experience.find((e) => e.current);

const certList = Object.entries(certifications)
  .sort(([a], [b]) => Number(b) - Number(a))
  .flatMap(([year, certs]) => certs.map((c) => ({ ...c, year })));

const fmtExperience = (e) =>
  `${e.role}, ${e.company} (${e.label}; ${e.location}; ${e.period})${e.project ? ` — project: ${e.project}` : ''}: ${e.bullets.join(' ')}${e.stack ? ` Stack: ${e.stack}.` : ''}`;

const fmtPublication = (p) =>
  `"${p.title}" — ${p.venue}. Status: ${p.status}.${p.summary ? ` ${p.summary}` : ''}`;

export const QA_CONTEXT = [
  `${NAME} is an ${heroText.role} at ${current.company}, based in ${LOCATION}. Email: ${EMAIL}. LinkedIn: ${LINKEDIN}. GitHub: ${GITHUB}.`,
  `Education: ${education.map((e) => `${e.degree}, ${e.school} (${e.gpa}, ${e.period})`).join('; ')}. The USC master's degree is completed (graduated May 2026).`,
  `Professional experience (most recent first): ${experience.map(fmtExperience).join(' | ')}`,
  `Selected projects: ${resumeProjects.map((p) => `${p.name}${p.period ? ` (${p.period})` : ''}: ${p.bullets.join(' ')}`).join(' | ')}`,
  `Other portfolio projects: ${projects
    .filter((p) => !resumeProjects.some((r) => r.name.toLowerCase().startsWith(p.title.toLowerCase())))
    .map((p) => `${p.title} (${p.badge?.text}): ${p.description}`)
    .join(' | ')}`,
  `Publications: ${publications.map(fmtPublication).join(' | ')}`,
  `Technical skills: ${technicalSkills.map((s) => `${s.category}: ${s.items}`).join('; ')}.`,
  `Certifications: ${certList.map((c) => `${c.title} (${c.institution}, ${c.year})`).join('; ')}.`,
  `Achievements: ${achievements.join(' ')}`,
].join('\n\n');

const PORTFOLIO_SYSTEM = `You are ${NAME}'s portfolio assistant. Answer visitors using ONLY the FACTS below. Rules:
- Be concise, friendly, and accurate (short paragraphs or bullets).
- If the FACTS do not contain the answer, say you do not have that information — do not invent employers, dates, links, or projects.
- Describe the MuRS 2026 paper as accepted and presented at the workshop, not as published.
- Do not claim to browse the web or access files outside the FACTS.

FACTS:
`;

function buildPhi3ChatInput(userMessage) {
  const systemBlock = `${PORTFOLIO_SYSTEM}${QA_CONTEXT}`;
  return `<|system|>\n${systemBlock}\n<|end|>\n<|user|>\n${userMessage.trim()}\n<|end|>\n<|assistant|>\n`;
}

function buildPlainInstructInput(userMessage) {
  return `${PORTFOLIO_SYSTEM}${QA_CONTEXT}\n\nQuestion: ${userMessage.trim()}\n\nAnswer:`;
}

/** Full prompt string sent to /api/hf-chat */
export function buildHuggingFaceInputs(userMessage) {
  const style = String(HUGGINGFACE_PROMPT_STYLE).toLowerCase();
  if (style === 'plain' || style === 'dialo') {
    return buildPlainInstructInput(userMessage);
  }
  return buildPhi3ChatInput(userMessage);
}

/* ---------- Offline fallback answers (used when the API fails) ---------- */

const bullets = (items) => items.map((i) => `• ${i}`).join('\n');

const answers = {
  current: () => `DHYEY'S CURRENT ROLE

${current.role} — ${current.company}
${current.location} · ${current.period}
Project: ${current.project} (${current.label})

${bullets(current.bullets)}

Stack: ${current.stack}`,

  experience: () => `DHYEY'S PROFESSIONAL EXPERIENCE

${experience
  .map((e) => `${e.company.toUpperCase()} — ${e.role} (${e.period})\n${e.label} · ${e.location}\n${bullets(e.bullets)}`)
  .join('\n\n')}`,

  education: () => `DHYEY'S EDUCATION

${education.map((e) => `${e.degree}\n${e.school} · ${e.period} · ${e.gpa}\nCoursework: ${e.coursework}`).join('\n\n')}

He completed the USC master's in May 2026 and was a graduate teaching assistant for DSCI 551 and DSCI 351.`,

  skills: () => `DHYEY'S TECHNICAL SKILLS

${technicalSkills.map((s) => `${s.category.toUpperCase()}:\n${s.items}`).join('\n\n')}`,

  projects: () => `DHYEY'S PROJECTS

${projects.map((p) => `${p.title}${p.badge ? ` (${p.badge.text})` : ''}\n${p.description}${p.github ? `\nCode: ${p.github}` : ''}`).join('\n\n')}`,

  publications: () => `DHYEY'S PUBLICATIONS

${publications.map((p) => `${p.title}\n${p.venue} — ${p.status}${p.summary ? `\n${p.summary}` : ''}`).join('\n\n')}`,

  certifications: () => `DHYEY'S CERTIFICATIONS

${Object.entries(certifications)
  .sort(([a], [b]) => Number(b) - Number(a))
  .map(([year, certs]) => `${year}:\n${bullets(certs.map((c) => `${c.title} (${c.institution})`))}`)
  .join('\n\n')}`,

  achievements: () => `DHYEY'S ACHIEVEMENTS

${bullets(achievements)}`,

  contact: () => `CONTACT DHYEY DESAI

Email: ${EMAIL}
Location: ${LOCATION}
LinkedIn: ${LINKEDIN}
GitHub: ${GITHUB}

You can also use the contact form on the home page.`,

  summary: () => `DHYEY DESAI — SUMMARY

${heroText.tagline}

Experience: ${experience.map((e) => `${e.role} at ${e.company} (${e.period})`).join('; ')}
Education: ${education.map((e) => `${e.degree}, ${e.school}`).join('; ')}
Publications: ${publications.map((p) => `${p.title} (${p.venue}; ${p.statusKind === 'accepted' ? 'accepted and presented' : 'published'})`).join('; ')}
Certifications: ${certList.slice(0, 2).map((c) => `${c.title} (${c.year})`).join(', ')}`,
};

// Checked in order; the first rule with a matching keyword wins.
const RULES = [
  ['contact', ['contact', 'email', 'reach', 'linkedin', 'hire']],
  ['publications', ['publication', 'paper', 'research', 'ieee', 'mdpi', 'murs', 'recsys', 'published', 'journal']],
  ['certifications', ['certification', 'certificate', 'certified', 'aws', 'coursera', 'credential']],
  ['education', ['education', 'degree', 'study', 'studied', 'university', 'usc', 'master', 'masters', 'gpa', 'college', 'graduat']],
  ['current', ['current', 'now', 'momentuum', 'coforge', 'forward deployed', 'today']],
  ['experience', ['experience', 'work', 'job', 'intern', 'starcycle', 'onawa', 'genpact', 'career', 'company', 'employ']],
  ['projects', ['project', 'beacon', 'multillm', 'rag assistant', 'chatdb', 'built', 'portfolio']],
  ['skills', ['skill', 'technolog', 'technical', 'programming', 'language', 'python', 'stack', 'tools']],
  ['achievements', ['achievement', 'award', 'recognition', 'won', 'grant', "dean's", 'teaching']],
  ['summary', ['summary', 'resume', 'overview', 'who is', 'about', 'background', 'tell me']],
];

export const getFallbackResponse = (question) => {
  const q = String(question || '').toLowerCase();
  for (const [key, keywords] of RULES) {
    if (keywords.some((k) => q.includes(k))) return answers[key]();
  }
  return "I can help you learn about Dhyey's background! Try asking: 'What is his current role?', 'What has he published?', 'Tell me about his projects', 'Where did he study?', or 'How can I contact him?'";
};
