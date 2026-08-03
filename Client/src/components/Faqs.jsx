import React, { useEffect, useState } from 'react';
import { Layout, Modal, Form, Input, Button, message, Card, Table, Row, Col, Space, Popconfirm, Tooltip, Tag, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';

const { Content } = Layout;
const { TextArea } = Input;

const FAQs = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url.API_URL}/admin/faqs`);
      if (res.data.faqs) {
        setFaqs(res.data.faqs);
      }
    } catch (err) {
      message.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const deleteFaq = async (id) => {
    try {
      await axios.delete(`${url.API_URL}/admin/faqs/${id}`);
      message.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    editForm.setFieldsValue(faq);
    setEditModalVisible(true);
  };

  const handleUpdateFaq = async (values) => {
    setLoading(true);
    try {
      const res = await axios.put(`${url.API_URL}/admin/faqs/${editingFaq.id}`, values);
      if (res.data.success) {
        message.success('FAQ updated successfully');
        fetchFaqs();
        setEditModalVisible(false);
        setEditingFaq(null);
      } else {
        message.error('Update failed');
      }
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${url.API_URL}/admin/faqs`, values);
      if (res.data.success) {
        message.success('FAQ created successfully');
        form.resetFields();
        fetchFaqs();
      } else {
        message.error('Could not create FAQ');
      }
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text) => <div style={{ fontWeight: 600, color: '#0f172a' }}>{text}</div>,
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (text) => <div style={{ color: '#475569', fontSize: '0.88rem', whiteSpace: 'pre-wrap', maxHeight: 80, overflowY: 'auto' }}>{text}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => isActive ? <Tag color="green" style={{ borderRadius: 12, fontWeight: 600 }}>Active</Tag> : <Tag color="red" style={{ borderRadius: 12, fontWeight: 600 }}>Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit FAQ">
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(record)} 
              style={{ color: '#ea580c', borderColor: '#ffedd5', background: '#fff7ed' }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this FAQ?"
            description="Are you sure you want to delete this FAQ item?"
            onConfirm={() => deleteFaq(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeCount = faqs.filter(f => f.isActive).length;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <DashboardSidebar collapsed={collapsed} />
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
                CMS MANAGEMENT
              </div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>
                Frequently Asked Questions (FAQs)
              </h2>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Manage live customer helpdesk & homepage FAQ items.
              </p>
            </div>

            <Button 
              icon={<SyncOutlined spin={loading} />}
              onClick={fetchFaqs}
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
              Refresh List
            </Button>
          </div>

          {/* Quick Metrics */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #ea580c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total FAQs</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{faqs.length}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QuestionCircleOutlined style={{ fontSize: 22, color: '#ea580c' }} />
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', borderTop: '3px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Published</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{activeCount}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircleOutlined style={{ fontSize: 22, color: '#10b981' }} />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Form & Table Row */}
          <Row gutter={[24, 24]}>
            {/* Create FAQ Form */}
            <Col xs={24} lg={9}>
              <Card 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 18, background: '#ea580c', borderRadius: 4 }} />
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>Create New FAQ</span>
                  </div>
                } 
                bordered={false}
                style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}
              >
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{ question: '', answer: '' }}
                >
                  <Form.Item
                    name="question"
                    label={<span style={{ fontWeight: 600, color: '#334155' }}>Question</span>}
                    rules={[{ required: true, message: 'Please enter the FAQ question' }]}
                  >
                    <Input placeholder="e.g. How do I list a property?" style={{ height: 42, borderRadius: 8 }} />
                  </Form.Item>

                  <Form.Item
                    name="answer"
                    label={<span style={{ fontWeight: 600, color: '#334155' }}>Answer</span>}
                    rules={[{ required: true, message: 'Please enter the answer' }]}
                  >
                    <TextArea rows={4} placeholder="Write detailed answer..." style={{ borderRadius: 8 }} />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      icon={<PlusOutlined />}
                      style={{ 
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderColor: '#ea580c',
                        height: 42,
                        borderRadius: 8,
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                      }}
                    >
                      Publish FAQ
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* All FAQs Table */}
            <Col xs={24} lg={15}>
              <Card 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 18, background: '#0f172a', borderRadius: 4 }} />
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>All Published FAQs</span>
                  </div>
                } 
                bordered={false}
                style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={faqs}
                    rowKey="id"
                    pagination={{ pageSize: 6 }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Edit Modal */}
          <Modal
            title={<span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Edit FAQ Item</span>}
            open={editModalVisible}
            onCancel={() => {
              setEditModalVisible(false);
              setEditingFaq(null);
            }}
            footer={null}
            destroyOnClose
          >
            <Form
              layout="vertical"
              form={editForm}
              onFinish={handleUpdateFaq}
              initialValues={editingFaq}
              style={{ marginTop: 16 }}
            >
              <Form.Item
                name="question"
                label="Question"
                rules={[{ required: true, message: 'Please enter the question' }]}
              >
                <Input style={{ height: 42, borderRadius: 8 }} />
              </Form.Item>
              <Form.Item
                name="answer"
                label="Answer"
                rules={[{ required: true, message: 'Please enter the answer' }]}
              >
                <TextArea rows={4} style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  style={{ 
                    background: '#ea580c', 
                    borderColor: '#ea580c',
                    height: 42, 
                    fontWeight: 700, 
                    borderRadius: 8 
                  }}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FAQs;
