import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { writeFileSync } from 'fs';
import path from 'path';

const SITE_URL = 'https://fertilityiq.com';

async function generateBasicSitemaps() {
  // --- General Pages Sitemap ---
  const generalPages = [
    '/',
    '/en/about',
    '/en/contact',
    '/en/fertility-clinics',
    '/fertility-clinics',
  ];
  
  const generalSmStream = new SitemapStream({ hostname: SITE_URL });
  for (const url of generalPages) {
    generalSmStream.write({ url, changefreq: 'monthly', priority: 0.7 });
  }
  generalSmStream.end();
  const generalSitemap = await streamToPromise(generalSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-general.xml'), generalSitemap);

  // --- Clinics Sitemap (placeholder) ---
  const clinicsSmStream = new SitemapStream({ hostname: SITE_URL });
  // Add some example clinic URLs - these will be replaced when you have actual data
  const exampleClinics = [
    '/en/fertility-clinic/example-clinic-1',
    '/en/fertility-clinic/example-clinic-2',
    '/fertility-clinic/example-clinic-1',
    '/fertility-clinic/example-clinic-2',
  ];
  
  for (const url of exampleClinics) {
    clinicsSmStream.write({ url, changefreq: 'weekly', priority: 0.9 });
  }
  clinicsSmStream.end();
  const clinicsSitemap = await streamToPromise(clinicsSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-clinics.xml'), clinicsSitemap);

  // --- Countries Sitemap (placeholder) ---
  const countriesSmStream = new SitemapStream({ hostname: SITE_URL });
  const exampleCountries = [
    '/en/find-a-clinic/usa',
    '/en/find-a-clinic/uk',
    '/en/find-a-clinic/turkey',
    '/find-a-clinic/usa',
    '/find-a-clinic/uk',
    '/find-a-clinic/turkey',
  ];
  
  for (const url of exampleCountries) {
    countriesSmStream.write({ url, changefreq: 'weekly', priority: 0.8 });
  }
  countriesSmStream.end();
  const countriesSitemap = await streamToPromise(countriesSmStream).then(sm => sm.toString());
  writeFileSync(path.resolve('public', 'sitemap-countries.xml'), countriesSitemap);

  // --- Cities Sitemap (placeholder) ---
  const citiesSmStream = new SitemapStream({ hostname: SITE_URL });
  const exampleCities = [
    '/en/find-a-clinic/new-york',
    '/en/find-a-clinic/london',
    '/en/find-a-clinic/istanbul',
    '/find-a-clinic/new-york',
    '/find-a-clinic/london',
    '/find-a-clinic/istanbul',
  ];
  
  for (const url of exampleCities) {
    citiesSmStream.write({ url, changefreq: 'weekly', priority: 0.7 });
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

  console.log('Basic sitemap index and sub-sitemaps generated in public/.');
  console.log('Note: These contain placeholder data. Run the full sitemap generator when you have clinic data.');
}

generateBasicSitemaps().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
}); 