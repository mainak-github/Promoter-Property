import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Select, 
  Input, 
  Avatar,
  Badge,
  message
} from 'antd';
import { 
  TeamOutlined, 
  TrophyOutlined, 
  CheckCircleOutlined, 
  ReloadOutlined, 
  SearchOutlined, 
  StarFilled,
  MailOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import url from '../url';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Option } = Select;

const BrokerReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [brokers, setBrokers] = useState([]);
  const [properties, setProperties] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBrokerReportData();
  }, []);

  const fetchBrokerReportData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. Fetch Real Brokers
      const brokerRes = await axios.get(`${url.API_URL}/admin/brokers/allbrokers`);
      const brokerData = brokerRes.data?.brokers || brokerRes.data?.data || brokerRes.data || [];
      if (Array.isArray(brokerData)) {
        setBrokers(brokerData);
      }

      // 2. Fetch Real Properties to compute broker listing contributions
      const propsRes = await axios.get(`${url.API_URL}/public/properties?page=1&limit=100`);
      let allProps = [];
      if (propsRes.data?.status === 'success' && Array.isArray(propsRes.data.data?.properties)) {
        allProps = propsRes.data.data.properties;
      } else if (Array.isArray(propsRes.data?.properties)) {
        allProps = propsRes.data.properties;
      } else if (Array.isArray(propsRes.data)) {
        allProps = propsRes.data;
      }
      setProperties(allProps);

    } catch (err) {
      console.error('Failed to fetch broker report data:', err);
      message.error('Failed to load broker partner analytics.');
    } finally {
      setLoading(false);
    }
  };

  const totalBrokers = brokers.length;
  const approvedBrokers = brokers.filter(b => (b.status || b.approval_status) === 'approved').length;
  const pendingBrokers = brokers.filter(b => (b.status || b.approval_status || 'pending') === 'pending').length;

  const filteredBrokers = brokers.filter(item => {
    const name = item.fullName || item.name || item.full_name || item.companyName || 'Broker Partner';
    const email = item.email || '';
    const phone = item.mobile || item.phone || '';
    const status = (item.status || item.approval_status || 'pending').toLowerCase();

    const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase()) || 
                          email.toLowerCase().includes(searchText.toLowerCase()) ||
                          phone.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Partner ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <span style={{ fontWeight: 700, color: '#ea580c' }}>BRK-#{id || record._id || '101'}</span>
    },
    {
      title: 'Broker / Agency Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => {
        const brokerName = text || record.companyName || record.name || record.full_name || 'Registered Broker';
        return (
          <Space>
            <Avatar style={{ backgroundColor: '#ea580c', fontWeight: 700 }}>{brokerName[0].toUpperCase()}</Avatar>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{brokerName}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <MailOutlined style={{ marginRight: 4 }} />{record.email || 'No email registered'}
              </div>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Phone Contact',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (mobile, record) => <span style={{ fontWeight: 600, color: '#475569' }}>{mobile || record.phone || 'N/A'}</span>
    },
    {
      title: 'Verification Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const s = (status || record.approval_status || 'pending').toLowerCase();
        let color = s === 'approved' ? 'gold' : s === 'rejected' ? 'red' : 'orange';
        return <Tag color={color} icon={<StarFilled />} style={{ fontWeight: 700, textTransform: 'uppercase' }}>{s}</Tag>;
      }
    },
    {
      title: 'Listings Count',
      dataIndex: 'id',
      key: 'listingsCount',
      render: (id, record) => {
        const count = properties.filter(p => p.brokerId === id || p.brokerId === record._id).length;
        return <span style={{ fontWeight: 700, color: '#0f172a' }}>{count} Properties</span>;
      }
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => <span style={{ color: '#64748b', fontSize: '12px' }}>{date ? new Date(date).toLocaleDateString() : 'Recent'}</span>
    }
  ];

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
                LIVE DATABASE ANALYTICS
              </div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>
                Broker & Partner Performance
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Real-time partner verification status, property contribution & broker analytics.
              </p>
            </div>

            <Space size="middle">
              <Button 
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchBrokerReportData}
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
                Refresh Broker Data
              </Button>
            </Space>
          </div>

          {/* Metric Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #ea580c' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Registered Brokers</span>}
                  value={totalBrokers}
                  valueStyle={{ color: '#ea580c', fontWeight: 800 }}
                  prefix={<TeamOutlined />}
                />
                <Progress percent={100} size="small" showInfo={false} strokeColor="#ea580c" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #10b981' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Approved Partners</span>}
                  value={approvedBrokers}
                  valueStyle={{ color: '#10b981', fontWeight: 800 }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress percent={totalBrokers > 0 ? Math.round((approvedBrokers / totalBrokers) * 100) : 0} size="small" showInfo={false} strokeColor="#10b981" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #f59e0b' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Pending Approvals</span>}
                  value={pendingBrokers}
                  valueStyle={{ color: '#f59e0b', fontWeight: 800 }}
                  prefix={<ClockCircleOutlined />}
                />
                <Progress percent={totalBrokers > 0 ? Math.round((pendingBrokers / totalBrokers) * 100) : 0} size="small" showInfo={false} strokeColor="#f59e0b" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #3b82f6' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Inventory Contributions</span>}
                  value={properties.length}
                  valueStyle={{ color: '#3b82f6', fontWeight: 800 }}
                  prefix={<TrophyOutlined />}
                />
                <Progress percent={82} size="small" showInfo={false} strokeColor="#3b82f6" />
              </Card>
            </Col>
          </Row>

          {/* Leaderboard Table Container */}
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
                Broker Directory & Contribution Matrix ({filteredBrokers.length})
              </h3>
              <Space wrap>
                <Input
                  placeholder="Search name, email, phone..."
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 260, borderRadius: 8 }}
                />
                <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160, borderRadius: 8 }}>
                  <Option value="all">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Space>
            </div>

            <Table 
              columns={columns} 
              dataSource={filteredBrokers} 
              pagination={{ pageSize: 10 }} 
              loading={loading}
              rowKey={record => record.id || record._id || Math.random()}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BrokerReport;
