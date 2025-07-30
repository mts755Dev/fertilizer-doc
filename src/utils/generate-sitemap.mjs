import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = process.env.VITE_SITE_URL || 'https://fertilizer-doc.vercel.app';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  try {
    console.log('Fetching clinics from Supabase...');
    
    // Fetch all fertility clinics with country, city, slug
    const { data: clinics, error } = await supabase
      .from('fertility_clinics')
      .select('slug, branches');
    
    if (error) {
      console.error('Error fetching clinics:', error);
      process.exit(1);
    }

    console.log(`Found ${clinics?.length || 0} clinics in database`);

    // --- General Pages Sitemap ---
    console.log('Generating general pages sitemap...');
    const generalPages = [
      '/',
      '/en/about',
      '/en/contact',
      '/en/fertility-clinics',
      '/fertility-clinics',
      // Add more static pages as needed
    ];
    
    const generalSmStream = new SitemapStream({ hostname: SITE_URL });
    for (const url of generalPages) {
      generalSmStream.write({ url, changefreq: 'monthly', priority: 0.7 });
    }
    generalSmStream.end();
    const generalSitemap = await streamToPromise(generalSmStream).then(sm => sm.toString());
    writeFileSync(path.resolve('public', 'sitemap-general.xml'), generalSitemap);
    console.log('✓ General sitemap generated');

    // --- Clinics Sitemap ---
    console.log('Generating clinics sitemap...');
    const clinicsSmStream = new SitemapStream({ hostname: SITE_URL });
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        if (clinic.slug) {
          clinicsSmStream.write({ url: `/en/fertility-clinic/${clinic.slug}`, changefreq: 'weekly', priority: 0.9 });
          // Also add without /en prefix for better UX
          clinicsSmStream.write({ url: `/fertility-clinic/${clinic.slug}`, changefreq: 'weekly', priority: 0.9 });
        }
      }
    } else {
      // Add some example clinic URLs if no data exists
      console.log('No clinics found, adding example URLs...');
      const exampleClinics = [
        '/en/fertility-clinic/example-clinic-1',
        '/en/fertility-clinic/example-clinic-2',
        '/fertility-clinic/example-clinic-1',
        '/fertility-clinic/example-clinic-2',
      ];
      for (const url of exampleClinics) {
        clinicsSmStream.write({ url, changefreq: 'weekly', priority: 0.9 });
      }
    }
    
    clinicsSmStream.end();
    const clinicsSitemap = await streamToPromise(clinicsSmStream).then(sm => sm.toString());
    writeFileSync(path.resolve('public', 'sitemap-clinics.xml'), clinicsSitemap);
    console.log('✓ Clinics sitemap generated');

    // --- Countries Sitemap ---
    console.log('Generating countries sitemap...');
    const uniqueCountries = new Set();
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        if (clinic.branches && Array.isArray(clinic.branches)) {
          clinic.branches.forEach(branch => {
            if (branch.country) {
              uniqueCountries.add(branch.country);
            }
          });
        }
      }
    }
    
    const countriesSmStream = new SitemapStream({ hostname: SITE_URL });
    
    if (uniqueCountries.size > 0) {
      for (const country of uniqueCountries) {
        const slug = country.toLowerCase().replace(/\s+/g, '-');
        countriesSmStream.write({ url: `/en/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.8 });
        // Also add without /en prefix
        countriesSmStream.write({ url: `/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.8 });
      }
    } else {
      // Add example country URLs
      console.log('No countries found, adding example URLs...');
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
    }
    
    countriesSmStream.end();
    const countriesSitemap = await streamToPromise(countriesSmStream).then(sm => sm.toString());
    writeFileSync(path.resolve('public', 'sitemap-countries.xml'), countriesSitemap);
    console.log('✓ Countries sitemap generated');

    // --- Cities Sitemap ---
    console.log('Generating cities sitemap...');
    const uniqueCities = new Set();
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        if (clinic.branches && Array.isArray(clinic.branches)) {
          clinic.branches.forEach(branch => {
            if (branch.city) {
              uniqueCities.add(branch.city);
            }
          });
        }
      }
    }
    
    const citiesSmStream = new SitemapStream({ hostname: SITE_URL });
    
    if (uniqueCities.size > 0) {
      for (const city of uniqueCities) {
        const slug = city.toLowerCase().replace(/\s+/g, '-');
        citiesSmStream.write({ url: `/en/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.7 });
        // Also add without /en prefix
        citiesSmStream.write({ url: `/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.7 });
      }
    } else {
      // Add example city URLs
      console.log('No cities found, adding example URLs...');
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
    }
    
    citiesSmStream.end();
    const citiesSitemap = await streamToPromise(citiesSmStream).then(sm => sm.toString());
    writeFileSync(path.resolve('public', 'sitemap-cities.xml'), citiesSitemap);
    console.log('✓ Cities sitemap generated');

    // --- Sitemap Index ---
    console.log('Generating sitemap index...');
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
    console.log('✓ Sitemap index generated');

    console.log('\n🎉 All sitemaps generated successfully!');
    console.log(`📁 Files created in: ${path.resolve('public')}`);
    console.log(`🌐 Site URL: ${SITE_URL}`);
    
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  }
}

main(); 