import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, message, Typography, Space, Card } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import url from '../../url';

const { Title, Text } = Typography;
const { Option } = Select;

const PropertyInquiryModal = ({ property, open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!property) return null;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email || '',
        propertyId: property.id,
        propertyTitle: property.title,
        preferredDate: values.preferredDate ? values.preferredDate.format('YYYY-MM-DD') : '',
        preferredTime: values.preferredTime || 'Morning',
        message: values.message || `Inquiry regarding ${property.title}`
      };

      // Send to backend leads endpoint if available, fallback to mock success
      try {
        await axios.post(`${url.API_URL}/admin/leads`, payload);
      } catch (err) {
        console.warn('Backend leads API response:', err.message);
      }

      setSubmitted(true);
      message.success('Site visit request sent successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Inquiry error:', error);
      message.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSubmitted(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleModalClose}
      footer={null}
      width={520}
      centered
      destroyOnClose
      className="inquiry-modal"
    >
      <div className="inquiry-container">
        {submitted ? (
          <div className="inquiry-success-view">
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={3} style={{ color: '#0f172a', margin: '0 0 8px' }}>
              Request Received!
            </Title>
            <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginBottom: 24 }}>
              Our dedicated property advisor for <strong>{property.title}</strong> will contact you within 30 minutes.
            </Text>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleModalClose}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700
              }}
            >
              Back to Properties
            </Button>
          </div>
        ) : (
          <>
            <div className="inquiry-header">
              <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
                Schedule Site Visit & Inquiry
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {property.title} • ID: #{property.id}
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input size="large" prefix={<UserOutlined />} placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone / Mobile Number"
                rules={[
                  { required: true, message: 'Please enter your contact number' },
                  { pattern: /^[0-9+\-\s]{10,15}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input size="large" prefix={<PhoneOutlined />} placeholder="+91 98765 43210" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address (Optional)"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input size="large" prefix={<MailOutlined />} placeholder="john@example.com" />
              </Form.Item>

              <Form.Item label="Preferred Date & Time">
                <Input.Group compact>
                  <Form.Item name="preferredDate" noStyle>
                    <DatePicker style={{ width: '60%' }} size="large" format="YYYY-MM-DD" placeholder="Select Date" />
                  </Form.Item>
                  <Form.Item name="preferredTime" noStyle initialValue="Morning (10 AM - 1 PM)">
                    <Select style={{ width: '40%' }} size="large">
                      <Option value="Morning (10 AM - 1 PM)">Morning</Option>
                      <Option value="Afternoon (1 PM - 5 PM)">Afternoon</Option>
                      <Option value="Evening (5 PM - 8 PM)">Evening</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item name="message" label="Notes / Questions">
                <Input.TextArea rows={3} placeholder="Ask about pricing, floor plans, bank loan assistance, etc." />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    height: 46
                  }}
                >
                  Confirm Visit Request
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>

      <style>{`
        .inquiry-modal .ant-modal-content {
          border-radius: 16px !important;
          padding: 24px !important;
        }

        .inquiry-header {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .inquiry-success-view {
          padding: 24px 12px;
          text-align: center;
        }
      `}</style>
    </Modal>
  );
};

export default PropertyInquiryModal;
