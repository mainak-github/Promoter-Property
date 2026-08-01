import { useState, useEffect } from 'react';
import axios from 'axios';
import FaqItem from '../components/items/FaqItem';
import url from '../url'
const FaqAccordion = (props) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const handleAccordionClick = (faqId) => {
    setActiveAccordion(activeAccordion === faqId ? null : faqId);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${url.API_URL}/admin/faqs`); // Adjust endpoint if needed
        // Transform backend data to match expected shape
        const mappedFaqs = res.data.faqs.map(faq => ({
          id: faq.id,
          btnText: faq.question,
          bodyText: faq.answer,
        }));
        setFaqs(mappedFaqs);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className={`common-accordion accordion ${props.accordionClass}`}>
      {faqs.map((faq, faqIndex) => (
        <FaqItem
          itemClass={props.itemClass}
          faq={faq}
          key={faq.id || faqIndex}
          faqIndex={faqIndex}
          activeAccordion={activeAccordion}
          handleAccordionClick={handleAccordionClick}
        />
      ))}
    </div>
  );
};

export default FaqAccordion;
