import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Space, Statistic, Table, Tag, List, Avatar, Breadcrumb,Input,Button  } from 'antd';
import {
  UserOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined,
  SyncOutlined, SearchOutlined, HomeOutlined, DashboardOutlined,MailOutlined 
} from '@ant-design/icons';
import DashboardSidebar3 from '../common/Dashboard_Sidebar3';
import DashboardNavbar from '../common/Dashboard_Navbar';
import SEOHead from '../common/SEOHead';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const ClientDashboard = () => {
  useEffect(() => {
    // Prevent user if they are not logged in
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  // Placeholder data for demonstration
  const topSellingProducts = [
    { key: '1', name: 'ASOS Ridley High Waist', price: '$79.49', quantity: 82, amount: '$6,518.18' },
    { key: '2', name: 'Marco Lightweight Shirt', price: '$128.50', quantity: 37, amount: '$4,754.50' },
    { key: '3', name: 'Half Sleeve Shirt', price: '$39.99', quantity: 64, amount: '$2,559.36' },
    { key: '4', name: 'Lightweight Jacket', price: '$20.00', quantity: 184, amount: '$3,680.00' },
    { key: '5', name: 'Marco Shoes', price: '$28.49', quantity: 69, amount: '$1,965.81' },
  ];

  const recentActivity = [
    { key: '1', title: 'You sold an item', description: 'Paul Burgess just purchased "Hyper - Admin Dashboard"!', time: '5 minutes ago', icon: <UserOutlined style={{ color: '#1890ff' }} /> },
    { key: '2', title: 'Product on the Bootstrap Market', description: 'Dave Gamache added Admin Dashboard', time: '30 minutes ago', icon: <HomeOutlined style={{ color: '#52c41a' }} /> },
    { key: '3', title: 'Robert Delaney', description: 'Send you message Are you there?', time: '2 hours ago', icon: <MailOutlined style={{ color: '#fa8c16' }} /> },
  ];

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar3 />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Dashboard' }]} />
          <Title level={4}>Client Dashboard</Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Customers"
                  value={36254}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Orders"
                  value={5543}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Revenue"
                  value={6254}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Growth"
                  value="30.56%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Top Selling Products" extra={<Button type="primary">Export</Button>}>
                <Table
                  columns={columns}
                  dataSource={topSellingProducts}
                  pagination={false}
                  bordered
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Recent Activity" extra={<Button type="primary">Refresh</Button>}>
                <List
                  itemLayout="horizontal"
                  dataSource={recentActivity}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={item.icon} style={{ backgroundColor: item.icon.props.style.color }} />}
                        title={<a href="#">{item.title}</a>}
                        description={item.description}
                      />
                      <Text type="secondary">{item.time}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientDashboard;