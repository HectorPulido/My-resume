export interface YoutubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published: Date;
}

const CHANNEL_ID = "UCS_iMeH0P0nsIDPvBaJckOw";
const HANDLE_URL = "https://www.youtube.com/@Hector.Pulido/videos";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const FETCH_TIMEOUT_MS = 8000;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pickTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = block.match(re);
  return match ? match[1].trim() : null;
}

function pickAttr(block: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`);
  const match = block.match(re);
  return match ? match[1] : null;
}

function parseFeed(xml: string): YoutubeVideo[] {
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  const videos: YoutubeVideo[] = [];
  let match: RegExpExecArray | null;

  while ((match = entryRe.exec(xml)) !== null) {
    const entry = match[1];
    const id = pickTag(entry, "yt:videoId");
    const title = pickTag(entry, "title");
    const published = pickTag(entry, "published");
    const link = pickAttr(entry, "link", "href");
    const thumbnail = pickAttr(entry, "media:thumbnail", "url");

    if (!id || !title || !published) continue;

    videos.push({
      id,
      title: decodeEntities(title),
      url: link ?? `https://www.youtube.com/watch?v=${id}`,
      thumbnail: thumbnail ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published: new Date(published),
    });
  }

  return videos;
}

let cachedFetch: Promise<YoutubeVideo[]> | null = null;

async function fetchAll(): Promise<YoutubeVideo[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(FEED_URL, {
      signal: controller.signal,
      headers: { "User-Agent": "hectorpulido.net build" },
    });
    if (!res.ok) {
      console.warn(`[youtube] feed responded ${res.status}, skipping videos section`);
      return [];
    }
    const xml = await res.text();
    return parseFeed(xml);
  } catch (err) {
    console.warn(`[youtube] failed to fetch feed: ${(err as Error).message}. Skipping videos section.`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getLatestVideos(count = 3): Promise<YoutubeVideo[]> {
  if (!cachedFetch) {
    cachedFetch = fetchAll();
  }
  const all = await cachedFetch;
  return all.slice(0, count);
}

export const channelUrl = HANDLE_URL;
