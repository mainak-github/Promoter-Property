
import SectionHeading from '../common/SectionHeading';
import PropertyItem from './items/PropertyItem';
import { properties } from '../data/HomeOneData/HomeOneData';

const PropertyFour = () => {
    return (
        <section className="property-four padding-y-60">
        <div className="container container-two">
            <SectionHeading
                headingClass=""  
                subtitle="Latest Offer"
                subtitleClass="bg-white" 
                title="Live Your Best Life in a New life Home" 
                renderDesc={false}
                desc=""
                renderButton={false}
                buttonClass="btn-main"
                buttonText="View More"
            />

            <div className="row gy-4">
                {
                    properties.slice(0, 6).map((property, index) => {
                        return (
                            <div className="col-lg-4 col-sm-6" key={index}>
                                <PropertyItem 
                                    itemClass="item-text-black bg-white"
                                    btnClass=""
                                    property={property}
                                    badgeText="Sales"
                                    badgeClass="property-item__badge text-white"
                                    iconsClass=""
                                    btnRenderBottom={false}
                                    btnRenderRight={true}
                                />
                            </div> 
                        )
                    })
                }
            </div>

        </div>
    </section>
    );
};

export default PropertyFour;