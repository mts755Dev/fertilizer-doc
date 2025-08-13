import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Search, Baby, Users, Award, Filter, Building2, CheckCircle, Camera, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFertilityData } from "@/hooks/useFertilityDataFromSupabase";
import { Helmet } from "react-helmet-async";
import type { FertilityClinic } from "@/utils/fertilityUtils";
import FertilityAssessmentQuiz from "@/components/FertilityAssessmentQuiz";

// Import clinic background images
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";
import clinic5 from "@/assets/clinic-5.jpg";

// State name mapping
const STATE_NAMES: { [key: string]: string } = {
  'alabama': 'AL',
  'alaska': 'AK',
  'arizona': 'AZ',
  'arkansas': 'AR',
  'california': 'CA',
  'colorado': 'CO',
  'connecticut': 'CT',
  'delaware': 'DE',
  'florida': 'FL',
  'georgia': 'GA',
  'hawaii': 'HI',
  'idaho': 'ID',
  'illinois': 'IL',
  'indiana': 'IN',
  'iowa': 'IA',
  'kansas': 'KS',
  'kentucky': 'KY',
  'louisiana': 'LA',
  'maine': 'ME',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'minnesota': 'MN',
  'mississippi': 'MS',
  'missouri': 'MO',
  'montana': 'MT',
  'nebraska': 'NE',
  'nevada': 'NV',
  'new-hampshire': 'NH',
  'new-jersey': 'NJ',
  'new-mexico': 'NM',
  'new-york': 'NY',
  'north-carolina': 'NC',
  'north-dakota': 'ND',
  'ohio': 'OH',
  'oklahoma': 'OK',
  'oregon': 'OR',
  'pennsylvania': 'PA',
  'rhode-island': 'RI',
  'south-carolina': 'SC',
  'south-dakota': 'SD',
  'tennessee': 'TN',
  'texas': 'TX',
  'utah': 'UT',
  'vermont': 'VT',
  'virginia': 'VA',
  'washington': 'WA',
  'west-virginia': 'WV',
  'wisconsin': 'WI',
  'wyoming': 'WY',
  'district-of-columbia': 'DC'
};

const STATE_FULL_NAMES: { [key: string]: string } = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

export default function FertilityClinics() {
  const { stateName } = useParams<{ stateName: string }>();
  const { data: clinics, isLoading, error } = useFertilityData();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  console.log('FertilityClinics - clinics data:', clinics);
  console.log('FertilityClinics - clinics length:', clinics?.length);
  if (clinics && clinics.length > 0) {
    console.log('FertilityClinics - first clinic:', clinics[0]);
    console.log('FertilityClinics - first clinic branches:', clinics[0].branches);
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = 10;

  // Function to get random clinic image
  const getClinicImage = (clinic: FertilityClinic) => {
    const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
    
    // Use clinic slug to generate a consistent index that doesn't change with filtering/pagination
    let hash = 0;
    for (let i = 0; i < clinic.slug.length; i++) {
      const char = clinic.slug.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get a consistent index
    const index = Math.abs(hash) % images.length;
    return images[index];
  };

  // Extract unique states from clinic branches
  const states = clinics ? Array.from(new Set(
    clinics.flatMap(clinic => 
      clinic.branches.map(branch => {
        if (!branch["city-zip"]) return null;
        const match = branch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
        return match ? match[1] : null;
      }).filter(Boolean)
    )
  )).sort() : [];

  // Get clinics by state
  const getClinicsByState = (stateCode: string) => {
    if (!clinics) return [];
    return clinics.filter(clinic => 
      clinic.branches.some(branch => {
        if (!branch["city-zip"]) return false;
        const match = branch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
        return match && match[1] === stateCode;
      })
    );
  };

  // Get state code from state name
  const getStateCodeFromName = (name: string) => {
    return STATE_NAMES[name.toLowerCase()] || name.toUpperCase();
  };

  // Get state full name from code
  const getStateFullName = (code: string) => {
    return STATE_FULL_NAMES[code] || code;
  };

  // Get clinic's primary state
  const getClinicState = (clinic: FertilityClinic) => {
    if (clinic.branches.length === 0) return 'United States';
    
    // If we're filtering by a specific state, show that state
    if (selectedState !== "all") {
      const branchInSelectedState = clinic.branches.find(branch => {
        if (!branch["city-zip"]) return false;
        const match = branch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
        return match && match[1] === selectedState;
      });
      
      if (branchInSelectedState) {
        return getStateFullName(selectedState);
      }
    }
    
    // Otherwise, get the first branch's state
    const firstBranch = clinic.branches[0];
    if (!firstBranch["city-zip"]) return 'United States';
    
    const stateMatch = firstBranch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
    if (stateMatch) {
      return getStateFullName(stateMatch[1]);
    }
    
    return 'United States';
  };

  // Handle state parameter from URL
  useEffect(() => {
    if (stateName) {
      const stateCode = getStateCodeFromName(stateName);
      setSelectedState(stateCode);
      setShowFilters(true);
    }
  }, [stateName]);

  // Memoized search matching function
  const matchesSearchTerm = useCallback((clinic: FertilityClinic, searchTerm: string) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    // Check clinic name and ID
    if (clinic.name.toLowerCase().includes(searchLower) || clinic.id.toString().includes(searchTerm)) {
      return true;
    }

    // Check all branches for city, state code, or state full name
    const branchMatch = clinic.branches.some((branch) => {
      const cityZip = branch["city-zip"] || "";
      const cityZipLower = cityZip.toLowerCase();
      // Try to extract state code (e.g., CA) from city-zip
      let stateCode = "";
      const stateMatch = cityZip.match(/,\s*([A-Z]{2})\s+\d{5}/);
      if (stateMatch) {
        stateCode = stateMatch[1];
      }
      const stateFullName = stateCode ? getStateFullName(stateCode).toLowerCase() : "";
      // Also try to extract city name
      const cityName = cityZip.split(",")[0].trim().toLowerCase();
      // Check city, state code, state full name
      return (
        cityName.includes(searchLower) ||
        (stateCode && stateCode.toLowerCase().includes(searchLower)) ||
        (stateFullName && stateFullName.includes(searchLower))
      );
    });
    if (branchMatch) return true;
    return false;
  }, []);

  // Memoized state matching function
  const matchesStateFilter = useCallback((clinic: FertilityClinic, selectedState: string) => {
    if (selectedState === "all") return true;
    
    // Debug logging for Alabama filter
    if (selectedState === "AL") {
      console.log('Checking clinic for Alabama filter:', clinic.name);
      console.log('Clinic branches:', clinic.branches);
    }
    
    // Check if ANY branch is in the selected state
    const hasBranchInState = clinic.branches.some((branch) => {
      if (!branch["city-zip"]) return false;
      const match = branch["city-zip"].match(/,\s*([A-Z]{2})\s+\d{5}/);
      if (match) {
        const branchState = match[1];
        if (selectedState === "AL") {
          console.log('Branch state:', branchState, 'Selected state:', selectedState, 'Match:', branchState === selectedState);
        }
        return branchState === selectedState;
      }
      return false;
    });
    
    if (selectedState === "AL") {
      console.log('Clinic', clinic.name, 'has branch in Alabama:', hasBranchInState);
    }
    
    return hasBranchInState;
  }, []);

  // Memoized sorting function
  const sortClinics = useCallback((a: FertilityClinic, b: FertilityClinic) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "cycles": {
        const aCycles = a.annual_cycles === "N/A" ? 0 : parseInt(a.annual_cycles.replace(/,/g, '')) || 0;
        const bCycles = b.annual_cycles === "N/A" ? 0 : parseInt(b.annual_cycles.replace(/,/g, '')) || 0;
        return bCycles - aCycles;
      }
      case "doctors":
        return b.doctors.length - a.doctors.length;
      case "locations":
        return b.branches.length - a.branches.length;
      default:
        return 0;
    }
  }, [sortBy]);

  // Memoized filtered clinics
  const filteredClinics = useMemo(() => {
    if (!clinics) return [];
    
    console.log('FertilityClinics - filtering with searchTerm:', searchTerm);
    console.log('FertilityClinics - filtering with selectedState:', selectedState);
    
    const searchFiltered = clinics.filter(clinic => matchesSearchTerm(clinic, searchTerm));
    console.log('FertilityClinics - after search filter:', searchFiltered.length);
    
    const stateFiltered = searchFiltered.filter(clinic => matchesStateFilter(clinic, selectedState));
    console.log('FertilityClinics - after state filter:', stateFiltered.length);
    
    const sorted = stateFiltered.sort(sortClinics);
    console.log('FertilityClinics - final filtered clinics:', sorted.length);
    
    return sorted;
  }, [clinics, searchTerm, selectedState, sortBy, matchesSearchTerm, matchesStateFilter, sortClinics]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClinics.length / clinicsPerPage);
  const startIndex = (currentPage - 1) * clinicsPerPage;
  const endIndex = startIndex + clinicsPerPage;
  const currentClinics = filteredClinics.slice(startIndex, endIndex);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedState, sortBy]);

  // Scroll to results when page changes
  useEffect(() => {
    if (resultsRef.current && currentPage > 1) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [currentPage]);

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading Clinics...</h1>
            <p className="text-muted-foreground">Fetching fertility clinic data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Clinics</h1>
            <p className="text-muted-foreground">Failed to load fertility clinic data. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStateFullName = stateName ? getStateFullName(getStateCodeFromName(stateName)) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Helmet>
        <title>
          {stateName 
            ? `Fertility Clinics in ${currentStateFullName} - Compare Success Rates & Reviews | FertilityIQ`
            : "Find Fertility Clinics - Compare Success Rates & Reviews | FertilityIQ"
          }
        </title>
        <meta name="description" content="Find and compare verified fertility clinics across the United States. Compare success rates, reviews, and treatment options to make informed decisions about your fertility care." />
      </Helmet>

            {/* Hero Section with Full-Width Background */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">          
          {/* Purple Button */}
          <div className="inline-flex items-center space-x-2 bg-purple-100 border-2 border-purple-300 text-purple-700 px-4 sm:px-6 py-3 rounded-lg text-xs sm:text-sm font-medium mb-6">
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-center">COMPARE PRICES, REVIEWS AND BEFORE & AFTERS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-2">
            {stateName 
              ? `Fertility Clinics in ${currentStateFullName}`
              : "Find Fertility Clinics"
            }
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-2">
            {stateName 
              ? `Discover verified fertility clinics in ${currentStateFullName} with transparent pricing and real patient reviews.`
              : "Discover verified fertility clinics across the United States with transparent pricing and real patient reviews."
            }
          </p>

          {/* Search Bar - Only show on main fertility-clinics route */}
          {!stateName && (
            <Card className="max-w-2xl mx-auto shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter city, state or clinic name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  <Button className="h-12 px-8 text-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Search Clinics
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Overview Section for State Pages */}
      {stateName && (
        <section className="py-8 sm:py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{filteredClinics.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Number of clinics:</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">98.5%</div>
                <div className="text-xs sm:text-sm text-gray-600">Satisfaction rate:</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-500">$3,200</div>
                <div className="text-xs sm:text-sm text-gray-600">Average Cost:</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700">IVF, IUI</div>
                <div className="text-xs sm:text-sm text-gray-600">Methods:</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">15</div>
                <div className="text-xs sm:text-sm text-gray-600">Average years of experience:</div>
              </div>
            </div>
          </div>
        </section>
      )}

             {/* Results Section - Show clinic cards when searching or on state pages */}
      {(searchTerm || stateName) && (
        <section ref={resultsRef} className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Results Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Button variant="outline" className="flex items-center space-x-2 text-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {filteredClinics.length} clinics found
                </Badge>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs sm:text-sm flex items-center space-x-2">
                    <span>Search: '{searchTerm}'</span>
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Clinic Listings Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              {stateName 
                ? `Fertility Clinics in '${currentStateFullName}'`
                : `${filteredClinics.length} Clinics Found`
              }
            </h2>

            {/* Results Grid - Detailed Clinic Cards */}
            <div className="space-y-6 sm:space-y-8">
              {currentClinics.map((clinic, index) => (
                <Link key={clinic.id} to={`/en/fertility-clinic/${clinic.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex flex-col lg:flex-row">
                      {/* Clinic Image */}
                      <div className="lg:w-1/3 relative">
                        <img 
                          src={getClinicImage(clinic)}
                          alt={`${clinic.name} clinic`}
                          className="w-full h-48 sm:h-64 lg:h-full object-cover"
                        />
                        {/* Verified Badge */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                          <Badge className="bg-green-500 text-white flex items-center space-x-1 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Clinic Details */}
                      <div className="lg:w-2/3 p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            {/* Location */}
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm sm:text-base">{getClinicState(clinic)}</span>
                            </div>

                            {/* Clinic Name */}
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                              {clinic.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base">Top Rated</span>
                              <span className="text-gray-600 text-sm sm:text-base">Verified Clinic</span>
                            </div>

                            {/* Clinic Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="text-sm sm:text-base">
                                <span className="text-gray-600">Methods: </span>
                                <span className="font-semibold">IVF, IUI</span>
                              </div>
                              <div className="text-sm sm:text-base">
                                <span className="text-gray-600">Annual Cycles: </span>
                                <span className="font-semibold">{clinic.annual_cycles === "N/A" ? "N/A" : clinic.annual_cycles}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                              {clinic.description || `${clinic.name} is a specialized fertility clinic with comprehensive success rate data available. The clinic is staffed by ${clinic.doctors.length} experienced fertility specialists. With ${clinic.branches.length} location${clinic.branches.length !== 1 ? 's' : ''} across different cities, the clinic provides personalized fertility care and treatment options for patients seeking to build their families.`}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="mt-4 lg:mt-0 lg:ml-6">
                            <Button className="w-full lg:w-auto text-sm sm:text-base">
                              See Clinic
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredClinics.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No clinics found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or browse by state above.</p>
              </div>
            )}

            {/* Pagination - Only show if more than 10 results */}
            {filteredClinics.length > 10 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 text-sm"
                >
                  <span>Previous</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 sm:w-10 sm:h-10 text-sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 text-sm"
                >
                  <span>Next</span>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Browse by States Section */}
      {!stateName && (
        <section className="py-12 sm:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Browse by State</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {states.map((state) => {
                const stateClinics = getClinicsByState(state);
                const stateFullName = getStateFullName(state);
                const stateSlug = Object.keys(STATE_NAMES).find(key => STATE_NAMES[key] === state) || state.toLowerCase();
                return (
                  <Link key={state} to={`/en/find-a-clinic/${stateSlug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-16 sm:h-20">
                      <CardContent className="p-3 sm:p-4 h-full">
                        <div className="flex items-center space-x-2 sm:space-x-3 h-full">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">{stateFullName}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{stateClinics.length} clinics</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}



      <Footer />
    </div>
  );
} 