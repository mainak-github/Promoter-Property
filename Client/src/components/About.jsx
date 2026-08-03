import { useEffect, useState } from 'react';
import { aboutContent } from '../data/HomeOneData/HomeOneData';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import CountUp from 'react-countup';
import { API_URL } from '../url';

const About = () => {
    const [stats, setStats] = useState({
        satisfiedClients: 0,
        satisfiedUsers: 0,
        totalProperties: 0,
        totalBrokers: 0,
    });

    useEffect(() => {
        fetch(`${API_URL}/public/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setStats({
                        satisfiedClients: data.data.satisfiedClients || 0,
                        satisfiedUsers: data.data.satisfiedUsers || 0,
                        totalProperties: data.data.totalProperties || 0,
                        totalBrokers: data.data.totalBrokers || 0,
                    });
                }
            })
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    return (
        <>
            {/* ======================== About Section Start ========================== */}
            <section className="about padding-y-120">
                <div className="container container-two">
                    <div className="row gy-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="about-thumb">
                                <img src={aboutContent.thumb} alt=""/>
                                <div className="client-statistics flx-align">
                                    <span className="client-statistics__icon">
                                        <i className="fas fa-users text-gradient"></i>
                                    </span>
                                    <div className="client-statistics__content">
                                        <h5 className="client-statistics__number statisticsCounter">
                                            <CountUp end={stats.satisfiedClients} duration={3} />{stats.satisfiedClients > 0 ? '+' : ''}
                                        </h5>
                                        <span className="client-statistics__text fs-18">Satisfied Clients</span>
                                    </div>
                                </div>
                                <div className="client-statistics flx-align mt-3">
                                    <span className="client-statistics__icon">
                                        <i className="fas fa-user-check text-gradient"></i>
                                    </span>
                                    <div className="client-statistics__content">
                                        <h5 className="client-statistics__number statisticsCounter">
                                            <CountUp end={stats.satisfiedUsers} duration={3} />{stats.satisfiedUsers > 0 ? '+' : ''}
                                        </h5>
                                        <span className="client-statistics__text fs-18">Satisfied Users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-content">

                                <SectionHeading 
                                    headingClass="style-left"  
                                    subtitle="About Us"
                                    subtitleClass="" 
                                    title="Stay with us feel at home Your perfect stay awaits" 
                                    renderDesc={false}
                                    desc=""
                                    renderButton={false}
                                    buttonClass="btn-main"
                                    buttonText="View More"
                                />
                                
                                <div className="about-box d-flex">
                                    <div className="about-box__icon">
                                        <img src={aboutContent.icon} alt="" />
                                    </div>
                                    <div className="about-box__content">
                                        <h6 className="about-box__title">{aboutContent.title}</h6>
                                        <p className="about-box__desc font-13">{aboutContent.desc}</p>
                                    </div>
                                </div>
                                <div className="about-button">
                                    <Button 
                                        btnLink="/about-us" 
                                        btnClass="btn-main" 
                                        btnText="Learn More" 
                                        spanClass="icon-right" 
                                        iconClass="fas fa-arrow-right" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ======================== About Section End ========================== */}
   
        </>
    );
};

export default About;