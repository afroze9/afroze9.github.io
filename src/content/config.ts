import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    company: z.string().optional(),
    category: z.enum(['ai', 'architecture', 'platform', 'devops', 'integration']),
    problem: z.string(),
    solution: z.string(),
    role: z.string(),
    impact: z.string(),
    technologies: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const writingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
  writing: writingCollection,
};
