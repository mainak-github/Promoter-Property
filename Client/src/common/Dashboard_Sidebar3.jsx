import React from 'react';
import { Layout, Menu, Image } from 'antd';
import { HomeOutlined, ProfileOutlined, AppstoreOutlined, HeartOutlined, MessageOutlined, FileSearchOutlined } from '@ant-design/icons';
import DashboardSidebar2 from './Dashboard_Sidebar2';

const { Sider } = Layout;

const DashboardSidebar3 = ({ collapsed }) => {
  const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const userId = user?.id;

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => window.location.href = '/client/dashboard',
    },
    {
      key: 'profile-management',
      icon: <ProfileOutlined />,
      label: 'Profile Management',
      children: [
        {
          key: 'your-profile',
          label: 'Your Profile',
          onClick: () => window.location.href = `/client/profile/${userId}`,
        },
      ],
    },
    {
      key: 'property-management',
      icon: <AppstoreOutlined />,
      label: 'Property Management',
      children: [
        {
          key: 'my-wishlists',
          label: 'My Wishlists',
          onClick: () => window.location.href = `/client/wishlists/${userId}`,
          icon: <HeartOutlined />
        },
      ],
    },
    {
      key: 'communication',
      icon: <MessageOutlined />,
      label: 'Communication',
      children: [
        {
          key: 'contact-broker',
          label: 'Contact Broker/Promoter',
          onClick: () => window.location.href = '/contact-broker',
        },
      ],
    },
    {
      key: 'express-interest',
      icon: <FileSearchOutlined />,
      label: 'Express Interest',
      children: [
        {
          key: 'fill-form',
          label: 'Fill enquiry or interest form',
          onClick: () => window.location.href = '/interest-form',
        },
      ],
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <Image src="assets/images/logo-sm.png" alt="logo" style={{ marginRight: collapsed ? 0 : 8 }} width={32} preview={false} />
        <h1 style={{ color: 'white', margin: 0, fontSize: 18, opacity: collapsed ? 0 : 1, transition: 'opacity 0.3s' }}>
          Promoter Property
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={menuItems}
      />
    </Sider>
  );
};

export default DashboardSidebar3;