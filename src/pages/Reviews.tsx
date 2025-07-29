import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Michael Johnson",
      location: "New York, USA",
      rating: 5,
      date: "2 months ago",
              review: "Exceptional service! Best Hair Docs helped me find the perfect clinic in Turkey. The entire process was smooth, and the results exceeded my expectations. Highly recommended!",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Sarah Williams",
      location: "London, UK",
      rating: 5,
      date: "3 months ago",
              review: "I was nervous about traveling abroad for my hair transplant, but Best Hair Docs made everything easy. The clinic they recommended was professional, and I'm thrilled with my new hair!",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "David Chen",
      location: "Sydney, Australia",
      rating: 4,
      date: "4 months ago",
      review: "Great platform for comparing different clinics. The detailed information and reviews helped me make an informed decision. Very satisfied with the outcome.",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      date: "5 months ago",
              review: "Outstanding experience from start to finish. The team at Best Hair Docs was supportive throughout my journey. The clinic was exactly as described, and the results are natural-looking.",
      avatar: "/placeholder.svg"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Hair Transplant Clinic Reviews - Best Hair Docs</title>
        <meta name="description" content="Read real patient reviews for top hair transplant clinics worldwide. Find the best clinic for your hair restoration journey with Best Hair Docs." />
      </Helmet>
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Patient Reviews</h1>
            <p className="text-xl text-muted-foreground">
              See what our patients say about their hair restoration journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{review.location}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-card rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Share Your Experience</h2>
              <p className="text-muted-foreground mb-6">
                Had a great experience with one of our partner clinics? We'd love to hear from you!
              </p>
              <a 
                href="mailto:reviews@besthairdocs.com" 
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Your Review
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;