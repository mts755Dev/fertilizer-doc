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
    question: "Why a hair transplantation?",
    answer: "Hair transplantations are an excellent, permanent solution to many forms of hair loss. It is the most natural, effective way to regain a full head of hair and restore your self-confidence."
  },
  {
    question: "Which hair transplantation methods are available?",
    answer: "Current hair transplant methods include the FUT, FUE, DHI, ARTAS and NeoGraft techniques. Read our comprehensive guide on hair transplant methods for more information. Even though it is not currently available, many experts hope that stem cell hair transplantation will revolutionize the hair loss industry."
  },
  {
    question: "How much does a hair transplantation cost?",
    answer: "Hair transplantation costs vary widely depending on the technique used as well as location of the clinic. There was an average global cost of 2.98 USD per graft in 2019. Read our hair transplant cost study for more information on hair transplant prices. Hair transplants in turkey have the lowest price with 1.07 USD per graft."
  },
  {
    question: "Does my health insurance cover the costs?",
    answer: "Hair transplants are an elective cosmetic surgery for most patients, as a result health insurance usually does not cover the costs. Health insurance may cover the cost of a hair transplant for scar coverage."
  },
  {
    question: "What are the chances & risks of hair transplantation?",
    answer: "Hair transplantation is a very low-risk cosmetic surgery with minor side effects associated with the procedure. Read our article on hair restoration side effects for more information."
  },
  {
    question: "Is there an alternative to hair transplantation?",
    answer: "There are many alternative treatment forms to a hair transplant, e.g. finasteride or minoxidil, however, none guarantee the same results as a transplantation. According to medihair's hair loss statistics finasteride is the most common prescribed hair loss treatment (66.40%). Read our article on hair loss treatment methods which compares over 38 various methods with information on pricing."
  },
  {
    question: "When is hair transplantation useful? At what age?",
    answer: "Patients over the age of 35, with an ample donor area suffering from androgenetic alopecia or male pattern baldness are optimal candidates for hair transplants. Hair transplantation can be useful for many other patients however and it is important to get your hair loss analyzed to find the best treatment method for you. Also, patients over the age of 25 can be a suitable candidate in combination with right hair loss medication. According to our hair transplant statistics most of the patients are between 30 and 45 before their hair transplant."
  },
  {
    question: "Where is hair transplantation possible?",
    answer: "The hair transplantation industry is rapidly growing and there are clinics available all over the world. Just click on compare verified clinics to get more information about possible clinics."
  },
  {
    question: "Which doctor is the best for hair transplantation?",
    answer: "Different surgeons specialize in different hair transplantation methods which may work better for some candidates than others. It is important to review many factors before deciding on the most appropriate hair surgeon for your individual needs. Therefore, it is difficult to generalize who is the best hair transplant doctor."
  }
];