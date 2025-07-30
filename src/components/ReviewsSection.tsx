import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Users, Shield, Globe, TrendingUp, Heart, Activity, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

export const ReviewsSection = () => {
  return (
    <div className="relative">
      {/* Section 1: Popular Locations - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Fertility Clinic Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top-rated fertility clinics in major US states
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topLocations.map((location, index) => (
              <Link key={index} to={`/en/find-a-clinic/${location.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-lg">
                  <div className="relative h-48">
                    <img 
                      src={location.image} 
                      alt={location.countryName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">{location.countryName}</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{location.rating}</span>
                        <span className="text-sm opacity-75">({location.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Stats - Blue Background */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Patients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of patients who have found their perfect fertility clinic through our platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Treatment Options - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Fertility Treatments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore a wide range of fertility treatment options tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {treatmentOptions.map((option, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <option.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">{option.title}</h4>
                <p className="text-gray-600 leading-relaxed">{option.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
    </div>
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