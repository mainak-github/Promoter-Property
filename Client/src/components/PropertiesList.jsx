import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Card, 
  Modal, 
  Typography, 
  message, 
  Spin, 
  Breadcrumb, 
  Form, 
  Input, 
  Image,
  Select,
  Row,
  Col,
  Statistic,
  Progress,
  Avatar,
  Tooltip,
  Drawer,
  Descriptions,
  Divider,
  Tabs,
  Empty,
  Badge
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  SearchOutlined,
  HomeOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined,
  FilterOutlined,
  DashboardOutlined,
  BuildOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CompassOutlined,
  PictureOutlined,
  FileTextOutlined,
  UserOutlined,
  GlobalOutlined,
  LinkOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  CarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const PropertiesList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPropertyType, setFilterPropertyType] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (typeof imgPath !== 'string') return null;
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    
    let cleanPath = imgPath.replace(/\\/g, '/');
    if (cleanPath.startsWith('../src/')) {
      cleanPath = cleanPath.replace('../src/', '');
    } else if (cleanPath.startsWith('src/')) {
      cleanPath = cleanPath.replace('src/', '');
    }
    
    cleanPath = cleanPath.replace(/^\/+/, '');
    return `${url.IMAGE_URL}/${cleanPath}`;
  };
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} properties`,
    },
  });
  const [form] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      fetchProperties();
    }
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchText, filterStatus, filterPropertyType, properties]);

  const handleFilter = () => {
    let filtered = properties;

    // Search filter
    if (searchText) {
      filtered = filtered.filter((item) =>
        ['title', 'city', 'propertyType', 'priceRange'].some(key =>
          String(item[key] || '').toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => (item.approvalStatus || 'pending') === filterStatus);
    }

    // Property type filter
    if (filterPropertyType !== 'all') {
      filtered = filtered.filter(item => item.propertyType === filterPropertyType);
    }

    setFilteredData(filtered);
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url.API_URL}/admin/property/allproperties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      message.error("Failed to load property data.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = (id) => {
    confirm({
      title: "Delete Property",
      content: "Are you sure you want to permanently delete this property? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${url.API_URL}/admin/properties/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Property deleted successfully!");
          fetchProperties();
        } catch (error) {
          console.error("Delete error:", error);
          const errorMessage = error.response?.data?.error || "Something went wrong";
          message.error(`Error: ${errorMessage}`);
        }
      },
    });
  };

  const handleBulkApproval = (action) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select properties to update');
      return;
    }

    const actionText = action === 'approved' ? 'approve' : 'reject';
    confirm({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedRowKeys.length} Properties`,
      content: `Are you sure you want to ${actionText} the selected properties?`,
      okText: `Yes, ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      okType: action === 'approved' ? 'primary' : 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // Implement bulk approval API call
          message.success(`${selectedRowKeys.length} properties ${action} successfully!`);
          setSelectedRowKeys([]);
          fetchProperties();
        } catch (error) {
          message.error(`Failed to ${actionText} selected properties`);
        }
      },
    });
  };

  const updateApprovalStatus = (propertyId) => {
    Modal.confirm({
      title: "Update Property Status",
      content: (
        <Form form={form} layout="vertical" initialValues={{ action: '' }}>
          <Form.Item
            name="action"
            label="Select Action"
            rules={[{ required: true, message: "Please select an action" }]}
          >
            <Select placeholder="Choose action">
              <Option value="approved">Approve Property</Option>
              <Option value="rejected">Reject Property</Option>
              <Option value="pending">Mark as Pending</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="Remarks (Optional)">
            <Input.TextArea rows={3} placeholder="Add remarks for this action..." />
          </Form.Item>
        </Form>
      ),
      width: 500,
      centered: true,
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const token = localStorage.getItem("token");
          await axios.put(
            `${url.API_URL}/admin/properties/${propertyId}/approval`,
            {
              approvalStatus: values.action,
              remarks: values.remarks || "",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          message.success(`Property ${values.action} successfully.`);
          fetchProperties();
        } catch (error) {
          console.error("Approval error:", error);
          message.error("Failed to update property status.");
        }
      },
    });
  };

  const viewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setDrawerVisible(true);
  };

  const exportData = () => {
    message.success('Export functionality will be implemented');
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'approved': 'success',
      'rejected': 'error',
      'pending': 'warning',
      'suspended': 'default',
    };
    return statusColors[status] || 'processing';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'approved': <CheckCircleOutlined />,
      'rejected': <CloseCircleOutlined />,
      'pending': <ClockCircleOutlined />,
      'suspended': <StopOutlined />,
    };
    return statusIcons[status] || <ClockCircleOutlined />;
  };

  // Format price for display
  const formatPriceToIndian = (priceString) => {
    if (!priceString) return 'Not specified';
    
    const cleanPrice = priceString.toString().toLowerCase().trim();
    const priceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k|thousand)?/);
    
    if (!priceMatch) return priceString;
    
    const [, numberStr, unit] = priceMatch;
    const number = parseFloat(numberStr);
    
    if (isNaN(number)) return priceString;
    
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

  const columns = [
    {
      title: "Property",
      key: "property",
      fixed: 'left',
      width: 300,
      render: (row) => {
        const imageUrl = row.coverPhoto
          ? `${url.IMAGE_URL}/${row.coverPhoto.replace(/\\/g, "/")}`
          : "https://via.placeholder.com/80x60/f0f0f0/666?text=No+Image";
        
        return (
          <Space>
            <Image
              src={imageUrl}
              alt="Property"
              width={80}
              height={60}
              style={{ objectFit: "cover", borderRadius: "8px" }}
              preview={false}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                {row.title || "Untitled Property"}
              </div>
              <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '2px' }}>
                <EnvironmentOutlined /> {row.city || 'Location not specified'}
              </div>
              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                ID: {row.id} | Broker: {row.brokerId}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Property Details",
      key: "details",
      render: (row) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <BuildOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <Text strong>{row.propertyType || 'Type not specified'}</Text>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <HomeOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text>{row.bedrooms || 'N/A'} BHK</Text>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <DollarCircleOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
            <Text strong>{formatPriceToIndian(row.priceRange)}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status & Dates",
      key: "statusDates",
      render: (row) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(row.approvalStatus)} icon={getStatusIcon(row.approvalStatus)}>
            {(row.approvalStatus || 'pending').toUpperCase()}
          </Tag>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            Created: {new Date(row.createdAt).toLocaleDateString()}
          </div>
          {row.updatedAt && (
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              <CalendarOutlined style={{ marginRight: '4px' }} />
              Updated: {new Date(row.updatedAt).toLocaleDateString()}
            </div>
          )}
        </Space>
      ),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => (record.approvalStatus || 'pending') === value,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 200,
      render: (row) => (
        <Space wrap size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => viewPropertyDetails(row)} 
            />
          </Tooltip>
          
          <Tooltip title="Edit Property">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => window.location.href = `/admin/edit-property/${row.id}`} 
            />
          </Tooltip>
          
          <Tooltip title="Update Status">
            <Button 
              icon={<CheckCircleOutlined />} 
              size="small" 
              type="primary" 
              onClick={() => updateApprovalStatus(row.id)} 
            />
          </Tooltip>
          
          <Tooltip title="Delete Property">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={() => deleteProperty(row.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Statistics calculations
  const totalProperties = properties.length;
  const approvedProperties = properties.filter(p => p.approvalStatus === 'approved').length;
  const pendingProperties = properties.filter(p => (p.approvalStatus || 'pending') === 'pending').length;
  const rejectedProperties = properties.filter(p => p.approvalStatus === 'rejected').length;
  const propertyTypes = [...new Set(properties.map(p => p.propertyType).filter(Boolean))];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {currentUser?.role === 'admin' ? <DashboardSidebar collapsed={collapsed} /> : <DashboardSidebar2 collapsed={collapsed} />}
      <Layout>
        <DashboardNavbar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
        <Content style={{ padding: '24px 28px' }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '24px 32px',
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            borderLeft: '6px solid #ea580c'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
                PROPERTY MANAGEMENT
              </div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>
                All Real Estate Listings
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Approve submitted property listings, manage status flags & inventory oversight.
              </p>
            </div>

            <Space size="middle">
              <Button 
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchProperties}
                style={{
                  background: '#ea580c',
                  borderColor: '#ea580c',
                  color: '#ffffff',
                  fontWeight: 700,
                  height: 40,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                }}
              >
                Refresh Inventory
              </Button>
              <Button 
                icon={<PlusOutlined />}
                onClick={() => window.location.href = '/admin/property-listing'}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 700,
                  height: 40,
                  borderRadius: 8
                }}
              >
                Add Listing
              </Button>
            </Space>
          </div>

          {/* Page Header */}
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <HomeOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              Property Management
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>
              Manage property listings, approvals, and oversight
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Properties"
                  value={totalProperties}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<HomeOutlined />}
                />
                <Progress 
                  percent={100} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Approved"
                  value={approvedProperties}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress 
                  percent={totalProperties > 0 ? Math.round((approvedProperties / totalProperties) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Review"
                  value={pendingProperties}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<ClockCircleOutlined />}
                />
                <Progress 
                  percent={totalProperties > 0 ? Math.round((pendingProperties / totalProperties) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#fa8c16"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Rejected"
                  value={rejectedProperties}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CloseCircleOutlined />}
                />
                <Progress 
                  percent={totalProperties > 0 ? Math.round((rejectedProperties / totalProperties) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#ff4d4f"
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content Card */}
          <Card
            title={
              <Space>
                <HomeOutlined style={{ color: '#1890ff' }} />
                <span>All Properties ({filteredData.length})</span>
              </Space>
            }
            extra={
              <Space>
                <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => window.location.href = '/admin/add-property'}
                >
                  Add Property
                </Button>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={exportData}
                >
                  Export
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchProperties}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            }
            className="shadow-sm"
            style={{ 
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}
          >
            {/* Filters Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Search
                  placeholder="Search properties by title, city, type..."
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Filter by Status"
                  style={{ width: '100%' }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  size="large"
                  allowClear
                >
                  <Option value="all">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Filter by Type"
                  style={{ width: '100%' }}
                  value={filterPropertyType}
                  onChange={setFilterPropertyType}
                  size="large"
                  allowClear
                >
                  <Option value="all">All Types</Option>
                  {propertyTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                {selectedRowKeys.length > 0 && (
                  <Space>
                    <Button 
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleBulkApproval('approved')}
                      size="large"
                    >
                      Approve ({selectedRowKeys.length})
                    </Button>
                    <Button 
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleBulkApproval('rejected')}
                      size="large"
                    >
                      Reject ({selectedRowKeys.length})
                    </Button>
                  </Space>
                )}
              </Col>
            </Row>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                ...tableParams.pagination,
                total: filteredData.length,
                showTotal: (total, range) => 
                  `Showing ${range[0]}-${range[1]} of ${total} properties`,
              }}
              onChange={(pagination, filters, sorter) => {
                setTableParams({ pagination, filters, sorter });
              }}
              scroll={{ x: 1200 }}
              size="middle"
              className="custom-table"
            />
          </Card>

          {/* Enhanced Property Details Drawer */}
          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 12 }}>
                <Space size="middle">
                  <Avatar 
                    src={getImageUrl(selectedProperty?.coverPhoto)}
                    icon={<HomeOutlined />}
                    size={48}
                    style={{ border: '2px solid #ea580c' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                      {selectedProperty?.title || 'Property Details'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <EnvironmentOutlined style={{ color: '#ea580c' }} />
                      <span>{selectedProperty?.city || selectedProperty?.suburb || 'Location N/A'}</span>
                      <span>•</span>
                      <span>ID: #{selectedProperty?.id}</span>
                    </div>
                  </div>
                </Space>
                <Tag 
                  color={getStatusColor(selectedProperty?.approvalStatus)} 
                  icon={getStatusIcon(selectedProperty?.approvalStatus)}
                  style={{ fontSize: '0.82rem', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}
                >
                  {(selectedProperty?.approvalStatus || 'pending').toUpperCase()}
                </Tag>
              </div>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={750}
            bodyStyle={{ padding: '16px 24px 80px 24px', background: '#f8fafc' }}
          >
            {selectedProperty && (
              <div>
                <Tabs
                  defaultActiveKey="overview"
                  type="card"
                  items={[
                    {
                      key: 'overview',
                      label: (
                        <span>
                          <HomeOutlined /> Overview & Gallery
                        </span>
                      ),
                      children: (
                        <div>
                          {/* Image Gallery */}
                          <Card title="📷 Property Gallery" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            {selectedProperty.coverPhoto || (selectedProperty.images && selectedProperty.images.length > 0) ? (
                              <Image.PreviewGroup>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                                  {selectedProperty.coverPhoto && (
                                    <div style={{ position: 'relative' }}>
                                      <Image
                                        src={getImageUrl(selectedProperty.coverPhoto)}
                                        alt="Cover"
                                        style={{ width: '100%', height: 85, objectFit: 'cover', borderRadius: 8, border: '2px solid #ea580c' }}
                                      />
                                      <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(234, 88, 12, 0.85)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Cover</span>
                                    </div>
                                  )}
                                  {selectedProperty.images && selectedProperty.images.map((imgObj, idx) => {
                                    const imgPath = typeof imgObj === 'string' ? imgObj : imgObj.imageUrl;
                                    return (
                                      <Image
                                        key={idx}
                                        src={getImageUrl(imgPath)}
                                        alt={`Image ${idx + 1}`}
                                        style={{ width: '100%', height: 85, objectFit: 'cover', borderRadius: 8 }}
                                      />
                                    );
                                  })}
                                </div>
                              </Image.PreviewGroup>
                            ) : (
                              <Empty description="No property photos uploaded" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                          </Card>

                          {/* Quick Highlights */}
                          <Card title="⚡ Key Specifications" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            <Row gutter={[12, 12]}>
                              <Col span={8}>
                                <div style={{ background: '#eff6ff', padding: '10px 12px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                                  <Text type="secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PRICE RANGE</Text>
                                  <div style={{ color: '#1e40af', fontWeight: 800, fontSize: '1.05rem', marginTop: 2 }}>
                                    {formatPriceToIndian(selectedProperty.priceRange)}
                                  </div>
                                </div>
                              </Col>
                              <Col span={8}>
                                <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                                  <Text type="secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PROPERTY TYPE</Text>
                                  <div style={{ color: '#166534', fontWeight: 800, fontSize: '1rem', marginTop: 2 }}>
                                    {selectedProperty.propertyType || 'N/A'}
                                  </div>
                                </div>
                              </Col>
                              <Col span={8}>
                                <div style={{ background: '#fff7ed', padding: '10px 12px', borderRadius: 8, border: '1px solid #fed7aa' }}>
                                  <Text type="secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>BUDGET CATEGORY</Text>
                                  <div style={{ color: '#c2410c', fontWeight: 800, fontSize: '0.95rem', marginTop: 2 }}>
                                    {selectedProperty.budgetType || 'N/A'}
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Descriptions column={2} bordered size="small" style={{ marginTop: 14 }}>
                              <Descriptions.Item label="Bedrooms">{selectedProperty.bedrooms !== null && selectedProperty.bedrooms !== undefined ? `${selectedProperty.bedrooms} BHK` : 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Bathrooms">{selectedProperty.bathrooms !== null && selectedProperty.bathrooms !== undefined ? `${selectedProperty.bathrooms} Baths` : 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Furnished Status">{selectedProperty.furnishedStatus || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Parking Available">{selectedProperty.parkingAvailable ? 'Yes' : 'No / Unspecified'}</Descriptions.Item>
                              <Descriptions.Item label="Total Area">{selectedProperty.totalArea || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Carpet Area">{selectedProperty.carpetArea || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Facing">{selectedProperty.facing || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Property Status">{selectedProperty.status || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Floor Number">{selectedProperty.floorNumber || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Number of Towers">{selectedProperty.numberOfTowers || 'N/A'}</Descriptions.Item>
                            </Descriptions>
                          </Card>

                          {/* Descriptions */}
                          <Card title="📝 Descriptions" size="small" style={{ borderRadius: 12 }}>
                            {selectedProperty.shortDescription && (
                              <div style={{ marginBottom: 12, background: '#f1f5f9', padding: 12, borderRadius: 8, borderLeft: '4px solid #0284c7' }}>
                                <Text strong style={{ color: '#0f172a', display: 'block', marginBottom: 4 }}>Short Summary:</Text>
                                <Text style={{ color: '#334155', whiteSpace: 'pre-line' }}>{selectedProperty.shortDescription}</Text>
                              </div>
                            )}
                            {selectedProperty.longDescription ? (
                              <div>
                                <Text strong style={{ color: '#0f172a', display: 'block', marginBottom: 4 }}>Full Details:</Text>
                                <div style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line', background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                  {selectedProperty.longDescription}
                                </div>
                              </div>
                            ) : (
                              <Text type="secondary">No long description provided.</Text>
                            )}
                          </Card>
                        </div>
                      )
                    },
                    {
                      key: 'location',
                      label: (
                        <span>
                          <EnvironmentOutlined /> Location & Address
                        </span>
                      ),
                      children: (
                        <div>
                          <Card title="📍 Location Details" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            <Descriptions column={2} bordered size="small">
                              <Descriptions.Item label="Address" span={2}>{selectedProperty.address || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Road / Landmark">{selectedProperty.road || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Suburb / Area">{selectedProperty.suburb || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="City">{selectedProperty.city || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="District">{selectedProperty.district || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="State">{selectedProperty.state || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Pincode">{selectedProperty.pincode || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Country">{selectedProperty.country || 'India'}</Descriptions.Item>
                              <Descriptions.Item label="Continent">{selectedProperty.continent || 'Asia'}</Descriptions.Item>
                              <Descriptions.Item label="Latitude">{selectedProperty.latitude || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Longitude">{selectedProperty.longitude || 'N/A'}</Descriptions.Item>
                            </Descriptions>
                          </Card>

                          {selectedProperty.googleMapLink && (
                            <Card size="small" style={{ borderRadius: 12, background: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center' }}>
                              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Text strong style={{ color: '#0369a1' }}>Google Maps Location</Text>
                                <Button 
                                  type="primary" 
                                  icon={<CompassOutlined />}
                                  href={selectedProperty.googleMapLink}
                                  target="_blank"
                                  style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: 8, height: 40, fontWeight: 700 }}
                                >
                                  Open Property Location in Google Maps
                                </Button>
                              </Space>
                            </Card>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'developer',
                      label: (
                        <span>
                          <BuildOutlined /> Developer & Dates
                        </span>
                      ),
                      children: (
                        <div>
                          <Card title="🏗️ Developer Information" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            {selectedProperty.developerInfo ? (
                              <Space align="start" size="middle">
                                {selectedProperty.developerInfo.developerLogo && (
                                  <Avatar 
                                    src={getImageUrl(selectedProperty.developerInfo.developerLogo)} 
                                    size={64} 
                                    shape="square"
                                    style={{ borderRadius: 8, border: '1px solid #cbd5e1' }}
                                  />
                                )}
                                <div>
                                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                                    {selectedProperty.developerInfo.developerName || 'Developer Name N/A'}
                                  </div>
                                  <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: 4, whiteSpace: 'pre-line' }}>
                                    {selectedProperty.developerInfo.developerDescription || selectedProperty.developerInfo.aboutDeveloper || 'No developer description available.'}
                                  </div>
                                </div>
                              </Space>
                            ) : (
                              <Text type="secondary">No developer information provided.</Text>
                            )}
                          </Card>

                          <Card title="📅 Timeline & Management" size="small" style={{ borderRadius: 12 }}>
                            <Descriptions column={2} bordered size="small">
                              <Descriptions.Item label="Launch Date">
                                {selectedProperty.launchDate ? new Date(selectedProperty.launchDate).toLocaleDateString() : 'N/A'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Completion Date">
                                {selectedProperty.completionDate ? new Date(selectedProperty.completionDate).toLocaleDateString() : 'N/A'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Submitted Date">
                                {selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : 'N/A'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Last Updated">
                                {selectedProperty.updatedAt ? new Date(selectedProperty.updatedAt).toLocaleString() : 'N/A'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Broker ID">
                                #{selectedProperty.brokerId}
                              </Descriptions.Item>
                              <Descriptions.Item label="Approval Status">
                                <Tag color={getStatusColor(selectedProperty.approvalStatus)}>
                                  {(selectedProperty.approvalStatus || 'pending').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </div>
                      )
                    },
                    {
                      key: 'amenities',
                      label: (
                        <span>
                          <CheckCircleOutlined /> Amenities & Facilities
                        </span>
                      ),
                      children: (
                        <div>
                          <Card title="✨ Amenities" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            {selectedProperty.amenities && selectedProperty.amenities.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {selectedProperty.amenities.map((am, idx) => (
                                  <Tag key={idx} color="blue" style={{ fontSize: '0.85rem', padding: '4px 12px', borderRadius: 6 }}>
                                    <CheckOutlined style={{ marginRight: 6 }} />
                                    {typeof am === 'string' ? am : (am.name || am.amenityName || 'Amenity')}
                                  </Tag>
                                ))}
                              </div>
                            ) : (
                              <Text type="secondary">No specific amenities listed.</Text>
                            )}
                          </Card>

                          <Card title="🚍 Nearby Facilities" size="small" style={{ borderRadius: 12 }}>
                            {selectedProperty.nearbyFacilities && selectedProperty.nearbyFacilities.length > 0 ? (
                              <Row gutter={[12, 12]}>
                                {selectedProperty.nearbyFacilities.map((fac, idx) => (
                                  <Col span={12} key={idx}>
                                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text strong style={{ fontSize: '0.85rem' }}>{fac.facilityName || fac.facilityType}</Text>
                                      <Tag color="orange">{fac.distance || 'Nearby'}</Tag>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            ) : (
                              <Text type="secondary">No nearby facilities listed.</Text>
                            )}
                          </Card>
                        </div>
                      )
                    },
                    {
                      key: 'floorplans',
                      label: (
                        <span>
                          <PictureOutlined /> Floor Plans & Maps
                        </span>
                      ),
                      children: (
                        <div>
                          <Card title="📐 Floor Plans" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
                            {selectedProperty.floorPlans && selectedProperty.floorPlans.length > 0 ? (
                              <Row gutter={[12, 12]}>
                                {selectedProperty.floorPlans.map((fp, idx) => {
                                  const photoUrl = getImageUrl(fp.photo || fp.imageUrl);
                                  return (
                                    <Col span={12} key={idx}>
                                      <Card size="small" style={{ borderRadius: 8, overflow: 'hidden' }}>
                                        {photoUrl && (
                                          <Image
                                            src={photoUrl}
                                            alt={fp.floorName || 'Floor Plan'}
                                            style={{ width: '100%', height: 140, objectFit: 'cover' }}
                                          />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                          <Text strong>{fp.floorName || fp.title || `Floor Plan #${idx + 1}`}</Text>
                                          {fp.towerName && <div><Text type="secondary" style={{ fontSize: '0.8rem' }}>Tower: {fp.towerName}</Text></div>}
                                          {fp.shortDescription && <div><Text type="secondary" style={{ fontSize: '0.8rem' }}>{fp.shortDescription}</Text></div>}
                                        </div>
                                      </Card>
                                    </Col>
                                  );
                                })}
                              </Row>
                            ) : (
                              <Text type="secondary">No floor plans uploaded.</Text>
                            )}
                          </Card>

                          <Card title="🗺️ Layout Maps" size="small" style={{ borderRadius: 12 }}>
                            {selectedProperty.layoutMaps && selectedProperty.layoutMaps.length > 0 ? (
                              <Row gutter={[12, 12]}>
                                {selectedProperty.layoutMaps.map((map, idx) => {
                                  const mapUrl = getImageUrl(map.imageUrl || map.photo);
                                  return (
                                    <Col span={12} key={idx}>
                                      <Card size="small" style={{ borderRadius: 8, overflow: 'hidden' }}>
                                        {mapUrl && (
                                          <Image
                                            src={mapUrl}
                                            alt={map.mapType || 'Layout Map'}
                                            style={{ width: '100%', height: 140, objectFit: 'cover' }}
                                          />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                          <Text strong>{map.mapType || `Layout Map #${idx + 1}`}</Text>
                                        </div>
                                      </Card>
                                    </Col>
                                  );
                                })}
                              </Row>
                            ) : (
                              <Text type="secondary">No layout maps uploaded.</Text>
                            )}
                          </Card>
                        </div>
                      )
                    },
                    {
                      key: 'seo',
                      label: (
                        <span>
                          <SearchOutlined /> SEO & Meta
                        </span>
                      ),
                      children: (
                        <div>
                          <Card title="🔍 SEO Settings & Meta Information" size="small" style={{ borderRadius: 12 }}>
                            <Descriptions column={1} bordered size="small">
                              <Descriptions.Item label="SEO Title">{selectedProperty.seoTitle || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Meta Description">{selectedProperty.metaDescription || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Meta Keywords">{selectedProperty.metaKeywords || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Focus Keyword">{selectedProperty.focusKeyword || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Canonical URL">{selectedProperty.canonicalUrl || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="OG Title">{selectedProperty.ogTitle || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="OG Type">{selectedProperty.ogType || 'website'}</Descriptions.Item>
                              <Descriptions.Item label="OG Description">{selectedProperty.ogDescription || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Twitter Card">{selectedProperty.twitterCard || 'summary_large_image'}</Descriptions.Item>
                              <Descriptions.Item label="Robots Index">{selectedProperty.robotsIndex || 'index,follow'}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            )}
            
            {/* Sticky Action Footer */}
            {selectedProperty && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 24px',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
                zIndex: 10
              }}>
                <Tag color={getStatusColor(selectedProperty.approvalStatus)} style={{ margin: 0, fontWeight: 700 }}>
                  {(selectedProperty.approvalStatus || 'pending').toUpperCase()}
                </Tag>

                <Space size="middle">
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setDrawerVisible(false);
                      updateApprovalStatus(selectedProperty.id);
                    }}
                    style={{ background: '#ea580c', borderColor: '#ea580c', fontWeight: 700, borderRadius: 6 }}
                  >
                    Update Status
                  </Button>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => window.location.href = `/admin/edit-property/${selectedProperty.id}`}
                    style={{ fontWeight: 600, borderRadius: 6 }}
                  >
                    Edit Property
                  </Button>
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`/property-details/${selectedProperty.id}`, '_blank')}
                    style={{ fontWeight: 600, borderRadius: 6 }}
                  >
                    View Live Page
                  </Button>
                </Space>
              </div>
            )}
          </Drawer>
        </Content>
      </Layout>

      {/* Custom Styles */}
      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: #fafafa;
          font-weight: 600;
          color: #262626;
        }
        
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #f5f5f5;
        }
        
        .shadow-sm {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .ant-statistic-content {
          font-size: 24px;
        }
        
        .ant-progress-bg {
          height: 4px !important;
        }
      `}</style>
    </Layout>
  );
};

export default PropertiesList;
