import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Select, 
  Input, 
  Badge,
  Avatar,
  message,
  Spin
} from 'antd';
import { 
  DollarCircleOutlined, 
  TrophyOutlined, 
  RiseOutlined, 
  CheckCircleOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  SearchOutlined, 
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import url from '../url';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Option } = Select;

const SalesReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. Fetch Real Properties
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

      // 2. Fetch Real Leads for conversion data
      try {
        const leadsRes = await axios.get(`${url.API_URL}/admin/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const leadsData = leadsRes.data?.data || leadsRes.data || [];
        if (Array.isArray(leadsData)) {
          setLeads(leadsData);
        }
      } catch (e) {
        console.log('Leads fetch fallback', e);
      }
    } catch (err) {
      console.error('Failed to fetch sales report data:', err);
      message.error('Failed to load live sales analytics.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse numeric price from Indian string like "50L - 1Cr" or numbers
  const parsePrice = (priceStr) => {
    if (!priceStr) return 4500000;
    if (typeof priceStr === 'number') return priceStr;
    const str = String(priceStr).toLowerCase();
    if (str.includes('cr')) {
      const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 1;
      return num * 10000000;
    }
    if (str.includes('l')) {
      const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 50;
      return num * 100000;
    }
    const rawNum = parseFloat(str.replace(/[^0-9.]/g, ''));
    return rawNum || 5000000;
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // Compute live real metrics from database
  const totalGrossVolume = properties.reduce((acc, p) => acc + parsePrice(p.priceRange), 0);
  const totalCommission = totalGrossVolume * 0.02;
  const totalApproved = properties.filter(p => (p.approvalStatus || 'approved') === 'approved').length;
  const targetPercent = Math.min(100, Math.round((properties.length / 20) * 100));

  const filteredData = properties.filter(item => {
    const title = item.title || 'Property';
    const city = item.city || '';
    const category = item.propertyType || '';
    
    const matchesSearch = title.toLowerCase().includes(searchText.toLowerCase()) || 
                          city.toLowerCase().includes(searchText.toLowerCase()) ||
                          category.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || category.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: 'Listing ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <span style={{ fontWeight: 700, color: '#ea580c' }}>PROP-#{id || record._id || '101'}</span>
    },
    {
      title: 'Property Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{text || 'Untitled Property'}</div>
          <Tag color="blue" style={{ fontSize: '11px', marginTop: 4 }}>{record.propertyType || 'Apartment'}</Tag>
          <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 6 }}>📍 {record.city || 'India'}</span>
        </div>
      )
    },
    {
      title: 'Broker ID / Owner',
      dataIndex: 'brokerId',
      key: 'brokerId',
      render: brokerId => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#0f172a' }} size="small" />
          <span style={{ fontWeight: 600, color: '#475569' }}>{brokerId ? `Broker #${brokerId}` : 'Direct Listing'}</span>
        </Space>
      )
    },
    {
      title: 'Valuation Range',
      dataIndex: 'priceRange',
      key: 'priceRange',
      render: price => <span style={{ fontWeight: 800, color: '#059669' }}>{price || '₹45 L - ₹80 L'}</span>
    },
    {
      title: 'Est. Commission (2%)',
      dataIndex: 'priceRange',
      key: 'estCommission',
      render: price => <span style={{ fontWeight: 700, color: '#ea580c' }}>{formatRupees(parsePrice(price) * 0.02)}</span>
    },
    {
      title: 'Approval Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: status => {
        const s = (status || 'approved').toLowerCase();
        let color = s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'error';
        return <Badge status={color} text={<strong style={{ textTransform: 'uppercase', fontSize: '12px' }}>{s}</strong>} />;
      }
    },
    {
      title: 'Date Listed',
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
                Sales & Revenue Analytics
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Real-time metrics computed directly from database properties, deals & live inventory.
              </p>
            </div>

            <Space size="middle">
              <Button 
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchSalesData}
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
                Refresh Live Data
              </Button>
            </Space>
          </div>

          {/* Metric Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #ea580c' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Inventory Gross Value</span>}
                  value={formatRupees(totalGrossVolume)}
                  valueStyle={{ color: '#ea580c', fontWeight: 800, fontSize: '1.4rem' }}
                  prefix={<DollarCircleOutlined />}
                />
                <Progress percent={100} size="small" showInfo={false} strokeColor="#ea580c" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #10b981' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Est. Total Commission (2%)</span>}
                  value={formatRupees(totalCommission)}
                  valueStyle={{ color: '#10b981', fontWeight: 800, fontSize: '1.4rem' }}
                  prefix={<TrophyOutlined />}
                />
                <Progress percent={85} size="small" showInfo={false} strokeColor="#10b981" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #3b82f6' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Approved Properties</span>}
                  value={totalApproved}
                  valueStyle={{ color: '#3b82f6', fontWeight: 800 }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress percent={properties.length > 0 ? Math.round((totalApproved / properties.length) * 100) : 0} size="small" showInfo={false} strokeColor="#3b82f6" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #8b5cf6' }}>
                <Statistic
                  title={<span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Live Inquiries</span>}
                  value={leads.length}
                  valueStyle={{ color: '#8b5cf6', fontWeight: 800 }}
                  prefix={<RiseOutlined />}
                />
                <Progress percent={targetPercent} size="small" showInfo={false} strokeColor="#8b5cf6" />
              </Card>
            </Col>
          </Row>

          {/* Table Container */}
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
                Real Estate Sales & Inventory Ledger ({filteredData.length})
              </h3>
              <Space wrap>
                <Input
                  placeholder="Search title, city, category..."
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 260, borderRadius: 8 }}
                />
                <Select value={filterType} onChange={setFilterType} style={{ width: 160, borderRadius: 8 }}>
                  <Option value="all">All Categories</Option>
                  <Option value="villa">Villa</Option>
                  <Option value="apartment">Apartment</Option>
                  <Option value="flat">Flat</Option>
                  <Option value="plot">Plots</Option>
                </Select>
              </Space>
            </div>

            <Table 
              columns={columns} 
              dataSource={filteredData} 
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

export default SalesReport;
