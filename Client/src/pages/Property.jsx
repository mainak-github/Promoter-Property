
import Header from '../common/Header';
import Footer from '../common/Footer';
import Breadcrumb from '../common/Breadcrumb';
import PropertyPageSection from '../components/PropertyPageSection';
import Cta from '../components/Cta';
import PageTitle from '../common/PageTitle';

const Property = () => {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://promoterproperty.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Properties",
                "item": "https://promoterproperty.com/property"
            }
        ]
    };

    return (
        <>
            <PageTitle
                title="Verified Real Estate & Properties For Sale & Rent | Promoter Property"
                description="Browse 100+ verified properties, luxury apartments, independent houses, villas, and commercial plots. Filter by location, BHK, budget, and construction status."
                keywords="properties for sale, buy flat, luxury villa, verified property listings, real estate search, promoter property"
                canonicalPath="/property"
                schemaJson={breadcrumbSchema}
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
                    pageTitle="Property"
                    pageName="Property"
                />

                {/* Property Page Section */}
                <PropertyPageSection />

                {/* Cta */}
                <Cta ctaClass="" />

                {/* Footer */}
                <Footer />

            </main>
        </>
    );
};

export default Property;