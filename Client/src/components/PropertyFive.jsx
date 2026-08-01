import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Slider from 'react-slick';
import { properties } from '../data/HomeOneData/HomeOneData';
import PropertyItem from './items/PropertyItem';

var settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    infinite: true,
    pauseOnHover: true,
    arrows: true,
    responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 530,
          settings: {
            slidesToShow: 1
          }
        }
    ]
};

const PropertyFive = () => {

    const slider = React.useRef(null);
    
    return (
        <section className="property-four padding-y-120">
            <div className="container container-two">

                <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-4 mb-72">
                    <SectionHeading
                        headingClass="style-left mb-0"  
                        subtitle="Our Projects"
                        subtitleClass="bg-gray-100" 
                        title="Creating Lasting Memories through Real Estate" 
                        renderDesc={false}
                        desc=""
                        renderButton={false}
                        buttonClass="btn-main"
                        buttonText="View More"
                    />
                    <div className="arrow-style-two d-flex align-items-center gap-3">
                        <button className='slick-prev slick-arrow position-relative bottom-0 top-0 start-0' onClick={() => slider?.current?.slickPrev()}>
                            <i className="fas fa-arrow-left"></i>    
                        </button>
                        <button className='slick-next slick-arrow position-relative bottom-0 top-0 start-0' onClick={() => slider?.current?.slickNext()}>
                            <i className="fas fa-arrow-right"></i>    
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <Slider {...settings}  ref={slider}>
                        {
                            properties.slice(0, 6).map((property, index) => {
                                return (
                                    <div className="col-lg-4 col-sm-6" key={index}>
                                        <PropertyItem 
                                            itemClass="item-text-black style-three border border-color shadow-none bg-white"
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
                    </Slider>
                </div>

            </div>
        </section>
    );
};

export default PropertyFive;