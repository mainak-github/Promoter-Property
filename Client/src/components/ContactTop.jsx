import { EnvironmentOutlined, PhoneOutlined, MailOutlined, SafetyOutlined, ClockCircleOutlined, FileTextOutlined, BankOutlined } from '@ant-design/icons';

const ContactTop = () => {
    return (
        <section className="contact-top padding-y-120" style={{ backgroundColor: '#f8fafc' }}>
            <div className="container container-two">
                
                {/* Section Title */}
                <div className="section-heading text-center" style={{ marginBottom: 40 }}>
                    <span className="section-heading__subtitle bg-gray-100"> 
                        <span className="text-gradient fw-semibold">Official Contact & Corporate Info</span> 
                    </span>
                    <h2 className="section-heading__title" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
                        PROMOTER PROPERTY
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
                        Billing Name: <strong style={{ color: '#0f172a' }}>PRAVARTAK SAMPATTI PRIVATE LIMITED</strong>
                    </p>
                </div>

                {/* 4 Cards Grid for Contact, Addresses, and Statutory Info */}
                <div className="row gy-4">

                    {/* Card 1: Office Address */}
                    <div className="col-lg-4 col-md-6">
                        <div style={{
                            background: '#ffffff',
                            padding: 28,
                            borderRadius: 16,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                            height: '100%'
                        }}>
                            <div style={{ width: 50, height: 50, borderRadius: 12, background: '#fff3eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <EnvironmentOutlined style={{ fontSize: 22, color: '#ea580c' }} />
                            </div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                                Office Address
                            </h5>
                            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                Phase 1, GREETA TOWERS, Greeta Techpark, No: 99, Rajiv Gandhi Salai, Industrial Estate, Perungudi, Chennai, Greater Chennai, Tamil Nadu 600096
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Registered Address */}
                    <div className="col-lg-4 col-md-6">
                        <div style={{
                            background: '#ffffff',
                            padding: 28,
                            borderRadius: 16,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                            height: '100%'
                        }}>
                            <div style={{ width: 50, height: 50, borderRadius: 12, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <BankOutlined style={{ fontSize: 22, color: '#0284c7' }} />
                            </div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                                Registered Address
                            </h5>
                            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                2nd floor, 25/13, Shankar Nagar, Pammal, Chennai, Tambaram, Tamil Nadu 600075
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Direct Reach & Support */}
                    <div className="col-lg-4 col-md-6">
                        <div style={{
                            background: '#ffffff',
                            padding: 28,
                            borderRadius: 16,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                            height: '100%'
                        }}>
                            <div style={{ width: 50, height: 50, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <PhoneOutlined style={{ fontSize: 22, color: '#16a34a' }} />
                            </div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                                Direct Support & Helpline
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.92rem' }}>
                                <div>
                                    <strong style={{ color: '#0f172a' }}>Mobile:</strong>{' '}
                                    <a href="tel:+918939000065" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 700 }}>
                                        +91 89390 00065
                                    </a>
                                </div>
                                <div>
                                    <strong style={{ color: '#0f172a' }}>Email:</strong>{' '}
                                    <a href="mailto:ajesh@promoterproperty.com" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
                                        ajesh@promoterproperty.com
                                    </a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontWeight: 700, marginTop: 4 }}>
                                    <ClockCircleOutlined /> 24 * 7 Support Services
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Statutory Registration Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                    padding: '28px 32px',
                    borderRadius: 16,
                    marginTop: 30,
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
                }}>
                    <div className="row align-items-center gy-3">
                        <div className="col-md-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <SafetyOutlined style={{ fontSize: 28, color: '#ea580c' }} />
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>RERA Registration</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>TN/AGENT/0087/2023</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileTextOutlined style={{ fontSize: 28, color: '#38bdf8' }} />
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>GSTIN Number</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>33AAOCP8857H1ZT</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <BankOutlined style={{ fontSize: 28, color: '#4ade80' }} />
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>PAN Number</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>AAOCP8857H</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ContactTop;