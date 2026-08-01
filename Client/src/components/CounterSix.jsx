import CountUp from 'react-countup';

const CounterSix = () => {
    return (
        <section className="counter-six">
            <div className="container container-two">
                <div className="counter-six__inner bg-white">
                    <div className="row gy-4">
                        <div className="col-lg-3 col-6">
                            <div className="counter-six-item">
                                <div className="d-flex align-items-center gap-2 gap-sm-3">
                                    <span className="counter-six-item__icon">
                                        <img src="assets/images/icons/counter-six-img1.svg" alt=""/>
                                    </span>
                                    <h2 className="counter-six-item__number mb-0">
                                        <CountUp end={parseInt(200)} duration={6} delay={0.2} />+
                                    </h2>
                                </div>
                                <span className="counter-six-item__text font-18">HAPPY PATIENTS</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="counter-six-item">
                                <div className="d-flex align-items-center gap-2 gap-sm-3">
                                    <span className="counter-six-item__icon">
                                        <img src="assets/images/icons/counter-six-img2.svg" alt=""/>
                                    </span>
                                    <h2 className="counter-six-item__number mb-0">
                                        <CountUp end={parseInt(20)} duration={6} delay={0.2} />+
                                    </h2>
                                </div>
                                <span className="counter-six-item__text font-18">SAVED HEARTS</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="counter-six-item">
                                <div className="d-flex align-items-center gap-2 gap-sm-3">
                                    <span className="counter-six-item__icon">
                                        <img src="assets/images/icons/counter-six-img3.svg" alt=""/>
                                    </span>
                                    <h2 className="counter-six-item__number mb-0">
                                        <CountUp end={parseInt(10)} duration={6} delay={0.2} />+
                                    </h2>
                                </div>
                                <span className="counter-six-item__text font-18">EXPERT DOCTORS</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="counter-six-item">
                                <div className="d-flex align-items-center gap-2 gap-sm-3">
                                    <span className="counter-six-item__icon">
                                        <img src="assets/images/icons/counter-six-img4.svg" alt=""/>
                                    </span>
                                    <h2 className="counter-six-item__number mb-0">
                                        <CountUp end={parseInt(900)} duration={6} delay={0.2} />+
                                    </h2>
                                </div>
                                <span className="counter-six-item__text font-18">SERENITY WORK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CounterSix;