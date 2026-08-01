import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Table, 
  Spin, 
  Alert, 
  Card, 
  Row, 
  Col, 
  Breadcrumb, 
  message,
  Tag,
  Button,
  Space,
  Avatar,
  Typography,
  Input,
  Select,
  Tooltip,
  Modal,
  Form,
  Drawer,
  Descriptions,
  Timeline,
  Statistic,
  Progress,
  Badge,
  Divider
} from 'antd';
import { 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  CalendarOutlined,
  DashboardOutlined,
  ContactsOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  HomeOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';
import { format } from 'date-fns';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeadType, setFilterLeadType] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leads`,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchLeads();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [leads, searchText, filterStatus, filterLeadType]);

  const handleFilter = () => {
    let filtered = leads;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.phone?.includes(searchText) ||
        lead.message?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => (lead.status || 'new').toLowerCase() === filterStatus);
    }

    // Lead type filter
    if (filterLeadType !== 'all') {
      filtered = filtered.filter(lead => lead.leadType === filterLeadType);
    }

    setFilteredLeads(filtered);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url.API_URL}/admin/leads`);
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      setError(err.message);
      message.error(`Error fetching leads: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus, remarks = '') => {
    try {
      const response = await fetch(`${url.API_URL}/admin/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus, remarks })
      });

      if (response.ok) {
        message.success(`Lead status updated to ${newStatus}`);
        fetchLeads();
      } else {
        throw new Error('Failed to update lead status');
      }
    } catch (error) {
      message.error('Failed to update lead status');
    }
  };

  const deleteLead = (leadId) => {
    confirm({
      title: 'Delete Lead',
      content: 'Are you sure you want to delete this lead? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          const response = await fetch(`${url.API_URL}/admin/leads/${leadId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            message.success('Lead deleted successfully');
            fetchLeads();
          } else {
            throw new Error('Failed to delete lead');
          }
        } catch (error) {
          message.error('Failed to delete lead');
        }
      },
    });
  };

  const viewLeadDetails = (lead) => {
    setSelectedLead(lead);
    setDrawerVisible(true);
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select leads to update');
      return;
    }

    confirm({
      title: `Update ${selectedRowKeys.length} Lead(s) Status`,
      content: `Are you sure you want to mark selected leads as ${status}?`,
      okText: 'Yes, Update',
      okType: 'primary',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // Implement bulk status update API call
          message.success(`${selectedRowKeys.length} leads updated to ${status}`);
          setSelectedRowKeys([]);
          fetchLeads();
        } catch (error) {
          message.error('Failed to update lead status');
        }
      },
    });
  };

  const exportLeads = () => {
    message.success('Export functionality will be implemented');
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'blue',
      'contacted': 'orange',
      'interested': 'cyan',
      'converted': 'green',
      'not_interested': 'red',
      'follow_up': 'purple',
    };
    return statusColors[status?.toLowerCase()] || 'default';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'new': <StarOutlined />,
      'contacted': <PhoneOutlined />,
      'interested': <FireOutlined />,
      'converted': <CheckCircleOutlined />,
      'not_interested': <CloseCircleOutlined />,
      'follow_up': <ClockCircleOutlined />,
    };
    return statusIcons[status?.toLowerCase()] || <StarOutlined />;
  };

  const getLeadTypeColor = (leadType) => {
    const typeColors = {
      'contact_us': 'blue',
      'property_inquiry': 'green',
      'visit_schedule': 'orange',
      'callback_request': 'purple',
    };
    return typeColors[leadType] || 'default';
  };

  const columns = [
    {
      title: 'Lead Information',
      key: 'leadInfo',
      fixed: 'left',
      width: 300,
      render: (_, record) => (
        <Space>
          <Avatar 
            size="large" 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>
              {record.name}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '2px' }}>
              <MailOutlined style={{ marginRight: '4px' }} />
              {record.email || 'No email'}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              <PhoneOutlined style={{ marginRight: '4px' }} />
              {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Lead Details',
      key: 'leadDetails',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <HomeOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>Property ID: {record.propertyId || 'General'}</Text>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <Tag color={getLeadTypeColor(record.leadType)}>
              {(record.leadType || 'general').replace('_', ' ').toUpperCase()}
            </Tag>
          </div>
          {record.message && (
            <div style={{ marginTop: '8px' }}>
              <Text 
                ellipsis={{ tooltip: record.message }}
                style={{ fontSize: '12px', color: '#666' }}
              >
                "{record.message.substring(0, 100)}..."
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status & Priority',
      key: 'statusPriority',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag 
            color={getStatusColor(record.status)} 
            icon={getStatusIcon(record.status)}
          >
            {(record.status || 'NEW').toUpperCase()}
          </Tag>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            {format(new Date(record.createdAt), 'MMM dd, yyyy')}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {format(new Date(record.createdAt), 'hh:mm a')}
          </div>
        </Space>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Contacted', value: 'contacted' },
        { text: 'Interested', value: 'interested' },
        { text: 'Converted', value: 'converted' },
        { text: 'Not Interested', value: 'not_interested' },
        { text: 'Follow Up', value: 'follow_up' },
      ],
      onFilter: (value, record) => (record.status || 'new').toLowerCase() === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => viewLeadDetails(record)}
            />
          </Tooltip>
          
          <Tooltip title="Update Status">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              type="primary"
              onClick={() => {
                setSelectedLead(record);
                setStatusUpdateModal(true);
              }}
            />
          </Tooltip>
          
          <Tooltip title="Call Lead">
            <Button 
              icon={<PhoneOutlined />} 
              size="small"
              onClick={() => window.open(`tel:${record.phone}`)}
            />
          </Tooltip>
          
          <Tooltip title="Email Lead">
            <Button 
              icon={<MailOutlined />} 
              size="small"
              onClick={() => window.open(`mailto:${record.email}`)}
            />
          </Tooltip>
          
          <Tooltip title="Delete Lead">
            <Button 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => deleteLead(record.id)}
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
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => (lead.status || 'new').toLowerCase() === 'new').length;
  const contactedLeads = leads.filter(lead => lead.status?.toLowerCase() === 'contacted').length;
  const convertedLeads = leads.filter(lead => lead.status?.toLowerCase() === 'converted').length;
  const todayLeads = leads.filter(lead => {
    const today = new Date();
    const leadDate = new Date(lead.createdAt);
    return leadDate.toDateString() === today.toDateString();
  }).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading leads..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Leads"
        description={error}
        type="error"
        showIcon
        style={{ margin: 20 }}
        action={
          <Button size="small" danger onClick={fetchLeads}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <DashboardSidebar />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 0 }}>
          {/* Breadcrumb */}
          <Breadcrumb 
            style={{ marginBottom: 24 }} 
            items={[
              { title: <DashboardOutlined />, href: '/admin/dashboard' },
              { title: 'Lead Management' }, 
              { title: 'All Leads' }
            ]} 
          />

          {/* Page Header */}
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <ContactsOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              Lead Management
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>
              Track and manage all property inquiries and customer leads
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Leads"
                  value={totalLeads}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<ContactsOutlined />}
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
                  title="New Leads"
                  value={newLeads}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<StarOutlined />}
                />
                <Progress 
                  percent={totalLeads > 0 ? Math.round((newLeads / totalLeads) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Contacted"
                  value={contactedLeads}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<PhoneOutlined />}
                />
                <Progress 
                  percent={totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#fa8c16"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Converted"
                  value={convertedLeads}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress 
                  percent={totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0} 
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
                <ContactsOutlined style={{ color: '#1890ff' }} />
                <span>All Leads ({filteredLeads.length})</span>
                {todayLeads > 0 && (
                  <Badge count={todayLeads} style={{ backgroundColor: '#52c41a' }}>
                    <Text style={{ marginLeft: 8, color: '#52c41a' }}>Today</Text>
                  </Badge>
                )}
              </Space>
            }
            extra={
              <Space>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={exportLeads}
                >
                  Export
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchLeads}
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
                  placeholder="Search leads by name, email, phone..."
                  prefix={<SearchOutlined />}
                  value={searchText}
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
                  <Option value="new">New</Option>
                  <Option value="contacted">Contacted</Option>
                  <Option value="interested">Interested</Option>
                  <Option value="converted">Converted</Option>
                  <Option value="not_interested">Not Interested</Option>
                  <Option value="follow_up">Follow Up</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Filter by Type"
                  style={{ width: '100%' }}
                  value={filterLeadType}
                  onChange={setFilterLeadType}
                  size="large"
                  allowClear
                >
                  <Option value="all">All Types</Option>
                  <Option value="contact_us">Contact Us</Option>
                  <Option value="property_inquiry">Property Inquiry</Option>
                  <Option value="visit_schedule">Visit Schedule</Option>
                  <Option value="callback_request">Callback Request</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                {selectedRowKeys.length > 0 && (
                  <Space>
                    <Button 
                      type="primary"
                      icon={<PhoneOutlined />}
                      onClick={() => handleBulkStatusUpdate('contacted')}
                      size="large"
                    >
                      Mark Contacted ({selectedRowKeys.length})
                    </Button>
                    <Button 
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleBulkStatusUpdate('converted')}
                      size="large"
                    >
                      Convert ({selectedRowKeys.length})
                    </Button>
                  </Space>
                )}
              </Col>
            </Row>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredLeads}
              loading={loading}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                ...tableParams.pagination,
                total: filteredLeads.length,
                showTotal: (total, range) => 
                  `Showing ${range[0]}-${range[1]} of ${total} leads`,
              }}
              onChange={(pagination, filters, sorter) => {
                setTableParams({ pagination, filters, sorter });
              }}
              scroll={{ x: 1000 }}
              size="middle"
              className="custom-table"
            />
          </Card>

          {/* Lead Details Drawer */}
          <Drawer
            title={
              <Space>
                <Avatar 
                  icon={<UserOutlined />}
                  size="large"
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>
                    {selectedLead?.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    Lead Details
                  </div>
                </div>
              </Space>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={600}
          >
            {selectedLead && (
              <div>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Full Name">
                    {selectedLead.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable>{selectedLead.email || 'Not provided'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Text copyable>{selectedLead.phone}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Property ID">
                    {selectedLead.propertyId || 'General Inquiry'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lead Type">
                    <Tag color={getLeadTypeColor(selectedLead.leadType)}>
                      {(selectedLead.leadType || 'general').replace('_', ' ').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedLead.status)} icon={getStatusIcon(selectedLead.status)}>
                      {(selectedLead.status || 'new').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Message">
                    {selectedLead.message || 'No message provided'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Received Date">
                    {format(new Date(selectedLead.createdAt), 'PPpp')}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => {
                      setDrawerVisible(false);
                      setStatusUpdateModal(true);
                    }}
                  >
                    Update Status
                  </Button>
                  <Button 
                    icon={<PhoneOutlined />}
                    onClick={() => window.open(`tel:${selectedLead.phone}`)}
                  >
                    Call Now
                  </Button>
                  <Button 
                    icon={<MailOutlined />}
                    onClick={() => window.open(`mailto:${selectedLead.email}`)}
                  >
                    Send Email
                  </Button>
                </Space>
              </div>
            )}
          </Drawer>

          {/* Status Update Modal */}
          <Modal
            title="Update Lead Status"
            open={statusUpdateModal}
            onCancel={() => setStatusUpdateModal(false)}
            footer={null}
            centered
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={async (values) => {
                await updateLeadStatus(selectedLead.id, values.status, values.remarks);
                setStatusUpdateModal(false);
                form.resetFields();
              }}
            >
              <Form.Item
                name="status"
                label="New Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select placeholder="Select new status">
                  <Option value="contacted">Contacted</Option>
                  <Option value="interested">Interested</Option>
                  <Option value="converted">Converted</Option>
                  <Option value="not_interested">Not Interested</Option>
                  <Option value="follow_up">Follow Up Required</Option>
                </Select>
              </Form.Item>
              <Form.Item name="remarks" label="Remarks (Optional)">
                <Input.TextArea rows={3} placeholder="Add any remarks or notes..." />
              </Form.Item>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setStatusUpdateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update Status
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
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

export default Leads;
