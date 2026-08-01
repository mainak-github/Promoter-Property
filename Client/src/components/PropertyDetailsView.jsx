import React, { useState, useEffect } from 'react';
import { Layout, Card, Collapse, Typography, Row, Col, Spin, Image, Breadcrumb, message, Tag,Space } from 'antd';
import { useParams } from 'react-router-dom';
import {
  HomeOutlined, UserOutlined, EnvironmentOutlined, DollarOutlined,
  AppstoreOutlined, CompassOutlined, CalendarOutlined, BankOutlined,
  DeploymentUnitOutlined, SettingOutlined, TagOutlined, FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import url from '../url';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const PropertyDetailsView = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!id) {
      message.error('Property ID not found in URL.');
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${url.API_URL}/admin/property/propertydetails/${id}`);
        setProperty(response.data.property);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        message.error('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {user?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
        <Layout>
          <DashboardNavbar />
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spin size="large" tip="Loading property details..." />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {user?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
        <Layout>
          <DashboardNavbar />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            <Title level={4}>Property Details</Title>
            <p>No property data available.</p>
          </Content>
        </Layout>
      </Layout>
    );
  }

  const sections = [
    {
      key: 'basic',
      header: 'Basic Information',
      icon: <SettingOutlined />,
      items: [
        { label: 'Property ID', value: property.id, icon: <TagOutlined /> },
        { label: 'Broker ID', value: property.brokerId, icon: <UserOutlined /> },
        { label: 'Title', value: property.title, icon: <HomeOutlined /> },
        { label: 'Short Description', value: property.shortDescription, icon: <FileTextOutlined /> },
        { label: 'Long Description', value: property.longDescription, icon: <FileTextOutlined /> },
      ]
    },
    {
      key: 'location',
      header: 'Location',
      icon: <EnvironmentOutlined />,
      items: [
        { label: 'City', value: property.city, icon: <EnvironmentOutlined /> },
        { label: 'Sub Location', value: property.subLocation, icon: <EnvironmentOutlined /> },
        { label: 'Map Link', value: <a href={property.googleMapLink} target="_blank" rel="noreferrer">View Map</a>, icon: <EnvironmentOutlined /> },
      ]
    },
    {
      key: 'pricing',
      header: 'Pricing & Status',
      icon: <DollarOutlined />,
      items: [
        { label: 'Price Range', value: property.priceRange, icon: <DollarOutlined /> },
        { label: 'Budget Type', value: property.budgetType, icon: <DollarOutlined /> },
        { label: 'Shifting Status', value: <Tag color="blue">{property.status}</Tag>, icon: <DollarOutlined /> },
      ]
    },
    {
      key: 'specifications',
      header: 'Specifications',
      icon: <AppstoreOutlined />,
      items: [
        { label: 'Bedrooms', value: property.bedrooms, icon: <HomeOutlined /> },
        { label: 'Bathrooms', value: property.bathrooms, icon: <DeploymentUnitOutlined /> },
        { label: 'Furnished', value: property.furnishedStatus, icon: <DeploymentUnitOutlined /> },
        { label: 'Parking Available', value: property.parkingAvailable ? 'Yes' : 'No', icon: <DeploymentUnitOutlined /> },
      ]
    },
    {
      key: 'timeline',
      header: 'Timeline',
      icon: <CalendarOutlined />,
      items: [
        { label: 'Launch Date', value: property.launchDate, icon: <CalendarOutlined /> },
        { label: 'Completion Date', value: property.completionDate, icon: <CalendarOutlined /> },
      ]
    },
    {
      key: 'structure',
      header: 'Structure Details',
      icon: <BankOutlined />,
      items: [
        { label: 'Floor Number', value: property.floorNumber, icon: <BankOutlined /> },
        { label: 'Number of Towers', value: property.numberOfTowers, icon: <BankOutlined /> },
        { label: 'Carpet Area', value: property.carpetArea, icon: <BankOutlined /> },
        { label: 'Total Area', value: property.totalArea, icon: <BankOutlined /> },
        { label: 'Facing', value: property.facing, icon: <BankOutlined /> },
      ]
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {user?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Properties' }, { title: 'Property Details' }]} />
          <Title level={4}>Property Details</Title>
          
          <Collapse defaultActiveKey={['basic']}>
            {sections.map(section => (
              <Panel header={<Title level={5} style={{ margin: 0 }}>{section.icon} {section.header}</Title>} key={section.key}>
                <Row gutter={[16, 16]}>
                  {section.items.map(item => (
                    <Col xs={24} md={12} key={item.label}>
                      <Card bordered={false}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8 }}>{item.icon}</span>
                          <Title level={5} style={{ margin: 0 }}>{item.label}:</Title>
                        </div>
                        <Text>{item.value}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            ))}

            {property.nearbyFacilities && (
              <Panel header={<Title level={5} style={{ margin: 0 }}><EnvironmentOutlined /> Nearby Facilities</Title>} key="facilities">
                <Row gutter={[16, 16]}>
                  {property.nearbyFacilities.map(facility => (
                    <Col xs={24} md={12} key={facility.id}>
                      <Card bordered={false}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8 }}><EnvironmentOutlined /></span>
                          <Title level={5} style={{ margin: 0 }}>{facility.facilityName}:</Title>
                        </div>
                        <Text>{`${facility.distance} (${facility.facilityType})`}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            )}

            {property.floorPlans && (
              <Panel header={<Title level={5} style={{ margin: 0 }}><AppstoreOutlined /> Floor Plans</Title>} key="floorplans">
                <Row gutter={[16, 16]}>
                  {property.floorPlans.map(plan => (
                    <Col xs={24} key={plan.id}>
                      <Card bordered={true}>
                        <Title level={5}>{plan.floorName} - {plan.towerName}</Title>
                        <Text strong>Description:</Text> <Text>{plan.shortDescription}</Text>
                        <br />
                        <Text strong>Price Range:</Text> <Text>{plan.priceRange}</Text>
                        {plan.photo && (
                          <div style={{ marginTop: 16 }}>
                            <Image
                              src={`${url.IMAGE_URL}/${plan.photo.replace(/\\/g, '/')}`}
                              alt={`${plan.shortDescription} Floorplan`}
                              style={{ maxWidth: '100%', borderRadius: 8 }}
                            />
                          </div>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            )}

            {property.developerInfo && (
              <Panel header={<Title level={5} style={{ margin: 0 }}><UserOutlined /> Developer Information</Title>} key="developer">
                <Card bordered={false}>
                  <Space size="large" align="start">
                    {property.developerInfo.developerLogo && (
                      <Image
                        src={`${url.IMAGE_URL}/${property.developerInfo.developerLogo.replace(/\\/g, '/')}`}
                        alt={property.developerInfo.developerName}
                        style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Title level={5}>{property.developerInfo.developerName}</Title>
                      <Text>{property.developerInfo.developerDescription}</Text>
                    </div>
                  </Space>
                </Card>
              </Panel>
            )}

            {property.layoutMaps && (
              <Panel header={<Title level={5} style={{ margin: 0 }}><CompassOutlined /> Layout Maps</Title>} key="layoutmaps">
                <Row gutter={[16, 16]}>
                  {property.layoutMaps.map(map => (
                    <Col xs={24} md={12} key={map.id}>
                      <Card bordered={true}>
                        <Text strong>Map Type:</Text> <Text>{map.mapType || 'N/A'}</Text>
                        {map.imageUrl && (
                          <div style={{ marginTop: 16 }}>
                            <Image
                              src={`${url.IMAGE_URL}/${map.imageUrl}`}
                              alt={`Layout Map ${map.id}`}
                              style={{ maxWidth: '100%', borderRadius: 8 }}
                            />
                          </div>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            )}
          </Collapse>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PropertyDetailsView;
