import React, { useState, useEffect } from 'react';
import {
  message,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Avatar,
  Rate, Tooltip
} from 'antd';
import {
  EnvironmentOutlined,
  HomeOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  CameraOutlined,
  AreaChartOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  BuildOutlined,
  CarOutlined,
  CompassOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import axios from 'axios';
import url from '../url';
import PropertyCard from './common/PropertyCard';

const { Text, Title } = Typography;

const PropertyItem = ({ property }) => {
  return <PropertyCard property={property} />;
};

// Main PropertyGrid Component (UNCHANGED)
const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${url.API_URL}/public/properties`, {
      params: { page: 1, limit: 50, sortBy: "createdAt", order: "desc" }
    }).then(res => {
      if (res.data.status === "success" && Array.isArray(res.data.data.properties)) {
        const allProps = res.data.data.properties;
        const shuffled = [...allProps].sort(() => 0.5 - Math.random());
        setProperties(shuffled.slice(0, 4));
      }
    }).catch(() => {
      message.error("Failed to fetch properties.");
    }).finally(() => setLoading(false));
  }, []);

  return (
    <section className="property-page-section">
      <div className="container container-two">
        {/* SEO Section Header */}
        <div className="section-header-wrap">
          <span className="section-subtitle-tag">FEATURED PROPERTIES</span>
          <h2 className="section-title-heading">
            Our Premium <span className="highlight-text">Properties</span>
          </h2>
          <p className="section-description-text">
            Explore handpicked luxury apartments, villas, and commercial properties in prime locations.
          </p>
        </div>

        {/* Loading State */}
        {loading && properties.length === 0 && (
          <Card className="loading-state-card">
            <div className="loading-content">
              <Spin size="large" />
              <Title level={4}>Loading Properties...</Title>
              <Text>Finding the best matches for you</Text>
            </div>
          </Card>
        )}

        {/* Properties Grid (4 per row) */}
        {properties.length > 0 && (
          <div className="properties-grid-container">
            <Row
              gutter={[24, 24]}
              className="properties-main-grid"
            >
              {properties.map((property, index) => (
                <Col
                  key={property.id || `property-${index}`}
                  xs={24}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  className="property-grid-item"
                >
                  <PropertyItem property={property} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* View All Properties Link */}
        <div style={{ textAlign: 'center', margin: '36px 0 0 0' }}>
          <a href='/property' style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#ffffff',
            backgroundColor: '#ea580c',
            backgroundImage: 'linear-gradient(135deg, #f97316, #ea580c)',
            textDecoration: 'none',
            padding: '12px 36px',
            borderRadius: '8px',
            display: 'inline-block',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
            transition: 'all 0.3s'
          }}>
            View All Properties →
          </a>
        </div>
      </div>

      {/* Global Styles for Perfect Alignment */}
      <style>{`
        .property-page-section {
          background: linear-gradient(135deg, #fafafa 0%, #fff7ed 100%);
          min-height: 100vh;
          padding: 40px 0;
        }

        .container-two {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header-wrap {
          text-align: center;
          margin-bottom: 32px;
        }

        .section-subtitle-tag {
          display: inline-block;
          background: #fff7ed;
          color: #ea580c;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 20px;
          border: 1px solid #ffedd5;
          margin-bottom: 8px;
        }

        .section-title-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 6px 0 10px 0;
          line-height: 1.2;
        }

        .section-title-heading .highlight-text {
          background: linear-gradient(135deg, #f97316, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-description-text {
          font-size: 1rem;
          color: #4b5563;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .properties-grid-container {
          margin: 24px 0;
        }

        .properties-main-grid {
          margin: 0 !important;
        }

        .property-grid-item {
          display: flex !important;
          flex-direction: column !important;
        }

        .loading-state-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          margin: 40px 0 !important;
          text-align: center !important;
        }

        .loading-content {
          padding: 40px;
        }

        /* Responsive Grid System */
        @media (max-width: 576px) {
          .container-two {
            padding: 0 16px;
          }
          
          .properties-main-grid .ant-col {
            margin-bottom: 24px !important;
          }

          .section-title-heading {
            font-size: 1.75rem;
          }
        }

        @media (min-width: 1400px) {
          .container-two {
            max-width: 1600px;
          }
        }

        /* Ensure equal heights for all cards */
        .properties-main-grid > .ant-col {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
        }

        .properties-main-grid > .ant-col > div {
          width: 100% !important;
          flex: 1 !important;
        }
      `}</style>
    </section>
  );
};

export default PropertyGrid;
