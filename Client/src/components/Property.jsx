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
  Rate
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

const { Text, Title } = Typography;

// PropertyItem Component with ENTIRE CARD CLICKABLE + View Details Button
const PropertyItem = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Enhanced Indian Price Formatting
  const formatPriceToIndian = (priceString) => {
    if (!priceString) return '₹0';
    
    const cleanPrice = priceString.toString().toLowerCase().trim();
    const priceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k|thousand)?/);
    
    if (!priceMatch) return `₹${priceString}`;
    
    const [, numberStr, unit] = priceMatch;
    const number = parseFloat(numberStr);
    
    if (isNaN(number)) return `₹${priceString}`;
    
    if (unit) {
      switch (unit) {
        case 'cr':
        case 'crore':
          return number >= 10 ? `₹${Math.round(number)} Cr` : `₹${number.toFixed(1)} Cr`;
        case 'l':
        case 'lakh':
          return `₹${number} L`;
        case 'k':
        case 'thousand':
          return `₹${number}K`;
        default:
          return `₹${new Intl.NumberFormat('en-IN').format(number)}`;
      }
    }
    
    return number >= 100 ? `₹${number} Cr` : `₹${number} L`;
  };

  // Calculate price per sqft
  const getPricePerSqft = () => {
    const carpetArea = property.carpetArea || property.totalArea;
    if (!carpetArea || !property.priceRange) return null;

    const priceStr = property.priceRange.toLowerCase();
    const priceMatch = priceStr.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh)?/);
    
    if (priceMatch) {
      const [, numberStr, unit] = priceMatch;
      const number = parseFloat(numberStr);
      
      let priceInRupees = 0;
      switch (unit) {
        case 'cr':
        case 'crore':
          priceInRupees = number * 10000000;
          break;
        case 'l':
        case 'lakh':
          priceInRupees = number * 100000;
          break;
        default:
          priceInRupees = number * 10000000;
      }
      
      const pricePerSqft = Math.round(priceInRupees / parseInt(carpetArea));
      return `₹${new Intl.NumberFormat('en-IN').format(pricePerSqft)}/sq ft`;
    }
    return null;
  };

  // Format location
  const getFormattedLocation = () => {
    const locationParts = [
      property.suburb,
      property.city, 
      property.district,
      property.state
    ].filter(Boolean);
    
    return locationParts.join(', ') || property.city || 'Prime Location';
  };

  // Get developer name
  const getDeveloperName = () => {
    return property.developerInfo?.developerName || 'Premium Developer';
  };

  // Handle card click
  const handleCardClick = () => {
    window.location.href = `/property/details/${property.id}`;
  };

  return (
    <div className="property-card-container" onClick={handleCardClick}>
      <Card
        className="property-card-aligned"
        hoverable
        bordered={false}
        cover={
          <div className="property-image-container">
            <div className="image-wrapper">
              {!imageLoaded && (
                <div className="image-placeholder">
                  <Spin />
                </div>
              )}
              <img
                alt={property.title}
                src={`${url.IMAGE_URL}/${property.coverPhoto}`}
                className="property-main-image"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x240/f0f0f0/666?text=No+Image';
                }}
              />
            </div>

            {/* Overlay Stats */}
            <div className="image-overlay">
              <div className="overlay-stats">
                <Tag className="stat-tag">
                  <CameraOutlined /> {(property.images?.length || 0) + 1}
                </Tag>
                <Tag className="stat-tag">
                  <EyeOutlined /> {Math.floor(Math.random() * 500) + 100}
                </Tag>
              </div>
            </div>

            {/* Favorite Button */}
            <div className="favorite-button">
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
              />
            </div>
          </div>
        }
      >
        {/* Card Content with Fixed Heights */}
        <div className="card-content">
          {/* Developer Section */}
          <div className="developer-section">
            <div className="developer-info">
              <Space size="small">
                <Avatar size="small" icon={<BuildOutlined />} className="developer-avatar" />
                <Text className="developer-name">{getDeveloperName()}</Text>
              </Space>
              <Rate 
                disabled 
                defaultValue={4.2} 
                allowHalf 
                className="developer-rating"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="location-section">
            <Text className="location-text" ellipsis>
              <EnvironmentOutlined className="location-icon" />
              {getFormattedLocation()}
            </Text>
          </div>

          {/* Title Section */}
          <div className="title-section">
            <Title level={5} className="property-title" ellipsis={{ rows: 2 }}>
              {property.title}
            </Title>
          </div>

          {/* Description Section */}
          <div className="description-section">
            {property.shortDescription && (
              <Text className="property-description" ellipsis={{ rows: 2 }}>
                {property.shortDescription}
              </Text>
            )}
          </div>

          {/* Price Section */}
          <div className="price-section">
            <div className="price-container">
              <div className="main-price">
                {formatPriceToIndian(property.priceRange)}
              </div>
              {getPricePerSqft() && (
                <div className="price-per-sqft">
                  {getPricePerSqft()}
                </div>
              )}
              <Tag size="small" color="green" className="budget-tag">
                {property.budgetType || 'Total Price'}
              </Tag>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-item bedrooms">
              <div className="feature-icon">
                <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
              </div>
              <div className="feature-details">
                <div className="feature-number">{property.bedrooms || 2}</div>
                <div className="feature-label">Bedrooms</div>
              </div>
            </div>
            
            <div className="feature-item bathrooms">
              <div className="feature-icon">
                <span style={{ fontSize: '16px' }}>🚿</span>
              </div>
              <div className="feature-details">
                <div className="feature-number">{property.bathrooms || 1}</div>
                <div className="feature-label">Bathrooms</div>
              </div>
            </div>

            <div className="feature-item area">
              <div className="feature-icon">
                <AreaChartOutlined style={{ fontSize: '16px', color: '#fa8c16' }} />
              </div>
              <div className="feature-details">
                <div className="feature-number">
                  {parseInt(property.carpetArea || property.totalArea || 1200).toLocaleString('en-IN')}
                </div>
                <div className="feature-label">Sq Ft</div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="tags-section">
            <Space wrap size="small">
              {property.furnishedStatus && (
                <Tag size="small" color="blue" icon={<HomeOutlined />}>
                  {property.furnishedStatus}
                </Tag>
              )}
              {property.facing && (
                <Tag size="small" color="purple" icon={<CompassOutlined />}>
                  {property.facing}
                </Tag>
              )}
              {property.parkingAvailable && (
                <Tag size="small" color="green" icon={<CarOutlined />}>
                  Parking
                </Tag>
              )}
            </Space>
          </div>

          {/* Action Buttons - WITH VIEW DETAILS BUTTON */}
          <div className="action-section">
            {/* View Details Button */}
            <Button
              type="primary"
              block
              size="large"
              className="view-details-button"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Optional: prevents double navigation
                window.location.href = `/property/details/${property.id}`;
              }}
            >
              View Full Details
            </Button>
            
            {/* Contact Buttons */}
            <div className="contact-buttons">
              <Button
                size="middle"
                icon={<PhoneOutlined />}
                className="contact-btn call-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:+918939000065`);
                }}
              >
                Call Now
              </Button>
              <Button
                size="middle"
                icon={<WhatsAppOutlined />}
                className="contact-btn whatsapp-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const message = encodeURIComponent(`Hi, I'm interested in ${property.title}`);
                  window.open(`https://wa.me/918939000065?text=${message}`);
                }}
              >
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer">
            <Space className="footer-content">
              <Text className="posted-date">
                <CalendarOutlined style={{ marginRight: '4px' }} />
                Posted {Math.floor((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24))} days ago
              </Text>
              <Text className="property-id">ID: #{property.id}</Text>
              {property.approvalStatus === 'approved' && (
                <Tag size="small" color="success" icon={<CheckCircleOutlined />}>
                  Verified
                </Tag>
              )}
            </Space>
          </div>
        </div>
      </Card>

      {/* Perfect Alignment Styles */}
      <style>{`
        .property-card-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .property-card-aligned {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          border-radius: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          overflow: hidden !important;
          background: #ffffff !important;
          border: 1px solid #f0f0f0 !important;
        }

        .property-card-aligned:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-4px) !important;
          border-color: #1890ff !important;
        }

        .property-card-aligned .ant-card-body {
          padding: 0 !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .property-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .property-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .property-card-aligned:hover .property-main-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
          padding: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .property-card-aligned:hover .image-overlay {
          opacity: 1;
        }

        .overlay-stats {
          display: flex;
          gap: 8px;
        }

        .stat-tag {
          background: rgba(255, 255, 255, 0.9) !important;
          color: rgba(0, 0, 0, 0.85) !important;
          border: none !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }

        .favorite-button {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
        }

        .favorite-btn {
          background: rgba(255, 255, 255, 0.95) !important;
          border: none !important;
          width: 32px !important;
          height: 32px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          transition: all 0.3s ease !important;
        }

        .favorite-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }

        .favorite-btn.favorited {
          background: #ff4d4f !important;
          color: white !important;
        }

        .card-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .developer-section {
          height: 24px;
        }

        .developer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .developer-avatar {
          background-color: #1890ff !important;
        }

        .developer-name {
          color: #1890ff !important;
          font-weight: 600 !important;
          font-size: 12px !important;
        }

        .developer-rating {
          font-size: 10px !important;
        }

        .location-section {
          height: 20px;
        }

        .location-text {
          color: #666 !important;
          font-size: 12px !important;
          display: block;
        }

        .location-icon {
          color: #ff4d4f;
          margin-right: 4px;
          font-size: 13px;
        }

        .title-section {
          height: 48px;
          display: flex;
          align-items: flex-start;
        }

        .property-title {
          margin: 0 !important;
          font-size: 16px !important;
          line-height: 1.4 !important;
          color: #262626 !important;
          font-weight: 600 !important;
        }

        .description-section {
          height: 36px;
          display: flex;
          align-items: flex-start;
        }

        .property-description {
          color: #8c8c8c !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }

        .price-section {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .price-container {
          background: linear-gradient(135deg, #f6ffed, #e6f7ff);
          border: 1px solid #d9f7be;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          width: 100%;
        }

        .main-price {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #389e0d !important;
          line-height: 1;
          margin-bottom: 4px;
        }

        .price-per-sqft {
          font-size: 11px !important;
          color: #1890ff !important;
          font-weight: 600 !important;
          margin-bottom: 4px;
        }

        .budget-tag {
          font-size: 10px !important;
        }

        .features-grid {
          height: 70px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .feature-item {
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          padding: 10px 6px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .property-card-container:hover .feature-item {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .feature-item.bedrooms {
          background: linear-gradient(135deg, #e6f7ff, #f0f8ff);
          border-color: #91d5ff;
        }

        .feature-item.bathrooms {
          background: linear-gradient(135deg, #f6ffed, #f0f9ff);
          border-color: #b7eb8f;
        }

        .feature-item.area {
          background: linear-gradient(135deg, #fff7e6, #fffbf0);
          border-color: #ffd591;
        }

        .feature-icon {
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-details {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feature-number {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #262626 !important;
          line-height: 1;
        }

        .feature-label {
          font-size: 10px !important;
          color: #8c8c8c !important;
          line-height: 1;
          font-weight: 500 !important;
        }

        .tags-section {
          height: 26px;
          display: flex;
          align-items: flex-start;
        }

        .tags-section .ant-tag {
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 2px 8px !important;
        }

        .action-section {
          height: 80px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }

        .view-details-button {
          background: linear-gradient(135deg, #1890ff, #096dd9) !important;
          border: none !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          height: 38px !important;
          font-size: 13px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
        }

        .view-details-button:hover {
          background: linear-gradient(135deg, #096dd9, #0050b3) !important;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3) !important;
        }

        .contact-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .contact-btn {
          font-size: 11px !important;
          font-weight: 600 !important;
          border-radius: 4px !important;
          height: 30px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 4px !important;
        }

        .call-btn {
          background: #f6ffed !important;
          border-color: #52c41a !important;
          color: #389e0d !important;
        }

        .call-btn:hover {
          background: #52c41a !important;
          color: white !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3) !important;
        }

        .whatsapp-btn {
          background: #fff7e6 !important;
          border-color: #25d366 !important;
          color: #128c7e !important;
        }

        .whatsapp-btn:hover {
          background: #25d366 !important;
          color: white !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3) !important;
        }

        .card-footer {
          height: 22px;
          border-top: 1px solid #f0f0f0;
          padding-top: 8px;
          margin-top: auto;
        }

        .footer-content {
          width: 100%;
          justify-content: space-between;
          font-size: 10px !important;
          color: #8c8c8c !important;
        }

        .posted-date,
        .property-id {
          font-size: 10px !important;
          color: #8c8c8c !important;
          display: inline-flex !important;
          align-items: center !important;
        }

        .footer-content .ant-tag {
          margin: 0 !important;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .card-content {
            padding: 12px;
            gap: 8px;
          }

          .main-price {
            font-size: 20px !important;
          }

          .features-grid {
            height: 60px;
          }

          .action-section {
            height: 75px;
          }
        }

        /* Ensure all cards have equal height in grid */
        @media (min-width: 576px) {
          .property-card-container {
            min-height: 620px;
          }
        }

        @media (min-width: 768px) {
          .property-card-container {
            min-height: 640px;
          }
        }

        @media (min-width: 1200px) {
          .property-card-container {
            min-height: 650px;
          }
        }
      `}</style>
    </div>
  );
};

// Main PropertyGrid Component (UNCHANGED)
const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${url.API_URL}/public/properties`, {
      params: { page: 1, limit: 9, sortBy: "createdAt", order: "desc" }
    }).then(res => {
      if (res.data.status === "success") setProperties(res.data.data.properties);
    }).catch(() => {
      message.error("Failed to fetch properties.");
    }).finally(() => setLoading(false));
  }, []);

  return (
    <section className="property-page-section">
      <div className="container container-two">
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

        {/* Properties Grid with Perfect Alignment */}
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
                  md={12}
                  lg={8}
                  xl={6}
                  className="property-grid-item"
                >
                  <PropertyItem property={property} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* View More Link */}
        <div style={{ textAlign: 'center', margin: '36px 0 0 0' }}>
          <a href='/property' style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#1890ff',
            textDecoration: 'none',
            padding: '12px 32px',
            border: '2px solid #1890ff',
            borderRadius: '8px',
            display: 'inline-block',
            transition: 'all 0.3s'
          }}>
            View More Properties →
          </a>
        </div>
      </div>

      {/* Global Styles for Perfect Alignment */}
      <style>{`
        .property-page-section {
          background: linear-gradient(135deg, #f0f8ff 0%, #f6ffed 100%);
          min-height: 100vh;
          padding: 40px 0;
        }

        .container-two {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .properties-grid-container {
          margin: 24px 0;
        }

        .properties-main-grid {
          margin: 0 !important;
        }

        .property-grid-item {
          display: flex !important;
          height: 100% !important;
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
        }

        @media (min-width: 1400px) {
          .container-two {
            max-width: 1600px;
          }
        }

        /* Ensure equal heights for all cards */
        .properties-main-grid > .ant-col {
          display: flex !important;
        }

        .properties-main-grid > .ant-col > div {
          width: 100% !important;
        }
      `}</style>
    </section>
  );
};

export default PropertyGrid;
