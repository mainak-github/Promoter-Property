import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";

import houseThumb from "../../public/assets/images/thumbs/house.png";
import apiurl from '../url';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// All Antd & React-Icons for a comprehensive set
import {
    FaRupeeSign, FaBed, FaBath, FaRulerCombined, FaCity, FaCompass,
    FaSchool, FaHospital, FaBus, FaTrain, FaUniversity, FaMapMarkerAlt, FaHome, FaBuilding, FaStoreAlt,
    FaDoorOpen, FaCar, FaKey, FaUserShield, FaCalendarAlt, FaCouch, FaLayerGroup, FaToilet,
    FaEye, FaHeart, FaPhone, FaTools, FaChair, FaLock, FaGlobe
} from "react-icons/fa";

import {
    Card, Row, Col, Spin, Button, Space, Typography, Image, Divider, Tag, Empty, Avatar, Descriptions, List, Tooltip, Rate
} from "antd";

import {
    DollarCircleOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    KeyOutlined,
    ApartmentOutlined,
    CompassOutlined,
    CarOutlined,
    SafetyOutlined,
    ShopOutlined,
    ReadOutlined,
    BankOutlined,
    HeartOutlined,
    PhoneOutlined,
    GlobalOutlined,
    EyeOutlined,
    MessageOutlined,
    UserOutlined,
    BlockOutlined,
    AreaChartOutlined,
    PushpinOutlined,
    CheckCircleOutlined,
    ToolOutlined,
    WhatsAppOutlined,
    MailOutlined,
    ShareAltOutlined,
    DownloadOutlined,
    SearchOutlined,
    InfoCircleOutlined,
    SolutionOutlined,
    TeamOutlined,
    CameraOutlined,
    HeartFilled,
    BuildOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

// --- DYNAMIC ICONS & DATA MAPPING ---

const facilityIconMap = {
    "Metro Station urban": <GlobalOutlined style={{ fontSize: 20, color: '#1a73e8' }} />,
    "School": <ReadOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    "Hospital": <HeartOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />,
    "BusStop": <GlobalOutlined style={{ fontSize: 20, color: '#faad14' }} />,
    "TrainStation": <BankOutlined style={{ fontSize: 20, color: '#13c2c2' }} />,
    "University": <ReadOutlined style={{ fontSize: 20, color: '#52c41a' }} />,
    "Market": <ShopOutlined style={{ fontSize: 20, color: '#597ef7' }} />,
};

const propertyOverviewMap = [
    { label: "Bedrooms", key: "bedrooms", icon: <FaBed />, unit: "BHK" },
    { label: "Bathrooms", key: "bathrooms", icon: <FaBath />, unit: "" },
    { label: "Carpet Area", key: "carpetArea", icon: <FaRulerCombined />, unit: "sqft" },
    { label: "Built-up Area", key: "totalArea", icon: <AreaChartOutlined />, unit: "sqft" },
    { label: "Facing", key: "facing", icon: <FaCompass />, unit: "" },
    { label: "Ownership", key: "ownershipType", icon: <FaKey />, unit: "" },
    { label: "Furnishing Status", key: "furnishedStatus", icon: <FaCouch />, unit: "" },
    { label: "Parking", key: "parkingAvailable", icon: <FaCar />, unit: "" },
    { label: "Floor Number", key: "floorNumber", icon: <ApartmentOutlined />, unit: "" },
    { label: "Total Towers", key: "numberOfTowers", icon: <FaBuilding />, unit: "" },
    { label: "Property Status", key: "status", icon: <CheckCircleOutlined />, unit: "" },
    { label: "Launch Date", key: "launchDate", icon: <CalendarOutlined />, unit: "" },
    { label: "Completion Date", key: "completionDate", icon: <CalendarOutlined />, unit: "" },
    { label: "Budget Type", key: "budgetType", icon: <DollarCircleOutlined />, unit: "" },
];

// Similar Property Item Component
const SimilarPropertyItem = ({ property, resolveImage }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Enhanced Indian Price Formatting
    const formatPriceToIndian = (priceString) => {
        if (!priceString) return '₹0';
        
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

    const getFormattedLocation = () => {
        const locationParts = [
            property.suburb,
            property.city
        ].filter(Boolean);
        
        return locationParts.join(', ') || property.city || 'Prime Location';
    };

    const getDeveloperName = () => {
        return property.developerInfo?.developerName || 'Premium Developer';
    };

    const handleCardClick = () => {
        window.location.href = `/property/details/${property.id}`;
    };

    return (
        <div className="similar-property-card-container" onClick={handleCardClick}>
            <Card
                className="similar-property-card"
                hoverable
                bordered={false}
                cover={
                    <div className="similar-property-image-container">
                        <div className="image-wrapper">
                            {!imageLoaded && (
                                <div className="image-placeholder">
                                    <Spin />
                                </div>
                            )}
                            <img
                                alt={property.title}
                                src={resolveImage(property.coverPhoto)}
                                className="property-main-image"
                                onLoad={() => setImageLoaded(true)}
                                onError={(e) => {
                                    e.target.src = houseThumb;
                                }}
                            />
                        </div>
                        <div className="image-overlay">
                            <div className="overlay-stats">
                                <Tag className="stat-tag">
                                    <CameraOutlined /> {(property.images?.length || 0) + 1}
                                </Tag>
                            </div>
                        </div>
                        <div className="favorite-button">
                            <Button
                                type="text"
                                shape="circle"
                                size="small"
                                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFavorite(!isFavorite);
                                }}
                            />
                        </div>
                    </div>
                }
            >
                <div className="card-content">
                    <div className="developer-section">
                        <div className="developer-info">
                            <Space size="small">
                                <Avatar size="small" icon={<BuildOutlined />} className="developer-avatar" />
                                <Text className="developer-name">{getDeveloperName()}</Text>
                            </Space>
                            <Rate 
                                disabled 
                                defaultValue={4.2} 
                                allowHalf 
                                className="developer-rating"
                            />
                        </div>
                    </div>

                    <div className="location-section">
                        <Text className="location-text" ellipsis>
                            <EnvironmentOutlined className="location-icon" />
                            {getFormattedLocation()}
                        </Text>
                    </div>

                    <div className="title-section">
                        <Title level={5} className="property-title" ellipsis={{ rows: 2 }}>
                            {property.title}
                        </Title>
                    </div>

                    <div className="price-section">
                        <div className="price-container">
                            <div className="main-price">
                                {formatPriceToIndian(property.priceRange)}
                            </div>
                            <Tag size="small" color="green" className="budget-tag">
                                {property.budgetType || 'Total Price'}
                            </Tag>
                        </div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item bedrooms">
                            <div className="feature-icon">
                                <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                            </div>
                            <div className="feature-details">
                                <div className="feature-number">{property.bedrooms || 2}</div>
                                <div className="feature-label">Bedrooms</div>
                            </div>
                        </div>
                        
                        <div className="feature-item bathrooms">
                            <div className="feature-icon">
                                <span style={{ fontSize: '16px' }}>🚿</span>
                            </div>
                            <div className="feature-details">
                                <div className="feature-number">{property.bathrooms || 1}</div>
                                <div className="feature-label">Bathrooms</div>
                            </div>
                        </div>

                        <div className="feature-item area">
                            <div className="feature-icon">
                                <AreaChartOutlined style={{ fontSize: '16px', color: '#fa8c16' }} />
                            </div>
                            <div className="feature-details">
                                <div className="feature-number">
                                    {parseInt(property.carpetArea || property.totalArea || 1200).toLocaleString('en-IN')}
                                </div>
                                <div className="feature-label">Sq Ft</div>
                            </div>
                        </div>
                    </div>

                    <div className="action-section">
                        <div className="view-details-indicator">
                            <EyeOutlined style={{ marginRight: 6 }} />
                            <span>Click to view details</span>
                        </div>
                    </div>
                </div>
            </Card>

            <style>{`
                .similar-property-card-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                }

                .similar-property-card {
                    height: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    border-radius: 12px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    overflow: hidden !important;
                    background: #ffffff !important;
                    border: 1px solid #f0f0f0 !important;
                }

                .similar-property-card-container:hover .similar-property-card {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
                    transform: translateY(-4px) !important;
                    border-color: #1890ff !important;
                }

                .similar-property-card .ant-card-body {
                    padding: 0 !important;
                    height: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                }

                .similar-property-image-container {
                    position: relative;
                    height: 180px;
                    overflow: hidden;
                    background: #f5f5f5;
                }

                .image-wrapper {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .property-main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .similar-property-card-container:hover .property-main-image {
                    transform: scale(1.05);
                }

                .image-placeholder {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                }

                .image-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
                    padding: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .similar-property-card-container:hover .image-overlay {
                    opacity: 1;
                }

                .overlay-stats {
                    display: flex;
                    gap: 8px;
                }

                .stat-tag {
                    background: rgba(255, 255, 255, 0.9) !important;
                    color: rgba(0, 0, 0, 0.85) !important;
                    border: none !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                }

                .favorite-button {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 2;
                }

                .favorite-btn {
                    background: rgba(255, 255, 255, 0.95) !important;
                    border: none !important;
                    width: 32px !important;
                    height: 32px !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
                    transition: all 0.3s ease !important;
                }

                .favorite-btn:hover {
                    transform: scale(1.1) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                }

                .favorite-btn.favorited {
                    background: #ff4d4f !important;
                    color: white !important;
                }

                .card-content {
                    padding: 14px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .developer-section {
                    height: 22px;
                }

                .developer-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .developer-avatar {
                    background-color: #1890ff !important;
                }

                .developer-name {
                    color: #1890ff !important;
                    font-weight: 600 !important;
                    font-size: 11px !important;
                }

                .developer-rating {
                    font-size: 10px !important;
                }

                .location-section {
                    height: 18px;
                }

                .location-text {
                    color: #666 !important;
                    font-size: 11px !important;
                    display: block;
                }

                .location-icon {
                    color: #ff4d4f;
                    margin-right: 4px;
                    font-size: 12px;
                }

                .title-section {
                    height: 44px;
                    display: flex;
                    align-items: flex-start;
                }

                .property-title {
                    margin: 0 !important;
                    font-size: 14px !important;
                    line-height: 1.4 !important;
                    color: #262626 !important;
                    font-weight: 600 !important;
                }

                .price-section {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .price-container {
                    background: linear-gradient(135deg, #f6ffed, #e6f7ff);
                    border: 1px solid #d9f7be;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    width: 100%;
                }

                .main-price {
                    font-size: 20px !important;
                    font-weight: 700 !important;
                    color: #389e0d !important;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .budget-tag {
                    font-size: 10px !important;
                }

                .features-grid {
                    height: 60px;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 6px;
                }

                .feature-item {
                    background: #fafafa;
                    border: 1px solid #f0f0f0;
                    border-radius: 6px;
                    padding: 8px 4px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    transition: all 0.3s ease;
                }

                .similar-property-card-container:hover .feature-item {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .feature-item.bedrooms {
                    background: linear-gradient(135deg, #e6f7ff, #f0f8ff);
                    border-color: #91d5ff;
                }

                .feature-item.bathrooms {
                    background: linear-gradient(135deg, #f6ffed, #f0f9ff);
                    border-color: #b7eb8f;
                }

                .feature-item.area {
                    background: linear-gradient(135deg, #fff7e6, #fffbf0);
                    border-color: #ffd591;
                }

                .feature-icon {
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .feature-details {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .feature-number {
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    color: #262626 !important;
                    line-height: 1;
                }

                .feature-label {
                    font-size: 9px !important;
                    color: #8c8c8c !important;
                    line-height: 1;
                    font-weight: 500 !important;
                }

                .action-section {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: auto;
                }

                .view-details-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1890ff;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #e6f7ff, #f0f8ff);
                    border: 1px solid #91d5ff;
                    border-radius: 6px;
                    width: 100%;
                    transition: all 0.3s ease;
                }

                .similar-property-card-container:hover .view-details-indicator {
                    background: linear-gradient(135deg, #1890ff, #096dd9);
                    color: white;
                    border-color: #1890ff;
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

const PropertyDetailsSection = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [similarLoading, setSimilarLoading] = useState(true);
    const [mainImage, setMainImage] = useState(houseThumb);
    const sliderRef = useRef(null);

    const phoneNumber = "+918939000065";

    const resolveImage = (url) => {
        if (!url || url.includes("null")) return houseThumb;
        return url.replace(/\\/g, "/").replace("..", `${apiurl.IMAGE_URL}`);
    };

    const getPropertyData = async (propertyId) => {
        try {
            const res = await axios.get(`${apiurl.API_URL}/public/properties/${propertyId}`);
            const data = res.data.data;
            setProperty(data);
            const allPhotos = [
                resolveImage(data.coverPhoto),
                ...(data.images?.map(img => resolveImage(img.imageUrl)) || [])
            ].filter(url => url && !url.includes("null"));
            setMainImage(allPhotos[0] || houseThumb);
        } catch (error) {
            console.error("Error fetching property:", error);
            Swal.fire('Error', 'Failed to fetch property details. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getSimilarProperties = async () => {
        try {
            const res = await axios.get(`${apiurl.API_URL}/public/properties`, {
                params: { page: 1, limit: 4, sortBy: "createdAt", order: "desc" }
            });
            if (res.data.status === "success") {
                // Filter out current property and get random 4 properties
                const allProperties = res.data.data.properties.filter(p => p.id !== parseInt(id));
                const shuffled = allProperties.sort(() => 0.5 - Math.random());
                setSimilarProperties(shuffled.slice(0, 4));
            }
        } catch (error) {
            console.error("Error fetching similar properties:", error);
        } finally {
            setSimilarLoading(false);
        }
    };

    useEffect(() => {
        getPropertyData(id);
        getSimilarProperties();
    }, [id]);

    const handleThumbnailClick = (image, index) => {
        setMainImage(image);
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: property.title,
            text: `Check out this property: ${property.title} - ${property.shortDescription}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`;
                window.open(whatsappUrl, '_blank');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleVerifyAvailability = () => {
        if (property.status === "Ready to Move In") {
            Swal.fire({
                title: "Property Available!",
                text: "This property is ready to be moved into. Contact us to schedule a visit!",
                icon: "success",
                showConfirmButton: true,
                confirmButtonText: "Schedule Visit",
                showCancelButton: true,
                cancelButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleScheduleVisit();
                }
            });
        } else {
            Swal.fire({
                title: "Status: " + property.status,
                text: "This property is not yet ready. Please contact our team for more information.",
                icon: "info",
                confirmButtonText: "OK",
            });
        }
    };

    const handleScheduleVisit = () => {
        Swal.fire({
            title: "Schedule a Visit",
            html: `
                <input type="text" id="visitName" class="swal2-input" placeholder="Your Name">
                <input type="tel" id="visitPhone" class="swal2-input" placeholder="Phone Number">
                <input type="email" id="visitEmail" class="swal2-input" placeholder="Email (Optional)">
                <input type="datetime-local" id="visitDateTime" class="swal2-input" placeholder="Preferred Date & Time">
                <textarea id="visitMessage" class="swal2-textarea" placeholder="Any special requests?"></textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Submit Request",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const name = document.getElementById("visitName").value.trim();
                const phone = document.getElementById("visitPhone").value.trim();
                if (!name || !phone) {
                    Swal.showValidationMessage("Please enter your Name and Phone number.");
                    return false;
                }
                return {
                    name: name,
                    phone: phone,
                    email: document.getElementById("visitEmail").value.trim(),
                    dateTime: document.getElementById("visitDateTime").value,
                    message: document.getElementById("visitMessage").value.trim()
                };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`${apiurl.API_URL}/admin/leads`, {
                        ...result.value,
                        propertyId: property.id,
                        leadType: 'visit_schedule'
                    });
                    Swal.fire("Success", "Your visit request has been sent. We will contact you shortly to confirm.", "success");
                } catch (err) {
                    Swal.fire("Error", "Unable to send your request. Please try again later.", "error");
                    console.error(err);
                }
            }
        });
    };

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(5, (property?.images?.length || 0) + 1),
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: Math.min(4, (property?.images?.length || 0) + 1) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(3, (property?.images?.length || 0) + 1) } },
            { breakpoint: 576, settings: { slidesToShow: Math.min(2, (property?.images?.length || 0) + 1) } },
        ],
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" tip="Loading property details..." /></div>;
    if (!property) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Empty description="Property not found" /></div>;

    const allPhotos = [
        resolveImage(property.coverPhoto),
        ...(property.images?.map(img => resolveImage(img.imageUrl)) || [])
    ].filter(url => url && !url.includes("null"));

    const isParkingAvailable = property.parkingAvailable ? "Yes" : "No";

    return (
        <section style={{ backgroundColor: '#f0f2f5', padding: '24px 0', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    {/* ----- Main Content Column ----- */}
                    <Col xs={24} lg={16}>
                        {/* --- HERO SECTION: Images & Key Info --- */}
                        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                            <Row gutter={[24, 24]}>
                                {/* Main Image Display */}
                                <Col xs={24} md={14}>
                                    <Image
                                        src={mainImage}
                                        alt={property.title}
                                        style={{ maxHeight: 450, objectFit: "cover", width: '100%', borderRadius: 8 }}
                                        preview={false}
                                    />
                                    {/* Thumbnail Slider */}
                                    <Slider {...sliderSettings} ref={sliderRef} style={{ marginTop: 16 }}>
                                        {allPhotos.map((url, idx) => (
                                            <div key={idx} style={{ padding: '0 4px' }} onClick={() => handleThumbnailClick(url, idx)}>
                                                <Image
                                                    src={url}
                                                    alt={`Property photo ${idx + 1}`}
                                                    style={{
                                                        height: 80,
                                                        objectFit: "cover",
                                                        width: '100%',
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        border: mainImage === url ? '2px solid #1a73e8' : '2px solid transparent'
                                                    }}
                                                    preview={false}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </Col>
                                {/* Key Details & Action Buttons */}
                                <Col xs={24} md={10}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Title level={2} style={{ margin: 0, color: '#333' }}>{property.title}</Title>
                                        <Text type="secondary" style={{ display: 'block' }}>
                                            <EnvironmentOutlined style={{ marginRight: 8 }} />
                                            {property.address || [property.suburb, property.city].filter(Boolean).join(", ")}
                                        </Text>
                                        <Divider style={{ margin: '16px 0' }} />
                                        <Row gutter={[16, 16]}>
                                            <Col span={8} className="text-center">
                                                <Title level={4} style={{ margin: 0, color: '#1a73e8' }}><FaRupeeSign />{property.priceRange}</Title>
                                                <Text type="secondary">Price</Text>
                                            </Col>
                                            <Col span={8} className="text-center">
                                                <Title level={4} style={{ margin: 0 }}>{property.carpetArea}</Title>
                                                <Text type="secondary">Carpet Area (sqft)</Text>
                                            </Col>
                                            <Col span={8} className="text-center">
                                                <Title level={4} style={{ margin: 0 }}>{property.bedrooms}</Title>
                                                <Text type="secondary">Bedrooms</Text>
                                            </Col>
                                        </Row>
                                        <Divider style={{ margin: '16px 0' }} />
                                        <Button type="primary" size="large" block icon={<CheckCircleOutlined />} onClick={handleVerifyAvailability}>
                                            Verify Availability
                                        </Button>
                                        <Button size="large" block icon={<PhoneOutlined />} onClick={handleScheduleVisit}>
                                            Schedule Visit
                                        </Button>
                                        <Button size="large" block icon={<ShareAltOutlined />} onClick={handleShare}>
                                            Share
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>

                        {/* --- OVERVIEW & FEATURES --- */}
                        <Card title={<Title level={4}><InfoCircleOutlined /> Property Overview</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="small">
                                {propertyOverviewMap.map(item => {
                                    let value = property[item.key];
                                    if (item.key === 'launchDate' || item.key === 'completionDate') {
                                        value = value ? new Date(value).toLocaleDateString() : 'N/A';
                                    } else if (item.key === 'parkingAvailable') {
                                        value = isParkingAvailable;
                                    } else if (!value) {
                                        value = 'N/A';
                                    }
                                    return (
                                        <Descriptions.Item label={<Space><span style={{ color: '#1a73e8' }}>{item.icon}</span><Text strong>{item.label}</Text></Space>} key={item.key}>
                                            {value} {item.unit}
                                        </Descriptions.Item>
                                    );
                                })}
                            </Descriptions>
                        </Card>

                        {/* --- DESCRIPTION --- */}
                        <Card title={<Title level={4}><SearchOutlined /> Detailed Description</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                            {property.longDescription || property.shortDescription ? (
                                <List
                                    size="large"
                                    dataSource={(property.longDescription || property.shortDescription)
                                        .split('\n')
                                        .filter(item => item.trim() !== '')
                                        .map(item => item.trim())}
                                    renderItem={item => (
                                        <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                            <Space align="start">
                                                <span style={{ color: '#1a73e8', fontSize: '8px', marginTop: '8px' }}>●</span>
                                                <Text style={{ lineHeight: '1.8', fontSize: '15px' }}>{item}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty description="No description available" />
                            )}
                        </Card>

                        {/* --- AMENITIES --- */}
                        {property.amenities?.length > 0 && (
                            <Card title={<Title level={4}><ToolOutlined /> Amenities</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Row gutter={[16, 16]}>
                                    {property.amenities.map((item, idx) => (
                                        <Col xs={12} sm={8} md={6} key={idx}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                                <Image src={resolveImage(item.iconUrl)} alt={item.name} width={40} preview={false} style={{ marginBottom: 8 }} />
                                                <Text strong>{item.name}</Text>
                                                {item.value && <Text type="secondary">{item.value}</Text>}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        )}
                        
                        {/* --- FLOOR PLANS & LAYOUTS --- */}
                        {(property.floorPlans?.length > 0 || property.layoutMaps?.length > 0) && (
                            <Card title={<Title level={4}><BlockOutlined /> Floor Plans & Layout Maps</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Row gutter={[16, 16]}>
                                    {property.floorPlans?.map((plan, idx) => (
                                        <Col xs={24} md={12} key={`plan-${idx}`}>
                                            <Card hoverable cover={plan.photo && <Image src={resolveImage(plan.photo)} alt="Floor Plan" style={{ width: '100%' }} preview={false} />}>
                                                <Card.Meta title={`${plan.floorName} (Tower ${plan.towerName})`} description={plan.shortDescription} />
                                                <Text strong style={{ marginTop: '8px', display: 'block' }}>Price: {plan.priceRange}</Text>
                                            </Card>
                                        </Col>
                                    ))}
                                    {property.layoutMaps?.filter(m => m.imageUrl).length > 0 && property.layoutMaps.map((map, idx) =>
                                        <Col xs={24} md={12} key={`map-${idx}`}>
                                            <Image src={resolveImage(map.imageUrl)} alt="Layout Map" style={{ width: '100%', borderRadius: 8 }} />
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        )}

                        {/* --- NEIGHBOURHOOD & MAP --- */}
                        <Card title={<Title level={4}><GlobalOutlined /> Neighbourhood</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    {property.latitude && property.longitude ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                                            style={{ width: "100%", height: 350, border: 0, borderRadius: 8 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Google Map"
                                        />
                                    ) : (
                                        <Empty description="Map not available" />
                                    )}
                                </Col>
                                <Col xs={24} md={12}>
                                    {property.nearbyFacilities?.length > 0 ? (
                                        <List
                                            header={<Title level={5}>Nearby Locations</Title>}
                                            dataSource={property.nearbyFacilities}
                                            renderItem={item => (
                                                <List.Item>
                                                    <Space>
                                                        {facilityIconMap[item.facilityType] || <FaMapMarkerAlt style={{ marginRight: 8, color: '#333' }} />}
                                                        <div>
                                                            <Text strong>{item.facilityName}</Text>
                                                            <Tag style={{ marginLeft: 8 }} color="blue">{item.distance}</Tag>
                                                        </div>
                                                    </Space>
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Empty description="No nearby facilities listed." />
                                    )}
                                </Col>
                            </Row>
                        </Card>
                        
                        {/* --- DEVELOPER INFO --- */}
                        {property.developerInfo && (
                            <Card title={<Title level={4}><TeamOutlined /> Developer</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Space size="large">
                                    <Avatar size={80} src={property.developerInfo.developerLogo ? resolveImage(property.developerInfo.developerLogo) : null} icon={<UserOutlined />} />
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>{property.developerInfo.developerName}</Title>
                                        <Text type="secondary">{property.developerInfo.developerDescription}</Text>
                                    </div>
                                </Space>
                            </Card>
                        )}

                        {/* --- SIMILAR PROPERTIES --- */}
                        <Card title={<Title level={4}>Similar Properties</Title>} bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                            {similarLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Spin size="large" />
                                    <Text style={{ display: 'block', marginTop: 16 }}>Loading similar properties...</Text>
                                </div>
                            ) : similarProperties.length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {similarProperties.map((similarProp, index) => (
                                        <Col xs={24} sm={12} md={12} lg={12} xl={6} key={similarProp.id || `similar-${index}`}>
                                            <SimilarPropertyItem property={similarProp} resolveImage={resolveImage} />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Empty description="No similar properties found" />
                            )}
                        </Card>

                    </Col>

                    {/* ----- Sidebar Column ----- */}
                    <Col xs={24} lg={8}>
                        <div style={{ position: 'sticky', top: 24 }}>
                            <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Title level={5} style={{ margin: 0 }}>Contact Property Owner</Title>
                                    <Text type="secondary">Get in touch to learn more</Text>
                                    <Button type="primary" size="large" block icon={<MailOutlined />} onClick={() => {
                                        Swal.fire({
                                            title: "Enquire to Get Owner Details",
                                            html: `
                                                <input type="text" id="leadName" class="swal2-input" placeholder="Your Name">
                                                <input type="tel" id="leadPhone" class="swal2-input" placeholder="Phone Number">
                                                <input type="email" id="leadEmail" class="swal2-input" placeholder="Email">
                                                <textarea id="leadMessage" class="swal2-textarea" placeholder="Your Query"></textarea>
                                            `,
                                            focusConfirm: false,
                                            showCancelButton: true,
                                            confirmButtonText: "Submit",
                                            cancelButtonText: "Cancel",
                                            preConfirm: () => {
                                                const name = document.getElementById("leadName").value.trim();
                                                const phone = document.getElementById("leadPhone").value.trim();
                                                if (!name || !phone) {
                                                    Swal.showValidationMessage("Please enter Name and Phone");
                                                    return false;
                                                }
                                                return { name: name, phone: phone, email: document.getElementById("leadEmail").value.trim(), message: document.getElementById("leadMessage").value.trim() };
                                            },
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                try {
                                                    await axios.post(`${apiurl.API_URL}/admin/leads`, {
                                                        name: result.value.name,
                                                        phone: result.value.phone,
                                                        email: result.value.email,
                                                        message: result.value.message,
                                                        propertyId: property.id
                                                    });
                                                    Swal.fire("Success", "Your inquiry has been sent. We'll contact you shortly.", "success");
                                                } catch (err) {
                                                    Swal.fire("Error", "Unable to send your details. Try again later.", "error");
                                                }
                                            }
                                        });
                                    }}>
                                        Get Owner Details
                                    </Button>
                                    <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none' }}>
                                        <Button size="large" block icon={<PhoneOutlined />}>
                                            Call Now
                                        </Button>
                                    </a>
                                    <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hello, I am interested in the property: ${property.title}. Please provide more details.`)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <Button size="large" block icon={<WhatsAppOutlined />}>
                                            WhatsApp
                                        </Button>
                                    </a>
                                </Space>
                            </Card>

                            {/* Activity Section */}
                            <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Title level={5} style={{ margin: 0 }}>Activity on This Property</Title>
                                <Divider style={{ margin: '16px 0' }} />
                                <Row gutter={[16, 16]} justify="center">
                                    <Col className="text-center">
                                        <FaEye size={24} style={{ color: '#aaa' }} />
                                        <Text type="secondary" style={{ display: 'block' }}>{property.views || 903} Views</Text>
                                    </Col>
                                    <Col className="text-center">
                                        <FaHeart size={24} style={{ color: '#aaa' }} />
                                        <Text type="secondary" style={{ display: 'block' }}>{property.shortlists || 15} Shortlists</Text>
                                    </Col>
                                    <Col className="text-center">
                                        <FaPhone size={24} style={{ color: '#aaa' }} />
                                        <Text type="secondary" style={{ display: 'block' }}>{property.contacts || 24} Contacted</Text>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Other services/CTA can go here */}
                            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
                                <Title level={5} style={{ margin: 0 }}>Useful Services</Title>
                                <Divider style={{ margin: '16px 0' }} />
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button size="large" block icon={<DownloadOutlined />}>
                                        Download Brochure
                                    </Button>
                                    <Button size="large" block icon={<SolutionOutlined />}>
                                        Apply for Home Loan
                                    </Button>
                                </Space>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default PropertyDetailsSection;
