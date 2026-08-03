import React, { useState } from 'react';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Switch, 
  Select, 
  InputNumber, 
  Divider, 
  message, 
  Tabs,
  Tag
} from 'antd';
import { 
  SettingOutlined, 
  SafetyOutlined, 
  BellOutlined, 
  GlobalOutlined, 
  SaveOutlined, 
  CheckCircleOutlined,
  LockOutlined
} from '@ant-design/icons';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const { Content } = Layout;
const { Option } = Select;

const AdminSettings = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('System configuration & portal settings saved successfully!');
      setLoading(false);
    }, 600);
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
                PORTAL CONFIGURATION
              </div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>
                System & Admin Settings
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Configure portal branding, broker approval policies, security & notification preferences.
              </p>
            </div>

            <Button 
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveSettings}
              loading={loading}
              style={{
                background: '#ea580c',
                borderColor: '#ea580c',
                color: '#ffffff',
                fontWeight: 800,
                height: 42,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              Save Configuration
            </Button>
          </div>

          {/* Form Container */}
          <Form 
            form={form} 
            layout="vertical" 
            initialValues={{
              portalName: 'Promoter Property Real Estate Portal',
              supportEmail: 'support@promoterproperty.com',
              contactPhone: '+91 98765 43210',
              currencySymbol: '₹ (INR)',
              autoApproveBrokers: false,
              autoApproveListings: false,
              defaultCommission: 2,
              maxPhotosPerListing: 20,
              emailNewSubmissions: true,
              emailLeadInquiries: true,
              dailyDigest: false,
              enforce2FA: false,
              sessionTimeout: 60
            }}
            onFinish={handleSaveSettings}
          >
            <Row gutter={[24, 24]}>
              {/* General Portal Settings */}
              <Col xs={24} lg={12}>
                <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}><GlobalOutlined style={{ marginRight: 8, color: '#ea580c' }} />General Portal Settings</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', height: '100%' }}>
                  <Form.Item name="portalName" label={<span style={{ fontWeight: 700 }}>Portal Branding Title</span>}>
                    <Input size="large" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="supportEmail" label={<span style={{ fontWeight: 700 }}>Support Email</span>}>
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="contactPhone" label={<span style={{ fontWeight: 700 }}>Support Helpline</span>}>
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="currencySymbol" label={<span style={{ fontWeight: 700 }}>Default Currency Symbol</span>}>
                    <Select size="large">
                      <Option value="₹ (INR)">₹ (INR) - Indian Rupee</Option>
                      <Option value="$ (USD)">$ (USD) - US Dollar</Option>
                      <Option value="€ (EUR)">€ (EUR) - Euro</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>

              {/* Broker & Listing Policies */}
              <Col xs={24} lg={12}>
                <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}><SettingOutlined style={{ marginRight: 8, color: '#ea580c' }} />Listing & Broker Verification Policies</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Auto-Approve Broker Registrations</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Bypass manual admin verification for new partner signups</div>
                    </div>
                    <Form.Item name="autoApproveBrokers" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Auto-Approve Property Listings</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Publish submitted real estate listings without admin review</div>
                    </div>
                    <Form.Item name="autoApproveListings" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="defaultCommission" label={<span style={{ fontWeight: 700 }}>Default Commission Rate (%)</span>}>
                        <InputNumber min={0} max={10} size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="maxPhotosPerListing" label={<span style={{ fontWeight: 700 }}>Max Upload Photos per Listing</span>}>
                        <InputNumber min={1} max={50} size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Notification Preferences */}
              <Col xs={24} lg={12}>
                <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}><BellOutlined style={{ marginRight: 8, color: '#ea580c' }} />Email & Alert Notifications</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>New Listing Alert</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Send immediate email notification when a broker submits a property</div>
                    </div>
                    <Form.Item name="emailNewSubmissions" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Buyer Lead Alerts</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Notify admin when a buyer submits a new property inquiry</div>
                    </div>
                    <Form.Item name="emailLeadInquiries" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Daily Executive Digest</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Receive a daily summary of site visits and sales performance</div>
                    </div>
                    <Form.Item name="dailyDigest" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>
                </Card>
              </Col>

              {/* Security & Access Controls */}
              <Col xs={24} lg={12}>
                <Card bordered={false} title={<span style={{ fontWeight: 800, color: '#0f172a' }}><LockOutlined style={{ marginRight: 8, color: '#ea580c' }} />Security & Access Controls</span>} style={{ borderRadius: 16, boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Two-Factor Authentication (2FA)</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Require OTP verification for all admin logins</div>
                    </div>
                    <Form.Item name="enforce2FA" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <Form.Item name="sessionTimeout" label={<span style={{ fontWeight: 700 }}>Admin Session Idle Timeout (Minutes)</span>}>
                    <Select size="large">
                      <Option value={15}>15 Minutes</Option>
                      <Option value={30}>30 Minutes</Option>
                      <Option value={60}>60 Minutes (Default)</Option>
                      <Option value={120}>120 Minutes</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSettings;
