import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import remarkWhatsAppNumber from "./src/plugins/remark-whatsapp-number.mjs";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Build a map of blog post slugs → frontmatter dates for real lastmod values
const blogDateMap = {};
// Build a map of blog post slugs → { url, title } for image sitemap
const blogImageMap = {};
const blogDir = path.resolve("src/content/blog");
try {
  const files = fs.readdirSync(blogDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(blogDir, file), "utf8");
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    const imageMatch = content.match(/^image:\s*"([^"]+)"/m);
    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
    const slug = file.replace(/\.md$/, "");
    if (dateMatch) {
      blogDateMap[slug] = new Date(dateMatch[1]);
    }
    if (imageMatch) {
      const relPath = imageMatch[1];
      const filename = path.basename(path.resolve(blogDir, relPath));
      const blogTitle = titleMatch ? titleMatch[1] : "";
      blogImageMap[slug] = {
        url: `https://iptv4kworld.com/images/blog/${filename}`,
        title: blogTitle,
        caption: blogTitle,
      };
    }
  }
  console.log(`📅 Loaded ${Object.keys(blogDateMap).length} blog dates for sitemap lastmod`);
  console.log(`🖼  Loaded ${Object.keys(blogImageMap).length} blog images for image sitemap`);
} catch {
  console.warn("⚠ Could not read blog dates, using build date for all lastmod values");
}

// Helper: extract blog post slug from sitemap URL
function extractBlogSlug(url) {
  const match = url.match(/\/blog\/([^/]+)\/$/);
  if (!match) return null;
  return match[1];
}

// Helper: get blog post date from slug
function getBlogPostDate(url) {
  const slug = extractBlogSlug(url);
  if (!slug) return null;
  return blogDateMap[slug] || null;
}

// Helper: get blog post image info from slug for image sitemap
function getBlogPostImage(url) {
  const slug = extractBlogSlug(url);
  if (!slug) return null;
  return blogImageMap[slug] || null;
}

export default defineConfig({
  site: "https://iptv4kworld.com",
  output: "server",
  build: {
    inlineStylesheets: "always",
  },
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: { enabled: true },
  }),
  trailingSlash: "always",

  image: {
    service: {
      entrypoint: "astro/assets/services/passthrough",
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

        // === IMAGE SITEMAP — add <image:image> tags for blog posts with images ===
        const blogImage = getBlogPostImage(url);
        if (blogImage) {
          item.img = [{ url: blogImage.url, caption: blogImage.caption, title: blogImage.title }];
        }

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
        } else if (pathname.includes("/contact/")) {
          // Contact page — static content
          item.changefreq = "monthly";
        } else if (pathname.includes("/search/")) {
          // Search page — updated occasionally
          item.changefreq = "weekly";
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
        } else if (pathname.includes("/contact/")) {
          // Contact page — lower priority
          item.priority = 0.4;
        } else if (pathname.includes("/search/")) {
          // Search page — medium priority
          item.priority = 0.6;
        } else {
          item.priority = 0.5;
        }

        return item;
      },
    }),
    compress({
      png: false,
    }),
    {
      name: "admin-route",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          injectRoute({
            pattern: "/admin/",
            entrypoint: "src/admin.astro",
            prerender: true,
          });
        },
      },
    },
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
  },
});
