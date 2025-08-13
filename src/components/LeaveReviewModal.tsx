import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicId: number;
  clinicSlug: string;
  clinicName: string;
}

export default function LeaveReviewModal({ 
  isOpen, 
  onClose, 
  clinicId, 
  clinicSlug, 
  clinicName 
}: LeaveReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
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
    treatment_cost: '',
    treatment_duration_hours: '',
    recovery_time_days: '',
    pain_level: 0,
    results_satisfaction: 0,
    would_recommend: false,
    follow_up_required: false
  });

  const [treatmentPhotos, setTreatmentPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (newFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please select valid image files (JPG, PNG, WebP) under 5MB each.",
        variant: "destructive"
      });
      return;
    }

    if (treatmentPhotos.length + newFiles.length > 5) {
      toast({
        title: "Too Many Photos",
        description: "You can upload a maximum of 5 photos.",
        variant: "destructive"
      });
      return;
    }

    setTreatmentPhotos(prev => [...prev, ...newFiles]);
  };

  const removePhoto = (index: number) => {
    setTreatmentPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (treatmentPhotos.length === 0) return [];

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of treatmentPhotos) {
        const fileName = `review-photos/${clinicId}/${Date.now()}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('review-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw new Error('Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }

    return uploadedUrls;
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
      // Upload photos first
      const photoUrls = await uploadPhotosToStorage();

      // Submit review with photos
      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { error } = await supabase
        .from('clinic_reviews')
        .insert([{
          clinic_id: clinicId,
          clinic_slug: clinicSlug,
          clinic_type: 'fertility',
          reviewer_name: formData.reviewer_name,
          reviewer_email: formData.reviewer_email,
          rating: formData.rating,
          review_title: formData.review_title,
          review_content: formData.review_content,
          review_date: formData.review_date,
          treatment_date: formData.treatment_date || null,
          treatment_type: formData.treatment_type,
          treatment_cost: formData.treatment_cost ? parseFloat(formData.treatment_cost) : null,
          treatment_duration_hours: formData.treatment_duration_hours ? parseInt(formData.treatment_duration_hours) : null,
          recovery_time_days: formData.recovery_time_days ? parseInt(formData.recovery_time_days) : null,
          pain_level: formData.pain_level || null,
          results_satisfaction: formData.results_satisfaction || null,
          would_recommend: formData.would_recommend,
          follow_up_required: formData.follow_up_required,
          treatment_photos: photoUrls,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your review! It will be published after approval.",
      });

      // Reset form
      setFormData({
        reviewer_name: '',
        reviewer_email: '',
        rating: 0,
        review_title: '',
        review_content: '',
        review_date: new Date().toISOString().split('T')[0],
        treatment_date: '',
        treatment_type: '',
        treatment_cost: '',
        treatment_duration_hours: '',
        recovery_time_days: '',
        pain_level: 0,
        results_satisfaction: 0,
        would_recommend: false,
        follow_up_required: false
      });
      setTreatmentPhotos([]);
      setPhotoUrls([]);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
          <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
              Leave a Review for {clinicName}
            </DialogTitle>
          </DialogHeader>
        
                  <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reviewer_name">Your Name *</Label>
                <Input
                  id="reviewer_name"
                  value={formData.reviewer_name}
                  onChange={(e) => handleInputChange('reviewer_name', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="reviewer_email">Email Address</Label>
                <Input
                  id="reviewer_email"
                  type="email"
                  value={formData.reviewer_email}
                  onChange={(e) => handleInputChange('reviewer_email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

                      {/* Rating */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-900">Overall Rating *</h3>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleInputChange('rating', star)}
                  className={`text-3xl ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-lg font-semibold">({formData.rating}/5)</span>
            </div>
          </div>

          {/* Review Content */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-900">Review Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="review_title">Review Title</Label>
                <Input
                  id="review_title"
                  value={formData.review_title}
                  onChange={(e) => handleInputChange('review_title', e.target.value)}
                  placeholder="Brief title for your review"
                />
              </div>
              
              <div>
                <Label htmlFor="review_content">Review Content *</Label>
                <Textarea
                  id="review_content"
                  value={formData.review_content}
                  onChange={(e) => handleInputChange('review_content', e.target.value)}
                  placeholder="Share your experience with this clinic..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-purple-900">Treatment Information (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="treatment_date">Treatment Date</Label>
                <Input
                  id="treatment_date"
                  type="date"
                  value={formData.treatment_date}
                  onChange={(e) => handleInputChange('treatment_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="treatment_type">Treatment Type</Label>
                <Select
                  value={formData.treatment_type}
                  onValueChange={(value) => handleInputChange('treatment_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IVF">IVF</SelectItem>
                    <SelectItem value="IUI">IUI</SelectItem>
                    <SelectItem value="ICSI">ICSI</SelectItem>
                    <SelectItem value="Egg Freezing">Egg Freezing</SelectItem>
                    <SelectItem value="Sperm Donation">Sperm Donation</SelectItem>
                    <SelectItem value="Embryo Donation">Embryo Donation</SelectItem>
                    <SelectItem value="Genetic Testing">Genetic Testing</SelectItem>
                    <SelectItem value="Fertility Consultation">Fertility Consultation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="treatment_cost">Treatment Cost ($)</Label>
                <Input
                  id="treatment_cost"
                  type="number"
                  value={formData.treatment_cost}
                  onChange={(e) => handleInputChange('treatment_cost', e.target.value)}
                  placeholder="Enter cost"
                />
              </div>
              
              <div>
                <Label htmlFor="treatment_duration_hours">Treatment Duration (hours)</Label>
                <Input
                  id="treatment_duration_hours"
                  type="number"
                  value={formData.treatment_duration_hours}
                  onChange={(e) => handleInputChange('treatment_duration_hours', e.target.value)}
                  placeholder="Enter duration"
                />
              </div>
              
              <div>
                <Label htmlFor="recovery_time_days">Recovery Time (days)</Label>
                <Input
                  id="recovery_time_days"
                  type="number"
                  value={formData.recovery_time_days}
                  onChange={(e) => handleInputChange('recovery_time_days', e.target.value)}
                  placeholder="Enter recovery time"
                />
              </div>
            </div>
          </div>

          {/* Experience Ratings */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-900">Experience Ratings (Optional)</h3>
            
            <div className="space-y-4">
              {/* Pain Level */}
              <div>
                <Label>Pain Level (1-10)</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleInputChange('pain_level', level)}
                      className={`w-8 h-8 rounded-full text-sm font-semibold ${
                        formData.pain_level >= level
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.pain_level > 0 ? `${formData.pain_level}/10` : ''}
                  </span>
                </div>
              </div>

              {/* Results Satisfaction */}
              <div>
                <Label>Results Satisfaction</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange('results_satisfaction', star)}
                      className={`text-xl ${formData.results_satisfaction >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.results_satisfaction > 0 ? `${formData.results_satisfaction}/5` : ''}
                  </span>
                </div>
              </div>

              {/* Would Recommend */}
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="would_recommend"
                    checked={formData.would_recommend}
                    onChange={(e) => handleInputChange('would_recommend', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="would_recommend">Would recommend to others</Label>
                </div>
              </div>

              {/* Follow-up Required */}
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="follow_up_required"
                    checked={formData.follow_up_required}
                    onChange={(e) => handleInputChange('follow_up_required', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="follow_up_required">Follow-up treatment required</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Treatment Photos (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload photos of your treatment results. Maximum 5 photos, 5MB each.
            </p>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload photos or drag and drop
                  </p>
                </label>
              </div>
              
              {treatmentPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {treatmentPhotos.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || uploadingPhotos}
            >
              {isSubmitting || uploadingPhotos ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 