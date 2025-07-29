import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, DollarSign, Clock, Shield, Globe, TrendingUp, Baby } from "lucide-react";
import { useFertilityClinicBySlug, useFertilityData } from "@/hooks/useFertilityDataFromSupabase";
import BookConsultationModal from "@/components/BookConsultationModal";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";
import { Helmet } from "react-helmet-async";
import { SuccessRateChart } from "@/components/SuccessRateChart";
import { ClinicMap } from "@/components/ClinicMap";

// Import clinic background images
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";
import clinic5 from "@/assets/clinic-5.jpg";

export default function FertilityClinicDetail() {
  const { clinicSlug } = useParams<{ clinicSlug: string }>();
  const { data: clinic, isLoading, error } = useFertilityClinicBySlug(clinicSlug || '');
  const { data: allClinics } = useFertilityData(); // Get all clinics to find the index
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Function to get clinic image based on clinic's position in the original array
  const getClinicImage = () => {
    if (!allClinics || !clinic) return clinic1;
    
    // Find the clinic's index in the original clinics array
    const clinicIndex = allClinics.findIndex(c => c.id === clinic.id);
    if (clinicIndex === -1) return clinic1;
    
    const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
    return images[clinicIndex % images.length];
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
            <p className="text-muted-foreground">Fetching fertility clinic details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Clinic Not Found</h1>
            <p className="text-muted-foreground">The requested fertility clinic page could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const metaTitle = `${clinic.name}: Success Rates, Reviews, Locations - FertilityIQ`;
  const metaDescription = `${clinic.name} is a fertility clinic with comprehensive success rate data. View success rates by age group, doctor profiles, and clinic locations.`;

  const hasSuccessRates = clinic["clinic_sr:<35"] !== "N/A" && clinic["clinic_sr:<35"] !== null || 
                         clinic["clinic_sr:35-37"] !== "N/A" && clinic["clinic_sr:35-37"] !== null || 
                         clinic["clinic_sr:38-40"] !== "N/A" && clinic["clinic_sr:38-40"] !== null || 
                         clinic["clinic_sr:>40"] !== "N/A" && clinic["clinic_sr:>40"] !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getClinicImage()}
            alt={`${clinic.name} clinic`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30"></div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
            <Baby className="w-24 h-24 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{clinic.name}</h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-white/90" />
              <span className="text-lg text-white/90">
                {clinic.branches.length} location{clinic.branches.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-warning-amber text-warning-amber" />
                <span className="font-semibold text-xl">4.7</span>
                <span className="text-lg">(150+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Clinic Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {clinic.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {clinic.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{clinic.annual_cycles}</div>
                      <div className="text-sm text-muted-foreground">Annual Cycles</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{clinic.doctors.length}</div>
                      <div className="text-sm text-muted-foreground">Fertility Specialists</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{clinic.branches.length}</div>
                      <div className="text-sm text-muted-foreground">Locations</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">15+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                  </div>

                  {/* Success Rates Chart */}
                  {hasSuccessRates && (
                    <div className="mt-8">
                      <SuccessRateChart 
                        successRates={{
                          under35: { 
                            clinic: clinic["clinic_sr:<35"] || "N/A", 
                            national: clinic["national_avg:<35"] 
                          },
                          age35to37: { 
                            clinic: clinic["clinic_sr:35-37"] || "N/A", 
                            national: clinic["national_avg:35-37"] 
                          },
                          age38to40: { 
                            clinic: clinic["clinic_sr:38-40"] || "N/A", 
                            national: clinic["national_avg:38-40"] 
                          },
                          over40: { 
                            clinic: clinic["clinic_sr:>40"] || "N/A", 
                            national: clinic["national_avg:>40"] 
                          }
                        }} 
                        clinicName={clinic.name}
                      />
                    </div>
                  )}

                  {/* Available Treatments */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Treatments</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">IVF</Badge>
                      <Badge variant="secondary">IUI</Badge>
                      <Badge variant="secondary">Egg Freezing</Badge>
                      <Badge variant="secondary">Sperm Donation</Badge>
                      <Badge variant="secondary">Embryo Donation</Badge>
                      <Badge variant="secondary">Genetic Testing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Locations */}
              <ClinicMap 
                locations={clinic.branches.map((branch, index) => ({
                  id: `${clinic.id}-${index}`,
                  name: branch.name,
                  address: branch.street,
                  cityZip: branch["city-zip"],
                  phone: branch.phone
                }))}
                clinicName={clinic.name}
                className="mt-8"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.branches[0]?.phone || 'Contact clinic for phone number'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>Contact clinic for email</span>
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Info */}
              {clinic.doctors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clinic.doctors.map((doctor, idx) => (
                      <div key={idx} className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold">
                          {doctor.name ? doctor.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : 'Dr'}
                        </div>
                        <div>
                          <div className="font-semibold">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">Fertility Specialist</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Annual Cycles Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Annual Cycles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-card-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{clinic.annual_cycles}</div>
                    <div className="text-sm text-muted-foreground">This Clinic</div>
                  </div>
                  <div className="text-center p-4 bg-card-secondary rounded-lg">
                    <div className="text-2xl font-bold text-muted-foreground">{clinic["national_avg:annual_cycles"]}</div>
                    <div className="text-sm text-muted-foreground">National Average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Patient Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                comment: "The staff was incredibly supportive throughout our IVF journey. We're now expecting our first child!",
                date: "3 months ago"
              },
              {
                name: "Michael Chen",
                rating: 5,
                comment: "Professional care and excellent success rates. Highly recommend for fertility treatment.",
                date: "5 months ago"
              }
            ].map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-warning-amber text-warning-amber' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{review.comment}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
      <Footer />
      
      <BookConsultationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        clinicName={clinic.name}
      />
    </div>
  );
} 