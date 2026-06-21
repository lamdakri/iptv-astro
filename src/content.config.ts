import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).default([]),
    date: z.date(),
    updatedDate: z.date().optional(),
    lang: z.enum(['en', 'fr', 'ar', 'es', 'de', 'it', 'pt']).default('en'),
    author: z.string().default('IPTV 4K World Team'),
    image: image().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
      url: z.string().optional(),
      image: z.string().optional(),
    })).optional(),
  }),
});

const seoPages = defineCollection({
  type: 'data',
  schema: z.object({
    keyword: z.string(),
    slug: z.string(),
    languages: z.record(
      z.enum(['en', 'fr', 'ar', 'es', 'de', 'it', 'pt']),
      z.object({
        title: z.string(),
        description: z.string(),
        h1: z.string(),
        h2s: z.array(z.string()).default([]),
        content: z.string(),
        faqs: z.array(z.object({
          question: z.string(),
          answer: z.string(),
        })).default([]),
        internalLinks: z.array(z.object({
          text: z.string(),
          url: z.string(),
        })).default([]),
      })
    ),
    targetCountries: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, seoPages };
