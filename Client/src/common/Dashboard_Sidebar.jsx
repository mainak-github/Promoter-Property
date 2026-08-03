import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, ProfileOutlined, MailOutlined, AppstoreOutlined, BarChartOutlined, FileTextOutlined, ContactsOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const DashboardSidebar = ({ collapsed }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const getActiveKeys = () => {
    if (pathname.includes('/admin/clients')) return { selected: ['clients'], open: ['client-management'] };
    if (pathname.includes('/admin/brokers')) return { selected: ['brokers'], open: ['broker-management'] };
    if (pathname.includes('/admin/property-listing')) return { selected: ['list-property'], open: ['property-management'] };
    if (pathname.includes('/admin/properties')) return { selected: ['all-properties'], open: ['property-management'] };
    if (pathname.includes('/admin/leads')) return { selected: ['lead-management'], open: ['tasks'] };
    if (pathname.includes('/admin/reports/sales')) return { selected: ['sales-performance'], open: ['reports'] };
    if (pathname.includes('/admin/reports/brokers')) return { selected: ['broker-performance'], open: ['reports'] };
    if (pathname.includes('/admin/reports/clients')) return { selected: ['client-activity'], open: ['reports'] };
    if (pathname.includes('/admin/cms/faqs')) return { selected: ['faqs'], open: ['cms'] };
    if (pathname.includes('/admin/cms/privacy-policy')) return { selected: ['privacy-policy'], open: ['cms'] };
    if (pathname.includes('/admin/cms/tnc')) return { selected: ['tnc'], open: ['cms'] };
    if (pathname.includes('/admin/dashboard')) return { selected: ['dashboard'], open: [] };
    return { selected: ['dashboard'], open: [] };
  };

  const { selected: selectedKeys, open: defaultOpenKeys } = getActiveKeys();

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
      icon: <ContactsOutlined />,
      label: 'Tasks',
      children: [
        {
          key: 'lead-management',
          label: 'Lead Management',
          onClick: () => window.location.href = '/admin/leads',
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
      width={260}
      collapsedWidth={80}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1001,
        boxShadow: '2px 0 10px rgba(15, 23, 42, 0.15)'
      }}
    >
      <div 
        style={{ 
          height: 64, 
          padding: '0 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#001529'
        }}
      >
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(234, 88, 12, 0.4)',
          flexShrink: 0
        }}>
          <HomeOutlined style={{ color: '#ffffff', fontSize: 20 }} />
        </div>
        {!collapsed && (
          <div style={{ marginLeft: 12, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: 16, letterSpacing: '0.04em', lineHeight: 1.2 }}>
              PROMOTER
            </div>
            <div style={{ color: '#ea580c', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              PROPERTY ADMIN
            </div>
          </div>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        items={menuItems}
      />
    </Sider>
  );
};

export default DashboardSidebar;
