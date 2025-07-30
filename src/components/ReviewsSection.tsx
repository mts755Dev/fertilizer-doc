import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Users, Shield, Globe, TrendingUp, Heart, Activity, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

export const ReviewsSection = () => {
  return (
    <section className="py-20 bg-medical-blue-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands of Patients
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of patients who have found their perfect fertility clinic through our platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Top Locations */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Popular Fertility Clinic Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topLocations.map((location, index) => (
              <Link key={index} to={`/en/find-a-clinic/${location.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="relative h-48">
                    <img 
                      src={location.image} 
                      alt={location.countryName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">{location.countryName}</h4>
                      <p className="text-sm opacity-90 mb-2">{location.description}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-warning-amber text-warning-amber" />
                        <span className="text-sm">{location.rating}</span>
                        <span className="text-sm opacity-75">({location.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Treatment Options */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Comprehensive Fertility Treatments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentOptions.map((option, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <option.icon className="w-12 h-12 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">{option.title}</h4>
                <p className="text-muted-foreground text-sm">{option.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Why Choose FertilityIQ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <advantage.icon className="w-12 h-12 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">{advantage.title}</h4>
                <p className="text-muted-foreground">{advantage.description}</p>
              </div>
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
    icon: Activity
  },
  {
    title: "IUI Procedures",
    description: "Intrauterine insemination for fertility enhancement",
    icon: Zap
  },
  {
    title: "Egg Freezing",
    description: "Preserve fertility for future family planning",
    icon: Target
  },
  {
    title: "Genetic Testing",
    description: "Advanced screening for healthy pregnancies",
    icon: Heart
  }
];

const advantages = [
  {
    icon: Globe,
    title: "Global Network",
    description: "Access to fertility clinics worldwide with verified credentials and success rates"
  },
  {
    icon: Shield,
    title: "Verified Clinics",
    description: "All clinics are thoroughly vetted and verified for quality and safety standards"
  },
  {
    icon: TrendingUp,
    title: "Success Rates",
    description: "Transparent success rates and patient outcomes to help you make informed decisions"
  }
];