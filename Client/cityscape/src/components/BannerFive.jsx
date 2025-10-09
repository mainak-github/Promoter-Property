
import { Link } from 'react-router-dom';

const BannerFive = () => {
    return (
        <section className="banner-five banner bg-white">
            <div className="container container-two">
                <div className="row gy-4">
                    <div className="col-lg-6">
                        <div className="banner-inner position-relative">
                            <div className="banner-content">
                                <span className="banner-content__subtitle text-uppercase font-14">FinTech Fusion</span>
                                <h1 className="banner-content__title">Beyond Walls We Build Dreams</h1>
                                <p className="banner-content__desc font-18">Unlock the Power of Real Estate Making Your Real Estate Dreams a Reality Real Estate here Unlock the Power of Real Estate</p>
                                <div className="banner-content__button">
                                    <Link to="/about-us" className="btn btn-main fw-normal">Learn More
                                        <span className="icon-right"> <i className="fas fa-arrow-right"></i> </span> 
                                    </Link>
                                </div>
                            </div>            
                        </div>
                    </div>
                    <div className="col-lg-6 order-lg-0 order-1">
                        <div className="banner-five__thumb">
                            <img src="assets/images/thumbs/banner-five-img.png" alt=""/>
                        </div>  
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerFive;