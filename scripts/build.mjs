import { access } from 'node:fs/promises';

const requiredFiles = [
  'public/index.html',
  'public/services/index.html',
  'public/seo-checklist/index.html',
  'public/case-studies/index.html',
  'public/styles.css',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/_headers',
  'public/_redirects',
  'public/site.webmanifest',
  'public/og-image.svg',
  'public/llms.txt'
];

await Promise.all(requiredFiles.map((file) => access(file)));
console.log(`Build ready: ${requiredFiles.length} public assets verified.`);
