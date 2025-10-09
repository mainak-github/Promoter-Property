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
  Divider
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
  StopOutlined
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
  const [properties, setProperties] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPropertyType, setFilterPropertyType] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {currentUser?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 0 }}>
          {/* Breadcrumb */}
          <Breadcrumb 
            style={{ marginBottom: 24 }} 
            items={[
              { title: <DashboardOutlined />, href: '/admin/dashboard' },
              { title: 'Property Management' }, 
              { title: 'All Properties' }
            ]} 
          />

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

          {/* Property Details Drawer */}
          <Drawer
            title={
              <Space>
                <Avatar 
                  src={selectedProperty?.coverPhoto ? `${url.IMAGE_URL}/${selectedProperty.coverPhoto.replace(/\\/g, "/")}` : null}
                  icon={<HomeOutlined />}
                  size="large"
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>
                    {selectedProperty?.title || 'Property Details'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    Property Information
                  </div>
                </div>
              </Space>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={600}
          >
            {selectedProperty && (
              <div>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Property Title">
                    {selectedProperty.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Property Type">
                    {selectedProperty.propertyType || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Price Range">
                    {formatPriceToIndian(selectedProperty.priceRange)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {selectedProperty.city || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bedrooms">
                    {selectedProperty.bedrooms || 'Not specified'} BHK
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedProperty.approvalStatus)} icon={getStatusIcon(selectedProperty.approvalStatus)}>
                      {(selectedProperty.approvalStatus || 'pending').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Broker ID">
                    {selectedProperty.brokerId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created Date">
                    {new Date(selectedProperty.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setDrawerVisible(false);
                      updateApprovalStatus(selectedProperty.id);
                    }}
                  >
                    Update Status
                  </Button>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => window.location.href = `/admin/edit-property/${selectedProperty.id}`}
                  >
                    Edit Property
                  </Button>
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`/property-details/${selectedProperty.id}`, '_blank')}
                  >
                    View Live
                  </Button>
                </Space>
              </div>
            )}
          </Drawer>
        </Content>
      </Layout>

      {/* Custom Styles */}
      <style jsx global>{`
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
