import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import remarkWhatsAppNumber from "./src/plugins/remark-whatsapp-number.mjs";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Build a map of blog post slugs → frontmatter dates for real lastmod values
const blogDateMap = {};
const blogDir = path.resolve("src/content/blog");
try {
  const files = fs.readdirSync(blogDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(blogDir, file), "utf8");
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    if (dateMatch) {
      const slug = file.replace(/\.md$/, "");
      blogDateMap[slug] = new Date(dateMatch[1]);
    }
  }
  console.log(`📅 Loaded ${Object.keys(blogDateMap).length} blog dates for sitemap lastmod`);
} catch {
  // Silently fall back — blog posts will use the build date
  console.warn("⚠ Could not read blog dates, using build date for all lastmod values");
}

// Helper: extract blog post slug from sitemap URL
function getBlogPostDate(url) {
  const match = url.match(/\/blog\/([^/]+)\/$/);
  if (!match) return null;
  return blogDateMap[match[1]] || null;
}

export default defineConfig({
  site: "https://iptv4kworld.com",
  output: "static",
  trailingSlash: "always",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          fr: "fr-FR",
          ar: "ar-SA",
          es: "es-ES",
          de: "de-DE",
          it: "it-IT",
          pt: "pt-PT",
        },
      },
      serialize(item) {
        const url = item.url;
        const pathname = new URL(url).pathname;

        // === LASTMOD — use real blog dates, fall back to build date ===
        const blogDate = getBlogPostDate(url);
        item.lastmod = blogDate || new Date();

        // === CHANGEFREQ based on page type ===
        // Language homepages: pathname is /en/, /fr/, /ar/, etc.
        if (/^\/(en|fr|ar|es|de|it|pt)\/$/.test(pathname)) {
          // Homepage — changes frequently with promotions/content updates
          item.changefreq = "daily";
        } else if (pathname.includes("/pricing/")) {
          // Pricing pages — updated occasionally
          item.changefreq = "weekly";
        } else if (pathname.includes("/blog/") && !pathname.endsWith("/blog/")) {
          // Individual blog posts — rarely change after publishing
          item.changefreq = "monthly";
        } else if (pathname.includes("/blog/")) {
          // Blog index — changes when new posts are added
          item.changefreq = "weekly";
        } else if (pathname.includes("/iptv-") || pathname.includes("/best-iptv")) {
          // SEO landing pages — updated occasionally for freshness
          item.changefreq = "monthly";
        } else if (pathname.includes("/privacy/") || pathname.includes("/terms/")) {
          // Legal pages — rarely change
          item.changefreq = "monthly";
        } else {
          // Other pages
          item.changefreq = "monthly";
        }

        // === PRIORITY based on page type ===
        // Language homepages: pathname is /en/, /fr/, /ar/, etc.
        if (/^\/(en|fr|ar|es|de|it|pt)\/$/.test(pathname)) {
          item.priority = 1.0;
        } else if (pathname.includes("/pricing/")) {
          item.priority = 0.9;
        } else if (pathname.includes("/iptv-") || pathname.includes("/best-iptv")) {
          item.priority = 0.8;
        } else if (pathname.includes("/blog/") && !pathname.endsWith("/blog/")) {
          item.priority = 0.7;
        } else if (pathname.includes("/blog/")) {
          item.priority = 0.6;
        } else if (pathname.includes("/privacy/") || pathname.includes("/terms/")) {
          // Legal pages — lowest priority
          item.priority = 0.3;
        } else {
          item.priority = 0.5;
        }

        return item;
      },
    }),
    compress({
      png: false,
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "ar", "es", "de", "it", "pt"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  markdown: {
    remarkPlugins: [remarkWhatsAppNumber],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "heading-anchor",
            ariaHidden: "true",
            tabIndex: -1,
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["anchor-icon"] },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-astro": ["astro"],
          },
        },
      },
    },
  },
});
