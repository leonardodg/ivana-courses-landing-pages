import { faqs_text, faqs_text_br } from "../lang/faqs";

export const faqs_list = [
  {
    id: "faq-1",
    question: faqs_text.faq1.question,
    answer: faqs_text.faq1.answer,
  },
  {
    id: "faq-2",
    question: faqs_text.faq2.question,
    answer: faqs_text.faq2.answer,
  },
  {
    id: "faq-3",
    question: faqs_text.faq3.question,
    answer: faqs_text.faq3.answer,
  },
  {
    id: "faq-4",
    question: faqs_text.faq4.question,
    answer: faqs_text.faq4.answer,
  },
  {
    id: "faq-5",
    question: faqs_text.faq5.question,
    answer: faqs_text.faq5.answer,
  },
];

// Páginas brasileiras: mesmas perguntas, sem as menções ao Conservatório Grassi.
export const faqs_list_br = faqs_list.map((faq) =>
  faq.id === "faq-3"
    ? { ...faq, question: faqs_text_br.faq3.question, answer: faqs_text_br.faq3.answer }
    : faq.id === "faq-5"
      ? { ...faq, question: faqs_text_br.faq5.question, answer: faqs_text_br.faq5.answer }
      : faq,
);
