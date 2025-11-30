'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does the AI Job Matcher work?",
    answer: "Our AI analyzes your profile, skills, experience, and career goals against millions of data points from job postings across the web. It then identifies roles that are a perfect fit for you, including those you might have overlooked."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, data security is our top priority. We use industry-standard encryption for all data in transit and at rest. Your personal information is never shared with third parties without your explicit consent."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel your Pro subscription at any time from your account settings. You will retain access to Pro features until the end of your current billing cycle."
  },
  {
    question: "How is Engineering Edge AI different from other job platforms?",
    answer: "Unlike traditional job boards, we are a comprehensive career development platform. We don't just show you job listings; we provide AI-powered tools to build your resume, practice for interviews, and track your skills, giving you a competitive edge."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-xl border-t-0 px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
