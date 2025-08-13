import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, DollarSign, Clock, Shield, Globe, TrendingUp, Heart } from "lucide-react";
import { useFertilityClinicBySlug, useFertilityData } from "@/hooks/useFertilityDataFromSupabase";
import { supabase } from "@/integrations/supabase/client";
import BookConsultationModal from "@/components/BookConsultationModal";
import { FAQSection } from "@/components/FAQSection";
import { Helmet } from "react-helmet-async";
import { SuccessRateChart } from "@/components/SuccessRateChart";
import { ClinicMap } from "@/components/ClinicMap";
import LeaveReviewModal from "@/components/LeaveReviewModal";

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
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    avgCost: 0,
    avgDuration: 0,
    avgRecovery: 0,
    recommendationRate: 0
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  // Function to fetch approved reviews for this clinic
  const fetchApprovedReviews = async () => {
    if (!clinic) return;
    
    setReviewsLoading(true);
    try {
      console.log('Debug - Fetching reviews for clinic slug:', clinic.slug);
      
      // First, let's check all reviews for this clinic to see what's available
      const { data: allReviews, error: allReviewsError } = await supabase
        .from('clinic_reviews')
        .select('*')
        .eq('clinic_slug', clinic.slug)
        .eq('clinic_type', 'fertility');
      
      console.log('Debug - All reviews for this clinic:', allReviews);
      
      // Now get only approved reviews
      const { data, error } = await supabase
        .from('clinic_reviews')
        .select('*')
        .eq('clinic_slug', clinic.slug)
        .eq('clinic_type', 'fertility')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      console.log('Debug - Found approved reviews:', data);
      setApprovedReviews(data || []);

      // Calculate review statistics
      if (data && data.length > 0) {
        const totalReviews = data.length;
        const avgRating = data.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews;
        const avgCost = data.reduce((sum, review) => sum + (review.treatment_cost || 0), 0) / data.filter(r => r.treatment_cost).length || 0;
        const avgDuration = data.reduce((sum, review) => sum + (review.treatment_duration_hours || 0), 0) / data.filter(r => r.treatment_duration_hours).length || 0;
        const avgRecovery = data.reduce((sum, review) => sum + (review.recovery_time_days || 0), 0) / data.filter(r => r.recovery_time_days).length || 0;
        const recommendationRate = (data.filter(review => review.would_recommend === true).length / totalReviews) * 100;
        
        setReviewStats({
          totalReviews,
          avgRating,
          avgCost,
          avgDuration,
          avgRecovery,
          recommendationRate
        });
      } else {
        // Set default values if no reviews exist
        setReviewStats({
          totalReviews: 0,
          avgRating: 0,
          avgCost: 0,
          avgDuration: 0,
          avgRecovery: 0,
          recommendationRate: 0
        });
      }
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch approved reviews when clinic data is loaded
  React.useEffect(() => {
    if (clinic) {
      fetchApprovedReviews();
    }
  }, [clinic]);
  
  // Function to get clinic image based on clinic's position in the original array
  const getClinicImage = () => {
    if (!clinic) return clinic1;
    
    // Use clinic slug to generate a consistent index that doesn't change with filtering/pagination
    const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
    
    // Create a consistent hash from the clinic slug
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
            <Heart className="w-24 h-24 text-white mx-auto mb-4" />
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
                <span className="font-semibold text-xl">
                  {reviewStats.totalReviews > 0 ? reviewStats.avgRating.toFixed(1) : 'New'}
                </span>
                <span className="text-lg">
                  {reviewStats.totalReviews > 0 
                    ? `(${reviewStats.totalReviews} review${reviewStats.totalReviews !== 1 ? 's' : ''})`
                    : '(No reviews yet)'
                  }
                </span>
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
                    <div className="text-center p-4 bg-card-secondary rounded-lg">
                      <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">
                        {reviewStats.totalReviews > 0 ? reviewStats.avgRating.toFixed(1) : 'New'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reviewStats.totalReviews > 0 ? `(${reviewStats.totalReviews} reviews)` : '(No reviews yet)'}
                      </div>
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
                    <span>{clinic.contact_phone || '(555) 123-4567'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.contact_email || 'info@fertilityclinic.com'}</span>
                  </div>
                  <Button onClick={() => setModalOpen(true)} className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
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
                        {doctor.photo ? (
                          <img 
                            src={doctor.photo} 
                            alt={`Dr. ${doctor.name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold ${doctor.photo ? 'hidden' : ''}`}>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Patient Reviews</h2>
              <p className="text-muted-foreground mt-1">
                {reviewStats.totalReviews > 0 
                  ? ``
                  : ''
                }
              </p>
            </div>
            <Button onClick={() => setReviewModalOpen(true)} className="bg-primary hover:bg-primary/90">
              Leave a Review
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Approved Reviews from Database */}
            {approvedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold">
                      {review.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{review.reviewer_name}</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-warning-amber text-warning-amber' : 'text-muted-foreground'}`} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-muted-foreground">({review.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  {review.review_title && (
                    <h4 className="font-semibold text-foreground mb-2">{review.review_title}</h4>
                  )}
                  <p className="text-muted-foreground mb-4">{review.review_content}</p>

                  {/* Expand/Collapse Button */}
                  {(review.treatment_type || review.treatment_cost || review.treatment_duration_hours || review.recovery_time_days || review.pain_level || review.results_satisfaction || review.would_recommend !== null || (review.treatment_photos && review.treatment_photos.length > 0)) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newExpanded = new Set(expandedReviews);
                        if (newExpanded.has(review.id)) {
                          newExpanded.delete(review.id);
                        } else {
                          newExpanded.add(review.id);
                        }
                        setExpandedReviews(newExpanded);
                      }}
                      className="mb-3 text-blue-600 hover:text-blue-700"
                    >
                      {expandedReviews.has(review.id) ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Hide Details
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Show Details
                        </>
                      )}
                    </Button>
                  )}

                  {/* Treatment Information - Expandable */}
                  {expandedReviews.has(review.id) && (review.treatment_type || review.treatment_cost || review.treatment_duration_hours || review.recovery_time_days || review.pain_level || review.results_satisfaction || review.would_recommend !== null) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium text-gray-900 mb-3">Treatment Details</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {review.treatment_type && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Treatment Type</span>
                            <div className="font-medium mt-1">{review.treatment_type}</div>
                          </div>
                        )}
                        {review.treatment_cost && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Cost</span>
                            <div className="font-medium mt-1">${review.treatment_cost.toLocaleString()}</div>
                          </div>
                        )}
                        {review.treatment_duration_hours && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Duration</span>
                            <div className="font-medium mt-1">{review.treatment_duration_hours} hours</div>
                          </div>
                        )}
                        {review.recovery_time_days && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Recovery Time</span>
                            <div className="font-medium mt-1">{review.recovery_time_days} days</div>
                          </div>
                        )}
                        {review.pain_level && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Pain Level</span>
                            <div className="font-medium mt-1 flex items-center gap-1">
                              <span className="text-red-500">{review.pain_level}/10</span>
                              <div className="flex gap-1">
                                {[...Array(10)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-2 h-2 rounded-full ${i < review.pain_level ? 'bg-red-500' : 'bg-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {review.results_satisfaction && (
                          <div>
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Results Satisfaction</span>
                            <div className="font-medium mt-1 flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.results_satisfaction ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="text-sm text-gray-600">({review.results_satisfaction}/5)</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Additional Info */}
                      {(review.would_recommend !== null || review.follow_up_required !== null) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-4 text-sm">
                            {review.would_recommend !== null && (
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${review.would_recommend ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={review.would_recommend ? 'text-green-700' : 'text-red-700'}>
                                  {review.would_recommend ? 'Would recommend' : 'Would not recommend'}
                                </span>
                              </div>
                            )}
                            {review.follow_up_required !== null && (
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${review.follow_up_required ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                <span className={review.follow_up_required ? 'text-blue-700' : 'text-gray-600'}>
                                  {review.follow_up_required ? 'Follow-up required' : 'No follow-up needed'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Treatment Photos - Expandable */}
                  {expandedReviews.has(review.id) && review.treatment_photos && review.treatment_photos.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Treatment Photos ({review.treatment_photos.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {review.treatment_photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative group">
                            <img
                              src={photo}
                              alt={`Treatment result ${photoIndex + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                              onClick={() => window.open(photo, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Dummy Reviews - Always Show */}
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
              <Card key={`dummy-${index}`}>
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

            {/* Loading State */}
            {reviewsLoading && (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Loading reviews...</p>
              </div>
            )}

            {/* No Reviews State */}
            {!reviewsLoading && approvedReviews.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">No approved reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <FAQSection />
      <Footer />
      
      <BookConsultationModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        clinicSlug={clinic.slug}
        clinicName={clinic.name}
      />
      
      <LeaveReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        clinicId={clinic.id}
        clinicSlug={clinic.slug}
        clinicName={clinic.name}
      />
    </div>
  );
} 