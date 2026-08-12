import React, { useState } from 'react';
import { Modal, Tag, Button, Rate, Row, Col, Typography, Divider, Badge, Carousel, Space } from 'antd';
import {
  EnvironmentOutlined,
  HomeOutlined,
  RestOutlined,
  AreaChartOutlined,
  CompassOutlined,
  BuildOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  ArrowRightOutlined,
  CarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import url from '../../url';
import { getPropertyDetailsUrl } from '../../utils/slugUtils';

const { Title, Text, Paragraph } = Typography;

const PropertyQuickViewModal = ({ property, open, onClose, onOpenInquiry }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  // Format Price
  const formatPriceToIndian = (priceString) => {
    if (!priceString) return 'Price on Request';
    const cleanPrice = priceString.toString().toLowerCase().trim();
    const priceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k)?/);
    if (!priceMatch) return `₹${priceString}`;
    const [, numberStr, unit] = priceMatch;
    const number = parseFloat(numberStr);
    if (isNaN(number)) return `₹${priceString}`;
    if (unit) {
      switch (unit) {
        case 'cr':
        case 'crore':
          return number >= 10 ? `₹${Math.round(number)} Cr` : `₹${number.toFixed(1)} Cr`;
        case 'l':
        case 'lakh':
          return `₹${number} L`;
        case 'k':
          return `₹${number}K`;
        default:
          return `₹${new Intl.NumberFormat('en-IN').format(number)}`;
      }
    }
    return number >= 100 ? `₹${number} Cr` : `₹${number} L`;
  };

  const images = [];
  if (property.coverPhoto) {
    images.push(`${url.IMAGE_URL}/${property.coverPhoto}`);
  }
  if (Array.isArray(property.images)) {
    property.images.forEach(img => {
      const imgPath = typeof img === 'string' ? img : img.imageUrl;
      if (imgPath && !images.includes(`${url.IMAGE_URL}/${imgPath}`)) {
        images.push(`${url.IMAGE_URL}/${imgPath}`);
      }
    });
  }
  if (images.length === 0) {
    images.push('https://via.placeholder.com/600x400/f1f5f9/64748b?text=Property+Photo');
  }

  const developerName = property.developerInfo?.developerName || 'Promoter Property Partner';
  const locationStr = [property.suburb, property.city, property.state].filter(Boolean).join(', ') || property.address || 'Prime Location';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      className="quick-view-modal"
      destroyOnClose
    >
      <div className="quick-view-container">
        <Row gutter={[24, 24]}>
          {/* Left Column: Image Carousel & Gallery */}
          <Col xs={24} md={12}>
            <div className="quick-view-main-image-wrap">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={property.title}
                className="quick-view-main-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/f1f5f9/64748b?text=Property+Photo';
                }}
              />
              <div className="quick-view-status-badge">
                {property.status || 'Ready to Move In'}
              </div>
            </div>

            {images.length > 1 && (
              <div className="quick-view-thumbnails">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail-box ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Right Column: Key Details & Actions */}
          <Col xs={24} md={12}>
            <div className="quick-view-details">
              <div className="quick-view-dev-bar">
                <Space align="center">
                  <BuildOutlined style={{ color: '#ea580c' }} />
                  <Text strong style={{ color: '#475569', fontSize: '13px' }}>{developerName}</Text>
                  <CheckCircleFilled style={{ color: '#ea580c', fontSize: '14px' }} />
                </Space>
                <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: '12px', color: '#f59e0b' }} />
              </div>

              <Title level={3} style={{ margin: '8px 0 4px', color: '#0f172a' }}>
                {property.title}
              </Title>

              <div className="quick-view-location">
                <EnvironmentOutlined style={{ color: '#ea580c', marginRight: 6 }} />
                <Text type="secondary">{locationStr}</Text>
              </div>

              <div className="quick-view-price-section">
                <span className="quick-view-price">{formatPriceToIndian(property.priceRange)}</span>
                {property.budgetType && (
                  <Tag color="green" style={{ marginLeft: 10, borderRadius: 12 }}>
                    {property.budgetType}
                  </Tag>
                )}
              </div>

              <Divider style={{ margin: '14px 0' }} />

              {/* Specs Grid */}
              <div className="quick-view-specs-grid">
                <div className="qv-spec-item">
                  <HomeOutlined className="qv-spec-icon" />
                  <div>
                    <div className="qv-spec-val">{property.bedrooms || '2'} BHK</div>
                    <div className="qv-spec-lbl">Bedrooms</div>
                  </div>
                </div>

                <div className="qv-spec-item">
                  <RestOutlined className="qv-spec-icon" />
                  <div>
                    <div className="qv-spec-val">{property.bathrooms || '2'}</div>
                    <div className="qv-spec-lbl">Bathrooms</div>
                  </div>
                </div>

                <div className="qv-spec-item">
                  <AreaChartOutlined className="qv-spec-icon" />
                  <div>
                    <div className="qv-spec-val">{property.carpetArea || property.totalArea || '1,200'} sq ft</div>
                    <div className="qv-spec-lbl">Carpet Area</div>
                  </div>
                </div>

                {property.facing && (
                  <div className="qv-spec-item">
                    <CompassOutlined className="qv-spec-icon" />
                    <div>
                      <div className="qv-spec-val">{property.facing}</div>
                      <div className="qv-spec-lbl">Facing</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Furnished & Parking Badges */}
              <div className="quick-view-tags-row">
                {property.furnishedStatus && (
                  <Tag color="orange" icon={<HomeOutlined />}>{property.furnishedStatus}</Tag>
                )}
                {property.propertyType && (
                  <Tag color="blue" icon={<BuildOutlined />}>{property.propertyType}</Tag>
                )}
                {property.parkingAvailable ? (
                  <Tag color="green" icon={<CarOutlined />}>Parking Available</Tag>
                ) : null}
              </div>

              {/* Short Description */}
              {property.shortDescription && (
                <div className="quick-view-description">
                  <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ margin: 0, color: '#475569' }}>
                    {property.shortDescription}
                  </Paragraph>
                </div>
              )}

              {/* Action Buttons */}
              <div className="quick-view-actions">
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    height: 44
                  }}
                  onClick={() => {
                    window.location.href = getPropertyDetailsUrl(property);
                  }}
                >
                  View Complete Details
                </Button>

                <Row gutter={10} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <Button
                      block
                      size="large"
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        onClose();
                        if (onOpenInquiry) onOpenInquiry(property);
                      }}
                      style={{ borderRadius: 8, fontWeight: 600 }}
                    >
                      Book Site Visit
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      block
                      size="large"
                      icon={<WhatsAppOutlined />}
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      onClick={() => {
                        const msg = encodeURIComponent(`Hi, I am interested in "${property.title}" (ID: #${property.id})`);
                        window.open(`https://wa.me/918939000065?text=${msg}`);
                      }}
                    >
                      WhatsApp Agent
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        .quick-view-modal .ant-modal-content {
          border-radius: 16px !important;
          padding: 24px !important;
        }

        .quick-view-main-image-wrap {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: 12px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .quick-view-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .quick-view-status-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.8);
          color: #fff;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          backdrop-filter: blur(6px);
        }

        .quick-view-thumbnails {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
        }

        .thumbnail-box {
          width: 60px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.7;
          transition: all 0.2s;
        }

        .thumbnail-box.active,
        .thumbnail-box:hover {
          border-color: #ea580c;
          opacity: 1;
        }

        .thumbnail-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .quick-view-dev-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-view-price-section {
          margin-top: 10px;
          display: flex;
          align-items: baseline;
        }

        .quick-view-price {
          font-size: 24px;
          font-weight: 800;
          color: #ea580c;
        }

        .quick-view-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background: #f8fafc;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }

        .qv-spec-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qv-spec-icon {
          font-size: 18px;
          color: #ea580c;
        }

        .qv-spec-val {
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
        }

        .qv-spec-lbl {
          font-size: 11px;
          color: #64748b;
        }

        .quick-view-tags-row {
          margin: 12px 0;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .quick-view-description {
          background: #fafafa;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
        }

        .quick-view-actions {
          margin-top: 16px;
        }
      `}</style>
    </Modal>
  );
};

export default PropertyQuickViewModal;
