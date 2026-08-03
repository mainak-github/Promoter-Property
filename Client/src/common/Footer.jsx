import { Link } from 'react-router-dom';
import SocialList from './SocialList';
import FooterLogoDesc from './footer/FooterLogoDesc';
import FooterServiceItem from './footer/FooterServiceItem';
import FooterUsefulItem from './footer/FooterUsefulItem';
import FooterBottom from './FooterBottom';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <>
            {/* =============================== Footer Section Start ============================== */}
            <footer className="footer padding-y-120">
                <div className="container container-two">
                    {/* Footer Top */}
                    <div className="row gy-5">

                        <div className="col-xl-3 col-sm-6 col-xsm-6">
                            <div className="footer-item">
                                <FooterLogoDesc/>
                                <SocialList/>
                            </div>
                        </div>
                        
                        <div className="col-xl-3 col-sm-6 col-xsm-6">
                            <FooterUsefulItem/>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-xsm-6">
                            <FooterServiceItem/>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-xsm-6">
                            <div className="footer-item">
                                <h6 className="footer-item__title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>Contact Us</h6>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
                                    <li style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                                        <EnvironmentOutlined style={{ color: '#ea580c', fontSize: 18, marginTop: 3 }} />
                                        <span>Promoter Property Headquarters, OMR Road, Chennai, Tamil Nadu - 600092, India</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                                        <PhoneOutlined style={{ color: '#ea580c', fontSize: 18 }} />
                                        <a href="tel:+918939000065" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>+91 89390 00065</a>
                                    </li>
                                    <li style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                                        <MailOutlined style={{ color: '#ea580c', fontSize: 18 }} />
                                        <a href="mailto:support@promoterproperty.com" style={{ color: '#94a3b8', textDecoration: 'none' }}>support@promoterproperty.com</a>
                                    </li>
                                    <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <ClockCircleOutlined style={{ color: '#ea580c', fontSize: 18 }} />
                                        <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* bottom Footer */}
            <FooterBottom footerClass=""/>
            {/* =============================== Footer Section End ============================== */}
        </>
    );
};

export default Footer;