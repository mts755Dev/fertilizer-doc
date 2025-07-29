import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = process.env.VITE_SITE_URL || 'https://your-site-url.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  // Fetch all clinics with country, city, slug
  const { data: clinics, error } = await supabase
    .from('hair_clinics')
    .select('slug, country, city');
  if (error) {
    console.error('Error fetching clinics:', error);
    process.exit(1);
  }

  // --- General Pages Sitemap ---
  const generalPages = [
    '/',
    '/en/about',
    '/en/contact',
    
    '/en/find-a-clinic',
    // Add more static pages as needed
  ];
  const generalSmStream = new SitemapStream({ hostname: SITE_URL });
  for (const url of generalPages) {
    generalSmStream.write({ url, changefreq: 'monthly', priority: 0.7 });
  }
  generalSmStream.end();
  const generalSitemap = await streamToPromise(generalSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-general.xml'), generalSitemap);

  // --- Clinics Sitemap ---
  const clinicsSmStream = new SitemapStream({ hostname: SITE_URL });
  for (const clinic of clinics) {
    if (clinic.slug) {
      clinicsSmStream.write({ url: `/en/clinic/${clinic.slug}`, changefreq: 'weekly', priority: 0.9 });
    }
  }
  clinicsSmStream.end();
  const clinicsSitemap = await streamToPromise(clinicsSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-clinics.xml'), clinicsSitemap);

  // --- Countries Sitemap ---
  const uniqueCountries = Array.from(new Set(clinics.map(c => c.country).filter(Boolean)));
  const countriesSmStream = new SitemapStream({ hostname: SITE_URL });
  for (const country of uniqueCountries) {
    const slug = country.toLowerCase().replace(/\s+/g, '-');
    countriesSmStream.write({ url: `/en/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.8 });
  }
  countriesSmStream.end();
  const countriesSitemap = await streamToPromise(countriesSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-countries.xml'), countriesSitemap);

  // --- Cities Sitemap ---
  const uniqueCities = Array.from(new Set(clinics.map(c => c.city).filter(Boolean)));
  const citiesSmStream = new SitemapStream({ hostname: SITE_URL });
  for (const city of uniqueCities) {
    const slug = city.toLowerCase().replace(/\s+/g, '-');
    citiesSmStream.write({ url: `/en/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.7 });
  }
  citiesSmStream.end();
  const citiesSitemap = await streamToPromise(citiesSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-cities.xml'), citiesSitemap);

  // --- Sitemap Index ---
  const sitemapIndexUrls = [
    `${SITE_URL}/sitemap-general.xml`,
    `${SITE_URL}/sitemap-clinics.xml`,
    `${SITE_URL}/sitemap-countries.xml`,
    `${SITE_URL}/sitemap-cities.xml`,
  ];
  const smIndexStream = new SitemapIndexStream();
  for (const url of sitemapIndexUrls) {
    smIndexStream.write({ url });
  }
  smIndexStream.end();
  const sitemapIndex = await streamToPromise(smIndexStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap.xml'), sitemapIndex);

  console.log('Sitemap index and sub-sitemaps generated in public/.');
}

main().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
}); 