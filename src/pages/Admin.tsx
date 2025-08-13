import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X, Edit, Trash2, Building2, Users, Award, Star } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

// Helper to generate slug from clinic name
function generateSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.floor(Math.random() * 1000000);
  return `${base}-${random}`;
}

const Admin = () => {
  const [user, setUser] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingClinic, setEditingClinic] = useState(null);
  
  // Fertility clinic form state
  const [form, setForm] = useState({
    name: "",
    url: "",
    contact_phone: "",
    contact_email: "",
    annual_cycles: "",
    national_avg_annual_cycles: "",
    clinic_sr_under35: "",
    national_avg_under35: "",
    clinic_sr_35to37: "",
    national_avg_35to37: "",
    clinic_sr_38to40: "",
    national_avg_38to40: "",
    clinic_sr_over40: "",
    national_avg_over40: "",
    doctors: [{ name: "", photo: "" }],
    branches: [{ name: "", street: "", "city-zip": "", phone: "" }],
    description: ""
  });
  
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [consultationSubmissions, setConsultationSubmissions] = useState([]);
  const [patientResponses, setPatientResponses] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [clinicReviews, setClinicReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  
  // Modal states for consultation and contact details
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const [editReviewForm, setEditReviewForm] = useState({
    rating: 0,
    review_title: '',
    review_content: '',
    treatment_type: '',
    treatment_cost: '',
    treatment_duration_hours: '',
    recovery_time_days: '',
    pain_level: 0,
    results_satisfaction: 0,
    would_recommend: false,
    follow_up_required: false
  });

  const SITE_URL = import.meta.env.VITE_SITE_URL;
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    featured_image_url: '',
    author_name: 'FertilityIQ Team',
    category: 'Fertility',
    tags: '',
    status: 'draft',
    reading_time_minutes: 5
  });
  const formRef = useRef(null);
  const { toast } = useToast();
  const [tab, setTab] = useState("clinics");
  const navigate = useNavigate();

  const filteredClinics = clinics.filter(
    c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.clinic_id?.toLowerCase().includes(search.toLowerCase())
  );
  
  const [clinicPage, setClinicPage] = useState(1);
  const clinicsPerPage = 10;
  const totalClinicPages = Math.ceil(filteredClinics.length / clinicsPerPage);
  const paginatedClinics = filteredClinics.slice((clinicPage - 1) * clinicsPerPage, clinicPage * clinicsPerPage);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchClinics();
      fetchLeads();
      fetchContactSubmissions();
      fetchConsultationSubmissions();
      fetchPatientResponses();
      fetchBlogPosts();
      fetchClinicReviews();
    }
  }, [user]);

  const fetchClinics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("fertility_clinics").select("*").order("name");
    if (error) setError(error.message);
    else setClinics(data);
    setLoading(false);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error) setLeads(data);
  };

  const fetchContactSubmissions = async () => {
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (!error) setContactSubmissions(data);
  };

  const fetchConsultationSubmissions = async () => {
    const { data, error } = await supabase.from("consultation_submissions").select("*").order("created_at", { ascending: false });
    if (!error) setConsultationSubmissions(data);
  };

  const fetchPatientResponses = async () => {
    try {
      // @ts-expect-error - quiz_responses table is new, types need to be regenerated
      const { data, error } = await supabase.from("quiz_responses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setPatientResponses(data || []);
    } catch (error) {
              console.error("Error fetching quiz responses:", error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      // @ts-expect-error - blog_posts table is new, types need to be regenerated
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("blog_type", "fertility")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const fetchClinicReviews = async () => {
    try {
      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { data, error } = await supabase
        .from("clinic_reviews")
        .select("*")
        .eq("clinic_type", "fertility")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setClinicReviews(data || []);
    } catch (error) {
      console.error("Error fetching clinic reviews:", error);
    }
  };

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      setBlogForm(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Auto-generate slug from title
      const slug = blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      const postData = {
        ...blogForm,
        slug,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published_at: blogForm.status === 'published' ? new Date().toISOString() : null,
        blog_type: 'fertility'
      };

      if (editingPost) {
        // Update existing post
        // @ts-expect-error - blog_posts table is new, types need to be regenerated
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        toast({ title: "Post Updated", description: "Blog post updated successfully." });
      } else {
        // Create new post
        // @ts-expect-error - blog_posts table is new, types need to be regenerated
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
        toast({ title: "Post Created", description: "Blog post created successfully." });
      }
      
      setShowBlogModal(false);
      setEditingPost(null);
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        featured_image_url: '',
        author_name: 'FertilityIQ Team',
        category: 'Fertility',
        tags: '',
        status: 'draft',
        reading_time_minutes: 5
      });
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openBlogModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setBlogForm({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image_url: post.featured_image_url || '',
        author_name: post.author_name || 'FertilityIQ Team',
        category: post.category || 'Fertility',
        tags: post.tags ? post.tags.join(', ') : '',
        status: post.status || 'draft',
        reading_time_minutes: post.reading_time_minutes || 5
      });
    } else {
      setEditingPost(null);
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        featured_image_url: '',
        author_name: 'FertilityIQ Team',
        category: 'Fertility',
        tags: '',
        status: 'draft',
        reading_time_minutes: 5
      });
    }
    setShowBlogModal(true);
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      let fileName = `blog-featured-${Date.now()}-${sanitizeFileName(file.name)}`;
      
      // Try blog-images bucket first
      let { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);
      
      let bucketName = 'blog-images';
      
      // If blog-images fails, try avatars bucket as fallback
      if (uploadError && uploadError.message.includes('bucket')) {
        console.log('Blog-images bucket failed, trying avatars bucket...');
        fileName = `blog-${Date.now()}-${sanitizeFileName(file.name)}`;
        const { error: fallbackError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);
        
        if (fallbackError) throw fallbackError;
        bucketName = 'avatars';
      } else if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setBlogForm(prev => ({
        ...prev,
        featured_image_url: publicUrl
      }));

      toast({
        title: "Success",
        description: "Featured image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading featured image:', error);
      toast({
        title: "Error",
        description: "Failed to upload featured image",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlogPost = async (postId) => {
    try {
      // @ts-expect-error - blog_posts table is new, types need to be regenerated
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleReviewApproval = async (reviewId: number, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const updateData: any = {
        status,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        approved_by: user?.email || 'admin'
      };

      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { error } = await supabase
        .from('clinic_reviews')
        .update(updateData)
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: `Review ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `Review has been ${status === 'approved' ? 'approved and published' : 'rejected'}.`,
      });

      fetchClinicReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditReviewFormChange = (field: string, value: string | number | boolean) => {
    setEditReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingReview) return;

    try {
      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { error } = await supabase
        .from('clinic_reviews')
        .update({
          rating: editReviewForm.rating,
          review_title: editReviewForm.review_title,
          review_content: editReviewForm.review_content,
          treatment_type: editReviewForm.treatment_type || null,
          treatment_cost: editReviewForm.treatment_cost ? parseFloat(editReviewForm.treatment_cost) : null,
          treatment_duration_hours: editReviewForm.treatment_duration_hours ? parseInt(editReviewForm.treatment_duration_hours) : null,
          recovery_time_days: editReviewForm.recovery_time_days ? parseInt(editReviewForm.recovery_time_days) : null,
          pain_level: editReviewForm.pain_level || null,
          results_satisfaction: editReviewForm.results_satisfaction || null,
          would_recommend: editReviewForm.would_recommend,
          follow_up_required: editReviewForm.follow_up_required,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingReview.id);

      if (error) throw error;

      toast({
        title: "Review Updated",
        description: "Review has been successfully updated.",
      });

      setShowEditReviewModal(false);
      setEditingReview(null);
      fetchClinicReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review.",
        variant: "destructive"
      });
    }
  };

  const handleReviewDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      // @ts-expect-error - clinic_reviews table is new, types need to be regenerated
      const { error } = await supabase
        .from('clinic_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({ 
        title: "Review Deleted", 
        description: "Review has been deleted successfully." 
      });

      fetchClinicReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete review.", 
        variant: "destructive" 
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEdit = (clinic) => {
    setEditingClinic(clinic);
    setForm({
      name: clinic.name || "",
      url: clinic.url || "",
      contact_phone: clinic.contact_phone || "",
      contact_email: clinic.contact_email || "",
      annual_cycles: clinic.annual_cycles || "",
      national_avg_annual_cycles: clinic.national_avg_annual_cycles || "",
      clinic_sr_under35: clinic.clinic_sr_under35 || "",
      national_avg_under35: clinic.national_avg_under35 || "",
      clinic_sr_35to37: clinic.clinic_sr_35to37 || "",
      national_avg_35to37: clinic.national_avg_35to37 || "",
      clinic_sr_38to40: clinic.clinic_sr_38to40 || "",
      national_avg_38to40: clinic.national_avg_38to40 || "",
      clinic_sr_over40: clinic.clinic_sr_over40 || "",
      national_avg_over40: clinic.national_avg_over40 || "",
      doctors: clinic.doctors || [{ name: "", photo: "" }],
      branches: clinic.branches || [{ name: "", street: "", "city-zip": "", phone: "" }],
      description: clinic.description || ""
    });
    
    // Scroll to the top form when editing
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this clinic?")) {
      const { error } = await supabase.from("fertility_clinics").delete().eq("id", id);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Clinic deleted successfully",
        });
        fetchClinics();
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addDoctor = () => {
    setForm(prev => ({
      ...prev,
      doctors: [...prev.doctors, { name: "", photo: "" }]
    }));
  };

  const removeDoctor = (index) => {
    setForm(prev => ({
      ...prev,
      doctors: prev.doctors.filter((_, i) => i !== index)
    }));
  };

  const updateDoctor = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      doctors: prev.doctors.map((doctor, i) => 
        i === index ? { ...doctor, [field]: value } : doctor
      )
    }));
  };

  const addBranch = () => {
    setForm(prev => ({
      ...prev,
      branches: [...prev.branches, { name: "", street: "", "city-zip": "", phone: "" }]
    }));
  };

  const removeBranch = (index) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  const updateBranch = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      )
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const clinicData = {
      name: form.name,
      url: form.url,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      annual_cycles: form.annual_cycles,
      national_avg_annual_cycles: form.national_avg_annual_cycles,
      clinic_sr_under35: form.clinic_sr_under35,
      national_avg_under35: form.national_avg_under35,
      clinic_sr_35to37: form.clinic_sr_35to37,
      national_avg_35to37: form.national_avg_35to37,
      clinic_sr_38to40: form.clinic_sr_38to40,
      national_avg_38to40: form.national_avg_38to40,
      clinic_sr_over40: form.clinic_sr_over40,
      national_avg_over40: form.national_avg_over40,
      doctors: form.doctors.filter(d => d.name.trim()),
      branches: form.branches.filter(b => b.name.trim() && b.street.trim()),
      description: form.description
    };

    if (editingClinic) {
      // Update existing clinic
      const { error } = await supabase
        .from("fertility_clinics")
        .update(clinicData)
        .eq("id", editingClinic.id);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Clinic updated successfully",
        });
        setEditingClinic(null);
        setForm({
          name: "", url: "", contact_phone: "", contact_email: "", annual_cycles: "", national_avg_annual_cycles: "",
          clinic_sr_under35: "", national_avg_under35: "", clinic_sr_35to37: "", national_avg_35to37: "",
          clinic_sr_38to40: "", national_avg_38to40: "", clinic_sr_over40: "", national_avg_over40: "",
          doctors: [{ name: "", photo: "" }], branches: [{ name: "", street: "", "city-zip": "", phone: "" }], description: ""
        });
        fetchClinics();
      }
    } else {
      // Add new clinic
      const clinicId = `clinic-${Date.now()}`;
      const slug = generateSlug(form.name);
      
      const { error } = await supabase
        .from("fertility_clinics")
        .insert([{
          clinic_id: clinicId,
          slug: slug,
          ...clinicData
        }]);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Clinic added successfully",
        });
        setForm({
          name: "", url: "", contact_phone: "", contact_email: "", annual_cycles: "", national_avg_annual_cycles: "",
          clinic_sr_under35: "", national_avg_under35: "", clinic_sr_35to37: "", national_avg_35to37: "",
          clinic_sr_38to40: "", national_avg_38to40: "", clinic_sr_over40: "", national_avg_over40: "",
          doctors: [{ name: "", photo: "" }], branches: [{ name: "", street: "", "city-zip": "", phone: "" }], description: ""
        });
        fetchClinics();
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="password" type="password" placeholder="Password" required />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Admin Dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">Logout</Button>
        </div>

        <Tabs value={tab} onValueChange={(value) => {
          setTab(value);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} className="space-y-6">
          <TabsList className="mb-6 bg-white shadow rounded-lg p-2 flex flex-wrap gap-2 border border-border min-h-[58px]">
            <TabsTrigger value="clinics" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Clinics</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Quiz Responses</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm sm:text-lg font-semibold flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 flex-1 sm:flex-none min-w-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clinics" className="space-y-6">
            <Card ref={formRef}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{editingClinic ? "Edit Clinic" : "Add Clinic"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Clinic Name *</label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Clinic Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Clinic Link</label>
                      <div className="flex gap-2">
                        <Input
                          name="slug"
                          value={editingClinic ? `${window.location.origin}/en/fertility-clinic/${editingClinic.slug}` : ''}
                          readOnly
                          className="bg-muted cursor-default"
                          placeholder="Clinic link will appear here when editing"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const clinicLink = editingClinic ? `${window.location.origin}/en/fertility-clinic/${editingClinic.slug}` : '';
                            if (clinicLink) {
                              navigator.clipboard.writeText(clinicLink);
                              toast({
                                title: "Copied!",
                                description: "Clinic link copied to clipboard",
                              });
                            }
                          }}
                          disabled={!editingClinic}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Clinic Phone</label>
                      <Input
                        name="contact_phone"
                        value={form.contact_phone}
                        onChange={handleFormChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Clinic Email</label>
                      <Input
                        name="contact_email"
                        value={form.contact_email}
                        onChange={handleFormChange}
                        type="email"
                        placeholder="contact@clinic.com"
                      />
                    </div>
                  </div>

                  {/* Annual Cycles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Annual Cycles</label>
                      <Input
                        name="annual_cycles"
                        value={form.annual_cycles}
                        onChange={handleFormChange}
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">National Avg Annual Cycles</label>
                      <Input
                        name="national_avg_annual_cycles"
                        value={form.national_avg_annual_cycles}
                        onChange={handleFormChange}
                        placeholder="e.g., 450"
                      />
                    </div>
                  </div>

                  {/* Success Rates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Success Rates by Age Group</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Under 35 - Clinic %</label>
                        <Input
                          name="clinic_sr_under35"
                          value={form.clinic_sr_under35}
                          onChange={handleFormChange}
                          placeholder="e.g., 65%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Under 35 - National %</label>
                        <Input
                          name="national_avg_under35"
                          value={form.national_avg_under35}
                          onChange={handleFormChange}
                          placeholder="e.g., 60%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">35-37 - Clinic %</label>
                        <Input
                          name="clinic_sr_35to37"
                          value={form.clinic_sr_35to37}
                          onChange={handleFormChange}
                          placeholder="e.g., 55%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">35-37 - National %</label>
                        <Input
                          name="national_avg_35to37"
                          value={form.national_avg_35to37}
                          onChange={handleFormChange}
                          placeholder="e.g., 50%"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">38-40 - Clinic %</label>
                        <Input
                          name="clinic_sr_38to40"
                          value={form.clinic_sr_38to40}
                          onChange={handleFormChange}
                          placeholder="e.g., 45%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">38-40 - National %</label>
                        <Input
                          name="national_avg_38to40"
                          value={form.national_avg_38to40}
                          onChange={handleFormChange}
                          placeholder="e.g., 40%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Over 40 - Clinic %</label>
                        <Input
                          name="clinic_sr_over40"
                          value={form.clinic_sr_over40}
                          onChange={handleFormChange}
                          placeholder="e.g., 35%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Over 40 - National %</label>
                        <Input
                          name="national_avg_over40"
                          value={form.national_avg_over40}
                          onChange={handleFormChange}
                          placeholder="e.g., 30%"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctors */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Doctors</h3>
                      <Button type="button" onClick={addDoctor} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Doctor
                      </Button>
                    </div>
                    
                    {form.doctors.map((doctor, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <label className="text-sm font-medium">Doctor Name</label>
                          <Input
                            value={doctor.name}
                            onChange={(e) => updateDoctor(index, 'name', e.target.value)}
                            placeholder="Doctor Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Photo URL</label>
                          <Input
                            value={doctor.photo}
                            onChange={(e) => updateDoctor(index, 'photo', e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => removeDoctor(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Branches */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Branches/Locations</h3>
                      <Button type="button" onClick={addBranch} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Branch
                      </Button>
                    </div>
                    
                    {form.branches.map((branch, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                        <div>
                          <label className="text-sm font-medium">Branch Name</label>
                          <Input
                            value={branch.name}
                            onChange={(e) => updateBranch(index, 'name', e.target.value)}
                            placeholder="Branch Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Street Address</label>
                          <Input
                            value={branch.street}
                            onChange={(e) => updateBranch(index, 'street', e.target.value)}
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">City, State ZIP</label>
                          <Input
                            value={branch["city-zip"]}
                            onChange={(e) => updateBranch(index, 'city-zip', e.target.value)}
                            placeholder="New York, NY 10001"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                              value={branch.phone}
                              onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeBranch(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Clinic description..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      {editingClinic ? "Update Clinic" : "Add Clinic"}
                    </Button>
                    {editingClinic && (
                      <Button type="button" variant="outline" onClick={() => {
                        setEditingClinic(null);
                        setForm({
                          name: "", url: "", contact_phone: "", contact_email: "", annual_cycles: "", national_avg_annual_cycles: "",
                          clinic_sr_under35: "", national_avg_under35: "", clinic_sr_35to37: "", national_avg_35to37: "",
                          clinic_sr_38to40: "", national_avg_38to40: "", clinic_sr_over40: "", national_avg_over40: "",
                          doctors: [{ name: "", photo: "" }], branches: [{ name: "", street: "", "city-zip": "", phone: "" }], description: ""
                        });
                      }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Clinics List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Fertility Clinics</CardTitle>
                <Input
                  placeholder="Search clinics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm w-full"
                />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {paginatedClinics.map((clinic) => (
                      <div key={clinic.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg">{clinic.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {clinic.clinic_id}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">{clinic.branches?.length || 0} locations</Badge>
                            <Badge variant="secondary" className="text-xs">{clinic.doctors?.length || 0} doctors</Badge>
                            {clinic.annual_cycles && (
                              <Badge variant="outline" className="text-xs">{clinic.annual_cycles} cycles/year</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button
                            onClick={() => handleEdit(clinic)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(clinic.id)}
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {totalClinicPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
                        <Button
                          onClick={() => setClinicPage(prev => Math.max(1, prev - 1))}
                          disabled={clinicPage === 1}
                          variant="outline"
                          size="sm"
                          className="text-sm"
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm">
                          Page {clinicPage} of {totalClinicPages}
                        </span>
                        <Button
                          onClick={() => setClinicPage(prev => Math.min(totalClinicPages, prev + 1))}
                          disabled={clinicPage === totalClinicPages}
                          variant="outline"
                          size="sm"
                          className="text-sm"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {submission.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{submission.name}</h3>
                              <p className="text-sm text-gray-600">{submission.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Clinic</p>
                            <p className="text-sm text-gray-900 font-medium">{submission.clinic_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm text-gray-900 font-medium">{submission.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={`/en/fertility-clinic/${submission.clinic_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                          >
                            <Building2 className="w-4 h-4" />
                            View Clinic Page
                          </a>
                          <Button
                            onClick={() => {
                              setSelectedConsultation(submission);
                              setShowConsultationModal(true);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {consultationSubmissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No consultation submissions yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {submission.first_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{submission.first_name} {submission.last_name}</h3>
                              <p className="text-sm text-gray-600">{submission.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm text-gray-900 font-medium">{submission.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Subject</p>
                            <p className="text-sm text-gray-900 font-medium">{submission.subject}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedContact(submission);
                            setShowContactModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {contactSubmissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No contact submissions yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Responses Tab */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quiz Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientResponses.map((patient) => (
                    <div key={patient.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {patient.first_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{patient.first_name} {patient.last_name}</h3>
                              <p className="text-sm text-gray-600">{patient.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              {new Date(patient.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm text-gray-900 font-medium">{patient.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          View Quiz Answers
                        </Button>
                      </div>
                    </div>
                  ))}
                  {patientResponses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No quiz responses yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle className="text-lg sm:text-xl">Blog Posts Management</CardTitle>
                  <Button onClick={() => openBlogModal()} className="w-full sm:w-auto">
                    Add New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead>
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Author</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Published</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="border-b">
                          <td className="p-2">{post.id}</td>
                          <td className="p-2 font-medium">{post.title}</td>
                          <td className="p-2">{post.author_name}</td>
                          <td className="p-2">
                            <Badge variant="secondary">{post.category}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                              {post.status}
                            </Badge>
                          </td>
                          <td className="p-2">{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openBlogModal(post)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this post?')) {
                                    handleDeleteBlogPost(post.id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {blogPosts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No blog posts yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Clinic Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 sm:px-6 py-4 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg">
                              {review.reviewer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{review.reviewer_name}</h3>
                              <a 
                                href={`${SITE_URL}/en/fertility-clinic/${review.clinic_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                {review.clinic_slug}
                              </a>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <Badge variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'}>
                              {review.status}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        {review.review_title && (
                          <h4 className="font-semibold text-gray-900 mb-2">{review.review_title}</h4>
                        )}
                        <p className="text-sm text-gray-700 mb-4">{review.review_content}</p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReviewModal(true);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditingReview(review);
                              setEditReviewForm({
                                rating: review.rating,
                                review_title: review.review_title || '',
                                review_content: review.review_content,
                                treatment_type: review.treatment_type || '',
                                treatment_cost: review.treatment_cost ? review.treatment_cost.toString() : '',
                                treatment_duration_hours: review.treatment_duration_hours ? review.treatment_duration_hours.toString() : '',
                                recovery_time_days: review.recovery_time_days ? review.recovery_time_days.toString() : '',
                                pain_level: review.pain_level || 0,
                                results_satisfaction: review.results_satisfaction || 0,
                                would_recommend: review.would_recommend || false,
                                follow_up_required: review.follow_up_required || false
                              });
                              setShowEditReviewModal(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant={review.status === 'approved' ? 'default' : 'default'} 
                            size="sm"
                            className={review.status === 'approved' ? 'bg-black hover:bg-gray-800 text-white' : ''}
                            onClick={() => {
                              if (review.status === 'approved') {
                                handleReviewApproval(review.id, 'rejected');
                              } else if (review.status === 'rejected') {
                                handleReviewApproval(review.id, 'approved');
                              } else {
                                handleReviewApproval(review.id, 'approved');
                              }
                            }}
                          >
                            {review.status === 'approved' ? 'Reject' : review.status === 'rejected' ? 'Approve' : 'Approve'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {clinicReviews.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No clinic reviews yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Quiz Answers Modal */}
      <Dialog open={showPatientModal} onOpenChange={setShowPatientModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Quiz Answers - {selectedPatient?.first_name} {selectedPatient?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedPatient.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{new Date(selectedPatient.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Quiz Answers */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Quiz Answers</h3>
                {selectedPatient.quiz_answers && typeof selectedPatient.quiz_answers === 'object' ? (
                  <div className="space-y-4">
                    {Object.entries(selectedPatient.quiz_answers).map(([questionKey, answer], index) => (
                      <div key={questionKey} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {questionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Answer:</span> {String(answer)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      No quiz answers found for this patient.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Details Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Review Details - {selectedReview?.reviewer_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              {/* Reviewer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Reviewer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedReview.reviewer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedReview.reviewer_email || 'Not provided'}</p>
                  </div>
                                         <div>
                         <p className="text-sm text-gray-600">Clinic</p>
                         <a
                           href={`${SITE_URL}/en/fertility-clinic/${selectedReview.clinic_slug}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
                         >
                           {selectedReview.clinic_slug}
                         </a>
                       </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={selectedReview.status === 'approved' ? 'default' : selectedReview.status === 'pending' ? 'secondary' : 'destructive'}>
                      {selectedReview.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({selectedReview.rating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{new Date(selectedReview.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Review Content</h3>
                <div className="space-y-4">
                  {selectedReview.review_title && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Review Title</h4>
                      <p className="text-gray-700">{selectedReview.review_title}</p>
                    </div>
                  )}
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Review Content</h4>
                    <p className="text-gray-700">{selectedReview.review_content}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Treatment Information */}
              {(selectedReview.treatment_date || selectedReview.treatment_type || selectedReview.treatment_cost || selectedReview.treatment_duration_hours || selectedReview.recovery_time_days || selectedReview.pain_level || selectedReview.results_satisfaction !== null || selectedReview.would_recommend !== null || selectedReview.follow_up_required !== null) && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Treatment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedReview.treatment_date && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Treatment Date</h4>
                        <p className="text-gray-700">{new Date(selectedReview.treatment_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedReview.treatment_type && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Treatment Type</h4>
                        <p className="text-gray-700">{selectedReview.treatment_type}</p>
                      </div>
                    )}
                    {selectedReview.treatment_cost && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Treatment Cost</h4>
                        <p className="text-gray-700">${selectedReview.treatment_cost.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedReview.treatment_duration_hours && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                        <p className="text-gray-700">{selectedReview.treatment_duration_hours} hours</p>
                      </div>
                    )}
                    {selectedReview.recovery_time_days && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Recovery Time</h4>
                        <p className="text-gray-700">{selectedReview.recovery_time_days} days</p>
                      </div>
                    )}
                    {selectedReview.pain_level && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Pain Level</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-medium">{selectedReview.pain_level}/10</span>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full ${i < selectedReview.pain_level ? 'bg-red-500' : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedReview.results_satisfaction !== null && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Results Satisfaction</h4>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < selectedReview.results_satisfaction ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-gray-600">({selectedReview.results_satisfaction}/5)</span>
                        </div>
                      </div>
                    )}
                    {selectedReview.would_recommend !== null && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Would Recommend</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${selectedReview.would_recommend ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={selectedReview.would_recommend ? 'text-green-700' : 'text-red-700'}>
                            {selectedReview.would_recommend ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedReview.follow_up_required !== null && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Follow-up Required</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${selectedReview.follow_up_required ? 'bg-blue-500' : 'bg-gray-400'}`} />
                          <span className={selectedReview.follow_up_required ? 'text-blue-700' : 'text-gray-600'}>
                            {selectedReview.follow_up_required ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Treatment Photos */}
              {selectedReview.treatment_photos && selectedReview.treatment_photos.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Treatment Photos ({selectedReview.treatment_photos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedReview.treatment_photos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="relative">
                        <img
                          src={photo}
                          alt={`Treatment photo ${photoIndex + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => {
                            console.log('Photo clicked:', photo);
                            setSelectedPhoto(photo);
                            setShowPhotoModal(true);
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Information */}
              {(selectedReview.approved_at || selectedReview.approved_by || selectedReview.rejection_reason) && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Approval Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReview.approved_at && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Approved At</h4>
                        <p className="text-gray-700">{new Date(selectedReview.approved_at).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedReview.approved_by && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Approved By</h4>
                        <p className="text-gray-700">{selectedReview.approved_by}</p>
                      </div>
                    )}
                    {selectedReview.rejection_reason && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Rejection Reason</h4>
                        <p className="text-gray-700">{selectedReview.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Blog Post Modal */}
      <Dialog open={showBlogModal} onOpenChange={setShowBlogModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleBlogSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block font-medium mb-2">Title *</label>
              <Input
                name="title"
                value={blogForm.title}
                onChange={handleBlogFormChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Excerpt</label>
              <Textarea
                name="excerpt"
                value={blogForm.excerpt}
                onChange={handleBlogFormChange}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Content *</label>
              <RichTextEditor
                value={blogForm.content}
                onChange={(value) => setBlogForm(prev => ({ ...prev, content: value }))}
                placeholder="Write your blog post content here..."
                className="mb-4"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 mt-20">Featured Image</label>
              <div className="space-y-3">
                {blogForm.featured_image_url && (
                  <div className="relative">
                    <img 
                      src={blogForm.featured_image_url} 
                      alt="Featured" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setBlogForm(prev => ({ ...prev, featured_image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="flex-1"
                  />
                  <p className="text-sm text-gray-500">
                    Upload JPG, PNG, or WebP (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Author and Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2">Author Name</label>
                <Input
                  name="author_name"
                  value={blogForm.author_name}
                  onChange={handleBlogFormChange}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Category</label>
                <Select
                  value={blogForm.category}
                  onValueChange={(value) => setBlogForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fertility">Fertility</SelectItem>
                    <SelectItem value="IVF">IVF</SelectItem>
                    <SelectItem value="IUI">IUI</SelectItem>
                    <SelectItem value="Egg Freezing">Egg Freezing</SelectItem>
                    <SelectItem value="Fertility Education">Fertility Education</SelectItem>
                    <SelectItem value="Treatment Options">Treatment Options</SelectItem>
                    <SelectItem value="Expert Tips">Expert Tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-2">Reading Time (minutes)</label>
                <Input
                  name="reading_time_minutes"
                  type="number"
                  value={blogForm.reading_time_minutes}
                  onChange={handleBlogFormChange}
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Tags</label>
              <Input
                name="tags"
                value={blogForm.tags}
                onChange={handleBlogFormChange}
                placeholder="tag1, tag2, tag3 (comma separated)"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Status</label>
              <Select
                value={blogForm.status}
                onValueChange={(value) => setBlogForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBlogModal(false);
                  setBlogForm({
                    title: '',
                    excerpt: '',
                    content: '',
                    featured_image_url: '',
                    author_name: 'FertilityIQ Team',
                    category: 'Fertility',
                    tags: '',
                    status: 'draft',
                    reading_time_minutes: 5
                  });
                  setEditingPost(null);
                  // Reset file input
                  const fileInput = document.querySelector('input[type="file"]');
                  if (fileInput) {
                    fileInput.value = '';
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Photo Zoom Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Treatment Photo
            </DialogTitle>
            <p className="text-sm text-gray-500 text-center">
              Modal State: {showPhotoModal ? 'Open' : 'Closed'} | Photo: {selectedPhoto ? 'Selected' : 'None'}
            </p>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-4">
            {selectedPhoto ? (
              <img
                src={selectedPhoto}
                alt="Treatment photo"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Image failed to load:', selectedPhoto);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <p className="text-gray-500">No photo selected</p>
            )}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => {
              setShowPhotoModal(false);
              setSelectedPhoto('');
            }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Review Modal */}
      <Dialog open={showEditReviewModal} onOpenChange={setShowEditReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Edit Review
            </DialogTitle>
          </DialogHeader>
          
          {editingReview && (
            <form onSubmit={handleEditReviewSubmit} className="space-y-6">
              {/* Basic Review Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Review Information</h3>
                
                {/* Rating */}
                <div className="mb-4">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${editReviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-lg font-semibold">({editReviewForm.rating}/5)</span>
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-4">
                  <Label htmlFor="edit_review_title">Review Title</Label>
                  <Input
                    id="edit_review_title"
                    value={editReviewForm.review_title}
                    onChange={(e) => setEditReviewForm(prev => ({ ...prev, review_title: e.target.value }))}
                    placeholder="Review title"
                  />
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <Label htmlFor="edit_review_content">Review Content</Label>
                  <Textarea
                    id="edit_review_content"
                    value={editReviewForm.review_content}
                    onChange={(e) => setEditReviewForm(prev => ({ ...prev, review_content: e.target.value }))}
                    placeholder="Review content"
                    rows={4}
                  />
                </div>
              </div>

              {/* Treatment Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Treatment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Treatment Type */}
                  <div>
                    <Label htmlFor="edit_treatment_type">Treatment Type</Label>
                    <Select
                      value={editReviewForm.treatment_type}
                      onValueChange={(value) => setEditReviewForm(prev => ({ ...prev, treatment_type: value }))}
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

                  {/* Treatment Cost */}
                  <div>
                    <Label htmlFor="edit_treatment_cost">Treatment Cost ($)</Label>
                    <Input
                      id="edit_treatment_cost"
                      type="number"
                      value={editReviewForm.treatment_cost}
                      onChange={(e) => setEditReviewForm(prev => ({ ...prev, treatment_cost: e.target.value }))}
                      placeholder="Enter cost"
                    />
                  </div>

                  {/* Treatment Duration */}
                  <div>
                    <Label htmlFor="edit_treatment_duration">Treatment Duration (hours)</Label>
                    <Input
                      id="edit_treatment_duration"
                      type="number"
                      value={editReviewForm.treatment_duration_hours}
                      onChange={(e) => setEditReviewForm(prev => ({ ...prev, treatment_duration_hours: e.target.value }))}
                      placeholder="Enter duration"
                    />
                  </div>

                  {/* Recovery Time */}
                  <div>
                    <Label htmlFor="edit_recovery_time">Recovery Time (days)</Label>
                    <Input
                      id="edit_recovery_time"
                      type="number"
                      value={editReviewForm.recovery_time_days}
                      onChange={(e) => setEditReviewForm(prev => ({ ...prev, recovery_time_days: e.target.value }))}
                      placeholder="Enter recovery time"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Ratings */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Experience Ratings</h3>
                
                {/* Pain Level */}
                <div className="mb-4">
                  <Label>Pain Level (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEditReviewForm(prev => ({ ...prev, pain_level: level }))}
                        className={`w-8 h-8 rounded-full text-sm font-semibold ${
                          editReviewForm.pain_level >= level
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {editReviewForm.pain_level > 0 ? `${editReviewForm.pain_level}/10` : ''}
                    </span>
                  </div>
                </div>

                {/* Results Satisfaction */}
                <div className="mb-4">
                  <Label>Results Satisfaction</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditReviewForm(prev => ({ ...prev, results_satisfaction: star }))}
                        className={`text-xl ${editReviewForm.results_satisfaction >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {editReviewForm.results_satisfaction > 0 ? `${editReviewForm.results_satisfaction}/5` : ''}
                    </span>
                  </div>
                </div>

                {/* Would Recommend */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit_would_recommend"
                      checked={editReviewForm.would_recommend}
                      onChange={(e) => setEditReviewForm(prev => ({ ...prev, would_recommend: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="edit_would_recommend">Would recommend to others</Label>
                  </div>
                </div>

                {/* Follow-up Required */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit_follow_up_required"
                      checked={editReviewForm.follow_up_required}
                      onChange={(e) => setEditReviewForm(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="edit_follow_up_required">Follow-up treatment required</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditReviewModal(false);
                    setEditingReview(null);
                    setEditReviewForm({
                      rating: 0,
                      review_title: '',
                      review_content: '',
                      treatment_type: '',
                      treatment_cost: '',
                      treatment_duration_hours: '',
                      recovery_time_days: '',
                      pain_level: 0,
                      results_satisfaction: 0,
                      would_recommend: false,
                      follow_up_required: false
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Review
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Consultation Details Modal */}
      <Dialog open={showConsultationModal} onOpenChange={setShowConsultationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Consultation Details - {selectedConsultation?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedConsultation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedConsultation.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{new Date(selectedConsultation.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Clinic Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Clinic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Clinic Name</p>
                    <p className="font-medium">{selectedConsultation.clinic_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clinic Slug</p>
                    <p className="font-medium">{selectedConsultation.clinic_slug}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a 
                    href={`/en/fertility-clinic/${selectedConsultation.clinic_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Building2 className="w-4 h-4" />
                    View Clinic Page
                  </a>
                </div>
              </div>

              {/* Message */}
              {selectedConsultation.message && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Message</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{selectedConsultation.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Details Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Contact Details - {selectedContact?.first_name} {selectedContact?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedContact.first_name} {selectedContact.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{new Date(selectedContact.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Subject</h3>
                <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 text-base px-3 py-1">
                  {selectedContact.subject}
                </Badge>
              </div>

              {/* Message */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Message</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedContact.message}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin; 