// Projects and collaborators, edited by the studio in Keystatic (/keystatic).
// Both pages read from here, so a change in the editor updates the whole site.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { SECTORS } from '../keystatic.config';

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      hidden: z.boolean().default(false),
      order: z.number().int().nullish().transform((v) => v ?? 99),
      sector: z.enum(SECTORS),
      location: z.string(),
      year: z.coerce.number().int(),
      summary: z.string().nullish().transform((v) => v ?? ''),
      cover: image(),
      coverAlt: z.string(),
      entries: z
        .array(
          z.object({
            kind: z.enum(['drawing', 'installation']),
            image: image(),
            alt: z.string(),
            caption: z.string().nullish().transform((v) => v ?? ''),
            hidden: z.boolean().default(false),
          }),
        )
        .default([]),
    }),
});

// Keystatic keeps the logos as one ordered list; position in the list is the order on the page.
const collaborators = defineCollection({
  loader: file('src/content/collaborators.yaml', {
    parser: (text) =>
      ((parse(text)?.logos ?? []) as Record<string, unknown>[]).map((logo, i) => ({ id: String(i + 1), order: i + 1, ...logo })),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image().nullish(),
      order: z.number().int(),
      hidden: z.boolean().default(false),
    }),
});

export const collections = { projects, collaborators };
