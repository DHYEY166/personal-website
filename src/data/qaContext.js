// Chatbot prompt and offline fallback answers.
//
// Both are generated from the same data files the site renders, so the chatbot cannot drift
// out of sync with the page. The prompt uses the compact `brief` fields (one line per role,
// project, and publication) to keep each request small: Groq's free tier allows 8K tokens per
// minute, so every token in the prompt costs visitor capacity. No API keys live in client code.
import { contactItems } from './contactData.js';
import { certifications } from './certificationsData.js';
import { projects } from './projectsData.js';
import { publications } from './publicationsData.js';
import { RESUME_PDF_PATH, education, experience, technicalSkills } from './resumeData.js';

/**
 * `phi3` — Phi-3 style chat template (<|system|>…<|end|>); the proxy converts it to
 * system/user chat messages. `plain` — a single instruction block.
 */
export const HUGGINGFACE_PROMPT_STYLE = import.meta.env?.VITE_HUGGINGFACE_PROMPT_STYLE || 'phi3';

const NAME = 'Dhyey Desai';
const SITE = 'https://personal-website-dun-eta-72.vercel.app';
const EMAIL = contactItems.find((c) => c.title === 'Email')?.value;
const LINKEDIN = contactItems.find((c) => c.title === 'LinkedIn')?.link;
const GITHUB = contactItems.find((c) => c.title === 'GitHub')?.link;
const LOCATION = 'Princeton, New Jersey';
const current = experience.find((e) => e.current);

const certList = Object.entries(certifications)
  .sort(([a], [b]) => Number(b) - Number(a))
  .flatMap(([year, certs]) => certs.map((c) => ({ ...c, year })));
const featuredCerts = certList.filter((c) => /^AWS Certified/.test(c.title));
const otherCerts = certList.filter((c) => !featuredCerts.includes(c));

const short = (s) => s.replace(/\s*\(A Coforge Company\)/, '');
const projectLink = (p) => p.website || (p.github && p.github !== GITHUB ? p.github : '');

// Projects with a full line (brief + link) in the prompt; the rest share one line with their
// brief only (no link). The MS project is covered by its publication entry.
const PROMPT_FEATURED = ['policy-rag', 'beacon', 'multillm'];
const PROMPT_SKIP = ['ms-detection'];
// Generic skills that add tokens without helping answers.
const PROMPT_SKIP_SKILLS = new Set([
  'Generative AI', 'Foundation Models', 'Statistical Modeling', 'Data Mining', 'Model Deployment',
  'Optimization', 'Microsoft Excel', 'PowerPoint', 'Multimodal Pretraining',
]);
const compactSkills = (items) =>
  items
    .split(', ')
    .filter((i) => !PROMPT_SKIP_SKILLS.has(i))
    .join(', ')
    .replace(' (prompt evaluation, citation checks, fixed-set recall tests)', ' (prompt evals, citation checks, fixed-set recall tests)');

/** Compact facts block (about 1K tokens). Keep key facts; drop prose. */
export const QA_CONTEXT = [
  `${NAME}, ${LOCATION}; current role is the first EXPERIENCE entry. Email ${EMAIL}; LinkedIn ${LINKEDIN}; GitHub ${GITHUB}; contact form /#contact; resume PDF ${RESUME_PDF_PATH}.`,
  `EDUCATION: ${education
    .map((e) => `${e.degree.replace('Master of Science', 'MS').replace('Bachelor of Technology', 'B.Tech')}, ${e.school.replace(', Rajasthan', '').replace('University of Southern California', 'USC')} (${e.period.replace(' \u2013 ', '-')}, ${e.gpa})`)
    .join('; ')}. MS completed May 2026; USC graduate TA for DSCI 551/351 (100+ students).`,
  `EXPERIENCE:\n${experience
    .map((e) => `- ${e.role}, ${e.current ? e.company : short(e.company)} (${e.label}), ${e.period.replace(' \u2013 ', '-')}${e.project ? `; project ${e.project}` : ''}: ${e.brief}${e.link ? ` ${e.link.url}` : ''}`)
    .join('\n')}`,
  `PROJECTS:\n${projects
    .filter((p) => PROMPT_FEATURED.includes(p.id))
    .map((p) => `- ${p.title}: ${p.brief}${projectLink(p) ? ` ${projectLink(p)}` : ''}`)
    .join('\n')}\n- Other (code on GitHub): ${projects
    .filter((p) => !PROMPT_FEATURED.includes(p.id) && !PROMPT_SKIP.includes(p.id))
    .map((p) => `${p.title.replace(' Using Deep Learning Techniques', '')}: ${p.brief.replace(/\.$/, '').replace(/; /g, ', ')}`)
    .join('; ')}.`,
  `PUBLICATIONS:\n${publications
    .map((p) => `- "${p.title}" (${p.year}): ${p.statusKind === 'accepted' ? 'accepted and presented at the 4th Music Recommender Systems Workshop (MuRS 2026) at RecSys, Sept 28, 2026; NOT published' : `published in ${p.venue}`}. ${p.brief}${p.statusKind !== 'accepted' && p.links?.[0] ? ` ${p.links[0].url}` : ''}`)
    .join('\n')}`,
  `SKILLS: ${technicalSkills.filter((s) => s.category !== 'Cloud').map((s) => `${s.category}: ${compactSkills(s.items)}`).join('. ')}.`,
  `CERTIFICATIONS: ${featuredCerts.map((c) => `${c.title} (${c.year})`).join(', ')}; plus ${otherCerts.length} course certificates (Coursera, Udacity, AWS Academy, and others) listed on the site.`,
  `ACHIEVEMENTS: 1st place Origin Weekend: IMPACT S26 (USC, Google, TIE Hub); AWS re:Invent All Builders Welcome Grant (2025), Alumni Advisor (2026); Dean's List (2023); NUS deep learning research.`,
].join('\n');

const PORTFOLIO_SYSTEM = `You are ${NAME}'s portfolio assistant. Answer only from FACTS; if they don't cover it, say so. Never invent employers, dates, numbers, or links. Under 150 words; short Markdown bullets, **bold** names, no tables or headings; include relevant links from FACTS. Never call the MuRS 2026 paper published.

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

/* ---------- Offline fallback answers (used when the API fails), in Markdown ---------- */

const bullets = (items) => items.map((i) => `- ${i}`).join('\n');
const link = (label, url) => (url ? `[${label}](${url})` : label);

const answers = {
  current: () => `**${current.role}** at **${current.company}**
${current.location} · ${current.period}
Project: ${current.project} (${current.label})

${bullets(current.bullets)}

**Stack:** ${current.stack}`,

  experience: () =>
    experience
      .map((e) => `**${e.role}**, ${e.company} (${e.period})\n${e.label} · ${e.location}\n${bullets(e.bullets)}`)
      .join('\n\n'),

  education: () => `${education
    .map((e) => `**${e.degree}**\n${e.school} · ${e.period} · ${e.gpa}\nCoursework: ${e.coursework}`)
    .join('\n\n')}

He completed the USC master's in May 2026 and was a graduate teaching assistant for DSCI 551 and DSCI 351.`,

  skills: () => bullets(technicalSkills.map((s) => `**${s.category}:** ${s.items}`)),

  projects: () =>
    bullets(projects.map((p) => `**${link(p.title, projectLink(p))}**: ${p.brief}`)),

  publications: () =>
    bullets(
      publications.map(
        (p) =>
          `**${p.title}**, ${p.venue}. *${p.status}*. ${p.brief}${p.links?.length ? ` ${p.links.map((l) => link(l.label, l.url)).join(' · ')}` : ''}`,
      ),
    ),

  certifications: () =>
    bullets(certList.map((c) => `**${c.title}**, ${c.institution} (${c.year})`)),

  achievements: () =>
    bullets([
      '**Origin Weekend: IMPACT S26**: first place (USC, Google, and TIE Hub)',
      '**Graduate Teaching Assistant**, DSCI 551 and DSCI 351 at USC: 100+ students, weekly sections, assignment design',
      '**AWS re:Invent**: All Builders Welcome Grant recipient (2025) and Alumni Advisor (2026)',
      "**Dean's List** (2023)",
      '**Deep learning research**, National University of Singapore: privacy-preserving facial analysis',
    ]),

  contact: () => bullets([
    `**Email:** ${EMAIL}`,
    `**Location:** ${LOCATION}`,
    `**LinkedIn:** ${LINKEDIN}`,
    `**GitHub:** ${GITHUB}`,
    `Or use the [contact form](/#contact) on the home page.`,
  ]),

  summary: () => `**${NAME}** is an ${current.role} at ${current.company} in ${LOCATION}, building agentic AI, RAG pipelines, and LLM evaluation for enterprise clients.

${bullets([
  `**Experience:** ${experience.map((e) => `${e.role} at ${short(e.company)} (${e.period})`).join('; ')}`,
  `**Education:** ${education.map((e) => `${e.degree}, ${e.school}`).join('; ')}`,
  `**Publications:** ${publications.map((p) => `${p.venue.split(',')[0]} (${p.statusKind === 'accepted' ? 'accepted and presented' : 'published'})`).join('; ')}`,
  `**Certifications:** ${featuredCerts.map((c) => `${c.title} (${c.year})`).join(', ')}`,
])}`,
};

// Checked in order; the first rule with a matching keyword wins.
const RULES = [
  ['contact', ['contact', 'email', 'reach', 'linkedin', 'hire']],
  ['publications', ['publication', 'publish', 'paper', 'research', 'ieee', 'mdpi', 'murs', 'recsys', 'journal']],
  ['certifications', ['certification', 'certificate', 'certified', 'aws', 'coursera', 'credential']],
  ['education', ['education', 'degree', 'study', 'studied', 'university', 'usc', 'master', 'masters', 'gpa', 'college', 'graduat']],
  ['current', ['current', 'now', 'momentuum', 'coforge', 'forward deployed', 'today']],
  ['projects', ['project', 'beacon', 'multillm', 'rag assistant', 'chatdb', 'built', 'portfolio']],
  ['experience', ['experience', 'work', 'job', 'intern', 'starcycle', 'onawa', 'genpact', 'career', 'company', 'employ']],
  ['skills', ['skill', 'technolog', 'technical', 'programming', 'language', 'python', 'stack', 'tools']],
  ['achievements', ['achievement', 'award', 'recognition', 'won', 'grant', "dean's", 'teaching']],
  ['summary', ['summary', 'resume', 'overview', 'who is', 'about', 'background', 'tell me']],
];

export const getFallbackResponse = (question) => {
  const q = String(question || '').toLowerCase();
  for (const [key, keywords] of RULES) {
    if (keywords.some((k) => q.includes(k))) return answers[key]();
  }
  return "I can help you learn about Dhyey's background! Try asking: *What is his current role?*, *What has he published?*, *Tell me about his projects*, *Where did he study?*, or *How can I contact him?*";
};
