

import Header from './../common/Header';
import MobileMenu from '../common/MobileMenu';
import OffCanvas from '../common/OffCanvas';
import PageTitle from '../common/PageTitle';
import TopHeaderFive from '../components/TopHeaderFive';
import BannerFive from './../components/BannerFive';
import AboutFive from './../components/AboutFive';
import MarqueeSlider from '../components/MarqueeSlider';
import PropertyTypeFive from './../components/PropertyTypeFive';
import ChooseUsFive from '../components/ChooseUsFive';
import PropertyFive from '../components/PropertyFive';
import GalleryFive from '../components/GalleryFive';
import CounterSix from '../components/CounterSix';
import BlogFive from '../components/BlogFive';
import FooterFive from '../common/FooterFive';

const HomeFive = () => {
    return (
        <>
            <PageTitle title="Promoter Property - Home Five" />

            <OffCanvas />
            <MobileMenu />

            <main className="body-bg">

                {/* TopHeaderFive */}
                <TopHeaderFive />

                {/* Header */}
                <Header
                    headerClass=""
                    logoBlack={true}
                    logoWhite={false}
                    headerMenusClass=""
                    btnClass="btn btn-main  d-lg-block d-none"
                    btnLink="/add-new-listing"
                    btnText="Add Listing"
                    spanClass="icon-right"
                    showHeaderBtn={false}
                    showOffCanvasBtn={true}
                    offCanvasBtnClass=""
                    showContactNumber={true}
                />

                {/* BannerFive */}
                <BannerFive />

                {/* AboutFive */}
                <AboutFive />

                {/* MarqueeSlider */}
                <MarqueeSlider />

                {/* PropertyTypeFive */}
                <PropertyTypeFive />

                {/* ChooseUsFive */}
                <ChooseUsFive />

                {/* Property */}
                <PropertyFive />

                {/* Property */}
                <GalleryFive />

                {/* CounterSix */}
                <CounterSix />

                {/* BlogFive */}
                <BlogFive />

                {/* Footer */}
                <FooterFive />

            </main>
        </>
    );
};

export default HomeFive;