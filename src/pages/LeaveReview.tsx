import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LeaveReview() {
  const { clinicSlug } = useParams<{ clinicSlug: string }>();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 0,
    review_title: '',
    review_content: '',
    review_date: new Date().toISOString().split('T')[0],
    treatment_date: '',
    treatment_type: '',
    cost_range: ''
  });

  useEffect(() => {
    if (clinicSlug) {
      fetchClinic();
    }
  }, [clinicSlug]);

  const fetchClinic = async () => {
    try {
      const { data, error } = await supabase
        .from("fertility_clinics")
        .select("*")
        .eq("slug", clinicSlug)
        .single();

      if (error) throw error;
      setClinic(data);
    } catch (error) {
      console.error("Error fetching clinic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating for this clinic.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.review_content.trim()) {
      toast({
        title: "Review Content Required",
        description: "Please provide your review content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { error } = await supabase
        .from('clinic_reviews')
        .insert([{
          clinic_id: clinic.id,
          clinic_slug: clinicSlug,
          reviewer_name: formData.reviewer_name,
          reviewer_email: formData.reviewer_email,
          rating: formData.rating,
          review_title: formData.review_title,
          review_content: formData.review_content,
          review_date: formData.review_date,
          treatment_date: formData.treatment_date,
          treatment_type: formData.treatment_type,
          cost_range: formData.cost_range,
          clinic_type: 'fertility',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Review Submitted!",
        description: "Thank you for your review. It will be published after moderation.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        onClick={() => handleInputChange('rating', i + 1)}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Review Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for taking the time to share your experience. Your review will be published after our moderation team reviews it.
              </p>
              <div className="space-y-3">
                <Link to={`/clinic/${clinicSlug}`}>
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Clinic
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Leave a Review - {clinic?.name} | FertilityDoc</title>
        <meta name="description" content={`Share your experience with ${clinic?.name}. Leave a review to help others make informed decisions about fertility treatment.`} />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to={`/clinic/${clinicSlug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {clinic?.name}
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Leave a Review
            </h1>
            <p className="text-gray-600">
              Share your experience with {clinic?.name} to help others make informed decisions about fertility treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                      <Label className="text-base font-medium">Overall Rating *</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {renderStars(formData.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {formData.rating > 0 ? `${formData.rating} out of 5` : 'Click to rate'}
                        </span>
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <Label htmlFor="review_title">Review Title</Label>
                      <Input
                        id="review_title"
                        value={formData.review_title}
                        onChange={(e) => handleInputChange('review_title', e.target.value)}
                        placeholder="Summarize your experience in a few words"
                        maxLength={100}
                      />
                    </div>

                    {/* Review Content */}
                    <div>
                      <Label htmlFor="review_content">Your Review *</Label>
                      <Textarea
                        id="review_content"
                        value={formData.review_content}
                        onChange={(e) => handleInputChange('review_content', e.target.value)}
                        placeholder="Share your detailed experience with this fertility clinic..."
                        rows={6}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum 50 characters. Be specific about your experience.
                      </p>
                    </div>

                    {/* Treatment Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="treatment_type">Treatment Type</Label>
                        <Select value={formData.treatment_type} onValueChange={(value) => handleInputChange('treatment_type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select treatment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ivf">IVF</SelectItem>
                            <SelectItem value="iui">IUI</SelectItem>
                            <SelectItem value="fertility-medication">Fertility Medication</SelectItem>
                            <SelectItem value="egg-freezing">Egg Freezing</SelectItem>
                            <SelectItem value="sperm-freezing">Sperm Freezing</SelectItem>
                            <SelectItem value="embryo-transfer">Embryo Transfer</SelectItem>
                            <SelectItem value="consultation">Consultation Only</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="treatment_date">Treatment Date</Label>
                        <Input
                          id="treatment_date"
                          type="date"
                          value={formData.treatment_date}
                          onChange={(e) => handleInputChange('treatment_date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Cost Range */}
                    <div>
                      <Label htmlFor="cost_range">Cost Range</Label>
                      <Select value={formData.cost_range} onValueChange={(value) => handleInputChange('cost_range', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cost range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5000">Under $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                          <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                          <SelectItem value="over-30000">Over $30,000</SelectItem>
                          <SelectItem value="not-sure">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Personal Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reviewer_name">Name</Label>
                          <Input
                            id="reviewer_name"
                            value={formData.reviewer_name}
                            onChange={(e) => handleInputChange('reviewer_name', e.target.value)}
                            placeholder="Your name (optional)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reviewer_email">Email</Label>
                          <Input
                            id="reviewer_email"
                            type="email"
                            value={formData.reviewer_email}
                            onChange={(e) => handleInputChange('reviewer_email', e.target.value)}
                            placeholder="Your email (optional)"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Submitting Review..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Clinic Information Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Clinic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{clinic?.name}</h4>
                      <p className="text-sm text-gray-600">{clinic?.city}, {clinic?.country}</p>
                    </div>
                    
                    {clinic?.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(clinic.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {clinic.rating.toFixed(1)} ({clinic.review_count || 0} reviews)
                        </span>
                      </div>
                    )}

                    {clinic?.specialties && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Specialties</h5>
                        <div className="flex flex-wrap gap-1">
                          {clinic.specialties.map((specialty: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Review Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Be honest and accurate in your review</li>
                    <li>• Focus on your personal experience</li>
                    <li>• Avoid personal attacks or inappropriate language</li>
                    <li>• Include specific details about your treatment</li>
                    <li>• Reviews are moderated before publication</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 