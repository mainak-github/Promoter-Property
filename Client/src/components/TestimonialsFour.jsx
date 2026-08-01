import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Slider from 'react-slick';


var settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: true,
    infinite: true,
    pauseOnHover: true,
    arrows: true,
    responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1
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

const TestimonialsFour = () => {

    const slider = React.useRef(null);
    
    return (
        <section className="testimonial-four padding-y-120">
        <div className="container container-two">

            <SectionHeading
                headingClass=""  
                subtitle="Clients Testimonials"
                subtitleClass="bg-gray-100" 
                title="Investing in Real Estate for Brighter Tomorrow" 
                renderDesc={false}
                desc=""
                renderButton={false}
                buttonClass="btn-main"
                buttonText="View More"
            />
            
            <div className="testimonial-four-slider overflow-hidden" ref={slider}>
                <Slider {...settings}  ref={slider}>
                    <div className="testimonial-item style-two style-four">
                        <p className="testimonial-item__desc mt-0">Real estate is a lucrativ ind involves the buying selling and Real estate a is a lucrative indinvolves buyingrep pertiesen cos residentialreproperties. It encompasses residential  Real estate a is a lucrative</p>
                        <div className="testimonial-item__top flx-between gap-2">
                            <div className="testimonial-item__info d-flex align-items-center">
                                <div className="testimonial-item__thumb">
                                    <img src="assets/images/thumbs/user-img1.png" alt=""/>
                                </div>
                                <div>
                                    <h6 className="testimonial-item__name">Robert Fox</h6>
                                <span className="testimonial-item__designation text-gradient">Prime Investments</span>
                                </div>
                            </div>
                            <span className="testimonial-item__quote"><i className="fas fa-quote-right"></i></span>
                        </div>
                    </div>
                    <div className="testimonial-item style-two style-four">
                        <p className="testimonial-item__desc mt-0">Real estate is a lucrativ ind involves the buying selling and Real estate a is a lucrative indinvolves buyingrep pertiesen cos residentialreproperties. It encompasses residential  Real estate a is a lucrative</p>
                        <div className="testimonial-item__top flx-between gap-2">
                            <div className="testimonial-item__info d-flex align-items-center">
                                <div className="testimonial-item__thumb">
                                    <img src="assets/images/thumbs/user-img2.png" alt=""/>
                                </div>
                                <div>
                                    <h6 className="testimonial-item__name">John Doe</h6>
                                <span className="testimonial-item__designation text-gradient">Web Developer</span>
                                </div>
                            </div>
                            <span className="testimonial-item__quote"><i className="fas fa-quote-right"></i></span>
                        </div>
                    </div>
                    <div className="testimonial-item style-two style-four">
                        <p className="testimonial-item__desc mt-0">Real estate is a lucrativ ind involves the buying selling and Real estate a is a lucrative indinvolves buyingrep pertiesen cos residentialreproperties. It encompasses residential  Real estate a is a lucrative</p>
                        <div className="testimonial-item__top flx-between gap-2">
                            <div className="testimonial-item__info d-flex align-items-center">
                                <div className="testimonial-item__thumb">
                                    <img src="assets/images/thumbs/user-img3.png" alt=""/>
                                </div>
                                <div>
                                    <h6 className="testimonial-item__name">Donald Trump</h6>
                                <span className="testimonial-item__designation text-gradient">Business Man</span>
                                </div>
                            </div>
                            <span className="testimonial-item__quote"><i className="fas fa-quote-right"></i></span>
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    </section>
    );
};

export default TestimonialsFour;