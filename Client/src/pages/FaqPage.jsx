
import Header from '../common/Header';
import Footer from '../common/Footer';
import Breadcrumb from '../common/Breadcrumb';
import Cta from '../components/Cta';
import FaqTwo from '../components/FaqTwo';
import FaqContactUs from '../components/FaqContactUs';
import CounterFour from '../components/CounterFour';
import PageTitle from '../common/PageTitle';

const FaqPage = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I buy or book a property on Promoter Property?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can browse verified properties on our catalog, click 'Book Site Visit' or 'WhatsApp Agent' to connect directly with the broker or developer to schedule a visit."
                }
            },
            {
                "@type": "Question",
                "name": "Are all property listings on Promoter Property verified?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our team reviews and verifies property details, documentation, and broker profiles before publishing listings."
                }
            },
            {
                "@type": "Question",
                "name": "Can I list my property for sale or rent as a broker or seller?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, click on 'Add Listing' or register as a broker to submit your property details for review and listing."
                }
            }
        ]
    };

    return (
        <>
            <PageTitle
                title="Frequently Asked Questions (FAQ) - Real Estate Assistance | Promoter Property"
                description="Find answers to common real estate questions regarding property search, site visits, buying, selling, and broker verification at Promoter Property."
                keywords="real estate FAQ, property buying questions, broker registration FAQ, promoter property help"
                canonicalPath="/faq"
                schemaJson={faqSchema}
            />

            {/* Header */}
            <Header
                headerClass="dark-header has-border"
                logoBlack={false}
                logoWhite={true}
                headerMenusClass="mx-auto"
                btnClass="btn btn-outline-main btn-outline-main-dark d-lg-block d-none"
                btnLink="/add-new-listing"
                btnText="Add Listing"
                spanClass="icon-right text-gradient"
                showHeaderBtn={true}
                showOffCanvasBtn={false}
                offCanvasBtnClass=""
                showContactNumber={false}
            />

            {/* BreadCrumb */}
            <Breadcrumb
                pageTitle="FAQ"
                pageName="FAQ"
            />

            {/* Faq Two */}
            <FaqTwo />

            {/* Faq Contact Us */}
            <FaqContactUs />

            {/* Counter Four */}
            <CounterFour />

            {/* Cta */}
            <Cta ctaClass="" />

            {/* Footer */}
            <Footer />
        </>
    );
};

export default FaqPage;