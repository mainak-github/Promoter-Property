import React from 'react';
import Slider from "react-slick";
import SectionHeading from '../common/SectionHeading';
import { projectItems } from '../data/OthersPageData/OthersPageData';
import { slugURL } from '../utility/Utility';
import { Link } from 'react-router-dom';

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
    centerMode: true,
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

const ProjectFour = () => {

    const slider = React.useRef(null);
    
    return (
        <section className="project-section padding-t-120 padding-b-60">
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
        
                <div className="project-page__inner arrow-style-two position-relative overflow-hidden">
                    
                    <Slider {...settings}  ref={slider}>
                        {
                            projectItems.map((projectItem, projectItemIndex) => {

                                const {id, thumb, title, desc} = projectItem; 
                                // Generate dynamic URL based on the property title
                                const projectURL = slugURL({url: 'project', slug: title}); 
                                
                                return (
                                    <div className={`col-md-4 col-sm-6 col-xs-6`} key={projectItemIndex}>
                                        <div className="project-page-thumb">
                                            <img src={thumb} alt="" className="cover-img"/>
                                            <div className="project-page-content">
                                                <h6 className="project-page-content__title">
                                                    <Link to={projectURL} state={{ id, title, thumb, desc }} className="link">{title}</Link>
                                                </h6>
                                            </div>
                                        </div>
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

export default ProjectFour;