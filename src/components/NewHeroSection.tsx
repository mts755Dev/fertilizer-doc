import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Heart, Star, CheckCircle, Users, Award, MapPin, Building2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const NewHeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-background to-blue-100/30 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Fertility clinic background" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-background/85 to-blue-50/20"></div>
      </div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            Your personal fertility clinic finder
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Find board-certified fertility clinics near you with verified success rates and patient reviews.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-scale-in">
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover-lift">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter your city or state"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Insurance</label>
                <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select insurance</option>
                  <option>Aetna</option>
                  <option>Blue Cross Blue Shield</option>
                  <option>Cigna</option>
                  <option>United Healthcare</option>
                  <option>Humana</option>
                </select>
              </div>

              {/* Specialty */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Specialty</label>
                <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select specialty</option>
                  <option>IVF Treatment</option>
                  <option>IUI Treatment</option>
                  <option>Egg Freezing</option>
                  <option>Male Infertility</option>
                  <option>PCOS Treatment</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/en/fertility-clinics" className="w-full">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Find Fertility Clinics
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success-green" />
              <span className="font-medium">Verified Clinics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-warning-amber" />
              <span className="font-medium">4.8/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">15,000+ Patients</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-medium">800+ Clinics</span>
            </div>
          </div>
        </div>

        {/* Insurance Logos */}
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground mb-6">Trusted by major insurance providers</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-600">Aetna</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-800">Blue Cross</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-orange-600">Cigna</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-blue-500">United Healthcare</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-green-600">Humana</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 rounded-full px-6 py-3 mb-4">
            <span className="text-primary font-semibold">$0 consultation fee for most patients</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Get your personalized clinic recommendations and pricing
          </p>
        </div>
      </div>
    </section>
  );
}; 