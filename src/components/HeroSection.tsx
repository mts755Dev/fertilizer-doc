import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowDown, Search, Star, CheckCircle, Users, Award, Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import hairLossStages from "@/assets/hair-loss-stages.jpg";
import clinicComparison from "@/assets/clinic-comparison.jpg";
import heroImage1 from "@/assets/hero-image-1.jpg"

export const HeroSection = () => {
  return (<section className="relative bg-background overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Professional fertility clinic" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-medical-blue-light/90"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
                  <Heart className="w-5 h-5" />
                  <span>Find Fertility Clinics</span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-green" />
                <span>Verified Clinics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-warning-amber" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>15,000+ Patients</span>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl">
              <img 
                src={clinicComparison} 
                alt="Fertility clinic comparison" 
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}