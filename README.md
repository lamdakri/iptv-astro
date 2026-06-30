# IPTV 4K World

Premium IPTV subscription with 20,000+ channels, 4K quality, and 24/7 WhatsApp support. Multi-language Astro site serving 7 locales.

## Structured Data

All pages include [Schema.org](https://schema.org/) structured data (JSON-LD) for rich search results. The site is validated daily with zero errors.

### Schema Types by Page

| Page | Schema Types |
|---|---|
| **Home** (`/`) | `Organization`, `WebSite` (with `SearchAction`), `Product` (with `AggregateOffer` + `AggregateRating`), `Review`, `FAQPage` |
| **Pricing** (`/pricing/`) | `Product`, `BreadcrumbList` |
| **Blog Detail** (`/blog/[slug]/`) | `BlogPosting`, `HowTo`, `BreadcrumbList`, `CreativeWork` |
| **Blog Index** (`/blog/`) | `WebPage`, `BreadcrumbList` |
| **Search** (`/search/`) | `WebPage`, `WebSite` |
| **Privacy** (`/privacy/`) | `WebPage`, `BreadcrumbList` |
| **Terms** (`/terms/`) | `WebPage`, `BreadcrumbList` |
| **Contact** (`/contact/`) | `WebPage`, `BreadcrumbList` |
| **IPTV Legal** (`/iptv-legal/`) | `WebPage`, `BreadcrumbList`, `FAQPage` |
| **Geo Keyword** (`/iptv-[location]/`) | `WebPage`, `BreadcrumbList` |
| **404** | `WebPage` |

### Google Rich Results Eligibility

| Rich Result | Pages |
|---|---|
| **Product** | Home, Pricing |
| **FAQ** | Home, IPTV Legal |
| **Review Snippets** | Home |
| **Sitelinks Search Box** | Home (via `SearchAction` on `WebSite`) |
| **Breadcrumbs** | Blog Detail, Blog Index, Pricing, Privacy, Terms, Contact, IPTV Legal, Geo Keyword |
| **Article** | Blog Detail |
| **How-to** | Blog Detail (posts with step-by-step guides) |

### Validate

Every page footer includes a **[Schema Validated](https://validator.schema.org/)** link that dynamically opens the current page in the official Schema.org validator.

You can also test any URL manually at:

- **[Schema.org Validator](https://validator.schema.org/)** — official validation
- **[Google Rich Results Test](https://search.google.com/test/rich-results)** — Google-specific rich result eligibility

### SEO Features

- **Meta descriptions** — all pages
- **Open Graph** (`og:title`, `og:description`, `og:image`, `og:locale`, `og:locale:alternate`) — all pages
- **Twitter Cards** — all pages
- **Canonical URLs** — all pages
- **Hreflang** (alternate language links) — all pages
- **Meta keywords** — all content pages
- **Robots meta** — all pages
- **robots.txt** with sitemap reference
- **XML Sitemap** (`sitemap-index.xml` + `sitemap-0.xml`)

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

Built with [Astro](https://astro.build/) and deployed to Cloudflare Pages.
