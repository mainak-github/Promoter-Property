import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import PageTitle from "../common/PageTitle";
import { servicesData } from "../data/ServiceData";

import {
  BulbOutlined,
  SafetyOutlined,
  CompassOutlined,
  BankOutlined,
  AppstoreOutlined,
  BuildOutlined,
  ShopOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const iconComponentMap = {
  BulbOutlined: <BulbOutlined style={{ fontSize: 32, color: "#ea580c" }} />,
  SafetyOutlined: <SafetyOutlined style={{ fontSize: 32, color: "#4f46e5" }} />,
  CompassOutlined: <CompassOutlined style={{ fontSize: 32, color: "#059669" }} />,
  BankOutlined: <BankOutlined style={{ fontSize: 32, color: "#c2410c" }} />,
  AppstoreOutlined: <AppstoreOutlined style={{ fontSize: 32, color: "#7c3aed" }} />,
  BuildOutlined: <BuildOutlined style={{ fontSize: 32, color: "#db2777" }} />,
  ShopOutlined: <ShopOutlined style={{ fontSize: 32, color: "#2563eb" }} />
};

const ServicesPage = () => {
  return (
    <>
      <PageTitle title="Our Real Estate Services | Promoter Property" />
      <Header />
      <Breadcrumb pageTitle="Our Services" />

      {/* --- HERO BANNER --- */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", padding: "60px 0" }}>
        <div className="container container-two text-center">
          <span style={{
            display: "inline-block",
            padding: "6px 20px",
            borderRadius: 50,
            backgroundColor: "rgba(234, 88, 12, 0.2)",
            color: "#ea580c",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            marginBottom: 16,
            border: "1px solid rgba(234, 88, 12, 0.3)"
          }}>
            PRAVARTAK SAMPATTI PRIVATE LIMITED
          </span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>
            Comprehensive Real Estate & Property Solutions
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: 780, margin: "0 auto 0 auto", lineHeight: 1.7 }}>
            From brand marketing and legal title search to home loans, turnkey construction, and commercial leasing — we deliver 360° real estate excellence across Tamil Nadu.
          </p>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section style={{ backgroundColor: "#f8fafc", padding: "80px 0" }}>
        <div className="container container-two">
          <div className="row gy-4">
            {servicesData.map((service) => (
              <div className="col-lg-4 col-md-6" key={service.id}>
                <div style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: 32,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}>
                  <div>
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      backgroundColor: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      border: "1px solid #e2e8f0"
                    }}>
                      {iconComponentMap[service.iconName]}
                    </div>
                    
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#ea580c",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: 6
                    }}>
                      {service.badge}
                    </span>

                    <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                      {service.title}
                    </h4>

                    <p style={{ fontSize: "0.92rem", color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
                      {service.shortDesc}
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", fontSize: "0.85rem", color: "#334155" }}>
                      {service.keyFeatures.slice(0, 3).map((feat, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <CheckCircleOutlined style={{ color: "#10b981", fontSize: 14 }} />
                          <span>{feat.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={`/services/${service.slug}`}
                    className="btn btn-outline-main w-100 fw-bold py-2"
                    style={{ borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span>Explore {service.title}</span>
                    <ArrowRightOutlined />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORPORATE STATUTORY BANNER --- */}
      <section style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "50px 0" }}>
        <div className="container container-two">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <h3 style={{ color: "#ffffff", fontWeight: 800, marginBottom: 8 }}>
                PROMOTER PROPERTY
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
                Billing Name: <strong>PRAVARTAK SAMPATTI PRIVATE LIMITED</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14, fontSize: "0.88rem", color: "#cbd5e1" }}>
                <span><strong>RERA Reg:</strong> TN/AGENT/0087/2023</span>
                <span><strong>GSTIN:</strong> 33AAOCP8857H1ZT</span>
                <span><strong>PAN:</strong> AAOCP8857H</span>
                <span><strong>Support:</strong> 24 * 7 Services</span>
              </div>
            </div>
            <div className="col-lg-5 text-lg-end">
              <Link to="/contact" className="btn btn-main fw-bold px-4 py-3" style={{ borderRadius: 10 }}>
                Contact Our Support Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServicesPage;
