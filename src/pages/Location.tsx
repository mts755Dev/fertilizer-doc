import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, SlidersHorizontal, Search } from "lucide-react";
import { useClinicData } from "@/hooks/useClinicData";
import clinicInterior from "@/assets/clinic-interior.jpg";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";
import clinic5 from "@/assets/clinic-5.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function Location() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const { data: clinics, isLoading } = useClinicData();
  const navigate = useNavigate();

  // Filter clinics based on search query
  const filteredClinics = useMemo(() => {
    if (!clinics) return [];
    
    return clinics.filter(clinic => {
      const searchLower = searchQuery.toLowerCase();
      return (
        clinic.clinic_name?.toLowerCase().includes(searchLower) ||
        clinic.country?.toLowerCase().includes(searchLower) ||
        clinic.city?.toLowerCase().includes(searchLower) ||
        clinic.doctor_name?.toLowerCase().includes(searchLower)
      );
    });
  }, [clinics, searchQuery]);

  // Group clinics by country and city based on filtered results
  const countryCounts = filteredClinics
    .filter(clinic => clinic.country?.toLowerCase().includes(searchQuery.toLowerCase()))
    .reduce((acc, clinic) => {
      if (clinic.country) {
        acc[clinic.country] = (acc[clinic.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const cityCounts = filteredClinics?.reduce((acc, clinic) => {
    if (clinic.city) {
      acc[clinic.city] = (acc[clinic.city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  // Filter cities by selected letter
  const filteredCities = useMemo(() => {
    if (!selectedLetter) return cityCounts;
    
    return Object.fromEntries(
      Object.entries(cityCounts).filter(([city]) => 
        city.charAt(0).toUpperCase() === selectedLetter
      )
    );
  }, [cityCounts, selectedLetter]);

  const totalClinics = filteredClinics?.length || 0;

  const handleSearch = () => {
    // Search is already handled by the useMemo above
    console.log('Searching for:', searchQuery);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? "" : letter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Best Hair Docs - Compare & Find The Best Hair Transplant Clinic</title>
        <meta name="description" content="The #1 platform for comparing hair transplant clinics worldwide — explore 500+ clinics and 1,000+ verified reviews." />
      </Helmet>
      <Navbar />
      
      {/* Header Section with Background */}
      <section className="relative bg-medical-blue-light py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src={clinicInterior} 
            alt="Modern clinic interior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-medical-blue-light/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Clinic Locator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Hair Transplant Clinics
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compare verified clinics worldwide - prices, reviews, and methods
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-2xl p-6 shadow-lg border">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Enter city or country (e.g., Istanbul, London, New York)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-muted"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 bg-primary hover:bg-medical-blue-dark"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Clinics
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex justify-center space-x-8 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalClinics}+</div>
                  <div className="text-sm text-muted-foreground">
                    {searchQuery ? 'Found Clinics' : 'Verified Clinics'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-green">98.5%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-amber">€3,200</div>
                  <div className="text-sm text-muted-foreground">Avg. Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              <Badge variant="secondary">{totalClinics} clinics found</Badge>
              {searchQuery && (
                <Badge variant="outline">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button variant="outline" size="sm">Best Rating</Button>
            </div>
          </div>

          {/* Simple Clinic List for Search Results */}
          {searchQuery && clinics
            .filter(clinic =>
              clinic.country?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
              clinic.city?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
              clinic.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
            ).length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Hair Clinics in "{searchQuery}"</h2>
              <div className="space-y-6">
                {clinics
                  .filter(clinic =>
                    clinic.country?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                    clinic.city?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                    clinic.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
                  )
                  .map((clinic, index) => (
                    <Link key={clinic.id} to={`/en/clinic/${clinic.slug}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Clinic Image */}
                            <div className="md:w-1/3 relative">
                              <img
                                src={clinic.hero_image_url && clinic.hero_image_url.trim() !== '' ? clinic.hero_image_url : getClinicImage(index)}
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
                                    <span className="text-lg">{getCountryFlag(clinic.country || "")}</span>
                                    <span className="text-sm text-muted-foreground font-medium">{clinic.country}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-foreground mb-1">{clinic.clinic_name}</h3>
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
          )}

          {/* Countries List */}
          {!isLoading && Object.keys(countryCounts).length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Country</h2>
              <div className="bg-card rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(countryCounts).map(([country, count]) => (
                    <Link 
                      key={country} 
                      to={`/en/find-a-clinic/${country.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <span className="text-2xl">{getCountryFlag(country)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {country}
                        </h3>
                        <p className="text-sm text-muted-foreground">{count} clinics</p>
                      </div>
                      <span className="text-sm text-primary font-medium">From $1,500</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Browse by City */}
          {!isLoading && Object.keys(cityCounts).length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Find verified clinics by city</h2>
              <div className="bg-card rounded-lg p-6">
                {/* Alphabetical Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 pb-6 border-b border-border">
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => {
                    const hasData = Object.keys(cityCounts).some(city => 
                      city.charAt(0).toUpperCase() === letter
                    );
                    
                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        disabled={!hasData}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          selectedLetter === letter
                            ? 'bg-primary text-primary-foreground'
                            : hasData
                            ? 'bg-muted hover:bg-primary hover:text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                  {selectedLetter && (
                    <button
                      onClick={() => setSelectedLetter("")}
                      className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {/* Cities Grid */}
                {Object.keys(filteredCities).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(filteredCities).map(([city, count]) => (
                      <Link 
                        key={city} 
                        to={`/en/find-a-clinic/${city.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {city}
                          </h3>
                          <p className="text-sm text-muted-foreground">{count} clinics</p>
                        </div>
                        <span className="text-sm text-primary font-medium">From $1,200</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedLetter 
                        ? `No cities found starting with "${selectedLetter}"`
                        : 'No cities found'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && totalClinics === 0 && searchQuery && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">No clinics found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any clinics matching "{searchQuery}". Try adjusting your search.
              </p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading clinic data...</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getCountryFlag(country: string) {
  const flags: Record<string, string> = {
    'Australia': '🇦🇺',
    'Turkey': '🇹🇷',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'India': '🇮🇳',
    'Germany': '🇩🇪',
    'Spain': '🇪🇸',
    'Poland': '🇵🇱',
    'Thailand': '🇹🇭',
    'South Korea': '🇰🇷',
    'Mexico': '🇲🇽',
    'Brazil': '🇧🇷',
  };
  return flags[country] || '🏥';
}

function getClinicImage(index: number) {
  const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
  return images[index % images.length] || clinic1;
}
