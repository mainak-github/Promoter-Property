import React, { useEffect, useState } from 'react';
import { Layout, Dropdown, Button, Space, Input, Avatar, theme, Menu, message } from 'antd';
import { UserOutlined, SettingOutlined, QuestionCircleOutlined, LockOutlined, LogoutOutlined, SearchOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const { Header } = Layout;
const { useToken } = theme;

const DashboardNavbar = ({ collapsed, onCollapse }) => {
  const [loginUser, setLoginUser] = useState(null);
  const { token } = useToken();

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
    window.location.href = '/login';
  };

  const menuItems = [
    {
      key: 'welcome',
      label: (
        <Space direction="vertical">
          <strong>Welcome!</strong>
          {loginUser && (
            <small>
              {loginUser.role} • Since {format(new Date(loginUser.createdAt), 'P')}
            </small>
          )}
        </Space>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'my-account',
      label: 'My Account',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      key: 'support',
      label: 'Support',
      icon: <QuestionCircleOutlined />,
    },
    {
      key: 'lock-screen',
      label: 'Lock Screen',
      icon: <LockOutlined />,
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
        background: token.colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Input.Search
          placeholder="Search..."
          style={{ width: 250, borderRadius: token.borderRadiusLG }}
          onSearch={() => message.info('Search functionality placeholder.')}
        />
      </div>
      <Space size="large">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <Button
            type="primary"
            style={{
              borderRadius: token.borderRadiusLG,
              height: 'auto',
              padding: '8px 16px',
            }}
          >
            <Space size="middle">
              <Avatar icon={<UserOutlined />} />
              <span style={{ color: 'white' }}>{loginUser ? loginUser.name : 'Guest'}</span>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardNavbar;
