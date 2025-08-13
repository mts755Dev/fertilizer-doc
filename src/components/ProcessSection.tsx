import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Badge } from "lucide-react";
import { Link } from "react-router-dom";
import { useFertilityData } from "@/hooks/useFertilityData";
import { Button } from "@/components/ui/button";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";
import clinic5 from "@/assets/clinic-5.jpg";

export const ProcessSection = () => {
  const { data: clinics, isLoading } = useFertilityData();

  // Function to get random clinic image
  const getClinicImage = (index: number) => {
    const images = [clinic1, clinic2, clinic3, clinic4, clinic5];
    return images[index % images.length];
  };

  // Get 6 random clinics with valid annual cycles and specialists
  const getRandomClinics = () => {
    if (!clinics || clinics.length === 0) return [];
    // Filter clinics with valid annual cycles and at least 1 specialist
    const filtered = clinics.filter(clinic => {
      const hasValidCycles = clinic.annual_cycles && clinic.annual_cycles !== 'N/A';
      const hasSpecialists = clinic.doctors && clinic.doctors.length > 0;
      return hasValidCycles && hasSpecialists;
    });
    // Shuffle and take first 6
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const randomClinics = getRandomClinics();

  // Helper to get unique state codes for a clinic
  const getClinicStateCodes = (clinic) => {
    if (!clinic.branches || clinic.branches.length === 0) return 'N/A';
    const codes = clinic.branches.map(branch => {
      const match = branch["city-zip"]?.match(/,\s*([A-Z]{2})\s+\d{5}/);
      return match ? match[1] : null;
    }).filter(Boolean);
    const uniqueCodes = Array.from(new Set(codes));
    return uniqueCodes.length > 0 ? uniqueCodes.join(', ') : 'N/A';
  };

  return (
    <section className="py-20 bg-medical-blue-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Clinics</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Fertility Clinics</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover top-rated fertility clinics from around the world
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading featured clinics...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {randomClinics.map((clinic, index) => (
              <Link key={clinic.id} to={`/en/fertility-clinic/${clinic.slug}`} className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="relative h-48">
                    <img 
                      src={getClinicImage(index)} 
                      alt={clinic.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="bg-success-green text-background px-2 py-1 rounded text-xs font-medium">
                        ✓ Verified
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{clinic.name}</h3>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span>{getClinicStateCodes(clinic)}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Annual Cycles</span>
                        <span className="text-sm font-medium text-primary">{clinic.annual_cycles}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Specialists</span>
                        <span className="text-sm font-medium">{clinic.doctors.length}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 fill-warning-amber text-warning-amber" />
                        <span className="font-medium">Top Rated</span>
                        <span className="text-muted-foreground">Verified Clinic</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Find Your Perfect Fertility Clinic?
            </h3>
            <p className="text-muted-foreground mb-6">
              Browse our comprehensive directory of verified fertility clinics with success rate data
            </p>
            <Link to="/en/fertility-clinics">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse All Fertility Clinics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};