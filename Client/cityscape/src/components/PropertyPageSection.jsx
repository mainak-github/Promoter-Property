import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  message, 
  Spin, 
  Empty, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tooltip, 
  Badge, 
  Affix,
  Space,
  Divider,
  Avatar,
  Rate,
  Progress,
  FloatButton,
  BackTop,
  Drawer,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  ReloadOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CalendarOutlined,
  StarFilled,
  PhoneOutlined,
  WhatsAppOutlined,
  CameraOutlined,
  AreaChartOutlined,
  BankOutlined,
  CarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  RightOutlined,
  LeftOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  UserOutlined,
  DollarCircleOutlined,
  BuildOutlined
} from '@ant-design/icons';
import axios from 'axios';
import url from '../url';

const { Option } = Select;
const { Text, Title } = Typography;
const { Meta } = Card;

// Fixed PropertyItem Component with Perfect Alignment
const PropertyItem = ({ property, itemClass, btnClass, badgeText, badgeClass, iconsClass }) => {
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

  return (
    <div className="property-card-container">
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
                  <CameraOutlined /> {property.images?.length || 0}
                </Tag>
                <Tag className="stat-tag">
                  <EyeOutlined /> {Math.floor(Math.random() * 500) + 100}
                </Tag>
              </div>
            </div>

            {/* Status Badge */}
            <div className="status-badge">
              <Badge 
                count={property.status || 'FOR SALE'} 
                style={{ 
                  backgroundColor: property.status === 'Ready to Move In' ? '#52c41a' : '#1890ff',
                  fontSize: '10px',
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* Favorite Button */}
            <div className="favorite-button">
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<HeartOutlined />}
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

          {/* Features Grid - Fixed Height */}
          <div className="features-grid">
            <div className="feature-item bedrooms">
              <div className="feature-icon">
                <HomeOutlined />
              </div>
              <div className="feature-details">
                <div className="feature-number">{property.bedrooms || 2}</div>
                <div className="feature-label">BHK</div>
              </div>
            </div>
            
            <div className="feature-item bathrooms">
              <div className="feature-icon">🚿</div>
              <div className="feature-details">
                <div className="feature-number">{property.bathrooms || 1}</div>
                <div className="feature-label">Bath</div>
              </div>
            </div>

            <div className="feature-item area">
              <div className="feature-icon">
                <AreaChartOutlined />
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
                <Tag size="small" color="blue">🏠 {property.furnishedStatus}</Tag>
              )}
              {property.facing && (
                <Tag size="small" color="purple">🧭 {property.facing}</Tag>
              )}
              {property.parkingAvailable && (
                <Tag size="small" color="green">🚗 Parking</Tag>
              )}
            </Space>
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            <Button
              type="primary"
              block
              size="large"
              className="view-details-button"
              onClick={() => window.location.href = `/property/details/${property.id}`}
            >
              View Full Details
            </Button>
            
            <div className="contact-buttons">
              <Button
                size="middle"
                icon={<PhoneOutlined />}
                className="contact-btn call-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:+91${Math.floor(Math.random() * 9000000000) + 1000000000}`);
                }}
              >
                Call
              </Button>
              <Button
                size="middle"
                icon={<WhatsAppOutlined />}
                className="contact-btn whatsapp-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const message = encodeURIComponent(`Hi, I'm interested in ${property.title}`);
                  window.open(`https://wa.me/91${Math.floor(Math.random() * 9000000000) + 1000000000}?text=${message}`);
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
                Posted {Math.floor((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24))} days ago
              </Text>
              <Text className="property-id">ID: {property.id}</Text>
              {property.approvalStatus === 'approved' && (
                <Tag size="small" color="success">Verified</Tag>
              )}
            </Space>
          </div>
        </div>
      </Card>

      {/* Perfect Alignment Styles */}
      <style jsx>{`
        .property-card-container {
          height: 100%;
          display: flex;
          flex-direction: column;
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

        .status-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 2;
        }

        .favorite-button {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
        }

        .favorite-btn {
          background: rgba(255, 255, 255, 0.9) !important;
          border: none !important;
          width: 28px !important;
          height: 28px !important;
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
          color: #8c8c8c;
          margin-right: 4px;
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
          height: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .feature-item {
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          padding: 8px 4px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
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
          font-size: 14px;
          color: #1890ff;
        }

        .feature-details {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feature-number {
          font-size: 12px !important;
          font-weight: 700 !important;
          color: #262626 !important;
          line-height: 1;
        }

        .feature-label {
          font-size: 10px !important;
          color: #8c8c8c !important;
          line-height: 1;
        }

        .tags-section {
          height: 24px;
          display: flex;
          align-items: flex-start;
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
          height: 36px !important;
          font-size: 13px !important;
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
          height: 28px !important;
        }

        .call-btn {
          background: #f6ffed !important;
          border-color: #52c41a !important;
          color: #389e0d !important;
        }

        .call-btn:hover {
          background: #52c41a !important;
          color: white !important;
        }

        .whatsapp-btn {
          background: #fff7e6 !important;
          border-color: #fa8c16 !important;
          color: #d46b08 !important;
        }

        .whatsapp-btn:hover {
          background: #fa8c16 !important;
          color: white !important;
        }

        .card-footer {
          height: 20px;
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
            height: 50px;
          }

          .action-section {
            height: 70px;
          }
        }

        /* Ensure all cards have equal height in grid */
        @media (min-width: 576px) {
          .property-card-container {
            min-height: 600px;
          }
        }

        @media (min-width: 768px) {
          .property-card-container {
            min-height: 620px;
          }
        }

        @media (min-width: 1200px) {
          .property-card-container {
            min-height: 640px;
          }
        }
      `}</style>
    </div>
  );
};

// Filter Form Component (keeping previous implementation)
const PropertyFilterForm = ({ onFilterChange, loading }) => {
  const [dynamicOptions, setDynamicOptions] = useState({
    cities: [],
    propertyTypes: []
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${url.API_URL}/public/properties?page=1&limit=100`);
        if (response.data.status === "success") {
          const properties = response.data.data.properties;
          
          const cities = [...new Set(properties.map(p => p.city).filter(Boolean))].sort();
          const propertyTypes = [...new Set(properties.map(p => p.propertyType).filter(Boolean))].sort();
          
          setDynamicOptions({ cities, propertyTypes });
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      searchKeyword: '',
      propertyType: '',
      city: '',
      bedrooms: '',
      status: ''
    },
    onSubmit: (values) => {
      onFilterChange(values);
      message.success('Search filters applied successfully!');
    }
  });

  const clearFilters = () => {
    formik.resetForm();
    onFilterChange({});
    message.info('Filters cleared');
  };

  return (
    <Card className="filter-main-card" bordered={false}>
      <div className="filter-header-section">
        <Title level={4} className="filter-main-title">
          <SearchOutlined className="me-2" />
          Find Your Perfect Property
        </Title>
        <Text className="filter-subtitle">
          Search through 153 verified properties
        </Text>
      </div>
      
      <form onSubmit={formik.handleSubmit}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Input
              size="large"
              placeholder="Search properties..."
              prefix={<SearchOutlined />}
              value={formik.values.searchKeyword}
              onChange={(e) => formik.setFieldValue('searchKeyword', e.target.value)}
              className="search-input-main"
              allowClear
            />
          </Col>
          
          <Col xs={12} md={4}>
            <Select
              size="large"
              placeholder="Property Type"
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue('propertyType', value)}
              className="w-100"
              allowClear
            >
              {dynamicOptions.propertyTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={12} md={4}>
            <Select
              size="large"
              placeholder="City"
              value={formik.values.city}
              onChange={(value) => formik.setFieldValue('city', value)}
              className="w-100"
              allowClear
            >
              {dynamicOptions.cities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={12} md={4}>
            <Select
              size="large"
              placeholder="BHK"
              value={formik.values.bedrooms}
              onChange={(value) => formik.setFieldValue('bedrooms', value)}
              className="w-100"
              allowClear
            >
              <Option value="1">1 BHK</Option>
              <Option value="2">2 BHK</Option>
              <Option value="3">3 BHK</Option>
              <Option value="4">4+ BHK</Option>
            </Select>
          </Col>
          
          <Col xs={12} md={6}>
            <Space size="small" className="w-100">
              <Button 
                type="primary" 
                size="large"
                htmlType="submit" 
                loading={loading}
                icon={<SearchOutlined />}
                className="search-main-btn"
              >
                Search
              </Button>
              <Button 
                size="large"
                onClick={clearFilters}
                icon={<ClearOutlined />}
                className="clear-main-btn"
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </form>

      <style jsx>{`
        .filter-main-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          margin-bottom: 24px !important;
          border: 1px solid #e6f7ff !important;
        }

        .filter-header-section {
          margin-bottom: 20px;
          text-align: center;
        }

        .filter-main-title {
          margin: 0 !important;
          color: #262626 !important;
          font-size: 22px !important;
        }

        .filter-subtitle {
          color: #8c8c8c !important;
          font-size: 14px !important;
        }

        .search-input-main {
          border-radius: 8px !important;
          border: 1px solid #d9d9d9 !important;
        }

        .search-main-btn {
          background: linear-gradient(135deg, #1890ff, #096dd9) !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        .clear-main-btn {
          border-radius: 8px !important;
          border-color: #d9d9d9 !important;
          font-weight: 600 !important;
        }
      `}</style>
    </Card>
  );
};

// Main PropertyPageSection Component with Perfect Grid Alignment
const PropertyPageSection = () => {
  // State Management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    itemsPerPage: 12
  });

  // Build API Parameters
  const buildApiParams = useCallback((page = 1, customFilters = {}) => {
    const params = { page, limit: pagination.itemsPerPage };
    const activeFilters = { ...filters, ...customFilters };

    if (activeFilters.searchKeyword) params.search = activeFilters.searchKeyword;
    if (activeFilters.propertyType) params.propertyType = activeFilters.propertyType;
    if (activeFilters.city) params.city = activeFilters.city;
    if (activeFilters.bedrooms) params.bedrooms = activeFilters.bedrooms;
    if (activeFilters.status) params.status = activeFilters.status;

    return params;
  }, [filters, pagination.itemsPerPage]);

  // Fetch Properties
  const fetchProperties = useCallback(async (page = 1, customFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = buildApiParams(page, customFilters);
      const response = await axios.get(`${url.API_URL}/public/properties`, { params });

      if (response.data.status === "success") {
        const { properties: fetchedProperties, pagination: paginationData } = response.data.data;
        
        setProperties(fetchedProperties);
        setPagination({
          currentPage: page,
          totalPages: paginationData?.totalPages || 1,
          totalCount: paginationData?.total || 0,
          itemsPerPage: 12
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch properties');
      setProperties([]);
      setPagination(prev => ({ ...prev, totalCount: 0, totalPages: 1 }));
      message.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [buildApiParams]);

  // Handle Filter Changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Handle Page Changes
  const handlePageChange = useCallback((newPage) => {
    if (newPage !== pagination.currentPage && !loading) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      document.querySelector('.property-page-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [pagination.currentPage, loading]);

  // Effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProperties(pagination.currentPage, filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchProperties(1);
  }, []);

  return (
    <section className="property-page-section">
      <div className="container container-two">
        {/* Filter Form */}
        <PropertyFilterForm 
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Results Header */}
        <Card className="results-header-main" bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <div className="results-info">
                <Title level={4} className="results-count">
                  {pagination.totalCount} Properties Found
                </Title>
                <Text className="results-desc">
                  Discover your perfect property investment
                </Text>
              </div>
            </Col>
            
            <Col>
              <Space size="middle" className="header-controls">
                <div className="stats-display">
                  <Statistic 
                    title="Average Price" 
                    value="2.5" 
                    suffix="Cr"
                    valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                  />
                </div>
                
                <div className="stats-display">
                  <Statistic 
                    title="New This Week" 
                    value="15" 
                    valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                  />
                </div>

                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  size="large"
                  style={{ width: 180 }}
                  className="sort-selector"
                >
                  <Option value="newest">🕒 Newest First</Option>
                  <Option value="oldest">📅 Oldest First</Option>
                  <Option value="price-low">💰 Price: Low to High</Option>
                  <Option value="price-high">💎 Price: High to Low</Option>
                </Select>

                <Button.Group size="large" className="view-toggle-group">
                  <Button 
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                    icon={<AppstoreOutlined />}
                  >
                    Grid
                  </Button>
                  <Button 
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                    icon={<UnorderedListOutlined />}
                  >
                    List
                  </Button>
                </Button.Group>
              </Space>
            </Col>
          </Row>
        </Card>

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
                  sm={viewMode === 'grid' ? 12 : 24} 
                  md={viewMode === 'grid' ? 12 : 24}
                  lg={viewMode === 'grid' ? 8 : 24}
                  xl={viewMode === 'grid' ? 6 : 24}
                  className="property-grid-item"
                >
                  <PropertyItem 
                    property={property}
                    itemClass="property-item-aligned"
                    btnClass="property-btn-styled"
                    badgeText={property.status}
                    badgeClass="property-badge-styled"
                    iconsClass="property-icons-styled"
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <Card className="empty-state-card">
            <Empty
              description="No properties found"
            >
              <Button type="primary" onClick={() => handleFilterChange({})}>
                Clear Filters
              </Button>
            </Empty>
          </Card>
        )}

        {/* Pagination */}
        {properties.length > 0 && pagination.totalPages > 1 && (
          <Card className="pagination-main-card">
            <Row justify="space-between" align="middle">
              <Col>
                <Text strong>
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of {pagination.totalCount} properties
                </Text>
              </Col>
              
              <Col>
                <Space>
                  <Button 
                    disabled={pagination.currentPage === 1 || loading}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    icon={<LeftOutlined />}
                    size="large"
                  >
                    Previous
                  </Button>
                  
                  <div className="page-indicator">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  
                  <Button 
                    disabled={pagination.currentPage >= pagination.totalPages || loading}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    size="large"
                  >
                    Next
                    <RightOutlined />
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}
      </div>

      {/* Global Styles for Perfect Alignment */}
      <style jsx global>{`
        .property-page-section {
          background: linear-gradient(135deg, #f0f8ff 0%, #f6ffed 100%);
          min-height: 100vh;
          padding: 20px 0;
        }

        .container-two {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .results-header-main {
          background: rgba(255, 255, 255, 0.95) !important;
          border-radius: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          margin-bottom: 24px !important;
          border: 1px solid #e6f7ff !important;
        }

        .results-info {
          text-align: left;
        }

        .results-count {
          margin: 0 !important;
          color: #262626 !important;
          font-size: 20px !important;
        }

        .results-desc {
          color: #8c8c8c !important;
        }

        .header-controls {
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .stats-display {
          text-align: center;
          min-width: 80px;
        }

        .sort-selector {
          min-width: 160px;
        }

        .view-toggle-group {
          border-radius: 8px !important;
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

        .loading-state-card,
        .empty-state-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          margin: 40px 0 !important;
          text-align: center !important;
        }

        .loading-content {
          padding: 40px;
        }

        .pagination-main-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border-radius: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          margin-top: 32px !important;
          border: 1px solid #e6f7ff !important;
        }

        .page-indicator {
          background: #f0f8ff;
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #91d5ff;
          font-weight: 600;
          color: #1890ff;
        }

        /* Responsive Grid System */
        @media (max-width: 576px) {
          .container-two {
            padding: 0 16px;
          }
          
          .properties-main-grid .ant-col {
            margin-bottom: 24px !important;
          }

          .header-controls {
            flex-direction: column;
            gap: 12px !important;
            width: 100%;
          }

          .header-controls .ant-space-item {
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .results-header-main .ant-row {
            flex-direction: column !important;
            gap: 16px;
          }

          .results-info {
            text-align: center;
          }

          .pagination-main-card .ant-row {
            flex-direction: column !important;
            gap: 16px;
            text-align: center;
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

export default PropertyPageSection;
