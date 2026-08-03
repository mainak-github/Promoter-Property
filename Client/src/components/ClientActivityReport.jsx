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
  UserOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  ClockCircleOutlined,
  SendOutlined,
  MailOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import url from '../url';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Option } = Select;

const ClientActivityReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [users, setClients] = useState([]);
  const [leads, setLeads] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchClientActivityData();
  }, []);

  const fetchClientActivityData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. Fetch Real Clients / Users
      const usersRes = await axios.get(`${url.API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = usersRes.data?.users || usersRes.data || [];
      if (Array.isArray(usersData)) {
        const clientOnly = usersData.filter(u => u.role === 'client' || u.role === 'user' || (!u.role || (u.role !== 'admin' && u.role !== 'broker')));
        setClients(clientOnly);
      }

      // 2. Fetch Real Leads
      const leadsRes = await axios.get(`${url.API_URL}/admin/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const leadsData = leadsRes.data?.data || leadsRes.data || [];
      if (Array.isArray(leadsData)) {
        setLeads(leadsData);
      }

    } catch (err) {
      console.error('Failed to fetch client activity report:', err);
      message.error('Failed to load client activity analytics.');
    } finally {
      setLoading(false);
    }
  };

  const totalClients = users.length;
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => (!l.status || l.status === 'new')).length;
  const contactedLeads = leads.filter(l => l.status === 'contacted' || l.status === 'in_progress').length;

  const filteredLeads = leads.filter(item => {
    const name = item.name || 'Lead Inquiry';
    const email = item.email || '';
    const phone = item.phone || '';
    const type = (item.leadType || 'general').toLowerCase();

    const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase()) || 
                          email.toLowerCase().includes(searchText.toLowerCase()) ||
                          phone.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || type.includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: 'Lead ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <span style={{ fontWeight: 700, color: '#ea580c' }}>LEAD-#{id || record._id || '101'}</span>
    },
    {
      title: 'Client Name & Contact',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#0f172a' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{text || 'Anonymous Client'}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <MailOutlined style={{ marginRight: 4 }} />{record.email || record.phone || 'Contact Logged'}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Inquiry Category',
      dataIndex: 'leadType',
      key: 'leadType',
      render: type => {
        const t = (type || 'general').replace('_', ' ').toUpperCase();
        let color = t.includes('VILLA') || t.includes('SITE') ? 'volcano' : t.includes('FLAT') ? 'blue' : 'orange';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 4 }}>{t}</Tag>;
      }
    },
    {
      title: 'Target Property',
      dataIndex: 'propertyId',
      key: 'propertyId',
      render: propId => <span style={{ fontWeight: 600, color: '#334155' }}>{propId ? `Property Listing #${propId}` : 'General Inquiry'}</span>
    },
    {
      title: 'Inquiry Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => (
        <span style={{ color: '#64748b', fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />{date ? new Date(date).toLocaleDateString() : 'Recent'}
        </span>
      )
    },
    {
      title: 'Inquiry Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const s = (status || 'new').toLowerCase();
        let color = s === 'converted' ? 'success' : s === 'contacted' ? 'processing' : 'warning';
        return <Badge status={color} text={<strong style={{ textTransform: 'uppercase', fontSize: '12px' }}>{s}</strong>} />;
      }
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
                Client Activity & Inquiries Log
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Real-time buyer inquiries, property interest logs & client activity monitoring.
              </p>
            </div>

            <Space size="middle">
              <Button 
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchClientActivityData}
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
                Refresh Activity Log
              </Button>
            </Space>
          </div>

          {/* Metric Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #ea580c' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Registered Clients</span>}
                  value={totalClients}
                  valueStyle={{ color: '#ea580c', fontWeight: 800 }}
                  prefix={<UserOutlined />}
                />
                <Progress percent={100} size="small" showInfo={false} strokeColor="#ea580c" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #3b82f6' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Inquiries Logged</span>}
                  value={totalLeads}
                  valueStyle={{ color: '#3b82f6', fontWeight: 800 }}
                  prefix={<SendOutlined />}
                />
                <Progress percent={85} size="small" showInfo={false} strokeColor="#3b82f6" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #10b981' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>New Inquiries</span>}
                  value={newLeadsCount}
                  valueStyle={{ color: '#10b981', fontWeight: 800 }}
                  prefix={<EyeOutlined />}
                />
                <Progress percent={totalLeads > 0 ? Math.round((newLeadsCount / totalLeads) * 100) : 0} size="small" showInfo={false} strokeColor="#10b981" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #8b5cf6' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Contacted Leads</span>}
                  value={contactedLeads}
                  valueStyle={{ color: '#8b5cf6', fontWeight: 800 }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress percent={totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0} size="small" showInfo={false} strokeColor="#8b5cf6" />
              </Card>
            </Col>
          </Row>

          {/* Activity Log Table Container */}
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
                Live Buyer Inquiries & Activity Feed ({filteredLeads.length})
              </h3>
              <Space wrap>
                <Input
                  placeholder="Search client, email, phone..."
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 260, borderRadius: 8 }}
                />
                <Select value={filterType} onChange={setFilterType} style={{ width: 180, borderRadius: 8 }}>
                  <Option value="all">All Categories</Option>
                  <Option value="general">General Inquiry</Option>
                  <Option value="site_visit">Site Visit</Option>
                  <Option value="flat">Flat</Option>
                </Select>
              </Space>
            </div>

            <Table 
              columns={columns} 
              dataSource={filteredLeads} 
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

export default ClientActivityReport;
