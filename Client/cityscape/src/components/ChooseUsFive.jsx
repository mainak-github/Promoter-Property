
import { Link } from 'react-router-dom';

const ChooseUsFive = () => {
    return (
        <section className="choose-us padding-y-120 bg-gray-900">
            <div className="container">
                <div className="row gy-4 flex-wrap-reverse">
                    <div className="col-lg-6">
                        <div className="choose-us__thumb">
                            <div className="choose-us__thumb-inner">
                                <img src="assets/images/thumbs/choose-us-img.png" alt="Choose Us" className="img cover-img"/>
                                <Link to='https://www.youtube.com/watch?v=pPl3ZZdTP3g' className="popup-video-link video-popup__button">
                                    <i className="fas fa-play"></i>
                                </Link>
                            </div>
                            <img src="assets/images/shapes/pipes.png" alt="Pipe Shape" className="pipe-shape"/>
                        </div>
                    </div>
                    <div className="col-lg-6 ps-lg-5">
                        <div className="choose-us__content">
                            <div className="section-heading mb-0 style-left">
                                <span className="section-heading__subtitle bg-gray-700"> <span className="text-gradient fw-semibold">why chose us</span> </span>
                                <h2 className="section-heading__title text-white">Making Your Real Estate the Dreams a Reality</h2>
                                <p className="section-heading__desc text-white fw-light font-18">Real Estate is a vast industry that deals with the buying, selling, and renting of properties. It involves transactions related to residential Real Estate is a vt industry that deals with the an buying, selling, and renting </p>
                                <div className="choose-us__button">
                                    <Link to='/about-us' className="btn btn-outline-lightInDark text-white fw-normal">Read More 
                                        <span className="icon-right icon text-gradient"> 
                                            <i className="fas fa-arrow-right"></i>
                                        </span> 
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

export default ChooseUsFive;