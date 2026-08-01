import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, message, Card, Row, Col, Typography, Spin, Space, Avatar, Tag, Breadcrumb } from 'antd';
import { UserOutlined, MailOutlined, KeyOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';
import DashboardSidebar3 from '../common/Dashboard_Sidebar3';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';

const { Content } = Layout;
const { Title, Text } = Typography;

const MyClientProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  const userId = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}')?.id : null;

  useEffect(() => {
    // Basic authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    if (!userId) {
      message.error('User ID not found.');
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${url.API_URL}/auth/userDetails/${userId}`);
        const user = res.data.UserDetails?.[0];
        if (user) {
          setProfileData(user);
          form.setFieldsValue({
            name: user.name,
            email: user.email,
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        message.error('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`${url.API_URL}/auth/updateUser/${userId}`, values);
      message.success('Profile updated successfully!');
      // Update local state and form fields
      setProfileData(prev => ({ ...prev, ...values }));
    } catch (err) {
      console.error('Update failed:', err);
      message.error('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <DashboardSidebar3 />
        <Layout>
          <DashboardNavbar />
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spin size="large" tip="Loading profile..." />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar3 />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Profile Management' }, { title: 'My Profile' }]} />
          <Title level={4} style={{ marginBottom: 24 }}>Update Profile</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Update Profile Details" bordered={false}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Full Name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[{ required: true, message: 'Please enter your email address!', type: 'email' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email Address" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    help="Leave blank to keep your current password."
                  >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Account Information" bordered={false}>
                <Space direction="vertical" size="large">
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={128} src="https://i.pravatar.cc/150?u=demo" icon={<UserOutlined />} />
                    <Title level={5} style={{ marginTop: 16 }}>{profileData.name || 'N/A'}</Title>
                    <Text type="secondary">{profileData.email || 'N/A'}</Text>
                  </div>
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
                    <Space direction="vertical" size="middle">
                      <Space>
                        <UserOutlined />
                        <Text strong>Role:</Text>
                        <Tag color="blue">{profileData.role || 'client'}</Tag>
                      </Space>
                      <Space>
                        <CalendarOutlined />
                        <Text strong>Client Since:</Text>
                        {profileData.createdAt ? (
                          <Text>{format(new Date(profileData.createdAt), 'MMMM d, yyyy')}</Text>
                        ) : (
                          <Text>N/A</Text>
                        )}
                      </Space>
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyClientProfile;
