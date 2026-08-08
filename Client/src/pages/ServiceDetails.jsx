import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceBySlug, servicesData } from "../data/ServiceData";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import PageTitle from "../common/PageTitle";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import url from "../url";

import {
  BulbOutlined,
  SafetyOutlined,
  CompassOutlined,
  BankOutlined,
  AppstoreOutlined,
  BuildOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined,
  SendOutlined
} from "@ant-design/icons";

const iconComponentMap = {
  BulbOutlined: <BulbOutlined style={{ fontSize: 24, color: "#ea580c" }} />,
  SafetyOutlined: <SafetyOutlined style={{ fontSize: 24, color: "#4f46e5" }} />,
  CompassOutlined: <CompassOutlined style={{ fontSize: 24, color: "#059669" }} />,
  BankOutlined: <BankOutlined style={{ fontSize: 24, color: "#c2410c" }} />,
  AppstoreOutlined: <AppstoreOutlined style={{ fontSize: 24, color: "#7c3aed" }} />,
  BuildOutlined: <BuildOutlined style={{ fontSize: 24, color: "#db2777" }} />,
  ShopOutlined: <ShopOutlined style={{ fontSize: 24, color: "#2563eb" }} />
};

const ServiceDetails = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug || "brand-marketing");
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      subject: `Inquiry for ${service.title}`,
      leadType: `service_${service.slug}`
    };

    try {
      await axios.post(`${url.API_URL}/admin/leads`, data);
      toast.success(`Thank you! Your inquiry for ${service.title} has been submitted successfully.`, {
        theme: "colored"
      });
      formRef.current.reset();
    } catch (err) {
      toast.error("Message submission failed. Please call us at +91 89390 00065 directly.", {
        theme: "colored"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title={`${service.title} | Promoter Property`} />
      <Header />
      <ToastContainer />

      <Breadcrumb pageTitle={service.title} pageName={service.title} />

      {/* --- MAIN CONTENT AREA --- */}
      <section style={{ backgroundColor: "#f8fafc", padding: "70px 0" }}>
        <div className="container container-two">
          <div className="row gy-5">
            
            {/* SIDEBAR - SERVICES LIST & CONTACT CARD */}
            <div className="col-lg-4">
              <div style={{ position: "sticky", top: 100 }}>
                
                {/* Services Navigation Widget */}
                <div style={{
                  background: "#ffffff",
                  padding: 24,
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  marginBottom: 24
                }}>
                  <h5 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                    Our Specialized Services
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {servicesData.map((item) => {
                      const isActive = item.slug === service.slug;
                      return (
                        <Link
                          key={item.id}
                          to={`/services/${item.slug}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            borderRadius: 10,
                            textDecoration: "none",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? "#ffffff" : "#334155",
                            backgroundColor: isActive ? "#0f172a" : "#f1f5f9",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span>{item.title}</span>
                          <ArrowRightOutlined style={{ fontSize: 12, opacity: isActive ? 1 : 0.4 }} />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                  color: "#ffffff",
                  padding: 28,
                  borderRadius: 16,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)"
                }}>
                  <h5 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>
                    Need Immediate Assistance?
                  </h5>
                  <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>
                    Speak directly with our dedicated experts for instant consultation.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.9rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <PhoneOutlined style={{ color: "#ea580c", fontSize: 18 }} />
                      <a href="tel:+918939000065" style={{ color: "#ffffff", textDecoration: "none", fontWeight: 700 }}>
                        +91 89390 00065
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <MailOutlined style={{ color: "#ea580c", fontSize: 18 }} />
                      <a href="mailto:ajesh@promoterproperty.com" style={{ color: "#ffffff", textDecoration: "none", fontWeight: 600 }}>
                        ajesh@promoterproperty.com
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <ClockCircleOutlined style={{ color: "#10b981", fontSize: 18 }} />
                      <span style={{ color: "#10b981", fontWeight: 700 }}>24 * 7 Service Support</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MAIN CONTENT COLUMN */}
            <div className="col-lg-8">
              
              {/* Overview Card */}
              <div style={{
                background: "#ffffff",
                padding: "32px",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                marginBottom: 30
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                    {iconComponentMap[service.iconName]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      Service Overview
                    </h3>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                      PROMOTER PROPERTY | PRAVARTAK SAMPATTI PRIVATE LIMITED
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "1.02rem", color: "#334155", lineHeight: 1.8, marginBottom: 0 }}>
                  {service.overview}
                </p>
              </div>

              {/* Key Features Grid */}
              <div style={{ marginBottom: 30 }}>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                  Key Capabilities & Deliverables
                </h4>
                <div className="row gy-3">
                  {service.keyFeatures.map((feat, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div style={{
                        background: "#ffffff",
                        padding: 20,
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        height: "100%",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.02)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <CheckCircleOutlined style={{ color: "#ea580c", fontSize: 18 }} />
                          <h6 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {feat.title}
                          </h6>
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Step Process Flowchart */}
              <div style={{
                background: "#ffffff",
                padding: 32,
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                marginBottom: 30
              }}>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>
                  Our 4-Step Execution Workflow
                </h4>
                <div className="row gy-4">
                  {service.process.map((step, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          backgroundColor: "#0f172a",
                          color: "#ea580c",
                          fontWeight: 900,
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {step.step}
                        </div>
                        <div>
                          <h6 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                            {step.title}
                          </h6>
                          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Checklist */}
              <div style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
                padding: 28,
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                marginBottom: 30
              }}>
                <h5 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
                  Why Partner with Promoter Property?
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {service.benefits.map((b, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <CheckCircleOutlined style={{ color: "#10b981", fontSize: 18 }} />
                      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Credentials Box */}
              <div style={{
                background: "#ffffff",
                padding: 24,
                borderRadius: 14,
                border: "1px dashed #ea580c",
                marginBottom: 30
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <FileProtectOutlined style={{ fontSize: 20, color: "#ea580c" }} />
                  <h6 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Official Corporate & Statutory Details
                  </h6>
                </div>
                <div className="row gy-2" style={{ fontSize: "0.85rem", color: "#475569" }}>
                  <div className="col-sm-6"><strong>Company Name:</strong> PROMOTER PROPERTY</div>
                  <div className="col-sm-6"><strong>Billing Name:</strong> PRAVARTAK SAMPATTI PVT LTD</div>
                  <div className="col-sm-6"><strong>RERA Reg No:</strong> TN/AGENT/0087/2023</div>
                  <div className="col-sm-6"><strong>GST No:</strong> 33AAOCP8857H1ZT</div>
                  <div className="col-sm-6"><strong>PAN No:</strong> AAOCP8857H</div>
                  <div className="col-sm-6"><strong>Support:</strong> 24 * 7 Service Support</div>
                </div>
              </div>

              {/* FAQs Accordion */}
              {service.faqs && service.faqs.length > 0 && (
                <div style={{
                  background: "#ffffff",
                  padding: 32,
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  marginBottom: 30
                }}>
                  <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                    Frequently Asked Questions
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {service.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          padding: 16,
                          backgroundColor: activeFaq === idx ? "#f8fafc" : "#ffffff",
                          cursor: "pointer"
                        }}
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                            <QuestionCircleOutlined style={{ color: "#ea580c", marginRight: 8 }} />
                            {faq.q}
                          </span>
                          <span style={{ fontWeight: 900, color: "#64748b" }}>
                            {activeFaq === idx ? "−" : "+"}
                          </span>
                        </div>
                        {activeFaq === idx && (
                          <p style={{ marginTop: 12, marginBottom: 0, fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
                            {faq.a}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Inquiry Form */}
              <div id="serviceForm" style={{
                background: "#ffffff",
                padding: 32,
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)"
              }}>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                  Book {service.title} Consultation
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: 24 }}>
                  Fill out the form below and our dedicated team will contact you within 2 hours.
                </p>

                <form ref={formRef} onSubmit={handleSubmitInquiry}>
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        className="common-input"
                        placeholder="Your Full Name *"
                        required
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="tel"
                        name="phone"
                        className="common-input"
                        placeholder="Phone Number (10 Digits) *"
                        required
                        pattern="[0-9]{10,15}"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="email"
                        name="email"
                        className="common-input"
                        placeholder="Your Email Address *"
                        required
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-12">
                      <textarea
                        name="message"
                        className="common-input"
                        placeholder={`Tell us about your requirements for ${service.title}...`}
                        rows="4"
                        required
                        style={{ borderRadius: 8 }}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-main w-100 py-3 fw-bold"
                        style={{ borderRadius: 10, fontSize: "1rem" }}
                      >
                        {submitting ? "Submitting Inquiry..." : `Send ${service.title} Request`} <SendOutlined style={{ marginLeft: 8 }} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServiceDetails;
