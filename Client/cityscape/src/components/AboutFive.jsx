
import { Link } from 'react-router-dom';

const AboutFive = () => {
    return (
        <section className="about-five padding-y-120">
            <div className="container container-two">
                <div className="row flex-wrap-reverse">
                    <div className="col-lg-5 col-md-6">
                        <div className="about-five__thumbs">
                            <div className="row gy-4">
                                <div className="col-sm-6 col-6">
                                    <div className="about-five__thumb one h-100 d-flex">
                                        <img src="assets/images/thumbs/about-five-img1.png" alt="Image"/>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-6">
                                    <div className="about-five__thumb two">
                                        <img src="assets/images/thumbs/about-five-img2.png" alt="Image"/>
                                    </div>
                                    <div className="about-five__thumb three">
                                        <img src="assets/images/thumbs/about-five-img3.png" alt="Image"/>
                                    </div>
                                </div>
                            </div>
                            <div className="about-five__content d-inline-flex align-items-center">
                                <span className="about-five__icon"><i className="fas fa-users"></i></span>
                                <div className="about-five__texts">
                                    <h5 className="about-five__amount mb-0 text-white">25K+</h5>
                                    <span className="about-five__text text-white font-18">Services We Provide</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-6 ps-xl-5">
                        <div className="about-contents">
                            <div className="section-heading style-left">
                                <span className="section-heading__subtitle"> <span className="text-gradient fw-semibold">About Us</span> </span>
                                <h2 className="section-heading__title">Unlocking the door to your a the new home</h2>

                                <ul className="check-list mt-4 mt-lg-5">
                                    <li className="check-list__item d-flex align-items-center">
                                        <span className="icon"><i className="fas fa-check"></i></span>
                                        <span className="text text-body fw-normal font-16">Prestige Property Management Your Dream Home Awaits </span>
                                    </li>
                                    <li className="check-list__item d-flex align-items-center">
                                        <span className="icon"><i className="fas fa-check"></i></span>
                                        <span className="text text-body fw-normal font-16"> Real Estate is a vast industry that deals with the buying, selling</span>
                                    </li>
                                </ul>
                                
                                <p className="section-heading__desc">Real Estate is a vast industry that deals with the buying, selling, and renting of properties. It involves transactions related to residential</p>

                                <div className="mt-4">
                                    <Link to='/about-us' className="simple-btn text-heading fw-semibold">Read More 
                                        <span className="icon-right text-gradient"> <i className="fas fa-arrow-right"></i></span>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFive;