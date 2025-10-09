import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Typography, Spin, Space, Avatar, Tag, Breadcrumb, message } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';

const { Content } = Layout;
const { Title, Text } = Typography;

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!id) {
      message.error('User ID not found in URL.');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${url.API_URL}/auth/userDetails/${id}`);
        const userData = response.data.UserDetails?.[0];
        if (userData) {
          setUser(userData);
        } else {
          message.warning('No user data found.');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        message.error('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <DashboardSidebar />
        <Layout>
          <DashboardNavbar />
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spin size="large" tip="Loading User details..." />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Clients' }, { title: 'User Details' }]} />
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            <UserOutlined /> User Profile Overview
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {user ? (
              <Col xs={24} md={12} lg={10}>
                <Card
                  hoverable
                  style={{ background: 'linear-gradient(135deg, #1677ff, #597ef7)', color: '#fff' }}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar size={128} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
                      <Title level={3} style={{ color: '#fff', margin: 0 }}>{user.name}</Title>
                    </div>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Space>
                        <MailOutlined style={{ fontSize: '18px' }} />
                        <Text strong style={{ color: '#fff' }}>Email:</Text>
                        <Text style={{ color: '#fff' }}>{user.email}</Text>
                      </Space>
                      <Space>
                        <UserOutlined style={{ fontSize: '18px' }} />
                        <Text strong style={{ color: '#fff' }}>Role:</Text>
                        <Tag color="blue">{user.role}</Tag>
                      </Space>
                      <Space>
                        <CalendarOutlined style={{ fontSize: '18px' }} />
                        <Text strong style={{ color: '#fff' }}>Joined:</Text>
                        <Text style={{ color: '#fff' }}>{format(new Date(user.createdAt), 'MMMM d, yyyy')}</Text>
                      </Space>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ) : (
              <Col>
                <Alert message="No User data available." type="info" showIcon />
              </Col>
            )}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDetails;


