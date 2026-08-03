import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import url from '../url';
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
import PropertyCard from './common/PropertyCard';

const { Option } = Select;
const { Text, Title } = Typography;
const { Meta } = Card;

const PropertyItem = ({ property }) => {
  return <PropertyCard property={property} />;
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

      <style>{`
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

      let fetchedProperties = [];
      let paginationData = { totalPages: 1, total: 0 };

      if (response.data?.status === "success" && response.data?.data) {
        fetchedProperties = response.data.data.properties || [];
        paginationData = response.data.data.pagination || {};
      } else if (Array.isArray(response.data?.properties)) {
        fetchedProperties = response.data.properties;
      } else if (Array.isArray(response.data)) {
        fetchedProperties = response.data;
      }

      setProperties(fetchedProperties);
      setPagination({
        currentPage: page,
        totalPages: paginationData?.totalPages || 1,
        totalCount: paginationData?.total || fetchedProperties.length || 0,
        itemsPerPage: 12
      });
    } catch (err) {
      console.error('Fetch properties error:', err);
      setError(err.message || 'Failed to fetch properties');
      setProperties([]);
      setPagination(prev => ({ ...prev, totalCount: 0, totalPages: 1 }));
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
      <style>{`
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
