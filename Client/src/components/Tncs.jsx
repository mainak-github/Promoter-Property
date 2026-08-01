import React, { useEffect, useState } from 'react';
import { Layout, Modal, Form, Input, Button, message, Card, Table, Row, Col, Tag, Space, Popconfirm, Tooltip, Checkbox, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url'; // Assuming this provides a valid API URL

const { Content } = Layout;
const { TextArea } = Input;

const TermsConditions = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);

  useEffect(() => {
    // Basic authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url.API_URL}/admin/tnc/`);
      setTerms(res.data.terms);
    } catch (err) {
      message.error('Failed to load Terms & Conditions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${url.API_URL}/admin/tnc`, values);
      if (res.data.success) {
        message.success('Terms added successfully');
        form.resetFields();
        fetchTerms();
      } else {
        message.error('Failed to add Terms');
      }
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const deleteTerm = async (id) => {
    try {
      await axios.delete(`${url.API_URL}/admin/tnc/${id}`);
      message.success('Term deleted');
      fetchTerms();
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const openEditModal = (term) => {
    setEditingTerm(term);
    editForm.setFieldsValue(term);
    setEditModalVisible(true);
  };

  const handleUpdateTerm = async (values) => {
    setLoading(true);
    try {
      const res = await axios.put(`${url.API_URL}/admin/tnc/${editingTerm.id}`, values);
      if (res.data.success) {
        message.success('Terms updated successfully');
        fetchTerms();
        setEditModalVisible(false);
        setEditingTerm(null);
      } else {
        message.error('Update failed');
      }
    } catch (err) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
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
            title="Are you sure you want to delete this term?"
            onConfirm={() => deleteTerm(record.id)}
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
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'CMS' }, { title: 'Terms & Conditions' }]} />
          <h4 style={{ marginBottom: 24 }}>CMS / Terms & Conditions</h4>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Create New Term">
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{ title: '', content: '' }}
                >
                  <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter the Title' }]}
                  >
                    <Input placeholder="Enter the Title" />
                  </Form.Item>

                  <Form.Item
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: 'Please enter the Content' }]}
                  >
                    <TextArea rows={4} placeholder="Enter the Content" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Create Term
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="All Terms">
                <Table
                  columns={columns}
                  dataSource={terms}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>

          <Modal
            title="Edit Term"
            visible={editModalVisible}
            onCancel={() => {
              setEditModalVisible(false);
              setEditingTerm(null);
            }}
            footer={null}
            destroyOnClose
          >
            <Form layout="vertical" form={editForm} onFinish={handleUpdateTerm}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                <TextArea rows={5} />
              </Form.Item>
              <Form.Item
                name="isActive"
                label="Active?"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TermsConditions;
