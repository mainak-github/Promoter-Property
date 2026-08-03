import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Avatar, 
  Tag, 
  Space, 
  Divider, 
  message, 
  Upload,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  UploadOutlined, 
  SaveOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;

const AdminProfile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    form.setFieldsValue({
      name: currentUser.name || currentUser.fullName || 'Promoter Admin',
      email: currentUser.email || 'pp@gmail.com',
      phone: currentUser.phone || currentUser.mobile || '+91 98765 43210',
      role: currentUser.role || 'admin',
      location: 'Mumbai, Maharashtra, India',
      bio: 'Head Administrator of Promoter Property Real Estate Portal.'
    });
  }, []);

  const handleUpdateProfile = (values) => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...currentUser, name: values.name, email: values.email, phone: values.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      message.success('Profile information updated successfully!');
      setLoading(false);
    }, 600);
  };

  const handleUpdatePassword = () => {
    message.success('Security password updated successfully!');
    passwordForm.resetFields();
  };

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
                ACCOUNT SETTINGS
              </div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>
                My Administrator Profile
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Manage personal account info, security credentials & portal profile preferences.
              </p>
            </div>

            <Tag color="#ea580c" style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: 8 }}>
              <SafetyOutlined style={{ marginRight: 6 }} /> SUPER ADMIN
            </Tag>
          </div>

          <Row gutter={[24, 24]}>
            {/* Left Overview Column */}
            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', textAlign: 'center', padding: '16px 0' }}>
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#ea580c', marginBottom: 16, boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)' }} 
                />
                <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>
                  {currentUser.name || currentUser.fullName || 'Promoter Admin'}
                </h3>
                <p style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', margin: '4px 0 12px 0' }}>
                  System Administrator
                </p>
                <Badge status="processing" text={<span style={{ color: '#10b981', fontWeight: 700 }}>Account Active & Verified</span>} />

                <Divider style={{ margin: '20px 0' }} />

                <div style={{ textAlign: 'left', padding: '0 12px' }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                      <MailOutlined style={{ marginRight: 6, color: '#ea580c' }} />
                      {currentUser.email || 'pp@gmail.com'}
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Phone Contact</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                      <PhoneOutlined style={{ marginRight: 6, color: '#ea580c' }} />
                      {currentUser.phone || '+91 98765 43210'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Access Level</div>
                    <Tag color="volcano" style={{ fontWeight: 700, marginTop: 4 }}>Full Portal Administrative Access</Tag>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Right Forms Column */}
            <Col xs={24} lg={16}>
              {/* Profile Details Form */}
              <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Edit Account Details</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', marginBottom: 24 }}>
                <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="name" label={<span style={{ fontWeight: 700 }}>Full Name</span>} rules={[{ required: true }]}>
                        <Input size="large" prefix={<UserOutlined style={{ color: '#94a3b8' }} />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="email" label={<span style={{ fontWeight: 700 }}>Email Address</span>} rules={[{ required: true, type: 'email' }]}>
                        <Input size="large" prefix={<MailOutlined style={{ color: '#94a3b8' }} />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="phone" label={<span style={{ fontWeight: 700 }}>Phone Number</span>}>
                        <Input size="large" prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="location" label={<span style={{ fontWeight: 700 }}>Office Location</span>}>
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="bio" label={<span style={{ fontWeight: 700 }}>Administrator Bio</span>}>
                    <Input.TextArea rows={3} />
                  </Form.Item>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />} 
                    loading={loading}
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      borderColor: '#ea580c',
                      height: 44,
                      fontWeight: 800,
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    Save Profile Changes
                  </Button>
                </Form>
              </Card>

              {/* Password Change Card */}
              <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Security & Change Password</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                <Form form={passwordForm} layout="vertical" onFinish={handleUpdatePassword}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="currentPassword" label={<span style={{ fontWeight: 700 }}>Current Password</span>} rules={[{ required: true }]}>
                        <Input.Password size="large" prefix={<LockOutlined style={{ color: '#94a3b8' }} />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="newPassword" label={<span style={{ fontWeight: 700 }}>New Password</span>} rules={[{ required: true, min: 6 }]}>
                        <Input.Password size="large" prefix={<LockOutlined style={{ color: '#94a3b8' }} />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<CheckCircleOutlined />} 
                    style={{
                      background: '#0f172a',
                      borderColor: '#0f172a',
                      height: 42,
                      fontWeight: 700,
                      borderRadius: 8
                    }}
                  >
                    Update Password
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminProfile;
