import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.eggtility.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// US States mapping
const US_STATES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

async function main() {
  try {
    console.log('Fetching clinics from Supabase...');
    
    // Fetch all fertility clinics with slug and branches
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

    // --- States Sitemap ---
    console.log('Generating states sitemap...');
    const uniqueStates = new Set();
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        if (clinic.branches && Array.isArray(clinic.branches)) {
          clinic.branches.forEach(branch => {
            if (branch["city-zip"]) {
              const stateMatch = branch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
              if (stateMatch && US_STATES[stateMatch[1]]) {
                uniqueStates.add(stateMatch[1]);
              }
            }
          });
        }
      }
    }
    
    const statesSmStream = new SitemapStream({ hostname: SITE_URL });
    
    if (uniqueStates.size > 0) {
      for (const stateCode of uniqueStates) {
        const stateName = US_STATES[stateCode];
        const slug = stateName.toLowerCase().replace(/\s+/g, '-');
        statesSmStream.write({ url: `/en/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.8 });
        // Also add without /en prefix
        statesSmStream.write({ url: `/find-a-clinic/${slug}`, changefreq: 'weekly', priority: 0.8 });
      }
    } else {
      // Add example state URLs
      console.log('No states found, adding example URLs...');
      const exampleStates = [
        '/en/find-a-clinic/california',
        '/en/find-a-clinic/new-york',
        '/en/find-a-clinic/texas',
        '/find-a-clinic/california',
        '/find-a-clinic/new-york',
        '/find-a-clinic/texas',
      ];
      for (const url of exampleStates) {
        statesSmStream.write({ url, changefreq: 'weekly', priority: 0.8 });
      }
    }
    
    statesSmStream.end();
    const statesSitemap = await streamToPromise(statesSmStream).then(sm => sm.toString());
    writeFileSync(path.resolve('public', 'sitemap-states.xml'), statesSitemap);
    console.log('✓ States sitemap generated');

    // --- Cities Sitemap ---
    console.log('Generating cities sitemap...');
    const uniqueCities = new Set();
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        if (clinic.branches && Array.isArray(clinic.branches)) {
          clinic.branches.forEach(branch => {
            if (branch["city-zip"]) {
              const cityName = branch["city-zip"].split(",")[0]?.trim();
              if (cityName) {
                uniqueCities.add(cityName);
              }
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
        '/en/find-a-clinic/los-angeles',
        '/en/find-a-clinic/chicago',
        '/find-a-clinic/new-york',
        '/find-a-clinic/los-angeles',
        '/find-a-clinic/chicago',
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
      `${SITE_URL}/sitemap-states.xml`,
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