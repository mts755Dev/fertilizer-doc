import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export const CitiesSection = () => {
  const cities = [
    "New York, NY",
    "Los Angeles, CA", 
    "San Diego, CA",
    "San Francisco, CA",
    "San Jose, CA",
    "Philadelphia, PA",
    "Washington, DC",
    "Chicago, IL",
    "Baltimore, MD",
    "Seattle, WA",
    "Houston, TX",
    "Dallas, TX",
    "Austin, TX",
    "San Antonio, TX",
    "El Paso, TX",
    "Atlanta, GA",
    "Boston, MA",
    "Phoenix, AZ",
    "Miami, FL",
    "Denver, CO"
  ];

  const states = [
    "California",
    "Texas", 
    "Florida",
    "New York",
    "Pennsylvania",
    "Illinois",
    "Ohio",
    "Georgia",
    "North Carolina",
    "Michigan",
    "New Jersey",
    "Virginia",
    "Washington",
    "Arizona",
    "Tennessee",
    "Massachusetts",
    "Indiana",
    "Missouri",
    "Maryland",
    "Wisconsin"
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* States Grid */}
        <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-16">
        Find fertility clinics by state
        </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {states.map((state, index) => (
              <Link 
                key={index} 
                to={`/en/find-a-clinic/${state.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <Card className="p-4 bg-white hover:bg-blue-50 transition-colors duration-200 border-0 shadow-sm hover:shadow-md">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {state}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Don't see your city? Check out our full list
          </p>
          <Link to="/en/fertility-clinics">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
              View All Clinics
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}; 