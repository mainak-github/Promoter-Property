import React from 'react';
import { Layout, Menu, Image } from 'antd';
import { HomeOutlined, TeamOutlined, ProfileOutlined, MailOutlined, AppstoreOutlined, BarChartOutlined, FileTextOutlined, CalendarOutlined, MessageOutlined, WalletOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const DashboardSidebar2 = ({ collapsed }) => {
  const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const userId = user?.id;

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboards',
      onClick: () => window.location.href = '/broker/dashboard',
    },
    {
      key: 'profile-management',
      icon: <ProfileOutlined />,
      label: 'Profile Management',
      children: [
        {
          key: 'register-yourself',
          label: 'Register Yourself',
          onClick: () => window.location.href = '/broker/registration',
        },
        {
          key: 'your-profile',
          label: 'Your Profile',
          onClick: () => window.location.href = `/broker/profile/${userId}`,
        },
      ],
    },
    {
      key: 'property-management',
      icon: <AppstoreOutlined />,
      label: 'Property Management',
      children: [
        {
          key: 'my-properties',
          label: 'My Properties',
          onClick: () => window.location.href = `/brokers/properties/${userId}`,
        },
        {
          key: 'list-property',
          label: 'List Property',
          onClick: () => window.location.href = '/broker/property-listing',
        },
      ],
    },
    {
      key: 'tasks',
      icon: <FileTextOutlined />,
      label: 'Tasks',
      children: [
        {
          key: 'lead-management',
          label: 'Lead Management',
          onClick: () => window.location.href = '/admin/leads',
        },
        {
          key: 'assign-leads',
          label: 'Assign client leads to specific projects',
          onClick: () => window.location.href = '/admin/assign-leads',
        },
        {
          key: 'track-communication',
          label: 'Track client interest and communication',
          onClick: () => window.location.href = '/admin/track-communication',
        },
      ],
    },
    {
      key: 'site-visit-scheduling',
      icon: <CalendarOutlined />,
      label: 'Site Visit Scheduling',
      children: [
        {
          key: 'coordinate-visits',
          label: 'Coordinate with client and promoter/admin for visits',
          onClick: () => window.location.href = '/admin/visits',
        },
      ],
    },
    {
      key: 'client-communication',
      icon: <MessageOutlined />,
      label: 'Client Communication',
      children: [
        {
          key: 'chat-system',
          label: 'Chat/email system to interact with interested clients',
          onClick: () => window.location.href = '/admin/chat',
        },
      ],
    },
    {
      key: 'commission-tracking',
      icon: <WalletOutlined />,
      label: 'Commission Tracking',
      children: [
        {
          key: 'track-commissions',
          label: 'Track and manage commissions for all agents',
          onClick: () => window.location.href = '/admin/commissions',
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

export default DashboardSidebar2;
