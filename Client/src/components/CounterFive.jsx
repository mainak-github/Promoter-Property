
import CountUp from 'react-countup';

const CounterFive = () => {
    return (
        <section className="counter-five padding-t-60 padding-b-120">
        <div className="container container-two">
            <div className="counter-five-wrapper">
                <div className="counter-five-item style-two d-flex align-items-center">
                    <span className="counter-five-item__icon bg-white">
                        <img src="assets/images/icons/counter-five-icon1.svg" alt=""/>
                    </span>
                    <div className="counter-five-item__content">
                        <h2 className="counter-five-item__number counterNumber text-heading">
                            <CountUp end={parseInt(200)} duration={6} delay={0.2} />+
                        </h2>
                        <span className="counter-five-item__text text-body">Team member</span>
                    </div>
                </div>
                <div className="counter-five-item style-two d-flex align-items-center">
                    <span className="counter-five-item__icon bg-white">
                        <img src="assets/images/icons/counter-five-icon2.svg" alt=""/>
                    </span>
                    <div className="counter-five-item__content">
                        <h2 className="counter-five-item__number counterNumber text-heading">
                            <CountUp end={parseInt(20)} duration={6} delay={0.2} />+
                        </h2>
                        <span className="counter-five-item__text text-body">Winning award</span>
                    </div>
                </div>
                <div className="counter-five-item style-two d-flex align-items-center">
                    <span className="counter-five-item__icon bg-white">
                        <img src="assets/images/icons/counter-five-icon3.svg" alt=""/>
                    </span>
                    <div className="counter-five-item__content">
                        <h2 className="counter-five-item__number counterNumber text-heading">
                            <CountUp end={parseInt(10)} duration={6} delay={0.2} />k
                        </h2>
                        <span className="counter-five-item__text text-body">Complete project</span>
                    </div>
                </div>
                <div className="counter-five-item style-two d-flex align-items-center">
                    <span className="counter-five-item__icon bg-white">
                        <img src="assets/images/icons/counter-five-icon4.svg" alt=""/>
                    </span>
                    <div className="counter-five-item__content">
                        <h2 className="counter-five-item__number counterNumber text-heading">
                            <CountUp end={parseInt(90)} duration={6} delay={0.2} />k
                        </h2>
                        <span className="counter-five-item__text text-body">Client review</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default CounterFive;