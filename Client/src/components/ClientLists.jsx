import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Avatar,
  Tooltip,
  Badge,
  Row,
  Col,
  Statistic,
  Progress,
  Drawer,
  Descriptions,
  Timeline,
  Divider
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExportOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ClientLists = () => {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]); // Only clients
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} clients`,
    },
    sorter: {},
    filters: {},
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    handleFilter();
  }, [clients, searchText, filterStatus]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url.API_URL}/auth/users`);
      
      // Filter to only show clients (not admins or brokers)
      const clientUsers = response.data.users.filter(user => 
        user.role === 'client' || user.role === 'user' || 
        (!user.role || (user.role !== 'admin' && user.role !== 'broker'))
      );
      
      setUsers(response.data.users); // Keep all users for statistics
      setClients(clientUsers); // Only clients for display
      setFilteredClients(clientUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      message.error('Failed to load client data.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = clients;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => (user.status || 'active') === filterStatus);
    }

    setFilteredClients(filtered);
  };

  const deleteUser = (id) => {
    confirm({
      title: 'Delete Client Account',
      content: 'Are you sure you want to permanently delete this client account? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          const response = await axios.delete(`${url.API_URL}/auth/deleteuser/${id}`);
          if (response.status === 200) {
            message.success('Client deleted successfully!');
            fetchUsers();
          } else {
            message.error('Failed to delete client. Try again.');
          }
        } catch (error) {
          console.error('Delete User error:', error);
          const errorMessage = error.response?.data?.error || 'Something went wrong';
          message.error(`Error: ${errorMessage}`);
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select clients to delete');
      return;
    }

    confirm({
      title: `Delete ${selectedRowKeys.length} Client(s)`,
      content: 'Are you sure you want to delete the selected clients? This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // Implement bulk delete API call
          message.success(`${selectedRowKeys.length} clients deleted successfully!`);
          setSelectedRowKeys([]);
          fetchUsers();
        } catch (error) {
          message.error('Failed to delete selected clients');
        }
      },
    });
  };

  const exportData = () => {
    // Implement export functionality
    message.success('Export functionality will be implemented');
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'success',
      'inactive': 'default',
      'suspended': 'error',
      'pending': 'warning',
    };
    return statusColors[status] || 'success';
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <Space>
          <Avatar 
            size="large" 
            src={record.avatar} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              Client ID: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <MailOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <Text copyable={{ text: record.email }}>{record.email}</Text>
          </div>
          {record.phone && (
            <div>
              <PhoneOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <Text copyable={{ text: record.phone }}>{record.phone}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} icon={<CheckCircleOutlined />}>
          {(record.status || 'Active').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Suspended', value: 'suspended' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => (record.status || 'active') === value,
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => viewUserDetails(record)}
            />
          </Tooltip>
          {/* {currentUser?.role === 'admin' && (
            <Tooltip title="Edit Client">
              <Button 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => window.location.href = `/admin/edit-client/${record.id}`}
              />
            </Tooltip>
          )} */}
          <Tooltip title="Delete Client">
            <Button 
              icon={<DeleteOutlined />} 
              size="small"
              danger 
              onClick={() => deleteUser(record.id)}
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

  // Statistics calculations - Only for clients
  const totalClients = clients.length;
  const activeClients = clients.filter(user => (user.status || 'active') === 'active').length;
  const pendingClients = clients.filter(user => user.status === 'pending').length;
  const newClientsThisMonth = clients.filter(user => {
    const userDate = new Date(user.createdAt);
    const currentDate = new Date();
    return userDate.getMonth() === currentDate.getMonth() && 
           userDate.getFullYear() === currentDate.getFullYear();
  }).length;

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
              { title: 'Client Management' }, 
              { title: 'All Clients' }
            ]} 
          />

          {/* Page Header */}
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <UserOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              Client Management
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>
              Manage and monitor all client accounts and their activities
            </Text>
          </div>

          {/* Statistics Cards - Only Client Focused */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Clients"
                  value={totalClients}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
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
                  title="Active Clients"
                  value={activeClients}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress 
                  percent={totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0} 
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
                  value={pendingClients}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<ClockCircleOutlined />}
                />
                <Progress 
                  percent={totalClients > 0 ? Math.round((pendingClients / totalClients) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#fa8c16"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="New This Month"
                  value={newClientsThisMonth}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<UserAddOutlined />}
                />
                <Progress 
                  percent={totalClients > 0 ? Math.round((newClientsThisMonth / totalClients) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#722ed1"
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content Card */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>All Clients ({filteredClients.length})</span>
              </Space>
            }
            extra={
              <Space>
                {/* <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => window.location.href = '/admin/add-client'}
                >
                  Add Client
                </Button> */}
                <Button 
                  icon={<ExportOutlined />}
                  onClick={exportData}
                >
                  Export
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchUsers}
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
                  placeholder="Search clients by name or email..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Filter by Status"
                  style={{ width: '100%' }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  allowClear
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="suspended">Suspended</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                {selectedRowKeys.length > 0 && (
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedRowKeys.length})
                  </Button>
                )}
              </Col>
            </Row>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredClients}
              loading={loading}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                ...tableParams.pagination,
                total: filteredClients.length,
                showTotal: (total, range) => 
                  `Showing ${range[0]}-${range[1]} of ${total} clients`,
              }}
              onChange={(pagination, filters, sorter) => {
                setTableParams({
                  pagination,
                  filters,
                  sorter,
                });
              }}
              scroll={{ x: 800 }}
              size="middle"
              className="custom-table"
            />
          </Card>

          {/* User Details Drawer */}
          <Drawer
            title={
              <Space>
                <Avatar 
                  src={selectedUser?.avatar} 
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>
                    {selectedUser?.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    Client Details
                  </div>
                </div>
              </Space>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={600}
          >
            {selectedUser && (
              <div>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Full Name">
                    {selectedUser.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable>{selectedUser.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Text copyable>{selectedUser.phone || 'Not provided'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedUser.status)}>
                      {(selectedUser.status || 'Active').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Registration Date">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => window.location.href = `/admin/edit-client/${selectedUser.id}`}
                  >
                    Edit Client
                  </Button>
                  <Button 
                    icon={<MailOutlined />}
                    onClick={() => window.open(`mailto:${selectedUser.email}`)}
                  >
                    Send Email
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setDrawerVisible(false);
                      deleteUser(selectedUser.id);
                    }}
                  >
                    Delete
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

export default ClientLists;
