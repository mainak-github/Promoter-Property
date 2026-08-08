
import TopHeader from '../common/TopHeader';
import Header from './../common/Header';
import Banner from '../components/Banner';
import About from '../components/About';
import Property from '../components/Property';
import PropertyType from '../components/PropertyType';
import VideoPopup from '../components/VideoPopup';
import Counter from './../components/Counter';
import Portfolio from '../components/Portfolio';
import Testimonial from './../components/Testimonial';
import Blog from './../components/Blog';
import FooterTwo from './../common/FooterTwo';
import Message from './../components/Message';
import MobileMenu from '../common/MobileMenu';
import OffCanvas from '../common/OffCanvas';
import PageTitle from '../common/PageTitle';

const HomeOne = () => {
    const homeSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Promoter Property",
        "url": "https://promoterproperty.com/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://promoterproperty.com/property?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <PageTitle
                title="Promoter Property - Buy, Sell & Rent Real Estate, Flats & Luxury Villas"
                description="Explore top real estate listings, verified apartments, villas, commercial plots, and ready-to-move homes. Connect with top brokers and builders at Promoter Property."
                keywords="real estate, buy property, luxury villas, verified flats, promoter property, commercial plots"
                canonicalPath="/"
                schemaJson={homeSchema}
            />
            <OffCanvas/>
            <MobileMenu/>
            
            <main className="body-bg">

                {/* Top header */}
                <TopHeader/>
                
                {/* Header */}
                <Header 
                    headerClass="" 
                    logoBlack={true}
                    logoWhite={false}
                    headerMenusClass=""
                    btnClass="btn btn-outline-light d-lg-block d-none"
                    btnLink="/login"
                    btnText="Login / Register"
                    spanClass="icon-right text-gradient" 
                    showHeaderBtn={true}
                    showOffCanvasBtn={true}
                    offCanvasBtnClass=""
                    showContactNumber={false}
                />

                {/* Banner */}
                <Banner/>
                
                {/* About */}
                <About/>

                {/* Property */}
                <Property/>

                {/* Property Type */}
                <PropertyType/>

                {/* Video Popup */}
                <VideoPopup/>

                {/* Counter */}
                <Counter/>

                {/* Message */}
                <Message/>

                {/* Portfolio */}
                <Portfolio/>

                {/* Testimonial */}
                <Testimonial/>

                {/* Blog */}
                {/* <Blog/> */}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br /><br /><br /><br /><br />
                    <br />
                    <br /><br /><br /><br />
                {/* FooterTwo */}
                <FooterTwo/>
                
            </main>
        </>
    );
};

export default HomeOne;