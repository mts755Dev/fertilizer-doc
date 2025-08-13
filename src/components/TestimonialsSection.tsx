import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Amanda B.",
      text: "I've struggled with PCOS for a while. FertilityIQ made it so affordable and easy to meet with a PCOS fertility specialist who has availability on nights and weekends. That almost never happens.",
      rating: 5
    },
    {
      name: "Aaron E.",
      text: "I meet with my fertility specialist every other week and insurance covers all of it! I didn't even know I had this as a benefit. I wish I knew about this sooner.",
      rating: 5
    },
    {
      name: "Joseph D.",
      text: "When I became concerned about fertility, I knew I had to make some lifestyle changes. My fertility specialist taught me a lot, and I've been managing my fertility with what I learned.",
      rating: 5
    },
    {
      name: "Molly W.",
      text: "I found the perfect fertility clinic after 3 consultations. My specialist helped me understand my options and I feel more confident about my fertility journey.",
      rating: 5
    },
    {
      name: "Zoe T.",
      text: "FertilityIQ was recommended to us by our doctor and we were able to connect with an IVF specialist, which has been critical for our fertility treatment.",
      rating: 5
    },
    {
      name: "Matt R.",
      text: "I was able to find the perfect fertility clinic to help me with my fertility concerns. I was shocked to learn that it only cost me $25 after insurance!",
      rating: 5
    },
    {
      name: "Kelly O.",
      text: "I LOVE my fertility specialist. She designed a customized plan for me and kept me accountable. My sessions were FREE because insurance paid for it.",
      rating: 5
    },
    {
      name: "Sarah M.",
      text: "The fertility clinic I found through FertilityIQ was amazing. They had all the latest technology and the staff was incredibly supportive throughout my entire journey.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Hear what they're saying
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-blue-50/50 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 hover-lift animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start space-x-3 mb-4">
                <Quote className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning-amber fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <p className="text-sm text-muted-foreground">Patients Helped</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">800+</div>
              <p className="text-sm text-muted-foreground">Clinics Listed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}; 