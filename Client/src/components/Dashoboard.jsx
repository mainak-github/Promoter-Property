import React, { useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Card, Row, Col, Space, Statistic, Dropdown, Button, App } from 'antd';
import { DownOutlined, SyncOutlined, FilterOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar from '../common/Dashboard_Sidebar';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const { message, modal } = App.useApp();

  useEffect(() => {
    // Prevent user if they are not logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      message.error('Access denied. Admin login required.');
      window.location.href = '/admin/login';
    }
  }, [message]);

  const handleDateRangeClick = () => {
    modal.info({
      title: 'Date Range Picker',
      content: 'Ant Design provides a DatePicker component for this functionality. This button is a placeholder.'
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px 0', padding: 24, minHeight: 280, background: '#fff' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div className="page-title-box">
                <h4 className="page-title">Dashboard</h4>
              </div>
              <Space>
                <Button onClick={handleDateRangeClick}>
                  <FilterOutlined /> Filter
                </Button>
                <Button type="primary" icon={<SyncOutlined />}>Refresh</Button>
                <Button type="primary" onClick={handleDateRangeClick}>
                  <Space>
                    <FilterOutlined />
                    <DownOutlined />
                  </Space>
                </Button>
              </Space>
            </div>
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Space direction="vertical">
                    <Statistic
                      title="Customers"
                      value={36254}
                      prefix={<UserOutlined />}
                      suffix={<span style={{ color: '#52c41a' }}>+5.27%</span>}
                    />
                    <small>Since last month</small>
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Space direction="vertical">
                    <Statistic
                      title="Orders"
                      value={5543}
                      prefix={<ShoppingCartOutlined />}
                      suffix={<span style={{ color: '#f5222d' }}>-1.08%</span>}
                    />
                    <small>Since last month</small>
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Space direction="vertical">
                    <Statistic
                      title="Revenue"
                      value={6254}
                      prefix={<DollarOutlined />}
                      suffix={<span style={{ color: '#f5222d' }}>-7.00%</span>}
                    />
                    <small>Since last month</small>
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Space direction="vertical">
                    <Statistic
                      title="Growth"
                      value="+30.56%"
                      prefix={<RiseOutlined />}
                      suffix={<span style={{ color: '#52c41a' }}>+4.87%</span>}
                    />
                    <small>Since last month</small>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;