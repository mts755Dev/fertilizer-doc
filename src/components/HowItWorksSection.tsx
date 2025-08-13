import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Calendar, CreditCard, MessageCircle, Heart, Star, Users } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Find a fertility clinic",
      description: "Book a consultation with a fertility specialist that specializes in your needs and accepts your insurance.",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Meet virtually or in-person",
      description: "Connect with your fertility specialist online from the comfort of your home or meet in-person.",
      color: "text-green-600"
    },
    {
      icon: CreditCard,
      title: "Pay with insurance",
      description: "Every clinic is in-network, and we bill to your insurance after your appointment, so you don't have to worry.",
      color: "text-purple-600"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Completely customized care",
      description: "Licensed fertility specialists meet with you 1-on-1 to design a plan that is customized to your needs. This could include treatment planning, lifestyle recommendations, or a number of other methods that are clinically proven to work."
    },
    {
      icon: Star,
      title: "Verified success rates",
      description: "All clinics provide verified success rates by age group, so you can make informed decisions about your fertility treatment options."
    },
    {
      icon: Users,
      title: "Patient reviews & experiences",
      description: "Read real patient reviews and experiences to understand what to expect from each fertility clinic."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform translate-x-4"></div>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Completely customized care
            </h3>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-blue-50 border-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">800+</div>
                <p className="text-sm text-muted-foreground">Fertility Clinics</p>
              </div>
            </Card>
            <Card className="p-6 bg-blue-50 border-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">15,000+</div>
                <p className="text-sm text-muted-foreground">Patients Helped</p>
              </div>
            </Card>
            <Card className="p-6 bg-blue-50 border-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">4.8/5</div>
                <p className="text-sm text-muted-foreground">Patient Rating</p>
              </div>
            </Card>
            <Card className="p-6 bg-blue-50 border-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">48hrs</div>
                <p className="text-sm text-muted-foreground">Avg. Response</p>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/en/fertility-clinics">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
              Find Your Fertility Clinic
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}; 