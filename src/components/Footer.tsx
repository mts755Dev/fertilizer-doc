import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Award, Users } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 text-center">
          {/* Company Info */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">FertilityIQ</span>
            </div>
            <p className="text-xs sm:text-sm text-background/80 leading-relaxed px-4">
              Your comprehensive platform for comparing over 800 verified fertility clinics across the United States. Access detailed success rates by age group, transparent pricing, doctor profiles, and connect with the best fertility specialists nationwide. Make informed decisions with our expert-curated directory and find the right fertility treatment for your journey.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-6 sm:py-8 border-t border-background/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success-green" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Verified Clinics</div>
                <div className="text-xs sm:text-sm text-background/80">800+ Certified Partners</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Success Stories</div>
                <div className="text-xs sm:text-sm text-background/80">2,000+ Patient Reviews</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:col-span-2 md:col-span-1">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-warning-amber" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Industry Recognition</div>
                <div className="text-xs sm:text-sm text-background/80">Featured in Forbes & Bloomberg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 sm:py-6 border-t border-background/20 text-center text-xs sm:text-sm text-background/60 px-4">
          <p>&copy; 2024 FertilityIQ. All rights reserved. | Medical advice should always be sought from qualified professionals.</p>
        </div>
      </div>
    </footer>;
};