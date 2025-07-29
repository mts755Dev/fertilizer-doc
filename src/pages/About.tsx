import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>About Best Hair Docs - Your Trusted Hair Restoration Partner</title>
        <meta name="description" content="Learn about Best Hair Docs's mission to connect you with the best hair transplant clinics and surgeons worldwide, ensuring you receive the highest quality care and natural-looking results." />
      </Helmet>
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About Best Hair Docs</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted partner in hair restoration journey
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
              At Best Hair Docs, our mission is to empower individuals on their hair restoration journey by providing honest, transparent, and accessible information about hair transplant clinics around the world. We believe that everyone deserves to feel confident in their appearance and fully informed when making such an important, personal decision. By curating a global directory of trusted clinics, we aim to eliminate the guesswork and help users find the best solution for their unique needs.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Do</h2>
              <p className="text-muted-foreground mb-4">
              We research, review, and organize a comprehensive directory of over 500 hair transplant clinics across the globe. Our platform brings together essential details — from clinic credentials and doctor experience to real patient reviews and procedure transparency — all in one place. Whether you're just starting your research or narrowing down your final options, we provide the tools and insights to help you compare clinics with clarity and confidence.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Best Hair Docs</h2>
              <p className="text-muted-foreground">
              Choosing a hair transplant clinic can be overwhelming, especially with so many options and varying levels of quality. At Best Hair Docs, we cut through the noise by prioritizing transparency, credibility, and user empowerment. Our platform isn’t influenced by paid placements or hidden agendas — every clinic listed meets our standards for professionalism and accountability. With our global reach and commitment to accuracy, you can trust Best Hair Docs to guide you toward a safe, effective, and well-informed decision.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;