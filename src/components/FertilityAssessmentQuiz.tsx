import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Check, Clock, Users, MapPin, Calendar, DollarSign, Plane, HelpCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QuizQuestion {
  id: string;
  title: string;
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  image?: string;
}

interface QuizAnswers {
  [key: string]: string;
}

const FertilityAssessmentQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const { toast } = useToast();

  const questions: QuizQuestion[] = [
    {
      id: "fertility-concern",
      title: "What is your primary fertility concern?",
      options: [
        {
          id: "infertility",
          title: "Infertility",
          subtitle: "Difficulty conceiving naturally",
          image: "🤱"
        },
        {
          id: "recurrent-miscarriage",
          title: "Recurrent Miscarriage",
          subtitle: "Multiple pregnancy losses",
          image: "💔"
        },
        {
          id: "age-related",
          title: "Age-Related Concerns",
          subtitle: "Advanced maternal/paternal age",
          image: "⏰"
        },
        {
          id: "medical-condition",
          title: "Medical Condition",
          subtitle: "PCOS, endometriosis, etc.",
          image: "🏥"
        }
      ]
    },
    {
      id: "trying-duration",
      title: "How long have you been trying to conceive?",
      options: [
        {
          id: "less-than-6-months",
          title: "Less than 6 months",
          icon: <Clock className="w-8 h-8 text-blue-600" />
        },
        {
          id: "6-12-months",
          title: "6-12 months",
          icon: <Clock className="w-8 h-8 text-orange-600" />
        },
        {
          id: "1-2-years",
          title: "1-2 years",
          icon: <Clock className="w-8 h-8 text-red-600" />
        },
        {
          id: "more-than-2-years",
          title: "More than 2 years",
          icon: <Clock className="w-8 h-8 text-purple-600" />
        }
      ]
    },
    {
      id: "previous-treatment",
      title: "Have you had any fertility treatments before?",
      options: [
        {
          id: "none",
          title: "None",
          subtitle: "This would be our first treatment"
        },
        {
          id: "medication",
          title: "Fertility Medication",
          subtitle: "Clomid, Letrozole, etc."
        },
        {
          id: "iui",
          title: "IUI",
          subtitle: "Intrauterine insemination"
        },
        {
          id: "ivf",
          title: "IVF",
          subtitle: "In vitro fertilization"
        }
      ]
    },
    {
      id: "age-group",
      title: "What is your age group?",
      options: [
        {
          id: "under-25",
          title: "Under 25",
          icon: <Users className="w-8 h-8 text-green-600" />
        },
        {
          id: "25-30",
          title: "25-30",
          icon: <Users className="w-8 h-8 text-blue-600" />
        },
        {
          id: "31-35",
          title: "31-35",
          icon: <Users className="w-8 h-8 text-orange-600" />
        },
        {
          id: "36-40",
          title: "36-40",
          icon: <Users className="w-8 h-8 text-red-600" />
        },
        {
          id: "over-40",
          title: "Over 40",
          icon: <Users className="w-8 h-8 text-purple-600" />
        }
      ]
    },
    {
      id: "budget-range",
      title: "What is your budget range for treatment?",
      options: [
        {
          id: "under-5000",
          title: "Under $5,000",
          icon: <DollarSign className="w-8 h-8 text-green-600" />
        },
        {
          id: "5000-10000",
          title: "$5,000 - $10,000",
          icon: <DollarSign className="w-8 h-8 text-blue-600" />
        },
        {
          id: "10000-20000",
          title: "$10,000 - $20,000",
          icon: <DollarSign className="w-8 h-8 text-orange-600" />
        },
        {
          id: "over-20000",
          title: "Over $20,000",
          icon: <DollarSign className="w-8 h-8 text-red-600" />
        }
      ]
    },
    {
      id: "location-preference",
      title: "Where would you prefer to receive treatment?",
      options: [
        {
          id: "local",
          title: "Local Clinic",
          subtitle: "Near my home",
          icon: <MapPin className="w-8 h-8 text-blue-600" />
        },
        {
          id: "domestic-travel",
          title: "Domestic Travel",
          subtitle: "Willing to travel within country",
          icon: <Plane className="w-8 h-8 text-green-600" />
        },
        {
          id: "international",
          title: "International",
          subtitle: "Willing to travel abroad",
          icon: <Plane className="w-8 h-8 text-purple-600" />
        }
      ]
    }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Show searching animation before lead form
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        setShowLeadForm(true);
      }, 3000); // Show searching for 3 seconds
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        quiz_answers: answers,
        created_at: new Date().toISOString()
      };

      // @ts-expect-error - quiz_responses table is new, types need to be regenerated
      const { error } = await supabase
        .from('quiz_responses')
        .insert([response]);

      if (error) throw error;

      console.log("Fertility assessment saved successfully");
      
      toast({
        title: "Assessment Submitted!",
        description: "We'll contact you within 24 hours with personalized recommendations.",
        variant: "default"
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      });
      setAnswers({});
      setCurrentStep(0);
      setShowLeadForm(false);
      
      // Redirect to clinics page after a short delay
      setTimeout(() => {
        navigate('/clinics');
      }, 2000);
    } catch (error) {
      console.error('Error saving quiz response:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Searching Animation
  if (isSearching) {
    return (
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            {/* Animated Search Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-8 h-8 text-blue-600 animate-bounce" />
              </div>
              {/* Rotating dots around the search icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Searching for Top Rated Clinics
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Analyzing your answers to find the best fertility clinics for your needs...
            </p>
            
            {/* Animated progress dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Progress text */}
            <div className="mt-6 text-sm text-gray-500">
              <div className="animate-pulse">
                <span>Finding clinics with high success rates...</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showLeadForm) {
    return (
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardContent className="p-8">
          <div className="bg-green-500 text-white p-6 rounded-lg mb-8">
            <div className="flex items-center mb-4">
              <Check className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">We have found suitable offers for you</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-6">Who should receive the offers?</h3>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  By submitting, I agree to the terms and conditions and privacy policy.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    Save up to $3,200
                  </div>
                  <img 
                    src="https://media.istockphoto.com/id/985524096/photo/lets-set-up-an-appointment-for-next-week.jpg?s=612x612&w=0&k=20&c=g_bqgl_Z7WMdNyLh-0VFMzgHew-j-rRCb4SpLeYjP0s=" 
                    alt="Fertility consultation preview" 
                    className="rounded-lg shadow-md mb-4"
                  />
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-600 mr-2">Saving potential</span>
                    <Badge variant="default" className="bg-green-500">VERY HIGH</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 px-12 py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Receive Offers"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card className="max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save up to $3,200
                </div>
                <span className="text-sm text-gray-500">
                  {currentStep + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option) => (
                <Card
                  key={option.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-3">
                      {option.image && (
                        <div className="text-4xl mb-2">{option.image}</div>
                      )}
                      {option.icon && (
                        <div className="flex justify-center mb-2">{option.icon}</div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    {option.subtitle && (
                      <p className="text-sm text-gray-600">
                        {option.subtitle}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Information */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>100% free non-binding</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Up to 3 offers from verified clinics</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Compare over 570 clinics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default FertilityAssessmentQuiz; 