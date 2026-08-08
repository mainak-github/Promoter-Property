import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import url from '../url';
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
  Space, 
  Divider, 
  Skeleton,
  Pagination,
  Statistic,
  Badge,
  Tabs
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined, 
  EnvironmentOutlined, 
  HomeOutlined, 
  AppstoreOutlined, 
  UnorderedListOutlined,
  BuildOutlined,
  SortAscendingOutlined,
  CheckCircleOutlined,
  FireOutlined,
  DollarCircleOutlined,
  CompassOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import PropertyCard from './common/PropertyCard';
import PropertyQuickViewModal from './common/PropertyQuickViewModal';
import PropertyInquiryModal from './common/PropertyInquiryModal';

const { Option } = Select;
const { Text, Title } = Typography;

const BUDGET_PRESETS = [
  { label: 'All Budgets', value: '' },
  { label: 'Under ₹50 Lakhs', value: '0-5000000', minPrice: 0, maxPrice: 5000000 },
  { label: '₹50 Lakhs - ₹1 Crore', value: '5000000-10000000', minPrice: 5000000, maxPrice: 10000000 },
  { label: '₹1 Crore - ₹3 Crores', value: '10000000-30000000', minPrice: 10000000, maxPrice: 30000000 },
  { label: '₹3 Crores - ₹5 Crores', value: '30000000-50000000', minPrice: 30000000, maxPrice: 50000000 },
  { label: 'Above ₹5 Crores', value: '50000000-999999999', minPrice: 50000000, maxPrice: 999999999 }
];

const PROPERTY_TYPES = [
  'Flat',
  'Apartment',
  'Independent House',
  'Villa',
  'Plots'
];

const CONSTRUCTION_STATUSES = [
  'Ready to Move In',
  'Under Construction',
  'Launching Soon'
];

const PropertyPageSection = () => {
  // Main States
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [status, setStatus] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Control States
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Options State
  const [cityOptions, setCityOptions] = useState([
    'Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'
  ]);

  // Modal States
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  // Fetch Cities dynamically
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await axios.get(`${url.API_URL}/public/properties?page=1&limit=100`);
        if (response.data?.status === "success" && response.data?.data?.properties) {
          const props = response.data.data.properties;
          const extractedCities = [...new Set(props.map(p => p.city).filter(Boolean))].sort();
          if (extractedCities.length > 0) {
            setCityOptions(extractedCities);
          }
        }
      } catch (err) {
        console.warn('Filter options fetch notice:', err.message);
      }
    };
    fetchFilterData();
  }, []);

  // Fetch Properties Function
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };

      if (searchKeyword.trim()) params.search = searchKeyword.trim();
      if (propertyType) params.propertyType = propertyType;
      if (city) params.city = city;
      if (bedrooms) params.bedrooms = bedrooms;
      if (status) params.status = status;

      if (budgetRange) {
        const selectedPreset = BUDGET_PRESETS.find(p => p.value === budgetRange);
        if (selectedPreset) {
          params.minPrice = selectedPreset.minPrice;
          params.maxPrice = selectedPreset.maxPrice;
        }
      }

      // Map Sort Option to Backend API Query Parameters
      switch (sortBy) {
        case 'oldest':
          params.sortBy = 'createdAt';
          params.order = 'asc';
          break;
        case 'price-low':
          params.sortBy = 'priceRange';
          params.order = 'asc';
          break;
        case 'price-high':
          params.sortBy = 'priceRange';
          params.order = 'desc';
          break;
        case 'title':
          params.sortBy = 'title';
          params.order = 'asc';
          break;
        case 'newest':
        default:
          params.sortBy = 'createdAt';
          params.order = 'desc';
          break;
      }

      const response = await axios.get(`${url.API_URL}/public/properties`, { params });

      let fetchedProperties = [];
      let paginationInfo = { total: 0, totalPages: 1 };

      if (response.data?.status === "success" && response.data?.data) {
        fetchedProperties = response.data.data.properties || [];
        paginationInfo = response.data.data.pagination || {};
      } else if (Array.isArray(response.data?.properties)) {
        fetchedProperties = response.data.properties;
      } else if (Array.isArray(response.data)) {
        fetchedProperties = response.data;
      }

      setProperties(fetchedProperties);
      setTotalCount(paginationInfo.total || fetchedProperties.length || 0);
      setTotalPages(paginationInfo.totalPages || 1);

    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties from server');
      setProperties([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchKeyword, propertyType, city, bedrooms, status, budgetRange, sortBy]);

  // Debounced Auto Fetch on Filter/Sort/Page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  // Handle Tab Change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
    if (key === 'ALL') {
      setPropertyType('');
    } else {
      setPropertyType(key);
    }
  };

  // Reset All Filters
  const handleClearAllFilters = () => {
    setSearchKeyword('');
    setPropertyType('');
    setCity('');
    setBedrooms('');
    setStatus('');
    setBudgetRange('');
    setActiveTab('ALL');
    setSortBy('newest');
    setCurrentPage(1);
    message.info('All filters reset');
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchKeyword) count++;
    if (propertyType) count++;
    if (city) count++;
    if (bedrooms) count++;
    if (status) count++;
    if (budgetRange) count++;
    return count;
  }, [searchKeyword, propertyType, city, bedrooms, status, budgetRange]);

  // Scroll to top on page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    if (pageSize && pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
    const section = document.querySelector('.property-page-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="property-page-section">
      <div className="container container-two">
        
        {/* =========================================================
            1. Hero Search Header Banner
           ========================================================= */}
        <div className="property-hero-search-wrapper">
          <div className="hero-badge-pill">
            <FireOutlined style={{ marginRight: 6 }} /> Verified Real Estate Portal
          </div>
          <Title level={1} className="hero-main-title">
            Explore Premium Real Estate & Properties
          </Title>
          <Text className="hero-subtitle">
            Find apartments, luxury villas, commercial plots, and ready-to-move homes with verified details.
          </Text>

          {/* Quick Property Type Category Tabs */}
          <div className="hero-category-tabs">
            <button
              className={`cat-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => handleTabChange('ALL')}
            >
              All Types
            </button>
            {PROPERTY_TYPES.map(type => (
              <button
                key={type}
                className={`cat-tab-btn ${activeTab === type ? 'active' : ''}`}
                onClick={() => handleTabChange(type)}
              >
                {type}s
              </button>
            ))}
          </div>

          {/* Glassmorphic Multi-Criteria Search Panel */}
          <Card className="hero-filter-card" bordered={false}>
            <Row gutter={[12, 12]} align="middle">
              {/* Keyword Search */}
              <Col xs={24} sm={12} md={6}>
                <Input
                  size="large"
                  placeholder="Location, property, landmark..."
                  prefix={<SearchOutlined style={{ color: '#ea580c' }} />}
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  allowClear
                  className="filter-input-element"
                />
              </Col>

              {/* City Select */}
              <Col xs={12} sm={12} md={4}>
                <Select
                  size="large"
                  placeholder="Select City"
                  value={city || undefined}
                  onChange={(val) => {
                    setCity(val || '');
                    setCurrentPage(1);
                  }}
                  allowClear
                  className="w-100 filter-select-element"
                >
                  {cityOptions.map(c => (
                    <Option key={c} value={c}>
                      <EnvironmentOutlined style={{ marginRight: 6, color: '#ea580c' }} />
                      {c}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* BHK Selector */}
              <Col xs={12} sm={12} md={3}>
                <Select
                  size="large"
                  placeholder="BHK"
                  value={bedrooms || undefined}
                  onChange={(val) => {
                    setBedrooms(val || '');
                    setCurrentPage(1);
                  }}
                  allowClear
                  className="w-100 filter-select-element"
                >
                  <Option value="1">1 BHK</Option>
                  <Option value="2">2 BHK</Option>
                  <Option value="3">3 BHK</Option>
                  <Option value="4">4+ BHK</Option>
                </Select>
              </Col>

              {/* Budget Range Selector */}
              <Col xs={12} sm={12} md={4}>
                <Select
                  size="large"
                  placeholder="Budget Range"
                  value={budgetRange || undefined}
                  onChange={(val) => {
                    setBudgetRange(val || '');
                    setCurrentPage(1);
                  }}
                  allowClear
                  className="w-100 filter-select-element"
                >
                  {BUDGET_PRESETS.filter(p => p.value !== '').map(p => (
                    <Option key={p.value} value={p.value}>
                      {p.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Construction Status */}
              <Col xs={12} sm={12} md={4}>
                <Select
                  size="large"
                  placeholder="Status"
                  value={status || undefined}
                  onChange={(val) => {
                    setStatus(val || '');
                    setCurrentPage(1);
                  }}
                  allowClear
                  className="w-100 filter-select-element"
                >
                  {CONSTRUCTION_STATUSES.map(s => (
                    <Option key={s} value={s}>{s}</Option>
                  ))}
                </Select>
              </Col>

              {/* Search & Reset Buttons */}
              <Col xs={24} sm={24} md={3}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    onClick={fetchProperties}
                    loading={loading}
                    className="filter-search-btn"
                  >
                    Search
                  </Button>
                  {activeFilterCount > 0 && (
                    <Button
                      size="large"
                      icon={<ClearOutlined />}
                      onClick={handleClearAllFilters}
                      className="filter-clear-btn"
                      title="Reset Filters"
                    />
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* =========================================================
            2. Active Filter Chips Tag Bar
           ========================================================= */}
        {activeFilterCount > 0 && (
          <div className="active-filters-chip-bar">
            <span className="active-filter-label">
              <FilterOutlined style={{ marginRight: 6 }} /> Active Filters ({activeFilterCount}):
            </span>
            <Space wrap size={[6, 6]}>
              {searchKeyword && (
                <Tag
                  closable
                  color="orange"
                  onClose={() => { setSearchKeyword(''); setCurrentPage(1); }}
                >
                  Keyword: {searchKeyword}
                </Tag>
              )}
              {city && (
                <Tag
                  closable
                  color="volcano"
                  onClose={() => { setCity(''); setCurrentPage(1); }}
                >
                  City: {city}
                </Tag>
              )}
              {propertyType && (
                <Tag
                  closable
                  color="blue"
                  onClose={() => { setPropertyType(''); setActiveTab('ALL'); setCurrentPage(1); }}
                >
                  Type: {propertyType}
                </Tag>
              )}
              {bedrooms && (
                <Tag
                  closable
                  color="cyan"
                  onClose={() => { setBedrooms(''); setCurrentPage(1); }}
                >
                  {bedrooms} BHK
                </Tag>
              )}
              {budgetRange && (
                <Tag
                  closable
                  color="green"
                  onClose={() => { setBudgetRange(''); setCurrentPage(1); }}
                >
                  Budget: {BUDGET_PRESETS.find(p => p.value === budgetRange)?.label}
                </Tag>
              )}
              {status && (
                <Tag
                  closable
                  color="purple"
                  onClose={() => { setStatus(''); setCurrentPage(1); }}
                >
                  Status: {status}
                </Tag>
              )}
              <Button
                type="link"
                size="small"
                onClick={handleClearAllFilters}
                style={{ color: '#ef4444', fontWeight: 600, padding: '0 4px' }}
              >
                Clear All ✕
              </Button>
            </Space>
          </div>
        )}

        {/* =========================================================
            3. Results Bar & Sort / View Controls
           ========================================================= */}
        <Card className="results-control-bar-card" bordered={false}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            {/* Left: Total Properties Count & Live Stats */}
            <Col xs={24} md={10}>
              <div className="results-count-wrapper">
                <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
                  {totalCount} Properties Found
                </Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Showing page {currentPage} of {totalPages} • Verified seller listings
                </Text>
              </div>
            </Col>

            {/* Right: Sort selector & View Mode Switcher */}
            <Col xs={24} md={14}>
              <div className="results-controls-right">
                <Space wrap align="center" size="middle">
                  {/* Items per page selector */}
                  <div className="control-item">
                    <span className="control-label">Show:</span>
                    <Select
                      size="middle"
                      value={itemsPerPage}
                      onChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                      style={{ width: 80 }}
                    >
                      <Option value={12}>12</Option>
                      <Option value={24}>24</Option>
                      <Option value={48}>48</Option>
                    </Select>
                  </div>

                  {/* Working API Sorting Selector */}
                  <div className="control-item">
                    <span className="control-label">Sort by:</span>
                    <Select
                      size="middle"
                      value={sortBy}
                      onChange={(val) => { setSortBy(val); setCurrentPage(1); }}
                      style={{ width: 180 }}
                      className="sort-dropdown-custom"
                    >
                      <Option value="newest">🕒 Newest First</Option>
                      <Option value="oldest">📅 Oldest First</Option>
                      <Option value="price-low">💰 Price: Low to High</Option>
                      <Option value="price-high">💎 Price: High to Low</Option>
                      <Option value="title">🔤 Title: A to Z</Option>
                    </Select>
                  </div>

                  {/* View Mode Toggle Group */}
                  <Button.Group className="view-toggle-buttons">
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

                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchProperties}
                    loading={loading}
                    title="Refresh Property Listings"
                  />
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* =========================================================
            4. Loading Skeleton Placeholders
           ========================================================= */}
        {loading && (
          <div className="properties-skeleton-container" style={{ margin: '24px 0' }}>
            <Row gutter={[24, 24]}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(key => (
                <Col
                  key={key}
                  xs={24}
                  sm={viewMode === 'grid' ? 12 : 24}
                  md={viewMode === 'grid' ? 12 : 24}
                  lg={viewMode === 'grid' ? 8 : 24}
                  xl={viewMode === 'grid' ? 6 : 24}
                >
                  <Card style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <Skeleton.Image style={{ width: '100%', height: 180 }} active />
                    <div style={{ padding: '16px 0 0' }}>
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* =========================================================
            5. Properties List / Grid Rendering
           ========================================================= */}
        {!loading && properties.length > 0 && (
          <div className="properties-grid-container" style={{ margin: '24px 0' }}>
            {viewMode === 'grid' ? (
              <Row gutter={[24, 24]} className="properties-main-grid">
                {properties.map((property, index) => (
                  <Col
                    key={property.id || `prop-${index}`}
                    xs={24}
                    sm={12}
                    md={12}
                    lg={8}
                    xl={6}
                    className="property-grid-col"
                  >
                    <PropertyCard
                      property={property}
                      viewMode="grid"
                      onOpenQuickView={(prop) => setQuickViewProperty(prop)}
                      onOpenInquiry={(prop) => setInquiryProperty(prop)}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="properties-main-list">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={property.id || `prop-list-${index}`}
                    property={property}
                    viewMode="list"
                    onOpenQuickView={(prop) => setQuickViewProperty(prop)}
                    onOpenInquiry={(prop) => setInquiryProperty(prop)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            6. Empty State Card
           ========================================================= */}
        {!loading && properties.length === 0 && (
          <Card className="empty-properties-card">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={4} style={{ color: '#334155', margin: '0 0 8px' }}>
                    No Properties Match Your Search Criteria
                  </Title>
                  <Text type="secondary">
                    Try adjusting your filters, expanding your budget range, or clearing active search terms.
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<ClearOutlined />}
                onClick={handleClearAllFilters}
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  border: 'none',
                  borderRadius: 8,
                  marginTop: 16
                }}
              >
                Reset All Filters
              </Button>
            </Empty>
          </Card>
        )}

        {/* =========================================================
            7. Ant Design Pagination Bar
           ========================================================= */}
        {!loading && properties.length > 0 && totalPages > 1 && (
          <Card className="pagination-card-main">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Text strong style={{ color: '#475569' }}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} properties
                </Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  responsive
                />
              </Col>
            </Row>
          </Card>
        )}

      </div>

      {/* Quick View Interactive Popup Modal */}
      <PropertyQuickViewModal
        property={quickViewProperty}
        open={Boolean(quickViewProperty)}
        onClose={() => setQuickViewProperty(null)}
        onOpenInquiry={(prop) => setInquiryProperty(prop)}
      />

      {/* Direct Lead Inquiry Modal */}
      <PropertyInquiryModal
        property={inquiryProperty}
        open={Boolean(inquiryProperty)}
        onClose={() => setInquiryProperty(null)}
      />

      {/* Global CSS Styling for Modern Web Design */}
      <style>{`
        .property-page-section {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: 32px 0 64px;
        }

        .container-two {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero Header Section */
        .property-hero-search-wrapper {
          text-align: center;
          margin-bottom: 28px;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #ffedd5;
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero-main-title {
          font-size: 36px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          letter-spacing: -0.02em;
          margin-bottom: 8px !important;
        }

        .hero-subtitle {
          font-size: 16px !important;
          color: #64748b !important;
          max-width: 720px;
          margin: 0 auto 24px !important;
          display: block;
        }

        /* Hero Tabs */
        .hero-category-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .cat-tab-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-tab-btn:hover {
          border-color: #ea580c;
          color: #ea580c;
        }

        .cat-tab-btn.active {
          background: #ea580c;
          border-color: #ea580c;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }

        /* Glassmorphic Search Card */
        .hero-filter-card {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 20px !important;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08) !important;
          border: 1px solid #e2e8f0 !important;
          padding: 8px !important;
        }

        .filter-input-element,
        .filter-select-element {
          border-radius: 10px !important;
        }

        .filter-search-btn {
          background: linear-gradient(135deg, #f97316, #ea580c) !important;
          border: none !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35) !important;
        }

        .filter-clear-btn {
          border-radius: 10px !important;
        }

        /* Active Filter Chips Bar */
        .active-filters-chip-bar {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .active-filter-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }

        /* Results Control Bar */
        .results-control-bar-card {
          background: #ffffff !important;
          border-radius: 14px !important;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04) !important;
          border: 1px solid #e2e8f0 !important;
          margin-bottom: 24px !important;
        }

        .results-controls-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .control-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }

        .sort-dropdown-custom {
          font-weight: 600 !important;
        }

        .view-toggle-buttons {
          border-radius: 8px !important;
          overflow: hidden;
        }

        /* Grid Alignment */
        .property-grid-col {
          display: flex !important;
          flex-direction: column;
        }

        .empty-properties-card {
          background: #ffffff !important;
          border-radius: 16px !important;
          padding: 48px 24px !important;
          text-align: center !alignment;
          margin: 32px 0 !important;
          border: 1px solid #e2e8f0 !important;
        }

        .pagination-card-main {
          background: #ffffff !important;
          border-radius: 14px !important;
          border: 1px solid #e2e8f0 !important;
          margin-top: 32px !important;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .hero-main-title {
            font-size: 26px !important;
          }
          .results-controls-right {
            justify-content: flex-start;
          }
          .container-two {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default PropertyPageSection;
