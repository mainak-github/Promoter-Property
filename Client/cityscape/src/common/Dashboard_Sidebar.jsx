import React from 'react';
import { Layout, Menu, Image, Button } from 'antd';
import { HomeOutlined, TeamOutlined, ProfileOutlined, MailOutlined, AppstoreOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const DashboardSidebar = ({ collapsed }) => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboards',
      onClick: () => window.location.href = '/admin/dashboard',
    },
    {
      key: 'client-management',
      icon: <TeamOutlined />,
      label: 'Client Management',
      children: [
        {
          key: 'clients',
          label: 'Clients',
          onClick: () => window.location.href = '/admin/clients',
        },
      ],
    },
    {
      key: 'broker-management',
      icon: <MailOutlined />,
      label: 'Broker Management',
      children: [
        {
          key: 'brokers',
          label: 'Brokers',
          onClick: () => window.location.href = '/admin/brokers',
        },
      ],
    },
    {
      key: 'property-management',
      icon: <AppstoreOutlined />,
      label: 'Property Management',
      children: [
        {
          key: 'all-properties',
          label: 'All Properties',
          onClick: () => window.location.href = '/admin/properties',
        },
        {
          key: 'list-property',
          label: 'List Property',
          onClick: () => window.location.href = '/admin/property-listing',
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
          key: 'view-leads',
          label: 'View and reassign leads',
          onClick: () => window.location.href = '/admin/view-leads',
        },
        {
          key: 'manage-followups',
          label: 'Manage follow-ups',
          onClick: () => window.location.href = '/admin/manage-followups',
        },
      ],
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports and Analytics',
      children: [
        {
          key: 'sales-performance',
          label: 'Sales performance',
          onClick: () => window.location.href = '/admin/reports/sales',
        },
        {
          key: 'broker-performance',
          label: 'Broker performance',
          onClick: () => window.location.href = '/admin/reports/brokers',
        },
        {
          key: 'client-activity',
          label: "Client's Activity",
          onClick: () => window.location.href = '/admin/reports/clients',
        },
      ],
    },
    {
      key: 'cms',
      icon: <FileTextOutlined />,
      label: 'CMS',
      children: [
        {
          key: 'build-landing-page',
          label: 'Build Landing Page',
          onClick: () => window.open('https://builder.promoterproperty.com/editor.php', '_blank'),
        },
        {
          key: 'faqs',
          label: 'FAQs',
          onClick: () => window.location.href = '/admin/cms/faqs',
        },
        {
          key: 'privacy-policy',
          label: 'Privacy Policy',
          onClick: () => window.location.href = '/admin/cms/privacy-policy',
        },
        {
          key: 'tnc',
          label: 'Terms & Conditions',
          onClick: () => window.location.href = '/admin/cms/tnc',
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

export default DashboardSidebar;
