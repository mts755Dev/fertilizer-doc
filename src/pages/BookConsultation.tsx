import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";

const BookConsultation = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onTouched",
  });
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const clinic_slug = searchParams.get("clinic");
  const navigate = useNavigate();

  // Remove the useEffect for auto-redirect

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Save to Supabase consultation_submissions table (primary)
      const { error: supabaseError } = await supabase
        .from("consultation_submissions")
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message || 'No message provided',
            clinic_slug: clinic_slug || 'general',
            clinic_name: clinic_slug || 'General Inquiry'
          }
        ]);

      if (supabaseError) {
        console.error('Database error:', supabaseError);
        toast({ title: "Database Error", description: "Failed to save your consultation request. Please try again.", variant: "destructive" });
        return;
      }

      // Success - data saved to database
      setSubmitted(true);
      toast({ title: "Consultation Booked", description: "Your request has been submitted successfully." });

      // Optional: Also submit to Web3Forms for email notification (if configured)
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (web3formsKey) {
        try {
          const formData = new FormData();
          formData.append('access_key', web3formsKey);
          formData.append('name', data.name);
          formData.append('email', data.email);
          formData.append('phone', data.phone);
          formData.append('message', data.message || 'No message provided');
          formData.append('subject', `New Consultation Request - ${clinic_slug || 'General'}`);
          formData.append('clinic_slug', clinic_slug || 'general');

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

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Thank you!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your consultation request has been submitted. We will contact you soon.</p>
            {clinic_slug && (
              <Button className="mt-4" onClick={() => navigate(`/en/clinic/${clinic_slug}`)}>
                Back to Clinic
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Book a Consultation</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input type="email" placeholder="you@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How can we help you? (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default BookConsultation; 