import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What types of medical reports can I upload?",
    answer: "You can upload various types of medical reports, including blood test results, pathology reports, imaging reports (like X-rays, CT scans, and MRIs), and more. We support common file formats like PDF, JPG, and PNG."
  },
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI is trained on a vast dataset of medical literature and reports to provide highly accurate summaries. However, it is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns or before making any medical decisions."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, we take data privacy and security very seriously. Your uploaded documents are encrypted and processed securely. We do not store your personal health information after the analysis is complete."
  },
  {
    question: "What does the Food-Medication Interaction Checker do?",
    answer: "This feature helps you identify potential interactions between your prescribed medications and the foods you eat. It can alert you to foods that might reduce the effectiveness of your medication or cause adverse side effects."
  },
  {
    question: "Can I use this service for a medical emergency?",
    answer: "No. This service is for informational purposes only and is not intended for use in medical emergencies. If you are experiencing a medical emergency, please call your local emergency number immediately or go to the nearest emergency room."
  }
];

export default function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
