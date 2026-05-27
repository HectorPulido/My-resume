import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "@/i18n/ui";

export type BlogEntry = CollectionEntry<"blog">;

function pathSegments(entry: BlogEntry): string[] {
  return entry.id.split("/");
}

function localeOf(entry: BlogEntry): Lang | undefined {
  const segs = pathSegments(entry);
  const head = segs[0];
  if (head === "es" || head === "en") return head;
  return entry.data.lang;
}

export function slugOf(entry: BlogEntry): string {
  const segs = pathSegments(entry);
  const last = segs[segs.length - 1] ?? entry.id;
  return last.replace(/\.md$/, "");
}

export async function getPostsFor(lang: Lang): Promise<BlogEntry[]> {
  const all = await getCollection("blog", (e) => !e.data.draft);
  return all
    .filter((e) => localeOf(e) === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function hasPostsFor(lang: Lang): Promise<boolean> {
  const posts = await getPostsFor(lang);
  return posts.length > 0;
}
