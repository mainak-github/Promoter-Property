import React, { useEffect, useState } from 'react';
import { Layout, Modal, Form, Input, Button, message, Card, Table, Row, Col, Space, Popconfirm, Tooltip, Tag, Breadcrumb, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';

const { Content } = Layout;
const { TextArea } = Input;

const FAQs = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  useEffect(() => {
    // Basic authentication check
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
      setFaqs(res.data.faqs);
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
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (text) => <div style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>{text}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this FAQ?"
            onConfirm={() => deleteFaq(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'CMS' }, { title: 'FAQs' }]} />
          <h4 style={{ marginBottom: 24 }}>CMS / FAQs</h4>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Create New FAQ" bordered={false}>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{ question: '', answer: '' }}
                >
                  <Form.Item
                    name="question"
                    label="Question"
                    rules={[{ required: true, message: 'Please enter the FAQ question' }]}
                  >
                    <Input placeholder="Enter the question" />
                  </Form.Item>
                  <Form.Item
                    name="answer"
                    label="Answer"
                    rules={[{ required: true, message: 'Please enter the answer' }]}
                  >
                    <TextArea rows={4} placeholder="Enter the answer" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Create FAQ
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="All FAQs" bordered={false}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={faqs}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Modal
            title="Edit FAQ"
            visible={editModalVisible}
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
            >
              <Form.Item
                name="question"
                label="Question"
                rules={[{ required: true, message: 'Please enter the question' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="answer"
                label="Answer"
                rules={[{ required: true, message: 'Please enter the answer' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Update FAQ
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
