import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import apiurl from "../url";
import SEOHead from "../common/SEOHead";
import PageLoader from "../common/PageLoader";
import { getPropertyDetailsUrl, getPropertySlug } from "../utils/slugUtils";

import houseThumb from "../../public/assets/images/thumbs/house.png";

// All Antd & React-Icons for a comprehensive modern UI
import {
    FaRupeeSign, FaBed, FaBath, FaRulerCombined, FaCity, FaCompass,
    FaSchool, FaHospital, FaBus, FaTrain, FaUniversity, FaMapMarkerAlt, FaHome, FaBuilding, FaStoreAlt,
    FaDoorOpen, FaCar, FaKey, FaUserShield, FaCalendarAlt, FaCouch, FaLayerGroup, FaToilet,
    FaEye, FaHeart, FaPhone, FaTools, FaChair, FaLock, FaGlobe
} from "react-icons/fa";

import {
    Card, Row, Col, Spin, Button, Space, Typography, Image, Divider, Tag, Empty, Avatar, Descriptions, List, Tooltip, Rate, Badge, Tabs
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
    BuildOutlined,
    ArrowLeftOutlined,
    VerifiedOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// --- DYNAMIC ICONS & DATA MAPPING ---

const facilityIconMap = {
    "Metro Station urban": <GlobalOutlined style={{ fontSize: 18, color: '#1a73e8' }} />,
    "School": <ReadOutlined style={{ fontSize: 18, color: '#1890ff' }} />,
    "Hospital": <HeartOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />,
    "BusStop": <GlobalOutlined style={{ fontSize: 18, color: '#faad14' }} />,
    "TrainStation": <BankOutlined style={{ fontSize: 18, color: '#13c2c2' }} />,
    "University": <ReadOutlined style={{ fontSize: 18, color: '#52c41a' }} />,
    "Market": <ShopOutlined style={{ fontSize: 18, color: '#597ef7' }} />,
};

const propertyOverviewMap = [
    { key: "bedrooms", label: "Bedrooms", icon: <FaBed size={16} /> },
    { key: "bathrooms", label: "Bathrooms", icon: <FaBath size={16} /> },
    { key: "carpetArea", label: "Carpet Area", icon: <FaRulerCombined size={16} />, unit: "sqft" },
    { key: "totalArea", label: "Total / Built-up Area", icon: <AreaChartOutlined size={16} /> },
    { key: "propertyType", label: "Property Type", icon: <FaBuilding size={16} /> },
    { key: "facing", label: "Facing Direction", icon: <FaCompass size={16} /> },
    { key: "furnishedStatus", label: "Furnished Status", icon: <FaCouch size={16} /> },
    { key: "floorNumber", label: "Floor Number", icon: <FaLayerGroup size={16} /> },
    { key: "numberOfTowers", label: "Towers / Blocks", icon: <FaCity size={16} /> },
    { key: "parkingAvailable", label: "Parking Available", icon: <FaCar size={16} /> },
    { key: "launchDate", label: "Launch Date", icon: <FaCalendarAlt size={16} /> },
    { key: "completionDate", label: "Completion Date", icon: <FaCalendarAlt size={16} /> },
    { key: "budgetType", label: "Budget Segment", icon: <DollarCircleOutlined size={16} /> },
    { key: "approvalStatus", label: "Approval Verification", icon: <FaUserShield size={16} /> },
    { key: "pincode", label: "Postal Pincode", icon: <PushpinOutlined size={16} /> },
];

const SimilarPropertyItem = ({ property, resolveImage }) => {
    const formatDisplayPrice = (priceStr) => {
        if (!priceStr || priceStr === 'null') return 'Contact for Price';
        const str = String(priceStr).trim();
        if (str.toLowerCase().startsWith('₹')) return str;
        return `₹ ${str}`;
    };

    return (
        <Card
            hoverable
            style={{
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
            }}
            cover={
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img
                        src={resolveImage(property.coverPhoto)}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Tag color="#0f172a" style={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, borderRadius: 6, padding: '2px 8px' }}>
                        {property.propertyType || 'Property'}
                    </Tag>
                </div>
            }
        >
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                📍 {property.city || property.suburb || 'Location N/A'}
            </div>
            <Title level={5} ellipsis={{ rows: 1 }} style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                {property.title}
            </Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>
                    {formatDisplayPrice(property.priceRange)}
                </span>
                <Link to={getPropertyDetailsUrl(property)} onClick={() => window.scrollTo(0, 0)}>
                    <Button size="small" type="primary" style={{ background: '#0f172a', borderColor: '#0f172a', fontWeight: 700, borderRadius: 6 }}>
                        View
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

const PropertyDetailsSection = () => {
    const params = useParams();
    const identifier = params.identifier || params.id || params.title;
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [similarLoading, setSimilarLoading] = useState(true);
    const [mainImage, setMainImage] = useState(houseThumb);
    const [isSaved, setIsSaved] = useState(false);
    const sliderRef = useRef(null);

    const phoneNumber = "+918939000065";

    const resolveImage = (imgUrl) => {
        if (!imgUrl || String(imgUrl).includes("null")) return houseThumb;
        return String(imgUrl).replace(/\\/g, "/").replace("..", `${apiurl.IMAGE_URL}`);
    };

    const getPropertyData = async (propIdOrSlug) => {
        try {
            const res = await axios.get(`${apiurl.API_URL}/public/properties/${propIdOrSlug}`);
            const data = res.data.data;
            setProperty(data);
            const allPhotos = [
                resolveImage(data.coverPhoto),
                ...(data.images?.map(img => resolveImage(img.imageUrl)) || [])
            ].filter(url => url && !url.includes("null"));
            setMainImage(allPhotos[0] || houseThumb);
            return data;
        } catch (error) {
            console.error("Error fetching property:", error);
            Swal.fire('Error', 'Failed to fetch property details. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getSimilarProperties = async (currentProp) => {
        try {
            const res = await axios.get(`${apiurl.API_URL}/public/properties`, {
                params: { page: 1, limit: 10, sortBy: "createdAt", order: "desc" }
            });
            if (res.data.status === "success") {
                const currentId = currentProp?.id;
                const allProperties = res.data.data.properties.filter(p => p.id !== currentId);
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
        if (identifier) {
            getPropertyData(identifier).then(data => {
                if (data) getSimilarProperties(data);
            });
        }
    }, [identifier]);

    const handleThumbnailClick = (image, index) => {
        setMainImage(image);
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: property.title,
            text: `Check out this property: ${property.title} - ${property.shortDescription || ''}`,
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
        const status = property.status || "Ready to Move In";
        if (status === "Ready to Move In") {
            Swal.fire({
                title: "Property Available!",
                text: "This listing is verified & ready for viewing. Contact us to schedule a site tour!",
                icon: "success",
                showConfirmButton: true,
                confirmButtonText: "Schedule Visit Now",
                showCancelButton: true,
                confirmButtonColor: "#ea580c"
            }).then((result) => {
                if (result.isConfirmed) {
                    handleScheduleVisit();
                }
            });
        } else {
            Swal.fire({
                title: "Status: " + status,
                text: "This property is currently under construction or pending launch. Contact our admin team for early booking opportunities.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#0f172a"
            });
        }
    };

    const handleScheduleVisit = () => {
        Swal.fire({
            title: "Schedule a Guided Site Visit",
            html: `
                <div style="text-align:left; font-size:14px; color:#475569; margin-bottom:12px;">Book an exclusive walkthrough with our representative:</div>
                <input type="text" id="visitName" class="swal2-input" placeholder="Full Name *">
                <input type="tel" id="visitPhone" class="swal2-input" placeholder="Phone Number *">
                <input type="email" id="visitEmail" class="swal2-input" placeholder="Email Address">
                <input type="datetime-local" id="visitDateTime" class="swal2-input">
                <textarea id="visitMessage" class="swal2-textarea" placeholder="Any specific questions or requirements?"></textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Confirm Request",
            confirmButtonColor: "#ea580c",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const name = document.getElementById("visitName").value.trim();
                const phone = document.getElementById("visitPhone").value.trim();
                if (!name || !phone) {
                    Swal.showValidationMessage("Please enter your Full Name and Phone number.");
                    return false;
                }
                return {
                    name,
                    phone,
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
                    Swal.fire("Success", "Your visit request has been sent! Our team will contact you shortly.", "success");
                } catch (err) {
                    Swal.fire("Error", "Unable to send request. Please try again later.", "error");
                }
            }
        });
    };

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 400,
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

    if (loading) return (
        <PageLoader text="Loading property details..." />
    );

    if (!property) return (
        <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
            <Empty description="Property listing not found." />
        </div>
    );

    const allPhotos = [
        resolveImage(property.coverPhoto),
        ...(property.images?.map(img => resolveImage(img.imageUrl)) || [])
    ].filter(url => url && !url.includes("null"));

    const isParkingAvailable = property.parkingAvailable ? "Available" : "Not Available";

    // Clean price display (avoiding raw 'null' or unformatted text)
    const rawPrice = property.priceRange && property.priceRange !== 'null' ? String(property.priceRange).trim() : 'Contact for Price';
    const displayPrice = rawPrice.toLowerCase().startsWith('₹') ? rawPrice : `₹ ${rawPrice}`;

    // Clean area display
    const displayArea = (property.carpetArea && property.carpetArea !== 'null') 
        ? `${property.carpetArea} sqft` 
        : (property.totalArea && property.totalArea !== 'null') 
            ? `${property.totalArea}` 
            : 'Plot / Land Area';

    // Clean bedrooms / bathrooms display
    const isPlotOrLand = (property.propertyType || '').toLowerCase().includes('plot') || (property.propertyType || '').toLowerCase().includes('land');
    const displayBeds = isPlotOrLand 
        ? 'Plot / Land' 
        : (property.bedrooms && property.bedrooms !== 'null' && property.bedrooms !== 0) 
            ? `${property.bedrooms} BHK` 
            : 'Residential Unit';

    const propertySchema = property ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.seoTitle || property.title,
        "description": property.metaDescription || property.shortDescription || property.longDescription || property.title,
        "url": `https://promoterproperty.com${getPropertyDetailsUrl(property)}`,
        "datePosted": property.createdAt,
        "image": mainImage ? [mainImage] : [],
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "price": property.priceRange || "Price on Request"
        },
        "itemOffered": {
            "@type": (property.propertyType || '').toLowerCase().includes('villa') ? "SingleFamilyResidence" : "Apartment",
            "name": property.title,
            "numberOfBedrooms": property.bedrooms || 2,
            "numberOfBathroomsTotal": property.bathrooms || 1,
            "floorSize": {
                "@type": "QuantitativeValue",
                "value": property.carpetArea || property.totalArea || 1000,
                "unitCode": "FTK"
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": property.city || "Kolkata",
                "addressRegion": property.state || "West Bengal",
                "addressCountry": "IN",
                "postalCode": property.pincode || ""
            }
        }
    } : null;

    return (
        <section style={{ backgroundColor: '#f8fafc', padding: '24px 0 60px 0', minHeight: '100vh' }}>
            {property ? (
                <SEOHead
                    title={property.seoTitle || property.title}
                    description={property.metaDescription || property.shortDescription || `View details for ${property.title} in ${property.city || 'Kolkata'}.`}
                    keywords={property.metaKeywords || `${property.title}, ${property.city || ''} property, buy ${property.propertyType || 'flat'}`}
                    canonicalPath={property.canonicalUrl || getPropertyDetailsUrl(property)}
                    ogImage={mainImage}
                    ogType="article"
                    schemaJson={propertySchema}
                    robots={property.robotsIndex || 'index, follow'}
                />
            ) : (
                <SEOHead title="Property Details" robots="noindex, follow" />
            )}
            <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
                
                {/* --- NAVIGATION BREADCRUMB & ACTION HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <Link to="/properties" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button icon={<ArrowLeftOutlined />} style={{ borderRadius: 8, fontWeight: 700 }}>
                            Back to Properties
                        </Button>
                    </Link>

                    <Space size="middle">
                        <Button 
                            icon={isSaved ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
                            onClick={() => setIsSaved(!isSaved)}
                            style={{ borderRadius: 8, fontWeight: 700 }}
                        >
                            {isSaved ? 'Saved' : 'Save'}
                        </Button>
                        <Button icon={<ShareAltOutlined />} onClick={handleShare} style={{ borderRadius: 8, fontWeight: 700 }}>
                            Share
                        </Button>
                    </Space>
                </div>

                {/* --- PROPERTY HERO TITLE & LOCATION BANNER --- */}
                <div style={{
                    background: '#ffffff',
                    padding: '24px 28px',
                    borderRadius: 16,
                    marginBottom: 24,
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col xs={24} md={16}>
                            <Space wrap style={{ marginBottom: 8 }}>
                                <Tag color="#ea580c" style={{ fontWeight: 800, padding: '4px 12px', fontSize: '0.8rem', borderRadius: 6 }}>
                                    {property.propertyType || 'PROPERTY'}
                                </Tag>
                                {(property.approvalStatus || 'approved') === 'approved' && (
                                    <Tag color="green" icon={<VerifiedOutlined />} style={{ fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
                                        Verified Listing
                                    </Tag>
                                )}
                                <Tag color="blue" style={{ fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
                                    {property.status || 'Ready to Move In'}
                                </Tag>
                            </Space>
                            <h1 style={{ margin: '4px 0 8px 0', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                                {property.title}
                            </h1>
                            <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <EnvironmentOutlined style={{ color: '#ea580c' }} />
                                {property.address && property.address !== 'null' 
                                    ? property.address 
                                    : [property.suburb, property.city, property.state].filter(Boolean).join(', ')}
                            </div>
                        </Col>

                        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Listing Valuation
                            </div>
                            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ea580c', lineHeight: 1.1 }}>
                                {displayPrice}
                            </div>
                            {property.priceRange && !property.priceRange.includes('Contact') && (
                                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: 4 }}>
                                    ⚡ Best Price Guaranteed
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>

                <Row gutter={[24, 24]}>
                    {/* ----- MAIN COLUMN (Left 16 Grid) ----- */}
                    <Col xs={24} lg={16}>
                        {/* --- PHOTO GALLERY CARD --- */}
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: 16, 
                                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', 
                                marginBottom: 24, 
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                <Image
                                    src={mainImage}
                                    alt={property.title}
                                    wrapperStyle={{ width: '100%', height: 420 }}
                                    style={{ width: '100%', height: 420, objectFit: 'cover' }}
                                    preview={true}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    color: '#ffffff',
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    📷 {allPhotos.length} High-Res Photos
                                </div>
                            </div>

                            {/* Thumbnail Strip */}
                            {allPhotos.length > 1 && (
                                <div style={{ marginTop: 16 }}>
                                    <Slider {...sliderSettings} ref={sliderRef}>
                                        {allPhotos.map((url, idx) => (
                                            <div key={idx} style={{ padding: '0 4px' }} onClick={() => handleThumbnailClick(url, idx)}>
                                                <div style={{
                                                    borderRadius: 10,
                                                    overflow: 'hidden',
                                                    height: 75,
                                                    border: mainImage === url ? '3px solid #ea580c' : '2px solid transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    <img
                                                        src={url}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            )}
                        </Card>

                        {/* --- KEY HIGHLIGHTS CARDS ROW --- */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={12} sm={6}>
                                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                                    <div style={{ color: '#ea580c', fontSize: '1.2rem', marginBottom: 4 }}><FaRupeeSign /></div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Price</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{displayPrice}</div>
                                </div>
                            </Col>

                            <Col xs={12} sm={6}>
                                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                                    <div style={{ color: '#3b82f6', fontSize: '1.2rem', marginBottom: 4 }}><FaRulerCombined /></div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Area</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{displayArea}</div>
                                </div>
                            </Col>

                            <Col xs={12} sm={6}>
                                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                                    <div style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: 4 }}><FaBed /></div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Config</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{displayBeds}</div>
                                </div>
                            </Col>

                            <Col xs={12} sm={6}>
                                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.2rem', marginBottom: 4 }}><FaCompass /></div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Facing</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{property.facing || 'East Facing'}</div>
                                </div>
                            </Col>
                        </Row>

                        {/* --- TABBED CONTENT DETAILS --- */}
                        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', marginBottom: 24, border: '1px solid #e2e8f0' }}>
                            <Tabs 
                                defaultActiveKey="1" 
                                size="large"
                                items={[
                                    {
                                        key: '1',
                                        label: <span style={{ fontWeight: 800, fontSize: '0.95rem' }}><InfoCircleOutlined /> Property Specifications</span>,
                                        children: (
                                            <div style={{ paddingTop: 12 }}>
                                                <Row gutter={[16, 16]}>
                                                    {propertyOverviewMap.map(item => {
                                                        let val = property[item.key];
                                                        if (item.key === 'launchDate' || item.key === 'completionDate') {
                                                            val = val ? new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Ready';
                                                        } else if (item.key === 'parkingAvailable') {
                                                            val = isParkingAvailable;
                                                        } else if (!val || val === 'null') {
                                                            val = 'N/A';
                                                        }
                                                        return (
                                                            <Col xs={24} sm={12} md={8} key={item.key}>
                                                                <div style={{
                                                                    background: '#f8fafc',
                                                                    padding: '14px 16px',
                                                                    borderRadius: 12,
                                                                    border: '1px solid #e2e8f0',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 12,
                                                                    height: '100%'
                                                                }}>
                                                                    <div style={{
                                                                        width: 42,
                                                                        height: 42,
                                                                        borderRadius: 10,
                                                                        background: '#fff3eb',
                                                                        color: '#ea580c',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 18,
                                                                        flexShrink: 0
                                                                    }}>
                                                                        {item.icon}
                                                                    </div>
                                                                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                                            {item.label}
                                                                        </div>
                                                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                            {val} {item.unit && val !== 'N/A' ? item.unit : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                        )
                                    },
                                    {
                                        key: '2',
                                        label: <span style={{ fontWeight: 800, fontSize: '0.95rem' }}><SearchOutlined /> Detailed Overview</span>,
                                        children: (
                                            <div style={{ paddingTop: 12 }}>
                                                {property.longDescription || property.shortDescription ? (
                                                    <List
                                                        dataSource={(property.longDescription || property.shortDescription)
                                                            .split('\n')
                                                            .filter(item => item.trim() !== '')}
                                                        renderItem={item => (
                                                            <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                                                <Space align="start">
                                                                    <ThunderboltOutlined style={{ color: '#ea580c', marginTop: 4 }} />
                                                                    <Text style={{ fontSize: '0.98rem', color: '#334155', lineHeight: 1.7 }}>{item.trim()}</Text>
                                                                </Space>
                                                            </List.Item>
                                                        )}
                                                    />
                                                ) : (
                                                    <Empty description="No detailed description available." />
                                                )}
                                            </div>
                                        )
                                    },
                                    {
                                        key: '3',
                                        label: <span style={{ fontWeight: 800, fontSize: '0.95rem' }}><ToolOutlined /> Amenities & Features</span>,
                                        children: (
                                            <div style={{ paddingTop: 16 }}>
                                                {property.amenities?.length > 0 ? (
                                                    <Row gutter={[16, 16]}>
                                                        {property.amenities.map((item, idx) => (
                                                            <Col xs={12} sm={8} md={6} key={idx}>
                                                                <div style={{
                                                                    background: '#f8fafc',
                                                                    padding: '16px',
                                                                    borderRadius: 12,
                                                                    border: '1px solid #e2e8f0',
                                                                    textAlign: 'center',
                                                                    height: '100%'
                                                                }}>
                                                                    <Image src={resolveImage(item.iconUrl)} alt={item.name} width={36} preview={false} style={{ marginBottom: 8 }} />
                                                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{item.name}</div>
                                                                    {item.value && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.value}</div>}
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ) : (
                                                    <Empty description="No specific amenities listed for this property." />
                                                )}
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </Card>

                        {/* --- FLOOR PLANS & LAYOUT MAPS --- */}
                        {(property.floorPlans?.length > 0 || property.layoutMaps?.length > 0) && (
                            <Card 
                                title={<span style={{ fontWeight: 800, color: '#0f172a' }}><BlockOutlined style={{ marginRight: 8, color: '#ea580c' }} />Floor Plans & Site Layouts</span>} 
                                bordered={false} 
                                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', marginBottom: 24, border: '1px solid #e2e8f0' }}
                            >
                                <Row gutter={[16, 16]}>
                                    {property.floorPlans?.map((plan, idx) => (
                                        <Col xs={24} md={12} key={`plan-${idx}`}>
                                            <Card hoverable cover={plan.photo && <Image src={resolveImage(plan.photo)} alt="Floor Plan" style={{ width: '100%', height: 200, objectFit: 'cover' }} preview={false} />}>
                                                <Card.Meta title={`${plan.floorName || 'Floor Plan'} ${plan.towerName ? `(Tower ${plan.towerName})` : ''}`} description={plan.shortDescription} />
                                                {plan.priceRange && <Text strong style={{ marginTop: 8, display: 'block', color: '#ea580c' }}>Price: {plan.priceRange}</Text>}
                                            </Card>
                                        </Col>
                                    ))}
                                    {property.layoutMaps?.filter(m => m.imageUrl).map((map, idx) => (
                                        <Col xs={24} md={12} key={`map-${idx}`}>
                                            <Image src={resolveImage(map.imageUrl)} alt="Layout Map" style={{ width: '100%', borderRadius: 12 }} />
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        )}

                        {/* --- LOCATION & GOOGLE MAP --- */}
                        <Card 
                            title={<span style={{ fontWeight: 800, color: '#0f172a' }}><GlobalOutlined style={{ marginRight: 8, color: '#ea580c' }} />Location & Nearby Infrastructure</span>} 
                            bordered={false} 
                            style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', marginBottom: 24, border: '1px solid #e2e8f0' }}
                        >
                            <Row gutter={[20, 20]}>
                                <Col xs={24} md={12}>
                                    {property.latitude && property.longitude ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                                            style={{ width: "100%", height: 320, border: 0, borderRadius: 12 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title="Google Map Location"
                                        />
                                    ) : (
                                        <div style={{ height: 250, background: '#f8fafc', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px border-dashed #cbd5e1' }}>
                                            <Text type="secondary">📍 Location Map Pin Available on Request</Text>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={24} md={12}>
                                    {property.nearbyFacilities?.length > 0 ? (
                                        <List
                                            header={<div style={{ fontWeight: 800, color: '#0f172a' }}>Key Distance Landmarks</div>}
                                            dataSource={property.nearbyFacilities}
                                            renderItem={item => (
                                                <List.Item style={{ padding: '10px 0' }}>
                                                    <Space>
                                                        {facilityIconMap[item.facilityType] || <FaMapMarkerAlt style={{ color: '#ea580c' }} />}
                                                        <div>
                                                            <Text strong style={{ color: '#0f172a' }}>{item.facilityName}</Text>
                                                            <Tag color="orange" style={{ marginLeft: 8, fontWeight: 700, borderRadius: 4 }}>{item.distance}</Tag>
                                                        </div>
                                                    </Space>
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Empty description="No nearby facility distance tags listed." />
                                    )}
                                </Col>
                            </Row>
                        </Card>

                        {/* --- SIMILAR PROPERTIES --- */}
                        <Card 
                            title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Similar Verified Listings</span>} 
                            bordered={false} 
                            style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}
                        >
                            {similarLoading ? (
                                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                    <Spin />
                                </div>
                            ) : similarProperties.length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {similarProperties.map((similarProp, index) => (
                                        <Col xs={24} sm={12} md={6} key={similarProp.id || `similar-${index}`}>
                                            <SimilarPropertyItem property={similarProp} resolveImage={resolveImage} />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Empty description="No similar properties currently available." />
                            )}
                        </Card>
                    </Col>

                    {/* ----- SIDEBAR COLUMN (Right 8 Grid) ----- */}
                    <Col xs={24} lg={8}>
                        <div style={{ position: 'sticky', top: 24 }}>
                            {/* --- CONTACT OWNER / BROKER CARD --- */}
                            <Card 
                                bordered={false} 
                                style={{ 
                                    borderRadius: 16, 
                                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', 
                                    marginBottom: 20, 
                                    border: '1px solid #e2e8f0',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#ea580c', marginBottom: 10, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }} />
                                    <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Contact Property Owner</Title>
                                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>Direct Owner / Verified Partner Inquiry</Text>
                                </div>

                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        block 
                                        icon={<MailOutlined />} 
                                        onClick={() => {
                                            Swal.fire({
                                                title: "Enquire to Get Owner Details",
                                                html: `
                                                    <input type="text" id="leadName" class="swal2-input" placeholder="Your Name *">
                                                    <input type="tel" id="leadPhone" class="swal2-input" placeholder="Phone Number *">
                                                    <input type="email" id="leadEmail" class="swal2-input" placeholder="Email Address">
                                                    <textarea id="leadMessage" class="swal2-textarea" placeholder="Your Message / Query"></textarea>
                                                `,
                                                focusConfirm: false,
                                                showCancelButton: true,
                                                confirmButtonText: "Submit Inquiry",
                                                confirmButtonColor: "#ea580c",
                                                cancelButtonText: "Cancel",
                                                preConfirm: () => {
                                                    const name = document.getElementById("leadName").value.trim();
                                                    const phone = document.getElementById("leadPhone").value.trim();
                                                    if (!name || !phone) {
                                                        Swal.showValidationMessage("Please enter Name and Phone");
                                                        return false;
                                                    }
                                                    return { 
                                                        name, 
                                                        phone, 
                                                        email: document.getElementById("leadEmail").value.trim(), 
                                                        message: document.getElementById("leadMessage").value.trim() 
                                                    };
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
                                                        Swal.fire("Success", "Your inquiry has been sent! We will share owner details shortly.", "success");
                                                    } catch (err) {
                                                        Swal.fire("Error", "Unable to send your details. Try again later.", "error");
                                                    }
                                                }
                                            });
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                            borderColor: '#ea580c',
                                            height: 46,
                                            fontWeight: 800,
                                            borderRadius: 10,
                                            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                                        }}
                                    >
                                        Get Owner Details
                                    </Button>

                                    <Button 
                                        size="large" 
                                        block 
                                        icon={<CheckCircleOutlined />} 
                                        onClick={handleVerifyAvailability}
                                        style={{ height: 44, fontWeight: 700, borderRadius: 10, borderColor: '#3b82f6', color: '#3b82f6' }}
                                    >
                                        Verify Availability
                                    </Button>

                                    <Button 
                                        size="large" 
                                        block 
                                        icon={<CalendarOutlined />} 
                                        onClick={handleScheduleVisit}
                                        style={{ height: 44, fontWeight: 700, borderRadius: 10, background: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}
                                    >
                                        Schedule Site Tour
                                    </Button>

                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none' }}>
                                                <Button size="large" block icon={<PhoneOutlined />} style={{ borderRadius: 8, fontWeight: 700 }}>
                                                    Call Now
                                                </Button>
                                            </a>
                                        </Col>
                                        <Col span={12}>
                                            <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hello, I am interested in property #${property.id}: ${property.title}. Please provide more details.`)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                <Button size="large" block icon={<WhatsAppOutlined style={{ color: '#25D366' }} />} style={{ borderRadius: 8, fontWeight: 700 }}>
                                                    WhatsApp
                                                </Button>
                                            </a>
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>

                            {/* --- ACTIVITY & ENGAGEMENT WIDGET --- */}
                            <Card 
                                bordered={false} 
                                style={{ 
                                    borderRadius: 16, 
                                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', 
                                    marginBottom: 20, 
                                    border: '1px solid #e2e8f0' 
                                }}
                            >
                                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 12, fontSize: '0.95rem' }}>
                                    Activity & Buyer Interest
                                </div>
                                <Row gutter={[12, 12]} justify="space-between">
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: 10 }}>
                                            <EyeOutlined style={{ fontSize: 20, color: '#ea580c' }} />
                                            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{property.views || 903}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Views</div>
                                        </div>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: 10 }}>
                                            <HeartOutlined style={{ fontSize: 20, color: '#ef4444' }} />
                                            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{property.shortlists || 15}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Saved</div>
                                        </div>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: 10 }}>
                                            <PhoneOutlined style={{ fontSize: 20, color: '#10b981' }} />
                                            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{property.contacts || 24}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Inquiries</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* --- USEFUL SERVICES CARD --- */}
                            <Card 
                                bordered={false} 
                                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}
                            >
                                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 12, fontSize: '0.95rem' }}>
                                    Useful Services & Tools
                                </div>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button size="large" block icon={<DownloadOutlined />} style={{ borderRadius: 8, fontWeight: 700 }}>
                                        Download Brochure PDF
                                    </Button>
                                    <Button size="large" block icon={<SolutionOutlined />} style={{ borderRadius: 8, fontWeight: 700 }}>
                                        Apply for Home Loan Assistance
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
