
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FertilityClinics from "./pages/FertilityClinics";
import Clinics from "./pages/Clinics";
import FertilityClinicDetail from "./pages/FertilityClinicDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import LeaveReview from "./pages/LeaveReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/en" element={<Index />} />
          
          {/* Fertility Clinic Routes */}
          <Route path="/en/fertility-clinics" element={<FertilityClinics />} />
          <Route path="/en/clinics" element={<Clinics />} />
          <Route path="/en/fertility-clinic/:clinicSlug" element={<FertilityClinicDetail />} />
          <Route path="/en/find-a-clinic/:stateName" element={<FertilityClinics />} />
          
          {/* Blog Routes */}
          <Route path="/en/blog" element={<Blogs />} />
          <Route path="/en/blog/:slug" element={<BlogPost />} />
          
          {/* Review Routes */}
          <Route path="/en/leave-review/:clinicSlug" element={<LeaveReview />} />
          
          {/* Alternative routes without /en prefix for better UX */}
          <Route path="/fertility-clinics" element={<FertilityClinics />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/fertility-clinic/:clinicSlug" element={<FertilityClinicDetail />} />
          <Route path="/find-a-clinic/:stateName" element={<FertilityClinics />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/leave-review/:clinicSlug" element={<LeaveReview />} />
          
          <Route path="/en/about" element={<About />} />
          <Route path="/en/contact" element={<Contact />} />
          <Route path="/en/admin" element={<Admin />} />
          
          {/* Redirect root to /en */}
          <Route path="/" element={<Index />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
