import React, { useEffect, useState } from 'react';
import { Layout, Modal, Form, Input, Button, Row, Col, message, Card, Table, Space, Popconfirm, Breadcrumb, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import url from '../url';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const PrivacyPolicyCMS = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchPolicies();
    }
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url.API_URL}/admin/privacypolicies`);
      setPolicies(res.data.policies);
    } catch (err) {
      message.error('Failed to load privacy policies');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${url.API_URL}/admin/privacypolicies`, values);
      message.success('Privacy policy created successfully!');
      form.resetFields();
      fetchPolicies();
    } catch (err) {
      message.error('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (record) => {
    setEditingPolicy(record);
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await axios.put(`${url.API_URL}/admin/privacypolicies/${editingPolicy.id}`, values);
      message.success('Privacy policy updated successfully!');
      setEditModalVisible(false);
      fetchPolicies();
    } catch (err) {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url.API_URL}/admin/privacypolicies/${id}`);
      message.success('Policy deleted successfully!');
      fetchPolicies();
    } catch (error) {
      message.error('Delete failed');
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this policy?"
            onConfirm={() => handleDelete(record.id)}
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
      {currentUser?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'CMS' }, { title: 'Privacy Policy' }]} />
          <Title level={4}>Privacy Policy Management</Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title={<Title level={5} style={{ margin: 0 }}><FileTextOutlined /> Create Privacy Policy</Title>} loading={loading}>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{ title: '', content: '' }}
                >
                  <Form.Item
                    name="title"
                    label="Policy Title"
                    rules={[{ required: true, message: 'Please enter the policy title' }]}
                  >
                    <Input placeholder="Enter the title" />
                  </Form.Item>
                  <Form.Item
                    name="content"
                    label="Policy Content"
                    rules={[{ required: true, message: 'Please enter the policy content' }]}
                  >
                    <TextArea rows={4} placeholder="Enter the content" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      Create Policy
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={<Title level={5} style={{ margin: 0 }}><FileTextOutlined /> All Policies ({policies.length})</Title>} loading={loading}>
                <Table
                  columns={columns}
                  dataSource={policies}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  bordered
                />
              </Card>
            </Col>
          </Row>

          <Modal
            title="Edit Privacy Policy"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onOk={() => editForm.submit()}
            okText="Update"
            confirmLoading={loading}
          >
            <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
              <Form.Item
                name="title"
                label="Policy Title"
                rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input placeholder="Enter the title" />
              </Form.Item>
              <Form.Item
                name="content"
                label="Policy Content"
                rules={[{ required: true, message: 'Please enter the content' }]}
              >
                <TextArea rows={4} placeholder="Enter the content" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PrivacyPolicyCMS;