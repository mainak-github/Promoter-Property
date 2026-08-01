import React, { useEffect, useState } from 'react';
import { Layout, Table, Tag, Button, Space, Card, Modal, Typography, message, Spin, Breadcrumb, Image } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import DashboardNavbar from '../common/Dashboard_Navbar';
import url from '../url';
import { useParams } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const BrokerPropertyLists = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // Prevent user if they are not logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchProperties();
  }, [id]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${url.API_URL}/admin/property/myproperties/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperties(response.data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      message.error('Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (propertyId) => {
    confirm({
      title: 'Are you sure you want to delete this property?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone!',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteProperty(propertyId);
      },
    });
  };

  const deleteProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${url.API_URL}/admin/properties/delete/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Property deleted successfully');
        setProperties(properties.filter((item) => item.id !== propertyId));
      } else {
        message.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error?.response?.data?.error || 'Something went wrong');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Broker ID',
      dataIndex: 'brokerId',
      key: 'brokerId',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Cover Photo',
      dataIndex: 'coverPhoto',
      key: 'coverPhoto',
      render: (photo) => {
        const imageUrl = photo
          ? `${url.IMAGE_URL}/${photo.replace(/\\/g, '/')}`
          : 'https://placehold.co/80x60/e8e8e8/aaaaaa?text=No+Image';
        return <Image src={imageUrl} alt="Cover" width={80} height={60} style={{ objectFit: 'cover', borderRadius: '5px' }} />;
      },
    },
    {
      title: 'Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (status) => {
        const statusLower = (status || '').toLowerCase();
        let color = 'default';
        if (statusLower === 'approved') color = 'green';
        else if (statusLower === 'pending') color = 'blue';
        else if (statusLower === 'rejected') color = 'red';

        return <Tag color={color}>{status || 'Unknown'}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (row) => (
        <Space wrap>
          <Button icon={<EyeOutlined />} size="small" onClick={() => window.location.href = `/property-details/${row.id}`} />
          <Button icon={<EditOutlined />} size="small" onClick={() => window.location.href = `/admin/edit-property/${row.id}`} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => showDeleteConfirm(row.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar2 />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'My Properties' }]} />
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                <HomeOutlined /> Broker's Property List
              </Title>
            }
            extra={
              <Button type="primary" onClick={fetchProperties}>
                Refresh
              </Button>
            }
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={properties}
                rowKey="id"
                bordered
                pagination={{ pageSize: 8 }}
                scroll={{ x: 'max-content' }}
              />
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BrokerPropertyLists;