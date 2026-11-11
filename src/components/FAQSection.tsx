import { useState } from 'react';
import './FAQSection.css';

const faqs = [
  { question: 'Does BigFlightDeals sell flights?', answer: 'No. Flight search tools can direct you to an airline or travel provider to make your booking. Check their price, terms and baggage rules before paying.' },
  { question: 'Are prices on the site guaranteed?', answer: 'No. Fares and availability change. Always confirm the current price and terms with the booking provider.' },
  { question: 'Does the site earn commissions?', answer: 'Some search tools or links may be affiliate links. If you make a qualifying purchase, the site may earn a commission, at no additional cost to you.' },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <h2 className="section-title">FAQ</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="faq-item">
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)} aria-expanded={openIndex === index}>
                <span>{faq.question}</span><span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && <div className="faq-answer"><p>{faq.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
