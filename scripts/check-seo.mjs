import { readFile } from 'node:fs/promises';

const html = await readFile('public/index.html', 'utf8');
const robots = await readFile('public/robots.txt', 'utf8');
const sitemap = await readFile('public/sitemap.xml', 'utf8');

const checks = [
  ['lang="ja"', /<html\s+lang="ja"/i.test(html)],
  ['single h1', (html.match(/<h1\b/gi) ?? []).length === 1],
  ['title', /<title>.{20,70}<\/title>/i.test(html)],
  ['meta description', /<meta name="description" content=".{50,160}">/i.test(html)],
  ['canonical', /<link rel="canonical" href="https:\/\/www\.example\.com\/">/i.test(html)],
  ['Open Graph', /property="og:title"/i.test(html) && /property="og:image"/i.test(html)],
  ['JSON-LD', /application\/ld\+json/i.test(html)],
  ['robots sitemap', /Sitemap: https:\/\/www\.example\.com\/sitemap\.xml/i.test(robots)],
  ['sitemap loc', /<loc>https:\/\/www\.example\.com\/<\/loc>/i.test(sitemap)]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
}
if (failed.length > 0) {
  throw new Error(`SEO checks failed: ${failed.map(([name]) => name).join(', ')}`);
}
