import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { useClinicsByCountry } from "@/hooks/useClinicData";
import { getClinicDetailUrl } from "@/utils/clinicUtils";
import clinicInterior from "@/assets/clinic-interior.jpg";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";
import clinic5 from "@/assets/clinic-5.jpg";
import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

export default function CountryLocation() {
  const { locationName } = useParams<{ locationName: string }>();
  const { data: clinics, isLoading, error } = useClinicsByCountry(locationName || '');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const clinicsPerPage = 10;
  const totalPages = clinics ? Math.ceil(clinics.length / clinicsPerPage) : 1;
  const paginatedClinics = clinics ? clinics.slice((page - 1) * clinicsPerPage, page * clinicsPerPage) : [];
  const clinicListRef = useRef(null);

  const countryName = locationName?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  const countryFlag = getCountryFlag(locationName || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
            <p className="text-muted-foreground">Fetching clinic data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !clinics || clinics.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No Clinics Found</h1>
            <p className="text-muted-foreground">
              {error ? 'Error loading clinic data.' : `No clinics found for ${locationName}.`}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const metaTitle = `Find the Best Hair Transplant Clinics in ${countryName} - Best Hair Docs`;
  const metaDescription = `Compare top hair transplant clinics in ${countryName} with real reviews, pricing, photos, and success rates. Find the best clinic for your hair restoration — fast, easy, and free with Best Hair Docs.`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      
      {/* Header Section */}
      <section className="relative bg-medical-blue-light py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={clinicInterior} alt="Modern clinic interior" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-medical-blue-light/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">{countryFlag}</span>
              <span className="text-sm font-medium text-primary">COMPARE PRICES, REVIEWS AND BEFORE & AFTERS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Hair Transplant in {countryName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover verified hair transplant clinics in {countryName} with transparent pricing and real patient reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{clinics.length}</div>
                <div className="text-sm text-muted-foreground">Number of clinics:</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-green mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction rate:</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-amber mb-1">$2,500</div>
                <div className="text-sm text-muted-foreground">Average Cost:</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">FUE, DHI</div>
                <div className="text-sm text-muted-foreground">Methods:</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">15</div>
                <div className="text-sm text-muted-foreground">Average years of experience:</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div>
<h2 className="text-2xl font-bold text-foreground">{clinics.length} Clinics in {countryName}</h2>
</div>
</div>
      {/* Clinics Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div ref={clinicListRef}>
              {paginatedClinics.map((clinic, index) => (
                <Link key={clinic.id} to={`/en/clinic/${clinic.slug}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer mt-5">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Clinic Image */}
                        <div className="md:w-1/3 relative">
                          <img
                            src={clinic.hero_image_url || getClinicImage(index)}
                            alt={clinic.clinic_name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-success-green text-background">✓ Verified</Badge>
                          </div>
                        </div>
                        {/* Clinic Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">{countryFlag}</span>
                                <span className="text-sm text-muted-foreground font-medium">{clinic.country}</span>
                              </div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{clinic.clinic_name}</h3>
                              {/* Removed doctor name and position */}
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-warning-amber text-warning-amber" />
                                  <span className="font-semibold text-lg">4.8</span>
                                </div>
                                <div className="text-sm text-muted-foreground">Reviews 150+</div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => { e.stopPropagation(); navigate(`/en/clinic/${clinic.slug}`); }}
                            >
                              See Clinic
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Methods: </span>
                              <span className="font-medium">FUE, DHI</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Video Consultation: </span>
                              <span className="font-medium">{clinic.video_consultation ? 'Available' : 'Not Available'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price: </span>
                              <span className="font-medium text-primary">{clinic.price_range || 'Contact for pricing'}</span>
                            </div>
                          </div>
                          {clinic.description && (
                            <div className="mt-4">
                              <p className="text-sm text-muted-foreground line-clamp-2">{clinic.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          {clinics.length > clinicsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button onClick={() => {
                setPage(p => {
                  const prev = Math.max(1, p - 1);
                  setTimeout(() => { clinicListRef.current?.scrollIntoView({ behavior: "smooth" }); }, 0);
                  return prev;
                });
              }} disabled={page === 1}>Prev</Button>
              <span>Page {page} of {totalPages}</span>
              <Button onClick={() => {
                setPage(p => {
                  const next = Math.min(totalPages, p + 1);
                  setTimeout(() => { clinicListRef.current?.scrollIntoView({ behavior: "smooth" }); }, 0);
                  return next;
                });
              }} disabled={page === totalPages}>Next</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getClinicImage(index: number) {
  const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
  return images[index % images.length];
}

function getCountryFlag(country: string) {
  const flags: Record<string, string> = {
    'australia': '🇦🇺',
    'turkey': '🇹🇷',
    'uk': '🇬🇧',
    'united-kingdom': '🇬🇧',
    'usa': '🇺🇸',
    'united-states': '🇺🇸',
    'india': '🇮🇳',
    'germany': '🇩🇪',
    'spain': '🇪🇸',
    'poland': '🇵🇱',
    'thailand': '🇹🇭',
    'south-korea': '🇰🇷',
    'mexico': '🇲🇽',
    'brazil': '🇧🇷',
  };
  return flags[country.toLowerCase()] || '🏥';
}
