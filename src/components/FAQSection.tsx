import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const faqs = [
  {
    question: "What is fertility treatment and when should I consider it?",
    answer: "Fertility treatment helps couples and individuals who are having difficulty conceiving naturally. You should consider fertility treatment if you've been trying to conceive for over a year (or 6 months if you're over 35), have irregular periods, or have been diagnosed with fertility issues."
  },
  {
    question: "What fertility treatment methods are available?",
    answer: "Common fertility treatments include IVF (In Vitro Fertilization), IUI (Intrauterine Insemination), egg freezing, sperm donation, embryo donation, and genetic testing. Each method is suitable for different fertility challenges and your doctor will recommend the best approach for your specific situation."
  },
  {
    question: "How much does fertility treatment cost?",
    answer: "Fertility treatment costs vary significantly depending on the method, clinic location, and individual circumstances. IVF typically costs between $12,000-$25,000 per cycle, while IUI costs around $300-$1,000 per cycle. Many clinics offer financing options and some insurance plans provide partial coverage."
  },
  {
    question: "Does health insurance cover fertility treatment?",
    answer: "Coverage varies by insurance plan and state. Some states mandate fertility coverage, while others don't. Many plans cover diagnostic testing but may have limited coverage for treatments like IVF. It's important to check with your insurance provider about your specific coverage options."
  },
  {
    question: "What are the success rates and risks of fertility treatment?",
    answer: "Success rates depend on age, fertility diagnosis, and treatment method. IVF success rates range from 20-40% per cycle for women under 35. Risks include multiple pregnancies, ovarian hyperstimulation syndrome, and emotional stress. Your fertility specialist will discuss all risks and benefits before treatment."
  },
  {
    question: "Are there alternatives to fertility treatment?",
    answer: "Yes, alternatives include lifestyle changes (diet, exercise, stress management), ovulation tracking, natural family planning, and addressing underlying health conditions. However, for many couples, medical fertility treatment offers the best chance of success."
  },
  {
    question: "At what age should I consider fertility treatment?",
    answer: "Fertility naturally declines with age, especially after 35. If you're under 35, try for a year before seeking treatment. If you're 35-40, try for 6 months. If you're over 40, consider consulting a fertility specialist immediately. Early intervention often leads to better outcomes."
  },
  {
    question: "Where can I find quality fertility clinics?",
    answer: "Quality fertility clinics are available worldwide, with many excellent options in major cities. Use our platform to compare verified fertility clinics, read patient reviews, and check success rates. Look for clinics with board-certified reproductive endocrinologists and good success rates."
  },
  {
    question: "How do I choose the best fertility doctor?",
    answer: "Look for board-certified reproductive endocrinologists with experience in your specific fertility issues. Consider success rates, patient reviews, communication style, and clinic location. It's important to feel comfortable with your doctor as fertility treatment is a personal journey."
  }
];