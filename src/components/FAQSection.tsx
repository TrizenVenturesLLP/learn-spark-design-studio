import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";

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
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setShowForm(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our training programs and certifications. 
            If you can't find what you're looking for, feel free to reach out to our support team.
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          {/* FAQ Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium py-4 text-gray-800">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">Our support team is here to help you</p>
              {!showForm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Contact Support
                </Button>
              )}
            </div>
          </div>

          {/* Contact Form Card */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-6 text-center">Contact Support</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-left block">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-left block">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-left block">
                      How can we help?
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your question or issue..."
                      className="h-32 resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
