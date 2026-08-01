
import AboutFourThumb from '../../public/assets/images/thumbs/about-four.png';


const AboutFour = () => {
    return (
        <section className="about-four padding-t-120 padding-b-60">
            <div className="container container-two">
                <div className="row gy-4">
                    <div className="col-lg-6">
                        <div className="about-content">
                            <div className="section-heading style-left">
                                <span className="section-heading__subtitle bg-white"> <span className="text-gradient fw-semibold">Know About Us</span> </span>
                                <h2 className="section-heading__title">Making Your Real Estate Dreams a Reality</h2>
                                <p className="section-heading__desc font-18">Et purus duis sollicitudin dignissim habitant. Egestas nulla quis venenatis cras sed eu massa eu faucibus Urna fusce</p>
                            </div>
                            <ul className="check-list">
                                <li className="check-list__item d-flex align-items-center">
                                    <span className="icon"><i className="fas fa-check"></i></span>
                                    <span className="text fw-normal text-body font-16">Prestige Property Management Your Dream</span>
                                </li>
                                <li className="check-list__item d-flex align-items-center">
                                    <span className="icon"><i className="fas fa-check"></i></span>
                                    <span className="text fw-normal text-body font-16">Real Estate is a vast industry that deals </span>
                                </li>
                                <li className="check-list__item d-flex align-items-center">
                                    <span className="icon"><i className="fas fa-check"></i></span>
                                    <span className="text fw-normal text-body font-16">Property Management Your Dream</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about-four-thumb about-three-thumb">
                            <div className="about-three-thumb__inner text-end">
                                <img src={AboutFourThumb} alt=""/>
                                <div className="project-content">
                                    <div className="project-content__inner">
                                        <h2 className="project-content__number text-gradient"> 10k+ </h2>
                                        <span className="project-content__text font-12">Complete project</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFour;