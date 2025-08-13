
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, DollarSign, Clock, Shield, Globe } from "lucide-react";
import { useClinicBySlug } from "@/hooks/useClinicById";
import clinicInterior from "@/assets/clinic-interior.jpg";
import beforeAfter from "@/assets/before-after.jpg";
import clinic1 from "@/assets/clinic-1.jpg";
import BookConsultationModal from "@/components/BookConsultationModal";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";
import { Helmet } from "react-helmet-async";
import LeaveReviewModal from "@/components/LeaveReviewModal";

export default function ClinicDetail() {
  const { clinicSlug } = useParams<{ clinicSlug: string }>();
  const { data: clinic, isLoading, error } = useClinicBySlug(clinicSlug || '');
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
            <p className="text-muted-foreground">Fetching clinic details...</p>
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
            <p className="text-muted-foreground">The requested clinic page could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const metaTitle = `${clinic.clinic_name}: Reviews, Prices, Before and After - Best Hair Docs`;
  const metaDescription = `${clinic.clinic_name} is a top-rated hair transplant clinic located in ${clinic.city || ''}${clinic.city && clinic.country ? ', ' : ''}${clinic.country || ''}. View the full profile to see reviews, photos, pricing, and contact details.`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={clinic.hero_image_url || clinic1} 
          alt={`${clinic.clinic_name} clinic`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Badge className="bg-success-green text-background mb-4">
              ✓ Verified Clinic
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{clinic.clinic_name}</h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{clinic.city}, {clinic.country}</span>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-warning-amber text-warning-amber" />
                <span className="font-semibold text-xl">4.8</span>
              </div>
              <span className="text-lg">(250+ reviews)</span>
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
                      <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">15+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">2000+</div>
                      <div className="text-sm text-muted-foreground">Procedures Done</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">6-8h</div>
                      <div className="text-sm text-muted-foreground">Average Duration</div>
                    </div>
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">98%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">FUE</Badge>
                      <Badge variant="secondary">DHI</Badge>
                      <Badge variant="secondary">Sapphire FUE</Badge>
                    </div>
                  </div>

                  {clinic.languages && clinic.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Languages Spoken</h3>
                      <div className="flex flex-wrap gap-2">
                        {clinic.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Before & After */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Before & After Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(clinic.results_images) && clinic.results_images.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {clinic.results_images.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Result ${idx + 1}`}
                          className="w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={beforeAfter}
                      alt="Before and after hair transplant results"
                      className="w-full rounded-lg object-cover"
                    />
                  )}
                </CardContent>
              </Card>
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
                    <span>{clinic.contact_phone || '+90 212 555 0123'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.contact_email || `info@${clinic.clinic_name.toLowerCase().replace(/\s+/g, '')}.com`}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{clinic.city}, {clinic.state_province}, {clinic.country}</span>
                  </div>
                  {clinic.clinic_url && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={clinic.clinic_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <Button className="w-full" onClick={() => setModalOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                  {clinic.video_consultation && (
                    <Button variant="outline" className="w-full">
                      Video Consultation Available
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span>Pricing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clinic.price_range ? (
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary">{clinic.price_range}</div>
                      <div className="text-sm text-muted-foreground">Price Range</div>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <div className="text-lg font-medium text-foreground">Contact for Pricing</div>
                      <div className="text-sm text-muted-foreground">Custom quotes available</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Doctor Info */}
              {Array.isArray(clinic.doctors) && clinic.doctors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clinic.doctors.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold">
                          {doc.name ? doc.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : 'Dr'}
                        </div>
                        <div>
                          <div className="font-semibold">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">{doc.position}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Patient Reviews</h2>
            <Button onClick={() => setReviewModalOpen(true)} className="bg-primary hover:bg-primary/90">
              Leave a Review
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "John Smith",
                rating: 5,
                comment: "Excellent service and professional staff. The results exceeded my expectations!",
                date: "2 months ago"
              },
              {
                name: "Mike Johnson",
                rating: 5,
                comment: "Highly recommend this clinic. Very clean, modern facilities and skilled doctors.",
                date: "3 months ago"
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
                  <p className="text-muted-foreground">{review.comment}</p>
                  <div className="text-sm text-muted-foreground mt-2">{review.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookConsultationModal open={modalOpen} onOpenChange={setModalOpen} clinicSlug={clinic.slug} />
      
      <LeaveReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        clinicId={clinic.id}
        clinicSlug={clinic.slug}
        clinicName={clinic.clinic_name}
      />
      
      <FAQSection />
      <Footer />
    </div>
  );
}
