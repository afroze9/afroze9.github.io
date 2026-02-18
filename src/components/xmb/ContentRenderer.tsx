import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Profile, Experience, Project, Skill, Education, ContactLinks, OpenSourceProject } from '../../types';
import { getWritingContent, type WritingMeta } from '../../data/writings';

interface ContentRendererProps {
  itemId: string;
  data: unknown;
}

// Type guards
function isProfile(data: unknown): data is Profile {
  return typeof data === 'object' && data !== null && 'name' in data && 'bio' in data;
}

function isExperience(data: unknown): data is Experience {
  return typeof data === 'object' && data !== null && 'company' in data && 'title' in data && 'achievements' in data;
}

function isProject(data: unknown): data is Project {
  return typeof data === 'object' && data !== null && 'name' in data && 'technologies' in data && 'role' in data;
}

function isSkill(data: unknown): data is Skill {
  return typeof data === 'object' && data !== null && 'name' in data && 'description' in data && !('company' in data);
}

function isEducationArray(data: unknown): data is Education[] {
  return Array.isArray(data) && data.length > 0 && 'degree' in data[0];
}

function isContactLinks(data: unknown): data is ContactLinks {
  return typeof data === 'object' && data !== null && 'email' in data && 'linkedin' in data;
}

function isPhilosophy(data: unknown): data is string[] {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'string';
}

function isWriting(data: unknown): data is { type: 'writing' } & WritingMeta {
  return typeof data === 'object' && data !== null && 'type' in data && (data as { type: string }).type === 'writing';
}

function isOpenSource(data: unknown): data is OpenSourceProject {
  return typeof data === 'object' && data !== null && 'url' in data && 'language' in data && 'tags' in data;
}

// Markdown wrapper with consistent styling
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: 'white' }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px', color: 'white' }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', marginTop: '16px', color: 'white' }}>
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p style={{ marginBottom: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul style={{ marginBottom: '12px', paddingLeft: '20px', color: 'rgba(255,255,255,0.9)' }}>
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li style={{ marginBottom: '6px', lineHeight: 1.5 }}>{children}</li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6eb5ff', textDecoration: 'underline' }}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong style={{ fontWeight: 600, color: 'white' }}>{children}</strong>
        ),
        code: ({ children }) => (
          <code
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// Tag/pill component for technologies
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: 'rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.9)',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        marginRight: '6px',
        marginBottom: '6px',
      }}
    >
      {label}
    </span>
  );
}

// Profile content
function ProfileContent({ data }: { data: Profile }) {
  const markdown = `
${data.bio}

## Stats

- **${data.stats.yearsExperience}+** years of experience
- **${data.stats.engineersLed}+** engineers led
- **${data.stats.developersImpacted}+** developers impacted
- **${data.stats.clientsServed}+** clients served
  `.trim();

  return <MarkdownContent content={markdown} />;
}

// Experience content
function ExperienceContent({ data }: { data: Experience }) {
  const markdown = `
## ${data.company}
**${data.startYear} – ${data.endYear ?? 'Present'}**

${data.description}

### Key Achievements
${data.achievements.map((a) => `- ${a}`).join('\n')}
  `.trim();

  return (
    <div>
      <MarkdownContent content={markdown} />
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
          Technologies
        </h3>
        <div>
          {data.technologies.map((tech) => (
            <Tag key={tech} label={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Project content
function ProjectContent({ data }: { data: Project }) {
  const markdown = `
**${data.role}** · ${data.year}

${data.description}
  `.trim();

  return (
    <div>
      <MarkdownContent content={markdown} />
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
          Technologies
        </h3>
        <div>
          {data.technologies.map((tech) => (
            <Tag key={tech} label={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skill content
function SkillContent({ data }: { data: Skill }) {
  return <MarkdownContent content={data.description} />;
}

// Education content
function EducationContent({ data }: { data: Education[] }) {
  const markdown = data
    .map((edu) => `### ${edu.degree}\n**${edu.institution}** · ${edu.year}`)
    .join('\n\n');

  return <MarkdownContent content={markdown} />;
}

// Contact content
function ContactContent({ data }: { data: ContactLinks }) {
  const markdown = `
- **Email:** [${data.email}](mailto:${data.email})
- **LinkedIn:** [linkedin.com/in/afrozeamjad](${data.linkedin})
- **GitHub:** [github.com/afrozeamjad](${data.github})
  `.trim();

  return <MarkdownContent content={markdown} />;
}

// Philosophy content
function PhilosophyContent({ data }: { data: string[] }) {
  const markdown = data.map((p, i) => `${i + 1}. ${p}`).join('\n');
  return <MarkdownContent content={markdown} />;
}

// Credits content
function CreditsContent() {
  const markdown = `
This portfolio is built as a PS3-style XMB (XrossMediaBar) interface.

### Technologies Used
- **React** - UI framework
- **PixiJS** - WebGL rendering for wave background
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Lucide** - Icons

### Inspiration
The PlayStation 3's iconic XMB interface, known for its elegant horizontal-vertical navigation and ambient wave backgrounds.

### Created By
Afroze Amjad · 2024
  `.trim();

  return <MarkdownContent content={markdown} />;
}

// Open Source content
function OpenSourceContent({ data }: { data: OpenSourceProject }) {
  const markdown = `
${data.description}

### Language
${data.language}

### Repository
[View on GitHub](${data.url})
  `.trim();

  return (
    <div>
      <MarkdownContent content={markdown} />
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
          Tags
        </h3>
        <div>
          {data.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Writing/article content
function WritingContent({ data }: { data: WritingMeta }) {
  const content = getWritingContent(data.id);

  if (!content) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>
        Article content not found.
      </p>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
        {data.date} · {data.tags.map((tag) => <Tag key={tag} label={tag} />)}
      </div>
      <MarkdownContent content={content} />
    </div>
  );
}

export function ContentRenderer({ itemId, data }: ContentRendererProps) {
  // Handle specific item types
  if (itemId === 'credits') {
    return <CreditsContent />;
  }

  if (isWriting(data)) {
    return <WritingContent data={data} />;
  }

  if (itemId === 'about' && isProfile(data)) {
    return <ProfileContent data={data} />;
  }

  if (itemId === 'philosophy' && isPhilosophy(data)) {
    return <PhilosophyContent data={data} />;
  }

  if (itemId === 'education' && isEducationArray(data)) {
    return <EducationContent data={data} />;
  }

  if (itemId === 'contact' && isContactLinks(data)) {
    return <ContactContent data={data} />;
  }

  if (isExperience(data)) {
    return <ExperienceContent data={data} />;
  }

  if (isProject(data)) {
    return <ProjectContent data={data} />;
  }

  if (isOpenSource(data)) {
    return <OpenSourceContent data={data} />;
  }

  if (isSkill(data)) {
    return <SkillContent data={data} />;
  }

  // Fallback: render as JSON (for debugging)
  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
