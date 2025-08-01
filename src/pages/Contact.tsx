import React from "react";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Save to Supabase database
      const { error: supabaseError } = await supabase
        .from("contact_submissions")
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            form_type: 'contact'
          }
        ]);

      if (supabaseError) {
        console.error('Database error:', supabaseError);
        toast({ title: "Database Error", description: "Failed to save your message. Please try again.", variant: "destructive" });
        return;
      }

      // Success - data saved to database
      toast({ title: "Message Sent", description: "Thank you for contacting us. We'll get back to you soon!" });
      
      // Reset form
      form.reset();

      // Optional: Also submit to Web3Forms for email notification (if configured)
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (web3formsKey) {
        try {
          const formData = new FormData();
          formData.append('access_key', web3formsKey);
          formData.append('name', `${data.firstName} ${data.lastName}`);
          formData.append('email', data.email);
          formData.append('phone', data.phone);
          formData.append('subject', data.subject);
          formData.append('message', data.message);
          formData.append('form_type', 'contact');

          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          if (!result.success) {
            console.warn('Web3Forms submission failed, but data was saved to database');
          }
        } catch (web3formsError) {
          console.warn('Web3Forms submission failed, but data was saved to database:', web3formsError);
        }
      } else {
        console.log('Web3Forms not configured - data saved to database only');
      }
      
    } catch (err) {
      console.error('Form submission error:', err);
      toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact FertilityIQ - Get in Touch</title>
        <meta name="description" content="Contact FertilityIQ for questions, support, or partnership inquiries. We're here to help you on your fertility treatment journey." />
      </Helmet>
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our expert team for personalized fertility guidance
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      rules={{ required: "Subject is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Fertility treatment consultation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      rules={{ required: "Message is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your fertility journey and how we can help..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;