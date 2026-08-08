import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Rate, Space, Typography, Spin, Tooltip } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  CameraOutlined,
  EyeOutlined,
  BuildOutlined,
  HomeOutlined,
  AreaChartOutlined,
  CompassOutlined,
  CarOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  RestOutlined,
  ArrowRightOutlined,
  ExpandOutlined
} from '@ant-design/icons';
import url from '../../url';
import './PropertyCard.css';

const { Text, Title } = Typography;

const PropertyCard = ({ property, viewMode = 'grid', onOpenQuickView, onOpenInquiry }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!property?.id) return;
    try {
      const favs = JSON.parse(localStorage.getItem('fav_properties') || '[]');
      setIsFavorite(favs.includes(property.id));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [property?.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!property?.id) return;
    try {
      const favs = JSON.parse(localStorage.getItem('fav_properties') || '[]');
      let updatedFavs = [];
      if (favs.includes(property.id)) {
        updatedFavs = favs.filter(id => id !== property.id);
        setIsFavorite(false);
      } else {
        updatedFavs = [...favs, property.id];
        setIsFavorite(true);
      }
      localStorage.setItem('fav_properties', JSON.stringify(updatedFavs));
    } catch (err) {
      console.warn('Favorite toggle error:', err);
    }
  };

  if (!property) return null;

  // Format Price to Indian Currency (Cr / L / K)
  const formatPriceToIndian = (priceString) => {
    if (!priceString) return 'Price on Request';
    const cleanPrice = priceString.toString().toLowerCase().trim();
    const priceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k|thousand)?/);
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
        case 'thousand':
          return `₹${number}K`;
        default:
          return `₹${new Intl.NumberFormat('en-IN').format(number)}`;
      }
    }
    return number >= 100 ? `₹${number} Cr` : `₹${number} L`;
  };

  // Calculate Price Per Sq Ft safely
  const getPricePerSqft = () => {
    const rawArea = property.carpetArea || property.totalArea;
    if (!rawArea || !property.priceRange) return null;

    const numArea = parseInt(rawArea.toString().replace(/,/g, ''), 10);
    if (!numArea || isNaN(numArea) || numArea <= 0) return null;

    const priceStr = property.priceRange.toString().toLowerCase();
    const priceMatch = priceStr.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k)?/);
    if (priceMatch) {
      const [, numberStr, unit] = priceMatch;
      const number = parseFloat(numberStr);
      if (isNaN(number)) return null;

      let priceInRupees = 0;
      switch (unit) {
        case 'cr':
        case 'crore':
          priceInRupees = number * 10000000;
          break;
        case 'l':
        case 'lakh':
          priceInRupees = number * 100000;
          break;
        case 'k':
          priceInRupees = number * 1000;
          break;
        default:
          priceInRupees = number;
      }

      const pricePerSqft = Math.round(priceInRupees / numArea);
      if (isNaN(pricePerSqft) || pricePerSqft <= 0) return null;
      return `₹${new Intl.NumberFormat('en-IN').format(pricePerSqft)}/sq ft`;
    }
    return null;
  };

  const getFormattedLocation = () => {
    const parts = [property.suburb, property.city, property.state].filter(Boolean);
    return parts.join(', ') || property.address || 'Prime Location';
  };

  const developerName = property.developerInfo?.developerName || 'Promoter Property Partner';

  const getFormattedArea = () => {
    const rawArea = property.carpetArea || property.totalArea;
    if (!rawArea) return null;
    const numArea = parseInt(rawArea.toString().replace(/,/g, ''), 10);
    if (!numArea || isNaN(numArea)) return null;
    return numArea.toLocaleString('en-IN');
  };

  const handleCardClick = () => {
    window.location.href = `/property/details/${property.id}`;
  };

  const getStatusBadge = () => {
    const status = property.status || 'Ready to Move In';
    let bgClass = 'status-emerald';
    if (status === 'Under Construction') bgClass = 'status-amber';
    if (status === 'Launching Soon') bgClass = 'status-indigo';
    return (
      <div className={`property-status-pill ${bgClass}`}>
        {status}
      </div>
    );
  };

  const photoCount = property.images?.length ? property.images.length + 1 : 1;
  const viewCount = 120 + ((property.id * 37) % 450);

  // Horizontal List View Rendering
  if (viewMode === 'list') {
    return (
      <div className="custom-property-card-list-wrapper" onClick={handleCardClick}>
        <div className="list-card-image-wrap">
          {!imageLoaded && (
            <div className="custom-image-spin-placeholder">
              <Spin />
            </div>
          )}
          <img
            alt={property.title}
            src={property.coverPhoto ? `${url.IMAGE_URL}/${property.coverPhoto}` : 'https://via.placeholder.com/400x250/f1f5f9/64748b?text=Property+Photo'}
            className="list-card-img"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x250/f1f5f9/64748b?text=Property+Photo';
            }}
          />
          <div className="custom-card-top-left">{getStatusBadge()}</div>
          <button
            type="button"
            className={`custom-favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
          </button>
        </div>

        <div className="list-card-content">
          <div className="list-card-header">
            <div>
              <div className="custom-dev-name-wrap">
                <BuildOutlined className="custom-dev-icon" />
                <span className="custom-dev-name">{developerName}</span>
                <CheckCircleFilled className="custom-verified-icon" />
              </div>
              <h3 className="list-card-title">{property.title}</h3>
              <div className="custom-card-location">
                <EnvironmentOutlined className="custom-loc-pin" />
                <span className="custom-loc-text">{getFormattedLocation()}</span>
              </div>
            </div>
            <div className="list-card-price-box">
              <div className="custom-price-main">{formatPriceToIndian(property.priceRange)}</div>
              {getPricePerSqft() && <div className="custom-price-sqft">{getPricePerSqft()}</div>}
            </div>
          </div>

          <div className="list-card-specs-row">
            <span className="list-spec-item"><HomeOutlined /> <strong>{property.bedrooms || '2'}</strong> BHK</span>
            <span className="list-spec-item"><RestOutlined /> <strong>{property.bathrooms || '1'}</strong> Baths</span>
            <span className="list-spec-item"><AreaChartOutlined /> <strong>{getFormattedArea() || '1,200'}</strong> Sq Ft</span>
            {property.facing && <span className="list-spec-item"><CompassOutlined /> {property.facing}</span>}
            {property.furnishedStatus && <span className="list-spec-item tag-blue">{property.furnishedStatus}</span>}
          </div>

          <div className="list-card-footer">
            <div className="list-actions">
              <Button
                type="primary"
                className="custom-btn-view-details"
                icon={<ArrowRightOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/property/details/${property.id}`;
                }}
              >
                View Details
              </Button>
              {onOpenQuickView && (
                <Button
                  icon={<ExpandOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickView(property);
                  }}
                >
                  Quick View
                </Button>
              )}
              {onOpenInquiry && (
                <Button
                  className="btn-call"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInquiry(property);
                  }}
                >
                  Book Visit
                </Button>
              )}
            </div>
            <div className="custom-posted-date">
              ID: #{property.id}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Rendering
  return (
    <div className="custom-property-card-wrapper" onClick={handleCardClick}>
      <Card
        className="custom-property-card"
        hoverable
        bordered={false}
        cover={
          <div className="custom-card-image-area">
            {!imageLoaded && (
              <div className="custom-image-spin-placeholder">
                <Spin />
              </div>
            )}
            <img
              alt={property.title}
              src={property.coverPhoto ? `${url.IMAGE_URL}/${property.coverPhoto}` : 'https://via.placeholder.com/400x250/f1f5f9/64748b?text=Property+Photo'}
              className="custom-card-img"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x250/f1f5f9/64748b?text=Property+Photo';
              }}
            />

            {/* Gradient Overlay */}
            <div className="custom-card-overlay-gradient" />

            {/* Top Status Pill */}
            <div className="custom-card-top-left">
              {getStatusBadge()}
            </div>

            {/* Quick View Floating Button on Hover */}
            {onOpenQuickView && (
              <button
                type="button"
                className="custom-quickview-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickView(property);
                }}
                title="Quick Preview"
              >
                <ExpandOutlined /> Quick View
              </button>
            )}

            {/* Favorite Wishlist Button */}
            <button
              type="button"
              className={`custom-favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              title={isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            >
              {isFavorite ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
            </button>

            {/* Bottom Overlay Image Stats */}
            <div className="custom-card-bottom-left">
              <div className="custom-stat-pill">
                <CameraOutlined style={{ marginRight: 4 }} /> {photoCount}
              </div>
              <div className="custom-stat-pill">
                <EyeOutlined style={{ marginRight: 4 }} /> {viewCount}
              </div>
            </div>
          </div>
        }
      >
        <div className="custom-card-body">
          {/* Developer / Verified Header */}
          <div className="custom-card-developer-bar">
            <div className="custom-dev-name-wrap">
              <BuildOutlined className="custom-dev-icon" />
              <span className="custom-dev-name">{developerName}</span>
              <CheckCircleFilled className="custom-verified-icon" title="Verified Builder" />
            </div>
            <Rate disabled defaultValue={4.5} allowHalf className="custom-rating-stars" />
          </div>

          {/* Location */}
          <div className="custom-card-location">
            <EnvironmentOutlined className="custom-loc-pin" />
            <span className="custom-loc-text">{getFormattedLocation()}</span>
          </div>

          {/* Property Title */}
          <h3 className="custom-card-title" title={property.title}>
            {property.title}
          </h3>

          {/* Price & Budget Row */}
          <div className="custom-card-price-row">
            <div className="custom-price-main">
              {formatPriceToIndian(property.priceRange)}
            </div>
            {getPricePerSqft() && (
              <div className="custom-price-sqft">
                {getPricePerSqft()}
              </div>
            )}
            <div className="custom-budget-badge">
              {property.budgetType || 'Best Value'}
            </div>
          </div>

          {/* Spec Grid - 3 Equal Columns */}
          <div className="custom-spec-grid">
            <div className="custom-spec-box">
              <HomeOutlined className="custom-spec-icon icon-bhk" />
              <div className="custom-spec-value">{property.bedrooms || '2'}</div>
              <div className="custom-spec-label">BHK</div>
            </div>

            <div className="custom-spec-box">
              <RestOutlined className="custom-spec-icon icon-bath" />
              <div className="custom-spec-value">{property.bathrooms || '1'}</div>
              <div className="custom-spec-label">BATHS</div>
            </div>

            <div className="custom-spec-box">
              <AreaChartOutlined className="custom-spec-icon icon-area" />
              <div className="custom-spec-value">{getFormattedArea() || '1,200'}</div>
              <div className="custom-spec-label">SQ FT</div>
            </div>
          </div>

          {/* Tags */}
          <div className="custom-card-tags">
            {property.furnishedStatus && (
              <span className="custom-pill-tag tag-blue">
                <HomeOutlined style={{ marginRight: 4 }} />
                {property.furnishedStatus}
              </span>
            )}
            {property.facing && (
              <span className="custom-pill-tag tag-purple">
                <CompassOutlined style={{ marginRight: 4 }} />
                {property.facing}
              </span>
            )}
            {property.parkingAvailable ? (
              <span className="custom-pill-tag tag-green">
                <CarOutlined style={{ marginRight: 4 }} />
                Parking
              </span>
            ) : null}
          </div>

          {/* Action Section */}
          <div className="custom-card-actions">
            <Button
              type="primary"
              block
              size="large"
              className="custom-btn-view-details"
              icon={<ArrowRightOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/property/details/${property.id}`;
              }}
            >
              View Full Details
            </Button>

            <div className="custom-contact-btn-group">
              <button
                type="button"
                className="custom-contact-btn btn-call"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenInquiry) {
                    onOpenInquiry(property);
                  } else {
                    window.open('tel:+918939000065');
                  }
                }}
              >
                <PhoneOutlined style={{ marginRight: 6 }} /> Contact
              </button>

              <button
                type="button"
                className="custom-contact-btn btn-whatsapp"
                onClick={(e) => {
                  e.stopPropagation();
                  const messageText = encodeURIComponent(`Hi, I'm interested in "${property.title}" (ID: #${property.id})`);
                  window.open(`https://wa.me/918939000065?text=${messageText}`);
                }}
              >
                <WhatsAppOutlined style={{ marginRight: 6 }} /> WhatsApp
              </button>
            </div>
          </div>

          {/* Card Footer */}
          <div className="custom-card-footer">
            <span className="custom-posted-date">
              <CalendarOutlined style={{ marginRight: 4 }} />
              {property.createdAt ? `Posted ${Math.max(1, Math.floor((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24)))}d ago` : 'Verified Property'}
            </span>
            <span className="custom-property-id">ID: #{property.id}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyCard;
