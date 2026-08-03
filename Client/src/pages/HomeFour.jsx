

import Header from './../common/Header';
import Footer from '../common/Footer';
import MobileMenu from '../common/MobileMenu';
import OffCanvas from '../common/OffCanvas';
import PageTitle from '../common/PageTitle';
import TopHeaderFour from '../components/TopHeaderFour';
import BannerFour from '../components/BannerFour';
import AboutFour from '../components/AboutFour';
import LatestPropertiesFour from '../components/LatestPropertiesFour';
import PropertyFour from '../components/PropertyFour';
import CounterFive from './../components/CounterFive';
import ProjectFour from '../components/ProjectFour';
import TestimonialsFour from '../components/TestimonialsFour';
import WorkProcessFour from '../components/WorkProcessFour';
import Team from '../components/Team';
import BlogFour from '../components/BlogFour';
import Cta from './../components/Cta';

const HomeFour = () => {
    return (
        <>
        <PageTitle title="Promoter Property - Home Four" />

            <OffCanvas/>
            <MobileMenu/>
            
            <main className="body-bg">

                {/* Top Header */}
                <TopHeaderFour/>

                {/* Header */}
                <Header 
                    headerClass="bg-white" 
                    logoBlack={true}
                    logoWhite={false}
                    headerMenusClass=""
                    btnClass="btn btn-main  d-lg-block d-none"
                    btnLink="/add-new-listing"
                    btnText="Add Listing"
                    spanClass="icon-right" 
                    showHeaderBtn={true}
                    showOffCanvasBtn={false}
                    offCanvasBtnClass=""
                    showContactNumber={false}
                />

                {/* BannerFour */}
                <BannerFour/>

                {/* AboutFour */}
                <AboutFour/>

                {/* LatestPropertiesFour */}
                <LatestPropertiesFour/>

                {/* Property */}
                <PropertyFour/>

                {/* CounterFive */}
                <CounterFive/>

                {/* ProjectFour */}
                <ProjectFour/>

                {/* TestimonialsFour */}
                <TestimonialsFour/>

                {/* WorkProcessFour */}
                <WorkProcessFour/>

                {/* Team */}
                <Team sectionClass="padding-t-60"/>

                {/* Blog */}
                <BlogFour/>

                {/* NewsletterFour */}
                <Cta/>

                {/* Footer */}
                <Footer/>
                
            </main>   
        </>
    );
};

export default HomeFour;