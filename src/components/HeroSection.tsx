import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowDown, Search, Star, CheckCircle, Users, Award, Baby } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import hairLossStages from "@/assets/hair-loss-stages.jpg";
import clinicComparison from "@/assets/clinic-comparison.jpg";
import heroImage1 from "@/assets/hero-image-1.jpg"

export const HeroSection = () => {
  return <section className="relative bg-background overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Professional fertility clinic" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-medical-blue-light/90"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 15,000+ Patients</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Compare <span className="text-primary">800+</span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center lg:justify-start">
              Fertility Clinics Worldwide
              <ArrowDown className="ml-4 w-8 h-8 text-primary animate-bounce" />
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Success rates by age group, doctor profiles, and patient reviews - 100% free
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/en/fertility-clinics">
                <Button size="lg" className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
                  <Baby className="w-5 h-5" />
                  <span>Find Fertility Clinics</span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-warning-amber text-warning-amber" />
                <span className="font-medium">4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-green" />
                <span className="font-medium">800+ Verified Clinics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">2,000+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative">
              <img src={heroImage} alt="Compare fertility clinics worldwide" className="w-full h-auto rounded-lg shadow-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">800+ Clinics Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>;
};

const hairLossTypes = [{
  name: "Stage 1",
  stage: "No Hair Loss"
}, {
  name: "Stage 2",
  stage: "Minimal Loss"
}, {
  name: "Stage 3",
  stage: "Receding Hairline"
}, {
  name: "Stage 4",
  stage: "Crown Thinning"
}, {
  name: "Stage 5",
  stage: "Advanced Loss"
}, {
  name: "Stage 6",
  stage: "Extensive Loss"
}, {
  name: "Stage 7",
  stage: "Severe Loss"
}, {
  name: "Female Pattern",
  stage: "Women's Hair Loss"
}];