
import Header from '../common/Header';
import Footer from '../common/Footer';
import Breadcrumb from '../common/Breadcrumb';
import Cta from '../components/Cta';
import PropertyDetailsSection from '../components/PropertyDetailsSection';
import { useParams } from 'react-router-dom';
import PageTitle from '../common/PageTitle';


const PropertyDetails = () => {

    const {title} = useParams(); 
    
    return (
        <>
        <PageTitle title="CityScape - Property Details" />

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

          

            {/* Property Details Section */}
            <PropertyDetailsSection/>

          <br />
          <br /><br /><br />  <br /><br /><br /><br /><br /><br />

            {/* Footer */}
            <Footer/>
        </>
    );
};

export default PropertyDetails;
