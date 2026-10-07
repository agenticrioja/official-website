import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    tba: z.boolean().default(false),
    venue: z.string().optional(),
    lumaUrl: z.url().optional(),
    summary: z.string(),
    speakers: z.array(z.string()).default([]),
  }),
});

const organizers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/organizers' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    photo: image().optional(),
    role: z.string().default('Organizer'),
    company: z.string().optional(),
    bio: z.string().optional(),
    order: z.number().default(0),
    badge: z.enum(['agent', 'colour']).default('agent'),
    linkedin: z.url().optional(),
    github: z.url().optional(),
    website: z.url().optional(),
  }),
});

export const collections = { events, organizers };
