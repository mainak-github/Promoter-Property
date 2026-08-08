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
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
                                    <li style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                                        <EnvironmentOutlined style={{ color: '#ea580c', fontSize: 16, marginTop: 3 }} />
                                        <span><strong>Office:</strong> Phase 1, GREETA TOWERS, Greeta Techpark, No: 99, Rajiv Gandhi Salai, Industrial Estate, Perungudi, Chennai, Tamil Nadu 600096</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                                        <EnvironmentOutlined style={{ color: '#38bdf8', fontSize: 16, marginTop: 3 }} />
                                        <span><strong>Registered:</strong> 2nd floor, 25/13, Shankar Nagar, Pammal, Chennai, Tambaram, Tamil Nadu 600075</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                                        <PhoneOutlined style={{ color: '#ea580c', fontSize: 16 }} />
                                        <a href="tel:+918939000065" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>+91 89390 00065</a>
                                    </li>
                                    <li style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                                        <MailOutlined style={{ color: '#ea580c', fontSize: 16 }} />
                                        <a href="mailto:ajesh@promoterproperty.com" style={{ color: '#94a3b8', textDecoration: 'none' }}>ajesh@promoterproperty.com</a>
                                    </li>
                                    <li style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
                                        <ClockCircleOutlined style={{ color: '#10b981', fontSize: 16 }} />
                                        <span style={{ color: '#10b981', fontWeight: 700 }}>24 * 7 Service Support</span>
                                    </li>
                                </ul>

                                {/* Statutory Registration Details */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 8 }}>
                                    <div style={{ color: '#f8fafc', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>PRAVARTAK SAMPATTI PRIVATE LIMITED</div>
                                    <div style={{ color: '#cbd5e1', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <span><strong>RERA:</strong> TN/AGENT/0087/2023</span>
                                        <span><strong>GST:</strong> 33AAOCP8857H1ZT</span>
                                        <span><strong>PAN:</strong> AAOCP8857H</span>
                                    </div>
                                </div>
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