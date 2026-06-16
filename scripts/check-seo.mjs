import { readFile } from 'node:fs/promises';

const pages = [
  ['/', 'public/index.html', 'https://www.example.com/'],
  ['/services/', 'public/services/index.html', 'https://www.example.com/services/'],
  ['/seo-checklist/', 'public/seo-checklist/index.html', 'https://www.example.com/seo-checklist/'],
  ['/case-studies/', 'public/case-studies/index.html', 'https://www.example.com/case-studies/']
];

const robots = await readFile('public/robots.txt', 'utf8');
const sitemap = await readFile('public/sitemap.xml', 'utf8');
const checks = [];

for (const [path, file, canonical] of pages) {
  const html = await readFile(file, 'utf8');
  checks.push([`${path} lang=ja`, /<html\s+lang="ja"/i.test(html)]);
  checks.push([`${path} single h1`, (html.match(/<h1\b/gi) ?? []).length === 1]);
  checks.push([`${path} title length`, /<title>.{20,70}<\/title>/i.test(html)]);
  checks.push([`${path} meta description`, /<meta name="description" content=".{50,170}">/i.test(html)]);
  checks.push([`${path} canonical`, html.includes(`<link rel="canonical" href="${canonical}">`)]);
  checks.push([`${path} indexable robots`, /<meta name="robots" content="index, follow/i.test(html)]);
  checks.push([`${path} Open Graph`, /property="og:title"/i.test(html) && /property="og:image"/i.test(html)]);
  checks.push([`${path} sitemap entry`, sitemap.includes(`<loc>${canonical}</loc>`)]);
}

const home = await readFile('public/index.html', 'utf8');
checks.push(['home Google site verification', /<meta name="google-site-verification" content="9IWAlyyA4QDgpjt2KgggaqEGcY95-zjR8CedyThV4IA" \/>/i.test(home)]);
checks.push(['home JSON-LD graph', /"@graph"/i.test(home)]);
checks.push(['home Organization schema', /"@type":"Organization"/i.test(home)]);
checks.push(['home WebSite schema', /"@type":"WebSite"/i.test(home)]);
checks.push(['home Service schema', /"@type":"Service"/i.test(home)]);
checks.push(['home Breadcrumb schema', /"@type":"BreadcrumbList"/i.test(home)]);
checks.push(['home FAQ schema', /"@type":"FAQPage"/i.test(home)]);
checks.push(['robots sitemap', /Sitemap: https:\/\/www\.example\.com\/sitemap\.xml/i.test(robots)]);

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
}
if (failed.length > 0) {
  throw new Error(`SEO checks failed: ${failed.map(([name]) => name).join(', ')}`);
}
