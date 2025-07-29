import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Award, Users } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 text-center">
          {/* Company Info */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FertilityIQ</span>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Your comprehensive platform for comparing over 800 verified fertility clinics across the United States. Access detailed success rates by age group, transparent pricing, doctor profiles, and connect with the best fertility specialists nationwide. Make informed decisions with our expert-curated directory and find the right fertility treatment for your journey.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-8 border-t border-background/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-success-green" />
              <div className="text-left">
                <div className="font-semibold">Verified Clinics</div>
                <div className="text-sm text-background/80">800+ Certified Partners</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Success Stories</div>
                <div className="text-sm text-background/80">2,000+ Patient Reviews</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-6 h-6 text-warning-amber" />
              <div className="text-left">
                <div className="font-semibold">Industry Recognition</div>
                <div className="text-sm text-background/80">Featured in Forbes & Bloomberg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-background/20 text-center text-sm text-background/60">
          <p>&copy; 2024 FertilityIQ. All rights reserved. | Medical advice should always be sought from qualified professionals.</p>
        </div>
      </div>
    </footer>;
};