import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(["es", "en"]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
  }),
});

const serviceSchema = z.object({
  page: z.object({
    title: z.string(),
    intro: z.string(),
    ctaLabel: z.string(),
  }),
  services: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      pitch: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
});

const services = defineCollection({
  loader: file("./src/content/services/services.json"),
  schema: serviceSchema,
});

const projectSchema = z.object({
  page: z.object({
    title: z.string(),
    intro: z.string(),
    ctaLabel: z.string(),
  }),
  projects: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      pitch: z.string(),
      highlight: z.string().optional(),
      tags: z.array(z.string()),
      url: z.string().url(),
      featured: z.boolean().default(false),
    }),
  ),
});

const projects = defineCollection({
  loader: file("./src/content/projects/projects.json"),
  schema: projectSchema,
});

export const collections = { blog, about, services, projects };
