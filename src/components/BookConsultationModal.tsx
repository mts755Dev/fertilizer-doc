import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function BookConsultationModal({ open, onOpenChange, clinicSlug, clinicName }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
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

  React.useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, onOpenChange]);

  const onSubmit = async (data) => {
    setError("");
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
            clinic_slug: clinicSlug || 'general',
            clinic_name: clinicName || 'General Inquiry',
          }
        ]);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        setError('Failed to save consultation request. Please try again.');
        return;
      }

      // Success - data saved to database
      setSubmitted(true);

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
          formData.append('subject', `New Consultation Request - ${clinicSlug || 'General'}`);
          formData.append('clinic_slug', clinicSlug || 'general');

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
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Book a Consultation</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
            <p>Your consultation request has been submitted. We will contact you soon.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 