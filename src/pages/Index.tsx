import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FertilityIQ - Compare Fertility Clinics & Success Rates Worldwide</title>
        <meta name="description" content="Compare verified fertility clinics worldwide. Read success rates by age group, doctor profiles, and patient reviews. Find the best fertility treatment options." />
        <meta name="author" content="Lovable" />

        <meta property="og:title" content="FertilityIQ - Compare Fertility Clinics & Success Rates Worldwide" />
        <meta property="og:description" content="Compare verified fertility clinics worldwide. Read success rates by age group, doctor profiles, and patient reviews. Find the best fertility treatment options." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lovable_dev" />
        <meta name="twitter:title" content="FertilityIQ - Compare Fertility Clinics & Success Rates Worldwide" />
        <meta name="twitter:description" content="Compare verified fertility clinics worldwide. Read success rates by age group, doctor profiles, and patient reviews. Find the best fertility treatment options." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      </Helmet>
      <Navbar />
      <HeroSection />
      <ReviewsSection />
      <ProcessSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
