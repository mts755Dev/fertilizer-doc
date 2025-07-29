import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Shield, Globe, DollarSign, TrendingUp, Clock, Users, Baby } from "lucide-react";
import { Link } from "react-router-dom";

export const ReviewsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top States Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Top Fertility States
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topLocations.map((location, index) => (
              <Link key={index} to={`/en/find-a-clinic/${location.slug}`} className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="relative h-48">
                    <img 
                      src={location.image} 
                      alt={`${location.country} landmark`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-lg">{location.countryName}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Fertility Treatment Options
            </h2>
            <p className="text-lg text-muted-foreground">
              Find the right fertility treatment for your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {treatmentOptions.map((treatment, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <treatment.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{treatment.title}</h3>
                  <p className="text-muted-foreground">{treatment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            The advantages of using FertilityIQ
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            We promise to offer objective reviews of fertility treatments and success rates
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-sm font-medium text-primary mb-2">{advantage.subtitle}</p>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const stats = [
  { icon: Users, value: "15,000+", label: "Happy Patients" },
  { icon: Shield, value: "800+", label: "Verified Clinics" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
  { icon: TrendingUp, value: "98.5%", label: "Success Rate" },
];

const topLocations = [
  {
    country: "CA",
    countryName: "California",
    slug: "california",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    description: "Advanced fertility techniques and expert specialists",
    rating: "4.7",
    reviews: "1,200+"
  },
  {
    country: "NY",
    countryName: "New York",
    slug: "new-york",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
    description: "Premium clinics with cutting-edge technology",
    rating: "4.8",
    reviews: "980+"
  },
  {
    country: "TX",
    countryName: "Texas",
    slug: "texas",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    description: "Comprehensive fertility care and support",
    rating: "4.6",
    reviews: "750+"
  },
  {
    country: "FL",
    countryName: "Florida",
    slug: "florida",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
    description: "Innovative fertility solutions and expert care",
    rating: "4.5",
    reviews: "650+"
  }
];

const treatmentOptions = [
  {
    title: "IVF Treatment",
    description: "In vitro fertilization with personalized protocols",
    icon: Baby
  },
  {
    title: "IUI Procedures",
    description: "Intrauterine insemination for fertility enhancement",
    icon: Baby
  },
  {
    title: "Egg Freezing",
    description: "Preserve fertility for future family planning",
    icon: Baby
  },
  {
    title: "Genetic Testing",
    description: "Advanced screening for healthy pregnancies",
    icon: Baby
  }
];

const advantages = [
  {
    icon: Globe,
    title: "Comprehensive Fertility Directory",
    subtitle: "Over 2,000 reviews",
    description: "Compare over 2,000 reviews of real patients and more than 800 fertility clinics worldwide."
  },
  {
    icon: Shield,
    title: "Expert Fertility Advisors",
    subtitle: "Free expert advice",
    description: "Let one of our fertility experts advise you or dive into our extensive treatment guides."
  },
  {
    icon: DollarSign,
    title: "Cost Comparison Tools",
    subtitle: "Save up to 40%",
    description: "The free, fast and non-binding comparison can save you up to 40% on the cost of treatment."
  }
];