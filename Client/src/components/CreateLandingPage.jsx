import React, { useEffect, useState, useRef } from 'react';
import { Layout, Table, Button, Tag, Space, Modal, Form, Input, Select, Card, Row, Col, Tooltip, Breadcrumb, Tabs, message } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  EyeOutlined, 
  GlobalOutlined, 
  DesktopOutlined, 
  TabletOutlined, 
  MobileOutlined, 
  CodeOutlined, 
  LayoutOutlined, 
  SaveOutlined, 
  CloudUploadOutlined, 
  ArrowLeftOutlined, 
  UndoOutlined, 
  RedoOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';

import axios from 'axios';
import Swal from 'sweetalert2';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webpagePlugin from 'grapesjs-preset-webpage';

import url from '../url';
import DashboardNavbar from '../common/Dashboard_Navbar';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import SEOHead from '../common/SEOHead';

const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const CreateLandingPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [landingPages, setLandingPages] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Mode: 'list' (Page Manager) or 'editor' (Visual Drag & Drop Builder)
  const [viewMode, setViewMode] = useState('list');
  const [activePage, setActivePage] = useState(null);

  // Editor State
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'code'
  const [device, setDevice] = useState('Desktop');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  // GrapesJS Ref
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Fetch all landing pages
  const fetchLandingPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url.API_URL}/admin/landing-pages`);
      if (res.data.success) {
        setLandingPages(res.data.pages || []);
      }
    } catch (err) {
      console.error('Error fetching landing pages:', err);
      message.error('Failed to load landing pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  // Initialize GrapesJS Editor when switching to editor view
  useEffect(() => {
    if (viewMode === 'editor' && editorContainerRef.current && !editorRef.current) {
      setTimeout(() => {
        initGrapesJSEditor();
      }, 100);
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (e) {
          console.warn('GrapesJS cleanup warning:', e);
        }
        editorRef.current = null;
      }
    };
  }, [viewMode, activePage]);

  // GrapesJS Setup & Block Definition
  const initGrapesJSEditor = () => {
    if (!editorContainerRef.current) return;

    // Destroy existing instance if any
    if (editorRef.current) {
      try {
        editorRef.current.destroy();
      } catch (e) {}
      editorRef.current = null;
    }

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      fromElement: false,
      height: '100%',
      width: 'auto',
      storageManager: false, // Disabling auto local storage to manage sync via backend API
      plugins: [webpagePlugin],
      pluginsOpts: {
        [webpagePlugin]: {
          modalImportTitle: 'Import HTML/CSS',
          modalImportButton: 'Import',
          modalImportLabel: '',
          modalImportContent: '',
          importViewerOptions: {},
          textCleanCanvas: 'Are you sure you want to clear the canvas?',
          showStylesOnChange: true,
        }
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '992px' },
          { name: 'Mobile', width: '375px', widthMedia: '480px' }
        ]
      }
    });

    editorRef.current = editor;

    // Set initial components, styles, or HTML
    if (activePage) {
      if (activePage.gjsProject) {
        try {
          const projectData = typeof activePage.gjsProject === 'string'
            ? JSON.parse(activePage.gjsProject)
            : activePage.gjsProject;
          editor.loadProjectData(projectData);
        } catch (e) {
          editor.setComponents(activePage.htmlContent || '');
          editor.setStyle(activePage.cssContent || '');
        }
      } else {
        editor.setComponents(activePage.htmlContent || '');
        editor.setStyle(activePage.cssContent || '');
      }

      setHtmlCode(activePage.htmlContent || editor.getHtml());
      setCssCode(activePage.cssContent || editor.getCss());
      setJsCode(activePage.jsContent || editor.getJs());
    }

    // Register Custom Real Estate & Landing Page Blocks
    const blockManager = editor.BlockManager;

    // 1. Hero Section Block
    blockManager.add('re-hero-banner', {
      label: '🏆 Hero Banner',
      category: 'Real Estate Landing',
      content: `
        <section style="position: relative; padding: 100px 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; text-align: center; border-radius: 8px; margin-bottom: 20px;">
          <div style="max-width: 900px; margin: 0 auto;">
            <span style="display: inline-block; padding: 6px 16px; background: rgba(37, 99, 235, 0.2); color: #60a5fa; border-radius: 50px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">
              Exclusive Property Launch
            </span>
            <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 20px; color: #ffffff;">
              Luxury Living Redefined in Prime Location
            </h1>
            <p style="font-size: 1.25rem; color: #cbd5e1; max-width: 700px; margin: 0 auto 35px auto;">
              Discover ultra-modern 2, 3 & 4 BHK apartments with world-class amenities, scenic views, and seamless city connectivity.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <a href="#enquire-form" style="padding: 16px 36px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.4);">
                Book Site Visit
              </a>
              <a href="#specs" style="padding: 16px 36px; background: rgba(255, 255, 255, 0.1); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                Download Brochure
              </a>
            </div>
          </div>
        </section>
      `
    });

    // 2. Property Specifications Grid Block
    blockManager.add('re-specs-grid', {
      label: '📊 Property Specs Grid',
      category: 'Real Estate Landing',
      content: `
        <section id="specs" style="padding: 60px 20px; background: #ffffff; margin-bottom: 20px; border-radius: 8px;">
          <div style="max-width: 1100px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 2.2rem; color: #0f172a; margin-bottom: 10px;">Project Highlights & Specifications</h2>
            <p style="color: #64748b; margin-bottom: 40px;">Designed to offer unmatched comfort, security, and prestige.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
              <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="font-size: 2rem; color: #2563eb; margin-bottom: 8px;">🏢</div>
                <h3 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 4px;">Configurations</h3>
                <p style="color: #64748b; font-weight: 600;">2, 3 & 4 BHK Luxury Flats</p>
              </div>
              <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="font-size: 2rem; color: #2563eb; margin-bottom: 8px;">📐</div>
                <h3 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 4px;">Carpet Area</h3>
                <p style="color: #64748b; font-weight: 600;">850 - 2,400 Sq. Ft.</p>
              </div>
              <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="font-size: 2rem; color: #2563eb; margin-bottom: 8px;">💰</div>
                <h3 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 4px;">Price Range</h3>
                <p style="color: #64748b; font-weight: 600;">₹ 75 Lakhs - ₹ 2.2 Cr*</p>
              </div>
              <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="font-size: 2rem; color: #2563eb; margin-bottom: 8px;">🔑</div>
                <h3 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 4px;">Possession Date</h3>
                <p style="color: #64748b; font-weight: 600;">December 2026</p>
              </div>
            </div>
          </div>
        </section>
      `
    });

    // 3. Lead Capture Form Block
    blockManager.add('re-lead-form', {
      label: '📝 Lead Capture Form',
      category: 'Real Estate Landing',
      content: `
        <section id="enquire-form" style="padding: 60px 20px; background: #f1f5f9; margin-bottom: 20px; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="font-size: 2rem; color: #0f172a; margin-bottom: 8px;">Schedule an Exclusive Preview</h2>
              <p style="color: #64748b;">Fill out your details to receive instant price breakup, floor plans, and VIP tour invite.</p>
            </div>
            <form class="landing-lead-form">
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Full Name *</label>
                <input type="text" name="name" placeholder="John Doe" required style="width: 100%; padding: 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; box-sizing: border-box;" />
              </div>
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Phone Number *</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" required style="width: 100%; padding: 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; box-sizing: border-box;" />
              </div>
              <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" style="width: 100%; padding: 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; box-sizing: border-box;" />
              </div>
              <div style="margin-bottom: 24px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Preferred Configuration</label>
                <select name="message" style="width: 100%; padding: 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; box-sizing: border-box; background: white;">
                  <option value="Interested in 2 BHK">2 BHK Luxury</option>
                  <option value="Interested in 3 BHK">3 BHK Premium</option>
                  <option value="Interested in 4 BHK Penthouse">4 BHK Penthouse</option>
                </select>
              </div>
              <button type="submit" style="width: 100%; padding: 16px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
                Submit Inquiry & Get Callback
              </button>
            </form>
          </div>
        </section>
      `
    });

    // 4. Amenities Section Block
    blockManager.add('re-amenities', {
      label: '🏊 Amenities Showcase',
      category: 'Real Estate Landing',
      content: `
        <section style="padding: 60px 20px; background: #ffffff; margin-bottom: 20px; border-radius: 8px;">
          <div style="max-width: 1100px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 2.2rem; color: #0f172a; margin-bottom: 10px;">World-Class Amenities</h2>
            <p style="color: #64748b; margin-bottom: 40px;">30+ Premium Lifestyle Features for You and Your Family.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;">
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🏊 Infinity Pool</div>
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🏋️ Modern Gym</div>
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🌳 Clubhouse & Garden</div>
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🎾 Tennis & Squash Court</div>
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🛡️ 3-Tier 24/7 Security</div>
              <div style="padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; font-weight: 600; color: #1e293b;">🧒 Kids Play Zone</div>
            </div>
          </div>
        </section>
      `
    });

    // 5. 1-Page Navigation Bar Block
    blockManager.add('re-navbar-1page', {
      label: '🧭 Single-Page Sticky Nav',
      category: 'Navigation & Headers',
      content: `
        <nav style="position: sticky; top: 0; z-index: 1000; background: #0f172a; color: white; padding: 16px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size: 1.5rem; font-weight: 800; color: #ffffff;">PROMOTER PROPERTY</div>
          <div style="display: flex; gap: 24px; font-weight: 500;">
            <a href="#specs" style="color: #cbd5e1; text-decoration: none;">Overview</a>
            <a href="#specs" style="color: #cbd5e1; text-decoration: none;">Amenities</a>
            <a href="#enquire-form" style="color: #cbd5e1; text-decoration: none;">Pricing</a>
            <a href="#enquire-form" style="color: #2563eb; text-decoration: none; font-weight: 700;">Contact</a>
          </div>
        </nav>
      `
    });

    // 6. Multi-Page Tab Header Block
    blockManager.add('re-multipage-tabs', {
      label: '📑 Multi-Page Tabs Header',
      category: 'Navigation & Headers',
      content: `
        <header style="background: #ffffff; border-bottom: 2px solid #e2e8f0; padding: 16px 20px; text-align: center; margin-bottom: 20px;">
          <div style="display: inline-flex; background: #f1f5f9; padding: 4px; border-radius: 8px;">
            <button style="padding: 10px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Page 1: Project Overview</button>
            <button style="padding: 10px 24px; background: transparent; color: #475569; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Page 2: Floorplans & Inquiry</button>
          </div>
        </header>
      `
    });

    // Sync editor code on update
    editor.on('component:update style:update change', () => {
      setHtmlCode(editor.getHtml());
      setCssCode(editor.getCss());
      setJsCode(editor.getJs());
    });
  };

  // Change device view
  const handleDeviceChange = (deviceName) => {
    setDevice(deviceName);
    if (editorRef.current) {
      editorRef.current.setDevice(deviceName);
    }
  };

  // Handle Save Page (Draft or Publish)
  const handleSavePage = async (status = 'draft') => {
    if (!activePage) return;

    let finalHtml = htmlCode;
    let finalCss = cssCode;
    let finalJs = jsCode;
    let gjsProjectData = null;

    if (editorRef.current) {
      finalHtml = editorRef.current.getHtml();
      finalCss = editorRef.current.getCss();
      finalJs = editorRef.current.getJs();
      gjsProjectData = editorRef.current.getProjectData();
    }

    try {
      setLoading(true);
      const payload = {
        title: activePage.title,
        slug: activePage.slug,
        pageType: activePage.pageType,
        status: status,
        gjsProject: gjsProjectData,
        htmlContent: finalHtml,
        cssContent: finalCss,
        jsContent: finalJs,
        metaTitle: activePage.metaTitle || activePage.title,
        metaDescription: activePage.metaDescription || '',
        metaKeywords: activePage.metaKeywords || ''
      };

      const res = await axios.put(`${url.API_URL}/admin/landing-pages/${activePage.id}`, payload);
      if (res.data.success) {
        setActivePage(res.data.page);
        message.success(`Landing page saved as ${status.toUpperCase()}!`);
        fetchLandingPages();
      }
    } catch (err) {
      console.error('Error saving landing page:', err);
      message.error(err.response?.data?.message || 'Failed to save landing page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Landing Page submit
  const handleCreateSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`${url.API_URL}/admin/landing-pages`, values);
      if (res.data.success) {
        message.success('Landing page created successfully!');
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchLandingPages();
        // Open directly in builder
        openEditor(res.data.page);
      }
    } catch (err) {
      console.error('Error creating landing page:', err);
      message.error(err.response?.data?.message || 'Failed to create landing page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Settings / SEO submit
  const handleSettingsSubmit = async (values) => {
    if (!activePage) return;
    try {
      setLoading(true);
      const res = await axios.put(`${url.API_URL}/admin/landing-pages/${activePage.id}`, values);
      if (res.data.success) {
        message.success('Page settings updated!');
        setActivePage(res.data.page);
        setIsSettingsModalOpen(false);
        fetchLandingPages();
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      message.error(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  // Open Editor for a specific page
  const openEditor = (pageItem) => {
    setActivePage(pageItem);
    setHtmlCode(pageItem.htmlContent || '');
    setCssCode(pageItem.cssContent || '');
    setJsCode(pageItem.jsContent || '');
    setViewMode('editor');
    setEditorMode('visual');
  };

  // Duplicate Page
  const handleDuplicatePage = async (pageId) => {
    try {
      setLoading(true);
      const res = await axios.post(`${url.API_URL}/admin/landing-pages/${pageId}/duplicate`);
      if (res.data.success) {
        message.success('Landing page duplicated successfully!');
        fetchLandingPages();
      }
    } catch (err) {
      console.error('Error duplicating page:', err);
      message.error('Failed to duplicate landing page.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Page
  const handleDeletePage = (pageId, title) => {
    Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const res = await axios.delete(`${url.API_URL}/admin/landing-pages/${pageId}`);
          if (res.data.success) {
            Swal.fire('Deleted!', 'Landing page has been deleted.', 'success');
            fetchLandingPages();
            if (activePage?.id === pageId) {
              setViewMode('list');
              setActivePage(null);
            }
          }
        } catch (err) {
          console.error('Error deleting page:', err);
          message.error('Failed to delete landing page.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Apply Code Editor updates back to GrapesJS Canvas
  const applyCodeToCanvas = () => {
    if (editorRef.current) {
      editorRef.current.setComponents(htmlCode);
      editorRef.current.setStyle(cssCode);
      message.success('Code changes applied to visual canvas!');
    }
  };

  // Download Standalone HTML/CSS/JS Package
  const exportStandaloneCode = () => {
    if (!activePage) return;
    const combinedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.metaTitle || activePage.title}</title>
  <meta name="description" content="${activePage.metaDescription || ''}">
  <meta name="keywords" content="${activePage.metaKeywords || ''}">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}

  <script>
    ${jsCode}
  </script>
</body>
</html>
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([combinedCode], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${activePage.slug || 'landing-page'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Table Columns for Landing Page Manager
  const columns = [
    {
      title: 'Landing Page Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Type: <Tag color={record.pageType === 'multi-page' ? 'purple' : 'blue'}>{record.pageType?.toUpperCase() || 'SINGLE-PAGE'}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Public URL / Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => (
        <a 
          href={`/landing/${slug}`} 
          target="_blank" 
          rel="noreferrer"
          style={{ color: '#2563eb', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          /landing/{slug} <GlobalOutlined />
        </a>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'} style={{ padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
          {status === 'published' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Last Modified',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (date ? new Date(date).toLocaleString() : 'N/A')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit in Visual Builder">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => openEditor(record)} 
              style={{ background: '#2563eb' }}
            >
              Edit Builder
            </Button>
          </Tooltip>
          <Tooltip title="Preview Live Page">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => window.open(`/landing/${record.slug}?preview=true`, '_blank')} 
            />
          </Tooltip>
          <Tooltip title="Duplicate Page">
            <Button 
              icon={<CopyOutlined />} 
              size="small" 
              onClick={() => handleDuplicatePage(record.id)} 
            />
          </Tooltip>
          <Tooltip title="Delete Page">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleDeletePage(record.id, record.title)} 
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const filteredPages = landingPages.filter(p => 
    p.title?.toLowerCase().includes(searchText.toLowerCase()) || 
    p.slug?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <SEOHead title="No-Code Landing Page Builder - Promoter Property Admin" />
      <Layout style={{ minHeight: '100vh' }}>
        <DashboardSidebar collapsed={collapsed} />
        <Layout>
          <DashboardNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#f8fafc', minHeight: 280 }}>
            
            {/* Header Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <Breadcrumb>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>CMS</Breadcrumb.Item>
                  <Breadcrumb.Item>No-Code Landing Page Builder</Breadcrumb.Item>
                </Breadcrumb>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>
                  {viewMode === 'list' ? 'Landing Pages Manager' : `Builder: ${activePage?.title || ''}`}
                </h1>
              </div>

              {viewMode === 'list' ? (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="large"
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{ background: '#2563eb', height: '44px', borderRadius: '8px', fontWeight: 600 }}
                >
                  Create New Landing Page
                </Button>
              ) : (
                <Space size="middle">
                  <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => {
                      setViewMode('list');
                      fetchLandingPages();
                    }}
                  >
                    Back to Pages List
                  </Button>
                  <Button 
                    icon={<SettingOutlined />} 
                    onClick={() => {
                      settingsForm.setFieldsValue({
                        title: activePage.title,
                        slug: activePage.slug,
                        pageType: activePage.pageType,
                        metaTitle: activePage.metaTitle,
                        metaDescription: activePage.metaDescription,
                        metaKeywords: activePage.metaKeywords
                      });
                      setIsSettingsModalOpen(true);
                    }}
                  >
                    SEO & Settings
                  </Button>
                  <Button 
                    icon={<SaveOutlined />} 
                    loading={loading}
                    onClick={() => handleSavePage('draft')}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />} 
                    loading={loading}
                    onClick={() => handleSavePage('published')}
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                  >
                    Publish Page
                  </Button>
                </Space>
              )}
            </div>

            {/* VIEW MODE 1: PAGE MANAGER LIST */}
            {viewMode === 'list' && (
              <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <Input.Search 
                    placeholder="Search by title or slug..." 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '320px' }} 
                  />
                  <div style={{ color: '#64748b', fontSize: '14px', alignSelf: 'center' }}>
                    Total Landing Pages: <strong>{landingPages.length}</strong>
                  </div>
                </div>

                <Table 
                  columns={columns} 
                  dataSource={filteredPages} 
                  rowKey="id" 
                  loading={loading}
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            )}

            {/* VIEW MODE 2: NO-CODE VISUAL & CODE BUILDER */}
            {viewMode === 'editor' && (
              <Card 
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: 0 }}
                bodyStyle={{ padding: 0 }}
              >
                {/* Editor Top Control Toolbar */}
                <div 
                  style={{ 
                    padding: '12px 20px', 
                    background: '#0f172a', 
                    color: '#ffffff', 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                >
                  {/* Left: Mode Toggle (Visual Canvas vs Code Editor) */}
                  <Space size="middle">
                    <div style={{ background: '#1e293b', padding: '4px', borderRadius: '8px', display: 'flex' }}>
                      <Button 
                        type={editorMode === 'visual' ? 'primary' : 'text'}
                        icon={<LayoutOutlined />}
                        onClick={() => setEditorMode('visual')}
                        size="small"
                        style={{ background: editorMode === 'visual' ? '#2563eb' : 'transparent', color: 'white' }}
                      >
                        Visual Canvas
                      </Button>
                      <Button 
                        type={editorMode === 'code' ? 'primary' : 'text'}
                        icon={<CodeOutlined />}
                        onClick={() => {
                          if (editorRef.current) {
                            setHtmlCode(editorRef.current.getHtml());
                            setCssCode(editorRef.current.getCss());
                            setJsCode(editorRef.current.getJs());
                          }
                          setEditorMode('code');
                        }}
                        size="small"
                        style={{ background: editorMode === 'code' ? '#2563eb' : 'transparent', color: 'white' }}
                      >
                        Code Editor (HTML/CSS/JS/jQuery)
                      </Button>
                    </div>
                  </Space>

                  {/* Center: Device Responsive Toggles (Desktop / Tablet / Mobile) */}
                  {editorMode === 'visual' && (
                    <Space size="small">
                      <Tooltip title="Desktop View">
                        <Button 
                          type={device === 'Desktop' ? 'primary' : 'default'}
                          icon={<DesktopOutlined />}
                          onClick={() => handleDeviceChange('Desktop')}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Tablet View (768px)">
                        <Button 
                          type={device === 'Tablet' ? 'primary' : 'default'}
                          icon={<TabletOutlined />}
                          onClick={() => handleDeviceChange('Tablet')}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Mobile View (375px)">
                        <Button 
                          type={device === 'Mobile' ? 'primary' : 'default'}
                          icon={<MobileOutlined />}
                          onClick={() => handleDeviceChange('Mobile')}
                          size="small"
                        />
                      </Tooltip>
                    </Space>
                  )}

                  {/* Right: Actions & Export */}
                  <Space size="small">
                    <Tooltip title="Undo">
                      <Button 
                        icon={<UndoOutlined />} 
                        size="small" 
                        onClick={() => editorRef.current?.UndoManager?.undo()} 
                      />
                    </Tooltip>
                    <Tooltip title="Redo">
                      <Button 
                        icon={<RedoOutlined />} 
                        size="small" 
                        onClick={() => editorRef.current?.UndoManager?.redo()} 
                      />
                    </Tooltip>
                    <Button 
                      icon={<DownloadOutlined />} 
                      size="small" 
                      onClick={exportStandaloneCode}
                    >
                      Export HTML Package
                    </Button>
                    <Button 
                      icon={<EyeOutlined />} 
                      size="small" 
                      onClick={() => window.open(`/landing/${activePage.slug}?preview=true`, '_blank')}
                    >
                      Live Preview
                    </Button>
                  </Space>
                </div>

                {/* Sub-View A: Visual Drag & Drop Canvas */}
                {editorMode === 'visual' && (
                  <div style={{ height: '75vh', width: '100%', position: 'relative' }}>
                    <div ref={editorContainerRef} style={{ height: '100%', width: '100%' }} />
                  </div>
                )}

                {/* Sub-View B: HTML, CSS, JavaScript / jQuery Code Editor */}
                {editorMode === 'code' && (
                  <div style={{ padding: '20px', background: '#1e293b', minHeight: '75vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
                        <CodeOutlined /> Edit raw HTML, CSS, JavaScript & jQuery scripts directly
                      </span>

                      <Button type="primary" onClick={applyCodeToCanvas} style={{ background: '#2563eb' }}>
                        Apply Changes to Visual Canvas
                      </Button>
                    </div>

                    <Tabs defaultActiveKey="html" type="card" theme="dark">
                      <TabPane tab="HTML Structure" key="html">
                        <textarea
                          value={htmlCode}
                          onChange={(e) => setHtmlCode(e.target.value)}
                          rows={20}
                          style={{
                            width: '100%',
                            background: '#0f172a',
                            color: '#38bdf8',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #334155',
                            boxSizing: 'border-box'
                          }}
                        />
                      </TabPane>
                      <TabPane tab="Custom CSS Styles" key="css">
                        <textarea
                          value={cssCode}
                          onChange={(e) => setCssCode(e.target.value)}
                          rows={20}
                          style={{
                            width: '100%',
                            background: '#0f172a',
                            color: '#4ade80',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #334155',
                            boxSizing: 'border-box'
                          }}
                        />
                      </TabPane>
                      <TabPane tab="JavaScript / jQuery Scripts" key="js">
                        <textarea
                          value={jsCode}
                          onChange={(e) => setJsCode(e.target.value)}
                          rows={20}
                          style={{
                            width: '100%',
                            background: '#0f172a',
                            color: '#facc15',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #334155',
                            boxSizing: 'border-box'
                          }}
                        />
                      </TabPane>
                    </Tabs>
                  </div>
                )}
              </Card>
            )}

            {/* MODAL 1: CREATE NEW LANDING PAGE */}
            <Modal
              title="Create New Landing Page"
              open={isCreateModalOpen}
              onCancel={() => setIsCreateModalOpen(false)}
              footer={null}
            >
              <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
                <Form.Item 
                  name="title" 
                  label="Landing Page Title" 
                  rules={[{ required: true, message: 'Please enter page title' }]}
                >
                  <Input placeholder="e.g. Prestige Heights Launch Promo" />
                </Form.Item>
                <Form.Item 
                  name="slug" 
                  label="Custom URL Slug (Optional)" 
                  help="Public link will be /landing/your-slug"
                >
                  <Input placeholder="e.g. prestige-heights-launch" />
                </Form.Item>
                <Form.Item 
                  name="pageType" 
                  label="Page Structure Type" 
                  initialValue="single-page"
                >
                  <Select>
                    <Option value="single-page">Single Page (1-Page Smooth Scroll Landing)</Option>
                    <Option value="multi-page">Multi Page (2-Page Tabbed Landing Layout)</Option>
                  </Select>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#2563eb' }}>
                    Create & Open Builder
                  </Button>
                </div>
              </Form>
            </Modal>

            {/* MODAL 2: SEO & PAGE SETTINGS */}
            <Modal
              title="Page Settings & SEO Metadata"
              open={isSettingsModalOpen}
              onCancel={() => setIsSettingsModalOpen(false)}
              footer={null}
            >
              <Form form={settingsForm} layout="vertical" onFinish={handleSettingsSubmit}>
                <Form.Item name="title" label="Page Title" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}>
                  <Input prefix="/landing/" />
                </Form.Item>
                <Form.Item name="pageType" label="Page Structure">
                  <Select>
                    <Option value="single-page">Single Page (1-Page)</Option>
                    <Option value="multi-page">Multi Page (2-Page Layout)</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="metaTitle" label="SEO Meta Title">
                  <Input placeholder="Meta Title for search engines..." />
                </Form.Item>
                <Form.Item name="metaDescription" label="SEO Meta Description">
                  <Input.TextArea rows={3} placeholder="Meta Description summary..." />
                </Form.Item>
                <Form.Item name="metaKeywords" label="SEO Keywords">
                  <Input placeholder="e.g. luxury flats, real estate promo, 3 BHK apartment" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <Button onClick={() => setIsSettingsModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#2563eb' }}>
                    Save Settings
                  </Button>
                </div>
              </Form>
            </Modal>

          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default CreateLandingPage;
