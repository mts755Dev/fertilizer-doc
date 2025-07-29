
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ChevronDown, Baby } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/en" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Baby className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FertilityIQ</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/en/fertility-clinics" className="text-foreground hover:text-primary transition-colors">
              Fertility Clinics
            </Link>
            
            <Link to="/en/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            
            <Link to="/en/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link to="/en/fertility-clinics">
              <Button className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
                <Baby className="w-4 h-4" />
                <span>Find Fertility Clinics</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
