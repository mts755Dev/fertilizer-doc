import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, DollarSign, CheckCircle, Clock, Users, Award } from "lucide-react";

export const InsuranceSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-slide-up">
            Let insurance pay for your fertility consultation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Many insurance plans cover fertility consultations, but it's often an unused benefit. 
            We help you find highly qualified fertility specialists so you can get the care you need while saving money.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                We make it affordable
              </h3>
              <p className="text-lg text-muted-foreground">
                Seeing a fertility specialist can cost up to $300 per consultation without insurance, 
                but when you book through FertilityIQ, you're likely to pay closer to $25. 
                In fact, for most people, <strong>consultations are free with insurance.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Insurance Coverage</h4>
                  <p className="text-sm text-muted-foreground">Most major insurance plans accepted</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Transparent Pricing</h4>
                  <p className="text-sm text-muted-foreground">Know your costs upfront</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Verified Clinics</h4>
                  <p className="text-sm text-muted-foreground">All clinics are pre-screened</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Quick Booking</h4>
                  <p className="text-sm text-muted-foreground">Appointments within 48 hours</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/en/fertility-clinics">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                  Get Your Price
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="space-y-6">
            <Card className="p-8 bg-blue-50 shadow-lg border-0 hover-lift animate-bounce-in">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                <p className="text-lg text-muted-foreground">of patients pay $0 consultation fee</p>
              </div>
            </Card>

            <Card className="p-8 bg-blue-50 shadow-lg border-0 hover-lift animate-bounce-in" style={{animationDelay: '0.2s'}}>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$25</div>
                <p className="text-lg text-muted-foreground">average cost with insurance</p>
              </div>
            </Card>

            <Card className="p-8 bg-blue-50 shadow-lg border-0 hover-lift animate-bounce-in" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">48hrs</div>
                <p className="text-lg text-muted-foreground">average time to first appointment</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Insurance Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">Accepted by major insurance providers</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Aetna", color: "text-blue-600" },
              { name: "Blue Cross", color: "text-blue-800" },
              { name: "Cigna", color: "text-orange-600" },
              { name: "United Healthcare", color: "text-blue-500" },
              { name: "Humana", color: "text-green-600" }
            ].map((insurance) => (
              <div key={insurance.name} className="bg-white p-4 rounded-lg shadow-sm border">
                <span className={`font-semibold ${insurance.color}`}>{insurance.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">and 700+ more plans</p>
        </div>
      </div>
    </section>
  );
}; 