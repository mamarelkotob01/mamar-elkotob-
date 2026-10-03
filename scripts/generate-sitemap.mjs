/**
 * Dynamic Sitemap Generator
 * Queries Supabase for all published books and generates sitemap.xml
 *
 * Run before deployment:
 *   node scripts/generate-sitemap.mjs
 *
 * Or add to package.json scripts:
 *   "generate:sitemap": "node scripts/generate-sitemap.mjs"
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.VITE_SITE_URL || 'https://zahmetkotab.com';
const OUTPUT_PATH = resolve('./public/sitemap.xml');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generate() {
  console.log('Fetching published books from Supabase...');

  const { data: books, error } = await supabase
    .from('books')
    .select('id, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch books:', error.message);
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/store', priority: '0.9', changefreq: 'daily' },
    { loc: '/worlds', priority: '0.8', changefreq: 'weekly' },
    { loc: '/authors', priority: '0.8', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.7', changefreq: 'daily' },
    { loc: '/offers', priority: '0.7', changefreq: 'daily' },
    { loc: '/media', priority: '0.6', changefreq: 'weekly' },
  ];

  const staticXml = staticPages.map(p => `
  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const bookXml = (books || []).map(book => {
    const lastmod = book.created_at
      ? new Date(book.created_at).toISOString().split('T')[0]
      : today;
    return `
  <url>
    <loc>${SITE_URL}/book/${book.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${bookXml}
</urlset>`;

  writeFileSync(OUTPUT_PATH, xml, 'utf-8');
  console.log(`✅ sitemap.xml generated with ${staticPages.length + (books?.length || 0)} URLs`);
  console.log(`   Output: ${OUTPUT_PATH}`);
}

generate();
