// Writing/blog post data
// To add a new writing:
// 1. Create a .md file in /content/writing/{id}.md
// 2. Add an entry to the 'writings' array below
// 3. Import the markdown content and add it to 'writingContent'

// Import markdown content (Vite handles ?raw as raw strings)
import batchReportingTool from '../../content/writing/batch-reporting-tool.md?raw';

export interface WritingMeta {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

// Writing metadata for the XMB menu
export const writings: WritingMeta[] = [
  {
    id: 'batch-reporting-tool',
    title: 'A Simple Batch Reporting Tool',
    date: '2025-12-16',
    description: 'How a straightforward automation script transformed a tedious healthcare reporting process',
    tags: ['healthcare', 'automation', 'python'],
  },
  // To add more writings:
  // 1. Import: import myNewArticle from '../../content/writing/my-new-article.md?raw';
  // 2. Add metadata here:
  // {
  //   id: 'my-new-article',
  //   title: 'My New Article Title',
  //   date: '2025-01-15',
  //   description: 'A brief description',
  //   tags: ['tag1', 'tag2'],
  // },
  // 3. Add to writingContent below: 'my-new-article': myNewArticle,
];

// Map of writing ID to markdown content
export const writingContent: Record<string, string> = {
  'batch-reporting-tool': batchReportingTool,
};

// Helper to get content by ID (strips frontmatter)
export function getWritingContent(id: string): string | null {
  const content = writingContent[id];
  if (!content) return null;

  // Strip frontmatter (content between --- markers)
  const frontmatterRegex = /^---[\s\S]*?---\n*/;
  return content.replace(frontmatterRegex, '').trim();
}
