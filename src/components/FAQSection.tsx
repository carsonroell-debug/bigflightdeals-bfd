import { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Do you actually use these tools?',
      answer: 'Yes. Every tool I recommend is something I use on my own trips. No affiliate fluff—just the tools that actually work for solo budget travel.',
    },
    {
      question: 'Is this free?',
      answer: 'The flight alerts and travel tips email list is free. The Solo Travel Planner and Starter Kit are paid products on Gumroad. Everything else on the site is free to use.',
    },
    {
      question: 'Who is this for?',
      answer: 'Solo budget travellers who want real deals, honest itineraries, and one clear tool per category. If you\'re tired of fake "$20 a day" promises and analysis paralysis, this is for you.',
    },
    {
      question: 'How often do you send flight alerts?',
      answer: 'Weekly emails with real deal windows, packing tips, and travel advice. No spam, unsubscribe anytime.',
    },
    {
      question: 'Can I trust these flight prices?',
      answer: 'I only share deals during actual low seasons and real deal windows. No fake promises—just honest alerts when flights actually drop to budget-friendly prices.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <h2 className="section-title">FAQ</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
