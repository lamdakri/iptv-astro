import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

const PUBLICATION_NAME = "IPTV 4K World";
const SITE_URL = "https://iptv4kworld.com";

// Language code → Google News locale mapping
const LANG_LOCALE_MAP: Record<string, string> = {
  en: "en",
  fr: "fr",
  ar: "ar",
  es: "es",
  de: "de",
  it: "it",
  pt: "pt",
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const allPosts = await getCollection("blog", ({ data }) => !data.draft);

  const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Filter to posts published in the last 48 hours
  const recentPosts = allPosts.filter((post) => post.data.date >= cutoffDate);

  const urlItems = recentPosts
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.data.lang}/blog/${post.id}/`;
      const pubDate = post.data.date.toISOString();
      const lang = LANG_LOCALE_MAP[post.data.lang] || "en";

      return `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.data.title)}</news:title>${post.data.keywords?.length ? `
      <news:keywords>${escapeXml(post.data.keywords.join(", "))}</news:keywords>` : ""}
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlItems}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
