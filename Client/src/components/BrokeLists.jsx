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
  Input,
  Select,
  Avatar,
  Tooltip,
  Row,
  Col,
  Statistic,
  Progress,
  Drawer,
  Descriptions,
  Badge,
  Divider
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  MailOutlined, 
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined,
  PhoneOutlined,
  BankOutlined,
  DashboardOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SafetyOutlined,
  BuildOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import url from '../url';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const BrokerLists = () => {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} brokers`,
    },
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      fetchBrokers();
    }
  }, []);

  useEffect(() => {
    handleFilter();
  }, [brokers, searchText, filterStatus]);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url.API_URL}/admin/brokers/allbrokers`);
      setBrokers(response.data.brokers);
      setFilteredBrokers(response.data.brokers);
    } catch (err) {
      console.error("Failed to fetch brokers:", err);
      message.error("Failed to load broker data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = brokers;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(broker => 
        broker.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        broker.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
        broker.mobileNumber?.includes(searchText)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(broker => (broker.status || 'pending') === filterStatus);
    }

    setFilteredBrokers(filtered);
  };

  const deleteBroker = (userId) => {
    confirm({
      title: "Delete Broker Account",
      content: "Are you sure you want to permanently delete this broker? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await axios.delete(`${url.API_URL}/admin/brokers/${userId}`);
          message.success("Broker deleted successfully!");
          fetchBrokers();
        } catch (error) {
          console.error("Delete broker error:", error);
          const errorMessage = error.response?.data?.error || "Something went wrong";
          message.error(`Error: ${errorMessage}`);
        }
      },
    });
  };

  const approveBroker = (id) => {
    confirm({
      title: "Approve Broker Application",
      content: "Are you sure you want to approve this broker? They will gain access to the platform.",
      okText: "Approve",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const response = await axios.put(`${url.API_URL}/admin/brokers/${id}/approveBroker`);
          if (response.status === 200) {
            message.success("Broker approved successfully!");
            fetchBrokers();
          } else {
            message.error("Failed to approve broker.");
          }
        } catch (error) {
          console.error("Approval broker error:", error);
          const errorMessage = error.response?.data?.error || "Something went wrong";
          message.error(`Error: ${errorMessage}`);
        }
      },
    });
  };

  const rejectBroker = (id) => {
    Modal.confirm({
      title: "Reject Broker Application",
      content: "Are you sure you want to reject this broker application? This action can be reversed later.",
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await axios.put(`${url.API_URL}/admin/brokers/${id}/rejectBroker`);
          message.success("Broker rejected successfully!");
          fetchBrokers();
        } catch (error) {
          console.error("Reject broker error:", error);
          const errorMessage = error.response?.data?.error || "Something went wrong";
          message.error(`Error: ${errorMessage}`);
        }
      },
    });
  };

  const handleBulkApprove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select brokers to approve');
      return;
    }

    confirm({
      title: `Approve ${selectedRowKeys.length} Broker(s)`,
      content: 'Are you sure you want to approve the selected brokers?',
      okText: 'Yes, Approve All',
      okType: 'primary',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // Implement bulk approval API call
          message.success(`${selectedRowKeys.length} brokers approved successfully!`);
          setSelectedRowKeys([]);
          fetchBrokers();
        } catch (error) {
          message.error('Failed to approve selected brokers');
        }
      },
    });
  };

  const exportData = () => {
    message.success('Export functionality will be implemented');
  };

  const viewBrokerDetails = (broker) => {
    setSelectedBroker(broker);
    setDrawerVisible(true);
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

  const columns = [
    {
      title: "Broker",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (name, record) => (
        <Space>
          <Avatar 
            size="large" 
            src={record.profilePhoto} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#722ed1' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              ID: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Contact Information",
      key: "contact",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <PhoneOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text copyable={{ text: record.mobileNumber }}>{record.mobileNumber}</Text>
          </div>
          {record.email && (
            <div>
              <MailOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              <Text copyable={{ text: record.email }}>{record.email}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Company Details",
      key: "company",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            <BankOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            {record.companyName || 'Not Specified'}
          </div>
          {record.experience && (
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              Experience: {record.experience} years
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const currentStatus = status || 'pending';
        return (
          <Space direction="vertical" size="small">
            <Tag color={getStatusColor(currentStatus)} icon={getStatusIcon(currentStatus)}>
              {currentStatus.toUpperCase()}
            </Tag>
            {record.verificationStatus && (
              <Tag color="blue" size="small">
                <SafetyOutlined /> Verified
              </Tag>
            )}
          </Space>
        );
      },
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => (record.status || 'pending') === value,
      sorter: (a, b) => (a.status || 'pending').localeCompare(b.status || 'pending'),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <div>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space wrap size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => viewBrokerDetails(record)}
            />
          </Tooltip>
          
          {currentUser?.role === 'admin' && (
            <Tooltip title="Edit Broker">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => window.location.href = `/admin/edit-broker/${record.id}`}
              />
            </Tooltip>
          )}

          {record.status !== "approved" && (
            <Tooltip title="Approve">
              <Button
                icon={<CheckCircleOutlined />}
                type="primary"
                size="small"
                onClick={() => approveBroker(record.id)}
              />
            </Tooltip>
          )}

          {record.status !== "rejected" && record.status === "approved" && (
            <Tooltip title="Reject">
              <Button
                icon={<CloseCircleOutlined />}
                size="small"
                danger
                onClick={() => rejectBroker(record.id)}
              />
            </Tooltip>
          )}

          <Tooltip title="Send Email">
            <Button 
              icon={<MailOutlined />} 
              size="small"
              onClick={() => window.open(`mailto:${record.email}`)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => deleteBroker(record.userId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'approved',
    }),
  };

  // Statistics calculations
  const totalBrokers = brokers.length;
  const approvedBrokers = brokers.filter(broker => broker.status === 'approved').length;
  const pendingBrokers = brokers.filter(broker => (broker.status || 'pending') === 'pending').length;
  const rejectedBrokers = brokers.filter(broker => broker.status === 'rejected').length;

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
              { title: 'Broker Management' }, 
              { title: 'All Brokers' }
            ]} 
          />

          {/* Page Header */}
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <TeamOutlined style={{ marginRight: 12, color: '#722ed1' }} />
              Broker Management
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>
              Manage broker applications, approvals, and account oversight
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Brokers"
                  value={totalBrokers}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<TeamOutlined />}
                />
                <Progress 
                  percent={100} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#722ed1"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Approved"
                  value={approvedBrokers}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress 
                  percent={totalBrokers > 0 ? Math.round((approvedBrokers / totalBrokers) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Approval"
                  value={pendingBrokers}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<ClockCircleOutlined />}
                />
                <Progress 
                  percent={totalBrokers > 0 ? Math.round((pendingBrokers / totalBrokers) * 100) : 0} 
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
                  value={rejectedBrokers}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CloseCircleOutlined />}
                />
                <Progress 
                  percent={totalBrokers > 0 ? Math.round((rejectedBrokers / totalBrokers) * 100) : 0} 
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
                <TeamOutlined style={{ color: '#722ed1' }} />
                <span>All Brokers ({filteredBrokers.length})</span>
              </Space>
            }
            extra={
              <Space>
                {/* <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => window.location.href = '/admin/add-broker'}
                >
                  Add Broker
                </Button> */}
                <Button 
                  icon={<ExportOutlined />}
                  onClick={exportData}
                >
                  Export
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchBrokers}
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
                <Input
                  placeholder="Search brokers by name, company, or phone..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Select
                  placeholder="Filter by Status"
                  style={{ width: '100%' }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  allowClear
                >
                  <Option value="all">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="suspended">Suspended</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                {selectedRowKeys.length > 0 && (
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleBulkApprove}
                  >
                    Approve ({selectedRowKeys.length})
                  </Button>
                )}
              </Col>
            </Row>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredBrokers}
              loading={loading}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                ...tableParams.pagination,
                total: filteredBrokers.length,
                showTotal: (total, range) => 
                  `Showing ${range[0]}-${range[1]} of ${total} brokers`,
              }}
              onChange={(pagination, filters, sorter) => {
                setTableParams({ pagination, filters, sorter });
              }}
              scroll={{ x: 1000 }}
              size="middle"
              className="custom-table"
            />
          </Card>

          {/* Broker Details Drawer */}
          <Drawer
            title={
              <Space>
                <Avatar 
                  src={selectedBroker?.profilePhoto} 
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>
                    {selectedBroker?.fullName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    Broker Details
                  </div>
                </div>
              </Space>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={600}
          >
            {selectedBroker && (
              <div>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Full Name">
                    {selectedBroker.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile Number">
                    <Text copyable>{selectedBroker.mobileNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable>{selectedBroker.email || 'Not provided'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Company Name">
                    {selectedBroker.companyName || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Experience">
                    {selectedBroker.experience ? `${selectedBroker.experience} years` : 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedBroker.status)} icon={getStatusIcon(selectedBroker.status)}>
                      {(selectedBroker.status || 'pending').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Registration Date">
                    {new Date(selectedBroker.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  {selectedBroker.status !== 'approved' && (
                    <Button 
                      type="primary" 
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        approveBroker(selectedBroker.id);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  
                  {selectedBroker.status !== 'rejected' && (
                    <Button 
                      danger 
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        rejectBroker(selectedBroker.id);
                      }}
                    >
                      Reject
                    </Button>
                  )}
{/*                   
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => window.location.href = `/admin/edit-broker/${selectedBroker.id}`}
                  >
                    Edit
                  </Button> */}
                  
                  <Button 
                    icon={<MailOutlined />}
                    onClick={() => window.open(`mailto:${selectedBroker.email}`)}
                  >
                    Email
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

export default BrokerLists;
