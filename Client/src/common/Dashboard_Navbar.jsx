import React, { useEffect, useState } from 'react';
import { Layout, Dropdown, Button, Space, Input, Avatar, theme, message, Tag } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined, 
  LockOutlined, 
  LogoutOutlined, 
  DownOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  BellOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

const { Header } = Layout;

const DashboardNavbar = ({ collapsed, onCollapse }) => {
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setLoginUser(parsedUser);
      }
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      setLoginUser(null);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    message.success('Logged out successfully!');
    window.location.href = '/admin/login';
  };

  const menuItems = [
    {
      key: 'welcome',
      label: (
        <div style={{ padding: '4px 8px' }}>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{loginUser?.name || 'Admin User'}</div>
          <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <SafetyOutlined style={{ color: '#ea580c' }} /> {loginUser?.role?.toUpperCase() || 'ADMIN'}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'my-account',
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: () => window.location.href = '/admin/profile'
    },
    {
      key: 'settings',
      label: 'System Settings',
      icon: <SettingOutlined />,
      onClick: () => window.location.href = '/admin/settings'
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logoutHandler,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        lineHeight: '64px',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
          onClick={onCollapse}
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b'
          }}
        />
        <Input.Search
          placeholder="Search properties, leads, clients..."
          style={{ width: 280 }}
          onSearch={(val) => message.info(`Searching for: ${val}`)}
        />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}
          >
            <Avatar 
              size={30}
              style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}
              icon={<UserOutlined />}
            >
              {loginUser?.name ? loginUser.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
            <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
              {loginUser ? loginUser.name : 'Admin User'}
            </span>
            <DownOutlined style={{ color: '#64748b', fontSize: 10 }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default DashboardNavbar;
