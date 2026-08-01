
import { Link } from 'react-router-dom';

const WorkProcessFour = () => {
    return (
        <section className="working-process padding-b-60">
        <img src="assets/images/shapes/work-process-vector.png" alt="" className="working-process__shape d-lg-block d-none"/>
        <div className="container container-two">
            <div className="row section-heading style-left max-w-unset">
                <div className="col-lg-6 pe-xl-5">
                    <span className="section-heading__subtitle">
                        <span className="text-gradient fw-semibold">Work Process</span>
                    </span>
                    <h2 className="section-heading__title">Building a Legacy through Real Estate</h2>
                </div>
                <div className="col-lg-6">
                    <p className="section-heading__desc font-18">Real estate is a lucrative ind involves the buying selling and Real estate a is a lucrative indinvolves buyingrep pertiese compasses sidential eproperties. It encompasses residential lucrative ind involves the buying selling and Real estate lucrative ind involves the buying</p>
                </div>
            </div>
            
            <div className="row gy-4">
                <div className="col-lg-6 pe-lg-5 d-lg-block d-none">
                    <div className="working-process__thumb rounded overflow-hidden">
                        <img src="assets/images/thumbs/working-process-img.png" alt=""/>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="working-process-item d-flex align-items-center">
                        <Link to='/project' className="working-process-item__link"><i className="las la-long-arrow-alt-right"></i></Link>
                        <h2 className="working-process-item__number">01.</h2>
                        <div className="working-process-item__content">
                            <h6 className="working-process-item__title">Home Staging</h6>
                            <p className="working-process-item__desc font-18">Lorem ipsum dolor sit amet consectetur</p>
                        </div>
                    </div>
                    <div className="working-process-item d-flex align-items-center">
                        <Link to='/project' className="working-process-item__link"><i className="las la-long-arrow-alt-right"></i></Link>
                        <h2 className="working-process-item__number">02.</h2>
                        <div className="working-process-item__content">
                            <h6 className="working-process-item__title">Property Management</h6>
                            <p className="working-process-item__desc font-18">Lorem ipsum dolor sit amet consectetur</p>
                        </div>
                    </div>
                    <div className="working-process-item d-flex align-items-center">
                        <Link to='/project' className="working-process-item__link"><i className="las la-long-arrow-alt-right"></i></Link>
                        <h2 className="working-process-item__number">03.</h2>
                        <div className="working-process-item__content">
                            <h6 className="working-process-item__title">Property Appraisal</h6>
                            <p className="working-process-item__desc font-18">Lorem ipsum dolor sit amet consectetur</p>
                        </div>
                    </div>
                    <div className="working-process-item d-flex align-items-center">
                        <Link to='/project' className="working-process-item__link"><i className="las la-long-arrow-alt-right"></i></Link>
                        <h2 className="working-process-item__number">04.</h2>
                        <div className="working-process-item__content">
                            <h6 className="working-process-item__title">Rental Property</h6>
                            <p className="working-process-item__desc font-18">Lorem ipsum dolor sit amet consectetur</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default WorkProcessFour;