
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How are Trizen Training courses delivered?",
    answer: "Our courses are delivered through a combination of on-demand video content, interactive exercises, live sessions with instructors, and hands-on projects. You can access all materials through our learning platform at your own pace."
  },
  {
    question: "Are the certifications industry-recognized?",
    answer: "Yes, our certifications are recognized by leading companies in the tech industry. We work closely with industry partners to ensure our curriculum meets current market demands and standards."
  },
  {
    question: "Do you offer corporate training packages?",
    answer: "Absolutely! We provide customized corporate training solutions tailored to your organization's specific needs. Our enterprise packages include custom learning paths, dedicated support, and detailed progress tracking."
  },
  {
    question: "Is there job placement assistance?",
    answer: "We offer career support services including resume reviews, interview preparation, and access to our employer network. While we don't guarantee placement, many of our graduates have successfully transitioned to new roles in their desired fields."
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our training programs and certifications.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <p className="text-lg font-medium mb-4">Can't find what you're looking for?</p>
            <Button>Contact Support</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
