import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit, Trash2, Building2, Users, Award } from "lucide-react";

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
          name: "", url: "", annual_cycles: "", national_avg_annual_cycles: "",
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
          name: "", url: "", annual_cycles: "", national_avg_annual_cycles: "",
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Admin Dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="clinics" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Clinics
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Contact Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clinics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingClinic ? "Edit Clinic" : "Add Clinic"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
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
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
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
                          name: "", url: "", annual_cycles: "", national_avg_annual_cycles: "",
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
                <CardTitle>Fertility Clinics</CardTitle>
                <Input
                  placeholder="Search clinics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {paginatedClinics.map((clinic) => (
                      <div key={clinic.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{clinic.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {clinic.clinic_id}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{clinic.branches?.length || 0} locations</Badge>
                            <Badge variant="secondary">{clinic.doctors?.length || 0} doctors</Badge>
                            {clinic.annual_cycles && (
                              <Badge variant="outline">{clinic.annual_cycles} cycles/year</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(clinic)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(clinic.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {totalClinicPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          onClick={() => setClinicPage(prev => Math.max(1, prev - 1))}
                          disabled={clinicPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-4">
                          Page {clinicPage} of {totalClinicPages}
                        </span>
                        <Button
                          onClick={() => setClinicPage(prev => Math.min(totalClinicPages, prev + 1))}
                          disabled={clinicPage === totalClinicPages}
                          variant="outline"
                          size="sm"
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
                <CardTitle>Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Booking functionality coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactSubmissions.map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{submission.name}</h3>
                          <p className="text-sm text-muted-foreground">{submission.email}</p>
                          <p className="mt-2">{submission.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 