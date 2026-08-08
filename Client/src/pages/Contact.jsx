
import Header from '../common/Header';
import Footer from '../common/Footer';
import Breadcrumb from '../common/Breadcrumb';
import Cta from '../components/Cta';
import ContactTop from '../components/ContactTop';
import ContactUsSection from '../components/ContactUsSection';
import PageTitle from '../common/PageTitle';


const Contact = () => {
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Promoter Property",
        "image": "https://promoterproperty.com/assets/images/logo/logo-black.png",
        "telephone": "+91-8939000065",
        "email": "contact@promoterproperty.com",
        "url": "https://promoterproperty.com/contact",
        "priceRange": "₹₹₹",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Prime Location",
            "addressLocality": "Kolkata",
            "addressRegion": "West Bengal",
            "postalCode": "700001",
            "addressCountry": "IN"
        }
    };

    return (
        <>
            <PageTitle
                title="Contact Us - Schedule Property Visits & Expert Advice | Promoter Property"
                description="Get in touch with Promoter Property's real estate experts. Schedule site visits, inquire about property listings, or get assistance with buying and selling properties."
                keywords="contact promoter property, real estate contact, schedule site visit, property inquiry, real estate customer support"
                canonicalPath="/contact"
                schemaJson={localBusinessSchema}
            />

            <main className="body-bg">
                
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
                    pageTitle="Contact Us"
                    pageName="Contact Us"
                />

                {/* Contact Top */}
                <ContactTop/>

                <div className="contact-map address-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1150112.1628856962!2d44.64619029447154!3d23.086651461779507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sbd!4v1707037970965!5m2!1sen!2sbd" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>

                {/* Contact Us Section */}
                <ContactUsSection/>

                {/* Cta */}
                <Cta ctaClass=""/>

                {/* Footer */}
                <Footer/>

            </main>   
        </>
    );
};

export default Contact;
